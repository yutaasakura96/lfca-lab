// Turning the bank's JSON into rows — pure, so the rules can be tested without
// a database.
//
// Every rejection here is deliberate. The seed's job is not to get as much
// content into Postgres as possible; it is to refuse anything that would make a
// sitting wrong. A question with two correct options would render as a
// four-option question with an unwinnable answer key, and nobody would find out
// until a score was already believed.

import type { Bank, BankItem, CompetencyFile } from './bank.ts';
import { DOMAINS, type Domain } from '../src/domain/weights.ts';

export const HOLDOUT_SIZE = 40;

const POOLS = ['exam', 'supplement'] as const;
const TYPES = ['application', 'discrimination', 'diagnostic', 'command', 'recall'] as const;

export interface QuestionRow {
  id: string;
  conceptId: string;
  competency: string;
  domain: Domain;
  pool: (typeof POOLS)[number];
  type: (typeof TYPES)[number];
  difficulty: number;
  stem: string;
  isHoldout: boolean;
}

export interface OptionRow {
  questionId: string;
  ref: string;
  position: number;
  text: string;
  correct: boolean;
  why: string;
  provenanceKind: string;
  provenanceConceptId: string | null;
}

export interface ExamRow {
  id: string;
  number: number;
  questionCount: number;
}

export interface ExamItemRow {
  examId: string;
  seq: number;
  questionId: string;
  correctPosition: number;
}

export interface Projection {
  questions: QuestionRow[];
  options: OptionRow[];
  exams: ExamRow[];
  examItems: ExamItemRow[];
}

/**
 * The domain is the id's second segment — `q.linux.command-line.awk.03` is
 * `linux`. Unrecognised segments **throw**; they never default. A question
 * silently filed under the wrong domain would skew every weighted sitting
 * afterwards, and nothing downstream would look wrong.
 */
export function domainOf(id: string): Domain {
  const segment = id.split('.')[1];
  const domain = DOMAINS.find((d) => d === segment);
  if (domain === undefined) {
    throw new Error(
      `${id}: "${segment}" is not one of the six domains (${DOMAINS.join(', ')}).`,
    );
  }
  return domain;
}

/** Everything that must be true of an item before any of it reaches Postgres. */
export function assertWellFormed(item: BankItem): void {
  const fail = (why: string): never => {
    throw new Error(`${item.id}: ${why}`);
  };

  if (item.options.length !== 4) fail(`has ${item.options.length} option(s); every question has 4.`);

  const correct = item.options.filter((o) => o.correct);
  if (correct.length !== 1) {
    fail(`has ${correct.length} correct option(s); every question has exactly 1.`);
  }

  if (new Set(item.options.map((o) => o.ref)).size !== item.options.length) {
    fail('has two options sharing a ref.');
  }

  for (const option of item.options) {
    if (typeof option.why !== 'string' || option.why.trim() === '') {
      // Including the wrong ones. The review screen shows all four, and the
      // wrong-option text is the most valuable content in the bank.
      fail(`option ${option.ref} has no "why" text.`);
    }
    if (typeof option.text !== 'string' || option.text.trim() === '') {
      fail(`option ${option.ref} has no text.`);
    }
  }

  if (!Number.isInteger(item.difficulty) || item.difficulty < 1 || item.difficulty > 5) {
    fail(`has difficulty ${item.difficulty}; the scale is 1 to 5.`);
  }
  if (!POOLS.includes(item.pool as (typeof POOLS)[number])) fail(`has unknown pool "${item.pool}".`);
  if (!TYPES.includes(item.type as (typeof TYPES)[number])) fail(`has unknown type "${item.type}".`);
}

function questionRows(files: CompetencyFile[], holdout: ReadonlySet<string>): QuestionRow[] {
  const rows: QuestionRow[] = [];
  for (const file of files) {
    for (const item of file.items) {
      assertWellFormed(item);
      rows.push({
        id: item.id,
        conceptId: item.concept_id,
        competency: file.competency,
        domain: domainOf(item.id),
        pool: item.pool as (typeof POOLS)[number],
        type: item.type as (typeof TYPES)[number],
        difficulty: item.difficulty,
        stem: item.stem,
        isHoldout: holdout.has(item.id),
      });
    }
  }
  return rows;
}

function optionRows(files: CompetencyFile[]): OptionRow[] {
  return files.flatMap((file) =>
    file.items.flatMap((item) =>
      item.options.map((option, position) => ({
        questionId: item.id,
        ref: option.ref,
        position,
        text: option.text,
        correct: option.correct,
        why: option.why,
        provenanceKind: option.provenance?.kind ?? 'key',
        provenanceConceptId: option.provenance?.concept_id ?? null,
      })),
    ),
  );
}

/**
 * Project the whole bank into rows, or refuse.
 *
 * The holdout is taken from the pinned file and from nowhere else, and the
 * count is checked here rather than after the write, so a bank that would mark
 * the wrong number never reaches a transaction at all.
 */
export function projectBank(bank: Bank): Projection {
  const pinned = new Set(bank.holdout);
  if (pinned.size !== HOLDOUT_SIZE) {
    throw new Error(
      `data/holdout.json pins ${pinned.size} distinct id(s); the holdout is ${HOLDOUT_SIZE}.`,
    );
  }

  const questions = questionRows(bank.competencies, pinned);

  const ids = new Set(questions.map((q) => q.id));
  if (ids.size !== questions.length) throw new Error('The bank has two questions sharing an id.');

  const unknown = [...pinned].filter((id) => !ids.has(id));
  if (unknown.length > 0) {
    throw new Error(`data/holdout.json pins ${unknown.length} id(s) no question has: ${unknown.join(', ')}`);
  }

  const marked = questions.filter((q) => q.isHoldout).length;
  if (marked !== HOLDOUT_SIZE) {
    throw new Error(`Marked ${marked} holdout question(s); expected ${HOLDOUT_SIZE}.`);
  }

  const exams: ExamRow[] = bank.examIndex.exams.map((e) => {
    // The index calls this key `name`, not `id`. It is the paper's identity all
    // the same — `exam-01` … `exam-16` — and becomes the primary key.
    const number = Number(e.name.replace('exam-', ''));
    if (!Number.isInteger(number)) throw new Error(`Exam name "${e.name}" has no number in it.`);
    return { id: e.name, number, questionCount: e.items.length };
  });

  const examItems: ExamItemRow[] = bank.examIndex.exams.flatMap((e) =>
    e.items.map((item, seq) => {
      if (!ids.has(item.id)) throw new Error(`${e.name} uses ${item.id}, which is not in the bank.`);
      if (pinned.has(item.id)) {
        // The guard that matters most in this file. The builder already refuses
        // to write a paper carrying a pinned item; this refuses to seed one, so
        // a paper committed before that guard existed cannot slip through.
        throw new Error(`${e.name} uses ${item.id}, which is pinned as a holdout item.`);
      }
      return { examId: e.name, seq, questionId: item.id, correctPosition: item.position };
    }),
  );

  return { questions, options: optionRows(bank.competencies), exams, examItems };
}
