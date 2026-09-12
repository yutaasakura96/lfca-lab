// The seed: the bank, projected into Postgres.
//
// ## Why this upserts rather than truncating
//
// The technical design says the seed "truncates the four content tables and
// reinserts inside one transaction". That cannot be implemented. `answer`
// references `question` and `attempt` references `exam`, so Postgres refuses:
//
//     TRUNCATE question;
//     ERROR: cannot truncate a table referenced in a foreign key constraint
//
// — and it refuses on an *empty* database, because the objection is the
// constraint, not the rows. The only ways to force it are `CASCADE` or naming
// `answer` in the same statement, and both delete attempt history. That history
// contains the first-attempt scores, which are the one thing in this project
// that cannot be regenerated. A seed that destroys them to refresh content the
// repo already holds would be the worst trade in the system.
//
// So: upsert every row the bank has, then delete only content rows the bank no
// longer has. Same end state, idempotent, and history is untouched. The delete
// is where a renamed question id fails loudly — the old row is gone from the
// bank, and `answer`'s ON DELETE RESTRICT refuses to let it go while an answer
// points at it. That refusal is the intended alarm, and it now fires at exactly
// the right moment.
//
// ## What it never touches
//
// `user`, `session`, `account`, `verification`, `attempt`, `answer`. Not
// truncated, not updated, not read except by the foreign keys that protect
// them.

import { notInArray, sql } from 'drizzle-orm';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { requireDirectDatabaseUrl } from '../src/db/client.ts';
import * as schema from '../src/db/schema.ts';
import { exam, examItem, question, questionOption } from '../src/db/schema/app.ts';
import { defaultBankRoot, loadBank } from './bank.ts';
import { HOLDOUT_SIZE, projectBank, type Projection } from './projection.ts';

/** The seed's handle. Deliberately not the `Db` exported by `src/db/client.ts`. */
type SeedDb = NodePgDatabase<typeof schema>;

/**
 * The seed's own pool, on the **direct** Neon host — not the app's pooled one
 * from `src/db/client.ts`.
 *
 * `write()` below is one long multi-statement transaction over the whole bank,
 * which is the shape Neon's guidance routes to the direct connection. The pool
 * is private to this script rather than exported from `client.ts` as a factory,
 * so that nothing under `src/` gains a way to build a handle to a host of its
 * choosing. The cost is this construction line existing twice; the tables are
 * named explicitly in every statement below, so the two cannot quietly diverge
 * about what they are pointed at.
 *
 * Called from {@link main} rather than at module load, and that is not style:
 * `requireDirectDatabaseUrl()` throws, and a module-level throw escapes the
 * `catch` at the foot of this file — so a missing credential printed a stack
 * trace where every other seed failure prints one `ERROR` line. It is still the
 * first thing `main` does, before a single bank file is read, so the failure
 * lands before the work rather than after it.
 */
function openDatabase(): { db: SeedDb; pool: Pool } {
  const pool = new Pool({ connectionString: requireDirectDatabaseUrl() });
  return { db: drizzle(pool, { schema }), pool };
}

/** Postgres caps a statement at 65,535 bind parameters; stay well under it. */
const CHUNK = 500;

function chunked<T>(rows: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += CHUNK) out.push(rows.slice(i, i + CHUNK));
  return out;
}

async function write(db: SeedDb, projection: Projection): Promise<void> {
  await db.transaction(async (tx) => {
    // Clear the two child tables outright. Nothing references `question_option`
    // or `exam_item` — no foreign key points at them — so they can be replaced
    // wholesale, which is both simpler and truer to "the content is a
    // projection of the repo" than reconciling them row by row.
    await tx.delete(examItem);
    await tx.delete(questionOption);

    // Upsert the two parents. These are the ones that cannot be cleared:
    // `answer` references `question` and `attempt` references `exam`, and
    // deleting a row either points at is exactly the alarm we want to preserve
    // rather than trigger on every ordinary reseed.
    for (const rows of chunked(projection.questions)) {
      await tx
        .insert(question)
        .values(rows)
        .onConflictDoUpdate({
          target: question.id,
          set: {
            conceptId: sql`excluded.concept_id`,
            competency: sql`excluded.competency`,
            domain: sql`excluded.domain`,
            pool: sql`excluded.pool`,
            type: sql`excluded.type`,
            difficulty: sql`excluded.difficulty`,
            stem: sql`excluded.stem`,
            isHoldout: sql`excluded.is_holdout`,
          },
        });
    }

    for (const rows of chunked(projection.exams)) {
      await tx
        .insert(exam)
        .values(rows)
        .onConflictDoUpdate({
          target: exam.id,
          set: { number: sql`excluded.number`, questionCount: sql`excluded.question_count` },
        });
    }

    for (const rows of chunked(projection.options)) await tx.insert(questionOption).values(rows);
    for (const rows of chunked(projection.examItems)) await tx.insert(examItem).values(rows);

    // Prune parents the bank no longer has. A question removed or renamed is
    // deleted here — and if an answer still points at it, `ON DELETE RESTRICT`
    // refuses and the whole transaction rolls back. That refusal is the
    // intended alarm for a renamed id, and it fires before anything is lost.
    await tx.delete(question).where(notInArray(question.id, projection.questions.map((q) => q.id)));
    await tx.delete(exam).where(notInArray(exam.id, projection.exams.map((e) => e.id)));

    // Read back inside the transaction. If this disagrees, everything rolls
    // back and the database keeps the content it already had — a failed seed
    // must never leave a half-seeded bank behind.
    const [marked] = await tx
      .select({ n: sql<number>`count(*)::int` })
      .from(question)
      .where(sql`${question.isHoldout}`);

    if (marked?.n !== HOLDOUT_SIZE) {
      throw new Error(
        `Refusing to commit: ${marked?.n ?? 0} question(s) marked as holdout, expected ${HOLDOUT_SIZE}.`,
      );
    }
  });
}

async function main(): Promise<void> {
  // First, before a single bank file is read: a missing credential fails here.
  const { db, pool } = openDatabase();
  const bankRoot = process.argv[2] ?? defaultBankRoot;

  try {
    await seed(db, bankRoot);
  } finally {
    await pool.end();
  }
}

async function seed(db: SeedDb, bankRoot: string): Promise<void> {
  const projection = projectBank(loadBank(bankRoot));
  await write(db, projection);

  const [counts] = await db
    .select({
      questions: sql<number>`(SELECT count(*)::int FROM question)`,
      options: sql<number>`(SELECT count(*)::int FROM question_option)`,
      exams: sql<number>`(SELECT count(*)::int FROM exam)`,
      examItems: sql<number>`(SELECT count(*)::int FROM exam_item)`,
      holdout: sql<number>`(SELECT count(*)::int FROM question WHERE is_holdout)`,
    })
    .from(sql`(SELECT 1) AS one`);

  console.log(
    `seeded: ${counts?.questions} question(s), ${counts?.options} option(s), ` +
      `${counts?.exams} paper(s), ${counts?.examItems} paper item(s), ${counts?.holdout} holdout`,
  );
}

try {
  await main();
} catch (error) {
  console.error(`ERROR  ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
