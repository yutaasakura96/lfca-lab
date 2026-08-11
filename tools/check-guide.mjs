#!/usr/bin/env node
import { loadDataset } from './lib/load.mjs';
import { loadGuide } from './lib/guide-parse.mjs';
import { runAllGuideChecks } from './lib/guide-checks.mjs';

const args = process.argv.slice(2);
const scopeAt = args.indexOf('--scope');
let scope;

// Validate --scope argument
if (scopeAt >= 0) {
  if (scopeAt + 1 >= args.length) {
    console.error('ERROR  --scope requires a value');
    process.exit(1);
  }
  scope = args[scopeAt + 1];
  if (scope.startsWith('--')) {
    console.error('ERROR  --scope requires a value');
    process.exit(1);
  }
}

// Detect unrecognized arguments
for (const arg of args) {
  if (arg.startsWith('--') && arg !== '--scope') {
    console.error(`ERROR  unrecognized argument: ${arg}`);
    process.exit(1);
  }
}

const dataset = await loadDataset('data');
const files = await loadGuide('study-guide');

// `runAllGuideChecks` calls `assertKnownScope` before running any check, and
// that throws when `--scope` names a competency absent from the dataset. A
// scoped run over a typo'd or renamed competency would otherwise match zero
// concepts and report zero errors — a green light that means nothing. So
// this must fail loudly here: a readable message on stderr and a non-zero
// exit, not a raw stack trace.
let findings;
try {
  findings = runAllGuideChecks(dataset, files, { scope });
} catch (err) {
  console.error(`ERROR  ${err.message}`);
  process.exit(1);
}

for (const f of files) {
  for (const m of f.malformed) console.error(`ERROR  [guide-malformed] ${f.path}:${m.line} ${m.reason}`);
}
const malformed = files.reduce((n, f) => n + f.malformed.length, 0);

const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warn');

for (const f of errors) console.error(`ERROR  [${f.check}] ${f.message}`);
for (const f of warnings) console.warn(`WARN   [${f.check}] ${f.message}`);

// Report what was actually inspected, not what merely exists on disk.
// "32 guide file(s), 537 concept(s)" overstated the run twice over: 10 of
// those files carry no definition, comparison or section apparatus and no
// check looks inside them, and the concept count was the dataset's size —
// the population the run is measured against — not a count of anything this
// run verified. Definition sites, comparison blocks and sections are the
// three units every check above actually consumes, so those are the counts
// worth printing: if one of them falls, the run covered less than it did
// before, and the summary line says so.
const definitions = files.reduce((n, f) => n + f.definitions.length, 0);
const comparisons = files.reduce((n, f) => n + f.comparisons.length, 0);
const sections = files.reduce((n, f) => n + f.sections.length, 0);

console.log(
  `\n${definitions} concept definition(s), ${comparisons} comparison block(s), ` +
  `${sections} section(s) checked` +
  `${scope ? `, scope ${scope}` : ''} — ` +
  `${errors.length + malformed} error(s), ${warnings.length} warning(s)`,
);

process.exit(errors.length + malformed > 0 ? 1 : 0);
