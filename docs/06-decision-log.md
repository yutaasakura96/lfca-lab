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
