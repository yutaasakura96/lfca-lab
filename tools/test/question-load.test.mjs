import test from 'node:test';
import assert from 'node:assert/strict';
import { ITEM_TYPES, POOLS, PROVENANCE_KINDS, allItems, loadBank, validateItem }
  from '../lib/question-load.mjs';

const FIXTURE = 'tools/test/fixtures/bank/questions';

function sound() {
  return {
    id: 'q.alpha.things.widget.01',
    concept_id: 'alpha.things.widget',
    pool: 'exam',
    type: 'discrimination',
    difficulty: 3,
    stem: 'Which statement identifies the widget?',
    options: [
      { ref: 'o1', text: 'A widget.', correct: true, why: 'It is.', provenance: { kind: 'key' } },
      { ref: 'o2', text: 'A gadget.', correct: false, why: 'No.',
        provenance: { kind: 'confusable', concept_id: 'alpha.things.gadget' } },
      { ref: 'o3', text: 'A trinket.', correct: false, why: 'No.',
        provenance: { kind: 'sibling', concept_id: 'alpha.things.trinket' } },
      { ref: 'o4', text: 'Neither.', correct: false, why: 'No.',
        provenance: { kind: 'misconception', documented_at: 'data:notes:alpha.things.widget' } },
    ],
    rationale: 'Because.',
    source_ids: ['fixture-spec'],
    guide_anchor: '01-alpha/things.md#c-alpha.things.widget',
    comparison_block: 'cmp-alpha.things.widget',
    commands_covered: [],
    waived_source: false,
    verification: null,
  };
}

test('the enumerations are the documented sets', () => {
  assert.deepEqual(ITEM_TYPES,
    ['recall', 'application', 'command', 'diagnostic', 'discrimination']);
  assert.deepEqual(PROVENANCE_KINDS,
    ['key', 'confusable', 'sibling', 'lookalike', 'variant', 'misconception']);
  assert.deepEqual(POOLS, ['exam', 'supplement']);
});

test('a sound item validates clean', () => {
  assert.deepEqual(validateItem(sound(), 0), []);
});

test('a missing required field is reported by name', () => {
  const item = sound();
  delete item.stem;
  const problems = validateItem(item, 0);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /stem/);
});

test('an unknown type, pool or provenance kind is reported', () => {
  const bad = sound();
  bad.type = 'trivia';
  assert.match(validateItem(bad, 0).join(' '), /trivia/);

  const badPool = sound();
  badPool.pool = 'practice';
  assert.match(validateItem(badPool, 0).join(' '), /practice/);

  const badKind = sound();
  badKind.options[1].provenance.kind = 'vibes';
  assert.match(validateItem(badKind, 0).join(' '), /vibes/);
});

test('a wrong option count or key count is reported', () => {
  const three = sound();
  three.options = three.options.slice(0, 3);
  assert.match(validateItem(three, 0).join(' '), /4 options/);

  const twoKeys = sound();
  twoKeys.options[1].correct = true;
  assert.match(validateItem(twoKeys, 0).join(' '), /exactly one/);

  const noKey = sound();
  noKey.options[0].correct = false;
  assert.match(validateItem(noKey, 0).join(' '), /exactly one/);
});

test('duplicate or out-of-sequence option refs are reported', () => {
  const dup = sound();
  dup.options[2].ref = 'o2';
  assert.match(validateItem(dup, 0).join(' '), /ref/);
});

test('an id that does not derive from the concept id is reported', () => {
  const item = sound();
  item.id = 'q.alpha.things.gadget.01';
  assert.match(validateItem(item, 0).join(' '), /id/);
});

test('validateItem reports every problem at once, not just the first', () => {
  const item = sound();
  delete item.stem;
  delete item.rationale;
  item.type = 'trivia';
  assert.ok(validateItem(item, 0).length >= 3);
});

test('loadBank reads every competency file and reports its path', async () => {
  const files = await loadBank(FIXTURE);
  assert.equal(files.length, 2);
  const paths = files.map((f) => f.path).sort();
  assert.deepEqual(paths, [
    'tools/test/fixtures/bank/questions/01-alpha/things.json',
    'tools/test/fixtures/bank/questions/02-beta/stuff.json',
  ]);
  for (const f of files) assert.deepEqual(f.malformed, [], f.path);
});

test('loadBank returns an empty list when the directory does not exist', async () => {
  assert.deepEqual(await loadBank('tools/test/fixtures/bank/nonexistent'), []);
});

test('allItems flattens and tags each item with its file', async () => {
  const files = await loadBank(FIXTURE);
  const items = allItems(files);
  assert.ok(items.length > 0);
  for (const i of items) assert.ok(i.file.endsWith('.json'), i.id);
  assert.equal(new Set(items.map((i) => i.id)).size, items.length, 'ids are unique');
});
