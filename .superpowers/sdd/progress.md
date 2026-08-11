# SDD Progress — LFCA Question Bank (Cycle 3)

Plan: docs/superpowers/plans/2026-08-11-lfca-question-bank.md
Spec: docs/superpowers/specs/2026-08-11-lfca-question-bank-design.md
Branch: cycle-3-question-bank
Base: 51eb69c

Cycle 1's ledger is archived at `.superpowers/sdd/progress-cycle1.md` and cycle 2's at
`.superpowers/sdd/progress-cycle2.md`. Their "Task N complete" lines refer to DIFFERENT plans
and must never be read as cycle 3 progress. Cycle 3 starts at Task 1 below.

This directory's `.gitignore` is a single `*`, so this file is tracked only because it was
force-added. Any new artifact under `.superpowers/sdd/` that needs committing must be
`git add -f`'d — which is why cycle 3's verdict and capture artifacts live under
`docs/verification/` instead. Cycle 1 lost `stage5-results.json` to exactly this trap.

## Pre-flight corrections to the plan

Two internal conflicts found before Task 1, both fixed in the plan (commit follows):

1. **Global Constraints said `npm run check-bank` joins the green gate "from Task 11 onward".**
   Wrong twice: the CLI is created in Task 12, and it cannot exit 0 until the bank is complete
   at Task 58 — Task 12 Step 6 itself expects exit 1 with 537 `q-concept-coverage` errors.
   Corrected to: exists from Task 12, scoped-and-suppressed form is the per-task gate during
   authoring, unscoped run becomes a hard gate at Task 58.
2. **Tasks 5–13 state running `npm test` counts (202, 210, 223, 234, 251, …).** They chain, so
   one test landing differently makes every later count wrong, and an implementer chasing the
   number could weaken a test to hit it. Marked indicative; the requirement is that the suite
   passes and grows.

## Minor findings carried to the final whole-branch review (Task 60)

- Task 1's implementer reported a "MAJOR FINDING" that the certification page's domain weights
  contradict the project. It was FALSE — the page matches `data/competencies.json` exactly on all
  six weights, and the note compared against a 20/20/20/16/16/10 set that is neither the retired
  set (20/20/20/16/16/8) nor the current one. Retracted in the manifest at 2edb2d4. Worth a lens-1
  check that no other artifact absorbed the false version.

## Task log

Task 1: complete (commits 82a8272..bdcbd96, plus spec and plan amendment; review clean)
  P1 re-fetched the three Linux Foundation pages in a browser and committed the capture of record
  at `docs/verification/exam-facts-2026-08-11/`. It overturned a foundational claim.

  **The Linux Foundation DOES publish a question count: 60.** The Multiple Choice Exams:
  Important Instructions page states "the multiple-choice exam is delivered online and consists of
  60* multiple-choice questions. * CNPA exam consists of 85". Cycles 1 and 2 both recorded that no
  official source states a count, and both dismissed the circulating third-party figure of 60 as
  unverified tier-3/4 noise. That figure was right.

  Verified independently by the controller re-fetching the page before escalating. Adopted by
  owner decision on 2026-08-11 at HIGH confidence, inheriting the same classification-chain caveat
  exam-mechanics.md already attaches to the 75% pass mark — the certification page's own
  "Multiple Choice Exam" label is the chain that already carries the 90-minute and 75% figures to
  LFCA, and accepting it for two facts while rejecting it for a third is not defensible.

  Consequences applied:
  - 60 questions / 90 minutes = 90 seconds per question; 45 of 60 correct to pass. The owner's
    71% is 42-43 correct: two to three questions short.
  - Practice exams change from ten 100-question papers to **sixteen 60-question papers**, real
    exam length. Composition per exam 18/11/10/8/7/6 (SysAdmin/Cloud/Linux/Security/DevOps/PM),
    the largest-remainder rounding of weight x 60. Linux binds the count at 160/10 = 16 exams.
    16 exams consume 960 of the 1,000-item pool; **40 items appear on no paper** (0/12/4/12/8/4)
    and are listed by id in `exams/index.json` rather than left as a silent residue.
  - The no-question-count rule is retired repo-wide and replaced with a sourced-figure rule.
    Check 19 renamed `q-no-question-count` -> `q-question-count` and inverted: it now requires the
    sourced header on every exam and forbids any count other than 60.
  - Visible retractions (not silent edits) in PROGRESS.md, research/exam-mechanics.md,
    study-guide/README.md, study-guide/STYLE.md, study-guide/04-security.md.
  - Spec amended with an "Amendment, 2026-08-11" section; plan amended in Tasks 5, 6, 11, 13, 58,
    60 and the definition of done.

  Also corrected: one false major finding (see above), and `data/sources.json` accessed dates.
  Gates after: npm test 188/188, validate 537/0 errors/16 warnings, check-guide 0/0.

