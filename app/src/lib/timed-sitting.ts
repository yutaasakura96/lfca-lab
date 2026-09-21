// Everything a timed sitting sends the browser, assembled in one place.
//
// Two sittings take the timed arrangement — a paper and the holdout — and they
// differ only in where their questions are read from and what the screen calls
// them. This is the page's read, lifted out of the page so that what crosses to
// the browser can be asserted as data: PRD E3 says no correctness indicator, no
// `why` and no running score is reachable between start and submit, and "the
// component does not render it" is not the same claim as "the bytes are not
// there".

import type { Db } from '../db/client.ts';
import { getAttemptAnswers } from '../db/queries/answer.ts';
import type { AttemptRow } from '../db/queries/attempt.ts';
import { getSittingQuestions, type SittingQuestion } from '../db/queries/paper.ts';
import { deadlineOf, remainingToDeadline } from '../domain/clock.ts';
import { resumeSeq, type RecordedState } from '../domain/navigator.ts';
import { passMark } from '../domain/score.ts';
import { outcomeOf, type SubmitOutcome } from '../domain/submission.ts';
import { timedSittingCopy, type TimedSittingCopy } from '../domain/timed-sitting.ts';
import { finaliseIfExpired } from './auto-submit.ts';

/** What the timed screen is handed. Mirrors `SittingProps`, which is typed against it. */
export interface TimedSittingData {
  attemptId: string;
  copy: TimedSittingCopy;
  passMark: number;
  initialSeq: number;
  deadline: string | null;
  serverNow: string;
  questions: SittingQuestion[];
  initial: Record<string, RecordedState>;
  finished: SubmitOutcome | null;
  remainingAtClose: number | null;
}

export type TimedSittingLoad =
  | { kind: 'missing' }
  /** This read closed an expired sitting and its review exists to be sent to. */
  | { kind: 'closed-on-read'; attemptId: string }
  | { kind: 'ready'; data: TimedSittingData };

/**
 * Read a timed sitting for its screen, finalising it first if its clock ran out.
 *
 * **Opening a sitting is one of the four touches that finalise it** (doc 03
 * §6). A sitting this read closed is sent to its review — when it has one. The
 * holdout's review is #59's, so until then an expired holdout opens on its
 * outcome instead, which is what every other finished sitting does on reload.
 */
export async function loadTimedSitting(
  db: Db,
  userId: string,
  found: AttemptRow,
  now: Date,
): Promise<TimedSittingLoad> {
  if (found.mode !== 'exam' && found.mode !== 'holdout') return { kind: 'missing' };
  if (found.timeLimitSeconds === null) return { kind: 'missing' };

  const copy = timedSittingCopy({
    mode: found.mode,
    examId: found.examId,
    timeLimitSeconds: found.timeLimitSeconds,
  });

  const { attempt, closedOnRead } = await finaliseIfExpired(db, found, now);
  if (closedOnRead && copy.reviewable) return { kind: 'closed-on-read', attemptId: attempt.id };

  const [read, answers] = await Promise.all([
    getSittingQuestions(db, attempt),
    getAttemptAnswers(db, userId, attempt.id),
  ]);

  // Rebuilt field by field. A composed read carries the competency and the
  // concept id for the practice screen's question head; the timed screen shows
  // neither, and a field nobody renders is a field that still travels.
  const questions: SittingQuestion[] = read.map((question) => ({
    id: question.id,
    seq: question.seq,
    stem: question.stem,
    options: question.options.map((option) => ({ ref: option.ref, text: option.text })),
  }));

  // An attempt with no questions cannot be rendered. Not a state this app can
  // produce — a composed set is written in the attempt's own transaction.
  if (questions.length === 0) return { kind: 'missing' };

  // Every question gets an entry, answered or not, so the client never has to
  // decide what a missing key means.
  const initial: Record<string, RecordedState> = {};
  for (const question of questions) initial[question.id] = { optionRef: null, flagged: false };
  for (const answer of answers) {
    if (initial[answer.questionId] === undefined) continue;
    initial[answer.questionId] = { optionRef: answer.optionRef, flagged: answer.flagged };
  }

  // A finished sitting opens on its outcome, read from the row that recorded
  // it; nothing is scored again here.
  const finished: SubmitOutcome | null =
    attempt.submittedAt === null || attempt.submitReason === null
      ? null
      : outcomeOf({
          score: attempt.score,
          questionCount: attempt.questionCount,
          reason: attempt.submitReason,
        });

  return {
    kind: 'ready',
    data: {
      attemptId: attempt.id,
      copy,
      passMark: passMark(questions.length),
      // Derived from the answers rather than stored (PRD E5).
      initialSeq: resumeSeq(questions, answers),
      deadline: deadlineOf(attempt)?.toISOString() ?? null,
      serverNow: now.toISOString(),
      questions,
      initial,
      finished,
      // The deadline measured against `submitted_at` rather than against now,
      // so a page opened a day later shows the reading the sitting ended on.
      remainingAtClose:
        attempt.submittedAt === null
          ? null
          : remainingToDeadline(deadlineOf(attempt), attempt.submittedAt),
    },
  };
}
