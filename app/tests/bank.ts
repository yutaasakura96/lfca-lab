// Reading the bank, for tests only.
//
// This file lives under tests/ and not under src/ on purpose. The shipped app
// never reads the bank's JSON — content reaches it through the seed and the
// database, and `domain-purity.test.ts` asserts that no module under src/ can
// reach these directories. The assertions in `bank-integrity.test.ts` are the
// exception the rule is written around: they are *about* the JSON, so they have
// to open it.
//
// Deliberately untyped beyond what the assertions need. A full schema for a
// question belongs at the seed's boundary, where a malformed item must be
// rejected before it reaches Postgres. Here, a missing field should surface as
// a failing assertion naming the field, not as a parse error naming a line.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));

/** The repo root — the bank's home, one level above `app/`. */
export const repoRoot = join(here, '..', '..');

export interface BankOption {
  ref: string;
  text: string;
  correct: boolean;
  why: string;
  provenance?: { kind: string; concept_id?: string };
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

/** Every competency file under `questions/`, in a stable order. */
export function loadCompetencies(): CompetencyFile[] {
  return jsonFilesUnder(join(repoRoot, 'questions')).map((p) => readJson<CompetencyFile>(p));
}

/** Every item in the bank, flattened. */
export function loadItems(): BankItem[] {
  return loadCompetencies().flatMap((file) => file.items);
}

export interface ExamIndex {
  exams: { name: string; items: { id: string; position: number }[] }[];
  unused: string[];
}

export function loadExamIndex(): ExamIndex {
  return readJson<ExamIndex>(join(repoRoot, 'exams', 'index.json'));
}

export function loadPinnedHoldout(): { holdout: string[] } {
  return readJson<{ holdout: string[] }>(join(repoRoot, 'data', 'holdout.json'));
}
