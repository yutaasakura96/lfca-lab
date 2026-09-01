'use client';

import { useEffect } from 'react';

/**
 * The error boundary for anything that throws while rendering a screen.
 *
 * Rendered in the product's own styling, never as a stack trace. A candidate
 * who hits this mid-study should see something that looks like the app and
 * offers a way forward, not a wall of frames — and should certainly not see
 * the internals of a query.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Reported rather than displayed. The message may name a table or an id,
    // and neither belongs on screen.
    console.error(error);
  }, [error]);

  return (
    <section className="card" style={{ margin: 'var(--space-6)', padding: 'var(--space-6)' }}>
      <h1 className="h2">Something went wrong</h1>
      <p className="prose">
        That screen failed to load. Nothing you have answered has been lost — answers are saved as
        they are made.
      </p>
      <button type="button" className="btn btn--primary" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
