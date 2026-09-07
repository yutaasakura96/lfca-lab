import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { createAttempt } from '../../src/db/queries/attempt.ts';
import {
  freezeAttemptQuestions,
  getComposedQuestions,
  getSittingQuestions,
} from '../../src/db/queries/paper.ts';
import {
  assertSeeded,
  createTestUser,
  deleteAllTestUsers,
  testUserId,
} from './support.ts';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const userId = testUserId('attempt-question');

/** A handful of real, seeded, non-holdout question ids, in a fixed order. */
async function someQuestionIds(n: number): Promise<string[]> {
  const rows = await db.execute<{ id: string }>(sql`
    SELECT id FROM question WHERE pool = 'exam' AND is_holdout = false ORDER BY id LIMIT ${n}
  `);
  return rows.rows.map((r) => r.id);
}

async function startComposedSitting(ids: readonly string[]) {
  const started = await createAttempt(db, {
    userId,
    mode: 'practice',
    questionCount: ids.length,
  });
  await freezeAttemptQuestions(db, started.id, ids);
  return started;
}

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

describe.skipIf(!hasDatabase)('freezing a composed sitting', () => {
  // The whole reason the table exists: the composition is unseen-first with a
  // `random()` tiebreak, and `answer` records what was answered rather than
  // what was asked, so a set that is not written down cannot be recovered.
  it('reads back the same ids in the same order', async () => {
    const ids = await someQuestionIds(12);
    const started = await startComposedSitting(ids);

    const questions = await getComposedQuestions(db, started.id);
    expect(questions.map((q) => q.id)).toEqual([...ids]);
    expect(questions.map((q) => q.seq)).toEqual(ids.map((_, i) => i));
  });

  it('reads back identically on every read, so a reload is the same sitting', async () => {
    const ids = await someQuestionIds(8);
    const started = await startComposedSitting(ids);
    expect(await getComposedQuestions(db, started.id)).toEqual(
      await getComposedQuestions(db, started.id),
    );
  });

  it('preserves the composition\'s own order, not the ids\' sort order', async () => {
    const ids = [...(await someQuestionIds(6))].reverse();
    const started = await startComposedSitting(ids);
    expect((await getComposedQuestions(db, started.id)).map((q) => q.id)).toEqual(ids);
  });

  it('gives every question four options, at their derived slot, with nothing that gives the answer away', async () => {
    // **This assertion used to require authored order, and that was the bug.**
    // The bank writes the key first in all 1,150 questions, so authored order
    // put every correct answer at A — measured while building #36. The set is
    // still exactly the authored four; where the key sits is now derived from
    // the attempt and the question (doc 03 §3.2).
    const ids = await someQuestionIds(5);
    const started = await startComposedSitting(ids);
    const questions = await getComposedQuestions(db, started.id);

    for (const question of questions) {
      expect(Object.keys(question).sort(), question.id).toEqual([
        'competency',
        'conceptId',
        'id',
        'options',
        'seq',
        'stem',
      ]);
      expect(question.options, question.id).toHaveLength(4);
      for (const option of question.options) {
        expect(Object.keys(option).sort(), question.id).toEqual(['ref', 'text']);
      }

      const authored = await db.execute<{ ref: string }>(sql`
        SELECT ref FROM question_option WHERE question_id = ${question.id} ORDER BY position
      `);
      // The same four, none dropped and none invented — only rearranged.
      expect([...question.options.map((o) => o.ref)].sort(), question.id).toEqual(
        authored.rows.map((r) => r.ref).sort(),
      );
    }
  });

  it('returns nothing for a sitting that froze nothing', async () => {
    const started = await createAttempt(db, { userId, mode: 'practice', questionCount: 0 });
    expect(await getComposedQuestions(db, started.id)).toEqual([]);
  });

  it('refuses to ask the same question twice in one sitting', async () => {
    const [id] = await someQuestionIds(1);
    const started = await createAttempt(db, { userId, mode: 'practice', questionCount: 2 });
    await expect(
      freezeAttemptQuestions(db, started.id, [id as string, id as string]),
    ).rejects.toThrow();
  });

  it('vanishes with its attempt', async () => {
    const ids = await someQuestionIds(3);
    const started = await startComposedSitting(ids);
    await db.execute(sql`DELETE FROM attempt WHERE id = ${started.id}::uuid`);
    const left = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM attempt_question WHERE attempt_id = ${started.id}::uuid
    `);
    expect(left.rows[0]?.n).toBe(0);
  });
});

describe.skipIf(!hasDatabase)('a question a sitting asked', () => {
  // The same guarantee `answer` and `exam_item` carry, and for the same reason:
  // renaming a bank id has to fail loudly rather than orphan a sitting.
  it('cannot be deleted from the bank while the sitting exists', async () => {
    const ids = await someQuestionIds(2);
    const started = await startComposedSitting(ids);

    await expect(
      db.execute(sql`DELETE FROM question WHERE id = ${ids[0] as string}`),
    ).rejects.toThrow();

    // Still there, and still asked.
    expect((await getComposedQuestions(db, started.id)).map((q) => q.id)).toEqual([...ids]);
  });
});

describe.skipIf(!hasDatabase)('reading whichever table holds this sitting\'s questions', () => {
  it('reads a composed sitting from attempt_question', async () => {
    const ids = await someQuestionIds(4);
    const started = await startComposedSitting(ids);

    const questions = await getSittingQuestions(db, {
      id: started.id,
      mode: 'practice',
      examId: null,
    });
    expect(questions.map((q) => q.id)).toEqual([...ids]);
  });

  // Exam sittings deliberately get no rows in attempt_question: their paper is
  // stored once, in exam_item. Reading one through this helper must therefore
  // reach the *other* table, and get sixty questions rather than nothing.
  it('reads an exam sitting from exam_item, having frozen nothing', async () => {
    const started = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-07',
      questionCount: 60,
    });

    const frozen = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM attempt_question WHERE attempt_id = ${started.id}::uuid
    `);
    expect(frozen.rows[0]?.n).toBe(0);

    const questions = await getSittingQuestions(db, {
      id: started.id,
      mode: 'exam',
      examId: 'exam-07',
    });
    expect(questions).toHaveLength(60);
    expect(questions.map((q) => q.seq)).toEqual(Array.from({ length: 60 }, (_, i) => i));
  });

  it('lays an exam sitting out exactly as the paper read does', async () => {
    const started = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-03',
      questionCount: 60,
    });
    const viaHelper = await getSittingQuestions(db, {
      id: started.id,
      mode: 'exam',
      examId: 'exam-03',
    });
    const { getPaperQuestions } = await import('../../src/db/queries/paper.ts');
    expect(viaHelper).toEqual(await getPaperQuestions(db, 'exam-03'));
  });
});
