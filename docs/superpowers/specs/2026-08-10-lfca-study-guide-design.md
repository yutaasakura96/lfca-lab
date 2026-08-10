# LFCA Study Guide — Design

**Date:** 2026-08-10
**Status:** Approved (design)
**Cycle:** 2 of 4
**Branch:** `cycle-2-study-guide`
**Predecessor:** `docs/superpowers/specs/2026-08-09-lfca-research-foundation-design.md`

---

## Context

Cycle 1 produced a verified dataset: 537 leaf concepts across 22 official competencies, each
carrying a description, `required_depth`, derived `importance`, commands, a `confused_with`
graph, LFS200 `coverage_status`, sources, and notes that frequently name the exam trap. It is
validated by 18 checks and 49 tests, and `research/` plus `coverage-matrix.md` are generated
views over it.

Cycle 2 turns that dataset into prose the repository owner can study from. It does not redo
cycle 1's research. It reads what cycle 1 produced and writes on top of it.

**The reader.** The repository owner sat the LFCA and scored 71% against a 75% pass mark. The
stated need is complete coverage rather than triage: every concept taught, not only the known
weak spots. Networking (DNS, TCP/IP, ports) and containers (Docker, Kubernetes) receive extra
care, explicitly not at the expense of breadth.

**Facts inherited from cycle 1 and not re-derived.** Current exam effective 2025-09-16.
Weights Linux 16 / SysAdmin 30 / Cloud 18 / Security 14 / DevOps 12 / PM 10. 90 minutes,
multiple choice, 75% to pass, no practical component. Question count is not published by the
Linux Foundation and is not invented here. Six competencies are new in 2025 and no older
material covers them. LFS200 is still built on the retired syllabus; six competencies have no
lesson at all.

---

## What this cycle produces

A `study-guide/` tree of hand-written prose, plus a machine harness that proves the prose
covers the dataset. Explicitly **not** in scope: practice questions and practice exams
(cycle 3), the interactive simulator (cycle 4).

---

## Layout

```
study-guide/
  README.md                                  entry point, study order, what the guide claims
  01-linux-fundamentals.md                   domain index
  01-linux-fundamentals/
    linux-operating-system.md                27 concepts
    command-line.md                          39
  02-system-administration.md
  02-system-administration/
    system-administration.md                 71
    best-practices.md                        20
    networking.md                            49
    troubleshooting.md                       15
    disaster-recovery.md                     18
  03-cloud-computing.md
  03-cloud-computing/
    cloud-computing.md                       23
    performance-availability.md              17
    budgeting.md                             13
    best-practices.md                        15
    networking.md                            14
  04-security.md
  04-security/
    security.md                              38
    sensitive-data.md                        13
    compliance.md                            14
  05-devops.md
  05-devops/
    devops-basics.md                         25
    git-concepts.md                          22
    containers.md                            24
  06-it-project-management.md
  06-it-project-management/
    project-management.md                    29
    software-application-architecture.md     17
    functional-analysis.md                   12
    open-source-software-and-licensing.md    22
  appendix-a-packet-life.md
  appendix-b-container-to-cluster.md
```

Six domain files + 22 competency files + 2 appendices + a README = 31 documents.

"Best Practices" and "Networking" each name two different competencies in two different
domains. The directory keeps them distinct, matching cycle 1's `Domain :: Competency` key.

**Why not one file per domain, as originally requested.** System Administration is 173
concepts; at the template below it is roughly 90,000 words in a single file. That is not
editable, not reviewable, and not writable coherently by one agent. The domain file survives
as a real document — overview, weight, LFS200 gap, section map, study order, links — and the
topics live one level down.

### Domain index file

Each `NN-<domain>.md` contains: the domain's exam weight and what that means in study hours;
which of its competencies are new in 2025; the LFS200 coverage position for the domain, taken
from cycle 1's findings; a section map linking every competency file and every `path[2]`
section within it; a recommended study order; and the domain's confusable sets with links to
their canonical comparisons.

---

## Topic anatomy

`required_depth` drives treatment. Distribution: L1 39, L2 156, L3 321, L4 15, L5 6.

| Depth | n | Treatment | Target |
| ---: | ---: | --- | ---: |
| 1 Recognition | 39 | One row in the section's Quick reference table | ~40 w |
| 2 Understanding | 156 | What it is · Why it matters · How it works · Key terms · the distinction | ~200 w |
| 3 Application | 321 | + Commands · Traps · What the exam may test | ~450 w |
| 4 Troubleshooting | 15 | + Symptoms and diagnostic order | ~650 w |
| 5 Administration | 6 | + Syntax worth memorising | ~800 w |

Estimated total, including section apparatus: **170,000–200,000 words**. The largest file,
System Administration :: System Administration, is roughly 30,000 words. The depth targets are
the single dial if the deliverable needs to be smaller.

### Voice

**Teach the distinction, not the definition.** The dataset already writes this way —
"monitoring observes; alerting interrupts" — and the guide carries that voice. A topic that
only defines its term has failed, because a multiple-choice exam tests discrimination between
plausible options, not recall of a definition. Every topic should leave the reader able to say
what the concept is *not*.

The `notes` field frequently names the exam trap outright. It is a primary input to the Traps
and What-the-exam-may-test sections, not decoration.

### Section apparatus

Scenario and knowledge check are written once per `path[2]` section — 100 sections across the
corpus — covering that section's sibling concepts together. One worked DNS-resolution scenario
serves eight sibling concepts better than eight near-identical ones.

**Knowledge checks are recall and discrimination prompts with answers, never multiple choice.**
Three to six per section: "state the difference between X and Y", "which command shows Z and
why not W", "you observe symptom S — what do you check first, and what would each outcome rule
out". Multiple-choice item generation, distractor balance and duplicate detection are cycle 3's
designed job and are not pre-empted here.

---

## Marker grammar

The guide is hand-written but machine-verified. Every claim the harness checks needs an
unambiguous anchor, so definition sites use a fixed grammar. All markers are matched at line
start, so prose mentions cannot produce false positives.

**Definition site, depth ≥ 2:**

```markdown
<a id="c-sysadmin.networking.subnet-mask-and-cidr"></a>
### Subnet mask and CIDR
*id: `sysadmin.networking.subnet-mask-and-cidr` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: rfc-4632-cidr, rfc-791-internet-protocol*
```

**Definition site, depth 1** — a row under a `#### Quick reference` heading whose first cell is
exactly the backticked concept id:

```markdown
| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.oss-licensing.agpl` | AGPL | ... | ... |
```

**Canonical comparison block**, anchored on its owning concept:

```markdown
<a id="cmp-sysadmin.system-administration.sgid"></a>
#### Not to be confused with: SGID vs SUID vs sticky bit
*compares: `sysadmin.system-administration.sgid`, `sysadmin.system-administration.suid`, `sysadmin.system-administration.sticky-bit`*
```

**Pointer from a non-owning member:**

```markdown
*Not to be confused with [SGID](system-administration.md#cmp-sysadmin.system-administration.sgid).*
```

Explicit HTML anchors — rather than heading-derived slugs — make every link target
deterministic and stable under rewording, and let a writer link to a file that has not been
written yet.

**Body labels**, matched at line start within a concept's block (from its `<a id="c-…">` to the
next anchor or heading of equal or higher level):

| Label | Required at depth |
| --- | --- |
| `**What it is**` | 2+ |
| `**Why it matters**` | 2+ |
| `**How it works**` | 2+ |
| `**Key terms**` | 2+ |
| `**Commands**` | 3+, only where the concept has a non-empty `commands` array |
| `**Traps**` | 3+ |
| `**What the exam may test**` | 3+ |
| `**Symptoms and diagnostic order**` | 4+ |
| `**Syntax worth memorising**` | 5 |

**Commands block** is a table: Command · Purpose · Key options · Example · Common mistake.
Every string in the concept's `commands` array must appear verbatim inside a code span or code
fence within that concept's block.

**Waived-source marker**, required in the block of each of the 57 concepts named in
`data/sourcing-waivers.json`:

```markdown
*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*
```

---

## Comparisons: the `confused_with` spine

`confused_with` is a **directed** id graph and must be treated as **undirected**. Reading only
outgoing edges misses every concept that is solely the target of a pair — cycle 1's stage-7
defect, which left `authentication-vs-authorization`, `cia-triad`, `tls-and-https` and
`principle-of-least-privilege` unlifted.

Measured on the current dataset: 208 directed edges, 0 dangling, deduplicating to **156 unique
undirected edges** over **251 concepts**. 208 concepts have an outgoing edge; **43 are
target-only** and would be missed by a directed reading.

**The unit of comparison is the edge, not the connected component.** An earlier draft of this
design grouped one comparison per connected component, and checking it against the data showed
that to be wrong. Only 63 of the 95 components are cliques. The largest, 12 members spanning
Cloud Computing and Containers, is a *chain* — cloud computing → virtualization → container →
image → registry, with pod, deployment and service hanging off it. It is eleven distinct
pairwise comparisons, not one twelve-way table, and rendering it as a single block would
produce a table that teaches nothing.

**Deterministic edge-to-block assignment.** Each of the 156 edges is assigned to the endpoint
that wins this rule:

1. a leaf id containing `-vs-` wins — the dataset already names 36 concepts *as* comparisons
   (`container-vs-virtual-machine`), and those are the natural home;
2. else highest `importance`;
3. else highest `required_depth`;
4. else lowest id, lexicographically.

All edges assigned to the same owner become one block whose `compares:` list is the owner plus
its assigned neighbours. This yields **129 blocks**: 105 pairs, 23 of three, one of six
(`backup` against archiving, RAID, snapshot, replication and version control — a genuinely
useful five-way table). Every edge is covered exactly once by construction; the 43 target-only
concepts are covered because the graph is read undirected.

19 blocks name a member outside the owner's file, including nine crossing a domain boundary.
The block lives with its owner and the other file links across.

Because the assignment is computed from `data/` by a shared library, writers and the checker
cannot disagree about who owns what. `npm run guide-plan` hands each writer its exact block
list; `check-guide` verifies the guide's blocks match the computed assignment exactly.

---

## Tooling

Two new scripts. `tools/validate.mjs` and its 18 data checks are **not** modified — they check
`data/`, and the guide is a separate artifact with separate invariants.

### `tools/check-guide.mjs` — `npm run check-guide`

Exits non-zero on any error.

| # | Check | Severity | What it proves |
| ---: | --- | --- | --- |
| 1 | `guide-missing-concept` | error | Every one of 537 ids has a definition site. **This is the coverage proof.** |
| 2 | `guide-duplicate-definition` | error | No id is defined in two places |
| 3 | `guide-unknown-concept` | error | No definition site names an id absent from `data/` |
| 4 | `guide-comparison-coverage` | error | All 156 undirected edges are covered, each by exactly one block |
| 5 | `guide-comparison-membership` | error | Every block's `compares:` list equals its computed assignment, in full |
| 6 | `guide-comparison-pointer` | error | Every non-owning member links to the block that covers its edge |
| 7 | `guide-command-coverage` | error | Every string in `commands` appears verbatim in its concept's block |
| 8 | `guide-section-apparatus` | error | Every section containing a definition site has a Scenario and a Knowledge check |
| 9 | `guide-depth-treatment` | error | Depth-appropriate body labels are present |
| 10 | `guide-waiver-marker` | error | All 57 waived concepts carry the no-primary-source marker |
| 11 | `guide-metadata-accuracy` | error | Metadata line matches `data/` on depth, importance, coverage_status |
| 12 | `guide-dangling-xref` | error | Every relative link resolves to a real file, and every `#anchor` to a defined anchor |
| 13 | `guide-source-ids` | error | Source ids on a metadata line exist in `data/sources.json` |
| 14 | `guide-vendor-neutrality` | warn | `cloud.networking.*` topics using AWS-only vocabulary without the vendor mapping table |

Checks live in `tools/lib/guide-checks.mjs` with unit tests in `tools/test/guide-checks.test.mjs`,
following cycle 1's structure. Component computation and canonical-owner selection live in
`tools/lib/comparisons.mjs`, shared by the checker and the planner so the two cannot disagree.

### `tools/guide-plan.mjs` — `npm run guide-plan`

Prints a per-competency writing brief from `data/`: concepts with depth, importance, commands,
notes and coverage status, grouped by `path[2]` section; which of the 129 comparison blocks
this file owns and their full membership; which blocks it must link out to and the exact
anchor and relative path. No generated file is committed — the brief is derived on demand, so
it cannot go stale.

---

## Verification

Two layers, because cycle 1 showed that reviews alone miss things and that an adversarial layer
can fail silently.

**Layer 1 — independent review after every writing task**, as in cycle 1. The reviewer reads
the diff against the brief and the dataset.

**Layer 2 — targeted adversarial fact-check** over the two highest-risk classes only. The guide
adds a large volume of claims the dataset does not contain, and these two are where invented
authority is most likely:

- **Every command invocation, option and flag** — 171 concepts, 379 command strings, plus every
  option and example the writer adds. Checked against the man page or official documentation.
- **The 57 waived concepts** — where there is no primary source, so the prose is most likely to
  assert standards authority it cannot support. Checked for hedging and for absence of invented
  citations.

**Recording, and the cycle-1 bug this fixes.** Cycle 1's controller keyed verdicts off a content
hash rather than the agent label, the pairing was lost, and eight findings fell through to
"rejected" with no verdict recorded — which read in the summary exactly like eight confident
refutations. Four of them were genuine errors that survived to the final review.

Cycle 2 records verdicts in `.superpowers/sdd/cycle2-factcheck.json` as
`{claim_id, agent_label, verdict, reasoning, source}`. A claim with no verdict from a named
agent is an **error**, never a pass. The count reported in `PROGRESS.md` is the count of
verdicts actually returned.

---

## Data write-back

Writing prose over the dataset will surface factual errors in it. Cycle 1's final review found
four that had survived every earlier pass.

**When cycle 2 finds one, it fixes `data/`**, re-runs `npm run generate` so `research/` and
`coverage-matrix.md` follow, and records the correction in `PROGRESS.md` with the primary
source that settles it. `research/` and `coverage-matrix.md` are never hand-edited. The
alternative — logging errors for later — would leave the guide silently disagreeing with the
dataset that cycle 3 builds its question bank on.

Two named write-backs are planned rather than discovered:

- **`sysadmin.system-administration.home` and `devops.git-concepts.push`** are too thin to build
  a topic from. They are enriched in `data/` first, then written normally. Neither is skipped.
- **`cloud.networking.*` uses AWS vocabulary as though it were vendor-neutral**, and the exam is
  not AWS-specific. The descriptions are made vendor-neutral in `data/`, and the guide teaches
  the neutral concept with an AWS / Azure / Google Cloud mapping table alongside.

`candidate_evidence` stays empty on all 537 concepts. No public post-2025 candidate evidence
exists; none is invented. No question count is stated.

---

## Weak areas

Networking (49 concepts), Containers (24) and Cloud Networking (14) are written denser in
place — more worked examples, more traps, more scenarios per section — and every other
competency is written to the same standard, so breadth is unaffected.

Two appendices carry what a per-competency structure cannot express:

- **Appendix A, a packet's life** — one narrative from `curl https://example.com` through DNS
  resolution, ARP, routing, the TCP handshake, ports, TLS and firewall traversal, linking each
  step to its concept anchor. The failure mode this addresses is knowing each fact in isolation
  and not the mechanism that joins them.
- **Appendix B, container to cluster** — image, layer, registry, container, pod, deployment,
  service, orchestration, again as one narrative linking to concept anchors.

Both are navigation over existing topics, not a second definition site for any concept —
check 2 enforces that.

---

## Constraints

**Exam security.** No exam dumps, sought or used. The cycle-1 exclusion list stands and any new
site encountered is excluded on sight and logged in `PROGRESS.md`.

**Copyright.** LFS200 is paid, copyrighted material. Cycle 1 recorded paraphrased structure and
reproduced no course prose; cycle 2 holds that line. The guide may state that a lesson covers a
topic and may cite `research/lfs200-notes/00-course-map.md`, and reproduces no course text.

**Green gates.** `npm test` and `npm run validate` stay green throughout. Cycle 2 adds tests; it
does not remove or weaken existing ones. Where cycle 2 edits `data/`, both gates run before the
task is called done.

**Generated files.** `research/**` and `coverage-matrix.md` are generated from `data/` and are
never hand-edited. `research/exam-mechanics.md` and `research/lfs200-notes/00-course-map.md` are
the two hand-written exceptions, as marked in their own headers.

**Honesty about sourcing.** The 57 waived concepts are marked visibly in the prose. A reader
must be able to see, at the point of reading, where the guide is writing without a citable
source.

---

## Definition of done

1. All 537 concepts have exactly one definition site — `check-guide` check 1 and 2 pass.
2. All 156 confusable edges are covered by the 129 computed comparison blocks, each exactly
   once, and every non-owning member points to the block covering its edge.
3. Every section has a scenario and a knowledge check; no knowledge check is multiple choice.
4. Every command string in the dataset appears verbatim in its topic, and has been fact-checked
   against primary documentation with a recorded verdict from a named agent.
5. All 57 waived concepts carry the no-primary-source marker.
6. `npm run check-guide` exits 0.
7. `npm test` and `npm run validate` exit 0.
8. Every `data/` correction is recorded in `PROGRESS.md` with its settling source, and
   `npm run generate` has been re-run.
9. `PROGRESS.md` names every remaining gap honestly, including anything cycle 2 could not
   verify.
10. A final adversarial review of the whole branch has run and its findings are resolved or
    recorded.

---

## Known risks

| Risk | Handling |
| --- | --- |
| 200k words of generated prose reads as filler | Depth-scaled template; section-pooled apparatus; distinction-first voice enforced at review |
| Writers invent command options that do not exist | Check 7 forces the dataset's own strings into the text; layer-2 fact-check covers every option and example |
| Comparisons drift between the two sides | One canonical block per edge, assignment computed from `data/`; checks 4–6 |
| A large confusable chain is rendered as one useless table | Unit is the edge, not the component; max computed block size is 6 |
| A concept is silently skipped | Check 1 is a hard coverage proof over all 537 ids |
| Adversarial layer fails silently again | Verdicts keyed by agent label; a missing verdict is an error, not a pass |
| Guide and dataset diverge | Write-back policy; check 11 pins metadata to `data/` |
| Waived concepts read as authoritative | Check 10 forces a visible marker in the prose |
| Cycle 3 pre-empted | Knowledge checks are non-MCQ by design |
| The two thin concepts get skipped | Named explicitly; enriched in `data/` before writing |
