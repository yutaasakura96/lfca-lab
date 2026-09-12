import { defineConfig } from 'drizzle-kit';

// Migrations are committed and reviewed as SQL, never applied from a
// push-style sync. The schema holds the only copy of the first-attempt scores;
// it is not something to discover after the fact.
//
// `DATABASE_URL_UNPOOLED` is the **direct** host, never the app's pooled one:
// migration tools take session-level advisory locks and issue `SET`/`RESET`,
// both unsupported on a pooled connection.
//
// The check is here rather than through `requireDirectDatabaseUrl()` because
// importing that would pull `pg`, `drizzle-orm` and the whole schema graph into
// whatever bundle drizzle-kit builds this config with — a new coupling, to save
// one sentence. It is a check at all, rather than `?? ''`, because `pg` reads an
// empty connection string as *use the PG\* defaults*: a runner missing the
// secret would aim at localhost and report a connection error rather than a
// missing credential. `generate` writes SQL from the schema and opens nothing,
// so it is the one command allowed to run without it.
const offline = process.argv.includes('generate');
const url = process.env.DATABASE_URL_UNPOOLED ?? '';

if (!url && !offline) {
  throw new Error(
    'DATABASE_URL_UNPOOLED is not set. Migrations read the direct (non `-pooler`) ' +
      'Neon host. See docs/12-deployment.md §2.2.',
  );
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
