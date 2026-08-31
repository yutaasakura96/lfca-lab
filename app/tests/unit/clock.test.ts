import { describe, expect, it } from 'vitest';
import {
  EXAM_TIME_LIMIT_SECONDS,
  HOLDOUT_TIME_LIMIT_SECONDS,
  deadlineOf,
  hasExpired,
  remainingSeconds,
} from '../../src/domain/clock.ts';

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
