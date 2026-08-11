# Cycle 3 kickoff prompt

Paste the block below into a fresh session, started in this repository.

---

I want to build **cycle 3 of my LFCA study system: the question bank.**

Cycles 1 and 2 are complete and merged to `main`. Cycle 1 produced a verified research dataset;
cycle 2 turned it into a study guide with a harness that proves the prose covers the dataset.
Cycle 3 turns both into practice I can be tested by. Do not redo either — read what they produced
and build on it.

## Start by reading these, in this order

1. `PROGRESS.md` — what both cycles found, every correction made, and what is still unverified.
   Read this before anything else; it will save you re-deriving the project, and its closing
   sections name the gaps cycle 3 inherits.
2. `study-guide/README.md` and `study-guide/STYLE.md` — what the guide claims, what it explicitly
   does *not* claim, and the house style.
3. `research/exam-mechanics.md` — how the exam is delivered and scored.
4. `data/topics/*.json` — the 537 concepts every question must trace back to.
5. `docs/superpowers/specs/2026-08-10-lfca-study-guide-design.md` — cycle 2's design, for the
   conventions and the harness pattern cycle 3 should follow.

## About me

I sat the LFCA and scored **71% against a 75% pass mark**. I want **complete coverage, not
triage** — when I resit it I want to have mastered everything, not just my known weak spots. My
weakest areas were **networking (DNS, TCP/IP, ports)** and **containers (Docker, Kubernetes)**, so
those deserve extra care, but not at the expense of breadth.

Be concise in conversation. No emojis.

## What cycles 1 and 2 established (do not re-verify, but do respect)

- The current exam took effect **2025-09-16**. Weights: Linux Fundamentals 16%, System
  Administration 30%, Cloud Computing 18%, Security 14%, DevOps 12%, IT Project Management 10%.
- **90 minutes, multiple choice, 75% to pass, no practical component, valid 2 years.** The question
  count is **not published anywhere official** — do not invent one, and do not let a practice exam
  imply one.
- **Six competencies are new in 2025**, so no older material covers them. **LFS200 is still built
  on the retired syllabus** and six competencies have no lesson at all.
- Cycle 2 corrected the dataset where writing exposed it: two thin concepts enriched, all 14
  `cloud.networking.*` descriptions made vendor-neutral, and a batch of sourcing errors fixed
  (NIST SP 800-61r3 does not contain the six-step PICERL lifecycle; SP 800-145 defines neither
  multi-cloud nor managed services; a NIST hot site is defined by equipment, not data currency).

## The three inputs you are building from

**The dataset** — `data/topics/*.json`, 537 concepts across 22 competencies. Each carries
`description`, `required_depth` (1 Recognition … 5 Administration), derived `importance`,
`commands`, `confused_with` (concept ids), `coverage_status`, `confidence`, and `notes` that often
name the exam trap. Depth distribution: **L1 39, L2 156, L3 321, L4 15, L5 6**.

**The study guide** — `study-guide/`, 32 files and 288,457 words. Every one of the 537 concepts has
exactly one definition site, and every topic already carries a Traps section and a "what the exam
may test" section. **These are the raw material for questions** — a trap already identified is a
distractor already designed.

**The harness** — `npm run check-guide` (14 checks), `npm run guide-plan`, `npm run validate`
(18 checks), 188 tests. Cycle 3 should extend this pattern rather than invent a new one.

## What cycle 3 should produce

A question bank of **1,000+ questions**, static practice exams assembled from it, and a QC harness
that validates the bank the way `check-guide` validates the guide.

Per my original brief, QC must cover: **distribution against the domain weights**, **duplicate and
near-duplicate detection**, and **answer-position balance**.

Three things I care about:

- **Every question traces to a concept id.** That is what makes coverage provable, the same way
  cycle 2 proved prose coverage. A question that cannot name its concept does not belong.
- **`required_depth` and `importance` should drive question count and difficulty**, derived rather
  than assigned by feel — cycle 2 showed that anything hand-computed in this project drifts.
- **`confused_with` is the spine of the distractors.** There are **130 comparison blocks**, each
  already carrying the one axis that separates its members. A confusable pair is exactly the shape
  a multiple-choice question takes.

**Cycle 2 deliberately left this to you.** Its knowledge checks are open recall and discrimination
prompts, never multiple choice, specifically so cycle 3 owns item generation with a harness built
for it. Do not treat them as a seed bank without re-examining them — 25 of their answers were found
wrong and fixed late in cycle 2.

## Resolve these three before generating a single question

1. **Pin the exam facts to a fetched source.** Every question inherits duration, pass mark and
   weights, and they currently rest on cycle 1 browser work with **no capture artifact in the
   repository**. Re-fetch and record one.
2. **Decide what happens to the 52 waived concepts** in `data/sourcing-waivers.json`. Prose can
   hedge; a question cannot — it needs a defensible correct answer. They either get sources or get
   excluded from the bank, and that is a decision to make deliberately and record, not to discover
   halfway through.
3. **Re-check the eight files fact-checked only once**: the five Cloud competency files,
   `04-security/sensitive-data.md`, `04-security/compliance.md`, and
   `06-it-project-management/open-source-software-and-licensing.md`. That single pass produced
   **127 refutations**. A question built on a surviving error propagates it into my practice.

## Constraints

- Everything in `research/` and `coverage-matrix.md` is **generated** from `data/`. Never hand-edit
  them. The two exceptions say so at the top of the file.
- `npm test` (188), `npm run validate` (18 checks) and `npm run check-guide` (0 errors, 0 warnings)
  must all stay green.
- **No exam dumps.** `PROGRESS.md` carries a braindump exclusion list from cycle 1; keep excluding
  them and keep logging exclusions. The point of this project is that the underlying knowledge is
  taught well enough that exam wording is immaterial.
- LFS200 is copyrighted. No course prose has been reproduced in two cycles. Hold that line.
- Never state or imply a total question count for the real exam.

## Known gaps to respect rather than paper over

These are recorded honestly in `PROGRESS.md` and cycle 3 inherits them:

- **No Linux Foundation page was re-fetched in cycle 2.** The exam facts rest on cycle 1 browser
  work with no capture artifact. See pre-work item 1.
- **LFS200's text is not in the repository**, so every `coverage_status` value and every term count
  in the course map is taken on trust. Cycle 2 found the course map out of sync with `data/` once.
- **The 537-concept expansion is unvalidated against anything external.** The validator's six
  permanent `inferred-ratio` warnings say exactly that — the Linux Foundation publishes nothing
  below competency level, so all finer structure is inference.
- **No individual verdict among the 765 fact-check records in `docs/verification/` was re-derived**
  against its source.
- **`candidate_evidence` is empty on all 537 concepts**, truthfully — no public post-2025 candidate
  report exists. Do not fill it with speculation.
- The vendor-neutrality check is loose: one mention of "Azure" anywhere exempts a whole file, and
  only `03-cloud-computing/networking.md` actually carries the vendor mapping table.

## How I want you to work

Same process as cycles 1 and 2: **brainstorm the design first, write a spec, then an implementation
plan, then execute it with a fresh subagent per task and a review after each.** Parallel agents and
multi-agent workflows are authorised and that authorisation stands — cycle 2 used them heavily and
they worked, but **batch them at five or six at a time**: larger fan-outs repeatedly died on the
session usage limit, and one killed four agents mid-edit without reporting.

Keep the adversarial pressure on. In cycle 2 the per-task reviews caught real defects, and then a
*separate* adversarial fact-check found **45 command errors and 10 unsourced-authority claims those
reviews had passed**, and the final six-lens review found 2 Critical and 10 Important issues on top
of that — four of which were my own documentation claiming more than the evidence supported.

Two lessons from cycle 2 worth carrying:

- **A pass that did not run must never be reported as a pass that found nothing.** Cycle 1 lost the
  pairing between claims and verdicts and eight findings silently defaulted to "rejected".
- **Recompute every number; never recall one.** Stale and hand-computed figures were the single most
  common defect across both cycles, and they survived multiple reviews.

I would rather be told something is wrong than be handed something that reads well.
