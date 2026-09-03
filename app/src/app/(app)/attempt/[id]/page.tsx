import { notFound } from 'next/navigation';
import { db } from '../../../../db/client.ts';
import { getAttemptAnswers } from '../../../../db/queries/answer.ts';
import { getAttemptForUser } from '../../../../db/queries/attempt.ts';
import { getPaperQuestions } from '../../../../db/queries/paper.ts';
import { deadlineOf, remainingToDeadline } from '../../../../domain/clock.ts';
import type { RecordedState } from '../../../../domain/navigator.ts';
import { passMark } from '../../../../domain/score.ts';
import { outcomeOf, type SubmitOutcome } from '../../../../domain/submission.ts';
import { Sitting } from '../../../../components/Sitting.tsx';
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
 */
export default async function SittingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const attempt = await getAttemptForUser(db, session.user.id, id);

  // Not found, never forbidden. A 403 would confirm the row exists and belongs
  // to somebody, which is exactly what an attacker probing ids wants to learn.
  if (attempt === null) notFound();
  if (attempt.examId === null) notFound();

  const [questions, answers] = await Promise.all([
    getPaperQuestions(db, attempt.examId),
    getAttemptAnswers(db, session.user.id, attempt.id),
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
        examNumber={attempt.examId.replace('exam-', '')}
        passMark={passMark(questions.length)}
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
