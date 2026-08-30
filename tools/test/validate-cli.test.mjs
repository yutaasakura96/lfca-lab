import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const run = promisify(execFile);

async function cli(args = []) {
  try {
    const { stdout, stderr } = await run('node', ['tools/validate.mjs', ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

test('the real dataset validates clean', async () => {
  const r = await cli();
  assert.equal(r.code, 0, `validate failed:\n${r.stderr}`);
});

test('the summary names the holdout, so a green run is evidence the check ran', async () => {
  const r = await cli();
  assert.match(r.stdout, /holdout/i);
  assert.match(r.stdout, /40/);
});

test('validate does not load the question bank', async () => {
  // The cheapest gate in CI stays cheap: two small JSON files and the concept
  // dataset, never the 1,150 items under questions/. Asserted over the static
  // import graph rather than by timing, so it cannot pass by accident.
  const seen = new Set();
  const queue = ['tools/validate.mjs'];
  while (queue.length > 0) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const src = await readFile(file, 'utf8');
    for (const [, spec] of src.matchAll(/(?:from|import)\s*\(?\s*'(\.[^']+)'/g)) {
      queue.push(join(dirname(file), spec));
    }
  }
  assert.ok(seen.has('tools/lib/holdout.mjs'), 'validate should reach the holdout check');
  for (const file of seen) {
    assert.doesNotMatch(file, /question-load|question-checks/,
      `validate reaches ${file}, which loads the 1,150-item bank`);
  }
});
