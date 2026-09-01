import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { listExams } from '../../src/db/queries/exams.ts';
import { createAttempt } from '../../src/db/queries/attempt.ts';
import {
  assertSeeded,
  createTestUser,
  deleteAllTestUsers,
  testUserId,
} from './support.ts';

const hasDatabase = Boolean(process.env.DATABASE_URL);

const userId = testUserId('exams');
const otherId = testUserId('exams-other');

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

/** Finish a sitting with a score, the way submit will. */
async function submit(attemptId: string, score: number): Promise<void> {
  await db.execute(sql`
    UPDATE attempt SET submitted_at = now(), submit_reason = 'user', score = ${score}
    WHERE id = ${attemptId}
  `);
}

async function row(examId: string) {
  const rows = await listExams(db, userId);
  return rows.find((r) => r.id === examId);
}

describe.skipIf(!hasDatabase)('the exam list', () => {
  it('returns all sixteen papers in order, in one query', async () => {
    const rows = await listExams(db, userId);

    expect(rows).toHaveLength(16);
    expect(rows.map((r) => r.number)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
    expect(rows.every((r) => r.questionCount === 60)).toBe(true);
  });

  // The zero-data state, at the query rather than the screen. Nulls, not zeros —
  // a score of 0 means a sitting happened and went badly, which is a different
  // fact from never having sat.
  it('reports a never-sat paper as null scores and no attempts', async () => {
    const paper = await row('exam-16');

    expect(paper?.attempts).toBe(0);
    expect(paper?.bestScore).toBeNull();
    expect(paper?.firstAttemptScore).toBeNull();
    expect(paper?.openAttemptId).toBeNull();
  });

  it('reports a sitting still running so the paper can offer to resume', async () => {
    const started = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-01',
      questionCount: 60,
    });

    const paper = await row('exam-01');
    expect(paper?.openAttemptId).toBe(started.id);
    // Counted immediately: an abandoned sitting is still a sitting.
    expect(paper?.attempts).toBe(1);
    // But it has no score yet, so it is not "sat" for scoring purposes.
    expect(paper?.bestScore).toBeNull();
  });

  it('stops offering to resume once the sitting is finished', async () => {
    const paper = await row('exam-01');
    await submit(paper?.openAttemptId as string, 42);

    const after = await row('exam-01');
    expect(after?.openAttemptId).toBeNull();
    expect(after?.bestScore).toBe(42);
    expect(after?.firstAttemptScore).toBe(42);
  });

  // The whole reason both numbers exist. Best drifts upward with practice;
  // first-attempt must not move, or the honest signal is lost.
  it('raises best but leaves first-attempt alone on a better re-sit', async () => {
    const second = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-01',
      questionCount: 60,
    });
    await submit(second.id, 55);

    const paper = await row('exam-01');
    expect(paper?.bestScore).toBe(55);
    expect(paper?.firstAttemptScore).toBe(42);
    expect(paper?.attempts).toBe(2);
  });

  it('leaves both alone on a worse re-sit', async () => {
    const third = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-01',
      questionCount: 60,
    });
    await submit(third.id, 20);

    const paper = await row('exam-01');
    expect(paper?.bestScore).toBe(55);
    expect(paper?.firstAttemptScore).toBe(42);
    expect(paper?.attempts).toBe(3);
  });

  it('counts a zero-scoring sitting as sat rather than as never attempted', async () => {
    const started = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-02',
      questionCount: 60,
    });
    await submit(started.id, 0);

    const paper = await row('exam-02');
    expect(paper?.bestScore).toBe(0);
    expect(paper?.firstAttemptScore).toBe(0);
  });

  it('ignores practice and domain sittings entirely', async () => {
    // Those modes have no paper and no score; they must not appear against one.
    await createAttempt(db, { userId, mode: 'practice', questionCount: 60 });
    await createAttempt(db, { userId, mode: 'domain', domain: 'security', questionCount: 20 });

    const rows = await listExams(db, userId);
    const total = rows.reduce((sum, r) => sum + r.attempts, 0);
    expect(total).toBe(4); // three against exam-01, one against exam-02
  });

  // The ownership rule, at the only seam where a second user can exist at all.
  it('never shows another candidate\'s history', async () => {
    const theirs = await createAttempt(db, {
      userId: otherId,
      mode: 'exam',
      examId: 'exam-05',
      questionCount: 60,
    });
    await submit(theirs.id, 60);

    const mine = await row('exam-05');
    expect(mine?.attempts).toBe(0);
    expect(mine?.bestScore).toBeNull();
    expect(mine?.openAttemptId).toBeNull();

    const theirRows = await listExams(db, otherId);
    expect(theirRows.find((r) => r.id === 'exam-05')?.bestScore).toBe(60);
    // And mine does not leak the other way either.
    expect(theirRows.find((r) => r.id === 'exam-01')?.attempts).toBe(0);
  });
});
