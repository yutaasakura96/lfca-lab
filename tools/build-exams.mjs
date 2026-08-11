#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { posix } from 'node:path';
import { loadDataset } from './lib/load.mjs';
import { loadGuide } from './lib/guide-parse.mjs';
import { loadBank } from './lib/question-load.mjs';
import { bankContext } from './lib/question-checks.mjs';
import { buildAll } from './lib/assemble.mjs';

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--')) {
    console.error(`ERROR  unrecognized argument: ${arg}`);
    process.exit(1);
  }
}

const dataset = await loadDataset('data');
const bank = await loadBank('questions');
const guide = await loadGuide('study-guide');
const ctx = bankContext({ dataset, bank, guide });

let built;
try {
  built = buildAll(ctx);
} catch (err) {
  console.error(`ERROR  ${err.message}`);
  process.exit(1);
}

for (const doc of built.documents) {
  await mkdir(posix.dirname(doc.name), { recursive: true });
  await writeFile(doc.name, doc.text, 'utf8');
}

// The two index files are what check-bank reads back for q-answer-position-
// balance and q-question-count. They carry the document text as well as the
// positions, so the check sees exactly what was written rather than
// re-deriving it and possibly disagreeing.
await writeFile('exams/index.json', `${JSON.stringify({
  exams: built.exams,
  // The exam-pool items no paper uses. On the record by id, so "which
  // questions never appear on an exam" is a fact a reader can check rather
  // than a silent residue of the composition rounding.
  unused: built.unused,
  documents: built.documents.filter((d) => d.name.startsWith('exams/')),
}, null, 2)}\n`, 'utf8');
await writeFile('drills/index.json', `${JSON.stringify({
  drills: built.drills,
  documents: built.documents.filter((d) => d.name.startsWith('drills/')),
}, null, 2)}\n`, 'utf8');

console.log(`${built.exams.length} exam(s), ${built.drills.length} drill(s), ${built.documents.length} document(s) written`);
