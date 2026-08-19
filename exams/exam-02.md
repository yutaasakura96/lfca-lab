<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 02

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-02-answers.md](exam-02-answers.md)

---

### 1.

A pre-change snapshot is taken immediately before a risky migration. A week later, the migration is confirmed good. What typically happens to that copy?

- **A.** It is often discarded, since it existed to undo one identified action rather than to satisfy ongoing retention.
- **B.** It automatically becomes part of the routine, retention-scheduled backup regime.
- **C.** It must be kept indefinitely, since any pre-change copy is a permanent compliance record.
- **D.** It is deleted immediately once the change is applied, before the outcome is confirmed.

### 2.

A configuration management tool logs into every long-lived server nightly and applies patches automatically, without a person present. Is that automation over manual configuration, immutable infrastructure, both, or neither?

- **A.** Immutable infrastructure only — applying a fresh set of patches to the same running server each night counts as replacing the instance in every sense that matters, since the software on it is now current.
- **B.** Both, since any process that changes a server without a human present satisfies the definition of immutable infrastructure automatically.
- **C.** Neither, since a well-architected review would not classify unattended patch automation under either practice.
- **D.** Automation over manual configuration only; it is fully automated, but each server still accumulates its own unique history of applied changes because none of them is ever replaced.

### 3.

Compare `cd /tmp/build; rm -rf *` with `cd /tmp/build && rm -rf *`. If the `cd` fails because the directory does not exist, what happens under each?

- **A.** The `;` form still runs the deletion, wherever the shell happens to be; the `&&` form does not run it at all
- **B.** Both forms behave identically, since `&&` and `;` differ only in style, not in effect
- **C.** Neither form runs the deletion, since a failed `cd` aborts the entire line
- **D.** The `&&` form still runs the deletion and the `;` form does not, because `&&` joins commands unconditionally while `;` waits for a zero exit status

### 4.

A server has written detailed access logs for a year, but nobody has ever reviewed them. Has the organisation been auditing its access?

- **A.** Yes — the mere presence of the logs constitutes auditing regardless of whether anyone reads them.
- **B.** No. Recording the events is accounting; auditing is the review activity, and records nobody reviews detect nothing.
- **C.** Yes, because writing the logs already satisfies the authentication requirement for the account that generated them.
- **D.** No, and the fix is to encrypt the log files rather than to schedule a review.

### 5.

An engineer wants to see which artifacts occupy local disk before deciding what to prune, distinct from what is currently running. Which command answers that, and what does it list?

- **A.** `docker images`, which lists the templates held in the local image store rather than any running or stopped instance.
- **B.** `docker ps -a`, which lists every container instance so far created, running or not.
- **C.** `docker build .`, which rebuilds every locally cached layer and prints a fresh inventory as it goes That framing treats a build command as a reporting tool rather than one that produces a new image.
- **D.** `docker pull`, which downloads the current state of every image the host has ever referenced.

### 6.

A requirements document contains: 'The system shall store customer records in PostgreSQL.' Which statement about this sentence is correct?

- **A.** It is defective in the same way 'the system shall provide flexible reporting' is defective, since neither sentence can be tested as it is written.
- **B.** It is a non-functional requirement of the same kind as a stated latency threshold, since both put a measurable bound on how well the system performs.
- **C.** It is a requirement like any other, since every sentence in a requirements document is by definition a requirement.
- **D.** It states an implementation choice rather than the need behind it, so it has to be rewritten as behaviour or kept as a constraint with its reason recorded.

### 7.

A flood closes an office for a month. Which concern belongs to business continuity rather than to disaster recovery?

- **A.** Where staff will work and how customers will be told.
- **B.** Which systems are restored first and in what order.
- **C.** How much data was lost between the last copy and the flood.
- **D.** Whether the standby site can carry production load.

### 8.

A load balancer's health check is a shallow TCP check that reports a target healthy as soon as it accepts the socket. What can go wrong because of that shallowness?

- **A.** Nothing — accepting a TCP connection is sufficient proof that the application layer is also ready to serve requests.
- **B.** The load balancer stops routing to the target entirely, since a shallow check can never report healthy in the first place.
- **C.** An alert fires and pages a human before the target is added back into rotation.
- **D.** A target enters rotation before it can actually serve a request, because accepting a connection is not the same as the application layer being ready to handle one.

### 9.

Which measurement would demonstrate that a stated recovery time objective is actually achievable?

- **A.** Confirming the age of the most recent restorable copy.
- **B.** Timing a rehearsed recovery from failure to service restored.
- **C.** Counting how many components have a redundant pair.
- **D.** Reviewing the retention schedule for the backup sets.

### 10.

Two binary files need to be checked for whether they are byte-for-byte identical across two different machines. Comparing `diff`, `cmp`, and a checksum tool, which is the right choice, and why do the other two fall short?

- **A.** `diff`, since its unified format applies equally well to binary and text files
- **B.** `cmp`, since it can compare two files that are not both present on the same machine
- **C.** Any of the three works equally well for this task, since all three reduce to the same byte-level comparison once given two files as arguments
- **D.** A checksum tool such as `sha256sum`, since it gives a comparable fingerprint without transferring either file

### 11.

A browser reports a certificate problem on a service that changed in no other way overnight. The certificate's `notAfter` date is still weeks away, but the hostname in the certificate does not match the address requested. What is the correct fix, and is renewal the right one?

- **A.** Reissue the certificate with the correct name; renewal alone would not fix a hostname mismatch, since the dates were never the problem.
- **B.** Renew the certificate, since every certificate warning is ultimately an expiry problem regardless of what the browser reports.
- **C.** Install the missing intermediate certificate, since that is always the cause when the leaf certificate itself looks otherwise correct, and a gap in the chain is what makes a browser report the presented name as unrecognised.
- **D.** Correct the client's clock, since a skewed clock is the most common cause of a certificate warning.

### 12.

A machine has been powered off for far longer than its DHCP lease duration. When it powers back on, what should be expected?

- **A.** It is guaranteed to receive the exact same address as before, since a DHCP server always reserves an expired lease's address permanently for its original holder under the great majority of ordinary configurations.
- **B.** It may receive a different address than before, since the previous lease will have expired and the address may have been reassigned to another client in the meantime.
- **C.** It will fail to obtain any address at all, since a DHCP server never issues a fresh lease to a client whose previous one has expired.
- **D.** It will self-assign a 169.254 link-local address automatically, since that is the defined behaviour whenever a lease has expired for any reason.

### 13.

Two nodes pull an image referenced only as `nginx`, minutes apart, and end up running different code even though neither node changed anything. What best explains this?

- **A.** One node pulled from the registry and the other from its local image store, which are guaranteed to diverge over time.
- **B.** The reference resolved to `nginx:latest`, and the tag was repointed to a different image by a push that happened between the two pulls.
- **C.** Each node's container runtime applies a different default `CMD` when none is pinned by an explicit tag.
- **D.** The nodes are running different container runtimes, and each interprets an untagged reference according to its own rules That framing treats tag resolution as a runtime-specific behaviour rather than something the registry controls uniformly.

### 14.

Data is uploaded into a cloud provider's storage service, then later read back out to the public internet. Which of those two transfers is billed?

- **A.** Only the inbound upload, since storage services meter and charge for whatever volume of data they physically receive from a client.
- **B.** Only the outbound read; inbound transfer is generally free, and reading your own data back out is egress like any other transfer.
- **C.** Neither, as long as both transfers stay within a monthly free allowance on the account.
- **D.** Neither — the meter tracks only total volume moved in either direction and does not distinguish inbound from outbound at all.

### 15.

An operator wants to know exactly which file on `PATH` will run when they type `git`, in case more than one copy is installed. Which command answers that directly?

- **A.** `whereis git`, since it reports the binary's location along with its manual page and source paths
- **B.** `locate git`, since the database includes every file on the system
- **C.** `which -a git`, showing every matching file on `PATH`, not just the first
- **D.** `find / -name git`, since it will eventually find every copy

### 16.

What does AGPL section 13 add on top of the plain GPL, and what specifically triggers it?

- **A.** Nothing beyond the plain GPL — conveying a copy remains the only trigger, since GPLv3 section 5 already covers network interaction on its own.
- **B.** A requirement to publish a Software Bill of Materials each time the hosted service is updated with new dependencies.
- **C.** An obligation, triggered by that network interaction rather than by conveying a copy, to offer the Corresponding Source to users who interact with a modified version remotely over a network.
- **D.** An obligation that applies to any software running on a server that users reach over the internet, regardless of which licence that software carries.

### 17.

Three DNS query tools are available: `dig`, `nslookup` and `host`. A script needs the fewest lines of output to parse programmatically, while a full investigation needs every section and flag visible. Which tool suits each need?

- **A.** `nslookup` gives the terse script-friendly output, while `host` gives the full response detail a deep investigation requires, including section headers, flags and per-record TTLs.
- **B.** `dig` gives the terse script-friendly output by default, while `host` gives the full response detail with sections and flags.
- **C.** All three tools produce identical output by default, differing only in the command name used to invoke them.
- **D.** `host` gives the terse output the script wants; `dig` gives the full response detail (sections, flags, TTLs) that a full investigation needs.

### 18.

A written address reads `2001:db8::0::1`, with two separate `::` runs. Why must this be rejected as invalid notation?

- **A.** It is invalid because IPv6 addresses may contain at most six hexadecimal groups written out in total.
- **B.** It is invalid because the `db8` group contains a letter, and IPv6 groups may only contain decimal digits.
- **C.** It is invalid because addresses beginning `2001:db8::` are reserved and can never be assigned to a real interface, so no address from that prefix may be written in compressed form.
- **D.** Zero compression allows at most one `::` per address, because a second occurrence makes the number of elided zero groups ambiguous.

### 19.

A service enables HTTPS on its public endpoint. Does that protect a stolen backup tape holding the same data?

- **A.** Yes, because encrypting the connection also encrypts every copy of the data that connection ever carried, including anything later written to disk from it.
- **B.** Yes, because TLS certificates also authenticate whoever physically holds the backup media.
- **C.** No, because HTTPS protects data crossing the network, and a stolen backup tape is a data-at-rest exposure that a separate control must cover.
- **D.** No, but only because the backup was compressed rather than encrypted, which is a separate deficiency.

### 20.

Which kind of evidence is used to find an orphaned resource, as distinct from a rightsizing candidate?

- **A.** Inventory: attachment state, last activity, and owner tag, rather than utilisation telemetry.
- **B.** Telemetry — CPU, memory and IOPS utilisation measured against provisioned capacity.
- **C.** A cost-monitoring dashboard's trend line, since any rising bill is a reliable signal of an orphan.
- **D.** A tagging standard's enforcement log, since any untagged resource is necessarily an orphan.

### 21.

Comparing a pipe, a redirection, and the standard streams themselves: which one joins two running processes together, which one joins a process to a file, and which one is just the numbered endpoints?

- **A.** A pipe joins two processes; redirection joins a process to a file or descriptor; standard streams are the numbered endpoints 0, 1 and 2
- **B.** Redirection joins two running processes together; a pipe attaches a single process to a file or device
- **C.** All three describe the same mechanism under different names, with the choice of word being purely a matter of habit
- **D.** Standard streams come into existence only once a pipe or redirection has been used; a process run with neither has no descriptors open at all

### 22.

A pod holds a main application container and a sidecar container that must share the main container's network so it can inspect traffic on `localhost`. Why does putting both in one pod satisfy that requirement?

- **A.** Because Kubernetes automatically creates a Service between any two containers placed in the same pod.
- **B.** Because every container in a cluster can already reach every other container over `localhost`, regardless of which pod holds it, extending pod-scoped network sharing to the whole cluster.
- **C.** Containers in the same pod share a network namespace, one IP address and one port space, so they reach each other over `localhost` by design.
- **D.** Because both containers were built from the same image, which is what grants them a shared network namespace.

### 23.

`ss -tulpn` shows a process listening at `127.0.0.1:8080` and another at `0.0.0.0:9090`. A remote client can reach the second but not the first. Why?

- **A.** The port numbers decide it — 9090 is inherently reachable from remote hosts while 8080 is inherently restricted to local connections regardless of the bind address shown, because the kernel reserves the 8000-8999 band for loopback traffic.
- **B.** The process names decide it, since `ss -tulpn` restricts remote reachability based on which named process owns each socket rather than on the bound address.
- **C.** The Local Address column decides it: `127.0.0.1` accepts only from the same machine, while `0.0.0.0` accepts on every address the host holds, including from remote clients.
- **D.** Whether `-n` was used decides it, since numeric output is what actually enables remote clients to reach a listening socket in the first place.

### 24.

A company keeps regulated data in its own self-service, metered private cloud and bursts overflow batch processing into a public provider, joined by a private network link, shared identity and a common deployment pipeline so workloads can move between the two. Does this qualify as hybrid cloud under NIST, and what would be missing if the connective tissue were removed?

- **A.** No — using more than one deployment model at once is what defines multi-cloud, not hybrid cloud, and hybrid is reserved for two providers of the same kind.
- **B.** Yes, and the network link and shared identity are incidental details — placing workloads in two different clouds is sufficient on its own, whatever technology joins them, since NIST's composition clause is descriptive rather than a test of its own.
- **C.** No — hybrid cloud requires a public cloud and a community cloud specifically, not a private and a public cloud, which NIST classes as something else.
- **D.** Yes. Both parts are themselves clouds and are bound together by technology enabling data and application portability, which is exactly NIST's two-part test; without the connective tissue, it would be two separate estates rather than one hybrid cloud.

### 25.

Product A is sold for a subscription fee, but its licence grants every recipient the source code plus the rights to modify and redistribute it, including modified versions. Product B is downloadable at no cost, but its licence forbids redistributing any modified copy. Which product is open source software?

- **A.** Product B, because the Free Software Foundation's definition of "free" is about price rather than the rights a licence happens to grant.
- **B.** Neither, since charging money for a copy disqualifies a licence from open source status under any of the ten criteria.
- **C.** Product A, since price is irrelevant to the definition and its licence grants the modification and redistribution rights the definition requires.
- **D.** Product B, because barring redistribution of modified copies is simply a stricter, more protective variant of the same open source terms rather than a different category of licence entirely.

### 26.

A question asks which TCP/IP layer ARP output is used at. Given that ARP carries an internet-layer address inside a link-layer frame, what is the exam-safe placement?

- **A.** ARP is purely an application-layer protocol, since it runs as a background service the way a name resolver like DNS does in most textbooks and quick references.
- **B.** ARP belongs entirely to the transport layer, because it resolves an identifier the way a port number does.
- **C.** ARP sits entirely within the internet layer, with no link-layer role at all.
- **D.** Because ARP joins layer 3 addressing to layer 2 delivery, it sits awkwardly across the link/internet boundary rather than cleanly inside one layer.

### 27.

A study guide draft states, with no dataset named, that phishing is the single most common route to initial access. Should that sentence stand as written on this exam?

- **A.** Yes, because phishing needs no technical vulnerability to succeed, which settles the ranking without any measurement being required.
- **B.** No. “Most common” is a measured ranking that shifts between annual breach reports, so the sentence needs a named, current dataset behind it or it should not be made at all.
- **C.** Yes, because phishing and social engineering name the same category, so the claim is true by definition rather than by measurement.
- **D.** No, because denial of service is the most common initial-access route instead.

### 28.

Convert the mode string `-rw-r--r--` to its octal equivalent, and state what kind of entry it describes.

- **A.** 755, a directory the owner can fully control and others can list and traverse
- **B.** 600, a private file only its owner can read or write
- **C.** 444, a file that is read-only for every class, since none of the three triads carries a write bit
- **D.** 644, a regular file the owner can read and write and everyone else can only read

### 29.

An administrator on a Red Hat-family server runs `update-grub` to regenerate the configuration after a kernel update, and it fails: command not found. Why?

- **A.** `update-grub` is a Debian-family wrapper script; Red Hat-family systems regenerate the configuration with `grub2-mkconfig` instead
- **B.** GRUB configuration regeneration is not supported at all on Red Hat-family systems
- **C.** The command failed because Secure Boot is enabled and blocking configuration regeneration
- **D.** The command failed because the kernel update has not finished installing yet — `update-grub` is shipped by the kernel package and appears only once the update completes

### 30.

Two application servers need to read and write the same set of files concurrently, with ordinary file permissions and locking. A second block storage volume is proposed for the second server. Why is that the wrong shape?

- **A.** Object storage should be used instead, since it scales to any number of concurrent readers and writers and presents them with a mountable POSIX filesystem on which ordinary file permissions and byte-range locking work unchanged.
- **B.** A second block volume works fine, because block storage automatically synchronises writes between volumes attached to instances in the same account — both copies are kept identical.
- **C.** A block volume is normally attached to one instance at a time; sharing one between instances needs an explicit multi-attach feature plus a cluster-aware filesystem, which file storage over NFS or SMB provides natively.
- **D.** A second block volume works fine, provided both servers are in the same availability zone, since volumes co-located with their instances can be attached to more than one at a time.

### 31.

A described workflow ends with: the build passed, and a tested artifact was produced. Nothing further is stated about where that artifact went afterward. Which practice has the description covered so far?

- **A.** Continuous delivery, since producing a tested artifact already means it is inherently something that could be released.
- **B.** The full pipeline stage list, because build and test are only two of several stages a pipeline definition can contain.
- **C.** Continuous integration, since the process runs from a committed change to a tested, deployable artifact and the description stops exactly there.
- **D.** Build and artifact promotion in full, since an artifact was produced and every environment further along the pipeline must therefore already have received it.

### 32.

A filesystem reports full. Walk through the correct diagnostic order: what is checked first, second, and third?

- **A.** `df -h` to find which filesystem is full, then `df -i` to rule out inode exhaustion, then `du -sh` descending from the mount point to locate the largest tree
- **B.** `du -sh /` immediately, since it directly finds the largest files on the whole machine in one pass
- **C.** `lsof +L1` first, since deleted-but-open files are always the cause of a full filesystem — every other cause of a full filesystem will already have been reported as an error long before `df` shows 100%
- **D.** `fsck` immediately, since a full filesystem should always be checked for structural damage first

### 33.

A newly written script fails with "Permission denied" when run as `./deploy.sh`, even though its contents look correct and the shebang is present. What is the most likely missing step?

- **A.** The shebang line needs to be moved to the second line of the file
- **B.** The script must be renamed with a `.sh` extension before it can be executed
- **C.** `chmod +x deploy.sh` was never run, so the file lacks the execute bit
- **D.** The script needs to be sourced with `.` instead of run with `./`

### 34.

A question asks "why ship logs off the originating host to a central SIEM." Is that question testing accounting, or security logging and monitoring?

- **A.** Accounting, since shipping logs off-host is just another way of describing the third A of AAA.
- **B.** Neither — shipping logs off-host is an availability concern addressed by redundancy, not by either topic.
- **C.** Accounting, because a SIEM is defined as the tool that performs authentication decisions for every host it collects from, when a SIEM's role is collecting and correlating events across hosts, not making authentication decisions for any of the systems it monitors.
- **D.** Security logging and monitoring, since it asks about the operational pipeline that makes records survive and get seen, not about the AAA-triad property of recording actions.

### 35.

A manager tells a team to 'raise your velocity next Sprint.' Why is that instruction self-defeating in a way the exam likes to test?

- **A.** It isn't self-defeating — velocity is an objective measure of output, so raising it means the team genuinely produced more useful work than it did in any of its previous Sprints.
- **B.** It's self-defeating because velocity is set by the Product Owner, not by the Developers who do the estimating.
- **C.** Velocity is denominated in the team's own relative units, so it can be inflated by estimating the same work as larger without delivering any more of it.
- **D.** It's self-defeating because velocity can only be measured once a Sprint has been extended past its fixed length.

### 36.

`getent group developers` lists three members. A fourth user has `developers` as their primary group. Does that user appear in the output?

- **A.** No. The member list in `/etc/group` records supplementary membership only
- **B.** Yes, every member of the group appears in the member list regardless of how they joined it
- **C.** No, because primary group membership is not recorded anywhere on the system
- **D.** Yes, but only after running `groupadd` again to refresh the membership list

### 37.

What does a virtual machine provide that a container does not, and what does that cost?

- **A.** A VM boots its own kernel, which lets it run a different operating system family than the host and gives a stronger isolation boundary, at the cost of the memory, CPU and patching overhead of a full guest OS.
- **B.** A VM provides faster startup than a container, since it boots directly from a stored image rather than assembling a filesystem from layers the way a container image does.
- **C.** A VM is essentially a container with more overhead and no additional capability — the two are interchangeable once an image has been built for either one.
- **D.** A VM automatically provides higher availability than a physical machine, independent of any platform configuration, because the hypervisor restarts a failed guest elsewhere in the cluster on its own.

### 38.

`sudo` has stopped working for every user on a server after a configuration change earlier today. What is the diagnostic order for recovering, starting from a surviving root session?

- **A.** Delete `/etc/sudoers` and let the package manager regenerate a default copy — the sudo package's post-install script reinstalls a known-good policy whenever the file is missing
- **B.** Run `visudo -c` to see whether the main file parses, then check every drop-in under `/etc/sudoers.d/`, since a broken drop-in produces the same symptom
- **C.** Reboot the server, since a sudoers problem is always resolved by a fresh boot
- **D.** Run `chmod 777 /etc/sudoers` so every user can bypass the broken policy temporarily

### 39.

A company moves from quarterly releases bundling hundreds of changes to daily releases of a handful each. Why does this reduce risk rather than increase it?

- **A.** Moving testing and security earlier in the lifecycle catches more defects before any release ships at all.
- **B.** Releasing daily forces the team to add substantially more automated test coverage than it had before.
- **C.** It does not reduce risk, because releasing more often simply multiplies the number of separate occasions on which something can go wrong in front of users.
- **D.** Each release carries less change, so the candidate causes of a failure are few and the time between making a change and learning its effect is short.

### 40.

An audit needs to see every supplementary group a user belongs to, not just their primary account name. Which of `who`, `w`, `last`, `id` and `whoami` actually reports that?

- **A.** `whoami`, since it reports the full account profile including group membership
- **B.** `id`, which lists every supplementary group along with the real and effective IDs
- **C.** `who`, since it lists every attribute of each logged-in session including groups
- **D.** `last`, since the historical login record stores each session's group list alongside its terminal and login time

### 41.

Why does routing administrative access through one hardened host instead of opening SSH on every server improve security?

- **A.** Because the bastion host replaces the need for any security group rules on the private resources.
- **B.** Because the bastion host routes administrative traffic over a private service endpoint automatically, the same mechanism documented for reaching a managed storage or database service privately.
- **C.** Because a bastion host encrypts traffic that would otherwise travel in the clear.
- **D.** The private resources behind it need no direct inbound exposure of their own, and access is concentrated at one auditable point instead of scattered open ports.

### 42.

A baseline sets `PermitRootLogin no`. A colleague argues this is redundant because `PermitRootLogin prohibit-password`, the default, already blocks root entirely. Are the two settings equivalent?

- **A.** Yes, since both values block every method of root login identically.
- **B.** No — `prohibit-password` still permits root to log in with a key; only `no` disables root login outright.
- **C.** Yes, because `PasswordAuthentication no` elsewhere in the file already makes the `PermitRootLogin` value irrelevant.
- **D.** No, but only because `prohibit-password` additionally requires MFA for any root login attempt.

### 43.

A server does not come back after a kernel upgrade and reboot: the GRUB menu appears and the kernel prints messages before the process stops, with no login prompt ever appearing. Which stage does that narrow the fault to?

- **A.** Firmware or the bootloader, since any boot failure should be treated as a firmware problem first
- **B.** The package manager's database, since a kernel upgrade updates package metadata
- **C.** UEFI Secure Boot, since an upgraded kernel is unsigned by default — signature verification runs only once the kernel begins starting userspace, which is exactly where this boot stopped
- **D.** After the kernel starts and before the init system finishes — the initramfs, the root filesystem, or a failing unit, rather than firmware or the bootloader

### 44.

A user wants to switch from GNOME to KDE Plasma on their existing installation without reinstalling the distribution. Is that generally supported?

- **A.** Yes. Swapping desktop environments on the same distribution and display server is generally supported, since the choice is independent of the distribution.
- **B.** No — the display server itself would need reinstalling from scratch, since each desktop environment is assumed to require its own dedicated protocol underneath it.
- **C.** No — swapping desktop environments requires switching to a different distribution family entirely first, before anything else.
- **D.** Yes, but only if the user also switches from CLI administration to GUI administration beforehand as a prerequisite.

### 45.

A project's last deliverable is finished and demoed, but it was never formally accepted against the criteria agreed at the start, and the operations team was never given the runbook. Is the project closed?

- **A.** Yes — closure is simply whatever happens once the last piece of planned work is finished, since there is nothing left on the plan for anyone to keep working on after that point.
- **B.** Yes, since the deliverable's completion is itself the final milestone marking the project's end.
- **C.** No, since acceptance against the original criteria and handover to operations are what actually end a project, and neither has happened yet.
- **D.** Yes, provided a final Sprint Retrospective is held to capture lessons from the last iteration.

### 46.

A stale monitoring script keeps a PID recorded in a file from an hour ago and sends it a signal to check on a long-running job. The signal reaches an entirely unrelated process instead. What explains this?

- **A.** PID files are guaranteed unique for the life of the machine and cannot be reused
- **B.** The script must be running inside a different PID namespace than the job it is checking
- **C.** The job's PPID must have changed, which the script failed to account for — `kill` resolves a recorded PID against its parent before deciding where to deliver the signal
- **D.** PIDs are reused once a process exits, so the recorded number may now belong to a different process entirely

### 47.

Network A is peered with Network B, and Network B is peered with Network C. A needs to reach C. What does A have, and what would fix it?

- **A.** Nothing to C, because peering is non-transitive, so A needs a direct peering connection to C, or a transit/hub gateway service.
- **B.** A path to C through B automatically, since B is peered with both, and a peering relationship is assumed to extend transitively through any shared network the way a route would.
- **C.** A path to C, but only if A also establishes a VPN tunnel to C directly.
- **D.** A path to C as long as all three networks share the same CIDR block.

### 48.

A contributor says: "I merged my branch, so I opened a pull request, and then I rebased it once more to be sure." A reviewer points out that this sentence treats three different things as interchangeable steps in one workflow. Sort them correctly by what each actually is.

- **A.** All three are Git commands with slightly different flags but the same underlying effect on history.
- **B.** Merge is a Git command that joins two histories; a pull request is the hosting platform's review wrapper around a proposed merge, not a Git operation; rebase replays commits onto a new base, rewriting their hashes.
- **C.** Merge and pull request are both Git commands, and rebase is the platform-side review step.
- **D.** Rebase and pull request both rewrite commit hashes, while merge is the only one of the three that leaves history untouched on every kind of merge, fast-forward or diverged, run locally or triggered from a hosted review.

### 49.

A file is `chmod 000`, owned by root. Can a process running as root read and write it despite the mode granting no bits to anyone?

- **A.** Yes: root bypasses the ordinary permission check entirely, so the mode bits are irrelevant to it
- **B.** No, `000` blocks every process including root, since the mode has no bits set for any class
- **C.** Only if root is also the file's owner, which grants an exception to the check
- **D.** Only through `sudo`, since plain root access still respects file modes — `sudo` sets an override flag on the process that a direct root login does not carry

### 50.

A spreadsheet carries the label 'Public' under the company's classification scheme, but one of its columns holds employees' home addresses and dates of birth. Which statement correctly separates the two questions this raises?

- **A.** Because the column is PII, the label is necessarily wrong and must always read 'Restricted', since any presence of personal data forces the highest available classification tier.
- **B.** The label is a policy decision the organisation can revise; whether the data is PII is a fact about the content, true regardless of what label the file carries.
- **C.** The label question and the PII question are the same question asked twice, since classification schemes exist to flag files containing personal data.
- **D.** Neither question matters until the file actually leaves the organisation, since legal obligations attach only on export.

### 51.

Are 'GUI vs CLI' and 'shell vs terminal' the same distinction asked two different ways?

- **A.** Yes — a shell is simply treated as the CLI equivalent of a GUI, so comparing shell to terminal is really the same comparison stated again in different words entirely.
- **B.** No. GUI vs CLI names the interface paradigm as a whole, graphical or text-based; shell and terminal are both specifically components on the CLI side of that split.
- **C.** No, but only because GUIs never involve a terminal of any kind whatsoever, under any circumstances.
- **D.** Yes, since both comparisons ultimately ask whether the interface requires its own dedicated display server to run.

### 52.

A newly created swap partition has been prepared but `swapon --show` lists nothing active, and `swapon /dev/sdb2` reports an error. What step was most likely skipped?

- **A.** The partition needs to be formatted with `mkfs -t ext4` before it can be used as swap
- **B.** `mkswap` was never run on the device, so it has no swap signature for `swapon` to activate
- **C.** An `/etc/fstab` entry must exist before `swapon` will activate any device at all
- **D.** The partition must first be added to a volume group before it can hold swap — `mkswap` refuses to write its signature to anything that is not a logical volume

### 53.

A database server is at 40% CPU utilisation, but its disk queue is deep, with requests waiting well before they are served. Which resource is the bottleneck, and what distinguishes it from the CPU figure?

- **A.** The CPU, since 40% utilisation is already the highest reported number in the scenario.
- **B.** Neither — the bottleneck must be network, since that is the resource most often saturated in cloud deployments generally.
- **C.** The disk; saturation, not utilisation, is what identifies the constraint, and the deep queue shows work is waiting on the disk specifically.
- **D.** Both equally, since CPU and disk always saturate together on any single server.

### 54.

A checkout must debit stock and record payment together, or do neither, and finance later queries orders joined against customers and products in combinations nobody anticipated. A colleague proposes a wide-column NoSQL store because 'NoSQL scales better.' What actually discriminates this choice?

- **A.** Scale alone — NoSQL is simply the faster choice once a workload's volume grows large enough to matter, regardless of whether the data being stored has any relationships that need enforcing.
- **B.** Neither store — only a message queue between the two steps can guarantee the debit and payment happen together.
- **C.** It makes no real difference either way, since several NoSQL products now offer transactions of their own too.
- **D.** The all-or-nothing multi-table update and the unpredictable joins — a relational database enforces the schema and performs the joins this workload needs.

### 55.

A server needs to boot into a minimal, non-graphical state permanently from now on, not just for the next boot. Which command sets that as the standing default?

- **A.** `systemctl isolate multi-user.target`, since isolating a target makes it the new default
- **B.** `systemctl set-default multi-user.target`, rewriting the standing default target
- **C.** `systemctl get-default multi-user.target`, since it sets the target it is given
- **D.** `runlevel 3`, the SysV-era equivalent of the same request

### 56.

A developer edits two tracked files and creates one brand-new file, then runs `git commit -a -m "Update config"`. Which files end up in the new commit?

- **A.** Only the two edited tracked files, because `-a` auto-stages modifications and deletions of files Git already tracks and never adds a new untracked file.
- **B.** All three files, since `-a` is defined to stage every change in the working directory, tracked or not, before the commit is created
- **C.** None of them, because `git commit -a` requires a prior `git add` for every file named in the commit, including files that were never tracked before this session began.
- **D.** Just the new file, since `-a` is meant to catch anything not yet under version control

### 57.

Which of the three techniques is the only one that is genuinely one-way, with no additional information anywhere that could reverse it?

- **A.** Pseudonymization — GDPR Article 4(5) requires the additional information needed to re-attribute the data to be destroyed immediately after use.
- **B.** Masking — hiding a value in a display permanently alters the underlying database record.
- **C.** Anonymization, which removes the association between the data and the data subject outright, unlike masking or pseudonymization.
- **D.** Anonymization, but only for data that was never PII in the first place.

### 58.

A monitoring dashboard shows both 'RAM usage' and 'disk usage' climbing together and a teammate assumes they must be the same underlying resource. What single property actually separates them?

- **A.** Nothing meaningfully separates the two — both simply hold data the system needs, so 'usage' means exactly the same thing for either one regardless of context or how it is measured.
- **B.** RAM is managed by the kernel while storage devices are managed entirely by user-space drivers instead of the kernel.
- **C.** Volatility and access pattern: RAM is volatile and byte-addressable, cleared on power loss; storage devices are persistent and block-addressable through a filesystem and driver.
- **D.** Storage devices are addressed through system calls while RAM is addressed without any kernel involvement at all in the process.

### 59.

A dashboard alerts when CPU utilisation crosses a threshold someone configured last quarter. A separate practice lets an engineer, faced with an unfamiliar failure nobody predicted, reconstruct what happened by correlating logs, metrics and traces. Which of the two is monitoring, and what can it not do that the other can?

- **A.** The second is monitoring, since correlating multiple signal types is simply a more advanced form of threshold alerting — reversing which practice requires the question to be known in advance and which one exists precisely because it cannot always be.
- **B.** The first is monitoring — it answers a question chosen in advance; it cannot answer a question nobody thought to ask, which is what the second practice, observability, is built for.
- **C.** Both are the same practice under different names, since both ultimately rely on numeric time-series data.
- **D.** Neither, because both are simply names for a dashboard, and any dashboard showing logs beside metrics already delivers everything either practice offers.

### 60.

How do the structured troubleshooting method and narrowing scope differ, once both are in play on the same fault?

- **A.** Narrowing scope also ends with a verified, documented fix, so the two are interchangeable in practice.
- **B.** The method requires reproducing the fault before anything else can happen, and narrowing scope becomes entirely optional once reproduction has already succeeded.
- **C.** The method is the whole ordered procedure from identification through documentation; narrowing scope is one technique used inside its early steps.
- **D.** Narrowing scope applies to every fault as a discipline, while the method applies only when the blast radius is already unclear.

