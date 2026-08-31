// The schema, in one place — two halves with different provenance.
//
// `schema/auth.ts` is **generated** by Better Auth's CLI from `src/auth.ts`.
// Never hand-edit it: those four tables are the library's to define, and a
// local edit would be silently reverted the next time the CLI runs. To change
// them, change the auth config and regenerate.
//
// `schema/app.ts` is ours: the bank's content, and the sittings taken against
// it. `docs/04-database-schema.md` is its specification.

export * from './schema/auth.ts';
export * from './schema/app.ts';
