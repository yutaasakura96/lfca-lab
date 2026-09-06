// The six domains, with this candidate's coverage of each.
//
// The counterpart to `exams.ts`: a screen read, for the screen that helps
// choose where to study. It is deliberately **not** in `selection.ts`, whose
// own header pins that file's remit — "the database answers which questions are
// eligible, and in what order". Nothing here chooses anything. It reports
// history so a person can choose, and keeping the two files apart is the
// cheapest guard against the next reader wiring one into the other, which is
// the thing CONTEXT.md rules out by name: *"If a proposal starts using past
// performance to decide what to serve, it is out of scope."*
//
// One query for all six rather than six. Not for speed — nothing at this size
// is slow — but because six round trips is six chances for the rows to disagree
// with each other about what "seen" means.

import { sql } from 'drizzle-orm';
import type { Db } from '../client.ts';
import { DOMAINS, type Domain } from '../../domain/weights.ts';

/**
 * The bank writes a competency as `"Security Fundamentals :: Compliance"` — the
 * domain's name, then the competency inside it.
 *
 * Both halves are read straight out of that string rather than from a label map
 * in the app, so a name on a screen cannot drift from the content it names.
 * Exported because `listOpenSittings` needs the domain's name too, and the
 * separator is the sort of literal that gets typed differently the second time.
 * Both fragments assume the `question` table is aliased **`q`**.
 */
export const DOMAIN_NAME = sql`split_part(q.competency, ' :: ', 1)`;
export const COMPETENCY_NAME = sql`split_part(q.competency, ' :: ', 2)`;

export interface DomainListRow {
  domain: Domain;
  /**
   * The domain's name as the bank spells it — "Security Fundamentals".
   *
   * Read from `question.competency`'s own first half rather than from a label
   * map in the app, so it cannot come to disagree with the content it names.
   */
  name: string;
  /** The competencies inside it, without the repeated domain half. Alphabetical. */
  competencies: string[];
  /**
   * How many questions a sitting in this domain could draw on.
   *
   * The same predicate `domainCandidates` selects by, holdout filter included —
   * so the "All N" the chip advertises is the sitting `length: 'all'` actually
   * produces, not an optimistic total.
   */
  available: number;
  /**
   * Distinct questions in this domain this candidate has **answered**.
   *
   * Answered, not merely rowed: a flagged-but-unanswered question has an answer
   * row with a null `answered_at`, and doc 04 §6 keeps it *unseen* for
   * selection because the candidate never engaged with it. Counting it here
   * would put a different fact on the screen under the same word, and the gap
   * would only ever show up as a coverage number that never matches what gets
   * served.
   */
  seen: number;
  /** The most recent of those answers, or `null` if there are none. */
  lastPractisedAt: Date | null;
}

/**
 * Every domain, with this candidate's history against it.
 *
 * Scoped to one user throughout — the join carries `user_id`, so another
 * candidate's work contributes nothing. History from **every** mode counts: an
 * exam sitting answers Security questions, and those questions are seen by the
 * only definition selection uses.
 *
 * A domain never touched comes back `0` and `null`, so the screen can say
 * "0 of N seen" and "not started" rather than showing a blank (PRD §4).
 */
export async function listDomains(db: Db, userId: string): Promise<DomainListRow[]> {
  const result = await db.execute<{
    domain: Domain;
    name: string;
    competencies: string[];
    available: number;
    seen: number;
    // A raw `execute` returns the driver's own value, unmapped: a timestamptz
    // arrives as a string. Typing it as a Date here would compile and then
    // fail at the first `.toISOString()` on the screen.
    last_practised_at: Date | string | null;
  }>(sql`
    SELECT
      q.domain,
      -- min() is only there to satisfy the grouping: every row in a domain
      -- carries the same first half.
      min(${DOMAIN_NAME}) AS name,
      array_agg(DISTINCT ${COMPETENCY_NAME}
                ORDER BY ${COMPETENCY_NAME}) AS competencies,
      -- DISTINCT, and not for tidiness. The left join below multiplies a
      -- question by its answer rows, so a question answered in three sittings
      -- would be counted three times — inflating the "All N" chip for exactly
      -- the candidate who has done the most work.
      count(DISTINCT q.id)::int AS available,
      count(DISTINCT a.question_id)::int AS seen,
      max(a.answered_at) AS last_practised_at
    FROM question q
    LEFT JOIN answer a
      ON a.question_id = q.id
     AND a.answered_at IS NOT NULL
     AND a.attempt_id IN (SELECT t.id FROM attempt t WHERE t.user_id = ${userId})
    WHERE q.pool = 'exam' AND q.is_holdout = false
    GROUP BY q.domain
    -- Ordered against the one place the order is decided. The Postgres enum
    -- declares the six in a different order from DOMAINS, and DOMAINS is the
    -- one every screen shows: heaviest weight first.
    ORDER BY array_position(${sql.param([...DOMAINS])}::text[], q.domain::text)
  `);

  return result.rows.map((row) => ({
    domain: row.domain,
    name: row.name,
    competencies: row.competencies,
    available: row.available,
    seen: row.seen,
    lastPractisedAt:
      row.last_practised_at === null
        ? null
        : row.last_practised_at instanceof Date
          ? row.last_practised_at
          : new Date(row.last_practised_at),
  }));
}
