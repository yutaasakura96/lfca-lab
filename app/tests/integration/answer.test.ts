import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { createAttempt, getAttemptForUser } from '../../src/db/queries/attempt.ts';
import {
  getAttemptAnswers,
  isQuestionOnPaper,
  recordAnswer,
  setFlag,
} from '../../src/db/queries/answer.ts';
import { getPaperQuestions } from '../../src/db/queries/paper.ts';
import { assertSeeded, createTestUser, deleteAllTestUsers, testUserId } from './support.ts';

/**
 * No connection string, nothing to integrate with — this file skips rather than
 * fails, exactly as its neighbours do.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL);

// Answering and flagging, against real Postgres.
//
// Everything this ticket promises is a claim about rows: that a second identical
// write leaves one row rather than two, that changing an answer replaces rather
// than appends, that a flag on an unanswered question does not invent an answer
// for it, and that correctness is decided by the bank at write time rather than
// taken from the caller. None of those can be asserted against a pure function,
// because all of them are properties of the upsert.

const userId = testUserId('answer');
/** A second candidate, so ownership can be tested as ownership rather than inferred. */
const strangerId = testUserId('answer-stranger');

let attemptId: string;
let otherAttemptId: string;
let strangerAttemptId: string;
let questions: Awaited<ReturnType<typeof getPaperQuestions>>;
/** A question on exam-02, which the exam-01 sitting must refuse. */
let foreignQuestionId: string;

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllTestUsers();
  await createTestUser(userId);
  await createTestUser(strangerId);

  const started = await createAttempt(db, {
    userId,
    mode: 'exam',
    examId: 'exam-01',
    questionCount: 60,
  });
  attemptId = started.id;

  const other = await createAttempt(db, {
    userId,
    mode: 'exam',
    examId: 'exam-02',
    questionCount: 60,
  });
  otherAttemptId = other.id;

  // The stranger sits the same paper, and answers the same question. Anything
  // that leaks across users leaks here, on identical data.
  const strangers = await createAttempt(db, {
    userId: strangerId,
    mode: 'exam',
    examId: 'exam-01',
    questionCount: 60,
  });
  strangerAttemptId = strangers.id;

  questions = await getPaperQuestions(db, 'exam-01');
  const elsewhere = await getPaperQuestions(db, 'exam-02');
  foreignQuestionId = elsewhere[0]!.id;
});

afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllTestUsers();
  await pool.end();
});

async function rowsFor(questionId: string): Promise<
  {
    option_ref: string | null;
    is_correct: boolean | null;
    flagged: boolean;
    answered_at: Date | string | null;
  }[]
> {
  const result = await db.execute<{
    option_ref: string | null;
    is_correct: boolean | null;
    flagged: boolean;
    answered_at: Date | string | null;
  }>(sql`
    SELECT option_ref, is_correct, flagged, answered_at
    FROM answer
    WHERE attempt_id = ${attemptId}::uuid AND question_id = ${questionId}
  `);
  return result.rows;
}

/** Which option is actually right, read from the bank rather than assumed. */
async function correctRefOf(questionId: string): Promise<string> {
  const result = await db.execute<{ ref: string }>(sql`
    SELECT ref FROM question_option WHERE question_id = ${questionId} AND correct
  `);
  return result.rows[0]!.ref;
}

describe.skipIf(!hasDatabase)('recording an answer', () => {
  it('writes one row, with correctness decided from the bank', async () => {
    const question = questions[0]!;
    const correct = await correctRefOf(question.id);

    const result = await recordAnswer(db, {
      attemptId,
      questionId: question.id,
      optionRef: correct,
    });
    expect(result).toBe('saved');

    const rows = await rowsFor(question.id);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.option_ref).toBe(correct);
    expect(rows[0]!.is_correct).toBe(true);
    expect(rows[0]!.answered_at).not.toBeNull();
  });

  it('is idempotent — the same write twice leaves the same single row', async () => {
    const question = questions[1]!;

    await recordAnswer(db, { attemptId, questionId: question.id, optionRef: 'o1' });
    const first = await rowsFor(question.id);

    await recordAnswer(db, { attemptId, questionId: question.id, optionRef: 'o1' });
    const second = await rowsFor(question.id);

    expect(second).toHaveLength(1);
    expect(second[0]!.option_ref).toBe(first[0]!.option_ref);
    expect(second[0]!.is_correct).toBe(first[0]!.is_correct);
    // The retry a failing network produces is this exact call. If it moved
    // `answered_at`, every retry would quietly rewrite what "least recently
    // seen" reads.
    expect(second[0]!.answered_at).toStrictEqual(first[0]!.answered_at);
  });

  it('replaces a previous answer rather than adding one', async () => {
    const question = questions[2]!;
    const correct = await correctRefOf(question.id);
    const wrong = ['o1', 'o2', 'o3', 'o4'].find((r) => r !== correct)!;

    await recordAnswer(db, { attemptId, questionId: question.id, optionRef: wrong });
    const before = await rowsFor(question.id);
    expect(before[0]!.is_correct).toBe(false);

    await recordAnswer(db, { attemptId, questionId: question.id, optionRef: correct });
    const after = await rowsFor(question.id);

    expect(after).toHaveLength(1);
    expect(after[0]!.option_ref).toBe(correct);
    expect(after[0]!.is_correct).toBe(true);
    // Changing your mind is not a second engagement with the question.
    expect(after[0]!.answered_at).toStrictEqual(before[0]!.answered_at);
  });

  it('clears an answer without deleting the row it was on', async () => {
    const question = questions[3]!;
    await recordAnswer(db, { attemptId, questionId: question.id, optionRef: 'o2' });
    await setFlag(db, { attemptId, questionId: question.id, flagged: true });

    expect(await recordAnswer(db, { attemptId, questionId: question.id, optionRef: null })).toBe(
      'saved',
    );

    const rows = await rowsFor(question.id);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.option_ref).toBeNull();
    expect(rows[0]!.is_correct).toBeNull();
    // Clearing an answer is not unflagging. The two are written apart precisely
    // so that neither can undo the other.
    expect(rows[0]!.flagged).toBe(true);
  });

  it('refuses an option the question does not have, and writes nothing', async () => {
    const question = questions[4]!;
    const result = await recordAnswer(db, {
      attemptId,
      questionId: question.id,
      optionRef: 'o9',
    });

    expect(result).toBe('unknown_option');
    expect(await rowsFor(question.id)).toHaveLength(0);
  });
});

describe.skipIf(!hasDatabase)('flagging', () => {
  it('stores a flag on a question never answered, inventing no answer for it', async () => {
    const question = questions[10]!;
    await setFlag(db, { attemptId, questionId: question.id, flagged: true });

    const rows = await rowsFor(question.id);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.flagged).toBe(true);
    expect(rows[0]!.option_ref).toBeNull();
    expect(rows[0]!.is_correct).toBeNull();
    // Never answered means never seen, for selection's purposes.
    expect(rows[0]!.answered_at).toBeNull();
  });

  it('unflags without disturbing the answer underneath', async () => {
    const question = questions[11]!;
    await recordAnswer(db, { attemptId, questionId: question.id, optionRef: 'o3' });
    await setFlag(db, { attemptId, questionId: question.id, flagged: true });
    await setFlag(db, { attemptId, questionId: question.id, flagged: false });

    const rows = await rowsFor(question.id);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.flagged).toBe(false);
    expect(rows[0]!.option_ref).toBe('o3');
  });

  it('survives an answer written after it', async () => {
    const question = questions[12]!;
    await setFlag(db, { attemptId, questionId: question.id, flagged: true });
    await recordAnswer(db, { attemptId, questionId: question.id, optionRef: 'o4' });

    const rows = await rowsFor(question.id);
    expect(rows[0]!.flagged).toBe(true);
    expect(rows[0]!.option_ref).toBe('o4');
  });
});

describe.skipIf(!hasDatabase)('reading a sitting back', () => {
  it('restores every answer and flag exactly', async () => {
    const state = await getAttemptAnswers(db, userId, attemptId);
    const byQuestion = new Map(state.map((a) => [a.questionId, a]));

    for (const question of questions) {
      const written = await rowsFor(question.id);
      if (written.length === 0) {
        expect(byQuestion.has(question.id), question.id).toBe(false);
        continue;
      }
      const restored = byQuestion.get(question.id);
      expect(restored, question.id).toBeDefined();
      expect(restored!.optionRef).toBe(written[0]!.option_ref);
      expect(restored!.flagged).toBe(written[0]!.flagged);
    }
  });

  it('carries no correctness — nothing on this path can leak the answer key', () => {
    // The shape is the guarantee. A sitting screen that never receives
    // correctness cannot show it by accident, whatever a later component does
    // with the object. Listed exhaustively rather than by absence, so a column
    // added to this query has to be looked at here before it ships.
    // `updatedAt` earns its place: it is when the row was last written, which
    // is what tells a resumed sitting where it was left (PRD E5).
    return getAttemptAnswers(db, userId, attemptId).then((state) => {
      expect(state.length).toBeGreaterThan(0);
      for (const entry of state) {
        expect(Object.keys(entry).sort()).toEqual([
          'flagged',
          'optionRef',
          'questionId',
          'updatedAt',
        ]);
      }
    });
  });

  it('reads one sitting only, never another', async () => {
    const question = questions[0]!;
    const otherState = await getAttemptAnswers(db, userId, otherAttemptId);
    expect(otherState.map((a) => a.questionId)).not.toContain(question.id);
  });
});

describe.skipIf(!hasDatabase)("somebody else's sitting", () => {
  // The acceptance criterion this file exists to keep honest: an attempt that
  // is not yours must be indistinguishable from one that does not exist. Two
  // users is the only way to assert it, and this is the one seam in the app
  // where a second user can be simulated at all.
  it('does not exist, as far as the wrong candidate can tell', async () => {
    expect(await getAttemptForUser(db, userId, strangerAttemptId)).toBeNull();
    // Not a quirk of a missing row: the stranger can read their own sitting.
    expect(await getAttemptForUser(db, strangerId, strangerAttemptId)).not.toBeNull();
    // And the same answer as a genuinely absent id, so the two cannot be told
    // apart by anything the caller sees.
    expect(await getAttemptForUser(db, userId, '00000000-0000-7000-8000-000000000000')).toBeNull();
  });

  it('reads back empty, however much is recorded on it', async () => {
    const question = questions[0]!;
    await recordAnswer(db, {
      attemptId: strangerAttemptId,
      questionId: question.id,
      optionRef: 'o1',
    });
    await setFlag(db, { attemptId: strangerAttemptId, questionId: question.id, flagged: true });

    // The stranger's own read finds it; ours finds nothing.
    expect(await getAttemptAnswers(db, strangerId, strangerAttemptId)).toHaveLength(1);
    expect(await getAttemptAnswers(db, userId, strangerAttemptId)).toEqual([]);
  });
});

describe.skipIf(!hasDatabase)('a question that is not on this paper', () => {
  it('is not recognised as belonging to the sitting', async () => {
    expect(await isQuestionOnPaper(db, 'exam-01', foreignQuestionId)).toBe(false);
    expect(await isQuestionOnPaper(db, 'exam-01', questions[0]!.id)).toBe(true);
  });

  it('is not recognised when it does not exist at all', async () => {
    expect(await isQuestionOnPaper(db, 'exam-01', 'q.linux.nothing.here.99')).toBe(false);
  });
});
