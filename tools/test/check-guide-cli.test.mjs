import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// GAP D: the summary line used to read "32 guide file(s), 537 concept(s)",
// which overstated the run in both halves. Ten of those files carry no
// definition, no comparison and no section apparatus, and no check looks
// inside them; and the concept count was the dataset's size — the population
// the run is measured against — not a count of anything the run verified.
// The line now reports the three units every check actually consumes.
//
// This drives the real CLI rather than a helper, because the summary line is
// the CLI's only output when a run is clean and there is nothing else to
// assert against. The corpus is written by a different task and may be
// mid-edit, so nothing here depends on the run being clean or on any
// particular count: only on the shape of what is reported.

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');

function runCheckGuide() {
  const result = spawnSync(process.execPath, ['tools/check-guide.mjs'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  assert.equal(result.error, undefined, 'check-guide must be runnable');
  return result.stdout;
}

test('GAP D: check-guide summarises what it verified, not how many files exist on disk', () => {
  const stdout = runCheckGuide();
  const m = /(\d+) concept definition\(s\), (\d+) comparison block\(s\), (\d+) section\(s\) checked/.exec(stdout);
  assert.ok(m, `summary line not found in output:\n${stdout}`);
  const [definitions, comparisons, sections] = m.slice(1).map(Number);
  assert.ok(definitions > 0, 'definition sites checked must be reported and non-zero');
  assert.ok(comparisons > 0, 'comparison blocks checked must be reported and non-zero');
  assert.ok(sections > 0, 'sections checked must be reported and non-zero');
});

test('GAP D: the summary no longer reports a guide-file count that no check inspects', () => {
  const stdout = runCheckGuide();
  assert.doesNotMatch(stdout, /guide file\(s\)/, 'the file count overstated what was verified');
});

test('GAP D: the summary still reports the error and warning tallies', () => {
  const stdout = runCheckGuide();
  assert.match(stdout, /— \d+ error\(s\), \d+ warning\(s\)/);
});
