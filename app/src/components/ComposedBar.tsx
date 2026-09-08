'use client';

import type { GradedNavigatorModel } from '../domain/navigator.ts';

export interface ComposedBarProps {
  /** `Practice` or the domain's own name, read from the bank. */
  title: string;
  /** `Practice mode` or `Domain mode`. Doc 10 §7's chip. */
  modeLabel: string;
  model: GradedNavigatorModel;
  total: number;
  currentNumber: number;
  /** A write has failed and is queued. Doc 10 §4's persistent save chip. */
  retrying: boolean;
  /** Writes the server has not confirmed. Doc 03 §7 blocks closing on these. */
  unsaved: number;
  /** The finish request is in flight. */
  submitting: boolean;
  /** The sitting is closed. The dialog in front of it is reporting, not asking. */
  submitted: boolean;
  onFinish: () => void;
}

/**
 * The bar a composed sitting is read under.
 *
 * Doc 10 §7's top bar, and the one thing worth saying about it is what is
 * **not** here. There is no clock — not a stopped one, not a greyed one, not a
 * dash where one would go. Doc 10's first cross-screen rule is that no clock
 * renders in these modes at all, and the surest way to keep that true is for
 * this component to have no way to draw one: it is not passed a deadline, and
 * there is no prop it could be passed one through.
 *
 * What is here is doc 10 §7's **Save and exit**, at the right-hand end. It is
 * the only way out of a run that is not on its last question, and it is the
 * same action the last question's Finish takes — one dialog, one submit path,
 * whichever button opened it.
 *
 * The save chip is here rather than on the question, and outside the group the
 * narrow layout gives up, for the reason recorded on 2026-09-03: a phone is the
 * worst screen to be the one that does not hear about a failed save.
 */
export function ComposedBar({
  title,
  modeLabel,
  model,
  total,
  currentNumber,
  retrying,
  unsaved,
  submitting,
  submitted,
  onFinish,
}: ComposedBarProps) {
  return (
    <div className="sittingbar">
      <div className="bar bar--sitting">
        <div className="row barwide" style={{ gap: 'var(--space-4)' }}>
          <span className="brandmark__name">{title}</span>
        </div>

        {/* Outside `barwide`, unlike the exam bar's chip. The timed bar can give
            up its paper's name on a phone because a countdown and a Submit say
            what screen this is; here the mode chip is the only thing that
            does, and "which sitting am I in" is not a question a narrow screen
            should have to scroll to answer. */}
        <span className="chip chip--accent">{modeLabel}</span>
        <span className="meta barwide">No time limit &middot; answers revealed as you go</span>

        {/* The counter is a plain reading here, not a control. In a timed
            sitting it opens the navigator sheet; there is nothing to open when
            the tiles cannot be jumped to. */}
        <span className="navbtn row">
          <span className="mono">{currentNumber}</span>
          <span className="navbtn__of">of {total}</span>
        </span>

        {retrying ? (
          <span className="chip chip--incorrect savechip" role="status">
            Not saved &mdash; retrying
          </span>
        ) : null}

        {/* The running pair doc 10 §7 asks for. PRD P1 forbids a *measurement*,
            and these are not one: every verdict in them appeared on screen one
            at a time as it was earned. What never exists is a score — the
            column stays null (doc 04 §5.1) and no percentage or pass mark is
            computed from these anywhere. */}
        <div className="row" style={{ gap: 'var(--space-3)' }}>
          <span className="chip chip--correct">
            <span className="mono">{model.correct}</span>&nbsp;correct
          </span>
          <span className="chip chip--incorrect">
            <span className="mono">{model.incorrect}</span>&nbsp;incorrect
          </span>
        </div>

        {/* Doc 10 §7's Save and exit. Disabled while a write is owed, for doc
            03 §7's reason: a sitting closed with an answer still in the air is
            a sitting whose record is missing one. The label says which of the
            two waits it is, exactly as the exam bar's Submit does. */}
        <button
          type="button"
          className="btn"
          disabled={submitting || submitted || unsaved > 0}
          onClick={onFinish}
        >
          {submitting ? 'Finishing…' : unsaved > 0 ? 'Saving…' : 'Save and exit'}
        </button>
      </div>
    </div>
  );
}
