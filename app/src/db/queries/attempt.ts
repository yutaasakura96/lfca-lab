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
import type { Db } from '../client.ts';
import { attempt } from '../schema/app.ts';
import { deadlineOf } from '../../domain/clock.ts';
import { timeLimitFor, type AttemptMode } from '../../domain/modes.ts';
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

async function insert(db: Db, input: NewAttempt, claimFirst: boolean): Promise<StartedAttempt> {
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
  const rows = await db.execute<{
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
 * Retried **once**, and only on the first-attempt index. A second failure is
 * not a race — it is a bug or a broken constraint, and swallowing it would hide
 * exactly the thing the index exists to surface.
 */
export async function createAttempt(db: Db, input: NewAttempt): Promise<StartedAttempt> {
  const wantsFirst = input.mode === 'exam';
  try {
    return await insert(db, input, wantsFirst);
  } catch (error) {
    if (!wantsFirst || !isFirstAttemptRace(error)) throw error;
    // Somebody else claimed it between our subquery and our write. They were
    // earlier; we are not first. Recording that is the correct outcome, not a
    // consolation.
    return await insert(db, input, false);
  }
}
