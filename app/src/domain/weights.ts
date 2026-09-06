// The official domain weights, and what they mean for one weighted sitting.
//
// This is the first module of the pure layer, and it sets that layer's rule:
// data in, data out. No database handle, no React, no reading of the clock. A
// function here can be tested by calling it, which is the whole reason anything
// that decides a number lives in this directory.
//
// The numbers are the real exam's published weights. They are not derived from
// this repo's bank — the bank was built to match *them*. Nothing here reads a
// file, so this module cannot drift by having been given the wrong one; the
// check that the bank still agrees with these figures belongs to the bank's own
// integrity assertions, not here.

/**
 * The six domains, by slug. These slugs are the vocabulary everywhere — the
 * question id's second segment, the database enum, the URL. Never "category",
 * never "section".
 *
 * Ordered by weight, heaviest first, because every place that shows all six
 * shows them in that order.
 */
export const DOMAINS = ['sysadmin', 'cloud', 'linux', 'security', 'devops', 'pm'] as const;

/** One of the six. */
export type Domain = (typeof DOMAINS)[number];

/**
 * How long a **full-length** sitting composed by the official weights is.
 *
 * Exam mode is always this; practice mode's longest choice is this. It is the
 * length the sixteen generated papers were built to, and the one the published
 * percentages were pinned against.
 *
 * Named for the *weighted* sitting specifically. Not every sitting is 60 — a
 * domain sitting is 20, 40 or the whole domain, a practice sitting is 20, 40 or
 * 60, and the holdout is 40 — so a bare `QUESTIONS_PER_SITTING` would overclaim
 * the one word the glossary pins hardest.
 */
export const QUESTIONS_PER_WEIGHTED_SITTING = 60;

/**
 * The lengths a weighted sitting can be, shortest first.
 *
 * Exam mode does not choose — it is always 60. This is practice mode's
 * selector, and 20 is its default (see {@link DEFAULT_PRACTICE_LENGTH}).
 *
 * Distinct from a domain sitting's `20 | 40 | 'all'`: `'all'` means "however
 * many that domain has", which is a fact about the pool, whereas these three
 * are lengths the composer must hit exactly.
 */
export const WEIGHTED_SITTING_LENGTHS = [20, 40, 60] as const;

/** One of the three lengths a weighted sitting can be. */
export type WeightedSittingLength = (typeof WEIGHTED_SITTING_LENGTHS)[number];

/**
 * What a practice sitting is unless the candidate says otherwise.
 *
 * 20, on the reasoning that set domain mode's default: roughly a fifteen-minute
 * sitting is the one that actually gets done on a weeknight. 60 stays available
 * because a full-length untimed rehearsal is the one sitting shape that is exam
 * mode minus the pressure.
 */
export const DEFAULT_PRACTICE_LENGTH: WeightedSittingLength = 20;

/** How many questions of each domain one weighted sitting asks. */
export type DomainQuota = Readonly<Record<Domain, number>>;

/**
 * The exam's published domain weights, as percentages. They total 100.
 *
 * Kept beside the quota table below rather than folded into it, because the two
 * say different things: this is what the exam publishes, and the quota is what
 * this project allocates. Holding both is what lets a test assert the second
 * never drifts far from the first.
 */
export const EXAM_WEIGHT_PERCENT: Readonly<Record<Domain, number>> = {
  sysadmin: 30,
  cloud: 18,
  linux: 16,
  security: 14,
  devops: 12,
  pm: 10,
};

/**
 * How many questions come from each domain, at each of the three lengths.
 *
 * Deliberately three hand-pinned tables rather than `round(percent / 100 * n)`.
 * The percentages divide none of these three lengths evenly — 18% of 60 is
 * 10.8, 16% is 9.6 — so rounding each domain independently gives 61 questions
 * at 60, and misses at the other two as well. Someone has to absorb the
 * remainder, and which domain absorbs it is a decision rather than an
 * arithmetic accident.
 *
 * That is why a shorter practice sitting was **not** the one-line change PRD §7
 * assumed: the decision has to be taken again for each length, and a test
 * asserts each table against the length it claims and against the percentage it
 * represents, rather than against a re-derivation of itself.
 *
 * The 60 row is the figures the sixteen generated papers were actually built to,
 * so a sitting composed here and a sitting read off a paper have the same shape.
 */
export const WEIGHTED_QUOTA_BY_LENGTH: Readonly<Record<WeightedSittingLength, DomainQuota>> = {
  20: { sysadmin: 6, cloud: 4, linux: 3, security: 3, devops: 2, pm: 2 },
  40: { sysadmin: 12, cloud: 7, linux: 6, security: 6, devops: 5, pm: 4 },
  60: { sysadmin: 18, cloud: 11, linux: 10, security: 8, devops: 7, pm: 6 },
};

/**
 * The full-length table: 18/11/10/8/7/6.
 *
 * Defined as the 60 entry above rather than retyped, so the historical name and
 * the length table cannot come to hold different numbers.
 */
export const WEIGHTED_QUOTA: DomainQuota =
  WEIGHTED_QUOTA_BY_LENGTH[QUESTIONS_PER_WEIGHTED_SITTING];

/** The exam's published percentage for one domain. */
export function weightPercent(domain: Domain): number {
  return EXAM_WEIGHT_PERCENT[domain];
}

/** The whole quota table for one length. */
export function quotaFor(length: WeightedSittingLength): DomainQuota {
  return WEIGHTED_QUOTA_BY_LENGTH[length];
}

/**
 * How many questions of one domain a weighted sitting asks.
 *
 * The length defaults to 60 — the length this function answered for before
 * there were three of them, so every full-length caller reads the same number
 * it always did.
 */
export function weightedQuota(
  domain: Domain,
  length: WeightedSittingLength = QUESTIONS_PER_WEIGHTED_SITTING,
): number {
  return WEIGHTED_QUOTA_BY_LENGTH[length][domain];
}
