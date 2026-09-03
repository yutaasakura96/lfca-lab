import type { WriteFailure } from '../lib/writes.ts';
import { Stem } from './Stem.tsx';

export interface SittingOption {
  ref: string;
  text: string;
}

export interface SittingQuestionProps {
  question: { id: string; stem: string; options: SittingOption[] };
  /** 1-based, as displayed. The navigator's tile says the same number. */
  number: number;
  total: number;
  answer: string | null;
  flagged: boolean;
  /**
   * A write the server refused for a reason repeating cannot fix, and whose
   * value has therefore been put back. Everything else — a dropped connection,
   * a 5xx — is the outbox's, and says so in the bar rather than here.
   */
  failure: WriteFailure | null;
  /**
   * The clock has run out — which is a *reason*, and it says so on screen.
   * Kept apart from `locked` because a submitted sitting is equally unchangeable
   * and running out of time is not why.
   */
  expired: boolean;
  /**
   * Nothing on this question can be changed any more, for whatever reason. The
   * paper stays readable and navigable.
   */
  locked: boolean;
  onAnswer: (optionRef: string | null) => void;
  onFlag: (flagged: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

function failureMessage(failure: WriteFailure): string {
  switch (failure.code) {
    case 'attempt_expired':
      return "This sitting's time has run out — reload to see where it stands.";
    case 'attempt_already_submitted':
      return 'This sitting was already submitted.';
    default:
      // Everything else the server refuses outright — a question that is not on
      // this paper, a body it would not parse. Both are bugs rather than
      // anything a candidate can act on, so this says what happened to the
      // value and does not invent an instruction.
      return 'Not saved — put back as it was.';
  }
}

/**
 * One question, answerable and flaggable.
 *
 * Presentational, and deliberately so: it holds no state and sends no request.
 * Answers and flags belong to the sitting rather than to a question, because a
 * question that owned its own answer would lose it the moment the navigator
 * moved to another one — and the navigator has to be able to report on all
 * sixty at once, not on whichever is currently rendered.
 *
 * The screen updates the instant you click and the write follows — never the
 * other way round. Ninety minutes for sixty questions is fifteen seconds of
 * reading and one click, and a click that waits on a round trip spends a
 * noticeable part of that budget doing nothing.
 */
export function SittingQuestion({
  question,
  number,
  total,
  answer,
  flagged,
  failure,
  expired,
  locked,
  onAnswer,
  onFlag,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: SittingQuestionProps) {
  return (
    <div className="stack" style={{ gap: 'var(--space-5)' }}>
      <div className="qhead">
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <h1 className="eyebrow">
            Question {number} of {total}
          </h1>
          <span className="meta">No feedback until you submit</span>
        </div>

        <button
          type="button"
          className={flagged ? 'btn btn--flag' : 'btn'}
          aria-pressed={flagged}
          disabled={locked}
          onClick={() => onFlag(!flagged)}
        >
          <svg
            className="ico"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill={flagged ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3.6 12.6V2.2h7.2L9.1 5.1l1.7 2.9H3.6" />
          </svg>
          {flagged ? 'Flagged for review' : 'Flag for review'}
        </button>
      </div>

      <Stem text={question.stem} />

      <div className="opts">
        {question.options.map((option, index) => {
          const chosen = option.ref === answer;
          return (
            <button
              type="button"
              key={option.ref}
              className={chosen ? 'opt opt--interactive opt--selected' : 'opt opt--interactive'}
              aria-pressed={chosen}
              disabled={locked}
              onClick={() => onAnswer(option.ref)}
            >
              <span className="opt__key">{String.fromCharCode(65 + index)}</span>
              <span className="opt__body">
                {/* Colour is never the only signal: the chosen option says so in
                    words and carries a glyph, so it survives greyscale. */}
                {chosen ? (
                  <span className="opt__verdict" style={{ color: 'var(--accent-ink)' }}>
                    <svg
                      className="ico"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="7" cy="7" r="4.2" fill="currentColor" />
                    </svg>
                    Selected
                  </span>
                ) : null}
                <span className="opt__text">{option.text}</span>
              </span>
            </button>
          );
        })}
      </div>

      {expired ? (
        // Doc 05's `incorrect` family, the same one a save failure uses, and
        // for a related reason: both say something about the sitting rather
        // than about the answer. It states the fact and stops there — where
        // this leads is the resume slice's to decide, and a link that guessed
        // would be a link to nowhere.
        <div className="row">
          <span className="chip chip--incorrect" role="status">
            This sitting&rsquo;s time has run out. Your answers are saved as they were.
          </span>
        </div>
      ) : null}

      {failure === null ? null : (
        // The incorrect family, which is what doc 10 gives a save failure. It
        // says nothing about the answer — only about whether it was written.
        // Reached only by a refusal that will not change on a retry: the chip
        // in the bar is where an ordinary failing write is reported, because
        // that one is about the sitting rather than about this question.
        // Wrapped in a row so the chip hugs its text: a stack stretches its
        // children, and a pill the width of the page stops reading as a chip.
        <div className="row">
          <span className="chip chip--incorrect" role="status">
            {failureMessage(failure)}
          </span>
        </div>
      )}

      <div className="footer">
        <div className="row keys" style={{ gap: 'var(--space-3)' }}>
          <span className="kbd">1</span>
          <span className="kbd">2</span>
          <span className="kbd">3</span>
          <span className="kbd">4</span>
          <span className="meta">choose</span>
          <span className="kbd">F</span>
          <span className="meta">flag</span>
          <span className="kbd">←</span>
          <span className="kbd">→</span>
          <span className="meta">move</span>
        </div>
        <div className="row" style={{ gap: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn--quiet"
            disabled={locked || answer === null}
            onClick={() => onAnswer(null)}
          >
            Clear answer
          </button>
          <button type="button" className="btn" disabled={!hasPrevious} onClick={onPrevious}>
            Previous
          </button>
          <button type="button" className="btn btn--primary" disabled={!hasNext} onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
