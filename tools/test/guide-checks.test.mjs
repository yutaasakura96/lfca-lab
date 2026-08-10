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
  inScope,
  assertKnownScope,
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
  '<a id="c-fx.fixture.diagnostic"></a>',
  '### Diagnostic',
  '*id: `fx.fixture.diagnostic` · depth 4 · importance 3 · LFS200: NOT COVERED · sources: fx-source*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '**Traps** ...',
  '**What the exam may test** ...',
  '**Symptoms and diagnostic order** ...',
  '',
  '<a id="c-fx.fixture.advanced"></a>',
  '### Advanced',
  '*id: `fx.fixture.advanced` · depth 5 · importance 5 · LFS200: NOT COVERED · sources: fx-source*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '**Traps** ...',
  '**What the exam may test** ...',
  '**Symptoms and diagnostic order** ...',
  '**Syntax worth memorising** ...',
  '',
  '#### Quick reference',
  '',
  '| Concept | Term | In one sentence | Why it is examinable |',
  '| --- | --- | --- | --- |',
  '| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |',
  '| `fx.fixture.other` | Other | A concept from a different competency. | It anchors the scope tests. |',
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

test('a section with definitions but no Scenario is an error', () => {
  const text = COMPLETE.replace('#### Scenario', '#### Setup');
  const found = checkSectionApparatus(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /Scenario/);
});

test('a definition anchored outside any section is an error', () => {
  const text = [
    '# Fixture Competency',
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
  ].join('\n');
  const found = checkSectionApparatus(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /fx\.fixture\.shallow/);
  assert.match(found[0].message, /outside any section/);
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

test('a depth 4 concept missing Symptoms and diagnostic order is an error', () => {
  // Non-global replace hits the first occurrence only, which is Diagnostic's
  // (it appears before Advanced's identical line in file order).
  const text = COMPLETE.replace('**Symptoms and diagnostic order** ...\n', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.diagnostic');
  assert.match(found[0].message, /Symptoms and diagnostic order/);
});

test('a depth 5 concept missing Syntax worth memorising is an error', () => {
  const text = COMPLETE.replace('**Syntax worth memorising** ...', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.advanced');
  assert.match(found[0].message, /Syntax worth memorising/);
});

test('a concept with commands in data/ but no Commands section is an error', () => {
  const text = COMPLETE.replace('**Commands**', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.deep');
  assert.match(found[0].message, /Commands/);
});

test('a depth 1 concept stubbed as a topic instead of a glossary row is an error', () => {
  const text = [
    '# Fixture Competency',
    '',
    '<a id="s-fixture-competency-section-one"></a>',
    '## Section One',
    '',
    '<a id="c-fx.fixture.tiny"></a>',
    '### Tiny',
    '*id: `fx.fixture.tiny` · depth 1 · importance 1 · LFS200: NOT COVERED · sources: fx-source*',
    '',
    '**What it is** ...',
    '',
    '#### Scenario',
    '',
    'Something happens.',
    '',
    '#### Knowledge check',
    '',
    '1. Question.',
    '',
  ].join('\n');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.tiny');
  assert.match(found[0].message, /depth 1/);
  assert.match(found[0].message, /glossary/);
  assert.match(found[0].message, /topic/);
});

test('a depth 2+ concept stubbed as a glossary row instead of a topic is an error', () => {
  const text = COMPLETE
    .replace(
      [
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
      ].join('\n'),
      '',
    )
    .replace(
      '| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |',
      '| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |\n| `fx.fixture.deep` | Deep | A stubbed row. | It should be a topic. |',
    );
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.deep');
  assert.match(found[0].message, /depth 3/);
  assert.match(found[0].message, /glossary/);
  assert.match(found[0].message, /topic/);
});

test('a body label mentioned incidentally inside a Commands cell does not satisfy the check', () => {
  const text = COMPLETE.replace(
    '| `uname -r` | Show the running kernel release |',
    '| `uname -r` | Show the running kernel release (see **Traps** and **What the exam may test**) |',
  ).replace('**Traps** ...\n**What the exam may test** ...\n', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 2);
  assert.ok(found.every((f) => f.id === 'fx.fixture.deep'));
  assert.ok(found.some((f) => /Traps/.test(f.message)));
  assert.ok(found.some((f) => /What the exam may test/.test(f.message)));
});

test('a metadata line disagreeing with the dataset is an error', () => {
  const text = COMPLETE.replace('depth 3 · importance 4', 'depth 2 · importance 4');
  const found = checkMetadataAccuracy(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /depth/);
});

test('an importance value disagreeing with the dataset is an error', () => {
  const text = COMPLETE.replace('depth 3 · importance 4', 'depth 3 · importance 3');
  const found = checkMetadataAccuracy(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /importance/);
});

test('an LFS200 coverage value disagreeing with the dataset is an error', () => {
  const text = COMPLETE.replace(
    '*id: `fx.fixture.deep` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: fx-source*',
    '*id: `fx.fixture.deep` · depth 3 · importance 4 · LFS200: COVERED · sources: fx-source*',
  );
  const found = checkMetadataAccuracy(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /LFS200/);
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

test('a scope naming the fixture\'s actual competency still reports a genuinely missing concept', () => {
  const text = COMPLETE.replace('| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |', '');
  const found = checkMissingConcept(dataset, [parseGuideFile(GUIDE_PATH, text)], {
    scope: 'Fixture Domain :: Fixture Competency',
  });
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.tiny');
});

test('a scope naming a different real competency excludes concepts outside it', () => {
  // fx.fixture.tiny (Fixture Competency) is missing here, and fx.fixture.other
  // (Second Competency) is fully defined. A scope of "Second Competency" must
  // report neither the excluded missing concept nor a false positive for the
  // in-scope, already-defined one — proving the scope genuinely filters
  // rather than passing everything through (or nothing, per the mutation
  // this guards against: `inScope` stubbed to always return false or true).
  const text = COMPLETE.replace('| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |', '');
  const found = checkMissingConcept(dataset, [parseGuideFile(GUIDE_PATH, text)], {
    scope: 'Fixture Domain :: Second Competency',
  });
  assert.deepEqual(found, []);
});

test('inScope matches only the named competency', () => {
  const topic = { domain: 'Fixture Domain', competency: 'Fixture Competency' };
  assert.equal(inScope(topic, { scope: 'Fixture Domain :: Fixture Competency' }), true);
  assert.equal(inScope(topic, { scope: 'Fixture Domain :: Second Competency' }), false);
  assert.equal(inScope(topic, {}), true);
});

test('assertKnownScope throws on a scope naming an unknown competency', () => {
  assert.throws(
    () => assertKnownScope(dataset, { scope: 'Other Domain :: Other Competency' }),
    /Unknown scope "Other Domain :: Other Competency"/,
  );
  try {
    assertKnownScope(dataset, { scope: 'Other Domain :: Other Competency' });
  } catch (err) {
    assert.match(err.message, /Fixture Domain :: Fixture Competency/);
    assert.match(err.message, /Fixture Domain :: Second Competency/);
  }
});

test('assertKnownScope does not throw for a known scope or no scope', () => {
  assert.doesNotThrow(() => assertKnownScope(dataset, { scope: 'Fixture Domain :: Fixture Competency' }));
  assert.doesNotThrow(() => assertKnownScope(dataset, { scope: 'Fixture Domain :: Second Competency' }));
  assert.doesNotThrow(() => assertKnownScope(dataset, {}));
  assert.doesNotThrow(() => assertKnownScope(dataset, undefined));
});
