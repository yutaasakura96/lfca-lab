import { describe, expect, it } from 'vitest';
import {
  buildGradedNavigator,
  firstUnansweredSeq,
  gradedStateFor,
  patchGraded,
  type GradedRecord,
  type NavigatorQuestion,
} from '../../src/domain/navigator.ts';

/** A composed sitting of `n` questions, in the shape the screen hands it in. */
function sitting(n: number): NavigatorQuestion[] {
  return Array.from({ length: n }, (_, seq) => ({ id: `q.${seq}`, seq }));
}

function graded(entries: Record<number, GradedRecord>): Record<string, GradedRecord> {
  return Object.fromEntries(Object.entries(entries).map(([seq, state]) => [`q.${seq}`, state]));
}

const right: GradedRecord = { optionRef: 'o1', isCorrect: true };
const wrong: GradedRecord = { optionRef: 'o2', isCorrect: false };
/** Answered, and the write that decides the verdict has not come back yet. */
const pending: GradedRecord = { optionRef: 'o3', isCorrect: null };
const nothing: Record<string, GradedRecord> = {};

describe('the graded model', () => {
  it('has one tile per question, whatever has been answered', () => {
    expect(buildGradedNavigator(sitting(20), nothing, 0).tiles).toHaveLength(20);
  });

  it('numbers tiles from one, so the counter and the session card agree', () => {
    const { tiles } = buildGradedNavigator(sitting(20), nothing, 0);
    expect(tiles[0]?.number).toBe(1);
    expect(tiles[19]?.number).toBe(20);
    expect(tiles[7]?.seq).toBe(7);
  });

  it('orders by seq, not by the order the rows arrived in', () => {
    const shuffled = [...sitting(5)].reverse();
    expect(buildGradedNavigator(shuffled, nothing, 0).tiles.map((t) => t.number)).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it("refuses a set whose positions are not 0…n-1", () => {
    // The whole screen treats a seq and an array index as the same number.
    expect(() => buildGradedNavigator([{ id: 'q.a', seq: 4 }], nothing, 0)).toThrow(/0 to n-1/);
  });

  it('refuses a current position off the end of the sitting', () => {
    expect(() => buildGradedNavigator(sitting(20), nothing, 20)).toThrow(/must be in the sitting/);
  });
});

describe('the three counts', () => {
  it('counts a right answer as correct and a wrong one as incorrect', () => {
    const model = buildGradedNavigator(
      sitting(4),
      graded({ 0: right, 1: wrong, 2: right }),
      3,
    );
    expect(model.correct).toBe(2);
    expect(model.incorrect).toBe(1);
    expect(model.remaining).toBe(1);
  });

  it('sums to the sitting once every write has landed', () => {
    const model = buildGradedNavigator(sitting(3), graded({ 0: right, 1: wrong, 2: right }), 2);
    expect(model.correct + model.incorrect + model.remaining).toBe(3);
  });

  it('puts an answer awaiting its verdict in no column at all', () => {
    // It is answered, so it is not remaining; the server has not said whether
    // it was right, so it is neither correct nor incorrect. A verdict this
    // screen has not been told cannot be put in a column, and inventing one is
    // the exact failure the whole mode is organised against.
    const model = buildGradedNavigator(sitting(3), graded({ 0: pending }), 0);
    expect(model).toMatchObject({ correct: 0, incorrect: 0, remaining: 2 });
  });

  it('ignores rows for questions this sitting did not ask', () => {
    const model = buildGradedNavigator(sitting(2), { 'q.99': right }, 0);
    expect(model).toMatchObject({ correct: 0, incorrect: 0, remaining: 2 });
  });
});

describe('what a tile says', () => {
  it('carries the verdict, so the fill is never the only signal', () => {
    const { tiles } = buildGradedNavigator(sitting(3), graded({ 0: right, 1: wrong }), 2);
    expect(tiles[0]?.verdict).toBe('correct');
    expect(tiles[1]?.verdict).toBe('incorrect');
    expect(tiles[2]?.verdict).toBeUndefined();
  });

  it('has no verdict while the write is in the air, so no glyph is guessed', () => {
    const { tiles } = buildGradedNavigator(sitting(2), graded({ 0: pending }), 0);
    expect(tiles[0]?.answered).toBe(true);
    expect(tiles[0]?.verdict).toBeUndefined();
  });

  it('never flags anything — these modes cannot', () => {
    const { tiles } = buildGradedNavigator(sitting(3), graded({ 0: right }), 0);
    expect(tiles.every((tile) => !tile.flagged)).toBe(true);
  });

  it('says the whole state in words, for greyscale and for a screen reader', () => {
    const { tiles } = buildGradedNavigator(sitting(3), graded({ 0: right, 1: pending }), 0);
    expect(tiles[0]?.label).toBe('Question 1, correct, current question');
    expect(tiles[1]?.label).toBe('Question 2, answered, awaiting its verdict');
    expect(tiles[2]?.label).toBe('Question 3, not answered yet');
  });

  it('marks exactly one tile current', () => {
    const { tiles } = buildGradedNavigator(sitting(20), nothing, 6);
    expect(tiles.filter((tile) => tile.current).map((tile) => tile.number)).toEqual([7]);
  });
});

describe('where a resumed sitting opens', () => {
  it('opens on the first question with no answer', () => {
    expect(firstUnansweredSeq(sitting(20), graded({ 0: right, 1: wrong, 2: right }))).toBe(3);
  });

  it('opens on the first question when nothing has been answered', () => {
    expect(firstUnansweredSeq(sitting(20), nothing)).toBe(0);
  });

  it('opens on the last question when every one has been answered', () => {
    // The only case in which an answered question is on screen at load, and
    // therefore the only case where a key has to be restored with it.
    expect(firstUnansweredSeq(sitting(3), graded({ 0: right, 1: wrong, 2: right }))).toBe(2);
  });

  it('counts an answer awaiting its verdict as answered', () => {
    // It was given. The verdict is the server's to state and its absence is a
    // fact about the network, not about whether the candidate answered.
    expect(firstUnansweredSeq(sitting(3), graded({ 0: pending }))).toBe(1);
  });

  it('reads the set by seq rather than by the order it arrived in', () => {
    expect(firstUnansweredSeq([...sitting(3)].reverse(), graded({ 0: right }))).toBe(1);
  });
});

describe('holding one question at a time', () => {
  it('reports nothing recorded for a question never answered', () => {
    expect(gradedStateFor(nothing, 'q.0')).toEqual({ optionRef: null, isCorrect: null });
  });

  it('replaces one question and leaves the rest alone', () => {
    const before = graded({ 0: right, 1: wrong });
    const after = patchGraded(before, 'q.0', (was) => ({ ...was, isCorrect: false }));
    expect(after['q.0']).toEqual({ optionRef: 'o1', isCorrect: false });
    expect(after['q.1']).toEqual(wrong);
    // A mutated object is a render that does not happen.
    expect(before['q.0']).toEqual(right);
  });
});
