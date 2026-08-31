import { describe, expect, it } from 'vitest';
import {
  composeDomainSitting,
  composeWeightedSitting,
  resolveDomainLength,
} from '../../src/domain/select.ts';
import {
  DOMAINS,
  QUESTIONS_PER_WEIGHTED_SITTING,
  weightedQuota,
  type Domain,
} from '../../src/domain/weights.ts';

// Composition is pure: the database hands over each domain's candidates already
// ordered — unseen first, then least recently seen — and these functions decide
// how many of each to take. Keeping the arithmetic here is what lets the
// invariants be asserted exhaustively instead of sampled.

/** A domain's candidates, named so a failure says which domain and which slot. */
function pool(domain: Domain, size: number): string[] {
  return Array.from({ length: size }, (_, i) => `q.${domain}.${String(i).padStart(3, '0')}`);
}

/** Every domain generously stocked — the real bank's situation. */
function fullCandidates(): Record<Domain, string[]> {
  return Object.fromEntries(DOMAINS.map((d) => [d, pool(d, 100)])) as Record<Domain, string[]>;
}

describe('a weighted sitting', () => {
  it('is always exactly 60 questions', () => {
    expect(composeWeightedSitting(fullCandidates())).toHaveLength(QUESTIONS_PER_WEIGHTED_SITTING);
  });

  it('always splits by the official weights', () => {
    const picked = composeWeightedSitting(fullCandidates());
    for (const domain of DOMAINS) {
      const fromDomain = picked.filter((id) => id.startsWith(`q.${domain}.`));
      expect(fromDomain, `${domain}`).toHaveLength(weightedQuota(domain));
    }
  });

  it('never repeats a question', () => {
    const picked = composeWeightedSitting(fullCandidates());
    expect(new Set(picked).size).toBe(picked.length);
  });

  // The database has already decided the order — unseen before seen. Reordering
  // here would silently undo unseen-first.
  it('takes each domain\'s candidates from the top, in the order given', () => {
    const picked = composeWeightedSitting(fullCandidates());
    for (const domain of DOMAINS) {
      const fromDomain = picked.filter((id) => id.startsWith(`q.${domain}.`));
      expect(fromDomain).toEqual(pool(domain, weightedQuota(domain)));
    }
  });

  it('is deterministic — the same candidates give the same sitting', () => {
    expect(composeWeightedSitting(fullCandidates()))
      .toEqual(composeWeightedSitting(fullCandidates()));
  });
});

describe('a weighted sitting when a domain runs dry', () => {
  it('still returns 60 when another domain can cover the shortfall', () => {
    const candidates = fullCandidates();
    candidates.pm = pool('pm', 2); // quota is 6
    const picked = composeWeightedSitting(candidates);
    expect(picked).toHaveLength(60);
    expect(new Set(picked).size).toBe(60);
  });

  it('takes everything the short domain had rather than dropping it', () => {
    const candidates = fullCandidates();
    candidates.pm = pool('pm', 2);
    const picked = composeWeightedSitting(candidates);
    expect(picked.filter((id) => id.startsWith('q.pm.'))).toEqual(pool('pm', 2));
  });

  it('never throws, even with every domain empty', () => {
    const empty = Object.fromEntries(
      DOMAINS.map((d) => [d, [] as string[]]),
    ) as Record<Domain, string[]>;
    expect(() => composeWeightedSitting(empty)).not.toThrow();
    expect(composeWeightedSitting(empty)).toEqual([]);
  });

  it('returns everything available when the whole bank cannot fill 60', () => {
    const thin = Object.fromEntries(DOMAINS.map((d) => [d, pool(d, 3)])) as Record<Domain, string[]>;
    expect(composeWeightedSitting(thin)).toHaveLength(18);
  });
});

describe('domain sitting length', () => {
  it('is 20, 40, or the whole domain', () => {
    expect(resolveDomainLength(20, 84)).toBe(20);
    expect(resolveDomainLength(40, 84)).toBe(40);
    expect(resolveDomainLength('all', 84)).toBe(84);
  });

  // "All" means all of what exists, and a request for 40 from a domain holding
  // 30 is a request for 30 — never an error, and never 40 with padding.
  it('never exceeds what the domain actually has', () => {
    expect(resolveDomainLength(40, 30)).toBe(30);
    expect(resolveDomainLength(20, 12)).toBe(12);
    expect(resolveDomainLength('all', 0)).toBe(0);
  });
});

describe('a domain sitting', () => {
  it('takes the requested number from the top of the candidates', () => {
    expect(composeDomainSitting(pool('security', 50), 20)).toEqual(pool('security', 20));
  });

  it('never repeats a question', () => {
    const picked = composeDomainSitting(pool('security', 50), 40);
    expect(new Set(picked).size).toBe(picked.length);
  });

  it('returns what exists rather than erroring when asked for too many', () => {
    expect(composeDomainSitting(pool('pm', 5), 20)).toHaveLength(5);
  });

  it('returns nothing, calmly, for an empty domain', () => {
    expect(composeDomainSitting([], 20)).toEqual([]);
  });
});
