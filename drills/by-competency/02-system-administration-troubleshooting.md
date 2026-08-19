<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — System Administration Fundamentals :: Troubleshooting

23 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A client gets "connection refused" reaching an internal API on its normal port. `systemctl status` on the server confirms the service is active. What do you check next, and what does its Local Address column rule out or confirm?

- **A.** `dig` against the service name, since a stale DNS answer somewhere in the resolution chain would explain a refusal like this.
- **B.** Nothing further — "connection refused" from a client always means the service itself is down on the server side.
- **C.** `ss -tulpn`. If it shows the socket bound to `127.0.0.1` rather than `0.0.0.0`, that explains a refusal from every remote client without any firewall rule being involved.
- **D.** `ls -ld` on the socket file itself, checking for a permissions problem that might be blocking the connection.

**Answer: C.** The layers of a connection failure are separately testable, and `ss -tulpn`'s Local Address column is the highest-value command once the process is confirmed running: `127.0.0.1` accepts only local clients while `0.0.0.0` accepts any, and that single field explains "works locally, fails remotely" without touching the firewall.

- A is wrong: A stale DNS answer typically produces a timeout against the wrong host, not an active refusal from a host that is confirmed running the service.
- B is wrong: `systemctl status` already confirmed the service is active, so "the service is down" is a conclusion the evidence has already ruled out.
- D is wrong: A TCP connection refusal is a network-layer response, not a filesystem permission fault, so a directory's mode bits are not the relevant evidence here.

### 2.

By IP address the API answers with an HTTP 502; by hostname the client hangs until it times out. What do these two results establish separately?

- **A.** Both results point at one firewall rule in the network path between the client and the server, since a rule that silently drops packets addressed by name while mangling those addressed by IP would produce a slow failure in the first case and an error status in the second.
- **B.** Restart the service immediately, since a 502 response always means the backend process itself has crashed outright.
- **C.** The 502 from `curl -v` against the IP proves the connection completed and an HTTP response came back, so the fault is above the transport layers; the timeout by name is resolution, which `dig` isolates.
- **D.** The delay seen only when connecting by name indicates the host itself is CPU-saturated and slow to respond generally.

**Answer: C.** `curl -v` distinguishes "never connected" from "connected and got an HTTP error" by showing the connection steps separately; a 502 by IP rules out every layer beneath the application. The hang by hostname is a different failure entirely, and `dig` and `ping` against the name versus the IP is how it gets confined to resolution.

- A is wrong: A 502 is a completed HTTP exchange, not a network failure, so it cannot share a cause with a connection that never completes at all.
- B is wrong: A 502 proves the TCP connection succeeded and the server responded; the process is running, it's simply returning an error status, which is not evidence of a crash.
- D is wrong: The IP-based test already showed the host responding promptly, so a name-based hang implicates resolution timing, not host CPU load.

### 3.

A system that worked yesterday fails today. The team insists nothing changed. How should that claim be treated?

- **A.** As irrelevant — skip it entirely and go straight to reproducing the fault instead of chasing down a change that may not even exist.
- **B.** As unlikely to be literally true, since certificate expiry, log growth filling a disk, a scheduled job, or an unattended upgrade can each alter behaviour with no deliberate human action.
- **C.** As a reason to skip straight to the journal instead, since a component's own log always names the underlying cause directly and completely.
- **D.** As accurate, and the investigation should move on from there to a purely structural explanation for the failure instead of a change-based one.

**Answer: B.** Change correlation is a prioritisation heuristic, not a literal question about human action. Certificates expire, disks fill from log growth, scheduled jobs run, DNS records reach their TTL and unattended upgrades apply patches — all changes nobody performed deliberately but that a system which ran correctly yesterday can still have undergone.

- A is wrong: Reproduction and change correlation answer different questions; skipping one does not make the other unnecessary.
- C is wrong: The journal records what a component reported, not when a configuration or dependency changed, which is what correlating against the symptom timeline needs.
- D is wrong: Accepting "nothing changed" at face value is exactly the trap this heuristic warns against; a change without a deliberate actor is still a change.

### 4.

A unit has been failing intermittently since this morning's boot. Which single combination narrows the journal to just this unit's own errors and worse, for the current boot?

- **A.** Follow the log live with `tail -f` on /var/log/syslog and wait for the next failure.
- **B.** Combine the unit filter `journalctl -u` with the priority filter `journalctl -p err`, both restricted to this boot.
- **C.** Run `systemctl status <unit>`, which lists the unit's recent journal lines alongside its load state, active state and the exit code of its last run.
- **D.** Run `journalctl -p err` alone, without a unit filter, since a single priority level shows only that unit's errors.

**Answer: B.** `journalctl -u` restricts output to one unit and `journalctl -p err` filters by severity, inclusive of everything worse than the named level; combined and scoped to the current boot they isolate exactly the failing unit's own errors. `tail -f` only follows a growing text file and cannot show history, and a system without persistent journal storage has nothing under `/var/log` for it to watch at all.

- A is wrong: That watches a text log grow in real time but shows nothing that already happened, and a journald-only system may have no such file to tail at all.
- C is wrong: That tail is a short, ellipsized summary of the current invocation only, not a full priority-filtered history across the boot.
- D is wrong: Without `-u` the output covers every unit and kernel record system-wide, drowning the one line that matters in unrelated noise.

### 5.

Writes to /var fail with "No space left on device," but `df -h /var` shows 40% used. What do you check next, and what does the outcome rule out?

- **A.** `journalctl -u` for the affected service, since the daemon's own log will name the cause of any resource exhaustion it hits.
- **B.** Delete the largest files you can find, since that's how a full disk is normally resolved.
- **C.** `ls -ld` on /var, in case a restrictive parent directory is blocking access.
- **D.** `df -i /var`. If `IUse%` is at 100%, the inode pool is exhausted, which rules out any remedy based on file size.

**Answer: D.** A filesystem can run out of data blocks or out of inodes independently, and both produce the same "No space left on device" message. `df -h` reports blocks; `df -i` reports the separate inode pool, which is consumed one per file regardless of that file’s size.

- A is wrong: A unit's journal won't explain a block-versus-inode discrepancy that the filesystem itself already surfaced.
- B is wrong: Inode exhaustion is caused by many small files, not large ones, so deleting a few large files changes nothing about the actual constraint.
- C is wrong: A traversal permission problem produces "Permission denied," not "No space left on device"; the symptom already points at the filesystem, not the path.

### 6.

`df -h` reports a filesystem at 100% used, but `du -sh /*` on that same mount totals far less. What explains the gap, and what actually fixes it?

- **A.** Space is held by files deleted while a running process still has them open; identifying and restarting that process releases the blocks.
- **B.** Search harder for large files with `du`, since some large consumer must be hidden from the first pass.
- **C.** The kernel is caching recently deleted file data in memory and will release the corresponding disk blocks once it comes under memory pressure.
- **D.** The mismatch is a logging artefact and resolves itself once the logs rotate.

**Answer: A.** `df -h` and `du -sh /*` answer different questions — filesystem accounting versus a directory-tree walk — and they legitimately disagree when space is held by a file that has been deleted but is still open. The fix is closing or restarting the process holding the descriptor, not finding a bigger file to delete.

- B is wrong: No amount of searching finds space held by deleted-but-open files, because they no longer have a name for any file search to match.
- C is wrong: Page cache reclaim is a memory mechanism and has no bearing on filesystem block accounting for an open-but-unlinked file.
- D is wrong: Log rotation renames or truncates files; it does not release blocks held open by a process that is still writing to the old descriptor.

### 7.

You're confident you know how to restart the production database and that doing so would fix the fault, but your role does not authorise changes to production databases. What should you do?

- **A.** Escalate, handing over the symptom, established scope, what changed recently, and the theories already tested.
- **B.** Apply the fix yourself, since asking for permission only wastes the time escalation would take.
- **C.** Reproduce the fault one more time to be certain before doing anything else.
- **D.** Restart the method from identification, since a fix you may not apply means one of the earlier steps must have produced the wrong theory.

**Answer: A.** Two distinct limits force escalation: competence and authority, and the second is the one technically capable people under-weight. Knowing how to perform a fix does not grant permission to perform it, and the handover exists precisely so the next person does not repeat eliminations already made.

- B is wrong: Authority boundaries exist independently of whether the action would work; performing it anyway is out of bounds regardless of technical confidence.
- C is wrong: Reproduction is already presumed established here; the blocker is authority to act, which another reproduction attempt does not resolve.
- D is wrong: The theory was never disconfirmed here — the fix it implies is simply outside your authority to apply, and repeating the earlier steps does not change who is allowed to act.

### 8.

A CI step runs a command that prints an alarming message, but the pipeline continues as though it passed. Checking immediately afterward, running `echo $?` reports 0. What does that tell you?

- **A.** The command failed silently, and `$?` is simply unreliable for this kind of check.
- **B.** The command lacked execute permission on its own binary, or ran from a filesystem mounted `noexec`, both of which are reported as exit status 0.
- **C.** The systemd unit wrapping the step is in a failed state regardless of the command's own status.
- **D.** The command's own exit status was 0, so it succeeded from the shell's point of view even though its output looked like a failure.

**Answer: D.** Exit status is the value scripts, systemd and CI pipelines actually check, and zero always means success regardless of what a command printed. A command that writes a scary line to stderr and exits 0 is a success as far as every automated caller is concerned.

- A is wrong: `$?` is exactly the mechanism the shell and every automated caller use to detect failure; the alarming text was not the failure signal.
- B is wrong: A missing execute bit produces 126, not 0; 0 always means the command ran and exited successfully.
- C is wrong: Nothing about an ad hoc shell command's exit status reflects a wrapping unit's state; the two are unrelated in this scenario.

### 9.

`uptime` reports a load average of 24, and `top`'s CPU-state line shows a high `wa` and a low `us`. What does that combination rule out, and what is actually happening?

- **A.** It rules out memory pressure entirely, since any swapping under memory pressure would instead show as a high `us` figure.
- **B.** A load of 24 is high regardless of core count, so this is unambiguous CPU saturation requiring more processing capacity.
- **C.** It rules out CPU saturation; `uptime`'s figure counts D-state processes too, and `top`'s high `wa` shows they're waiting on storage, not the processor.
- **D.** It confirms disk space, not CPU, is the constraint here, and the remedy is freeing space rather than adding processors.

**Answer: C.** The load average includes processes in uninterruptible sleep (state D), typically blocked on disk I/O, alongside runnable ones, so a high figure with a mostly idle CPU is a storage-bound queue rather than a processor shortage. `top`'s `wa` field is what separates the two causes that produce an identical load number.

- A is wrong: Memory pressure is not read off the `us`/`wa` split at all; that pair distinguishes CPU-bound work from I/O-bound work, not memory state.
- B is wrong: Load average is a count of queued work, not a percentage, and is meaningless without dividing by the number of cores first; the `wa` field here already points away from CPU saturation.
- D is wrong: I/O wait reflects processes queued on storage latency, which is a different condition from a filesystem running out of free space.

### 10.

A host reports a load average of 6. Is that a problem, and what determines the answer?

- **A.** It depends on core count; divide the load by `nproc`. A load of 6 on a 32-core host is unremarkable, 6 on a 2-core host is severe.
- **B.** Yes — a load figure above 1 always indicates a problem on any host, regardless of how many processor cores that host actually has available.
- **C.** No — swap usage, not load average, is what indicates trouble.
- **D.** It depends on network latency, which the load average also reflects.

**Answer: A.** Every useful conclusion about load average requires dividing by the core count first, which `nproc` supplies. The manual is explicit that the same raw figure describes an idle system on many cores and a saturated one on few.

- B is wrong: A load average of 1 means only a single-CPU system is loaded all the time; on a 4-CPU system the same figure means the system was idle 75% of the time.
- C is wrong: Swap usage is a separate memory metric; load average can be a genuine problem even with no swap activity at all.
- D is wrong: Load average has no network component; it counts processes runnable or blocked on local I/O, not requests waiting on the network.

### 11.

Users can't reach internal.example.com. Connecting by its literal IP address works. `dig` against the hostname returns SERVFAIL from the configured resolver. What does each result rule out?

- **A.** The working IP rules out connectivity, routing and the firewall; SERVFAIL rules out a missing record and points upstream — the resolver was reached but couldn't complete the lookup.
- **B.** Check `journalctl -u` for the resolver's own systemd service, in case it logged something about the failed lookup.
- **C.** SERVFAIL means the record simply doesn't exist in the zone, exactly the same thing NXDOMAIN means when returned instead.
- **D.** The working IP test means DNS itself is fine across the board and something else entirely must be wrong here.

**Answer: A.** Trying an IP address directly separates a DNS fault from a connectivity fault decisively: if the IP works and the name does not, the fault is in resolution. `dig`'s status field then discriminates further — NXDOMAIN, SERVFAIL and an unreachable-resolver report each point at a different remedy.

- B is wrong: The status field `dig` already returned identifies the failure mode directly; the resolver's own service log is not needed to interpret SERVFAIL.
- C is wrong: NXDOMAIN is an authoritative "this name does not exist"; SERVFAIL means the resolver was reached and failed to complete the lookup, which points at a different class of cause.
- D is wrong: A working IP alongside a failing name is exactly the signature of a resolution fault, not evidence that DNS is fine; it isolates the fault to resolution rather than away from it.

### 12.

`cat /etc/resolv.conf` shows a single line, `nameserver 127.0.0.53`. Where should you look for the real upstream DNS servers, and why?

- **A.** Add the real upstream servers directly to `/etc/resolv.conf`, since that's what the resolver reads.
- **B.** Check `journalctl -k` for kernel-level DNS errors, since name resolution failures are logged by the kernel alongside other network events.
- **C.** Run `ping` against the resolver's address to check reachability first.
- **D.** In `systemd-resolved`'s own configuration, since 127.0.0.53 is the local stub resolver and this file doesn't hold the actual upstream servers on such systems.

**Answer: D.** A single `127.0.0.53` nameserver line is the signature of `systemd-resolved`'s stub resolver rather than the real upstream configuration, which lives with that service instead of in the generated file. Editing the file directly is overwritten the next time the stub is regenerated.

- A is wrong: On a `systemd-resolved` system the file is generated, and a manual edit to it is overwritten rather than taking effect.
- B is wrong: DNS resolution is handled in user space by the resolver service; kernel messages are not where its upstream server configuration is recorded.
- C is wrong: Reachability of the stub address doesn't reveal where the actual upstream servers are configured, which is what the question asks.

### 13.

One user reports that a command fails. Which single additional observation most reduces the set of candidate causes?

- **A.** Check what has changed on the host over the last 24 hours, including deployments and package upgrades.
- **B.** Open the failing application's own log and read whatever it recorded for the reporter's session.
- **C.** Have a second user try the same command from the same place, or have the reporter try it from somewhere else.
- **D.** Reproduce the failure yourself, from your own account, on your own workstation, and see whether it happens there too.

**Answer: C.** Scope is established by contrast, not by observing the failure alone. A comparison case that changes exactly one dimension — same command, different user; same user, different host — tells you which dimension the cause lives in, eliminating whole categories at once.

- A is wrong: That is a useful theory-generating step later, but it does not by itself establish whether the fault is user-specific or host-wide.
- B is wrong: A log entry from one session carries no comparison case, so it cannot discriminate between a user-specific and a host-wide cause.
- D is wrong: That adds a second observation that differs in several dimensions at once — account, host and possibly network path — so no category of cause is eliminated by it.

### 14.

A service exits with shell status 137, and its own log shows nothing unusual before it stops. What does that status suggest, and what confirms it?

- **A.** Nothing conclusive — 137 is just as likely to be an ordinary exit code the application chose deliberately on its own way out.
- **B.** It indicates the process was CPU-starved and self-terminated.
- **C.** It means the command was not found on PATH.
- **D.** SIGKILL (128+9), consistent with an OOM kill; confirm with `journalctl -k` or `dmesg` around that time.

**Answer: D.** A shell exit status of 137 is 128+9, the signature of SIGKILL, which is exactly how the OOM killer terminates its victim. The kill itself is recorded in the kernel ring buffer — readable live with `dmesg` or, from the journal, with `journalctl -k` — which is where "died for no reason, nothing in its own log" gets its explanation.

- A is wrong: 137 is 128 plus a signal number and cannot come from a plain exit; the value itself already points at a fatal signal, here SIGKILL.
- B is wrong: CPU starvation does not send a process a fatal signal; a self-terminating process under load would ordinarily report an exit code, not 128+N.
- C is wrong: Command-not-found is exit status 127, a plain exit rather than a signal termination, and it is a different value entirely from 137.

### 15.

`free -h` on the host shows plenty of available memory, but a process inside one container was OOM-killed. How is that possible, and how do you confirm it?

- **A.** The kill was against the container's own cgroup memory limit, not the host total; the kernel message names a memory cgroup rather than system-wide exhaustion.
- **B.** The disk backing swap was full, not the memory itself, which is a separate condition from a cgroup limit being reached.
- **C.** It cannot happen — a healthy `free -h` output measured on the host itself rules out any OOM kill anywhere on that machine.
- **D.** The container's process lacked permission to allocate memory under its cgroup policy, and that restriction surfaces to the process as a kill.

**Answer: A.** A memory cgroup limit is enforced independently of host-wide memory availability, so a container can be OOM-killed on a host with gigabytes free. The kernel’s own OOM report is what discriminates the two cases: a kill made against a cgroup’s limit names that memory cgroup, while a system-wide exhaustion does not.

- B is wrong: The OOM killer responds to an unsatisfiable memory allocation, not to disk state, and a full swap disk is a separate condition from a cgroup limit being hit.
- C is wrong: Host-level memory figures say nothing about a cgroup's own configured limit, which is exactly what a container can be killed against while the host has memory to spare.
- D is wrong: A permissions fault produces EACCES or EPERM on an operation, not a kernel-initiated SIGKILL for memory exhaustion.

### 16.

A file is mode 644, owned by the requesting user, yet opening it returns "Permission denied." `ls -l` on the file shows nothing wrong. What do you check next, and what does the outcome rule out?

- **A.** `journalctl -u` for the service touching the file, since its own log may record the real reason for the denial somewhere.
- **B.** Widen the file's mode with chmod until the error stops appearing, since a more permissive mode can only help, not hurt.
- **C.** `df -i` for inode exhaustion on that filesystem, since exhaustion of either kind can also block access to a file.
- **D.** `namei -l` on the full path, or `ls -ld` on each parent directory — a parent missing search (`x`) permission explains the denial and rules out the file's own mode and group membership.

**Answer: D.** The single most common miss on this fault is the traversal case: the file's own mode is fine and a parent directory's is not. `namei -l` walks the path component by component and shows exactly where that traversal bit is missing, which `ls -l` on the file alone cannot reveal.

- A is wrong: A traversal denial happens at the kernel level during path lookup and is not something the application's own service log would explain.
- B is wrong: The file's own mode already looks fine, so widening it further does not address a parent-directory or credential cause and permanently weakens a file that wasn't the problem.
- C is wrong: Inode exhaustion blocks creating or writing new files, not reading an existing one, and it produces "No space left on device," not "Permission denied."

### 17.

A user was added to a new group with `usermod -aG` an hour ago. In their still-open shell they get "Permission denied" on a file the new group can read. What's happening, and what confirms it?

- **A.** The group membership itself is broken somewhere in the directory service and must be re-applied from scratch before it will work.
- **B.** DNS caching somewhere upstream is delaying the group change from propagating down to this particular host and shell.
- **C.** Their session predates the group change; comparing `id` inside the open shell against `id <user>` shows the group lists differ, and a fresh login is what's needed.
- **D.** The service holding the file needs `systemctl status` checked for a stale process left over from before the change.

**Answer: C.** `id` reports the credentials of the current process, not the account's configured groups, so an open shell started before a group change still carries the old set. Comparing it against `id <user>` exposes exactly that gap, and the fix is a new login rather than another permission change.

- A is wrong: The configuration is already correct; the running session simply predates it, which another `usermod` command does not fix.
- B is wrong: Group membership is a local kernel-held credential on the running process, with no involvement from DNS resolution or caching at all.
- D is wrong: The denial here is on a user's own interactive shell reading a file, not a service's process state, which `systemctl status` doesn't speak to.

### 18.

A reported permission fault will not reproduce when you run the same command as root. What does that success establish?

- **A.** That the fault is fixed, since the reproduction attempt succeeded.
- **B.** Nothing about the reported fault; root is exempt from the ordinary mode checks, so the failing condition was never exercised.
- **C.** That the file's mode, ownership, and every parent directory along the path must already be correct and fully permissive for the reporting user.
- **D.** That the issue can be escalated as resolved, since it did not recur under test.

**Answer: B.** Reproduction has to match the reported trigger exactly — the same command, the same account, the same host — or a successful run proves nothing about the original failure. Testing as root is the classic version of this error: the superuser is exempt from the checks that a permission fault depends on.

- A is wrong: A successful run under different conditions is not a verified fix; the original trigger — the unprivileged user's attempt — was never re-tested.
- C is wrong: The test as run says nothing about the original user's permissions, because root bypasses the checks that would reveal a problem with them.
- D is wrong: Escalation hands over an open problem with evidence gathered; an invalid reproduction attempt is not evidence that the problem is closed.

### 19.

`systemctl status` on a unit shows `Active: failed (Result: exit-code)` with a non-zero status. What does that state rule out, and where is the daemon's own message?

- **A.** It confirms an OOM kill happened, since the process is no longer running and something must have terminated it against its will.
- **B.** It rules out a signal or OOM kill, since those leave the unit in a `signal` or `oom-kill` failed state instead; the message is in `journalctl -u` for this unit.
- **C.** It confirms a permissions problem on the unit's data directory or one of its configuration files somewhere along the path.
- **D.** It confirms the listening port is already bound by another process, most likely a previous instance of the same daemon.

**Answer: B.** The state name tells you which half of the problem you're in: `failed` with an exit code means systemd started the process and it died under its own control, ruling out signals and OOM kills, which surface differently. The daemon's own error line is in the unit's journal, not in the short tail `systemctl status` shows.

- A is wrong: An OOM kill is a signal termination and leaves the unit in the `oom-kill` failed state, not in an ordinary exit-code state.
- C is wrong: An exit-code state says only that the process exited under its own control; the specific cause could be permissions or something else entirely until the journal is read.
- D is wrong: "Address already in use" is a specific journal message found with `ss -tulpn`, not something the generic exit-code state alone establishes.

### 20.

`systemctl start nginx.service` returns immediately with no error, but the site is unreachable a moment later. What's the right next command, and why?

- **A.** `systemctl status` on the unit, because a forking or notify-type daemon can exit moments after a successful-looking start.
- **B.** `tail -f` on /var/log/syslog, since systemd services always write there.
- **C.** `ss -tulpn`, to see whether anything is listening on the expected port.
- **D.** Nothing — `systemctl start` returning without error means the service is running and stays running until something explicitly stops it.

**Answer: A.** `systemctl start` succeeding is not the same claim as the unit staying active; `systemctl status` is what reports the load state, active state and sub-state, and the exit code or signal of the most recent run. `ss -tulpn`'s Local Address column becomes the next useful command once the unit's own state is confirmed.

- B is wrong: journald does not guarantee a corresponding text file, and this does not confirm the unit's current active state either way.
- C is wrong: Useful once you know the unit died, but it doesn't explain why a start that reported success failed to keep the process running; check the unit's own state first.
- D is wrong: A clean return only confirms the command was accepted, not that the daemon stayed up; a service that restart-loops or exits shortly after can look identical to success at that instant.

### 21.

Mid-investigation, your first theory's test comes back negative. What does that outcome rule out, and what should happen next?

- **A.** It rules out nothing yet; apply the fix you had already planned for that cause anyway, on the theory that trying it costs little and might happen to help.
- **B.** It rules out that specific cause and the fix already planned for it; return to theory formation with one candidate eliminated.
- **C.** It points the investigation toward a user-specific cause rather than a host-wide one, so narrow the scope again.
- **D.** It signals the problem is outside your expertise, so escalate with the evidence gathered so far.

**Answer: B.** Each step in the method gates the next, and a negative test is itself informative: it rules out one candidate cause and the fix that went with it, and sends the investigation back to theory formation rather than forward to implementation. Reaching for `journalctl -u` or any other command at this point does not change what a failed test means.

- A is wrong: This is the trap the method exists to prevent: implementing a fix for a theory that just failed its test cannot be verified against anything and wastes the elimination.
- C is wrong: A negative test result says nothing about blast radius; that is a separate technique with its own comparison case.
- D is wrong: One eliminated theory is not an authority or competence boundary; escalation is triggered by those limits, not by an ordinary negative result.

### 22.

How do the structured troubleshooting method and narrowing scope differ, once both are in play on the same fault?

- **A.** Narrowing scope also ends with a verified, documented fix, so the two are interchangeable in practice.
- **B.** The method requires reproducing the fault before anything else can happen, and narrowing scope becomes entirely optional once reproduction has already succeeded.
- **C.** The method is the whole ordered procedure from identification through documentation; narrowing scope is one technique used inside its early steps.
- **D.** Narrowing scope applies to every fault as a discipline, while the method applies only when the blast radius is already unclear.

**Answer: C.** The comparison turns on scope: the structured troubleshooting method names the entire ordered procedure and is what answers "what do I do first," while narrowing scope is a single early technique that produces a reduced set of candidates rather than a completed, verified fix.

- A is wrong: Narrowing scope ends with a reduced candidate set, not a fix; only the full method reaches verification and documentation.
- B is wrong: Reproduction is a distinct precondition for verification, not a gate that narrowing scope depends on or replaces.
- D is wrong: This reverses the actual scope: the method applies to every fault as a discipline, and narrowing scope is only useful where the blast radius is not already known.

### 23.

You don't recall the name of the command that reports load averages, only that its description mentions "load." Which pair of commands searches manual page descriptions for a keyword, rather than opening a page whose name you already know?

- **A.** `man`, since giving it a keyword instead of a page name still searches the page bodies.
- **B.** `apropos` and `man -k`, both keyword searches over the one-line descriptions of every manual page.
- **C.** `info`, since its Texinfo indices are more complete than the corresponding man pages.
- **D.** Run the suspected command with a guessed name and read `echo $?` after each attempt until one succeeds.

**Answer: B.** `apropos` and `man -k` both search the whatis database of one-line descriptions for a keyword, which is exactly what's needed when the command's name is unknown. `man` and `info` are direct-lookup tools: both require the name in hand already, which is the one thing missing in this scenario.

- A is wrong: Given a bare keyword, `man` looks for a page of that name and fails; searching page bodies is a separate mode, `man -K`, and not what plain `man` does.
- C is wrong: Even where a Texinfo manual is fuller than the man page, `info` is still a direct lookup that needs the manual’s name — the one thing missing in this scenario.
- D is wrong: That is trial and error against the shell, not a documentation search, and it never actually identifies the correct command name.

