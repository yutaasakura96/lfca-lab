import { readFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// `docs/12-deployment.md` §5 calls its `pg_dump` command "the backup" — not a
// belt-and-braces extra, the backup, because the free plan's history window is
// six hours and the attempt history is the one thing here that cannot be
// regenerated from the repo.
//
// That command is prose. It went out of date silently and stayed that way for
// eleven days: `attempt_question` arrived with the composed modes (doc 04 §5.4)
// and nothing in any suite noticed the backup had stopped naming every table it
// was supposed to carry. The symptom would not have appeared until a restore —
// which is to say, on the worst day this project can have.
//
// So the command is asserted against the schema rather than read and believed.
// The check is deliberately shaped so that the failure lands on whoever adds
// the *next* table: a new `CREATE TABLE` in a migration fails this test until it
// is either named in the backup command or listed below with a reason for
// staying out. Neither is more work than thinking about it once, which is the
// whole point — nobody was going to think about it unprompted.

const here = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = join(here, '..', '..', '..');
const doc = readFileSync(join(repoRoot, 'docs', '12-deployment.md'), 'utf8');

// Every table the committed migrations create, minus any they later drop. The
// migrations are the schema's own record — reading them rather than
// `src/db/schema/` avoids parsing TypeScript to answer a question SQL already
// states plainly.
const tablesInSchema = (): Set<string> => {
  const migrations = join(repoRoot, 'app', 'src', 'db', 'migrations');
  const sql = readdirSync(migrations)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => readFileSync(join(migrations, f), 'utf8'))
    .join('\n');

  const tables = new Set<string>();
  for (const m of sql.matchAll(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?"?([a-z_]+)"?/gi)) {
    tables.add(m[1]!.toLowerCase());
  }
  for (const m of sql.matchAll(/DROP TABLE\s+(?:IF EXISTS\s+)?"?([a-z_]+)"?/gi)) {
    tables.delete(m[1]!.toLowerCase());
  }
  return tables;
};

// The tables the backup deliberately leaves behind, each with the reason. A
// reason is required rather than a bare list: "why is this one out?" is exactly
// the question a future reader will have, and the answer is different for the
// content tables than it is for `session`.
const EXCLUDED: Record<string, string> = {
  question: 'content — a projection of the bank, rebuilt by `npm run seed`',
  question_option: 'content — a projection of the bank, rebuilt by `npm run seed`',
  exam: 'content — a projection of the bank, rebuilt by `npm run seed`',
  exam_item: 'content — a projection of the bank, rebuilt by `npm run seed`',
  session: 'one signed-in browser; signing in again is the intended recovery',
  verification: 'short-lived tokens Better Auth cleans up; nothing survives worth restoring',
};

// The `--table=` arguments of §5's dump command, as actually written there.
const backedUp = (): { tables: string[]; command: string } => {
  const blocks = [...doc.matchAll(/```bash\n([\s\S]*?)```/g)]
    .map((m) => m[1]!)
    .filter((b) => b.includes('pg_dump'));

  // One command, so there is one place to change and one place to read. Two
  // would be two chances for the doc to disagree with itself.
  expect(blocks, 'docs/12-deployment.md should contain exactly one pg_dump command').toHaveLength(1);

  const command = blocks[0]!;
  const tables = [...command.matchAll(/--table=(?:'?"?)([a-z_]+)(?:"?'?)/g)].map((m) => m[1]!);
  return { tables, command };
};

describe('the documented backup command carries every table that holds user data', () => {
  it('names each user table, and no table that does not exist', () => {
    const schema = tablesInSchema();
    const { tables } = backedUp();

    for (const t of tables) {
      expect(schema.has(t), `the backup names \`${t}\`, which no migration creates`).toBe(true);
      expect(EXCLUDED[t], `\`${t}\` is both backed up and listed as excluded`).toBeUndefined();
    }

    const missing = [...schema].filter((t) => !tables.includes(t) && !(t in EXCLUDED)).sort();
    expect(
      missing,
      missing.length === 0
        ? ''
        : `docs/12-deployment.md §5's pg_dump command does not name ${missing.join(', ')}. `
          + 'A table holding user data must be in the backup; a table that does not hold any '
          + 'must be listed in EXCLUDED here with the reason it stays out. This is the check '
          + '`attempt_question` went eleven days without.',
    ).toEqual([]);
  });

  it('names the five tables the restore into production actually carried', () => {
    // Pinned by name as well as by rule, because the rule above is satisfied by
    // a command that names a table twice or in an order that breaks the restore.
    // Order is load-bearing on restore: the user tables reference the content
    // tables under RESTRICT, and `answer` references `attempt`.
    expect(backedUp().tables).toEqual(['attempt', 'answer', 'attempt_question', 'user', 'account']);
  });

  it('dumps over the direct host, never the pooler', () => {
    const { command } = backedUp();

    // Neon states it outright — "Avoid using pg_dump over a pooled connection
    // string … Use an unpooled connection string instead" — and since #43
    // `DATABASE_URL` *is* the pooled host. Before that split the two were one
    // variable and this command was right by accident.
    expect(command).toContain('$DATABASE_URL_UNPOOLED');
    expect(command).not.toMatch(/\$DATABASE_URL[^_]/);
  });

  it('points libpq at the system trust store rather than weakening sslmode', () => {
    const { command } = backedUp();

    // §2.1's "no sslrootcert is needed" is a fact about node-postgres, which
    // verifies against Node's bundled store. libpq looks for
    // ~/.postgresql/root.crt and fails outright without it — so the same string
    // that works from the app fails from the backup. The tempting fix under
    // pressure is `sslmode=require`, which is the one thing §2.1 exists to stop.
    expect(command).toContain('PGSSLROOTCERT=system');
    expect(command).not.toMatch(/sslmode=(require|prefer|disable|verify-ca)/);
  });
});
