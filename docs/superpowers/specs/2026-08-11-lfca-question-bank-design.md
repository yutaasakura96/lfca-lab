# LFCA Question Bank — Design

**Date:** 2026-08-11
**Status:** Approved (design)
**Cycle:** 3 of 4
**Branch:** `cycle-3-question-bank`
**Predecessors:**
`docs/superpowers/specs/2026-08-09-lfca-research-foundation-design.md` (cycle 1),
`docs/superpowers/specs/2026-08-10-lfca-study-guide-design.md` (cycle 2)

---

## Context

Cycle 1 produced a verified dataset: 537 leaf concepts across the 22 official competencies, each
carrying a description, `required_depth`, a derived `importance`, `commands`, a `confused_with`
graph, an LFS200 `coverage_status`, sources, and `notes` that frequently name the exam trap. It is
guarded by 18 validation checks. Cycle 2 turned that dataset into a 32-file, 288,457-word study
guide, and built `check-guide` — 14 checks that prove, mechanically, that the prose covers the
dataset.

Cycle 3 turns both into practice. It does not redo either. It reads what they produced and builds
on top.

**The reader.** The repository owner sat the LFCA and scored 71% against a 75% pass mark. The
stated need is complete coverage rather than triage: every concept examinable, not only the known
weak spots. Networking (DNS, TCP/IP, ports) and containers (Docker, Kubernetes) get extra depth,
explicitly not at the expense of breadth.

**Baseline measured at the start of this cycle, not recalled.** `npm test` 188/188.
`npm run validate` — 537 concepts, 0 errors, 16 warnings (the 10 `orphan-source` and 6
`inferred-ratio` warnings carried since cycle 1). `npm run check-guide` — 537 concept
definitions, 130 comparison blocks, 175 sections, 0 errors, 0 warnings. Study guide: 32 files,
288,457 words.

**Facts inherited and not re-derived, except where P1 below re-fetches them.** Current exam
effective 2025-09-16. Weights: Linux Fundamentals 16%, System Administration 30%, Cloud Computing
18%, Security 14%, DevOps 12%, IT Project Management 10%. 90 minutes, multiple choice, 75% to
pass, no practical component, valid 2 years. **The exam is 60 questions** — see the amendment
below; this reverses what cycles 1 and 2 recorded and what the kickoff brief for this cycle
instructed. Six competencies are new in 2025. LFS200 is still built on the retired syllabus and
six competencies have no lesson at all.

---

## Amendment, 2026-08-11: the exam is 60 questions

This spec was approved on the understanding that the Linux Foundation publishes no question
count. **Pre-work item P1 found that it does.** The Multiple Choice Exams Important Instructions
page (`lf-important-instructions-mc`) states, verbatim:

> The multiple-choice exam is delivered online and consists of 60* multiple-choice questions.
> \* CNPA exam consists of  85 multiple-choice questions.

Captured to `docs/verification/exam-facts-2026-08-11/`, and independently re-fetched before the
decision was taken. It is the same page, and the identical generic-rule-plus-CNPA-exception
structure, that `research/exam-mechanics.md` already uses to attribute the 90-minute duration to
the LFCA; the certification page's own "Multiple Choice Exam" label is the classification chain
that section already relies on for both the 90 minutes and the 75% pass mark. Accepting that
chain for two facts and rejecting it for a third would be this project preferring its prior over
its evidence.

**Adopted by owner decision on 2026-08-11**, at HIGH confidence, inheriting the same
classification-chain caveat section 4 of `research/exam-mechanics.md` already attaches to the 75%
figure. The figure both earlier cycles dismissed as unverified third-party noise turns out to
have been right, which is recorded rather than glossed.

What follows from it:

- **60 questions in 90 minutes is 90 seconds per question.** 75% of 60 is **45 correct to pass**;
  the owner's 71% is 42 or 43 correct, so they were two to three questions short.
- **The practice exams become sixteen 60-question papers, not ten 100-question ones**, so a
  sitting is a true simulation of the real one including its pacing. The per-exam composition and
  the arithmetic are in "Exam and drill assembly" below.
- **The no-question-count rule is retired** and replaced by a sourced-figure rule: 60 may be
  stated with its source, and no other count may be stated at all. Check 19 changes from
  forbidding a count to enforcing the sourced one.
- Every document that asserted the old claim carries a visible retraction rather than a silent
  edit: `PROGRESS.md`, `research/exam-mechanics.md`, `study-guide/README.md`,
  `study-guide/STYLE.md` and `study-guide/04-security.md`.

This is what P1 existed for. A pre-work item that re-fetches a fact and finds it unchanged buys
nothing; this one overturned a foundational claim before a single question was written on top of
it.

---

## Two findings that change the brief

### 1. `importance` is degenerate and cycle 3 does not use it

The kickoff asked that `required_depth` **and** `importance` drive question count and difficulty.
`importance` cannot. `tools/lib/importance.mjs` computes it as
`clamp(round(normalize(domainWeight) * 3 + min(competencyRefs, 2)))`, and `competencyRefs` is
uniform across the dataset, so the stored value collapses to a bijection with domain:

| Domain | Weight | `importance` | Concepts |
| --- | ---: | ---: | ---: |
| System Administration Fundamentals | 30% | 4 | 173 |
| Cloud Computing Fundamentals | 18% | 2 | 82 |
| Linux Fundamentals | 16% | 2 | 66 |
| Security Fundamentals | 14% | 2 | 65 |
| DevOps Fundamentals | 12% | 1 | 71 |
| IT Project Management Fundamentals | 10% | 1 | 80 |

It is constant within every domain: 151 concepts at 1, 213 at 2, 173 at 4, and none at 3 or 5. It
is a *coarsened* domain weight — 18%, 16% and 14% all collapse to 2 — so it carries strictly less
information than the weight it derives from. Using it alongside domain weight to drive question
count would double-count weight and add rounding noise.

**Decision: question count is driven by domain weight and `required_depth` only.** `importance`
keeps its one legitimate use, as the second key in comparison-block ownership
(`tools/lib/comparisons.mjs`), where it is a tie-break and not a signal. This is recorded in
`PROGRESS.md` by pre-work item P4 so that cycle 4 does not rediscover it.

### 2. `PROGRESS.md` is stale by three commits, and one fact-check pass has no artifact

Commit `97cc94b` ("fix: apply 51 review findings, 127 fact-check refutations and 25 wrong
knowledge-check answers") touched 20 guide files. Commit `c15e803` closed five harness gaps. None
of that work is recorded in `PROGRESS.md`, which still asserts two things that are now false:

- that the eight never-fact-checked competency files carry "no other claim … checked against a
  primary source by this pass or any other";
- that "no Knowledge-check answer was verified against a source".

Worse, `docs/verification/` holds exactly 765 records across 14 files, 55 refuted — the command
and waiver pass only. **There is no committed verdict artifact for the 127 refutations.** That
pass is unauditable from a clone. This is the same evidence failure as cycle 1's lost
claim-to-verdict pairing, arriving from the other direction: work that did happen, recorded
nowhere. Pre-work items P3 and P4 close it.

---

## What cycle 3 produces

- A question bank of **1,150 single-best-answer items**: a 1,000-item exam pool allocated exactly
  by the domain weights, and a 150-item weak-area supplement.
- **Sixteen static practice exams** of 60 questions each — real exam length — drawing 960 of the
  1,000-item exam pool, each an exact miniature of the weight table.
- **Drills** generated from the bank: 22 by competency, 6 by domain, 1 weak-area.
- **`npm run check-bank`** — 21 checks that validate the bank the way `check-guide` validates the
  guide, including the three the kickoff named by hand: distribution against the domain weights,
  duplicate and near-duplicate detection, and answer-position balance.

Explicitly **not** in scope: the interactive simulator (cycle 4).

---

## The allocation

### Formula

Two inputs, both from `data/`. No hand-assigned number anywhere.

1. **Domain budget** = `domain weight × 10`. Sums to 1,000 because the weights sum to 100.
2. **Within a domain**, every concept receives a floor of **1** — that floor is the coverage
   proof — and the remaining budget is distributed by largest remainder over a depth weight:

   | `required_depth` | 1 | 2 | 3 | 4 | 5 |
   | --- | ---: | ---: | ---: | ---: | ---: |
   | weight | 1 | 2 | 4 | 7 | 9 |

   Ties in the remainder are broken by higher depth weight, then by lexicographically lower
   concept id, so the assignment is a pure function of `data/` and reproducible on any machine.

**Why this curve and not a linear 1-2-3-4-5.** The linear curve was computed first and rejected:
it gave a depth-1 Cloud concept 2 questions while a depth-3 IT Project Management concept got 1.
That is arithmetically correct and reads as broken. The steeper curve makes **a depth-1 concept
receive exactly 1 question in every domain**, which is a property worth being able to state, and
it keeps allocation monotonic in depth inside every domain.

### Result, computed against the current dataset

| Domain | Weight | Concepts | Questions | q/concept | L1 | L2 | L3 | L4 | L5 |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| System Administration | 30% | 173 | 300 | 1.73 | 1 | 1 | 1–2 | 2 | 2 |
| Cloud Computing | 18% | 82 | 180 | 2.20 | 1 | 2 | 2–3 | — | — |
| Linux Fundamentals | 16% | 66 | 160 | 2.42 | 1 | 2 | 2–3 | — | 5 |
| Security | 14% | 65 | 140 | 2.15 | 1 | 2 | 2–3 | — | 4 |
| DevOps | 12% | 71 | 120 | 1.69 | 1 | 1–2 | 2 | — | — |
| IT Project Management | 10% | 80 | 100 | 1.25 | 1 | 1 | 1–2 | — | — |
| **Total** | **100%** | **537** | **1,000** | **1.86** | | | | | |

Minimum 1 question per concept, maximum 5.

**The consequence, stated rather than smoothed.** A Linux Fundamentals concept receives 2.42
questions and an IT Project Management concept 1.25. That is not a judgement about the material:
16% of the paper spread over 66 concepts is nearly twice the per-concept exposure of 10% spread
over 80. Concept counts never tracked exam weight — cycle 1 said so explicitly — and this is
where that finally has to be paid for. The alternative, equal questions per concept, would drill
IT Project Management's 80 concepts as hard as Cloud's 82 while the real exam asks roughly 80
fewer questions about them.

### Weak-area supplement — 150 questions, outside the exams

The owner's two declared weak areas get an extra derived allocation over
`System Administration :: Networking` (49 concepts), `Cloud Computing :: Networking` (14) and
`DevOps :: Containers` (24):

| `required_depth` | supplement |
| --- | ---: |
| 1 | +0 |
| 2 | +1 |
| 3, 4, 5 | +2 |

That is **150 questions over 86 of those 87 concepts** (one is depth 1 and gets none). These carry
`pool: "supplement"`, live in the bank, and are **excluded from the ten practice exams** so the
exams remain exact weight miniatures. They are reachable through the drills. Bank total: **1,150**.

### Feasibility, checked rather than assumed

Three constraints the allocation has to satisfy were verified against the current dataset before
this design was accepted:

- **Comparison coverage.** All 130 comparison-block owners are depth 3 or above (127 at L3, 2 at
  L4, 1 at L5), so every block has an owner with at least one question slot. Only 6 owners have
  exactly one slot, which is why a single item is allowed to discharge more than one coverage
  requirement (see "Type and difficulty" below).
- **Command coverage.** 171 concepts carry 380 command strings; the largest single array holds 8.
  One concept, `sysadmin.system-administration.user-account`, carries 5 strings but is allocated
  1 question, so a rule requiring one string per option slot would be unsatisfiable. The rule is
  therefore the same shape as `check-guide`'s: **every command string must appear verbatim as a
  code span somewhere inside one of its concept's items** — stem, option, or rationale.
- **Exam partitioning.** Every domain has more concepts than per-exam slots (tightest: System
  Administration, 173 concepts for 30 slots), and no concept holds more than 5 questions against
  10 exams, so "at most one item per concept per exam" is satisfiable in all ten.

---

## The item

### Format

**Single-best-answer, exactly four options, throughout.** Official sources state the exam is
multiple choice and say nothing about whether items are single-answer or multi-select —
`research/exam-mechanics.md` records that as an open question. Assuming multi-select would be
exactly the unevidenced assumption this project refuses everywhere else. Four options also make
answer-position balance exact (25 per position per 100-question exam) rather than a tolerance, and
keep the 75% arithmetic clean; multi-select would need a partial-credit rule nobody has published.

### Layout on disk

One JSON file per competency under `questions/`, mirroring `study-guide/` exactly, so a
competency's prose and its questions sit at the same relative path.

```
questions/
  01-linux-fundamentals/{linux-operating-system,command-line}.json
  02-system-administration/{system-administration,best-practices,networking,
                            troubleshooting,disaster-recovery}.json
  03-cloud-computing/{cloud-computing,performance-availability,budgeting,
                      best-practices,networking}.json
  04-security/{security,sensitive-data,compliance}.json
  05-devops/{devops-basics,git-concepts,containers}.json
  06-it-project-management/{project-management,software-application-architecture,
                            functional-analysis,open-source-software-and-licensing}.json
```

Supplement items live in the same file as their competency, distinguished by `pool`, so a
competency's questions are never split across two places.

### Schema

```json
{
  "id": "q.sysadmin.networking.subnet-mask-and-cidr.02",
  "concept_id": "sysadmin.networking.subnet-mask-and-cidr",
  "pool": "exam",
  "type": "application",
  "difficulty": 3,
  "stem": "...",
  "options": [
    { "ref": "o1", "text": "...", "correct": true,
      "why": "...", "provenance": { "kind": "key" } },
    { "ref": "o2", "text": "...", "correct": false,
      "why": "...", "provenance": { "kind": "confusable",
        "concept_id": "sysadmin.networking.network-host-and-broadcast-addresses" } },
    { "ref": "o3", "text": "...", "correct": false,
      "why": "...", "provenance": { "kind": "sibling",
        "concept_id": "sysadmin.networking.subnetting" } },
    { "ref": "o4", "text": "...", "correct": false,
      "why": "...", "provenance": { "kind": "misconception",
        "documented_at": "data:notes" } }
  ],
  "rationale": "why the key is right",
  "source_ids": ["rfc-4632-cidr"],
  "guide_anchor": "02-system-administration/networking.md#c-sysadmin.networking.subnet-mask-and-cidr",
  "comparison_block": null,
  "commands_covered": [],
  "waived_source": false
}
```

`id` is `q.<concept-id>.<NN>`, two-digit ordinal within the concept. `pool` is `exam` or
`supplement`. `type` is one of `recall`, `application`, `command`, `diagnostic`, `discrimination`.
`comparison_block` is a `cmp-<owner-id>` anchor or `null`. `commands_covered` lists the command
strings this item carries verbatim.

`documented_at` takes exactly one of two forms, both resolvable by check 8:

- `data:notes:<concept-id>` — the misconception is named in that concept's `notes` field;
- `guide:<relative-path>#c-<concept-id>` — it is named in that concept's block in the guide, which
  in practice means its **Traps** or **What the exam may test** paragraph.

Check 8 resolves the id and, for the guide form, confirms the anchor exists. It does not attempt
to confirm the cited text actually describes the misconception — that is layer 2's job.

### There is no answer position in the bank

Options carry stable refs (`o1`…`o4`), not letters. Which option becomes A is assigned by the exam
assembler at build time. Answer-position balance is therefore **exact by construction** rather than
something an author has to remember and a checker has to police afterwards. Check 18 still runs
over the generated output; it simply cannot fail. Authors never think about position, and the
bank has no bias to inherit.

### Distractor provenance is the auditable spine

Every question traces to a concept id; every distractor traces too. `confused_with` supplies 158
undirected edges collapsed into 130 comparison blocks over 254 of the 537 concepts, each block
already carrying the one axis that separates its members — which is exactly the shape a
multiple-choice item takes.

| `kind` | Meaning | Must record |
| --- | --- | --- |
| `confusable` | is, or describes, a concept in the tested concept's `confused_with` | `concept_id` |
| `sibling` | a concept in the same `path[2]` section or competency | `concept_id` |
| `lookalike` | a same-named concept in another domain — `cloud.networking.*` against `sysadmin.networking.*` is the live case | `concept_id` |
| `variant` | a real but wrong flag or option, or a neighbouring real command | the real command string |
| `misconception` | a documented wrong belief | `documented_at` |

**Hard rule: at most one `misconception` distractor per item; the other two must name a resolvable
concept id or a real command string.** A distractor nobody can trace is a distractor somebody
invented, and an invented distractor is the most likely route to an item with two correct answers.
`misconception` requires a citation precisely because it is the one kind that is not a concept.

### Type and difficulty are derived, not chosen

`difficulty` equals `required_depth`, straight through. Coverage requirements follow from what the
concept carries:

- concept is in a comparison block → at least one of its items must name that block in
  `comparison_block`;
- concept has a non-empty `commands` array → every one of its command strings appears verbatim as
  a code span in one of its items;
- `required_depth` 4 or 5 → at least one item of `type: diagnostic`;
- remaining slots: depth 1–2 → `recall`, depth 3 and above → `application`; `command` and
  `discrimination` are used where the item's shape is genuinely that.

These are **properties an item satisfies, not exclusive labels**, so one item may discharge two
requirements when it genuinely does — a command question whose three distractors are the concept's
confusables covers both. That is what makes the 6 single-slot block owners work.

### Every item links to its guide anchor

`guide_anchor` is checked to resolve against the parsed guide. Missing a question sends the reader
straight to the paragraph that teaches it, and the bank and the guide cannot silently drift: a
renamed anchor breaks the bank build.

### Waived concepts

Items on concepts still named in `data/sourcing-waivers.json` after pre-work P2 carry
`waived_source: true`. Their stems and keys are restricted to what consensus sources agree on — no
item may turn on a detail where sources differ. The harness counts them and reports the number
rather than hiding it, and the generated drills and answer keys carry the same
consensus-not-citable-fact register the guide uses.

---

## The harness — `npm run check-bank`

Checks live in `tools/lib/question-checks.mjs` with unit tests over fixtures in
`tools/test/question-checks.test.mjs`; the CLI is `tools/check-bank.mjs`. `--scope "<Domain> ::
<Competency>"` narrows a run while authoring; the unscoped run is the one that counts. Exits
non-zero on any error. Structure follows `check-guide` deliberately — same lib/CLI/test split,
same scope flag, same summary line reporting what was actually inspected.

| # | Check | Severity | What it proves |
| ---: | --- | --- | --- |
| 1 | `q-unknown-concept` | error | Every `concept_id` exists in `data/` |
| 2 | `q-concept-coverage` | error | **All 537 concepts have at least one item. This is the coverage proof.** |
| 3 | `q-count-derived` | error | Per-concept item counts equal the derived allocation exactly, per pool |
| 4 | `q-comparison-coverage` | error | All 130 comparison blocks are named by at least one item, and every `comparison_block` resolves |
| 5 | `q-command-coverage` | error | All 380 command strings appear verbatim as a code span in one of their concept's items |
| 6 | `q-diagnostic-coverage` | error | Every depth-4 and depth-5 concept has a `diagnostic` item |
| 7 | `q-option-contract` | error | Exactly 4 options, exactly 1 correct, unique refs, no "all of the above" or "none of the above" |
| 8 | `q-distractor-provenance` | error | Every distractor tagged; at most 1 `misconception` per item; concept ids and command strings resolve |
| 9 | `q-distractor-distinct` | error | No two options in an item normalize to the same thing. It does **not** prove that no distractor is also correct — that is a semantic judgement, it belongs to layer 2's second question, and the check's own message says so rather than letting a green run imply a guarantee it never made |
| 10 | `q-rationale-complete` | error | Key rationale present; every option carries a `why` |
| 11 | `q-difficulty-derived` | error | `difficulty === required_depth` |
| 12 | `q-source-ids` | error | Every source id exists in `data/sources.json` |
| 13 | `q-guide-anchor` | error | Every `guide_anchor` resolves to a real file and a defined anchor |
| 14 | `q-length-cue` | warn | The key is the longest option no more often than chance, bank-wide and per competency |
| 15 | `q-domain-distribution` | error | The exam pool matches the weight table exactly; the supplement is reported separately |
| 16 | `q-duplicate` | error | No two items share a normalized stem |
| 17 | `q-near-duplicate` | error at ≥0.85, warn at ≥0.70 | Stem similarity below threshold, plus a same-concept-same-key check |
| 18 | `q-answer-position-balance` | error | Key position across the generated output: exactly 15 per position in each 60-question exam, and within ±2 of even in each drill |
| 19 | `q-question-count` | error | Every exam file carries the mandatory header verbatim, and no document states any question count other than the sourced 60 |
| 20 | `q-waiver-policy` | error | Every item whose concept is still named in `data/sourcing-waivers.json` carries `waived_source: true`, no item carries it otherwise, and the total is reported. The *restriction* to consensus-agreed content is a review and layer-2 judgement, not a mechanical one, and is not claimed as checked |
| 21 | `q-verdict-coverage` | error | **Every item has a recorded adversarial verdict from a named agent** |

### Why check 21 exists

Cycle 1 lost the claim-to-verdict pairing and eight findings defaulted silently to "rejected",
which read in the summary exactly like eight confident refutations. Cycle 2 dispatched 22 agents
that all died on the session usage limit in 31 seconds, and recorded that correctly as *a pass
that did not run*. Both were caught by a human reading a report carefully.

Putting the requirement in the harness means an unverified item is a **build failure**, not a
paragraph someone has to notice. A pass that did not run cannot be reported as a pass that found
nothing, because the build is red.

### Duplicate normalization, pinned by test

Lowercase; replace inline code spans and fenced blocks with a single placeholder token; strip
markdown and punctuation; drop a fixed stopword list; collapse whitespace; strip a trailing `s`.
Similarity is `max(token-set Jaccard, 3-gram shingle Jaccard)` over normalized stems. Thresholds
0.85 (error) and 0.70 (warn) are constants in the lib with a test asserting them, not magic numbers
in a script. Items on the same concept are **not** exempt: same-concept pairs are exactly where
duplicates hide.

---

## Exam and drill assembly — `npm run build-exams`

Generated output, never hand-edited, with a generated-file header on every file. Deterministic and
seeded in the script — no `Math.random`, no clock. Regeneration is byte-identical, asserted by a
test, exactly as `npm run generate` is for `research/**`.

```
exams/
  exam-01.md … exam-16.md
  exam-01-answers.md … exam-16-answers.md
  index.json
drills/
  by-competency/*.md      22 files
  by-domain/*.md           6 files
  weak-areas.md            networking + containers, including the supplement
```

### Exam size and composition

Each exam is **60 questions**, the real exam's length. 60 does not divide the weight table into
integers, so the per-exam composition is the largest-remainder rounding of `weight × 60` — the
same deterministic rule the per-concept allocation uses, computed rather than assumed:

| Domain | Weight | `weight × 60` | Slots |
| --- | ---: | ---: | ---: |
| System Administration | 30% | 18.0 | 18 |
| Cloud Computing | 18% | 10.8 | 11 |
| Linux Fundamentals | 16% | 9.6 | 10 |
| Security | 14% | 8.4 | 8 |
| DevOps | 12% | 7.2 | 7 |
| IT Project Management | 10% | 6.0 | 6 |
| **Total** | | | **60** |

**Sixteen exams, not more.** Linux Fundamentals is the binding constraint: 160 exam-pool items at
10 per exam allows exactly 16. The sixteen consume 160 / 288 / 176 / 128 / 112 / 96 = **960 items**,
leaving **40** — 0 Linux, 12 System Administration, 4 Cloud, 12 Security, 8 DevOps, 4 IT Project
Management — that no exam uses.

**Those 40 are not waste and they are not hidden.** The bank stays exactly weight-proportional and
each exam stays exactly composition-correct; both cannot be true at once while 60 fails to divide
the weights, and the bank's fidelity to the published weights is the property worth keeping. The
40 appear in the drills like every other item, and `build-exams` lists them by id in
`exams/index.json` so which items never appear on a paper is a fact on record rather than a
silent residue.

### Per-exam constraints, all hard

The assembler fails loudly rather than relaxing any of them:

- exact domain counts, per the composition table above;
- at most one item per concept;
- no two items naming the same comparison block;
- depth mix within ±2: for each domain *d* and each depth level *L*, the number of depth-*L* items
  in that exam's *d* slice is within ±2 of `round(slots(d) × share of d's exam-pool items at
  depth L)`;
- key position exactly 15 / 15 / 15 / 15 — 60 divides by 4 exactly, so this stays an equality
  rather than a tolerance.

The sixteen exams are disjoint, so no item appears in two of them, and no supplement item appears
in any of them.

### The mandatory header

Every exam file carries, verbatim:

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Check 19 enforces that every exam carries it and that no document anywhere states a different
count.

---

## Verification

Three layers, because cycle 2 showed layer 1 alone misses a great deal — its per-task reviews
passed prose that a later adversarial pass refuted 55 times over two claim classes, and a
subsequent single pass over eight previously unchecked files returned 127 refutations.

**Layer 1 — independent review after every authoring task.** The reviewer reads the diff against
the authoring brief and the dataset. Cycle 2's pattern, unchanged.

**Layer 2 — adversarial verification, per item.** An independent agent, instructed to refute and
to default to "the item is wrong" when uncertain, answers three questions per item:

1. Is the key actually correct against the cited primary source?
2. Is any distractor **also** correct? (The killer defect — an item with two right answers.)
3. Does each distractor's `why` state a true fact?

Verdicts are written to `docs/verification/qbank-verify-<competency>.json` as
`{item_id, target, agent_label, verdict, reasoning, source_url}`, where `target` is `key` or an
option ref. Check 21 enforces completeness against the bank.

Layer 2 has a side effect worth naming: it drags all 537 concepts through an adversarial read
against primary sources. Only 14 of 22 competency files were ever reached that way by cycle 2's
scoped pass, and only for command strings and waiver hedging.

**Layer 3 — final whole-branch adversarial review**, six lenses as in cycle 2, plus a seventh that
recomputes every number appearing in this cycle's documents from `data/` and the tooling. Cycle 2's
own experience is the justification: its wave-3 findings were "almost entirely hand-computed
arithmetic and rank claims stated with confidence and wrong."

### Write-back

Where layer 2 finds the guide or `data/` wrong, cycle 2's policy applies unchanged: fix `data/`,
re-run `npm run generate` so `research/**` and `coverage-matrix.md` follow, fix the guide prose,
re-run `check-guide`, and record the correction in `PROGRESS.md` with the primary source that
settles it. `research/**` and `coverage-matrix.md` are never hand-edited; `research/exam-mechanics.md`
and `research/lfs200-notes/00-course-map.md` are the two hand-written exceptions, marked as such in
their own headers.

---

## Pre-work

Nothing is authored until all four land.

### P1 — Capture the exam facts

Every question inherits the duration, the pass mark and the weights, and those currently rest on
cycle 1 browser work with no capture artifact in the repository.

Re-fetch the LFCA certification page, the Multiple Choice Exams FAQ, and the Multiple Choice Exams
Important Instructions page. Store extracted text plus a manifest of
`{url, fetched_at, sha256, fact, verbatim_quote}` under `docs/verification/exam-facts-2026-08-11/`.
`docs/verification/` is chosen deliberately: `research/` is generated and must not gain a
hand-written artifact.

**Cycle 1 recorded that the certification page's "Includes" summary box and its pricing widget are
JS-rendered and visible only in a browser.** This task therefore uses the browser tool, not a
plain fetch, and records which surface each fact came from.

Reconcile `research/exam-mechanics.md` — a hand-written exception, so editable — and cite the
capture. Any fact that has moved since 2026-08-09 is a finding and is recorded as one, not
quietly overwritten.

### P2 — Sourcing sprint over the 52 waived concepts

Prose can hedge; a question needs a defensible correct answer. `data/sourcing-waivers.json`'s own
`reason` field already says question generation over these concepts "should be gated on resolving
them."

The recorded waiver rationale — PMBOK, PMI Lexicon, ISO 21500/21502, BABOK and ISO/IEC/IEEE
12207/29148 are paywalled — is true for much of `pm.project-management.*` and simply not the real
reason for a substantial part of the list. Cycle 2 already un-waived 5 of the original 57 on
exactly this pattern. Candidate free primary sources identified during design, to be fetched and
read rather than assumed:

| Concepts | Candidate free primary source |
| --- | --- |
| `sysadmin.networking.vpn` | NIST SP 800-77r1 |
| `software-application-architecture.caching-in-applications` | RFC 9111 |
| `functional-analysis.use-case` | OMG UML 2.5.1 |
| `functional-analysis.process-mapping` | OMG BPMN 2.0 |
| `project-management.work-breakdown-structure` | NASA WBS Handbook, MIL-STD-881F |
| `functional-analysis.{requirements-elicitation, functional-requirements, non-functional-requirements, specification-documentation, traceability, verification-vs-validation, feasibility-study}` | NASA Systems Engineering Handbook SP-2016-6105 |
| `troubleshooting.*` (4), `best-practices.service-ownership` | Google SRE book (free online) |
| `project-management.{user-story, minimum-viable-product}` | Agile Alliance glossary, the Scrum Guide |
| `project-management.change-control`, `best-practices.automation-and-idempotency` | NIST SP 800-128 |
| `project-management.{software-development-lifecycle, risk-management}` | NIST SSDF SP 800-218, NIST SP 800-30 |
| `software-application-architecture.message-queue` | AMQP 0-9-1 specification |
| `software-application-architecture.{sql-basics, nosql-database, three-tier-architecture, web-server-vs-application-server}`, `git-concepts.pull-request`, `devops-basics.language-package-managers`, `disaster-recovery.snapshot` | vendor documentation, tier 2 as already used for AWS and Microsoft |

**Six clusters, one agent each**, chosen so that each agent works a coherent source corpus rather
than a coherent competency:

| Cluster | Concepts | Corpus |
| --- | ---: | --- |
| A — standards and RFCs | `vpn`, `caching-in-applications`, `bandwidth-latency-and-throughput`, `message-queue` | NIST SP 800-77r1, RFC 9111, RFC 6349/7799, AMQP 0-9-1 |
| B — OMG and modelling | `use-case`, `process-mapping`, `three-tier-architecture`, `gap-analysis` | OMG UML 2.5.1, OMG BPMN 2.0 |
| C — NASA / DoD systems engineering | the 7 `functional-analysis.*` requirements concepts, `work-breakdown-structure`, `user-acceptance-testing`, `traceability` | NASA SE Handbook SP-2016-6105, NASA WBS Handbook, MIL-STD-881F |
| D — NIST governance and process | `change-control`, `automation-and-idempotency`, `software-development-lifecycle`, `risk-management`, `naming-conventions`, `capacity-planning`, `principle-of-least-astonishment` | NIST SP 800-128, SP 800-218, SP 800-30, SP 800-53r5 |
| E — SRE and agile practice | the 4 `troubleshooting.*` concepts, `service-ownership`, `mttr-and-mtbf`, `user-story`, `minimum-viable-product` | Google SRE book and Workbook, Agile Alliance glossary, the Scrum Guide |
| F — vendor documentation, tier 2 | `sql-basics`, `nosql-database`, `web-server-vs-application-server`, `pull-request`, `language-package-managers`, `snapshot` | PostgreSQL, Redis/MongoDB, Apache/nginx, GitHub and GitLab docs, LVM and AWS EBS docs |

**39 of the 52 are assigned to a cluster. The other 13 are all `pm.project-management.*`** —
`communication-plan`, `critical-path`, `deliverable-and-milestone`, `gantt-chart`,
`issue-tracking`, `project`, `project-budget-and-resource-management`,
`project-closure-and-lessons-learned`, `raci`, `scope-creep`, `stakeholder`, `triple-constraint`,
`waterfall` — where PMBOK genuinely is the only authority the waiver names. They are expected to
stay waived and no agent is asked to force a source for them. If a task later finds one
incidentally (Royce's 1970 paper for `waterfall` is the plausible case), it is un-waived by the
same standard as the rest.

`naming-conventions` and `capacity-planning` appear in cluster D only to be **re-confirmed as
waived** against the evidence cycle 2 already examined; they are not to be un-waived on that same
evidence, and cycle 2's judgement stands unless a genuinely new source is found.

Each agent must **fetch and read** a candidate source, or return
"no source found" naming what it tried — the same standard cycle 2's Task 34 held itself to. What
clears is un-waived: source added to `additional_sources`, entry removed from
`data/sourcing-waivers.json`, `by_competency` counts recomputed, the guide's waiver marker removed,
and `check-guide` re-run.

Whatever remains waived is governed by a written policy recorded in `PROGRESS.md`: an item on a
waived concept is permitted only where every consensus source agrees on the definition, it carries
`waived_source: true`, and check 20 counts and reports it.

### P3 — Re-check the eight singly-checked files, and produce the missing artifact

The five Cloud Computing competency files, `04-security/sensitive-data.md`,
`04-security/compliance.md`, and `06-it-project-management/open-source-software-and-licensing.md`
have had exactly one adversarial prose pass, and that pass returned 127 refutations with no
committed verdict record. A base rate that high in a single pass is not evidence the file is now
clean.

A second independent pass over all eight, verdicts committed under `docs/verification/` in the
same `{claim_id, concept_id, kind, claim, verdict, reasoning, source}` shape the existing 14
factcheck files use. A question built on a surviving error propagates it into practice, so this
runs before authoring, not alongside it.

### P4 — Bring `PROGRESS.md` current

Record commits `97cc94b` and `c15e803` and what they changed. Retract the two statements that are
now false — that the eight files carry nothing checked against a primary source, and that no
knowledge-check answer was ever verified. Record the `importance` degeneracy finding and cycle 3's
decision not to use it. Record that the 127-refutation pass left no artifact, and what P3 does
about it.

---

## Tooling

New files, following cycle 1 and 2's structure exactly:

| File | Purpose |
| --- | --- |
| `tools/lib/allocation.mjs` | The derived per-concept question count, difficulty, and coverage requirements. Shared by the planner, the checker, and the assembler so the three cannot disagree — the same reason `comparisons.mjs` is shared. |
| `tools/lib/question-load.mjs` | Loads and schema-validates `questions/**`, naming the offending file on error. |
| `tools/lib/question-checks.mjs` | The 21 checks. |
| `tools/lib/similarity.mjs` | Normalization and the two Jaccard measures, with thresholds as named constants. |
| `tools/lib/rng.mjs` | A seeded PRNG and string hash, so assembly is deterministic and idempotent without `Math.random` or a clock. |
| `tools/lib/assemble.mjs` | Partition the exam pool into sixteen 60-question exams, assign key positions, render the markdown. Kept out of the CLI so the constraint solver is unit-testable without touching the filesystem. |
| `tools/question-plan.mjs` | `npm run question-plan` — per-competency authoring brief from `data/`, the guide, and `allocation.mjs`: every concept with its allocated count, depth, difficulty, required types, its `confused_with` neighbours and their descriptions, its comparison block membership, its command strings, its `notes`, its guide anchor, and its waiver status. Nothing committed; derived on demand so it cannot go stale. |
| `tools/check-bank.mjs` | `npm run check-bank`. |
| `tools/build-exams.mjs` | `npm run build-exams`. |

`tools/validate.mjs` and `tools/check-guide.mjs` are **not modified**. They check `data/` and the
guide; the bank is a separate artifact with separate invariants. Cycle 3 adds tests and does not
remove or weaken any existing one.

Every number a writing brief prints is computed by `allocation.mjs`, never by a writer at the
keyboard. Cycle 2 learned this the hard way — its pilot file stated a wrong domain rank and a
wrong LFS200 coverage fraction by eyeballing them, and the systemic fix was to make `guide-plan`
print the figures. The same rule applies here.

---

## Execution

Cycle 2's process: fresh subagent per task, independent review after each, **batched five or six
at a time**. Larger fan-outs repeatedly died on the session usage limit, and one killed four
agents mid-edit without reporting.

| Stage | Shape |
| --- | --- |
| Pre-work | P1 (browser, 1 agent) · P2 (6 agents, 1 wave) · P3 (8 agents, 2 waves) · P4 (1 agent, after P1–P3) |
| Tooling | `allocation.mjs`, `question-load.mjs`, `similarity.mjs`, `question-checks.mjs`, `question-plan.mjs`, `check-bank.mjs`, `build-exams.mjs` — test-driven, largely serial, reviewed individually |
| Pilot | One competency authored end to end and reviewed before the rest start, as cycle 2 did with Task 8 |
| Authoring | 22 competencies, waves of five or six, each followed by its review |
| Verification | 22 layer-2 verify agents, waves of five or six |
| Assembly | `build-exams`, idempotency check, full gate run |
| Final review | Seven-lens whole-branch adversarial review, then synthesis |

Green gates at every task boundary: `npm test`, `npm run validate`, `npm run check-guide`, and —
once it exists — `npm run check-bank`.

---

## Constraints

**No exam dumps.** Cycle 1's exclusion list stands: itexams.com, certempire.com,
validexamdumps.com, passitexams.com, certlibrary.com, certgod.com, exam-labs.com, p2pexams.com,
marks4sure.com, certstest.com. Any new site encountered is excluded on sight, unopened, and logged
in `PROGRESS.md`. Authors and verifiers are instructed that their sources are the guide, `data/`,
and primary documentation — nothing else. This matters more in cycle 3 than in either earlier
cycle, because a question bank is the artifact a dump would most plausibly contaminate. The point
of this project is that the underlying knowledge is taught well enough that exam wording is
immaterial.

**Copyright.** LFS200 is paid, copyrighted material and no course prose has been reproduced in two
cycles. Cycle 3 holds that line: an item may state that a lesson covers a topic and may cite
`research/lfs200-notes/00-course-map.md`, and reproduces no course text.

**One question count, and it is sourced.** The exam is 60 questions, per the Linux Foundation's own
Multiple Choice Exams: Important Instructions page, captured at
`docs/verification/exam-facts-2026-08-11/`. That figure may be stated; no other count may be
stated anywhere, and no figure may be given without its source. Check 19 enforces both halves.
This replaces the no-question-count rule the kickoff brief set and both earlier cycles held — see
the amendment at the top of this document for why.

**Generated files.** `research/**` and `coverage-matrix.md` are generated from `data/` and never
hand-edited, with the two marked exceptions. `exams/**` and `drills/**` join them as generated
output — committed, because they are what the reader uses, but rebuilt by `build-exams` and never
edited in place.

**Honesty about sourcing.** Items on concepts still waived after P2 are visibly marked in the
generated drills and answer keys, in the same register the guide uses.

---

## Definition of done

1. All 537 concepts have at least one item, and per-concept counts equal the derived allocation —
   checks 2 and 3 pass.
2. All 130 comparison blocks and all 380 command strings are covered — checks 4 and 5 pass.
3. Every item has four options, one key, and fully traced distractors — checks 7, 8 and 9 pass.
4. Every item has a recorded adversarial verdict from a named agent — check 21 passes.
5. The exam pool matches the domain weight table exactly, and the sixteen 60-question exams are
   disjoint with every hard constraint met — checks 15 and 18 pass and `build-exams` exits 0.
   The 40 exam-pool items no exam uses are listed by id in `exams/index.json`.
6. Duplicate and near-duplicate detection are clean — checks 16 and 17 pass.
7. `npm run check-bank` exits 0 with 0 errors.
8. `npm test`, `npm run validate` and `npm run check-guide` all still exit 0 with no new warnings.
9. `npm run build-exams` is idempotent — a second run leaves no diff.
10. P1's capture artifact is committed and `research/exam-mechanics.md` cites it.
11. P2's sourcing decisions and the residual waiver policy are recorded in `PROGRESS.md`, and
    `data/sourcing-waivers.json` matches.
12. P3's verdicts for all eight files are committed under `docs/verification/`.
13. Every `data/` or guide correction found by layer 2 is applied, `generate` re-run, and recorded
    in `PROGRESS.md` with its settling source.
14. `PROGRESS.md` is current and names every remaining gap honestly, including anything cycle 3
    could not verify.
15. The final whole-branch adversarial review has run and its findings are resolved or recorded.

---

## Known risks

| Risk | Handling |
| --- | --- |
| An item has two correct answers | Check 9, plus layer 2's second question asked of every distractor by an agent told to refute |
| A wrong key is drilled as correct | Layer 2 verifies every key against its cited primary source; check 21 makes a missing verdict a build failure |
| Distractors are invented rather than derived | Check 8: at most one `misconception` per item, the rest must resolve to a concept id or a real command string |
| The adversarial layer fails silently, as in cycle 1 | The verdict requirement lives in the harness, not in a report — an unverified item is red, not unnoticed |
| A surviving guide error propagates into practice | Authors work from the guide, but layer 2 re-derives against the primary source and writes back |
| Numbers drift or are hand-computed | Every figure comes from `allocation.mjs`; the seventh review lens recomputes all of them |
| Answer position leaks the key | Position is assigned by the assembler, not authored; balance is exact by construction |
| The longest option is the key | Check 14, bank-wide and per competency |
| Near-duplicates inflate the count without adding coverage | Check 17, with same-concept pairs explicitly not exempt |
| A question count is stated without its source, or a wrong one is stated | Check 19: every exam carries the sourced header verbatim, and no document states any count but 60 |
| The 40 unused exam-pool items become an invisible residue | `build-exams` lists them by id in `exams/index.json`; they still appear in the drills |
| Waived concepts yield unanswerable items | P2 sources what it can; the residue is policy-bound, tagged, and counted |
| The bank and the guide drift apart | Check 13 pins every item to a resolving guide anchor |
| Large fan-outs die on the usage limit | Waves of five or six, as cycle 2 established |
| Cycle 4 pre-empted | Cycle 3 ships static markdown; no interactive delivery is built |
