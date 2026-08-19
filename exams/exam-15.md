<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 15

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-15-answers.md](exam-15-answers.md)

---

### 1.

A file server replicates every write to a second machine in another rack. An operator deletes a directory by mistake, and the deletion appears on the second machine within seconds. Which safeguard was missing?

- **A.** More replication targets, so at least one copy escapes the deletion.
- **B.** A backup, an independent copy from which the deleted directory can be restored.
- **C.** A RAID array, so the directory survives the loss of any single disk.
- **D.** Nothing — replication to a second machine is a backup.

### 2.

Can a resource tag act as an isolation boundary between two teams' workloads in the same account?

- **A.** Yes — tagging resources by team is a recognised way to isolate them from each other.
- **B.** No — a tag can be used as a condition in an access policy, but the isolation boundary itself is an account, subscription or project.
- **C.** Yes, provided the tag is combined with a least-privilege policy that denies cross-team access by default.
- **D.** No, because only a virtual private cloud boundary, and nothing else, can separate two teams' workloads.

### 3.

A task asks to print the third whitespace-separated column of a report where the columns are separated by a ragged, variable number of spaces. Comparing awk against sed for this job, which is the right tool, and why?

- **A.** sed, because its substitution syntax can target any column position directly
- **B.** Either works identically, since both are line-oriented text tools that read one line of input at a time and write one line of output
- **C.** awk, because it splits each line into fields and a run of whitespace is its default separator
- **D.** `cut`, because it always handles variable-width columns as easily as fixed-width ones

### 4.

A checkout form has a marketing-communications box pre-ticked by default, and a user completes the purchase without unticking it. Has the user given valid consent as GDPR itself defines consent?

- **A.** Yes, completing the purchase without going back to untick the box is itself an unambiguous affirmative action by which the user signified clear agreement to the marketing processing.
- **B.** Yes, because contract is one of the six lawful bases and this processing occurred during a contractual transaction.
- **C.** No, but only because the checkout form failed to name a supervisory authority the user could contact.
- **D.** No, GDPR defines consent as a freely given, specific, informed and unambiguous indication signified by a statement or a clear affirmative action, and a pre-ticked box is neither.

### 5.

A Dockerfile has, in order, `FROM`, `COPY`, `RUN`, `ENV`, `WORKDIR`, and `CMD`. Which of these instructions add a filesystem layer?

- **A.** `COPY`, `RUN`, and `WORKDIR`, because each changes the filesystem, and `WORKDIR` creates its directory when it is missing.
- **B.** `COPY` and `RUN` only, since every other instruction in the list is purely descriptive metadata with no filesystem effect at all.
- **C.** `FROM`, `ENV`, and `CMD`, because they configure the image and configuration is what layers exist to record.
- **D.** All six instructions, since every line in a Dockerfile is executed in order and caches its own result as a layer.

### 6.

A shipped product combines only licences that are fully compatible with each other. Does that fact alone guarantee the product is compliant?

- **A.** Yes, since compatibility and compliance both refer to the same question of whether the combination is legally permitted.
- **B.** No. Compatibility asks whether the combination was legally permitted at all; compliance separately asks whether the obligations that combination triggered, such as notices and source offers, were actually discharged before shipping.
- **C.** Yes, provided the shipped artifact also includes a Software Bill of Materials listing every component it contains.
- **D.** Yes, because a compatible combination automatically satisfies every component licence's own notice, attribution, and source-offer requirements as an automatic side effect of the components being legally combinable in the first place.

### 7.

Backup tapes are stored in a fireproof safe in the same building as the servers. Which requirement remains unmet?

- **A.** Off-site storage, because one physical event could still destroy both.
- **B.** Media diversity, because tape is a single medium.
- **C.** Restore testing, because the tapes have not been read back.
- **D.** Retention, because a safe does not enforce an expiry schedule.

### 8.

A team completes a well-architected review of a production workload. What does the review actually produce?

- **A.** A prioritised list of findings and tradeoffs across the pillars, making it an improvement exercise rather than a pass/fail audit or a certification.
- **B.** A pass/fail certification the team can display publicly, since the review is understood to check strict compliance against each of the named pillars in turn.
- **C.** A revised recovery time objective for the workload's disaster recovery plan.
- **D.** A signed attestation that the workload meets its service level agreement.

### 9.

A service states a four-hour recovery point objective and a one-hour recovery time objective. What do those two figures constrain?

- **A.** Service must be back within four hours, and at most one hour of data may be lost.
- **B.** Backups run every four hours and drills run hourly.
- **C.** The system tolerates four hours of downtime a year at one-hour granularity.
- **D.** At most four hours of data may be lost, and service must be back within one hour.

### 10.

Comparing `sort -u names.txt` with `uniq -u`, both of which mention "unique," do they select the same lines?

- **A.** Yes — both produce the same output whenever the input is sorted first, because sorting is the only thing that separates discarding duplicates from discarding lines that repeated
- **B.** Yes, but only `uniq -u` also produces a count of how many times each line appeared
- **C.** No — `sort -u` keeps one copy of every distinct line; `uniq -u` keeps only lines that never repeated at all
- **D.** No — `sort -u` requires piping through `uniq` first before it can run at all

### 11.

A company hosts its EU customer database in a Frankfurt data centre and tells its auditors this permanently settles GDPR's rules on where the data may go. What has it overlooked?

- **A.** Nothing; GDPR requires that personal data physically remain within the European Union at all times once collected.
- **B.** That hosting location is irrelevant, since GDPR, like PCI-DSS, is really just a contractual standard rather than a statute and never itself governs where data may be kept.
- **C.** That EU residency is not a general requirement GDPR imposes; the rules restrict transfers to third countries, and a lawful transfer mechanism still permits the data to leave later.
- **D.** That residency and sovereignty are the same fact, so choosing an EU region also fixes which legal system ultimately governs the data.

### 12.

A stale `/etc/hosts` entry sends every application on a host to the wrong server, but `dig` for the same name returns the correct address. Which command reproduces what the applications actually see, and why does `dig` disagree?

- **A.** `dig` reproduces the application's view correctly, and the disagreement means `/etc/hosts` is being silently ignored by the operating system entirely.
- **B.** `nslookup` reproduces the application's view, since it is the one DNS tool that is defined to consult `/etc/hosts` before querying a nameserver.
- **C.** `host` reproduces the application's view, since its terse output format is specifically designed to reflect the nsswitch resolution order.
- **D.** `getent hosts` reproduces the application's view, because it walks the same name service switch applications use, including `/etc/hosts`; `dig` bypasses the switch entirely and queries a nameserver directly.

### 13.

A frontend calls a backend by directly recording one of its pod IP addresses. After a routine redeploy, the frontend cannot reach the backend at all. What is the fix, and why does it hold up across future redeploys?

- **A.** Address the backend through a Kubernetes service instead, since it tracks the current set of matching, ready pods automatically and gives callers one address that never changes.
- **B.** Pin the backend's Deployment to always reuse the exact same pod IP address on every redeploy, so recording it once remains valid.
- **C.** Reduce the backend's replica count to exactly one, since a single-replica Deployment is guaranteed to keep the same pod IP forever, treating replica count as if it controlled address stability.
- **D.** Mount a shared volume between the frontend and backend so the address can be read from a file instead of hardcoded.

### 14.

A queue-driven worker fleet processes jobs that can be safely re-queued if interrupted. Behind it sits a 24/7 primary database that needs a steady, predictable baseline for at least two years. Which pairing of purchase option to workload is correct?

- **A.** On-demand for both, since neither workload's cost can be estimated in advance without it.
- **B.** Reserved for the worker fleet, since a term commitment guarantees the cheapest price regardless of interruption risk.
- **C.** Spot for the worker fleet, and reserved for the database's steady baseline.
- **D.** Spot for both, since spot is simply a smaller, rightsized version of on-demand capacity.

### 15.

An `ls -l` listing shows a file's timestamp column, and an operator wants that same value to be the file's access time rather than its default meaning. Which option produces that?

- **A.** `ls -lc`, which shows `atime` because `c` stands for "current access"
- **B.** `ls -lu`, which shows `atime` in place of the default `mtime`
- **C.** Plain `ls -l`, since the timestamp column already defaults to access time
- **D.** `stat -f`, since it reports on the filesystem rather than an individual file

### 16.

A redistributor ships a modified BSD-3-Clause utility and, in the product's marketing materials, names the original author's company as an official partner to help promote the product. Which clause does this violate?

- **A.** Section 4's NOTICE-file propagation requirement, since the marketing materials never reproduced an upstream NOTICE file's attributions.
- **B.** The non-endorsement clause: using the copyright holder's or contributors' names to endorse a derived product without specific prior written permission is exactly what BSD-3-Clause's third clause forbids.
- **C.** None — BSD-3-Clause has no restriction on how a redistributor markets a derived product, only on copying the underlying code itself.
- **D.** The requirement that any derived product be licensed under terms compatible with the original before it may be sold commercially.

### 17.

A junior admin captures traffic and needs to say which address type — IPv4, IPv6 or MAC — survives unchanged all the way from client to server across several routers. Which one is it, and why do the others not qualify?

- **A.** The MAC address — since it is the permanent hardware identifier, it must be the one that is preserved across every hop of the path in every configuration seen in practice.
- **B.** IPv6 only — IPv4 addresses are rewritten hop by hop the same way MAC addresses are, which is why IPv6 was introduced.
- **C.** None of the three; a separate connection identifier assigned by each router is what actually survives the whole path.
- **D.** The IP address (IPv4 or IPv6), which identifies the internetwork endpoint and is preserved end to end, while the MAC address is rewritten at every routed hop.

### 18.

A firewall rule and a network configuration file were both written against `eth0` on a server that has since been moved to hardware using predictable interface naming. Deploying the same configuration now fails silently. Why?

- **A.** On a predictable-naming system there is usually no interface literally named `eth0`; the configuration should be written against whatever `ip link` actually shows, such as `enp0s3`, not the old detection-ordered name.
- **B.** The configuration fails because `eth0` is a reserved name that can never be assigned to any interface on any Linux system, predictable naming or not.
- **C.** The configuration fails because moving hardware always regenerates the MAC address of every interface, invalidating any rule written against a specific interface name.
- **D.** The configuration fails because `net.ifnames=0` must have been silently enabled by the move, which is defined to always disable every previously working interface reference.

### 19.

A team ships a product that bundles an MIT-licensed library but strips the library's copyright and permission notice out of the redistributed copy. Which obligation has been broken?

- **A.** None, since MIT-licensed code carries no conditions at all once it has been redistributed to anyone else.
- **B.** The GPL's copyleft requirement to make corresponding source available to recipients of the distributed derivative.
- **C.** Apache 2.0's requirement to mark any changed file with a prominent notice stating that it was modified.
- **D.** MIT's sole condition, that the copyright notice and the permission notice be included in all copies or substantial portions of the software.

### 20.

A comparison sets a monthly cloud bill against an on-premises server's purchase price alone, and concludes cloud is more expensive. What is missing from the on-premises side of that comparison?

- **A.** Nothing — CapEx and OpEx figures are already directly comparable numbers.
- **B.** Staffing, power and cooling, floor space, and the hardware-refresh cost that a bare purchase price omits.
- **C.** A budget threshold that would have flagged the discrepancy automatically.
- **D.** Nothing is missing at all; a server's purchase price already represents the entire cost of owning and running it.

### 21.

A colleague insists a directory holds several configuration files, but plain `ls` on that directory prints nothing at all. What is the most likely explanation, and how would you confirm it?

- **A.** The directory has been corrupted and needs `fsck` before it can be listed
- **B.** The colleague is looking at a different host, so the discrepancy is expected
- **C.** Plain `ls` requires `-l` before it will print any entries at all
- **D.** The files are dotfiles; `ls -la` would reveal them along with `.` and `..`

### 22.

An organisation removes the manual approval step from its delivery pipeline, so every passing change now reaches production unattended. Its automated test suite covers only unit-level behaviour. What does this scenario describe?

- **A.** A fault, because continuous deployment is normally paired with comprehensive automated testing and progressive rollout, since nothing else stands between a defect and users once the gate is gone.
- **B.** Continuous delivery, since removing a single approval step from the pipeline is still consistent with the release waiting on a human decision made somewhere else in the organisation's approval chain before anything reaches users.
- **C.** A safe practice, provided the team has documented its rollback procedure somewhere for later reference.
- **D.** Continuous integration, because the stated risk concerns test coverage rather than anything about deployment.

### 23.

A firewall rule needs to be written in dotted-decimal notation, but `ip addr` reports the host as `10.20.30.5/26`. What is the equivalent dotted-decimal mask?

- **A.** 255.255.255.128 — since /26 is one step past /25 in the sequence, the mask must also be one step past 128 in that octet.
- **B.** 255.255.252.0 — the prefix number 26 sets the network boundary inside the third octet, leaving the whole last octet free for host addressing.
- **C.** 255.255.255.224 — the mask value that corresponds to a /27 prefix rather than the /26 actually shown.
- **D.** A /26 leaves 6 host bits, so the mask sets the top two bits of the last octet, giving 192 there: 255.255.255.192.

### 24.

A platform team must place three workloads: a vendor appliance shipped only as a Windows disk image on an all-Linux estate; a stateless HTTP service redeployed forty times a day; and a workload processing another customer's regulated data where the strongest available isolation boundary is required. Match each to a container or a VM, and identify the one common thread underneath all three.

- **A.** All three should run as VMs, since a foreign OS kernel and strong isolation are both container limitations that only VMs solve, and a stateless service redeployed many times a day gains nothing measurable from a container's faster start or its higher density on one host.
- **B.** The appliance and the regulated workload need VMs, for a foreign kernel and the strongest isolation boundary respectively, while the HTTP service is a good fit for containers; underneath all three, even the containerised one, sits a hypervisor the platform team never manages directly.
- **C.** The HTTP service running in containers means no virtual machines are involved anywhere in this platform — a managed container service schedules containers straight onto bare-metal hosts the provider owns.
- **D.** The regulated workload should be containerised specifically because containers isolate more strongly than virtual machines, since one shared kernel enforces separation in a single place rather than across many guest kernels.

### 25.

A schedule line reads 'Runbook accepted — 2 weeks'. A reviewer flags it. What is wrong with calling that line a milestone, and how does the objection differ from a question about the triple constraint?

- **A.** The line is fine as a milestone; the real issue is that adding two weeks to it silently moved the schedule leg of the triple constraint without anyone formally agreeing to that trade-off in advance, which is a wholly separate kind of oversight from how the line happened to be labelled.
- **B.** Milestones cannot appear on a schedule at all — only bars with durations, as on a Gantt chart, are legitimate schedule entries.
- **C.** The label is correct, since 'accepted' items are always logged as milestones however long the acceptance activity takes.
- **D.** A milestone conventionally carries zero duration, so a two-week span is a task or phase mislabelled — the triple constraint, by contrast, is about trading scope, time and cost against each other, not sorting schedule items by type.

### 26.

A `traceroute -n` run shows three consecutive asterisks at hop 4, but the trace continues and completes successfully at hop 9. A colleague concludes hop 4's router is broken. Is that conclusion supported?

- **A.** No — asterisks mean a probe went unanswered, not that traffic stops there; routers routinely deprioritise or block their own ICMP replies while forwarding perfectly, and only the final hop failing indicates a broken path.
- **B.** Yes — any hop showing asterisks in a `traceroute` output is defined to indicate that specific router is broken and is dropping all traffic, not just probe replies.
- **C.** No, but only because the trace should have been re-run using ICMP probes with `-I` first, since UDP probes alone can never reveal this kind of intermediate-hop behaviour by default, because the UDP method discards every intermediate reply and reports only the final hop reached.
- **D.** Yes, but only because the trace completing at hop 9 must mean a completely different, redundant path was used that bypassed the broken hop 4 router entirely.

### 27.

Which statement correctly describes how PCI-DSS binds an organisation that stores, processes or transmits cardholder data?

- **A.** Through statute, since the handling of payment card data is regulated by legislation in the same way that the processing of personal data is regulated under GDPR across the Union and its member states.
- **B.** Through the same extraterritorial statutory mechanism as GDPR's Article 3, reaching any entity anywhere in the world that ever touches card data at all.
- **C.** Through certification by an accredited body, the same mechanism ISO 27001 uses to bind organisations to its requirements.
- **D.** Through the compliance programs run by the payment brands and the acquiring bank, whose discretion settles whether an entity must comply or validate at all, rather than through legislation.

### 28.

What does the shell's `if` construct actually evaluate: a boolean expression, or something else entirely?

- **A.** A boolean expression written directly inside the `if` keyword's own syntax
- **B.** The exit status of the command it is given, where 0 means true
- **C.** The value most recently assigned to `$?`, independent of what command runs next to `if`
- **D.** Whether the following block contains any executable statements at all

### 29.

Put the five stages of the boot process in order, from power-on to a running system.

- **A.** Bootloader, firmware, kernel, units, then PID 1 — on modern machines the bootloader is what loads the firmware into memory
- **B.** Firmware, kernel, bootloader, PID 1, then units — the kernel starts first and then invokes a bootloader to locate the root filesystem
- **C.** Firmware, bootloader, PID 1, kernel, then units
- **D.** Firmware, bootloader, kernel plus initramfs, PID 1 (the init system), then units until the default target

### 30.

An architecture team splits workloads across two public providers by running each application on a common container substrate with an orchestrator, so any workload could in principle run on either provider. What cost does this portability buy against, and what does it typically give up?

- **A.** It eliminates vendor lock-in entirely, since containers are portable by construction and carry their dependencies with them.
- **B.** It converts the architecture into a hybrid cloud, since workloads can move between the two platforms on demand.
- **C.** It spreads risk across providers, but tends to force a lowest-common-denominator architecture that gives up each provider's differentiated managed services.
- **D.** It removes the need for duplicated identity and monitoring tooling across the two providers, since the orchestrator supplies both.

### 31.

A staging environment runs a different network topology and a different configuration mechanism than production, though it does use a realistic dataset. What does this arrangement fail to achieve?

- **A.** It ends up testing a fourth environment nobody actually deploys to, since each rung on the ladder only works if it is genuinely closer to production than the one below it.
- **B.** Nothing important, because parity is a concern that belongs to developer laptops rather than to a shared staging environment.
- **C.** It fails to build once and deploy many, since a staging environment that differs from production in topology was clearly built separately from it.
- **D.** It succeeds at the goal, because using a realistic dataset is the one part of parity that genuinely matters here.

### 32.

List the six whitespace-separated fields of an `/etc/fstab` line, in order.

- **A.** Device, mount point, mount options, filesystem type, dump flag, and fsck pass order
- **B.** Device, mount point, filesystem type, owner, group, and permissions
- **C.** Device, mount point, filesystem type, mount options, dump flag, and fsck pass order
- **D.** UUID, label, device, mount point, options, and fsck pass order

### 33.

A script written and tested with GNU `sed -i 's/a/b/g' file` is later run unmodified on a macOS workstation, whose `sed` is a BSD build. What happens?

- **A.** It runs identically, since `-i` behaves the same across all `sed` implementations
- **B.** It fails, because BSD `sed` requires a backup suffix argument even when none is wanted, unlike GNU's optional suffix
- **C.** It silently skips the substitution but leaves the file otherwise untouched, because an unrecognised in-place flag is simply ignored rather than treated as an error
- **D.** It fails because BSD sed does not support the `s///g` substitution syntax at all

### 34.

A team downloads a checksum file from the same page and the same server as the software it is meant to verify, runs `sha256sum` with `-c` against it, and gets `OK`. Does that establish the download is authentic?

- **A.** No — a checksum from the same compromised source as the download proves only self-consistency; `gpg --verify` against a key obtained independently is what establishes origin.
- **B.** Yes, since an `OK` result from `sha256sum -c` proves both integrity and origin, because the digest is cryptographically bound to the file it describes.
- **C.** Yes, as long as the digest file was downloaded over an HTTPS connection, since transport encryption authenticates whoever served the digest.
- **D.** No, and the fix is to also run `md5sum` on the same file and compare the two results, since agreement between two algorithms would rule out tampering.

### 35.

Team A's services are versioned and deployed independently, each with its own datastore, reaching each other only over the network. Team B's services live in one shared codebase, ship in one release, and read and write one common database, though the code is split along clean module boundaries. Which team has microservices?

- **A.** Team B — its modules are already split along clean boundaries, which is what makes an architecture microservices.
- **B.** Team A, because independent deployment, network calls between services, and each service owning its data are the defining traits.
- **C.** Both — any system organised into services with clear boundaries qualifies, regardless of how it deploys, since module boundaries are what the term is really pointing at.
- **D.** Neither — microservices additionally require a message queue rather than direct network calls between services.

### 36.

Files copied onto a USB stick formatted vFAT come back with different Unix ownership and permission bits than they had on the source filesystem. Is this a `chmod` failure?

- **A.** Yes, `chmod` must have been run incorrectly before the files were copied — vFAT copies the source mode bits verbatim into each directory entry's attribute byte, so a bad source mode is what shows up afterwards
- **B.** No, but only because the FHS forbids storing permissions on removable media
- **C.** No — vFAT stores no Unix ownership or permission bits at all, so what is shown afterward comes entirely from the mount options
- **D.** Yes, and re-running `chown` and `chmod` on the USB stick will make the change permanent

### 37.

A service is deployed across three availability zones within one region for resilience. A regional-scale event takes out the entire region. Does the multi-AZ deployment protect against it?

- **A.** Yes — spreading across multiple availability zones is sufficient protection against any scale of outage, including a whole-region event.
- **B.** No — availability zones protect against the failure of one datacentre-scale location within a region, not against the loss of the region itself.
- **C.** Yes, because AWS automatically replicates all resources across regions by default, so a second copy of the workload is already running elsewhere.
- **D.** No, but only because the service should have used a hybrid cloud architecture instead of multiple zones, that being the arrangement which spans separate geographies.

### 38.

`df -h` reports a filesystem is only half full, but creating a new file on it fails with "No space left on device." What should be checked next, and why?

- **A.** `df -i`, since the filesystem may have exhausted its inode table while data blocks remain free
- **B.** Nothing further is needed; `df -h` already proves there is no real problem and the error is spurious
- **C.** `du -sh`, to find which directory is consuming the most space
- **D.** `ls -i`, to confirm two files are not accidentally hard-linked together

### 39.

A developer runs `git add .` to stage every change, then runs a bare `git diff` and it prints nothing. They conclude nothing changed. Are they right?

- **A.** Yes — `git diff` compares the working tree to the last commit, so empty output always means the files match HEAD exactly, whether or not anything was staged first with `git add` beforehand.
- **B.** No, but only because `git add .` silently failed to stage anything ignored by `.gitignore`
- **C.** No: a bare `git diff` compares the working tree with the index, and staging moved the changes into the index; `git diff --staged` compares the index with HEAD and would show them.
- **D.** Yes, because `git status` would have reported the same empty result if anything remained changed

### 40.

An operator needs to page back and forth through a multi-gigabyte log file without flooding the terminal and without waiting for the whole file to load first. Which tool is designed for that, and why does it start instantly?

- **A.** `less`, because it reads lazily and only loads what it currently displays
- **B.** `cat`, because concatenating the file to standard output is the fastest way to read it
- **C.** `head`, because showing only the first lines avoids reading the rest of the file
- **D.** `tail -f`, because following the file avoids ever loading its earlier contents

### 41.

A batch job runs continuously at high load for six hours a day, every day. A team considers moving it from a fixed-size PaaS instance to FaaS to save money. What is the risk in that plan?

- **A.** Under sustained high load, FaaS's per-invocation pricing can cost more than a continuously running instance sized for the same throughput.
- **B.** There is no risk, since serverless always eliminates cost when a workload is idle, and every workload is idle most of the day, batch jobs included.
- **C.** There is no risk, since FaaS and PaaS bill identically for continuous workloads of the same throughput.
- **D.** The risk is that FaaS cannot hold state between invocations, which this batch job requires in order to run at all.

### 42.

A decommissioned drive is deleted through the operating system's normal file deletion before leaving the building. Is that sufficient for secure disposal?

- **A.** Yes, since deleting a file through the operating system removes its data from the drive immediately, when ordinary deletion typically removes only the filesystem's pointer to the data and leaves the underlying bytes recoverable on the drive itself.
- **B.** No, because media that leaves the building is wiped or destroyed rather than merely deleted; ordinary deletion does not remove the underlying data.
- **C.** Yes, as long as the drive was also protected by full disk encryption while it was in service.
- **D.** This question only applies to backup tapes, not to drives removed from a server.

### 43.

What advantage does an LVM logical volume have over a plain disk partition, which is the reason it is worth recognising for this exam?

- **A.** It is faster than a plain partition for every kind of workload — the device-mapper layer coalesces I/O so that every access path is shorter than on a raw partition
- **B.** It automatically protects data against drive failure, the way RAID does
- **C.** It can be resized and can span more than one physical disk, which a plain partition cannot do
- **D.** It removes the need for a filesystem to be created on top of it

### 44.

A colleague says their laptop 'runs Linux' and separately that it 'runs GNU/Linux.' Are those two statements necessarily equivalent?

- **A.** Yes — the kernel is the only component that genuinely matters here, so any userland running on top of it counts as GNU regardless of where that userland actually came from or who originally wrote it.
- **B.** No, but only because GNU refers to a licensing status rather than an actual body of software anyone can point to.
- **C.** No. 'Linux' names the kernel alone and is always accurate wherever that kernel runs; 'GNU/Linux' names that kernel specifically paired with a GNU userland, which not every Linux system has.
- **D.** Yes, since the Linux Foundation requires every certified Linux distribution to ship a GNU userland as a condition of certification.

### 45.

A junior engineer runs `UPDATE orders SET status = 'cancelled';` against production with no WHERE clause. What has just happened, and which statement would have changed nothing if run the same way?

- **A.** Only the most recently inserted row was updated; a bare `DELETE` run the same way would have changed nothing.
- **B.** Every row in the table was updated to 'cancelled'; a bare `SELECT` run the same way would have changed nothing.
- **C.** Nothing, because PostgreSQL requires a WHERE clause on UPDATE by default.
- **D.** Every row was updated, and adding a `JOIN` clause would have prevented it.

### 46.

A team runs `apt upgrade -y` on every server the moment any update becomes available, with no staging tier and no rollback plan. Are they practicing patch management?

- **A.** Yes, applying updates the moment they appear is the definition of good patch management
- **B.** No, because patch management applies only to security updates, not general package upgrades
- **C.** Yes, provided the updates are also logged somewhere after they are applied — that record is what turns ad-hoc updating into managed patching
- **D.** No — patch management is the surrounding discipline (inventory, testing, scheduled rollout, rollback), not merely running an update command

### 47.

A failed instance must be replaced without waiting for any DNS record to update and re-cache, and without putting any additional network component in front of it. Which mechanism satisfies that?

- **A.** DNS failover, since it is designed to route around a failed resource automatically.
- **B.** A layer 4 load balancer placed in front of the instance.
- **C.** A reserved static address remapped to the replacement instance; the address itself does not change, so no client has to learn anything new.
- **D.** An ephemeral address reassigned to the new instance, since ephemeral addresses are the simplest option and require no quota-limited reservation to be made in advance.

### 48.

After checking out a specific commit hash directly instead of a branch name, `git status` reports "HEAD detached." What does that phrase mean HEAD is now pointing at?

- **A.** The single newest commit in the entire repository, regardless of which branch it is on
- **B.** A newly created branch that Git names automatically after the detach
- **C.** The commit itself, directly by its hash, with no branch name carrying it forward as new commits are made.
- **D.** The remote-tracking branch for `origin`, since detaching disconnects HEAD from the local branches only and reattaches it to the nearest remote-tracking ref instead.

### 49.

A package released an hour ago is reported by the package manager as having "no installation candidate," even though it is confirmed to exist. What is the most likely explanation?

- **A.** The package genuinely does not exist yet, despite what was confirmed — `apt` queries the configured repositories live at install time
- **B.** The package's dependencies cannot be resolved, which is unrelated to the index
- **C.** The locally cached repository index is stale and has not been refreshed since the package was published
- **D.** The local package database has become corrupted and needs to be rebuilt

### 50.

A scanner finds a known weakness in a container's base image before it is ever deployed. Once that same image is running in production, what job does the scanner still not do that an IDPS does instead?

- **A.** Reporting the severity of the weakness it already found in the base image, which is already what a vulnerability scan reports through its matched database entries rather than the live-activity gap the question is asking about.
- **B.** Verifying the checksum of the base image against the publisher's signed digest.
- **C.** Detecting an attack actually happening against the running container in real time.
- **D.** Confining what the container process may do even if it is compromised.

### 51.

A user wants to confirm, from inside their current session, which program is configured as their login shell. Which command reports it?

- **A.** `echo $PATH`, which lists the shell's search directories including the one holding the shell binary.
- **B.** `lsblk`, which lists the block devices the shell's history file is stored on.
- **C.** `echo $0`, which prints the name of the shell program the user is talking to at this prompt.
- **D.** `echo $SHELL`, which prints the shell variable holding the user's configured login shell.

### 52.

Why can an ordinary, unprivileged user successfully run `passwd` to change their own password, when `passwd` needs to write to `/etc/shadow`, which the user cannot open directly?

- **A.** `passwd` carries the set-user-ID bit, so it runs with the file owner's (root's) privileges rather than the caller's
- **B.** The user's real UID temporarily becomes root's for the duration of the command — the kernel restores the caller's original real UID once `passwd` exits
- **C.** `passwd` carries the set-group-ID bit, running with the group `shadow`'s privileges
- **D.** The user is temporarily added to the `sudoers` file for the duration of the command

### 53.

A requirement calls for blocking one specific malicious IP address from reaching every instance in a subnet, while allowing everything else. Which AWS layer can express that on its own, and which cannot?

- **A.** A security group can, since security group rules can be set to either allow or deny.
- **B.** A network ACL can, because it supports explicit deny rules; a security group cannot, because it carries allow rules only.
- **C.** Neither — blocking one address always requires a host-level firewall rule inside the operating system instead, since neither cloud filtering layer is treated as capable of an explicit deny.
- **D.** Neither — the subnet would need to be reclassified as private to block the address.

### 54.

Users get logged out at random after a second application instance is added behind a load balancer, because each instance holds session data only in its own memory. A quick fix pins each user to the instance that logged them in. RFC 9110 describes HTTP as a stateless protocol whose requests can be understood in isolation. What does the sticky-session fix actually change?

- **A.** Nothing about statelessness — it works around a stateful application by routing consistently, but the session still dies if that instance is redeployed or lost.
- **B.** It makes the application stateless, since the load balancer now handles routing consistently.
- **C.** It satisfies the same requirement a cache would, since both exist to keep repeat requests answered quickly.
- **D.** It moves the application's REST interface to a stateful style, since REST normally requires statelessness.

### 55.

A reported permission fault will not reproduce when you run the same command as root. What does that success establish?

- **A.** That the fault is fixed, since the reproduction attempt succeeded.
- **B.** That the file's mode, ownership, and every parent directory along the path must already be correct and fully permissive for the reporting user.
- **C.** Nothing about the reported fault; root is exempt from the ordinary mode checks, so the failing condition was never exercised.
- **D.** That the issue can be escalated as resolved, since it did not recur under test.

### 56.

A five-person team keeps its infrastructure-as-code in Git and separately runs a nightly `tar` archive of the same server to an offsite host. Someone asks why both exist, since Git already keeps every version of the code. What is the accurate answer?

- **A.** Git records author-initiated snapshots of files someone is actively editing; the nightly archive is a scheduled, independent copy meant to let the whole server be restored after loss.
- **B.** Git already backs up the whole server, so the nightly archive is redundant and can be dropped once everyone trusts the repository and code review to catch mistakes before they ever reach production.
- **C.** Switching the team to a centralized system like Subversion would let one server hold both roles at once.
- **D.** Routing server changes through a change-management approval step would make the archive unnecessary.

### 57.

Which technique below is reversible only by whoever holds a secret key, as opposed to being either irreversible or reversible by anyone with no key at all?

- **A.** Hashing — the digest can be reversed by anyone who runs the same one-way function again, since no secret is involved anywhere in the process.
- **B.** Encryption, since recovering the original value requires the key, and without it the ciphertext does not yield the plaintext.
- **C.** Base64 encoding — some systems describe it as encoding 'for security', though reversing it needs no key at all and any observer can decode it on sight.
- **D.** A salted hash, since adding a key-encrypting key to the salt makes the resulting digest reversible for anyone who also knows that outer key.

### 58.

A shell script written and tested on Linux mostly works unmodified on another Unix-like system. What property of Linux explains that portability?

- **A.** The GPLv2 license under which the kernel is released is what guarantees behavioural compatibility across every Unix-like system.
- **B.** Every Unix-like system runs the same underlying kernel, so scripts naturally behave identically everywhere.
- **C.** Shell scripts are portable by nature and would run the same on any operating system regardless of any standard at all.
- **D.** Linux is Unix-like and largely POSIX-conformant, and that conformance is why skills and scripts port across Unix-like systems.

### 59.

A batch job processes one large file start to finish on a single thread; nothing about the work can be split across machines. A team proposes adding ten more instances behind a load balancer to speed it up. What happens?

- **A.** The job finishes proportionally faster, since more instances behind a load balancer always raises throughput regardless of what the work looks like.
- **B.** The job becomes highly available, since ten instances remove any single point of failure in the pipeline.
- **C.** The job becomes elastic, since instances were added automatically in response to the workload.
- **D.** Nothing measurable; the extra instances sit idle, because the job's constraint is a single non-divisible thread of work that a load balancer cannot spread.

### 60.

`systemctl status` on a unit shows `Active: failed (Result: exit-code)` with a non-zero status. What does that state rule out, and where is the daemon's own message?

- **A.** It confirms an OOM kill happened, since the process is no longer running and something must have terminated it against its will.
- **B.** It confirms a permissions problem on the unit's data directory or one of its configuration files somewhere along the path.
- **C.** It confirms the listening port is already bound by another process, most likely a previous instance of the same daemon.
- **D.** It rules out a signal or OOM kill, since those leave the unit in a `signal` or `oom-kill` failed state instead; the message is in `journalctl -u` for this unit.

