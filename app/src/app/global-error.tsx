'use client';

/**
 * The last resort: an error in the root layout itself, where the app's own
 * chrome cannot be trusted to render.
 *
 * This one replaces the whole document, so it carries its own html and body and
 * cannot rely on the shell. It stays deliberately plain — reaching for tokens
 * here would mean depending on the stylesheet that may be the thing that broke.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', lineHeight: 1.5 }}>
        <h1 style={{ fontSize: '1.25rem' }}>LFCA Practice could not start</h1>
        <p>Reloading usually fixes this. Your answers are saved as they are made.</p>
        <button type="button" onClick={reset} style={{ padding: '0.5rem 1rem' }}>
          Reload
        </button>
      </body>
    </html>
  );
}
