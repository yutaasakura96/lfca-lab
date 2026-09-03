'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_REVIEW_FILTER,
  REVIEW_FILTERS,
  VERDICT_LABEL,
  type QuestionVerdict,
  type ReviewCounts,
  type ReviewFilter,
} from '../domain/review.ts';

/** The tile's fill, per verdict — the same three the card's head tile uses. */
const TILE_MODIFIER: Readonly<Record<QuestionVerdict, string>> = {
  correct: 'tile--correct',
  incorrect: 'tile--incorrect',
  unanswered: '',
};

/** One question as the rail draws it. Nothing about its content. */
export interface ReviewTile {
  number: number;
  verdict: QuestionVerdict;
  flagged: boolean;
}

export interface ReviewBoardProps {
  counts: ReviewCounts;
  tiles: ReviewTile[];
  score: number;
  passMark: number;
  /** The result and by-domain cards, rendered on the server and passed through. */
  summary: ReactNode;
  /** All sixty cards, rendered on the server. This component only hides some. */
  children: ReactNode;
}

const FILTER_LABEL: Readonly<Record<ReviewFilter, string>> = {
  incorrect: 'Incorrect',
  correct: 'Correct',
  flagged: 'Flagged',
  all: 'All',
};

/** What an empty result means, said specifically rather than as "nothing here". */
const EMPTY_LABEL: Readonly<Record<ReviewFilter, string>> = {
  incorrect: 'Nothing missed — every question on this paper was answered correctly.',
  correct: 'Nothing correct on this sitting.',
  flagged: 'No flagged questions in this attempt.',
  all: 'This sitting has no questions.',
};

function FilterGlyph({ filter }: { filter: ReviewFilter }) {
  const common = {
    className: 'ico',
    // 14, on doc 05 §12 rule 8's icon grid. The prototype draws these at 13.
    width: 14,
    height: 14,
    viewBox: '0 0 14 14',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    'aria-hidden': true,
  };
  if (filter === 'incorrect') {
    return (
      <svg {...common}>
        <path d="M3.6 3.6 10.4 10.4M10.4 3.6 3.6 10.4" />
      </svg>
    );
  }
  if (filter === 'correct') {
    return (
      <svg {...common} strokeLinejoin="round">
        <path d="M2.5 7.4 5.4 10.3 11.5 3.6" />
      </svg>
    );
  }
  if (filter === 'flagged') {
    return (
      <svg {...common} strokeWidth="1.8" strokeLinejoin="round">
        <path d="M3.6 12.6V2.2h7.2L9.1 5.1l1.7 2.9H3.6" />
      </svg>
    );
  }
  return null;
}

/**
 * The review's one piece of client state: which questions are shown.
 *
 * **All sixty cards are server-rendered and passed through as children.** This
 * component never receives a question, a stem, an explanation or an answer key —
 * it holds a single string and puts it on a container, and CSS does the hiding.
 * That is what keeps the longest reading in the product out of the JavaScript
 * bundle: sixty questions with four explanations each is a great deal of prose
 * to ship twice.
 *
 * The default is Incorrect, per doc 10 §8 — nobody opens this to admire the
 * ones they got right. "Incorrect" here claims the blanks too; see the header of
 * `domain/review.ts` for why hiding them from this view would be the wrong
 * behaviour on the screen that exists to show misses.
 */
export function ReviewBoard({
  counts,
  tiles,
  score,
  passMark,
  summary,
  children,
}: ReviewBoardProps) {
  const [filter, setFilter] = useState<ReviewFilter>(DEFAULT_REVIEW_FILTER);
  const [jumpTo, setJumpTo] = useState<number | null>(null);
  const shown = counts[filter];

  /**
   * The scroll happens **after** the filter has been committed to the DOM, not
   * in a callback scheduled beside it.
   *
   * Both are one state update, so they land in one render, and this effect runs
   * once the new layout exists. Scrolling from the click handler — or from a
   * `requestAnimationFrame` inside it — measures the *old* layout: the target
   * may still be `display: none`, and even when it is not, showing the other
   * fifty-nine cards moves it. Measured before this was an effect: a jump to
   * question 1 left it 1048px down the viewport.
   */
  useEffect(() => {
    if (jumpTo === null) return;
    document.getElementById(`q${jumpTo}`)?.scrollIntoView({ block: 'start' });
    setJumpTo(null);
  }, [jumpTo]);

  /**
   * A tile always shows its question, whatever the filter is set to.
   *
   * Without the reset, clicking a correct tile while filtered to Incorrect
   * jumps to a card that is hidden — the page would appear not to respond, and
   * the reader would have no way to tell that from a broken link.
   */
  function jump(number: number) {
    setFilter('all');
    setJumpTo(number);
  }

  return (
    <div className="review">
      <div className="stack" style={{ gap: 'var(--space-6)' }}>
        {summary}

        <div
          className="row filterrow"
          style={{ justifyContent: 'space-between', gap: 'var(--space-5)', flexWrap: 'wrap' }}
        >
          <div className="filters" role="group" aria-label="Show which questions">
            {REVIEW_FILTERS.map((option) => (
              <button
                key={option}
                type="button"
                className={option === filter ? 'filter filter--on' : 'filter'}
                aria-pressed={option === filter}
                onClick={() => setFilter(option)}
              >
                <FilterGlyph filter={option} />
                {FILTER_LABEL[option]} <span className="mono">{counts[option]}</span>
              </button>
            ))}
          </div>
          {/* `role="status"` so the count is announced when the filter changes.
              Without it, a keyboard reader pressing a filter gets no
              confirmation that anything happened. */}
          <span className="meta" role="status">
            Showing {shown} of {counts.all} &middot; every option explained
          </span>
        </div>

        {shown === 0 ? (
          <p className="emptyfilter">{EMPTY_LABEL[filter]}</p>
        ) : null}

        {/* The filter is an attribute here and the hiding is in `screens.css`.
            Every card stays in the document; only its display changes. */}
        <div className="qlist stack" data-filter={filter} style={{ gap: 'var(--space-6)' }}>
          {children}
        </div>
      </div>

      <aside className="rail reviewrail" aria-label="All questions">
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h2 className="h3" style={{ marginBottom: 'var(--space-4)' }}>
            All {tiles.length}
          </h2>
          <div className="grid60">
            {tiles.map((tile) => (
              <button
                key={tile.number}
                type="button"
                className={['tile', TILE_MODIFIER[tile.verdict], tile.flagged ? 'tile--flagged' : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => jump(tile.number)}
                aria-label={`Question ${tile.number}, ${VERDICT_LABEL[tile.verdict]}${
                  tile.flagged ? ', flagged' : ''
                }`}
              >
                {tile.number}
              </button>
            ))}
          </div>

          <div className="legend" style={{ marginTop: 'var(--space-4)' }}>
            <span className="legend__item">
              <span
                className="legend__swatch"
                style={{
                  borderStyle: 'solid',
                  background: 'var(--correct-solid)',
                  borderColor: 'var(--correct-solid)',
                }}
              />
              Correct
            </span>
            <span className="legend__item">
              <span
                className="legend__swatch"
                style={{
                  borderStyle: 'solid',
                  background: 'var(--incorrect-solid)',
                  borderColor: 'var(--incorrect-solid)',
                }}
              />
              Incorrect
            </span>
            <span className="legend__item">
              <span className="legend__swatch" />
              Not answered
            </span>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <RailCount label="Score" value={String(score)} />
            <RailCount label="Needed" value={String(passMark)} />
            <RailCount
              label="Gap"
              value={score >= passMark ? `+${score - passMark}` : String(score - passMark)}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function RailCount({ label, value }: { label: string; value: string }) {
  return (
    <div className="railcount">
      <span style={{ color: 'var(--ink-secondary)' }}>{label}</span>
      <span className="mono">{value}</span>
    </div>
  );
}
