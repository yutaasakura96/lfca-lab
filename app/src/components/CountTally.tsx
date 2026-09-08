export interface CountTallyProps {
  correct: number;
  incorrect: number;
  /** Questions the run never put in front of anybody. */
  unreached: number;
}

/**
 * How an unscored run went, in three numbers.
 *
 * **One component because two screens say this**, and they say it about the
 * same sitting minutes apart: the finish dialog reports it from what the
 * navigator counted, and the review reports it from the rows that were written.
 * Those two numbers agree by construction — every verdict came back from a
 * write — and rendering them through one component is what stops the *claim*
 * drifting even when the numbers do not. The same call `ModalShell` and `Glyph`
 * were extracted on.
 *
 * **Three numbers, and nothing that could be read as a fourth.** No total, no
 * percentage, no mark, no verdict: PRD P1 says these modes are not measured,
 * and doc 04 §5.1's `CHECK (score IS NULL OR mode IN ('exam','holdout'))`
 * makes the column agree. A tally of verdicts the candidate watched appear one
 * at a time is not a measurement; a ratio would be.
 *
 * Colour is not the only signal, per doc 05 §8 — each cell is labelled, and at
 * `grayscale(1)` the three are told apart by their own words.
 */
export function CountTally({ correct, incorrect, unreached }: CountTallyProps) {
  return (
    <div className="tally tally--three">
      <div className="tally__cell">
        <span className="eyebrow">Correct</span>
        <span className="tally__num" style={{ color: 'var(--correct-ink)' }}>
          {correct}
        </span>
      </div>
      <div className="tally__cell">
        <span className="eyebrow">Incorrect</span>
        <span className="tally__num" style={{ color: 'var(--incorrect-ink)' }}>
          {incorrect}
        </span>
      </div>
      <div className="tally__cell">
        <span className="eyebrow">Not reached</span>
        {/* No tone of its own. A question never reached is not a failure, and
            the two semantic families on this row are already saying the only
            thing that has a verdict. */}
        <span className="tally__num">{unreached}</span>
      </div>
    </div>
  );
}
