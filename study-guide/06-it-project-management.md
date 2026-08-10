# IT Project Management Fundamentals

This is the index for the domain carrying 10% of the exam — 6th largest of 6 domains — under
the current (2025-09-16) blueprint. Four competency files sit beneath it, holding 80 concepts:
[Project Management](06-it-project-management/project-management.md) (29),
[Software Application Architecture](06-it-project-management/software-application-architecture.md) (17),
[Functional Analysis](06-it-project-management/functional-analysis.md) (12), and
[Open Source Software and Licensing](06-it-project-management/open-source-software-and-licensing.md) (22).
Nothing is defined on this page. Every term lives in exactly one place in the files below, and
this index only tells you where that place is, in what order to visit it, and what the exam
blueprint and the LFS200 course do and do not do for you here.

## Weight: 8% to 10%, and what that buys

`data/competencies.json` records this domain at weight 10 with a previous weight of 8. Two
domains gained weight in the 2025 update and four lost it: System Administration Fundamentals
went 20 to 30, this domain went 8 to 10, and Linux (20 to 16), Cloud Computing (20 to 18),
Security (16 to 14) and DevOps (16 to 12) all fell. So this domain is simultaneously the
smallest on the paper and one of only two that grew — a 2-point rise on a 100-point scale, a
quarter more of the paper than it used to be worth.

For study effort the relevant number is not the weight but the ratio behind it. The guide's
537 concepts spread over 100 points of exam weight average 5.37 concepts per point. This
domain is 80 concepts over 10 points — 8.0 concepts per point, the highest of the six domains
(Linux Fundamentals is the lowest at 4.13, System Administration 5.77, DevOps 5.92, Cloud 4.56,
Security 4.64). Per mark available, this is the most reading in the guide.

Two conclusions follow, and they pull in opposite directions. If you are optimising marks per
hour, this is the last domain to study, not the first. But at 71% against a 75% pass mark you
are not optimising marks per hour — you are closing a 4-point gap, and this domain is worth 10
points, more than twice that gap. A candidate who has been treating it as the small one at the
end of the syllabus is exactly the candidate for whom it is cheapest to fix. The other reason
not to skip it: any practice material written against the pre-2025 blueprint weights this
domain at 8%, so a mock exam built from that material systematically under-samples it.

## What the 2025 update did to this domain

The domain itself was renamed. `data/competencies.json` records `renamed_from:
"Supporting Applications and Developers"`, and notes that this rename is the clearest single
contradiction of the Linux Foundation's published claim that the domains were unchanged.

Per competency, the status `npm run guide-plan` prints:

| Competency | 2025 status | Previous name | Rewording significance |
| --- | --- | --- | --- |
| Project Management | reworded | Software Project Management | substantive |
| Software Application Architecture | unchanged | Software Application Architecture | — |
| Functional Analysis | unchanged | Functional Analysis | — |
| Open Source Software and Licensing | reworded | Open-source Software and Licensing | formatting |

**No competency was added to this domain, and none was removed.** That matters because of what
it rules out. Elsewhere in this guide — System Administration's Best Practices and Disaster
Recovery, Cloud's Best Practices and Networking, Security's Compliance, Linux's Command Line —
an added competency has a hard consequence: no pre-2025 material covers it, because the
objective did not exist when that material was written, so a course, textbook or question bank
predating 2025-09-16 is not merely thin on it but silent. None of the four competencies here is
in that position. Each has a pre-2025 ancestor, so older material does map onto all four — but
it maps under the old names, which is why searching an old course index for "Supporting
Applications and Developers" and "Software Project Management" finds material that searching
for the current names does not.

The two reworded entries are not equivalent. `data/competencies.json` defines the significance
field as: `substantive` means the scope or emphasis plausibly changed; `formatting` means only
punctuation or whitespace differs between the two page renders, so pre-2025 material on that
competency remains valid. Open Source Software and Licensing is `formatting` — the change is
the hyphen in "Open-source". Project Management is `substantive`: dropping "Software" from
"Software Project Management" widens the objective from project management of software to
project management as such, so pre-2025 material on it is a starting point, not a syllabus.

## LFS200 coverage position

Coverage figures below are copied verbatim from each competency's `npm run guide-plan` header,
which reports which concepts LFS200 touches at all, not how deeply.

| Competency | LFS200 coverage |
| --- | --- |
| Project Management | 4 FULLY COVERED, 25 NOT COVERED — 4/29 (14%) are not NOT COVERED |
| Software Application Architecture | 15 NOT COVERED, 2 MENTIONED ONLY — 2/17 (12%) are not NOT COVERED |
| Functional Analysis | 12 NOT COVERED — 0/12 (0%) are not NOT COVERED |
| Open Source Software and Licensing | 1 FULLY COVERED, 15 NOT COVERED, 3 MENTIONED ONLY, 3 PARTIALLY COVERED — 7/22 (32%) are not NOT COVERED |

Those four figures sum to 13 of the domain's 80 concepts. `research/lfs200-notes/00-course-map.md`
places them precisely, and the placement is more interesting than the total:

- **Open Source Software and Licensing, at 32% (7/22), is the top row of the course map's
  per-competency coverage table** — the best-covered competency of the 22 on the exam, ahead of
  DevOps Basics at 28% and System Administration at 27%. This domain owns the course's single
  strongest competency-level coverage.
- **Functional Analysis, at 0% (0/12), has no lesson at all.** The course map lists six
  competencies in that position, four of which are competencies added in the 2025 update.
  Functional Analysis is one of the two that are not — Cloud Performance/Availability is the
  other — so its absence from LFS200 is not explained by the syllabus having moved. The course
  never covered it. Everything you know about it will come from this guide or from outside the
  course.
- Project Management sits at 14% (4/29) and Software Application Architecture at 12% (2/17),
  both against one lesson each.
- The domain's lessons are ch11.l2, ch11.l3 and ch11.l4, and the chapter containing them is
  still titled "Supporting Applications and Developers" — the retired domain name. The course
  map's Finding 1 uses exactly this chapter to establish that LFS200 has not been restructured
  for the current exam.
- The course map also records that `Scrum`, `Kanban`, `Gantt` and `MVP` occur zero times in the
  entire course text, despite the Project Management lesson having an Agile section. Those are
  measured absences over all 158,185 characters, the highest-confidence evidence in that file.

The percentages are a lower bound by construction — a concept can be taught without its name
appearing — so read them as "the course demonstrably names this" rather than as a ceiling on
what it teaches.

One more structural warning, from `data/sourcing-waivers.json` by way of the `Waived` line in
each brief: 40 of the domain's 80 concepts carry no primary documentation source, split 19 of
29 in Project Management, 12 of 12 in Functional Analysis, 9 of 17 in Software Application
Architecture, and 0 of 22 in Open Source Software and Licensing. Half this domain is written as
hedged consensus practice because the authoritative references are paywalled. The exam still
asks about it; the hedging is about provenance, not about whether it is examinable.

## Section map

### [Project Management](06-it-project-management/project-management.md) — 29 concepts, 7 comparison blocks

- [Fundamentals](06-it-project-management/project-management.md#s-project-management-fundamentals) — 5 concepts
- [Methodologies](06-it-project-management/project-management.md#s-project-management-methodologies) — 8 concepts
- [Requirements](06-it-project-management/project-management.md#s-project-management-requirements) — 4 concepts
- [Planning](06-it-project-management/project-management.md#s-project-management-planning) — 4 concepts
- [Control](06-it-project-management/project-management.md#s-project-management-control) — 8 concepts

### [Software Application Architecture](06-it-project-management/software-application-architecture.md) — 17 concepts, 4 comparison blocks

- [Patterns](06-it-project-management/software-application-architecture.md#s-software-application-architecture-patterns) — 4 concepts
- [Components](06-it-project-management/software-application-architecture.md#s-software-application-architecture-components) — 1 concept
- [Interfaces](06-it-project-management/software-application-architecture.md#s-software-application-architecture-interfaces) — 5 concepts
- [Data](06-it-project-management/software-application-architecture.md#s-software-application-architecture-data) — 5 concepts
- [Performance](06-it-project-management/software-application-architecture.md#s-software-application-architecture-performance) — 2 concepts

### [Functional Analysis](06-it-project-management/functional-analysis.md) — 12 concepts, 2 comparison blocks

- [Requirements](06-it-project-management/functional-analysis.md#s-functional-analysis-requirements) — 2 concepts
- [Analysis](06-it-project-management/functional-analysis.md#s-functional-analysis-analysis) — 6 concepts
- [Quality](06-it-project-management/functional-analysis.md#s-functional-analysis-quality) — 4 concepts

### [Open Source Software and Licensing](06-it-project-management/open-source-software-and-licensing.md) — 22 concepts, 5 comparison blocks

- [Fundamentals](06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-fundamentals) — 5 concepts
- [License families](06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-license-families) — 2 concepts
- [Specific licenses](06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-specific-licenses) — 6 concepts
- [Compliance](06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-compliance) — 5 concepts
- [Community](06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-community) — 4 concepts

Concept counts are definition sites — a topic block or a Quick reference row — not headings. A
section with one concept is not a short section: Components is one concept, and it owns a
comparison block whose heading names three terms — Web server vs application server vs Three-tier
architecture — though it compares two concepts, because that one concept's name bundles two
roles and the concept it is set against, three-tier architecture, is defined back in Patterns.

## Recommended study order

Read the four files in this order: **Project Management, Functional Analysis, Software
Application Architecture, Open Source Software and Licensing.**

1. **Project Management first**, because it is the only file the others reach into. It holds 29
   of the domain's 80 concepts and 7 of its 18 comparison blocks, and its Requirements section
   is where the domain's single intra-domain cross-file pointer originates — the user story
   concept points forward into Functional Analysis. No pointer runs the other way, so nothing
   in this file depends on having read anything else in the domain.
2. **Functional Analysis second**, because it receives that pointer. Its Analysis section owns
   the comparison the Project Management file defers to, so reading them back to back closes
   the loop while the first file is still in memory. It is also the smallest file (12 concepts)
   and the most fragile: 0% LFS200 coverage and 12 of 12 concepts waived, meaning nothing you
   have read in the course and no primary source will reinforce it. It is the file most likely
   to decay between now and the exam, so it wants a second pass later regardless of where you
   put the first.
3. **Software Application Architecture third.** It is fully self-contained — all four of its
   comparison blocks are internal, and no concept in it points into or out of another file — so
   it can be dropped anywhere in the order without breaking a dependency. Third is where it
   costs least: it breaks the run of heavily waived material (9 of 17 waived, against 19 of 29
   and 12 of 12 before it) before that register becomes tiring to read.
4. **Open Source Software and Licensing last**, for two reasons. It is the only file in the
   domain with a concept that is a member of a block owned outside the domain — forking, in the
   DevOps Git Concepts file — so it reads best after that DevOps material rather than before
   it. And it is the only fully sourced file here (0 of 22 waived, 32% LFS200 coverage), so the
   domain ends on licence text and the Open Source Definition rather than on hedged consensus.
   Nine of its 22 concepts are Quick reference rows, so it also moves faster per concept than
   its size suggests.

Within each file, read in file order. The sections are sequenced so that comparison blocks land
after both of their members are defined, and jumping to a later section first means meeting a
comparison table before one side of it exists.

## Comparison blocks

Eighteen comparison blocks are owned inside this domain. Each is the canonical place where the
distinction is drawn, and every concept named in a block links back to it from its own
definition site; these are the anchors those links resolve to.

| Comparison block | File and section |
| --- | --- |
| [Deliverable and milestone vs Triple constraint](06-it-project-management/project-management.md#cmp-pm.project-management.deliverable-and-milestone) | Project Management — Fundamentals |
| [Agile vs Waterfall](06-it-project-management/project-management.md#cmp-pm.project-management.agile) | Project Management — Methodologies |
| [Kanban vs Scrum](06-it-project-management/project-management.md#cmp-pm.project-management.kanban) | Project Management — Methodologies |
| [Acceptance criteria vs Definition of done](06-it-project-management/project-management.md#cmp-pm.project-management.acceptance-criteria) | Project Management — Requirements |
| [Work breakdown structure vs Gantt chart](06-it-project-management/project-management.md#cmp-pm.project-management.work-breakdown-structure) | Project Management — Planning |
| [Change control vs Scope creep](06-it-project-management/project-management.md#cmp-pm.project-management.change-control) | Project Management — Control |
| [Project closure and lessons learned vs Scrum ceremonies](06-it-project-management/project-management.md#cmp-pm.project-management.project-closure-and-lessons-learned) | Project Management — Control |
| [Microservices vs Monolithic architecture](06-it-project-management/software-application-architecture.md#cmp-pm.software-application-architecture.microservices) | Software Application Architecture — Patterns |
| [Web server vs application server vs Three-tier architecture](06-it-project-management/software-application-architecture.md#cmp-pm.software-application-architecture.web-server-vs-application-server) | Software Application Architecture — Components |
| [API vs REST](06-it-project-management/software-application-architecture.md#cmp-pm.software-application-architecture.api) | Software Application Architecture — Interfaces |
| [NoSQL database vs Relational database](06-it-project-management/software-application-architecture.md#cmp-pm.software-application-architecture.nosql-database) | Software Application Architecture — Data |
| [Functional requirements vs Non-functional requirements](06-it-project-management/functional-analysis.md#cmp-pm.functional-analysis.functional-requirements) | Functional Analysis — Requirements |
| [Use case vs User story](06-it-project-management/functional-analysis.md#cmp-pm.functional-analysis.use-case) | Functional Analysis — Analysis |
| [Open source software vs Proprietary software](06-it-project-management/open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.open-source-software) | Open Source Software and Licensing — Fundamentals |
| [Free software and FOSS vs Open source software](06-it-project-management/open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.free-software-and-foss) | Open Source Software and Licensing — Fundamentals |
| [Copyleft licenses vs Permissive licenses](06-it-project-management/open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.copyleft-licenses) | Open Source Software and Licensing — License families |
| [GPL vs AGPL vs LGPL](06-it-project-management/open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.gpl) | Open Source Software and Licensing — Specific licenses |
| [Apache License 2.0 vs MIT and BSD licenses](06-it-project-management/open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.apache-license-2-0) | Open Source Software and Licensing — Specific licenses |

One further block reaches into the domain from outside it:
[Clone vs fork](05-devops/git-concepts.md#cmp-devops.git-concepts.clone-vs-fork) is owned in the
DevOps Git Concepts file and pairs it with forking a project, in Open Source Software and
Licensing's Community section. That is the only comparison in this domain a candidate cannot
resolve without leaving it, and it is the reason the study order puts the licensing file after
DevOps rather than before.

Exactly one of the eighteen compares three concepts: GPL against AGPL and LGPL. It is the block
worth rehearsing last before the exam, because a two-way block is answerable by eliminating one
wrong option and a three-way block is not. Four others read as three-way from their headings
but are not — deliverable and milestone, web server versus application server, free software
and FOSS, and MIT and BSD licenses are each a single concept whose name bundles two terms, so
those blocks still have two sides. Knowing which is which decides how many options a question
can safely eliminate.
