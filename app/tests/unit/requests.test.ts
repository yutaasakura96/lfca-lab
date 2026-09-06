import { describe, expect, it } from 'vitest';
import { AnswerRequest, FlagRequest, StartAttemptRequest } from '../../src/lib/requests.ts';
import { DEFAULT_PRACTICE_LENGTH, DOMAINS } from '../../src/domain/weights.ts';
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

describe('the start request', () => {
  it('defaults a practice sitting to the one place that length is decided', () => {
    const parsed = StartAttemptRequest.safeParse({ mode: 'practice' });
    expect(parsed.success && parsed.data).toEqual({
      mode: 'practice',
      length: DEFAULT_PRACTICE_LENGTH,
    });
  });

  it('accepts each of the three weighted lengths, and nothing between them', () => {
    for (const length of [20, 40, 60]) {
      expect(StartAttemptRequest.safeParse({ mode: 'practice', length }).success, String(length))
        .toBe(true);
    }
    // A free integer is the shape doc 03 §9 rules out by name: the composer
    // pins a quota table per length, so a length with no table is a sitting
    // with no shape.
    for (const length of [0, 1, 19, 30, 61, 600, '20', null]) {
      expect(StartAttemptRequest.safeParse({ mode: 'practice', length }).success, String(length))
        .toBe(false);
    }
  });

  it('defaults a domain sitting to twenty, and takes all six domains', () => {
    for (const domain of DOMAINS) {
      const parsed = StartAttemptRequest.safeParse({ mode: 'domain', domain });
      expect(parsed.success && parsed.data).toEqual({ mode: 'domain', domain, length: 20 });
    }
  });

  it("lets a domain sitting say 'all', and a practice sitting not", () => {
    expect(
      StartAttemptRequest.safeParse({ mode: 'domain', domain: 'security', length: 'all' }).success,
    ).toBe(true);
    // 'all' means "however many that domain has", which is a fact about one
    // pool. A weighted sitting spans six, so there is nothing for it to mean.
    expect(StartAttemptRequest.safeParse({ mode: 'practice', length: 'all' }).success).toBe(false);
    // And 60 is not a domain length: doc 10 §3's control offers 20 / 40 / All.
    expect(
      StartAttemptRequest.safeParse({ mode: 'domain', domain: 'security', length: 60 }).success,
    ).toBe(false);
  });

  it('refuses a domain sitting with no domain, and an unknown domain', () => {
    expect(StartAttemptRequest.safeParse({ mode: 'domain' }).success).toBe(false);
    expect(StartAttemptRequest.safeParse({ mode: 'domain', domain: 'networking' }).success)
      .toBe(false);
  });

  it('refuses an exam sitting with no paper, and a paper that is not one of the sixteen', () => {
    expect(StartAttemptRequest.safeParse({ mode: 'exam' }).success).toBe(false);
    for (const examId of ['exam-1', 'exam-007', 'exam-07; drop', '../exam-07']) {
      expect(StartAttemptRequest.safeParse({ mode: 'exam', examId }).success, examId).toBe(false);
    }
    expect(StartAttemptRequest.safeParse({ mode: 'exam', examId: 'exam-07' }).success).toBe(true);
  });

  it('refuses a mode that is not one of the four', () => {
    for (const mode of ['drill', 'review', '', null, 60]) {
      expect(StartAttemptRequest.safeParse({ mode }).success, String(mode)).toBe(false);
    }
  });
});
