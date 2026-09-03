import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { recordAnswer, setFlag } from '../../src/db/queries/answer.ts';
import { createAttempt } from '../../src/db/queries/attempt.ts';
import { getPaperQuestions } from '../../src/db/queries/paper.ts';
import { getReviewContext, getReviewQuestions } from '../../src/db/queries/review.ts';
import { submitAttempt } from '../../src/db/queries/submit.ts';
import { verdictOf } from '../../src/domain/review.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

const hasDatabase = Boolean(process.env.DATABASE_URL);

// The review, against real Postgres.
//
// Almost nothing this ticket promises can be asserted against a pure function.
// That the review shows every question including the ones never touched is a
// property of a `LEFT JOIN`. That it lays options out exactly as the sitting did
// is a claim about two queries agreeing. That it reads the sitting's *own*
// recorded correctness rather than today's bank is only observable by changing
// one and finding the other unmoved. And that another candidate's sitting comes
// back empty is a claim about a `WHERE` clause.

const userId = testUserId('review');
const intruderId = testUserId('review-intruder');
/**
 * A candidate who has never sat exam-02, so that "the first attempt" in the
 * ordinal tests below means the first one rather than the first one they saw.
 */
const historyId = testUserId('review-history');

let paper: Awaited<ReturnType<typeof getPaperQuestions>>;
/** Which option is right, per question id — read from the bank, never assumed. */
const correctRef = new Map<string, string>();

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  await createTestUser(intruderId);
  await createTestUser(historyId);

  paper = await getPaperQuestions(db, 'exam-02');

  const keys = await db.execute<{ question_id: string; ref: string }>(sql`
    SELECT o.question_id, o.ref
    FROM question_option o
    JOIN exam_item ei ON ei.question_id = o.question_id
    WHERE ei.exam_id = 'exam-02' AND o.correct
  `);
  for (const row of keys.rows) correctRef.set(row.question_id, row.ref);
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

/** A wrong option for a question — any ref that is not the key. */
function wrongRef(questionId: string): string {
  const right = correctRef.get(questionId);
  const options = paper.find((q) => q.id === questionId)?.options ?? [];
  const wrong = options.find((o) => o.ref !== right);
  if (!wrong) throw new Error(`No wrong option for ${questionId}`);
  return wrong.ref;
}

/**
 * A finished sitting of exam-02: the first `correct` questions right, the next
 * `wrong` wrong, one flagged-but-blank, and the rest never touched.
 */
async function sitting(correct: number, wrong: number, candidate = userId) {
  const started = await createAttempt(db, {
    userId: candidate,
    mode: 'exam',
    examId: 'exam-02',
    questionCount: 60,
  });

  for (let i = 0; i < correct; i += 1) {
    const question = paper[i]!;
    await recordAnswer(db, {
      attemptId: started.id,
      questionId: question.id,
      optionRef: correctRef.get(question.id)!,
    });
  }
  for (let i = correct; i < correct + wrong; i += 1) {
    const question = paper[i]!;
    await recordAnswer(db, {
      attemptId: started.id,
      questionId: question.id,
      optionRef: wrongRef(question.id),
    });
  }
  // A flag on a question never answered — doc 04 §6's row, and the one the
  // ticket says must read as unanswered rather than as wrong-by-omission.
  await setFlag(db, {
    attemptId: started.id,
    questionId: paper[correct + wrong]!.id,
    flagged: true,
  });

  await submitAttempt(db, { attemptId: started.id, reason: 'user', scored: true });
  return started.id;
}

describe.skipIf(!hasDatabase)('reading a sitting back', () => {
  let attemptId: string;
  let review: Awaited<ReturnType<typeof getReviewQuestions>>;

  beforeAll(async () => {
    attemptId = await sitting(5, 3);
    review = await getReviewQuestions(db, userId, attemptId);
  });

  it('returns every question of the paper, in the paper order', () => {
    expect(review).toHaveLength(60);
    expect(review.map((q) => q.seq)).toEqual([...Array(60).keys()]);
  });

  it('keeps the questions never touched, rather than dropping them', () => {
    // The `LEFT JOIN`. A review of only the questions you engaged with would be
    // a review of the wrong thing.
    const untouched = review.filter((q) => q.optionRef === null && !q.flagged);
    expect(untouched).toHaveLength(60 - 5 - 3 - 1);
  });

  it('gives every question exactly four options, each with its explanation', () => {
    // PRD E4: the `why` for all four, not just the correct one. This is the
    // reason the query exists.
    for (const question of review) {
      expect(question.options, question.id).toHaveLength(4);
      for (const option of question.options) {
        expect(option.why.trim().length, `${question.id} ${option.ref}`).toBeGreaterThan(0);
      }
    }
  });

  it('marks exactly one option correct per question', () => {
    for (const question of review) {
      expect(question.options.filter((o) => o.correct), question.id).toHaveLength(1);
    }
  });

  it('lays the options out exactly as the sitting laid them out', () => {
    // The property that makes "Your answer" name the letter the candidate
    // actually pressed. Both go through `layOutForPaper`; this proves it.
    for (const question of review) {
      const asSat = paper.find((q) => q.id === question.id);
      expect(question.options.map((o) => o.ref), question.id).toEqual(
        asSat?.options.map((o) => o.ref),
      );
    }
  });

  it('reports what was chosen, and whether the sitting scored it right', () => {
    const right = review.filter((q) => q.isCorrect === true);
    const wrong = review.filter((q) => q.isCorrect === false);
    expect(right).toHaveLength(5);
    expect(wrong).toHaveLength(3);
    for (const question of right) {
      expect(question.optionRef).toBe(correctRef.get(question.id));
    }
  });

  it('shows a flagged-but-blank question as unanswered, not as a wrong choice', () => {
    const flagged = review.filter((q) => q.flagged);
    expect(flagged).toHaveLength(1);
    expect(flagged[0]?.optionRef).toBeNull();
    expect(flagged[0]?.isCorrect).toBeNull();
    expect(verdictOf(flagged[0]!)).toBe('unanswered');
  });

  it('carries the metadata the card identifies a question by', () => {
    for (const question of review) {
      expect(question.competency.length, question.id).toBeGreaterThan(0);
      expect(question.conceptId.length, question.id).toBeGreaterThan(0);
      expect(question.type.length, question.id).toBeGreaterThan(0);
      expect(
        ['linux', 'sysadmin', 'cloud', 'security', 'devops', 'pm'],
        question.id,
      ).toContain(question.domain);
    }
  });

  it('agrees with the score the submit statement counted', () => {
    // The oracle problem again, from the other end: the review's verdicts and
    // the row's own score are two readings of the same rows, and a screen that
    // disagreed with the number above it would be worse than either alone.
    const correct = review.filter((q) => verdictOf(q) === 'correct').length;
    expect(correct).toBe(5);
  });

  it('reads the correctness the sitting recorded, not the bank of today', async () => {
    // `is_correct` is denormalised on write (doc 04 §5.3) precisely so a later
    // correction cannot rewrite a past score. Forcing the row to disagree with
    // the bank is the only way to observe which one the review reads.
    const target = review.find((q) => q.isCorrect === true)!;
    await db.execute(sql`
      UPDATE answer SET is_correct = false
      WHERE attempt_id = ${attemptId}::uuid AND question_id = ${target.id}
    `);

    const reread = await getReviewQuestions(db, userId, attemptId);
    const after = reread.find((q) => q.id === target.id)!;

    expect(after.isCorrect, 'the row wins').toBe(false);
    // ...while the bank still says that option is the right one, which is what
    // makes this a real disagreement rather than a no-op.
    expect(after.options.find((o) => o.ref === after.optionRef)?.correct).toBe(true);

    await db.execute(sql`
      UPDATE answer SET is_correct = true
      WHERE attempt_id = ${attemptId}::uuid AND question_id = ${target.id}
    `);
  });

  it('is empty for a candidate the sitting does not belong to', async () => {
    // 404, never 403 — and the query is what makes that the only answer
    // available to the page.
    expect(await getReviewQuestions(db, intruderId, attemptId)).toEqual([]);
  });

  it('is empty for an id that is not an attempt at all', async () => {
    expect(await getReviewQuestions(db, userId, 'not-a-uuid')).toEqual([]);
  });
});

describe.skipIf(!hasDatabase)('where a sitting sits among the others', () => {
  it('numbers sittings by when they started, and carries both scores', async () => {
    const first = await sitting(4, 2, historyId);
    const second = await sitting(9, 1, historyId);

    const one = await getReviewContext(db, historyId, first);
    const two = await getReviewContext(db, historyId, second);

    expect(one).toMatchObject({ ordinal: 1, firstAttemptScore: 4 });
    expect(two).toMatchObject({ ordinal: 2, firstAttemptScore: 4 });
    // Best moves; first-attempt does not. That is the whole point of the pair.
    expect(one?.bestScore).toBe(9);
    expect(two?.bestScore).toBe(9);
    expect(two?.attempts).toBe(one?.attempts);
  });

  it('is null for a sitting belonging to another candidate', async () => {
    const mine = await sitting(1, 1, historyId);
    expect(await getReviewContext(db, intruderId, mine)).toBeNull();
  });
});
