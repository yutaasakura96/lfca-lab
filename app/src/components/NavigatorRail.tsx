import type { NavigatorModel } from '../domain/navigator.ts';
import { NavigatorTile } from './NavigatorTile.tsx';

/**
 * The navigator on a pointer layout: all sixty at once, beside the question.
 *
 * The rail and the sheet are two components rather than one at two widths,
 * because they are two different things. This one is a ten-column grid of 34px
 * tiles that is always open and never obscures the question; the sheet is a
 * disclosure over a seven-column grid of 44px ones. Collapsing them into one
 * component with a breakpoint would mean a single set of props pretending to
 * describe both, and the 34px tile would then be one CSS mistake away from a
 * touch screen.
 *
 * **470px is not negotiable at 1440** (doc 10 §4): ten 34px tiles and nine 8px
 * gaps is 412px, and the card padding needs the rest. A narrower rail overflows.
 */
export function NavigatorRail({
  model,
  passMark,
  onSelect,
}: {
  model: NavigatorModel;
  passMark: number;
  onSelect: (seq: number) => void;
}) {
  return (
    <nav className="card rail" aria-label="Question navigator">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 className="h2">Navigator</h2>
        <span className="meta">jump anywhere, any time</span>
      </div>

      <div className="grid60" style={{ marginTop: 'var(--space-4)' }}>
        {model.tiles.map((tile) => (
          <NavigatorTile key={tile.questionId} tile={tile} onSelect={onSelect} />
        ))}
      </div>

      {/* The legend is what makes the border styles readable as meaning rather
          than as decoration. It names the same four states the labels do. */}
      <div className="legend" style={{ marginTop: 'var(--space-5)' }}>
        <div className="legend__item">
          <span className="legend__swatch" />
          Unanswered
        </div>
        <div className="legend__item">
          <span
            className="legend__swatch"
            style={{
              borderStyle: 'solid',
              borderColor: 'var(--line-control)',
              background: 'var(--surface-inset)',
            }}
          />
          Answered
        </div>
        <div className="legend__item">
          <span
            className="legend__swatch"
            style={{
              borderStyle: 'solid',
              borderColor: 'var(--accent-solid)',
              background: 'var(--accent-solid)',
              outline: 'var(--focus-ring-width) solid var(--focus-ring)',
              outlineOffset: 'var(--focus-ring-offset)',
            }}
          />
          Current
        </div>
        <div className="legend__item">
          <span
            className="legend__swatch tile--flagged"
            style={{
              borderStyle: 'solid',
              borderColor: 'var(--line-control)',
              background: 'var(--surface-inset)',
            }}
          />
          Flagged
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-5)' }}>
        <div className="railcount">
          <span className="meta" style={{ fontSize: 'var(--text-sm)' }}>
            Answered
          </span>
          <span className="mono">{model.answered}</span>
        </div>
        <div className="railcount">
          <span className="meta" style={{ fontSize: 'var(--text-sm)' }}>
            Unanswered
          </span>
          <span className="mono">{model.unanswered}</span>
        </div>
        <div className="railcount">
          <span className="meta" style={{ fontSize: 'var(--text-sm)', color: 'var(--flagged-ink)' }}>
            Flagged for review
          </span>
          <span className="mono" style={{ color: 'var(--flagged-ink)' }}>
            {model.flagged}
          </span>
        </div>
        <div className="railcount">
          <span className="meta" style={{ fontSize: 'var(--text-sm)' }}>
            Needed to pass
          </span>
          <span className="mono">{passMark}</span>
        </div>
      </div>

      <p className="meta" style={{ marginTop: 'var(--space-5)', lineHeight: 'var(--leading-normal)' }}>
        Submitting ends the sitting and reveals every answer at once. Nothing is marked before then.
      </p>
    </nav>
  );
}
