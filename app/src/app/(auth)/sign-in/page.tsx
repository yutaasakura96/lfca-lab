import { redirect } from 'next/navigation';
import { getSession } from '../../../lib/session.ts';
import { SignInButton } from '../../../components/SignInButton.tsx';

/**
 * The only screen outside the session gate.
 *
 * Two states. The ordinary one invites you to sign in. The refused one is shown
 * to an account that is not on the allowlist, and it is deliberately
 * uninformative: it does not echo the address back, does not say whether the
 * address was close, does not repeat the error code Better Auth passed in, and
 * offers no way to ask for access. An unrecognised visitor should learn only
 * that the app is private — anything more is something to probe.
 *
 * The refusal arrives two ways, and both mean the same thing to a reader:
 * `error` from Better Auth's own redirect when the sign-in hook refused, and
 * `denied` from the session gate when a session somehow exists for a user who
 * is not allowlisted.
 */
export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; denied?: string; error?: string }>;
}) {
  const session = await getSession();
  const { next, denied, error } = await searchParams;

  // Asked of the database, not of a cookie — so this cannot be wrong about
  // whether a session is real, and cannot bounce someone into a loop.
  if (session) redirect('/');

  // Better Auth redirects here with `?error=not_allowlisted&error_description=…`.
  // Normalised to our own flag before rendering, so the internal code reaches
  // neither the address bar nor the page payload. It says nothing an attacker
  // could use, but it is this project's vocabulary rather than the reader's,
  // and a refusal screen should be the least interesting page in the app.
  if (error !== undefined) redirect('/sign-in?denied=1');

  const refused = denied !== undefined;

  return (
    <section
      className="card"
      style={{ maxWidth: '32rem', margin: 'var(--space-8) auto', padding: 'var(--space-7)' }}
    >
      {refused ? (
        <>
          <h1 className="h2">This app is private</h1>
          <p className="prose">
            That account cannot sign in here. No account was created and nothing was saved.
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
