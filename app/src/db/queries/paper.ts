// Reading a paper for a sitting.
//
// This is the query the answer key must not escape from. It fetches
// correctness, because it has to — the options cannot be laid out without
// knowing which one is right — and then returns a shape that has no room for
// it. The stripping happens here, once, rather than being each caller's job to
// remember.
//
// The `why` text is never selected at all. During a sitting it has no use, and
// a column that is never read cannot be leaked by a careless spread.

import { sql } from 'drizzle-orm';
import type { Db, Executor } from '../client.ts';
import {
  orderOptionsForPaper,
  presentInAuthoredOrder,
  type PresentedOption,
} from '../../domain/paper.ts';
import type { AttemptMode } from '../../domain/modes.ts';

/** One question as the candidate sees it. Contains nothing that gives the answer away. */
export interface SittingQuestion {
  id: string;
  /** 0-based position on the paper. */
  seq: number;
  stem: string;
  options: PresentedOption[];
}

interface PaperRow extends Record<string, unknown> {
  question_id: string;
  seq: number;
  stem: string;
  correct_position: number;
  options: { ref: string; text: string; correct: boolean; position: number }[];
}

/**
 * Every question on a paper, in order, laid out as the paper has them.
 *
 * One query rather than one per question: sixty round trips to render a sitting
 * would be sixty chances for the paper to change under the reader.
 */
export async function getPaperQuestions(db: Db, examId: string): Promise<SittingQuestion[]> {
  const result = await db.execute<PaperRow>(sql`
    SELECT
      ei.question_id,
      ei.seq,
      q.stem,
      ei.correct_position,
      json_agg(
        json_build_object('ref', o.ref, 'text', o.text, 'correct', o.correct, 'position', o.position)
        ORDER BY o.position
      ) AS options
    FROM exam_item ei
    JOIN question q ON q.id = ei.question_id
    JOIN question_option o ON o.question_id = q.id
    WHERE ei.exam_id = ${examId}
    GROUP BY ei.question_id, ei.seq, q.stem, ei.correct_position
    ORDER BY ei.seq ASC
  `);

  return result.rows.map((row) => ({
    id: row.question_id,
    seq: row.seq,
    stem: row.stem,
    // `orderOptionsForPaper` is where correctness stops travelling. It takes the
    // answer and returns something that does not contain it.
    options: orderOptionsForPaper(row.options, row.correct_position),
  }));
}

// ── Composed sittings ─────────────────────────────────────────────────────
//
// Practice, domain and holdout sittings have no fixed paper. They are composed
// at start — unseen-first, to a pinned quota, with `random()` breaking ties —
// and the set is written to `attempt_question` because it cannot be recovered
// otherwise: `answer` records what was *answered*, and recomposing reads an
// ordering that the act of answering changes.

/**
 * Write down what a composed sitting asks, once, at start.
 *
 * Takes an {@link Executor} rather than the handle so the caller can run it in
 * the **same transaction** as the attempt insert. An attempt that exists
 * without its questions is a sitting with nothing to show, and an attempt that
 * failed to insert must not leave its questions behind.
 *
 * The order of `questionIds` is the order of the sitting. Nothing here sorts,
 * dedupes or validates the set — the composer already did, and the unique index
 * on `(attempt_id, question_id)` is what refuses a set it could only have
 * produced by breaking.
 */
export async function freezeAttemptQuestions(
  executor: Executor,
  attemptId: string,
  questionIds: readonly string[],
): Promise<void> {
  if (questionIds.length === 0) return;

  // One statement rather than one per question: a sitting is written down
  // whole or not at all, and sixty round trips at start is sixty chances to be
  // interrupted half-composed.
  const values = questionIds.map(
    (id, seq) => sql`(${attemptId}::uuid, ${seq}::smallint, ${id})`,
  );
  await executor.execute(sql`
    INSERT INTO attempt_question (attempt_id, seq, question_id)
    VALUES ${sql.join(values, sql`, `)}
  `);
}

interface ComposedRow extends Record<string, unknown> {
  question_id: string;
  seq: number;
  stem: string;
  options: { ref: string; text: string; correct: boolean; position: number }[];
}

/**
 * Every question one composed sitting asked, in the order it asked them.
 *
 * The same shape as {@link getPaperQuestions} and the same guarantee: the
 * answer key is fetched, because the projection needs to know a well-formed
 * question when it sees one, and then dropped before anything is returned. The
 * `why` text is never selected at all.
 *
 * Options come back in **authored** order, which is what a sitting with no
 * paper means — there is no recorded slot to reproduce.
 */
export async function getComposedQuestions(
  db: Db,
  attemptId: string,
): Promise<SittingQuestion[]> {
  const result = await db.execute<ComposedRow>(sql`
    SELECT
      aq.question_id,
      aq.seq,
      q.stem,
      json_agg(
        json_build_object('ref', o.ref, 'text', o.text, 'correct', o.correct, 'position', o.position)
        ORDER BY o.position
      ) AS options
    FROM attempt_question aq
    JOIN question q ON q.id = aq.question_id
    JOIN question_option o ON o.question_id = q.id
    WHERE aq.attempt_id = ${attemptId}::uuid
    GROUP BY aq.question_id, aq.seq, q.stem
    ORDER BY aq.seq ASC
  `);

  return result.rows.map((row) => ({
    id: row.question_id,
    seq: row.seq,
    stem: row.stem,
    options: presentInAuthoredOrder(row.options),
  }));
}

/** The little of an attempt this read needs: which sitting, and which shape. */
export interface SittingIdentity {
  id: string;
  mode: AttemptMode;
  examId: string | null;
}

/**
 * The questions this sitting asks, from whichever table holds them.
 *
 * **Exam mode reads `exam_item`; every other mode reads `attempt_question`.**
 * A fixed paper is stored once, for all sixteen, and writing sixty rows per
 * exam attempt would store a known constant per sitting and give a paper's
 * order two places it could be read from — which is two places it could be read
 * from differently. So the branch is here, once, and both tables stay.
 */
export async function getSittingQuestions(
  db: Db,
  attempt: SittingIdentity,
): Promise<SittingQuestion[]> {
  if (attempt.mode !== 'exam') return getComposedQuestions(db, attempt.id);

  // Unreachable: `attempt_exam_iff_exam_mode` makes the two inseparable. Named
  // rather than coerced, because the alternative is reading the paper of an
  // exam nobody chose.
  if (attempt.examId === null) {
    throw new Error(`Exam attempt ${attempt.id} has no exam_id.`);
  }
  return getPaperQuestions(db, attempt.examId);
}
