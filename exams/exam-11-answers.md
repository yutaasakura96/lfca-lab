<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 11 — answers

### 1. A

*sysadmin.best-practices.patch-cadence · System Administration Fundamentals :: Best Practices · depth 3 · application*

Patch cadence is the rhythm updates are applied on, together with the expedited path critical fixes take when they cannot wait for it. A schedule that never states that exception leaves an actively exploited vulnerability exposed for the length of a full cycle.

- **A.** Correct. "We patch monthly" does not describe a complete cadence without a named exception for a fix that cannot wait.
- **B.** That names the broader patch management practice cadence sits inside; the specific gap described is the missing exception path, not asset tracking.
- **C.** A monthly window already exists in the scenario; the gap is the exception path for something that cannot wait for it.
- **D.** A critical security fix is expected to leave the routine schedule rather than wait for it, which a schedule with no exception cannot do.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.patch-cadence](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.patch-cadence)

### 2. D

*cloud.best-practices.backup-and-recovery-in-cloud · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

A backup plan sets frequency and retention against a recovery point and recovery time objective, with lifecycle rules moving older copies to cheaper storage, but the restore is then exercised deliberately, because an untested restore path is an assumption rather than a recovery capability.

- **A.** Configuration alone does not prove a copy can be restored; that has to be exercised deliberately.
- **B.** Tag consistency matters for which resources get backed up at all, but the stem already assumes resources are correctly assigned by tag.
- **C.** Knowing who created the plan does not establish whether the data it protects can actually be restored.
- **D.** Correct. Schedule, retention and lifecycle rules govern how copies are taken and kept; only a performed restore proves they can be read back.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.backup-and-recovery-in-cloud](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.backup-and-recovery-in-cloud)

### 3. C

*linux.command-line.aliases · Linux Fundamentals :: Command Line · depth 3 · application*

Aliases are defined in a shell startup file, conventionally `~/.bashrc`, and exist only inside the shell that read that file. Defining one at the prompt without saving it means it does not survive into a new shell session.

- **A.** Aliases have no built-in expiry; the only thing that ends one is the shell session closing, unless it was saved to a startup file.
- **B.** Nothing in the scenario indicates a different user; the described behaviour — an alias vanishing in a brand-new session — is the ordinary consequence of never saving it.
- **C.** Correct. Aliases defined at the prompt exist only inside the shell that read them; they must be written to a startup file such as `~/.bashrc` to survive into a new shell.
- **D.** Bash has no such rule: an alias is expanded before a builtin is looked up, so an alias may shadow one, and `ll` is not a bash builtin in any case.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.aliases](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.aliases)

### 4. B

*security.compliance.data-retention-obligations · Security Fundamentals :: Compliance · depth 3 · application*

A dataset needed for anticipated litigation is preserved rather than deleted, and GDPR says so in its own text: Article 17(3)(e) disapplies the right to erasure to the extent processing is necessary for the establishment, exercise or defence of legal claims. The retention schedule’s maximum is the organisation’s own ceiling, so it gives way too, and NIST SP 800-88 Rev. 1’s disposal framework only engages once sanitisation actually proceeds.

- **A.** Article 17(3)(e) disapplies the erasure right to the extent processing is necessary to establish, exercise or defend legal claims, which is exactly what anticipated litigation raises.
- **B.** Correct. Article 17(3)(e) names the establishment, exercise or defence of legal claims as a ground on which the erasure right does not apply.
- **C.** The schedule’s maximum is a ceiling the organisation set for itself, and it yields to data the organisation now needs in order to defend an anticipated claim.
- **D.** NIST SP 800-88 Rev. 1’s Clear, Purge and Destroy framework applies when media is actually being sanitised, which is precisely what a preservation hold defers.

Study it: [04-security/compliance.md#c-security.compliance.data-retention-obligations](../study-guide/04-security/compliance.md#c-security.compliance.data-retention-obligations)

### 5. B

*devops.containers.control-plane · DevOps Fundamentals :: Containers · depth 2 · recall*

Losing the control plane stops new scheduling and new changes, while pods already running on healthy nodes keep serving traffic — a availability distinction the exam likes because it separates decision-making from execution.

- **A.** A running pod's containers keep executing on their node independent of a momentarily unreachable control plane; nothing about their process execution depends on it directly.
- **B.** Correct. The control plane makes decisions and records state, but running workloads on healthy nodes do not depend on it being reachable every second to keep serving.
- **C.** Whether a pod is managed by a Deployment or created bare has no bearing on whether it keeps running during a control plane outage; both keep serving on their nodes.
- **D.** Cluster DNS and Service resolution are not what fails during a brief control plane outage in this scenario; the accurate distinction is scheduling and changes stopping while running workloads continue.

Study it: [05-devops/containers.md#c-devops.containers.control-plane](../study-guide/05-devops/containers.md#c-devops.containers.control-plane)

### 6. A

*pm.functional-analysis.user-acceptance-testing · IT Project Management Fundamentals :: Functional Analysis · depth 2 · application*

UAT is performed by the people who will use the system, against their real work and acceptance criteria, and typically ends in an explicit business sign-off. Run as a repeat of system testing, it stops being a validation activity and becomes a second, redundant verification pass.

- **A.** Correct. UAT is the clearest instance of validation in a delivery; using its slot to repeat verification wastes the only check qualified to catch a wrong specification.
- **B.** Traceability links persist regardless of who executes a test or how many times; nothing about repeating scripts breaks that link.
- **C.** Extra verification uses up the time and attention meant for validation, which is exactly the resource this scenario shows being spent on the wrong check.
- **D.** Treating UAT as a second pass over the test team's script is the wrong mental model; it should exercise the users' own work against their real needs, not the specification a second time.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.user-acceptance-testing](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.user-acceptance-testing)

### 7. B

*sysadmin.best-practices.principle-of-least-astonishment · System Administration Fundamentals :: Best Practices · depth 1 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

Per consensus practice, the principle of least astonishment argues for conventional defaults over clever ones, because a surprising setup fails during incidents when nobody has time to read. It is a design preference recognised at recall level, not an enforceable control like a baseline.

- **A.** That is the opposite trade-off from the one this principle argues for; it favours the conventional choice over the clever one.
- **B.** Correct. It argues for behaving the way an experienced administrator would expect, precisely because incidents leave no time to discover a surprise.
- **C.** Uniformity across hosts of the same role is standardization's claim, not what this principle argues for.
- **D.** That describes a baseline; this principle is a design preference for unsurprising behaviour, not an enforceable control.

Study it: [02-system-administration/best-practices.md#s-best-practices-operational-discipline](../study-guide/02-system-administration/best-practices.md#s-best-practices-operational-discipline)

### 8. D

*cloud.best-practices.logging-and-auditing-in-cloud · Cloud Computing Fundamentals :: Best Practices · depth 2 · recall*

Retention is the detail worth holding: Event history gives a searchable, immutable record of the past 90 days of management events in a region at no charge, but 90 days is the whole of it — longer retention requires creating a trail that delivers events to object storage, or an event data store in CloudTrail Lake.

- **A.** CloudTrail is enabled by default, but Event history's window is bounded to 90 days regardless of how long it has been running.
- **B.** A backup plan protects resource data, not the control-plane audit trail; the two are separate systems.
- **C.** A metrics dashboard shows numeric trends, not the identity-level audit record that this investigation needs.
- **D.** Correct. The 90-day window is fixed and free by default, and reaching further back requires deliberately configuring a trail or a Lake event data store beforehand.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.logging-and-auditing-in-cloud](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.logging-and-auditing-in-cloud)

### 9. A

*sysadmin.best-practices.version-control-for-configuration · System Administration Fundamentals :: Best Practices · depth 2 · recall*

Version control preserves changes as someone meant them, and a revert is one more such change. The limit is precise: reverting alters the declaration, and nothing happens on any host until a tool or a person re-applies it.

- **A.** Correct. Reverting a commit changes the declaration, not the running system.
- **B.** "We reverted it" describes an intention restored, not an outage ended; the host is untouched until something re-applies the declaration.
- **C.** A revert changes a file in a repository; it does not capture a copy of any running system.
- **D.** Reverting a commit is an edit to the declaration, not an approval decision made by an independent reviewer.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.version-control-for-configuration](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.version-control-for-configuration)

### 10. A

*linux.command-line.creating-and-removing-files-and-directories · Linux Fundamentals :: Command Line · depth 3 · application*

`mkdir -p` creates every missing parent directory in the path and succeeds even if the target already exists, which is exactly what an idempotent deployment script needs. `cp -r` is the recursive-copy sibling worth knowing alongside `mkdir -p`.

- **A.** Correct. `-p` creates every missing parent and, uniquely among these options, does not fail if the directory already exists, which is what makes it safe to rerun.
- **B.** Without `-p`, `mkdir` fails with "No such file or directory" the moment an intermediate parent is missing, and it also errors on a directory that already exists.
- **C.** `touch` creates or updates a file's timestamps; it does not create directories at all.
- **D.** Copying a directory tree is unrelated to creating a new, empty nested directory, and would require the source to already exist.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.creating-and-removing-files-and-directories](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.creating-and-removing-files-and-directories)

### 11. D

*security.compliance.data-sovereignty-and-residency · Security Fundamentals :: Compliance · depth 2 · application*

Sovereignty depends on residency and on whose law the operator itself is subject to. A provider incorporated in one jurisdiction can remain answerable to that jurisdiction's lawful demands even when the data it holds physically sits elsewhere.

- **A.** Residency alone does not determine which legal systems can reach the data; a provider's home-jurisdiction obligations can follow it regardless of region.
- **B.** Chapter V governs transferring data out of the EU, not a third-party jurisdiction's request directed at the operator; whether an actual transfer under Chapter V has occurred is a separate question.
- **C.** A contract can allocate responsibilities between the parties, but it cannot change which legal system has authority to compel the operator that answers to it.
- **D.** Correct. A provider's home-jurisdiction obligations can follow it regardless of where the data physically resides.

Study it: [04-security/compliance.md#c-security.compliance.data-sovereignty-and-residency](../study-guide/04-security/compliance.md#c-security.compliance.data-sovereignty-and-residency)

### 12. D

*sysadmin.disaster-recovery.failover-and-failback · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

While the standby serves, it becomes the system of record. AWS Elastic Disaster Recovery describes failback as returning workloads to the original source infrastructure and assists it by replicating data from the recovery instances back to the source servers, so failback has a data problem at its centre rather than merely a routing one — which is why it is harder than failover and more often goes wrong.

- **A.** Authority moved with service; treating the stale primary as authoritative discards real data.
- **B.** Targets describe requirements and do not resolve a data divergence.
- **C.** Removing point-in-time copies destroys evidence and resolves no divergence.
- **D.** Correct. The primary's data is two days stale, so resuming without reconciliation loses those writes.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.failover-and-failback](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.failover-and-failback)

### 13. A

*devops.containers.dockerfile · DevOps Fundamentals :: Containers · depth 3 · discrimination*

`EXPOSE` records intent in the image's metadata and publishes nothing on its own. Traffic only reaches the container once `-p` (or `-P` for every `EXPOSE`d port) is used at `docker run` time to actually publish it on the host.

- **A.** Correct. `EXPOSE` is metadata between the image's author and its user, and it changes nothing about what traffic can reach the container.
- **B.** `EXPOSE` runs at build time and writes documentation into the image configuration; it performs no host-level publishing at all.
- **C.** Pushing to a registry changes where an image can be pulled from; it has no bearing on which ports a running container publishes.
- **D.** Reachability is controlled by port publishing alone; no environment variable is required to make a published port answer traffic.

Study it: [05-devops/containers.md#c-devops.containers.dockerfile](../study-guide/05-devops/containers.md#c-devops.containers.dockerfile)

### 14. C

*cloud.best-practices.right-size-before-you-scale · Cloud Computing Fundamentals :: Best Practices · depth 2 · recall*

Right sizing is driven by measurement: utilisation data over a representative period, including peaks, decides the type and size, and choosing a family that matches the bottleneck matters as much as choosing a smaller size — committed-use or reserved pricing is a discount on the rate, which locks in the existing waste rather than removing it.

- **A.** A reserved commitment locks in a rate for whatever instance size is chosen; it does not itself choose or resize anything.
- **B.** Horizontal scaling changes how many units run; right sizing changes what each unit is, which is a different decision.
- **C.** Correct. Right sizing is driven by measurement and by matching the instance family to the bottleneck, while a rate discount does not change the amount of capacity purchased.
- **D.** An orphaned resource with no owner is a different, tagging-related problem from an active but oversized resource.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.right-size-before-you-scale](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.right-size-before-you-scale)

### 15. C

*linux.command-line.file-transfer · Linux Fundamentals :: Command Line · depth 3 · application*

The trailing slash on the source is significant: `rsync -av src/ dest/` copies the contents of `src` into `dest`, while `rsync -av src dest/` creates `dest/src` — a frequent cause of an unexpectedly nested directory on the first run.

- **A.** The trailing-slash rule is one of the standing traps in this topic — it changes whether the source directory itself is nested inside the destination.
- **B.** Both forms are valid rsync invocations against a remote destination; there is no syntax error and no mandatory slash, only a difference in where the transferred files land.
- **C.** Correct. The trailing slash on the source is significant: `rsync -av src/ dest/` copies the *contents* of `src` into `dest`, while `rsync -av src dest/` creates `dest/src` instead.
- **D.** `--delete` behaviour is a separate, unrelated flag; the trailing slash specifically governs whether the source directory's name is nested into the destination.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-transfer](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-transfer)

### 16. C

*pm.open-source-software-and-licensing.free-software-and-foss · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

The four freedoms concern rights, not cost. Selling copies violates nothing, and this licence grants freedoms 0 through 3 in full, so it qualifies as free software regardless of its $20 price.

- **A.** The FSF and OSI maintain separate lists against different texts; there is no single joint list to consult incorrectly.
- **B.** Free as in freedom, not price: freedom 2 and 3 protect redistribution, and nothing in the four freedoms bars a sale.
- **C.** Correct. The freedoms concern what a recipient may then do with the software, not what the seller charged for the copy.
- **D.** No such additional agreement is part of the four freedoms; redistribution rights travel with the copy automatically.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.free-software-and-foss](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.free-software-and-foss)

### 17. B

*sysadmin.disaster-recovery.replication · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

Replication continuously copies data to another system for availability. Its fidelity is the point and the problem: it reproduces deletions and corruption as faithfully as legitimate writes, which is why it is not a backup.

- **A.** That is what a backup or a point-in-time copy provides; a replica tracks the primary rather than lagging it deliberately.
- **B.** Correct. Replication copies whatever the primary wrote, including the corruption, and does so promptly.
- **C.** Replication has no notion of whether a change was intended and performs no such rollback.
- **D.** Distance is not the issue here; the replica is off-site and still corrupt.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.replication](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.replication)

### 18. D

*sysadmin.networking.dhcp · System Administration Fundamentals :: Networking · depth 3 · discrimination*

DHCP hands out addresses and configuration; DNS answers questions about names — a machine with no address needs DHCP, and a machine with an address that cannot resolve a name needs DNS, and conflating the two is the classic error this competency tests.

- **A.** DHCP hands out addressing configuration only; it does not resolve names at all, and does not create DNS records by itself, so the second case is not a DHCP problem.
- **B.** A completely missing IP address is an addressing failure, which is DHCP's job to provide; DNS has no role in whether a host receives an address at all.
- **C.** A missing IP address entirely is an addressing failure — DHCP's job — not a name-resolution failure, and the second case, addresses working while names fail, is squarely DNS.
- **D.** Correct. DHCP hands out addresses and configuration; DNS answers questions about names — the two failure signatures are opposite and distinct, which is exactly why conflating them is the classic error.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dhcp](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dhcp)

### 19. A

*security.security.injection-attacks · Security Fundamentals :: Security · depth 2 · recall*

OWASP's primary defence is a safe API — parameterised queries, prepared statements, or an ORM — that keeps data and query structure in separate channels so input cannot change the statement's meaning. Positive server-side validation and context-appropriate escaping support that primary defence rather than replacing it.

- **A.** Correct. OWASP puts a safe API first because it keeps data and query structure in separate channels, so input cannot change the statement's meaning regardless of what characters it contains.
- **B.** The guide reverses this: escaping and server-side validation are supporting measures, while a safe API that avoids concatenation entirely is the primary defence.
- **C.** Mandatory access control confines what a compromised process can reach on the filesystem; it does not prevent a malformed query from being parsed and executed in the first place.
- **D.** Rate limiting slows the volume of requests but does not stop a single malicious request from injecting a payload into the query.

Study it: [04-security/security.md#c-security.security.injection-attacks](../study-guide/04-security/security.md#c-security.security.injection-attacks)

### 20. A

*cloud.budgeting.cost-monitoring · Cloud Computing Fundamentals :: Budgeting · depth 3 · discrimination*

Monitoring is not alerting: a dashboard nobody opens detects nothing, which is exactly why budgets and alerts exist alongside continuous monitoring rather than as a replacement for it.

- **A.** Correct. Passive observation only works if someone looks; an unopened dashboard is functionally silent, which is precisely why active, threshold-driven alerting is a separate, necessary practice.
- **B.** Whether the dashboard is opened has nothing to do with whether its tags or underlying data are correctly configured; the two are unrelated facts.
- **C.** A calculator estimates cost before something is built; it is not a substitute for observing what has actually happened to a running estate.
- **D.** Correct data collection with no one looking at it provides no warning to anyone; being technically correct is not the same as being watched.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.cost-monitoring](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.cost-monitoring)

### 21. A

*linux.command-line.grep · Linux Fundamentals :: Command Line · depth 3 · application*

`grep -r` searches every file beneath a directory, descending into subdirectories, and follows symlinks only when they are named on the command line; `-R` follows all symlinks encountered during the walk.

- **A.** Correct. `-r` makes `grep` walk into subdirectories rather than stopping at the top level; `-R` is the variant that follows all symlinks it encounters along the way.
- **B.** `-n` only adds line numbers to matched output; it has no effect on whether `grep` descends into subdirectories at all.
- **C.** Without `-r`, pointing `grep` at a directory produces an "Is a directory" message rather than a recursive search; the descent has to be requested explicitly.
- **D.** `-v` inverts which lines are selected as matches; it has nothing to do with how deep into the directory tree `grep` searches.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.grep](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.grep)

### 22. C

*devops.containers.kubernetes · DevOps Fundamentals :: Containers · depth 2 · recall*

Two facts about Kubernetes' standing are routinely confused and both are examinable: it is hosted by the CNCF as a graduated project, and it is governed by its own Steering Committee — the CNCF hosts, funds, and supports; it does not govern.

- **A.** Graduation describes hosting maturity, not governance; Kubernetes' own Steering Committee, not the CNCF, is named as its governing body.
- **B.** The CNCF, itself part of the Linux Foundation, is specifically the body that hosts Kubernetes as a graduated project.
- **C.** Correct. Hosting and governing are separated deliberately: the CNCF provides funding, infrastructure, and marketing support, while technical and community direction stays with the project's own structures.
- **D.** The Steering Committee is Kubernetes' own elected governing body, distinct from and not subordinate to the CNCF's internal structure.

Study it: [05-devops/containers.md#c-devops.containers.kubernetes](../study-guide/05-devops/containers.md#c-devops.containers.kubernetes)

### 23. B

*sysadmin.networking.http-and-https · System Administration Fundamentals :: Networking · depth 3 · application*

The status code is the fastest classifier available: 2xx succeeded, 3xx redirected, 4xx blamed the client, 5xx blamed the server — and specifically, 502 and 504 are by definition a gateway or proxy reporting a bad or missing answer from the server behind it, not that server answering for itself.

- **A.** 502 specifically originates from a gateway or proxy reporting trouble with the server behind it; the origin application server did not necessarily generate this particular response at all.
- **B.** Correct. Knowing that 502 and 504 are by definition a gateway or proxy reporting a problem with the server behind it, rather than that server answering for itself, redirects an investigation immediately toward the right component.
- **C.** 502 falls squarely in the 5xx range, meaning the server side is blamed, not the client; it is not a mislabeled 4xx-style client error.
- **D.** A 502 is generated by a gateway reporting a problem with an upstream server; clearing a client-side cache addresses a different class of issue entirely and would not resolve this.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.http-and-https](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.http-and-https)

### 24. D

*cloud.budgeting.storage-tiers-and-lifecycle-policies · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

Each transition is a billable operation, and moving data into a colder tier starts a minimum-retention clock: deleting or promoting the data before that clock expires incurs the remaining days as an early deletion charge, which is why aggressive tiering can raise rather than lower the bill.

- **A.** No exception for project cancellation is documented; the retention clock runs to term regardless of the business reason the data is being removed.
- **B.** An orphan is a resource with no purpose left and carries no separate billing rate of its own; this data's issue is a specific early deletion charge, not orphan status.
- **C.** Each transition and deletion is itself a billable event under a minimum-retention tier; deleting archived data early adds a charge rather than simply ending one.
- **D.** Correct. Moving data into a colder tier starts a minimum-retention clock, and deleting or promoting it before that clock expires incurs the remaining days as an early deletion charge.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.storage-tiers-and-lifecycle-policies](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.storage-tiers-and-lifecycle-policies)

### 25. B

*pm.project-management.change-control · IT Project Management Fundamentals :: Project Management · depth 3 · discrimination*

Change control is a decision procedure, not a mechanism for saying no; its purpose is to force an explicit answer to what else must give if scope is added, including approving worthwhile changes. An all-rejection record suggests the process is being misused as a blanket refusal. Scope creep, by contrast, leaves no rejected requests behind at all — it accumulates from additions that never went through the process to be rejected or approved.

- **A.** The purpose is to force the trade-off question to be answered explicitly, which includes approving changes that are genuinely worth their cost, not just refusing all of them.
- **B.** Correct. Change control's purpose is to make a trade-off explicit and answered by someone with authority; a process that only refuses is failing that purpose, and creep would instead show up as unassessed additions with no requests in the log at all.
- **C.** The stated period isn't the issue; an all-rejection record is suspicious regardless of how long it has run.
- **D.** Rejected requests are recorded so the same request doesn't reappear informally, but a rejection specifically does not update the baseline; only an approval does.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.change-control](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.change-control)

### 26. C

*sysadmin.networking.nat · System Administration Fundamentals :: Networking · depth 3 · application*

NAT is the reason outbound connections from a private network 'just work' while inbound connections do not: the translation table is built by outbound traffic, so an unsolicited inbound packet has no entry to match and is dropped until an explicit destination-NAT rule creates one.

- **A.** NAT itself applies no policy at all; it drops unmatched inbound packets purely as a side effect of having no translation entry, not because it makes a security decision.
- **B.** A private address is a perfectly valid address on its own network; it becomes reachable from outside once an appropriate NAT and forwarding rule exists, which is exactly the missing piece here.
- **C.** Correct. Outbound connections create the mapping that allows return traffic back in, but nothing creates a mapping for a connection that originates from outside, which is why inbound needs an explicit rule.
- **D.** The scenario describes a connection failure after a rule is configured, which is about reachability through NAT, not about whether a name resolves to an address.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.nat](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.nat)

### 27. D

*security.security.insider-threat · Security Fundamentals :: Security · depth 2 · recall*

Insider threat is harm caused by someone who already holds legitimate access, whether deliberate — theft, sabotage — or accidental, such as a misdirected file, a public bucket, or a deleted database. Intent is not the qualifying condition; legitimate access to cause the harm is.

- **A.** The guide's definition is explicit that accidental harm — including a public bucket — is covered alongside deliberate theft or sabotage.
- **B.** Attack surface concerns the total set of reachable points on a system, a different concept from harm caused by someone who already holds legitimate access.
- **C.** The guide's definition names employees, contractors, and partners alike as potential insiders, so employment type is not what excludes a case.
- **D.** Correct. The guide's definition explicitly includes accidental harm — a misdirected file or a public bucket — alongside deliberate theft or sabotage.

Study it: [04-security/security.md#c-security.security.insider-threat](../study-guide/04-security/security.md#c-security.security.insider-threat)

### 28. A

*linux.command-line.quoting · Linux Fundamentals :: Command Line · depth 2 · recall*

After the shell substitutes a variable's value, an unquoted result is subject to word splitting on the characters in `IFS`. Inside double quotes neither word splitting nor pathname expansion happens, so quoting every variable expansion is the rule that avoids this entire class of bug.

- **A.** Correct. An unquoted expansion is subject to word splitting on spaces, producing two arguments; double quotes suppress word splitting, so the value stays one word regardless of its contents.
- **B.** Quoting changes whether word splitting applies to the expansion; the unquoted form does split on the internal space, producing two separate arguments.
- **C.** A space inside a variable's value is ordinary text; it causes no syntax error, only word splitting when the expansion is left unquoted.
- **D.** Quotes are removed by the shell during quote removal and never reach the command; what actually differs is that the unquoted expansion is split into two words on the internal space.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.quoting](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.quoting)

### 29. C

*sysadmin.networking.ping-and-icmp · System Administration Fundamentals :: Networking · depth 4 · diagnostic*

`ping` is the cheapest reachability test available, but a failed ping does not prove a host is down: ICMP is very commonly blocked by policy while TCP services on the same host work perfectly, which is exactly why treating ping failure as proof of a dead host is a classic, examinable wrong conclusion.

- **A.** A host can be fully up and serving TCP connections while ICMP is filtered separately; the two are independent, and a working TCP connection alongside a failed ping is a common, expected combination.
- **B.** The scenario does not describe a naming issue at all; both the failed ping and the working TCP connections were tested against the same reachable host, which points at ICMP filtering, not DNS.
- **C.** Correct. A failed ping does not prove a host is down, because ICMP is very commonly blocked by policy while TCP services on the same host work perfectly — treating ping failure as proof of a dead host is a classic wrong conclusion.
- **D.** A broken routing table would affect TCP traffic just as much as ICMP traffic to the same destination; the described split, ICMP failing while TCP succeeds, points at protocol-specific filtering, not routing.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ping-and-icmp](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ping-and-icmp)

### 30. C

*cloud.cloud-computing.essential-characteristics · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · application*

Rapid elasticity is often summarised as scaling up, but NIST's definition is symmetric: capacity must scale outward and inward to match demand. The autoscaling group growing on Friday and shrinking over the weekend is elasticity working in both directions, and the shrink is what lets measured service produce a smaller bill — a downstream effect, not the characteristic itself.

- **A.** That describes the billing consequence of running fewer instances, not the scaling behaviour itself, which is what the question asks about.
- **B.** Autoscaling does act without human intervention, but the property being tested here is the inward-and-outward scaling itself, not who or what triggers it.
- **C.** Correct. NIST's definition explicitly includes scaling inward, and the weekend shrink is that inward direction in action.
- **D.** Pooling explains why the capacity exists to be requested at all, but it does not describe the scaling behaviour the weekend shrink illustrates.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.essential-characteristics](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.essential-characteristics)

### 31. D

*devops.devops-basics.canary-release · DevOps Fundamentals :: DevOps Basics · depth 3 · application*

A canary's entire purpose is learning from production: a slice of traffic is watched so that widening is a decision informed by real measurement. Without that measurement, the same rollout provides none of the safety it is chosen for.

- **A.** An all-at-once cutover describes blue-green; a canary is defined by gradual widening, not a single switch.
- **B.** Batch-based replacement describes a rolling deployment; a canary is defined by a traffic share, not by which instances are swapped.
- **C.** Automation of the mechanism does not substitute for watching error rate, latency, and business signals during the exposure.
- **D.** Correct. Widening on a fixed schedule without measurement discards the exact thing a canary exists to provide.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.canary-release](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.canary-release)

### 32. D

*sysadmin.networking.ssh · System Administration Fundamentals :: Networking · depth 3 · application*

`ssh-keygen` generates a key pair, writing the private key to a file and the public key to a matching `.pub` file, and `ssh-copy-id` logs in using an existing method and appends that public key to the remote `~/.ssh/authorized_keys` — only the public half ever leaves the client.

- **A.** The private key must never leave the client; copying it to the server undermines the entire point of key-based authentication, and only the public key is meant to be shared.
- **B.** The server needs only the public key to verify a login; sending the private key as well defeats the security model entirely, regardless of which transfer tool is used.
- **C.** `ssh-copy-id` installs an existing local public key on the remote host; it does not generate a new key pair on the server as part of that process.
- **D.** Correct. Only the public half of the key pair ever leaves the client; `ssh-copy-id` is the tool designed to install it in the right place on the remote host.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ssh](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ssh)

### 33. D

*linux.command-line.root-directory-vs-root-vs-home · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`/` is the root of the filesystem, `/root` is the superuser's home directory, and `~` is the current user's home — three different things sharing the words "root" and "home." The FHS places `/root` outside `/home` on purpose, so `/home/root` is never the right path.

- **A.** The root directory `/` is the top of the filesystem hierarchy; that is a different concept from an account's home directory, even though both are called "root."
- **B.** `/root` is a real, ordinary directory; `~root` is one valid shell shorthand for reaching it, not the only way, and the FHS documents `/root` as a literal path.
- **C.** FHS 3.0 describes `/home` as the site-specific location for user home directories, but it documents `/root` as a top-level directory in its own right, not as an entry underneath `/home`.
- **D.** Correct. FHS 3.0 §3.14 names `/root` as the recommended default location for the root account's home directory — a top-level directory of the root filesystem rather than an entry under `/home` — and its footnote warns that if root's home is not on the root partition it must be arranged to fall back to `/`.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.root-directory-vs-root-vs-home](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.root-directory-vs-root-vs-home)

### 34. D

*security.security.intrusion-detection-and-prevention · Security Fundamentals :: Security · depth 3 · application*

The difference between detection and prevention is placement and authority, not analytical power: a prevention system must sit inline, in the traffic path, because it has to be able to drop packets, while a detection system commonly sits passively and cannot. Inline placement is also why many deployments run detection-only first, since a false positive there drops legitimate traffic.

- **A.** A passively placed system, off the direct traffic path, cannot drop packets however good its detection is — blocking requires inline placement.
- **B.** The inline-versus-passive distinction applies to network deployments (NIPS versus NIDS) just as much as host-based ones, since either can be placed to observe or to intervene.
- **C.** A vulnerability scanner enumerates known weaknesses on a schedule; it has no role in blocking live traffic, which is what this requirement is about.
- **D.** Correct. The guide is explicit that a prevention system must sit inline because dropping packets requires being on the path, and that inline placement is exactly what makes a false positive costly.

Study it: [04-security/security.md#c-security.security.intrusion-detection-and-prevention](../study-guide/04-security/security.md#c-security.security.intrusion-detection-and-prevention)

### 35. C

*pm.project-management.gantt-chart · IT Project Management Fundamentals :: Project Management · depth 1 · recall*

A Gantt chart is a bar chart of tasks against time, showing duration and, as usually drawn, dependencies — associated with plan-driven scheduling. A work breakdown structure decomposes the deliverable hierarchically and has no time axis at all; that absence is the entire basis of the comparison.

- **A.** This reverses the two — the work breakdown structure shows what is in scope, and the Gantt chart is what shows when things happen.
- **B.** The two aren't the same hierarchy at different resolutions; one has no time axis and the other is built around one.
- **C.** Correct. Time is the chart's defining axis; the work breakdown structure is a decomposition of scope and carries no dates or durations at all.
- **D.** A work breakdown structure has no paths or dependencies to compare against; a Gantt chart can display the critical path, but that isn't the axis separating the two artefacts.

Study it: [06-it-project-management/project-management.md#s-project-management-planning](../study-guide/06-it-project-management/project-management.md#s-project-management-planning)

### 36. B

*sysadmin.system-administration.apt-and-dpkg · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

`dpkg -i` performs no dependency resolution. On a missing requirement it unpacks the package but cannot finish configuring it, leaving it in a half-configured state that blocks later operations until `apt --fix-broken install` (or `apt install`, which resolves dependencies from the start even for a local file) repairs it. `apt upgrade`, by contrast, only touches packages already installed from a repository.

- **A.** `dpkg -i` does not roll back on a missing dependency; it leaves the package unpacked and unconfigured, blocking later operations until the gap is filled.
- **B.** Correct. `dpkg` does not resolve dependencies, so it leaves the package half-installed rather than either completing or fully rolling back.
- **C.** `dpkg -i` unpacks first and only then fails at the configure step, leaving the package in dpkg's `unpacked` state; the pre-extraction refusal described here is `rpm -i` behaviour on a Red Hat-family system, not dpkg's.
- **D.** `dpkg` performs no dependency resolution or substitution at all; a missing requirement blocks configuration rather than being silently worked around.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.apt-and-dpkg](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.apt-and-dpkg)

### 37. B

*cloud.cloud-computing.managed-services · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

Managed services and PaaS both take significant operational work off the customer, but PaaS is defined by the consumer deploying an application they wrote or acquired, while a managed service is a standard component — a database, queue or cache — the provider installs, patches and operates, that the consumer merely configures and uses through its ordinary interface. Nothing of the team's is deployed onto the database in this scenario, which settles it as a managed service.

- **A.** Provider-managed operations are common to both models; what makes PaaS specifically PaaS is the deployed application artifact, which is absent here.
- **B.** Correct. The guide's separating axis is exactly this: PaaS runs an application the consumer wrote, while a managed service runs a standard component the provider maintains, and this database has no deployed application.
- **C.** This gets the definition backwards — a managed service is precisely a provider-operated component; what stays with the customer is configuration, schema and data, not operation of the component itself.
- **D.** NIST does not define managed services as a service model at all; it is a consumption pattern that fits within the same consumer/provider control split NIST documents for IaaS, PaaS and SaaS.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.managed-services](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.managed-services)

### 38. A

*sysadmin.system-administration.dev · System Administration Fundamentals :: System Administration · depth 3 · application*

Kernel device names such as `/dev/sdb` depend on enumeration order at boot and are not guaranteed stable, especially after a hardware change. `/etc/fstab` should reference a UUID rather than a device node for exactly this reason.

- **A.** Correct. Because the mapping from device name to physical disk can shift after any change, referencing a UUID instead avoids the entry silently pointing at the wrong disk.
- **B.** Device names are explicitly not guaranteed stable: fstab(5) states that "device names are often a coincidence of hardware detection order, and can change when other disks are added or removed", and recommends `LABEL=` or `UUID=` instead.
- **C.** Nothing about a device name shifting requires partition table corruption; enumeration order alone is sufficient to explain the mismatch.
- **D.** Fstab entries do not expire; the actual issue is that the referenced device name no longer points at the intended disk.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.dev](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.dev)

### 39. A

*devops.git-concepts.commit · DevOps Fundamentals :: Git Concepts · depth 3 · application*

A commit is an immutable local snapshot; nothing leaves the machine it was made on until a push. That commit/push split is exactly what the "Not to be confused with: Commit vs Push" block on this concept exists to test — `git commit -m` records, push publishes, and only the second one needs a network.

- **A.** Correct. A commit is local by definition — it exists in this repository and nowhere else until an explicit push sends it somewhere the colleague can reach.
- **B.** That is the centralized-tool model, where committing writes to the one shared history; in Git committing writes only to the author's own copy.
- **C.** Message length affects readability, not whether a commit is transmitted anywhere; a one-word message is committed and stays exactly as local as a long one.
- **D.** One fetch is enough to retrieve a commit that has actually reached the remote; the real issue here is that nothing was pushed yet, so no number of fetches would find it.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.commit](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.commit)

### 40. C

*linux.command-line.system-commands · Linux Fundamentals :: Command Line · depth 3 · application*

`kill` without a number sends SIGTERM, a polite request the process can catch and ignore; `kill -9` sends SIGKILL, which cannot be caught and skips cleanup — though a process stuck in uninterruptible I/O will not die even then.

- **A.** A plain `kill` sends TERM, not KILL, and `-9` selects a genuinely different signal rather than respelling the default; SIGKILL is a real escalation still available.
- **B.** `kill` specifically takes PIDs; `pkill` and `killall` are the ones that take names, and a numeric PID like `4821` is exactly what `kill` expects.
- **C.** Correct. A plain `kill` sends SIGTERM (15), a request a process may catch and handle — including ignoring; `kill -9` sends SIGKILL, which cannot be caught and skips any cleanup the process would otherwise perform.
- **D.** A process stuck in uninterruptible I/O will not die even from SIGKILL, which is a separate, known limitation rather than something `-9` reliably overcomes.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.system-commands](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.system-commands)

### 41. C

*cloud.cloud-computing.public-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Public cloud's selling point is elastic capacity and speed of provisioning, not an automatic price advantage. A workload whose demand never varies gets no benefit from elasticity and can be cheaper to run on owned hardware sized precisely for it — assuming the move always saves money is the trap the guide calls out directly.

- **A.** This treats elasticity's benefit as universal; a workload that never varies gains nothing from elastic capacity it never needs to use.
- **B.** Private cloud is not inherently cheaper either — its usual motivations are regulation, residency and control, not cost — so this does not follow from the scenario.
- **C.** Correct. SP 800-146 puts the benefit in elasticity — avoiding 'excessive costs from over-provisioning' — and adds that whether cloud reduces overall costs 'depends on a careful analysis of all the costs'.
- **D.** Avoiding capital expenditure is real, but it is only one factor; a steady high-volume workload may still cost more over time on a public platform than on owned hardware sized for it.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.public-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.public-cloud)

### 42. C

*security.security.symmetric-vs-asymmetric-encryption · Security Fundamentals :: Security · depth 3 · application*

Symmetric and asymmetric cryptography exist together rather than one replacing the other because they solve different problems: asymmetric cryptography authenticates the peer and agrees a fresh key without a pre-shared secret, and the resulting symmetric key then protects the actual traffic efficiently. TLS's handshake-then-bulk-data structure is this division made concrete.

- **A.** Asymmetric is not "stronger" than symmetric; the guide notes key sizes are not even comparable across the two families, and each solves a different problem.
- **B.** This reverses the roles — the certificate and asymmetric handshake are what authenticate the server, not the symmetric traffic keys.
- **C.** Correct. The two families solve different problems, and TLS uses each for the one it solves: asymmetric for identity and key agreement, symmetric for speed on the actual data.
- **D.** Hashing is a separate, one-way primitive used for integrity, not a substitute for the symmetric encryption that protects the application data itself.

Study it: [04-security/security.md#c-security.security.symmetric-vs-asymmetric-encryption](../study-guide/04-security/security.md#c-security.security.symmetric-vs-asymmetric-encryption)

### 43. D

*sysadmin.system-administration.group · System Administration Fundamentals :: System Administration · depth 3 · application*

A group is a named collection of users used to grant a permission once to many accounts, so the resolution is a `developers` group with the new account added as a member, rather than a new personal account or blanket root access. Membership can be confirmed afterward with `groups`.

- **A.** A user account is one named identity with one UID; it is not how membership in a team is modelled.
- **B.** A service account exists to run a daemon, not to give a person shared access to files.
- **C.** Root access is far broader than the stated need and bypasses the ordinary permission model rather than using it.
- **D.** Correct. A group lets a permission be granted once and shared by every member, which is exactly the shared-folder scenario.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.group](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.group)

### 44. B

*linux.linux-operating-system.distribution-families · Linux Fundamentals :: Linux Operating System · depth 3 · recall*

Fedora is in the Red Hat family, which uses `.rpm` packages and `dnf`. Package-manager questions are literal recall: given a distribution name, its family's tooling follows directly.

- **A.** That assumption pairs Fedora with the Debian family; Fedora is Red Hat-family and uses `dnf`, not `apt` — a pure recall failure the exam is built to catch.
- **B.** Correct. Fedora is a Red Hat-family distribution, and `dnf`/`.rpm` is that family's tooling.
- **C.** Sharing a package format does not mean sharing a family's tooling; `zypper` belongs to SUSE, not Red Hat, even though both use `.rpm`.
- **D.** Package format and manager are fixed by the distribution's family, not by local preference; installing a foreign package manager does not change what the distribution ships with by default.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.distribution-families](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.distribution-families)

### 45. A

*pm.project-management.sprint · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

A Sprint is a fixed-length event, commonly two weeks though the length is a convention, and the fixed box is what makes it possible to forecast from what a team has completed in the past. Extending it 'to finish' destroys that property for the Sprint it happens to, even though only the Product Owner has the authority to cancel a Sprint outright.

- **A.** Correct. The box's fixed length is the mechanism, not a detail; extending it removes the one property forecasting from past Sprints depends on.
- **B.** Extending the timebox to finish work is exactly the practice the fixed-length rule exists to prevent, not a normal accommodation.
- **C.** Nothing about extending the Sprint's end date merges two named events into one.
- **D.** One extended Sprint doesn't retroactively invalidate every later velocity figure, though it does distort the extended Sprint's own data point.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.sprint](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.sprint)

### 46. B

*sysadmin.system-administration.partition · System Administration Fundamentals :: System Administration · depth 3 · application*

MBR is limited to four primary partitions (one of which can be an extended partition holding further logical ones) and to disks of roughly 2 TiB, both consequences of its fixed, small on-disk structure. GPT, the UEFI-era replacement, removes both limits.

- **A.** One of MBR's four primary slots can hold an extended partition containing further logical partitions, and MBR does impose a roughly 2 TiB size ceiling.
- **B.** Correct. Both limits come from the fixed-size 512-byte structure MBR uses to record the partition table, which GPT was designed to remove.
- **C.** MBR does cap primary partitions at four; the count limit is real, not absent.
- **D.** The 2 TiB ceiling is a property of the MBR partition table format itself, independent of whatever filesystem type is later created on a partition.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.partition](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.partition)

### 47. C

*cloud.networking.cloud-route-tables · Cloud Computing Fundamentals :: Networking · depth 2 · application*

Matching is by destination address, most specific route first, so a narrower route beats a broader default route for a packet addressed inside that narrower range.

- **A.** A default route is the least specific possible match and is used only when nothing more specific applies; it does not override a more specific matching route.
- **B.** The subnet's own range is covered by the automatic local route, which is a separate entry from either route named here and is not what this question is asking about.
- **C.** Correct. Route matching evaluates the most specific prefix first, so a narrower matching route wins over the broad default.
- **D.** Whether the ranges overlap governs whether the peering connection could be created at all; given that it exists and has a route, this question is only about which route a specific packet matches.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cloud-route-tables](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cloud-route-tables)

### 48. D

*devops.git-concepts.gitignore · DevOps Fundamentals :: Git Concepts · depth 2 · application*

`.gitignore` specifies intentionally untracked files, and files already tracked by Git are not affected by it at all. Once a secret is committed and pushed, it is in the history and in every existing clone; the only reliable remediation is to treat the credential as compromised and rotate it, since the copies that already left cannot be recalled.

- **A.** This is the exact trap the concept warns about: `.gitignore` governs future tracking decisions, not past commits, so nothing in the existing history changes.
- **B.** No ordinary commit prunes prior history; committing again only records the current state going forward and leaves every earlier snapshot exactly as it was.
- **C.** The first half is right, but `git reset` only moves the current branch pointer and does not rewrite or erase commits other clones have already taken; it is not the remediation here.
- **D.** Correct. The scope of `.gitignore` is stated as intentionally untracked files specifically; a tracked file's existing commits are entirely unaffected by adding it there afterward.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.gitignore](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.gitignore)

### 49. D

*sysadmin.system-administration.raid-levels · System Administration Fundamentals :: System Administration · depth 3 · application*

RAID 5 needs at least three drives, gives the capacity of all but one, and survives exactly one drive failure — the best capacity-to-redundancy trade-off of the options for surviving a single drive loss. RAID 6, RAID 10 and RAID 1 all trade away more capacity for additional protection.

- **A.** RAID 0 has no redundancy at all and loses everything if any single drive fails — it does not survive a drive loss, which the requirement specifically asks for.
- **B.** RAID 1 survives a drive loss but gives only the capacity of one drive regardless of how many are mirrored, which does not maximise usable capacity from four drives.
- **C.** RAID 10 does survive a single drive loss, but holding two copies of every block leaves only half the raw capacity usable, which is less than RAID 5's all-but-one on the same four drives.
- **D.** Correct. RAID 5 stripes with distributed parity, surviving exactly one drive failure while sacrificing only one drive's worth of capacity to redundancy.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.raid-levels](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.raid-levels)

### 50. B

*security.security.tls-and-https · Security Fundamentals :: Security · depth 3 · application*

"SSL" names TLS's obsolete predecessor, deprecated by RFC 7568, while the object people call an "SSL certificate" is simply an X.509 certificate used by TLS. LFS200 discusses SSL and never uses the term TLS at all, which is why an engineer trained on that course carries a real vocabulary gap into an exam that expects the current name.

- **A.** SSL is an obsolete predecessor to TLS, not an alternate name for the same current protocol, and offering it as a current choice is the trap the guide names directly.
- **B.** Correct. RFC 7568 states "SSLv3 MUST NOT be used" and requires that negotiation of SSLv3 from any version of TLS be prohibited; the object usually called an "SSL certificate" is the X.509 certificate profiled by RFC 5280 and consumed by TLS.
- **C.** TLS is not web-only and is used across SMTP, IMAP, LDAP and database protocols, but that does not make the obsolete SSL protocol an acceptable substitute for any of them.
- **D.** TLS runs on top of an already-established reliable transport such as TCP rather than replacing it, which is a separate error from the SSL naming issue.

Study it: [04-security/security.md#c-security.security.tls-and-https](../study-guide/04-security/security.md#c-security.security.tls-and-https)

### 51. C

*linux.linux-operating-system.open-source-licensing-of-linux · Linux Fundamentals :: Linux Operating System · depth 2 · recall*

The kernel is released under GPLv2 only, not the more common 'GPLv2 or later' clause. This is why distributions may copy, modify, and redistribute it, provided redistributions stay under that same license.

- **A.** The kernel is not MIT-licensed; MIT is a permissive license and does not carry the GPL's copyleft requirement the kernel actually operates under.
- **B.** The kernel deliberately uses GPLv2 only, not the 'or later' clause common elsewhere in GNU software — this is the specific fact the concept tests.
- **C.** Correct. The guide is explicit that this is GPLv2-only, contrasted with the more common 'or later' clause seen elsewhere.
- **D.** A distribution cannot override the kernel's own license; userland tools bundled alongside it may carry different licenses individually, but the kernel itself stays GPLv2.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.open-source-licensing-of-linux](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.open-source-licensing-of-linux)

### 52. D

*sysadmin.system-administration.sticky-bit · System Administration Fundamentals :: System Administration · depth 3 · application*

The sticky bit, set with `chmod +t`, restricts deletion and renaming inside a shared-writable directory to three parties: the file's own owner, the directory's owner, and a privileged process. Naming only "the file's owner" and forgetting the other two is the standard way this fact is gotten wrong.

- **A.** This is the recurring error: the directory's owner and a privileged process may also remove an entry, not the file's owner alone.
- **B.** The sticky bit restricts both renaming and deletion equally; it does not carve out deletion as unaffected.
- **C.** Ordinary users routinely delete their own files in `/tmp`; the restriction is narrower than blocking every ordinary user.
- **D.** Correct. The sticky bit narrows directory write from "may remove any entry" to exactly these three parties, which is the whole reason `/tmp` can be world-writable safely.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.sticky-bit](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.sticky-bit)

### 53. B

*cloud.networking.internet-gateway-and-nat-gateway · Cloud Computing Fundamentals :: Networking · depth 3 · discrimination*

A public NAT gateway is provisioned in a public subnet and serves the private subnets that route their default traffic to it, from where it is routed on to the internet gateway; placing it in the private subnet it serves is a documented inversion of the intended layout.

- **A.** AWS's own architecture puts the public NAT gateway in a public subnet specifically so it can reach the internet gateway; placed in a private subnet it would have no route out either.
- **B.** Correct. AWS documents the public NAT gateway as living in a public subnet specifically so it has a path to the internet gateway.
- **C.** Reclassification is not the missing step here — the NAT gateway itself needs to sit in a subnet with a route to an internet gateway, which is a placement decision distinct from any subnet's own public/private status.
- **D.** The reachability problem here is architectural — the gateway has nowhere to route outbound traffic — and no filtering rule addition changes where a gateway needs to sit.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.internet-gateway-and-nat-gateway](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.internet-gateway-and-nat-gateway)

### 54. B

*pm.project-management.waterfall · IT Project Management Fundamentals :: Project Management · depth 3 · application*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

Waterfall moves the whole scope through completed, approved phases in sequence, which is predictable precisely when requirements won't change. A fixed regulatory contract with no tolerance for redesign is the textbook cue for it — the choice is about requirements stability, not about which approach is inherently faster or more modern.

- **A.** Welcoming late change is a poor fit for scope that cannot be redesigned mid-flight; it doesn't reduce risk here, it invites cost.
- **B.** Correct. Waterfall's predictability is worth most exactly when requirements are genuinely stable, which fixed regulatory scope describes.
- **C.** A contract states what must be delivered, not how the team sequences the work to get there — some methodology still governs execution.
- **D.** Iterative delivery is valuable for uncertain requirements, but this scenario describes the opposite condition: stability, not uncertainty.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.waterfall](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.waterfall)

### 55. C

*sysadmin.troubleshooting.checking-logs-first · System Administration Fundamentals :: Troubleshooting · depth 3 · command*

`journalctl -u` restricts output to one unit and `journalctl -p err` filters by severity, inclusive of everything worse than the named level; combined and scoped to the current boot they isolate exactly the failing unit's own errors. `tail -f` only follows a growing text file and cannot show history, and a system without persistent journal storage has nothing under `/var/log` for it to watch at all.

- **A.** That watches a text log grow in real time but shows nothing that already happened, and a journald-only system may have no such file to tail at all.
- **B.** That tail is a short, ellipsized summary of the current invocation only, not a full priority-filtered history across the boot.
- **C.** Correct. The unit filter isolates this daemon's records and the priority filter is inclusive upward, so `err` also surfaces `crit`, `alert` and `emerg`.
- **D.** Without `-u` the output covers every unit and kernel record system-wide, drowning the one line that matters in unrelated noise.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.checking-logs-first](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.checking-logs-first)

### 56. A

*devops.git-concepts.repository · DevOps Fundamentals :: Git Concepts · depth 3 · command*

`git init` creates an empty repository — a `.git` directory with an object store and an initial branch carrying no commits — and configures no remote, which fits a directory with nothing to copy from. `git clone` is the other repository-creating command, but it requires an existing source and copies its history rather than starting fresh.

- **A.** Correct. It creates the object database and initial branch from nothing, which is exactly the case here — there is no source repository to copy.
- **B.** Clone needs an existing source repository to copy history from and configures a remote for it; there is nothing here yet to clone.
- **C.** Adding stages the content of files already inside a repository; it does not create the `.git` directory that makes tracking possible in the first place.
- **D.** A remote is optional and unrelated to whether a local `.git` directory exists; a project can be a complete repository with no remote configured at all.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.repository](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.repository)

### 57. B

*security.sensitive-data.backups-of-sensitive-data · Security Fundamentals :: Sensitive Data · depth 2 · application*

Retention applies to copies, and backups are copies. Deleting a record from production while it survives in a nightly backup means the obligation was not fully met the moment production is cleared; the practical answer is usually to let the backup's own expiry age the copy out, since surgical deletion inside backup sets is generally infeasible — the backup's expiry, not the production delete, is the record's real end of life.

- **A.** A record surviving in a nightly backup and a warehouse extract means the retention obligation was not met just because the production copy is gone.
- **B.** Correct. Retention applies to copies, and backups are copies; the practical answer is to let the backup's own schedule age the copy out rather than pretend the record is gone.
- **C.** A legal hold is triggered by pending litigation naming specific records, not by the ordinary act of a record existing inside a routine backup rotation.
- **D.** Sanitising the production copy thoroughly says nothing about the separate copy still sitting in the backup set, which is unaffected by how the primary was disposed of.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.backups-of-sensitive-data](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.backups-of-sensitive-data)

### 58. B

*linux.linux-operating-system.path · Linux Fundamentals :: Linux Operating System · depth 3 · application*

'Command not found' for a genuinely installed program is almost always a PATH problem: the installing directory is missing from PATH. `echo $PATH` confirms it, and PATH is searched left to right for the first match.

- **A.** `which` reports nothing found when a directory is missing from PATH just as readily as when a file is broken; PATH is the far more common cause and should be checked first.
- **B.** Correct. This is the guide's central trap for the concept: 'command not found' for something genuinely installed usually means the installing directory is missing from PATH, not that the install failed.
- **C.** PATH can be updated within a running shell session by exporting a new value; a restart is not required to fix a PATH omission, only re-exporting or reloading the relevant config.
- **D.** PATH is searched left to right, with the first match winning; this scenario is about a directory being absent entirely, and the search order itself would not rescue a missing entry.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.path](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.path)

### 59. A

*cloud.performance-availability.fault-tolerance · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

Fault tolerance is a property against a defined class of faults. A quorum design tolerates the loss of a minority of members, but a partition that isolates every member simultaneously is a correlated failure outside that class, and the system is not obligated to survive it.

- **A.** Correct. The definition is bounded: it guarantees continued correct operation for a stated class of faults, not immunity from every possible one.
- **B.** Treating fault tolerant as a synonym for always available is the specific error this concept is examined on; 100% availability is not an achievable target for any real service.
- **C.** Detection and failover describe high availability's recovery path; a fault-tolerant design has no switch to time in the first place.
- **D.** Quorum systems require a majority of members, which presupposes redundancy; the gap here is about fault class, not about whether redundancy exists.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.fault-tolerance](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.fault-tolerance)

### 60. A

*sysadmin.troubleshooting.out-of-memory-and-the-oom-killer · System Administration Fundamentals :: Troubleshooting · depth 4 · diagnostic*

A shell exit status of 137 is 128+9, the signature of SIGKILL, which is exactly how the OOM killer terminates its victim. The kill itself is recorded in the kernel ring buffer — readable live with `dmesg` or, from the journal, with `journalctl -k` — which is where "died for no reason, nothing in its own log" gets its explanation.

- **A.** Correct. 137 decodes to a fatal SIGKILL, and the kernel writes the killed process to the ring buffer, which `dmesg` reads live and `journalctl -k` reads from the journal.
- **B.** 137 is 128 plus a signal number and cannot come from a plain exit; the value itself already points at a fatal signal, here SIGKILL.
- **C.** CPU starvation does not send a process a fatal signal; a self-terminating process under load would ordinarily report an exit code, not 128+N.
- **D.** Command-not-found is exit status 127, a plain exit rather than a signal termination, and it is a different value entirely from 137.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.out-of-memory-and-the-oom-killer](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.out-of-memory-and-the-oom-killer)

