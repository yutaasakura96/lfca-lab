# Cycle 2 kickoff prompt

Paste the block below into a fresh session, started in this repository.

---

I want to build **cycle 2 of my LFCA study system: the study guide.**

Cycle 1 is complete and merged to `main` in this repo. It produced a verified research dataset;
cycle 2 turns that dataset into prose I can actually study from. Do not redo cycle 1's research —
read what it produced and build on it.

## Start by reading these, in this order

1. `PROGRESS.md` — what cycle 1 found, what is still missing, and the confidence attached to each
   claim. Read this before anything else; it will save you re-deriving the whole project.
2. `research/lfs200-notes/00-course-map.md` — where the official course fails to cover the exam.
3. `research/exam-mechanics.md` — how the exam is delivered and scored.
4. `data/topics/*.json` — the 537 concepts that are the input to the study guide.
5. `docs/superpowers/specs/2026-08-09-lfca-research-foundation-design.md` — cycle 1's design, for
   the conventions cycle 2 should follow.

## About me

I sat the LFCA and scored **71% against a 75% pass mark**. I want **complete coverage, not
triage** — when I resit it I want to have mastered everything, not just my known weak spots. My
weakest areas were **networking (DNS, TCP/IP, ports)** and **containers (Docker, Kubernetes)**, so
those deserve extra care, but not at the expense of breadth.

Be concise in conversation. No emojis.

## What cycle 1 established (do not re-verify, but do respect)

- The current exam took effect **2025-09-16**. Weights: Linux Fundamentals 16%, System
  Administration 30%, Cloud Computing 18%, Security 14%, DevOps 12%, IT Project Management 10%.
- **90 minutes, multiple choice, 75% to pass, no practical component.** The question count is not
  published anywhere official — do not invent one.
- **The Linux Foundation's own change notice is inaccurate.** It says the domains were unchanged;
  their archived page shows every weight changed and one domain renamed. System Administration
  went from 20% to 30% and is now by far the heaviest.
- **Six competencies are new in 2025**, so no older material covers them: Command Line, Best
  Practices (in two different domains), Disaster Recovery, Networking (Cloud), Compliance.
- **LFS200 is still built on the retired syllabus.** Six competencies have no lesson at all, and
  `Docker`, `TLS`, `GDPR`, `Scrum`, `cron` and `disaster recovery` each appear **zero times** in
  the entire course. The study guide must carry these areas on its own.

## The dataset you are building from

`data/topics/*.json` — 537 concepts, one file per domain. Each carries `description`,
`required_depth` (1 Recognition … 5 Administration), `importance`, `commands`, `confused_with`
(concept ids), `related_topics`, `coverage_status` against LFS200, `confidence`, and `notes` that
often name the exam trap.

**`required_depth` should drive how much you write.** Depth 1 concepts need a sentence; depth 3
concepts need a worked scenario. The distribution is L1 39, L2 156, L3 321, L4 15, L5 6.

## What cycle 2 should produce

`study-guide/` with one file per domain (`01-linux-fundamentals.md` … `06-it-project-management.md`).

Per my original brief, each topic should cover: the concept in plain English; why it matters; how
it works; key terminology; commands (purpose, syntax, important options, examples, common
mistakes); compare/contrast against the things it is confused with; a realistic scenario; common
traps; what the exam may reasonably test; and a knowledge check.

Two things I care about:

- **Teach the distinction, not the definition.** The dataset's descriptions already do this
  ("monitoring observes; alerting interrupts"; "pull can surprise you, fetch cannot"). Carry that
  voice through.
- **`confused_with` is the spine of the comparisons.** It is an id graph and it is directed —
  treat it as undirected, or you will miss the concepts that are only ever the *target* of a pair.

## Constraints

- Everything in `research/` and `coverage-matrix.md` is **generated** from `data/`. Never hand-edit
  them. The two exceptions say so at the top of the file.
- `npm test` (49 tests) and `npm run validate` (18 checks) must stay green. If cycle 2 changes
  `data/`, the validator enforces derived `importance`, `objective_verbatim`, competency existence,
  enums, link integrity and independent sourcing.
- **No exam dumps.** Cycle 1 logged a braindump exclusion list in `PROGRESS.md`; keep excluding
  them and keep logging exclusions.
- LFS200 is copyrighted. Cycle 1 recorded paraphrased structure only and reproduced no course
  prose. Hold that line.

## Known gaps to respect rather than paper over

- **57 concepts have no primary-documentation citation**, listed by name in
  `data/sourcing-waivers.json` — 40 of them in Project Management, because PMBOK/BABOK/ISO are
  paywalled. Cycle 1's reviewer flagged that **question generation over these has no source to
  check answers against**. That is a cycle 3 problem, but the study guide should be careful where
  it is writing without a citable source.
- **No public post-2025 candidate evidence exists.** `candidate_evidence` is empty on all 537
  concepts, truthfully. Do not fill it with speculation.
- `cloud.networking.*` uses AWS vocabulary (security group vs network ACL, internet gateway,
  elastic IP) as though vendor-neutral. Azure NSGs are stateful with no NACL counterpart. The exam
  is vendor-neutral; the study guide should either generalise these or name the vendor mapping.
- Two concepts have descriptions too thin to build a topic from: `sysadmin.system-administration.home`
  and `devops.git-concepts.push`.
- The `inferred-ratio` validator warning fires permanently at 100% against a 60% threshold. That is
  true by construction — the Linux Foundation publishes nothing below competency level — but the
  check should probably be re-thresholded or renamed rather than left as one that can only say yes.

## How I want you to work

Same process as cycle 1, which worked well: **brainstorm the design first, write a spec, then an
implementation plan, then execute it with a fresh subagent per task and a review after each.** I
authorised parallel research agents and multi-agent workflows in cycle 1 and that authorisation
stands.

Cycle 1's per-task reviews caught real defects, and the final whole-branch review caught a Critical
one plus a place where I had overstated my own results. Keep that adversarial pressure on — I would
rather be told something is wrong than be handed something that reads well.
