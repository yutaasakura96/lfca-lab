import type { ReactNode } from 'react';
import { requireSession } from '../../lib/session.ts';

/**
 * The session gate.
 *
 * Everything in this route group is behind it. Middleware also redirects
 * unauthenticated visitors, but middleware is a convenience that avoids
 * rendering a page only to throw it away — it is not the boundary. This is.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireSession();
  return <>{children}</>;
}
