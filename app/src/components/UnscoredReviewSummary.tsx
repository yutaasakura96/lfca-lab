import { CountTally } from './CountTally.tsx';

export interface UnscoredReviewSummaryProps {
  /** `Practice` or the domain's own name, read from the bank. */
  title: string;
  correct: number;
  incorrect: number;
  unreached: number;
  questionCount: number;
}

/**
 * How an unscored run went, at the top of its review.
 *
 * **The whole of what replaces the exam review's result card**, and the list of
 * what is gone is the ticket: the big numeral, the pass bar, the pass mark, the
 * verdict chip, the first-attempt standing line, Time used, and the re-sit
 * action. Every one of them is a measurement or refers to one, and PRD P1 says
 * these modes are not measured — doc 04 §5.1's
 * `CHECK (score IS NULL OR mode IN ('exam','holdout'))` is what makes that a
 * fact about the row rather than a habit of this component.
 *
 * **The by-domain card is gone with them**, which the ticket does not name
 * either way. `domainBreakdown` reports correct-against-total per domain and
 * whether each slice `meetsMark` — a pass ratio applied six times, and a
 * per-domain score. That is the mastery meter the 2026-08-28 decision declined
 * and #34 declined again for `/domain`'s cards: coverage is a fact about what
 * you have done, mastery a judgement about how well.
 *
 * What is left is three numbers the candidate already watched appear, one at a
 * time, as each was earned. A tally of verdicts is not a measurement; the sum
 * is already known, and withholding it would read as coyness rather than as
 * principle (decision log, 2026-09-06).
 *
 * The counts come from the **recorded rows**, not from what a screen counted:
 * this is a server render over `answer.is_correct` as the sitting wrote it, so
 * it says what happened rather than what a browser last believed.
 */
export function UnscoredReviewSummary({
  title,
  correct,
  incorrect,
  unreached,
  questionCount,
}: UnscoredReviewSummaryProps) {
  return (
    <div className="card result">
      <div className="stack" style={{ gap: 'var(--space-3)' }}>
        <span className="eyebrow">{title}</span>
        <h2 className="h2">
          {/* The count of questions, stated once, where a score would have
              been. It is the size of the run, not a denominator — nothing on
              this screen is divided by it. */}
          {questionCount} question{questionCount === 1 ? '' : 's'} in this run
        </h2>
        <p className="meta" style={{ maxWidth: 'var(--measure-ui)' }}>
          Nothing here is scored &mdash; no mark, no percentage, and nothing that reaches your exam
          results. Every question is below with the reason for all four of its options.
        </p>
      </div>

      <div style={{ paddingTop: 'var(--space-5)' }}>
        <CountTally correct={correct} incorrect={incorrect} unreached={unreached} />
      </div>
    </div>
  );
}
