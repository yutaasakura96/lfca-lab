# Cycle 3 continuation prompt

Paste the block below into a fresh session started in this repository.

---

I am resuming **cycle 3 of my LFCA study system: the question bank**. It is roughly two-thirds
done. Do not restart it and do not re-plan it — read what exists and continue from Task 36.

## Read these first, in this order

1. `.superpowers/sdd/progress.md` — the execution ledger. **Its "Task N: complete" lines are
   authoritative.** Never re-dispatch a task it marks complete. It also carries a "Minor findings
   carried to the final whole-branch review" list that Task 60 must consume.
2. `docs/superpowers/plans/2026-08-11-lfca-question-bank.md` — the 60-task implementation plan,
   including the normative **Verification Task Protocol** that Tasks 36–57 follow.
3. `docs/superpowers/specs/2026-08-11-lfca-question-bank-design.md` — the design, including the
   amendment recording that the exam is 60 questions.
4. `docs/verification/qbank-findings.md` — the pilot notes. Findings 1–7 plus 5a and 5b each cost
   a rework cycle during authoring.

## Verified state as of the handoff

Branch `cycle-3-question-bank`, HEAD `2a89355`. All numbers below were measured, not recalled.

| | |
| --- | --- |
| Question bank | **22 files, 1,150 items** — exam pool exactly 1000, supplement exactly 150 |
| Coverage | all **537** concepts |
| `npm test` | 307/307 |
| `npm run validate` | 537 concepts, 0 errors, 16 expected warnings |
| `npm run check-guide` | 0 errors, 0 warnings |
| `npm run check-bank` | 1,151 errors — **exactly** 1,150 `q-verdict-coverage` + 1 `q-answer-position-balance`, 0 warnings |
| Waived concepts | 22 (down from 52) |
| Registered sources | 312 (up from 282) |

Those 1,151 errors are the two gates that are *supposed* to be red: verification has not run, and
the exams have not been built. Nothing else is outstanding.

**Tasks 1–35 are complete.** Pre-work, all nine tooling tasks, the pilot, and all 22 competency
question files.

## What remains

- **Tasks 36–57** — verify all 22 competencies, one agent per competency, following the
  Verification Task Protocol. This is the bulk of the work.
- **Task 58** — `npm run build-exams`, then the unscoped `check-bank` must reach 0 errors and
  0 warnings.
- **Task 59** — close the cycle in `PROGRESS.md`, write `questions/README.md`, update the root
  `README.md`.
- **Task 60** — the seven-lens adversarial whole-branch review.

## Four things that changed the original brief — do not undo them

1. **The exam is 60 questions.** Pre-work re-fetched the Linux Foundation's Multiple Choice Exams:
   Important Instructions page, which states it. Cycles 1 and 2 both recorded that no count was
   published and dismissed the circulating figure of 60 as noise; it was right. Captured at
   `docs/verification/exam-facts-2026-08-11/`. **Practice exams are therefore sixteen 60-question
   papers**, not ten 100-question ones — 90 seconds a question, 45 of 60 to pass.
2. **`importance` is degenerate and is not used.** It is a bijection with domain (constant within
   every domain), so question count is driven by domain weight and `required_depth` only.
3. **The waived list went 52 → 22.** The recorded rationale — paywalled PMBOK and BABOK — was the
   real reason for almost none of them.
4. **Sixteen exams consume 960 of the 1,000-item exam pool; 40 items appear on no paper.** That is
   by construction, not a bug: 60 does not divide the weight table evenly. `build-exams` lists
   those 40 by id in `exams/index.json`.

## The hazard that dominated the authoring phase, and will recur

Authors were told to fix an answer-length bias by lengthening distractors. **Mechanical compliance
produced a new giveaway every time**, in four distinct forms across six files: rotated template
tails describing a distractor's role; a keys-0%/distractors-81% two-sentence gap; distractors that
announced their own wrongness ("…which the guide corrects directly by…"); and raw concept
descriptions dumped mid-sentence about unrelated subjects.

**None of it was visible to any of the 21 checks.** Check 17 compares stems, not options, and
pairwise distractor similarity measured zero pairs above 0.70 every time because the boilerplate
sat on genuinely varied content. It was found by two ad-hoc scans — one for six-token tails reused
three or more times, one comparing the two-sentence rate of keys against distractors.

The bank is currently clean on both. **Re-run those scans after any task that edits option text**,
and treat "a distractor must be indistinguishable from the key on every axis except truth" as the
governing rule. Adding a distractor-shape check is a live recommendation for cycle 4.

## How to work

Use **superpowers:subagent-driven-development**. Fresh subagent per task, controller verifies,
**batch five or six at a time** — larger fan-outs have repeatedly died on the session usage limit.

Four process rules earned the hard way in this cycle:

- **Have authoring and verification agents write files but not commit.** Parallel agents editing
  separate files do not conflict; parallel `git commit` calls do. Commit each wave centrally.
- **Verify against the filesystem, not against reports.** Two agents reported work as "running in
  the background" having written nothing; one agent was killed mid-task and its file looked
  complete; and the controller once reported a file "landed clean" purely from seeing it exist.
  An agent's report describes intent; only the artifact describes reality.
- **A task that did not run is not a task that found nothing.** Record unrun and partial work as
  such, naming what was not reached. Cycle 1 lost eight findings to that conflation.
- **Adjudicate findings before applying them.** In this cycle, three refutations read as factual
  errors and were attribution failures; applied literally, one would have replaced a correct
  hypervisor example with a narrower one purely to satisfy a citation.

## Verification specifics for Tasks 36–57

Each task takes one competency, is dispatched to a **different agent than the one that authored
it**, and is instructed to refute. Per item it answers three questions: is the key actually
correct against the cited primary source; **is any distractor also correct** (the killer defect);
and does each distractor's `why` state a true fact. Uncertain resolves to `refuted`, never to
`confirmed`.

The verdict is written into the item's own `verification` field — not a side file — because cycle 1
lost the pairing between claims and verdicts when they lived apart. `q-verdict-coverage` then makes
an unverified item a build failure rather than an omission somebody has to notice.

Two constraints carried from pre-work:

- **Do not write or accept any item that turns on a PCI DSS requirement number.** The standard text
  sits behind a licence gate that refused every automated access attempt, so the guide's citations
  of 3.3.1, 3.3.3, 3.5.1 and 11.3.2 have never been checked. Recorded as unverified.
- **A source cited for content it does not contain is a systemic defect in this project** — seven
  confirmed instances across two cycles, four found in a single pass over eight of twenty-two
  files. If an item cites a source, check the source actually says it.

## Constraints that still bind

- `npm test`, `npm run validate` and `npm run check-guide` stay green at every task boundary.
- `research/**` and `coverage-matrix.md` are generated — never hand-edit. `exams/**` and `drills/**`
  will be too, once built.
- No exam dumps. The cycle-1 exclusion list stands; log any new site on sight, unopened.
- LFS200 is copyrighted; reproduce no course prose.
- Commit style: subject line only, `<type>: <short imperative>`. No heredocs, no `Co-Authored-By`.

Be concise in conversation. No emojis. I would rather be told something is wrong than handed
something that reads well.
