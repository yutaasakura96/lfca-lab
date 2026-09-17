import type { ReactNode } from 'react';
import { requireSession } from '../../lib/session.ts';
import { SentryUser } from '../../components/SentryUser.tsx';

/**
 * The session gate.
 *
 * Everything in this route group is behind it. Middleware also redirects
 * unauthenticated visitors, but middleware is a convenience that avoids
 * rendering a page only to throw it away — it is not the boundary. This is.
 *
 * It is also where the browser learns which id to report errors under, because
 * it is the one place every signed-in screen passes through.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  return (
    <>
      <SentryUser id={session.user.id} />
      {children}
    </>
  );
}
