import {
  domainBreakdown,
  formatElapsed,
  passBar,
  verdictSummary,
  type ReviewedQuestion,
} from '../domain/review.ts';
import type { SubmitOutcome } from '../domain/submission.ts';

const DOMAIN_NAME: Readonly<Record<string, string>> = {
  sysadmin: 'System Administration',
  cloud: 'Cloud Computing',
  linux: 'Linux Fundamentals',
  security: 'Security',
  devops: 'DevOps',
  pm: 'IT Project Management',
};

export interface ReviewSummaryProps {
  outcome: SubmitOutcome;
  questions: ReviewedQuestion[];
  /** Seconds between `started_at` and `submitted_at`. */
  elapsedSeconds: number;
  unanswered: number;
  flagged: number;
  firstAttemptScore: number | null;
  bestScore: number | null;
  ordinal: number;
}

/**
 * The score, and what it was made of.
 *
 * A server component over `outcomeOf`'s wire shape rather than over the row:
  * the score, the mark, the verdict and the percentage are decided in exactly
 * one place, and the page that opens an already-finalised sitting and this one
 * must not be able to describe the same row differently.
 *
 * Doc 10 §8 puts a fourth stat here — **Slowest question** — and it is absent.
 * Nothing in the schema records how long a question took: `answered_at` is set
 * once, on the first answer, and deliberately not advanced when the answer
 * changes, because least-recently-seen selection reads it. A per-question timing
 * column is a schema change, and it belongs to whoever decides they want one.
 */
export function ReviewSummary({
  outcome,
  questions,
  elapsedSeconds,
  unanswered,
  flagged,
  firstAttemptScore,
  bestScore,
  ordinal,
}: ReviewSummaryProps) {
  const score = outcome.score ?? 0;
  const bar = passBar(score, outcome.questionCount);
  const verdict = verdictSummary(score, outcome.questionCount);
  const domains = domainBreakdown(questions);

  return (
    <>
      <div className="card result">
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <span className="eyebrow">
            {/* PRD E6 must not conflate finishing with running out of time, and
                the row records which it was. */}
            {outcome.reason === 'expired' ? 'Time expired' : 'Score'}
          </span>
          <div className="row" style={{ alignItems: 'baseline', gap: 'var(--space-3)' }}>
            <span className="bigscore">
              {score}
              <span style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-faint)' }}>
                &thinsp;/&thinsp;{outcome.questionCount}
              </span>
            </span>
            <span className="mono" style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-secondary)' }}>
              {outcome.percent}%
            </span>
          </div>
          <span
            className={verdict.tone === 'correct' ? 'chip chip--correct' : 'chip chip--incorrect'}
            style={{ alignSelf: 'flex-start' }}
          >
            {verdict.text}
          </span>
          <p className="meta" style={{ marginTop: 'var(--space-2)', maxWidth: 'var(--measure-ui)' }}>
            {/* The pair the whole project is arranged around. Best drifts to
                100% by construction once re-sits are allowed; first-attempt does
                not, and neither number means much shown alone. */}
            {firstAttemptScore === null ? (
              <>This is the first sitting of this paper.</>
            ) : (
              <>
                First attempt <span className="mono">{firstAttemptScore}</span>. Best is now{' '}
                <span className="mono">{bestScore ?? score}</span>. This was sitting{' '}
                <span className="mono">{ordinal}</span>.
              </>
            )}
          </p>
        </div>

        <div className="stack" style={{ gap: 'var(--space-5)', paddingTop: 'var(--space-5)' }}>
          <div style={{ paddingTop: 'var(--space-5)' }}>
            <div className="passbar">
              <div
                className={
                  verdict.tone === 'correct' ? 'passbar__fill passbar__fill--pass' : 'passbar__fill'
                }
                style={{ width: `${bar.fillPercent}%` }}
              />
              <div className="passbar__tick" style={{ left: `${bar.tickPercent}%` }} />
              <span className="passbar__label" style={{ left: `${bar.tickPercent}%` }}>
                Pass &middot; {outcome.passMark}
              </span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
              <span className="meta mono">0</span>
              <span className="meta mono">{outcome.questionCount}</span>
            </div>
          </div>

          <div className="row statrow" style={{ gap: 'var(--space-7)', flexWrap: 'wrap' }}>
            <Stat label="Time used" value={formatElapsed(elapsedSeconds)} />
            <Stat label="Left unanswered" value={String(unanswered)} />
            <Stat label="Flagged" value={String(flagged)} tone="var(--flagged-ink)" />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'var(--space-4)',
            gap: 'var(--space-4)',
          }}
        >
          <h2 className="h2">By domain</h2>
          <span className="meta">weighted as the real exam is</span>
        </div>
        <div className="dgrid">
          {domains.map((row) => (
            <div className="dcell" key={row.domain}>
              <div className="stack" style={{ gap: 'var(--space-2)' }}>
                <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                    {DOMAIN_NAME[row.domain] ?? row.domain}
                  </span>
                  <span className="meta mono">{row.weightPercent}%</span>
                </div>
                <div className="meter">
                  <div
                    className={
                      row.meetsMark
                        ? 'meter__fill meter__fill--correct'
                        : 'meter__fill meter__fill--incorrect'
                    }
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </div>
              {/* The count, not only the meter. A bar at 60% and a bar at 62%
                  are indistinguishable at this width, and in greyscale the two
                  fill colours are as well — so the number is what carries it. */}
              <span
                className="mono"
                style={{
                  fontSize: 'var(--text-sm)',
                  textAlign: 'right',
                  color: row.meetsMark ? 'var(--correct-ink)' : 'var(--incorrect-ink)',
                }}
              >
                {row.correct}/{row.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="stack" style={{ gap: 'var(--space-1)' }}>
      <span className="eyebrow">{label}</span>
      <span className="mono" style={{ fontSize: 'var(--text-lg)', color: tone }}>
        {value}
      </span>
    </div>
  );
}
