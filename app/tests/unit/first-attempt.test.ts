import { describe, expect, it } from 'vitest';
import { claimsFirstAttempt } from '../../src/domain/first-attempt.ts';
import {
  allowsFlagging,
  ATTEMPT_MODES,
  HOLDOUT_QUESTION_COUNT,
  isScored,
  questionCountFor,
  timeLimitFor,
} from '../../src/domain/modes.ts';

describe('claiming the first-attempt flag', () => {
  it('is claimed by the earliest exam sitting', () => {
    expect(claimsFirstAttempt('exam', false)).toBe(true);
  });

  it('is refused once an earlier sitting of that paper exists', () => {
    expect(claimsFirstAttempt('exam', true)).toBe(false);
  });

  it('is never claimed outside exam mode, earlier sitting or not', () => {
    for (const mode of ['practice', 'domain', 'holdout'] as const) {
      expect(claimsFirstAttempt(mode, false), mode).toBe(false);
      expect(claimsFirstAttempt(mode, true), mode).toBe(false);
    }
  });

  // The scenario the rule exists for, written out as the sequence it actually
  // happens in. Sit paper 07 and abandon it; sit it again the next day and
  // finish that one first. Deciding at creation is what keeps the flag on the
  // abandoned sitting, where it belongs, no matter which is finalised first.
  it('stays with the earliest sitting even when a later one finishes first', () => {
    const abandoned = claimsFirstAttempt('exam', false); // created Monday
    const second = claimsFirstAttempt('exam', true); //     created Tuesday
    expect(abandoned).toBe(true);
    expect(second).toBe(false);
    // Finalisation order is not an input here, and that is the point: there is
    // no argument this function could take that would let submitting change it.
    expect(claimsFirstAttempt.length).toBe(2);
  });
});

describe('what each mode implies', () => {
  it('times exam and holdout, and nothing else', () => {
    expect(timeLimitFor('exam')).toBe(5400);
    expect(timeLimitFor('holdout')).toBe(3600);
    expect(timeLimitFor('practice')).toBeNull();
    expect(timeLimitFor('domain')).toBeNull();
  });

  it('scores exactly the modes it times', () => {
    for (const mode of ATTEMPT_MODES) {
      expect(isScored(mode), mode).toBe(timeLimitFor(mode) !== null);
    }
  });

  it('allows flagging exactly where navigation is free', () => {
    // Deliberately asserted mode by mode rather than against `isScored`. The
    // two agree today, and writing the assertion as a comparison would make a
    // future divergence pass silently — which is the whole reason flagging has
    // its own predicate.
    expect(allowsFlagging('exam')).toBe(true);
    expect(allowsFlagging('holdout')).toBe(true);
    expect(allowsFlagging('practice')).toBe(false);
    expect(allowsFlagging('domain')).toBe(false);
  });

  it('asks 60 questions in exam and practice, 40 in the holdout', () => {
    expect(questionCountFor('exam')).toBe(60);
    expect(questionCountFor('practice')).toBe(60);
    expect(questionCountFor('holdout')).toBe(HOLDOUT_QUESTION_COUNT);
    expect(HOLDOUT_QUESTION_COUNT).toBe(40);
  });

  it('covers every mode — a new one cannot be added without deciding its clock', () => {
    for (const mode of ATTEMPT_MODES) {
      expect(() => timeLimitFor(mode), mode).not.toThrow();
    }
    expect(ATTEMPT_MODES).toHaveLength(4);
  });
});
