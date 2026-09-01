import { describe, expect, it } from 'vitest';
import { AnswerRequest, FlagRequest } from '../../src/lib/requests.ts';
import { loadItems } from '../bank.ts';

// The write surface's shape, checked without a server.
//
// Every route handler validates its body before anything else runs, and these
// two schemas are that check. They are worth testing on their own because the
// input surface *is* the attack surface: two ids and a boolean, and the ids are
// the only free-form strings the app ever accepts from a browser.

describe('the answer request', () => {
  it('accepts a question id and one of the four option refs', () => {
    for (const ref of ['o1', 'o2', 'o3', 'o4']) {
      const parsed = AnswerRequest.safeParse({ questionId: 'q.linux.command-line.awk.03', optionRef: ref });
      expect(parsed.success, ref).toBe(true);
    }
  });

  it('accepts a null ref, which clears an answer', () => {
    const parsed = AnswerRequest.safeParse({
      questionId: 'q.linux.command-line.awk.03',
      optionRef: null,
    });
    expect(parsed.success).toBe(true);
  });

  it('refuses a ref outside the four', () => {
    for (const ref of ['o0', 'o5', 'O1', 'o1 ', '', 'correct', 'o1;--']) {
      const parsed = AnswerRequest.safeParse({ questionId: 'q.linux.command-line.awk.03', optionRef: ref });
      expect(parsed.success, ref).toBe(false);
    }
  });

  it('refuses an absent ref — clearing an answer must be said, not implied', () => {
    // `undefined` and `null` are different intentions and the difference
    // matters: one is a body missing a field, which is a bug or an attack, and
    // the other is a candidate deliberately unselecting their answer.
    expect(AnswerRequest.safeParse({ questionId: 'q.linux.command-line.awk.03' }).success).toBe(false);
  });

  it('refuses a question id that is not shaped like one', () => {
    for (const id of [
      '',
      'awk.03',
      'q.',
      'q.Linux.Command-Line.awk.03',
      "q.linux'--",
      'q.linux.command-line.awk.03 ',
      'x.linux.command-line.awk.03',
    ]) {
      const parsed = AnswerRequest.safeParse({ questionId: id, optionRef: 'o1' });
      expect(parsed.success, id).toBe(false);
    }
  });

  it('strips unknown keys rather than trusting them', () => {
    const parsed = AnswerRequest.safeParse({
      questionId: 'q.linux.command-line.awk.03',
      optionRef: 'o1',
      isCorrect: true,
      flagged: true,
    });
    expect(parsed.success).toBe(true);
    // A client that sends `isCorrect` must not have it reach a write. Scoring is
    // the server's to decide, from the bank, every time.
    expect(parsed.success && parsed.data).toEqual({
      questionId: 'q.linux.command-line.awk.03',
      optionRef: 'o1',
    });
  });

  it('accepts every id the bank actually has', () => {
    // The regex is the app's only description of what a question id looks like.
    // Measuring it against all 1,150 rather than against three examples is what
    // stops it being tightened into refusing real content.
    const items = loadItems();
    expect(items.length).toBeGreaterThan(1000);

    const refused = items
      .map((item) => item.id)
      .filter((id) => !AnswerRequest.safeParse({ questionId: id, optionRef: 'o1' }).success);

    expect(refused).toEqual([]);
  });
});

describe('the flag request', () => {
  it('accepts a question id and a boolean', () => {
    for (const flagged of [true, false]) {
      const parsed = FlagRequest.safeParse({ questionId: 'q.linux.command-line.awk.03', flagged });
      expect(parsed.success, String(flagged)).toBe(true);
    }
  });

  it('refuses anything but a boolean — a flag is set or it is not', () => {
    for (const flagged of ['true', 1, 0, null, undefined]) {
      const parsed = FlagRequest.safeParse({ questionId: 'q.linux.command-line.awk.03', flagged });
      expect(parsed.success, String(flagged)).toBe(false);
    }
  });

  it('carries no option ref — a flag can never smuggle an answer', () => {
    const parsed = FlagRequest.safeParse({
      questionId: 'q.linux.command-line.awk.03',
      flagged: true,
      optionRef: 'o2',
    });
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data).toEqual({
      questionId: 'q.linux.command-line.awk.03',
      flagged: true,
    });
  });
});
