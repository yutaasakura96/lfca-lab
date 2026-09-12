import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// `.claude/settings.json` is where this repository states which Neon operations
// an agent may perform unattended. The tools it governs can delete the branch
// holding the five first-attempt scores — the one thing here that cannot be
// regenerated — so the rules are not left to be read and believed.
//
// This asserts the committed file, not a live system, which is the standard the
// deploy slice sets for configuration: what is at risk is somebody changing a
// line and nothing complaining. A rule deleted, a `*` moved, a read promoted to
// a wildcard that swallows its own writes — each is one character away and each
// would look exactly like a working guard.
//
// It follows `design-tokens.test.ts` in shape: read a file from the repository
// root, assert an external observable fact about it, say what to do when it
// fails. It needs no database and runs in CI.
//
// The matcher below reproduces Claude Code's documented rule syntax — `*` stands
// in for any text, and the `:*` suffix is an equivalent spelling of a trailing
// ` *` which also matches the bare command. Compound commands are deliberately
// out of scope here: Claude Code splits on shell operators itself and applies an
// ask rule when *any* subcommand matches it, so `neon branches list && neon
// branches delete x` is caught by the same rule this asserts.
//
// **What this cannot prove**, said here rather than left to be assumed: that
// Claude Code then honours the rule it matched. This asserts the file, not the
// harness. That the ask rules bite was established two other ways — the
// permission matcher compiles a rule to `^…$` against the *whole* tool name
// (`mcp__*__delete_branch` → `^mcp__.*__delete_branch$`), which is what makes a
// wildcarded server segment work; and doc 12 §8.3 leaves the owner one check in
// a prompting session, because no bypass-permissions session is prompted by any
// of this.
//
// Ticket #45 owns the wider committed-configuration seam — the `--env-file-if-exists`
// flags, the Node pin, and `deploymentEnabled`. **It has its own file**,
// `deploy-config.test.ts`, rather than extending this one as this comment used to
// say: nothing in that seam is about Neon, and a file named for Neon permissions
// that also asserts a workflow's Node version is a file the next reader does not
// think to grep. Same shape, same standard, different subject. See the decision
// log, 2026-09-12.

const here = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = join(here, '..', '..', '..');

const settings = JSON.parse(
  readFileSync(join(repoRoot, '.claude', 'settings.json'), 'utf8'),
) as { permissions: { allow: string[]; ask: string[]; deny: string[] } };

/** A permission rule's specifier, compiled to the pattern Claude Code matches with. */
function matcher(pattern: string): RegExp {
  const trailingWildcard = pattern.endsWith(':*') ? `${pattern.slice(0, -2)} *` : pattern;
  const escaped = trailingWildcard.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');

  // `Bash(ls *)` matches `ls` as well as `ls -la`, but only when the trailing
  // `*` is the rule's only wildcard.
  const onlyWildcardIsTrailing = trailingWildcard.indexOf('*') === trailingWildcard.length - 1;
  const body = onlyWildcardIsTrailing && trailingWildcard.endsWith(' *')
    ? `${escaped.slice(0, -3)}(?: .*)?`
    : escaped;

  return new RegExp(`^${body}$`);
}

const bashRules = (list: string[]): RegExp[] => list
  .filter((rule) => rule.startsWith('Bash('))
  .map((rule) => matcher(rule.slice('Bash('.length, -1)));

const mcpRuleNames = (list: string[]): string[] => list.filter((rule) => rule.startsWith('mcp__'));
const mcpRules = (list: string[]): RegExp[] => mcpRuleNames(list).map(matcher);

const bashAllow = bashRules(settings.permissions.allow);
const bashAsk = bashRules(settings.permissions.ask);
const mcpAllow = mcpRules(settings.permissions.allow);
const mcpAsk = mcpRules(settings.permissions.ask);

const matches = (rules: RegExp[], subject: string) => rules.some((rule) => rule.test(subject));

// Every `neon` invocation that changes something, reveals a secret, or executes
// arbitrary SQL. Each must prompt; none may be allowed.
const CLI_WRITES = [
  'neon branches delete br-noisy-credit-b37kait6',
  'neon branches create --name main',
  'neon branches reset dev',
  'neon branches restore dev ^parent',
  'neon branches rename dev develop',
  'neon branches set-default br-jolly-mode-b39c5rdo',
  'neon branches set-expiration dev --expires-at 2026-10-01',
  'neon branches add-compute dev',
  'neon projects delete wispy-bird-80472699',
  'neon projects create',
  'neon projects update wispy-bird-80472699 --name x',
  'neon projects recover wispy-bird-80472699',
  'neon databases delete neondb',
  'neon databases create --name scratch',
  'neon roles delete neondb_owner',
  'neon roles create --name scratch',
  'neon snapshots delete snap-1',
  'neon snapshots restore snap-1',
  'neon snapshots finalize dev',
  'neon snapshots schedule set --cron "0 0 * * *"',
  'neon api-keys create',
  'neon api-keys revoke 12345',
  'neon api DELETE /projects/wispy-bird-80472699',
  'neon psql main -c "delete from attempt"',
  'neon connection-string main',
  'neon cs main',
  'neon auth',
  'neon login',
  'neon set-context --project-id wispy-bird-80472699',
  'neon link',
  'neon claim',
  'neon init',
  'neon mcp install claude',
  'neon plugins install claude',
  'neon skills install claude',
  'neon functions deploy',
  'neon data-api create',
  'neon neon-auth create',
  'neon ip-allow add 1.2.3.4',
  'neon vpc add',
  'neon profile create work',
  'neon config set',
  'neon deploy',
  'neon env pull',
  'neon buckets delete my-bucket',
  'neon bootstrap ./somewhere',
];

// Reading the shape of the project is ordinary work and should not prompt.
const CLI_READS = [
  'neon me',
  'neon orgs list',
  'neon projects list',
  'neon projects get wispy-bird-80472699',
  'neon branches list',
  'neon branches get dev',
  'neon databases list',
  'neon roles list',
  'neon operations list',
  'neon snapshots list',
  'neon inspect',
  'neon diff',
  'neon logs',
  'neon status',
];

// The Neon MCP server's own destructive tools. The server segment is wildcarded
// in the rules on purpose: the same tools reach a session under `mcp__Neon__`
// from `.mcp.json` and under a connector's opaque id from claude.ai, and a rule
// naming one of those would guard the copy that happened not to be in use.
const MCP_WRITES = [
  'create_branch', 'update_branch', 'delete_branch', 'set_default_branch',
  'reset_from_parent', 'finalize_branch_restore',
  'create_snapshot', 'update_snapshot', 'delete_snapshot', 'restore_snapshot',
  'set_snapshot_schedule',
  'create_project', 'update_project', 'delete_project', 'recover_project',
  'create_postgres_database', 'create_postgres_endpoint', 'create_postgres_role',
  'update_postgres_database', 'update_postgres_endpoint',
  'delete_postgres_database', 'delete_postgres_endpoint', 'delete_postgres_role',
  'reset_postgres_role_password', 'restart_postgres_endpoint',
  'start_postgres_endpoint', 'suspend_postgres_endpoint',
  'run_sql', 'run_sql_transaction', 'explain_sql_statement',
  'prepare_database_migration', 'complete_database_migration',
  'prepare_query_tuning', 'complete_query_tuning',
  'get_connection_string',
  'create_credential', 'revoke_credential', 'rotate_credential',
  'create_auth_user', 'delete_auth_user', 'update_auth_user_role',
  'update_auth_config', 'add_auth_oauth_provider', 'update_auth_oauth_provider',
  'delete_auth_oauth_provider', 'add_auth_trusted_domain',
  'delete_auth_trusted_domain', 'provision_neon_auth', 'disable_auth',
  'provision_neon_data_api', 'update_data_api', 'delete_data_api',
  'deploy_function', 'update_function', 'delete_function',
  'register_functions_custom_domain', 'delete_functions_custom_domain',
  'create_trigger', 'update_trigger', 'delete_trigger',
  'create_storage_bucket', 'delete_storage_bucket', 'delete_storage_object',
  'delete_storage_objects_by_prefix', 'presign_storage_object',
];

const MCP_READS = [
  'list_organizations', 'list_projects', 'describe_project',
  'list_branches', 'describe_branch', 'get_branch', 'get_default_branch',
  'list_operations', 'get_database_tables', 'describe_table_schema',
  'inspect_database', 'list_slow_queries', 'list_snapshots', 'query_logs',
];

// The two shapes a Neon tool arrives under: the server `.mcp.json` declares, and
// a claude.ai connector, whose name is an opaque id. The second is deliberately
// *not* the real id — the decision log refuses to pin one in committed config
// because a connector re-registered under a new id would escape it silently, and
// a test pinning it would go on passing against an id nobody uses. What is being
// asserted is the property: any server segment at all.
const SERVERS = ['mcp__Neon__', 'mcp__some-connector-id-0000__'];

describe('destructive Neon operations require the owner', () => {
  it.each(CLI_WRITES)('%s prompts', (command) => {
    expect(
      matches(bashAsk, command),
      `No ask rule in .claude/settings.json matches "${command}". `
        + 'Every neon command that writes, reveals a secret, or runs SQL needs one.',
    ).toBe(true);
  });

  it.each(CLI_WRITES)('%s is not allowed outright', (command) => {
    expect(
      matches(bashAllow, command),
      `An allow rule matches "${command}". A destructive neon command must never be allowed.`,
    ).toBe(false);
  });

  it.each(MCP_WRITES)('%s prompts under every server it can arrive under', (tool) => {
    for (const server of SERVERS) {
      expect(
        matches(mcpAsk, `${server}${tool}`),
        `No ask rule matches ${server}${tool}.`,
      ).toBe(true);
      expect(
        matches(mcpAllow, `${server}${tool}`),
        `An allow rule matches ${server}${tool}.`,
      ).toBe(false);
    }
  });
});

describe('reading the shape of the database is ordinary work', () => {
  it.each(CLI_READS)('%s runs without prompting', (command) => {
    expect(matches(bashAllow, command), `No allow rule matches "${command}".`).toBe(true);
    expect(matches(bashAsk, command), `An ask rule matches the read "${command}".`).toBe(false);
  });

  it.each(MCP_READS)('mcp__Neon__%s runs without prompting', (tool) => {
    expect(matches(mcpAllow, `mcp__Neon__${tool}`), `No allow rule for ${tool}.`).toBe(true);
    expect(matches(mcpAsk, `mcp__Neon__${tool}`), `An ask rule matches the read ${tool}.`).toBe(false);
  });
});

describe('the rules are shaped the way Claude Code reads them', () => {
  it('carries no parenthesised mcp rule, which Claude Code skips entirely', () => {
    // A rule like `mcp__Neon__run_sql(sql:*)` is dropped when settings load,
    // silently as far as this file is concerned — the guard would be listed and
    // absent at once.
    const mcpRules = [...settings.permissions.allow, ...settings.permissions.ask]
      .filter((rule) => rule.startsWith('mcp__'));
    expect(mcpRules.filter((rule) => rule.includes('('))).toEqual([]);
  });

  it('globs no server segment in an allow rule, which Claude Code discards', () => {
    // The asymmetry doc 12 §8.2 records, asserted rather than described. A glob
    // is legal in an allow rule's *tool* segment (`mcp__Neon__list_*`); a glob
    // in its *server* segment is refused outright — "An allow pattern must name
    // the scope it widens". Such a rule is dropped when settings load, so the
    // read it was meant to pre-approve goes on prompting while the file says
    // otherwise. The obvious next edit to this file is exactly that rule, added
    // to stop a connector's reads prompting, which is why this is asserted here
    // and not left to be discovered.
    const globbedServer = mcpRuleNames(settings.permissions.allow)
      .filter((rule) => rule.split('__')[1]?.includes('*'));

    expect(
      globbedServer,
      'An allow rule globs its server segment. Claude Code discards it — name the '
        + 'server, and glob only the tool: mcp__Neon__list_*, never mcp__*__list_branches.',
    ).toEqual([]);
  });

  it('never lets an allowed read be one a write rule also claims', () => {
    // Nothing in this file depends on whether `ask` outranks `allow`, and that is
    // deliberate: the two lists are disjoint by construction, so the guard holds
    // whichever way that precedence runs. `get_connection_string` is the case
    // that makes it matter — it reads like a read and hands out a password, so a
    // tidy `mcp__Neon__get_*` in allow would quietly overlap the ask rule.
    const overlapping = mcpRuleNames(settings.permissions.allow)
      .filter((rule) => matches(mcpAsk, rule));

    expect(overlapping, 'An allowed tool is also matched by an ask rule.').toEqual([]);
  });

  it('still guards the CLI and the MCP server, rather than one of them', () => {
    expect(bashAsk.length).toBeGreaterThan(20);
    expect(mcpAsk.length).toBeGreaterThan(20);
  });
});
