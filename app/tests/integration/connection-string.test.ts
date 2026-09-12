// The connection strings say what they mean about TLS.
//
// `node-postgres` currently treats `sslmode=require`, `prefer` and `verify-ca`
// as aliases for `verify-full`, and warns that it will stop doing so in pg v9 /
// pg-connection-string v3. Under those versions `require` with no `sslrootcert`
// adopts libpq semantics and sets `rejectUnauthorized = false` — not weaker
// certificate verification but none at all.
//
// That downgrade arrives with a dependency bump, silently: no warning, and no
// other test in this repo would fail. This file is the thing that fails. It
// lives in the integration suite because that is the suite that loads
// `.env.local`, so the variables it asserts about actually exist here.
//
// It asserts the strings, not the socket — a live connection proves today's
// behaviour, which is not what is at risk. What is at risk is someone pasting a
// fresh string from the Neon dashboard, which hands out `sslmode=require`.
// See docs/12-deployment.md §2.1.
//
// ## Why both strings, under one gate
//
// The gate is `DATABASE_URL`, because that is what "is there a database here at
// all" means for every other file in this suite, and a contributor with no Neon
// branch must still get a green run.
//
// Given a database, though, **both** strings are required rather than each
// being skipped when absent. The repo now speaks two and there is no fallback
// between them: `requireDirectDatabaseUrl()` throws rather than reaching for
// the pooled one. A test that skipped its second half would report green over
// exactly the state in which the seed refuses to run — a claim made by absence.

import { describe, expect, it } from 'vitest';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const pooled = process.env.DATABASE_URL ?? '';
const direct = process.env.DATABASE_URL_UNPOOLED ?? '';

/**
 * The three things a Neon string must say, whichever host it names.
 *
 * The parse happens **inside each test**, not in the suite body. `describe.skipIf`
 * still runs its callback at collection time — a skipped suite is one whose tests
 * do not execute, not one whose body is never read — so parsing at that level
 * throws on an absent string and turns "no database here, skip cleanly" into a
 * collection error. Measured, not guessed: doing it in the body failed the whole
 * file with 186 tests skipped and 1 file failed.
 */
function describeTlsParameters(title: string, raw: string): void {
  describe(title, () => {
    const params = (): URLSearchParams => new URL(raw).searchParams;

    it('asks for verify-full by name, not the require alias', () => {
      expect(params().get('sslmode')).toBe('verify-full');
    });

    it('does not opt into libpq semantics, which would weaken verify-full', () => {
      // `uselibpqcompat=true` is the documented escape hatch back to libpq
      // meanings. With it, `verify-full` still verifies — but its presence means
      // someone has reasoned about this line, and they should reason again.
      expect(params().get('uselibpqcompat')).toBeNull();
    });

    it('keeps channel binding required', () => {
      // Orthogonal to sslmode: SCRAM-SHA-256-PLUS mutual authentication. Neon
      // documents it, the provisioned string carries it, and a hand-edited
      // string is the likely way it would go missing.
      expect(params().get('channel_binding')).toBe('require');
    });
  });
}

describe.skipIf(!hasDatabase)('connection strings', () => {
  it('names the direct host as well as the pooled one', () => {
    // Deliberately not a skip. Given a database, both are required.
    expect(
      direct,
      'DATABASE_URL_UNPOOLED is not set. `drizzle-kit migrate` and `npm run seed` ' +
        'read the direct (non `-pooler`) Neon host, and there is no fallback to ' +
        'DATABASE_URL. See docs/12-deployment.md §2.2.',
    ).not.toBe('');
  });

  describeTlsParameters('DATABASE_URL — the pooled host, read by the app', pooled);

  if (direct) {
    describeTlsParameters(
      'DATABASE_URL_UNPOOLED — the direct host, read by migrate and the seed',
      direct,
    );

    it('is one database under two hostnames, not two databases', () => {
      // #42 measured why this holds, and measuring it is what made the rule in
      // §2.1 bind the pooled string with no exception: every endpoint in this
      // project is served one wildcard certificate for the proxy domain
      // (`*.c-4.<region>.aws.neon.tech`), and `-pooler` is a suffix on the
      // **leftmost label**. The pooled host is therefore not a different
      // certificate, it is a different name on the same one.
      //
      // What this catches is the mistake actually available when adding a second
      // variable: pasting one string into both names, which every parameter
      // assertion above would pass. Hostnames are not secrets — doc 12 §8.1
      // records all four in full — so a failure here may print them.
      const [label, ...rest] = new URL(direct).hostname.split('.');

      expect(new URL(pooled).hostname).toBe([`${label}-pooler`, ...rest].join('.'));
    });
  }
});
