import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
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
