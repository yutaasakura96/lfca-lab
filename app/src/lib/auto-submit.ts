// Auto-submit: what happens to a sitting whose ninety minutes ran out while
// nobody was watching.
//
// **There is no cron here and none is wanted.** An expired attempt's score is
// already fully determined by its answer rows, so nothing is lost by leaving it
// open in the database — doc 03 §6 says as much. It is finalised *lazily*, the
// next time anything touches it: opened, listed, or asked about by a resync.
// An attempt can therefore sit expired-but-unfinalised indefinitely, which is
// correct rather than tolerated.
//
// **This writes through the submit path; it does not have one of its own.**
// `submitAttempt` finalises in a single conditional `UPDATE` that counts the
// score inside the same statement and answers a caller who updated nothing with
// the figures the winner decided. A second implementation would be a second
// opinion about what a sitting scored, and the two would eventually disagree
// about a number nobody could recompute.
//
// **Nothing here can extend a clock.** Expiry is `hasExpired`, which reads
// `started_at` and the limit and takes `now` as a parameter. Neither column is
// written by anything below.

import { sql } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import type { AttemptRow } from '../db/queries/attempt.ts';
import { submitAttempt } from '../db/queries/submit.ts';
import { hasExpired } from '../domain/clock.ts';
import { isScored } from '../domain/modes.ts';

export interface Finalisation {
  /** The attempt as it now stands — finalised, if it needed to be. */
  attempt: AttemptRow;
  /**
   * True when the sitting arrived here expired and unfinalised, so this read is
   * what closed it.
   *
   * It is what the screens branch on: a sitting that was over before you looked
   * belongs on the review, whereas one already finalised on a previous visit is
   * simply a finished sitting being opened again. A caller that loses the race
   * to another tab reports `false` and reads back the winner's figures, which
   * is the same rule a second submit follows.
   */
  closedOnRead: boolean;
}

/**
 * Close a sitting whose clock has run out, if it has.
 *
 * The reason is always `expired`, and it is decided here rather than passed in:
 * this path exists only for sittings nobody submitted, so there is no caller
 * who could honestly claim otherwise.
 */
export async function finaliseIfExpired(
  db: Db,
  attempt: AttemptRow,
  now: Date,
): Promise<Finalisation> {
  if (attempt.submittedAt !== null) return { attempt, closedOnRead: false };
  if (!hasExpired(attempt, now)) return { attempt, closedOnRead: false };

  const finalised = await submitAttempt(db, {
    attemptId: attempt.id,
    reason: 'expired',
    scored: isScored(attempt.mode),
  });

  return {
    // The row is rebuilt from what the statement returned rather than read
    // again: a second `SELECT` could see a different row, and the figures the
    // caller reports have to be the ones the finalisation decided.
    attempt: {
      ...attempt,
      submittedAt: finalised.submittedAt,
      submitReason: finalised.reason,
      score: finalised.score,
    },
    closedOnRead: !finalised.alreadySubmitted,
  };
}

/**
 * Close every one of this candidate's sittings whose clock has run out.
 *
 * Doc 03 §6 lists *listed* alongside opened and answered against, and this is
 * that touch: without it, an abandoned sitting would go on offering to be
 * resumed on the exam list — and its first-attempt score would go on reading as
 * absent — until somebody happened to open it. The screen that exists to show
 * the honest number would be the one screen not showing it.
 *
 * **The query narrows; `hasExpired` decides.** The `WHERE` clause asks only for
 * sittings that are unfinished and have a clock at all — `time_limit_seconds IS
 * NOT NULL` is what keeps practice and domain out, since those never expire —
 * and the expiry itself is then judged by the same pure function every other
 * caller uses. Re-expressing that arithmetic in SQL would work today and would
 * be a second definition of "over" with nothing binding it to the first; the
 * candidate set is a handful of rows at one candidate, so fetching them costs
 * nothing worth having a second oracle for.
 *
 * Returns how many it closed, which at one candidate is almost always zero.
 */
export async function finaliseExpiredSittings(
  db: Db,
  userId: string,
  now: Date,
): Promise<number> {
  const open = await db.execute<{
    id: string;
    mode: AttemptRow['mode'];
    started_at: Date | string;
    time_limit_seconds: number;
  }>(sql`
    SELECT id, mode, started_at, time_limit_seconds FROM attempt
    WHERE user_id = ${userId}
      AND submitted_at IS NULL
      AND time_limit_seconds IS NOT NULL
  `);

  // Raw SQL bypasses Drizzle's mapping, so the driver may hand `started_at`
  // back as a string. Normalised before it reaches the clock, because a wrong
  // start is a wrong deadline.
  const expired = open.rows.filter((row) =>
    hasExpired(
      {
        startedAt: row.started_at instanceof Date ? row.started_at : new Date(row.started_at),
        timeLimitSeconds: row.time_limit_seconds,
      },
      now,
    ),
  );

  let closed = 0;
  for (const row of expired) {
    // One statement each rather than one sweeping `UPDATE`, because the score
    // is counted inside the statement that finalises and that is the property
    // worth keeping. Sweeping them into a single update would mean writing the
    // count a second way.
    const finalised = await submitAttempt(db, {
      attemptId: row.id,
      reason: 'expired',
      scored: isScored(row.mode),
    });
    if (!finalised.alreadySubmitted) closed += 1;
  }
  return closed;
}
