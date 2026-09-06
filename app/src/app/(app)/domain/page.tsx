import Link from 'next/link';
import { DomainSetup, type DomainCard } from '../../../components/DomainSetup.tsx';
import { db } from '../../../db/client.ts';
import { listDomains } from '../../../db/queries/domains.ts';
import { lastPractisedLabel } from '../../../domain/coverage.ts';
import { weightPercent } from '../../../domain/weights.ts';
import { requireSession } from '../../../lib/session.ts';

export const metadata = { title: 'Study by domain — LFCA Practice' };

/**
 * Doc 10 §3, minus the four elements the spec cuts.
 *
 * A server component: the coverage query runs here and only the rendered
 * figures cross to the browser, including the "last practised" label — it is a
 * pure function of a date and a `now`, and `now` belongs on the same side as
 * every other number on the page.
 *
 * There is no sweep of expired sittings here, unlike the exam list. Nothing on
 * this screen reads an attempt: the counts come from answer rows, which an
 * unfinalised sitting has already written. Home is where a stale open sitting
 * would show, and home sweeps.
 */
export default async function DomainMode() {
  const session = await requireSession('/domain');
  const rows = await listDomains(db, session.user.id);
  const now = new Date();

  const cards: DomainCard[] = rows.map((row) => ({
    domain: row.domain,
    name: row.name,
    weightPercent: weightPercent(row.domain),
    competencies: row.competencies,
    available: row.available,
    seen: row.seen,
    lastPractised: lastPractisedLabel(row.lastPractisedAt, now),
  }));

  // The six domains are a fact about the bank, so none of them is a broken
  // seed rather than an empty state. Said here, once, so the component below
  // needs no non-null assertion and no branch for a case that cannot be true
  // without something upstream having failed — the same shape as
  // `startComposedSitting` refusing a composition of nothing.
  const [first, ...rest] = cards;
  if (first === undefined) {
    throw new Error('The bank has no domains. Run `npm run seed` against this database.');
  }

  return (
    <div className="page setuppage">
      <div className="row" style={{ gap: 'var(--space-3)' }}>
        <Link className="btn btn--quiet" href={{ pathname: '/' }}>
          ← Home
        </Link>
      </div>

      <div className="stack" style={{ gap: 'var(--space-2)' }}>
        <h1 className="h1">Study by domain</h1>
        <p className="meta" style={{ fontSize: 'var(--text-sm)', maxWidth: 'var(--measure-wide)' }}>
          Practice restricted to one domain. Same immediate feedback, same four explanations per
          question, no clock and no score. The percentages beside each domain are its weight on the
          real exam — System Administration is nearly a third of it.
        </p>
      </div>

      <DomainSetup domains={[first, ...rest]} />
    </div>
  );
}
