import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { cp, mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');
const builder = join(repo, 'tools', 'build-exams.mjs');

// The builder writes to paths relative to the working directory, so it is run
// against a scratch copy of the repo rather than the repo itself. That is the
// only way to assert "nothing was written" without a failing test rewriting the
// sixteen papers: if the guard is ever removed, the damage lands in a temp
// directory this file deletes.
//
// `data/` is copied because each test drifts it; `questions/` and `study-guide/`
// are symlinked because they are read-only here and large.
async function workspace() {
  const root = await mkdtemp(join(tmpdir(), 'lfca-build-exams-'));
  await cp(join(repo, 'data'), join(root, 'data'), { recursive: true });
  await symlink(join(repo, 'questions'), join(root, 'questions'));
  await symlink(join(repo, 'study-guide'), join(root, 'study-guide'));
  return root;
}

async function build(cwd) {
  try {
    const { stdout, stderr } = await run('node', [builder], { cwd });
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

// The builder's only outputs are exams/ and drills/. Neither exists in a fresh
// workspace, so "the guard wrote nothing" is the assertion that neither appeared.
async function generatedDirsIn(root) {
  const entries = await readdir(root);
  return entries.filter((e) => e === 'exams' || e === 'drills');
}

// Walked by hand rather than with a recursive readdir: drills nest one level
// under by-competency/, and this file should not carry a Node version floor of
// its own.
async function filesUnder(root, dir) {
  const out = [];
  for (const entry of await readdir(join(root, dir), { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await filesUnder(root, path));
    else if (entry.isFile()) out.push(path);
  }
  return out.sort();
}

test('a drifted pin stops the builder before it writes anything', async (t) => {
  const root = await workspace();
  t.after(() => rm(root, { recursive: true, force: true }));

  const pinPath = join(root, 'data', 'holdout.json');
  const pinned = JSON.parse(await readFile(pinPath, 'utf8'));
  const dropped = pinned.holdout[0];
  const invented = 'q.linux.command-line.not-a-real-question.99';
  pinned.holdout = [invented, ...pinned.holdout.slice(1)];
  await writeFile(pinPath, `${JSON.stringify(pinned, null, 2)}\n`, 'utf8');

  const r = await build(root);

  assert.equal(r.code, 1, `expected a refusal, got:\n${r.stdout}${r.stderr}`);
  // Both directions, both ids: which pinned item a paper now uses, and which
  // unused item stopped being pinned.
  assert.match(r.stderr, new RegExp(invented.replace(/\./g, '\\.')));
  assert.match(r.stderr, new RegExp(dropped.replace(/\./g, '\\.')));
  assert.deepEqual(await generatedDirsIn(root), [],
    'the builder wrote generated files despite refusing');
});

test('an absent pin stops the builder rather than reading as agreement', async (t) => {
  const root = await workspace();
  t.after(() => rm(root, { recursive: true, force: true }));
  await rm(join(root, 'data', 'holdout.json'));

  const r = await build(root);

  assert.equal(r.code, 1, `expected a refusal, got:\n${r.stdout}${r.stderr}`);
  assert.match(r.stderr, /not pinned/i);
  assert.deepEqual(await generatedDirsIn(root), []);
});

test('a malformed pin stops the builder rather than reading as agreement', async (t) => {
  const root = await workspace();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, 'data', 'holdout.json'), '{ not json', 'utf8');

  const r = await build(root);

  assert.equal(r.code, 1, `expected a refusal, got:\n${r.stdout}${r.stderr}`);
  assert.match(r.stderr, /holdout\.json/);
  assert.deepEqual(await generatedDirsIn(root), []);
});

test('a pin that agrees builds the committed papers byte for byte', async (t) => {
  // The guard's other half: it must be invisible when the holdout is intact.
  // Compared against the generated files already committed, so a change that
  // perturbed the composition would fail here rather than at the next review.
  const root = await workspace();
  t.after(() => rm(root, { recursive: true, force: true }));

  const r = await build(root);
  assert.equal(r.code, 0, `expected a build, got:\n${r.stdout}${r.stderr}`);

  // 61 documents plus the two index files. Asserted exactly, so a build that
  // quietly produced fewer cannot pass by comparing a short list to itself.
  const built = [...await filesUnder(root, 'exams'), ...await filesUnder(root, 'drills')].sort();
  assert.equal(built.length, 63, `expected 63 generated files, got ${built.length}`);
  for (const file of built) {
    assert.equal(await readFile(join(root, file), 'utf8'), await readFile(join(repo, file), 'utf8'),
      `${file} differs from the committed copy`);
  }
});
