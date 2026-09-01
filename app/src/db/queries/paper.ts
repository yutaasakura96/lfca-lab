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
import type { Db } from '../client.ts';
import { orderOptionsForPaper, type PresentedOption } from '../../domain/paper.ts';

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
