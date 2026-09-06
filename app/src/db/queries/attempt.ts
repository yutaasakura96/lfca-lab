// Starting a sitting.
//
// One statement decides everything that must be decided at creation: the
// clock's start, the length, and — for an exam — whether this is the first
// attempt at that paper. The flag is computed *inside* the insert rather than
// read first and written second, because a read-then-write leaves a window in
// which two sittings both believe they are first.
//
// That window is not hypothetical, it is just narrow. The unique partial index
// closes it: the loser gets a constraint violation rather than a second honest
// score, and the retry below is correct precisely because the loser genuinely
// is not first.

import { sql } from 'drizzle-orm';
import type { Db, Executor } from '../client.ts';
import { freezeAttemptQuestions } from './paper.ts';
import { attempt } from '../schema/app.ts';
import { deadlineOf } from '../../domain/clock.ts';
import { timeLimitFor, type AttemptMode } from '../../domain/modes.ts';
import type { SubmitReason } from '../../domain/submission.ts';
import type { Domain } from '../../domain/weights.ts';

/** Postgres's unique-violation SQLSTATE. */
const UNIQUE_VIOLATION = '23505';
const FIRST_ATTEMPT_INDEX = 'one_first_attempt_per_exam';

export interface NewAttempt {
  userId: string;
  mode: AttemptMode;
  /** Required for exam mode, absent otherwise — the check constraint enforces it. */
  examId?: string | undefined;
  /** Required for domain mode, absent otherwise. */
  domain?: Domain | undefined;
  questionCount: number;
}

export interface StartedAttempt {
  id: string;
  startedAt: Date;
  /** The instant the sitting closes, or `null` when it has no clock. */
  deadline: Date | null;
  isFirstAttempt: boolean;
}

/**
 * Drizzle wraps driver errors, so the SQLSTATE and the constraint name live on
 * the `cause`, not on the error handed to the caller. Checking only the outer
 * error silently never matches — the retry would look implemented and never
 * fire. Both levels are walked for that reason.
 */
function isFirstAttemptRace(error: unknown): boolean {
  for (let e: unknown = error; e != null; e = (e as { cause?: unknown }).cause) {
    const { code, constraint } = e as { code?: string; constraint?: string };
    if (code === UNIQUE_VIOLATION && constraint === FIRST_ATTEMPT_INDEX) return true;
  }
  return false;
}

async function insert(
  executor: Executor,
  input: NewAttempt,
  claimFirst: boolean,
): Promise<StartedAttempt> {
  const timeLimitSeconds = timeLimitFor(input.mode);

  // `NOT EXISTS` is evaluated by Postgres as part of the insert, so no caller
  // ever holds a stale answer to "has this paper been sat before?". On the
  // retry, `claimFirst` is false and the subquery is skipped entirely.
  const claim = claimFirst
    ? sql`NOT EXISTS (SELECT 1 FROM ${attempt} WHERE ${attempt.userId} = ${input.userId} AND ${attempt.examId} = ${input.examId ?? null})`
    : sql`false`;

  // Raw SQL bypasses Drizzle's column mapping, so these come back as the driver
  // produced them — `started_at` may be a string rather than a Date. Normalised
  // below rather than assumed, because a wrong `startedAt` is a wrong clock.
  const rows = await executor.execute<{
    id: string;
    started_at: Date | string;
    is_first_attempt: boolean;
  }>(sql`
    INSERT INTO ${attempt} (user_id, mode, exam_id, domain, question_count, time_limit_seconds, is_first_attempt)
    SELECT ${input.userId}, ${input.mode}::attempt_mode, ${input.examId ?? null}, ${input.domain ?? null}::domain,
           ${input.questionCount}, ${timeLimitSeconds}, ${claim}
    RETURNING id, started_at, is_first_attempt
  `);

  const row = rows.rows[0];
  if (row === undefined) throw new Error('The attempt insert returned no row.');

  const startedAt = row.started_at instanceof Date ? row.started_at : new Date(row.started_at);
  if (Number.isNaN(startedAt.getTime())) {
    throw new Error(`The attempt insert returned an unreadable started_at: ${row.started_at}`);
  }

  return {
    id: row.id,
    startedAt,
    deadline: deadlineOf({ startedAt, timeLimitSeconds }),
    isFirstAttempt: row.is_first_attempt,
  };
}

/**
 * Create an attempt, and settle the first-attempt flag while doing it.
 *
 * Takes an {@link Executor} rather than the handle, so a caller composing a
 * sitting can run this and {@link freezeAttemptQuestions} in one transaction.
 *
 * Retried **once**, and only on the first-attempt index. A second failure is
 * not a race — it is a bug or a broken constraint, and swallowing it would hide
 * exactly the thing the index exists to surface.
 *
 * **The retry is exam-only, which is why the executor is safe.** A unique
 * violation aborts the transaction it happened in, so a retry inside one would
 * fail on a statement Postgres has already refused to accept. Only exam mode
 * claims the flag and only exam mode can hit that index, and an exam sitting is
 * created on its own — it has no `attempt_question` rows to write. If that ever
 * changes, the retry has to move out of the transaction with it.
 */
export async function createAttempt(executor: Executor, input: NewAttempt): Promise<StartedAttempt> {
  const wantsFirst = input.mode === 'exam';
  try {
    return await insert(executor, input, wantsFirst);
  } catch (error) {
    if (!wantsFirst || !isFirstAttemptRace(error)) throw error;
    // Somebody else claimed it between our subquery and our write. They were
    // earlier; we are not first. Recording that is the correct outcome, not a
    // consolation.
    return await insert(executor, input, false);
  }
}

/**
 * A sitting that composes its own questions: practice, domain, and — when it
 * lands — the holdout.
 *
 * Exam mode is excluded at the type level rather than by a runtime check. A
 * paper is stored once, in `exam_item`; writing sixty rows per exam sitting
 * would give a paper's order two places it could be read from, which is two
 * places it could be read from differently.
 *
 * There is no `questionCount` here because it is not the caller's to state —
 * see {@link startComposedSitting}.
 */
export type ComposedAttempt = Omit<NewAttempt, 'questionCount' | 'examId' | 'mode'> & {
  mode: Exclude<AttemptMode, 'exam'>;
};

/**
 * Start a composed sitting: the attempt and the questions it asks, in one
 * transaction.
 *
 * An attempt that exists without its questions is a sitting with nothing to
 * show, and questions left behind by an insert that failed belong to no
 * sitting. Neither is a state this product has, and the transaction is what
 * makes that a fact rather than an intention.
 *
 * **`question_count` is `questionIds.length`, never the length that was asked
 * for.** The two differ whenever a pool cannot fill a request — a domain
 * sitting of `all` is *defined* that way — and a column that disagreed with the
 * rows would break the one assumption the navigator rests on, that a sitting's
 * positions run 0…n-1. Deriving it means the column records what was written
 * down.
 *
 * **A composition of nothing is refused before the transaction opens.** It is
 * unreachable against this bank, whose smallest non-holdout exam pool is a
 * hundred against a quota of two, and reachable against a broken seed. Throwing
 * says the bank is wrong rather than the request, and leaves no attempt row
 * behind for a screen to find and fail to render.
 */
export async function startComposedSitting(
  db: Db,
  input: ComposedAttempt,
  questionIds: readonly string[],
): Promise<StartedAttempt> {
  if (questionIds.length === 0) {
    const what = input.domain ?? input.mode;
    throw new Error(`Composed no questions for a ${what} sitting; the bank cannot fill it.`);
  }

  return db.transaction(async (tx) => {
    const started = await createAttempt(tx, { ...input, questionCount: questionIds.length });
    await freezeAttemptQuestions(tx, started.id, questionIds);
    return started;
  });
}

/**
 * Whether a string could be an attempt id at all.
 *
 * Guarded before the query rather than after: a malformed id reaching Postgres
 * raises a cast error rather than the honest "no such attempt", and a screen
 * that turns a 500 into a not-found is doing it by accident. Shared so the
 * three attempt-scoped readers cannot drift on what an id looks like.
 */
export function looksLikeAttemptId(value: string): boolean {
  return /^[0-9a-f-]{36}$/i.test(value);
}

export interface AttemptRow {
  id: string;
  /** The column is a Postgres enum, so this is one of the four and not a free string. */
  mode: AttemptMode;
  examId: string | null;
  domain: string | null;
  questionCount: number;
  startedAt: Date;
  timeLimitSeconds: number | null;
  submittedAt: Date | null;
  /** Set with `submittedAt`, and null with it. Meaningless in an unscored mode. */
  score: number | null;
  submitReason: SubmitReason | null;
}

/**
 * One attempt, if it belongs to this candidate.
 *
 * The user id is part of the query rather than checked afterwards. That is the
 * ownership rule doc 03 §9 calls the single most important check in the app,
 * and expressing it here means a caller cannot forget it — asking for someone
 * else's attempt returns nothing, and the screen turns that into a not-found.
 */
export async function getAttemptForUser(
  db: Db,
  userId: string,
  attemptId: string,
): Promise<AttemptRow | null> {
  if (!looksLikeAttemptId(attemptId)) return null;

  const result = await db.execute<{
    id: string;
    mode: AttemptMode;
    exam_id: string | null;
    domain: string | null;
    question_count: number;
    started_at: Date | string;
    time_limit_seconds: number | null;
    submitted_at: Date | string | null;
    score: number | null;
    submit_reason: SubmitReason | null;
  }>(sql`
    SELECT id, mode, exam_id, domain, question_count, started_at, time_limit_seconds, submitted_at,
           score, submit_reason
    FROM attempt
    WHERE id = ${attemptId}::uuid AND user_id = ${userId}
  `);

  const row = result.rows[0];
  if (row === undefined) return null;

  const asDate = (value: Date | string) => (value instanceof Date ? value : new Date(value));

  return {
    id: row.id,
    mode: row.mode,
    examId: row.exam_id,
    domain: row.domain,
    questionCount: row.question_count,
    startedAt: asDate(row.started_at),
    timeLimitSeconds: row.time_limit_seconds,
    submittedAt: row.submitted_at === null ? null : asDate(row.submitted_at),
    score: row.score,
    submitReason: row.submit_reason,
  };
}
