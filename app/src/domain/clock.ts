// The clock, derived from when the sitting started.
//
// Remaining time is never stored as a countdown. It is always computed from the
// start time and the limit, which is what makes three separate edge cases the
// same case: a tab closed for ninety minutes, two tabs open on one attempt, and
// a machine with a wrong system clock. None of them can disagree with the
// others, because none of them holds a clock — they all ask this module.
//
// `now` is a parameter everywhere. Nothing here reads the current time, which
// is what lets "the tab was closed for ninety minutes" be a test that runs in a
// millisecond.

/** 90 minutes, the real exam's limit. */
export const EXAM_TIME_LIMIT_SECONDS = 90 * 60;

/** 60 minutes: the holdout is 40 questions, timed pro rata with the exam. */
export const HOLDOUT_TIME_LIMIT_SECONDS = 60 * 60;

export interface TimedSitting {
  startedAt: Date;
  /** `null` for practice and domain sittings: no clock, and no expiry, ever. */
  timeLimitSeconds: number | null;
}

/**
 * The instant this sitting closes, or `null` if it never does.
 *
 * This is what the server sends the browser. The browser counts down to it for
 * display; it is never sent back, and never trusted if it were.
 */
export function deadlineOf({ startedAt, timeLimitSeconds }: TimedSitting): Date | null {
  if (timeLimitSeconds === null) return null;
  return new Date(startedAt.getTime() + timeLimitSeconds * 1000);
}

/**
 * Seconds left, or `null` when there is no clock.
 *
 * Goes **negative** past the deadline rather than clamping at zero. Clamping
 * would throw away the difference between "submit this now" and "this should
 * have been submitted an hour ago", and the second is the case that matters:
 * it is what an abandoned first attempt looks like when it is finally read.
 *
 * Never exceeds the limit, even if `now` precedes the start — a machine with a
 * wrong clock changes what the countdown says, and nothing about when the
 * attempt actually closes.
 */
export function remainingSeconds(sitting: TimedSitting, now: Date): number | null {
  const { startedAt, timeLimitSeconds } = sitting;
  if (timeLimitSeconds === null) return null;
  const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
  return timeLimitSeconds - Math.max(0, elapsed);
}

/**
 * Whether the sitting is over.
 *
 * True **at** the deadline, not one second after it. A sitting with no limit is
 * never expired, however long ago it started — which is why an abandoned
 * practice session can sit unfinished in the database indefinitely without
 * becoming a problem to clean up.
 */
export function hasExpired(sitting: TimedSitting, now: Date): boolean {
  const remaining = remainingSeconds(sitting, now);
  if (remaining === null) return false;
  return remaining <= 0;
}

// ---------------------------------------------------------------------------
// The display half.
//
// Which band the countdown is in, how it is written out, and how a browser
// whose own clock is wrong is put back on the real one. All of it pure, and
// all of it here rather than in the component that shows it: a band and a
// formatted time are decisions about a number, and doc 03 §4 keeps those in
// one testable place.
// ---------------------------------------------------------------------------

/**
 * The two thresholds, in seconds, exported by `design/tokens.css` as
 * `--clock-threshold-warning` and `--clock-threshold-critical`.
 *
 * Duplicated here because CSS custom properties cannot be read by a pure
 * function, and a component asking the DOM for them would be doing layout work
 * to decide a number. The duplication is not left to trust: the unit suite
 * parses the token file and asserts these two match it, so the ramp on screen
 * and the ramp in the code cannot drift.
 */
export const CLOCK_WARNING_SECONDS = 1200;
export const CLOCK_CRITICAL_SECONDS = 300;

export type ClockBand = 'normal' | 'warning' | 'critical';

/**
 * Seconds left when all you hold is the instant the sitting closes.
 *
 * This is the browser's half of the derived clock. It is given an absolute
 * deadline and nothing else — not `started_at`, not the limit — because those
 * are the server's and a client that held them could be argued with about what
 * they mean.
 *
 * **Rounds up**, unlike `remainingSeconds`, and the two still agree exactly:
 * the difference only shows within a second, where rounding down would make
 * the countdown appear to skip its first tick the moment the page loaded.
 * Goes negative past the deadline for the same reason as its counterpart.
 */
export function remainingToDeadline(deadline: Date | null, now: Date): number | null {
  if (deadline === null) return null;
  return Math.ceil((deadline.getTime() - now.getTime()) / 1000);
}

/**
 * Which of doc 05 §9's three states the countdown is in.
 *
 * Critical is *sticky past zero*: an expired sitting reads critical, never
 * back round to normal. The ramp is weight as much as hue — quiet ink, a
 * tinted chip, then a solid fill — and the time is always written out
 * numerically beside it, because a glance at a colour is not a reading.
 */
export function clockBand(remaining: number | null): ClockBand {
  if (remaining === null) return 'normal';
  // Doc 05 §9's rows are `> 20:00`, `20:00 → 5:00`, `< 5:00`: the warning row is
  // inclusive at *both* ends, so 20:00 and 05:00 both read warning and 04:59 is
  // the first critical second. The asymmetry between these two comparisons is
  // the table, not a slip.
  if (remaining < CLOCK_CRITICAL_SECONDS) return 'critical';
  if (remaining <= CLOCK_WARNING_SECONDS) return 'warning';
  return 'normal';
}

/**
 * The countdown as it is read: `MM:SS`, zero-padded, never negative.
 *
 * `remainingSeconds` goes negative on purpose — that is what distinguishes
 * "submit this now" from "this should have been submitted an hour ago" — but
 * that distinction is for the code, not the reader. On screen the clock stops
 * at `00:00`, which is what the acceptance criterion asks for in as many
 * words.
 */
export function formatRemaining(remaining: number | null): string {
  if (remaining === null) return '';
  const clamped = Math.max(0, remaining);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * How far the browser's clock is from the server's, in milliseconds.
 *
 * Positive when the browser is running slow. The server's `now` arrives with
 * every render and every resync; the browser's is read at the same moment, and
 * the difference is applied to every tick afterwards.
 *
 * This corrects the **display only**. Expiry is decided on the server from
 * `started_at`, so a machine with a wrong clock was never able to sit longer —
 * it was only able to be lied to about how long it had left. This is what
 * stops the lie.
 */
export function skewMillis(serverNow: Date, browserNow: Date): number {
  return serverNow.getTime() - browserNow.getTime();
}

/**
 * Skew measured across a request, discounting the journey.
 *
 * `skewMillis` compares the server's instant with the browser's clock at the
 * moment the answer *arrived*, which quietly folds the whole journey into the
 * skew: with a perfectly correct browser clock it still reports a non-zero
 * number, and it errs in the direction that flatters the candidate — the
 * corrected `now` sits behind the true one, so the countdown reads more time
 * than remains.
 *
 * Cristian's assumption fixes most of it: if the two legs of the trip take
 * about the same time, the server stamped its instant at the midpoint between
 * sending and receiving. The assumption is not always true, but the error it
 * leaves is at most **half** the round trip rather than all of it.
 *
 * None of this can move the deadline. It is the difference between a display
 * that is a few hundred milliseconds generous and one that is not.
 */
export function skewOverRoundTrip(serverNow: Date, sentAt: Date, receivedAt: Date): number {
  const midpoint = (sentAt.getTime() + receivedAt.getTime()) / 2;
  return serverNow.getTime() - midpoint;
}

/** The browser's own `now`, moved onto the server's timeline. */
export function correctedNow(browserNow: Date, skew: number): Date {
  return new Date(browserNow.getTime() + skew);
}
