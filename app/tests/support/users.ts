// Throwaway users, shared by the two suites that need a real database.
//
// The integration suite and the browser run each own a **prefix**, not a copy
// of this code. Doc 11 §5 runs them against one database back to back, and each
// cleans up by deleting every user carrying its own prefix — so the prefixes
// must differ, or either teardown would cut the other's rows out from under it.
// That is an argument for two prefixes, not for two implementations.
//
// Deleting a user cascades to its sessions, attempts and answers, so cleanup is
// one statement and cannot leave orphans behind.

import { sql } from 'drizzle-orm';
import { db } from '../../src/db/client.ts';

/** Without a connection string there is nothing to integrate with. */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

/**
 * Create a throwaway user, allowlisted.
 *
 * Idempotent, so a crashed run does not block the next one. Allowlisted because
 * the allowlist is not what either suite tests — it is what
 * `tests/manual-checklist.md` §1 tests, in SQL, because the assertion that
 * matters is that *no row was created*, and no browser can make it.
 */
export async function createTestUser(id: string): Promise<string> {
  await db.execute(sql`
    INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at, allowlisted)
    VALUES (${id}, ${id}, ${`${id}@example.test`}, true, now(), now(), true)
    ON CONFLICT (id) DO NOTHING
  `);
  return id;
}

/** Remove a throwaway user and everything that hangs off it, by cascade. */
export async function deleteTestUser(id: string): Promise<void> {
  await db.execute(sql`DELETE FROM "user" WHERE id = ${id}`);
}

/** Remove every user carrying one suite's prefix — its leftovers, and nobody else's. */
export async function deleteUsersWithPrefix(prefix: string): Promise<void> {
  await db.execute(sql`DELETE FROM "user" WHERE id LIKE ${`${prefix}%`}`);
}

/**
 * Guard against running on an unseeded database, where every assertion about
 * content would pass or fail for the wrong reason.
 *
 * Checks the holdout count as well as the question count, because a seed that
 * ran against a stale bank is a subtler failure than one that never ran.
 */
export async function assertSeeded(): Promise<void> {
  const result = await db.execute<{ questions: number; holdout: number }>(sql`
    SELECT (SELECT count(*)::int FROM question) AS questions,
           (SELECT count(*)::int FROM question WHERE is_holdout) AS holdout
  `);
  const row = result.rows[0];
  if (!row || row.questions === 0) {
    throw new Error('The database has no content. Run `npm run seed` before this suite.');
  }
  if (row.holdout !== 40) {
    throw new Error(`The database marks ${row.holdout} holdout question(s); expected 40.`);
  }
}
