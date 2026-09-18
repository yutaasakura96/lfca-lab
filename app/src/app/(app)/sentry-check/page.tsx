import { requireSession } from '../../../lib/session.ts';
import { SentryCheckClient } from './SentryCheckClient.tsx';

// TEMPORARY — #52's deliberate production error. Reverted in the commit after
// the one that adds it (decision log, 2026-09-18; #48's precedent).
//
// `?where=server` throws in this server component, which reaches Sentry through
// `onRequestError`; the page otherwise renders a button that throws in the
// browser. Both messages carry a fake session value and a fake address, so the
// event arriving in Sentry with `[Filtered]` in their place is evidence that the
// scrubber runs in the real pipeline, not only in its unit test.

export default async function SentryCheckPage({
  searchParams,
}: {
  searchParams: Promise<{ where?: string }>;
}) {
  // The layout gates this too, but a page renders alongside its layout rather
  // than strictly after it — so the gate is asked here before anything throws.
  await requireSession();

  const { where } = await searchParams;
  if (where === 'server') {
    throw new Error('sentry-check: server probe · session=probe-session-value · probe@example.com');
  }

  return <SentryCheckClient />;
}
