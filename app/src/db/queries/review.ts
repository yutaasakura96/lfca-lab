// Reading a finished sitting back, in full.
//
// This is the one query in the app that returns the answer key. That is the
// point of it — PRD E4 wants the `why` for **all four** options, because the
// wrong-option text explaining why a misconception is tempting is the most
// valuable content in the bank — and it is why this is a **new** query rather
// than `getPaperQuestions` with its stripping relaxed.
//
// Those two paths stay as they are: `getPaperQuestions` strips correctness at
// the boundary and never selects `why` at all, and `getAttemptAnswers` never
// selects `is_correct`. Loosening either would have made the sitting's own
// queries capable of leaking, in exchange for saving one file. A sitting must
// be unable to show correctness; a review must show it. Two queries is the
// honest way to hold both.
//
// The correctness returned here is the **row's own** — `answer.is_correct`,
// denormalised when the answer was written (doc 04 §5.3). A later correction to
// the bank must not silently rewrite what a past sitting scored, so the review
// reads what was recorded rather than re-deriving it from today's options.

import { sql } from 'drizzle-orm';
import type { Db } from '../client.ts';
import { looksLikeAttemptId } from './attempt.ts';
import { layOutForPaper } from '../../domain/paper.ts';
import type { Domain } from '../../domain/weights.ts';

/** One option, as the review shows it: the answer, and why each one is what it is. */
export interface ReviewOption {
  ref: string;
  text: string;
  correct: boolean;
  /**
   * Non-null in the schema and measured non-empty across the whole bank. Typed
   * as a plain string rather than `string | null` for that reason — but the
   * screen still renders nothing rather than an empty block if one is blank,
   * because PRD §5 calls a missing explanation a data defect for the validator
   * and not a runtime hole.
   */
  why: string;
}

/** One question of a finished sitting, with what the candidate did about it. */
export interface ReviewQuestion {
  id: string;
  /** 0-based position on the paper — PRD E1's defined order. */
  seq: number;
  stem: string;
  competency: string;
  /** `application` | `discrimination` | `diagnostic` | `command` | `recall`. */
  type: string;
  conceptId: string;
  domain: Domain;
  /** Laid out exactly as the sitting laid them out, so the letters still match. */
  options: ReviewOption[];
  /**
   * What was chosen, or `null` for a question left blank.
   *
   * Named as the column and as `AnswerState` names it, rather than something
   * more evocative like `chosenRef`, so that this row can be handed straight to
   * `verdictOf` without a rename in between. A rename is a place two readings
   * of the same field can drift.
   */
  optionRef: string | null;
  /** As the sitting recorded it. `null` when nothing was chosen. */
  isCorrect: boolean | null;
  flagged: boolean;
}

interface ReviewRow extends Record<string, unknown> {
  question_id: string;
  seq: number;
  correct_position: number;
  stem: string;
  competency: string;
  type: string;
  concept_id: string;
  domain: Domain;
  options: { ref: string; text: string; correct: boolean; why: string; position: number }[];
  option_ref: string | null;
  is_correct: boolean | null;
  flagged: boolean | null;
}

/**
 * Every question of one sitting, in the paper's order, with everything the
 * review needs to explain it.
 *
 * **The paper is derived from the attempt rather than passed in.** Taking an
 * `examId` parameter alongside the attempt id would allow a caller to pair one
 * paper's questions with another sitting's answers, and the screen would render
 * sixty plausible cards attributing choices to questions that were never asked.
 * Starting the query at `attempt` makes that unrepresentable.
 *
 * Ownership is in the `WHERE`, not checked before it, per doc 03 §9: somebody
 * else's sitting returns no rows here, which the page turns into a not-found.
 *
 * Answers are a `LEFT JOIN`, so a question never touched comes back with nulls
 * rather than dropping out of the paper. A review missing the questions you
 * skipped would be a review of the wrong thing.
 */
export async function getReviewQuestions(
  db: Db,
  userId: string,
  attemptId: string,
): Promise<ReviewQuestion[]> {
  if (!looksLikeAttemptId(attemptId)) return [];

  const result = await db.execute<ReviewRow>(sql`
    SELECT
      ei.question_id,
      ei.seq,
      ei.correct_position,
      q.stem,
      q.competency,
      q.type,
      q.concept_id,
      q.domain,
      json_agg(
        json_build_object(
          'ref', o.ref, 'text', o.text, 'correct', o.correct,
          'why', o.why, 'position', o.position
        )
        ORDER BY o.position
      ) AS options,
      a.option_ref,
      a.is_correct,
      a.flagged
    FROM attempt t
    JOIN exam_item ei ON ei.exam_id = t.exam_id
    JOIN question q ON q.id = ei.question_id
    JOIN question_option o ON o.question_id = q.id
    LEFT JOIN answer a ON a.attempt_id = t.id AND a.question_id = ei.question_id
    WHERE t.id = ${attemptId}::uuid AND t.user_id = ${userId}
    GROUP BY ei.question_id, ei.seq, ei.correct_position, q.stem, q.competency, q.type,
             q.concept_id, q.domain, a.option_ref, a.is_correct, a.flagged
    ORDER BY ei.seq ASC
  `);

  return result.rows.map((row) => ({
    id: row.question_id,
    seq: row.seq,
    stem: row.stem,
    competency: row.competency,
    type: row.type,
    conceptId: row.concept_id,
    domain: row.domain,
    // The *same* placement the sitting used, from the same function. A second
    // implementation would eventually disagree by one slot, and the symptom
    // would be the review naming a letter the candidate never pressed.
    options: layOutForPaper(row.options, row.correct_position).map(
      ({ ref, text, correct, why }) => ({ ref, text, correct, why }),
    ),
    optionRef: row.option_ref,
    isCorrect: row.is_correct,
    // No answer row at all is not flagged, which is the same thing a row with
    // `flagged = false` says.
    flagged: row.flagged ?? false,
  }));
}

/**
 * Where this sitting sits among the others at the same paper.
 *
 * Not needed to score anything — it is the honest-number story doc 10 §8 puts
 * on the result card. Best drifts toward 100% by construction once re-sits are
 * allowed; first-attempt does not, and showing them together is the whole
 * reason the flag exists.
 */
export interface ReviewContext {
  /** 1-based: this sitting's place in the order they were started. */
  ordinal: number;
  /** Every sitting of this paper, abandoned ones included. */
  attempts: number;
  bestScore: number | null;
  /** `null` while the earliest sitting is still unfinished. */
  firstAttemptScore: number | null;
}

export async function getReviewContext(
  db: Db,
  userId: string,
  attemptId: string,
): Promise<ReviewContext | null> {
  if (!looksLikeAttemptId(attemptId)) return null;

  const result = await db.execute<{
    ordinal: number;
    attempts: number;
    best_score: number | null;
    first_attempt_score: number | null;
  }>(sql`
    SELECT
      -- Ordered by when each sitting *started*, not when it was finalised: an
      -- abandoned first attempt is still the first attempt (doc 04 §5.2), and
      -- counting by submission would renumber it behind a later sitting that
      -- happened to finish sooner.
      (SELECT count(*)::int FROM attempt o
        WHERE o.user_id = t.user_id AND o.exam_id = t.exam_id
          AND o.started_at <= t.started_at) AS ordinal,
      (SELECT count(*)::int FROM attempt o
        WHERE o.user_id = t.user_id AND o.exam_id = t.exam_id) AS attempts,
      (SELECT max(o.score) FROM attempt o
        WHERE o.user_id = t.user_id AND o.exam_id = t.exam_id
          AND o.submitted_at IS NOT NULL) AS best_score,
      (SELECT max(o.score) FROM attempt o
        WHERE o.user_id = t.user_id AND o.exam_id = t.exam_id
          AND o.is_first_attempt) AS first_attempt_score
    FROM attempt t
    WHERE t.id = ${attemptId}::uuid AND t.user_id = ${userId}
  `);

  const row = result.rows[0];
  if (row === undefined) return null;

  return {
    ordinal: row.ordinal,
    attempts: row.attempts,
    bestScore: row.best_score,
    firstAttemptScore: row.first_attempt_score,
  };
}
