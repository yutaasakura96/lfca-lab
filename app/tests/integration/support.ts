// Shared scaffolding for the integration suite.
//
// These tests run against the real Neon dev branch, seeded. They are
// read-mostly: the content tables are never written here, and the only rows
// created are a throwaway user and whatever hangs off it. Deleting that user
// cascades to its sessions, attempts and answers, so cleanup is one statement
// and cannot leave orphans behind.

import { sql } from 'drizzle-orm';
import { db } from '../../src/db/client.ts';

/**
 * A recognisable prefix. If a test ever dies without cleaning up, the leftovers
 * say what they were and can be removed by hand without guessing.
 */
export const TEST_USER_PREFIX = 'itest-';

export function testUserId(name: string): string {
  return `${TEST_USER_PREFIX}${name}`;
}

/** Create a throwaway user. Idempotent, so a crashed run does not block the next. */
export async function createTestUser(id: string): Promise<string> {
  await db.execute(sql`
    INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at, allowlisted)
    VALUES (${id}, 'Integration Test', ${`${id}@example.test`}, true, now(), now(), true)
    ON CONFLICT (id) DO NOTHING
  `);
  return id;
}

/** Remove a throwaway user and everything that hangs off it, by cascade. */
export async function deleteTestUser(id: string): Promise<void> {
  await db.execute(sql`DELETE FROM "user" WHERE id = ${id}`);
}

/** Remove every leftover from any previous run. */
export async function deleteAllTestUsers(): Promise<void> {
  await db.execute(sql`DELETE FROM "user" WHERE id LIKE ${`${TEST_USER_PREFIX}%`}`);
}

/**
 * Guard against running the suite on an unseeded database, where every
 * assertion about content would pass or fail for the wrong reason.
 */
export async function assertSeeded(): Promise<void> {
  const result = await db.execute<{ questions: number; holdout: number }>(sql`
    SELECT (SELECT count(*)::int FROM question) AS questions,
           (SELECT count(*)::int FROM question WHERE is_holdout) AS holdout
  `);
  const row = result.rows[0];
  if (!row || row.questions === 0) {
    throw new Error('The database has no content. Run `npm run seed` before the integration suite.');
  }
  if (row.holdout !== 40) {
    throw new Error(`The database marks ${row.holdout} holdout question(s); expected 40.`);
  }
}
