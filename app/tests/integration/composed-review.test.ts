import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { recordAnswer } from '../../src/db/queries/answer.ts';
import { createAttempt, startComposedSitting } from '../../src/db/queries/attempt.ts';
import { getComposedQuestions } from '../../src/db/queries/paper.ts';
import {
  getComposedReviewQuestions,
  getSittingReviewQuestions,
} from '../../src/db/queries/review.ts';
import { selectDomainQuestions, selectPracticeQuestions } from '../../src/db/queries/selection.ts';
import { submitAttempt } from '../../src/db/queries/submit.ts';
import { countByFilter, verdictOf } from '../../src/domain/review.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Reading an unscored run back, against real Postgres.
//
// The same reasons the exam review is tested here rather than in the unit
// suite, plus one that is specific to this mode. That the review covers every
// question the run *asked* — not only the ones it answered — is a property of a
// `LEFT JOIN` over `attempt_question`, which is the table that exists precisely
// because `answer` cannot answer that question (doc 04 §5.4). And the claim
// that matters most here cannot be made against one query at all: the review
// must lay a question's options out **exactly as the sitting laid them out**,
// because the verdict bar named a letter while the run was on. Two queries
// agreeing is only observable by running both.

const userId = testUserId('composed-review');
const intruderId = testUserId('composed-review-intruder');

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  await createTestUser(intruderId);
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

/**
 * A practice run of `length`, with its first `correct` answered right and the
 * next `wrong` answered wrong, then closed.
 *
 * The rest are left untouched — which in a strictly-forward run means never
 * reached, and is the state this ticket's whole filter reversal is about. The
 * right and wrong options are read from the bank rather than assumed, so a
 * reordering of the source JSON cannot quietly turn this into a test of
 * nothing.
 */
async function run(length: 20 | 40 | 60, correct: number, wrong: number): Promise<string> {
  const ids = await selectPracticeQuestions(db, userId, length);
  const started = await startComposedSitting(db, { userId, mode: 'practice' }, ids);

  const keys = await keyOf(started.id);
  for (const [index, questionId] of ids.slice(0, correct + wrong).entries()) {
    const key = keys.get(questionId)!;
    await recordAnswer(db, {
      attemptId: started.id,
      questionId,
      optionRef: index < correct ? key.correct : key.wrong,
    });
  }

  await submitAttempt(db, { attemptId: started.id, reason: 'user', scored: false });
  return started.id;
}

/** Which ref is right and which is not, per question of one run, from the bank. */
async function keyOf(
  attemptId: string,
): Promise<Map<string, { correct: string; wrong: string }>> {
  const rows = await db.execute<{ question_id: string; ref: string; correct: boolean }>(sql`
    SELECT o.question_id, o.ref, o.correct
    FROM attempt_question aq
    JOIN question_option o ON o.question_id = aq.question_id
    WHERE aq.attempt_id = ${attemptId}::uuid
  `);
  const keys = new Map<string, { correct: string; wrong: string }>();
  for (const row of rows.rows) {
    const entry = keys.get(row.question_id) ?? { correct: '', wrong: '' };
    if (row.correct) entry.correct = row.ref;
    else entry.wrong = row.ref;
    keys.set(row.question_id, entry);
  }
  return keys;
}

describe.skipIf(!hasDatabase)('reading an unscored run back', () => {
  let attemptId: string;
  let review: Awaited<ReturnType<typeof getComposedReviewQuestions>>;

  beforeAll(async () => {
    // Save and exit at question 8 of 20: five right, three wrong, twelve never
    // reached. #37's own shape, so the two screens are asserted about the same
    // kind of sitting.
    attemptId = await run(20, 5, 3);
    review = await getComposedReviewQuestions(db, userId, attemptId);
  });

  it('returns every question the run asked, in the order it asked them', () => {
    expect(review).toHaveLength(20);
    expect(review.map((q) => q.seq)).toEqual([...Array(20).keys()]);
  });

  it('keeps the questions never reached, rather than dropping them', () => {
    // The `LEFT JOIN` over `attempt_question`. A review of only what you
    // answered would be a review of the wrong thing — and here it would be a
    // review of a set nothing else records.
    expect(review.filter((q) => q.optionRef === null)).toHaveLength(12);
  });

  it('gives every question exactly four options, each with its explanation', () => {
    // PRD P1 wants the `why` for all four here as much as PRD E4 does on a
    // paper: the wrong-option text is the most valuable content in the bank.
    for (const question of review) {
      expect(question.options, question.id).toHaveLength(4);
      expect(question.options.filter((o) => o.correct), question.id).toHaveLength(1);
      for (const option of question.options) {
        expect(option.why.trim().length, `${question.id} ${option.ref}`).toBeGreaterThan(0);
      }
    }
  });

  it('lays the options out exactly as the sitting laid them out', () => {
    // The claim this file exists for. The run named a letter — "the answer is
    // A" — so a review placing the key one slot over would be telling the
    // candidate they pressed something they never pressed. One placement, two
    // projections of it: `slotForComposedSitting` through `layOutForPaper`.
    return getComposedQuestions(db, attemptId).then((sat) => {
      expect(sat.map((q) => q.id)).toEqual(review.map((q) => q.id));
      for (const [index, question] of sat.entries()) {
        expect(question.options.map((o) => o.ref), question.id).toEqual(
          review[index]!.options.map((o) => o.ref),
        );
      }
    });
  });

  it('does not put every correct answer at A', async () => {
    // The finding that reversed #31: the bank authors the key first in all
    // 1,150 questions, so authored order would make both these modes
    // answerable without reading the options.
    const slots = new Set(
      review.map((q) => q.options.findIndex((o) => o.correct)),
    );
    expect(slots.size, 'the key moves about').toBeGreaterThan(1);
  });

  it('reports what was chosen, and whether the run scored it right', () => {
    expect(review.filter((q) => q.isCorrect === true)).toHaveLength(5);
    expect(review.filter((q) => q.isCorrect === false)).toHaveLength(3);
  });

  it('flags nothing, because nothing in these modes can be flagged', () => {
    // `PUT /flag` refuses practice and domain outright (doc 07 §4), so the
    // column is not read at all — this is the assertion that it is not read
    // *wrongly*.
    expect(review.every((q) => q.flagged === false)).toBe(true);
  });

  it('carries the metadata the card identifies a question by', () => {
    for (const question of review) {
      expect(question.competency.length, question.id).toBeGreaterThan(0);
      expect(question.conceptId.length, question.id).toBeGreaterThan(0);
      expect(question.type.length, question.id).toBeGreaterThan(0);
    }
  });

  it('reads the correctness the run recorded, not the bank of today', async () => {
    // The same guarantee doc 04 §5.3 gives a paper, asserted the same way: the
    // only way to see which one is read is to make them disagree.
    const target = review.find((q) => q.isCorrect === true)!;
    await db.execute(sql`
      UPDATE answer SET is_correct = false
      WHERE attempt_id = ${attemptId}::uuid AND question_id = ${target.id}
    `);

    const after = (await getComposedReviewQuestions(db, userId, attemptId)).find(
      (q) => q.id === target.id,
    )!;

    expect(after.isCorrect, 'the row wins').toBe(false);
    expect(after.options.find((o) => o.ref === after.optionRef)?.correct).toBe(true);

    await db.execute(sql`
      UPDATE answer SET is_correct = true
      WHERE attempt_id = ${attemptId}::uuid AND question_id = ${target.id}
    `);
  });

  it('is empty for a candidate the run does not belong to', async () => {
    expect(await getComposedReviewQuestions(db, intruderId, attemptId)).toEqual([]);
  });

  it('is empty for an id that is not an attempt at all', async () => {
    expect(await getComposedReviewQuestions(db, userId, 'not-a-uuid')).toEqual([]);
  });
});

describe.skipIf(!hasDatabase)('the three counts the screen opens with', () => {
  it('partitions the run, and sums to what the row says it asked', async () => {
    // The ticket's own criterion. It holds because the review is a `LEFT JOIN`
    // over the frozen set and `question_count` is what that freeze wrote (#33),
    // so there is no arithmetic here that could disagree with the rows.
    const attemptId = await run(20, 5, 3);
    const review = await getComposedReviewQuestions(db, userId, attemptId);
    const counts = countByFilter(
      review.map((q) => ({ domain: q.domain, verdict: verdictOf(q), flagged: q.flagged })),
      false,
    );

    expect(counts).toMatchObject({ correct: 5, incorrect: 3, unreached: 12, all: 20 });
    expect(counts.correct + counts.incorrect + counts.unreached).toBe(counts.all);

    const row = await db.execute<{ question_count: number; score: number | null }>(sql`
      SELECT question_count, score FROM attempt WHERE id = ${attemptId}::uuid
    `);
    expect(counts.all).toBe(row.rows[0]!.question_count);
    // And the thing the whole mode rests on: nothing was measured.
    expect(row.rows[0]!.score).toBeNull();
  });

  it('reads a blank as unreached rather than as a miss', async () => {
    const attemptId = await run(20, 2, 0);
    const review = await getComposedReviewQuestions(db, userId, attemptId);
    const reviewed = review.map((q) => ({
      domain: q.domain,
      verdict: verdictOf(q),
      flagged: q.flagged,
    }));

    // The reversal, at the seam where it is actually visible: the same rows,
    // read both ways. On a paper eighteen blanks are eighteen misses; here they
    // are eighteen questions nobody was ever shown.
    expect(countByFilter(reviewed, false).incorrect).toBe(0);
    expect(countByFilter(reviewed, true).incorrect).toBe(18);
  });
});

describe.skipIf(!hasDatabase)('which table the review reads', () => {
  it('reads a composed sitting from its frozen set', async () => {
    const ids = await selectDomainQuestions(db, userId, 'security', 20);
    const started = await startComposedSitting(
      db,
      { userId, mode: 'domain', domain: 'security' },
      ids,
    );
    await submitAttempt(db, { attemptId: started.id, reason: 'user', scored: false });

    const review = await getSittingReviewQuestions(db, userId, {
      id: started.id,
      mode: 'domain',
      examId: null,
    });
    expect(review.map((q) => q.id)).toEqual(ids);
  });

  it('reads an exam sitting from its paper, unchanged', async () => {
    // The branch, from the other side. Asking `attempt_question` for a paper
    // would come back empty, which reads as a well-behaved not-found rather
    // than as a bug — so it is worth an assertion rather than a comment.
    const started = await createAttempt(db, {
      userId,
      mode: 'exam',
      examId: 'exam-03',
      questionCount: 60,
    });
    await submitAttempt(db, { attemptId: started.id, reason: 'user', scored: true });

    const review = await getSittingReviewQuestions(db, userId, {
      id: started.id,
      mode: 'exam',
      examId: 'exam-03',
    });
    expect(review).toHaveLength(60);
    expect(review.map((q) => q.seq)).toEqual([...Array(60).keys()]);
  });
});
