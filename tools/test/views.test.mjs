import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadDataset } from '../lib/load.mjs';
import {
  renderObjectives, renderLfs200Map, renderGapAnalysis,
  renderCandidateExperience, renderSources, renderCoverageMatrix,
} from '../lib/views.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = join(here, 'fixtures');

const renderers = {
  renderObjectives, renderLfs200Map, renderGapAnalysis,
  renderCandidateExperience, renderSources, renderCoverageMatrix,
};

test('every renderer emits a do-not-edit banner', async () => {
  const d = await loadDataset(fixtureRoot);
  for (const [name, fn] of Object.entries(renderers)) {
    assert.match(fn(d), /Generated file — do not edit/, `${name} missing banner`);
  }
});

test('objectives view lists domains with weights and competencies', async () => {
  const d = await loadDataset(fixtureRoot);
  const md = renderObjectives(d);
  assert.match(md, /Linux Fundamentals/);
  assert.match(md, /16%/);
  assert.match(md, /Linux Operating System/);
  assert.match(md, /Command Line/);
});

test('objectives view surfaces the 2025 weight shift and change set', async () => {
  const d = await loadDataset(fixtureRoot);
  const md = renderObjectives(d);
  assert.match(md, /was 20%/);
  assert.match(md, /added/);
  assert.match(md, /Removed in 2025.*System Commands/);
});

test('gap analysis includes uncovered concepts and excludes covered ones', async () => {
  const d = await loadDataset(fixtureRoot);
  const md = renderGapAnalysis(d);
  assert.match(md, /linux\.cli\.pipes/);
  assert.doesNotMatch(md, /linux\.os\.kernel/);
});

test('lfs200 map shows covered concepts with their lesson refs', async () => {
  const d = await loadDataset(fixtureRoot);
  const md = renderLfs200Map(d);
  assert.match(md, /linux\.os\.kernel/);
  assert.match(md, /ch2\.l1/);
});

test('candidate experience view separates anecdotal evidence', async () => {
  const d = await loadDataset(fixtureRoot);
  const md = renderCandidateExperience(d);
  assert.match(md, /anecdotal/i);
  assert.match(md, /linux\.cli\.pipes/);
});

test('sources view renders the registry with tiers', async () => {
  const d = await loadDataset(fixtureRoot);
  const md = renderSources(d);
  assert.match(md, /tier1-example/);
  assert.match(md, /https:\/\/example\.org\/official/);
});

test('coverage matrix has one row per concept plus a header', async () => {
  const d = await loadDataset(fixtureRoot);
  const rows = renderCoverageMatrix(d).split('\n').filter((l) => l.startsWith('| linux.'));
  assert.equal(rows.length, 2);
});
