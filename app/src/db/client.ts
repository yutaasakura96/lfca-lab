// The database handle.
//
// One pool, built from the connection string. Constructing a `Pool` opens
// nothing — the first query does — so importing this module is cheap and safe
// in a script, a test, or a schema generator that only wants to know the shape
// of things. That is deliberate: a module that throws at import time is hostile
// to exactly the tooling that has no intention of connecting.
//
// Nothing under `src/domain/` may import this file, and a test asserts that.
// The pure layer decides numbers; this decides nothing.

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

/**
 * The direct (unpooled) Neon connection is the right one here: Neon's own
 * documentation routes schema migrations to the direct host, because tools that
 * hold a transaction open across statements do not survive transaction pooling.
 * When the app is deployed and serving requests it will want a second, pooled
 * URL alongside this one — recorded in the deployment doc rather than guessed
 * at now.
 */
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });

export type Db = typeof db;

/**
 * Fail loudly, at the point of use, when there is nowhere to connect.
 *
 * Called by anything that actually talks to Postgres — the migration runner,
 * the seed, the integration tests. Keeping the check here rather than at import
 * means the failure names the thing you were trying to do.
 */
export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Put the Neon dev branch connection string in app/.env.local.',
    );
  }
  return url;
}
