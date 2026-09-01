// Better Auth: Google sign-in, closed by an email allowlist.
//
// The allowlist is checked in `validateUserInfo`, which Better Auth documents as
// running **before it creates a user, links an account, or signs a returning
// user in**. That last clause is why this is the right hook rather than a
// screen-level check: it runs on *every* sign-in, so tightening the list locks
// out an account that already has a row, without anyone having to go and delete
// it.
//
// Nothing here decides who is allowed. That rule lives in the pure layer and is
// tested there against every near-miss; this file only supplies the environment
// and refuses on the answer.

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db/client.ts';
import { isAllowed } from './domain/allowlist.ts';

/**
 * Read at call time, not at module load.
 *
 * A module-load read would bake in whatever the value was when the process
 * started, which makes "tighten the list and restart" a subtly different
 * operation from "tighten the list". Reading per sign-in means the deployed
 * value is always the one that applies.
 */
function allowlist(): string | undefined {
  return process.env.ALLOWED_EMAILS;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },

  onAPIError: {
    /**
     * Send a refused sign-in to our own screen.
     *
     * Without this, Better Auth renders its default error page — which shows
     * the raw error code, offers "Go Home", and looks nothing like this app.
     * Doc 08 §3 asks for the opposite: a plain, unhostile page with nothing to
     * probe. Leaking an internal code on a stock error page is exactly what
     * that requirement exists to prevent.
     *
     * Better Auth appends `?error=...` to this URL; the sign-in screen reads
     * only whether an error happened, never what it said.
     */
    errorURL: '/sign-in',
  },

  session: {
    // Thirty days. A 90-minute sitting can never be interrupted by an expiring
    // session, and a candidate who studies weekly never signs in twice.
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  user: {
    additionalFields: {
      /**
       * Defence in depth behind the check below, not the control itself. The
       * hook is what stops a row existing; this is what stops a row that
       * somehow exists from acting.
       *
       * Declared here rather than added by a later migration: the schema file
       * is generated, and an `ALTER` would be dropped by the next
       * regeneration — see the decision log.
       */
      allowlisted: {
        type: 'boolean',
        required: true,
        defaultValue: false,
        input: false,
      },
    },

    /**
     * The gate. Returning an error here means Better Auth writes nothing —
     * no user, no account, no session.
     *
     * The message deliberately says nothing about *why*. It does not echo the
     * address back, does not distinguish "not on the list" from "list is
     * empty", and offers nothing to probe: an unrecognised visitor should learn
     * only that the app is private.
     */
    validateUserInfo: ({ user }) => {
      if (isAllowed(user.email, user.emailVerified === true, allowlist())) return;

      return {
        error: 'not_allowlisted',
        errorDescription: 'This app is private.',
      };
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Reached only for identities the gate above already admitted, so this
        // is always true at the moment it is written. It exists so that every
        // later query can filter on a column rather than re-deriving the rule.
        before: async (user) => ({ data: { ...user, allowlisted: true } }),
      },
    },
  },

  // Must be last: it lets Better Auth set cookies from server actions and
  // route handlers in the App Router.
  plugins: [nextCookies()],
});
