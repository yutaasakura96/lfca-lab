import type { GradedNavigatorModel } from '../domain/navigator.ts';
import { Glyph } from './Glyph.tsx';
import { NavigatorTile } from './NavigatorTile.tsx';

/**
 * *This session*, beside the question.
 *
 * Doc 10 §7's rail, and what it reports is progress rather than a way to move:
 * the tiles take no `onSelect`, so they render as spans rather than as sixty
 * tab stops that refuse every press. A composed sitting is strictly forward
 * (decision log, 2026-09-06); re-reading is the review's job, and the review is
 * a route.
 *
 * **Doc 10 §7's second card is not built.** It draws a *Weakest so far* card
 * grouping misses by competency with a **Drill these after the run** button,
 * and both halves are missing an input rather than deferred for effort: drills
 * are markdown in the repo and outside the app by standing decision, so the
 * button would point nowhere — and grouping performance by competency to say
 * where you are weak is a readiness judgement, which the 2026-08-28 decision
 * declined to build and #34 declined again when it cut the mastery meter.
 * Coverage is a fact about what you have done; mastery is a judgement about how
 * well.
 */
export function SessionRail({ model }: { model: GradedNavigatorModel }) {
  const graded = model.correct + model.incorrect;
  const total = model.tiles.length;

  return (
    <section className="card rail" aria-label="This session">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 className="h2">This session</h2>
        <span className="meta">answers are final</span>
      </div>

      <div className="grid60 gradedgrid" style={{ marginTop: 'var(--space-4)' }}>
        {model.tiles.map((tile) => (
          <NavigatorTile key={tile.questionId} tile={tile} />
        ))}
      </div>

      {/* The same four states the tiles carry, named. The glyph is what makes
          correct and incorrect legible without colour; this is what makes the
          glyph legible as meaning rather than as decoration. */}
      <div className="legend" style={{ marginTop: 'var(--space-5)' }}>
        <div className="legend__item">
          <span className="legend__swatch" />
          Not answered
        </div>
        <div className="legend__item">
          <span
            className="legend__swatch"
            style={{
              borderStyle: 'solid',
              borderColor: 'var(--accent-solid)',
              background: 'var(--accent-solid)',
            }}
          />
          Current
        </div>
        {/* These two carry the glyph the tiles carry, which is the point of
            the legend rather than a flourish: at `grayscale(1)` the correct and
            incorrect fills are all but the same grey, so the swatches would be
            telling the reader nothing the words beside them had not. */}
        <div className="legend__item">
          <span
            className="legend__swatch"
            style={{
              borderStyle: 'solid',
              borderColor: 'var(--correct-solid)',
              background: 'var(--correct-solid)',
              color: 'var(--correct-on-solid)',
            }}
          >
            <Glyph role="correct" />
          </span>
          Correct
        </div>
        <div className="legend__item">
          <span
            className="legend__swatch"
            style={{
              borderStyle: 'solid',
              borderColor: 'var(--incorrect-solid)',
              background: 'var(--incorrect-solid)',
              color: 'var(--incorrect-on-solid)',
            }}
          >
            <Glyph role="chosen-wrong" />
          </span>
          Incorrect
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-5)' }}>
        <div className="railcount">
          <span className="meta" style={{ fontSize: 'var(--text-sm)', color: 'var(--correct-ink)' }}>
            Correct
          </span>
          <span className="mono" style={{ color: 'var(--correct-ink)' }}>
            {model.correct}
          </span>
        </div>
        <div className="railcount">
          <span
            className="meta"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--incorrect-ink)' }}
          >
            Incorrect
          </span>
          <span className="mono" style={{ color: 'var(--incorrect-ink)' }}>
            {model.incorrect}
          </span>
        </div>
        <div className="railcount">
          <span className="meta" style={{ fontSize: 'var(--text-sm)' }}>
            Remaining
          </span>
          <span className="mono">{model.remaining}</span>
        </div>
      </div>

      <p
        className="meta"
        style={{ marginTop: 'var(--space-5)', lineHeight: 'var(--leading-normal)' }}
      >
        {/* Said here rather than discovered at the first click. The rule is the
            product's, not the network's: an answer is graded when it is given,
            and there is no way back to a question already answered. */}
        This sitting moves forward only. An answer is marked as soon as you give it, and
        every option is explained straight away.{' '}
        {graded === total && total > 0
          ? 'You have answered all of them.'
          : `${graded} of ${total} marked so far.`}
      </p>
    </section>
  );
}
