# Progress — LFCA Research Foundation

Cycle 1 of 4. Spec: `docs/superpowers/specs/2026-08-09-lfca-research-foundation-design.md`

## Stage status

| Stage | Description | Status |
| --- | --- | --- |
| 1 | Official objectives capture | **complete** |
| 2 | Exam mechanics | **complete** |
| 3 | Taxonomy expansion | **complete** |
| 4 | LFS200 crawl | **complete** |
| 5 | Per-concept documentation research | not started |
| 6 | Candidate experience research | **complete (negative result)** |
| 7 | Depth assignment | not started |
| 8 | View generation | not started |

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

- Stages 5 through 8.

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

22 competencies: 8 unchanged, 8 reworded, 6 added. Six removed outright.

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

Thirteen checks now. 33 tests passing.

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
