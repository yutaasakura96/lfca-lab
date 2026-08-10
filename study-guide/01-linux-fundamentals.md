# Linux Fundamentals

Domain weight: 16% of the exam — 3rd largest of 6 domains, under the blueprint that took
effect 2025-09-16. `data/competencies.json` records the domain's previous weight as 20%. The
domain holds two competencies: Linux Operating System (27 concepts) and Command Line (39
concepts). `guide-plan` reports 0 sourcing-waived concepts in either, so every claim in both
files rests on a citable primary source rather than on consensus practice.

## What the weight change means for study effort

The domain lost four percentage points, from 20% to 16%, and it did not lose them to nothing:
System Administration Fundamentals went from 20% to 30% over the same revision. Marginal study
time taken away from this domain belongs there, not spread evenly.

Two qualifications keep that from becoming "study Linux Fundamentals less."

First, the arithmetic of your own result. A 71% score against a 75% pass mark is a four-point
gap across the whole exam — a quarter of this domain's total weight. This domain alone can
therefore carry the gap: 71% means 29 points dropped somewhere on the blueprint, and had they
fallen evenly, about 4.6 of them would sit inside these 16% — enough to clear the deficit by
converting this domain and nothing else. What a single overall score cannot tell you is whether
your losses are in fact here. That is the argument for converting the concepts you currently
half-know in this domain outright, rather than triaging them away on the weight change alone.

Second, the exam is multiple choice with no practical component. Command Line's 39 concepts are
therefore tested as discrimination between plausible command, option, and behaviour statements,
not by making you type anything. Recognising that `2>` and `|` do different things to different
streams earns the mark; muscle memory does not. The same applies to the vocabulary that Linux
Operating System establishes — kernel, distribution, shell, terminal — which appears in question
stems throughout the other five domains, so imprecision there costs marks outside this domain's
16%.

## The 2025 update

| Competency | 2025 status | Previous name |
| --- | --- | --- |
| Linux Operating System | unchanged | Linux Operating System |
| Command Line | added | none |

Command Line is new in the 2025 update, which carries one hard consequence: **no pre-2025
material covers it.** Any practice bank, course, or set of notes built against the previous
syllabus was never written to this competency's scope, and a gap in it will not be visible from
the outside — pre-2025 material does not announce what it is missing.

`data/competencies.json` records what the domain gave up in exchange. Three command-oriented
competencies — File Management Commands, System Commands, and General Networking Commands —
were removed, and the dataset's note states they were collapsed into the single competency
Command Line. That is where its content came from, and it is why old material is not simply
absent but scattered: the subject matter now sits under one heading with one scope, and
whatever pre-2025 notes you have are organised under three retired headings with three
different ones. Reconstructing Command Line by stapling those three together is not equivalent
to studying the competency as it is now defined.

Linux Operating System is marked `unchanged`, with the same name before and after. Pre-2025
material on it remains valid.

## LFS200 coverage position

Figures below are `guide-plan`'s header output and the per-competency table in
`research/lfs200-notes/00-course-map.md`. That table's percentages are a **lower bound** —
a concept can be taught without its name appearing — and the coverage counts record which
concepts the course touches at all, not how deeply.

| Competency | `guide-plan` LFS200 breakdown | Course-map row | Lessons |
| --- | --- | --- | ---: |
| Linux Operating System | 2 FULLY COVERED, 23 NOT COVERED, 2 PARTIALLY COVERED — 4/27 (15%) are not NOT COVERED | 15%, 4/27 | 4 |
| Command Line | 3 MENTIONED ONLY, 36 NOT COVERED — 3/39 (8%) are not NOT COVERED | 8%, 3/39, marked new 2025 | 3 |

Position, stated exactly. In the course map's 22-row per-competency table, ordered by coverage,
Linux Operating System is the sixth row at 15% and Command Line is the tenth at 8%, sharing that
figure with Security :: Security. Neither competency appears in the course map's Finding 2 list
of six competencies with no lesson at all, and neither is the one-character `Backup` lesson
case: both have real lessons, four and three respectively.

Two details are worth holding onto. The course's single largest lesson, ch6.l2 Linux Commands
at 24,959 characters, is command material — and Command Line still measures 8%, because the
figure counts concepts touched rather than text volume. And per Finding 1, the course is still
structured on the pre-September-2025 syllabus, so its chapter and lesson names map onto retired
competency names; it was never reorganised around Command Line as a competency.

## Section map

Every section heading in both competency files, with its anchor.

### [Linux Operating System](01-linux-fundamentals/linux-operating-system.md) — 27 concepts

| Section | Concepts |
| --- | ---: |
| [Fundamentals](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-fundamentals) | 8 |
| [Distributions](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-distributions) | 3 |
| [History and licensing](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-history-and-licensing) | 4 |
| [Hardware](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-hardware) | 6 |
| [Interfaces](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-interfaces) | 3 |
| [Environment](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-environment) | 3 |

### [Command Line](01-linux-fundamentals/command-line.md) — 39 concepts

| Section | Concepts |
| --- | ---: |
| [Basics](01-linux-fundamentals/command-line.md#s-command-line-basics) | 2 |
| [Navigation](01-linux-fundamentals/command-line.md#s-command-line-navigation) | 4 |
| [File operations](01-linux-fundamentals/command-line.md#s-command-line-file-operations) | 7 |
| [Shell features](01-linux-fundamentals/command-line.md#s-command-line-shell-features) | 8 |
| [Redirection](01-linux-fundamentals/command-line.md#s-command-line-redirection) | 3 |
| [Text processing](01-linux-fundamentals/command-line.md#s-command-line-text-processing) | 6 |
| [Editors](01-linux-fundamentals/command-line.md#s-command-line-editors) | 1 |
| [Archiving](01-linux-fundamentals/command-line.md#s-command-line-archiving) | 2 |
| [Scripting](01-linux-fundamentals/command-line.md#s-command-line-scripting) | 2 |
| [System commands](01-linux-fundamentals/command-line.md#s-command-line-system-commands) | 2 |
| [Networking commands](01-linux-fundamentals/command-line.md#s-command-line-networking-commands) | 2 |

## Recommended study order

Order by dependency first, then by 2025 risk, then by what can be left to a recall pass.

1. **Linux Operating System —
   [Fundamentals](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-fundamentals),
   then [Environment](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-environment).**
   These two sections carry the vocabulary the whole of Command Line assumes. Its
   [Shell features](01-linux-fundamentals/command-line.md#s-command-line-shell-features) and
   [Redirection](01-linux-fundamentals/command-line.md#s-command-line-redirection) sections are
   unreadable at the level of precision the exam wants unless the shell/terminal split and the
   PATH and environment-variable material are already settled. Reading them in file order
   instead defers Environment to last, which inverts the dependency.
2. **All of [Command Line](01-linux-fundamentals/command-line.md), in file order,
   Basics through Networking commands.** It is the larger competency (39 concepts against 27),
   it is the added one, and it is the one where existing material is least likely to help — 8%
   LFS200 coverage, and three retired competencies folded into a single new scope. File order
   works here because the file's own sections build: Navigation before File operations, Shell
   features and Redirection before Text processing, everything before Scripting.
3. **The four remaining Linux Operating System sections —
   [Distributions](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-distributions),
   [History and licensing](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-history-and-licensing),
   [Hardware](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-hardware),
   [Interfaces](01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-interfaces).**
   Nothing in Command Line depends on them and they do not depend on each other, so they are
   safe to defer. They are also the domain's most recall-heavy material, which rewards a late
   pass more than an early one.
4. **The comparison blocks below, as one pass over both files.** Do this after the sections and
   not interleaved with them: the point of a comparison block is discrimination between terms
   you already hold, and running them together surfaces the pairs you cannot yet separate under
   time pressure.

## Comparison blocks

Twelve blocks are owned in this domain — eight in Linux Operating System, four in Command Line.
Three of them compare three concepts rather than two.

### Owned in Linux Operating System

| Block | Members beyond the owner |
| --- | ---: |
| [Kernel vs Operating system vs Linux distribution](01-linux-fundamentals/linux-operating-system.md#cmp-linux.linux-operating-system.kernel) | 2 |
| [The kernel-space/user-space boundary vs the Kernel](01-linux-fundamentals/linux-operating-system.md#cmp-linux.linux-operating-system.kernel-space-vs-user-space) | 1 |
| [Shell vs Terminal](01-linux-fundamentals/linux-operating-system.md#cmp-linux.linux-operating-system.shell) | 1 |
| [Distribution families vs Linux distribution](01-linux-fundamentals/linux-operating-system.md#cmp-linux.linux-operating-system.distribution-families) | 1 |
| [GNU and the Linux kernel vs Kernel](01-linux-fundamentals/linux-operating-system.md#cmp-linux.linux-operating-system.gnu-and-the-linux-kernel) | 1 |
| [RAM vs Storage devices](01-linux-fundamentals/linux-operating-system.md#cmp-linux.linux-operating-system.ram) | 1 |
| [Device drivers and kernel modules vs Firmware](01-linux-fundamentals/linux-operating-system.md#cmp-linux.linux-operating-system.device-drivers-and-kernel-modules) | 1 |
| [GUI vs CLI vs the Shell](01-linux-fundamentals/linux-operating-system.md#cmp-linux.linux-operating-system.gui-vs-cli) | 1 |

Four of these eight put the kernel or a kernel-adjacent term on one side. Work them as a group.

### Owned in Command Line

| Block | Members beyond the owner |
| --- | ---: |
| [Root directory vs /root vs home, . .. and ~, and /home](01-linux-fundamentals/command-line.md#cmp-linux.command-line.root-directory-vs-root-vs-home) | 2 |
| [Finding files vs grep](01-linux-fundamentals/command-line.md#cmp-linux.command-line.finding-files) | 1 |
| [Pipes vs Redirection vs Standard streams](01-linux-fundamentals/command-line.md#cmp-linux.command-line.pipes) | 2 |
| [awk vs sed](01-linux-fundamentals/command-line.md#cmp-linux.command-line.awk) | 1 |

The root-directory block reaches outside the domain: one of its two members is defined in
System Administration, in
[System Administration](02-system-administration/system-administration.md). Read the block with
that file's treatment of the member in view, not from memory.

### Blocks this domain points out to

Three concepts here are members of blocks owned in System Administration. They are the domain's
only outbound cross-domain comparisons, and each is a place where a Linux Fundamentals concept
is routinely answered with a System Administration one:

- from Command Line's reading of `ls -l` output, to
  [symbolic vs numeric chmod](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.symbolic-vs-numeric-chmod);
- from archiving and compression, to
  [backup](02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.backup);
- from port ranges, to
  [well-known ports](02-system-administration/networking.md#cmp-sysadmin.networking.well-known-ports).
