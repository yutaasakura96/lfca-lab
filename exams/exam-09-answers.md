<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 09 — answers

### 1. C

*sysadmin.best-practices.documentation · System Administration Fundamentals :: Best Practices · depth 3 · application*

Documentation is descriptive reference material consulted by a reader who has time and context. A runbook is prescriptive and written for a stranger under pressure; a change record and a dashboard each capture a narrower fact and neither substitutes for a current-state description of the system and its rationale.

- **A.** A runbook instructs a reader under pressure; it deliberately does not explain why the system is built the way it is.
- **B.** Even a change record carrying a justification explains one past decision rather than the configuration standing today, and this one carries only who and when.
- **C.** Correct. Documentation exists precisely to answer a why-question when there is time to read the answer.
- **D.** A dashboard shows present values, not intent; it is not documentation even though it describes the system.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.documentation](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.documentation)

### 2. C

*cloud.best-practices.avoid-hardcoded-credentials · Cloud Computing Fundamentals :: Best Practices · depth 2 · recall*

AWS's own remedy is to stop issuing long-lived keys rather than guard them better: the platform issues short-lived credentials to the running workload through its attached role, refreshes them automatically, and scopes them to that role's permissions, so nothing static is ever stored.

- **A.** That still keeps a static provider credential in existence; AWS's own remedy for provider access is to stop issuing keys at all, in favour of roles.
- **B.** Encryption protects the key at rest but does not shorten its lifetime or eliminate it as a credential that can be copied and reused.
- **C.** Correct. A role removes the static key from existence rather than moving it somewhere else to be guarded.
- **D.** Narrowing scope reduces the damage a leaked key can do, but the key itself still exists as a static, long-lived credential.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.avoid-hardcoded-credentials](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.avoid-hardcoded-credentials)

### 3. A

*linux.command-line.aliases · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

A script runs in a non-interactive shell, and bash does not expand aliases there unless `expand_aliases` is set with `shopt`. A name that exists only as an alias in the interactive shell is therefore not found when the same line runs inside a script. `alias` itself, run with no arguments, lists every alias currently defined.

- **A.** Correct. Bash does not expand aliases in a non-interactive shell unless `expand_aliases` is explicitly set, so a name that only exists as an alias in the interactive shell is simply not found inside a script.
- **B.** Aliases are not automatically available to a script; that is precisely the mechanism causing the failure, not a separate typo.
- **C.** Aliases cannot be exported the way variables can; there is no export mechanism that makes an alias visible to a non-interactive shell.
- **D.** An alias can be defined in `~/.bashrc` and used freely at an interactive prompt; the issue is specifically that a non-interactive script does not expand aliases at all by default.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.aliases](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.aliases)

### 4. A

*security.compliance.consequences-of-non-compliance · Security Fundamentals :: Compliance · depth 2 · discrimination*

A single incident can trigger regulatory action, contractual loss, mandatory notification, and reputational or commercial damage all at once, because they come from different authorities acting on different grounds. None of the four substitutes for, or cancels out, any of the others.

- **A.** Correct. The four consequence types come from different authorities and are not interchangeable, which is exactly the point worth holding.
- **B.** A single scenario can trigger all four named consequence types at once, each imposed by a different authority for a different reason.
- **C.** Nothing here limits how many consequence types a PCI-DSS-relevant breach can trigger; the card-acceptance loss is exactly a contractual consequence occurring alongside the others.
- **D.** Reputational damage lands last among the consequence types and is the one no remediation retracts, contradicting this option.

Study it: [04-security/compliance.md#c-security.compliance.consequences-of-non-compliance](../study-guide/04-security/compliance.md#c-security.compliance.consequences-of-non-compliance)

### 5. A

*devops.containers.container-security-basics · DevOps Fundamentals :: Containers · depth 2 · recall*

Container isolation is weaker than a virtual machine's because the kernel is shared, so a compromise inside a container that runs as root reaches further than the same compromise would inside a VM — the practical answer is running as a non-root user, not adding a scanner at the end.

- **A.** Correct. Shared-kernel isolation is weaker than a hypervisor boundary, which is exactly why root privileges inside a container carry more real risk than the phrase suggests.
- **B.** Namespaces narrow what a process can see, but they do not eliminate the shared-kernel attack surface a root process can still reach.
- **C.** A registry stores whatever it is pushed and performs no inspection of which user an image runs as.
- **D.** The user a process runs as has no effect on port publishing; `EXPOSE` and `-p` are unrelated to the container's user.

Study it: [05-devops/containers.md#c-devops.containers.container-security-basics](../study-guide/05-devops/containers.md#c-devops.containers.container-security-basics)

### 6. B

*pm.functional-analysis.requirements-prioritization · IT Project Management Fundamentals :: Functional Analysis · depth 2 · application*

Prioritization schemes are applied with a cap on the top band or forced ranking precisely because an unconstrained list tends to fill up with Must-haves. The value shows up only at the moment of pressure, converting a shortfall into a planned reduction of scope rather than an argument.

- **A.** Naming gaps between two states is gap analysis's output; labeling a backlog with MoSCoW does not perform that comparison.
- **B.** Correct. Prioritization only does work when it forces a choice about what gets dropped under pressure; a list that is entirely Must-have has ordered nothing.
- **C.** Nothing in the scenario distinguishes functional from non-functional; classification and priority are independent axes, and this labeling touches neither.
- **D.** This treats prioritization as a record of importance rather than a forced trade-off, which is the failure mode the scenario illustrates.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.requirements-prioritization](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.requirements-prioritization)

### 7. C

*sysadmin.best-practices.testing-before-production · System Administration Fundamentals :: Best Practices · depth 2 · recall*

Testing and a rollback path address different failure moments: testing tries to prevent the break, and the rollback path bounds it if testing missed something. A tested change with no way back is still an unbounded risk.

- **A.** Testing establishes nothing about whether a restorable copy exists; the two are separate disciplines.
- **B.** A test reduces the chance of failure; it does not bound the damage of the failure it missed.
- **C.** Correct. The two halves are separately examinable: testing lowers the odds of failure, and a rollback path limits the consequence of one.
- **D.** A window governs when disruptive work may happen, not how far the damage from a failed change can spread.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.testing-before-production](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.testing-before-production)

### 8. A

*cloud.best-practices.multi-zone-deployment · Cloud Computing Fundamentals :: Best Practices · depth 2 · recall*

The two providers' definitions are directly recallable and were fact-checked verbatim against their own documentation: AWS's zone code is the region code plus a letter, and Azure describes a zone as a separated group of datacenters with independent power, cooling and networking, typically within about 100 km of each other.

- **A.** Correct. Both descriptions match each provider's own published definition.
- **B.** AWS zone codes are region-scoped letters, not a global sequence, and Azure's zones are groups of datacenters, not single buildings.
- **C.** A zone is a subdivision within one region, not a region itself, and Azure does publish an availability zone concept.
- **D.** Zones sit inside one region and are typically within about 100 km of each other, not in a different country.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.multi-zone-deployment](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.multi-zone-deployment)

### 9. D

*sysadmin.disaster-recovery.hot-warm-and-cold-sites · System Administration Fundamentals :: Disaster Recovery · depth 3 · discrimination*

The tiers are separated by how much is already in place. A hot site is fully equipped with the most recent backup loaded and needs only the data written since. Real-time continuous mirroring belongs to the separate and more expensive mirrored site — a distinction that is easy to lose and is exactly where this question sits.

- **A.** That tier carries continuously mirrored real-time data and needs no catch-up at all.
- **B.** That holds hardware but not current data, which must be restored before it can serve.
- **C.** That provides space, power and environmental control only, with no hardware in place.
- **D.** Correct. Equipped and loaded with the latest backup, needing only the delta since, is the defining description.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.hot-warm-and-cold-sites](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.hot-warm-and-cold-sites)

### 10. C

*linux.command-line.command-substitution · Linux Fundamentals :: Command Line · depth 2 · recall*

Command substitution runs the inner command in a subshell, captures its standard output, strips trailing newlines, and splices the result into the surrounding word — which is exactly how `backup-$(date +%F).tar.gz` gets today's date baked into the archive name.

- **A.** Command substitution captures a command's output to build an argument; it does not pipe data between two commands the way a pipe operator does.
- **B.** Arithmetic expansion is written `$(( ... ))` and evaluates numbers; `$( ... )` with single parentheses runs a command and captures its output instead.
- **C.** Correct. Command substitution runs the inner command in a subshell, captures its standard output, strips trailing newlines, and splices the result into the word, which is how a runtime value becomes part of a filename.
- **D.** That would be the result of quoting the whole expression in single quotes; the unquoted `$(...)` form actively runs the command rather than treating it as literal text.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-substitution](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-substitution)

### 11. D

*security.compliance.controls-and-evidence · Security Fundamentals :: Compliance · depth 3 · application*

An assessor examines evidence by sampling rather than by checking every item the control produced. A clean sample supports, but does not prove, that the control operated correctly across the full population for the tested period.

- **A.** A representative sample supports a conclusion about the objects sampled; only a comprehensive examination reaches far enough to speak for the whole population.
- **B.** An audit's opinion covers a fixed scope and period; it is not a permanent state and does not extend indefinitely into the future.
- **C.** Whether approval happens before or after access is a design question about the control's function, not something this sample review establishes.
- **D.** Correct. NIST SP 800-53A Rev. 5 defines examination coverage in terms of a representative sample of assessment objects rather than the whole population.

Study it: [04-security/compliance.md#c-security.compliance.controls-and-evidence](../study-guide/04-security/compliance.md#c-security.compliance.controls-and-evidence)

### 12. B

*sysadmin.networking.dhcp-reservation · System Administration Fundamentals :: Networking · depth 3 · discrimination*

A DHCP reservation binds a specific MAC address to a fixed IP on the server side, giving a device like a hypervisor a stable, centrally managed address without visiting it or configuring it by hand — the client is configured for DHCP like any other client, and the stability comes entirely from the server.

- **A.** A static address is held by the host itself, not the server, and a static host does not depend on the DHCP server being reachable at boot the way a reservation-based client does.
- **B.** Correct. A reservation gives a device a predictable address without visiting it, and keeps every address in one authoritative place, the DHCP server, instead of scattering hand-written configurations across machines.
- **C.** A purely dynamic lease from the general pool gives no guarantee of address stability at all, which fails the requirement for a predictable address.
- **D.** A reservation requires no extra host-side configuration at all; the client is configured for DHCP like any other client, and the stability comes entirely from the server side.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dhcp-reservation](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dhcp-reservation)

### 13. D

*devops.containers.docker-compose · DevOps Fundamentals :: Containers · depth 3 · discrimination*

Compose and an orchestrator are a named confusable pair, and the dividing line is hosts plus persistence of intent: Compose applies a file to one machine once, while an orchestrator schedules across a fleet and keeps reconciling afterward — not how many containers are involved.

- **A.** Compose has no such container-count limit; a dozen containers on one host is well within its normal use, and container count is not what makes something an orchestrator.
- **B.** A Compose file is itself declarative, describing services, networks and volumes to be created; declarativeness is not what separates it from an orchestrator.
- **C.** A Compose file can reference a build context the same way a plain `docker build` can; build capability is not the dividing line described here.
- **D.** Correct. The number of containers is not the discriminator; Compose happily runs a dozen. Hosts and continuous reconciliation are what actually separate the two.

Study it: [05-devops/containers.md#c-devops.containers.docker-compose](../study-guide/05-devops/containers.md#c-devops.containers.docker-compose)

### 14. A

*cloud.budgeting.budgets-and-cost-alerts · Cloud Computing Fundamentals :: Budgeting · depth 3 · discrimination*

Each threshold is evaluated against either actual spend, which has already accrued, or forecast spend, which has not, so only a forecast threshold can warn before the money is gone. Both remain subject to a documented delay between a charge being incurred and the notification arriving.

- **A.** Correct. Forecast spend projects ahead and so is the only threshold type capable of warning before the money is actually gone, but a documented delay between a charge and its notification means both types can be outrun by spend that keeps moving.
- **B.** Actual spend has already accrued by definition; it can only report what has already happened, not warn ahead of it the way a forecast can.
- **C.** Rightsizing addresses provisioned-versus-utilised waste on existing resources, a different problem from being notified about approaching a spend target.
- **D.** Billing lags the usage it describes, so notification is never instantaneous — this is a documented caveat, not an edge case.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.budgets-and-cost-alerts](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.budgets-and-cost-alerts)

### 15. B

*linux.command-line.command-syntax · Linux Fundamentals :: Command Line · depth 3 · discrimination*

The GNU coreutils `ls --all` is equivalent to `-a`, but long options are a GNU convention, not a POSIX one, so a BSD or macOS userland can reject them outright even while the short forms keep working.

- **A.** POSIX defines only single-character options; long options like `--all` are a GNU extension with no portability guarantee.
- **B.** Correct. Long options are a GNU coreutils convention rather than a POSIX requirement, and the BSD `ls` shipped with macOS does not implement this one.
- **C.** An unrecognized option is reported as an error, not treated as a filter that matches nothing.
- **D.** There is no such fallback mapping; an unsupported long option is simply rejected.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-syntax](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-syntax)

### 16. B

*pm.open-source-software-and-licensing.forking-a-project · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

The fork is the structural reason open source governance disputes have an exit: no licence holder, foundation, or vendor can prevent a community that disagrees with a project's direction from continuing the code themselves, though the fork must be renamed since trademarks stay with the original.

- **A.** A platform fork is a routine contribution step that ends in a merge upstream; the right being exercised here is the governance-sense fork, a permanent divergence.
- **B.** Correct. The Open Source Definition requires that a licence permit modifications and derived works, which is the structural reason governance disputes have an exit.
- **C.** A fork does not inherit the project's trademark or name, but the code itself, under its licence, cannot be revoked from a fork that took a lawful copy.
- **D.** A foundation provides legal and governance infrastructure, not technical direction, which stays with the project's maintainers rather than the foundation itself.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.forking-a-project](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.forking-a-project)

### 17. A

*sysadmin.networking.fqdn-and-hostname · System Administration Fundamentals :: Networking · depth 3 · application*

A hostname is only meaningful relative to a search domain, so the same short label can succeed on one host and fail on another; an FQDN locates the host absolutely within the DNS hierarchy, which is exactly why configuration that must work everywhere — TLS certificates, mail routing, cluster membership — uses FQDNs.

- **A.** Correct. Configuration that must work everywhere — TLS certificates, mail routing, cluster membership — uses FQDNs for exactly this reason: an unqualified name depends on local context to resolve at all.
- **B.** A bare hostname is only meaningful relative to a local search domain; a certificate authority has no such local context, which is exactly why an FQDN is required.
- **C.** `hostname -f` resolves a qualified name that can differ from the plain hostname depending on `/etc/hosts` or DNS; the two are not guaranteed to be identical.
- **D.** The transient hostname is a runtime label, not a DNS-hierarchy name; it is unrelated to whether a name is fully qualified, which is what certificate issuance actually requires.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.fqdn-and-hostname](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.fqdn-and-hostname)

### 18. A

*sysadmin.networking.mac-address · System Administration Fundamentals :: Networking · depth 3 · application*

A host fills in its own MAC as source and the next hop's MAC as destination; each router that forwards the packet strips the old frame and builds a new one with new MAC addresses, while the IP addresses in the packet stay untouched end to end — the key exam fact about MAC addresses is negative: they never cross a router.

- **A.** Correct. Each router strips the old frame and builds a new one with new source and destination MAC addresses for the next hop, while leaving the IP addresses in the packet untouched.
- **B.** This reverses the actual behaviour: MAC addresses are rewritten hop by hop while IP addresses are what remain constant end to end.
- **C.** A router necessarily rebuilds the frame with new source and destination MAC addresses for the next hop; only the IP addresses are left untouched.
- **D.** IP addresses are preserved end to end specifically so the packet can be routed toward its ultimate destination; only the MAC addresses are rewritten hop by hop.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.mac-address](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.mac-address)

### 19. D

*security.security.denial-of-service · Security Fundamentals :: Security · depth 3 · discrimination*

The comparison's separating axis is whether anything runs on the victim host: a denial of service overwhelms a system from outside without executing on it, while malware and ransomware require code on the host and therefore leave the data itself in question in a way pure traffic exhaustion does not.

- **A.** The comparison does not rank the two by severity; it separates them by whether code executes on the victim, and ransomware also affects availability once files are encrypted.
- **B.** Duration is not the property the table tracks; both can last from minutes to weeks depending on the response, and the axis is about what runs where, not how long it takes.
- **C.** Attacker identification practices vary case by case for both attack types and are not the axis the comparison table is built around.
- **D.** Correct. The comparison names execution on the victim as the separating axis: a DoS needs only traffic, while ransomware and malware generally require something to run.

Study it: [04-security/security.md#c-security.security.denial-of-service](../study-guide/04-security/security.md#c-security.security.denial-of-service)

### 20. D

*cloud.budgeting.storage-tiers-and-lifecycle-policies · Cloud Computing Fundamentals :: Budgeting · depth 3 · discrimination*

The separating axis is which question is being answered: object, block and file storage names how data is addressed, decided first, while tiers and lifecycle policies name what it costs to keep and retrieve data already stored that way, decided after and revisited continuously.

- **A.** Tiers are a cost and access-latency class inside a storage service already chosen; they do not determine how data is addressed to begin with.
- **B.** Rightsizing is a compute-capacity practice about matching provisioned size to demand; storage type and tier are a separate decision pair with their own axis.
- **C.** A tier change or lifecycle rule keeps the data's address and interface intact, while a storage-type change moves it to a service with a different API and access protocol — the two are not equally reversible.
- **D.** Correct. Object, block and file storage name how data is addressed and presented — the top-level choice any tiering question presupposes — while tiers and lifecycle rules are decided after, and revisited continuously as data ages.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.storage-tiers-and-lifecycle-policies](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.storage-tiers-and-lifecycle-policies)

### 21. A

*linux.command-line.file-management-commands · Linux Fundamentals :: Command Line · depth 3 · discrimination*

A hard link is an additional directory entry pointing at the same inode, with no "original." Deleting either name leaves the data reachable through the other, and the link count `ls -l` shows drops by one.

- **A.** Correct. A hard link is an additional directory entry pointing at the same inode; there is no "original," so deleting one name leaves the data reachable through the other while the link count in `ls -l`'s second column falls by one.
- **B.** A hard link has no primary or original entry; the inode and its data persist as long as any directory entry still references it.
- **C.** Dangling references are a symbolic-link failure mode, where the link is a separate file holding a path; a hard link has no such concept because it is a second name for the same inode.
- **D.** For a regular file, the link count in `ls -l`'s second column is exactly the number of hard-linked names; it does change when one is removed.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-management-commands](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-management-commands)

### 22. C

*devops.devops-basics.blue-green-deployment · DevOps Fundamentals :: DevOps Basics · depth 3 · discrimination*

Each strategy fails differently. Blue-green never splits traffic and suits an all-at-once, lockstep change; canary splits it deliberately to learn from production; a rolling deployment splits it only as a side effect of replacing instances.

- **A.** A canary briefly runs both versions against a live database, which is exactly what an incompatible schema change cannot tolerate.
- **B.** A rolling deployment guarantees a mixed-version window, which is precisely what an incompatible schema change cannot survive.
- **C.** Correct. Lockstep, incompatible changes need an all-at-once cutover, and evaluating a safe change on real traffic is exactly what a canary is for.
- **D.** Blue-green needs a full second environment and gives up the chance to learn from real traffic, which the second release does not need to pay for.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.blue-green-deployment](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.blue-green-deployment)

### 23. D

*sysadmin.networking.open-closed-and-filtered-ports · System Administration Fundamentals :: Networking · depth 4 · diagnostic*

Timing the failure is the first diagnostic move: an instant refusal means the host is up and reachable, pointing at the service or its bind address, while a timeout means nothing answered at all — testing a known-open port like 22 alongside the failing one isolates whether the filtering is selective by port or a blanket problem, and `ss -tulpn` on the server itself is the complementary check from the listening side, before reading any firewall policy.

- **A.** A timeout and an instant success are opposite outcomes with different diagnostic meanings; treating them as equally indicating the same cause discards the most useful evidence in the report.
- **B.** A working connection on port 22 to the same host at the same time is genuine evidence of reachability, not a stale cache; the host is clearly reachable, and only port 8443 specifically is affected.
- **C.** Reading firewall rules before checking the server's own listening state is how administrators spend an hour on a firewall that was never involved; the server's bind address should be checked first.
- **D.** Correct. A silent timeout is the signature of packet filtering rather than of a missing service: a closed port answers at once, so no answer at all means the probe or its reply was dropped. Because a different port on the same host answers instantly, routing and host reachability are already excluded, leaving a fault specific to 8443.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.open-closed-and-filtered-ports](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.open-closed-and-filtered-ports)

### 24. B

*cloud.cloud-computing.cloud-migration-approaches · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · application*

AWS notes that common strategies for large migrations are rehost, replatform, relocate and retire, and recommends against refactoring during the migration itself, since modernising while moving is the most complex option and hard to manage across many applications — the recommended sequence is to migrate cheaply first with one of the low-effort strategies, then modernise afterward once the workload is safely running in the cloud.

- **A.** AWS names relocate, not repurchase, as the quickest strategy, and using one strategy for every application ignores that each workload is assessed and assigned individually.
- **B.** Correct. This matches AWS's own guidance directly: modernise after the move, not during it, because refactoring while migrating compounds the complexity of both efforts at once.
- **C.** AWS reserves 'quickest' for relocate specifically, because it leaves the application's architecture untouched; refactor is the strategy AWS calls the most complex and costly, the opposite of quick.
- **D.** AWS lists retire and retain as legitimate strategies in their own right; a portfolio assessment that retires an unused application or retains one with a hardware dependency avoids unnecessary migration cost entirely.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-migration-approaches](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-migration-approaches)

### 25. D

*pm.open-source-software-and-licensing.software-bill-of-materials · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 1 · recall*

An SBOM is an inventory, increasingly required for supply-chain transparency. It is not itself a compliance artifact and not a vulnerability scan: it makes licence and CVE questions answerable, and resolves neither on its own.

- **A.** Producing an inventory does not discharge any licence obligation; compliance still requires separately meeting each component's own terms.
- **B.** An SBOM records what was shipped; it does not verify that the components were legally combinable in the first place.
- **C.** An SBOM is an inventory, not a vulnerability scan; it makes CVE questions answerable against the listed versions but performs no scan itself.
- **D.** Correct. An SBOM is a machine-readable inventory, commonly in SPDX or CycloneDX format; it enumerates rather than resolves anything.

Study it: [06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-compliance](../study-guide/06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-compliance)

### 26. D

*sysadmin.networking.routing-table · System Administration Fundamentals :: Networking · depth 3 · application*

Selection is by longest prefix match: the /24 route, with 24 matching bits, beats the default route's 0 matching bits, regardless of listing order; `ip route get 198.51.100.7` asks the kernel to show which entry it would actually choose, settling any argument.

- **A.** The default route has the weakest possible match, 0 bits; it is chosen only when nothing more specific matches, never given special priority over a more specific route.
- **B.** Selection is by longest prefix match, not by the order entries were added; a later-added, more specific route still wins over an earlier, less specific one.
- **C.** Print order in `ip route` output does not determine which route is selected; the selection is decided by prefix length, and `route get` proves it independently of display order.
- **D.** Correct. Selection is by longest prefix match regardless of listing order, and `ip route get` settles the question definitively by asking the kernel directly rather than inferring from the printed table.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.routing-table](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.routing-table)

### 27. B

*security.security.hashing · Security Fundamentals :: Security · depth 3 · recall*

A hash is a one-way function: the same input always produces the same fixed-length digest, but there is no operation, key, or salt that recovers the input from the digest. "Decrypt the hash" describes something hashing was never designed to do.

- **A.** Neither MD5 nor SHA-256 is reversible; both are one-way hash functions regardless of which is used.
- **B.** Correct. The guide states directly that "decrypt the hash" is never the answer, because a digest carries no key and the function cannot be inverted.
- **C.** A salt applies to password hashing to prevent identical inputs producing identical outputs; it does not make any hash function reversible.
- **D.** `gpg --verify` checks a signature against a file; it has no capability to reconstruct a file's contents from a hash of it.

Study it: [04-security/security.md#c-security.security.hashing](../study-guide/04-security/security.md#c-security.security.hashing)

### 28. C

*linux.command-line.grep · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`grep` searches the bytes inside files line by line, which is exactly what "the text stored in a file" scenarios ask for, no matter how the question is phrased. `find` and `locate` answer questions about a file's identity — name, type, size, timestamps — not its contents. The everyday option set rounds out with `grep -i` for case-insensitive matching, `grep -v` to invert the selection, and `grep -n` to number the matches.

- **A.** `find`'s expression language filters on name, type, size, timestamp, ownership and permission — none of which reaches into the bytes of a file the way `grep` does.
- **B.** `locate`'s index holds filenames from a periodic scan, not file contents, so it cannot answer a question about text appearing inside a file.
- **C.** Correct. `grep` searches the bytes inside files line by line, which is exactly what "mentioning the string" asks for; `find` and `locate` answer questions about a file's identity, not its contents.
- **D.** `whereis` locates a command's binary, source and manual page in a fixed set of directories; it has no notion of searching arbitrary log text.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.grep](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.grep)

### 29. A

*sysadmin.networking.well-known-ports · System Administration Fundamentals :: Networking · depth 3 · discrimination*

Strictly, IANA calls only 0-1023 the well-known or system range; 1024-49151 are registered ports and 49152-65535 are the dynamic or private range — 3306, 3389 and 5432 sit above 1023, so they are registered ports, not well-known ones, however familiar they are.

- **A.** Correct. The terminology trap is exactly this: 3306, 3389 and 5432 sit above 1023, so they are registered ports, not well-known ones, regardless of how commonly they are used.
- **B.** Common recognition and consistent use do not define the well-known range; that range is strictly 0-1023 by IANA definition, and 3306 and 5432 fall outside it in the registered range.
- **C.** 3306 and 5432 fall in the 1024-49151 registered range, well below the 49152-65535 dynamic range; the correct correction is registered, not dynamic.
- **D.** Neither 3306 nor 5432 falls below 1024; both are above it, in the registered range, so neither one genuinely belongs in the well-known range.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.well-known-ports](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.well-known-ports)

### 30. A

*cloud.cloud-computing.iaas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Renting a virtual machine does not rent an administered one. From the guest OS boot loader upward the machine behaves exactly like a server in a rack, so kernel patching, host firewall rules and application configuration remain the customer's work — the misconception that the provider covers this is the source of most wrong answers on shared responsibility questions.

- **A.** Correct. NIST's IaaS definition gives the consumer control of the operating system, and patching it is part of that control.
- **B.** AWS's shared responsibility model puts the host operating system and virtualization layer on the provider and the guest operating system, 'including updates and security patches', on the customer.
- **C.** Enabling auto-updates is a customer configuration choice made within their own responsibility, not a transfer of that responsibility to the provider.
- **D.** Automatic runtime patching describes PaaS; an IaaS instance is a raw building block with no such platform-managed runtime layer.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.iaas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.iaas)

### 31. A

*devops.devops-basics.shift-left · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

Shift left moves when testing and security happen, earlier in the lifecycle where a defect is cheaper to fix. It does not mean developers absorb the QA or security team's job; the sharing of responsibility is unchanged.

- **A.** Correct. The concept is explicitly about timing rather than reassigning ownership of the work.
- **B.** This is the exact conflation the guide warns against: earlier is a when, not a transfer of who does the work.
- **C.** A remaining downstream gate is not why the answer is no; the definition itself rules out the transfer being described.
- **D.** Shortening detection time is a feedback-loop concern and does not require developers to absorb another team's checks.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.shift-left](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.shift-left)

### 32. D

*sysadmin.system-administration.crontab-syntax · System Administration Fundamentals :: System Administration · depth 5 · application*

When both the day-of-month and day-of-week fields are restricted (neither is `*`), cron combines them with OR rather than AND: the command runs when either matches. `30 4 1,15 * 5` therefore runs at 04:30 on the 1st and 15th and every Friday — a genuinely counter-intuitive rule worth memorising precisely. Entries like this are installed through `crontab -e`.

- **A.** The two day fields do not combine with AND; treating them that way would make the job run far less often than the five-field syntax specifies.
- **B.** Neither day field is ever silently ignored — when both are restricted, both take effect and combine with OR.
- **C.** Both restricted day fields take effect together via OR; the day-of-month field is not overridden by the day-of-week field.
- **D.** Correct. When both day fields are restricted, they combine with OR rather than AND, so either condition being satisfied triggers the run.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.crontab-syntax](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.crontab-syntax)

### 33. C

*linux.command-line.redirection · Linux Fundamentals :: Command Line · depth 3 · application*

The shell opens the target and attaches it to the named descriptor before executing the command, so ordering matters. `command > out 2>&1` points descriptor 1 at `out`, then points descriptor 2 at wherever 1 now points — both end up in the file. Reversed, descriptor 2 is pointed at the terminal before descriptor 1 moves, so errors stay on screen.

- **A.** The two forms differ specifically because of ordering: descriptor duplication captures the *current* destination at the moment it runs, which is why placement relative to `> out` changes the result.
- **B.** This reverses the actual outcome: it is `> out 2>&1` that merges both into the file, not `2>&1 > out`.
- **C.** Correct. Order matters: `> out 2>&1` first points descriptor 1 at the file, then points descriptor 2 at wherever 1 now points; `2>&1 > out` copies descriptor 1's destination — the terminal — into descriptor 2 first, and only then moves descriptor 1 to the file.
- **D.** `> out 2>&1` is exactly the portable way to merge both streams into one file; `&>` is a shorter but non-portable bash/zsh shortcut for the same result.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.redirection](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.redirection)

### 34. C

*security.security.incident-response · Security Fundamentals :: Security · depth 2 · application*

Containment isolates affected systems while investigation is still possible, and it precedes eradication for exactly that reason. Wiping and rebuilding before scope is established destroys the evidence needed to confirm whether the attacker is still present elsewhere, which is the concrete cost of acting out of order.

- **A.** The guide states directly that acting out of sequence is the characteristic wrong answer, and order matters here because eradicating first destroys evidence containment would have preserved.
- **B.** Preparation is the phase completed before anything happens — plans, contacts, tested backups — not a step that occurs mid-incident after identification.
- **C.** Correct. Containment precedes eradication precisely because stopping the spread first preserves the investigation; wiping and rebuilding before scope is known destroys that evidence.
- **D.** The lessons-learned review is the final step, occurring after recovery, not a step that belongs immediately after identification.

Study it: [04-security/security.md#c-security.security.incident-response](../study-guide/04-security/security.md#c-security.security.incident-response)

### 35. B

*pm.project-management.agile · IT Project Management Fundamentals :: Project Management · depth 3 · discrimination*

Agile's fourth value statement ranks responding to change above following a fixed plan, without abolishing planning; Team A revises what it does as it learns. Waterfall instead evaluates whether each phase completed and was signed off before the next began, a sequencing judgement, not a values one — conflating the two levels is the common mistake.

- **A.** Team A plans each cycle, but the point of the practice is that the plan is revised as more is learned, not followed at the expense of change.
- **B.** Correct. Short cycles with revision based on feedback is exactly the mechanism the fourth value statement implies; a waterfall judgement would instead check phase-gate sign-off, which is a different question entirely.
- **C.** The Manifesto states the lower-ranked item still has value; 'no plan at all' is the misreading it explicitly warns against.
- **D.** Standups and sprint reviews belong to Scrum, one framework beneath agile's values — the Manifesto itself specifies no events.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.agile](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.agile)

### 36. B

*sysadmin.system-administration.daemon · System Administration Fundamentals :: System Administration · depth 3 · application*

A daemon is a long-running background process with no controlling terminal, typically started at boot. A job merely backgrounded with `&` is still attached to its terminal session and, without `nohup` or `disown`, is usually killed when that session ends — it has not detached the way a daemon does.

- **A.** Not every background process is a daemon: this one is still attached to a terminal session and is typically killed when that session ends.
- **B.** Correct. Backgrounding with `&` does not detach a process from its terminal session, which is exactly what distinguishes an ordinary background job from a daemon.
- **C.** How a process is started does not determine whether it is a daemon; what matters is whether it has detached from a controlling terminal.
- **D.** The distinction is about terminal attachment and lifetime, not about what category of program is running.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.daemon](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.daemon)

### 37. A

*cloud.cloud-computing.private-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

NIST does not address single-tenant hardware inside a public platform directly, so the guide treats it as an application of the definition: the surrounding infrastructure is still provisioned for open use by the general public, which makes the dedicated host a public-cloud feature rather than a private cloud of its own, even though only one customer's workload runs on that specific machine.

- **A.** Correct. The guide treats this exact case as an application of the definition rather than a literal quotation from it, and the reasoning is that the platform around the host remains open to any customer.
- **B.** Exclusivity applies to the surrounding cloud infrastructure NIST is describing, not to one physical machine carved out of an otherwise open platform.
- **C.** Nothing in NIST's public cloud definition forbids single-tenant hardware within it; the host being dedicated does not remove the surrounding platform from being provisioned for open use.
- **D.** Hybrid requires two or more distinct, bound-together cloud infrastructures with portability between them; one dedicated host inside one platform is not that composition.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.private-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.private-cloud)

### 38. B

*sysadmin.system-administration.foreground-and-background-jobs · System Administration Fundamentals :: System Administration · depth 3 · application*

Ctrl-Z suspends the foreground job with SIGTSTP. `bg` sends SIGCONT and lets it continue running in the background under a job number such as `%1`; `fg` later brings that same job back to the foreground and reattaches the terminal.

- **A.** `nohup` only makes a process immune to the hangup signal; it does not resume a job that Ctrl-Z has stopped, and it does not background anything by itself.
- **B.** Correct. `bg` sends SIGCONT and lets the stopped job continue running in the background; `fg` reattaches the terminal to it afterward.
- **C.** `jobs` only lists the current jobs; it does not change any job's state, and `kill` sends a signal rather than restoring foreground attachment.
- **D.** Ctrl-C sends SIGINT, which typically terminates the job rather than resuming a stopped one; Ctrl-Z only ever suspends.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.foreground-and-background-jobs](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.foreground-and-background-jobs)

### 39. B

*devops.git-concepts.clone-vs-fork · DevOps Fundamentals :: Git Concepts · depth 3 · discrimination*

Clone versus fork, and forking-a-project in the open-source sense, share only the word: a platform fork or a `git clone` is a mechanical copy made routinely, by any contributor, in order to send changes back; forking a project is a rare, deliberate, permanent split that a project's open-source licence explicitly protects the right to make.

- **A.** A platform fork changes nothing about the original repository or its ownership; it only creates a separate server-side copy under the forker's own account.
- **B.** Correct. That is the block's stated separating axis: one is a routine first step toward a pull request, the other is a rare governance act that the licence, not the platform, makes possible.
- **C.** The two senses share a word but not a meaning: one is a routine, frequent contribution step, the other a rare and deliberate community split, usually after a governance dispute.
- **D.** There is no `git fork` command at all — forking is a hosting-platform feature, not something Git itself does — so neither sense of the word involves one.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.clone-vs-fork](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.clone-vs-fork)

### 40. D

*linux.command-line.standard-streams · Linux Fundamentals :: Command Line · depth 3 · application*

Errors travelling on their own descriptor is the design decision that makes redirection and piping predictable: a pipe only connects descriptor 1 by default, so piping a command's output to `grep` does not filter its error messages.

- **A.** Only descriptor 1 is connected by a plain pipe; the assumption that error text is included by default is exactly the mistake the exam probes.
- **B.** `grep` has no awareness of which stream text came from; it simply matches lines against a pattern on whatever standard input it is given.
- **C.** A pipeline runs fine with no redirection at all; `2>` is only needed if the error stream specifically needs to be captured or discarded.
- **D.** Correct. The pipe operator wires standard output to the next command's standard input; standard error stays attached to the terminal unless it is explicitly merged first with `2>&1 |` or `|&`.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.standard-streams](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.standard-streams)

### 41. B

*cloud.networking.cloud-load-balancer-types · Cloud Computing Fundamentals :: Networking · depth 2 · application*

A layer 4 load balancer forwards connections by address and port and does not read the application protocol at all, which is what makes it suited to an arbitrary TCP or UDP protocol with minimal added latency.

- **A.** Layer 7 parsing is specifically built around the application protocol, commonly HTTP; an arbitrary non-HTTP TCP protocol is exactly what it is not designed to interpret, and the parsing step adds the latency the requirement rules out.
- **B.** Correct. This matches the documented behaviour of a layer 4 balancer, which never reads the application protocol.
- **C.** DNS distribution happens once at resolution time and cannot adapt per connection the way a load balancer's ongoing forwarding decision can; it answers a different requirement than the one stated.
- **D.** Private connectivity keeps traffic off the public internet but is not a load-balancing mechanism at all — it has no notion of distributing connections across backend servers.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cloud-load-balancer-types](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cloud-load-balancer-types)

### 42. B

*security.security.multi-factor-authentication · Security Fundamentals :: Security · depth 3 · application*

SMS one-time codes are a real second factor but not a phishing-resistant one: a real-time relay captures and replays them before the code expires. Phishing-resistant authenticators such as FIDO2 security keys bind their response to the legitimate site, which is what actually stops this attack.

- **A.** The guide states plainly that MFA reduces phishing damage but does not end it, because a relay can capture and replay a code the user was tricked into providing.
- **B.** Correct. An SMS code is a genuine second factor but is not phishing-resistant, so a relay that captures and replays it in real time defeats it — a security key's response is bound to the real site and cannot be relayed the same way.
- **C.** A password is something you know and an SMS code relies on possession of the phone, so this is genuinely two distinct factor categories, unlike a password plus a security question.
- **D.** The failure here is at authentication — the attacker proved possession of valid credentials — not a subsequent authorization policy decision.

Study it: [04-security/security.md#c-security.security.multi-factor-authentication](../study-guide/04-security/security.md#c-security.security.multi-factor-authentication)

### 43. C

*sysadmin.system-administration.owner-group-other · System Administration Fundamentals :: System Administration · depth 3 · application*

The kernel checks owner, group, and other in that order and stops at the first class that applies. `alice` is the owner, so the owner triad (`rw-`) governs her access regardless of what the group or other triads say, as read directly from `ls -l`.

- **A.** Class matching stops at the first match; membership in the group does not pull a more restrictive triad in for the owner.
- **B.** Classes do not need to agree with one another; only the first matching class is consulted at all.
- **C.** Correct. The owner triad is checked first and, once matched, the group and other triads are never consulted for that user.
- **D.** Owner privilege comes from being the file's owner, not from appearing in the group's supplementary member list.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.owner-group-other](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.owner-group-other)

### 44. A

*linux.linux-operating-system.device-drivers-and-kernel-modules · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`lsmod` only lists loaded modules; a built-in driver never appears there even though it is active. `modprobe` loads a module and resolves dependencies automatically, unlike the more primitive `insmod`.

- **A.** Correct. The guide's own trap: a built-in driver never appears in `lsmod` even though it is active, so absence from that list does not by itself mean a module is missing.
- **B.** `lsmod` not listing firmware is expected and unrelated; the immediate next step is checking for a loadable module or a built-in driver before considering firmware.
- **C.** `insmod` loads exactly the file given with no dependency resolution, unlike `modprobe`, which resolves dependencies automatically — the two are not interchangeable.
- **D.** This is precisely the mistake the guide warns against: a built-in driver is active but never appears in `lsmod`, so the list is not complete in that sense.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.device-drivers-and-kernel-modules](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.device-drivers-and-kernel-modules)

### 45. D

*pm.project-management.scrum-roles · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

The three Scrum accountabilities are distinct: the Product Owner owns Product Backlog ordering and value, the Scrum Master owns the process and impediment removal, and the Developers own how the work gets done. Anyone wanting the backlog changed does so by convincing the Product Owner, whose decisions the organisation must respect.

- **A.** Ordering authority is not distributed to whoever hears the request first; it belongs specifically to the Product Owner.
- **B.** The Scrum Master owns the process and coaches self-management, not backlog ordering, which is the Product Owner's accountability.
- **C.** The Daily Scrum is for the Developers to inspect progress toward the Sprint Goal, not a channel for stakeholders to reprioritise work.
- **D.** Correct. The Product Owner is accountable for effective Product Backlog management, including ordering; that authority is not shared with the Developers.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.scrum-roles](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.scrum-roles)

### 46. D

*sysadmin.system-administration.process · System Administration Fundamentals :: System Administration · depth 3 · application*

A process is a running instance of a program: its own PID, address space, open files, and credentials. One program file can be executed many times over, producing as many independent processes, each separately identified by its PID.

- **A.** The file on disk is the program; each execution of it is a separate process with its own memory and PID, regardless of how many copies of the file exist.
- **B.** Neither invocation is managed by an init system with a restart policy, so "service" is not the right term for either.
- **C.** A process has exactly one parent and therefore one PPID; two independent invocations are two separate processes, not one with two parents.
- **D.** Correct. A process is a running instance, not the file on disk, so each independent invocation gets its own PID even though the underlying program is identical.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.process](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.process)

### 47. C

*cloud.networking.hybrid-connectivity · Cloud Computing Fundamentals :: Networking · depth 3 · discrimination*

A dedicated circuit establishes a private path that never enters the public internet, but encryption of the payload is a separate decision from that path's privacy — the two properties are not the same thing.

- **A.** Microsoft states plainly that by default traffic over an ExpressRoute connection is not encrypted; keeping traffic off the public internet is a property of the path, not of the payload.
- **B.** That documented encryption applies to peering between two cloud networks on AWS's own backbone; a dedicated circuit to an on-premises site is a different mechanism and is not covered by that same guarantee.
- **C.** Correct. Microsoft states that by default traffic over an ExpressRoute connection is not encrypted, and documents encryption as a separate option you add.
- **D.** Security groups filter by address, port, and protocol; they have no mechanism for imposing encryption on a dedicated circuit's payload.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.hybrid-connectivity](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.hybrid-connectivity)

### 48. D

*devops.git-concepts.merge-conflict · DevOps Fundamentals :: Git Concepts · depth 3 · command*

`git status` lists conflicted paths under "Unmerged paths" and states that staging with `git add` is how resolution is marked; `git diff` complements that by showing a combined three-way diff against HEAD and MERGE_HEAD during a conflict, rather than its ordinary working-tree-versus-index comparison.

- **A.** A conflict is a special case: `git diff` switches to a three-way combined diff against both merge parents instead of its usual working-tree-versus-index comparison.
- **B.** `git diff` works normally during a conflict; it is one of the two commands `git status` points to for understanding what needs resolving, alongside listing the unmerged paths.
- **C.** Listing commits is `git log`'s job, based on reachability from a ref; `git diff` reports line-level content differences, not a set of commit objects.
- **D.** Correct. During a conflict, `git diff` reports the combined view against both parents of the pending merge, which is more informative than reading the conflict markers alone.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.merge-conflict](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.merge-conflict)

### 49. C

*sysadmin.system-administration.signals · System Administration Fundamentals :: System Administration · depth 3 · application*

`kill` sends SIGTERM by default, which a well-behaved daemon can catch to flush buffers, close files, and release locks before exiting. SIGKILL should be reserved for a process that does not respond, since it gives no opportunity to clean up. `killall` and `pkill` send the same signals but select processes by name or pattern rather than by PID.

- **A.** SIGKILL removes the process from the scheduler immediately with no chance to clean up, which is the opposite of what an orderly shutdown needs as a first move.
- **B.** SIGSTOP freezes the process rather than asking it to exit, and it cannot be caught or handled by the program at all.
- **C.** Correct. `kill` sends SIGTERM by default, and unlike SIGKILL it can be caught by a handler that performs an orderly shutdown.
- **D.** SIGHUP is conventionally used to ask a daemon to reload its configuration, not to terminate it.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.signals](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.signals)

### 50. A

*security.security.selinux-and-apparmor · Security Fundamentals :: Security · depth 3 · discrimination*

The separating axis is instance versus category: SELinux and AppArmor are specific products implementing one of the models, queried through commands like `getenforce` and `aa-status` and configured through `/etc/selinux/config` or AppArmor profiles, while access control models names the broader classification scheme — discretionary, mandatory, role-based — that those products are examples within.

- **A.** Correct. The comparison's separating axis is exactly this: one names concrete tools you install, configure and query, the other names the classification scheme those tools are examples within.
- **B.** SELinux and AppArmor implement the mandatory model, not the role-based one, and access control models as a taxonomy covers all three schemes including role-based.
- **C.** Access control models is an operating-system-agnostic taxonomy, not one scoped to particular platforms other than Linux.
- **D.** The reverse is true — SELinux and AppArmor are the command-bearing concept here, queried with `getenforce` and `aa-status`, while access control models is the conceptual taxonomy.

Study it: [04-security/security.md#c-security.security.selinux-and-apparmor](../study-guide/04-security/security.md#c-security.security.selinux-and-apparmor)

### 51. B

*linux.linux-operating-system.multi-user-and-multitasking · Linux Fundamentals :: Linux Operating System · depth 2 · recall*

Linux is designed to run many users and many processes concurrently, each isolated from the others by the kernel. Process ownership and permission checks are what let identically named processes coexist safely, whoever launched them.

- **A.** Shells do not rename running processes to avoid collisions; process identity is tracked by process ID, not by program name uniqueness.
- **B.** Correct. Multi-user, multitasking isolation is what the guide names as the reason two same-named processes coexist without interfering.
- **C.** Standard multi-user Linux runs one kernel shared by all logged-in users; per-user kernel isolation is not what makes this scenario safe.
- **D.** Both processes genuinely run concurrently, time-sliced across the CPU; neither is silently queued behind the other.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.multi-user-and-multitasking](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.multi-user-and-multitasking)

### 52. B

*sysadmin.system-administration.usr · System Administration Fundamentals :: System Administration · depth 2 · recall*

`/usr` is shareable and static, and package managers own everything under it except `/usr/local`, which is left alone for the local administrator. That division is exactly why software built from source conventionally installs into `/usr/local/bin` rather than risking a package update overwriting it.

- **A.** `/usr` being "read-only" describes the FHS convention that nothing there should change during normal operation, not a hard filesystem-level write restriction.
- **B.** Correct. Keeping locally built software in its own subtree is what protects it from being clobbered when the package manager updates the rest of `/usr`.
- **C.** `$PATH` ordering is a separate configuration choice and is not the reason the FHS reserves this subtree for locally built software.
- **D.** FHS 4.4 titles `/usr/bin` "Most user commands"; it holds ordinary user-land programs installed by the distribution's package manager and is not tied to the kernel.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.usr](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.usr)

### 53. C

*cloud.performance-availability.content-delivery-network · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · recall*

The origin holds the original, definitive copy. A viewer's request resolving to a nearby edge that has never seen the object still requires a fetch from the origin before anything can be returned; only subsequent requests to that edge are served from its cache.

- **A.** Edge locations are geographically distributed caches; a miss at one is not automatically covered by another edge holding a copy.
- **B.** Invalidation removes an object before its time-to-live expires when content changes; it has no role in serving a first, uncached request.
- **C.** Correct. A CDN does not make the origin faster and does not help the very first request to a given edge, which must be satisfied from the origin.
- **D.** A CDN is typically pull-based: edges fetch on demand from the origin and retain a copy, rather than the origin proactively pushing to every location.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.content-delivery-network](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.content-delivery-network)

### 54. C

*pm.project-management.triple-constraint · IT Project Management Fundamentals :: Project Management · depth 3 · application*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

The triple constraint holds that scope, time and cost bound quality; fixing any two forces the third — or, if none may move, quality — to absorb the change. 'The team works harder' names none of the three legs and is the trap answer; adding scope without adjusting schedule or cost only relabels the same problem.

- **A.** Extra effort from the same team is not one of the three legs; it typically produces slower delivery, not a free absorption of more scope.
- **B.** A milestone is a schedule marker, not one of the three legs the model bounds — adding one doesn't answer what actually gives.
- **C.** Correct. Fixing two of the three legs — schedule and cost here — determines the third; with scope added and nothing else allowed to move, quality is what gives.
- **D.** Treating an unassessed addition as minor is exactly how scope creep starts, not a way of avoiding a trade-off.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.triple-constraint](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.triple-constraint)

### 55. C

*sysadmin.system-administration.var-log · System Administration Fundamentals :: System Administration · depth 3 · application*

`tail -f` follows the specific file descriptor it opened, which after rotation still points at the old, now-static file under its renamed path. `tail -F` follows the *name* instead, reopening the newly created file once rotation replaces it — the option that keeps working across a rotation.

- **A.** `-f` stays with the original inode it opened, which is exactly what stops updating the moment the log is rotated away under a new name.
- **B.** less(1) says the F command behaves similarly to `tail -f`, and that without `--follow-name` less keeps displaying the original file when it is renamed; the option that specifically reopens by name is `tail -F`.
- **C.** Correct. `-f` keeps holding the original file descriptor, which now points at the renamed, no-longer-growing file; `-F` notices the name has a fresh file and reopens it.
- **D.** `tail -F` is specifically designed to survive rotation by reopening the file under its name, so a manual restart is not required.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.var-log](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.var-log)

### 56. D

*devops.git-concepts.remote-and-origin · DevOps Fundamentals :: Git Concepts · depth 3 · recall*

A remote is a short name bound to a URL, and `origin/main` is a remote-tracking branch: a local record of where the remote's branch stood the last time this repository communicated with it. Those records update on fetch, pull and push and nowhere else, so a report of being "behind" describes the last contact, not the server at this instant.

- **A.** There is no automatic update channel; `origin/main` only changes when this repository performs a fetch, pull or push, so it can be stale without anything being wrong.
- **B.** `origin` carries no special technical authority; it is simply the conventional name `git clone` assigns, and nothing keeps it synchronized without an explicit network operation.
- **C.** Setting an upstream affects where a bare `git push` or `git pull` goes; it does not change how or when the remote-tracking branch itself is refreshed.
- **D.** Correct. Remote-tracking branches update only on fetch, pull and push, and at no other time, so the comparison is always against a possibly-stale snapshot rather than a live view.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.remote-and-origin](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.remote-and-origin)

### 57. B

*security.security.zero-trust · Security Fundamentals :: Security · depth 2 · recall*

NIST SP 800-207 describes a policy decision point that evaluates each access request against identity, device state, and other context, and a policy enforcement point that opens, monitors, and terminates the resulting connection — trust is per-session and re-evaluated rather than granted once at a boundary.

- **A.** Zero trust's points are per-request logical roles evaluating identity and context, not a fixed pair of perimeter appliances.
- **B.** Correct. That division of labour is exactly how NIST SP 800-207 structures per-request verification: one component decides, the other carries out and continues to police the decision.
- **C.** Zero trust re-evaluates trust per request rather than granting it once at login and revisiting it only occasionally.
- **D.** Encryption and decryption describe a cryptographic transport concern, not the policy evaluation and enforcement roles these two points play.

Study it: [04-security/security.md#c-security.security.zero-trust](../study-guide/04-security/security.md#c-security.security.zero-trust)

### 58. A

*linux.linux-operating-system.operating-system · Linux Fundamentals :: Linux Operating System · depth 3 · discrimination*

The operating system is the full software layer — kernel plus userspace services and libraries — that intercepts every request an application makes so it need not address hardware directly. The kernel is that layer's most privileged component, not a synonym for the whole of it; treating the two as interchangeable is the exact trap this pairing is built to test.

- **A.** Correct. The kernel supplies only the lowest interface, the system call; the rest of that interface set is userspace, so the broader term is the accurate one.
- **B.** The kernel performs the privileged work behind a system call, but libraries and services built above it — part of the OS, not the kernel — supply most of what an application actually calls.
- **C.** Installing a library is a packaging concern; it does not make the distribution the layer that mediates hardware access at runtime.
- **D.** Opening a device file still goes through kernel-mediated system calls; a program never gains direct hardware access merely by holding an open file descriptor.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.operating-system](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.operating-system)

### 59. D

*cloud.performance-availability.scalability-vs-elasticity · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · application*

Automatic growth and automatic shrink-back together are elasticity; NIST names this rapid elasticity as one of cloud computing's essential characteristics. Removing only the shrink-back half leaves a system that scales out under load and never scales back in — expensive, not elastic.

- **A.** The behaviour described — automatic in both directions — is elasticity's definition, not merely scalability's, so this undercounts what is actually being described.
- **B.** Removing the shrink-back half leaves the grow half intact; the platform would still add instances during the sale, just never release them afterwards.
- **C.** High availability concerns surviving component failure, not capacity tracking demand; nothing here is about a single point of failure.
- **D.** Correct. Automatic and bidirectional is exactly elasticity's definition; removing the shrink-back half leaves only the ability to grow.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.scalability-vs-elasticity](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.scalability-vs-elasticity)

### 60. C

*sysadmin.troubleshooting.high-cpu-load · System Administration Fundamentals :: Troubleshooting · depth 4 · diagnostic*

The load average includes processes in uninterruptible sleep (state D), typically blocked on disk I/O, alongside runnable ones, so a high figure with a mostly idle CPU is a storage-bound queue rather than a processor shortage. `top`'s `wa` field is what separates the two causes that produce an identical load number.

- **A.** Memory pressure is not read off the `us`/`wa` split at all; that pair distinguishes CPU-bound work from I/O-bound work, not memory state.
- **B.** Load average is a count of queued work, not a percentage, and is meaningless without dividing by the number of cores first; the `wa` field here already points away from CPU saturation.
- **C.** Correct. Load average counts runnable and uninterruptible-sleep processes together, and a high I/O-wait field on the CPU-state line identifies which of the two is actually queueing.
- **D.** I/O wait reflects processes queued on storage latency, which is a different condition from a filesystem running out of free space.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.high-cpu-load](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.high-cpu-load)

