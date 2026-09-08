'use client';

import Link from 'next/link';
import { useId } from 'react';
import { finishSummary, type FinishCounts } from '../domain/submission.ts';
import { CountTally } from './CountTally.tsx';
import { ModalShell } from './ModalShell.tsx';

export interface FinishDialogProps {
  /** Where the review of this run lives, once it has one. */
  attemptId: string;
  /** `Practice` or the domain's own name — what this sitting is called. */
  title: string;
  counts: FinishCounts;
  questionCount: number;
  /**
   * The sitting is closed. Until then this dialog is asking, not reporting.
   *
   * A boolean rather than the endpoint's `SubmitOutcome`, because there is
   * nothing in an unscored one to show: doc 07 §5 answers these modes with the
   * four measured fields null, `reason` is always `user` without a clock, and
   * the counts on screen come from the sitting itself. Threading a payload
   * through three components to ask whether it is null would be the payload
   * pretending to carry something.
   */
  closed: boolean;
  /** A write the server has not confirmed. Finishing now could omit it. */
  unsaved: number;
  /** One of those has already failed and is waiting — it may never land. */
  retrying: boolean;
  submitting: boolean;
  /** The last submit failed. The sitting is intact and the button comes back. */
  failed: boolean;
  onFinish: () => void;
  onKeepGoing: () => void;
}

function DashedRing() {
  return (
    <svg
      className="ico"
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      style={{ color: 'var(--ink-secondary)' }}
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5.2" strokeDasharray="2.4 2.2" />
    </svg>
  );
}

/**
 * Closing an unscored sitting, and what it says afterwards.
 *
 * **Its own dialog rather than `SubmitDialog` with the measured half hidden.**
 * That component is exam-shaped throughout — a pass mark, a percentage, a
 * verdict chip, a flagged row, jump buttons into the paper — and every one of
 * those is either forbidden here (PRD P1: these modes are not measured) or
 * impossible here (strictly forward, so there is nothing to flag and nowhere to
 * jump). Hiding six regions behind a flag would leave the pass mark one wrong
 * condition away from a screen that must never show one.
 *
 * **The same dialog reports the outcome**, which is the call #24 made when its
 * own destination belonged to a later ticket: the summary is shown where the
 * button was pressed rather than behind a redirect. #38 added *See the full
 * review* beside the way home, which was the whole of what it had left to
 * inherit — the counts stay here, because they are the ending of a sitting that
 * is not scored, and a redirect would have gone straight past them.
 *
 * **The counts come from the screen, not from the reply.** They have to: doc 07
 * §5 answers an unscored submit with the four measured fields null, and it is
 * right to — a count in that payload would be a score arriving by another name.
 * Reporting them here is honest because every one of these verdicts appeared on
 * this screen, one at a time, as it was earned.
 */
export function FinishDialog({
  attemptId,
  title,
  counts,
  questionCount,
  closed,
  unsaved,
  retrying,
  submitting,
  failed,
  onFinish,
  onKeepGoing,
}: FinishDialogProps) {
  const titleId = useId();

  const summary = finishSummary(counts, questionCount);

  return (
    <ModalShell titleId={titleId} dismissible={!closed} onDismiss={onKeepGoing}>
      {closed ? result() : confirmation()}
    </ModalShell>
  );

  function tally() {
    return (
      <CountTally
        correct={summary.correct}
        incorrect={summary.incorrect}
        unreached={summary.unreached}
      />
    );
  }

  function confirmation() {
    return (
      <>
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          {/* The sitting's name goes in the eyebrow, not into the question.
              A domain is called "System Administration Fundamentals", and
              folding that into a sentence gives a heading nobody reads and a
              line that will not fit a phone. */}
          <span className="eyebrow">{title}</span>
          <h2 className="h1" id={titleId}>
            {summary.complete ? 'Finish this run?' : 'Save and exit?'}
          </h2>
          <p
            className="prose"
            style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)' }}
          >
            {/* Nothing about a score, because there is none — and nothing about
                what the blanks cost, because they cost nothing. What is true
                and worth saying is that this cannot be reopened: there is no
                discard in this app and no resuming a closed sitting, so the one
                irreversible thing here is the sitting itself. */}
            {summary.complete
              ? 'That is every question. This closes the sitting; everything you answered stays readable in the review afterwards.'
              : 'This closes the sitting. Nothing is scored, so the questions you did not reach cost you nothing — but a closed sitting cannot be reopened, and you would carry on from here in a new run rather than in this one.'}
          </p>
        </div>

        {tally()}

        {summary.unreached > 0 ? (
          <div className="warn">
            <div className="row" style={{ gap: 'var(--space-3)' }}>
              <DashedRing />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>
                {summary.unreached} question{summary.unreached === 1 ? '' : 's'} left unreached
              </span>
            </div>
            <p
              className="meta"
              style={{
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-normal)',
                color: 'var(--ink-secondary)',
              }}
            >
              {/* True and load-bearing rather than reassurance: selection reads
                  `max(answered_at) NULLS FIRST`, and a question never answered
                  has no `answered_at` — so it is still unseen, and unseen-first
                  ordering will reach for it before anything already answered
                  (PRD P3). Leaving questions here costs no coverage.
                  No jump row: strictly forward means there is nowhere to jump. */}
              A question you never answered stays unseen, so a later run reaches for it before
              anything you have already done.
            </p>
          </div>
        ) : null}

        {failed ? (
          <div className="row">
            <span className="chip chip--incorrect" role="status">
              Couldn&rsquo;t finish &mdash; your answers are saved. Try again.
            </span>
          </div>
        ) : null}

        {unsaved > 0 ? (
          // Doc 03 §7 blocks the close while anything is owed, and the two
          // waits are worded apart because only one of them is nearly over: a
          // write in flight lands in a moment, while one that has already
          // failed is retried for as long as the sitting lasts.
          <div className="row">
            <span className="chip chip--incorrect" role="status">
              {retrying
                ? 'An answer still has not saved. Finishing waits for it, so nothing is closed without it.'
                : 'Saving your last answer… finishing will be possible in a moment.'}
            </span>
          </div>
        ) : null}

        <div className="dialog__actions">
          <button type="button" className="btn btn--lg" onClick={onKeepGoing}>
            Keep going
          </button>
          <button
            type="button"
            // Danger only when questions are being left behind. Finishing a run
            // you have answered every question of is not a destructive act, and
            // dressing it as one would teach the treatment to be ignored where
            // it matters.
            className={summary.complete ? 'btn btn--lg btn--primary' : 'btn btn--lg btn--danger'}
            disabled={submitting || unsaved > 0}
            onClick={onFinish}
          >
            {/* Doc 03 §8: the existing disabled tokens and a changed label. No
                spinner — the design system has no animated primitive. */}
            {submitting
              ? 'Finishing…'
              : unsaved > 0
                ? 'Saving…'
                : summary.complete
                  ? 'Finish this run'
                  : 'Save and exit'}
          </button>
        </div>
      </>
    );
  }

  function result() {
    return (
      <>
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <span className="eyebrow">{title}</span>
          <h2 className="h1" id={titleId}>
            Run finished
          </h2>
          <p
            className="prose"
            style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)' }}
          >
            {/* Says what this is not, once, and then stops. PRD P1's "this mode
                is not measured" is a promise to the candidate as much as a
                constraint on the column, and the moment it is worth stating is
                the moment a number would otherwise be expected. */}
            This run is recorded. Nothing here is scored &mdash; no mark, no percentage, and
            nothing that reaches your exam results.
          </p>
        </div>

        {tally()}

        {/* Two actions, both onward — the same reading #26's expired outcome
            took of doc 10 §6's "one action". Neither is a way *out* of
            something that already happened; dropping the review would make this
            the one screen in the app from which the thing it is about is two
            clicks away. The review is the primary of the two because it is
            where the `why` for all four options lives, which is what the bank
            was written for (PRD E4, P1). */}
        <div className="dialog__actions">
          <Link className="btn btn--lg" href="/">
            Back to the modes
          </Link>
          <Link
            className="btn btn--lg btn--primary"
            href={{ pathname: `/attempt/${attemptId}/review` }}
          >
            See the full review
          </Link>
        </div>
      </>
    );
  }
}
