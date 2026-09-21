import { readFileSync } from 'node:fs';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Starting the holdout, and refusing a second — asserted as rows.
//
// **"Sat once" is a claim about the database, so it is proved against one.**
// Everything else about the holdout is a screen; this is the part with no
// undo. So the three outcomes of `POST /api/attempt` are driven through the
// real exported route handler — never sat, in progress, sat — and each is
// checked by what it wrote, not only by what it said.
//
// Each outcome gets its own user, so a failure in one cannot cascade into the
// next and read as a second failure. The suite runs on Neon `develop` and may
// start, submit and refuse holdouts as often as it likes; no suite has ever
// pointed at production (doc 11 §5), which is what makes that safe.
//
// As in `answer-feedback.test.ts`, only `next/headers` stands in for the world.

const request = vi.hoisted(() => ({ cookie: '' }));

/**
 * One stale read of the holdout standing, on demand. A lost race is two starts
 * that both read "never sat" before either writes, and the timing that
 * produces it cannot be arranged reliably — two concurrent requests here
 * serialise often enough to pass without any guard at all. So the race is
 * reproduced by its *cause*: the route's first read reports "never sat" while
 * a holdout already exists, and the insert that follows meets the index for
 * real. Everything after that read is unmocked.
 */
const standing = vi.hoisted(() => ({ staleOnce: false }));

vi.mock('../../src/db/queries/attempt.ts', async (importOriginal) => {
  const real = await importOriginal<typeof import('../../src/db/queries/attempt.ts')>();
  return {
    ...real,
    holdoutStanding: async (...args: Parameters<typeof real.holdoutStanding>) => {
      if (standing.staleOnce) {
        standing.staleOnce = false;
        return { openId: null, sat: false };
      }
      return real.holdoutStanding(...args);
    },
  };
});

vi.mock('next/headers', () => ({
  headers: async () => new Headers(request.cookie ? { cookie: request.cookie } : {}),
  cookies: async () => ({
    get: () => undefined,
    getAll: () => [],
    has: () => false,
    set: () => {},
    delete: () => {},
  }),
}));

const { db, pool } = await import('../../src/db/client.ts');
const { selectHoldoutQuestions } = await import('../../src/db/queries/selection.ts');
const { startComposedSitting } = await import('../../src/db/queries/attempt.ts');
const { POST: startAttempt } = await import('../../src/app/api/attempt/route.ts');
const { POST: submitAttempt } = await import('../../src/app/api/attempt/[id]/submit/route.ts');
const { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } = await import(
  './support.ts'
);
const { authBaseURL, cookieHeader, mintSession } = await import('../support/sessions.ts');

const hasDatabase = Boolean(process.env.DATABASE_URL);

/**
 * The forty, read from the committed pin rather than from the database. The
 * frozen set is compared against *this*, so the assertion is independent of
 * the seed and of the query under test — if either drifted from the pin, the
 * comparison would say so instead of agreeing with itself.
 */
const PINNED: readonly string[] = (
  JSON.parse(
    readFileSync(new URL('../../../data/holdout.json', import.meta.url), 'utf8'),
  ) as { holdout: string[] }
).holdout;

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

/** A fresh candidate, signed in: every request after this one is theirs. */
async function signedInAs(name: string): Promise<string> {
  const userId = testUserId(name);
  await createTestUser(userId);
  request.cookie = cookieHeader(await mintSession(userId, authBaseURL()));
  return userId;
}

interface Replied {
  status: number;
  body: Record<string, unknown>;
}

async function start(body: unknown): Promise<Replied> {
  const response = await startAttempt(
    new Request('http://localhost/api/attempt', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

async function submit(attemptId: string): Promise<Replied> {
  const response = await submitAttempt(
    new Request(`http://localhost/api/attempt/${attemptId}/submit`, { method: 'POST' }),
    { params: Promise.resolve({ id: attemptId }) },
  );
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

/** What one candidate has written, counted — the evidence that a refusal wrote nothing. */
async function footprint(userId: string): Promise<{ attempts: number; frozen: number }> {
  const r = await db.execute<{ attempts: number; frozen: number }>(sql`
    SELECT
      (SELECT count(*)::int FROM attempt WHERE user_id = ${userId}) AS attempts,
      (SELECT count(*)::int FROM attempt_question aq
         JOIN attempt a ON a.id = aq.attempt_id
        WHERE a.user_id = ${userId}) AS frozen
  `);
  return r.rows[0] as { attempts: number; frozen: number };
}

describe.skipIf(!hasDatabase)('the first start', () => {
  let userId: string;
  let reply: Replied;

  beforeAll(async () => {
    userId = await signedInAs('holdout-first');
    reply = await start({ mode: 'holdout' });
  });

  it('answers 201 with the sitting, its forty, and a deadline — and nothing else', () => {
    expect(reply.status).toBe(201);
    // The whole body, so a field added later fails here rather than riding along.
    expect(reply.body).toEqual({
      attemptId: expect.any(String),
      questionCount: 40,
      deadline: expect.any(String),
    });
  });

  it('writes one attempt: holdout, forty questions, sixty minutes, not a first attempt', async () => {
    const rows = await db.execute(sql`
      SELECT mode, question_count, time_limit_seconds, is_first_attempt,
             exam_id, domain, submitted_at, score
      FROM attempt WHERE user_id = ${userId}
    `);
    expect(rows.rows).toEqual([
      {
        mode: 'holdout',
        question_count: 40,
        time_limit_seconds: 3600,
        is_first_attempt: false,
        exam_id: null,
        domain: null,
        submitted_at: null,
        score: null,
      },
    ]);
  });

  // `one_first_attempt_per_exam` is partial on `is_first_attempt`, so a row with
  // the flag false is not in it. Observed as the index sees it: nothing of this
  // candidate's qualifies.
  it('claims no first-attempt flag anywhere', async () => {
    const rows = await db.execute<{ n: number }>(sql`
      SELECT count(*)::int AS n FROM attempt WHERE user_id = ${userId} AND is_first_attempt
    `);
    expect(rows.rows[0]?.n).toBe(0);
  });

  it('freezes exactly the forty pinned ids, in seq order 0…39', async () => {
    const rows = await db.execute<{ seq: number; question_id: string }>(sql`
      SELECT seq, question_id FROM attempt_question
      WHERE attempt_id = ${reply.body.attemptId as string}::uuid
      ORDER BY seq ASC
    `);
    expect(rows.rows.map((r) => r.seq)).toEqual(PINNED.map((_, i) => i));
    expect(new Set(rows.rows.map((r) => r.question_id))).toEqual(new Set(PINNED));
    expect(PINNED).toHaveLength(40);
  });

  it('dates the deadline sixty minutes after the stored start, to the millisecond', async () => {
    const rows = await db.execute<{ started_at: Date | string }>(sql`
      SELECT started_at FROM attempt WHERE id = ${reply.body.attemptId as string}::uuid
    `);
    const startedAt = new Date(rows.rows[0]!.started_at);
    expect(reply.body.deadline).toBe(new Date(startedAt.getTime() + 3600 * 1000).toISOString());
  });
});

describe.skipIf(!hasDatabase)('a start while the holdout is in progress', () => {
  // Started, tab closed, clock still running. Refusing here would strand the
  // one sitting that can never be redone, reachable only through home's resume
  // band — so it is handed back, exactly as an exam paper's open sitting is.
  it('hands the running sitting back with 200 and writes nothing', async () => {
    const userId = await signedInAs('holdout-open');
    const first = await start({ mode: 'holdout' });
    const before = await footprint(userId);

    const again = await start({ mode: 'holdout' });

    expect(again.status).toBe(200);
    expect(again.body).toEqual({ attemptId: first.body.attemptId, resumed: true });
    expect(await footprint(userId)).toEqual(before);
    expect(before).toEqual({ attempts: 1, frozen: 40 });
  });
});

describe.skipIf(!hasDatabase)('a start once the holdout has been sat', () => {
  it('is refused 409 holdout_already_sat, in the one error shape, and writes nothing', async () => {
    const userId = await signedInAs('holdout-sat');
    const first = await start({ mode: 'holdout' });
    const submitted = await submit(first.body.attemptId as string);
    expect(submitted.status).toBe(200);
    expect(submitted.body.passMark).toBe(30);
    const before = await footprint(userId);

    const again = await start({ mode: 'holdout' });

    expect(again.status).toBe(409);
    expect(again.body).toEqual({
      error: { code: 'holdout_already_sat', message: expect.any(String) },
    });
    expect(await footprint(userId)).toEqual(before);
    expect(before).toEqual({ attempts: 1, frozen: 40 });
  });
});

describe.skipIf(!hasDatabase)('two starts at once', () => {
  // The check in the route is a read followed by an insert, and two requests
  // can both read "never sat" — a double press on the dialog, or two tabs.
  // What stops the second holdout is the database, not the read.
  it('are refused a second holdout by the schema itself, whatever calls it', async () => {
    const userId = await signedInAs('holdout-index');
    await start({ mode: 'holdout' });
    const before = await footprint(userId);

    // Around the route entirely: the refusal holds for any future caller that
    // forgets to ask `holdoutStanding` first.
    await expect(
      startComposedSitting(db, { userId, mode: 'holdout' }, await selectHoldoutQuestions(db)),
    ).rejects.toThrow();
    expect(await footprint(userId)).toEqual(before);
  });

  it('hand the loser the winner\'s running sitting, and write nothing', async () => {
    const userId = await signedInAs('holdout-race-open');
    const winner = await start({ mode: 'holdout' });
    const before = await footprint(userId);

    standing.staleOnce = true;
    const loser = await start({ mode: 'holdout' });

    expect(standing.staleOnce).toBe(false);
    expect(loser.status).toBe(200);
    expect(loser.body).toEqual({ attemptId: winner.body.attemptId, resumed: true });
    expect(await footprint(userId)).toEqual(before);
  });

  // The loser's second look can find the winner already finished — a race
  // decided after the winner's sitting was submitted is still a sitting sat.
  it('refuse the loser 409 when the winner has already been sat', async () => {
    const userId = await signedInAs('holdout-race-sat');
    const winner = await start({ mode: 'holdout' });
    await submit(winner.body.attemptId as string);
    const before = await footprint(userId);

    standing.staleOnce = true;
    const loser = await start({ mode: 'holdout' });

    expect(loser.status).toBe(409);
    expect(loser.body).toEqual({
      error: { code: 'holdout_already_sat', message: expect.any(String) },
    });
    expect(await footprint(userId)).toEqual(before);
  });
});

describe.skipIf(!hasDatabase)('a holdout request that names a length', () => {
  it('is refused 400 invalid_request, and writes nothing', async () => {
    const userId = await signedInAs('holdout-length');

    const reply = await start({ mode: 'holdout', length: 40 });

    expect(reply.status).toBe(400);
    expect(reply.body).toEqual({
      error: { code: 'invalid_request', message: expect.any(String) },
    });
    expect(await footprint(userId)).toEqual({ attempts: 0, frozen: 0 });
  });
});

describe.skipIf(!hasDatabase)('a holdout that is not forty is never handed out', () => {
  // Unreachable against a healthy bank — the seed asserts forty — and the one
  // failure this sitting cannot recover from: a wrong-sized holdout would be
  // written down and spent. So the one query that reads the pin refuses, which
  // is before the start transaction opens and before any row exists.
  //
  // Provoked inside a transaction that is rolled back **unconditionally**, so
  // the shared bank on `develop` is never changed. The first draft let the
  // refusal itself cause the rollback — and its red run, before the guard
  // existed, committed the `UPDATE` and left `develop` marking thirty-nine
  // until a reseed. A test whose cleanup depends on the code under test being
  // right does its damage exactly when that code is wrong, which is every red
  // run and every mutation check.
  it('refuses when the bank marks thirty-nine', async () => {
    const rollback = new Error('rolled back on purpose');
    let refusal: unknown = null;

    await expect(
      db.transaction(async (tx) => {
        await tx.execute(sql`
          UPDATE question SET is_holdout = false WHERE id = ${PINNED[0] as string}
        `);
        try {
          await selectHoldoutQuestions(tx);
        } catch (error) {
          refusal = error;
        }
        throw rollback;
      }),
    ).rejects.toBe(rollback);

    expect(refusal).toBeInstanceOf(Error);
    expect((refusal as Error).message).toMatch(/39.*40/);
    expect(await selectHoldoutQuestions(db)).toHaveLength(40);
  });
});
