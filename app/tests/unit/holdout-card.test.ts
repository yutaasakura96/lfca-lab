import { describe, expect, it } from 'vitest';
import { holdoutCard, utcDay } from '../../src/domain/holdout.ts';

// Home's holdout card, as data (#60).
//
// Three states and no fourth. The one that matters is the last: once sat, the
// card is the result for good and never offers Start again — so these assert
// the returned shape exactly, and a state that grew a start action would fail
// here rather than on a screen nobody looks at twice.

const SAT_AT = new Date('2026-10-04T08:15:00.000Z');

function sat(score: number) {
  return { attemptId: 'a-sat', score, questionCount: 40, submittedAt: SAT_AT };
}

describe('the holdout card', () => {
  it('offers the start when no holdout sitting exists', () => {
    expect(holdoutCard({ openId: null, sat: null })).toEqual({ kind: 'never' });
  });

  it('offers the running sitting back, and nothing else, while one is open', () => {
    expect(holdoutCard({ openId: 'a-open', sat: null })).toEqual({
      kind: 'running',
      attemptId: 'a-open',
    });
  });

  it('is the result once sat — pass at exactly 30 of 40', () => {
    expect(holdoutCard({ openId: null, sat: sat(30) })).toEqual({
      kind: 'sat',
      attemptId: 'a-sat',
      score: 30,
      questionCount: 40,
      passMark: 30,
      passed: true,
      day: '2026-10-04',
    });
  });

  it('fails at 29 and passes at 31, against the pro-rata mark rather than 45', () => {
    const at29 = holdoutCard({ openId: null, sat: sat(29) });
    const at31 = holdoutCard({ openId: null, sat: sat(31) });
    expect(at29).toMatchObject({ kind: 'sat', passed: false, passMark: 30 });
    expect(at31).toMatchObject({ kind: 'sat', passed: true, passMark: 30 });
  });

  // Both at once is a state `one_holdout_per_user` makes impossible. If it were
  // ever found, the card answers as the start endpoint does: sat wins, because
  // the honest answer to "may I start the holdout?" is still no.
  it('reads as the result, not as resumable, if both were ever true', () => {
    expect(holdoutCard({ openId: 'a-open', sat: sat(28) })).toMatchObject({
      kind: 'sat',
      attemptId: 'a-sat',
    });
  });
});

describe('the day a holdout was sat', () => {
  it('is the UTC calendar day, as every other time on these screens is', () => {
    expect(utcDay(new Date('2026-10-04T23:59:59.999Z'))).toBe('2026-10-04');
    expect(utcDay(new Date('2026-10-05T00:00:00.000Z'))).toBe('2026-10-05');
  });
});
