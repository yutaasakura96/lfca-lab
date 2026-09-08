import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { RailCount, ReviewBoard, type ReviewTile } from '../../../../../components/ReviewBoard.tsx';
import { ReviewCard } from '../../../../../components/ReviewCard.tsx';
import { ReviewSummary } from '../../../../../components/ReviewSummary.tsx';
import { StartExamButton } from '../../../../../components/StartExamButton.tsx';
import { UnscoredReviewSummary } from '../../../../../components/UnscoredReviewSummary.tsx';
import { db } from '../../../../../db/client.ts';
import { getAttemptForUser, type AttemptRow } from '../../../../../db/queries/attempt.ts';
import { openAttemptForExam } from '../../../../../db/queries/exams.ts';
import {
  getReviewContext,
  getSittingReviewQuestions,
  type ReviewQuestion,
} from '../../../../../db/queries/review.ts';
import { isScored } from '../../../../../domain/modes.ts';
import {
  countByFilter,
  timeUsedSeconds,
  verdictOf,
  type ReviewCounts,
  type ReviewedQuestion,
} from '../../../../../domain/review.ts';
import { passMark } from '../../../../../domain/score.ts';
import { outcomeOf } from '../../../../../domain/submission.ts';
import { finaliseExpiredSittings } from '../../../../../lib/auto-submit.ts';
import { requireSession } from '../../../../../lib/session.ts';

export const metadata = { title: 'Review — LFCA Practice' };

/**
 * The review.
 *
 * **A route, not a state on the sitting**, and deliberately so. Doc 03 §4 names
 * this path; the ticket requires the review to be reachable again later rather
 * than only in the moment after submitting, which is what a URL is for; and #26
 * needs somewhere to land a sitting that expired while the tab was closed.
 *
 * A server component, for the opposite reason to the sitting's. There, the
 * point was that the answer key never enters a payload; here the sitting is
 * over and the key *is* the content — PRD E4 and P1 both want the `why` for all
 * four options. Rendering on the server still matters: sixty questions with
 * four explanations each is the longest reading in the product, and shipping it
 * as data as well as markup would double it for no gain. The only client state
 * on this screen is which filter is selected.
 *
 * **One route, two screens, and the branch is the stored mode** — the same
 * column `/attempt/[id]` and the answer endpoint branch on. A scored sitting
 * gets a score, a pass mark, a verdict and its place in the paper's history; an
 * unscored one gets three counts and none of those, because PRD P1 says it is
 * not measured. They share the cards, the filters, the rail and the tile jump,
 * which is everything the ticket calls Kept.
 */
export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  // **The whole sweep, not just this sitting.** Reading a review is a touch like
  // any other, and the re-sit action below asks whether a sitting of this paper
  // is still running — a question only the finalised rows can answer honestly. A
  // *sibling* sitting whose ninety minutes lapsed unattended is still
  // `submitted_at IS NULL` until something closes it, and without this the
  // review would offer to resume a sitting that is over, while suppressing the
  // re-sit that PRD E7 asks for. Same helper the exam list sweeps with, over the
  // one finalisation path (doc 03 §6); ahead of the read, so every row below is
  // already settled.
  //
  // It sweeps on the way to an unscored review too, and correctly: a composed
  // sitting can never expire (doc 04 §5.1 gives it no limit), but the account's
  // *other* sittings can, and this page is one of the four touches.
  await finaliseExpiredSittings(db, session.user.id, new Date());

  const attempt = await getAttemptForUser(db, session.user.id, id);

  // Not found, never forbidden — a 403 would confirm the row exists and belongs
  // to somebody, which is what probing ids is for.
  if (attempt === null) notFound();

  // A sitting genuinely still in progress has nothing to review. Sent back to
  // itself rather than shown an error: the questions are right there, and in a
  // timed sitting the clock is still running.
  if (attempt.submittedAt === null || attempt.submitReason === null) {
    redirect(`/attempt/${attempt.id}`);
  }

  const questions = await getSittingReviewQuestions(db, session.user.id, attempt);
  if (questions.length === 0) notFound();

  const scored = isScored(attempt.mode);

  // The shape the counts, the breakdown and the tiles are all derived from —
  // one projection, so the number on a filter chip and the state on a tile
  // cannot come from two different readings of the same row.
  const reviewed: ReviewedQuestion[] = questions.map((question) => ({
    domain: question.domain,
    verdict: verdictOf(question),
    flagged: question.flagged,
  }));

  const counts = countByFilter(reviewed, scored);

  const tiles: ReviewTile[] = questions.map((question, index) => ({
    number: question.seq + 1,
    verdict: reviewed[index]!.verdict,
    flagged: question.flagged,
  }));

  if (scored) return examReview(session.user.id, attempt, questions, reviewed, counts, tiles);
  return unscoredReview(attempt, questions, counts, tiles);
}

async function examReview(
  userId: string,
  attempt: AttemptRow,
  questions: ReviewQuestion[],
  reviewed: ReviewedQuestion[],
  counts: ReviewCounts,
  tiles: ReviewTile[],
) {
  const examId = attempt.examId;
  // Unreachable: `attempt_exam_iff_exam_mode` makes mode and paper inseparable,
  // and the holdout — scored, but with no paper — cannot yet be started.
  if (examId === null) notFound();
  // Narrowed by the caller's own guard; restated for the type.
  if (attempt.submittedAt === null || attempt.submitReason === null) notFound();

  const [context, openAttemptId] = await Promise.all([
    getReviewContext(db, userId, attempt.id),
    // The existing helper, not a fourth copy of its predicate. "The oldest
    // unfinished sitting of this paper" is one question, and the API route that
    // refuses a second live sitting already asks it this way.
    openAttemptForExam(db, userId, examId),
  ]);

  const outcome = outcomeOf({
    score: attempt.score,
    questionCount: attempt.questionCount,
    reason: attempt.submitReason,
  });

  const unanswered = reviewed.filter((q) => q.verdict === 'unanswered').length;
  const score = outcome.score ?? 0;
  const mark = outcome.passMark ?? passMark(attempt.questionCount);

  const elapsedSeconds = timeUsedSeconds(
    attempt.startedAt,
    attempt.submittedAt,
    attempt.timeLimitSeconds,
  );

  return (
    <div className="page page--review">
      <div
        className="row pagehead"
        style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-5)' }}
      >
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <span className="eyebrow">Review</span>
          <h1 className="h1">Practice exam {examId.replace('exam-', '')}</h1>
          <p className="meta">
            Submitted <SubmittedAt at={attempt.submittedAt} />
            {context === null ? null : (
              <>
                {' '}
                &middot; sitting {context.ordinal} of {context.attempts}
              </>
            )}
          </p>
        </div>
        {/*
          Re-sitting reachable from the review as well as from the list — PRD E7,
          and the place you are standing when you have just read what you got
          wrong. Best score moves; the first-attempt score does not, whatever
          this sitting or the next one scores, because the flag was settled when
          the earliest attempt was *created* (doc 04 §5.2) and nothing on this
          path touches it.

          Which of the two things this offers is read from the query, not left
          to the server to resolve after the press. `POST /api/attempt` does
          guard it — an open sitting comes back rather than a second one being
          started — but that answer arrives too late to put a truthful word on
          the button. The list makes the same distinction the same way.

          The row wraps because two buttons is more than a phone's width holds:
          measured at 375, the pair wants 371px inside a 343px content box and
          the second one lands 12px past the page edge. `.pagehead` wraps but a
          `.row` does not, so the nested one has to say so. Same answer the bar
          gave the save chip at this width — take a second line rather than
          shrink a control.
        */}
        <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link className="btn" href="/exams">
            Back to the sixteen exams
          </Link>

          {openAttemptId === null ? (
            <StartExamButton examId={examId} label="Sit this paper again" className="btn" />
          ) : (
            <Link className="btn btn--primary" href={{ pathname: `/attempt/${openAttemptId}` }}>
              Resume the open sitting
            </Link>
          )}
        </div>
      </div>

      <ReviewBoard
        counts={counts}
        tiles={tiles}
        scored
        railFooter={
          <>
            <RailCount label="Score" value={String(score)} />
            <RailCount label="Needed" value={String(mark)} />
            <RailCount
              label="Gap"
              value={score >= mark ? `+${score - mark}` : String(score - mark)}
            />
          </>
        }
        summary={
          <ReviewSummary
            outcome={outcome}
            questions={reviewed}
            elapsedSeconds={elapsedSeconds}
            unanswered={unanswered}
            flagged={counts.flagged}
            context={context}
          />
        }
      >
        {questions.map((question) => (
          <ReviewCard key={question.id} question={question} scored />
        ))}
      </ReviewBoard>
    </div>
  );
}

/**
 * A practice or domain run, read back.
 *
 * **Nothing here computes a mark, a percentage or a verdict**, and the absences
 * are structural rather than conditional: neither `outcomeOf` nor `passMark` is
 * called on this path, `ReviewSummary` is not rendered on it, and the rail's
 * footer is three counts passed in rather than a Score/Needed/Gap block behind
 * a flag inside the board. A pass mark one wrong condition away from a screen
 * that must never show one is exactly what #37 refused when it gave the finish
 * dialog its own component.
 *
 * There is no re-sit action, and there could not be a truthful one: these modes
 * name a *shape* rather than a paper (doc 07 §2), so "sit this again" has no
 * referent — the sitting to start is chosen on `/practice` or `/domain`, which
 * is one click through the modes.
 *
 * There is also no `getReviewContext`: it counts sittings of the same *paper*,
 * and there is none. "Sitting 3 of 7" over a set of questions composed afresh
 * each time would be a sequence, not a comparison.
 */
function unscoredReview(
  attempt: AttemptRow,
  questions: ReviewQuestion[],
  counts: ReviewCounts,
  tiles: ReviewTile[],
) {
  if (attempt.submittedAt === null) notFound();

  // Read from the bank rather than from a label map in the app: the competency
  // is already `"Security Fundamentals :: Compliance"`, so its first half is
  // the domain's own name and there is no table here that could drift from the
  // content — the same call #34 made for the domain cards and #36 for the
  // sitting's own title.
  const domainName = questions[0]!.competency.split(' :: ')[0] ?? 'Domain';
  const title = attempt.mode === 'domain' ? domainName : 'Practice';

  return (
    <div className="page page--review">
      <div
        className="row pagehead"
        style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-5)' }}
      >
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <span className="eyebrow">Review</span>
          <h1 className="h1">{title}</h1>
          <p className="meta">
            {attempt.mode === 'domain' ? 'Domain mode' : 'Practice mode'} &middot; finished{' '}
            <SubmittedAt at={attempt.submittedAt} />
          </p>
        </div>
        <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link className="btn" href="/">
            Back to the modes
          </Link>
        </div>
      </div>

      <ReviewBoard
        counts={counts}
        tiles={tiles}
        scored={false}
        railFooter={
          <>
            <RailCount label="Correct" value={String(counts.correct)} />
            <RailCount label="Incorrect" value={String(counts.incorrect)} />
            <RailCount label="Not reached" value={String(counts.unreached)} />
          </>
        }
        summary={
          <UnscoredReviewSummary
            title={title}
            correct={counts.correct}
            incorrect={counts.incorrect}
            unreached={counts.unreached}
            questionCount={counts.all}
          />
        }
      >
        {questions.map((question) => (
          <ReviewCard key={question.id} question={question} scored={false} />
        ))}
      </ReviewBoard>
    </div>
  );
}

function SubmittedAt({ at }: { at: Date }) {
  return (
    <time dateTime={at.toISOString()}>{at.toISOString().slice(0, 16).replace('T', ' ')} UTC</time>
  );
}
