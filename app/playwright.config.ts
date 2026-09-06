import { defineConfig, devices } from '@playwright/test';

/**
 * The one browser run (doc 11 §2).
 *
 * It drives a **production build** — `next start`, not `next dev` — because
 * doc 11 §5 orders `npm run build && npm run test:e2e` and because the single
 * browser test in the repo should see what is actually deployed. The `npm run
 * test:e2e` script chains the build itself, so a stale `.next` cannot silently
 * be what is tested.
 *
 * **Port 3100, not 3000.** The run signs in by inserting a session row, so it
 * never touches an OAuth redirect and has no claim on the port the Google
 * client is registered against. Leaving 3000 free means a dev server can stay
 * up while this runs.
 *
 * `BETTER_AUTH_URL` is set to that origin for the server under test. It is what
 * decides the session cookie's `__Secure-` prefix (see `src/auth.ts`), and the
 * cookie this suite mints reads the same value — so the two cannot disagree
 * about the name of the thing being set.
 */
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',

  // One test, and it walks one sitting through one database row. There is
  // nothing here to parallelise and a second worker would only contend.
  workers: 1,
  fullyParallel: false,

  // Never retry. A resume-and-auto-submit test that passes on the second
  // attempt has told you nothing you can act on.
  retries: 0,

  // Generous, because the first navigation pays for the server's cold start.
  timeout: 90_000,
  expect: { timeout: 15_000 },

  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: `npx next start -p ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    // Locally, reuse a server already on 3100 rather than failing on a busy
    // port. In CI there is never one to reuse, and silently attaching to a
    // stranger's process is exactly what CI must not do.
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      BETTER_AUTH_URL: BASE_URL,
    },
  },
});
