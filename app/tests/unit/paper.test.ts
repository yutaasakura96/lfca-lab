import { describe, expect, it } from 'vitest';
import {
  layOutForPaper,
  orderOptionsForPaper,
  type AuthoredOption,
} from '../../src/domain/paper.ts';

const options: AuthoredOption[] = [
  { ref: 'o1', text: 'first', correct: false, position: 0 },
  { ref: 'o2', text: 'second', correct: true, position: 1 },
  { ref: 'o3', text: 'third', correct: false, position: 2 },
  { ref: 'o4', text: 'fourth', correct: false, position: 3 },
];

describe('laying a question out on a paper', () => {
  it('puts the correct option exactly where the paper says', () => {
    for (const slot of [0, 1, 2, 3]) {
      const laid = orderOptionsForPaper(options, slot);
      expect(laid[slot]?.ref, `slot ${slot}`).toBe('o2');
    }
  });

  it('keeps all four options, without duplicating or dropping any', () => {
    for (const slot of [0, 1, 2, 3]) {
      const refs = orderOptionsForPaper(options, slot).map((o) => o.ref);
      expect(new Set(refs).size, `slot ${slot}`).toBe(4);
      expect([...refs].sort()).toEqual(['o1', 'o2', 'o3', 'o4']);
    }
  });

  it('keeps the distractors in their authored order around the correct one', () => {
    expect(orderOptionsForPaper(options, 0).map((o) => o.ref)).toEqual(['o2', 'o1', 'o3', 'o4']);
    expect(orderOptionsForPaper(options, 2).map((o) => o.ref)).toEqual(['o1', 'o3', 'o2', 'o4']);
    expect(orderOptionsForPaper(options, 3).map((o) => o.ref)).toEqual(['o1', 'o3', 'o4', 'o2']);
  });

  it('reads authored order from position, not from array order', () => {
    // The database returns rows in whatever order it likes unless told
    // otherwise. Relying on that would make the layout drift between runs.
    const shuffled = [options[3], options[0], options[2], options[1]] as AuthoredOption[];
    expect(orderOptionsForPaper(shuffled, 1)).toEqual(orderOptionsForPaper(options, 1));
  });

  it('is deterministic — a re-sit lays out identically', () => {
    expect(orderOptionsForPaper(options, 2)).toEqual(orderOptionsForPaper(options, 2));
  });

  // The reason this function exists at all.
  it('returns only ref and text — never correctness', () => {
    for (const option of orderOptionsForPaper(options, 1)) {
      expect(Object.keys(option).sort()).toEqual(['ref', 'text']);
      expect(JSON.stringify(option)).not.toContain('correct');
    }
  });

  it('leaks nothing about the answer through serialisation', () => {
    // Serialised, because that is how it reaches a browser: whatever survives
    // JSON is what a reader can open devtools and read.
    const laid = JSON.stringify(orderOptionsForPaper(options, 3));
    expect(laid).not.toContain('correct');
    expect(laid).not.toContain('position');
    expect(laid).not.toContain('true');
  });
});

describe('refusing a question that cannot be laid out', () => {
  it('refuses a slot outside the paper', () => {
    expect(() => orderOptionsForPaper(options, -1)).toThrow(/0–3/);
    expect(() => orderOptionsForPaper(options, 4)).toThrow(/0–3/);
  });

  it('refuses anything other than four options', () => {
    expect(() => orderOptionsForPaper(options.slice(0, 3), 0)).toThrow(/four options/);
  });

  it('refuses a question with no correct option, or two', () => {
    const none = options.map((o) => ({ ...o, correct: false }));
    const two = options.map((o, i) => ({ ...o, correct: i < 2 }));

    expect(() => orderOptionsForPaper(none, 0)).toThrow(/exactly one correct/);
    expect(() => orderOptionsForPaper(two, 0)).toThrow(/exactly one correct/);
  });
});

describe('laying a question out for the review', () => {
  // The review shows the same paper the candidate sat, with correctness and the
  // `why` for all four options. It has to place them in the identical order, or
  // the letter beside "Your answer" would name an option the candidate never
  // pressed. The only way to guarantee that is for both to be the same
  // placement, so this asserts they are.
  const richer = options.map((o) => ({ ...o, why: `why ${o.ref}` }));

  it('places options exactly where the sitting placed them', () => {
    for (const slot of [0, 1, 2, 3]) {
      expect(layOutForPaper(richer, slot).map((o) => o.ref), `slot ${slot}`).toEqual(
        orderOptionsForPaper(options, slot).map((o) => o.ref),
      );
    }
  });

  it('keeps the fields the sitting deliberately strips', () => {
    const laid = layOutForPaper(richer, 1);
    expect(laid[1]).toMatchObject({ ref: 'o2', correct: true, why: 'why o2' });
  });

  it('refuses the same malformed input the sitting refuses', () => {
    expect(() => layOutForPaper(richer.slice(0, 3), 0)).toThrow();
    expect(() => layOutForPaper(richer, 4)).toThrow();
    expect(() => layOutForPaper(richer.map((o) => ({ ...o, correct: false })), 0)).toThrow();
  });
});
