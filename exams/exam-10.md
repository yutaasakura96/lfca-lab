<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 10

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-10-answers.md](exam-10-answers.md)

---

### 1.

A host has two hundred recorded changes in its history but no single document stating what the host currently runs or why. What is missing?

- **A.** Additional change records covering the gaps in the history, which still requires reconstructing the current state from that history.
- **B.** A runbook for restoring the host after a failure, which instructs what to do rather than describing what the host currently runs.
- **C.** Nothing — a complete change history is equivalent to documentation, since every past change is already recorded somewhere within it.
- **D.** Documentation, since reconstructing current state from a change history is exactly the work it exists to save.

### 2.

A team assumes 'the provider backs it up' satisfies their backup obligation for a managed database service. What does that assumption misread?

- **A.** Nothing — managed services back up customer data automatically as part of the service, so no further action is needed.
- **B.** The shared responsibility model — the durability of the storage service is the provider's, but the retention policy and the restore capability are the customer's.
- **C.** The distinction between replication and backup, since the provider's built-in redundancy is a replica, not a backup.
- **D.** The provider's autoscaling policy, which is what actually determines how much data is retained.

### 3.

One account has `rm` aliased to `rm -i` in its `~/.bashrc`; a server account does not. The same typed `rm somefile` command behaves differently on each. Which command reveals that an alias, rather than the plain binary, is actually running?

- **A.** `type rm`, which distinguishes an alias from a function, a builtin, or a file on `PATH`
- **B.** `which rm`, since it reports the exact command that will execute, the same way it reports any other name found on `PATH`
- **C.** `man rm`, since the man page documents any locally defined aliases
- **D.** `history | grep rm`, since a past invocation would reveal the alias definition

### 4.

A payroll system retains statutory tax records for the legally required period, and a former employee submits a GDPR erasure request covering those same records. How is this resolved?

- **A.** The erasure request must be honoured in full immediately, since GDPR's erasure right overrides any other obligation the organisation may have.
- **B.** The records must be destroyed immediately once the employee's last working day arrives, since the organisation's own retention-and-disposal practice requires deleting data as soon as its purpose has ended for good.
- **C.** The retention obligation is void because the organisation's own internal policy states that data should be deleted once it is no longer actively used.
- **D.** Neither rule wins outright: Article 17(3) disapplies erasure to the extent processing is necessary for a legal retention obligation, so the covered records are kept and everything outside that carve-out is erased.

### 5.

A registry credential is passed into a build with `ARG`, and a later Dockerfile instruction unsets the variable before the image is finished. Is the credential safe once the build completes?

- **A.** No, it is still present in the layer where it was written, and unsetting it later does not erase it; it must never enter a layer in the first place.
- **B.** Yes, because unsetting a build argument removes that value from every layer of the finished image, not only from the single layer in which the value was last read during the build.
- **C.** Yes, but only if the base image was pinned to a specific version rather than left unpinned.
- **D.** It depends on whether the credential was also set with `ENV` in addition to `ARG`, since only `ENV` values persist in layers.

### 6.

A specification statement reads: 'The system shall provide flexible reporting and support various export formats.' Why can no test settle whether the delivered system meets it?

- **A.** The sentence is fine; 'flexible' is a legitimate non-functional attribute in the same family as availability or performance.
- **B.** The sentence cannot be traced to a test case, which is the only defect present.
- **C.** Nothing is wrong with it — any sentence phrased as a 'shall' statement is testable by virtue of that phrasing.
- **D.** It is ambiguous and unverifiable as written: 'flexible' has no measurable meaning, and it bundles two requirements into a single statement.

### 7.

A low-severity alert fires every few minutes for a condition that needs no action, until the on-call channel mutes all notifications from it. A real outage is later missed. What failed?

- **A.** The runbook for the outage was never written, leaving nobody with a step-by-step procedure to follow once the outage was noticed.
- **B.** The outage happened outside an agreed maintenance window, so the disruption itself was never pre-agreed with the people it affected.
- **C.** Escalation — the notification reached an unstaffed channel, so nobody was ever in a position to see it fire in the first place.
- **D.** Alert quality — a condition that needed no action trained people to ignore the channel, so the next real alert was dismissed too.

### 8.

A workload idles at 5% CPU on an oversized instance type. The team responds by adding autoscaling to handle peak load, without first correcting the instance size. What does that purchase them?

- **A.** Lower total cost, since autoscaling automatically shrinks instance size as well as instance count during quiet periods.
- **B.** A lower hourly rate, since adding autoscaling automatically qualifies the workload for reserved or committed-use pricing.
- **C.** A higher measured utilisation figure, because spreading the same load across more instances raises the per-instance CPU percentage that the report shows.
- **D.** More idle capacity at a higher cost for the same useful work, because scaling multiplies the number of units and every added unit carries the same waste the first one did.

### 9.

A departing employee's Unix login account is disabled the same day they leave. Is offboarding complete?

- **A.** Yes — disabling the primary login account revokes everything that identity could do, since no other credential is able to outlive that one account.
- **B.** Yes — least privilege already limited what that account could reach, so nothing further needs to be revoked once the person departs.
- **C.** No. SSH keys, API tokens, VPN certificates, third-party accounts and shared secrets typically survive the disabling of that one account.
- **D.** No — the account must first be added to the asset inventory, before any credential attached to the departing employee can be revoked.

### 10.

`echo` does not read standard input. Given that, how can a value produced by another command still become an argument to `echo`?

- **A.** A pipe, since piping works regardless of whether the receiving command reads standard input
- **B.** Command substitution, since it turns a command's output into an argument rather than feeding it as input
- **C.** Redirection with `<`, since it feeds a value directly into any command's arguments the same way a pipe feeds standard input
- **D.** There is no way to do this; `echo` can only ever print literal text typed after it

### 11.

A company selects a cloud region in Ireland to host its EU customer data and considers the question of where the data's legal system sits fully settled. What has it actually settled?

- **A.** Both residency and sovereignty; choosing an EU region automatically resolves which legal system governs the data.
- **B.** Neither, since GDPR requires a specific derogation before any EU region may lawfully be used to host personal data belonging to residents at all.
- **C.** Residency, where the data physically sits, but not necessarily sovereignty, which also depends on whose law the operator itself answers to.
- **D.** Retention, since choosing a region also fixes how long the data may lawfully be kept.

### 12.

Moving from a hot site to a cold site has which pair of effects?

- **A.** Cost falls and recovery time falls.
- **B.** Cost rises and recovery time falls.
- **C.** Cost falls and recovery time rises.
- **D.** Cost is unchanged and only tolerable data loss rises.

### 13.

A project's Compose file defines a web service, a worker service, and a shared database, and `docker compose up -d` is run. What creates, and in what relationship?

- **A.** It distributes the three services across whichever machines in the local network have spare capacity, balancing the load automatically.
- **B.** It only creates the containers, leaving the operator to run `docker volume create` and attach each declared mount by hand afterwards for everything else the Compose file happens to describe.
- **C.** It builds fresh images for all three services from their Dockerfiles every time, regardless of whether anything changed.
- **D.** It creates the network, volumes, and containers for all three services on the single host where the command ran, starting anything they depend on as it goes, and detaches immediately.

### 14.

A monthly bill rises by 20 percent while the resource inventory stays completely unchanged: same instance count, same disks, same databases. What kind of explanation is monitoring's breakdown suited to find, that a simple resource count cannot?

- **A.** None — a rising bill against an unchanged inventory means a configured budget threshold must already have fired by now.
- **B.** A new orphaned resource must have appeared somewhere in the estate, since only orphans are known to raise a bill silently like this.
- **C.** More egress, more requests against the same database, an expired free-tier allowance, or a reservation ending its term — each raises the bill without changing the inventory.
- **D.** Nothing explains it; a rise in the bill always and only means a rise in the number of resources currently provisioned.

### 15.

A directory contains a file literally named `-r`, and a command needs to operate on it without the shell reading `-r` as an option. Which construct marks the end of options so a following operand starting with a hyphen is treated as a filename?

- **A.** Wrapping the filename in single quotes
- **B.** Escaping the leading hyphen with a backslash
- **C.** A standalone `--` placed before the filename
- **D.** Prefixing the filename with `./`

### 16.

Which pairing correctly separates the two everyday meanings of the word "fork" in open source work?

- **A.** A fork and a clone name the same operation; both create a server-side copy of a repository used to open a pull request.
- **B.** A platform fork requires a signed contributor licence agreement before it may be created, while a governance fork does not require one.
- **C.** A platform fork is a server-side repository copy made as the first step of an ordinary contribution that ends in a merge upstream; a governance fork is a permanent divergence with its own maintainers and releases.
- **D.** A governance fork can only occur with the original project's explicit written permission, since the licence does not grant the right to fork automatically.

### 17.

A DHCP server is unreachable when two brand-new machines boot onto the network for the first time. One is configured by hand with a static address; the other has a DHCP reservation waiting for it on the server. What is the difference in outcome?

- **A.** Both machines come up identically, since a reservation is functionally indistinguishable from a static address once it has been configured on the server, which pushes the address into the client's own persistent configuration.
- **B.** Neither machine comes up, since any DHCP server outage is defined to block every host on the network from initialising its networking at all.
- **C.** The reservation-based machine comes up regardless of the server, since a reservation is cached locally on the client the first time it is granted.
- **D.** The statically configured machine comes up regardless of the server; the reservation-based one gets nothing, because it is still a DHCP client with no lease of its own to fall back on.

### 18.

`hostname -f` fails on a host that clearly has a hostname configured, since `hostname` alone prints a value. What does the failure actually mean?

- **A.** It means the hostname configuration has been wiped and must be reconfigured from scratch using `hostnamectl set-hostname`.
- **B.** It means nothing resolves the short name to a qualified one (usually a missing `/etc/hosts` line), not that the hostname itself is unset.
- **C.** It means the host is not running systemd, since `hostname -f` is a systemd-only flag unavailable on non-systemd distributions.
- **D.** It means DHCP failed to issue an address to this host, since `hostname -f` is defined to depend on a successful DHCP lease being present across virtually every environment of this kind.

### 19.

A start-up ranks credential theft as its top risk during a review, then buys cyber-insurance covering breach-related costs. What has it just done?

- **A.** Mitigated the risk, since holding insurance reduces the likelihood that credential theft will actually occur.
- **B.** Nothing meaningful from a risk standpoint, since insurance is purely a financial product rather than a recognised risk response in its own right.
- **C.** Completed a fresh risk assessment, since buying insurance re-ranks the likelihood and impact of the underlying risk.
- **D.** Chosen a risk response, specifically transfer, which is a legitimate outcome distinct from the assessment that identified the risk.

### 20.

A monitoring system needs to read a log file under a strict low-latency requirement. The file currently sits in the archive tier. What must happen before it can be read?

- **A.** Nothing — cost monitoring will surface and satisfy the read request automatically the moment it is made.
- **B.** Nothing beyond paying the ordinary egress charge for reading the file back out to wherever it is needed.
- **C.** It must be rehydrated to an online tier first, a process measured in hours, so archive is unsuitable for this requirement regardless of price.
- **D.** It can be read immediately, just more slowly than from the hot tier.

### 21.

A nightly job needs to synchronise a large directory tree where only a small fraction changes each night. Comparing `scp` and `rsync` for this repeated task, which is preferred, and why?

- **A.** `scp`, because it authenticates faster than `rsync` on repeated connections
- **B.** `rsync`, because it compares both ends and transfers only the differences
- **C.** Either tool is equally efficient, since both ultimately use SSH as their transport
- **D.** `sftp`, because its interactive session caches previously transferred files

### 22.

A blue-green cutover switches all traffic to the new environment, and a defect that survived pre-switch testing is discovered ten minutes later. Both versions share one database, and the new version has already written to it. What happens to the promised near-instant rollback?

- **A.** It is lost, because switching traffic back does not undo the writes the new version already made against the shared database.
- **B.** It still holds, because rollback of the code and rollback of the underlying data are the same operation by definition.
- **C.** It still holds, since blue-green always keeps some percentage of users on the old version as a built-in fallback.
- **D.** It still holds regardless, because the old environment is retained and untouched no matter what the new version wrote while it was serving.

### 23.

A candidate needs the hardware address of `enp0s3`. Which iproute2 command is the layer 2 view of an interface, reporting the MAC in its `link/ether` field?

- **A.** `ip addr` with the `-6` flag added, since restricting the output to IPv6 is what makes the hardware address appear alongside the IPv6 addresses, which is the assumption most administrators start from.
- **B.** `ip link`, because the link object is the layer 2 view of an interface and reports the hardware address in its `link/ether` field, which `ip addr` also prints above the layer 3 addresses.
- **C.** `ip route`, since the routing table lists the hardware address of the interface associated with each configured route, alongside that route's destination and next hop.
- **D.** `ip neigh`, since the neighbour cache is the table where every local interface's own hardware address is recorded once that interface has been brought up.

### 24.

Which five properties does NIST SP 800-145 require before an environment counts as cloud computing?

- **A.** On-demand self-service, broad network access, multi-tenancy, rapid elasticity, and pay-as-you-go billing.
- **B.** On-demand self-service, virtualization, resource pooling, rapid elasticity, and high availability.
- **C.** Broad network access, resource pooling, rapid elasticity, measured service, and vendor neutrality.
- **D.** On-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service.

### 25.

A manager says: 'We hold a daily standup and a two-week sprint, so we're agile.' Which distinction does this statement collapse?

- **A.** It collapses the Sprint Review with the Sprint Retrospective, since both happen within the same two-week cycle and are often scheduled back to back on the calendar.
- **B.** The value layer (agile, the Manifesto's principles) into the framework layer (Scrum, one particular way of operationalising them).
- **C.** Nothing — attending the prescribed ceremonies is sufficient to be agile by definition.
- **D.** Kanban's continuous flow with Scrum's fixed-length iterations.

### 26.

A port scan reports a target port as "closed." A junior analyst reads this as "blocked by a firewall." Is that the correct reading?

- **A.** Yes — a port reported as closed always means a firewall somewhere on the path silently dropped the connection attempt without ever reaching the host.
- **B.** No, but only because "closed" actually means the destination host does not exist at all, rather than that it exists but has nothing listening.
- **C.** No — closed is not blocked; it is a cooperative answer, an RST, from a working host with nothing listening on that port, which proves layer 3 reachability rather than a block.
- **D.** Yes, but only for UDP scans, since a UDP port reported closed is defined to always indicate a firewall block rather than an application-level absence of a listener, because UDP provides no way for a host to report an absent listener.

### 27.

A publisher lists SHA-256 digests for a downloaded ISO. Which command checks the local file against that list, and what does a match actually prove?

- **A.** `sha256sum -c SHA256SUMS`, which proves only that the bytes received match the bytes that were hashed, nothing about who produced them
- **B.** `md5sum -c SHA256SUMS`, which is interchangeable with `sha256sum` since both compute a digest
- **C.** `gpg --verify SHA256SUMS`, which confirms the file's contents are correct without needing a signature
- **D.** `sha256sum -c SHA256SUMS`, which proves the publisher themselves produced the file and not an impersonator, because a digest list of this kind can only be generated by whoever holds the publisher’s release key.

### 28.

An operator needs every line in `app.log` that does not mention "healthy", case aside, along with the line number of each. Which combination of options achieves that?

- **A.** `grep -inv healthy app.log`, combining ignore-case, line numbers and inverted selection
- **B.** `grep -c healthy app.log`, since `-c` prints matching lines with their counts
- **C.** `grep -r healthy app.log`, since recursive mode also numbers every line it searches and inverts the selection along the way
- **D.** `grep -v healthy app.log`, without `-i`, since matching is case-insensitive by default

### 29.

A network engineer wants exactly one destination address to be redirected through a different next hop, while leaving every other destination unaffected. What technique achieves that without disturbing the rest of the table?

- **A.** Adding a /32 host route for that one destination; a more specific route always beats the default, so it redirects only that address and nothing else.
- **B.** Lowering the metric on the existing default route, since adjusting the metric is the only way to influence which destinations use which path.
- **C.** Editing `/etc/hosts` to point that destination's name at a different address, since routing decisions are driven by name resolution rather than by the routing table.
- **D.** Removing the default route entirely, since eliminating it is the only way to force a single destination onto a different next hop.

### 30.

A team provisions a virtual network and a set of block storage volumes from a provider, without touching any compute instance yet. Is this still an IaaS activity?

- **A.** No — without a running virtual machine there is no IaaS resource in use yet, since the virtual machine is the only genuine IaaS product.
- **B.** No — provisioning storage and networking without deploying application code is a PaaS-level activity.
- **C.** Yes — IaaS covers fundamental computing resources broadly, including virtual networks and storage volumes, not only virtual machines.
- **D.** Yes, but only if the team also attaches a managed database to the network, since IaaS requires at least one managed component.

### 31.

Two teams are merged onto one org chart, but developers are still measured on feature velocity and operators on uptime. Has the silo been removed?

- **A.** Yes, since a single reporting line is what defines a silo in the first place.
- **B.** No, because a silo is an incentive boundary rather than an org-chart boundary, and the conflicting measures preserve it regardless of the new reporting line.
- **C.** Yes, because a merged org chart is itself the evidence that an organisation has adopted DevOps, whatever the two groups are each still measured on individually.
- **D.** No, but only because the merged team's release cadence has not yet increased.

### 32.

Match the well-known port numbers to their conventional services: 22, 25, 53, 80, 143, 443.

- **A.** 22 HTTP, 25 SSH, 53 SMTP, 80 DNS, 143 HTTPS, 443 IMAP — each service shifted one position down the list from its actual conventional port.
- **B.** 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP, 443 HTTPS, each the conventional assignment recognised in the well-known range.
- **C.** 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP, 443 MySQL — matching the first five correctly but naming a registered-range service for the last one.
- **D.** 22 SSH, 25 DNS, 53 SMTP, 80 HTTP, 143 IMAP, 443 HTTPS — swapping the conventional assignments of 25 and 53 relative to their actual services.

### 33.

A build log needs both standard output and standard error captured to one file, and the script must run correctly on both bash and a strict POSIX `/bin/sh`. Which redirection is the portable choice?

- **A.** Writing `&> build.log`, the shorter bash and zsh shortcut for the same merge
- **B.** `>> build.log 2>build.log`, opening the file twice so that each descriptor gets its own independent writer to the same path
- **C.** Writing `> build.log 2>&1`, merging descriptor 2 onto descriptor 1 after opening the file
- **D.** `| tee build.log`, since piping to `tee` avoids redirection portability issues entirely

### 34.

A contractor with legitimate database access exports records for personal gain. Why do MFA, perimeter filtering, and patching all fail to engage against this specific actor?

- **A.** Those controls only ever apply to attacks originating from outside the country the organisation operates in.
- **B.** MFA, perimeter filtering, and patching are all detective controls, and only preventive controls can address an insider, so the three raise alerts that nobody with authority over the contractor is positioned to act on.
- **C.** The controls do engage, but only after the contractor's session has already ended for the day.
- **D.** The contractor already authenticated legitimately and never crosses the perimeter or exploits a software flaw, so none of those controls has a reason to trigger.

### 35.

A three-day task not on the critical path is shortened to one day. What happens to the project's finish date?

- **A.** Nothing, given that only the longest chain of dependent tasks determines the earliest possible finish, and this task isn't part of it.
- **B.** It moves the finish date earlier, since any task shortened anywhere in the schedule speeds up the whole project.
- **C.** It moves the finish date, because shortening any bar on a Gantt chart shifts every bar that comes after it.
- **D.** It moves the finish date, since shortening a task also shrinks its parent grouping in the work breakdown structure, and a smaller parent should logically finish sooner than before.

### 36.

A program was written to detach itself from its terminal on startup — forking, calling `setsid()`, and re-parenting to PID 1 — but has no systemd unit file. Is it a daemon? Is it a service?

- **A.** It is a daemon, because it has detached and runs in the background continuously; it is not a service, because nothing is supervising or restarting it
- **B.** It cannot be a daemon without a unit file, since daemons and services are the same thing under systemd
- **C.** It is both a daemon and a service, since any long-running background process qualifies as a service
- **D.** It is neither, since only systemd-managed processes count as daemons on a modern distribution — the term was retired from Linux terminology when SysV init was replaced

### 37.

A regulator asks whether customer workloads on a public cloud platform are visible to other tenants, since the service is 'open to the public.' What is the accurate answer?

- **A.** Yes — anyone who can purchase the service can also see any tenant's data stored on it, since the storage layer is genuinely shared.
- **B.** No — 'public' describes who may buy the service, not who may see a customer's data; tenants are logically isolated by separate accounts, networks and encryption keys.
- **C.** No, but only because this workload must actually be running in a private cloud rather than a public one, which by itself would rule the platform out of the public category.
- **D.** No, because public cloud providers only sell to businesses and governments, never individuals — the tenant set is vetted in advance.

### 38.

A job was started with `./long-job.sh &` over SSH and the connection later drops. The job dies along with it, even though `&` was used. What was missing?

- **A.** Nothing was missing; `&` alone is sufficient to survive a dropped connection
- **B.** `nohup`, so the job is immune to the SIGHUP sent when the terminal closes
- **C.** The job should have been started with `renice` instead of `&`
- **D.** The job needed to be registered as a systemd unit, since only PID 1 can hold a process open across a dropped connection — an unprivileged shell has no way to hand a running job off to anything that outlives it

### 39.

A contributor has read access but no write access to a project's hosted repository and wants to submit a bug fix without asking the maintainers to change their access settings. What is the correct first step, given that write access is decided by the remote, not by having a copy of the code?

- **A.** Fork the project on the hosting platform first, to obtain a server-side copy the contributor can push to, then `git clone` that fork locally.
- **B.** `git clone` the original repository directly, since a clone always grants push access to wherever it was copied from once the URL resolves and the transfer finishes successfully.
- **C.** Open a pull request against the original repository directly, without cloning or forking anything first.
- **D.** Ask an administrator to add the contributor as a collaborator with write access to the original repository.

### 40.

`df -h` reports the root filesystem at 100% full, but `du -sh /var/log` reports only a few hundred megabytes in use there. What explains the disagreement, and which command is telling the more complete story?

- **A.** `du` always undercounts by design and should never be trusted for capacity planning
- **B.** A deleted file is still held open by a running process, so `df` counts its space while `du` cannot see it
- **C.** `df` is counting inodes rather than blocks, which inflates its percentage, because `-h` switches the report from block usage to inode usage
- **D.** The two commands are measuring different filesystems entirely, despite both naming `/var/log`

### 41.

What single fact makes a subnet public on AWS?

- **A.** A checkbox on the subnet's own configuration marked 'public'.
- **B.** Association with a route table that contains a route to an internet gateway — nothing on the subnet itself records this.
- **C.** Attachment of an internet gateway to the virtual private cloud, regardless of any subnet's route table.
- **D.** Assignment of a reserved static address to at least one instance in the subnet.

### 42.

A support engineer claims the application can display a user's existing password on request, and calls this "hashing it for display." What does this claim actually reveal about how the password is stored?

- **A.** The password is stored reversibly, not hashed at all, since hashing has no decryption step and cannot be shown back to anyone.
- **B.** The password is correctly hashed with a fast algorithm, since fast hashing allows quick redisplay when requested.
- **C.** The password is stored with a pepper instead of a salt, which permits recovery when combined with the secret pepper value.
- **D.** The password is stored using asymmetric encryption, which allows the application to decrypt it with the matching private key.

### 43.

A file is `-r--rw-rw-`. Its owner removes all permission from the `other` class, leaving `-r--rw----`. Does that change what the owner can do to the file?

- **A.** Yes, narrowing any one class tightens the effective permission for everyone
- **B.** Yes, because the owner's access is always the most restrictive of the three classes
- **C.** It depends on whether the sticky bit is also set on the file
- **D.** No; removing permission from `other` never restricts the owner or group classes

### 44.

Kconfig marks a hardware option `Y` at kernel build time rather than `M`. What does that mean for how its driver reaches the running system?

- **A.** The driver is compiled directly into the kernel image and is active from boot, with no separate module to load or unload at runtime.
- **B.** The driver still ships as a `.ko` file in this case, but `modprobe` loads it automatically on every single boot without ever being asked to.
- **C.** The driver is actually firmware now, embedded in the device itself rather than anywhere in the kernel image.
- **D.** `Y` is simply an older, deprecated way of marking a module that modern kernels now ignore entirely in favour of `M`.

### 45.

A candidate claims: 'the SDLC is waterfall, since the phases are always listed requirements, design, implementation, testing, deployment, maintenance, in that order.' What is wrong with the claim?

- **A.** Nothing — an agile team skips design and testing entirely, so only waterfall actually uses the listed phases.
- **B.** The SDLC names the phases that must happen; waterfall is one policy for sequencing them, and an agile team runs the same phases repeatedly inside every iteration.
- **C.** The claim gets the sequencing policy right but the order wrong — maintenance is actually the first phase in most descriptions, since systems are maintained from the moment requirements are first drafted.
- **D.** The phases listed are risk-management activities, not lifecycle phases at all.

### 46.

A process appears idle in a snapshot from `ps` but `top` shows it pegged at 100% CPU. Which reading is correct?

- **A.** One of the two tools must be malfunctioning, since they disagree about the same process
- **B.** `top`'s figure is always more accurate because it updates continuously
- **C.** The process must have forked a hidden child that `ps` is not counting — `ps` excludes from its CPU accounting any process it did not itself start
- **D.** Both can be correct at once — `ps` reports a total divided over the process's whole lifetime, while `top` samples over a short recent interval

### 47.

A design states two requirements: 'users must reach the web tier from the internet' and 'the application servers must download patches but must never be reachable from outside.' Which routing target satisfies each?

- **A.** Making the web tier's subnet public and the application tier's subnet private satisfies both requirements on its own, with no gateway needed.
- **B.** A security group for the web tier and a network ACL for the application servers.
- **C.** An internet gateway for the web tier's two-way reachability, and a NAT gateway for the application servers' outbound-only reachability.
- **D.** A NAT gateway for both, since it is the safer default and can be configured for two-way reachability if needed.

### 48.

A repository has two remotes configured, `origin` and `upstream`, and a developer wants to see both names next to the URLs they push and fetch from. Which command shows that?

- **A.** `git remote -v`, with `-v` placed between `remote` and any subcommand
- **B.** `git branch -a`, since it lists both local and remote-tracking branches
- **C.** `git log --all --remotes`, since it walks history across every remote-tracking ref
- **D.** `git remote -v`, with `-v` placed after `origin` to scope it to that one remote

### 49.

`kill -9` is sent to a process stuck reading from an unresponsive network filesystem, and the process is still there afterward. What explains this apparent failure?

- **A.** The process is in uninterruptible sleep, waiting inside the kernel on I/O, and cannot be reaped until that I/O returns or times out
- **B.** SIGKILL failed and a stronger signal such as `-15` should be tried instead — signal numbers above 9 are reserved for the kernel's own escalation path
- **C.** The process must actually be a zombie, which explains why it cannot be killed
- **D.** `kill -9` only works on processes owned by the caller, and this one must belong to another user

### 50.

Symmetric-versus-asymmetric encryption, hashing, and password hashing and salting are compared as a trio. Which single property most cleanly separates encryption from both kinds of hashing in that comparison?

- **A.** Key involvement — encryption never uses a key, while both hashing forms require one.
- **B.** Output length — encryption always produces a longer output than either hashing form.
- **C.** Reversibility, since encryption is meant to be undone by whoever holds the right key, while both hashing forms are one-way by construction.
- **D.** Algorithm age — encryption algorithms are all newer than the hash functions used for either purpose, a property the comparison table does not track at all when separating the three primitives from one another.

### 51.

A user sends a termination signal intending to stop their own runaway process, but a colleague's identically-named process is also running on the shared server. What design guarantees the signal reaches only the intended process?

- **A.** The shell resolves the signal target by matching PATH first, so it always finds the sender's own binary to signal instead of anyone else's.
- **B.** Signals are addressed to a program name rather than a process ID, so ownership never enters into it at any point in the delivery process.
- **C.** The multi-user, multitasking design: process ownership and permission checks mean a signal from one user cannot reach another user's process by default, regardless of shared program names.
- **D.** Nothing guarantees this; two identically named processes running under different users on the same shared server are a known race condition that occasionally kills the wrong one without warning.

### 52.

A service on the host stops writing its logs and refuses to start, while every other service on the machine keeps working normally. What is the first thing to check?

- **A.** Whether `/var` (or the log directory under it) has filled up, since a full `/var` is one of the most common causes of exactly this symptom
- **B.** Whether `/usr` has filled up, since that is where the service's program files live
- **C.** Whether `/etc` has filled up, since that is where the service's configuration lives
- **D.** Whether the service's home directory under `/home` has filled up — daemons keep their spool and state files in the home directory of the account they run as

### 53.

A DNS-based failover promotes a standby within thirty seconds of the primary failing, but clients keep sending requests to the dead address for several more minutes. What is the most likely cause?

- **A.** The failure threshold was set too low, so the health check never actually declared the primary unhealthy.
- **B.** Cached DNS records; resolvers and clients keep using the old address until the record's time-to-live expires.
- **C.** The standby has not finished failback yet, so it is refusing the redirected connections.
- **D.** Load balancing rules on the standby are still routing requests back to the primary by mistake.

### 54.

A backlog item reads: 'Add a composite index to the orders table.' A reviewer says it is not a user story. What is missing, and what does the missing part usually let a team do?

- **A.** Nothing is missing — any single, well-defined unit of backlog work counts as a user story, provided it is small enough to fit comfortably inside one Sprint's worth of capacity.
- **B.** Its acceptance criteria — adding some would make it a proper story.
- **C.** An entry in the Sprint Backlog — placing it there would make it a story.
- **D.** The role and benefit clauses; without a stated 'so that', the team cannot judge whether a different, cheaper implementation would satisfy the actual need.

### 55.

A system that worked yesterday fails today. The team insists nothing changed. How should that claim be treated?

- **A.** As unlikely to be literally true, since certificate expiry, log growth filling a disk, a scheduled job, or an unattended upgrade can each alter behaviour with no deliberate human action.
- **B.** As irrelevant — skip it entirely and go straight to reproducing the fault instead of chasing down a change that may not even exist.
- **C.** As a reason to skip straight to the journal instead, since a component's own log always names the underlying cause directly and completely.
- **D.** As accurate, and the investigation should move on from there to a purely structural explanation for the failure instead of a change-based one.

### 56.

A bad commit was pushed yesterday and two colleagues have already pulled it. The block comparing this concept to rebase makes the same point twice about shared branches — which undo command is safe here, and which Git operation shares its unsafe property?

- **A.** `git reset --hard` is safe, since it removes the bad commit outright rather than leaving a visible trace of the mistake for reviewers, auditors, or the release notes to ever find later on down the line.
- **B.** Both `git revert` and `git reset` are equally safe here, since both are described as ways to undo a commit.
- **C.** `git revert` is safe, as it adds a new commit undoing the old one and leaves the original in place; rebase shares reset's unsafe property of rewriting history that others have already pulled.
- **D.** `git revert` is safe, and merge shares the same unsafe rewriting property as reset on a shared branch.

### 57.

A production database is encrypted and access-restricted. Its nightly dump lands in a storage bucket with no encryption and broad read access. What is the state of the data's protection?

- **A.** Unchanged — the production database's controls are what matter, since the backup is only a secondary artefact.
- **B.** Downgraded, but only until the bucket's retention period causes the dump to be securely deleted, at which point the earlier exposure is treated as if it never happened.
- **C.** Unchanged, provided the backup encryption keys are stored securely even though the backup itself is not encrypted, since secure key custody is what actually protects the data.
- **D.** Downgraded to the weakest copy — a backup inherits the classification, encryption and access-control requirements of its contents, and an attacker will take the weakest copy available.

### 58.

A text editor writes a saved file to disk without containing any code specific to the make or model of the installed disk controller. What makes that possible?

- **A.** The everything-is-a-file principle, which lets the editor open the controller's device path directly instead of going through any intermediary layer, since a file path is already a direct handle.
- **B.** A driver written specifically for that exact controller model was compiled into every Linux kernel in advance, so the editor links against that driver's interface directly rather than a general one.
- **C.** Modern disk controllers expose a single standardised interface, so no operating-system abstraction is actually needed to write to one, since the hardware itself already presents a uniform API.
- **D.** The operating system mediates the request: the editor calls a general save interface, and the layer beneath translates that into the specific low-level operations the installed controller requires.

### 59.

Two systems each survive a single-node failure. In the first, users see a short window of errors while a health check detects the failure and traffic is redirected to a standby. In the second, redundant nodes are already running the same work concurrently, so nothing is switched and no error appears anywhere. Which is fault tolerant, and why?

- **A.** The first, because detecting a failure and redirecting traffic is the textbook definition of tolerating a fault — collapsing the whole distinction the comparison exists to preserve between a brief switch and no interruption at all.
- **B.** Both equally, since either arrangement keeps the service running after one node is lost.
- **C.** The second. Fault tolerance means no user-visible interruption at all, because the redundant capacity was already doing the work rather than waiting to be switched to.
- **D.** Neither, because a genuinely fault-tolerant system would also survive the loss of every replica at once.

### 60.

A host reports a load average of 6. Is that a problem, and what determines the answer?

- **A.** Yes — a load figure above 1 always indicates a problem on any host, regardless of how many processor cores that host actually has available.
- **B.** It depends on core count; divide the load by `nproc`. A load of 6 on a 32-core host is unremarkable, 6 on a 2-core host is severe.
- **C.** No — swap usage, not load average, is what indicates trouble.
- **D.** It depends on network latency, which the load average also reflects.

