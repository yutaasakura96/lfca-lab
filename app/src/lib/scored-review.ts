// What the scored review says about a sitting, assembled in one place.
//
// Two sittings are scored — a paper and the holdout — and the review's scored
// branch was written when a paper was the only one. Everything it said beyond
// the score belonged to the paper: the sitting's ordinal, the best and first
// attempts, and the offer to sit it again. The holdout has none of those, and
// offering a re-sit of a sitting that can be sat once is the single thing its
// review must never do (#59).
//
// So all three hang off one field, `paper`, which is `null` for the holdout.
// No paper means no re-sit, no ordinal and no first-attempt line together —
// structurally, rather than three conditions that could disagree. The read is
// lifted out of the page for the reason `timed-sitting.ts` gives: the page is a
// server component the suite cannot render, and "the screen offers no re-sit"
// is then a value a test can hold.

import type { Db } from '../db/client.ts';
import type { AttemptRow } from '../db/queries/attempt.ts';
import { openAttemptForExam } from '../db/queries/exams.ts';
import { getReviewContext, type ReviewContext } from '../db/queries/review.ts';
import { timeUsedSeconds } from '../domain/review.ts';
import { outcomeOf, type SubmitOutcome } from '../domain/submission.ts';
import { timedSittingCopy } from '../domain/timed-sitting.ts';

/** The paper this sitting was a sitting of, and its history. */
export interface ReviewedPaper {
  examId: string;
  /** Another sitting of this paper still running, which a re-sit resumes rather than duplicates. */
  openAttemptId: string | null;
  /** `null` only when the row could not be read. */
  context: ReviewContext | null;
}

export interface ScoredReviewData {
  title: string;
  back: { href: string; label: string };
  submittedAt: Date;
  outcome: SubmitOutcome;
  elapsedSeconds: number;
  /** `null` for the holdout: sat once, so nothing to re-sit and no first to tell from a best. */
  paper: ReviewedPaper | null;
}

export type ScoredReviewLoad = { kind: 'missing' } | { kind: 'ready'; data: ScoredReviewData };

export async function loadScoredReview(
  db: Db,
  userId: string,
  attempt: AttemptRow,
): Promise<ScoredReviewLoad> {
  if (attempt.mode !== 'exam' && attempt.mode !== 'holdout') return { kind: 'missing' };
  if (attempt.timeLimitSeconds === null) return { kind: 'missing' };
  if (attempt.submittedAt === null || attempt.submitReason === null) return { kind: 'missing' };

  // The same words the sitting used for itself, so the review cannot call a
  // holdout "Practice exam" or send it back to the sixteen.
  const copy = timedSittingCopy({
    mode: attempt.mode,
    examId: attempt.examId,
    timeLimitSeconds: attempt.timeLimitSeconds,
  });

  return {
    kind: 'ready',
    data: {
      title: copy.title,
      back: copy.back,
      submittedAt: attempt.submittedAt,
      outcome: outcomeOf({
        score: attempt.score,
        questionCount: attempt.questionCount,
        reason: attempt.submitReason,
      }),
      elapsedSeconds: timeUsedSeconds(
        attempt.startedAt,
        attempt.submittedAt,
        attempt.timeLimitSeconds,
      ),
      paper: await paperOf(db, userId, attempt),
    },
  };
}

async function paperOf(
  db: Db,
  userId: string,
  attempt: AttemptRow,
): Promise<ReviewedPaper | null> {
  const examId = attempt.examId;
  if (attempt.mode !== 'exam' || examId === null) return null;

  const [context, openAttemptId] = await Promise.all([
    getReviewContext(db, userId, attempt.id),
    // The existing helper, not a fourth copy of its predicate. "The oldest
    // unfinished sitting of this paper" is one question, and the API route that
    // refuses a second live sitting already asks it this way.
    openAttemptForExam(db, userId, examId),
  ]);

  return { examId, openAttemptId, context };
}
