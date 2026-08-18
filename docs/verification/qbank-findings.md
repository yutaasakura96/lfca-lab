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
