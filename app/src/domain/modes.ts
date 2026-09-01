// The four ways of sitting the same questions, and what each one implies.
//
// The whole product is these four modes. They differ in composition, clock and
// when feedback appears — not in how a question renders or where the data comes
// from. Everything that varies between them is stated here once, as data, so no
// screen or query has to remember it.

import { EXAM_TIME_LIMIT_SECONDS, HOLDOUT_TIME_LIMIT_SECONDS } from './clock.ts';
import { QUESTIONS_PER_WEIGHTED_SITTING } from './weights.ts';

export const ATTEMPT_MODES = ['exam', 'practice', 'domain', 'holdout'] as const;
export type AttemptMode = (typeof ATTEMPT_MODES)[number];

/** The holdout is forty questions, sat once. */
export const HOLDOUT_QUESTION_COUNT = 40;

/**
 * How long a sitting in this mode has, or `null` for no clock at all.
 *
 * `null` is not "unlimited pending a decision" — it means the attempt can never
 * expire, so practice and domain sittings can sit unfinished indefinitely
 * without becoming something that needs cleaning up.
 */
export function timeLimitFor(mode: AttemptMode): number | null {
  switch (mode) {
    case 'exam':
      return EXAM_TIME_LIMIT_SECONDS;
    case 'holdout':
      return HOLDOUT_TIME_LIMIT_SECONDS;
    case 'practice':
    case 'domain':
      return null;
  }
}

/** Whether a sitting in this mode produces a score at all. */
export function isScored(mode: AttemptMode): boolean {
  return mode === 'exam' || mode === 'holdout';
}

/**
 * Whether a sitting in this mode can flag questions for review.
 *
 * A separate question from `isScored`, though today the same two modes answer
 * yes to both. Flagging follows **free navigation**, not scoring: you can flag
 * a question because you can come back to it. Practice and domain mode are
 * forward-only, so a flag there would be a mark on something already behind
 * you. Reusing the scoring predicate would work until the first mode where the
 * two diverge, and would then be wrong somewhere nobody was looking.
 */
export function allowsFlagging(mode: AttemptMode): boolean {
  return mode === 'exam' || mode === 'holdout';
}

/**
 * How many questions a sitting asks, where the mode alone decides it.
 *
 * Domain mode is the exception — its length is chosen by the candidate and
 * capped by the domain's pool — so it is not answered here.
 */
export function questionCountFor(mode: Exclude<AttemptMode, 'domain'>): number {
  return mode === 'holdout' ? HOLDOUT_QUESTION_COUNT : QUESTIONS_PER_WEIGHTED_SITTING;
}
