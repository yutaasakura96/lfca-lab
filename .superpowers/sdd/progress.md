# SDD Progress — LFCA Study Guide (Cycle 2)

Plan: docs/superpowers/plans/2026-08-10-lfca-study-guide.md
Spec: docs/superpowers/specs/2026-08-10-lfca-study-guide-design.md
Branch: cycle-2-study-guide
Base: 066c8f1 (main)

Cycle 1's ledger is archived at `.superpowers/sdd/progress-cycle1.md`. Its "Task N complete"
lines refer to a DIFFERENT plan and must never be read as cycle 2 progress. Cycle 2 starts at
Task 1 below.

## Pre-flight corrections to the plan

- Fact-check verdict files moved from `.superpowers/sdd/` to `docs/verification/`. That
  directory's `.gitignore` is `*`, so the plan's `git add` would have failed. Cycle 1 hit the
  same trap: `PROGRESS.md` cites `.superpowers/sdd/stage5-results.json`, which was never
  committed — a verdict claim whose evidence is not in the repository.

## Carry to the final whole-branch review (Task 36)

- `PROGRESS.md` (cycle 1) cites `.superpowers/sdd/stage5-results.json`, an untracked file.
  Either commit it or reword the citation. Not cycle 2's defect, but it is a live
  unverifiable-evidence claim in a document cycle 2 is extending.

## Task status

Task 1: not started
