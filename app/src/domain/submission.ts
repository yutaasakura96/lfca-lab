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
