'use client';

import { useId, useState } from 'react';
import type { NavigatorModel } from '../domain/navigator.ts';
import { NavigatorTile } from './NavigatorTile.tsx';

/**
 * The navigator on a touch layout: a sheet, opened from the question counter.
 *
 * Not the rail at a narrow width — a different component, because it answers a
 * different question. The rail is always open beside the question; a phone has
 * no room for that, so here the counter itself is the control and the sixty
 * tiles arrive over it, seven to a row at 44px.
 *
 * **The 44px is the whole point.** `--tile-size` is 34px and is pointer-only
 * (doc 05 §7.1, rule 12); this component never uses it. `screens.css` decides
 * which of the two navigators exists by the *primary* pointer rather than by
 * width alone, so a tablet at 1024px gets this one.
 *
 * A disclosure in normal flow rather than a fixed sheet with a scrim: it needs
 * no focus trap and no scroll lock to be correct, and the pulled-up placement
 * doc 10 draws belongs with the sticky bar and bottom action bar it is pulled
 * between, neither of which exists yet. The prototype's grab handle goes with
 * them — a handle on something that cannot be dragged is drawn chrome that does
 * not work, which doc 05's rule 13 rules out.
 */
export function NavigatorSheet({
  model,
  total,
  currentNumber,
  onSelect,
}: {
  model: NavigatorModel;
  total: number;
  currentNumber: number;
  onSelect: (seq: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const sheetId = useId();

  return (
    <div className="navsheet">
      <button
        type="button"
        className="btn btn--lg"
        aria-expanded={open}
        aria-controls={sheetId}
        onClick={() => setOpen((was) => !was)}
      >
        <span className="mono">
          {currentNumber} / {total}
        </span>
        <span>Jump to question</span>
        <svg
          className="ico"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        >
          <path d="M3.5 5.25 7 8.75l3.5-3.5" />
        </svg>
      </button>

      {/* Kept in the DOM only while open. A hidden grid of sixty buttons would
          still be sixty tab stops, and a keyboard user would walk through a
          navigator they cannot see. */}
      {open ? (
        <div className="sheet" id={sheetId}>
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
              <NavigatorTile
                key={tile.questionId}
                tile={tile}
                onSelect={(seq) => {
                  onSelect(seq);
                  // You jumped because you wanted the question, not the grid.
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
