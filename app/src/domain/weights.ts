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
 * How long a sitting composed by the official weights is: exam mode and
 * practice mode, both.
 *
 * Named for the *weighted* sitting specifically. Not every sitting is 60 — a
 * domain sitting is 20, 40 or the whole domain, and the holdout is 40 — so a
 * bare `QUESTIONS_PER_SITTING` would overclaim the one word the glossary pins
 * hardest.
 */
export const QUESTIONS_PER_WEIGHTED_SITTING = 60;

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
 * How many of a weighted sitting's 60 questions come from each domain.
 *
 * Deliberately a table rather than `round(percent / 100 * 60)`. The percentages
 * do not divide 60 evenly — 18% of 60 is 10.8, 16% is 9.6 — so rounding each
 * independently gives 61 questions, not 60. Someone has to absorb the
 * remainder, and which domain absorbs it is a decision rather than an
 * arithmetic accident. These are the figures the sixteen generated papers were
 * actually built to, so a sitting composed here and a sitting read off a paper
 * have the same shape.
 */
export const WEIGHTED_QUOTA: Readonly<Record<Domain, number>> = {
  sysadmin: 18,
  cloud: 11,
  linux: 10,
  security: 8,
  devops: 7,
  pm: 6,
};

/** The exam's published percentage for one domain. */
export function weightPercent(domain: Domain): number {
  return EXAM_WEIGHT_PERCENT[domain];
}

/** How many questions of one domain a 60-question weighted sitting asks. */
export function weightedQuota(domain: Domain): number {
  return WEIGHTED_QUOTA[domain];
}
