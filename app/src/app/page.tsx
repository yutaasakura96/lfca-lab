/**
 * A placeholder home screen.
 *
 * It exists so the shell has something to render and so both themes can be
 * looked at. The real home screen — the four modes — arrives with sign-in;
 * the exam list arrives after that.
 */
export default function Home() {
  return (
    <section className="card" style={{ margin: 'var(--space-6)', padding: 'var(--space-6)' }}>
      <h1 className="h1">LFCA Practice</h1>
      <p className="prose">
        The shell is up: tokens, both themes, and the error boundaries. Sign-in and the sixteen
        papers come next.
      </p>
    </section>
  );
}
