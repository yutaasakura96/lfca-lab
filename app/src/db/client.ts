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
 * `DATABASE_URL` is the **pooled** (`-pooler`) Neon host, and this is the app's
 * handle: every route, page and query helper reaches Postgres through it. The
 * pooler is what a serverless function should hold, because it can open a
 * connection per invocation and Neon's connection ceiling is the first thing
 * that breaks under load (doc 03 §10).
 *
 * The direct host lives in `DATABASE_URL_UNPOOLED` and is read by
 * `drizzle-kit migrate` and the seed — see {@link requireDirectDatabaseUrl}.
 * Nothing in `src/` builds a handle to it, deliberately: two spellings of one
 * database are worth having, and a second way to reach the wrong one is not.
 *
 * Local and production both point this at a pooled host, so the pooler is
 * exercised every day rather than only in the environment that cannot be
 * debugged from.
 */
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });

export type Db = typeof db;

/**
 * Anything that can run a statement: the handle above, or a transaction opened
 * on it.
 *
 * A query helper that takes this rather than {@link Db} can be composed into a
 * caller's transaction — which is how a sitting and the questions it asks are
 * written down together, or not at all. Helpers that *open* a transaction still
 * take `Db`, because only the handle can.
 */
export type Executor = Pick<Db, 'execute'>;

/**
 * The **direct** (non-`-pooler`) host — the other spelling of the same database
 * — failing loudly at the point of use when it is absent.
 *
 * `DATABASE_URL_UNPOOLED` is read by `drizzle-kit migrate` and by the seed, and
 * by nothing else. Neon routes schema migrations to the direct host because
 * session-level advisory locks and `SET`/`RESET` are unsupported on a pooled
 * connection and migration tools use both; the seed holds one long
 * multi-statement transaction, which is the same shape. This function is the
 * seed's way in. `drizzle.config.ts` repeats the check rather than importing it,
 * and says there why.
 *
 * **There is no fallback to `DATABASE_URL`, and that is the point.** A runner
 * missing this secret must fail where it can be seen, rather than migrating
 * production over the pooler and reporting success.
 *
 * *A `requireDatabaseUrl()` stood beside this and is gone rather than kept: the
 * seed was its only caller, and its comment claimed the migration runner and the
 * integration tests too, which was never true. A dead export asserting three
 * users it does not have is worse than no export.*
 */
export function requireDirectDatabaseUrl(): string {
  const url = process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error(
      'DATABASE_URL_UNPOOLED is not set. Schema migrations and the seed read the ' +
        'direct (non `-pooler`) Neon host. Add it to app/.env.local, or to the ' +
        "workflow's secrets. See docs/12-deployment.md §2.2.",
    );
  }
  return url;
}
