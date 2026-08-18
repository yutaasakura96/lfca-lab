# Cycle 3 continuation prompt — verification wave D, batch 3

Paste the block below into a fresh session started in this repository.

---

I am resuming **cycle 3 of my LFCA study system: the question bank**. Verification is 73% done.
Do not restart it, do not re-plan it, and do not re-verify anything already verified — read what
exists and continue from Task 56.

## Read these first, in this order

1. `.superpowers/sdd/progress.md` — the execution ledger. **Its "Task N: complete" lines are
   authoritative.** Never re-dispatch a task it marks complete. Read the wave A/B/C/D entries at
   the end in full; they carry the hazards below in detail.
2. `docs/superpowers/plans/2026-08-11-lfca-question-bank.md` lines 192–248 — the normative
   **Verification Task Protocol** that Tasks 36–57 follow.
3. `docs/verification/qbank-findings.md` — 35+ appended findings sections from waves A–D.

## Verified state as of the handoff

Branch `cycle-3-question-bank`, HEAD `dfdf948`, working tree clean.
Every number below was measured, not recalled.

| | |
| --- | --- |
| Question bank | 22 files, 1,150 items (exam pool 1000, supplement 150) |
| **Verified** | **839 / 1,150 confirmed (73%), 20 of 22 competencies** |
| `npm test` | 307/307 |
| `npm run validate` | 537 concepts, 0 errors, **15 warnings** (9 orphan-source + 6 inferred-ratio) |
| `npm run check-guide` | 0 errors, 0 warnings |
| `npm run check-bank` | 312 errors — exactly 311 `q-verdict-coverage` + 1 `q-answer-position-balance`, 0 warnings |
| Registered sources | 559 |

The 312 errors are the two gates that are *supposed* to be red until Tasks 57 and 58 finish.

## What remains

- **Task 56** — `questions/02-system-administration/system-administration.json`, **128 items**, unverified.
- **Task 57** — `questions/02-system-administration/networking.json`, **183 items**, unverified.
- **A corpus-wide shape pass** (see the em-dash hazard below) — must run after the verdicts are in
  and **before** Task 58.
- **A `data/` cleanup task** — the source-propagation root cause, 9 duplicate-URL id pairs, and the
  waiver reductions found but deliberately not applied (see below).
- **Task 58** — `npm run build-exams`, then unscoped `check-bank` must reach 0 errors / 0 warnings.
- **Task 59** — close the cycle in `PROGRESS.md`, write `questions/README.md`, update root `README.md`.
- **Task 60** — the seven-lens adversarial whole-branch review.

## Dispatch plan for Tasks 56 and 57 (concept ranges precomputed)

Both files exceed one agent's budget. Split by concept range, one agent per range, **a distinct
`agent_label` per range**. Ranges are array-index ranges, 1-based, chosen at concept boundaries.

**Task 56 — system-administration.json, 128 items, 5 agents**

| Label | Items | First → last concept |
| --- | --- | --- |
| `verify-sysadmin-a` | 1–27 | `user-account` → `umask` |
| `verify-sysadmin-b` | 28–54 | `suid` → `service` |
| `verify-sysadmin-c` | 55–81 | `systemd` → `var` |
| `verify-sysadmin-d` | 82–105 | `home` → `lvm` |
| `verify-sysadmin-e` | 106–128 | `raid-levels` → `kernel` |

**Task 57 — networking.json, 183 items, 7 agents**

| Label | Items | First → last concept |
| --- | --- | --- |
| `verify-sysnet-a` | 1–28 | `osi-model` → `private-vs-public-ip-addresses` |
| `verify-sysnet-b` | 29–56 | `loopback-address` → `routing-table` |
| `verify-sysnet-c` | 57–82 | `router-vs-switch` → `etc-resolv-conf` |
| `verify-sysnet-d` | 83–104 | `dns-record-types` → `dhcp-reservation` |
| `verify-sysnet-e` | 105–130 | `tcp-vs-udp` → `ssh` |
| `verify-sysnet-f` | 131–154 | `proxy` → `open-closed-and-filtered-ports` |
| `verify-sysnet-g` | 155–183 | `ping-and-icmp` → `network-interface-naming` |

Dispatch **five or six at a time**; larger fan-outs have repeatedly died on the session usage limit.
Budget from measurement: waves A–D averaged **~6,000 subagent tokens per item**, so 311 items is
roughly **1.9M subagent tokens** across ~12 agents.

## The finding that this cycle exists to have produced

**The bank's content is largely sound; its sourcing is not.** Of 839 verified items roughly 500
were refuted, and the overwhelming majority were **citation defects — the claim true, the cited
source silent on it**. Whole competencies produced no wrong key at all. Task 59 should lead with
this sentence, and Task 60 should test it rather than assume it.

Only a handful of genuinely wrong keys were found in 839 items, and **two of them had a correct
distractor**: `tar cfz logs.tar.gz` (keyed as producing a file named `z`; false for traditional
no-hyphen style) and `cp -r` on a symlink (GNU coreutils copies the link, so the distractor worked).

## Hazards that will recur — all confirmed, all measured

1. **The root cause is in `data/`, confirmed four times.** Every item's `source_ids` is a verbatim
   copy of its concept's `official_sources + additional_sources` in `data/topics/*.json`. One wrong
   source propagates to every item on that concept. **Fix at concept level**, in
   `data/topics/02-system-administration.json`, not item by item.
2. **"200 OK and no content" is a source class.** Controller-verified: `csrc.nist.gov/glossary`
   returns 7,314 visible chars and **zero definitions**; `glossary.cncf.io/` 4,174 chars and zero;
   `cve.org/About/Overview` is an 880-byte Vue shell; `vmware-hypervisor` serves only a meta
   description. The *term* pages work. **Assert content, never a 200.** ~41 items still cite one of
   these; they are an enumerable cleanup list.
3. **Man pages are the specific trap for both remaining files.** Confirmed misses: `man-df` cited
   for deleted-but-open files (that is unlink(2)); `man-systemctl` for a `Result:` field only
   systemd.service(5) documents; `man-resolv-conf` for systemd-resolved and `127.0.0.53`;
   `man-lscpu-1` for `nproc`; `man-free-1` for the OOM killer. **A man page for the right tool is
   not automatically a source for the claim.**
4. **`verdict: "refuted"` must never be shipped.** Check 21 rejects it: *"a refuted item must be
   rewritten and re-verified, not shipped."* It means "still broken at end of task", not "I found a
   defect". Two agents recorded the pre-repair verdict on 41 items and had to be resumed. Workflow:
   refute → rewrite → re-check → record `confirmed`, history preserved in `reasoning` behind a
   `REFUTED AS AUTHORED.` marker.
5. **`system-administration.json` carries the largest known concentration of self-refuting
   distractors** — an option carrying its own `why`, so it announces its wrongness. A strict
   text-vs-`why` overlap measure gives **54 of 384 distractors**; treat that as a **floor**.
   **Do not scan for this with n-gram overlap** — it catches only the verbatim paste and
   under-counted by a third elsewhere. The reliable signal is a **trailing subordinate clause
   (`when` / `though` / `which` / "is assumed to" / "on the assumption that") that reverses the
   claim the option just made**.
   Two side effects, both observed: stripping the padding **exposes length cues it was masking**
   (once flipping key-is-longest from 7% to 67%), and **strips distractor em-dashes**, which can
   open the shape gap in the wrong direction. Re-run both scans *after* stripping, not before.
   Repair by extending distractors with real false clauses; **never truncate a key**.
6. **A corpus-wide shape tell is still live and needs its own pass before Task 58.** In 19 of 22
   files the KEY is far likelier than a distractor to end in a trailing em-dash qualifying clause —
   project-management 76%/22%, performance-availability 82%/30%, sysadmin best-practices 67%/33%.
   **Pick the option with the em dash and you are right most of the time, bank-wide.** The
   two-clause scan every brief used tests for a *sentence break* and is blind to it. The two files
   you are about to verify measure **networking keys 47% / distractors 14%** and
   **system-administration keys 34% / distractors 23%** — tell the agents not to worsen them; the
   dedicated by-rule pass fixes them afterwards.
   Checked and dismissed: a second suspected tell (multi-clause with no sentence-final punctuation)
   measures keys 6% / distractors 7% — real construction, **no asymmetry**, not a leak.
7. **Prior verification artifacts are a confirmed error source, not assurance.** Three
   `factcheck-*.json` claims have been caught certifying falsehoods, and two demonstrably seeded
   defects into both the items and the study guide: `factcheck-cloud-networking.json` claim 017 (a
   vendor rename), and `factcheck-command-line.json` CL-039 (GNU regex extensions asserted as
   POSIX) and CL-049 (tar's last-in-cluster option rule stated unconditionally). **Verify
   independently even when a factcheck entry agrees.**
8. **Guide prose has produced two distinct defect classes.** *True but misreadable* — six
   instances, typically a compressed reference cell naming a source then stating a rule (GDPR
   Art 4(1) "directly", GDPR Art 6(1) and consent validity, a self-contradicting `fetch-vs-pull`
   entry). And *outright wrong* — two instances, both in Command Line (crontab tilde expansion;
   tar option order, inherited from CL-049). When you fix an item, ask where the author got it.
9. **Empirical verification is now part of the toolkit and settled three items no document could**:
   `sed -i` on this host, `tar cfz` vs `tar -cfz` in an `ubuntu:24.04` container, `cp -r` on a
   symlink. Where a manual is silent on a default, running it is the primary source. **Networking
   is full of claims you can test locally** (`ss`, `ip`, `ping`, `dig`, loopback behaviour,
   `/etc/hosts` precedence) — use it, and record the command and output in the item's `reasoning`.
10. **Two bodies of unverifiable claims survive in the guide and must not be left looking
    verified**: the PCI DSS requirement numbers (3.3.1, 3.3.3, 3.5.1, 11.3.2 — licence-gated, never
    checked) and the Verizon DBIR figures (31%/16%/13% at `study-guide/04-security/security.md`
    lines 863, 865, 1114–1115, 1148 — the source is unretrievable: the registered `.pdf` returns
    200 `text/html`, other PDF paths return `content-length: 0`, and the Wayback capture is the
    HTML too). Both are **unverifiable, not disproven**. Task 59 must name both explicitly.
11. **No item may turn on a PCI DSS requirement number — in digits OR paraphrased.** A numeric scan
    is insufficient: a compliance item passed a requirement-number regex with zero hits while
    turning on licence-gated requirement text laundered into plain English.

## Process rules earned the hard way — all of these cost something

- **Agents write files; they never commit.** Parallel agents editing separate ranges do not
  conflict; parallel `git commit` calls do. Commit each wave centrally.
- **Forbid `git stash` by name** in every brief, alongside `git checkout`, `git restore`,
  `git clean`. One agent ran `git stash`/`pop` on the shared tree while four others were mid-write.
  It restored cleanly, but that single command could have destroyed all their uncommitted work.
  For a baseline, `git show HEAD:<path> > /tmp/...` mutates nothing.
- **Verify against the filesystem, not against reports — and check verdict VALUE, not just
  presence.** The controller's own check missed 41 items sitting at `refuted` because it validated
  that a verdict existed, not what it said. A parallel agent caught it.
- **"Wrote nothing" is not "dead".** After the host slept, an agent sent no notification and had
  written nothing; it was *suspended*, not dead, and woke up 103 minutes later. A replacement had
  already been dispatched **under the same label**, and both were briefly live on the same JSON
  array. Nothing was lost only because the replacement detected the file changing under it and
  refused to write a byte. **Check liveness before re-dispatching, and never reuse an
  `agent_label`.**
- **Tell agents to fetch with `curl` through Bash, not `WebFetch`.** Five agents died mid-task on
  WebFetch having written nothing; twenty-plus have completed on the curl path.
  `curl -sL --max-time 30 "<url>" -o /tmp/task<N>-<name>.html`, then grep the local file.
- **Tell agents to write verdicts to disk in batches of 5–8 items.** What is written survives a
  death; what is held in memory does not.
- **Mid-wave gate readings are not the wave's gate.** `validate` has read as high as 31 warnings
  from parallel agents' not-yet-wired sources and settled at 15 every time.
- **Unreachable is not disproven.** `gnu.org` was down for an entire batch. Nothing was refuted for
  it and nothing confirmed from memory; claims were re-verified against man7.org and POSIX, with
  the substitution named in each item's `reasoning`. Check reachability before blaming an agent.
- **Adjudicate before applying.** Several refutations that read as factual errors were attribution
  failures. The normative precedent is Task 3's `hypervisor`: **fix the citation, do not weaken
  correct content to match a source.** Also watch for the inverse — re-citing a `ping` item to
  ping(8) would have *looked* like a fix, but ping(8) never says ICMP is commonly filtered.
  **Fixing a citation to something plausible-but-silent is the same defect in a new coat.**
- **Do not manufacture a false refutation.** An agent nearly recorded a claim as unsourced from
  reading one section of a NIST PDF when the stem's wording was verbatim in a later chapter.
  Search the whole document before declaring absence.

## Deferred decisions the owner has not yet ruled on

These were found and deliberately **not** applied, because each touches `sourcing-waivers.json`,
`waived_source` flags and the bank-wide validate warning count:

- **SWEBOK Guide v3.0 is free** and settles two waived concepts (`requirements-elicitation`,
  `non-functional-requirements`).
- **`nasa-se-handbook-sp-2016-6105`** — already registered, live, tier 2 — settles **six** waived
  PM concepts verbatim (project, stakeholder, critical path with float, Gantt chart, a §6.2
  "Requirements Creep" passage covering both `scope-creep` items, and a §3.9 Phase F passage
  establishing that closeout may begin from unplanned events). Would take that competency's waiver
  list from 13 to 6.
- **Four PM concepts are genuinely unsourceable** and now say so inside their items'
  `verification.reasoning`: `triple-constraint`, `raci`, `project-budget-and-resource-management`,
  `communication-plan`.
- **Two non-waived concepts are functionally undeclared waivers**:
  `pm.project-management.acceptance-criteria` cites the 2020 Scrum Guide, which never uses the
  phrase "acceptance criteria"; `pm.project-management.estimation-and-velocity` cites it too, and it
  never uses the word "velocity".
- **`feasibility-study` and `gap-analysis` both carry empty `confused_with`** while the guide runs
  the discrimination three times. Adding the edge creates a comparison-block obligation.
- **9 duplicate-URL source id pairs** in `data/sources.json` (`rfc-6335`/
  `rfc-6335-port-number-procedures`, `man-uptime-1`/`man-uptime`, `fhs-3.0`/`fhs-3-0`,
  `lf-about`/`linux-foundation-about`, `man-path-resolution-7`/`man-path-resolution`,
  `iproute2-ss-man`/`man-ss`, `rfc-9110-http-semantics`/`rfc9110`, `aws-reserved-instances`/
  `aws-ec2-reserved-instances`, `docker-container-start`/`docker-cli-start`).

## Constraints that still bind

- `npm test`, `npm run validate` and `npm run check-guide` stay green at every task boundary.
  Validate's baseline is now **15 warnings**, not 16.
- The exam is **60 questions**; practice exams are **sixteen 60-question papers**, 90 seconds a
  question, 45 of 60 to pass. 16 exams consume 960 of the 1,000-item pool; **40 items appear on no
  paper** by construction and are listed by id in `exams/index.json`.
- `importance` is degenerate (a bijection with domain) and is not used.
- `research/**` and `coverage-matrix.md` are generated — never hand-edit; `exams/**` and `drills/**`
  will be too. Running `npm run generate` is correct.
- **All 1,150 keys sit at option index 0 BY DESIGN** — `orderedOptions` in `tools/lib/assemble.mjs`
  places the key from `assignPositions` for exams and drills, so the bank deliberately carries no
  positional bias. Do not "fix" it.
- No exam dumps. LFS200 is copyrighted; reproduce no course prose.
- Commit style: subject line only, `<type>: <short imperative>`. No heredocs, no `Co-Authored-By`.
- `.superpowers/sdd/` is gitignored with a single `*`; `progress.md` is tracked only because it was
  force-added. Any new artifact there needs `git add -f`.

Be concise in conversation. No emojis. I would rather be told something is wrong than handed
something that reads well.
