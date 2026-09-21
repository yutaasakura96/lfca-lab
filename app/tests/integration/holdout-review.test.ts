import { readFileSync } from 'node:fs';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Reading the holdout back: the scored review over a frozen set (#59).
//
// The holdout is composed like a practice run and scored like a paper, so it
// takes the scored branch of the review over `attempt_question`. What the
// scored branch assumed about having a paper — a re-sit, an ordinal, a best and
// a first attempt — is exactly what the holdout must not show, so the page's
// scored read is `loadScoredReview` and its `paper` is asserted `null` here as
// data, the way #58 asserted the sitting's payload rather than its render.
//
// Everything below the session is real, against Neon `develop` — the start,
// answer, flag and submit handlers are the exported ones.

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
const { getAttemptForUser, createAttempt } = await import('../../src/db/queries/attempt.ts');
const { getSittingReviewQuestions } = await import('../../src/db/queries/review.ts');
const { submitAttempt } = await import('../../src/db/queries/submit.ts');
const { countByFilter, verdictOf } = await import('../../src/domain/review.ts');
const { layOutForPaper, slotForComposedSitting } = await import('../../src/domain/paper.ts');
const { loadTimedSitting } = await import('../../src/lib/timed-sitting.ts');
const { loadScoredReview } = await import('../../src/lib/scored-review.ts');
const { POST: startAttempt } = await import('../../src/app/api/attempt/route.ts');
const { PUT: putAnswer } = await import('../../src/app/api/attempt/[id]/answer/route.ts');
const { PUT: putFlag } = await import('../../src/app/api/attempt/[id]/flag/route.ts');
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

async function startedHoldout(name: string): Promise<{ userId: string; attemptId: string }> {
  const userId = testUserId(name);
  await createTestUser(userId);
  request.cookie = cookieHeader(await mintSession(userId, authBaseURL()));
  const response = await startAttempt(
    new Request('http://localhost/api/attempt', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'holdout' }),
    }),
  );
  expect(response.status).toBe(201);
  const body = (await response.json()) as { attemptId: string };
  return { userId, attemptId: body.attemptId };
}

async function answer(attemptId: string, questionId: string, optionRef: string) {
  const response = await putAnswer(
    put(`http://localhost/api/attempt/${attemptId}/answer`, { questionId, optionRef }),
    params(attemptId),
  );
  expect(response.status).toBe(200);
}

async function flag(attemptId: string, questionId: string) {
  const response = await putFlag(
    put(`http://localhost/api/attempt/${attemptId}/flag`, { questionId, flagged: true }),
    params(attemptId),
  );
  expect(response.status).toBe(200);
}

async function submit(attemptId: string) {
  const response = await postSubmit(
    new Request(`http://localhost/api/attempt/${attemptId}/submit`, { method: 'POST' }),
    params(attemptId),
  );
  expect(response.status).toBe(200);
}

async function attemptRow(userId: string, attemptId: string) {
  const found = await getAttemptForUser(db, userId, attemptId);
  if (found === null) throw new Error('attempt not found');
  return found;
}

/** Twenty-eight right, five wrong, seven blank; two flagged, one of them blank. */
async function satHoldout(name: string) {
  const started = await startedHoldout(name);
  const sat = await loadTimedSitting(
    db,
    started.userId,
    await attemptRow(started.userId, started.attemptId),
    new Date(),
  );
  if (sat.kind !== 'ready') throw new Error(`expected ready, got ${sat.kind}`);
  const order = sat.data.questions.map((q) => q.id);

  for (const id of order.slice(0, 28)) await answer(started.attemptId, id, correctRef.get(id)!);
  for (const id of order.slice(28, 33)) await answer(started.attemptId, id, wrongRef.get(id)!);
  await flag(started.attemptId, order[2]!);
  await flag(started.attemptId, order[38]!);
  await submit(started.attemptId);

  return { ...started, order, sittingQuestions: sat.data.questions };
}

describe.skipIf(!hasDatabase)('the questions a submitted holdout reads back', () => {
  let held: Awaited<ReturnType<typeof satHoldout>>;
  let review: Awaited<ReturnType<typeof getSittingReviewQuestions>>;

  beforeAll(async () => {
    held = await satHoldout('hrev-questions');
    review = await getSittingReviewQuestions(
      db,
      held.userId,
      await attemptRow(held.userId, held.attemptId),
    );
    // Thirty-five writes to Neon, each a round trip.
  }, 60_000);

  it('are the forty pinned questions, in seq order 0…39', () => {
    expect(review.map((q) => q.seq)).toEqual(PINNED.map((_, i) => i));
    expect(new Set(review.map((q) => q.id))).toEqual(new Set(PINNED));
    expect(review.map((q) => q.id)).toEqual(held.order);
  });

  it('carry all four options, each with its explanation', () => {
    for (const question of review) {
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((o) => o.correct)).toHaveLength(1);
      for (const option of question.options) expect(option.why.trim()).not.toBe('');
    }
  });

  // The verdict named a letter during the sitting, so the review must lay each
  // question out in exactly the order the sitting did.
  it('lay every question out at the slot the sitting used', () => {
    const sat = new Map(held.sittingQuestions.map((q) => [q.id, q.options.map((o) => o.ref)]));
    for (const question of review) {
      expect(question.options.map((o) => o.ref), question.id).toEqual(sat.get(question.id));
      const key = question.options.findIndex((o) => o.correct);
      expect(key, question.id).toBe(slotForComposedSitting(held.attemptId, question.id));
    }
    expect(new Set(review.map((q) => q.options.findIndex((o) => o.correct))).size).toBeGreaterThan(1);
  });

  it('agree with the one placement function, from the authored order', () => {
    for (const question of review) {
      const authored = [...question.options].sort((a, b) => a.ref.localeCompare(b.ref));
      const expected = layOutForPaper(
        authored.map((o, position) => ({ ...o, position })),
        slotForComposedSitting(held.attemptId, question.id),
      ).map((o) => o.ref);
      expect(question.options.map((o) => o.ref)).toEqual(expected);
    }
  });

  it('keep the flags, because the holdout may flag', () => {
    expect(review.filter((q) => q.flagged).map((q) => q.id)).toEqual([
      held.order[2],
      held.order[38],
    ]);
  });

  it('count blanks as incorrect, so correct and incorrect sum to forty', () => {
    const counts = countByFilter(
      review.map((q) => ({ domain: q.domain, verdict: verdictOf(q), flagged: q.flagged })),
      true,
    );
    expect(counts).toMatchObject({ correct: 28, incorrect: 12, flagged: 2, all: 40 });
    expect(counts.correct + counts.incorrect).toBe(40);
  });
});

describe.skipIf(!hasDatabase)('what the scored review says about a holdout', () => {
  it('scores n/40 against thirty, names itself, and has no paper', async () => {
    const held = await satHoldout('hrev-load');
    const load = await loadScoredReview(db, held.userId, await attemptRow(held.userId, held.attemptId));
    if (load.kind !== 'ready') throw new Error(`expected ready, got ${load.kind}`);

    expect(load.data.title).toBe('Holdout');
    expect(load.data.back).toEqual({ href: '/', label: 'Back to home' });
    expect(load.data.outcome).toEqual({
      submitted: true,
      score: 28,
      questionCount: 40,
      passMark: 30,
      passed: false,
      percent: 70,
      reason: 'user',
    });
    // No paper is what removes the re-sit, the ordinal, the best and the first
    // attempt together. There is no truthful re-sit of a one-shot sitting.
    expect(load.data.paper).toBeNull();
    expect(load.data.elapsedSeconds).toBeLessThanOrEqual(3600);
  });

  it('reports an expired holdout as expired, and is where opening it now sends you', async () => {
    const { userId, attemptId } = await startedHoldout('hrev-expired');
    await answer(attemptId, PINNED[0]!, correctRef.get(PINNED[0]!)!);
    await db.execute(sql`
      UPDATE attempt SET started_at = started_at - make_interval(mins => 61)
      WHERE id = ${attemptId}::uuid
    `);

    const opened = await loadTimedSitting(db, userId, await attemptRow(userId, attemptId), new Date());
    expect(opened).toEqual({ kind: 'closed-on-read', attemptId });

    const load = await loadScoredReview(db, userId, await attemptRow(userId, attemptId));
    if (load.kind !== 'ready') throw new Error(`expected ready, got ${load.kind}`);
    expect(load.data.outcome).toMatchObject({ score: 1, questionCount: 40, reason: 'expired' });
    expect(load.data.elapsedSeconds).toBe(3600);
  });

  it('is missing for a holdout still running', async () => {
    const { userId, attemptId } = await startedHoldout('hrev-running');
    expect(await loadScoredReview(db, userId, await attemptRow(userId, attemptId))).toEqual({
      kind: 'missing',
    });
  });
});

describe.skipIf(!hasDatabase)('what the scored review says about a paper, unchanged', () => {
  it('keeps its title, its way back, its history and its re-sit', async () => {
    const userId = testUserId('hrev-exam');
    await createTestUser(userId);
    const started = await createAttempt(db, { userId, mode: 'exam', examId: 'exam-03', questionCount: 60 });
    await submitAttempt(db, { attemptId: started.id, reason: 'user', scored: true });

    const load = await loadScoredReview(db, userId, await attemptRow(userId, started.id));
    if (load.kind !== 'ready') throw new Error(`expected ready, got ${load.kind}`);

    expect(load.data.title).toBe('Practice exam 03');
    expect(load.data.back).toEqual({ href: '/exams', label: 'Back to the sixteen exams' });
    expect(load.data.outcome).toMatchObject({ score: 0, questionCount: 60, passMark: 45 });
    expect(load.data.paper).toEqual({
      examId: 'exam-03',
      openAttemptId: null,
      context: { ordinal: 1, attempts: 1, bestScore: 0, firstAttemptScore: 0 },
    });
  });
});
