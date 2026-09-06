// Shared scaffolding for the integration suite.
//
// These tests run against the real Neon dev branch, seeded. They are
// read-mostly: the content tables are never written here, and the only rows
// created are a throwaway user and whatever hangs off it.
//
// The user helpers live in `../support/users.ts`, shared with the browser run.
// What is owned here is the **prefix** — see that file for why the two suites
// must not share one.

import { deleteUsersWithPrefix } from '../support/users.ts';

export { assertSeeded, createTestUser, deleteTestUser, hasDatabase } from '../support/users.ts';

/**
 * A recognisable prefix. If a test ever dies without cleaning up, the leftovers
 * say what they were and can be removed by hand without guessing.
 */
export const TEST_USER_PREFIX = 'itest-';

export function testUserId(name: string): string {
  return `${TEST_USER_PREFIX}${name}`;
}

/** Remove every leftover from any previous run of *this* suite. */
export function deleteAllTestUsers(): Promise<void> {
  return deleteUsersWithPrefix(TEST_USER_PREFIX);
}
