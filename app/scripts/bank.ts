// Reading the bank off disk.
//
// The only place in the app that opens `questions/`, `exams/` and `data/`. It
// takes the bank's root as an argument and holds no opinion about where that
// is, which is what lets the seed run identically from a laptop, from CI, or
// from anywhere else that has the repository and a connection string.
//
// Lives under `scripts/` rather than `src/` deliberately: the shipped app never
// reads this JSON. Content reaches it through the seed and the database, and a
// test asserts that nothing under `src/` can reach these directories.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The repository root, one level above `app/`. The default bank location. */
export const defaultBankRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

export interface BankOption {
  ref: string;
  text: string;
  correct: boolean;
  why: string;
  provenance?: { kind?: string; concept_id?: string };
}

export interface BankItem {
  id: string;
  concept_id: string;
  pool: string;
  type: string;
  difficulty: number;
  stem: string;
  options: BankOption[];
}

export interface CompetencyFile {
  competency: string;
  items: BankItem[];
}

export interface ExamIndex {
  exams: { name: string; items: { id: string; position: number }[] }[];
  unused: string[];
}

export interface Bank {
  competencies: CompetencyFile[];
  examIndex: ExamIndex;
  /** The pinned holdout — the commitment, never `examIndex.unused`, which is a residue. */
  holdout: string[];
}

function jsonFilesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...jsonFilesUnder(path));
    else if (entry.isFile() && path.endsWith('.json')) out.push(path);
  }
  return out.sort();
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

export function loadBank(root: string = defaultBankRoot): Bank {
  const competencies = jsonFilesUnder(join(root, 'questions')).map((p) =>
    readJson<CompetencyFile>(p),
  );
  const examIndex = readJson<ExamIndex>(join(root, 'exams', 'index.json'));
  const pinned = readJson<{ holdout: unknown }>(join(root, 'data', 'holdout.json'));

  if (!Array.isArray(pinned.holdout) || !pinned.holdout.every((id) => typeof id === 'string')) {
    // Absent or malformed is not "no holdout". It is a reason to stop.
    throw new Error(
      'data/holdout.json is missing or malformed: expected an object with a "holdout" array of ids.',
    );
  }

  return { competencies, examIndex, holdout: pinned.holdout as string[] };
}
