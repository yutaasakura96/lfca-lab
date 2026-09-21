import { notFound, redirect } from 'next/navigation';
import { db } from '../../../../db/client.ts';
import { getAttemptForUser, type AttemptRow } from '../../../../db/queries/attempt.ts';
import { getQuestionKey, getRecordedVerdicts } from '../../../../db/queries/feedback.ts';
import { getComposedQuestions } from '../../../../db/queries/paper.ts';
import { firstUnansweredSeq, type GradedRecord } from '../../../../domain/navigator.ts';
import { ComposedSitting } from '../../../../components/ComposedSitting.tsx';
import type { AnswerFeedback } from '../../../../components/ComposedQuestion.tsx';
import { Sitting } from '../../../../components/Sitting.tsx';
import { requireSession } from '../../../../lib/session.ts';
import { loadTimedSitting } from '../../../../lib/timed-sitting.ts';

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
  // the answer endpoint branches its response on. A timed sitting has a clock,
  // free navigation, flags and a submit; a practice or domain one has no clock
  // at all, and its marking as it goes. They share the outbox, the tile and the
  // bank's prose rendering and almost nothing else, so they are two components
  // rather than one holding both sets of behaviour behind flags.
  //
  // The holdout is composed like practice and timed and scored like an exam
  // (PRD H1), so it takes the timed screen over its frozen set — free
  // navigation and flags included (decision log, 2026-09-06).
  if (found.mode === 'exam' || found.mode === 'holdout') {
    return timedSitting(session.user.id, found);
  }
  return composedSitting(session.user.id, found);
}

async function timedSitting(userId: string, found: AttemptRow) {
  const load = await loadTimedSitting(db, userId, found, new Date());
  if (load.kind === 'missing') notFound();
  if (load.kind === 'closed-on-read') redirect(`/attempt/${load.attemptId}/review`);

  return (
    <div className="page page--sitting">
      <Sitting {...load.data} />
    </div>
  );
}

/**
 * A practice or domain sitting.
 *
 * **Nothing here reads a clock, and nothing here finalises anything.** Those
 * modes carry `time_limit_seconds = null` (doc 04 §5.1), so they never expire
 * and no lazy submit applies — which is why `finaliseIfExpired` is absent
 * rather than called and ignored. A composed sitting closes exactly once, when
 * the candidate says so, and that is the only path there is.
 *
 * What crosses to the browser is the frozen set of questions, the choices
 * already made, and **the verdict of each of those choices** — which is not the
 * answer key: it says whether the option this candidate picked was right, on a
 * question they have already been told about to their face. Nothing is sent
 * about a question they have not answered.
 */
async function composedSitting(userId: string, attempt: AttemptRow) {
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

  // A sitting that is already closed opens on its summary rather than on a
  // question — the same call the timed sitting makes, for the same reason:
  // every write into it would be refused, so presenting it as answerable would
  // be the screen claiming something the server has already ended.
  //
  // **#36 redirected here and #37 stopped, because the review 404'd. #38 built
  // the review and the redirect stays gone.** Three reasons, none of them the
  // 404 any more: the timed sitting has opened on its outcome since #24, so a
  // redirect would make the two modes differ on reload for no reason but the
  // order they were written; the three counts *are* the ending of a sitting
  // that is not scored, and a redirect goes straight past them; and the outcome
  // now offers the review as its own action, so nothing is out of reach — it is
  // one press rather than none, on a screen somebody has just arrived back at.
  //
  // A boolean rather than the timed page's `SubmitOutcome`, because there is no
  // outcome to carry: `score` is null by doc 04 §5.1's check constraint, and
  // the counts the summary shows are the sitting's own answer rows, already on
  // their way to the client as verdicts.
  const finished = attempt.submittedAt !== null;

  return (
    <div className="page page--sitting">
      <ComposedSitting
        attemptId={attempt.id}
        title={attempt.mode === 'domain' ? domainName : 'Practice'}
        modeLabel={attempt.mode === 'domain' ? 'Domain mode' : 'Practice mode'}
        questions={questions}
        initial={initial}
        resumed={resumed}
        finished={finished}
      />
    </div>
  );
}
