import { describe, expect, it } from 'vitest';
import { loadItems, loadPinnedHoldout } from '../bank.ts';
import {
  composeDomainSitting,
  composeWeightedSitting,
  resolveDomainLength,
} from '../../src/domain/select.ts';
import {
  DOMAINS,
  QUESTIONS_PER_WEIGHTED_SITTING,
  quotaFor,
  WEIGHTED_QUOTA,
  WEIGHTED_SITTING_LENGTHS,
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
    expect(composeWeightedSitting(fullCandidates(), WEIGHTED_QUOTA)).toHaveLength(QUESTIONS_PER_WEIGHTED_SITTING);
  });

  it('always splits by the official weights', () => {
    const picked = composeWeightedSitting(fullCandidates(), WEIGHTED_QUOTA);
    for (const domain of DOMAINS) {
      const fromDomain = picked.filter((id) => id.startsWith(`q.${domain}.`));
      expect(fromDomain, `${domain}`).toHaveLength(weightedQuota(domain));
    }
  });

  it('never repeats a question', () => {
    const picked = composeWeightedSitting(fullCandidates(), WEIGHTED_QUOTA);
    expect(new Set(picked).size).toBe(picked.length);
  });

  // The database has already decided the order — unseen before seen. Reordering
  // here would silently undo unseen-first.
  it('takes each domain\'s candidates from the top, in the order given', () => {
    const picked = composeWeightedSitting(fullCandidates(), WEIGHTED_QUOTA);
    for (const domain of DOMAINS) {
      const fromDomain = picked.filter((id) => id.startsWith(`q.${domain}.`));
      expect(fromDomain).toEqual(pool(domain, weightedQuota(domain)));
    }
  });

  it('is deterministic — the same candidates give the same sitting', () => {
    expect(composeWeightedSitting(fullCandidates(), WEIGHTED_QUOTA))
      .toEqual(composeWeightedSitting(fullCandidates(), WEIGHTED_QUOTA));
  });
});

describe('a weighted sitting when a domain runs dry', () => {
  it('still returns 60 when another domain can cover the shortfall', () => {
    const candidates = fullCandidates();
    candidates.pm = pool('pm', 2); // quota is 6
    const picked = composeWeightedSitting(candidates, WEIGHTED_QUOTA);
    expect(picked).toHaveLength(60);
    expect(new Set(picked).size).toBe(60);
  });

  it('takes everything the short domain had rather than dropping it', () => {
    const candidates = fullCandidates();
    candidates.pm = pool('pm', 2);
    const picked = composeWeightedSitting(candidates, WEIGHTED_QUOTA);
    expect(picked.filter((id) => id.startsWith('q.pm.'))).toEqual(pool('pm', 2));
  });

  it('never throws, even with every domain empty', () => {
    const empty = Object.fromEntries(
      DOMAINS.map((d) => [d, [] as string[]]),
    ) as Record<Domain, string[]>;
    expect(() => composeWeightedSitting(empty, WEIGHTED_QUOTA)).not.toThrow();
    expect(composeWeightedSitting(empty, WEIGHTED_QUOTA)).toEqual([]);
  });

  it('returns everything available when the whole bank cannot fill 60', () => {
    const thin = Object.fromEntries(DOMAINS.map((d) => [d, pool(d, 3)])) as Record<Domain, string[]>;
    expect(composeWeightedSitting(thin, WEIGHTED_QUOTA)).toHaveLength(18);
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

// The other two lengths. The composer is given the table rather than reaching
// for one, so these are the same invariants as above, asserted against a quota
// the function had no part in choosing.

describe('a weighted sitting at each of the three lengths', () => {
  it('is exactly as long as the quota it was given', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const picked = composeWeightedSitting(fullCandidates(), quotaFor(length));
      expect(picked, `${length}`).toHaveLength(length);
    }
  });

  it('matches its table exactly, domain by domain', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const picked = composeWeightedSitting(fullCandidates(), quotaFor(length));
      for (const domain of DOMAINS) {
        const fromDomain = picked.filter((id) => id.startsWith(`q.${domain}.`));
        expect(fromDomain, `${domain} at ${length}`).toHaveLength(weightedQuota(domain, length));
      }
    }
  });

  it('never repeats a question at any length', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const picked = composeWeightedSitting(fullCandidates(), quotaFor(length));
      expect(new Set(picked).size, `${length}`).toBe(picked.length);
    }
  });

  it('still takes each domain from the top, in the order given', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const picked = composeWeightedSitting(fullCandidates(), quotaFor(length));
      for (const domain of DOMAINS) {
        const fromDomain = picked.filter((id) => id.startsWith(`q.${domain}.`));
        expect(fromDomain, `${domain} at ${length}`).toEqual(
          pool(domain, weightedQuota(domain, length)),
        );
      }
    }
  });

  it('is deterministic at every length', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      expect(composeWeightedSitting(fullCandidates(), quotaFor(length))).toEqual(
        composeWeightedSitting(fullCandidates(), quotaFor(length)),
      );
    }
  });
});

describe('the shortfall redistribution at a shorter length', () => {
  // The redistribution reads its target from the quota it was given, not from
  // the 60 constant. Reading 60 there would return a 60-question sitting from a
  // 20-question request the moment any domain ran short — the exact class of
  // silently-wrong number this project is organised against.
  it('still returns a full-length sitting when a domain cannot fill its quota', () => {
    const candidates = fullCandidates();
    candidates.pm = pool('pm', 1); // the 20 quota is 2
    const picked = composeWeightedSitting(candidates, quotaFor(20));
    expect(picked).toHaveLength(20);
    expect(new Set(picked).size).toBe(20);
  });

  it('takes everything the short domain had rather than dropping it', () => {
    const candidates = fullCandidates();
    candidates.pm = pool('pm', 1);
    const picked = composeWeightedSitting(candidates, quotaFor(20));
    expect(picked.filter((id) => id.startsWith('q.pm.'))).toEqual(pool('pm', 1));
  });

  it('borrows heaviest domain first', () => {
    const candidates = fullCandidates();
    candidates.pm = []; // the whole quota of 2 has to be borrowed
    const picked = composeWeightedSitting(candidates, quotaFor(20));
    expect(picked).toHaveLength(20);
    // sysadmin's quota is 6 at this length; it lends the two.
    expect(picked.filter((id) => id.startsWith('q.sysadmin.'))).toHaveLength(8);
  });

  it('returns everything available when the whole bank cannot fill the length', () => {
    const thin = Object.fromEntries(DOMAINS.map((d) => [d, pool(d, 1)])) as Record<Domain, string[]>;
    expect(composeWeightedSitting(thin, quotaFor(20))).toHaveLength(6);
  });

  it('never exceeds the length it was asked for', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const generous = Object.fromEntries(
        DOMAINS.map((d) => [d, pool(d, 500)]),
      ) as Record<Domain, string[]>;
      expect(
        composeWeightedSitting(generous, quotaFor(length)).length,
        `${length}`,
      ).toBeLessThanOrEqual(length);
    }
  });
});

// ── Over the real bank ────────────────────────────────────────────────────
//
// The tests above compose from synthetic pools, which is what makes the
// arithmetic assertable domain by domain. These compose from the actual bank,
// grouped exactly as `domainCandidates` groups it — non-holdout, exam pool, by
// the id's own domain segment — because the invariants that matter most are
// claims about what a real sitting contains, and a fixture cannot make them.

/** The bank's own non-holdout exam pool, grouped by domain. */
function bankCandidates(): Record<Domain, string[]> {
  const pinned = new Set(loadPinnedHoldout().holdout);
  const byDomain = Object.fromEntries(DOMAINS.map((d) => [d, [] as string[]])) as Record<
    Domain,
    string[]
  >;

  for (const item of loadItems()) {
    if (item.pool !== 'exam') continue;
    if (pinned.has(item.id)) continue;
    // `q.<domain>.<competency>.<concept>.<nn>` — the same segment the seed
    // derives the domain column from, and the seed fails on an unknown one.
    const domain = item.id.split('.')[1] as Domain;
    expect(DOMAINS, item.id).toContain(domain);
    byDomain[domain].push(item.id);
  }

  return byDomain;
}

describe('a weighted sitting over the real bank', () => {
  const holdout = new Set(loadPinnedHoldout().holdout);

  it('is exactly its length at all three lengths', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      expect(
        composeWeightedSitting(bankCandidates(), quotaFor(length)),
        `${length}`,
      ).toHaveLength(length);
    }
  });

  it('matches its table exactly at all three lengths', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const picked = composeWeightedSitting(bankCandidates(), quotaFor(length));
      for (const domain of DOMAINS) {
        const fromDomain = picked.filter((id) => id.startsWith(`q.${domain}.`));
        expect(fromDomain, `${domain} at ${length}`).toHaveLength(weightedQuota(domain, length));
      }
    }
  });

  it('never repeats a question at any length', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const picked = composeWeightedSitting(bankCandidates(), quotaFor(length));
      expect(new Set(picked).size, `${length}`).toBe(picked.length);
    }
  });

  // The composer never sees a holdout id because the query filters them out.
  // Asserted here as well, over the pinned file rather than over a mock of it,
  // because "three independent places" is only true while each one is checked.
  it('never contains a holdout id at any length', () => {
    for (const length of WEIGHTED_SITTING_LENGTHS) {
      const picked = composeWeightedSitting(bankCandidates(), quotaFor(length));
      expect(picked.filter((id) => holdout.has(id)), `${length}`).toEqual([]);
    }
  });

  it('never has to redistribute over this bank — every domain covers 60', () => {
    const candidates = bankCandidates();
    for (const domain of DOMAINS) {
      expect(candidates[domain].length, domain).toBeGreaterThanOrEqual(
        weightedQuota(domain, QUESTIONS_PER_WEIGHTED_SITTING),
      );
    }
  });
});
