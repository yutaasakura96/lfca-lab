// A real session, minted directly, for the two suites that need to be signed in.
//
// Sessions are database-backed (doc 08 §2), so a `session` row plus the cookie
// that row implies **is** a session by every definition the app uses. Driving
// Google would make the tests that matter most also the flakiest, and would
// make them depend on a third party being up.
//
// The cookie's **name** comes from the library, so a rename or a change of
// prefix arrives here rather than being silently missed. Its **value** is
// reproduced: `better-call` signs cookies as `value.base64(HMAC-SHA-256)` and
// then URI-encodes the pair, and its signer is not in that package's exports
// map — so this is the one fact about Better Auth hardcoded anywhere in the
// suites. One copy, two consumers: the browser run hands it to a context, and
// the integration suite hands it to a route handler as a header.
//
// The reproduction is bounded rather than trusted. If the format ever changes,
// the browser run's first navigation lands on `/sign-in` and the integration
// suite's first route call answers `401` — loudly, at the two places that would
// notice.

import { randomUUID, createHmac } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { getCookies } from 'better-auth/cookies';
import { db } from '../../src/db/client.ts';

export interface MintedSession {
  token: string;
  cookieName: string;
  cookieValue: string;
  expiresAt: Date;
}

/**
 * The origin the cookie is minted for.
 *
 * It decides the `__Secure-` prefix — see the comment on `baseURL` in
 * `src/auth.ts` — so it must be the same origin the app itself is configured
 * with, or the server looks for a cookie by a name nobody sent.
 */
export function authBaseURL(): string {
  const url = process.env.BETTER_AUTH_URL;
  if (!url) {
    throw new Error('BETTER_AUTH_URL is not set; the session cookie cannot be named.');
  }
  return url;
}

function signCookieValue(value: string, secret: string): string {
  const signature = createHmac('sha256', secret).update(value).digest('base64');
  return encodeURIComponent(`${value}.${signature}`);
}

/**
 * Insert a session row for a user and return the cookie it implies.
 *
 * Thirty days, matching the app's own policy, so nothing in either suite can be
 * interrupted by an expiry.
 */
export async function mintSession(userId: string, baseURL: string): Promise<MintedSession> {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET is not set; the session cookie cannot be signed.');
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.execute(sql`
    INSERT INTO session (id, user_id, token, expires_at, created_at, updated_at)
    VALUES (${randomUUID()}, ${userId}, ${token}, ${expiresAt}, now(), now())
  `);

  return {
    token,
    cookieName: getCookies({ baseURL }).sessionToken.name,
    cookieValue: signCookieValue(token, secret),
    expiresAt,
  };
}

/** The same session as a `Cookie` header, for a request made without a browser. */
export function cookieHeader(session: MintedSession): string {
  return `${session.cookieName}=${session.cookieValue}`;
}
