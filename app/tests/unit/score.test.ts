import { describe, expect, it } from 'vitest';
import { PASS_RATIO, passMark, scoreSitting } from '../../src/domain/score.ts';
import { QUESTIONS_PER_WEIGHTED_SITTING } from '../../src/domain/weights.ts';

// The product is a scoreboard, and there is no external system to reconcile
// against. A silently wrong score is worse than a crash, because it is
// believed — so these tests sit on the boundaries rather than in the middle of
// the range.

/** Shorthand: n correct, m unanswered, the rest answered wrong. */
function answers(correct: number, unanswered: number, wrong: number) {
  return [
    ...Array.from({ length: correct }, (_, i) => ({ questionId: `c${i}`, isCorrect: true })),
    ...Array.from({ length: wrong }, (_, i) => ({ questionId: `w${i}`, isCorrect: false })),
    ...Array.from({ length: unanswered }, (_, i) => ({ questionId: `u${i}`, isCorrect: null })),
  ];
}

describe('the pass mark', () => {
  it('is exactly 45 out of 60', () => {
    expect(passMark(QUESTIONS_PER_WEIGHTED_SITTING)).toBe(45);
  });

  // The holdout is 40 questions and must be judged against its own bar. Scoring
  // it against 45 would make it unpassable; scoring it against 45/60 of itself
  // is the only reading that means the same thing.
  it('is 30 out of 40 for the holdout — pro rata, not 45', () => {
    expect(passMark(40)).toBe(30);
  });

  it('is 75% of the sitting, rounded up so a fraction of a question never passes', () => {
    expect(PASS_RATIO).toBe(0.75);
    expect(passMark(20)).toBe(15);
    expect(passMark(21)).toBe(16); // 15.75 → a 15 does not pass
  });
});

describe('scoring a 60-question sitting', () => {
  it('fails at 44', () => {
    const r = scoreSitting({ answers: answers(44, 0, 16), questionCount: 60 });
    expect(r.score).toBe(44);
    expect(r.passed).toBe(false);
  });

  it('passes at exactly 45', () => {
    const r = scoreSitting({ answers: answers(45, 0, 15), questionCount: 60 });
    expect(r.score).toBe(45);
    expect(r.passed).toBe(true);
  });

  it('passes at 46', () => {
    expect(scoreSitting({ answers: answers(46, 0, 14), questionCount: 60 }).passed).toBe(true);
  });

  it('reports the mark it was judged against', () => {
    expect(scoreSitting({ answers: answers(45, 0, 15), questionCount: 60 }).passMark).toBe(45);
  });
});

describe('unanswered questions', () => {
  // The rule that keeps an abandoned sitting honest: running out of time is not
  // the same as being excused the questions you did not reach.
  it('count as wrong, not as absent', () => {
    const r = scoreSitting({ answers: answers(45, 15, 0), questionCount: 60 });
    expect(r.score).toBe(45);
    expect(r.passed).toBe(true);
  });

  it('stay in the denominator', () => {
    const r = scoreSitting({ answers: answers(30, 30, 0), questionCount: 60 });
    expect(r.questionCount).toBe(60);
    expect(r.percent).toBe(50);
  });

  it('are indistinguishable from wrong answers in the score', () => {
    const unanswered = scoreSitting({ answers: answers(20, 40, 0), questionCount: 60 });
    const wrong = scoreSitting({ answers: answers(20, 0, 40), questionCount: 60 });
    expect(unanswered.score).toBe(wrong.score);
    expect(unanswered.passed).toBe(wrong.passed);
  });

  // A sitting abandoned at question six has six answer rows, not sixty. The
  // missing rows must count against it, or quitting early would be the highest
  // score available.
  it('count even when the answer row was never written', () => {
    const r = scoreSitting({ answers: answers(6, 0, 0), questionCount: 60 });
    expect(r.score).toBe(6);
    expect(r.questionCount).toBe(60);
    expect(r.passed).toBe(false);
  });

  it('score a sitting nobody answered at all as zero, not as an error', () => {
    const r = scoreSitting({ answers: [], questionCount: 60 });
    expect(r.score).toBe(0);
    expect(r.percent).toBe(0);
    expect(r.passed).toBe(false);
  });
});

describe('scoring the 40-question holdout', () => {
  it('fails at 29 and passes at 30', () => {
    expect(scoreSitting({ answers: answers(29, 0, 11), questionCount: 40 }).passed).toBe(false);
    expect(scoreSitting({ answers: answers(30, 0, 10), questionCount: 40 }).passed).toBe(true);
  });

  it('is a percentage of 40, not of 60', () => {
    expect(scoreSitting({ answers: answers(30, 0, 10), questionCount: 40 }).percent).toBe(75);
  });
});

describe('scoring is honest about bad input', () => {
  it('refuses more answers than the sitting has questions', () => {
    expect(() => scoreSitting({ answers: answers(61, 0, 0), questionCount: 60 })).toThrow();
  });

  it('refuses a sitting of no questions', () => {
    expect(() => scoreSitting({ answers: [], questionCount: 0 })).toThrow();
  });
});
