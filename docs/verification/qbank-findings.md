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
