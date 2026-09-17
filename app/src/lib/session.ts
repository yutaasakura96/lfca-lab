// Reading the session on the server.
//
// One place, so that every screen and every query asks the same question the
// same way. `requireSession` redirects rather than returning null, because a
// screen that has to remember to check is a screen that will one day forget.

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { auth } from '../auth.ts';

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * The session gate for anything behind sign-in.
 *
 * Sends an unauthenticated visitor to sign-in carrying where they were going,
 * so a bookmarked in-progress attempt survives the round trip.
 *
 * Also refuses a session whose user is not allowlisted. That should be
 * unreachable — the sign-in hook prevents the row existing at all — which is
 * exactly why it is here: two layers are only independent if the later one
 * does not assume the earlier one worked.
 */
export async function requireSession(next?: string) {
  const session = await getSession();

  if (!session) {
    redirect(next ? `/sign-in?next=${encodeURIComponent(next)}` : '/sign-in');
  }

  if ((session.user as { allowlisted?: boolean }).allowlisted !== true) {
    redirect('/sign-in?denied=1');
  }

  // Anything reported from here on belongs to this id — and to nothing else
  // about them (doc 03 §9). Set after the two refusals rather than before, so a
  // session that is about to be rejected never tags an event.
  Sentry.setUser({ id: session.user.id });

  return session;
}
