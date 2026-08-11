import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDataset } from '../lib/load.mjs';
import { assignBlocks } from '../lib/comparisons.mjs';
import {
  DEPTH_WEIGHT,
  EXAM_COUNT,
  EXAM_POOL_TOTAL,
  EXAM_SIZE,
  SUPPLEMENT_WEIGHT,
  WEAK_COMPETENCIES,
  allocateExamPool,
  allocateSupplement,
  allocation,
  domainBudget,
  examComposition,
  largestRemainder,
} from '../lib/allocation.mjs';

const dataset = await loadDataset('data');

test('domainBudget scales a weight to a tenth of the exam pool', () => {
  assert.equal(domainBudget(30), 300);
  assert.equal(domainBudget(10), 100);
});

test('largestRemainder gives every item a floor of one', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const out = largestRemainder(items, 3, () => 5);
  assert.deepEqual(out, [
    { id: 'a', count: 1 },
    { id: 'b', count: 1 },
    { id: 'c', count: 1 },
  ]);
});

test('largestRemainder distributes the remainder by weight and sums to budget', () => {
  const items = [{ id: 'a', w: 1 }, { id: 'b', w: 4 }, { id: 'c', w: 4 }];
  const out = largestRemainder(items, 12, (i) => i.w);
  assert.equal(out.reduce((s, o) => s + o.count, 0), 12);
  const byId = Object.fromEntries(out.map((o) => [o.id, o.count]));
  assert.ok(byId.b > byId.a, 'a heavier item receives more than a lighter one');
  assert.equal(byId.b, byId.c, 'equal weights receive equal counts');
});

test('largestRemainder is independent of input order', () => {
  const items = [{ id: 'a', w: 1 }, { id: 'b', w: 4 }, { id: 'c', w: 2 }];
  const forward = largestRemainder(items, 11, (i) => i.w);
  const backward = largestRemainder([...items].reverse(), 11, (i) => i.w);
  assert.deepEqual(forward, backward);
});

test('largestRemainder refuses a budget below the one-per-item floor', () => {
  assert.throws(
    () => largestRemainder([{ id: 'a' }, { id: 'b' }], 1, () => 1),
    /below the floor/,
  );
});

test('the exam pool totals exactly EXAM_POOL_TOTAL', () => {
  const pool = allocateExamPool(dataset);
  const total = [...pool.values()].reduce((a, b) => a + b, 0);
  assert.equal(total, EXAM_POOL_TOTAL);
});

test('every concept receives at least one exam-pool item', () => {
  const pool = allocateExamPool(dataset);
  assert.equal(pool.size, dataset.topics.length);
  for (const [id, n] of pool) assert.ok(n >= 1, `${id} received ${n}`);
});

test('each domain receives exactly its weight-derived budget', () => {
  const pool = allocateExamPool(dataset);
  for (const domain of dataset.competencies.domains) {
    const got = dataset.topics
      .filter((t) => t.domain === domain.name)
      .reduce((s, t) => s + pool.get(t.id), 0);
    assert.equal(got, domainBudget(domain.weight), domain.name);
  }
});

test('allocation is monotonic in depth inside every domain', () => {
  const pool = allocateExamPool(dataset);
  for (const domain of dataset.competencies.domains) {
    const maxAt = new Map();
    const minAt = new Map();
    for (const t of dataset.topics.filter((x) => x.domain === domain.name)) {
      const n = pool.get(t.id);
      const d = t.required_depth;
      maxAt.set(d, Math.max(maxAt.get(d) ?? 0, n));
      minAt.set(d, Math.min(minAt.get(d) ?? Infinity, n));
    }
    const depths = [...minAt.keys()].sort((a, b) => a - b);
    for (let i = 1; i < depths.length; i += 1) {
      assert.ok(
        minAt.get(depths[i]) >= minAt.get(depths[i - 1]),
        `${domain.name}: depth ${depths[i]} floor is below depth ${depths[i - 1]}'s`,
      );
    }
  }
});

test('a depth-1 concept receives exactly one exam-pool item in every domain', () => {
  const pool = allocateExamPool(dataset);
  for (const t of dataset.topics.filter((x) => x.required_depth === 1)) {
    assert.equal(pool.get(t.id), 1, t.id);
  }
});

test('the supplement covers only the three weak competencies and totals 150', () => {
  const supp = allocateSupplement(dataset);
  const total = [...supp.values()].reduce((a, b) => a + b, 0);
  assert.equal(total, 150);
  for (const t of dataset.topics) {
    const weak = WEAK_COMPETENCIES.includes(`${t.domain}::${t.competency}`);
    if (!weak) assert.equal(supp.get(t.id), 0, t.id);
    else assert.equal(supp.get(t.id), SUPPLEMENT_WEIGHT[t.required_depth], t.id);
  }
});

test('allocation reports the derived difficulty and coverage requirements', () => {
  const blocks = assignBlocks(dataset);
  const all = allocation(dataset, blocks);
  assert.equal(all.size, dataset.topics.length);
  for (const t of dataset.topics) {
    const a = all.get(t.id);
    assert.equal(a.difficulty, t.required_depth, t.id);
    assert.equal(a.total, a.exam + a.supplement, t.id);
    assert.equal(a.needsDiagnostic, t.required_depth >= 4, t.id);
    assert.deepEqual(a.commandStrings, t.commands ?? [], t.id);
  }
});

test('every comparison block appears as some concept ownedBlocks entry', () => {
  const blocks = assignBlocks(dataset);
  const all = allocation(dataset, blocks);
  const owned = new Set([...all.values()].flatMap((a) => a.ownedBlocks));
  assert.equal(owned.size, blocks.size);
  for (const b of blocks.values()) assert.ok(owned.has(b.anchor), b.anchor);
});

test('DEPTH_WEIGHT is the reviewed curve, not a linear one', () => {
  assert.deepEqual(DEPTH_WEIGHT, { 1: 1, 2: 2, 3: 4, 4: 7, 5: 9 });
});

test('poolTotal and weakCompetencies are overridable for fixtures only', () => {
  const pool = allocateExamPool(dataset, { poolTotal: 2000 });
  assert.equal([...pool.values()].reduce((a, b) => a + b, 0), 2000);
  assert.equal(domainBudget(30, 2000), 600);

  const none = allocateSupplement(dataset, { weakCompetencies: [] });
  assert.equal([...none.values()].reduce((a, b) => a + b, 0), 0);

  // The defaults are the production values, so a caller that passes nothing
  // gets the real allocation.
  assert.equal(
    [...allocateExamPool(dataset).values()].reduce((a, b) => a + b, 0),
    EXAM_POOL_TOTAL,
  );
});

// The pinned per-exam composition — the largest-remainder rounding of
// weight × EXAM_SIZE / 100 — is the table in the spec's "Exam size and
// composition" section, reproduced here as a literal so a regression in the
// rounding is caught even if the arithmetic that produced it looks locally
// plausible.
const EXPECTED_COMPOSITION = {
  'System Administration Fundamentals': 18,
  'Cloud Computing Fundamentals': 11,
  'Linux Fundamentals': 10,
  'Security Fundamentals': 8,
  'DevOps Fundamentals': 7,
  'IT Project Management Fundamentals': 6,
};

test('examComposition matches the pinned per-exam table exactly', () => {
  const comp = examComposition(dataset);
  for (const [name, slots] of Object.entries(EXPECTED_COMPOSITION)) {
    assert.equal(comp.get(name), slots, name);
  }
});

test('examComposition sums to EXAM_SIZE', () => {
  const comp = examComposition(dataset);
  assert.equal([...comp.values()].reduce((a, b) => a + b, 0), EXAM_SIZE);
});

test('EXAM_SIZE is divisible by 4, so key-position balance is an exact equality', () => {
  assert.equal(EXAM_SIZE % 4, 0);
});

test('the exam pool supports exactly EXAM_COUNT disjoint exams under the composition', () => {
  const comp = examComposition(dataset);
  const pool = allocateExamPool(dataset);
  const poolByDomain = new Map();
  for (const t of dataset.topics) {
    poolByDomain.set(t.domain, (poolByDomain.get(t.domain) ?? 0) + pool.get(t.id));
  }
  const maxExams = Math.min(
    ...[...comp.entries()].map(([name, slots]) => Math.floor(poolByDomain.get(name) / slots)),
  );
  assert.equal(maxExams, EXAM_COUNT);
});
