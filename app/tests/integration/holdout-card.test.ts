import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Home's holdout card, read the way home reads it (#60).
//
// The page is a server component the suite cannot render, so its read is
// `loadHome` and the card's state is asserted here as data — the seam #58 and
// #59 used for the sitting and the review. Each state is reached through the
// real exported handlers against Neon `develop`: start, submit, and a clock
// that ran out while nobody was there.

const request = vi.hoisted(() => ({ cookie: '' }));

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
const { loadHome } = await import('../../src/lib/home.ts');
const { POST: startAttempt } = await import('../../src/app/api/attempt/route.ts');
const { POST: postSubmit } = await import('../../src/app/api/attempt/[id]/submit/route.ts');
const { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } = await import(
  './support.ts'
);
const { authBaseURL, cookieHeader, mintSession } = await import('../support/sessions.ts');

const hasDatabase = Boolean(process.env.DATABASE_URL);

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

async function signedInAs(name: string): Promise<string> {
  const userId = testUserId(name);
  await createTestUser(userId);
  request.cookie = cookieHeader(await mintSession(userId, authBaseURL()));
  return userId;
}

async function startHoldout(): Promise<string> {
  const response = await startAttempt(
    new Request('http://localhost/api/attempt', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'holdout' }),
    }),
  );
  expect(response.status).toBe(201);
  return ((await response.json()) as { attemptId: string }).attemptId;
}

async function submit(attemptId: string) {
  const response = await postSubmit(
    new Request(`http://localhost/api/attempt/${attemptId}/submit`, { method: 'POST' }),
    { params: Promise.resolve({ id: attemptId }) },
  );
  expect(response.status).toBe(200);
}

describe.skipIf(!hasDatabase)('the holdout card on home', () => {
  it('offers the start to a candidate who has never sat it', async () => {
    const userId = await signedInAs('hcard-never');
    const home = await loadHome(db, userId, new Date());
    expect(home.holdout).toEqual({ kind: 'never' });
    expect(home.open).toEqual([]);
  });

  it('offers a running holdout back, and lists it in the band above as well', async () => {
    const userId = await signedInAs('hcard-running');
    const attemptId = await startHoldout();

    const home = await loadHome(db, userId, new Date());
    expect(home.holdout).toEqual({ kind: 'running', attemptId });
    expect(home.open.map((s) => ({ id: s.id, mode: s.mode }))).toEqual([
      { id: attemptId, mode: 'holdout' },
    ]);
  });

  it('is the result once submitted: n/40, against 30, on the day it was sat', async () => {
    const userId = await signedInAs('hcard-sat');
    const attemptId = await startHoldout();
    await submit(attemptId);

    const row = await db.execute<{ submitted_at: Date | string }>(
      sql`SELECT submitted_at FROM attempt WHERE id = ${attemptId}`,
    );
    const submittedAt = new Date(row.rows[0]!.submitted_at);

    const home = await loadHome(db, userId, new Date());
    // Nothing answered: 0/40 and a fail — the number is what was sat, however
    // it was sat.
    expect(home.holdout).toEqual({
      kind: 'sat',
      attemptId,
      score: 0,
      questionCount: 40,
      passMark: 30,
      passed: false,
      day: submittedAt.toISOString().slice(0, 10),
    });
    expect(home.open).toEqual([]);
  });

  // PRD H1's one-shot cannot be dodged by walking out of it: a holdout whose
  // sixty minutes ran out unattended is closed by home's own sweep and reads as
  // the result — never as something to resume.
  it('sweeps a holdout that lapsed unattended and reads it as the result', async () => {
    const userId = await signedInAs('hcard-lapsed');
    const attemptId = await startHoldout();
    await db.execute(sql`
      UPDATE attempt SET started_at = now() - interval '61 minutes' WHERE id = ${attemptId}
    `);

    const home = await loadHome(db, userId, new Date());
    expect(home.holdout).toMatchObject({ kind: 'sat', attemptId, score: 0, passed: false });
    expect(home.open).toEqual([]);

    const closed = await db.execute<{ submit_reason: string | null }>(
      sql`SELECT submit_reason FROM attempt WHERE id = ${attemptId}`,
    );
    expect(closed.rows[0]!.submit_reason).toBe('expired');
  });
});
