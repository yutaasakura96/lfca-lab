import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { recordAnswer } from '../../src/db/queries/answer.ts';
import { createAttempt } from '../../src/db/queries/attempt.ts';
import { getQuestionKey, getRecordedVerdicts } from '../../src/db/queries/feedback.ts';
import { freezeAttemptQuestions, getComposedQuestions } from '../../src/db/queries/paper.ts';
import { firstUnansweredSeq, type GradedRecord } from '../../src/domain/navigator.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const userId = testUserId('composed-sitting');
const otherId = testUserId('composed-sitting-other');

/** A handful of real, seeded, non-holdout question ids, in a fixed order. */
async function someQuestionIds(n: number): Promise<string[]> {
  const rows = await db.execute<{ id: string }>(sql`
    SELECT id FROM question WHERE pool = 'exam' AND is_holdout = false ORDER BY id LIMIT ${n}
  `);
  return rows.rows.map((r) => r.id);
}

async function startSitting(owner: string, ids: readonly string[]) {
  const started = await createAttempt(db, {
    userId: owner,
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
  await createTestUser(otherId);
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

describe.skipIf(!hasDatabase)('what the sitting screen reads', () => {
  it('carries the competency and the concept id, which the question head shows', async () => {
    const ids = await someQuestionIds(3);
    const started = await startSitting(userId, ids);

    const questions = await getComposedQuestions(db, started.id);
    for (const question of questions) {
      // `Linux Fundamentals :: Command Line` — both halves, as the bank writes
      // it, so the domain's own name is derivable without a label map here.
      expect(question.competency).toMatch(/ :: /);
      expect(question.conceptId.length).toBeGreaterThan(0);
    }
  });

  it('does not put every correct answer at A', async () => {
    // The finding this projection exists for, asserted against the real bank
    // rather than a fixture: the key is authored **first** in all 1,150
    // questions, so a sitting rendered in authored order would be answerable
    // without reading anything.
    const ids = await someQuestionIds(20);
    const started = await startSitting(userId, ids);

    const questions = await getComposedQuestions(db, started.id);
    const slots = new Set<number>();
    for (const question of questions) {
      const key = await getQuestionKey(db, question.id);
      slots.add(question.options.findIndex((o) => o.ref === key.correctRef));
    }

    expect(slots.has(-1)).toBe(false);
    // Four slots over twenty questions. Anything less is either the bug this
    // replaced or a hash that has stopped mixing.
    expect([...slots].sort()).toEqual([0, 1, 2, 3]);
  });

  it('lays the same question out the same way on every read', async () => {
    // A reload must not move the options: the verdict bar names a letter.
    const ids = await someQuestionIds(5);
    const started = await startSitting(userId, ids);

    const once = await getComposedQuestions(db, started.id);
    const again = await getComposedQuestions(db, started.id);
    expect(again.map((q) => q.options.map((o) => o.ref))).toEqual(
      once.map((q) => q.options.map((o) => o.ref)),
    );
  });

  it('still puts nothing but a ref and a text on the wire for each option', async () => {
    const ids = await someQuestionIds(2);
    const started = await startSitting(userId, ids);

    const questions = await getComposedQuestions(db, started.id);
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      for (const option of question.options) {
        expect(Object.keys(option).sort()).toEqual(['ref', 'text']);
      }
    }
  });
});

describe.skipIf(!hasDatabase)('restoring what a graded sitting has scored', () => {
  it('reports the verdict of every answered question and nothing about the rest', async () => {
    const ids = await someQuestionIds(4);
    const started = await startSitting(userId, ids);

    const key = await getQuestionKey(db, ids[0]!);
    const wrongRef = ['o1', 'o2', 'o3', 'o4'].find((ref) => ref !== key.correctRef)!;

    await recordAnswer(db, { attemptId: started.id, questionId: ids[0]!, optionRef: key.correctRef });
    await recordAnswer(db, { attemptId: started.id, questionId: ids[1]!, optionRef: wrongRef });

    const verdicts = await getRecordedVerdicts(db, userId, started.id);

    expect(verdicts).toHaveLength(2);
    expect(verdicts.find((v) => v.questionId === ids[0])).toMatchObject({ isCorrect: true });
    expect(verdicts.find((v) => v.questionId === ids[1])).toMatchObject({ isCorrect: false });
    // Nothing is said about a question that has not been answered — the
    // candidate has not been told anything about it, and this read must not be
    // the first thing that does.
    expect(verdicts.map((v) => v.questionId)).not.toContain(ids[2]);
  });

  it('leaves out a row whose answer was cleared', async () => {
    const ids = await someQuestionIds(2);
    const started = await startSitting(userId, ids);

    await recordAnswer(db, { attemptId: started.id, questionId: ids[0]!, optionRef: 'o1' });
    await recordAnswer(db, { attemptId: started.id, questionId: ids[0]!, optionRef: null });

    expect(await getRecordedVerdicts(db, userId, started.id)).toEqual([]);
  });

  it("reads the sitting's own recorded correctness, not today's bank", async () => {
    // Doc 04 §5.3: the column is denormalised precisely so a later correction
    // to the bank cannot rewrite what a sitting scored. Forced to disagree, and
    // the row is what must win.
    const ids = await someQuestionIds(1);
    const started = await startSitting(userId, ids);
    const key = await getQuestionKey(db, ids[0]!);

    await recordAnswer(db, { attemptId: started.id, questionId: ids[0]!, optionRef: key.correctRef });
    await db.execute(sql`
      UPDATE answer SET is_correct = false
      WHERE attempt_id = ${started.id}::uuid AND question_id = ${ids[0]!}
    `);

    const verdicts = await getRecordedVerdicts(db, userId, started.id);
    expect(verdicts[0]).toMatchObject({ optionRef: key.correctRef, isCorrect: false });
  });

  it("reads as empty for somebody else's sitting", async () => {
    // Ownership is in the query rather than checked before it, so a sitting
    // that is not yours reads the same as one with nothing recorded on it.
    const ids = await someQuestionIds(2);
    const theirs = await startSitting(otherId, ids);
    await recordAnswer(db, { attemptId: theirs.id, questionId: ids[0]!, optionRef: 'o1' });

    expect(await getRecordedVerdicts(db, otherId, theirs.id)).toHaveLength(1);
    expect(await getRecordedVerdicts(db, userId, theirs.id)).toEqual([]);
  });
});

describe.skipIf(!hasDatabase)('resuming', () => {
  /** What the page builds from the two reads, in one place, as the page does. */
  async function restore(attemptId: string, owner: string) {
    const questions = await getComposedQuestions(db, attemptId);
    const verdicts = await getRecordedVerdicts(db, owner, attemptId);

    const initial: Record<string, GradedRecord> = {};
    for (const question of questions) initial[question.id] = { optionRef: null, isCorrect: null };
    for (const verdict of verdicts) {
      initial[verdict.questionId] = { optionRef: verdict.optionRef, isCorrect: verdict.isCorrect };
    }
    return { questions, initial };
  }

  it('opens on the first unanswered question after answering the first three', async () => {
    const ids = await someQuestionIds(6);
    const started = await startSitting(userId, ids);
    for (const id of ids.slice(0, 3)) {
      await recordAnswer(db, { attemptId: started.id, questionId: id, optionRef: 'o1' });
    }

    const { questions, initial } = await restore(started.id, userId);
    expect(firstUnansweredSeq(questions, initial)).toBe(3);
  });

  it('opens on the last question once every one has been answered', async () => {
    const ids = await someQuestionIds(3);
    const started = await startSitting(userId, ids);
    for (const id of ids) {
      await recordAnswer(db, { attemptId: started.id, questionId: id, optionRef: 'o1' });
    }

    const { questions, initial } = await restore(started.id, userId);
    const seq = firstUnansweredSeq(questions, initial);
    expect(seq).toBe(2);
    // The one case where a key has to be restored with the position: an
    // answered question is on screen at load.
    expect(initial[questions[seq]!.id]?.optionRef).not.toBeNull();
  });
});
