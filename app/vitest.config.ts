import { defineConfig } from 'vitest/config';

// The unit suite: no database, no network, runs anywhere. This is the one CI
// and a laptop both run without setup, so it stays the default.
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
