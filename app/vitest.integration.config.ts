import { defineConfig } from 'vitest/config';

// The integration suite: real Postgres, read-mostly, and deliberately separate
// from the unit run. The testing plan rules out database tests on the grounds
// that the browser test would cover the selection query — but this slice has no
// browser test, and "selection never returns a holdout item" is a claim about
// query results that cannot be made against a pure function. See the decision
// log.
//
// Runs serially: these tests share one database and one test user, and a
// parallel runner would have them writing over each other.
export default defineConfig({
  test: {
    include: ['tests/integration/**/*.test.ts'],
    fileParallelism: false,
    testTimeout: 30_000,
  },
});
