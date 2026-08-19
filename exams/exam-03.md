<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 03

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-03-answers.md](exam-03-answers.md)

---

### 1.

A script appends a configuration line to a file every time it runs, rather than checking whether the line is already present. It is scheduled nightly across fifty hosts. What results after a month?

- **A.** Fifty files with duplicated entries; the script is fully automated but not idempotent.
- **B.** Convergence to a single declared state, because the script runs automatically every night.
- **C.** No effect beyond the first run, because the change was already tested once before deployment.
- **D.** Nothing unusual — since the script is automated, running it repeatedly is inherently safe.

### 2.

After an incident, engineers argue that a change made directly in the cloud console is riskier than one applied through a version-controlled template — not because the console change leaves nothing to investigate, but for a narrower reason. What is that reason?

- **A.** The console change leaves no record at all, since it is commonly assumed that none of the major cloud providers log console activity anywhere by default, which is why teams often skip reviewing it after an incident and move straight to blaming the deployment pipeline instead.
- **B.** The console change cannot be encrypted at rest, unlike a template stored in version control.
- **C.** The console change bypasses least-privilege enforcement entirely, since every console session is granted administrator rights by default regardless of the identity signing in or the policy attached to it.
- **D.** Although CloudTrail, Activity Log or Cloud Audit Logs still record by default that the action happened, the console change leaves no reproducible artifact: no reviewable definition that can be diffed, approved and reapplied to recreate the environment.

### 3.

A health check should print "unreachable" only when a ping fails, and should not run at all when the ping succeeds. Which operator connects the two commands to produce that behaviour?

- **A.** `&&`, run only if the previous command succeeded
- **B.** `||`, run only if the previous command exited non-zero
- **C.** `;`, which runs the second command regardless of the outcome
- **D.** A pipe, so the ping's output feeds directly into the message command

### 4.

A host runs a database listener that no application actually uses. Between removing the listener, patching it, and filtering access to it with a firewall rule, which action reduces attack surface the most, and why?

- **A.** Patching it, because an up-to-date service is no longer part of the attack surface.
- **B.** Filtering it with a firewall rule, because that removes the installed surface just as effectively as uninstalling it.
- **C.** None of the three matters — nothing can be reduced until a vulnerability scan identifies a specific CVE in the listener.
- **D.** Removing the listener, because it eliminates the exposure entirely including flaws nobody has discovered in it yet.

### 5.

A candidate is asked to place cluster, node, pod, and container in a containment hierarchy from largest to smallest. What is the correct order?

- **A.** A node contains clusters, a cluster runs pods, and a pod holds containers.
- **B.** A cluster contains nodes, a node runs pods, and a pod holds containers.
- **C.** A cluster contains pods directly, and nodes are an optional layer that some clusters omit entirely.
- **D.** A pod contains nodes, and a node runs directly inside a container.

### 6.

A backlog review drops a requirement tagged 'non-functional,' reasoning that non-functional items rank below functional ones. What is wrong with that reasoning?

- **A.** Classification and priority are independent axes; a non-functional requirement can be the highest-priority item in the set.
- **B.** The requirement should have been marked 'Won't have' under MoSCoW before being dropped, rather than dropped on classification alone.
- **C.** The requirement was probably untestable as worded, which is the real defect being missed here.
- **D.** Nothing is wrong — 'non-functional' is the conventional label for a lower-priority requirement.

### 7.

An alert fires when a disk reaches 85% usage. Is that capacity planning?

- **A.** Yes — any statement referencing a resource threshold counts as capacity planning, regardless of whether it describes now or a future planning date.
- **B.** No — that is monitoring and alerting reporting the present; capacity planning projects the trend forward to the date the disk will be full.
- **C.** No — it is asset and inventory management confirming the volume exists, which records what systems exist rather than how full they are.
- **D.** Yes — the 85% figure defines the maintenance window for the expansion work, rather than describing the disk's condition today.

### 8.

During a scale-in event, a target is terminated while requests are still in flight, and clients see a burst of 500-level errors. Which mechanism was missing?

- **A.** Graceful shutdown — the target must stop receiving new requests and drain the ones already in flight during the deregistration delay window before it is terminated.
- **B.** A health check, since only a failed health check should ever be allowed to cause a target's termination.
- **C.** Right-sizing, since an undersized target is what produces errors during a scale-in event.
- **D.** Immutable infrastructure, since only replacing instances from new images would have avoided losing in-flight requests.

### 9.

What does a disaster recovery drill establish that restore testing does not?

- **A.** That the people involved can execute the plan and know their roles.
- **B.** That the backup media can be read back successfully.
- **C.** That the recovery point objective is being met.
- **D.** That the off-site copies are far enough from the primary.

### 10.

A script runs `diff a.conf b.conf && echo same` to report whether two config files match, and the message never prints even when they visibly differ, which the script treats as a bug in `diff`. Is that the right read of `diff`'s exit status here?

- **A.** Yes — `diff` should exit 0 whenever it successfully compares two files, differences or not
- **B.** No — `diff` exits 1 when files differ, which is its normal, correct outcome, not a malfunction
- **C.** No — but only because `.conf` files always trigger status 2 regardless of content
- **D.** Yes — `&&` requires exit status 1 specifically to run the next command, so a `diff` that finds differences is exactly what should have triggered the echo

### 11.

A certificate expires at midnight and the connection begins failing outright at that moment. Has the data crossing that connection become unencrypted?

- **A.** Yes, since an expired certificate can no longer perform any cryptographic operation.
- **B.** Yes, because expiry automatically reverts the connection to the deprecated SSL protocol as a fallback, and SSL performs no validity check of its own, so the session continues under the keys already agreed.
- **C.** This cannot be determined without first checking whether the certificate authority itself has been compromised.
- **D.** No. An expired certificate still encrypts perfectly well; what has failed is trust, and the client refuses the connection rather than downgrading it.

### 12.

An administrator takes an LVM snapshot before a risky upgrade. The underlying physical volume then fails outright. What is the state of the snapshot?

- **A.** Lost with the volume, because a local snapshot is stored on the same storage as the original.
- **B.** Intact, because a snapshot is an independent copy of the data held apart from the original volume.
- **C.** Intact, because snapshots are always written to separate storage.
- **D.** Intact, because RAID parity reconstructs it from the surviving disks.

### 13.

A container exited five minutes ago with an error. Which diagnostic step still works, and which does not?

- **A.** Neither works once a container has exited, since both diagnostic commands require the container to still be running.
- **B.** `docker exec -it` still works on an exited container as long as `-t` allocates a fresh terminal for it.
- **C.** `docker logs` still works, because it replays the already-captured stdout and stderr stream; `docker exec -it` does not, because it needs a running process to join.
- **D.** Both work identically, because Docker keeps an exited container's filesystem on disk and queryable, which is all that either of the two commands needs in order to run.

### 14.

On Azure, a service in one North America region reads several terabytes from another North America region in the same month, while a separate copy of that data is read by an application outside Azure over the public internet. Which transfer is priced lower on Azure's own published rates, and is that pattern safe to assume on every provider?

- **A.** Whichever transfer runs on a spot instance, since spot pricing carries a built-in data-transfer discount that applies to whatever the instance sends.
- **B.** Whichever transfer touches a tagged resource, since cost-allocation tags mark traffic for a preferential rate on the data-transfer meter.
- **C.** The inter-region transfer is priced lower at this volume on Azure's published North America rates, but the pattern is not a safe assumption to carry to other providers.
- **D.** Both are priced identically, since egress is metered purely by the volume of data moved and takes no account of where that data is going.

### 15.

A `ping` to a remote host times out. An operator concludes the host is down. What can and cannot actually be concluded from a failed `ping`?

- **A.** The host is definitely down, since `ping` failure always means the target is unreachable, because echo replies come from the kernel and cannot be filtered en route
- **B.** DNS resolution has failed, since `ping` relies entirely on name resolution succeeding first
- **C.** The local network interface is down, since a working interface always gets an ICMP reply
- **D.** Nothing conclusive, since ICMP is commonly filtered and a healthy host can still fail to answer echo requests

### 16.

How does a Contributor License Agreement differ from a copyright assignment?

- **A.** A CLA grants the contributor write access to the repository, while a copyright assignment only grants them read access to it.
- **B.** A CLA grants the project a licence, often including patent rights, over the contribution, while the contributor keeps ownership; an assignment transfers ownership of the contribution outright.
- **C.** A CLA must be signed before Apache-2.0 section 3's patent grant applies to any contribution, while copyright assignment bypasses that section entirely.
- **D.** There is no real difference; both terms describe the identical transfer of copyright ownership from the contributor to the project.

### 17.

A migration test needs one specific hostname to resolve to a new server on a single test machine, without touching DNS or affecting any other host. An engineer edits `/etc/resolv.conf` to add a line for the new server. Was that the right file?

- **A.** No. `/etc/hosts` holds name-to-address mappings directly and takes effect immediately with no restart; `/etc/resolv.conf` only lists which nameservers to ask and contains no name-to-address data at all.
- **B.** Yes — `/etc/resolv.conf` is where individual name-to-address overrides belong, since it is the file most commonly edited by hand for testing purposes.
- **C.** No, but only because the correct approach is instead to lower the target record's TTL and wait for the change to propagate through DNS.
- **D.** No, but only because the correct fix is to add a static ARP entry binding the hostname to the new server's MAC address.

### 18.

Two questions arrive about the same server: "is the service even running?" and "is anyone actually using it right now?" Which `ss` invocation answers each?

- **A.** `ss -tulpn` alone answers both questions simultaneously, since its `-l` flag is defined to include every established connection alongside the listening sockets.
- **B.** `ss -t state established` alone answers both questions, since a service with any established connections is thereby proven to also be listening.
- **C.** The two are mutually exclusive views of the same table: `ss -tulpn` answers whether it is running, by showing the LISTEN socket, while `ss -t state established` answers who is using it, by showing active ESTAB connections.
- **D.** Neither command answers either question; only reading application logs directly can determine whether a service is running or in use.

### 19.

A finance application runs on a fully patched host with LUKS-encrypted disks and HTTPS on every connection. An attacker exploits an application bug and reads live records from memory. Which exposure was neither control designed to address?

- **A.** Data at rest, since the LUKS volume should have prevented any process from reading its contents.
- **B.** Data in transit, since the application bug must have exposed the TLS session key over the network, though nothing in the scenario describes interception of network traffic, only a compromise reading memory directly on the host itself.
- **C.** Data in use, since a compromised running process reads the unlocked filesystem and live memory normally, and neither at-rest nor in-transit encryption applies there.
- **D.** None — HTTPS plus LUKS together cover every stage data passes through.

### 20.

An administrator stops a virtual machine in the Azure portal and expects the compute meter to stop immediately. Support explains that billing has continued. Which state is the machine most likely still in?

- **A.** Stopped (allocated), since the underlying hardware lease has not been released and only deallocation does that.
- **B.** It was switched from on-demand to reserved pricing, which is billed on a different schedule than a stopped machine.
- **C.** The disk became orphaned the moment the machine stopped, and orphan billing is what is being observed.
- **D.** Stopping any virtual machine, on any provider, always halts its compute meter immediately.

### 21.

An operator runs `echo /tmp | ls`, expecting to see `/tmp`'s contents, and instead sees a listing of the current directory. Why does the pipe not deliver `/tmp` to `ls` as intended?

- **A.** The pipe failed because `echo`'s output cannot be piped at all
- **B.** `ls` requires `sudo` to read piped input, which was not used here
- **C.** `ls` takes operands, not standard input, so the piped text is simply ignored
- **D.** `xargs` should have been unnecessary here since pipes already convert text into operands

### 22.

A container is started with `docker run -p 80:8080 api`, and the operator expected the application to become reachable on port 80. It is not. What is wrong?

- **A.** `docker run -p` only works for ports below 1024, so port 80 silently fails to bind and needs root privileges specified separately That framing borrows a general Unix privileged-port rule and applies it directly to the containerized process without checking it.
- **B.** The mapping is reversed: the host port is written first, so this actually forwards host port 80 to container port 8080, not the intended pairing.
- **C.** `EXPOSE` was never declared in the Dockerfile, so `-p` has no effect regardless of which order the ports are written in.
- **D.** The container needs to be recreated with `docker start -p` instead, since `docker run` does not accept port mappings directly.

### 23.

A host holds the address 100.64.0.5. A technician assumes it is RFC 1918 private space because it clearly is not publicly routable. Is that assumption correct?

- **A.** Yes — anything that is not globally routable on the internet is, by definition, one of the RFC 1918 private ranges under typical operating conditions.
- **B.** No, 100.64.0.0/10 is carrier-grade NAT space, a fourth non-globally-routable range defined separately from the three RFC 1918 blocks.
- **C.** No, but only because 100.64.0.5 is actually loopback space rather than RFC 1918 or carrier-grade NAT space.
- **D.** No, but only because 100.64.0.5 is link-local (APIPA) space rather than RFC 1918 or carrier-grade NAT space.

### 24.

A retailer runs production on a public provider and keeps a completely separate analytics environment on a second public provider, with no network link, no shared identity and no data movement between them. Is this hybrid cloud?

- **A.** Yes — using two different cloud providers for two different workloads is exactly what hybrid cloud means in everyday industry usage.
- **B.** Yes, because multi-cloud arrangements automatically qualify as hybrid once a second provider is added.
- **C.** No, because neither environment is a private cloud, and hybrid requires at least one private cloud specifically.
- **D.** No — this is multi-cloud only, since no private or community cloud is involved and nothing binds the two providers together.

### 25.

A startup embeds a lightly modified MIT-licensed parsing library inside its closed-source commercial product and ships only a compiled binary. What does the MIT licence require of the startup?

- **A.** That the modified parsing library, and the entire product it has been combined into, be released under the MIT licence as well.
- **B.** Nothing at all, since permissive licences are widely understood to impose no conditions of any kind on anyone who reuses or redistributes the code.
- **C.** That the startup grant every recipient an express, litigation-terminating patent licence covering its own modifications to the library.
- **D.** Only that the copyright notice and permission notice travel with the copies distributed; nothing about the product's own source or its licence.

### 26.

A connection attempt to a service hangs with no response at all, while a connection to a different port on the same host is refused instantly. Reading the handshake behaviour, what does each symptom suggest?

- **A.** Both symptoms mean the same thing, that the host is unreachable, since a hang and an instant refusal are simply two presentations of the identical block, selected by how long the client's own connect timeout has been configured rather than by anything the remote host sent back.
- **B.** The hang means a SYN went out and got nothing back, a silent drop usually caused by a firewall; the instant refusal means a SYN reached a live host that answered with RST because nothing was listening on that port.
- **C.** The hang means the TLS handshake failed after the connection was already established, while the instant refusal means the three-way handshake itself failed.
- **D.** The hang means the destination host actively chose UDP instead of TCP for that port, while the instant refusal confirms it is genuinely using TCP.

### 27.

A company deploys email filters, DMARC, and firewall rules, and still loses a credential to a phishing email that got through. Why does the guide name user awareness rather than any technical control as the defence here?

- **A.** Because filters and DMARC only work against denial-of-service traffic, not against email at all.
- **B.** Because MFA is guaranteed to stop any phishing attempt outright, making user awareness unnecessary in practice.
- **C.** Because phishing is legally classified differently from other attacks and therefore requires a training response instead of a technical one.
- **D.** Because the target of the attack is the person, which technical controls can only ever reduce exposure to, never fully patch.

### 28.

An operator runs `ls -l /etc/nginx` to check that directory's own permissions, but the output lists the files inside it instead. Which command replaces the listing of contents with a single line for the directory entry itself?

- **A.** `ls -lR /etc/nginx`, since a recursive listing opens with a line describing the directory itself
- **B.** Running `ls -ld /etc/nginx` to target the directory entry itself
- **C.** `stat -d /etc/nginx`, since `-d` means "directory mode" for `stat` as well
- **D.** `ls -l /etc/nginx/.`, since appending a dot forces the directory's own entry to show

### 29.

Two hosts sit on the same physical switch but are configured in different VLANs. Can they communicate directly through the switch alone?

- **A.** Yes — since they share the same physical hardware, VLAN membership has no effect on whether two hosts can reach each other directly.
- **B.** No; separate VLANs are separate broadcast domains, exactly as if the hosts were on physically distinct switches, so a router or a layer 3 switch is required to forward between them.
- **C.** Yes, but only if both VLANs happen to use IP addresses from the same subnet, in which case the switch bridges them automatically.
- **D.** No, but only because 802.1Q tagging actively blocks all traffic between any two ports on the same physical switch by default.

### 30.

In object storage, is a 'folder' shown in a console listing a real directory?

- **A.** Yes — object storage organises items in a true hierarchical directory tree, the same as a conventional filesystem.
- **B.** No — it is a prefix on the object's key; the namespace is flat and has no real directory structure underneath it.
- **C.** Yes, but only within block storage volumes that have been formatted with a hierarchical filesystem.
- **D.** No, because object storage items are addressed only by a numeric offset rather than any kind of name.

### 31.

A web API container holds no data of its own and pushes everything to an external database, while a message-queue container stores its messages on local disk. How should these two be classified?

- **A.** Both are stateless, because neither one runs a database engine directly inside its own container.
- **B.** The API is stateless, so any instance can serve any request and is freely replaceable; the queue is stateful and needs persistent storage and careful handling.
- **C.** Both are stateful, because every container writes something to its own writable layer while it runs.
- **D.** The API is stateful because it depends on an external database, and the queue is stateless because messages in transit are transient and never need to outlive the instance holding them.

### 32.

A file was copied as root into `alice`'s home directory and is now owned by root. `alice` wants to take ownership herself. Can she run `chown alice file` to do it?

- **A.** No — only a privileged process may give a file away to another user; `alice` cannot chown it to herself either
- **B.** Yes, any user may change the ownership of a file they can currently read
- **C.** Yes, but only because she is changing it to her own account rather than someone else's
- **D.** No, but `chgrp` would work instead — group changes carry no privilege check at all, so any user may set any group on any file

### 33.

A script edited on Windows and copied to a Linux server fails immediately with "bad interpreter: No such file or directory," even though `/bin/bash` clearly exists. What is the actual cause?

- **A.** `/bin/bash` was replaced by a symlink the transfer rewrote, because copying from a Windows host resolves and flattens symlinks on the destination
- **B.** The execute bit was reset during the file transfer, producing this specific error text
- **C.** Windows-edited scripts cannot use `#!/bin/bash` at all and must use `#!/bin/sh`
- **D.** The shebang line ends in a carriage return, so the kernel looks for an interpreter literally named `/bin/bash\r`

### 34.

Events from a database server, a web server, and a firewall arrive at a central collector with unsynchronised clocks. What does that unsynchronised state prevent an investigator from doing?

- **A.** Reading any individual log entry at all, since unsynchronised clocks make log files unreadable, because the collector discards every record whose timestamp it cannot reconcile against its own.
- **B.** Retaining the logs for the required period, since retention depends on clock accuracy.
- **C.** Encrypting the logs in transit to the collector, since TLS requires synchronised clocks to function.
- **D.** Correlating the events into an accurate timeline, since matching activity across systems depends on their clocks agreeing.

### 35.

A vendor missed a delivery date last week. Should that be logged as a risk or as an issue?

- **A.** A risk, since the vendor might miss further deadlines going forward, and treating the pattern as an ongoing risk keeps the team focused on preventing a recurrence rather than dwelling on the past.
- **B.** An issue, as it has already happened and needs resolving and escalating, unlike a risk, which is an uncertain future event assessed for likelihood and impact.
- **C.** A risk, because it should be scored for likelihood and impact before any action is taken.
- **D.** Neither — it should only be raised through the communication plan's escalation path.

### 36.

Counting the colon-separated fields of a line in `/etc/passwd` in order, which field is the login shell?

- **A.** The sixth field, since the password placeholder is usually skipped when counting
- **B.** The fourth field, the same position as the primary GID
- **C.** It is not in `/etc/passwd` at all — login shells are recorded only in `/etc/shadow`
- **D.** The seventh and last field

### 37.

An operations team needs to move a running workload to a different physical host with little or no downtime, and later wants to roll it back to an earlier point if an upgrade goes wrong. Which property of virtual machines makes both possible?

- **A.** Because a VM is a software-defined computer (a disk image plus configuration), it can be live-migrated to another host and snapshotted, cloned and rolled back with little or no downtime.
- **B.** Because containers, which the VM is built from, are inherently portable across any host, so moving one is only a matter of restarting its image somewhere else with no state to carry.
- **C.** Because the hypervisor automatically replicates every VM to a standby host in real time — a second copy of memory and disk is held in lockstep without any configuration.
- **D.** Because the shared responsibility model assigns migration and rollback duties to the provider, making both a contractual guarantee rather than a technical capability.

### 38.

After a crash, `journalctl -b -1` returns nothing at all, as if the previous boot never happened. What is the most likely explanation, and what confirms it?

- **A.** `journalctl` itself must be malfunctioning, since a crash should always leave some trace
- **B.** The messages must be in `/var/log/syslog` instead, since journald never captures kernel or crash messages
- **C.** `-b -1` is the wrong syntax and should instead be `-b 1` to see the previous boot — journalctl numbers boots forward from the first one ever recorded and rejects negative offsets outright
- **D.** The journal is volatile: without `/var/log/journal` existing, it lives under `/run` and is discarded at every reboot; `journalctl --list-boots` confirms what is retained

### 39.

A developer installs a JavaScript library so that only the single project importing it can see it, and separately a system administrator installs a runtime package so that every process on the machine can use it. Which kind of tool performed each installation?

- **A.** The operating system's package manager performed both installs, since a package is a package regardless of which tool is used to install it.
- **B.** A container image performed the project-local install, since containers are what pins a project's dependency versions.
- **C.** A language package manager performed both installs, since the operating system exposes identical installation semantics to any caller.
- **D.** A language package manager performed the project-local install, and the operating system's package manager performed the machine-wide one.

### 40.

In a directory with no `.txt` files at all, an operator runs `ls *.txt` and gets an error naming a file literally called `*.txt`. What does that error reveal about how the shell handled the pattern?

- **A.** No pathname matched, so bash left the unquoted word exactly as typed and passed it through
- **B.** `ls` interpreted `*.txt` as an option because it began with an unrecognized character
- **C.** The glob matched every file in the directory, and `*.txt` happened to be one of the names
- **D.** `ls` created a file named `*.txt` to satisfy the command, since a listing tool creates any operand it cannot find

### 41.

A team replaces a self-managed jump box with a managed service such as Azure Bastion or AWS Systems Manager Session Manager. What changes about the target virtual machines' exposure?

- **A.** Nothing changes for the targets; only the administrator's client software changes, since the managed service is assumed to sit entirely on the administrator's side of the connection.
- **B.** The targets now route their outbound traffic through a NAT gateway instead of directly.
- **C.** The targets are now addressed by a managed DNS name instead of an IP address.
- **D.** They need no public IP address and no open inbound SSH or RDP port at all — the managed service removes the exposed port entirely rather than just auditing it.

### 42.

Two directives for the same keyword appear in `sshd_config` — one in the main file, one in a drop-in file included earlier via `Include /etc/ssh/sshd_config.d/*.conf` near the top. Which value does OpenSSH actually use, and which command reveals it without guessing?

- **A.** The main file's value wins, since directives placed later in a file always override ones read earlier.
- **B.** Neither wins outright; `sshd` merges both values and applies whichever is more restrictive.
- **C.** The drop-in file's value wins, because unless a keyword documents otherwise the first obtained value is used — and `sshd -T` prints the effective configuration to confirm it.
- **D.** The drop-in file's value wins, and `sshd -t` is what prints the effective merged configuration to confirm it, since the daemon has no separate flag for dumping resolved keyword values.

### 43.

A huge log file is deleted by hand to free disk space, but `df -h` still reports the filesystem as full afterward. Why, and what is the correct long-term fix?

- **A.** `df -h` is simply slow to update and will reflect the freed space after a short wait
- **B.** The log must actually be compressed already, which is why deleting it did not free space
- **C.** The daemon still has the file open, so its blocks stay allocated until the descriptor closes; the fix is scheduled log rotation, not manual deletion
- **D.** The filesystem must have run out of inodes rather than blocks — removing one very large file frees the blocks it occupied but never releases the inode that indexed them

### 44.

An administrator wants live CPU information and runs `cat /proc/cpuinfo` rather than a dedicated tool. What Unix design principle makes that command meaningful?

- **A.** Multi-user isolation, since `/proc/cpuinfo` is scoped separately per logged-in user session, the way a user's own files and settings normally are.
- **B.** Everything is a file: devices, sockets, and kernel state are exposed through the same filesystem interface used for ordinary files, so `cat` can read them like any other path.
- **C.** The kernel-space/user-space boundary, since crossing it is what makes `cat` able to read kernel data at all, regardless of where that particular data happens to physically live on disk.
- **D.** `/proc/cpuinfo` is a regular text file the kernel writes to disk at boot and never touches again, the same as any other static configuration file.

### 45.

A customer asks a delivery team for an extra report field. The team agrees on the spot, adds it, and the schedule and budget both stay exactly as originally planned. Is this scope creep?

- **A.** No, because the request came directly from the customer rather than from inside the team, and customer-originated requests are generally treated as legitimate by default.
- **B.** No, since the addition is small enough that it doesn't need to be tracked as a formal change.
- **C.** Yes. The defining property is the absence of assessment, approval and a re-baselined schedule and budget, not the size of the addition.
- **D.** No, because the schedule and budget staying unchanged proves the addition had no real cost.

### 46.

A user belongs to `developers` as a supplementary group and `staff` as their primary group. Which group owns a file they create in their home directory with no special tooling involved?

- **A.** `staff`, because a newly created file takes the creator's primary group
- **B.** `developers`, because supplementary groups grant access to newly created files too
- **C.** Whichever group appears first alphabetically among the ones the user belongs to
- **D.** `root`, because only a privileged process can set group ownership on creation

### 47.

A peering request is submitted between two virtual networks whose IPv4 CIDR blocks overlap. What happens?

- **A.** It succeeds, and the provider automatically re-addresses one side to resolve the overlap.
- **B.** It succeeds, since overlapping ranges only block a dedicated circuit, not a peering connection.
- **C.** The request fails outright; a peering connection cannot be created between networks with matching or overlapping CIDR blocks.
- **D.** It succeeds, but the resulting route table entries silently point at the wrong network.

### 48.

A reviewer asks a contributor to improve a commit message that currently reads only "fix." What information does a good message add that the diff itself can never supply?

- **A.** A complete restatement of which lines were added or removed, for readers who skip the diff
- **B.** The author's name and the commit's timestamp, since those are otherwise missing from the commit and have to be supplied somewhere in its metadata by hand
- **C.** Why the change was made, and what alternative was considered and rejected — reasoning the diff cannot show at all.
- **D.** Which branch the commit belongs to, so `git log` can group commits by branch

### 49.

What is the purpose of creating a dedicated service account for a web server daemon rather than running it under an administrator's own account?

- **A.** To limit the damage a compromised daemon can do, by giving it only the privilege it needs
- **B.** To give the daemon a personal login so a human can use it to authenticate interactively
- **C.** To grant the daemon root access automatically, since service accounts are privileged by convention
- **D.** To let the daemon be scheduled with `cron` instead of `systemd`

### 50.

A dataset is assembled by merging three source files: one labelled Internal, one Confidential, and one Restricted. Under conventional classification scheme rules, what label does the merged dataset carry?

- **A.** Restricted; aggregation conventionally takes the highest label present, because the merged set discloses everything its most sensitive member discloses.
- **B.** Internal — most of the source files were not Restricted, so the majority label applies to the merge, the same way a vote would decide among competing classifications.
- **C.** Confidential — mandatory access control automatically re-labels merged data to the median sensitivity of its inputs.
- **D.** Whatever label the employee who performed the merge personally holds clearance for, since the clearance of the person doing the work determines the sensitivity of what they produce.

### 51.

A process is run with `sudo` and therefore executes as root. Does that process now run in kernel space?

- **A.** Root is a user-space account privilege, so no; the process still runs in the CPU's restricted execution mode and must still cross a system call to reach the kernel.
- **B.** Yes — root has no permission checks applied to it, and having no permission checks is exactly what kernel space means, since nothing is left to restrict what it can touch.
- **C.** Yes — running as root places the process in the kernel's own address space, so it can reach kernel memory directly without going through a system call.
- **D.** It depends on the distribution, since some distributions grant root direct kernel-mode execution by default configuration, unlike the more restrictive ones that do not.

### 52.

A file is `rwxr-xr-x` with the setgid bit already set for a shared workflow. An administrator must add write for the group without disturbing anything else, including the setgid bit. Which command is safe?

- **A.** `chmod 775 file`, since 775 already includes group write
- **B.** `chmod g+w file`, a symbolic clause that changes only the named bit
- **C.** `umask 002` applied before the next write to the file — the mask is re-applied to a file's mode on every write, so the next write widens the group bits
- **D.** `chmod -R g+w file`, adding the recursive flag for safety

### 53.

Support reports checkout feels slow. A team's first move is to add more application instances behind the load balancer, but p99 latency does not improve. What step was skipped?

- **A.** Nothing was skipped, since adding instances is always the correct first response to any latency complaint — application capacity being the usual constraint behind a slow checkout, and the one lever a team can pull without waiting for a measurement.
- **B.** Setting a recovery time objective for the checkout service before making the change.
- **C.** Measuring which resource is actually saturated before acting — the fix should follow the identified constraint, not the most familiar-looking one.
- **D.** Placing a content delivery network in front of the checkout page.

### 54.

An interface exposes `POST /getOrder` and `POST /deleteOrder`, both returning JSON over HTTP. A developer calls it a REST API. What is missing?

- **A.** Resource URLs and method semantics — the verb belongs in the URL and one method is used for everything, the opposite of the uniform interface REST requires.
- **B.** Nothing at all — returning a JSON body over an HTTP connection is already sufficient to call an interface RESTful.
- **C.** A published, machine-readable contract describing the interface's available inputs and outputs to callers.
- **D.** A message queue sitting between the client and the service to decouple the two in time, the missing piece that would let the caller stop waiting for an immediate response.

### 55.

A filter is set to capture severity level 3 (Error) and above. Does it also capture Warning-level messages?

- **A.** Yes, "level 3 and above" naturally includes Warning since it feels like a lesser problem than Error
- **B.** It depends on the facility the message was logged under, not the severity level — a severity filter matches only messages carrying the daemon facility
- **C.** No — severity 3 and above means levels 3, 2, 1 and 0, and Warning is level 4, a less severe level than 3
- **D.** Yes, because syslog severities count upward from least to most severe starting at 1

### 56.

An exam-style question lists "pull request" alongside `git commit` and `git merge` as three Git operations to define. Which part of that framing is wrong?

- **A.** Nothing is wrong; all three are standard Git commands documented on git-scm.com with their own manual pages and option lists.
- **B.** `git merge` is the odd one out, since only commit and pull request happen without a network connection at all, and merge always requires contacting a remote server before it can complete, even when combining two purely local branches.
- **C.** "Pull request" is not a Git operation at all; it is a hosting platform's concept, defined nowhere in git-scm.com's documentation, and its own primary source here is GitHub's own documentation rather than a Git manual page.
- **D.** `git commit` is the odd one out, because only merge and pull request combine two branches into a single resulting line of history.

### 57.

A company hashes customer email addresses before sharing a dataset with a vendor and calls the result anonymized. Is that assessment correct?

- **A.** Yes — applying any one-way function to an identifier produces anonymized data by definition, regardless of how small or guessable the space of possible inputs happens to be.
- **B.** No, but only because a data loss prevention rule would have blocked the export regardless of which technique was used.
- **C.** Yes — and Article 34(3)(a) confirms that hashed data outside GDPR's scope never needs to be reported if it is later exposed.
- **D.** No — the input space of email addresses is small enough to enumerate, so hashing them is pseudonymization at best, and the data remains personal data under GDPR.

### 58.

A teammate needs three separate facts about a server: its kernel release and hardware name in one line, its distribution identity, and how long it has been running. Which three commands supply those, respectively?

- **A.** `cat /etc/os-release` alone is assumed to answer all three, since it is believed to also report kernel version and uptime as part of that very same file.
- **B.** `hostnamectl` alone answers all three, since it exists on every Linux system and reports everything at once for free, always.
- **C.** `uname -a` for kernel and hardware facts, `cat /etc/os-release` for distribution identity, and `uptime` for time since boot and load averages.
- **D.** `uname -a` reports the distribution name directly, making a separate distribution check entirely unnecessary in every case.

### 59.

The golden signals framework names four metrics to watch first for a running API. Which four should be the starting point, and what does the fourth mean specifically?

- **A.** CPU, memory, disk and network, since those are the only resources that can ever be the constraint.
- **B.** Uptime, cost, latency and throughput, since those are the numbers customers care about most.
- **C.** Latency, traffic, errors and saturation, saturation meaning how full the constraining resource is, not merely how busy it appears.
- **D.** Errors, latency, availability and elasticity, since those cover both failure and demand-tracking behaviour.

### 60.

`cat /etc/resolv.conf` shows a single line, `nameserver 127.0.0.53`. Where should you look for the real upstream DNS servers, and why?

- **A.** Add the real upstream servers directly to `/etc/resolv.conf`, since that's what the resolver reads.
- **B.** Check `journalctl -k` for kernel-level DNS errors, since name resolution failures are logged by the kernel alongside other network events.
- **C.** Run `ping` against the resolver's address to check reachability first.
- **D.** In `systemd-resolved`'s own configuration, since 127.0.0.53 is the local stub resolver and this file doesn't hold the actual upstream servers on such systems.

