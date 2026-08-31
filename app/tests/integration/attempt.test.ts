import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { createAttempt } from '../../src/db/queries/attempt.ts';
import {
  assertSeeded,
  createTestUser,
  deleteAllTestUsers,
  testUserId,
} from './support.ts';

/**
 * Without a connection string there is nothing to integrate with, so this file
 * skips rather than fails. The unit suite is the one that must run anywhere —
 * a contributor with no database, or CI before its branch exists, should get a
 * green run and an honest "skipped", not a wall of connection errors.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL);

// Attempt creation, against real Postgres.
//
// The pure rule is tested next door without a database. What can only be tested
// here is the part the database owns: that the unique partial index turns a
// race into an error rather than a second honest score, and that the check
// constraints refuse an incoherent attempt instead of storing one.

const userId = testUserId('attempt');

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

/**
 * Assert that a statement was refused by a *named* constraint.
 *
 * Matching the error message is not enough: Drizzle wraps driver errors, so the
 * message the caller sees is "Failed query: …" and the constraint name is on
 * the `cause`. A test that matched the message would pass on any failure at
 * all — including a typo in the SQL — which is worse than no test.
 */
async function refusedBy(name: string, run: Promise<unknown>): Promise<void> {
  let caught: unknown;
  try {
    await run;
  } catch (error) {
    caught = error;
  }
  expect(caught, `expected ${name} to refuse this statement`).toBeDefined();

  const names: string[] = [];
  for (let e: unknown = caught; e != null; e = (e as { cause?: unknown }).cause) {
    const constraint = (e as { constraint?: string }).constraint;
    if (constraint !== undefined) names.push(constraint);
  }
  expect(names, `refused by ${names.join(', ') || 'no named constraint'}`).toContain(name);
}

async function countAttempts(): Promise<number> {
  const r = await db.execute<{ n: number }>(
    sql`SELECT count(*)::int AS n FROM attempt WHERE user_id = ${userId}`,
  );
  return r.rows[0]?.n ?? 0;
}

describe.skipIf(!hasDatabase)('starting an exam sitting', () => {
  it('claims the first-attempt flag and starts the clock', async () => {
    const started = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-01',
      questionCount: 60,
    });

    expect(started.isFirstAttempt).toBe(true);
    expect(started.deadline).not.toBeNull();
    // 90 minutes after the start, computed from the row the database wrote.
    expect((started.deadline as Date).getTime() - started.startedAt.getTime()).toBe(5400 * 1000);
  });

  it('refuses the flag to a second sitting of the same paper', async () => {
    const second = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-01',
      questionCount: 60,
    });
    expect(second.isFirstAttempt).toBe(false);
  });

  it('still claims the flag for a different paper', async () => {
    const other = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-02',
      questionCount: 60,
    });
    expect(other.isFirstAttempt).toBe(true);
  });

  // The race, run for real. Both callers evaluate "no earlier attempt exists"
  // against a paper nobody has sat; exactly one may end up with the flag, and
  // the loser must record a sitting rather than lose one.
  it('survives simultaneous starts — one flag, no lost attempts', async () => {
    const before = await countAttempts();

    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        createAttempt(db, { userId, mode: 'exam', examId: 'exam-03', questionCount: 60 }),
      ),
    );

    expect(results.filter((r) => r.isFirstAttempt)).toHaveLength(1);
    expect(await countAttempts()).toBe(before + 5);

    const flagged = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM attempt
      WHERE user_id = ${userId} AND exam_id = 'exam-03' AND is_first_attempt
    `);
    expect(flagged.rows[0]?.n).toBe(1);
  });
});

describe.skipIf(!hasDatabase)('starting an unscored sitting', () => {
  it('never claims the flag, and has no clock', async () => {
    for (const mode of ['practice', 'holdout'] as const) {
      const started = await createAttempt(db, {
        userId,
        mode,
        questionCount: mode === 'holdout' ? 40 : 60,
      });
      expect(started.isFirstAttempt, mode).toBe(false);
      if (mode === 'practice') expect(started.deadline).toBeNull();
    }
  });

  it('times the holdout at sixty minutes', async () => {
    const started = await createAttempt(db, { userId, mode: 'holdout', questionCount: 40 });
    expect((started.deadline as Date).getTime() - started.startedAt.getTime()).toBe(3600 * 1000);
  });

  it('records the chosen domain for a domain sitting', async () => {
    const started = await createAttempt(db, {
      userId,
      mode: 'domain',
      domain: 'security',
      questionCount: 20,
    });
    expect(started.deadline).toBeNull();

    const row = await db.execute<{ domain: string; question_count: number }>(
      sql`SELECT domain, question_count FROM attempt WHERE id = ${started.id}`,
    );
    expect(row.rows[0]?.domain).toBe('security');
    expect(row.rows[0]?.question_count).toBe(20);
  });
});

describe.skipIf(!hasDatabase)('the check constraints refuse an incoherent attempt', () => {
  // These are the constraints doc 04 §5.1 calls "the schema, not decoration".
  // Asserting they bite is the difference between a rule and a comment.
  it('refuses an exam sitting with no paper', async () => {
    await refusedBy(
      'attempt_exam_iff_exam_mode',
      db.execute(sql`
        INSERT INTO attempt (user_id, mode, question_count, time_limit_seconds)
        VALUES (${userId}, 'exam', 60, 5400)
      `),
    );
  });

  it('refuses a domain sitting with no domain', async () => {
    await refusedBy(
      'attempt_domain_iff_domain_mode',
      db.execute(sql`
        INSERT INTO attempt (user_id, mode, question_count)
        VALUES (${userId}, 'domain', 20)
      `),
    );
  });

  it('refuses a practice sitting with a clock', async () => {
    await refusedBy(
      'attempt_limit_iff_timed_mode',
      db.execute(sql`
        INSERT INTO attempt (user_id, mode, question_count, time_limit_seconds)
        VALUES (${userId}, 'practice', 60, 5400)
      `),
    );
  });

  it('refuses a score above the sitting length', async () => {
    await refusedBy(
      'attempt_score_within_length',
      db.execute(sql`
        INSERT INTO attempt (user_id, mode, exam_id, question_count, time_limit_seconds,
                             submitted_at, submit_reason, score)
        VALUES (${userId}, 'exam', 'exam-04', 60, 5400, now(), 'user', 61)
      `),
    );
  });

  it('refuses a submitted attempt with no reason', async () => {
    await refusedBy(
      'attempt_reason_iff_submitted',
      db.execute(sql`
        INSERT INTO attempt (user_id, mode, exam_id, question_count, time_limit_seconds, submitted_at)
        VALUES (${userId}, 'exam', 'exam-05', 60, 5400, now())
      `),
    );
  });
});
