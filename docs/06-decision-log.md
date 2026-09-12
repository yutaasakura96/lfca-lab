# Decision log — LFCA exam simulator

Append-only. Every meaningful choice, including what was rejected and why.

---

### [2026-08-28] Restart simulator planning from scratch

**Decision:** Begin the simulator at Phase 1 with no reference to prior planning.
**Context:** The owner described it as "half way planned." Investigation found otherwise —
`PROGRESS.md:59` lists "cycle 4 (simulator)" as unstarted, and the only other cycle-4 material
in that file is an unrelated sourcing-audit proposal. No simulator design, spec, or schema
exists anywhere in the repo.
**Rejected:** Salvaging prior work — there is none to salvage.
**Consequence:** Nothing is lost by starting fresh. `docs/00-status.md` created as the memory.

---

### [2026-08-28] Three modes, not two

**Decision:** Exam mode, practice mode, and domain mode.
**Context:** The owner opened with two modes separated by feedback timing, then clarified a
third: pick one domain to make a short repeatable session, "especially if I'm weak on that
area."
**Consequence:** The three differ only in composition, clock, and feedback timing. One question
renderer and one data path serve all three, which is why v1 can carry all three.

---

### [2026-08-28] Google sign-in ships in v1

**Decision:** Better Auth with Google OIDC, from the start. Postgres from day one.
**Context:** Proposed instead that v1 ship no auth, with progress behind a small interface so
auth could be added when the app went public — on the grounds that a single user signing into
their own study tool is cost with no v1 benefit. **The owner reaffirmed twice**: "we are gonna
use a db, postgres to be exact, so it doesn't matter if it's just me or not," and then chose
Google sign-in from the start when asked directly.
**Rejected:** Deferring auth to a v1.1. Overruled by the owner; not revisited.
**Consequence:** Phase 4 grows an auth section and a `user` table. Library choice is recorded
here but is a Phase 4 decision, not a Phase 1 one — the brief and PRD stay tech-free.

---

### [2026-08-28] Done bar is "100% on each of the sixteen exams," re-sits allowed

**Decision:** No readiness threshold, dashboard, or gating in the app. A list of sixteen exams
with the best score beside each, and a way to sit one again.
**Context:** Offered four candidate bars, including first-attempt-85%-plus-clean-re-sit. The
owner pushed back — "does this matter? does it have to be known?" It largely does not: a done
bar only needs building if the app computes it. This one does not.
**Rejected:** Score thresholds and readiness gating — unnecessary complexity for a single user
who can judge their own readiness.
**Consequence:** Simpler than every alternative offered. See the next entry for the one thing
retained from the rejected options.

---

### [2026-08-28] Record first-attempt score alongside best score

**Decision:** Every exam shows both. First attempt is never overwritten.
**Context:** "Re-sit until 100%" is satisfiable by memorising sixteen fixed exams — there is no
other material, so repeats are guaranteed. Best score therefore drifts to 100% by construction
and measures recall, not knowledge.
**Consequence:** Costs one column and a write-once rule. It is the only score in the app that
stays honest. An abandoned attempt still counts as the first attempt (auto-submitted at 90
minutes), or the honest number could be dodged by quitting bad sittings.

---

### [2026-08-28] Reserve the 40 unused pool items as a holdout

**Decision:** The 40 exam-pool items not used by any of the sixteen exams are never served in
exam, practice, or domain mode. They are sat once, at the end, as a 40-question / 60-minute
scored check.
**Context:** Measured, not assumed — the sixteen exams use 960 distinct items with zero overlap
across a 1,000-item pool, leaving exactly 40. Once the sixteen are worked, nothing in the bank
is unseen.
**Rejected:** Putting all 1,000 in circulation (simpler, but leaves no fresh material); making
it a 17th exam sittable anytime (it would be burned early and stop being a holdout).
**Consequence:** The holdout is pinned **by ID**, not defined as "whatever is unused" — a
future `npm run build-exams` that pulled one into an exam must fail validation.

---

### [2026-08-28] The app is read-only over the question bank

**Decision:** No authoring or editing of questions in the app. Content is edited as JSON in the
repo, validated by `npm run validate`, built by `npm run build-exams`.
**Consequence:** No CRUD surface, and no possibility of the app and the repo disagreeing about
what a question says.

---

### [2026-08-28] No adaptive or spaced-repetition selection in v1

**Decision:** Selection follows official domain weights, or a domain the user picks. Unseen
questions are preferred over already-answered ones — ordering only, not adaptation.
**Rejected:** The app choosing what to serve based on past performance. It is the most tempting
feature here and the least verifiable: it needs answer history, tuning, and some way to tell
whether it is helping. Revisit once real answer data exists.

---

### [2026-08-28] Exam mode resumes with the clock still running

**Decision:** Answers and flags persist as made. Returning restores position and **true**
remaining time — elapsed wall-clock counts whether the tab was open or not.
**Rejected:** Pausing the clock while away (breaks the one thing exam mode exists to
reproduce); killing the attempt (simplest, but destroys first-attempt scores to accidental
closes).

---

### [2026-08-28] The study guide stays outside the app

**Decision:** `study-guide/` remains 32 markdown files read in an editor or on GitHub.
**Context:** The owner asked what the study guide was, was shown it, and chose to keep it out.
**Rejected:** Rendering it in-app (a second product, 1.9 MB of cross-linked markdown competing
for build time with the exam engine); linking out to it per concept (cheap, but needs a
`concept_id` → guide-section mapping that may not exist). The linking option is the natural
first thing to reconsider if this decision is ever revisited.
**Consequence:** The per-option `why` text carries the whole explanatory burden — which is why
the PRD requires showing `why` for **all four** options, not just the correct one.

---

### [2026-08-28] Constrain the prototype; do not commission a design-system document

**Decision:** The Claude Design prompt asks for a systematically-built prototype that **exports
CSS custom properties** — one palette, one spacing scale, one type ramp, defined semantic
states, dark mode as a first-class theme. It does **not** ask for a separate design-system
document.
**Context:** The owner asked why the original handoff prompt omitted a design system. The
omission was deliberate but under-specified. Phase 3's contract is extraction — "real hex codes
and pixel values, extracted, not invented" — and a design-system document authored alongside a
prototype tends to describe intentions the prototype does not actually honour, leaving Phase 3
documenting fiction.
**But:** a prototype built with no systematic constraint produces ad-hoc values, and Phase 3
then faithfully extracts an inconsistent design. Guarding against an invented system had
quietly become an excuse for not asking for a real one.
**Rejected:** Asking Claude Design to produce `05-design-system.md` directly — it would compete
with Phase 3 and could disagree with the prototype's own CSS.
**Consequence:** `05-design-system.md` is still written in Phase 3, still by extraction, but now
from tokens rather than from archaeology. Specific constraints added because this UI needs
them: correct/incorrect/flagged/unanswered must be distinguishable **without colour alone**
(the review screen is almost entirely red/green); the clock needs a normal/warning/critical
ramp; the review screen needs a real prose type ramp and line measure, since it shows four
explanations per question across 60 questions.

---

### [2026-08-29] Design direction: IBM Plex superfamily, one instrument-panel palette

**Decision:** IBM Plex Sans (chrome) / Serif (all prose) / Mono (numerals, timers, shell text), on a
cool-neutral 12-step ramp at hue 250–258 with four semantic families. Authored in oklch.
**Context:** No brand, no existing app, no stylesheet in the repo — the design system started from
nothing. The brief's "calm, focused, legible under time pressure" and a 90-minute sitting were the
only constraints.
**Rejected:** Inter/Roboto system-sans defaults (generic, and the review screen needs a real prose
face); a sans-only stack (17px/1.65 serif reads better across four explanations × 60 questions);
picking a reference product to imitate.
**Consequence:** `--accent` (the "current" state) deliberately reuses the neutral ramp's own hue with
the chroma raised, so "you are here" never reads as a fifth colour. Recorded as IBM Carbon
*typographic lineage only* — layout and density are not Carbon's.
**Revisit if:** the app acquires a brand, or Plex proves unreadable at 17px on low-DPI displays.

---

### [2026-08-29] Semantic states are never carried by colour alone

**Decision:** correct / incorrect / flagged / unanswered / current each pair their colour with a
glyph, a border treatment and a written label. Flagged is **orthogonal** — a folded tile corner drawn
over whatever the tile already is, not a sixth value in the same enum.
**Context:** The review screen is almost entirely red and green, which makes it the screen most likely
to fail a colour-blind reader.
**Rejected:** Distinguishing answered from unanswered by fill colour alone; making flagged a mutually
exclusive tile state (it would have forced a sixth colour and lost answered-and-flagged).
**Consequence:** Board 03 ends with the whole set rendered at `filter: grayscale(1)` as a standing
test. A new state that is not legible there is not finished.
**Revisit if:** never, without an accessibility argument.

---

### [2026-08-29] Contrast verified by computation, not by eye

**Decision:** 40 colour pairs computed through oklch → sRGB → WCAG relative luminance in both themes.
All pass (4.5:1 text, 3:1 non-text). Nine failed on first run and the palette was reworked.
**Context:** "Should be readable" is not "verified". Body meta text measured 3.87:1 in light.
**Consequence:** Light ink levels each moved down one ramp step; `--n-400` was darkened to 0.650; and
a new `--line-control` token was added for borders that *identify* a control or a state. Decorative
hairlines (`--line-subtle`, `--line-default`) stay below 3:1 deliberately — WCAG 1.4.11 exempts them.
`--ink-faint` clears 3:1 only and is barred from small copy.
**Revisit if:** any colour token changes — re-run before shipping.

---

### [2026-08-29] Domain mode length: selector, default 20

**Decision:** Domain mode offers 20 / 40 / all-in-domain, defaulting to **20**. Closes open assumption
1 in `02-product-requirements.md` §7.
**Context:** The prototype initially shipped with 40 preselected — a design-time choice, not a product
decision. Security has 84 questions; 20 is roughly a 15-minute sitting, which is the length that
actually gets done on a weeknight.
**Rejected:** Fixed 20 with no control (cheapest to build, but a longer pass is genuinely useful when
revising one weak domain); default 40 (too long to be "short and repeatable").
**Consequence:** PRD §7 assumption 1 is resolved. Assumption 2 (practice mode = 60) stands and is
consistent with the prototype.
**Revisit if:** session-completion data shows 20 is routinely abandoned or routinely too short.

---

### [2026-08-29] Generated design output is not committed

**Decision:** `design/tokens.css`, `design/base.css`, `design/parts/*.part`, `build.mjs`, `canvas.json`
and `tools/` are committed. The 14 `*.dc.html` artboards and the 2.9 MB seeded canvas are gitignored.
**Context:** The seeded canvas embeds the whole editor payload; the artboards are deterministic output
of `node build.mjs`.
**Rejected:** Committing the artboards for inspectability — they would produce large diff noise on
every token change and invite hand-editing the generated file.
**Consequence:** `tokens.css` is unambiguously the source of truth. Anyone cloning runs
`node build.mjs` before re-seeding.

### [2026-08-30] Next.js App Router, Drizzle, Vercel + Neon
- **Decision:** Next.js App Router in `app/` in this repo, TypeScript strict, Drizzle ORM with
  `drizzle-kit` migrations, deployed on Vercel with Neon Postgres. Plain CSS over
  `design/tokens.css` copied in verbatim.
- **Alternatives considered:** React Router 7 and SvelteKit (equivalent single-deployable shape;
  rejected for a smaller Better-Auth-plus-Postgres path and, for Svelte, because doc 05 and doc 10
  are written in React-shaped component language). Vite SPA + separate API (two deploy targets,
  hand-rolled browser sessions, an API with no second consumer). Prisma (heavier serverless runtime,
  schema language that is not SQL). Railway, Fly.io and a self-hosted VPS (all viable; Vercel + Neon
  is $0 at this scale with branch-per-preview databases). Tailwind (would re-express values doc 05
  already pins).
- **Reason:** one deployable, first-class Better Auth integration, and — decisively — server
  components mean the answer key is read on the server and never has to approach a client bundle.
- **Revisit if:** the 90-minute clock ever needs server-side scheduling (it does not — the clock is
  derived), or Vercel's non-commercial Hobby terms stop fitting.

### [2026-08-30] Seed the question bank into Postgres rather than bundling it
- **Decision:** `npm run seed` projects `questions/**`, `exams/index.json` and `data/holdout.json`
  into read-only content tables, idempotently, inside one transaction, on every deploy.
- **Alternatives considered:** bundling the JSON into the app server-side only (no seed step, no
  drift — but no referential integrity between answers and questions, and one careless import away
  from shipping the answer key to the browser); a hybrid id-registry table (integrity without
  duplication, at the cost of two places a question can be missing from).
- **Reason:** answers get real foreign keys, so renaming a bank id fails loudly instead of orphaning
  history; unseen-first selection becomes one SQL query; and the `why` text stays server-side by
  construction rather than by discipline.
- **Revisit if:** the bank grows past the point a full truncate-and-reinsert is comfortable, which is
  nowhere near 1,150 items.

### [2026-08-30] The holdout must be pinned by identity, not derived
- **Decision:** add `data/holdout.json` with the 40 ids as committed source; assert set-equality with
  `exams/index.json.unused` in `npm run validate`; carry `is_holdout` into Postgres; filter on it in
  every selection query.
- **Alternatives considered:** continuing to read `index.unused` at seed time (what exists today).
- **Reason:** `unused` is a *residue* of the composition, rewritten by every `npm run build-exams`.
  An ordinary, well-intentioned rebuild could promote a holdout item onto a paper and silently void
  the project's only mitigation for its riskiest assumption. Three independent checks now have to
  fail together.
- **Revisit if:** never, while the holdout exists. This is the first task of the build phase.

### [2026-08-30] One `attempt` table discriminated by mode
- **Decision:** exam, practice, domain and holdout sittings are all rows in `attempt`, with check
  constraints tying the nullable columns to the mode. Answers hang off an attempt in every mode.
- **Alternatives considered:** attempts for scored sittings only with loose practice answers
  (smaller schema, but no resume for practice and no record that a session happened as a unit);
  a table per mode (triples the query surface and makes review branch on provenance).
- **Reason:** one code path for answering, resume for free in every mode, and the check constraints
  make the nullable columns honest rather than conventional.
- **Revisit if:** a fifth mode arrives whose columns share nothing with these four.

### [2026-08-30] "Seen" is derived from the answer table
- **Decision:** a question counts as seen when the user has an answer row for it; least-recently-seen
  is `max(answered_at)`. No exposure table, no second write path.
- **Alternatives considered:** a `question_exposure` table upserted when a question is *served*
  (cheaper query, counts served-but-skipped as seen, but a second write on the hot path that can
  drift from the answers).
- **Reason:** one source of truth. The consequence — a question served but never answered stays
  "unseen" — is the behaviour we want: you did not engage with it.
- **Revisit if:** practice sessions ever get long enough that scanning history is slow, which at one
  user and 1,150 questions they will not.

### [2026-08-30] `is_first_attempt` is set when the attempt is created
- **Decision:** the flag is written in the attempt's `INSERT`, as `NOT EXISTS (an earlier attempt at
  this exam)`, guarded by a unique partial index. Submission never touches it.
- **Alternatives considered:** setting it in the same conditional update that sets `submitted_at`
  (which the first draft of docs 03/04/07 said).
- **Reason:** it is wrong, and not hypothetically. Start exam 07, abandon it, sit it again the next
  day and finish the second sitting first — at submit-time the *second* attempt claims the flag,
  while the abandoned one is finalised later and cannot. PRD §5 says an abandoned attempt **is** the
  first attempt. Setting it at start makes the flag a property of being earliest, independent of the
  order sittings are finalised in.
- **Revisit if:** never. This is the number the project exists to keep honest.

### [2026-08-30] The exam clock is derived, never stored
- **Decision:** `started_at` and `time_limit_seconds` are written once; remaining time is always
  computed server-side and sent as an absolute deadline. Expired attempts are finalised **lazily**,
  on the next read. No cron, no background worker.
- **Alternatives considered:** a stored countdown updated by the client (trivially tamperable, and
  disagrees between tabs); a scheduled job to close expired attempts (infrastructure for nothing —
  an expired attempt's score is already fully determined by its answer rows).
- **Reason:** one decision answers three PRD edge cases at once — tab closed for 90 minutes, two tabs
  open, and a wrong system clock.
- **Revisit if:** an attempt's outcome ever needs to be visible to someone other than the person
  sitting it, at which point "finalised when read" stops being sufficient.

### [2026-08-30] In-memory outbox for failed answer writes, not a durable one
- **Decision:** each answer POSTs immediately to an endpoint that upserts on
  `(attempt_id, question_id)`. Failures queue in memory and retry with exponential backoff while the
  "Not saved — retrying" chip shows. Submit is blocked while the queue is non-empty.
- **Alternatives considered:** a durable outbox in IndexedDB (would buy offline answering, strictly
  more than the PRD asks — at the cost of replaying stale writes against an attempt the server has
  already auto-submitted at 90 minutes); retrying only the failed write with no queue (simplest; a
  persistently failing write is simply lost).
- **Reason:** doc 10's contract is "at most the in-flight answer is lost", and the in-memory queue
  meets it exactly. The durable version adds a hard correctness problem to buy a scenario — answering
  offline for minutes — that does not happen at a desk.
- **Revisit if:** the app is ever used somewhere with genuinely intermittent connectivity.

### [2026-08-30] Button loading state: disabled plus a label swap, no spinner
- **Decision:** resolving the item doc 05 §7.2 deferred to this phase. A busy button takes the
  existing disabled tokens and changes its label — "Submit and see score" → "Scoring…". No spinner,
  no icon slot, no animation. Three places only: sign-in, start-attempt, submit.
- **Alternatives considered:** a 14px inline spinner in a reserved icon slot (more conventional,
  reads as busy at a glance); no loading state at all.
- **Reason:** the design system currently has no animated primitive and no icon slot on a button.
  Adding both, for three buttons whose operations are sub-second, is exactly the improvisation doc 05
  warned against.
- **Revisit if:** any of those three operations routinely exceeds about a second.

### [2026-08-30] Google sign-in is closed by an email allowlist
- **Decision:** `ALLOWED_EMAILS` is checked in Better Auth's sign-in hook before any row is written.
  A non-listed account gets no `user`, no `account`, no `session`. An empty or unset variable rejects
  **everyone**.
- **Alternatives considered:** open sign-up with per-user isolation (not a data-leak risk, since
  every query is already scoped by `user_id` — but it means shipping a public product without
  deciding to, on a free-tier database with no rate limiting); first-account-wins (no variable to
  maintain, awkward to undo after signing in with the wrong account).
- **Reason:** without it, deploying is publishing. Failing closed on an empty variable is the only
  safe default.
- **Revisit if:** the app opens to other users — at which point rate limiting arrives with it.

### [2026-08-30] Testing: pure logic exhaustively, one browser test, no database tests
- **Decision:** Vitest over `app/src/domain/` covering scoring, selection, unseen-first ordering,
  clock derivation, the first-attempt rule and bank integrity; one Playwright run covering
  start → answer → resume → auto-submit → review → double-submit; everything visual on a written
  manual checklist.
- **Alternatives considered:** unit tests only (leaves the resume-and-auto-submit path, the hardest
  thing in the app, with no automated coverage); adding integration tests against a real Postgres
  branch (strongest, but meaningful CI apparatus for one user).
- **Reason:** a silently wrong number is worse than a crash, because it is believed. The tests go
  where numbers are decided.
- **Revisit if:** the unseen-first `LATERAL` query is edited — it is the one piece of real SQL with
  no direct coverage, and that is an accepted, named risk.

### [2026-08-30] No "discard this attempt" action, in any mode
- **Decision:** there is no delete or discard endpoint, no soft-delete column, and no UI affordance.
  Abandoned attempts are kept and auto-submitted.
- **Alternatives considered:** letting the user discard a sitting that went badly.
- **Reason:** a discard button is precisely the dodge that first-attempt scoring exists to close.
- **Revisit if:** never, while first-attempt scoring is the honest signal.

### [2026-08-30] Doc 13 (Infrastructure & Security) skipped
- **Decision:** not created. The mandatory security baseline in doc 03 §9 and the environment,
  rollback and backup content in doc 12 cover what exists.
- **Alternatives considered:** writing a short version anyway.
- **Reason:** none of its four triggers fire — one Next.js app on a PaaS, one managed database, no
  IaC, and user data consisting of one email address and study history.
- **Revisit if:** sign-up opens to strangers, a second service or worker appears, or infrastructure
  moves to code.

### [2026-08-30] mattpocock/skills enabled here; superpowers and frontend-design stay off
- **Decision:** `claude plugin enable mattpocock-skills --scope project`. `superpowers` and
  `frontend-design` remain `false` in `.claude/settings.json`.
- **Alternatives considered:** re-enabling superpowers for the build phase; enabling
  frontend-design for the app's UI work; enabling nothing and building unassisted.
- **Reason:** Phase 6 hands off to `/grill-with-docs`, which is mattpocock's. The two packs must
  not share a repo — superpowers' `brainstorming` sets no `disable-model-invocation` and will seize
  interviews that belong to the template's question banks. frontend-design forces a design frame
  before code, but every visual value here is already pinned in `design/tokens.css` and verified by
  computation; re-deciding them is the drift doc 05 exists to prevent.
- **Consequence:** `/setup-matt-pocock-skills` must be run once, choosing **local files** as the
  tracker — Backlog (Nulab) is not supported. Tickets will live in `.scratch/<feature>/issues/`.
- **Revisit if:** the pack goes unused for two weeks, per the catalog's standing evaluation.

### [2026-08-30] No `.mcp.json`, no `.claude/rules/`, no `.claude/agents/`
- **Decision:** none written. `CLAUDE.md` names the trigger for each MCP instead.
- **Alternatives considered:** copying portfolio-v2's starter pack — `nextjs-app-router`,
  `tailwind-v4`, `shadcn`, `prisma-neon` skills, the code-reviewer/db-agent roster, and a `rules/`
  set; wiring Neon, Sentry, Playwright and GitHub MCPs now.
- **Reason:** three of those four skills contradict doc 03 outright (plain CSS, not Tailwind; own
  components, not shadcn; Drizzle, not Prisma), and `nextjs-app-router` was read and found hardcoded
  to portfolio-v2's route groups and JWT admin. The MCPs have nothing to connect to — no Neon
  project, no Sentry project, no `app/`. `rules/` would duplicate docs 03 §4, 04 and 07 and drift
  from them; context7 is already user-scoped and covers the live library docs.
- **Revisit if:** add Neon MCP when the Neon project exists, Sentry MCP when the Sentry project
  exists, Playwright MCP when the e2e run is written.

### [2026-08-30] `build-exams` and `seed` are `ask`, not `allow`
- **Decision:** `npm run build-exams`, `npm run seed`, `npm run db:migrate`, `drizzle-kit`,
  `vercel`, `pg_dump`/`psql` and `git push` all require a prompt. `.env` reads are denied.
- **Alternatives considered:** allowing `build-exams` as an ordinary build script.
- **Reason:** `build-exams` rewrites `exams/index.json.unused`, which is the holdout until
  `data/holdout.json` pins it — the one action that can silently void the project's only defence
  against its riskiest assumption. `seed` truncates the content tables.
- **Revisit if:** never, for `build-exams`, while the holdout matters.

### [2026-08-30] One hook: a branch guard on `main`
- **Decision:** `.claude/hooks/pre-edit-branch-guard.sh`, `PreToolUse` on `Edit|Write|NotebookEdit`.
  Verified to exit 2 on `main` and 0 elsewhere.
- **Alternatives considered:** the catalog's fuller pipeline — `post-edit-format` and
  `pre-commit-gate` alongside it.
- **Reason:** push to `main` deploys production (doc 12 §3), so that guard earns its keep today.
  The other two do not yet: the bank half has no formatter and the app has not chosen one, and the
  gate would duplicate CI (doc 11 §5) on every commit.
- **Revisit if:** add `post-edit-format` when `app/` picks a formatter.

### [2026-08-30] Issues live in GitHub Issues, not local markdown
- **Decision:** the mattpocock/skills issue tracker for this repo is **GitHub Issues** on
  `yutaasakura96/lfca-lab`, driven by the `gh` CLI. `/setup-matt-pocock-skills` was run and wrote
  `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md` and `docs/agents/domain.md`, with an
  `## Agent skills` block in `CLAUDE.md` pointing at all three. The five canonical triage labels are
  kept unrenamed; four were created on the repo (`wontfix` already existed as a GitHub default).
  **This reverses the consequence recorded in the [2026-08-30] entry
  "mattpocock/skills enabled here; superpowers and frontend-design stay off"**, which said to choose
  local files with tickets under `.scratch/<feature>/issues/`. That log entry stands as written — the
  log is append-only — and this entry supersedes its tracker choice.
- **Alternatives considered:** local markdown under `.scratch/` (what the earlier entry specified —
  no remote dependency, and invisible to anyone but the owner); Backlog (Nulab), which the skills do
  not support and which was the reason local files looked like the only option.
- **Reason:** the GitHub remote already exists and `gh` is already authenticated, so the tracker the
  skills were designed against costs nothing to adopt. It also gives `/wayfinder` its native issue
  dependencies and sub-issues, which the local-file layout cannot express, and it survives a wiped
  working tree — `.scratch/` is untracked by design and one `git clean` from gone.
- **Consequence:** tickets are public, because the repo is. Nothing in this project's tickets is
  sensitive — the bank is publicly-derived study material — but `ALLOWED_EMAILS`, the Neon string and
  the other three secrets in doc 12 §2 must never appear in an issue body. `docs/agents/` is now the
  place these conventions live; re-run the setup skill only to switch trackers.
  `.claude/settings.json` gains the `gh` rules the skills need, on the same split as everything else
  in that file: reads (`gh issue view`/`list`, `gh label list`, `gh repo view`) allowed, every write
  (`gh issue create`/`edit`/`comment`/`close`, `gh label create`, and `gh api`, which `/wayfinder`
  uses to POST dependency edges) in `ask`. Writing to a public tracker gets a prompt.
- **Revisit if:** the repo goes private for a reason that also makes issues awkward, or the ticket
  volume never justifies leaving the terminal.

### [2026-08-30] `build-exams` refuses to write rather than building around the pin
- **Decision:** `npm run build-exams` computes its composition exactly as before, then compares the
  resulting `unused` against `data/holdout.json` through `checkHoldoutIntegrity` — the same function
  `npm run validate` calls — and on any disagreement prints the directional errors and exits non-zero
  **before its first write**. A refusal leaves all sixty-three generated files exactly as they were.
- **Alternatives considered:** teaching the allocation to build *around* the pinned ids, so a holdout
  item could never be selected onto a paper in the first place; leaving detection to
  `npm run validate` alone, as #2 shipped it; keeping `build-exams` in `permissions.ask` and calling
  the prompt the guard.
- **Reason:** building around the pin means editing the allocation — the most load-bearing and
  best-tested code in the repo — to defend against an event a refusal already prevents, and it would
  silently *absorb* a drifted pin instead of reporting it. Validate-only detection is real but late:
  it fires after sixty-three files have been overwritten, leaving a dirty tree to unpick and inviting
  the one repair that must never happen — rewriting `data/holdout.json` to match the build. The
  permissions prompt is a seatbelt against an unprompted run, not a check on what the run would do.
- **Consequence:** the pin now has two guards sharing one definition of a violation, so the builder
  and the validator cannot disagree. The composition is untouched: `tools/lib/assemble.mjs` has no
  diff. A missing or malformed `data/holdout.json` stops the builder rather than reading as
  agreement.
- **Revisit if:** never, while the holdout matters.

### [2026-08-31] The root test script is scoped to the bank's own tests
- **Decision:** the root `npm test` runs `node --test "tools/test/**/*.test.mjs"` rather than a bare
  `node --test`. The two suites are separate and stay separate: the bank's runs on Node's test
  runner, the app's on Vitest. This is the one edit to the root `package.json` that `app/` required,
  and it adds no dependency — the root still declares none.
- **Context:** `node --test` discovers `*.test.ts` anywhere beneath the working directory. The moment
  `app/tests/` existed, the root suite found two Vitest files, tried to run them under Node's runner,
  and died at `import { describe } from 'vitest'` — 341 tests, 2 failing, in a suite whose job is to
  guard the holdout.
- **Alternatives considered:** an exclusion flag — Node 25.1.0 has none that helps; `--test-skip-pattern`
  does not apply, because the failure happens at module load before any test name exists. Naming the
  app's tests `*.spec.ts`, which Node's default glob does not match while Vitest's default include
  does — this would have left the root file literally untouched, and was rejected because it makes
  the root's discovery rule an invisible constraint on the app's file naming, which is a worse thing
  to forget than a line in a script.
- **Consequence:** `docs/03-technical-design.md` §4 annotated `app/package.json` as "root
  package.json untouched"; that annotation has been reworded to what actually matters, which is that
  the root declares no dependencies. A root test file outside `tools/test/` is now invisible to the
  suite — the `**` recurses, so subdirectories are covered, but a test placed elsewhere would be
  silently skipped rather than failing loudly.
- **Revisit if:** the bank ever grows tests outside `tools/test/`, or the app moves to a runner whose
  files Node's discovery ignores.

### [2026-08-31] `allowlisted` is a Better Auth additional field, not a post-generation `ALTER`
- **Decision:** the `user.allowlisted` column is declared in `app/src/auth.ts` as a
  `user.additionalFields` entry, so Better Auth's own generator emits it into
  `app/src/db/schema/auth.ts`. It reaches the database through the ordinary migration alongside
  every other column.
- **Context:** `docs/04-database-schema.md` §2 specified it as an `ALTER TABLE "user" ADD COLUMN`
  applied *after* generation, on the reasoning that the auth tables are the library's and should not
  be hand-edited.
- **Alternatives considered:** the documented `ALTER` — it works exactly once. The next
  `npm run auth:generate` rewrites the schema file from the library's definition, the column
  disappears from the Drizzle model, and the following `drizzle-kit generate` produces a migration
  that **drops** it. The column carries the flag deciding who may sign in, so the failure mode is a
  silent widening of access at the moment someone regenerates a schema for an unrelated reason. Also
  considered: hand-adding the column to the generated file, which has the same problem one step
  earlier.
- **Reason:** `additionalFields` is the library's own mechanism for exactly this, and it makes the
  column survive regeneration. The spirit of doc 04 §2 — do not hand-edit the generated file — is
  better served by this than by the `ALTER` it prescribed, because the `ALTER` leaves the generated
  file and the database permanently disagreeing.
- **Consequence:** `src/auth.ts` exists in a slice that authenticates nobody. It declares no
  provider, no session policy and no allowlist hook, and is mounted on no route; it exists so the
  generator knows the shape of four tables. Doc 04 §2 has been rewritten to match, including two
  further divergences found by generating: the `account` table carries `issuer`,
  `refresh_token_expires_at` and an unused `password` column, and **the auth tables' timestamps are
  `timestamp`, not `timestamptz`**, which is the single exception to §0's rule.
- **Revisit if:** Better Auth changes how additional fields are declared, or the allowlist moves out
  of the user row.

### [2026-08-31] The seed upserts; it cannot truncate
- **Decision:** `npm run seed` upserts `question` and `exam`, replaces `question_option` and
  `exam_item` outright, and deletes only the parent rows the bank no longer has — all in one
  transaction, with the holdout count read back before it commits.
- **Context:** [03-technical-design.md](03-technical-design.md) §3 specified "truncates the four
  content tables and reinserts". Tested against the provisioned database: `TRUNCATE question` fails
  with *"cannot truncate a table referenced in a foreign key constraint"*, and it fails on an **empty**
  database, because the objection is `answer`'s foreign key rather than any row.
- **Alternatives considered:** `TRUNCATE ... CASCADE`, and naming `answer` in the same `TRUNCATE`.
  Both work, and both delete every attempt and answer — including the first-attempt scores, which are
  the one thing here that cannot be regenerated. A content refresh that destroys irreplaceable
  history to reload data the repo already holds is the worst trade available in this system. Also
  considered: reconciling the child tables row by row, rejected because nothing references them, so
  clearing them is simpler and equally correct.
- **Reason:** the end state is identical and history survives. The property doc 03 §3 actually cares
  about — a renamed question id failing loudly rather than orphaning answers — is *better* served:
  the prune step deletes the vanished id, `ON DELETE RESTRICT` refuses while an answer points at it,
  and the transaction rolls back with nothing lost.
- **Consequence:** verified on 2026-08-31 — seeding twice produced identical content fingerprints,
  and a reseed run with a user, an attempt and an answer present left all three, and the
  `is_first_attempt` flag, untouched. Doc 03 §3 and doc 04 §7 have been corrected.
- **Revisit if:** never, while `answer` references `question`.

### [2026-08-31] The seed runs from CI, not from the Vercel build step
- **Decision:** `npm run seed` will be invoked from GitHub Actions on push, not from the Vercel build
  command. The script itself takes a connection string and a bank path and assumes nothing about its
  host, so where it runs stays a deployment decision rather than a rewrite.
- **Context:** [12-deployment.md](12-deployment.md) §3 has the build command run `db:migrate`, then
  `seed`, then `next build`. Researched against Vercel's documentation before building it, and three
  things came back.
- **Alternatives considered:** keeping the seed in the Vercel build, as doc 12 §3 specifies.
- **Reason:** it rests on two things the documentation does not confirm and one it contradicts.
  (1) With Root Directory set to `app`, whether files outside it are readable is genuinely unclear —
  the monorepo FAQ documents a setting, on by default since 2020, that permits it, while
  *Configuring a Build* states flatly that an app "will not be able to access files outside of that
  directory" and "cannot use `..`". The seed reads `../questions`. (2) Whether the build container
  may reach an external database is documented in neither direction. (3) Worse than both: Vercel
  automatically skips builds for projects a commit did not change, judged by the project's own
  directory — so a commit touching only root-level `questions/**` may deploy nothing at all, leaving
  production serving the previous seed while the repo says otherwise. A CI runner has the whole
  repository checked out, reaching Neon over the internet is ordinary, and it runs on the push
  regardless of what Vercel decides changed.
- **Consequence:** seeding and deploying are no longer one ordered step, so for a short window the
  new code may serve the previous seed. Accepted for a single-user study app. Doc 12 §3 is superseded
  on this point; the workflow itself is not built yet — it belongs with the slice that deploys.
- **Revisit if:** Vercel documents build-container database egress and resolves its own contradiction
  about the root directory, and the ordering guarantee becomes worth having back.

### [2026-09-01] A small integration suite runs against real Postgres
- **Decision:** `app/tests/integration/` runs against the Neon dev branch, seeded, covering attempt
  creation and the selection queries. It is a second Vitest config, separate from the unit run, and
  **skips cleanly** when `DATABASE_URL` is absent.
- **Context:** [11-testing-plan.md](11-testing-plan.md) §4 listed "database queries against real
  Postgres" as deliberately untested, for two reasons: too much CI apparatus for one user, and the
  single Playwright run would exercise the unseen-first `LATERAL` join anyway. That row named the
  accepted risk honestly and said to revisit "the moment that query is edited".
- **Alternatives considered:** holding to doc 11 §4 and leaving the query uncovered until a UI slice
  brings the browser test. Also considered: moving the unseen-first ordering out of SQL into the pure
  layer, which would have collapsed the two seams into one — rejected because doc 04 §5.3 decided the
  opposite deliberately, and overturning an approved schema decision to avoid writing a test is the
  wrong trade.
- **Reason:** both of doc 11's grounds fail here. The slice that wrote the query has no UI, so there
  is no browser run to lean on, and the query is being *written* rather than edited — the moment the
  row said to revisit. Decisively: two of this ticket's acceptance criteria are "practice-mode
  selection never returns a holdout item" and the same for domain mode. Those are assertions about
  query results. No pure function can make them, because the filter is a `WHERE` clause.
- **Consequence:** the apparatus is smaller than doc 11 feared — one config file, a throwaway user
  deleted by cascade, and read-mostly assertions. It found two real bugs on its first run that unit
  tests structurally could not: raw `db.execute` returns unmapped columns, so `started_at` arrived as
  a string and every timed sitting failed at creation; and Drizzle wraps driver errors, so the
  first-attempt race detection was reading a SQLSTATE that was never there — the retry would have
  looked implemented and never fired.
- **Revisit if:** the browser test arrives and genuinely subsumes these assertions, which it will not
  for the holdout filter.

### [2026-09-02] Protecting `main` is a hook, not a permission rule
- **Decision:** pushing moves from `ask` to `allow`, and
  `.claude/hooks/pre-push-main-guard.sh` refuses any push that would update `main`. A second hook,
  `stop-branch-drift.sh`, reports on Stop when `main` falls six or more commits behind `develop`, and
  says nothing otherwise. Ordinary local git — `add`, `commit`, `merge --ff-only`, `switch`,
  `checkout -b` — is allowed.
- **Context:** every push prompted, including routine feature-branch and `develop` pushes, so the
  prompt carried no decision. Meanwhile `main` drifted **ten commits** behind `develop` unnoticed.
- **Alternatives considered:** a narrower permission glob putting only pushes to `main` in `ask`. It
  cannot work — the same push is spelled `git push`, `... origin HEAD`, `... -u origin main` and
  `... --all`, and a prefix pattern cannot see which branch the repository is on. Also considered:
  adding a Stop hook reporting uncommitted and unpushed work — one **already exists** at user scope,
  and its state file showed it had fired on context size and been ignored. Duplicating a hook that
  works would not have fixed a reporting failure.
- **Reason:** the guard is *stricter* than the prompt it replaces — it refuses `main` outright rather
  than asking about every push — while removing prompts that carried no decision. The drift that
  actually happened was invisible to the existing nudge, because `develop` was pushed every time:
  "nothing unpushed" and "production is current" are different claims.
- **Consequence:** `.claude/settings.json` is now **52 allow, 13 ask, 6 deny**, with two hooks.
  `.claude/settings.local.json` emptied again — it had collected four rules from "always allow"
  clicks, two of them throwaway `echo` commands; it refills on its own and is worth checking
  periodically. `CLAUDE.md` gains a **Checkpoints** section, because what failed here was reporting
  rather than tooling.
  **Known limitation, found on the hook's first use:** it cannot distinguish an executed command from
  one merely quoted inside a heredoc, so writing documentation *about* pushing through the shell is
  refused. Heredoc bodies are now stripped before matching, which covers the common shape, but the
  real answer is to write files with the editing tools rather than piping prose through Bash. Tests
  for the guard live in a script file for the same reason — a command containing the string under
  test blocks itself.
- **Revisit if:** a second protected branch appears, or pushes to `develop` start deploying anything.

### [2026-09-02] Connection strings say `sslmode=verify-full`, not the `require` alias
- **Decision:** every Neon connection string in this project — `app/.env.local`, all three Vercel
  environments, and the pooled URL that does not exist yet — carries `sslmode=verify-full`.
  Docs 12 §2 and 03 §9 updated together so the two cannot disagree, and an integration test asserts
  the shape of `DATABASE_URL` rather than trusting the docs.
- **Context:** `pg` emits a warning on every server start (visible in the dev overlay as "1 Issue")
  that `require`, `prefer` and `verify-ca` are currently aliases for `verify-full` and will adopt
  libpq semantics in `pg` v9 / `pg-connection-string` v3.
- **Alternatives considered:** silencing the warning and revisiting at the major bump — rejected
  because the bump is precisely when nobody is looking at TLS; `uselibpqcompat=true&sslmode=require`,
  the library's own other escape hatch, which pins today's *warning-free* behaviour but pins the
  **weak** meaning; and pinning `pg` below v9, which trades a one-word edit for a frozen dependency
  and would have to be undone anyway.
- **Reason:** the failure mode is silent. Read in the installed source: under libpq semantics
  `require` with no `sslrootcert` sets **`rejectUnauthorized = false`** — not weaker certificate
  verification but none. Doc 03 §9 has Dependabot merging patch and minor automatically and majors
  "read first", so the downgrade would arrive with a routine bump, with no warning left to print and
  no test in the repo that would fail. Naming the mode is what survives the bump.
- **Consequence:** provably behaviour-preserving today — measured 2026-09-02 against the dev branch,
  both modes hand `tls.connect` identical options (no `rejectUnauthorized` override, no custom CA, no
  `checkServerIdentity` override) and the chain verifies `YR2 ← Root YR ← ISRG Root X1` with
  `authorized: true`. Neon documents `verify-full` and recommends it; its roots are public
  Let's Encrypt, already in Node's trust store, so **no `sslrootcert` and no bundled certificate**.
  `channel_binding=require` is unrelated and stays. `tests/integration/connection-string.test.ts` is
  the new guard, and it lives in the integration suite because that is the suite that loads
  `.env.local`.
- **Not settled here:** the second, pooled connection string (doc 12 §2.2). It stays a deploy-slice
  decision — nothing reads it until Vercel exists — but §2.1 is now written per-string rather than
  per-variable, so it binds that URL on arrival instead of letting a freshly-pasted dashboard string
  reintroduce `require`.
- **Revisit if:** `pg` v9 ships and its released semantics differ from what its v8 source and warning
  describe — re-read before upgrading, rather than trusting this entry.

### [2026-09-02] At zero the sitting freezes; it does not route anywhere yet
- **Decision:** when the derived clock reaches zero, the countdown holds at `00:00` in the critical
  band, the options, the flag and the `1`–`4` / `F` keys stop accepting input, and a chip states that
  the time has run out. `←` `→` still move, because the paper stays readable. Nothing navigates.
  Alongside it, `GET /api/attempt/:id/state` is built per doc 07 §6 **minus the lazy finalisation
  write**: it reports `expired` and writes nothing.
- **Context:** #22's last acceptance criterion is "reaching zero stops accepting input and **routes to
  the outcome**, rather than counting negative on screen". Submit (#24) and the review (#25) do not
  exist, and #26 — auto-submit and lazy finalisation — is explicitly blocked on both. So the second
  half of that criterion had no destination to name.
- **Alternatives considered:** pulling #24 and #26 forward so zero actually closes the attempt and
  lands somewhere — it would have made the criterion literally true, at the cost of writing the submit
  path outside its own ticket, before the pre-submit review that shapes it, and inventing a screen
  #25 owns. Also considered: showing a "reload to see where this stands" prompt, rejected because it
  tells the reader to do something that currently does nothing.
- **Reason:** the first half of the criterion — stops accepting input, does not count negative — is
  fully met, and it is the half that protects anything. The second half is a destination, and the
  ticket that owns the destination is the one that should build it. Nothing here has to be undone for
  #26 to add it.
- **Consequence:** an expired sitting can be opened, read and navigated indefinitely without being
  finalised, which doc 03 §6 already says is correct — its score is fully determined by its answer
  rows. The guarantee is not the freeze: the **server** refuses every write past the deadline with
  `409 attempt_expired`, verified in the browser on a real expired sitting. The freeze is what stops
  the screen offering an action the server would refuse.
  **`status` therefore has a third value, `expired`**, which doc 07 §6 now documents rather than
  leaving the handler to invent. Neither documented value describes an attempt past its deadline that
  nothing has finalised: `in_progress` would be false and `submitted` would claim a row that was
  never written. It stops being reachable when finalisation lands, rather than changing meaning.
  A second access helper, `openAttemptForRead`, came with the endpoint — session, allowlist and
  ownership, and none of the write path's state checks. Two helpers rather than a flag, because "is
  it still open" is the question the write path exists to ask and the read path exists to answer;
  refusing a resync on the very states it is asking about would leave the client unable to learn that
  its sitting was over.
- **Revisit if:** never — #26 supersedes the freeze by giving it somewhere to go, and adds the
  finalisation write to the same endpoint.

### [2026-09-03] The save chip reads "a write has failed", and sits outside the counts group
- **Decision:** the outbox exposes two numbers — `pending`, every write the server has not confirmed,
  and `retrying`, true once a write has failed and is waiting. **The chip binds to `retrying`;
  submit will bind to `pending`.** The chip is rendered in the sitting bar but **outside
  `.barwide`**, the group the touch layout hides, so it survives at 375px; the bar wraps to a second
  line for it there.
- **Context:** [03-technical-design.md](03-technical-design.md) §7 says to show the chip "while
  outbox non-empty" and to block submit on the same condition.
  [10-screen-specifications.md](10-screen-specifications.md) §4 places it "in the top bar next to the
  counts", and calls the save-failure state "the important one".
- **Alternatives considered:** binding the chip to `pending`, which is doc 03's literal words. It
  works in doc 03's design because the *first* attempt happens outside the queue there, so a write is
  in the outbox only because it failed. This implementation puts every write through the queue —
  which is what stops a retry overwriting a newer click, and what makes one write per
  `questionId:lane` expressible at all — so `pending` also counts the healthy write in the air, and
  the chip would flash "not saved" on every click of an untroubled sitting. Also considered: leaving
  the chip inside `.barwide` beside the counts, exactly as doc 10 draws it.
- **Reason:** `retrying` is what doc 03's sentence *means* once the first attempt moved inside the
  queue; `pending` still means what doc 03 wanted for submit, and blocking submit for the length of
  one in-flight write is the behaviour §7 asks for by name. On the placement: doc 10 hides the counts
  on touch, so "next to the counts" and "visible on a phone" cannot both hold, and a phone is the
  worst screen to be the one that does not hear about a failed save.
- **Consequence:** a divergence from doc 10 §4's arrangement, chosen rather than overlooked, in the
  same spirit as the `.grid60--touch` column count. At 1440 the chip is where doc 10 puts it, between
  the clock and the counts. Recorded here because the #22 freeze set the precedent that a knowing
  divergence belongs in the log rather than only in a comment.
- **Revisit if:** the submit button lands and wants the chip beside it, at which point the bar's
  right-hand end is being redrawn anyway.

### [2026-09-03] Submit shows the score where it was pressed, and does not route
- **Decision:** the submit confirmation becomes the outcome. On a successful submit the same dialog
  replaces its tally and warning with the score — `n/60`, a percentage, pass or fail against the
  mark — and its single onward action is **"Back to the sixteen exams"**, a screen that exists. The
  sitting behind it freezes: input refused, and the countdown held at the reading it had when the
  sitting closed rather than counting down over a paper that is already scored.
- **Context:** #24's acceptance criteria include "the score is shown as a count out of 60 and a
  percentage, with pass or fail against 45", but the review screen that doc 10 hands off to is
  **#25**, and the auto-submit that doc 10 §6 assumes is **#26**.
- **Alternatives considered:** routing to `/attempt/:id/review` and building enough of it to land on
  — it would have meant writing #25's screen inside #24, before the ticket that owns it has been
  read. Also considered: showing the score as a bare chip in the bar and leaving the dialog closed,
  rejected because the one moment a candidate actually wants the number is the moment they pressed
  the button.
- **Reason:** the same precedent the clock's freeze set on 2026-09-02 — when the destination belongs
  to another ticket, do not invent it; make the state honest where it is. Nothing here has to be
  undone for #25 to arrive: it replaces one action's href.
- **Consequence:** a sitting that was **already finalised when the page loads** — a reload after
  submitting, or a second tab — now opens on its outcome rather than presenting as answerable. That
  path was not in the ticket, but #24 is what created the state, and without it the screen shows a
  running clock and an enabled Submit over a sitting the server has already closed.
- **Revisit if:** never — #25 supersedes the action by giving it somewhere better to go.

### [2026-09-03] Submit stays enabled on an expired sitting
- **Decision:** the bar's Submit button is **not** disabled when the clock reaches zero. The server
  records `submit_reason = 'expired'` from the attempt's own deadline whoever pressed it, so the
  distinction PRD E6 needs is made by the clock rather than by the caller.
- **Context:** [10-screen-specifications.md](10-screen-specifications.md) §6 draws the expired state
  with "**Submit exam** is disabled".
- **Alternatives considered:** following doc 10 §6 literally. It presumes its own first sentence —
  *"Your exam was submitted automatically"* — and that automatic submit is **#26**. Disabling the
  button before #26 exists would leave an expired sitting that nobody, including the person sitting
  it, can ever close: doc 03 §6 permits an attempt to sit expired-but-unfinalised indefinitely, and
  until finalisation is built, refusing the only manual route out makes that permanent.
- **Reason:** the button is not offering something the server would refuse — the submit endpoint
  finalises an expired attempt by design (doc 07 §5). It is the *answer* writes that are refused past
  the deadline, and they still are.
- **Consequence:** the dialog reads "Time expired" rather than "Before you submit", its secondary
  action reads "Back to the paper" rather than "Keep working", and the outcome says the ninety
  minutes are up. When #26 lands, an expired sitting is finalised on the next read and this button is
  never reached in that state — the same way doc 07 §6's `expired` status stops being reachable.
- **Revisit if:** #26 lands, at which point doc 10 §6's disabled button becomes correct again because
  its premise is finally true.

### [2026-09-04] The review is a route, and "Incorrect" on it means "did not earn the mark"
- **Decision:** the review is a page at **`/attempt/[id]/review`**, not a state on the sitting. Its
  filter row is doc 10 §8's — Incorrect · Correct · Flagged · All, opening on **Incorrect** — and
  **"Incorrect" claims the blanks as well as the wrong answers**, so `correct + incorrect` always
  sums to the paper. The card still labels a blank *not answered*.
- **Context:** #24 left the outcome inside the submit dialog with one action reading "Back to the
  sixteen exams", and the log entry of 2026-09-03 said #25 would replace that action. #25's first
  acceptance criterion is "every question of the sitting appears, in the paper's order"; doc 10 §8's
  is "default filter is Incorrect. Nobody opens this to admire the ones they got right."
- **Alternatives considered:** the review as a state on `/attempt/[id]`, which would have satisfied
  "reachable again later" only by re-entering the sitting, given #26 nowhere to land an
  auto-submitted attempt, and made the review unlinkable. Defaulting the filter to **All**, which
  reads the criterion literally at the cost of making the common question — what did I miss? — one
  click of work. Leaving blanks out of Incorrect, so the chip's arithmetic matched its word.
- **Reason:** a URL is what "reachable again later" means, and doc 03 §4 already named the path. On
  the filter: a blank cost exactly what a wrong answer cost — the submit statement counts
  `WHERE a.is_correct`, which counts neither `false` nor `null` — so excluding blanks would hide
  misses from the default view of the screen that exists to show misses, and would leave
  `correct + incorrect < 60` with nothing on screen explaining the gap. The grouping and the label
  answer different questions, so they are allowed to differ.
- **Consequence:** the submit dialog now offers **two** actions, "See the full review" beside the
  retained "Back to the sixteen exams", rather than swapping the one. The exam list grew a **Review**
  link per sat paper (`lastReviewableAttemptId`), because a finished sitting was otherwise
  unreachable from any screen once it stopped being the open one — "reachable again later" would
  have been true only by bookmark.
- **Revisit if:** practice and domain mode arrive, which review unscored sittings and cannot use a
  pass mark, a verdict chip or this filter row unchanged.

### [2026-09-04] What doc 10 §8 asks for that the data cannot answer
- **Decision:** four elements of doc 10 §8 are **not** built, and none is deferred pending effort —
  each is missing an input. The **"Why this is the answer"** sunken panel is dropped and the concept
  id moves into the card head; **Slowest question** is dropped from the result-card stats; the
  **study-guide** and **Drill this competency** links are dropped; **Retake in practice mode** is
  dropped. The **rail** is still dropped whole on a touch layout, as §8 says, but its Score / Needed
  / Gap do **not** move into the result card.
- **Alternatives considered:** keeping the sunken panel with only the concept id in it, or repeating
  the correct option's `why` inside it as the "main rationale". Adding a per-question timing column
  to make Slowest question computable.
- **Reason:** the bank has no rationale field separate from the per-option `why`, and that text is
  already shown in the correct option's own row — repeating it would print the same paragraph twice
  per card, sixty times, on the screen the ticket calls the longest reading in the product. A panel
  headed "Why this is the answer" containing one mono id is a heading that lies, and renaming it
  invents a component doc 05 does not have. The study guide stays outside the app by standing
  decision and drills are not in the app's v1, so both links would point nowhere. Practice mode is
  outside feature 3. **Slowest question has no data at all**: `answer.answered_at` is set once, on
  the first answer, and deliberately not advanced when the answer changes, because
  least-recently-seen selection reads it — so nothing records how long a question took, and adding a
  column for one stat is a schema change belonging to whoever wants it. On the rail: nothing needs to
  move, because the big numeral **is** the score, the pass bar is labelled `Pass · 45` — which is
  Needed — and the verdict chip states the gap in words ("4 short of the pass mark").
- **Consequence:** two further measured divergences, recorded rather than left in a comment. **Time
  used is capped at the sitting's own limit**: an expired sitting is finalised whenever somebody next
  presses the button, so `submitted_at - started_at` measures the gap until they came back — observed
  at **25:01:20** on a ninety-minute paper before the cap. And **doc 10 §8's claim that the prose
  measure is "naturally ~40ch" on a phone is wrong about its own artboard**: `ReviewPhone.part` keeps
  the 28px key column and `--space-4` padding inside a `--space-4` card inside a `--space-4` page,
  which leaves about 27ch at 390px. Measured here at 375px, after dropping the option row's side
  padding one step on the scale: about 26ch. Doc 05 §3 forbids shrinking prose to fit, so the layout
  gave way as far as the scale allows and the artboard's anatomy was kept.
- **Revisit if:** a per-question timing column is ever added for another reason, or the study guide
  is linked per concept — the log's 2026-08-28 entry names that as the first thing to reconsider.

### [2026-09-04] Lazy finalisation happens on four touches, and resume position is derived
- **Decision:** an expired sitting is closed by **whichever read reaches it first** — opening
  `/attempt/[id]`, opening its review, a resync through `GET /api/attempt/:id/state`, or **listing the
  sixteen papers**. All four go through one helper, `src/lib/auto-submit.ts`, which calls
  `submitAttempt` — the same conditional `UPDATE` a manual submit uses, with the score counted inside
  the statement. With the tab open, the countdown reaching zero submits the sitting itself and the
  dialog becomes doc 10 §6's screen. **Resume position is derived from the answers** —
  `resumeSeq` opens on the question whose row was written most recently — rather than stored in a
  column.
- **Context:** doc 03 §6 says an expired attempt is finalised "the next time it is touched — opened,
  answered against, or listed", and doc 07 §6 says the resync is where "90 minutes elapsed while the
  tab was closed" is implemented. Both were written before there was a submit path to reuse. PRD E5
  additionally wants position restored, and #21 left that outstanding because there was nowhere to
  put it.
- **Alternatives considered.** *For finalisation:* leaving the exam list out, so only opening a
  sitting closes it — rejected because an abandoned sitting would go on offering to be resumed on the
  list, and its first-attempt score would go on reading as absent, on the one screen that exists to
  show the honest number. Also considered finalising in the **answer** write path, which doc 03 §6's
  wording includes: rejected as reachable only through a client that resyncs anyway, and it would
  turn a refusal into a refusal-plus-a-write for no visible gain. *For position:* a `resume_seq`
  column with a `PUT` on every arrow press — exact, and it restores a question you looked at without
  answering, which the derived version cannot. Rejected for a migration on the table holding the
  first-attempt scores, a seventh route handler, and a write on the hot path recording something
  whose loss costs nothing. Also considered `localStorage`, rejected because it is per-browser and
  doc 03 §5 keeps the theme as the only client state that outlives a page load.
- **Reason:** one helper over one statement means the score, the reason and the first-attempt flag
  cannot be decided two ways. On position: `answer.updated_at` already moves on every answer *and*
  every flag, so the record of attention exists and is written anyway — a second write would be a
  second thing to keep in step with it. The named limit is that a question looked at and left blank
  leaves no row, so walking forward without answering and reloading returns to the last question
  actually touched.
- **Consequence:** three earlier entries are superseded, each exactly as it said it would be.
  **The clock's freeze (2026-09-02)** gains its destination — at zero the sitting submits itself,
  and the dialog reports it. **Submit enabled on an expired sitting (2026-09-03)** is reversed: doc
  10 §6's disabled button is correct again, because its premise — that the sitting was submitted
  automatically — is finally true, and the retry after a failed auto-submit lives in the dialog
  rather than in the bar. **Doc 07 §6's `expired` status is gone rather than changed**: the read
  that would have returned it now closes the attempt first. On the same reasoning the expired dialog
  drops its jump rows and its cancel — doc 10 §6 says there is no way out, and a jump would close
  the dialog holding the only retry. The review page no longer bounces an unfinalised sitting back
  to the paper unless its clock is genuinely still running.
- **Three divergences from doc 10 §6, recorded rather than left in a comment.** The outcome carries
  the blanks panel but **not** the four-cell tally: the score line and the panel already state what
  it cost, and "Time used" would need the sitting's limit threaded into a dialog that has no other
  use for it. The panel **lists at most 24 blank numbers** before saying how many more — a sitting
  nobody was present for is sixty blanks, and sixty numerals is a wall rather than a reading; the
  heading states the count, and the list is the detail. And the outcome keeps **two** actions where
  §6 says one: "See the full review" beside "Back to the sixteen exams". §6's reason for forbidding
  a second action is that it already happened and offering a way *out* would be a lie — neither of
  these is a way out, both are onward, and dropping the second would make the expired outcome the
  one screen in the app from which the exam list is two clicks away.
- **And one from doc 03 §7, which is a behaviour rather than a layout.** §7 blocks submit "while
  outbox non-empty", and an **automatic** submit does not wait. Past the deadline every owed write
  is one the server now refuses with `attempt_expired`, so waiting would hold the sitting open for
  answers that can never land — and would make a sitting whose last write failed permanently
  unclosable by its own clock. Before the deadline the wait is exactly right and is untouched: it is
  still what the button blocks on.
- **The sweep is one statement per sitting, not one transaction.** Two expired sittings are two
  independent finalisations; wrapping them together would mean a failure on the second undoing the
  first, which is worse than closing one of the two.
- **Revisit if:** a per-question timing column is ever added (it would make "Time used" and doc 10
  §8's *Slowest question* free), or resume-to-an-unanswered-question turns out to matter in use — at
  which point the column is the answer and this entry is the argument against it to re-read.

### [2026-09-04] A sitting already in progress is returned, not refused
- **Decision:** `POST /api/attempt` for a paper with an unfinished sitting returns
  **`200 {attemptId, resumed: true}`** carrying that sitting, rather than doc 07 §2's
  `409 attempt_in_progress`. Doc 07 §2 is corrected to match the code. Alongside it, **the review
  gains a re-sit action** (PRD E7) whose label is read from the query — `getReviewContext` grew an
  `openAttemptId` subquery — so the screen says "Resume the open sitting" or "Sit this paper again"
  before the press rather than discovering which it was afterwards.
- **Context:** the behaviour shipped with #19 and went unremarked because the exam list was its only
  caller, and the list never offers to start a sitting while one is open — it renders **Resume**
  instead. #27 adds the review as a second caller, so the two had to agree about what the endpoint
  does.
- **Alternatives considered:** changing the code to the documented `409`, which is more precise about
  what was refused — rejected because it makes every caller unpack an error body to find a perfectly
  good attempt, and `StartExamButton`'s `!response.ok` branch would need a special case for the one
  failure that is not a failure. Also considered leaving the review with no re-sit action, which
  contradicts the ticket's first criterion outright; and rendering an unconditional "Sit this paper
  again" and letting the server resolve it, which is one fewer subquery at the cost of a button that
  silently resumes a forty-minute-old sitting while claiming to start a fresh one.
- **Reason:** doc 07 §5 already settles this exact shape one endpoint later — a double submit is
  answered with the first submit's score, not a conflict, because "the honest reading of *no-op* is
  that the user sees their score". *Start a sitting of exam-07* is likewise already satisfied by the
  sitting of exam-07 that exists. On the label: the endpoint's guard is what makes two live sittings
  of one paper impossible, and it holds regardless of what the screen believed — but its answer
  arrives after the click, and the word on the button has to be true before it.
- **Consequence:** the check now sits behind two screens that both label it from their own read, and
  neither read is what enforces it. Nothing about the first-attempt flag is touched on this path: it
  was settled when the earliest attempt was *created* (doc 04 §5.2), so best score moves on a re-sit
  and the honest number does not — asserted at both seams, in `tests/integration/exams.test.ts` for
  the list and `tests/integration/review.test.ts` for the review.
- **Revisit if:** practice, domain or holdout sittings become startable, at which point
  `409 holdout_already_sat` is a genuine refusal — the holdout is one-shot, so there is no existing
  sitting to hand back and the caller is asking for something it cannot have.

### [2026-09-06] The browser run signs in by inserting a session row, and mints its own cookie
- **Decision:** `app/tests/e2e/` runs against the **same `DATABASE_URL`** the integration suite
  uses, under its own `e2e-` user prefix, and signs in by inserting a `session` row and handing the
  browser the cookie that row implies. The cookie's **name** comes from the library
  (`getCookies(...).sessionToken.name`); its **value** — `token.base64(HMAC-SHA-256(token, secret))`,
  URI-encoded — is reproduced with `node:crypto`, because `better-call`'s own signer is not in that
  package's exports map. Time travel is an `UPDATE` to `started_at`; there are no fake timers and
  nothing waits out a clock.
- **Alternatives considered.** *For the database:* a Neon branch created and dropped per run
  (strongest isolation, at the cost of an API token in CI, a full seed on every browser run, and a
  branch that leaks when the run is killed) and a local ephemeral Postgres (a second engine to keep
  in step with the schema, and the only place in this repo not testing against real Neon). Both
  contradict doc 11 §5, which already orders `seed && test:integration` then `build && test:e2e`
  against one branch. *For signing in:* the committed version of the throwaway route used by hand
  while #26 was being built — nothing reproduced, but an **auth-bypass endpoint in shipped code**,
  gated by an environment variable, in an app whose whole security posture is that an allowlist is
  the only thing between it and a public one. Also considered reaching into `auth.$context`'s
  internal adapter, which needs no reproduction and no shipped route but pulls the Next-flavoured
  auth config into a plain Node process and depends on undocumented internals.
- **Reason:** sessions are database-backed (doc 08 §2), so a row plus its cookie **is** a session by
  every definition the app uses — there is nothing simulated about it. Driving Google would make the
  most important test in the repo also the flakiest and would make it depend on a third party being
  up. The one reproduced fact is bounded rather than trusted: if Better Auth ever changes the cookie
  format, the run's first navigation lands on `/sign-in` and its first assertion fails loudly, at
  the one place in the repo that would notice.
- **Consequence:** a distinct prefix per suite, because doc 11 §5 runs both against one database and
  each cleans up by deleting every user carrying its prefix — a shared prefix would let either
  teardown cut the other's rows out from under it. And the cost is named where it will be read:
  `app/tests/manual-checklist.md` §0 states plainly that **the OAuth callback and the allowlist hook
  have no automated coverage in any suite**, and §1 is the allowlist check, first, requiring SQL
  proof that no `user`, `account` or `session` row was created — inferring it from the screen is a
  different assertion, and a hook that wrote the row before rendering the refusal would look
  identical from the browser.
- **Revisit if:** Better Auth publishes its cookie signer, at which point the reproduction goes.

### [2026-09-06] `src/auth.ts` names its `baseURL`, so the cookie prefix follows the origin
- **Decision:** `baseURL: process.env.BETTER_AUTH_URL` is passed to `betterAuth()`. It was never set
  before.
- **Context:** found while writing the browser run, in the installed source rather than by guess.
  Better Auth decides the session cookie's `__Secure-` prefix from `options.baseURL` — https gets
  it, http does not — and **falls back to `NODE_ENV === 'production'` when the option is absent**
  (`cookies/index.mjs`, `isProduction` from `@better-auth/core/env`). Under `next start` that names
  the cookie `__Secure-better-auth.session_token` with `secure: true`, which no browser accepts over
  plain http — so a minted session could not be set at all.
- **Alternatives considered:** running the browser test against `next dev`, which sidesteps it with
  no production change but reverses doc 11 §5's `build && test:e2e` and leaves the one browser test
  in the repo unable to see anything the App Router does differently when built. And an explicit
  `advanced: { useSecureCookies: process.env.E2E !== '1' }`, which is narrow and obvious at the call
  site but puts a test flag into the file that decides who may sign in, where a mis-set variable in
  production silently drops `Secure` from the session cookie.
- **Reason:** this is the documented option and doc 12 §2 already makes `BETTER_AUTH_URL` the
  canonical origin, so naming it is configuration rather than a workaround. Deciding a cookie's
  security attribute from the scheme it will actually be served over is also simply more correct
  than deciding it from a build flag.
- **Consequence:** measured, not assumed. Production is unchanged — its `BETTER_AUTH_URL` is https,
  so the prefix is still applied. Local dev is unchanged: verified against the running dev server on
  2026-09-06, the cookie name is still `better-auth.session_token` and a session minted under it is
  accepted, `GET /exams` → `200`. The only behaviour that moved is the case that was broken. It also
  settles the library's standing "Base URL is not set" warning, which is the same omission seen from
  the other side.
- **Revisit if:** never — the option is what the library asks for.

### [2026-09-06] The browser run leaves the sitting before it moves the clock
- **Decision:** the run navigates the resumed page to `/exams` before closing its context, and then
  **asserts the sitting is still unfinalised** before opening it again.
- **Context:** the run failed twice, and the diagnosis is worth keeping because it is a genuine
  property of the system rather than a test artefact. Closing a context makes the sitting fire its
  `visibilitychange` resync; `GET /api/attempt/:id/state` **finalises an expired sitting** (doc 07
  §6); and Node does not abandon a request handler because the client went away. So that request was
  still being served when the `UPDATE` landed, and the **resync** closed the sitting — measured at
  ~110ms after the write — rather than the page read the test exists to check. The row was correct
  either way; what was wrong was which of the four touches did it, and the page's redirect to review
  fires only for the read that closed it.
- **Alternatives considered:** dropping the redirect assertion and checking only that the row ends
  up `expired` — it passes under either touch, and gives up PRD E5's "go straight to review", which
  is the arrival the ticket names. Also considered leaving the resumed page open and firing the
  resync deliberately, which is deterministic in the opposite direction: the resync then always
  wins, and the page read is never the closing touch.
- **Reason:** navigating away unmounts the sitting, whose cleanup removes those listeners, so the
  resync is never issued at all — and `goto` is awaited, so the one request that navigation does make
  has been served before the clock moves. A one-second drain was written first and then replaced:
  it made the race *unlikely* rather than impossible, and the ticket asks for **no waiting**. It is
  also what a candidate would actually do — go back to the list.
- **Consequence:** the guard stays regardless. If anything ever touches the sitting in that window
  again, the run fails on a one-line assertion that says so, rather than on a redirect assertion
  three steps later that would read as a broken redirect.
- **Revisit if:** the resync stops finalising, which would only happen if lazy finalisation moved —
  and doc 03 §6 has it on four reads deliberately.

---

*The five entries below were settled while speccing feature 4 (#30) and are recorded before their
implementation, on the 2026-08-29 precedent — a product decision belongs in the log when it is taken,
not when it compiles. Each names the ticket that carries it out.*

### [2026-09-06] A composed sitting is frozen in `attempt_question`
- **Decision:** a new table, `attempt_question (attempt_id, seq, question_id)`, PK `(attempt_id, seq)`,
  unique on `(attempt_id, question_id)`, `question_id → question.id ON DELETE RESTRICT`. Written in
  the same transaction as the attempt insert, for practice and domain sittings. **Exam sittings get no
  rows in it** — their paper is already stored once, in `exam_item`. Ticket #31.
- **Context:** exam mode reads its paper from `exam_item`; practice and domain sittings are composed
  at start and today exist only in memory. `answer` rows record what was **answered**, not what was
  **asked**, so a reload has nothing to rebuild the set from.
- **Alternatives considered:** recomposing on read, with `random()` replaced by a tiebreak seeded on
  the attempt id — it does not work and cannot be made to, because `domainCandidates` orders by
  `max(answered_at) NULLS FIRST` and answering question 1 changes the ordering the recomposition would
  read; freezing seen-ness too is the same storage problem one level down. Also considered an ordered
  `question_ids text[]` on `attempt`: one migration column and no join, but it stores foreign keys
  Postgres cannot enforce, so a renamed bank id would silently orphan inside the array instead of
  failing loudly the way `answer.question_id`'s RESTRICT does — which is the guarantee doc 03 §3 is
  built on. Also considered giving exam attempts rows too, for one uniform path: it stores a known
  constant sixty times per sitting and gives a paper's order two places it can be read from.
- **Reason:** mirroring `exam_item` means the paper query for these modes has the same shape as the
  exam one, and `question_not_in_attempt` (doc 03 §9, doc 07 §3) becomes checkable in SQL rather than
  re-derived from a composition nobody kept.
- **Consequence:** this creates the third table doc 04 §5.3 declined as "not worth it for one user".
  That note was right for the reason it did not give: exam mode had `exam_item`, and the unfixed modes
  did not exist yet. Doc 04 gains an eleventh table and §5.3 is corrected when #31 lands. The seed is
  untouched — it never writes user tables.
- **Revisit if:** never, while practice and domain sittings are resumable.

### [2026-09-06] A practice sitting is 20, 40 or 60, defaulting to 20 — PRD §7 assumption 2 closed
- **Decision:** three pinned quota tables — 20 → 6/4/3/3/2/2, 40 → 12/7/6/6/5/4, 60 → the existing
  18/11/10/8/7/6 — each summing exactly, asserted in a test rather than computed at runtime. Default
  **20**. Ticket #32.
- **Context:** PRD §7 assumption 2 called this "the same one-line change" that resolved assumption 1.
  It is not. `WEIGHTED_QUOTA` is a hand-pinned table for 60 exactly, and its own comment records why:
  the published percentages do not divide 60 evenly (18% of 60 is 10.8), so rounding each independently
  gives 61, and which domain absorbs the remainder is a decision rather than an arithmetic accident.
  A shorter sitting needs the same decision taken again, twice.
- **Alternatives considered:** fixed 60 as assumed — no new arithmetic and no selector, and practice
  is then exactly exam mode's shape without the clock, which is the clearest thing it can be; rejected
  because it is the sitting that does not get done on a weeknight, which was the owner's own stated
  reason for choosing this feature over the alternatives. Also considered fixed 20, which removes the
  full-length untimed rehearsal — the one sitting shape that is exam mode minus the pressure.
- **Reason:** the same reasoning that set domain mode's default on 2026-08-29. 20 is roughly a
  15-minute sitting; 60 stays available for the rehearsal before the retake.
- **Consequence:** PRD §7 assumption 2 struck through. **Both open assumptions are now resolved.**
  `composeWeightedSitting` takes its quota table as an argument; the 60 behaviour is unchanged and its
  existing assertions must still pass untouched.
- **Revisit if:** completion data shows 20 is routinely abandoned or routinely too short — the same
  trigger assumption 1 carries.

### [2026-09-06] Practice and domain are strictly forward, and cannot flag
- **Decision:** **Next only.** No Previous, no tile jumps, and an answer cannot be changed once
  graded. The rail is the same `NavigatorTile` component in graded states, reporting progress and not
  clickable. `PUT /api/attempt/:id/flag` returns `409 flagging_not_available`, exactly as doc 07 §4
  already specifies. Tickets #35 and #36.
- **Context:** PRD §2's table says "No — forward only" and its P1/D1 acceptance criteria say nothing
  about navigation, so the precise rule was undecided. **Doc 10 §7 contradicts it on two counts** — it
  draws a **Previous** button and a **Flag for review** control.
- **Alternatives considered:** forward to answer, free to re-read — you could move back over questions
  already answered but not change them; closer to the board, at the cost of a fourth navigation model
  (exam free, this half-free, the review a filtered list) and a new reachability rule to state and
  test. Also considered following doc 10 §7 literally and amending PRD §2: fewest components, since it
  is exam mode's navigator with grading added, but it reopens a Phase-1 product decision to match a
  prototype whose own scores and stats are invented sample data, and "commit to an answer" is the one
  thing separating practice from reading the bank.
- **Reason:** the board is Phase-2 work that predates the rule, so the board is corrected rather than
  the PRD. Flagging follows rather than being decided separately: a flag is a mark to come back to,
  and strictly-forward means there is no coming back. Re-reading is served by the review, which is a
  route.
- **Consequence:** doc 10 §7 loses **Previous** and **Flag for review**, and doc 10's cross-screen
  rule 2 ("flag state persists across modes and is orthogonal to answered state") is **narrowed** to
  what it can mean — a flag written in exam mode persists on its answer row, and no mode without free
  navigation can create one. Resume position in these modes is the first unanswered question in `seq`
  order, which is exact, unlike exam mode's derivation from `answer.updated_at`, because a question
  cannot be passed without answering it. That closes the named limit of the 2026-09-04 entry for these
  two modes only.
- **Revisit if:** the holdout sitting (H1) reuses this screen — it will not; H1 is timed and scored
  like exam mode, so it takes exam mode's navigator.

### [2026-09-06] The unscored review shows counts, never a score, and does not claim its blanks
- **Decision:** `/attempt/[id]/review` branches on mode. Dropped for unscored sittings: the big
  numeral, the pass bar, the pass mark, the verdict chip, the first-attempt standing line, Time used,
  the re-sit action. Kept: every question the sitting asked, in `seq` order, with the `why` for all
  four options. The screen opens with a plain `14 correct · 3 incorrect · 3 not reached` — no
  percentage, no pass mark, no delta. **`attempt.score` stays null.** The filter row is Incorrect ·
  Correct · **Not reached** · All, and **Incorrect does not claim the blanks.** Tickets #37 and #38.
- **Context:** the 2026-09-04 entry named this slice as its own revisit trigger — the review's pass
  mark, verdict chip and Incorrect/Correct/Flagged/All row cannot be used unchanged for a sitting that
  is not measured and has no flags. Separately, PRD P1 says "No score at the end — this mode is not
  measured", while doc 10 §7 puts a running correct/incorrect chip pair in the top bar.
- **Alternatives considered:** no counts anywhere, the strictest reading of PRD P1 — rejected because
  you watched every one of those verdicts appear one at a time, so the sum is already known and
  withholding it reads as coyness rather than principle. Also considered running chips with a silent
  ending, which keeps "at the end" literal at the cost of the bar's last number being the number the
  review declines to repeat, one scroll position apart. Also considered no review route at all, which
  makes the wrong-option `why` text — the content the whole bank was written for — unreachable after
  one showing.
- **Reason:** what PRD P1 forbids is a *measurement*, and doc 04 §5.1's
  `CHECK (score IS NULL OR mode IN ('exam','holdout'))` is what enforces that: the count can never
  reach the exam list, a best-score comparison or a first-attempt flag. A sum of verdicts is not a
  measurement. On the blanks: the 2026-09-04 rule exists because a blank on an exam cost exactly what
  a wrong answer cost — the submit statement counts `WHERE a.is_correct`, which counts neither `false`
  nor `null` — so excluding blanks would have hidden misses from the default view. Here nothing costs
  anything, and a question you never reached is not a question you got wrong.
- **Consequence:** the reversal is **mode-local**; the exam review is untouched and its existing tests
  must still pass unchanged. A question the sitting asked but never reached — Save and exit at question
  7 of 20 — renders as the dashed *not answered* card **with its explanations shown**: there is no key
  to protect in an unscored sitting that is already over. `submit_reason` is always `user` in these
  modes; `expired` is unreachable without a clock.
- **Revisit if:** the holdout sitting lands, which is scored and takes the exam shape unchanged.

### [2026-09-06] Doc 10 §3's setup screen loses four elements
- **Decision:** `/domain` builds doc 10 §3's 3×2 grid — domain name, weight chip, competency tags,
  "X of Y seen", "Last practised …" — plus the 20/40/All control and Start. `/practice` reuses the
  length control at 20/40/60 with no grid. Home becomes doc 03 §4's "three modes + holdout", with the
  holdout card **disabled** and naming what H1 is for. Ticket #34. **Cut:** both *Draw from*
  checkboxes, the "Recent:" chip row, and the per-domain mastery meter.
- **Context:** the same shape as the 2026-09-04 entry about doc 10 §8 — elements the data or the
  standing constraints will not support, each missing an input rather than deferred for effort.
- **Reason, one per cut.** *Previously missed* selects what to serve by past performance, which
  CONTEXT.md rules out by name: "If a proposal starts using past performance to decide *what* to
  serve, it is out of scope." *Unseen questions* is a no-op — the `LATERAL` ordering already exhausts
  unseen before repeating anything (P3), so the checkbox would offer to turn on what cannot be turned
  off. The "Recent:" row is specified as carrying *scores*, and there are none; without them it is a
  list of dates. And the **mastery meter** is the readiness signal the 2026-08-28 decision declined to
  build — "no readiness threshold, dashboard, or gating in the app". Coverage is a fact about what you
  have done; mastery is a judgement about how well. "X of Y seen" stays; the meter goes.
- **Alternatives considered:** keeping the mastery meter, which is computable from `answer.is_correct`
  and is arguably the most useful thing on a screen whose job is choosing where you are weak — it was
  put to the owner as its own option and declined. Also considered no setup screens at all, starting
  from home: fastest path to a sitting, but it drops the one screen that helps choose a domain on
  evidence.
- **Consequence:** doc 10 §3 is corrected when #34 lands. The empty state PRD §4 requires is
  unaffected — a domain never practised reads "0 of N seen" and "not started".
- **Revisit if:** the study guide is ever linked per concept, which the 2026-08-28 entry names as the
  first thing to reconsider — a competency-level coverage view would then have somewhere to point.

### [2026-09-06] A composed sitting is started by one function, and `question_count` is what it froze
- **Decision:** `createAttempt` takes an **executor** rather than the handle — the same
  `Pick<Db, 'execute'>` `freezeAttemptQuestions` already took — and one new function beside it,
  `startComposedSitting`, opens the transaction and calls both. `question_count` is
  `questionIds.length`, always, never the length that was asked for. A composition of **zero**
  throws before the transaction opens, surfacing as `500 internal_error` with no attempt row
  written. Ticket #33.
- **Context:** #31 built `freezeAttemptQuestions` to take an executor specifically so this ticket
  could join the two inserts; what was undecided was where the transaction goes and what
  `question_count` means when the pool cannot fill the request.
- **Alternatives considered.** *For the seam:* leaving `createAttempt` on `Db` and writing a second
  transactional insert for composed modes — the exam path stays untouched, at the cost of a second
  place the attempt `INSERT`, its six check constraints and the `started_at` normalisation are
  written, kept in step by hand. Also considered opening the transaction in the route handler, which
  puts a transaction boundary in a file whose job is parsing a body and choosing a status code, and
  which #34's setup screens would have to repeat. *For zero:* a 4xx refusal, which needs an error
  code doc 07 §1's table does not have and tells the candidate their request was wrong when the bank
  is; and letting it through, which stores an attempt with `question_count` 0 and surfaces later as
  an empty sitting screen rather than at the point the set was composed.
- **Reason:** one attempt `INSERT` for all four modes is what keeps the check constraints and the
  first-attempt claim from having two expressions. On the count: the two numbers differ whenever a
  pool cannot fill a request — a domain sitting of `all` is *defined* that way — and a column that
  disagreed with its rows would break the assumption the navigator rests on, that a sitting's
  positions run 0…n-1. Deriving it means the column records what was written down rather than what
  was hoped for.
- **Consequence:** the executor is safe only because **the first-attempt retry is exam-only**. A
  unique violation aborts the transaction it happened in, so a retry inside one would run against a
  transaction Postgres has already refused; only exam mode claims the flag, only exam mode can hit
  that index, and an exam sitting is created on its own because its paper is `exam_item`. Named in
  the function's own comment, because a future mode that both claims the flag and freezes questions
  would have to move the retry out. Verified rather than assumed: with the transaction removed, the
  rollback test fails with an orphan attempt row (11 attempts where 10 were expected), which is the
  row a screen would find and be unable to render.
- **Revisit if:** a mode arrives that both claims a first-attempt flag and composes its own
  questions — the holdout does not, since it is sat once and has no paper to be first at.

### [2026-09-06] The push guard on `main` is removed
- **Decision:** `.claude/hooks/pre-push-main-guard.sh` is deleted and unregistered. Pushing `main`
  is ordinary work, like every other push. `stop-branch-drift.sh` stays — it reports on Stop when
  `main` falls six or more commits behind `develop`, and reporting was never the problem.
  **This supersedes the tracker half of the [2026-09-02] entry "Protecting `main` is a hook, not a
  permission rule".** That entry stands as written; the log is append-only.
- **Context:** the owner asks for the commit, the merge and the push as one request, every time. A
  guard making `main` the single branch an agent could not move meant that request could never be
  carried out — the agent did five sixths of it and handed back a command to paste.
- **And it did not work.** Found the same day, by tripping it: the guard's *"an explicit branch was
  named"* escape is `*" origin "*[a-z]*`, which any lowercase letter **anywhere after `" origin "`**
  satisfies — including in a pipe or a redirect. `git push origin HEAD` from `main` is refused;
  `git push origin HEAD 2>&1 | tail -12` is allowed. It blocked the spelling a person types and
  permitted the spelling an agent types, which is the exact inversion of what it was for. `main` was
  pushed through that hole on 2026-09-06 — with the owner's explicit go-ahead, so nothing was lost.
- **Alternatives considered:** fixing the pattern and keeping the guard — it restores a refusal the
  owner does not want, so the reward for the repair is more friction. Also considered leaving the
  file registered but neutered, rejected because a hook that guards nothing is worse than no hook: it
  reads as protection in `settings.json` and in `CLAUDE.md`, and the next person to trust it would be
  trusting a comment.
- **Consequence:** `.claude/settings.json` loses its `Bash` `PreToolUse` entry and keeps the
  `Edit|Write|NotebookEdit` branch guard and the Stop hook. Two standing claims are corrected rather
  than left to rot — `CLAUDE.md`'s Checkpoints section said `main` "needs asking", and
  `docs/00-status.md` said "only the owner can move it". Both said so in the present tense about a
  hook that no longer exists, and a stale safety claim is worse than none.
- **The thing this gives up, stated plainly:** doc 12 §3 makes a push to `main` a **production
  deploy** once Vercel is connected. Today nothing is connected, so it deploys nothing, which is why
  removing it now costs nothing. **The deploy slice inherits the question** of whether a production
  push wants a prompt back — recorded in `docs/00-status.md` beside the three findings already
  carried for that slice, not left to be rediscovered.
- **Revisit if:** Vercel is connected — at which point "push `main`" and "ship to production" become
  the same action, and this is the entry to re-read before deciding they need no ceremony.

### [2026-09-06] Doc 10 §3 loses four elements, and "seen" means answered
- **Decision:** `/domain` builds doc 10 §3's grid and setup strip **without** both *Draw from*
  checkboxes, the "Recent:" chip row and the per-domain mastery meter. `/practice` reuses the length
  control at 20/40/60 with no grid. Home becomes doc 03 §4's three modes plus a **disabled** holdout
  card. **"X of Y seen" counts questions with a non-null `answered_at`**, not questions with an
  answer row. Ticket #34. *This is the entry the 2026-09-06 spec decision "Doc 10 §3's setup screen
  loses four elements" said its ticket would carry; it records what building it settled as well.*
- **Reason for the four cuts, one each.** *Previously missed* selects what to serve by past
  performance, which `CONTEXT.md` rules out by name. *Unseen questions* is a no-op — the `LATERAL`
  ordering already exhausts unseen before repeating anything (P3), so the checkbox offers to turn on
  what cannot be turned off. The "Recent:" row is specified as carrying **scores**, and these modes
  have none; without them it is a list of dates. And the **mastery meter** is the readiness signal
  the 2026-08-28 decision declined — coverage is a fact about what you have done, mastery a
  judgement about how well. Worth recording about the last one: the artboard's meter is *fed the
  coverage percentage*, so beside "X of Y seen" it was already drawing the same fact twice.
- **On "seen", which the ticket left loose.** #34's wording is "distinct questions in that domain
  with an answer row for this user". That is not what selection means by it: `domainCandidates`
  orders by `max(answered_at) NULLS FIRST`, and doc 04 §6 says a flagged-but-unanswered question
  stays **unseen** "because the candidate never engaged with it". Counting the row would put a
  different fact on the screen under the same word, and the only symptom would be a coverage number
  that never quite matches what gets served. The looser reading was taken as loose rather than
  decided.
- **Alternatives considered.** Keeping the mastery meter — computable from `answer.is_correct`, and
  arguably the most useful thing on a screen whose job is choosing where you are weak; put to the
  owner as its own option while speccing and declined. Also considered no setup screens at all,
  starting straight from home: the fastest path to a sitting, but it drops the one screen that helps
  choose a domain on evidence.
- **Where the two counts live: a new `src/db/queries/domains.ts`, not `selection.ts`.** Grilled and
  chosen over adding a function to `selection.ts`, which would have kept every read that joins
  `answer × attempt × question.domain` in one file. `selection.ts`'s own header pins its remit —
  "the database answers which questions are eligible, and in what order" — and nothing in these two
  reads chooses anything; they report history so a person can choose. Separate files are the
  cheapest guard against the next reader wiring one into the other, which is exactly what
  `CONTEXT.md` forbids. It also mirrors what already exists: `exams.ts` is the screen read for the
  sixteen, and this is the screen read for the six.
- **The domain's name and its competency tags are read from the bank, not typed into the app.**
  `question.competency` is `"Security Fundamentals :: Compliance"`, so both halves are already
  seeded; `split_part` gives the card its heading and its tags, and a label map that could drift
  from the content never exists. `weightPercent` stays in the pure layer, because the published
  percentage is a fact about the exam rather than about the bank.
- **One bug the browser found that no test had.** The availability chip read **963** against a
  measured pool of 960. The coverage query left-joins `answer`, which multiplies a question by its
  answer rows, so a bare `count(*)` counted a question once per sitting that asked it — inflating
  the pool **for exactly the candidate who has done the most work**, and advertising a sitting the
  composer would not produce. `count(DISTINCT q.id)` fixes it. The integration test that would have
  caught it only ran against an account with no history; there is now one that runs against an
  account with repeats, and it was verified by removing the `DISTINCT` and watching it fail.
- **Three divergences from doc 10 §3, chosen rather than overlooked**, all recorded in that section.
  The selected card takes the accent border and fill but **not** the focus ring the board draws with
  it — the board is showing one card that is both selected and focused, and a permanent ring on the
  selected card is what makes keyboard focus unreadable. It gains a **"Selected" chip** instead, so
  the state is not carried by colour alone (doc 05 rule 4); in dark theme the selected and
  unselected fills differ by only 1.16:1, which is precisely why the word is there. And on mobile
  the **Length control stays in the strip** rather than moving into the selected card: §3 moved it
  to make room for the *Draw from* checkboxes, and those are cut.
- **The home resume card carries no countdown, against doc 10 §2's rail.** Home is a server render,
  so a countdown on it is a snapshot that goes on reading "12:48 left" long after it is false. Doc
  11 §1's standard — a silently wrong number is worse than a crash, because it is believed —
  applies hardest on the one card whose job is to say a clock is running. The live clock is one
  click away, derived and resynced, where it can be right. Home **does** sweep expired sittings
  before listing, as the exam list does, so nothing it offers to resume is already over.
- **Start is shipped disabled, and that is the one place #34's own checklist is knowingly unmet.**
  Its criterion reads "Start posts and navigates to the sitting". The endpoint does exactly that —
  `201`, the attempt and its frozen set written in one transaction, verified in the browser — but
  `/attempt/[id]` requires an `examId` and calls `notFound()` without one, so the navigation lands
  on a **404**. Pressing it would therefore write a permanent sitting nobody can open, and home's
  own new resume card would offer to resume it into the same 404. **There is no discard action
  anywhere, by standing decision**, so every press before #36 would leave a row that never goes
  away — in the table this project treats as the one irreplaceable thing it holds.
  *Alternatives considered:* leaving Start working and recording the gap, which is the precedent the
  2026-09-02 and 2026-09-03 entries set — but those left a *state* honest where it was, and this
  would leave permanent rows behind instead. And building enough of `/attempt/[id]` to land on,
  which is #36's screen (forward-only, graded feedback, no flagging) built inside #34, before its
  ticket has been read. The criterion is unmet either way; this is the reading that costs nothing
  that cannot be undone. `COMPOSED_SITTINGS_UNBUILT` in `src/components/use-start-sitting.ts` is one
  constant both setup screens read, so #36 re-enables it in one edit, and a line under the button
  says so rather than leaving a dead control.
- **Two doc 10 §3 states are neither built nor cut**, and are recorded in §3 rather than left to be
  rediscovered: its *Loading* six skeleton cards and its *Error* Retry panel. The route has no
  `loading.tsx` and no `error.tsx`, and the page is a single server query with no streaming
  boundary, so there is no moment at which skeletons would show. `app/tests/manual-checklist.md` §6
  carries the check that decides which — build them, or cut them the way the four elements were.
  §3's top bar is a third: it asks for a `Domain mode` chip and **Back to exams**, and the screen
  carries a single **← Home**, which is the right action now that there is a home to go back to.
- **Revisit if:** the study guide is ever linked per concept — the 2026-08-28 entry names that as
  the first thing to reconsider, and a competency-level coverage view would then have somewhere to
  point.

### [2026-09-07] The feedback branch is a database read, and the negative is asserted on the bytes
- **Decision:** `PUT /api/attempt/:id/answer` branches on `attempt.mode` read from the row the
  request already loaded to prove ownership, through one pure predicate,
  `showsImmediateFeedback` — a **third** predicate over the same two modes, deliberately not
  `!isScored`. The answer key travels through a **second** key-returning query, `feedback.ts`, and
  the assertion that a timed sitting's response does not contain it is made against the **real
  exported route handler**, in the integration suite, on the parsed body. Ticket #35.
- **Context:** doc 07 §3 already specified the two response shapes and the branch. What was
  undecided was where the branch's predicate lives, where the key-returning query lives, and — the
  question that actually mattered — how the negative gets asserted, since no integration test in the
  repo had ever invoked a route handler.
- **On the test seam, which is the whole ticket.** *Alternatives considered:* extracting the
  response-building into a function taking `(db, attempt, body)` and testing that — simpler, no
  mocking, and it asserts the same bytes, but it asserts them about a function the route happens to
  call today; a handler that stopped calling it would still pass. Also considered leaving it to the
  screen, which is what a component test would do and is precisely the assertion the ticket forbids:
  *"not 'the client doesn't render it' — the bytes must not be there."*
  **Chosen:** drive the exported `PUT`. `next/headers` is mocked in that one file because it throws
  outside a request scope; everything below it is real — a real `session` row, the real allowlist
  check, real ownership, and the branch reading the real column. The cost is one `vi.mock` and the
  integration suite gaining a share in the cookie reproduction the browser run already owns, which
  moved to `tests/support/sessions.ts` alongside the user helpers: one fact about Better Auth, one
  copy, two consumers.
- **The tests were mutation-checked rather than trusted for passing first time.** With
  `showsImmediateFeedback` forced true, three exam-mode assertions fail; with the membership check
  forced true, both refusals fail. A test that has never been seen red is a claim, not a check.
  The exam-mode assertion is written as `toEqual({ saved: true })` on the **whole body** rather than
  as three absent field names, so a fourth field added later fails here — which is the failure mode
  the ticket exists for.
- **The endpoint stays an idempotent upsert in the composed modes too.** *Alternatives considered:*
  refusing a second answer to an already-graded question, which would put decision 3's
  *"an answer cannot be changed once graded"* in the server rather than only in the screen.
  **Rejected:** the outbox retries the identical write (doc 03 §7), so a refusal would turn a `200`
  lost in transit into a permanent client-side failure with the chip up and nothing to clear it. It
  would also need an error code doc 07 §1's table does not have. Forward-only is a rule about the
  screen; idempotency is the contract that makes every retry in this system safe, and it is worth
  more.
- **A cleared answer in an unscored mode returns `{saved: true}`.** *Alternatives considered:* the
  full shape with `isCorrect: null`, so the client never branches on shape within one mode; and a
  `400`, on the grounds that un-answering is not an action these modes have — rejected because the
  schema is shared with exam mode, so the refusal would be a runtime branch making one body legal in
  one mode and illegal in another. **Chosen** because feedback is feedback *on a choice*, and there
  is no reason to hand out the key for a question just un-answered. It costs nothing at the call
  site: it falls out of reading the verdict **back from the row** rather than deriving it from what
  was sent, so a cleared answer has no verdict and there is no second branch to write. Unreachable
  from #36's screen either way.
- **`review.ts` stopped being "the one query in the app that returns the answer key"** and its header
  says so rather than being quietly outgrown. The two are separate on purpose: a single query with a
  `withKey` flag would put the leak one wrong argument away, in a file every mode reads from.
  `getPaperQuestions` still strips correctness at the boundary and still never selects `why`;
  `getAttemptAnswers` still never selects `is_correct`. A timed sitting reaches neither key query.
- **One thing found rather than decided.** `openWriteForQuestion` established membership as
  `attempt.examId !== null && isQuestionOnPaper(...)`, so **every write a composed sitting made was
  refused** with `409 question_not_in_attempt`. Correct while `attempt_question` did not exist, wrong
  from the moment #31 landed, and invisible until now because #34 ships Start disabled. The branch
  now lives with the two queries, mirroring `getSittingQuestions`.
- **Revisit if:** a mode arrives that is scored *and* explains as it goes — `showsImmediateFeedback`
  is asserted mode by mode precisely so that divergence fails a test rather than passing silently.

### [2026-09-07] The verdict comes back from the write, not from a read that follows
- **Decision:** `recordAnswer` returns `{ result: 'saved', isCorrect }` from its own
  `INSERT … RETURNING`, and the feedback query shrank to `getQuestionKey(db, questionId)` — no
  attempt id, no join to `answer`, no verdict. The route composes the two. **A correction to the
  entry above, made the same day by the code review that followed it.**
- **Context:** as first written, the route wrote the answer and then read the verdict back in a
  second query, on the stated rationale that the response should report what was *stored* rather
  than what was sent. The rationale is right; the implementation did not deliver it. Two writes to
  one question can be in flight at once — the outbox sends a click made during a backoff on its own
  (doc 03 §7) — and the read reports whatever the row held by then. Request A writes `o1`, request B
  writes `o3`, A reads back and answers with **`o3`'s verdict**, which the client renders against
  the `o1` it sent: a right answer shown as wrong, or the reverse.
- **Alternatives considered:** wrapping the write and the read in one transaction, which fixes the
  race at the cost of a transaction on the hot path for a value the write already has; and leaving
  it, on the grounds that forward-only means the screen never sends two writes for one question —
  rejected because the outbox is not the screen, `put()` is shared by every mode, and the whole
  ticket exists because a wrong answer here is silent.
- **Reason:** `RETURNING` on the upsert reports the row *this statement* wrote, which is what the
  candidate who made the click needs and is a stronger reading of "what was stored" than the read
  ever was. It also let the key query stop knowing about attempts entirely: it takes a question id
  and nothing else, so nothing in it can pair one sitting's click with another's.
- **Consequence:** `WriteResult` is a discriminated object rather than a string union — three
  assertions in `tests/integration/answer.test.ts` moved with it, and one of them now asserts the
  property directly: two writes to one question, each reporting its own verdict. A cleared answer
  reports `isCorrect: null`, so the `{saved: true}` reply for a clear falls out of the same value
  rather than needing a branch of its own. Doc 07 §3 corrected.
- **Revisit if:** never, while the outbox can have a write in flight.

### [2026-09-07] The composed sitting is its own screen, and its option order is derived
- **Decision:** practice and domain sittings render through **new components** —
  `ComposedSitting`, `ComposedQuestion`, `ComposedBar`, `SessionRail` — rather than through the timed
  sitting with its clock, flagging, free navigation and submit dialog behind flags. `/attempt/[id]`
  branches on the stored `mode`, the same column the answer endpoint branches its response on.
  Ticket #36.
- **Alternatives considered:** one `Sitting` taking a mode, with each of those four conditional —
  fewer files and one place navigation lives, at the cost of putting clock and flag code on a render
  path that must never show them, and of making every future exam-mode change something to re-reason
  about against a mode with none of its behaviour. Also considered a shared shell with two question
  components, which still leaves the shell holding the clock, the resync effect and the submit dialog
  for a mode that wants none of them.
- **Reason:** doc 10's first cross-screen rule is that **no clock renders in these modes at all** —
  not stopped, not greyed — and that is worth being structural rather than a prop that must never be
  true. `ComposedBar` is not passed a deadline and there is no prop it could be passed one through.
  The two screens still share everything that is genuinely one thing: the outbox, `writes.ts`,
  `NavigatorTile`, `Stem`/`BankText`, and the option-role vocabulary in `src/domain/review.ts`. The
  glyph came out of `ReviewCard` into `Glyph.tsx` for the same reason — two copies would eventually
  draw a blank's dash as a cross on one of the two screens, and telling those apart is what the
  drawing is *for*.

- **And the finding that changed a shipped decision: the bank authors the key first, every time.**
  Measured while building this, against both the source JSON and the seeded database: in **all
  1,150** questions the correct option is authored at index 0, because the option carrying
  `provenance_kind: key` is written as `o1`. The sixteen papers are unaffected — the builder shuffles
  and `exams/index.json` is balanced exactly **240 / 240 / 240 / 240** — but #31 decided a composed
  sitting renders in **authored order**, and doc 03 §3.2 justified that with a sentence that is
  simply false: *"The bank's authoring already varies which option is correct."* As specified,
  **every practice and domain question's answer would have been A**, which makes both modes
  answerable without reading the options.
- **Decision:** the slot is **derived**, not recorded and not authored. `slotForComposedSitting`
  hashes `attemptId:questionId` — FNV-1a with a murmur3 avalanche before the modulo, because FNV's
  low bits alone reached only two of the four slots — and the result goes through the same
  `layOutForPaper` a paper's recorded slot does. One placement, two sources for the one number it
  needs.
- **Alternatives considered:** a `correct_position` column on `attempt_question`, shuffled at
  composition and written in the freeze transaction, mirroring `exam_item` exactly — the strongest
  guarantee, at the cost of a migration on a table that shipped four commits ago and of reversing
  #31's explicit "nothing here records the option layout, because there is none to record". And
  reordering the options in the 1,150 source files, which fixes it everywhere at once but rewrites
  the source of truth to solve a rendering problem the papers already solve.
- **Reason:** derivation keeps #31's decision true as written — there is still no slot to *record*,
  because the slot is a function of the sitting rather than a fact about it — and it is available
  anywhere both ids are known, which is what #38's review will need. **Stability is the requirement
  rather than a nicety:** the verdict bar names a letter ("the answer is A"), so a reload that moved
  the options would make that sentence wrong about what the candidate saw. `Math.random()` and
  anything reading a clock are ruled out by `src/domain/` being pure (doc 03 §4) as well as by that.
- **Consequence:** docs 03 §3.2 and 04 §5.4 are corrected rather than left carrying the false
  premise, and the integration assertion that *required* authored order is inverted — it now asserts
  the four slots all occur over twenty real questions, verified by watching it fail against the old
  projection. Measured in the browser on a real 20-question domain sitting: answering `1` seven times
  scored 2, where authored order would have scored 7.

- **What the screen does, and the two rules that shaped it.** The choice is echoed the instant it is
  clicked and the options lock **then**, not when the reply lands: forward-only means committing to
  an answer, and a window in which it could be changed while the write was in the air is exactly the
  window in which it could be changed after seeing nothing and before seeing the mark. But the
  **verdict is never decided on the client** — there is no answer key in the component's props to
  derive one from — so between the click and the reply the screen says *"Marking your answer…"* and
  claims nothing. **Next does not wait for the verdict either**, so a connection that is down cannot
  strand a sitting on one question; the mark still lands where the reader is, if they are still
  there.
- **On reload, verdicts for all and the key for one.** `getRecordedVerdicts` returns
  `answer.is_correct` for every answered question — which is not the key: it says whether the option
  *this candidate chose* was right, on a question they were already told about to their face. The
  full key is fetched for the resumed question only, and that arises in exactly one case, because
  resume opens on the **first unanswered** question: when every question has been answered and there
  is none to open on. *Alternatives considered:* restoring the full key and all four explanations for
  every answered question — uniform, one query, and what #38's review will read anyway, but it puts
  up to sixty questions' worth of answer key on the wire for a screen that renders one at a time and
  cannot navigate back to the rest.
- **Doc 10 §7 loses four elements**, recorded in that section: **Previous** and **Flag for review**
  (the 2026-09-06 rule; the board predates it and the board is corrected), the sunken **"Why this is
  the answer"** panel with its study-guide link (no rationale exists separate from the per-option
  `why` already on screen, and the guide is outside the app by standing decision — the concept id
  moves into the question head as §8's did), and the **Weakest so far** card with **Drill these after
  the run** (drills are outside the app so the button has no destination, and grouping misses by
  competency to say where you are weak is the readiness judgement the 2026-08-28 decision declined
  and #34 declined again).
- **Two divergences from §7 chosen rather than overlooked.** The **mode chip stays on the phone bar**
  although the timed bar gives up its paper's name there — a countdown and a Submit say what screen a
  timed sitting is, and here the chip is the only thing that does. And the **rail is put back
  explicitly at narrow widths**: the rule that swaps the timed rail for a sheet hides every `.rail`,
  and this one has no sheet to be replaced by. Found by measuring — without it the whole session card
  was 0×0.
- **`COMPOSED_SITTINGS_UNBUILT` is deleted rather than set to `false`.** #34 shipped it as one
  constant both setup screens read so that this ticket could re-enable Start in one edit. A dead
  `false` gating two `disabled` expressions is worse than none: it reads in the source as a
  protection that is no longer protecting anything.
- **A finished composed sitting redirects to `/attempt/[id]/review`, which 404s until #38.** The
  state is unreachable from any screen in this slice — Finish is #37's — and the redirect is the
  guard that will still be right when both land. **Holdout sittings `notFound()` here**: composed
  like these two, timed and scored like an exam, and belonging to neither screen unchanged.
- **Revisit if:** the holdout sitting is built, which needs a third arrangement — this screen's
  composition with the timed screen's clock and submit.

### [2026-09-08] An unscored sitting is closed by one dialog, and that dialog is the outcome
- **Decision:** the bar's **Save and exit** and the last question's **Finish this run** open the
  same `FinishDialog`, take the same `POST /api/attempt/:id/submit`, and land in the same place — the
  dialog itself, which replaces its confirmation with `Correct · Incorrect · Not reached` and one
  action back to the modes. Ticket #37.
- **Context:** #37's last line is "Lands on `/attempt/[id]/review`", and that route 404s on a
  composed sitting until **#38**. A composed sitting never expires, so nothing finalises it lazily
  and this is the only path by which one ever closes: without it every practice attempt stays
  `submitted_at IS NULL` for ever, on the partial index home reads on every render.
- **Alternatives considered:** redirecting to the review as the ticket says, which is literal and
  which #36's finished-sitting redirect already pointed at — rejected because for one slice the run
  would end on a 404, and the counts are *the whole ending* of a sitting that is not scored, so they
  would be lost with no way back to them. Also considered redirecting home, which avoids the 404 at
  the cost of the run ending with no report of how it went at all.
- **Reason:** the 2026-09-03 precedent exactly. When the destination belongs to another ticket, do
  not invent it — make the state honest where it is, and leave the later ticket one action's
  destination to change. Nothing here has to be undone for #38: it adds *See the full review* beside
  what is already there.
- **Consequence, and it reverses a line #36 shipped deliberately.** `/attempt/[id]` no longer
  redirects a finalised composed sitting to its review; it **opens on the outcome**, the way the
  timed sitting has since #24. #36 chose the redirect while the state was unreachable and documented
  it as the guard that stays right — Finish is what makes it reachable, and a reload landing on a
  404 would have made the summary readable exactly once, only if you did not refresh. #38 decides
  whether the redirect comes back.
- **One dialog for both buttons, not two paths.** Finish on the last question could have submitted
  straight away — nothing is being abandoned there, so nothing needs warning about — at the cost of
  two submit paths and two places an outcome can appear. Both are irreversible in the same way, so
  both get the same pause; only the wording and the button's treatment change (`btn--primary` when
  the run is complete, `btn--danger` when questions are being left behind, so the destructive
  treatment is not taught to be ignored where it matters).
- **Its own component rather than `SubmitDialog` with the measured half hidden.** That dialog is
  exam-shaped throughout — pass mark, percentage, verdict chip, flagged row, jump buttons — and each
  of those is either forbidden here (PRD P1) or impossible here (strictly forward). Six regions
  behind a flag would leave the pass mark one wrong condition away from a screen that must never
  show one.
- **The counts come from the screen, not from the reply**, and they have to: doc 07 §5 answers an
  unscored submit with the four measured fields null, which is right — a count in that payload would
  be a score arriving under another name. `finishSummary` is where the arithmetic is decided, and a
  unit test asserts its **returned keys** so a mark, a percentage or a verdict cannot be added to it
  without failing. `unreached` reads the navigator's `remaining` rather than
  `questionCount - correct - incorrect`, so an answer whose verdict is still in the air is never
  reported as a question the candidate never reached — the case measured in the browser, where the
  dialog read 4 / 15 / 0 with one write owed and 4 / 16 / 0 once it landed.
- **The negative is asserted on the bytes**, in the integration suite, against the real exported
  route handler — `toEqual` on the whole body, so a fifth field added later fails there. Verified by
  mutation: making `outcomeOf` compute a pass mark for an unscored sitting turns that assertion red
  with `passMark: 15`.
- **The code review that followed corrected four things**, all the same day.
  **`submitFailed` was never reset**, so pressing *Keep going* after a failed close and reopening the
  dialog said "Couldn't finish" over a sitting nothing had tried to finish — a failure belongs to the
  attempt that produced it. **`finishSummary` returned three fields nothing read** (`answered`,
  `unmarked`, `questionCount`); the guard that made `unmarked` worth computing stays as a guard, and
  the returned shape is now exactly what the dialog shows — which also makes the "says nothing about
  a mark" key-set assertion tighter. **The modal shell came out into `ModalShell`**: the scrim, the
  box, focus-in and Escape were verbatim in both dialogs and neither had a reason to differ, and
  a11y behaviour is exactly what two copies rot into disagreeing about silently — the same call
  `Glyph` came out of `ReviewCard` on. Nothing about what either dialog *says* is shared; PRD P1 is
  the reason they differ. And **`SubmitOutcome | null` was threaded through three components and only
  ever compared to null** — there is nothing in an unscored outcome to show, so it is a boolean.
  Two test gaps closed with them: the Save-and-exit case now asserts #37's own figure (seven answered,
  **thirteen** unreached, rather than six and fourteen), and the exam-list check now runs a domain
  sitting as well as a practice one, since the ticket asks about both modes.
- **One limit is recorded rather than fixed.** A write that never lands blocks Finish for as long as
  the tab is open, and unlike a timed sitting there is no clock to close it anyway. That is doc 03
  §7's rule applied as #37 asks for it — "Submit blocks while the outbox is non-empty, exactly as
  exam mode does" — and the escape is the one the queue already has: it is in memory and nowhere
  else, so a reload drops it and the sitting closes.
- **Revisit if:** #38 lands — that is the ticket that decides whether the reload path goes back to
  being a redirect, and it is the one that adds the second action.


### [2026-09-09] The unscored review reverses "Incorrect claims the blanks", for these two modes only
- **Decision:** `/attempt/[id]/review` branches on the stored `mode`. An unscored run's filter row is
  Incorrect · Correct · **Not reached** · All, opening on Incorrect as a paper's does — and
  **Incorrect claims only the wrong answers**, which reverses the 2026-09-04 rule. The blanks get a
  filter of their own, so the three views partition the run. Ticket #38.
- **Context:** the 2026-09-04 entry named this slice as its own revisit trigger. Its rule exists
  because a blank on a paper cost exactly what a wrong answer cost — the submit statement counts
  `WHERE a.is_correct`, which counts neither `false` nor `null` — so excluding blanks would have
  hidden misses from the default view of the screen that exists to show misses, and left
  `correct + incorrect < 60` with nothing on screen explaining the gap.
- **Reason:** neither half of that argument survives the move. Nothing cost anything here —
  `attempt.score` is null and doc 04 §5.1's `CHECK (score IS NULL OR mode IN ('exam','holdout'))`
  keeps it so — and the sum is not left broken, because `unreached` takes what `incorrect` gave up.
  Underneath, the two are not even the same population: a blank on a paper is a question the
  candidate *could* have answered at any point and did not, while a strictly-forward run's blanks
  are questions nobody was ever shown. Grouping the second with the misses would attribute a
  decision that was never made.
- **Alternatives considered:** keeping the scored rule for uniformity, so one predicate serves both —
  it makes Save and exit at question 7 of 20 open on thirteen cards headed "incorrect" about
  questions the candidate never saw, which is the screen lying about what happened. And dropping the
  fourth filter rather than replacing Flagged, leaving three — rejected because the blanks then have
  no view at all and the counts stop summing on screen.
- **The reversal is one `scored` argument through one predicate**, not a second set of functions:
  `matchesFilter(question, filter, scored)` and `countByFilter(questions, scored)`, with the CSS
  reading the same flag off `data-scored` so the cards and the counts cannot disagree about what a
  filter means. Two predicates would have been two definitions of `correct` as well as two of
  `incorrect`, and the one that drifted would be the one nobody was looking at. It is **required
  rather than defaulted**, on #32's reasoning: a default makes one mode's reading the silent one,
  and the silent one is always the mode the author was not thinking about. Mutation-checked —
  forcing the predicate to ignore `scored` fails three unit assertions and leaves every scored one
  green, which is the acceptance criterion that the exam review is untouched.
- **One card with a two-word difference, not a second card.** `ReviewCard` takes `scored` and
  changes what a blank is called (*not reached*, not *not answered*) and what the note under it
  says. The option rows, the stem, the glyphs and the four states are the valuable part and are
  identical; two copies of those is the failure `Glyph` and `ModalShell` were extracted to prevent —
  and the symptom would be a blank's dash drawn as a cross on one of the two screens, which is
  exactly the distinction the drawing is *for*.
- **The by-domain card is cut, which the ticket does not name either way.** `domainBreakdown`
  reports `correct/total` per domain and whether each slice `meetsMark` — a pass ratio applied six
  times. That is a per-domain score, and it is the mastery signal the 2026-08-28 decision declined
  and #34 declined again when it cut the meter from `/domain`'s cards. *Alternative considered,* and
  put to the owner as its own option: keeping it without `meetsMark`, as coverage. Declined —
  coverage is a fact about what you have done, and `correct/total` is a judgement about how well.
- **The composed review reads through a second query, not a loosened one**, mirroring how the
  sitting reads: `getComposedReviewQuestions` over `attempt_question`, `getReviewQuestions` over
  `exam_item`, and `getSittingReviewQuestions` making the branch once — the same shape
  `getSittingQuestions` has, for the same reason. It lays options out at the **derived** slot, from
  the same `slotForComposedSitting` through the same `layOutForPaper` the run used, which is the
  claim this slice's integration file exists to make: the verdict bar named a letter while the run
  was on, so a review placing the key one slot over would tell the candidate they pressed something
  they never pressed. Mutation-checked by forcing authored order and watching two assertions go red.
  It does not select `flagged` at all — `PUT /flag` refuses these modes (doc 07 §4), so the column
  cannot be true, and reading it would suggest it varies.
- **The reload path stays as #37 left it: a finalised composed sitting opens on its outcome and is
  not redirected here.** #36 redirected, #37 stopped because this route 404'd, and #37's entry handed
  the question to this ticket. Three reasons, none of them the 404 any more: the timed sitting has
  opened on its outcome since #24, so redirecting would make the two modes differ on reload for no
  reason but the order they were written; the three counts *are* the ending of a run that is not
  scored, and a redirect goes straight past them; and the outcome now carries the review as its own
  action, so nothing is out of reach. *Alternative considered:* the redirect, which is #37's ticket
  text read literally — it also makes the sitting's own URL bounce, so a bookmark to it can never
  land again.
- **Two actions on the outcome dialog, both onward** — *Back to the modes* and *See the full
  review*, the review primary because it is where the `why` for all four options lives. The same
  reading #26's expired outcome took of doc 10 §6's "one action": neither is a way *out* of something
  that already happened, and dropping the second would make this the one screen in the app from
  which the thing it is about is two clicks away.
- **Consequence:** doc 10 gains **§8a** and its §7 closing paragraph is corrected. The exam review is
  untouched in behaviour — its pass bar, verdict chip, Flagged filter and Incorrect-claims-blanks
  rule all still hold, and `tests/unit/review.test.ts`'s assertions about them are unchanged apart
  from passing `true` where they used to rely on there being only one reading.
- **Revisit if:** the holdout sitting (H1) is built — it is composed like these two and **scored**
  like an exam, so it takes the scored branch of this screen, and `isScored(mode)` is already what
  decides that.

---

*The nine entries below were settled while grilling feature 5 (the deploy slice) and are recorded
before their implementation, on the 2026-08-29 precedent. Several rest on facts verified against
Vercel's, Neon's and Google's own documentation during the session; where a fact could not be
verified it is named as unverified rather than assumed.*

### [2026-09-11] Two environments, not three — preview deployments are cut
- **Decision:** local and production. No per-pull-request preview deployments, no Neon branch per
  preview, and non-production Vercel deployments are turned **off** in committed configuration
  (`vercel.json`'s `git.deploymentEnabled`), so a push to `develop` mints no public URL.
  **Doc 12 §1's three-environment table is corrected rather than built to.**
- **Context:** doc 12 §1 specifies Preview as a first-class environment — a Neon branch per pull
  request, created and dropped by the integration, and "same Google client, Vercel preview URL
  pattern". Two facts kill it, and one makes it pointless.
- **The blocking fact: Google forbids wildcards in redirect URIs.** Google's web-server OAuth
  documentation states a redirect URI "cannot contain … Wildcard characters (`'*'`)" and that "the
  `http` or `https` scheme, case, and trailing slash … must all match". Vercel mints a **new
  hostname per preview deployment**. So there is no "preview URL pattern" to register — sign-in on a
  preview cannot work at all unless a *custom domain is assigned to a branch*, which doc 12 §7
  deliberately declines to buy. Google documents no ephemeral-hostname mechanism; that gap is
  **unverified rather than known absent**, but nothing in the OAuth docs offers one.
- **The second fact: Neon's Free plan caps branches at ten per project**, refuses creation past it,
  and cannot sell more on Free — on 0.5 GB of storage and 100 CU-hours a month that preview branches
  also consume. Branch cleanup is not pull-request-driven either: the Vercel-managed integration's
  deletion follows Vercel's six-month deployment retention.
- **And the workflow does not exist.** **Zero pull requests have ever been opened on this
  repository**, in six phases and five features. Every ticket branch goes to `develop` and is merged
  locally. A per-PR environment is apparatus for a workflow that has never once been used.
- **Alternatives considered:** building doc 12 §1 as written — blocked outright by the redirect URI
  rule, not merely expensive. And one **persistent** preview on `develop` with its own Neon branch
  and its own registered redirect URI, which is buildable and was the strongest alternative: rejected
  because `develop` is where you already work and `main` is one merge behind it, so the staging URL
  would show what you had just been looking at on `localhost`, at the cost of a third environment's
  variables, a third Neon branch and a third redirect URI to keep in step.
- **Consequence, stated plainly:** there is no way to see a change in a production-like environment
  before it *is* production. That is accepted because the rollback is Vercel's *Promote to
  Production* on the previous build — seconds, no rebuild (doc 12 §4) — and because the app has one
  user, who is also the person who pushed.
- **Revisit if:** a custom domain is bought for another reason, at which point assigning one to a
  branch makes a stable preview host free; or if the app opens to other users and pull requests start
  being used.

### [2026-09-11] The Neon root branch stays production, and the promotion *is* the restore test
- **Decision:** the project's **root branch remains production**, and the four user tables — `user`,
  `account`, `attempt`, `answer` — are copied into it from the development branch using doc 12 §5's
  own `pg_dump`/`pg_restore`. The two Neon branches are renamed to match the git branches they serve:
  `main` and `develop`. The source branch keeps every row throughout; nothing is deleted.
- **Context:** the Neon project `lfca-simulator` (`wispy-bird-80472699`, Postgres 18, Free) has
  exactly two branches. `production` (`br-jolly-mode`) is the root and default: an untouched
  2026-08-30 snapshot, one migration behind, **80 CPU-seconds used, zero bytes transferred, no
  attempt rows**. `dev` (`br-noisy-credit`) is its child and holds all the real work — 9,314
  CPU-seconds, and the **five first-attempt scores** on exams 05, 07, 08, 10 and 14. Whichever branch
  becomes production decides where the one irreplaceable thing in this system lives.
- **This decision was taken twice.** The first answer was to promote the child — designate `dev` the
  default, rename it, and delete the root — on the reasoning that it moves zero irreplaceable rows
  and discards a branch containing nothing. **Then the mechanism was verified and the premise
  failed.** Neon documents, unconditionally, that a project's root branch **cannot be deleted**; the
  two listed exceptions (backup branches, schema-only branches) do not apply, and nothing states that
  moving the default designation away makes it deletable. Independently, "You cannot delete a branch
  that has child branches", and parentage does not follow the default designation — so the root would
  remain, permanently, as the parent of production.
- **Reason:** the first answer's whole case was "the root is discardable". It is not. Its real price
  is a permanently undeletable branch sitting at the head of the project, named for a role it no
  longer has, with production hanging off it as a child — the exact confusion the rename was
  introduced to remove. The copy's price is one `pg_restore`, and **its source is never deleted**: if
  the restore is wrong, nothing has been lost and it can be looked at again.
- **What tipped it:** doc 12 §5 already requires this exact command to be run once, as a *rehearsed*
  restore, and says flatly that "an untested backup is a belief, not a backup". Doing the promotion
  with it makes the first real use of the backup path a supervised one, with the original still
  present — a rehearsal that also accomplishes something is strictly better than a rehearsal.
- **Verified rather than assumed:** designating a non-root branch as default *is* permitted ("you can
  designate any branch as your project's default branch") and renaming is permitted "including your
  project's default branch" — so the rejected option was possible, just not worth its topology.
  **Unverified:** what setting a new default does to the endpoint host or whether it causes downtime;
  the docs are silent, so the connection strings are to be copied before and after and compared.
- **Revisit if:** never for this project. The branches are named and production is the root; there is
  nothing left to promote.

### [2026-09-11] Two connection strings, under Neon's own names
- **Decision:** **`DATABASE_URL`** carries the **pooled** (`-pooler`) host and is what the app reads;
  **`DATABASE_URL_UNPOOLED`** carries the **direct** host and is what `drizzle-kit migrate` and
  `npm run seed` read. Doc 12 §2.2's carried finding is closed. Doc 12 §2.1's per-string
  `sslmode=verify-full` rule binds both — with one caveat below.
- **Context:** §2.2 was written to say a second string was coming and to stop a freshly-pasted
  dashboard string reintroducing `sslmode=require` on arrival. Production is that arrival.
- **The names are not invented.** `DATABASE_URL` and `DATABASE_URL_UNPOOLED` are exactly what Neon's
  own Vercel integration sets, so adopting them means nothing has to be renamed if that integration
  is ever added. Both endpoints always exist for a branch — "The pooled endpoint is always
  available" — so this is two spellings of one database, not two databases.
- **Alternatives considered:** one variable on the direct host everywhere, which is genuinely
  defensible at one user and removes a whole variable from three places — rejected because doc 03
  §10 already names Neon's connection ceiling as the first thing that breaks under load, a serverless
  function can open a connection per invocation, and the failure would only appear under the one
  condition that cannot be reproduced locally. And one variable on the pooled host everywhere,
  rejected on the migration guidance below.
- **How strong that guidance actually is, stated honestly:** Neon's direction to use the direct host
  for schema migrations is a **hedged table row** — "Schema migrations | Direct | Tools may not
  support transaction pooling" — not a documented failure, and **drizzle-kit is named nowhere**. The
  underlying mechanism is real, though: session-level advisory locks and `SET`/`RESET` are both
  documented as unsupported on pooled connections, and migration tools use them.
- **One thing is unverified and must be tested, not asserted:** Neon recommends `verify-full`
  host-agnostically but **never states it for the `-pooler` host specifically**, and its own
  connection-pooling examples use `sslmode=require`. `verify-full` adds hostname verification and the
  pooler is a different hostname. The pooled string is therefore to be tested against `verify-full`
  before doc 12 §2.1 is asserted over it — the same way the direct string was measured on 2026-09-02
  rather than believed.
- **Revisit if:** the app stops being serverless, at which point the pooler stops earning its place.

### [2026-09-11] Migrations and the seed run from a deploy workflow, not from CI and not from Vercel
- **Decision:** a **separate** GitHub Actions workflow on push to `main` runs `db:migrate` then
  `seed` against `DATABASE_URL_UNPOOLED`, held as a repository secret. The test CI (below) holds no
  database credential at all. `db:migrate` and `seed` change from `--env-file=.env.local` to
  **`--env-file-if-exists`**, so one script serves both a laptop and a runner.
- **Context:** the 2026-08-31 entry decided the seed runs from CI rather than the Vercel build step,
  for three reasons that all still hold. This entry does not reverse it; it settles the part that was
  left open — *which* workflow, and with what credential.
- **Reason for separating it from the test CI:** the reduced CI below deliberately holds no
  `DATABASE_URL`, because the suites that need one also need a seeded branch. A deploy workflow
  needing a single secret is a different problem from a test suite needing a seeded database, and
  keeping them apart is what keeps the gate fast and credential-free.
- **One of the 2026-08-31 entry's three reasons has since evaporated, and is recorded rather than
  left standing.** It cited Vercel's contradiction about whether a build with Root Directory `app`
  can read `../questions`. That contradiction is still in Vercel's docs — *Configuring a Build* says
  a project "will not be able to access files outside of that directory … cannot use `..`", while
  the monorepo FAQ documents an "Include source files outside of the Root Directory" setting
  "enabled by default" since 2020 — but **it is moot here**: measured against the tree, every
  relative import in `app/src` resolves inside `app/src`, and the only file that reads `design/` is
  `tests/unit/design-tokens.test.ts`, which is a test rather than part of `next build`. The other two
  reasons — undocumented build-container egress, and Vercel deciding a commit changed nothing — are
  untouched, and the second is itself now doubtful (below).
- **`--env-file-if-exists` rather than parallel `:ci` scripts:** the pattern already exists three
  lines above in the same `package.json`, on `test:e2e`. Two variants would be two places the
  connection logic can drift, and the CI one is the copy nobody runs by hand.
- **Alternatives considered:** running both by hand from the laptop after each deploy — the honest
  fallback, rejected because doc 03 §3 says running the seed on every deploy is precisely what keeps
  the database from silently diverging from the bank, and a step you must remember is a step that
  diverges. And putting them in the Vercel build command, which doc 12 §3 still specifies and which
  this entry supersedes.
- **Consequence:** a **production** database URL now lives in GitHub Actions secrets, on a **public**
  repository. Encrypted and standard, but it is a new place a secret lives and it belongs in doc 12
  §2's inventory rather than being discovered later. And the deploy and the seed race — Vercel builds
  while the workflow migrates — which the 2026-08-31 entry already accepted: for a short window the
  new code may serve the previous seed, which is why doc 12 §3 forbids a rename in the same deploy as
  the code depending on it.
- **Revisit if:** Vercel documents build-container database egress and resolves its own root-directory
  contradiction, and the ordering guarantee becomes worth having back.

### [2026-09-11] CI is the three suites that need no database
- **Decision:** GitHub Actions on push runs the bank checks, `typecheck` and the app's unit suite.
  The integration suite and the Playwright run stay local. Node is **pinned** in the workflow and
  recorded in an `engines` field. **Doc 11 §5's four-line pipeline is corrected to what is built.**
- **Context:** doc 11 §5 specifies the full pipeline and doc 12 §3 says "CI gates the deploy". There
  is **no `.github/` directory in this repository at all**, so neither has ever been true.
- **Reason:** the integration and browser suites need a `DATABASE_URL` secret and a seeded branch —
  the apparatus doc 11 §4 originally declined for one user, and which the 2026-09-01 entry admitted
  only for a claim no pure function could make. The three cheap suites catch what would otherwise
  ship, run in seconds, and are what makes doc 12 §3's sentence true for the first time.
- **Alternatives considered:** the full four lines, which is the strongest gate and the one doc 11
  §5 asks for — deferred rather than rejected, since it needs the deploy workflow's secret pattern
  working first. And no CI at all, connecting Vercel and leaving the pipeline to its own feature,
  rejected because the deploy is exactly what makes an unnoticed red suite expensive.
- **On pinning Node:** there is no `engines` field anywhere and the local runtime is v25.1.0.
  `npm run seed` executes `scripts/seed.ts` **directly**, which needs Node ≥23.6 for unflagged type
  stripping, and `--env-file-if-exists` needs ≥20.12. Both are silently absent on an older major, and
  the failure would be a parse error in a workflow nobody is watching. Vercel is unaffected: it runs
  only `next build`, which needs neither.
- **Revisit if:** the integration suite's assertions start covering something the manual checklist
  cannot, at which point the secret is worth adding and doc 11 §5 gets built as written.

### [2026-09-11] A push to `main` gets no ceremony
- **Decision:** nothing gates a push to `main`, including once it is a production deploy. No hook, no
  manual promotion step, no disabled auto-deploy. **This closes the question the 2026-09-06 entry
  handed to this slice.**
- **Context:** the push guard was removed on 2026-09-06 as friction that also did not work — its
  escape pattern allowed any push whose command carried a lowercase letter after `" origin "`, so it
  refused the spelling a person types and permitted the spelling an agent types. That entry named the
  deploy slice as the place to decide whether a production push wants a prompt back, "with the fresh
  knowledge that it must not be a text match on the command".
- **Reason:** the recovery is already better than the prevention. Vercel's *Promote to Production* on
  the last good build is seconds and needs no rebuild (doc 12 §4), and migrations are additive by
  rule, so step 1 of the rollback is sufficient in almost every case. Against that, the failure this
  repository has actually had is the **opposite** one: `main` drifting behind `develop`, unnoticed,
  ten commits at one point and one commit as recently as #27. A prompt that makes pushing `main`
  slightly harder pushes directly on the failure mode that has occurred, to defend against one that
  has not.
- **Alternatives considered:** a hook keyed on something real rather than a text match — buildable,
  but it restores a refusal the owner has said gets in the way, and the reward for repairing it is
  more friction. And turning off Vercel's auto-deploy so builds are promoted by hand: attractive
  until checked, because the dashboard control is "Auto-assign **Custom** Production Domains" and its
  behaviour on a project with no custom domain is **undocumented**; the unambiguous lever is
  `vercel.json`'s `git.deploymentEnabled`, which is the same file already being used to turn preview
  deployments off — and pointing it at `main` would mean no deploy happens at all without a manual
  step, which is a worse shape than a prompt.
- **Consequence:** `stop-branch-drift.sh` stays and is now the more useful of the two guards, because
  the drift it reports on is the thing that actually goes wrong.
- **Revisit if:** a second person can push, at which point "who deployed this" stops having one
  answer.

### [2026-09-11] Environment variables: `BETTER_AUTH_URL` is typed, and the signing secret is per-environment
- **Decision:** `BETTER_AUTH_URL` is a hardcoded plain variable per environment, not derived from
  Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. `BETTER_AUTH_SECRET` is **two distinct values**, one
  local and one production, generated separately.
- **On the URL:** the 2026-09-06 entry made this load-bearing — Better Auth takes the session
  cookie's `__Secure-` prefix from `options.baseURL`, so a wrong value makes a session impossible to
  hold rather than merely mislabelled. It also has to match, character for character including
  trailing slash, a redirect URI typed by hand into the Google console. Deriving it means a value
  computed in two places must agree with a third that was typed, and doc 12 §2 already calls it plain
  config. *Alternative considered:* deriving it, which survives a project rename automatically — a
  scenario that does not happen and would need the Google console edited by hand anyway.
- **On the secret:** doc 12 §2 says "generated once … stored in Vercel", which reads as one value
  shared with `.env.local` but never says. It should be two, because doc 12 calls rotating it "the
  intended emergency control": with one value, rotating production to kill a session also signs you
  out locally, and the value protecting the public URL would be one that has sat in a file on a
  laptop for months. *Alternative considered:* one shared value, which is one fewer secret — rejected
  for two lines of cost against an emergency control that would otherwise not be one.
- **Revisit if:** never; both are one-line configuration.

### [2026-09-11] Sentry ships in this slice, last
- **Decision:** Sentry is part of the deploy slice and is its **final** ticket, after the app is
  reachable and proven on a phone. Sentry MCP is added with it, on the trigger `CLAUDE.md` already
  records. Locally it stays disabled; production is the only environment that reports.
- **Context:** nothing Sentry-shaped is installed — a single `console.error` stands in, in
  `use-outbox.ts`, placed there by #23 as the five-consecutive-failure report doc 03 §8 specifies.
- **Reason:** doc 12 §6's argument is that for a one-user app the user is the monitor for everything
  except the failure the user cannot see — "the save failure at question 40 of a first attempt … the
  one thing that costs a number that cannot be recovered". This slice is precisely what makes that
  plausible: it moves the app off `localhost` onto a phone on a mobile network, which is the first
  environment where an answer write can fail for reasons nothing in the room explains.
- **Why last rather than first:** it needs a provider signup, an SDK, `beforeSend` scrubbing (doc 03
  §9 requires emails and tokens excluded and `sendDefaultPii: false`) and a build-time auth token for
  source maps. None of that is needed for the thing this slice exists for, and ordering it last means
  a signup can never block a phone sitting.
- **Alternatives considered:** its own feature afterwards, which is cleaner as a slice boundary but
  leaves a production app holding irreplaceable numbers reporting nothing for however long that
  takes. And cutting it for v1 with the console stand-in kept, rejected because a `console.error` in
  a browser nobody is looking at is not a report.
- **Revisit if:** never — doc 03 §1 chose Sentry in Phase 4 and this only settles when.

### [2026-09-11] The Neon CLI and MCP get the same permission split `gh` got
- **Decision:** `neon auth` is completed, the org (`org-tiny-fire-00617341`) and project
  (`wispy-bird-80472699`) ids are recorded in the docs, and `.claude/settings.json` gains rules on
  the same split as `gh`: reads allowed, **every write at `ask`** — `neon branches delete`,
  `neon projects delete`, `neon roles reset-password` and the rest.
- **Context:** both were further along than the docs claimed, and neither was usable. The CLI **is**
  installed globally as `neon` v4.14.0 — the `neon` npm package is the CLI now, which is why looking
  for `neonctl` found nothing — but it is **unauthenticated**: `~/.config/neon/` is empty and dated
  2026-08-31, so a login was started that day and abandoned. Neon MCP is registered in `.mcp.json`
  and answering, but its first call failed for want of an `org_id` that was written down nowhere.
- **Reason:** `gh` was given exactly this treatment on 2026-08-30 because it writes to a **public
  issue tracker**. These two can delete the branch holding the first-attempt scores. The Neon MCP
  server announces "Write mode active. Destructive tools are exposed" on connection, and until now
  neither it nor the CLI had a single rule against them.
- **Alternatives considered:** authenticating and leaving it there, which is what "set up" would
  ordinarily mean — rejected because the gap is not access, it is that unattended destructive access
  now exists over the one database this project treats as unrecoverable. And skipping the CLI on the
  grounds that the MCP covers it, rejected because the MCP was unusable for want of an id and the CLI
  is what a person reaches for when an agent is not in the room.
- **Consequence:** `neon auth` is a browser flow and is the owner's to complete; it belongs in the
  slice's wizard alongside creating the Vercel project and adding the Google redirect URI.
- **Revisit if:** never, while the CLI can delete a branch.

### [2026-09-12] The Neon rules wildcard the server, and the CLI's own login is behind a prompt
- **Decision:** `.claude/settings.json` gives the Neon CLI and the Neon MCP server `gh`'s split —
  reads allowed, every write at `ask`. The MCP rules name Neon's own tool names with the **server
  segment wildcarded** (`mcp__*__delete_branch`, not `mcp__Neon__delete_branch`).
  `app/tests/unit/neon-permissions.test.ts` asserts the committed file in both directions. The
  identifiers are recorded in doc 12 §8.1. Ticket #41; this is the 2026-09-11 entry's decision
  carried out, plus the two things building it settled.
- **Context, and the reason the obvious spelling is wrong:** the Neon tools reaching a session come
  under **two** names. `.mcp.json` declares a server called `Neon`, and a claude.ai connector exposes
  the same server under an opaque id (`mcp__0e2230bb-…__delete_branch`). `claude mcp list` shows only
  the first, and reports it *pending approval* — so a rule written for `mcp__Neon__…` alone would have
  guarded the copy that was not the one in use, and read in the settings file as protection.
- **Alternatives considered:** naming both, which is complete today at the cost of pinning a personal,
  opaque connector id inside a committed project file — and a connector re-registered under a new id
  escapes it silently. And naming `Neon` only, recording the connector as a known gap: the smallest
  config, and the one the 2026-09-06 entry's own reasoning rules out — *"a hook that guards nothing is
  worse than no hook"*. Put to the owner as three options; the wildcard was chosen.
- **Why it is not over-broad:** the wildcard is in the server segment only, and every rule names a
  Neon tool exactly (`reset_from_parent`, `run_sql`, `set_default_branch`). Nothing else installed
  here answers to those names, so an unrelated server is not caught by them.
- **That the wildcard matches was measured, not assumed**, because the whole decision is worthless if
  a rule is matched segment by segment — `*` would then be a server literally called `*`, and all
  sixty rules would be inert while the file read as protection. Read out of the installed CLI: a rule
  is compiled to one anchored expression over the **whole** tool name, its literal parts escaped and
  its `*` joined with `.*`, so `mcp__*__delete_branch` is `^mcp__.*__delete_branch$`. Claude Code's
  own documented example agrees — `mcp__*` matches "every MCP tool across all servers", which it can
  only do by spanning the server segment.
- **The asymmetry, kept rather than worked around — and narrower than this entry first claimed.** An
  `allow` rule **may** glob its *tool* segment (`mcp__Neon__list_*`); it is refused only on its
  *server* segment, with *"An allow pattern must name the scope it widens"*, and such a rule is
  discarded when settings load. So a read arriving through a connector prompts, which errs safely and
  is left alone. **The allow list still names every read in full rather than collapsing to `list_*`
  and `get_*`**: `get_connection_string` is itself at `ask`, so a tidier `get_*` would put an allow
  rule and an ask rule over one tool, and nothing here should depend on which of those two wins. A
  test asserts the two lists stay disjoint, so that independence is a fact rather than an intention.
- **Four classifications worth stating, because each reads as a read and is not.** `run_sql`,
  `run_sql_transaction` and `neon psql` are writes whatever the statement says, since nothing inspects
  it. **`explain_sql_statement` is a write**: `EXPLAIN ANALYZE` executes what it explains.
  **`get_connection_string` and `neon connection-string` ask** although they change nothing — they
  hand out a password, which is the one thing the `Read(./**/.env)` denials exist to keep out of an
  agent's context. And **`neon auth` asks**: it opens a browser and waits, which is exactly how this
  ticket started, with the command hanging until it timed out.
- **The CLI has no `neon roles reset-password`.** The 2026-09-11 entry named it as a write to gate;
  at v4.14.0 `neon roles` is `list`, `create`, `delete` and nothing else. A rule for a command that
  does not exist is dead weight, so none was written — the password reset is
  `mcp__*__reset_postgres_role_password`, which is covered.
- **Consequence:** `.claude/settings.json` is now **89 allow, 114 ask, 6 deny**. Every assertion was
  mutation-checked rather than trusted for passing first time: removing `mcp__*__delete_branch` from
  `ask`, adding a broad `Bash(neon:*)` to `allow`, adding `mcp__*__list_branches` to `allow`, and
  allowing `get_connection_string` each turn it red.
- **The code review found four things**, and two of them are the reason this entry is longer than the
  decision. **`neon --help` was read to line 80 and its output ran past it**, so `neon deploy`,
  `neon env`, `neon buckets` and `neon bootstrap` had no rule; an unmatched command still prompts by
  default, so this was a gap in the enumeration rather than an open door, and it is recorded because
  the next person extending these rules will read the same help. **The test hand-rolled one matcher
  for two grammars**, which is what hid the trap above: it would have counted a discarded
  `mcp__*__list_branches` allow rule as protection and stayed green — *"listed and absent at once"*,
  which its own header warns against. Two assertions close it. Also: `SERVERS` in the test pinned the
  real connector id this entry refuses to pin in `settings.json`, and now asserts the property with a
  synthetic one; and doc 11 §2 gains the committed-configuration tests, which it had never described.
- **What this does not do, recorded rather than left to be discovered:** a session in
  bypass-permissions mode is prompted by none of it, so the ticket's "watch a destructive command
  prompt" check is the owner's, in an ordinary session, and doc 12 §8.3 carries it with the exact
  command. **`neon auth` is also still the owner's** — `~/.config/neon/` was empty and dated
  2026-08-31 when this landed, and every CLI command that talks to the API opens a browser until it
  is done.
- **Revisit if:** `allow` rules gain tool-name globs, at which point the connector's reads stop
  prompting and this asymmetry goes.

### [2026-09-12] The Neon branches are named after the git branches, and `verify-full` holds on the pooler
- **Decision:** the two Neon branches are renamed to the git branches they back — `production` →
  **`main`** (the root, still default) and `dev` → **`develop`**. Doc 12 §2.1's standing caveat about
  the pooled host is **settled by measurement and removed**: `sslmode=verify-full` holds on the
  `-pooler` host, so §2.1's per-string rule binds the pooled URL with no exception. Ticket #42.
- **Context:** §2.1 was deliberately written per-string rather than per-variable so it would bind the
  second connection string on arrival, and it then declined to assert itself over the pooled host —
  Neon recommends `verify-full` host-agnostically but never states it for `-pooler`, and its own
  connection-pooling examples use `sslmode=require`. `verify-full` adds hostname verification and the
  pooler is a different hostname, so the honest position was that nothing downstream could assert a
  rule about the pooled string until somebody looked.
- **The answer is structural, not a lucky observation, and that is the part worth keeping.** Every
  endpoint in this project is served **one wildcard certificate for the proxy domain** — leaf CN and
  sole SAN `*.c-4.ap-southeast-1.aws.neon.tech` — and `-pooler` is a suffix on the **leftmost label**.
  So `ep-…-pooler.c-4.…` and `ep-….c-4.…` are both single labels under that wildcard and match it
  equally: the pooler is not a different certificate, it is a different name on the same one. Four
  hosts for four, TLSv1.3, chain `YR2 ← Root YR ← ISRG Root X1`, `authorized: true`. There is no
  documented exception to write down, which is the outcome this ticket was prepared to accept the
  other way.
- **How it was measured, and why the method is the decision.** `verify-full` means chain verification
  plus hostname verification, and **both happen in the TLS handshake before authentication** — so no
  credential is needed to observe either. The probe made the Postgres `SSLRequest` by hand and handed
  the upgraded socket to `tls.connect` with `rejectUnauthorized: true` and `servername` set, which is
  the option pair node-postgres builds for `verify-full`. *Alternatives considered:* a live `pg`
  connection over the pooled string, which is what "a real connection" sounds like — rejected because
  it needs a password, and doc 12 §8.2 put `get_connection_string` behind a prompt specifically to
  keep a role password out of an agent's context; the auth attempt also confounds the thing being
  measured, since a TLS failure and an auth failure are different errors for different reasons. Also
  considered having the owner run the `pg` version, which is strictly more work for a fact the
  handshake already settles.
- **The check was proved non-vacuous rather than trusted for going green**, on this repo's standing
  habit. Run against the served certificate, Node's own `checkServerIdentity` **rejects** a deeper
  label (`deeper.label.c-4.…`) and a different proxy shard (`ep-…-pooler.c-9.…`) with *"Hostname/IP
  does not match certificate's altnames"*, while accepting both real hosts. A strict pass that
  accepted everything would have looked identical from the verdict alone.
- **The probe is a throwaway and is not committed**, which is the same call
  `connection-string.test.ts` already made in its own header: *"It asserts the string, not the socket
  — a live connection proves today's behaviour, which is not what is at risk."* Doc 11 §2 says the
  same thing as a rule. What is at risk is somebody pasting a fresh dashboard string that says
  `require`, and the committed guard for that is the test, which **#43** extends to both strings.
  *Alternative considered:* committing it under `tools/` so the rename question could be re-measured
  later — rejected because a committed socket-opening script contradicts that rule and invites being
  run as a check it was never meant to be. What the repo keeps instead is §2.1's note on **what would
  break it**: Neon moving the pooler to a different parent domain, or issuing it its own certificate.
- **What the rename did to the endpoint hosts: nothing, measured rather than assumed.** Neon does not
  document this, so both endpoint records were captured in full before and after and compared. The
  hosts are identical and so is every other field, **including the endpoints' own `updated_at`** — the
  rename did not touch the endpoint records at all; only the branch rows moved. The root kept
  `primary: true, default: true`. Connection strings carry the endpoint host and never the branch
  name, so nothing holding one needs re-pasting, `app/.env.local` included. The four hosts were
  re-measured against `verify-full` afterwards regardless, because *the host is unchanged* and *it
  still verifies* are two claims and only one of them was being asserted.
- **One measured thing that contradicts the endpoint record**, recorded because the next reader will
  see the flag before they see this: both endpoints report **`pooler_enabled: false`** and the pooled
  host answers anyway. That is Neon's "the pooled endpoint is always available" holding in practice,
  and it means the flag is not what decides whether a `-pooler` host exists — so it is not a
  precondition to check before using one.
- **The `channel_binding=require` criterion is the owner's**, and is the one thing here an agent
  cannot settle: it is a fact about four strings, and the strings are secrets. It was checked by a
  throwaway that reads them from a `read -s` prompt and prints **only the query parameters** — no
  host, no role, no password — so neither the shell history nor this repository's transcript ever held
  one.
- **Revisit if:** Neon changes the pooler's hostname shape, which is the single assumption the whole
  measurement rests on.

### [2026-09-12] Two strings with no fallback between them, and the seed keeps its own pool
- **Decision:** `DATABASE_URL` is the **pooled** host and is what the app reads, in *both*
  environments. **`DATABASE_URL_UNPOOLED`** is the **direct** host and is read by `drizzle-kit migrate`
  and `npm run seed`, by nothing else, and **with no fallback**. The seed builds its own `Pool` from it
  rather than sharing `src/db/client.ts`'s handle. `db:migrate`, `seed` and `test:integration` move to
  `--env-file-if-exists`. `app/package.json` declares `engines.node` as `>=23.6.0`. Ticket #43.
- **Context:** the 2026-09-11 entry decided the two variables and their names; what it left open was
  what happens when the second one is missing, and where the seed's handle comes from — `scripts/seed.ts`
  imported `db` and `pool` from `client.ts`, so the moment `DATABASE_URL` meant *pooled*, the seed
  would have started running its one long multi-statement transaction over the pooler without anything
  saying so.
- **On the missing variable.** *Alternatives considered:* falling back to `DATABASE_URL` with a console
  warning, which keeps the laptop working through the change and closes every criterion in one session
  — rejected because a runner missing the secret would then migrate and seed over whatever
  `DATABASE_URL` happened to be, succeed, and leave the warning in a log nobody reads. Also considered
  falling back only when `process.env.CI` is unset, which keeps both properties at the cost of
  behaviour that differs by environment, in the environment that is hardest to debug.
  **Chosen:** `requireDirectDatabaseUrl()` throws and names the variable. The cost is real and was
  accepted rather than discovered: both scripts stop working on the owner's laptop until
  `app/.env.local` gains the variable, which is a file agents are denied and the owner owns.
- **`drizzle.config.ts` carries the refusal itself rather than importing the helper**, because
  importing it would pull `pg`, `drizzle-orm` and the whole schema graph into whatever bundle
  drizzle-kit builds that config with — a new coupling to save one duplicated sentence. And it is a
  refusal rather than the `?? ''` the first draft had: **`pg` reads an empty connection string as
  *use the `PG*` defaults***, so a runner missing the secret would aim at localhost and present as a
  connection error rather than a missing credential. `generate` opens nothing and is exempt.
- **On the seed's handle.** *Alternatives considered:* a `makeDb(url)` factory exported from
  `client.ts`, so the drizzle construction is written once — rejected because `client.ts` is imported
  by every route, page and integration test, and it would then hand all of them a way to build a handle
  pointing anywhere, including one careless argument later at Neon `main` from a test. Also considered
  leaving the seed on the shared pooled handle, which is one file changed and contradicts the ticket:
  session-level advisory locks and `SET`/`RESET` are documented as unsupported on a pooled connection,
  and a long multi-statement transaction is that shape. **Chosen:** a private pool in `seed.ts`.
  Nothing under `src/` can reach the direct host. The cost is one construction line existing twice, and
  every statement in the seed names its tables explicitly, so the copies cannot quietly diverge about
  what they point at.
- **The test requires both strings under one gate, and asserts how they relate.** The gate stays
  `DATABASE_URL`, because that is what "is there a database here at all" means for every other file in
  the suite. *Alternative considered:* a second `describe.skipIf(!process.env.DATABASE_URL_UNPOOLED)`,
  which is green today — and would close the ticket's "asserts both strings" criterion while the second
  half had never once executed. It also asserts the two hostnames differ by exactly `-pooler` on the
  leftmost label, which is #42's structural finding turned into a check and catches the mistake
  actually available here: pasting one string into both names, which every parameter assertion would
  pass. Hostnames are not secrets — doc 12 §8.1 records all four — so a failure may print them.
- **One thing the browser of this repo's own habits caught, measured rather than reasoned about.**
  Parsing the connection string in the suite *body* broke the skip: **`describe.skipIf` still runs its
  callback at collection time** — a skipped suite is one whose tests do not execute, not one whose body
  is never read — so `new URL('')` threw and the run reported *1 file failed, 186 skipped* on a machine
  with no database. The parse moved inside each test, and the no-database run is now 18 files and 190
  tests skipped with nothing failed.
- **`test:integration` moved to `--env-file-if-exists` although #43 named only the two database
  scripts.** Under the mandatory form a missing `.env.local` exits `ENOENT` before vitest starts, so
  doc 11 §5's standing claim that the app suites skip cleanly without `DATABASE_URL` was not observable
  — the criterion could be asserted but never watched.
- **`engines.node` is `>=23.6.0`, and that value decides something it does not mention.** The floor is
  real: `npm run seed` executes `scripts/seed.ts` directly and unflagged type stripping arrives in
  23.6. But **Root Directory is `app`, so this is the manifest Vercel reads**, and Vercel offers only
  20.x, 22.x and 24.x; per its documented mapping this range resolves to the latest 24.x, pinning the
  production build as a side effect. Harmless, since Vercel runs only `next build`. *Alternative
  considered:* `"24.x"`, which is Vercel's own grammar and unambiguous there — rejected because it
  would warn on every `npm install` on the owner's Node 25, and because it overstates a floor that is
  about one script rather than about the app.
- **`requireDatabaseUrl()` is deleted rather than kept.** The seed was its only caller and now wants the
  direct host, so this ticket is what made it dead. Its doc comment claimed the migration runner and the
  integration tests as callers too, which was never true — the app reads `DATABASE_URL` through the pool
  and the suites gate on it themselves. This repo does keep deliberately-dead code where it earns its
  place (`scoreSitting` is the integration suite's oracle, and says so), but a dead export asserting
  three users it does not have is worse than no export.
- **Revisit if:** Vercel's available majors change such that `>=23.6.0` no longer resolves to a
  supported one — the failure would be at build time and loud, but this is the line to re-read.

### [2026-09-12] Production starts with no exam attempts, and the backup command had three defects
- **Decision:** the Neon `main` branch was migrated, seeded and restored into on 2026-09-12, in that
  order. The **full** fixed dump was restored — `user`, `account`, `attempt`, `answer`,
  `attempt_question` — and then one explicit statement, `DELETE FROM attempt WHERE mode = 'exam'`,
  removed the eleven development exam sittings. Production holds the account and the three composed
  sittings; **all sixteen papers are unsat**. `develop` keeps every row. Ticket #44.
- **Context, and it is not what the ticket, doc 12 §5 or `00-status.md` said.** All three named "the
  owner's five first-attempt scores (exams 05, 07, 08, 10 and 14)". Measured before copying anything:
  **nine** rows carried `is_first_attempt` — exams 05, 07, 08, 09, 10, 11, 12, 13 and 14 — and every
  one was made between 2026-09-02 and 09-03 while driving features 3 and 4 through a browser.
  **Exams 12, 13 and 14 had zero answers.** 08, 09 and 11 had one each. exam-05 was twelve answers in
  three minutes. Only exam-10 (52 of 60, expired after nine hours) resembles a sitting, and it was
  made while testing the auto-submit sweep.
- **Why that is a decision and not a tidy-up.** `is_first_attempt` is set at creation and never
  rewritten (doc 04 §5.2), and there is deliberately no discard action anywhere. So the moment those
  rows reach production, **nine of the sixteen papers can never produce an honest first-attempt score
  again** — six of them pinned at 0/60 having never been answered. That is the one number this
  product exists to produce, and the one thing in it that cannot be regenerated. Provisioning is the
  only moment at which the question can be asked at all.
- **Alternatives considered.** *Copy everything*, which is the ticket read literally and the strictest
  reading of "first-attempt scoring cannot be dodged" — rejected because that standing rule is about
  **the candidate abandoning a sitting that is going badly**, which is a thing the app must refuse;
  it is not about which database becomes production, a choice made once, before production exists,
  by the person who created the rows knowing exactly what they were. Keeping them would satisfy the
  rule's letter while destroying the thing the rule protects. *Copy `user` and `account` only* and
  leave the history behind — cleanest, and it was the other genuine option, but the restore would
  then never carry `attempt_question`, so the operation meant to test the fixed dump command would
  not have tested the fix. *Copy selectively*, keeping the sittings that look genuine — rejected
  because "genuine" is a judgement, and hand-editing the dump defeats the rehearsal outright.
- **The chosen shape gets both:** the command runs exactly as documented, over all five tables, and
  what production keeps is then decided in the open, in one statement, recorded here.
- **The three composed sittings stay**, and that is not an inconsistency. They carry no
  `is_first_attempt`, no score, and no paper — doc 04 §5.1's
  `CHECK (score IS NULL OR mode IN ('exam','holdout'))` guarantees the first two — so nothing about
  them can be burned. Their 87 answers are real answered questions, and unseen-first ordering is
  strictly better for knowing about them.
- **`session` is not in the backup and was not copied.** A session is one browser (doc 08 §2);
  signing in again is the intended recovery, and copying six dev sessions into production would hand
  a laptop's cookies authority over it.

- **The documented `pg_dump` carried three defects, and doc 12 arranges for its first real use to be
  the operation that creates production** — so each was load-bearing rather than cosmetic.
  1. **It did not name `attempt_question`**, which arrived with the composed modes after §5 was
     written. That table is the only record of what a composed sitting *asked*; it cannot be
     recomposed, because the candidate ordering reads `max(answered_at)` and answering changes it.
     A restore without it yields attempts whose `question_count` disagrees with zero rows.
  2. **It said `$DATABASE_URL`, which since #43 is the pooled host.** Neon states it outright —
     *"Avoid using `pg_dump` over a pooled connection string … Use an unpooled connection string
     instead"*, citing two PgBouncer issues. Before #43 the two were one variable and the command was
     right by accident; splitting them is what made it wrong.
  3. **It needed `PGSSLROOTCERT=system`, which only running it reveals.** §2.1's finding that Neon's
     chain ends at ISRG Root X1 and needs no `sslrootcert` is a fact about **node-postgres**, which
     verifies against Node's bundled trust store. `pg_dump` is libpq, which under `verify-full` looks
     for `~/.postgresql/root.crt` and refuses when it is absent. The same string works from the app
     and fails from the backup. The fix points libpq at the OS store, which already holds that root —
     **not** `sslmode=require`, which is how this gets "fixed" under pressure and is the exact
     downgrade §2.1 exists to prevent.
- **Also found by running it:** Homebrew's `postgresql@17` `pg_dump` aborts against this Postgres 18
  server, while `/opt/homebrew/opt/libpq/bin/pg_dump` is 18.0 and works. And `pg_restore`'s default
  TOC order is alphabetical — `account` is entry 3512 against `"user"` at 3513 — so the child would
  be restored before its parent. The restore reorders the list explicitly with `-l` / `-L` rather
  than hoping.
- **`app/tests/unit/backup-command.test.ts` is what stops this recurring**, in the committed-artefact
  shape doc 11 §2 describes. It derives the table set from the migrations' own `CREATE TABLE`
  statements and fails unless every table is either named in the backup command or listed as excluded
  **with a reason** — so the failure lands on whoever adds the next table, which is the only moment
  anyone will be thinking about it. Mutation-checked four ways; the decisive one is that adding a
  `study_note` table to a migration fails the test by name. `attempt_question` went eleven days
  without that check, and the symptom would first have appeared on the worst day this project can
  have.
- **The production credentials never entered an agent's context, and nobody typed them.** A Neon
  branch copies its parent's roles **including their passwords**, and `develop` is a child of `main`
  — both branches' `neondb_owner` rows carry the identical `created_at`/`updated_at` of
  2026-08-30T23:12:44Z, which is the root's, so neither has been reset. `main`'s strings were
  therefore derived from `develop`'s inside a subprocess by rewriting the endpoint id in the
  **hostname only**, and verified by connecting. *Alternative considered:* `get_connection_string`,
  which is one call and puts a production role password in the transcript — the thing doc 12 §8.2 put
  that tool behind a prompt to prevent. Also considered having the owner paste both strings at a
  `read -s` prompt, which was the plan until the inheritance was noticed; it is strictly more work
  for the same guarantee.
- **They live in `app/.env.main`, and the name matters.** Not `.env.production` or
  `.env.production.local`: Next.js auto-loads both under `next build` / `next start`, and the browser
  suite runs exactly that pair — so either name would point the e2e teardown, which deletes every
  user carrying its prefix, at production. `app/.env.*` is already gitignored and already denied to
  agent reads.
- **Revisit if:** never for the promotion. The first time the backup is *restored in anger* is the
  next thing to verify — this rehearsal proved the dump and the restore, not the judgement of a
  person doing it at speed under stress.

### [2026-09-12] CI is one job on every push, the Node pin is `24.x`, and the configuration test is its own file
- **Decision:** `.github/workflows/ci.yml` — one job, triggered by `on: push`, running the bank checks,
  then `npm ci`, `typecheck` and the app's unit suite, holding **no repository secret**. Node pinned at
  **`24.x`**. The committed-configuration assertions go in a **new** `app/tests/unit/deploy-config.test.ts`
  rather than into `neon-permissions.test.ts`. Ticket #45.
- **Context:** doc 12 §3 has claimed "CI gates the deploy" since it was written in Phase 4, and there was
  no `.github/` directory in this repository at all, so the sentence had never once been true. The
  2026-09-11 entry settled *what* CI runs; this settles the three things building it asked.
- **The test is a fourth file, which reverses a recorded intention.** `neon-permissions.test.ts` said in
  its own header that #45 "extends this file rather than adding a second one of the same kind", and doc 11
  §2 said the same. *Alternatives considered:* doing exactly that, which costs no doc corrections and
  keeps all committed configuration in one place — rejected because nothing in this seam is about Neon:
  these are npm script flags and a GitHub workflow, and a file named `neon-permissions` that also asserts
  a Node version is one the next reader does not think to grep. Also considered extending **and renaming**
  to `committed-config.test.ts`, which is one honest file — rejected because it renames a file named in
  doc 11 §2, in this log's own 2026-09-12 entry and in `00-status.md`, and a rename shows in the diff as a
  delete-plus-add that hides what actually changed. The shape is what was worth sharing, not the file.
- **The pin is `24.x` rather than the manifest's own range.** *Alternatives considered:*
  `node-version-file: app/package.json`, which **does** work — verified against the action's own
  documentation, which reads `volta.node`, then `devEngines.runtime`, then `engines.node` — and which
  cannot drift from the manifest because there is no second number. Rejected because **a range is not a
  pin**: `setup-node`'s version input takes semver ranges, so `>=23.6.0` resolves to whatever the newest
  satisfying major is on the runner that day (the action's own matrix example already lists 26), and a
  Node release would then change CI's runtime with no diff to show for it — in a workflow nobody watches,
  which is the exact failure doc 12 §3 pins Node against. Also considered `25.x`, matching the owner's own
  laptop so a green run here means a green run there — rejected because 24.x is what **Vercel** resolves
  `engines.node` to for the production build (doc 12 §3), so pinning it means the suites run under the
  major that compiles the deploy they gate, and CI is not left as the one environment on a Node nothing
  else in the pipeline uses.
- **The comparison is strictly-greater, and that is the whole strength of it.** The test requires the
  pinned major to be **above** the manifest's floor major, not equal to it: `23.x` against a floor of
  `>=23.6.0` would pass a same-major check while 23.0.0 — a version that pin can legally resolve to —
  does not satisfy the floor. One major above means every version on the pinned line clears it whatever
  the runner picks. Both grammars are matched strictly and a file that stops using the form the test
  understands **fails** rather than being forgiven, because a changed form is exactly the moment a human
  should re-read the comparison and there is no semver parser here to fall back on.
- **One job, not three in parallel, and the order is the point.** doc 11 §5 says the bank checks run
  first "so a holdout violation fails in seconds rather than after a browser run". A single job with
  sequential steps keeps that property literally; parallel jobs would give up the ordering to save a few
  seconds on the one outcome nobody minds waiting for. The bank half installs nothing, which is what
  makes it cheap — the root declares no dependencies and every import under `tools/` is a `node:`
  builtin, measured rather than assumed.
- **`on: push` with no `pull_request` trigger.** Zero pull requests have ever been opened on this
  repository, which is the same fact that cut preview environments out of this slice (2026-09-11). A
  trigger for an event that has never occurred would gate nothing.
- **It reads the workflow as text, not as parsed YAML.** There is no YAML parser in the app's dependency
  tree and adding one to read six lines would be a dependency taken on for a test; every fact asserted is
  a single line. The accepted cost is that an equally valid respelling — `on: [push]` for `on: push` —
  fails here, which is the same deliberate strictness as the Node grammar.
- **Both actions are pinned to their current majors**, `actions/checkout@v7` and `actions/setup-node@v7`,
  read from the tag lists rather than assumed — a version that does not exist fails the workflow at
  startup, which is a cheap mistake to make from memory.
- **Verified by mutation, sixteen ways, and the first attempt at that was invalid.** Each assertion was
  broken in turn and watched go red, by name: the mandatory `--env-file` form on `seed` and on
  `db:migrate`, every env-file flag removed, the `node-version` line deleted, the pin lowered to `23.x`,
  the pin replaced with `node-version-file`, the manifest floor raised to `>=24.6.0`, the floor rewritten
  as `^23.6.0`, the trigger respelled `on: [push]`, a connection string added, an unrelated secret added,
  the integration suite added, the seed added, `check-bank` dropped, `typecheck` dropped, and the workflow
  deleted. **Worth recording because it nearly passed unnoticed:** the matrix's first run restored its
  files with `git checkout -- <workflow> <manifest>`, and the workflow was untracked — so git failed on
  that pathspec and restored **neither** file, leaving every later mutation stacked on a manifest that was
  already wrong. The reds were real and the attribution was worthless. Re-run with per-file copies.
- **Revisit if:** the integration suite's assertions start covering something the manual checklist cannot,
  at which point the secret is worth adding and doc 11 §5's last two lines get built as written — and the
  "holds no repository secret at all" assertion becomes the thing to loosen deliberately rather than
  quietly.

### [2026-09-13] CI does not gate the deploy, and the claim is corrected rather than made true
- **Decision:** doc 12 §3's *"CI gates the deploy … Red suite, no deploy"* is **rewritten to say the
  opposite**, because it is not true and cannot be made true in the shape this slice chose. Vercel's
  GitHub integration builds on the push and `.github/workflows/ci.yml` runs on the same push; they
  race, and nothing couples them. CI is a **signal on the commit**, and the recovery is §4's *Promote
  to Production*. Doc 11 §5's mirror-image claim, the workflow's own header comment and one comment in
  `deploy-config.test.ts` are corrected with it. Ticket #46.
- **Context:** #45 made half of that sentence true by creating the workflow — there had been no
  `.github/` directory at all — and this is the other half, found while reading Vercel's documentation
  to build #46 rather than after a bad deploy. **The sentence has now been false in two distinct ways**,
  and separating them matters: the first was an absence a ticket could fix, the second is a property of
  the platform that no workflow could.
- **The mechanism that would couple them exists and does not fit.** Vercel's **Deployment Checks**
  imports GitHub Actions results, but it *"will hold each production deployment until all required
  checks pass before assigning it to your **custom production domains**"*, and its documented
  prerequisite is that *"automatic aliasing for production is turned on"*. Doc 12 §7 declines a custom
  domain for an audience of one — so the gate would hold a build back from a domain that does not
  exist, and the prerequisite is the very control the 2026-09-11 entry examined and found undocumented
  on a project without one. Read before deciding, not assumed.
- **Alternatives considered.** *Buy a custom domain*, turn on automatic aliasing and configure
  Deployment Checks — this is the mechanism as designed, and it was rejected because it reverses §7 for
  a DNS record and a certificate maintained for one user, and it holds only the *promotion*: the build
  still happens. *Turn Vercel's git integration off entirely* (`git.deploymentEnabled: false`) and
  deploy from the workflow with `vercel deploy --prebuilt --prod` as a step **after** the suites — this
  genuinely makes CI a gate, because the deploy becomes a later step in the same job, and it is the
  strongest option on the table. Rejected for #46: it needs a `VERCEL_TOKEN` repository secret, which
  reverses #45's *"holds no repository secret at all"* eleven days after that was asserted and tested,
  and it collides with #48's deploy workflow, which is the ticket that should decide it if anyone does.
  *Defer the question to a new child of #40*, rejected because it leaves a known-false safety claim
  standing in a doc, which is the thing this repository has now caught and corrected three times.
- **Reason:** the 2026-09-11 entry already made this trade, in the entry that declined to put a prompt
  in front of a push to `main`: the recovery is better than the prevention — *Promote to Production* is
  seconds and needs no rebuild — and **the failure this repository has actually had is `main` drifting
  behind `develop`**, ten commits at one point, never a red suite reaching production. Nothing about
  the arrangement changes; what changes is that the doc now describes it.
- **Consequence:** #46's acceptance criterion *"CI is observed gating the deploy: a red suite, no
  deploy"* is **unmeetable as written** and is recorded as such rather than quietly ticked. What is
  observed instead is the true statement — a deploy proceeding independently of the run — and the docs
  say so in three places. A reader who wants the gate has the second option above written down with its
  price.
- **Revisit if:** #48 lands and its deploy workflow makes a `VERCEL_TOKEN` secret ordinary anyway, at
  which point deploying from Actions costs one step rather than a reversal, and this is the entry to
  re-read.

### [2026-09-13] `git.deploymentEnabled` is a branch map denying by default, and `vercel.json` sits inside the Root Directory
- **Decision:** `app/vercel.json` carries
  `{"git": {"deploymentEnabled": {"**": false, "main": true}}}` and pins `"buildCommand": "next build"`.
  Five assertions in `app/tests/unit/deploy-config.test.ts` hold both. Ticket #46.
- **The obvious spelling would have broken production silently.** Doc 12 §1 has said since Phase 4 that
  *"non-production deployments are turned off, in `vercel.json`'s `git.deploymentEnabled`"*, which reads
  as a flag. Vercel documents the property as *"`Object` of key branch identifier `String` and value
  `Boolean`, or `Boolean`"* — and a bare `false` *"turn[s] off automatic deployments for **all**
  branches"*, `main` included. There is no boolean meaning "non-production only". A reader following
  the prose would have stopped production deploying and seen no error, only a production that quietly
  stopped moving. §1 now carries the map and the trap; the test's first assertion refuses a boolean by
  name.
- **Alternatives considered.** `{"develop": false}` — Vercel's own documented example shape, no glob,
  no uncertainty, and it satisfies #46's observable criterion exactly. Rejected because the claim in §1
  is not *"`develop` does not deploy"* but *"what is deployed is always whatever is on `main`"*: a
  pushed ticket branch would still mint a public URL, and two of the last five ticket branches had
  remote copies. And `{"develop": false, "feature/*": false, "feature/**": false}` — no reliance on a
  glob spanning a slash, at the cost of an enumeration that goes stale the first time a branch is named
  something else, which is the failure `neon --help` already produced once in #41.
- **The named risk, and why it is acceptable:** Vercel documents minimatch syntax but does not specify
  whether `**` spans the `/` in `feature/46-…`. minimatch's `**` does; their matcher is not written
  down. **It is falsifiable but not yet falsified**, and saying which matters: the observation needs a
  branch pushed *while Vercel is connected*, and Vercel is not connected during the agent half of #46.
  A push of `develop` settles that the file is read at all (§3.1); the first push of a `feature/NN-…`
  branch after the project exists — #47's, in the ordinary course — is what settles whether `**` spans
  the slash. If it turns out not to, the repair is one line: add `"feature/*"` beside it. `main` wins
  its exception by the documented rule that a branch matching several patterns deploys if **any**
  matched pattern is `true`.
- **A fifth assertion exists only to refuse a second `true`.** The per-branch rows would still pass
  with `"develop": true` sitting beside the other two; the one that reads back the enabled list and
  requires it to equal `["main"]` would not. Mutation-checked: that mutation fails exactly one test,
  and it is that one.
- **`vercel.json` is at `app/vercel.json`, and the placement is evidence rather than a documented
  rule.** Vercel says only that the file *"should be created in your project's root directory"* — the
  ambiguous phrase exactly where this project has two candidate meanings. What settles it is their
  monorepo documentation showing the file at `apps/web/vercel.json`, which is a Root Directory rather
  than a repository root. **So it is verified by observation, not by the test:** nothing in
  `deploy-config.test.ts` can assert that Vercel *read* the file, and the check that can is the one #46
  already requires — push `develop`, watch no deployment appear. Wrong placement fails loudly and
  immediately, which is the only reason resting on an inference is acceptable. Doc 12 gains §3.1 saying
  so, so that whoever moves the file knows a green suite is not confirmation.
- **The build command is pinned rather than detected**, although detection produces the same string.
  What detection does not do is refuse a dashboard edit appending to it — and doc 12 §3 spent three
  paragraphs on why `db:migrate` and `seed` do not belong in the build. A value living only in a
  dashboard is a value with no diff.
- **Mutation-checked six ways**, each red attributed: the boolean trap (4 tests), the `main` exception
  removed (2), `**` replaced by a literal `develop` (1), a second exception added (1), the build command
  growing a seed (1), and the file deleted (5). **The #45 restore trap was avoided rather than
  rediscovered** — `app/vercel.json` is untracked, so `git checkout --` would have restored nothing;
  per-file copies were used, and `cp` turned out to be aliased to `cp -i` and refused every restore.
  The matrix survives that only because each mutation writes the whole file rather than amending it,
  which was checked by diffing the file against its original afterwards rather than assumed.
- **Revisit if:** Vercel documents whether `**` spans a slash in a branch pattern, or a branch naming
  convention arrives that the observation on this ticket did not cover.
