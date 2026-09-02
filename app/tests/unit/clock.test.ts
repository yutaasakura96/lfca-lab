import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  CLOCK_CRITICAL_SECONDS,
  CLOCK_WARNING_SECONDS,
  EXAM_TIME_LIMIT_SECONDS,
  HOLDOUT_TIME_LIMIT_SECONDS,
  clockBand,
  correctedNow,
  remainingToDeadline,
  deadlineOf,
  formatRemaining,
  hasExpired,
  remainingSeconds,
  skewMillis,
  skewOverRoundTrip,
} from '../../src/domain/clock.ts';

const here = fileURLToPath(new URL('.', import.meta.url));

// The clock is derived, never stored. Everything here takes `now` as an
// argument, which is the whole reason "the tab was closed for ninety minutes"
// is a test that runs in a millisecond instead of ninety minutes.

const startedAt = new Date('2026-09-05T18:00:00.000Z');
const at = (iso: string) => new Date(iso);

const exam = { startedAt, timeLimitSeconds: EXAM_TIME_LIMIT_SECONDS };
const holdout = { startedAt, timeLimitSeconds: HOLDOUT_TIME_LIMIT_SECONDS };
const practice = { startedAt, timeLimitSeconds: null };

describe('the limits', () => {
  it('are 90 minutes for an exam and 60 for the holdout', () => {
    expect(EXAM_TIME_LIMIT_SECONDS).toBe(90 * 60);
    expect(HOLDOUT_TIME_LIMIT_SECONDS).toBe(60 * 60);
  });
});

describe('the deadline', () => {
  it('is the start plus the limit', () => {
    expect(deadlineOf(exam)?.toISOString()).toBe('2026-09-05T19:30:00.000Z');
    expect(deadlineOf(holdout)?.toISOString()).toBe('2026-09-05T19:00:00.000Z');
  });

  it('does not exist for a sitting with no clock', () => {
    expect(deadlineOf(practice)).toBeNull();
  });
});

describe('remaining time', () => {
  it('is the full limit at the moment of starting', () => {
    expect(remainingSeconds(exam, startedAt)).toBe(5400);
  });

  it('counts down with wall-clock time', () => {
    expect(remainingSeconds(exam, at('2026-09-05T18:30:00.000Z'))).toBe(3600);
    expect(remainingSeconds(exam, at('2026-09-05T19:29:59.000Z'))).toBe(1);
  });

  it('is zero at the deadline, not one second either side', () => {
    expect(remainingSeconds(exam, at('2026-09-05T19:30:00.000Z'))).toBe(0);
  });

  it('goes negative past the deadline rather than clamping', () => {
    // Clamping at zero would lose the information that this attempt is long
    // over — which is exactly what distinguishes "submit it now" from
    // "it should have been submitted an hour ago".
    expect(remainingSeconds(exam, at('2026-09-05T20:30:00.000Z'))).toBe(-3600);
  });

  it('is null for a sitting with no clock, at any moment', () => {
    expect(remainingSeconds(practice, startedAt)).toBeNull();
    expect(remainingSeconds(practice, at('2030-01-01T00:00:00.000Z'))).toBeNull();
  });
});

describe('expiry', () => {
  it('has not happened one second before the deadline', () => {
    expect(hasExpired(exam, at('2026-09-05T19:29:59.000Z'))).toBe(false);
  });

  it('has happened at the deadline', () => {
    expect(hasExpired(exam, at('2026-09-05T19:30:00.000Z'))).toBe(true);
  });

  // The tab-closed case, which is the reason the clock is derived at all.
  it('has happened when the tab was closed for ninety minutes', () => {
    expect(hasExpired(exam, at('2026-09-05T21:00:00.000Z'))).toBe(true);
  });

  it('never happens without a limit, however long it has been', () => {
    expect(hasExpired(practice, at('2099-01-01T00:00:00.000Z'))).toBe(false);
  });
});

describe('the clock cannot be extended', () => {
  // There is no code path that adds time. Asserted by exhausting the inputs:
  // the only things these functions take are the start, the limit and now, and
  // remaining time is a function of exactly those three.
  it('gives the same answer for the same three inputs, every time', () => {
    const now = at('2026-09-05T18:42:00.000Z');
    const first = remainingSeconds(exam, now);
    for (let i = 0; i < 100; i += 1) expect(remainingSeconds(exam, now)).toBe(first);
  });

  it('never returns more than the limit, even if now precedes the start', () => {
    // A machine with a wrong clock reporting a `now` before the attempt began
    // must not be handed extra time.
    expect(remainingSeconds(exam, at('2026-09-05T17:00:00.000Z'))).toBe(5400);
  });

  it('is monotonic — later never means more time left', () => {
    const moments = [
      '2026-09-05T18:00:00.000Z',
      '2026-09-05T18:30:00.000Z',
      '2026-09-05T19:00:00.000Z',
      '2026-09-05T19:30:00.000Z',
      '2026-09-05T20:00:00.000Z',
    ].map(at);
    const remaining = moments.map((m) => remainingSeconds(exam, m) as number);
    for (let i = 1; i < remaining.length; i += 1) {
      expect(remaining[i] as number).toBeLessThan(remaining[i - 1] as number);
    }
  });
});

// ---------------------------------------------------------------------------
// The display half: which band the countdown is in, how it is written out, and
// how a browser with a wrong clock is corrected against the server.
//
// These are as pure as the rest — `now` is still a parameter — because the
// alternative is a component that decides a number, and doc 03 §4 puts every
// such decision here.
// ---------------------------------------------------------------------------

describe('the clock bands', () => {
  it('match the thresholds the design tokens export', () => {
    // The tokens file is the source of truth for every visual value, and these
    // two are *machine-readable* thresholds it exports for exactly this
    // purpose (doc 05 §9). Reading them back is what stops the ramp on screen
    // and the ramp in the code drifting apart.
    const tokens = readFileSync(join(here, '..', '..', 'src', 'styles', 'tokens.css'), 'utf8');
    const secondsOf = (name: string) => {
      const found = new RegExp(`--clock-threshold-${name}:\\s*(\\d+)s`).exec(tokens);
      if (found === null) throw new Error(`tokens.css has no --clock-threshold-${name}`);
      return Number(found[1]);
    };
    expect(CLOCK_WARNING_SECONDS).toBe(secondsOf('warning'));
    expect(CLOCK_CRITICAL_SECONDS).toBe(secondsOf('critical'));
  });

  it('is normal above twenty minutes', () => {
    expect(clockBand(EXAM_TIME_LIMIT_SECONDS)).toBe('normal');
    expect(clockBand(1201)).toBe('normal');
  });

  it('turns to warning at twenty minutes exactly, not a second later', () => {
    // Doc 05 §9 writes the bands as `> 20:00`, `20:00 → 5:00`, `< 5:00`. The
    // warning row is inclusive at its upper end, so 20:00 itself is warning.
    expect(clockBand(1200)).toBe('warning');
    expect(clockBand(301)).toBe('warning');
  });

  it('holds warning at five minutes exactly, and turns critical below it', () => {
    // The other end of that same row is inclusive too — `< 5:00` is strict, so
    // 05:00 on the display still reads warning and 04:59 is the first critical
    // second. One second, and it is the one the table is explicit about.
    expect(clockBand(300)).toBe('warning');
    expect(clockBand(299)).toBe('critical');
    expect(clockBand(1)).toBe('critical');
  });

  it('stays critical at zero and past it', () => {
    // Never falls back to normal once the time is gone. A clock that read
    // "normal" at −1 second would be telling the reader the opposite of what
    // is true.
    expect(clockBand(0)).toBe('critical');
    expect(clockBand(-3600)).toBe('critical');
  });

  it('is normal when there is no clock at all', () => {
    expect(clockBand(null)).toBe('normal');
  });
});

describe('writing the countdown out', () => {
  it('writes the full ninety minutes as the sitting begins', () => {
    expect(formatRemaining(EXAM_TIME_LIMIT_SECONDS)).toBe('90:00');
  });

  it('zero-pads minutes and seconds', () => {
    expect(formatRemaining(599)).toBe('09:59');
    expect(formatRemaining(61)).toBe('01:01');
    expect(formatRemaining(9)).toBe('00:09');
  });

  it('never shows a negative countdown', () => {
    // The acceptance criterion in its own words: reaching zero shows zero,
    // rather than counting on into the negative. `remainingSeconds` still
    // goes negative — that distinction is what tells an expired sitting from
    // one that just closed — but nobody reads a minus sign here.
    expect(formatRemaining(0)).toBe('00:00');
    expect(formatRemaining(-1)).toBe('00:00');
    expect(formatRemaining(-3600)).toBe('00:00');
  });

  it('writes nothing for a sitting with no clock', () => {
    expect(formatRemaining(null)).toBe('');
  });
});

describe('correcting a browser clock against the server', () => {
  const server = at('2026-09-05T18:00:00.000Z');

  it('is no correction at all when the two agree', () => {
    expect(skewMillis(server, at('2026-09-05T18:00:00.000Z'))).toBe(0);
  });

  it('is positive when the browser is running slow', () => {
    // The browser thinks it is 17:55; the server says 18:00. Five minutes must
    // be *added* to what the browser reads.
    expect(skewMillis(server, at('2026-09-05T17:55:00.000Z'))).toBe(300_000);
  });

  it('is negative when the browser is running fast', () => {
    expect(skewMillis(server, at('2026-09-05T18:05:00.000Z'))).toBe(-300_000);
  });

  it('puts a badly wrong clock back on the real countdown', () => {
    // The case the criterion names: a machine whose clock is a year out. What
    // it changes is what the countdown says, and nothing about when the
    // sitting closes — so once corrected, the remaining time is the truth.
    const browserNow = at('2027-01-01T00:00:00.000Z');
    const skew = skewMillis(at('2026-09-05T18:30:00.000Z'), browserNow);
    expect(remainingSeconds(exam, correctedNow(browserNow, skew))).toBe(3600);
  });

  it('cannot be used to buy time, however wrong the browser is', () => {
    // Winding the machine's clock backwards is the obvious attempt. The skew
    // measured against the server cancels it exactly, so the countdown is
    // unmoved — and the server refuses the write regardless.
    const honest = at('2026-09-05T19:00:00.000Z');
    const wound = at('2026-09-05T09:00:00.000Z');
    const skew = skewMillis(honest, wound);
    expect(correctedNow(wound, skew).getTime()).toBe(honest.getTime());
  });
});

describe('counting down to a deadline', () => {
  // The browser is given an absolute instant and nothing else — not the start
  // time, not the limit. This is the arithmetic it runs, and it lives here
  // rather than in the component so that the one thing on screen everybody
  // watches is decided by a tested function.
  const deadline = at('2026-09-05T19:30:00.000Z');

  it('is the whole limit at the moment of starting', () => {
    expect(remainingToDeadline(deadline, at('2026-09-05T18:00:00.000Z'))).toBe(5400);
  });

  it('rounds up, so the first second of the sitting reads as the full time', () => {
    // Half a second in, 89:59.5 is left. Rounding down would show 89:59 while
    // the ninetieth minute is still running, and the clock would appear to
    // skip its first second the instant the page loaded.
    expect(remainingToDeadline(deadline, at('2026-09-05T18:00:00.500Z'))).toBe(5400);
    expect(remainingToDeadline(deadline, at('2026-09-05T18:00:01.000Z'))).toBe(5399);
  });

  it('is zero at the deadline exactly', () => {
    expect(remainingToDeadline(deadline, deadline)).toBe(0);
  });

  it('goes negative past it, as the sitting does', () => {
    expect(remainingToDeadline(deadline, at('2026-09-05T20:30:00.000Z'))).toBe(-3600);
  });

  it('agrees with the sitting it was derived from, second for second', () => {
    // The two are computed from different inputs — one from `started_at` and a
    // limit on the server, one from an instant in the browser — and they must
    // never disagree, because that disagreement is what a user would
    // experience as a clock that jumped.
    for (const iso of [
      '2026-09-05T18:00:00.000Z',
      '2026-09-05T18:44:12.000Z',
      '2026-09-05T19:29:59.000Z',
      '2026-09-05T19:30:00.000Z',
    ]) {
      expect(remainingToDeadline(deadlineOf(exam), at(iso))).toBe(remainingSeconds(exam, at(iso)));
    }
  });

  it('does not count down to a deadline that does not exist', () => {
    expect(remainingToDeadline(null, at('2026-09-05T18:00:00.000Z'))).toBeNull();
  });
});

describe('measuring skew over a round trip', () => {
  // `skewMillis` compares the server's instant with the browser's clock *at the
  // moment the answer arrived* — so the whole journey lands in the skew. With a
  // perfectly correct browser clock that yields a non-zero skew, and it errs in
  // the one direction that matters: the corrected `now` sits behind the true
  // one, and the countdown shows more time than remains.
  it('is what the naive measurement gets wrong', () => {
    const sentAt = at('2026-09-05T18:00:00.000Z');
    const serverStamped = at('2026-09-05T18:00:00.200Z');
    const receivedAt = at('2026-09-05T18:00:00.400Z');

    // The browser clock here is exactly right, so the honest answer is 0.
    expect(skewMillis(serverStamped, receivedAt)).toBe(-200);
    expect(skewOverRoundTrip(serverStamped, sentAt, receivedAt)).toBe(0);
  });

  it('still finds a genuinely wrong clock, round trip and all', () => {
    // Browser five minutes fast, 400ms round trip. The five minutes is the
    // signal; the 400ms is not, and only the five minutes should survive.
    const sentAt = at('2026-09-05T18:05:00.000Z');
    const serverStamped = at('2026-09-05T18:00:00.200Z');
    const receivedAt = at('2026-09-05T18:05:00.400Z');
    expect(skewOverRoundTrip(serverStamped, sentAt, receivedAt)).toBe(-300_000);
  });

  it('assumes the journey is symmetric, and says so by halving it', () => {
    // Cristian's assumption. It is not always true, but the error it leaves is
    // at most half the round trip rather than all of it — and on a 90-minute
    // clock that is the difference between milliseconds and nothing at all.
    const sentAt = at('2026-09-05T18:00:00.000Z');
    const receivedAt = at('2026-09-05T18:00:01.000Z');
    expect(skewOverRoundTrip(at('2026-09-05T18:00:00.500Z'), sentAt, receivedAt)).toBe(0);
  });

  it('cannot be gamed into granting time by a slow reply', () => {
    // The worst case: the reply is delayed so the midpoint is wrong. The error
    // is bounded by half the round trip, so even a two-second reply moves the
    // countdown by at most a second — and the deadline itself is untouched.
    const sentAt = at('2026-09-05T18:00:00.000Z');
    const receivedAt = at('2026-09-05T18:00:02.000Z');
    const skew = skewOverRoundTrip(at('2026-09-05T18:00:00.000Z'), sentAt, receivedAt);
    expect(Math.abs(skew)).toBeLessThanOrEqual(1000);
  });
});
