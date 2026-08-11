import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDataset } from '../lib/load.mjs';
import { loadBank } from '../lib/question-load.mjs';
import { bankContext } from '../lib/question-checks.mjs';
import { EXAM_COUNT, EXAM_SIZE, examComposition } from '../lib/allocation.mjs';
import { assignPositions, buildAll, partitionIntoExams } from '../lib/assemble.mjs';

// The real bank is the only input with 1,000 exam-pool items, and it does not
// exist until Task 34. These tests therefore run against a synthetic bank
// generated from the real dataset and the real allocation, which exercises
// every constraint at full scale without waiting for the prose.
async function syntheticContext() {
  const dataset = await loadDataset('data');
  const ctx = bankContext({ dataset, bank: [] });
  const items = [];
  for (const t of dataset.topics) {
    const a = ctx.alloc.get(t.id);
    for (let n = 0; n < a.exam; n += 1) {
      items.push({
        id: `q.${t.id}.${String(n + 1).padStart(2, '0')}`,
        concept_id: t.id,
        pool: 'exam',
        type: 'application',
        difficulty: t.required_depth,
        stem: `Synthetic stem ${n} for ${t.id}`,
        options: [
          { ref: 'o1', text: 'A', correct: true, why: 'x', provenance: { kind: 'key' } },
          { ref: 'o2', text: 'B', correct: false, why: 'x', provenance: { kind: 'sibling', concept_id: t.id } },
          { ref: 'o3', text: 'C', correct: false, why: 'x', provenance: { kind: 'sibling', concept_id: t.id } },
          { ref: 'o4', text: 'D', correct: false, why: 'x', provenance: { kind: 'sibling', concept_id: t.id } },
        ],
        rationale: 'synthetic',
        source_ids: [],
        guide_anchor: '',
        comparison_block: a.ownedBlocks[0] ?? null,
        commands_covered: [],
        waived_source: false,
        verification: null,
        file: 'synthetic',
      });
    }
  }
  ctx.items = items;
  return ctx;
}

test('the partition produces exactly EXAM_COUNT exams of EXAM_SIZE items', async () => {
  const ctx = await syntheticContext();
  const { exams } = partitionIntoExams(ctx);
  assert.equal(exams.length, EXAM_COUNT);
  for (const e of exams) assert.equal(e.items.length, EXAM_SIZE, e.name);
});

test('the union of exam items and unused items equals the exam pool exactly, with no overlap', async () => {
  const ctx = await syntheticContext();
  const { exams, unused } = partitionIntoExams(ctx);
  const used = exams.flatMap((e) => e.items.map((i) => i.id));
  const unusedIds = unused.map((i) => i.id);
  assert.equal(used.length, EXAM_SIZE * EXAM_COUNT);
  assert.equal(new Set(used).size, used.length, 'no item appears twice across exams');
  assert.equal(new Set([...used, ...unusedIds]).size, used.length + unusedIds.length, 'exams and unused do not overlap');
  const pool = new Set(ctx.items.filter((i) => i.pool === 'exam').map((i) => i.id));
  for (const id of used) assert.ok(pool.has(id), id);
  for (const id of unusedIds) assert.ok(pool.has(id), id);
  assert.deepEqual(new Set([...used, ...unusedIds]), pool, 'union of exams and unused is exactly the exam pool');
});

test('40 exam-pool items are unused, split by domain as pinned: 0/12/4/12/8/4', async () => {
  const ctx = await syntheticContext();
  const byId = new Map(ctx.dataset.topics.map((t) => [t.id, t]));
  const { unused } = partitionIntoExams(ctx);
  assert.equal(unused.length, 40);
  const byDomain = new Map();
  for (const i of unused) {
    const d = byId.get(i.concept_id).domain;
    byDomain.set(d, (byDomain.get(d) ?? 0) + 1);
  }
  assert.deepEqual(Object.fromEntries(byDomain), {
    'System Administration Fundamentals': 12,
    'Cloud Computing Fundamentals': 4,
    'Security Fundamentals': 12,
    'DevOps Fundamentals': 8,
    'IT Project Management Fundamentals': 4,
    // Linux Fundamentals is absent: it is the binding constraint, so it
    // leaves 0 unused, and 0 does not appear as a byDomain key.
  });
});

test('no supplement item reaches an exam or the unused list', async () => {
  const ctx = await syntheticContext();
  ctx.items.push({ ...ctx.items[0], id: 'q.supp.01', pool: 'supplement' });
  const { exams, unused } = partitionIntoExams(ctx);
  assert.ok(!exams.flatMap((e) => e.items).some((i) => i.pool === 'supplement'));
  assert.ok(!unused.some((i) => i.pool === 'supplement'));
});

test('every exam matches the pinned per-exam composition table exactly', async () => {
  const ctx = await syntheticContext();
  const domainOf = new Map(ctx.dataset.topics.map((t) => [t.id, t.domain]));
  const comp = examComposition(ctx.dataset);
  const { exams } = partitionIntoExams(ctx);
  for (const e of exams) {
    for (const d of ctx.dataset.competencies.domains) {
      const got = e.items.filter((i) => domainOf.get(i.concept_id) === d.name).length;
      assert.equal(got, comp.get(d.name), `${e.name} ${d.name}`);
    }
  }
});

test('no exam tests a concept twice or a comparison block twice', async () => {
  const ctx = await syntheticContext();
  const { exams } = partitionIntoExams(ctx);
  for (const e of exams) {
    const concepts = e.items.map((i) => i.concept_id);
    assert.equal(new Set(concepts).size, concepts.length, `${e.name} repeats a concept`);
    const blocks = e.items.map((i) => i.comparison_block).filter(Boolean);
    assert.equal(new Set(blocks).size, blocks.length, `${e.name} repeats a comparison block`);
  }
});

test('every exam depth mix is within 2 of its domain target', async () => {
  const ctx = await syntheticContext();
  const byId = new Map(ctx.dataset.topics.map((t) => [t.id, t]));
  const comp = examComposition(ctx.dataset);
  const { exams, unused } = partitionIntoExams(ctx);
  const unusedIds = new Set(unused.map((i) => i.id));
  const pool = ctx.items.filter((i) => i.pool === 'exam' && !unusedIds.has(i.id));
  for (const e of exams) {
    for (const d of ctx.dataset.competencies.domains) {
      const slots = comp.get(d.name);
      const domainPool = pool.filter((i) => byId.get(i.concept_id).domain === d.name);
      for (const depth of [1, 2, 3, 4, 5]) {
        const share = domainPool.filter((i) => i.difficulty === depth).length / domainPool.length;
        const target = Math.round(slots * share);
        const got = e.items.filter(
          (i) => byId.get(i.concept_id).domain === d.name && i.difficulty === depth,
        ).length;
        assert.ok(Math.abs(got - target) <= 2, `${e.name} ${d.name} depth ${depth}: ${got} vs ${target}`);
      }
    }
  }
});

test('the partition is deterministic', async () => {
  const a = await syntheticContext();
  const b = await syntheticContext();
  const pa = partitionIntoExams(a);
  const pb = partitionIntoExams(b);
  assert.deepEqual(
    pa.exams.map((e) => e.items.map((i) => i.id)),
    pb.exams.map((e) => e.items.map((i) => i.id)),
  );
  assert.deepEqual(pa.unused.map((i) => i.id), pb.unused.map((i) => i.id));
});

test('assignPositions is exactly even and deterministic', () => {
  const items = Array.from({ length: 60 }, (_, i) => ({ id: `q.x.${i}` }));
  const once = assignPositions(items, 'exam-01');
  const twice = assignPositions(items, 'exam-01');
  assert.deepEqual(once, twice);
  const counts = [0, 0, 0, 0];
  for (const p of once) counts[p.position] += 1;
  assert.deepEqual(counts, [15, 15, 15, 15]);
});

test('buildAll emits an index shape check 18 can read, and idempotently', async () => {
  const ctx = await syntheticContext();
  const first = buildAll(ctx);
  const second = buildAll(ctx);
  assert.deepEqual(first.exams, second.exams);
  assert.deepEqual(first.unused, second.unused);
  assert.deepEqual(first.documents.map((d) => d.text), second.documents.map((d) => d.text));
  assert.equal(first.exams.length, EXAM_COUNT);
  for (const e of first.exams) {
    assert.equal(e.items.length, EXAM_SIZE);
    for (const i of e.items) assert.ok(Number.isInteger(i.position) && i.position >= 0 && i.position <= 3);
  }
  assert.equal(first.unused.length, 40);
  assert.ok(first.drills.length >= 22 + 6 + 1, 'a drill per competency, per domain, and the weak-area drill');
});

test('every generated exam document carries the mandatory header verbatim', async () => {
  const ctx = await syntheticContext();
  const { documents } = buildAll(ctx);
  const exams = documents.filter((d) => d.kind === 'exam');
  assert.equal(exams.length, EXAM_COUNT);
  for (const d of exams) assert.ok(d.text.includes('45 correct out of 60'), d.name);
});

test('the assembler throws rather than relaxing a constraint it cannot meet', async () => {
  const ctx = await syntheticContext();
  // Force every Linux item onto one concept: 160 items, 10 slots per exam,
  // and only one concept to draw from makes "one item per concept" impossible.
  const linux = ctx.dataset.topics.find((t) => t.domain === 'Linux Fundamentals');
  for (const i of ctx.items) {
    const t = ctx.dataset.topics.find((x) => x.id === i.concept_id);
    if (t.domain === 'Linux Fundamentals') i.concept_id = linux.id;
  }
  assert.throws(() => partitionIntoExams(ctx), /could not place/i);
});
