// The connection string says what it means about TLS.
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
// `.env.local`, so the variable it asserts about actually exists here.
//
// It asserts the string, not the socket — a live connection proves today's
// behaviour, which is not what is at risk. What is at risk is someone pasting a
// fresh string from the Neon dashboard, which hands out `sslmode=require`.
// See docs/12-deployment.md §2.1.

import { describe, expect, it } from 'vitest';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDatabase)('DATABASE_URL', () => {
  const params = new URL(process.env.DATABASE_URL ?? 'postgresql://x/y').searchParams;

  it('asks for verify-full by name, not the require alias', () => {
    expect(params.get('sslmode')).toBe('verify-full');
  });

  it('does not opt into libpq semantics, which would weaken verify-full', () => {
    // `uselibpqcompat=true` is the documented escape hatch back to libpq
    // meanings. With it, `verify-full` still verifies — but its presence means
    // someone has reasoned about this line, and they should reason again.
    expect(params.get('uselibpqcompat')).toBeNull();
  });

  it('keeps channel binding required', () => {
    // Orthogonal to sslmode: SCRAM-SHA-256-PLUS mutual authentication. Neon
    // documents it, the provisioned string carries it, and a hand-edited string
    // is the likely way it would go missing.
    expect(params.get('channel_binding')).toBe('require');
  });
});
