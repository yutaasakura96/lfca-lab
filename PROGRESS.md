# Progress — LFCA Research Foundation

Cycle 1 of 4. Spec: `docs/superpowers/specs/2026-08-09-lfca-research-foundation-design.md`

## Stage status

| Stage | Description | Status |
| --- | --- | --- |
| 1 | Official objectives capture | **complete** |
| 2 | Exam mechanics | **complete** |
| 3 | Taxonomy expansion | **complete** |
| 4 | LFS200 crawl | **complete** |
| 5 | Per-concept documentation research | **complete** |
| 6 | Candidate experience research | **complete (negative result)** |
| 7 | Depth assignment | **complete** |
| 8 | View generation | **complete** |

## Completed

- Repo scaffolding and tooling: dataset loader, importance formula, ten validation checks,
  `tools/validate.mjs` gate.
- Stage 1: official objectives captured, and the full pre/post 2025-09-16 change set derived
  and recorded. All 22 competencies carry a real `sept_2025_status` — none left `unknown`.
- Stage 2: exam mechanics recorded in `research/exam-mechanics.md` (hand-written). Established
  at HIGH confidence: duration (90 min), question format (multiple choice, no finer detail
  stated), passing score (75%), delivery/proctoring (online, PSI Bridge), certification validity
  (2 years), price ($250 / $299 / $495 across three purchase options), and retake policy (one
  retake included with purchase, exact mechanics not spelled out). Question count is **not
  stated in official sources** anywhere checked across two stages — recorded as such rather than
  guessed.

- Stage 3: all 22 competencies expanded into **537 leaf concepts**. Zero `empty-competency`
  errors remain — every official competency now has concepts attached.

| Domain | Weight | Concepts | Share of corpus |
| --- | --- | --- | --- |
| Linux Fundamentals | 16% | 66 | 12.3% |
| System Administration Fundamentals | 30% | 173 | 32.2% |
| Cloud Computing Fundamentals | 18% | 82 | 15.3% |
| Security Fundamentals | 14% | 65 | 12.1% |
| DevOps Fundamentals | 12% | 71 | 13.2% |
| IT Project Management Fundamentals | 10% | 80 | 14.9% |

Concept count deliberately does not track exam weight exactly. Much material a candidate would
call "Linux" (permissions, processes, filesystem, packages) sits under System Administration
because that is where the official competencies place it. Networking and Containers were given
extra depth at the repository owner's request. Study effort should follow the `importance`
field and the domain weights, not the concept counts.

- Stage 4: LFS200 crawled through the owner's own authenticated enrolment. 12 sections,
  47 lessons, 158,185 characters of instructional text mapped against the taxonomy. Full
  analysis in `research/lfs200-notes/00-course-map.md`.

## Pending

- Nothing in cycle 1. Cycle 2 (study guide), cycle 3 (question bank) and cycle 4 (simulator)
  have not been started and each needs its own design.

## Cycle 1 definition of done — all met

| Check | Result |
| --- | --- |
| Every official competency has at least one concept | PASS (22/22) |
| Every concept has a `required_depth` in 1-5 | PASS (537/537) |
| Every concept has an `objective_verbatim` | PASS (537/537) |
| Every concept cites a tier-1 or tier-2 source* | PASS (537/537) |
| Every concept has an LFS200 `coverage_status` | PASS (537/537) |
| Every concept has a real `sept_2025_status` (none `unknown`) | PASS (537/537) |
| `tools/validate.mjs` exits clean | PASS (exit 0, 0 errors) |
| Full test suite passes** | PASS (42/42, at end of cycle 1) |
| All six views and the coverage matrix generate | PASS |
| Regeneration is idempotent (no diff on re-run) | PASS |

\* As recorded at the end of cycle 1. Stage 5's "Corrections from the final whole-branch
review" below shows this row was not measuring what it claims: every concept carried the
shared `lf-objectives-2025` source, so `missing-sources` could never fail regardless of any
concept's real sourcing, and the true count — a concept-specific tier-1/2 source independent of
that shared one — is 485 of 537, with the remaining 52 waived by name in
`data/sourcing-waivers.json`. Superseded by the corrections recorded later in this document; not
an unqualified pass if read against the current dataset.

\** Cycle-1 count. The suite has grown since; `npm test` currently reports 163/163 (see "Ran the
harness against the current tree" below).

## Remaining warnings, and why each is expected

`tools/validate.mjs` exits 0. Sixteen warnings remain, in two classes, both correct:

- **10 × `orphan-source`** — meta-sources that document the exam or the course as a whole
  (certification page, LFS200 course, Candidate Handbook, Wayback snapshot, the MC-exam FAQ,
  the learning-path PDF, the pre-update candidate report). They are cited by `PROGRESS.md` and
  the research notes rather than by an individual concept, which is correct: they describe the
  exam, not any one idea within it.
- **6 × `inferred-ratio`** — 100% of concepts in every domain are `inferred: true`. This is
  true by construction, not a defect: stage 1 established that the Linux Foundation publishes
  no text below the competency name, so every concept beneath one is inference. The warning is
  worth keeping precisely because it keeps that fact visible.

## Unresolved questions

- LFCA question count is not stated in any official source checked (certification page,
  Candidate Handbook, Multiple Choice Exams FAQ, Multiple Choice Exams Important Instructions,
  free-resources page, learning-path PDF). Third-party figures exist but are unverified
  tier-3/4 and were not used. See `research/exam-mechanics.md` for the full account.
- The relationship between the certification page's "12 Month Exam Eligibility" and "One
  Retake" attributes (does the 12-month window bound the retake specifically, or the whole
  purchase-to-attempt period?) is not spelled out by the source.

## Access problems

- None. The owner signed in to the LFS200 portal personally on 2026-08-10; no credentials were
  handled on their behalf and no access control was bypassed. Course content was read through
  the portal's own course endpoint using that session.

## Coverage gaps

- **No official objective text finer than the competency name exists.** Verified 2026-08-09 in
  a browser on both authoritative pages. The certification page's accordion yields zero extra
  characters when fully expanded; the program-changes page claims per-domain change outlines
  that are not present. Consequence: `objective_verbatim` holds the competency name, and all
  finer taxonomy structure is `inferred: true`. LFS200 learning objectives will be attached in
  stage 4 as a separate course-derived tier, never as exam-derived official text.

## Research findings

### The published change notice is inaccurate

`https://training.linuxfoundation.org/lfca-program-changes-2025/` states the domains "will
remain unchanged". The Linux Foundation's own archived certification page (2025-08-01)
contradicts this. Recorded as a documented source disagreement in `data/sources.json` under
`lf-objectives-2025`, not silently resolved.

- **All six domain weights changed.** Both the old and new weight sets sum to 100
  independently, which cross-checks the archived transcription.
- **A domain was renamed:** "Supporting Applications and Developers" (8%) →
  "IT Project Management Fundamentals" (10%).

| Domain | Old weight | New weight |
| --- | --- | --- |
| Linux Fundamentals | 20% | 16% |
| System Administration Fundamentals | 20% | **30%** |
| Cloud Computing Fundamentals | 20% | 18% |
| Security Fundamentals | 16% | 14% |
| DevOps Fundamentals | 16% | 12% |
| Supporting Applications and Developers → IT Project Management Fundamentals | 8% | 10% |

### Competency change set

22 competencies: 8 unchanged, 8 reworded, 6 added. **Seven** removed outright.

- **Added** (no pre-2025 study material covers these): Command Line; Best Practices
  (System Administration); Disaster Recovery; Best Practices (Cloud); Networking (Cloud);
  Compliance.
- **Removed:** File Management Commands; System Commands; General Networking Commands
  (all three collapsed into "Command Line"); Serverless; Network Security; System Security;
  Deployment Environments.

### Study implications

1. System Administration Fundamentals is now the heaviest domain by a wide margin at 30%,
   up from a joint 20%. It warrants proportionally more preparation than any other.
2. Disaster Recovery, Compliance, and both Best Practices competencies are new. No
   pre-September-2025 resource — including older LFS200 editions — can cover them.
3. Serverless and Deployment Environments are no longer named competencies and are now
   low-yield study targets.
4. "Best Practices" and "Networking" each appear under two different domains and mean
   different things in each. They are kept distinct by a `Domain::Competency` key throughout.

### Corrections from the final whole-branch review

An independent review of all 29 commits found one Critical and several Important defects that
the per-task reviews had missed. All are fixed:

**Factual errors still in the data** — eight of them the stage-5 corrections that the controller
bug had silently discarded:

- `cloud.cloud-computing.cloud-control-planes` — **Critical.** Claimed "console work leaves no
  record". False: AWS CloudTrail, Azure Activity Log and GCP Cloud Audit Logs all record console
  actions by default, and the claim contradicted this dataset's own
  `cloud.best-practices.logging-and-auditing-in-cloud`. A question bank built on it would have
  taught that console changes are unauditable — a security misconception, not a trivia slip.
  Now: console work leaves no *reproducible artifact*, which was the intended point and is true.
- `sysadmin.system-administration.sticky-bit` — omitted the directory's owner and privileged
  processes, who can also delete (`inode(7)`, POSIX.1-2008).
- `sysadmin.disaster-recovery.hot-warm-and-cold-sites` — said a warm site has hardware **and
  data**. Per NIST SP 800-34r1 a warm site is partially equipped and data must be restored. As
  written, warm and hot were indistinguishable on exactly the axis the question tests.
- `cloud.best-practices.well-architected-review` — five pillars given as "the recognised
  pillars"; AWS has had six since Sustainability was added in December 2021.
- `sysadmin.system-administration.etc-shadow` — `0640 root:shadow` is Debian-family only; Red
  Hat ships `0000 root:root`. Now states both.
- Three lesser ones: the phishing "most common initial access route" superlative (DBIR 2025
  ranks credential abuse higher), `nice` ignoring `RLIMIT_NICE`, and `risk-assessment` folding
  risk *response* into risk *assessment*.
- `linux.command-line.and` — a degenerate id: the concept ". .. and ~" slugged to `and`, so a
  study guide keyed on ids would have rendered a topic called "and". Renamed.

**The depth rule was not applied as this document claimed.** It said "any concept with a
`confused_with` entry is Application level". Two defects:

1. The `confused_with` graph is directed, and the rule read only the *outgoing* edge. 32
   concepts that were merely the **target** of a named pair were never lifted — including
   `authentication-vs-authorization`, `cia-triad`, `tls-and-https` and
   `principle-of-least-privilege`, all in a 14%-weight domain and all textbook comparison
   targets. The graph is now treated as undirected.
2. The downward floor rule was gated on `importance >= 4` — which, because `importance` derives
   from domain weight, is reachable **only** by System Administration. This is the identical
   defect this document congratulates itself on having fixed one paragraph earlier, repeated in
   the guardrail meant to catch it. Recognition is now a single reviewed editorial list, and the
   guardrail checks that nothing reaches level 1 by accident instead.

Revised distribution: **L1 39 (7.3%), L2 156 (29.1%), L3 321 (59.8%), L4 15 (2.8%), L5 6
(1.1%)**. Seven concepts are members of a confusable pair yet still sit below Application:
`firmware`, `zombie-and-orphan-processes`, `sla-slo-and-sli`, `observability`, `gantt-chart`,
`lgpl` and `agpl`. That is deliberate, not a leak — the reviewed peripheral list takes
precedence over the mechanical rule, because being confusable with something does not make a
specialist topic worth studying to Application level on an entry-level exam. Above-Application stays at 3.9%, so there is still no LFCS/CKA drift. Security's mean
depth rose from 2.31 to 2.52 once its comparison targets were lifted.

**Three of the thirteen checks could not fire.** Every concept carries exactly
`official_sources: ["lf-objectives-2025"]`, so `missing-sources`, `weak-sources` and
`unknown-currency` were dead, and the definition-of-done row "every concept cites a tier-1/2
source — 537/537" was measuring that a constant had been written 537 times. Five checks were
added (18 total, 49 tests):

- `unsourced-concept` — requires a tier-1/2 source **independent of** the shared objectives
  source. The 57 concepts that cannot meet it are now waived **by name** in
  `data/sourcing-waivers.json` with the reason recorded, instead of passing invisibly.
  `stale-waiver` warns when a waiver is no longer needed.
- `derived-importance` — the stored `importance` must equal the formula. The whole argument for
  that field is that it is derived and reproducible, and nothing was checking it.
- `objective-mismatch`, `unknown-competency`, `invalid-enum` — three more load-bearing
  invariants that held by luck rather than by enforcement, and would not have survived three
  more cycles of edits to `data/`.

`tools/lib/load.mjs` now names the offending file in IO and JSON parse errors.

### Stage 7: depth assigned, with the guardrail run in both directions

Every concept carries a `required_depth` assigned by explicit rule rather than per-concept
opinion, so each rating is reproducible and its rationale is recorded in the concept's `notes`.

| Level | | Concepts | Share |
| --- | --- | ---: | ---: |
| 1 | Recognition | 35 | 6.5% |
| 2 | Understanding | 191 | 35.6% |
| 3 | Application | 290 | 54.0% |
| 4 | Troubleshooting | 15 | 2.8% |
| 5 | Administration | 6 | 1.1% |

**This distribution is the first-pass measurement, superseded by "Corrections from the final
whole-branch review" above.** The revised distribution is L1 39 (7.3%), L2 156 (29.1%), L3 321
(59.8%), L4 15 (2.8%), L5 6 (1.1%); `npm test` on the current tree reproduces it. The paragraphs
below describe the first-pass rules as they stood before that review, including the downward
floor's `importance >= 4` gate, which the review replaced with a reviewed editorial list — see
above for why.

**Upward guardrail — no drift toward LFCS, CKA or RHCSA.** Only 3.9% of concepts sit above
Application. Level 5 is deliberately restricted to six concepts where the specific
configuration syntax is itself examinable (`chmod` notation, sudoers/visudo, systemctl
start-vs-enable, crontab syntax, reading `ls -l` modes, SSH hardening). A 90-minute
multiple-choice exam with no practical component cannot test hands-on administration, and the
ratings reflect that.

**Downward guardrail — nothing important parked at recognition (first-pass rule).** The first
pass left six concepts at level 1 despite sitting in the 30%-weighted System Administration
domain. A floor rule raised anything with importance ≥ 4 to at least Understanding. Downward
drift was zero under that rule; the final review replaced the rule itself (see above), not this
result.

**Two flaws in the first rule set were found by the guardrail and fixed:**

1. The comparison rule was gated on `importance >= 3`, but because `importance` is derived from
   domain weight, that threshold is only ever reachable by System Administration. The rule was
   therefore silently applying to one domain out of six, under-rating every named confusable
   pair in Cloud, Security, DevOps and Project Management. Now any concept with a
   `confused_with` entry is Application level, since a named confusable pair is precisely the
   shape a multiple-choice comparison question takes.
2. Domain means were spread 1.77–2.92 before the fix and 2.13–2.92 after, which is a much
   tighter band and no longer suggests whole domains being systematically under-rated.

**The validator now exits 0 — zero errors across all 537 concepts.**

### Stage 5: primary documentation attached, and the adversarial layer earned its keep

Nine research agents, one per documentation corpus, checked all 537 concept descriptions
against primary sources (RFCs, NIST, kernel.org, GNU, systemd, git-scm, kubernetes.io, OCI,
NIST SP 800-145, OSI/SPDX, the Scrum Guide). Every claimed error was then handed to an
independent agent instructed to **refute** it, defaulting to "the original was fine".

**11 corrections were proposed. The committed adversarial-review artifact records 0
confirmations and 11 verdict-less rejections.**

The correction is worth stating plainly, because the first version of this section took credit
the process had not earned. A controller bug (documented in the ledger) keyed verdicts off a
content hash rather than the agent label, so the pairing was lost: `confirmed` is empty in
`.superpowers/sdd/stage5-results.json`, and all 11 proposed corrections — including the three
that were in fact applied (`device-drivers-and-kernel-modules`, `containers.kubernetes`,
`networking.vlan`) — sit in `rejected`, each carrying the identical string `"no verdict
recorded — treated as unverified and not applied"` and no reasoning field at all. No count of
corrections "confirmed by adversarial review" can be evidenced from this repository. The
refuter did do real work — including catching a proposed `/etc/shadow` rewrite that asserted
"not readable by ordinary users" and then contradicted itself in its own next clause — but that
reasoning survives only in a workflow transcript that is not committed to this repository; the
JSON artifact this document cites by name records no reasoning for any of the 11.

The final whole-branch review re-checked the eight against primary sources and found **all
eight were genuine errors that had survived**. All eight have now been fixed (see "Corrections
from the final review" below). The lesson recorded here for later cycles: an adversarial layer only
counts the verdicts it actually returns, and a silent default-to-reject looks exactly like a
confident refutation in the summary.

**The three corrections that survived**, all genuine and all exam-relevant:

| Concept | Was | Now |
| --- | --- | --- |
| `device-drivers-and-kernel-modules` | drivers are "loadable at runtime as modules **rather than compiled in**" | either compiled into the kernel image **or** built as a loadable module — Kconfig is tristate |
| `networking.vlan` | "a logical segmentation of **one physical switch**" | a broadcast domain independent of physical location; 802.1Q trunking lets one VLAN span **many** switches |
| `containers.kubernetes` | "**governed by** the CNCF" | **hosted by** the CNCF as a graduated project, governed by its own Steering Committee |

The Kubernetes one is the same class of error as the Linux Foundation/kernel governance mistake
caught in stage 3, and it contradicted this dataset's own `cncf` concept, which already said
"hosts". Two agents independently converged on the hosts-versus-governs distinction.

**Sourcing, as recorded at the end of Stage 5.** The registry grew from 11 to **274** sources:
19 tier 1, 252 tier 2 primary documentation, 2 tier 3, 1 tier 4. **480 of 537 concepts** cited at
least one tier-1/2 primary document at that point.

**Known shortfall at the time — 57 concepts had no primary-documentation citation**, concentrated
as:

| Concepts | Competency |
| ---: | --- |
| 19 | IT Project Management :: Project Management |
| 12 | IT Project Management :: Functional Analysis |
| 9 | IT Project Management :: Software Application Architecture |
| 7 | System Administration :: Best Practices |
| 10 | (Troubleshooting, Networking, Disaster Recovery, DevOps — 1-4 each) |

The cause is structural rather than an oversight: the authoritative references for classical
project management and business analysis — the PMBOK Guide, PMI Lexicon, ISO 21500/21502,
BABOK, ISO/IEC/IEEE 12207 and 29148 — are **paywalled**, and both pmi.org and gao.gov refused
automated fetches during the pass. These concepts still carry the tier-1 official objectives
source, so they clear the validator, but they lack the per-concept primary citation the rest of
the dataset has. Recorded rather than papered over.

**Superseded by the later write-back** (see "Dataset corrections" below): the registry now
holds **282** sources (20 tier 1, 259 tier 2, 2 tier 3, 1 tier 4), **485 of 537 concepts** cite
an independent tier-1/2 source, and the shortfall is **52** concepts, split 19 / 12 / 6 / 5 / 10
across the same five groupings. `data/sources.json` and `data/sourcing-waivers.json` are
authoritative; the figures above are the Stage 5 snapshot, not the current state.

### Stage 6: there is no public candidate evidence for the current exam

Searched for post-2025-09-16 LFCA candidate reports across general web search, Reddit, blogs,
and the Linux Foundation community. **None were found.**

What exists instead:

- **One substantive candidate report**, on DEV Community, published **2025-09-03** — thirteen
  days *before* the update. Its own content confirms it describes the retired exam: it lists
  the old weights (20/20/20/16/16/8) and the old $200 price. Registered as `devto-lfca-2025-09`
  at tier 4, and deliberately **not** attached to any concept as evidence, because it cannot
  speak to the current exam.
- **Third-party study guides publishing stale weights.** At least one prominent syllabus site
  still shows the pre-2025 20/20/20 split as current.
- **A large volume of braindump sites.** These dominate the search results and were excluded on
  sight, unread, per the project's exam-security rule (see the exclusion list below).

**Consequence for the dataset.** `candidate_evidence` is empty on all 537 concepts, and this is
a true reflection of the evidence rather than an omission. It also means the MEDIUM confidence
tier as originally defined — "inferred from official material and corroborated by two or more
independent candidate reports" — cannot currently be satisfied by anything. Concepts marked
MEDIUM rest on official material and reasoned inference alone, and should be read that way.

**Braindump sites excluded on sight** (logged rather than silently dropped, and never opened):
itexams.com, certempire.com, validexamdumps.com, passitexams.com, certlibrary.com,
certgod.com, exam-labs.com, p2pexams.com, marks4sure.com, certstest.com.

One incidental observation worth recording: several third-party sources state a specific
question count for the exam. This remains **unverified** — the Linux Foundation states no
question count anywhere, and these sources are tier 3/4 and demonstrably stale on other facts.
It is recorded here only as evidence that an unverified figure circulates; the figure itself is
deliberately not repeated in this document, consistent with the project rule that no question
count is stated or implied anywhere.

### Stage 4: LFS200 does not cover the current exam

This is the finding the project existed to test, and it is worse than "insufficient depth" —
the shortfall is structural.

**The course is still built on the pre-September-2025 syllabus.** Its chapter is named
"Supporting Applications and Developers" (a domain renamed in 2025), and it still carries
lessons for "Deployment Environments" and "Network Security" — both competencies removed in
2025. It has not been restructured for the current exam.

**Six competencies have no lesson at all**, four of them new in 2025:

| Competency | Concepts | New in 2025? |
| --- | ---: | --- |
| System Administration :: Best Practices | 20 | yes |
| Cloud Computing :: Performance/Availability | 17 | no |
| Cloud Computing :: Best Practices | 15 | yes |
| Cloud Computing :: Networking | 14 | yes |
| Security :: Compliance | 14 | yes |
| IT Project Management :: Functional Analysis | 12 | no |

A seventh, Disaster Recovery, has a lesson in name only: the `Backup` page contains **one
character**.

**Measured absences.** Each of these occurs zero times in the entire 158,185 characters:
`disaster recovery`, `business continuity`, `failover`, `redundancy`, `high availability`,
`replication`, `RTO`, `RAID`, `GDPR`, `HIPAA`, `ISO 27001`, `SOC 2`, `serverless`,
`elasticity`, `scalability`, `load balancer`, `CDN`, `VPC`, `region`, `availability zone`,
`Docker`, `pod`, `registry`, `orchestration`, `Scrum`, `Kanban`, `Gantt`, `MVP`, `cron`,
`crontab`, `journalctl`, `umask`, `SUID`, `SGID`, `sticky bit`, `ufw`, `/etc/fstab`,
`/etc/hosts`, `/var/log`, `authorization`, `multi-factor`, `TLS`, `VPN`.

Note the last: the course teaches `SSL` but never `TLS`, the term that superseded it.

**Cloud Computing is 18% of the exam and has one lesson** of 6,242 characters — about 4% of
the course — with three of its five competencies untaught.

**What the course does do well**, and is worth re-reading: `Linux Commands` (24,959 chars, the
largest lesson by far), `Network Troubleshooting` (14,657, the strongest material in the
course), `Securing Linux` (12,484), and `Git Concepts` (8,727).

**Confidence.** The structural findings and the measured absences are HIGH confidence — they
are counts. The per-concept coverage percentages are a deliberate **lower bound**: a concept
can be taught without its name appearing, so the automated matching understates true coverage.
It errs toward telling the candidate to study something rather than away from it.

### Stage 3 review outcome

An independent review of the 493-concept first draft returned "Needs fixes" and found three
things worth recording:

1. **Command Line was mis-mapped.** `data/competencies.json` records that the Linux Foundation
   collapsed *File Management Commands*, *System Commands* and *General Networking Commands*
   into the new Command Line competency, but the first draft filed every system and networking
   command under System Administration instead — so Command Line contained neither `ps` nor
   `ping`. Fixed by adding command-family concepts to Command Line that reference, rather than
   duplicate, the System Administration concepts they operate on. This also removed the
   Linux-vs-SysAdmin imbalance that the original rationale had explained away.
2. **Twelve descriptions were factually wrong**, five of them in ways that would have seeded
   confidently incorrect exam questions: `well-known-ports` mislabelled registered ports 3306
   and 5432 as well-known; `merge` claimed a merge commit is always created (fast-forward
   merges create none); `snapshot` claimed losing the volume always loses the snapshot (false
   for cloud provider snapshots, and self-contradictory with the Cloud domain);
   `linux-history` said the Linux Foundation governs kernel development (it sponsors and hosts
   — Torvalds and the maintainers govern); `dockerfile` said one layer per instruction (only
   RUN, COPY and ADD create layers). Also corrected: `/etc/passwd` and `/etc/group` field
   counts, `/etc/shadow` permissions, `nice` privilege rules, cloud control planes, copyleft
   "viral" framing, and PUT vs PATCH.
3. **The three thinnest competencies were all newly added in 2025** — SysAdmin Best Practices,
   Cloud Best Practices, Cloud Networking — with zero HIGH-confidence concepts between them.
   That inverted the project's purpose, since those are exactly the competencies no
   pre-2025 material covers. Expanded to 20, 15 and 14 concepts respectively.

44 concepts were added in total, including named gaps the review identified: port ranges,
reading `ls -l` mode strings, hot/warm/cold standby sites, SELinux/AppArmor, package signature
verification, semantic versioning, work breakdown structure, IPv4 address classes, cloud
storage tiers, route tables and bastion hosts.

`confused_with` was converted from free-text names to concept ids. Seventeen entries had been
silently pointing at nothing, and two were ambiguous between domains.

### Validator extended beyond the planned ten checks

Three separate reviews found integrity gaps the original ten checks could not catch, so three
were added (owner-approved deviation from the plan):

- `dangling-related-topic` — nine hand-written cross-domain links were broken and nothing caught them
- `dangling-confused-with` — also enforces that `confused_with` holds ids rather than free text
- `source-schema` — a source record missing `authority_tier` would let a concept citing only
  that source pass `weak-sources` unnoticed, a latent hole that would have widened as stages 5
  and 6 add many sources

Eighteen checks now. 49 tests passing.

### Tooling defect found and fixed during stage 1

`package.json`'s test script was `node --test tools/test/`. On Node 25 a bare directory path is
resolved as a module, so the command crashed with `MODULE_NOT_FOUND` and `npm test` had never
actually run. It went unnoticed because every task up to that point invoked the tests with
explicit file paths. Changed to `node --test`, which uses Node's own test discovery. Verified:
24/24 passing.

### Source problems

- The archived pre-2025 page rendered "System Security:" with a trailing colon. Treated as a
  typographic artifact of that page rather than part of the competency name.
- The Candidate Handbook carries no LFCA-specific content despite being linked from the
  certification page as a candidate resource.

## Cycle 2

Cycle 2 turns the verified 537-concept dataset into a study guide. Task 7 fixes two known
dataset problems before any prose is written, so writers never have to work around them.

### Dataset corrections

**Two concepts were too thin to teach from.**

- `sysadmin.system-administration.home` (`data/topics/02-system-administration.json`). Said:
  "User home directories." Now: states /home is the parent directory of regular users' personal
  home directories (each user's default working directory and $HOME), and explains the
  contrast with /root — kept outside /home per the FHS's rationale that root's home directory
  needs a location that resolves even if it is not on the same partition as the rest of /home
  (which is commonly split onto its own mount), plus the recurring exam-relevant mistake of
  assuming root's home is `/home/root` rather than `/root`. Added `confused_with`:
  `linux.command-line.root-directory-vs-root-vs-home` (an existing concept that already
  compares `/`, `/root`, and `~`). Primary sources: `fhs-3-0` (already cited) plus a newly
  registered `man-hier-7` (hier(7) — Linux man-pages project), both fetched and read directly
  to confirm the /home and /root text before writing the description.
- `devops.git-concepts.push` (`data/topics/05-devops.json`). Said: "Sending local commits to a
  remote." Now: distinguishes push from commit (commit only records a snapshot locally; nothing
  reaches the remote until a push), explains that the pushed remote/branch default to the
  branch's configured upstream and that `git push -u origin main` both pushes and sets that
  upstream, and states the non-fast-forward rejection rule (a push that would discard remote
  commits is refused unless `--force` is used). Added command `git push -u origin main` and
  `confused_with`: `devops.git-concepts.commit`. Primary source: newly registered `git-push`
  (git-push(1) — git-scm.com), read directly to confirm the description, defaulting behavior,
  and upstream-tracking mechanics before writing.

**The `Cloud Computing Fundamentals :: Networking` competency was written in AWS vocabulary as
if it were vendor-neutral — a cycle-1 defect found in cycle 2.** All 14 `cloud.networking.*`
concepts described AWS-specific product names (VPC, Elastic IP, Security Group / NACL, Route
53, Elastic Load Balancer, Direct Connect) as though they were generic industry terms. The LFCA
is not an AWS exam. Every description was rewritten so the vendor-neutral concept comes first —
virtual network, subnet, static/reserved public IP, security group vs. network access control
list, managed load balancer (layer 4 vs. layer 7), managed DNS, private connectivity, dedicated
circuit, route table, bastion/jump host, CIDR planning, private service endpoint — with AWS,
Azure, and Google Cloud terms kept only as examples, named together rather than in isolation.
No AWS term was deleted; each was demoted from the definition to an example, since a candidate
will still meet it. Two specific cross-provider claims were checked directly against current
documentation (Microsoft Learn, Google Cloud product pages) before writing: that Azure Network
Security Groups and Google Cloud VPC firewall rules are both stateful with no separate
stateless-ACL layer (unlike AWS's Security Group / NACL split), and that Google Cloud's route
model is defined at the network level rather than per-subnet like AWS's and Azure's route
tables. The rest of the rewrite was not individually checked against current documentation at
this stage — three of the "vendor-neutral" claims turned out to still be AWS-specific, caught by
a later review and corrected in a second pass (see "Errors a review caught after the first
pass" below). Only descriptions were changed for these 14; `commands`, `confused_with`,
`additional_sources`, and every locked field (`id`, `path`, `domain`, `competency`,
`objective_verbatim`, `sept_2025_status`, `required_depth`) were left untouched, as the brief
scoped this step to `description` only.

Affected: `cloud.networking.virtual-private-cloud`, `cloud.networking.cloud-subnets`,
`cloud.networking.public-vs-private-subnet`, `cloud.networking.security-group-vs-network-acl`,
`cloud.networking.internet-gateway-and-nat-gateway`,
`cloud.networking.public-and-elastic-ip-addresses`, `cloud.networking.cloud-dns`,
`cloud.networking.cloud-load-balancer-types`,
`cloud.networking.vpc-peering-and-private-connectivity`, `cloud.networking.hybrid-connectivity`,
`cloud.networking.cloud-route-tables`, `cloud.networking.bastion-and-jump-hosts`,
`cloud.networking.cidr-planning-for-cloud-networks`,
`cloud.networking.private-service-endpoints` (all in `data/topics/03-cloud-computing.json`).

No source citations were added or changed for the 14 networking concepts — the brief did not
ask for that in this step, and each concept's existing AWS/Azure sourcing was left as-is.

### Errors a review caught after the first pass

A follow-up review found that three of the "vendor-neutral" rewrites above still stated an
AWS-specific behavior as if it were the shared model across all three providers — exactly the
defect this task set out to fix. All three were corrected in a second pass, each checked
directly against current vendor documentation:

- `cloud.networking.cloud-subnets` (CRITICAL). The description said cloud subnets are
  "typically one subnet per zone" as the shared model. That is true only for AWS: AWS's docs
  state a subnet "must reside entirely within one Availability Zone and cannot span zones"
  (docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html). Azure states the opposite
  for its own platform — "Virtual networks and subnets span all availability zones in a region"
  (learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview). Google Cloud
  classifies a subnet as a regional resource, not a zonal one — "Subnets are regional resources"
  (cloud.google.com/vpc/docs/vpc, Specifications section). The description now states AWS's
  zone-scoping as the AWS-specific detail it is, not a shared rule.
- `cloud.networking.cidr-planning-for-cloud-networks` (IMPORTANT). The description claimed a
  virtual network's address range is "fixed at creation on every major provider." False on all
  three: AWS supports associating additional (secondary) IPv4 CIDR blocks with an existing VPC
  (docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html); Google Cloud supports
  expanding a subnet's primary IPv4 range via the `subnetworks.expandIpCidrRange` API
  (cloud.google.com/vpc/docs/create-modify-vpc-networks); Azure supports adding an address range
  to an existing virtual network (learn.microsoft.com/en-us/azure/virtual-network/manage-virtual-network).
  The description now keeps the genuine exam point — overlapping ranges break peering and hybrid
  connectivity, and a range already in use by other subnets or connections is painful to change
  — without the false absolute.
- `cloud.networking.internet-gateway-and-nat-gateway` (MINOR). The description implied Azure and
  Google Cloud have no named equivalent to an AWS internet gateway. Google Cloud's own routing
  documentation names a "default internet gateway" as the next hop of its system-generated
  default route (cloud.google.com/vpc/docs/routes), though it is not a resource you provision
  the way an AWS internet gateway is. Azure genuinely has no separately named equivalent —
  outbound internet reachability is an inherent virtual-network property rather than a routed
  resource (learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview). The
  description now reflects that split instead of a blanket "no equivalent."

The other 11 `cloud.networking.*` concepts were re-checked for the same failure mode during this
fix, with particular attention to the security-group-vs-network-acl statefulness claim and to
gateway/regional-vs-zonal claims elsewhere. `cloud.networking.security-group-vs-network-acl`'s
claims held up: Azure NSGs are confirmed stateful ("The flow record allows a network security
group to be stateful,"
learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview), and Google
Cloud VPC firewall rules are confirmed stateful and configured at the network level rather than
per subnet ("VPC firewall rules are stateful"; rule configuration "is associated with a VPC
network," cloud.google.com/firewall/docs/firewalls). No further errors of this kind were found
in the remaining 11.

### Verification

1. `npm run validate` — exit 0, 0 errors, 16 warnings (same 16 as before this task; all
   pre-existing `orphan-source` and `inferred-ratio` warnings). `derived-importance`,
   `invalid-enum`, `dangling-confused-with`, and `unsourced-concept` all clean.
2. `npm run generate` — regenerated `research/**` and `coverage-matrix.md`; exit 0.
3. `npm run validate && npm test` — both exit 0; 156/156 tests passing (unchanged count).
4. `npm run check-guide` — total error count went from 822 to 825 (537 missing-concept, 130
   comparison-coverage, 158 comparison-pointer; was 537/129/156). The two new `confused_with`
   edges account for the entire +3: `sysadmin.system-administration.home` →
   `linux.command-line.root-directory-vs-root-vs-home` adds the home concept as a member of an
   *existing* comparison block (that concept already owned a block comparing it with
   `linux.command-line.dot-dotdot-and-tilde`, since its id contains "-vs-" and wins ownership),
   so it adds one new required pointer but no new block. `devops.git-concepts.push` →
   `devops.git-concepts.commit` is a genuinely new pair with no prior block on either side;
   ownership ties on the "-vs-" naming rank, importance (1 each), and required_depth (3 each),
   so it resolves lexicographically to `commit` (`c` < `p`), creating one new comparison block
   (+1 comparison-coverage) that `push` must point to (+1 comparison-pointer), plus the +1
   pointer from the home/root edge above (+2 comparison-pointer total). No guide files exist
   yet, so every concept still reports `guide-missing-concept` (unchanged at 537) and every
   comparison block still reports `guide-comparison-coverage` as unwritten — expected until
   prose is written.

### Sources not independently verifiable

Every primary source cited above (`fhs-3-0`, `man-hier-7`, `git-push`, and the AWS/Azure/Google
Cloud product documentation consulted for the vendor-neutrality rewrite) was fetched and read
directly during this task. Nothing was cited without having been read.

### No exam-dump exposure

No exam dumps or leaked-question sites were searched for, opened, or used as sources at any
point in this task.

### Dataset corrections found while writing the guide

Task 34: writing the guide (Tasks 8–33) surfaced dataset defects the writers, reviewers, and
the wave-4 adversarial fact-check pass reported but had no mandate to fix in `data/`. This
task verified every reported finding against its primary source directly — fetching and
reading the actual document, not trusting the report — before changing anything, per the
brief's instruction that a finding is a report, not an instruction. Every finding below was
independently confirmed; none was found to be wrong. A number of them turned out to already be
reflected correctly in the guide's prose (written or fixed by an earlier wave) while `data/`
still carried the old, wrong claim — exactly the divergence this task exists to close.

**Sourcing that did not support the claim, now re-sourced or reworded:**

- `security.security.incident-response` — cited only `nist-sp-800-61r3` for the six-step
  prepare/identify/contain/eradicate/recover/learn sequence. Fetched and read SP 800-61 Rev. 3
  (April 2025) directly: it contains zero occurrences of "PICERL," "lifecycle," or the six-step
  phase list, and 32 occurrences of "CSF 2.0." Its own Table 1 is titled "Previous incident
  response life cycle model's phases and corresponding CSF 2.0 Functions" — Rev. 3 replaced
  the old phase model with the six CSF 2.0 Functions (Govern, Identify, Protect, Detect,
  Respond, Recover), a different six-item list. The six-step sequence is SANS's PICERL model.
  Added a new source `sans-picerl` (SANS Institute glossary page, which states verbatim:
  "SANS Incident Response Framework: Details a tactical six-step process encompassing
  Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned") and
  cited it alongside `nist-sp-800-61r3` (kept, since the guide's own prose correctly discusses
  the Rev. 2→Rev. 3 reorganisation, which that source does support). Settled by:
  https://csrc.nist.gov/pubs/sp/800/61/r3/final (fetched and read in full) and
  https://www.sans.org/security-resources/glossary-of-terms/incident-response.
- `cloud.cloud-computing.multi-cloud` and `cloud.cloud-computing.managed-services` both cited
  only `nist-sp-800-145`. Fetched and read the actual PDF text (not just its metadata): it
  defines exactly three service models (SaaS, PaaS, IaaS) and four deployment models (private,
  community, public, hybrid) and contains the word "multi-cloud" nowhere and "managed
  services" nowhere. For `multi-cloud`, added a new source `aws-what-is-multicloud` (AWS's "What
  is Multicloud?" page, which defines the term directly and explicitly contrasts it with hybrid
  cloud — the same pairing this concept's own comparison block uses) and kept `nist-sp-800-145`
  alongside it, since the guide's prose makes multi-cloud's absence from NIST's four deployment
  models the actual pedagogical point ("that absence is itself examinable") — a true, sourced
  claim NIST 800-145 does support, just not a definition of the term. For `managed-services`, no
  equally strong first-party definitional source could be found (AWS's "Managed Services" page
  turned out to be a specific commercial product, not a general definition); reworded the
  description instead so the source is cited for what it actually documents — the same
  consumer/provider control-tradeoff NIST 800-145 states for SaaS/PaaS/IaaS — matching what the
  guide's own comparison table already says ("NIST service model: Not defined as one — it is a
  consumption pattern"). Settled by:
  https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf (fetched and
  extracted in full) and https://aws.amazon.com/what-is/multicloud/.
- `cloud.cloud-computing.hybrid-cloud` omitted NIST's definitional binding condition. Confirmed
  NIST's exact wording from the same PDF extraction: "bound together by standardized or
  proprietary technology that enables data and application portability... (e.g., cloud
  bursting for load balancing between clouds)." The description named only "public and private
  used together with workloads placed deliberately in each" — deliberate placement, not the
  binding condition. Description now states the binding condition. (The guide's own prose
  already stated this correctly; only `data/`'s short description was out of date.)
- `cloud.cloud-computing.cloud-migration-approaches` named four strategies and used "replace."
  Fetched AWS's migration-strategies page directly: it names seven strategies, the "7 Rs" —
  Retire, Retain, Rehost, Relocate, Repurchase, Replatform, Refactor or re-architect — and uses
  "Repurchase," not "replace." Description rewritten to name all seven and use "repurchase."
  The guide's own "What it is" paragraph had already listed all seven Rs correctly in its
  second sentence but led with an informal four-item "Replace" framing in its first sentence,
  which contradicted its own next sentence; fixed to "Repurchase" there too. Settled by:
  https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html
  (fetched and read in full).
- `sysadmin.networking.network-host-and-broadcast-addresses` was sourced to RFC 919 (1984)
  alone for broadcast-forwarding behaviour. RFC 919 is no authority for any modern router
  default — RFC 2644 / BCP 34 (1999) is the one that changed it, confirmed by fetching the RFC
  directly: it updates RFC 1812 and states routers "MUST default to blocking receipt and
  blocking forwarding of network-prefix-directed broadcasts." Registered a new source
  `rfc-2644-bcp34` and added it. The guide's own "How it works" paragraph already named RFC
  2644 (BCP 34) by name and described this default change correctly — it was simply citing an
  unregistered source. Settled by: https://www.rfc-editor.org/rfc/rfc2644.html.
- `sysadmin.disaster-recovery.hot-warm-and-cold-sites` said a hot site is "running with current
  data" and a cold site is "space, power and connectivity only." Fetched and read NIST SP
  800-34 Rev. 1 directly: section 5.1.5 states a hot site "should have the most recent version
  of backed-up data loaded, requiring only updating with data since the last backup" — real-time
  currency belongs to the separate "Mirrored Site," described as "fully redundant facilities
  with automated real-time information mirroring." Table 3-3 records a Cold Site's Hardware
  Equipment as "None" and Telecommunications as "None," not "connectivity only." Description
  rewritten to match both points. (The guide's own prose already stated this correctly, quoting
  the same NIST language; only `data/`'s description was stale.) Settled by:
  https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-34r1.pdf (fetched and
  extracted in full, section 5.1.5 and Table 3-3 read directly).
- `cloud.networking.internet-gateway-and-nat-gateway` said Azure outbound reachability is "an
  inherent property of a virtual network rather than a routed resource." Fetched Microsoft's
  default-outbound-access page directly: "Azure portal already defaults to subnets as private by
  default," and "In the API version released after March 31, 2026, the defaultOutboundAccess
  property for subnets in new VNETs will be set to 'false' by default... across all other
  configuration methods." Description rewritten to state that outbound reachability now
  requires an explicit method. Added a new source `ms-azure-default-outbound-access`. (The
  guide's own prose already stated this correctly, including the 31 March 2026 date; only
  `data/`'s description and the guide's metadata `sources:` line were out of sync.) Settled by:
  https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/default-outbound-access.

**Source records fixed or added in `data/sources.json`:**

- `owasp-top10-injection` pointed at Top 10:2021 A03. Fetched https://owasp.org/Top10/2025/
  directly: the current edition is Top 10:2025, where Injection is A05 and A03 is now "Software
  Supply Chain Failures." Retitled and re-pointed to
  `https://owasp.org/Top10/2025/A05_2025-Injection/`.
- `verizon-dbir` was a year-agnostic landing page. Confirmed the 2026 DBIR exists and is the
  edition the guide's prose actually cites (the 31% vulnerability-exploitation figure). Pinned
  to `https://www.verizon.com/business/resources/reports/2026-dbir-data-breach-investigations-report.pdf`.
  Also added `verizon-dbir` to `security.security.vulnerabilities-cves-and-patching`'s
  `additional_sources` — the guide's prose cited the DBIR by name but the source array omitted
  it.
- `man-proc-pid-oom-score` — checked whether it still documents the removed 3% root-process
  memory bonus (kernel commit `d46078b28889`, absent from `mm/oom_kill.c` since v4.17). Fetched
  the actual cited page directly: `proc_pid_oom_score(5)` does **not** contain the 3% claim at
  all — it only says "whether the process is privileged (−)," with no figure. The stale 3%
  text lives on a different, easily-confused page, `proc_pid_oom_score_adj(5)`, which as of
  2026-08-11 still reads "root processes are given 3% extra memory over other tasks." This is
  exactly what the guide's own Traps paragraph for
  `sysadmin.troubleshooting.out-of-memory-and-the-oom-killer` already says
  ("that bias was removed in Linux 4.17, although `proc_pid_oom_score_adj(5)` still documents
  it") — but no source record existed for that page. Added notes to `man-proc-pid-oom-score`
  clarifying it is not itself stale, registered a new source `man-proc-pid-oom-score-adj` for
  the page that actually carries the stale claim, and registered `kernel-docs-proc-rst`
  (`Documentation/filesystems/proc.rst`, section 3.1 — confirmed to exist and to omit the 3%
  figure) as the actively-maintained pairing the task suggested. Both new sources were added to
  the OOM concept's `additional_sources` and to its guide metadata line.
- Registered `rfc-2644-bcp34`, `ms-azure-default-outbound-access`, and `sans-picerl` — see
  above.

**`coverage_status` contradicting cycle 1's own course map:**

- `security.security.tls-and-https` and `security.security.selinux-and-apparmor` were both
  FULLY COVERED via lesson `ch9.l3`. `research/lfs200-notes/00-course-map.md` records both
  terms as measured absences across the whole 158,185-character course (TLS: SSL appears 7
  times, TLS never; SELinux: zero occurrences), and separately records that the "Network
  Security" competency `ch9.l3` maps to was itself removed in the 2025 syllabus update. A
  concept whose defining term never appears cannot be fully covered by the lesson. Per the
  brief, the derived field was not hand-edited directly — its input, `lfs200_sources`, was
  changed from `["ch9.l3"]` to `[]` for both concepts, and `coverage_status` was changed to
  NOT COVERED to match, consistent with how every other concept with an empty `lfs200_sources`
  in this dataset is marked. The guide's SELinux block already flagged this exact
  contradiction in its own "What the exam may test" paragraph ("the FULLY COVERED tag reflects
  the lesson-level mapping to ch9.l3 rather than the course actually naming this material") —
  that paragraph and both metadata lines were updated to match the corrected status.

**Waivers no longer justified, removed from `data/sourcing-waivers.json` with a source added:**

- `sysadmin.best-practices.separation-of-duties` — fetched and read NIST SP 800-128 directly.
  Page 30, section 3.1, states the control verbatim: "best practices for configuration change
  control require that changes to the system be vetted by at least one authorized individual
  who is independent of the requestor – in other words, in order to maintain adequate
  separation of duties, system administrators, developers, etc., are not given the authority to
  unilaterally propose and approve changes to the configuration of a system." Un-waived; added
  `nist-sp-800-128` (already a registered source, already cited by the neighbouring
  `backup-before-change` concept in this competency) to `additional_sources`, and updated the
  guide's waiver marker and metadata line to match.
- `sysadmin.best-practices.user-onboarding-and-offboarding` — a wave-4 fact-check finding
  flagged this as "worth a second look," lower confidence than separation-of-duties. Fetched
  and read NIST SP 800-53 Rev. 5 control AC-2 (Account Management) directly: it requires
  organisations to "Create, enable, modify, disable, and remove accounts," to notify account
  managers "when users are terminated or transferred," and to "Align account management
  processes with personnel termination and transfer processes" — a direct match for this
  concept's description ("granting access on joining and — more importantly — revoking every
  credential on departure"). Un-waived; added `nist-sp-800-53r5` to `additional_sources` and
  updated the guide's waiver marker and metadata line.
- `pm.software-application-architecture.client-server-model` — waived under the "classical
  project management / business analysis references are paywalled" rationale, which does not
  apply here. RFC 9110 section 3.3 ("Connections, Clients, and Servers") defines the term
  exactly as the concept describes it: "The terms client and server refer only to the roles
  that these programs perform for a particular connection." `rfc9110` was already a registered
  source and already cited by four sibling concepts in this same competency (`api`, `rest`,
  `http-methods-and-status-codes`, `stateless-vs-stateful-applications`). Un-waived; added
  `rfc9110` to `additional_sources`; the guide's "What it is" paragraph now quotes RFC 9110
  directly.
- `pm.software-application-architecture.microservices` and
  `pm.software-application-architecture.monolithic-architecture` — same over-broad waiver
  rationale. The CNCF Cloud Native Glossary (`cncf-glossary`, already registered, tier 1) has
  direct entries for both: "Microservices Architecture" ("an architectural approach that breaks
  applications into individual independent (micro) services...") and "Monolithic Apps" ("A
  monolithic application contains all functionality in a single deployable program"), fetched
  and confirmed directly. Un-waived both; added `cncf-glossary` to each's `additional_sources`
  and removed the waiver markers from the guide.
- `sourcing-waivers.json`'s `by_competency` counts updated to match: `System Administration
  Fundamentals :: Best Practices` 7 → 5, `IT Project Management Fundamentals :: Software
  Application Architecture` 9 → 6.

**Other dataset defect fixed (found by the wave-4 fact-check pass, not previously in the
ledger):**

- `devops.containers.dockerfile` (`data/topics/05-devops.json`) described WORKDIR as
  metadata-only alongside ENV, LABEL, EXPOSE and CMD. Per the Dockerfile reference: "If the
  WORKDIR doesn't exist, it will be created even if it's not used in any subsequent Dockerfile
  instruction" — a filesystem change like any other. This had already been corrected in the
  guide's prose (`study-guide/05-devops/containers.md`) by an earlier fix round; only the
  dataset's own `description` field still carried the old claim. Description corrected to
  match.

**Rejected findings — verified but judged insufficient to act on:**

- `sysadmin.best-practices.naming-conventions` — reported as a weaker case than
  separation-of-duties; judgement was requested. Fetched and read all four occurrences of
  "naming" in NIST SP 800-128 directly: Configuration Item Identification ("methodology for
  selecting and naming configuration items"), Media Library Procedures ("naming conventions for
  media, labeling procedures"), a CPE reference ("a standard naming convention for operating
  systems, hardware, and applications" for vulnerability matching), and an Appendix D template
  heading, "Configuration Item Labeling [Naming convention for CIs]." None of these develops
  guidance on the concept's actual scope — "predictable names for hosts, users, and resources."
  Judged too narrow to support independent sourcing; left waived, no source added.
- `sysadmin.best-practices.capacity-planning` — the brief explicitly instructed not to un-waive
  on the reported evidence (NIST SP 800-128 names it once, too narrowly). Not investigated
  further; left waived, no source added.

No finding in this task's scope was found to be factually wrong when checked against its
primary source — every correction above was independently confirmed by fetching and reading
the actual document (RFC, NIST Special Publication, AWS/Microsoft documentation, SANS page, or
CNCF glossary entry) before any file was changed, not by trusting the report that raised it.

**What could not be independently verified:** the SANS Institute's overall standing as a
citable authority for this dataset was not separately investigated beyond confirming the exact
quoted text exists on its site; it was registered as `authority_tier: 2`, consistent with how
this dataset treats other vendor/organisation documentation (AWS, Microsoft, man-pages
project) rather than government/IETF-standard tier 1 sources.

### Verification (Task 34)

1. `npm run validate` — exit 0. 537 concepts checked, 0 errors, 16 warnings — the same 16
   pre-existing `orphan-source` (10) and `inferred-ratio` (6) warnings as before this task.
   `stale-waiver` did not fire: every un-waived concept was removed from
   `data/sourcing-waivers.json` in the same change that added its independent source, rather
   than left in the list with a source added.
2. `npm run generate`, then `npm run validate && npm test` — all exit 0. 163/163 tests passing.
3. `npm run generate` a second time, then diffed the regenerated files against the first run's
   output directly (not against git HEAD, which also contains this task's other changes) —
   byte-identical. Regeneration is idempotent.
4. `npm run check-guide` — 0 errors, 0 warnings across all 32 guide files and 537 concepts.
   Several data corrections (coverage_status for TLS/SELinux, the un-waived concepts) changed
   what the guide was required to state; the guide prose was updated in the same change
   (metadata lines, the SELinux exam-note paragraph, and the removed waiver markers for the 5
   un-waived concepts) so no new guide errors were introduced.

### What cycle 2 built

A `study-guide/` tree: 32 files, 285,385 words (`find study-guide -name '*.md' | wc -l`;
`find study-guide -name '*.md' -exec cat {} + | wc -w`, run directly against the working tree,
not recalled from an earlier task's log). That is 6 domain index files, 22 competency files, 2
appendices, `README.md`, and `STYLE.md`. It covers all 537 concepts in `data/`, the same 537
`npm run validate` checks. 130 canonical comparison blocks are written (131 `<a id="cmp-…">`
anchors in the tree; the 131st is inside `STYLE.md`'s fenced grammar example, which
`guide-parse.mjs` deliberately treats as non-prose and does not count — confirmed by excluding
`STYLE.md` from the grep and getting 130). That is one more than the design's original 129:
Task 7's dataset enrichment of `sysadmin.system-administration.home` and
`devops.git-concepts.push` added one genuinely new `confused_with` edge between them and
existing concepts, and one of the two ties resolved into a brand-new block rather than joining
an existing one. 171 concepts carry a non-empty `commands` array totalling 380 command strings
(one more than the design's original 379 count, added by the same Task 7 enrichment).

### The harness — what `npm run check-guide` proves and what it does not

Run directly against the current tree: `32 guide file(s), 537 concept(s) — 0 error(s), 0
warning(s)`. `npm test`: 163 tests, 163 passing. `npm run validate`: `537 concept(s) checked —
0 error(s), 16 warning(s)` (all 16 are the same pre-existing `orphan-source` and
`inferred-ratio` warnings carried since before cycle 2 started; none is new). `npm run
generate` was re-run and left the working tree with no diff — `research/**` and
`coverage-matrix.md` are current.

`check-guide` runs 14 checks over the guide text and proves, mechanically, that:

- every one of the 537 concept ids has exactly one definition site, and none is defined twice;
- every one of the 158 undirected `confused_with` edges is covered by exactly one of the 130
  comparison blocks, each block's `compares:` membership matches what `tools/lib/comparisons.mjs`
  computes from `data/` exactly, and every non-owning member of a block links back to it —
  either a standalone pointer sentence for a topic-defined concept or the matching in-row link
  for a glossary-defined one;
- every string in a concept's `commands` array appears verbatim, as a code span or fenced code
  line, inside that concept's block — not merely somewhere in the surrounding prose;
- every section holding a definition site has a Scenario and a Knowledge check, and every
  definition site carries the body labels its `required_depth` requires;
- all 57-that-were, now 52, waived concepts (see below) carry the no-primary-source marker;
- every metadata line (depth, importance, `coverage_status`, source ids) matches `data/`
  exactly, and every relative link and anchor resolves.

**What it does not prove: that anything the guide says is true.** Check-guide is a structural
and referential proof, not a factual one. A concept block can satisfy every one of the 14
checks while stating something false, so long as the false statement sits next to the required
labels and the correct command string appears verbatim somewhere in the block. That gap is
exactly what the adversarial fact-check below exists to narrow, and it narrows it over two
specific claim classes only — commands and waived-concept sourcing — not the prose as a whole.

### The adversarial fact-check

**First attempt failed wholesale.** Workflow `wjvrws8fy` / `wf_13d3eef9-ad6` dispatched 22
agents, one per competency file; all 22 hit the session usage limit within 31 seconds. Zero
files were checked, zero claims examined, zero verdicts recorded. This is recorded here as a
pass that did not run, not as a pass that found nothing — the distinction the design
(`docs/superpowers/specs/2026-08-10-lfca-study-guide-design.md`, "Layer 2") calls out by name
as the failure mode cycle 1 hit.

**Re-run in two parts** after the usage limit reset. A probe on `command-line.md` — the
command-heaviest file — examined 64 command claims against man7.org, manpages.debian.org,
POSIX, RFC 6335, FHS 3.0, `ip-sysctl.txt`, `capabilities(7)`, GNU coreutils source, and several
empirically against real BSD and GNU binaries on this machine; 0 refuted. A second run
(`webnn54s2` / `wf_93a47e4e-924`) then covered the remaining 13 competency files that carry
either a command or a waived concept. Together the two runs produced verdicts for all 14
competency files that had anything to check, recorded in `docs/verification/factcheck-*.json`
(committed, 14 files) as `{claim_id, concept_id, kind, claim, verdict, reasoning, source}`.

Counted directly from those 14 files: **765 claims examined — 710 confirmed, 55 refuted.**
Split by kind: 655 command claims (45 refuted) and 110 waiver claims (10 refuted) — the same
45-and-10 split named in the commit that fixed them (`29dd050`).

**Eight competency files were never checked at all**, because they carry no command and no
waived concept: Cloud Computing, Performance/Availability, Budgeting, Cloud Best Practices,
Cloud Networking, Sensitive Data, Compliance, and Open Source Software and Licensing (verified
directly from `data/topics/*.json`: each of these eight has zero concepts with a non-empty
`commands` array and zero concepts in `data/sourcing-waivers.json`). This is scoping, not
coverage — the fact-check layer was designed to examine exactly two claim classes, and these
eight files contain neither. No other claim in their prose — descriptions, exam-trap framing,
comparison text — has been adversarially checked by this pass or any other.

### Defects the process caught

**The adversarial layer caught what the per-task reviews had already passed.** All 55 refuted
findings above were in files that had already been through Layer-1 review (writer → reviewer →
fixer) and passed. Two concrete examples from the refuted set: `linux-os` claimed `chsh -l`
lists the shells in `/etc/shells` — true only for util-linux's `chsh`; Ubuntu 24.04 ships
shadow-utils `chsh`, which rejects `-l` outright. `git-concepts` claimed a commit "carries a
link to its parent commit, two parents, for a merge commit" — an octopus merge has three or
more. Both read as correct prose and cite a real command; both were platform- or case-specific
claims stated as universal, the exact shape of error a structural check cannot catch and a
single reviewer reading for plausibility did not catch either. All 55 were fixed in commit
`29dd050`, touching the 12 guide files that actually had a refuted finding (the other two of
the 14 checked files, `command-line.md` and `devops-basics.md`, had none).

**Earlier waves, from the ledger (`.superpowers/sdd/progress.md`), for scale:**

- Task 3 (the guide parser): review found 5 rounds of real defects, including a CRLF or trailing
  space silently producing zero definitions for a whole file, an indented Quick-reference row
  vanishing, and two separate fence-blindness bugs where a `# comment` inside a fenced example
  terminated a concept block early.
- Task 4 (structural checks): review found 3 Critical accidental-pass paths in the check design
  itself — a depth-3 concept stubbed as a one-line glossary row satisfied coverage, depth, and
  metadata checks at once; a body-label match was a substring over the whole block rather than
  line-anchored; an unknown `--scope` silently matched nothing rather than erroring.
- Task 5 (remaining checks): review found the command-coverage check credited a substring match
  (`uname -rV` would have satisfied a required `uname -r`), and that the dataset's own concept
  `linux.command-line.pipes` — whose command is literally `|` — was satisfied by any markdown
  table's own `|` syntax, not by the concept naming its command as code.
- Task 8 (pilot competency): review found a spec-level contradiction between the depth-1
  glossary-row rule and the comparison-pointer rule (resolved in the design), and 2 Critical
  errors in the one orientation paragraph all 22 competency files copy — a wrong claim about
  Linux's domain rank and a wrong LFS200 coverage fraction, one of which contradicted a
  metadata line 20 lines below it in the same file. Fixed systemically by having `guide-plan`
  print the correct figures rather than leaving a writer to compute them.
- Wave 1 (20 competency files, background workflow): 40 agents dispatched, 19 died on the
  session usage limit (17 reviews, 2 writes); only 2 of the files that did get reviewed were
  approved on first pass.
- Wave 2 (finished the 22 files): 36 agents, 0 failures. 1 Critical, 34 Important, 83 Minor
  findings; only 3 of 19 reviews approved first pass. The Critical and Important findings were
  fixed by the fix stage — the ledger confirms this explicitly. **The 83 Minor findings are
  recorded only as an aggregate count; nothing in the ledger or the repository records which of
  them were fixed, deferred, or rejected.** This report does not claim they were resolved.
- Wave 3 (domain indexes, README, appendices): 26 agents, 0 failures. 1 Critical, 11 Important;
  only 1 of 9 approved first pass. Findings were almost entirely hand-computed arithmetic and
  rank claims stated with confidence and wrong — a domain claimed "ranked second largest" when
  it was joint-largest, a claimed dependency between two topics that named a file section
  neither topic actually appeared in, a README comparison-block count off by one. All Critical
  and Important findings were fixed.

### Dataset corrections

Already written above under "Dataset corrections" (Task 7) and "Dataset corrections found while
writing the guide" (Task 34). Checked against `data/` directly rather than re-summarized: the 5
un-waiving corrections, the `coverage_status` correction for TLS/HTTPS and SELinux/AppArmor, and
the two source-record fixes are all present in the current `data/sourcing-waivers.json`,
`data/sources.json`, and `data/topics/*.json` exactly as described. `data/sourcing-waivers.json`
currently lists **52 waived concepts**, down from the 57 cycle 1 recorded — the 5 removed are
`sysadmin.best-practices.separation-of-duties`, `sysadmin.best-practices.user-onboarding-and-offboarding`,
`pm.software-application-architecture.client-server-model`,
`pm.software-application-architecture.microservices`, and
`pm.software-application-architecture.monolithic-architecture`, each un-waived only after a
primary source was fetched and read directly (NIST SP 800-128, NIST SP 800-53 Rev. 5, RFC 9110,
and the CNCF Cloud Native Glossary respectively). Two candidates were investigated for
un-waiving and explicitly left waived because the evidence was judged too narrow:
`sysadmin.best-practices.naming-conventions` and `sysadmin.best-practices.capacity-planning`.

Separately, the adversarial fact-check's 10 refuted waiver claims (see above) were about hedging
and phrasing inside the waiver marker's surrounding prose, not about whether a concept should
still be waived — a different question from the write-back's un-waiving decisions, and both are
recorded accurately as such above.

### What remains unverified or unresolved

- **The final whole-branch adversarial review has now run.** It used six independent lenses —
  every number in the guide recomputed from `data/` and the tooling; prose accuracy in the eight
  competency files with no commands and no waived concepts, checked against primary sources;
  whether the project's own process documents claim more than their artifacts support; whether
  the harness (`check-guide` and its 14 checks) can be satisfied by prose that does not teach;
  cross-file self-consistency across all 32 study-guide files; and whether the guide teaches the
  distinction and respects the project's constraints — followed by a synthesis pass that
  re-derived every numeric claim, re-read every cited line, and re-ran `check-guide`, `validate`,
  the test suite and `guide-plan`.
  Six lenses returned 69 raw findings; synthesis confirmed **29** (2 Critical, 10 Important, 17
  Minor) and rejected 5 that did not survive checking. All 29 confirmed findings have been
  applied; see the correction log this section leads into.
  **The 5 rejected findings**, and why: (1) Appendix A's "502 and 503 characteristically emitted
  by a proxy" against networking.md's "502 and 504 are gateway codes by definition" — not a
  contradiction, both hold under their own modality (practice versus RFC 9110 definition). (2)
  54 of 100 Scenario blocks exceeding 150 words — STYLE.md section 6 states a target, not a
  bound, and none is under 80 words or split across paragraphs, so there is nothing to fix. (3)
  networking.md coming out at the corpus word-count average despite being marked "Weak area —
  write denser" in the plan — a process observation about plan execution, not a content defect;
  close reading found the file discrimination-first and technically accurate regardless. (4) "IT
  Project Management is at 14 of 80 non-NOT-COVERED concepts", used as supporting evidence in
  one lens's rank table — recomputation gives 13 of 80; the rank conclusion the evidence
  supported is unaffected, but the number itself was wrong and was not carried into the
  confirmed set. (5) Extending the network-ACL default-posture finding to two further
  `03-cloud-computing/networking.md` passages — rejected because those passages already frame
  the symptom as presupposing a stateless layer with a missing outbound rule, which is correct
  as written; only the comparison-table cell needed the fix.
  **Coverage gaps the review itself reported**, for the next cycle: no network fetch was
  performed in this synthesis pass, so every external fact it confirmed (AWS default network
  ACL behaviour, Google Cloud's load-balancer rename, NIST SP 800-53r5's PM-1 title, Apache-2.0's
  combination limb, LGPL-2.1 section 6, the Nevada/Washington/Minnesota PCI statutes) was
  assessed from knowledge against reviewer-quoted evidence, not re-fetched, and should be
  confirmed against primary text before further edits; the Linux Foundation's own published
  pages were never fetched by any lens, so the fixed exam facts and the no-published-question-
  count claim rest on cycle-1 browser work with no capture artifact in the repository; LFS200
  course content is unverifiable here — the course is paid and only `00-course-map.md` (the
  assertion itself) is in the repository, and this pass found that file's own Security row
  already out of sync with `data/`, direct evidence the research layer can drift unnoticed; no
  command in the guide was executed (docker, kubectl, ss, ufw, firewall-cmd, ip and nmap are not
  on the review host), and three command claims were flagged as needing a targeted check on the
  right systems — `crontab -T FILE` (cronie) versus `crontab -n FILE` (Debian cron) in
  `system-administration.md`, the `postgres:18`-only volume path in `containers.md`, and the
  BSD-vs-macOS `man` section-order string in `command-line.md`; prose factual accuracy across
  most of the corpus remains unchecked outside the sampled files — the fact-check lens read 8 of
  22 competency files and the teaching lens read roughly 65 of 537 concepts in full; no
  Knowledge-check answer was verified against a source; 107 of 130 comparison blocks were not
  read for same-file self-consistency; the dataset itself (`depth`, `importance`,
  `coverage_status`, source ids, the `confused_with` graph) was treated as ground truth
  throughout, not re-derived against the published objectives; `npm run generate` was not run
  during the review, so a stale generated view could not be fully ruled out (checked indirectly
  instead); and documents outside the four audited (`PROGRESS.md`, `README.md`,
  `study-guide/README.md`, `STYLE.md`) — `coverage-matrix.md`, the domain indexes as documents,
  `docs/`, `labs/`, `lab/`, `Dockerfile`, `compose.yml` — were not reviewed end to end.
- **83 Minor findings from Wave 2's review have no individual disposition on record** (see
  above) — only the aggregate count survives.
- **Minor findings carried forward from Tasks 2, 4, and 7** were never revisited by a later task,
  because the final review that was supposed to carry them has not run:
  - Task 2: 113 of 156 `confused_with` edges (72%) tie through the ownership rule and resolve
    lexicographically rather than by importance; `undirectedEdges`' two-key sort comparator is
    verified only on the real edge array, not by a dedicated multi-edge unit test. That ratio
    was measured at Task 2, against the 156-edge array of the time; the dataset now carries 158
    edges and the ratio has not been recomputed against the current array.
  - Task 4: `checkDuplicateDefinition`'s outside-any-section detection keys on concept id, so a
    stray duplicate outside a section is masked by a properly-placed copy of the same id — the
    ensemble of checks still errors regardless, so this is a check-design note, not a known gap
    in what is actually caught.
  - Task 7: `cloud.networking.public-vs-private-subnet` frames public/private purely as a
    route-table property; Google Cloud's actual mechanism (a per-instance external IP against a
    network-level default route) does not map onto that framing as cleanly as AWS's or Azure's
    does.
- **Only 14 of the 22 competency files were adversarially fact-checked at all**, and only for
  commands and waiver hedging within those 14 — no other prose claim, in any of the 32 files,
  has been checked against a primary source by this layer.
- **`candidate_evidence` is empty on all 537 concepts, and no exam question count is stated
  anywhere in the guide or this document** — verified by direct query
  (`node` script over `data/topics/*.json` found zero concepts with a non-empty
  `candidate_evidence` array; a repository-wide grep for a stated question count found none).
  Both are by design, not oversight: no public post-2025 candidate evidence exists to record,
  and the Linux Foundation does not publish a question count for this exam.
