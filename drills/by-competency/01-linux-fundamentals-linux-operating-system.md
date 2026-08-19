<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Linux Fundamentals :: Linux Operating System

50 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A deployment pipeline needs the machine's instruction set architecture to pick the right container image tag. Which command reports it, using the option that reports machine hardware name specifically?

- **A.** `uname -m`, whose `-m` option reports the machine hardware name — `x86_64` or `aarch64` — the CPU instruction set the kernel was built for.
- **B.** `uname -r`, whose kernel release string identifies the platform the container image must match.
- **C.** `lscpu`, whose `Architecture:` line is the only place the system exposes the instruction set.
- **D.** `arch` and `uname -m` can disagree on the same machine, so both should be checked and reconciled manually.

**Answer: A.** `uname -m` reports the machine hardware name via its `-m` option, distinct from `-r`'s kernel release. `arch` reports the same value as a thin wrapper, so the two commands do not disagree on Linux.

- B is wrong: `-r` reports the kernel release, a version string, not the machine hardware name; it answers a different question than the one the pipeline asked.
- C is wrong: `lscpu` does report an `Architecture:` line, but it is not the only place: `uname -m` prints the machine hardware name directly, which is the field the task calls for.
- D is wrong: On Linux, `arch` is effectively a thin wrapper around the same value `uname -m` reports; assuming disagreement is possible is the guide's stated trap.

### 2.

A container image built for `linux/amd64` fails to start on a host where `uname -m` reports `aarch64`, with an unhelpful generic error. What kind of problem is this most likely to be?

- **A.** A missing kernel module for the container runtime, unrelated to the image's intended target platform entirely.
- **B.** A kernel version mismatch, since `uname` is the very command that surfaced the problem in the first place.
- **C.** The error is unrelated to architecture, since container images are built to run on any host platform by design.
- **D.** An architecture mismatch; the image's instruction set does not match the host's, not a missing dependency inside the image.

**Answer: D.** Binaries and container images are architecture-specific. `amd64` naming a target that does not match the host's `aarch64` is an architecture mismatch, not a missing dependency — recognising the symptom avoids wrong-direction debugging.

- A is wrong: Nothing in the scenario points at a missing driver; the architecture strings named — `amd64` versus `aarch64` — are what identify the actual cause.
- B is wrong: `uname -m` reports hardware architecture specifically; a kernel version mismatch would involve `uname -r`, a different field entirely.
- C is wrong: Container images and the binaries inside them are architecture-specific; one built for one instruction set will not run natively on another without emulation, which is exactly this failure.

### 3.

A batch job needs to know how many processing units are actually available to it right now, which may be fewer than the machine's physical total under a cgroup limit. Which command answers that specifically?

- **A.** `nproc`, which reports the number of processing units currently available to the calling process.
- **B.** `lscpu`, whose `CPU(s):` summary line gives the number of processing units the job can actually use.
- **C.** `free -h`, since memory and CPU limits are reported together under cgroups.
- **D.** `nproc --all` and plain `nproc` always report the same number, so either serves the purpose.

**Answer: A.** `nproc` reports processing units currently available to the calling process, which can be fewer than the physical total under cgroup or affinity constraints. `lscpu` describes the machine's overall topology instead.

- B is wrong: `lscpu` reports the machine’s CPU topology from sysfs and /proc/cpuinfo; its `CPU(s)` count does not account for a cgroup or affinity restriction on the calling process, which is what `nproc` reports.
- C is wrong: `free -h` reports memory and swap usage; it says nothing about how many processing units a process can use.
- D is wrong: `--all` counts all installed processors regardless of restriction, while plain `nproc` reports what is currently available to the caller — exactly the distinction this task needs.

### 4.

`lscpu` reports 'CPU(s): 16' on a machine with 8 physical cores and simultaneous multithreading enabled. Is 16 the physical core count?

- **A.** Yes — `lscpu`'s 'CPU(s)' line always reports physical cores regardless of any SMT or hyperthreading settings enabled.
- **B.** No. With hyperthreading, the logical processor count exceeds the physical core count; `lscpu` separates sockets, cores, and threads explicitly in its fuller output.
- **C.** The discrepancy means the machine actually has two separate CPU architectures installed side by side on one board.
- **D.** `lscpu` is reporting a fault, since the number of CPUs should always equal the physical socket count exactly, with no legitimate exceptions permitted on real hardware.

**Answer: B.** 'Number of CPUs' is ambiguous between sockets, physical cores, and logical processors — with hyperthreading, logical count exceeds physical cores. `lscpu`'s fuller output separates these explicitly, avoiding the misreading.

- A is wrong: That line reports logical processors, which include SMT threads; reading it as physical cores is exactly the misreading the guide warns about.
- C is wrong: Nothing about SMT implies multiple architectures; hyperthreading multiplies the logical count on a single architecture's physical cores.
- D is wrong: This is expected, correct behaviour for a system with SMT enabled; it is not a fault, and 'CPU(s)' was never defined to mean socket count.

### 5.

'Which desktop environment does Ubuntu use' is asked as if it has one fixed answer. What makes that framing unreliable?

- **A.** Most major distributions ship several desktop environments as installable options or spins, so the honest answer is 'whichever the specific install chose,' not a fixed mapping.
- **B.** Desktop environment choice is fixed permanently at the kernel level and cannot vary between different installs of the same distribution's official installation image at all.
- **C.** Ubuntu specifically has never offered more than one desktop environment option to install on any release.
- **D.** The question is reliable; every distribution has exactly one desktop environment it ships with by design choice, always.

**Answer: A.** A desktop environment — window manager, panel, file manager, settings, and default applications — is a coherent product whose choice is independent of the distribution. Most major distributions ship several as installable options, so a fixed distribution-to-desktop mapping does not hold.

- B is wrong: Desktop environment choice runs on top of a display server and is independent of the kernel entirely; nothing about it is fixed at that layer.
- C is wrong: Ubuntu ships official spins with different desktop environments (GNOME by default, others via spins), which is itself a counterexample to a single fixed answer.
- D is wrong: This restates the very assumption the guide flags as unreliable — most major distributions offer more than one installable desktop environment.

### 6.

A user wants to switch from GNOME to KDE Plasma on their existing installation without reinstalling the distribution. Is that generally supported?

- **A.** No — the display server itself would need reinstalling from scratch, since each desktop environment is assumed to require its own dedicated protocol underneath it.
- **B.** No — swapping desktop environments requires switching to a different distribution family entirely first, before anything else.
- **C.** Yes. Swapping desktop environments on the same distribution and display server is generally supported, since the choice is independent of the distribution.
- **D.** Yes, but only if the user also switches from CLI administration to GUI administration beforehand as a prerequisite.

**Answer: C.** A desktop environment runs on top of a display server, providing the window manager and surrounding applications. Swapping desktop environments on the same distribution and display server is generally supported, since the choice is independent of the distribution.

- A is wrong: A desktop environment runs on top of an existing display server, X11 or Wayland; it does not require reinstalling that underlying protocol layer.
- B is wrong: Distribution family concerns package manager lineage; it has no bearing on which desktop environment is installed on top of a given distribution.
- D is wrong: GUI-vs-CLI administration and desktop environment choice are separate questions; nothing about swapping environments requires changing how the system is otherwise administered.

### 7.

A new peripheral does not work. `lsmod` shows no module related to it. What is the correct next step before concluding a module needs to be loaded?

- **A.** Assume the device needs a firmware update instead, since `lsmod` never lists device firmware either way regardless of what is loaded.
- **B.** Run `insmod` directly with a guessed module filename, since it behaves identically to `modprobe` in practice for any driver.
- **C.** Check whether a suitable module exists to load with `modprobe` — but also consider that the driver might be compiled directly into the kernel, in which case it would never appear in `lsmod` at all.
- **D.** Conclude the driver is definitely absent, since `lsmod` is supposed to be a complete list of every single driver active on the system right now, with no exceptions for how a driver was originally built into the kernel image.

**Answer: C.** `lsmod` only lists loaded modules; a built-in driver never appears there even though it is active. `modprobe` loads a module and resolves dependencies automatically, unlike the more primitive `insmod`.

- A is wrong: `lsmod` not listing firmware is expected and unrelated; the immediate next step is checking for a loadable module or a built-in driver before considering firmware.
- B is wrong: `insmod` loads exactly the file given with no dependency resolution, unlike `modprobe`, which resolves dependencies automatically — the two are not interchangeable.
- D is wrong: This is precisely the mistake the guide warns against: a built-in driver is active but never appears in `lsmod`, so the list is not complete in that sense.

### 8.

Kconfig marks a hardware option `Y` at kernel build time rather than `M`. What does that mean for how its driver reaches the running system?

- **A.** The driver still ships as a `.ko` file in this case, but `modprobe` loads it automatically on every single boot without ever being asked to.
- **B.** The driver is actually firmware now, embedded in the device itself rather than anywhere in the kernel image.
- **C.** The driver is compiled directly into the kernel image and is active from boot, with no separate module to load or unload at runtime.
- **D.** `Y` is simply an older, deprecated way of marking a module that modern kernels now ignore entirely in favour of `M`.

**Answer: C.** A device driver can be built directly into the kernel image (`Y`) or as a loadable module (`M`) that attaches and detaches at runtime. A built-in driver is already part of the running kernel and has no separate module to list in `lsmod`.

- A is wrong: A `.ko` file describes a loadable module, which is what `M` produces; a `Y` marking means no separate module file exists at all.
- B is wrong: Firmware runs on the device's own controller and is a separate layer entirely; a Kconfig `Y` marking concerns kernel-side driver code, not device firmware.
- D is wrong: Kconfig's tristate option genuinely supports either compiled-in (`Y`) or module (`M`) builds; `Y` is not deprecated, and either can be the correct choice depending on the driver.

### 9.

Given `ID=fedora` in a system's `/etc/os-release`, which package manager and package format should be expected?

- **A.** `dnf`, using `.rpm` packages, since Fedora belongs to the Red Hat family.
- **B.** `apt`, using `.deb` packages, since Fedora is commonly assumed to follow the same lineage as Ubuntu.
- **C.** `zypper`, using `.rpm` packages, since Fedora and openSUSE are both `.rpm`-based.
- **D.** Whichever manager the administrator prefers, since package format is a matter of local configuration rather than distribution identity.

**Answer: A.** Fedora is in the Red Hat family, which uses `.rpm` packages and `dnf`. Package-manager questions are literal recall: given a distribution name, its family's tooling follows directly.

- B is wrong: That assumption pairs Fedora with the Debian family; Fedora is Red Hat-family and uses `dnf`, not `apt` — a pure recall failure the exam is built to catch.
- C is wrong: Sharing a package format does not mean sharing a family's tooling; `zypper` belongs to SUSE, not Red Hat, even though both use `.rpm`.
- D is wrong: Package format and manager are fixed by the distribution's family, not by local preference; installing a foreign package manager does not change what the distribution ships with by default.

### 10.

A colleague claims 'CentOS Stream is just CentOS Linux under a new name, still safe to treat as a fixed, stable release.' What is wrong with that claim?

- **A.** CentOS Stream is a rolling preview of upcoming RHEL, not a continuation of the discontinued, fixed-release CentOS Linux; Rocky Linux is the actual fixed-release replacement.
- **B.** Nothing is wrong — both are Red Hat family distributions sharing the same `dnf` package manager and `.rpm` format, so the naming difference carries no practical operational weight at all.
- **C.** The claim is wrong only about the package manager, since CentOS Stream switched to `apt` at some point during its development.
- **D.** The claim is essentially correct; 'Stream' only refers to a faster update channel within that same fixed-release product line.

**Answer: A.** CentOS Stream is not CentOS Linux — it is a rolling preview of upcoming RHEL, not the discontinued fixed-release CentOS Linux. Rocky Linux exists specifically as CentOS Linux's downstream, fixed-release replacement.

- B is wrong: Sharing a family's tooling does not make two products interchangeable; release stability and support model differ sharply between a rolling preview and a fixed release.
- C is wrong: CentOS Stream remains `.rpm`/`dnf`-based, staying within the Red Hat family; the package manager was never the issue with the claim.
- D is wrong: This restates the misconception rather than correcting it — Stream previews upcoming RHEL and is not the discontinued fixed-release CentOS Linux at all.

### 11.

A variable is set with `MYVAR=value` in an interactive shell. `echo $MYVAR` shows the value, but a script the shell then runs cannot see it at all. Why, and which command would have fixed it?

- **A.** `env` was not run first, and running it would have exported every current shell variable automatically for the script.
- **B.** The script uses a different PATH, which prevented it from finding the variable's value anywhere in that path.
- **C.** Interactive shells and scripts are always supposed to share the exact same variables automatically, so an outcome like this one should genuinely never be possible in the first place.
- **D.** It was never exported, so it is a shell variable rather than an environment variable and is not inherited by child processes; `export MYVAR` before running the script would fix it.

**Answer: D.** A shell variable becomes an environment variable only once exported; from that point every child process the shell forks receives a copy. `echo $MYVAR` sees the un-exported variable in the same shell, but a script forked as a child process does not.

- A is wrong: `env` only prints, or runs a command with, the current environment; it does not export anything itself, and un-exported shell variables never appear in its output.
- B is wrong: PATH governs how bare command names resolve to executables; it has no bearing on whether a variable is inherited by a child process.
- C is wrong: Inheritance is one-directional and copy-based, and only exported variables are copied into a child process's environment at all — this is expected behaviour, not a fault.

### 12.

Someone wants to see every environment variable currently exported in their session, without printing un-exported shell variables mixed in. Which command gives exactly that?

- **A.** `env`, run with no arguments, which prints only exported environment variables.
- **B.** `echo $HOME`, since it prints an environment variable and can simply be repeated for each one.
- **C.** `export MYVAR`, since naming a variable with `export` prints that variable’s exported value back.
- **D.** Any shell variable that has ever been referenced with `$` automatically shows up in `env` output.

**Answer: A.** `env`, run with no arguments, prints the current environment — exported variables only, not un-exported shell variables. `echo` prints a single named value rather than enumerating the environment.

- B is wrong: `echo $HOME` prints one specific variable's value; it does not enumerate the full set of exported variables the way `env` does.
- C is wrong: `export NAME` marks the named variable for export and prints nothing; it is bare `export` or `export -p` that lists exported names, and `env` that prints the environment itself.
- D is wrong: Referencing a variable with `$` only reads its current-shell value; it does not export it, and un-exported variables are absent from `env`'s output regardless of how often they were referenced.

### 13.

An administrator wants live CPU information and runs `cat /proc/cpuinfo` rather than a dedicated tool. What Unix design principle makes that command meaningful?

- **A.** Multi-user isolation, since `/proc/cpuinfo` is scoped separately per logged-in user session, the way a user's own files and settings normally are.
- **B.** The kernel-space/user-space boundary, since crossing it is what makes `cat` able to read kernel data at all, regardless of where that particular data happens to physically live on disk.
- **C.** `/proc/cpuinfo` is a regular text file the kernel writes to disk at boot and never touches again, the same as any other static configuration file.
- **D.** Everything is a file: devices, sockets, and kernel state are exposed through the same filesystem interface used for ordinary files, so `cat` can read them like any other path.

**Answer: D.** The kernel presents devices and interfaces as special file types, alongside pseudo-filesystems like `/proc` and `/sys`, using the same open/read/write/close calls as ordinary files. That is why so many 'how do I check X' answers reduce to reading a path.

- A is wrong: `/proc/cpuinfo` reports machine-wide hardware facts and is not a per-user isolated resource; multi-user isolation is a different design property.
- B is wrong: That boundary explains why a system call is needed at all; it does not explain why the data is reachable at a filesystem path in the first place, which is the file-abstraction principle.
- C is wrong: It is a pseudo-file backed by live kernel state, generated on read rather than stored on disk, which is why it always reflects current information.

### 14.

Which pair of paths best illustrates that devices and ordinary data are reached through the same interface on Linux?

- **A.** `/etc/passwd` and `/etc/shadow`, since both concern user account information specifically and sit in the same configuration directory.
- **B.** `/dev/sda` for a disk device and `/home/user/notes.txt` for a document, both opened, read, and written with the same system calls.
- **C.** `/proc/cpuinfo` and `lscpu`'s output, since both ultimately describe the same CPU information in slightly different formats.
- **D.** Any two paths under `/etc`, since configuration files are the clearest example 'everything is a file' offers to a new user.

**Answer: B.** The principle's force is in unifying access to things that are not intuitively files — a disk device, a socket, live kernel state — with ordinary files, all reached through open/read/write/close. Pairing a device path with a document file shows that unification directly.

- A is wrong: Both are ordinary configuration files; the pairing says nothing about devices being reached through the file interface, which is what the principle is about.
- C is wrong: One is a path and the other is a command's formatted output; comparing them does not illustrate the file-interface principle, only that a tool can read that path.
- D is wrong: Ordinary configuration files were always files; the principle is specifically about non-file things — devices, sockets, kernel state — being exposed the same way, not about configuration.

### 15.

A new peripheral is detected by the kernel and its driver module loads successfully, but the device still does not function correctly. Loading the module again changes nothing. What layer might still be at fault?

- **A.** The kernel module itself, since simply reloading it again with slightly different options would eventually resolve any remaining fault it still has.
- **B.** The shell used to run `modprobe`, since different shells are widely believed to load kernel modules differently.
- **C.** Nothing further is possible to fix from the OS side or the device side; a successfully loaded driver means the OS's job here is fully done.
- **D.** The device's own firmware, low-level software embedded in the device itself, distinct from and running independently of the operating system.

**Answer: D.** Firmware is low-level software embedded in a device, distinct from the operating system above it. A driver operates the device from the OS side; if the device's own embedded software is missing or out of date, no module load fixes it — that is a separate firmware-update process.

- A is wrong: The scenario states the module already loaded successfully and reloading changes nothing; the driver having loaded correctly is what points elsewhere, toward firmware.
- B is wrong: Module loading is a kernel operation performed identically regardless of which shell invoked `modprobe`; the shell is not a plausible fault layer here.
- C is wrong: A loaded driver only means the kernel's side of talking to the device is working; the device's own firmware is a separate layer that can still be at fault.

### 16.

A colleague says their laptop 'runs Linux' and separately that it 'runs GNU/Linux.' Are those two statements necessarily equivalent?

- **A.** Yes — the kernel is the only component that genuinely matters here, so any userland running on top of it counts as GNU regardless of where that userland actually came from or who originally wrote it.
- **B.** No. 'Linux' names the kernel alone and is always accurate wherever that kernel runs; 'GNU/Linux' names that kernel specifically paired with a GNU userland, which not every Linux system has.
- **C.** No, but only because GNU refers to a licensing status rather than an actual body of software anyone can point to.
- **D.** Yes, since the Linux Foundation requires every certified Linux distribution to ship a GNU userland as a condition of certification.

**Answer: B.** Linux, strictly, is the kernel Linus Torvalds began in 1991. Most Linux userlands trace to the GNU Project, which is why the pairing is sometimes called GNU/Linux — but not every Linux system has a GNU userland, so the two phrases are not interchangeable.

- A is wrong: The kernel is one component; the userland running above it is a separate choice, and Android's Bionic userland shows it need not be GNU at all.
- C is wrong: GNU names a concrete body of software — the compiler, shell, and core utilities from the GNU Project — not merely a license category.
- D is wrong: No such requirement exists, and the Linux Foundation does not control userland composition; GNU/Linux describes an actual pairing that some systems, like Android, do not have.

### 17.

What did the GNU Project supply before the Linux kernel existed, and what was it still missing?

- **A.** A compiler, a shell, core utilities, and most of the GPL licensing framework — everything except a free kernel of its own, which Linux later filled.
- **B.** A complete operating system including its own kernel, which Linux later replaced for better overall performance.
- **C.** A package manager and release policy, which every GNU/Linux distribution still relies on today for updates.
- **D.** Nothing substantial — GNU contributed little more than a name before Linux ever arrived, with essentially no working software behind it at that point.

**Answer: A.** GNU, begun in 1983, supplied the compiler, shell, core utilities, and most of the license framework years before Linux existed in 1991. It lacked only a free kernel, which the Linux project filled — hence GNU/Linux for the combination.

- B is wrong: GNU had no working free kernel at that point — it had started one, the GNU Hurd, but that kernel did not run reliably until 2001 — so Linux filled a gap rather than replacing a functioning GNU kernel.
- C is wrong: Package managers and release policies are distribution-level decisions, not something the GNU Project itself supplied historically.
- D is wrong: GNU supplied the compiler (GCC), the shell, core utilities, and the GPL years before Linux existed, which is why the pairing became so natural once a kernel was available.

### 18.

A team debates whether a new internal tool, running exclusively on headless cloud servers and administered over SSH, needs a GUI. What is the strongest justification for defaulting to CLI here?

- **A.** No display server or desktop environment needs to run, saving memory and CPU the server has no other use for, and CLI output can be piped and scripted for automation.
- **B.** The shell itself cannot run a GUI application under any circumstances, so CLI is therefore claimed to be the only option technically available on the machine in this situation at all.
- **C.** A headless server has no terminal available, so CLI administration is not actually possible on it either, in that case.
- **D.** Servers can never run a GUI at all, regardless of configuration, which settles the debate outright either way immediately.

**Answer: A.** A CLI session needs only a shell and a terminal or SSH connection — no display server or desktop environment, which would otherwise consume memory and CPU the server has no other use for. CLI is also scriptable and remotable in ways a GUI is not.

- B is wrong: GUI versus CLI names the interface paradigm as a whole; the shell is a specific CLI-side program and its existence does not by itself rule out a GUI running elsewhere on the machine.
- C is wrong: A CLI session needs only a shell and a terminal, or an SSH connection carrying one — no display server required, which is exactly why CLI works on a headless machine.
- D is wrong: A GUI can run on a server if a display server and desktop stack are installed; the real justification is cost and scriptability, not technical impossibility.

### 19.

Are 'GUI vs CLI' and 'shell vs terminal' the same distinction asked two different ways?

- **A.** Yes — a shell is simply treated as the CLI equivalent of a GUI, so comparing shell to terminal is really the same comparison stated again in different words entirely.
- **B.** No, but only because GUIs never involve a terminal of any kind whatsoever, under any circumstances.
- **C.** No. GUI vs CLI names the interface paradigm as a whole, graphical or text-based; shell and terminal are both specifically components on the CLI side of that split.
- **D.** Yes, since both comparisons ultimately ask whether the interface requires its own dedicated display server to run.

**Answer: C.** GUI vs CLI names the interface paradigm as a whole. Shell and terminal are both specifically CLI-side components — one interprets, the other displays — so the two comparisons operate at different levels, not as restatements of each other.

- A is wrong: A shell interprets commands; a terminal displays them — both are CLI-side components, neither of which is 'the GUI equivalent' of the other.
- B is wrong: A terminal is specifically a CLI-side component; its absence from GUI administration is consistent with the level distinction, but is not itself the reason the two comparisons differ.
- D is wrong: Shell vs terminal has nothing to do with a display server; that question only arises on the GUI side of the broader GUI-vs-CLI split.

### 20.

A process is run with `sudo` and therefore executes as root. Does that process now run in kernel space?

- **A.** Yes — root has no permission checks applied to it, and having no permission checks is exactly what kernel space means, since nothing is left to restrict what it can touch.
- **B.** Root is a user-space account privilege, so no; the process still runs in the CPU's restricted execution mode and must still cross a system call to reach the kernel.
- **C.** Yes — running as root places the process in the kernel's own address space, so it can reach kernel memory directly without going through a system call.
- **D.** It depends on the distribution, since some distributions grant root direct kernel-mode execution by default configuration, unlike the more restrictive ones that do not.

**Answer: B.** Kernel space and user space name a CPU-enforced privilege boundary, not a Unix permission level. A root process still runs in user space; it simply has fewer permission checks applied to it there. Only a system call crosses into kernel space, and even then it is the kernel executing, not the calling process itself.

- A is wrong: Fewer permission checks are not the same as a different CPU privilege ring; kernel space names that ring, which root does not enter merely by holding elevated rights.
- C is wrong: Every user-space process, root included, runs in its own address space with kernel memory unreachable from it; that is why even a root process must issue a system call to have the kernel act on its behalf.
- D is wrong: This is a CPU-level distinction with no distribution-specific variation; no mainstream Linux distribution grants a user-space process direct kernel-mode execution.

### 21.

A process attempts to read another process's memory directly, without going through any kernel-provided interface. What stops it, and at what level?

- **A.** The kernel's file permission checks, which reject the read once the attempted access is evaluated against them, the same way any ordinary file read would be checked.
- **B.** The CPU itself: ordinary processes run in a restricted privilege ring that cannot address arbitrary memory, so the attempt fails at the hardware level before any software policy is even consulted.
- **C.** The kernel process itself, which notices the read and terminates the offending process the way a device driver would when it detects unauthorised hardware access.
- **D.** Nothing at the hardware level — this is purely a software convention that a sufficiently privileged process can simply bypass by asking the kernel nicely enough.

**Answer: B.** The CPU provides hardware privilege levels; ordinary processes run in a restricted one and cannot execute privileged instructions or touch arbitrary memory directly. A process must ask the kernel through a system call, and the CPU — not a software policy alone — enforces that boundary.

- A is wrong: File permissions govern access to filesystem paths; reading another process's memory directly is not a file operation and is blocked before any such check applies.
- C is wrong: This is not a driver-level enforcement mechanism; it is the CPU's privilege-ring architecture that makes the memory unreachable in the first place.
- D is wrong: The guide is explicit that CPU privilege rings enforce this, not software convention alone; that is what makes the boundary meaningful rather than advisory.

### 22.

Which single component is directly responsible for scheduling processes onto the CPU, managing memory, and enforcing the permission boundary between them?

- **A.** The operating system in general, since 'kernel' is simply informal shorthand people use for the same broader system, the way 'Windows' and 'PC' get used interchangeably.
- **B.** The kernel, being the privileged core that performs scheduling, memory management, and permission enforcement itself, with everything else built above it.
- **C.** The distribution's init system, since it is the first process started and therefore owns the machine's resources from that point on, ahead of anything the kernel itself does.
- **D.** Whichever shell the administrator is currently using, since shell commands are what visibly control processes on the machine and appear to issue every instruction directly.

**Answer: B.** The kernel schedules the CPU across processes, manages memory, drives devices, and enforces the permission model. Every other concept in this competency ultimately routes through it, which is why 'what actually does X' questions resolve to the kernel even when the wording says 'Linux' or 'the OS.'

- A is wrong: The operating system is the broader layer the kernel belongs to; the kernel is its privileged core, not an interchangeable label for it.
- C is wrong: An init system is an ordinary userspace process the kernel starts and schedules like any other; it does not itself perform scheduling or memory management.
- D is wrong: A shell only requests process control through system calls; the kernel is what actually performs the scheduling and enforcement behind that request.

### 23.

An administrator needs the exact release string of the running kernel — the number that would let them check whether a specific driver bug fixed upstream is present on this machine. Which command reports it?

- **A.** `uname -a`, which prints every available field including the kernel release among several others.
- **B.** `cat /etc/os-release`, which reports the running system's version.
- **C.** `uname -r`, which prints the kernel release specifically.
- **D.** `lsmod`, which lists what is currently loaded into the running kernel.

**Answer: C.** `uname -r` prints only the kernel's own release string. `uname -a` also includes it but mixed with unrelated fields, and `cat /etc/os-release` answers a different question entirely — distribution identity, not kernel version.

- A is wrong: It contains the release string but buries it among hostname, architecture, and build-date fields the task did not ask for; `-r` isolates the one field needed.
- B is wrong: That file reports distribution identity, not kernel version; assuming it reports the kernel is the exact mistake the guide's own trap describes.
- D is wrong: `lsmod` shows loaded modules, not a version string, and would not answer a question about which kernel release is running.

### 24.

A script needs to identify which distribution it is running on before choosing between `apt` and `dnf`. Which command reads the machine-readable identity file for that purpose?

- **A.** `uname -r`, which reports the running kernel version so the script can infer the distribution from that number.
- **B.** `uname -a`, which prints a full summary line ending with the operating system name.
- **C.** `cat /etc/os-release`, which prints the standard distribution identity file every installed system carries.
- **D.** `lsblk`, which lists the disks the distribution's files happen to be installed on.

**Answer: C.** `/etc/os-release` is the standard, machine-readable file carrying a distribution's identity. `uname -r` answers a different question — kernel version — which the guide's own trap warns against confusing with distribution identity.

- A is wrong: `uname -r` reports only the kernel release; the kernel version does not by itself identify which distribution is installed.
- B is wrong: It can include an OS name field on some builds, but it does not report the distribution's specific identity the way `/etc/os-release` does.
- D is wrong: Block device listings say nothing about which distribution is installed; they describe storage, not software identity.

### 25.

'Which distribution is this' and 'which distribution family is this' are asked about the same server. Do they expect the same answer?

- **A.** Yes — a kernel version determines both the distribution and its family identically, since the exact same kernel build is assumed to ship inside every distribution that uses it at all.
- **B.** No, but only because Arch has no family at all, unlike every other Linux distribution currently in wide use today.
- **C.** No real distinction exists; 'distribution' and 'family' are used interchangeably even in careful technical writing about Linux systems.
- **D.** No, since the distribution names one specific installable system (for example Ubuntu 24.04), while the family names the packaging lineage it shares with others (the Debian family).

**Answer: D.** A distribution is one specific product a person installs. A family is the packaging lineage several distributions share. RHEL and Fedora being 'different distributions in the same family' only makes sense once that distinction is held separately.

- A is wrong: Kernel version identifies neither a distribution nor its family on its own; the kernel is one component shared across an entire family.
- B is wrong: Arch does belong to a family — its own, built around `pacman` and a rolling model — so this is not the reason the two questions diverge.
- C is wrong: The exam tests this precisely because they are not interchangeable — RHEL and Fedora are different distributions in the same family, which only makes sense if the terms differ.

### 26.

Who sets the Linux kernel's technical direction, and what role does the Linux Foundation actually play in that?

- **A.** Torvalds and the kernel's maintainer hierarchy set technical direction; the Linux Foundation supplies the technical, financial and staffing support behind the project's infrastructure, an organisational role rather than a technical one.
- **B.** The Linux Foundation sets technical direction, since its name appears on the certification program and it directly employs a large number of the kernel's most active and visible contributors working on it today.
- **C.** Torvalds alone personally decides every single patch that merges, without any maintainer hierarchy standing beneath him at any level of the project.
- **D.** A vote among major distribution vendors decides technical direction, coordinated entirely through the Foundation's regular meetings.

**Answer: A.** Kernel development runs through a maintainer hierarchy escalating to Torvalds. The Linux Foundation provides infrastructure, funding, and trademark stewardship — sponsorship and hosting, not technical governance.

- B is wrong: Employing contributors and lending its name to a certification are sponsorship activities; the Foundation does not decide which patches merge or set the kernel's direction.
- C is wrong: Subsystem maintainers review and merge the vast majority of patches, escalating disputed changes upward; Torvalds is the top of a hierarchy, not the sole reviewer.
- D is wrong: The Foundation provides neutral ground for vendors to collaborate, but kernel technical decisions run through the maintainer hierarchy, not a vendor vote.

### 27.

In what year, and in what capacity, did Linus Torvalds begin the Linux kernel?

- **A.** 1991, as an official Linux Foundation project from its founding.
- **B.** 1983, as part of the GNU Project's effort to build a complete free Unix-like system.
- **C.** The exact year is disputed, since the kernel's development predates any reliable public record.
- **D.** 1991, as a free Unix-like kernel he then developed openly with a growing contributor base.

**Answer: D.** Torvalds began the Linux kernel in 1991 as a free Unix-like kernel, developing it openly with a large contributor base ever since — years before the Linux Foundation existed to sponsor it.

- A is wrong: In 1991 the kernel was Torvalds's own project, released under his personal copyright notice; the Linux Foundation came later and took a sponsoring role once the project was already established.
- B is wrong: 1983 belongs to the GNU Project's beginnings, not to Linux; GNU had assembled the whole system apart from a kernel by the early 90s, and that is the gap Linux filled.
- C is wrong: 1991 is well documented and not in dispute; the kernel's early history is one of the better-recorded parts of its story.

### 28.

A production database server must not have package behaviour shift unexpectedly underneath a running service. Which release policy fits that requirement, and why?

- **A.** A rolling release, because it always runs the newest software and therefore carries the fewest known bugs at any given time.
- **B.** Whichever release the distribution family recommends, since family and release policy amount to one single decision.
- **C.** Rolling releases also freeze versions, they just do it more frequently, so either policy satisfies the requirement equally well over a long enough window.
- **D.** An LTS release, because its package versions stay frozen after release and only security-relevant patches are backported into those same versions.

**Answer: D.** LTS releases freeze a version and backport only security and bug fixes for a fixed window; rolling releases ship every update continuously with no freeze at all. For a production system where shifting behaviour is the bigger risk, LTS is the safer choice.

- A is wrong: Newest is not safest for a running service — rolling releases update continuously, which is exactly the shifting behaviour the requirement rules out.
- B is wrong: Release policy is a separate axis from family; Ubuntu, in the Debian family, still offers both an LTS and a non-LTS track.
- C is wrong: A rolling release has no freeze at all — updates flow continuously with no single version to point to — which is the opposite of what the requirement asks for.

### 29.

What is the practical cost a team accepts by choosing a rolling release over an LTS release?

- **A.** A shorter support window before the distribution stops receiving any updates whatsoever, forcing a much earlier reinstall than an LTS user would ever expect.
- **B.** A different package manager than the one the distribution family would normally use for its releases.
- **C.** None — rolling releases are strictly an improvement on LTS with no offsetting cost at all worth mentioning.
- **D.** More frequent, active maintenance; updates arrive continuously, and the team must absorb behaviour changes as they land rather than on a scheduled cadence.

**Answer: D.** Rolling releases ship continuously with no version to freeze, trading stability for currency. That currency has to be actively managed, which is the real cost against an LTS track that changes only on a scheduled, security-focused basis.

- A is wrong: Support windows and end-of-life dates are an LTS-track concept; a rolling release has no comparable fixed support window to fall short of.
- B is wrong: Release policy does not change which package manager a distribution uses; Arch's `pacman` is tied to the distribution, not to being a rolling release.
- C is wrong: The guide frames this explicitly as a trade-off, not a strict improvement: currency is gained at the cost of stability and maintenance burden.

### 30.

Two different users are logged into the same server at once, each running a process with the identical program name. Why does this not cause a conflict?

- **A.** The shell renames one of the two processes automatically to avoid any naming collision between them at the operating-system level.
- **B.** Each user is confined to a separate kernel running in its own lightweight container on the host, fully isolated from every other logged-in user's kernel instance.
- **C.** Only one of the two processes can actually be running at a time; the OS silently queues the second behind it until the first one exits.
- **D.** The kernel schedules and owns each process separately, keeping their memory and permissions apart regardless of which program name either one happens to share.

**Answer: D.** Linux is designed to run many users and many processes concurrently, each isolated from the others by the kernel. Process ownership and permission checks are what let identically named processes coexist safely, whoever launched them.

- A is wrong: Shells do not rename running processes to avoid collisions; process identity is tracked by process ID, not by program name uniqueness.
- B is wrong: Standard multi-user Linux runs one kernel shared by all logged-in users; per-user kernel isolation is not what makes this scenario safe.
- C is wrong: Both processes genuinely run concurrently, time-sliced across the CPU; neither is silently queued behind the other.

### 31.

A user sends a termination signal intending to stop their own runaway process, but a colleague's identically-named process is also running on the shared server. What design guarantees the signal reaches only the intended process?

- **A.** The multi-user, multitasking design: process ownership and permission checks mean a signal from one user cannot reach another user's process by default, regardless of shared program names.
- **B.** The shell resolves the signal target by matching PATH first, so it always finds the sender's own binary to signal instead of anyone else's.
- **C.** Signals are addressed to a program name rather than a process ID, so ownership never enters into it at any point in the delivery process.
- **D.** Nothing guarantees this; two identically named processes running under different users on the same shared server are a known race condition that occasionally kills the wrong one without warning.

**Answer: A.** Every permission model in this domain rests on the assumption that many users and processes run concurrently, isolated by the kernel. Process ownership — not the program's name — is what a signal's permission check is actually evaluated against.

- B is wrong: PATH resolves command names to executables when launching a program; it plays no role in routing a signal to an already-running process.
- C is wrong: Signals target a specific process ID, and the kernel's ownership check on that ID — not the program's name — is what prevents cross-user interference.
- D is wrong: This is exactly the assumption the multi-user design is built to prevent: ownership and permission checks, not naming, determine which process a signal can reach.

### 32.

Under exactly which license terms is the Linux kernel released?

- **A.** MIT, chosen specifically to make commercial redistribution far simpler for vendors than the copyleft terms of the GPL would otherwise allow.
- **B.** GPLv2 only — not 'GPLv2 or later' — which is why the exact clause is worth holding separately from other GPL-licensed software.
- **C.** GPLv2 or later, matching the clause used by most other GNU Project software packages and tools.
- **D.** Whatever license the distribution packaging it chooses to apply on top of it during packaging.

**Answer: B.** The kernel is released under GPLv2 only, not the more common 'GPLv2 or later' clause. This is why distributions may copy, modify, and redistribute it, provided redistributions stay under that same license.

- A is wrong: The kernel is not MIT-licensed; MIT is a permissive license and does not carry the GPL's copyleft requirement the kernel actually operates under.
- C is wrong: The kernel deliberately uses GPLv2 only, not the 'or later' clause common elsewhere in GNU software — this is the specific fact the concept tests.
- D is wrong: A distribution cannot override the kernel's own license; userland tools bundled alongside it may carry different licenses individually, but the kernel itself stays GPLv2.

### 33.

A company wants to redistribute a modified version of the Linux kernel as part of a commercial appliance. What does GPLv2 require of them?

- **A.** Nothing — GPLv2 permits silent commercial redistribution with no source obligation attached whatsoever, unlike stricter copyleft licenses.
- **B.** They must switch the derivative to a permissive license before selling it, since GPLv2 forbids commercial use outright by design.
- **C.** The redistributed derivative must also be licensed under GPLv2, and the corresponding source code must be made available to recipients.
- **D.** They must contribute the change back to the upstream kernel project before shipping the appliance at all.

**Answer: C.** GPLv2 is copyleft: anyone may run, study, modify, and redistribute the code, but a redistributed derivative must also be licensed under GPLv2 with source made available to recipients. Commercial use is permitted; the obligation is about license and source, not about selling.

- A is wrong: GPLv2 is copyleft precisely because it does impose a source-availability obligation on redistribution, unlike a permissive license that would not.
- B is wrong: GPLv2 explicitly permits commercial redistribution; it does not forbid selling the software, it only requires the derivative to remain under GPLv2 with source available.
- D is wrong: GPLv2 requires making source available to recipients of the redistribution; it does not require contributing changes back to any upstream project.

### 34.

An exam option must be assigned to either 'the kernel' or 'the operating system': providing the full set of interfaces — system calls, plus the libraries and services built on top of them — that lets an application avoid addressing hardware directly. Which is the more precise assignment?

- **A.** The operating system, because it is the kernel plus the userspace services and libraries built on it, and that whole layer is what supplies the complete set of interfaces.
- **B.** The kernel, because it is the component that actually schedules the CPU and enforces permissions, so it must also be the source of every interface an application calls.
- **C.** The distribution, because its package manager installed the libraries the application links against, and whichever component installs a piece of software becomes the layer that interface belongs to.
- **D.** Neither term applies cleanly, since applications on Linux address hardware directly once a device file has been opened, with the device file itself standing in for any further mediating software layer.

**Answer: A.** The operating system is the full software layer — kernel plus userspace services and libraries — that intercepts every request an application makes so it need not address hardware directly. The kernel is that layer's most privileged component, not a synonym for the whole of it; treating the two as interchangeable is the exact trap this pairing is built to test.

- B is wrong: The kernel performs the privileged work behind a system call, but libraries and services built above it — part of the OS, not the kernel — supply most of what an application actually calls.
- C is wrong: Installing a library is a packaging concern; it does not make the distribution the layer that mediates hardware access at runtime.
- D is wrong: Opening a device file still goes through kernel-mediated system calls; a program never gains direct hardware access merely by holding an open file descriptor.

### 35.

A text editor writes a saved file to disk without containing any code specific to the make or model of the installed disk controller. What makes that possible?

- **A.** The everything-is-a-file principle, which lets the editor open the controller's device path directly instead of going through any intermediary layer, since a file path is already a direct handle.
- **B.** A driver written specifically for that exact controller model was compiled into every Linux kernel in advance, so the editor links against that driver's interface directly rather than a general one.
- **C.** The operating system mediates the request: the editor calls a general save interface, and the layer beneath translates that into the specific low-level operations the installed controller requires.
- **D.** Modern disk controllers expose a single standardised interface, so no operating-system abstraction is actually needed to write to one, since the hardware itself already presents a uniform API.

**Answer: C.** Applications never touch hardware directly. They call OS-provided interfaces, and the OS — kernel plus the services above it — translates that call into whatever the specific installed hardware needs. That indirection is the entire point of the layer.

- A is wrong: Everything-is-a-file explains how devices are reached through the filesystem namespace; it does not remove the mediating layer the request still passes through.
- B is wrong: Drivers are controller-specific, but the editor never talks to one directly; it calls a general interface that the OS routes onward.
- D is wrong: Controllers still vary enough that a driver is required underneath; the standardisation happens at the OS's interface layer, not by eliminating the need for one.

### 36.

A program was just installed to `/opt/tool/bin/tool`, but typing `tool` reports 'command not found' even though the file exists and is executable. What is the most likely cause, and what confirms it?

- **A.** `/opt/tool/bin` is missing from PATH; `echo $PATH` would show the directory absent, and PATH is searched left to right for the first match on a bare command name.
- **B.** The file must actually be corrupted, since `which tool` reporting nothing found always means the binary itself is broken somehow.
- **C.** The shell needs to be restarted entirely, since PATH is believed to be fixed permanently at login time and never re-read afterward at all, under any circumstances whatsoever.
- **D.** PATH is searched right to left, so a later directory's match should have been found first regardless of the order it was listed in.

**Answer: A.** 'Command not found' for a genuinely installed program is almost always a PATH problem: the installing directory is missing from PATH. `echo $PATH` confirms it, and PATH is searched left to right for the first match.

- B is wrong: `which` reports nothing found when a directory is missing from PATH just as readily as when a file is broken; PATH is the far more common cause and should be checked first.
- C is wrong: PATH can be updated within a running shell session by exporting a new value; a restart is not required to fix a PATH omission, only re-exporting or reloading the relevant config.
- D is wrong: PATH is searched left to right, with the first match winning; this scenario is about a directory being absent entirely, and the search order itself would not rescue a missing entry.

### 37.

`which mycmd` reports nothing found, but typing `mycmd` at the prompt runs successfully. Which command would reveal what `mycmd` actually is, including cases `which` cannot see?

- **A.** `which -a mycmd`, since adding `-a` extends `which` to also search shell builtins and aliases directly.
- **B.** `type mycmd`, which reports how a name would be interpreted — builtin, alias, function, or file — seeing categories the external `which` cannot.
- **C.** `echo $PATH`, since reading the full search list would reveal exactly where `mycmd` is hiding on disk.
- **D.** Nothing else needs checking here — `which` finding nothing means `mycmd` does not actually exist as any kind of runnable command at all, in any form.

**Answer: B.** `which` only searches PATH for external executables and has no visibility into shell builtins or aliases. `type` reports more generally what a name resolves to — builtin, alias, function, or file — which is why it succeeds where `which` reports nothing found.

- A is wrong: `-a` only lists every PATH match for an external command; it does not extend `which`'s visibility to builtins or aliases, which stay outside its scope entirely.
- C is wrong: If `mycmd` is a builtin or alias, it has no file on PATH at all to be found by reading the list; PATH inspection would not resolve this case.
- D is wrong: The command visibly ran, so it exists in some form; `which` finding nothing only means it is not an external file on PATH, which `type` can still identify.

### 38.

`free -h` shows a small 'free' figure and a large 'used' figure on a server that feels fine. Which column should actually be trusted to judge whether the system is memory-constrained?

- **A.** 'free', since it is treated as a persistent block device figure and therefore the single most reliable measure of headroom available anywhere on the running system.
- **B.** 'used', since a large 'used' figure always means the system is close to the OOM killer no matter the surrounding context.
- **C.** None of the columns matter; only `uptime`'s load average actually determines memory pressure on a running system.
- **D.** 'available', which estimates what a new process could actually get, correctly accounting for reclaimable cache that the raw 'free' column does not credit back.

**Answer: D.** The kernel uses otherwise-idle RAM as disk cache, so the raw 'free' column looks low even when memory is not actually constrained. `free`'s 'available' column is the one that estimates real headroom for a new process.

- A is wrong: 'free' is a RAM figure, not a storage-device one, and it is exactly the column the guide warns against trusting for pressure judgements.
- B is wrong: `free` calculates `used` as total minus available, so it does already exclude reclaimable memory, but a large `used` value on its own does not establish that the system is near an OOM kill.
- C is wrong: Load average measures CPU contention, not memory state; `free`'s own columns are what is needed to judge memory pressure specifically.

### 39.

A process's memory usage keeps climbing until it is abruptly terminated with no warning in its own logs. What kernel mechanism most likely explains the termination?

- **A.** Swap exhaustion causing the storage device holding the swap file to fail outright.
- **B.** The scheduler deprioritising the process until it starves of CPU time entirely.
- **C.** The out-of-memory (OOM) killer, invoked under severe memory pressure to reclaim RAM by terminating a process.
- **D.** Processes on Linux are never terminated by the OS itself; this must have been an explicit `kill` from another user.

**Answer: C.** When RAM is exhausted, the kernel either swaps pages to disk, slowing sharply, or under severe pressure invokes the OOM killer to terminate a process and reclaim memory — which explains an abrupt termination with no corresponding application-level warning.

- A is wrong: Swap running low slows the system by paging heavily; it does not itself terminate a process the way the OOM killer does.
- B is wrong: Starving for CPU time causes slowness, not termination; only the OOM killer actually ends a process to reclaim memory.
- D is wrong: The OOM killer is a real, kernel-initiated termination mechanism specifically for reclaiming memory under pressure, distinct from any user-issued signal.

### 40.

A user wants to confirm, from inside their current session, which program is configured as their login shell. Which command reports it?

- **A.** `echo $SHELL`, which prints the shell variable holding the user's configured login shell.
- **B.** `echo $PATH`, which lists the shell's search directories including the one holding the shell binary.
- **C.** `lsblk`, which lists the block devices the shell's history file is stored on.
- **D.** `echo $0`, which prints the name of the shell program the user is talking to at this prompt.

**Answer: A.** `echo $SHELL` prints the configured login shell. It is worth knowing this can diverge from the shell actually executing a given command, since `$SHELL` is not updated when a different shell is launched interactively.

- B is wrong: PATH lists directories to search for commands; it does not itself name which program is the user's configured shell.
- C is wrong: Block devices are unrelated to which interpreter is configured as a login shell.
- D is wrong: `$0` names the shell that is currently running, which need not be the login shell configured for the account — bash(1) defines SHELL as "the full pathname of the current user's login shell", which is what the question asks for.

### 41.

Running `which cd` reports nothing found, yet typing `cd /tmp` at the same prompt works without error. What explains the mismatch?

- **A.** The terminal is caching the previous command's output and never actually ran `which cd` at all, which is why nothing new appeared on screen.
- **B.** PATH is misconfigured and missing the directory that would normally contain the `cd` executable, since every runnable command needs a directory entry somewhere on that list.
- **C.** `cd` is a shell builtin with no standalone binary on PATH, so the external `which`, searching only PATH, finds nothing, even though the shell itself executes it directly.
- **D.** `which` is broken on this system, since it should be able to find every command that actually runs successfully, builtin or not.

**Answer: C.** Some commands, `cd` among them, are shell builtins with no standalone binary on a Linux system. The external `which` only searches PATH, so it correctly reports nothing found for a builtin even though the shell itself runs it directly.

- A is wrong: The terminal only renders input and output; it does not cache or intercept command execution, so this does not explain the result.
- B is wrong: No directory ever contains a `cd` binary on a standard system, because `cd` is a builtin rather than an installed executable; PATH is not the issue.
- D is wrong: `which` is working as designed; it deliberately only searches PATH for external executables and has no visibility into shell builtins by design.

### 42.

`lsblk` output shows `sda` as a parent row with `sda1` and `sda2` indented beneath it. Treating `sda1` as if it were the entire disk, what mistake follows?

- **A.** Assuming the stored data will be permanently lost on the next reboot, since only volatile RAM contents are ever known to reset in that particular way.
- **B.** Acting on the wrong device; `sda1` is one partition of the whole disk `sda`, and operations meant for the full disk would then target only part of it.
- **C.** Believing the filesystem type is always ext4 unless `-f` is explicitly passed as a flag to `lsblk`.
- **D.** No real mistake follows, since `sda` and `sda1` always hold exactly identical data at every point in time.

**Answer: B.** `lsblk` presents whole disks as parents and partitions as children in its hierarchy. Treating a partition row like `sda1` as the whole disk `sda` means acting on the wrong device — a common, testable misreading.

- A is wrong: Reboot data loss is a property of volatile RAM, not of a storage partition; `sda1` persists across reboots like any other block device.
- C is wrong: `-f` reveals filesystem type and UUID, which are absent from the default columns, but that omission is a different mistake than confusing a partition with its parent disk.
- D is wrong: A partition and its parent disk are not identical; the parent spans the whole device while a partition is one region of it, so operations differ in scope.

### 43.

A monitoring dashboard shows both 'RAM usage' and 'disk usage' climbing together and a teammate assumes they must be the same underlying resource. What single property actually separates them?

- **A.** Nothing meaningfully separates the two — both simply hold data the system needs, so 'usage' means exactly the same thing for either one regardless of context or how it is measured.
- **B.** RAM is managed by the kernel while storage devices are managed entirely by user-space drivers instead of the kernel.
- **C.** Storage devices are addressed through system calls while RAM is addressed without any kernel involvement at all in the process.
- **D.** Volatility and access pattern: RAM is volatile and byte-addressable, cleared on power loss; storage devices are persistent and block-addressable through a filesystem and driver.

**Answer: D.** RAM is volatile and byte-addressable, directly by the CPU; storage devices are persistent and block-addressable through a filesystem and driver. Exhausting one causes swapping or an OOM kill; exhausting the other causes write failures — different failure modes following from that one axis.

- A is wrong: RAM and storage differ sharply in what exhausting them causes — swapping or the OOM killer for RAM, write failures for storage — so treating 'usage' as identical loses that distinction.
- B is wrong: Both RAM allocation and storage device access are kernel-managed; the distinction is not about which layer manages them.
- C is wrong: RAM access by a process is also mediated by the kernel's memory management; the difference is volatility and addressing granularity, not kernel involvement.

### 44.

What distinguishes a system call from an ordinary library function call?

- **A.** A system call always runs faster, because it bypasses the shell's own command-interpretation overhead entirely and talks straight to the running program.
- **B.** A system call is written in a different programming language than an ordinary library function is, which is why the two behave so differently at runtime.
- **C.** There is no real distinction; both terms simply describe the same underlying mechanism under different names chosen for historical, not technical, reasons.
- **D.** A system call is the controlled entry point that crosses from user space into the kernel to request privileged work; a library call does not cross that boundary.

**Answer: D.** A system call is the controlled entry point by which a userspace program asks the kernel to do privileged work, such as opening a file. A library call that stays in userspace never crosses that boundary at all.

- A is wrong: Speed is not the distinguishing property, and system calls are not defined by any relationship to the shell.
- B is wrong: Language choice is an implementation detail; the boundary crossed is what defines a system call, not the language it happens to be written in.
- C is wrong: They are not interchangeable: only a system call crosses into the kernel-privileged context, which is exactly the property the term names.

### 45.

A teammate needs three separate facts about a server: its kernel release and hardware name in one line, its distribution identity, and how long it has been running. Which three commands supply those, respectively?

- **A.** `cat /etc/os-release` alone is assumed to answer all three, since it is believed to also report kernel version and uptime as part of that very same file.
- **B.** `uname -a` for kernel and hardware facts, `cat /etc/os-release` for distribution identity, and `uptime` for time since boot and load averages.
- **C.** `hostnamectl` alone answers all three, since it exists on every Linux system and reports everything at once for free, always.
- **D.** `uname -a` reports the distribution name directly, making a separate distribution check entirely unnecessary in every case.

**Answer: B.** `uname -a` reports kernel name, hostname, kernel release, version, and machine hardware name together. `cat /etc/os-release` reports distribution identity specifically. `uptime` reports time since boot plus load averages — three commands for three distinct facts.

- A is wrong: That file reports distribution identity only; it does not include kernel version or uptime, which come from `uname` and `uptime` respectively.
- C is wrong: `hostnamectl` is systemd-specific and absent on non-systemd distributions, and it does not report uptime or load averages, which `uptime` provides separately.
- D is wrong: `uname -a` reports kernel and hardware facts; it does not reliably report the distribution's name and release, which is what `/etc/os-release` is specifically for.

### 46.

`uptime` reports a load average of 4.0 on one server and 4.0 on another. Are both servers under equal relative load?

- **A.** Yes — a load average of 4.0 is assumed to always mean the same relative load, since the figure is believed to be normalised by the kernel itself before it is ever reported back to a user at all, on any machine.
- **B.** Not necessarily — load average is not normalised for CPU count, so 4.0 is a quarter of capacity on a 16-core machine and twice capacity on a 2-core one; `nproc`'s answer is needed to judge either figure.
- **C.** Yes, since `hostnamectl` reports load averages in a normalised, comparable form across every different machine it runs on.
- **D.** Not necessarily, but only because the two servers are certainly running different kernel versions of Linux entirely.

**Answer: B.** Load average is relative to the machine, not an absolute threshold — a load of 4 is a quarter of capacity on a 16-core machine and twice capacity on a 2-core one. `uptime`'s numbers mean nothing without also knowing `nproc`'s answer.

- A is wrong: `uptime` does not normalise for core count; the raw figure is relative to the machine, which is exactly why two identical numbers can mean very different things.
- C is wrong: `hostnamectl` reports hostname, OS, kernel, and architecture; it does not report load averages at all, normalised or otherwise.
- D is wrong: Kernel version has no bearing on how load average should be interpreted; the relevant missing fact is core count, not kernel release.

### 47.

A user reports 'my terminal is frozen.' A foreground command is actually hung waiting on network I/O, and the terminal emulator itself is rendering fine. Was the report accurate?

- **A.** Yes — 'terminal' and 'shell' name the same thing, so a hung shell command is by definition the terminal itself freezing, with no meaningful difference between the two at all.
- **B.** No; the terminal is displaying correctly. It is the shell's foreground command that is hung, which needs a signal (Ctrl-C) rather than restarting the terminal emulator.
- **C.** No — the report describes a kernel scheduling failure, since only the kernel can cause a process to stop responding at all, regardless of what it is waiting on.
- **D.** Yes — any unresponsive prompt is, by definition, a frozen terminal no matter what is actually blocking it, since the symptom looks identical either way.

**Answer: B.** The terminal manages display and input; the shell interprets commands. A command hung on I/O is a shell-side condition needing a signal to the process, not a terminal-emulator restart — even though users describe both situations as 'the terminal froze.'

- A is wrong: The terminal displays; the shell interprets and forks commands. They are routinely conflated in speech, but they are different programs with different fixes.
- C is wrong: Waiting on network I/O is ordinary blocking behaviour, not a kernel scheduling failure; nothing here implicates the kernel itself.
- D is wrong: Treating every unresponsive prompt as a terminal problem is exactly the looseness the exam exploits; the description here points at the shell's foreground command, not the display program.

### 48.

An SSH session into a remote server presents a working command prompt. What role is the SSH session filling in this picture?

- **A.** It is acting as the shell, since it is what the user directly interacts with to type and run commands, exactly the role a local shell prompt would otherwise play.
- **B.** It is acting as the kernel, since it manages the network connection that carries the session's data all the way from the client to the server.
- **C.** It is acting as the terminal, carrying keyboard input to the remote shell and rendering the shell's output back, without interpreting any of the commands itself.
- **D.** It is acting as a pseudo-terminal device, which is a kernel object rather than anything the SSH client itself supplies over the connection.

**Answer: C.** The terminal, historically a physical device, is today usually a terminal emulator window or a remote session over SSH. It manages display and input and hands typed input to whatever program it launched — usually a shell — over a pseudo-terminal device.

- A is wrong: Direct interaction does not make it the interpreter; the remote shell running on the server does the interpreting, the SSH session only carries the input and output.
- B is wrong: Network connection handling is a kernel-level detail on both ends, but that does not make the SSH session itself a kernel component.
- D is wrong: A pty is the kernel-side channel the terminal and shell communicate over; the SSH session itself is the terminal program using that channel, not the channel itself.

### 49.

A shell script written and tested on Linux mostly works unmodified on another Unix-like system. What property of Linux explains that portability?

- **A.** The GPLv2 license under which the kernel is released is what guarantees behavioural compatibility across every Unix-like system.
- **B.** Every Unix-like system runs the same underlying kernel, so scripts naturally behave identically everywhere.
- **C.** Linux is Unix-like and largely POSIX-conformant, and that conformance is why skills and scripts port across Unix-like systems.
- **D.** Shell scripts are portable by nature and would run the same on any operating system regardless of any standard at all.

**Answer: C.** Linux is Unix-like and largely POSIX-conformant, which is why skills and scripts port across Unix systems sharing that conformance. It is a recognition-level fact: know that conformance is the reason, not the contents of the standard.

- A is wrong: Licensing terms govern redistribution rights, not runtime command or system-call behaviour; they are unrelated to script portability.
- B is wrong: Different Unix-like systems run entirely different kernels; the shared standard is POSIX conformance, not a shared kernel.
- D is wrong: Portability across Unix-like systems specifically follows from shared POSIX conformance; it does not extend to unrelated operating systems without that conformance.

### 50.

Between X11 and Wayland, which is the newer display server protocol intended to replace the older one?

- **A.** X11, since it was adopted more recently by most major distributions as their default.
- **B.** Wayland, the newer replacement for the older X11 protocol.
- **C.** Neither is newer; both were released in the same year as competing standards.
- **D.** The two names refer to the same underlying protocol under different branding.

**Answer: B.** X11 and Wayland are the display server protocols underlying Linux graphics, with Wayland being the newer replacement for the older X11. This is recognition-level: know which is newer, not which distribution defaults to which.

- A is wrong: Recent default adoption by a distribution does not change which protocol is older; X11 predates Wayland regardless of current default choices.
- C is wrong: They were not released in the same year; X11 is the long-established older protocol, and Wayland was developed later specifically to replace it.
- D is wrong: X11 and Wayland are distinct display server protocols, not two names for one thing; the concept exists specifically to test that they are different and one is newer.

