import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeImportance } from '../lib/importance.mjs';

test('heaviest domain with two competency references scores 5', () => {
  assert.equal(computeImportance(30, 2), 5);
});

test('lightest domain with one reference scores 1', () => {
  assert.equal(computeImportance(10, 1), 1);
});

test('heaviest domain with one reference scores 4', () => {
  assert.equal(computeImportance(30, 1), 4);
});

test('mid-weight domains land between', () => {
  assert.equal(computeImportance(16, 1), 2);
  assert.equal(computeImportance(18, 1), 2);
});

test('references above two do not inflate the score further', () => {
  assert.equal(computeImportance(30, 5), computeImportance(30, 2));
});

test('zero references still clamps to at least 1', () => {
  assert.ok(computeImportance(10, 0) >= 1);
});

test('result is always an integer within 1..5', () => {
  for (const w of [10, 12, 14, 16, 18, 30]) {
    for (const r of [0, 1, 2, 3]) {
      const v = computeImportance(w, r);
      assert.ok(Number.isInteger(v), `${w}/${r} not integer`);
      assert.ok(v >= 1 && v <= 5, `${w}/${r} out of range: ${v}`);
    }
  }
});
