'use client';

import { useId, useState } from 'react';
import type { ClockBand } from '../domain/clock.ts';
import type { NavigatorModel } from '../domain/navigator.ts';
import { Clock } from './Clock.tsx';
import { NavigatorSheetPanel, NavigatorSheetTrigger } from './NavigatorSheet.tsx';

export interface ExamBarProps {
  examNumber: string;
  model: NavigatorModel;
  total: number;
  currentNumber: number;
  band: ClockBand;
  display: string;
  /** A write has failed and is queued. Doc 10 §4's persistent save chip. */
  retrying: boolean;
  /**
   * Writes the server has not confirmed. Doc 03 §7 blocks submit while anything
   * is owed — **including the healthy write still in the air**, which is why
   * this is a different signal from `retrying` rather than the same one.
   */
  unsaved: number;
  /** The submit request is in flight, or the sitting is already finalised. */
  submitting: boolean;
  submitted: boolean;
  /**
   * The clock has run out and the sitting is closing itself.
   *
   * Doc 10 §6 disables Submit on an expired sitting, and that is finally
   * correct: its premise — that the sitting was submitted automatically — is
   * what auto-submit provides. Before it existed the button had to stay
   * enabled, or an expired sitting would have been permanently unfinishable.
   * Now the dialog owns the retry, so a disabled button here offers nothing
   * that is missing.
   */
  expired: boolean;
  onSelect: (seq: number) => void;
  onSubmit: () => void;
}

/**
 * The sticky bar the sitting is read under.
 *
 * Doc 10 §4 gives it three regions: what this is on the left, **the clock** in
 * the middle, and where you have got to on the right. It sticks because the
 * clock is the one thing that must never scroll away — a countdown you have to
 * scroll up to check is a countdown you stop checking.
 *
 * **On a touch layout it becomes the phone bar instead**, which is a different
 * arrangement rather than the same one squeezed: the description and the
 * counts give way, and the question counter appears as the control that opens
 * the navigator. That counter is the one doc 10 pulls the sheet from, and it
 * is the only counter here — the sheet's trigger used to carry a second copy
 * because this bar did not exist yet.
 *
 * **Submit sits at the right-hand end**, where doc 10 puts it, and — like the
 * save chip — outside the group the phone layout gives up: doc 10 §4's phone
 * bar keeps the counter, the clock and Submit, and drops the rest.
 *
 * It is disabled while the outbox owes the server anything, and says which of
 * the two waits it is in rather than only going grey. Doc 03 §7 blocks submit
 * on the queue being non-empty, which deliberately includes the ordinary write
 * still in the air: two seconds of waiting is cheaper than a sitting scored
 * without its last answer.
 */
export function ExamBar({
  examNumber,
  model,
  total,
  currentNumber,
  band,
  display,
  retrying,
  unsaved,
  submitting,
  submitted,
  expired,
  onSelect,
  onSubmit,
}: ExamBarProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="sittingbar">
      <div className="bar bar--sitting">
        <div className="row barwide" style={{ gap: 'var(--space-4)' }}>
          <span className="brandmark__name">Practice exam {examNumber}</span>
          <span className="chip chip--accent">Exam mode</span>
          <span className="meta">No feedback until you submit</span>
        </div>

        <NavigatorSheetTrigger
          total={total}
          currentNumber={currentNumber}
          open={open}
          panelId={panelId}
          onToggle={() => setOpen((was) => !was)}
        />

        <Clock band={band} display={display} />

        {/* Doc 10 §4's error state, and the one it calls "the important one".
            It sits outside `barwide` rather than beside the counts inside it,
            because that group is what the phone layout gives up — and a save
            failure is the last thing a narrow screen should be the one not to
            hear about. Not dismissible: there is no control here to dismiss it
            with, and it leaves when the write lands and not before. */}
        {retrying ? (
          <span className="chip chip--incorrect savechip" role="status">
            Not saved &mdash; retrying
          </span>
        ) : null}

        <div className="row barwide" style={{ gap: 'var(--space-3)' }}>
          <span className="chip">
            <span className="mono">{model.answered}</span>&nbsp;of {total} answered
          </span>
          <span className="chip chip--flagged">
            <svg
              className="ico"
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.6 12.6V2.2h7.2L9.1 5.1l1.7 2.9H3.6" />
            </svg>
            <span className="mono">{model.flagged}</span>&nbsp;flagged
          </span>
        </div>

        {/* Outside `barwide`, for the same reason the chip is: doc 10 §4's
            phone bar keeps counter, clock and Submit, and a sitting you cannot
            end from the screen you are sitting it on is not finishable. */}
        <button
          type="button"
          className="btn btn--primary"
          disabled={submitting || submitted || expired || unsaved > 0}
          onClick={onSubmit}
        >
          {/* Doc 03 §8: the existing disabled tokens and a changed label, no
              spinner. The two waits are named apart because they are different
              — one is this sitting's last answer being written, the other is
              the sitting itself being scored. */}
          {submitted
            ? 'Submitted'
            : expired
              ? 'Time expired'
              : submitting
                ? 'Scoring…'
                : unsaved > 0
                  ? 'Saving…'
                  : 'Submit exam'}
        </button>
      </div>

      {/* Kept in the DOM only while open. A hidden grid of sixty buttons would
          still be sixty tab stops, and a keyboard user would walk through a
          navigator they cannot see. */}
      {open ? (
        <NavigatorSheetPanel
          model={model}
          panelId={panelId}
          onSelect={(seq) => {
            onSelect(seq);
            // You jumped because you wanted the question, not the grid.
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
