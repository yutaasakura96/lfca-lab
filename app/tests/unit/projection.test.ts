import { describe, expect, it } from 'vitest';
import { loadBank } from '../../scripts/bank.ts';
import {
  HOLDOUT_SIZE,
  assertWellFormed,
  domainOf,
  projectBank,
} from '../../scripts/projection.ts';
import type { Bank, BankItem } from '../../scripts/bank.ts';

// The seed's rules, tested without a database.
//
// Every one of these refusals exists because the alternative is worse than a
// crash. A question with two correct options renders as a four-option question
// with an unwinnable answer key; a holdout item on a paper voids the only
// honest signal this project has. Both would be believed rather than noticed,
// so the seed refuses rather than inserting and hoping.

function item(overrides: Partial<BankItem> = {}): BankItem {
  return {
    id: 'q.linux.command-line.awk.03',
    concept_id: 'linux.command-line.awk',
    pool: 'exam',
    type: 'application',
    difficulty: 3,
    stem: 'A stem.',
    options: [
      { ref: 'o1', text: 'a', correct: true, why: 'because', provenance: { kind: 'key' } },
      { ref: 'o2', text: 'b', correct: false, why: 'not this', provenance: { kind: 'sibling' } },
      { ref: 'o3', text: 'c', correct: false, why: 'nor this', provenance: { kind: 'variant' } },
      { ref: 'o4', text: 'd', correct: false, why: 'nor that', provenance: { kind: 'confusable' } },
    ],
    ...overrides,
  };
}

describe('reading a question\'s domain from its id', () => {
  it('takes the second segment', () => {
    expect(domainOf('q.linux.command-line.awk.03')).toBe('linux');
    expect(domainOf('q.pm.budgeting.forecasting.01')).toBe('pm');
  });

  // Defaulting would file the question under the wrong domain, skew every
  // weighted sitting after it, and look completely normal from the outside.
  it('throws on an unrecognised segment rather than defaulting', () => {
    expect(() => domainOf('q.networking.something.else.01')).toThrow(/not one of the six domains/);
  });

  it('throws on an id with no second segment', () => {
    expect(() => domainOf('nonsense')).toThrow();
  });
});

describe('what the seed refuses to insert', () => {
  it('accepts a well-formed item', () => {
    expect(() => assertWellFormed(item())).not.toThrow();
  });

  it('refuses a question without four options', () => {
    expect(() => assertWellFormed(item({ options: item().options.slice(0, 3) })))
      .toThrow(/3 option\(s\); every question has 4/);
  });

  it('refuses a question with no correct option', () => {
    const options = item().options.map((o) => ({ ...o, correct: false }));
    expect(() => assertWellFormed(item({ options }))).toThrow(/0 correct option/);
  });

  it('refuses a question with two correct options', () => {
    const options = item().options.map((o, i) => ({ ...o, correct: i < 2 }));
    expect(() => assertWellFormed(item({ options }))).toThrow(/2 correct option/);
  });

  it('refuses an option with empty why text', () => {
    const options = item().options.map((o, i) => (i === 1 ? { ...o, why: '   ' } : o));
    expect(() => assertWellFormed(item({ options }))).toThrow(/option o2 has no "why" text/);
  });

  it('refuses two options sharing a ref', () => {
    const options = item().options.map((o, i) => (i === 1 ? { ...o, ref: 'o1' } : o));
    expect(() => assertWellFormed(item({ options }))).toThrow(/sharing a ref/);
  });

  it('refuses difficulty outside 1 to 5', () => {
    expect(() => assertWellFormed(item({ difficulty: 0 }))).toThrow(/the scale is 1 to 5/);
    expect(() => assertWellFormed(item({ difficulty: 6 }))).toThrow(/the scale is 1 to 5/);
  });

  it('names the offending question in every refusal', () => {
    expect(() => assertWellFormed(item({ id: 'q.pm.x.y.07', difficulty: 9 })))
      .toThrow(/q\.pm\.x\.y\.07/);
  });
});

describe('projecting the whole bank', () => {
  const bank = loadBank();

  it('marks exactly forty holdout questions, from the pinned file', () => {
    const projection = projectBank(bank);
    expect(projection.questions.filter((q) => q.isHoldout)).toHaveLength(HOLDOUT_SIZE);

    const marked = new Set(projection.questions.filter((q) => q.isHoldout).map((q) => q.id));
    expect([...marked].sort()).toEqual([...bank.holdout].sort());
  });

  it('produces the measured row counts', () => {
    const projection = projectBank(bank);
    expect(projection.questions).toHaveLength(1150);
    expect(projection.options).toHaveLength(4600);
    expect(projection.exams).toHaveLength(16);
    expect(projection.examItems).toHaveLength(960);
  });

  it('puts no holdout question on any paper', () => {
    const projection = projectBank(bank);
    const holdout = new Set(projection.questions.filter((q) => q.isHoldout).map((q) => q.id));
    expect(projection.examItems.filter((i) => holdout.has(i.questionId))).toEqual([]);
  });
});

describe('projecting a bank that is wrong', () => {
  const bank = loadBank();
  const withHoldout = (holdout: string[]): Bank => ({ ...bank, holdout });

  it('refuses a pin that is not forty ids', () => {
    expect(() => projectBank(withHoldout(bank.holdout.slice(0, 39))))
      .toThrow(/pins 39 distinct id\(s\); the holdout is 40/);
  });

  it('refuses a pin naming a question that does not exist', () => {
    const invented = ['q.linux.not.a.question.99', ...bank.holdout.slice(1)];
    expect(() => projectBank(withHoldout(invented))).toThrow(/no question has/);
  });

  // The guard that matters most. The builder already refuses to *write* a paper
  // carrying a pinned item; this refuses to *seed* one, so a paper committed
  // before that guard existed cannot reach the database either.
  it('refuses when a pinned item appears on a paper', () => {
    const onPaper = bank.examIndex.exams[0]?.items[0]?.id as string;
    const drifted = [onPaper, ...bank.holdout.slice(1)];
    expect(() => projectBank(withHoldout(drifted)))
      .toThrow(/which is pinned as a holdout item/);
  });

  it('refuses a bank whose paper names an unknown question', () => {
    const broken: Bank = {
      ...bank,
      examIndex: {
        ...bank.examIndex,
        exams: [{ name: 'exam-01', items: [{ id: 'q.linux.ghost.item.01', position: 0 }] }],
      },
    };
    expect(() => projectBank(broken)).toThrow(/which is not in the bank/);
  });
});
