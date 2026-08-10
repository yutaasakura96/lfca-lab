#!/usr/bin/env node
import { loadDataset } from './lib/load.mjs';
import { loadGuide } from './lib/guide-parse.mjs';
import { runAllGuideChecks } from './lib/guide-checks.mjs';

const args = process.argv.slice(2);
const scopeAt = args.indexOf('--scope');
const scope = scopeAt >= 0 ? args[scopeAt + 1] : undefined;

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

console.log(
  `\n${files.length} guide file(s), ${dataset.topics.length} concept(s)` +
  `${scope ? `, scope ${scope}` : ''} — ` +
  `${errors.length + malformed} error(s), ${warnings.length} warning(s)`,
);

process.exit(errors.length + malformed > 0 ? 1 : 0);
