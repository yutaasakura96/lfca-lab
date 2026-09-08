// The last look before committing, as arithmetic.
//
// Doc 10 §5 does not merely count the blanks. It states what they cost, in a
// sentence a candidate acts on: "with 38 answered you can reach at most 38 of
// the 45 needed to pass, so submitting now cannot pass this exam." That is a
// decided number, so it is decided here — pure, and tested at the mark rather
// than near it.
//
// The direction of the risk is worth naming. Overstating what is reachable
// tells someone a pass is still available when it is not, and they submit on
// that basis; understating it merely nags. The test sits at 44, 45 and 46 for
// the same reason scoring does.

import { outcomeFor, passMark } from './score.ts';

/**
 * Why a sitting ended: the candidate said so, or the clock did.
 *
 * PRD E6 must not conflate the two, so the distinction is a column (doc 04
 * §5.1) rather than something inferred later from a timestamp comparison. It is
 * declared here because both halves need it — the statement that writes it and
 * the screen that reports it — and neither should have to import the other.
 */
export type SubmitReason = 'user' | 'expired';

/**
 * What a finalised sitting says back, on the wire.
 *
 * The four measured fields are `null` together, in the modes PRD P1 and D1
 * deliberately do not score. Nothing here is computed twice: the score is
 * counted by the statement that finalises the attempt, and the mark, the
 * verdict and the percentage all come from `outcomeFor`.
 */
export interface SubmitOutcome {
  submitted: true;
  score: number | null;
  questionCount: number;
  passMark: number | null;
  passed: boolean | null;
  percent: number | null;
  reason: SubmitReason;
}

/**
 * What a finalised attempt says on the wire, from the row that recorded it.
 *
 * One place rather than two: the endpoint that finalises a sitting and the page
 * that opens an already-finalised one must not be able to describe the same row
 * differently, and assembling this literal twice is exactly how they would.
 *
 * `score` is null in the modes PRD P1 and D1 deliberately do not measure, and
 * the three fields derived from it are null with it rather than invented.
 */
export function outcomeOf(finalised: {
  score: number | null;
  questionCount: number;
  reason: SubmitReason;
}): SubmitOutcome {
  const measured =
    finalised.score === null ? null : outcomeFor(finalised.score, finalised.questionCount);

  return {
    submitted: true,
    score: finalised.score,
    questionCount: finalised.questionCount,
    passMark: measured?.passMark ?? null,
    passed: measured?.passed ?? null,
    percent: measured?.percent ?? null,
    reason: finalised.reason,
  };
}

/** What the navigator already knows about the sitting. Nothing else is needed. */
export interface SubmitCounts {
  answered: number;
  flagged: number;
}

export interface SubmitReview {
  answered: number;
  unanswered: number;
  flagged: number;
  questionCount: number;
  passMark: number;
  /**
   * The highest score still reachable — which is simply the number answered,
   * because every blank is a wrong answer and nothing left to do can change one.
   */
  bestPossible: number;
  /** False once the blanks alone have put the mark out of reach. */
  canStillPass: boolean;
}

export function reviewBeforeSubmit(
  counts: SubmitCounts,
  questionCount: number,
): SubmitReview {
  if (!Number.isInteger(questionCount) || questionCount <= 0) {
    throw new Error(`A sitting asks at least one question; got ${questionCount}.`);
  }
  for (const [name, value] of Object.entries(counts)) {
    if (!Number.isInteger(value) || value < 0 || value > questionCount) {
      throw new Error(
        `A sitting of ${questionCount} question(s) cannot have ${value} ${name}.`,
      );
    }
  }

  const mark = passMark(questionCount);

  return {
    answered: counts.answered,
    unanswered: questionCount - counts.answered,
    flagged: counts.flagged,
    questionCount,
    passMark: mark,
    bestPossible: counts.answered,
    canStillPass: counts.answered >= mark,
  };
}

/** What the graded navigator already counts. Nothing else is needed. */
export interface FinishCounts {
  correct: number;
  incorrect: number;
  /** Questions with no answer at all — doc 10 §7's third count. */
  remaining: number;
}

export interface FinishSummary {
  correct: number;
  incorrect: number;
  /** What finishing now would leave unasked. */
  unreached: number;
  /** Nothing left unreached. The Finish case rather than the Save-and-exit one. */
  complete: boolean;
}

/**
 * What an unscored sitting says before it is closed, and after.
 *
 * The counterpart to {@link reviewBeforeSubmit}, and the whole of the
 * difference is what it refuses to compute. There is no pass mark here, no
 * percentage, no verdict and no best-possible: PRD P1 says these modes are not
 * measured, doc 04 §5.1's `CHECK (score IS NULL OR mode IN ('exam','holdout'))`
 * makes the column agree, and a summary that quietly derived one would be the
 * one place the measurement came back. A test asserts the returned keys for
 * exactly that reason.
 *
 * A tally of verdicts is not a measurement. Every one of these appeared on
 * screen, one at a time, as it was earned; the sum is already known and
 * withholding it would read as coyness rather than as principle (decision log,
 * 2026-09-06).
 *
 * **`unreached` is the number that has to be right.** Save and exit is
 * irreversible — there is no discard in this app and no reopening a submitted
 * sitting — so undercounting what is being abandoned closes a sitting somebody
 * meant to keep. It is `remaining` rather than `questionCount - correct -
 * incorrect`, so an answer whose verdict has not come back yet is never
 * reported as a question the candidate never reached. That gap is real and
 * normal — the graded navigator puts an answer still in the air in neither
 * verdict column — which is why the three returned counts do not have to sum
 * to the sitting, and why the subtraction is not the definition.
 */
export function finishSummary(counts: FinishCounts, questionCount: number): FinishSummary {
  if (!Number.isInteger(questionCount) || questionCount <= 0) {
    throw new Error(`A sitting asks at least one question; got ${questionCount}.`);
  }
  for (const [name, value] of Object.entries(counts)) {
    if (!Number.isInteger(value) || value < 0 || value > questionCount) {
      throw new Error(`A sitting of ${questionCount} question(s) cannot have ${value} ${name}.`);
    }
  }

  const answered = questionCount - counts.remaining;
  if (counts.correct + counts.incorrect > answered) {
    // More verdicts than answers. The counts did not come from one sitting.
    throw new Error(
      `A sitting of ${questionCount} cannot hold ${counts.correct + counts.incorrect} ` +
        `verdict(s) against ${answered} answer(s).`,
    );
  }

  return {
    correct: counts.correct,
    incorrect: counts.incorrect,
    unreached: counts.remaining,
    complete: counts.remaining === 0,
  };
}
