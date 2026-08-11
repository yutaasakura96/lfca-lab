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

Task 1: complete (commits a694f77..0d74aa8, review clean, no findings)
  Reviewer independently confirmed all 22 real competency names slug without collision.
Task 2: complete (commits 0d74aa8..78e1b59, review clean)
  Reviewer re-verified on real data: 156 edges, 129 blocks, each edge covered once,
  ownerOf order-independent on all 156, all 43 target-only concepts present in some block.
  Minor (carry to final review):
  - 113 of 156 edges (72%) tie through the whole ownership rule and are decided by
    lexicographic id. Ownership is therefore mostly alphabetical rather than
    importance-driven. Accepted: deterministic and exactly-once either way, and only
    19 of 129 blocks cross a file boundary, so both members are usually adjacent anyway.
  - undirectedEdges' two-key sort comparator is never exercised directly by a unit test
    with >1 edge; verified correct on the real 156-edge array instead.
Task 3: complete (commits 78e1b59..8a6698f, review clean after FIVE fix rounds)
  tools/lib/guide-parse.mjs. The parser is the sole gateway between hand-written prose and
  every coverage check, so each round was worth it. What the rounds found, all real:
  - R1: CRLF or one trailing space on an anchor line produced zero definitions AND zero
    malformed entries. A whole unparsed file would have reported as fully covered.
  - R2: an indented Quick reference row vanished silently.
  - R3: my error. I accepted R2's low-confidence "second table is a false positive" finding;
    the fix for it introduced the R2 defect's twin. Reverted to shape-based row recognition:
    a Quick reference section holds exactly one table, so a second one IS a violation.
  - R4: the parser had no fenced-code awareness in ANY pass. study-guide/STYLE.md exists to
    show fenced examples of this exact marker grammar, so a documented example naming a real
    concept id would have satisfied the coverage proof for a concept nobody wrote.
  - R5: block-extent and section detection were still fence-blind. A `# comment` inside a
    ```bash example terminated the concept block, dropping the command and the **Traps**
    label from blockText. Would have fired spuriously on nearly every competency file.
  Verified independently by me after R5, not just by the reviewer.
Task 4: complete (commits 8a6698f..ecd4dac, review clean after 1 fix round)
  tools/lib/guide-checks.mjs (7 structural checks) + tools/test/fixtures/guide/.
  Review found 3 Critical accidental-pass paths, all in MY check design, all now closed:
  - a depth-3 concept stubbed as a one-line glossary row satisfied the coverage proof, the
    depth check and the metadata check at once. Kind is now checked against depth.
  - body-label detection was a substring match over the whole block, so `**Traps**` inside a
    table cell satisfied it. Now line-anchored.
  - the scope test was vacuous: stubbing inScope to `return false` left 10/10 green. Now 3
    tests catch it, and an unknown --scope throws via assertKnownScope instead of silently
    matching nothing (a scoped run reporting 0 errors over 0 concepts is a green light that
    means nothing).
  Re-review ran 11 mutations, one per check; every one was caught by a test.
  Minor (carry to final review):
  - guide-checks.mjs outside-any-section detection keys on concept id, so a stray duplicate
    outside a section is masked by a properly-placed copy of the same id. checkDuplicateDefinition
    reports the pair regardless, so the ensemble still errors.
Task 5: complete (commits ecd4dac..0647860, review clean after 2 fix rounds)
  Remaining 7 checks + runAllGuideChecks. Reviews found, all real, all in MY check design:
  - R1 Critical: checkVendorNeutrality's trigger was unverified by any test (the fixture had
    no Cloud Networking competency, so only the early return was exercised). Scope filtering
    was untested in 5 of 7 checks - the same class the Task 4 fix round had just closed.
    checkCommandCoverage credited a substring, so `uname -rV` satisfied a required `uname -r`.
  - R2 Critical: the dataset has a concept whose command is literally `|`
    (linux.command-line.pipes), and every markdown table row contains `|`, so that check was
    satisfied by the concept's own table markup. Root cause was searching raw blockText when
    the spec says the command must appear AS CODE. Rule replaced: a command counts only if an
    inline code span equals it exactly, or a fenced line equals it after stripping a `$` prompt.
    Verified by me directly: table-only block now errors, code-span block passes, and all 379
    dataset commands across 171 concepts remain satisfiable.
  - R2 also closed an owner-vs-member blind spot in comparison scope gating (19 of 129 real
    blocks cross a file boundary, 9 cross a domain, so the distinction is load-bearing).
  Every check now has at least one mutation that a test catches.
Task 6: complete (commits 0647860..b20e011, review clean after 1 fix round)
  tools/check-guide.mjs + tools/guide-plan.mjs + npm scripts. HARNESS NOW COMPLETE.
  Reviewer proved concretely that a writer copying guide-plan's output verbatim satisfies
  checkComparisonPointer and checkComparisonMembership, including a real cross-file block -
  the failure that would otherwise have been discovered 22 times over.
  Fix round closed: `--scope` with no value silently ran the full corpus; unknown flags now
  error too.
  Baseline with no guide written: check-guide exits 1 with 822 errors (537 missing-concept,
  129 comparison-coverage, 156 comparison-pointer). Scoped to SysAdmin::Networking: 77.
Task 7: complete (commits b20e011..993744b, review clean after 1 fix round)
  Enriched sysadmin.system-administration.home and devops.git-concepts.push; rewrote all 14
  cloud.networking.* descriptions vendor-neutral. Regeneration verified idempotent.
  Review found 2 factual errors + 1 overstatement - the exact two classes cycle 1 recorded:
  - Critical: cloud-subnets taught "one subnet per zone" as the shared model. That is AWS only.
    GCP subnets are REGIONAL and span zones; Azure vnets/subnets are not zone-scoped. Wrong
    mental model on a high-availability design question.
  - Important: cidr-planning claimed the range is "fixed at creation on every major provider".
    False on all three (AWS secondary CIDR blocks, GCP expandIpCidrRange, Azure add address
    space). Rewritten so the true point carries it: undoing an overlap is the hard part.
  - Important: PROGRESS.md claimed cross-provider terminology "was verified against current
    documentation" when only 2 of 14 had been. Now states plainly what was and was not checked.
  check-guide 822 -> 825 (two new confused_with edges: +1 block, +2 pointers). Arithmetic
  independently traced through assignBlocks by the reviewer.
  Minor (carry to final review):
  - cloud.networking.public-vs-private-subnet frames public/private purely as a route-table
    property. Defensible and vendor-neutral, but GCP's mechanism (per-instance external IP
    against a network-level default route) does not map as cleanly as AWS's and Azure's.
Task 8: complete (commits 993744b..4e5a0a6, review clean after 2 fix rounds)
  PILOT: study-guide/STYLE.md + 01-linux-fundamentals/linux-operating-system.md (~9,300 words,
  27 concepts, 8 owned comparison blocks, 9 outbound pointers). check-guide scoped: 0 errors.
  R1 - a SPEC-LEVEL contradiction the pilot existed to find: a depth-1 concept must be a
    Quick reference row, but if it is also a non-owning comparison member the pointer check
    demanded a standalone pointer line inside a concept block a glossary row does not have.
    Mutually exclusive. Affects exactly the 7 concepts cycle 1 deliberately kept below
    Application while recording them as confusable (firmware, zombie-and-orphan-processes,
    sla-slo-and-sli, observability, gantt-chart, lgpl, agpl). Resolved: a glossary-defined
    member may carry the pointer as a link inside its row, with the exact same href. Spec,
    plan and STYLE.md all updated so no later writer meets it.
  R2 - 2 Critical errors in the orientation paragraph, the ONE paragraph all 22 files copy:
    "the exam's smallest domain" (Linux 16% is 3rd largest / 4th smallest of 6) and "LFS200
    covers roughly half" (it covers 4 of 27 = 15%, and one concept named as covered carries
    LFS200: NOT COVERED on its own metadata line 20 lines below). Systemic fix rather than a
    correction: guide-plan now PRINTS domain weight + rank, sept_2025_status with its
    consequence, and the LFS200 coverage breakdown, and STYLE.md forbids computing them by hand.
  STYLE.md was also under-specified on Scenario content, knowledge-check count and Commands
  table placement - all three now stated, since two writers had to be able to read it and agree.
Tasks 9-29 (the 21 competency files): RUNNING as background workflow wg2gudu5r
  Run ID wf_e69242ac-0a7. Switched from one-task-at-a-time to parallel orchestration at the
  owner's request. pipeline(write -> review -> fix) over all 21 files, one agent per file
  per stage. Writers and fixers are forbidden from running any git write command, because
  they share one working tree and a concurrent git index write would corrupt it - the
  CONTROLLER commits after the workflow returns. Files are disjoint so the writes themselves
  do not conflict.
  Each writer generates its own brief with `npm run guide-plan -- "<key>"` and must reach
  0 errors on `npm run check-guide -- --scope "<key>"`.
  If this session is lost mid-run: the files land in the working tree uncommitted. Check
  `git status`, then run `npm run check-guide` and commit what is clean.
  Still to do after it returns: commit; then Task 30 (6 domain indexes + README),
  Tasks 31-32 (two appendices), 33-34 (adversarial fact-checks + data write-back),
  35 (close PROGRESS.md and README), 36 (final whole-branch adversarial review).

## Wave 1 outcome (workflow wg2gudu5r / wf_e69242ac-0a7)

Ran 40 agents; 21 completed, 19 died on the session usage limit (17 reviews + 2 writes).
20 competency files were written (251k words total) and COMMITTED at 29c3c59.
project-management.md exists despite its write being reported failed - treat completeness
as unverified until its review lands.
Only 2 files were reviewed and approved: sysadmin best-practices, cloud performance-availability.
oss-licensing was never written. Wave 2 (wlexrgph5 / wf_93f59566-68a) writes it and reviews
the other 18.

### Dataset problems reported by wave-1 writers — FEED THESE TO THE TASK-34 WRITE-BACK

Sourcing errors (the cited source does not support the claim):
- security.security.incident-response cites nist-sp-800-61r3 for a six-step
  prepare/identify/contain/eradicate/recover/learn lifecycle. SP 800-61 Rev.3 (Apr 2025)
  ABANDONED a fixed-phase lifecycle and reorganised around CSF 2.0 functions. The six-step
  sequence is the SANS PICERL model, not NIST's. Rev.2 had a four-phase lifecycle.
- cloud.cloud-computing.multi-cloud cites nist-sp-800-145, which never mentions multi-cloud;
  its four deployment models are private, community, public, hybrid.
- cloud.cloud-computing.managed-services cites nist-sp-800-145, which defines only SaaS,
  PaaS and IaaS.
- cloud.cloud-computing.hybrid-cloud omits NIST's DEFINITIONAL binding condition - "bound
  together by standardized or proprietary technology that enables data and application
  portability". Deliberate placement alone does not satisfy NIST.
- cloud.cloud-computing.cloud-migration-approaches names 4 strategies and uses "replace";
  the cited AWS source enumerates 7 and uses "repurchase", and treats retire and retain as
  first-class.
- sysadmin.disaster-recovery.hot-warm-and-cold-sites says a hot site runs "with current
  data". NIST SP 800-34r1 defines hot sites by equipment and staffing only and reserves
  real-time data currency for a MIRRORED site.

coverage_status contradicts cycle 1's own course map:
- security.security.tls-and-https is FULLY COVERED via ch9.l3, but the course map lists TLS
  as an ABSENT term (the course says SSL 7 times, TLS never).
- security.security.selinux-and-apparmor is FULLY COVERED via ch9.l3, but the course map
  lists SELinux under absent terms. Same lesson, same contradiction shape.

Waivers that may no longer be justified (free primary source exists):
- sysadmin.best-practices.separation-of-duties - NIST SP 800-128 states the control directly
  and is already registered as nist-sp-800-128. Strong case to un-waive.
- sysadmin.best-practices.naming-conventions - NIST SP 800-128 covers configuration-item and
  media naming. Weaker case.
- sysadmin.best-practices.capacity-planning - NIST SP 800-128 names it once, too narrowly.
  Reported as a near-miss only; do NOT un-waive on that evidence.


## Wave 2 outcome (workflow wlexrgph5 / wf_93f59566-68a) — COMMITTED 05314bf

36 agents, 0 failures. Wrote oss-licensing and reviewed the other 18 files.
Findings: 1 Critical, 34 Important, 83 Minor. All Critical/Important fixed by the fix stage.
Only 3 of 19 were approved first pass, which is the expected rate for prose at this volume.

The Critical: security.security.incident-response taught the six-step
prepare/identify/contain/eradicate/recover/learn sequence as NIST's, cited to
nist-sp-800-61r3. No revision of SP 800-61 has ever published that list - it is SANS PICERL.
Rev 2 had a four-phase lifecycle; Rev 3 abandoned fixed phases entirely for CSF 2.0 functions.

STATE AFTER WAVE 2: all 22 competency files written and reviewed. Full-corpus check-guide
reports 0 errors and 0 warnings over 537 concepts. npm test 163 passing, npm run validate
exit 0. 257,348 words.

### Further dataset problems found in wave 2 — ADD TO THE TASK-34 WRITE-BACK LIST

Source records that are wrong or missing:
- owasp-top10-injection points at Top 10:2021 A03. The current edition is Top 10:2025 where
  Injection is A05 and A03 is Software Supply Chain Failures. Retitle and re-point.
- verizon-dbir is a year-agnostic landing page, so nothing pins an edition and figure drift
  recurs. Pin it to an edition.
- security.security.vulnerabilities-cves-and-patching cites the DBIR in prose but verizon-dbir
  is not in its sources array.
- No source record exists for RFC 2644 / BCP 34, needed to state the modern router default for
  directed broadcasts truthfully. sysadmin.networking.network-host-and-broadcast-addresses is
  sourced to RFC 919 (1984) alone, which is not authority for any modern default - the sourcing
  itself steers a writer into the error the review caught.
- No source record for Microsoft's default-outbound-access page, needed for the corrected Azure
  claim in cloud.networking.internet-gateway-and-nat-gateway.
- security.security.incident-response has no SANS source id to cite for PICERL.
- man-proc-pid-oom-score is itself stale: it still says root processes get 3% extra memory, a
  bias removed from the kernel in commit d46078b28889 and absent from mm/oom_kill.c since v4.17.
  Flag the source record or pair it with kernel Documentation/filesystems/proc.rst 3.1.

Descriptions contradicted by their own cited source:
- sysadmin.disaster-recovery.hot-warm-and-cold-sites: NIST SP 800-34r1 5.1.5 says a hot site has
  the most recent backup loaded needing only writes since (real-time mirroring is the separate
  MIRRORED site), and Table 3-3 records a cold site as Hardware=None, Telecommunications=None.
  The dataset says "running with current data" and "space, power and connectivity only".
- cloud.networking.internet-gateway-and-nat-gateway still carries the retired Azure claim that
  outbound reachability is inherent to a virtual network. Per Microsoft, the portal already
  defaults subnets to private and the API released after 2026-03-31 makes that the default, so
  an explicit outbound method is required.

## Wave 3 RUNNING (workflow wvo2p4kji / wf_52fb538c-6e8)
6 domain indexes + README + 2 appendices, each write -> review -> fix.
Agents are forbidden from git writes; the controller commits.
Remaining after wave 3: adversarial fact-check of every command; adversarial check of the 57
waived concepts; the data write-back listed above; PROGRESS.md and README closeout; final
whole-branch adversarial review.

## Wave 3 outcome (workflow wvo2p4kji / wf_52fb538c-6e8) — COMMITTED a4c1c28

26 agents, 0 failures. 6 domain indexes + README + 2 appendices, 23,820 words.
Only 1 of 9 approved first pass. 1 Critical, 11 Important.

The findings were nearly all ONE class: false cross-domain arithmetic and rank claims,
computed by hand. guide-plan prints per-competency figures, so the index files were the last
place a writer still had to compute anything - and they got it wrong repeatedly:
- Cloud index: "ranked second largest before the update". At 20% Cloud was JOINT-LARGEST
  under the retired syllabus (Linux 20, SysAdmin 20, Cloud 20, Security 16, DevOps 16, PM 8).
- Linux index: "no single domain is large enough that mastering it alone closes the gap" -
  false for every domain at 14% or above, including the one it was written in.
- SysAdmin index: claimed SELinux and LUKS are defined in that domain; both are in Security.
  Claimed it holds "the course's best-covered competency"; it is 3rd of 22.
- Cloud index: justified a reading order on bastion hosts and private subnets being "named in
  Best Practices"; neither appears there. Two thirds of the stated dependency was fabricated.
- DevOps index: "widest internal spread on the exam" (3rd widest); "Git Concepts is the
  best-supported of the three" (DevOps Basics is, 28% vs 23%); and an arithmetic claim that
  halving the DevOps error rate closes a 4-point gap, which needs a 33% DevOps score.
- PM index: called a two-way comparison block three-way, contradicting its own later paragraph.
- README: counted 131 comparison blocks by grep when there are 130 - the 131st is inside
  STYLE.md's fenced example, which the parser deliberately skips. Also claimed primary
  documentation was attached to each of the 537 concepts, contradicting its own limits section
  140 lines below, which correctly says 57 have none.

All Critical and Important findings were fixed. STATE: 32 files, 284,343 words, full-corpus
check-guide 0 errors 0 warnings, 163 tests, validate exit 0.

LESSON FOR THE FINAL REVIEW: every remaining hand-computed figure in the guide is suspect.
The final reviewer should recompute every count, rank, percentage and arithmetic claim rather
than reading it for plausibility.

## Wave 4 RUNNING (workflow wjvrws8fy / wf_13d3eef9-ad6)
Adversarial fact-check, one agent per competency file: every command invocation and option
against man pages and official docs, and every waived concept for invented authority.
Verdicts recorded per claim in docs/verification/factcheck-<label>.json with reasoning and
source, because cycle 1's adversarial layer lost its claim-to-verdict pairing and eight
findings silently defaulted to "rejected".
Remaining after wave 4: data write-back (all findings logged above); PROGRESS.md and README
closeout; final whole-branch adversarial review.

## Wave 4 — adversarial fact-check

First attempt (wjvrws8fy / wf_13d3eef9-ad6) FAILED WHOLESALE: all 22 agents hit the session
usage limit within 31 seconds. Zero files checked. Recorded here rather than quietly retried,
because a fact-check pass that did not run must never be reported as one that found nothing.

Probe after the limit reset: command-line.md, the command-heaviest file in the project.
64 command claims examined, 0 refuted. Sources: man7.org, manpages.debian.org, POSIX,
RFC 6335, FHS 3.0, kernel ip-sysctl.txt, capabilities(7), and GNU coreutils source. Several
claims additionally verified EMPIRICALLY against both real BSD (macOS native) and real GNU
(Homebrew coreutils) binaries on this machine: BSD `sed -i` vs GNU `sed -i ''`, BSD rejecting
`ls --all`, `cut -f2,1` not reordering, `sort` lexicographic vs numeric, `mkdir -p`
idempotency, `cp -a` vs plain `cp` on symlinks, GNU `rm --preserve-root`.
Verdicts: docs/verification/factcheck-command-line.json

Second attempt RUNNING (webnn54s2 / wf_93a47e4e-924): the 13 files that actually carry
commands or waived concepts. The other 8 competency files have neither, so this pass has
nothing to check in them - that is scoping, not skipping, and must be stated that way in
PROGRESS.md.

## Closing the remaining gaps (after the final review said FIX_FIRST)

The final six-lens review's 29 confirmed findings were applied at b158de8. What follows is
everything that review left open, recovered from the workflow journals rather than from memory.

### Wave 2's 83 Minor findings — recovered
They had no recorded disposition. The wave-2 output file had been cleaned from temp, so they
were recovered from the workflow journal at
subagents/workflows/wf_93f59566-68a/journal.jsonl. All 83 are in
.superpowers/sdd/wave2-minor-findings.json; 74 map to a file by concept id and are split into
.superpowers/sdd/minors/, the other 9 are section-level (scenario length, knowledge-check
count, orientation paragraph wording) and are identifiable from their text.
Workflow wi0bqvklz applies them.

### The 8 files nothing had ever fact-checked
The adversarial pass was scoped to command claims and waiver hedging. These 8 competency files
have neither, so not one prose claim in them had ever been checked against a primary source:
cloud-computing, performance-availability, budgeting, best-practices and networking under
Cloud; sensitive-data and compliance under Security; open-source-software-and-licensing under
IT PM. Workflow wi0bqvklz gives each a first adversarial pass.

### Harness gaps to fix AFTER the prose is conformant (must be serial)
From the final review, all verified by reading the shipped code, one by mutation:
(a) tools/lib/guide-parse.mjs:147 - the block-end rule `level > 0 && level <= 4` is a
    documented anti-false-pass defence and NO test pins it. Mutating it to `<= 3` leaves all
    163 tests green. Needs a test whose fixture puts the command after a Quick reference
    heading.
(b) tools/lib/guide-checks.mjs - checkCommandCoverage filters to kind === 'topic', so five
    depth-1 concepts that record commands are permanently exempt from showing them
    (zombie-and-orphan-processes, lvm, tcpdump, git-concepts.head, git-concepts.stash). All
    five satisfy it today, so enforcing costs nothing.
(c) checkVendorNeutrality is warn-severity, reads only one file's definition blocks, and so
    cannot see comparison bodies, scenarios, knowledge checks or the other 31 files.
(d) check-guide's summary line reports "32 guide file(s)", which includes 10 files no check
    inspects. Report what was actually verified instead.
(e) STYLE.md section 7's 3-to-6 knowledge-check rule is normative but unenforced; three
    sections carry 7 prompts. Add the assertion once the prose is in range.

### Other open items
- study-guide/appendix-a-packet-life.md has no knowledge check while appendix B does - and the
  one without is the reader's weaker declared area. Neither is visible to check-guide because
  appendices contain no definition anchors.
- Carried Minors never revisited: Task 2 (undirectedEdges sort comparator untested with >1
  edge), Task 4 (outside-any-section detection keys on concept id, so a stray duplicate is
  masked), Task 7 (cloud.networking.public-vs-private-subnet framing vs GCP's mechanism).
- PROGRESS.md cites .superpowers/sdd/stage5-results.json, which is NOT tracked by git - a
  live unverifiable-evidence citation. Commit it or reword.
- Coverage gap: three commands need checking on systems this host does not have -
  `crontab -T` vs `crontab -n`, the postgres volume path at containers.md, and man-db's
  default section order.
- Coverage gap: the "Lessons" column of research/lfs200-notes/00-course-map.md, quoted in the
  Linux and SysAdmin indexes as "four and three", is not derivable from data/, where distinct
  lfs200_sources give 2 and 2. Establish what the column means or stop quoting it.

### Genuine limits, NOT defects — record, do not pretend to close
- No Linux Foundation page was re-fetched in cycle 2. The exam facts rest on cycle-1 browser
  work for which no capture artifact exists in the repository.
- LFS200 is paid and its text is not in the repository, so every coverage_status value and
  every term count in the course map is taken on trust.
- The 537-concept expansion is unvalidated against anything external; validate.mjs's six
  inferred-ratio warnings say exactly that.
- No individual verdict among the 765 fact-check records was re-derived against its source.
