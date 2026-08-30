#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { loadDataset } from './lib/load.mjs';
import { runAllChecks } from './lib/checks.mjs';
import { checkHoldoutIntegrity } from './lib/holdout.mjs';

// The exam index carries the generated papers' text as well as their items, so
// it is read for one key only. Reading it here rather than in loadDataset keeps
// the dataset loader rooted at data/, and keeps this script a data-level gate:
// it never loads the 1,150-item bank under questions/.
async function readUnused(path) {
  let raw;
  try {
    raw = await readFile(path, 'utf8');
  } catch {
    return null;
  }
  try {
    return JSON.parse(raw).unused ?? null;
  } catch (cause) {
    throw new Error(`Malformed JSON in ${path}`, { cause });
  }
}

let dataset;
let unused;
try {
  dataset = await loadDataset('data');
  unused = await readUnused('exams/index.json');
} catch (err) {
  console.error(`ERROR  ${err.message}`);
  process.exit(1);
}

const pinned = dataset.holdout;
const findings = [
  ...runAllChecks(dataset),
  ...checkHoldoutIntegrity({ pinned, unused }),
];

const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warn');

for (const f of errors) console.error(`ERROR  [${f.check}] ${f.message}`);
for (const f of warnings) console.warn(`WARN   [${f.check}] ${f.message}`);

const pinnedCount = Array.isArray(pinned?.holdout) ? pinned.holdout.length : 0;

console.log(
  `\n${dataset.topics.length} concept(s) and ${pinnedCount} pinned holdout id(s) checked — ` +
  `${errors.length} error(s), ${warnings.length} warning(s)`
);

process.exit(errors.length > 0 ? 1 : 0);
