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
  onSelect: (seq: number) => void;
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
 * **Submit is not here yet.** Doc 10 puts it at the right-hand end, and it
 * arrives with the slice that can actually submit. A button that looked like
 * the real one and did nothing would be worse than its absence. When it does
 * arrive it reads the same signal the chip does — doc 03 §7 blocks submitting
 * while anything is still owed.
 */
export function ExamBar({
  examNumber,
  model,
  total,
  currentNumber,
  band,
  display,
  retrying,
  onSelect,
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
