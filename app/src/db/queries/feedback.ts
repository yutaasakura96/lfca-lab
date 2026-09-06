// The answer key, on purpose, one question at a time.
//
// This is the **second** query in the app that returns the key. `review.ts` is
// the other, and its header used to call itself the only one — corrected there
// rather than quietly outgrown. Both exist because a screen genuinely has to
// show the key; both are separate from the queries that feed a live sitting,
// which strip correctness at the boundary and never select `why` at all.
//
// That separation is the whole design. A single parameterised query with a
// `withKey` flag would put the leak one wrong argument away, in a file every
// mode reads from. Here, the *only* caller is the one branch that PRD E3 turns
// on — and a timed sitting never reaches this file.

import { sql } from 'drizzle-orm';
import type { Db } from '../client.ts';
import { assertOneKeyOfFour } from '../../domain/paper.ts';

/** What a practice or domain answer is told about itself, immediately. */
export interface AnswerFeedback {
  /** As the sitting recorded it, read back rather than recomputed. */
  isCorrect: boolean;
  correctRef: string;
  /**
   * The `why` for **all four** refs, not only the right one.
   *
   * PRD E4 and P1: the wrong-option text explaining why a misconception is
   * tempting is the most valuable content in the bank, and a screen that shows
   * only the correct answer's explanation is showing the least useful quarter
   * of it.
   */
  why: Record<string, string>;
}

interface FeedbackRow extends Record<string, unknown> {
  ref: string;
  why: string;
  correct: boolean;
  is_correct: boolean | null;
}

/**
 * What this sitting recorded for this question, and why every option is what it
 * is.
 *
 * **Returns `null` when no verdict is recorded**, which is not an error and not
 * a missing question: it is a question whose answer was cleared, or never made.
 * Feedback is feedback *on a choice*, so with no choice there is nothing to
 * report and the caller answers `{ saved: true }` — the same bytes a timed
 * sitting gets, arrived at for a different reason.
 *
 * `is_correct` is read back from the row rather than derived from the ref that
 * was just sent. The write denormalised it from the bank inside its own
 * statement (doc 04 §5.3), so reading it back reports what was *stored* — which
 * is also what the review will read months later. Deriving it here would create
 * a second opinion about the same click.
 *
 * Ownership is not in this query and does not need to be: the only caller has
 * already loaded the attempt through the session, and an attempt id that is not
 * the caller's matches no answer row here anyway.
 */
export async function getAnswerFeedback(
  db: Db,
  attemptId: string,
  questionId: string,
): Promise<AnswerFeedback | null> {
  const result = await db.execute<FeedbackRow>(sql`
    SELECT o.ref, o.why, o.correct, a.is_correct
    FROM question_option o
    LEFT JOIN answer a
      ON a.attempt_id = ${attemptId}::uuid AND a.question_id = o.question_id
    WHERE o.question_id = ${questionId}
    ORDER BY o.position ASC
  `);

  const rows = result.rows;
  if (rows.length === 0) return null;

  // The answer row is joined one-to-one on the primary key, so every row
  // carries the same verdict. A null one means nothing is recorded.
  const isCorrect = rows[0]!.is_correct;
  if (isCorrect === null) return null;

  // The same guard the two paper projections use, so the three reads that serve
  // a question cannot come to disagree about what a well-formed one is. It
  // throws, and by this point the answer is already written — which is the
  // right way round: the write is what had to be durable, and a bank that could
  // reach here is one `npm run seed` refused to load.
  assertOneKeyOfFour(rows);
  const correct = rows.find((row) => row.correct)!;

  return {
    isCorrect,
    correctRef: correct.ref,
    why: Object.fromEntries(rows.map((row) => [row.ref, row.why])),
  };
}
