import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Closing an unscored sitting, asserted on the bytes and on the row.
//
// Two different claims, and neither can be made against a pure function. On the
// wire: doc 07 §5 answers a practice or domain submit with the four measured
// fields **null together**, and a number appearing in any of them would be a
// score reaching a mode PRD P1 says is not measured. In the database: `score`
// stays null and `submit_reason` is `user`, which is the column doc 04 §5.1's
// `CHECK (score IS NULL OR mode IN ('exam','holdout'))` is guarding.
//
// So this file drives the **real exported route handler**, as the feedback
// suite does, with `next/headers` the only thing standing in for the world.
// Asserting `toEqual` on the whole body rather than on four absent field names
// is deliberate: a fifth field added later fails here, which is the failure
// mode a screen would never show.

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
const { recordAnswer } = await import('../../src/db/queries/answer.ts');
const { createAttempt, listOpenSittings, startComposedSitting } = await import(
  '../../src/db/queries/attempt.ts'
);
const { listExams } = await import('../../src/db/queries/exams.ts');
const {
  selectDomainQuestions,
  selectPracticeQuestions,
} = await import('../../src/db/queries/selection.ts');
const { POST: postSubmit } = await import('../../src/app/api/attempt/[id]/submit/route.ts');
const { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } = await import(
  './support.ts'
);
const { authBaseURL, cookieHeader, mintSession } = await import('../support/sessions.ts');

/** Without a connection string there is nothing to integrate with. */
const hasDatabase = Boolean(process.env.DATABASE_URL);

const userId = testUserId('finish');

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  request.cookie = cookieHeader(await mintSession(userId, authBaseURL()));
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

interface Submitted {
  status: number;
  body: Record<string, unknown>;
}

/** Call the real handler, the way the browser calls it: no body at all. */
async function finish(attemptId: string): Promise<Submitted> {
  const response = await postSubmit(
    new Request(`http://localhost/api/attempt/${attemptId}/submit`, { method: 'POST' }),
    { params: Promise.resolve({ id: attemptId }) },
  );
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

/** A fresh practice sitting of `length`, with its first `answered` questions answered. */
async function practiceSitting(length: 20 | 40 | 60, answered: number): Promise<string> {
  const ids = await selectPracticeQuestions(db, userId, length);
  const started = await startComposedSitting(db, { userId, mode: 'practice' }, ids);
  for (const questionId of ids.slice(0, answered)) {
    await recordAnswer(db, { attemptId: started.id, questionId, optionRef: 'o1' });
  }
  return started.id;
}

interface AttemptRowShape extends Record<string, unknown> {
  score: number | null;
  submit_reason: string | null;
  question_count: number;
  answered: number;
}

async function readRow(attemptId: string): Promise<AttemptRowShape> {
  const rows = await db.execute<AttemptRowShape>(sql`
    SELECT t.score, t.submit_reason, t.question_count,
           count(a.question_id) FILTER (WHERE a.option_ref IS NOT NULL)::int AS answered
    FROM attempt t
    LEFT JOIN answer a ON a.attempt_id = t.id
    WHERE t.id = ${attemptId}::uuid
    GROUP BY t.score, t.submit_reason, t.question_count
  `);
  return rows.rows[0]!;
}

describe.skipIf(!hasDatabase)('finishing an unscored sitting', () => {
  it('answers with the four measured fields null together', async () => {
    const attemptId = await practiceSitting(20, 20);

    const { status, body } = await finish(attemptId);

    expect(status).toBe(200);
    // The whole body, not four absent names. A measured field appearing here
    // later — under any name — is a score reaching a mode PRD P1 does not
    // measure, and this is where it has to fail.
    expect(body).toEqual({
      submitted: true,
      score: null,
      questionCount: 20,
      passMark: null,
      passed: null,
      percent: null,
      reason: 'user',
    });
  });

  it('records no score and the candidate as the reason', async () => {
    const attemptId = await practiceSitting(20, 20);
    await finish(attemptId);

    const row = await readRow(attemptId);
    expect(row.score).toBeNull();
    // `expired` is unreachable without a clock: these modes carry
    // `time_limit_seconds = null`, so nothing can put the sitting past a
    // deadline it does not have.
    expect(row.submit_reason).toBe('user');
  });

  it('answers a second submit with the first one', async () => {
    const attemptId = await practiceSitting(20, 20);

    const first = await finish(attemptId);
    const second = await finish(attemptId);

    expect(second.status).toBe(200);
    expect(second.body).toEqual(first.body);
  });

  it('closes a sitting saved and exited on question 7 with thirteen unreached', async () => {
    // #37's own figure: "Save and exit from question 7 of 20 finalises the
    // sitting with 13 questions unreached." Strictly forward, so being on
    // question 7 and answering it means seven answered and questions 8–20 —
    // thirteen of them — never reached. What makes those thirteen "unreached"
    // rather than "wrong" is `score` staying null: an exam counts a blank
    // against the mark, and there is no mark here for it to count against.
    const attemptId = await practiceSitting(20, 7);

    const { body } = await finish(attemptId);
    const row = await readRow(attemptId);

    expect(body.questionCount).toBe(20);
    expect(row.question_count).toBe(20);
    expect(row.answered).toBe(7);
    expect(row.question_count - row.answered).toBe(13);
    expect(row.score).toBeNull();
  });

  it('closes a domain sitting the same way', async () => {
    const ids = await selectDomainQuestions(db, userId, 'security', 20);
    const started = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'security' },
      ids,
    );

    const { status, body } = await finish(started.id);

    expect(status).toBe(200);
    expect(body.score).toBeNull();
    expect(body.reason).toBe('user');
    expect((await readRow(started.id)).score).toBeNull();
  });

  it('takes the sitting off the list of what is still open', async () => {
    // The reason this ticket exists. A composed sitting never expires, so
    // nothing finalises it lazily — without a finish it stays
    // `submitted_at IS NULL` for ever, on the partial index home reads on every
    // render to ask what is in progress.
    const attemptId = await practiceSitting(20, 3);

    const before = await listOpenSittings(db, userId);
    expect(before.map((s) => s.id)).toContain(attemptId);

    await finish(attemptId);

    const after = await listOpenSittings(db, userId);
    expect(after.map((s) => s.id)).not.toContain(attemptId);
  });

  it('never reaches the exam list, in either mode, before or after finishing', async () => {
    // Not a stylistic check: `attempt.exam_id` is null in these modes, so
    // neither a practice run nor a domain run can become a best score, a
    // first-attempt score or an attempt count on any of the sixteen. Asserted
    // with an exam sitting of exam-01 present, so a list that reported nothing
    // would fail here too — and with **both** unscored modes, because #37 asks
    // about both and one of them passing proves nothing about the other.
    const exam = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-01',
      questionCount: 60,
    });
    const attemptId = await practiceSitting(20, 20);
    await finish(attemptId);

    const domainIds = await selectDomainQuestions(db, userId, 'devops', 20);
    const domainAttempt = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'devops' },
      domainIds,
    );
    await finish(domainAttempt.id);

    const rows = await listExams(db, userId);
    const exam01 = rows.find((row) => row.id === 'exam-01')!;

    expect(exam01.attempts).toBe(1);
    expect(exam01.openAttemptId).toBe(exam.id);
    expect(rows.reduce((total, row) => total + row.attempts, 0)).toBe(1);
    expect(rows.every((row) => row.bestScore === null)).toBe(true);
  });
});
