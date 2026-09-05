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
