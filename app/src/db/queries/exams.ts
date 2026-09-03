// The sixteen papers, with both numbers.
//
// Best and first-attempt are always read together, because either alone
// misleads in a different direction. Best drifts toward 100% by construction —
// there are only sixteen papers, so repeats are guaranteed and eventually it
// measures recall rather than knowledge. First-attempt is the honest one, and
// it is the number this whole project is arranged to keep.
//
// One query for all sixteen rather than sixteen. Not for speed — at this size
// nothing here is slow — but because sixteen round trips is sixteen chances for
// the rows to disagree with each other about what "attempts" means.

import { sql } from 'drizzle-orm';
import type { Db } from '../client.ts';

export interface ExamListRow {
  id: string;
  number: number;
  questionCount: number;
  /** Every sitting, including abandoned ones. Quitting badly does not un-sit a paper. */
  attempts: number;
  /** Highest score across finished sittings. `null` until one finishes. */
  bestScore: number | null;
  /** The earliest sitting's score. `null` if that sitting has not finished yet. */
  firstAttemptScore: number | null;
  /** A sitting still in progress, if there is one — the paper offers to resume rather than restart. */
  openAttemptId: string | null;
  /**
   * The most recently finished sitting, if there is one — what "Review" opens.
   *
   * Most recent rather than best or first: the review is a reading of one
   * sitting, and the one you most likely want back is the one you just did.
   * Every sitting keeps its own URL, so nothing else is unreachable.
   */
  lastReviewableAttemptId: string | null;
}

/**
 * Every paper, with this candidate's history against it.
 *
 * Scoped to one user throughout: the join carries `user_id`, so a paper another
 * candidate has sat contributes nothing here. That scoping is the ownership
 * rule doc 03 §9 asks for, expressed where it cannot be forgotten rather than
 * re-checked by each caller.
 *
 * A paper never sat comes back with nulls and a zero — not with zeros — so the
 * screen can say "not yet attempted" rather than showing a score of 0, which
 * reads as a failure.
 */
export async function listExams(db: Db, userId: string): Promise<ExamListRow[]> {
  const result = await db.execute<{
    id: string;
    number: number;
    question_count: number;
    attempts: number;
    best_score: number | null;
    first_attempt_score: number | null;
    open_attempt_id: string | null;
    last_reviewable_attempt_id: string | null;
  }>(sql`
    SELECT
      e.id,
      e.number,
      e.question_count,
      count(a.id)::int AS attempts,
      max(a.score) FILTER (WHERE a.submitted_at IS NOT NULL) AS best_score,
      max(a.score) FILTER (WHERE a.is_first_attempt) AS first_attempt_score,
      (
        -- The oldest unfinished sitting. Oldest rather than newest because a
        -- resume should return you to the attempt whose clock has been running
        -- longest, which is the one most at risk of expiring unnoticed.
        SELECT o.id FROM attempt o
        WHERE o.user_id = ${userId} AND o.exam_id = e.id AND o.submitted_at IS NULL
        ORDER BY o.started_at ASC
        LIMIT 1
      ) AS open_attempt_id,
      (
        -- The newest finished sitting. Newest here, oldest above: resuming
        -- wants the sitting closest to expiring, and reviewing wants the one
        -- just sat.
        SELECT f.id FROM attempt f
        WHERE f.user_id = ${userId} AND f.exam_id = e.id AND f.submitted_at IS NOT NULL
        ORDER BY f.submitted_at DESC
        LIMIT 1
      ) AS last_reviewable_attempt_id
    FROM exam e
    LEFT JOIN attempt a ON a.exam_id = e.id AND a.user_id = ${userId}
    GROUP BY e.id, e.number, e.question_count
    ORDER BY e.number ASC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    number: row.number,
    questionCount: row.question_count,
    attempts: row.attempts,
    bestScore: row.best_score,
    firstAttemptScore: row.first_attempt_score,
    openAttemptId: row.open_attempt_id,
    lastReviewableAttemptId: row.last_reviewable_attempt_id,
  }));
}

/**
 * The oldest unfinished sitting of one paper, if there is one.
 *
 * Scoped to the user, like everything attempt-shaped. Oldest rather than newest
 * because a resume should return you to the sitting whose clock has been
 * running longest — that is the one closest to expiring unnoticed.
 */
export async function openAttemptForExam(
  db: Db,
  userId: string,
  examId: string,
): Promise<string | null> {
  const result = await db.execute<{ id: string }>(sql`
    SELECT id FROM attempt
    WHERE user_id = ${userId} AND exam_id = ${examId} AND submitted_at IS NULL
    ORDER BY started_at ASC
    LIMIT 1
  `);
  return result.rows[0]?.id ?? null;
}
