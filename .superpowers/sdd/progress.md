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

(none yet)

## Task log

