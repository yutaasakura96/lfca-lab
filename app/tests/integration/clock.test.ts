import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { createAttempt, getAttemptForUser } from '../../src/db/queries/attempt.ts';
import {
  EXAM_TIME_LIMIT_SECONDS,
  deadlineOf,
  hasExpired,
  remainingToDeadline,
} from '../../src/domain/clock.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

/**
 * No connection string, nothing to integrate with — this file skips rather than
 * fails, exactly as its neighbours do.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL);

// The clock, where it meets a real row.
//
// The arithmetic is unit-tested to death and needs no database. What needs one
// is the claim underneath it: that `started_at` and the limit come back out of
// Postgres as the types the pure layer was tested against, and that reading the
// same attempt again yields the same deadline.
//
// That first claim is not theoretical here. A raw `db.execute` returns unmapped
// columns, and this repo has already shipped a bug where `started_at` arrived
// as a **string** — every timed sitting failed at creation. A string flows
// through `new Date(...)` arithmetic as `NaN` rather than as an error, so a
// deadline built from one is `Invalid Date` and a countdown built from that is
// blank. Nothing in the pure suite can catch it, because the pure suite is
// handed real `Date`s by construction.

const userId = testUserId('clock');

let attemptId: string;

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);

  const started = await createAttempt(db, {
    userId,
    mode: 'exam',
    examId: 'exam-01',
    questionCount: 60,
  });
  attemptId = started.id;
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

describe.skipIf(!hasDatabase)('the clock over a real attempt row', () => {
  it('reads back a real Date, not a string that looks like one', () => {
    // The regression that has actually happened. `instanceof` rather than a
    // duck-typed check, because a string is what got through last time.
    return getAttemptForUser(db, userId, attemptId).then((attempt) => {
      expect(attempt).not.toBeNull();
      expect(attempt?.startedAt).toBeInstanceOf(Date);
      expect(Number.isNaN(attempt?.startedAt.getTime())).toBe(false);
    });
  });

  it('gives an exam sitting the ninety minutes the real exam gives', async () => {
    const attempt = await getAttemptForUser(db, userId, attemptId);
    expect(attempt?.timeLimitSeconds).toBe(EXAM_TIME_LIMIT_SECONDS);

    const deadline = deadlineOf(attempt!);
    expect(deadline).not.toBeNull();
    expect(Number.isNaN(deadline!.getTime())).toBe(false);
    expect(deadline!.getTime() - attempt!.startedAt.getTime()).toBe(
      EXAM_TIME_LIMIT_SECONDS * 1000,
    );
  });

  it('answers the same deadline every time it is asked', async () => {
    // Two reads stand in for two tabs. They cannot disagree, because neither
    // holds a countdown — both derive one from columns written once at start.
    // This is also the "nothing extends the clock" criterion in its most
    // direct form: reading is the only thing that happens here, and it moves
    // nothing.
    const first = await getAttemptForUser(db, userId, attemptId);
    const second = await getAttemptForUser(db, userId, attemptId);
    expect(deadlineOf(second!)?.toISOString()).toBe(deadlineOf(first!)?.toISOString());
  });

  it('is not expired the moment it starts, and is long after', async () => {
    const attempt = await getAttemptForUser(db, userId, attemptId);
    expect(hasExpired(attempt!, attempt!.startedAt)).toBe(false);

    const wayPast = new Date(attempt!.startedAt.getTime() + (EXAM_TIME_LIMIT_SECONDS + 1) * 1000);
    expect(hasExpired(attempt!, wayPast)).toBe(true);
  });

  it('counts down to the same instant from either side of the wire', async () => {
    // The server decides expiry from `started_at`; the browser counts down to
    // an instant. Both are computed here from the same row, and a difference
    // between them is a clock that would appear to jump on resync.
    const attempt = await getAttemptForUser(db, userId, attemptId);
    const deadline = deadlineOf(attempt!);
    const halfway = new Date(attempt!.startedAt.getTime() + (EXAM_TIME_LIMIT_SECONDS / 2) * 1000);

    expect(remainingToDeadline(deadline, halfway)).toBe(EXAM_TIME_LIMIT_SECONDS / 2);
  });
});
