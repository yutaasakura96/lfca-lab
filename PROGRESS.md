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
| Every concept cites a tier-1 or tier-2 source | PASS (537/537) |
| Every concept has an LFS200 `coverage_status` | PASS (537/537) |
| Every concept has a real `sept_2025_status` (none `unknown`) | PASS (537/537) |
| `tools/validate.mjs` exits clean | PASS (exit 0, 0 errors) |
| Full test suite passes | PASS (42/42) |
| All six views and the coverage matrix generate | PASS |
| Regeneration is idempotent (no diff on re-run) | PASS |

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

**Factual errors still in the data** — four of them the stage-5 corrections that the controller
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

**Upward guardrail — no drift toward LFCS, CKA or RHCSA.** Only 3.9% of concepts sit above
Application. Level 5 is deliberately restricted to six concepts where the specific
configuration syntax is itself examinable (`chmod` notation, sudoers/visudo, systemctl
start-vs-enable, crontab syntax, reading `ls -l` modes, SSH hardening). A 90-minute
multiple-choice exam with no practical component cannot test hands-on administration, and the
ratings reflect that.

**Downward guardrail — nothing important parked at recognition.** The first pass left six
concepts at level 1 despite sitting in the 30%-weighted System Administration domain. A floor
rule now raises anything with importance ≥ 4 to at least Understanding. Downward drift is zero.

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

**11 corrections were proposed. 3 were confirmed by adversarial review and applied. 8 were
recorded as rejected — but that number was, as first written, overstated.**

The correction is worth stating plainly, because the first version of this section took credit
the process had not earned. A controller bug (documented in the ledger) keyed verdicts off a
content hash rather than the agent label, so the pairing was lost and all 8 fell through to
"rejected" with `"no verdict recorded"` in `.superpowers/sdd/stage5-results.json`. Genuine
refutation reasoning exists for only three of them. The refuter did do real work — it caught a
proposed `/etc/shadow` rewrite that asserted "not readable by ordinary users" and then
contradicted itself in its own next clause — but "8 were refuted" implied eight reasoned
judgements when there were three.

The final whole-branch review re-checked the eight against primary sources and found **four
were genuine errors that had survived**. All four have now been fixed (see "Corrections from
the final review" below). The lesson recorded here for later cycles: an adversarial layer only
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

**Sourcing.** The registry grew from 11 to **274** sources: 19 tier 1, 252 tier 2 primary
documentation, 2 tier 3, 1 tier 4. **480 of 537 concepts** now cite at least one tier-1/2
primary document.

**Known shortfall — 57 concepts have no primary-documentation citation**, concentrated as:

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

One incidental corroboration worth recording: several third-party sources state the exam has
**60 questions**. This remains **unverified** — the Linux Foundation states no question count
anywhere, and these sources are tier 3/4 and demonstrably stale on other facts. It is recorded
here as an unverified figure, not adopted as the official value.

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
will still meet it. Cross-provider terminology was verified against current documentation
(Microsoft Learn, Google Cloud/AWS product pages) rather than assumed, in particular that Azure
Network Security Groups and Google Cloud VPC firewall rules are both stateful with no separate
stateless-ACL layer (unlike AWS's Security Group / NACL split), and that Google Cloud's route
model is defined at the network level rather than per-subnet like AWS's and Azure's route
tables. Only descriptions were changed for these 14; `commands`, `confused_with`,
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
