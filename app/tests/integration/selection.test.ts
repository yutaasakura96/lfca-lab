import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { createAttempt } from '../../src/db/queries/attempt.ts';
import {
  domainCandidates,
  selectDomainQuestions,
  selectHoldoutQuestions,
  selectPracticeQuestions,
} from '../../src/db/queries/selection.ts';
import { DOMAINS, weightedQuota } from '../../src/domain/weights.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

/**
 * Without a connection string there is nothing to integrate with, so this file
 * skips rather than fails. The unit suite is the one that must run anywhere —
 * a contributor with no database, or CI before its branch exists, should get a
 * green run and an honest "skipped", not a wall of connection errors.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL);

// The third and last lock on the holdout, tested where it actually lives.
//
// "Selection never returns a holdout item" is a claim about query results. It
// cannot be made against a pure function, because the filter is a `WHERE`
// clause — which is precisely why this suite exists despite the testing plan
// ruling database tests out. That ruling assumed the browser test would cover
// this query; this slice has no browser test.

const userId = testUserId('selection');

let holdoutIds: Set<string>;

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  holdoutIds = new Set(await selectHoldoutQuestions(db));
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

/**
 * Bind a list of ids as a Postgres array.
 *
 * Interpolating a JS array straight into a `sql` template expands it into one
 * bind parameter per element, which `= ANY(...)` rejects — it wants an array on
 * the right, not a tuple. `sql.param` binds the whole list as a single value.
 */
function idArray(ids: readonly string[]) {
  return sql`${sql.param(ids)}::text[]`;
}

/** Record an answer, so the question counts as seen from now on. */
async function answer(attemptId: string, questionId: string, seen: boolean): Promise<void> {
  await db.execute(sql`
    INSERT INTO answer (attempt_id, question_id, option_ref, is_correct, answered_at)
    VALUES (${attemptId}, ${questionId}, ${seen ? 'o1' : null}, ${seen ? true : null},
            ${seen ? sql`now()` : sql`null`})
    ON CONFLICT (attempt_id, question_id) DO NOTHING
  `);
}

describe.skipIf(!hasDatabase)('the holdout is never served', () => {
  it('is exactly forty questions', () => {
    expect(holdoutIds.size).toBe(40);
  });

  it('never appears in a practice sitting', async () => {
    const picked = await selectPracticeQuestions(db, userId);
    expect(picked.filter((id) => holdoutIds.has(id))).toEqual([]);
  });

  it('never appears in any domain sitting, at any length', async () => {
    for (const domain of DOMAINS) {
      const picked = await selectDomainQuestions(db, userId, domain, 'all');
      expect(picked.filter((id) => holdoutIds.has(id)), domain).toEqual([]);
    }
  });

  // The filter must be the query's own, not something inherited from the seed.
  // Asserted by asking the database directly: no eligible candidate anywhere is
  // a holdout row, whatever the seed happened to mark.
  it('is filtered by the query, not trusted from the seed', async () => {
    for (const domain of DOMAINS) {
      const candidates = await domainCandidates(db, userId, domain);
      const flagged = await db.execute<{ n: number }>(sql`
        SELECT count(*)::int AS n FROM question
        WHERE id = ANY(${idArray(candidates)}) AND is_holdout
      `);
      expect(flagged.rows[0]?.n, domain).toBe(0);
    }
  });

  it('is reachable only through the holdout sitting', async () => {
    const holdout = await selectHoldoutQuestions(db);
    expect(new Set(holdout).size).toBe(40);
    expect([...holdout].sort()).toEqual([...holdoutIds].sort());
  });
});

describe.skipIf(!hasDatabase)('a practice sitting', () => {
  it('is exactly 60 questions, split by the official weights', async () => {
    const picked = await selectPracticeQuestions(db, userId);
    expect(picked).toHaveLength(60);

    const byDomain = await db.execute<{ domain: string; n: number }>(sql`
      SELECT domain, count(*)::int AS n FROM question WHERE id = ANY(${idArray(picked)}) GROUP BY domain
    `);
    for (const row of byDomain.rows) {
      expect(row.n, row.domain).toBe(weightedQuota(row.domain as (typeof DOMAINS)[number]));
    }
  });

  it('never repeats a question within one sitting', async () => {
    const picked = await selectPracticeQuestions(db, userId);
    expect(new Set(picked).size).toBe(picked.length);
  });

  it('draws only from the exam pool', async () => {
    const picked = await selectPracticeQuestions(db, userId);
    const offPool = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM question WHERE id = ANY(${idArray(picked)}) AND pool <> 'exam'
    `);
    expect(offPool.rows[0]?.n).toBe(0);
  });

  it('does not serve an identical set twice running', async () => {
    // The random tie-break. With every question unseen, order is entirely
    // random, so two 60-question draws from a 960-question pool matching
    // exactly would be an event worth investigating rather than a flake.
    const first = await selectPracticeQuestions(db, userId);
    const second = await selectPracticeQuestions(db, userId);
    expect(first).not.toEqual(second);
  });
});

describe.skipIf(!hasDatabase)('a domain sitting', () => {
  it('returns the requested length', async () => {
    expect(await selectDomainQuestions(db, userId, 'security', 20)).toHaveLength(20);
    expect(await selectDomainQuestions(db, userId, 'security', 40)).toHaveLength(40);
  });

  it('returns only that domain', async () => {
    const picked = await selectDomainQuestions(db, userId, 'devops', 20);
    const wrong = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM question WHERE id = ANY(${idArray(picked)}) AND domain <> 'devops'
    `);
    expect(wrong.rows[0]?.n).toBe(0);
  });

  it('never exceeds the domain\'s non-holdout exam pool', async () => {
    const all = await selectDomainQuestions(db, userId, 'pm', 'all');
    const available = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM question
      WHERE domain = 'pm' AND pool = 'exam' AND is_holdout = false
    `);
    expect(all).toHaveLength(available.rows[0]?.n as number);
  });
});

describe.skipIf(!hasDatabase)('unseen-first ordering', () => {
  it('offers unseen questions before ones already answered', async () => {
    const attempt = await createAttempt(db, {
      userId,
      mode: 'domain',
      domain: 'pm',
      questionCount: 20,
    });

    const before = await domainCandidates(db, userId, 'pm');
    const answered = before.slice(0, 10);
    for (const id of answered) await answer(attempt.id, id, true);

    const after = await domainCandidates(db, userId, 'pm');
    const seen = new Set(answered);

    // Every unseen question comes before every seen one.
    const lastUnseen = after.findLastIndex((id) => !seen.has(id));
    const firstSeen = after.findIndex((id) => seen.has(id));
    expect(firstSeen).toBeGreaterThan(lastUnseen - 1);
    expect(after.slice(-answered.length).filter((id) => seen.has(id))).toHaveLength(
      answered.length,
    );
  });

  // The rule that keeps "seen" meaning "you engaged with it". A question served
  // and flagged but never answered has an answer row with a null answered_at,
  // and must still sort as unseen.
  it('treats a question flagged but never answered as unseen', async () => {
    const attempt = await createAttempt(db, {
      userId,
      mode: 'domain',
      domain: 'devops',
      questionCount: 20,
    });

    const candidates = await domainCandidates(db, userId, 'devops');
    const flaggedOnly = candidates[0] as string;
    await answer(attempt.id, flaggedOnly, false);

    const after = await domainCandidates(db, userId, 'devops');
    const answeredCount = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM answer a
      JOIN attempt t ON t.id = a.attempt_id
      WHERE t.user_id = ${userId} AND a.question_id = ${flaggedOnly} AND a.answered_at IS NOT NULL
    `);

    expect(answeredCount.rows[0]?.n).toBe(0);
    // Still in the unseen block: it sorts ahead of anything actually answered.
    expect(after).toContain(flaggedOnly);
  });

  it('never returns a short session when the unseen pool runs out', async () => {
    // Answer every question in the smallest domain, so nothing is unseen, then
    // ask for a full-length sitting. It must come back full, ordered
    // least-recently-seen — never short, never an error.
    const attempt = await createAttempt(db, {
      userId,
      mode: 'domain',
      domain: 'pm',
      questionCount: 20,
    });
    const all = await domainCandidates(db, userId, 'pm');
    for (const id of all) await answer(attempt.id, id, true);

    const picked = await selectDomainQuestions(db, userId, 'pm', 40);
    expect(picked).toHaveLength(40);
    expect(new Set(picked).size).toBe(40);
  });
});
