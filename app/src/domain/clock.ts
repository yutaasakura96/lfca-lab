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
