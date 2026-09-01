import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db, pool } from '../../src/db/client.ts';
import { getPaperQuestions } from '../../src/db/queries/paper.ts';
import { assertSeeded } from './support.ts';

const hasDatabase = Boolean(process.env.DATABASE_URL);

beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
});

afterAll(async () => {
  if (!hasDatabase) return;
  await pool.end();
});

describe.skipIf(!hasDatabase)('reading a paper for a sitting', () => {
  it('returns sixty questions in the paper\'s own order', async () => {
    const questions = await getPaperQuestions(db, 'exam-07');

    expect(questions).toHaveLength(60);
    expect(questions.map((q) => q.seq)).toEqual(Array.from({ length: 60 }, (_, i) => i));
  });

  it('gives every question four options with distinct refs', async () => {
    const questions = await getPaperQuestions(db, 'exam-07');

    for (const question of questions) {
      expect(question.options, question.id).toHaveLength(4);
      expect(new Set(question.options.map((o) => o.ref)).size, question.id).toBe(4);
      expect(question.stem.length, question.id).toBeGreaterThan(0);
    }
  });

  // The one that matters. Everything this query returns is destined for a
  // browser, so anything it carries is readable by the person being tested.
  //
  // Asserted over *keys*, not over the serialised text. Searching the payload
  // for "correct" fails on question prose — the bank is full of sentences
  // containing the word — and a check that cries wolf on real content is a
  // check that gets deleted.
  it('carries nothing that gives the answer away', async () => {
    const questions = await getPaperQuestions(db, 'exam-07');

    const forbidden = ['correct', 'why', 'provenance', 'correctPosition', 'correct_position',
      'provenanceKind', 'isHoldout', 'is_holdout'];

    const keysIn = (value: unknown, found: string[] = []): string[] => {
      if (Array.isArray(value)) {
        for (const item of value) keysIn(item, found);
      } else if (value !== null && typeof value === 'object') {
        for (const [key, nested] of Object.entries(value)) {
          found.push(key);
          keysIn(nested, found);
        }
      }
      return found;
    };

    const keys = new Set(keysIn(questions));
    for (const name of forbidden) {
      expect([...keys], `key "${name}" reached the payload`).not.toContain(name);
    }
    expect([...keys].sort()).toEqual(['id', 'options', 'ref', 'seq', 'stem', 'text']);

    for (const question of questions) {
      expect(Object.keys(question).sort()).toEqual(['id', 'options', 'seq', 'stem']);
      for (const option of question.options) {
        expect(Object.keys(option).sort()).toEqual(['ref', 'text']);
      }
    }
  });

  it('places the correct option where the paper records it', async () => {
    // Checked against the database rather than against the layout function, so
    // this fails if the query stops passing the right slot through.
    const recorded = await db.execute<{ question_id: string; seq: number; ref: string }>(sql`
      SELECT ei.question_id, ei.seq, o.ref
      FROM exam_item ei
      JOIN question_option o ON o.question_id = ei.question_id AND o.correct
      WHERE ei.exam_id = 'exam-07'
      ORDER BY ei.seq
    `);
    const positions = await db.execute<{ seq: number; correct_position: number }>(sql`
      SELECT seq, correct_position FROM exam_item WHERE exam_id = 'exam-07' ORDER BY seq
    `);

    const questions = await getPaperQuestions(db, 'exam-07');

    for (const question of questions) {
      const slot = positions.rows.find((p) => p.seq === question.seq)?.correct_position as number;
      const correctRef = recorded.rows.find((r) => r.seq === question.seq)?.ref;
      expect(question.options[slot]?.ref, `${question.id} seq ${question.seq}`).toBe(correctRef);
    }
  });

  it('spreads the correct answer across all four slots, as the bank intended', async () => {
    // If this ever collapsed to one slot, the paper would still "work" and
    // every sitting would be guessable. The bank was built with a deliberate
    // answer-position balance; this is the check that it survived the journey.
    const questions = await getPaperQuestions(db, 'exam-07');
    const positions = await db.execute<{ correct_position: number; n: number }>(sql`
      SELECT correct_position, count(*)::int AS n
      FROM exam_item WHERE exam_id = 'exam-07' GROUP BY correct_position
    `);

    expect(positions.rows.length).toBe(4);
    for (const row of positions.rows) expect(row.n).toBeGreaterThan(5);
    expect(questions).toHaveLength(60);
  });

  it('lays a paper out identically on every read, so a re-sit is the same paper', async () => {
    const first = await getPaperQuestions(db, 'exam-03');
    const second = await getPaperQuestions(db, 'exam-03');
    expect(first).toEqual(second);
  });

  it('returns nothing for a paper that does not exist', async () => {
    expect(await getPaperQuestions(db, 'exam-99')).toEqual([]);
  });
});
