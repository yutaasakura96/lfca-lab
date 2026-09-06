import Link from 'next/link';
import { PracticeSetup } from '../../../components/PracticeSetup.tsx';
import { requireSession } from '../../../lib/session.ts';

export const metadata = { title: 'Practice — LFCA Practice' };

/**
 * Practice setup: the length control, and nothing to choose between.
 *
 * No grid, because a practice sitting draws on all six domains by the official
 * weights — that is a fact about the mode, not a choice. The split itself is
 * deliberately not listed: it differs per length (6/4/3/3/2/2 at twenty, not
 * 18/11/10/8/7/6), so a table printed beside a selector would be right for one
 * of its three positions and quietly wrong for the other two.
 */
export default async function Practice() {
  await requireSession('/practice');

  return (
    <div className="page setuppage">
      <div className="row" style={{ gap: 'var(--space-3)' }}>
        <Link className="btn btn--quiet" href={{ pathname: '/' }}>
          ← Home
        </Link>
      </div>

      <div className="stack" style={{ gap: 'var(--space-2)' }}>
        <h1 className="h1">Practice</h1>
        <p className="meta" style={{ fontSize: 'var(--text-sm)', maxWidth: 'var(--measure-wide)' }}>
          The real exam&rsquo;s composition without its clock: questions drawn from all six domains
          in the published weights, with the answer and all four explanations revealed as you go.
          Nothing here is scored — that is what the sixteen papers are for.
        </p>
      </div>

      <div className="card setup">
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <span className="eyebrow">Weighted practice</span>
          <span className="meta">
            Sixty is the full-length rehearsal; twenty is the one that gets done on a weeknight.
          </span>
        </div>

        <PracticeSetup />
      </div>
    </div>
  );
}
