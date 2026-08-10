import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  undirectedEdges,
  ownerOf,
  assignBlocks,
  blocksMentioning,
} from '../lib/comparisons.mjs';

function topic(id, importance, depth, confusedWith = []) {
  return { id, importance, required_depth: depth, confused_with: confusedWith };
}

test('a reciprocal pair yields one undirected edge, not two', () => {
  const topics = [topic('d.c.a', 3, 3, ['d.c.b']), topic('d.c.b', 3, 3, ['d.c.a'])];
  assert.deepEqual(undirectedEdges({ topics }), [['d.c.a', 'd.c.b']]);
});

test('an edge naming a concept that does not exist is dropped', () => {
  const topics = [topic('d.c.a', 3, 3, ['d.c.ghost'])];
  assert.deepEqual(undirectedEdges({ topics }), []);
});

test('a concept that is only ever a target still gets an edge', () => {
  const topics = [topic('d.c.a', 3, 3, ['d.c.b']), topic('d.c.b', 3, 3, [])];
  assert.deepEqual(undirectedEdges({ topics }), [['d.c.a', 'd.c.b']]);
});

test('a leaf id containing -vs- wins ownership over higher importance', () => {
  const index = new Map([
    ['d.c.thing-vs-other', topic('d.c.thing-vs-other', 1, 1)],
    ['d.c.other', topic('d.c.other', 5, 3)],
  ]);
  assert.equal(ownerOf('d.c.thing-vs-other', 'd.c.other', index), 'd.c.thing-vs-other');
  assert.equal(ownerOf('d.c.other', 'd.c.thing-vs-other', index), 'd.c.thing-vs-other');
});

test('otherwise the higher importance wins, then the higher depth, then the lower id', () => {
  const index = new Map([
    ['d.c.a', topic('d.c.a', 5, 2)],
    ['d.c.b', topic('d.c.b', 3, 3)],
    ['d.c.c', topic('d.c.c', 3, 3)],
    ['d.c.d', topic('d.c.d', 3, 2)],
  ]);
  assert.equal(ownerOf('d.c.a', 'd.c.b', index), 'd.c.a');
  assert.equal(ownerOf('d.c.d', 'd.c.b', index), 'd.c.b');
  assert.equal(ownerOf('d.c.c', 'd.c.b', index), 'd.c.b');
});

test('ownership does not depend on argument order', () => {
  const index = new Map([
    ['d.c.a', topic('d.c.a', 5, 2)],
    ['d.c.b', topic('d.c.b', 3, 3)],
  ]);
  assert.equal(ownerOf('d.c.a', 'd.c.b', index), ownerOf('d.c.b', 'd.c.a', index));
});

test('every edge lands in exactly one block, and compares lists the owner first', () => {
  const topics = [
    topic('d.c.hub', 5, 3, ['d.c.x', 'd.c.y']),
    topic('d.c.x', 2, 3, []),
    topic('d.c.y', 2, 3, []),
  ];
  const blocks = assignBlocks({ topics });
  assert.equal(blocks.size, 1);
  const block = blocks.get('d.c.hub');
  assert.deepEqual(block.compares, ['d.c.hub', 'd.c.x', 'd.c.y']);
  assert.equal(block.anchor, 'cmp-d.c.hub');
  assert.equal(block.edges.length, 2);
});

test('a chain becomes several blocks, never one table', () => {
  const topics = [
    topic('d.c.a', 5, 3, ['d.c.b']),
    topic('d.c.b', 4, 3, ['d.c.c']),
    topic('d.c.c', 3, 3, []),
  ];
  const blocks = assignBlocks({ topics });
  assert.deepEqual([...blocks.keys()].sort(), ['d.c.a', 'd.c.b']);
  assert.deepEqual(blocks.get('d.c.a').compares, ['d.c.a', 'd.c.b']);
  assert.deepEqual(blocks.get('d.c.b').compares, ['d.c.b', 'd.c.c']);
});

test('blocksMentioning finds the blocks a concept must point to, excluding its own', () => {
  const topics = [
    topic('d.c.hub', 5, 3, ['d.c.x']),
    topic('d.c.x', 2, 3, []),
    topic('d.c.other', 4, 3, ['d.c.x']),
  ];
  const blocks = assignBlocks({ topics });
  const forX = blocksMentioning(blocks, 'd.c.x').map((b) => b.owner).sort();
  assert.deepEqual(forX, ['d.c.hub', 'd.c.other']);
  assert.deepEqual(blocksMentioning(blocks, 'd.c.hub'), []);
});
