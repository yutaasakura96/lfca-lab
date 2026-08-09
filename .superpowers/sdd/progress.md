# SDD Progress — LFCA Research Foundation

Plan: docs/superpowers/plans/2026-08-09-lfca-research-foundation.md
Branch: lfca-research-foundation
Pre-flight: 3 plan defects corrected (gitignore no-op, duplicate fixture, package.json wording) in commit pending.

Task 1: complete (commits e74c5f3..db1e17c, review clean)
Task 2: complete (commits db1e17c..6c7a156, review clean)
  Minor (carry to final review):
  - tools/lib/load.mjs:4-6 readJson has no error handling; a bad `file` field
    surfaces as a raw ENOENT without naming the dataset file.
  - tools/lib/load.mjs:21-26 sequential awaits over domain files; immaterial at 6.
Task 3: complete (commits 6c7a156..ecc5cb4, review clean, no findings)
Task 4: complete (commits ecc5cb4..f34e5d2, review clean)
  Validator against real dataset: 22 empty-competency errors, 3 orphan warnings, exit=1 (expected).
  Resolved reviewer warnings: fixtures untouched in this commit (3 files only);
    all 3 sources have valid authority_tier.
  Minor (carry to final review):
  - LATENT GATE HOLE: checks.mjs:53-66 skips a concept whose refs all lack an
    `authority_tier` field (tiers array empty -> guard short-circuits). Today
    unreachable (all sources valid), but Tasks 6/10/11 add many source records
    with no schema check enforcing the field. DECISION NEEDED before Task 6.
  - checks.test.mjs has no test for checkInferredRatio on a zero-concept domain,
    though checks.mjs:131 guards exactly that case.
Task 5: complete (commits f34e5d2..f363271, review clean after 1 fix round)
Task 6: complete (commits 85ec0c2..bc59159 + calibration fix, review clean)
  Established HIGH: 90 min duration, 75% pass, multiple choice, PSI Bridge online proctoring,
    2-year validity, one retake included, $250/$299/$495. Question count NOT stated anywhere.
  Reviewer independently re-fetched all 3 cited pages and confirmed figures are real.
  Minor (carry to final review): task-6-report.md self-review wording overstates the
    exclusion of the third-party "60 questions" figure (the file does name it, correctly
    labelled unverified). Report-file wording only; the dataset is correct.
Task 7: complete (commits f7a760c..77506cc + test gap fix, review clean after 1 fix round)
  537 concepts across 22 competencies. Zero empty-competency errors.
  Fix round addressed: Command Line mis-mapping (Critical), 12 factual errors (Critical),
    3 under-built new-2025 competencies (Critical), confused_with -> ids, group contiguity.
  Validator extended to 13 checks (owner-approved deviation from plan's ten).
Task 8: complete (commits bdc1fc2..6ad83c3, verified by controller not subagent —
  user declined the review dispatch). Checks run: scope (9 files, exam-mechanics.md
  untouched), views.mjs purity (imports only sourceIndex), banners on all 6 outputs,
  537 rows in both coverage-matrix and gap-analysis, 11 tables with 0 ragged rows,
  0 literal "null" cells, pipe-escaping proven on the 2 concepts containing raw pipes.
  42 tests passing.
Task 9: complete (commit f1c43fc). LFS200 crawled via owner's own authenticated session.
  DEVIATION from plan: the plan specified per-chapter notes files written by reading each
  lesson page in turn. Instead the portal's own course endpoint returned all 47 lessons in
  one authenticated response, so analysis was done over the whole corpus at once and written
  to a single research/lfs200-notes/00-course-map.md. Same evidence, far fewer round trips,
  and it made whole-corpus term-absence measurement possible - which produced the strongest
  finding. Course prose was never reproduced.
  HEADLINE: LFS200 still follows the pre-2025 syllabus. 6 competencies have no lesson at all
  (4 of them new in 2025); Disaster Recovery's only lesson is 1 character. 43 key terms
  measured absent across 158,185 chars, including Docker, TLS, GDPR, Scrum, cron, RTO.
  Per-concept coverage figures are an explicit LOWER BOUND, not a measurement.
Task 11: complete (commit e08e11c). NEGATIVE RESULT, which is the honest outcome.
  No post-2025-09-16 LFCA candidate reports exist publicly. The one substantive report
  (dev.to, 2025-09-03) predates the update by 13 days and describes the retired exam --
  registered tier 4, deliberately NOT attached to any concept. Search space otherwise
  dominated by braindump sites, all excluded unread and logged by name.
  Consequence: candidate_evidence is empty on all 537 concepts, truthfully. The MEDIUM
  confidence tier ("corroborated by 2+ candidate reports") cannot currently be satisfied
  by anything -- MEDIUM concepts rest on official material and inference alone.
  Third-party "60 questions" figure noted as UNVERIFIED, not adopted.
Task 10: complete (commits 503be23, 9058dcb). Workflow wf_f403b4b3-07a: 20 agents, 1.36M
  subagent tokens, 311 tool calls, 15 min. 9 research + 11 adversarial verifiers.
  11 corrections proposed -> 8 REFUTED, 3 applied. The refuter caught corrections that would
  have made the dataset worse (an /etc/shadow rewrite that contradicted itself) and several
  that were true but at LFCS/professional altitude rather than LFCA.
  Registry 11 -> 274 sources (252 tier-2 primary docs). 480/537 concepts cite a tier-1/2 doc.
  KNOWN SHORTFALL: 57 concepts (40 of them in the PM domain) have no primary-doc citation
  because PMBOK/BABOK/ISO are paywalled and pmi.org+gao.gov refused automated fetch.
  CONTROLLER BUG FOUND AND FIXED: my first merge script keyed verdicts off journal `key`,
  which is a content hash not the agent label, so all 11 corrections fell through to
  "rejected" and 0 were applied. Caught by cross-checking against the workflow's own tally.
