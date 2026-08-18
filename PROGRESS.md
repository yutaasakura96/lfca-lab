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
  retake included with purchase, exact mechanics not spelled out). Question count was recorded
  as **not stated in official sources** across stages 1 and 2 — **superseded 2026-08-11, see the
  "Question count: adopted" subsection below.** The Multiple Choice Exams Important Instructions
  page now states 60 questions (CNPA: 85), and this project has adopted that figure at HIGH
  confidence. See `research/exam-mechanics.md` Section 1 and
  `docs/verification/exam-facts-2026-08-11/`.

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

- ~~LFCA question count is not stated in any official source checked (certification page,
  Candidate Handbook, Multiple Choice Exams FAQ, Multiple Choice Exams Important Instructions,
  free-resources page, learning-path PDF). Third-party figures exist but are unverified
  tier-3/4 and were not used.~~ **Superseded 2026-08-11**: the Multiple Choice Exams Important
  Instructions page now states 60 questions (CNPA: 85); adopted at HIGH confidence. See the
  "Question count: adopted" subsection below and `research/exam-mechanics.md` for the full
  account.
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
  source. The 57 concepts that could not meet it at the end of cycle 1 were waived **by name**
  in `data/sourcing-waivers.json` with the reason recorded, instead of passing invisibly.
  `stale-waiver` warns when a waiver is no longer needed. Cycle 2 removed five of those
  waivers after finding free primary sources for them, so the list now holds 52.
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

### Stage 5: primary documentation attached, and what the adversarial layer can be shown to have done

Nine research agents, one per documentation corpus, checked all 537 concept descriptions
against primary sources (RFCs, NIST, kernel.org, GNU, systemd, git-scm, kubernetes.io, OCI,
NIST SP 800-145, OSI/SPDX, the Scrum Guide). Every claimed error was then handed to an
independent agent instructed to **refute** it, defaulting to "the original was fine".

**11 corrections were proposed. The adversarial-review artifact recorded 0 confirmations and 11
verdict-less rejections — and that artifact is not in this repository, so nothing below about
its contents can be checked from a clone.**

The evidence position comes first, because it is the only part a reader can verify. Stage 5
wrote its results to a `stage5-results.json` in the local `.superpowers/sdd/` working
directory. That directory is ignored in full — `.superpowers/sdd/.gitignore` is a single `*`
line — and `progress.md` (the run ledger) is the one file under it that is tracked in spite of
that rule. The JSON was never committed. Anyone who has only this repository can read the ledger
and cannot read the results file, so the description that follows is an account of what the run
produced, not a citation.

What the run produced, as recorded at the time: a controller bug keyed verdicts off a content
hash rather than the agent label, so the claim-to-verdict pairing was lost. The ledger records
the lost pairing and its consequence; the content-hash detail is from the run itself.
`confirmed` came back empty, and all 11 proposed corrections — including the three that were in
fact applied (`device-drivers-and-kernel-modules`, `containers.kubernetes`, `networking.vlan`)
— landed in `rejected`, each carrying the identical string `"no verdict recorded — treated as
unverified and not applied"` and no reasoning field at all. The conclusion that survives into
this document is therefore the conservative one, and it does not depend on the missing file:
**no count of corrections "confirmed by adversarial review" is evidenced by anything a reader
of this repository can open.** The refuter did do real work — including catching a proposed
`/etc/shadow` rewrite that asserted "not readable by ordinary users" and then contradicted
itself in its own next clause — but that reasoning survives only in a workflow transcript that
is likewise uncommitted.

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

~~One incidental observation worth recording: several third-party sources state a specific
question count for the exam. This remains **unverified** — the Linux Foundation states no
question count anywhere, and these sources are tier 3/4 and demonstrably stale on other facts.
It is recorded here only as evidence that an unverified figure circulates; the figure itself is
deliberately not repeated in this document, consistent with the project rule that no question
count is stated or implied anywhere.~~ **Superseded 2026-08-11**: the third-party figure these
sources circulated was 60, and an official Linux Foundation page now states exactly that number.
See the "Question count: adopted" subsection below.

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
eight files contain neither. ~~No other claim in their prose — descriptions, exam-trap framing,
comparison text — has been adversarially checked by this pass or any other.~~ **Superseded
2026-08-11: false, twice over.** Commit `97cc94b` did check these eight files' prose, applying
127 fact-check refutations (see "What the last three commits of cycle 2 actually did, recorded
late" under Cycle 3 below); cycle 3's Task 3 then examined 241 claims across all 131 of these
eight files' concepts (100% coverage) and refuted 9 — see "Cycle 3 Task 3: second adversarial
fact-check pass over 8 guide files" below. Both passes are real, committed, adversarial checks
of exactly the prose this sentence claimed was untouched.

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
  22 competency files and the teaching lens read roughly 65 of 537 concepts in full; ~~no
  Knowledge-check answer was verified against a source~~ — **superseded 2026-08-11 for the
  Knowledge-check half of this clause: false.** Commit `97cc94b` corrected 25 wrong
  knowledge-check answers, meaning some were checked against a source; that commit left no
  record of how many it examined in total, so the remainder are still unverified, but "no answer
  was verified" is not accurate. The other half of the same sentence still holds as written: 107
  of 130 comparison blocks were not
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
- ~~**`candidate_evidence` is empty on all 537 concepts, and no exam question count is stated
  anywhere in the guide or this document** — verified by direct query
  (`node` script over `data/topics/*.json` found zero concepts with a non-empty
  `candidate_evidence` array; a repository-wide grep for a stated question count found none).
  Both are by design, not oversight: no public post-2025 candidate evidence exists to record,
  and the Linux Foundation does not publish a question count for this exam.~~ **Superseded
  2026-08-11** on the question-count half of this claim: `candidate_evidence` remains empty on
  all 537 concepts (that part still holds), but the Linux Foundation does now publish a question
  count — see the "Question count: adopted" subsection below.

## Cycle 3

Cycle 3 turns the verified, guide-covered dataset into a question bank. Spec:
`docs/superpowers/specs/2026-08-11-lfca-question-bank-design.md`. Branch:
`cycle-3-question-bank`.

| Task | Description | Status |
| --- | --- | --- |
| 1 | Capture the exam facts | **complete** |
| 2 | Source what can be sourced among the 52 waived concepts | **complete** |
| 3 | Second adversarial pass over the eight singly-checked files | **complete** |
| 4 | Bring PROGRESS.md current | **complete** |
| 5 | The derived allocation | pending |
| 6 | A seeded PRNG for deterministic assembly | pending |
| 7 | Stem normalization and duplicate similarity | pending |
| 8 | The bank loader and the test fixtures | pending |
| 9 | Checks 1–6 and 11 — coverage and derivation | pending |
| 10 | Checks 7–10 and 12–14 — item integrity | pending |
| 11 | Checks 15–21 and the runner | pending |
| 12 | The two CLIs | pending |
| 13 | The exam and drill assembler | pending |
| 14 | Pilot — System Administration :: Disaster Recovery | pending |
| 15–35 | The remaining 21 competency files | pending |
| 36–57 | Verify all 22 competencies | pending |
| 58 | Build the exams and the drills | pending |
| 59 | Close the cycle in PROGRESS.md and the READMEs | pending |
| 60 | Final adversarial whole-branch review | pending |

### What the last three commits of cycle 2 actually did, recorded late

Cycle 2 ended with three commits that closed real work but were never written into this
document — a gap this task closes now, four commits and one cycle late:

- **`97cc94b`** — "fix: apply 51 review findings, 127 fact-check refutations and 25 wrong
  knowledge-check answers." 20 guide files changed, +1124/−1006. This is the commit that
  actually fact-checked the eight competency files the adversarial-fact-check section above
  once claimed were untouched by any pass (see the retraction above), and the commit that
  corrected the 25 wrong knowledge-check answers the coverage-gap bullet above once claimed
  none of had been verified (see that retraction too).
- **`c15e803`** — "fix: close five harness gaps and the remaining cycle 2 loose ends."
- **`3a0a7c2`** — "docs: record the cycle 2 execution ledger" (`.superpowers/sdd/progress-cycle2.md`).

None of this was recorded in `PROGRESS.md` until cycle 3 put it here. The consequential gap is
in `97cc94b`: its "127 fact-check refutations" **left no committed verdict artifact** — no
`docs/verification/factcheck-*.json` file or equivalent recording which 127 claims were checked,
which were refuted, or the reasoning behind either. That is exactly why cycle 3's Task 3 re-ran
the eight never-checked files from scratch rather than trusting the count: there was nothing on
disk to trust. Task 3's own verdicts, by contrast, are committed under `docs/verification/`
(`factcheck-*.json` for the eight files, plus the topup sweeps), so the same gap cannot recur for
this pass — but it remains open for the original 127, which have no artifact to recover.

### Question count: adopted (2026-08-11)

Every prior mention of question count in this document — stage 2's summary above, both
"Unresolved questions" entries, and the candidate-evidence note — recorded that no official
Linux Foundation source stated a question count, and treated the widely-circulated third-party
figure of "60" as unverified tier-3/4 noise not to be repeated. On 2026-08-11, a recapture of
the Multiple Choice Exams Important Instructions page (`lf-important-instructions-mc`), the same
page checked and found silent on this point in both cycle 1 (2026-08-09) and cycle 2, found it
now states, verbatim:

> The multiple-choice exam is delivered online and consists of 60* multiple-choice questions.
> \* CNPA exam consists of  85 multiple-choice questions.

The repository owner decided to adopt 60 as the LFCA question count. The reasoning: this is the
same page, and the identical generic-rule-plus-CNPA-exception structure, that
`research/exam-mechanics.md` already used to attribute the 90-minute duration to LFCA, and the
certification page's own "Multiple Choice Exam" label is the classification chain that file
already relied on for both the 90 minutes and the 75% pass mark. Accepting that chain for two
facts and rejecting it for a third was not defensible. The figure is recorded at HIGH confidence,
with the same classification-chain caveat `research/exam-mechanics.md` Section 4 already attaches
to the 75% figure: it rests on the chain rather than an LFCA-specific statement naming "60"
directly.

The previously-dismissed third-party figure of "60" turns out to match — worth recording plainly
for a project whose method is to prefer official sources over exactly that kind of figure.

Arithmetic consequence: 60 questions at 90 minutes is 90 seconds per question. 75% of 60 is 45
correct to pass. The repository owner's recorded score of 71% is therefore 42 or 43 correct out
of 60 — two to three questions short of the 45 needed.

See `research/exam-mechanics.md` Section 1, `data/sources.json`'s `lf-important-instructions-mc`
entry, and `docs/verification/exam-facts-2026-08-11/manifest.json` (fact `question_count`) for
the full account and verbatim capture.

### Cycle 3 pre-work: the waiver sourcing sprint

`data/sourcing-waivers.json` recorded 52 concepts with no primary-documentation citation
independent of the official-objectives source. Six agents (cluster A through F) were dispatched
in a single wave to examine 39 of them against a candidate corpus per cluster; the other 13 —
all `pm.project-management.*` — were not dispatched, because PMBOK genuinely is the only
authority the waiver names for them. Cluster C stalled for 600 seconds on its first attempt
(fetching the ~700-page NASA SE Handbook PDF) and was killed by the watchdog with zero concepts
examined and no output file; it was re-dispatched as C1 and C2 with smaller concept lists and
the pypdf local-extraction technique that cluster A had already found necessary. Both re-runs
completed. Full per-concept returns, including every failed URL and every reasoning trace, are
recorded in `docs/verification/waiver-sprint-2026-08-11.json` (built from
`.superpowers/sdd/waiver-cluster-{A,B,C1,C2,D,E,F}.json`).

**Computed from `data/sourcing-waivers.json`: 30 of the 52 cleared, 22 remain waived.**

The 30 un-waived concepts and the source that settled each:

| Concept | Source |
| --- | --- |
| `sysadmin.networking.vpn` | `nist-sp-800-77r1` |
| `pm.software-application-architecture.caching-in-applications` | `rfc9111-http-caching` |
| `sysadmin.networking.bandwidth-latency-and-throughput` | `rfc6349-tcp-throughput` |
| `pm.software-application-architecture.message-queue` | `oasis-amqp-core-v1.0` |
| `pm.functional-analysis.use-case` | `omg-uml-2-5-1-usecases` |
| `pm.functional-analysis.process-mapping` | `omg-bpmn-2-0-2-process` |
| `pm.software-application-architecture.three-tier-architecture` | `microsoft-three-tier-architecture-model` |
| `pm.functional-analysis.functional-requirements` | `nasa-se-handbook-sp-2016-6105` |
| `pm.functional-analysis.requirements-prioritization` | `agile-business-consortium-moscow` |
| `pm.functional-analysis.specification-documentation` | `nasa-se-handbook-sp-2016-6105` |
| `pm.functional-analysis.verification-vs-validation` | `nasa-se-handbook-sp-2016-6105` |
| `pm.functional-analysis.traceability` | `nasa-expanded-guidance-se-requirements-management` |
| `pm.functional-analysis.user-acceptance-testing` | `istqb-standard-glossary-v2.2` |
| `pm.project-management.work-breakdown-structure` | `nasa-wbs-handbook-sp-2016-3404-rev1` |
| `pm.project-management.change-control` | `nist-sp-800-128` (reused, already registered) |
| `sysadmin.best-practices.automation-and-idempotency` | `ansible-glossary-idempotency` |
| `pm.project-management.software-development-lifecycle` | `nist-sp-800-64-sdlc-phases` |
| `pm.project-management.risk-management` | `nist-sp-800-30r1` (reused, already registered) |
| `sysadmin.troubleshooting.structured-troubleshooting-method` | `google-sre-book-effective-troubleshooting` |
| `sysadmin.troubleshooting.narrowing-scope` | `google-sre-book-effective-troubleshooting` |
| `sysadmin.troubleshooting.reproducing-the-fault` | `google-sre-book-effective-troubleshooting` |
| `sysadmin.troubleshooting.escalation` | `google-sre-book-being-on-call` |
| `pm.project-management.user-story` | `agile-alliance-glossary-user-story-template` |
| `pm.project-management.minimum-viable-product` | `agile-alliance-glossary-mvp` |
| `pm.software-application-architecture.sql-basics` | `postgresql-sql-commands` |
| `pm.software-application-architecture.nosql-database` | `aws-what-is-nosql` |
| `pm.software-application-architecture.web-server-vs-application-server` | `nginx-beginners-guide` |
| `devops.git-concepts.pull-request` | `github-docs-about-pull-requests` |
| `devops.devops-basics.language-package-managers` | `maven-dependency-mechanism` |
| `sysadmin.disaster-recovery.snapshot` | `aws-ebs-snapshots` |

24 new source records were registered in `data/sources.json` (one shared by three concepts,
`nasa-se-handbook-sp-2016-6105`; another shared by three, `google-sre-book-effective-troubleshooting`).
Two proposed sources were **not** registered because the document was already in `data/sources.json`
under a different id: `nist-sp-800-128` and `nist-sp-800-30r1` were reused rather than duplicated
as `nist-sp-800-128-configuration-change-control` and `nist-sp-800-30r1-risk-assessment`.

**Nine concepts returned "no source found" and stay waived**, with what was tried:

- `pm.functional-analysis.gap-analysis` — NIST SP 800-50 Rev.1's glossary entry is scoped to
  training-program performance, not general project/business state; TOGAF 9.2's Chapter 23 is a
  strong textual match but pubs.opengroup.org now redirects to an SSO login wall, so it is not a
  live, freely citable source.
- `pm.functional-analysis.non-functional-requirements` — the NASA SE Handbook never uses the
  term and keeps performance/interface/operational/safety/"-ilities" as separate categories
  rather than unifying them the way the concept's description requires.
- `pm.functional-analysis.requirements-elicitation` — neither the NASA SE Handbook nor the REQB
  glossary states or implies the concept's central claim, that stated wants and actual needs
  differ.
- `pm.functional-analysis.feasibility-study` — NASA's SE Handbook frames feasibility as
  technical/cost/schedule, not technical/operational/economic as the concept requires; the UK
  Government's guide mentions all three dimensions but scattered across different study types
  rather than as one unified definition.
- `sysadmin.best-practices.service-ownership` — the Google SRE book covers team-level operational
  responsibility and "shared ownership," never a single named owner accountable for cost and
  lifecycle as the concept requires.
- `sysadmin.disaster-recovery.mttr-and-mtbf` — the SRE book defines MTTR but pairs it with MTTF
  (mean time to failure), never MTBF (mean time between failures); citing it for MTBF would
  misattribute a term it does not define.

**Two concepts were re-confirmed as waived, matching cycle 2's judgement** (re-running the same
evidence to the opposite conclusion would have been a failure of this task, not a success):

- `sysadmin.best-practices.naming-conventions` — SP 800-128's four mentions of "naming" are about
  CI-identification methodology, media labeling, and CPE product identifiers, none of them
  guidance on predictable host/user/resource naming for human inference.
- `sysadmin.best-practices.capacity-planning` — SP 800-128 mentions capacity planning exactly
  once, as a bare list item under media-library storage procedures, with no development of
  resource-growth projection.

`sysadmin.best-practices.principle-of-least-astonishment` was also confirmed unsourceable (a
targeted search found only NIST's unrelated least-privilege principle).

**13 `pm.project-management.*` concepts were never examined** — PMBOK is the only authority the
waiver names for them, and no agent was dispatched: `communication-plan`, `critical-path`,
`deliverable-and-milestone`, `gantt-chart`, `issue-tracking`, `project`,
`project-budget-and-resource-management`, `project-closure-and-lessons-learned`, `raci`,
`scope-creep`, `stakeholder`, `triple-constraint`, `waterfall`.

`data/sourcing-waivers.json` now carries a `question_policy` field: cycle 3 may author items on
the 22 still-waived concepts only where every consensus source agrees, marked `waived_source:
true`.

**Two findings carried forward rather than resolved here:**

- **This dataset's actual tier convention reserves tier 1 for Linux Foundation sources only.**
  Every existing NIST SP, every existing IETF RFC (28 of them, all tier 2), and the one existing
  ITU-T source are tier 2 — not tier 1 as the waiver-applier notes assumed for RFCs, and as
  several cluster agents proposed for NIST, OMG, OASIS, and NASA sources. All 24 new source
  records added by this task were registered at tier 2 to match the dataset's real, verified
  convention rather than the brief's category-based tier definitions or any cluster's proposal.
  No existing source's tier was changed. Whether tier 1 should be broadened beyond
  Linux-Foundation-only content is a dataset-wide decision for a later deliberate pass, not a
  side effect of this sprint.
- **`devops.devops-basics.language-package-managers` is now sourced from a Java-ecosystem
  document (Maven) for a concept the description states as language-agnostic** (npm, pip, Maven
  "and their equivalents"). Cluster F checked npm's and pip's first-party documentation and found
  neither made the application-vs-OS-package-manager contrast explicit; Maven's did. This is
  defensible as the strongest available citation, but a question author should not treat Maven's
  specific behavior as representative of npm or pip without independently checking it.
  **Corrected 2026-08-17 by the DevOps Basics verification pass (cycle 3, task 47): Maven's page
  did not make the contrast either.** "Introduction to the Dependency Mechanism" never mentions an
  operating system package manager, `apt`, `dnf`, or system-wide installation anywhere; its
  "System Dependencies" section is about `<scope>system</scope>` pointing at a jar on disk, which
  is a different sense of "system" entirely. The concept and both of its questions now cite the
  PyPA specification **Externally Managed Environments**
  (<https://packaging.python.org/en/latest/specifications/externally-managed-environments/>),
  which defines a "Python-specific package manager" against a "distro package manager ... capable
  of installing Python packages as well as non-Python packages" and exists precisely because the
  two conflict over the same files, plus npm's local-install page for the project-local half.
  `maven-dependency-mechanism` is retained on the concept for the manifest-and-transitive-
  resolution claim in the guide's **How it works**, which it does carry.

Gate results after applying: `npm run generate` (regenerated 6 views), `npm run validate` (537
concepts, 0 errors, 16 pre-existing warnings, no `stale-waiver`), `npm test` (188/188 passing),
`npm run check-guide` (537 concept definitions, 130 comparison blocks, 175 sections, 0 errors,
0 warnings).

### Cycle 3 Task 3: second adversarial fact-check pass over 8 guide files

The eight guide files that had previously received only one adversarial pass, with no verdict
record of it, were fact-checked a second time, plus a coverage top-up over concepts the first
pass never opened: `cloud/cloud-computing.md`, `cloud/networking.md`, `cloud/budgeting.md`,
`security/sensitive-data.md`, `security/compliance.md`, and the `topup-cloud` / `topup-security-
oss` sweeps recorded separately. **241 claims were examined across all 131 concepts of the eight
files (100% coverage), and 9 were refuted.**

**The 9 refutations are not 9 factual defects.** They split into three classes that each needed
a different fix, and reporting them as one undifferentiated count would have overstated what was
actually wrong, in the same direction cycle 1's silent default-to-reject once overstated it:

- **2 factual errors — prose changed.** Both were the same defect stated in two places: AWS's
  Spot Instance interruption mechanics (two-minute notice; terminate/stop/hibernate; a separate
  rebalance-recommendation signal) were stated in `cloud.budgeting.on-demand-reserved-and-spot-
  pricing` and again in the scenario/knowledge-check prose following `cloud.budgeting.free-tier-
  and-pricing-calculators` in the generic "the provider" voice, as if they applied to spot/
  preemptible pricing as a category. They do not: Azure Spot VMs and Google Cloud Spot/
  preemptible VMs both give roughly **30 seconds'** notice (Azure: "the Azure infrastructure will
  evict Azure Spot Virtual Machines with 30-seconds notice," delivered best-effort via Scheduled
  Events, Deallocate-or-Delete eviction, no hibernate; Google Cloud: "the shutdown period for a
  preemption notice is best effort and up to 30 seconds," via an ACPI G2 signal, no hibernate) —
  verified directly against each provider's own current documentation rather than copied from
  the verdict file. Both sites were corrected to attribute AWS's two minutes to AWS by name and
  state Azure's and Google Cloud's ~30 seconds with their own citations; two new sources were
  registered, `azure-spot-vms` and `google-cloud-spot-vms` (both tier 2). The `on-demand-
  reserved-and-spot-pricing` Traps paragraph, the free-tier scenario, and knowledge-check Q3 in
  `budgeting.md` all carried the same unattributed "two-minute" figure and were corrected too, so
  the file does not contradict its own two now-provider-specific concept blocks.
- **5 attribution defects — citation fixed, prose left alone.** In each case the guide's
  technical claim was true; only the citation supporting it was wrong or absent. Per the
  controller's explicit instruction, **none of these five prose passages were rewritten to match
  a weaker citation:**
  - `cloud.cloud-computing.serverless-and-faas` — the FaaS billing claim ("charges only for the
    duration of computation... accrues no cost when functions are inactive") is real CNCF
    wording, but on the CNCF **FaaS** glossary page, not the serverless page the concept
    declared. Registered `cncf-glossary-faas` (tier 1) and added it alongside the existing
    source.
  - `cloud.cloud-computing.container-vs-virtual-machine` — this concept's only non-objectives
    source, `cncf-glossary-virtualization`, never mentions containers. Registered
    `cncf-glossary-container` (tier 1) and added it.
  - `cloud.cloud-computing.hypervisor` — the cited VMware page lists VMware **Fusion**, not
    **Workstation**, among its type-2 examples. VMware Workstation is genuinely a type-2
    hypervisor (the same class of product as Fusion, on Windows/Linux rather than macOS) — **the
    guide's example was not replaced.** The prose was reworded to attribute the type-1 and type-2
    lists to what VMware's page actually names (ESX(i)/Hyper-V/Citrix/Xen/KVM; Fusion/Oracle VM/
    VirtualBox) and to frame Workstation as the equivalent product alongside Fusion rather than
    as something VMware's own page lists. No new source was needed.
  - `cloud.budgeting.capex-vs-opex` — was cited to `aws-rightsizing-whitepaper`, whose content is
    entirely about instance rightsizing and contains no CapEx/OpEx material. Verified AWS's
    "Six advantages of cloud computing" whitepaper page states the same substance under different
    terms ("Trade fixed expense for variable expense... pay only when you consume computing
    resources"); registered it as `aws-six-advantages-cloud-computing` (tier 2) and re-pointed
    the concept's sole source at it.
  - `cloud.budgeting.cost-monitoring` — the granularity claim ("providers expose cost and usage
    data at daily, sometimes hourly, granularity") is true of AWS Cost and Usage Reports, but was
    cited to the AWS Budgets page, which only discusses Budgets' own refresh cadence and
    notification lag. Verified AWS's Cost and Usage Reports guide states "you can customize the
    AWS Cost and Usage Reports to aggregate the information either by the hour, day, or month";
    registered it as `aws-cost-and-usage-reports` (tier 2) and added it alongside `aws-budgets`.
- **2 unverifiable claims — nothing in the guide or `data/` was changed.**
  - `security.compliance.pci-dss` (`compliance-019`): the guide cites PCI DSS Requirements
    3.3.1, 3.3.3, 3.5.1 and 11.3.2 by number. The PCI DSS v4.0/v4.0.1 standard text sits behind a
    licence-acceptance gate at `docs-prv.pcisecuritystandards.org`, which returned HTTP 403 to
    every fetch method tried, and no independent secondary source carried the specific
    requirement numbers either. The fact-check agent recorded this as `refuted` as a deliberate
    hard stop on unverifiability ("not because the numbers are known to be wrong... an
    unverifiable requirement-number citation must not be reported as confirmed"), and the
    controller's adjudication is explicit that this disposition must not be counted as a
    confirmed defect. **The requirement numbers may well be correct** — they rest on the
    original writer's sourcing and have never been checked against the standard itself. A
    question written on these four requirement numbers should be avoided, or written so it does
    not turn on the number, until someone with access to the standard verifies them.
  - `cloud.cloud-computing.virtual-machine` (topup-cloud-004): the concept claims a VM "can be
    snapshotted, cloned, resized and live-migrated to another host with little or no downtime,"
    cited to `vmware-hypervisor`. That page returned only a title with no retrievable body text
    on repeated fetch attempts, and follow-up VMware/Broadcom URLs 404'd. The underlying claim is
    unremarkable and well-established elsewhere (VMware vMotion, standard hypervisor
    capabilities), but it could not be confirmed against the *cited* source specifically, so it
    is recorded as unverified rather than disproven and rather than silently passed as confirmed.

**Coverage measured, not assumed — and the gap was hiding a real defect, not just unexamined
prose.** The first eight-agent pass over these files reached only 101 of 131 concepts (77%)
despite examining 206 claims — each agent honestly reported prioritising the highest-density
claims within its file rather than shirking, but the plan promised a second pass over the
*files*, not their densest claims. Two top-up agents closed the remaining 30 concepts. The
top-up justified itself immediately: it found the AWS-only spot-interruption defect a **second**
time, in `cloud.budgeting.free-tier-and-pricing-calculators` — a concept the original pass never
opened at all. If coverage had been left at 77%, that second instance (and the correction to the
Traps paragraph, scenario and knowledge-check text it required) would not exist. Also recorded
for completeness: `cloud-computing.md` has 23 concepts and the base pass produced records for 19
(4 unreached, closed by the top-up); `cloud/networking.md` — 28 claims across all 14 concepts, 0
refuted, but the agent stated it covered only the highest-risk cross-provider assertions and not
the provider name-map table's remaining rows, comparison-table restatements, or the scenario/
knowledge-check sections; `security/sensitive-data.md` — 34 claims, all 13 concepts, 0 refuted,
with the agent deliberately hunting for the project's known citation-mismatch failure class on
11 records (all confirmed) rather than merely not finding it; GDPR text there was read from
`gdpr-info.eu`, a verbatim mirror, rather than `eur-lex.europa.eu` as the brief asked — not worth
re-running, worth recording; `security/compliance.md` — 31 claims, 30 confirmed, 1 unverifiable
(above); the agent stated it did not separately check the Traps sections, knowledge-check
answers, or comparison tables.

**The systemic finding is now SEVEN confirmed instances across two cycles of a source cited for
content it does not contain** — a different, harder-to-check property than `npm run validate`'s
`unsourced-concept` check, which only proves a concept cites *some* tier-1/2 source, never that
the source contains the claim attributed to it:

| # | Concept | Cited | Actually contains |
| --- | --- | --- | --- |
| 1 | `security.incident-response` | NIST SP 800-61r3 | no PICERL six-step lifecycle |
| 2 | `cloud.multi-cloud` | NIST SP 800-145 | the term appears nowhere |
| 3 | `cloud.managed-services` | NIST SP 800-145 | the term appears nowhere |
| 4 | `cloud.serverless-and-faas` | `cncf-glossary-serverless` | claim is on the FaaS page |
| 5 | `cloud.container-vs-virtual-machine` | `cncf-glossary-virtualization` | never mentions containers |
| 6 | `cloud.budgeting.capex-vs-opex` | `aws-rightsizing-whitepaper` | no CapEx/OpEx material |
| 7 | `cloud.budgeting.cost-monitoring` | `aws-budgets` | no granularity content |

Four of the seven were found in this single pass over eight of the project's 22 competency
files, without anyone hunting for the class systematically. Extrapolating conservatively across
all 537 concepts and 306+ sources, this is the largest known unmeasured defect class in the
project. **Proposed as dedicated cycle 4 scope**, sized against all 537 concepts, rather than
continuing to close instances one at a time as they surface incidentally.

Five new sources were registered this task: `azure-spot-vms` (tier 2), `google-cloud-spot-vms`
(tier 2), `cncf-glossary-faas` (tier 1), `cncf-glossary-container` (tier 1), and
`aws-cost-and-usage-reports` (tier 2). The two new tier-1 CNCF sources match the existing
`cncf-glossary` / `cncf-charter` / `cncf-who-we-are` records rather than the tier-2
`cncf-glossary-serverless` / `cncf-glossary-virtualization` records those two concepts already
carried before this task — CNCF sits under the Linux Foundation, the certifying body, so CNCF's
own glossary is tier 1 in this dataset's convention (confirmed against `cncf-who-we-are`: "CNCF
is part of the nonprofit Linux Foundation"). That leaves those two pre-existing CNCF sources at
tier 2 as a known, pre-existing inconsistency this task did not attempt to fix. No existing
source's tier was changed. `data/sources.json` was grepped for every candidate URL before
registration to avoid duplicating a document already present under a different id (this project
has been bitten by that before); none of the five was a duplicate.

Gate results after applying: `npm run generate` (regenerated 6 views), `npm run validate` (537
concepts, 0 errors, 16 pre-existing warnings, unrelated to this task), `npm test` (188/188
passing), `npm run check-guide` (537 concept definitions, 130 comparison blocks, 175 sections, 0
errors, 0 warnings).

### `importance` is degenerate, and cycle 3 does not use it

Not recorded anywhere in this document before now — the only prior occurrence of the word is an
unrelated "degenerate id" note near line 201.

`tools/lib/importance.mjs` computes `importance` as
`round(clamp01((domainWeight - 10) / 20) * 3 + min(competencyRefs, 2))`, clamped to `1..5`. Every
call site (`tools/lib/checks.mjs`) passes `competencyRefs = 1`, a literal, not a per-concept
value — confirmed by grep: `competencyRefs` appears nowhere else in `tools/lib/*.mjs`. With that
term pinned uniform, `importance` is a pure function of `domainWeight` alone, so it is constant
within every domain. Verified directly from the dataset (`tools/lib/load.mjs`'s `loadDataset`,
run against `data/`):

| Domain | Weight | importance |
| --- | --- | --- |
| Linux Fundamentals | 16% | 2 |
| System Administration Fundamentals | 30% | 4 |
| Cloud Computing Fundamentals | 18% | 2 |
| Security Fundamentals | 14% | 2 |
| DevOps Fundamentals | 12% | 1 |
| IT Project Management Fundamentals | 10% | 1 |

(weights from `data/competencies.json`, current i.e. post-2025 values)

Distribution across all 537 concepts, recomputed the same way: **151 at 1, 213 at 2, 173 at 4,
none at 3 or 5.**

`importance` is a coarsened restatement of `domainWeight`: three domains at three different
weights (Cloud 18%, Linux 16%, Security 14%) all collapse to the same value, 2. A coarsened
restatement of a signal carries strictly less information than the signal itself.

**Consequence for cycle 3:** the question-count derivation (Task 5, "the derived allocation")
drives allocation from domain weight and `required_depth` only. Using `importance` alongside
domain weight would double-count the same weight signal a second time and add rounding noise on
top, since `importance` is `weight` after a lossy `round()`. The kickoff brief asked for both
signals to be used; this is the reasoning for why only one is used going forward.

`importance` retains one legitimate use in the codebase: `tools/lib/comparisons.mjs` line 31
sorts comparison-block ownership by `[hasVsInPath, importance, required_depth]` — there,
`importance` is a tie-break among candidate owners, not a signal being measured, so its
coarseness does not matter the way it would for allocation.

Cycle 4 should not resurrect `importance` as a driving signal without first changing how
`competencyRefs` is computed so it is no longer a constant.

### Task 36 verification: Disaster Recovery questions (2026-08-12)

Agent label `verify-disaster-recovery`, run against the 30-item file it did not author. 30 of 30
items carry a verdict. Seven were refuted on the first pass, rewritten, and re-verified;
each item's `verification` block records both `initial_verdict` and the final `verdict`.

Six of the seven refutations were **attribution failures, not factual errors** — the claim was
true and the citation did not contain it. That is now nine confirmed instances of this defect
class across three cycles, and it is the single most productive thing the verification pass looks
for.

- `backup.02` cited only `nist-sp-800-34r1` for a claim about what `rsync` and `tar` do. Fixed by
  citing `rsync-man` (delta-transfer algorithm, "sending only the differences") and
  `gnu-tar-manual`; both added to the `sysadmin.disaster-recovery.backup` concept, whose
  `commands` list already carried `tar` and `rsync` with no matching source.
- `snapshot.01` and `snapshot.02` cited `aws-ebs-snapshots` for the behaviour of *local* LVM
  snapshots. New source `man-lvcreate-8` added to `data/sources.json` and to the concept.
- `failover-and-failback.01` and `.02` cited `nist-sp-800-34r1`, which never uses the word
  failback. New source `aws-drs-failback` added to `data/sources.json` and to the concept.
- `disaster-recovery-plan.02`'s rationale asserted "The definition carries the word tested". None
  of the five CSRC glossary definitions of a disaster recovery plan contains that word. The
  obligation is real but lives in NIST SP 800-34r1's testing, training and exercises section;
  the rationale and the key's `why` were re-attributed there rather than rewritten.

The seventh was a genuine item defect: `redundancy-and-single-points-of-failure.01`'s third
distractor read "The power supplies, because they share the same building feed", importing a
premise the stem never gives and naming something that would be a real single point of failure if
granted — a second defensible answer. Rewritten to a claim the stem contradicts directly.

Guide `sources:` lines updated for the three concepts; `npm run generate` re-run; `check-guide`
0/0. `npm run validate` still 537 concepts / 0 errors / 16 warnings — the two new sources are
cited by concepts, so no new `orphan-source` warning.

One thing this pass got wrong and then corrected against the source: the hot-site item was first
recorded as unsourced, because NIST SP 800-34r1's section 3.4.3 summary describes a hot site only
as "configured with the necessary system hardware". The stem's "most recent backup already
loaded, requiring only updating with data since the last backup" is verbatim from the same
document's chapter 5. Reading one section of a source and concluding it does not contain a claim
is itself a way to manufacture a false refutation.

### Task 46 verification — Security Fundamentals :: Compliance (`verify-compliance`)

32 of 32 items carry a verdict. 20 confirmed as authored; 12 refuted, rewritten in place and
re-verified. The **PCI-requirement-number scan is clean**: a regex for `requirement|req\.?\s*\d+`
and for bare `\d+\.\d+\.\d+` over every stem, option, `why` and `rationale` returned 0 hits.

Nine of the twelve refutations were a source cited for content it does not contain, and each is
recorded with the search that establishes the absence:

- **"detective" appears zero times in NIST SP 800-53 Rev. 5** (492 pages), and zero times in
  SP 800-53A Rev. 5, SP 800-12 Rev. 1, SP 800-37 Rev. 2 and SP 800-171 Rev. 3; the CSRC glossary
  404s on `detective_control`, `preventive_control` and `corrective_control`. The
  preventive/detective/corrective taxonomy the guide teaches had no registered primary source at
  all. Re-anchored on **NIST SP 800-100** ("either preventive or detective in nature") and on
  SP 800-53 Rev. 5's **SI-7** ("Employ integrity verification tools to detect unauthorized
  changes"). `nist-sp-800-100` added to `data/sources.json` and to the concept.
- **Assessor sampling is not in SP 800-53 Rev. 5** — "sampling" occurs once, as CP-9(2) backup
  restoration. Re-anchored on **SP 800-53A Rev. 5** Appendix C's coverage attribute, which
  defines examination in terms of a representative sample of assessment objects.
  `nist-sp-800-53Ar5` added and cited from three concepts.
- **`aicpa-soc2` contains no Type 1 / Type 2 definitions**; every AICPA path tried resolves to
  the same landing page or a click-through gate. Recorded as unverified rather than disproven,
  and `audit.02` rewritten so it turns on the design-versus-operating-effectiveness distinction
  rather than on the report-type mapping. The guide now says so in place.
- **`aicpa-soc2` contains nothing about ISO 27001.** ISO's own page settles the certification
  claim — "ISO does not perform certification or issue certificates ... Certification is
  performed by external certification bodies". `iso-certification` added.
- **`gnu-gpl-faq` contains neither MIT nor Apache licence text.** `licensing-compliance.02`
  re-cited to `osi-mit-license` (new) and `apache-license-2` (already registered).
- **"Legal hold" appears in none of the cited sources** — zero in SP 800-88 Rev. 1, SP 800-53
  Rev. 5, SP 800-53A Rev. 5 and the Regulation, and no CSRC glossary entry. The substance is
  right and GDPR states it directly, so the citation moved rather than the content:
  **Article 17(3)(e)**, "for the establishment, exercise or defence of legal claims". Guide trap
  updated to cite the article.

Three refutations were substantive rather than bibliographic:

- The guide's claim that a standard is "the only tier that can be failed on evidence" is
  **contradicted** by SP 800-53A Rev. 5, whose AC-01 POLICY AND PROCEDURES carries its own
  assessment objectives. Guide and item both narrowed to the correct claim — the standard is the
  tier that supplies a *threshold*.
- `consent-and-lawful-basis.01` asked whether valid consent was given "Under GDPR Article 6".
  Article 6(1)(a) supplies only the basis; the validity bar is **Article 4(11)** and the
  pre-ticked-box rule is **Recital 32**. This came from a guide Quick reference cell that was
  true but misreadable — it opened on Article 6(1) and then stated the four conditions in the
  same breath. Second confirmed instance of that class after wave A's Article 4(1) finding; the
  cell now names which article does which job.
- `gdpr.02` set awareness at 09:00 Monday and asked what was due "by Wednesday at 09:00". 72
  hours from Monday 09:00 is **Thursday** 09:00. Stem fixed.

Two PCI items keyed on licence-gated requirement substance without naming a number, which passes
the ban as written and should not have. Both re-anchored on the Council's publicly readable
glossary — sensitive authentication data is data a transaction "might be transmitted or processed
(but not stored)", and the Acquirer entry supplies the acquiring-bank link — and the issuer
carve-out was removed rather than asserted. `pci-ssc-glossary` added. The guide's PCI section now
carries an explicit note that requirement numbers 3.3.1, 3.3.3, 3.5.1 and 11.3.2 remain
unverified and that no question may turn on one.

Zero second-correct-answer defects and zero duplicate options across all 32 items.

Gates: scoped `check-bank` (only `q-answer-position-balance` suppressed) 0 errors / 0 warnings;
`npm test` 307/307; `npm run validate` 537 concepts / 0 errors / 16 warnings — the five new
sources are cited from concepts, so no new `orphan-source` warning; `npm run generate` re-run and
`npm run check-guide` 0/0. Keys and distractors both 0% two-clause; key is the longest option in
11 of 32 items (34%), fixed by extending five distractors rather than shortening any key.

### Task 50 verification — DevOps Fundamentals :: Git Concepts (`verify-git-concepts`)

38 items over 22 concepts, all 38 carrying a verdict. **34 refuted and repaired, 4 confirmed as
filed.** No item was refuted on a wrong key and no double key was found; the failure mode was
almost entirely attribution.

**Fourteen items cited Pro Git 1.3 "What is Git?" as their only primary source.** That page
documents no command and no option anywhere, yet it was carrying `git init`, `git log`,
`git commit -a`, `git status`'s headings, bare `git diff`, commit-message conventions, and both
forking items. Eighteen sources were fetched, read and registered to repair it, each also added to
the citing concept's `additional_sources` so the orphan-source count did not move:
`progit-about-version-control`, `progit-recording-changes`, `git-init`, `git-commit`,
`git-status`, `git-log`, `git-diff`, `git-branch`, `git-checkout`, `git-switch`, `git-clone`,
`git-remote`, `git-fetch`, `git-tag`, `git-request-pull`, `git-submitting-patches`,
`github-docs-about-forks`, `github-docs-creating-a-pull-request`.

Three corrections landed outside the question file:

- **Guide, `fetch-vs-pull`.** "What it is" said pull integrates "by default a merge, or a rebase
  if configured or asked for", while "How it works" four lines below already said `--ff-only` is
  the default. git-pull(1) settles it: "`git pull --ff-only` will only do 'fast-forward' updates:
  it fails if your local branch has diverged from the remote branch. **This is the default.**"
  "What it is" and "What the exam may test" corrected. `data/`'s `description` ("pull fetches and
  immediately merges") was stale the same way and was corrected. Third confirmed instance of the
  true-but-misreadable-prose class, and the first where the block contradicted itself.
- **Guide, `rebase`.** "How it works" said "the documentation notes this has the same effect as
  `git reset --hard <upstream>`". Current git-rebase(1) says no such thing; its simplified
  description is check out the upstream "with the equivalent of `git checkout --detach
  <upstream>`", replay the commits one by one "similar to running `git cherry-pick <commit>` for
  each commit", then repoint the branch "with the equivalent of `git checkout -B <branch>`".
  Rewritten to that. `data/`'s `description` was already correct. `rebase.01`'s rationale and
  `o4`'s `why` carried the same dead quote and were rewritten.
- **`pull-request.02`'s citation had rotted.** The `github-docs-about-pull-requests` URL now
  redirects to GitHub's "Pull requests" hub, which never states that pushing further commits
  updates an open request. The leaf page "Creating a pull request" does, verbatim. Registered as
  `github-docs-creating-a-pull-request`.

`pull-request.01` keys on a pull request being "defined nowhere in git-scm.com's documentation".
Tested rather than assumed: gitglossary(7) was fetched and searched in full and contains **zero**
occurrences of the phrase, and `git-request-pull(1)` — the only git-scm.com command carrying those
words — merely "generates a summary of pending changes". That also closes factcheck finding
GC-031's concern about the flat "no Git command" wording.

Gates: scoped `check-bank` (only `q-answer-position-balance` suppressed, `q-verdict-coverage`
live) 0 errors / 0 warnings; `npm test` 307/307; `npm run generate` re-run and `npm run
check-guide` 537/130/175, 0 errors / 0 warnings; `npm run validate` 537 concepts / 0 errors /
**19 warnings** — none of the eighteen new sources is orphaned, and the three warnings above the
expected 16 are `gnu-gpl-2`, `gnu-gpl-3` and `osi-bsd-3-clause`, registered by the concurrent
Task 51 agent working on IT Project Management and not yet wired to a concept. No option text was
rewritten, so the shape scans are unchanged: em-dash trailing clause keys 39% / distractors 4%,
two-clause 0% / 0%, no six-token tail reused 3 or more times.

### Task 48 verification — IT Project Management :: Open Source Software and Licensing (`verify-oss-licensing`)

31 items over 22 concepts, all 31 with a verdict. 8 refuted-and-repaired on content, 23 confirmed
(9 of those only after their citations were replaced). **No wrong key, and no double key.** The
keys in this file were right almost without exception; the sourcing was not.

**The dominant defect was `spdx-license-list` standing in for licence text.**
`https://spdx.org/licenses/` is a table of identifiers with FSF and OSI flags and **no licence
text** — the string `endorse` does not appear on it, and it was the cited source for
BSD-3-Clause's non-endorsement clause. Eight items cited it this way. Repaired by registering and
reading the texts: `osi-bsd-3-clause`, `gnu-gpl-3`, `gnu-gpl-2`, `osi-lgpl-2-1` (LGPL-2.1 read at
the OSI because gnu.org's old-licenses pages would not respond), plus the existing
`osi-mit-license`, `apache-license-2`, `gnu-lgpl-3`, `gnu-agpl-3`. It was kept only for the `gpl`
concept, where the claim really is about `GPL-2.0-only` versus `GPL-2.0-or-later` identifiers.

**The defect lives in `data/`, and `data/` was fixed.** Each item's `source_ids` mirrored its
concept's `additional_sources`; `mit-and-bsd-licenses` cited an identifier table and the OSD for a
concept that is entirely about what two licence texts say. Sixteen concepts in
`data/topics/06-it-project-management.json` were rewired to the documents that carry their claims,
so no orphan sources were added and `npm run validate` is back to the expected **16 warnings**.

**`gnu-agpl-3`'s URL was wrong.** `agpl-3.0.html` serves ~8 KB of navigation and format links with
no licence text; `agpl-3.0.en.html` carries the text including section 13, "Remote Network
Interaction". URL corrected in `data/sources.json`.

**One factual error, repeated.** `gpl.02` placed GPLv3's express patent grant in **section 5** in
two separate `why` fields. Section 5 is "Conveying Modified Source Versions"; the patent grant is
**section 11**. The substantive claim held: `patent` occurs in the full GPLv2 text only in the
preamble and section 7's conflicting-obligations clause, with no grant and no termination clause.

**Six distractor `why` fields stated false facts**, the defect class that teaches a wrong lesson as
a correction. The two sharpest: `gpl.01` o2 said the kernel's syscall exception addresses driver
linking — the kernel licensing rules describe it as the UAPI boundary for software that "uses it
to communicate with the kernel", i.e. user space; and `governance-and-foundations.01` o2 plus
`contributor-license-agreement.01` o2 both denied that a foundation can have one CLA across its
projects, contradicted verbatim by the ASF: "An individual must have submitted a signed ICLA to
the ASF before we give them commit rights to any ASF project."

**The guide needed no content change.** Its GPLv3 section numbering is right where the questions'
was wrong, and both "compressed reference cell" instances of the true-but-misreadable class were
checked and are correct: line 407's "LGPLv3 section 4's relink conditions (LGPL-2.1 section 6)"
against both licence texts, and line 501's "Yes, section 3, terminating on patent litigation"
against Apache-2.0.

**Unresolved.** Guide line 489's claim that the FSF treats Apache-2.0 as GPLv2-incompatible over
the patent-termination provision is unverified: `gnu.org/licenses/license-list.html` and
`gnu.org/philosophy/categories.html` timed out repeatedly from this host across the whole task
while other gnu.org pages served normally. Nothing contradicts it; it was left alone, and no
question depends on it any more.

Gates: scoped `check-bank` (only `q-answer-position-balance` suppressed, `q-verdict-coverage`
live) 0 errors / 0 warnings; `npm test` 307/307; `npm run generate` re-run and `npm run
check-guide` 537/130/175, 0 errors / 0 warnings; `npm run validate` 537 concepts / 0 errors / 16
warnings. Shape scans unchanged by the rewrites: em-dash trailing clause keys 52% / distractors
6%, two-clause 0% / 0%, no six-token tail reused 3 or more times.


## Cycle 3, task 49b — verify Cloud Computing :: Cloud Computing, items 29–56

28 of 28 items in the range verified against fetched primary sources and rewritten where needed.
Full detail in `docs/verification/qbank-findings.md` under task 49b.

**Guide correction, confirmed and applied.** `study-guide/03-cloud-computing/cloud-computing.md`
attributed its type 1 and type 2 hypervisor example lists to VMware. That attribution is now
unverifiable: `https://www.vmware.com/topics/hypervisor` (source `vmware-hypervisor`) returns 200
but serves no body text to any HTTP fetch — it is a client-rendered shell whose only prose is its
meta description, and grepping the served bytes for "type 1", "type 2", "bare metal" and "hosted"
returns zero hits. The classifications themselves are correct and were kept; the attribution moved
to sources that can be read. Settled by <https://www.redhat.com/en/topics/virtualization/what-is-a-hypervisor>,
which names KVM, Microsoft Hyper-V and VMware vSphere as type 1 examples and VMware Workstation
and Oracle VirtualBox as type 2, and by <https://www.linux-kvm.org/page/Main_Page>, which
describes KVM as a loadable kernel module providing the core virtualization infrastructure.
`data/`'s concept description needed no change.

Nine sources were added to `data/sources.json` and wired into the owning concepts'
`additional_sources` in `data/topics/03-cloud-computing.json`: `redhat-what-is-a-hypervisor`,
`linux-kvm-main`, `aws-rds-welcome`, `aws-rds-maintenance`, `aws-s3-using-folders`, `gcs-objects`,
`aws-ebs-multi-attach`, `aws-efs-what-is`, `cncf-glossary-iac`.

Gates: scoped `check-bank` (only `q-answer-position-balance` suppressed, `q-verdict-coverage`
live) 0 errors / 0 warnings; `npm test` 307/307; `npm run generate` re-run and `npm run
check-guide` 537/130/175, 0 errors / 0 warnings; `npm run validate` 537 concepts / 0 errors / 16
warnings. Shape scans on the whole file are unchanged by the rewrites: em-dash trailing clause
keys 57% / distractors 40%, identical to the pre-task figures; within items 29–56 distractors sit
at 36%, above the 33% they started at.
