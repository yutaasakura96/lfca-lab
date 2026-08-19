<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 03 — answers

### 1. A

*sysadmin.best-practices.automation-and-idempotency · System Administration Fundamentals :: Best Practices · depth 3 · application*

Automation replaces a manual procedure with a script; idempotency is the separate property that running it twice leaves the same end state with no further change. An unconditional append is automated and not idempotent, and re-running it across a fleet turns one mistake into fifty.

- **A.** Correct. Automation without idempotency multiplies a mistake instead of removing it, and appending unconditionally is exactly that mistake.
- **B.** Being automated says nothing about whether repeated runs are safe; convergence requires the operation itself to check state first.
- **C.** A single successful test says nothing about what a second or hundredth run does; only re-running tests for idempotency.
- **D.** Idempotency is a property of how the operation is written, not a consequence of it being scheduled or automated.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.automation-and-idempotency](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.automation-and-idempotency)

### 2. D

*cloud.best-practices.automation-over-manual-configuration · Cloud Computing Fundamentals :: Best Practices · depth 3 · discrimination*

The auditability argument for infrastructure as code is precise, not sweeping: a console action is recorded by the provider's audit service by default, so the claim that it 'leaves no record' is false. What it genuinely lacks is a reproducible artifact — a reviewable definition of the change that can be diffed, approved and reapplied — which is what a template provides and a console click does not.

- **A.** AWS CloudTrail, Azure Activity Log and Google Cloud Audit Logs all record console actions by default; the true gap is the missing reproducible artifact.
- **B.** Encryption at rest is unrelated to whether a change was made through a console or a template.
- **C.** Console access is governed by the same IAM policy as any other API call; it does not inherently carry administrator rights.
- **D.** Correct. Console actions are logged by the provider's audit service by default; what they lack is a reviewable, reapplicable definition of the change.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.automation-over-manual-configuration](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.automation-over-manual-configuration)

### 3. B

*linux.command-line.command-chaining · Linux Fundamentals :: Command Line · depth 3 · application*

`||` runs the next command only if the previous one exited non-zero. `ping -c1 host || echo unreachable` prints the message exactly when the ping fails, and does nothing when it succeeds.

- **A.** `&&` runs the right side only on success, the opposite of what is needed here — the message should appear precisely when the ping fails.
- **B.** Correct. `||` is short-circuit OR: the right-hand command runs only when the left-hand command failed, which is exactly "print unreachable only on failure."
- **C.** `;` ignores exit status entirely, so it would print "unreachable" every time, including when the ping succeeds.
- **D.** A pipe connects standard output to standard input; it does not branch on exit status at all, so it cannot produce "run only on failure" behaviour.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-chaining](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-chaining)

### 4. D

*security.security.attack-surface · Security Fundamentals :: Security · depth 3 · application*

Attack surface is the total set of points an attacker can interact with, and it is the one quantity reducible without knowing about a specific flaw. Removing an unused service eliminates its exposure entirely, including future vulnerabilities, while patching addresses only a named defect and filtering only reachability.

- **A.** Patching fixes one known flaw in software that keeps running, so the exposure remains and the next undiscovered flaw still affects it.
- **B.** A firewall rule reduces reachable surface without reducing installed surface — the service is still present if the rule is ever wrong.
- **C.** Attack surface can be reduced without knowing about any specific flaw; waiting for a named CVE is not required to act.
- **D.** Correct. A service that is not installed cannot be exploited by any vulnerability, discovered or not, which is why removal beats patching or filtering when it is an option.

Study it: [04-security/security.md#c-security.security.attack-surface](../study-guide/04-security/security.md#c-security.security.attack-surface)

### 5. B

*devops.containers.cluster-and-node · DevOps Fundamentals :: Containers · depth 2 · recall*

Node, pod, and container form a containment hierarchy the exam expects a candidate to keep straight: a cluster contains nodes, a node runs pods, and a pod holds containers.

- **A.** This reverses the cluster and the node; a cluster is the larger pool that a node belongs to, not the other way around.
- **B.** Correct. Each layer contains the next: the cluster is the whole pool of machines, a node is one machine, and a pod is the unit of containers running on it.
- **C.** Every cluster needs at least one worker node in order to run pods at all; a node is not an optional layer.
- **D.** This inverts the entire hierarchy; a node is a machine that runs pods, not something contained inside one.

Study it: [05-devops/containers.md#c-devops.containers.cluster-and-node](../study-guide/05-devops/containers.md#c-devops.containers.cluster-and-node)

### 6. A

*pm.functional-analysis.non-functional-requirements · IT Project Management Fundamentals :: Functional Analysis · depth 3 · application*

Non-functional requirements constrain how well a behaviour performs, and that classification says nothing about necessity. A team that conflates the two can drop a requirement — often the one deciding the architecture — on no stronger basis than its label.

- **A.** Correct. The word 'non-functional' describes what kind of requirement it is, never how important it is — treating it as a synonym for low priority is the single most common inversion.
- **B.** This treats the symptom rather than the mistake: swapping in the right label for 'dropped' still leaves classification standing in for a priority judgement it cannot make.
- **C.** Nothing in the scenario suggests the wording is unmeasurable; the stated reasoning is about priority, not testability.
- **D.** This is the inversion itself, restated as if it were the rule: non-functional requirements are frequently the ones that decide the architecture.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.non-functional-requirements](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.non-functional-requirements)

### 7. B

*sysadmin.best-practices.capacity-planning · System Administration Fundamentals :: Best Practices · depth 2 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

Per consensus practice, monitoring reports a value now and alerts when a threshold is crossed — a statement about the present. Capacity planning extrapolates historical utilisation forward against a known ceiling to produce a date, which is what makes procurement and a maintenance window schedulable before they become urgent. The two are complementary, and the planning is only as good as the history the monitoring retained.

- **A.** A threshold crossed now is exactly the present-tense statement capacity planning is distinguished from.
- **B.** Correct. An 85% alert is a statement about now; deciding when the array will be full and arranging expansion is a statement about the future made from the same data.
- **C.** The alert says nothing about whether the volume is recorded in an inventory; it reports a usage level.
- **D.** A threshold alert states a current condition; it does not by itself schedule a window for future work.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.capacity-planning](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.capacity-planning)

### 8. A

*cloud.best-practices.health-checks-and-graceful-shutdown · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

If the target closes its connections before the deregistration delay elapses — the exact failure a process that exits immediately on the termination signal produces — clients receive 500-level errors, which is why graceful shutdown and the deregistration delay window exist as a pair with health checks.

- **A.** Correct. Elastic Load Balancing waits a deregistration delay, 300 seconds by default, precisely so in-flight requests can finish before the target goes away.
- **B.** A scale-in termination is a capacity decision, not a health-check failure; the missing piece is draining in-flight work, not a check.
- **C.** Instance size is unrelated to whether in-flight requests are drained before termination; the errors come from an abrupt cutoff, not from capacity.
- **D.** Immutability governs how instances are built and replaced, not whether in-flight requests are drained during any given termination.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.health-checks-and-graceful-shutdown](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.health-checks-and-graceful-shutdown)

### 9. A

*sysadmin.disaster-recovery.disaster-recovery-drill · System Administration Fundamentals :: Disaster Recovery · depth 3 · discrimination*

A drill is a rehearsed exercise — full failover or tabletop — proving the plan works and that people know their roles. Restore testing proves one artefact can be read back. The axis is scope: an artefact versus the procedure and the people around it.

- **A.** Correct. A drill exercises the procedure and the participants, not only the artefact.
- **B.** That is what restore testing establishes on its own.
- **C.** Tolerable data loss is evidenced by copy frequency rather than by a rehearsal.
- **D.** Geographic separation is a property of where copies sit, not something a drill measures.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.disaster-recovery-drill](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.disaster-recovery-drill)

### 10. B

*linux.command-line.diff-and-comparison · Linux Fundamentals :: Command Line · depth 3 · application*

`diff`'s exit status is 0 when the files are identical, 1 when they differ, and 2 on trouble — a difference correctly makes `diff a b && echo same` skip the echo, which is the expected outcome, not a bug.

- **A.** `diff` reserves 0 specifically for identical files; a successful comparison that finds a difference still reports 1, by design.
- **B.** Correct. `diff`'s exit status is 0 when files are identical, 1 when they differ, and 2 on trouble, so a non-zero status from a real difference is expected and correctly skips the `&&` branch.
- **C.** The extension of the files has no bearing on the exit status; status 2 is reserved for genuine trouble such as a missing file, not for any particular file type.
- **D.** `&&` runs the next command only on exit status 0; status 1 is exactly what causes `&&` to skip the following command, which is the behaviour observed here.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.diff-and-comparison](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.diff-and-comparison)

### 11. D

*security.security.certificate-expiry-and-validation · Security Fundamentals :: Security · depth 3 · recall*

Expiry is entirely predictable and is the most common cause of a sudden, total outage, but it is a failure of trust, not of cryptography. An expired certificate still encrypts perfectly well; the client simply refuses to proceed because it can no longer vouch for the identity behind the connection.

- **A.** The guide states directly that this is the wrong reading of the warning; encryption is unaffected by expiry, only trust in the certificate is.
- **B.** There is no automatic protocol downgrade on expiry; a client that rejects an expired certificate simply refuses to connect at all.
- **C.** CA compromise is a separate, unrelated failure; an ordinary expiry needs no such investigation to explain the outage.
- **D.** Correct. Expiry invalidates trust in the certificate, not the cryptography itself, so "the connection is unencrypted" is the wrong reading of the failure.

Study it: [04-security/security.md#c-security.security.certificate-expiry-and-validation](../study-guide/04-security/security.md#c-security.security.certificate-expiry-and-validation)

### 12. A

*sysadmin.disaster-recovery.snapshot · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

A snapshot is a point-in-time view of a volume. Local snapshots live alongside the original, so losing the volume loses them, which is why they are not an independent copy. Cloud provider snapshots are typically written to separate storage and do survive deletion of the source volume — the distinction is where the snapshot is stored, not the word itself.

- **A.** Correct. A local snapshot is a view into the same underlying storage, so it does not survive that storage failing.
- **B.** That describes a backup; independence from the original storage is exactly what a local snapshot lacks.
- **C.** True of typical cloud provider snapshots, but not of local LVM or filesystem snapshots.
- **D.** RAID is a separate mechanism and is not implied by taking a snapshot.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.snapshot](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.snapshot)

### 13. C

*devops.containers.container-logs-and-exec · DevOps Fundamentals :: Containers · depth 3 · discrimination*

Diagnostic order matters: `docker logs` reads the captured stdout/stderr stream and works on a container that has already exited, while `docker exec -it` needs a running process to join and does not.

- **A.** `docker logs` specifically works on an exited container because it reads a captured stream rather than talking to a live process.
- **B.** Allocating a terminal does not create a process to run inside; exec always needs a running container to attach its new process to.
- **C.** Correct. Logs are a replay of a captured stream that survives the process exiting, while exec starts a new process inside one that must already be running.
- **D.** An exited container's filesystem being on disk does not make it possible to start a new process inside it; exec still requires a live main process.

Study it: [05-devops/containers.md#c-devops.containers.container-logs-and-exec](../study-guide/05-devops/containers.md#c-devops.containers.container-logs-and-exec)

### 14. C

*cloud.budgeting.data-egress-charges · Cloud Computing Fundamentals :: Budgeting · depth 2 · application*

Egress is metered by volume and banded by destination: on Azure's published rates, transfer between North America regions is $0.02 per gigabyte against $0.08 and up for internet egress, and same-region transfer is free. The ordering is not universal even within that table — internet egress grants a free first 100 GB that inter-region traffic does not, and from South America inter-region transfer is dearer than internet egress via the transit ISP network — so carrying the pattern to another provider unchecked is exactly the assumption this concept warns against.

- **A.** Spot is a compute purchase option and carries no data-transfer discount of its own; the two meters are entirely unrelated.
- **B.** Tags are metadata used for attribution and policy; they carry no billing discount for the data-transfer meter itself.
- **C.** Correct. Azure prices transfer between North America regions at $0.02 per gigabyte against $0.08 and up for internet egress beyond the free first 100 GB — but the bands differ by continent, so this is Azure's specific shape rather than a rule that transfers to AWS or Google Cloud.
- **D.** Egress is metered by volume, but it is also banded by destination — internet-bound and inter-region traffic are priced differently, not identically.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.data-egress-charges](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.data-egress-charges)

### 15. D

*linux.command-line.general-networking-commands · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

`ping` sends ICMP echo requests, so success proves the host is reachable and ICMP is permitted; failure proves neither, because ICMP is very commonly filtered while the actual service still answers fine. The same ladder includes `ip addr` for interface addresses, `ip route` for the routing table, and `hostname` for the system's own name.

- **A.** Echo replies are ordinary IP traffic and are filtered by firewalls routinely; a healthy host behind such a filter answers its real services while never answering `ping`.
- **B.** A `ping` against an address that resolved fine can still time out due to ICMP filtering; the failure described does not by itself indicate a DNS problem.
- **C.** A working local interface says nothing about whether a distant firewall permits ICMP through to it; the timeout does not localise the problem to the operator's own interface.
- **D.** Correct. `ping` proves reachability when it succeeds, but failure proves neither reachability nor unreachability, because ICMP echo requests are very commonly filtered by firewalls even when the actual service answers fine.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.general-networking-commands](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.general-networking-commands)

### 16. B

*pm.open-source-software-and-licensing.contributor-license-agreement · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 1 · recall*

A CLA is a grant of rights, not a transfer: it lets the project use, and often sublicense, a contribution while the contributor keeps ownership. Some projects use a Developer Certificate of Origin sign-off instead, asserting provenance rather than granting rights.

- **A.** Neither instrument grants repository access: the ASF, for one, requires a signed individual CLA before commit rights are given, but the rights themselves are conferred by the project on merit, not by the agreement.
- **B.** Correct. A CLA is a grant of rights over work the contributor still owns, whereas assignment moves ownership itself to the project.
- **C.** Section 3's patent grant is a term of the licence covering the project's code as distributed, not something a CLA switches on for individual contributions.
- **D.** This collapses a rights grant into an ownership transfer; the distinguishing fact is precisely that a CLA leaves ownership with the contributor.

Study it: [06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-compliance](../study-guide/06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-compliance)

### 17. A

*sysadmin.networking.etc-hosts · System Administration Fundamentals :: Networking · depth 3 · discrimination*

`/etc/hosts` is the fastest way to override name resolution on one host — for testing a migration before changing DNS — and because the file is read on each lookup, changes take effect immediately with no restart, unlike `/etc/resolv.conf`, which only names servers to ask and holds no name data of its own.

- **A.** Correct. `/etc/hosts` is the fastest way to override name resolution on one host for exactly this kind of testing, while `/etc/resolv.conf` cannot express a name-to-address mapping in the first place.
- **B.** `/etc/resolv.conf` lists nameservers to query and search domains; it has no syntax for mapping a specific name to a specific address, which is `/etc/hosts`'s job.
- **C.** Lowering a TTL is preparation for a DNS change everywhere, not a way to test on a single machine without touching DNS at all, which is what the scenario specifically asks for.
- **D.** ARP resolves IP addresses to MAC addresses on the local segment; it has no mechanism for resolving a hostname at all, which is a completely different layer of the problem.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.etc-hosts](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.etc-hosts)

### 18. C

*sysadmin.networking.listening-vs-established-connections · System Administration Fundamentals :: Networking · depth 3 · application*

`ss -tulpn` shows listening sockets, answering whether a service is running and accepting connections, while `ss -t state established` filters to TCP connections in the ESTAB state, answering who is actually using it — a service can be listening with zero clients, or have established connections while its listener is misconfigured elsewhere.

- **A.** `-l` restricts output to listening sockets specifically and deliberately excludes established connections, so `ss -tulpn` alone cannot answer who is currently connected.
- **B.** A service can have zero established connections while still listening perfectly well; established connections alone do not confirm a listener is present, only that some past connections succeeded.
- **C.** Correct. "Is the service running and accepting connections" is answered by the presence of a LISTEN socket, while "is anyone actually using it" is answered by established connections, and combining `-l` with a state filter is not meaningful because they select opposite things.
- **D.** `ss -tulpn` and `ss -t state established` are specifically designed to answer these two questions from the socket table directly, without needing to consult application logs at all.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.listening-vs-established-connections](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.listening-vs-established-connections)

### 19. C

*security.security.encryption-at-rest-vs-in-transit · Security Fundamentals :: Security · depth 2 · recall*

Encryption at rest and encryption in transit are two separate controls, and both stop short of data being actively processed. A compromised running application reads the unlocked filesystem and live memory as any permitted process would, which is why data in use is the exposure neither control was built to close.

- **A.** Full disk encryption protects data when the volume is locked or the hardware is lost; once the volume is unlocked and the system is running, files are readable to permitted processes as normal.
- **B.** Nothing in the scenario describes a network interception; the compromise reads memory directly on the host, which is outside what in-transit encryption covers in either case.
- **C.** Correct. At rest and in transit are the two named controls, and both leave data being actively processed by a compromised application outside their coverage.
- **D.** The pair covers storage and network transit specifically, and the guide names a third stage, data in use, that neither one reaches.

Study it: [04-security/security.md#c-security.security.encryption-at-rest-vs-in-transit](../study-guide/04-security/security.md#c-security.security.encryption-at-rest-vs-in-transit)

### 20. A

*cloud.budgeting.pay-as-you-go · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

Pay-as-you-go bills provisioned capacity, and stopping a VM does not always release that provision. Azure specifically distinguishes Stopped (allocated), which keeps billing, from Stopped (deallocated), which releases the hardware lease and stops the meter.

- **A.** Correct. Azure's states-and-billing model treats Stopped (allocated) as still billed; only Stopped (deallocated) releases the hardware and stops the meter.
- **B.** Purchasing option is unrelated to why a stopped machine keeps billing; that is governed by allocation state, not by on-demand versus reserved pricing.
- **C.** The trap here is simpler: a merely-stopped machine is not an orphan at all, since it still has an owner and a purpose, and no deletion has occurred.
- **D.** True on some platforms but not universally — Azure specifically continues billing a merely-stopped VM until it reaches the deallocated state.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.pay-as-you-go](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.pay-as-you-go)

### 21. C

*linux.command-line.pipes · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

A pipe only helps if the receiving command reads standard input. `ls` takes operands, not input, so `echo /tmp | ls` prints the current directory's listing and ignores the piped text entirely — `xargs` is what converts input into operands.

- **A.** `echo`'s output can be piped like any command's; the problem is entirely on the receiving end, where `ls` does not consume standard input for its target.
- **B.** Privilege has nothing to do with this; the issue is that `ls` reads operands, not standard input, regardless of who runs it.
- **C.** Correct. A pipe only helps if the receiving command reads standard input; `ls` expects its target as an operand, so the piped path is discarded and `ls` falls back to listing the current directory.
- **D.** Pipes never convert piped text into operands on their own; `xargs` is specifically the tool that performs that conversion, which this command is missing.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.pipes](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.pipes)

### 22. B

*devops.containers.port-mapping · DevOps Fundamentals :: Containers · depth 3 · discrimination*

`-p hostPort:containerPort` places the host side first. Writing `-p 80:8080` when port 8080 is the intended host-facing port and 80 is what the application listens on sends traffic the wrong direction — the mapping needs to be reversed.

- **A.** Binding a low host port needs the process to have permission to do so, but that is not why this mapping fails, and no such categorical restriction exists in `-p` itself.
- **B.** Correct. `-p hostPort:containerPort` puts the host side first, so the operator's intended container port ended up on the wrong side of the colon.
- **C.** `-p` publishes a port independently of whether the Dockerfile declares `EXPOSE`; `EXPOSE` is documentation only and not a prerequisite for publishing.
- **D.** `docker run -p` is exactly where a port mapping is set; `docker start` accepts no new flags at all, including a port mapping.

Study it: [05-devops/containers.md#c-devops.containers.port-mapping](../study-guide/05-devops/containers.md#c-devops.containers.port-mapping)

### 23. B

*sysadmin.networking.private-vs-public-ip-addresses · System Administration Fundamentals :: Networking · depth 3 · application*

RFC 1918 sets aside exactly 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16; 100.64.0.0/10 for carrier-grade NAT, 127.0.0.0/8 for loopback and 169.254.0.0/16 for link-local are all separately defined non-routable ranges outside RFC 1918.

- **A.** Non-routability is not the same as RFC 1918 membership; carrier-grade NAT space, loopback and link-local are all non-routable without being RFC 1918.
- **B.** Correct. RFC 1918 defines exactly three ranges — 10/8, 172.16/12 and 192.168/16 — and 100.64.0.0/10 is a distinct, later-defined range for carrier-grade NAT.
- **C.** Loopback is the fixed 127.0.0.0/8 block; 100.64.0.5 falls in the separate carrier-grade NAT range, not in loopback space.
- **D.** Link-local (APIPA) space is 169.254.0.0/16, a different range entirely from the 100.64.0.0/10 carrier-grade NAT block that 100.64.0.5 falls in.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.private-vs-public-ip-addresses](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.private-vs-public-ip-addresses)

### 24. D

*cloud.cloud-computing.hybrid-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Two public providers running unrelated workloads with no link, shared identity or data portability between them satisfy the definition of multi-cloud and nothing about hybrid: no private or community cloud is involved, and there is no binding technology joining the parts. The industry often calls arrangements like this hybrid loosely, but NIST's stricter reading is what the exam expects.

- **A.** That is the loose industry usage the guide warns against; the exam-safe reading is NIST's stricter one, which this arrangement fails on both conditions.
- **B.** Adding a second public provider is the definition of multi-cloud, not a route into hybrid; hybrid needs a mix of deployment models and a binding condition that multi-cloud does not supply.
- **C.** NIST's composition allows private, community or public in any mix of two or more; the actual missing ingredient here is the binding condition, not the absence of a private cloud in particular.
- **D.** Correct. Hybrid requires a mix of deployment models bound together; two independent public providers with no connective tissue satisfies neither condition.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hybrid-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hybrid-cloud)

### 25. D

*pm.open-source-software-and-licensing.permissive-licenses · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

MIT's conditions are of one kind: preserve the copyright notice, licence text and disclaimer. Nothing in it reaches the licence of the surrounding work, so the startup may ship a closed binary with nothing published but an attribution file.

- **A.** That reciprocal, whole-work reach is copyleft's defining feature; a permissive licence conditions nothing about the derivative's own licence.
- **B.** Permissive is not obligation-free: stripping the notice out of an MIT-licensed file is the standard permissive-licence violation.
- **C.** MIT says nothing about patents at all; that express patent grant is Apache-2.0's addition, not MIT's.
- **D.** Correct. Notice retention is the single condition MIT imposes; it reaches no further into the surrounding product.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.permissive-licenses](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.permissive-licenses)

### 26. B

*sysadmin.networking.tcp-three-way-handshake · System Administration Fundamentals :: Networking · depth 3 · application*

A connection that hangs sent a SYN and got nothing back, a silent drop usually caused by a firewall, while a connection refused instantly got an RST, meaning the packet reached a live host with nothing listening on that port — the handshake is what makes these two TCP failure modes readable and distinct.

- **A.** A refusal and a silent drop are different, distinguishable outcomes: a refusal means a live host answered with RST, while a hang means nothing answered at all, usually a firewall drop; the client's connect timeout changes how long the hang lasts, not whether an RST arrives.
- **B.** Correct. Being able to name which of the three handshake messages went missing, or which response arrived, turns "it won't connect" into a specific, testable hypothesis about where the fault sits.
- **C.** TLS negotiation happens after the three-way handshake completes; a hang before any TCP-level response at all is not a TLS failure, and an instant RST is a TCP-level response, not a TLS one.
- **D.** A host does not silently substitute UDP for a TCP connection attempt; the hang and refusal described are both TCP-level handshake behaviours, not a protocol switch.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.tcp-three-way-handshake](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.tcp-three-way-handshake)

### 27. D

*security.security.phishing-and-social-engineering · Security Fundamentals :: Security · depth 3 · application*

Phishing manipulates a person rather than defeating a technical control, so filters and DMARC reduce how much reaches an inbox but cannot patch the human decision to act on a convincing message. That is why user awareness training appears as this category's named defence almost nowhere else in the competency.

- **A.** DMARC and email filters specifically target phishing delivery; the gap here is that they reduce delivery volume without eliminating susceptibility, not that they target the wrong traffic entirely.
- **B.** MFA reduces phishing damage but does not end it — a real-time relay can still capture and replay a one-time code — so it is not a full substitute for user awareness.
- **C.** The defence choice follows from what the attack actually targets — a person's judgement — not from any legal classification of the attack type.
- **D.** Correct. Filters and DMARC reduce delivery, not susceptibility, and the human decision to act on a convincing message is the one component no technical control can close entirely.

Study it: [04-security/security.md#c-security.security.phishing-and-social-engineering](../study-guide/04-security/security.md#c-security.security.phishing-and-social-engineering)

### 28. B

*linux.command-line.reading-ls-l-output · Linux Fundamentals :: Command Line · depth 5 · application*

`ls -l` on a directory path lists the contents rather than the directory itself; only `ls -ld` shows the directory's own mode, combining `-d` (operate on the directory itself) with `-l`.

- **A.** A recursive listing prints the directory's path as a plain header followed by its contents, then repeats that for each subdirectory; no mode string for `/etc/nginx` itself appears in that output.
- **B.** Correct. `-d` operates on the directory entry itself rather than listing its contents, which is exactly what plain `ls -l` on a directory path does not do.
- **C.** `stat` has no `-d` option with that meaning, and borrowing another command's flag letter is a guess rather than a reading of `stat`'s own option list.
- **D.** A trailing `.` still names the directory's contents as the thing to list, producing the same result as omitting it, not the directory's own line.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.reading-ls-l-output](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.reading-ls-l-output)

### 29. B

*sysadmin.networking.vlan · System Administration Fundamentals :: Networking · depth 2 · recall*

VLANs are separate broadcast domains independent of physical location, so hosts in different VLANs cannot reach each other without a router or a layer 3 switch to forward between them, exactly as if they were on physically distinct switches — a broadcast-based protocol such as ARP or DHCP discovery stays inside its own VLAN.

- **A.** VLAN membership is exactly what determines broadcast-domain boundaries on a switch; sharing physical hardware does not override that separation.
- **B.** Correct. A VLAN divides a single physical switch into what behave as separate networks; hosts in different VLANs cannot reach each other without a device that forwards between broadcast domains.
- **C.** VLANs remain separate broadcast domains regardless of whether their addressing happens to overlap; a switch does not automatically bridge VLANs based on address similarity.
- **D.** 802.1Q tagging identifies which VLAN a frame belongs to on trunk links; it does not blanket-block traffic between ports, and access ports carry no tag at all.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.vlan](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.vlan)

### 30. B

*cloud.cloud-computing.object-block-and-file-storage · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · recall*

Object storage holds items in a flat namespace addressed by key, with no real directory structure underneath. What a console displays as a folder is constructed from a shared prefix on the object keys inside it, not an actual directory the way a filesystem provides one.

- **A.** There are no real directories in a flat, key-addressed namespace; the apparent folder structure is constructed entirely from prefixes shared by object keys.
- **B.** Correct. The guide states this directly: what looks like a folder in object storage is a prefix on the key, not an actual directory.
- **C.** That describes block storage after a guest OS formats it, which is a different storage shape entirely from the object storage the question is about.
- **D.** Object storage items are addressed by a key — typically a name-like string — not by numeric offset, which is a block storage concept instead.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.object-block-and-file-storage](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.object-block-and-file-storage)

### 31. B

*devops.containers.stateless-vs-stateful-containers · DevOps Fundamentals :: Containers · depth 2 · recall*

A stateless container keeps nothing that has to outlive it and is freely interchangeable; a stateful container owns data that must survive it and therefore needs persistent storage and, usually, a stable identity.

- **A.** Owning data on local disk is what makes a workload stateful, regardless of whether that data lives in a dedicated database engine.
- **B.** Correct. Statelessness is about whether an instance owns data that must outlive it; the API pushes its state outward while the queue keeps its own.
- **C.** Writing to a writable layer during normal operation does not make a workload stateful; what matters is whether data must survive the instance being replaced.
- **D.** Depending on an external stateful service does not make the dependent instance itself stateful, and messages stored on local disk are exactly the kind of data that must survive the instance.

Study it: [05-devops/containers.md#c-devops.containers.stateless-vs-stateful-containers](../study-guide/05-devops/containers.md#c-devops.containers.stateless-vs-stateful-containers)

### 32. A

*sysadmin.system-administration.chown-and-chgrp · System Administration Fundamentals :: System Administration · depth 3 · application*

Only a privileged process may change a file's owning user, so `alice` must ask an administrator to run `chown alice file` as root. An unprivileged user may change the group of a file they own, but only to a group they themselves belong to, which is a narrower privilege.

- **A.** Correct. Changing the owning user is restricted to a process with the capability root normally holds, regardless of who the target owner is.
- **B.** Read access has no bearing on the ownership-change privilege, which is restricted regardless of what the caller can already do with the file.
- **C.** The restriction applies to the operation itself, not to whether the target happens to be the caller — an ordinary user cannot chown a file at all.
- **D.** An unprivileged user may change a file's group, but only to a group they belong to — it is not unrestricted, and it does not change the owner.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.chown-and-chgrp](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.chown-and-chgrp)

### 33. D

*linux.command-line.shell-scripting-basics · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

A file saved with Windows line endings has a shebang line ending in a carriage return, so the kernel looks for an interpreter named `/bin/bash\r`, which does not exist — producing the misleading "bad interpreter: No such file or directory."

- **A.** Copying a file onto a Linux server does not touch `/bin/bash` or any symlink already there; the reported error names the interpreter path, which is the signature of a stray carriage return appended to it.
- **B.** A missing execute bit produces "Permission denied," not "bad interpreter"; the wording here specifically points at the interpreter path itself being wrong.
- **C.** There is nothing wrong with `#!/bin/bash` as an interpreter path; the failure is caused by the invisible carriage return appended to the line, not by which interpreter was named.
- **D.** Correct. Windows line endings leave a trailing carriage return on the shebang line; the kernel takes the entire rest of that line as the interpreter path, so it searches for a nonexistent path with `\r` appended and reports it as missing.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.shell-scripting-basics](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.shell-scripting-basics)

### 34. D

*security.security.security-logging-and-monitoring · Security Fundamentals :: Security · depth 2 · recall*

Clocks are synchronised across hosts specifically so events from different systems can be correlated into a single, accurate timeline. Without that synchronisation, an investigator cannot reliably determine the order in which activity occurred across the database, web, and firewall logs, even though each individual log remains readable.

- **A.** Unsynchronised clocks affect the reliability of cross-system ordering, not the readability of any single log file on its own.
- **B.** Retention is a separate setting governing how long records are kept; it does not depend on whether clocks across hosts agree with each other.
- **C.** TLS certificate validation checks clock time against a certificate's validity window, but ordinary log shipping to a collector does not require synchronised clocks to encrypt successfully.
- **D.** Correct. The guide names clock synchronisation specifically so events from different systems can be correlated into a timeline; without it, ordering events across hosts becomes unreliable.

Study it: [04-security/security.md#c-security.security.security-logging-and-monitoring](../study-guide/04-security/security.md#c-security.security.security-logging-and-monitoring)

### 35. B

*pm.project-management.issue-tracking · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

Issue tracking records work and defects, each with an identifier, an owner and a state, so status is visible without asking. An issue is something that has already occurred and needs resolving; a risk is an uncertain future event assessed for likelihood and impact. A missed delivery date last week has already happened, so it belongs in the tracker as an issue.

- **A.** Concern about a future recurrence doesn't change what already happened; this specific event needs resolving now, which is what makes it an issue.
- **B.** Correct. A risk is an uncertain future event; the vendor's miss has already occurred, which is exactly what puts it in the tracker as an issue rather than the risk register.
- **C.** There's nothing left to assess for likelihood; the event already occurred, and scoring likelihood and impact applies to risks, not to something that has happened.
- **D.** The communication plan governs who is told and when, not where the item itself is recorded; it belongs in the tracker regardless of who is escalated to.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.issue-tracking](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.issue-tracking)

### 36. D

*sysadmin.system-administration.etc-passwd · System Administration Fundamentals :: System Administration · depth 3 · recall*

`/etc/passwd` has seven fields: username, password placeholder (x), UID, GID, comment/GECOS, home directory, and login shell. The placeholder is the field most often dropped when counting by memory, which shifts every later field. `getent passwd` is the NSS-aware way to look up a row without opening the file directly.

- **A.** The placeholder field is easy to forget, but it is still field two — omitting it miscounts everything after it by one.
- **B.** The fourth field is the primary GID; the login shell comes three fields later.
- **C.** `/etc/shadow` holds password hashes and ageing data, not the login shell, which lives in `/etc/passwd`.
- **D.** Correct. The order is username, password placeholder, UID, GID, comment, home directory, then login shell.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-passwd](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-passwd)

### 37. A

*cloud.cloud-computing.virtual-machine · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Because the whole machine — firmware, boot loader, kernel, init system, userland — is represented as a disk image plus configuration rather than bound to particular hardware, it can be created, destroyed, snapshotted, cloned and moved to another host with little or no downtime, a resilience a bare-metal server cannot offer on its own.

- **A.** Correct. Being defined entirely as data rather than physical hardware is what makes both live migration and rollback-by-snapshot possible in the first place.
- **B.** A virtual machine is not built from containers; it is a full guest OS on top of a hypervisor, and its portability comes from being software-defined, not from any container layer.
- **C.** Real-time replication to a standby is a specific, separately configured high-availability arrangement, not an automatic property that every VM has by default.
- **D.** Shared responsibility describes who patches and secures which layer; it does not explain the technical mechanism that makes live migration or rollback possible at all.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.virtual-machine](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.virtual-machine)

### 38. D

*sysadmin.system-administration.journald · System Administration Fundamentals :: System Administration · depth 4 · diagnostic*

The journal is persistent only if `/var/log/journal` exists; otherwise it lives in `/run/log/journal`, which is memory-backed and discarded at every reboot. `journalctl --list-boots` shows what is actually retained, and if nothing is, that absence is itself the finding — enabling persistent storage is the first remediation.

- **A.** The tool is working correctly; an empty result for the previous boot is the expected behaviour of a volatile, non-persistent journal, not a fault in `journalctl`.
- **B.** journald does capture kernel and crash-time messages when persistent storage exists; the issue here is that persistence was never configured at all.
- **C.** `-b -1` is the correct syntax for the boot before the current one; the empty result is a persistence problem, not a syntax error.
- **D.** Correct. By default the journal is persistent only if `/var/log/journal` exists; otherwise it is memory-backed and vanishes at the very reboot that would otherwise let it be inspected.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.journald](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.journald)

### 39. D

*devops.devops-basics.language-package-managers · DevOps Fundamentals :: DevOps Basics · depth 3 · discrimination*

A language package manager resolves application-level dependencies for one project; the operating system's package manager installs system-wide software for the machine as a whole. The two answer different questions even though both share the word package.

- **A.** The two answer different questions: one resolves what a single application needs, the other installs software for the machine as a whole.
- **B.** A container image can carry pinned dependencies, but the install described here is the ordinary job of a language package manager, not a container.
- **C.** Machine-wide software is normally the operating system package manager's job; the two tools answer different questions about scope.
- **D.** Correct. Application-level dependencies belong to a language package manager, and system-wide software belongs to the operating system's own tool.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.language-package-managers](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.language-package-managers)

### 40. A

*linux.command-line.wildcards-and-globbing · Linux Fundamentals :: Command Line · depth 3 · application*

Before executing, the shell scans an unquoted word for pattern characters and replaces it with matching pathnames. If nothing matches, bash leaves the word exactly as typed, so `ls *.txt` in an empty-of-.txt directory produces an error about a file literally named `*.txt`.

- **A.** Correct. When a glob matches nothing, bash's default behaviour is to leave the word unexpanded rather than delete it, so `ls` receives the literal string `*.txt` as if it were a real filename.
- **B.** `*` has no special meaning to `ls` itself; pattern expansion is entirely the shell's job, and `ls` only ever sees the result the shell hands it.
- **C.** The scenario states there are no `.txt` files at all, so nothing matched; the literal-passthrough behaviour is what produced the error, not an unexpected match.
- **D.** `ls` only reports on entries that already exist and has no option that creates one; the error proves the shell handed it a name that was never expanded, not that a file appeared.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.wildcards-and-globbing](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.wildcards-and-globbing)

### 41. D

*cloud.networking.bastion-and-jump-hosts · Cloud Computing Fundamentals :: Networking · depth 2 · application*

The managed forms go a step further than a self-managed jump box: Microsoft documents Azure Bastion virtual machines needing no public IP, agent, or special client software, and AWS documents Session Manager as providing node management without opening inbound ports.

- **A.** Microsoft documents that virtual machines reached via Azure Bastion need no public IP address, agent, or special client software, and AWS documents Session Manager as needing no open inbound ports at all — the targets' exposure is what actually changes.
- **B.** Outbound routing through a NAT gateway is unrelated to how an administrator reaches the machine for a session; the change here concerns inbound administrative access, not general outbound traffic.
- **C.** Switching to a DNS name would not by itself remove an open inbound port; the managed service's benefit is eliminating the open port and the public IP address, not changing how the target is named.
- **D.** Correct. Both providers document their managed services as removing the need for any inbound port or public IP on the target.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.bastion-and-jump-hosts](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.bastion-and-jump-hosts)

### 42. C

*security.security.ssh-hardening · Security Fundamentals :: Security · depth 5 · command*

`sshd_config` follows first-obtained-value semantics — the opposite of most formats — so a drop-in file included earlier in the main file wins over a directive written further down. `sshd -T` prints the effective configuration, which is the documented way to confirm which value is actually in force rather than guessing from file order alone.

- **A.** This is last-wins reasoning, which is the opposite of `sshd_config`'s actual first-obtained-value behaviour — the earlier-included drop-in value wins instead.
- **B.** `sshd_config` does not merge conflicting scalar directives by restrictiveness; it takes the first value it obtains and ignores subsequent ones for that keyword.
- **C.** Correct. `sshd_config` is first-obtained-value, the opposite of most configuration formats' last-wins behaviour, and `sshd -T` is the documented way to see which value actually took effect.
- **D.** `sshd -t` only validates syntax and reports errors before a reload; it is `sshd -T` that prints the effective configuration a drop-in file may be overriding.

Study it: [04-security/security.md#c-security.security.ssh-hardening](../study-guide/04-security/security.md#c-security.security.ssh-hardening)

### 43. C

*sysadmin.system-administration.log-rotation · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Removing a file a daemon still has open frees no space at all until that descriptor closes, which is exactly the `df`/`du` discrepancy this concept explains. The durable fix is configuring log rotation so files never grow unbounded in the first place, rather than deleting a huge log after the fact.

- **A.** The reported figure will not change on its own; the blocks remain allocated as long as the daemon keeps the deleted file's descriptor open, however long that is.
- **B.** Compression status has nothing to do with whether deleting the file frees its blocks; the cause here is an open file descriptor held by a running process.
- **C.** Correct. Deleting a file a process still holds open frees no space until that process closes or restarts, and rotation is what avoids ever needing manual deletion again.
- **D.** Inode exhaustion produces a distinct "No space left" symptom with free blocks still showing; this scenario describes blocks that remain allocated, consistent with a held-open deleted file.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.log-rotation](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.log-rotation)

### 44. B

*linux.linux-operating-system.everything-is-a-file · Linux Fundamentals :: Linux Operating System · depth 2 · recall*

The kernel presents devices and interfaces as special file types, alongside pseudo-filesystems like `/proc` and `/sys`, using the same open/read/write/close calls as ordinary files. That is why so many 'how do I check X' answers reduce to reading a path.

- **A.** `/proc/cpuinfo` reports machine-wide hardware facts and is not a per-user isolated resource; multi-user isolation is a different design property.
- **B.** Correct. The principle is exactly that pseudo-filesystems like `/proc` expose live kernel state as readable text through the same open/read calls as a regular file.
- **C.** That boundary explains why a system call is needed at all; it does not explain why the data is reachable at a filesystem path in the first place, which is the file-abstraction principle.
- **D.** It is a pseudo-file backed by live kernel state, generated on read rather than stored on disk, which is why it always reflects current information.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.everything-is-a-file](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.everything-is-a-file)

### 45. C

*pm.project-management.scope-creep · IT Project Management Fundamentals :: Project Management · depth 3 · application*

Scope creep is growth that happens without a matching adjustment to time, cost or baseline. A customer asking for more is normal; what turns it into creep is the team absorbing the request informally, with no impact assessment and no re-baselining, which is exactly what happened here, however small the field.

- **A.** The source of the request, customer or team, doesn't determine whether it's creep; the missing step is assessment and approval, wherever the request originated.
- **B.** 'Small' is exactly the size of request that accumulates into creep; the size doesn't exempt it from needing assessment.
- **C.** Correct. Scope grew without an impact assessment, approval, or an updated baseline; that absence of control is what makes it creep, regardless of how small the field sounds.
- **D.** An unchanged schedule and budget after adding work usually means the cost was absorbed silently, not that there was none — that absorption is the mechanism of creep.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.scope-creep](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.scope-creep)

### 46. A

*sysadmin.system-administration.primary-vs-supplementary-group · System Administration Fundamentals :: System Administration · depth 3 · application*

Every user has exactly one primary group, and that is the group applied to files they create; supplementary groups only add access to files that already exist, unless a directory carries the SGID bit. `id` and `groups` both show the current membership; `usermod -g` changes the primary group, while `usermod -aG` appends a supplementary one.

- **A.** Correct. The primary group is exactly the one applied to a file at creation time, unless SGID or another mechanism overrides it.
- **B.** Supplementary groups grant access to files that already exist; they do not become the owning group of a new one.
- **C.** Group ownership follows the primary/supplementary distinction, not alphabetical order.
- **D.** An unprivileged process still creates files under its own primary group; no privilege is required for that.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.primary-vs-supplementary-group](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.primary-vs-supplementary-group)

### 47. C

*cloud.networking.vpc-peering-and-private-connectivity · Cloud Computing Fundamentals :: Networking · depth 3 · discrimination*

Overlapping addressing disqualifies a peering connection outright: it cannot be created between networks whose CIDR blocks match or overlap, which is the genuine, surviving exam point in this area.

- **A.** No major provider re-addresses a network automatically to resolve an overlap; the peering request is instead rejected, and re-addressing one side manually is the only fix.
- **B.** Overlapping address ranges block both — a dedicated circuit and a peering connection both require non-overlapping ranges, so this reverses which mechanism the constraint applies to.
- **C.** Correct. AWS states this limit plainly: overlapping addressing disqualifies the connection outright.
- **D.** The connection is never created in the first place when ranges overlap, so no route table entries are generated for it to misdirect.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.vpc-peering-and-private-connectivity](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.vpc-peering-and-private-connectivity)

### 48. C

*devops.git-concepts.commit-messages · DevOps Fundamentals :: Git Concepts · depth 2 · recall*

The convention of a short imperative summary followed by a body exists because the diff already shows what changed, in complete and permanent detail, while nothing else in the repository records why the change was made or what was rejected along the way.

- **A.** That information is exactly what the diff already shows permanently; repeating it in the message adds nothing the repository does not already provide.
- **B.** Author and timestamp are already recorded on the commit object itself, independent of the message text, so a message adds nothing new there.
- **C.** Correct. The diff already records what changed, in full and forever; the message's unique contribution is the reasoning a later reader cannot reconstruct from the code alone.
- **D.** A commit does not belong to a branch in a way the message would need to record; branch membership is just reachability from a movable pointer, unrelated to message content.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.commit-messages](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.commit-messages)

### 49. A

*sysadmin.system-administration.service-account · System Administration Fundamentals :: System Administration · depth 3 · application*

A service account is an unprivileged account created to run a daemon rather than to be logged into, so that a compromised service is confined to whatever narrow privilege that account holds instead of an administrator's full access.

- **A.** Correct. A dedicated, unprivileged account bounds what an attacker gains if the daemon is compromised, which is the whole reason the practice exists.
- **B.** A service account exists to run a daemon, not to provide anyone with an interactive login.
- **C.** A service account is created unprivileged by design; nothing about the category grants root automatically.
- **D.** Which scheduler runs a job is unrelated to whether it runs under a dedicated account.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.service-account](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.service-account)

### 50. A

*security.sensitive-data.data-classification · Security Fundamentals :: Sensitive Data · depth 3 · application*

Where a set mixes labels, schemes conventionally give the aggregate the highest label present, because the set discloses everything its most sensitive member discloses. Neither a majority vote nor an access-control mechanism computes that label — classification is a decision applied to the data itself, distinct from both vote-counting and from the clearance held by any person handling it.

- **A.** Correct. A set that includes the Restricted file exposes that file's contents whenever the whole set is exposed, so the aggregate cannot be labelled any lower.
- **B.** Labelling by majority ignores that exposing the set discloses the most sensitive member regardless of how many less-sensitive files sit alongside it.
- **C.** MAC enforces a policy against labels; it does not compute a new label by averaging the inputs of a merge.
- **D.** Clearance belongs to a person; classification belongs to the data. Conflating the two is the trap this concept warns about directly.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.data-classification](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.data-classification)

### 51. A

*linux.linux-operating-system.kernel-space-vs-user-space · Linux Fundamentals :: Linux Operating System · depth 3 · discrimination*

Kernel space and user space name a CPU-enforced privilege boundary, not a Unix permission level. A root process still runs in user space; it simply has fewer permission checks applied to it there. Only a system call crosses into kernel space, and even then it is the kernel executing, not the calling process itself.

- **A.** Correct. Kernel space is a CPU-enforced execution mode entirely separate from any Unix user account, including root.
- **B.** Fewer permission checks are not the same as a different CPU privilege ring; kernel space names that ring, which root does not enter merely by holding elevated rights.
- **C.** Every user-space process, root included, runs in its own address space with kernel memory unreachable from it; that is why even a root process must issue a system call to have the kernel act on its behalf.
- **D.** This is a CPU-level distinction with no distribution-specific variation; no mainstream Linux distribution grants a user-space process direct kernel-mode execution.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.kernel-space-vs-user-space](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.kernel-space-vs-user-space)

### 52. B

*sysadmin.system-administration.symbolic-vs-numeric-chmod · System Administration Fundamentals :: System Administration · depth 5 · application*

Symbolic mode expresses a relative change: `g+w` adds exactly the group-write bit and leaves the rest, including the setgid special bit, untouched. A three-digit numeric mode like `775` is absolute and always clears the setuid/setgid/sticky digit unless it is explicitly included — both are forms of the same `chmod` command, and the notation chosen changes what survives.

- **A.** A three-digit numeric mode is absolute and rewrites all nine permission bits; on a regular file such as this one the omitted leading digit is taken as zero, silently dropping the setgid bit.
- **B.** Correct. Symbolic mode changes are relative: `g+w` adds group write and leaves every other bit, including setgid, exactly as it was.
- **C.** A umask only affects permissions assigned to files created afterward; it has no effect on a file that already exists.
- **D.** Recursion is unnecessary and potentially harmful on a single file; the target here is one file, not a tree.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.symbolic-vs-numeric-chmod](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.symbolic-vs-numeric-chmod)

### 53. C

*cloud.performance-availability.bottleneck-identification · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · application*

The ordering matters more than the technique: measure each resource under load, find the one that is actually saturated, and only then apply a fix aimed at it. Adding instances without first locating the constraint is exactly the attractive wrong answer the exam supplies.

- **A.** Horizontal scaling helps only if application capacity was the actual constraint; if the real bottleneck sits elsewhere, such as a database's disk, added instances change nothing.
- **B.** Recovery objectives describe disaster-recovery targets around restoring service after a major failure, not a live performance-tuning decision.
- **C.** Correct. Effort spent on any resource other than the one that is saturated changes nothing measurable; the constraint has to be found first.
- **D.** A CDN helps a regional distance problem for cacheable content; it does not address a database-side constraint behind a dynamic checkout flow.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.bottleneck-identification](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.bottleneck-identification)

### 54. A

*pm.software-application-architecture.rest · IT Project Management Fundamentals :: Software Application Architecture · depth 3 · application*

The example is HTTP and JSON but not REST-shaped: the verb sits in the URL, and one method handles every operation, which is exactly the uniform-interface violation the guide's trap calls out.

- **A.** Correct. REST models things as resources addressed by a URL and acted on by the method's own semantics; putting the verb in the path and using POST throughout abandons both.
- **B.** REST is a style, not a specification, and returning JSON over HTTP alone does not make an interface RESTful; JSON isn't even mandated.
- **C.** That describes any API's documentation and doesn't determine whether the design underneath is REST-shaped.
- **D.** REST is a synchronous request/response style over HTTP; nothing about it involves decoupling client and server in time the way a queue does.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.rest](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.rest)

### 55. C

*sysadmin.system-administration.syslog-and-severity-levels · System Administration Fundamentals :: System Administration · depth 3 · recall*

Syslog severity runs from Emergency (0) as most severe down to Debug (7) as least severe — the numbering is inverted from intuition. Filtering to "level 3 and above" in severity means 3, 2, 1 and 0 (Error through Emergency), which does not include Warning at level 4.

- **A.** Numerically, Warning (4) is a higher number than Error (3), and on this inverted scale a higher number is less severe, so it falls outside the filter.
- **B.** Facility identifies the source subsystem and is a separate dimension from severity; it does not change whether a given severity number is captured by this filter.
- **C.** Correct. The scale runs opposite to intuition: the most severe level has the lowest number, so "level 3 and above" means numerically lower, more severe levels only.
- **D.** The scale starts at 0 for Emergency, the most severe level, and counts upward toward less severe levels, the opposite of what this option describes.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.syslog-and-severity-levels](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.syslog-and-severity-levels)

### 56. C

*devops.git-concepts.pull-request · DevOps Fundamentals :: Git Concepts · depth 3 · recall*

A pull request is a proposal, raised on a hosting platform rather than in Git, to merge one branch into another, and the place where review and automated checks attach before that merge happens. It is process, not mechanism: `git commit` and `git merge` both run locally with no platform involved, while a pull request has no Git command that opens one at all.

- **A.** `git commit` and `git merge` are documented Git commands; a pull request is a platform feature with no equivalent entry in Git's own manual pages.
- **B.** `git merge` runs locally with no network needed, same as `git commit`; a pull request is the one requiring the platform, which is the actual odd one out.
- **C.** Correct. Unlike commit and merge, a pull request runs entirely on the platform layer; opening one changes no history and there is no `git pull-request` command that performs it.
- **D.** A pull request does not itself combine anything — it only proposes a merge that a human or the platform performs later — so it does not share that property with `git merge`.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.pull-request](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.pull-request)

### 57. D

*security.sensitive-data.masking-anonymization-and-pseudonymization · Security Fundamentals :: Sensitive Data · depth 2 · application*

Anonymization must survive an attempt to re-identify. Hashing an email address is pseudonymization rather than anonymization because the input space of plausible email addresses is small enough to enumerate, so the mapping is effectively recoverable without any separately held key. Pseudonymized data remains personal data under GDPR, unlike data that has genuinely been anonymized under Recital 26.

- **A.** One-way is necessary but not sufficient; if the input space is small enough to enumerate, the function is reversible in practice even though no key is involved.
- **B.** Whether a DLP rule would have intervened is a separate control question and has no bearing on whether hashing achieves true anonymization.
- **C.** Article 34(3)(a) excuses individual notification where data was rendered unintelligible, which presumes the data is still in scope; it does not establish that hashing places data outside GDPR.
- **D.** Correct. NIST SP 800-122 warns that de-identified information can be re-identified, and a keyless hash of a low-entropy input like an email address can be reversed by enumeration.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.masking-anonymization-and-pseudonymization](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.masking-anonymization-and-pseudonymization)

### 58. C

*linux.linux-operating-system.system-information-commands · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`uname -a` reports kernel name, hostname, kernel release, version, and machine hardware name together. `cat /etc/os-release` reports distribution identity specifically. `uptime` reports time since boot plus load averages — three commands for three distinct facts.

- **A.** That file reports distribution identity only; it does not include kernel version or uptime, which come from `uname` and `uptime` respectively.
- **B.** `hostnamectl` is systemd-specific and absent on non-systemd distributions, and it does not report uptime or load averages, which `uptime` provides separately.
- **C.** Correct. Each command is scoped to a distinct fact: `uname -a` for kernel/hardware, the distribution file for identity, and `uptime` for elapsed time and load.
- **D.** `uname -a` reports kernel and hardware facts; it does not reliably report the distribution's name and release, which is what `/etc/os-release` is specifically for.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.system-information-commands](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.system-information-commands)

### 59. C

*cloud.performance-availability.monitoring-and-metrics · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

The four golden signals are latency, traffic, errors and saturation. Saturation specifically measures how full the constraining resource is — queued work against it — which is what actually drives user-visible latency as a system approaches its limit.

- **A.** The golden signals are user-facing service signals, not a fixed list of hardware resources, and the actual constraint can also be an external dependency.
- **B.** Cost is a separate business concern the golden-signals framework does not include, and the correct fourth signal is saturation, not throughput.
- **C.** Correct. These are the four signals Google's SRE material names first, and saturation is specifically about queued work against the tightest resource, distinct from simple utilisation.
- **D.** Elasticity is a design property, not a metric to alert a threshold on, and this list omits traffic and saturation entirely.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.monitoring-and-metrics](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.monitoring-and-metrics)

### 60. D

*sysadmin.troubleshooting.name-resolution-failure · System Administration Fundamentals :: Troubleshooting · depth 4 · application*

A single `127.0.0.53` nameserver line is the signature of `systemd-resolved`'s stub resolver rather than the real upstream configuration, which lives with that service instead of in the generated file. Editing the file directly is overwritten the next time the stub is regenerated.

- **A.** On a `systemd-resolved` system the file is generated, and a manual edit to it is overwritten rather than taking effect.
- **B.** DNS resolution is handled in user space by the resolver service; kernel messages are not where its upstream server configuration is recorded.
- **C.** Reachability of the stub address doesn't reveal where the actual upstream servers are configured, which is what the question asks.
- **D.** Correct. On systems running `systemd-resolved`, `/etc/resolv.conf` is commonly a symlink to a generated stub file naming only the local stub address, while the real upstream servers are held by the resolver service.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.name-resolution-failure](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.name-resolution-failure)

