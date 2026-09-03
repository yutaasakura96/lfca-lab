import { describe, expect, it } from 'vitest';
import { reviewBeforeSubmit } from '../../src/domain/submission.ts';

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
