// Finalising a sitting — the one write in this app that cannot be repeated.
//
// Doc 07 §5's contract in full: submission is **one conditional update**, and
// the caller that updates a row is the one that submitted. A caller that
// updates zero rows — the second click, the second tab, the auto-submit that
// arrives after the candidate already pressed the button — is not an error. It
// reads back what the first caller decided and returns that, because PRD §5's
// "a double submit is a no-op" honestly means the candidate sees their score
// rather than a conflict.
//
// **The score is counted inside the same statement.** It could have been read
// first and written second, and that is the version this document originally
// implied — but between the read and the write an answer can land, and the
// update would then finalise the sitting with a score that predates one of its
// own answers. Counting in the `UPDATE` closes it: the count and the
// `submitted_at` that stops further answers are decided at one instant, by
// Postgres, and cannot disagree. What that count *means* — the mark, the
// verdict, the percentage — stays in `src/domain/score.ts`, which is where it
// is tested.
//
// **`is_first_attempt` is not in this statement, and its absence is the point.**
// It was settled when the attempt was created (doc 04 §5.2), so an abandoned
// first sitting keeps the flag however late it is finalised. Touching it here
// would make the honest number depend on the order sittings happen to close in,
// which is precisely the bug that decision exists to prevent.

import { sql } from 'drizzle-orm';
import type { Db } from '../client.ts';
import type { SubmitReason } from '../../domain/submission.ts';

export type { SubmitReason };

export interface SubmitInput {
  attemptId: string;
  reason: SubmitReason;
  /** Exam and holdout sittings carry a score; practice and domain never do. */
  scored: boolean;
}

export interface FinalisedAttempt {
  /** The number of correct answers, or `null` in an unscored mode. */
  score: number | null;
  questionCount: number;
  reason: SubmitReason;
  submittedAt: Date;
  /**
   * True when this call changed nothing because the sitting was already
   * finalised. The figures above are then the first caller's, unaltered — which
   * is the whole reason a second submit is answered rather than refused.
   */
  alreadySubmitted: boolean;
}

interface AttemptOutcomeRow extends Record<string, unknown> {
  score: number | string | null;
  question_count: number | string;
  submit_reason: SubmitReason;
  submitted_at: Date | string;
}

/** Raw SQL bypasses Drizzle's mapping, so nothing here is assumed to arrive typed. */
function readOutcome(row: AttemptOutcomeRow, alreadySubmitted: boolean): FinalisedAttempt {
  const submittedAt =
    row.submitted_at instanceof Date ? row.submitted_at : new Date(row.submitted_at);
  if (Number.isNaN(submittedAt.getTime())) {
    throw new Error(`The attempt returned an unreadable submitted_at: ${row.submitted_at}`);
  }

  return {
    score: row.score === null ? null : Number(row.score),
    questionCount: Number(row.question_count),
    reason: row.submit_reason,
    submittedAt,
    alreadySubmitted,
  };
}

/**
 * Finalise a sitting, or read back the finalisation that already happened.
 *
 * `count(*) ... WHERE a.is_correct` is what makes unanswered questions score as
 * wrong rather than being excused: a blank row's `is_correct` is null, a null
 * is not true, and the denominator is `question_count`, which was frozen when
 * the sitting started. Running out of time is not being let off the questions
 * you did not reach.
 */
export async function submitAttempt(db: Db, input: SubmitInput): Promise<FinalisedAttempt> {
  const finalised = await db.execute<AttemptOutcomeRow>(sql`
    UPDATE attempt SET
      submitted_at  = now(),
      submit_reason = ${input.reason}::submit_reason,
      score = CASE WHEN ${input.scored}::boolean THEN (
                SELECT count(*)::int FROM answer a
                WHERE a.attempt_id = attempt.id AND a.is_correct
              ) END,
      updated_at    = now()
    WHERE id = ${input.attemptId}::uuid AND submitted_at IS NULL
    RETURNING score, question_count, submit_reason, submitted_at
  `);

  const row = finalised.rows[0];
  if (row !== undefined) return readOutcome(row, false);

  // Zero rows updated. Either somebody else finalised it first — in which case
  // their figures are the answer — or the id is not an attempt at all, which
  // the caller has already ruled out by loading it.
  const existing = await db.execute<AttemptOutcomeRow>(sql`
    SELECT score, question_count, submit_reason, submitted_at
    FROM attempt
    WHERE id = ${input.attemptId}::uuid AND submitted_at IS NOT NULL
  `);

  const already = existing.rows[0];
  if (already === undefined) {
    throw new Error(`Attempt ${input.attemptId} could neither be submitted nor read back.`);
  }
  return readOutcome(already, true);
}
