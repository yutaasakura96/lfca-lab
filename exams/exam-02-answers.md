<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 02 — answers

### 1. A

*sysadmin.best-practices.backup-before-change · System Administration Fundamentals :: Best Practices · depth 2 · recall*

A pre-change copy is tied to one specific change and is often discarded once that change is confirmed good, unlike a routine backup sized against an ongoing recovery point objective. The copy is only useful while the change it guards against remains unconfirmed.

- **A.** Correct. That is what distinguishes it from the scheduled backup regime, which protects against loss over time rather than one change.
- **B.** A pre-change copy exists to undo one identified action; routine backups are a separate, ongoing regime sized by a recovery point objective.
- **C.** The change record states where the copy is and how long it is kept, and that period is typically short, not indefinite.
- **D.** Deleting it before the change is confirmed good would remove the only rollback that does not depend on the change going as planned.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.backup-before-change](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.backup-before-change)

### 2. D

*cloud.best-practices.automation-over-manual-configuration · Cloud Computing Fundamentals :: Best Practices · depth 3 · discrimination*

Configuration management that logs into long-lived servers and patches them in place is fully automated and fully mutable — every server is still a unique accumulation of applied changes, which is the exact trap this competency names between the two practices.

- **A.** Patching a running server in place is precisely what immutable infrastructure replaces with launching new instances from a new artifact.
- **B.** Immutability is about the instance's lifetime, not about who or what triggers the change; automated in-place patching is not immutable.
- **C.** The tool's own automated, template-driven application of changes is exactly what automation over manual configuration describes.
- **D.** Correct. Automating the application of a change is independent of whether the target is replaced or edited in place.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.automation-over-manual-configuration](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.automation-over-manual-configuration)

### 3. A

*linux.command-line.command-chaining · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`;` runs the next command unconditionally. `&&` runs it only if the previous command exited 0. So `cd /tmp/build; rm -rf *` still deletes in whatever directory the shell happened to be if the `cd` fails, while the `&&` form protects against exactly that.

- **A.** Correct. `;` runs the next command unconditionally regardless of the previous one's exit status, while `&&` is short-circuit AND and only runs the right side when the left side succeeded.
- **B.** `;` ignores exit status entirely while `&&` branches on it, which is exactly the safety-relevant difference between running a deletion unconditionally and running it only after a successful `cd`.
- **C.** A failed `cd` does not abort the rest of a `;`-joined line; only the conditional operators branch on the previous command's status.
- **D.** It is the other way round: bash documents `command1 && command2` as running command2 if and only if command1 returns zero, while `;` simply separates commands and imposes no such condition.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-chaining](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-chaining)

### 4. B

*security.security.accounting-and-auditing · Security Fundamentals :: Security · depth 3 · recall*

Accounting produces the record; auditing is the act of reviewing it. A year of unread logs demonstrates that accounting worked, but auditing — the review that actually detects misuse — never happened.

- **A.** The guide states this directly as a trap: the presence of logs is not auditing, since unreviewed records detect nothing.
- **B.** Correct. The guide separates the two explicitly: accounting is the recording, auditing is the review, and unreviewed logs satisfy only the first.
- **C.** Authentication concerns proving identity at login and has no bearing on whether records are later reviewed.
- **D.** Encrypting the logs protects their confidentiality but does not make anyone examine them, which is the actual gap.

Study it: [04-security/security.md#c-security.security.accounting-and-auditing](../study-guide/04-security/security.md#c-security.security.accounting-and-auditing)

### 5. A

*devops.containers.container-image · DevOps Fundamentals :: Containers · depth 3 · command*

`docker images` enumerates the local image store, the class-level view of what could be run; `docker build` produces new images from a Dockerfile and executes no application code in the process.

- **A.** Correct. It reports images on disk, which is exactly the artifact-level view the engineer needs before pruning.
- **B.** That reports instances, not the templates they were created from, and would not show unused images at all.
- **C.** A build compiles a new image from a Dockerfile; it does not enumerate what already exists in the local store.
- **D.** A pull fetches one named image from a registry; it does not summarise what is already sitting locally.

Study it: [05-devops/containers.md#c-devops.containers.container-image](../study-guide/05-devops/containers.md#c-devops.containers.container-image)

### 6. D

*pm.functional-analysis.functional-requirements · IT Project Management Fundamentals :: Functional Analysis · depth 3 · discrimination*

A functional requirement states what the system must do, phrased as an observable outcome rather than an implementation. Naming a vendor, product or protocol is the clearest tell that a solution has been written into requirement voice. The fix is to rewrite it as the behaviour the product was meant to deliver — or, where the choice really is imposed, to keep it as a design constraint and record why the solution was limited to that one method.

- **A.** Untestable wording and a smuggled-in solution are different defects; this sentence is perfectly testable and specific, and its problem is that it names a product instead of a need.
- **B.** A quality requirement has to be quantified to be verifiable, and naming a database product states no measurable level of anything, so it is not a statement of that kind.
- **C.** Requirements documents routinely carry constraints, assumptions and rationale written in requirement voice; what a sentence is depends on what it states, not on where it happens to sit.
- **D.** Correct. Naming a technology removes a choice the designer has not yet had a chance to make, so the sentence belongs either as the storage and retrieval behaviour it stands in for, or as an explicit design constraint whose rationale is captured with it.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.functional-requirements](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.functional-requirements)

### 7. A

*sysadmin.disaster-recovery.business-continuity · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

Continuity asks whether the organisation can keep operating; recovery asks whether the systems can be brought back. A month without an office raises questions no restore procedure answers.

- **A.** Correct. People, premises and communications are continuity concerns beyond restoring systems.
- **B.** Restoration sequencing is the technical recovery procedure.
- **C.** That quantity is bounded by the recovery point objective, a recovery measure.
- **D.** Standby capacity is part of the technical recovery arrangement.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.business-continuity](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.business-continuity)

### 8. D

*cloud.best-practices.health-checks-and-graceful-shutdown · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

A second distinction the competency draws is between liveness and readiness — a shallow TCP check reports healthy for a process that has accepted the socket but cannot yet serve a request, so instances enter rotation before they are actually ready.

- **A.** A process can accept a socket long before it has finished initialising enough to answer a request correctly.
- **B.** A shallow check reports healthy easily, which is exactly the problem; it does not withhold traffic.
- **C.** A health check drives an automated routing decision inside a control loop; paging a human is what monitoring and alerting do instead.
- **D.** Correct. This is the liveness-versus-readiness gap the competency names: a shallow check confirms the socket opened, not that the application can respond.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.health-checks-and-graceful-shutdown](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.health-checks-and-graceful-shutdown)

### 9. B

*sysadmin.disaster-recovery.rto · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

A recovery time objective is a claim about elapsed time from failure to restored service. The only evidence for it is a timed rehearsal; everything else evidences a different property.

- **A.** That evidences the recovery point instead, which measures data loss rather than elapsed time.
- **B.** Correct. The target is a duration, so only a timed end-to-end recovery evidences it.
- **C.** Redundancy reduces the chance of an outage without establishing how long recovery takes.
- **D.** Retention concerns how long copies persist, which is unrelated to restoration speed.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.rto](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.rto)

### 10. D

*linux.command-line.diff-and-comparison · Linux Fundamentals :: Command Line · depth 3 · discrimination*

For binary files, `diff` only reports that they differ; `cmp` gives the first differing byte but still needs both files locally; a checksum tool such as `sha256sum` is the right way to ask "are these two files identical" across separate machines.

- **A.** `diff` on binary files only reports that they differ, without showing a unified hunk the way it does for text.
- **B.** `cmp` reports the first differing byte, but it needs direct access to both files at once, so it cannot compare files that are only ever present on separate machines.
- **C.** Only a checksum tool avoids needing both files present together and gives a fingerprint suited to cross-machine comparison; the other two require direct, simultaneous access to both files.
- **D.** Correct. `diff` on binary files only reports that they differ, with no detail; `cmp` gives the first differing byte but still requires both files on the same machine to compare directly, while a checksum can be computed independently on each host and compared.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.diff-and-comparison](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.diff-and-comparison)

### 11. A

*security.security.certificate-expiry-and-validation · Security Fundamentals :: Security · depth 3 · application*

Expiry, a hostname mismatch, an untrusted or incomplete chain, and clock skew all produce browser warnings that look alike to a user but need different fixes: renew, reissue with the correct name, install the CA or missing intermediate, or correct the clock respectively. A mismatch specifically needs reissue, since the dates were never the fault here.

- **A.** Correct. A hostname mismatch, an untrusted chain, and clock skew all produce a similar-looking warning to expiry but need different remediations, and reissuing with the right name is what a mismatch actually requires.
- **B.** Renewing fixes expiry and nothing else; the guide is explicit that several distinct validation failures produce a similar warning and each needs its own fix.
- **C.** A missing intermediate is one distinct cause among several, but the symptom described — the requested name not appearing in the certificate — points specifically at a hostname mismatch, not a broken chain.
- **D.** Clock skew produces a warning about the validity window, not about the hostname the certificate presents, so it does not match the symptom described here.

Study it: [04-security/security.md#c-security.security.certificate-expiry-and-validation](../study-guide/04-security/security.md#c-security.security.certificate-expiry-and-validation)

### 12. B

*sysadmin.networking.dhcp-lease · System Administration Fundamentals :: Networking · depth 2 · recall*

A lease is a time-bounded allocation the client must renew to keep, which is exactly why a machine switched off longer than its lease may come back to find its old address already reassigned, requiring a fresh DISCOVER to obtain a new one.

- **A.** A lease is a time-bounded allocation, not a permanent reservation; once it expires, the address is free to be handed to a different client, so the same address is not guaranteed.
- **B.** Correct. The lease timer is why a "dynamic" address can look stable for weeks and then change after an outage — a machine off longer than its lease may come back with a different address.
- **C.** An expired lease simply means the client starts again from DISCOVER; a DHCP server issues a fresh lease to any requesting client, expired-lease history notwithstanding.
- **D.** Self-assignment to link-local space happens when no DHCP server answers at all, not simply because a previous lease expired while the server remains available.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dhcp-lease](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dhcp-lease)

### 13. B

*devops.containers.image-tags · DevOps Fundamentals :: Containers · depth 2 · application*

Because a bare `nginx` reference resolves to `nginx:latest`, and `latest` is a mutable pointer rather than a fixed version, two pulls separated in time can legitimately fetch different images. Pinning an explicit version tag, or a digest, is what avoids this drift.

- **A.** A pull always checks the registry; a local store is only consulted by `docker run` when deciding whether a pull is even needed.
- **B.** Correct. Because `latest` is a moving pointer, two pulls separated in time can legitimately fetch different images even though the reference text never changed.
- **C.** A runtime does not alter an image's configured command based on how the image was tagged; `CMD` comes from the image itself.
- **D.** Tag resolution is a registry and CLI convention, not a runtime-specific behaviour that would vary between compliant OCI runtimes.

Study it: [05-devops/containers.md#c-devops.containers.image-tags](../study-guide/05-devops/containers.md#c-devops.containers.image-tags)

### 14. B

*cloud.budgeting.data-egress-charges · Cloud Computing Fundamentals :: Budgeting · depth 2 · recall*

Providers price the asymmetry plainly: data entering the network is generally free while data leaving is billed per gigabyte, and reading your own stored data back out to the internet is egress like any other outbound transfer.

- **A.** Storage services bill for holding data over time, not for receiving it — ingress itself is generally free across the major providers.
- **B.** Correct. Providers price data leaving their network per gigabyte while inbound is generally free; the meter does not care that the data being read out was your own earlier upload.
- **C.** A free allowance only covers volume up to its own limit; it does not change which direction of transfer is metered once that limit is exceeded.
- **D.** The asymmetry is exactly directional: outbound is billed per gigabyte while inbound is generally free, which is the point this concept tests.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.data-egress-charges](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.data-egress-charges)

### 15. C

*linux.command-line.finding-files · Linux Fundamentals :: Command Line · depth 3 · application*

`which` reports which file on `PATH` a bare command name would run, and `-a` shows every match rather than stopping at the first, which is exactly the "which copies exist on `PATH`" question.

- **A.** `whereis` looks only in a compiled-in list of standard directories, which may miss a copy installed elsewhere on `PATH`, unlike `which`'s actual `PATH` lookup.
- **B.** `locate` searches a filename index for anything matching "git" anywhere on the filesystem, which is a much broader and less precise answer than "which file on `PATH` runs."
- **C.** Correct. which(1) prints the full path of the executable that would have run for the name given, searching `PATH` with the same algorithm as the shell, and '--all, -a  Print all matching executables in PATH, not just the first.'
- **D.** That finds files named `git` anywhere on the filesystem, including ones nowhere near `PATH`, rather than answering which one the shell would actually execute.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.finding-files](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.finding-files)

### 16. C

*pm.open-source-software-and-licensing.agpl · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 1 · recall*

The AGPL was written to close the gap where a modified program is offered as a service but never conveyed to anyone. Section 13's trigger is network interaction with a modified version, independent of whether a copy ever changes hands.

- **A.** GPLv3 section 5 concerns conveying a copy; it does not reach a hosted, never-distributed service, which is exactly the gap section 13 closes.
- **B.** Section 13 requires offering Corresponding Source to network users; it says nothing about producing a bill of materials.
- **C.** Correct. Section 13 extends the same-licence obligation past conveyance to reach users who only ever interact with the software across a network.
- **D.** Section 13 is a term of the AGPL specifically; software under other licences, including the plain GPL, is not reached by it at all.

Study it: [06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-specific-licenses](../study-guide/06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-specific-licenses)

### 17. D

*sysadmin.networking.dns · System Administration Fundamentals :: Networking · depth 3 · application*

`dig` is the detailed query tool showing sections, flags and TTLs; `nslookup` is the older interactive tool with moderate detail; `host` is the terse one, best suited to scripts that just need the answer without parsing extra structure.

- **A.** `nslookup` is the older interactive tool with moderate detail, not the terse option; `host` is the terse one, and `dig` is the tool with full response detail, not `host`.
- **B.** This reverses the actual defaults: `dig` prints the full response by default, and `host` is the terse tool, not the other way around.
- **C.** The three tools have genuinely different default verbosity and output formats; they are not interchangeable wrappers around identical output.
- **D.** Correct. `host` is deliberately terse and easy to parse, while `dig` shows the complete response structure that a thorough diagnosis needs and the others hide.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dns](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dns)

### 18. D

*sysadmin.networking.ipv6-address · System Administration Fundamentals :: Networking · depth 3 · application*

`::` may replace one run of consecutive all-zero groups, and only one such run per address, because allowing two would make the compressed groups impossible to expand back unambiguously.

- **A.** An IPv6 address has eight groups when fully expanded; the rule broken here is the double use of `::`, not a limit on the number of groups.
- **B.** IPv6 groups are hexadecimal, so letters a through f are entirely valid within a group; that is not the fault in this address.
- **C.** 2001:db8::/32 is reserved for documentation examples, which is exactly why it is used in teaching material; that is unrelated to the double-`::` error present.
- **D.** Correct. With two compressed runs there is no way to know how many zero groups each one represents, so the notation cannot be unambiguously expanded.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ipv6-address](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ipv6-address)

### 19. C

*security.security.encryption-at-rest-vs-in-transit · Security Fundamentals :: Security · depth 2 · recall*

Encryption at rest protects stored data — disks, backups, object storage; encryption in transit protects data moving across a network. HTTPS on a public endpoint says nothing about whether a backup tape is encrypted, since the two controls address separate exposures and neither substitutes for the other.

- **A.** The guide states directly that HTTPS on the front end does nothing for a stolen backup tape; the two controls do not overlap that way.
- **B.** A TLS certificate authenticates a network peer during a connection; it has no bearing on who later holds a piece of offline storage media.
- **C.** Correct. Encryption in transit and encryption at rest are separate controls covering separate exposures, and one does not substitute for the other.
- **D.** Compression status is unrelated to the actual gap here, which is that encryption in transit and encryption at rest are two distinct controls, neither implying the other.

Study it: [04-security/security.md#c-security.security.encryption-at-rest-vs-in-transit](../study-guide/04-security/security.md#c-security.security.encryption-at-rest-vs-in-transit)

### 20. A

*cloud.budgeting.orphaned-resources · Cloud Computing Fundamentals :: Budgeting · depth 3 · recall*

Rightsizing and orphan-hunting use different evidence: rightsizing compares utilisation telemetry against provisioned capacity, while finding an orphan means querying inventory for attachment state, last activity and owner tags, because an orphan produces no telemetry signal at all.

- **A.** Correct. Finding orphans means querying inventory rather than reading telemetry — attachment state and last activity, cross-referenced against the owner tag to find who to ask before deleting.
- **B.** Telemetry against provisioned capacity is what finds a rightsizing candidate, a resource that still has a purpose but the wrong size, not a resource with no purpose left.
- **C.** A rising bill can have several causes, only one of which is an orphan appearing; a trend line alone does not identify which cause applies.
- **D.** An untagged resource is more likely to become an orphan, but the missing tag alone is not proof that a specific resource has no purpose — inventory evidence is still required.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.orphaned-resources](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.orphaned-resources)

### 21. A

*linux.command-line.pipes · Linux Fundamentals :: Command Line · depth 3 · discrimination*

The separating axis is what sits at the far end: standard streams are the endpoints themselves, redirection attaches an endpoint to a file, and a pipe attaches one process's endpoint to another process's, with all pipeline stages starting concurrently. Written exactly as it appears on a command line, the operator is `|`.

- **A.** Correct. A pipe attaches one running command's output to another running command's input; redirection attaches an endpoint to a file, a device, or another descriptor; the streams themselves are just the fixed numbers every process starts with.
- **B.** This swaps the two roles: a pipe is what connects two running processes concurrently, and redirection is what attaches a stream to a file.
- **C.** The three are distinct: what sits at the far end of the connection — another process, a file, or nothing yet decided — is exactly the separating axis between them.
- **D.** Every process starts with all three descriptors already open, attached to the terminal by default, whether or not a pipe or redirection is ever applied.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.pipes](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.pipes)

### 22. C

*devops.containers.pod · DevOps Fundamentals :: Containers · depth 3 · application*

Containers in a pod share a network namespace, meaning one IP address and one port space between them, which is exactly why a sidecar that must share the main container's network belongs in the same pod rather than a separate one.

- **A.** A Service addresses a set of pods from outside, not two containers within the same pod; pod-internal reachability comes from the shared network namespace itself.
- **B.** Localhost reachability is scoped to containers sharing the same pod's network namespace; it does not extend cluster-wide between unrelated pods.
- **C.** Correct. Pod-level network sharing is exactly the mechanism that lets two tightly coupled containers talk to each other without any external routing.
- **D.** Network namespace sharing is a property of pod membership, not of whether two containers happen to come from the same image.

Study it: [05-devops/containers.md#c-devops.containers.pod](../study-guide/05-devops/containers.md#c-devops.containers.pod)

### 23. C

*sysadmin.networking.ports-and-sockets · System Administration Fundamentals :: Networking · depth 3 · application*

Binding to 127.0.0.1 rather than 0.0.0.0 is the single most common cause of "the service is running but nothing can connect," and it is invisible unless you read the Local Address column rather than just the port — 127.0.0.1 accepts only from the same machine, while 0.0.0.0 accepts on every address the host holds.

- **A.** No port number is inherently local-only or inherently remote-reachable; reachability is governed by the bind address in the Local Address column, not by which port number is chosen.
- **B.** `ss -tulpn`'s `-p` column reports which process owns a socket for diagnostic purposes; it does not itself restrict or grant reachability, which is governed by the bind address instead.
- **C.** Correct. The bind address in the Local Address column is exactly what determines whether a listener accepts connections from other hosts or only from itself; the port number alone does not decide reachability.
- **D.** `-n` only affects whether ports are displayed numerically rather than as translated service names; it has no effect at all on which addresses a socket is actually reachable from.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ports-and-sockets](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ports-and-sockets)

### 24. D

*cloud.cloud-computing.hybrid-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

NIST's hybrid cloud definition has two conditions that must both hold: the components must each be a distinct cloud infrastructure, and they must remain bound together by technology enabling data and application portability between them, with cloud bursting given as the worked example. This scenario states both explicitly, and removing the network link, identity plane and deployment pipeline would strip out exactly the binding condition, leaving two separate estates rather than a hybrid cloud.

- **A.** This inverts the two terms: multi-cloud varies the vendor, usually within one deployment model; hybrid varies the deployment model and, unlike multi-cloud, requires the parts to be bound together.
- **B.** Placement alone is not sufficient; NIST's binding condition is a separate requirement, and removing the connective tissue would leave two separate estates rather than a hybrid cloud.
- **C.** NIST's composition may combine any of private, community or public; a private-plus-public pairing, as described here, is a valid and common hybrid arrangement.
- **D.** Correct. NIST's definition requires both conditions together: each component being a cloud, and the components being bound together for portability — and this scenario states both explicitly.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hybrid-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hybrid-cloud)

### 25. C

*pm.open-source-software-and-licensing.open-source-software · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · discrimination*

Two of the ten OSD criteria decide most such questions: free redistribution without a required royalty, and permission to make and distribute derived works. Product A satisfies both; Product B fails the second regardless of its zero price.

- **A.** "Free" in free software means liberty, not price, so a zero-cost download that bars redistribution is neither free software nor open source.
- **B.** OSD 1 explicitly permits selling open source software as part of an aggregate distribution; charging is not disqualifying.
- **C.** Correct. OSD 1 permits selling open source software, and OSD 3 is what Product A grants and Product B withholds.
- **D.** Barring redistribution of derived works removes exactly the right OSD 3 requires; it is a disqualifying restriction, not a stricter variant.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.open-source-software](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.open-source-software)

### 26. D

*sysadmin.networking.tcp-ip-model · System Administration Fundamentals :: Networking · depth 3 · application*

Sources place ARP at 'layer 2.5' or at either side of the link/internet boundary because it carries an internet-layer address in a link-layer frame; the safe exam answer is that it joins layer 3 addressing to layer 2 delivery rather than sitting cleanly in one layer.

- **A.** ARP resolves addresses for local delivery and has no relationship to the application layer at all; DNS is the application-layer name resolver, not ARP.
- **B.** ARP resolves addresses, not ports, and has no relationship to TCP or UDP, which are what actually occupy the transport layer.
- **C.** ARP requests and replies are carried as raw link-layer frames, not as internet-layer packets, so it cannot be placed entirely at one layer.
- **D.** Correct. ARP resolves an internet-layer address to a link-layer address, so its result is consumed at the boundary between the two layers rather than by either alone.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.tcp-ip-model](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.tcp-ip-model)

### 27. B

*security.security.phishing-and-social-engineering · Security Fundamentals :: Security · depth 3 · recall*

The guide explicitly withdraws the "most common" superlative about phishing: the Verizon 2026 DBIR ranks exploitation of vulnerabilities first among initial-access routes at 31%, phishing second at 16%, and credential abuse third at 13%, so no version of "phishing is the most common" is supported by the cited source.

- **A.** Ease of execution is not a measure of frequency; only a dataset that counted incidents can settle which route led, and that is exactly what the sentence fails to name.
- **B.** Correct. A superlative about frequency is only as good as the measurement behind it, and an unattributed ranking cannot be checked by a reader or defended if the underlying report moves.
- **C.** NIST defines phishing narrowly as a fraudulent solicitation in email or on a web site in which the perpetrator masquerades as a legitimate business, which is one technique within social engineering rather than the whole of it.
- **D.** A denial-of-service attack disrupts availability rather than granting an attacker access, so it is not counted on an initial-access measure at all; and the defect in the sentence is the missing dataset, not the identity of the leading vector.

Study it: [04-security/security.md#c-security.security.phishing-and-social-engineering](../study-guide/04-security/security.md#c-security.security.phishing-and-social-engineering)

### 28. D

*linux.command-line.reading-ls-l-output · Linux Fundamentals :: Command Line · depth 5 · application*

Each permission triad is one octal digit, with `r`=4, `w`=2 and `x`=1 added together. `-rw-r--r--` is owner `rw-` (6), group `r--` (4), other `r--` (4), giving 644 — a regular file the owner can read and write and everyone else can only read.

- **A.** 755 corresponds to `rwxr-xr-x`, which includes execute bits this mode string does not have, and the leading `-` marks a regular file, not a directory.
- **B.** 600 corresponds to `rw-------`, with no access at all for group or other; this mode string grants read to both, which 600 does not.
- **C.** 444 corresponds to `r--r--r--`, and it is true that it grants no write anywhere; the mode string here is `-rw-r--r--`, whose owner triad is `rw-` and does include write, so 644 is the value.
- **D.** Correct. Each triad is one octal digit — `r`=4, `w`=2, `x`=1 — so `rw-` is 6, `r--` is 4 twice, giving 644; the leading `-` marks a regular file, not a directory.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.reading-ls-l-output](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.reading-ls-l-output)

### 29. A

*sysadmin.system-administration.bootloader-and-grub · System Administration Fundamentals :: System Administration · depth 3 · application*

`update-grub` is a Debian-family wrapper around `grub-mkconfig -o /boot/grub/grub.cfg`, and it does not exist on Red Hat-family systems, which instead call `grub2-mkconfig -o /boot/grub2/grub.cfg` directly — reaching for the wrong family's command is a mix-up the exam can present directly.

- **A.** Correct. The two families use different commands for the same underlying operation, and reaching for the Debian-family one on a Red Hat-family system is exactly the family mix-up this concept tests.
- **B.** Regeneration is fully supported; it simply uses a different command name, `grub2-mkconfig -o /boot/grub2/grub.cfg`, on that family.
- **C.** Secure Boot governs signature verification of boot executables and has no bearing on whether a configuration-generation command exists on the system.
- **D.** The failure described is "command not found," which indicates the wrong tool was invoked, not that an install is still in progress.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.bootloader-and-grub](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.bootloader-and-grub)

### 30. C

*cloud.cloud-computing.object-block-and-file-storage · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Block storage exposes a raw volume that a guest OS formats and normally attaches to a single instance at a time — sharing it needs an explicit multi-attach feature and a cluster-aware filesystem most teams do not have set up. File storage puts the filesystem on the provider's side and serves it over NFS or SMB precisely so that many machines can mount the same tree concurrently with familiar permissions and locking, which is exactly this requirement.

- **A.** Object storage is not a mountable POSIX filesystem and has no partial-write or locking semantics; it is a poor fit for files two servers actively edit together, unlike file storage.
- **B.** Block volumes have no built-in cross-volume synchronisation; each is an independent raw device unless deliberately mirrored, which does not solve concurrent shared access at all.
- **C.** Correct. The guide names this exact mismatch: block storage is not shared storage by default, and 'two servers need the same files' is a file-storage answer.
- **D.** Zone placement does not change the fact that a block volume is normally attached to a single instance at a time; proximity does not enable concurrent shared attachment on its own.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.object-block-and-file-storage](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.object-block-and-file-storage)

### 31. C

*devops.devops-basics.continuous-integration · DevOps Fundamentals :: DevOps Basics · depth 3 · application*

CI is about integrating and verifying, not about releasing. A scenario that stops at a tested artifact has described CI in full; extending it into deployment moves the description into delivery or deployment instead.

- **A.** Releasability requires deployment into at least an acceptance environment, which this description never mentions happening.
- **B.** The pipeline is the mechanism running the stages; the description is naming the practice being exercised, not the object running it.
- **C.** Correct. Producing a verified artifact and stopping is precisely where continuous integration's scope ends.
- **D.** Nothing in the description says the artifact was promoted anywhere; promotion is a later, unstated step.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.continuous-integration](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.continuous-integration)

### 32. A

*sysadmin.system-administration.disk-usage-vs-free-space · System Administration Fundamentals :: System Administration · depth 4 · diagnostic*

The efficient order works outward from the cheapest check: `df -h` identifies which filesystem is full, `df -i` on that filesystem rules in or out inode exhaustion, and only then does `du -sh` descending from the mount point locate the specific directory responsible — checking the three structural causes (unlinked-open file, hidden mount, reserved blocks) if `du`'s total still falls short.

- **A.** Correct. Working outward from the cheapest check identifies which filesystem, then which resource (blocks or inodes), then which directory is actually responsible.
- **B.** Running `du` over the entire machine first skips identifying which filesystem is actually affected and wastes time walking filesystems that are not the problem.
- **C.** Deleted-but-open files are one possible cause among several, and nothing reports the ordinary ones in advance; checking for them before confirming which filesystem and which resource is full is out of order.
- **D.** A full filesystem is not itself evidence of corruption, and running `fsck` first skips the cheap checks that usually explain the symptom directly.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.disk-usage-vs-free-space](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.disk-usage-vs-free-space)

### 33. C

*linux.command-line.shell-scripting-basics · Linux Fundamentals :: Command Line · depth 3 · application*

Running a file directly requires the execute bit, set by `chmod +x`. Without it, the kernel refuses to execute the file at all and reports "Permission denied," independent of whether the shebang line is correct.

- **A.** The shebang must be the very first line for the kernel to recognise it; moving it elsewhere would break interpretation entirely rather than causing a permission error specifically.
- **B.** Linux attaches no special meaning to a `.sh` extension for execution; what is required is the execute bit, not a particular filename suffix.
- **C.** Correct. Running a file directly requires the execute bit; `chmod +x` sets it, and without it the kernel refuses to execute the file at all, regardless of a correct shebang.
- **D.** Sourcing changes whether the script's effects persist in the current shell; it does not bypass or substitute for the execute-bit requirement that "Permission denied" is reporting.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.shell-scripting-basics](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.shell-scripting-basics)

### 34. D

*security.security.security-logging-and-monitoring · Security Fundamentals :: Security · depth 2 · recall*

Accounting is the AAA-triad property — the per-identity record of what an authenticated subject did. Security logging and monitoring is the operational pipeline that makes such records survive and get seen: generation on every host, shipping off-box, clock synchronisation, retention, and alerting. A question about why logs are shipped to a SIEM tests this pipeline, not accounting itself.

- **A.** The guide states these are close enough to test as separate concepts: accounting is the recorded event itself, while log shipping and SIEM architecture belong to this topic instead.
- **B.** Shipping logs protects the integrity and usefulness of the evidence, not availability of a service, and it is squarely part of this topic's operational pipeline.
- **C.** A SIEM collects and correlates events; it does not perform authentication decisions for the hosts it monitors, which is unrelated to what log shipping is for.
- **D.** Correct. The guide draws this line directly: accounting is the per-identity record itself, while shipping, clock synchronisation, retention and alerting are this topic's operational pipeline.

Study it: [04-security/security.md#c-security.security.security-logging-and-monitoring](../study-guide/04-security/security.md#c-security.security.security-logging-and-monitoring)

### 35. C

*pm.project-management.estimation-and-velocity · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

Velocity is the amount of work a team completes per Sprint, denominated in the team's own relative units and used to forecast, not to score productivity. A team told to raise it can do so by inflating estimates without delivering anything more, because nothing external calibrates the unit — and velocity figures aren't comparable between teams for the same reason.

- **A.** Velocity is a forecasting input calculated from past Sprints, not an objective productivity score, which is exactly why the instruction backfires.
- **B.** The Developers who do the work are responsible for sizing it; the Product Owner may help with trade-offs but doesn't set velocity.
- **C.** Correct. Because sizing is relative and team-specific, a team can satisfy the instruction by inflating its own estimates rather than by delivering more.
- **D.** Velocity is calculated from completed work per Sprint at its normal fixed length; extending the Sprint isn't a precondition for measuring it.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.estimation-and-velocity](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.estimation-and-velocity)

### 36. A

*sysadmin.system-administration.etc-group · System Administration Fundamentals :: System Administration · depth 3 · application*

The fourth field of `/etc/group` is the supplementary member list only. A user whose primary group is `developers` is recorded on their own `/etc/passwd` row, not in `/etc/group`, so answering "who is in this group" completely requires reading both files.

- **A.** Correct. Primary membership is recorded on the user's own row in `/etc/passwd`, not in the group's member list.
- **B.** The field only ever lists supplementary members; anyone whose primary group this is will be missing from it.
- **C.** It is recorded — in field four of that user's `/etc/passwd` row — just not in `/etc/group`'s member list.
- **D.** `groupadd` creates a group; it does not recompute or refresh any membership list.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-group](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-group)

### 37. A

*cloud.cloud-computing.virtual-machine · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

A virtual machine boots its own kernel and full operating system, which is what lets it run a different OS family from its neighbours and gives it a stronger isolation boundary — a compromised guest kernel stays inside its own VM. That capability is exactly why a VM costs more per workload: its own memory footprint, its own CPU allocation and its own patching, none of which a kernel-sharing container needs to carry.

- **A.** Correct. The guide's separating axis is again the kernel: a VM brings its own and pays for it in overhead; a container borrows the host's and pays for it in a weaker boundary.
- **B.** This is backwards — a container starts in milliseconds to seconds as a process, while a VM takes seconds to minutes because it performs a full boot: firmware, boot loader, kernel, init system.
- **C.** The overhead exists because the VM provides something a container does not — its own kernel, a foreign-OS option and a stronger isolation boundary — not because it is simply a heavier version of the same thing.
- **D.** A VM inherits the availability of the host it runs on unless the platform is explicitly configured to restart or migrate it elsewhere; availability is not an automatic property of virtualization, and restarting a guest on another host is a feature that has to be turned on.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.virtual-machine](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.virtual-machine)

### 38. B

*sysadmin.system-administration.etc-sudoers-and-visudo · System Administration Fundamentals :: System Administration · depth 5 · diagnostic*

A file that fails to parse is not partially applied — `sudo` refuses the whole policy, not just the broken line. From a surviving root session, `visudo -c` checks the main file, and because `visudo -c` also validates included files, checking `/etc/sudoers.d/` next catches a broken drop-in with the same symptom.

- **A.** Deleting the policy file removes the ability to reason about what changed and is far more destructive than checking syntax with `visudo -c` first.
- **B.** Correct. A parse failure anywhere in the policy — the main file or an included drop-in — makes `sudo` refuse everything, so checking syntax first isolates the fault fastest.
- **C.** Rebooting does not repair a syntax error in a text file; the broken policy would still be in force after restart.
- **D.** Opening the file to everyone is both unsafe and beside the point — `sudo` refuses a policy that fails to parse regardless of who can read it.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-sudoers-and-visudo](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-sudoers-and-visudo)

### 39. D

*devops.devops-basics.feedback-loops · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

A feedback loop is measured in latency, not volume. Smaller, more frequent releases shrink the set of possible causes when something breaks and shorten the interval before the breakage is noticed.

- **A.** That describes shift left, a related but separate practice about when quality work happens, not about release size.
- **B.** Nothing about release frequency mandates new coverage; the safety net and the cadence are separate levers.
- **C.** This mistakes release count for accumulated risk and ignores that each release now carries far less change.
- **D.** Correct. This is the counterintuitive claim the concept exists to teach: latency, not volume, is what a feedback loop measures.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.feedback-loops](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.feedback-loops)

### 40. B

*linux.command-line.who-is-logged-in · Linux Fundamentals :: Command Line · depth 3 · application*

`id` with no options prints the real user and group IDs, the effective ones when they differ, and lists every supplementary group — none of `who`, `w`, `last` or `whoami` reports group membership.

- **A.** `whoami` prints only the effective user name and nothing else — no group information at all.
- **B.** Correct. `id` with no options prints the real and effective user and group IDs and lists every supplementary group; none of the other four commands reports group membership at all.
- **C.** `who` lists session information — name, terminal, login time and remote host — from utmp, with no group membership data.
- **D.** last(1) "searches back through the /var/log/wtmp file ... and displays a list of all users logged in (and out)"; wtmp records sessions, not group membership, so there is no group list to read.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.who-is-logged-in](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.who-is-logged-in)

### 41. D

*cloud.networking.bastion-and-jump-hosts · Cloud Computing Fundamentals :: Networking · depth 2 · recall*

A bastion or jump host concentrates administrative access at one auditable point instead of scattering open SSH or RDP ports across every host, so the private resources behind it need no inbound exposure of their own.

- **A.** Security groups are still applied to the private resources; the bastion changes what needs to be reachable from outside, not whether filtering rules on the targets are needed.
- **B.** A private service endpoint reaches a managed provider service, such as storage or a database; it is unrelated to how an administrator's session reaches a private compute resource through a bastion.
- **C.** Encryption is not the property this concept turns on — SSH and RDP are already encrypted protocols; the bastion's contribution is concentrating and auditing the entry point, not adding encryption that was missing.
- **D.** Correct. This matches the documented purpose of a bastion or jump host.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.bastion-and-jump-hosts](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.bastion-and-jump-hosts)

### 42. B

*security.security.ssh-hardening · Security Fundamentals :: Security · depth 5 · recall*

`PermitRootLogin prohibit-password`, the OpenSSH default, disables password and keyboard-interactive authentication for root but still permits root to log in with a key. Only `PermitRootLogin no` disables root login outright, which is why a baseline that wants no direct root access at all sets it explicitly rather than relying on the default.

- **A.** This is the exact trap the guide names: `prohibit-password` is not the same as `no`, because key-based root login still succeeds under the default.
- **B.** Correct. The guide states this exact distinction: `prohibit-password` disables password and keyboard-interactive authentication for root while still permitting key-based root login, which `no` does not.
- **C.** `PasswordAuthentication` governs password login generally, but `PermitRootLogin prohibit-password` independently still allows root to authenticate by key regardless of that other setting.
- **D.** Neither value has anything to do with MFA enrolment; the distinction is specifically about which authentication method root is still permitted to use.

Study it: [04-security/security.md#c-security.security.ssh-hardening](../study-guide/04-security/security.md#c-security.security.ssh-hardening)

### 43. D

*sysadmin.system-administration.kernel · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Knowing the stage order makes a boot failure diagnosable: the GRUB menu appearing rules out firmware and the bootloader, and kernel messages appearing before a stall rules out the kernel failing to start at all, narrowing the fault to the initramfs, the root filesystem, or an init-system unit — after which selecting the previous kernel is the standard first recovery step.

- **A.** The GRUB menu appearing and the kernel printing messages both demonstrate firmware and the bootloader worked correctly; the fault lies later in the sequence.
- **B.** A corrupted package database would not produce this specific symptom of the kernel printing messages and then stopping before a login prompt.
- **C.** A Secure Boot signature failure would typically prevent the kernel from starting at all, not let it print messages and then stall partway through initialisation.
- **D.** Correct. Because the GRUB menu and kernel messages both appeared successfully, firmware and the bootloader are ruled out, leaving the stages between kernel start and a completed boot.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.kernel](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.kernel)

### 44. A

*linux.linux-operating-system.desktop-environments · Linux Fundamentals :: Linux Operating System · depth 2 · application*

A desktop environment runs on top of a display server, providing the window manager and surrounding applications. Swapping desktop environments on the same distribution and display server is generally supported, since the choice is independent of the distribution.

- **A.** Correct. The guide states this directly: desktop environment choice is independent of which distribution is installed, and swapping is generally supported.
- **B.** A desktop environment runs on top of an existing display server, X11 or Wayland; it does not require reinstalling that underlying protocol layer.
- **C.** Distribution family concerns package manager lineage; it has no bearing on which desktop environment is installed on top of a given distribution.
- **D.** GUI-vs-CLI administration and desktop environment choice are separate questions; nothing about swapping environments requires changing how the system is otherwise administered.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.desktop-environments](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.desktop-environments)

### 45. C

*pm.project-management.project-closure-and-lessons-learned · IT Project Management Fundamentals :: Project Management · depth 3 · application*

Closure is not the same as the last piece of work being finished. It requires confirming the deliverables were accepted against the criteria agreed at the start and handing the result over to whoever will operate it, including the runbook and support arrangement the operating team actually needs. A demoed but unaccepted, unhanded-over deliverable is an unfinished closure, not a completed one.

- **A.** That reading treats the finished deliverable as sufficient, but the operating team still can't run what was built without the runbook, and nothing has been formally accepted.
- **B.** A milestone marking completion doesn't substitute for acceptance and handover; the demo happening is an event, not confirmation the result was accepted or usable by operations.
- **C.** Correct. The last piece of work finishing isn't the same as the project ending; acceptance against the agreed criteria and handover to operations are the steps that actually close it, and both are still outstanding.
- **D.** A Retrospective is a once-per-Sprint improvement exercise for one team; it doesn't confirm acceptance or complete handover to operations.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.project-closure-and-lessons-learned](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.project-closure-and-lessons-learned)

### 46. D

*sysadmin.system-administration.pid-and-ppid · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

PIDs identify a process only while it lives; once it exits, the kernel is free to reuse that number for something else. A PID recorded in a file and used later without checking is a well-known source of signalling the wrong process, which is why service managers prefer tracking by cgroup instead.

- **A.** PIDs wrap and are reused once `pid_max` is reached, and more simply, as soon as the original process exits its number becomes available again.
- **B.** Namespace differences change what number a process sees for itself, but nothing in this scenario describes containers or namespaces.
- **C.** A changed PPID would affect parentage lookups, not which process a plain PID-based signal is delivered to.
- **D.** Correct. The kernel reallocates exited processes' PIDs, so a stale record can silently point at a completely different, unrelated process later.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.pid-and-ppid](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.pid-and-ppid)

### 47. A

*cloud.networking.vpc-peering-and-private-connectivity · Cloud Computing Fundamentals :: Networking · depth 3 · application*

Peering is non-transitive: a hub-and-spoke arrangement gives the hub reachability to every spoke, but two spokes cannot reach each other through it without a direct peering or a transit service.

- **A.** Correct. AWS states peering relationships are not transitive, so a peered network cannot be used as a transit point for another pair.
- **B.** AWS states peering relationships are not transitive: a peered network cannot be used as a transit point for another pair's traffic, so B being peered with both A and C creates no path between them.
- **C.** A VPN tunnel is the hybrid-connectivity mechanism for reaching a network the provider does not run, such as an on-premises site; A and C are both cloud networks within reach of ordinary peering, which is the more direct fix here.
- **D.** Sharing an address range would disqualify any peering connection outright, since overlapping ranges cannot be peered; distinct, non-overlapping ranges are the prerequisite, not the fix, for connecting A to C.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.vpc-peering-and-private-connectivity](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.vpc-peering-and-private-connectivity)

### 48. B

*devops.git-concepts.merge · DevOps Fundamentals :: Git Concepts · depth 3 · discrimination*

Merge and rebase are two Git operations for integrating work — merge preserves both histories and joins them with a merge commit when they diverged, rebase replays commits as new objects onto a different base. A pull request is not an integration operation at all; it is a platform's review wrapper placed around one, and git-scm.com does not define it because it is not a Git concept.

- **A.** A pull request has no Git command that opens one — `git request-pull` only prints a summary for a human to send — so it is not a Git operation at all, let alone one with the same effect as merge or rebase.
- **B.** Correct. Merge and rebase are two different Git operations for integrating work — one preserving history, one rewriting it — while a pull request lives entirely on the platform and performs no integration by itself.
- **C.** Rebase runs entirely locally with `git rebase`; review and status checks are what actually happen on the platform, and a pull request is that platform layer, not merge's counterpart.
- **D.** A pull request changes no history at all — opening one only asks that a merge be performed later; rebase is the one that rewrites hashes, not the pull request.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.merge](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.merge)

### 49. A

*sysadmin.system-administration.root-and-least-privilege · System Administration Fundamentals :: System Administration · depth 3 · application*

Root is UID 0, the identity for which the kernel's ordinary permission checks are bypassed entirely. A mode of `000` blocks every other identity, but a root process is unaffected by mode bits at all — which is exactly why some distributions can ship sensitive files with no permission bits set.

- **A.** Correct. Being UID 0 means the kernel skips the permission comparison altogether for that process, regardless of what the mode string says.
- **B.** Root is not subject to the same check the mode bits express; it is exactly why Red Hat-family systems can ship `/etc/shadow` at `0000` and still have it work.
- **C.** Root's bypass does not depend on ownership of the specific file; it applies to root's access generally.
- **D.** A process running as root, whether reached via `sudo`, `su`, or direct login, is subject to the same kernel-level bypass.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.root-and-least-privilege](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.root-and-least-privilege)

### 50. B

*security.sensitive-data.data-classification · Security Fundamentals :: Sensitive Data · depth 3 · application*

Data classification is a decision an organisation makes about a file and can revise; whether the file contains PII is a fact about its content that a mislabelling does not change. The two axes drive different things — classification drives internal handling rules, PII status drives external legal duties — which is exactly what the competency's owned comparison, data classification versus personally identifiable information, turns on.

- **A.** PII status and the required classification level are related but not identical questions; a scheme could reasonably classify low-sensitivity PII below Restricted.
- **B.** Correct. Classification is something an organisation decides and can change; PII status follows from the content and does not move when the label does.
- **C.** Classification also governs plainly non-personal data such as source code and pricing models, so the two questions are not interchangeable.
- **D.** PII obligations travel with the data wherever it sits, including internal copies, well before any export occurs.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.data-classification](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.data-classification)

### 51. B

*linux.linux-operating-system.gui-vs-cli · Linux Fundamentals :: Linux Operating System · depth 3 · discrimination*

GUI vs CLI names the interface paradigm as a whole. Shell and terminal are both specifically CLI-side components — one interprets, the other displays — so the two comparisons operate at different levels, not as restatements of each other.

- **A.** A shell interprets commands; a terminal displays them — both are CLI-side components, neither of which is 'the GUI equivalent' of the other.
- **B.** Correct. The separating axis is level: one is a category the other sits inside of, not two names for one comparison.
- **C.** A terminal is specifically a CLI-side component; its absence from GUI administration is consistent with the level distinction, but is not itself the reason the two comparisons differ.
- **D.** Shell vs terminal has nothing to do with a display server; that question only arises on the GUI side of the broader GUI-vs-CLI split.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.gui-vs-cli](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.gui-vs-cli)

### 52. B

*sysadmin.system-administration.swap · System Administration Fundamentals :: System Administration · depth 3 · application*

Swap space is created with `mkswap`, which writes the signature `swapon` looks for, and only then activated with `swapon`. Running `swapon` on a partition that was never prepared with `mkswap` fails because there is no swap signature there for it to recognise.

- **A.** Swap space is not a regular filesystem and is not created with `mkfs`; it is prepared specifically with `mkswap`.
- **B.** Correct. `swapon` activates an area that has already been prepared as swap; without that preparation step there is nothing valid for it to turn on.
- **C.** A device can be activated directly with `swapon <device>` without any fstab entry; the entry is only needed for it to activate automatically at boot.
- **D.** mkswap(8) documents its device argument as "usually a disk partition (something like /dev/sdb7) but can also be a file"; no volume group is involved at any point.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.swap](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.swap)

### 53. C

*cloud.performance-availability.bottleneck-identification · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · recall*

Utilisation measures how much of a resource is in use; saturation measures how much work is queued waiting for it, and only the saturated resource is the actual constraint. A moderately busy CPU next to a deeply queued disk means the disk, not the CPU, is where the fix belongs.

- **A.** A moderate utilisation figure with no queue behind it is not saturated; the constraint is wherever work is actually piling up, which is the disk here.
- **B.** The scenario gives no network figures at all; the constraint has to be identified from the evidence given, which points at the disk queue.
- **C.** Correct. Utilisation says how busy a resource looks; saturation says how much work is queued waiting for it, and it is saturation that tracks the latency users feel.
- **D.** The two resources are independent; this scenario specifically shows one saturated (disk) and one merely busy (CPU), which is the point being tested.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.bottleneck-identification](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.bottleneck-identification)

### 54. D

*pm.software-application-architecture.relational-database · IT Project Management Fundamentals :: Software Application Architecture · depth 3 · application*

The honest discriminators are structure, joins, and atomicity across tables, not popularity or raw scale. PostgreSQL's own model — enforced schema, joins performed by the database, a transaction logged to permanent storage before completion is reported — is built for exactly this checkout.

- **A.** NoSQL is usually faster for the access pattern the data was modelled for and considerably worse for join-shaped queries like this one; volume alone doesn't decide it.
- **B.** A queue decouples producer and consumer in time; it has no notion of an all-or-nothing operation across two tables, which is what a transaction provides.
- **C.** Some NoSQL products do offer transactions, but typically scoped to one document or key — not the arbitrary multi-table span this checkout needs.
- **D.** Correct. Structured, interrelated data with a multi-step operation that must be atomic across tables is exactly the shape the relational model and its transactions exist for.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.relational-database](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.relational-database)

### 55. B

*sysadmin.system-administration.systemd-target · System Administration Fundamentals :: System Administration · depth 3 · application*

`default.target` is a symlink naming where boot converges, and `systemctl set-default` rewrites it — a change that persists across every future boot. `systemctl get-default` reads the current setting, and `isolate` changes the running system immediately but leaves the standing default untouched.

- **A.** `isolate` only changes the running system right now; it does nothing about which target the next boot converges on.
- **B.** Correct. It changes where future boots converge by rewriting the `default.target` symlink, which is exactly a permanent, standing change.
- **C.** `get-default` only reads and prints the current default; it takes no target argument to change anything.
- **D.** `runlevel` only prints the previous and current SysV runlevel; it does not set anything, on this system or any other.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd-target](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd-target)

### 56. A

*devops.git-concepts.working-directory-staging-area-and-repository · DevOps Fundamentals :: Git Concepts · depth 3 · discrimination*

`git commit -a` auto-stages modifications and deletions of already-tracked files as part of committing, but it never adds a file Git has never seen — that still needs an explicit `git add`. A commit records exactly what the index holds at the moment `git commit` runs, nothing else.

- **A.** Correct. The new file is untracked; `-a` covers only tracked-file modifications and deletions, so it is silently left out of the commit.
- **B.** This is the exact trap `-a` sets: it auto-stages tracked-file changes only, so a genuinely new file needs `git add` before it is ever committed.
- **C.** That is backwards: `-a` exists specifically to skip `git add` for files Git already tracks, and it does stage and commit their changes.
- **D.** `-a` has the opposite scope: it only ever touches paths Git already tracks, and a new file is by definition not one of those.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.working-directory-staging-area-and-repository](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.working-directory-staging-area-and-repository)

### 57. C

*security.sensitive-data.masking-anonymization-and-pseudonymization · Security Fundamentals :: Sensitive Data · depth 2 · discrimination*

Masking hides a value in a display or a copy while typically leaving the original intact behind it. Pseudonymization substitutes a token or hashed identifier and retains, separately, whatever is needed to reverse it — GDPR Article 4(5) requires that additional information to be kept, not destroyed. Only anonymization removes the association outright, which is why it alone is genuinely one-way.

- **A.** Article 4(5) requires that additional information to be kept separately and protected, not destroyed — the mapping's continued existence is exactly why pseudonymized data stays personal data.
- **B.** Masking is a presentation control: it typically leaves the original value intact behind the display, which is the opposite of an irreversible change.
- **C.** Correct. Only anonymization is genuinely one-way; both masking and pseudonymization leave something behind that can be reversed.
- **D.** Anonymization is a technique applied to data that was identifying; data that was never PII needs no such technique to begin with.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.masking-anonymization-and-pseudonymization](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.masking-anonymization-and-pseudonymization)

### 58. C

*linux.linux-operating-system.storage-devices · Linux Fundamentals :: Linux Operating System · depth 3 · discrimination*

RAM is volatile and byte-addressable, directly by the CPU; storage devices are persistent and block-addressable through a filesystem and driver. Exhausting one causes swapping or an OOM kill; exhausting the other causes write failures — different failure modes following from that one axis.

- **A.** RAM and storage differ sharply in what exhausting them causes — swapping or the OOM killer for RAM, write failures for storage — so treating 'usage' as identical loses that distinction.
- **B.** Both RAM allocation and storage device access are kernel-managed; the distinction is not about which layer manages them.
- **C.** Correct. The guide's own comparison names persistence as the separating axis, with byte-addressable RAM on one side and block-addressable storage on the other.
- **D.** RAM access by a process is also mediated by the kernel's memory management; the difference is volatility and addressing granularity, not kernel involvement.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.storage-devices](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.storage-devices)

### 59. B

*cloud.performance-availability.monitoring-and-metrics · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · discrimination*

Monitoring collects predefined numeric signals and alerts when a chosen threshold is crossed — it answers questions you knew to ask in advance. Observability is the broader property, built from logs, metrics and traces together, that lets you answer questions you had not anticipated; metrics are one input to it, not a synonym for it.

- **A.** This swaps the pair: threshold alerting on a predefined signal is monitoring, and combining logs, metrics and traces to answer an unanticipated question is observability instead.
- **B.** Correct. Monitoring requires the threshold to be known before the event; observability is the property that lets an unanticipated question be answered from logs, metrics and traces together.
- **C.** Observability draws on logs and traces as well as metrics, and its defining feature — answering unanticipated questions — is not something monitoring's predefined thresholds provide.
- **D.** A dashboard is a display surface for whichever signals were collected; it does not decide whether an unanticipated question can be answered, which is what separates the two practices.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.monitoring-and-metrics](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.monitoring-and-metrics)

### 60. C

*sysadmin.troubleshooting.structured-troubleshooting-method · System Administration Fundamentals :: Troubleshooting · depth 4 · discrimination*

The comparison turns on scope: the structured troubleshooting method names the entire ordered procedure and is what answers "what do I do first," while narrowing scope is a single early technique that produces a reduced set of candidates rather than a completed, verified fix.

- **A.** Narrowing scope ends with a reduced candidate set, not a fix; only the full method reaches verification and documentation.
- **B.** Reproduction is a distinct precondition for verification, not a gate that narrowing scope depends on or replaces.
- **C.** Correct. Scope of the term is the separating axis: the method spans and completes the whole investigation, while narrowing scope produces a smaller candidate set and stops there.
- **D.** This reverses the actual scope: the method applies to every fault as a discipline, and narrowing scope is only useful where the blast radius is not already known.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.structured-troubleshooting-method](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.structured-troubleshooting-method)

