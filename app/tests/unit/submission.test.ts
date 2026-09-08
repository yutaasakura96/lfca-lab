import { describe, expect, it } from 'vitest';
import { finishSummary, reviewBeforeSubmit } from '../../src/domain/submission.ts';

// The arithmetic the submit confirmation states out loud.
//
// Doc 10 §5 does not merely count the blanks — it says what they cost: "with 38
// answered you can reach at most 38 of the 45 needed to pass, so submitting now
// cannot pass this exam." That sentence is a decided number, and a decided
// number in this app is a tested one. Getting it wrong in the reassuring
// direction — telling someone a pass is still reachable when it is not — is the
// failure worth guarding against.

describe('the review before submitting', () => {
  it('counts what is answered, blank and flagged, and the mark to reach', () => {
    const review = reviewBeforeSubmit({ answered: 38, flagged: 5 }, 60);

    expect(review.answered).toBe(38);
    expect(review.unanswered).toBe(22);
    expect(review.flagged).toBe(5);
    expect(review.questionCount).toBe(60);
    expect(review.passMark).toBe(45);
  });

  it('caps what is still reachable at the number answered', () => {
    // Every blank is a wrong answer, so the best conceivable outcome is that
    // everything answered was right. Nothing a candidate does now raises it.
    expect(reviewBeforeSubmit({ answered: 38, flagged: 0 }, 60).bestPossible).toBe(38);
    expect(reviewBeforeSubmit({ answered: 60, flagged: 0 }, 60).bestPossible).toBe(60);
    expect(reviewBeforeSubmit({ answered: 0, flagged: 0 }, 60).bestPossible).toBe(0);
  });

  it('decides whether a pass is still reachable at the mark, not near it', () => {
    // 45 of 60 is the mark, and 45 answered is exactly enough to reach it.
    expect(reviewBeforeSubmit({ answered: 44, flagged: 0 }, 60).canStillPass).toBe(false);
    expect(reviewBeforeSubmit({ answered: 45, flagged: 0 }, 60).canStillPass).toBe(true);
    expect(reviewBeforeSubmit({ answered: 46, flagged: 0 }, 60).canStillPass).toBe(true);
  });

  it('works at a holdout-length sitting rather than assuming sixty', () => {
    const review = reviewBeforeSubmit({ answered: 30, flagged: 2 }, 40);
    expect(review.passMark).toBe(30);
    expect(review.unanswered).toBe(10);
    expect(review.canStillPass).toBe(true);
  });

  it('refuses counts a paper of that length cannot have', () => {
    // A believed-wrong number is the failure this layer exists to prevent, so
    // an impossible input stops here rather than rendering a plausible tally.
    expect(() => reviewBeforeSubmit({ answered: 61, flagged: 0 }, 60)).toThrow();
    expect(() => reviewBeforeSubmit({ answered: -1, flagged: 0 }, 60)).toThrow();
    expect(() => reviewBeforeSubmit({ answered: 10, flagged: 61 }, 60)).toThrow();
  });
});

// The arithmetic the *unscored* finish states out loud.
//
// Nothing here is a measurement, and that is the constraint rather than an
// omission: PRD P1 forbids scoring these modes, doc 04 §5.1's check constraint
// enforces it, and the pass mark this file tests above must not appear in any
// of it. What is left is a tally of verdicts the candidate already watched
// arrive one at a time — and the number of questions they are about to leave.
//
// The direction of the risk here is understating what is being abandoned. Save
// and exit is irreversible: there is no discard and no reopening a submitted
// sitting, so a dialog that undercounts what will be left unreached is one that
// closes a sitting somebody meant to keep.

describe('the summary before finishing an unscored sitting', () => {
  it('reports the verdicts and what would be left unreached', () => {
    const summary = finishSummary({ correct: 12, incorrect: 3, remaining: 5 }, 20);

    expect(summary.correct).toBe(12);
    expect(summary.incorrect).toBe(3);
    expect(summary.unreached).toBe(5);
  });

  it('says nothing about a mark, a percentage or a pass', () => {
    // Not a stylistic assertion. A score on a practice sitting is the one thing
    // doc 04 §5.1's constraint exists to make impossible, and a summary that
    // computed one here would be the place it leaked back in.
    const summary = finishSummary({ correct: 12, incorrect: 3, remaining: 5 }, 20);

    expect(Object.keys(summary).sort()).toEqual([
      'complete',
      'correct',
      'incorrect',
      'unreached',
    ]);
  });

  it('is complete only when nothing is left unreached', () => {
    expect(finishSummary({ correct: 20, incorrect: 0, remaining: 0 }, 20).complete).toBe(true);
    expect(finishSummary({ correct: 14, incorrect: 6, remaining: 0 }, 20).complete).toBe(true);
    expect(finishSummary({ correct: 14, incorrect: 5, remaining: 1 }, 20).complete).toBe(false);
  });

  it('does not report an answer still in the air as a question never reached', () => {
    // The graded navigator puts such a question in neither verdict column and
    // not in `remaining` either, so the three counts do not sum to the sitting
    // until every write has landed. `unreached` reads `remaining` for exactly
    // this reason: 20 - 9 - 4 would say 7, telling the candidate they are
    // abandoning a question they in fact answered. Measured in the browser as
    // 4 / 15 / 0 with one write owed, and 4 / 16 / 0 once it landed.
    const summary = finishSummary({ correct: 9, incorrect: 4, remaining: 6 }, 20);

    expect(summary.unreached).toBe(6);
    expect(summary.correct + summary.incorrect + summary.unreached).toBe(19);
  });

  it('refuses more verdicts than the sitting has answers', () => {
    expect(() => finishSummary({ correct: 9, incorrect: 5, remaining: 7 }, 20)).toThrow();
  });

  it('refuses counts that cannot describe a sitting of that length', () => {
    expect(() => finishSummary({ correct: 12, incorrect: 3, remaining: 9 }, 20)).toThrow();
    expect(() => finishSummary({ correct: -1, incorrect: 0, remaining: 21 }, 20)).toThrow();
    expect(() => finishSummary({ correct: 0, incorrect: 0, remaining: 0 }, 0)).toThrow();
  });
});
