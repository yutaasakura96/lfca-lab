#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { loadDataset } from './lib/load.mjs';
import { loadGuide } from './lib/guide-parse.mjs';
import { loadBank } from './lib/question-load.mjs';
import { bankContext, runAllQuestionChecks } from './lib/question-checks.mjs';

const args = process.argv.slice(2);
const KNOWN = ['--scope', '--only', '--except'];

function valueOf(flag) {
  const at = args.indexOf(flag);
  if (at < 0) return undefined;
  const value = args[at + 1];
  if (value === undefined || value.startsWith('--')) {
    console.error(`ERROR  ${flag} requires a value`);
    process.exit(1);
  }
  return value;
}

for (const arg of args) {
  if (arg.startsWith('--') && !KNOWN.includes(arg)) {
    console.error(`ERROR  unrecognized argument: ${arg}`);
    process.exit(1);
  }
}

const scope = valueOf('--scope');
const only = valueOf('--only')?.split(',').map((s) => s.trim()).filter(Boolean);
const except = valueOf('--except')?.split(',').map((s) => s.trim()).filter(Boolean);

// A filter is an accidental-pass path unless it is bounded and visible. It is
// bounded by requiring --scope: the unscoped run — the one the definition of
// done names — cannot suppress anything. It is visible by the banner below
// and by the summary line, so a suppressed run can never be mistaken for a
// clean one in a log somebody skims later.
if ((only || except) && !scope) {
  const flag = only && except ? '--only and --except' : only ? '--only' : '--except';
  console.error(`ERROR  ${flag} requires --scope; the unscoped run cannot suppress a check`);
  process.exit(1);
}

async function readIndex(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
}

const dataset = await loadDataset('data');
const bank = await loadBank('questions');
const guide = await loadGuide('study-guide');
const examIndex = await readIndex('exams/index.json');
const drillIndex = await readIndex('drills/index.json');
const generated = examIndex || drillIndex
  ? {
      exams: examIndex?.exams ?? [],
      drills: drillIndex?.drills ?? [],
      documents: [...(examIndex?.documents ?? []), ...(drillIndex?.documents ?? [])],
    }
  : null;

const ctx = bankContext({ dataset, bank, guide, generated });

let findings;
try {
  findings = runAllQuestionChecks(ctx, { scope, only, except });
} catch (err) {
  console.error(`ERROR  ${err.message}`);
  process.exit(1);
}

const suppressed = [
  ...(only ? [`only=${only.join(',')}`] : []),
  ...(except ? [`except=${except.join(',')}`] : []),
];
if (suppressed.length > 0) {
  console.error('');
  console.error('  ############################################################');
  console.error('  #  SUPPRESSED RUN — this is not a clean bill of health.    #');
  console.error(`  #  ${suppressed.join('  ').padEnd(56)}#`);
  console.error('  #  Only the unscoped run with no filters counts.           #');
  console.error('  ############################################################');
  console.error('');
}

const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warn');
for (const f of errors) console.error(`ERROR  [${f.check}] ${f.message}`);
for (const f of warnings) console.warn(`WARN   [${f.check}] ${f.message}`);

const inspected = ctx.items.filter((i) => {
  if (!scope) return true;
  const t = ctx.topicIndex.get(i.concept_id);
  return t && `${t.domain}::${t.competency}` === scope.replace(' :: ', '::');
});
const conceptsInspected = new Set(inspected.map((i) => i.concept_id)).size;
const generatedNote = generated
  ? `${generated.exams.length} exam(s), ${generated.drills.length} drill(s)`
  : 'no generated output';

console.log('');
console.log(
  `${inspected.length} question(s) over ${conceptsInspected} concept(s), ${generatedNote} — `
  + `${errors.length} error(s), ${warnings.length} warning(s)`
  + (suppressed.length ? ` — SUPPRESSED: ${suppressed.join(' ')}` : ''),
);

process.exit(errors.length > 0 ? 1 : 0);
