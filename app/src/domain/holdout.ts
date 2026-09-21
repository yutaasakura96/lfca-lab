// What home's holdout card shows (#60).
//
// Three states and no fourth. The holdout is sat once, so the card moves
// forward through them and never back: never sat, running, sat. The last is
// permanent — it is the number the whole feature exists to produce, and a card
// that went back to offering Start, or went dark, would hide it (#56).

import { outcomeFor } from './score.ts';

/** A finished holdout sitting, as the card needs it. */
export interface HoldoutResult {
  attemptId: string;
  score: number;
  questionCount: number;
  submittedAt: Date;
}

/** Where one candidate stands with the holdout, read in one snapshot. */
export interface HoldoutStanding {
  /** The holdout sitting still running, if there is one. */
  openId: string | null;
  /** The finished holdout sitting — by a submit or by its clock — if there is one. */
  sat: HoldoutResult | null;
}

export type HoldoutCard =
  | { kind: 'never' }
  | { kind: 'running'; attemptId: string }
  | {
      kind: 'sat';
      attemptId: string;
      score: number;
      questionCount: number;
      passMark: number;
      passed: boolean;
      /** `YYYY-MM-DD`, UTC. */
      day: string;
    };

/**
 * The card's state, decided from the standing.
 *
 * **Sat is checked first**, as the start endpoint checks it. Both at once is a
 * state `one_holdout_per_user` makes impossible; if it were ever found, the card
 * must not offer to resume what the endpoint would refuse to start.
 *
 * The mark and the verdict come from `outcomeFor`, the one definition of each,
 * so the card and the review cannot disagree about whether 30 of 40 passes.
 */
export function holdoutCard(standing: HoldoutStanding): HoldoutCard {
  if (standing.sat !== null) {
    const { attemptId, score, questionCount, submittedAt } = standing.sat;
    const outcome = outcomeFor(score, questionCount);
    return {
      kind: 'sat',
      attemptId,
      score,
      questionCount,
      passMark: outcome.passMark,
      passed: outcome.passed,
      day: utcDay(submittedAt),
    };
  }
  if (standing.openId !== null) return { kind: 'running', attemptId: standing.openId };
  return { kind: 'never' };
}

/**
 * The calendar day of an instant, in UTC.
 *
 * UTC because every other time these screens print is UTC and says so, and the
 * server renders this with no idea where the reader is. A day in the reader's
 * own zone would need the browser; a day in the server's would be UTC anyway,
 * without admitting it.
 */
export function utcDay(at: Date): string {
  return at.toISOString().slice(0, 10);
}
