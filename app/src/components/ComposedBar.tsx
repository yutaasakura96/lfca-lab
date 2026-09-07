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
 * There is no Submit either, yet. **Finish and Save and exit are #37's**, and a
 * button that looked real and did nothing would be worse than its absence —
 * the same call the clock's freeze made before it had a destination. The bar
 * gains its right-hand end when there is something for it to do.
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
      </div>
    </div>
  );
}
