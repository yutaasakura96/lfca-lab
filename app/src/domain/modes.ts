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
 * **Only two modes qualify.** Exam mode is always 60 and the holdout is always
 * 40, so the mode is the whole answer. Domain mode's length is the candidate's
 * choice capped by the pool, and practice mode's is the candidate's choice of
 * 20, 40 or 60 (`WEIGHTED_SITTING_LENGTHS`) — for either of those the mode
 * cannot answer, so the type refuses to be asked.
 *
 * Practice was excluded when its selector arrived, and the narrowing is the
 * point: this function used to answer 60 for it, which was true while 60 was
 * the only length. Leaving it would have left a function reporting a number
 * correct for one of three choices, and the compiler now refuses the caller
 * that would have read it.
 */
export function questionCountFor(mode: Exclude<AttemptMode, 'domain' | 'practice'>): number {
  return mode === 'holdout' ? HOLDOUT_QUESTION_COUNT : QUESTIONS_PER_WEIGHTED_SITTING;
}
