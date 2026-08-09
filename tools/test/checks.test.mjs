import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadDataset } from '../lib/load.mjs';
import {
  runAllChecks,
  checkDuplicateIds,
  checkMissingSources,
  checkOnlyTier4Sources,
  checkMissingDepth,
  checkMissingVerbatim,
  checkEmptyCompetencies,
  checkDanglingSourceRefs,
  checkOrphanSources,
  checkUnknownCurrency,
  checkInferredRatio,
} from '../lib/checks.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = join(here, 'fixtures');

async function dataset() {
  return loadDataset(fixtureRoot);
}

function withTopics(base, topics) {
  return { ...base, topics };
}

test('clean fixture produces no error findings', async () => {
  const d = await dataset();
  const errors = runAllChecks(d).filter((f) => f.severity === 'error');
  assert.deepEqual(errors, []);
});

test('duplicate ids are an error', async () => {
  const d = await dataset();
  const dup = withTopics(d, [d.topics[0], { ...d.topics[0] }]);
  const findings = checkDuplicateIds(dup);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'error');
  assert.match(findings[0].message, /linux\.os\.kernel/);
});

test('a concept with no sources at all is an error', async () => {
  const d = await dataset();
  const bare = withTopics(d, [{
    ...d.topics[0],
    official_sources: [], additional_sources: [], lfs200_sources: [], candidate_evidence: [],
  }]);
  assert.equal(checkMissingSources(bare).length, 1);
});

test('a concept supported only by tier 4 is an error', async () => {
  const d = await dataset();
  const weak = withTopics(d, [{
    ...d.topics[0],
    official_sources: [], additional_sources: [], candidate_evidence: ['tier4-example'],
  }]);
  const findings = checkOnlyTier4Sources(weak);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /tier 1 or tier 2/);
});

test('missing depth is an error', async () => {
  const d = await dataset();
  const noDepth = withTopics(d, [{ ...d.topics[0], required_depth: null }]);
  assert.equal(checkMissingDepth(noDepth).length, 1);
});

test('depth outside 1..5 is an error', async () => {
  const d = await dataset();
  const badDepth = withTopics(d, [{ ...d.topics[0], required_depth: 7 }]);
  assert.equal(checkMissingDepth(badDepth).length, 1);
});

test('missing objective_verbatim is an error', async () => {
  const d = await dataset();
  const noVerbatim = withTopics(d, [{ ...d.topics[0], objective_verbatim: '' }]);
  assert.equal(checkMissingVerbatim(noVerbatim).length, 1);
});

test('a competency with zero concepts is an error naming the competency', async () => {
  const d = await dataset();
  const onlyKernel = withTopics(d, [d.topics[0]]);
  const findings = checkEmptyCompetencies(onlyKernel);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /Command Line/);
});

test('a source id cited but absent from the registry is an error', async () => {
  const d = await dataset();
  const dangling = withTopics(d, [{ ...d.topics[0], additional_sources: ['does-not-exist'] }]);
  const findings = checkDanglingSourceRefs(dangling);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /does-not-exist/);
});

test('a registry source cited by nothing is a warning, not an error', async () => {
  const d = await dataset();
  const onlyKernel = withTopics(d, [d.topics[0]]);
  const findings = checkOrphanSources(onlyKernel);
  assert.ok(findings.some((f) => f.message.includes('tier4-example')));
  assert.ok(findings.every((f) => f.severity === 'warn'));
});

test('unknown currency status is a warning carrying the count', async () => {
  const d = await dataset();
  const unknown = withTopics(d, [{ ...d.topics[0], sept_2025_status: 'unknown' }]);
  const findings = checkUnknownCurrency(unknown);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'warn');
});

test('inferred ratio above threshold warns per domain', async () => {
  const d = await dataset();
  const allInferred = withTopics(d, d.topics.map((t) => ({ ...t, inferred: true })));
  const findings = checkInferredRatio(allInferred, { inferredWarnRatio: 0.6 });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /Linux Fundamentals/);
});

test('inferred ratio below threshold produces nothing', async () => {
  const d = await dataset();
  const noneInferred = withTopics(d, d.topics.map((t) => ({ ...t, inferred: false })));
  assert.deepEqual(checkInferredRatio(noneInferred, { inferredWarnRatio: 0.6 }), []);
});
