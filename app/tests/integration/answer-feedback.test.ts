import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Feedback, asserted on the bytes the endpoint actually returns.
//
// **This is the one place in the slice where a bug is silent.** A response
// carrying the answer key mid-exam looks exactly like a response that does not:
// the screen would not render it, no assertion about the screen would fail, and
// the sitting would go on scoring normally while the key sat in the network
// tab. So this file drives the **real exported route handlers** and reads the
// parsed body, rather than testing a function the route happens to call today.
//
// The only thing standing in for the world is `next/headers`, which throws
// outside a request scope. Everything below it is real: a real session row, a
// real allowlist check, real ownership, and the branch reading `attempt.mode`
// off the row the request had to load anyway.

const request = vi.hoisted(() => ({ cookie: '' }));

vi.mock('next/headers', () => ({
  headers: async () => new Headers(request.cookie ? { cookie: request.cookie } : {}),
  // Better Auth's Next integration reaches for this when it has cookies to
  // set. Nothing here signs in or out, so a store that holds nothing is enough
  // — and a mock that omitted it would fail at import rather than at use.
  cookies: async () => ({
    get: () => undefined,
    getAll: () => [],
    has: () => false,
    set: () => {},
    delete: () => {},
  }),
}));

const { db, pool } = await import('../../src/db/client.ts');
const { createAttempt, startComposedSitting } = await import('../../src/db/queries/attempt.ts');
const { getPaperQuestions, getSittingQuestions } = await import('../../src/db/queries/paper.ts');
const { selectDomainQuestions, selectPracticeQuestions } = await import(
  '../../src/db/queries/selection.ts'
);
const { PUT: putAnswer } = await import('../../src/app/api/attempt/[id]/answer/route.ts');
const { PUT: putFlag } = await import('../../src/app/api/attempt/[id]/flag/route.ts');
const { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } = await import(
  './support.ts'
);
const { authBaseURL, cookieHeader, mintSession } = await import('../support/sessions.ts');

/** Without a connection string there is nothing to integrate with. */
const hasDatabase = Boolean(process.env.DATABASE_URL);

const userId = testUserId('feedback');

let examAttemptId: string;
let practiceAttemptId: string;
let domainAttemptId: string;

/** One question of the exam paper, and the key the bank holds for it. */
let examQuestionId: string;
let examCorrectRef: string;
let examWrongRef: string;

let practiceQuestionId: string;
let practiceCorrectRef: string;
let practiceWrongRef: string;
let domainQuestionId: string;

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  request.cookie = cookieHeader(await mintSession(userId, authBaseURL()));

  const exam = await createAttempt(db, {
    userId,
    mode: 'exam',
    examId: 'exam-01',
    questionCount: 60,
  });
  examAttemptId = exam.id;

  const paper = await getPaperQuestions(db, 'exam-01');
  examQuestionId = paper[0]!.id;
  const examKey = await keyFor(examQuestionId);
  examCorrectRef = examKey.correct;
  examWrongRef = examKey.wrong;

  const practiceIds = await selectPracticeQuestions(db, userId, 20);
  const practice = await startComposedSitting(db, { userId, mode: 'practice' }, practiceIds);
  practiceAttemptId = practice.id;
  practiceQuestionId = practiceIds[0]!;
  const practiceKey = await keyFor(practiceQuestionId);
  practiceCorrectRef = practiceKey.correct;
  practiceWrongRef = practiceKey.wrong;

  const domainIds = await selectDomainQuestions(db, userId, 'security', 20);
  const domain = await startComposedSitting(
    db,
    { userId, mode: 'domain', domain: 'security' },
    domainIds,
  );
  domainAttemptId = domain.id;
  domainQuestionId = domainIds[0]!;
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

/**
 * The bank's own answer to a question, read straight from the content tables.
 *
 * The tests below need to know the key in order to assert that the *response*
 * does not contain it, and asking the bank rather than the endpoint is what
 * makes that an independent check rather than an echo.
 */
async function keyFor(questionId: string): Promise<{ correct: string; wrong: string }> {
  const rows = await db.execute<{ ref: string; correct: boolean }>(sql`
    SELECT ref, correct FROM question_option
    WHERE question_id = ${questionId} ORDER BY position ASC
  `);
  const correct = rows.rows.find((r) => r.correct)!.ref;
  const wrong = rows.rows.find((r) => !r.correct)!.ref;
  return { correct, wrong };
}

interface Answered {
  status: number;
  body: Record<string, unknown>;
}

/** Call the real handler, the way the browser calls it. */
async function answer(
  attemptId: string,
  body: unknown,
): Promise<Answered> {
  const response = await putAnswer(
    new Request(`http://localhost/api/attempt/${attemptId}/answer`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: attemptId }) },
  );
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

async function flag(attemptId: string, questionId: string, flagged: boolean): Promise<Answered> {
  const response = await putFlag(
    new Request(`http://localhost/api/attempt/${attemptId}/flag`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ questionId, flagged }),
    }),
    { params: Promise.resolve({ id: attemptId }) },
  );
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

describe.skipIf(!hasDatabase)('an exam answer says nothing but that it saved', () => {
  it('returns exactly { saved: true } — no verdict, no key, no explanation', async () => {
    const result = await answer(examAttemptId, {
      questionId: examQuestionId,
      optionRef: examCorrectRef,
    });

    expect(result.status).toBe(200);
    // Asserted as the whole body rather than key by key: a field added later
    // fails here, which is the point. A test that only checked the three known
    // names would pass a response that had grown a fourth.
    expect(result.body).toEqual({ saved: true });
  });

  it('says the same on a wrong answer, so the two are indistinguishable', async () => {
    const wrong = await answer(examAttemptId, {
      questionId: examQuestionId,
      optionRef: examWrongRef,
    });
    const right = await answer(examAttemptId, {
      questionId: examQuestionId,
      optionRef: examCorrectRef,
    });

    expect(wrong.body).toEqual({ saved: true });
    // Byte-identical. Correctness cannot be inferred from the reply at all —
    // not from a field, and not from the shape.
    expect(wrong.body).toEqual(right.body);
  });

  it('records the verdict it declines to report', async () => {
    await answer(examAttemptId, { questionId: examQuestionId, optionRef: examCorrectRef });

    // The denormalisation of doc 04 §5.3 still happens on write. What changed
    // in this slice is only what leaves the server.
    const rows = await db.execute<{ is_correct: boolean | null }>(sql`
      SELECT is_correct FROM answer
      WHERE attempt_id = ${examAttemptId}::uuid AND question_id = ${examQuestionId}
    `);
    expect(rows.rows[0]?.is_correct).toBe(true);
  });

  it('cannot be moved by the request', async () => {
    // Every hint a caller could offer, offered at once: a mode in the body, a
    // mode in a header, and a mode in the query string. The branch reads the
    // database, so none of them is even parsed — the schema drops the extra
    // field before the handler sees it.
    const response = await putAnswer(
      new Request(
        `http://localhost/api/attempt/${examAttemptId}/answer?mode=practice&feedback=1`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
            'x-attempt-mode': 'practice',
          },
          body: JSON.stringify({
            questionId: examQuestionId,
            optionRef: examWrongRef,
            mode: 'practice',
            showFeedback: true,
            isCorrect: true,
          }),
        },
      ),
      { params: Promise.resolve({ id: examAttemptId }) },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ saved: true });
  });
});

describe.skipIf(!hasDatabase)('a practice answer explains all four options', () => {
  it('names the verdict, the key, and a why for every ref', async () => {
    const result = await answer(practiceAttemptId, {
      questionId: practiceQuestionId,
      optionRef: practiceWrongRef,
    });

    expect(result.status).toBe(200);
    expect(result.body.saved).toBe(true);
    expect(result.body.isCorrect).toBe(false);
    expect(result.body.correctRef).toBe(practiceCorrectRef);

    const why = result.body.why as Record<string, string>;
    // All four, not only the correct one — PRD E4 and P1. The wrong-option text
    // is the most valuable content in the bank.
    expect(Object.keys(why).sort()).toEqual(['o1', 'o2', 'o3', 'o4']);
    for (const ref of Object.keys(why)) {
      expect(why[ref]!.length, ref).toBeGreaterThan(0);
    }
  });

  it('reports a right answer as right', async () => {
    const result = await answer(practiceAttemptId, {
      questionId: practiceQuestionId,
      optionRef: practiceCorrectRef,
    });
    expect(result.body.isCorrect).toBe(true);
    expect(result.body.correctRef).toBe(practiceCorrectRef);
  });

  it('says nothing about a question whose answer was cleared', async () => {
    await answer(practiceAttemptId, {
      questionId: practiceQuestionId,
      optionRef: practiceCorrectRef,
    });
    const cleared = await answer(practiceAttemptId, {
      questionId: practiceQuestionId,
      optionRef: null,
    });

    // Feedback is feedback on a choice. With no choice there is nothing to
    // report, so this is the timed sitting's own reply, reached for an
    // unrelated reason.
    expect(cleared.body).toEqual({ saved: true });
  });

  it('explains a domain sitting the same way', async () => {
    const result = await answer(domainAttemptId, {
      questionId: domainQuestionId,
      optionRef: 'o1',
    });
    expect(result.body.saved).toBe(true);
    expect(Object.keys(result.body.why as Record<string, string>)).toHaveLength(4);
  });
});

describe.skipIf(!hasDatabase)('a composed sitting can be written to at all', () => {
  it('accepts a question the sitting froze', async () => {
    const questions = await getSittingQuestions(db, {
      id: practiceAttemptId,
      mode: 'practice',
      examId: null,
    });
    const result = await answer(practiceAttemptId, {
      questionId: questions[3]!.id,
      optionRef: 'o2',
    });
    expect(result.status).toBe(200);
  });

  it('refuses a question it did not ask', async () => {
    // Membership for these modes is `attempt_question`, not `exam_item`. A real
    // bank id that this sitting never froze is the case that distinguishes the
    // two — "does this question exist" would let it through.
    const frozen = await db.execute<{ id: string }>(sql`
      SELECT id FROM question
      WHERE id NOT IN (
        SELECT question_id FROM attempt_question WHERE attempt_id = ${practiceAttemptId}::uuid
      )
      LIMIT 1
    `);
    const result = await answer(practiceAttemptId, {
      questionId: frozen.rows[0]!.id,
      optionRef: 'o1',
    });

    expect(result.status).toBe(409);
    expect((result.body.error as { code: string }).code).toBe('question_not_in_attempt');
  });

  it('still refuses a question that is on another paper', async () => {
    const elsewhere = await getPaperQuestions(db, 'exam-02');
    const result = await answer(examAttemptId, {
      questionId: elsewhere[0]!.id,
      optionRef: 'o1',
    });
    expect(result.status).toBe(409);
    expect((result.body.error as { code: string }).code).toBe('question_not_in_attempt');
  });
});

describe.skipIf(!hasDatabase)('flagging follows free navigation', () => {
  it('is refused in practice mode', async () => {
    const result = await flag(practiceAttemptId, practiceQuestionId, true);
    expect(result.status).toBe(409);
    expect((result.body.error as { code: string }).code).toBe('flagging_not_available');
  });

  it('is refused in domain mode', async () => {
    const result = await flag(domainAttemptId, domainQuestionId, true);
    expect(result.status).toBe(409);
    expect((result.body.error as { code: string }).code).toBe('flagging_not_available');
  });

  it('writes nothing when it refuses', async () => {
    await flag(practiceAttemptId, domainQuestionId, true);
    const rows = await db.execute<{ flagged: boolean }>(sql`
      SELECT flagged FROM answer
      WHERE attempt_id = ${practiceAttemptId}::uuid AND flagged
    `);
    expect(rows.rows).toHaveLength(0);
  });

  it('still works in exam mode', async () => {
    const result = await flag(examAttemptId, examQuestionId, true);
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ saved: true });
  });
});

describe.skipIf(!hasDatabase)('the session is real, not assumed', () => {
  it('refuses an unauthenticated call', async () => {
    const held = request.cookie;
    request.cookie = '';
    try {
      const result = await answer(examAttemptId, {
        questionId: examQuestionId,
        optionRef: examCorrectRef,
      });
      expect(result.status).toBe(401);
      expect((result.body.error as { code: string }).code).toBe('unauthenticated');
    } finally {
      request.cookie = held;
    }
  });
});
