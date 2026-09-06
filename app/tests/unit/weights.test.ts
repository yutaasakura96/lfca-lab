import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRACTICE_LENGTH,
  DOMAINS,
  EXAM_WEIGHT_PERCENT,
  QUESTIONS_PER_WEIGHTED_SITTING,
  quotaFor,
  WEIGHTED_QUOTA,
  WEIGHTED_QUOTA_BY_LENGTH,
  WEIGHTED_SITTING_LENGTHS,
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
    // Called through an arrow rather than passed by reference: `map` supplies
    // the index as a second argument, and `weightedQuota`'s second argument is
    // the sitting length. The literal union `20 | 40 | 60` is what turns that
    // into a compile error rather than a quota read from the wrong table.
    const once = DOMAINS.map((d) => weightedQuota(d));
    const twice = DOMAINS.map((d) => weightedQuota(d));
    expect(once).toEqual(twice);
  });
});

// A weighted sitting is 20, 40 or 60. The three tables are hand-pinned for the
// same reason the 60 one always was: the published percentages do not divide
// any of those three lengths evenly, so which domain absorbs the remainder is a
// decision. These tests assert each table against the length it claims and
// against the percentages it represents — never against a re-derivation of
// itself.

describe('the three weighted sitting lengths', () => {
  it('are 20, 40 and 60, shortest first', () => {
    expect([...WEIGHTED_SITTING_LENGTHS]).toEqual([20, 40, 60]);
  });

  it('defaults to 20 — the sitting that gets done on a weeknight', () => {
    expect(DEFAULT_PRACTICE_LENGTH).toBe(20);
    expect(WEIGHTED_SITTING_LENGTHS).toContain(DEFAULT_PRACTICE_LENGTH);
  });

  it('has a quota table for each, and only for those', () => {
    expect(Object.keys(WEIGHTED_QUOTA_BY_LENGTH).map(Number).sort((a, b) => a - b))
      .toEqual([...WEIGHTED_SITTING_LENGTHS]);
  });

  // The load-bearing assertion, and the reason these are tables rather than
  // arithmetic: each one has to sum exactly, and rounding six percentages
  // independently does not.
  it('sums each table to exactly its own length', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const total = DOMAINS.reduce((sum, d) => sum + weightedQuota(d, length), 0);
      expect(total, `${length}`).toBe(length);
    }
  });

  it('gives every domain at least one question at every length', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      for (const domain of DOMAINS) {
        expect(weightedQuota(domain, length), `${domain} at ${length}`).toBeGreaterThan(0);
      }
    }
  });

  it('stays within one question of the published percentage at every length', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      for (const domain of DOMAINS) {
        const fromPercent = (weightPercent(domain) / 100) * length;
        expect(
          Math.abs(weightedQuota(domain, length) - fromPercent),
          `${domain} at ${length}`,
        ).toBeLessThanOrEqual(1);
      }
    }
  });

  it('ranks the domains in the same order as the percentages at every length', () => {
    const byPercent = [...DOMAINS].sort((a, b) => weightPercent(b) - weightPercent(a));
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const byCount = [...DOMAINS].sort(
        (a, b) => weightedQuota(b, length) - weightedQuota(a, length),
      );
      expect(byCount, `${length}`).toEqual(byPercent);
    }
  });

  it('never allocates a fractional or negative share', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      for (const domain of DOMAINS) {
        expect(Number.isInteger(weightedQuota(domain, length))).toBe(true);
      }
    }
  });
});

describe('the 60 table', () => {
  // The historical name and the historical behaviour. `weightedQuota(domain)`
  // with no length still means 60, so every 60-shaped caller and assertion
  // written before the other two lengths existed still reads the same number.
  it('is what a bare weightedQuota still answers', () => {
    for (const domain of DOMAINS) {
      expect(weightedQuota(domain)).toBe(weightedQuota(domain, QUESTIONS_PER_WEIGHTED_SITTING));
    }
  });

  it('is the same object the length table holds, so the two cannot diverge', () => {
    expect(WEIGHTED_QUOTA).toBe(WEIGHTED_QUOTA_BY_LENGTH[QUESTIONS_PER_WEIGHTED_SITTING]);
    expect(quotaFor(QUESTIONS_PER_WEIGHTED_SITTING)).toBe(WEIGHTED_QUOTA);
  });

  it('is still 18/11/10/8/7/6 — the shape the sixteen papers were built to', () => {
    expect(WEIGHTED_QUOTA).toEqual({
      sysadmin: 18,
      cloud: 11,
      linux: 10,
      security: 8,
      devops: 7,
      pm: 6,
    });
  });
});
