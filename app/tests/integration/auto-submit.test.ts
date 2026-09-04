import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { recordAnswer } from '../../src/db/queries/answer.ts';
import { createAttempt, getAttemptForUser } from '../../src/db/queries/attempt.ts';
import { getPaperQuestions } from '../../src/db/queries/paper.ts';
import { finaliseExpiredSittings, finaliseIfExpired } from '../../src/lib/auto-submit.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Auto-submit, against real Postgres.
//
// Every claim here is a claim about a row that was written without anyone
// pressing anything, which is exactly what no pure function can assert. The
// clock being derived is what makes the setup honest: a sitting is aged by
// moving `started_at` backwards, and nothing anywhere holds a countdown that
// would have to be moved with it.

const userId = testUserId('auto');
/** A candidate who has never sat exam-02, so "the first attempt" means the first. */
const freshId = testUserId('auto-fresh');
/** A bystander, to prove the sweep is scoped to one candidate. */
const otherId = testUserId('auto-other');

let questions: Awaited<ReturnType<typeof getPaperQuestions>>;
const correctRef = new Map<string, string>();

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  await createTestUser(freshId);
  await createTestUser(otherId);

  questions = await getPaperQuestions(db, 'exam-02');

  const keys = await db.execute<{ question_id: string; ref: string }>(sql`
    SELECT o.question_id, o.ref
    FROM question_option o
    JOIN exam_item ei ON ei.question_id = o.question_id
    WHERE ei.exam_id = 'exam-02' AND o.correct
  `);
  for (const row of keys.rows) correctRef.set(row.question_id, row.ref);
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

/** A sitting of exam-02 with `correct` questions answered right. */
async function sitting(correct: number, candidate = userId): Promise<string> {
  const started = await createAttempt(db, {
    userId: candidate,
    mode: 'exam',
    examId: 'exam-02',
    questionCount: questions.length,
  });
  for (const question of questions.slice(0, correct)) {
    await recordAnswer(db, {
      attemptId: started.id,
      questionId: question.id,
      optionRef: correctRef.get(question.id)!,
    });
  }
  return started.id;
}

/**
 * Move a sitting's start backwards so its ninety minutes have elapsed.
 *
 * This works — and only works — because the clock is derived. There is no
 * stored countdown to move with it, so ageing the one column that decides the
 * deadline is the whole of the setup.
 */
async function age(attemptId: string, hours = 3): Promise<void> {
  await db.execute(sql`
    UPDATE attempt SET started_at = now() - ${`${hours} hours`}::interval
    WHERE id = ${attemptId}::uuid
  `);
}

async function reload(attemptId: string, candidate = userId) {
  const attempt = await getAttemptForUser(db, candidate, attemptId);
  if (attempt === null) throw new Error('The attempt vanished.');
  return attempt;
}

describe.skipIf(!hasDatabase)('finalising one expired sitting on read', () => {
  it('submits it as it stood, and records that the clock ran out', async () => {
    const id = await sitting(7);
    await age(id);

    const result = await finaliseIfExpired(db, await reload(id), new Date());

    expect(result.closedOnRead).toBe(true);
    expect(result.attempt.submittedAt).not.toBeNull();
    expect(result.attempt.submitReason).toBe('expired');
    expect(result.attempt.score).toBe(7);
  });

  it('leaves the row saying the same thing on a second read', async () => {
    const id = await sitting(4);
    await age(id);

    const first = await finaliseIfExpired(db, await reload(id), new Date());
    const second = await finaliseIfExpired(db, await reload(id), new Date());

    // Not closed *by this read* — it was already over. The figures are the
    // first caller's, which is the same rule a second submit follows.
    expect(second.closedOnRead).toBe(false);
    expect(second.attempt.score).toBe(4);
    expect(second.attempt.submittedAt?.getTime()).toBe(first.attempt.submittedAt?.getTime());
  });

  it('does not touch a sitting whose clock is still running', async () => {
    const id = await sitting(2);

    const result = await finaliseIfExpired(db, await reload(id), new Date());

    expect(result.closedOnRead).toBe(false);
    expect(result.attempt.submittedAt).toBeNull();
    expect((await reload(id)).submittedAt).toBeNull();
  });

  it('never finalises a sitting with no clock, however old', async () => {
    const started = await createAttempt(db, {
      userId,
      mode: 'practice',
      questionCount: 60,
    });
    await age(started.id, 500);

    const result = await finaliseIfExpired(db, await reload(started.id), new Date());

    expect(result.closedOnRead).toBe(false);
    expect(result.attempt.submittedAt).toBeNull();
  });

  it('keeps the first-attempt flag on an abandoned first sitting', async () => {
    // PRD §5's whole point: quitting badly must not un-sit a paper. The flag
    // was settled at creation, and finalising an hour later cannot move it.
    const id = await sitting(3, freshId);
    await age(id);

    await finaliseIfExpired(db, await reload(id, freshId), new Date());

    const flags = await db.execute<{ is_first_attempt: boolean; score: number }>(sql`
      SELECT is_first_attempt, score FROM attempt WHERE id = ${id}::uuid
    `);
    expect(flags.rows[0]?.is_first_attempt).toBe(true);
    expect(flags.rows[0]?.score).toBe(3);
  });
});

describe.skipIf(!hasDatabase)('sweeping a candidate’s expired sittings', () => {
  it('finalises every one of theirs, and none of anybody else’s', async () => {
    const mine = await sitting(1);
    const alsoMine = await sitting(2);
    const running = await sitting(3);
    const theirs = await sitting(4, otherId);
    await age(mine);
    await age(alsoMine);
    await age(theirs);

    const closed = await finaliseExpiredSittings(db, userId, new Date());

    expect(closed).toBe(2);
    expect((await reload(mine)).submitReason).toBe('expired');
    expect((await reload(alsoMine)).submitReason).toBe('expired');
    expect((await reload(running)).submittedAt).toBeNull();
    expect((await reload(theirs, otherId)).submittedAt).toBeNull();
  });

  it('is a no-op when nothing has expired', async () => {
    // Run straight after the sweep above, which left this candidate with only
    // running sittings: a second sweep must find nothing rather than re-close
    // what it closed a moment ago.
    await sitting(1);
    expect(await finaliseExpiredSittings(db, userId, new Date())).toBe(0);
  });
});
