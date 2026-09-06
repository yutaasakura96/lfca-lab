import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import {
  getAttemptForUser,
  startComposedSitting,
  type ComposedAttempt,
} from '../../src/db/queries/attempt.ts';
import { getSittingQuestions } from '../../src/db/queries/paper.ts';
import {
  selectDomainQuestions,
  selectHoldoutQuestions,
  selectPracticeQuestions,
} from '../../src/db/queries/selection.ts';
import { quotaFor, WEIGHTED_SITTING_LENGTHS } from '../../src/domain/weights.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

/**
 * Without a connection string there is nothing to integrate with, so this file
 * skips rather than fails, exactly as its neighbours do.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL);

// Starting a composed sitting, against real Postgres.
//
// #31 proved the frozen set reads back; #32 proved the quota tables are right.
// What is only true once the two are joined is that a *started* sitting has the
// shape its length claims, is written down whole or not at all, and never holds
// a holdout item. Those are claims about rows, and the composition runs through
// `random()`, so they cannot be asserted against a pure function.

const userId = testUserId('start-sitting');

let holdoutIds: Set<string>;
/** Every question's domain, so a composed set can be counted by domain. */
let domainOf: Map<string, string>;

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);

  holdoutIds = new Set(await selectHoldoutQuestions(db));

  const rows = await db.execute<{ id: string; domain: string }>(
    sql`SELECT id, domain FROM question`,
  );
  domainOf = new Map(rows.rows.map((r) => [r.id, r.domain]));
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

async function countAttempts(): Promise<number> {
  const r = await db.execute<{ n: number }>(
    sql`SELECT count(*)::int AS n FROM attempt WHERE user_id = ${userId}`,
  );
  return r.rows[0]?.n ?? 0;
}

/** The ids one sitting asked, in its own order, read back from the database. */
async function frozenIds(attemptId: string): Promise<string[]> {
  const rows = await db.execute<{ question_id: string }>(sql`
    SELECT question_id FROM attempt_question
    WHERE attempt_id = ${attemptId}::uuid
    ORDER BY seq ASC
  `);
  return rows.rows.map((r) => r.question_id);
}

function countByDomain(ids: readonly string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const id of ids) {
    const domain = domainOf.get(id) as string;
    counts[domain] = (counts[domain] ?? 0) + 1;
  }
  return counts;
}

describe.skipIf(!hasDatabase)('starting a practice sitting', () => {
  // Every length, against the real bank rather than a fixture. The pinned table
  // is asserted here as a property of what reached Postgres, not of what the
  // composer returned — those are the same numbers only if the freeze is
  // faithful, and the freeze is the thing under test.
  it.each(WEIGHTED_SITTING_LENGTHS)('freezes exactly the pinned shape at %i', async (length) => {
    const composed = await selectPracticeQuestions(db, userId, length);
    const started = await startComposedSitting(db, { userId, mode: 'practice' }, composed);

    const stored = await frozenIds(started.id);
    expect(stored).toEqual(composed);
    expect(stored).toHaveLength(length);
    expect(new Set(stored).size).toBe(length);
    expect(countByDomain(stored)).toEqual(quotaFor(length));

    const row = await getAttemptForUser(db, userId, started.id);
    expect(row?.questionCount).toBe(length);
  });

  it('has no clock, no flag and no score', async () => {
    const composed = await selectPracticeQuestions(db, userId, 20);
    const started = await startComposedSitting(db, { userId, mode: 'practice' }, composed);

    expect(started.deadline).toBeNull();
    expect(started.isFirstAttempt).toBe(false);

    const row = await db.execute<{
      time_limit_seconds: number | null;
      is_first_attempt: boolean;
      score: number | null;
      exam_id: string | null;
      domain: string | null;
    }>(sql`
      SELECT time_limit_seconds, is_first_attempt, score, exam_id, domain
      FROM attempt WHERE id = ${started.id}
    `);
    expect(row.rows[0]).toEqual({
      time_limit_seconds: null,
      is_first_attempt: false,
      score: null,
      exam_id: null,
      domain: null,
    });
  });
});

describe.skipIf(!hasDatabase)('starting a domain sitting', () => {
  it('asks only that domain, twenty of them', async () => {
    const composed = await selectDomainQuestions(db, userId, 'security', 20);
    const started = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'security' },
      composed,
    );

    const stored = await frozenIds(started.id);
    expect(stored).toHaveLength(20);
    expect(countByDomain(stored)).toEqual({ security: 20 });

    const row = await getAttemptForUser(db, userId, started.id);
    expect(row?.domain).toBe('security');
    expect(row?.questionCount).toBe(20);
  });

  // `all` is the one length that is a fact about the pool rather than a number
  // the candidate picked, so what matters is that the column records what was
  // actually written down — never the number asked for, because none was.
  it('takes the whole non-holdout exam pool for `all`, and records that count', async () => {
    const composed = await selectDomainQuestions(db, userId, 'pm', 'all');
    const started = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'pm' },
      composed,
    );

    const available = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM question
      WHERE domain = 'pm' AND pool = 'exam' AND is_holdout = false
    `);

    const stored = await frozenIds(started.id);
    expect(stored).toHaveLength(available.rows[0]?.n as number);

    const row = await getAttemptForUser(db, userId, started.id);
    expect(row?.questionCount).toBe(stored.length);
  });
});

describe.skipIf(!hasDatabase)('what a composed sitting can never contain', () => {
  // The third of the three independent locks, observed at the only place a
  // candidate could actually meet a holdout item early: a started sitting.
  it('never freezes a holdout id, in either mode', async () => {
    const sittings: ComposedAttempt[] = [
      { userId, mode: 'practice' },
      { userId, mode: 'domain', domain: 'cloud' },
      { userId, mode: 'domain', domain: 'sysadmin' },
    ];
    const compositions = [
      await selectPracticeQuestions(db, userId, 60),
      await selectDomainQuestions(db, userId, 'cloud', 'all'),
      await selectDomainQuestions(db, userId, 'sysadmin', 40),
    ];

    for (const [i, input] of sittings.entries()) {
      const started = await startComposedSitting(db, input, compositions[i] as string[]);
      const stored = await frozenIds(started.id);
      expect(stored.filter((id) => holdoutIds.has(id)), input.domain ?? input.mode).toEqual([]);
    }
  });
});

describe.skipIf(!hasDatabase)('the set is frozen', () => {
  it('reads back identically, twice, in its own order', async () => {
    const composed = await selectDomainQuestions(db, userId, 'devops', 20);
    const started = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'devops' },
      composed,
    );

    const first = await getSittingQuestions(db, { id: started.id, mode: 'domain', examId: null });
    const second = await getSittingQuestions(db, { id: started.id, mode: 'domain', examId: null });

    expect(first.map((q) => q.id)).toEqual(composed);
    expect(second.map((q) => q.id)).toEqual(first.map((q) => q.id));
    expect(first.map((q) => q.seq)).toEqual(composed.map((_, i) => i));
  });
});

describe.skipIf(!hasDatabase)('a sitting is written whole, or not at all', () => {
  // The transaction, observed rather than assumed. A duplicated id is refused
  // by `attempt_question`'s unique index — a set the composer could only have
  // produced by breaking — and the attempt must go with it. Without the
  // transaction this leaves an attempt row with no questions: a sitting that
  // exists and cannot be rendered.
  it('rolls the attempt back when its questions cannot be written', async () => {
    const composed = await selectDomainQuestions(db, userId, 'linux', 20);
    const duplicated = [...composed, composed[0] as string];

    const before = await countAttempts();
    await expect(
      startComposedSitting(db, { userId, mode: 'domain', domain: 'linux' }, duplicated),
    ).rejects.toThrow();
    expect(await countAttempts()).toBe(before);
  });

  // Zero is unreachable against the real bank — the smallest non-holdout exam
  // pool is a hundred — and reachable against a broken seed. It fails before
  // the transaction opens, so no half-sitting is stored and the caller gets a
  // 500 rather than a 4xx: the request was fine, the bank is not.
  it('refuses to start a sitting of nothing, and writes no attempt', async () => {
    const before = await countAttempts();
    await expect(startComposedSitting(db, { userId, mode: 'practice' }, [])).rejects.toThrow(
      /no questions/i,
    );
    expect(await countAttempts()).toBe(before);
  });
});

describe.skipIf(!hasDatabase)('an exam sitting is still not composed here', () => {
  // The counterpart assertion to #31's. A paper is stored once, in `exam_item`;
  // if this ever starts writing rows, a paper's order has two homes.
  it('writes no attempt_question rows for the sixteen', async () => {
    const rows = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n
      FROM attempt_question aq JOIN attempt a ON a.id = aq.attempt_id
      WHERE a.user_id = ${userId} AND a.mode = 'exam'
    `);
    expect(rows.rows[0]?.n).toBe(0);
  });
});
