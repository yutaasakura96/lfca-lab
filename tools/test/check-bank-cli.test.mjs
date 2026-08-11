import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

async function cli(args) {
  try {
    const { stdout, stderr } = await run('node', ['tools/check-bank.mjs', ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

test('an unknown argument is rejected', async () => {
  const r = await cli(['--nope']);
  assert.notEqual(r.code, 0);
  assert.match(r.stderr, /unrecognized argument/);
});

test('--scope with no value is rejected', async () => {
  const r = await cli(['--scope']);
  assert.notEqual(r.code, 0);
  assert.match(r.stderr, /requires a value/);
});

test('an unknown scope is rejected with the valid list', async () => {
  const r = await cli(['--scope', 'Nope :: Nothing']);
  assert.notEqual(r.code, 0);
  assert.match(r.stderr, /Unknown scope/);
});

test('--except without --scope is refused', async () => {
  const r = await cli(['--except', 'q-verdict-coverage']);
  assert.notEqual(r.code, 0);
  assert.match(r.stderr, /--except requires --scope/);
});

test('a suppressed run says so loudly on stderr and in the summary', async () => {
  const r = await cli(['--scope', 'DevOps Fundamentals :: Git Concepts', '--except', 'q-verdict-coverage']);
  assert.match(r.stderr + r.stdout, /SUPPRESSED/);
  assert.match(r.stderr + r.stdout, /q-verdict-coverage/);
});

test('the summary reports what was inspected, not what exists on disk', async () => {
  const r = await cli([]);
  assert.match(r.stdout, /question\(s\)/);
  assert.match(r.stdout, /error\(s\)/);
});
