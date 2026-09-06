import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { startComposedSitting } from '../../src/db/queries/attempt.ts';
import { listDomains } from '../../src/db/queries/domains.ts';
import { domainCandidates } from '../../src/db/queries/selection.ts';
import { DOMAINS } from '../../src/domain/weights.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

/**
 * The domain setup screen's numbers, asserted against the seeded branch.
 *
 * The one that matters is availability: the chip promises "All 84", and a
 * domain sitting of `'all'` resolves to whatever `domainCandidates` returns. If
 * those two ever disagree the screen is advertising a sitting the composer will
 * not produce — so this asserts them against each other rather than against a
 * number typed here, which would only prove the number was typed twice.
 */

const hasDatabase = Boolean(process.env.DATABASE_URL);

const userId = testUserId('domains');
/** A second account, never touched, so "no history" is asserted on real emptiness. */
const freshId = testUserId('domains-fresh');

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  await createTestUser(freshId);
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

describe.skipIf(!hasDatabase)('listDomains', () => {
  it('returns the six, in the order everything else shows them', async () => {
    const rows = await listDomains(db, freshId);
    expect(rows.map((r) => r.domain)).toEqual([...DOMAINS]);
  });

  it('names each domain and its competencies from the bank', async () => {
    const rows = await listDomains(db, freshId);
    const security = rows.find((r) => r.domain === 'security');

    // The name is the competency string's own first half, so it cannot drift
    // from the content the way a label typed into the app could.
    expect(security?.name).toBe('Security Fundamentals');
    expect(security?.competencies).toEqual(['Compliance', 'Security', 'Sensitive Data']);
  });

  it('reports the availability a domain sitting of `all` would actually get', async () => {
    const rows = await listDomains(db, freshId);

    for (const domain of DOMAINS) {
      const candidates = await domainCandidates(db, freshId, domain);
      const row = rows.find((r) => r.domain === domain);
      expect(row?.available).toBe(candidates.length);
    }
  });

  it('reads zero and not-started on an account with no history', async () => {
    const rows = await listDomains(db, freshId);

    for (const row of rows) {
      expect(row.seen).toBe(0);
      expect(row.lastPractisedAt).toBeNull();
      // PRD §4: an empty account still shows the real denominator.
      expect(row.available).toBeGreaterThan(0);
    }
  });

  it('counts a question as seen once it is answered, and only in its own domain', async () => {
    const candidates = await domainCandidates(db, userId, 'security');
    const asked = candidates.slice(0, 3);
    const attempt = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'security' },
      asked,
    );

    await answerAt(attempt.id, asked[0]!, '2026-09-01T10:00:00Z');
    await answerAt(attempt.id, asked[1]!, '2026-09-04T10:00:00Z');
    await answerAt(attempt.id, asked[2]!, '2026-09-02T10:00:00Z');

    const rows = await listDomains(db, userId);
    const security = rows.find((r) => r.domain === 'security');

    expect(security?.seen).toBe(3);
    // The most recent, not the last written — the third row answered is the
    // middle date, so a query reading insertion order would say 09-02.
    expect(security?.lastPractisedAt?.toISOString()).toBe('2026-09-04T10:00:00.000Z');

    for (const row of rows.filter((r) => r.domain !== 'security')) {
      expect(row.seen).toBe(0);
      expect(row.lastPractisedAt).toBeNull();
    }
  });

  it('does not count a question that has a row but was never answered', async () => {
    // Flagged-but-unanswered: doc 04 §6 keeps it *unseen* for selection,
    // because the candidate never engaged with it. The card has to say the
    // same, or it reports a different fact from the one selection acts on
    // under the same word.
    const before = await listDomains(db, userId);
    const seenBefore = before.find((r) => r.domain === 'linux')?.seen;

    const candidates = await domainCandidates(db, userId, 'linux');
    const asked = candidates.slice(0, 2);
    const attempt = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'linux' },
      asked,
    );
    await db.execute(sql`
      INSERT INTO answer (attempt_id, question_id, option_ref, is_correct, flagged, answered_at)
      VALUES (${attempt.id}, ${asked[0]!}, null, null, true, null)
    `);

    const after = await listDomains(db, userId);
    expect(after.find((r) => r.domain === 'linux')?.seen).toBe(seenBefore);
    expect(after.find((r) => r.domain === 'linux')?.lastPractisedAt).toBeNull();
  });

  it('counts one question once, however many sittings asked it', async () => {
    const rows = await listDomains(db, userId);
    const security = rows.find((r) => r.domain === 'security')!;
    const candidates = await domainCandidates(db, userId, 'security');

    // Re-ask the first question this user already answered, in a second sitting.
    const already = await db.execute<{ question_id: string }>(sql`
      SELECT a.question_id FROM answer a
      JOIN attempt t ON t.id = a.attempt_id
      WHERE t.user_id = ${userId} AND t.domain = 'security' AND a.answered_at IS NOT NULL
      LIMIT 1
    `);
    const repeated = already.rows[0]!.question_id;
    const attempt = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'security' },
      [repeated, candidates.find((id) => id !== repeated)!],
    );
    await answerAt(attempt.id, repeated, '2026-09-05T10:00:00Z');

    const after = await listDomains(db, userId);
    const securityAfter = after.find((r) => r.domain === 'security')!;

    // Same question, answered again: the count is distinct questions, so it
    // does not move. The date does.
    expect(securityAfter.seen).toBe(security.seen);
    expect(securityAfter.lastPractisedAt?.toISOString()).toBe('2026-09-05T10:00:00.000Z');
  });

  it('does not inflate availability for a candidate who has answered', async () => {
    // The join to `answer` multiplies a question by its answer rows, so a
    // count that is not DISTINCT reports a bigger pool the more work has been
    // done — and the "All N" chip then advertises a sitting the composer will
    // not produce. `userId` has repeats by this point; `freshId` has none, so
    // asserting only on the empty account would miss it entirely.
    const worked = await listDomains(db, userId);
    const fresh = await listDomains(db, freshId);

    expect(worked.map((r) => r.available)).toEqual(fresh.map((r) => r.available));

    for (const row of worked) {
      const candidates = await domainCandidates(db, userId, row.domain);
      expect(row.available).toBe(candidates.length);
    }
  });

  it('never counts a holdout item toward availability', async () => {
    const rows = await listDomains(db, freshId);
    const overlap = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM question WHERE is_holdout AND pool = 'exam'
    `);
    const totals = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM question WHERE pool = 'exam'
    `);

    const advertised = rows.reduce((sum, row) => sum + row.available, 0);
    expect(advertised).toBe(totals.rows[0]!.n - overlap.rows[0]!.n);
    expect(overlap.rows[0]!.n).toBe(40);
  });
});

/** Record an answered answer at a fixed instant, so "most recent" is decidable. */
async function answerAt(attemptId: string, questionId: string, at: string): Promise<void> {
  await db.execute(sql`
    INSERT INTO answer (attempt_id, question_id, option_ref, is_correct, answered_at)
    VALUES (${attemptId}, ${questionId}, 'o1', true, ${at}::timestamptz)
    ON CONFLICT (attempt_id, question_id)
      DO UPDATE SET option_ref = 'o1', answered_at = ${at}::timestamptz
  `);
}
