# Command Line

Command Line is the competency that covers driving a Linux system from a shell prompt: syntax,
navigation, file handling, redirection, text processing, scripting, and the system and
networking commands an operator types every day. It sits in Linux Fundamentals, 16% of the exam
and the 3rd largest of 6 domains. This competency was added in the 2025 update — no pre-2025
material covers it — and three retired competencies (File Management Commands, System Commands,
General Networking Commands) were folded into it, which is why 33 of its 39 concepts carry
commands and why the file is dominated by command discrimination rather than theory. LFS200
barely reaches it: 3 concepts are MENTIONED ONLY and 36 are NOT COVERED — 3 of 39, 8%, that
LFS200 touches at all (`research/lfs200-notes/00-course-map.md`). Everything below is sourced
from the primary documentation instead, and where GNU coreutils and BSD/macOS differ, or where
distributions differ, the difference is stated rather than one behaviour presented as universal.

<a id="s-command-line-basics"></a>
## Basics

<a id="c-linux.command-line.command-syntax"></a>
### Command syntax
*id: `linux.command-line.command-syntax` · depth 3 · importance 2 · LFS200: MENTIONED ONLY · sources: posix-utility-conventions, gnu-coreutils-manual*

**What it is** A command line has three parts: the command name, zero or more options (flags)
that modify behaviour, and zero or more operands (arguments) that name what to act on. Short
options take one hyphen and a single letter and may be clustered — `ls -la` is exactly `ls -l -a`.
Long options take two hyphens and a whole word and may never be clustered.

**Why it matters** Almost every question in this competency is really "which command, with which
option, answers this need." A candidate who cannot separate an option from an operand will
misread the answer choices, because the exam's distractors are usually built by moving a hyphen,
not by inventing a different command.

**How it works** The shell splits the line into words and hands them to the command; the command
itself parses them. A single hyphen introduces short options, so `-all` means `-a -l -l`, not
`--all`. A double hyphen introduces one long option, and `--` on its own marks the end of options
so that a following operand starting with a hyphen is treated as a filename. GNU tools also
accept a long option's value as `--width=80` or `--width 80`, and by default permit options after
operands, which strict POSIX ordering does not.

**Key terms** option (flag); operand (argument); option clustering; end-of-options marker `--`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ls -l` | Long listing: mode, links, owner, group, size, time, name | `-l` long format | `ls -l` | Reading `-l` as "list" and assuming plain `ls` already produces it — plain `ls` prints names only |
| `ls --all` | Long-option form of `-a`, listing entries whose names begin with a dot | `--all` equals `-a` | `ls --all` | Assuming long options are universal — `--all` is a GNU coreutils extension, and the BSD `ls` shipped on macOS rejects it while accepting `-a` |

**Traps** Long options are a GNU convention, not a POSIX requirement: the POSIX Utility Syntax
Guidelines define only single-character options, so a script relying on `--all` or `--recursive`
is not portable to a BSD or macOS userland even though the short forms work everywhere. And
clustering only applies to short options that take no argument — the option that takes a value
must come last in the cluster, which is why `tar czf` works and `tar cfz` does not.

**What the exam may test** Given a stated need, pick the command plus option that meets it, and
recognise that a one-hyphen string is a cluster of single letters while a two-hyphen string is
one word-long option.

<a id="c-linux.command-line.getting-help"></a>
### Getting help
*id: `linux.command-line.getting-help` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-pages-7, man-man-1*

**What it is** Four different help systems that answer different questions: `man` pages (the
reference manual, organised into numbered sections), `--help` (a short usage summary compiled
into the binary itself), `apropos` (keyword search across page descriptions), and `info` (GNU's
Texinfo manuals, often far fuller than the man page for GNU tools).

**Why it matters** The examinable part is not "help exists" but the section numbering. Several
names exist as both a command and a configuration file, and only the section number distinguishes
them — `crontab` is the clearest case, and the exam can ask which invocation documents the file's
syntax rather than the command's options.

**How it works** Manual sections are fixed: 1 user commands, 2 system calls, 3 library calls, 4
special files (devices), 5 file formats and configuration files, 6 games, 7 overviews and
conventions, 8 system administration commands. `man name` shows the first page found in the
configured section search order, not the lowest-numbered section that has a page. Both common
implementations search 1 first and 8 before 2, 3 and 5 — man-db's default is
`SECTION 1 n l 8 3 0 2 3type 5 4 9 6 7` in `man_db.conf`, and the BSD man on macOS defaults to
`1:1p:8:2:3:3p:4:5:6:7:9:0p:tcl:n:l:p:o` in `/etc/man.conf`. That order is why `man crontab` opens the section-1 command page
rather than the section-5 file format, and equally why `man mount` opens mount(8), the
administration command, rather than the lower-numbered mount(2) system call. `man 5 crontab`
asks for the file-format page explicitly. `man -k` and `apropos` are the same search: both scan
the short descriptions in the manual index, not the page bodies, so they need that index
(`mandb`) to have been built.

**Key terms** manual section; section 5 (file formats); `apropos` index; Texinfo.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `man` | Display a manual page | a leading section number selects the section | `man ls` | Assuming `man name` shows every page for that name — it shows one, the first match in the configured section order (`-a` shows them all) |
| `man 5 crontab` | Display the section-5 page: the crontab *file format*, not the crontab command | section number precedes the name | `man 5 crontab` | Running `man crontab` and reading the section-1 command page while looking for the five time fields' syntax |
| `man -k` | Search manual page short descriptions for a keyword | `-k` keyword search, same as `apropos` | `man -k` | Expecting it to search inside page text — it searches descriptions only; `man -K` searches full text and is far slower |
| `apropos` | Identical to `man -k`: keyword search of page descriptions | (takes the keyword as an operand) | `apropos` | Getting "nothing appropriate" and concluding no page exists, when the `mandb` index simply has not been generated |
| `info` | Read the GNU Texinfo manual for a program | (navigational, not option-driven) | `info` | Assuming `info` and `man` show the same content — for GNU coreutils the Texinfo manual documents behaviour the man page only summarises |

**Traps** Section 1 and section 5 are the pair the exam exploits: `man crontab` gives the command,
`man 5 crontab` gives the file format. The same split exists for `passwd` (1 = the command, 5 =
`/etc/passwd`'s format) and `hosts`. Separately, `--help` is produced by the program itself, so it
works in a minimal container where no man pages are installed at all.

**What the exam may test** Naming the section that documents configuration file syntax (5), and
choosing between `man`, `man -k`/`apropos`, and `--help` for a described situation.

#### Scenario

An operator needs to write a cron entry and cannot remember the field order. They run
`man crontab` and get a page about installing and listing crontabs — the section-1 command — with
nothing about the five time fields. The right invocation is `man 5 crontab`, because file formats
and configuration files live in section 5. Not knowing the utility's name at all, they would
instead search descriptions with `man -k` or the equivalent `apropos`, then open the result. Once
they have the page they still have to read it correctly: `-l` in the synopsis is a short option
that may cluster with other single letters, while an operand named after it is the thing being
acted on, and a GNU-only long form such as `--all` in an example will not survive being copied to
a macOS or BSD host.

#### Knowledge check

1. Which manual section documents configuration file syntax, and what does the same name in
   section 1 document instead?
   Section 5 documents file formats and configuration files; section 1 documents the user command
   of that name.
2. What is the difference between `-all` and `--all` as typed on a command line?
   `-all` is one hyphen, so it is the cluster `-a -l -l`; `--all` is a single long option.
3. `apropos ssh` prints "nothing appropriate" on a system that clearly has OpenSSH installed. What
   is the most likely explanation?
   The manual index `apropos`/`man -k` searches has not been built; the search reads that index of
   page descriptions, not the pages themselves.
4. Why can `--help` work on a container image where `man ls` fails?
   `--help` output is compiled into the binary, while man pages are separately installed files
   that minimal images usually omit.

<a id="s-command-line-navigation"></a>
## Navigation

<a id="c-linux.command-line.absolute-vs-relative-paths"></a>
### Absolute vs relative paths
*id: `linux.command-line.absolute-vs-relative-paths` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-path-resolution-7, posix-shell-command-language*

**What it is** A path that begins with `/` is absolute: resolution starts at the filesystem root
and the result does not depend on where the process happens to be. Any other path is relative:
resolution starts at the calling process's current working directory. The leading slash is the
only discriminator — nothing else about a path makes it absolute.

**Why it matters** "It works when I run it by hand and fails from cron, a systemd unit, or a
container entrypoint" is overwhelmingly a relative-path problem: those contexts start with a
different working directory, so the same relative path names a different file or no file at all.

**How it works** The current working directory is a per-process attribute, inherited by children
at fork time. A child cannot change its parent's — which is why `cd` must be a shell builtin and
why a script that ends with `cd /var/log` leaves the invoking shell exactly where it was. `pwd`
prints the working directory; because the shell tracks it as a text string in `$PWD`, `pwd`
without options prints that logical path, following whatever symlinks were used to arrive, while
`pwd -P` prints the physical path with symlinks resolved.

**Key terms** current working directory; logical vs physical path; per-process inheritance.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `pwd` | Print the current working directory | `-P` physical path with symlinks resolved, `-L` logical (default) | `pwd` | Treating `pwd`'s output as the physical location when the directory was reached through a symlink — only `pwd -P` guarantees that |
| `cd` | Change the shell's current working directory | `-P` resolve symlinks while changing; no argument goes to `$HOME`; `-` returns to the previous directory | `cd` | Expecting `cd` inside a script to change the calling shell's directory — the script is a child process, and its working directory dies with it |

**Traps** A path is not made absolute by being long, by naming a top-level directory, or by
starting with `~`. `~/logs` reaches the shell as an absolute path only because the shell expanded
the tilde first; inside single quotes, in a configuration file, or in an argument the shell never
expands, `~/logs` is a relative path naming a directory literally called `~`.

**What the exam may test** Deciding whether a described failure is caused by a relative path being
resolved from an unexpected working directory, and knowing that a child process cannot alter its
parent's working directory.

<a id="c-linux.command-line.dot-dotdot-and-tilde"></a>
### . .. and ~
*id: `linux.command-line.dot-dotdot-and-tilde` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-path-resolution-7, gnu-bash-manual, fhs-3-0*

**What it is** Three shorthands that are routinely lumped together but come from two different
layers. `.` is the current directory and `..` is the parent: both are real entries present in
every directory on disk, resolved by the kernel. `~` is not a directory entry at all — it is
shell syntax that the shell replaces with the value of `$HOME` before the command ever runs, and
`~alice` with alice's home directory as recorded in the account database.

**Why it matters** The layer difference decides where each one works. `.` and `..` work anywhere a
path is accepted: in a config file, in a `find` expression, in a C program. `~` works only where a
shell is doing the expanding, which is why a tilde pasted into a crontab, a systemd unit file, or
a quoted argument silently fails to become a home directory.

**How it works** At `/`, `..` refers to `/` itself, so `cd ..` from the root is a no-op rather than
an error. In bash, `cd ..` is logical by default: the shell strips the last component from `$PWD`
textually, so after arriving through a symlink, `cd ..` can land somewhere different from the
directory `..` actually points at on disk — `cd -P ..` follows the physical structure instead.
Tilde expansion happens only when the tilde is unquoted and starts a word, so `'~'` and `"~"` are
both literal, while `"$HOME"` is the reliable quoted form.

**Key terms** tilde expansion; `$HOME`; logical vs physical parent; directory entry.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `cd ..` | Move to the parent directory | `-P` use the physical parent rather than the logical one | `cd ..` | Assuming `cd ..` always undoes `cd somedir` — through a symlink the logical parent and the physical parent differ |
| `cd ~` | Move to the current user's home directory | plain `cd` with no argument does the same thing | `cd ~` | Quoting the tilde (`cd '~'`), which suppresses expansion and tries to enter a directory literally named `~` |

**Traps** `~` is expanded by the shell, `.` and `..` by the kernel — so a tool that reads paths
from a file (cron, a systemd unit, an application config) understands `..` and rejects `~`. A
second trap is that `.` also names the "dot" command, `. script.sh`, which sources a script into
the current shell; that is unrelated to the current directory despite the identical character.

**What the exam may test** Recognising that a tilde in a non-shell context does not expand, and
distinguishing the shell's logical `..` from the filesystem's physical parent.

*Not to be confused with [root directory vs /root vs home](command-line.md#cmp-linux.command-line.root-directory-vs-root-vs-home).*

<a id="c-linux.command-line.navigating-the-filesystem"></a>
### Navigating the filesystem
*id: `linux.command-line.navigating-the-filesystem` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-coreutils-manual, gnu-bash-manual*

**What it is** The loop of establishing where you are (`pwd`), moving (`cd`), and listing what is
there (`ls`), including the entries `ls` hides by default: everything whose name begins with a
dot.

**Why it matters** "Hidden" files are where per-user configuration lives — `.bashrc`, `.ssh`,
`.profile`, `.git` — so a scenario about a setting that will not take effect, or a directory that
looks empty but is not, usually turns on remembering that plain `ls` is not showing everything.

**How it works** There is no hidden attribute anywhere in the filesystem: `ls` simply omits names
starting with `.` unless told otherwise, and the shell's globbing does the same thing for the same
reason. `ls -a` includes them, along with the `.` and `..` entries themselves; `ls -A` includes
them but suppresses `.` and `..`. `ls -la` combines the long format with all entries. `cd` with no
argument goes to `$HOME`, and `cd -` returns to the previous directory, printing where it landed.

**Key terms** dotfile; `-a` versus `-A`; `$OLDPWD`; long format.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `pwd` | Confirm the current working directory before acting | `-P` physical path | `pwd` | Skipping it before a destructive command, then running that command in an unexpected directory |
| `cd` | Change directory | no argument goes home, `-` goes to the previous directory | `cd` | Reading bare `cd` as an error — it is a valid command meaning "go to `$HOME`" |
| `ls -la` | Long listing including dotfiles | `-l` long format, `-a` all entries including `.` and `..`, `-A` all but `.` and `..` | `ls -la` | Concluding a directory is empty from plain `ls` when it contains only dotfiles |

**Traps** Hiding is a display convention, not protection: a dotfile has exactly the same
permissions semantics as any other file, and `rm -rf dir` removes dotfiles inside `dir` even
though `rm -rf dir/*` does not, because the shell's `*` never matches a leading dot.

**What the exam may test** Choosing the option that reveals dotfiles, and recognising that
`ls`'s default omission is a listing convention rather than a filesystem attribute.

<a id="c-linux.command-line.root-directory-vs-root-vs-home"></a>
### Root directory vs /root vs home
*id: `linux.command-line.root-directory-vs-root-vs-home` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: fhs-3-0, gnu-bash-manual*

**What it is** Three distinct things that share the words "root" and "home". `/` is the root
directory: the single top of the filesystem hierarchy, from which every absolute path is
resolved. `/root` is the superuser's home directory — a specific directory that happens to be
named after the account. `~` is the *current* user's home directory, whichever account that is.

**Why it matters** The exam asks this as a wording puzzle. "Change to the root directory," "change
to root's home directory," and "change to your home directory" are three different instructions
with three different commands, and the wrong one is always among the answer choices.

**How it works** `cd /` reaches the top of the hierarchy. `cd /root` reaches the superuser's home,
which the FHS deliberately places outside `/home`: root's home must be available on the root
filesystem itself, because if it lived on a separately mounted `/home` that failed to come up, the
system would need a fallback location to fall back to. The FHS treats `/root` as the recommended
default rather than a hard requirement, so an unusual system may put it elsewhere. `cd ~` expands
to whatever `$HOME` holds for the account running the shell — for an ordinary user typically
`/home/name`, and for root `/root`, which is why `cd ~` and `cd /root` are the same command when
run by root and completely different commands otherwise.

**Key terms** filesystem root; superuser home; `$HOME`; FHS.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `cd /` | Move to the root of the filesystem hierarchy | (none) | `cd /` | Reading "go to root" as "go to root's home" — `/` is a location in the hierarchy, not an account's directory |
| `cd /root` | Move to the superuser's home directory | (none) | `cd /root` | Looking for it at `/home/root`, which is not where the FHS puts it |
| `cd ~` | Move to the current user's home directory | `~name` selects another user's home | `cd ~` | Assuming `~` is a fixed path — it depends entirely on which account is running the shell |

**Traps** `/home/root` is the recurring wrong answer for the superuser's home; the correct answer
is `/root`. And an unprivileged user typing `cd /root` normally gets "Permission denied" rather
than "No such file or directory", because the directory exists but is conventionally mode 700 —
the error message itself distinguishes the two situations.

**What the exam may test** Mapping each of the three phrasings to the right path, and knowing that
root's home sits outside `/home` and why.

<a id="cmp-linux.command-line.root-directory-vs-root-vs-home"></a>
#### Not to be confused with: Root directory vs /root vs home, . .. and ~, and /home
*compares: `linux.command-line.root-directory-vs-root-vs-home`, `linux.command-line.dot-dotdot-and-tilde`, `sysadmin.system-administration.home`*

| | Root directory vs /root vs home | . .. and ~ | /home |
| --- | --- | --- | --- |
| What the name covers | Three fixed locations that share the words "root" and "home": `/`, `/root`, and the current user's home | Three shorthands for positions relative to you: current directory, parent directory, current user's home | One specific directory: the parent under which regular users' home directories usually live |
| Resolved by | The kernel for `/` and `/root`; the shell for `~` | The kernel for `.` and `..`; the shell for `~` | The kernel — it is an ordinary absolute path |
| Where root's home is | `/root`, deliberately outside `/home` | `~` run by root expands to `/root` | Not here — `/home/root` is the classic wrong answer |
| Depends on who is running the command | Only the `~` part does; `/` and `/root` are fixed | `~` does; `.` and `..` depend on the working directory, not the user | No — `/home` is the same path for everyone |
| Guaranteed to exist | `/` always; `/root` is the FHS's recommended default | `.` and `..` exist in every directory; `~` needs `$HOME` to be set | Optional in the FHS, and the layout beneath it is a local administration decision |

The separating axis is what kind of thing each names: the first is a set of fixed locations, the
second is a set of shorthands whose meaning depends on the shell and the current directory, and
the third is one ordinary directory that happens to hold most users' homes but never root's.

#### Scenario

A junior operator is told to "clear the log directory on the root filesystem", SSHes in, and types
`cd ~; rm -rf *`. Nothing appears to happen and no logs are freed — they were in their own home
directory the whole time, because `~` expands to `$HOME`, not to `/`. They retry as root with
`cd ~`, land in `/root` rather than `/`, and are confused again: root's home is `/root`, which the
FHS places outside `/home` precisely so it stays available on the root filesystem. The correct
first step is `pwd` before anything destructive, then an absolute path — `/var/log` — since a
relative path would have been resolved from wherever the shell happened to be. Had they scripted
it, a trailing `cd` inside the script would not have moved their interactive shell at all: working
directory is per-process and does not propagate back to the parent.

#### Knowledge check

1. What is the one thing that makes a path absolute?
   A leading `/`. Nothing else — not length, not naming a top-level directory, not starting with a
   tilde.
2. Root runs `cd ~`. Where do they end up, and where would an ordinary user named alice end up?
   Root lands in `/root`; alice lands in her own home, typically `/home/alice`.
3. Why does a tilde written into a crontab or a systemd unit file usually fail to reach a home
   directory, while `..` in the same file works?
   `~` is expanded by the shell and those files are not read by a shell; `.` and `..` are real
   directory entries resolved by the kernel wherever a path is accepted.
4. A script ends with `cd /var/log`. After running it, why is the calling shell still in the old
   directory?
   The script runs as a child process, and a child cannot change its parent's working directory.
5. `ls` shows nothing in a directory that a colleague insists contains files. What is the first
   thing to try, and why?
   `ls -la` — `ls` omits names beginning with a dot by default, and hiding is a listing convention
   rather than a filesystem attribute.
<a id="s-command-line-file-operations"></a>
## File operations

<a id="c-linux.command-line.creating-and-removing-files-and-directories"></a>
### Creating and removing files and directories
*id: `linux.command-line.creating-and-removing-files-and-directories` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-coreutils-manual*

**What it is** The six commands that create, copy, move and destroy: `touch` (create an empty file
or update timestamps), `mkdir` (create directories), `cp` (copy), `mv` (rename or move), `rm`
(remove files and, with `-r`, whole trees), and `rmdir` (remove an empty directory only).

**Why it matters** Removal on Linux is immediate and unrecoverable: there is no recycle bin at the
command line, no undo, and no confirmation unless one is asked for. The exam tests this as
judgement, not trivia — which command is safe to run against a path you are not certain about.

**How it works** `mkdir -p a/b/c` creates every missing parent and, uniquely, does not fail if the
directory already exists, which is what makes it safe in scripts. `cp -r` walks a directory tree;
`cp` without it refuses a directory outright. `mv` within one filesystem is a rename of the
directory entry — instant regardless of file size, and atomic — while `mv` across filesystems is
really a copy followed by a delete, which is why moving a large file to another mount takes time
and can leave the original behind if it is interrupted. `rm -r` recurses; `rmdir` deliberately does
not, failing on any directory that still has contents.

**Key terms** recursive removal; rename versus copy-and-delete; idempotent `mkdir -p`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `touch` | Create an empty file, or update an existing file's access and modification times | `-c` do not create if missing, `-m` modification time only | `touch` | Assuming it always creates — on an existing file it changes timestamps and leaves the contents untouched |
| `mkdir -p` | Create a directory, creating missing parents and succeeding if it already exists | `-p` parents, `-m` set mode at creation | `mkdir -p` | Using plain `mkdir` for a nested path and getting "No such file or directory" for the missing parent |
| `cp -r` | Copy a directory and everything beneath it | `-r` recursive, `-a` archive (recursive and preserves mode, ownership, timestamps, symlinks), `-i` prompt before overwrite | `cp -r` | Expecting `cp -r` to preserve ownership and timestamps — it does not; `cp -a` does |
| `mv` | Rename or move a file or directory | `-i` prompt before overwrite, `-n` never overwrite | `mv` | Overwriting the destination silently, since `mv` does not prompt by default |
| `rm -r` | Remove a directory and its contents recursively | `-r` recursive, `-f` force (no prompts, no error on missing), `-i` prompt per file | `rm -r` | Reaching for `rm -rf` reflexively, which suppresses exactly the errors that would have revealed a wrong path |
| `rmdir` | Remove a directory only if it is empty | `-p` also remove now-empty parents | `rmdir` | Treating it as a weaker `rm -r` — its refusal on a non-empty directory is the safety feature, not a limitation |

**Traps** `rm -rf $DIR/` is catastrophic when `$DIR` is unset or empty, because the shell expands it
to `rm -rf /` before `rm` sees anything. GNU `rm` refuses to act on `/` itself by default, but it
happily removes `/usr` or `/var` if a variable expanded to nothing higher up the path. A stray
space is equally destructive: `rm -rf /tmp/build /` removes two operands, not one. Interactive
prompting is not a default anywhere — many distributions alias `rm` to `rm -i` for root's
interactive shell only, so a script running as the same user gets no prompt at all.

**What the exam may test** Picking the least destructive command that accomplishes a stated goal,
and knowing that `rmdir` fails on a non-empty directory while `rm -r` does not.

<a id="c-linux.command-line.viewing-file-contents"></a>
### Viewing file contents
*id: `linux.command-line.viewing-file-contents` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-coreutils-manual*

**What it is** Four ways to read a file without editing it: `cat` dumps the whole thing to standard
output, `less` pages through it interactively, `head` and `tail` show the beginning and end, and
`tail -f` stays attached and prints new lines as they are appended.

**Why it matters** Log investigation is the archetypal exam scenario, and the four tools are not
interchangeable: `cat` on a multi-gigabyte log floods the terminal and is useless, `less` opens it
instantly because it reads only what it displays, and only `tail -f` shows what is happening now.

**How it works** `cat` concatenates its operands and writes them to standard output, which is why
it is also the natural way to join files. `less` reads lazily and allows backward movement,
searching with `/`, and quitting with `q` — the older `more` can only move forward, which is the
distinction the two names encode. `head -n 20` and `tail -n 20` take a line count (10 by default).
`tail -f` holds the file open and follows the same file descriptor, so if the log is rotated away
the command keeps watching a file nobody writes to any more; `tail -F` follows the *name*, and
reopens after rotation.

**Key terms** paging; following a file; log rotation; standard output.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `cat` | Print files to standard output, or concatenate several | `-n` number lines, `-A` show non-printing characters (GNU coreutils) | `cat` | Running it on a binary or a huge log, which garbles the terminal (recover with `reset`) or scrolls the useful part away; and assuming `-A` is universal — the BSD `cat` on macOS accepts only `-belnstuv`, where `-v`, `-e` and `-t` cover the same ground |
| `less` | Page through a file interactively | `/` search, `G` end, `q` quit, `-N` line numbers | `less` | Assuming it loads the whole file first — it does not, which is exactly why it beats `cat` on large files |
| `head` | Show the first lines of a file | `-n N` line count, `-c N` byte count | `head` | Using it to sample a log's newest entries — the newest entries are at the end, so `tail` is the right tool |
| `tail -f` | Print the end of a file and keep printing as it grows | `-f` follow the descriptor, `-F` follow the name and reopen after rotation, `-n N` starting line count | `tail -f` | Watching a rotated log go permanently silent, because `-f` stayed attached to the rotated-away file; `-F` is the fix |

**Traps** `cat file | grep pattern` works but spawns a pointless process — `grep pattern file` does
the same job, and the exam sometimes offers the shorter form as the "better" answer. The other trap
is direction: `head` is the oldest content and `tail` the newest, so a question about "the most
recent errors" is never answered with `head`.

**What the exam may test** Matching the tool to the file size and the question asked, and knowing
that `tail -f` alone does not survive log rotation.

<a id="c-linux.command-line.finding-files"></a>
### Finding files
*id: `linux.command-line.finding-files` · depth 3 · importance 2 · LFS200: MENTIONED ONLY · sources: gnu-find-man, gnu-locate-man, gnu-coreutils-manual*

**What it is** Four tools that locate things by name rather than by content. `find` walks a
directory tree live and filters on name, type, size, timestamp, ownership or permission. `locate`
queries a database built in advance. `which` reports which executable a bare command name resolves
to on `PATH`. `whereis` looks for a command's binary, source and manual page in a fixed set of
standard locations.

**Why it matters** These are the four answers a "how do I find X" question offers, and they differ
on precisely one axis each: live versus indexed, anywhere versus on `PATH`, and files versus
executables. Picking `locate` when the file was created five minutes ago is the mistake the
distractors are built around.

**How it works** `find PATH EXPRESSION` evaluates the expression against every entry it visits:
`-name` matches the base name against a shell pattern, `-type f` restricts to regular files,
`-mtime +7` selects files modified more than seven days ago, and `-exec ... {} \;` or `-delete`
acts on the results. Because `-name` takes a shell pattern, the pattern must be quoted — otherwise
the shell expands it against the current directory before `find` runs. `locate` consults a
database refreshed periodically by `updatedb`, usually from a timer or cron job, so it answers in
milliseconds but knows nothing about files created since the last refresh and may still list files
that have been deleted.

**Key terms** live tree walk; prebuilt index; `updatedb`; `PATH` lookup.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `find` | Walk a directory tree and select entries by name, type, size, time or permission | `-name` pattern, `-type f` or `d`, `-mtime`, `-size`, `-exec`, `-delete` | `find` | Leaving the pattern unquoted (`-name *.log`), so the shell expands it in the current directory and `find` receives the wrong argument |
| `locate` | Query a prebuilt filename database | `-i` ignore case, `-r` regular expression, `-e` skip entries that no longer exist | `locate` | Trusting it for a file created since the last `updatedb` run, or for one that has since been deleted |
| `which` | Report which file on `PATH` a command name would run | `-a` show every match, not just the first | `which` | Using it on a shell builtin or alias — those have no file on `PATH`, so `which` reports nothing while the command works fine |
| `whereis` | Locate a command's binary, source and manual page | `-b` binary only, `-m` manual only | `whereis` | Expecting it to search the whole filesystem — it looks only in a compiled-in list of standard directories |

**Traps** `find` and `locate` answer the same question with opposite trade-offs, and the exam
phrases the scenario to force the choice: "immediately after creating the file" rules out
`locate`, "across a huge NFS tree, quickly" rules out `find`. Separately, `find`'s expression
syntax uses single-hyphen words that look like clustered short options but are not — `-name` is
one primary, never `-n -a -m -e`.

**What the exam may test** Choosing between a live walk and an index given a freshness or speed
constraint, and distinguishing "find a file anywhere" from "find which executable will run".

<a id="cmp-linux.command-line.finding-files"></a>
#### Not to be confused with: Finding files vs grep
*compares: `linux.command-line.finding-files`, `linux.command-line.grep`*

| | Finding files | grep |
| --- | --- | --- |
| What it searches | File names and metadata: name, type, size, timestamps, ownership, permissions | The bytes inside files, line by line |
| What it returns | Paths of matching files | Matching lines, optionally with their file name and line number |
| Answers the question | "Where is the file called X" | "Which files contain the text X, and where" |
| Recursion | `find` walks the tree by definition; `locate` searches a whole-system index | `grep` needs `-r` to descend into directories |
| Typical combination | `find` selects the files, then hands them on | `grep` inspects the contents of the files it is given |

The separating axis is names versus contents: `find` and `locate` answer questions about the file's
identity, `grep` answers questions about what is written inside it. A question that mentions the
text stored in a file is a `grep` question no matter how it phrases the search.

<a id="c-linux.command-line.file-type-and-metadata"></a>
### File type and metadata
*id: `linux.command-line.file-type-and-metadata` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-file-1, gnu-coreutils-manual*

**What it is** Determining what a file actually contains and when it changed, rather than trusting
its name. `file` inspects content, `stat` reports the inode's full metadata, and `ls -l` shows the
subset of that metadata a listing has room for.

**Why it matters** Linux attaches no meaning to a filename extension: `.txt` on a JPEG changes
nothing, and an executable needs no `.exe`. Any scenario where a file "will not open" or "is the
wrong type" is answered by inspecting the content, not the name.

**How it works** `file` runs three sets of tests in order — filesystem tests (is it a directory,
a socket, a device?), magic tests (does the leading byte sequence match a known signature?), and
language tests (does it look like text in some encoding?) — and prints the first that succeeds.
`stat` prints everything the inode holds: size, allocated blocks, device and inode numbers, link
count, permissions in both symbolic and octal form, ownership, and three timestamps. Those
timestamps are `atime` (last read), `mtime` (last content change) and `ctime` (last change to the
inode itself, including a permission or ownership change). `ls -l` shows `mtime` by default;
`ls -lc` shows `ctime` and `ls -lu` shows `atime`.

**Key terms** magic number; inode; atime, mtime, ctime; octal mode.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `file` | Identify a file's type from its content | `-b` brief (no filename), `--mime-type` report the MIME type, `-L` follow symlinks | `file` | Trusting the extension instead — `file` reads the content and is the only one of the two that can be right |
| `stat` | Print all inode metadata for a file | GNU coreutils forms: `-c '%a'` octal permissions, `-c '%s'` size, `-f` report on the filesystem instead | `stat` | Reading `ctime` as "creation time" — it is the inode change time, and traditional Unix metadata has no creation time at all |
| `ls -l` | Show the metadata subset a listing displays: mode, links, owner, group, size, time, name | `-l` long format, `-h` human-readable sizes, `--time=atime` or `-u` show access time | `ls -l` | Assuming the timestamp column is when the file was created; it is `mtime`, the last content modification |

**Traps** `ctime` is change time, not creation time, and it moves whenever ownership or permissions
change even though the contents did not. A second trap is that `stat`'s size and `du`'s size differ:
`stat` reports the byte length, while allocated blocks may be more (block rounding) or far fewer (a
sparse file). A third is portability, in the same way `ls --all` and `sed -i` diverge: GNU's `-c`
format string is rejected outright on macOS, whose `stat` spells its format option `-f` — the very
letter that means "report on the filesystem" in GNU, so that flag does unrelated things on the two
systems rather than failing loudly.

**What the exam may test** Choosing `file` over the extension to determine content type, and
separating the three timestamps — particularly rejecting "creation time" as the meaning of `ctime`.

<a id="c-linux.command-line.file-management-commands"></a>
### File management commands
*id: `linux.command-line.file-management-commands` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-coreutils-manual*

**What it is** The file-handling command family the Linux Foundation folded into Command Line in
the 2025 update, when the separate File Management Commands competency was retired: listing,
copying, moving, removing, linking and inspecting files. The one member with no counterpart
elsewhere in this section is linking — `ln -s`.

**Why it matters** Because this family arrived by consolidation rather than by being written fresh,
it is the part of the competency where questions reuse a command already met under another heading
and change only the option. Links are the genuinely new material, and hard versus symbolic links is
a standing exam discrimination.

**How it works** A hard link is an additional directory entry pointing at the same inode: there is
no "original", the link count in `ls -l`'s second column rises, deleting either name leaves the data
reachable through the other, and it cannot cross a filesystem boundary and cannot point at a
directory at all — `link(2)` on Linux lists `EPERM` for a directory operand with no exception for
root, and GNU `ln` refuses with "hard link not allowed for directory". A symbolic link created with `ln -s` is a small separate file whose contents
are a path: it can cross filesystems, can point at a directory, shows as type `l` in a listing with
an arrow to its target, and breaks silently into a dangling link if the target is moved or deleted.
`rm -i` prompts before each removal, `stat` and `file` inspect, and `ls -la` lists everything
including dotfiles.

**Key terms** hard link; symbolic (soft) link; inode; dangling link; link count.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ls -la` | List every entry, dotfiles included, in long format | `-l` long, `-a` all, `-h` human-readable sizes | `ls -la` | Missing dotfiles because plain `ls` omits them |
| `cp -r` | Copy a directory tree | `-r` recursive, `-a` archive, `-u` copy only when newer | `cp -r` | Expecting a symlink to be copied as a link — plain `cp` follows it and copies the target's contents; `cp -a` (or `-d`) preserves the link |
| `mv` | Rename or move | `-i` prompt, `-n` no-clobber, `-v` verbose | `mv` | Assuming it always copies data — within one filesystem it only rewrites the directory entry |
| `rm -i` | Remove with a confirmation prompt for each file | `-i` prompt always, `-I` prompt once for more than three files | `rm -i` | Relying on `-i` being the default; it is not, and adding `-f` later in the same command line overrides it |
| `ln -s` | Create a symbolic link | `-s` symbolic (omit for a hard link), `-f` replace an existing link, `-r` make the target relative | `ln -s` | Reversing the operands — the order is target first, then the name of the link to create |
| `stat` | Show full inode metadata, including link count | `-c` custom format (GNU coreutils only), `-L` follow symlinks | `stat` | Running it on a symlink and reading the link's own metadata as the target's; `stat -L` reports the target |
| `file` | Identify content type | `-b` brief, `-L` follow symlinks | `file` | Using it on a symlink without `-L` and getting "symbolic link to ..." rather than the target's type |

**Traps** `ln -s` records exactly the text it is given. A relative target is resolved relative to the
*link's own directory*, not the directory you were standing in when you created it, so
`ln -s config.yaml /etc/app/current.yaml` produces a link that points at `/etc/app/config.yaml`
whether or not that is what you meant. A dangling symlink is not an error at creation time — it
fails only when something tries to follow it.

**What the exam may test** Distinguishing a hard link from a symbolic link by what survives deletion
of the other name, by whether it can cross filesystems, and by what `ls -l` shows for each.

<a id="c-linux.command-line.reading-ls-l-output"></a>
### Reading ls -l output
*id: `linux.command-line.reading-ls-l-output` · depth 5 · importance 2 · LFS200: NOT COVERED · sources: gnu-coreutils-manual*

**What it is** The ten-character mode string at the left of every `ls -l` line, and the six columns
that follow it. Character one is the file type; characters two to ten are three permission triads —
owner, group, other — each holding read, write and execute in that fixed order. `drwxr-xr-x` is a
directory whose owner may read, write and traverse, and whose group and everyone else may read and
traverse but not write.

**Why it matters** Reading a mode string, and converting it to and from octal such as 644 or 755, is
one of the most reliably recurring item types on this exam. It is also the fastest permission
diagnosis available: a "permission denied" scenario is usually solved by reading one line of `ls -l`
output correctly rather than by running anything else.

**How it works** The type character is `-` for a regular file, `d` for a directory, `l` for a
symbolic link, `c` for a character device, `b` for a block device, `p` for a named pipe (FIFO) and
`s` for a socket. Each triad then reads `rwx`, with `-` in place of any bit that is not set. GNU
`ls` prints one further character immediately after the tenth, describing whether an alternate access
method applies: a space when none does, a `.` when the file has a security context (SELinux, in
practice) and no other alternate method, and a `+` for any other combination, an access control list
being the usual case — so an eleven-character mode field is meaningful, not a typo.

The columns after the mode are, in order: the hard link count, the owning user, the owning group,
the size in bytes, a timestamp (the modification time by default), and the name. For a device file
the size column is replaced by the major and minor device numbers. For a symbolic link the name is
followed by an arrow and the link's target. The `total` line at the top of a directory listing counts
allocated blocks, not bytes, so it will not equal the sum of the size column.

The permission bits mean different things on a directory than on a file, and this is where most
mistakes are made. On a regular file, `r` means read the contents, `w` means modify the contents and
`x` means execute it. On a directory, `r` means list the names inside, `w` means create, delete or
rename entries inside it, and `x` means traverse it — resolve a path through it and access a named
entry. A directory with `r` but not `x` lets you see the names and nothing else; a directory with `x`
but not `r` lets you open a file whose name you already know but not discover it. And `w` on a
directory is what allows deleting a file inside it, regardless of that file's own permissions.

**Key terms** mode string; permission triad; octal mode; setuid, setgid, sticky bit; ACL marker.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ls -l` | Long listing: mode string plus link count, owner, group, size, time and name | `-h` human-readable sizes, `-n` numeric UID/GID instead of names, `-i` show inode numbers | `ls -l` | Reading the second column as a file count; it is the hard link count, which for a directory is 2 plus its number of subdirectories |
| `ls -ld` | Show a directory's own line instead of listing its contents | `-d` operate on the directory itself, combined with `-l` | `ls -ld` | Running `ls -l /some/dir` to check that directory's permissions and getting the permissions of everything inside it instead |

**Traps** The triads are not cumulative and not a fallback chain. Exactly one applies: if you own
the file, the owner triad decides, full stop — being in the file's group does not add permissions
you were denied as owner. A file with mode `----rwxrwx` is unreadable to its owner and readable to
everyone else, and that is not a contradiction. A second trap is `ls -l` on a directory path, which
lists the contents rather than the directory: only `ls -ld` shows the directory's own mode.

**What the exam may test** Converting between a mode string and its octal equivalent in both
directions, and identifying which triad governs a described access attempt.

**Symptoms and diagnostic order** For "permission denied" on a path, work outward in this order.
First, decide which triad applies to the user in question — owner, group or other — and read only
that triad; checking the wrong one produces a confidently wrong answer. Second, check the execute
bit on *every* directory in the path, not just the final file: a file with mode 644 in a directory
with mode 700 owned by someone else is unreachable no matter what its own mode says. Third, look for
a `+` after the mode string; if one is there, an ACL is in force and `ls -l` alone is not the whole
picture. Fourth, if the mode looks correct and access still fails, consider a mandatory access
control layer such as SELinux or AppArmor, which `ls -l` does not report beyond the `.` marker. For
"cannot delete this file", the relevant permission is `w` on the containing directory, not on the
file — a read-only file in a writable directory can be removed.

**Syntax worth memorising** The mode string, left to right:

```
d rwx r-x r-x
│  │   │   └── other:  what everyone else may do
│  │   └────── group:  what members of the owning group may do
│  └────────── owner:  what the owning user may do
└───────────── type:   - file, d directory, l symlink, c char device, b block device, p FIFO, s socket
```

Each triad is one octal digit, `r`=4, `w`=2, `x`=1, added together:

| Mode string | Octal | Reads as |
| --- | --- | --- |
| `-rw-r--r--` | 644 | Regular file; owner read/write, everyone else read only |
| `-rwxr-xr-x` | 755 | Executable or directory content; owner full, others read and execute |
| `drwxr-xr-x` | 755 | Directory; owner may create and delete, others may list and traverse |
| `-rw-------` | 600 | Private file, e.g. an SSH private key |
| `drwx------` | 700 | Private directory, e.g. `~/.ssh` or `/root` |
| `-rwsr-xr-x` | 4755 | setuid: the `s` replaces the owner's `x`, and the leading 4 is the setuid bit |
| `drwxrwxrwt` | 1777 | Sticky bit on a world-writable directory such as `/tmp`; only the entry's owner, the directory's owner or root may delete it |

A capital `S` or `T` in place of `s` or `t` means the special bit is set while the underlying
execute bit is not — usually a mistake rather than an intention.

*Not to be confused with [symbolic vs numeric chmod](../02-system-administration/system-administration.md#cmp-sysadmin.system-administration.symbolic-vs-numeric-chmod).*

<a id="c-linux.command-line.case-sensitivity"></a>
### Case sensitivity
*id: `linux.command-line.case-sensitivity` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: man-path-resolution-7, posix-shell-command-language*

**What it is** On the filesystems Linux normally uses, a filename is a byte string compared
exactly, so `File.txt`, `file.txt` and `FILE.TXT` are three different files that can sit side by
side in one directory. Command names, options and shell variable names are case-sensitive for the
same reason: `LS` is not `ls`, `-R` is not `-r`, and `$path` is not `$PATH`.

**Why it matters** This is the single most common stumbling block for candidates arriving from
Windows or macOS, where the default filesystems are case-insensitive but case-preserving. A
repository or archive built on macOS can expand on Linux into two files where the author saw one,
and a script that refers to `Config.yaml` while the file is `config.yaml` fails with "No such file
or directory" — an error that reads like a missing file rather than a spelling difference.

**How it works** Case sensitivity is a property of the filesystem driver and how the volume was
mounted, not of Linux itself. ext4, XFS and Btrfs compare names byte for byte, and ext4 has an
optional per-directory case-folding feature. A mounted VFAT or exFAT volume on the same Linux host
is case-insensitive — exFAT folds through the volume's upcase table. NTFS is the instructive
exception: the volume is case-insensitive under Windows, yet the in-kernel `ntfs3` driver compares
names case-sensitively unless it is mounted with the `nocase` option. So the accurate statement is
that the filesystems Linux is normally installed on are case-sensitive, and that anything crossing a
filesystem boundary — a USB stick, a network share, a bind-mounted volume in a container — may
follow a different rule, decided by the mount rather than by the medium. The shell adds no case
folding of its own: `ls`, glob patterns and `grep` all match exactly unless explicitly told
otherwise, which is what `grep -i` is for.

**Key terms** case-sensitive versus case-preserving; byte-for-byte comparison; case folding.

#### Scenario

A deployment fails with "No such file or directory" for `/opt/app/Config.yaml`. `ls /opt/app` shows
nothing, so the operator tries `ls -la /opt/app` and finds `.config.yaml` — a dotfile, omitted by the
plain listing rather than absent. `file .config.yaml` reports ASCII text, not the JSON the error
implied, and `stat` shows an `mtime` from this morning, the same value `ls -l`'s timestamp column
carries by default. The name still does not match: the file is lower-case and the code asks for
`Config.yaml`, which on ext4 is a genuinely different name. The fix is `ln -s`, target first and new
name second, with an absolute target — a relative one would be resolved against the link's own
directory rather than the operator's. They check the directory's own mode with `ls -ld /opt/app`,
since `ls -l /opt/app` would have listed the contents instead.

#### Knowledge check

1. What is the difference between `rm -r` and `rmdir` when pointed at a directory that contains
   files?
   `rm -r` deletes the directory and everything in it; `rmdir` refuses and reports the directory is
   not empty.
2. A log stops updating in a `tail -f` window at midnight every night. Why, and which option fixes
   it?
   Log rotation moved the file; `-f` follows the open descriptor, so it keeps watching the rotated
   file. `tail -F` follows the name and reopens.
3. `locate report.csv` finds nothing, but the file was created ten minutes ago and is definitely
   there. Is `locate` broken?
   No — it queries a database refreshed periodically by `updatedb`, so it cannot know about a file
   newer than the last refresh. `find` walks the tree live and will see it.
4. Convert `drwxr-x---` to octal, and say who may create a file inside that directory.
   750. Only the owner, since `w` on a directory is what permits creating, deleting and renaming
   entries, and only the owner triad has it.
5. A file is mode 644 and owned by you, but you cannot read it. What is the next thing to check?
   The execute bit on every directory along its path — without `x` on a parent directory you cannot
   traverse to the file regardless of its own mode.
6. Why does `ctime` change when you run `chmod` on a file, even though the contents did not change?
   `ctime` is the inode change time, and permissions live in the inode; it is not a creation time.
<a id="s-command-line-shell-features"></a>
## Shell features

<a id="c-linux.command-line.wildcards-and-globbing"></a>
### Wildcards and globbing
*id: `linux.command-line.wildcards-and-globbing` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** Pattern characters the *shell* replaces with a list of matching filenames before the
command runs. `*` matches any run of characters including none, `?` matches exactly one character,
and a bracket expression such as `[abc]`, `[a-z]` or `[!0-9]` matches one character from (or not
from) a set.

**Why it matters** The expansion happens in the shell, not in the command, and every trap in this
topic follows from that one fact. `ls *.txt` never passes `*.txt` to `ls`; `ls` receives an already
expanded list of filenames and has no idea a pattern was involved. That is why quoting changes
behaviour, why a pattern behaves differently when there are no matches, and why remote commands
need their patterns protected.

**How it works** Before executing, the shell scans each unquoted word for pattern characters, and
replaces any word containing them with the sorted list of pathnames that match. Two default rules
matter: a `*` never matches a leading `.`, so dotfiles are excluded unless the pattern starts with
one, and a `*` never matches `/`, so a glob does not silently recurse into subdirectories. If no
pathname matches, bash leaves the word exactly as typed — so `ls *.txt` in a directory with no text
files produces an error about a file literally named `*.txt`.

**Key terms** pathname expansion; bracket expression; dotglob; nullglob.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ls *.txt` | List every name in the current directory ending in `.txt` | the pattern is the shell's, not `ls`'s — no option is involved | `ls *.txt` | Reading the "No such file or directory: *.txt" error as a broken glob; it means nothing matched, so the unexpanded word was passed through |

**Traps** A glob is not a regular expression, and the same characters mean different things in each.
In a glob, `*` means "any run of characters"; in a regular expression, `*` means "zero or more of the
item before it", so the regex equivalent of the glob `*.txt` is `.*\.txt`. Quoting inverts the whole
mechanism: `find . -name '*.log'` must be quoted so `find` receives the pattern, while `ls *.log`
must be unquoted so the shell expands it. And `rm -rf dir/*` leaves dotfiles behind, because `*`
excludes leading dots, whereas `rm -rf dir` removes everything.

**What the exam may test** Identifying which component performs the expansion, predicting what a
command actually receives, and distinguishing glob syntax from regular-expression syntax.

<a id="c-linux.command-line.quoting"></a>
### Quoting
*id: `linux.command-line.quoting` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** Three mechanisms that decide how much of the shell's expansion machinery applies to a
word. Double quotes suppress word splitting and globbing but still expand variables and command
substitution. Single quotes suppress everything — no character inside them has any special meaning
to the shell. A backslash escapes exactly the one character after it.

**Why it matters** An unquoted variable containing a space is one of the most productive bugs in
shell scripting: `rm $file` where `file` holds `my report.txt` deletes `my` and `report.txt` as two
separate operands, and where the variable is unset or empty it deletes nothing while reporting no
error, which is worse. The rule that avoids all of it is short — quote every variable expansion
unless you specifically want it split.

**How it works** After the shell substitutes a variable's value, an *unquoted* result is subject to
word splitting on the characters in `IFS` (space, tab and newline by default) and then to pathname
expansion. Inside double quotes neither step happens, so the value stays one word no matter what it
contains. Single quotes are absolute: a dollar sign, a backtick, a backslash and a wildcard are all
literal characters there, which is also why a single quote can never appear inside single quotes —
there is no escape available. A backslash outside quotes escapes one character; inside double quotes
it escapes only the handful of characters that are still special there.

**Key terms** word splitting; `IFS`; expansion; escaping.

<a id="c-linux.command-line.command-chaining"></a>
### Command chaining
*id: `linux.command-line.command-chaining` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** Three operators that put commands in sequence and differ only in what they do with
the previous command's exit status. A semicolon `;` runs the next command unconditionally. A double
ampersand `&&` runs it only if the previous command exited 0. A double pipe `||` runs it only if the
previous command exited non-zero.

**Why it matters** The difference is a safety property, not a stylistic one. `cd /tmp/build; rm -rf *`
and `cd /tmp/build && rm -rf *` are the same command except that the first still runs the deletion
when the `cd` fails — in whatever directory the shell happened to be. The exam poses exactly this
pairing.

**How it works** Every command sets an exit status when it finishes, and these operators branch on
it. `;` ignores it entirely. `&&` is short-circuit AND: the right side runs only when the left
succeeded. `||` is short-circuit OR: the right side runs only when the left failed. They associate
left to right with equal precedence, which is why `a && b || c` is not an if/then/else — if `a`
succeeds but `b` then fails, `c` runs too.

**Key terms** exit status; short-circuit evaluation; sequential versus conditional execution.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `;` | Run the next command regardless of whether the previous one succeeded | (an operator, not a command) | `make ; make install` | Using it where the second command is only safe after the first succeeded |
| `&&` | Run the next command only if the previous one exited 0 | (an operator, not a command) | `make && make install` | Reading it as "and also" rather than "and only if that worked" |
| `\|\|` | Run the next command only if the previous one exited non-zero | (an operator, not a command) | `ping -c1 host \|\| echo unreachable` | Treating `a && b \|\| c` as if/then/else — `c` also runs when `b` fails |

The three operators, written exactly: `;`, `&&` and `||`.

**Traps** These are sequencing operators, not data operators: none of them passes the first
command's output to the second. That is what a pipe does, and confusing `||` with `|` is a
single-keystroke error the exam is happy to exploit. A single `&` is different again — it puts the
preceding command in the background rather than chaining anything.

**What the exam may test** Predicting which commands in a chain actually run given a stated failure,
and distinguishing conditional sequencing from piping.

<a id="c-linux.command-line.command-substitution"></a>
### Command substitution
*id: `linux.command-line.command-substitution` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** A construct that runs a command and replaces itself with that command's standard
output, so the output becomes part of another command's arguments. The modern form is `$(command)`;
the older backtick form does the same thing but nests badly and treats backslashes inconsistently.

**Why it matters** It is how a value computed at runtime becomes an argument — `tar czf
backup-$(date +%F).tar.gz data` names the archive after today's date — and it is the construct most
often confused with a pipe. A pipe sends output to another command's *standard input*; substitution
turns output into *arguments*. A command that does not read standard input, such as `echo` or `rm`,
can only be fed by substitution.

**How it works** The shell runs the inner command in a subshell, captures its standard output,
strips trailing newlines, and splices the result into the surrounding word. Standard error is not
captured and goes straight to the terminal. If the result is left unquoted it is then word split and
glob expanded like any other expansion, so `"$(...)"` is the form to use when the output may contain
spaces. Arithmetic expansion `$(( ... ))` looks similar but is unrelated: it evaluates arithmetic and
runs no command at all.

**Key terms** subshell; standard output capture; trailing newline stripping; arithmetic expansion.

<a id="c-linux.command-line.shell-variables-and-export"></a>
### Shell variables and export
*id: `linux.command-line.shell-variables-and-export` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** `NAME=value` creates a variable in the current shell and nothing else. `export NAME`
marks it for inclusion in the environment handed to every process the shell starts from then on. A
variable that has not been exported is a shell variable; one that has been is an environment
variable.

**Why it matters** This one boundary explains a whole class of failures: a value that `echo` shows
correctly at the prompt but that a script, a service, or a child process cannot see. The variable was
set but never exported, so it never left the shell that holds it.

**How it works** Assignment takes no spaces around the `=` — `NAME = value` is parsed as running a
command called `NAME` with two arguments. Exporting copies the variable into the environment block
that `fork` and `exec` pass to children, and the copy is one-way: a child that changes its own copy
cannot alter the parent's, which is why a script can never export a variable back to the shell that
ran it. Sourcing sidesteps this — `. script.sh` runs the file in the current shell, so its
assignments and its `cd` persist, while `./script.sh` runs a child that takes them away with it.
`export -n NAME` removes the export mark without unsetting the value; `unset NAME` removes the
variable entirely.

**Key terms** shell variable versus environment variable; inheritance; sourcing; `unset`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `export` | Mark a variable for the environment of child processes, or list what is currently exported | `-p` list exported variables, `-n` remove the export mark without unsetting | `export` | Setting `NAME=value` and expecting a script or service to see it — without `export` the value never leaves the current shell |

**Traps** `set` and `env` answer different questions: `set` with no arguments lists all shell
variables and functions, `env` (and `printenv`) lists only exported ones. A variable visible in `set`
but absent from `env` is exactly the failure case above. Also, a variable exported in a login shell's
startup file is not automatically visible to a systemd service or a cron job — those do not read the
user's interactive startup files at all.

**What the exam may test** Diagnosing a value that is visible interactively but missing in a child
process, and distinguishing running a script from sourcing it.

<a id="c-linux.command-line.history-and-tab-completion"></a>
### History and tab completion
*id: `linux.command-line.history-and-tab-completion` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual*

**What it is** Two interactive conveniences provided by the shell's line editor. History keeps a
numbered list of the commands entered, recallable with the arrow keys, with `history`, with history
expansion such as `!!`, or by incremental search with `Ctrl-R`. Tab completion completes a partly
typed command, path or option from what exists.

**Why it matters** Both reduce typing errors on exactly the commands where a typo is expensive, and
both are interactive-only features. That last point is the examinable one: history expansion is
disabled in non-interactive shells, so a script containing `!!` does not behave the way the same
line behaves at a prompt.

**How it works** The shell keeps the history list in memory and writes it to the file named by
`HISTFILE` — `~/.bash_history` by default — when the session ends, which is why a second terminal
opened at the same time does not see this session's commands. History expansion runs before any
other processing: `!!` is replaced by the previous command line, `!n` by line `n`, and `!$` by the
last argument of the previous line. `Ctrl-R` starts a reverse incremental search: keep typing to
narrow it, press it again for the next older match, Enter to run or the arrow keys to edit. Tab
completion is handled by the readline library, completing filenames out of the box and, when the
`bash-completion` package is installed, command-aware things such as an option name or a service
name.

**Key terms** history expansion; `HISTFILE`; readline; reverse incremental search.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `history` | List the numbered command history | `-c` clear the in-memory list, `-a` append this session's lines to the history file now | `history` | Expecting another open terminal's commands to appear — the file is normally written at session exit |
| `!!` | Re-run the previous command line | `!n` run line `n`, `!$` reuse the previous line's last argument | `sudo !!` | Putting it in a script: history expansion is off in non-interactive shells |
| `Ctrl-R` | Search backwards through history incrementally | press again for the next older match; Ctrl-G cancels | `Ctrl-R` | Pressing Enter when the intention was to edit the recalled line first — Enter runs it immediately |

**Traps** Because history expansion runs first, and because double quotes do not suppress it the way
single quotes do, an exclamation mark inside double quotes is expanded at an interactive prompt:
`echo "hello!world"` fails with "event not found", while the same line in a script is fine. The
position of the `!` decides it — since bash 4.3 a `!` immediately before the closing double quote no
longer expands, so `echo "Done!"` is safe while `echo "Done!now"` is not. And `history -c` clears the
in-memory list only; the history file on disk is a separate thing.

**What the exam may test** Recognising history expansion and `Ctrl-R` as interactive-shell features,
and knowing where the history is stored and when it is written.

<a id="c-linux.command-line.aliases"></a>
### Aliases
*id: `linux.command-line.aliases` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual*

**What it is** A short name the shell substitutes for a longer command string before executing it —
`alias ll='ls -alF'`. Aliases are defined in a shell startup file, conventionally `~/.bashrc`, and
exist only inside the shell that read that file.

**Why it matters** Aliases are the most common reason a command behaves differently for one person
than for another on the same machine, and the most common reason a command that works at the prompt
fails inside a script. They are also a distractor family: `type` distinguishes an alias from a
function, a builtin and a file on `PATH`, and `which` cannot see the first three at all.

**How it works** The shell checks the first word of a command against its alias table and replaces
it before anything else runs. Only the first word is checked, unless the alias's value ends in a
blank, which makes the shell check the following word too. There is no mechanism for passing
arguments into the middle of an alias — anything typed after the alias is simply appended, so
anything more complicated needs a shell function. Bash does not expand aliases in a non-interactive
shell unless `expand_aliases` is set with `shopt`, and `~/.bashrc` is read for interactive non-login
shells, which is why an alias placed in `~/.bash_profile` may never appear in a terminal window.

**Key terms** alias table; first-word substitution; shell function; `expand_aliases`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `alias` | Define an alias, or with no arguments list all defined aliases | `unalias name` removes one; `\name` or `command name` bypasses one for a single invocation | `alias` | Defining one at the prompt and expecting it to survive a new shell — it must be written to a startup file to persist |

**Traps** A script does not inherit your aliases, because it runs in a non-interactive shell.
Conversely, an alias can silently change what a familiar command does: if `rm` is aliased to `rm -i`
on your account and not on the server's, the same typed command is dangerous in one place and safe
in the other. `type rm` reveals it; `which rm` reports the file on `PATH` and says nothing about the
alias shadowing it.

**What the exam may test** Explaining why a command works interactively but not in a script, and
choosing `type` over `which` when the target might be an alias, function or builtin.

<a id="c-linux.command-line.command-exit-status"></a>
### Command exit status
*id: `linux.command-line.command-exit-status` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** An integer from 0 to 255 that every command returns when it finishes. Zero means
success; any non-zero value means failure or, for some tools, a specific non-error outcome. `$?`
holds the status of the most recently completed foreground command.

**Why it matters** Exit status is the mechanism `&&`, `||`, `if` and `while` all test, so a candidate
who cannot predict a status cannot predict which branch of a chain runs. It is also how scripts and
CI pipelines detect problems at all — a script that ignores exit status reports success no matter
what happened inside it.

**How it works** Conventional values are worth memorising because bash assigns several of them
itself. A command that is not found returns 127. A command that is found but not executable returns
126. A command killed by signal N returns 128 plus N, so a process killed by SIGKILL (9) reports 137
and one killed by SIGTERM (15) reports 143. Shell builtins return 2 for a usage error. Beyond that,
1 is the generic failure value, and individual tools define their own meanings.

**Key terms** `$?`; 126 and 127; 128+N; `PIPESTATUS`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `echo $?` | Print the exit status of the command that just finished | (`$?` is a shell parameter, not an option) | `echo $?` | Running any other command first — `$?` is overwritten by every command, including the `echo` itself, so it must be checked immediately |

**Traps** Non-zero does not always mean something went wrong. `grep` returns 1 when it simply found
no matching line and 2 when it hit a real error, so `grep pattern file && echo found` is correct
while treating grep's 1 as a failure of the search is not. `diff` returns 1 when the files differ,
which is its normal successful outcome. In a pipeline, `$?` reports only the last command's status —
`false | true` gives 0 — and the individual statuses are in the `PIPESTATUS` array, or `set -o
pipefail` makes the pipeline fail if any stage does.

**What the exam may test** Mapping 127, 126 and 128+N to their causes, and recognising that a
non-zero status from `grep` or `diff` can be an ordinary result rather than an error.

#### Scenario

A nightly script works when pasted into a terminal and fails from cron. Walk the shell features in
order. The script calls `ll`, which exists only as an alias in the operator's `~/.bashrc`; cron runs
a non-interactive shell, aliases are not expanded there, and the command is not found — exit status
127. Replacing it with `ls -la` exposes the next problem: the script sets `BACKUP_DIR=/srv/backups`
and calls a helper that reads `$BACKUP_DIR`, which sees nothing, because a child gets only the
exported environment. With that fixed, `tar czf backup-$(date +%F).tar.gz $BACKUP_DIR/*` still
misbehaves on an empty directory — the glob matches nothing, so the literal pattern is passed
through — and the unquoted variable would have split into several operands had the path contained a
space. Finally `cd /srv/backups; rm -rf *` deletes in the current directory whenever the `cd` fails;
the `&&` form runs the removal only on success.

#### Knowledge check

1. Which component expands `*.txt`, and what does the command actually receive?
   The shell expands it before execution; the command receives the resulting list of filenames and
   never sees the pattern.
2. What does a shell do with a glob that matches nothing, and what error does that produce?
   Bash passes the unexpanded word through by default, so the command reports "No such file or
   directory" for a file literally named `*.txt`.
3. `echo "$var"` and `echo $var` differ how, when `var` holds `two words`?
   Quoted, it is one argument; unquoted, it is word split into two arguments and then glob expanded.
4. A variable is visible in `set` but not in `env`. What follows from that?
   It is a shell variable that was never exported, so no child process — script, service or cron
   job — will see it.
5. `grep missing file.txt` returns 1. Did the command fail?
   No — grep returns 1 to mean "no lines matched" and reserves 2 for a real error.
6. What exit status does the shell report for a command that does not exist, and for one killed by
   SIGKILL?
   127 for not found; 137 for SIGKILL, because a signal death reports 128 plus the signal number.

<a id="s-command-line-redirection"></a>
## Redirection

<a id="c-linux.command-line.standard-streams"></a>
### Standard streams
*id: `linux.command-line.standard-streams` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** The three file descriptors every process starts with: 0 is standard input, 1 is
standard output, and 2 is standard error. They are numbers, not files — what they are connected to
is decided by whoever started the process, and by default all three point at the terminal.

**Why it matters** Errors travelling on their own descriptor is the design decision that makes the
rest of this section work. It is why `command > file` leaves error messages on screen while the
useful output goes away, why `2>` exists as a distinct operator, and why piping a command's output
to `grep` does not filter its error messages.

**How it works** A program writes results to descriptor 1 and diagnostics to descriptor 2, and the
convention is honoured well enough that it can be relied on. Because both default to the terminal
they look like one stream on screen, which is why the separation is invisible until something is
redirected. Buffering differs too: the C library line-buffers standard output when it is attached to
a terminal but switches to block buffering when it is a pipe or file, while standard error is
unbuffered. That is why the error text from a piped command can appear out of order relative to the
output it refers to — the output is still sitting in a buffer.

**Key terms** file descriptor; fd 0, 1, 2; diagnostics versus results; buffering.

**Traps** "Output" in an exam question is ambiguous, and that ambiguity is usually the point: a
question that says a command's output was captured to a file, then asks why the error message still
appeared on screen, is testing whether the candidate treats standard output and standard error as one
stream. Also, `2>&1` is not "redirect stderr to a file called 1" — the ampersand says the target is
descriptor 1, not a filename.

**What the exam may test** Identifying which descriptor a described message travels on, and
recognising that redirecting one stream leaves the other where it was.

*Not to be confused with [pipes](command-line.md#cmp-linux.command-line.pipes).*

<a id="c-linux.command-line.redirection"></a>
### Redirection
*id: `linux.command-line.redirection` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** Operators that attach a process's standard streams to files instead of the terminal.
`>` sends standard output to a file, creating it or truncating it to zero length; `>>` appends
instead; `<` feeds a file to standard input; `2>` sends standard error; and `&>` sends both output
and error to the same file.

**Why it matters** `>` destroys the target's existing contents, and it does so when the shell sets up
the redirection — before the command has run and regardless of whether the command then succeeds.
`sort file > file` therefore produces an empty file, and no error is reported.

**How it works** The shell opens the target and attaches it to the named descriptor before executing
the command, so ordering on the command line matters. `command > out 2>&1` points descriptor 1 at
`out`, then points descriptor 2 at wherever 1 now points — both end up in the file. Reversing it,
`command 2>&1 > out`, points descriptor 2 at the terminal (where 1 still points at that moment) and
only then moves descriptor 1 to the file, so errors stay on screen. `/dev/null` is a device that
discards everything written to it and returns end-of-file when read, which is what `2>/dev/null`
uses. With `set -o noclobber` enabled, `>` refuses to overwrite an existing regular file and `>|`
overrides that refusal for one command.

**Key terms** truncation; append; `/dev/null`; descriptor duplication; noclobber.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `>` | Send standard output to a file, truncating it first | `>\|` overrides `noclobber` | `ls > listing.txt` | Assuming the file is only rewritten if the command succeeds — truncation happens when the redirection is set up |
| `>>` | Append standard output to a file, keeping what is there | (none) | `date >> log.txt` | Using `>` inside a loop and keeping only the final iteration's output |
| `2>` | Send standard error to a file, leaving standard output alone | `2>/dev/null` discards errors | `find / -name x 2>/dev/null` | Writing `2 >` with a space, which the shell reads as an operand `2` followed by a redirect |
| `&>` | Send both standard output and standard error to the same file | equivalent to `> file 2>&1` | `make &> build.log` | Using it in a portable script — `&>` is a bash and zsh feature, not POSIX; `> file 2>&1` works everywhere |

**Traps** Order matters for `2>&1`: placed before the redirection of standard output it copies the
old destination, not the new one. And redirection attaches a stream to a *file*, so a redirection can
never feed another command — that is what a pipe is for, and `command > grep` writes a file named
`grep`.

**What the exam may test** Predicting the contents of a file after a described redirection,
distinguishing `>` from `>>`, and choosing the portable form of "both streams to one file".

*Not to be confused with [pipes](command-line.md#cmp-linux.command-line.pipes).*

<a id="c-linux.command-line.pipes"></a>
### Pipes
*id: `linux.command-line.pipes` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** The pipe operator connects one command's standard output directly to the next
command's standard input, so that small single-purpose tools can be composed into a larger one
without an intermediate file. Standard error is not carried along.

**Why it matters** Composition is the reason the Linux command set is built out of tiny tools:
`ps aux`, `grep`, `sort`, `uniq` and `wc` each do one job, and the pipeline is what turns them into
an answer. It is also the operator most often confused with the conditional chaining operators and
with output redirection.

**How it works** The shell creates a kernel pipe — a buffer with a read end and a write end — and
starts every stage of the pipeline at the same time, not one after another. Data flows as it is
produced; when the buffer fills, the writer blocks until the reader catches up, and when the reader
exits early the writer receives SIGPIPE, which is why `yes | head -1` terminates rather than running
forever. Only descriptor 1 is connected, so diagnostics still reach the terminal; `2>&1 |` or bash's
`|&` includes them. The pipeline's exit status is the last stage's unless `pipefail` is set.

**Key terms** pipeline; concurrent execution; SIGPIPE; `xargs`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `\|` | Connect the left command's standard output to the right command's standard input | `2>&1 \|` or `\|&` to include standard error | `ps aux \| grep sshd` | Expecting it to carry error messages, which it does not |

The pipe operator, written exactly: `|`.

**Traps** A pipe only helps if the receiving command reads standard input. `echo /tmp | ls` prints the
current directory's listing and ignores the piped text entirely, because `ls` takes operands, not
input — `xargs` is what converts input into operands. And `sudo` inside a pipeline applies only to
the stage it prefixes: in `cat /etc/shadow | sudo grep root`, the `cat` runs unprivileged and fails
before `sudo` is reached.

**What the exam may test** Distinguishing a pipe from redirection and from conditional chaining, and
recognising that stderr and non-stdin-reading commands are the two things a pipe does not handle.

<a id="cmp-linux.command-line.pipes"></a>
#### Not to be confused with: Pipes vs Redirection vs Standard streams
*compares: `linux.command-line.pipes`, `linux.command-line.redirection`, `linux.command-line.standard-streams`*

| | Pipes | Redirection | Standard streams |
| --- | --- | --- | --- |
| What it is | An operator joining two running processes | An operator joining one process to a file or another descriptor | The three numbered descriptors themselves: 0, 1 and 2 |
| The other end is | Another command, running at the same time | A file, a device such as `/dev/null`, or another descriptor | Whatever the parent process attached — the terminal, by default |
| Carries standard error | No, unless stderr is explicitly merged first | Only the operator that names descriptor 2 does | Standard error *is* descriptor 2, always separate from 1 |
| Creates or destroys a file | No | Yes — `>` truncates the target before the command runs | No — a stream is a connection, not storage |
| Runs stages concurrently | Yes, all stages start together | No, there is one process plus a file | Not applicable |
| Signature mistake | Expecting errors to flow through it | `>` emptying the input file in `sort f > f` | Treating "output" as covering both 1 and 2 |

The separating axis is what sits at the far end: standard streams are the endpoints, redirection
attaches an endpoint to a file, and a pipe attaches one process's endpoint to another process's. Any
question about where error messages went is answered by remembering that only descriptor 2 carries
them and only an operator that names it moves them.

#### Scenario

An operator runs `find / -name '*.conf' > conf-list.txt` and the terminal fills with "Permission
denied" lines even though the output file is being written correctly. Both facts follow from one
thing: `>` moved descriptor 1 into the file and left descriptor 2 attached to the terminal.
`2>/dev/null` discards the noise; `&>` would put both into the file but only in bash or zsh, while
`> conf-list.txt 2>&1` is the portable form — and `2>&1 > conf-list.txt` would leave the errors on
screen, because the copy of descriptor 1 is taken before it is moved. Counting the results with
`find / -name '*.conf' | wc -l` works because `wc` reads standard input; deleting them with
`find ... | rm` does nothing at all, because `rm` takes operands rather than input. Sorting the list
in place with `sort conf-list.txt > conf-list.txt` yields an empty file: the shell truncated the
target before `sort` ever opened it.

#### Knowledge check

1. Which descriptor numbers are standard input, standard output and standard error?
   0, 1 and 2 respectively.
2. Why does `command > out.txt` still show error messages on screen?
   `>` redirects descriptor 1 only; errors travel on descriptor 2 and stay attached to the terminal.
3. What is the difference in effect between `cmd > out 2>&1` and `cmd 2>&1 > out`?
   The first sends both streams to the file. The second sends errors to the terminal — descriptor 2
   is pointed at descriptor 1's destination *before* descriptor 1 is moved — and only output to the
   file.
4. Why does `sort file > file` produce an empty file?
   The shell truncates the redirection target when it sets the redirection up, before `sort` runs and
   regardless of whether `sort` would have succeeded.
5. `echo /var/log | ls` prints the current directory instead of `/var/log`'s contents. Why?
   `ls` takes operands, not standard input, so the piped text is discarded; `xargs ls` converts input
   into operands.
6. State the one-sentence difference between a pipe and a redirection.
   A pipe connects one running process's stream to another running process's; a redirection connects a
   process's stream to a file or another descriptor.
<a id="s-command-line-text-processing"></a>
## Text processing

<a id="c-linux.command-line.grep"></a>
### grep
*id: `linux.command-line.grep` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-grep-man*

**What it is** A filter that reads lines from files or standard input and prints those matching a
pattern. It answers questions about what is *inside* files, and it is the single most-used text tool
on a Linux system.

**Why it matters** Almost every log-investigation scenario runs through grep, and its option set is
small enough that the exam tests the options directly: case-insensitive, recursive, inverted and
numbered are four different questions with four different flags.

**How it works** `grep PATTERN FILE...` prints each matching line. With no file operand it reads
standard input, which is what makes it the natural second stage of a pipeline. The pattern is a
basic regular expression by default; `-E` switches to extended syntax and `-F` treats the pattern as
a literal string. Its exit status is meaningful: 0 if at least one line was selected, 1 if none were,
and 2 if an error occurred — so "no matches" is reported as 1, not as failure.

**Key terms** pattern; line-oriented matching; standard input; exit status 0/1/2.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `grep -i` | Match without regard to case | `-i` ignore case | `grep -i error app.log` | Assuming matching is case-insensitive by default — it is not, and `Error` will be missed |
| `grep -r` | Search every file beneath a directory | `-r` recursive, following symlinks only when named on the command line; `-R` follows all symlinks | `grep -r TODO src/` | Omitting the path: with no file operand `grep -r` searches the working directory rather than reading standard input |
| `grep -v` | Print the lines that do *not* match | `-v` invert the selection | `grep -v '^#' config` | Reading it as "verbose"; it inverts, and combining it with `-c` counts non-matching lines |
| `grep -n` | Prefix each output line with its line number in the file | `-n` line numbers | `grep -n main src.c` | Confusing it with `-c`, which prints only a count and no lines at all |

**Traps** Quote the pattern. An unquoted pattern is processed by the shell first, so `grep *.log file`
is glob-expanded and `grep a b c` searches for `a` in files `b` and `c`. Also, grep's default syntax
is basic regular expressions, where `+`, `?`, `|`, `(` and `)` are ordinary literal characters —
`grep 'colou?r'` looks for a literal question mark unless `-E` is used or the characters are
backslashed.

**What the exam may test** Selecting the option that matches a stated requirement, and recognising
that grep searches file contents while `find` searches file names.

*Not to be confused with [finding files](command-line.md#cmp-linux.command-line.finding-files).*

<a id="c-linux.command-line.regular-expressions"></a>
### Regular expressions
*id: `linux.command-line.regular-expressions` · depth 2 · importance 2 · LFS200: MENTIONED ONLY · sources: gnu-grep-man, gnu-sed-manual*

**What it is** The pattern language `grep`, `sed`, `awk` and many other tools use to describe text.
At this level the pieces needed are anchors (`^` start of line, `$` end of line), the dot for any
single character, bracket expressions such as `[0-9]` and the named classes like `[[:digit:]]`, and
the quantifiers meaning "zero or more", "one or more" and "optional".

**Why it matters** Two discriminations carry almost all the exam value here, and both are about what
a regular expression is *not*. First, a regular expression is not a glob: in a glob `*` means "any
run of characters" and `.` is an ordinary character, while in a regular expression `*` means "zero or
more of the preceding item" and `.` matches any character. The glob `*.txt` becomes the regular
expression `.*\.txt`. Second, there are two POSIX dialects, and which one applies depends on the tool
and its flags.

**How it works** In POSIX basic regular expressions — grep's and sed's default — the characters
`+ ? | ( ) { }` are literal, and the operator meanings are reached by backslashing them: `\+`, `\?`,
`\|`, `\(`, `\)`. In POSIX extended regular expressions — reached with `grep -E`, `sed -E` or by
using `awk`, which is extended by default — those characters are operators and a backslash makes them
literal. This inversion is the reason a pattern copied from documentation for one tool can silently
match nothing in another: nothing errors, the semantics simply change.

**Key terms** anchor; character class; quantifier; basic versus extended regular expressions.

<a id="c-linux.command-line.sed"></a>
### sed
*id: `linux.command-line.sed` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-sed-manual*

**What it is** A stream editor: it reads input a line at a time, applies an editing script to each
line, and writes the result to standard output. In practice it is used almost entirely for one
thing — substitution with the `s` command.

**Why it matters** Search-and-replace across a file or a pipeline is a standing operational task, and
the substitution syntax has one flag whose absence changes the result silently: without `g`, only the
first match on each line is replaced.

**How it works** The substitution command is `s/pattern/replacement/flags`. The delimiter does not
have to be a slash — `s|/usr/local|/opt|` avoids escaping paths. The useful flags are `g` (replace
every match on the line rather than the first), `i` (match case-insensitively), a number (replace
only the nth match), and `p` (print the line, which is only useful together with `-n`). By default
sed prints every input line whether it matched or not, so `sed -n '/error/p'` is the idiom for
"print only matching lines". Addresses restrict a command to particular lines: `sed '1,10d'` deletes
the first ten.

**Key terms** substitution; the `g` flag; `-n` with `p`; in-place editing.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `sed` | Apply an editing script to a stream, printing every line by default | `-n` suppress automatic printing, `-e` add a script, `-E` extended regular expressions, `-i` edit files in place | `sed -n '5p' file` | Expecting it to modify the file — sed writes to standard output and leaves the input untouched unless `-i` is given |
| `sed 's/a/b/g'` | Replace every occurrence of `a` with `b` on every line | `g` all matches per line, `i` case-insensitive, `2` only the second match | `sed 's/a/b/g'` | Dropping the `g` and replacing only the first occurrence on each line, then concluding the pattern was wrong |

**Traps** In-place editing is where GNU and BSD diverge, and the difference is not cosmetic. GNU sed
takes an optional suffix attached to the flag: `-i` edits with no backup, `-i.bak` keeps one. BSD sed,
including the one shipped with macOS, requires the suffix as a separate argument, so the portable-
looking `sed -i 's/a/b/g' file` fails there and `sed -i '' 's/a/b/g' file` is needed. A script written
on one and run on the other either errors or silently creates a backup file named after the script.

**What the exam may test** Predicting the output of a substitution with and without `g`, and knowing
that sed writes to standard output unless `-i` is used.

*Not to be confused with [awk](command-line.md#cmp-linux.command-line.awk).*

<a id="c-linux.command-line.awk"></a>
### awk
*id: `linux.command-line.awk` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-gawk-manual*

**What it is** A field-aware text processing language. It reads input one record (by default one
line) at a time, splits each record into fields, and runs pattern-action pairs against it. Its
natural job is columnar output: printing, filtering or summing a particular column of a report.

**Why it matters** Anything phrased as "print the third column", "sum this column", or "show rows
where field 5 exceeds a value" is an awk question. `cut` can extract a column only when the delimiter
is a single fixed character, and awk is what handles the far more common case of columns separated by
variable runs of spaces.

**How it works** `awk 'pattern { action }'` runs the action on every record matching the pattern; omit
the pattern and it runs on all of them, omit the action and it prints the record. Fields are `$1`
onwards, `$0` is the whole record, `NF` is the number of fields and `NR` the record number. The
default field separator is a run of whitespace, with leading and trailing whitespace ignored, which is
why `ps aux | awk '{print $2}'` correctly picks the PID column despite the ragged alignment. `-F:`
sets an explicit separator, and with an explicit single-character separator every occurrence separates,
so consecutive delimiters produce empty fields.

**Key terms** record and field; `$0`, `NF`, `NR`; field separator; pattern-action pair.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `awk` | Run a pattern-action program over input records | `-F` set the field separator, `-v` pass in a variable | `awk -F: '{print $1}' /etc/passwd` | Leaving the program unquoted, so the shell expands `$1` to its own positional parameter — usually empty — before awk sees it |
| `awk '{print $3}'` | Print the third whitespace-separated field of every line | `$0` whole line, `NF` last field count, `$NF` the last field | `awk '{print $3}'` | Assuming the default separator is a single space; it is a run of whitespace, which is why ragged columns still line up correctly |

**Traps** Single-quote the program. Inside double quotes the shell expands `$3` first and awk receives
`{print }`, printing empty lines with no error to explain it. Also, awk's regular expressions are
extended by default, so `+` and `?` are operators there while they are literals in grep's and sed's
default mode.

**What the exam may test** Recognising a columnar extraction as an awk job, and predicting what
`$1`, `$3` and `$NF` refer to given a described line format.

<a id="cmp-linux.command-line.awk"></a>
#### Not to be confused with: awk vs sed
*compares: `linux.command-line.awk`, `linux.command-line.sed`*

| | awk | sed |
| --- | --- | --- |
| Unit it works on | The record split into fields — `$1`, `$3`, `$NF` | The line as an undivided string |
| Natural job | Selecting, computing on and reformatting columns | Substituting text and deleting or printing selected lines |
| Language | A full programming language: variables, arithmetic, conditionals, `BEGIN` and `END` blocks | An editing script of terse one-letter commands with optional line addresses |
| Default output | Only what the program explicitly prints | Every input line, whether it matched or not, unless `-n` |
| Regular expression dialect | Extended by default | Basic by default; `-E` selects extended |
| Edits files in place | No — it writes to standard output | Yes, with `-i` (whose syntax differs between GNU and BSD) |

The separating axis is fields versus the whole line: reach for awk when the answer depends on which
column a value is in, and for sed when the answer is a substitution applied to text wherever it
appears.

<a id="c-linux.command-line.cut-sort-uniq-and-wc"></a>
### cut, sort, uniq and wc
*id: `linux.command-line.cut-sort-uniq-and-wc` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-coreutils-manual*

**What it is** Four small filters that are almost always used together: `cut` extracts fields or
character ranges, `sort` orders lines, `uniq` collapses duplicates, and `wc` counts. The canonical
pipeline — extract a column, sort it, count the repeats, sort by frequency — is built from exactly
these.

**Why it matters** `uniq` compares only *adjacent* lines. That single fact makes `sort` a prerequisite
rather than a stylistic choice, and "used `uniq` without sorting first" is the classic mistake this
group is written around.

**How it works** `cut -d: -f1` splits on a single delimiter character and prints the named fields;
the default delimiter is a tab, `-c` selects character positions instead, and `cut` cannot reorder —
`-f2,1` still prints field 1 before field 2. `sort` orders lexicographically in the current locale by
default, so `10` sorts before `9`; `-n` gives numeric order, `-k` picks a sort key, `-r` reverses and
`-u` discards duplicates as it goes. `uniq` merges runs of identical adjacent lines, and `-c` prefixes
each with the number of occurrences. `wc -l` counts newline characters.

**Key terms** delimiter; sort key; adjacency; newline counting.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `cut -d` | Set the field delimiter for extraction | `-d` delimiter (one character), `-f` field list, `-c` character positions | `cut -d: -f1 /etc/passwd` | Using it on whitespace-aligned columns — repeated spaces each count as a separator and produce empty fields; awk handles that case |
| `sort` | Order lines | `-n` numeric, `-k` key, `-t` field separator, `-r` reverse, `-u` unique | `sort access.log` | Forgetting that the default order is lexicographic, so `100` sorts before `9` until `-n` is added |
| `sort -u` | Order lines and discard duplicates in one pass | `-u` unique | `sort -u names.txt` | Reaching for it when the requirement is to *count* duplicates — only `uniq -c` can do that |
| `uniq -c` | Collapse adjacent duplicate lines and prefix each with its count | `-c` count, `-d` only duplicated lines, `-u` only non-repeated lines | `sort names.txt \| uniq -c` | Running it on unsorted input, where identical lines that are not adjacent are all reported separately |
| `wc -l` | Count lines | `-l` lines, `-w` words, `-c` bytes, `-m` characters | `wc -l access.log` | Counting bytes with `-c` when lines were meant; and note `-l` counts newline characters, so a final line with no trailing newline is not counted |

**Traps** `sort -u` and `sort | uniq` produce the same list, but they are not interchangeable: only
`uniq` can count occurrences (`-c`), show just the duplicates (`-d`) or show just the singletons
(`-u`), and all of those still require sorted input. Note also that `uniq -u` and `sort -u` mean
opposite things — `sort -u` keeps one copy of every line, while `uniq -u` keeps only lines that never
repeated.

**What the exam may test** Ordering a pipeline correctly (sort before uniq), and choosing between
`sort -u` and `uniq -c` based on whether counts are required.

<a id="c-linux.command-line.diff-and-comparison"></a>
### diff and comparison
*id: `linux.command-line.diff-and-comparison` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-diffutils-manual*

**What it is** `diff` reports the changes that would turn its first file into its second. Its unified
output format, produced by `-u`, is the format patches and code review use, which is why the tool
matters well beyond ad-hoc file comparison.

**Why it matters** Configuration drift — this server works and that one does not — is a standard
troubleshooting scenario, and `diff` between the two configuration files is the direct answer.
Reading its output requires knowing which side is which.

**How it works** The default output uses change commands such as `3c3`, with lines from the first
file prefixed `<` and lines from the second prefixed `>`. Unified output with `-u` instead shows a
`---` header for the first file, a `+++` header for the second, `@@` markers giving the line ranges
of each hunk, a few lines of unchanged context, and the changed lines prefixed `-` (removed from the
first) and `+` (added in the second). `-r` compares directories recursively, `-q` reports only
whether the files differ, `-i` ignores case and `-w` ignores whitespace.

**Key terms** unified format; hunk; context lines; `<` and `>` versus `-` and `+`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `diff` | Report the differences between two files | `-r` recursive, `-q` brief, `-i` ignore case, `-w` ignore whitespace, `-y` side by side | `diff old.conf new.conf` | Reversing the operands: `<` and `-` lines come from the *first* file, so swapping them inverts the meaning of every line |
| `diff -u` | Produce unified output, the format used by patches and code review | `-u` unified, `-U N` set the number of context lines | `diff -u old.conf new.conf` | Reading a `-` line in unified output as an error rather than as "present in the first file, absent from the second" |

**Traps** `diff`'s exit status is 0 when the files are identical, 1 when they differ, and 2 on
trouble — so a difference makes `diff a b && echo same` skip the echo, which is correct, but also
makes a naive script treat a normal comparison as a failure. For binary files `diff` only reports
that they differ; `cmp` gives the first differing byte, and a checksum tool such as `sha256sum` is the
right way to ask "are these two files identical" across machines.

**What the exam may test** Reading unified diff output and attributing each line to the correct file,
and choosing `diff`, `cmp` or a checksum for a described comparison.

#### Scenario

A web server started returning errors after a configuration change, and the operator has the previous
config saved. `diff -u /etc/app/app.conf.bak /etc/app/app.conf` shows one `+` line, so it was added in
the current file, not removed from the backup. Next: which client addresses hit the failing endpoint
most. `grep -n '/checkout' access.log` numbers the matching lines, `grep -v ' 200 '` drops the
successful ones, and `awk '{print $1}'` pulls the client address out of the first column — awk rather
than `cut -d` because the columns are separated by runs of spaces. Piping that into `sort` and then
`uniq -c` produces per-address counts, and the order matters, since `uniq` only collapses adjacent
lines; `wc -l` totals the filtered stream. The old hostname is then normalised with a
`sed 's/a/b/g'`-style substitution, keeping the `g` flag so every occurrence on a line is replaced and
remembering that sed writes to standard output unless `-i` is given.

#### Knowledge check

1. Why must `sort` normally come before `uniq`?
   `uniq` only collapses duplicates that are adjacent; unsorted input leaves identical lines scattered
   and each is reported separately.
2. What is the difference between `sort -u` and `uniq -u`?
   `sort -u` keeps one copy of every distinct line. `uniq -u` keeps only the lines that never repeated
   at all — the opposite selection.
3. `grep 'colou?r' file` finds nothing although the file contains both spellings. What is wrong?
   grep uses basic regular expressions by default, where `?` is a literal character. Use `grep -E`, or
   backslash it as `colou\?r`.
4. A substitution replaced only one occurrence per line. Which flag was missing?
   `g`.
5. In `diff -u old new` output, which file does a line prefixed `-` come from?
   The first file, `old` — it is present there and absent from `new`.
6. When would `cut -d` be the wrong tool for extracting a column, and what replaces it?
   When the columns are separated by variable runs of whitespace: each space counts as a separate
   delimiter for `cut`. `awk` collapses whitespace runs and picks the field correctly.

<a id="s-command-line-editors"></a>
## Editors

<a id="c-linux.command-line.text-editors"></a>
### Text editors
*id: `linux.command-line.text-editors` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: posix-vi*

**What it is** Two terminal editors with opposite design philosophies. `vi` is modal, standardised by
POSIX, and present on essentially every Unix-like system including minimal containers and rescue
images. `nano` is modeless, shows its key bindings on screen, and is far easier to start with — but
it is a separate package that a minimal system may not have.

**Why it matters** vi's ubiquity is the practical point: when a rescue shell, a container, or a
stripped-down server offers exactly one editor, it is vi. Knowing how to leave it without destroying
the file is a genuine operational necessity, not a joke.

**How it works** vi has three modes. Normal mode is where it starts, and every key is a command
rather than text — `i`, `a` and `o` enter insert mode, and Escape returns to normal mode from
anywhere. Command-line mode is entered from normal mode with `:` and is where file operations live:
`:w` writes, `:q` quits, `:wq` writes and quits, and `:q!` quits discarding all changes. nano needs
none of this: the two-line footer lists the bindings, where `^` means Control, so `Ctrl-O` writes the
file out and `Ctrl-X` exits.

**Key terms** modal editing; normal, insert and command-line mode; `EDITOR` and `VISUAL`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `vi` | Open the POSIX-standard modal editor | `-R` read-only; on most Linux distributions `vi` is a link to `vim` or a cut-down build such as `vim-tiny` or BusyBox vi | `vi /etc/hosts` | Assuming behaviour is identical everywhere — arrow keys in insert mode and syntax highlighting depend on which build `vi` actually is |
| `nano` | Open the modeless editor with on-screen key hints | `-w` disable line wrapping, `-l` show line numbers | `nano /etc/hosts` | Assuming it is installed — minimal images and rescue environments frequently ship only vi |
| `:wq` | From vi's normal mode, write the file and quit | `:q!` quit discarding changes, `:w` write without quitting, `:x` write only if modified | `:wq` | Typing it while still in insert mode, which inserts the literal characters into the file; press Escape first |

**Traps** `EDITOR` and `VISUAL` decide which editor other tools launch, which is why `crontab -e` or
`visudo` can drop someone into vi with no warning on a system where they have never chosen an editor.
The escape route there is the same: Escape, then `:q!` to leave without saving — and for `visudo` in
particular, leaving without saving is the safe outcome, since it validates the file before installing
it.

**What the exam may test** Knowing the key sequence that exits vi with and without saving, and
recognising vi as the editor guaranteed to be present when nano is not.

#### Scenario

An operator is dropped into a rescue shell on a server that will not boot. There is no package
manager, no nano, and one editor: vi. They open the fstab entry that is failing, press `i` to enter
insert mode, comment out the bad line, then press Escape to return to normal mode before typing
`:wq` — had they typed it in insert mode, the four characters would have been written into the file
instead. On a second server they run `crontab -e` and are surprised to land in vi again: no `EDITOR`
is set for that account, so the default applies. They leave without saving using `:q!`, export
`EDITOR=nano` for the session, and rerun the command.

#### Knowledge check

1. What are the three vi commands for "save and quit", "quit discarding changes", and "save without
   quitting"?
   `:wq`, `:q!` and `:w` respectively, each typed from normal mode.
2. Why does typing `:wq` sometimes insert those characters into the file instead of saving it?
   The editor was still in insert mode; Escape must be pressed first to return to normal mode.
3. A minimal container image has no nano. Which editor can be relied on, and why?
   vi — it is POSIX-standardised and shipped essentially everywhere, though the build may be a
   cut-down one such as vim-tiny or BusyBox vi.
4. Why might `crontab -e` open an editor the user did not choose?
   It launches whatever `EDITOR` or `VISUAL` names, falling back to the system default when neither
   is set.

<a id="s-command-line-archiving"></a>
## Archiving

<a id="c-linux.command-line.archiving-and-compression"></a>
### Archiving and compression
*id: `linux.command-line.archiving-and-compression` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-tar-manual*

**What it is** Two separate jobs that are usually done together. Archiving bundles many files —
along with their permissions, ownership and timestamps — into one stream; that is `tar`, and it does
no compression at all on its own. Compression shrinks a single stream; that is `gzip`, `bzip2` or
`xz`. `zip` and `unzip` do both jobs in one container.

**Why it matters** The separation explains the file names: `.tar` is an uncompressed bundle,
`.tar.gz` (or `.tgz`) is that bundle passed through gzip, and `.gz` alone is a single compressed
file. A question that asks what a given command produces is really asking whether the candidate
knows that `tar` alone does not compress.

**How it works** `tar czf archive.tar.gz dir` reads as create, gzip, file — and the archive name must
come immediately after the `f`, since `f` is the option that takes an argument. `tar xzf` extracts the
same archive. GNU tar detects the compression format when reading, so `tar xf archive.tar.gz` also
works, and `-a` picks the compression from the suffix when creating. `gzip file` compresses in place:
it writes `file.gz` and removes the original unless `-k` keeps it or `-c` sends output to standard
output instead. bzip2 and xz trade speed for ratio, xz compressing hardest and slowest.

**Key terms** archive versus compression; `.tar.gz`; in-place replacement; Info-ZIP.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `tar czf` | Create a gzip-compressed archive | `c` create, `z` gzip, `f` archive file (must be last of the clustered letters), `v` verbose, `-C` change directory first | `tar czf logs.tar.gz /var/log` | Writing `tar cfz`, which makes `z` the archive name; and `tar cf archive.tar.gz dir`, which produces an uncompressed archive with a misleading name |
| `tar xzf` | Extract a gzip-compressed archive | `x` extract, `t` list without extracting, `-C` extract into a given directory | `tar xzf logs.tar.gz` | Extracting without listing first — `tar tzf` shows whether the archive unpacks into a directory or scatters files into the current one |
| `gzip` | Compress a single file | `-d` decompress (same as `gunzip`), `-k` keep the original, `-c` write to standard output, `-9` best compression | `gzip access.log` | Expecting the original to survive: by default gzip replaces it with the `.gz` version |
| `zip` | Create a zip archive, compressing as it goes | `-r` recurse into directories, `-e` encrypt | `zip -r site.zip site/` | Assuming it is installed — Info-ZIP's `zip` and `unzip` are separate packages that minimal Linux systems often omit |
| `unzip` | Extract a zip archive | `-l` list contents, `-d` extract into a given directory | `unzip site.zip` | Using `tar` on a `.zip` file; the formats are unrelated |

**Traps** Extraction location is the operational risk. An archive whose members are stored with a
leading path component unpacks into that directory, while one built from bare filenames scatters them
across the current directory — listing first with `tar tzf` is the habit that prevents it. GNU tar
strips a leading `/` from member names when creating an archive and warns that it is doing so, which
is why extracting rarely overwrites absolute system paths by accident.

**What the exam may test** Distinguishing archiving from compression, decoding a `tar` option cluster,
and predicting whether `gzip` leaves the original file in place.

*Not to be confused with [backup](../02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.backup).*

<a id="c-linux.command-line.file-transfer"></a>
### File transfer
*id: `linux.command-line.file-transfer` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: rsync-man, openssh-scp-man*

**What it is** Three ways to move files between hosts over SSH. `scp` copies in one shot from the
command line. `sftp` is an interactive file-transfer client with `get`, `put` and `ls` commands.
`rsync` compares source and destination first and transfers only the differences, which makes it the
tool for repeated synchronisation of large trees.

**Why it matters** The choice is decided by whether the transfer will be repeated. A one-off copy is
an `scp`; a nightly sync of a directory that mostly has not changed is an `rsync`, because scp and
sftp always send the whole file regardless of what is already at the far end.

**How it works** All three authenticate exactly as an SSH login does, and current OpenSSH `scp` uses
the SFTP protocol underneath rather than the old scp protocol. Remote paths are written
`user@host:/path`. `rsync -av` combines archive mode — recursive, preserving symlinks, permissions,
timestamps, group and owner — with verbose output; `-z` compresses in transit, `--delete` removes
files at the destination that no longer exist at the source, and `-n` performs a dry run. The trailing
slash on the source is significant: `rsync -av src/ dest/` copies the *contents* of `src` into `dest`,
while `rsync -av src dest/` creates `dest/src`.

**Key terms** delta transfer; archive mode; trailing-slash rule; dry run.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `scp` | Copy files to or from a remote host over SSH in one command | `-r` recursive, `-P` port, `-p` preserve times and modes, `-C` compress | `scp report.txt user@host:/tmp/` | Using lower-case `-p` for the port: `scp` spells the port `-P`, unlike `ssh`'s `-p` |
| `rsync -av` | Synchronise a tree, sending only what differs | `-a` archive, `-v` verbose, `-z` compress, `--delete` mirror deletions, `-n` dry run | `rsync -av src/ user@host:/srv/dest/` | Omitting or adding the source's trailing slash and creating a nested `dest/src` directory instead of merging |
| `sftp` | Open an interactive file-transfer session over SSH | `get`, `put`, `ls`, `cd` inside the session; `-b` runs a batch file | `sftp user@host` | Expecting it to resume or skip unchanged files — like scp it transfers whole files |

**Traps** `--delete` makes rsync destructive in exactly one direction, so pairing it with a reversed
source and destination mirrors an empty directory over a full one. Running `rsync -avn` first prints
what would happen without doing it, and is the standard precaution. Separately, `scp` and `rsync`
differ on preservation: `scp` does not keep timestamps unless `-p` is given, while `rsync -a` keeps
them by default.

**What the exam may test** Choosing between a whole-file copy and a delta transfer for a described
task, and predicting where files land given the presence or absence of a trailing slash.

#### Scenario

A nightly job must ship `/var/log/app` from a web server to an archive host. The first attempt uses
`tar czf` to build `app.tar.gz` and `scp` to send it; it works, but re-sends the whole archive every
night even though only a few megabytes changed, and `gzip`'s output is one opaque blob that cannot be
updated incrementally. The rewrite uses `rsync -av` against the directory, which compares both ends
and transfers only differences — though the first run creates `/srv/archive/app/app`, because the
source was written without a trailing slash. With `src/` the contents land where intended. Adding
`--delete` would mirror removals too, so it is tested with a dry run first. The monthly snapshot
keeps the archive approach, listed with `tar tzf` before extraction so they know whether it unpacks
into its own directory or scatters files into the current one, and remembering that a bare `tar cf`
named `.tar.gz` does not compress.

#### Knowledge check

1. What does `tar` do that `gzip` does not, and vice versa?
   `tar` bundles many files with their metadata into one stream but does not compress; `gzip`
   compresses one stream but cannot bundle.
2. What does `tar cf archive.tar.gz dir` actually produce?
   An uncompressed tar archive with a misleading name — `z` was omitted, so no compression happened.
3. After `gzip access.log`, does `access.log` still exist?
   No. gzip replaces it with `access.log.gz` unless `-k` or `-c` is used.
4. What is the difference between `rsync -av src/ dest/` and `rsync -av src dest/`?
   The first copies the contents of `src` into `dest`; the second creates `dest/src`.
5. Why is `rsync` preferred over `scp` for a nightly sync of a large tree?
   It compares both ends and transfers only the differences, while scp and sftp always send whole
   files.
6. Which option specifies the port for `scp`, and why is that a trap?
   `-P`. `ssh` uses lower-case `-p` for the port, and in `scp` lower-case `-p` means "preserve
   timestamps and modes" instead.

<a id="s-command-line-scripting"></a>
## Scripting

<a id="c-linux.command-line.shell-scripting-basics"></a>
### Shell scripting basics
*id: `linux.command-line.shell-scripting-basics` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, man-execve-2*

**What it is** A shell script is an ordinary text file of commands, made executable, whose first line
is a shebang naming the interpreter that should run it — conventionally `#!/bin/bash`. Nothing else
distinguishes it from any other file.

**Why it matters** The shebang is honoured by the kernel at execution time, which means it applies
only when the file is run directly. That single condition explains most "the script ran differently
than expected" scenarios: invoking it as `sh script.sh` ignores the shebang entirely and runs it under
a different shell.

**How it works** When a file is executed, the kernel's `execve` inspects its first bytes; if they are
`#!` it takes the rest of that line as an interpreter path and runs the interpreter with the script's
path as an argument. This requires the execute bit, which is what `chmod +x` sets. A leading `./` is
then needed to run it — `script.sh` alone fails because the current directory is deliberately not on
`PATH`. Running the script starts a child shell, so its variable assignments and `cd` calls vanish
when it exits; sourcing it with `.` or `source` runs it in the current shell instead, where they
persist.

**Key terms** shebang; `execve`; execute bit; running versus sourcing.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `#!/bin/bash` | First line naming the interpreter the kernel should run the file with | `#!/usr/bin/env bash` finds bash on `PATH` instead of assuming `/bin/bash` | `#!/bin/bash` | Assuming the shebang always applies — `sh script.sh` or `bash script.sh` runs the named shell and ignores it |
| `chmod +x` | Add the execute permission so the file can be run directly | `+x` adds execute; `u+x` restricts the change to the owner | `chmod +x deploy.sh` | Expecting `+x` to set execute for everyone unconditionally — with no `u`, `g`, `o` or `a` given, GNU chmod acts as if `a` were given but leaves bits set in the umask untouched |

**Traps** `/bin/sh` is not bash on Debian and Ubuntu, where it is dash — so a script whose shebang says
`#!/bin/sh` but which uses bash-only syntax such as arrays or `[[ ]]` fails there while working on a
distribution where `/bin/sh` links to bash. The other classic is a file saved with Windows line
endings: the shebang line then ends in a carriage return, the kernel looks for an interpreter named
`/bin/bash\r`, and the error is the misleading "bad interpreter: No such file or directory".

**What the exam may test** Explaining when the shebang is and is not consulted, and knowing that a
script must be both executable and invoked with a path for it to be used at all.

<a id="c-linux.command-line.script-control-flow"></a>
### Script control flow
*id: `linux.command-line.script-control-flow` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: gnu-bash-manual, posix-shell-command-language*

**What it is** The constructs that let a script make decisions and repeat work: `if`/`elif`/`else`,
the `for` loop over a list, the `while` and `until` loops driven by a condition, plus the positional
parameters that carry a script's arguments.

**Why it matters** The shell has no boolean type, and this is the source of nearly every mistake in
the topic. `if` does not evaluate an expression — it runs a command and branches on its exit status,
where 0 means "true". Understanding that makes `if grep -q pattern file; then` obvious rather than
strange, and it explains why the test syntax looks the way it does.

**How it works** `[` is not punctuation; it is a command (a synonym for `test`), which is why it needs
a space on both sides and why its final argument must be `]`. `[ $a -eq $b ]` compares numbers while
`[ "$a" = "$b" ]` compares strings — using the wrong one on the wrong type either errors or silently
compares the wrong thing. Bash's `[[ ... ]]` is a keyword rather than a command: it does no word
splitting, so unquoted variables are safe inside it, and it supports pattern matching. Loops follow
the same exit-status logic: `for name in a b c; do ...; done` iterates a word list, and
`while command; do ...; done` repeats while the command keeps succeeding. Arguments arrive as `$1`
through `$9` and beyond, `$#` is their count, `$0` is the script's own name, and `"$@"` expands to all
of them with each preserved as a separate word.

**Key terms** exit status as truth; `test` and `[`; positional parameters; `"$@"`.

#### Scenario

A deployment script fails only on the CI runner. Its shebang reads `#!/bin/sh`, but it uses `[[ ]]`
and an array: on the developer's machine `/bin/sh` links to bash and both work, while on the
Debian-based runner `/bin/sh` is dash and neither does. `#!/bin/bash` helps only if the file is
executed directly — the CI job invoked it as `sh deploy.sh`, which ignores the shebang, so the
invocation changes too. The script then exits immediately: copied from Windows, its shebang line ends
in a carriage return and the kernel reports a missing interpreter. Converting the line endings and
running `chmod +x` restores it. Finally `[ $count -eq 0 ]` breaks whenever `count` is empty: the
unquoted expansion leaves `[` too few arguments and it reports a unary operator error. Quoting as
`[ "$count" -eq 0 ]` fixes the argument count but not the emptiness — `[` then rejects the empty
string as not an integer — so `[ "${count:-0}" -eq 0 ]` is the form that works.

#### Knowledge check

1. When is a script's shebang consulted, and when is it ignored?
   It is consulted when the file is executed directly and has the execute bit set; it is ignored when
   the file is passed to an interpreter explicitly, as in `bash script.sh`.
2. Why does `./deploy.sh` work while `deploy.sh` reports "command not found"?
   The current directory is not on `PATH` by design, so a bare name is not searched for there.
3. What does `if` actually test?
   The exit status of the command it is given: 0 is true, non-zero is false. There is no boolean type.
4. What is the difference between `-eq` and `=` inside `[ ]`?
   `-eq` compares numbers; `=` compares strings. Using the numeric form on non-numeric text is an
   error, and the string form on numbers compares them as text.
5. A script sets a variable and ends with `cd /srv`. Why does neither persist in the calling shell,
   and what changes that?
   It runs in a child process. Sourcing it with `.` or `source` runs it in the current shell, where
   both persist.
<a id="s-command-line-system-commands"></a>
## System commands

<a id="c-linux.command-line.system-commands"></a>
### System commands
*id: `linux.command-line.system-commands` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: man-ps-1, gnu-coreutils-manual*

**What it is** The command family folded into Command Line in the 2025 update, when the separate
System Commands competency was retired: inspecting processes, memory, disk and uptime from the shell.
The concepts behind these figures belong to System Administration; what belongs here is knowing which
command answers which question, and what its output does not mean.

**Why it matters** These are the commands a scenario opens with, and each has a headline number that
is routinely misread — ps's CPU percentage, free's "free" column, and uptime's load average all mean
something narrower than they appear to.

**How it works** `ps aux` uses BSD-style options, which is why there is no leading hyphen: `a` shows
other users' processes, `u` selects the user-oriented output format, and `x` includes processes with
no controlling terminal. The equivalent in UNIX-style syntax is `ps -ef`. It is a snapshot, and its
`%CPU` column is the average over the process's entire lifetime rather than a current reading — `top`
is the tool that refreshes and shows what is happening now. `kill` sends SIGTERM by default, which a
process may catch and handle; `kill -9` sends SIGKILL, which it cannot catch, and which therefore
skips any cleanup the process would have done. `free -h` reports memory: the meaningful column is
"available", not "free", because the kernel deliberately uses idle memory as reclaimable page cache.
`df -h` reports free space per mounted filesystem, `du -sh` sums the space a directory tree occupies,
`uptime` gives time since boot plus the 1-, 5- and 15-minute load averages, and `uname -a` prints
kernel name, hostname, kernel release and version, and machine architecture.

**Key terms** BSD versus UNIX option style; SIGTERM versus SIGKILL; reclaimable cache; load average.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ps aux` | Snapshot every process on the system in user-oriented format | BSD style: `a` all users, `u` user format, `x` include processes with no terminal; `ps -ef` is the UNIX-style equivalent | `ps aux` | Adding a hyphen (`ps -aux`), which is a different, historically ambiguous request; and reading `%CPU` as current usage when it is a lifetime average |
| `top` | Show a continuously refreshing view of processes and resource use | `-b` batch mode for scripts, `-u` filter by user, `1` toggles per-CPU lines | `top` | Using it to capture a snapshot in a script — `ps` or `top -b -n1` is what produces parseable output |
| `kill` | Send a signal to a process by PID | default is SIGTERM (15); `-9` is SIGKILL, `-l` lists signal names | `kill 4821` | Passing a process *name* — `kill` takes PIDs; `pkill` and `killall` take names |
| `free -h` | Report memory and swap use in human-readable units | `-h` human-readable, `-s N` repeat every N seconds, `-m` mebibytes | `free -h` | Reading the "free" column as the memory available to applications; "available" is the figure that accounts for reclaimable cache |
| `df -h` | Report free and used space per mounted filesystem | `-h` human-readable, `-i` inode usage instead of blocks, `-T` show filesystem type | `df -h` | Diagnosing "disk full" without checking `-i` — a filesystem can exhaust inodes while blocks remain free |
| `du -sh` | Summarise the total space used by a directory tree | `-s` summary only, `-h` human-readable, `-x` stay on one filesystem, `--apparent-size` byte length rather than blocks | `du -sh /var/log` | Expecting it to agree with `df` — a deleted file still held open by a process is counted by `df` and invisible to `du` |
| `uptime` | Show time since boot and the 1-, 5- and 15-minute load averages | (no options needed for basic use) | `uptime` | Treating a load average above 1 as overload without dividing by the number of processing units first |
| `uname -a` | Print all system information: kernel name, hostname, release, version, machine | `-r` kernel release only, `-m` machine architecture only | `uname -a` | Expecting it to report the distribution — it never does; `/etc/os-release` carries that |

**Traps** `df` and `du` disagreeing is a diagnosis, not an error: when `df` reports a full filesystem
that `du` says is mostly empty, a process is still holding a deleted file open and the space is not
released until that process closes it or exits. Signals are the other standing trap — `kill` without
a number is a polite request the process can ignore, so a process that will not die needs `kill -9`,
and a process stuck in uninterruptible I/O will not die even then.

**What the exam may test** Choosing the command that answers a stated question, and rejecting the
misreadings: ps's lifetime `%CPU`, free's "free" versus "available", and load average without core
count.

<a id="c-linux.command-line.who-is-logged-in"></a>
### Who is logged in
*id: `linux.command-line.who-is-logged-in` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gnu-coreutils-manual, man-w-1*

**What it is** Five commands answering two different questions. `who`, `w` and `last` answer "who is
or was on this machine": current sessions, current sessions with what they are doing, and the
historical login record. `id` and `whoami` answer "who am I right now", in terms of the credentials
this process is actually running with.

**Why it matters** This is an operational question and a security question at once. After a privilege
escalation the two answers diverge, and knowing which command reports the *effective* identity and
which reports the *login* identity is exactly what an audit scenario turns on.

**How it works** `who` lists the login sessions recorded in the utmp database — name, terminal, login
time and remote host. `w` shows the same sessions plus a header giving the current time, uptime, the
number of logged-in users and the 1-, 5- and 15-minute load averages, and per user the idle time and
the command currently running on that terminal. `last` reads the wtmp log and shows historical
logins, logouts and reboots, newest first. `id` with no options prints the real user and group IDs,
adds the effective ones only when they differ from the real ones, and lists every supplementary
group; `id -u` is the form that reports the effective UID on its own. `whoami` prints just the
effective user name and nothing else.

**Key terms** utmp and wtmp; effective versus login identity; supplementary groups.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `who` | List current login sessions | `-a` all available detail, `-b` last boot time, `-H` column headings | `who` | Expecting it to list every process's owner — it lists sessions recorded in utmp, so daemons and many container sessions never appear |
| `w` | List current sessions with load averages and each user's current process | `-h` no header, `-s` short format | `w` | Reading the header's load averages as this user's load; they are the whole system's |
| `last` | Show the historical login record from wtmp | `-n N` limit the number of entries, `-x` include shutdown and runlevel changes | `last` | Assuming it shows current sessions — it shows history, with still-open sessions marked as such |
| `id` | Print the real user and group IDs, the effective ones when they differ, and all supplementary groups | `-u` effective UID only, `-ur` the real UID instead, `-un` user name, `-nG` group names | `id` | Using `groups` or `whoami` when the question is about group membership — only `id` shows the full set |
| `whoami` | Print the effective user name | (no options; equivalent to `id -un`) | `whoami` | Reading it as "who logged in" — after `sudo` it reports root, not the original account |

**Traps** `whoami` reports the effective user, so inside `sudo -i` it says `root` no matter who
started the session. The original login name is what `logname`, or `who am i`, reports from the utmp
record, and that distinction is the whole point of an accountability question. A second trap is
`id -u`: a value of 0 means root regardless of the account name, since privilege attaches to the UID,
not the name.

**What the exam may test** Separating effective identity from login identity after privilege
escalation, and picking the command that shows group membership rather than just a user name.

#### Scenario

A server is reported as slow and possibly compromised. `uptime` gives the load averages, which mean
nothing until read against the processing-unit count; `free -h` is read on the "available" column
rather than "free", since the kernel keeps idle memory as reclaimable cache; `df -h` shows the root
filesystem at 100% while `du -sh /var/log` reports a few hundred megabytes. That disagreement is
itself the finding — a deleted file is still held open by a running process, so `df` counts space
`du` cannot see. `ps aux` identifies the process, its `%CPU` a lifetime average rather than a current
figure, and `top` gives the live picture. The default `kill` sends SIGTERM and lets it close the file;
`kill -9` is warranted only if that is ignored, since SIGKILL skips cleanup. Then `who`, `w` and
`last` cover current and past sessions, while `whoami` in the investigator's elevated shell reports
root — their effective identity, not the account that logged in — and `id` adds the group
memberships.

#### Knowledge check

1. Why is `ps aux` written without a hyphen, and what is the UNIX-style equivalent?
   `aux` is BSD-style option syntax, which takes no leading hyphen. `ps -ef` is the UNIX-style
   equivalent.
2. `free -h` shows very little in the "free" column. Is the system out of memory?
   Not necessarily — the kernel uses idle memory as reclaimable page cache. The "available" column is
   the one that reports what applications can still get.
3. `df` says the filesystem is full and `du` says the directory is nearly empty. What is going on?
   A deleted file is still held open by a running process, so its space is counted by `df` and
   invisible to `du` until that process closes it.
4. What is the difference between `kill` with no options and `kill -9`?
   The default sends SIGTERM, which the process can catch and handle cleanly; `-9` sends SIGKILL,
   which cannot be caught and skips all cleanup.
5. After `sudo -i`, what does `whoami` report, and which command reports the account that actually
   logged in?
   `whoami` reports root — the effective user. `logname`, or `who am i`, reports the original login
   name from the utmp record.
6. Which of these five commands shows a user's supplementary group memberships?
   `id`. Neither `whoami`, `who`, `w` nor `last` reports group membership.

<a id="s-command-line-networking-commands"></a>
## Networking commands

<a id="c-linux.command-line.general-networking-commands"></a>
### General networking commands
*id: `linux.command-line.general-networking-commands` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: iproute2-ip-address-man, iproute2-ss-man*

**What it is** The networking command family folded into Command Line in the 2025 update, when the
separate General Networking Commands competency was retired: checking a host's addresses and routes,
testing reachability, resolving names, listing listening sockets, and probing an HTTP service — all
from the shell.

**Why it matters** These commands form a diagnostic ladder, and the exam tests the ladder rather than
any single rung: address, then route, then reachability, then name resolution, then whether anything
is actually listening. Each rung also has a failure mode that looks like something else, which is the
discrimination being examined.

**How it works** `ip addr` lists interfaces with their addresses and states; `ip route` shows the
routing table, including the default gateway. Both come from iproute2, which replaced the older
net-tools `ifconfig` and `route` — those are deprecated and frequently not installed at all on a
modern distribution. `ping` sends ICMP echo requests, so success proves the host is reachable *and*
that ICMP is permitted; failure proves neither, because ICMP is very commonly filtered. `ss -tulpn`
lists sockets: `t` TCP, `u` UDP, `l` listening only, `p` the owning process, `n` numeric so no
service-name lookup happens. `dig` queries DNS servers directly, `traceroute` maps the path hop by
hop, `curl -I` fetches only response headers, and `hostname` prints the system's name.

**Key terms** iproute2; ICMP filtering; listening socket; resolver versus DNS.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip addr` | Show interfaces and their assigned addresses | `show dev eth0` to narrow, `add`/`del` to change | `ip addr` | Reaching for `ifconfig`, which is deprecated net-tools and often absent; and reading a `DOWN` interface state as an addressing problem |
| `ip route` | Show the routing table and the default gateway | `get 8.8.8.8` shows which route a destination would take | `ip route` | Assuming a missing default gateway would show up as a DNS failure; it shows up as unreachable destinations outside the local subnet |
| `ping` | Test reachability with ICMP echo requests | `-c N` stop after N packets, `-W` timeout, `-I` source interface | `ping -c4 example.com` | Concluding a host is down when ICMP is simply filtered — many firewalls drop echo requests while the service itself answers fine |
| `ss -tulpn` | List listening TCP and UDP sockets with ports and owning processes | `t` TCP, `u` UDP, `l` listening, `p` process, `n` numeric; `-a` includes established connections | `ss -tulpn` | Running it unprivileged and seeing no process names — the `p` column needs root for processes you do not own; and `ss` replaces the older `netstat` |
| `dig` | Query DNS directly and show the full answer | `+short` answer only, `@server` query a specific server, `-x` reverse lookup | `dig example.com` | Treating it as the system's view of name resolution — it queries DNS directly and ignores `/etc/hosts` and nsswitch; `getent hosts` follows the system's order |
| `traceroute` | Show the network path to a destination, hop by hop | `-I` use ICMP instead of the Linux default UDP probes, `-n` numeric, `-m` max hops | `traceroute example.com` | Reading a row of asterisks as a broken hop — routers commonly decline to answer probes while still forwarding traffic |
| `curl -I` | Issue an HTTP HEAD request and print only the response headers | `-I` headers only, `-L` follow redirects, `-v` show the exchange, `-k` skip certificate checks | `curl -I https://example.com` | Assuming HEAD and GET always behave identically — some servers handle them differently, so a working `-I` is not proof the body is served |
| `hostname` | Print the system's current hostname | `-f` fully qualified name, `-I` show configured addresses | `hostname` | Using `hostname newname` for a permanent change: it lasts until reboot, and `hostnamectl` is what persists it on systemd systems |

**Traps** `dig` succeeding while an application still cannot resolve the name is the sharpest
discrimination here: `dig` talks to the DNS servers in `/etc/resolv.conf` and skips `/etc/hosts`
entirely, whereas the application follows the order in `/etc/nsswitch.conf`, which normally consults
`/etc/hosts` first. Second, `dig` and `traceroute` are not part of a base install on most
distributions — they arrive with `bind-utils`/`dnsutils` and `traceroute` respectively, so "command
not found" is a packaging fact, not a networking symptom.

**What the exam may test** Choosing the right rung of the ladder for a described symptom, and
rejecting the two false conclusions the tools invite: that a failed `ping` proves a host is down, and
that a successful `dig` proves the system will resolve the name.

<a id="c-linux.command-line.port-ranges"></a>
### Port ranges
*id: `linux.command-line.port-ranges` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: rfc-6335, man-ip-7, kernel-ip-sysctl*

**What it is** IANA divides the TCP and UDP port space into three ranges: the System Ports, also
called the Well Known Ports, 0-1023; the User Ports, also called the Registered Ports, 1024-49151;
and the Dynamic Ports, also called the Private or Ephemeral Ports, 49152-65535, which are never
assigned to a service.

**Why it matters** The first boundary has a direct operational consequence: on Linux, binding a port
below 1024 requires privilege, which is precisely why an unprivileged service can listen on 8080 but
not on 80, and why containers and application servers are so often configured on high ports behind a
privileged reverse proxy.

**How it works** Ports below 1024 are privileged, or reserved, ports; on Linux only a process holding
the `CAP_NET_BIND_SERVICE` capability in the governing user namespace may bind one. That is usually
root, but the capability can be granted to a specific binary or a systemd unit without making it root
at all, which is how a modern web server binds 80 while running as an unprivileged user. The sysctl
`net.ipv4.ip_unprivileged_port_start` moves the boundary itself. The client end of a connection is
assigned automatically from an ephemeral range — and here the specification and the implementation
differ: the kernel's `net.ipv4.ip_local_port_range` defaults to 32768 through 60999, not the RFC's
49152-65535, so a real Linux client's source port usually falls in the User Ports range rather than
the Dynamic one.

**Key terms** privileged port; `CAP_NET_BIND_SERVICE`; ephemeral range; listening versus source port.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ss -tulpn` | Show which TCP and UDP ports are actually being listened on, numerically, and by which process | `t` TCP, `u` UDP, `l` listening, `p` owning process, `n` numeric ports | `ss -tulpn` | Dropping `n` and reading the service *name* from `/etc/services` as proof of what is running — the name is a lookup of the number, not an inspection of the process |

**Traps** Two confusions recur. The first is "well-known" versus "registered": 0-1023 are the
well-known or system ports and are the privileged ones; 1024-49151 are registered and are not
privileged, despite also being assigned by IANA. The second is treating both ends of a connection as
the service's port — a browser connecting to port 443 has 443 only on the server side, while its own
source port is an ephemeral one, which is why `ss` output shows one fixed port and many varying ones.

**What the exam may test** Reciting the three ranges and their boundaries, and explaining why a
non-root process is refused port 80 but allowed port 8080.

*Not to be confused with [well-known ports](../02-system-administration/networking.md#cmp-sysadmin.networking.well-known-ports).*

#### Scenario

An application is unreachable from a client machine. Working the ladder in order: on the server,
`ip addr` confirms the interface is up with the expected address and `ip route` confirms a default
gateway. From the client, `ping` times out — which proves nothing on its own, since ICMP is routinely
filtered — so the next check is whether anything is listening. `ss -tulpn` shows the process bound to
8080 rather than 80, and the reason is in the service unit: it runs as an unprivileged user, and
binding a port below 1024 requires `CAP_NET_BIND_SERVICE`. `curl -I http://localhost:8080` returns
headers locally, so the service is healthy and the published port is the problem. Meanwhile the
hostname resolves for a colleague but not for the application:
`dig` answers because it queries DNS directly, while the application follows the system's resolution
order and reads a stale `/etc/hosts` entry. A run of asterisks mid-path in `traceroute` is a router
declining probes, not a break.

#### Knowledge check

1. State the three IANA port ranges and their boundaries.
   System or well-known ports 0-1023; user or registered ports 1024-49151; dynamic, private or
   ephemeral ports 49152-65535.
2. Why can an unprivileged process bind port 8080 but not port 80?
   Ports below 1024 are privileged; on Linux binding one requires the `CAP_NET_BIND_SERVICE`
   capability, which an ordinary process does not hold.
3. A `ping` to a host times out. What can and cannot be concluded?
   Nothing conclusive: ICMP echo is commonly filtered, so the host may be perfectly healthy. Only a
   test against the actual service port settles it.
4. `dig app.internal` returns the right address, but the application still cannot resolve the name.
   Where should you look?
   `dig` queries DNS directly and skips `/etc/hosts` and nsswitch; the application follows
   `/etc/nsswitch.conf`, so check `/etc/hosts` and the resolver configuration — `getent hosts` shows
   the system's view.
5. Which option in `ss -tulpn` is responsible for showing raw port numbers instead of service names,
   and why does that matter?
   `n`. Without it, `ss` maps the number to a name from `/etc/services`, which describes what the port
   is conventionally for, not what is actually running on it.
6. What is the practical difference between the RFC's ephemeral range and Linux's actual one?
   RFC 6335 puts dynamic ports at 49152-65535, while the Linux default
   `net.ipv4.ip_local_port_range` is 32768-60999, so real client source ports usually fall inside the
   registered range instead.




