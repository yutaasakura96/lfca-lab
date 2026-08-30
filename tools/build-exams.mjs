#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { posix } from 'node:path';
import { loadDataset } from './lib/load.mjs';
import { loadGuide } from './lib/guide-parse.mjs';
import { loadBank } from './lib/question-load.mjs';
import { bankContext } from './lib/question-checks.mjs';
import { buildAll } from './lib/assemble.mjs';
import { checkHoldoutIntegrity } from './lib/holdout.mjs';

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--')) {
    console.error(`ERROR  unrecognized argument: ${arg}`);
    process.exit(1);
  }
}

let dataset;
let bank;
let guide;
try {
  dataset = await loadDataset('data');
  bank = await loadBank('questions');
  guide = await loadGuide('study-guide');
} catch (err) {
  // A pinned holdout file that will not parse stops the builder here, before
  // anything is composed and long before anything is written. Absence is
  // handled below, by the same check the validator uses.
  console.error(`ERROR  ${err.message}`);
  process.exit(1);
}
const ctx = bankContext({ dataset, bank, guide });

let built;
try {
  built = buildAll(ctx);
} catch (err) {
  console.error(`ERROR  ${err.message}`);
  process.exit(1);
}

// The guard, and it sits here for a reason: the composition above is computed
// exactly as it always was, and nothing below this block has run yet. A rebuild
// that would move a pinned holdout item onto a paper is refused with every
// generated file still as it was, rather than detected at the next
// `npm run validate` with sixty-three overwritten files to unpick.
//
// The comparison is `checkHoldoutIntegrity` — the same function the validator
// calls, so the builder and the validator cannot hold a second opinion about
// what a violation is. The allocation is deliberately not taught to build
// around the pin; that would mean editing the most load-bearing code in the
// repo to defend against an event this refusal already prevents.
const holdoutFindings = checkHoldoutIntegrity({ pinned: dataset.holdout, unused: built.unused });
if (holdoutFindings.length > 0) {
  for (const f of holdoutFindings) console.error(`ERROR  [${f.check}] ${f.message}`);
  console.error(
    '\nRefusing to write. No exam paper, drill, or index file was changed.\n'
    + 'Either the composition moved a pinned holdout item onto a paper — in which case the '
    + 'composition is the thing to fix — or data/holdout.json was edited. Never rewrite the pin '
    + 'to match a build.'
  );
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
