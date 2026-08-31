// Composing a sitting from candidates the database has already ordered.
//
// The division of labour matters. The query decides *which* questions are
// eligible and in *what order* — non-holdout, exam pool, unseen before seen,
// then least recently seen. This module decides *how many* of each to take. The
// ordering stays in SQL because that is where "unseen first" is expressible as
// one pass over an index; the arithmetic lives here because that is where it
// can be asserted exhaustively rather than sampled.
//
// Nothing here shuffles. Two callers handing over the same candidates get the
// same sitting, which is what makes a failure reproducible.

import { DOMAINS, QUESTIONS_PER_WEIGHTED_SITTING, weightedQuota, type Domain } from './weights.ts';

/** A domain's eligible questions, best candidate first. */
export type CandidatesByDomain = Readonly<Record<Domain, readonly string[]>>;

/** What the candidate may pick for a domain sitting. */
export type DomainLength = 20 | 40 | 'all';

/**
 * How many questions a domain sitting actually asks.
 *
 * A request for 40 from a domain holding 30 is a request for 30. Never an
 * error, and never 40 with something invented to pad it — a short session is a
 * fact about the domain, not a failure.
 */
export function resolveDomainLength(choice: DomainLength, available: number): number {
  if (choice === 'all') return available;
  return Math.min(choice, available);
}

/** The top `length` candidates, in the order the database gave them. */
export function composeDomainSitting(candidates: readonly string[], length: number): string[] {
  return dedupe(candidates).slice(0, Math.max(0, length));
}

/**
 * A 60-question sitting composed by the official domain weights.
 *
 * Each domain contributes its quota, taken off the top of its candidates so the
 * database's unseen-first ordering survives intact.
 *
 * **When a domain cannot fill its quota**, the shortfall is redistributed to the
 * domains that still have candidates, heaviest first. The alternative — a
 * 57-question sitting — would quietly change what a score means, and a score
 * that quietly changes meaning is the failure this project is organised to
 * avoid. The redistribution is reachable only if a domain's entire non-holdout
 * exam pool is smaller than its quota; the smallest pool in the bank is 100
 * against a quota of 6, so in practice it never fires. It exists so that a
 * future bank cannot produce a short sitting in silence.
 *
 * If the whole bank cannot fill 60, this returns everything there is. That is
 * the one case where a short sitting is the only honest answer.
 */
export function composeWeightedSitting(candidates: CandidatesByDomain): string[] {
  const remaining = new Map<Domain, string[]>(
    DOMAINS.map((domain) => [domain, dedupe(candidates[domain])]),
  );

  const picked: string[] = [];
  const takeFrom = (domain: Domain, count: number): void => {
    const pool = remaining.get(domain) as string[];
    picked.push(...pool.splice(0, count));
  };

  for (const domain of DOMAINS) {
    takeFrom(domain, Math.min(weightedQuota(domain), (remaining.get(domain) as string[]).length));
  }

  // Redistribute any shortfall. One at a time, heaviest domain first, so the
  // borrowed questions land where the exam weights say they matter most.
  while (picked.length < QUESTIONS_PER_WEIGHTED_SITTING) {
    const donor = DOMAINS.find((d) => (remaining.get(d) as string[]).length > 0);
    if (donor === undefined) break;
    takeFrom(donor, 1);
  }

  return picked;
}

/** Preserves order, keeps the first occurrence. */
function dedupe(ids: readonly string[]): string[] {
  return [...new Set(ids)];
}
