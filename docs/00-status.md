# Project status

**Project:** An LFCA exam simulator built on this repo's existing 1,150-question bank — three
modes (exam, practice, domain) replacing the sixteen static markdown practice exams.
**Phase:** 6 — Build. **Features 1–5 are done; feature 6 (H1, the holdout sitting) is in progress — #57 of #57–#61 done.**
**Production:** <https://lfca-lab-six.vercel.app>, deployed from git `main`.
**Updated:** 2026-09-21

This file is the handoff a cleared session reads first. It says where things stand and what not to
re-derive; it is not the history. **The history is the decision log** ([06-decision-log.md](06-decision-log.md)),
**the issues** (`gh issue view <n>`), and `git log`. Each feature below names its issues and its log
dates so the detail is one command away. *Condensed at the close of feature 5 (#53) from about 1,600
lines of per-ticket narrative that all three already held.*

---

## Done

### Planning — Phases 1–5a
- **1 · Brief + PRD.** [01](01-project-brief.md), [02](02-product-requirements.md), the log.
- **2 · Design.** One direction, built as a system in `design/`. Canvas:
  <https://claude.ai/code/artifact/141693a7-0b34-4fae-a25e-72ecad4b3d30> — 14 artboards, 3 pages.
- **3 · Extract.** [05](05-design-system.md) and [10](10-screen-specifications.md), from `design/tokens.css`.
- **4 · Tech docs.** [03](03-technical-design.md), [04](04-database-schema.md), [07](07-api-design.md),
  [08](08-auth-and-permissions.md), [09](09-user-flows.md), [11](11-testing-plan.md),
  [12](12-deployment.md), and [`CONTEXT.md`](../CONTEXT.md).
- **5 · Repo config** and **5a · skills setup.** `CLAUDE.md`, `.claude/settings.json`, the tracker on
  **GitHub Issues** (`docs/agents/`).

### Feature 1 — the holdout is pinned · #1–#3
`data/holdout.json` commits the 40 ids; `tools/lib/holdout.mjs` is the one definition of "intact";
`npm run validate` fails on drift and `npm run build-exams` **refuses to write** before its first
write. Log: 2026-08-30.

### Feature 2 — the data spine · #5–#13
`app/`, TypeScript strict, the pure domain layer, ten tables on Neon Postgres 18, the seed (which
**upserts** — it cannot truncate while `answer` references `question`), attempt creation and the
selection queries. The holdout has three locks that share no failure mode: the pinned file, the
builder's refusal, and every selection query's `is_holdout = false`. Log: 2026-08-31, 2026-09-01.

### Feature 3 — exam mode, E1–E7 · #14–#28
Sign-in behind the allowlist, the sixteen papers with best and first-attempt scores, a sitting with
free navigation and flags, the derived clock, the in-memory outbox and its chip, submit (scored in
one conditional `UPDATE`), the review with `why` for all four options, lazy auto-submit on four
reads, resume by derivation, re-sits, and the one Playwright run (doc 09 Flow B). Log: 2026-09-02 →
2026-09-06.

### Feature 4 — practice and domain mode, P1–P3, D1 · #29–#39
Home with the four modes (holdout disabled), setup screens, practice at 20/40/60 and domain at
20/40/all, a composed sitting **frozen** in `attempt_question`, forward-only with feedback on every
answer, closed by *Save and exit* or *Finish*, and read back with `Correct · Incorrect · Not reached`
— never a score. The bank authors every key first, so a composed sitting **derives** its key's slot
from `(attempt_id, question_id)`. Long code spans wrap at 375px (#29). Log: 2026-09-06 → 2026-09-09.

### Feature 5 — the deploy slice · #40–#53
Production exists, is private, deploys on a push to git `main`, and has been sat on a phone.
Acceptance was a real 20-question domain sitting completed on the owner's phone over cellular,
against production (#50). Log: 2026-09-11 → 2026-09-19.

- **Neon** (#41–#44). Branches renamed `main` (root, production) and `develop` (local work); a rename
  moves no endpoint host, **measured**. Two strings: `DATABASE_URL` is the **pooled** host and is
  what the app reads everywhere; `DATABASE_URL_UNPOOLED` is the direct host for migrate, seed and
  `pg_dump`, with **no fallback** between them. **`sslmode=verify-full` holds on the pooler** —
  structurally, since every endpoint is served one wildcard certificate and `-pooler` is a suffix on
  the leftmost label (doc 12 §2.1). Neon CLI and MCP have `gh`'s split, reads allowed and every write
  at `ask` (doc 12 §8).
- **Production data** (#44). Migrated, seeded, then restored from `develop` by the documented
  `pg_dump` — which had three defects that only running it revealed, now fixed and guarded by
  `backup-command.test.ts`. **Production started with no exam attempts**: the nine first-attempt rows
  on `develop` were development sittings, six of them 0/60 unanswered, and copying them would have
  burned the honest number on nine papers. `develop` keeps them. **All sixteen papers are unsat.**
- **Deploying** (#45–#48). `ci.yml` runs the three database-free suites on every push and holds no
  secret. `deploy.yml` runs the bank checks, then `db:migrate` and `seed`, on a push to `main`, with
  `DATABASE_URL_UNPOOLED` scoped to those two steps. `app/vercel.json` deploys **only** `main` (a
  branch map, not the boolean that would stop `main` too), pins `next build` and the `nextjs`
  framework. **CI does not gate the deploy** — Vercel and the workflow race on the same push, and
  the only coupling mechanism needs a custom domain. The recovery is *Promote to Production*.
- **Privacy** (#47, #49). Google sign-in works on production; a non-allowlisted account and an
  unset `ALLOWED_EMAILS` were both refused, **proved in SQL**.
- **Checklist §8** (#51). §8.1 is run after every push to `main`; §8.2 is the rollback, **rehearsed**
  (2s each way, no rebuild). The promote list holds a build with no `ALLOWED_EMAILS` — check
  `git log` before promoting.
- **Sentry** (#52). Errors only, production only, through a tunnel at `/monitoring`, scrubbed by
  `src/domain/scrub.ts` on both hooks — including Vercel's location headers, which nothing else
  removed.
- **Close-out** (#53). Dependabot configured — weekly, grouped, **opened against `develop`**, nothing
  auto-merged; vulnerability alerts on, security-fix PRs off (they ignore `target-branch`). Stale
  claims corrected in `CLAUDE.md`, `CONTEXT.md` and docs 03, 04, 11, 12. This file condensed.
  **#41's owner-only steps are done:** the CLI is authenticated, and a destructive command was
  watched prompting and denied.

Suites, re-measured 2026-09-19: **339** bank · **740** app unit · **194** app integration · **1** e2e.

### Feature 6 — the holdout sitting, H1 · #56–#61 · in progress
Spec and every rejected alternative: **#56**. Log: 2026-09-21.

- **#57 done.** `POST /api/attempt` with `{mode:"holdout"}` freezes the forty pinned ids and a
  3600-second clock in one transaction. Running holdout → `200 {attemptId, resumed:true}`; sat →
  `409 holdout_already_sat`; a `length` (or any other key) → `400`, the holdout variant alone being
  `strictObject`. `selectHoldoutQuestions` refuses anything but exactly forty. **Migration 0002 adds
  `one_holdout_per_user`**, a partial unique index, because the route's read-then-insert let two
  concurrent starts write two holdouts; a lost race is answered from a second read. Applied to Neon
  `develop`; reaches Neon `main` with the deploy workflow.

---

## Next

**`/implement 58`** — the holdout sitting: the exam arrangement over a frozen set. Then #59 (review),
#60 (home card), #61 (docs). The order is a dependency order: home lands last so no affordance ever
points at a 404. Read #56 first; do not re-derive it.

**Until #58 lands, a holdout can be started only by a hand-made `POST`, and `/attempt/[id]` still
`notFound()`s it.** Nothing in the UI reaches the endpoint — home's card is still `modecard--off`.

**Doc corrections owed to #61**, accumulated rather than made (as #57 instructs): doc 07 §2's
`409 holdout_already_sat` is narrowed to *sat*, with a running holdout returned `200 {resumed:true}`,
and the holdout gains the `resumed` short-circuit §2 says composed sittings lack; doc 07 §2's
holdout request refuses unknown keys; doc 04 §5.1 gains `one_holdout_per_user`; #56's "no
migration needed" is superseded by migration 0002.

**Verification boundary (#56):** develop proves start / submit / 409 / result freely; production gets
card + dialog + **Cancel** only. The real press is the owner's, once, after the sixteen papers.

The owner's own work in the meantime is sitting the sixteen papers on production.

**#41 is complete** (2026-09-19): `neon auth` approved, and a destructive `neon` command was
watched prompting in a non-bypass session and denied. Doc 12 §8.3.

Run `/implement <n>` per ticket. Each one ends committed, merged into `develop` and `main`, pushed,
checklist §8.1 run, and its branch swept.

---

## Blocked

Nothing.

---

## Carrying — measured or decided; do not re-derive

### Owner and stakes
- Sat LFCA 2026-07-11, scored **71 against 75** — No Pass by ~2 questions. One free retake, unbooked.
- **Riskiest assumption:** the bank has never been tested against the real exam. Mitigated by the
  40-question holdout and by first-attempt scoring. Do not weaken either.

### The bank
- 537 concepts, **1,150 questions** (1,000 `exam` pool + 150 `supplement`), 16 exams, drills, guide.
- The 16 exams are a clean partition: **960 distinct questions, zero overlap, 40 pool items unused**
  — the holdout. They match the official weights to within one question
  (SysAdmin 18 / Cloud 11 / Linux 10 / Security 8 / DevOps 7 / PM 6, per 60).
- Every item has exactly 4 options, exactly one correct, and a `why` on every option.
  **The key is always authored first (`o1`)** — papers are shuffled by the builder; composed sittings
  derive a slot.
- `exams/index.json` item `position` is the **correct option's slot**, not the question's order.
- **A `why` edit is not content-only**: the papers render it, so `npm run build-exams` belongs in the
  same commit or `npm test` refuses the push.
- Real exam: **60 questions, 90 minutes, 75% (45/60)**.

### Tech (doc 03; rationale in the log)
- Next.js App Router in `app/` · TypeScript strict · Drizzle · Postgres 18 on Neon · Vercel · Better
  Auth + Google OIDC behind an `ALLOWED_EMAILS` allowlist that **fails closed** · Sentry · Vitest +
  one Playwright run.
- `app/src/domain/` is pure — no I/O, no React, no `Date.now()`. Everything that decides a number
  lives there.
- The clock is derived from `started_at`, never stored, never extended; expired sittings finalise
  lazily. No cron anywhere.
- `is_first_attempt` is set at **creation**, not at submit.

### Decided, challenged, upheld — do not re-litigate
- Postgres, and Google sign-in in v1. No adaptive selection; unseen-first is ordering only. The study
  guide stays outside the app. The app never writes question content. **No "discard this attempt"
  action anywhere.** Two environments, no previews. No ceremony on a push to `main`.

### Known limits, accepted and recorded
- One of three Sentry server probes never arrived (inferred flush loss); Vercel's runtime log holds
  error messages unscrubbed. Log 2026-09-19 carries the revisit trigger.
- A composed sitting's Finish is blocked for as long as a write is owed; a reload drops the in-memory
  queue (checklist §5).
- The shared `ThemeToggle` is 36px, under the 44px target, on every screen — not fixed, because
  resizing it changes every screen at once.
- `.grid60--touch` is `auto-fill` at 44px, six columns at 375px rather than doc 10 §4's seven — chosen.
- Doc 10 §3's *Loading* and *Error* states for `/domain` are neither built nor cut; checklist §6
  carries the check that decides.
- A rollback across a **destructive** migration is doc 12 §4 steps 2–3, inside Neon's 6-hour window,
  and is rehearsed by nothing.

### Repo and tooling
- Work lands on a ticket branch off `develop`; merged into `develop` and `main`, both pushed.
  **A push to `main` is a production deploy** and gets checklist §8.1 afterwards. Check
  `git log origin/main..develop` before assuming production is current — `main` has drifted behind
  before.
- Long-lived git branches: `main` and `develop` only. Dependabot opens `dependabot/…` branches against
  `develop`; they deploy nothing.
- Neon identifiers, the permission rules and their limits: doc 12 §8. Neon CLI is `neon` v4.14.0.
- `.mcp.json` holds Neon, Playwright and Sentry MCP. context7 is user-scoped.
- `mattpocock-skills` on; `superpowers` and `frontend-design` off — never both packs at once.
- Editing on `main` is blocked by a hook. Branch first.
- `design/tokens.css` is the source of truth for every visual value, copied verbatim into the app.
  Contrast was verified by computation (40 pairs, both themes) — re-run if a colour token changes.
- Tickets are public (the repo is). Never put a doc 12 §2 secret in an issue.

### Non-obvious shell facts
- `cp` is aliased to `cp -i`: in mutation checks use `command cp -f` and diff after every restore.
- zsh does not word-split `$var` in `for` loops — run such loops under `bash -c`.
- A stale `app/.next` breaks typecheck after a route is deleted; `rm -rf app/.next`.
- `gh run list --commit` needs the full 40-character SHA. Check `$?`, never a grep of piped output.
- `vercel env add` needs `--type config` for a `NEXT_PUBLIC_` name, and exits 0 when it refuses.
- A test that writes the **content** tables of Neon `develop` must roll back unconditionally —
  throw its own sentinel — never rely on the code under test to throw. #57's first draft did, and
  its red run committed and left `develop` marking 39 holdout rows until `npm run seed` repaired it.

---

## Skipped
- **Doc 13 — Infrastructure & Security.** None of its triggers fire. Revisit if sign-up opens to
  strangers, a second service appears, or infrastructure moves to code.
- Doc 09 was written narrow — three cross-screen flows — because doc 10 specifies every screen.
- Phase 5 wrote no `rules/`, `agents/` or project skills; see the log.
