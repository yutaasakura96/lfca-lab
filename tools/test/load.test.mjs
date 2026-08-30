import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { cp, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { loadDataset, sourceIndex, competencyKey } from '../lib/load.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = join(here, 'fixtures');

test('loadDataset flattens topics across domain files and tags origin', async () => {
  const { topics } = await loadDataset(fixtureRoot);
  assert.equal(topics.length, 2);
  assert.equal(topics[0].id, 'linux.os.kernel');
  assert.equal(topics[0]._file, '01-linux-fundamentals.json');
});

test('loadDataset returns competencies and sources verbatim', async () => {
  const { competencies, sources } = await loadDataset(fixtureRoot);
  assert.equal(competencies.domains.length, 1);
  assert.equal(sources.sources.length, 2);
});

test('sourceIndex maps id to record', async () => {
  const { sources } = await loadDataset(fixtureRoot);
  const idx = sourceIndex(sources);
  assert.equal(idx.get('tier1-example').authority_tier, 1);
  assert.equal(idx.size, 2);
});

test('competencyKey joins domain and competency unambiguously', () => {
  assert.equal(competencyKey('Linux Fundamentals', 'Command Line'),
               'Linux Fundamentals::Command Line');
});

test('loadDataset tolerates an absent holdout file', async () => {
  const { holdout } = await loadDataset(fixtureRoot);
  assert.equal(holdout, null);
});

test('loadDataset exposes the pinned holdout when the file is there', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lfca-holdout-'));
  await cp(fixtureRoot, root, { recursive: true });
  await writeFile(join(root, 'holdout.json'),
    JSON.stringify({ note: 'test', pinned_at: '2026-08-30', holdout: ['q.a.b.c.01'] }), 'utf8');

  const { holdout } = await loadDataset(root);
  assert.deepEqual(holdout.holdout, ['q.a.b.c.01']);
  await rm(root, { recursive: true, force: true });
});

test('a malformed holdout file is a readable error, not a swallowed absence', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lfca-holdout-'));
  await cp(fixtureRoot, root, { recursive: true });
  await writeFile(join(root, 'holdout.json'), '{ not json', 'utf8');

  await assert.rejects(() => loadDataset(root), (err) => {
    assert.match(err.message, /Malformed JSON/);
    assert.match(err.message, /holdout\.json/);
    return true;
  });
  await rm(root, { recursive: true, force: true });
});
