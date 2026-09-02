'use client';

import type { NavigatorModel } from '../domain/navigator.ts';
import { NavigatorTile } from './NavigatorTile.tsx';

/**
 * The navigator on a touch layout: a sheet, opened from the question counter.
 *
 * Not the rail at a narrow width — a different component, because it answers a
 * different question. The rail is always open beside the question; a phone has
 * no room for that, so here the counter itself is the control and the sixty
 * tiles arrive below it, seven to a row at 44px.
 *
 * **The 44px is the whole point.** `--tile-size` is 34px and is pointer-only
 * (doc 05 §7.1, rule 12); this component never uses it. `screens.css` decides
 * which of the two navigators exists by the *primary* pointer rather than by
 * width alone, so a tablet at 1024px gets this one.
 *
 * **Trigger and panel are separate exports** because they are no longer
 * adjacent. Doc 10 §4 pulls the sheet from the question counter *in the top
 * bar*, and the bar now exists — so `ExamBar` places the trigger among its own
 * children and the panel beneath itself, and owns the open state that joins
 * them. Until the bar existed the trigger carried its own `N / 60` copy of the
 * counter; that duplicate is gone, because the counter it duplicated is now
 * the thing you press.
 *
 * A disclosure in normal flow rather than a fixed sheet with a scrim: it needs
 * no focus trap and no scroll lock to be correct. The prototype's grab handle
 * stays out — a handle on something that cannot be dragged is drawn chrome
 * that does not work, which doc 05's rule 13 rules out.
 */
export function NavigatorSheetTrigger({
  total,
  currentNumber,
  open,
  panelId,
  onToggle,
}: {
  total: number;
  currentNumber: number;
  open: boolean;
  panelId: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="navbtn navsheet"
      aria-expanded={open}
      aria-controls={panelId}
      // The counter and the control are one thing, so the accessible name has
      // to say what pressing it does — "23 / 60" alone names a position, not
      // an action.
      aria-label={`Question ${currentNumber} of ${total} — jump to question`}
      onClick={onToggle}
    >
      <span className="mono">{currentNumber}</span>
      <span className="navbtn__of">/{total}</span>
      <svg
        className="ico"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ transform: open ? 'rotate(180deg)' : undefined }}
      >
        <path d="M3 5.2 7 9.2l4-4" />
      </svg>
    </button>
  );
}

export function NavigatorSheetPanel({
  model,
  panelId,
  onSelect,
}: {
  model: NavigatorModel;
  panelId: string;
  onSelect: (seq: number) => void;
}) {
  return (
    <div className="sheet" id={panelId}>
      <div
        className="row"
        style={{
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 'var(--space-4)',
        }}
      >
        <h2 className="h2" style={{ fontSize: 'var(--text-base)' }}>
          Jump to question
        </h2>
        <span className="meta">
          {model.answered} answered · {model.unanswered} unanswered · {model.flagged} flagged
        </span>
      </div>

      <div className="grid60--touch">
        {model.tiles.map((tile) => (
          <NavigatorTile key={tile.questionId} tile={tile} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
