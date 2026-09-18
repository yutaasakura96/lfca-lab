'use client';

// TEMPORARY — the browser half of #52's deliberate production error.
export function SentryCheckClient() {
  return (
    <main className="page">
      <h1>Sentry check</h1>
      <p>Press the button to throw in the browser. Add <code>?where=server</code> to throw on the server.</p>
      <button
        type="button"
        className="btn btn--primary"
        onClick={() => {
          throw new Error('sentry-check: client probe · session=probe-session-value · probe@example.com');
        }}
      >
        Throw in the browser
      </button>
    </main>
  );
}
