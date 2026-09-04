// Answering, and flagging — the two writes that happen during a sitting.
//
// Both are upserts on `(attempt_id, question_id)`, which is the answer table's
// primary key. That is not an optimisation: it is the contract. A second answer
// to the same question in the same sitting is not a thing that exists, so a
// retry, a double click and a second tab all converge on one row rather than
// racing to append.
//
// They are separate statements on purpose. Keeping them apart is what makes a
// flag unable to carry an answer, and an answer unable to clear a flag —
// neither is coupled to the other's retry.

import { sql } from 'drizzle-orm';
import type { Db } from '../client.ts';

// The two write functions below take an attempt id without a user id, and that
// is the one place in this file where ownership is not in the SQL. It is
// established one step earlier, by `openAttemptForWrite`, which is the only
// path that reaches them: it loads the attempt *through* the session and hands
// on the row it proved. Repeating the check inside the upsert would fold "not
// yours" into the same empty result as "no such option", turning a clear
// refusal into a misleading one.

/** What a write can say back. `unknown_option` means the ref is not this question's. */
export type WriteResult = 'saved' | 'unknown_option';

export interface AnswerWrite {
  attemptId: string;
  questionId: string;
  /** `null` clears the answer without removing the row, so a flag on it survives. */
  optionRef: string | null;
}

export interface FlagWrite {
  attemptId: string;
  questionId: string;
  flagged: boolean;
}

/** One question's state as the sitting screen restores it. No correctness, ever. */
export interface AnswerState {
  questionId: string;
  optionRef: string | null;
  flagged: boolean;
  /**
   * When this row was last written — by an answer or by a flag.
   *
   * Carried so a resumed sitting can open where it was left (PRD E5). It is
   * `updated_at` rather than `answered_at` on purpose: `answered_at` is set
   * once and deliberately not advanced, because least-recently-seen selection
   * reads it, so it dates the first engagement rather than the last.
   */
  updatedAt: Date;
}

/**
 * Record one answer.
 *
 * Correctness is read from `question_option` **inside the same statement** and
 * stored on the row. Denormalising it is deliberate (doc 04 §5.3): a later
 * correction to the bank must not silently rewrite a score that was already
 * sat. It also means the caller never has an opportunity to supply it.
 *
 * The option ref is validated by the join rather than by a prior lookup. An
 * unknown ref matches no row, so the insert writes nothing and returns nothing
 * — the refusal and the write are one round trip and cannot disagree.
 *
 * `answered_at` is set once and then held by `COALESCE`. Every retry the outbox
 * makes is this exact call, and a retry that moved the timestamp would rewrite
 * what least-recently-seen selection reads.
 */
export async function recordAnswer(db: Db, write: AnswerWrite): Promise<WriteResult> {
  if (write.optionRef === null) return clearAnswer(db, write);

  const result = await db.execute<{ question_id: string }>(sql`
    INSERT INTO answer (attempt_id, question_id, option_ref, is_correct, answered_at)
    SELECT ${write.attemptId}::uuid, ${write.questionId}, o.ref, o.correct, now()
    FROM question_option o
    WHERE o.question_id = ${write.questionId} AND o.ref = ${write.optionRef}
    ON CONFLICT (attempt_id, question_id) DO UPDATE
      SET option_ref  = EXCLUDED.option_ref,
          is_correct  = EXCLUDED.is_correct,
          answered_at = COALESCE(answer.answered_at, EXCLUDED.answered_at),
          updated_at  = now()
    RETURNING question_id
  `);

  return result.rows.length === 1 ? 'saved' : 'unknown_option';
}

/**
 * Unselect an answer, keeping the row.
 *
 * Deleting it would be simpler and wrong: the row may carry a flag, and a flag
 * is not something an answer change is allowed to revoke. `answered_at` stays
 * too — the candidate did engage with the question, whatever they left it on.
 */
async function clearAnswer(db: Db, write: AnswerWrite): Promise<WriteResult> {
  await db.execute(sql`
    INSERT INTO answer (attempt_id, question_id, option_ref, is_correct)
    VALUES (${write.attemptId}::uuid, ${write.questionId}, NULL, NULL)
    ON CONFLICT (attempt_id, question_id) DO UPDATE
      SET option_ref = NULL,
          is_correct = NULL,
          updated_at = now()
  `);
  return 'saved';
}

/**
 * Flag or unflag one question.
 *
 * Touches `flagged` and nothing else. On a question never answered this creates
 * the row with a null `option_ref` — the flagged-but-unanswered case of doc 04
 * §6 — which counts as unanswered for scoring and, because `answered_at` stays
 * null, as unseen for future selection. Inventing an answer to hang a flag on
 * would corrupt both.
 *
 * Returns nothing: unlike an answer, a flag has no way to be invalid. There is
 * no ref to be wrong about, so there is no outcome for a caller to branch on.
 */
export async function setFlag(db: Db, write: FlagWrite): Promise<void> {
  await db.execute(sql`
    INSERT INTO answer (attempt_id, question_id, flagged)
    VALUES (${write.attemptId}::uuid, ${write.questionId}, ${write.flagged})
    ON CONFLICT (attempt_id, question_id) DO UPDATE
      SET flagged    = EXCLUDED.flagged,
          updated_at = now()
  `);
}

/**
 * Everything recorded against one sitting, for restoring it on load.
 *
 * Takes the candidate, not just the attempt. Ownership is expressed in the
 * query rather than checked before it, for the reason doc 03 §9 gives: a query
 * that cannot be built without a user is one no caller can forget to scope.
 * Somebody else's sitting reads as empty here, which is the same answer as a
 * sitting with nothing recorded on it yet.
 *
 * `is_correct` is stored on these rows and is deliberately not selected. The
 * sitting screen must stay silent about correctness until submit, and the
 * surest way to keep a column off the wire is for the query that feeds that
 * screen to never read it.
 */
export async function getAttemptAnswers(
  db: Db,
  userId: string,
  attemptId: string,
): Promise<AnswerState[]> {
  const result = await db.execute<{
    question_id: string;
    option_ref: string | null;
    flagged: boolean;
    updated_at: Date | string;
  }>(sql`
    SELECT a.question_id, a.option_ref, a.flagged, a.updated_at
    FROM answer a
    JOIN attempt t ON t.id = a.attempt_id
    WHERE a.attempt_id = ${attemptId}::uuid AND t.user_id = ${userId}
  `);

  return result.rows.map((row) => ({
    questionId: row.question_id,
    optionRef: row.option_ref,
    flagged: row.flagged,
    // Raw SQL bypasses Drizzle's mapping, so the driver may hand this back as
    // a string. Normalised here rather than at the three call sites.
    updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at),
  }));
}

/**
 * Whether a question is one of this paper's own.
 *
 * Not "does this question exist" — *is it one of the sixty this sitting asked*.
 * Without the distinction an attempt could be padded with answers to questions
 * it never put on screen, which would make its score a count of something other
 * than the paper.
 */
export async function isQuestionOnPaper(
  db: Db,
  examId: string,
  questionId: string,
): Promise<boolean> {
  const result = await db.execute<{ ok: boolean }>(sql`
    SELECT true AS ok FROM exam_item
    WHERE exam_id = ${examId} AND question_id = ${questionId}
  `);
  return result.rows.length === 1;
}
