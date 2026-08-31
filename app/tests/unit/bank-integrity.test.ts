import { describe, expect, it } from 'vitest';
// @ts-expect-error — the bank's tooling is plain Node ESM with no type declarations.
// Importing it untyped is the point: this is the *same function* the validator
// and the exam builder call, and a TypeScript re-statement of it would be the
// second opinion the shared function exists to prevent.
import { checkHoldoutIntegrity, HOLDOUT_SIZE } from '../../../tools/lib/holdout.mjs';
import { loadExamIndex, loadItems, loadPinnedHoldout } from '../bank.ts';

// The bank's measured facts, asserted from inside the app.
//
// These same checks run at the repo root. They run here as well, deliberately.
// The testing plan's reasoning is that either half of this project can be
// skipped by working in the other, and the holdout comparison in particular is
// the only defence against this project's riskiest assumption — that a question
// bank never tested against the real exam is a good one. Two independent suites
// now have to be disabled for it to go unchecked.
//
// Everything here reads the real bank. A fixture would make this suite evidence
// about a fixture.

const items = loadItems();
const examIndex = loadExamIndex();
const pinned = loadPinnedHoldout();

describe('the bank', () => {
  it('holds 1,150 questions', () => {
    expect(items.length).toBe(1150);
  });

  it('gives every question a unique id', () => {
    const ids = new Set(items.map((i) => i.id));
    expect(ids.size).toBe(items.length);
  });

  it('gives every question exactly four options', () => {
    const wrong = items.filter((i) => i.options.length !== 4).map((i) => i.id);
    expect(wrong).toEqual([]);
  });

  it('gives every question exactly one correct option', () => {
    const wrong = items
      .filter((i) => i.options.filter((o) => o.correct).length !== 1)
      .map((i) => i.id);
    expect(wrong).toEqual([]);
  });

  it('gives every option a distinct ref within its question', () => {
    const wrong = items
      .filter((i) => new Set(i.options.map((o) => o.ref)).size !== i.options.length)
      .map((i) => i.id);
    expect(wrong).toEqual([]);
  });

  // The wrong-option explanations are the most valuable content in the bank —
  // the review screen shows all four, not just the correct one — so an empty
  // `why` is a data defect rather than a cosmetic gap.
  it('gives every option a non-empty why, including the wrong ones', () => {
    const wrong = items
      .flatMap((i) => i.options.map((o) => ({ id: i.id, ref: o.ref, why: o.why })))
      .filter((o) => typeof o.why !== 'string' || o.why.trim() === '')
      .map((o) => `${o.id}:${o.ref}`);
    expect(wrong).toEqual([]);
  });

  it('splits into a 1,000-item exam pool and a 150-item supplement', () => {
    const byPool = new Map<string, number>();
    for (const item of items) byPool.set(item.pool, (byPool.get(item.pool) ?? 0) + 1);
    expect(Object.fromEntries(byPool)).toEqual({ exam: 1000, supplement: 150 });
  });
});

describe('the sixteen papers', () => {
  it('are sixteen', () => {
    expect(examIndex.exams.length).toBe(16);
  });

  it('are 60 questions each', () => {
    const wrong = examIndex.exams.filter((e) => e.items.length !== 60).map((e) => e.id);
    expect(wrong).toEqual([]);
  });

  it('use 960 distinct questions with zero overlap between papers', () => {
    const all = examIndex.exams.flatMap((e) => e.items.map((i) => i.id));
    expect(all.length).toBe(960);
    expect(new Set(all).size).toBe(960);
  });

  it('draw only from the exam pool', () => {
    const examPool = new Set(items.filter((i) => i.pool === 'exam').map((i) => i.id));
    const strays = examIndex.exams
      .flatMap((e) => e.items.map((i) => i.id))
      .filter((id) => !examPool.has(id));
    expect(strays).toEqual([]);
  });

  it('put the correct option in a position that exists', () => {
    const wrong = examIndex.exams
      .flatMap((e) => e.items.map((i) => ({ exam: e.id, ...i })))
      .filter((i) => !Number.isInteger(i.position) || i.position < 0 || i.position > 3)
      .map((i) => `${i.exam}:${i.id}`);
    expect(wrong).toEqual([]);
  });
});

describe('the holdout', () => {
  it('is forty ids', () => {
    expect(pinned.holdout.length).toBe(HOLDOUT_SIZE);
    expect(HOLDOUT_SIZE).toBe(40);
  });

  // The load-bearing assertion, and it calls the bank's own shared function
  // rather than re-deriving what a violation means. `npm run validate` and
  // `npm run build-exams` compare through this exact function; a TypeScript
  // re-implementation here could hold a different opinion, which is the failure
  // mode the shared function was written to remove.
  it('agrees with the papers, judged by the bank\'s own definition of intact', () => {
    const findings = checkHoldoutIntegrity({ pinned, unused: examIndex.unused });
    expect(findings.map((f: { message: string }) => f.message)).toEqual([]);
  });

  it('names only questions that exist, and none the papers use', () => {
    const known = new Set(items.map((i) => i.id));
    expect(pinned.holdout.filter((id) => !known.has(id))).toEqual([]);

    const onPapers = new Set(examIndex.exams.flatMap((e) => e.items.map((i) => i.id)));
    expect(pinned.holdout.filter((id) => onPapers.has(id))).toEqual([]);
  });

  it('is drawn entirely from the exam pool', () => {
    const examPool = new Set(items.filter((i) => i.pool === 'exam').map((i) => i.id));
    expect(pinned.holdout.filter((id) => !examPool.has(id))).toEqual([]);
  });
});
