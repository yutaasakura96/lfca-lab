# Project status

**Project:** An LFCA exam simulator built on this repo's existing 1,150-question bank — three
modes (exam, practice, domain) replacing the sixteen static markdown practice exams.
**Phase:** 4 — Tech docs
**Updated:** 2026-08-29

## Done
- **Phase 1 — Brief + PRD.** [01-project-brief.md](01-project-brief.md),
  [02-product-requirements.md](02-product-requirements.md),
  [06-decision-log.md](06-decision-log.md).
- **Phase 2 — Design exploration.** One direction, built as a system, in `design/`.
  Canvas: <https://claude.ai/code/artifact/141693a7-0b34-4fae-a25e-72ecad4b3d30>
  14 artboards over 3 pages — the token system (colour / type-space-form / semantic + interaction
  states), 8 desktop screens, 3 phone screens.
- **Phase 3 — Extract.** [05-design-system.md](05-design-system.md),
  [10-screen-specifications.md](10-screen-specifications.md). Values extracted from
  `design/tokens.css`, not invented.

## Next
**Phase 4 — Tech docs.** Run `/project`. Produces `03-technical-design.md`,
`04-database-schema.md`, any triggered Tier 2 docs, and **`CONTEXT.md`** — interviewed against
question banks 03 and 04 in the planning template.

Phase 4 does **not** need to re-derive anything about the UI. `05-design-system.md` pins every value
and `10-screen-specifications.md` describes all eight screens including empty/loading/error and
mobile behaviour. What Phase 4 owes the design: the two places the spec deliberately defers to it —
the **button loading state** (§7.2 of doc 05, unspecified because the prototype had no async action
slow enough to need one) and the **save-failure surface** in exam mode (doc 10 §4 states the
behaviour; the retry/queue mechanics are a technical decision).

## Blocked
_(nothing)_

## Carrying
- **Data half is built and stable; the simulator only reads it.** 537 concepts, 1,150 questions
  (1,000 `exam` pool + 150 `supplement`), 16 generated exams, drills, study guide.
- **Measured facts the plan rests on** — re-derive nothing:
  - The 16 exams are a clean partition: **960 distinct questions, zero overlap, 40 pool items
    unused.** Those 40 are the pinned holdout.
  - The 16 exams already match the official domain weights to within one question
    (SysAdmin 18 / Cloud 11 / Linux 10 / Security 8 / DevOps 7 / PM 6, per 60).
  - Per-domain exam pools: SysAdmin 300, Cloud 180, Linux 160, Security 140, DevOps 120, PM 100.
  - Question JSON shape: `{competency, items[]}`; each item has `id`, `concept_id`, `pool`,
    `type`, `difficulty` (1–5), `stem`, `options[]` with `correct`, `why`, `provenance`.
  - Real exam figures at HIGH confidence: **60 questions, 90 minutes, 75% (45/60)**.
- **Owner context:** sat LFCA 2026-07-11, scored **71 against 75** — No Pass by ~2 questions.
  One free retake, unbooked. This entire repo was built *after* that attempt.
- **Riskiest assumption:** the bank has never been tested against the real exam. Mitigated by
  the 40-question holdout and by first-attempt scoring. Do not weaken either.
- **Tech already decided by the owner** (Phase 4 will formalise): **Postgres**, **Better Auth +
  Google OIDC in v1**. Deferring auth was proposed and overruled twice — do not re-litigate.
- **PRD §7 open assumptions:** assumption 1 (domain-mode length) **resolved 2026-08-29** — selector
  20 / 40 / all, default 20. Assumption 2 (practice mode = 60) stands and matches the prototype.
- **`design/tokens.css` is the source of truth for every visual value.** Copy it into the app
  verbatim; `05-design-system.md` explains and pins it but does not replace it. The `*.dc.html`
  artboards and the seeded canvas are gitignored — run `node design/build.mjs` to regenerate.
- **Every score, timing and mastery figure in the prototype is invented sample data.** The only real
  figure is the per-domain split on the review screen.
- **Contrast is verified, not assumed** — 40 pairs, both themes, all passing. Re-run
  before shipping if any colour token changes.
- **Design work sits on branch `design/practice-app-system`, unmerged.** `.claude/launch.json` was
  added (untracked) to serve `design/` locally for the measurement harness.
- **Resolved from Phase 2's unverified item:** the canvas editor does **not** flatten authored custom
  properties. The token block lives in each artboard's `<style>`; visual edits only write inline
  styles on the specific element edited. Phase 3 extracted from `tokens.css` regardless.

## Skipped
_(nothing)_
