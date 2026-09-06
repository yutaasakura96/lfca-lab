import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { createAttempt, listOpenSittings, startComposedSitting } from '../../src/db/queries/attempt.ts';
import { domainCandidates } from '../../src/db/queries/selection.ts';
import { submitAttempt } from '../../src/db/queries/submit.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

/**
 * What the home screen offers to resume.
 *
 * The interesting assertions are the negatives: a finished sitting must not
 * appear, and another candidate's must not either. A resume card offering
 * somebody else's sitting is the ownership failure doc 03 §9 calls the single
 * most important check in the app, so it is asserted here rather than trusted
 * to the screen.
 */

const hasDatabase = Boolean(process.env.DATABASE_URL);

const userId = testUserId('open-sittings');
const otherId = testUserId('open-sittings-other');

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

describe.skipIf(!hasDatabase)('listOpenSittings', () => {
  it('is empty for a candidate who has started nothing', async () => {
    expect(await listOpenSittings(db, userId)).toEqual([]);
  });

  it('reports a composed sitting with its own progress', async () => {
    const asked = (await domainCandidates(db, userId, 'devops')).slice(0, 5);
    const attempt = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'devops' },
      asked,
    );
    await answer(attempt.id, asked[0]!);
    await answer(attempt.id, asked[1]!);

    const open = await listOpenSittings(db, userId);
    expect(open).toHaveLength(1);
    expect(open[0]).toMatchObject({
      id: attempt.id,
      mode: 'domain',
      domain: 'devops',
      // Named from the bank, so the card can say which domain was left open.
      domainName: 'DevOps Fundamentals',
      examNumber: null,
      questionCount: 5,
      answered: 2,
    });
  });

  it('carries an exam sitting its paper number, for the card that names it', async () => {
    const attempt = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-07',
      questionCount: 60,
    });

    const open = await listOpenSittings(db, userId);
    const exam = open.find((row) => row.id === attempt.id);
    expect(exam).toMatchObject({
      mode: 'exam',
      examNumber: 7,
      domain: null,
      domainName: null,
      answered: 0,
    });
  });

  it('drops a sitting once it is finished', async () => {
    const before = await listOpenSittings(db, userId);
    const target = before.find((row) => row.mode === 'domain')!;

    await submitAttempt(db, { attemptId: target.id, reason: 'user', scored: false });

    const after = await listOpenSittings(db, userId);
    expect(after.map((row) => row.id)).not.toContain(target.id);
  });

  it('never reports another candidate’s sitting', async () => {
    const asked = (await domainCandidates(db, otherId, 'pm')).slice(0, 3);
    await startComposedSitting(db, { userId: otherId, mode: 'domain', domain: 'pm' }, asked);

    const mine = await listOpenSittings(db, userId);
    expect(mine.every((row) => row.domain !== 'pm')).toBe(true);
  });

  it('lists the longest-running sitting first', async () => {
    const asked = (await domainCandidates(db, userId, 'cloud')).slice(0, 3);
    await startComposedSitting(db, { userId, mode: 'domain', domain: 'cloud' }, asked);

    const open = await listOpenSittings(db, userId);
    const startedAt = open.map((row) => row.startedAt.getTime());
    expect([...startedAt].sort((a, b) => a - b)).toEqual(startedAt);
  });
});

/** Record an answer, so the card's "n of m answered" has something to count. */
async function answer(attemptId: string, questionId: string): Promise<void> {
  await db.execute(sql`
    INSERT INTO answer (attempt_id, question_id, option_ref, is_correct, answered_at)
    VALUES (${attemptId}, ${questionId}, 'o1', true, now())
    ON CONFLICT (attempt_id, question_id) DO NOTHING
  `);
}
