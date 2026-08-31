# Project status

**Project:** An LFCA exam simulator built on this repo's existing 1,150-question bank — three
modes (exam, practice, domain) replacing the sixteen static markdown practice exams.
**Phase:** 6 — Build
**Updated:** 2026-08-30

## Done
- **Phase 1 — Brief + PRD.** [01-project-brief.md](01-project-brief.md),
  [02-product-requirements.md](02-product-requirements.md),
  [06-decision-log.md](06-decision-log.md).
- **Phase 2 — Design exploration.** One direction, built as a system, in `design/`.
  Canvas: <https://claude.ai/code/artifact/141693a7-0b34-4fae-a25e-72ecad4b3d30>
  14 artboards over 3 pages.
- **Phase 3 — Extract.** [05-design-system.md](05-design-system.md),
  [10-screen-specifications.md](10-screen-specifications.md), from `design/tokens.css`.
- **Phase 4 — Tech docs.** [03-technical-design.md](03-technical-design.md),
  [04-database-schema.md](04-database-schema.md), [07-api-design.md](07-api-design.md),
  [08-auth-and-permissions.md](08-auth-and-permissions.md), [09-user-flows.md](09-user-flows.md),
  [11-testing-plan.md](11-testing-plan.md), [12-deployment.md](12-deployment.md), and
  **[`../CONTEXT.md`](../CONTEXT.md)**. Thirteen decisions appended to the log.
- **Phase 5 — Configure the repo.** [`../CLAUDE.md`](../CLAUDE.md) rewritten for the two halves;
  `.claude/settings.json` extended (38 allow, 8 ask, 6 deny) with a `PreToolUse` branch guard;
  `.claude/hooks/pre-edit-branch-guard.sh` added and verified; root `.gitignore` given
  `node_modules/`, `.next/` and the `.env` rules **before** `app/` exists;
  `.claude/settings.local.json` emptied of five stale rules including `Bash(rm -rf *)`.
  `mattpocock-skills` enabled at project scope. Four decisions appended to the log.
- **Phase 5a — Skills setup.** `/setup-matt-pocock-skills` run. Tracker is **GitHub Issues** on
  `yutaasakura96/lfca-lab` via `gh` — *not* the local files the Phase 5 entry planned; see the log.
  `docs/agents/{issue-tracker,triage-labels,domain}.md` written, `## Agent skills` block added to
  `CLAUDE.md`, single-context doc layout, and the four missing triage labels created on the repo
  (`wontfix` already existed). `.claude/settings.json` now **42 allow, 14 ask, 6 deny** — read-only
  `gh issue`/`gh label`/`gh repo view` allowed, every `gh` write (`issue create`/`edit`/`comment`/
  `close`, `label create`, `gh api`) moved to `ask`. One decision appended to the log.
- **Phase 6, feature 1 — the holdout is pinned.** Issue #1 and its two children. `data/holdout.json`
  commits the 40 ids as source; `tools/lib/holdout.mjs` is the single definition of "the holdout is
  intact"; `npm run validate` fails on drift (#2); and `npm run build-exams` now **refuses to write**
  on the same comparison, before its first write, so a rebuild that would promote a holdout item onto
  a paper leaves all sixty-three generated files untouched (#3). The remaining two of PRD §5's five
  places — `is_holdout` in Postgres and the selection filter — arrived with the seed, in feature 2.
- **Phase 6, feature 2 — the data spine.** Spec #5 and its eight children (#6–#13), all closed;
  #1 and #4 closed with them. `app/` exists: TypeScript strict, Vitest, the pure domain layer
  (weights, scoring, the derived clock, the first-attempt rule, selection composition), ten tables on
  **Neon Postgres 18** from one committed migration, a seed that projects the bank, attempt creation,
  and the selection queries. No UI, no sign-in, no deployment — as scoped.
  **The holdout now has all three locks**, and they share no failure mode: the pinned file, the
  builder's refusal, and the query's own `is_holdout = false`. Measured on the seeded database:
  0 holdout items on any paper, 40 marked, 960 servable.
  Suites: 339 bank · 124 app unit · 27 app integration.

## Next
**Phase 6 — Build.** Planning is complete. Phase 6 repeats, one feature per pass, and is driven by
commands only you can type.

Features 1 and 2 are done (see Done). **The next command is `/grill-with-docs`** on feature 3 —
the natural candidate is the first UI slice, which is also where sign-in, Vercel and the Google
OAuth client finally have to be provisioned. Then `/to-spec` → `/to-tickets` → `/implement`.

**Before connecting Vercel, merge `develop` into `main`.** Today that is a fast-forward of inert
code; afterwards every such merge is a production deploy (doc 12 §3).

Tickets land in **GitHub Issues**, so `/to-tickets` and `/triage` need `gh` authenticated. The five
triage labels exist on the repo. Never put a secret from doc 12 §2 in an issue body — the repo is
public.

Flow, context hygiene and phase boundaries:
`~/Documents/GitHub/claude-setup-inventory/mattpocock-skills-guide.md`.

## Blocked
Nothing. The holdout is fully defended and the data spine is built.

Three findings from feature 2 are **carried, not lost** — each belongs to the slice that deploys:
- **Doc 12 §2 lists one `DATABASE_URL`.** Neon routes schema migrations to the *direct* host and a
  serverless runtime to the *pooled* one, so a second variable will be needed.
- **Vercel skips builds for projects a commit did not touch**, judged by the project's own directory.
  A commit touching only `questions/**` may deploy nothing, leaving production on the previous seed.
  There is a setting for it.
- **The seed will run from GitHub Actions**, not the Vercel build step — decided and recorded; the
  workflow itself is not written.

## Carrying

### The data half — measured, do not re-derive
- 537 concepts, **1,150 questions** (1,000 `exam` pool + 150 `supplement`), 16 exams, drills, guide.
- The 16 exams are a clean partition: **960 distinct questions, zero overlap, 40 pool items unused.**
- They match the official domain weights to within one question
  (SysAdmin 18 / Cloud 11 / Linux 10 / Security 8 / DevOps 7 / PM 6, per 60).
- Per-domain exam pools: SysAdmin 300, Cloud 180, Linux 160, Security 140, DevOps 120, PM 100.
- Question shape `{competency, items[]}`; item has `id`, `concept_id`, `pool`, `type`, `difficulty`,
  `stem`, `options[]` with `ref`/`correct`/`why`/`provenance`.
  Measured 2026-08-30: **every item has exactly 4 options; zero options are missing `why`.**
  `type` ∈ {application, discrimination, diagnostic, command, recall}; `difficulty` 1–5;
  22 competencies.
- `exams/index.json` = `{exams[16].items[60]{id, position}, unused[40], documents}`.
  **`position` is the correct option's slot on the paper, not the question's order.**
- Real exam figures at HIGH confidence: **60 questions, 90 minutes, 75% (45/60)**.

### Owner and stakes
- Sat LFCA 2026-07-11, scored **71 against 75** — No Pass by ~2 questions. One free retake, unbooked.
- **Riskiest assumption:** the bank has never been tested against the real exam. Mitigated by the
  40-question holdout and by first-attempt scoring. Do not weaken either.

### Tech, settled in Phase 4 (details in doc 03; rationale in the log)
- Next.js App Router in **`app/`** in this repo · TypeScript strict · Drizzle + drizzle-kit ·
  **Postgres on Neon** · **Vercel** · Better Auth + Google OIDC behind an **`ALLOWED_EMAILS`
  allowlist that fails closed** · Sentry free tier · Vitest + one Playwright run.
- **`app/` exists as of 2026-08-31** — `package.json`, TypeScript strict, Vitest, and the pure
  domain layer's first module. No Next.js, no database client, no pages yet. Doc 03 §4 is still its
  spec; the slice building it out is #5.
- The bank is **seeded** into read-only content tables; the app never writes question content.
- **The clock is derived from `started_at`**, never stored, never extended; expired attempts are
  finalised lazily on read. No cron anywhere in the system.
- **`is_first_attempt` is set at attempt creation**, not at submit — an abandoned first sitting keeps
  the flag. Guarded by a unique partial index.
- Answer writes are an idempotent upsert on `(attempt_id, question_id)` behind an **in-memory**
  outbox with backoff. Not persisted, deliberately.
- **`app/src/domain/` is pure** — no I/O, no React, no `Date.now()`. Everything that decides a number
  lives there and is unit-tested. That rule is what makes doc 11 affordable.

### Decided earlier, challenged, upheld — do not re-litigate
- **Postgres** and **Better Auth + Google OIDC in v1.** Deferring auth was proposed and overruled
  twice.
- No adaptive/spaced-repetition selection in v1; unseen-first is ordering only.
- The study guide stays outside the app. The app never writes question content.
- **No "discard this attempt" action anywhere** — it is the dodge first-attempt scoring closes.

### Design
- **`design/tokens.css` is the source of truth for every visual value.** Copy it into
  `app/src/styles/` verbatim. `05-design-system.md` explains and pins it but does not replace it.
  The `*.dc.html` artboards and the seeded canvas are gitignored — `node design/build.mjs` rebuilds.
- Both items doc 05/10 deferred to Phase 4 are now answered: **button loading = disabled + label
  swap, no spinner** (doc 03 §8); **save failure = in-memory outbox behind an idempotent upsert**
  (doc 03 §7), with doc 10's chip unchanged.
- Every score, timing and mastery figure in the prototype is invented sample data.
- Contrast verified by computation — 40 pairs, both themes. Re-run if any colour token changes.
- **Accepted divergence:** the app's *distractor* order on the sixteen papers will not always
  byte-match `exams/exam-NN.md`. The correct answer's slot always matches (doc 03 §3.2).

### Repo and tooling
- Work sits on branch **`design/practice-app-system`**, unmerged. Nothing has been merged to `main`.
- **`mattpocock-skills` on, `superpowers` and `frontend-design` off** — never run superpowers here
  alongside mattpocock (guide §10).
- **No `.mcp.json`.** Add Neon MCP when the Neon project exists, Sentry MCP when the Sentry project
  exists, Playwright MCP when the e2e run is written. context7 is already user-scoped.
- Editing on `main` is blocked by a hook. Branch first.
- `.claude/launch.json` serves the `design/` static preview on :4173. Tracked; the artboards it
  serves are not — run `node design/build.mjs` first.

## Skipped
- **Doc 13 — Infrastructure & Security.** None of its four triggers fire: one Next.js app on a PaaS,
  one managed database, no IaC, and user data amounting to one email address plus study history.
  Doc 03 §9's mandatory baseline and doc 12 cover what exists. **Revisit if sign-up opens to
  strangers, a second service or worker appears, or infrastructure moves to code.**
- Doc 09 was written **narrow** — three cross-screen flows (first sign-in, the interrupted attempt,
  abandoning without submitting) rather than every mode, because doc 10 already specifies all eight
  screens including empty, loading and error states.
- **Phase 5 wrote no `rules/`, `agents/` or project skills.** The catalog's starter pack contradicts
  doc 03 on three counts and `rules/` would drift from docs 03/04/07. See the log.
