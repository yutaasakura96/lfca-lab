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
  checkComparisonCoverage,
  checkComparisonMembership,
  checkComparisonPointer,
  checkCommandCoverage,
  checkWaiverMarker,
  checkDanglingXref,
  checkVendorNeutrality,
  runAllGuideChecks,
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

const WAIVER_MARKER =
  '*No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*';

// COMPLETE plus the one comparison block the fixture's confused_with graph
// requires (fx.fixture.deep owns it, fx.fixture.shallow is the member — see
// tools/test/fixtures/guide/topics/01-fixture-domain.json) and the waiver
// marker fx.fixture.waived needs. The first `.replace` targets Deep's "What
// the exam may test" line specifically: it is the first of three identical
// occurrences in COMPLETE (Deep, Diagnostic, Advanced), and `.replace`
// (non-global) always hits the first.
const FULL = COMPLETE
  .replace(
    '**What the exam may test** ...',
    [
      '**What the exam may test** ...',
      '',
      '<a id="cmp-fx.fixture.deep"></a>',
      '#### Not to be confused with: Deep vs Shallow',
      '*compares: `fx.fixture.deep`, `fx.fixture.shallow`*',
      '',
      '| Axis | Deep | Shallow |',
      '| --- | --- | --- |',
    ].join('\n'),
  )
  .replace(
    '*id: `fx.fixture.shallow` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: fx-source*',
    [
      '*id: `fx.fixture.shallow` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: fx-source*',
      '',
      '*Not to be confused with [Deep](fixture-competency.md#cmp-fx.fixture.deep).*',
    ].join('\n'),
  )
  .replace(
    '*id: `fx.fixture.waived` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
    [
      '*id: `fx.fixture.waived` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
      '',
      WAIVER_MARKER,
    ].join('\n'),
  );

const full = () => [parseGuideFile(GUIDE_PATH, FULL)];

test('a fully written fixture guide passes all fourteen checks', () => {
  const found = runAllGuideChecks(dataset, full(), {});
  assert.deepEqual(found.filter((f) => f.severity === 'error'), []);
});

test('an uncovered edge is an error', () => {
  const text = FULL.replace('<a id="cmp-fx.fixture.deep"></a>', '<a id="x-none"></a>');
  const found = checkComparisonCoverage(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /fx\.fixture\.deep/);
});

test('an edge covered by two blocks is an error', () => {
  const files = [parseGuideFile(GUIDE_PATH, FULL), parseGuideFile('study-guide/dup.md', FULL)];
  const found = checkComparisonCoverage(dataset, files, {});
  assert.ok(found.some((f) => /twice|more than once/.test(f.message)));
});

test('a compares list that does not match the computed assignment is an error', () => {
  const text = FULL.replace(
    '*compares: `fx.fixture.deep`, `fx.fixture.shallow`*',
    '*compares: `fx.fixture.deep`, `fx.fixture.tiny`*',
  );
  const found = checkComparisonMembership(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
});

test('a member with no pointer to its block is an error', () => {
  const text = FULL.replace('*Not to be confused with [Deep](fixture-competency.md#cmp-fx.fixture.deep).*', '');
  const found = checkComparisonPointer(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.shallow');
});

test('a command string absent from its concept block is an error', () => {
  const text = FULL.replace('| `uname -r` | Show the running kernel release |', '| `uname` | Show the kernel |');
  const found = checkCommandCoverage(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /uname -r/);
});

test('a command string in a fenced block counts', () => {
  const text = FULL.replace(
    '| `uname -r` | Show the running kernel release |',
    ['| `uname` | Show the kernel |', '', '```bash', 'uname -r', '```'].join('\n'),
  );
  assert.deepEqual(checkCommandCoverage(dataset, [parseGuideFile(GUIDE_PATH, text)], {}), []);
});

test('a waived concept without the marker is an error', () => {
  const text = FULL.replace(WAIVER_MARKER, '');
  const found = checkWaiverMarker(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.waived');
});

test('a link to a file that does not exist is an error in full mode and a warning in scoped mode', () => {
  const text = FULL.replace('fixture-competency.md#cmp-fx.fixture.deep', 'ghost.md#cmp-fx.fixture.deep');
  const files = [parseGuideFile(GUIDE_PATH, text)];
  const fullMode = checkDanglingXref(dataset, files, {});
  assert.ok(fullMode.some((f) => f.severity === 'error' && /ghost\.md/.test(f.message)));
  const scoped = checkDanglingXref(dataset, files, { scope: 'Fixture Domain :: Fixture Competency' });
  assert.ok(scoped.every((f) => f.severity === 'warn'));
});

test('a link to an anchor that is not defined in the target file is an error', () => {
  const text = FULL.replace('#cmp-fx.fixture.deep).*', '#cmp-fx.fixture.ghost).*');
  const found = checkDanglingXref(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.ok(found.some((f) => /cmp-fx\.fixture\.ghost/.test(f.message)));
});

test('vendor neutrality warns only on cloud networking files', () => {
  // The fixture dataset has no Cloud Computing Fundamentals :: Networking
  // competency, so checkVendorNeutrality always returns [] regardless of
  // what the fixture guide's prose says — this proves the check does not
  // fire on a non-cloud-networking file even when it contains AWS-specific
  // vocabulary.
  const text = FULL.replace('**What it is** ...', '**What it is** A VPC with a Security Group.');
  const found = checkVendorNeutrality(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.deepEqual(found, []);
});

// --- Fix round 1: CRITICAL 1 — checkVendorNeutrality's real trigger path ---
//
// The test above only exercises the early return (no Cloud Computing
// Fundamentals :: Networking competency in the fixture dataset), so the
// check's actual trigger condition — `used.length > 0 && !hasMapping` — was
// never run by any test. These three build a synthetic dataset that does
// have that competency, so the real path executes.

function cloudDataset(topicOverrides = {}) {
  return {
    competencies: {
      domains: [
        {
          name: 'Cloud Computing Fundamentals',
          file: '03-cloud-computing.json',
          competencies: [{ name: 'Networking' }],
        },
      ],
    },
    topics: [
      {
        id: 'cloud.networking.vpc',
        domain: 'Cloud Computing Fundamentals',
        competency: 'Networking',
        ...topicOverrides,
      },
    ],
  };
}

const CLOUD_NETWORKING_PATH = 'study-guide/03-cloud-computing/networking.md';

test('vendor neutrality warns when AWS-only vocabulary appears with no vendor mapping table', () => {
  const files = [{
    path: CLOUD_NETWORKING_PATH,
    definitions: [{ blockText: 'Configuring a VPC alongside a Security Group for isolation.' }],
  }];
  const found = checkVendorNeutrality(cloudDataset(), files);
  assert.equal(found.length, 1);
  assert.equal(found[0].check, 'guide-vendor-neutrality');
  assert.equal(found[0].severity, 'warn');
  assert.match(found[0].message, /VPC/);
  assert.match(found[0].message, /Security Group/);
});

test('vendor neutrality is silent when a vendor mapping table accompanies the same vocabulary', () => {
  const files = [{
    path: CLOUD_NETWORKING_PATH,
    definitions: [{
      blockText: [
        'Configuring a VPC alongside a Security Group for isolation.',
        '| AWS | Azure |',
        '| --- | --- |',
      ].join('\n'),
    }],
  }];
  const found = checkVendorNeutrality(cloudDataset(), files);
  assert.deepEqual(found, []);
});

test('vendor neutrality is silent when no AWS-only vocabulary is used', () => {
  const files = [{
    path: CLOUD_NETWORKING_PATH,
    definitions: [{ blockText: 'Discusses subnets and routing tables in vendor-neutral terms.' }],
  }];
  const found = checkVendorNeutrality(cloudDataset(), files);
  assert.deepEqual(found, []);
});

// --- Fix round 1: IMPORTANT 2 — scope filtering in the five untested checks ---
//
// No existing test passes a real, non-empty `scope` to any of these five
// checks, so their scope gates (`ownedInScope` / `inScope`) run only ever
// under `{}`, where they are a no-op. Each test below builds a small local
// dataset — not the shared, fixture-loaded `dataset` used everywhere else in
// this file, since extending the shared fixture with additional topics
// would ripple into every other test that reads `dataset.topics` unscoped —
// mirroring the same two real competency names the fixture itself uses
// ("Fixture Domain :: Fixture Competency" and "Fixture Domain :: Second
// Competency"), with an equivalent violation planted in each. Scoping to
// Fixture Competency must report the in-scope violation and exclude the
// out-of-scope one — both directions, in one assertion pair.

function scopeCompetencies() {
  return {
    domains: [
      {
        name: 'Fixture Domain',
        file: '01-fixture-domain.json',
        competencies: [{ name: 'Fixture Competency' }, { name: 'Second Competency' }],
      },
    ],
  };
}

test('checkComparisonCoverage scope filtering reports the scoped owner and excludes the other', () => {
  const localDataset = {
    competencies: scopeCompetencies(),
    topics: [
      { id: 'fx.fixture.scope-a-owner', domain: 'Fixture Domain', competency: 'Fixture Competency', importance: 4, required_depth: 3, confused_with: ['fx.fixture.scope-a-member'] },
      { id: 'fx.fixture.scope-a-member', domain: 'Fixture Domain', competency: 'Fixture Competency', importance: 2, required_depth: 2, confused_with: [] },
      { id: 'fx.fixture.scope-b-owner', domain: 'Fixture Domain', competency: 'Second Competency', importance: 4, required_depth: 3, confused_with: ['fx.fixture.scope-b-member'] },
      { id: 'fx.fixture.scope-b-member', domain: 'Fixture Domain', competency: 'Second Competency', importance: 2, required_depth: 2, confused_with: [] },
    ],
  };
  // No files write either owner's comparison block, so both are "missing" —
  // the scope must keep only the in-scope owner's finding.
  const found = checkComparisonCoverage(localDataset, [], { scope: 'Fixture Domain :: Fixture Competency' });
  assert.ok(found.some((f) => f.id === 'fx.fixture.scope-a-owner'));
  assert.ok(!found.some((f) => f.id === 'fx.fixture.scope-b-owner'));
});

test('checkComparisonMembership scope filtering reports the scoped owner and excludes the other', () => {
  const localDataset = {
    competencies: scopeCompetencies(),
    topics: [
      { id: 'fx.fixture.scope-a-owner', domain: 'Fixture Domain', competency: 'Fixture Competency', importance: 4, required_depth: 3, confused_with: ['fx.fixture.scope-a-member'] },
      { id: 'fx.fixture.scope-a-member', domain: 'Fixture Domain', competency: 'Fixture Competency', importance: 2, required_depth: 2, confused_with: [] },
      { id: 'fx.fixture.scope-b-owner', domain: 'Fixture Domain', competency: 'Second Competency', importance: 4, required_depth: 3, confused_with: ['fx.fixture.scope-b-member'] },
      { id: 'fx.fixture.scope-b-member', domain: 'Fixture Domain', competency: 'Second Competency', importance: 2, required_depth: 2, confused_with: [] },
    ],
  };
  const files = [{
    path: 'x.md',
    comparisons: [
      { owner: 'fx.fixture.scope-a-owner', line: 1, compares: ['fx.fixture.scope-a-owner', 'fx.fixture.scope-wrong'] },
      { owner: 'fx.fixture.scope-b-owner', line: 2, compares: ['fx.fixture.scope-b-owner', 'fx.fixture.scope-wrong'] },
    ],
  }];
  const found = checkComparisonMembership(localDataset, files, { scope: 'Fixture Domain :: Fixture Competency' });
  assert.ok(found.some((f) => f.id === 'fx.fixture.scope-a-owner'));
  assert.ok(!found.some((f) => f.id === 'fx.fixture.scope-b-owner'));
});

test('checkComparisonPointer scope filtering reports the scoped member and excludes the other', () => {
  const localDataset = {
    competencies: scopeCompetencies(),
    topics: [
      { id: 'fx.fixture.scope-a-owner', domain: 'Fixture Domain', competency: 'Fixture Competency', importance: 4, required_depth: 3, confused_with: ['fx.fixture.scope-a-member'] },
      { id: 'fx.fixture.scope-a-member', domain: 'Fixture Domain', competency: 'Fixture Competency', importance: 2, required_depth: 2, confused_with: [] },
      { id: 'fx.fixture.scope-b-owner', domain: 'Fixture Domain', competency: 'Second Competency', importance: 4, required_depth: 3, confused_with: ['fx.fixture.scope-b-member'] },
      { id: 'fx.fixture.scope-b-member', domain: 'Fixture Domain', competency: 'Second Competency', importance: 2, required_depth: 2, confused_with: [] },
    ],
  };
  // No files carry any pointer, so both members are missing theirs — the
  // scope must keep only the in-scope member's finding.
  const found = checkComparisonPointer(localDataset, [], { scope: 'Fixture Domain :: Fixture Competency' });
  assert.ok(found.some((f) => f.id === 'fx.fixture.scope-a-member'));
  assert.ok(!found.some((f) => f.id === 'fx.fixture.scope-b-member'));
});

test('checkCommandCoverage scope filtering reports the scoped concept and excludes the other', () => {
  const localDataset = {
    topics: [
      { id: 'fx.fixture.scope-cmd-a', domain: 'Fixture Domain', competency: 'Fixture Competency', commands: ['ps aux'] },
      { id: 'fx.fixture.scope-cmd-b', domain: 'Fixture Domain', competency: 'Second Competency', commands: ['ps aux'] },
    ],
  };
  const files = [{
    path: 'x.md',
    definitions: [
      { id: 'fx.fixture.scope-cmd-a', kind: 'topic', line: 1, blockText: 'No commands shown here.' },
      { id: 'fx.fixture.scope-cmd-b', kind: 'topic', line: 2, blockText: 'No commands shown here either.' },
    ],
  }];
  const found = checkCommandCoverage(localDataset, files, { scope: 'Fixture Domain :: Fixture Competency' });
  assert.ok(found.some((f) => f.id === 'fx.fixture.scope-cmd-a'));
  assert.ok(!found.some((f) => f.id === 'fx.fixture.scope-cmd-b'));
});

test('checkWaiverMarker scope filtering reports the scoped waived concept and excludes the other', () => {
  const localDataset = {
    topics: [
      { id: 'fx.fixture.scope-waived-a', domain: 'Fixture Domain', competency: 'Fixture Competency' },
      { id: 'fx.fixture.scope-waived-b', domain: 'Fixture Domain', competency: 'Second Competency' },
    ],
    waivers: { waived: ['fx.fixture.scope-waived-a', 'fx.fixture.scope-waived-b'] },
  };
  const files = [{
    path: 'x.md',
    definitions: [
      { id: 'fx.fixture.scope-waived-a', line: 1, blockText: 'No marker here.' },
      { id: 'fx.fixture.scope-waived-b', line: 2, blockText: 'No marker here either.' },
    ],
  }];
  const found = checkWaiverMarker(localDataset, files, { scope: 'Fixture Domain :: Fixture Competency' });
  assert.ok(found.some((f) => f.id === 'fx.fixture.scope-waived-a'));
  assert.ok(!found.some((f) => f.id === 'fx.fixture.scope-waived-b'));
});

// --- Fix round 1: IMPORTANT 3 — checkCommandCoverage credited a substring match ---

test('a command shown only as a prefix of a longer flag combination is not credited', () => {
  // The dataset requires `uname -r`; the guide only ever shows `uname -rV`.
  // A plain substring check would credit this, since "uname -r" is a
  // substring of "uname -rV" — but the shorter command was never actually
  // demonstrated.
  const text = FULL.replace(
    '| `uname -r` | Show the running kernel release |',
    '| `uname -rV` | Show the running kernel release and version |',
  );
  const found = checkCommandCoverage(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /uname -r\b/);
});

test('a command inside a fenced block, followed by a pipe, still counts as a complete invocation', () => {
  const text = FULL.replace(
    '| `uname -r` | Show the running kernel release |',
    ['| `uname` | Show the kernel |', '', '```bash', 'uname -r | tee /tmp/out.txt', '```'].join('\n'),
  );
  assert.deepEqual(checkCommandCoverage(dataset, [parseGuideFile(GUIDE_PATH, text)], {}), []);
});

// --- Fix round 1: MINOR 5 — anchor-only links were never validated ---

test('a same-file anchor-only link to a nonexistent anchor is an error', () => {
  const text = FULL.replace(
    '*Not to be confused with [Deep](fixture-competency.md#cmp-fx.fixture.deep).*',
    '*Not to be confused with [Deep](fixture-competency.md#cmp-fx.fixture.deep).* See also [Ghost](#c-fx.fixture.ghost).',
  );
  const found = checkDanglingXref(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.ok(found.some((f) => /#c-fx\.fixture\.ghost/.test(f.message) && /fixture-competency\.md does not define/.test(f.message)));
});

// --- Fix round 1: MINOR 6 — the waiver marker was matched by its opening sentence only ---

test('a waiver marker truncated to its opening sentence is still an error', () => {
  const truncated = '*No primary documentation source.*';
  const text = FULL.replace(WAIVER_MARKER, truncated);
  const found = checkWaiverMarker(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.waived');
});

test('runAllGuideChecks calls assertKnownScope before running any check', () => {
  assert.throws(
    () => runAllGuideChecks(dataset, [], { scope: 'Other Domain :: Other Competency' }),
    /Unknown scope "Other Domain :: Other Competency"/,
  );
});
