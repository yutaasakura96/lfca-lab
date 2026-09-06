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
//
// **It takes a question and nothing else.** It does not know about attempts,
// answers or candidates, because none of those change what the key is. The
// verdict on a particular click is not read here at all: it comes back from the
// write that made it (`recordAnswer`'s `RETURNING`), so no read here can report
// one click's verdict against another's.

import { sql } from 'drizzle-orm';
import type { Db } from '../client.ts';
import { assertOneKeyOfFour } from '../../domain/paper.ts';

/** A question's key, and why each of its four options is what it is. */
export interface QuestionKey {
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

interface KeyRow extends Record<string, unknown> {
  ref: string;
  why: string;
  correct: boolean;
}

/**
 * What the bank says about one question: which option is right, and why each is
 * what it is.
 *
 * **Throws rather than returning null on a malformed question**, the same way
 * the two paper projections do, and via the same guard — so the reads that
 * serve a question cannot come to disagree about what a well-formed one is. By
 * this point the candidate's answer is already written, which is the right way
 * round: the write is what had to be durable, and a bank that could reach here
 * is one `npm run seed` refused to load.
 */
export async function getQuestionKey(db: Db, questionId: string): Promise<QuestionKey> {
  const result = await db.execute<KeyRow>(sql`
    SELECT ref, why, correct FROM question_option
    WHERE question_id = ${questionId}
    ORDER BY position ASC
  `);

  const rows = result.rows;
  assertOneKeyOfFour(rows);

  return {
    correctRef: rows.find((row) => row.correct)!.ref,
    why: Object.fromEntries(rows.map((row) => [row.ref, row.why])),
  };
}
