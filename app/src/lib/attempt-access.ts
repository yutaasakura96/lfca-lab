// The checks every attempt-scoped request makes, in one place.
//
// A write runs seven of them, in this order: is the body JSON, does it match
// its schema, is there a session, is that user allowed here, does this attempt
// belong to them, is it still open, is its clock still running — and, for the
// writes that name a question, is that question one of this sitting's own.
//
// A read runs the first half only. The last two are what a resync is asking
// *about*, so refusing on them would leave the client unable to find out that
// its sitting is over.
//
// Writing them once is not tidiness. Doc 03 §9 calls ownership the single most
// important check in the app, and a check each handler re-implements is a check
// one handler will one day miss.

import type { z } from 'zod';
import { db } from '../db/client.ts';
import { isQuestionOnPaper } from '../db/queries/answer.ts';
import { getAttemptForUser, type AttemptRow } from '../db/queries/attempt.ts';
import { hasExpired } from '../domain/clock.ts';
import { apiError } from './api.ts';
import { getSession } from './session.ts';

export type AttemptAccess =
  | { ok: true; attempt: AttemptRow }
  | { ok: false; response: Response };

export type AttemptRead =
  | { ok: true; attempt: AttemptRow; userId: string }
  | { ok: false; response: Response };

export type AttemptWrite<T> =
  | { ok: true; attempt: AttemptRow; body: T }
  | { ok: false; response: Response };

/**
 * Load an attempt this request is allowed to *read*.
 *
 * Deliberately a shorter list than the write path's: session, allowlist,
 * ownership, and nothing else. A submitted sitting and an expired one are
 * perfectly readable — reporting that they are in that state is the whole
 * point of the resync endpoint — whereas writing into either is refused. Two
 * helpers rather than a flag, because "is it still open" is the question the
 * write path exists to ask and the read path exists to answer.
 *
 * The 404-not-403 rule is unchanged and applies here for the same reason.
 */
export async function openAttemptForRead(attemptId: string): Promise<AttemptRead> {
  const session = await getSession();
  if (!session) {
    return { ok: false, response: apiError(401, 'unauthenticated', 'Sign in to continue.') };
  }
  if ((session.user as { allowlisted?: boolean }).allowlisted !== true) {
    return { ok: false, response: apiError(403, 'not_allowlisted', 'This app is private.') };
  }

  const attempt = await getAttemptForUser(db, session.user.id, attemptId);
  if (attempt === null) {
    return { ok: false, response: apiError(404, 'not_found', 'No such sitting.') };
  }

  // The user id is handed back rather than read again by the caller: every
  // attempt-scoped query takes it, and a caller that has to fetch the session
  // a second time is a caller that can fetch a different one.
  return { ok: true, attempt, userId: session.user.id };
}

/**
 * Load an attempt this request is allowed to write to.
 *
 * `now` is a parameter rather than read here, for the same reason it is one
 * throughout the pure layer: the expiry decision should be reproducible.
 *
 * **A sitting that is not yours is a 404, never a 403.** A 403 confirms the row
 * exists and belongs to somebody, which is precisely what probing ids is for.
 * The same 404 answers "no such attempt" and "not yours", and the caller cannot
 * tell them apart.
 */
export async function openAttemptForWrite(
  attemptId: string,
  now: Date,
): Promise<AttemptAccess> {
  const session = await getSession();
  if (!session) {
    // JSON, never a redirect. A redirect here would hand the client an HTML
    // sign-in page to parse as an answer response.
    return { ok: false, response: apiError(401, 'unauthenticated', 'Sign in to continue.') };
  }
  if ((session.user as { allowlisted?: boolean }).allowlisted !== true) {
    return { ok: false, response: apiError(403, 'not_allowlisted', 'This app is private.') };
  }

  const attempt = await getAttemptForUser(db, session.user.id, attemptId);
  if (attempt === null) {
    return { ok: false, response: apiError(404, 'not_found', 'No such sitting.') };
  }

  if (attempt.submittedAt !== null) {
    return {
      ok: false,
      response: apiError(
        409,
        'attempt_already_submitted',
        'This sitting was already submitted.',
      ),
    };
  }

  // The clock is derived from `started_at`, so this is the same answer in every
  // tab and on every machine, whatever their own clocks say. Finalising an
  // expired sitting belongs to the slice that submits one; refusing to write
  // into it does not, and letting the write land would extend a clock that has
  // already run out.
  if (hasExpired(attempt, now)) {
    return {
      ok: false,
      response: apiError(409, 'attempt_expired', "This sitting's time has run out."),
    };
  }

  return { ok: true, attempt };
}

/**
 * The whole prelude for a write that names a question: parse it, prove the
 * sitting, prove the question is on it.
 *
 * The membership check is the one worth stating out loud. It is not "does this
 * question exist" — *is it one of the sixty this sitting put on screen*.
 * Without the distinction an attempt could be padded with answers to questions
 * it never asked, and its score would count something other than the paper. A
 * sitting with no recorded paper cannot establish membership at all, so it is
 * refused rather than trusted.
 *
 * `message` is the schema's own refusal wording, because "that is not an
 * answer this app can record" and "that is not a flag this app can record" are
 * the only thing the two callers disagree about.
 */
export async function openWriteForQuestion<T extends { questionId: string }>(
  request: Request,
  attemptId: string,
  schema: z.ZodType<T>,
  message: string,
  now: Date,
): Promise<AttemptWrite<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, response: apiError(400, 'invalid_request', 'Expected a JSON body.') };
  }

  // No field-level detail. The input surface is two ids and a boolean, so a
  // failure here is a bug or an attack — neither is a typo worth explaining.
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, response: apiError(400, 'invalid_request', message) };
  }

  const access = await openAttemptForWrite(attemptId, now);
  if (!access.ok) return access;

  const { attempt } = access;
  const onPaper =
    attempt.examId !== null &&
    (await isQuestionOnPaper(db, attempt.examId, parsed.data.questionId));
  if (!onPaper) {
    return {
      ok: false,
      response: apiError(
        409,
        'question_not_in_attempt',
        'That question is not part of this sitting.',
      ),
    };
  }

  return { ok: true, attempt, body: parsed.data };
}
