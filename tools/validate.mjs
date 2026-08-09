#!/usr/bin/env node
import { loadDataset } from './lib/load.mjs';
import { runAllChecks } from './lib/checks.mjs';

const dataset = await loadDataset('data');
const findings = runAllChecks(dataset);

const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warn');

for (const f of errors) console.error(`ERROR  [${f.check}] ${f.message}`);
for (const f of warnings) console.warn(`WARN   [${f.check}] ${f.message}`);

console.log(
  `\n${dataset.topics.length} concept(s) checked — ` +
  `${errors.length} error(s), ${warnings.length} warning(s)`
);

process.exit(errors.length > 0 ? 1 : 0);
