# Project brief — LFCA exam simulator

**Status:** approved, Phase 1, 2026-08-28
**One page. The "why does this exist" document.**

## What this is

An interactive LFCA exam simulator that turns this repo's existing 1,150-question bank into
timed, scored sittings and untimed practice — replacing the sixteen static markdown exams with
something that actually simulates sitting the exam, records what you answered, and explains
every option after the fact.

## The problem, and whose it is

The repository owner sat the LFCA on **2026-07-11 and scored 71 against a 75 pass mark** — a
No Pass by roughly two questions on a 60-item exam. One free retake remains, unbooked.

Everything in this repo was built *after* that attempt: first commit 2026-08-04, study guide
2026-08-10, question bank 2026-08-11/12. The material now exists and is stable. What does not
exist is any way to work it under exam conditions, or any record of which questions were
answered correctly. The sixteen practice exams are markdown files with the answers in a
sibling file — sitting one honestly requires self-discipline, and produces no data.

**First and only user: the repository owner.** Others, possibly, later — not a v1 concern
beyond keeping the door open.

## Success

**The bar, in the owner's words: re-sit each of the sixteen exams until every one scores 100%.**

Re-sits are explicitly allowed. There is no readiness dashboard, threshold, or gating to
build — the app shows a list of sixteen exams with the best score beside each, and a way to
sit one again. That is the whole of it.

Alongside best score, the app also **records first-attempt score per exam**. Not as a target —
as an honest second number. Best score drifts to 100% by construction once repeats are
allowed; first-attempt does not, and it is the only readiness signal not contaminated by
memory.

- **30 days:** exam mode works end to end. Several exams sat under the clock, scored, reviewed.
  First-attempt scores exist for the first time.
- **6 months:** all sixteen exams at 100%, the 40-question holdout sat once, retake booked.

## Explicitly out of scope for v1

1. **Authoring or editing questions in the app.** The bank stays authored as JSON in this repo,
   validated by `npm run validate`, built by `npm run build-exams`. The simulator only reads it.
2. **Adaptive or spaced-repetition question selection.** No algorithm choosing what to serve
   next from past performance. Selection follows the official domain weights, or a domain the
   user picks. Adaptive selection is the most tempting feature here and the least verifiable —
   it needs history, tuning, and a way to tell whether it is helping. Revisit once real answer
   data exists.
3. **Rendering the study guide inside the app.** `study-guide/` stays 32 markdown files read in
   an editor or on GitHub. The app serves questions only. The per-option `why` text already
   delivers the explanation at the moment of being wrong, which is where it matters most.
4. **Multi-user features.** Google sign-in ships in v1 (see decision log), but nothing built on
   top of it: no sharing, no leaderboards, no per-user content, no other accounts. One user,
   authenticated.
5. **Mobile-native app.** Web only.

## The riskiest assumption

> **This question bank has never been tested against the real exam.**

It was written after the failure, largely by inference from the published objectives. 790 of
its 1,150 items sit at difficulty 3; 527 of them are "application" type. That is a narrow,
self-chosen distribution. The owner's own reading of the failed attempt was partly *"the
questions didn't look like what I practiced"* — and while that referred to pre-repo material
rather than this bank, nothing yet rules out this bank repeating the error in a new direction.

**If this assumption is wrong, the simulator will report 100% across sixteen exams and the free
retake will be spent discovering the bank was calibrated to the wrong thing.**

Two mitigations, both adopted:

- **The 40-question holdout.** The sixteen exams use 960 of the 1,000 exam-pool items with zero
  overlap; 40 are unused. The simulator never serves those in any mode. They are sat once, at
  the end, as the only check that will ever run on genuinely unseen material.
- **First-attempt scoring**, above — so the honest number stays visible next to the flattering
  one.

## What kind of project this is

**A serious side project.** Postgres from day one, Google sign-in from day one, possibly public
later. Not a weekend hack, not a product with users to answer to. Scale the engineering to
"the owner will maintain this for six months and might open it up," not to "this needs to
survive strangers."
