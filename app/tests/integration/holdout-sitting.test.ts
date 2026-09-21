import { readFileSync } from 'node:fs';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Sitting the holdout: the timed arrangement over a frozen set (#58).
//
// **What the screen receives is asserted as data, not as a render.** PRD E3
// says no correctness indicator, no `why` and no running score is reachable
// between start and submit, and for the one sitting that can never be re-sat a
// leak cannot be un-leaked. So the page's read — `loadTimedSitting`, which the
// page spreads into the timed screen and nothing else — is called directly,
// and every key in what it returns is checked against the handful the screen
// is allowed.
//
// Everything below the session is real: the start, answer, flag, state and
// submit handlers are the exported ones, against Neon `develop`. No suite has
// ever pointed at production (doc 11 §5), which is what makes starting and
// submitting holdouts here safe.

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
const { getAttemptForUser } = await import('../../src/db/queries/attempt.ts');
const { loadTimedSitting } = await import('../../src/lib/timed-sitting.ts');
const { finaliseExpiredSittings } = await import('../../src/lib/auto-submit.ts');
const { POST: startAttempt } = await import('../../src/app/api/attempt/route.ts');
const { PUT: putAnswer } = await import('../../src/app/api/attempt/[id]/answer/route.ts');
const { PUT: putFlag } = await import('../../src/app/api/attempt/[id]/flag/route.ts');
const { GET: getState } = await import('../../src/app/api/attempt/[id]/state/route.ts');
const { POST: postSubmit } = await import('../../src/app/api/attempt/[id]/submit/route.ts');
const { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } = await import(
  './support.ts'
);
const { authBaseURL, cookieHeader, mintSession } = await import('../support/sessions.ts');

const hasDatabase = Boolean(process.env.DATABASE_URL);

const PINNED: readonly string[] = (
  JSON.parse(
    readFileSync(new URL('../../../data/holdout.json', import.meta.url), 'utf8'),
  ) as { holdout: string[] }
).holdout;

/** Which option is right, per holdout question — read from the bank, never assumed. */
const correctRef = new Map<string, string>();
const wrongRef = new Map<string, string>();

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  const keys = await db.execute<{ question_id: string; ref: string; correct: boolean }>(sql`
    SELECT o.question_id, o.ref, o.correct
    FROM question_option o JOIN question q ON q.id = o.question_id
    WHERE q.is_holdout
  `);
  for (const row of keys.rows) {
    if (row.correct) correctRef.set(row.question_id, row.ref);
    else wrongRef.set(row.question_id, row.ref);
  }
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

interface Replied {
  status: number;
  body: Record<string, unknown>;
}

async function replied(response: Response): Promise<Replied> {
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

/** A fresh candidate, signed in, with a holdout just started. */
async function startedHoldout(name: string): Promise<{ userId: string; attemptId: string }> {
  const userId = testUserId(name);
  await createTestUser(userId);
  request.cookie = cookieHeader(await mintSession(userId, authBaseURL()));
  const reply = await replied(
    await startAttempt(
      new Request('http://localhost/api/attempt', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'holdout' }),
      }),
    ),
  );
  expect(reply.status).toBe(201);
  return { userId, attemptId: reply.body.attemptId as string };
}

function params(attemptId: string) {
  return { params: Promise.resolve({ id: attemptId }) };
}

function put(url: string, body: unknown): Request {
  return new Request(url, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function answer(attemptId: string, questionId: string, optionRef: string | null) {
  return replied(
    await putAnswer(
      put(`http://localhost/api/attempt/${attemptId}/answer`, { questionId, optionRef }),
      params(attemptId),
    ),
  );
}

async function flag(attemptId: string, questionId: string, flagged: boolean) {
  return replied(
    await putFlag(
      put(`http://localhost/api/attempt/${attemptId}/flag`, { questionId, flagged }),
      params(attemptId),
    ),
  );
}

async function submit(attemptId: string) {
  return replied(
    await postSubmit(
      new Request(`http://localhost/api/attempt/${attemptId}/submit`, { method: 'POST' }),
      params(attemptId),
    ),
  );
}

/** Open the sitting the way the page does. */
async function open(userId: string, attemptId: string, now = new Date()) {
  const found = await getAttemptForUser(db, userId, attemptId);
  if (found === null) throw new Error('attempt not found');
  return loadTimedSitting(db, userId, found, now);
}

async function ready(userId: string, attemptId: string, now = new Date()) {
  const load = await open(userId, attemptId, now);
  if (load.kind !== 'ready') throw new Error(`expected ready, got ${load.kind}`);
  return load.data;
}

/** Move the sitting's start back, so its sixty minutes are over. Nothing else moves. */
async function backdate(attemptId: string, minutes: number): Promise<void> {
  await db.execute(sql`
    UPDATE attempt SET started_at = started_at - make_interval(mins => ${minutes})
    WHERE id = ${attemptId}::uuid
  `);
}

/**
 * Every key anywhere in a value, by path shape — `questions[].options[].ref`.
 * What the screen is handed is compared against this, so a field added later
 * anywhere in the payload fails here rather than riding along.
 */
function keyPaths(value: unknown, prefix = ''): Set<string> {
  const paths = new Set<string>();
  if (Array.isArray(value)) {
    for (const item of value) for (const p of keyPaths(item, `${prefix}[]`)) paths.add(p);
  } else if (value !== null && typeof value === 'object') {
    for (const [key, inner] of Object.entries(value)) {
      const path = prefix === '' ? key : `${prefix}.${key}`;
      paths.add(path);
      for (const p of keyPaths(inner, path)) paths.add(p);
    }
  }
  return paths;
}

describe.skipIf(!hasDatabase)('what a running holdout sends the browser', () => {
  let userId: string;
  let attemptId: string;
  let data: Awaited<ReturnType<typeof ready>>;

  beforeAll(async () => {
    ({ userId, attemptId } = await startedHoldout('hsit-payload'));
    // One answer and one flag, so the payload carries recorded state as well.
    await answer(attemptId, PINNED[3] as string, wrongRef.get(PINNED[3] as string) as string);
    await flag(attemptId, PINNED[5] as string, true);
    data = await ready(userId, attemptId);
  });

  it('carries only the keys the timed screen is allowed — no key, no why, no score', () => {
    const questionIds = data.questions.map((q) => q.id);
    const recordedPaths = [...keyPaths(data.initial)].filter(
      (p) => !questionIds.some((id) => p === id),
    );
    // `initial` is keyed by question id, so its inner keys are checked apart.
    expect(new Set(recordedPaths.map((p) => p.slice(p.lastIndexOf('.') + 1)))).toEqual(
      new Set(['optionRef', 'flagged']),
    );

    const { initial: _initial, copy: _copy, ...rest } = data;
    expect(keyPaths(rest)).toEqual(
      new Set([
        'attemptId',
        'passMark',
        'initialSeq',
        'deadline',
        'serverNow',
        'questions',
        'questions[].id',
        'questions[].seq',
        'questions[].stem',
        'questions[].options',
        'questions[].options[].ref',
        'questions[].options[].text',
        'finished',
        'remainingAtClose',
      ]),
    );
    expect(data.finished).toBeNull();
    expect(data.remainingAtClose).toBeNull();
  });

  it('names itself the holdout, and marks against thirty', () => {
    expect(data.copy.title).toBe('Holdout');
    expect(data.copy.reviewable).toBe(true);
    expect(data.passMark).toBe(30);
  });

  it('asks the forty pinned questions, in seq order 0…39', () => {
    expect(data.questions.map((q) => q.seq)).toEqual(PINNED.map((_, i) => i));
    expect(new Set(data.questions.map((q) => q.id))).toEqual(new Set(PINNED));
  });

  it('counts down to sixty minutes after the stored start', async () => {
    const rows = await db.execute<{ started_at: Date | string }>(sql`
      SELECT started_at FROM attempt WHERE id = ${attemptId}::uuid
    `);
    const startedAt = new Date(rows.rows[0]!.started_at);
    expect(data.deadline).toBe(new Date(startedAt.getTime() + 3600 * 1000).toISOString());
  });

  // The bank authors the key first in all 1,150 questions, so a holdout laid
  // out in authored order would put every answer at A.
  it('derives each key\'s slot, so the answer is not at A forty times', () => {
    const slots = data.questions.map((q) =>
      q.options.findIndex((o) => o.ref === correctRef.get(q.id)),
    );
    expect(slots.every((s) => s >= 0 && s <= 3)).toBe(true);
    expect(new Set(slots).size).toBeGreaterThan(1);
  });

  it('lays every question out identically on reload', async () => {
    const again = await ready(userId, attemptId);
    expect(again.questions).toEqual(data.questions);
  });
});

describe.skipIf(!hasDatabase)('a holdout reopened mid-sitting', () => {
  it('restores answers, flags, position and the true remaining time', async () => {
    const { userId, attemptId } = await startedHoldout('hsit-resume');
    const a = PINNED[0] as string;
    const b = PINNED[7] as string;
    const c = PINNED[21] as string;

    expect(await answer(attemptId, a, correctRef.get(a) as string)).toEqual({
      status: 200,
      body: { saved: true },
    });
    expect(await flag(attemptId, b, true)).toEqual({ status: 200, body: { saved: true } });
    // Touched last, so this is where the sitting reopens (PRD E5).
    await answer(attemptId, c, wrongRef.get(c) as string);

    // Twenty minutes gone while the tab was closed.
    await backdate(attemptId, 20);
    const now = new Date();
    const data = await ready(userId, attemptId, now);

    expect(data.initial[a]).toEqual({ optionRef: correctRef.get(a), flagged: false });
    expect(data.initial[b]).toEqual({ optionRef: null, flagged: true });
    expect(data.initial[c]).toEqual({ optionRef: wrongRef.get(c), flagged: false });
    expect(data.initialSeq).toBe(data.questions.findIndex((q) => q.id === c));

    const remaining = (new Date(data.deadline as string).getTime() - now.getTime()) / 1000;
    expect(remaining).toBeGreaterThan(39 * 60);
    expect(remaining).toBeLessThanOrEqual(40 * 60);
  });
});

describe.skipIf(!hasDatabase)('submitting a holdout', () => {
  it('scores n/40 against thirty, once, and reopens on that outcome', async () => {
    const { userId, attemptId } = await startedHoldout('hsit-submit');
    for (const id of PINNED.slice(0, 31)) await answer(attemptId, id, correctRef.get(id) as string);
    for (const id of PINNED.slice(31, 35)) await answer(attemptId, id, wrongRef.get(id) as string);

    const first = await submit(attemptId);
    expect(first).toEqual({
      status: 200,
      body: {
        submitted: true,
        score: 31,
        questionCount: 40,
        passMark: 30,
        passed: true,
        percent: 77.5,
        reason: 'user',
      },
    });

    // A double submit is a no-op returning the first score, even with the
    // answers changed underneath it.
    await db.execute(sql`UPDATE answer SET is_correct = false WHERE attempt_id = ${attemptId}::uuid`);
    expect(await submit(attemptId)).toEqual(first);

    const data = await ready(userId, attemptId);
    expect(data.finished).toEqual(first.body);
    expect(data.remainingAtClose).toBeGreaterThan(0);
  });

  it('is refused further answers once submitted', async () => {
    const { attemptId } = await startedHoldout('hsit-closed');
    await submit(attemptId);
    const late = await answer(attemptId, PINNED[0] as string, correctRef.get(PINNED[0] as string) as string);
    expect(late.status).toBe(409);
    expect(late.body).toEqual({
      error: { code: 'attempt_already_submitted', message: expect.any(String) },
    });
  });
});

describe.skipIf(!hasDatabase)('a holdout whose sixty minutes ran out', () => {
  // Doc 03 §6's four touches. `finaliseExpiredSittings` is the listing touch,
  // and home, the exam list and the review all call it; it has no mode filter,
  // and this confirms it rather than assuming it.

  async function expiredHoldout(name: string) {
    const started = await startedHoldout(name);
    const id = PINNED[2] as string;
    await answer(started.attemptId, id, correctRef.get(id) as string);
    await backdate(started.attemptId, 61);
    return started;
  }

  async function row(attemptId: string) {
    const r = await db.execute<{ submit_reason: string | null; score: number | null; started_at: Date }>(
      sql`SELECT submit_reason, score, started_at FROM attempt WHERE id = ${attemptId}::uuid`,
    );
    return r.rows[0]!;
  }

  it('refuses an answer past the deadline, and the refusal extends nothing', async () => {
    const { attemptId } = await expiredHoldout('hsit-late');
    const before = await row(attemptId);
    const late = await answer(attemptId, PINNED[9] as string, correctRef.get(PINNED[9] as string) as string);
    expect(late.status).toBe(409);
    expect(late.body).toEqual({ error: { code: 'attempt_expired', message: expect.any(String) } });
    expect(await row(attemptId)).toEqual(before);
  });

  // #58 opened this on its outcome, because the review did not exist yet; #59
  // built it, so the read that closes it now sends it there, as a paper's does.
  it('is closed by opening it, which sends it to its review; reopened, it shows its outcome', async () => {
    const { userId, attemptId } = await expiredHoldout('hsit-open');
    expect(await open(userId, attemptId)).toEqual({ kind: 'closed-on-read', attemptId });
    expect(await row(attemptId)).toMatchObject({ submit_reason: 'expired', score: 1 });

    const load = await open(userId, attemptId);
    expect(load.kind).toBe('ready');
    if (load.kind !== 'ready') return;
    expect(load.data.finished).toEqual({
      submitted: true,
      score: 1,
      questionCount: 40,
      passMark: 30,
      passed: false,
      percent: 2.5,
      reason: 'expired',
    });
    // The reading it closed on: past the deadline, which `formatRemaining`
    // shows as 00:00 — the same arithmetic an expired paper has always used.
    expect(load.data.remainingAtClose).toBeLessThanOrEqual(0);
  });

  it('is closed by a resync', async () => {
    const { attemptId } = await expiredHoldout('hsit-state');
    const reply = await replied(
      await getState(new Request(`http://localhost/api/attempt/${attemptId}/state`), params(attemptId)),
    );
    expect(reply.body.status).toBe('submitted');
    expect(await row(attemptId)).toMatchObject({ submit_reason: 'expired', score: 1 });
  });

  it('is closed by the listing sweep', async () => {
    const { userId, attemptId } = await expiredHoldout('hsit-sweep');
    expect(await finaliseExpiredSittings(db, userId, new Date())).toBe(1);
    expect(await row(attemptId)).toMatchObject({ submit_reason: 'expired', score: 1 });
  });

  it('is recorded expired even when the button is what closes it', async () => {
    const { attemptId } = await expiredHoldout('hsit-button');
    const reply = await submit(attemptId);
    expect(reply.body).toMatchObject({ score: 1, reason: 'expired' });
  });
});
