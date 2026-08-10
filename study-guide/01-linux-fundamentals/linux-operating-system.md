# Linux Operating System

Linux Operating System anchors the Linux Fundamentals domain, the exam's smallest domain at
16% of the current (2025-09-16) blueprint, and this competency was unchanged by the 2025
update. LFS200 covers roughly half of it directly — the kernel, the operating-system layer,
and the kernel/user space boundary are taught explicitly in the course — while distribution
families, hardware identification, interface history, and environment mechanics are not
covered there and are sourced independently below (`research/lfs200-notes/00-course-map.md`).
Nothing here assumes a beginner: every topic is written to the point where the reader can
name the trap, not just the term.

<a id="s-linux-operating-system-fundamentals"></a>
## Fundamentals

<a id="c-linux.linux-operating-system.operating-system"></a>
### Operating system
*id: `linux.linux-operating-system.operating-system` · depth 3 · importance 2 · LFS200: FULLY COVERED · sources: kernel-readme, man-syscalls-2*

**What it is** The full software layer sitting between hardware and applications: the kernel
plus the userspace services, libraries, and interfaces built on top of it, letting programs
run without addressing devices directly.

**Why it matters** Every "how does X work" scenario on this exam assumes an OS-mediated
model — permissions, scheduling, and device access all pass through this layer. A candidate
who treats "the OS" and "the kernel" as interchangeable will misread any question that hinges
on which one a described task actually acts on.

**How it works** Applications never touch hardware directly. They call OS-provided
interfaces — system calls into the kernel, or libraries and services built above it — which
translate the request into the low-level operations only the kernel is privileged to
perform. That indirection is the entire point: a text editor does not need to know which
disk controller is installed.

**Key terms** kernel; userspace; system call; hardware abstraction.

**Traps** Exam options often present "the kernel" and "the operating system" as if either
could answer a question about "what manages the CPU." Both are literally true, but the OS is
the broader term — the kernel is its most privileged component, not a synonym for it.

**What the exam may test** Whether a described responsibility (scheduling, device
management, permission enforcement) should be assigned to "the OS" as the general layer, or
to the specific kernel component that actually performs it.

*Not to be confused with [kernel](linux-operating-system.md#cmp-linux.linux-operating-system.kernel).*

<a id="c-linux.linux-operating-system.kernel"></a>
### Kernel
*id: `linux.linux-operating-system.kernel` · depth 3 · importance 2 · LFS200: FULLY COVERED · sources: kernel-readme, man-syscalls-2, man-uname-1*

**What it is** The privileged core of the operating system. It schedules the CPU across
processes, manages memory, drives devices through drivers, and enforces the permission model
that stops one program corrupting another. Everything running above it — shells, daemons,
desktop environments, applications — is userspace.

**Why it matters** The kernel is the one component every other concept in this competency
ultimately routes through: scheduling, memory pressure, device access, and permission
enforcement are all kernel responsibilities, so "what actually does X" questions usually
resolve to the kernel even when the wording says "Linux" or "the OS."

**How it works** Userspace programs request kernel services through system calls — a
controlled entry point, not direct execution in kernel context. The kernel validates the
request, performs the privileged work, and returns control. This request/response boundary
is exactly what kernel space and user space name.

**Key terms** scheduler; system call; driver; userspace.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `uname` | Print system information, including the kernel release | `-r` kernel release | `uname -r` | Assuming `uname -r` reports the distribution version — it reports only the kernel's own version string |

**Traps** "Which version of Linux are you running" is ambiguous between kernel version
(`uname -r`) and distribution version (`cat /etc/os-release`); the exam can present both as
plausible answers to the same scenario. The kernel is also not the same thing as "the
userland," even though the two are commonly bundled together — see GNU below.

**What the exam may test** Given a described symptom (a driver-level failure, a scheduling
behaviour, a permission boundary), identify it as a kernel responsibility rather than a
userspace one, and pick the command that reports kernel version specifically rather than
distribution version.

*Not to be confused with [GNU and the Linux kernel](linux-operating-system.md#cmp-linux.linux-operating-system.gnu-and-the-linux-kernel).*
*Not to be confused with [kernel space vs user space](linux-operating-system.md#cmp-linux.linux-operating-system.kernel-space-vs-user-space).*

<a id="cmp-linux.linux-operating-system.kernel"></a>
#### Not to be confused with: Kernel vs Operating system vs Linux distribution
*compares: `linux.linux-operating-system.kernel`, `linux.linux-operating-system.linux-distribution`, `linux.linux-operating-system.operating-system`*

| | Kernel | Operating system | Linux distribution |
| --- | --- | --- | --- |
| What it is | The privileged core program | Kernel plus the userspace services built on it | Kernel plus GNU tools, a package manager, and defaults |
| Runs the CPU scheduler | Yes, directly | Yes, via the kernel | Yes, via its kernel |
| Installable on its own | No — needs a boot loader and root filesystem around it | A conceptual layer, not a downloadable product | Yes — this is literally what a person downloads and installs |
| Named without qualification | "Linux" alone often means this | Rarely named alone | "A distro," "Ubuntu," "Fedora" |

The separating axis is packaging completeness: kernel is a program only; operating system is
that program plus the services needed to run other programs; distribution is that operating
system packaged with a package manager, defaults, and a release policy into something a
person actually installs.

<a id="c-linux.linux-operating-system.kernel-space-vs-user-space"></a>
### Kernel space vs user space
*id: `linux.linux-operating-system.kernel-space-vs-user-space` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-syscalls-2, kernel-license-rules, kernel-readme*

**What it is** The privilege boundary the CPU itself enforces between two execution
contexts: kernel space, where code runs with unrestricted hardware and memory access, and
user space, where every ordinary process runs with restricted access mediated by the kernel.

**Why it matters** This boundary is the actual mechanism behind "why can't a process read
another process's memory" and "why doesn't one crashed application crash the whole
machine" — it is the enforcement layer that permissions and process isolation are built on.

**How it works** The CPU provides hardware privilege levels (rings, on x86); the kernel runs
in the most privileged ring, and ordinary processes run in a restricted one. A user-space
process cannot execute privileged instructions or touch arbitrary memory directly — it must
ask the kernel through a system call, and the CPU enforces that transition, not just
software convention.

**Key terms** privilege ring; system call; process isolation.

**Traps** This is not the same distinction as "root versus non-root user." A root process
still runs in user space; it simply has fewer permission checks applied to it there. Root is
a user-space privilege level; kernel space is a CPU-enforced execution mode entirely separate
from any Unix user account.

**What the exam may test** Distinguishing "a process running as root" from "code running in
kernel space" — a scenario naming one should not be answered as though it implies the other.

<a id="cmp-linux.linux-operating-system.kernel-space-vs-user-space"></a>
#### Not to be confused with: The kernel-space/user-space boundary vs the Kernel
*compares: `linux.linux-operating-system.kernel-space-vs-user-space`, `linux.linux-operating-system.kernel`*

| | Kernel space vs user space | Kernel |
| --- | --- | --- |
| What it names | A CPU-enforced privilege boundary | The specific program that runs on the privileged side of that boundary |
| Where root fits | Root is a user-space account privilege, unrelated to this boundary | The kernel is not a user account at all |
| What crosses it | System calls — the only sanctioned crossing point | Not applicable; the kernel is what sits on one side of the boundary |

The separating axis is category: kernel space vs user space names a privilege boundary; the
kernel names the specific program that lives on the privileged side of it.

<a id="c-linux.linux-operating-system.shell"></a>
### Shell
*id: `linux.linux-operating-system.shell` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-bash-1*

**What it is** The program that reads typed commands, interprets them, and turns them into
process execution — a command-line interpreter. Bash is the default on most distributions;
zsh, dash, and fish are common alternatives.

**Why it matters** Nearly every CLI-oriented exam scenario runs through a shell — command
execution, environment variables, and scripting all depend on which program is interpreting
the input, and PATH resolution behaves differently in a login shell versus a non-login one.

**How it works** The shell parses a typed line, expands variables and globs, resolves the
command name against PATH, and forks a child process to execute it — or handles it
internally if it is a shell builtin like `cd`. It is itself just a program, one that
specialises in launching other programs.

**Key terms** interpreter; builtin; PATH resolution; login shell.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `echo` | Print a value, here the current shell | (none needed) | `echo $SHELL` | `$SHELL` reports the user's configured login shell, not necessarily the shell actually running right now if it was overridden |

**Traps** A shell is not a terminal — see the comparison below. Some commands (`cd`,
`export`, `type`) are shell builtins with no standalone binary; running `which cd` correctly
reports nothing found in most shells because there is no `/usr/bin/cd`.

**What the exam may test** Recognising that a described behaviour (variable expansion,
builtin execution, job control) is a shell responsibility, not a kernel or terminal one.

*Not to be confused with [GUI vs CLI](linux-operating-system.md#cmp-linux.linux-operating-system.gui-vs-cli).*

<a id="cmp-linux.linux-operating-system.shell"></a>
#### Not to be confused with: Shell vs Terminal
*compares: `linux.linux-operating-system.shell`, `linux.linux-operating-system.terminal`*

| | Shell | Terminal |
| --- | --- | --- |
| What it is | The command interpreter | The interface that displays it |
| Runs where | As a process the terminal starts | As the window, pane, or console hosting the shell |
| Swappable independently | Yes — bash, zsh, fish | Yes — GNOME Terminal, iTerm2, a raw console |
| Interprets typed commands | Yes | No — it only renders input and output |

The terminal displays; the shell interprets — everything else in the table follows from
that one line.

<a id="c-linux.linux-operating-system.terminal"></a>
### Terminal
*id: `linux.linux-operating-system.terminal` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-bash-1*

**What it is** The interface that presents a shell to the user — historically a physical
device, today almost always a terminal emulator window or a remote session over SSH. The
terminal displays; the shell interprets.

**Why it matters** Troubleshooting scenarios often conflate "the terminal is frozen" with
"the shell is hung," but the fix differs: a genuinely frozen terminal emulator needs killing
at the window-manager level, while a hung shell waiting on a foreground command needs a
different escape entirely — Ctrl-C, Ctrl-Q, or a signal to the process.

**How it works** The terminal (or terminal emulator) manages the display, keyboard input,
and line-editing conventions, and hands typed input to whatever program it launched —
usually a shell — over a pseudo-terminal (pty) device. Output the shell produces is written
back through the same channel for the terminal to render.

**Key terms** terminal emulator; pseudo-terminal (pty); SSH session.

**Traps** "Terminal" and "shell" are used interchangeably in casual speech, and the exam
exploits exactly that looseness — a question describing shell behaviour with the word
"terminal" in it is still testing the shell.

**What the exam may test** Given a scenario, identify whether the described problem or
behaviour belongs to the terminal (display, input) or the shell (interpretation, execution).

*Not to be confused with [shell](linux-operating-system.md#cmp-linux.linux-operating-system.shell).*

<a id="c-linux.linux-operating-system.everything-is-a-file"></a>
### Everything is a file
*id: `linux.linux-operating-system.everything-is-a-file` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: kernel-readme, fhs-3.0, man-syscalls-2*

**What it is** The Unix design principle that devices, sockets, pipes, and much of the
kernel's own live state are exposed through the same filesystem interface used for ordinary
files — opened, read, and written with the same system calls.

**Why it matters** It is why a large share of Linux administration reduces to reading or
writing a path: `/dev/sda` for a disk, `/proc/cpuinfo` for CPU information, `/sys/class/thermal`
for a sensor. A candidate who does not know this principle will not recognise why so many
"how do I check X" answers are simply `cat` against a path.

**How it works** The kernel presents devices and interfaces as special file types (character
devices, block devices, sockets) inside the filesystem namespace, alongside pseudo-filesystems
like `/proc` and `/sys` that expose live kernel state as readable text. The same
open/read/write/close calls that work on a regular file work on these.

**Key terms** device file; `/proc`; `/sys`; pseudo-filesystem.

<a id="c-linux.linux-operating-system.multi-user-and-multitasking"></a>
### Multi-user and multitasking
*id: `linux.linux-operating-system.multi-user-and-multitasking` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: kernel-readme*

**What it is** Linux is designed to run many users and many processes concurrently on one
machine, each isolated from the others by the kernel — this is why user accounts, process
ownership, and permission checks exist as a coherent system rather than an afterthought.

**Why it matters** Every permission model tested elsewhere in this domain — file ownership,
`sudo`, process signals reaching only your own processes by default — rests on this design
assumption; a single-user, single-tasking mental model gets those questions wrong.

**How it works** The kernel's scheduler time-slices the CPU across processes belonging to
potentially different users, and enforces that one user's processes cannot read another's
memory, signal another's processes, or bypass another's file permissions without explicit
privilege. Multiple users can be logged in, locally or remotely, at the same time.

**Key terms** process ownership; time-slicing; user isolation.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `linux.linux-operating-system.system-call` | System call | The controlled entry point by which a userspace program asks the kernel to do privileged work such as opening a file. | Distinguish it from a plain library call — a system call crosses the kernel boundary, a library call does not. |

#### Scenario

A candidate SSHes into a server, types `ls`, and gets a directory listing. Trace it layer by
layer: the terminal (the SSH session's pty) accepts the keystrokes and hands the line to the
shell; the shell resolves `ls` against PATH and forks a child process; that process's `ls`
binary issues system calls to read the directory, crossing from user space into kernel space
each time; the kernel — the OS's privileged core — performs the actual read against the
filesystem and returns control; the shell prints the result back through the terminal.
Two other users are logged into the same server at the same moment, each with their own
shell and processes, isolated from one another by the multi-user, multitasking design the
kernel enforces — and the directory just read is itself reached through the same
open/read interface as everything else, the everything-is-a-file principle.

#### Knowledge check

1. What is the one-sentence difference between the kernel and the operating system?
   The kernel is the OS's privileged core; the operating system is the kernel plus the
   userspace services built on it.
2. A user's terminal appears to freeze after they run a command. Is the fix necessarily the
   same as if the shell itself were hung waiting on that command?
   No — a frozen terminal emulator may need killing at the window-manager level, while a
   hung shell waiting on a foreground process needs a signal to the process (Ctrl-C) or a
   flow-control release (Ctrl-Q), not a terminal restart.
3. What is allowed to cross the kernel-space/user-space boundary, and what is not?
   System calls cross it; a root user's elevated process still runs in user space and does
   not cross into kernel space merely by holding root privilege.
4. Name two things reached through "everything is a file" that are not files in the everyday
   sense.
   `/proc/cpuinfo` (live kernel state) and `/dev/sda` (a disk device) are both examples.
5. Why can two different users each run a process with the same name at the same time
   without conflict?
   Multi-user, multitasking isolation: the kernel schedules and owns each process
   separately, keeping their memory and permissions apart regardless of the program name.

<a id="s-linux-operating-system-distributions"></a>
## Distributions

<a id="c-linux.linux-operating-system.linux-distribution"></a>
### Linux distribution
*id: `linux.linux-operating-system.linux-distribution` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-os-release-5, gnu-linux-and-gnu, kernel-readme*

**What it is** The kernel packaged with GNU userland tools, a package manager, default
configuration, and a release policy — the thing a person actually downloads and installs.
The kernel alone boots to nothing usable; the distribution is what makes it a working system.

**Why it matters** "Which distribution" questions test package-manager and family knowledge
(see below); more subtly, "identify this system" scenarios expect the candidate to read
`/etc/os-release` rather than guess from context clues.

**How it works** A distribution's maintainers pick a kernel version, bundle it with
coreutils, a shell, a package manager, and default services, and publish it under a release
policy — fixed releases, long-term support, or rolling. Every installed system carries this
identity in a standard, machine-readable file.

**Key terms** userland; package manager; release policy.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `cat` | Print a file's contents, here the distribution identity file | (none needed) | `cat /etc/os-release` | Assuming this file reports the kernel version — it reports distribution identity only; use `uname -r` for the kernel |

**Traps** A "Linux distribution" is not "Linux" — the kernel is one component of it, not the
whole. "Which distribution" is also a different question from "which distribution family" —
RHEL and Fedora are different distributions in the same family.

**What the exam may test** Given a described system (a package manager name, a file's
contents, a release cadence), identify the distribution or its family correctly, and know
which command surfaces that identity.

*Not to be confused with [distribution families](linux-operating-system.md#cmp-linux.linux-operating-system.distribution-families).*
*Not to be confused with [kernel](linux-operating-system.md#cmp-linux.linux-operating-system.kernel).*

<a id="c-linux.linux-operating-system.distribution-families"></a>
### Distribution families
*id: `linux.linux-operating-system.distribution-families` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-os-release-5, ubuntu-release-cycle, archwiki-arch-linux*

**What it is** Distributions cluster into families by shared package format and tooling
lineage: the Debian family (Debian, Ubuntu, Linux Mint) using `.deb` packages and `apt`; the
Red Hat family (RHEL, Fedora, CentOS Stream, Rocky Linux) using `.rpm` and `dnf`; SUSE
(openSUSE, SLES), also `.rpm`-based, using `zypper`; and Arch, with its own `pacman` and a
rolling release model.

**Why it matters** Package-manager questions are some of the most literal on this exam:
given a distribution name, name its package manager, or the reverse. Getting the family
wrong — assuming Fedora uses `apt`, for instance — is a pure recall failure the exam is
built to catch.

**How it works** A family shares packaging format and often shares patches and defaults, but
member distributions still differ in release policy, default configuration, and target
audience — Ubuntu and Debian both use `apt` but ship on very different release cadences.

**Key terms** package format; `apt`; `dnf`; `pacman`.

**Traps** CentOS Stream is not CentOS Linux — CentOS Stream is a rolling preview of upcoming
RHEL, not the discontinued fixed-release CentOS Linux. Rocky Linux exists specifically as
CentOS Linux's downstream, fixed-release replacement.

**What the exam may test** Matching a distribution to its family and package manager without
hesitation — this is memorisation, and the exam treats it as such.

<a id="cmp-linux.linux-operating-system.distribution-families"></a>
#### Not to be confused with: Distribution families vs Linux distribution
*compares: `linux.linux-operating-system.distribution-families`, `linux.linux-operating-system.linux-distribution`*

| | Linux distribution | Distribution families |
| --- | --- | --- |
| What it names | One specific installable system (e.g. Ubuntu 24.04) | A cluster of distributions sharing packaging lineage (e.g. "the Debian family") |
| Granularity | A singular product | A category spanning multiple products |
| What the exam asks | "What is this system" | "What package manager does this family use" |

The separating axis is granularity: a distribution is one product; a family is the packaging
lineage several distributions share.

<a id="c-linux.linux-operating-system.lts-vs-rolling-release"></a>
### LTS vs rolling release
*id: `linux.linux-operating-system.lts-vs-rolling-release` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: ubuntu-release-cycle, archwiki-arch-linux*

**What it is** Two opposed release policies. Long-term-support (LTS) releases freeze a
version and backport security and bug fixes for a fixed support window (Ubuntu LTS: five
years standard); rolling releases (Arch) ship every update continuously, with no separate
version to freeze.

**Why it matters** The trade-off is stability against currency: LTS systems change less over
their support life and are preferred for production servers precisely because behaviour does
not shift underneath them; rolling systems always run the newest software, at the cost of
needing more frequent, active maintenance.

**How it works** An LTS release's package versions stay fixed after release; only
security-relevant patches are backported into those same versions. A rolling release has no
such freeze — updates flow continuously, and there is no single "release" to point to as the
system's version at all, only a point in time.

**Key terms** backport; support window; freeze.

#### Scenario

An administrator is handed a server with no documentation and needs to know what package
manager to use before installing anything. Reading `/etc/os-release` shows `ID=rocky`. Rocky
Linux belongs to the Red Hat family, so the package manager is `dnf`, not `apt`. The
administrator must also choose an upgrade cadence for a new deployment: for a production
system, where behaviour shifting under a running service is a bigger risk than staying a
version behind, an LTS-style release is the safer choice over a rolling release.

#### Knowledge check

1. Given `ID=ubuntu` in `/etc/os-release`, what package manager and package format should be
   expected?
   `apt`, `.deb`.
2. What is the one-sentence difference between "distribution" and "distribution family"?
   A distribution is one specific product; a family is the packaging lineage several
   products share.
3. Why would a production database server typically prefer an LTS release over a rolling
   one?
   Stability: package versions do not shift unexpectedly under a running service; only
   security patches are backported into the frozen versions.
4. Is CentOS Stream the same thing as the discontinued CentOS Linux?
   No — CentOS Stream is a rolling preview of upcoming RHEL; Rocky Linux is the fixed-release
   replacement for the discontinued CentOS Linux.

<a id="s-linux-operating-system-history-and-licensing"></a>
## History and licensing

<a id="c-linux.linux-operating-system.gnu-and-the-linux-kernel"></a>
### GNU and the Linux kernel
*id: `linux.linux-operating-system.gnu-and-the-linux-kernel` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-linux-and-gnu, kernel-readme*

**What it is** Linux, strictly, is the kernel Linus Torvalds began in 1991. Most of the
surrounding userland — the shell, coreutils, the compiler toolchain — traces back to the GNU
Project, begun in 1983 to build a complete free Unix-like system. A typical Linux
distribution combines a GNU userland with the Linux kernel, which is why the combination is
sometimes formally called GNU/Linux.

**Why it matters** This is a naming-precision trap the exam can test directly: "the Linux
kernel" and "GNU/Linux" are not interchangeable phrases for the same referent — one names a
kernel, the other names a specific combination of that kernel with a particular userland.

**How it works** GNU supplied the compiler (GCC), the shell and core utilities, and most of
the license framework (the GPL) years before Linux existed; it lacked only a free kernel of
its own. Linux filled that missing piece. The result is that "the userland" on most Linux
systems is substantially GNU software running on a non-GNU kernel.

**Key terms** GNU Project; userland; GPL.

**Traps** Not every Linux distribution is GNU/Linux in this strict sense — Android, for
instance, runs the Linux kernel with a non-GNU userland (Bionic, not glibc), so "Linux" is
the more accurate umbrella term when a GNU userland cannot be assumed.

**What the exam may test** Correctly separating "the kernel" (Linux) from "the userland it
is commonly paired with" (GNU) when a question's wording implies they are the same thing.

<a id="cmp-linux.linux-operating-system.gnu-and-the-linux-kernel"></a>
#### Not to be confused with: GNU and the Linux kernel vs Kernel
*compares: `linux.linux-operating-system.gnu-and-the-linux-kernel`, `linux.linux-operating-system.kernel`*

| | GNU and the Linux kernel | Kernel |
| --- | --- | --- |
| What it names | The pairing of the Linux kernel with a GNU userland | The privileged core program itself |
| Origin | GNU: 1983; Linux kernel: 1991, joined to GNU tooling afterward | The Linux kernel project alone |
| Present on every "Linux" system | No — some systems pair the kernel with a non-GNU userland (e.g. Android) | Yes, by definition |

The separating axis is scope: kernel names one component; GNU and the Linux kernel names a
specific historical pairing of that component with a particular userland that not every
Linux system uses.

<a id="c-linux.linux-operating-system.linux-history"></a>
### Linux history
*id: `linux.linux-operating-system.linux-history` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: kernel-readme, lf-about*

**What it is** Linus Torvalds began the Linux kernel in 1991 as a free Unix-like kernel and
has developed it openly, with a large contributor base, ever since. The Linux Foundation,
founded later, sponsors and hosts the kernel's development infrastructure and funds core
maintainers — but technical direction remains with Torvalds and the kernel's maintainer
hierarchy, not with the Foundation.

**Why it matters** The exam distinguishes governance from sponsorship elsewhere in this
domain, and this is the clearest example of it: the organisation whose name is on the
certification does not set the kernel's technical direction.

**How it works** Kernel development runs through a maintainer hierarchy — subsystem
maintainers review and merge patches, escalating disputed changes up to Torvalds. The Linux
Foundation provides infrastructure, funding, trademark stewardship, and neutral ground for
competing vendors to collaborate — an organisational role, not a technical one.

**Key terms** maintainer hierarchy; Linux Foundation; upstream.

<a id="c-linux.linux-operating-system.open-source-licensing-of-linux"></a>
### Open source licensing of Linux
*id: `linux.linux-operating-system.open-source-licensing-of-linux` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: kernel-license-rules, kernel-readme*

**What it is** The Linux kernel is released under the GNU General Public License version 2
(GPLv2) only — not "GPLv2 or later." This is why distributions may freely copy, modify, and
redistribute the kernel, provided redistributions stay under the same license.

**Why it matters** Licensing questions elsewhere in this domain ask which license permits
what; the kernel is the concrete example the exam most often reaches for, and its being
GPLv2-only, rather than the more common "or later" clause, is a fact worth holding
separately.

**How it works** GPLv2 is copyleft: anyone may run, study, modify, and redistribute the
code, but a redistributed derivative must also be licensed under GPLv2, and source code must
be made available to recipients. This obligation attaches to the kernel itself; userland
tools bundled alongside it in a distribution often carry different licenses individually.

**Key terms** copyleft; GPLv2; source availability.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `linux.linux-operating-system.unix-heritage-and-posix` | Unix heritage and POSIX | Linux is Unix-like and largely POSIX-conformant, which is why skills and scripts port across Unix systems. | Recognition only — know that POSIX conformance is *why* portability exists, not the standard's contents. |

#### Scenario

A colleague says "Linux was created by the Linux Foundation." Correct both errors in that
sentence: Linux, the kernel, was begun by Linus Torvalds in 1991, years before the Linux
Foundation existed; the Foundation sponsors and hosts kernel development infrastructure
today but does not set its technical direction, which stays with Torvalds and the maintainer
hierarchy. The colleague also says their system "runs GNU/Linux" — ask what userland it
uses: a standard desktop or server distribution with GNU coreutils and bash makes GNU/Linux
accurate; Android would not, because it pairs the same kernel with a non-GNU userland.
Finally, they ask whether they may redistribute a modified kernel commercially: yes, under
GPLv2, provided the redistribution stays under GPLv2 and source is made available to
recipients.

#### Knowledge check

1. Who sets the Linux kernel's technical direction, and who provides its infrastructure and
   funding?
   Torvalds and the maintainer hierarchy set direction; the Linux Foundation provides
   infrastructure, funding, and sponsorship.
2. What is the one-sentence difference between "Linux" and "GNU/Linux"?
   Linux names the kernel alone; GNU/Linux names that kernel specifically paired with a GNU
   userland.
3. Under what license is the Linux kernel released, and what does that license require of a
   redistributor?
   GPLv2 only; a redistributor must keep derivatives under GPLv2 and make source available.
4. Linux is described as "largely POSIX-conformant." What does that buy a candidate in
   practice?
   Portability — skills and shell scripts largely transfer across Unix-like systems sharing
   that conformance.

<a id="s-linux-operating-system-hardware"></a>
## Hardware

<a id="c-linux.linux-operating-system.cpu"></a>
### CPU
*id: `linux.linux-operating-system.cpu` · depth 3 · importance 2 · LFS200: PARTIALLY COVERED · sources: man-lscpu-1*

**What it is** The processor that executes instructions. Core count, thread count (with
simultaneous multithreading), and clock speed determine how much work genuinely runs in
parallel versus queues for a turn.

**Why it matters** Performance-troubleshooting scenarios ("the server feels slow") often
hinge on whether the bottleneck is CPU-bound at all — the first diagnostic step is
establishing what CPU resource actually exists before blaming it.

**How it works** Linux exposes CPU topology and capability through `/proc/cpuinfo` and the
kernel's own accounting; `lscpu` formats that into a human-readable summary (architecture,
core/socket/thread counts, cache sizes), while `nproc` reports the number of processing
units currently available to the calling process — which can be fewer than the physical
total if constrained by cgroups or CPU affinity.

**Key terms** core; thread; clock speed; CPU affinity.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `lscpu` | Display CPU architecture information | (default output is a full summary) | `lscpu` | Reading "CPU(s):" as physical cores when it is logical processors, which include SMT threads |
| `nproc` | Print the number of processing units available | `--all` ignore affinity/cgroup limits | `nproc` | Assuming `nproc` always reports the physical core count — it reports what is currently available to the caller, which can be restricted |

**Traps** "Number of CPUs" is ambiguous between sockets, physical cores, and logical
processors — with hyperthreading, logical count exceeds physical core count. `lscpu`'s
output separates these explicitly.

**What the exam may test** Choosing the right command to answer "how many processors does
this system have" versus "how many can this process actually use."

<a id="c-linux.linux-operating-system.ram"></a>
### RAM
*id: `linux.linux-operating-system.ram` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-free-1*

**What it is** Volatile working memory — cleared on power loss — that holds running
processes' code and data. When it is exhausted, the system either swaps pages out to disk
(slowing sharply) or, under severe pressure, the kernel's out-of-memory (OOM) killer
terminates a process to reclaim it.

**Why it matters** "The system is slow" and "a process was killed unexpectedly" are two of
the most common troubleshooting scenarios, and both trace back to memory pressure —
recognising the symptom pattern is a diagnostic skill the exam tests directly.

**How it works** The kernel allocates RAM to processes on demand and uses otherwise-idle RAM
as disk cache to speed up repeated I/O, which is why naively reported "free" memory looks
lower than what is actually available; memory-reporting tools separate "used by processes"
from "used as reclaimable cache."

**Key terms** swap; OOM killer; page cache.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `free` | Report memory and swap usage | `-h` human-readable units | `free -h` | Reading the "used" column without accounting for reclaimable cache, and concluding memory is nearly exhausted when it is not |

**Traps** Storage devices are also persistent and reported in similar-looking units — RAM is
distinguished by volatility and byte-addressable access speed, not by the raw fact of
"holding data." See the comparison below.

**What the exam may test** Correctly reading `free -h` output to determine whether a system
is actually memory-constrained or merely caching aggressively.

<a id="cmp-linux.linux-operating-system.ram"></a>
#### Not to be confused with: RAM vs Storage devices
*compares: `linux.linux-operating-system.ram`, `linux.linux-operating-system.storage-devices`*

| | RAM | Storage devices |
| --- | --- | --- |
| Volatile | Yes — cleared on power loss | No — persists without power |
| Access pattern | Byte-addressable, directly by the CPU | Block-addressable, through a filesystem and driver |
| What exhausting it causes | Swapping, or the OOM killer terminating a process | Write failures and free-space errors, not process kills |

The separating axis is persistence: RAM is fast and volatile; storage is slower and
persistent — everything else in the table follows from that.

<a id="c-linux.linux-operating-system.storage-devices"></a>
### Storage devices
*id: `linux.linux-operating-system.storage-devices` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-lsblk-8*

**What it is** Persistent block devices — HDD (spinning platters), SSD (flash, no moving
parts), and NVMe (flash over the PCIe bus rather than SATA) — that hold filesystems and
survive power loss.

**Why it matters** "Which disk is which" and "what is mounted where" are the starting point
of most storage-troubleshooting and capacity scenarios; misreading `lsblk` output — confusing
a whole disk with one of its partitions — is a common, testable mistake.

**How it works** The kernel exposes each storage device, and each partition on it, as a
block device node under `/dev`. `lsblk` reads this device tree and presents it
hierarchically — whole disks as parents, partitions as children — with size, filesystem
type, and mount point where known.

**Key terms** block device; partition; mount point.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `lsblk` | List block devices in a tree | `-f` show filesystem type and UUID | `lsblk` | Treating a partition row (e.g. `sda1`) as if it were the whole disk (`sda`), and acting on the wrong device |

**Traps** NVMe devices are named `/dev/nvme0n1`-style, not `/dev/sdX` — a question naming a
device path is implicitly naming its transport too.

**What the exam may test** Reading `lsblk`'s hierarchy correctly to identify which block
device a given mount point actually lives on.

*Not to be confused with [RAM](linux-operating-system.md#cmp-linux.linux-operating-system.ram).*

<a id="c-linux.linux-operating-system.cpu-architecture"></a>
### CPU architecture
*id: `linux.linux-operating-system.cpu-architecture` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-uname-1, kernel-readme*

**What it is** The instruction set a CPU implements. x86_64 (Intel/AMD, 64-bit) and
ARM64/aarch64 (increasingly common on servers, and standard on Apple Silicon and most phones)
are the two an LFCA candidate needs to recognise. Binaries and container images are
architecture-specific — one built for one will not run on the other without emulation.

**Why it matters** "Why won't this binary run" and "why did this container image fail to
start" scenarios frequently resolve to an architecture mismatch, not a missing dependency —
recognising the symptom saves a lot of wrong-direction debugging.

**How it works** `uname -m` and `arch` both report the machine hardware name — `x86_64` or
`aarch64` are the common outputs — reflecting the CPU instruction set the running kernel was
built for, not any particular distribution choice.

**Key terms** instruction set; x86_64; ARM64; emulation.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `uname` | Print system information, here machine hardware name | `-m` machine hardware name | `uname -m` | Confusing `-m` (hardware architecture) with `-r` (kernel release) — they answer different questions |
| `arch` | Print machine architecture | (no options needed) | `arch` | Assuming `arch` and `uname -m` can disagree — on Linux they report the same value; `arch` is effectively a thin wrapper around it |

**Traps** A container image built for `linux/amd64` failing on an ARM64 host, or vice versa,
is an architecture mismatch, not a missing-package error, even though the failure message is
often unhelpful about which.

**What the exam may test** Reading the architecture from a system and matching it correctly
against a binary or image's stated target platform.

<a id="c-linux.linux-operating-system.device-drivers-and-kernel-modules"></a>
### Device drivers and kernel modules
*id: `linux.linux-operating-system.device-drivers-and-kernel-modules` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: kernel-kconfig-language, kernel-kbuild-modules, man-modprobe-8, man-lsmod-8*

**What it is** Kernel code that drives a specific piece of hardware. It can be built
directly into the kernel image (compiled in) or built as a loadable kernel module that
attaches and detaches at runtime without a reboot. Kconfig marks each option `Y` (built in)
or `M` (module) at kernel build time.

**Why it matters** "Why doesn't this device work until I load a module" and "why is this
driver always present" both trace to the built-in-versus-module distinction, and loading the
right module is how a device gains support after the fact — without recompiling or
rebooting the kernel.

**How it works** A module is a `.ko` file the kernel can link into its running address space
on demand. `modprobe` loads a module (and its dependencies, resolved automatically) or
removes one with `-r`; `lsmod` lists modules currently loaded, reading from
`/proc/modules`. A built-in driver, by contrast, is already part of the running kernel image
and never appears in `lsmod` output at all, because there is nothing separate to list.

**Key terms** loadable kernel module; Kconfig; built-in driver.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `lsmod` | List currently loaded kernel modules | (no options needed) | `lsmod` | Concluding a driver is absent because it does not appear in `lsmod` — a built-in driver never appears there even though it is active |
| `modprobe` | Load or remove a kernel module and its dependencies | `-r` remove a module | `modprobe` | Confusing `modprobe` with `insmod` — `insmod` loads exactly the file given with no dependency resolution; `modprobe` resolves dependencies automatically |

**Traps** A missing driver is not always a missing module — if the driver was compiled in
(`Y` in Kconfig), there is no module to load or unload, and `modprobe`/`lsmod` are irrelevant
to diagnosing it.

**What the exam may test** Given a hardware-not-working scenario, deciding whether the fix
is loading a module versus a different layer entirely (firmware, permissions, physical
connection).

<a id="cmp-linux.linux-operating-system.device-drivers-and-kernel-modules"></a>
#### Not to be confused with: Device drivers and kernel modules vs Firmware
*compares: `linux.linux-operating-system.device-drivers-and-kernel-modules`, `linux.linux-operating-system.firmware`*

| | Device drivers and kernel modules | Firmware |
| --- | --- | --- |
| What it is | Kernel-level code that operates the device from the OS side | Low-level software embedded in the device itself |
| Where it runs | Inside the kernel — built in or as a loaded module | On the device's own controller, below the OS entirely |
| Updated by | The kernel or a module package | A separate firmware update process, independent of the kernel |
| Fixes "device not detected" | Sometimes — if the module is missing or not loaded | Sometimes — if the device's own embedded software is missing or out of date; no module load fixes this case |

The separating axis is which side of the hardware boundary the code runs on: the driver is
the kernel's side of talking to the device; firmware is the device's own embedded software,
running before and independent of any OS.

*Not to be confused with [device drivers and kernel modules](linux-operating-system.md#cmp-linux.linux-operating-system.device-drivers-and-kernel-modules).*

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `linux.linux-operating-system.firmware` | Firmware | Low-level software embedded in a device, distinct from the operating system that runs above it. | Confused with a kernel driver — firmware runs on the device itself; the driver runs in the kernel and talks to that firmware. Loading a module never fixes a firmware problem, and updating firmware never substitutes for a missing driver. [Not to be confused with device drivers and kernel modules](linux-operating-system.md#cmp-linux.linux-operating-system.device-drivers-and-kernel-modules). |

#### Scenario

A server is reported as "randomly slow." Diagnostic order: check RAM pressure first
(`free -h` — is swap heavily used, indicating memory exhaustion?), then CPU (`lscpu` and
`nproc` — how many logical processors actually exist, so a load figure can be judged in
context), then storage (`lsblk` — is the slow path actually on a different, slower physical
device than assumed, spinning HDD rather than NVMe). Separately, a new peripheral is plugged
in and does not work: check `lsmod` for its driver and `modprobe` to load it if it is
missing as a module — but if the device also needs its own firmware update, no kernel module
load will fix a missing-firmware failure, because firmware runs on the device itself, not in
the kernel. Finally, a deployment script fails on an ARM64 build server: `uname -m` shows why
— the container image was built for `x86_64` and cannot run natively on this architecture.

#### Knowledge check

1. `free -h` shows heavy swap use. What does that indicate, and what are the two things the
   kernel might do about memory exhaustion?
   It indicates memory pressure; the kernel swaps pages to disk, or under severe pressure
   invokes the OOM killer to terminate a process.
2. What is the one-sentence difference between RAM and a storage device?
   RAM is volatile and byte-addressable; a storage device is persistent and
   block-addressable.
3. A device is not working and `lsmod` shows no relevant module loaded. Is loading the
   module guaranteed to fix it?
   No — the driver could be built into the kernel (never appears in `lsmod`), or the device
   could need a firmware update, a separate layer entirely.
4. What is the one-sentence difference between a kernel driver/module and firmware?
   The driver is the kernel's code for talking to the device; firmware is the device's own
   embedded software, running independently of the kernel.
5. `uname -m` reports `aarch64` on the build host, but the failing image was built for
   `amd64`. What kind of problem is this?
   An architecture mismatch, not a missing dependency.

<a id="s-linux-operating-system-interfaces"></a>
## Interfaces

<a id="c-linux.linux-operating-system.gui-vs-cli"></a>
### GUI vs CLI
*id: `linux.linux-operating-system.gui-vs-cli` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-bash-1, xorg-wiki*

**What it is** The graphical interface (windows, icons, pointer input) versus the
command-line interface (typed commands, text output). Both are ways of driving the same
underlying system; neither is "more Linux" than the other.

**Why it matters** Servers are overwhelmingly administered by CLI, not because GUIs cannot
exist on a server but because CLI is scriptable, works over a low-bandwidth remote
connection, and consumes negligible resources compared to a full desktop stack — the exam
expects this reasoning, not just the fact.

**How it works** A CLI session needs only a shell and a terminal, or an SSH connection
carrying one — no display server, no window manager. A GUI session requires a display server
(X11 or Wayland) and typically a desktop environment or window manager on top of it, all of
which consume memory and CPU a headless server has no other use for.

**Key terms** headless; SSH; display server.

**Traps** "GUI vs CLI" is a different distinction from "shell vs terminal" — GUI/CLI names
the interface paradigm as a whole; shell and terminal are both specifically CLI-side
components.

**What the exam may test** Justifying why a server scenario defaults to CLI
administration — the scriptability, remotability, and resource-cost reasoning, not just
"servers don't have GUIs."

<a id="cmp-linux.linux-operating-system.gui-vs-cli"></a>
#### Not to be confused with: GUI vs CLI vs the Shell
*compares: `linux.linux-operating-system.gui-vs-cli`, `linux.linux-operating-system.shell`*

| | GUI vs CLI | Shell |
| --- | --- | --- |
| What it names | The interface style — graphical or text/command-based | The specific program interpreting commands on the CLI side |
| Requires a display server | Only the GUI side does | No — a shell runs with only a terminal or SSH session |
| Is itself swappable | Not applicable — this is a category, not a program | Yes — bash, zsh, fish |

The separating axis is level: GUI vs CLI names the interface paradigm; shell names one
specific program that exists only on the CLI side of it.

<a id="c-linux.linux-operating-system.desktop-environments"></a>
### Desktop environments
*id: `linux.linux-operating-system.desktop-environments` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: xorg-wiki, wayland-architecture*

**What it is** A complete graphical desktop — window manager, panel, file manager,
settings, and default applications — bundled as a coherent product. GNOME, KDE Plasma, and
XFCE are the common ones; the choice is independent of which distribution is installed.

**Why it matters** "Which desktop environment does distribution X use" is a distractor-heavy
question style, because most major distributions ship several desktop environments as
installable options or spins — the honest answer is usually "whichever one the specific
install chose," not a fixed one-to-one mapping.

**How it works** A desktop environment runs on top of a display server (X11 or Wayland),
providing the window manager and the surrounding shell of applications and settings that
make a graphical session usable. Swapping desktop environments on the same distribution and
display server is generally supported.

**Key terms** window manager; display server; desktop spin.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `linux.linux-operating-system.x11-and-wayland` | X11 and Wayland | The display server protocols underlying Linux graphics; Wayland is the newer replacement for the older X11. | Recognition only — know Wayland is the newer protocol, not which distribution defaults to which. |

#### Scenario

A team debates whether their new internal tool needs a GUI. It will run exclusively on
headless cloud servers, administered over SSH, and must be scriptable for automation.
Justify CLI: no display server or desktop environment needs to run, saving memory and CPU the
server has no other use for, and CLI output can be piped and scripted in a way a GUI cannot.
Separately, a new hire asks what the difference is between the terminal and the shell they
are using inside it — the terminal renders the session; bash, the shell, is what actually
interprets their commands, and either could be swapped independently of the other.

#### Knowledge check

1. Why do most servers default to CLI administration rather than GUI?
   No display-server or desktop overhead; scriptable and automatable; works over
   low-bandwidth remote connections.
2. What is the one-sentence difference between GUI vs CLI and shell vs terminal?
   GUI vs CLI is the interface paradigm as a whole; shell vs terminal are both specifically
   CLI-side components — one interprets, the other displays.
3. Which is newer, X11 or Wayland?
   Wayland.
4. Can a desktop environment be swapped without reinstalling the distribution?
   Yes — desktop environment choice is independent of the distribution.

<a id="s-linux-operating-system-environment"></a>
## Environment

<a id="c-linux.linux-operating-system.environment-variables"></a>
### Environment variables
*id: `linux.linux-operating-system.environment-variables` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-environ-7, posix-env-vars, man-bash-1*

**What it is** Named values held in a process's environment and inherited by every child
process it starts, used to configure behaviour without changing code — `HOME`, `PATH`,
`LANG`, and application-specific variables are all examples.

**Why it matters** Environment variables explain a large class of "it works when I run it
manually but not in a script, cron job, or service" problems: a script run under `cron` or a
systemd service inherits a much smaller, different environment than an interactive login
shell does.

**How it works** A shell variable becomes an environment variable only once exported; from
that point, every process the shell forks receives a copy of it. Inheritance is
one-directional and copy-based — a child process changing its own copy of a variable never
affects the parent's.

**Key terms** export; inheritance; shell variable versus environment variable.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `env` | Print, or run a command with, the current environment | (no args: print) | `env` | Assuming `env` shows shell variables too — it shows only exported (environment) variables, not un-exported shell variables |
| `export` | Mark a shell variable for inclusion in the environment of child processes | `name=value`, or a bare name | `export` | Setting a variable (`VAR=value`) and expecting a child process to see it without also exporting it |
| `echo` | Print a value, here an environment variable | (none needed) | `echo $HOME` | Forgetting the `$` — `echo HOME` prints the literal text "HOME," not the variable's value |

**Traps** A variable set with `VAR=value` but not exported is a shell variable, not an
environment variable — it will not appear in `env` output and will not be inherited by
child processes, even though `echo $VAR` inside the same shell still shows it.

**What the exam may test** Diagnosing why a value visible interactively is missing inside a
script, service, or subprocess — the export/inheritance boundary.

<a id="c-linux.linux-operating-system.path"></a>
### PATH
*id: `linux.linux-operating-system.path` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-bash-1, posix-env-vars, fhs-3.0*

**What it is** `PATH` is an environment variable holding an ordered, colon-separated list of
directories the shell searches, in order, when resolving a bare command name to an
executable file.

**Why it matters** "Command not found" for a program that is genuinely installed is one of
the most common early troubleshooting scenarios, and it is almost always a PATH problem —
either the installing directory is not on PATH, or a same-named executable earlier on PATH is
shadowing the intended one.

**How it works** When a bare command name is typed, the shell walks PATH left to right and
runs the first matching executable file it finds; it does not search the whole filesystem
and does not consult the current directory unless `.` is explicitly on PATH, which is a
security risk and not default. `which` reports which file on PATH would run; `type` reports
more generally what would run, including builtins and aliases PATH cannot see at all.

**Key terms** search order; shadowing; builtin (invisible to PATH).

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `echo` | Print a value, here PATH itself | (none needed) | `echo $PATH` | Reading the list right to left — PATH is searched left to right, so an earlier directory's match always wins |
| `which` | Report which file on PATH a command name would run | `-a` list all matches, not just the first | `which` | Using `which` for a shell builtin (`cd`, `export`) — builtins have no file on PATH, so `which` reports nothing found even though the command works |
| `type` | Report how a name would be interpreted — builtin, alias, function, or file | (no options needed for basic use) | `type` | Assuming `type` and `which` always agree — `type` sees builtins and aliases that `which` cannot |

**Traps** "Command not found" despite the program being installed usually means the
installing directory (e.g. `/usr/local/bin`, or a language-specific bin directory) is
missing from PATH, not that the install itself failed.

**What the exam may test** Diagnosing a command-not-found scenario correctly, and choosing
`which` versus `type` depending on whether the target might be a builtin.

<a id="c-linux.linux-operating-system.system-information-commands"></a>
### System information commands
*id: `linux.linux-operating-system.system-information-commands` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-uname-1, man-os-release-5, man-hostnamectl-1, man-uptime-1*

**What it is** The small set of commands that answer "what machine is this": kernel version
and architecture, distribution identity, hostname, and how long the system has been running
without a reboot.

**Why it matters** Nearly every troubleshooting scenario opens with establishing what system
is even being discussed — a fix correct for one kernel version, distribution, or
architecture can be wrong for another, so this is the baseline step before any other
diagnosis.

**How it works** `uname -a` prints kernel name, release, version, and machine architecture
in one line; `hostnamectl` (on systemd systems) reports hostname alongside OS, kernel, and
architecture in a more structured form; `cat /etc/os-release` reports distribution identity
specifically; `uptime` reports time since boot plus load averages, which doubles as a
first-pass load indicator.

**Key terms** `uname`; `hostnamectl`; load average.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `uname` | Print system information | `-a` all available fields | `uname -a` | Reading the architecture field as the distribution — `uname` never reports distribution identity at all |
| `hostnamectl` | Show or set the system hostname and related system information | (no args: show status) | `hostnamectl` | Assuming `hostnamectl` exists on every Linux system — it is systemd-specific and absent on non-systemd distributions |
| `cat` | Print a file's contents, here distribution identity | (none needed) | `cat /etc/os-release` | Confusing this with kernel version — it reports the distribution only |
| `uptime` | Report how long the system has run and its load averages | (no options needed for basic use) | `uptime` | Reading a load average above 1.0 as automatically "overloaded" without dividing by CPU core count first |

**Traps** Load average is relative to CPU core count, not an absolute threshold — a load of
4 is idle on a 16-core machine and saturated on a 2-core one; `uptime`'s numbers mean nothing
without also knowing `nproc`'s answer.

**What the exam may test** Selecting the correct command for a specific fact requested
(kernel versus distribution versus hostname versus uptime) rather than reaching for
`uname -a` for everything.

#### Scenario

A script that works fine when run manually fails with "command not found" when triggered by
`cron`. Diagnose it: `cron` jobs inherit a minimal environment, not the interactive shell's
environment — check what PATH `cron` actually sees, since it is commonly much shorter than
an interactive login shell's, and check whether the needed variable was exported rather than
just set, since only exported variables are inherited by child processes including cron's.
`which` confirms what file PATH would resolve for the command; if the answer is nothing
found but the command works interactively, the installing directory is missing from cron's
PATH specifically. Once cron is fixed, a teammate asks what system the job actually ran on —
`uname -a`, `hostnamectl`, and `cat /etc/os-release` between them answer kernel, hostname,
and distribution identity respectively.

#### Knowledge check

1. A variable is set with `VAR=value` (no export) and is visible via `echo $VAR` in the same
   shell, but a script the shell runs cannot see it. Why?
   It is a shell variable, not an environment variable — export is required for
   child-process inheritance.
2. What is PATH's search order, and why does it matter?
   Left to right; the first match wins, so an earlier directory's same-named executable
   shadows a later one.
3. `which mycmd` reports nothing found, but typing `mycmd` works. What is the likely
   explanation?
   `mycmd` is a shell builtin or alias, invisible to `which`; `type mycmd` would show it.
4. Why might a cron job fail with "command not found" for a program that works fine
   interactively?
   `cron` runs with a minimal inherited environment and PATH, different from an interactive
   login shell's.
5. Which single command reports distribution identity specifically, as opposed to kernel
   version?
   `cat /etc/os-release` — `uname -r` reports kernel version only.
