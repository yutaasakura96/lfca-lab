import { describe, expect, it } from 'vitest';
import {
  buildNavigator,
  patch,
  stateFor,
  UNANSWERED,
  type NavigatorQuestion,
  type RecordedState,
} from '../../src/domain/navigator.ts';

/** A paper of `n` questions, in the shape the sitting hands the navigator. */
function paper(n: number): NavigatorQuestion[] {
  return Array.from({ length: n }, (_, seq) => ({ id: `q.${seq}`, seq }));
}

const nothing: Record<string, RecordedState> = {};

describe('representing all sixty', () => {
  it('has one tile per question, whatever has been recorded', () => {
    expect(buildNavigator(paper(60), nothing, 0).tiles).toHaveLength(60);
  });

  it('numbers tiles from one, so the screen and the question counter agree', () => {
    const { tiles } = buildNavigator(paper(60), nothing, 0);
    expect(tiles[0]?.number).toBe(1);
    expect(tiles[59]?.number).toBe(60);
    expect(tiles[22]?.seq).toBe(22);
  });

  it('orders by seq, not by the order the rows arrived in', () => {
    // The paper's order is the exam's defined order (PRD E1). A query that
    // returned rows unsorted must not silently reorder the sitting.
    const shuffled = [...paper(5)].reverse();
    expect(buildNavigator(shuffled, nothing, 0).tiles.map((t) => t.number)).toEqual([1, 2, 3, 4, 5]);
  });

  it('refuses a paper with two questions at the same position', () => {
    const clashing = [
      { id: 'q.a', seq: 3 },
      { id: 'q.b', seq: 3 },
    ];
    expect(() => buildNavigator(clashing, nothing, 0)).toThrow(/position/i);
  });

  it('refuses a paper whose positions are not 0 to n-1', () => {
    // The tile reports its `seq` when clicked and the sitting reads that back
    // as an array index. They are the same number only because a paper's
    // positions are contiguous from zero — so a gap must stop here, loudly,
    // rather than selecting a question nobody asked for.
    const gap = [
      { id: 'q.a', seq: 0 },
      { id: 'q.b', seq: 2 },
    ];
    expect(() => buildNavigator(gap, nothing, 0)).toThrow(/0 to n-1/);

    const offset = [
      { id: 'q.a', seq: 1 },
      { id: 'q.b', seq: 2 },
    ];
    expect(() => buildNavigator(offset, nothing, 0)).toThrow(/0 to n-1/);
  });

  it('numbers a tile from its own position, not from where it landed in the array', () => {
    const { tiles } = buildNavigator(paper(4), nothing, 0);
    expect(tiles.map((t) => [t.seq, t.number])).toEqual([
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
  });
});

describe('reading and changing one question, leaving the rest alone', () => {
  it('reads a question with no row as unanswered and unflagged', () => {
    expect(stateFor({}, 'q.0')).toEqual(UNANSWERED);
  });

  it('reads back exactly what is recorded', () => {
    const all = { 'q.0': { optionRef: 'o2', flagged: true } };
    expect(stateFor(all, 'q.0')).toEqual({ optionRef: 'o2', flagged: true });
  });

  it('changes one question without touching its neighbours', () => {
    const before = {
      'q.0': { optionRef: 'o1', flagged: false },
      'q.1': { optionRef: 'o3', flagged: true },
    };
    const after = patch(before, 'q.0', (s) => ({ ...s, optionRef: 'o4' }));

    expect(after['q.0']).toEqual({ optionRef: 'o4', flagged: false });
    expect(after['q.1']).toEqual(before['q.1']);
  });

  it('creates the row when there was none, from the unanswered default', () => {
    const after = patch({}, 'q.7', (s) => ({ ...s, flagged: true }));
    expect(after['q.7']).toEqual({ optionRef: null, flagged: true });
  });

  it('returns a new record rather than mutating — a mutation is a render that never happens', () => {
    const before = { 'q.0': { optionRef: null, flagged: false } };
    const after = patch(before, 'q.0', (s) => ({ ...s, flagged: true }));

    expect(after).not.toBe(before);
    expect(before['q.0']).toEqual({ optionRef: null, flagged: false });
  });
});

describe('answered, unanswered and flagged', () => {
  it('counts a question answered only once an option is chosen', () => {
    const recorded = { 'q.0': { optionRef: 'o2', flagged: false } };
    const model = buildNavigator(paper(3), recorded, 0);

    expect(model.tiles[0]?.answered).toBe(true);
    expect(model.tiles[1]?.answered).toBe(false);
    expect(model.answered).toBe(1);
    expect(model.unanswered).toBe(2);
  });

  it('treats a flagged-but-unanswered question as unanswered', () => {
    // Doc 04 §6: the row exists to carry the flag; its `option_ref` is null and
    // it scores as unanswered. A navigator that counted it as answered would
    // tell someone they had finished a question they had not.
    const recorded = { 'q.1': { optionRef: null, flagged: true } };
    const model = buildNavigator(paper(3), recorded, 0);

    expect(model.tiles[1]?.answered).toBe(false);
    expect(model.tiles[1]?.flagged).toBe(true);
    expect(model.answered).toBe(0);
    expect(model.unanswered).toBe(3);
    expect(model.flagged).toBe(1);
  });

  it('keeps answered and flagged independent, so both are expressible at once', () => {
    const recorded = {
      'q.0': { optionRef: 'o1', flagged: true },
      'q.1': { optionRef: 'o1', flagged: false },
      'q.2': { optionRef: null, flagged: true },
    };
    const { tiles } = buildNavigator(paper(4), recorded, 0);

    expect(tiles.map((t) => [t.answered, t.flagged])).toEqual([
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ]);
  });

  it('always accounts for every question — answered plus unanswered is the whole paper', () => {
    const recorded: Record<string, RecordedState> = {};
    for (let seq = 0; seq < 60; seq += 3) recorded[`q.${seq}`] = { optionRef: 'o1', flagged: false };
    for (let seq = 1; seq < 60; seq += 7) recorded[`q.${seq}`] = { optionRef: null, flagged: true };

    const model = buildNavigator(paper(60), recorded, 0);
    expect(model.answered + model.unanswered).toBe(60);
  });

  it('reads a question with no row at all as unanswered and unflagged', () => {
    const { tiles } = buildNavigator(paper(2), nothing, 0);
    expect(tiles.every((t) => !t.answered && !t.flagged)).toBe(true);
  });

  it('ignores recorded rows for questions this paper does not ask', () => {
    // Answers are scoped to an attempt, so this should not happen — but a
    // count inflated by a stray row would be a wrong number, and wrong numbers
    // are the failure this project is organised against.
    const recorded = { 'q.stranger': { optionRef: 'o1', flagged: true } };
    const model = buildNavigator(paper(3), recorded, 0);
    expect(model.answered).toBe(0);
    expect(model.flagged).toBe(0);
  });
});

describe('the current question', () => {
  it('marks exactly one tile current', () => {
    const { tiles } = buildNavigator(paper(60), nothing, 22);
    expect(tiles.filter((t) => t.current).map((t) => t.number)).toEqual([23]);
  });

  it('refuses a position that is not on the paper', () => {
    expect(() => buildNavigator(paper(60), nothing, 60)).toThrow(/current/i);
    expect(() => buildNavigator(paper(60), nothing, -1)).toThrow(/current/i);
  });

  it('does not change what is answered — current is orthogonal too', () => {
    const recorded = { 'q.5': { optionRef: 'o3', flagged: false } };
    const a = buildNavigator(paper(10), recorded, 5);
    const b = buildNavigator(paper(10), recorded, 9);
    expect(a.answered).toBe(b.answered);
    expect(a.tiles[5]?.answered).toBe(true);
    expect(b.tiles[5]?.answered).toBe(true);
  });
});

describe('every state is written out in words', () => {
  // The tile's colour, border and folded corner carry it visually; the label
  // is what carries it to a screen reader and to anyone the colours fail.
  const recorded = {
    'q.0': { optionRef: 'o1', flagged: false },
    'q.1': { optionRef: 'o1', flagged: true },
    'q.2': { optionRef: null, flagged: true },
  };
  const { tiles } = buildNavigator(paper(4), recorded, 0);

  it('names the question number in every label', () => {
    expect(tiles.map((t) => t.label.startsWith(`Question ${t.number}`))).toEqual([
      true,
      true,
      true,
      true,
    ]);
  });

  it('distinguishes all four answered/flagged combinations', () => {
    const labels = tiles.map((t) => t.label.replace(/^Question \d+/, ''));
    expect(new Set(labels).size).toBe(4);
  });

  it('says answered or unanswered, and says flagged only when it is', () => {
    expect(tiles[0]?.label).toMatch(/answered/);
    expect(tiles[0]?.label).not.toMatch(/flagged/);
    expect(tiles[1]?.label).toMatch(/answered/);
    expect(tiles[1]?.label).toMatch(/flagged/);
    expect(tiles[2]?.label).toMatch(/unanswered/);
    expect(tiles[2]?.label).toMatch(/flagged/);
    expect(tiles[3]?.label).toMatch(/unanswered/);
  });

  it('says which one is current', () => {
    expect(tiles[0]?.label).toMatch(/current/i);
    expect(tiles[1]?.label).not.toMatch(/current/i);
  });
});
