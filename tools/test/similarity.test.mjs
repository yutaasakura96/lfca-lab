import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NEAR_DUPLICATE_ERROR,
  NEAR_DUPLICATE_WARN,
  jaccard,
  normalizeStem,
  shingles,
  similarity,
  tokens,
} from '../lib/similarity.mjs';

test('the thresholds are the reviewed constants', () => {
  assert.equal(NEAR_DUPLICATE_ERROR, 0.85);
  assert.equal(NEAR_DUPLICATE_WARN, 0.7);
  assert.ok(NEAR_DUPLICATE_WARN < NEAR_DUPLICATE_ERROR);
});

test('normalizeStem collapses code spans to one token', () => {
  const a = normalizeStem('Which option of `ip addr show` lists addresses?');
  const b = normalizeStem('Which option of `ss -tulpn` lists addresses?');
  assert.equal(a, b, 'two different commands normalize to the same stem shape');
  assert.ok(a.includes('xcodespanx'));
});

test('normalizeStem collapses fenced blocks too', () => {
  const out = normalizeStem('Given:\n```\nsome code\n```\nwhat happens?');
  assert.ok(out.includes('xcodespanx'));
  assert.ok(!out.includes('some code'));
});

test('normalizeStem lowercases and strips punctuation', () => {
  assert.equal(normalizeStem('A Host: 10.0.5.130/26!'), 'a host 10 0 5 130 26');
});

test('tokens drops stopwords and a trailing plural s', () => {
  assert.deepEqual(tokens('Which of the following statements is true of subnets?'), ['subnet']);
});

test('tokens keeps a short word ending in s intact', () => {
  assert.ok(tokens('dns is a service').includes('dns'));
});

test('shingles produces contiguous n-grams', () => {
  assert.deepEqual([...shingles(['a', 'b', 'c', 'd'], 3)], ['a b c', 'b c d']);
});

test('shingles of a list shorter than n is empty', () => {
  assert.equal(shingles(['a', 'b'], 3).size, 0);
});

test('jaccard is 1 for identical sets and 0 for disjoint ones', () => {
  assert.equal(jaccard(new Set(['a', 'b']), new Set(['a', 'b'])), 1);
  assert.equal(jaccard(new Set(['a']), new Set(['b'])), 0);
  assert.equal(jaccard(new Set(), new Set()), 1);
  assert.equal(jaccard(new Set(['a']), new Set()), 0);
});

test('similarity scores an identical stem at 1', () => {
  const s = 'Which address is the broadcast address of the subnet holding 10.0.5.130/26?';
  assert.equal(similarity(s, s), 1);
});

test('similarity flags a reworded duplicate above the error threshold', () => {
  const a = 'Which address is the broadcast address of the subnet holding the host 10.0.5.130/26?';
  const b = 'Which address is the broadcast address of the subnet holding host 10.0.5.130/26?';
  assert.ok(similarity(a, b) >= NEAR_DUPLICATE_ERROR, similarity(a, b));
});

test('similarity leaves two genuinely different stems below the warn threshold', () => {
  const a = 'Which address is the broadcast address of the subnet holding 10.0.5.130/26?';
  const b = 'A container exits immediately after docker run. What does the exit code tell you?';
  assert.ok(similarity(a, b) < NEAR_DUPLICATE_WARN, similarity(a, b));
});

test('similarity is symmetric', () => {
  const a = 'What separates a warm site from a hot site under NIST SP 800-34?';
  const b = 'Under NIST SP 800-34, what distinguishes a hot site from a warm site?';
  assert.equal(similarity(a, b), similarity(b, a));
});
