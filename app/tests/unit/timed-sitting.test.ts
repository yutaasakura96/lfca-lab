import { describe, expect, it } from 'vitest';
import { timedSittingCopy } from '../../src/domain/timed-sitting.ts';

// What the timed screen says about the sitting it is showing.
//
// Two sittings share the timed arrangement — a paper and the holdout — and the
// screen used to spell the paper's words inline. The exam's wording is pinned
// here verbatim, because "exam, practice and domain sitting tests pass
// untouched" (#58) is only true of wording if something holds it still.

describe('an exam paper', () => {
  const copy = timedSittingCopy({ mode: 'exam', examId: 'exam-07', timeLimitSeconds: 5400 });

  it('keeps every word it had before the holdout shared the screen', () => {
    expect(copy).toEqual({
      title: 'Practice exam 07',
      modeLabel: 'Exam mode',
      submitLabel: 'Submit exam',
      confirmTitle: 'Submit practice exam 07?',
      confirmBody:
        'This ends the sitting. Every answer is revealed at once and the score is recorded against your best and first attempts. You cannot come back and change anything.',
      minutes: 'ninety',
      noun: 'exam',
      finishedBody:
        'This sitting is recorded. Questions left blank are marked incorrect, and the first-attempt score for this paper is unchanged by any later sitting.',
      reviewable: true,
      back: { href: '/exams', label: 'Back to the sixteen exams' },
    });
  });
});

describe('the holdout', () => {
  const copy = timedSittingCopy({ mode: 'holdout', examId: null, timeLimitSeconds: 3600 });

  it('names itself, not a paper', () => {
    expect(copy.title).toBe('Holdout');
    expect(copy.modeLabel).toBe('Holdout');
    expect(copy.submitLabel).toBe('Submit holdout');
    expect(copy.confirmTitle).toBe('Submit the holdout?');
    expect(copy.noun).toBe('holdout');
  });

  it('says it cannot be sat again, and claims no best or first attempt', () => {
    expect(copy.confirmBody).toContain('The holdout cannot be sat again');
    expect(copy.confirmBody).not.toMatch(/best|first/);
    expect(copy.finishedBody).toContain("this is the holdout's only score");
    expect(copy.finishedBody).not.toMatch(/best|first-attempt/);
  });

  it('reads its minutes from the limit it was given, not from the exam', () => {
    expect(copy.minutes).toBe('sixty');
  });

  // #59 builds the holdout review. Until then nothing may point at it, so the
  // outcome's one action is home — the #37 precedent (decision log, 2026-09-08).
  it('offers no review yet, and goes home', () => {
    expect(copy.reviewable).toBe(false);
    expect(copy.back).toEqual({ href: '/', label: 'Back to home' });
  });
});

describe('minutes', () => {
  it('spells the two limits the product has, and falls back to digits', () => {
    const minutesFor = (timeLimitSeconds: number) =>
      timedSittingCopy({ mode: 'holdout', examId: null, timeLimitSeconds }).minutes;
    expect(minutesFor(5400)).toBe('ninety');
    expect(minutesFor(3600)).toBe('sixty');
    expect(minutesFor(1800)).toBe('30');
  });
});

describe('a sitting that is not timed', () => {
  it('is refused, because this screen has nothing true to say about it', () => {
    expect(() =>
      timedSittingCopy({ mode: 'practice' as 'exam', examId: null, timeLimitSeconds: 0 }),
    ).toThrow();
  });

  it('refuses an exam with no paper', () => {
    expect(() =>
      timedSittingCopy({ mode: 'exam', examId: null, timeLimitSeconds: 5400 }),
    ).toThrow();
  });
});
