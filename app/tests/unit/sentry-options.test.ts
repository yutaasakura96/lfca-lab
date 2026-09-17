import { afterEach, describe, expect, it, vi } from 'vitest';

// What the Sentry SDK is handed, asserted where it can be asserted.
//
// `src/lib/sentry-options.ts` holds nothing but data, which is the reason it
// exists: the three init files are one line each, and the decisions — what is
// scrubbed, whether the SDK is on, what never travels — are in an object a test
// can look at without a browser, a build, or a network.
//
// This file imports the options module rather than the SDK. Loading
// `@sentry/nextjs` here would pull a bundler plugin into the unit suite to read
// five properties.

// The module reads the environment once, at import, so each case re-imports it
// under the environment it is about. The scrubber is re-imported alongside it
// rather than at the top of this file: `resetModules` gives the options module a
// fresh copy of every dependency, so a statically imported `scrubEvent` would be
// a different function object than the one the fresh options hold — an identity
// assertion against it would fail while the code was perfectly correct.
const load = async () => {
  vi.resetModules();
  const [{ sentryOptions }, { scrubEvent }] = await Promise.all([
    import('../../src/lib/sentry-options.ts'),
    import('../../src/domain/scrub.ts'),
  ]);
  return { options: sentryOptions, scrubEvent };
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Sentry is on exactly when a DSN is set', () => {
  it('is off with no DSN — which is what keeps it off on a laptop', () => {
    // Doc 12 §1: the DSN lives in Vercel production and nowhere else, so local
    // work and both database-touching suites report nothing without a flag
    // anybody has to remember to set.
    vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', '');

    return load().then(({ options }) => {
      expect(options.enabled).toBe(false);
      expect(options.dsn).toBeFalsy();
    });
  });

  it('is on with a DSN, and reports it under the production environment', async () => {
    vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://key@o1.ingest.sentry.io/2');
    const { options } = await load();

    expect(options.enabled).toBe(true);
    expect(options.dsn).toBe('https://key@o1.ingest.sentry.io/2');
    expect(options.environment).toBe('production');
  });
});

describe('what never travels', () => {
  it('scrubs every event and every breadcrumb with the tested scrubber', async () => {
    const { options, scrubEvent } = await load();

    // Identity, not equivalence: a second scrubber written inline in a config
    // file is a scrubber `scrub.test.ts` does not cover, and the breadcrumb
    // half is the one most likely to be forgotten — a fetch breadcrumb records
    // whatever URL it was given.
    expect(options.beforeSend).toBe(scrubEvent);
    expect(options.beforeBreadcrumb).toBe(scrubEvent);
  });

  it('sends no personally-identifying data by default', async () => {
    // Doc 03 §9. This is what would otherwise attach the IP address and the
    // request headers; users are identified by database id instead.
    expect((await load()).options.sendDefaultPii).toBe(false);
  });
});

describe('errors only', () => {
  it('samples no traces', async () => {
    expect((await load()).options.tracesSampleRate).toBe(0);
  });

  it('adds no integrations — which is what keeps Session Replay out', async () => {
    // Replay is not a default: it arrives only by adding `replayIntegration()`.
    // So the assertion that it is absent is that nothing is added at all, and a
    // future integration has to come past this line. Doc 12 §6 takes errors and
    // nothing else.
    expect(((await load()).options as { integrations?: unknown }).integrations).toBeUndefined();
  });
});
