# Question bank — findings and pilot notes

Authors append findings here rather than fixing `data/` or the guide themselves. A finding is a
report, not an instruction: the verification task for the competency adjudicates it against the
primary source before anything changes.

---

## Pilot notes (Task 14 — System Administration :: Disaster Recovery)

Read these before writing a competency. Five things cost the pilot a rework cycle and are not
obvious from the protocol.

### 1. A depth-1 concept has no `c-` anchor. Use the section anchor.

**This affects 39 concepts across the corpus and would have failed check 13 every time.**

A depth-1 concept's only definition site is one Quick reference table row (`STYLE.md` section 2),
and a table row cannot carry an HTML anchor. So the guide defines `c-<id>` for all 498 depth-2+
concepts and for **none** of the 39 depth-1 ones.

`tools/question-plan.mjs` used to emit `#c-<id>` regardless. It now emits
`#s-<competency-slug>-<section-slug>` for depth-1 concepts and prints a note saying why. Verified:
the derived section anchor resolves for all 39. **Copy whatever the brief gives you** — do not
reconstruct the anchor yourself.

### 2. Suppress three checks on a scoped authoring run, not two.

The Authoring Task Protocol names `q-verdict-coverage` and `q-answer-position-balance`. There is a
third: **`q-domain-distribution`**, which compares the whole bank against the 1,000-item weight
table and cannot pass until all 22 competencies exist. Use:

```bash
npm run check-bank -- --scope "<Domain> :: <Competency>" \
  --except q-verdict-coverage,q-answer-position-balance,q-domain-distribution
```

All three are legitimate here and nowhere else. The unscoped run at Task 58 suppresses nothing.

### 3. `confusable` requires a real `confused_with` edge. Most distractors are `sibling`.

Check 8 verifies that a `confusable` tag corresponds to an actual edge in either direction. The
pilot tripped this three times by reaching for `confusable` whenever two concepts felt related.

The brief tells you exactly which pairs qualify: the lines reading
`confusable distractor source: <id> — <description>`, plus the members listed under any
`OWNS BLOCK` or `member of block` line. **Anything else in the competency is `sibling`.** That is
not a lesser tag — a sibling distractor drawn from the same section is exactly the near-neighbour
an exam uses.

### 4. An option that is nothing but a code span collides with any other such option.

Check 9 normalizes a code span to a single placeholder token, so two options reading exactly
`` `rsync` `` and `` `tar` `` normalize identically and are reported as not being real
alternatives. That is the check working correctly.

Write the command **inside a phrase** — `` `rsync` run nightly against the backup host `` — which
also reads better as an option. The command string still counts for check 5, because the code span
still contains exactly the required string.

### 5. Budget for the length cue. Writing a precise key naturally makes it the longest option.

The pilot's first draft had the key as the longest option in **16 of 30 items (53%)** against a 40%
threshold, and one item at a 1.75 key-to-distractor length ratio against a 1.6 limit. Nothing was
wrong with the keys — a correct answer often needs a qualifier the wrong ones do not.

**Fix by lengthening a distractor, never by truncating the key.** A key trimmed for length is a key
that has lost a qualifier it needed. Check as you go:

```bash
node -e "const b=require('./questions/<dir>/<slug>.json');let n=0;for(const i of b.items){const k=i.options.find(o=>o.correct);if(i.options.filter(o=>!o.correct).every(o=>o.text.length<k.text.length))n++;}console.log(n+'/'+b.items.length)"
```

### 5a. If your competency has fewer than 20 items, the length-cue population rule CANNOT fire.

`LENGTH_CUE_MIN_POPULATION` is 20. A scoped run over a smaller competency checks only the
per-item ratio, never the share — so a file can be 100% key-longest and still report 0 warnings.

**This actually happened.** Functional Analysis (15 items) came in at 67% and Software Application
Architecture (17 items) at 100%, both passing their scoped checks clean. It surfaced only when the
whole bank was measured together, where the corpus share was 46% against a 40% threshold.

Only those two competencies of 22 are allocated under 20 items, but if yours is one of them,
**run the share check by hand** — the harness will not do it for you:

```bash
node -e "const b=require('./questions/<dir>/<slug>.json');let n=0;for(const i of b.items){const k=i.options.find(o=>o.correct);if(i.options.filter(o=>!o.correct).every(o=>o.text.length<k.text.length))n++;}console.log(n+'/'+b.items.length+' = '+Math.round(100*n/b.items.length)+'%')"
```

Aim under 40%. Observed first drafts across the first wave ran 53%, 88%, 89%, 91% and 100% — the
bias is strong and universal, so budget for two rework passes rather than treating it as a
surprise. Lengthen distractors with real qualifying clauses; never truncate a key.

### 5b. Fixing the length tell creates a SHAPE tell unless you match shapes too.

Two files have now had to be repaired because the length fix was applied mechanically and left a
new signature that separates keys from distractors just as reliably as length did.

**Form one — template tails.** One file lengthened 123 of its 150 distractors with 12 rotated
clauses describing the distractor's *role* ("…a neighbouring concept, just one scenario in
front"). The key is then the option that does not read like a footnote.

**Form two — clause count.** Another file came out with **keys 0% two-sentence and distractors
81% two-sentence**. Pick the single-sentence option and you are right almost every time.

Neither is visible to any check. Check 17 compares stems; distractor similarity stayed at zero
pairs above 0.70 in both cases because the boilerplate sat on genuinely varied content.

**The rule: a distractor must be indistinguishable from the key on every axis except truth.** Same
length distribution, same number of sentences, same register, same specificity. When you lengthen
a distractor, give it a real qualifying clause of the kind the key already has — not a second
sentence the key would never carry.

Scan your own file before you finish:

```bash
node -e "
const b=require('./questions/<dir>/<slug>.json');
const two=t=>/[.!?]\\s+\\S/.test(t.trim());
let k=0,kn=0,d=0,dn=0;
for(const i of b.items)for(const o of i.options){if(o.correct){kn++;if(two(o.text))k++;}else{dn++;if(two(o.text))d++;}}
console.log('keys '+Math.round(100*k/kn)+'%  distractors '+Math.round(100*d/dn)+'% two-clause');"
```

Keep the gap under about 15 points.

### 6. A large comparison block wants one item, not one per member.

`cmp-sysadmin.disaster-recovery.backup` is the corpus's only six-member block — backup against
version-control, archiving-and-compression, replication, snapshot and raid-levels. One item on the
**owner** carried it: a scenario where replication propagates a deletion, with replication, RAID
and a misconception as the three distractors.

That exercises the block's actual teaching point in a single item and leaves the other members
free to be tested on their own terms. Writing five comparison items would have produced five
near-duplicates and tripped check 17.

### 7. Shape that worked, for reference

Of 30 items: 16 `application`, 7 `discrimination`, 6 `recall`, 1 `command`. Distractor provenance
came out 59 `sibling`, 21 `confusable`, 9 `misconception`, 1 `variant` — 90 distractors over 30
items. The `misconception` cap of one per item was never a binding constraint: plausible wrong
beliefs are scarcer than plausible neighbouring concepts, so `sibling` carries roughly two-thirds
of the load.

**These figures were first written from recall and were wrong** — the draft said 6/1/5/18 for
types and 14/68/8 for provenance. They were corrected by running a count over the committed file.
That is the project's most persistent defect class appearing one more time, in the notes warning
other authors about rigour. Compute every number you state, including in prose about your own
work:

```bash
node -e "const b=require('./questions/<dir>/<slug>.json');const t={},k={};for(const i of b.items){t[i.type]=(t[i.type]||0)+1;for(const o of i.options)if(!o.correct)k[o.provenance.kind]=(k[o.provenance.kind]||0)+1;}console.log(JSON.stringify(t),JSON.stringify(k))"
```

---

## Findings for adjudication

None raised by the pilot. The Disaster Recovery guide file and its dataset entries were consistent
with the primary sources the items cite, including the hot-versus-mirrored site distinction that
cycle 1 originally got wrong and cycle 2 corrected against NIST SP 800-34r1.

**Adjudicated by `verify-disaster-recovery` (Task 36, 2026-08-12).** No finding to adjudicate, but
the "consistent with the primary sources the items cite" claim above was checked and is only
partly true — not on content, on attribution. Two concepts cited sources that do not contain the
claim being made, which is the project's recurring defect class rather than a factual error:

- `sysadmin.disaster-recovery.snapshot` cited only `aws-ebs-snapshots` while both the guide prose
  and two items assert that a *local* LVM snapshot dies with its volume. The AWS page describes
  provider snapshots stored in S3 and says nothing about LVM. `man-lvcreate-8` added — snapshot
  size "is allocated from space in the VG".
- `sysadmin.disaster-recovery.failover-and-failback` cited only `nist-sp-800-34r1`, which never
  uses the word failback anywhere in the document (searched the extracted text of the full PDF).
  `aws-drs-failback` added, which defines failback and its reverse-replication mechanism.

The hot-versus-mirrored distinction the pilot flags is **confirmed correct**, including the "most
recent backup already loaded, requiring only the data since" wording, which is verbatim NIST SP
800-34r1 chapter 5 — not, as a first reading of the section 3.4.3 summary list suggested, an
unsourced textbook formulation.

### System Administration :: Troubleshooting (task 37, `verify-troubleshooting`)

Nothing was standing for adjudication when this competency was verified. Two defects were found in
the items themselves and fixed in place, and eight citations were corrected: the pattern is again
**a source cited for content it does not contain**, not false prose.

Sources fetched and found *not* to contain the claim they were cited for:

- `man-resolv-conf` (resolv.conf(5)) — mentions neither `systemd-resolved` nor the `127.0.0.53`
  stub address, and carries no DNS status codes. It was the only non-objectives source on both
  name-resolution items. Replaced/supplemented with `systemd-resolved-service` and
  `rfc-1035-dns-implementation` (RCODE 2 "Server failure" vs RCODE 3 "Name Error").
- `man-namei` on `permission-denied.02` — namei(1) says nothing about group credentials. Replaced
  with `man-credentials-7`.
- `man-ss` and `man-systemctl` on `cannot-connect-to-a-service.02` — neither covers `curl`, HTTP
  502 or `dig`. Replaced with `curl-manpage` and `rfc-9110-http-semantics`.
- `nist-sp-800-128` on `change-correlation.01` — a security-focused configuration-management
  guideline, and its PDF text layer could not be extracted for checking. Replaced with
  `google-sre-book-effective-troubleshooting`, whose "What touched it last" section states the
  claim directly.
- `man-systemctl` on `service-will-not-start.01` — systemctl(1) documents no `Result:` field.
  systemd.service(5) does carry the substance (`OOMPolicy=`: after an OOM kill "the service
  ultimately ends up in the `oom-kill` failed state"), so `systemd-service-5` was added.
- `man-df` on `disk-full.02` — df(1) says nothing about deleted-but-open files. `man-unlink-2`
  added.
- `man-apropos` on `using-documentation.01` — apropos(1) does not mention `man -k`; man(1) does
  ("-k, --apropos  Approximately equivalent to apropos"). `man-man-1` added.
- `man-proc-loadavg`/`man-uptime` on `high-cpu-load.01` — neither defines top's `wa` field.
  `man-top-1` added.

Four sources were registered for this: `systemd-service-5`, `systemd-resolved-service`,
`man-unlink-2`, `man-top-1`. Each was also added to the owning concept's `additional_sources` in
`data/topics/`, because `check-orphan-sources` warns on a source no concept cites and the gate
budget is zero warnings.

### Security Fundamentals :: Sensitive Data (task 41, `verify-sensitive-data`)

Nothing was standing for adjudication when this competency was verified. All 26 items were checked
against the primary sources fetched and read; five were refuted, fixed in place and re-checked. No
new source had to be registered — every correction was satisfied by a source already in the
registry.

**PCI DSS constraint.** The standing instruction is that no item may turn on a PCI DSS requirement
number, because the standard text sits behind a licence gate and the guide's citations of
requirements 3.3.1, 3.3.3, 3.5.1 and 11.3.2 remain unverified. A scan of the file found **no item
that depends on a requirement number**. The one PCI-citing item,
`protected-health-and-payment-data.01`, turns on the governance question instead, and the PCI SSC
standard page states it outright: "Whether an entity is required to comply with or validate
compliance to a PCI SSC standard is at the discretion of organizations that manage compliance
programs, such as a payment brand, acquirer, or other entity."

Refuted and fixed:

- **`personally-identifiable-information.02` — a factual error, the only one in the file.** The key
  claimed Article 4(1) "names an online identifier as a way a natural person is identified
  *directly*" and that an IP address is personal data "on its own, with no need to combine it with
  anything else". The consolidated text says the opposite on both counts: Article 4(1) reads
  "identified, **directly or indirectly**, in particular by reference to an identifier such as a
  name, an identification number, location data, an online identifier", attaching the list to both
  modes; and Recital 30 says online identifiers such as IP addresses "**in particular when combined
  with** unique identifiers and other information received by the servers, may be used to ...
  identify them". The item was rebuilt around Article 4(1) plus the Recital 26 "means reasonably
  likely to be used ... by the controller or by another person" test.
- **`secrets-management.02` — an overstated key.** It asserted an environment variable is not
  "rotatable without a code change". An env var normally comes from a deployment manifest, unit file
  or orchestrator config, so rotating it needs a restart or redeploy and no code change at all. The
  key now reads "cannot be rotated without restarting the process".
- **`data-classification.02` — attribution, not content.** Cited to `nist-sp-800-122`, which
  contains no discussion of aggregation labelling; the word "highest" does not occur anywhere in the
  publication. The rule is in `nist-sp-800-53r5` RA-2(1): "Organizations apply the 'high-water mark'
  concept to each system categorized in accordance with [FIPS 199]". Source swapped, option text
  untouched.
- **`data-states.01` — attribution.** Cited to `nist-csrc-glossary` alone, which carries
  Data-at-Rest and Data in Transit but **has no entry for "data in use"** — `/glossary/term/data_in_use`
  returns 404 and a glossary search for the phrase returns no such term — so the key's own state was
  absent from the only cited source. `nist-sp-800-53r5` added: the SC-28 discussion states
  "Information at rest refers to the state of information when it is not in process or in transit
  and is located on system components", which establishes the three-state partition.
- **`data-classification.01` — attribution.** SP 800-122 supports "PII is a fact about the content"
  but says nothing about organisational classification schemes ("classif" appears in it only in
  boilerplate about unclassified federal information). `nist-sp-800-53r5` added for RA-2, which
  makes categorisation an organisational determination documented in the security plan and approved
  by the authorising official.

Two further gaps were found, disclosed rather than papered over, and resolved inside the source
already cited:

- `data-retention-and-disposal.02` turns on a legal hold. The phrases "legal hold" and "litigation
  hold" **do not occur anywhere in SP 800-53r5**. The principle does: AU-11 requires records be
  retained "until it is determined that they are no longer needed for administrative, legal, audit,
  or other operational purposes ... including ... subpoenas, and law enforcement actions". The item
  is anchored there and the absence of the term is recorded in its verdict.
- `backups-of-sensitive-data.02` relies on the observation that surgical deletion inside a backup
  set is generally infeasible, which is operational rather than sourced; the key hedges it with
  "generally", and the load-bearing claim — that retention follows the copy — is SI-12 ("information
  output from the system").

**Guide correction.** `study-guide/04-security/sensitive-data.md` said an IP address can be personal
data "because Article 4(1) names online identifiers directly". The claim is true and the sentence
was defensible, but "directly" there means *expressly*, and the item author read it as *as a direct
identifier* — which is how the factual error above got written. The sentence was rewritten to say
Article 4(1) lists an online identifier among the references for identification directly *or
indirectly*, and to name the Recital 26 test. The guide's own concept definition at line 27 was
already precise; only the Traps paragraph was ambiguous.

### IT Project Management :: Functional Analysis (task 39, `verify-functional-analysis`)

**No finding had been raised against this competency.** Adjudication therefore covers what the
verification pass itself turned up, 2026-08-12. All 15 items were checked, five were refuted and
rewritten, and all 15 carry a `confirmed` verdict after re-check.

**Attribution problems in cited sources (the recurring defect class, not factual errors).**

- `istqb-standard-glossary-v2.2` is cited by `user-acceptance-testing.01` with the URL
  `https://glossary.istqb.org/en_US/term/user-acceptance-testing`. That page is a JavaScript
  application: a plain fetch returns the shell and no term text, so the quotation recorded in
  `data/sources.json` **cannot be verified by fetching**. The claim itself is correct and was
  settled against the ISTQB CTFL v4.0.1 syllabus s2.2.1 ("Acceptance testing focuses on
  validation ... Ideally, acceptance testing should be performed by the intended users"), which
  is a fetchable PDF at `https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf`.
  Recommend the controller add that syllabus as a source and re-point the UAT concept and item.
- `omg-uml-2-5-1-usecases` and `omg-bpmn-2-0-2-process` are both cited to `.../PDF` URLs that no
  HTML-to-markdown fetcher can read. Both were verified by downloading the PDFs and extracting the
  text locally, and both **do** contain what they are cited for: UML 2.5.1 clause 18 — "Actors may
  represent roles played by human users, external hardware, or other systems"; BPMN 2.0.2 clause 2
  lists "As-is or old Business Process" and "To-be or new Business Process" as model types and
  documents an as-is/to-be `reengineered` relationship. No correction needed, but a fetch-only
  verifier will report these as unreadable.

**Waived concepts — two of the four are no longer genuinely unsourceable.** SWEBOK Guide v3.0 is
freely published by the IEEE Computer Society at
`https://ieeecs-media.computer.org/media/education/swebok/swebok-v3.pdf` and settles both
`pm.functional-analysis.requirements-elicitation` (s3.2: "requirements are seldom elicited
ready-made ... elicitation is not a passive activity", plus the elicitation technique list) and
`pm.functional-analysis.non-functional-requirements` (s1.3 functional/nonfunctional definitions,
s1.5 on quantifying requirements, s4.1 listing functional-vs-nonfunctional and priority as
*separate* classification dimensions). Not applied here, because de-waiving changes
`data/sourcing-waivers.json`, `waived_source` flags and the validate warning count across
competencies — that belongs to the controller, not to a single file's verifier.

**Standing open question — empty `confused_with` on `verification-vs-validation` and
`feasibility-study`.** Checked, not fixed silently:

- `verification-vs-validation` is a *single* concept whose name contains its own comparison, and
  `data`'s description states both sides. There is no second concept for it to point at, so the
  empty array is correct as the dataset is modelled. The guide's comparison framing is internal
  to the entry.
- `feasibility-study` is different. The guide's gap-analysis entry explicitly separates the two
  ("it names the distance but not whether closing it is achievable ... That judgement is a
  feasibility question"), the two `data` descriptions are written as a matched pair, and two bank
  items (`gap-analysis.01`, `feasibility-study.01`) are built on exactly that discrimination while
  tagging their distractors `sibling` because no edge exists. A
  `gap-analysis` <-> `feasibility-study` edge is defensible and would license `confusable`
  provenance, but adding it creates a comparison-block obligation in the guide and so was left to
  the controller.

**Item-level defect worth generalising: the "what can X *not* tell you" stem shape breeds double
keys.** In `gap-analysis.01`, every distractor naming something genuinely outside gap analysis is
a second correct answer no matter how false its trailing justification is — the original `o3`
opened "Which of the six differences should be addressed first", which is precisely what the key
asserts the technique cannot deliver. The only safe distractors for that stem shape name things
*inside* the technique. Authors using this shape elsewhere should check for it.

### Linux Fundamentals :: Linux Operating System, items 26–50 (task 43b, `verify-linux-operating-system-b`)

Task 43 was split by concept range; this section covers array items 26–50 only (14 concepts,
`unix-heritage-and-posix` through `system-information-commands`). Items 1–25 belong to
`verify-linux-operating-system-a`.

**The template-clause repair did NOT fully hold.** This file's author once lengthened 123 of 150
distractors with 12 rotated meta-commentary clauses, and the repair was reported as complete and
seen by none of the 21 checks. Two residues survived in this range and were found by re-running
the scan:

- `cpu-architecture.01` `o2` ended `"...comparable system information., a command from the same
  family that solves an adjacent problem rather than the one described in the scenario"` — the
  clause, and the stray comma after the full stop, both intact.
- `cpu-architecture.02` `o4` ended `"...architecture-independent by design entirely, according to
  this claim"` — the hedge marks the option as merely asserted, so it is eliminable on sight.

Both rewritten. Scans after the fix, over items 26–50: keys 0% / distractors 0% two-clause
(gap 0 points), 0 six-token tails reused 3+ times, 0 meta-commentary clauses, average key 145
characters versus average distractor 123. **Generalisable: a repair nobody re-scanned is a claim,
not a fact — re-run the scan even when the ledger says the file was repaired.**

**One item had two correct answers** — `environment-variables.02`. The stem asks which command
shows every exported environment variable without un-exported shell variables mixed in; the key
is `env`, and `o3` offered "`export`, run with no arguments". bash(1) settles it against the item:
"If no names are given, or if only the -p option is supplied, **export** displays a list of names
of all exported variables on the standard output." The distractor's own `why` even conceded
"Bare `export` does list exported names on most shells" and then argued it was not the *dedicated*
tool — a distinction a candidate cannot be asked to make. `o3` rewritten to `export MYVAR`, which
marks one variable and prints nothing.

**Sources cited for content they do not contain** (fetched and searched in full, not recalled):

- `man-lscpu-1` on `cpu.01` — lscpu(1) does not document `nproc`, the item's key. Registered
  `man-nproc-1`; nproc(1) states the key verbatim ("the number of processing units available to
  the current process, which may be less than the number of online processors") and its `--all`
  text settles the item's `o4`.
- `man-free-1` on `ram.02` — free(1) documents memory columns and never mentions the OOM killer,
  which is the entire subject of the item. Added `man-proc-pid-oom-score`, which names "selecting
  a process for the OOM-killer".
- `man-uname-1` on `cpu-architecture.01` — uname(1) does not document the `arch` command, on which
  the item's `o4` turns. Registered `man-arch-1`, whose NAME line is "print machine hardware name
  (same as uname -m)".
- `wayland-architecture` on `x11-and-wayland.01` — the architecture page compares Wayland with X
  ("the X server is now just a middle man") but never says Wayland replaces it or postdates it,
  which is the whole item. Registered `wayland-home`: "Wayland is a replacement for the X11 window
  system protocol and architecture".
- `man-environ-7` on `environment-variables.02` — environ(7) documents the environment array and
  `export`, not the `env` utility. Registered `man-env-1`: "If no COMMAND, print the resulting
  environment."
- `man-bash-1` + `fhs-3.0` on `path.01` — bash(1) says only that the shell "searches each element
  of the PATH", never left-to-right first-match, which the key asserts. Added the already-registered
  `posix-env-vars`, which states it exactly: "the list shall be searched from beginning to end...
  until an executable file with appropriate execution permissions is found."
- `system-information-commands.01` and `.02` both make claims about `hostnamectl` in a `why`
  without citing anything that documents it. Added `man-hostnamectl-1`.

Thin citations recorded rather than repaired, because the content is correct and weakening it to
match the citation is the wrong direction (Task 3 `hypervisor` precedent):

- `storage-devices.02` — neither lsblk(8) nor free(1) states that RAM is volatile or
  byte-addressable. The block-device half is sourced; the volatility half rests on the
  objectives-level description.
- `gui-vs-cli.01`, `desktop-environments.01`, `desktop-environments.02` — the x.org front page
  says only that X.Org provides an open-source implementation of the X Window System. It does not
  support "most distributions ship several desktop environments as spins", nor the resource-cost
  argument, nor "swapping is generally supported".
- `device-drivers-and-kernel-modules.02` — no cited kernel page says "y means built-in" in one
  sentence; the reading rests on Kconfig's tristate/module-state text plus kbuild's rule that
  `obj-m` is what produces a `.ko`.

**`commands_covered` re-measured for this competency, and the ledger's number has moved.** The
dataset requires 21 command strings (20 unique) across the competency's concepts. Before this
pass the items declared 18 (17 unique), omitting `lscpu`, `env` and `hostnamectl` — all three in
this range — and the scoped check stayed clean throughout, because check 5 verifies that a
declared command appears as a code span, never that the field agrees with `data/`. The field also
drifts the other way: `environment-variables.01` declared `echo $HOME`, which appears nowhere in
that item (it has `echo $MYVAR`), and check 5 did not object. Corrected in place: `lscpu` on
`cpu.02`, `env` + `echo $HOME` on `environment-variables.02`, `hostnamectl` on
`system-information-commands.01`, and `export` alone on `environment-variables.01`. **After the
fix the items declare 21 (20 unique) and nothing in the dataset is unrepresented.** This is a fix
to one competency, not to the check — `commands_covered` remains unverified metadata bank-wide,
and a check comparing it against each concept's `commands` list is still the durable repair.

Two further item-level defects, both fixed: `cpu.01` `o2` announced its own wrongness
("...reports the full installed CPU topology *rather than what is available to the caller*"), and
`cpu-architecture.01` `o3` claimed architecture "never appears anywhere" in lscpu output — false,
and its own `why` said so. Both rewritten to state a wrong answer rather than to describe one.

Gates at completion: scoped `check-bank` 0 errors / 0 warnings over all 50 items (the 25
`q-verdict-coverage` errors seen mid-task were items 1–25 and were cleared by agent A while this
task ran); `npm test` 307/0; `npm run validate` 537 concepts, 0 errors, 23 warnings; `check-guide`
0/0. The validate warning count rose from the expected 16 to 23 during this pass: all seven are
`orphan-source` warnings for `gnu-android-freedom`, `kernel-development-process`, `kernel-org-about`,
`linux-relnotes-0-01`, `man-kill-2`, `redhat-centos-stream` and `rocky-linux-about` — sources
registered for the items 1–25 range and not yet referenced by any concept. The four sources
registered here (`man-nproc-1`, `man-arch-1`, `man-env-1`, `wayland-home`) were wired into the
`cpu`, `cpu-architecture`, `environment-variables` and `x11-and-wayland` concepts'
`additional_sources` and add no warning.

### Linux Fundamentals :: Linux Operating System, items 1–25 (task 43a, `verify-linux-operating-system-a`)

Task 43 was split by concept range; this section covers array items 1–25 only (13 concepts,
`operating-system` through `linux-history`). Items 26–50 belong to `verify-linux-operating-system-b`,
whose section is directly above. 25 of 25 items in this range carry a verdict.

**The template-clause repair did not fully hold here either.** Re-running the scan over the whole
file found one residue in this range: `linux-distribution.01` `o3` ended `"...includes the
operating system name field., a related but functionally different command whose behaviour does
not match what the scenario is actually asking for"` — role-describing meta-commentary plus the
stray `.,` that marks the clause's insertion point. Rewritten to a plain, true near-miss
(`uname -a` prints a summary ending with the operating system name, per uname(1) `-o`). Scans
after the fix, whole file: keys 0% / distractors 0% two-clause (gap 0 points); over items 1–25,
0 six-token tails reused 3+ times, 0 meta-commentary clauses, average key 153 characters versus
average distractor 140. Agent B independently found two more residues in its own range. **Two
agents re-running the same scan found three survivors in a repair the ledger recorded as
complete — the scan, not the claim, is the evidence.**

**Sources cited for content they do not contain** — 7 of 25 items. Every source below was fetched
and searched in full:

- `lf-about` on `linux-history.01`, for the Linux Foundation's role. The page contains no
  occurrence of "Torvalds", "maintainer", "fund" or "hosts"; it is marketing copy whose only
  relevant phrase is "Neutral home for code and collaboration". Registered `kernel-org-about`,
  which states it directly: "The Linux Kernel Organization is managed by The Linux Foundation,
  which provides full technical, financial and staffing support for running and maintaining the
  kernel.org infrastructure", and `kernel-development-process` for the maintainer hierarchy
  ("Linus Torvalds will declare that the window is closed", subsystem maintainers merging into
  their own trees first). The key's unsourceable specific, "funds core maintainers", was replaced
  with the sourced formulation rather than deleted.
- No cited source stated **1991** on `linux-history.02`, an item whose entire subject is the year.
  kernel-readme gives no date, `lf-about` gives none, and `gnu-linux-and-gnu` says "Once Torvalds
  freed Linux in **1992**" — a cited source that would actively mislead anyone checking the key.
  Registered `linux-relnotes-0-01`, the 0.01 release notes from the kernel.org historic archive:
  "This kernel is (C) 1991 Linus Torvalds", "a free minix-like kernel for i386(+) based
  AT-machines". Both the year and the capacity, from a primary artifact.
- `archwiki-arch-linux` and `ubuntu-release-cycle` on `distribution-families.02`, an item entirely
  about CentOS Stream and Rocky Linux. Neither page mentions either product. Registered
  `redhat-centos-stream` ("a continuously delivered distribution upstream for Red Hat Enterprise
  Linux") and `rocky-linux-about` (CentOS Linux was "a production-ready downstream version of Red
  Hat Enterprise Linux", discontinued in favour of Stream, with Rocky started in response).
- `archwiki-arch-linux` on `distribution-families.01`, a Fedora/`dnf`/`.rpm` item. The ArchWiki
  Arch Linux page mentions none of the three. Replaced with `dnf-command-ref` and `man-rpm-8`.
- `kernel-readme` on `multi-user-and-multitasking.02`, for the rule that a signal cannot cross
  users. The README lists kernel features and says nothing about signals. Registered `man-kill-2`,
  which states it: "For a process to have permission to send a signal, it must either be
  privileged ... or the real or effective user ID of the sending process must equal the real or
  saved set-user-ID of the target process."
- `gnu-linux-and-gnu` on `gnu-and-the-linux-kernel.01`, whose key turns on Android as the
  counter-example. The page has zero occurrences of "Android". Registered `gnu-android-freedom`:
  "Android is very different from the GNU/Linux operating system because it contains very little
  of GNU. Indeed, just about the only component in common between Android and GNU/Linux is Linux,
  the kernel."
- `kernel-license-rules` on `kernel-space-vs-user-space.01`, for a CPU execution-mode claim. That
  document covers SPDX licence identifiers and contains nothing about privilege modes. Replaced
  with `man-credentials-7`, which defines root as a process UID credential — the item's actual
  point.

**Generalisable, and it is the same shape wave A found with `man-resolv-conf` and `man-df`: the
man page or project page for the right *topic* is not a source for the *claim*.** Five of the
seven above cite a page about the correct subject area that simply does not contain the sentence
the item needs. Fetching the page and searching it is the only way this is visible; a reviewer who
recognises the source id will pass it every time.

**Two items had a defect worse than a bad citation:**

- `kernel-space-vs-user-space.01` `o3` read "Yes, but only while the process is actively
  performing a privileged system call ... that is when its instructions actually run with elevated
  rights." Under the standard reading — a thread switches to kernel mode for the duration of a
  syscall and kernel code runs in the calling process's context — this is defensible, making it a
  second arguably-correct answer. Its `why` compounded it with a false claim, that "the calling
  process itself never migrates into that execution mode". Rewritten to an unambiguously false
  claim about address spaces, with a `why` that is true.
- `gnu-and-the-linux-kernel.02` `o2`'s `why` asserted "GNU had no kernel of its own at the time" —
  contradicted by the very page cited: "We had also started a kernel, the GNU Hurd ... the GNU Hurd
  started working reliably in 2001." Rewritten to "no *working* free kernel", naming the Hurd. A
  `why` can be false against its own citation while the option it explains is correctly wrong;
  only reading the source catches it.

**One shape tell, no factual defect:** `shell.01` asked "which command reports it" with `o1`–`o3`
as commands and `o4` as a bare assertion about `$SHELL`. The odd one out is eliminable without
knowing anything about shells. Rewritten as `` `echo $0` ``, a real command that reports the
running shell rather than the configured login shell — the same trap, now indistinguishable from
the key on form. **Generalisable: an option that does not answer the stem's grammatical question
is a free elimination, however true its content.**

The seven sources registered here were wired into the `linux-history`, `distribution-families`,
`gnu-and-the-linux-kernel` and `multi-user-and-multitasking` concepts' `additional_sources`, which
clears the seven `orphan-source` warnings agent B recorded above; `npm run generate` was re-run.
The `linux-history` concept's own `description` — "The Linux Foundation sponsors and hosts the
work" — now has a source behind it for the first time.

Gates at completion: scoped `check-bank` 0 errors / 0 warnings over all 50 items (0 residual
`q-verdict-coverage`, agent B having finished its range); `npm test` 307/307; `npm run validate`
537 concepts, 0 errors, 16 warnings — back to the expected 16; `check-guide` 0/0.

### Cloud Computing Fundamentals :: Best Practices (task 45, `verify-cloud-best-practices`)

All 32 items over 15 concepts were verified. Ten survived as authored. **Twenty-two were
refuted**, rewritten and re-verified: twenty on citation, two on content. Nothing here was cited
to `nist-sp-800-145` or turned on a spot-instance interruption notice, so neither of the two
traps flagged for this neighbourhood was live.

**The dominant defect is the wave-A defect, and it is worse here than the wave-A rate: 20 of 32
items cited a source that did not contain what the item turned on.** In every case the citation
was a *landing page* for the right document — the ELB "What is Elastic Load Balancing?" page, the
"pillars of the framework" page, the reliability-pillar `welcome.html`, the right-sizing and
tagging whitepapers' abstract pages, `whatisbackup.html`, `cloudtrail-user-guide.html`, the KMS
overview. Each is real primary documentation for the concept and each is one or two clicks away
from the page that actually carries the claim. The pattern is the authoring shortcut of citing a
service's front door and assuming the detail lives behind it. Specific misses:

- `aws-elastic-load-balancing` (the ELB landing page) was cited for a 300-second deregistration
  delay and for TCP-versus-application-layer health-check depth. It contains one sentence about
  health checks and no numbers at all. The delay, the `draining` state and the 500-level error a
  premature termination returns are all on the target-group attributes page; the health-check
  protocols are on the NLB and ALB target-group health-check pages.
- `aws-rightsizing-whitepaper` (caught once before, in Task 3) was cited for the two-week
  observation period, the instance-family-to-bottleneck rule and the reserved-pricing contrast.
  The cited page is the abstract. All three sit in later chapters, and the reserved-pricing point
  needed the EC2 Reserved Instances page ("not physical instances, but rather a billing discount").
- `aws-tagging-best-practices` was cited for tag-key case sensitivity. The landing page is an
  abstract; "Tags are case sensitive, meaning that `costCenter` and `costcenter` are different tag
  keys" is in the "What are tags?" chapter.
- `aws-well-architected-pillars` was cited by five items for content about IaC templates, drift,
  console changes and what a review produces. That page contains the six pillar names and nothing
  else. Recited to REL08-BP04/REL08-BP05 and the WA Tool guide.
- `aws-well-architected-reliability-pillar` (`welcome.html`) was cited by five items for
  design-for-failure and immutable infrastructure. It is a two-paragraph scope note.
- `aws-iam-best-practices` was cited for the guest-OS-versus-IAM-identity distinction (the page
  never mentions the guest OS) and for what IAM governs (it never says).
- `aws-kms` was cited for both encryption items; it covers key creation and key policy and says
  nothing about at-rest-versus-in-transit or about an authorised over-privileged read.
- `aws-backup` was cited for the shared responsibility model and for restore testing; it carries
  neither (restore testing appears only as a billed line item).
- `aws-cloudtrail` was cited for "who, when and **from where**"; the landing page names who/what/
  when but not the source IP, which is in the record-contents reference.

Twenty sources were registered and wired into the eleven affected concepts'
`additional_sources`, so no `orphan-source` warning was added; `npm run generate` was re-run.

**Two content defects, both fixed:**

1. `well-architected-review.01` dated the sustainability pillar to "December 2021". AWS's own
   revision history carries two rows — "Sustainability Pillar added to the framework", 20 November
   2021, and "Added Sustainability Pillar and updated links", 2 December 2021 — so the month is not
   a fact the source settles. The guide's prose already says "late 2021" and was right; the item
   was the divergence. Item now says "late 2021" and cites the revisions page. The six/five split
   itself is confirmed on both frameworks' published pillar lists.
2. `right-size-before-you-scale.01`'s key said autoscaling buys idle capacity "at a **higher price
   per unit**". False as written: the per-unit rate is unchanged; what rises is the cost of the
   same useful work. In the same item `o4` ("guaranteed headroom for the next traffic peak") was
   very nearly a second correct answer — autoscaling *does* buy headroom, and only the word
   "guaranteed" separated it from the key. Key reworded and `o4` replaced with a claim that is
   plainly false (that spreading a fixed load across more instances raises per-instance
   utilisation).

**Finding against the guide, confirmed and fixed:** `study-guide/03-cloud-computing/best-practices.md`
carried the same "higher price per unit" phrasing the item did — this is where the item got it.
Corrected in place to "a higher cost for the same useful work — the per-unit rate does not change,
the number of oversized units does", `npm run generate` re-run, `check-guide` clean. No other
divergence between the guide's prose and the primary sources was found in this competency; where
the two disagreed (the sustainability date) the guide was the correct one.

**Note for later waves:** a citation to a docs *landing page* should be treated as unverified by
default. Of the eight distinct landing pages cited in this file, seven did not contain the claim
resting on them. The one that did — the CloudTrail landing page for the 90-day Event history
window — carried it verbatim.

Scans: two-clause rate 0% keys / 0% distractors (gap 0 points), no six-token tail reused 3+ times,
mean length 25 words key against 20 distractor with `q-length-cue` passing. Gates at completion:
scoped `check-bank` 0 errors / 0 warnings over all 32 items; `npm test` 307/307; `npm run validate`
537 concepts, 0 errors, 16 warnings; `check-guide` 0/0.


### Cloud Computing Fundamentals :: Budgeting (task 42, `verify-budgeting`)

31 items over 13 concepts, all 31 given a verdict: **14 confirmed on the first pass, 17 refuted,
rewritten and re-verified to confirmed.** No item was left `null`, and no item turns on a PCI DSS
requirement number.

**Sixteen of the seventeen refutations were attribution failures, not factual errors.** The claim
was right; the cited source did not carry it. That is the same defect wave A recorded 22 times,
and it dominated here even harder. Three sources accounted for most of it:

1. `nist-sp-800-145` was cited on all three `pay-as-you-go` items. It is a five-page definition
   document. It contains no Azure VM power states, no purchase options, and no statement that a
   running instance bills independently of utilisation. Re-cited to Azure's states-and-billing
   table ("Stopped ... Also called PoweredOff state or Stopped (Allocated) ... Billed" against
   "Deallocated — The virtual machine has released the lease on the underlying hardware ... Not
   billed"), to `aws-ec2-purchasing-options`, and to the Azure Well-Architected cost model
   ("Billing models include consumption-based (pay-as-you-go), commitment-based plans
   (reservations), and spot pricing").
2. `aws-budgets` was cited on both `free-tier-and-pricing-calculators` items. The page is about
   budgets and budget actions and never mentions a pricing calculator or a free-tier allowance.
   Re-cited to the AWS Pricing Calculator guide ("Model your solutions before building them") and
   to Microsoft's free-account page ("If your usage exceeds the specified quantity of free
   services, you'll need to pay for the exceeding amount at pay-as-you-go rates"). This is the
   third time `aws-budgets` has been caught being cited for content it does not carry.
3. `aws-rightsizing-whitepaper` was cited on all three `orphaned-resources` items. It is a
   telemetry document about instance sizing; it has no orphan, no unattached disk, and no
   inventory-versus-telemetry contrast. Worse, on `orphaned-resources.01` it actively contradicted
   the distractor resting on it — the whitepaper says "Terminating an instance ... automatically
   deletes attached EBS volumes", while the distractor's `why` claimed disks survive VM deletion
   "in most providers". Re-cited to Azure's delete guidance ("By default, disks, NICs, and Public
   IPs associated with a VM are persisted when the VM is deleted"; "Resources that you Detach,
   like disks, will continue to incur charges as applicable") and to the unattached-disk guide,
   which finds orphans "by examining the value of the ManagedBy property" — inventory, not
   telemetry, which is exactly what the key claims. The `why` was rewritten to name Azure's
   documented default instead of generalising across providers.

`lf-objectives-2025` was the sole citation on four conceptual items (`capex-vs-opex.01`,
`on-demand-reserved-and-spot-pricing.01`, `total-cost-of-ownership.01`,
`chargeback-and-showback.01`). That page carries the domain weights and the single word
"Budgeting" and nothing else; it establishes that the objective exists, not what is true about it.
Each of the four kept it and gained a primary source: Microsoft CAF's CapEx-to-OpEx section, the
EC2 Reserved Instances page ("significant savings ... compared to On-Demand") with the Spot page
("available for less than the On-Demand price"), the Azure Well-Architected cost model ("costs
include infrastructure, software licenses, personnel, maintenance, and support costs"), and the
FinOps Framework ("The primary difference between showback and chargeback is the formality ... of
sending expenses to official accounting budgets"). **A syllabus anchor is not a source for a
claim**, and treating it as one is how four items reached the bank unsupported.

**The one substantive refutation** was `data-egress-charges.02`. Its key asserted, without
qualification, that inter-region transfer is priced below internet egress on Azure's rates. The
cited page contradicts that twice: internet egress grants a free first 100 GB each month while
inter-region traffic is charged from the first gigabyte, and from South America inter-region
transfer is $0.16 per GB against $0.12 for internet egress routed via the transit ISP network.
Stem and key now name North America and a volume above the free allowance, where the page does
support it ($0.02 against $0.087 premium / $0.08 transit ISP). The item's real teaching point —
that the pattern does not transfer to another provider unchecked — is unchanged and is now
literally true of Azure's own table as well.

**Finding against the guide, confirmed and fixed:** `study-guide/03-cloud-computing/budgeting.md`
carried the same unqualified claim — "on Azure's published rates the inter-region band is the
cheaper of the two" — which is where the item got it. Qualified in place with both counterexamples
from the cited price table, `npm run generate` re-run, `check-guide` clean. `data/`'s own
`description` for the concept was already correct (it claims only the inbound/outbound asymmetry)
and was left alone; this is the guide-ahead-of-data divergence running the other way for once.

**Rejected / no change:** the spot-interruption trap did not fire here.
`on-demand-reserved-and-spot-pricing.02` already names AWS, Azure and Google Cloud separately and
states two minutes against roughly thirty seconds, which all three sources confirm (AWS: "a
warning that is issued two minutes before Amazon EC2 stops or terminates your Spot Instance";
Azure: "up to 30 seconds prior to the eviction"; Google: "The shutdown period for a preemption
notice is best effort and up to 30 seconds"). It was refuted only because the two-minute figure
was cited to the Spot *landing* page, which does not contain it — the sentence lives on the
interruption-notices child page, now cited, along with the rebalance-recommendations page for the
`why`'s earlier signal ("can arrive sooner than the two-minute Spot Instance interruption notice").
`docs/verification/factcheck-budgeting.json` was read and its `budgeting-001` refutation is
consistent with what the item already says; nothing in it required a further change.

**No double keys and no duplicate options were found** in these 31 items — every distractor was
checked individually and each `why` states a fact that holds against a source. Fourteen new source
registrations were needed to close the citation gaps (thirteen new, `azure-storage-introduction`
already present), each added to the relevant concept's `additional_sources` so no orphan-source
warning appears.

**Note for later waves:** the landing-page rule from task 45 held again — of the cited pages that
failed here, every one was either a landing page or a document about a neighbouring subject.
Add a second rule: **an item citing only `lf-objectives-2025` should be treated as unsourced by
default**, since that page contains competency names and percentages and nothing else.

Scans: two-clause rate 0% keys / 0% distractors (gap 0 points), no six-token tail reused 3+ times;
after rewriting three option sets, `q-length-cue` needed distractors lengthened on
`data-egress-charges.02` (ratio now 1.19) and `storage-tiers-and-lifecycle-policies.01` (1.35) —
no key was truncated. Gates at completion: scoped `check-bank` 0 errors / 0 warnings over all 31
items; `npm test` 307/307; `npm run validate` 537 concepts, 0 errors, 16 warnings;
`check-guide` 0 errors / 0 warnings.

---

### Cloud Computing Fundamentals :: Performance/Availability (task 44, `verify-performance-availability`)

33 items over 17 concepts, all 33 carry a verdict. Initial verdicts: **26 refuted, 7 confirmed**.
Every refuted item was rewritten (citation, option text, or a distractor `why`), re-checked against
the fetched source, and now records `verdict: confirmed` with `initial_verdict: refuted`.

**The MTTR/MTBF and service-ownership traps do not apply to this file.** `mttr-and-mtbf`,
`service-ownership` and `capacity-planning` are concepts of `data/topics/02-system-administration.json`,
not of Cloud Computing :: Performance/Availability. The 17 concepts here are availability,
high-availability, fault-tolerance, redundancy, failover, scalability-vs-elasticity, vertical-scaling,
horizontal-scaling, auto-scaling, load-balancing, stateless-design, latency-and-throughput, caching,
content-delivery-network, monitoring-and-metrics, sla-slo-and-sli and bottleneck-identification.
No item in this file mentions MTBF, MTTF or a named service owner. **No item carries
`waived_source: true`.**

#### The dominant defect: 24 of 33 items cited a source that does not contain what they turn on

Two landing pages accounted for almost all of it.

- **`aws-well-architected-pillars`** (`the-pillars-of-the-framework.html`) — the whole page is the
  building analogy plus a bulleted list of the six pillar names. It was cited by all six items on
  latency-and-throughput, monitoring-and-metrics and bottleneck-identification. The sharpest case is
  `monitoring-and-metrics.02`, whose own `why` credited "Google's SRE material" for the four golden
  signals while `source_ids` pointed at that AWS list. Repointed to
  `google-sre-book-monitoring` (SRE Chapter 6), which states verbatim: "the four golden signals of
  monitoring are latency, traffic, errors, and saturation", defines saturation against the most
  constrained resource, and gives the mean-hides-the-tail example the percentile item needs.
- **`aws-well-architected-reliability-pillar`** (`reliability-pillar/welcome.html`) — an abstract, the
  six-pillar list and a statement of the paper's audience. It was cited by all nine items on
  high-availability, fault-tolerance, redundancy, failover (one) and stateless-design. Repointed to
  the pages inside the same paper that carry the content: `availability.html`, REL10-BP01,
  REL11-BP02, REL11-BP03, REL11-BP05, REL11-BP07.

Others: the downtime arithmetic (`availability.02`) was cited to SRE Chapter 4, which has no
downtime table — Appendix A tabulates 43.2 min at 99.9% and 21.6 min at 99.95% per 30 days, so the
key's 21.6-minute difference is now cited to the table that states it. The layer-4-versus-layer-7
item cited the ELB overview, which names no OSI layer. Both vertical-scaling items cited the EC2
**Auto Scaling** page, which is about adding and removing instances and never mentions resizing one.
The DNS-TTL item cited the Route 53 welcome page, which never mentions TTL or resolver caching.
The cache-staleness item cited the CloudFront introduction, which never mentions expiry.

**Eighteen new sources** were registered (all tier 2, all fetched and read), and each was added to
the relevant concept's `additional_sources` in `data/topics/03-cloud-computing.json` so no
orphan-source warning appears. The two landing pages were left registered and left on the concepts
as background; they were removed only from the items that turned on content they do not carry.

#### Finding against `data/`: NIST does not require elasticity to be automatic

`data/topics/03-cloud-computing.json` defines `scalability-vs-elasticity` as "elasticity is doing so
automatically in both directions", and `scalability-vs-elasticity.01`'s o2 `why` asserted that "NIST
ties elasticity to capacities provisioned and released automatically". SP 800-145 s2, read out of the
PDF, states: "Rapid elasticity. Capabilities can be elastically provisioned and released, **in some
cases automatically**, to scale rapidly outward and inward commensurate with demand." The hedge makes
automation typical, not definitional, so the `why` overstated its own source.

**Resolution:** the `data/` description was *not* changed — automatic bidirectional scaling is a
defensible industry definition and the guide's prose is consistent with it. The item was fixed
instead: the `why` now quotes NIST verbatim, and the key turns on the two conditions NIST states
without hedge — rapid, and commensurate with demand — which the stem's "someone remembers" cycle
fails on both counts. Later waves citing SP 800-145 for elasticity should quote the hedge.

#### Two distractors were eliminable without knowing the subject

- `bottleneck-identification.02` o2 ended "— the attractive wrong answer the exam is specifically
  testing for, since it skips locating the constraint before spending effort on it". A distractor
  that announces its own wrongness is answerable on sight. Replaced with a plausible false
  justification of comparable length (application capacity being the usual constraint).
- `monitoring-and-metrics.01` o4 read "Neither is examinable here, since both describe internal
  engineering practice rather than architecture" — a meta-answer about the exam rather than the
  systems. Rewritten as a substantive false claim about dashboards.

**Format tell worth a rule.** Nineteen of the 99 distractors — and no key — ended with an appended
em-dash commentary clause introduced after a full stop (". — a substitution that ignores…"). That
pattern was the entire two-clause gap (0% keys against 19% distractors) and it marked the option as
a distractor before the reader parsed it. The full stop was joined into the em dash (". — " → " — "),
which keeps every character of length — the tails exist to defeat `q-length-cue` — while removing
the sentence-boundary signature. Gap is now 0 points. **Rule for later waves: balance length with a
qualifying clause that a confident wrong answerer would actually write, not with commentary about
why the option is wrong.**

#### Residual thin sourcing, recorded rather than hidden

`latency-and-throughput.02` turns on batching raising throughput at the cost of per-item latency.
The Kinesis Producer Library page documents the throughput half verbatim ("effectively increases
producer throughput", 1,000 records packed into 10); the per-item delay is entailed by that
mechanism rather than stated on the page. No freely accessible tier-1/2 page stating both halves was
found. Similarly, `fault-tolerance` rests on the NIST CSRC glossary ("a property of a system that
allows proper operation even if components fail") read against the RDS Multi-AZ page's failover
event for the contrast with high availability; no single source states the "no user-visible
interruption" framing that `data/`'s description uses.

**No double keys and no duplicate options were found** in these 33 items; every distractor was
checked individually and every `why` states a fact that holds against a fetched source.

Scans: two-clause rate 0% keys / 0% distractors (gap 0 points), no six-token tail reused 3+ times.
`q-length-cue` fired once on the rewritten `scalability-vs-elasticity.01` key (210 chars against a
125-char distractor mean); the newly written key was tightened to 141 chars — the original key's
content was never truncated. Gates at completion: scoped `check-bank` 0 errors / 0 warnings over all
33 items; `npm test` 307/307; `npm run validate` 537 concepts, 0 errors, 16 warnings;
`check-guide` 0 errors / 0 warnings.

### DevOps Fundamentals :: DevOps Basics (task 47, `verify-devops-basics`)

34 items over 25 concepts, all 34 verified and all carrying a verdict. 30 items were refuted on
the first pass and rewritten (23 for a spliced padding clause, 14 for a citation that did not
carry the claim, overlapping on 7); 4 were confirmed as written — `continuous-delivery.01`,
`continuous-deployment.02`, `rolling-deployment.02`, `infrastructure-as-code.02`. No double key
was found: no distractor in this file is defensible against its own key, and no two options in
any item assert the same claim.

#### 1. The Maven finding is CONFIRMED, and worse than PROGRESS.md recorded it

PROGRESS.md said npm's and pip's first-party documentation did not make the
application-versus-OS-package-manager contrast explicit "**; Maven's did**". Maven's did not.
"Introduction to the Dependency Mechanism" never mentions an operating system package manager,
`apt`, `dnf`, or system-wide installation anywhere on the page; its **System Dependencies**
section is about `<scope>system</scope>` pointing at a jar on disk, an unrelated sense of the
word. Both items on `devops.devops-basics.language-package-managers` turn on a contrast their
only substantive source does not draw, so both were refuted.

Fixed by citation, not by weakening the content: the PyPA specification **Externally Managed
Environments** defines a "Python-specific package manager" against a "distro package manager ...
capable of installing Python packages as well as non-Python packages", and exists because using
the former against an environment the latter owns "can be confusing at best and outright break
the entire underlying operating system at worst" — which is item `.02`'s scenario verbatim in
substance. npm's local-install page supplies the project-local half. `maven-dependency-mechanism`
stays on the concept for the manifest-and-transitive-resolution claim in the guide's **How it
works**, which it does carry. PROGRESS.md corrected in place.

#### 2. A source cited for content it does not contain — 11 concepts in 34 items

The dominant wave-A defect is dominant here too. Each was fixed by adding the source that
carries the claim; no key was trimmed to fit a thin source.

| Item(s) | Cited for | Source did not contain it | Now cited |
| --- | --- | --- | --- |
| `silos-and-shared-responsibility.01` | silo as an incentive boundary | cncf-glossary (DevOps entry describes handoffs and "misalignment of priorities", never incentives as the boundary) | + `google-sre-book-embracing-risk` (product development and SRE "generally evaluated on different metrics") |
| `site-reliability-engineering.01` | error budget balancing change against stability | cncf-glossary SRE entry (the delivery-versus-running-system half is verbatim; **error budget** appears nowhere on it) | + `google-sre-book-embracing-risk` |
| `pipeline.02` | a failing stage stops the run | cncf-glossary | + `gitlab-ci-yaml` ("jobs in the next stage run after the jobs from the previous stage complete successfully") |
| `build-and-artifact.01` | build once, deploy many | cncf-glossary | + `twelve-factor-build-release-run` |
| `ci-cd-tooling.01` | Terraform / Ansible / Jenkins roles | cncf-glossary names none of the three | replaced with `terraform-intro`, `ansible-getting-started`, `jenkins-pipeline-doc` |
| `deployment-environments.01`, `developer-environments-and-parity.01` | the environment ladder; parity as shape not size | cncf-glossary | + `twelve-factor-dev-prod-parity` (gaps are time, personnel, tools — never capacity) |
| `blue-green-deployment.02`, `rollback.01` | a shared database defeats the instant rollback | cncf-glossary and the Kubernetes Deployment page (neither discusses data) | + `fowler-blue-green-deployment` |
| `canary-release.02` | canary versus A/B test | cncf-glossary has no A/B testing entry | + `fowler-canary-release` ("A/B testing is a way to test a hypothesis using variant implementations") |
| `idempotency-in-automation.01` | check-then-act on repeated runs | cncf-glossary idempotence is a one-line mathematical definition | + `ansible-getting-started` |
| `observability.01` | answering a question nobody thought to ask | cncf-glossary (property yielding actionable insight, but not the unforeseen-question line) | + `otel-observability-primer` ("unknown unknowns"; instrumented well enough that no new instrumentation is needed mid-incident) |

12 sources were registered in `data/sources.json` and attached to the concepts in
`data/topics/05-devops.json`; the guide's per-concept `sources:` metadata was brought back in
line for the 11 concepts that carry a metadata line (SRE and observability are comparison-table
entries and have none). `npm run generate` re-run; `npm run check-guide` 0/0.

Everything else in the file did check out against the CNCF glossary, semver.org and the
Kubernetes Deployment page, read in full: the CI scope boundary ("begins when code changes are
committed ... ends with a tested artifact"), the delivery/deployment acceptance-environment
split, blue-green's lockstep justification, canary's gradual widening, RollingUpdate as the
default with Recreate killing every Pod first, and MAJOR/MINOR semantics are all verbatim in
their cited sources.

#### 3. A padding clause spliced onto a distractor after the sentence has ended

**New, and specific to this file.** 23 of its 136 options ended with a fragment glued on after a
sentence-final stop — `"... shipped to users., a distinction the exam treats as ..."`,
`"... adopted DevOps., since a reorganisation ..."`, `"... at that earlier stage. regardless of
what the lifecycle stage is ..."`. The same pattern appears zero times in the other 21 bank
files' 4,464 options, so this is one author's habit, not a bank convention.

Two defects in one:

1. It is ungrammatical, and it lands on exactly one distractor per item, so the reader can spot
   the padded option — and therefore a wrong answer — without reading it.
2. Several of the fragments talk about the exam or the guide from inside the option text ("a
   distinction the exam treats as the whole difference", "which inverts the actual relationship
   the exam expects a candidate to know by name"). An option is supposed to be a claim about the
   world, not a note to the candidate about which option is wrong.

Why it was there matters more than that it was there: **it was load-bearing for
`q-length-cue`.** Deleting the 23 fragments and stopping took the population share from inside
the limit to *the key is the longest option in 21 of 34 items (62%, limit 40%)*, plus two
per-item ratio warnings. The padding was buying a length balance the item set had not actually
earned. Fixed properly by extending 12 distractors with real, false, single-sentence clauses
that a candidate has to evaluate: 10 of 34 (29%), 0 ratio warnings, keys and distractors both 0%
two-clause, no six-token tail reused 3+ times.

**For later verification tasks:** if you delete padding, re-run the length numbers before you
call the item fixed. A grammatical repair that re-opens a length tell has moved the defect, not
removed it.

### Security Fundamentals :: Compliance (task 46, `verify-compliance`)

32 items over 14 concepts, all 32 carrying a verdict. 20 confirmed as authored; **12 refuted**,
rewritten in place and re-verified. Every primary source was fetched and read in full — GDPR
(EU-adopted text via legislation.gov.uk, because EUR-Lex returned a bot challenge, `202` with an
empty body, to both curl and WebFetch), 45 CFR Part 164 (eCFR versioner API, because the eCFR web
UI refuses programmatic access), NIST SP 800-53 Rev. 5, SP 800-53A Rev. 5, SP 800-39, SP 800-30
Rev. 1, SP 800-88 Rev. 1, SP 800-100, SP 800-12 Rev. 1, SP 800-37 Rev. 2, SP 800-171 Rev. 3, the
PCI SSC standard/about/glossary pages, AICPA's SOC pages, ISO's certification page, the GNU GPL
FAQ, GPLv3, AGPLv3, MIT and Apache 2.0.

#### The PCI-requirement-number scan: clean, and here is the scan

Regex over the whole file for `requirement|req\.?\s*\d+(\.\d+)*` and for bare `\d+\.\d+\.\d+`:
**0 hits across all 32 items**, including every stem, option text, `why` and `rationale`. No item
turned on a PCI DSS requirement number, before or after the rewrites. What two items *did* turn
on was the licence-gated requirement *substance* — see the pci-dss entries below — which is the
same defect wearing different clothes, and is what the ban is actually protecting against.

#### The dominant defect here was the same as wave A's: a source cited for content it lacks

Nine of the twelve refutations were this. The counts are worth recording because they are cheap
to re-check and expensive to guess at:

- **`nist-sp-800-53r5` does not contain "detective".** Zero occurrences in 492 pages. Also zero
  in SP 800-53A Rev. 5 (733 pages), SP 800-12 Rev. 1, SP 800-37 Rev. 2 and SP 800-171 Rev. 3, and
  `csrc.nist.gov/glossary/term/detective_control` returns 404 (as do `preventive_control`,
  `corrective_control` and `legal_hold`). The preventive/detective/corrective taxonomy the guide
  teaches had **no primary source anywhere in `data/sources.json`**. The only NIST document found
  that carries it is SP 800-100 — "either preventive or detective in nature" — now registered,
  and the mechanism itself is SP 800-53 Rev. 5's SI-7, "Employ integrity verification tools to
  detect unauthorized changes".
- **`nist-sp-800-53r5` does not contain assessor sampling.** "Sampling" appears once, as
  CP-9(2) SYSTEM BACKUP | TEST RESTORATION USING SAMPLING — restoring from backups, not
  examining a population. The right passage is SP 800-53A Rev. 5 Appendix C's *coverage
  attribute*, which defines basic and focused examination in terms of a *representative sample*
  of assessment objects. Registered as `nist-sp-800-53Ar5`.
- **`aicpa-soc2` does not contain Type 1 / Type 2.** The cited page, and every AICPA URL tried
  (the SOC suite landing page, `us.aicpa.org/interestareas/.../serviceorganization-smanagement`,
  AT-C 320's PDF path) resolve to the same landing page or to a click-through gate. It carries
  "assurance reports" and "CPAs may provide", and AICPA names a "SOC 2 type 2 examination" in a
  resource title — but the mapping of Type 1 to design-as-of-a-date and Type 2 to
  operating-effectiveness-over-a-period is **unverified, not disproven**. Treated the way the
  PCI requirement numbers are treated: the item was rewritten so it does not turn on the mapping.
- **`aicpa-soc2` contains nothing about ISO 27001.** Two items asserted accredited-body
  certification against it. ISO's own certification page settles it — "ISO does not perform
  certification or issue certificates ... Certification is performed by external certification
  bodies" — now registered as `iso-certification`.
- **`gnu-gpl-faq` contains neither MIT nor Apache licence text**, and one item turned on MIT's
  notice condition while naming Apache 2.0's changed-file condition. Re-cited to the licences
  themselves; `apache-license-2` was already registered, `osi-mit-license` is new.
- **"Legal hold" and "litigation hold" appear in none of the cited sources** — zero in SP 800-88
  Rev. 1, SP 800-53 Rev. 5, SP 800-53A Rev. 5 and the Regulation. This is the same shape wave A
  found for AU-11, and the same resolution applies: the substance is right, GDPR states it
  directly, and the citation moves rather than the content. **Article 17(3)(e)** disapplies the
  erasure right "for the establishment, exercise or defence of legal claims".

#### A true-but-misreadable guide sentence, same class as wave A's Article 4(1)

The Quick reference row for `security.compliance.consent-and-lawful-basis` opened with "GDPR
Article 6(1) lists six" and then, in the same cell, stated "Valid consent is freely given,
specific, informed and unambiguous". Both halves are true. Read as one attribution — which is
how the item author read it — it says Article 6 sets the consent validity bar. It does not.
Article 6(1)(a) says only "the data subject has given consent to the processing of his or her
personal data for one or more specific purposes"; the four conditions plus "by a statement or by
a clear affirmative action" are **Article 4(11)**, and the pre-ticked-box consequence is
**Recital 32** ("Silence, pre-ticked boxes or inactivity should not therefore constitute
consent"). The item's stem said "Under GDPR Article 6" and was refuted on that. The guide row is
now explicit about which article does which job.

This is the second confirmed instance of the class. It is invisible to all 21 checks, it is
produced by *correct* prose rather than wrong prose, and both instances so far have been GDPR
article attributions inside a compressed reference cell. **Compressed cells that name an article
and then state a rule are the place to look.**

#### A guide claim contradicted by a primary source, not merely unsourced

The guide said "Findings are written against standards, because a standard is the only tier with
something testable in it. A policy alone cannot be failed on evidence; it has no threshold." The
item built on it made the same exclusivity claim in its key. NIST SP 800-53A Rev. 5 refutes it:
AC-01 POLICY AND PROCEDURES carries its own assessment objectives — "an access control policy is
developed and documented", "the access control policy is disseminated to ..." — so a policy tier
is assessable and failable on evidence. The correct, narrower claim is that the standard is the
tier supplying a *threshold*, which is what a control's observed performance is compared against.
Guide and item both corrected.

#### PCI-DSS: two items turned on licence-gated requirement substance without citing a number

`pci-dss.01` keyed on sensitive authentication data not being retained after authorisation
"outside the narrow issuer carve-out", and `pci-dss.02` keyed on the account number being
storable "if rendered unreadable". Neither named a requirement number, so both passed the ban as
written — and both were nonetheless restating requirement text nobody has read. Refuted and
re-anchored on the Council's **publicly readable glossary**, which turns out to carry enough:
its Cardholder Data entry points to "Sensitive Authentication Data for additional data elements
that might be transmitted or processed **(but not stored)** as part of a payment transaction",
its Truncation entry describes rendering a stored PAN unreadable, and its Acquirer entry supplies
"merchant bank / acquiring bank ... subject to payment brand rules and procedures regarding
merchant compliance". The issuer carve-out was **removed** rather than asserted. Registered as
`pci-ssc-glossary`.

`pci-dss.03`'s key asserted a "signed merchant agreement with an acquiring bank" — a phrase that
appears nowhere on the cited page. Reworded to the Council's published sentence, which the about
page and the standard page both carry verbatim: the Council does not enforce compliance, and
whether an entity must comply or validate "is at the discretion of organizations that manage
compliance programs, such as a payment brand, acquirer, or other entity."

**For later verification tasks:** the ban on requirement numbers is necessary and not sufficient.
An item can launder gated requirement text into plain English and pass every check. Ask what the
key would need the reader to know, then ask whether you have read that sentence.

#### An item refuted on its own arithmetic

`gdpr.02` set awareness at 09:00 Monday and asked what was required "by Wednesday at 09:00". The
72-hour mark is 09:00 **Thursday**; Wednesday is 48 hours. The key was right about Article 33 and
the stem was quietly teaching a wrong deadline to any candidate who counted. Fixed to Thursday
and to name Article 33. Cheap to catch, invisible to every check — **do the clock arithmetic**.

#### No second-correct-answer defects, and no duplicate options

All 32 items were checked for a defensible second answer and for two options asserting the same
claim: zero of each. Wave A's five-in-138 rate did not repeat here, which is worth recording
because the competency's regulation-heavy material makes an accidental second-correct answer easy
(any two options that both say "no" for overlapping reasons). The distractors here consistently
fail on a stated, checkable fact rather than on hedging.

#### Scan numbers after the rewrites

Keys 0% two-clause, distractors 0% two-clause — a 0-point gap, well inside the ~15-point limit.
No six-token tail reused 3 or more times. Key is the longest option in **11 of 32** items (34%,
limit 40%) — it was 16 of 32 immediately after the rewrites, fixed by extending five distractors
with real, false, single-sentence content rather than by shortening any key. Scoped
`check-bank` with only `q-answer-position-balance` suppressed: **0 errors, 0 warnings**.

### DevOps Fundamentals :: Git Concepts (task 50, `verify-git-concepts`)

38 items over 22 concepts, all 38 carrying a verdict. **34 items were refuted and repaired; 4
confirmed as filed** (`merge-conflict.01`, `push.01`, `push.02`, `revert-vs-reset.02`). 32 were
refuted because the sources as filed did not carry a claim made in the key or in a distractor's
`why`, and gained at least one primary source; 3 were refuted because the item's prose quoted or
paraphrased documentation that has since changed (`rebase.01`, `fetch-vs-pull.01`,
`fetch-vs-pull.02` — the first and third of those needed no new source, only correct prose).
**No item was refuted on a wrong key, and the second-correct-answer sweep found none.** An 89%
refutation rate against wave B's 58% is a statement about this competency's sourcing, not about
its content: the keys were overwhelmingly right and the citations overwhelmingly were not.

#### The whole competency rested on a Pro Git page that documents no command

Fourteen items cited `progit-what-is-git` (Pro Git 1.3, "What is Git?") as their only primary
source. That page is a real leaf page, not an index — but its subject is snapshots, locality,
integrity and the three states, and **it documents no command and no option anywhere.** It was
cited for `git init`, `git log`, `git commit -a`, `git status`'s headings, bare `git diff`,
commit-message conventions, forking, and the standard fork-and-clone contribution route, none of
which appear on it. This is the landing-page shape in a form worth naming separately: not a page
one click above the answer, but **a conceptual overview standing in for a reference page**. It
reads as a plausible citation precisely because it is about Git and is correct about what it does
cover.

Eighteen sources were registered to repair it, each fetched and read before citing:
`progit-about-version-control`, `progit-recording-changes`, `git-init`, `git-commit`,
`git-status`, `git-log`, `git-diff`, `git-branch`, `git-checkout`, `git-switch`, `git-clone`,
`git-remote`, `git-fetch`, `git-tag`, `git-request-pull`, `git-submitting-patches`,
`github-docs-about-forks`, `github-docs-creating-a-pull-request`. Each was added to the citing
concept's `additional_sources` as well, so the orphan-source count is unchanged.

Two repairs are worth quoting because the added page settles the item outright rather than merely
covering it:

- `working-directory-staging-area-and-repository.02` keyed on `git commit -a` skipping untracked
  files. git-commit(1): "**-a, --all**  Automatically stage files that have been modified and
  deleted, but new files you have not told Git about are not affected."
- `commit-messages.01` keyed on a message supplying *why* and what alternative was rejected. The
  Git project's own **SubmittingPatches** says the body "explains the problem the change tries to
  solve", "justifies the way the change solves the problem", and records "alternate solutions
  considered but discarded, if any" — the key almost clause for clause. That document was not
  registered as a source anywhere in the project before this pass.

#### Two stale quotations of git documentation that has since changed

Both the item and the guide attributed to `git-rebase(1)` a sentence it no longer contains.

- `rebase.01`'s rationale and its `o4` why both said "the documentation notes this has the same
  effect as `git reset --hard <upstream>`". The current git-rebase(1) simplified description is:
  list the commits with no equivalent upstream, "**Check out `<upstream>` with the equivalent of
  `git checkout --detach <upstream>`**", "**Replay the commits, one by one, in order. This is
  similar to running `git cherry-pick <commit>` for each commit**", then repoint the branch "with
  the equivalent of `git checkout -B <branch>`". Rationale and why rewritten.
- The guide's **rebase** "How it works" paragraph carried the same dead quote and was rewritten to
  the current four-step description. `data/`'s `description` for the concept was already correct.

**For later verification tasks:** a quotation attributed to a man page is not verified by the page
existing. Search the fetched text for the sentence. A doc quote that was true when the guide was
written is the one defect no amount of internal consistency will catch.

#### `git pull` no longer defaults to a merge, and three places said it did

git-pull(1)'s DESCRIPTION now lists four integration options and states plainly: "`git pull
--ff-only` will only do 'fast-forward' updates: it fails if your local branch has diverged from
the remote branch. **This is the default.**" The other three are `--rebase`, `--no-rebase` (which
runs `git merge`), and `--squash`.

Three artefacts contradicted that, all corrected:

- `fetch-vs-pull.01`'s rationale and `o2`'s why described the integration step as "by default a
  merge, or a rebase if configured".
- `fetch-vs-pull.02`'s rationale listed `--ff-only` among the flags that *resolve* a diverged
  pull. It is the default and the thing that fails on divergence.
- The **guide**'s fetch-vs-pull block was internally contradictory in a way that reads as correct
  on a skim: its "What it is" paragraph said "by default a merge, or a rebase if configured or
  asked for", while its "How it works" paragraph four lines below already said "`--ff-only` is the
  default when no reconciliation method is given". "What the exam may test" repeated the wrong
  half. Both corrected; `data/`'s `description` ("pull fetches and immediately merges") was stale
  the same way and was corrected too.

This is the **true-but-misreadable guide prose** class in its sharpest form — the block contained
the right sentence, so a check-guide pass and a reader who scrolled far enough would both be
satisfied, while the summary line a candidate actually memorises taught the opposite.

#### The `pull-request` items: what they cite, and one landing page caught

Both `pull-request` items cite **GitHub's** documentation, not git-scm.com, which is the correct
outcome of the Task 2 un-waiving. `pull-request.01`'s key asserts that a pull request is "defined
nowhere in git-scm.com's documentation" — an absence claim, so it was tested rather than assumed:
**gitglossary(7) was fetched and searched in full and contains zero occurrences of the phrase
"pull request"**, and the only git-scm.com command carrying those words is `git-request-pull(1)`,
"Generates a summary of pending changes", which opens nothing. That command is now registered and
cited, which also closes factcheck finding GC-031's concern about the flat "no Git command" claim.

`pull-request.02` was a genuine landing-page failure. Its key — that pushing further commits to
the source branch updates the open request — was cited to
`github-docs-about-pull-requests`, whose URL **now redirects to GitHub's "Pull requests" hub
page**. That page covers tabs, drafts, PR refs and the fork-and-pull model, and never states the
claim. The leaf page "Creating a pull request" does: "After you open your pull request, you can
continue changing files by adding new commits to your head branch." Registered as
`github-docs-creating-a-pull-request`. **A citation that was a leaf page when it was filed can
become a hub page later; re-fetch, do not trust the slug.**

#### `clone-vs-fork` cited a page that never mentions forking, in either sense

Both items rest on a comparison block whose two halves are a platform fork and an open-source
project fork. The only primary source was `progit-what-is-git`, which contains neither.
`github-docs-about-forks` supplies the first ("Forks are repositories that start as copies of
another repository, called the upstream repository. A fork has its own settings and permissions
but stays connected to the upstream repository"), and `osi-osd` clause 3 supplies the licence half
("The license must allow modifications and derived works, and must allow them to be distributed
under the same terms as the license of the original software") — the source the paired concept
`pm.open-source-software-and-licensing.forking-a-project` already used, never wired to this side
of the block. GitHub's pull-request documentation also states the contribution route the second
item keys on: "You do not need permission from the upstream repository to push to a fork you
created."

#### No second-correct-answer defects and no duplicate options

All 38 items were swept for a defensible second answer, with the command-semantics cases the wave
notes single out checked individually: `reset`'s three modes against git-reset(1)'s mode table,
`revert` versus `reset`, `fetch` versus `pull` under the new `--ff-only` default, `merge`'s
fast-forward case, and `checkout -b` versus `switch -c` versus plain `switch`. **Zero double
keys.** The four closest calls, each checked and each genuinely false:

- `version-control.02` `o2` — a scheduled backup *would* contain yesterday's file, but the option
  text itself concedes it "restores the whole system to one point in time, not a single document",
  which is not what the stem asks for.
- `rebase.02` `o4` — narrows the hazard to a colleague who has committed on top. Divergence exists
  as soon as the colleague's clone holds the pre-rebase commits.
- `clone-vs-fork.02` `o4` — asking an administrator for write access would work, but the stem asks
  for the contributor's correct first step, and the option needs action from the project's owners.
- `revert-vs-reset.01` `o4` — its first clause ("revert is safe") is right and its second names
  merge instead of rebase, so the option as a whole is false.

Every `why` was checked against its own option text for the wave-B contradiction pattern. One near
miss worth recording: `remote-and-origin.02`'s `o1` and `o4` **name the same command**,
`git remote -v`, differing only in where `-v` sits. That survives the duplicate-option rule
because git-remote(1) makes the placement itself the documented fact — "NOTE: This must be placed
between `remote` and subcommand" — so the discrimination is real rather than cosmetic. It is
recorded here because it is the shape that would be a defect in almost any other item.

#### Scan numbers

Unchanged, because **no option text was rewritten** — all 34 repairs landed in `source_ids`,
`why` and `rationale`. Em-dash trailing clause: keys **39%**, distractors **4%**, before and
after. Two-clause options: keys 0%, distractors 0%. No six-token tail reused 3 or more times. The
39/4 gap is the corpus-wide shape tell the separate rule-based pass will fix; nothing here was
added to it. Scoped `check-bank` with only `q-answer-position-balance` suppressed: **0 errors,
0 warnings**, `q-verdict-coverage` included.

### IT Project Management :: Open Source Software and Licensing (task 48, `verify-oss-licensing`)

31 items over 22 concepts, all 31 carrying a verdict. **8 items were refuted and repaired on
content; 23 confirmed**, though 9 of those 23 were confirmed only after their citations were
replaced. **No item was refuted on a wrong key**, and the second-correct-answer sweep found none:
every key here was substantively right. What was wrong was where the items said their facts came
from, and — in six cases — what a distractor's `why` asserted about the world.

#### `spdx-license-list` was cited eight times for licence text it does not contain

`https://spdx.org/licenses/` is the SPDX License List: a sortable table of full name, short
identifier, "FSF Free/Libre?" and "OSI Approved?". It carries **no licence text**. The string
`endorse` does not occur on it anywhere, and it was cited for BSD-3-Clause's non-endorsement
clause; it was likewise cited for MIT's notice condition, MIT's silence on patents, Creative
Commons compatibility, and SBOM formats. This is the landing-page shape in its purest form — the
page is one click above every text it indexes, and each of those texts has its own canonical URL
which the SPDX row links to.

Repaired by registering and reading the texts themselves: `osi-bsd-3-clause`, `gnu-gpl-3`,
`gnu-gpl-2`, `osi-lgpl-2-1` (added), alongside the pre-existing `osi-mit-license`,
`apache-license-2`, `gnu-lgpl-3` and `gnu-agpl-3`. `spdx-license-list` was **retained only for
`gpl`**, where the claim genuinely is about identifiers (`GPL-2.0-only` versus
`GPL-2.0-or-later`), which is exactly what that page is authoritative for.

#### The defect originates in `data/`, not in the questions

Every question's `source_ids` mirrored its concept's `additional_sources` in
`data/topics/06-it-project-management.json`. The concept `mit-and-bsd-licenses` cited
`["spdx-license-list", "osi-osd"]` — an identifier table and the ten-criterion definition — for a
concept whose whole content is what two licence texts say. Sixteen concepts' `additional_sources`
were corrected to match the repaired citations, so no orphan sources were introduced;
`npm run validate` warning count is unchanged at 16.

#### `gnu-agpl-3` pointed at a navigation wrapper, not the licence

`https://www.gnu.org/licenses/agpl-3.0.html` returns roughly 8 KB of site navigation and format
links with **no licence text at all**; the text lives at `agpl-3.0.en.html` (36 KB, section 13
"Remote Network Interaction" included). The source's URL was corrected. Same shape as the SPDX
finding, one level smaller: a real page about the right document that does not contain it.

#### Wrong section number, repeated across two `why` fields

`gpl.02` attributed GPLv3's express patent grant to **section 5** in both the key's `why` and
o3's `why`. GPLv3 section 5 is "Conveying Modified Source Versions"; the patent grant, with its
contributor and essential-patent-claim definitions, is **section 11**. Corrected in both. The
substantive claim survived: reading the full GPLv2 text, `patent` appears only in the preamble
and in section 7's conflicting-obligations clause — there is no grant and no termination
provision anywhere in it.

#### Six distractor `why` fields asserted things that are false

This was the dominant content defect, and it is the one that teaches a wrong lesson under the
guise of a correction:

- `gpl.01` o2 — "driver linking is instead addressed by [the kernel's] explicit syscall
  exception". It is not. The kernel licensing rules describe the syscall note as the UAPI
  boundary, which "does not extend the GPL requirements to any software which uses it to
  communicate with the kernel" — user-space programs, not drivers built into the kernel.
- `governance-and-foundations.01` o2 — "CLA terms are set per project even when a shared
  foundation hosts several of them; there is no single agreement that overrides each project's
  own." False for one of the two foundations the stem names: "An individual must have submitted a
  signed ICLA to the ASF **before we give them commit rights to any ASF project**." The option was
  replaced outright with a paid-staff option refuted verbatim by "All participants in ASF projects
  are volunteers and nobody (not even members or officers) is paid directly by the foundation."
- `contributor-license-agreement.01` o2 — repository access is "unrelated to either agreement".
  Same ASF sentence refutes it; a signed CLA is a precondition there. Reworded so the option stays
  false while every fact in the `why` is true.
- `apache-license-2-0.01` — the stem asked what happens to "that contributor's patent grant",
  which reads as the grant the contributor **made**. Section 3 terminates "any patent licenses
  granted to **You** under this License" — the licences the litigant **holds**. Stem and key
  rewritten in the licence's own direction.
- `gpl.02` o4 — rested on the FSF's licence-list judgement about Apache-2.0/GPLv2
  incompatibility, which no cited source carried. Rewritten to rest on Apache-2.0 section 3's own
  words instead.
- `proprietary-software.01` o3 — "Freeware is a price point layered on top of ordinary
  proprietary terms" is a definitional claim about *freeware* that no cited source makes; the
  gnu.org page that does define it (`philosophy/categories.html`) was not cited. Rewritten to rest
  only on what `gnu-free-sw` says.

#### One `why` argued from the exam rather than from the world

`contributing-to-open-source.01`'s key `why` read: "The exam treats contribution as a process
question, and the reliably testable fact is that the change is proposed, not applied, by the
contributor." That states nothing about the world and cannot be checked against any document.
Replaced with GitHub's own "Pull requests are proposals to merge code changes into a project" and
the fork-and-pull model description, and `github-docs-about-pull-requests`,
`github-docs-about-forks` and `git-clone` were registered against the two fork concepts, which had
been citing `osi-osd` — a licensing definition — for the fork-versus-clone distinction.

#### Guide adjudication: the compressed reference cells are correct

Two instances of the "true-but-misreadable guide prose" class flagged after wave B appear in this
file, both comparison-table cells that name a source and then state a rule:

- `open-source-software-and-licensing.md` line 407: "Yes, under LGPLv3 section 4's relink
  conditions (LGPL-2.1 section 6)". **Confirmed correct.** LGPLv3 section 4 and LGPL-2.1 section 6
  are the corresponding provisions; 2.1 section 6 reads "you may also combine or link a work that
  uses the Library with the Library... and distribute that work under terms of your choice", with
  6(a)/6(b) carrying the relink and shared-library conditions. gnu.org's old-licenses pages would
  not respond during this task, so the text was read at the OSI and registered as `osi-lgpl-2-1`.
- line 501: "Yes, section 3, terminating on patent litigation". **Confirmed correct** against the
  Apache-2.0 text.

The guide's GPLv3 section numbering is right where the questions' was wrong: line 366 correctly
assigns the modified-source conditions to section 5, and line 370 says only that "GPLv3 adds to
GPLv2 an express patent grant" without naming a section. No guide or `data/` description needed
changing on content; only `additional_sources` moved.

#### Unresolved

- Line 489 of the guide asserts the FSF treats Apache-2.0 as GPLv2-incompatible "including the
  patent-termination provision". `gnu.org/licenses/license-list.html` and
  `gnu.org/philosophy/categories.html` both timed out repeatedly from this host across the whole
  task while other gnu.org pages served fine. Nothing contradicts the claim and it was not
  changed, but it remains **unverified against a fetched primary source** and no question depends
  on it any longer — `gpl.02` o4 was rewritten off it.

#### Scan numbers

Em-dash tell **unchanged at keys 52% / distractors 6%** before and after; the rewrites of
`apache-license-2-0.01` and `governance-and-foundations.01` added no em dash to any option and the
one removed from the Apache key was not in a position the scan counts. Two-clause tell 0%/0%. No
six-token option tail is reused three or more times. **No item in this file cites
`lf-objectives-2025` as its only source** (all 31 carry a `lf-objectives-2025` official source at
the concept level plus at least one primary document). No item turns on a PCI DSS requirement
number.

### Cloud Computing Fundamentals :: Networking, items 27–49 (task 52b, `verify-cloud-networking-b`)

23 of 23 items in the range carry a verdict. **20 were refuted and fixed; 3 were confirmed as
they stood** (`vpc-peering-and-private-connectivity.03`, `private-service-endpoints.01`, and — on
content but not on citation — nothing else). The dominant defect is the one this wave was warned
about: **the landing-page defect**, a source cited one or two clicks above the page carrying the
sentence. 19 of the 20 refutations were citation failures; 3 items also had content defects.

Sources fetched and found *not* to contain the claim they were cited for:

- `aws-elastic-load-balancing` (the ELB overview) on all three `cloud-load-balancer-types` items.
  The page has no layer-4/layer-7 material of any kind — the same failure already recorded against
  this source in another file. The claims are one click down: ALB "functions at the application
  layer, the seventh layer of the Open Systems Interconnection (OSI) model"; NLB "functions at the
  fourth layer". `aws-alb-introduction` / `aws-nlb-introduction` substituted.
- `aws-vpc-peering` (what-is) on `vpc-peering-and-private-connectivity` items 01, 02 and 04, and on
  `cidr-planning-for-cloud-networks.01`. Non-transitivity, the overlapping-CIDR bar, and the
  must-add-routes step are all on `vpc-peering-basics`, not the landing page. Note the landing page
  *is* correctly cited on item 03 — it carries the inter-Region encryption sentence verbatim — so
  the source is not bad, only over-applied.
- `aws-vpc-route-tables` (the VPC_Route_Tables contents page) on `cloud-route-tables` 01, 02 and 03.
  It defines no public subnet, states no longest-prefix rule, and says nothing about Google Cloud.
  Replaced with `aws-vpc-configure-subnets`, `aws-vpc-route-priority` and `gcp-vpc-routes`.
- `azure-expressroute` (the ExpressRoute introduction) on `hybrid-connectivity` 02. **The page never
  mentions encryption at all**, so the key rested on an absence rather than a statement. Microsoft's
  dedicated page settles it: "By default, traffic over an ExpressRoute connection isn't encrypted."
- `azure-bastion` on `bastion-and-jump-hosts.03`, an item entirely about session logging. The Bastion
  overview has no logging or auditing content whatsoever. `aws-session-manager` added.
- `aws-privatelink` (what-is) on `private-service-endpoints.03`. The page never mentions DNS, and the
  item's whole premise is DNS transparency. `aws-privatelink-aws-services` carries it: "if you have
  existing applications that send requests to the AWS service using a public Regional endpoint,
  those requests now go through the endpoint network interfaces, without requiring that you make any
  changes to those applications."
- Three-provider naming items (`hybrid-connectivity.04`, `private-service-endpoints.02`) each cited
  one provider's page for a claim about three. All three vendor overviews now cited in each.

Content defects found, beyond citation:

1. **`cloud-load-balancer-types.03` — two options asserting the same fact, and an unsourceable key.**
   The stem asked for "current layer 7 load balancer naming" but the key answered with a
   *description* ("a proxy-based layer 7 load balancer") rather than the name, and its load-bearing
   half — that Google renamed HTTP(S) Load Balancing — is not stated on any current Google page I
   fetched. `factcheck-cloud-networking.json` claim `cloud-networking-017` marks this "confirmed"
   while its own reasoning concedes that "current pages no longer foreground" the old name; that is
   a rename asserted from general knowledge, not from the cited source. Worse, distractor o2's `why`
   asserted the *same* content as the key. **Rewritten** as a three-provider naming pairing, each
   half quotable: AWS Application Load Balancer, Azure Application Gateway, Google Cloud Application
   Load Balancer ("The Application Load Balancer is a proxy-based Layer 7 load balancer").
2. **`cidr-planning-for-cloud-networks.03` — a distractor `why` stating a false fact.** o4's `why`
   said a VPC CIDR block is "sized in the tens of thousands of addresses at minimum". The documented
   minimum is a /28, sixteen addresses. Rewritten. The key's arithmetic was recomputed by hand and
   is correct: 2^(32−16) = 65,536 and 2^(32−28) = 16, matching AWS verbatim.
3. **`cidr-planning-for-cloud-networks.02` — a generic claim true of three different mechanisms.**
   The key said the range "can grow after creation on all three major providers" while citing only
   an AWS peering page and the Azure VNet overview. The three mechanisms are not the same operation:
   AWS *adds a further CIDR block* (an existing block's size cannot change), Azure *adds an address
   range*, and Google Cloud has no parent network CIDR at all — growth there is *expanding a
   subnet's primary IPv4 range*. Key text, key `why` and o3's `why` rewritten with each provider
   attributed and cited. o3's old `why` also dodged rather than refuted, appealing to what "the
   competency concerns" instead of to a fact.
4. **`hybrid-connectivity.03` — both the key's `why` and o2's `why` cited "the guide"**, which is not
   a verdict basis. Primary source found: Microsoft, "If a virtual network has address ranges that
   overlap with another virtual network or on-premises network, the two networks can't be connected"
   — which covers the hybrid case as well as the peering case, so the key's substance survives.
5. **`cloud-route-tables.03` used "instance tag"**, which is not Google's term. Changed to "network
   tag" to match "Static routes can apply to: … Only VM instances identified by network tags".

Per-provider attribution checked on every item that could carry it. No generic claim true of only
one provider survives in this range: item `vpc-peering-and-private-connectivity.03` names AWS
explicitly for the inter-Region encryption statement and its o3 correctly declines to generalise it,
and `hybrid-connectivity.02` o3 exists precisely to catch a reader who would.

**`data/` finding, confirmed and fixed.** `cloud.networking.cloud-load-balancer-types`'s
`description` still named Google's layer 7 product "HTTP(S) Load Balancers". The **guide prose was
already correct** — it uses the current name and flags the old one as historical — so this is
another instance of the cycle-2 divergence where only `data/`'s description is stale. Updated to
"Network Load Balancer and Application Load Balancer (the layer 7 product was formerly named
HTTP(S) Load Balancing)", `npm run generate` re-run, `npm run check-guide` clean at 0/0.

Seventeen sources were registered and each was also added to the owning concept's
`additional_sources` in `data/topics/03-cloud-computing.json`, per the `check-orphan-sources` rule:
`aws-vpc-peering-basics`, `aws-vpc-route-priority`, `aws-vpc-cidr-blocks`, `gcp-vpc-routes`,
`aws-direct-connect`, `gcp-cloud-interconnect`, `azure-private-link`, `gcp-private-service-connect`,
`aws-session-manager`, `azure-application-gateway`, `gcp-application-load-balancer`,
`aws-site-to-site-vpn`, `azure-manage-virtual-network`, `gcp-vpc-create-modify`,
`azure-expressroute-encryption`, `aws-privatelink-aws-services` (plus the pre-existing
`aws-vpc-configure-subnets`, newly wired to `cloud-route-tables`).

Shape: the em-dash tell in this range was measured before and after and is **unchanged at keys 57%
(13/23) versus distractors 16% (11/69)**; whole-file 51%/16% before and after. No rewrite in this
range added or removed an em-dash tail, and the rewritten item 29 has none on any option. No
code-span-only option and no six-token tail reused three or more times was found in the range.

Items 1–26 belong to `verify-cloud-networking-a` and were not touched; the scoped `check-bank` run
reports 26 residual `q-verdict-coverage` errors, all of them theirs.

### Cloud Computing Fundamentals :: Cloud Computing, items 1–28 (task 49a, `verify-cloud-computing-a`)

28 of 28 items in the range carry a verdict. **All 28 were refuted on the first pass and all 28
were fixed and re-verified to `confirmed`.** No item in the range had a wrong key, and no item had
a second defensible option — the content was sound throughout. The defects were a file-local
structural corruption, seven citation failures, and one option that spoke about the exam from
inside its own text.

**1. The self-refuting distractor (the dominant defect, and it is file-local).**

74 of the 84 distractors in this range had their own `why` appended to their `text` after a
semicolon, so the option announced that it was wrong. Example, item 1 `o2`:

> text: "Yes — running many isolated VMs on shared physical hosts is what NIST means by cloud
> computing; **this describes virtualization, the enabling technology; NIST's definition is about
> self-service, elasticity and metering, none of which the ticket-and-flat-rate process provides.**"
> why: "That describes virtualization, the enabling technology; NIST's definition is about
> self-service, elasticity and metering, none of which the ticket-and-flat-rate process provides."

Zero keys carry the appended text, so a reader could score the whole range without reading a
source. A corpus-wide scan (`text` ends with a lowercased `why`, first word optional) shows this is
**not** a bank-wide authoring habit — it appears in exactly two files:

| file | affected distractors |
| --- | --- |
| `questions/03-cloud-computing/cloud-computing.json` | 124 / 168 |
| `questions/02-system-administration/system-administration.json` | 83 / 384 |
| every other file (20 of 22) | 0–1 / total |

All 74 in items 1–28 were rewritten so the text states only the claim. **The remaining 50 in items
29–56 belong to `verify-cloud-computing-b`, and the 83 in `system-administration.json` belong to
whoever verifies that file — neither was touched here, and both are still live.** The scan is one
command and is worth running against any file before verifying it:

```bash
node -e "const b=require('./questions/<dir>/<file>.json');const n=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();let a=0,t=0;for(const i of b.items)for(const o of i.options){if(o.correct)continue;t++;const x=n(o.text),w=n(o.why),wt=w.split(' ').slice(1).join(' ');if(x.endsWith(w)||(wt.length>25&&x.endsWith(wt)))a++;}console.log(a+'/'+t);"
```

**2. Sources fetched and found not to contain what they were cited for.**

- `aws-regions-and-azs` and `azure-availability-zones` on `major-cloud-providers.01`, the item
  mapping Amazon S3 / Azure Blob Storage / Google Cloud Storage to a service category. Both pages
  are about Regions and Availability Zones; neither mentions object storage, S3, Blob Storage or
  Cloud Storage. Registered and substituted `aws-s3-what-is` ("Amazon Simple Storage Service
  (Amazon S3) is an object storage service") and `azure-storage-introduction` ("Azure Blob Storage
  is Microsoft's object storage solution for the cloud"). Both AZ sources are correctly cited on
  `major-cloud-providers.02` and were kept there — Azure's page carries "independent power,
  cooling, and networking infrastructure" verbatim — so this is over-application, not a bad source.
- `nist-sp-800-145` on `public-cloud.01` (tenant isolation) and `public-cloud.02` (cloud
  economics). SP 800-145 is five pages of definitions; it says nothing about either. All seven
  pages were read. Registered `nist-sp-800-146`, its companion, which states both: "The workloads
  of different clients may reside concurrently on the same system and local network, separated only
  by access policies implemented by a provider's software", and "Whether or not cloud computing
  reduces overall costs for an organization depends on a careful analysis of all the costs".
- `nist-sp-800-145` on `paas.01`, `paas.02` and `saas.02`, all of which turn on PaaS-versus-FaaS
  billing. SP 800-145 contains no billing statement beyond footnote 1. `cncf-glossary-faas`
  supplies it — "Charges apply solely for the duration of computation... distinguishing it from
  other models like Platform as a Service (PaaS), which require continuous resource availability" —
  and was added. (SP 800-145 does independently license per-seat SaaS billing: "active user
  accounts" is one of its named metering units.)
- `nist-sp-800-145` on `iaas.02` and `saas.01`, both shared-responsibility items. The key of
  `iaas.02` uses AWS's exact wording, "the virtualization layer and host operating system"; the AWS
  page says the customer "assumes responsibility and management of the guest operating system
  (including updates and security patches)". `aws-shared-responsibility-model` added to both.

Against the wave's warning list: `nist-sp-800-145` **is** genuinely the right source for the
definition, the five characteristics, the three service models and the four deployment models, and
was verified sentence by sentence for each — including "in some cases automatically" on rapid
elasticity, which no item in this range misquotes. `cncf-glossary-serverless` and
`cncf-glossary-faas` were both fetched and both genuinely contain what the two
`serverless-and-faas` items cite them for, including "Serverless is a comprehensive term...
extending from Platform-as-a-Service (PaaS) to Software-as-a-Service (SaaS)". No item in the range
cites `lf-objectives-2025` as its only source. No PCI DSS requirement number appears.

**3. The option that referred to the exam.** `essential-characteristics.01` `o4` said "vendor
neutrality describes **the exam's own scope**, not a NIST characteristic". Both the text and the
`why` were rewritten to state the fact instead: vendor neutrality is not one of NIST's five, and
that list also drops on-demand self-service.

**4. Five key `why` fields cited "the guide" for a sentence the primary source states directly**
(`iaas.01`, `paas.02`, `serverless-and-faas.02`, `public-cloud.01`, `public-cloud.02`, `saas.02`).
Each was regrounded on the quotation itself. This is the same shape as a landing-page citation: the
claim is true, but the reader is pointed at the wrong authority for it.

**No finding against `data/` descriptions or the guide prose.** Every guide claim these 28 items
lean on was checked against SP 800-145, SP 800-146, the two CNCF glossary entries, the AWS shared
responsibility model and AWS's multicloud page, and all held. The `data/` defect found here is in
`source_ids`, not in `description`: item sources mirror the concept's `official_sources` +
`additional_sources`, so a concept with an under-specified source list propagates it into every
item written from it — the Task 48 shape, confirmed again. Fixes were therefore made at the concept
level in `data/topics/03-cloud-computing.json` (`major-cloud-providers`, `iaas`, `paas`, `saas`,
`public-cloud`) as well as on the items. `npm run generate` re-run; `npm run check-guide` clean at
0/0; `npm run validate` 537 concepts, 0 errors (the two new sources are wired, so neither is an
orphan).

**Shape.** Stripping 74 appended clauses shortens distractors, so the length tell had to be paid
for: 14 items would have crossed the 1.6 key/distractor ratio and 20 of 28 would have had the key
as the longest option. Distractors were **lengthened with real but false clauses** — no key was
truncated — and six were given the same trailing em-dash qualifier shape the keys use. Range 1–28,
before → after: em-dash keys 50% → 50%, distractors 46% → 44% (the "before" distractor figure is
inflated by em-dashes inside the appended `why` text); mean option length keys 149 → 151,
distractors 232 → 129; items over the 1.6 ratio 0 → 0; key-is-longest 4/28 → 9/28 (32%, under the
40% bar). Whole-file em-dash reads keys 57% / distractors 32% only because items 29–56 still carry
their appended clauses; it was 57%/40% before. No six-token tail is reused three or more times in
the range and no item has two options asserting the same answer.

The scoped `check-bank` run reports 27 residual `q-verdict-coverage` errors and 7 `q-length-cue`
warnings, **all of them in items 29–56 and none in this range**.

### IT Project Management Fundamentals :: Project Management (task 51, `verify-project-management`)

37 items over 29 concepts, all 37 given a verdict. No item was rewritten: every defect found was a
citation defect, and the normative repair (task 3, `hypervisor`) is to fix the citation rather than
weaken correct content. 16 items were refuted on citation; 12 of those were repaired by citing a
source already registered in `data/sources.json`, and 4 could not be repaired at all.

#### 16 of 37 items cited `lf-objectives-2025` as their only source, and that page has no content

Fetched https://training.linuxfoundation.org/lfca-program-changes-2025/ and extracted the whole
page: 4,830 characters, of which the substantive part is the domain list with weights (Linux
Fundamentals 16%, System Administration 30%, Cloud 18%, Security 14%, DevOps 12%, IT Project
Management 10%) and the competency names beneath each. It contains no definition of anything. The
16 items are the 13 waived concepts' items:

`project.01`, `triple-constraint.01`, `stakeholder.01`, `deliverable-and-milestone.01/.02`,
`waterfall.01`, `gantt-chart.01`, `critical-path.01`, `scope-creep.01/.02`, `raci.01`,
`issue-tracking.01`, `project-budget-and-resource-management.01`, `communication-plan.01`,
`project-closure-and-lessons-learned.01/.02`.

#### The NASA Systems Engineering Handbook is already registered and settles six of the waived concepts

`nasa-se-handbook-sp-2016-6105` (tier 2, URL live, 297pp, re-fetched and re-read this pass) turns
out to carry primary text for concepts the waiver assumed only PMBOK covered:

- **Project** — Appendix B: "Project: A specific investment having defined goals, objectives,
  requirements, life cycle cost, a beginning, and an end."
- **Stakeholder** — Appendix B: "Stakeholder: A group or individual who is affected by or has an
  interest or stake in a program or project."
- **Critical path** — §6.1: "'Critical path' is the sequence of dependent tasks that determines the
  longest duration of time needed to complete the project", with float defined as "how much spare
  time ... exists for all the other activities of the project."
- **Gantt chart** — Appendix B: "Gantt Chart: A bar chart depicting start and finish dates of
  activities and products in the WBS", and "Precedence Diagram: Workflow diagram that places
  activities in boxes connected by dependency arrows; typical of a Gantt chart."
- **Scope creep** — §6.2 has a *Requirements Creep* passage: creep is "the subtle way that
  requirements grow imperceptibly during the course of a project", and its named defences are a
  strict assessment process, official channels establishing "who has the authority", impact
  measurement, and a check against resource budgets. This is the controlled-change/creep
  discrimination both `scope-creep` items turn on, stated in a free primary source.
- **Project closure and lessons learned** — §3.9 Phase F Closeout: closeout "may proceed according
  to established plans or may begin as a result of unplanned events, such as failures", which
  settles that closure is not conditional on finishing; §5.5 Product Transition and the System
  Acceptance Review settle acceptance-and-handover as the closing steps.

`nasa-wbs-handbook-sp-2016-3404-rev1` (also already registered) additionally separates "the tasks
(activities) and events (milestones)" in §4.3 and defines an End Item as "an item of software or
documentation that is deliverable to a user or customer", which is the deliverable/milestone
discrimination.

**Not de-waived here, deliberately.** Removing these from `data/sourcing-waivers.json` and adding
the sources to the concepts changes `waived_source` on every affected item and moves the bank-wide
validate warning count (each newly-sourced waived concept raises a `stale-waiver` warning until the
waiver entry is removed). That is a `data/` task, not a verification task. Recommendation: a
follow-up task de-waives at least `project`, `stakeholder`, `critical-path`, `gantt-chart`,
`scope-creep`, `deliverable-and-milestone` and `project-closure-and-lessons-learned` onto the two
NASA handbooks, taking the project-management waiver list from 13 to 6.

Items were repaired by adding the already-registered source ids to `source_ids` only. No entry was
added to `data/sources.json` and no concept's `additional_sources` was touched, so this pass
contributes zero new validate warnings.

#### Four waived items remain unverifiable against any accessible source

`triple-constraint.01`, `raci.01`, `project-budget-and-resource-management.01` and
`communication-plan.01`. Each was searched for specifically in the accessible corpus and each came
up empty:

- **RACI** — the NASA SE Handbook mentions RACI exactly twice: as an acronym expansion in
  Appendix A ("RACI Responsible, Accountable, Consulted, Informed") and as a parenthetical in
  Appendix D that *links to Wikipedia*. Neither says anything about cardinality, so the item's key
  (several Responsible, exactly one Accountable) has no primary anchor. The NASA WBS Handbook's
  Responsibility Assignment Matrix is adjacent — a control account "has a responsible organizational
  element or individual identified" — but is not RACI.
- **Triple constraint** — NASA frames project management as "managing the technical aspects of the
  project, managing the project team, and managing the cost and schedule", which is a different
  triple from scope/time/cost bounding quality.
- **Budget and resource management** — NASA covers budgeting, baseline budgets and resource
  levelling, but the item's key is Brooks' result about adding staff to late work, which appears in
  no reachable standard.
- **Communication plan** — NASA defines stakeholders and requires change decisions to be
  communicated to affected organisations, but has no influence/interest communication grid. The
  handbook's single "Communication Plan" hit is a bibliography entry.

These four carry `confirmed` verdicts under the waiver's own `question_policy` (consensus
definitions only), with the sourcing limitation written into each item's `verification.reasoning`.
They are the residual risk of this competency and should be the first candidates for rewrite if the
waiver is ever tightened.

#### GAO is still unreachable, confirming the waiver's stated cause

`gao.gov/assets/gao-16-89g.pdf` (Schedule Assessment Guide, which does define milestones as
zero-duration) returned **HTTP 403**; the govinfo.gov mirror path returned an HTML error page with a
200; `pmi.org`'s Lexicon PDF returned **404**. The waiver's rationale is accurate on this point.

#### Two *non-waived* concepts cite a source that does not contain their subject

This is the same class of defect wave A and task 48 found, in a place the sourcing check cannot see:

- `pm.project-management.acceptance-criteria` cites `scrum-guide-2020` as its only independent
  source. **The 2020 Scrum Guide never uses the phrase "acceptance criteria"** (verified by
  full-text search of the fetched page). Item `.01` survives because it actually turns on the
  Definition of Done rule, which is in the Guide verbatim; item `.02` is purely about acceptance
  criteria and has no source at all.
- `pm.project-management.estimation-and-velocity` cites `scrum-guide-2020` as its only independent
  source. **The 2020 Scrum Guide never uses the word "velocity"** either. The concept's whole
  subject is outside its cited source.

Both concepts therefore pass `checkIndependentSourcing` on a source that does not cover them — an
unrecorded sourcing hole that is functionally a waiver nobody wrote down. The Agile Alliance
glossary was checked as a substitute: its user-story-template page names "Confirmation" only inside
a related-terms strip and defines neither term. Recommendation: either source these two concepts
properly or add them to `data/sourcing-waivers.json`, where they would be visible.

#### No second-correct-answer defects, no duplicate options, no stale quotes

All 37 items were checked for a distractor that is also defensible, for two options asserting the
same answer, and specifically for a distractor `why` that contradicts its own option text — the
pattern that produced the double-keys found in earlier waves. None was found. The near-misses that
were checked hardest and cleared:

- `deliverable-and-milestone.01` o2, which reframes a labelling defect as an unagreed schedule
  trade-off. It is a wrong answer to the question asked, not a second right one.
- `scope-creep.02` o3, whose `why` correctly concedes that a leg moving is a normal outcome of an
  approved trade-off — the concession is what makes the option wrong, not accidentally right.
- `estimation-and-velocity.01` o3, whose `why` states the true Scrum rule that the Developers doing
  the work are responsible for sizing; the option is false on its own claim that the Product Owner
  sets velocity.
- `critical-path.01` o2 would be defensible if the shortened task were near-critical, but the stem
  pins it off the critical path outright.

Every quotation attributed to a source was re-checked against the live document. No stale quote and
no redirect-to-hub citation rot was found in this competency; the registered NASA SE Handbook URL
still serves the 297-page PDF, and all four NIST PDFs served directly from `nvlpubs.nist.gov`.

#### PCI DSS constraint

No item in this competency mentions PCI DSS, in digits or paraphrased. Scanned for it explicitly.

#### Scan numbers

Unchanged, because no option text was rewritten: **em-dash k76% d22%, two-clause k0% d0%**, before
and after. This file remains the worst em-dash offender in the corpus and is left for the
corpus-wide pass by rule; nothing in this pass added an em-dash to a key or removed one from a
distractor. Scanned for six-token tails reused three or more times across all 148 options: none.

#### Standing open question: `feasibility-study` and `confused_with`

Reported, not fixed. Both `pm.functional-analysis.feasibility-study` **and**
`pm.functional-analysis.gap-analysis` carry an empty `confused_with` array in
`data/topics/06-it-project-management.json`, while
`study-guide/06-it-project-management/functional-analysis.md` runs the discrimination three times:
in prose at line 309 ("That judgement is a feasibility question, and a separate one from..."), in
the reference table at line 346 ("Confused with gap analysis: a gap analysis says how far apart the
current and desired states are, while a feasibility study asks whether closing that distance is
achievable and worth committing to at all"), and as self-check question 3 at line 370. The edge is
missing in both directions, so adding it is a two-concept change and creates a comparison-block
obligation. Left to the owner of the Functional Analysis material, since
`data/topics/06-it-project-management.json` is shared with it.

### Cloud Computing Fundamentals :: Networking, items 1–26 (task 52a, `verify-cloud-networking-a`)

26 of 26 items in the range carry a verdict. All 26 end `confirmed`; **16 were refuted first
and repaired**, and **8 of those needed a change to the question's own text**, not only a
corrected citation. Items
27–49 belong to task 52b and were not touched; they were already verdicted when this task
finished, so the residual `q-verdict-coverage` count attributable to 52b is **0**.

#### The landing-page defect, again, and its cause

Every item's `source_ids` in this range was an exact copy of its concept's
`official_sources + additional_sources` — the same `data/` propagation defect task 48 found.
Nine of the fourteen networking concepts carried one or two AWS pages and nothing else, so
every Azure and Google Cloud claim in the file was cited to an AWS document, and several AWS
claims were cited to the section landing page one click above the sentence. Fixed at the
concept level in `data/topics/03-cloud-computing.json` rather than item by item, then narrowed
per item.

**Sources cited for something they do not contain:**

- `aws-vpc-configure-subnets` (Subnets for your VPC) was cited by 12 of the 26 items. It does
  not define a VPC, does not mention secondary CIDR blocks, does not state the reserved-address
  rule, and mentions neither Azure nor Google Cloud. It was cited for all four.
- `aws-vpc-route-tables` is a table of contents. It was cited by all four
  `public-vs-private-subnet` items for the public/private classification rule, which is stated
  on the internet-gateway page, not there.
- `aws-vpc-security-groups-vs-nacls` (an excellent page for items 13–15) was cited by
  `security-group-vs-network-acl.04` for Azure NSG statefulness and Google Cloud firewall
  statefulness. It says nothing about either provider.
- `aws-route53` (the Route 53 Welcome page) was cited by `cloud-dns.02` for a comparison of
  DNS TTL against load-balancer health checks. It contains neither the word TTL nor any
  mention of load balancers. It was also cited by `cloud-dns.01` for the name "DNS failover",
  which it never uses — it says only that the service can "route internet traffic away from
  unhealthy resources".
- **No Google Cloud source existed anywhere in the competency's `data/` entries**, yet five
  items in this range turn on Google-specific behaviour (global VPC network, regional subnets,
  network-level firewall rules, network-level routes, the `default internet gateway` next hop).

Thirteen sources were wired in to fix this. Six already existed in `data/sources.json` as
orphans another task had registered but never cited (`aws-vpc-cidr-blocks`, `gcp-vpc-routes`,
`gcp-vpc-create-modify`, `azure-manage-virtual-network`, `aws-route53-record-ttl`,
`aws-vpc-peering-basics`), and seven were added: `aws-vpc-subnet-sizing`, `gcp-vpc-networks`,
`gcp-vpc-firewall-rules`, `azure-network-security-groups`, `aws-route53-dns-failover`,
`aws-alb-target-group-health-checks`, `aws-vpc-quotas`. Wiring them dropped the
`orphan-source` warning count by six.

#### Content defects (not citation defects)

1. **`cloud-subnets.03` had a second correct answer.** The stem asked which thing "attaches
   directly to a subnet on AWS but has no equivalent per-subnet attachment on Google Cloud,
   which instead attaches the same kind of rule to the network as a whole". A **route table**
   satisfies that description exactly — AWS associates one per subnet, Google Cloud defines
   routes at the network level — and the route-table distractor's own `why` said so:
   "Google Cloud does route traffic — it defines routes at the network level rather than per
   subnet." The distractor's rationale certified that the distractor answered the stem. Fixed
   by narrowing the stem to "which packet-filtering layer", which also excludes the security
   group (instance-level on AWS) and leaves the network ACL uniquely correct.
2. **`public-and-elastic-ip-addresses.02` had a second correct answer.** The stem asked for a
   mechanism that lets a failed instance be replaced "without waiting for any DNS record to
   update and re-cache". A layer 4 load balancer in front of the instance satisfies that as
   squarely as remapping an Elastic IP does; the distractor's `why` handled it by asserting the
   load balancer "does not explain" the masking, which is not a refutation. Fixed by adding
   "and without putting any additional network component in front of it" to the stem.
3. **`internet-gateway-and-nat-gateway.04` rested on an unsourceable negative.** The key
   asserted that Azure "has no separately named resource at all for inbound reachability" —
   contestable given Application Gateway and Front Door, and supported by nothing fetched. The
   key was rewritten onto two positively documented facts (Google's named `default internet
   gateway` next hop; AWS's attachable internet gateway resource), and the same negative was
   removed from a distractor's `why`. The guide's own prose at line 23 is more careful than the
   question was: it says "No named gateway resource" and qualifies it.

#### Generic claims that were true of only one provider

- `virtual-private-cloud.03`'s key said AWS and Azure "treat the network as a regional
  resource" — a claim neither cited page makes in that voice. Rewritten to lead with Google's
  documented "VPC networks ... are global resources ... Subnets are regional resources" and to
  state the AWS and Azure halves only as their own documentation does (AWS quotas counted as
  "VPCs per Region"; Microsoft's "any Azure resource that you connect to the virtual network
  must be in the same region as the virtual network").
- `public-and-elastic-ip-addresses.01`'s o4 `why` read "The default assignment is ephemeral",
  which holds only where AWS auto-assigns a public IPv4 address — i.e. default subnets, not
  nondefault ones, as the internet-gateway page's own table shows. Narrowed to launch-time
  auto-assignment.
- `cloud-subnets.02` and `cloud-subnets.04` were checked for the same defect and are clean:
  both attribute per-provider behaviour explicitly, and `cloud-subnets.04`'s provider-neutral
  reserved-address key holds on all three providers with AWS cited as the documented instance.

#### Two other structural defects

- **`cloud-subnets.01` had two options asserting the same answer.** o2 and o4 both opened
  "Complete isolation", differing only in rationale. o4 was rewritten to a distinct answer
  (isolation from the internet only). Yes/no items elsewhere in the range share a polarity
  across three distractors, which is structurally unavoidable and was not treated as this
  defect.
- **`cloud-dns.02`'s key was true only under an unstated assumption.** It said the balancer
  "simply stops sending traffic to the unhealthy target", but the ALB health-check page
  documents a fail-open: "If a target group contains only unhealthy registered targets, the
  load balancer routes requests to all those targets." The stem now specifies several
  registered targets with one marked unhealthy. No option changed.
- **One stale fact corrected.** `public-and-elastic-ip-addresses.03`'s o4 claimed Elastic IPs
  "cost nothing when attached to a running instance" and its `why` refuted only the quota half,
  leaving the pricing claim uncorrected. AWS now states "There is a charge for all Elastic IP
  addresses whether they are in use ... or idle". The `why` now refutes both halves.

#### Items confirmed as originally cited

`security-group-vs-network-acl.01`, `.02` and `.03` needed nothing: AWS's
infrastructure-security comparison table states all five rows those three items turn on
(level of operation, scope, rule type, rule evaluation, return traffic), and each item's key
and every distractor `why` matches it. `public-vs-private-subnet.04`,
`internet-gateway-and-nat-gateway.01`, `.02`, `.03`, `public-and-elastic-ip-addresses.01`,
`.03` and `cloud-dns.03` were correct on content, with citations strengthened or a `why`
tightened. `cloud-dns.03` matches the Route 53 Welcome page verbatim: "three main functions
in any combination: domain registration, DNS routing, and health checking".

#### Adjudication of prior findings

`docs/verification/factcheck-cloud-networking.json` holds 18 claims across these seven
concepts and every one is `verdict: confirmed`; each was re-checked against the primary page
during this task and none required a change to `data/` or the guide. The guide's networking
prose was read after the items were verdicted and was found accurate throughout — in
particular its stateful/stateless table at line 224 and its Azure gateway qualification at
line 23 are both more careful than the questions were. The only guide edit was to the seven
concepts' generated-looking `sources:` header lines, which had drifted below the concepts'
actual source lists.

#### Scan numbers

Em-dash tell in the range **improved from keys 46% (12/26) / distractors 17% (13/78) to keys
42% (11/26) / distractors 17% (13/78)** — the `virtual-private-cloud.03` rewrite dropped one
key em dash and none of the other five rewrites added one to any option. Whole-file figure
moved from keys 51% / distractors 16% to **keys 49% (24/49) / distractors 16% (24/147)**.
Two-clause tell is 0%/0% for keys and distractors both before and after. **No six-token option
tail is reused three or more times** in the range. **No item in the range cites
`lf-objectives-2025` as its only source** — all 26 carry it as the concept-level official
source plus between one and four primary provider documents. No item turns on a PCI DSS
requirement number, in digits or paraphrased.

---

### Cloud Computing Fundamentals :: Cloud Computing, items 29–56 (task 49b, `verify-cloud-computing-b`)

28 of 28 items in the range carry a verdict. Every one was refuted on first pass, rewritten, and
re-checked against the fetched sources before the verdict was recorded; item 39
(`shared-responsibility-model.01`) was the only one whose *content* survived untouched.

**1. The `why`-inside-the-option-text defect — the remaining 50, now closed.**

Task 49a fixed 74 of these in items 1–28 and left the rest flagged. All **51** in items 29–56
(26 of the 28 items; only `shared-responsibility-model.01` and `service-level-agreement.01` were
clean) are now fixed: each option text was cut back to the claim alone and the `why` left intact.
The file-wide count is **0**, on the scan 49a published.

49a's warning that the padding was load-bearing for `q-length-cue` was correct and is worth
recording precisely: removing it took the scoped run from **0 warnings to 17** — 16 per-item
ratio warnings plus *the key is the longest option in 23 of 56 items (41%), chance is 25%*. The
padding had been buying a length balance the item set had not earned. Fixed the same way 49a's
own note recommends: **44 distractors were extended with real, false, single-clause continuations
a candidate has to evaluate**, not with commentary about which option is wrong. Scoped run is back
to 0 warnings.

Em-dash shape tell, range 29–56 only: keys 18/28 (64%) before and after — untouched. Distractors
28/84 (33%) before, dipped to 17/84 (20%) when the padding came out, restored to **30/84 (36%)**
by phrasing 13 of the new clauses as em-dash qualifiers. Whole file is back to its exact
pre-task ratio, keys 57% / distractors 40%. No six-token tail is reused three or more times in
the range. Zero options reference "the exam", "the guide" or this project from inside their text.

**2. Sources fetched and found not to contain what they were cited for.**

| source | cited by | what the page actually contains |
| --- | --- | --- |
| `azure-storage-introduction` | all 3 `object-block-and-file-storage` items | A service catalogue — "Azure Blobs: a massively scalable object store", "Azure Files: managed file shares", "Azure managed disks: block-level storage volumes". Nothing on write semantics, flat namespaces, prefixes, or volume attachment. The landing-page defect exactly. |
| `aws-shared-responsibility-model` | all 3 `managed-services` items | The AWS/customer security boundary. Never mentions managed services, PaaS, NIST, query tuning, or version lifecycles. |
| `google-sre-book-slos` | `service-level-agreement.01` | SLI/SLO/SLA definitions and error budgets. Nothing on cloud provider SLAs, availability zones, service credits, or customer placement decisions. (It *does* support `service-level-agreement.02` verbatim.) |
| `aws-migration-7rs` | both `vendor-lock-in` items | The seven migration strategies. The words lock-in, portability, egress and expertise do not appear. |
| `aws-cloudtrail` | `cloud-control-planes.02` | Console/CLI/SDK/API event recording. Nothing on infrastructure as code, version control, or drift — which is the whole of that item. |
| `cncf-glossary-virtualization` | items 29, 34, 36–38 for shared-kernel and isolation claims | 180 words on partitioning a physical computer into VMs. **It does not contain the words container or kernel.** This is the fifth wave to catch this page cited for something it does not say. |
| `vmware-hypervisor` | all 7 virtualization/hypervisor/VM items | **Citation rot.** `https://www.vmware.com/topics/hypervisor` returns 200 but is a client-rendered shell: the only prose any HTTP fetch receives is the `<meta name="description">` line. Grepping the served bytes for "type 1", "type 2", "bare metal" and "hosted" returns **zero hits**. Nothing in items 31–33 could be verified against it. |

Replacements, each fetched and read: `redhat-what-is-a-hypervisor`, `linux-kvm-main`,
`aws-rds-welcome`, `aws-rds-maintenance`, `aws-s3-using-folders`, `gcs-objects`,
`aws-ebs-multi-attach`, `aws-efs-what-is`, `cncf-glossary-iac`, plus the already-present
`nist-sp-800-145`, `azure-activity-log`, `aws-reliability-sla-bp`, `aws-what-is-multicloud` and
`azure-bandwidth-pricing`. All nine new sources were wired into the owning concepts'
`additional_sources` in `data/topics/03-cloud-computing.json` per the `check-orphan-sources` rule,
so `npm run validate` is back to its 16-warning baseline.

**3. Finding against the guide, confirmed and fixed:** `study-guide/03-cloud-computing/cloud-computing.md`,
hypervisor section. The prose attributed two example lists to VMware — "VMware's own list of
examples names ESX(i), Hyper-V, Citrix, Xen and Linux KVM" and "VMware's page names VMware Fusion,
Oracle VM and VirtualBox as its type 2 examples". Those attributions cannot be checked against
anything a fetch can retrieve, for the reason in the table above. The **classifications are
correct** and were kept; only the attribution moved to a source that can be read: Red Hat's
hypervisor page names KVM, Hyper-V and vSphere as type 1 and Workstation and VirtualBox as type 2,
and linux-kvm.org describes KVM as a loadable kernel module providing the core virtualization
infrastructure. `check-guide` stays 0/0. `data/`'s concept description needed no change — it says
only "Type 1 runs directly on hardware; type 2 runs atop a host OS", which is right.

**4. The Task 3 precedent applied again, to `hypervisor.01` o3.** Its `why` called KVM "one of
VMware's own named type 1 examples". It is **Red Hat**, not VMware, that names KVM as type 1, and
the VMware page carries no examples at all. This is the same shape Task 3 adjudicated: an
attribution failure wearing the costume of a factual error. The classification was correct and
was kept; only the attribution was corrected. `hypervisor.02` o4 had the same defect — "VMware's
own materials list Fusion alongside Workstation" — and was repaired the same way, keeping Fusion
and resting the claim on the hosted-versus-bare-metal criterion Red Hat states.

**5. Two distractors that conceded the correct answer inside themselves**, in
`service-level-agreement.01` — a variant of the leak that the scan does not catch because the
tail is a paraphrase rather than a copy:

> o2: "The provider is accountable, since a 99.99% SLA is a guarantee that any application running
> on the platform will stay available, **though availability at the customer's own layer is a
> design property no contract can substitute for**."

The trailing clause is true, states the key, and contradicts the option it is attached to. Both
o2 and o3 were rewritten with false clauses instead.

**6. Commentary addressed to the maintainers, inside an option's `why`**:
`cloud-migration-approaches.01` o2 ended "...the correct term for this strategy is repurchase,
**and this project has gotten that substitution wrong before**." Removed. A `why` is a claim about
the world, not a note about the repository's history.

**7. Checked and rejected.** No item in the range turns on a PCI DSS requirement number. No item
cites `lf-objectives-2025` as its only source. No item has two options asserting the same answer.
No cited source was found to contradict its item. All keys remain at index 0 by design.

**Gates after this task** — `check-bank --scope "Cloud Computing Fundamentals :: Cloud Computing"
--except q-answer-position-balance`: **0 errors, 0 warnings**. `npm test`: **307 pass, 0 fail**.
`npm run validate`: **537 concepts, 0 errors, 16 warnings**. `npm run check-guide`: **0 errors,
0 warnings**.

---

## Task 53a — Security Fundamentals :: Security (items 1–27, agent `verify-security-a`)

Range: the first 12 concepts of `questions/04-security/security.json`, 27 items. **27 of 27 carry
a verdict.** 1 passed as authored; 26 were refuted as authored, fixed in place, and re-verified.
Items 28–82 belong to `verify-security-b` and `verify-security-c` and were not touched.

**1. `nist-csrc-glossary` supports nothing at all — the landing-page defect, again.**
`https://csrc.nist.gov/glossary` is a JavaScript search shell. Fetched and stripped, it is 6.4 KB
of site chrome with **zero term definitions**. It was cited by 21 of the 27 items in this range
(and by all 12 of my concepts in `data/topics/04-security.json`). Term-page probes:

| term page | status |
|---|---|
| `/glossary/term/audit` | 200, real definition |
| `/glossary/term/accountability` | 200, real definition |
| `/glossary/term/authentication` | 200, real definition |
| `/glossary/term/authorization` | 200, real definition |
| `/glossary/term/least-privilege` | **404** |
| `/glossary/term/attack-surface` | **404** |
| `/glossary/term/defense-in-depth` | **404** |
| `/glossary/term/single-sign-on` | **404** |
| `/glossary/term/detective-control` | **404** (as wave A found) |

Fixed at concept level: the four concepts whose term page exists now cite the term page; the rest
cite the document that actually carries the claim. The landing page is still cited by the 12
concepts behind items 28–82 — **agents B and C should expect the same finding.**

**2. `lf-objectives-2025` is an announcement, not an objectives list.** Fetched
`https://training.linuxfoundation.org/lfca-program-changes-2025/`: 0 occurrences of
*confidentiality*, *least privilege*, *zero trust*, *attack surface*, *single sign*, *multi-factor*.
It remains as the domain anchor on every concept but supports no individual claim; no item in this
range now depends on it alone.

**3. A double key, from a source that says the opposite of the key.** `defense-in-depth.01` asked
whether a host firewall added behind a network firewall "running the same default-deny rule set"
is a genuine second layer, and keyed **yes**. SP 800-53r5 (SA-8 discussion) says the reverse of
the stem as posed: replicated enforcement mechanisms are "sometimes called defense in depth …
**If the mechanisms are similar, however, the additional protection may be illusory, as the
adversary can simply attack in series.**" Distractor o2 ("same rule set → one layer, not two") was
at least as defensible as the key, and o2's own `why` conceded it. Item rewritten to ask what
*determines* independence rather than to assert an answer about an identical pair.
The **study guide prose is correct here** (`study-guide/04-security/security.md:193`) — the item,
not the guide, had drifted.

**4. A second double key, from a man page nobody had read.** `public-key-authentication.01`
offered `ssh-copy-id -i ~/.ssh/id_ed25519 user@host` as a distractor with the `why` "This copies
the private key rather than the public one — the classic error." **That `why` is false and the
option is a second correct answer**: ssh-copy-id(1) states of `-i` that "**If the filename does
not end in .pub this is added**", so naming the private key installs the public half exactly as
the key does. Replaced with `ssh-add`, which genuinely installs nothing remotely. Compounding it,
`ssh-copy-id` appears **0 times** in ssh-keygen(1), the only tool page cited; `man.openbsd.org/ssh-copy-id`
404s. Added `openssh-ssh-copy-id` (man7.org).

**5. Two concepts had no supporting source whatsoever.** `single-sign-on` cited only
`lf-objectives-2025` (0 hits for "single sign") and the empty glossary landing page. Added
`nist-sp-800-63c-4`, which states federation "allows the subscriber to obtain services from
multiple RPs without the need to hold or maintain separate authenticators at each RP. **This
process is sometimes known as single sign-on**."

**6. An item keyed on HTTP semantics with no HTTP source.** `authentication-vs-authorization.01`
turns entirely on `401`; SP 800-63B-4 contains no status codes (3 occurrences of "authorization"
in the whole document). Added `rfc-9110-http-semantics`: §15.5.2 — 401 "indicates that the request
has not been applied because it **lacks valid authentication credentials**".

**7. "Detective control" is still unsourceable in SP 800-53r5.** 0 occurrences in the 492-page
PDF; also 0 in SP 800-12r1. Wave A's finding stands. Resolved rather than re-reported: NIST
SP 800-100 §4 says selected controls "are either preventive or detective in nature" (1 occurrence
in 178 pages) — already added to `data/sources.json` by Task 46 — and is now wired to
`security.security.accounting-and-auditing`. The guide already recorded this attribution correctly
at `study-guide/04-security/compliance.md:126`; **no guide change was needed.**

**8. An item that could only be answered from the guide.** `attack-surface.03`'s stem asked for
the answer "in the sense **the guide** uses the term", and `authentication-vs-authorization.02`
keyed on what "the comparison block names as the separating axis" while its stem named a trio the
key did not match. Both rewritten to bind on primary sources (SP 800-53r5 AC-2(3); the CSRC
authentication/audit term pages).

**9. The distractor-announces-its-own-wrongness class, at 24 of 81 distractors.** Far denser here
than the 9/246 file-wide figure suggested, because the padding is a trailing subordinate clause
rather than a second sentence (the two-clause detector reads 0% across the whole file). Example,
`cia-triad.02` o4 — also **the file's one option that references the exam from inside its own
text**:

> "The restore demonstrated authentication and authorization, since only a permitted operator
> could run it, ~~a category the exam expects candidates to name correctly rather than borrow
> from a different trio entirely~~."

All 24 stripped. Removing them exposed `q-length-cue` on both `accounting-and-auditing.01` and
`.02`, exactly as predicted; repaired by extending the distractors with real false clauses, never
by truncating a key. Both warnings now clear.

**10. A key whose `why` misquoted its source.** `risk-threat-and-vulnerability.02` said SP 800-30r1
"frames risk as likelihood **times** impact". The document says risk is "typically **a function of**
the degree of harm and likelihood of harm occurring", and Appendix I assesses it with qualitative
tables, not multiplication. Corrected. Separately, `risk-threat-and-vulnerability.02` o4's `why`
appealed to what "this exam" tests rather than to a source; rebound to the NIST definitions.

**11. Em-dash tell, this range.** Key 26% → **22%**, distractor 4% → **6%**. Gap narrowed from
22pp to 16pp without adding an em-dash to any key. File-wide: 43%/6% → 41%/7%.

**12. Checked and rejected.** No item in the range turns on a PCI DSS requirement number, in
digits or paraphrased — the only compliance-adjacent content is the AAA/audit vocabulary, bound to
SP 800-53r5 AU-6 and SP 800-100. No two options assert the same answer. No six-token option tail
repeats 3+ times. All keys remain at index 0 by design. `multi-factor-authentication.01` was
checked and **passed as authored**: SP 800-63B-4 states "Out-of-band authentication is not
phishing-resistant" and requires phishing resistance only at AAL3, which is exactly the key's claim.

**Gates after this task** — `check-bank --scope "Security Fundamentals :: Security"
--except q-answer-position-balance`: **0 errors and 0 warnings on items 1–27**; 47 residual
`q-verdict-coverage` errors, all attributable to items 28–82 (agents B and C, 14 of their 55 items
verified at the time of this run). `npm test`: **307 pass, 0 fail**. `npm run check-guide`:
**0 errors, 0 warnings**. `npm run validate`: **537 concepts, 0 errors, 38 warnings** — above the
16-warning baseline because five agents are adding sources in parallel that are not yet wired to
concepts (`nist-glossary-*`, `cncf-glossary-*`, `docker-*` orphan-source warnings are not mine;
all 8 sources this task added are wired).

## Task 55a — DevOps Fundamentals :: Containers (items 1–30, agent `verify-containers-a`)

Range: array items 1–30 (indices 0–29), the eight concepts `container`, `container-image`,
`image-layers`, `registry`, `image-tags`, `dockerfile`, `container-lifecycle`, `port-mapping`.
All 30 carry a verdict, and all 30 now record `confirmed`. **24 of the 30 were refuted as
authored, repaired here, and re-verified; 6 needed no change. Every one of the 24 defects was a
citation defect. No wrong key, no double key, and no false `why` was found anywhere in the
range.** The content of
this competency is sound; its sourcing was not.

### The defect, stated once

All 30 items inherited their `source_ids` verbatim from the concept's `additional_sources` in
`data/topics/05-devops.json`. Four source assignments were wrong at concept level, so the same
defect repeated across every item on that concept:

1. **The CNCF glossary landing page again** (`cncf-glossary`, `https://glossary.cncf.io/`),
   cited on `container.01` and `container.03`. The fetched page is a list of term links plus
   maintainer acknowledgements: it contains the word **"kernel" zero times** and no container
   or pod prose at all. `container.03` turns entirely on containers sharing the host kernel.
   This is the fourth consecutive wave in which this landing page has been cited for something
   it does not say. Even the `/container/` term page says only "containers share the same
   operating system" and never says kernel — the shared-kernel sentence lives in Docker's
   *What is a container?* page ("they all share the same kernel").
2. **`docker-overview` used as a command reference.** The page never contains the string
   `docker ps` (cited for it on `container.02`) and its only occurrence of "docker images" is
   inside the sentence "A Docker registry stores Docker images" (cited for the command on
   `container-image.02` and `registry.03`). It also contains **no `-p`/port-publishing content
   whatsoever** — its only "port" hits are sidebar navigation links — yet all four
   `port-mapping` items cited it. Landing-page defect, fifth ecosystem.
3. **`dockerfile-reference` cited for tag and digest semantics.** All three `image-tags` items
   cited the Dockerfile reference, which documents build instructions and says nothing about
   tags, `latest`, digests or rollback. `docker-overview` contains "latest" and "digest" zero
   times each. The tag model is documented in *Build, tag, and publish an image*
   (`[HOST[:PORT_NUMBER]/]PATH[:TAG]`, "If no tag is specified, `latest` is used by default")
   and the digest form in the `docker image pull` reference ("Pull an image by digest
   (immutable identifier)").
4. **`docker-container-ls` cited for stop/start/prune semantics.** All four
   `container-lifecycle` items cited the *list* reference. It contains neither `SIGTERM` nor
   `SIGKILL` (`container-lifecycle.04` is entirely about that sequence), documents nothing
   about what `docker stop` does or does not delete, and nothing about disk reclamation.

### Fixes applied

Fourteen sources were added to `data/sources.json` and the eight concepts' `additional_sources`
in `data/topics/05-devops.json` were rewritten, with each item's `source_ids` narrowed to the
subset that actually carries its claims:

`docker-what-is-a-container`, `docker-what-is-a-registry`, `docker-build-tag-publish`,
`docker-image-pull`, `docker-image-push`, `docker-image-ls`, `docker-container-stop`,
`docker-container-start`, `docker-build-cache`, `docker-publishing-ports`,
`docker-network-overview`, `docker-buildx-build`, `docker-system-prune`,
`oci-image-spec-layer`.

No option text, stem or `why` was changed anywhere in the range — the content did not need it.
The em-dash shape tell was therefore left untouched: file-wide 14% keys / 0% distractors,
unchanged, and within items 1–30 it is 3% / 0%.

### Sources that did not contain what they were cited for

| Source | Cited on | What it does not contain |
| --- | --- | --- |
| `cncf-glossary` (landing) | `container.01`, `container.03` | "kernel" (0 hits); any pod or container prose |
| `docker-overview` | `container.02` | the string `docker ps` |
| `docker-overview` | `container-image.02`, `registry.03` | the `docker images` command |
| `docker-overview` | `registry.01` | any parse of an image reference |
| `docker-overview` | `image-tags.01`, `.02` | "latest" (0 hits) |
| `docker-overview` | all four `port-mapping` items | any port-publishing content |
| `dockerfile-reference` | all three `image-tags` items | tags, `latest`, digests |
| `docker-image-layers` | `image-layers.02` | "invalidat" (0 hits) — no build-cache content |
| `docker-image-layers` | `image-layers.03` | that a later deletion leaves the earlier file readable |
| `docker-container-ls` | `container-lifecycle.04` | `SIGTERM`, `SIGKILL` (0 hits each) |
| `docker-container-ls` | `container-lifecycle.02` | the `docker start` option table |

### Adjudication of prior findings

`qbank-findings.md` carried **no** prior section for this competency, so there was nothing to
adjudicate here. `docs/verification/factcheck-containers.json` was read but not treated as a
clearance; two of its entries (`containers-cmd-014`, `containers-cmd-029`, both `refuted`)
independently corroborate the key of `image-layers.01` — that `WORKDIR` is not metadata-only —
with the Dockerfile reference ("If the `WORKDIR` doesn't exist, it will be created even if it's
not used in any subsequent Dockerfile instruction") plus an empirical layer count. The guide
prose at `study-guide/05-devops/containers.md` and `appendix-b-container-to-cluster.md` already
names `WORKDIR` as the exception, so no guide change was needed.

### Residual limit, recorded rather than hidden

`port-mapping.02` turns on an application bound to the *container's* loopback interface being
unreachable through a correct `-p` publish. That is true and follows from each container having
its own network interface (Docker's networking overview: a container "only sees a network
interface with an IP address, a gateway, a routing table"), but **no fetched Docker page states
the 127.0.0.1-inside-the-container case in those words**. The item is cited to the two pages
that come closest and its `verification.reasoning` records the gap.

### Note for the whole file, outside this range

Many distractors in this file append a second sentence with **no sentence-ending punctuation**
before it — e.g. "…bundles several unrelated images together Under that framing, deleting the
pod would…". It reads as a typo and it is also why the file's two-clause scan measures 0% for
both keys and distractors. It is a file-wide pattern, not a range-local one, so it was left
alone deliberately: fixing it in items 1–30 only would make this range differ visibly from
items 31–86. It should be fixed for the whole file in one pass, by one agent.

### Process note — how the verdict field was mis-recorded here

On the first write, all 24 repaired items were left carrying `verdict: "refuted"`. That is the
pre-repair state, and `q-verdict-coverage` rejected it: a refuted item is one that ships broken.
The repairs themselves were complete and the reasoning strings already described them, so this
was purely a recording error — the protocol's Step D requires the *post*-repair verdict. Each of
the 24 was re-read on disk, re-checked against the URLs in its `sources_read`, and set to
`confirmed`, with the original defect narrative preserved behind a leading `REFUTED AS AUTHORED`
marker so the history is not lost. Worth stating plainly for later waves: "refuted" is the
verdict for an item still wrong at the end of the task, not a label for work performed.

### Security Fundamentals :: Security, items 28–56 (task 53b, `verify-security-b`)

29 items over 14 concepts, all 29 carrying a verdict. **12 held as authored; 17 were refuted,
repaired in place, and re-verified**, so all 29 now record `confirmed` — the `REFUTED ...`
narrative is retained inside each item's `reasoning`, which is where the history belongs. (The
verdict field is not a defect log: `check-bank` rejects a shipped `refuted`, correctly, because a
refuted item is meant to be rewritten rather than shipped.) Sources fetched and read in full: RFC 8446, RFC 7568,
RFC 5280, RFC 9525, NIST SP 800-57 Part 1 Rev. 5 (the PDF, not the landing page), NIST SP
800-63B-4, the cryptsetup/LUKS FAQ (as `.md`), the OWASP Credential Stuffing Prevention Cheat
Sheet, OWASP Password Storage Cheat Sheet, OWASP Top 10:2025 A05 Injection, the OWASP WSTG
authorization-testing page, MITRE ATT&CK TA0004, `sha256sum(1)`, the GnuPG manual's
`--verify` entry, and eleven NIST CSRC glossary term pages.

**The content was almost entirely sound. 14 of the 17 refutations were citation defects; one was a
wrong stem, one was a key stated without the qualifier its own source requires, and one was a key
rationale resting on an unverifiable claim.**

#### 1. `nist-csrc-glossary` is the glossary *search* page and defines nothing

It is registered as `https://csrc.nist.gov/glossary` — the A–Z landing page. Fetched, it carries
navigation and an "About" note, and not one term definition. Twelve items in this range cited it
for a definition it does not contain: hashing (2), malware and ransomware (2), denial of service
(2), man-in-the-middle (2), privilege escalation (2), phishing (2). This is wave A's
`nist-sp-800-53r5`/"detective" shape, one level up: the right corpus, the wrong page.

The term pages do carry the definitions, and each was fetched and checked before being cited:

- `term/hash_function` — "(One-way) It is computationally infeasible to find any input that maps
  to any new pre-specified output" (FIPS 186-5, FIPS 203). This is the entire basis of both
  hashing items and it was previously uncited.
- `term/rootkit`, `term/trojan_horse`, `term/virus`, `term/worm` — each defined by propagation or
  packaging, never by payload, which is exactly what `malware-and-ransomware.02` keys on.
- `term/denial_of_service` — "the prevention of authorized access to resources or the delaying of
  time-critical operations", with no component on the victim, which against `term/malware`
  ("software that is intentionally included or inserted in a system") supplies the execution axis
  `denial-of-service.02` turns on.
- `term/man_in_the_middle_attack` — "an attacker is positioned between two communicating parties
  in order to intercept and/or alter data traveling between them".
- `term/availability` and `term/confidentiality` — what a ransomware restore does and does not
  return. Note `term/ransomware` **404s**; the attack name has no glossary entry at all.

**`term/privilege_escalation` returns 404, and so does the taxonomy.** Vertical versus horizontal
escalation had no home anywhere in `data/sources.json`. Both privilege-escalation items now cite
the OWASP WSTG, which states it directly — "vertical escalation when it is possible to access
resources granted to more privileged accounts ... horizontal escalation when it is possible to
access resources granted to a similarly configured account" — and MITRE ATT&CK TA0004 for the
post-access ordering ("adversaries can often enter and explore a network with unprivileged access
but require elevated permissions to follow through on their objectives").

Also checked and found empty: `term/data_at_rest` and `term/data_in_transit` exist but carry only
the DAR/DIT acronyms, **no definition**. The at-rest/in-transit/in-use trio is instead stated
verbatim in SP 800-57 Part 1 Rev. 5 §6.2 — information is either "in transit", "at rest", or
"in use" — which is why both `encryption-at-rest-vs-in-transit` items were confirmed rather than
refuted.

#### 2. `verizon-dbir` cannot be retrieved — 200, `text/html`, and a marketing page

The registered URL ends `.pdf` and answers **200 with `content-type: text/html`** and an 87 KB
Verizon page. Every other PDF path under that host answers **200 with `content-length: 0`**. The
Wayback capture of the same URL is the HTML page too. Tried with and without a browser
user-agent. **No one can read this report through the citation the bank carries.**

`phishing-and-social-engineering.01` keyed entirely on three figures from it — 31% vulnerability
exploitation, 16% phishing, 13% credential abuse. Refuted and **rewritten** so it keys on the
methodological point instead (an unattributed frequency superlative is not defensible), which is
checkable without the report. The guide states the same three figures at
`study-guide/04-security/security.md:863` and `:1148`. **Left standing and recorded here rather
than corrected: the source is unverifiable, not disproven, and inventing a replacement number
would be worse than an unverifiable one.** `security.security.vulnerabilities-cves-and-patching`
(items 57–82, agent C's range) cites it too and is affected identically.

#### 3. `gnupg-verify-docs` 404s

`https://www.gnupg.org/gph/en/manual/x135.html` returns 404. Registered
`gnupg-manual-verify` in its place — the GnuPG manual's Operational GPG Commands page, which
carries `--verify` ("Assume that the first argument is a signed file and verify it without
generating any output"). The dead id is still cited by
`security.security.package-and-download-verification` in agent C's range.

#### 4. RFC 5280 does not specify hostname verification

`certificate-expiry-and-validation.01` turns entirely on a hostname mismatch being a distinct
validation failure from expiry. RFC 5280's only uses of "host name" are in name constraints and
URI syntax; it profiles the certificate and the path algorithm, not the identity check a client
performs. **RFC 9525** (obsoleting RFC 6125) is the document: §6.1, "The client MUST construct a
list of acceptable reference identifiers", and §6.3 on matching the DNS domain name portion.
Registered and cited; RFC 5280 retained for the validity window (§4.1.2.5) the distractors use.

#### 5. A stem that mis-stated TLS 1.3 — the one wrong fact in the range

`symmetric-vs-asymmetric-encryption.01` said the handshake "uses an ephemeral Diffie-Hellman
exchange to authenticate the server and agree keys". RFC 8446 §2 separates the two jobs: (EC)DHE
is a key-exchange mode, and authentication is CertificateVerify, "a signature over the entire
handshake using the private key corresponding to the public key in the Certificate message". The
key and all three distractors were correct as authored; only the stem was wrong. Stem rewritten,
options untouched.

#### 6. A key that needed the qualifier its own source states

`full-disk-encryption.02` asked for the state of a LUKS volume whose header was overwritten, and
keyed on "unrecoverable". The cryptsetup FAQ makes that true only under conditions the stem did
not state: there is "no way to recover a damaged key-slot, **except from a header backup**", and
a still-open container can have its volume key extracted from the running system. As authored, a
reader who knew either exception could defensibly reject the key. The stem now excludes both.
Same class as the "true but incomplete" findings of waves A and C, but in a bank item rather than
in guide prose.

#### 7. A key rationale resting on an unverifiable claim about licensed course material

`tls-and-https.01`'s key `why` asserted that the exam expects "TLS" by name and that LFS200's own
material never uses the term. Neither is checkable against any fetchable primary source, and the
second is a claim about licensed content. Replaced with RFC 7568 §3 — "SSLv3 MUST NOT be used" —
and the RFC 5280 certificate profile. The option text was correct and is unchanged.

#### 8. PCI DSS: clean, on substance as well as digits

Regex over all 29 items for `requirement|req\.?\s*\d+(\.\d+)*` and bare `\d+\.\d+\.\d+`: **0
hits**. Read for substance as well, since the encryption, hashing and full-disk-encryption
concepts are where laundered requirement text would land: no item turns on stored-PAN
readability, key-rotation intervals, or any other Council requirement, before or after the
rewrites. Every encryption claim traces to SP 800-57, RFC 8446 or the LUKS FAQ.

#### 9. No second-correct-answer defects, and no duplicate options

Every distractor was read against its own `why` and against the key. The concepts the task flagged
as densest for this — hashing versus encryption, at-rest versus in-transit, MITM versus downgrade,
brute force versus stuffing, DoS versus DDoS — each hold: in every case the distractor is false on
the axis the stem asks about, not merely less complete. No distractor `why` contradicts its own
option text, and no distractor paraphrases the key.

#### 10. Scan numbers

Em-dash trailing clause, this range: keys **14/29 → 13/29**, distractors **9/87 → 9/87**. No
em-dash was added to any key. Whole file moved 41%/7% → 40%/7% (the file-wide by-rule pass is
still owed).

Self-refuting padding — the distractor's own `why` spliced onto the end of its `text`, so the
option announces its wrongness — is far more common here than the file-wide verbatim scan
suggests, because most instances are **paraphrase rather than paste**. A 6-gram `text`/`why`
overlap scan caught 12 of 87 distractors and 11 were rewritten; a second pass on re-verification,
using a subordinate-reversal-clause pattern (`, when ... rather than/is not/cannot`) instead of
n-gram overlap, caught **7 more that the n-gram scan had missed entirely** — in `hashing.01`,
`certificate-expiry-and-validation.01`, `malware-and-ransomware.02`, `denial-of-service.01`,
`man-in-the-middle.01`, `man-in-the-middle.02` and
`digital-certificates-and-certificate-authorities.01`. **18 distractors rewritten in total**, each
by substituting a false clause of comparable length rather than truncating, so no key was
shortened and no `q-length-cue` warning was exposed (scoped `check-bank`: 0 errors, 0 warnings).

**Recommendation for the file-wide pass: do not scan for this defect with n-gram overlap.** It
under-counts by roughly a third here. The reliable signal is a distractor whose text contains a
subordinate clause introduced by `when`, `though` or `which` that then reverses the claim the
option just made.

Six-token tails reused three or more times across the range: **none**.

#### 11. Concept-level fix, per the propagation rule

Because every item's `source_ids` is a verbatim copy of its concept's source lists, all eight
affected concepts were corrected in `data/topics/04-security.json` rather than item by item:
`hashing`, `certificate-expiry-and-validation`, `phishing-and-social-engineering`,
`malware-and-ransomware`, `denial-of-service`, `man-in-the-middle`,
`brute-force-and-credential-stuffing`, `privilege-escalation`. `npm run generate` re-run;
`npm run check-guide` 0/0. 16 new sources registered in `data/sources.json`, every one fetched
and read before registration, and every one wired to at least one item.

## Task 55b — DevOps Fundamentals :: Containers (items 31–59, agent `verify-containers-b`)

Range: array items 31–59 (indices 30–58), the eight concepts `volumes-and-bind-mounts` (4),
`environment-variables-in-containers` (4), `container-logs-and-exec` (4),
`stateless-vs-stateful-containers` (3), `container-runtime-and-oci` (3), `docker-compose` (4),
`container-security-basics` (3), `container-orchestration` (4). **All 29 carry a verdict.
6 confirmed as authored, 23 refuted, every one rewritten in place and re-verified.**

The wave-A conclusion holds for this range too, with two exceptions: the content is sound but
the sourcing was not — **20 of the 23 refutations are citation defects**, and no key was
factually wrong except one, and no distractor was co-correct except one. Both exceptions are
recorded below because they are the two defect classes this pass exists to catch.

### The one wrong key

`environment-variables-in-containers.02` keyed on "`docker start` accepts no new flags". The
`docker container start` reference disproves it: the option table lists `-a/--attach`,
`-i/--interactive`, `--detach-keys`, `--checkpoint` and `--checkpoint-dir`. What that table does
*not* contain is any `-e/--env`, which is the actual reason the operator's command cannot work.
The key now says exactly that. Note the distractor `o2`'s `why` was already correct on this
point ("does not accept new run-time flags such as `-e`") — the key was the wrong half.

### The one double key

`docker-compose.03` asked what happens to a Compose project after its host loses power, "if no
one intervenes". The stem said nothing about restart policies, so `o2` — "it resumes
automatically on the same machine" — is genuinely correct for any service declaring
`restart: always`, which the daemon does honour on boot. Two defensible answers. The stem now
states that the project declares no restart policy, which leaves only the key.

### Citation defects, by concept

| Concept | Was cited | What the cited page does not contain |
| --- | --- | --- |
| `container-logs-and-exec` (all 4) | `docker-overview` | `docker exec`, `docker attach`, or any logging-driver content. Its single "Docker logs" hit is the prose "Docker logs the output to your terminal" in a `docker run -it` walkthrough |
| `environment-variables-in-containers` (all 4) | `docker-overview` | the phrase "environment variable" — **0 occurrences** |
| `stateless-vs-stateful-containers` (all 3) | `cncf-glossary` (landing) | any definition at all. The fetched body is a browse-by-tag link list plus a project blurb and a maintainer list |
| `container-orchestration` (all 4) | `cncf-glossary` (landing) | as above |
| `container-orchestration.02` | `k8s-architecture` | "heartbeat" — **0 occurrences**; no node-failure rescheduling text. Its only "evict" hits are sidebar nav |
| `container-orchestration.03` | `k8s-architecture` | any reconciliation or control-loop description |
| `container-security-basics.01` | `docker-build-best-practices` | "hypervisor" — **0 occurrences**; "kernel" — 1, unrelated. The item turns entirely on the shared-kernel-versus-hypervisor comparison |
| `container-security-basics.03` | `docker-build-best-practices` | any vulnerability-scanning guidance. Its four "scan" hits are all site navigation to a separate product |
| `container-security-basics.02` | `docker-build-best-practices` | the rule that build args persist in the finished image |
| `container-runtime-and-oci.03` | `oci-overview` | "Kubernetes", "dockershim" or "CRI" — the item is entirely about the dockershim removal |
| `volumes-and-bind-mounts.02` | `docker-volumes` | the bind-mount definition the key states; that lives on the separate bind-mounts page |
| `docker-compose.04` | `docker-compose-features` | `docker compose stop` or `docker compose down` — the page's "stop" count is 0 |

**The CNCF glossary landing page has now failed in five consecutive waves.** In this range it was
cited on seven items across two concepts. Both are now cited to per-term pages
(`/stateless-apps/`, `/stateful-apps/`, `/container-orchestration/`), which do carry the prose
the items need — the orchestration page states reconciliation almost verbatim: the tool "will
then automatically monitor the infrastructure and correct it if its state deviates from the
declared one (e.g., spin up a new container if one crashes)".

### Fixes applied

Twenty-one sources added to `data/sources.json`, each fetched and read before registration, each
wired to at least one item, none left orphaned:

`docker-bind-mounts`, `docker-cli-run`, `docker-cli-start`, `docker-cli-logs`, `docker-cli-exec`,
`docker-cli-attach`, `docker-json-file-logging`, `docker-dual-logging`, `docker-compose-cli-up`,
`docker-compose-cli-stop`, `docker-compose-cli-down`, `docker-build-secrets`,
`docker-engine-security`, `cncf-glossary-stateless-apps`, `cncf-glossary-stateful-apps`,
`cncf-glossary-container-orchestration`, `k8s-nodes`, `k8s-controllers`,
`k8s-dockershim-removal-check`, `k8s-statefulset`, `nist-sp-800-190`.

All eight concepts' `additional_sources` in `data/topics/05-devops.json` were rewritten and each
item's `source_ids` narrowed to the subset that carries its own claims. `npm run generate` re-run;
`npm run check-guide` 0/0.

`nist-sp-800-190` (Application Container Security Guide) is the source the security concept
wanted all along. §3.5.2 states the key of `container-security-basics.01` almost word for word —
"the use of a shared kernel invariably results in a larger inter-object attack surface than seen
with hypervisors ... the level of isolation provided by container runtimes is not as high as that
provided by hypervisors" — and §3.1.1 states the key of `.03`: "An image created with fully
up-to-date components may be free of known vulnerabilities for days or weeks after its creation,
but at some time vulnerabilities will be discovered in one or more image components."

### Guide correction: true-but-misreadable prose

`study-guide/05-devops/containers.md` line 392 gave the `docker start` pitfall as "Expecting it
to accept new run-time flags". That is true as written — `-p` and `-e` are run-time flags — but
it reads as "accepts no flags", which is precisely the over-generalisation the refuted key made,
two lines below a column that correctly lists `-a` and `-i`. Reworded to "Expecting it to accept
the configuration flags `docker run` takes — it has no `-p` and no `-e`". The guide's substance
was already right; only the pitfall phrasing invited the misread. This is the fourth confirmed
instance of the pattern.

### The appended-clause shape tell — measured, and why this range diverges from 55a

Task 55a observed the missing-punctuation second sentence and left it alone. Measuring it turns
it into something stronger than a typo. A distractor in this file may append a meta-commentary
clause — "… That framing invents …", "…, on the assumption that …", "…, treating X as Y" —
and at baseline that clause appeared on **48 of 258 distractors and 0 of 86 keys.
Its presence identified a wrong option with 100% precision**, on more than one option in six of
every ten items. That is a harder giveaway than any length or em-dash cue this project has
tracked, so it was fixed within this range rather than preserved for consistency: all 22
instances in items 31–59 were rewritten into the distractor's own assertive voice, keeping the
false claim and discarding the commentary. **33 instances remain, in items 1–30 and 60–86, and
should be cleared in one pass.**

Removing 22 long tails shortened those distractors, which flipped six items into
key-is-longest. Six distractors were then re-lengthened. Final scan numbers:

| Scan | Range 31–59 before | Range 31–59 after | Items outside the range | File |
| --- | --- | --- | --- | --- |
| em-dash trailing clause | k 17% / d 0% | k 17% / d 0% | k 12% / d 0% | k 14% / d 0% |
| two-clause option text | k 0% / d 0% | k 0% / d 0% | k 0% / d 0% | k 0% / d 0% |
| meta-commentary tail | k 0 / d 22 | k 0 / d 0 | k 0 / d 33 | k 0 / d 33 |
| key is longest option | 14% | 17% | 12% | 14% |
| six-token tail reused 3+ times | 0 | 0 | 0 | 0 |
| `why` pasted into own `text` | 0 | 0 | 0 | 0 |

The em-dash gap was not widened. Mean option length in this range is now k153 / d132 against
k140 / d138 outside it; that gap is entirely the 33 uncleared tails inflating the other ranges'
distractor mean, and it closes on its own once they are fixed. No key was truncated. No option
in this range is a bare code span. No item turns on a PCI DSS requirement number.

Two options in this range pointed at the study material from inside themselves —
`stateless-vs-stateful-containers.03` `o4`'s `why` ("the real distinction this concept tests")
and `container-orchestration.04` `o1`'s `why` ("the confusion this concept warns against").
Both reworded to describe the question rather than the curriculum.

### Adjudication of prior findings

No prior `qbank-findings.md` section existed for this competency other than task 55a's, which
concerns items 1–30 and required no adjudication here; its Note-for-the-whole-file is answered
above. `docs/verification/factcheck-containers.json` was read and not treated as a clearance;
none of its entries bears on items 31–59.

### Residual limit, recorded rather than hidden

`container-logs-and-exec.01` keys on `docker logs` still working against an exited container.
The `docker container logs` reference does not say so in those words — it says the command
"batch-retrieves logs present at the time of execution" and imposes no running-container
condition, while the `docker exec` page *does* state its condition explicitly ("only runs while
the container's primary process (PID 1) is running"). The key rests on that asymmetry plus the
json-file driver page's "Docker captures the standard output (and standard error) of all your
containers, and writes them in files" — a file read back, not a live process. The item's
`verification.reasoning` records the gap rather than claiming a verbatim source.

### Security Fundamentals :: Security, items 57–82 (task 53c, `verify-security-c`)

26 items over 12 concepts, **26 of 26 carrying a verdict**. 9 passed as authored; 17 were refuted
as authored, fixed in place, and re-verified. Items 1–56 belong to `verify-security-a` and
`verify-security-b` and were not touched.

Sources fetched and read in full: `sshd_config(5)` on man.openbsd.org **and** the Debian portable
edition, `sshd(8)`, `selinux(8)`, `getenforce(8)`, `apparmor(7)`, `aa-status(8)`,
`grub-mkpasswd-pbkdf2(1)`, the GNU Privacy Handbook, the FIRST CVSS v3.1 specification, the SANS
incident-response glossary, and four NIST PDFs from `nvlpubs.nist.gov` — SP 800-53 Rev. 5 (492
pages), SP 800-61 Rev. 3, SP 800-94, SP 800-41 Rev. 1 — plus four CSRC glossary term pages.

**As in waves A and B, the content was largely sound and the sourcing was not. Not one key in this
range was factually wrong, and no double key was found. 8 of the 17 refutations were citation
defects; 14 were the pasted-`why` option shape; several items carried both.**

#### 1. Three cited URLs do not serve the text they were cited for

| source id | URL | what it actually returns |
|---|---|---|
| `gnupg-verify-docs` | `https://www.gnupg.org/gph/en/manual/x135.html` | **HTTP 404 Not Found** from www.gnupg.org |
| `cve-program-overview` | `https://www.cve.org/About/Overview` | HTTP 200, 880 bytes, a Vue application shell; the only prose is the `noscript` notice |
| `apparmor-wiki` | `https://gitlab.com/apparmor/apparmor/-/wikis/home` | HTTP 200, strips to ~1,100 characters of GitLab script; `aa-status`, `enforce`, `complain` all absent |

This is the `vmware-hypervisor` shape twice over and outright rot once. Fixes:
`gnupg-verify-docs` repointed to the single-page GNU Privacy Handbook
(`https://www.gnupg.org/gph/en/manual.html`), which carries both sentences the two
package-verification items need — "Both the document and detached signature are needed to verify
the signature", with the worked `gpg --verify doc.sig doc`, and "A key is validated by verifying
the key's fingerprint and then signing the key to certify it as a valid key". `apparmor-wiki`
**removed** from `data/sources.json` (it had exactly one referencing concept, so leaving it would
have raised an `orphan-source` warning) and replaced by `apparmor-man7` and `aa-status-man8`.
`cve-program-overview` kept — items 1–56 may still cite it — but annotated in `data/sources.json`
with the finding, and no claim in this range now rests on it alone.

#### 2. The right man page, one page away from the sentence — four times

Wave A's `man-df`/`man-apropos` shape, repeated in this range's operational concepts:

- **`sshd -T` versus `sshd -t`** (`ssh-hardening.04`) was cited to `sshd_config(5)`. Neither flag
  is documented there; both are `sshd(8)` options — "-T Extended test mode … output the effective
  configuration to stdout", "-t Test mode. Only check the validity of the configuration file".
  Added `openssh-sshd-8`.
- **PAM** (`ssh-hardening.01`). The key turns on keyboard-interactive still prompting through PAM.
  `man.openbsd.org/sshd_config` contains the string "PAM" **zero times** — OpenBSD has no PAM. The
  portable page carries the decisive sentence: "Because PAM keyboard-interactive authentication
  usually serves an equivalent role to password authentication, you should disable either
  `PasswordAuthentication` or `KbdInteractiveAuthentication`." Added
  `openssh-sshd-config-portable`. The portable page also states outright what the precedence item
  needs — "`/etc/ssh/sshd_config.d/*.conf` files are included at the start of the configuration
  file, so options set there will override those in `/etc/ssh/sshd_config`".
- **`getenforce`** (`selinux-and-apparmor.01`). Every option in that item turns on what
  `getenforce` reports, and `selinux(8)` names it only in SEE ALSO. Added `getenforce-man8`
  ("getenforce reports whether SELinux is enforcing, permissive, or disabled"). The *mode*
  semantics the key depends on are in `selinux(8)` and were confirmed there: permissive "causes it
  to operate in a mode where accesses that would be denied by policy are permitted but audited".
- **The boot loader password** (`physical-security.01`). Cited to SP 800-53 Rev. 5, which covers
  boot *firmware* integrity (SI-7(10)) and documents no boot loader password anywhere. Added
  `grub-mkpasswd-pbkdf2`. `www.gnu.org` was unreachable from the verification environment, so the
  Debian-hosted upstream manual page is what is cited.

#### 3. A claim cited to a 492-page document that never uses the word

`firewalls-and-network-segmentation.02` is entirely about stateful firewall behaviour. Its only
substantive citation was NIST SP 800-53 Rev. 5, in which **"stateful" does not occur once in 492
pages**. Added `nist-sp-800-41r1`, whose §2.1.2 states it directly: "stateful inspection keeps
track of each connection in a state table", blocking "packets that deviate from the expected
state". The segmentation item keeps SP 800-53r5, which does support it — SC-7 requires monitoring
"at the external managed interfaces … and at key internal managed interfaces" and separated
subnetworks, which is exactly what a flat network lacks.

#### 4. Severity belongs to FIRST, not to a program overview page

Both CVE items and both vulnerability-scanning items sourced CVSS claims to `cve-program-overview`
(see finding 1). `first-cvss-v31` added: CVSS "outputs include numerical scores indicating the
severity of a vulnerability", the Base equation "computes a score ranging from 0.0 to 10.0", and
the Base Score "assumes the reasonable worst case impact across different deployed environments" —
that last clause is what makes the reachability item's key correct rather than merely plausible.
No item in this range turns on a PCI DSS requirement, in digits or in paraphrase.

#### 5. Task 53a finding 1, applied to this range's three affected concepts

`nist-csrc-glossary` (`https://csrc.nist.gov/glossary`) was still cited by `insider-threat`,
`vulnerabilities-cves-and-patching` and `system-hardening`. Term pages probed and fetched:
`term/insider_threat` **200** — "The threat that an insider will use her/his authorized access,
**wittingly or unwittingly**, to do harm", which is the sentence that puts the accidental public
bucket inside the definition and was previously uncited; `term/common_vulnerabilities_and_exposures`
**200** — "unique, common names for publicly known information system vulnerabilities", a name and
a description with no severity component; `term/hardening` **200** — "A process intended to
eliminate a means of attack by patching vulnerabilities and turning off nonessential services".
`term/system_hardening` and `term/configuration_drift` both **404**. Three per-term sources added
following the `nist-glossary-<term>` convention wave B established.

#### 6. The pasted-`why` option shape — measured, fixed, and the warning it was masking

Measured across the file at the start of this task: **23 of 246 distractors** carried a ≥40-character
verbatim paste of their own `why` as a trailing "…, when …" clause. **14 of the 23 were in items
57–82** — one per item in eleven of the twelve concepts. All 14 replaced with distinct false clauses
of comparable length, never by truncation; my range now measures **0**.

Stripping the padding from `selinux-and-apparmor.02`'s o3 exposed a `q-length-cue` warning the
padding had been masking (key 218 characters against a 136-character distractor mean, ratio 1.61
against a 1.60 threshold). **Repaired by extending o4 with a further false clause — `getfacl`
reports POSIX ACL entries, not an access-control taxonomy — not by shortening the key.** This is
the trap the task brief predicted, and it fired exactly once.

Em-dash shape, items 57–82, measured before and after: **key 54% (14/26), distractor 4% (3/78) —
unchanged**. No em-dash was added to any key; the one distractor rewrite that replaced an
em-dash clause (`system-hardening.01` o2) kept an em-dash so distractor usage was not reduced
either. The range's 54/4 split is worse than the file's 43/6 and is left for the by-rule pass.
Six-token tail reuse across the range: **no tail appears 3 or more times**. No option in the range
is a bare code span.

#### 7. Checked for a second correct answer, and none found

The four `ssh-hardening` items were checked directive by directive against `sshd_config(5)`, since
that is where a second defensible answer would hide:

- `ssh-hardening.02` (timeout): `AuthorizedKeysFile`, `StrictModes` and `Port` were each traced to
  the failure mode they actually produce — a post-connection rejection, a post-connection refusal
  to use the file, and a connection refused, respectively. None produces a pre-daemon timeout, so
  none is a second key.
- `ssh-hardening.03`: o3 ("`PasswordAuthentication no` makes `PermitRootLogin` irrelevant") is the
  near miss and is false — `prohibit-password` leaves root's **key** path open, which
  `PasswordAuthentication` does not touch.
- `package-and-download-verification.02` o3 was the closest call in the range: it asserts
  `gpg --verify` needs a detached signature *and* a clearsigned document together. The Handbook's
  detached-signature section shows exactly `gpg --verify doc.sig doc`, so the stem's command is
  already the correct pair and o3 is false.
- `intrusion-detection-and-prevention.01` o2 (blocking from a passive tap) was checked against SP
  800-94's hedge — "most techniques … require that the sensor be deployed in inline mode" and a
  passive sensor "can place packets onto a network to attempt to disrupt a connection". The hedge
  does not rescue o2, which claims a passive sensor can *block*; SP 800-94 says passive techniques
  "typically provide no reliable way for a sensor to stop the traffic from reaching its
  destination".

#### 8. Guide prose checked, and found correct

`study-guide/04-security/security.md` needed no correction for these twelve concepts. The
`ssh-hardening` block in particular is accurate down to the details this range tests: first-obtained
value, the drop-in include near the top, `KbdInteractiveAuthentication` defaulting to `yes` on a
PAM-backed system, `prohibit-password` still permitting key-based root login, and `sshd -t` to
validate against `sshd -T` to print the effective configuration. Only the per-concept
`sources:` lines were edited, to track the source changes above.

#### 9. Left alone deliberately

- **`lf-objectives-2025`** remains the domain anchor on all twelve concepts. Wave A established it
  supports no individual claim; no item in this range depends on it alone.
- **The NIST `csrc.nist.gov/pubs/…/final` landing pages** (`nist-sp-800-53r5`, `nist-sp-800-61r3`,
  `nist-sp-800-94`) are one click above the PDFs that carry the text, which is the landing-page
  shape — but unlike a year-agnostic report page they name an exact revision and cannot drift, and
  they are shared with concepts outside this range. Recorded here rather than changed. The PDFs
  actually read are the `nvlpubs.nist.gov` ones listed at the top of this section.

#### Residual, recorded rather than hidden

`npm run check-bank -- --scope "Security Fundamentals :: Security"` reports **17
`q-verdict-coverage` errors, all of them items 1–56 carrying a stored verdict of `refuted`** —
`symmetric-vs-asymmetric-encryption.01`, `hashing.01`/`.02`, `tls-and-https.01`,
`certificate-expiry-and-validation.01`, `full-disk-encryption.02`, `phishing-and-social-engineering.01`/`.02`,
`malware-and-ransomware.01`/`.02`, `denial-of-service.01`/`.02`, `man-in-the-middle.01`/`.02`,
`brute-force-and-credential-stuffing.02`, `privilege-escalation.01`/`.02`. None is in items 57–82.
Check 21 treats any verdict other than `confirmed` as an error — "a refuted item must be rewritten
and re-verified, not shipped" — so a refuted-and-fixed item must be re-recorded as `confirmed` with
the refutation described in its `reasoning`, which is what this range does. Agents A and B need to
re-record those 17 before the file is clean.

## Task 55c — DevOps Fundamentals :: Containers (items 60–86, agent `verify-containers-c`)

27 of 27 items in range verified: the Kubernetes-and-CNCF tail of the file — `kubernetes` (3),
`cluster-and-node` (3), `pod` (4), `deployment` (4), `kubernetes-service` (4), `control-plane` (3),
`declarative-configuration-and-desired-state` (3), `cncf` (3). **23 refuted as authored, 4 clean.**
All 23 were rewritten and re-verified in place, so every item now carries `confirmed`; each item's
`verification.reasoning` opens by naming the defect it was refuted for.

**No key in this range was factually wrong.** Every refutation was a sourcing defect, a shape
tell, a rationale that argued from the exam rather than from a fact, or — in two cases — a
distractor that a precise stem would have excluded and a loose one did not.

### The pattern, stated once: a component catalogue used as a landing page

`k8s-architecture` (`kubernetes.io/docs/concepts/architecture/`) was cited by 9 items across four
concepts. It is an excellent page and it is the right source for exactly two of the things it was
asked to carry: the cluster/node containment hierarchy and the four control plane components. It
was also cited for

- **node draining** (`cluster-and-node.03`) — the page does not contain the word *drain*;
- **what happens to running pods during a control plane outage** (`control-plane.01`) — the page
  describes what each component does and never discusses an outage;
- **declarative configuration and desired state** (all three items) — the phrase *desired state*
  appears on it once, incidentally, inside the kube-controller-manager blurb.

This is the same landing-page defect the wave has now confirmed in four unrelated ecosystems (AWS
`welcome.html`, Pro Git's "What is Git?", `spdx-license-list`, and now the Kubernetes cluster
architecture page). Fixed at concept level in `data/topics/05-devops.json` so it cannot recur
item by item.

### The CNCF glossary failed again, and the CNCF's own site failed differently

`cncf-glossary` was cited by `kubernetes.02`, an item about **how deep LFCA goes on Kubernetes**.
The glossary root contains zero occurrences of *governance*, *Steering*, or *LFCA*. That is the
sixth wave in a row in which this source has been cited for something it does not say.

The `cncf` concept is the one place in this competency where citing CNCF's own site is legitimate,
and it still went wrong: `cncf.03` is entirely about the **sandbox → incubating → graduated**
ladder and cited `cncf-who-we-are` and `cncf-charter`. Who-we-are names none of the three stages;
the charter's only occurrence of any of them is the incidental phrase "non-sandbox project
maintainers" in the TOC election clause. Five further items (`kubernetes.01`, `kubernetes.03`,
`cncf.01`, `cncf.02`, and `cncf.03`) asserted Kubernetes' **graduated status** against pages that
never state a maturity level for any project.

### Sources that did not contain what they were cited for

| Item(s) | Source cited | What it does not contain |
| --- | --- | --- |
| `kubernetes.02` | `cncf-glossary` (`glossary.cncf.io`) | any mention of LFCA, exam scope, CKA, governance, or the Steering Committee |
| `kubernetes.02` | `k8s-steering-charter` | anything about what an exam expects |
| `kubernetes.01`, `cncf.01` | `cncf-charter`, `cncf-who-we-are` | Kubernetes' graduated maturity level |
| `kubernetes.03` | `cncf-who-we-are`, `cncf-charter` | the Linux Foundation's relationship to the Linux kernel — the item's actual subject |
| `cluster-and-node.03` | `k8s-architecture` | the word "drain" |
| `control-plane.01` | `k8s-architecture` | anything about a control plane outage |
| `declarative-*.01/.02/.03` | `k8s-architecture` | the declarative model, beyond one incidental "desired state" |
| `deployment.01`, `deployment.02`, `declarative-*.02` | `k8s-deployment` alone | any definition of a Service, which the key or a distractor turns on |
| `deployment.04` | `k8s-deployment` alone | per-instance identity or per-replica storage |
| `pod.03` | `k8s-pods` alone | that a replacement pod carries a different **name** |
| `cncf.03` | `cncf-who-we-are`, `cncf-charter` | the words sandbox, incubating, or graduated as maturity levels |

**Citation rot found:** `github.com/cncf/toc/blob/main/process/graduation_criteria.md`, the natural
home for the graduation criteria, now returns a 281-byte stub that only forwards to
`.github/ISSUE_TEMPLATE/template-graduation-application.md`. The template, not the old path, is
what is registered.

### Seven sources registered in `data/sources.json`

`k8s-drain`, `k8s-statefulset`, `k8s-objects`, `k8s-declarative-config`, `cncf-project-kubernetes`,
`cncf-graduation-application`, plus `k8s-nodes` which task 55b had already registered. Each carries
in `notes` the sentence that made it necessary. The one that settles the most items is
`cncf-project-kubernetes`: *"Kubernetes was accepted to CNCF on March 10, 2016 at the Incubating
maturity level and then moved to the Graduated maturity level on March 6, 2018."*

**Duplicate registration noticed, not fixed:** `lf-about` and `linux-foundation-about` are two ids
for the same URL, `https://www.linuxfoundation.org/about`. This range uses `lf-about`. Worth a
single deduplication pass rather than an edit from inside a verification task.

### The two double-key risks, and they were real

1. **`cluster-and-node.03`** asked what happens to "several running pods" on a drained node and
   keyed "recreated on other nodes". A **bare pod** evicted by a drain is not recreated by
   anything, which makes o3 ("deleted permanently") defensible on the stem as written. Stem
   tightened to pods that belong to Deployments.
2. **`deployment.03`** asked what happens when a Deployment's pod template changes and keyed the
   rolling ReplicaSet swap. o3 describes the **Recreate** strategy, which the Deployment page
   documents as a real option: "All existing Pods are killed before new ones are created when
   `.spec.strategy.type==Recreate`". The only thing excluding o3 was a run-on meta-clause appended
   to o3's own text. Stem now names the default strategy, which is what the page calls
   RollingUpdate.

Both are exactly the failure mode task 55b flagged: **the appended commentary clause was doing
work a precise stem should do**, so removing the tell exposed the ambiguity underneath it. Any
agent clearing the remaining tails in items 1–30 should expect the same and check each stem.

### One distractor `why` that stated a false fact

`control-plane.02` o2's `why` asserted that the API server "is the only component that talks to
etcd". No Kubernetes page states that as fact. The etcd administration task page states it as a
*recommendation* — "Access to etcd is equivalent to root permission in the cluster so ideally only
the API server should have access to it" — and then explains how an administrator configures TLS
to achieve it. Rewritten to the architecture page's own description of the API server.

### Rationales that argued from the exam rather than from a fact

Four rationales in this range corrected a reader by appealing to the paper: `kubernetes.03` o1
("The exam deliberately mirrors this shape across two different domains"), and all of `cncf.02`
o1, o2 and o4 ("The exam's recurring pattern is exactly this…", "hosting foundations in this exam
consistently do not govern…", "The exam expects the vocabulary and the shape…"). A rationale that
cites the exam teaches pattern-matching on the paper and is checkable against nothing. All four
rewritten to the two documents that actually settle the hosting-versus-governing split: CNCF
charter §8(c) and the Kubernetes Steering Committee charter.

Two options referred to **the exam from inside their own text** — `kubernetes.02` o3 ("since the
exam confines itself entirely to single-host Docker concepts") and o4 (in its appended clause).
These are the two the corpus scan finds in this file; both reworded.

### The appended-clause shape tell — this range's 16 cleared

Task 55b measured this and cleared items 31–59; task 55a left items 1–30 alone. Re-measured at the
start of this task: **43 of 258 distractors and 0 of 86 keys**, 16 of them in items 60–86. All 16
cleared here, in the distractor's own assertive voice, keeping the false claim and discarding the
commentary. **16 remain, all in items 1–30, and are now the only ones left in the file.**

Removing 16 long tails shortened this range's distractors and flipped the key into being the
longest option in **18 of 27 items, against 7% at baseline** — a worse tell than the one being
fixed, and it also tripped `q-length-cue` on two items. Twelve distractors were re-lengthened with
substantive false content — a wrong mechanism stated plainly, never a commentary tail and never a
paraphrase of the option's own `why`. **No key was truncated.**

| Scan | 60–86 before | 60–86 after | 1–30 | 31–59 | File |
| --- | --- | --- | --- | --- | --- |
| em-dash trailing clause | k 22% / d 0% | k 22% / d 0% | k 3% / d 0% | k 17% / d 0% | k 14% / d 0% |
| two-clause option text | k 0% / d 0% | k 0% / d 0% | k 0% / d 0% | k 0% / d 0% | k 0% / d 0% |
| meta-commentary tail | k 0 / d 16 | k 0 / d 0 | k 0 / d 16 | k 0 / d 0 | k 0 / d 16 |
| key is longest option | 7% | 26% | 3% | 17% | 15% |
| mean option length | k147 / d145 | k147 / d129 | k134 / d138 | k153 / d132 | k145 / d133 |
| six-token tail reused 3+ times | 0 | 0 | 0 | 0 | 0 |
| `why` pasted into own `text` | 0 | 0 | 0 | 0 | 0 |

The em-dash gap was **not widened** — this is one of the three files where it is nearly closed and
it stands exactly where it did. Key-is-longest at 26% in this range is chance (25%). No option in
this range is a bare code span. No item in this range turns on a PCI DSS requirement number.

### Adjudication of prior findings

- **Task 55a's "Note for the whole file, outside this range"** (leave the unpunctuated appended
  clause alone until one agent fixes it file-wide): **rejected for this range**, on the same
  ground task 55b rejected it. The measurement is decisive — the clause identified a wrong option
  with 100% precision and appeared on more than one option in six of ten items at baseline. The
  consistency argument does not survive a tell that strong, and the file is now down to the 16
  instances in items 1–30.
- **Task 55b's finding** that clearing the tails flips items into key-is-longest and needs
  re-lengthening: **confirmed independently here**, at larger scale (18 of 27 items flipped).
  Recorded above so the agent clearing items 1–30 budgets for it.
- **`docs/verification/factcheck-containers.json`** was read and not treated as a clearance. All
  52 of its entries concern Docker commands and image/registry concepts in items 1–59; **none
  bears on items 60–86**, so there was nothing here to adjudicate.

### `data/` and the guide

The eight concept `description` fields in `data/topics/05-devops.json` covering this range were
each checked against the primary sources and are **accurate as written** — including the
`kubernetes` description's "hosted by the CNCF as a graduated project while governing itself
through its own community structures", which is precisely the distinction the items test and
which is now sourced to the CNCF's own project page rather than to the charter. **No factual
correction to `data/` or to `study-guide/` was required from this range.** The only `data/`
changes are the seven new source registrations and the concept-level `additional_sources`
additions that fix the landing-page defect at its root.

### Residual limit, recorded rather than hidden

`pod.03` keys on a replacement pod having a **new name** as well as a new address. The Pods page
supports the address (it calls the pod's identity "an ephemeral network identity") but says
nothing about the name; the name claim rests on the Deployment page's worked example, where
ReplicaSet-created pods are named `nginx-deployment-75675f5897-7ci7o`, that is Deployment name +
`pod-template-hash` + a random suffix. The claim is therefore sound for a Deployment-managed pod
and would be **wrong for a StatefulSet**, whose pods keep a sticky per-ordinal name across
rescheduling. This bank has no StatefulSet concept, and the distractor that could have exploited
the gap fails anyway because it claims the *same pod* survives. The item's
`verification.reasoning` records this rather than claiming a verbatim source.

## Task 54a — Linux Fundamentals :: Command Line (items 1–29, agent `verify-command-line-a`)

29 of 29 items in range verified, all ending `confirmed`. **20 were refuted as authored and
repaired**; 9 were confirmed unchanged. Two wrong premises, one double key, one over-claiming key,
nine self-refuting distractors, one misdescribed stem, and a broad citation failure across seven
of the ten concepts. Every source cited below was fetched with `curl` and read.

### The blocking environment fact, recorded first

**`gnu.org` was unreachable for the whole task** — `curl https://www.gnu.org/` timed out at 20s,
`ctx_fetch_and_index` failed on all eight coreutils node pages, and the single-page coreutils
manual (`gnu-coreutils-manual`, the most-cited source in this competency) could not be retrieved.
Nothing was confirmed against it. Where the coreutils manual was the only documentation source for
a claim, the corresponding **man7.org man page for that exact tool** was registered and read
instead. `gnu-coreutils-manual` was left in place where the tool genuinely is a coreutils program;
it was never used as the basis for a verdict.

### Two wrong premises — content defects, not citation defects

1. **`dot-dotdot-and-tilde.01` taught a scenario that does not happen.** It put a tilde in a
   crontab job and explained the failure with "cron does not read that file with a shell".
   crontab(5) says the opposite of the load-bearing half: *"The entire command portion of the
   line, up to a newline or a `%` character, will be executed by /bin/sh or by the shell specified
   in the SHELL variable of the cronfile."* A tilde in the command field **is** expanded, by that
   shell. The item was re-set on a crontab **environment-assignment line**, which cron parses
   itself (*"An environment setting is of the form: name = value ... any subsequent non-leading
   white spaces in value is a part of the value assigned to name"*), where the lesson is real. All
   four options were rewritten against crontab(5), bash(1) and path_resolution(7).
2. **`root-directory-vs-root-vs-home.01` attributed a rationale to the FHS that the FHS does not
   give.** The key's `why` said the FHS keeps `/root` on the root filesystem "so it stays
   available even if a separately mounted `/home` fails to come up". FHS 3.0 §3.14 says only *"The
   root account's home directory may be determined by developer or local preference, but this is
   the recommended default location"*, and footnote [16] says *"If the home directory of the root
   account is not stored on the root partition it will be necessary to make certain it will
   default to / if it cannot be located"* — adjacent, but not that claim. The answer (`cd /root`)
   was correct and was kept; the rationale was rewritten to what §3.14, footnote [16] and §3.8
   actually say.

### The double key

**`creating-and-removing-files-and-directories.03`** asked why `rm -rf "$DIR/"` with `$DIR` unset
is *catastrophic*, and offered as a distractor "The command is aborted automatically, since GNU
`rm` always refuses an empty variable". rm(1): **`--preserve-root[=all] do not remove '/'
(default)`**. For the operand this key actually produces — `/` — the distractor's leading clause is
**true**; only its stated reason is wrong. Its own `why` compounded the error by calling the
protection something that applies "in some configurations", understating a documented default. The
stem now asks the falsifiable question ("What single operand does the shell hand to `rm`?"), the
distractor was replaced with a false claim about parameter expansion, and the key's `why` states
the `--preserve-root` default explicitly instead of implying an unprotected disaster.

### The over-claiming key

**`root-directory-vs-root-vs-home.03`** keyed on "The directory exists — it is conventionally mode
700". No cited source says so, and it is not universal: Debian-derived systems ship `/root` as
`drwx------` (700), Red Hat-derived ones as `dr-xr-x---` (550). The EACCES-versus-ENOENT
distinction the item actually teaches is untouched; the mode assertion was replaced with
"its permissions simply do not grant that user access", with both conventional modes named in the
`why` rather than one asserted as *the* convention.

### One stem that misdescribed its own output

**`finding-files.02`** said that `find . -name *.log`, in a directory containing `error.log`,
"only matches that one file". It does not: the shell rewrites the command to
`find . -name error.log`, which still recurses and returns **every** file named `error.log` in the
tree. Stem corrected to "the results contain nothing but files named `error.log`".

### Sources that did not contain what they were cited for

| Item(s) | Claim | Cited source | Verdict |
| --- | --- | --- | --- |
| `command-syntax.02` | macOS's BSD `ls` rejects `--all` | POSIX ch.12, coreutils manual | Neither documents Apple's `ls` at all. Apple's own ls(1) SYNOPSIS lists `--color` as its only long option; `--all` appears nowhere. Registered `apple-ls-1`. |
| `getting-help.02` | `apropos` searches an index built by `mandb` | man(1), man-pages(7) | man(1) mentions mandb only under `-u`; man-pages(7) is about *writing* pages. apropos(1) states it outright: *"The database searched by apropos is updated by the mandb program."* Added `man-apropos`. |
| `getting-help.03` | `--help` text ships inside the binary | man(1), man-pages(7) | Neither mentions `--help`. Re-grounded on man(1) FILES (*"/usr/share/man A global manual page hierarchy"* — the page is a separate installed file) plus ls(1)'s `--help` entry. |
| `absolute-vs-relative-paths.02` | `pwd -P` prints the physical path | path_resolution(7), POSIX Shell Command Language | Neither covers the `pwd` utility. pwd(1): *"-P, --physical resolve all symlinks."* Added `man-pwd-1`, `man-bash-1`. |
| `absolute-vs-relative-paths.03` | a child cannot change its parent's cwd | path_resolution(7), POSIX Shell Command Language | Neither covers process inheritance or `cd`'s scope. Added `man-bash-1`. |
| `dot-dotdot-and-tilde.02` | bash's `cd ..` is logical by default | path_resolution(7), FHS, LF objectives | None documents bash's `cd`. bash(1): *"If neither -L nor -P is supplied, cd behaves as if -L had been supplied."* Added `man-bash-1`; dropped `fhs-3-0`, which supported nothing in this concept. |
| `viewing-file-contents.01` | `less` reads lazily | coreutils manual | **`less` is not a coreutils program.** less(1): *"Less does not have to read the entire input file before starting."* Registered `man-less-1` (plus `man-cat-1`, `man-head-1`). |
| `finding-files.01`, `.03` | `which -a` lists every match on `PATH`; `whereis` searches fixed locations | find(1), locate(1), coreutils manual | None documents either tool. which(1): *"--all, -a  Print all matching executables in PATH, not just the first."* whereis(1): *"locate the desired program in the standard Linux places, and in the places specified by $PATH and $MANPATH."* Registered `gnu-which-1`, `man-whereis-1`. |
| `file-type-and-metadata.02` | `ctime` semantics | file(1), coreutils manual | file(1) says nothing about timestamps. stat(1): *"%z time of last status change."* Registered `man-stat-1`. |

### Twelve sources registered in `data/sources.json`

`man-ls-1`, `man-mkdir-1`, `man-rmdir-1`, `man-rm-1`, `man-tail-1`, `man-cat-1`, `man-head-1`,
`man-pwd-1`, `man-stat-1`, `man-less-1`, `man-whereis-1`, `gnu-which-1`, `apple-ls-1` (one of
these already existed and was reused). All were wired into the ten concepts'
`additional_sources` in `data/topics/01-linux-fundamentals.json` — **the fix is at concept level**,
because every item's `source_ids` is a verbatim copy of its concept's source lists, which is the
root cause confirmed in earlier waves.

### The `%w` problem — a key that its own cited tool would have contradicted

`file-type-and-metadata.02` keyed on "traditional Unix metadata has no creation time at all", and
o4's `why` generalised it to "none of the three fields `stat` reports is a creation time". But
stat(1) documents **`%w`, "time of file birth"**. A reader checking the cited tool would find a
creation field and conclude the item was wrong. The key was narrowed to the precise, defensible
claim (`ctime` is the inode's status-change time, not a creation time) and the `why` fields now
name `%w` explicitly. No distractor is rescued by the clarification: all three name the wrong
field.

### Guide corrections — true-but-misreadable prose, two instances

Both in `study-guide/01-linux-fundamentals/command-line.md`; the guide is hand-maintained, so
these were edited directly and `npm run generate` + `npm run check-guide` re-run (0 errors,
0 warnings).

1. **The crontab tilde claim was wrong, not merely misreadable.** The guide said a tilde "pasted
   into a crontab, a systemd unit file, or a quoted argument silently fails", and knowledge-check
   question 3 answered "those files are not read by a shell". crontab(5) hands the command field
   to `/bin/sh`. Both passages now distinguish the crontab's environment lines (cron assigns them
   verbatim) from its command field (run through `/bin/sh`, which does expand a tilde).
2. **`stat`'s "common mistake" cell** read "it is the inode change time, and traditional Unix
   metadata has no creation time at all" — which reads, next to GNU `stat`, as a claim that no
   birth time is ever reported. `study-guide/02-system-administration/system-administration.md`
   already states the correct nuance ("ext4, XFS and Btrfs do record a birth time"), so the two
   guides disagreed. The command-line cell now says the creation time, where a filesystem records
   one, is reported separately as `%w`, never as `ctime`.

### Shape work — measured before and after, over items 1–29

| Scan | Before | After |
| --- | --- | --- |
| Self-refuting distractors (trailing clause reversing the option's own claim) | 9 | 0 |
| Six-token tails reused 3+ times | 1 (`"not what actually happens in practice"`, ×4) | 0 |
| Options that are nothing but a code span | 0 | 0 |
| Key-is-longest | 1/29 (3%) | 2/29 (7%) |
| Em-dash trailing qualifier, key / distractor | 3% / 5% | 3% / 2% |

The nine self-refuting options were not detected by n-gram overlap; the reliable signal was a
trailing subordinate clause (`though` / `even though` / `— a natural guess, but`) that reverses
the claim the option had just made. Four of the nine shared one verbatim tail, which is why the
tail scan and the self-refutation scan cleared together. **Every strip was repaired by replacing
the giveaway with a concrete false mechanism, never by truncating**, which is why clearing the
padding moved key-is-longest by only one item and left keys shorter than distractors on average
(74 vs 81 characters).

**On the em-dash tell**, this file was flagged as one of the very few with no key/distractor gap
(2% / 3% corpus-wide) and marked *do not open*. Stripping four self-refuting distractors removed
four distractor em-dashes as a side effect and drove the in-range distractor rate to 1%, opening a
gap in the wrong direction. Two rewritten distractors were given trailing em-dash qualifiers
carrying real false clauses to close it back to 3% / 2%. **Anyone editing this file should measure
this after removing padding, not before** — the padding was carrying the em-dashes.

### Adjudication of prior findings

`docs/verification/qbank-findings.md` contained **no prior section for Linux Fundamentals ::
Command Line**, so there were no findings to adjudicate. `docs/verification/factcheck-command-line.json`
(64 claims) is not a clearance and was not treated as one; CL-001, the claim covering
`command-syntax`, was independently re-derived from POSIX Guidelines 3, 5 and 10 and is sound.

### Residual limit, recorded rather than hidden

`getting-help.03`'s key says `--help` output "is compiled into the binary itself". The strictly
sourced half is that a man page is a **separate installed file** (man(1) FILES) that a stripped
image can omit, while `--help` is an option of the program itself (ls(1)). No fetchable document
states the implementation detail that the help string is linked into the executable; the `why` now
rests on the separable-file contrast rather than on that detail. The item's
`verification.reasoning` records this rather than claiming a verbatim source.

### Linux Fundamentals :: Command Line, items 61–86 (task 54c, `verify-command-line-c`)

Range: array items 61–86, the nine concepts `standard-streams`, `redirection`, `pipes`, `grep`,
`regular-expressions`, `sed`, `awk`, `cut-sort-uniq-and-wc` and `diff-and-comparison`. All 26 end
`confirmed`. Nine were confirmed as authored; **17 were refuted as authored, repaired, and
re-verified**, with the pre-repair defect preserved behind a `REFUTED AS AUTHORED.` marker in each
item's `verification.reasoning`.

#### The network limit, stated up front because it shapes every citation below

`www.gnu.org` is unreachable from this sandbox. `curl` and the indexing fetch tool both time out at
the TCP level on every gnu.org URL tried, including the site root, over both IPv4 and plain HTTP —
`HTTP:000`, connection timed out, not a 404 and not an empty 200. Seven of this range's registered
sources are gnu.org manuals. This is a sandbox egress restriction rather than citation rot, so it
was **not** recorded as a source defect. Every gnu.org-cited claim was instead verified against the
identical GNU manual page rendered at man7.org and against POSIX.1-2024, and the reachable URLs are
what the items' `sources_read` arrays list. Where the man7.org rendering is an abridgement that
genuinely omits the behaviour (the `s///g` flag and sed's default auto-print are the two cases), a
POSIX source was registered and added rather than leaving the claim resting on a page nobody in this
environment can open.

#### The dominant defect, again: a source cited for content it does not contain — 11 of 26 items

The root cause held for a third time. Every item's `source_ids` was a verbatim copy of its concept's
sources in `data/topics/01-linux-fundamentals.json`, so wherever a concept's source set was thin,
every item under it inherited the same hole. Fixed at the concept level and then mirrored onto the
items. The specific misses, each established by reading the cited document rather than by assuming:

- `pipes.02` keys on **`ls` taking operands rather than standard input**, cited to the bash manual
  and the POSIX Shell Command Language chapter. Neither documents `ls`. ls(1): `ls [OPTION]...
  [FILE]...`, "List information about the FILEs (the current directory by default)".
- `pipes.03` is entirely about **the scope of `sudo`** in a pipeline, with no sudo source cited.
  sudo(8): "sudo allows a permitted user to execute **a** command as the superuser or another user".
- `redirection.01` turns on `sort`, `redirection.03` on `tee` — both coreutils, neither cited.
- `grep.01` asserts what **`find`, `locate` and `whereis`** do in three separate distractor `why`
  fields, cited only to grep(1). All three were checked against their own manuals and all three
  `why` fields are true; the citation, not the content, was the defect.
- `awk.01` asserts what **`sed` and `cut`** do, cited only to the gawk manual.
- `awk.02` keys on **shell** behaviour — double quotes still expanding `$1` as a positional
  parameter — with no shell source cited.
- `diff-and-comparison.02` keys on **`sha256sum`**, a coreutils tool, cited only to diffutils.
- `diff-and-comparison.03` turns half on **`&&`**, cited only to diffutils.
- `regular-expressions.02` is half about **shell globs**, cited only to grep and sed.
- `sed.02` — see below, the worst of the set.

#### A GNU extension taught as POSIX, in an item and in the guide

This is the finding this range exists to catch, and it appeared twice.

`regular-expressions.01`'s key `why` read: *"In POSIX basic regular expressions — grep's default —
the operator meanings of `+ ? | ( ) { }` are reached only by backslashing them."* That is true of
GNU grep and false of POSIX. POSIX BRE defines the backslashed forms `\( \)` and `\{ \}` only;
**`\?`, `\+` and `\|` are GNU extensions the standard does not provide**, which is exactly why `-E`
is the portable route to `?`. The `why` now attributes the behaviour to grep's default dialect,
drops the false claim about the standard, and points at `-E`.

The **guide carried the same error in prose**, in `linux.command-line.regular-expressions`:
*"In POSIX basic regular expressions — grep's and sed's default — the characters `+ ? | ( ) { }` are
literal, and the operator meanings are reached by backslashing them: `\+`, `\?`, `\|`, `\(`, `\)`."*
Corrected in `study-guide/01-linux-fundamentals/command-line.md`: the paragraph now separates the
two POSIX BRE pairs from the three GNU extensions and says plainly that a script relying on the
latter is not portable. `data/topics/01-linux-fundamentals.json`'s `description` for the concept
("Pattern syntax used by grep, sed, and others. Basic anchors, character classes and quantifiers are
enough at this level.") is accurate and needed no change — this was a guide-prose defect only.

**Finding against `docs/verification/factcheck-command-line.json`, recorded not deleted.** Claim
`CL-039` states *"In POSIX BRE, `+ ? | ( ) { }` are literal unless backslashed"* and is marked
`confirmed`, sourced to grep(1) plus the POSIX Regular Expressions chapter. The first half is right
and the second half is the same overreach: under POSIX BRE, `\?` and `\+` are not defined operators.
grep(1) — the cited page — describes GNU grep's behaviour, and the POSIX chapter does not support
the claim as worded. This is the second prior factcheck artifact in this project found to assert
more than its source does, and it is the artifact that most likely seeded both defects above.

#### The man-page trap in its exact form: `sed.02`

The item asks what happens when a GNU `sed -i` script is run on macOS's BSD sed. The **only** cited
source was the GNU sed manual, which documents GNU sed and says nothing whatever about the BSD build
the stem runs on — the cited page cannot settle the question the item asks. Registered a new source
`bsd-sed-man` (FreeBSD sed(1), the lineage macOS ships) and added it to the concept and the item.

The content is right, and two things were established rather than assumed. First, the BSD family is
**not uniform**: FreeBSD sed(1) and the macOS man page read locally both document `-i extension`
with the extension as a separate argument, while **OpenBSD sed(1) documents `-i[extension]` with the
suffix attached, exactly as GNU does**. The stem names macOS, so the item is correct, but the key's
`why` said "BSD sed" flatly and has been narrowed to the macOS/FreeBSD lineage. Second, confirmed
empirically on this macOS 25.5 host: `sed -i 's/a/b/g' t54c.txt` exits 1 with
`sed: 2: "t54c.txt": undefined label '54c.txt'` and leaves the file unchanged — the script text is
swallowed as the suffix, precisely as the key predicts. The guide's `sed` **Traps** paragraph made
the same flat "BSD sed" claim and now names macOS and FreeBSD and records the OpenBSD divergence.

#### The shape work: 14 self-flagging distractors, and the length cue they were masking

Scanned by the trailing-subordinate-clause signal rather than by n-gram overlap, as instructed. Two
distinct shapes were present.

**Verbatim-`why` self-refutation — 4 options across 2 items.** `pipes.01` was the worst item in the
range: **three of its four options** ended in a clause that reversed the claim the option had just
made — o2 "…since this swaps the two roles", o3 "…since the three are distinct", and o4, at 227
characters, whose tail was a straight paste of its own `why`. `regular-expressions.02` o3 was the
single most blatant: *"Regular expressions do not use `.` at all; only globs assign it a meaning,
since A regular expression's `.` is one of its most common metacharacters…"* — capital A mid-sentence
and all, the option contradicted itself inside one sentence.

**The "on the assumption that" / "is assumed to" tell — 10 options.** `redirection.02` o4,
`redirection.03` o3, `pipes.03` o2, `grep.02` o3, `regular-expressions.01` o3, `sed.02` o3,
`awk.02` o2, `cut-sort-uniq-and-wc.02` o2, `cut-sort-uniq-and-wc.03` o4, `diff-and-comparison.02`
o4, `diff-and-comparison.03` o4. This construction announces that the option is the one holding the
mistaken belief, so a reader eliminates it on form without knowing the subject. Every one was
rewritten to assert its false claim in the option's own voice; the `why` fields, which are where the
correction belongs, were left to do that work. `grep.02` o3's tail was also garbled English ("adds
the line-number output line numbers require"), and its rewrite claims two things, so its `why` was
extended to rebut both halves.

**Clearing the padding did not expose a length cue, and this was measured rather than hoped for.**
Distractors were rewritten at comparable length rather than truncated, and no key was touched. In
the two items where the padded option was by far the longest — `pipes.01` (o4 was 227 characters
against a 135-character key) and `cut-sort-uniq-and-wc.02` (o2 was 195 against 107) — the rewritten
option is still the longest in its item.

Scan numbers for this range, before → after:

| Scan | Before | After |
| --- | --- | --- |
| Key is the longest option | 0 of 26 | 0 of 26 |
| Self-flagging / verbatim-`why` distractors | 14 | 0 |
| Options that are nothing but a code span | 0 | 0 |
| Six-token tails reused 3+ times | 0 | 0 |
| Em-dash rate, keys vs distractors (whole file) | 2% / 3% | 2% / 2% |

The em-dash check was run and **not** acted on, as instructed: keys and distractors sit at the same
rate, so there is no gap to open.

#### No second-correct-answer defect found, and here is what was actually run

This range is dense with the shapes that produce one, so each was reasoned through rather than
eyeballed. `redirection.02`/`.03`: `> out 2>&1` versus `2>&1 > out` was checked against bash(1)'s own
worked example (`ls > dirlist 2>&1` versus `ls 2>&1 > dirlist`) and against POSIX 2.7's
beginning-to-end evaluation order — the reversal distractor is genuinely the reverse, not a second
truth. `&>` was searched for across the entire POSIX Shell Command Language chapter and does not
appear, so calling it non-POSIX is right and the item does not attribute a bash construct to the
standard. `cut-sort-uniq-and-wc.02`: `sort -u` ("output only the first of lines with equal keys")
against `uniq -u` ("only print unique lines") are opposite selections even on sorted input, so the
"yes, if sorted first" option is false rather than defensible. `awk.03`: POSIX awk's FS rules were
read in full — the whitespace-collapsing behaviour belongs **only** to the `<space>` default, and
`-F:` falls under "if FS is any other character c, fields shall be delimited by each single
occurrence of c" — so o2 is false rather than a second key. `diff-and-comparison.03`: diff(1)'s
0/1/2 and bash(1)'s "command2 is executed if, and only if, command1 returns an exit status of zero"
settle it in one direction only. `grep.03` o3's "Is a directory" claim was checked against grep(1)'s
`-d ACTION` default of `read` rather than assumed.

#### Sources registered and concept-level fixes

Five new sources in `data/sources.json`: `posix-sed`, `posix-awk`, `posix-diff`, `bsd-sed-man`,
`man-whereis-1`. Concept `additional_sources` in `data/topics/01-linux-fundamentals.json`:
`redirection` += coreutils; `pipes` += coreutils, sudo; `grep` += find, locate, whereis;
`regular-expressions` += bash; `sed` += posix-sed, bsd-sed-man; `awk` += posix-awk, bash, coreutils,
sed; `diff-and-comparison` += posix-diff, sha256sum, bash. The guide's `sources:` metadata lines for
the seven affected concepts were updated to match.

#### `data/` descriptions checked, and found correct

All nine concept `description` fields in `data/topics/01-linux-fundamentals.json` were checked
against the primary sources and are accurate as written — including `cut-sort-uniq-and-wc`'s "uniq
only collapses adjacent duplicates, so sort usually precedes it", which uniq(1) states almost
verbatim ("`uniq` does not detect repeated lines unless they are adjacent. You may want to sort the
input first, or use `sort -u` without uniq"). The only guide correction required from this range is
the POSIX-BRE paragraph and the BSD-sed narrowing described above.

## Task 54d — Linux Fundamentals :: Command Line (items 87–110, agent `verify-command-line-d`)

Range: the nine concepts `text-editors` (2), `archiving-and-compression` (3), `file-transfer` (3),
`shell-scripting-basics` (3), `script-control-flow` (2), `system-commands` (3), `who-is-logged-in` (2),
`general-networking-commands` (3), `port-ranges` (3). 24 of 24 verified; 18 refuted as authored,
repaired, re-checked and now `confirmed`; 6 confirmed as authored.

### 1. The one wrong key — and its distractor was the right answer

`q.linux.command-line.archiving-and-compression.02` asked what `tar cfz logs.tar.gz /var/log`
produces, and keyed "an archive where `z` is misread as the archive filename". That is false for
that command line, and the authored o2 ("a correctly gzip-compressed archive, since the letters
can be given in any order") was correct.

GNU tar documents two different rules and the item applied the wrong one. In **traditional style**
— the first argument a cluster of letters with no hyphen — "the arguments are read in the same
order as the option letters", and GNU tar's own worked example is `tar cfv etc.tar /etc`, with `f`
ahead of `v`. The last-in-cluster requirement belongs to **UNIX short-option style**: "Options that
take arguments (whether mandatory or optional), can appear at the end of such a cluster, e.g.
`-vkpf a.tar`."

Verified empirically against GNU tar 1.35 in a `ubuntu:24.04` container:

- `tar cfz logs.tar.gz src` → exit 0, real gzip archive, `tar tzf` lists `src/` and `src/a.txt`.
- `tar -cfz d.tgz src` → creates a file literally named `z`, then `tar: d.tgz: Cannot stat: No such
  file or directory`, exit 2.

**Fix.** The item was rewritten around `tar -cfz logs.tar.gz /var/log`, the hyphenated form where
the key's mechanism is the real one, with o2's `why` now stating the traditional-style contrast
explicitly so the distinction is taught rather than papered over.

### 2. Source of the error: `docs/verification/factcheck-command-line.json`, claim CL-049

CL-049 reads, verdict `confirmed`: "`tar czf archive.tar.gz dir` creates a gzip-compressed archive
(`f` must be the last clustered letter since it takes an argument)". The parenthetical is true only
of the hyphenated style and is stated unconditionally. The item, and the guide, inherited it. The
factcheck artifact is **not a clearance**; this is the second recorded instance of one being wrong.

### 3. Guide prose corrected — the same error, in two places

`study-guide/01-linux-fundamentals/command-line.md`:

- The **Traps** paragraph under `command-syntax` said "which is why `tar czf` works and `tar cfz`
  does not." Replaced with the hyphenated-vs-traditional distinction, quoting tar's own wording.
- The `archiving-and-compression` **Commands** table listed "Writing `tar cfz`, which makes `z` the
  archive name" as the common mistake, and its **How it works** paragraph said the archive name
  "must come immediately after the `f`". Both corrected to scope the strict-order rule to the
  hyphenated form.

This is not the true-but-misreadable class seen in earlier waves. The guide was flatly wrong.
`data/topics/01-linux-fundamentals.json`'s description for the concept ("tar czf creates a
compressed archive in one step") is correct and was left alone.

### 4. Sources that did not contain what they were cited for

The confirmed root cause held again: every item's `source_ids` was a verbatim copy of its concept's
list, so a concept-level gap propagated to every item under it.

| Concept | Was cited to | Claim it does not cover |
| --- | --- | --- |
| `text-editors` | `posix-vi` only | `:wq` and `:q!` — vi(1p) only says `:` shall "Execute one or more ex commands"; the commands are in ex(1p) |
| `archiving-and-compression` | `gnu-tar-manual` only | `gzip -l`'s output, a gzip option |
| `system-commands` | `man-ps-1`, `gnu-coreutils-manual` | `free`'s columns (procps-ng, not coreutils and not ps); SIGKILL being uncatchable; a deleted-but-open file keeping its blocks |
| `who-is-logged-in` | `gnu-coreutils-manual`, `man-w-1` | `last` and wtmp — `last` is util-linux |
| `general-networking-commands` | `iproute2-ip-address-man`, `iproute2-ss-man` | everything in the `ping` item and everything in the `dig` item |
| `port-ranges` | `rfc-6335`, `man-ip-7`, `kernel-ip-sysctl` | an item entirely about an `ss` flag and the `/etc/services` lookup |

**A near-miss worth recording.** The `ping` item's central fact is that ICMP is commonly filtered.
Re-citing it to ping(8) would have looked like a fix and been one. ping(8) does **not** say this —
it documents only that ping sends ICMP ECHO_REQUEST and that "If ping does not receive any reply
packets at all it will exit with code 1". The claim is sourced instead to the Nmap host-discovery
documentation: "many hosts and firewalls now block these packets, rather than responding as
required by RFC 1122". Both are now cited, for their respective halves.

### 5. A key rationale contradicted by the source that would carry it

`q.linux.command-line.general-networking-commands.02`'s key `why` said `/etc/nsswitch.conf`
"normally consults `/etc/hosts` first". That is a common configuration, not a documented default,
and nsswitch.conf(5)'s own worked example is `hosts: dns [!UNAVAIL=return] files` — DNS first. The
`why` now states the switch mechanism without asserting an order the source does not fix.

### 6. Two keys tightened for accuracy, without weakening them

- `file-transfer.03`: the key said the port selection "silently fails to apply". `scp`'s `-p` takes
  no argument, so `2222` becomes an extra source operand and scp reports it. Reworded; o3's `why`
  (which turns on there being no syntax error) was rewritten to match what actually happens.
- `port-ranges.03`: the key asserted an `/etc/services` lookup with neither ss(8) nor services(5)
  cited. Both now are, and the `why` quotes them.

### 7. Sources registered in `data/sources.json` (9)

`posix-ex`, `man-gzip-1`, `man-last-1`, `man-ping-8`, `nmap-host-discovery`, `man-dig-1`,
`man-nsswitch-conf-5`, `man-services-5`, `man-kill-1`. Checked against existing ids and URLs first:
`man-free-1`, `man-signal-7` and `man-unlink-2` were already registered and were reused rather than
duplicated. None of the nine introduces a new duplicate URL.

### 8. Duplicate source ids — reported, not removed

`data/sources.json` carries 9 id pairs sharing one URL. The pair this task's brief names:

- `rfc-6335` and `rfc-6335-port-number-procedures`, both → `https://www.rfc-editor.org/rfc/rfc6335.html`

The other eight: `man-uptime-1`/`man-uptime`, `fhs-3.0`/`fhs-3-0`, `lf-about`/`linux-foundation-about`,
`man-path-resolution-7`/`man-path-resolution`, `iproute2-ss-man`/`man-ss`,
`rfc-9110-http-semantics`/`rfc9110`, `aws-reserved-instances`/`aws-ec2-reserved-instances`,
`docker-container-start`/`docker-cli-start`.

Not consolidated here: `rfc-6335-port-number-procedures` is cited by
`questions/02-system-administration/networking.json` and `data/topics/02-system-administration.json`,
and `iproute2-ss-man`/`man-ss` similarly span competencies. Deduplication is a whole-bank edit and
would collide with the three agents working this file concurrently. This range uses `rfc-6335` and
`iproute2-ss-man` throughout.

### 9. The self-refuting distractor shape — measured, stripped, and what it was masking

Counted by the reliable signal rather than n-gram overlap: a trailing clause that names the
reader's error instead of asserting a claim (`on the assumption that…`, `treating … as if…`,
`dismissing…`, `…assumed to…`). **14 of 72 distractors in the range carried one; 0 remain.**

The worst two were not merely padding:

- `port-ranges.03` o4 ended "since protocol selection is controlled by the separate `t` and `u`
  flags" — a **true** statement, restating the opening clause of its own `why`, attached to a false
  option.
- `file-transfer.03` o4 ended "since `scp` does not simply discard an unrecognized-for-this-purpose
  flag", which negates the claim the option had just made.

Every one was replaced with an assertive **false** clause of comparable length, never truncated,
and each affected `why` was rewritten to rebut the new clause. Scan numbers before → after,
over the 24 items:

| Measure | Before | After |
| --- | --- | --- |
| Self-refuting distractor tails | 14 / 72 | 0 / 72 |
| Mean option length, keys | 91.2 | 92.7 |
| Mean option length, distractors | 95.3 | 92.3 |
| Items where the key is the longest option | 1 / 24 | 1 / 24 |
| Six-token tails reused 3+ times | 0 | 0 |
| Options that are nothing but a code span | 0 | 0 |
| Duplicate options within an item | 0 | 0 |

Em-dash tell, file-wide (the file was flagged as having no gap, keys 2% / distractors 3%): after
the strip it reads **keys 2% (2/110), distractors 2% (8/330)** — the gap narrowed to zero rather
than opening. Within this range: keys 0/24, distractors 1/72.

### 10. Second-correct-answer sweep

Checked at every site the brief named. `tar -c`/`-x`/`-t` and whether `-z` is needed to read
(`archiving-and-compression.03`); `scp` vs `rsync` vs `sftp` for differential transfer
(`file-transfer.01`); `[` vs `[[` (`script-control-flow.02`); `who` vs `w` vs `last` vs `id` vs
`whoami` (`who-is-logged-in.02`, five commands named in one stem); `ss` vs `curl` vs `traceroute`
vs `hostname` (`general-networking-commands.03`, checked with the wave-A `curl -I -X DELETE`
precedent in mind — this `curl -I` distractor does not satisfy its stem, which asks which *process*
is listening). One genuine second-correct-answer defect found, in finding 1 above. No duplicate
options anywhere in the range.

### 11. Residual limits, recorded rather than hidden

- **www.gnu.org was unreachable from this sandbox** for the whole task (curl exit 28 on repeated
  attempts, https and http; `ctx_fetch_and_index` failed on the same three URLs while
  pubs.opengroup.org succeeded in the same batch). Three cited sources live there:
  `gnu-tar-manual`, `gnu-coreutils-manual`, `gnu-bash-manual`. No item was refuted for this. Where
  a claim rested on one, the same project's man page was read instead — tar(1) and GNU df(1)/du(1)
  and who(1)/id(1) at manpages.debian.org, and for Bash the maintainer's own copy of the Bash
  Reference Manual at tiswww.case.edu plus bash(1) at man7.org. Each affected item's
  `verification.reasoning` names the substitution. The gnu.org URLs are the right sources and were
  left in place; this is a sandbox network limit, not citation rot.
- **No citation rot found** in this range: every non-gnu.org URL cited by these items served the
  text it was cited for.
- **No stale quote found.** The class was live here — scp(1)'s BUGS section now reads "Since
  OpenSSH 9.0, scp has used the SFTP protocol for transfers by default", which would falsify any
  item asserting the legacy SCP protocol. `file-transfer.01` and `.03` were checked against it
  specifically; neither makes a wire-protocol claim, and whole-file transfer is true of scp under
  either protocol.
- **Not adjudicated:** `qbank-findings.md` had no prior Command Line section at the time this task
  ran, so there were no prior findings for this competency to accept or reject. The one prior
  artifact bearing on the range, `factcheck-command-line.json` CL-049, is adjudicated in finding 2.
- `q-verdict-coverage` still reports 31 errors in this competency, all on items 1–86, which belong
  to agents `verify-command-line-a`/`-b`/`-c`. Zero errors on items 87–110.

## Task 54b — Linux Fundamentals :: Command Line (items 30–60, agent `verify-command-line-b`)

Range: array items 30–60 (indices 29–59), the eleven concepts `file-management-commands`,
`reading-ls-l-output`, `case-sensitivity`, `wildcards-and-globbing`, `quoting`,
`command-chaining`, `command-substitution`, `shell-variables-and-export`,
`history-and-tab-completion`, `aliases` and `command-exit-status`. **31 of 31 end at
`confirmed`.** 18 were refuted as authored, repaired in place and re-checked; 13 were clean.
No key in the range was factually wrong.

### The two second-correct-answer defects, and both were real

**`file-management-commands.01` — `cp -r` was a working answer offered as a distractor.** The stem
asks how to copy a symlink as a symlink; the key was `cp -a` and o2 was `cp -r`, whose `why`
claimed `-r` "does not change how an individual symlink is handled — that still follows the link
unless archive mode is used". That is false. cp(1) documents `-a` as `-dR --preserve=all` and `-d`
as `--no-dereference --preserve=links`, and GNU coreutils 9.8 tested directly on this machine
copied a symlink operand **as a symlink** under `-r`, `-R` and `-a`, while plain `cp`, `-L` and
`-p` each wrote a dereferenced regular file:

```
$ cp -r link.txt copy_r.txt ; cp -a link.txt copy_a.txt ; cp -L link.txt copy_L.txt
lrwxr-xr-x  copy_a.txt -> big.txt
lrwxr-xr-x  copy_r.txt -> big.txt
-rw-r--r--  copy_L.txt
```

o2 is now `cp -L`, "always follow symbolic links in SOURCE", which is unambiguously the wrong
tool, and the distractor `why` states that true fact instead of the false one.

**`reading-ls-l-output.03` — `ls -la` very nearly answers the stem.** The stem was "Which command
shows the directory's own mode string?", the key was `ls -ld`, and o2 was `ls -la`. But `-a` adds
the `.` entry, and `.` **is** the directory itself, so its long-listing line carries exactly the
mode string asked for. The stem now asks which command *replaces the listing of contents with a
single line for the directory entry*, and o2 is `ls -lR`, whose recursive output prints the path as
a bare header and never a mode line for the named directory.

### Sources that did not contain what they were cited for

- **`posix-shell-command-language` cited for filesystem case sensitivity** — both
  `case-sensitivity` items. The POSIX Shell Command Language chapter specifies shell grammar,
  expansion and quoting and says nothing about how a filesystem compares filenames. Replaced with
  `man-ext4-5` and `man-path-resolution-7`.
- **`posix-shell-command-language` cited for regular-expression syntax** —
  `wildcards-and-globbing.02` turns on what `*` quantifies in a regex. Chapter 2 covers shell
  pattern matching only; regular expressions are POSIX XBD chapter 9. Replaced with `gnu-grep-man`,
  whose REGULAR EXPRESSIONS section states "* The preceding item will be matched zero or more times".
- **`gnu-bash-manual` + `posix-shell-command-language` cited for grep's exit codes** —
  `command-exit-status.02`. Neither specifies them. Replaced with `gnu-grep-man`: "Normally the
  exit status is 0 if a line is selected, 1 if no lines were selected, and 2 if an error occurred."
- **`posix-shell-command-language` cited for `set` versus `env`** —
  `shell-variables-and-export.03`. Neither utility's no-argument output is described there, and
  `env` is not part of the shell command language at all. Replaced with `man-env-1` ("If no
  COMMAND, print the resulting environment") and `man-bash-1`.

Root cause confirmed again: every item's `source_ids` was a verbatim copy of its concept's
`official_sources` + `additional_sources` in `data/topics/01-linux-fundamentals.json`. Fixed at
concept level for all eleven concepts, and per item.

### Four sources registered in `data/sources.json`

`man-cp-1`, `man-ln-1`, `man-ext4-5` and `posix-ls`, all wired into the owning concepts'
`additional_sources` so none is an orphan. The two that settle the most:

- **`man-ln-1`** carries the sentence `file-management-commands.02` needed verbatim: "Symbolic
  links can hold arbitrary text; if later resolved, a relative link is interpreted in relation to
  its parent directory."
- **`posix-ls`** carries the normative `-l` record format — `"%s %u %s %s %u %s %s\n"`, file mode,
  number of links, owner, group, size, date and time, pathname — and the entry-type table where
  `l` is "Symbolic link" and `-` is "Regular file", which is the home for four `reading-ls-l-output`
  items previously pointed at the coreutils manual.

Checked against the existing register first; no duplicate URL was created.

### The self-refuting distractor shape — eleven stripped

The reliable tell in this range was not an n-gram overlap with the option's own `why` but a
**trailing clause that names the reader's error instead of asserting anything** — most often of the
form "since X **is assumed to** Y", and once, in `reading-ls-l-output.04`, an option whose entire
text was its own `why` pasted in, duplicated conjunction included: "Whether `svc` is a member of
any supplementary groups at all, **since since** `svc` is the file's owner, the owner triad governs
the attempt regardless of group membership".

Stripped in: `reading-ls-l-output.02` o4, `reading-ls-l-output.04` o4, `wildcards-and-globbing.01`
o4, `quoting.01` o4 (which ended "the reverse of the actual behaviour"), `command-chaining.01` o4,
`shell-variables-and-export.01` o3, `shell-variables-and-export.02` o2,
`history-and-tab-completion.01` o3, `history-and-tab-completion.03` o4, `aliases.03` o4, plus
`command-chaining.03` o4, whose `why` argued from what "the exam uses to test" rather than from the
grammar rule. Every replacement asserts a concrete false claim of comparable length, with the
correction moved into the `why`; none was merely truncated.

### Shape scans, measured before and after

| | before | after |
| --- | --- | --- |
| em-dash, range (keys / distractors) | 0% / 2% | 0% / 2% |
| em-dash, file (keys / distractors) | 2% / 2% | 2% / 2% |
| key is longest option, range | 0 of 31 (0%) | 2 of 31 (6%) |
| key is longest option, file | 1 of 110 (1%) | 3 of 110 (3%) |
| six-token tails reused 3+ times | none | none |
| options that are nothing but a code span | none | none |

The em-dash gap this file is noted for having closed (keys 2% / distractors 3% at task start,
2% / 2% here) was **not opened in either direction** by the stripping work. Key-is-longest rose by
two items and remains far below the 25% chance baseline, so no length cue was exposed; no key was
shortened at any point.

### `data/` and the guide

One guide correction, of the true-but-misreadable class. `study-guide/01-linux-fundamentals/command-line.md`,
the links section, listed under **`cp -r`**: "Expecting a symlink to be copied as a link — plain
`cp` follows it and copies the target's contents; `cp -a` (or `-d`) preserves the link". Every
clause is true, but placing it in the `cp -r` row teaches that `cp -r` is the trap, when `cp -r` in
fact preserves the link. Now reads: "Expecting every form of `cp` to treat a symlink alike — plain
`cp`, `cp -L` and `cp -p` follow it and copy the target's contents, while `cp -r`, `cp -a`, `cp -d`
and `cp -P` copy the link itself". `npm run generate` re-run and `npm run check-guide` clean.

No concept `description` in `data/` needed correcting; the three most exposed
(`file-management-commands`, `reading-ls-l-output`, `case-sensitivity`) were read against the
primary sources and are accurate.

### Adjudication of prior findings

`qbank-findings.md` still carries no prior findings section for Linux Fundamentals :: Command Line
other than the sibling verification tasks' own, so there was nothing to accept or reject.
`docs/verification/factcheck-command-line.json` was read and **not** treated as a clearance; the
eleven claims covering this range (CL-025 through CL-036) were each re-derived from the primary
sources rather than taken on trust. All eleven hold as written. Note that CL-030's phrasing, "`ls
*.txt` never passes `*.txt` to `ls`", is loose — it is true only when the glob matches, and the
same claim's second half states the unmatched case correctly.

### Residual limits, recorded rather than hidden

- **www.gnu.org was unreachable for the whole task** (curl exit 28 at 20s, 45s and 90s, over both
  the coreutils and bash manual URLs and the site root; `ctx_fetch_and_index` failed on the same
  two URLs in the same minute that man7.org and pubs.opengroup.org returned 200). `gnu-bash-manual`
  and `gnu-coreutils-manual` are therefore unverified rather than disproven, and **no item was
  refuted for this**. Each affected item now cites the same project's manual page instead — bash(1),
  cp(1), ln(1), ls(1), chmod(1), env(1), grep(1) at man7.org, and POSIX at pubs.opengroup.org —
  and each `verification.reasoning` names the substitution. The gnu.org ids were left in place at
  concept level.
- **`case-sensitivity`'s key rests on an inference, and the item says so.** ext4(5) documents
  casefold as an opt-in feature ("for directories with the casefold (+F) flag enabled", available
  since 5.2), which establishes that ordinary ext4 lookup is exact; no fetchable page states "ext4
  is case-sensitive" in those words.
- **One empirical result stands in for a document.** The `cp -r` finding above was settled by
  running GNU coreutils 9.8 rather than by a sentence, because cp(1) states the `-a`/`-d`/`-L`/`-P`
  option meanings but never spells out the default for `-R` alone. The test is reproduced above so
  it can be re-run.

---

## Task 56a — System Administration Fundamentals :: System Administration (items 1–27, agent `verify-sysadmin-a`)

Range: `sysadmin.system-administration.user-account` through `sysadmin.system-administration.umask`
(1-based array indices 1–27 of `questions/02-system-administration/system-administration.json`).
27 items, 27 verdicts, all `confirmed` at end of task. **Two wrong keys** found and rewritten;
**twelve self-refuting distractors** repaired; **ten concepts re-cited**; **nine sources
registered**.

### 1. Wrong key — `symbolic-vs-numeric-chmod.02`: GNU `chmod` does *not* clear setgid on directories

**Confirmed.** The item asserted that `chmod 755` across a directory tree "cleared the setgid bit
on every directory" and that this explained new files no longer inheriting the shared group. That
is false on GNU coreutils, which is what every distribution in scope ships. chmod(1), section
SETUID AND SETGID BITS: *"For directories chmod preserves set-user-ID and set-group-ID bits unless
you explicitly specify otherwise. You can set or clear the bits with symbolic modes like u+s and
g-s. To clear these bits for directories with a numeric mode requires an additional leading zero
like 00755, leading minus like -6000, or leading equals like =755."*

Settled empirically on the exact authored scenario, recursion included:

```
docker run --rm ubuntu:24.04 bash -c '
  mkdir -p /t/tree/sub; touch /t/tree/sub/file
  chmod -R 2775 /t/tree; chmod -R 755 /t/tree
  ls -ld /t/tree /t/tree/sub /t/tree/sub/file'
# drwxr-sr-x  /t/tree          <- setgid SURVIVED
# drwxr-sr-x  /t/tree/sub      <- setgid SURVIVED
# -rwxr-xr-x  /t/tree/sub/file <- setgid cleared (regular file, no exemption)
```

Group inheritance was confirmed still working afterwards, and `chmod 00755` was confirmed to clear
the bit. **The study guide was already correct and the item contradicted it** —
`study-guide/02-system-administration/system-administration.md`, Traps: *"Directories are the
exception worth memorising — `chmod` preserves a directory's set-user-ID and set-group-ID bits
unless told otherwise."* No guide or `data/` change was needed; the item was the defect. It was
rewritten to make the directory exception the thing tested, and re-verified.

Source: <https://man7.org/linux/man-pages/man1/chmod.1.html>.

### 2. Wrong key — `login-shell.02`: a nologin shell blocks `ssh host command` too

**Confirmed.** The item's key asserted "a nologin shell blocks an interactive session, but SSH can
still run a single remote command through it", with a `why` that hedged to "does not intercept in
every configuration". nologin(8) lists `-c, --command command` among the shell options that *"are
ignored to avoid nologin error"*, and states *"The exit status returned by nologin is always 1."*
Since `sshd` runs a non-interactive remote command as `$SHELL -c command`, the command cannot run.

```
docker run --rm ubuntu:24.04 bash -c '/usr/sbin/nologin -c "echo HELLO_RAN"; echo rc=$?'
# This account is currently not available.
# rc=1
docker run --rm ubuntu:24.04 bash -c 'useradd -m -s /usr/sbin/nologin svc; su svc -c "echo HELLO_RAN"'
# This account is currently not available.  (HELLO_RAN never printed)
```

As authored, **no option was correct**. The item was rewritten around the true behaviour, keeping
the genuinely useful distinction it was groping at — the shell field and `authorized_keys` are
managed independently, and key authentication still succeeds before the shell refuses — and
re-verified.

Source: <https://man7.org/linux/man-pages/man8/nologin.8.html>.

### 3. Overbroad `why` on the sibling item, tightened

**Confirmed.** `symbolic-vs-numeric-chmod.01` o2's `why` stated the numeric rule universally
("rewrites all nine permission bits plus clears the special-bit digit"). That is the exact
falsehood that broke item .02. The stem's target is a regular file, where the claim holds — verified
by experiment (`chmod 2755 /t/f` → `-rwxr-sr-x`; `chmod 775 /t/f` → `-rwxrwxr-x`) — so the `why`
was narrowed to regular files rather than the option being changed.

### 4. Citations that did not contain what they were cited for (all fixed at concept level)

Every one of these is an **attribution** failure, not a factual error: the claim was true and the
cited source was silent. Following the Task 3 `hypervisor` precedent, the citation was fixed and no
correct content was weakened.

| Concept | Item turned on | Cited only | Added |
| --- | --- | --- | --- |
| `user-account` | `useradd`/`userdel`/`id` | passwd(5) — a file format | useradd(8), userdel(8), usermod(8), id(1) |
| `group` | `usermod -aG`, `groupadd`, `groupdel` | group(5) | usermod(8), groupadd(8), groupdel(8) |
| `primary-vs-supplementary-group` | `usermod -G` replacing the list | group(5), credentials(7), inode(7) | usermod(8), passwd(5) |
| `etc-group` | `/etc/passwd`'s 7 and `/etc/shadow`'s 9 field counts | group(5) | passwd(5), shadow(5) |
| `etc-shadow` | `chage -d 0`, `usermod -L` | shadow(5) | chage(1), usermod(8) |
| `login-shell` | `passwd -l` semantics | passwd(5), nologin(8) | passwd(1) |
| `password-policy-and-ageing` | `chage -M/-W/-m/-E`, `passwd -e`, `usermod -L` | shadow(5) | chage(1), passwd(1), usermod(8) |
| `read-write-execute-permissions` | execute = *search* on a directory | inode(7), chmod(1) | path_resolution(7) |
| `owner-group-other` | the owner→group→other first-match rule | inode(7), chmod(1) | path_resolution(7) |
| `chown-and-chgrp` | the `OWNER[:[GROUP]]` operand syntax | chown(2) — the *syscall*, which has no colon | chown(1) |

The two permission concepts are the sharpest cases and are exactly hazard 1: **inode(7) tabulates
the mode bits but never says execute means search on a directory, and never states the class-matching
rule.** path_resolution(7) states both: *"the last execute permission in case of ordinary files, or
search permission in case of directories"*, and *"The first group of three is used when the
effective user ID of the calling process equals the owner ID of the file … When neither holds, the
third group is used."* Likewise `chown-and-chgrp.02` turns entirely on chown(1)'s operand grammar:
*"If a colon but no group name follows the user name, that user is made the owner of the files and
the group of the files is changed to that user's login group."*

### 5. Sources registered in `data/sources.json` (9)

`man-useradd-8`, `man-userdel-8`, `man-usermod-8`, `man-groupadd-8`, `man-groupdel-8`,
`man-chage-1`, `man-passwd-1`, `man-chown-1`, `man-id-1` — all man7.org, all fetched and read
(HTTP 200 with the claimed text located in the body, not merely a 200). `man-path-resolution-7` was
already registered and only needed wiring.

### 6. The self-refuting distractor shape — twelve repaired

Twelve distractors in this range carried their own `why` verbatim as a trailing em-dash clause,
announcing their own wrongness: `group.01` o4, `uid-and-gid.01` o4, `etc-passwd.02` o3,
`service-account.02` o4, `password-policy-and-ageing.02` o4,
`read-write-execute-permissions.01` o3, `read-write-execute-permissions.02` o2,
`symbolic-vs-numeric-chmod.01` o3, `chown-and-chgrp.01` o4, `chown-and-chgrp.02` o2, `umask.01` o3,
plus `login-shell.02` o3 which was absorbed into that item's full rewrite.

**Repaired by replacement, not truncation, and the em-dash was kept.** Each appended explanation
was swapped for a genuinely false clause of comparable length. This was deliberate: stripping the
padding outright would have cut distractor em-dashes from 15 to 3 and widened this file's known
key-vs-distractor shape gap rather than leaving it alone (hazard 5).

### 7. Shape scans, measured before and after (this range only)

| Measure | Before | After |
| --- | --- | --- |
| Key ends in an em-dash qualifying clause | 7/27 (26%) | 7/27 (26%) |
| Distractor ends in an em-dash qualifying clause | 15/81 (19%) | 16/81 (20%) |
| Key is the longest option | 0/27 (0%) | 0/27 (0%) |

The gap narrowed from 7 points to 6. Both rewritten items were adjusted after the first scan — the
`login-shell.02` key initially took an em-dash and became the longest option, and both were undone.
Re-run **after** the rewrites, per hazard 5.

### 8. Second-correct-answer sweep

All 81 distractors were checked for being *also* correct, not merely for being labelled wrong. One
genuine case was found, in `login-shell.02`, and it was the inverse of the usual defect: the key was
wrong and **no** option was right. Elsewhere the near-misses were all excluded by a fetched
sentence — `service-account.02` o2 ("service accounts are unprivileged by definition") by
credentials(7) tying privilege to the process's IDs and capabilities rather than the account's
purpose; `chown-and-chgrp.01` o3 ("she may chown to her own account") by chown(2)'s *"Only a
privileged process … may change the owner of a file"*, confirmed by experiment in both directions
(EPERM giving a file away, EPERM taking a root-owned file).

### 9. Empirical verification used where a manual is silent

Nine claims in this range were settled by running them in `ubuntu:24.04`, each with the command and
output recorded in the item's `verification.reasoning`: same-UID accounts resolving to one identity
(`id` as `bea` printing `uid=5000(ann)`, and `bea` reading `ann`'s mode-600 file); the primary group
owning a newly created file; `getent group` omitting a primary member; `d-wx------` denying `ls`
while `cat` by name succeeds; `chage -d 0` and `passwd -e` both writing `0` into shadow field 3;
`/etc/shadow` at `640 root:shadow` on Debian-family; the field counts 7/4/9; `chown alice:` setting
the login group; `umask 022` yielding `644`/`755`; and the two `chmod` results in findings 1 and 3.

### 10. Rejected findings — checked and not changed

- **`etc-shadow.01`'s two-mode claim.** Suspected as too neat. **Rejected**: Fedora's `setup.spec`
  ships `%attr(0000,root,root) … /etc/shadow` (rawhide, line 145), and `stat -c '%a %U:%G'` in
  ubuntu:24.04 returns `640 root:shadow`. Both halves hold as written.
  Sources: <https://src.fedoraproject.org/rpms/setup/raw/rawhide/f/setup.spec>,
  <https://man7.org/linux/man-pages/man5/shadow.5.html>.
- **`login-shell.01` o2, "`passwd -l` still allows key-based login".** Suspected as an
  over-claim. **Rejected**: passwd(1) says it outright — *"Note that this does not disable the
  account. The user may still be able to login using another authentication token (e.g. an SSH
  key)."* Source: <https://man7.org/linux/man-pages/man1/passwd.1.html>.
- **`chown-and-chgrp.01` o4, "an unprivileged user may change a file's group, but only to a group
  they belong to".** **Rejected**: chown(2) states it, and `su alice -c 'chgrp extra /t/afile'`
  where alice is not in `extra` returned *Operation not permitted*, rc=1.

### 11. Residual limits, recorded rather than hidden

- **`service-account.01` has no single sentence behind it.** "Service account" is a practice term,
  not a documented kernel concept. Its key rests on the least-privilege principle plus nologin(8)'s
  stated purpose and credentials(7)'s treatment of privilege. That basis is recorded in the item's
  `reasoning` rather than dressed up as a citation.
- **`etc-group.02`'s key is empirical, not documentary.** group(5) describes `user_list` only as
  *"a list of the usernames that are members of this group"* and never says *supplementary only*.
  passwd(5) supplies the complement — field four *"is the numeric primary group ID for this user.
  (Additional groups for the user are defined in the system group file; see group(5))"* — and the
  `getent` experiment closes it.
- **gnu.org was not reached and nothing was refuted for it.** No item in this range needed it: the
  GNU-tool behaviour at issue (chmod's directory exception, chown's colon operand) is stated in
  man7.org's chmod(1) and chown(1), which document the GNU versions, and both were additionally
  confirmed by running GNU coreutils in a container. The substitution is named in each affected
  item's `reasoning`.

## verify-sysadmin-d — System Administration, items 82–105 (`home` … `lvm`)

Twenty-four items, fourteen concepts, all storage- and hierarchy-shaped. All twenty-four end at
`verdict: "confirmed"`; none was left at `refuted`. Two items were refuted as authored on content,
one on a `why`'s attribution, and seventeen distractors were self-refuting. Every claim below was
settled by a page fetched with `curl` and grepped locally, or by a command actually run.

### Confirmed findings

- **`filesystem-type.01`'s key was factually wrong, and the study guide carried the same error.**
  The key asserted XFS "cannot be shrunk at all" and o2's `why` doubled down with "no shrink
  support at all, online or offline." xfs_growfs(8) contradicts the absolute under `-d`: *"A
  filesystem with only 1 AG cannot be shrunk further, and a filesystem cannot be shrunk to the
  point where it would only have 1 AG. [NOTE: Only shrinking the last AG without removing it is
  implemented]"* — a narrow last-allocation-group shrink exists. Key and `why` rewritten to the
  defensible claim: XFS offers no *general* shrink path. `study-guide/02-system-administration/`
  `system-administration.md` ("Traps", filesystem type) carried the identical absolute and was
  corrected in the same terms. The ext4 half stands verbatim: resize2fs(8) — *"It can be used to
  enlarge or shrink an unmounted file system located on device. If the file system is mounted, it
  can be used to expand the size of the mounted file system."*
  Sources: <https://man7.org/linux/man-pages/man8/xfs_growfs.8.html>,
  <https://man7.org/linux/man-pages/man8/resize2fs.8.html>.

- **`home.01` o3's `why` contradicted the FHS.** It read "Root's home is unshareable, host-specific
  data." FHS chapter 2 says the opposite of home directories generally: *"the files in user home
  directories are shareable whereas device lock files are not."* Rewritten to rest on FHS 4.1,
  which does settle the option — `/usr` is *"shareable, read-only data ... must not be written
  to"*, which rules out any home directory living there. The key itself is confirmed by FHS 3.14
  footnote 16.
  Sources: <https://refspecs.linuxfoundation.org/FHS_3.0/fhs/ch02.html>,
  <https://refspecs.linuxfoundation.org/FHS_3.0/fhs/ch04.html>,
  <https://refspecs.linuxfoundation.org/FHS_3.0/fhs/ch03s14.html>.

- **`dev.01` o2's `why` misattributed the UUID recommendation to the FHS.** The FHS never mentions
  device-name stability or UUIDs; the concept cited `fhs-3-0` alone. fstab(5) does make the
  recommendation, in the first-field description: *"LABEL=<label> or UUID=<uuid> may be given
  instead of a device name. This is the recommended method, as device names are often a coincidence
  of hardware detection order, and can change when other disks are added or removed."* Attribution
  corrected and the concept re-cited. Source: <https://man7.org/linux/man-pages/man5/fstab.5.html>.

- **Seventeen self-refuting distractors, repaired.** Each carried its own `why` appended after an
  em-dash, announcing its own wrongness: `home.01` o2, `usr.01` o4, `tmp.01` o4,
  `proc-and-sys.01` o2, `proc-and-sys.02` o3, `dev.02` o4, `filesystem-type.02` o2, `mounting.02`
  o3, `etc-fstab.02` o4, `partition.02` o3, `hard-link-vs-symbolic-link.01` o2,
  `hard-link-vs-symbolic-link.02` o4, `disk-usage-vs-free-space.01` o3,
  `disk-usage-vs-free-space.02` o3, `swap.01` o3, `swap.02` o4, `lvm.01` o2 — seventeen in total
  across the range. Each was rewritten with a real false clause after the em-dash, so the em-dash
  shape ratio did not move: keys 12/24 (50%) before and after, distractors 19/72 (26%) before and
  after, key-is-longest 2/24 (8%) before and after. `lvm.01` o2 additionally misrendered "LVM" as
  "lVM", a tell that the text was machine-pasted from the `why`.

- **`disk-usage-vs-free-space` cited mount(8) and inode(7) for deleted-but-open files.** The exact
  miss this pass exists to catch, and the same defect previously found on `man-df`. Neither page
  documents it; unlink(2) does: *"If the name was the last link to a file but any processes still
  have the file open, the file will remain in existence until the last file descriptor referring
  to it is closed."* Both items re-cited to unlink(2), du(1) and df(1) at the concept level.
  Source: <https://man7.org/linux/man-pages/man2/unlink.2.html>.

- **`partition` cited mount(8) for MBR-versus-GPT limits, and `lvm` cited mount(8) for LVM.**
  mount(8) says nothing about either. Re-cited to fdisk(8), whose DISK LABELS section gives both
  MBR limits — *"In sector 0 there is room for the description of 4 partitions (called `primary')"*
  and *"an absolute number of sectors (given in 32 bits) ... with 512-byte sectors this will work
  up to 2 TB"* — and to lvm(8), which gives the LVM answer — *"A Volume Group (VG) is a collection
  of one or more physical devices ... Each block of data in an LV is stored on one or more PV in
  the VG."*
  Sources: <https://man7.org/linux/man-pages/man8/fdisk.8.html>,
  <https://man7.org/linux/man-pages/man8/lvm.8.html>.

- **Nine further concept-level citation fixes**, all the same shape — the claim true, the cited
  page silent. `tmp` cited inode(7) (replaced with hier(7)); `dev.02` cited only the FHS for
  `/dev/null` versus `/dev/zero` read behaviour (added null(4)); `proc-and-sys` cited proc(5) for
  `/etc/sysctl.d` persistence, which proc(5) never mentions (added proc_sys(5), sysctl.d(5));
  `mounting` cited mount(8) for the busy-target diagnosis (added umount(8), fuser(1)); `inode`
  cited inode(7) for `df -i` and `ls -i` (added df(1), ls(1));
  `hard-link-vs-symbolic-link` cited inode(7) for deletion and cross-filesystem semantics (added
  unlink(2), symlink(7), link(2), ln(1)); `swap` cited fstab(5) and proc(5) for swap
  interpretation and `mkswap` (added swapon(8), mkswap(8), free(1), vmstat(8),
  proc_pid_oom_score(5)); `filesystem-type` cited mount(8) and fstab(5) for resize capability
  (added resize2fs(8), xfs_growfs(8), ext4(5)); `etc-fstab.02` gained mount(8), where `-a` is
  actually documented. Fifteen new sources registered in `data/sources.json`, every one wired into
  a concept, and validate settles back at the 15-warning baseline.

- **`etc-fstab.02` o2's `why` asserted unsourced systemd behaviour.** It claimed a malformed entry
  leaves "systemd waiting on a device that is never found and dropping into emergency mode." No
  cited page states that. Replaced with fstab(5)'s `nofail` definition — *"do not report errors for
  this device if it does not exist"* — which does establish that a bad entry is otherwise an error
  rather than a silent skip, without over-claiming the failure mode.

- **`mounting.02` o2's `why` claimed the manual flags `umount -l` as a wrong habit.** umount(8)
  does not editorialise that way. Rewritten to what it does say: *"Detach the filesystem from the
  file hierarchy now, and clean up all references to this filesystem as soon as it is not busy
  anymore"*, plus its reboot warning. Source:
  <https://man7.org/linux/man-pages/man8/umount.8.html>.

### Rejected findings

- **Suspected: `partition.01`'s "roughly 2 TiB" is wrong because fdisk(8) says "2 TB".**
  **Rejected.** The ceiling is 2^32 sectors of 512 bytes = 2 TiB exactly; fdisk(8)'s "2 TB" is the
  loose form of the same number, and the item hedges with "roughly". Source:
  <https://man7.org/linux/man-pages/man8/fdisk.8.html>.

- **Suspected: `usr.01` o2's `why` is wrong to call `/usr` read-only "a convention, not a
  filesystem-level restriction".** **Rejected.** FHS 4.1 states `/usr` "must not be written to" as
  a requirement on the hierarchy, not a property enforced by any on-disk format; a writable `/usr`
  mount is perfectly possible and normal. The `why` is accurate. Source:
  <https://refspecs.linuxfoundation.org/FHS_3.0/fhs/ch04.html>.

- **Suspected: `proc-and-sys.02`'s key is unverifiable, since no manual states that `/proc` entries
  report size zero.** **Rejected** — settled empirically instead of documentarily.
  `docker run --rm ubuntu:24.04 sh -c 'ls -l /proc/1/status; cat /proc/1/status | wc -c'` returned
  `-r--r--r-- 1 root root 0 Aug 18 10:59 /proc/1/status` and `1090`. Zero reported size, 1090 bytes
  on read, healthy filesystem. The same run gave `stat -c "%s" /proc/sys/vm/swappiness` = `0` with
  `cat` returning `60`, which corroborates `proc-and-sys.01` as well.

- **Suspected: `mounting.01`'s key overstates what happens to files under a mount point.**
  **Rejected.** mount(8) states it exactly: *"The previous contents (if any) and owner and mode of
  dir become invisible, and as long as this filesystem remains mounted, the pathname dir refers to
  the root of the filesystem on the special device."* Hidden, not merged and not deleted.
  Source: <https://man7.org/linux/man-pages/man8/mount.8.html>.

- **Suspected: `filesystem-type.02`'s claim that vFAT permissions come "entirely from the mount
  options" is an overstatement.** **Rejected.** mount(8)'s fat section sets owner, group and mode
  for *all* files from `uid=`, `gid=`, `umask=`, `dmask=` and `fmask=`, defaulting to the mounting
  process — which is only possible because nothing per-file is stored on disk.
  Source: <https://man7.org/linux/man-pages/man8/mount.8.html>.

### Residual limits, recorded rather than hidden

- **`swap.01`'s key is a synthesis of two pages, not a quotation from one.** No manual states
  "swap in use is not swapping in progress" in those words. The distinction is established by
  putting free(1) — reporting the standing `SwapTotal`/`SwapFree` levels from `/proc/meminfo` —
  beside vmstat(8), which defines *"si: Amount of memory swapped in from disk (/s)"* and *"so:
  Amount of memory swapped to disk (/s)"* as per-second rates. That reasoning is recorded in the
  item rather than dressed up as a single citation.

- **`disk-usage-vs-free-space.02`'s key is an ordering claim.** Each of its three steps is
  individually sourced (df(1) default report, df(1) `-i`, du(1)'s recursive walk), but the claim
  that this is the *correct order* is pedagogical judgement, not a documented rule. Recorded in the
  item's `reasoning`.

- **gnu.org was unreachable and nothing was refuted for it.** The GNU tools in this range — df(1),
  du(1), ls(1) — were verified against man7.org's pages, which document the GNU versions
  explicitly ("This manual page documents the GNU version of df"). The substitution is named in
  each affected item's `reasoning`.

- **`data/sources.json`'s duplicate pair `fhs-3.0`/`fhs-3-0` was left alone** as instructed; items
  in this range use `fhs-3-0` consistently.

---

## Task 56b — System Administration Fundamentals :: System Administration (items 28–54, agent `verify-sysadmin-b`)

27 items verified (`suid.01` … `service.02`). **23 refuted as authored, all 23 repaired and
re-verified; 0 sit at `refuted`.** No wrong key was found in this range. One distractor was found
also-correct. The dominant defect was citation attribution, exactly as the plan predicted for this
competency.

### 1. Also-correct distractor — `foreground-and-background-jobs.02` o4

The only two-defensible-answers case in the range, and it announced itself: o4 said the job "needed
to be run as a daemon rather than backgrounded with a shell operator", and its own `why` conceded
**"Converting it into a properly detached daemon would also work, but the direct and much simpler
fix for this scenario is `nohup`."** A distractor certified correct by its own explanation. Replaced
outright (text, `why`, provenance) with a claim that only PID 1 can hold a process open across a
hangup — false, and conceding nothing.

### 2. Citations that did not contain what they were cited for (all fixed at concept level)

The plan's warning that "a man page for the right tool is not automatically a source for the claim"
held in eleven items:

| Item(s) | Cited | Says nothing about | Substituted |
| --- | --- | --- | --- |
| `suid.01` | inode(7) | the euid change itself — inode(7) lists `S_ISUID 04000 set-user-ID bit (see execve(2))` and stops | execve(2) |
| `suid.02` | inode(7) | scripts | execve(2): "Linux (like most other modern UNIX systems) ignores the set-user-ID and set-group-ID bits on scripts" |
| `sticky-bit.02` | inode(7) | `ls` output formatting, which is the whole item | POSIX.1-2024 ls (`T`/`t` in the third character position) |
| `root-and-least-privilege.01` | credentials(7) | least privilege | Ubuntu RootSudo |
| `root-and-least-privilege.02` | credentials(7) | root bypassing permission checks | path_resolution(7) §"Bypassing permission checks: superuser and capabilities" |
| `sudo-vs-su.01` | sudo(8) | that logging is on by default | sudoers(5) `log_allowed` |
| `sudo-vs-su.02` | sudo(8), su(1) | Ubuntu's locked root account | Ubuntu RootSudo |
| `process.01`, `process.02`, `pid-and-ppid.01/.02`, `zombie…01` | proc(5) | anything — man7.org's proc(5) is now only an index page deferring to the `proc_pid(5)` family | ps(1), top(1), pid_namespaces(7), proc_sys_kernel(5), proc_pid_stat(5) |
| `foreground-and-background-jobs.01` | signal(7) | `bg`/`fg`/`jobs`, which are shell builtins | bash(1) |
| `signals.01` | signal(7) | what `kill` sends by default | kill(1): "If no signal is specified, the TERM signal is sent" |
| `signals.02` | signal(7) | uninterruptible sleep — signal(7) covers dispositions, not process states | proc_pid_stat(5) `D`/`Z` |
| `service.01` | systemd.unit(5) | `Restart=` | **systemd.service(5)** — the precise split the plan flagged |
| `process-priority-and-nice.02` | setpriority(2) | what the nice value influences | sched(7) |

All fixes were made at the **concept level** in `data/topics/02-system-administration.json`, not item
by item, so siblings on the same concepts inherit them.

### 3. Sources registered in `data/sources.json` (8)

`man-pid-namespaces-7`, `man-proc-pid-stat-5`, `man-proc-sys-kernel-5`, `man-daemon-7`,
`man-nohup-1`, `man-sched-7`, `sudo-man-sudoers`, `ubuntu-rootsudo`. Already-registered sources
newly wired to these concepts: `man-execve-2`, `man-path-resolution-7`, `man-umask-2`, `posix-ls`,
`man-ps-1`, `man-top-1`, `man-bash-1`, `man-kill-1`, `systemd-service-5`.

### 4. The self-refuting distractor shape — 23 repaired

23 of the 81 distractors in this range (28%) carried a trailing em-dash clause that was a paste of
the option's own `why`, several with the tell-tale lowercase-mangled first letter (`sUID…`,
`sIGSTOP…`, `pID number assignment…`) that proves a mechanical paste. One (`service.02` o2) left the
fragment "— avoids entirely for a configuration-only change" dangling mid-sentence. Each was
repaired by replacing the refuting clause with a **false** elaboration of the same shape and roughly
the same length; no key was truncated and every `why` was left intact.

### 5. Shape scans, measured after the repairs, not before

| Measure (this range) | Before | After |
| --- | --- | --- |
| Key ends in an em-dash qualifying clause | 12/27 (44%) | 12/27 (44%) |
| Distractor ends in an em-dash qualifying clause | 25/81 (31%) | 26/81 (32%) |
| Key is the longest option | 0/27 (0%) | 0/27 (0%) |
| Self-refuting distractors | 23 | **0** |

The em-dash gap **narrowed by one point** rather than widening, because the repairs kept the em-dash
and replaced only the clause after it. Key-is-longest stayed at zero.

### 6. Empirical verification, where a document was silent or a `why` deserved checking

- `suid.02` — `docker run --rm ubuntu:24.04` … `chmod 4755` a shell script, run it as an
  unprivileged user: `id -u` → `1001`, `id -un` → `t`, while `ls -l` showed `-rwsr-xr-x`. The bit is
  set; the euid is unchanged.
- `sticky-bit.02` — `chmod 1774 /srv/x; ls -ld` → `drwxrwxr-T`; `chmod 1775` → `drwxrwxr-t`.
- `sudo-vs-su.02` — `docker run --rm ubuntu:24.04 passwd -S root` → `root L …`.
- `root-and-least-privilege.02` — o2's `why` claims Red Hat-family systems ship `/etc/shadow` at
  `0000`. `docker run --rm fedora:41 stat -c '%a %n' /etc/shadow` → `0 /etc/shadow`
  (Ubuntu 24.04 → `640`). The `why` is true.
- `suid.01` — `ls -l /usr/bin/passwd` → `-rwsr-xr-x 1 root root`, i.e. SUID root, not SGID shadow,
  which is what kills o3 on the shipped binary.
- `process-priority-and-nice.01` — unprivileged user, own process at nice 10:
  `renice -n 0 -p $PID` → `renice: failed to set priority for 16 (process ID): Permission denied`,
  exit 1. Confirms "by default allows no reduction".

### 7. gnu.org substitution, named

gnu.org was unreachable from this host, so **nothing was refuted for it and nothing was confirmed
from memory.** One item needed it: `sticky-bit.02` turns on the `t`/`T` distinction in `ls -l`
output, documented in the GNU coreutils manual. **POSIX.1-2024 `ls` was substituted** as the
normative source and quoted in the item's `reasoning`, and the behaviour was additionally reproduced
in a container.

### 8. Residual limits, recorded rather than hidden

Each of these is also recorded in the affected item's own `reasoning`; none was allowed to pass as a
quoted fact.

- **`pid-and-ppid.02`** — no man page states baldly "a PID is reusable as soon as its process exits".
  proc_sys_kernel(5)'s `pid_max` ("the value at which PIDs wrap around") plus the absence of any
  reservation mechanism is the closest normative support; the item's `reasoning` records this as
  inference, not quotation.
- **`zombie-and-orphan-processes.01`** — that `kill -9` has no effect on a zombie is not a sentence
  in ps(1), proc_pid_stat(5) or signal(7). It follows from ps(1)'s "Processes marked <defunct> are
  dead processes"; recorded as inference.
- **`sudo-vs-su.01`** — su(1) is silent on logging entirely, so the key's claim that `su -` "only
  logs the single switch" is inference from su(1)'s description of handing over a shell. The
  substantive half (sudo logs each invocation) is quoted from sudoers(5) `log_allowed`.
- **`daemon.02`** — daemon(7) opens "A daemon is a service process that runs in the background",
  using "service" loosely, which sits in mild tension with the item's daemon-vs-service distinction.
  The distinction itself is sourced to systemd.service(5) ("encodes information about a process
  controlled and supervised by systemd"), and o3 remains wrong for the reason its `why` gives.
- **`pid-and-ppid.01`** — pid_namespaces(7) excepts an ancestor holding `PR_SET_CHILD_SUBREAPER`, so
  re-parenting is to the nearest subreaper rather than strictly PID 1 in that case. Does not touch
  the key.
- **`root-and-least-privilege.02`** — path_resolution(7) notes CAP_DAC_OVERRIDE "grants execute
  permission only when at least one of the file's three execute permission bits is set". The stem
  asks only about read and write, so the key stands.
- **`etc-sudoers-and-visudo.02`** — because `visudo -c` already walks included files, the key's
  second clause is belt-and-braces rather than strictly necessary. The item's own rationale already
  says so and the key remains the only defensible option.

### 9. No PCI DSS dependency

No item in this range turns on a PCI DSS requirement number in digits or in paraphrase; the range is
permissions, privilege, processes, signals and systemd throughout.

---

## Task 56c — System Administration Fundamentals :: System Administration (items 55–81, agent `verify-sysadmin-c`)

Range: `questions/02-system-administration/system-administration.json` items at 1-based indices 55–81,
`sysadmin.system-administration.systemd` through `sysadmin.system-administration.var`.
27 items, 108 options, 81 distractors. All 27 now carry `verdict: "confirmed"`; **24 were refuted as
authored** and repaired in place, with the pre-repair history preserved in each item's `reasoning`
behind the literal marker `REFUTED AS AUTHORED.`

### 1. Wrong key — `dnf-yum-and-rpm.02` (item 74): `-p` is *not* required to query an `.rpm` file

The key asserted that "`rpm -q` without `-p` queries the installed package database by name, not the
file on disk — `-p` is needed to query the file itself". The second half is false on current `rpm`.

`rpm(8)` states under OPERATIONS: "`-q, --query`: Query package **files** or installed package(s)",
and under ARGUMENTS lists both `PACKAGE_FILE` ("Either an rpm package or an `rpm-manifest(5)` file")
and `PACKAGE_NAME` ("Installed package named PACKAGE_NAME"). `--nomanifest` exists precisely to switch
the file handling off. Confirmed empirically:

```
$ docker run --rm rockylinux:9 bash -c '...'
installed?        package zsh is not installed          # exit 1
rpm -q  /dl/zsh-5.8-9.el9.aarch64.rpm   ->  zsh-5.8-9.el9.aarch64   exit=0   # no -p
rpm -qp /dl/zsh-5.8-9.el9.aarch64.rpm   ->  zsh-5.8-9.el9.aarch64   exit=0
rpm -ql /dl/zsh-5.8-9.el9.aarch64.rpm   ->  /etc/skel/.zshrc ...     exit=0
```

The real distinction is *name vs file*, not *`-p` vs no `-p`*: a bare name is resolved against the
installed-package database, a path (or a filename in the cwd) is read as a package file. Key and
`rationale` rewritten to say that; `o2`'s `why` rewritten in the same terms. Source: rpm(8).

### 2. Citations that did not contain what they were cited for (all fixed at the concept level)

Every one of these is an attribution failure, not a factual error — the claim was true and the cited
source silent. Per the Task 3 `hypervisor` precedent the citation was fixed rather than the content
weakened. Fixes were applied in `data/topics/02-system-administration.json`, not item by item.

| Concept (items) | Cited | Problem | Now cites |
|---|---|---|---|
| `systemd` (55) | `systemd-1` | systemd(1) never says what `systemctl` is | + `systemd-systemctl-1` |
| `systemd` (56) | `systemd-1` | systemd(1) documents neither `systemd-analyze blame` nor `critical-chain` | + `systemd-analyze-1` |
| `unit-and-unit-file` (57) | `systemd-unit-5` | the `cat` verb is documented in systemctl(1), not systemd.unit(5) | + `systemd-systemctl-1` |
| `systemd-target` (61) | `systemd-special-7` (item had dropped systemctl(1)) | `isolate` semantics are in systemctl(1) | item now cites both |
| `runlevel` (62, 63) | `systemd-special-7` | **the current systemd.special(7) contains ZERO occurrences of the string "runlevel"** | + `systemd-runlevel-8` |
| `systemd-target` (60) | — | nothing cited documented the `runlevel` command in `o4` | + `systemd-runlevel-8` |
| `package` (66) | `debian-dpkg-1`, `man-rpm-8` | half the item is about `npm install`; neither source mentions npm | + `npm-install-locally` |
| `repository` (69) | `debian-apt-8` | apt(8) states neither `/etc/apt/sources.list` nor `sources.list.d/`; it only cross-references sources.list(5) | + `debian-sources-list-5` |
| `dependency` (70) | `debian-apt-8`, `debian-dpkg-1` | neither states that Recommends/Suggests are softer than Depends | + `debian-apt-get-8` |
| `apt-and-dpkg` (71) | `debian-apt-8` | **apt(8) does not document `--fix-broken` at all** — it is the short end-user page | + `debian-apt-get-8` |
| `patch-management` (76, 77) | `debian-apt-8`, `dnf-command-ref` | **neither source mentions patch management as a practice**; the whole concept was unsourced | + `nist-sp-800-40r4` |

The `runlevel` and `patch-management` rows are the two serious ones. For `runlevel` the mapping table
lives in `runlevel(8)`, whose OVERVIEW carries "Table 1. Mapping between runlevels and systemd
targets" (0 → poweroff.target, 1 → rescue.target, 2/3/4 → multi-user.target, 5 → graphical.target,
6 → reboot.target) *and* the sentence that settles item 63 nearly verbatim: "only one runlevel can be
'active' at a given time, while systemd can activate multiple targets concurrently, so the mapping to
runlevels is confusing and only approximate." For `patch-management`, NIST SP 800-40r4 supplies the
definition ("Enterprise patch management is the process of identifying, prioritizing, acquiring,
installing, and verifying the installation of patches, updates, and upgrades throughout an
organization") and the rollback step ("Patch installation can also cause operational issues that may
necessitate uninstalling the patch, reverting to the previous version of the software, or restoring
the software or asset from backups"). The full 28-page PDF was searched, not one section.

### 3. Sources registered in `data/sources.json` (3 new; 1 already present)

- `systemd-runlevel-8` — runlevel(8), https://man7.org/linux/man-pages/man8/runlevel.8.html
- `debian-sources-list-5` — sources.list(5), https://manpages.debian.org/stable/apt/sources.list.5.en.html
- `debian-apt-get-8` — apt-get(8), https://manpages.debian.org/stable/apt/apt-get.8.en.html
- `systemd-analyze-1` was already registered by `verify-sysadmin-e` at the same URL; reused, not duplicated.
- `nist-sp-800-40r4` and `npm-install-locally` already existed; wired into concepts rather than re-registered.
- `fhs-3-0` / `fhs-3.0` duplicate id pair left alone (separate scheduled task); `fhs-3-0` used consistently.

### 4. The self-refuting distractor shape — 23 repaired across 22 items

This range is the epicentre the brief warned about. In 22 of 27 items a distractor's `text` carried
its own `why` verbatim (usually pasted after an em-dash), so the option announced its own wrongness:

`55 o3 · 56 o2 · 57 o3 · 58 o3 · 59 o2 · 61 o2 · 63 o3 · 64 o3 · 65 o4 · 66 o2 · 66 o4 · 67 o3 ·
68 o2 · 69 o3 · 70 o4 · 71 o3 · 73 o4 · 74 o4 · 75 o3 · 76 o4 · 78 o2 · 80 o4 · 81 o4`
(23 distractors across 21 items).

Repaired by replacing the pasted rebuttal with a **real false clause** and extending the `why` to
rebut the new clause — never by truncating. Examples: `61 o2` now claims `rescue.target` sets
`IgnoreOnIsolate=yes` for units outside its group (false: `IgnoreOnIsolate=` is set on the individual
units to be spared, per systemctl(1)); `71 o3` now claims `dpkg` checks dependencies before extracting
(false: it unpacks first, shown empirically); `80 o4` now claims FHS 3.0 relocated system-wide
configuration to `/usr/local/etc` (false: FHS 4.9.2 defines that path as "Host-specific system
configuration for local binaries").

### 5. Shape scans, re-run *after* stripping, not before

| Metric (items 55–81) | Before | After |
|---|---|---|
| Key ends in trailing em-dash clause | 12/27 (44%) | 12/27 (44%) |
| Distractor ends in trailing em-dash clause | 26/81 (32%) | 26/81 (32%) |
| Key is the longest option | 0/27 (0%) | 3/27 (11%) |

Both documented side effects appeared and were handled:

- **Exposed length cue.** Stripping `74 o4`'s pasted `why` (202 → 115 chars) unmasked a key-length
  cue and `q-length-cue` fired (key 172 vs 92-char distractor mean, ratio 1.87 against a 1.6
  threshold). Fixed by trimming the key and extending `o2` and `o3` with real false clauses, not by
  truncating the key. Scoped `check-bank` is now clean for this range.
- **Stripped distractor em-dashes.** The first pass cost two distractor em-dashes (`55 o3`, `67 o3`),
  moving distractors from 32% to 30% and widening the shape gap. Both were re-punctuated so the gap
  is byte-for-byte unchanged from the baseline. Key-is-longest rose from 0% to 11% — still under the
  25% chance line and well under the 40% population threshold; this is the unavoidable cost of
  removing padding from distractors, and per-item length cues are clean.

### 6. Second-correct-answer sweep

Every distractor in the range was read against the primary source for whether it is *also* correct.
None is. The closest calls, and why they fail:

- `73 o2` ("`yum` was removed entirely once `dnf` became the default") — plausible if the DNF command
  reference's "roughly maintains CLI compatibility with YUM" were the only evidence. Settled
  empirically instead (see §7): `yum` is a live symlink.
- `77 o3` (maintenance window) — a maintenance window *is* a genuine component of the practice (NIST
  §3.4 "Assign Each Asset to a Maintenance Group"), so the option is wrong for a true reason, not a
  false one. The stem omits rollback, not the window. Left as authored.
- `75 o4` (`apt full-upgrade`) — true that `full-upgrade` installs; false that only it does. apt(8)
  settles it: "full-upgrade performs the function of upgrade but will remove currently installed
  packages if this is needed".

### 7. Empirical verification, where a document was ambiguous or silent

Docker was used rather than leaving three items on inference. Commands and outputs are recorded in
each item's `reasoning`.

- **Item 73** — `docker run --rm rockylinux:9 bash -c 'ls -l /usr/bin/yum; yum --version'` →
  `lrwxrwxrwx 1 root root 5 Nov 1 2023 /usr/bin/yum -> dnf-3` and `4.14.0 / Installed:
  dnf-0:4.14.0-8.el9.noarch`. `yum` is literally dnf on a current Red Hat-family system.
- **Item 74** — see §1. This is the run that produced the wrong-key finding.
- **Items 71, 72, 67** — `docker run --rm debian:12`, building a `.deb` with
  `Depends: totally-nonexistent-lib (>= 99)`:
  `dpkg -i` → "Unpacking lfcatest (1.0) ... dpkg: dependency problems prevent configuration of
  lfcatest ... dependency problems - leaving unconfigured"; `dpkg -l lfcatest` → status `iU`;
  `dpkg -L lfcatest` → `/., /usr, /usr/bin, /usr/bin/lfcatest`; a later `apt-get install -y bash` →
  "You might want to run 'apt --fix-broken install' to correct these. The following packages have
  unmet dependencies: lfcatest : Depends: totally-nonexistent-lib (>= 99)"; and
  `apt-get --fix-broken install` → "Correcting dependencies... Done". Every clause of item 71's key
  is reproduced, including "blocking further operations".

The two-node lab was not needed: every systemd claim in this range is stated in systemctl(1),
systemd(1), systemd.special(7) or runlevel(8) and did not turn on an undocumented default.

### 8. gnu.org substitution, named

No item in this range cited gnu.org, so no substitution was needed for that host. A different
unreachability did bite: **freedesktop.org returns 404 for `/man/latest/runlevel.html` and
`/man/latest/telinit.html`**. runlevel(8) was therefore read on man7.org, whose COLOPHON names systemd
as the source project — a legitimate substitution for a systemd page, and it is recorded in the
`systemd-runlevel-8` source note and in items 60, 62 and 63.

### 9. Rejected findings — checked and not changed

- **"`systemd-analyze blame`'s key reasons differently from the manual."** The item's `o1` why says a
  slow unit nothing waits on runs in parallel and costs nothing; systemd-analyze(1)'s stated caution is
  the converse (a unit may be slow *because* it waits). Checked and rejected as a defect: both are
  true, both support "not necessarily the cause", and the manual's own `critical-chain` entry ("prints
  a tree of the time-critical chain of units") is what makes the key's remedy correct. Recorded in the
  item rather than acted on.
- **"Item 68 turns on an undocumented error string."** The literal text "no installation candidate" is
  apt runtime output and appears in no manual page fetched. Rejected as a defect: the item's reasoning
  rests on the caching model, which apt(8) does state ("update is used to download package information
  from all configured sources. Other commands operate on this data"). Recorded as a limit in the item.
- **"Item 66 o3 is a straw man."** "the `npm` package did not come from anywhere at all" is a weak
  distractor. Checked and left: it is a false assertion the option makes, not a rebuttal it carries,
  so it is not the self-refuting shape, and its `why` correctly identifies scope rather than
  provenance as the distinguishing factor.
- **Prior `factcheck-sysadmin-core.json` entries** were not treated as assurance. Every claim above was
  re-derived from the primary source or from a container run.

### 10. Residual limits, recorded rather than hidden

- **Item 81** ("a full `/var` is one of the most common causes of exactly this symptom") is an
  operational frequency claim that no specification states. What FHS 5.1 supports is the *mechanism*
  (variable, growing data under `/var`, frequently on its own filesystem: "If /var cannot be made a
  separate partition, it is often preferable to move /var out of the root partition"). Recorded in the
  item's `reasoning` as a judgement, not asserted as sourced.
- **Item 56 `o4`'s why** ("`blame` has no dependency on `daemon-reload`") is supported by the absence
  of any such dependency in systemd-analyze(1) rather than by a positive sentence. Recorded as such.
- **Item 68 `o3`/`o4` whys** are judgements about which error a given fault produces. Consistent with
  apt(8)'s separation of index from status database, but not documented sentence-for-sentence.
- Two `q-verdict-coverage` errors classes remain in the scoped `check-bank` run for this competency
  (`boot-process`, `bios-vs-uefi`, `bootloader-and-grub`, `kernel` — 8 items). **Those are outside
  this range** (indices 47–54) and belong to a sibling agent. Likewise the residual `q-length-cue`
  warning on `journald.02`.

### 11. No PCI DSS dependency

Neither patch-management item, nor any other in this range, turns on a PCI DSS requirement number in
digits or in paraphrase. The patch-management pair rests on NIST SP 800-40r4, which is freely
published, and the specific sentences relied on are quoted in the items' `reasoning`.

---

## Task 56e — System Administration Fundamentals :: System Administration (items 106–128, agent `verify-sysadmin-e`)

Range: `raid-levels.01` … `kernel.02` (23 items, 12 concepts, to the end of the array).
All 23 items now carry `verification.verdict: "confirmed"` under `agent_label: verify-sysadmin-e`,
with `checked` listing `key` plus every distractor ref. **Zero items sit at `refuted`.**

### 1. Confirmed findings — wrong facts in distractor `why` text

**1a. `raid-levels.01` o4 asserted a false minimum device count.** The distractor's `why` read
"RAID 10 needs at least four drives, correctly". That is textbook RAID 1+0, but it is false on
Linux, which is what the bank teaches. Red Hat's RHEL 9 RAID chapter states that the installer
cannot build a RAID 10 device on two disks because "it requires a minimum of three separate
disks", and describes "a 3-drive array configured to store only two copies of each piece of
data, which then allows the overall array size to be 1.5 times the size of the smallest
devices". The option was rewritten to turn purely on capacity — the discriminator the stem
actually asks about — and re-verified.
Source that settles it: <https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_storage_devices/managing-raid_managing-storage-devices>

**1b. `log-rotation.02` o4 overstated `delaycompress`.** The `why` said deferred compression
"does not address the stated problem at all". logrotate(8) introduces `delaycompress` for
precisely the stated problem class: it "can be used when some program cannot be told to close
its logfile and thus might continue writing to the previous log file for some time". The `why`
was rewritten to what is true — `delaycompress` changes only *when* compression happens and
still leaves the daemon writing to the renamed file, so the log keeps growing — which preserves
the item's discrimination without a false lesson.
Source: <https://man7.org/linux/man-pages/man8/logrotate.8.html>

**1c. `bios-vs-uefi.01` o4 implied a raw partition count is a firmware distinction.** MBR already
exceeds four partitions through extended partitions; the genuine firmware-linked limit is MBR's
~2 TiB addressing. `why` rewritten.
Source: <https://wiki.archlinux.org/title/Partitioning>

**No wrong key was found in this range, and no distractor was found to be also correct.**
Every item was checked for a second defensible answer; the closest call was `log-rotation.02`
o4 (above), which is a `why` defect rather than a second correct answer, because `delaycompress`
does not stop the growth the stem requires stopping.

### 2. Citations that did not contain what they were cited for (all fixed at concept level)

Confirming the root cause recorded four times already: every item's `source_ids` is a verbatim
copy of its concept's `additional_sources` in `data/topics/02-system-administration.json`, so
each of these was one wrong entry propagating to two items.

| Concept | Cited (wrong) | Why it fails | Now cited |
| --- | --- | --- | --- |
| `raid-levels` | `man-proc-5` | proc(5) contains nothing about RAID levels, minimum members or capacity | `man-md-4`, `rh-raid-levels` |
| `cron` | `man-crontab-5` only | crontab(5) is the file format; it never covers `crontab -e`'s install path, and never mentions anacron | + `man-crontab-1`, `man-anacron-8` |
| `var-log` | `fhs-3-0` only | FHS locates `/var/log` and says nothing about `tail -f` vs `-F`, which is what the item turns on | + `man-tail-1`, `man-less-1` |
| `log-rotation` | `man-logrotate-8`, `systemd-journald-8` | neither documents that a deleted-but-open file keeps its blocks — the item's whole mechanism | + `man-unlink-2` (same defect class as the earlier df(1) finding) |
| `syslog-and-severity-levels` | `rfc-5424` only | RFC 5424 fixes the 0–7 scale but defines no filter semantics ("level 3 and above") | + `man-journalctl` |
| `journald` | `systemd-journald-8` only | journald(8) does not document `journalctl`'s `-b` offsets or `--list-boots` | + `man-journalctl` |
| `boot-process` | `systemd-1`, `systemd-special-7` | neither states the firmware → bootloader → kernel handover; and systemd(1) does not document `systemd-analyze blame` | + `systemd-bootup-7`, `systemd-analyze-1` |
| `bios-vs-uefi` | `systemd-1`, `fhs-3-0` | neither documents the ESP, GPT limits or Secure Boot | `ms-uefi-gpt-partitions`, `archwiki-partitioning`, `archwiki-secure-boot` |
| `bootloader-and-grub` | `fhs-3-0` only | FHS locates `/boot`; it documents no GRUB tooling and cannot support the `update-grub` vs `grub2-mkconfig` split | `debian-update-grub-8`, `rh-grub-config`, `fhs-3-0` |
| `kernel` | `man-credentials-7`, `man-proc-5` | credentials(7) is about process UIDs/GIDs — the "right subject area, wrong man page" class again | `man-uname-1`, `kernel-readme`, `systemd-bootup-7`, `man-proc-5` |
| `systemd-timer` | `systemd-timer-5`, `systemd-journald-8` | correct as far as they go, but "enabling a service starts it at boot" lives in systemctl(1) | + `systemd-systemctl-1` |

`crontab-syntax` was the one concept whose citation needed no change: crontab(5) contains the
OR-of-day-fields rule *and the item's exact example*, `30 4 1,15 * 5`.

### 3. Sources registered in `data/sources.json` (11 new; 4 reused)

New: `man-md-4`, `rh-raid-levels`, `man-crontab-1`, `man-anacron-8`, `systemd-bootup-7`,
`systemd-analyze-1`, `debian-update-grub-8`, `rh-grub-config`, `archwiki-partitioning`,
`archwiki-secure-boot`, `ms-uefi-gpt-partitions`. Already present and newly wired:
`man-tail-1`, `man-less-1`, `man-unlink-2`, `man-uname-1`, `kernel-readme`, `man-journalctl`,
`systemd-systemctl-1`. All are wired into concepts — `validate` reports the baseline 15 warnings
with no new orphan-source entries.

### 4. The self-refuting distractor shape — 20 repaired

Twenty of this range's 69 distractors (29%) carried their own `why` appended to the option text,
usually behind an em-dash or a "which"/"since" clause, so the option announced its own wrongness:

`raid-levels.02` o2 · `cron.02` o3 · `crontab-syntax.02` o3 · `systemd-timer.02` o3, o4 ·
`var-log.01` o3 · `syslog-and-severity-levels.01` o3 · `syslog-and-severity-levels.02` o2 ·
`journald.01` o4 · `journald.02` o3 · `log-rotation.01` o4 · `log-rotation.02` o2 ·
`boot-process.01` o2, o3 · `boot-process.02` o4 · `bios-vs-uefi.01` o2 ·
`bootloader-and-grub.01` o3 · `bootloader-and-grub.02` o4 · `kernel.01` o4 · `kernel.02` o4

Each was repaired by replacing the appended refutation with a **false** trailing clause that the
primary source contradicts (e.g. `journald.01` o4 now claims journalctl "rejects negative boot
offsets", where journalctl(1) says "Negative values mean earlier boots"). No key was truncated;
every `why` was left stating a true fact.

### 5. Shape scans, re-run *after* stripping — both documented side effects observed

| Measure (this range) | Before | After stripping | After length rebalance |
| --- | --- | --- | --- |
| Key ends in em-dash clause | 35% (8/23) | 35% | 35% |
| Distractor em-dash | 29% (20/69) | 29% | 29% |
| Key is the longest option | 4% (1/23) | **35% (8/23)** | 9% (2/23) |

The key-is-longest flip predicted in the hazard notes reproduced exactly: stripping the padding
exposed a length cue it had been masking. Seven distractors were then lengthened (meaning and
`why` unchanged) to remove it. The em-dash gap was deliberately held at +6pp — unchanged from
where this range started — so the dedicated by-rule pass has no new damage to undo.
`check-bank` scoped to this competency, minus `q-answer-position-balance`: **0 errors,
0 warnings** (the one `q-length-cue` warning my repairs introduced on `journald.02` was fixed
before finishing, not suppressed).

### 6. Empirical verification — one decisive run, one failed attempt honestly recorded

**Settled by measurement** (`docker run --rm debian:12`, cron installed):
- `crontab` refuses to install an invalid table: `"/tmp/bad":1: bad command` /
  `errors in crontab file, can't install.`, exit 1, and `crontab -l` then reports
  "no crontab for root" — while writing the same bytes straight into
  `/var/spool/cron/crontabs/root` succeeded silently. This is `cron.01`'s key, which no man page
  states outright.
- A cron job's environment is exactly `HOME=/root LOGNAME=root PATH=/usr/bin:/bin SHELL=/bin/sh
  PWD=/root`, against an interactive `PATH` of
  `/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin` in the same container. This is
  `crontab-syntax.02`'s key; crontab(5) documents `SHELL`, `HOME` and `LOGNAME` but **never
  mentions `PATH` at all**.

**Attempted and impossible on this host, recorded rather than glossed:** RAID minimums and
capacities could not be measured. `docker run --rm --privileged ubuntu:24.04` with `mdadm` over
loopback devices fails because the Docker Desktop linuxkit kernel 6.12.76 ships no `md_mod`
(`modprobe: FATAL: Module md_mod not found`). Note also that `mdadm` did **not** reject
`--level=5 --raid-devices=2` at validation time, so the "at least three drives" claim rests on
the Red Hat documentation, not on tool enforcement.

### 7. Substitutions named

- **gnu.org unreachable:** the GNU GRUB manual could not be fetched. `bootloader-and-grub` is
  cited instead to Debian's `update-grub(8)` ("a stub for running `grub-mkconfig -o
  /boot/grub/grub.cfg`") and Red Hat's RHEL 9 GRUB chapter (`grub2-mkconfig -o
  /boot/grub2/grub.cfg` after editing `/etc/default/grub`). Both were fetched and read.
- **uefi.org returns HTTP 403 to `curl`** for the specification's HTML chapters
  (`/specs/UEFI/2.10/…`), so the UEFI specification itself was not read. `bios-vs-uefi` is cited
  to Microsoft's UEFI/GPT partition guidance (ESP), ArchWiki Partitioning (GPT vs MBR's 2 TiB
  addressing limit) and ArchWiki Secure Boot ("a security feature found in the UEFI standard",
  with a documented disable procedure). This is a weaker citation than the specification and is
  recorded as such.

### 8. Rejected findings — checked and not changed

- **`less +F` in `var-log.01` o3** — suspected false. Checked less(1): the `F` command's
  "behavior is similar to the `tail -f` command", and only `--follow-name` makes less
  "periodically attempt to reopen the file by name". The `why` is true by default behaviour; it
  was reworded to say so explicitly and cited, not removed.
- **`syslog-and-severity-levels.01` key ("3 and above" = 3,2,1,0)** — suspected of inverting the
  reader's convention. Confirmed correct: RFC 5424 Table 2 (0 Emergency … 7 Debug) and
  journalctl(1) `-p` ("all messages with this log level or a lower (hence more important) log
  level are shown").
- **`raid-levels.02`'s "RAID is not a backup"** — searched md(4), mdadm(8) and the Red Hat RAID
  chapter in full; **the slogan appears in none of them**. Not refuted: the claim is derived from
  documented behaviour (md(4): RAID1 members "contain exactly the same data" and "changes are
  written to all devices in parallel"), and the item's `verification.reasoning` says so rather
  than implying a quotation.
- **`systemd-timer.01` key** — suspected of assuming an `[Install]` section. Left as authored:
  the stem states the administrator enabled the service, so the section exists; systemctl(1)
  supports the rest.

### 9. Residual limits, recorded rather than hidden

- **`journald.02`'s diagnostic ordering is a best-practice judgement, not a documented rule.**
  Every command's semantics is confirmed against journalctl(1), but no source states that
  `systemctl status` must precede unit logs which must precede a severity-wide sweep. The item's
  `verification.reasoning` records this explicitly. It is defensible (narrowest to widest scope)
  and no distractor is also correct, so it is `confirmed` — but a reader should know the ordering
  is pedagogy, not specification.
- **RAID minimum device counts rest on vendor documentation only** (see §6).
- **`bios-vs-uefi` rests on vendor/community sources, not the UEFI specification** (see §7).
- `PROGRESS.md` was deliberately **not** edited: four agents were writing this competency
  concurrently and the file is large and hand-maintained. Every correction above is recorded here
  and in each item's `verification.reasoning`.

### 10. No PCI DSS dependency

No item in this range turns on a PCI DSS requirement, in digits or paraphrased. The single
regex hit for "requirement" is `raid-levels.01` o2's `why` referring to the stem's own stated
requirement.
