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

Task 2: complete (commit e94f133, review clean)
  Six-cluster sourcing sprint over the 52 waived concepts. **52 waived -> 22.**
  39 of the 52 examined, 30 cleared, 9 declined. 13 pm.project-management.* were never assigned
  to a cluster and stay waived: PMBOK genuinely is the only authority the waiver names for them.

  The recorded waiver reason - "PMBOK and BABOK are paywalled" - turned out to be the real reason
  for almost none of them. vpn had NIST SP 800-77r1. caching-in-applications had RFC 9111.
  pull-request had GitHub's own docs. use-case had the free OMG UML spec. None paywalled; nobody
  had looked. 24 new sources registered, 282 -> 306.

  The 9 declines are substantive, not lazy:
    naming-conventions, capacity-planning - re-confirmed waived on a re-read, holding cycle 2's
      judgement rather than reversing it on identical evidence.
    principle-of-least-astonishment - genuinely unsourceable.
    service-ownership - the SRE book describes team responsibility, never a single named owner.
    mttr-and-mtbf - the SRE book defines MTTR paired with MTTF, never MTBF.
    gap-analysis - TOGAF matches well but now sits behind an account wall, so it is not a freely
      accessible primary source.
    non-functional-requirements - NASA never uses the term as a bucket.
    requirements-elicitation - NASA uses "elicit" as a bare verb twice, nothing definitional.
    feasibility-study - every free source splits the test rather than stating it whole.

  Process notes worth carrying:
  - **Cluster C failed on its first attempt**, stalling for 600s having examined zero of its ten
    concepts. Re-dispatched as C1 and C2 with the PDF-extraction technique cluster A had
    independently discovered, and both completed. Recorded as unrun work throughout, never as a
    negative result.
  - **The applier corrected the controller.** The controller's applier notes asserted IETF RFCs
    are tier 1 in this dataset. The applier checked data/sources.json and found all 30 RFCs are
    tier 2 and all 20 tier-1 sources are Linux Foundation / CNCF / kernel publications - so
    tier 1 here means "the certifying body's own publications", not "highest authority". It
    registered all 24 new sources at tier 2 and recorded the convention as a question for a later
    pass. Following the data over the instruction was correct.

  Known weakness recorded in PROGRESS.md: devops.devops-basics.language-package-managers is now
  sourced from Maven's dependency documentation - a Java-ecosystem document for a
  language-agnostic concept - after npm and pip were checked and neither made the
  application-vs-OS contrast the description turns on.

  Gates: validate 537/0 errors/16 warnings, no stale-waiver; npm test 188/188; check-guide 0/0.

Task 3: complete (commits 727e2fc, 7aaab28; review clean)
  Second adversarial pass over the eight competency files that had only ever had one - and whose
  only prior pass left no verdict record at all.

  **241 claims examined, 9 refuted, 131/131 concepts covered (100%).** Verdict artifacts committed
  under docs/verification/ as factcheck-{cloud-computing,cloud-networking,performance-availability,
  budgeting,cloud-best-practices,sensitive-data,compliance,oss-licensing,topup-cloud,
  topup-security-oss}.json. The 127-refutation pass that preceded this one now has a successor
  that IS auditable from a clone.

  The 9 are NOT 9 factual defects. Split, per .superpowers/sdd/task-3-adjudication.md:
    2 factual errors  - AWS's two-minute spot interruption notice stated in the generic
                        "the provider" voice, in two separate concepts. Azure and Google Cloud
                        give ~30 seconds. Both fixed with per-provider attribution and new
                        sources (azure-spot-vms, google-cloud-spot-vms).
    5 attribution     - claim true, citation does not support it. Fixed by registering the right
                        source, NOT by rewriting correct prose.
    2 unverifiable    - PCI DSS requirement numbers (standard behind a licence gate) and a VMware
                        page returning no fetchable body. Recorded as unverified, not disproven,
                        and nothing changed.

  **The coverage measurement was the most valuable part of this task.** The first eight-agent pass
  examined 206 claims but touched only 101/131 concepts (77%). Every agent honestly said it had
  prioritised the densest claims - but the plan promises a pass over the FILES. Two top-up agents
  closed the 30-concept gap, and immediately found the spot-notice defect in a second concept the
  original pass had never opened. The gap was hiding real errors, not unexamined-but-clean prose.
  Measure coverage; do not accept a claim count as coverage.

  Controller adjudication mattered here. Three refutations read as factual errors and were
  attribution failures. One - `hypervisor` - would have been damaged by literal application:
  the guide named VMware Workstation as a type-2 example, the cited VMware page names Fusion, and
  a naive fix would have swapped a correct widely-known example for a narrower one to satisfy a
  citation. The applied fix keeps both, explains the relationship, and adds KVM as the
  discriminating case.

  SYSTEMIC FINDING - a source cited for content it does not contain, now **seven instances**
  across two cycles, four of them found in this single pass over 8 of 22 files without anyone
  hunting for them: nist-sp-800-61r3, nist-sp-800-145 (x2), cncf-glossary-serverless,
  cncf-glossary-virtualization, aws-rightsizing-whitepaper, aws-budgets. `validate`'s
  unsourced-concept check proves a concept CITES a tier-1/2 source; nothing has ever checked that
  a cited source CONTAINS the claim. Proposed as cycle 4 scope, sized against all 537 concepts
  and 312 sources.

  Two self-report vs measurement gaps, neither serious, both arguing for counting rather than
  believing: the budgeting agent reported "all 13 concepts" and its records name 9; the Task 3
  applier reported 5 sources registered and the diff shows 6.

  Housekeeping: removed a stray 2.1MB nist80050r1.pdf left at the repo root by a research agent.

  Gates: validate 537/0 errors/16 warnings; npm test 188/188; check-guide 0/0. Sources 306 -> 312.

Task 4: complete (commit 6beaab7, review clean)
  PROGRESS.md brought current. It was stale by three commits and asserted two things that were
  demonstrably false.

  - Both false claims retracted IN PLACE with strikethrough + "Superseded 2026-08-11", not
    deleted: (a) line ~970's claim that the eight files carry nothing checked against a primary
    source by any pass - false twice over, since 97cc94b checked them and Task 3 then examined
    241 claims across all 131 of their concepts; (b) line ~1096's "no Knowledge-check answer was
    verified against a source" - false, 97cc94b corrected 25 of them. The comparison-block half
    of that same sentence is still true and was deliberately left standing.
  - Commits 97cc94b, c15e803 and 3a0a7c2 recorded, with the note that the 127-refutation pass
    left no verdict artifact and that Task 3's verdicts ARE committed.
  - `importance` degeneracy recorded at PROGRESS.md ~1492. Numbers verified against the dataset:
    151 at 1, 213 at 2, 173 at 4, none at 3 or 5; per-domain Linux 2 / SysAdmin 4 / Cloud 2 /
    Security 2 / DevOps 1 / PM 1.
  - `## Cycle 3` heading added at ~1139 with a stage table.

  The implementer caught two things on its own: its first draft had wrong domain-weight
  percentages (corrected before commit), and it noticed the plan runs to Task 60 rather than the
  58 the brief said, using the real task list instead.

  Gates: validate 537/0/16; npm test 188/188; check-guide 0/0.

## Pre-work complete

All four pre-work items done. Every one found something material that would otherwise have
propagated into the question bank:
  Task 1 - the exam IS 60 questions; two cycles had recorded the opposite. Exams resized to
           sixteen 60-question papers at real length and pacing.
  Task 2 - waived concepts 52 -> 22; the recorded waiver rationale was the real reason for
           almost none of them.
  Task 3 - 241 claims checked across 131 concepts, 9 refuted; coverage measurement showed the
           first pass had reached only 77% and the gap was hiding real errors.
  Task 4 - two false claims retracted, three commits recorded, importance degeneracy captured.

Authoring cannot start until the tooling exists. Next: Tasks 5-13 (TDD), then the pilot.

