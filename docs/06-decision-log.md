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
