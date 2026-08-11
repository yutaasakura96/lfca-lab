# Study guide style guide

Normative for every competency file under `study-guide/`. `npm run check-guide` enforces
the markup rules in this document mechanically; the voice and content rules are enforced by
review. Where this document and a writing brief disagree, the brief wins — it is generated
from `data/` and this document is not.

The reader is a candidate who has already sat the LFCA and scored close to the 75% pass
mark. They are not a beginner. Do not pad, do not motivate, do not congratulate. Every
sentence should carry information they could be tested on.

---

## 1. Marker grammar

The guide is machine-parsed. Five constructs are recognised as markers; everything else is
prose. Get the punctuation exactly right — the parser matches these patterns literally,
whitespace and middle dots (`·`) included.

**Every example below is inside a fenced code block on purpose.** The parser skips fenced
lines entirely (`tools/lib/guide-parse.mjs`, `computeFenceLines`), specifically so that this
document can show the grammar without any example registering as a real definition,
comparison, or pointer. Never write a bare anchor tag, a bare `*id: ...*` metadata line, a
bare `*compares: ...*` line, or a bare "Not to be confused with" pointer sentence in this
file outside a fence — if a bare one leaks out, the parser will read it as real content
belonging to this style guide, and `guide-missing-concept` or `guide-duplicate-definition`
will fail loudly on the next `check-guide` run.

### Concept anchor and metadata line

Every depth-2+ concept gets exactly one anchor, immediately followed by an ATX heading,
immediately followed by a metadata line in this exact form:

```markdown
<a id="c-<concept-id>"></a>
### <Term>
*id: `<concept-id>` · depth <N> · importance <N> · LFS200: <STATUS> · sources: <id>, <id>*
```

- `<concept-id>` is the dataset id, verbatim, in backticks.
- `<N>` for depth and importance are single digits, taken from `data/` — never invented,
  never rounded.
- `<STATUS>` is one of `FULLY COVERED`, `PARTIALLY COVERED`, `MENTIONED ONLY`, `NOT COVERED`,
  exactly as `data/` gives it.
- `sources:` lists source ids from `data/sources.json`, comma-separated, or the literal word
  `none`.
- The middle dot between fields is `·` (U+00B7), not a hyphen or a colon.

A concept's block runs from its anchor to the next anchor, or to the next heading of level 4
or shallower (a `#### Quick reference` heading ends the last concept's block in a section, so
write Quick reference, Scenario, and Knowledge check after every concept in the section, not
folded into the last one).

### Section anchor

```markdown
<a id="s-<slug>-<section-slug>"></a>
## <path[2] section name>
```

### Comparison block anchor and compares line

```markdown
<a id="cmp-<owner-id>"></a>
#### Not to be confused with: <A> vs <B>
*compares: `<owner-id>`, `<member-id>`*
```

`compares:` lists every id in the block — owner first, then each member — in the exact
order the writing brief gives, backtick-quoted, comma-separated. A block with three members
lists three ids on one line, not three separate lines.

### Cross-reference pointer

A concept that is a *member* (not the owner) of a comparison block written elsewhere in this
file, or in a different competency file, carries one sentence inside its own block, and the
sentence must be the entire line:

```markdown
*Not to be confused with [<Owner term>](<relative-path-or-empty>#cmp-<owner-id>).*
```

Same-file pointers use an empty path before the `#` (e.g. `#cmp-...`); cross-file pointers
use the relative path the writing brief gives verbatim (e.g.
`linux-operating-system.md#cmp-...`). Copy the brief's line exactly — do not recompute the
path.

**This form is only recognised inside a `### ` topic block.** A depth-1 concept has no topic
block — its only definition site is one Quick reference row — so a depth-1 member of a
comparison block cannot write the standalone sentence above. See "Quick reference row pointer"
below for the depth-1 form.

### Quick reference glossary row

A depth-1 concept's only definition site is one row of the Quick reference table, first cell
a backticked concept id:

```markdown
#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `<depth-1-concept-id>` | <Term> | <one sentence> | <the exam trap or discrimination point> |
```

The Quick reference heading must read exactly `Quick reference` at heading level 4 — a
different capitalisation or level is reported as malformed, not silently accepted.

### Quick reference row pointer

A depth-1 concept that is a *member* (not the owner) of a comparison block cannot write the
standalone "Cross-reference pointer" sentence above — a Quick reference row is one table row,
with no enclosing block for a separate sentence to live in. Instead, put a markdown link to
the same `path#cmp-owner-id` the brief gives inside the row's own **"Why it is examinable"**
cell — its natural home, since that is exactly where the row already explains what the
concept is confused with:

```markdown
#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `linux.linux-operating-system.firmware` | Firmware | Low-level software embedded in a device. | Confused with a kernel driver — firmware runs on the device itself, the driver runs in the kernel. [Not to be confused with device drivers and kernel modules](linux-operating-system.md#cmp-linux.linux-operating-system.device-drivers-and-kernel-modules). |
```

`check-guide` requires the link's href to be the exact `path#cmp-owner-id` the brief gives —
the same value a topic-defined member's standalone sentence would use. A link to the wrong
file, the wrong anchor, or no link at all still fails `guide-comparison-pointer`; only "any
link is present somewhere in the row" is not enough. Keep the row's other three cells exactly
as they would be without the pointer — the link is additional content inside the fourth cell,
not a replacement for the explanation already there. (This example is safe to leave in this
document: it sits inside a fenced code block, and the parser skips fenced lines entirely — see
the note at the top of this section — so it registers as neither a real definition nor a real
pointer.)

---

## 2. Definition sites, by depth

**Rule: every concept gets exactly one definition site.** Depth 1 is a Quick reference row.
Depth 2 and above is a `### ` topic block. Never both, never neither.

| Depth | Definition site | Required body labels | Word target |
| ---: | --- | --- | ---: |
| 1 | Quick reference row | (the four table columns) | ~40 |
| 2 | `### ` topic | What it is · Why it matters · How it works · Key terms | ~200 |
| 3 | `### ` topic | + Traps · What the exam may test | ~450 |
| 4 | `### ` topic | + Symptoms and diagnostic order | ~650 |
| 5 | `### ` topic | + Syntax worth memorising | ~800 |

Body labels are bold text starting a line, exactly as written above (`**What it is**`, not
`**What It Is**` or `**What it is:**`). Depth 3+ additionally gets a Commands table whenever
the concept's `commands` array in `data/` is non-empty (some depth-3 concepts have no
commands and skip the table; a concept at any depth never gets a Commands table if its
`commands` array is empty).

These word counts are targets, not limits. A depth-3 concept that needs 500 words to state
its trap correctly should take them; a depth-2 concept that says everything in 150 should
stop at 150. Clarity wins over the number.

---

## 3. Teach the distinction, not the definition

A topic that only defines its term has failed. The exam is multiple choice: it tests
discrimination between plausible options, not recall of a definition sitting alone. Every
topic must leave the reader able to say what the concept is *not* — usually against the
specific thing `data/`'s `notes` field names as the trap.

The `notes` field on a concept frequently names the exam trap outright. Treat it as a primary
input to **Traps** and **What the exam may test**, not as background colour to paraphrase
once and discard.

**Bad opening** (defines only):

> The kernel is the core of the operating system. It manages the CPU, memory, and devices,
> and provides services to programs running above it.

This is correct and useless. A candidate who has read it still cannot answer "which of these
is the kernel, as opposed to the OS or the distribution" — the three most commonly confused
terms in this exact competency — because the passage never says what makes them different.

**Good opening** (teaches the distinction):

> The kernel is the OS's core, not the OS itself: the operating system is the kernel plus
> the userspace services and interfaces built on it, and a Linux distribution is a kernel
> packaged with a full userland (GNU tools, a package manager, defaults) into something a
> person can actually install and run. "Linux" unqualified usually names the kernel alone;
> "install Linux" in practice means installing a distribution. A question that names one of
> the three and asks which layer it is, is testing exactly this stack, not the kernel's
> internals.

Same information content, same length class — the difference is that the second version
states the boundary against the two things it is routinely confused with, which is what a
comparison question actually asks for.

---

## 4. Comparison tables

Every owned comparison block gets a table with **one axis per row** — never one column per
concept with prose paragraphs underneath. A row is a single dimension (where it runs, who
owns it, what triggers it) with one cell per compared concept.

```markdown
| | Shell | Terminal |
| --- | --- | --- |
| What it is | The command interpreter | The interface displaying it |
| Runs where | As a process the terminal starts | As the window/pane hosting the shell |
| Swappable independently | Yes — bash, zsh, fish | Yes — GNOME Terminal, iTerm2, a raw console |
```

After the table, one sentence names the single axis that actually separates the two (or
three) terms — not a summary of the whole table, the one dimension a candidate should hold
onto if they remember nothing else:

> The terminal displays; the shell interprets. Everything else in the table follows from
> that one line.

A comparison block with three members (owner plus two) still follows this shape: one row per
axis, one column per concept, three columns wide.

---

## 5. Commands tables

```markdown
**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `uname` | Print system information | `-r` release, `-m` hardware name | `uname -r` | Confusing `-m` (machine hardware name) with `-p` (processor, often "unknown") |
```

**Every string in the concept's `commands` array in `data/` must appear, verbatim and
unmodified, as its own inline code span or fenced line somewhere in that concept's block.**
`check-guide` requires an exact match — a command shown only as part of a longer command
(`uname -r` does not satisfy a required `uname`) or only in prose (not inside backticks or a
fence) does not count. A fenced line satisfies the requirement after stripping a leading `$ `
prompt, so a fenced walkthrough may show `$ uname -r` and still credit `uname -r`.

Never invent an option, flag, or example that is not true of the real command. A later task
fact-checks every command adversarially against the man page or official documentation.

**Placement: the Commands table goes immediately after Key terms and before Traps.** This is
the order every body label in section 2's table already implies, but it is stated here
explicitly because the table's position was previously left for a writer to infer from the
pilot file alone.

---

## 6. Scenarios

`#### Scenario` is one short worked narrative per section — a candidate walking through a
concrete situation that touches the section's concepts in combination, not a restatement of
any one topic's definition. Target 80-150 words, one paragraph. It does not need to exercise
every concept the section defines; it needs to exercise enough of them, in combination, that
the reader has to apply discrimination rather than recall a single fact. A scenario that only
ever tests one concept at a time belongs in that concept's Traps or What the exam may test,
not here.

Worked example, at the shape and length a real one should be:

```markdown
#### Scenario

A candidate SSHes into a server, types `ls`, and gets a directory listing. Trace it layer by
layer: the terminal accepts the keystrokes and hands the line to the shell; the shell resolves
`ls` against PATH and forks a child process; that process issues system calls, crossing from
user space into kernel space each time; the kernel performs the actual read and returns
control; the shell prints the result back through the terminal.
```

---

## 7. Knowledge checks

**Never multiple choice.** A later cycle owns the multiple-choice question bank; this cycle's
knowledge checks are recall and discrimination prompts with their answers written directly
underneath, inside the same file.

**3 to 6 prompts per section**, each a recall or discrimination question with its answer
written directly beneath it. Fewer than 3 under-tests a section with multiple definition
sites; more than 6 stops being a check and starts being a second pass through the material.

```markdown
#### Knowledge check

1. What is the one-sentence difference between the kernel and the operating system?
   The kernel is the OS's privileged core; the OS is the kernel plus the userspace services
   built on it.
2. A candidate says "I installed Linux on the server." What did they actually install, and
   why is that phrase imprecise?
   A distribution — a kernel packaged with a userland. "Linux" unqualified names the kernel,
   not the whole installable system.
```

Every section that contains at least one definition site (a topic or a Quick reference row)
needs its own `#### Scenario` and `#### Knowledge check` — apparatus is per section, not
once per file.

---

## 8. Waived concepts

A concept named in `data/sourcing-waivers.json` carries, inside its block, this sentence
verbatim — `check-guide` checks for the opening and closing clause literally:

```markdown
*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*
```

Do not shorten, paraphrase, or split this sentence. Every claim inside a waived concept's
block is hedged accordingly — "typically," "in most implementations of this practice," never
stated as settled fact.

---

## 9. Formatting

- No emojis, anywhere, in any file this style guide governs.
- No question count anywhere, ever — the Linux Foundation does not publish one.
- No LFS200 course prose reproduced verbatim; cite `research/lfs200-notes/00-course-map.md`
  and state that a lesson covers a topic, nothing closer than that.
- Orientation paragraphs (the one-paragraph opener under the `# <Competency>` title) state:
  what the competency is, its domain's exam weight, whether the competency is new in the
  2025 update, and its LFS200 coverage position — four facts, not a sales pitch for the
  material that follows.
- **The weight, 2025 status, and LFS200 coverage figures in that paragraph must be copied
  verbatim from `npm run guide-plan`'s header output, never computed by hand.** The pilot
  file got this wrong twice by eyeballing it: it called Linux Fundamentals "the exam's
  smallest domain" when it is the fourth-smallest (System Administration and Cloud Computing
  are larger, and IT Project Management is the true smallest at 10%), and it
  claimed LFS200 "covers roughly half" of the Linux Operating System competency when the
  actual figure — 4 of 27 concepts FULLY or PARTIALLY covered — is 15%. `guide-plan` now
  prints the domain weight and its rank, the competency's 2025 status, and the LFS200
  coverage breakdown in its header specifically so this arithmetic is never redone by eye.
