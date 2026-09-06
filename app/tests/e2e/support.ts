// Scaffolding for the one browser run.
//
// Two things happen here that happen nowhere else in the repo, and both are
// deliberate choices recorded in the ticket rather than shortcuts.
//
// **Signing in is an INSERT, not a Google sign-in.** Sessions are
// database-backed (doc 08 §2) and this suite owns the database, so a session
// row plus its cookie is a real session by every definition the app uses.
// Driving Google would make the most important test in the repo also the
// flakiest, and would make it depend on a third party being up. The cost is
// named plainly in `manual-checklist.md`: the OAuth callback and the allowlist
// hook have no automated coverage anywhere, and are checked by hand.
//
// **Travelling past the deadline is an UPDATE to `started_at`.** No fake
// timers, no waiting, no clock to move in step — which works only because the
// clock is derived (doc 03 §6). If that ever stopped being true, this file
// would stop working, which is the right way round.

import { randomUUID, createHmac } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { getCookies } from 'better-auth/cookies';
import type { BrowserContext, Cookie } from '@playwright/test';
import { db } from '../../src/db/client.ts';
import { createTestUser, deleteUsersWithPrefix } from '../support/users.ts';

export { assertSeeded, hasDatabase } from '../support/users.ts';

/**
 * Its own prefix, distinct from the integration suite's `itest-`, for the
 * reason given in `../support/users.ts`.
 */
export const E2E_USER_PREFIX = 'e2e-';

export const E2E_USER_ID = `${E2E_USER_PREFIX}candidate`;

/** The candidate this run sits as. */
export function createE2EUser(): Promise<string> {
  return createTestUser(E2E_USER_ID);
}

/** Remove every leftover from any previous run of *this* suite. */
export function deleteAllE2EUsers(): Promise<void> {
  return deleteUsersWithPrefix(E2E_USER_PREFIX);
}

/**
 * The session cookie, as Better Auth would have written it.
 *
 * The name comes from the library (`getCookies`), so a rename or a change of
 * prefix arrives here rather than being silently missed. The **value** is
 * reproduced: `better-call` signs cookies as `value.base64(HMAC-SHA-256)` and
 * then URI-encodes the pair, and its signer is not in that package's exports
 * map — so this is the one fact about the library hardcoded anywhere in the
 * suite.
 *
 * That reproduction is bounded rather than trusted. If the format ever changes,
 * the run's first navigation lands on `/sign-in` and the first assertion fails
 * loudly, at the one place in the repo that would notice.
 *
 * `baseURL` is passed because it is what decides the `__Secure-` prefix — see
 * the comment on `baseURL` in `src/auth.ts`. Passing the same origin the server
 * is running under is what keeps the two in step.
 */
function sessionCookieName(baseURL: string): string {
  return getCookies({ baseURL }).sessionToken.name;
}

function signCookieValue(value: string, secret: string): string {
  const signature = createHmac('sha256', secret).update(value).digest('base64');
  return encodeURIComponent(`${value}.${signature}`);
}

/**
 * Insert a session row for the e2e candidate and hand its cookie to the
 * browser context. Thirty days, matching the app's own policy, so nothing in
 * this run can be interrupted by an expiry.
 */
export async function signIn(context: BrowserContext, baseURL: string): Promise<void> {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET is not set; the session cookie cannot be signed.');
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.execute(sql`
    INSERT INTO session (id, user_id, token, expires_at, created_at, updated_at)
    VALUES (${randomUUID()}, ${E2E_USER_ID}, ${token}, ${expiresAt}, now(), now())
  `);

  const url = new URL(baseURL);
  const cookie: Cookie = {
    name: sessionCookieName(baseURL),
    value: signCookieValue(token, secret),
    domain: url.hostname,
    path: '/',
    expires: Math.floor(expiresAt.getTime() / 1000),
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'Lax',
  };

  await context.addCookies([cookie]);
}

/**
 * Age a sitting by moving its start backwards.
 *
 * The whole of time travel. Nothing else has to move with it, because nothing
 * else holds the time: the deadline is `started_at + time_limit_seconds`,
 * computed on every read. Deliberately touches `started_at` **only** — writing
 * `submitted_at` here would be this suite finalising the sitting itself, and
 * the point is to watch the app do it.
 */
export async function ageSitting(attemptId: string, seconds: number): Promise<void> {
  await db.execute(sql`
    UPDATE attempt
    SET started_at = started_at - make_interval(secs => ${seconds})
    WHERE id = ${attemptId}::uuid
  `);
}

export interface AttemptRowState {
  submittedAt: Date | null;
  submitReason: string | null;
  score: number | null;
  isFirstAttempt: boolean;
}

/**
 * Read a sitting back, to assert what the app decided rather than what it
 * displayed.
 */
export async function readAttempt(attemptId: string): Promise<AttemptRowState> {
  const result = await db.execute<{
    submitted_at: Date | string | null;
    submit_reason: string | null;
    score: number | null;
    is_first_attempt: boolean;
  }>(sql`
    SELECT submitted_at, submit_reason, score, is_first_attempt
    FROM attempt WHERE id = ${attemptId}::uuid
  `);
  const row = result.rows[0];
  if (!row) throw new Error(`No attempt ${attemptId}`);
  return {
    submittedAt: asDate(row.submitted_at),
    submitReason: row.submit_reason,
    score: row.score,
    isFirstAttempt: row.is_first_attempt,
  };
}

/**
 * Raw `db.execute` bypasses Drizzle's mapping, so the driver may hand a
 * timestamp back as a string — the same trap `src/lib/auto-submit.ts` names.
 * A string compares equal to nothing a test would want to compare it to.
 */
function asDate(value: Date | string | null): Date | null {
  if (value === null) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

/**
 * What a sitting's answer rows say — the counts the screen claims, read from
 * the place that actually decides them.
 *
 * **`correct` is counted against the answer key, not against `answer.is_correct`.**
 * The score the app writes is `count(*) … WHERE a.is_correct` (doc 07 §5), so
 * recounting that same column would assert only that two readings of one number
 * agree — it would pass just as happily if the denormalisation on write were
 * wrong. Joining `question_option` instead asks the bank what the right answer
 * was, which makes this an oracle rather than an echo, and covers the write-time
 * denormalisation doc 04 §5.3 relies on.
 */
export async function countAnswers(
  attemptId: string,
): Promise<{ answered: number; flagged: number; correct: number }> {
  const result = await db.execute<{ answered: number; flagged: number; correct: number }>(sql`
    SELECT count(*) FILTER (WHERE a.option_ref IS NOT NULL)::int AS answered,
           count(*) FILTER (WHERE a.flagged)::int AS flagged,
           count(*) FILTER (WHERE o.correct)::int AS correct
    FROM answer a
    LEFT JOIN question_option o
      ON o.question_id = a.question_id AND o.ref = a.option_ref
    WHERE a.attempt_id = ${attemptId}::uuid
  `);
  return result.rows[0] ?? { answered: 0, flagged: 0, correct: 0 };
}
