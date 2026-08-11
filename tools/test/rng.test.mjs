import test from 'node:test';
import assert from 'node:assert/strict';
import { balancedPositions, hashSeed, mulberry32, shuffled } from '../lib/rng.mjs';

test('hashSeed is stable and differs between inputs', () => {
  assert.equal(hashSeed('exam-01'), hashSeed('exam-01'));
  assert.notEqual(hashSeed('exam-01'), hashSeed('exam-02'));
  assert.ok(Number.isInteger(hashSeed('exam-01')));
});

test('mulberry32 yields the same sequence for the same seed', () => {
  const a = mulberry32(12345);
  const b = mulberry32(12345);
  const seqA = [a(), a(), a(), a()];
  const seqB = [b(), b(), b(), b()];
  assert.deepEqual(seqA, seqB);
  for (const x of seqA) assert.ok(x >= 0 && x < 1, `${x} out of range`);
});

test('shuffled is a permutation and is deterministic for a seed', () => {
  const input = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const once = shuffled(input, hashSeed('drill-networking'));
  const twice = shuffled(input, hashSeed('drill-networking'));
  assert.deepEqual(once, twice);
  assert.deepEqual([...once].sort(), [...input].sort());
  assert.deepEqual(input, ['a', 'b', 'c', 'd', 'e', 'f', 'g'], 'input is not mutated');
});

test('shuffled actually reorders for at least one seed', () => {
  const input = Array.from({ length: 20 }, (_, i) => i);
  const out = shuffled(input, hashSeed('exam-01'));
  assert.notDeepEqual(out, input);
});

test('balancedPositions divides evenly when n is a multiple of buckets', () => {
  const pos = balancedPositions(60, 4, hashSeed('exam-01'));
  assert.equal(pos.length, 60);
  const counts = [0, 0, 0, 0];
  for (const p of pos) counts[p] += 1;
  assert.deepEqual(counts, [15, 15, 15, 15]);
});

test('balancedPositions stays within one of even when n is not a multiple', () => {
  const pos = balancedPositions(38, 4, hashSeed('drill-git-concepts'));
  assert.equal(pos.length, 38);
  const counts = [0, 0, 0, 0];
  for (const p of pos) counts[p] += 1;
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, counts.join(','));
});

test('balancedPositions is not a repeating cycle', () => {
  const pos = balancedPositions(60, 4, hashSeed('exam-01'));
  const cyclic = Array.from({ length: 60 }, (_, i) => i % 4);
  assert.notDeepEqual(pos, cyclic);
});

test('balancedPositions differs between exams', () => {
  assert.notDeepEqual(
    balancedPositions(60, 4, hashSeed('exam-01')),
    balancedPositions(60, 4, hashSeed('exam-02')),
  );
});
