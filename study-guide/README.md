# LFCA study guide

Complete coverage of this project's 537-concept expansion of the 22 official Linux Foundation
Certified IT Associate competencies as they stand after the 2025-09-16 update — the Linux
Foundation publishes competency names only, so the 537 concepts are this project's own inferred
breakdown, not the Linux Foundation's — each written to a depth the dataset assigned in
advance, each checked mechanically against that dataset for structural completeness. See "What
this guide does not claim" below for what that inference means and does not mean.

The reader this is written for has already sat the exam and come out under the line — close
enough that the gap is a handful of discriminations rather than a missing subject. So nothing
here is an overview. Every topic states what its term is *not*, because a multiple-choice exam
tests the boundary between plausible options, not recall of a definition sitting alone.

## What it is built from

The prose sits on top of a dataset built in an earlier cycle. That cycle took the Linux
Foundation's published objectives — which stop at the competency name — expanded the 22
competencies into 537 leaf concepts, attached primary documentation to all but 52 of them (RFCs,
NIST publications, kernel.org, GNU and systemd manuals, git-scm, kubernetes.io, the OCI specs,
the Scrum Guide, and AWS and Azure product documentation), assigned every concept a
depth rating and a derived importance, recorded which concepts LFS200 actually teaches, and
recorded the exam mechanics from official sources only.

Every number in this guide — a depth, an importance, an LFS200 coverage status, a source id,
a command string — is copied from that dataset, not from a writer's judgement at the keyboard.
Where the dataset is thin or unsourced, the guide says so in place rather than smoothing over
it. The writing rules the files follow are in [STYLE.md](STYLE.md).

## The exam

| Fact | Value |
| --- | --- |
| Current version in effect | 2025-09-16 |
| Duration | 90 minutes |
| Format | Multiple choice |
| Passing score | 75% |
| Practical component | None |
| Certification validity | 2 years |
| Number of questions | 60 (CNPA exam: 85) |

The last row was previously recorded as "Not published by the Linux Foundation." That was
correct as of two prior checks and is wrong now — see "What this guide does not claim" for the
retraction and the source.

The absence of a practical component is worth holding onto while you study. No amount of
hands-on fluency is tested directly; what is tested is whether you can pick the right term,
the right command, or the right ordering out of a list of near-neighbours. That is the skill
the depth ratings below are calibrated to.

## The six domains, in weight order

| Domain | Weight | Concepts | Competencies |
| --- | ---: | ---: | ---: |
| [System Administration Fundamentals](02-system-administration.md) | 30% | 173 | 5 |
| [Cloud Computing Fundamentals](03-cloud-computing.md) | 18% | 82 | 5 |
| [Linux Fundamentals](01-linux-fundamentals.md) | 16% | 66 | 2 |
| [Security Fundamentals](04-security.md) | 14% | 65 | 3 |
| [DevOps Fundamentals](05-devops.md) | 12% | 71 | 3 |
| [IT Project Management Fundamentals](06-it-project-management.md) | 10% | 80 | 4 |

Concept count deliberately does not track exam weight. Much of what a candidate would call
"Linux" — permissions, processes, the filesystem, packages, services — sits under System
Administration, because that is where the official competencies put it. Read the weight column
as the exam's allocation and the concept column as the size of the reading, and do not infer
one from the other.

All six weights changed in the 2025 update, and six competencies are new: Command Line;
System Administration :: Best Practices; Disaster Recovery; Cloud Computing :: Best Practices;
Cloud Computing :: Networking; and Compliance. No study material written before September 2025
covers those six, including the Linux Foundation's own LFS200 course, which is still built on
the retired syllabus and has no lesson at all for six of the 22 competencies. Each domain index
records its own competencies' LFS200 position concept by concept.

**Where to start.** If you scored in the low seventies, the fastest route back is not a second
pass over everything. Work System Administration first — it is 30% of the exam on its own, and
its Networking and System Administration competencies hold the largest concentration of
depth-3-and-above material in the corpus. Then take the six new competencies listed above in
any order, since a pre-2025 preparation could not have covered them and they are the most
likely source of unexplained losses. Then Cloud, Security, DevOps, and IT Project Management in
weight order. Within a file, the comparison blocks — the "Not to be confused with" sections —
are the highest-yield reading in the guide, because they are written in the exact shape a
multiple-choice question takes.

## How to read a depth rating

Every topic carries a metadata line naming its depth. The rating is the dataset's judgement of
how far this exam can go on that concept, not how hard the concept is in general, and it drives
how much the guide teaches:

| Depth | Treatment in this guide |
| --- | --- |
| 1 Recognition | One row in the section's Quick reference table: the term, one sentence, and why it is examinable. |
| 2 Understanding | A topic with What it is, Why it matters, How it works, and Key terms. |
| 3 Application | The above, plus a Commands table where the dataset records commands, plus Traps and What the exam may test. |
| 4 Troubleshooting | The above, plus Symptoms and diagnostic order — what you check first and what each outcome rules out. |
| 5 Administration | The above, plus Syntax worth memorising, because the specific syntax is itself examinable. |

Distribution across the corpus: 39 at Recognition, 156 at Understanding, 321 at Application,
15 at Troubleshooting, 6 at Administration. Only 3.9% sits above Application, and that ceiling
is deliberate — a 90-minute multiple-choice exam with no practical component cannot test
hands-on administration, so a guide that taught every concept to LFCS depth would be teaching
the wrong exam.

Use the rating to budget attention. A depth-1 concept is something you need to recognise when
it appears as a wrong answer; reading its row once is the whole job, and studying it further is
time taken from somewhere that pays. A depth-3 concept's Traps section is where the marks are.
The six depth-5 concepts are the only places in 537 where memorising exact syntax is worth it.

## How to verify the guide

The guide is hand-written and machine-checked. From the repository root:

| Command | What it proves |
| --- | --- |
| `npm run check-guide` | The prose covers the dataset — see below. |
| `npm run validate` | The dataset itself still satisfies its 18 integrity checks. |
| `npm test` | The tooling behind both still behaves as specified. |

`npm run check-guide` with no arguments runs over the whole corpus and must report 0 errors and
0 warnings. Among what it proves:

- **Every one of the 537 concepts has exactly one definition site.** Not zero — a concept
  silently dropped from the prose is an error. Not two — a concept taught in two places is also
  an error, so there is exactly one place to look for anything, and no second copy to drift.
- **Every confusable pair the dataset records is compared exactly once.** The 130 comparison
  blocks are derived from the dataset's `confused_with` graph, and ownership of each pair is
  decided by rule. A concept that is a member rather than the owner carries a link to the block
  instead of a second, competing comparison.
- **Every command string the dataset records appears verbatim in its concept's topic.** All 380
  of them, across 171 concepts. A match is exact: a command shown only as part of a longer
  command, or only in prose outside code formatting, does not count.

It also checks that each topic's stated depth, importance, and LFS200 coverage match the
dataset, that every cited source id exists, that every section with a definition has a scenario
and a knowledge check, that every cross-file link resolves, and that each of the 22 waived
concepts carries its waiver marker. `--scope "<Domain> :: <Competency>"` narrows a run to one
file while writing; the unscoped run is the one that counts.

## What this guide does not claim

**The finer structure is inferred, and the Linux Foundation did not publish it.** The
certification page stops at the competency name; there is no official objective text below that
level. Verified directly: the Domains & Competencies accordion yields no additional text when
fully expanded, and the program-changes page's promised per-domain outlines are not on the
page. So the 537 concepts, the sections that group them, and the depth ratings are all
inference from the competency name, primary documentation, and the exam's stated mechanics.
They are reasoned and they are recorded, but they are not the Linux Foundation's own breakdown,
and no reading of this guide should treat them as one.

**No post-2025 candidate evidence exists, and none is used here.** A search for candidate
reports on the current exam across general web search, community forums, and blogs found none.
The one substantive report that exists was published thirteen days before the update and
describes the retired exam — its own text lists the old weights and the old price. Braindump
sites were excluded on sight and never opened. The consequence is recorded in the dataset
itself: `candidate_evidence` is empty on all 537 concepts. Nothing in this guide rests on what
anyone reports having been asked, and nothing here should be read as a report of what appeared
on a real exam.

**22 concepts have no primary-documentation citation, and they are marked where they sit.**
The authoritative references for classical project management and business analysis — the PMBOK
Guide, the PMI Lexicon, ISO 21500/21502, BABOK, ISO/IEC/IEEE 12207 and 29148 — are paywalled,
and pmi.org and gao.gov refuse automated fetches. This was 52 before the cycle 3 waiver sourcing
sprint (`docs/verification/waiver-sprint-2026-08-11.json`) cleared 30 of them against
independent primary sources. The remainder is concentrated in IT Project Management (13 in
Project Management, 4 in Functional Analysis) and System Administration :: Best Practices (4),
with the remaining 1 in Disaster Recovery. Every one of them carries a
marker in place saying so, and its claims are hedged as consensus practice rather than stated as
citable fact. Read the difference between the two registers as real: a hedged claim is the
industry's common answer, not something a standards body has published.

**This guide previously claimed no question count appears anywhere in it, on the grounds that
the Linux Foundation published none.** That was checked against the certification page, the
Candidate Handbook, the multiple-choice exam FAQ and instructions, the free-resources page, and
the learning-path PDF, twice, a day apart, and was true both times. It is no longer true. On
2026-08-11 the Multiple Choice Exams Important Instructions page was recaptured and now states:
"The multiple-choice exam is delivered online and consists of 60* multiple-choice questions. \*
CNPA exam consists of  85 multiple-choice questions." The repository owner has adopted 60 as the
LFCA question count at HIGH confidence — see `research/exam-mechanics.md` Section 1 for the full
reasoning, including the classification-chain caveat this figure shares with the 75% passing
score. The third-party figure this guide previously dismissed as unverified was also 60; it
turns out to match. At 90 minutes for 60 questions, budget roughly 90 seconds per question; at
75% to pass, that is 45 of 60 correct.

**`npm run check-guide`'s green result is structural and referential only, and proves nothing
about whether any sentence in this guide is true.** No check reads a byte of prose between the
markers — it confirms that a definition site exists once, that a comparison block's membership
matches the dataset, that a required command string appears verbatim, that depth, importance
and LFS200 coverage tags match `data/`, and that links resolve. None of that is a check on
content: a topic could state the wrong fact about the right concept and every one of these
checks would still pass. The one adversarial fact-check layer that did read prose against
primary sources covered two claim classes only — command strings and waived-concept hedging —
in the 14 competency files that carry either. The other eight competency files
(`cloud-computing.md`, `performance-availability.md`, `budgeting.md`, `best-practices.md` and
`networking.md` under Cloud Computing, `sensitive-data.md` and `compliance.md` under Security,
`open-source-software-and-licensing.md` under IT Project Management), all six domain indexes,
and both appendices carry no claim checked against a primary source by that layer.
