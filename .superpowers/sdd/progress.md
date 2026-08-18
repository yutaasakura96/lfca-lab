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

- **`commands_covered` is unchecked metadata and already drifts.** Check 5 proves every required
  command string appears verbatim as a code span in one of its concept's items - that is the
  property that matters and it passes. But nothing validates the item's own `commands_covered`
  array against it. Measured on Linux Operating System: the dataset requires 21 strings (20
  unique), the items declare 18 (17 unique), omitting `lscpu`, `env` and `hostnamectl` - and the
  scoped check is still clean. Either add a check tying the field to the item's actual code spans,
  or stop treating it as data. Task 59 must not quote `commands_covered` totals as coverage
  figures.

- **Templated distractors are invisible to the harness.** The Linux Operating System author, while
  fixing the answer-length bias, lengthened 123 of its 150 distractors using 12 rotated template
  clauses - meta-commentary like "a neighbouring concept, just one scenario in front" that
  describes a distractor's ROLE rather than stating a wrong answer. A candidate could find the key
  by elimination without knowing the subject. Check 17 compares stems only, and pairwise
  distractor similarity measured 0 pairs above 0.70 because the templates sat on varied content,
  so NOTHING flagged it. Found only because that agent volunteered the concern instead of
  reporting clean, and confirmed by a controller scan for reused 6-token tails. Repaired to 0.
  **The other 11 files measured 0 templated tails**, so it was one agent's approach rather than a
  consequence of the length-cue instruction - but a check for reused distractor tails would be
  cheap insurance.

- **The `confused_with` graph may be under-populated where the guide already teaches a
  distinction.** The Functional Analysis author reported that `verification-vs-validation` and
  `feasibility-study` carry empty `confused_with` arrays in `data/topics/06-it-project-management.json`
  despite the guide's prose framing them as comparisons (feasibility against gap-analysis).
  It correctly tagged those distractors `sibling` rather than inventing an edge. Worth a sweep:
  a concept whose prose teaches a boundary but whose data records no edge produces no comparison
  block, so check 4 never requires an item on it.

- **check 21 does not require `sources_read`.** The verification object schema in the plan and the
  Verification Task Protocol both include `sources_read` (the URLs actually fetched), but
  `checkVerdictCoverage` validates only `agent_label`, `verdict`, `checked` and `reasoning`. As
  built, a verifier can record a confirmed verdict without naming anything it read - a claim
  without evidence passing the gate whose entire purpose is to demand evidence. Recommend
  requiring a non-empty `sources_read`. Lens 4 of the final review ("can check-bank be satisfied
  by a bank that does not teach?") is the right place to settle it.
- The plan's own `runAllQuestionChecks` test asserted zero errors unfiltered while
  `checkDomainDistribution` structurally cannot pass on a 42-item fixture. Task 11 concluded the
  test was wrong and excluded distribution there, matching the exclusion the brief already applied
  elsewhere. Plan defect, correctly resolved.

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

Task 5: complete (commit 27e87df, controller-verified)
  tools/lib/allocation.mjs + 19 tests. 188 -> 207. Independently verified against the real
  dataset: pool exactly 1000 (300/180/160/140/120/100 by domain), supplement 150, bank 1150;
  min 1 max 5 per concept; a depth-1 concept gets exactly 1 in every domain; examComposition
  18/11/10/8/7/6 summing to 60; 16 disjoint exams consuming 960 with 40 unused; deterministic
  across independent loads; 537 allocations covering all 130 comparison blocks. `importance`
  appears nowhere in the module, as designed.

Tasks 6 and 7: complete (commits 9e3043b, 606cd8a, controller-verified)
  tools/lib/rng.mjs (+8 tests) and tools/lib/similarity.mjs (+13). 207 -> 215 -> 228.
  Batched into one dispatch as two separately-committed deliverables: both are small, fully
  specified in the plan, and mutually independent.
  Verified: balancedPositions is deterministic, produces exactly 15/15/15/15 for ALL SIXTEEN
  exams, differs between exams, and is not the giveaway A/B/C/D cycle. Thresholds are the
  reviewed constants 0.85/0.7. Short plurals (dns, ips, os) survive the trailing-s rule.
  Zero non-comment occurrences of Math.random, Date.now or new Date across all three cycle-3
  modules - checked by stripping comments first, since rng.mjs contains a comment saying
  "never from Math.random" that a naive grep flags.
  No threshold or test wording needed adjusting; the brief's code and tests passed verbatim.

  Process note: task report filenames now carry a `cycle3-` prefix. Task 5's report overwrote
  cycle 2's `.superpowers/sdd/task-5-report.md`, which was local-only (this directory is
  gitignored) so nothing committed was lost, but the collision was avoidable.

Task 8: complete (commit a0efc9e)
  tools/lib/question-load.mjs + the tools/test/fixtures/bank/ fixture set. 228 -> 239.
  Built the fixture at poolTotal 40 rather than the brief's 20, pre-empting a rebuild Task 10's
  brief flags (its length-cue check needs a population of at least 20). 42 items, 6 concepts,
  2 competency files, plus a fixture guide with 6 anchors.
  Good judgement recorded: the implementer used provenance kind `confusable` ONLY for the one
  pair the fixture topics actually declare in confused_with, using `sibling` elsewhere -
  anticipating that check 8 validates the edge exists in either direction.

Task 9: complete (commit 47c8ab0, controller-verified)
  Checks 1-6 and 11 in tools/lib/question-checks.mjs + 17 tests. 239 -> 256. Fixture passes all
  seven; each check was seen to FIRE on a mutation, so none is untested.

  **Task 9 caught two real defects in Task 8's fixture that the controller's own verification had
  missed**, and this is worth carrying:
    - every non-widget item's comparison_block named a block assignBlocks never produces (the
      fixture's confused_with edges only ever yield cmp-alpha.things.widget);
    - difficulty cycled 1-5 by index instead of equalling the concept's required_depth.
  The controller had verified comparison_block was PRESENT, not that it RESOLVED, and had run
  validateItem, which only checks difficulty is an integer 1-5 and cannot know whether it matches
  the concept. Both are semantic properties against the dataset, which is exactly what checks 4
  and 11 exist for - they fired the moment they existed. Lesson: controller spot-checks test
  structural validity; only the checks test semantic correctness. Do not report a fixture as
  "verified" on the strength of a structural pass.

Task 10: complete (commit 8afbc85, controller-verified)
  Checks 7-10 and 12-14 + 15 tests. 256 -> 271. Fixture passes all seven; each seen to fire.
  Third fixture defect class found: 31 items carried TWO misconception distractors each, against
  the at-most-one rule. Retyped the redundant slot to `lookalike` with real text.

Task 11: complete (commit f97452b, controller-verified) - THE 21-CHECK HARNESS IS COMPLETE
  Checks 15-21 + runAllQuestionChecks + 18 tests. 271 -> 289. Each of the 7 seen to fire.
  Fourth and fifth fixture defect classes found: every item had `verification: null` (check 21
  correctly flagged all 42), and items within a concept were templated copies whose stems differed
  only by a digit (check 17 correctly flagged real duplication). All 42 stems rewritten to
  distinct scenarios; controller verified max pairwise stem similarity is now 0.588 against a
  0.7 warn threshold, so there is real headroom rather than a value tuned to just pass.

  Controller verification: 21 checks implemented; the only finding on the fixture is
  checkAnswerPositionBalance, which correctly errors because ctx.generated is null until
  build-exams runs and is designed to name that command rather than pass silently.

  **The fixture was wrong five times across Tasks 8-11, and each time it was the NEXT check layer
  that found it** - unresolvable comparison blocks, difficulty not matching depth, duplicate
  misconception slots, null verdicts, templated stems. None was visible to the layer before it,
  and none was visible to the controller's structural spot-checks. That is the harness earning its
  cost on a 42-item fixture before it ever sees 1,150 real items.

Task 12: complete (commit 73e9ef1, controller-verified)
  tools/question-plan.mjs and tools/check-bank.mjs + 6 CLI tests + 3 npm scripts. 289 -> 295.
  Controller-verified guardrails: --except without --scope is refused; an unknown scope fails
  loudly listing all 22 valid competencies rather than matching zero and reporting zero errors;
  a suppressed run prints a banner AND repeats the suppression in its summary line.
  `npm run check-bank` correctly exits 1 with 1699 errors (537 concept-coverage, 623
  count-derived, 380 command-coverage, 130 comparison-coverage, 21 diagnostic, 7 distribution,
  1 position-balance) - the expected state before any question exists, exactly as check-guide
  reported 537 missing concepts throughout cycle 2's writing.
  question-plan verified to print confused_with neighbours WITH the neighbour's own description
  and full comparison-block membership - without that, 22 authors would invent distractors
  instead of deriving them. Its header for DevOps :: Containers matches the controller's
  independently computed table exactly: 24 concepts, 48 exam + 38 supplement = 86, 4 blocks,
  17 command strings.

  Two brief defects found: the plan's own error message for --only/--except lacked the substring
  its own test regex required (fixed); and the plan's table said Git Concepts has 1 waived concept
  when Task 2's un-waiving of devops.git-concepts.pull-request makes it 0 - the plan states the
  brief is authoritative over that table, and it is.

Task 13: complete (commit 901929f, controller-verified at full scale)
  tools/lib/assemble.mjs + tools/build-exams.mjs + 12 tests. 295 -> 307. All pinned numbers
  confirmed by independent controller run over a synthetic full-scale bank:
    16 exams of exactly 60; composition 18/11/10/8/7/6 held in EVERY exam; no repeated concept
    or comparison block within a paper; exams disjoint; used(960) + unused(40) = pool(1000);
    61 documents (16 exams + 16 answer keys + 29 drills); byte-identical across two runs;
    exam-01 key positions exactly 15/15/15/15; the 40 unused items recorded by id.
  DEPTH_TOLERANCE unchanged and the brief's placement order converged at full scale first time -
  no tolerance was widened to make a build pass.
  The implementer flagged honestly that it had not independently recomputed the 61-document
  figure; the controller did, and it is correct.

## Tooling complete (Tasks 5-13)

The 21-check harness, the deterministic assembler and both CLIs exist before a single question
does. npm test 188 -> 307.

What the build cost in defects, worth carrying into cycle 4: the 42-item fixture was wrong FIVE
times across Tasks 8-11, and each time it was the next check layer that caught it - unresolvable
comparison blocks, difficulty not matching required_depth, duplicate misconception slots, null
verdicts, templated stems. None was visible to the layer before it. None was visible to the
controller's structural spot-checks, which test shape rather than meaning. Building the harness
against a known-good fixture BEFORE authoring is what made those cheap.

Two plan defects found and fixed rather than worked around: an error message lacking the substring
its own test regex asserted, and a runner test asserting zero errors while checkDomainDistribution
structurally cannot pass on a small fixture.

Task 14: complete (commit 2751d1c) - PILOT
  questions/02-system-administration/disaster-recovery.json, 30 items over 18 concepts, 6 blocks
  named, 2 command strings, 1 waived concept. Scoped check-bank: 0 errors, 0 warnings.
  Written by the controller directly.

  The pilot found FIVE defects, one of them structural and corpus-wide:

  1. **Depth-1 concepts have no `c-` anchor.** Their only definition site is a Quick reference
     table row (STYLE.md s2), which cannot carry an HTML anchor - so the guide defines c-<id> for
     all 498 depth-2+ concepts and NONE of the 39 depth-1 ones. question-plan emitted one anyway
     and check 13 would have rejected it 39 times. Fixed in tools/question-plan.mjs to emit the
     enclosing `#s-<competency>-<section>` anchor; verified to resolve for all 39.
  2. **A third check must be suppressed during scoped authoring** - q-domain-distribution, which
     compares the whole bank against the 1,000-item weight table. Protocol named only two. Fixed.
  3. `confusable` requires a real confused_with edge; over-applied 3 times. Most distractors are
     `sibling`.
  4. Two options that are nothing but a code span normalize identically and collide under check 9.
     Write the command inside a phrase.
  5. Length cue: a precise key is naturally the longest option. First draft tripped at 53% against
     a 40% threshold. Fix by lengthening a distractor, never by truncating the key.

  Recorded in docs/verification/qbank-findings.md as pilot notes for the remaining 21 authors,
  and the protocol fixes are in the plan.

  **Controller error, recorded rather than quietly fixed:** the pilot notes' type and provenance
  statistics were first written from recall and were wrong (6/1/5/18 for types against an actual
  16/7/6/1). Caught by computing them. That is this project's most persistent defect class
  appearing inside the notes warning other authors about it.

Tasks 15-35: complete - THE QUESTION BANK IS WRITTEN
  22 competency files, 1,150 items, exam pool exactly 1000 and supplement exactly 150,
  covering all 537 concepts. Written in four waves of parallel authors; the controller committed
  each wave centrally because parallel agents writing separate files do not conflict but parallel
  `git commit` calls do.

  Unscoped check-bank: 1151 errors, being exactly 1150 q-verdict-coverage (verification not yet
  run) and 1 q-answer-position-balance (exams not yet built). Nothing else. 0 warnings.

  **The dominant defect of the authoring phase was one the harness cannot see.** Every author was
  told to fix the answer-length bias by lengthening distractors. Mechanical compliance produced a
  NEW tell each time, in four distinct forms across six files:
    1. Rotated template tails describing a distractor's role ("...a neighbouring concept, just one
       scenario in front") - 123/150 distractors in linux-operating-system.
    2. Clause-count gap - cloud-computing came out keys 0% two-sentence, distractors 81%. Pick the
       one-sentence option and you are right almost every time.
    3. Self-identifying distractors - 9 in cloud-computing and 9 in security literally said "which
       the guide corrects directly by...", announcing their own wrongness.
    4. Raw description text dumped mid-sentence after a connector ("in a system where that is
       documented as: ...") - 38 in command-line, often about a different subject entirely.
  Plus generic filler reused across unrelated distractors, and one clause that was meta-commentary
  about question design itself ("exactly the assumption a well-designed scenario question is built
  to expose").

  **None of it was caught by any of the 21 checks.** Check 17 compares stems, not options.
  Pairwise distractor similarity measured zero pairs above 0.70 in every case, because the
  boilerplate sat on genuinely varied content. It was found by two ad-hoc controller scans - one
  for six-token tails reused three or more times, one comparing the two-sentence rate of keys
  against distractors - after ONE agent volunteered the concern instead of reporting clean.

  Four repair rounds were needed, and each round that named specific phrases left a different set
  behind; only the final round, defined by rule rather than by pattern list, cleared it. Final
  state verified by controller scan: 0 templates, 0 shape gaps over 25 points, 0 padded or
  meta distractors across all 3,450 distractors.

  **Recommendation for cycle 4: add a distractor-shape check.** Reused tails, key-versus-distractor
  clause-count gaps, and meta-commentary phrases are all cheaply detectable and all invisible today.

  Process failures worth recording:
  - **Two agents reported work as "running in the background" and returned having written
    nothing**, one after a single tool call. Neither claimed completion, but a controller skimming
    reports could read them as progress. Caught by checking the filesystem.
  - **The controller then over-corrected**, re-dispatching command-line and system-administration
    when the originals had in fact done the work - both pairs raced and duplicated effort. An
    agent's report describes intent; only the artifact describes reality, and that cuts both ways.
  - **One agent was killed mid-task by the session usage limit** (security.json), having fixed 21
    of its 22 outstanding warnings. The controller wrongly reported it as "landed clean" from
    seeing the file exist in a scan, then corrected that.
  - **An agent caught an error in the controller's brief**: it was told to write an OOM-killer item
    for System Administration, but no concept in that competency covers the OOM killer - it is in
    Troubleshooting. It refused to fabricate rather than satisfy the instruction.

Tasks 36-41: complete (commit a2476cf) - VERIFICATION WAVE A
  Six competencies, 138 items: disaster-recovery 30, troubleshooting 23, sysadmin best-practices 27,
  functional-analysis 15, software-application-architecture 17, sensitive-data 26.
  **138 of 138 items carry a verdict. 31 were refuted on first pass, rewritten and re-verified;
  final state 138 confirmed, 0 refuted.** Unscoped check-bank moved 1151 -> 1013 errors, being
  exactly 1012 q-verdict-coverage + 1 q-answer-position-balance. Sources 312 -> 320.

  Controller verified every file against the FILESYSTEM, not the reports: item counts, verdict
  counts, `checked` completeness against each item's own option refs, non-empty `sources_read`,
  agent_label correctness, plus independent re-runs of the two shape scans. All six clean.

  **The citation defect is no longer "systemic", it is the norm.** 22 further instances of a source
  cited for content it does not contain, in 138 items - against seven found in the whole of cycles
  1 and 2. Troubleshooting alone had eight in 23 items. Examples: `man-resolv-conf` cited for
  systemd-resolved and 127.0.0.53; `man-df` for deleted-but-open files; NIST SP 800-128 for "alert
  fatigue" (the phrase is absent); SP 800-40r4 for "maintenance window" (absent); SP 800-34r1 for
  "failback" (absent); the CNCF glossary for per-service data ownership (absent); `nist-sp-800-122`
  for classification schemes (absent); the CSRC glossary for "data in use" (404, no such term).
  Every one was fixed at the citation. **No correct content was weakened to match a thin source** -
  the Task 3 `hypervisor` precedent held.

  Three defects the 21 checks structurally cannot see, each a distinct class:
  1. **Two options asserting the same answer.** sysadmin best-practices had two options headlined
     "Least privilege" and two making the same authoritative-inventory claim. Both eliminable on
     sight without knowing the subject. Sibling of the distractor-shape gap already queued.
  2. **A distractor that is also correct.** Five found. The sharpest: software-architecture's
     `curl -I -X DELETE` distractor, whose `why` claimed `-I` overrides `-X`. The curl manual says
     `--request` "does not alter the way curl behaves" - the DELETE really is sent and the status
     line really does print, so the distractor satisfied the stem. Only fetching the manual settles
     it. Also two double-keys in functional-analysis, one of them on the competency's own defining
     axis: the key and a distractor both turned on "no threshold attached" while the stem said
     "five failed login attempts".
  3. **A guide sentence that is true but misreadable.** sensitive-data's key asserted GDPR Art 4(1)
     names an online identifier as identifying a person *directly*; Art 4(1) reads "directly or
     indirectly" and Recital 30 conditions it on combination. Traced to the guide's Traps
     paragraph, where "directly" meant *expressly* and the author read it as *as a direct
     identifier*. The guide was not wrong, and it still produced a wrong item. Nothing in the
     harness can see this; a sweep for true-but-ambiguous guide prose is cycle-4 scope.

  Process:
  - **A shared-scratchpad collision fired.** The scratchpad is shared across parallel agents; Task
    36 wrote a generically named `apply.mjs`, Task 37 overwrote it between write and run, and Task
    36 executed Task 37's script. It happened to be idempotent. Controller re-verified
    troubleshooting.json after the fact - 23 items, 23 unique ids, all correctly labelled, scans
    clean. Later waves must use task-numbered scratchpad filenames.
  - **Concurrent read-modify-write on `data/sources.json` did not clobber**, but only by luck of
    timing. Controller diffed against HEAD: 312 -> 320 with zero ids lost, and both touched topic
    files hold their full id set. Worth a serialised applier if a later wave registers more.
  - **A false refutation was caught by the agent that nearly made it.** Task 36 first recorded
    hot-warm-and-cold-sites.01 as unsourced from reading NIST SP 800-34r1 section 3.4.3, then found
    the stem verbatim in chapter 5 and confirmed it. Reading one section and declaring a claim
    unsourced manufactures false refutations exactly as recall manufactures false confirmations.
  - **The findings queue was empty and is being filled retroactively.** `qbank-findings.md` still
    read "None raised by the pilot" - 21 wave authors appended nothing across 1,120 items, so
    Step E had almost nothing to adjudicate. Four of the six wave-A agents appended their own
    competency sections. Task 60 must not read the thin queue as evidence the bank was clean.

  Two decisions deferred to the controller rather than taken silently, both correct to defer:
  - **SWEBOK Guide v3.0 is free** (IEEE CS) and cleanly settles two of the 22 still-waived
    concepts, `requirements-elicitation` and `non-functional-requirements`. De-waiving touches
    `sourcing-waivers.json`, `waived_source` flags and the bank-wide validate warning count, so it
    was left alone. This is a third independent demonstration that the waiver rationale does not
    survive contact with a search.
  - **`feasibility-study` has no `confused_with` edge** but the guide prose, two `data`
    descriptions and two bank items all run the gap-analysis/feasibility discrimination, tagging
    distractors `sibling` for want of an edge. Adding the edge creates a comparison-block
    obligation in the guide. `verification-vs-validation`, the other half of the ledger's open
    question, is **correct as modelled** - it is one concept containing its own comparison, with no
    second concept to point at.

  Non-finding, checked and dismissed: all 1,150 keys sit at option index 0 bank-wide. That is by
  design - `orderedOptions` in tools/lib/assemble.mjs places the key from `assignPositions` for
  exams AND drills, and the module comment says authors never choose a position precisely so the
  bank carries no positional bias for the assembler to inherit.

Tasks 42-47: complete (commit 9616c95) - VERIFICATION WAVE B
  Seven agents over six competencies, 212 items: budgeting 31, linux-operating-system 50 (SPLIT),
  performance-availability 33, cloud best-practices 32, compliance 32, devops-basics 34.
  **212 of 212 items carry a verdict. 124 refuted on first pass, rewritten and re-verified.**
  Corpus now 350/1150 verified; unscoped check-bank 1013 -> 801 errors (800 verdict-coverage +
  1 position-balance). Sources 320 -> 399. Gates green: npm test 307/307, validate 537/0/16,
  check-guide 0/0. Every file controller-verified against the filesystem.

  **Task 43 was split by concept range** (43a items 1-25, 43b items 26-50) because 50 items
  exceeded what a wave-A agent finished comfortably, and wave B's first attempt died on the
  session limit. Both agents wrote to ONE shared JSON with short read-modify-write windows:
  final state 25 items per label, **zero range violations, zero lost edits**. The split works and
  is the pattern for the five remaining large files.

  **The refutation rate tripled, and the cause is the source tier, not the authors.**
    wave A  31/138 = 22%   (sysadmin, security, PM - NIST/ISO/man-page sources)
    wave B 124/212 = 58%   (cloud, devops - vendor documentation)
  Worst: devops-basics 30/34 (88%), performance-availability 26/33 (79%), cloud best-practices
  22/32 (69%). **73 further citation failures**, taking the project total past 100.

  **The dominant shape is new and specific: the LANDING PAGE.** The item cites the right document
  SET at the wrong depth - one or two clicks above the page carrying the claim.
  `aws-well-architected-reliability-pillar` is `welcome.html`, an abstract and a pillar list, and
  it was cited by all NINE high-availability/fault-tolerance/redundancy/failover/stateless items
  in performance-availability. `aws-well-architected-pillars` (six pillar names, nothing else) was
  cited by 5 items in one file and 6 in another. `aws-kms` cited for both encryption-by-default
  items carries nothing on at-rest vs in-transit. This differs from wave A's misses, which were
  topically WRONG sources; these are topically RIGHT sources that do not contain the sentence, and
  they survive a plausibility check precisely because the name always looks correct next to the
  claim. Measured exposure: **105 of 364 registered sources had a landing-page-shaped URL**
  (<=2 path segments) at the time of the sweep, concentrated in the cloud/devops/container files
  that are still unverified.

  Three worse-than-citation defects:
  - **A cited source that CONTRADICTS the item it is cited for.** budgeting `orphaned-resources.01`
    had a distractor whose `why` claimed most providers do not delete disks on instance
    termination; the cited AWS whitepaper says terminating an instance automatically deletes
    attached EBS volumes. The item taught a false lesson while citing the document refuting it.
  - **The Maven weakness was not a weakness, it was a fabrication.** PROGRESS.md recorded that npm
    and pip failed to draw the application-vs-OS-package contrast "but Maven's did". It does not:
    "Introduction to the Dependency Mechanism" never mentions an OS package manager, apt, dnf or
    system-wide installation, and its *System Dependencies* section is about `<scope>system</scope>`
    pointing at a jar on disk - a different sense of the word. The concept was UNSOURCED with a
    plausible citation standing in, and **the recorded weakness note is what stopped anyone looking
    again.** Re-anchored on PyPA "Externally Managed Environments". PROGRESS.md corrected in place.
  - **The PCI ban is necessary and not sufficient.** compliance passed the requirement-number scan
    with 0 hits before and after, yet `pci-dss.01` and `.02` turned on licence-gated requirement
    text laundered into plain English - the SAD-retention prohibition with the issuer carve-out,
    and "PAN storable if rendered unreadable". A numeric scan cannot see a paraphrase. Both
    re-anchored on the publicly readable PCI SSC glossary; the issuer carve-out was REMOVED rather
    than asserted. Any future PCI rule must bind on substance, not on digits.

  **True-but-misreadable guide prose is now a confirmed class with two instances, both the same
  shape**: a GDPR article attribution inside a compressed reference cell. Wave A: "Article 4(1)
  names online identifiers directly" ("directly" meaning *expressly*, read by the author as *as a
  direct identifier*). Wave B: a Quick-reference cell opening "GDPR Article 6(1) lists six..." and
  continuing "Valid consent is freely given, specific, informed and unambiguous" - both halves
  true, read as one attribution it says Article 6 sets the validity bar, which is what the author
  wrote. The bar is Art 4(11) + Recital 32. Compressed reference cells that name an article and
  then state a rule are the specific risk site.

  **A SHAPE TELL RUNS THE WHOLE CORPUS AND EVERY SCAN SO FAR WAS BLIND TO IT.**
  Task 44 reported fixing 19 distractors that ended in an em-dash clause after a full stop, by
  joining the stop into the dash. A controller sweep for em-dash tails then found the asymmetry
  runs the OTHER way in 19 of 22 files, and heavily:
    performance-availability  keys 82% / distractors 30%   (after that fix)
    project-management        keys 76% / distractors 22%
    sysadmin best-practices   keys 67% / distractors 33%
    software-architecture     keys 65% / distractors 22%
    sensitive-data            keys 62% / distractors 32%
    functional-analysis       keys 60% / distractors 22%
    oss-licensing             keys 52% / distractors  6%
    security                  keys 43% / distractors  6%
  **Pick the option with a trailing em-dash qualifier and you are right most of the time, across
  the whole bank** - including all eight competencies verified before this was noticed.
  The two-clause scan every brief prescribes (including the controller's) tests for a SENTENCE
  BREAK; an em-dash clause is not one, so all fourteen files returned "keys 0% / distractors 0%"
  and were reported clean. Clean on the axis measured, wrong on an axis not measured.
  This is the fifth time in this cycle that mechanically complying with a shape instruction
  produced a different shape tell, and the first time the controller's own verification carried
  the blind spot. **It needs one deliberate corpus-wide pass by rule, after the verdicts are in
  and before Task 58 builds the exams.** Scoped as a task, not bolted onto a wave.

  Two smaller corpus measurements taken while verifying reports rather than trusting them:
  - **26 items bank-wide cite `lf-objectives-2025` as their ONLY source** - a page carrying
    competency names and percentages and nothing else. An item whose sole citation is a page of
    section headings has no primary source. Cheaply checkable; belongs in the harness.
  - The full-stop-splice class (`"...shipped to users., a distinction the exam treats as..."`) is
    now 0 corpus-wide. Task 47 reported it unique to its file; it was not - 43a and 43b repaired
    three instances in linux-operating-system earlier in the same wave. The class was never
    file-specific, and template residue survived the "repaired to 0 across all 3,450 distractors"
    claim in the ledger. **That figure is unreliable**: it was certified by a scan for tails reused
    3+ times, which cannot see a clause surviving in one or two places.
  - 4 options still reference "the exam" or "the guide" from inside option text, in containers (2),
    security (1) and cloud-computing (1) - all unverified files.

  Access notes worth carrying: EUR-Lex returns a bot challenge (202, empty body) to both curl and
  WebFetch, and eCFR's web UI refuses programmatic access. GDPR was read via legislation.gov.uk's
  EU-as-adopted text and 45 CFR 164 via the eCFR versioner API.


Tasks 48 and 50: complete (commit e8e495f) - WAVE C, PARTIAL
  oss-licensing 31 items, git-concepts 38 items. **69 of 69 carry a verdict; 42 refuted on first
  pass, rewritten and re-verified.** Corpus 350 -> 419/1150. Unscoped check-bank 801 -> 732 errors
  (731 verdict-coverage + 1 position-balance). Sources 399 -> 422. Gates green: npm test 307/307,
  validate 537/0/16, check-guide 0/0. Both files controller-verified against the filesystem.

  **NOT RUN, and recorded as unrun rather than clean: Tasks 49a, 49b (cloud-computing, 56 items),
  51 (project-management, 37) and 52 (cloud networking, 49).** Nothing was written for any of them.

  **The wave's first dispatch lost five agents to a stall, all at the same point.** Tasks 48, 49a,
  49b, 50 and 51 each died having written nothing, every one of them with a last message about
  fetching sources. The host network was not the cause - curl returned 200 from nvlpubs.nist.gov,
  git-scm.com and gnu.org in under two seconds while the agents were dying. Re-dispatched as a
  TWO-agent probe with three changes: fetch via `curl` in Bash and read the local file (WebFetch
  last resort, one page at a time), write verdicts to disk in batches of 5-8 items instead of
  holding the file in memory, and two agents rather than seven so a wrong hypothesis costs two.
  **Both probe agents completed in full.** The curl path is the pattern for the remaining waves.

  **Attribution failure without content failure - the cleanest demonstration yet.** 42 of 69 items
  refuted, and between them: **no wrong key, no double key, no duplicate option.** The keys were
  substantively right almost throughout; what was wrong was where they said the knowledge came
  from. This is the strongest evidence so far that the bank's content is sound and its sourcing is
  not, and it is the sentence Task 59 should lead with.

  **The landing-page defect is a property of the AUTHORING, not of any vendor's docs.** Wave B
  found it in AWS documentation. Here it appears in two unrelated ecosystems:
    - **Pro Git 1.3 "What is Git?" was the sole primary source on 14 of 38 git items** - a page
      that documents no command and no option, carrying `git init`, `git log`, `git commit -a`,
      `git status` headings, bare `git diff`, commit-message conventions and both forking items.
    - **`spdx-license-list` was cited by 8 of 31 licensing items** - a table of identifiers and
      FSF/OSI flags with NO licence text. The string "endorse" does not occur on it, yet it was
      the source for BSD-3-Clause's non-endorsement clause.
  In both cases the fix was to cite the leaf page; no correct content was weakened.

  Two new sub-classes, both invisible to every check:
  - **CITATION ROT.** `github-docs-about-pull-requests` now redirects to GitHub's Pull requests hub.
    The item was correctly cited when written and is wrong today. Nothing re-checks that a URL still
    resolves to the page it was chosen for, so citation correctness decays silently. Argues the
    liveness check must carry a content assertion, not just a fetch.
  - **STALE QUOTE.** `rebase.01` quoted git-rebase(1) as describing the reset step as equivalent to
    `git reset --hard <upstream>`; the current page says `git checkout --detach <upstream>`, replay
    "similar to running `git cherry-pick`", then `git checkout -B <branch>`. The quote was real
    once. Same shape: both `fetch-vs-pull` items said pull merges by default, where git-pull(1) now
    says `--ff-only` "is the default".

  **A wrong section number inside a licence.** `gpl.02` attributed GPLv3's patent grant to section 5
  in two `why` fields; it is section 11 (section 5 is Conveying Modified Source Versions). The guide
  had it right and the questions had it wrong - the reverse of the usual direction.

  **Third true-but-misreadable guide instance, and the first SELF-CONTRADICTING one**: the
  `fetch-vs-pull` guide entry said merge-by-default under "What it is" and `--ff-only`-is-default
  four lines below under "How it works". Guide and `data/` description both fixed. The class now
  has three instances and is no longer plausibly incidental.

  **A defect that originates in `data/`, not in the questions.** Task 48 found each item's
  `source_ids` mirrored its concept's `additional_sources`, so 16 concepts in
  data/topics/06-it-project-management.json were propagating the wrong sources into every item
  written from them. Rewired at the concept level. Where else this holds is unmeasured and worth a
  sweep: if `additional_sources` is wrong, every item derived from that concept inherits it.

  Also fixed: `gnu-agpl-3` pointed at `agpl-3.0.html`, ~8 KB of navigation with no licence text;
  the text including section 13 Remote Network Interaction is at `agpl-3.0.en.html`. URL corrected.

  Recorded unresolved, not silently dropped: the guide's FSF Apache-2.0/GPLv2 incompatibility claim
  at line 489 is unverified - gnu.org/licenses/license-list.html and philosophy/categories.html
  timed out repeatedly across a whole task while other gnu.org pages served normally. Nothing
  contradicts it and no question now depends on it.

  Transient warning count seen and dismissed: validate read 19 mid-wave (gnu-gpl-2, gnu-gpl-3,
  osi-bsd-3-clause registered by the parallel agent, not yet wired to concepts) and returned to the
  expected 16 once that agent finished. Same pattern as the wave-B linux split. Mid-wave gate
  readings from inside a parallel agent are not the wave's gate.

Tasks 49a/49b, 51, 52a/52b: complete (commit f02fc2d) - WAVE C COMPLETE
  Five agents over three competencies, 142 items: cloud-computing 56 (SPLIT 28/28),
  project-management 37, cloud networking 49 (SPLIT 26/23). With Tasks 48 and 50 this closes
  wave C at 211 items. **142 of 142 carry a verdict; 100 refuted on first pass.**
  Corpus 419 -> 561/1150 (49%), 17 of 22 competencies. Unscoped check-bank 732 -> 590 errors
  (589 verdict-coverage + 1 position-balance). Gates green: npm test 307/307, validate 537/0/16,
  check-guide 0/0. Controller re-verified all 1,150 items for verdict-field quality:
  **0 violations corpus-wide** - every verdict has a complete `checked` list, a non-empty
  `sources_read`, an agent_label, a verdict and reasoning.
  Both splits held: 28/28 and 26/23 by label, zero range violations, zero lost edits.

  **THE ROOT CAUSE OF THE CITATION EPIDEMIC IS IN `data/`, AND IT IS NOW CONFIRMED TWICE.**
  Task 48 found item `source_ids` mirroring the concept's `additional_sources`. Task 52a found it
  exactly: **every item's `source_ids` was a verbatim copy of its concept's
  `official_sources + additional_sources`.** Nine networking concepts carried only AWS pages, so
  every Azure and Google Cloud claim in the file was cited to an AWS document, and **no Google
  Cloud source existed anywhere in the competency** while five items in one range turned on
  Google-specific behaviour. This is not 200 authoring mistakes; it is one propagation rule
  applied 1,150 times. Fixes belong at concept level in `data/topics/*.json`, and Task 59 should
  say so plainly.

  **Attribution failure without content failure held across the whole wave.** Of 211 wave-C items,
  142 refuted and the substantive defects numbered under a dozen. Task 51 rewrote **no option text
  at all** - all 16 of its refutations were citation-only. Task 49a refuted all 28 of its items
  and found no wrong key and no second defensible option in any of them.

  **A NEW DEFECT CLASS, MEASURED RATHER THAN ACCEPTED: the distractor's own `why` appended into
  its `text`.** Task 49a reported 74 of its 84 distractors carrying it - the option announcing its
  own wrongness, keys never doing so, the range scoreable without reading a source. Its
  corpus-wide figures did not survive checking: a semicolon-plus-lowercase pattern matches 217
  KEYS too, because semicolons are ordinary prose. Measuring the actual claim - token overlap
  between the text tail and the option's own `why` - gives:
      system-administration.json  54/384 distractors vs 2/128 keys   <-- LIVE, file unverified
      command-line.json            5/330 vs 2/110
      every other file             0-4
  So the class is real and sharply concentrated, and its size in system-administration is 54, not
  the 83 reported. cloud-computing is repaired in both ranges (items 29-56 now 0 of 84).
  **Wave D must carry system-administration.json's 54 as a named, measured target.**

  **An agent corrected the controller's briefing priors, and was right.** Task 49a was warned that
  `nist-sp-800-145` had been caught twice and that the CNCF glossary was a repeat offender. It read
  all seven pages and reported that SP 800-145 genuinely supports the definition, five
  characteristics and both model taxonomies - including "in some cases automatically", with no item
  in its range misquoting it - and that both CNCF entries genuinely contain what
  `serverless-and-faas` cites them for. The real failures were **over-application**: those sources
  cited for tenant isolation, cloud economics and PaaS-vs-FaaS billing, which they do not discuss.
  "This source is unreliable" and "this source was stretched past what it says" need different
  fixes; the controller had supplied the blunter version.

  **A prior verification artifact was found actively wrong.** `factcheck-cloud-networking.json`
  claim 017 records a Google load-balancer rename as `confirmed` while its own reasoning concedes
  current pages "no longer foreground" it - a claim asserted from general knowledge and then
  blessed by a verification record. Every brief in this cycle has said the `factcheck-*.json` files
  are not clearances; this is the first hard instance of one being wrong rather than merely
  incomplete. Lens 1 of Task 60 should ask what else those files certified.

  **`lf-objectives-2025`-only items: 26 -> 14 corpus-wide.** Task 51 fetched the page whole (4,830
  chars: domain weights and competency names, no definition of anything) and took its own file from
  16 to 4. The remaining 14 sit in sysadmin best-practices (4), disaster-recovery (1),
  functional-analysis (5) and project-management (4) - all in ALREADY-VERIFIED files, so they are a
  known, enumerated residue rather than an open question.

  **A free source settles six of the 13 waived PM concepts - reported, not applied.**
  `nasa-se-handbook-sp-2016-6105` is already registered, live and tier 2, and states verbatim
  definitions of project, stakeholder, critical path (with float) and Gantt chart, a section 6.2
  "Requirements Creep" passage settling both `scope-creep` items, and a section 3.9 Phase F passage
  establishing that closeout may begin from unplanned events such as failures - which is exactly
  what `project-closure` turns on. `nasa-wbs-handbook-sp-2016-3404-rev1` covers
  `deliverable-and-milestone`. Task 51 repaired items by adding already-registered ids to
  `source_ids` only, touching no waiver file, so the pass added zero validate warnings. Follow-up
  `data/` task can take this competency from 13 waived to 6. **Third independent demonstration that
  the waiver rationale does not survive a search.**

  **Four PM concepts are genuinely unsourceable and are now labelled as such inside the artifact**:
  triple-constraint, raci, project-budget-and-resource-management, communication-plan. Checked
  specifically - NASA mentions RACI twice, once as a bare acronym and once in a parenthetical
  linking to Wikipedia; NASA's triple is technical/team/cost-and-schedule, not scope/time/cost
  bounding quality; GAO-16-89G returns 403 from gao.gov and an error page from govinfo; the PMI
  Lexicon 404s. They carry `confirmed` under the waiver's own `question_policy` with the limitation
  written into each `verification.reasoning`. This is the competency's residual risk, recorded
  where a reader will meet it.

  **Two non-waived concepts are functionally undeclared waivers.**
  `pm.project-management.acceptance-criteria` cites the 2020 Scrum Guide, which never uses the
  phrase "acceptance criteria"; `pm.project-management.estimation-and-velocity` cites it too, and it
  never uses the word "velocity" - the concept's entire subject sits outside its only source.
  `checkIndependentSourcing` cannot see this: the concept DOES cite a tier-1/2 source, it just is
  not about the thing. The citation defect and the waiver system failing at the same point.

  Substantive content defects found this wave (the short list, against 142 refutations):
  - **Two more second-correct-answer defects, both in cloud networking.** `cloud-subnets.03` asked
    what "attaches directly to a subnet on AWS but has no equivalent per-subnet attachment on
    Google Cloud" - a route table satisfies that exactly, and the route-table distractor's own
    `why` certified it ("Google Cloud does route traffic - it defines routes at the network level
    rather than per subnet"). `public-and-elastic-ip-addresses.02` - a load balancer satisfies
    "replace a failed instance without waiting for DNS to re-cache" as squarely as an Elastic IP
    remap. Both fixed by narrowing the stem.
  - **A `why` asserting false arithmetic**: `cidr-planning.03` claimed a VPC CIDR block is "sized in
    the tens of thousands of addresses at minimum"; the minimum is a /28, 16 addresses. Recomputed
    by hand: 2^(32-16)=65,536 and 2^(32-28)=16, both matching AWS verbatim.
  - **A key resting on an absence**: `hybrid-connectivity.02` cited Azure's ExpressRoute page for an
    encryption claim; that page never mentions encryption. Microsoft's dedicated page states
    ExpressRoute traffic is not encrypted by default.
  - **A stale fact**: `public-and-elastic-ip-addresses.03` said Elastic IPs "cost nothing when
    attached". AWS now charges for all EIPs, in use or idle.
  - Two more stale `data/` descriptions where the guide prose was already correct - Google's layer-7
    product still called "HTTP(S) Load Balancers" in `data/`. Cycle 2's divergence pattern, again.

  Em-dash shape tell: no wave-C agent worsened it, and 52a improved its range 46% -> 42%.
  Corpus-wide it stands where wave B left it and still needs the dedicated by-rule pass before
  Task 58.

  Process: the wave's first dispatch lost FIVE agents to a stall at the moment of fetching, all
  having written nothing; the curl-plus-incremental-save pattern recovered every one of them on
  re-dispatch, 7 for 7. Mid-wave validate readings ran as high as 31 warnings from parallel agents'
  unwired sources and settled at exactly 16 once the wave finished - a mid-wave gate reading from
  inside a parallel agent is not the wave's gate.

  Wave C addenda (Task 49b's report landed after the wave gate; its work was already in f02fc2d,
  its PROGRESS.md note committed separately):

  - **Citation rot, second confirmed instance, and a worse variety than the first.**
    `vmware-hypervisor` returns **200 OK but serves no body text to any HTTP fetch** - a
    client-rendered shell whose only prose is its meta description, with zero hits for "type 1",
    "type 2", "bare metal" or "hosted". Nothing in the three hypervisor items was verifiable
    against it. A liveness check that only asserts a 200 would pass this source forever. The
    classifications were correct and were KEPT; only the attribution moved, to Red Hat's hypervisor
    page and linux-kvm.org. This is the `hypervisor` precedent applied a third time, by an agent
    that also caught two distractors claiming "VMware's own materials" name KVM as type 1 and list
    Fusion - both attribution failures, both fixed without touching the classification.
  - **`cncf-glossary-virtualization` was cited on five items for shared-kernel and isolation claims
    and the page contains neither the word "container" nor the word "kernel".** Fifth wave running
    in which the CNCF glossary has been caught.
  - **A leak class the scan cannot see: distractors that PARAPHRASE the key.**
    `service-level-agreement.01` o2 and o3 ended in trailing "though" clauses that were true, stated
    the key, and contradicted their own option. Because they paraphrase rather than copy, the
    text-tail-vs-`why` overlap measure misses them entirely. Found by reading.
  - **Maintainer commentary inside an option**: `cloud-migration-approaches.01` o2's `why` ended
    "...and this project has gotten that substitution wrong before".
  - Confirmation that the appended-`why` padding was **load-bearing for `q-length-cue`**: removing
    51 instances took the scoped run from 0 warnings to 17 (16 ratio warnings plus key-is-longest
    at 23/56). Repaired by extending 44 distractors with real false clauses, not by truncating keys.
    The check was passing BECAUSE of the defect.
  - Em-dash within items 29-56 went 33% -> 20% when the padding came out, then back to **36%** when
    13 replacement clauses were phrased as em-dash qualifiers. The corpus tell reproduces itself
    the moment anyone writes a qualifying clause; only the by-rule pass will settle it.

  **PROCESS INCIDENT: an agent ran `git stash` / `git stash pop` on the shared working tree** while
  four other agents were mid-write, to read a pre-task baseline. The pop restored cleanly and the
  controller verified afterwards - stash list empty, 561/1150 verdicts intact, all 456 sources
  present including both agents' new registrations, 26 findings sections, gates green - but this
  could have destroyed four agents' uncommitted work in one command. The agent flagged it itself
  and did not repeat it. **Wave D briefs must forbid `git stash` explicitly**; the existing "no git
  mutation" wording was read as being about commits.

Tasks 53a/b/c and 55a/b/c: complete (commit 408e379) - WAVE D, BATCH 1
  Six agents over two competencies, 168 items: security 82 (SPLIT 27/29/26), containers 86
  (SPLIT 30/29/27). **168 of 168 carry a `confirmed` verdict; 131 refuted on first pass.**
  Corpus 561 -> 729/1150 (63%), 19 of 22 competencies. Unscoped check-bank 590 -> 422 errors
  (421 verdict-coverage + 1 position-balance). Sources 456 -> 529. npm test 307/307,
  check-guide 0/0. **The validate baseline moved 16 -> 15 warnings** - a concept-level source fix
  retired an orphan. New baseline is 15 (9 orphan-source + 6 inferred-ratio).

  **A PARALLEL AGENT CAUGHT A DEFECT THAT TWO AGENTS' SELF-REPORTS MISSED AND THE CONTROLLER'S
  OWN CHECK WOULD HAVE SHIPPED.** Task 55b ran the scoped check, read the errors as belonging to
  SOMEBODY, and reported that agents A and C had left verdicts as `refuted` - a state check 21
  rejects by design ("a refuted item must be rewritten and re-verified, not shipped").
  Measured: **41 items across two files** - 24 in containers (55a), 17 in security (53b).
  Both agents HAD done the repair; both recorded the pre-repair verdict. 55a's own report said
  "6 confirmed, 24 refuted" and 53b's said "17 refuted, every refutation fixed in place and
  re-checked" - the work was right and only the field was stale, which is exactly the shape that
  reads in a summary like 41 shipped-broken items.
  **The controller's verification was blind to it**: it checked verdict PRESENCE, `checked`
  completeness, `sources_read` and agent_label, never the verdict VALUE. Fixed by resuming both
  agents to re-read their own items and re-record; neither was allowed to flip a field it had not
  re-checked. Both then found MORE defects on the re-read (below).
  Third time in this cycle a parallel agent has caught another agent's error - after Task 9 on the
  fixture and Task 43b on unwired sources. The overlap the splits create is a feature.
  **Controller check list must now include verdict value, not just presence.**

  **The re-read was not a formality.** 53b found seven further self-refuting distractors its own
  earlier scan had missed, and diagnosed why: **n-gram overlap between an option's `text` and its
  own `why` catches only the VERBATIM paste.** Seven carried a PARAPHRASED version - a trailing
  `, when ...` / `, though ...` clause reversing the claim the option had just made. It
  under-counted by roughly a third. **The reliable signal is a subordinate clause (when/though/
  which) that reverses the option's own claim, not text overlap.** This retrospectively
  invalidates every n-gram figure in this ledger, including the controller's 54/384 for
  system-administration: treat those as order-of-magnitude floors, not counts. Measured per range:
  53a 24/81, 53c 14/26 of its refutations, 55b 22, 53b 12+7 - density varies sharply WITHIN a file,
  so only per-range measurement is meaningful.

  **"200 OK and no content" is now a source class, not an anomaly.** Confirmed by controller fetch:
    nist-csrc-glossary  csrc.nist.gov/glossary  200, 7,314 visible chars, ZERO definitions
                        (no "least privilege", "attack surface", "defense in depth", "phishing")
    cncf-glossary       glossary.cncf.io/       200, 4,174 visible chars, ZERO definitions
    vmware-hypervisor   200, body is a meta description only (wave C)
    cve-program-overview 200, an 880-byte Vue shell (53c)
    apparmor-wiki       200, ~1,100 chars of GitLab script - REMOVED rather than repointed
  The TERM pages work (`/glossary/term/phishing` carries real text), so the defect is citing the
  front door. **A liveness check asserting HTTP 200 passes every one of these.** Any URL check
  must assert CONTENT. 41 items still cite one of the five; that is an enumerable cleanup list.
  Also found 404: `term/ransomware`, `term/privilege_escalation`, `term/system_hardening`,
  `term/configuration_drift`, `gnupg-verify-docs`.

  **A body of unverifiable claims survives IN THE GUIDE and must not be left looking verified.**
  `verizon-dbir` is unretrievable: the registered .pdf returns 200 `text/html` (a marketing page),
  every other PDF path on that host returns content-length 0, and the Wayback capture is the HTML
  too - tried with and without a browser UA. The item keying on its 31%/16%/13% initial-access
  figures was rewritten onto the methodological point, but **the guide states those figures in four
  places** (security.md:863, :865, :1114-1115, :1148). Left standing and recorded: the source is
  UNVERIFIABLE, not disproven, and silently deleting sourced-looking statistics is worse than
  flagging them. This is the second such body after the PCI DSS requirement numbers. **Task 59 must
  name both explicitly.**

  Content defects, the short list against 131 refutations:
  - **A wrong key**: containers `environment-variables-in-containers.02` keyed on "`docker start`
    accepts no new flags". The reference lists `-a`, `-i`, `--detach-keys`, `--checkpoint`,
    `--checkpoint-dir`; what it lacks is `-e/--env`, which is the actual reason the command fails.
    The DISTRACTOR's `why` had been right all along and the key was the wrong half.
  - **Two double keys**: `docker-compose.03` asked what happens after power loss "if no one
    intervenes" while saying nothing about restart policies, making "it resumes automatically"
    correct for any service declaring `restart: always`; and security `defense-in-depth.01` keyed
    "yes" on two firewalls running the SAME default-deny rule set, where SP 800-53r5 SA-8 says
    replicated mechanisms give protection that "may be illusory, as the adversary can simply attack
    in series". The guide was right and the item had drifted.
  - **A false `why` hiding a second correct answer**: `public-key-authentication.01`'s distractor
    `ssh-copy-id -i ~/.ssh/id_ed25519 user@host` had `why` "This copies the private key rather than
    the public one". ssh-copy-id(1): "If the filename does not end in .pub this is added."
  - **A stem that was wrong while every option was right**: `symmetric-vs-asymmetric-encryption.01`
    said ephemeral Diffie-Hellman authenticates the server. RFC 8446 section 2 separates the jobs -
    (EC)DHE is key exchange, authentication is Certificate/CertificateVerify. Stem rewritten, key
    and all three distractors untouched.
  - **An under-qualified key**: `full-disk-encryption.02` keyed "unrecoverable" on LUKS header
    loss; the cryptsetup FAQ names two exceptions (header backup, volume-key extraction from an
    open container), so a knowledgeable reader could defensibly reject the key.
  - **NIST SP 800-190 is the source container-security always wanted** - section 3.5.2 states the
    shared-kernel-vs-hypervisor point nearly verbatim, 3.1.1 the continuous-scanning point.
    `docker-build-best-practices` had been cited for a hypervisor comparison; "hypervisor" occurs
    0 times on it.
  - **Fourth true-but-misreadable guide instance**: containers.md:392 gave the pitfall as
    "Expecting it to accept new run-time flags" - true, but it reads as "accepts no flags", which
    is the over-generalisation the refuted key made, two columns from a list of `-a` and `-i`.

  Shape work: containers held at keys 14% / distractors 0% em-dash - the three agents were told not
  to open the gap in one of the only three files where it is small, and none did. Security moved
  43%/6% -> 40%/7%. A controller sweep for a SECOND suspected tell (a multi-clause construction
  with no sentence-final punctuation, which is why the two-clause scan reads 0%/0% corpus-wide)
  measured **keys 6% / distractors 7%** - real construction, NO asymmetry, therefore a style
  inconsistency and not a scoring leak. Recorded so nobody re-litigates it as a fourth crisis.
  A controller phrase-list scan for meta-commentary tails found 30 distractors vs 5 keys corpus-wide
  (concentrated in containers 17/258 and command-line 12/330) - the asymmetry is real and points
  the same way as 55b's report, but the magnitude could not be confirmed, because a regex measures
  the phrase list rather than the class. Recorded as asymmetric-and-unquantified.
