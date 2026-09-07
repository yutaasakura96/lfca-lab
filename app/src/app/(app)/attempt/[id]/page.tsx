import { notFound, redirect } from 'next/navigation';
import { db } from '../../../../db/client.ts';
import { getAttemptAnswers } from '../../../../db/queries/answer.ts';
import { getAttemptForUser, type AttemptRow } from '../../../../db/queries/attempt.ts';
import { getQuestionKey, getRecordedVerdicts } from '../../../../db/queries/feedback.ts';
import { getComposedQuestions, getPaperQuestions } from '../../../../db/queries/paper.ts';
import { deadlineOf, remainingToDeadline } from '../../../../domain/clock.ts';
import {
  firstUnansweredSeq,
  resumeSeq,
  type GradedRecord,
  type RecordedState,
} from '../../../../domain/navigator.ts';
import { passMark } from '../../../../domain/score.ts';
import { outcomeOf, type SubmitOutcome } from '../../../../domain/submission.ts';
import { ComposedSitting } from '../../../../components/ComposedSitting.tsx';
import type { AnswerFeedback } from '../../../../components/ComposedQuestion.tsx';
import { Sitting } from '../../../../components/Sitting.tsx';
import { finaliseIfExpired } from '../../../../lib/auto-submit.ts';
import { requireSession } from '../../../../lib/session.ts';

export const metadata = { title: 'Sitting — LFCA Practice' };

/**
 * The sitting.
 *
 * A server component, and that is the security design rather than a
 * performance choice: the answer key lives in columns this page's queries never
 * select, so there is no payload for it to travel in. What reaches the browser
 * is sixty stems, four option texts each, and which option this candidate
 * already chose.
 *
 * All sixty are sent at once because the navigator has to report on all sixty
 * at once, and because doc 10 §4 is explicit that the paper is fetched once at
 * start rather than a question at a time. Answers and flags are read back from
 * the database on every load, which is what makes a reload restore the sitting
 * rather than reset it.
 *
 * **The clock reaches the browser the same way the paper does**: computed here
 * from `started_at` and the limit, and sent as one absolute instant. The
 * browser is never told when the sitting began or how long it was given, so
 * there is nothing on that side to recompute a deadline from — only one to
 * count down to. `serverNow` travels with it so the countdown can be anchored
 * on this machine's clock rather than the reader's.
 *
 * **Opening a sitting is one of the touches that finalises it.** If the ninety
 * minutes elapsed while the tab was closed, the attempt is already over: it is
 * submitted as it stood, through the ordinary submit path, and this page sends
 * the reader to the review rather than presenting a paper nothing can be
 * written to. Only a sitting *this* read closed is redirected — one finalised
 * on an earlier visit opens on its outcome, the same as any finished sitting
 * being reopened.
 */
export default async function SittingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const found = await getAttemptForUser(db, session.user.id, id);

  // Not found, never forbidden. A 403 would confirm the row exists and belongs
  // to somebody, which is exactly what an attacker probing ids wants to learn.
  if (found === null) notFound();

  // One route, two screens, and the branch is the stored mode — the same column
  // the answer endpoint branches its response on. A timed sitting has a paper,
  // a clock and a submit; a composed one has a frozen question set, no clock at
  // all, and its marking as it goes. They share the outbox, the tile and the
  // bank's prose rendering and almost nothing else, so they are two components
  // rather than one holding both sets of behaviour behind flags.
  if (found.mode === 'exam') return examSitting(session.user.id, found);
  if (found.mode === 'holdout') {
    // The holdout is composed like these two and timed and scored like an exam
    // (PRD H1), so it belongs to neither screen unchanged. It cannot be started
    // — #34 ships its card disabled — so this is a guard rather than a gap, and
    // a guard is what stops it silently rendering without the clock it must
    // have on the day somebody builds the way in.
    notFound();
  }
  return composedSitting(session.user.id, found);
}

async function examSitting(userId: string, found: AttemptRow) {
  const examId = found.examId;
  // Unreachable: `attempt_exam_iff_exam_mode` makes mode and paper inseparable.
  if (examId === null) notFound();

  const { attempt, closedOnRead } = await finaliseIfExpired(db, found, new Date());
  if (closedOnRead) redirect(`/attempt/${attempt.id}/review`);

  const [questions, answers] = await Promise.all([
    getPaperQuestions(db, examId),
    getAttemptAnswers(db, userId, attempt.id),
  ]);

  if (questions.length === 0) notFound();

  // Every question gets an entry, answered or not, so the client never has to
  // decide what a missing key means — and so a question with nothing recorded
  // is unanswered rather than unknown.
  const initial: Record<string, RecordedState> = {};
  for (const question of questions) initial[question.id] = { optionRef: null, flagged: false };
  for (const answer of answers) {
    if (initial[answer.questionId] === undefined) continue;
    initial[answer.questionId] = { optionRef: answer.optionRef, flagged: answer.flagged };
  }

  // Where the sitting reopens. Derived from the answers rather than stored:
  // the question whose row was written most recently is the one last engaged
  // with (PRD E5). A fresh sitting has touched nothing and opens on question 1.
  const initialSeq = resumeSeq(questions, answers);

  // Dynamic by construction: the page reads the session and the clock, so it
  // cannot be cached. Stating the instant it was rendered is what lets the
  // browser correct its own.
  const serverNow = new Date();

  // A sitting that is already finalised opens on its score rather than on a
  // question. Every write into it would be refused, so presenting it as
  // answerable — with a countdown still running — would be the screen claiming
  // something the server has already closed. The outcome is read from the row
  // that recorded it; nothing is scored again here.
  const finished: SubmitOutcome | null =
    attempt.submittedAt === null || attempt.submitReason === null
      ? null
      : outcomeOf({
          score: attempt.score,
          questionCount: attempt.questionCount,
          reason: attempt.submitReason,
        });

  // What the clock read at the moment it closed — the deadline measured against
  // `submitted_at` rather than against now, so a page opened a day later shows
  // the reading the sitting ended on rather than a large negative one.
  const remainingAtClose =
    attempt.submittedAt === null
      ? null
      : remainingToDeadline(deadlineOf(attempt), attempt.submittedAt);

  return (
    <div className="page page--sitting">
      <Sitting
        attemptId={attempt.id}
        examNumber={examId.replace('exam-', '')}
        passMark={passMark(questions.length)}
        initialSeq={initialSeq}
        deadline={deadlineOf(attempt)?.toISOString() ?? null}
        serverNow={serverNow.toISOString()}
        questions={questions}
        initial={initial}
        finished={finished}
        remainingAtClose={remainingAtClose}
      />
    </div>
  );
}


/**
 * A practice or domain sitting.
 *
 * **Nothing here reads a clock, and there is nothing to finalise.** Those
 * modes carry `time_limit_seconds = null` (doc 04 §5.1), so they never expire
 * and no lazy submit applies — which is why `finaliseIfExpired` is absent
 * rather than called and ignored.
 *
 * What crosses to the browser is the frozen set of questions, the choices
 * already made, and **the verdict of each of those choices** — which is not the
 * answer key: it says whether the option this candidate picked was right, on a
 * question they have already been told about to their face. Nothing is sent
 * about a question they have not answered.
 */
async function composedSitting(userId: string, attempt: AttemptRow) {
  // A finished sitting has nothing to answer, so it goes to its review — the
  // route that reads a sitting back. **That screen is #38's**: it branches on
  // `examId` today and 404s on a composed sitting. The state is unreachable
  // from any screen in this slice, because Finish is #37's; this is the guard
  // that will still be right when both land.
  if (attempt.submittedAt !== null) redirect(`/attempt/${attempt.id}/review`);

  const [questions, verdicts] = await Promise.all([
    getComposedQuestions(db, attempt.id),
    getRecordedVerdicts(db, userId, attempt.id),
  ]);

  // An attempt whose questions are missing cannot be rendered. It is not a
  // state this app can produce — the set is written in the same transaction as
  // the attempt (doc 04 §5.4) — so it is refused rather than repaired.
  if (questions.length === 0) notFound();

  // Every question gets an entry, answered or not, so the client never has to
  // decide what a missing key means.
  const initial: Record<string, GradedRecord> = {};
  for (const question of questions) initial[question.id] = { optionRef: null, isCorrect: null };
  for (const verdict of verdicts) {
    if (initial[verdict.questionId] === undefined) continue;
    initial[verdict.questionId] = {
      optionRef: verdict.optionRef,
      isCorrect: verdict.isCorrect,
    };
  }

  // Where it reopens: the first question with no answer. Exact here, unlike
  // exam mode's derivation, because strictly forward means a question cannot be
  // passed without being answered (decision log, 2026-09-06).
  const resumeAt = questions[firstUnansweredSeq(questions, initial)]!;

  // The one question whose key may be needed at load, and only when every
  // question has been answered so there is no unanswered one to open on. One
  // question's worth of key, never the whole sitting's.
  const resumedState = initial[resumeAt.id]!;
  const resumed =
    resumedState.optionRef === null || resumedState.isCorrect === null
      ? null
      : {
          questionId: resumeAt.id,
          feedback: {
            isCorrect: resumedState.isCorrect,
            ...(await getQuestionKey(db, resumeAt.id)),
          } satisfies AnswerFeedback,
        };

  // Read from the bank rather than from a label map in the app: the competency
  // is already `"Security Fundamentals :: Compliance"`, so its first half is
  // the domain's own name and there is no table here that could drift from the
  // content (the same call #34 made for the domain cards).
  const domainName = questions[0]!.competency.split(' :: ')[0] ?? 'Domain';

  return (
    <div className="page page--sitting">
      <ComposedSitting
        attemptId={attempt.id}
        title={attempt.mode === 'domain' ? domainName : 'Practice'}
        modeLabel={attempt.mode === 'domain' ? 'Domain mode' : 'Practice mode'}
        questions={questions}
        initial={initial}
        resumed={resumed}
      />
    </div>
  );
}
