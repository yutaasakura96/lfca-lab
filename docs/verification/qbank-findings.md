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
