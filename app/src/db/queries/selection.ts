// Choosing what a sitting asks.
//
// The division of labour is deliberate and is what makes the numbers testable.
// The database answers *which questions are eligible, and in what order* — that
// is a set operation over an index, and it is where the holdout filter lives.
// The pure layer answers *how many of each to take*, which is arithmetic that
// can be asserted exhaustively without a database.
//
// ## The holdout filter is here, not inherited
//
// `is_holdout = false` appears in every eligibility query below. It is not
// there because the seed might have got it wrong — the seed refuses to commit
// unless exactly forty rows are marked. It is there because this is the third
// of three independent places, and independence is the whole point: the pinned
// file, the builder's refusal to write, and this filter would all have to fail
// together for a holdout item to reach a practice session. Trusting the seed
// here would collapse three checks into two.

import { sql } from 'drizzle-orm';
import type { Db } from '../client.ts';
import {
  composeDomainSitting,
  composeWeightedSitting,
  resolveDomainLength,
  type CandidatesByDomain,
  type DomainLength,
} from '../../domain/select.ts';
import { DOMAINS, type Domain } from '../../domain/weights.ts';

/**
 * Every question this candidate could be asked from one domain, best first.
 *
 * "Best first" is unseen-first: questions never answered come before ones that
 * were, and among those that were, least recently seen comes first. `random()`
 * breaks ties so two sessions run back to back do not serve an identical set.
 *
 * **A question served but never answered counts as unseen.** Its answer row, if
 * one exists at all, has a null `answered_at` — a flagged-but-unanswered
 * question — so `max(answered_at)` is null and `NULLS FIRST` puts it at the
 * front. That is the intended reading: you did not engage with it.
 *
 * The whole domain is returned rather than a quota's worth, because the caller
 * composing a weighted sitting needs spares to redistribute when another domain
 * runs short. A domain holds at most a few hundred rows.
 */
export async function domainCandidates(db: Db, userId: string, domain: Domain): Promise<string[]> {
  const result = await db.execute<{ id: string }>(sql`
    SELECT q.id
    FROM question q
    LEFT JOIN LATERAL (
      SELECT max(a.answered_at) AS last_seen
      FROM answer a
      JOIN attempt t ON t.id = a.attempt_id
      WHERE a.question_id = q.id AND t.user_id = ${userId}
    ) s ON true
    WHERE q.domain = ${domain}::domain
      AND q.pool = 'exam'
      AND q.is_holdout = false
    ORDER BY s.last_seen ASC NULLS FIRST, random()
  `);
  return result.rows.map((r) => r.id);
}

/** A 60-question practice sitting, composed by the official weights. */
export async function selectPracticeQuestions(db: Db, userId: string): Promise<string[]> {
  const lists = await Promise.all(DOMAINS.map((domain) => domainCandidates(db, userId, domain)));

  // Built key by key rather than via `Object.fromEntries`, which widens the key
  // type to `string` and would need a cast to get back — and a cast here would
  // silently survive a domain going missing, which is the one thing the
  // composer cannot detect.
  const candidates = {} as Record<Domain, readonly string[]>;
  DOMAINS.forEach((domain, i) => {
    candidates[domain] = lists[i] as string[];
  });

  return composeWeightedSitting(candidates satisfies CandidatesByDomain);
}

/** A single-domain sitting of 20, 40, or the whole domain. */
export async function selectDomainQuestions(
  db: Db,
  userId: string,
  domain: Domain,
  length: DomainLength,
): Promise<string[]> {
  const candidates = await domainCandidates(db, userId, domain);
  return composeDomainSitting(candidates, resolveDomainLength(length, candidates.length));
}

/**
 * The holdout sitting: the forty pinned items, and the only query in the app
 * that reads them.
 *
 * Ordered by id rather than randomly. This is sat once and scored, so it is a
 * fixed paper like the sixteen — a stable order means the sitting can be
 * resumed and reviewed against a known sequence.
 */
export async function selectHoldoutQuestions(db: Db): Promise<string[]> {
  const result = await db.execute<{ id: string }>(sql`
    SELECT id FROM question WHERE is_holdout = true ORDER BY id
  `);
  return result.rows.map((r) => r.id);
}
