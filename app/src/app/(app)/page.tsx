import Link from 'next/link';
import { requireSession } from '../../lib/session.ts';
import { SignOutButton } from '../../components/SignOutButton.tsx';

export default async function Home() {
  const session = await requireSession();

  return (
    <section className="card" style={{ margin: 'var(--space-6)', padding: 'var(--space-6)' }}>
      <h1 className="h1">LFCA Practice</h1>
      <p className="prose">Signed in as {session.user.email}.</p>
      <p className="prose">
        <Link href={{ pathname: '/exams' }}>The sixteen practice papers</Link> — each with your best
        and first-attempt score.
      </p>
      <SignOutButton />
    </section>
  );
}
