# The question bank

1,150 multiple-choice items covering all 537 concepts in `data/`, built by cycle 3. Spec:
`docs/superpowers/specs/2026-08-11-lfca-question-bank-design.md`.

```
questions/NN-<domain>/<competency>.json   source, hand-maintained — 22 files
exams/                                    generated — 16 papers, 16 answer keys, index.json
drills/                                   generated — 22 by competency, 6 by domain, weak-areas
```

`exams/` and `drills/` are rebuilt by `npm run build-exams` and must never be edited by hand.
Every file there carries a generated-file notice at the top.

## What is in it

| | |
| --- | --- |
| Items | **1,150** — 1,000 exam pool + 150 supplement |
| Concepts covered | **537 of 537** |
| Comparison blocks named | **131 of 131** |
| Registered sources | 668 |

By domain, following the exam's own weight table — System Administration 391, Cloud Computing
201, Linux Fundamentals 160, DevOps 158, Security 140, IT Project Management 100.

By type — application 527, recall 297, discrimination 212, diagnostic 71, command 43.

Distractors by provenance — sibling concept 2,161, misconception 907, confusable 339, command
variant 43. Every distractor is traceable to one of those four sources rather than invented.

## How the allocation is derived

Nobody chose "how many questions should Networking get". The per-concept count is computed from
the concept's `required_depth` and its domain's exam weight, and `npm run check-bank` fails if
any concept's item count disagrees with that derivation. The same is true of the exams: 16
papers × 60 questions consumes 960 of the 1,000-item pool, so **40 items appear on no paper by
construction**. They are listed by id in `exams/index.json` rather than left as a silent
residue.

## What `check-bank` proves, and what it does not

```bash
npm run check-bank        # the run that counts — unscoped, unsuppressed
```

It is structural and referential, exactly as `check-guide` is. It proves every concept has its
derived number of items, that every comparison block and every dataset command string is covered
by some item, that every distractor is traceable to a declared provenance, that keys are evenly
distributed across answer positions, and that **every item carries an adversarial verdict from a
named agent**.

**It does not prove that any item's key is correct.** No harness can. That is what cycle 3's
verification layer did, item by item, and its evidence is the `verification` field on each item —
the agent label, the verdict, which options were checked, the reasoning, and the URLs actually
fetched — not a claim in this file. If you want to know why an answer is what it is, read that
field on the item, not this README.

## Taking a practice exam

Open `exams/exam-01.md`, sit it under the clock, then check `exams/exam-01-answers.md`. The
answer key gives the correct option, why each distractor is wrong, and a link into the study
guide for the concept.

**60 questions, 90 minutes, 45 correct out of 60 to pass** — 90 seconds a question. Those are the
real exam's figures, captured with their sources at
`docs/verification/exam-facts-2026-08-11/`.

Questions are dealt across all six domains through each paper rather than blocked by subject, so
a paper reads the way the exam does.

## What this bank does not claim

**No question here came from a real exam, and none is a report of one.** Every item is written
from the concept and its primary documentation. Braindump sites were excluded on sight and never
opened. `candidate_evidence` is empty on all 537 concepts, and nothing in the bank rests on what
anyone reports having been asked.

**The item counts are not the Linux Foundation's.** They are derived from depth and domain
weight, as above. The exam's own question count, duration and pass mark are sourced; how many
questions a *concept* deserves is this project's inference.

**13 concepts have no primary-documentation citation** and are waived by name in
`data/sourcing-waivers.json`; the 14 items over those concepts carry a `waived_source` marker.
Where a claim could not be sourced at all, the item's `verification.reasoning` says so in its own
words rather than citing something that does not support it.
