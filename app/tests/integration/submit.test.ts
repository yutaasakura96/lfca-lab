import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { recordAnswer, setFlag } from '../../src/db/queries/answer.ts';
import { createAttempt } from '../../src/db/queries/attempt.ts';
import { getPaperQuestions } from '../../src/db/queries/paper.ts';
import { submitAttempt } from '../../src/db/queries/submit.ts';
import { outcomeFor, scoreSitting } from '../../src/domain/score.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Submission, against real Postgres.
//
// Everything this ticket promises about the number is a claim about rows and
// about a race, and neither can be asserted against a pure function. That a
// second submit does not rescore is only observable by changing the answers
// underneath it and finding the score unmoved. That the first-attempt flag
// survives submission is only observable on the column. And that unanswered
// questions stay in the denominator is a property of `question_count` being
// frozen at start rather than counted at the end.

const userId = testUserId('submit');
/**
 * A candidate who has never sat exam-01, kept apart so that "the first attempt"
 * means the first one rather than the first one in this test.
 */
const freshId = testUserId('submit-fresh');

let questions: Awaited<ReturnType<typeof getPaperQuestions>>;
/** Which option is right, per question id — read from the bank, never assumed. */
const correctRef = new Map<string, string>();

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  await createTestUser(freshId);

  questions = await getPaperQuestions(db, 'exam-01');

  const keys = await db.execute<{ question_id: string; ref: string }>(sql`
    SELECT o.question_id, o.ref
    FROM question_option o
    JOIN exam_item ei ON ei.question_id = o.question_id
    WHERE ei.exam_id = 'exam-01' AND o.correct
  `);
  for (const row of keys.rows) correctRef.set(row.question_id, row.ref);
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

/** A fresh sitting of exam-01, with `correct` questions answered right and `wrong` answered wrong. */
async function sitting(correct: number, wrong = 0, candidate = userId): Promise<string> {
  const started = await createAttempt(db, {
    userId: candidate,
    mode: 'exam',
    examId: 'exam-01',
    questionCount: 60,
  });

  for (let i = 0; i < correct; i += 1) {
    const question = questions[i]!;
    await recordAnswer(db, {
      attemptId: started.id,
      questionId: question.id,
      optionRef: correctRef.get(question.id)!,
    });
  }
  for (let i = correct; i < correct + wrong; i += 1) {
    const question = questions[i]!;
    const right = correctRef.get(question.id)!;
    await recordAnswer(db, {
      attemptId: started.id,
      questionId: question.id,
      optionRef: ['o1', 'o2', 'o3', 'o4'].find((ref) => ref !== right)!,
    });
  }

  return started.id;
}

async function attemptRow(attemptId: string) {
  const result = await db.execute<{
    score: number | null;
    submitted_at: Date | string | null;
    submit_reason: string | null;
    is_first_attempt: boolean;
  }>(sql`
    SELECT score, submitted_at, submit_reason, is_first_attempt
    FROM attempt WHERE id = ${attemptId}::uuid
  `);
  return result.rows[0]!;
}

describe.skipIf(!hasDatabase)('finalising a sitting', () => {
  it('scores the correct answers and records that the candidate finished', async () => {
    const attemptId = await sitting(12, 5);

    const outcome = await submitAttempt(db, { attemptId, reason: 'user', scored: true });

    expect(outcome.score).toBe(12);
    expect(outcome.questionCount).toBe(60);
    expect(outcome.reason).toBe('user');
    expect(outcome.alreadySubmitted).toBe(false);
    expect(outcome.submittedAt).toBeInstanceOf(Date);
  });

  it('keeps unanswered questions in the denominator rather than excusing them', async () => {
    // Forty-three answered right, seventeen never reached. Running out of time
    // is not being let off the questions you did not get to, so this is a fail
    // against 45 rather than a perfect 43 of 43.
    const attemptId = await sitting(43);

    const outcome = await submitAttempt(db, { attemptId, reason: 'expired', scored: true });

    expect(outcome.score).toBe(43);
    expect(outcome.questionCount).toBe(60);
    expect(outcomeFor(outcome.score!, outcome.questionCount).passed).toBe(false);
  });

  it('counts a flagged-but-unanswered question as wrong, not as absent', async () => {
    const attemptId = await sitting(3);
    // A flag creates a row with a null option — the one row shape that could be
    // miscounted as an answer if the count looked at rows rather than at
    // correctness.
    await setFlag(db, { attemptId, questionId: questions[40]!.id, flagged: true });

    const outcome = await submitAttempt(db, { attemptId, reason: 'user', scored: true });
    expect(outcome.score).toBe(3);
  });

  it('records why it ended, so finishing and running out are not conflated', async () => {
    const finished = await sitting(1);
    const ranOut = await sitting(1);

    await submitAttempt(db, { attemptId: finished, reason: 'user', scored: true });
    await submitAttempt(db, { attemptId: ranOut, reason: 'expired', scored: true });

    expect((await attemptRow(finished)).submit_reason).toBe('user');
    expect((await attemptRow(ranOut)).submit_reason).toBe('expired');
  });

  it('leaves the first-attempt flag exactly as creation set it', async () => {
    const first = await sitting(2, 0, freshId);
    const second = await sitting(2, 0, freshId);

    expect((await attemptRow(first)).is_first_attempt).toBe(true);
    expect((await attemptRow(second)).is_first_attempt).toBe(false);

    // Finish the *second* sitting first. Were the flag settled at submit, this
    // is the interleaving that would hand it to the wrong attempt — which is
    // the exact failure doc 04 §5.2 sets it at creation to prevent.
    await submitAttempt(db, { attemptId: second, reason: 'user', scored: true });
    await submitAttempt(db, { attemptId: first, reason: 'expired', scored: true });

    expect((await attemptRow(first)).is_first_attempt).toBe(true);
    expect((await attemptRow(second)).is_first_attempt).toBe(false);
  });

  it('writes no score in a mode that is not measured', async () => {
    const started = await createAttempt(db, {
      userId,
      mode: 'domain',
      domain: 'security',
      questionCount: 20,
    });

    const outcome = await submitAttempt(db, {
      attemptId: started.id,
      reason: 'user',
      scored: false,
    });

    expect(outcome.score).toBeNull();
    expect(outcome.questionCount).toBe(20);
    expect((await attemptRow(started.id)).score).toBeNull();
  });
});

describe.skipIf(!hasDatabase)('the count Postgres made, against the count the domain makes', () => {
  // The one place these two definitions of a score meet.
  //
  // `submitAttempt` counts the correct rows inside the statement that finalises
  // the attempt, because the count and the `submitted_at` that stops further
  // answers must be decided at one instant. `scoreSitting` is the same rule
  // written as a pure function, tested at 44/45/46 in the unit suite. Doc 11 §1
  // is about there being no oracle for these numbers — this is the closest
  // thing to one available: two independent implementations, over the same
  // rows, made to agree.
  it('agrees, over rows including blanks, flags and wrong answers', async () => {
    const attemptId = await sitting(7, 5);
    await setFlag(db, { attemptId, questionId: questions[30]!.id, flagged: true });

    const rows = await db.execute<{ question_id: string; is_correct: boolean | null }>(sql`
      SELECT question_id, is_correct FROM answer WHERE attempt_id = ${attemptId}::uuid
    `);

    const outcome = await submitAttempt(db, { attemptId, reason: 'user', scored: true });
    const pure = scoreSitting({
      answers: rows.rows.map((row) => ({
        questionId: row.question_id,
        isCorrect: row.is_correct,
      })),
      questionCount: outcome.questionCount,
    });

    expect(outcome.score).toBe(pure.score);
    expect(outcomeFor(outcome.score!, outcome.questionCount)).toStrictEqual(pure);
  });
});

describe.skipIf(!hasDatabase)('submitting twice', () => {
  it('returns the first score rather than an error', async () => {
    const attemptId = await sitting(9);

    const first = await submitAttempt(db, { attemptId, reason: 'user', scored: true });
    const second = await submitAttempt(db, { attemptId, reason: 'user', scored: true });

    expect(second.score).toBe(first.score);
    expect(second.questionCount).toBe(first.questionCount);
    expect(second.submittedAt).toStrictEqual(first.submittedAt);
    // The one field that differs, and the only way a caller can tell it lost.
    expect(first.alreadySubmitted).toBe(false);
    expect(second.alreadySubmitted).toBe(true);
  });

  it('does not rescore, even when the answers underneath have changed', async () => {
    const attemptId = await sitting(4);
    const first = await submitAttempt(db, { attemptId, reason: 'user', scored: true });
    expect(first.score).toBe(4);

    // Written straight to the table: the API refuses a write into a submitted
    // sitting, and what is under test here is that the *statement* does not
    // recount even when the rows say something else.
    for (let i = 4; i < 20; i += 1) {
      const question = questions[i]!;
      await db.execute(sql`
        INSERT INTO answer (attempt_id, question_id, option_ref, is_correct, answered_at)
        VALUES (${attemptId}::uuid, ${question.id}, ${correctRef.get(question.id)!}, true, now())
        ON CONFLICT (attempt_id, question_id) DO UPDATE SET is_correct = true
      `);
    }

    const second = await submitAttempt(db, { attemptId, reason: 'user', scored: true });
    expect(second.score).toBe(4);
    expect((await attemptRow(attemptId)).score).toBe(4);
  });

  it('does not let the second caller rewrite why it ended', async () => {
    const attemptId = await sitting(1);

    await submitAttempt(db, { attemptId, reason: 'user', scored: true });
    const second = await submitAttempt(db, { attemptId, reason: 'expired', scored: true });

    expect(second.reason).toBe('user');
    expect((await attemptRow(attemptId)).submit_reason).toBe('user');
  });
});
