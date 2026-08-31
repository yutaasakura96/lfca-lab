import { describe, expect, it } from 'vitest';
import {
  DOMAINS,
  EXAM_WEIGHT_PERCENT,
  QUESTIONS_PER_WEIGHTED_SITTING,
  weightedQuota,
  weightPercent,
} from '../../src/domain/weights.ts';

// These are the real exam's published weights, and the sixteen generated papers
// already match them to within one question. The tests assert the relationships
// between the two representations rather than restating the numbers a second
// time — a test that only repeats the table it is testing proves nothing except
// that someone typed it twice.

describe('the six domains', () => {
  it('are exactly the six the bank uses, by slug', () => {
    expect([...DOMAINS].sort()).toEqual(
      ['cloud', 'devops', 'linux', 'pm', 'security', 'sysadmin'],
    );
  });

  it('has no domain listed twice', () => {
    expect(new Set(DOMAINS).size).toBe(DOMAINS.length);
  });
});

describe('the published percentages', () => {
  it('cover every domain', () => {
    expect(Object.keys(EXAM_WEIGHT_PERCENT).sort()).toEqual([...DOMAINS].sort());
  });

  it('total 100', () => {
    const total = DOMAINS.reduce((sum, d) => sum + weightPercent(d), 0);
    expect(total).toBe(100);
  });
});

describe('questions per sitting', () => {
  it('totals exactly the sitting size, with nothing left over', () => {
    const total = DOMAINS.reduce((sum, d) => sum + weightedQuota(d), 0);
    expect(total).toBe(QUESTIONS_PER_WEIGHTED_SITTING);
  });

  it('gives every domain at least one question', () => {
    for (const domain of DOMAINS) {
      expect(weightedQuota(domain)).toBeGreaterThan(0);
    }
  });

  // The load-bearing one. The per-60 split is a hand-made allocation, not a
  // computed rounding — the percentages do not divide 60 evenly and something
  // had to absorb the remainder. This asserts the allocation never drifts more
  // than a question away from the published weight it claims to represent,
  // which is the same tolerance the sixteen papers were built to.
  it('stays within one question of the published percentage', () => {
    for (const domain of DOMAINS) {
      const fromPercent = (weightPercent(domain) / 100) * QUESTIONS_PER_WEIGHTED_SITTING;
      expect(Math.abs(weightedQuota(domain) - fromPercent)).toBeLessThanOrEqual(1);
    }
  });

  it('ranks the domains in the same order as the percentages', () => {
    const byCount = [...DOMAINS].sort((a, b) => weightedQuota(b) - weightedQuota(a));
    const byPercent = [...DOMAINS].sort((a, b) => weightPercent(b) - weightPercent(a));
    expect(byCount).toEqual(byPercent);
  });
});

describe('purity', () => {
  // The rule the whole domain layer is built on: same input, same output,
  // forever. Asserted here rather than assumed, because this module is the
  // first inhabitant of that layer and sets the precedent.
  it('returns the same answer every time it is asked', () => {
    const once = DOMAINS.map(weightedQuota);
    const twice = DOMAINS.map(weightedQuota);
    expect(once).toEqual(twice);
  });
});
