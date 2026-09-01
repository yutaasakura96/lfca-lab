import { redirect } from 'next/navigation';
import { getSession } from '../../../lib/session.ts';
import { SignInButton } from '../../../components/SignInButton.tsx';

/**
 * The only screen outside the session gate.
 *
 * It has two states. The ordinary one invites you to sign in. The denied one is
 * shown to an account that is not on the allowlist, and it is deliberately
 * uninformative: it does not echo the address back, does not say whether the
 * address was close, and offers no way to ask for access. An unrecognised
 * visitor should learn only that the app is private — anything more is
 * something to probe.
 */
export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; denied?: string }>;
}) {
  const session = await getSession();
  const { next, denied } = await searchParams;

  if (session) redirect('/');

  return (
    <section className="card" style={{ maxWidth: '32rem', margin: 'var(--space-8) auto', padding: 'var(--space-7)' }}>
      {denied ? (
        <>
          <h1 className="h2">This app is private</h1>
          <p className="prose">
            That account cannot sign in here. Nothing has been saved and no account was created.
          </p>
        </>
      ) : (
        <>
          <h1 className="h2">LFCA Practice</h1>
          <p className="prose">
            Sit the sixteen practice papers under a real clock, and keep an honest first-attempt
            score for each.
          </p>
          <SignInButton next={next} />
        </>
      )}
    </section>
  );
}
