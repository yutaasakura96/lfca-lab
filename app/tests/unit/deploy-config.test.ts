import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// The deploy slice adds a second thing that fails silently, and it is not a
// number. It is **committed configuration**: a workflow nobody watches, a flag
// in a manifest, a version pinned in one file and declared in another. Each is
// one character away from being wrong, and none of them fails a suite that only
// exercises the app.
//
// So they are asserted here, in the shape `design-tokens.test.ts` established
// and `neon-permissions.test.ts` followed: read a committed file from the
// repository root, assert an external observable fact about it, say what to do
// when it fails. No database, no network, no live system — and this file runs in
// the very workflow it asserts, which is the point.
//
// **Why this is not in `neon-permissions.test.ts`**, which says in its own
// header that #45 would extend it: nothing here is about Neon. These are npm
// script flags and a GitHub workflow, and a file named for Neon permissions that
// also asserts a Node version is a file the next reader does not think to grep.
// That header and doc 11 §2 are corrected to point here. See the decision log,
// 2026-09-12.
//
// **It reads the workflow as text, not as parsed YAML**, deliberately: there is
// no YAML parser in this app's dependency tree and adding one to read six lines
// would be a dependency taken on for a test. Every fact below is a single line
// of the file, which is what text matching is good for — and a file that stops
// being shaped the way these patterns expect fails loudly here rather than
// matching something unintended.

const here = fileURLToPath(new URL('.', import.meta.url));
const appRoot = join(here, '..', '..');
const repoRoot = join(appRoot, '..');

const CI_WORKFLOW = join(repoRoot, '.github', 'workflows', 'ci.yml');

// Inside the Root Directory, not at the repository root. Vercel's own monorepo
// documentation shows the file at `apps/web/vercel.json` — the Root Directory of
// that project — and this project's Root Directory is `app`. Doc 12 §3.1 records
// that the placement was *observed* rather than deduced: a push to `develop`
// minting no deployment is what proves the file was read at all.
const VERCEL_CONFIG = join(appRoot, 'vercel.json');

const manifest = JSON.parse(readFileSync(join(appRoot, 'package.json'), 'utf8')) as {
  engines: { node: string };
  scripts: Record<string, string>;
};

const workflow = (): string => {
  expect(
    existsSync(CI_WORKFLOW),
    '.github/workflows/ci.yml is missing. It is what runs the three database-free suites on a push '
      + '— the signal doc 12 §3 describes. It is not a gate, and that section says so since #46.',
  ).toBe(true);

  return readFileSync(CI_WORKFLOW, 'utf8');
};

describe('the scripts that talk to a database run outside a laptop too', () => {
  // #43 split the connection strings and moved three scripts from
  // `--env-file=.env.local` to `--env-file-if-exists`, so one script serves both
  // a laptop and a runner where the environment supplies the variables. Under
  // the mandatory form a missing `.env.local` makes the command itself exit
  // ENOENT — so the regression is not a wrong value, it is a runner that cannot
  // start the command at all, and `test:integration` could never be observed
  // skipping cleanly.
  //
  // Derived from the manifest rather than from a list of the three script names,
  // so a fourth script reaching for an env file is covered the day it is added.

  const usingEnvFile = Object.entries(manifest.scripts).filter(([, command]) =>
    command.includes('--env-file'),
  );

  it('there are such scripts at all — an empty list must not pass quietly', () => {
    expect(
      usingEnvFile.map(([name]) => name),
      'no script in app/package.json passes --env-file any more. Either they were renamed, in which '
        + 'case this test is asserting nothing, or the env-file form was removed and #43 was undone.',
    ).toEqual(expect.arrayContaining(['db:migrate', 'seed', 'test:integration']));
  });

  it.each(usingEnvFile.map(([name, command]) => ({ name, command })))(
    '$name uses the conditional form',
    ({ name, command }) => {
      expect(
        command,
        `app/package.json's "${name}" script uses --env-file rather than --env-file-if-exists. `
          + 'The mandatory form exits ENOENT when .env.local is absent, so this script cannot run on '
          + 'a runner that supplies its variables through the environment. See doc 12 §3.',
      ).not.toMatch(/--env-file[= ]/);
      expect(command).toContain('--env-file-if-exists');
    },
  );
});

describe('CI runs the three suites that need no database', () => {
  // doc 11 §5's pipeline, and deliberately only the first two lines of it. The
  // integration suite and the browser run need a seeded Neon branch and a
  // credential this workflow does not hold, so they stay local. Asserting their
  // *absence* is what makes that a decision rather than an oversight: a suite
  // needing a database would otherwise be added here and fail for a reason that
  // reads as a broken test rather than as a misplaced one.

  const RUNS = [
    { command: 'npm test', why: 'the bank suite — 339 tests over tools/test' },
    { command: 'npm run validate', why: 'the bank against the schema and the holdout pin' },
    { command: 'npm run check-bank', why: 'the question bank and exam composition' },
    { command: 'npm run typecheck', why: 'tsc --noEmit, strict' },
    { command: 'npm run test:unit', why: "the app's unit suite, which needs no database" },
  ];

  const ABSENT = [
    { command: 'test:integration', why: 'needs a seeded branch and DATABASE_URL' },
    { command: 'test:e2e', why: 'needs the same, plus a browser' },
    { command: 'run seed', why: 'writes to a database; it belongs to the deploy workflow' },
    { command: 'db:migrate', why: 'the same — migrating from the test gate would be a write' },
  ];

  it('runs on push', () => {
    // Every branch here is short-lived and no pull request has ever been opened
    // on this repository, so a `pull_request` trigger would gate nothing. A push
    // is the event that exists.
    expect(
      workflow(),
      '.github/workflows/ci.yml does not carry a bare `on: push`. Either the trigger changed — in '
        + 'which case a push may no longer run the gate at all — or it was spelled another way that '
        + 'is valid YAML and not this. Read it, then teach this test the new form.',
    ).toMatch(/^on:\s*push\s*$/m);
  });

  it.each(RUNS)('runs `$command` — $why', ({ command }) => {
    expect(
      workflow(),
      `.github/workflows/ci.yml does not run \`${command}\`. doc 11 §5 names it as part of the gate.`,
    ).toContain(command);
  });

  it.each(ABSENT)('does not run `$command` — $why', ({ command }) => {
    expect(
      workflow(),
      `.github/workflows/ci.yml runs \`${command}\`, which needs a database. The test gate holds no `
        + 'database credential by decision (doc 11 §5, decision log 2026-09-11) — so this either '
        + 'fails on every run or a credential was added to it.',
    ).not.toContain(command);
  });

  it('holds no database credential, and no repository secret at all', () => {
    // Scoped to this workflow by name rather than to the whole of `.github/`,
    // because #48 adds a deploy workflow that deliberately *does* hold
    // DATABASE_URL_UNPOOLED as a repository secret.
    //
    // **This comment used to end "a red suite must be able to block a deploy",
    // and that was never true.** Vercel's git integration builds on the push and
    // this workflow runs on the same push; they race, and nothing couples them
    // (doc 12 §3). The claim actually being made here is narrower and still
    // worth making: the suite that reports on a commit cannot reach the database
    // that commit's deploy will serve.
    const text = workflow();

    expect(
      text,
      '.github/workflows/ci.yml mentions DATABASE_URL. The test gate runs only the suites that need '
        + 'no database; a connection string here is either unused or a suite was added that needs one.',
    ).not.toMatch(/DATABASE_URL/);

    expect(
      [...text.matchAll(/secrets\.([A-Za-z0-9_]+)/g)].map((m) => m[1]),
      '.github/workflows/ci.yml references a repository secret. It is meant to hold none.',
    ).toEqual([]);
  });
});

describe('the workflow and the manifest cannot drift about Node', () => {
  // `npm run seed` executes `scripts/seed.ts` directly, so unflagged type
  // stripping — Node 23.6 — is a real floor, and `--env-file-if-exists` needs
  // 20.12. Both are silently absent on an older major: the failure is a parse
  // error in a workflow nobody is watching.
  //
  // The pin is `24.x` rather than the manifest's own range, because Root
  // Directory is `app` and so `engines.node` is the manifest **Vercel** reads —
  // and per its documented mapping `>=23.6.0` resolves there to the latest 24.x
  // (doc 12 §3). Pinning the same major means CI typechecks and tests under the
  // major that compiles the deploy it gates. `actions/setup-node` would accept
  // the range itself via `node-version-file`, and that cannot drift — but a
  // range is not a pin: it resolves to whatever the newest satisfying major is
  // on the runner that day, so a Node release would change CI's runtime with no
  // diff. See the decision log, 2026-09-12.
  //
  // Both grammars below are matched strictly, and a file that stops using the
  // form this understands fails rather than being forgiven. That is deliberate:
  // a changed form is exactly the moment a human should look at the comparison
  // again, and there is no semver parser here to fall back on.

  const floor = (): { major: number; raw: string } => {
    const range = manifest.engines.node;
    const match = /^>=(\d+)\.(\d+)\.(\d+)$/.exec(range);

    expect(
      match,
      `app/package.json's engines.node is "${range}", which is not the \`>=MAJOR.MINOR.PATCH\` form `
        + 'this comparison understands. Re-read the Node pin in .github/workflows/ci.yml against the '
        + 'new form by hand, then teach this test the grammar.',
    ).not.toBeNull();

    return { major: Number(match![1]), raw: range };
  };

  const pinned = (): { major: number; raw: string } => {
    const text = workflow();

    expect(
      text,
      '.github/workflows/ci.yml sets node-version-file rather than node-version. That is not a pin — '
        + 'it resolves to the newest major satisfying the range, so CI\'s runtime changes with no diff.',
    ).not.toContain('node-version-file');

    const match = /node-version:\s*'(\d+)\.x'/.exec(text);

    expect(
      match,
      ".github/workflows/ci.yml has no `node-version: 'MAJOR.x'` pin. doc 12 §3 requires Node pinned "
        + 'in every workflow, because `npm run seed` needs ≥23.6 and fails as a parse error below it.',
    ).not.toBeNull();

    return { major: Number(match![1]), raw: match![1]! };
  };

  it('pins one Node major, explicitly', () => {
    expect(pinned().major).toBeGreaterThan(0);
  });

  it('every version that pin can resolve to satisfies the manifest', () => {
    const { major: floorMajor, raw: range } = floor();
    const { major: pinMajor } = pinned();

    // Strictly greater, not greater-or-equal, and that is the whole strength of
    // the assertion. `23.x` against a floor of `>=23.6.0` would pass a
    // same-major check while 23.0.0 — a version that pin can legally resolve to
    // — does not satisfy the floor. One major above the floor means every
    // version on the pinned line clears it, whatever the runner resolves.
    expect(
      pinMajor,
      `.github/workflows/ci.yml pins Node ${pinMajor}.x while app/package.json declares `
        + `"${range}". A ${pinMajor}.x can resolve below that floor, at which point `
        + '`npm run seed` fails as a parse error rather than as a missing runtime. Pin a major above '
        + 'the floor major.',
    ).toBeGreaterThan(floorMajor);
  });
});

describe('only git main deploys, and the build command is the framework build alone', () => {
  // The one setting in this slice that is a *dashboard toggle* by default. It is
  // committed instead, so it is reviewable in a diff and cannot be changed by
  // somebody clicking through project settings — which is the same reasoning
  // that put the Neon permission split in `.claude/settings.json` rather than in
  // a habit.
  //
  // **`git.deploymentEnabled` has no single-boolean spelling for what is wanted
  // here**, and getting that wrong is silent in the worst direction. Vercel
  // documents the type as an object of branch→boolean *or* a boolean, and a bare
  // `false` turns off automatic deployments for **all** branches — `main`
  // included. A reader who takes doc 12 §1's prose ("non-production deployments
  // are turned off") literally and writes `false` gets a repository that deploys
  // nothing at all, and the symptom is a production that silently stops moving.

  const config = (): {
    framework?: unknown;
    buildCommand?: unknown;
    git?: { deploymentEnabled?: unknown };
  } => {
    expect(
      existsSync(VERCEL_CONFIG),
      'app/vercel.json is missing. It is what turns non-production deployments off (doc 12 §1) and '
        + 'pins the build command to the framework build alone (doc 12 §3). Without it every push to '
        + 'every branch mints a public URL, and the build command reverts to whatever the dashboard '
        + 'says — which is the state doc 12 §3 exists to prevent, since it once specified a build '
        + 'that ran `db:migrate` and `seed` first.',
    ).toBe(true);

    return JSON.parse(readFileSync(VERCEL_CONFIG, 'utf8')) as ReturnType<typeof config>;
  };

  it('is built as Next.js, not left to framework detection', () => {
    // **The first production deployment failed on exactly this**, and the
    // failure did not mention Next.js at all: "No Output Directory named
    // 'public' found after the Build completed". Vercel detects the preset when
    // a project is imported — from the repository root, before Root Directory is
    // changed to `app` — and the root declares no `next` dependency, so it chose
    // **Other**, which serves a static `public/` folder. Changing Root Directory
    // afterwards does not re-run detection. Both the git-import deployment and
    // the CLI redeploy errored identically, which is what ruled out the CLI.
    //
    // `framework` in this file overrides the dashboard preset on every
    // deployment, so the fix is committed rather than a setting somebody has to
    // remember to change on the next project.
    expect(
      config().framework,
      'app/vercel.json does not pin `"framework": "nextjs"`. Without it Vercel may detect the preset '
        + 'from the repository root, choose "Other", and fail every build looking for a `public/` '
        + 'directory — which is what the first production deployment did (doc 12 §3.1).',
    ).toBe('nextjs');
  });

  it('builds with `next build` and nothing else', () => {
    // Pinned rather than left to framework detection. Detection would produce
    // the same string today; what it would not do is refuse a dashboard edit
    // appending `&& npm run seed`, which is precisely the arrangement doc 12 §3
    // superseded and the 2026-08-31 decision moved to a workflow.
    expect(
      config().buildCommand,
      'app/vercel.json does not pin `next build` as the build command. Migrations and the seed run '
        + 'from a workflow (#48, decision log 2026-08-31), never from the build.',
    ).toBe('next build');
  });

  it('is a branch map, not the boolean that would also stop main', () => {
    expect(
      config().git?.deploymentEnabled,
      'app/vercel.json sets git.deploymentEnabled to a boolean. Vercel documents `false` as turning '
        + 'off automatic deployments for **every** branch, main included — so this does not disable '
        + 'non-production deployments, it disables production too, and nothing would ever deploy '
        + 'again. It must be an object keyed by branch.',
    ).toBeTypeOf('object');
  });

  it.each([
    { branch: '**', enabled: false, why: 'nothing deploys unless a rule says otherwise' },
    { branch: 'main', enabled: true, why: 'main is the exception, and the only one' },
  ])('$branch → $enabled — $why', ({ branch, enabled }) => {
    // Deny by default, with one exception, because doc 12 §1's claim is not
    // "develop does not deploy" but "what is deployed is always whatever is on
    // main". Naming `develop` alone would satisfy the observable criterion and
    // leave a pushed ticket branch minting a public URL — and two of the last
    // five ticket branches had remote copies.
    //
    // `main` wins its own exception by Vercel's documented rule that a branch
    // matching several rules deploys if **any** matched rule is true.
    expect(
      (config().git?.deploymentEnabled as Record<string, boolean>)[branch],
      `app/vercel.json does not map the branch pattern \`${branch}\` to ${enabled}. `
        + 'Doc 12 §1 requires that only git main deploys.',
    ).toBe(enabled);
  });

  it('grants no second exception — main is the only branch that deploys', () => {
    // The assertion above would still pass with `"develop": true` sitting beside
    // the other two. This is the one that would not.
    const enabled = Object.entries(config().git?.deploymentEnabled as Record<string, boolean>)
      .filter(([, on]) => on)
      .map(([branch]) => branch);

    expect(
      enabled,
      `app/vercel.json enables deployments for ${enabled.join(', ')}. Only main may deploy: doc 12 §1 `
        + 'cut preview environments outright, because a Google redirect URI cannot be wildcarded and '
        + 'Vercel mints a hostname per deployment, so sign-in on any other host cannot work.',
    ).toEqual(['main']);
  });
});
