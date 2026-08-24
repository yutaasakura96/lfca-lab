# LFCA Study Material

A source-traceable research pipeline that builds study material for the **current** LFCA
exam — the one updated on 16 September 2025 — from JSON data: a study guide, a question
bank, sixteen practice exams, and targeted drills.

> The two-node Docker practice lab that used to live here now has its own repo:
> **[yutaasakura96/linux-lab](https://github.com/yutaasakura96/linux-lab)**.

---

## The research dataset

This repo holds a source-traceable map of what the **current** LFCA exam
requires — the one updated on 16 September 2025. 537 concepts across all 22 official
competencies, each with a required depth, a coverage status against the official LFS200 course,
and primary-documentation citations for 524 of them; the remaining 13 are waived by name in
`data/sourcing-waivers.json`.

```
data/            canonical, hand-maintained
  competencies.json    6 domains, 22 competencies, current + previous weights, 2025 change set
  sources.json         665 sources, each with an authority tier
  topics/*.json        537 concepts, one file per domain
research/        generated — do not hand-edit
  official-lfca-objectives.md    the syllabus, with what changed in 2025
  lfs200-map.md                  which course lessons cover which concepts
  lfca-lfs200-gap-analysis.md    everything LFS200 does not fully cover
  candidate-experience.md
  sources.md
  exam-mechanics.md              the one hand-written file here; it says so at the top
  lfs200-notes/00-course-map.md  hand-written: LFS200 structure and measured gaps
study-guide/     hand-written prose that studies FROM the dataset above
  README.md            entry point, study order, what the guide claims and does not
  STYLE.md             the marker grammar every file is machine-checked against
  NN-<domain>.md       6 domain index files
  NN-<domain>/*.md     22 competency files, one per official competency
  appendix-a-*.md      packet's-life narrative linking concept anchors end to end
  appendix-b-*.md      container-to-cluster narrative, same purpose
questions/       source, hand-maintained — 1,150 items over all 537 concepts
  README.md            what the bank is, what check-bank proves and does not
  NN-<domain>/*.json   22 files, one per official competency
exams/           generated — 16 practice papers, 16 answer keys, index.json
drills/          generated — 22 by competency, 6 by domain, weak-areas
tools/           validate.mjs (18 checks), generate-views.mjs, check-guide.mjs, guide-plan.mjs,
                 check-bank.mjs, question-plan.mjs, build-exams.mjs
coverage-matrix.md  generated — the full join, one row per concept
PROGRESS.md      what was found, what is still missing, and how confident each claim is
```

```bash
npm test && npm run validate && npm run generate
```

Zero dependencies; plain Node. `npm run validate` exits non-zero if any concept lacks a depth,
an objective, or a tier-1/2 source, if any official competency has no concepts, or if any
cross-reference dangles.

### The study guide

`study-guide/` is hand-written prose, checked by a separate harness that proves it covers the
dataset above — it does not re-verify that the prose is factually correct, only that it is
structurally complete.

```bash
npm run check-guide                                    # checks the whole guide
npm run check-guide -- --scope "Linux Fundamentals :: Command Line"   # one competency
npm run guide-plan -- "Linux Fundamentals :: Command Line"            # writing brief for one competency
```

`npm run check-guide` exits non-zero if any of the 537 concepts lacks a definition site, if any
`confused_with` comparison is missing, misattributed, or missing a pointer, if any dataset
command is absent from its concept's block, or if a concept's guide metadata (depth, importance,
`coverage_status`, sources) disagrees with `data/`. `npm run guide-plan` prints the writing brief
a competency's section needs — its concepts, depth targets, and the comparison blocks it owns or
must link out to — computed from `data/`, not maintained by hand.

**Everything in `research/` and `coverage-matrix.md` is generated from `data/`.** Edit the JSON
and regenerate; don't edit the markdown. The two exceptions carry a notice at the top of the
file.

### The question bank

`questions/` holds 1,150 multiple-choice items covering all 537 concepts, and
`npm run build-exams` turns them into 16 practice papers with answer keys plus 29 drills. See
[`questions/README.md`](questions/README.md) for what it contains and how the per-concept
allocation is derived.

```bash
npm run check-bank                                     # the whole bank — must be 0 errors, 0 warnings
npm run check-bank -- --scope "Security Fundamentals :: Security"
npm run build-exams                                    # rebuild exams/ and drills/
```

Sit `exams/exam-01.md` under the clock — **60 questions, 90 minutes, 45 of 60 to pass** — then
mark it against `exams/exam-01-answers.md`, which explains every distractor and links back into
the guide.

`check-bank` proves the bank is structurally complete and that every item carries an adversarial
verdict from a named agent. **It does not prove any key is correct**; that evidence lives in each
item's `verification` field, alongside the URLs actually fetched to settle it. `exams/` and
`drills/` are generated — rebuild them, don't edit them.

### Three findings worth knowing before you study

1. **The Linux Foundation's own change notice is wrong.** It says the domains were unchanged in
   September 2025. Their archived page shows every weight changed and one domain renamed.
   System Administration went from 20% to **30%** and is now the heaviest domain by far.
2. **Six competencies are new**, so no pre-September-2025 material covers them: Command Line,
   Best Practices (twice), Disaster Recovery, Networking (Cloud), and Compliance.
3. **LFS200 alone is not sufficient**, and the shortfall is structural rather than a matter of
   depth. Six competencies have no lesson at all, and `disaster recovery`, `Docker`, `TLS`,
   `GDPR`, `Scrum` and `cron` each appear **zero times** in the entire course.

See `PROGRESS.md` for the evidence and the confidence attached to each claim.
