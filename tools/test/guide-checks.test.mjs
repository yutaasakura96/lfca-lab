import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadDataset } from '../lib/load.mjs';
import { parseGuideFile } from '../lib/guide-parse.mjs';
import {
  checkMissingConcept,
  checkDuplicateDefinition,
  checkUnknownConcept,
  checkSectionApparatus,
  checkDepthTreatment,
  checkMetadataAccuracy,
  checkSourceIds,
} from '../lib/guide-checks.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = join(here, 'fixtures', 'guide');
const GUIDE_PATH = 'study-guide/01-fixture-domain/fixture-competency.md';

const dataset = await loadDataset(fixtureRoot);

const COMPLETE = [
  '# Fixture Competency',
  '',
  '<a id="s-fixture-competency-section-one"></a>',
  '## Section One',
  '',
  '<a id="c-fx.fixture.deep"></a>',
  '### Deep',
  '*id: `fx.fixture.deep` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: fx-source*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '**Commands**',
  '',
  '| Command | Purpose |',
  '| --- | --- |',
  '| `uname -r` | Show the running kernel release |',
  '',
  '**Traps** ...',
  '**What the exam may test** ...',
  '',
  '<a id="c-fx.fixture.shallow"></a>',
  '### Shallow',
  '*id: `fx.fixture.shallow` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: fx-source*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '',
  '<a id="c-fx.fixture.waived"></a>',
  '### Waived',
  '*id: `fx.fixture.waived` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '',
  '#### Quick reference',
  '',
  '| Concept | Term | In one sentence | Why it is examinable |',
  '| --- | --- | --- | --- |',
  '| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |',
  '',
  '#### Scenario',
  '',
  'Something happens.',
  '',
  '#### Knowledge check',
  '',
  '1. State the difference between Deep and Shallow.',
  '',
].join('\n');

const complete = () => [parseGuideFile(GUIDE_PATH, COMPLETE)];

test('a complete guide reports no structural findings', () => {
  const files = complete();
  for (const check of [
    checkMissingConcept,
    checkDuplicateDefinition,
    checkUnknownConcept,
    checkSectionApparatus,
    checkDepthTreatment,
    checkMetadataAccuracy,
    checkSourceIds,
  ]) {
    assert.deepEqual(check(dataset, files, {}), [], `${check.name} produced findings`);
  }
});

test('a concept with no definition site anywhere is an error', () => {
  const text = COMPLETE.replace('| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |', '');
  const found = checkMissingConcept(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.tiny');
  assert.equal(found[0].severity, 'error');
});

test('a concept defined twice is an error', () => {
  const files = [parseGuideFile(GUIDE_PATH, COMPLETE), parseGuideFile('study-guide/other.md', COMPLETE)];
  const found = checkDuplicateDefinition(dataset, files, {});
  assert.ok(found.length >= 1);
  assert.equal(found[0].severity, 'error');
});

test('a definition site naming an unknown id is an error', () => {
  const text = COMPLETE.replace(/fx\.fixture\.shallow/g, 'fx.fixture.ghost');
  const found = checkUnknownConcept(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /fx\.fixture\.ghost/);
});

test('a section with definitions but no knowledge check is an error', () => {
  const text = COMPLETE.replace('#### Knowledge check', '#### Notes');
  const found = checkSectionApparatus(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /Knowledge check/);
});

test('a depth 3 concept missing Traps is an error', () => {
  const text = COMPLETE.replace('**Traps** ...', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /Traps/);
});

test('a depth 2 concept is not required to carry Traps', () => {
  const found = checkDepthTreatment(dataset, complete(), {});
  assert.deepEqual(found, []);
});

test('a metadata line disagreeing with the dataset is an error', () => {
  const text = COMPLETE.replace('depth 3 · importance 4', 'depth 2 · importance 4');
  const found = checkMetadataAccuracy(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /depth/);
});

test('a metadata line citing an unregistered source is an error', () => {
  const text = COMPLETE.replace('sources: fx-source*', 'sources: fx-ghost*');
  const found = checkSourceIds(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.ok(found.length >= 1);
  assert.match(found[0].message, /fx-ghost/);
});

test('scope restricts missing-concept reporting to one competency', () => {
  const found = checkMissingConcept(dataset, [], { scope: 'Other Domain :: Other Competency' });
  assert.deepEqual(found, []);
});
