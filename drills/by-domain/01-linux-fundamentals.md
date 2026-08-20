<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Linux Fundamentals

160 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A backup script works perfectly when run by hand at the prompt, but fails to find its input file when the same script runs from a cron job. What is the most likely explanation?

- **A.** Cron strips environment variables the script needs to build the path, since cron jobs run with a stripped-down `PATH` and no interactive shell profile sourced
- **B.** The input file was renamed with a different case between the two runs
- **C.** Cron always runs scripts with `$PWD` unset, so any path lookup fails outright
- **D.** The script uses a relative path, and cron starts it from a different working directory

**Answer: D.** A relative path is resolved from the calling process's current working directory. Cron, a systemd unit, or a container entrypoint typically start with a different working directory than an interactive shell, so a relative path that works by hand can silently name the wrong file, or none, elsewhere.

- A is wrong: Cron does run a minimal environment, but the scenario describes a path lookup failure, not a missing variable.
- B is wrong: Nothing in the scenario indicates a name change; the same script works by hand and fails only from cron, which points at the environment, not the filename.
- C is wrong: Every process has a current working directory, and the shell cron starts sets `PWD` for itself; a lookup does not fail 'outright' for want of that variable, and the resulting error would differ from the one described.

### 2.

A directory was reached by following a symlink. Which command reports the physical location with the symlink resolved, rather than the logical path the shell has been tracking as text?

- **A.** Running `pwd -L`, the logical form and also the default behaviour
- **B.** `cd -P`, run with no other arguments
- **C.** `ls -ld` on the current directory, which prints the directory's own resolved physical path in the listing
- **D.** Running `pwd -P` to print the physical path with symlinks resolved

**Answer: D.** The shell tracks the working directory as a text string in `$PWD`, and plain `pwd` prints that logical path, following whatever symlinks were used to arrive. `pwd -P` instead prints the physical path with all symlinks resolved.

- A is wrong: `-L` is the logical form, and it is also the default; it returns the same symlink-preserving path plain `pwd` already gives.
- B is wrong: `cd -P` changes directory while resolving symlinks along the way; it does not print the current location the way `pwd` does.
- C is wrong: A long listing of the directory entry shows its mode, links, owner, size and name; it never prints the working directory's own pathname, resolved or otherwise.

### 3.

A shell script ends with the line `cd /var/log`, and the operator expects their interactive shell to land in `/var/log` after the script finishes. Why does the interactive shell stay exactly where it was?

- **A.** The script runs as a child process, and a child cannot change its parent's working directory
- **B.** `cd` inside a script is silently disabled for security reasons, since a script is assumed to run in a restricted, non-interactive shell that cannot change directories
- **C.** The path `/var/log` does not exist on most systems, so the `cd` fails quietly
- **D.** Only `cd -` can change a directory permanently; a bare `cd path` is temporary by design

**Answer: A.** A script runs as a child process, and the working directory is a per-process attribute. The child's `cd` changes only its own copy, which disappears when the child exits, leaving the calling shell exactly where it was.

- B is wrong: `cd` works normally inside a script; it changes the script's own working directory, it just cannot propagate that change back to the caller.
- C is wrong: `/var/log` is a standard, near-universal directory; the described behaviour happens whether or not the target exists, because it is about process inheritance.
- D is wrong: There is no such distinction; `cd -` simply returns to the previous directory and is subject to the same per-process scoping as any other `cd`.

### 4.

A command that works fine when typed at the prompt fails with "command not found" when the exact same line is placed inside a script. The command turns out to be an alias. Why does it fail only in the script?

- **A.** Aliases are copied into scripts automatically, so the failure must be a typo instead
- **B.** The script needs `export` applied to the alias before it can be used
- **C.** Aliases only work when defined inside the script file itself, never in `~/.bashrc`
- **D.** A script does not inherit aliases, because it runs in a non-interactive shell

**Answer: D.** A script runs in a non-interactive shell, and bash does not expand aliases there unless `expand_aliases` is set with `shopt`. A name that exists only as an alias in the interactive shell is therefore not found when the same line runs inside a script. `alias` itself, run with no arguments, lists every alias currently defined.

- A is wrong: Aliases are not automatically available to a script; that is precisely the mechanism causing the failure, not a separate typo.
- B is wrong: Aliases cannot be exported the way variables can; there is no export mechanism that makes an alias visible to a non-interactive shell.
- C is wrong: An alias can be defined in `~/.bashrc` and used freely at an interactive prompt; the issue is specifically that a non-interactive script does not expand aliases at all by default.

### 5.

One account has `rm` aliased to `rm -i` in its `~/.bashrc`; a server account does not. The same typed `rm somefile` command behaves differently on each. Which command reveals that an alias, rather than the plain binary, is actually running?

- **A.** `which rm`, since it reports the exact command that will execute, the same way it reports any other name found on `PATH`
- **B.** `type rm`, which distinguishes an alias from a function, a builtin, or a file on `PATH`
- **C.** `man rm`, since the man page documents any locally defined aliases
- **D.** `history | grep rm`, since a past invocation would reveal the alias definition

**Answer: B.** `type` distinguishes an alias from a function, a builtin and a file on `PATH`, while `which` cannot see the first three at all — it only reports the file `rm` would resolve to if there were no alias shadowing it.

- A is wrong: `which rm` reports the file on `PATH`, ignoring an alias entirely; it would show the same result on both accounts even though their actual behaviour differs.
- C is wrong: A man page documents the command itself, not a particular account's shell configuration; it has no way to reflect an alias defined in `~/.bashrc`.
- D is wrong: History records commands that were run, not their definitions; it does not show whether a name is currently aliased.

### 6.

An operator defines `alias ll='ls -alF'` directly at the prompt, uses it successfully for the rest of the session, then opens a brand-new terminal the next day and finds `ll` is gone. What was missing?

- **A.** The alias was never written to a startup file, so it did not persist past that one session
- **B.** Aliases automatically expire after 24 hours regardless of where they are defined
- **C.** The new terminal was opened as a different user, which does not share aliases
- **D.** `ll` collides with a built-in command name, and the shell silently drops any alias that would shadow a builtin

**Answer: A.** Aliases are defined in a shell startup file, conventionally `~/.bashrc`, and exist only inside the shell that read that file. Defining one at the prompt without saving it means it does not survive into a new shell session.

- B is wrong: Aliases have no built-in expiry; the only thing that ends one is the shell session closing, unless it was saved to a startup file.
- C is wrong: Nothing in the scenario indicates a different user; the described behaviour — an alias vanishing in a brand-new session — is the ordinary consequence of never saving it.
- D is wrong: Bash has no such rule: an alias is expanded before a builtin is looked up, so an alias may shadow one, and `ll` is not a bash builtin in any case.

### 7.

A nightly job takes `tar czf` snapshots of `/var/log/app` and keeps them as the sole recovery mechanism. Comparing archiving against an actual backup strategy, what is missing from relying on archives alone?

- **A.** Nothing is missing; a nightly `tar` archive already satisfies every backup requirement
- **B.** The job would need to switch to `zip` instead of `tar` to count as a real backup
- **C.** An archive is a one-off bundle at a point in time, not a managed, retained set of independent recovery copies
- **D.** Archives cannot be restored at all; only continuous replication to a second host produces recoverable data, because `tar` removes the originals as it bundles them

**Answer: C.** Archiving with `tar` bundles files into one stream at a point in time; it is a tool a backup strategy can use, but retention, verification and a restore plan are what turn a one-off archive into an actual backup — the two are related but distinct. Compressing a single stream on its own, independent of tar, is the job of `gzip`; unpacking a zip container instead of a tar archive is `unzip`.

- A is wrong: Treating an archive as automatically equivalent to a full backup strategy overlooks retention and restore planning, which is exactly the confusable pair this scenario is built around.
- B is wrong: The archive format is not the issue — `zip` also bundles and compresses without addressing retention or restore planning any more than `tar` does.
- D is wrong: A `tar` archive is fully restorable with `tar xzf`, and `tar` does not remove the files it archives - `--remove-files` is a separate opt-in option; the gap this scenario is about is retention and a documented recovery process, not restorability.

### 8.

An operator writes `tar -cfz logs.tar.gz /var/log`, with a leading hyphen, intending to create a gzip-compressed archive. What does GNU tar actually do with that command line?

- **A.** A correctly gzip-compressed `logs.tar.gz`, because GNU tar reorders the letters of a cluster before it parses them
- **B.** It takes the letter `z` as the archive name, because in a hyphenated cluster the option that needs an argument has to come last
- **C.** An uncompressed archive correctly named `logs.tar.gz`, because a cluster silently drops any letter placed after the one that takes an argument
- **D.** A zip-format archive rather than a tar archive, because `z` selects the zip container whenever it follows `f`

**Answer: B.** Clustering only applies to short options that take no argument, and the option that takes a value must come last in the cluster, which is why `tar czf` works and `tar cfz` does not — writing `f` before its value is expected breaks the intended result.

- A is wrong: GNU tar does not reorder a hyphenated cluster; `f` takes the next word in cluster order, which here is the letter `z` itself. Without the leading hyphen this would be traditional style, where "the arguments are read in the same order as the option letters" and `tar cfz logs.tar.gz /var/log` does work.
- C is wrong: Nothing is dropped: `z` is consumed as `f`'s argument, so the file GNU tar creates is named `z`, and `logs.tar.gz` is treated as an input path it then fails to stat.
- D is wrong: `z` selects gzip compression for a tar archive and never switches to the unrelated zip format; here it is not acting as an option at all, having been consumed as `f`'s argument.

### 9.

Before extracting an unfamiliar archive with `tar xzf`, an operator wants to know whether it will unpack into its own subdirectory or scatter its files across the current directory. Which habit answers that safely, without extracting anything yet?

- **A.** Running `gzip -l` on the archive to preview its member list
- **B.** Extracting it once into a throwaway directory and deleting the result if it looks wrong
- **C.** Listing its contents first with `tar tzf`
- **D.** Running `file` on the archive to read its internal directory structure

**Answer: C.** An archive whose members are stored with a leading path component unpacks into that directory, while one built from bare filenames scatters them across the current directory — listing first with `tar tzf` is the habit that reveals which case applies before anything is extracted.

- A is wrong: `gzip -l` reports compressed and uncompressed size information about a `.gz` stream; it does not list a tar archive's individual member files.
- B is wrong: Listing first with `tar tzf` answers the question without extracting anything at all, which is safer and faster than a trial extraction.
- D is wrong: `file` reports the archive's overall type from its magic bytes, such as "gzip compressed data"; it does not enumerate the individual paths stored inside.

### 10.

A task asks to print the third whitespace-separated column of a report where the columns are separated by a ragged, variable number of spaces. Comparing awk against sed for this job, which is the right tool, and why?

- **A.** sed, because its substitution syntax can target any column position directly
- **B.** awk, because it splits each line into fields and a run of whitespace is its default separator
- **C.** Either works identically, since both are line-oriented text tools that read one line of input at a time and write one line of output
- **D.** `cut`, because it always handles variable-width columns as easily as fixed-width ones

**Answer: B.** awk reads input one record at a time, splits it into fields, and its default field separator is a run of whitespace with leading and trailing whitespace ignored — exactly why `awk '{print $3}'` correctly picks a column even when the spacing is ragged, which sed and `cut` cannot do as naturally. Run with no field reference at all, plain `awk` still applies its pattern-action pairs to every input record.

- A is wrong: sed operates on the line as an undivided string for substitution and deletion; it has no native concept of numbered fields the way awk does.
- C is wrong: awk and sed differ specifically on whether the unit of work is fields or the whole line, which is exactly why one fits a columnar task and the other does not.
- D is wrong: `cut` splits on a single fixed delimiter character, so repeated spaces each count as a separate delimiter and produce empty fields on ragged columnar output.

### 11.

An operator writes `awk "{print $1}" /etc/passwd` inside double quotes and gets empty output with no error. What consumed the `$1` before awk ever ran?

- **A.** awk itself does not support `$1` as field syntax; only `$NF` is valid, because awk can address a record's last field by name but no earlier field by number
- **B.** `/etc/passwd` has no first field, so `$1` legitimately prints nothing
- **C.** The shell expanded `$1` as its own positional parameter, usually empty, before awk saw the program
- **D.** awk requires `-F` to be set before any field variable will be recognised

**Answer: C.** Single-quoting the program is essential. Inside double quotes the shell expands `$1` first, so awk receives an empty program fragment and prints empty lines with no error to explain it.

- A is wrong: `$1` is valid awk field syntax; the problem here is that the shell consumed it before awk ever received the program text.
- B is wrong: `/etc/passwd` does have a first, colon-delimited field — the username — so a working `$1` reference would print it; the empty output is a quoting problem, not a data problem.
- D is wrong: `$1` is recognised without `-F`; that flag only changes the field separator, not whether field variables are read at all.

### 12.

A colon-delimited file has some rows with consecutive colons producing empty fields, and the task is to extract the fourth field with awk using `-F:`. What happens to a run of consecutive delimiters when the separator is set to a single explicit character this way?

- **A.** Consecutive delimiters are automatically collapsed into one, the same as the default whitespace behaviour
- **B.** Every occurrence separates a field, so consecutive delimiters produce empty fields between them
- **C.** awk raises an error whenever two delimiters appear next to each other
- **D.** The field numbering resets at each empty field, so `$4` no longer refers to the fourth field

**Answer: B.** The default field separator is a run of whitespace, with leading and trailing whitespace ignored — but with an explicit single-character separator set by `-F`, every occurrence separates a field, so consecutive delimiters produce empty fields.

- A is wrong: The whitespace-collapsing behaviour applies only to the default separator; an explicit single-character separator like `-F:` does not collapse repeats.
- C is wrong: awk does not error on adjacent delimiters; it simply produces an empty field between them, silently.
- D is wrong: Field numbering is a straightforward left-to-right count including empty fields; it does not reset partway through a record.

### 13.

A repository built on macOS, whose default filesystem is case-insensitive but case-preserving, is extracted on a Linux server running ext4. It contained both `Readme.md` and `readme.md`, which macOS treated as one file. What happens on the Linux server?

- **A.** Only one file survives, since Linux also folds case for compatibility with common archive tools
- **B.** Both names extract as two separate files, since ext4 compares names byte for byte
- **C.** The extraction fails outright, since ext4 rejects archives containing case collisions
- **D.** Both names extract to the same file, whichever was written last silently overwriting the other

**Answer: B.** Case sensitivity is a property of the filesystem, not of Linux itself. ext4 compares names byte for byte, so a repository built on a case-insensitive, case-preserving filesystem like macOS's default can expand on Linux into two files where the author saw one.

- A is wrong: Linux performs no case folding of its own on the filesystems it is normally installed on; the shell, `ls` and glob patterns all match exactly.
- C is wrong: There is no such rejection; ext4 simply stores both names as distinct entries, which is precisely the behaviour that surprises someone used to a case-insensitive filesystem.
- D is wrong: That overwrite behaviour is what a case-insensitive filesystem does; ext4 is case-sensitive and keeps both names as separate files instead.

### 14.

A script fails with "No such file or directory" for `Config.yaml`, even though a file is clearly present in the directory when listed. Which mismatch is most likely, given that Linux filesystems compare names exactly?

- **A.** The file is hidden as a dotfile and must be revealed with `ls -la` before the script can see it
- **B.** The file has the wrong extension, and Linux enforces extensions for configuration files
- **C.** Case does not matter here; the real cause must be a permissions problem instead, since restrictive permissions are the most common reason a script can't open a file that is clearly visible in a listing
- **D.** The actual file is named `config.yaml`, and the two names are simply different files on a case-sensitive filesystem

**Answer: D.** On the filesystems Linux normally runs on, filenames are compared byte for byte, so `Config.yaml` and `config.yaml` are two different names. A script that names one while the actual file is the other fails with an error that reads like a missing file rather than a spelling difference.

- A is wrong: Dotfile visibility is a display convention affecting `ls`, not a factor in whether a script can open a file it names directly by an exact path.
- B is wrong: Linux attaches no meaning to a filename extension at all, so an extension mismatch would not itself explain "No such file or directory."
- C is wrong: A permissions problem produces "Permission denied," not "No such file or directory," so the wording of the error points at a naming mismatch rather than access control.

### 15.

Compare `cd /tmp/build; rm -rf *` with `cd /tmp/build && rm -rf *`. If the `cd` fails because the directory does not exist, what happens under each?

- **A.** Both forms behave identically, since `&&` and `;` differ only in style, not in effect
- **B.** The `;` form still runs the deletion, wherever the shell happens to be; the `&&` form does not run it at all
- **C.** Neither form runs the deletion, since a failed `cd` aborts the entire line
- **D.** The `&&` form still runs the deletion and the `;` form does not, because `&&` joins commands unconditionally while `;` waits for a zero exit status

**Answer: B.** `;` runs the next command unconditionally. `&&` runs it only if the previous command exited 0. So `cd /tmp/build; rm -rf *` still deletes in whatever directory the shell happened to be if the `cd` fails, while the `&&` form protects against exactly that.

- A is wrong: `;` ignores exit status entirely while `&&` branches on it, which is exactly the safety-relevant difference between running a deletion unconditionally and running it only after a successful `cd`.
- C is wrong: A failed `cd` does not abort the rest of a `;`-joined line; only the conditional operators branch on the previous command's status.
- D is wrong: It is the other way round: bash documents `command1 && command2` as running command2 if and only if command1 returns zero, while `;` simply separates commands and imposes no such condition.

### 16.

A health check should print "unreachable" only when a ping fails, and should not run at all when the ping succeeds. Which operator connects the two commands to produce that behaviour?

- **A.** `&&`, run only if the previous command succeeded
- **B.** `;`, which runs the second command regardless of the outcome
- **C.** A pipe, so the ping's output feeds directly into the message command
- **D.** `||`, run only if the previous command exited non-zero

**Answer: D.** `||` runs the next command only if the previous one exited non-zero. `ping -c1 host || echo unreachable` prints the message exactly when the ping fails, and does nothing when it succeeds.

- A is wrong: `&&` runs the right side only on success, the opposite of what is needed here — the message should appear precisely when the ping fails.
- B is wrong: `;` ignores exit status entirely, so it would print "unreachable" every time, including when the ping succeeds.
- C is wrong: A pipe connects standard output to standard input; it does not branch on exit status at all, so it cannot produce "run only on failure" behaviour.

### 17.

In `a && b || c`, `a` succeeds but `b` then fails. Which commands actually ran, and why does this chain not behave like an if/then/else?

- **A.** Only `a` and `b` ran; `c` never runs once `a` has already succeeded
- **B.** Only `a` ran, since its success short-circuits the rest of the line entirely
- **C.** The chain raises a syntax error, since `&&` and `||` cannot be combined on one line
- **D.** All three ran, because `||` also reacts to `b`'s failure, not just `a`'s

**Answer: D.** The operators associate left to right with equal precedence, which is why `a && b || c` is not an if/then/else: if `a` succeeds but `b` then fails, `c` runs too, because `||` reacts to the failure of everything to its left, not specifically to `a`.

- A is wrong: `||` reacts to the exit status of everything to its left, including `b`'s failure, not just whether `a` in particular succeeded.
- B is wrong: `&&` runs `b` because `a` succeeded; short-circuiting stops the *skipped* branch, not the one that is supposed to run next.
- C is wrong: Combining `&&` and `||` on one line is valid syntax; the two operators have equal precedence and associate left to right, which is what produces the behaviour the key describes.

### 18.

A script runs a command, then a moment later checks `$?`, but has printed a status message with `echo` in between. What value does `$?` actually report at that point?

- **A.** The original command's status, since `echo` does not affect shell parameters
- **B.** The logical OR of both commands' statuses
- **C.** Whatever `PIPESTATUS` recorded for the last pipeline that ran
- **D.** The exit status of the `echo` command itself, not the original command

**Answer: D.** `$?` holds the status of the most recently completed foreground command. Running any other command first — including the `echo` used to report it — overwrites that value, so it must be checked immediately. Checking it manually is always `echo $?`, run immediately after the command in question.

- A is wrong: `echo` is a command like any other and sets its own exit status when it finishes, overwriting whatever `$?` held immediately before.
- B is wrong: `$?` holds a single command's status, not a combination of several; there is no such OR-of-statuses behaviour in the shell.
- C is wrong: `PIPESTATUS` is a separate array populated only after a pipeline, and nothing in the scenario involves one; `$?` simply reflects the single most recently completed command.

### 19.

A script treats `grep pattern file.txt` returning a non-zero status as proof that something went wrong. `grep` exits 1 here. Is that conclusion correct?

- **A.** Yes — any non-zero status from any command always indicates a real failure
- **B.** No — `grep` returns 1 to mean "no lines matched," and reserves 2 for a real error
- **C.** No — but only because the file was empty, which always forces status 1
- **D.** Yes — `grep` is the one exception where 1 and 2 both mean the same generic failure

**Answer: B.** `grep` returns 1 when it simply found no matching line and 2 when it hit a real error, so treating grep's 1 as a failure of the search misreads an ordinary, expected outcome.

- A is wrong: Several tools, `grep` among them, define non-zero values that are not errors; treating every non-zero status as failure misreads exactly this case.
- C is wrong: Status 1 from `grep` means no matching line was found, regardless of whether that is because the file is empty or simply lacks the pattern; file emptiness is not a separate special case.
- D is wrong: `grep` distinguishes the two: 1 means no match, 2 means an actual error occurred, so they are not the same outcome collapsed into one meaning.

### 20.

A process is killed by SIGKILL, signal number 9. What exit status does the shell report for it, and what is the general rule this follows?

- **A.** 9, the signal number itself, reported directly as the exit status
- **B.** 126, the same status used for a command that is found but not executable
- **C.** 137, because a signal death reports 128 plus the signal number
- **D.** 1, the generic failure value used whenever a process does not exit cleanly

**Answer: C.** A command killed by signal N returns 128 plus N, so a process killed by SIGKILL (9) reports 137, and one killed by SIGTERM (15) reports 143. A command not found returns 127, and one found but not executable returns 126.

- A is wrong: The raw signal number is not used directly as the exit status; the shell reports 128 plus the signal number instead, giving 137 for SIGKILL.
- B is wrong: 126 specifically means the command was found but could not be executed; a signal death is a distinct case reported as 128 plus the signal number.
- D is wrong: Status 1 is a generic tool-defined failure value; a signal death has its own specific convention of 128 plus the signal number, not the generic 1.

### 21.

A backup script names its archive `backup-$(date +%F).tar.gz` so the filename includes today's date. What does `$(date +%F)` actually do inside that word?

- **A.** It pipes the archive's contents through the `date` command before naming the file
- **B.** It is arithmetic expansion, evaluating `date +%F` as a numeric expression
- **C.** It runs `date +%F` and splices its standard output into the surrounding word
- **D.** It reads `date +%F` as literal text and inserts it unchanged into the filename

**Answer: C.** Command substitution runs the inner command in a subshell, captures its standard output, strips trailing newlines, and splices the result into the surrounding word — which is exactly how `backup-$(date +%F).tar.gz` gets today's date baked into the archive name.

- A is wrong: Command substitution captures a command's output to build an argument; it does not pipe data between two commands the way a pipe operator does.
- B is wrong: Arithmetic expansion is written `$(( ... ))` and evaluates numbers; `$( ... )` with single parentheses runs a command and captures its output instead.
- D is wrong: That would be the result of quoting the whole expression in single quotes; the unquoted `$(...)` form actively runs the command rather than treating it as literal text.

### 22.

`echo` does not read standard input. Given that, how can a value produced by another command still become an argument to `echo`?

- **A.** A pipe, since piping works regardless of whether the receiving command reads standard input
- **B.** Command substitution, since it turns a command's output into an argument rather than feeding it as input
- **C.** Redirection with `<`, since it feeds a value directly into any command's arguments the same way a pipe feeds standard input
- **D.** There is no way to do this; `echo` can only ever print literal text typed after it

**Answer: B.** A pipe sends output to another command's standard input; substitution turns output into arguments instead. A command that does not read standard input, such as `echo` or `rm`, can only be fed by substitution.

- A is wrong: A pipe only helps if the receiving command reads standard input; `echo` does not, so piped text would simply be discarded.
- C is wrong: `<` feeds a file to standard input, the same channel `echo` does not read; it does not place anything into the argument list.
- D is wrong: Command substitution specifically exists to solve this — turning another command's output into an argument for a command that never reads standard input.

### 23.

An operator types `ls -la` to see hidden files in long format. Which two single-letter options does that one hyphenated word actually expand to?

- **A.** `-l` and `-a`, clustered behind one leading hyphen
- **B.** `-l` and `-A`, since a clustered letter is read case-insensitively
- **C.** A single long option spelled with one leading hyphen
- **D.** `-l` only, with the trailing `a` passed on as a separate operand

**Answer: A.** Short options take one hyphen and a single letter, and may be clustered behind one hyphen, so `ls -la` is exactly `ls -l -a`. Long options take two hyphens and a whole word and may never be clustered this way. Written without clustering, the same request is `ls -l`.

- B is wrong: Clustering does not fold case; `-a` and `-A` are different options with different meanings for dotfiles.
- C is wrong: A single hyphen introduces a cluster of short options; a long option always needs two hyphens.
- D is wrong: Every letter after the single hyphen is parsed as its own clustered option, not as text handed to the command.

### 24.

A script written for a GNU/Linux server uses `ls --all` to show dotfiles, then is copied to run unmodified on a macOS workstation. What happens on macOS?

- **A.** It runs identically, since long options are part of the POSIX utility syntax
- **B.** It silently lists nothing, because macOS treats an unknown flag as matching zero files
- **C.** It behaves the same as `ls -A`, since macOS maps unknown long options to the nearest short one
- **D.** The BSD `ls` on macOS rejects `--all`, though `-a` still works there

**Answer: D.** The GNU coreutils `ls --all` is equivalent to `-a`, but long options are a GNU convention, not a POSIX one, so a BSD or macOS userland can reject them outright even while the short forms keep working.

- A is wrong: POSIX defines only single-character options; long options like `--all` are a GNU extension with no portability guarantee.
- B is wrong: An unrecognized option is reported as an error, not treated as a filter that matches nothing.
- C is wrong: There is no such fallback mapping; an unsupported long option is simply rejected.

### 25.

A directory contains a file literally named `-r`, and a command needs to operate on it without the shell reading `-r` as an option. Which construct marks the end of options so a following operand starting with a hyphen is treated as a filename?

- **A.** Wrapping the filename in single quotes
- **B.** Escaping the leading hyphen with a backslash
- **C.** A standalone `--` placed before the filename
- **D.** Prefixing the filename with `./`

**Answer: C.** A double hyphen on its own marks the end of options, so any operand after it — including one that starts with a hyphen — is treated as an operand rather than parsed as an option.

- A is wrong: Quoting stops the shell from expanding the word, but the command itself would still parse a leading hyphen as an option.
- B is wrong: A backslash escapes shell metacharacters; a hyphen has no special meaning to the shell, so this changes nothing about how the command parses its arguments.
- D is wrong: Writing `./-r` does keep the argument from beginning with a hyphen, but it works by rewriting the pathname itself rather than by marking where options stop, and it does nothing for an operand that is not a pathname.

### 26.

A deployment script needs to create `/srv/app/logs/2026` in one step, even when `/srv/app/logs` does not exist yet, and must not fail if the full path already exists from a previous run. Which command satisfies both requirements?

- **A.** Running plain `mkdir /srv/app/logs/2026` without the parents flag, since `mkdir` creates any missing parents whenever the final component is new
- **B.** Running `touch /srv/app/logs/2026` to bring the path into existence
- **C.** Running `mkdir -p /srv/app/logs/2026` to create every missing parent in one step
- **D.** Running `cp -r /srv/app/logs /srv/app/logs/2026` to duplicate the parent tree

**Answer: C.** `mkdir -p` creates every missing parent directory in the path and succeeds even if the target already exists, which is exactly what an idempotent deployment script needs. `cp -r` is the recursive-copy sibling worth knowing alongside `mkdir -p`.

- A is wrong: Without `-p`, `mkdir` fails with "No such file or directory" the moment an intermediate parent is missing, and it also errors on a directory that already exists.
- B is wrong: `touch` creates or updates a file's timestamps; it does not create directories at all.
- D is wrong: Copying a directory tree is unrelated to creating a new, empty nested directory, and would require the source to already exist.

### 27.

An operator wants to remove a directory only if it is completely empty, and to be told about it if it is not, rather than having the contents silently swept away. Which command gives that behaviour?

- **A.** Running `rm -r`, which recurses through the tree and clears everything it finds
- **B.** Running `rm -i` and confirming each file individually as it goes
- **C.** Running `rmdir` against the target directory, refusing outright if anything remains inside
- **D.** `mv` to a temporary location before deleting, since relocating a directory and then removing it from its new location produces the same end result as deleting it directly

**Answer: C.** `rmdir` removes a directory only if it is empty, failing on any directory that still has contents. `rm -r` recurses and removes everything regardless.

- A is wrong: `rm -r` recurses into a directory and deletes everything inside it without stopping to check whether it was empty.
- B is wrong: Prompting per file still allows the deletion to proceed once confirmed; it does not refuse based on the directory being non-empty the way `rmdir` does.
- D is wrong: Moving the directory sidesteps the question rather than answering it, and does not on its own refuse to act on non-empty contents.

### 28.

A script runs `rm -rf "$DIR/"` at a stage where `$DIR` turns out to be unset. What single operand does the shell hand to `rm`?

- **A.** No operand at all, so `rm` exits immediately with a usage error
- **B.** The literal text `$DIR/`, since the shell leaves an unset variable's name in place
- **C.** `.`, since the shell substitutes the current directory for a missing path segment
- **D.** `/`, because the empty expansion leaves only the trailing slash behind

**Answer: D.** `rm -rf $DIR/` is catastrophic when `$DIR` is unset or empty, because the shell expands it to `rm -rf /` before `rm` ever sees anything — GNU `rm` refuses to act on `/` itself by default, but happily removes directories one level down if a variable expanded to nothing higher in the path.

- A is wrong: The trailing slash in `"$DIR/"` survives the expansion of the empty variable, leaving a real operand rather than none.
- B is wrong: Parameter expansion runs whether or not the variable is set; an unset variable expands to the empty string, not to its own name.
- C is wrong: There is no such substitution; the shell performs no fallback to `.` when a variable is empty — it simply expands to nothing.

### 29.

A pipeline runs `uniq -c access.log` directly, without sorting first, hoping to count how many times each line repeats. The counts come out wrong, with the same line counted separately in several places. Why?

- **A.** `uniq -c` is the wrong flag; `-d` is needed to count duplicates
- **B.** `uniq` only collapses adjacent duplicate lines, and the file was never sorted
- **C.** `access.log` needs to be piped through `wc -l` first to normalise line endings
- **D.** `uniq` requires `cut` to run first to isolate a single column before counting

**Answer: B.** `uniq` compares only adjacent lines. That single fact makes `sort` a prerequisite rather than a stylistic choice — running `uniq -c` on unsorted input scatters identical lines and each is reported separately instead of merged into one count. Setting the delimiter is always `cut -d`, paired with `-f` to name the field.

- A is wrong: `-c` is exactly the flag that prefixes each line with its count; `-d` instead restricts output to only the duplicated lines, without counts.
- C is wrong: `wc -l` only counts lines; it does not reorder or normalise them, and would not affect whether duplicates are adjacent.
- D is wrong: `uniq` compares whole lines by default and works without `cut`; the missing step here is sorting, not field extraction.

### 30.

Comparing `sort -u names.txt` with `uniq -u`, both of which mention "unique," do they select the same lines?

- **A.** Yes — both produce the same output whenever the input is sorted first, because sorting is the only thing that separates discarding duplicates from discarding lines that repeated
- **B.** Yes, but only `uniq -u` also produces a count of how many times each line appeared
- **C.** No — `sort -u` requires piping through `uniq` first before it can run at all
- **D.** No — `sort -u` keeps one copy of every distinct line; `uniq -u` keeps only lines that never repeated at all

**Answer: D.** `sort -u` and `uniq -u` mean opposite things: `sort -u` keeps one copy of every distinct line, including ones that repeated, while `uniq -u` keeps only lines that never repeated — both require sorted input, but they answer different questions.

- A is wrong: Even on sorted input the two select differently: `sort -u` keeps one copy of every line including repeats, while `uniq -u` drops every line that repeated at all.
- B is wrong: `uniq -u` prints no counts; `uniq -c` is the option that prefixes counts, a separate flag from `-u`.
- C is wrong: `sort -u` is a self-contained option on `sort` that discards duplicates as it orders lines; it has no dependency on `uniq` running beforehand.

### 31.

A colon-delimited `/etc/passwd`-style file needs just the first field — the username — printed for every line. Which command does that directly?

- **A.** `sort -k1 /etc/passwd`, since `-k` selects a specific field to work with
- **B.** `wc -l /etc/passwd`, since it reports on the first line of structured input
- **C.** `uniq -c /etc/passwd`, since it summarises the first column by default and reduces each line to that column with a count in front
- **D.** Running `cut -d: -f1 /etc/passwd` to split on the colon and take the first field

**Answer: D.** `cut -d: -f1` splits on the colon delimiter and prints the first field, which is exactly the username column in a colon-delimited file like `/etc/passwd`.

- A is wrong: `-k` chooses a sort key for ordering lines; it does not extract or print only that field on its own.
- B is wrong: `wc -l` counts newline characters across the whole file; it has nothing to do with extracting a specific field from each line.
- C is wrong: `uniq -c` collapses adjacent duplicate whole lines and prefixes a count; it does not extract or restrict output to a single field.

### 32.

Running `diff -u old.conf new.conf` produces a unified-format hunk with a line prefixed `-` and another prefixed `+`. Which file does the `-` line come from?

- **A.** The second file, `new.conf` — the operands are read right to left
- **B.** The first file, `old.conf`, which is present there and absent from `new.conf`
- **C.** Neither file specifically; `-` marks a line that was moved rather than added or removed
- **D.** Whichever file is alphabetically first, regardless of command-line order

**Answer: B.** Unified output shows a `---` header for the first file and a `+++` header for the second, with changed lines prefixed `-` (removed from the first) and `+` (added in the second) — reversing the operands inverts the meaning of every line. The unified form that produces this exact output is `diff -u`.

- A is wrong: The operands are read left to right, matching the order given on the command line, so `-` corresponds to the first-named file, not the second.
- C is wrong: Unified diff has no separate "moved" marker; a line simply present in one file and absent in the other shows as removed (`-`) or added (`+`).
- D is wrong: The assignment of `-` and `+` follows the order the files were given on the command line, not alphabetical order.

### 33.

Two binary files need to be checked for whether they are byte-for-byte identical across two different machines. Comparing `diff`, `cmp`, and a checksum tool, which is the right choice, and why do the other two fall short?

- **A.** `diff`, since its unified format applies equally well to binary and text files
- **B.** `cmp`, since it can compare two files that are not both present on the same machine
- **C.** A checksum tool such as `sha256sum`, since it gives a comparable fingerprint without transferring either file
- **D.** Any of the three works equally well for this task, since all three reduce to the same byte-level comparison once given two files as arguments

**Answer: C.** For binary files, `diff` only reports that they differ; `cmp` gives the first differing byte but still needs both files locally; a checksum tool such as `sha256sum` is the right way to ask "are these two files identical" across separate machines.

- A is wrong: `diff` on binary files only reports that they differ, without showing a unified hunk the way it does for text.
- B is wrong: `cmp` reports the first differing byte, but it needs direct access to both files at once, so it cannot compare files that are only ever present on separate machines.
- D is wrong: Only a checksum tool avoids needing both files present together and gives a fingerprint suited to cross-machine comparison; the other two require direct, simultaneous access to both files.

### 34.

A script runs `diff a.conf b.conf && echo same` to report whether two config files match, and the message never prints even when they visibly differ, which the script treats as a bug in `diff`. Is that the right read of `diff`'s exit status here?

- **A.** Yes — `diff` should exit 0 whenever it successfully compares two files, differences or not
- **B.** No — but only because `.conf` files always trigger status 2 regardless of content
- **C.** Yes — `&&` requires exit status 1 specifically to run the next command, so a `diff` that finds differences is exactly what should have triggered the echo
- **D.** No — `diff` exits 1 when files differ, which is its normal, correct outcome, not a malfunction

**Answer: D.** `diff`'s exit status is 0 when the files are identical, 1 when they differ, and 2 on trouble — a difference correctly makes `diff a b && echo same` skip the echo, which is the expected outcome, not a bug.

- A is wrong: `diff` reserves 0 specifically for identical files; a successful comparison that finds a difference still reports 1, by design.
- B is wrong: The extension of the files has no bearing on the exit status; status 2 is reserved for genuine trouble such as a missing file, not for any particular file type.
- C is wrong: `&&` runs the next command only on exit status 0; status 1 is exactly what causes `&&` to skip the following command, which is the behaviour observed here.

### 35.

A crontab carries the environment line `ARCHIVE=~/archive`, and the job that later uses `$ARCHIVE` fails because the path stays literally `~/archive`. A `..` written into that same value resolves normally. Why does the tilde fail where `..` does not?

- **A.** Cron treats `~` as a comment character and discards the rest of the line
- **B.** `..` is also unreliable in a crontab, so the job likely fails for a different reason entirely
- **C.** `~` is shell syntax, and cron assigns that line's value verbatim without a shell
- **D.** `~` only expands inside double quotes, and the crontab line was unquoted

**Answer: C.** Tilde expansion is performed by the shell before a command runs. Files like a crontab or a systemd unit are read directly, with no shell involved, so a tilde written there stays literal, while `.` and `..` are real directory entries the kernel resolves wherever a path is accepted.

- A is wrong: crontab(5) makes only a line whose first non-whitespace character is a pound sign a comment; a tilde carries no comment meaning and the value is passed through intact.
- B is wrong: path_resolution(7) states that every directory has the entries `.` and `..` with their conventional meanings, so `..` is resolved by the kernel in any pathname, including one cron hands to a program.
- D is wrong: bash(1) requires the tilde to be unquoted, so quoting suppresses expansion rather than enabling it, and crontab(5) says quotes around a value only preserve leading and trailing whitespace.

### 36.

An operator `cd`s into a directory through a symlink and then runs `cd ..`. The result is not the directory that physically contains the symlink's target. What explains this?

- **A.** Bash's `cd ..` is logical by default, stripping the last component of `$PWD` as text
- **B.** The symlink itself was deleted between the two commands, which makes the shell fall back to the physical parent
- **C.** `..` at the root of a symlinked mount always resolves to `/` regardless of position
- **D.** Only `~` behaves this way; `..` always matches the kernel's physical parent

**Answer: A.** In bash, `cd ..` is logical by default: the shell strips the last component from `$PWD` textually. After arriving through a symlink, that can land somewhere different from what `..` physically points at on disk; `cd -P ..` follows the physical structure instead.

- B is wrong: Nothing in the scenario suggests the symlink vanished, and removing it would not retroactively change the `$PWD` string the shell had already recorded; the discrepancy is the ordinary result of logical-versus-physical resolution.
- C is wrong: That special case applies only to `..` evaluated at the actual filesystem root, not to an ordinary directory reached through a symlink elsewhere in the tree.
- D is wrong: Bash's default `cd ..` is explicitly logical, tracking `$PWD` as text, which is exactly why it can diverge from the kernel's physical parent.

### 37.

An operator runs `cd '~'`, intending to go to their home directory, and instead gets "No such file or directory". What went wrong?

- **A.** `cd` never accepts `~` as an argument, because the builtin requires either an absolute path or a plain directory name
- **B.** Quoting the tilde suppressed expansion, so the shell looked for a directory literally named `~`
- **C.** The account's `$HOME` variable was never set, so expansion had nothing to substitute
- **D.** The home directory does not exist on this system, independent of quoting

**Answer: B.** Tilde expansion happens only when the tilde is unquoted and starts a word. `'~'` and `"~"` are both literal, so `cd '~'` tries to enter a directory actually named `~` rather than the account's home directory.

- A is wrong: bash(1) documents unquoted `cd ~` as a normal way to reach the home directory, and `cd` accepts relative pathnames as well; the failure here is caused specifically by the quoting.
- C is wrong: An unset `$HOME` would also break the unquoted form; the scenario's failure is produced by the quotes, which suppress expansion regardless of `$HOME`.
- D is wrong: Nothing in the scenario indicates a missing home directory; the described symptom is the classic result of quoting a tilde.

### 38.

A symlink points at a large file, and an operator wants a copy of the symlink itself — a small file pointing at the same target — rather than a full copy of the target's contents. Plain `cp` does not give that. Which option does?

- **A.** `cp -L`, since dereferencing is what tells `cp` to copy the link entry itself
- **B.** `ln -s` run against the copy after the fact, to convert it back into a link
- **C.** `mv` instead of `cp`, since moving preserves everything by definition
- **D.** `cp -a`, which preserves symlinks instead of following them

**Answer: D.** Plain `cp` follows a symbolic link and copies the target's contents, and so do `cp -L` and `cp -p`. Archive mode `cp -a` expands to `-dR --preserve=all`, and its `-d` (`--no-dereference`) component is what preserves the link itself; `cp -d`, `cp -P` and recursive `cp -r` preserve links for the same reason. The same family also covers `ls -la` for a full listing, `stat` and `file` for inspecting an entry, `mv` for relocation, `ln -s` for creating a link, and `rm -i` for a confirmed removal.

- A is wrong: `-L` is `--dereference`, documented as "always follow symbolic links in SOURCE", so it produces a full copy of the target's contents, which is the opposite of what is wanted.
- B is wrong: By that point the full target contents have already been copied; recreating a symlink afterward does not undo the unwanted full copy.
- C is wrong: `mv` relocates the symlink rather than copying it, which is a different operation entirely and does not answer "how do I copy a symlink as a symlink."

### 39.

An operator runs `ln -s config.yaml /etc/app/current.yaml` while standing in `/home/ops`, expecting the link to point at `/home/ops/config.yaml`. Where does the link actually resolve, and why?

- **A.** To `/home/ops/config.yaml`, because the target is always resolved from the working directory at creation time
- **B.** The link creation fails outright, since `config.yaml` is not an absolute path
- **C.** To `/etc/app/config.yaml`, because a relative target is resolved from the link's own directory
- **D.** To whichever `config.yaml` is found first on `PATH`

**Answer: C.** `ln -s` records exactly the text it is given as the link's target. A relative target is resolved relative to the link's own directory, not the directory the operator was standing in when they ran the command, so `ln -s config.yaml /etc/app/current.yaml` points at `/etc/app/config.yaml`.

- A is wrong: That is precisely the assumption the guide warns against; the target is resolved relative to the link's own directory, not the creator's working directory.
- B is wrong: `ln -s` accepts a relative target without complaint; it simply records the text and resolves it later relative to the link's location, which can silently produce an unintended path.
- D is wrong: `PATH` lookup applies to locating executable commands, not to resolving a symlink's stored target text.

### 40.

Two directory entries, `report.txt` and `report-copy.txt`, both point at the same inode as a hard link pair. One of them is deleted. What happens to the data, and to the link count reported by `ls -l`?

- **A.** The data is lost immediately, since deleting either hard-linked name removes the underlying file
- **B.** The remaining name becomes a dangling reference, the same as a broken symbolic link
- **C.** The data stays reachable through the remaining name, and the link count drops by one
- **D.** The link count is unaffected, since `ls -l` only counts subdirectories, not hard links

**Answer: C.** A hard link is an additional directory entry pointing at the same inode, with no "original." Deleting either name leaves the data reachable through the other, and the link count `ls -l` shows drops by one.

- A is wrong: A hard link has no primary or original entry; the inode and its data persist as long as any directory entry still references it.
- B is wrong: Dangling references are a symbolic-link failure mode, where the link is a separate file holding a path; a hard link has no such concept because it is a second name for the same inode.
- D is wrong: For a regular file, the link count in `ls -l`'s second column is exactly the number of hard-linked names; it does change when one is removed.

### 41.

A nightly job needs to synchronise a large directory tree where only a small fraction changes each night. Comparing `scp` and `rsync` for this repeated task, which is preferred, and why?

- **A.** `rsync`, because it compares both ends and transfers only the differences
- **B.** `scp`, because it authenticates faster than `rsync` on repeated connections
- **C.** Either tool is equally efficient, since both ultimately use SSH as their transport
- **D.** `sftp`, because its interactive session caches previously transferred files

**Answer: A.** `rsync` compares source and destination first and transfers only what differs, which is what makes repeated runs cheap. `scp` and `sftp` always send the whole file regardless of what is already at the far end. The invocation behind that delta transfer is `rsync -av`.

- B is wrong: Both tools authenticate exactly as an SSH login does; the deciding factor for a repeated sync is delta transfer, which `scp` does not perform at all.
- C is wrong: Sharing a transport does not make them equally efficient for repeated syncs; only `rsync` compares both ends first to avoid re-sending unchanged data.
- D is wrong: `sftp` transfers whole files just like `scp`, with no caching of previous transfers that would let it skip unchanged content.

### 42.

Comparing `rsync -av src/ user@host:/srv/dest/` against the same command with the trailing slash on `src` removed, what is the difference in where the files land?

- **A.** With the slash, the contents of `src` land directly inside `dest`; without it, a nested `dest/src` is created
- **B.** The trailing slash has no effect on rsync; both forms produce identical results
- **C.** Without the slash, rsync refuses to run and reports a syntax error, because a trailing slash on the source is mandatory whenever the destination is remote
- **D.** The slash only affects whether `--delete` is honoured on the destination

**Answer: A.** The trailing slash on the source is significant: `rsync -av src/ dest/` copies the contents of `src` into `dest`, while `rsync -av src dest/` creates `dest/src` — a frequent cause of an unexpectedly nested directory on the first run.

- B is wrong: The trailing-slash rule is one of the standing traps in this topic — it changes whether the source directory itself is nested inside the destination.
- C is wrong: Both forms are valid rsync invocations against a remote destination; there is no syntax error and no mandatory slash, only a difference in where the transferred files land.
- D is wrong: `--delete` behaviour is a separate, unrelated flag; the trailing slash specifically governs whether the source directory's name is nested into the destination.

### 43.

An operator runs `scp -p report.txt user@host:/tmp/`, intending to also select a non-standard SSH port, and mistakenly writes `-p 2222` for that purpose. What actually happens?

- **A.** It works exactly as intended, since `scp` accepts either case for the port flag
- **B.** The command fails outright with a syntax error before attempting any connection
- **C.** `scp` ignores the flag entirely and connects on the default port 22 regardless, because it validates option letters against `ssh`'s option table before using them
- **D.** Lower-case `-p` preserves times and file mode bits in `scp` rather than selecting the port, so `2222` is read as an extra source path

**Answer: D.** `scp` spells the port option `-P`, unlike `ssh`'s lower-case `-p`; in `scp`, lower-case `-p` instead means "preserve timestamps and modes," so using it for the port is a trap that silently does something else.

- A is wrong: `scp` does not treat `-p` and `-P` as interchangeable; they are two different options with two different meanings.
- B is wrong: `-p` is a valid `scp` option - just not the port one - so there is no syntax error; scp proceeds, and any complaint it makes is about the operand `2222` not existing, after option parsing rather than before it.
- C is wrong: `scp` has its own option set rather than validating against `ssh`'s - which is precisely why `-p` means different things to the two commands - and it does not ignore `-p`: it acts on it, preserving times and mode bits.

### 44.

A file is named `report.txt`, but something about opening it as plain text fails. Which command determines what the file actually is, based on its content rather than its name?

- **A.** `stat`, which reports the file's extension in its own dedicated field
- **B.** `ls -l`, since the mode string encodes the file's content format
- **C.** `file`, which inspects the content and reports the real type
- **D.** Renaming the file with the correct extension and trying again — the extension is what the kernel consults when opening a file

**Answer: C.** Linux attaches no meaning to a filename extension. `file` inspects the actual content — filesystem tests, then magic-number tests, then language tests — and reports the first that succeeds, which is why it is the right tool when a file "will not open" or "is the wrong type."

- A is wrong: stat(1) reports inode metadata — size, timestamps, permissions, ownership; it has no extension field and performs no content classification.
- B is wrong: The mode string encodes only the file type category — regular file, directory, symlink and so on — not what kind of content a regular file holds.
- D is wrong: Nothing in the kernel's open path consults a filename extension, and file(1) classifies by content, so renaming changes only the name.

### 45.

An investigator runs `stat` on a file and reads its `ctime` as "when this file was created." Why is that reading wrong?

- **A.** `ctime` is correct for creation, but only on filesystems that support it
- **B.** `ctime` is the inode's status-change time, which is not a creation timestamp at all
- **C.** `atime` is the field that should have been read instead, since it tracks the earliest access
- **D.** `stat` reports creation time correctly, and the confusion is with `mtime` instead

**Answer: B.** `ctime` is the last change to the inode itself, including a permission or ownership change, not a creation time. Traditional Unix metadata simply has no field recording when a file was originally created.

- A is wrong: `ctime` never records creation on any filesystem; where a birth time exists, `stat` exposes it separately as `%w`, not as `ctime`.
- C is wrong: `atime` records the most recent read, not the earliest one, and is not a creation timestamp either.
- D is wrong: `mtime` is `%y`, the time of last data modification — another non-creation timestamp; none of `atime`, `mtime` or `ctime` records when a file came into existence.

### 46.

An `ls -l` listing shows a file's timestamp column, and an operator wants that same value to be the file's access time rather than its default meaning. Which option produces that?

- **A.** `ls -lc`, which shows `atime` because `c` stands for "current access"
- **B.** Plain `ls -l`, since the timestamp column already defaults to access time
- **C.** `ls -lu`, which shows `atime` in place of the default `mtime`
- **D.** `stat -f`, since it reports on the filesystem rather than an individual file

**Answer: C.** `ls -l` shows `mtime` by default; `ls -lc` shows `ctime` and `ls -lu` shows `atime`. The three timestamps are `atime` (last read), `mtime` (last content change) and `ctime` (last inode change).

- A is wrong: `ls -lc` shows `ctime`, the inode change time, not `atime`; the mnemonic in the option name does not match what the flag actually selects.
- B is wrong: `ls -l` shows `mtime` — the last content modification — by default, not `atime`.
- D is wrong: GNU `stat -f` switches to reporting on the filesystem itself, an unrelated mode that does not produce a per-file access-time listing.

### 47.

A file was created thirty seconds ago and must be located immediately by name across a large tree. Comparing the tools that answer "where is this file," which one should be used, and which should be ruled out?

- **A.** `locate`, because it is faster and speed is what the scenario asks for
- **B.** `find`, because it walks the tree live; `locate` would miss a file this recent
- **C.** `which`, because it searches every directory a file could have been created in
- **D.** `whereis`, because it searches the whole filesystem for any name given to it — it walks every mounted filesystem before reporting

**Answer: B.** `find` walks a directory tree live and filters on name, type, size, timestamp or permission, so it always sees a file the moment it exists. `locate` queries a prebuilt index and is faster but can be stale, which rules it out for a file created moments ago.

- A is wrong: Speed is real, but `locate` trades it for freshness: its index is only as current as the last `updatedb` run, which a thirty-second-old file has certainly missed.
- C is wrong: which(1) prints the full path of the executable that would run for a command name, searching only the directories listed in `PATH`; it has nothing to do with locating an arbitrary file by name.
- D is wrong: whereis(1) 'locates the binary, source and manual files for the specified command names' by looking in standard Linux places and the directories named by `$PATH` and `$MANPATH`, not by walking the filesystem for an arbitrary name.

### 48.

An operator runs `find . -name *.log` in a directory whose only `.log` file is `error.log`, and the results contain nothing but files named `error.log`, even though several other `.log` files exist in subdirectories. What went wrong with the command?

- **A.** `find` only searches one level deep unless it is given `-R` to recurse
- **B.** `.log` files are treated specially and excluded from recursive search
- **C.** The unquoted pattern was expanded by the shell before `find` ever saw it
- **D.** `find` requires `-type f` before `-name` will match anything

**Answer: C.** Because `-name` takes a shell pattern, that pattern must be quoted — `find . -name '*.log'` — otherwise the shell expands it against the current directory before `find` runs, so `find` receives whatever matched there instead of the pattern itself.

- A is wrong: find(1) descends the directory hierarchy from each starting point by default and has no `-R` option at all; the symptom comes from shell expansion consuming the pattern.
- B is wrong: There is no such exclusion; `find` treats a `.log` extension like any other part of a filename once it receives the pattern correctly.
- D is wrong: `-name` matches on its own without a required `-type` filter; adding `-type f` narrows results but its absence does not explain this symptom.

### 49.

An operator wants to know exactly which file on `PATH` will run when they type `git`, in case more than one copy is installed. Which command answers that directly?

- **A.** `whereis git`, since it reports the binary's location along with its manual page and source paths
- **B.** `which -a git`, showing every matching file on `PATH`, not just the first
- **C.** `locate git`, since the database includes every file on the system
- **D.** `find / -name git`, since it will eventually find every copy

**Answer: B.** `which` reports which file on `PATH` a bare command name would run, and `-a` shows every match rather than stopping at the first, which is exactly the "which copies exist on `PATH`" question.

- A is wrong: `whereis` looks only in a compiled-in list of standard directories, which may miss a copy installed elsewhere on `PATH`, unlike `which`'s actual `PATH` lookup.
- C is wrong: `locate` searches a filename index for anything matching "git" anywhere on the filesystem, which is a much broader and less precise answer than "which file on `PATH` runs."
- D is wrong: That finds files named `git` anywhere on the filesystem, including ones nowhere near `PATH`, rather than answering which one the shell would actually execute.

### 50.

A `ping` to a remote host times out. An operator concludes the host is down. What can and cannot actually be concluded from a failed `ping`?

- **A.** The host is definitely down, since `ping` failure always means the target is unreachable, because echo replies come from the kernel and cannot be filtered en route
- **B.** Nothing conclusive, since ICMP is commonly filtered and a healthy host can still fail to answer echo requests
- **C.** DNS resolution has failed, since `ping` relies entirely on name resolution succeeding first
- **D.** The local network interface is down, since a working interface always gets an ICMP reply

**Answer: B.** `ping` sends ICMP echo requests, so success proves the host is reachable and ICMP is permitted; failure proves neither, because ICMP is very commonly filtered while the actual service still answers fine. The same ladder includes `ip addr` for interface addresses, `ip route` for the routing table, and `hostname` for the system's own name.

- A is wrong: Echo replies are ordinary IP traffic and are filtered by firewalls routinely; a healthy host behind such a filter answers its real services while never answering `ping`.
- C is wrong: A `ping` against an address that resolved fine can still time out due to ICMP filtering; the failure described does not by itself indicate a DNS problem.
- D is wrong: A working local interface says nothing about whether a distant firewall permits ICMP through to it; the timeout does not localise the problem to the operator's own interface.

### 51.

`dig app.internal` returns the correct address, but the application on the same host still fails to resolve the same name. Where should the investigation look, given what `dig` does and does not consult?

- **A.** `/etc/hosts` and the resolver configuration, since `dig` queries DNS directly and skips them
- **B.** The DNS server itself, since a successful `dig` proves the server is misconfigured
- **C.** The application's TCP port bindings, since `dig` and name resolution are unrelated to sockets
- **D.** Nowhere further — a successful `dig` result guarantees the application will resolve the name too

**Answer: A.** `dig` queries DNS servers directly and skips `/etc/hosts` entirely, whereas the application follows the order in `/etc/nsswitch.conf`, which normally consults `/etc/hosts` first — `getent hosts` shows the system's actual resolution order.

- B is wrong: A successful `dig` result means the DNS server answered correctly; it does not implicate the server, and instead points at the gap between `dig`'s direct query and the application's system-level resolution order.
- C is wrong: Nothing in the scenario mentions socket binding; the described failure is specifically about name resolution, which `ss -tulpn` — not `dig` — would investigate if ports were the concern.
- D is wrong: That assumption is exactly the false conclusion this scenario is built to expose; `dig` bypasses `/etc/hosts` and nsswitch, so its success does not guarantee the application's resolution will succeed.

### 52.

An operator needs to confirm which process is listening on TCP port 8080 on a server, with numeric ports rather than looked-up service names. Which command and options answer that directly?

- **A.** `ss -tulpn`, filtered by eye to the 8080 line
- **B.** `curl -I` against the port, since header output reveals the owning process
- **C.** `traceroute` to the loopback address, since it maps every listening port along the way
- **D.** `hostname -I`, since it lists every port currently open on the machine

**Answer: A.** `ss -tulpn` lists listening TCP and UDP sockets with ports and owning processes: `t` TCP, `u` UDP, `l` listening, `p` process, `n` numeric so no service-name lookup happens — exactly what is needed to confirm what is bound to 8080.

- B is wrong: `curl -I` fetches HTTP response headers if a service answers; it says nothing about which process on the host is bound to the port, and requires a service to already be responding.
- C is wrong: `traceroute` maps the network path to a destination hop by hop; it has no way to enumerate which local processes are listening on which ports.
- D is wrong: `hostname -I` shows configured addresses, not port or process information; it does not list listening sockets at all.

### 53.

An operator needs the five-field time syntax used inside a crontab file, not the usage of the `crontab` command itself. Which invocation opens the correct manual page?

- **A.** `man crontab`, which opens whichever section is searched first
- **B.** `man 5 crontab`, which asks for the file-format section explicitly
- **C.** `man -k crontab`, which searches page descriptions for the keyword
- **D.** `info crontab`, since Texinfo manuals are organised into the same numbered sections as man

**Answer: B.** Manual sections are fixed, and section 5 covers file formats and configuration files while section 1 covers user commands. `man 5 crontab` asks for the file-format page explicitly, which is the one with the five time fields.

- A is wrong: The default section search order reaches section 1 before section 5, so this opens the command page, not the file-format page.
- C is wrong: That searches the short descriptions in the manual index and returns a list of matches; it does not open the file-format page directly.
- D is wrong: Texinfo manuals are not divided into man's numbered sections, so this does not target the file-format documentation specifically.

### 54.

`apropos ssh` prints "nothing appropriate" on a server that clearly has OpenSSH installed, yet `man ssh` opens a page without trouble. What is the most likely cause?

- **A.** The manual index that `apropos` searches has not been built
- **B.** OpenSSH ships no man pages, only a `--help` summary
- **C.** `apropos` only searches section 8 administration pages, and `ssh` lives in section 1
- **D.** The keyword needs to be quoted, since `apropos` otherwise expands it as a glob

**Answer: A.** `man -k` and `apropos` search the same prebuilt index of page descriptions rather than the page bodies, so an unbuilt or stale `mandb` index produces "nothing appropriate" even though the page itself opens with `man` directly.

- B is wrong: OpenSSH does ship man pages, and the scenario states `man ssh` already opens one successfully.
- C is wrong: `apropos` searches descriptions across all sections; it is not restricted to section 8.
- D is wrong: `apropos` takes the keyword as a plain operand; there is no glob expansion involved in the failure described.

### 55.

A container image ships a stripped-down set of binaries with no man pages installed at all. `man ls` fails with "No manual entry", but `ls --help` still prints a usage summary. Why does `--help` still work?

- **A.** `--help` reads the same source file `info` uses, which the image keeps for licensing reasons
- **B.** The image substitutes `apropos` output whenever a man page is missing, falling back to the short description instead
- **C.** Both `man` and `--help` actually failed, and the terminal replayed a cached result
- **D.** Its output is compiled into the binary itself, unlike a man page, which is a separate installed file

**Answer: D.** `--help` output is compiled into the binary, so it works even where man pages are separately installed files a minimal image chose to omit.

- A is wrong: `info` manuals are Texinfo files, a different format from a compiled-in `--help` summary, and neither depends on the other.
- B is wrong: `apropos` searches the manual index database, which a stripped image would be missing along with the pages themselves, and it plays no part in producing a program's `--help` output.
- C is wrong: The scenario states `--help` printed a usage summary, so it did not fail, and no such caching or replay happens here.

### 56.

A ticket says "find every log entry mentioning the string ETIMEDOUT." Comparing tools that find things by name against ones that search content, which command actually answers this, and why not `find`?

- **A.** `grep`, because the question is about text stored inside files, not about the files' names
- **B.** `find`, since it can filter on content as well as name once given the right expression
- **C.** `locate`, since its prebuilt index also stores each file's text content
- **D.** `whereis`, since it searches every standard location for matching text, the same way it searches those locations for a command's binary

**Answer: A.** `grep` searches the bytes inside files line by line, which is exactly what "the text stored in a file" scenarios ask for, no matter how the question is phrased. `find` and `locate` answer questions about a file's identity — name, type, size, timestamps — not its contents. The everyday option set rounds out with `grep -i` for case-insensitive matching, `grep -v` to invert the selection, and `grep -n` to number the matches.

- B is wrong: `find`'s expression language filters on name, type, size, timestamp, ownership and permission — none of which reaches into the bytes of a file the way `grep` does.
- C is wrong: `locate`'s index holds filenames from a periodic scan, not file contents, so it cannot answer a question about text appearing inside a file.
- D is wrong: `whereis` locates a command's binary, source and manual page in a fixed set of directories; it has no notion of searching arbitrary log text.

### 57.

An operator needs every line in `app.log` that does not mention "healthy", case aside, along with the line number of each. Which combination of options achieves that?

- **A.** `grep -inv healthy app.log`, combining ignore-case, line numbers and inverted selection
- **B.** `grep -c healthy app.log`, since `-c` prints matching lines with their counts
- **C.** `grep -r healthy app.log`, since recursive mode also numbers every line it searches and inverts the selection along the way
- **D.** `grep -v healthy app.log`, without `-i`, since matching is case-insensitive by default

**Answer: A.** `-i` ignores case, `-n` prefixes each output line with its line number, and `-v` inverts the selection to print non-matching lines — combined, `grep -inv healthy app.log` gives every case-insensitive non-match with its line number.

- B is wrong: `-c` prints only a count of matching lines, with no line text or numbers at all, and does not invert the selection the way this task needs.
- C is wrong: `-r` makes `grep` recurse into directories; it neither numbers lines nor inverts the selection, and it would be unnecessary against a single file.
- D is wrong: Matching is not case-insensitive by default; omitting `-i` here would miss a line spelled "Healthy" or "HEALTHY", and this option also drops the requested line numbers.

### 58.

A search needs to check every file under `src/` for the string "TODO", not just files directly in that directory. Which option makes `grep` descend into subdirectories?

- **A.** `-n`, since numbering the lines also expands the search into subdirectories
- **B.** No option is needed; `grep` searches subdirectories by default when given a directory
- **C.** `-v`, since inverting the match also inverts the search scope to include subdirectories
- **D.** `-r`, recursive search, following symlinks only when named directly on the command line

**Answer: D.** `grep -r` searches every file beneath a directory, descending into subdirectories, and follows symlinks only when they are named on the command line; `-R` follows all symlinks encountered during the walk.

- A is wrong: `-n` only adds line numbers to matched output; it has no effect on whether `grep` descends into subdirectories at all.
- B is wrong: Without `-r`, pointing `grep` at a directory produces an "Is a directory" message rather than a recursive search; the descent has to be requested explicitly.
- C is wrong: `-v` inverts which lines are selected as matches; it has nothing to do with how deep into the directory tree `grep` searches.

### 59.

A line containing `!!` behaves as expected when typed at an interactive prompt, but the identical line inside a script does nothing of the kind. Why does the same syntax behave differently in the two contexts?

- **A.** Scripts silently rewrite `!!` into the literal text of the last command run interactively
- **B.** `!!` is bash-only syntax that fails the same way at a prompt and in a script, since no shell has ever implemented it
- **C.** The script needs `source` instead of direct execution for history expansion to apply
- **D.** History expansion is disabled in non-interactive shells, so `!!` in a script is not treated specially

**Answer: D.** History expansion is an interactive-shell feature. `!!` is replaced by the previous command line at a live prompt, but a script containing the same characters runs in a non-interactive shell, where history expansion is off.

- A is wrong: A script has no access to the interactive shell's history at all; it simply does not perform history expansion, rather than substituting anything from a separate session.
- B is wrong: The scenario states `!!` behaves as expected at the interactive prompt, so it is not uniformly broken; bash documents `!` style history substitution and enables it by default for interactive shells.
- C is wrong: Sourcing runs a script in the current shell but does not itself enable history expansion, which is governed by interactive-versus-non-interactive mode, not by how the script is invoked.

### 60.

An operator wants to find a long `rsync` command they typed twenty minutes ago without scrolling back through everything since. Which interactive feature is designed for exactly this?

- **A.** `Ctrl-R`, which starts a reverse incremental search through history
- **B.** `history`, which always jumps straight to the most relevant past command automatically
- **C.** Tab completion, since it recalls whole previous commands the same way it completes filenames
- **D.** `!$`, since it reruns whichever command last used the word "rsync"

**Answer: A.** `Ctrl-R` starts a reverse incremental search through the history list: typing narrows the match, pressing it again steps to the next older one, which is exactly the tool for finding a specific past command without scrolling.

- B is wrong: `history` lists the numbered command history for the operator to read through; it does not search or jump to a specific past command on its own.
- C is wrong: Tab completion fills in a partly typed name from what exists on disk or in known commands; it does not search backward through command history.
- D is wrong: `!$` reuses the previous command line's last argument, not a search by keyword across history; it has no notion of finding a specific past command by content.

### 61.

A second terminal opened at the same time as a first does not show any of the first terminal's commands in its history, even though both belong to the same user. Why not?

- **A.** Each terminal window is permanently assigned its own separate `HISTFILE`
- **B.** History sharing requires tab completion to be enabled in both sessions
- **C.** The history file is normally written when a session ends, so a still-open first session has not written its lines yet
- **D.** Only commands run through `sudo` are written to the shared history file, and everything else is discarded at exit

**Answer: C.** The shell keeps its history list in memory and writes it to `HISTFILE` — `~/.bash_history` by default — when the session ends, which is why a second terminal opened at the same time does not see the first session's commands until it exits.

- A is wrong: By default all sessions for a user share the same `HISTFILE`; the gap here is about when each session writes to it, not separate files per window.
- B is wrong: Tab completion and history are separate readline features; enabling one has no bearing on whether one session's commands appear in another's history.
- D is wrong: Bash copies the session's history entries to the history file without regard to privilege; nothing in its history handling singles out `sudo` or drops unprivileged commands.

### 62.

A colleague insists a directory holds several configuration files, but plain `ls` on that directory prints nothing at all. What is the most likely explanation, and how would you confirm it?

- **A.** The directory has been corrupted and needs `fsck` before it can be listed
- **B.** The colleague is looking at a different host, so the discrepancy is expected
- **C.** Plain `ls` requires `-l` before it will print any entries at all
- **D.** The files are dotfiles; `ls -la` would reveal them along with `.` and `..`

**Answer: D.** There is no hidden attribute in the filesystem: `ls` simply omits names starting with `.` unless told otherwise. `ls -la` combines the long format with all entries, including dotfiles and the `.`/`..` entries themselves, and would reveal exactly what the plain listing hid.

- A is wrong: A truly corrupted directory produces a filesystem error, not a clean, silent empty listing; the scenario matches ordinary dotfile hiding instead.
- B is wrong: Nothing in the scenario suggests two hosts are involved; the question is asking for the local, technical explanation for an empty-looking listing.
- C is wrong: Plain `ls` prints names without `-l`; the long-format flag changes how much detail is shown, not whether entries appear.

### 63.

Before running a destructive command against a relative path typed from memory, an operator wants to confirm which directory the shell is actually sitting in. Which single command reports that?

- **A.** `cd`, since it always reports the destination it moved to
- **B.** `pwd`, which prints the absolute pathname of the current working directory
- **C.** `ls -la`, since dotfiles are the usual cause of destructive mistakes
- **D.** There is no single command for this; the working directory can only be inferred from the shell prompt

**Answer: B.** Skipping a directory check before a destructive command means it may run in an unexpected directory. `pwd` confirms the current working directory before anything irreversible happens.

- A is wrong: bash(1) says a bare `cd` goes to `$HOME`, and that `cd` writes the new working directory to standard output only when the argument is `-` or when the name came from `CDPATH`.
- C is wrong: Listing entries including dotfiles shows what a directory contains, not which directory the shell is currently in.
- D is wrong: `pwd` reports it directly, and a prompt is configurable — it may show an abbreviated path or none at all.

### 64.

Run with no argument at all, what does the `cd` builtin do, and is that a usage error?

- **A.** It changes to `$HOME`; this is a normal, valid invocation, not an error
- **B.** It reports a usage error, since `cd` always requires a target directory
- **C.** It moves to the root directory `/`, treating a missing argument as the top of the tree
- **D.** It repeats the previous `cd` target, the same as `cd -` would

**Answer: A.** `cd` with no argument goes to `$HOME`, and `cd -` returns to the previous directory, printing where it landed. Neither is an error condition.

- B is wrong: A bare `cd` is explicitly defined to go home; it does not require an argument and produces no error.
- C is wrong: A bare `cd` goes to `$HOME`, not to the filesystem root; those are two different, easily confused destinations.
- D is wrong: `cd -` specifically returns to the previous directory; a bare `cd` with no argument goes to `$HOME` instead, a different and fixed destination.

### 65.

Comparing a pipe, a redirection, and the standard streams themselves: which one joins two running processes together, which one joins a process to a file, and which one is just the numbered endpoints?

- **A.** Redirection joins two running processes together; a pipe attaches a single process to a file or device
- **B.** All three describe the same mechanism under different names, with the choice of word being purely a matter of habit
- **C.** A pipe joins two processes; redirection joins a process to a file or descriptor; standard streams are the numbered endpoints 0, 1 and 2
- **D.** Standard streams come into existence only once a pipe or redirection has been used; a process run with neither has no descriptors open at all

**Answer: C.** The separating axis is what sits at the far end: standard streams are the endpoints themselves, redirection attaches an endpoint to a file, and a pipe attaches one process's endpoint to another process's, with all pipeline stages starting concurrently. Written exactly as it appears on a command line, the operator is `|`.

- A is wrong: This swaps the two roles: a pipe is what connects two running processes concurrently, and redirection is what attaches a stream to a file.
- B is wrong: The three are distinct: what sits at the far end of the connection — another process, a file, or nothing yet decided — is exactly the separating axis between them.
- D is wrong: Every process starts with all three descriptors already open, attached to the terminal by default, whether or not a pipe or redirection is ever applied.

### 66.

An operator runs `echo /tmp | ls`, expecting to see `/tmp`'s contents, and instead sees a listing of the current directory. Why does the pipe not deliver `/tmp` to `ls` as intended?

- **A.** `ls` takes operands, not standard input, so the piped text is simply ignored
- **B.** The pipe failed because `echo`'s output cannot be piped at all
- **C.** `ls` requires `sudo` to read piped input, which was not used here
- **D.** `xargs` should have been unnecessary here since pipes already convert text into operands

**Answer: A.** A pipe only helps if the receiving command reads standard input. `ls` takes operands, not input, so `echo /tmp | ls` prints the current directory's listing and ignores the piped text entirely — `xargs` is what converts input into operands.

- B is wrong: `echo`'s output can be piped like any command's; the problem is entirely on the receiving end, where `ls` does not consume standard input for its target.
- C is wrong: Privilege has nothing to do with this; the issue is that `ls` reads operands, not standard input, regardless of who runs it.
- D is wrong: Pipes never convert piped text into operands on their own; `xargs` is specifically the tool that performs that conversion, which this command is missing.

### 67.

In `cat /etc/shadow | sudo grep root`, run by an unprivileged user, the command fails before `grep` even has a chance to search. Why does prefixing only `grep` with `sudo` not help?

- **A.** `sudo` applies to the entire pipeline once used anywhere in it, because privilege elevation propagates outward to every stage a pipe connects
- **B.** `sudo` in a pipeline applies only to the stage it prefixes, and `cat` runs unprivileged and fails first
- **C.** Pipelines cannot contain privileged commands under any circumstances
- **D.** `grep` cannot read piped input when combined with `sudo`, regardless of position

**Answer: B.** `sudo` inside a pipeline applies only to the stage it prefixes. In `cat /etc/shadow | sudo grep root`, `cat` runs unprivileged and fails to read the file before `sudo` is ever reached, so elevating only `grep` does not help.

- A is wrong: Privilege elevation is scoped to the single command `sudo` prefixes; it does not retroactively or automatically extend to earlier stages in the same pipeline.
- C is wrong: A pipeline can include a privileged stage; the problem here is specifically that the unprivileged stage comes first and fails before reaching the privileged one.
- D is wrong: `grep` reads piped input normally under `sudo` too; the failure happens earlier, at the unprivileged `cat` stage, not at `grep` itself.

### 68.

A web server process running as an unprivileged user can bind port 8080 but is refused when it tries port 80. What determines that boundary, and what would let the same process bind 80 without running as root?

- **A.** The boundary is 8080 itself; any port above it needs no privilege and any port below it always does
- **B.** Only the root user account can ever bind port 80, with no exceptions on Linux
- **C.** The distinction is enforced only by the firewall and not by the kernel, so flushing the firewall rules would let any user bind port 80
- **D.** Ports below 1024 need the `CAP_NET_BIND_SERVICE` capability, which can be granted to the binary without making it root

**Answer: D.** Binding a port below 1024 requires the `CAP_NET_BIND_SERVICE` capability on Linux, usually held by root but grantable to a specific binary or systemd unit — which is exactly why an unprivileged process can bind 8080 but not 80 unless it holds that capability.

- A is wrong: The actual privileged boundary is 1024, not 8080; ports from 1024 up to 49151 are registered but unprivileged, so plenty of ports below 8080 need no special capability at all.
- B is wrong: The `CAP_NET_BIND_SERVICE` capability specifically allows binding a privileged port without the process running as root at all, which is exactly how modern web servers avoid running as root.
- C is wrong: The restriction is a kernel capability check performed at bind time - ip(7) gives EACCES for "binding to a privileged port without superuser privileges (the CAP_NET_BIND_SERVICE capability)" - so it holds with no firewall rules present at all.

### 69.

Comparing the RFC's dynamic port range against what a real Linux client actually uses for its outgoing source port, are they the same range?

- **A.** No — RFC 6335 puts dynamic ports at 49152-65535, while Linux's default local range is 32768-60999
- **B.** Yes — Linux follows RFC 6335's ephemeral range exactly for outgoing connections
- **C.** No — Linux uses a narrower range entirely inside the well-known ports, 0-1023
- **D.** The two ranges differ only for UDP and match exactly for TCP, since the kernel's local port range is consulted only for connectionless sockets

**Answer: A.** RFC 6335 puts dynamic ports at 49152-65535, but the kernel's `net.ipv4.ip_local_port_range` defaults to 32768-60999, so a real Linux client's source port usually falls in the User (registered) Ports range instead of the RFC's Dynamic Ports range.

- B is wrong: Linux's actual default range diverges from the RFC; this is precisely the specification-versus-implementation gap the topic tests.
- C is wrong: Linux's ephemeral source-port range sits well above 1023, in the registered-port territory (32768-60999 by default), not inside the privileged well-known range.
- D is wrong: The kernel documentation defines ip_local_port_range as "the local port range that is used by TCP and UDP to choose the local port" - one setting covering both, so it is not protocol-specific in the way this option claims.

### 70.

`ss -tulpn` is run without the `n` flag, and the output shows a service name instead of a raw port number for a listening socket. What does dropping `n` actually change, and is the resulting name proof of what is running?

- **A.** Nothing changes; `n` only affects whether IP addresses are shown numerically
- **B.** It disables the `p` column, hiding the owning process entirely
- **C.** It switches the tool from TCP sockets to UDP sockets only, leaving the listening filter and the process column as they were
- **D.** It maps the port number to a name from `/etc/services`, a lookup describing convention, not a check of the actual process

**Answer: D.** Dropping `n` and reading the service name from `/etc/services` as proof of what is running is a standing trap: the name is a lookup of the conventional use of that number, not an inspection of the actual process bound to it.

- A is wrong: `n` governs numeric ports as well as addresses; dropping it specifically substitutes a looked-up service name for the raw port number.
- B is wrong: `n` and `p` are independent flags; dropping `n` changes how ports are displayed, not whether the owning-process column appears.
- C is wrong: Protocol selection is controlled by the separate `t` and `u` flags; `n` has nothing to do with which protocol's sockets are shown.

### 71.

A shell variable `$file` holds the text `my report.txt`. Comparing `rm $file` and `rm "$file"`, what does each actually pass to `rm`?

- **A.** Both forms pass exactly one operand, `my report.txt`, since quoting has no effect on `rm`
- **B.** Both forms fail with a syntax error, since a space inside a variable's value is never allowed unless it is escaped with a backslash first
- **C.** `rm $file` passes two operands, `my` and `report.txt`; `rm "$file"` passes one, `my report.txt`
- **D.** `rm $file` passes one operand and `rm "$file"` passes two, because the quotes are themselves passed along as a second argument

**Answer: C.** After the shell substitutes a variable's value, an unquoted result is subject to word splitting on the characters in `IFS`. Inside double quotes neither word splitting nor pathname expansion happens, so quoting every variable expansion is the rule that avoids this entire class of bug.

- A is wrong: Quoting changes whether word splitting applies to the expansion; the unquoted form does split on the internal space, producing two separate arguments.
- B is wrong: A space inside a variable's value is ordinary text; it causes no syntax error, only word splitting when the expansion is left unquoted.
- D is wrong: Quotes are removed by the shell during quote removal and never reach the command; what actually differs is that the unquoted expansion is split into two words on the internal space.

### 72.

Inside single quotes, which of these has any special meaning to the shell: a dollar sign, a backtick, a backslash, or a wildcard character?

- **A.** None of them; single quotes make every character inside literal
- **B.** The dollar sign still triggers variable expansion inside single quotes
- **C.** The backslash still escapes the character that follows it, even inside single quotes
- **D.** A wildcard character still expands to matching filenames inside single quotes

**Answer: A.** Single quotes suppress everything: no character inside them has any special meaning to the shell. That is also why a single quote can never appear inside single quotes — there is no escape mechanism available there.

- B is wrong: Variable expansion is exactly one of the mechanisms single quotes suppress; a dollar sign inside them stays a literal character rather than starting an expansion.
- C is wrong: A backslash loses its escaping role inside single quotes too; it becomes just another literal character, unlike inside double quotes where it retains a limited role.
- D is wrong: Pathname expansion is also suppressed inside single quotes; a wildcard there stays a literal character rather than triggering a glob match.

### 73.

A long listing shows `drwxr-xr-x` for a directory. Who, specifically, is permitted to create a new file inside it?

- **A.** Only the owner, since only the owner triad includes `w`
- **B.** The owner and the group, since both triads include `r` and `x`
- **C.** Everyone, since `x` is set for owner, group and other alike
- **D.** No one, since `w` does not appear anywhere in `drwxr-xr-x`

**Answer: A.** On a directory, `r` means list the names inside, `x` means traverse it, and `w` means create, delete or rename entries inside it. In `drwxr-xr-x`, only the owner triad (`rwx`) has `w` set, so only the owner may create a file there.

- B is wrong: Read and execute on a directory govern listing and traversal, not creation; creating an entry specifically requires `w`, which only the owner triad has here.
- C is wrong: `x` on a directory permits traversal — resolving a path through it — not creating new entries, which needs `w` specifically.
- D is wrong: Reading `rwxr-xr-x` triad by triad, the owner's triad is `rwx`, which does include `w`; only group and other lack it here.

### 74.

Convert the mode string `-rw-r--r--` to its octal equivalent, and state what kind of entry it describes.

- **A.** 755, a directory the owner can fully control and others can list and traverse
- **B.** 644, a regular file the owner can read and write and everyone else can only read
- **C.** 600, a private file only its owner can read or write
- **D.** 444, a file that is read-only for every class, since none of the three triads carries a write bit

**Answer: B.** Each permission triad is one octal digit, with `r`=4, `w`=2 and `x`=1 added together. `-rw-r--r--` is owner `rw-` (6), group `r--` (4), other `r--` (4), giving 644 — a regular file the owner can read and write and everyone else can only read.

- A is wrong: 755 corresponds to `rwxr-xr-x`, which includes execute bits this mode string does not have, and the leading `-` marks a regular file, not a directory.
- C is wrong: 600 corresponds to `rw-------`, with no access at all for group or other; this mode string grants read to both, which 600 does not.
- D is wrong: 444 corresponds to `r--r--r--`, and it is true that it grants no write anywhere; the mode string here is `-rw-r--r--`, whose owner triad is `rw-` and does include write, so 644 is the value.

### 75.

An operator runs `ls -l /etc/nginx` to check that directory's own permissions, but the output lists the files inside it instead. Which command replaces the listing of contents with a single line for the directory entry itself?

- **A.** Running `ls -ld /etc/nginx` to target the directory entry itself
- **B.** `ls -lR /etc/nginx`, since a recursive listing opens with a line describing the directory itself
- **C.** `stat -d /etc/nginx`, since `-d` means "directory mode" for `stat` as well
- **D.** `ls -l /etc/nginx/.`, since appending a dot forces the directory's own entry to show

**Answer: A.** `ls -l` on a directory path lists the contents rather than the directory itself; only `ls -ld` shows the directory's own mode, combining `-d` (operate on the directory itself) with `-l`.

- B is wrong: A recursive listing prints the directory's path as a plain header followed by its contents, then repeats that for each subdirectory; no mode string for `/etc/nginx` itself appears in that output.
- C is wrong: `stat` has no `-d` option with that meaning, and borrowing another command's flag letter is a guess rather than a reading of `stat`'s own option list.
- D is wrong: A trailing `.` still names the directory's contents as the thing to list, producing the same result as omitting it, not the directory's own line.

### 76.

An application running as user `svc` gets "Permission denied" opening `/srv/app/data/config.yaml`, which is mode 644 and owned by `svc`. Working outward from the file, what should be checked next, and why might the file's own mode be irrelevant to the failure?

- **A.** Whether the file has been renamed, since a rename would explain a permission error
- **B.** The group ownership only, since 644 already grants the owner full access
- **C.** The execute bit on every directory in the path, since a missing `x` on any parent blocks traversal regardless of the file's own mode
- **D.** Whether the filesystem is mounted read-only, since a read-only mount refuses to open any file on it

**Answer: C.** For a "permission denied" on a path, the diagnostic order works outward: first decide which triad applies (here, owner, which 644 already permits), then check the execute bit on every directory in the path — a file with a permissive mode in a directory that blocks traversal is still unreachable.

- A is wrong: A renamed or missing file produces "No such file or directory," not "Permission denied," so a rename does not match the error described.
- B is wrong: Exactly one triad applies to a given access attempt, and since `svc` owns the file the owner triad — which already grants read — is the one that decides; group ownership is irrelevant here.
- D is wrong: A read-only mount blocks writes, and an attempt to write there fails with "Read-only file system" rather than "Permission denied"; opening a file for reading on such a mount still succeeds.

### 77.

A mode string begins with the letter `l` rather than `-` or `d`. What kind of filesystem entry does that indicate?

- **A.** A regular file with the immutable attribute set
- **B.** A directory that has reached its link-count limit
- **C.** A hard link, as opposed to an ordinary file
- **D.** A symbolic link

**Answer: D.** The type character is `-` for a regular file, `d` for a directory, `l` for a symbolic link, and several other letters for device files, pipes and sockets. `l` specifically identifies a symbolic link.

- A is wrong: File attributes such as immutability are not represented in the leading type character at all; a regular file always shows `-` there regardless of its attributes.
- B is wrong: Link-count limits are not represented in the type character either, and a directory always shows `d` there, not `l`.
- C is wrong: A hard link is simply an additional name for an ordinary inode and shows the same `-` type character as any other regular file; `l` is reserved for symbolic links.

### 78.

An operator intends to sort a file in place with `sort file > file`, expecting the sorted content to replace the original. Instead, `file` ends up empty. What actually happened?

- **A.** `sort` failed silently because reading and writing the same file is blocked at the command level
- **B.** The shell truncated `file` when it set up the redirection, before `sort` ever read it
- **C.** The file was emptied by a disk error unrelated to the redirection
- **D.** `>>` was actually used instead of `>`, which appends rather than truncates

**Answer: B.** `>` sends standard output to a file, creating it or truncating it to zero length as soon as the shell sets up the redirection — before the command has run and regardless of whether it would have succeeded. `sort file > file` therefore empties the file first and sorts nothing. The equivalent operator for errors alone is `2>`, leaving standard output untouched.

- A is wrong: `sort` never gets the chance to fail on this; the shell has already emptied the file during redirection setup, before `sort` even starts.
- C is wrong: No disk error is needed to explain this; `>` truncating its target before the command runs is a routine, well-documented behaviour that fully accounts for the empty file.
- D is wrong: The scenario specifies `>`, which truncates; `>>` would have appended and left the original content in place rather than emptying it.

### 79.

Comparing `command > out 2>&1` with `command 2>&1 > out`, which one sends both streams to the file, and which leaves errors on the terminal?

- **A.** Both forms are equivalent, since `2>&1` always means "merge the two streams"
- **B.** Putting the file redirect first sends both streams to the file; putting `2>&1` first leaves errors on the terminal
- **C.** It is the reverse: naming the file first leaves errors on the terminal, and naming `2>&1` first merges them
- **D.** Neither ordering can merge both streams; only `&>` can do that, because descriptor duplication with `2>&1` never takes effect on a command that also opens a file

**Answer: B.** The shell opens the target and attaches it to the named descriptor before executing the command, so ordering matters. `command > out 2>&1` points descriptor 1 at `out`, then points descriptor 2 at wherever 1 now points — both end up in the file. Reversed, descriptor 2 is pointed at the terminal before descriptor 1 moves, so errors stay on screen.

- A is wrong: The two forms differ specifically because of ordering: descriptor duplication captures the *current* destination at the moment it runs, which is why placement relative to `> out` changes the result.
- C is wrong: This reverses the actual outcome: it is `> out 2>&1` that merges both into the file, not `2>&1 > out`.
- D is wrong: `> out 2>&1` is exactly the portable way to merge both streams into one file; `&>` is a shorter but non-portable bash/zsh shortcut for the same result.

### 80.

A build log needs both standard output and standard error captured to one file, and the script must run correctly on both bash and a strict POSIX `/bin/sh`. Which redirection is the portable choice?

- **A.** Writing `&> build.log`, the shorter bash and zsh shortcut for the same merge
- **B.** `>> build.log 2>build.log`, opening the file twice so that each descriptor gets its own independent writer to the same path
- **C.** Writing `> build.log 2>&1`, merging descriptor 2 onto descriptor 1 after opening the file
- **D.** `| tee build.log`, since piping to `tee` avoids redirection portability issues entirely

**Answer: C.** `&>` is a bash and zsh feature, not POSIX, so it is a portability trap in a script targeting `/bin/sh`. `> file 2>&1` achieves the same "both streams to one file" result and works everywhere.

- A is wrong: `&>` is a convenient bash and zsh shortcut for the same result, but it is not POSIX and will not work under a strict `/bin/sh`.
- B is wrong: Opening the same file independently for each descriptor can interleave writes unpredictably rather than reliably merging them; it is not the standard portable idiom.
- D is wrong: `tee` reads standard input from a pipe, but a plain pipe still carries only descriptor 1 by default, so error output would not reach it without the same `2>&1` merging step first.

### 81.

A pattern copied from documentation uses `colou?r` to match both "color" and "colour" with `grep`, but run without `-E` it finds nothing. Why?

- **A.** The pattern is a glob, not a regular expression, so `?` behaves as a glob wildcard instead
- **B.** grep requires quantifiers to be written in brackets, such as `[?]`, which is the bracket syntax that turns an ordinary character into an operator
- **C.** grep's default is basic regular expressions, where `?` is a literal character rather than an operator
- **D.** The pattern needs a leading anchor `^` before any quantifier will be recognised

**Answer: C.** In POSIX basic regular expressions — grep's and sed's default — the characters `+ ? | ( ) { }` are literal, and reaching their operator meanings requires backslashing them. `grep -E`, or backslashing as `colou\?r`, makes the quantifier work.

- A is wrong: grep interprets its pattern argument as a regular expression, not a glob; `?` there means "optional" only under extended syntax, not the glob meaning of "exactly one character".
- B is wrong: Wrapping `?` in brackets would make it a literal character class matching a literal question mark, not enable it as a quantifier; that is not how extended syntax is requested.
- D is wrong: Anchors control where a match starts or ends; they do not change whether `?` is read as an operator or a literal character.

### 82.

The glob `*.txt` and a regular expression both use `.` and `*`, but a pattern written for one tool copied unchanged into the other silently matches the wrong thing. What is the underlying reason for that inversion?

- **A.** Both languages assign identical meanings; any mismatch is caused by a shell quoting error instead
- **B.** Regular expressions do not use `.` as a metacharacter at all; only globs assign it a special meaning, leaving it an ordinary literal dot in every regex dialect
- **C.** The inversion only affects `sed`, not `grep`, since they use different regex engines entirely
- **D.** A glob's `*` means "any run of characters" and its `.` is ordinary, while a regex's `*` quantifies the preceding item and its `.` matches any character

**Answer: D.** A regular expression is not a glob. In a glob, `*` means "any run of characters" and `.` is an ordinary character; in a regular expression, `*` means "zero or more of the preceding item" and `.` matches any character — the glob `*.txt` becomes the regex `.*\.txt`.

- A is wrong: The meanings genuinely differ between a glob and a regular expression; this is not an artifact of quoting, which affects whether expansion happens at all, not what the pattern characters mean.
- B is wrong: A regular expression's `.` is one of its most common metacharacters, matching any single character; it is very much defined there.
- C is wrong: Both `grep` and `sed` default to the same basic regular expression dialect, so the glob-versus-regex inversion applies to patterns used with either tool.

### 83.

An instruction says to "change to root's home directory." A junior operator runs `cd /home/root` and gets "No such file or directory." Comparing the root directory, `/root`, and a regular user's home shows why the instruction was misread. Where should they actually go, and why does `/home/root` not exist?

- **A.** `cd /`; "root's home" and "the root directory" name the same place, since the superuser's account is rooted at the top of the tree
- **B.** `cd /root`; the FHS deliberately places the superuser's home outside `/home`
- **C.** `cd ~root`; the tilde form is required because `/root` is not a real path
- **D.** `cd /home`; regular users and the superuser share one parent directory

**Answer: B.** `/` is the root of the filesystem, `/root` is the superuser's home directory, and `~` is the current user's home — three different things sharing the words "root" and "home." The FHS places `/root` outside `/home` on purpose, so `/home/root` is never the right path.

- A is wrong: The root directory `/` is the top of the filesystem hierarchy; that is a different concept from an account's home directory, even though both are called "root."
- C is wrong: `/root` is a real, ordinary directory; `~root` is one valid shell shorthand for reaching it, not the only way, and the FHS documents `/root` as a literal path.
- D is wrong: FHS 3.0 describes `/home` as the site-specific location for user home directories, but it documents `/root` as a top-level directory in its own right, not as an entry underneath `/home`.

### 84.

Logged in as root, an operator runs `cd ~` and lands in `/root`. Logged in as an ordinary user named priya, the same bare command lands somewhere else. What determines where `cd ~` goes?

- **A.** The value of `$HOME` for whichever account is running the shell
- **B.** The hostname of the machine, since `~` is a per-host shorthand
- **C.** The permissions on `/root`, which redirect unprivileged users elsewhere automatically
- **D.** Whichever directory the shell most recently visited

**Answer: A.** `cd ~` expands to whatever `$HOME` holds for the account running the shell — typically `/root` for root and `/home/name` for an ordinary user — which is why the same typed command reaches two completely different places.

- B is wrong: The hostname plays no part in tilde expansion; the resolution depends entirely on the account's `$HOME`, not on which machine is running the shell.
- C is wrong: Permissions determine whether an unprivileged user can enter a directory, but they do not change what `~` expands to; priya's `~` never targets `/root` at all.
- D is wrong: That describes `cd -`, the previous-directory shortcut, not `~`, which is always tied to the account's home rather than recent history.

### 85.

An unprivileged user runs `cd /root` and gets "Permission denied," not "No such file or directory." What does the specific wording of that error tell an investigator?

- **A.** The two error messages are interchangeable, and neither implies anything about existence
- **B.** The directory exists, but its permissions simply do not grant that user access
- **C.** The system has no `/root` directory at all, and the shell substituted a generic message when it could not name the failure
- **D.** `cd` cannot report permission errors, so this message must come from a different command

**Answer: B.** An unprivileged user typing `cd /root` normally gets "Permission denied" rather than "No such file or directory," because the directory exists and ships with a restrictive mode — 700 on Debian-derived systems, 550 on Red Hat-derived ones — so the error message itself distinguishes the two situations.

- A is wrong: The two messages correspond to different failures on Linux: one means the target is not there, the other means it is there but access was refused.
- C is wrong: A missing path produces "No such file or directory", not "Permission denied", so this error confirms the opposite — the directory is present.
- D is wrong: `cd` reports permission errors directly when it cannot enter a directory it can otherwise see; no other command is involved here.

### 86.

What does the shell's `if` construct actually evaluate: a boolean expression, or something else entirely?

- **A.** A boolean expression written directly inside the `if` keyword's own syntax
- **B.** The value most recently assigned to `$?`, independent of what command runs next to `if`
- **C.** The exit status of the command it is given, where 0 means true
- **D.** Whether the following block contains any executable statements at all

**Answer: C.** The shell has no boolean type, and `if` does not evaluate an expression — it runs a command and branches on its exit status, where 0 means "true." That is what makes `if grep -q pattern file; then` a normal, working construct.

- A is wrong: There is no boolean expression syntax built into `if` itself; it always runs a command and branches on that command's exit status.
- B is wrong: `if` runs and evaluates its own given command fresh each time, rather than reading a leftover `$?` value from something that ran earlier.
- D is wrong: The content of the following block has no bearing on whether the `if` branch is taken; that is decided entirely by the tested command's exit status.

### 87.

Comparing `[ $a -eq $b ]` with `[ "$a" = "$b" ]`, what is the difference in what each actually compares?

- **A.** `-eq` compares numbers; `=` compares strings, and using the numeric form on non-numeric text is an error
- **B.** They are interchangeable; both always compare their operands as plain text
- **C.** `-eq` is for use inside `[[ ]]` only, and fails whenever used inside single-bracket `[ ]`
- **D.** `=` only works for comparing filenames, not arbitrary string values, because `[` expands each operand as a glob before comparing them

**Answer: A.** `[` is a command (a synonym for `test`); `-eq` compares numbers while `=` compares strings, and using the wrong one on the wrong type either errors or silently compares the wrong thing.

- B is wrong: `-eq` specifically performs a numeric comparison, which behaves differently from `=`'s string comparison whenever the operands are not simple integers.
- C is wrong: `-eq` is a standard operator for single-bracket `[ ]` (equivalent to `test`) as well as `[[ ]]`; it is not restricted to the double-bracket form.
- D is wrong: `[` performs no glob expansion of its own on the operands it is handed, and `=` compares any two strings as text with no restriction to filenames - which is why it is the correct operator for general string equality.

### 88.

A substitution `sed 's/http/https/' urls.txt` is run on a line containing "http" twice, and only the first occurrence is replaced. What flag was left off, and what does it do?

- **A.** The `-n` flag, which suppresses automatic printing so later matches are visible
- **B.** The `g` flag, which replaces every match on the line rather than just the first
- **C.** The `-E` flag, which enables replacing more than one match per line
- **D.** The `-i` flag, since editing the file in place is required before a second match can be found

**Answer: B.** The useful flags on `s/pattern/replacement/flags` include `g`, which replaces every match on the line rather than only the first. Its absence is exactly why a line with two occurrences of "http" only had the first one changed. The substitution form behind all of this is `sed 's/a/b/g'`.

- A is wrong: `-n` suppresses sed's default per-line printing; it controls what gets printed, not how many matches on a line get replaced.
- C is wrong: `-E` switches sed to extended regular expression syntax; it has no effect on how many matches per line are replaced.
- D is wrong: `-i` controls whether changes are written back to the file or sent to standard output; it does not change how many occurrences per line are substituted.

### 89.

A script written and tested with GNU `sed -i 's/a/b/g' file` is later run unmodified on a macOS workstation, whose `sed` is a BSD build. What happens?

- **A.** It runs identically, since `-i` behaves the same across all `sed` implementations
- **B.** It silently skips the substitution but leaves the file otherwise untouched, because an unrecognised in-place flag is simply ignored rather than treated as an error
- **C.** It fails because BSD sed does not support the `s///g` substitution syntax at all
- **D.** It fails, because BSD `sed` requires a backup suffix argument even when none is wanted, unlike GNU's optional suffix

**Answer: D.** In-place editing is where GNU and BSD sed diverge. GNU sed takes an optional suffix attached to `-i`; BSD sed, including the one shipped with macOS, requires the suffix as a separate argument, so the portable-looking `sed -i 's/a/b/g' file` fails there.

- A is wrong: In-place editing is exactly where GNU and BSD sed diverge; the flag's syntax is not portable between them.
- B is wrong: The mismatch produces an error or an unwanted backup file with a misleading name, not a silent no-op that leaves the file untouched.
- C is wrong: BSD sed supports the same `s/pattern/replacement/flags` substitution syntax; the divergence specifically concerns `-i`'s argument handling, not the substitution command itself.

### 90.

Without any `-n` flag, does `sed` print only the lines its script matched, or every input line regardless of whether it matched?

- **A.** Only the lines that matched the script's pattern, by default
- **B.** Nothing prints by default; sed requires `-p` on the command line to produce any output
- **C.** Only the last line of the file, matching `tail`'s default behaviour
- **D.** Every input line, whether it matched or not, unless `-n` is given

**Answer: D.** By default sed prints every input line whether it matched or not, which is why `sed -n '/error/p'` — suppressing automatic printing and explicitly printing only matches — is the idiom for "print only matching lines."

- A is wrong: That selective behaviour requires `-n` combined with an explicit `p` command; without `-n`, every line prints regardless of whether it matched.
- B is wrong: There is no `-p` command-line flag; `p` is a script command used together with `-n`, and sed prints every line by default without either.
- C is wrong: sed processes and prints the entire input stream line by line by default; it does not restrict itself to the final line the way `tail` does.

### 91.

A script begins with `#!/bin/bash` and is executable, but running it as `sh script.sh` produces different behaviour than running it as `./script.sh`. Why does the shebang not apply in the first case?

- **A.** The shebang line only takes effect after the script has run once successfully
- **B.** The shebang is honoured only when the file is executed directly; explicitly naming an interpreter bypasses it
- **C.** `sh script.sh` and `./script.sh` are two names for the exact same operation, because the shell rewrites the first form into the second before running it
- **D.** The shebang only applies to the first line of output, not the first line of the file

**Answer: B.** The kernel's `execve` inspects a file's first bytes only when it is executed directly; if they are `#!`, it runs the named interpreter. Invoking the script as `sh script.sh` runs it under `sh` explicitly instead, ignoring the shebang entirely.

- A is wrong: There is no such warm-up requirement; the shebang is either consulted at direct execution or not consulted at all when a different interpreter is named explicitly.
- C is wrong: The shell performs no such rewrite: `./script.sh` is a direct execution in which the kernel reads the shebang, while `sh script.sh` runs `sh` and hands it the file as an argument, which is what bypasses the shebang.
- D is wrong: The shebang is read from the very first bytes of the file itself by the kernel before anything runs; it has nothing to do with the script's output.

### 92.

A newly written script fails with "Permission denied" when run as `./deploy.sh`, even though its contents look correct and the shebang is present. What is the most likely missing step?

- **A.** `chmod +x deploy.sh` was never run, so the file lacks the execute bit
- **B.** The shebang line needs to be moved to the second line of the file
- **C.** The script must be renamed with a `.sh` extension before it can be executed
- **D.** The script needs to be sourced with `.` instead of run with `./`

**Answer: A.** Running a file directly requires the execute bit, set by `chmod +x`. Without it, the kernel refuses to execute the file at all and reports "Permission denied," independent of whether the shebang line is correct.

- B is wrong: The shebang must be the very first line for the kernel to recognise it; moving it elsewhere would break interpretation entirely rather than causing a permission error specifically.
- C is wrong: Linux attaches no special meaning to a `.sh` extension for execution; what is required is the execute bit, not a particular filename suffix.
- D is wrong: Sourcing changes whether the script's effects persist in the current shell; it does not bypass or substitute for the execute-bit requirement that "Permission denied" is reporting.

### 93.

A script edited on Windows and copied to a Linux server fails immediately with "bad interpreter: No such file or directory," even though `/bin/bash` clearly exists. What is the actual cause?

- **A.** The shebang line ends in a carriage return, so the kernel looks for an interpreter literally named `/bin/bash\r`
- **B.** `/bin/bash` was replaced by a symlink the transfer rewrote, because copying from a Windows host resolves and flattens symlinks on the destination
- **C.** The execute bit was reset during the file transfer, producing this specific error text
- **D.** Windows-edited scripts cannot use `#!/bin/bash` at all and must use `#!/bin/sh`

**Answer: A.** A file saved with Windows line endings has a shebang line ending in a carriage return, so the kernel looks for an interpreter named `/bin/bash\r`, which does not exist — producing the misleading "bad interpreter: No such file or directory."

- B is wrong: Copying a file onto a Linux server does not touch `/bin/bash` or any symlink already there; the reported error names the interpreter path, which is the signature of a stray carriage return appended to it.
- C is wrong: A missing execute bit produces "Permission denied," not "bad interpreter"; the wording here specifically points at the interpreter path itself being wrong.
- D is wrong: There is nothing wrong with `#!/bin/bash` as an interpreter path; the failure is caused by the invisible carriage return appended to the line, not by which interpreter was named.

### 94.

A value prints correctly with `echo $BACKUP_DIR` at the interactive prompt, but a script invoked from that same shell reports the variable as empty. What is the most likely cause?

- **A.** Scripts always run with a completely empty environment, regardless of exports
- **B.** The variable was assigned but never exported, so it never left the interactive shell
- **C.** The script needs to be run with `sudo` before it can see any variables, because a child process only receives an environment when it runs as root
- **D.** The variable name is case-sensitive in the script but not at the prompt

**Answer: B.** A variable that has not been exported is local to the shell that set it. `export NAME` marks it for inclusion in the environment handed to child processes from then on; without that, a script — a child process — cannot see it even though `echo` shows it correctly at the prompt.

- A is wrong: A script inherits the exported environment of its parent shell; it does not start empty, which is exactly why exporting the variable would fix the problem.
- C is wrong: Every child process inherits the exported environment of its parent regardless of user; `sudo` in fact strips much of that environment rather than supplying it, and the described symptom is a missing export.
- D is wrong: Variable name case-sensitivity is consistent everywhere in bash; nothing in the scenario suggests the script used a different name.

### 95.

A script sets `DEPLOY_ENV=staging` and then calls `export DEPLOY_ENV` afterward before running a helper program. Could the assignment and the export have been combined into fewer lines, and does order matter here?

- **A.** No — `export` and assignment must always be written on two separate lines, since `export NAME=value` is rejected as a syntax error
- **B.** Yes — `export DEPLOY_ENV=staging` does both at once, and either order works as long as export happens before the helper runs
- **C.** Yes, but only if a space is placed around the `=` sign, matching ordinary assignment style
- **D.** No, because exporting a variable after assignment silently discards its value

**Answer: B.** `export NAME=value` assigns and exports in one step, and `export` may also be applied after a plain assignment; either way, what matters is that the variable has been exported before the child process that needs it starts.

- A is wrong: bash(1) gives the builtin's synopsis as `export [-fn] [name[=value]] ...`, so assigning and exporting in one statement is documented syntax, not an error.
- C is wrong: A space around `=` breaks the assignment entirely — `NAME = value` is parsed as running a command called `NAME` with two arguments — so this would introduce a new bug rather than combining the lines safely.
- D is wrong: Exporting does not discard or reset a variable's value; it only marks the existing value for inclusion in the environment of future child processes.

### 96.

Comparing `set` with no arguments against `env`, what is the difference in what each lists, and how does that explain a variable that appears in one but not the other?

- **A.** `set` lists only exported variables, and `env` lists everything including functions
- **B.** Both list identical output; any difference indicates a corrupted shell session
- **C.** `env` includes variables from every user's login shell, not just the current one
- **D.** `set` lists all shell variables and functions; `env` lists only exported ones

**Answer: D.** `set` with no arguments lists all shell variables and functions; `env` (and `printenv`) lists only exported ones. A variable visible in `set` but absent from `env` is exactly a shell variable that was never exported.

- A is wrong: This reverses the roles: `set` is the broader listing including unexported variables and functions, while `env` (and `printenv`) shows only the exported subset.
- B is wrong: The two commands are expected to differ whenever unexported shell variables exist; that difference is normal, not a sign of corruption.
- C is wrong: `env` reports the current process's own environment, not other users' sessions; it is scoped to the invoking shell just as `set` is.

### 97.

A command's output is captured to a file with `>`, yet an error message from that same command still appears on the screen. Comparing what "output" covers against the three numbered streams, why does this happen?

- **A.** "Output" always includes both streams, so this must indicate a shell bug
- **B.** Only descriptor 1 was redirected; descriptor 2 still points at the terminal
- **C.** The error is arriving through a pipe from a background process instead
- **D.** Errors bypass redirection entirely and cannot be captured under any circumstances

**Answer: B.** A program writes results to descriptor 1 and diagnostics to descriptor 2. Both default to the terminal, so they look like one stream until something is redirected — `command > file` moves only descriptor 1, leaving descriptor 2's error messages on screen.

- A is wrong: This ambiguity is the point of the design, not a bug: only the operator that explicitly names descriptor 2 moves error messages, and `>` alone does not.
- C is wrong: Nothing in the scenario involves a pipe or a background process; the error is simply travelling on the untouched descriptor 2, as it always does by default.
- D is wrong: Errors can be captured with an operator that names descriptor 2, such as `2>`; they are not immune to redirection, they are simply on a separate descriptor that `>` alone does not touch.

### 98.

Which file descriptor numbers correspond to standard input, standard output and standard error, in that order?

- **A.** 1, 2 and 3
- **B.** 0, 2 and 1, with error coming before output
- **C.** There are no fixed numbers; they vary by which shell is running
- **D.** 0, 1 and 2

**Answer: D.** Every process starts with three file descriptors: 0 is standard input, 1 is standard output, and 2 is standard error. These are numbers, not files — what they connect to is decided by whoever started the process.

- A is wrong: Descriptor numbering starts at 0 for standard input, not 1; shifting the numbers by one misassigns all three streams.
- B is wrong: Standard output is descriptor 1 and standard error is descriptor 2; this swaps the two, which is a common but incorrect pairing.
- C is wrong: The numbering 0, 1 and 2 is a fixed Unix convention that every shell and program relies on, not something that varies by shell.

### 99.

A command's output is piped into `grep`, and its error messages are noticed to still appear on screen rather than being searched. Why does a plain pipe not carry them along?

- **A.** A pipe carries both streams by default, so `grep` should already be matching against error text too
- **B.** `grep` specifically filters out anything that looks like an error message
- **C.** A pipe connects only descriptor 1 by default, so standard error is not carried into the pipeline
- **D.** Redirection with `2>` must precede the pipe for the pipeline to run at all

**Answer: C.** Errors travelling on their own descriptor is the design decision that makes redirection and piping predictable: a pipe only connects descriptor 1 by default, so piping a command's output to `grep` does not filter its error messages.

- A is wrong: Only descriptor 1 is connected by a plain pipe; the assumption that error text is included by default is exactly the mistake the exam probes.
- B is wrong: `grep` has no awareness of which stream text came from; it simply matches lines against a pattern on whatever standard input it is given.
- D is wrong: A pipeline runs fine with no redirection at all; `2>` is only needed if the error stream specifically needs to be captured or discarded.

### 100.

`df -h` reports the root filesystem at 100% full, but `du -sh /var/log` reports only a few hundred megabytes in use there. What explains the disagreement, and which command is telling the more complete story?

- **A.** `du` always undercounts by design and should never be trusted for capacity planning
- **B.** A deleted file is still held open by a running process, so `df` counts its space while `du` cannot see it
- **C.** `df` is counting inodes rather than blocks, which inflates its percentage, because `-h` switches the report from block usage to inode usage
- **D.** The two commands are measuring different filesystems entirely, despite both naming `/var/log`

**Answer: B.** When `df` reports a full filesystem that `du` says is mostly empty, a process is still holding a deleted file open, and that space is not released until the process closes it or exits — `df` counts allocated blocks, `du` only sums what it can see in the directory tree. The same family includes `ps aux` for a process snapshot, `du -sh` for a directory's total size, `uptime` for the load averages, and `uname -a` for kernel and machine details.

- A is wrong: `du` is accurate for what it measures — visible files in the tree it walks; the disagreement here has a specific cause, a deleted-but-open file, not a general unreliability.
- C is wrong: `-h` only makes the sizes human-readable; GNU df reports block usage by default and inode usage only under `-i`, and nothing in the scenario points at inode exhaustion.
- D is wrong: Nothing in the scenario suggests a mount boundary between the two checks; the standard explanation for this exact disagreement is a deleted file still held open by a process.

### 101.

A process refuses to exit after a plain `kill 4821`. What did the default signal actually do, and what is the next escalation if the process keeps ignoring it?

- **A.** The default already sends SIGKILL, so nothing stronger is available, and `-9` is just an older spelling of that same default signal
- **B.** `kill` requires a process name, not a PID, so `4821` was rejected outright
- **C.** The default sends SIGTERM, which the process can catch and ignore; `kill -9` sends SIGKILL, which it cannot
- **D.** A process stuck in uninterruptible I/O always responds to `kill -9` within seconds

**Answer: C.** `kill` without a number sends SIGTERM, a polite request the process can catch and ignore; `kill -9` sends SIGKILL, which cannot be caught and skips cleanup — though a process stuck in uninterruptible I/O will not die even then.

- A is wrong: A plain `kill` sends TERM, not KILL, and `-9` selects a genuinely different signal rather than respelling the default; SIGKILL is a real escalation still available.
- B is wrong: `kill` specifically takes PIDs; `pkill` and `killall` are the ones that take names, and a numeric PID like `4821` is exactly what `kill` expects.
- D is wrong: A process stuck in uninterruptible I/O will not die even from SIGKILL, which is a separate, known limitation rather than something `-9` reliably overcomes.

### 102.

`free -h` shows very little in the "free" column, and an operator concludes the system is nearly out of memory. Which column should actually be read, and why is "free" misleading?

- **A.** "free" is correct as read, and a low value always means the system is memory-starved
- **B.** "buff/cache," because it reports memory reserved exclusively for running applications
- **C.** None of the columns matter; only `top`'s live view reflects real memory pressure, because `free` reads cached totals rather than the live kernel counters
- **D.** "available," because the kernel deliberately uses idle memory as reclaimable page cache

**Answer: D.** Reading the "free" column as memory available to applications is a routine misreading; the kernel deliberately uses idle memory as reclaimable page cache, so "available" — which accounts for that reclaimable cache — is the meaningful figure.

- A is wrong: A low "free" value on its own does not indicate memory pressure, because reclaimable page cache is counted there; "available" is the meaningful figure for application headroom.
- B is wrong: "buff/cache" reports the reclaimable cache itself, not memory reserved for applications; it is part of what makes "available" larger than "free," not a separate application-reserved figure.
- C is wrong: `free` reads the same live `/proc/meminfo` fields `top` does - its "available" column is MemAvailable - so it is neither cached nor coarse, and it answers this question directly.

### 103.

A rescue shell on a server that will not boot offers exactly one editor, and an operator needs to comment out a bad line in an fstab entry and save. Starting from vi's normal mode, what sequence gets the change saved without leaving the file in a broken state?

- **A.** Type `:wq` immediately from wherever the cursor is
- **B.** Press `i` to insert, edit the line, press Escape, then type `:wq`
- **C.** Press `a` to append, edit the line, then type `:q!` to save
- **D.** Use `nano`'s `Ctrl-O` and `Ctrl-X` sequence, since it also works inside vi

**Answer: B.** vi starts in normal mode, where `i` enters insert mode to make changes and Escape returns to normal mode. From normal mode, `:wq` writes the file and quits — typing it while still in insert mode instead inserts those characters literally. On a system with nothing else installed, that one editor is `vi`.

- A is wrong: If the editor is still in insert mode, those four characters are inserted into the file as literal text instead of being read as a command; Escape must return to normal mode first.
- C is wrong: `:q!` quits discarding all changes; the command that writes and quits is `:wq`, so this sequence would discard the edit rather than saving it.
- D is wrong: nano's key bindings are specific to nano; vi is modal and uses its own normal-mode commands, not nano's Control-key shortcuts.

### 104.

A minimal container image has no `nano` installed. Comparing vi and nano for which is guaranteed to be present, which editor can be relied on, and why?

- **A.** Neither; a minimal image guarantees no text editor at all
- **B.** vi, because it is POSIX-standardised and present on essentially every Unix-like system
- **C.** nano, since it is the simpler tool and simpler tools are prioritised in minimal images
- **D.** Whichever editor is named by the `EDITOR` variable, since that guarantees availability

**Answer: B.** vi is standardised by POSIX and present on essentially every Unix-like system, including minimal containers and rescue images, even if the build is a cut-down one. nano is modeless and easier to start with, but it is a separate package a minimal system may not have.

- A is wrong: vi's ubiquity is precisely the practical point of this topic — a rescue shell, a container, or a stripped-down server that offers exactly one editor offers vi.
- C is wrong: The scenario states nano is specifically absent from this image; nano is also a separate package that a minimal system may not include at all.
- D is wrong: `EDITOR` only names a preference; it does not guarantee the named program is actually installed on a minimal image.

### 105.

An operator needs to page back and forth through a multi-gigabyte log file without flooding the terminal and without waiting for the whole file to load first. Which tool is designed for that, and why does it start instantly?

- **A.** `cat`, because concatenating the file to standard output is the fastest way to read it
- **B.** `head`, because showing only the first lines avoids reading the rest of the file
- **C.** `less`, because it reads lazily and only loads what it currently displays
- **D.** `tail -f`, because following the file avoids ever loading its earlier contents

**Answer: C.** `less` reads lazily, allowing backward movement and searching, and opens instantly on a huge file because it only loads what it displays — unlike `cat`, which dumps the whole file to standard output at once.

- A is wrong: `cat` dumps the entire file to standard output at once, which floods the terminal on a multi-gigabyte log rather than paging through it.
- B is wrong: `head` prints only the first part of a file and exits, so it gives a quick look but never lets the operator move on through the rest.
- D is wrong: `tail -f` is for watching new lines as they are appended to a growing file, not for reading through an existing large file from the start.

### 106.

A log file is rotated at midnight, and a `tail -f` window watching it goes permanently silent afterward even though new entries are clearly being written. Which option fixes this, and why did plain `-f` fail?

- **A.** `tail -F`, because it follows the file by name and reopens after rotation
- **B.** `tail -n 20`, because increasing the starting line count restores visibility
- **C.** `head -c`, because reading by byte count survives rotation where line following does not
- **D.** Nothing fixes this; `tail -f` is expected to stop working after any log rotation permanently

**Answer: A.** `tail -f` holds the file open and follows the same file descriptor, so if the log is rotated away the command keeps watching a file nobody writes to any more. `tail -F` follows the name and reopens after rotation.

- B is wrong: The line count controls how much history is shown at startup; it has no effect on whether the command notices a file rotation.
- C is wrong: `head` reads from the beginning of a file and does not follow growth at all, so it cannot be the fix for a stalled follow.
- D is wrong: `tail -F` specifically exists to solve this exact problem by reopening the file after rotation, so the situation is not unfixable.

### 107.

After running `sudo -i`, an operator runs `whoami` and it prints `root`. Which command instead reports the original account that actually logged in?

- **A.** `id -u`, since it reports the numeric UID of the original account
- **B.** `whoami` run a second time, since the first invocation caches a stale result
- **C.** `who am i`, which reads the original login name from the utmp record
- **D.** `w`, since its header always lists the account that first logged in

**Answer: C.** `whoami` reports the effective user, so inside `sudo -i` it says `root` no matter who started the session. `who am i`, or `logname`, reports the original login name from the utmp record, which is the whole point of an accountability question.

- A is wrong: `id -u` reports the effective UID of the current shell — 0 for root after `sudo -i` — not the original login account.
- B is wrong: `whoami` has no caching; running it again after `sudo -i` still reports the effective user, `root`, not the original login.
- D is wrong: `w`'s header reports the current time, uptime and system-wide load, not a designated "original login" account; it lists every current session's user rather than singling one out.

### 108.

An audit needs to see every supplementary group a user belongs to, not just their primary account name. Which of `who`, `w`, `last`, `id` and `whoami` actually reports that?

- **A.** `id`, which lists every supplementary group along with the real and effective IDs
- **B.** `whoami`, since it reports the full account profile including group membership
- **C.** `who`, since it lists every attribute of each logged-in session including groups
- **D.** `last`, since the historical login record stores each session's group list alongside its terminal and login time

**Answer: A.** `id` with no options prints the real user and group IDs, the effective ones when they differ, and lists every supplementary group — none of `who`, `w`, `last` or `whoami` reports group membership.

- B is wrong: `whoami` prints only the effective user name and nothing else — no group information at all.
- C is wrong: `who` lists session information — name, terminal, login time and remote host — from utmp, with no group membership data.
- D is wrong: last(1) "searches back through the /var/log/wtmp file ... and displays a list of all users logged in (and out)"; wtmp records sessions, not group membership, so there is no group list to read.

### 109.

In a directory with no `.txt` files at all, an operator runs `ls *.txt` and gets an error naming a file literally called `*.txt`. What does that error reveal about how the shell handled the pattern?

- **A.** `ls` interpreted `*.txt` as an option because it began with an unrecognized character
- **B.** The glob matched every file in the directory, and `*.txt` happened to be one of the names
- **C.** No pathname matched, so bash left the unquoted word exactly as typed and passed it through
- **D.** `ls` created a file named `*.txt` to satisfy the command, since a listing tool creates any operand it cannot find

**Answer: C.** Before executing, the shell scans an unquoted word for pattern characters and replaces it with matching pathnames. If nothing matches, bash leaves the word exactly as typed, so `ls *.txt` in an empty-of-.txt directory produces an error about a file literally named `*.txt`.

- A is wrong: `*` has no special meaning to `ls` itself; pattern expansion is entirely the shell's job, and `ls` only ever sees the result the shell hands it.
- B is wrong: The scenario states there are no `.txt` files at all, so nothing matched; the literal-passthrough behaviour is what produced the error, not an unexpected match.
- D is wrong: `ls` only reports on entries that already exist and has no option that creates one; the error proves the shell handed it a name that was never expanded, not that a file appeared.

### 110.

A glob pattern `*.txt` and a regular expression are sometimes assumed to mean the same thing because they share the `*` character. What does `*` actually mean in each, and what is the regular-expression equivalent of the glob `*.txt`?

- **A.** `*` means the same thing in both, so `*.txt` is already valid as a regular expression
- **B.** Globs do not use `*` at all; only regular expressions define that character, and the wildcard behaviour glob users see actually comes from filename completion instead
- **C.** In a glob, `*` means "any run of characters"; the regex equivalent of `*.txt` is `.*\.txt`
- **D.** The regex equivalent of the glob `*.txt` is simply `*.txt` written inside anchors

**Answer: C.** A glob is not a regular expression, even though both use `*`. In a glob, `*` means "any run of characters"; in a regular expression, `*` means "zero or more of the preceding item," so the regex equivalent of the glob `*.txt` is `.*\.txt`.

- A is wrong: The two meanings are different: a glob's `*` matches any run of characters directly, while a regex's `*` quantifies the character immediately before it.
- B is wrong: Globs use `*` as one of their core pattern characters, matching any run of characters including none, which is exactly the source of the confusion.
- D is wrong: Anchoring alone does not change what `*` quantifies; without a preceding `.` to mean "any character," a bare `*` in a regex is not the same as the glob's wildcard.

### 111.

A deployment pipeline needs the machine's instruction set architecture to pick the right container image tag. Which command reports it, using the option that reports machine hardware name specifically?

- **A.** `uname -r`, whose kernel release string identifies the platform the container image must match.
- **B.** `uname -m`, whose `-m` option reports the machine hardware name — `x86_64` or `aarch64` — the CPU instruction set the kernel was built for.
- **C.** `lscpu`, whose `Architecture:` line is the only place the system exposes the instruction set.
- **D.** `arch` and `uname -m` can disagree on the same machine, so both should be checked and reconciled manually.

**Answer: B.** `uname -m` reports the machine hardware name via its `-m` option, distinct from `-r`'s kernel release. `arch` reports the same value as a thin wrapper, so the two commands do not disagree on Linux.

- A is wrong: `-r` reports the kernel release, a version string, not the machine hardware name; it answers a different question than the one the pipeline asked.
- C is wrong: `lscpu` does report an `Architecture:` line, but it is not the only place: `uname -m` prints the machine hardware name directly, which is the field the task calls for.
- D is wrong: On Linux, `arch` is effectively a thin wrapper around the same value `uname -m` reports; assuming disagreement is possible is the guide's stated trap.

### 112.

A container image built for `linux/amd64` fails to start on a host where `uname -m` reports `aarch64`, with an unhelpful generic error. What kind of problem is this most likely to be?

- **A.** A missing kernel module for the container runtime, unrelated to the image's intended target platform entirely.
- **B.** A kernel version mismatch, since `uname` is the very command that surfaced the problem in the first place.
- **C.** The error is unrelated to architecture, since container images are built to run on any host platform by design.
- **D.** An architecture mismatch; the image's instruction set does not match the host's, not a missing dependency inside the image.

**Answer: D.** Binaries and container images are architecture-specific. `amd64` naming a target that does not match the host's `aarch64` is an architecture mismatch, not a missing dependency — recognising the symptom avoids wrong-direction debugging.

- A is wrong: Nothing in the scenario points at a missing driver; the architecture strings named — `amd64` versus `aarch64` — are what identify the actual cause.
- B is wrong: `uname -m` reports hardware architecture specifically; a kernel version mismatch would involve `uname -r`, a different field entirely.
- C is wrong: Container images and the binaries inside them are architecture-specific; one built for one instruction set will not run natively on another without emulation, which is exactly this failure.

### 113.

A batch job needs to know how many processing units are actually available to it right now, which may be fewer than the machine's physical total under a cgroup limit. Which command answers that specifically?

- **A.** `lscpu`, whose `CPU(s):` summary line gives the number of processing units the job can actually use.
- **B.** `free -h`, since memory and CPU limits are reported together under cgroups.
- **C.** `nproc`, which reports the number of processing units currently available to the calling process.
- **D.** `nproc --all` and plain `nproc` always report the same number, so either serves the purpose.

**Answer: C.** `nproc` reports processing units currently available to the calling process, which can be fewer than the physical total under cgroup or affinity constraints. `lscpu` describes the machine's overall topology instead.

- A is wrong: `lscpu` reports the machine’s CPU topology from sysfs and /proc/cpuinfo; its `CPU(s)` count does not account for a cgroup or affinity restriction on the calling process, which is what `nproc` reports.
- B is wrong: `free -h` reports memory and swap usage; it says nothing about how many processing units a process can use.
- D is wrong: `--all` counts all installed processors regardless of restriction, while plain `nproc` reports what is currently available to the caller — exactly the distinction this task needs.

### 114.

`lscpu` reports 'CPU(s): 16' on a machine with 8 physical cores and simultaneous multithreading enabled. Is 16 the physical core count?

- **A.** Yes — `lscpu`'s 'CPU(s)' line always reports physical cores regardless of any SMT or hyperthreading settings enabled.
- **B.** The discrepancy means the machine actually has two separate CPU architectures installed side by side on one board.
- **C.** `lscpu` is reporting a fault, since the number of CPUs should always equal the physical socket count exactly, with no legitimate exceptions permitted on real hardware.
- **D.** No. With hyperthreading, the logical processor count exceeds the physical core count; `lscpu` separates sockets, cores, and threads explicitly in its fuller output.

**Answer: D.** 'Number of CPUs' is ambiguous between sockets, physical cores, and logical processors — with hyperthreading, logical count exceeds physical cores. `lscpu`'s fuller output separates these explicitly, avoiding the misreading.

- A is wrong: That line reports logical processors, which include SMT threads; reading it as physical cores is exactly the misreading the guide warns about.
- B is wrong: Nothing about SMT implies multiple architectures; hyperthreading multiplies the logical count on a single architecture's physical cores.
- C is wrong: This is expected, correct behaviour for a system with SMT enabled; it is not a fault, and 'CPU(s)' was never defined to mean socket count.

### 115.

'Which desktop environment does Ubuntu use' is asked as if it has one fixed answer. What makes that framing unreliable?

- **A.** Desktop environment choice is fixed permanently at the kernel level and cannot vary between different installs of the same distribution's official installation image at all.
- **B.** Ubuntu specifically has never offered more than one desktop environment option to install on any release.
- **C.** Most major distributions ship several desktop environments as installable options or spins, so the honest answer is 'whichever the specific install chose,' not a fixed mapping.
- **D.** The question is reliable; every distribution has exactly one desktop environment it ships with by design choice, always.

**Answer: C.** A desktop environment — window manager, panel, file manager, settings, and default applications — is a coherent product whose choice is independent of the distribution. Most major distributions ship several as installable options, so a fixed distribution-to-desktop mapping does not hold.

- A is wrong: Desktop environment choice runs on top of a display server and is independent of the kernel entirely; nothing about it is fixed at that layer.
- B is wrong: Ubuntu ships official spins with different desktop environments (GNOME by default, others via spins), which is itself a counterexample to a single fixed answer.
- D is wrong: This restates the very assumption the guide flags as unreliable — most major distributions offer more than one installable desktop environment.

### 116.

A user wants to switch from GNOME to KDE Plasma on their existing installation without reinstalling the distribution. Is that generally supported?

- **A.** Yes. Swapping desktop environments on the same distribution and display server is generally supported, since the choice is independent of the distribution.
- **B.** No — the display server itself would need reinstalling from scratch, since each desktop environment is assumed to require its own dedicated protocol underneath it.
- **C.** No — swapping desktop environments requires switching to a different distribution family entirely first, before anything else.
- **D.** Yes, but only if the user also switches from CLI administration to GUI administration beforehand as a prerequisite.

**Answer: A.** A desktop environment runs on top of a display server, providing the window manager and surrounding applications. Swapping desktop environments on the same distribution and display server is generally supported, since the choice is independent of the distribution.

- B is wrong: A desktop environment runs on top of an existing display server, X11 or Wayland; it does not require reinstalling that underlying protocol layer.
- C is wrong: Distribution family concerns package manager lineage; it has no bearing on which desktop environment is installed on top of a given distribution.
- D is wrong: GUI-vs-CLI administration and desktop environment choice are separate questions; nothing about swapping environments requires changing how the system is otherwise administered.

### 117.

A new peripheral does not work. `lsmod` shows no module related to it. What is the correct next step before concluding a module needs to be loaded?

- **A.** Check whether a suitable module exists to load with `modprobe` — but also consider that the driver might be compiled directly into the kernel, in which case it would never appear in `lsmod` at all.
- **B.** Assume the device needs a firmware update instead, since `lsmod` never lists device firmware either way regardless of what is loaded.
- **C.** Run `insmod` directly with a guessed module filename, since it behaves identically to `modprobe` in practice for any driver.
- **D.** Conclude the driver is definitely absent, since `lsmod` is supposed to be a complete list of every single driver active on the system right now, with no exceptions for how a driver was originally built into the kernel image.

**Answer: A.** `lsmod` only lists loaded modules; a built-in driver never appears there even though it is active. `modprobe` loads a module and resolves dependencies automatically, unlike the more primitive `insmod`.

- B is wrong: `lsmod` not listing firmware is expected and unrelated; the immediate next step is checking for a loadable module or a built-in driver before considering firmware.
- C is wrong: `insmod` loads exactly the file given with no dependency resolution, unlike `modprobe`, which resolves dependencies automatically — the two are not interchangeable.
- D is wrong: This is precisely the mistake the guide warns against: a built-in driver is active but never appears in `lsmod`, so the list is not complete in that sense.

### 118.

Kconfig marks a hardware option `Y` at kernel build time rather than `M`. What does that mean for how its driver reaches the running system?

- **A.** The driver still ships as a `.ko` file in this case, but `modprobe` loads it automatically on every single boot without ever being asked to.
- **B.** The driver is actually firmware now, embedded in the device itself rather than anywhere in the kernel image.
- **C.** The driver is compiled directly into the kernel image and is active from boot, with no separate module to load or unload at runtime.
- **D.** `Y` is simply an older, deprecated way of marking a module that modern kernels now ignore entirely in favour of `M`.

**Answer: C.** A device driver can be built directly into the kernel image (`Y`) or as a loadable module (`M`) that attaches and detaches at runtime. A built-in driver is already part of the running kernel and has no separate module to list in `lsmod`.

- A is wrong: A `.ko` file describes a loadable module, which is what `M` produces; a `Y` marking means no separate module file exists at all.
- B is wrong: Firmware runs on the device's own controller and is a separate layer entirely; a Kconfig `Y` marking concerns kernel-side driver code, not device firmware.
- D is wrong: Kconfig's tristate option genuinely supports either compiled-in (`Y`) or module (`M`) builds; `Y` is not deprecated, and either can be the correct choice depending on the driver.

### 119.

Given `ID=fedora` in a system's `/etc/os-release`, which package manager and package format should be expected?

- **A.** `apt`, using `.deb` packages, since Fedora is commonly assumed to follow the same lineage as Ubuntu.
- **B.** `dnf`, using `.rpm` packages, since Fedora belongs to the Red Hat family.
- **C.** `zypper`, using `.rpm` packages, since Fedora and openSUSE are both `.rpm`-based.
- **D.** Whichever manager the administrator prefers, since package format is a matter of local configuration rather than distribution identity.

**Answer: B.** Fedora is in the Red Hat family, which uses `.rpm` packages and `dnf`. Package-manager questions are literal recall: given a distribution name, its family's tooling follows directly.

- A is wrong: That assumption pairs Fedora with the Debian family; Fedora is Red Hat-family and uses `dnf`, not `apt` — a pure recall failure the exam is built to catch.
- C is wrong: Sharing a package format does not mean sharing a family's tooling; `zypper` belongs to SUSE, not Red Hat, even though both use `.rpm`.
- D is wrong: Package format and manager are fixed by the distribution's family, not by local preference; installing a foreign package manager does not change what the distribution ships with by default.

### 120.

A colleague claims 'CentOS Stream is just CentOS Linux under a new name, still safe to treat as a fixed, stable release.' What is wrong with that claim?

- **A.** CentOS Stream is a rolling preview of upcoming RHEL, not a continuation of the discontinued, fixed-release CentOS Linux; Rocky Linux is the actual fixed-release replacement.
- **B.** Nothing is wrong — both are Red Hat family distributions sharing the same `dnf` package manager and `.rpm` format, so the naming difference carries no practical operational weight at all.
- **C.** The claim is wrong only about the package manager, since CentOS Stream switched to `apt` at some point during its development.
- **D.** The claim is essentially correct; 'Stream' only refers to a faster update channel within that same fixed-release product line.

**Answer: A.** CentOS Stream is not CentOS Linux — it is a rolling preview of upcoming RHEL, not the discontinued fixed-release CentOS Linux. Rocky Linux exists specifically as CentOS Linux's downstream, fixed-release replacement.

- B is wrong: Sharing a family's tooling does not make two products interchangeable; release stability and support model differ sharply between a rolling preview and a fixed release.
- C is wrong: CentOS Stream remains `.rpm`/`dnf`-based, staying within the Red Hat family; the package manager was never the issue with the claim.
- D is wrong: This restates the misconception rather than correcting it — Stream previews upcoming RHEL and is not the discontinued fixed-release CentOS Linux at all.

### 121.

A variable is set with `MYVAR=value` in an interactive shell. `echo $MYVAR` shows the value, but a script the shell then runs cannot see it at all. Why, and which command would have fixed it?

- **A.** `env` was not run first, and running it would have exported every current shell variable automatically for the script.
- **B.** The script uses a different PATH, which prevented it from finding the variable's value anywhere in that path.
- **C.** Interactive shells and scripts are always supposed to share the exact same variables automatically, so an outcome like this one should genuinely never be possible in the first place.
- **D.** It was never exported, so it is a shell variable rather than an environment variable and is not inherited by child processes; `export MYVAR` before running the script would fix it.

**Answer: D.** A shell variable becomes an environment variable only once exported; from that point every child process the shell forks receives a copy. `echo $MYVAR` sees the un-exported variable in the same shell, but a script forked as a child process does not.

- A is wrong: `env` only prints, or runs a command with, the current environment; it does not export anything itself, and un-exported shell variables never appear in its output.
- B is wrong: PATH governs how bare command names resolve to executables; it has no bearing on whether a variable is inherited by a child process.
- C is wrong: Inheritance is one-directional and copy-based, and only exported variables are copied into a child process's environment at all — this is expected behaviour, not a fault.

### 122.

Someone wants to see every environment variable currently exported in their session, without printing un-exported shell variables mixed in. Which command gives exactly that?

- **A.** `env`, run with no arguments, which prints only exported environment variables.
- **B.** `echo $HOME`, since it prints an environment variable and can simply be repeated for each one.
- **C.** `export MYVAR`, since naming a variable with `export` prints that variable’s exported value back.
- **D.** Any shell variable that has ever been referenced with `$` automatically shows up in `env` output.

**Answer: A.** `env`, run with no arguments, prints the current environment — exported variables only, not un-exported shell variables. `echo` prints a single named value rather than enumerating the environment.

- B is wrong: `echo $HOME` prints one specific variable's value; it does not enumerate the full set of exported variables the way `env` does.
- C is wrong: `export NAME` marks the named variable for export and prints nothing; it is bare `export` or `export -p` that lists exported names, and `env` that prints the environment itself.
- D is wrong: Referencing a variable with `$` only reads its current-shell value; it does not export it, and un-exported variables are absent from `env`'s output regardless of how often they were referenced.

### 123.

An administrator wants live CPU information and runs `cat /proc/cpuinfo` rather than a dedicated tool. What Unix design principle makes that command meaningful?

- **A.** Multi-user isolation, since `/proc/cpuinfo` is scoped separately per logged-in user session, the way a user's own files and settings normally are.
- **B.** The kernel-space/user-space boundary, since crossing it is what makes `cat` able to read kernel data at all, regardless of where that particular data happens to physically live on disk.
- **C.** `/proc/cpuinfo` is a regular text file the kernel writes to disk at boot and never touches again, the same as any other static configuration file.
- **D.** Everything is a file: devices, sockets, and kernel state are exposed through the same filesystem interface used for ordinary files, so `cat` can read them like any other path.

**Answer: D.** The kernel presents devices and interfaces as special file types, alongside pseudo-filesystems like `/proc` and `/sys`, using the same open/read/write/close calls as ordinary files. That is why so many 'how do I check X' answers reduce to reading a path.

- A is wrong: `/proc/cpuinfo` reports machine-wide hardware facts and is not a per-user isolated resource; multi-user isolation is a different design property.
- B is wrong: That boundary explains why a system call is needed at all; it does not explain why the data is reachable at a filesystem path in the first place, which is the file-abstraction principle.
- C is wrong: It is a pseudo-file backed by live kernel state, generated on read rather than stored on disk, which is why it always reflects current information.

### 124.

Which pair of paths best illustrates that devices and ordinary data are reached through the same interface on Linux?

- **A.** `/etc/passwd` and `/etc/shadow`, since both concern user account information specifically and sit in the same configuration directory.
- **B.** `/dev/sda` for a disk device and `/home/user/notes.txt` for a document, both opened, read, and written with the same system calls.
- **C.** `/proc/cpuinfo` and `lscpu`'s output, since both ultimately describe the same CPU information in slightly different formats.
- **D.** Any two paths under `/etc`, since configuration files are the clearest example 'everything is a file' offers to a new user.

**Answer: B.** The principle's force is in unifying access to things that are not intuitively files — a disk device, a socket, live kernel state — with ordinary files, all reached through open/read/write/close. Pairing a device path with a document file shows that unification directly.

- A is wrong: Both are ordinary configuration files; the pairing says nothing about devices being reached through the file interface, which is what the principle is about.
- C is wrong: One is a path and the other is a command's formatted output; comparing them does not illustrate the file-interface principle, only that a tool can read that path.
- D is wrong: Ordinary configuration files were always files; the principle is specifically about non-file things — devices, sockets, kernel state — being exposed the same way, not about configuration.

### 125.

A new peripheral is detected by the kernel and its driver module loads successfully, but the device still does not function correctly. Loading the module again changes nothing. What layer might still be at fault?

- **A.** The kernel module itself, since simply reloading it again with slightly different options would eventually resolve any remaining fault it still has.
- **B.** The device's own firmware, low-level software embedded in the device itself, distinct from and running independently of the operating system.
- **C.** The shell used to run `modprobe`, since different shells are widely believed to load kernel modules differently.
- **D.** Nothing further is possible to fix from the OS side or the device side; a successfully loaded driver means the OS's job here is fully done.

**Answer: B.** Firmware is low-level software embedded in a device, distinct from the operating system above it. A driver operates the device from the OS side; if the device's own embedded software is missing or out of date, no module load fixes it — that is a separate firmware-update process.

- A is wrong: The scenario states the module already loaded successfully and reloading changes nothing; the driver having loaded correctly is what points elsewhere, toward firmware.
- C is wrong: Module loading is a kernel operation performed identically regardless of which shell invoked `modprobe`; the shell is not a plausible fault layer here.
- D is wrong: A loaded driver only means the kernel's side of talking to the device is working; the device's own firmware is a separate layer that can still be at fault.

### 126.

A colleague says their laptop 'runs Linux' and separately that it 'runs GNU/Linux.' Are those two statements necessarily equivalent?

- **A.** Yes — the kernel is the only component that genuinely matters here, so any userland running on top of it counts as GNU regardless of where that userland actually came from or who originally wrote it.
- **B.** No, but only because GNU refers to a licensing status rather than an actual body of software anyone can point to.
- **C.** Yes, since the Linux Foundation requires every certified Linux distribution to ship a GNU userland as a condition of certification.
- **D.** No. 'Linux' names the kernel alone and is always accurate wherever that kernel runs; 'GNU/Linux' names that kernel specifically paired with a GNU userland, which not every Linux system has.

**Answer: D.** Linux, strictly, is the kernel Linus Torvalds began in 1991. Most Linux userlands trace to the GNU Project, which is why the pairing is sometimes called GNU/Linux — but not every Linux system has a GNU userland, so the two phrases are not interchangeable.

- A is wrong: The kernel is one component; the userland running above it is a separate choice, and Android's Bionic userland shows it need not be GNU at all.
- B is wrong: GNU names a concrete body of software — the compiler, shell, and core utilities from the GNU Project — not merely a license category.
- C is wrong: No such requirement exists, and the Linux Foundation does not control userland composition; GNU/Linux describes an actual pairing that some systems, like Android, do not have.

### 127.

What did the GNU Project supply before the Linux kernel existed, and what was it still missing?

- **A.** A complete operating system including its own kernel, which Linux later replaced for better overall performance.
- **B.** A package manager and release policy, which every GNU/Linux distribution still relies on today for updates.
- **C.** A compiler, a shell, core utilities, and most of the GPL licensing framework — everything except a free kernel of its own, which Linux later filled.
- **D.** Nothing substantial — GNU contributed little more than a name before Linux ever arrived, with essentially no working software behind it at that point.

**Answer: C.** GNU, begun in 1983, supplied the compiler, shell, core utilities, and most of the license framework years before Linux existed in 1991. It lacked only a free kernel, which the Linux project filled — hence GNU/Linux for the combination.

- A is wrong: GNU had no working free kernel at that point — it had started one, the GNU Hurd, but that kernel did not run reliably until 2001 — so Linux filled a gap rather than replacing a functioning GNU kernel.
- B is wrong: Package managers and release policies are distribution-level decisions, not something the GNU Project itself supplied historically.
- D is wrong: GNU supplied the compiler (GCC), the shell, core utilities, and the GPL years before Linux existed, which is why the pairing became so natural once a kernel was available.

### 128.

A team debates whether a new internal tool, running exclusively on headless cloud servers and administered over SSH, needs a GUI. What is the strongest justification for defaulting to CLI here?

- **A.** No display server or desktop environment needs to run, saving memory and CPU the server has no other use for, and CLI output can be piped and scripted for automation.
- **B.** The shell itself cannot run a GUI application under any circumstances, so CLI is therefore claimed to be the only option technically available on the machine in this situation at all.
- **C.** A headless server has no terminal available, so CLI administration is not actually possible on it either, in that case.
- **D.** Servers can never run a GUI at all, regardless of configuration, which settles the debate outright either way immediately.

**Answer: A.** A CLI session needs only a shell and a terminal or SSH connection — no display server or desktop environment, which would otherwise consume memory and CPU the server has no other use for. CLI is also scriptable and remotable in ways a GUI is not.

- B is wrong: GUI versus CLI names the interface paradigm as a whole; the shell is a specific CLI-side program and its existence does not by itself rule out a GUI running elsewhere on the machine.
- C is wrong: A CLI session needs only a shell and a terminal, or an SSH connection carrying one — no display server required, which is exactly why CLI works on a headless machine.
- D is wrong: A GUI can run on a server if a display server and desktop stack are installed; the real justification is cost and scriptability, not technical impossibility.

### 129.

Are 'GUI vs CLI' and 'shell vs terminal' the same distinction asked two different ways?

- **A.** No. GUI vs CLI names the interface paradigm as a whole, graphical or text-based; shell and terminal are both specifically components on the CLI side of that split.
- **B.** Yes — a shell is simply treated as the CLI equivalent of a GUI, so comparing shell to terminal is really the same comparison stated again in different words entirely.
- **C.** No, but only because GUIs never involve a terminal of any kind whatsoever, under any circumstances.
- **D.** Yes, since both comparisons ultimately ask whether the interface requires its own dedicated display server to run.

**Answer: A.** GUI vs CLI names the interface paradigm as a whole. Shell and terminal are both specifically CLI-side components — one interprets, the other displays — so the two comparisons operate at different levels, not as restatements of each other.

- B is wrong: A shell interprets commands; a terminal displays them — both are CLI-side components, neither of which is 'the GUI equivalent' of the other.
- C is wrong: A terminal is specifically a CLI-side component; its absence from GUI administration is consistent with the level distinction, but is not itself the reason the two comparisons differ.
- D is wrong: Shell vs terminal has nothing to do with a display server; that question only arises on the GUI side of the broader GUI-vs-CLI split.

### 130.

A process is run with `sudo` and therefore executes as root. Does that process now run in kernel space?

- **A.** Root is a user-space account privilege, so no; the process still runs in the CPU's restricted execution mode and must still cross a system call to reach the kernel.
- **B.** Yes — root has no permission checks applied to it, and having no permission checks is exactly what kernel space means, since nothing is left to restrict what it can touch.
- **C.** Yes — running as root places the process in the kernel's own address space, so it can reach kernel memory directly without going through a system call.
- **D.** It depends on the distribution, since some distributions grant root direct kernel-mode execution by default configuration, unlike the more restrictive ones that do not.

**Answer: A.** Kernel space and user space name a CPU-enforced privilege boundary, not a Unix permission level. A root process still runs in user space; it simply has fewer permission checks applied to it there. Only a system call crosses into kernel space, and even then it is the kernel executing, not the calling process itself.

- B is wrong: Fewer permission checks are not the same as a different CPU privilege ring; kernel space names that ring, which root does not enter merely by holding elevated rights.
- C is wrong: Every user-space process, root included, runs in its own address space with kernel memory unreachable from it; that is why even a root process must issue a system call to have the kernel act on its behalf.
- D is wrong: This is a CPU-level distinction with no distribution-specific variation; no mainstream Linux distribution grants a user-space process direct kernel-mode execution.

### 131.

A process attempts to read another process's memory directly, without going through any kernel-provided interface. What stops it, and at what level?

- **A.** The kernel's file permission checks, which reject the read once the attempted access is evaluated against them, the same way any ordinary file read would be checked.
- **B.** The kernel process itself, which notices the read and terminates the offending process the way a device driver would when it detects unauthorised hardware access.
- **C.** Nothing at the hardware level — this is purely a software convention that a sufficiently privileged process can simply bypass by asking the kernel nicely enough.
- **D.** The CPU itself: ordinary processes run in a restricted privilege ring that cannot address arbitrary memory, so the attempt fails at the hardware level before any software policy is even consulted.

**Answer: D.** The CPU provides hardware privilege levels; ordinary processes run in a restricted one and cannot execute privileged instructions or touch arbitrary memory directly. A process must ask the kernel through a system call, and the CPU — not a software policy alone — enforces that boundary.

- A is wrong: File permissions govern access to filesystem paths; reading another process's memory directly is not a file operation and is blocked before any such check applies.
- B is wrong: This is not a driver-level enforcement mechanism; it is the CPU's privilege-ring architecture that makes the memory unreachable in the first place.
- C is wrong: The guide is explicit that CPU privilege rings enforce this, not software convention alone; that is what makes the boundary meaningful rather than advisory.

### 132.

Which single component is directly responsible for scheduling processes onto the CPU, managing memory, and enforcing the permission boundary between them?

- **A.** The kernel, being the privileged core that performs scheduling, memory management, and permission enforcement itself, with everything else built above it.
- **B.** The operating system in general, since 'kernel' is simply informal shorthand people use for the same broader system, the way 'Windows' and 'PC' get used interchangeably.
- **C.** The distribution's init system, since it is the first process started and therefore owns the machine's resources from that point on, ahead of anything the kernel itself does.
- **D.** Whichever shell the administrator is currently using, since shell commands are what visibly control processes on the machine and appear to issue every instruction directly.

**Answer: A.** The kernel schedules the CPU across processes, manages memory, drives devices, and enforces the permission model. Every other concept in this competency ultimately routes through it, which is why 'what actually does X' questions resolve to the kernel even when the wording says 'Linux' or 'the OS.'

- B is wrong: The operating system is the broader layer the kernel belongs to; the kernel is its privileged core, not an interchangeable label for it.
- C is wrong: An init system is an ordinary userspace process the kernel starts and schedules like any other; it does not itself perform scheduling or memory management.
- D is wrong: A shell only requests process control through system calls; the kernel is what actually performs the scheduling and enforcement behind that request.

### 133.

An administrator needs the exact release string of the running kernel — the number that would let them check whether a specific driver bug fixed upstream is present on this machine. Which command reports it?

- **A.** `uname -a`, which prints every available field including the kernel release among several others.
- **B.** `cat /etc/os-release`, which reports the running system's version.
- **C.** `lsmod`, which lists what is currently loaded into the running kernel.
- **D.** `uname -r`, which prints the kernel release specifically.

**Answer: D.** `uname -r` prints only the kernel's own release string. `uname -a` also includes it but mixed with unrelated fields, and `cat /etc/os-release` answers a different question entirely — distribution identity, not kernel version.

- A is wrong: It contains the release string but buries it among hostname, architecture, and build-date fields the task did not ask for; `-r` isolates the one field needed.
- B is wrong: That file reports distribution identity, not kernel version; assuming it reports the kernel is the exact mistake the guide's own trap describes.
- C is wrong: `lsmod` shows loaded modules, not a version string, and would not answer a question about which kernel release is running.

### 134.

A script needs to identify which distribution it is running on before choosing between `apt` and `dnf`. Which command reads the machine-readable identity file for that purpose?

- **A.** `uname -r`, which reports the running kernel version so the script can infer the distribution from that number.
- **B.** `cat /etc/os-release`, which prints the standard distribution identity file every installed system carries.
- **C.** `uname -a`, which prints a full summary line ending with the operating system name.
- **D.** `lsblk`, which lists the disks the distribution's files happen to be installed on.

**Answer: B.** `/etc/os-release` is the standard, machine-readable file carrying a distribution's identity. `uname -r` answers a different question — kernel version — which the guide's own trap warns against confusing with distribution identity.

- A is wrong: `uname -r` reports only the kernel release; the kernel version does not by itself identify which distribution is installed.
- C is wrong: It can include an OS name field on some builds, but it does not report the distribution's specific identity the way `/etc/os-release` does.
- D is wrong: Block device listings say nothing about which distribution is installed; they describe storage, not software identity.

### 135.

'Which distribution is this' and 'which distribution family is this' are asked about the same server. Do they expect the same answer?

- **A.** Yes — a kernel version determines both the distribution and its family identically, since the exact same kernel build is assumed to ship inside every distribution that uses it at all.
- **B.** No, but only because Arch has no family at all, unlike every other Linux distribution currently in wide use today.
- **C.** No, since the distribution names one specific installable system (for example Ubuntu 24.04), while the family names the packaging lineage it shares with others (the Debian family).
- **D.** No real distinction exists; 'distribution' and 'family' are used interchangeably even in careful technical writing about Linux systems.

**Answer: C.** A distribution is one specific product a person installs. A family is the packaging lineage several distributions share. RHEL and Fedora being 'different distributions in the same family' only makes sense once that distinction is held separately.

- A is wrong: Kernel version identifies neither a distribution nor its family on its own; the kernel is one component shared across an entire family.
- B is wrong: Arch does belong to a family — its own, built around `pacman` and a rolling model — so this is not the reason the two questions diverge.
- D is wrong: The exam tests this precisely because they are not interchangeable — RHEL and Fedora are different distributions in the same family, which only makes sense if the terms differ.

### 136.

Who sets the Linux kernel's technical direction, and what role does the Linux Foundation actually play in that?

- **A.** The Linux Foundation sets technical direction, since its name appears on the certification program and it directly employs a large number of the kernel's most active and visible contributors working on it today.
- **B.** Torvalds and the kernel's maintainer hierarchy set technical direction; the Linux Foundation supplies the technical, financial and staffing support behind the project's infrastructure, an organisational role rather than a technical one.
- **C.** Torvalds alone personally decides every single patch that merges, without any maintainer hierarchy standing beneath him at any level of the project.
- **D.** A vote among major distribution vendors decides technical direction, coordinated entirely through the Foundation's regular meetings.

**Answer: B.** Kernel development runs through a maintainer hierarchy escalating to Torvalds. The Linux Foundation provides infrastructure, funding, and trademark stewardship — sponsorship and hosting, not technical governance.

- A is wrong: Employing contributors and lending its name to a certification are sponsorship activities; the Foundation does not decide which patches merge or set the kernel's direction.
- C is wrong: Subsystem maintainers review and merge the vast majority of patches, escalating disputed changes upward; Torvalds is the top of a hierarchy, not the sole reviewer.
- D is wrong: The Foundation provides neutral ground for vendors to collaborate, but kernel technical decisions run through the maintainer hierarchy, not a vendor vote.

### 137.

In what year, and in what capacity, did Linus Torvalds begin the Linux kernel?

- **A.** 1991, as an official Linux Foundation project from its founding.
- **B.** 1983, as part of the GNU Project's effort to build a complete free Unix-like system.
- **C.** The exact year is disputed, since the kernel's development predates any reliable public record.
- **D.** 1991, as a free Unix-like kernel he then developed openly with a growing contributor base.

**Answer: D.** Torvalds began the Linux kernel in 1991 as a free Unix-like kernel, developing it openly with a large contributor base ever since — years before the Linux Foundation existed to sponsor it.

- A is wrong: In 1991 the kernel was Torvalds's own project, released under his personal copyright notice; the Linux Foundation came later and took a sponsoring role once the project was already established.
- B is wrong: 1983 belongs to the GNU Project's beginnings, not to Linux; GNU had assembled the whole system apart from a kernel by the early 90s, and that is the gap Linux filled.
- C is wrong: 1991 is well documented and not in dispute; the kernel's early history is one of the better-recorded parts of its story.

### 138.

A production database server must not have package behaviour shift unexpectedly underneath a running service. Which release policy fits that requirement, and why?

- **A.** An LTS release, because its package versions stay frozen after release and only security-relevant patches are backported into those same versions.
- **B.** A rolling release, because it always runs the newest software and therefore carries the fewest known bugs at any given time.
- **C.** Whichever release the distribution family recommends, since family and release policy amount to one single decision.
- **D.** Rolling releases also freeze versions, they just do it more frequently, so either policy satisfies the requirement equally well over a long enough window.

**Answer: A.** LTS releases freeze a version and backport only security and bug fixes for a fixed window; rolling releases ship every update continuously with no freeze at all. For a production system where shifting behaviour is the bigger risk, LTS is the safer choice.

- B is wrong: Newest is not safest for a running service — rolling releases update continuously, which is exactly the shifting behaviour the requirement rules out.
- C is wrong: Release policy is a separate axis from family; Ubuntu, in the Debian family, still offers both an LTS and a non-LTS track.
- D is wrong: A rolling release has no freeze at all — updates flow continuously with no single version to point to — which is the opposite of what the requirement asks for.

### 139.

What is the practical cost a team accepts by choosing a rolling release over an LTS release?

- **A.** A shorter support window before the distribution stops receiving any updates whatsoever, forcing a much earlier reinstall than an LTS user would ever expect.
- **B.** A different package manager than the one the distribution family would normally use for its releases.
- **C.** More frequent, active maintenance; updates arrive continuously, and the team must absorb behaviour changes as they land rather than on a scheduled cadence.
- **D.** None — rolling releases are strictly an improvement on LTS with no offsetting cost at all worth mentioning.

**Answer: C.** Rolling releases ship continuously with no version to freeze, trading stability for currency. That currency has to be actively managed, which is the real cost against an LTS track that changes only on a scheduled, security-focused basis.

- A is wrong: Support windows and end-of-life dates are an LTS-track concept; a rolling release has no comparable fixed support window to fall short of.
- B is wrong: Release policy does not change which package manager a distribution uses; Arch's `pacman` is tied to the distribution, not to being a rolling release.
- D is wrong: The guide frames this explicitly as a trade-off, not a strict improvement: currency is gained at the cost of stability and maintenance burden.

### 140.

Two different users are logged into the same server at once, each running a process with the identical program name. Why does this not cause a conflict?

- **A.** The shell renames one of the two processes automatically to avoid any naming collision between them at the operating-system level.
- **B.** The kernel schedules and owns each process separately, keeping their memory and permissions apart regardless of which program name either one happens to share.
- **C.** Each user is confined to a separate kernel running in its own lightweight container on the host, fully isolated from every other logged-in user's kernel instance.
- **D.** Only one of the two processes can actually be running at a time; the OS silently queues the second behind it until the first one exits.

**Answer: B.** Linux is designed to run many users and many processes concurrently, each isolated from the others by the kernel. Process ownership and permission checks are what let identically named processes coexist safely, whoever launched them.

- A is wrong: Shells do not rename running processes to avoid collisions; process identity is tracked by process ID, not by program name uniqueness.
- C is wrong: Standard multi-user Linux runs one kernel shared by all logged-in users; per-user kernel isolation is not what makes this scenario safe.
- D is wrong: Both processes genuinely run concurrently, time-sliced across the CPU; neither is silently queued behind the other.

### 141.

A user sends a termination signal intending to stop their own runaway process, but a colleague's identically-named process is also running on the shared server. What design guarantees the signal reaches only the intended process?

- **A.** The shell resolves the signal target by matching PATH first, so it always finds the sender's own binary to signal instead of anyone else's.
- **B.** The multi-user, multitasking design: process ownership and permission checks mean a signal from one user cannot reach another user's process by default, regardless of shared program names.
- **C.** Signals are addressed to a program name rather than a process ID, so ownership never enters into it at any point in the delivery process.
- **D.** Nothing guarantees this; two identically named processes running under different users on the same shared server are a known race condition that occasionally kills the wrong one without warning.

**Answer: B.** Every permission model in this domain rests on the assumption that many users and processes run concurrently, isolated by the kernel. Process ownership — not the program's name — is what a signal's permission check is actually evaluated against.

- A is wrong: PATH resolves command names to executables when launching a program; it plays no role in routing a signal to an already-running process.
- C is wrong: Signals target a specific process ID, and the kernel's ownership check on that ID — not the program's name — is what prevents cross-user interference.
- D is wrong: This is exactly the assumption the multi-user design is built to prevent: ownership and permission checks, not naming, determine which process a signal can reach.

### 142.

Under exactly which license terms is the Linux kernel released?

- **A.** GPLv2 only — not 'GPLv2 or later' — which is why the exact clause is worth holding separately from other GPL-licensed software.
- **B.** MIT, chosen specifically to make commercial redistribution far simpler for vendors than the copyleft terms of the GPL would otherwise allow.
- **C.** GPLv2 or later, matching the clause used by most other GNU Project software packages and tools.
- **D.** Whatever license the distribution packaging it chooses to apply on top of it during packaging.

**Answer: A.** The kernel is released under GPLv2 only, not the more common 'GPLv2 or later' clause. This is why distributions may copy, modify, and redistribute it, provided redistributions stay under that same license.

- B is wrong: The kernel is not MIT-licensed; MIT is a permissive license and does not carry the GPL's copyleft requirement the kernel actually operates under.
- C is wrong: The kernel deliberately uses GPLv2 only, not the 'or later' clause common elsewhere in GNU software — this is the specific fact the concept tests.
- D is wrong: A distribution cannot override the kernel's own license; userland tools bundled alongside it may carry different licenses individually, but the kernel itself stays GPLv2.

### 143.

A company wants to redistribute a modified version of the Linux kernel as part of a commercial appliance. What does GPLv2 require of them?

- **A.** Nothing — GPLv2 permits silent commercial redistribution with no source obligation attached whatsoever, unlike stricter copyleft licenses.
- **B.** They must switch the derivative to a permissive license before selling it, since GPLv2 forbids commercial use outright by design.
- **C.** The redistributed derivative must also be licensed under GPLv2, and the corresponding source code must be made available to recipients.
- **D.** They must contribute the change back to the upstream kernel project before shipping the appliance at all.

**Answer: C.** GPLv2 is copyleft: anyone may run, study, modify, and redistribute the code, but a redistributed derivative must also be licensed under GPLv2 with source made available to recipients. Commercial use is permitted; the obligation is about license and source, not about selling.

- A is wrong: GPLv2 is copyleft precisely because it does impose a source-availability obligation on redistribution, unlike a permissive license that would not.
- B is wrong: GPLv2 explicitly permits commercial redistribution; it does not forbid selling the software, it only requires the derivative to remain under GPLv2 with source available.
- D is wrong: GPLv2 requires making source available to recipients of the redistribution; it does not require contributing changes back to any upstream project.

### 144.

An exam option must be assigned to either 'the kernel' or 'the operating system': providing the full set of interfaces — system calls, plus the libraries and services built on top of them — that lets an application avoid addressing hardware directly. Which is the more precise assignment?

- **A.** The kernel, because it is the component that actually schedules the CPU and enforces permissions, so it must also be the source of every interface an application calls.
- **B.** The distribution, because its package manager installed the libraries the application links against, and whichever component installs a piece of software becomes the layer that interface belongs to.
- **C.** The operating system, because it is the kernel plus the userspace services and libraries built on it, and that whole layer is what supplies the complete set of interfaces.
- **D.** Neither term applies cleanly, since applications on Linux address hardware directly once a device file has been opened, with the device file itself standing in for any further mediating software layer.

**Answer: C.** The operating system is the full software layer — kernel plus userspace services and libraries — that intercepts every request an application makes so it need not address hardware directly. The kernel is that layer's most privileged component, not a synonym for the whole of it; treating the two as interchangeable is the exact trap this pairing is built to test.

- A is wrong: The kernel performs the privileged work behind a system call, but libraries and services built above it — part of the OS, not the kernel — supply most of what an application actually calls.
- B is wrong: Installing a library is a packaging concern; it does not make the distribution the layer that mediates hardware access at runtime.
- D is wrong: Opening a device file still goes through kernel-mediated system calls; a program never gains direct hardware access merely by holding an open file descriptor.

### 145.

A text editor writes a saved file to disk without containing any code specific to the make or model of the installed disk controller. What makes that possible?

- **A.** The everything-is-a-file principle, which lets the editor open the controller's device path directly instead of going through any intermediary layer, since a file path is already a direct handle.
- **B.** A driver written specifically for that exact controller model was compiled into every Linux kernel in advance, so the editor links against that driver's interface directly rather than a general one.
- **C.** Modern disk controllers expose a single standardised interface, so no operating-system abstraction is actually needed to write to one, since the hardware itself already presents a uniform API.
- **D.** The operating system mediates the request: the editor calls a general save interface, and the layer beneath translates that into the specific low-level operations the installed controller requires.

**Answer: D.** Applications never touch hardware directly. They call OS-provided interfaces, and the OS — kernel plus the services above it — translates that call into whatever the specific installed hardware needs. That indirection is the entire point of the layer.

- A is wrong: Everything-is-a-file explains how devices are reached through the filesystem namespace; it does not remove the mediating layer the request still passes through.
- B is wrong: Drivers are controller-specific, but the editor never talks to one directly; it calls a general interface that the OS routes onward.
- C is wrong: Controllers still vary enough that a driver is required underneath; the standardisation happens at the OS's interface layer, not by eliminating the need for one.

### 146.

A program was just installed to `/opt/tool/bin/tool`, but typing `tool` reports 'command not found' even though the file exists and is executable. What is the most likely cause, and what confirms it?

- **A.** The file must actually be corrupted, since `which tool` reporting nothing found always means the binary itself is broken somehow.
- **B.** The shell needs to be restarted entirely, since PATH is believed to be fixed permanently at login time and never re-read afterward at all, under any circumstances whatsoever.
- **C.** `/opt/tool/bin` is missing from PATH; `echo $PATH` would show the directory absent, and PATH is searched left to right for the first match on a bare command name.
- **D.** PATH is searched right to left, so a later directory's match should have been found first regardless of the order it was listed in.

**Answer: C.** 'Command not found' for a genuinely installed program is almost always a PATH problem: the installing directory is missing from PATH. `echo $PATH` confirms it, and PATH is searched left to right for the first match.

- A is wrong: `which` reports nothing found when a directory is missing from PATH just as readily as when a file is broken; PATH is the far more common cause and should be checked first.
- B is wrong: PATH can be updated within a running shell session by exporting a new value; a restart is not required to fix a PATH omission, only re-exporting or reloading the relevant config.
- D is wrong: PATH is searched left to right, with the first match winning; this scenario is about a directory being absent entirely, and the search order itself would not rescue a missing entry.

### 147.

`which mycmd` reports nothing found, but typing `mycmd` at the prompt runs successfully. Which command would reveal what `mycmd` actually is, including cases `which` cannot see?

- **A.** `which -a mycmd`, since adding `-a` extends `which` to also search shell builtins and aliases directly.
- **B.** `echo $PATH`, since reading the full search list would reveal exactly where `mycmd` is hiding on disk.
- **C.** `type mycmd`, which reports how a name would be interpreted — builtin, alias, function, or file — seeing categories the external `which` cannot.
- **D.** Nothing else needs checking here — `which` finding nothing means `mycmd` does not actually exist as any kind of runnable command at all, in any form.

**Answer: C.** `which` only searches PATH for external executables and has no visibility into shell builtins or aliases. `type` reports more generally what a name resolves to — builtin, alias, function, or file — which is why it succeeds where `which` reports nothing found.

- A is wrong: `-a` only lists every PATH match for an external command; it does not extend `which`'s visibility to builtins or aliases, which stay outside its scope entirely.
- B is wrong: If `mycmd` is a builtin or alias, it has no file on PATH at all to be found by reading the list; PATH inspection would not resolve this case.
- D is wrong: The command visibly ran, so it exists in some form; `which` finding nothing only means it is not an external file on PATH, which `type` can still identify.

### 148.

`free -h` shows a small 'free' figure and a large 'used' figure on a server that feels fine. Which column should actually be trusted to judge whether the system is memory-constrained?

- **A.** 'available', which estimates what a new process could actually get, correctly accounting for reclaimable cache that the raw 'free' column does not credit back.
- **B.** 'free', since it is treated as a persistent block device figure and therefore the single most reliable measure of headroom available anywhere on the running system.
- **C.** 'used', since a large 'used' figure always means the system is close to the OOM killer no matter the surrounding context.
- **D.** None of the columns matter; only `uptime`'s load average actually determines memory pressure on a running system.

**Answer: A.** The kernel uses otherwise-idle RAM as disk cache, so the raw 'free' column looks low even when memory is not actually constrained. `free`'s 'available' column is the one that estimates real headroom for a new process.

- B is wrong: 'free' is a RAM figure, not a storage-device one, and it is exactly the column the guide warns against trusting for pressure judgements.
- C is wrong: `free` calculates `used` as total minus available, so it does already exclude reclaimable memory, but a large `used` value on its own does not establish that the system is near an OOM kill.
- D is wrong: Load average measures CPU contention, not memory state; `free`'s own columns are what is needed to judge memory pressure specifically.

### 149.

A process's memory usage keeps climbing until it is abruptly terminated with no warning in its own logs. What kernel mechanism most likely explains the termination?

- **A.** The out-of-memory (OOM) killer, invoked under severe memory pressure to reclaim RAM by terminating a process.
- **B.** Swap exhaustion causing the storage device holding the swap file to fail outright.
- **C.** The scheduler deprioritising the process until it starves of CPU time entirely.
- **D.** Processes on Linux are never terminated by the OS itself; this must have been an explicit `kill` from another user.

**Answer: A.** When RAM is exhausted, the kernel either swaps pages to disk, slowing sharply, or under severe pressure invokes the OOM killer to terminate a process and reclaim memory — which explains an abrupt termination with no corresponding application-level warning.

- B is wrong: Swap running low slows the system by paging heavily; it does not itself terminate a process the way the OOM killer does.
- C is wrong: Starving for CPU time causes slowness, not termination; only the OOM killer actually ends a process to reclaim memory.
- D is wrong: The OOM killer is a real, kernel-initiated termination mechanism specifically for reclaiming memory under pressure, distinct from any user-issued signal.

### 150.

A user wants to confirm, from inside their current session, which program is configured as their login shell. Which command reports it?

- **A.** `echo $SHELL`, which prints the shell variable holding the user's configured login shell.
- **B.** `echo $PATH`, which lists the shell's search directories including the one holding the shell binary.
- **C.** `lsblk`, which lists the block devices the shell's history file is stored on.
- **D.** `echo $0`, which prints the name of the shell program the user is talking to at this prompt.

**Answer: A.** `echo $SHELL` prints the configured login shell. It is worth knowing this can diverge from the shell actually executing a given command, since `$SHELL` is not updated when a different shell is launched interactively.

- B is wrong: PATH lists directories to search for commands; it does not itself name which program is the user's configured shell.
- C is wrong: Block devices are unrelated to which interpreter is configured as a login shell.
- D is wrong: `$0` names the shell that is currently running, which need not be the login shell configured for the account — bash(1) defines SHELL as "the full pathname of the current user's login shell", which is what the question asks for.

### 151.

Running `which cd` reports nothing found, yet typing `cd /tmp` at the same prompt works without error. What explains the mismatch?

- **A.** The terminal is caching the previous command's output and never actually ran `which cd` at all, which is why nothing new appeared on screen.
- **B.** `cd` is a shell builtin with no standalone binary on PATH, so the external `which`, searching only PATH, finds nothing, even though the shell itself executes it directly.
- **C.** PATH is misconfigured and missing the directory that would normally contain the `cd` executable, since every runnable command needs a directory entry somewhere on that list.
- **D.** `which` is broken on this system, since it should be able to find every command that actually runs successfully, builtin or not.

**Answer: B.** Some commands, `cd` among them, are shell builtins with no standalone binary on a Linux system. The external `which` only searches PATH, so it correctly reports nothing found for a builtin even though the shell itself runs it directly.

- A is wrong: The terminal only renders input and output; it does not cache or intercept command execution, so this does not explain the result.
- C is wrong: No directory ever contains a `cd` binary on a standard system, because `cd` is a builtin rather than an installed executable; PATH is not the issue.
- D is wrong: `which` is working as designed; it deliberately only searches PATH for external executables and has no visibility into shell builtins by design.

### 152.

`lsblk` output shows `sda` as a parent row with `sda1` and `sda2` indented beneath it. Treating `sda1` as if it were the entire disk, what mistake follows?

- **A.** Assuming the stored data will be permanently lost on the next reboot, since only volatile RAM contents are ever known to reset in that particular way.
- **B.** Believing the filesystem type is always ext4 unless `-f` is explicitly passed as a flag to `lsblk`.
- **C.** Acting on the wrong device; `sda1` is one partition of the whole disk `sda`, and operations meant for the full disk would then target only part of it.
- **D.** No real mistake follows, since `sda` and `sda1` always hold exactly identical data at every point in time.

**Answer: C.** `lsblk` presents whole disks as parents and partitions as children in its hierarchy. Treating a partition row like `sda1` as the whole disk `sda` means acting on the wrong device — a common, testable misreading.

- A is wrong: Reboot data loss is a property of volatile RAM, not of a storage partition; `sda1` persists across reboots like any other block device.
- B is wrong: `-f` reveals filesystem type and UUID, which are absent from the default columns, but that omission is a different mistake than confusing a partition with its parent disk.
- D is wrong: A partition and its parent disk are not identical; the parent spans the whole device while a partition is one region of it, so operations differ in scope.

### 153.

A monitoring dashboard shows both 'RAM usage' and 'disk usage' climbing together and a teammate assumes they must be the same underlying resource. What single property actually separates them?

- **A.** Volatility and access pattern: RAM is volatile and byte-addressable, cleared on power loss; storage devices are persistent and block-addressable through a filesystem and driver.
- **B.** Nothing meaningfully separates the two — both simply hold data the system needs, so 'usage' means exactly the same thing for either one regardless of context or how it is measured.
- **C.** RAM is managed by the kernel while storage devices are managed entirely by user-space drivers instead of the kernel.
- **D.** Storage devices are addressed through system calls while RAM is addressed without any kernel involvement at all in the process.

**Answer: A.** RAM is volatile and byte-addressable, directly by the CPU; storage devices are persistent and block-addressable through a filesystem and driver. Exhausting one causes swapping or an OOM kill; exhausting the other causes write failures — different failure modes following from that one axis.

- B is wrong: RAM and storage differ sharply in what exhausting them causes — swapping or the OOM killer for RAM, write failures for storage — so treating 'usage' as identical loses that distinction.
- C is wrong: Both RAM allocation and storage device access are kernel-managed; the distinction is not about which layer manages them.
- D is wrong: RAM access by a process is also mediated by the kernel's memory management; the difference is volatility and addressing granularity, not kernel involvement.

### 154.

What distinguishes a system call from an ordinary library function call?

- **A.** A system call is the controlled entry point that crosses from user space into the kernel to request privileged work; a library call does not cross that boundary.
- **B.** A system call always runs faster, because it bypasses the shell's own command-interpretation overhead entirely and talks straight to the running program.
- **C.** A system call is written in a different programming language than an ordinary library function is, which is why the two behave so differently at runtime.
- **D.** There is no real distinction; both terms simply describe the same underlying mechanism under different names chosen for historical, not technical, reasons.

**Answer: A.** A system call is the controlled entry point by which a userspace program asks the kernel to do privileged work, such as opening a file. A library call that stays in userspace never crosses that boundary at all.

- B is wrong: Speed is not the distinguishing property, and system calls are not defined by any relationship to the shell.
- C is wrong: Language choice is an implementation detail; the boundary crossed is what defines a system call, not the language it happens to be written in.
- D is wrong: They are not interchangeable: only a system call crosses into the kernel-privileged context, which is exactly the property the term names.

### 155.

A teammate needs three separate facts about a server: its kernel release and hardware name in one line, its distribution identity, and how long it has been running. Which three commands supply those, respectively?

- **A.** `cat /etc/os-release` alone is assumed to answer all three, since it is believed to also report kernel version and uptime as part of that very same file.
- **B.** `hostnamectl` alone answers all three, since it exists on every Linux system and reports everything at once for free, always.
- **C.** `uname -a` reports the distribution name directly, making a separate distribution check entirely unnecessary in every case.
- **D.** `uname -a` for kernel and hardware facts, `cat /etc/os-release` for distribution identity, and `uptime` for time since boot and load averages.

**Answer: D.** `uname -a` reports kernel name, hostname, kernel release, version, and machine hardware name together. `cat /etc/os-release` reports distribution identity specifically. `uptime` reports time since boot plus load averages — three commands for three distinct facts.

- A is wrong: That file reports distribution identity only; it does not include kernel version or uptime, which come from `uname` and `uptime` respectively.
- B is wrong: `hostnamectl` is systemd-specific and absent on non-systemd distributions, and it does not report uptime or load averages, which `uptime` provides separately.
- C is wrong: `uname -a` reports kernel and hardware facts; it does not reliably report the distribution's name and release, which is what `/etc/os-release` is specifically for.

### 156.

`uptime` reports a load average of 4.0 on one server and 4.0 on another. Are both servers under equal relative load?

- **A.** Yes — a load average of 4.0 is assumed to always mean the same relative load, since the figure is believed to be normalised by the kernel itself before it is ever reported back to a user at all, on any machine.
- **B.** Yes, since `hostnamectl` reports load averages in a normalised, comparable form across every different machine it runs on.
- **C.** Not necessarily — load average is not normalised for CPU count, so 4.0 is a quarter of capacity on a 16-core machine and twice capacity on a 2-core one; `nproc`'s answer is needed to judge either figure.
- **D.** Not necessarily, but only because the two servers are certainly running different kernel versions of Linux entirely.

**Answer: C.** Load average is relative to the machine, not an absolute threshold — a load of 4 is a quarter of capacity on a 16-core machine and twice capacity on a 2-core one. `uptime`'s numbers mean nothing without also knowing `nproc`'s answer.

- A is wrong: `uptime` does not normalise for core count; the raw figure is relative to the machine, which is exactly why two identical numbers can mean very different things.
- B is wrong: `hostnamectl` reports hostname, OS, kernel, and architecture; it does not report load averages at all, normalised or otherwise.
- D is wrong: Kernel version has no bearing on how load average should be interpreted; the relevant missing fact is core count, not kernel release.

### 157.

A user reports 'my terminal is frozen.' A foreground command is actually hung waiting on network I/O, and the terminal emulator itself is rendering fine. Was the report accurate?

- **A.** Yes — 'terminal' and 'shell' name the same thing, so a hung shell command is by definition the terminal itself freezing, with no meaningful difference between the two at all.
- **B.** No — the report describes a kernel scheduling failure, since only the kernel can cause a process to stop responding at all, regardless of what it is waiting on.
- **C.** Yes — any unresponsive prompt is, by definition, a frozen terminal no matter what is actually blocking it, since the symptom looks identical either way.
- **D.** No; the terminal is displaying correctly. It is the shell's foreground command that is hung, which needs a signal (Ctrl-C) rather than restarting the terminal emulator.

**Answer: D.** The terminal manages display and input; the shell interprets commands. A command hung on I/O is a shell-side condition needing a signal to the process, not a terminal-emulator restart — even though users describe both situations as 'the terminal froze.'

- A is wrong: The terminal displays; the shell interprets and forks commands. They are routinely conflated in speech, but they are different programs with different fixes.
- B is wrong: Waiting on network I/O is ordinary blocking behaviour, not a kernel scheduling failure; nothing here implicates the kernel itself.
- C is wrong: Treating every unresponsive prompt as a terminal problem is exactly the looseness the exam exploits; the description here points at the shell's foreground command, not the display program.

### 158.

An SSH session into a remote server presents a working command prompt. What role is the SSH session filling in this picture?

- **A.** It is acting as the terminal, carrying keyboard input to the remote shell and rendering the shell's output back, without interpreting any of the commands itself.
- **B.** It is acting as the shell, since it is what the user directly interacts with to type and run commands, exactly the role a local shell prompt would otherwise play.
- **C.** It is acting as the kernel, since it manages the network connection that carries the session's data all the way from the client to the server.
- **D.** It is acting as a pseudo-terminal device, which is a kernel object rather than anything the SSH client itself supplies over the connection.

**Answer: A.** The terminal, historically a physical device, is today usually a terminal emulator window or a remote session over SSH. It manages display and input and hands typed input to whatever program it launched — usually a shell — over a pseudo-terminal device.

- B is wrong: Direct interaction does not make it the interpreter; the remote shell running on the server does the interpreting, the SSH session only carries the input and output.
- C is wrong: Network connection handling is a kernel-level detail on both ends, but that does not make the SSH session itself a kernel component.
- D is wrong: A pty is the kernel-side channel the terminal and shell communicate over; the SSH session itself is the terminal program using that channel, not the channel itself.

### 159.

A shell script written and tested on Linux mostly works unmodified on another Unix-like system. What property of Linux explains that portability?

- **A.** The GPLv2 license under which the kernel is released is what guarantees behavioural compatibility across every Unix-like system.
- **B.** Every Unix-like system runs the same underlying kernel, so scripts naturally behave identically everywhere.
- **C.** Shell scripts are portable by nature and would run the same on any operating system regardless of any standard at all.
- **D.** Linux is Unix-like and largely POSIX-conformant, and that conformance is why skills and scripts port across Unix-like systems.

**Answer: D.** Linux is Unix-like and largely POSIX-conformant, which is why skills and scripts port across Unix systems sharing that conformance. It is a recognition-level fact: know that conformance is the reason, not the contents of the standard.

- A is wrong: Licensing terms govern redistribution rights, not runtime command or system-call behaviour; they are unrelated to script portability.
- B is wrong: Different Unix-like systems run entirely different kernels; the shared standard is POSIX conformance, not a shared kernel.
- C is wrong: Portability across Unix-like systems specifically follows from shared POSIX conformance; it does not extend to unrelated operating systems without that conformance.

### 160.

Between X11 and Wayland, which is the newer display server protocol intended to replace the older one?

- **A.** X11, since it was adopted more recently by most major distributions as their default.
- **B.** Neither is newer; both were released in the same year as competing standards.
- **C.** The two names refer to the same underlying protocol under different branding.
- **D.** Wayland, the newer replacement for the older X11 protocol.

**Answer: D.** X11 and Wayland are the display server protocols underlying Linux graphics, with Wayland being the newer replacement for the older X11. This is recognition-level: know which is newer, not which distribution defaults to which.

- A is wrong: Recent default adoption by a distribution does not change which protocol is older; X11 predates Wayland regardless of current default choices.
- B is wrong: They were not released in the same year; X11 is the long-established older protocol, and Wayland was developed later specifically to replace it.
- C is wrong: X11 and Wayland are distinct display server protocols, not two names for one thing; the concept exists specifically to test that they are different and one is newer.

