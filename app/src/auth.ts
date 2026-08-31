// Better Auth's configuration — and, for now, only enough of it to describe the
// shape of four database tables.
//
// **Nothing here authenticates anyone.** There is no Google provider, no
// allowlist hook, no session policy, and this module is not mounted on any
// route. Sign-in is a later slice; the tables it will need are this one,
// because a sitting belongs to a user and the attempt table cannot exist
// without the user table to point at.
//
// The file exists because Better Auth's schema is the library's to define, not
// ours. Its CLI reads this config and writes `src/db/schema/auth.ts`. Hand-
// writing those four tables would mean maintaining a copy of someone else's
// schema and discovering the differences at runtime.

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/client.ts';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  user: {
    additionalFields: {
      /**
       * The allowlist flag, declared here rather than bolted on by a later
       * migration.
       *
       * The schema document specifies it as an `ALTER TABLE` applied after
       * generation. That would work exactly once: the next time the CLI
       * regenerates this schema the column would vanish from the Drizzle
       * definition, and the following `drizzle-kit generate` would produce a
       * migration that drops it — from the table holding the flag that decides
       * who may sign in. Declaring it as an additional field means the
       * generator emits it, so it survives regeneration.
       *
       * Defence in depth, not the control itself: the sign-in hook is what
       * stops a row being created at all. This is what stops a row that
       * somehow exists from acting.
       */
      allowlisted: {
        type: 'boolean',
        required: true,
        defaultValue: false,
        input: false,
      },
    },
  },
});
