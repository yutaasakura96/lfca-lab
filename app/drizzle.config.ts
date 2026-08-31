import { defineConfig } from 'drizzle-kit';

// Migrations are committed and reviewed as SQL, never applied from a
// push-style sync. The schema holds the only copy of the first-attempt scores;
// it is not something to discover after the fact.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
  strict: true,
  verbose: true,
});
