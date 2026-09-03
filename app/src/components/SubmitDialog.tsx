'use client';

import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';
import type { NavigatorTile } from '../domain/navigator.ts';
import { reviewBeforeSubmit, type SubmitOutcome } from '../domain/submission.ts';

/** How many jump targets the row shows before it says how many more there are. */
const JUMPS_SHOWN = 8;

export interface SubmitDialogProps {
  /** Where the outcome's one action goes: this sitting's own review. */
  attemptId: string;
  examNumber: string;
  tiles: NavigatorTile[];
  questionCount: number;
  /** `MM:SS` left, or empty in a sitting with no clock. */
  timeLeft: string;
  /** The clock has run out. There is no working left to go back to. */
  expired: boolean;
  /** The score, once it exists. Until then this dialog is asking, not reporting. */
  outcome: SubmitOutcome | null;
  /** A write the server has not confirmed. Submitting now could omit it. */
  unsaved: number;
  /**
   * One of those writes has already failed and is waiting to be tried again —
   * which is a different thing to say, because it may never land.
   */
  retrying: boolean;
  /** The submit request is in flight. */
  submitting: boolean;
  /** The last submit failed. The sitting is intact and the button comes back. */
  failed: boolean;
  onJump: (seq: number) => void;
  onSubmit: () => void;
  onKeepWorking: () => void;
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

function FlagGlyph() {
  return (
    <svg
      className="ico"
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.6 12.6V2.2h7.2L9.1 5.1l1.7 2.9H3.6" />
    </svg>
  );
}

/** A row of question numbers you can jump into, truncated as doc 10 §5 draws it. */
function Jumps({
  label,
  tiles,
  onJump,
}: {
  label: string;
  tiles: NavigatorTile[];
  onJump: (seq: number) => void;
}) {
  const shown = tiles.slice(0, JUMPS_SHOWN);
  const rest = tiles.length - shown.length;

  return (
    <div className="jumps">
      <span className="meta">{label}</span>
      {shown.map((tile) => (
        <button
          key={tile.questionId}
          type="button"
          className="tile tile--jump"
          onClick={() => onJump(tile.seq)}
          aria-label={`Go to ${tile.label}`}
        >
          {tile.number}
        </button>
      ))}
      {/* The navigator remains the complete way in — this row is the shortcut,
          not the index, and saying how many it is not showing is more honest
          than a row of sixty numbers nobody reads. */}
      {rest > 0 ? <span className="meta">and {rest} more</span> : null}
    </div>
  );
}

/**
 * The last look before committing, and the number that comes out of it.
 *
 * Doc 10 §5 makes the cost of unanswered questions **arithmetically obvious**
 * rather than merely counted, which is why the warning states what is still
 * reachable. Submitting with blanks is allowed — it has to be, or the honest
 * first-attempt score becomes something you can dodge by never finishing — but
 * it is never silent.
 *
 * **The same dialog reports the outcome.** Doc 10 §5 hands off to a review
 * screen that does not exist yet, and #22 set the precedent for that situation:
 * do not invent another ticket's destination. So the score is shown here, in
 * place, and the one onward action is a screen that does exist. When the review
 * lands it replaces that action; nothing here has to be undone to do it.
 *
 * The unanswered panel is the *unanswered treatment itself* — a dashed border
 * and a dashed ring — rather than a colour, because doc 05's rule is that no
 * state is carried by hue alone, and this is the panel a candidate reads under
 * time pressure.
 */
export function SubmitDialog({
  attemptId,
  examNumber,
  tiles,
  questionCount,
  timeLeft,
  expired,
  outcome,
  unsaved,
  retrying,
  submitting,
  failed,
  onJump,
  onSubmit,
  onKeepWorking,
}: SubmitDialogProps) {
  const titleId = useId();
  const dialog = useRef<HTMLDivElement>(null);

  const review = reviewBeforeSubmit(
    {
      answered: tiles.filter((tile) => tile.answered).length,
      flagged: tiles.filter((tile) => tile.flagged).length,
    },
    questionCount,
  );

  const unanswered = tiles.filter((tile) => !tile.answered);
  const flagged = tiles.filter((tile) => tile.flagged);

  // Focus moves into the dialog on open, and Escape leaves it. Both are the
  // dialog's own to provide: this is drawn over a sitting that is still fully
  // keyboard-operable underneath, and a modal that leaves focus behind it is a
  // modal a keyboard user has to hunt for.
  useEffect(() => {
    dialog.current?.focus();
  }, []);

  const settled = outcome !== null;

  useEffect(() => {
    if (settled) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onKeepWorking();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settled, onKeepWorking]);

  return (
    <div className="scrim">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialog}
      >
        {outcome === null
          ? confirmation()
          : result(outcome)}
      </div>
    </div>
  );

  function confirmation() {
    return (
      <>
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <span className="eyebrow">{expired ? 'Time expired' : 'Before you submit'}</span>
          <h2 className="h1" id={titleId}>
            Submit practice exam {examNumber}?
          </h2>
          <p
            className="prose"
            style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)' }}
          >
            {expired
              ? 'The time on this sitting has run out, so nothing more can be answered. Submitting records it as it stands and reveals every answer at once.'
              : 'This ends the sitting. Every answer is revealed at once and the score is recorded against your best and first attempts. You cannot come back and change anything.'}
          </p>
        </div>

        <div className="tally">
          <div className="tally__cell">
            <span className="eyebrow">Answered</span>
            <span className="tally__num">{review.answered}</span>
          </div>
          <div className="tally__cell">
            <span className="eyebrow">Unanswered</span>
            <span className="tally__num">{review.unanswered}</span>
          </div>
          <div className="tally__cell">
            <span className="eyebrow">Flagged</span>
            <span className="tally__num" style={{ color: 'var(--flagged-ink)' }}>
              {review.flagged}
            </span>
          </div>
          <div className="tally__cell">
            <span className="eyebrow">Time left</span>
            <span className="tally__num" style={{ color: 'var(--flagged-ink)' }}>
              {timeLeft === '' ? '—' : timeLeft}
            </span>
          </div>
        </div>

        {/* Doc 10 §5: with nothing unanswered this region is removed entirely,
            rather than reduced to a reassuring line nobody needs to read. */}
        {review.unanswered > 0 ? (
          <div className="warn">
            <div className="row" style={{ gap: 'var(--space-3)' }}>
              <DashedRing />
              <span
                style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}
              >
                {review.unanswered} question{review.unanswered === 1 ? ' has' : 's have'} no answer
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
              {/* The arithmetic is the region's whole purpose (doc 10 §5), so it is
                  stated either way — only the conclusion changes, because
                  "at most 50 of the 45 needed" is not a sentence that means
                  anything. What stays true in both is that the blanks are
                  already counted against the mark. */}
              {review.canStillPass ? (
                <>
                  Blank answers are marked incorrect. With {review.answered} answered you can reach
                  at most {review.bestPossible} of the {review.questionCount}, so{' '}
                  {review.passMark} is still within reach &mdash; but only if every answer given is
                  right.
                </>
              ) : (
                <>
                  Blank answers are marked incorrect. With {review.answered} answered you can reach
                  at most {review.bestPossible} of the {review.passMark} needed to pass, so
                  submitting now cannot pass this exam.
                </>
              )}
            </p>
            <Jumps label="Jump to:" tiles={unanswered} onJump={onJump} />
          </div>
        ) : null}

        {flagged.length > 0 ? (
          <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span className="chip chip--flagged">
              <FlagGlyph />
              {flagged.length} flagged for review
            </span>
            <Jumps label="Jump to:" tiles={flagged} onJump={onJump} />
          </div>
        ) : null}

        {failed ? (
          // Doc 10 §5's error state: the dialog stays, the button comes back,
          // and the first thing it says is that nothing was lost. A submit that
          // failed has written nothing, and every answer is already durable.
          <div className="row">
            <span className="chip chip--incorrect" role="status">
              Couldn&rsquo;t submit &mdash; your answers are saved. Try again.
            </span>
          </div>
        ) : null}

        {unsaved > 0 ? (
          // Doc 03 §7 blocks submit while anything is owed, including the
          // healthy write still in the air. The two waits are worded apart
          // because only one of them is nearly over: a write in flight lands in
          // a moment, while a write that has already failed is retried for as
          // long as the sitting lasts and may never land at all. Promising
          // "in a moment" over that one would be the screen making a
          // commitment the network has not made.
          <div className="row">
            <span className="chip chip--incorrect" role="status">
              {retrying
                ? 'An answer still has not saved. Submitting waits for it, so nothing is scored without it.'
                : 'Saving your last answer\u2026 submitting will be possible in a moment.'}
            </span>
          </div>
        ) : null}

        <div className="dialog__actions">
          <button type="button" className="btn btn--lg" onClick={onKeepWorking}>
            {expired ? 'Back to the paper' : 'Keep working'}
          </button>
          <button
            type="button"
            className="btn btn--lg btn--danger"
            disabled={submitting || unsaved > 0}
            onClick={onSubmit}
          >
            {/* Doc 03 §8: the existing disabled tokens and a changed label. No
                spinner — the design system has no animated primitive, and this
                is not the place to introduce its first one. */}
            {submitting ? 'Scoring…' : unsaved > 0 ? 'Saving…' : 'Submit and see score'}
          </button>
        </div>
      </>
    );
  }

  function result(final: SubmitOutcome) {
    const scored = final.score !== null && final.passMark !== null;

    return (
      <>
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <span className="eyebrow">
            {/* PRD E6 must never conflate finishing with running out of time,
                and the row already records which it was. This is that column,
                read back. */}
            {final.reason === 'expired' ? 'Time expired' : 'Submitted'}
          </span>
          <h2 className="h1" id={titleId}>
            Practice exam {examNumber}
          </h2>
          {scored ? (
            <div className="row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <span className="score">
                <span className="score__num" style={{ fontSize: 'var(--text-2xl)' }}>
                  {final.score}
                </span>
                <span className="score__den">/{final.questionCount}</span>
              </span>
              <span className="mono" style={{ color: 'var(--ink-secondary)' }}>
                {final.percent}%
              </span>
              <span className={final.passed ? 'chip chip--correct' : 'chip chip--incorrect'}>
                {final.passed ? 'Pass' : 'No pass'} &middot; {final.passMark} of{' '}
                {final.questionCount} needed
              </span>
            </div>
          ) : null}
          <p
            className="prose"
            style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)' }}
          >
            {final.reason === 'expired'
              ? 'The ninety minutes are up. Answers save as they are made, so everything chosen is recorded; questions never reached are marked incorrect.'
              : 'This sitting is recorded. Questions left blank are marked incorrect, and the first-attempt score for this paper is unchanged by any later sitting.'}
          </p>
        </div>

        <div className="dialog__actions">
          {/* #25's whole inheritance from #24: this action's destination. The
              number is here, but the reason for it — every question, what was
              chosen, and the explanation for all four options — is one screen
              away, and that screen is what the bank was written for. */}
          <Link
            className="btn btn--lg btn--primary"
            href={{ pathname: `/attempt/${attemptId}/review` }}
          >
            See the full review
          </Link>
          <Link className="btn btn--lg" href="/exams">
            Back to the sixteen exams
          </Link>
        </div>
      </>
    );
  }
}
