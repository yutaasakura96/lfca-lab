// The official domain weights, and what they mean for one sitting of 60.
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

/** Every sitting composed by weight is this long. Exam and practice mode both. */
export const QUESTIONS_PER_SITTING = 60;

/** The pass mark's denominator is this same 60 — see `score`, not here. */
export const EXAM_WEIGHT_PERCENT: Readonly<Record<Domain, number>> = {
  sysadmin: 30,
  cloud: 18,
  linux: 16,
  security: 14,
  devops: 12,
  pm: 10,
};

/**
 * How many of a sitting's 60 questions come from each domain.
 *
 * Deliberately a table rather than `round(percent / 100 * 60)`. The percentages
 * do not divide 60 evenly — 18% of 60 is 10.8, 16% is 9.6 — so rounding each
 * independently gives 61 questions, not 60. Someone has to absorb the
 * remainder, and which domain absorbs it is a decision rather than an
 * arithmetic accident. These are the figures the sixteen generated papers were
 * actually built to, so a sitting composed here and a sitting read off a paper
 * have the same shape.
 */
export const QUESTIONS_PER_DOMAIN: Readonly<Record<Domain, number>> = {
  sysadmin: 18,
  cloud: 11,
  linux: 10,
  security: 8,
  devops: 7,
  pm: 6,
};

/** The published percentage for one domain. */
export function weightPercent(domain: Domain): number {
  return EXAM_WEIGHT_PERCENT[domain];
}

/** How many questions of one domain a 60-question sitting asks. */
export function questionsPerSitting(domain: Domain): number {
  return QUESTIONS_PER_DOMAIN[domain];
}
