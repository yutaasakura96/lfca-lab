# LFS200 course map and coverage analysis

Hand-written. Not generated — do not overwrite with `npm run generate`.

Captured 2026-08-10 from the authenticated LFS200 training portal, using the repository
owner's own enrolment. No access control was bypassed; the owner signed in personally and the
course structure and text were read through the portal's own course endpoint.

This file records **structure, coverage and gaps**. It deliberately does not reproduce course
prose. Where a specific term matters as evidence, only the term and its occurrence count are
recorded.

---

## Method, and what it can and cannot prove

Three passes:

1. **Structural.** The full section/lesson tree and the text length of every lesson. This is
   exact.
2. **Term occurrence.** Exact-string counts for a curated list of distinctive technical terms
   (commands, paths, protocol and framework names) across the whole course.
3. **Concept matching.** Each of the 537 taxonomy concepts tested against the course text, then
   cross-checked so a match only counts when the term appears in a lesson that actually teaches
   that concept's competency.

**Confidence is not uniform, and the distinction matters:**

- **HIGH — the structural findings.** Which lessons exist, how long they are, and which
  competencies have no lesson at all. These are counts, not judgements.
- **HIGH — measured absence.** A term with zero occurrences across 158,000 characters is
  genuinely absent. Absence is the strongest signal automated matching produces.
- **MEDIUM/LOWER BOUND — the per-concept coverage percentages.** A concept can be taught
  without its name appearing, so the percentages below **understate** true coverage. Treat them
  as a floor, not a measurement. The cross-check in pass 3 removes false positives at the cost
  of admitting false negatives — the safer direction for a study resource, since it errs toward
  telling you to study something rather than away from it.

---

## Structure

12 sections, 47 lessons, **158,185 characters** of instructional text. Ten lessons are
quiz-only "Knowledge Check" pages with no text.

| Ref | Section :: Lesson | Chars |
| --- | --- | ---: |
| ch1.l1 | Course Introduction :: Course Information | 5,680 |
| ch1.l2 | Course Introduction :: The Linux Foundation | 690 |
| ch2.l2 | What is Linux? :: The Operating System | 2,428 |
| ch2.l3 | What is Linux? :: Linux as an Operating System | 1,341 |
| ch2.l4 | What is Linux? :: Hardware and Software | 3,877 |
| ch3.l2 | User Interfaces :: User Interface Types | 3,428 |
| ch4.l2 | Installing Linux :: Linux Installation | 5,140 |
| **ch4.l3** | **Installing Linux :: Backup** | **1** |
| ch5.l2 | Linux Filesystems and File Management :: Filesystems | 4,820 |
| ch5.l3 | Linux Filesystems and File Management :: Storage Management and Configuration | 7,801 |
| ch5.l4 | Linux Filesystems and File Management :: Directories and Files | 4,363 |
| ch5.l5 | Linux Filesystems and File Management :: Contents and Finding Files | 3,797 |
| ch6.l2 | User and System Administration Commands :: Linux Commands | 24,959 |
| ch7.l2 | Networking and Network Troubleshooting :: Network Configuration | 4,005 |
| ch7.l3 | Networking and Network Troubleshooting :: Network Troubleshooting | 14,657 |
| ch8.l2 | Software and Cloud Computing :: Cloud Computing Basics | 6,242 |
| ch9.l2 | Security Fundamentals :: Securing Linux | 12,484 |
| ch9.l3 | Security Fundamentals :: Network Security | 5,809 |
| ch10.l2 | DevOps Fundamentals :: DevOps Basics | 6,115 |
| ch10.l3 | DevOps Fundamentals :: Containers | 3,926 |
| ch10.l4 | DevOps Fundamentals :: Deployment Environments | 2,397 |
| ch10.l5 | DevOps Fundamentals :: Git Concepts | 8,727 |
| ch11.l2 | Supporting Applications and Developers :: Software Project Management | 6,986 |
| ch11.l3 | Supporting Applications and Developers :: Software Application Architecture | 3,790 |
| ch11.l4 | Supporting Applications and Developers :: Open Source Software and Licensing | 6,526 |

**The `Backup` lesson contains one character.** It is, in practice, empty.

---

## Finding 1: the course is still built on the pre-September-2025 syllabus

The chapter and lesson names are the *old* domain and competency names, not the current ones:

| LFS200 name | Status in the current exam |
| --- | --- |
| Chapter "Supporting Applications and Developers" | Domain **renamed** to "IT Project Management Fundamentals" |
| Lesson "Software Project Management" | Competency **renamed** to "Project Management" |
| Lesson "Deployment Environments" | Competency **removed** |
| Lesson "Network Security" | Competency **removed** |

The course has not been restructured for the 2025-09-16 exam update. Its shape maps onto the
syllabus that was retired.

## Finding 2: six competencies have no lesson at all

| Competency | Concepts | New in 2025? |
| --- | ---: | --- |
| System Administration :: Best Practices | 20 | **yes** |
| Cloud Computing :: Performance/Availability | 17 | no |
| Cloud Computing :: Best Practices | 15 | **yes** |
| Cloud Computing :: Networking | 14 | **yes** |
| Security :: Compliance | 14 | **yes** |
| IT Project Management :: Functional Analysis | 12 | no |

Four of the six are competencies **added in the 2025 update**. A fifth, Disaster Recovery, has
a lesson in name only — the one-character `Backup` page.

Cloud Computing is **18% of the exam** and has **one** lesson of 6,242 characters, about 4% of
the course text. Three of its five competencies have no lesson whatsoever.

## Finding 3: measured absences

Each of the following was checked as an exact string across all 158,185 characters and occurs
**zero times**. This is the highest-confidence evidence in this file.

**Disaster recovery — the entire subject area is absent:**
`disaster recovery` · `business continuity` · `failover` · `redundancy` · `high availability` ·
`replication` · `RTO` · `RAID`

**Compliance — absent:**
`GDPR` · `HIPAA` · `ISO 27001` · `SOC 2`

**Cloud — absent despite an 18% weighting:**
`serverless` · `elasticity` · `scalability` · `load balancer` · `CDN` · `VPC` · `region` ·
`availability zone`

**Containers and orchestration — absent from a chapter that has a Containers lesson:**
`Docker` · `pod` · `registry` · `orchestration` · `container image`

**Project management frameworks — absent despite an Agile section:**
`Scrum` · `Kanban` · `Gantt` · `MVP`

**Everyday Linux administration — absent:**
`cron` · `crontab` · `journalctl` · `umask` · `SUID` · `SGID` · `sticky bit` · `ufw` ·
`/etc/fstab` · `/etc/hosts` · `/var/log` · `nslookup` · `ifconfig` · `LVM` · `SELinux` · `LUKS`

**Security — absent:**
`authorization` · `multi-factor` · `TLS` · `VPN`

Note the last one carefully: the course discusses `SSL` (7 occurrences) but never `TLS`, the
term that replaced it and that current documentation and exams use.

## Finding 4: what the course does cover well

Concentrated in four lessons that together are over half the course text:

- **ch6.l2 Linux Commands (24,959 chars)** — by a wide margin the largest lesson. `systemctl`
  (22 occurrences), general and administrative command families, `sudo`, `man`.
- **ch7.l3 Network Troubleshooting (14,657)** — `DHCP` (71), ports (50), `ping` (17), a
  structured verify-the-adapter → verify-config → verify-connections → verify-services →
  check-firewall progression. This is the course's strongest material.
- **ch9.l2 Securing Linux (12,484)** — `/etc/passwd` (11), `/etc/shadow` (7), permissions,
  least privilege, encrypted filesystems, `gpg`.
- **ch10.l5 Git Concepts (8,727)** — branches (20), commits (9), merges (6), repositories (20).

Also solid: storage and partitioning (ch5.l3, `partition` 58 occurrences), open source
licensing (ch11.l4), and the CI/CD distinctions in ch10.l2 (`continuous integration`,
`continuous delivery` and `continuous deployment` each appear as separate headings).

---

## Per-competency coverage (lower bound)

Percentages are a floor, for the reasons given under Method.

| Coverage | Concepts | Lessons | Competency |
| ---: | ---: | ---: | --- |
| 32% | 7/22 | 2 | IT Project Management :: Open Source Software and Licensing |
| 28% | 7/25 | 2 | DevOps :: DevOps Basics |
| 27% | 19/71 | 5 | System Administration :: System Administration |
| 23% | 5/22 | 1 | DevOps :: Git Concepts |
| 18% | 9/49 | 2 | System Administration :: Networking |
| 15% | 4/27 | 4 | Linux :: Linux Operating System |
| 14% | 4/29 | 1 | IT Project Management :: Project Management |
| 13% | 3/23 | 1 | Cloud Computing :: Cloud Computing |
| 12% | 2/17 | 1 | IT Project Management :: Software Application Architecture |
| 8% | 3/39 | 3 | Linux :: Command Line **[new 2025]** |
| 8% | 3/38 | 2 | Security :: Security |
| 4% | 1/24 | 1 | DevOps :: Containers |
| 0% | 0/20 | 0 | System Administration :: Best Practices **[new 2025]** |
| 0% | 0/15 | 1 | System Administration :: Troubleshooting |
| 0% | 0/18 | 1 | System Administration :: Disaster Recovery **[new 2025]** |
| 0% | 0/17 | 0 | Cloud Computing :: Performance/Availability |
| 0% | 0/13 | 1 | Cloud Computing :: Budgeting |
| 0% | 0/15 | 0 | Cloud Computing :: Best Practices **[new 2025]** |
| 0% | 0/14 | 0 | Cloud Computing :: Networking **[new 2025]** |
| 0% | 0/13 | 1 | Security :: Sensitive Data |
| 0% | 0/14 | 0 | Security :: Compliance **[new 2025]** |
| 0% | 0/12 | 0 | IT Project Management :: Functional Analysis |

Troubleshooting shows 0% only because its concepts are method-level ("narrowing scope",
"change correlation") and the course teaches the method procedurally without naming it. This is
the clearest example of the lower-bound caveat: ch7.l3 genuinely teaches troubleshooting well.

---

## What this means for study

1. **Completing LFS200 is not sufficient**, and the gap is structural rather than a matter of
   depth. Six competencies have no lesson, and four of those six are new in 2025.
2. **The highest-risk areas are Disaster Recovery, Compliance, Cloud Performance/Availability,
   Cloud Networking, and both Best Practices competencies.** Together these are 93 concepts, and
   the course addresses essentially none of them.
3. **Cloud is the worst weight-to-coverage ratio on the exam:** 18% of marks, one lesson.
4. **Containers need outside study.** The course's Containers lesson never mentions Docker,
   images, registries, or orchestration.
5. Where the course is strong — commands, network troubleshooting, Linux security, Git — it is
   genuinely strong, and re-reading those four lessons is time well spent.
