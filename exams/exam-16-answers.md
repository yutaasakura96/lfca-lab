<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 16 — answers

### 1. A

*sysadmin.disaster-recovery.backup · System Administration Fundamentals :: Disaster Recovery · depth 3 · command*

`rsync` exists precisely for repeated directory-tree copies: it determines what differs and sends only that. `tar` creates an archive and is the right tool for bundling, not for incremental transfer.

- **A.** Correct. It compares source and destination and transfers only differing files, which is what makes repeated runs cheap.
- **B.** It bundles files into a single archive but has no notion of what the destination already holds, so every run copies everything.
- **C.** A local snapshot stays on the same storage as the original and never moves data to the backup host.
- **D.** That keeps a live mirror rather than a nightly independent copy, and propagates deletions immediately.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.backup](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.backup)

### 2. C

*cloud.best-practices.encryption-by-default · Cloud Computing Fundamentals :: Best Practices · depth 2 · discrimination*

At rest and in transit defend against different attackers, and neither protects against an over-privileged identity that is entitled to call the API, because the service decrypts for authorised callers by design — 'the bucket is encrypted' is not an answer to 'the bucket was readable by someone who should not have had access'.

- **A.** Encryption at rest protects stored bytes from theft; it does not track or restrict which identities may call the API afterward.
- **B.** TLS protects data crossing the network; it does not evaluate whether the caller's identity should be allowed to make the request.
- **C.** Correct. Encryption at rest and in transit both defend against attackers without valid credentials, not against a credentialed caller with too much access.
- **D.** The choice between key types is about who controls key policy, rotation and audit trail, not about the strength or scope of protection against an authorised caller.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.encryption-by-default](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.encryption-by-default)

### 3. A

*linux.command-line.awk · Linux Fundamentals :: Command Line · depth 3 · application*

Single-quoting the program is essential. Inside double quotes the shell expands `$1` first, so awk receives an empty program fragment and prints empty lines with no error to explain it.

- **A.** Correct. Double quotes still allow the shell to expand `$` expressions, so `$1` is read as the shell's own first positional parameter — typically unset — leaving awk with an empty program fragment instead of a field reference.
- **B.** `$1` is valid awk field syntax; the problem here is that the shell consumed it before awk ever received the program text.
- **C.** `/etc/passwd` does have a first, colon-delimited field — the username — so a working `$1` reference would print it; the empty output is a quoting problem, not a data problem.
- **D.** `$1` is recognised without `-F`; that flag only changes the field separator, not whether field variables are read at all.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.awk](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.awk)

### 4. C

*security.compliance.policy-standard-and-procedure · Security Fundamentals :: Compliance · depth 2 · recall*

Policy, standard and procedure are separated by specificity: the policy states intent and who is bound, the standard states the measurable mandatory requirement, and the procedure gives the steps that satisfy it. Only the standard tier carries a threshold, which is what a control’s observed performance is compared against. NIST SP 800-53 Rev. 5 names policies, standards and guidelines as distinct instruments an organisational policy must be consistent with.

- **A.** A procedure gives the steps that satisfy a requirement; the level those steps have to reach is set by the standard above them.
- **B.** A policy states intent and who is bound by it, and stating intent sets no measurable level a control can be held to.
- **C.** Correct. A standard states the level that has to be met, which is what makes a control’s observed performance comparable to anything at all.
- **D.** A guideline is recommended rather than mandatory, so it carries no threshold an assessor could hold a control to.

Study it: [04-security/compliance.md#c-security.compliance.policy-standard-and-procedure](../study-guide/04-security/compliance.md#c-security.compliance.policy-standard-and-procedure)

### 5. D

*devops.containers.image-layers · DevOps Fundamentals :: Containers · depth 2 · application*

Layers cache in Dockerfile order, and invalidating one layer invalidates every layer after it. Copying the dependency manifest first, installing, and only then copying source keeps the expensive install layer cached across ordinary code changes.

- **A.** A dependency install step is cached exactly like any other `RUN`, and reordering the Dockerfile changes how often it actually re-executes.
- **B.** The registry plays no role during a local build; it only stores and serves images that have already been built.
- **C.** A pinned or unpinned base image affects whether the base layer is refreshed, not whether the dependency-install layer downstream is invalidated by a source change.
- **D.** Correct. The `COPY` of the source tree runs before the install step, so any source edit invalidates that copy layer and cascades forward to the install.

Study it: [05-devops/containers.md#c-devops.containers.image-layers](../study-guide/05-devops/containers.md#c-devops.containers.image-layers)

### 6. A

*pm.functional-analysis.feasibility-study · IT Project Management Fundamentals :: Functional Analysis · depth 1 · recall*

A feasibility study assesses, before commitment, whether a proposal is technically, operationally and economically achievable — with legal and schedule feasibility often added. Recognition of the term and its dimensions is what this level of the exam expects.

- **A.** Correct. A feasibility study assesses achievability across those dimensions ahead of commitment, which is a different question from naming how far apart two states are.
- **B.** That is exactly what the gap analysis already produced; it is not the question a feasibility study adds.
- **C.** Ordering by value is prioritization's job, a separate step from asking whether the work is achievable at all.
- **D.** A gap analysis says how far apart the current and desired states are; a feasibility study asks whether closing that distance is achievable and worth committing to at all.

Study it: [06-it-project-management/functional-analysis.md#s-functional-analysis-analysis](../study-guide/06-it-project-management/functional-analysis.md#s-functional-analysis-analysis)

### 7. A

*sysadmin.disaster-recovery.redundancy-and-single-points-of-failure · System Administration Fundamentals :: Disaster Recovery · depth 2 · recall*

The practice is duplicating components so that no single failure stops the service, and then identifying where no such duplicate exists. The answer is always the component with a count of one on the path every request takes.

- **A.** Correct. It is the one component whose loss stops the service, having no counterpart.
- **B.** Two is sufficient for the service to survive losing one of them.
- **C.** Each server is described as carrying two supplies, so the loss of one supply stops nothing.
- **D.** Nothing in the description says the balancer is unduplicated, whereas the switch plainly is.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.redundancy-and-single-points-of-failure](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.redundancy-and-single-points-of-failure)

### 8. B

*cloud.budgeting.capex-vs-opex · Cloud Computing Fundamentals :: Budgeting · depth 2 · application*

The CapEx-to-OpEx shift changes when money is committed and how reversible that commitment is, not whether the eventual total is smaller — that depends entirely on how well the resulting consumption is controlled.

- **A.** That claim requires costing both sides fully, which is what total cost of ownership does, not what the accounting shift itself proves.
- **B.** Correct. The trade is predictability against elasticity — a known committed number versus an unknown continuous one — not a guarantee that the total is smaller.
- **C.** That describes the pay-as-you-go meter's behaviour, and it is false there too — provisioned capacity bills whether or not it is used.
- **D.** Consumption is still tracked against a target and controlled deliberately by the customer; nothing about a metered bill removes the need to plan and cap spend, and no provider enforces a limit on your behalf by default.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.capex-vs-opex](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.capex-vs-opex)

### 9. A

*sysadmin.disaster-recovery.rpo · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

The recovery point objective is a statement about acceptable data loss, and the only lever on it is how often a recoverable copy is made. Everything that speeds up recovery moves the recovery time objective instead.

- **A.** Correct. The tolerable data loss is bounded by the interval between recoverable copies.
- **B.** Faster recovery shortens the outage, not the amount of data lost before it began.
- **C.** Automated failover reduces time to restore service rather than the recovery point.
- **D.** Retention extends how far back you can reach, not how recent the newest copy is.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.rpo](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.rpo)

### 10. B

*linux.command-line.cut-sort-uniq-and-wc · Linux Fundamentals :: Command Line · depth 3 · application*

`cut -d: -f1` splits on the colon delimiter and prints the first field, which is exactly the username column in a colon-delimited file like `/etc/passwd`.

- **A.** `-k` chooses a sort key for ordering lines; it does not extract or print only that field on its own.
- **B.** Correct. `-d:` sets the delimiter to a colon and `-f1` selects the first field, which is exactly the username column in that file's format.
- **C.** `wc -l` counts newline characters across the whole file; it has nothing to do with extracting a specific field from each line.
- **D.** `uniq -c` collapses adjacent duplicate whole lines and prefixes a count; it does not extract or restrict output to a single field.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.cut-sort-uniq-and-wc](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.cut-sort-uniq-and-wc)

### 11. D

*security.compliance.soc-2-and-iso-27001 · Security Fundamentals :: Compliance · depth 1 · recall*

SOC 2 and ISO 27001 are both voluntary frameworks organisations adopt to evidence their security posture, but neither is a law and their outputs differ: SOC 2 produces an examination report, never a certificate, while ISO 27001 produces certification through an accredited body.

- **A.** A SOC 2 engagement yields a service auditor’s examination report, so the two frameworks’ outputs are not the interchangeable pair this option assumes.
- **B.** SOC 2 is a voluntary AICPA attestation framework, not a law, and it does not require anything of organisations that never choose to adopt it.
- **C.** SOC 2 is an AICPA framework covering security, availability, processing integrity, confidentiality or privacy, and has nothing to do with card payments.
- **D.** Correct. AICPA describes SOC as assurance reports CPAs provide, while ISO states it does not itself certify and that certification is performed by external certification bodies.

Study it: [04-security/compliance.md#s-compliance-regulations](../study-guide/04-security/compliance.md#s-compliance-regulations)

### 12. B

*sysadmin.networking.dns-resolution-order · System Administration Fundamentals :: Networking · depth 3 · recall*

The `hosts:` line in `/etc/nsswitch.conf` sets the order in which name-resolution sources are consulted; `files dns`, the conventional value, means `/etc/hosts` is read first and a nameserver is queried only if no entry there matches, which explains why a stale hosts entry can silently override a correct DNS record.

- **A.** The `hosts:` line governs which sources are consulted and in what order, not which record types may be requested from a nameserver once one is queried.
- **B.** Correct. The `hosts:` line lists sources in priority order, and `files dns` specifically means the local hosts file wins first, with DNS consulted only as a fallback.
- **C.** TTL governs how long a resolver caches an answer and is set per DNS record, not derived from the `hosts:` line, which is only about source order.
- **D.** Regeneration of `/etc/resolv.conf` is managed separately by NetworkManager, a DHCP client, or systemd-resolved; the `hosts:` line has no role in that process.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dns-resolution-order](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dns-resolution-order)

### 13. D

*devops.containers.kubernetes-service · DevOps Fundamentals :: Containers · depth 3 · discrimination*

ClusterIP exposes the Service inside the cluster only and is the default; NodePort additionally exposes it on a port on each node; LoadBalancer exposes it externally through a load balancer, typically provisioned by the cloud provider.

- **A.** ClusterIP is explicitly internal-only and cannot be reached from outside the cluster no matter how the application is configured.
- **B.** NodePort exposes a port on each node directly, which is a different mechanism from a provider-managed external load balancer, even though both allow outside traffic in.
- **C.** That setting concerns which network namespace a pod uses, not how external clients discover a stable address; it is not the standard mechanism for external exposure.
- **D.** Correct. LoadBalancer is specifically the type built for external exposure; ClusterIP is deliberately unreachable from outside the cluster.

Study it: [05-devops/containers.md#c-devops.containers.kubernetes-service](../study-guide/05-devops/containers.md#c-devops.containers.kubernetes-service)

### 14. D

*cloud.budgeting.orphaned-resources · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

An orphan and a rightsizing candidate are told apart by whether the resource still has a purpose: the orphan has none and the answer is deletion, while a rightsizing candidate still serves a purpose at the wrong size and the answer is resizing.

- **A.** Rightsizing applies to a resource that still serves a real purpose at the wrong size; this disk has no purpose left at all, so resizing is the wrong lever entirely.
- **B.** A missing tag makes finding the owner harder, but it does not block deletion once inventory evidence — attachment state and last activity — confirms the disk has no purpose.
- **C.** Deleting a virtual machine does not delete its disks by default on Azure, where they persist in the resource group and keep billing on their own meter until somebody removes them deliberately.
- **D.** Correct. The volume's purpose is entirely gone, not merely mis-sized; deletion recovers the whole of its cost, while resizing would recover only a difference between two sizes.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.orphaned-resources](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.orphaned-resources)

### 15. C

*linux.command-line.finding-files · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`find` walks a directory tree live and filters on name, type, size, timestamp or permission, so it always sees a file the moment it exists. `locate` queries a prebuilt index and is faster but can be stale, which rules it out for a file created moments ago.

- **A.** Speed is real, but `locate` trades it for freshness: its index is only as current as the last `updatedb` run, which a thirty-second-old file has certainly missed.
- **B.** which(1) prints the full path of the executable that would run for a command name, searching only the directories listed in `PATH`; it has nothing to do with locating an arbitrary file by name.
- **C.** Correct. `find` inspects the filesystem as it walks it, while `locate` queries a database refreshed periodically by `updatedb` and would not yet know about a thirty-second-old file.
- **D.** whereis(1) 'locates the binary, source and manual files for the specified command names' by looking in standard Linux places and the directories named by `$PATH` and `$MANPATH`, not by walking the filesystem for an arbitrary name.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.finding-files](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.finding-files)

### 16. C

*pm.open-source-software-and-licensing.mit-and-bsd-licenses · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · recall*

Neither MIT nor any BSD variant grants patent rights, requires a NOTICE file, or requires modified files to be marked — a difference from Apache-2.0, not a reassurance, since it means patent risk is simply left unaddressed.

- **A.** MIT contains no patent language at all, implied or otherwise; that scoped grant is Apache-2.0's own express provision.
- **B.** That reach-into-the-derivative pattern describes copyleft reasoning, which MIT, as a permissive licence, does not carry.
- **C.** Correct. Neither MIT nor any BSD variant grants patent rights; that omission is exactly the gap Apache-2.0 was written to fill.
- **D.** Being grouped in the same permissive family does not make MIT's terms identical to Apache-2.0's; the termination clause is specific to Apache-2.0's section 3.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.mit-and-bsd-licenses](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.mit-and-bsd-licenses)

### 17. B

*sysadmin.networking.ipv4-address · System Administration Fundamentals :: Networking · depth 3 · application*

`ip addr` prints each address with its prefix length attached, and applying that mask to two addresses is the only way to know whether they share a network — an address quoted without a mask never answers the question.

- **A.** An address by itself does not say where the network/host split falls; only the mask does, and a differing last octet does not by itself imply different subnets.
- **B.** Correct. Applying the /24 mask to both addresses yields the same network portion, 192.168.5.0, so the two hosts are directly reachable on-link.
- **C.** The gateway matters for reaching off-subnet destinations, but whether two hosts are on the same subnet is decided purely by applying the mask to both addresses.
- **D.** MAC address vendor prefixes say nothing about IP subnet membership; only the IP addresses and the mask applied to them decide that question.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ipv4-address](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ipv4-address)

### 18. A

*sysadmin.networking.network-interface-naming · System Administration Fundamentals :: Networking · depth 3 · application*

A predictable name starts with a two-character prefix for the interface type — `en` Ethernet, `wl` wireless LAN, `ww` wireless WAN — followed by a suffix derived from where the device sits: `p<bus>s<slot>` the PCI geographic location, so `enp0s3` reads as Ethernet, PCI bus 0, slot 3.

- **A.** Correct. A predictable name starts with a two-character prefix for the interface type, `en` for Ethernet, followed by a suffix derived from where the device sits, here a PCI bus and slot combination.
- **B.** `en` specifically denotes Ethernet, not wireless (`wl` is the wireless prefix), and the suffix encodes hardware topology, a PCI bus and slot, not a detection-order count the way `eth0` and `eth1` did.
- **C.** The prefix identifies interface type (Ethernet, wireless, and so on), not which network manager is in use, and the suffix encodes hardware location, not a manager-assigned priority level.
- **D.** The name is deliberately structured and decodable, derived from hardware topology, precisely so it remains stable and meaningful across reboots, not arbitrary or random.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.network-interface-naming](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.network-interface-naming)

### 19. D

*security.security.accounting-and-auditing · Security Fundamentals :: Security · depth 3 · application*

Accounting is the only one of the three As that produces evidence of what an authenticated, authorized identity actually did. It is what makes an insider's legitimate-access misuse reconstructable, since authentication and authorization have already been satisfied and cannot flag it themselves.

- **A.** MFA strengthens proof of identity at login; it does nothing once a legitimately authenticated identity is already acting.
- **B.** Authorization decides access at the point of the request and is not re-run per row, so it never notices a pattern of legitimate reads accumulating over weeks.
- **C.** Accounting exists precisely to catch what preventive access controls cannot, so the AAA triad is not blind to this case.
- **D.** Correct. The insider's access is legitimate, so the preventive controls never engage; only reviewing the record of what was done can surface the exfiltration.

Study it: [04-security/security.md#c-security.security.accounting-and-auditing](../study-guide/04-security/security.md#c-security.security.accounting-and-auditing)

### 20. D

*cloud.cloud-computing.container-vs-virtual-machine · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

'Lightweight' describes density and start time honestly, but it says nothing about the isolation boundary being given up: because the kernel is shared, administrators must constrain memory and CPU so one container cannot starve the rest, and a kernel-level compromise is not contained the way it would be inside a VM's own kernel. Picking containers for everything trades that boundary away without pricing the trade.

- **A.** Containers run on shared hardware routinely, and that density is the whole basis for the slogan; the actual gap is the isolation cost, not a hardware-sharing limitation.
- **B.** Containers typically cost less per workload precisely because the operating system overhead is shared rather than duplicated, and a container image packages the files a process needs rather than an operating system to boot.
- **C.** Virtual machines are the canonical IaaS product on every public cloud platform; nothing about the container-versus-VM choice excludes VMs from cloud infrastructure.
- **D.** Correct. The guide is explicit that answering the container-versus-VM question needs the mechanism, not the slogan, and the isolation trade-off is exactly what 'lightweight' glosses over.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.container-vs-virtual-machine](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.container-vs-virtual-machine)

### 21. D

*linux.command-line.navigating-the-filesystem · Linux Fundamentals :: Command Line · depth 3 · application*

Skipping a directory check before a destructive command means it may run in an unexpected directory. `pwd` confirms the current working directory before anything irreversible happens.

- **A.** bash(1) says a bare `cd` goes to `$HOME`, and that `cd` writes the new working directory to standard output only when the argument is `-` or when the name came from `CDPATH`.
- **B.** Listing entries including dotfiles shows what a directory contains, not which directory the shell is currently in.
- **C.** `pwd` reports it directly, and a prompt is configurable — it may show an abbreviated path or none at all.
- **D.** Correct. `pwd` prints the full pathname of the current working directory — precisely the value a relative path would be resolved against.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.navigating-the-filesystem](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.navigating-the-filesystem)

### 22. C

*devops.devops-basics.continuous-deployment · DevOps Fundamentals :: DevOps Basics · depth 3 · discrimination*

Continuous deployment implies continuous delivery because it satisfies everything delivery requires and then removes the remaining gate. Reversing the implication, assuming delivery guarantees deployment, is the standard error.

- **A.** This states the implication backwards; delivery is the weaker claim and does not guarantee the gate has been removed.
- **B.** Sharing an abbreviation and a pipeline is exactly why the two are confused, but the gate makes them distinct, non-equivalent practices.
- **C.** Correct. Deployment is delivery with the gate also removed, so deployment necessarily has everything delivery has, but not the reverse.
- **D.** Both do depend on continuous integration, but that shared dependency does not make the implication between them symmetric or absent.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.continuous-deployment](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.continuous-deployment)

### 23. C

*sysadmin.networking.subnet-mask-and-cidr · System Administration Fundamentals :: Networking · depth 3 · recall*

A larger prefix number always means a smaller network: /26 sets aside 6 host bits for 64 addresses while /24 sets aside 8 for 256, so /26 is a quarter the size of /24, not four times it.

- **A.** A larger prefix number means more bits are claimed by the network portion, leaving fewer host bits and therefore a smaller, not larger, network.
- **B.** The prefix length directly determines how many host bits remain, and therefore how many addresses the block contains; /26 and /24 do not hold the same count.
- **C.** Correct. /24 leaves 8 host bits (256 addresses) and /26 leaves 6 host bits (64 addresses); 64 is a quarter of 256, matching the two extra prefix bits.
- **D.** Each additional bit of prefix halves the address count, so two extra bits of prefix (24 to 26) is a factor of four, not two.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.subnet-mask-and-cidr](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.subnet-mask-and-cidr)

### 24. D

*cloud.cloud-computing.multi-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · recall*

NIST SP 800-145 names exactly four deployment models — private, community, public and hybrid — and multi-cloud is not among them. That absence is itself examinable: multi-cloud is a real and useful industry term, defined directly by vendors such as AWS, but it is a consumption pattern layered on top of NIST's models rather than a fifth model of its own.

- **A.** This reverses the two: hybrid cloud is the NIST-defined model with a binding condition, while multi-cloud is the industry term NIST never defines.
- **B.** Managed services is not a deployment model at all, and public cloud is very much one of NIST's four, named explicitly.
- **C.** Community cloud is in fact one of NIST's four; multi-cloud is the term that is absent, not community cloud.
- **D.** Correct. NIST's four named deployment models are exactly private, community, public and hybrid — the word multi-cloud appears nowhere in SP 800-145.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.multi-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.multi-cloud)

### 25. C

*pm.open-source-software-and-licensing.source-code-and-binaries · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 2 · recall*

Several licences attach obligations specifically to distributing the binary form. The GPL's Corresponding Source requirement is triggered by conveying object code; permissive licences require only that notices travel with whatever form is shipped.

- **A.** The GPL does not forbid compiling; it conditions distributing the resulting object code on offering the Corresponding Source.
- **B.** MIT has no NOTICE-file concept; that requirement belongs to Apache-2.0, not to MIT or to the GPL.
- **C.** Correct. Conveying object code is precisely the act the GPL attaches its Corresponding Source obligation to.
- **D.** This is the assumption the distinction exists to correct: only copyleft licences attach an obligation to the binary form.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.source-code-and-binaries](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.source-code-and-binaries)

### 26. C

*sysadmin.networking.traceroute · System Administration Fundamentals :: Networking · depth 4 · application*

Because the default method uses UDP to unusual ports, a firewall can block traceroute entirely while the service you actually care about works — which is exactly why `-I` and `-T` exist, and why a trace that dies at the first hop should be re-run with a different method before any conclusion is drawn.

- **A.** A first-hop failure with the default UDP method is commonly a filtering artefact of that specific probe method, not conclusive proof of a broken path, especially when the service is independently known to work.
- **B.** The scenario specifies the trace is run against a working destination, and a first-hop failure with the default method is a probe-filtering issue, not evidence of a DNS problem.
- **C.** Correct. Because the default method uses UDP to unusual ports, a firewall can block traceroute entirely while the service actually works, which is exactly why `-I` and `-T` exist and why a trace dying at the first hop should be re-run with a different method before any conclusion is drawn.
- **D.** `mtr` combines ping and traceroute functionality but is not uniquely capable of switching probe methods; `traceroute` itself supports `-I` and `-T` directly for exactly this purpose.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.traceroute](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.traceroute)

### 27. D

*security.security.authentication-vs-authorization · Security Fundamentals :: Security · depth 3 · application*

Authentication establishes identity and always runs first, because authorization has nothing to evaluate until a subject is known. HTTP's status codes invert the intuitive reading: `401 Unauthorized` is a failed authentication, while `403 Forbidden` is an authenticated request that authorization still refuses.

- **A.** This is the naming trap the guide calls out explicitly: `401` is the missing-credentials code, not the permissions code.
- **B.** Authorization has nothing to evaluate until an identity exists, so it cannot run before authentication regardless of the status code involved.
- **C.** Accounting is the third A of AAA and records what happened after access is decided; it has no HTTP status code of its own.
- **D.** Correct. HTTP's naming inverts intuition — `401 Unauthorized` is actually an authentication failure — and there is nothing to authorize until an identity is established.

Study it: [04-security/security.md#c-security.security.authentication-vs-authorization](../study-guide/04-security/security.md#c-security.security.authentication-vs-authorization)

### 28. A

*linux.command-line.script-control-flow · Linux Fundamentals :: Command Line · depth 2 · application*

`[` is a command (a synonym for `test`); `-eq` compares numbers while `=` compares strings, and using the wrong one on the wrong type either errors or silently compares the wrong thing.

- **A.** Correct. `[` is a command whose operators are typed: `-eq` numerically compares its operands, while `=` compares them as text, so applying `-eq` to something non-numeric produces an error rather than a meaningful comparison.
- **B.** `-eq` specifically performs a numeric comparison, which behaves differently from `=`'s string comparison whenever the operands are not simple integers.
- **C.** `-eq` is a standard operator for single-bracket `[ ]` (equivalent to `test`) as well as `[[ ]]`; it is not restricted to the double-bracket form.
- **D.** `[` performs no glob expansion of its own on the operands it is handed, and `=` compares any two strings as text with no restriction to filenames - which is why it is the correct operator for general string equality.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.script-control-flow](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.script-control-flow)

### 29. B

*sysadmin.system-administration.boot-process · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

systemd activates units in parallel wherever the dependency graph allows, so `blame`'s ranking by duration does not by itself show what delayed boot. `systemd-analyze critical-chain` identifies the actual ordering chain that determined when boot converged, which a merely slow but unwaited-on unit does not appear on.

- **A.** Duration alone does not establish delay when units run in parallel; `systemd-analyze critical-chain` is what shows the ordering chain that actually determined boot time.
- **B.** Correct. Because activation happens in parallel wherever dependencies allow, a slow unit only actually delays boot if something else is blocked waiting for it to finish.
- **C.** `blame` reports how long userspace units spent initialising; the firmware runs earlier still, before anything on disk has been read, and is outside what the command measures.
- **D.** Nothing in the scenario suggests the unit failed; it ran successfully but slowly, and the question is whether that slowness delayed anything else.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.boot-process](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.boot-process)

### 30. B

*cloud.cloud-computing.service-level-agreement · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

The provider's SLA is a promise about the platform, priced with a service credit if the provider's own threshold is missed — it says nothing about how a customer chooses to deploy on top of it. A single instance in one zone is exposed to exactly the kind of failure that redundancy across zones is meant to absorb; the SLA being met for the month changes nothing about that architectural gap, and the credit it would owe, if triggered at all, would be proportional to the provider's shortfall, not the customer's lost revenue.

- **A.** An SLA is a contractual promise about the platform's own availability, not a guarantee about how a customer chooses to deploy on it; high availability is a design property the customer's own architecture must provide.
- **B.** Correct. The provider's SLA covers the platform, not the customer's placement decisions on top of it — availability at the customer's layer comes from their own redundancy design, exactly as the guide states.
- **C.** SLA remedies are characteristically a service credit against future billing proportional to the shortfall, not compensation for the customer's business losses, and here the SLA threshold was not even missed.
- **D.** The scenario describes a single compute instance failing with its zone; no managed database or its patching is implicated in why this outage occurred.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.service-level-agreement](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.service-level-agreement)

### 31. C

*devops.devops-basics.developer-environments-and-parity · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

Parity is about shape, not size. A laptop is never going to match production's capacity and does not need to; what must match are the things that differ silently, such as runtime version, linked libraries, and configuration mechanism.

- **A.** This treats capacity as though it were part of parity, but parity never required the laptop to match production's scale.
- **B.** Instance count is a scale concern belonging to the environment ladder, not to whether the developer's runtime and configuration match production's shape.
- **C.** Correct. The concept explicitly separates shape from size, and the pinned dependencies here are exactly the shape that matters.
- **D.** Artifact promotion is a separate practice about environments further along the pipeline, not about what makes a developer's local setup match production.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.developer-environments-and-parity](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.developer-environments-and-parity)

### 32. D

*sysadmin.system-administration.etc-fstab · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

A malformed or wrong `/etc/fstab` entry can leave the boot process waiting on a device that cannot be found and dropping into emergency mode. `mount -a` applies the file to the running system immediately, surfacing any error while a working shell is still available to fix it.

- **A.** A malformed or unsatisfiable entry does not fail quietly — fstab(5) documents the `nofail` option as meaning "do not report errors for this device if it does not exist", which exists precisely because, without it, a bad entry is reported as an error at boot.
- **B.** That command reports the running kernel's current mount table, not whether the newly written fstab line itself is syntactically valid.
- **C.** `blkid` reports the type, UUID and label of filesystems that already exist; it neither generates identifiers nor validates or applies an fstab entry.
- **D.** Correct. It applies the fstab file to the running system immediately, which is exactly how to catch a mistake while it is still easy to fix rather than at boot time.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-fstab](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-fstab)

### 33. D

*linux.command-line.sed · Linux Fundamentals :: Command Line · depth 3 · recall*

By default sed prints every input line whether it matched or not, which is why `sed -n '/error/p'` — suppressing automatic printing and explicitly printing only matches — is the idiom for "print only matching lines."

- **A.** That selective behaviour requires `-n` combined with an explicit `p` command; without `-n`, every line prints regardless of whether it matched.
- **B.** There is no `-p` command-line flag; `p` is a script command used together with `-n`, and sed prints every line by default without either.
- **C.** sed processes and prints the entire input stream line by line by default; it does not restrict itself to the final line the way `tail` does.
- **D.** Correct. By default sed prints every input line as part of its normal cycle; `-n` suppresses that automatic printing, which is why `sed -n '/error/p'` is the idiom for printing only matching lines.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.sed](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.sed)

### 34. A

*security.security.package-and-download-verification · Security Fundamentals :: Security · depth 3 · command*

A signature proves origin only relative to the key it was verified against. `Good signature` together with a warning that the key is not certified with a trusted signature means the cryptographic match succeeded but the signer's actual identity was never established — that establishment comes from obtaining the publisher's key through an independent, trusted channel, which is the step that most often gets skipped.

- **A.** Correct. The guide is explicit that a good-signature result alongside an uncertified-key warning means identity is unestablished; obtaining the key through an independent channel is the part that actually carries the security.
- **B.** The guide names ignoring exactly this warning as the trap: the signature matching a key you never validated does not establish the signer's identity.
- **C.** The detached form takes the signature file and the signed file together, or a clearsigned document alone — this command already supplies the correct detached pair; the actual gap is key certification, not file form.
- **D.** Running a checksum check does not resolve the actual gap here, which is that the signing key itself was never validated through an independent, trusted channel.

Study it: [04-security/security.md#c-security.security.package-and-download-verification](../study-guide/04-security/security.md#c-security.security.package-and-download-verification)

### 35. D

*pm.project-management.deliverable-and-milestone · IT Project Management Fundamentals :: Project Management · depth 3 · application*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

A deliverable is a tangible output — a document, an image, a migrated fleet. A milestone is a marked point signifying something is now true, typically carrying no duration of its own. 'Signed-off design' and 'base image' are things that exist; 'pilot batch accepted' and 'bulk migration complete' are checkpoints, not artefacts.

- **A.** Work packages are units of the decomposition, not the test for whether an item is a deliverable; 'bulk migration complete' reads as an event, not an artefact.
- **B.** Both of those read as checkpoints — 'accepted' and 'complete' — not as artefacts that were produced, and closure confirms acceptance of deliverables rather than defining what one is.
- **C.** Status-report visibility doesn't distinguish the two; 'pilot batch accepted' and 'bulk migration complete' are events, not things produced.
- **D.** Correct. A design document and a base image are things that exist and were produced — the defining property of a deliverable.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.deliverable-and-milestone](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.deliverable-and-milestone)

### 36. B

*sysadmin.system-administration.inode · System Administration Fundamentals :: System Administration · depth 3 · application*

The inode holds everything the filesystem knows about a file except its name; a directory entry is just a mapping from a name to an inode number. Two names sharing the same inode number, as reported by `ls -i`, are provably the same file rather than two files that merely look alike.

- **A.** A filename is only a directory entry pointing at an inode; two different files in different directories can easily share a name without being the same file.
- **B.** Correct. The inode number is the identity of the file itself; two names sharing one number are definitively the same file, not merely similar copies.
- **C.** Two entirely separate files can easily share identical permission bits by coincidence; that says nothing about whether they are the same underlying file.
- **D.** `findmnt` reports on mounted filesystems, not on individual file identity, and nothing about path similarity establishes that two entries share an inode.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.inode](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.inode)

### 37. B

*cloud.cloud-computing.vendor-lock-in · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · recall*

Lock-in comes from three accumulating sources: depending on provider-specific services and interfaces, the sheer volume of data that would need to move plus the egress charges for moving it, and the operational knowledge and tooling a team has built around one platform. None of these is eliminated by addressing only one of the three.

- **A.** The guide frames lock-in as a trade-off to price, not a defect to eliminate — provider-specific services are often chosen precisely because they genuinely reduce work.
- **B.** Correct. These are the three sources the guide names together as accumulating into the cost of leaving a provider.
- **C.** Portable code reduces only the technical component of lock-in; data gravity, egress cost and accumulated team expertise remain untouched by code portability alone.
- **D.** An SLA is a contractual availability commitment with a remedy for shortfalls; it has no bearing on how costly it would be to move a workload to a different provider.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.vendor-lock-in](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.vendor-lock-in)

### 38. A

*sysadmin.system-administration.package · System Administration Fundamentals :: System Administration · depth 3 · application*

A package is a distributable archive bundling software with its metadata, dependency list and install scripts, resolved by the OS package manager against the system database. Language package managers such as `npm`, `pip` and Maven resolve an application's own libraries instead, a distinct and narrower scope.

- **A.** Correct. The two share a word but differ in scope of ownership: one places distribution-owned software system-wide, the other resolves one project's own dependency manifest.
- **B.** They differ in scope: an OS package is recorded in the system package database and owned by the distribution, while `npm` resolves libraries for one application only and writes them into that project's own `node_modules` directory.
- **C.** Both are fetched from somewhere; the distinguishing factor is scope (system-wide versus one application), not whether a remote source was involved.
- **D.** The difference is more than a removal-command detail: it is what the software is meant to serve and whose responsibility it is. A locally installed `npm` package lands under the project's own directory, not in a system path.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.package](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.package)

### 39. C

*devops.git-concepts.git-diff-and-git-log · DevOps Fundamentals :: Git Concepts · depth 3 · command*

`git log` answers "what happened," walking parents backwards from HEAD so it lists only commits reachable from where you currently are; `--oneline` is shorthand for `--pretty=oneline --abbrev-commit`, giving one abbreviated hash and subject line per commit for quick scanning.

- **A.** `--stat` summarizes changed files in a diff, not commits in the history; it answers "what changed," not "what happened," and shows files, not commits.
- **B.** `git status -s` condenses the working tree and staging area's state into short codes; it says nothing about commit history at all.
- **C.** Correct. It is built for exactly this: a condensed view showing an abbreviated hash and the summary line of each reachable commit, one per line.
- **D.** `git branch -a` lists branch names, local and remote-tracking; it does not print a scrollable per-commit history at all.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.git-diff-and-git-log](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.git-diff-and-git-log)

### 40. B

*linux.command-line.viewing-file-contents · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

`tail -f` holds the file open and follows the same file descriptor, so if the log is rotated away the command keeps watching a file nobody writes to any more. `tail -F` follows the name and reopens after rotation.

- **A.** The line count controls how much history is shown at startup; it has no effect on whether the command notices a file rotation.
- **B.** Correct. `-f` follows the open file descriptor, so after rotation it keeps watching the old, now-unwritten file; `-F` follows the name instead and reopens the new file that takes its place.
- **C.** `head` reads from the beginning of a file and does not follow growth at all, so it cannot be the fix for a stalled follow.
- **D.** `tail -F` specifically exists to solve this exact problem by reopening the file after rotation, so the situation is not unfixable.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.viewing-file-contents](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.viewing-file-contents)

### 41. C

*cloud.networking.virtual-private-cloud · Cloud Computing Fundamentals :: Networking · depth 3 · application*

The three terms collide on sound alone but name different things: a virtual private cloud is an isolation model on shared hardware, a VPN is an encrypted tunnel, and a private cloud is a deployment model on dedicated infrastructure.

- **A.** A subnet is a slice carved out of a network's range; the object being described here — the whole address space and isolation boundary — is the network itself, not a subdivision of it.
- **B.** That describes hybrid connectivity's site-to-site VPN case, an encrypted tunnel joining two networks — not a network in itself.
- **C.** Correct. The description matches the isolation-model definition exactly: an isolated network with a chosen address range on shared infrastructure.
- **D.** This is the exact confusion the term invites: a virtual private cloud is logically isolated tenancy on shared hardware, not a deployment model built on dedicated infrastructure.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.virtual-private-cloud](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.virtual-private-cloud)

### 42. C

*security.security.risk-threat-and-vulnerability · Security Fundamentals :: Security · depth 2 · recall*

Risk is the combination of likelihood and impact, not the severity score alone. A vulnerability in software that is never run and is unreachable from any network has its likelihood driven far down, so the finding is real but not automatically high risk.

- **A.** A raw scanner list is not a work queue until it is risk-ranked; severity alone ignores whether the flaw is reachable or exploitable in context.
- **B.** A vulnerability is a weakness; a threat is a separate circumstance or actor with the potential to exploit it, and presence of one does not establish the other.
- **C.** Correct. A severity score describes the flaw in the abstract; the scenario's lack of reachability and execution suppresses the likelihood term that risk actually depends on.
- **D.** Risk can be reasoned about from likelihood and impact directly, using the deployment context already given, without requiring an exploitation attempt.

Study it: [04-security/security.md#c-security.security.risk-threat-and-vulnerability](../study-guide/04-security/security.md#c-security.security.risk-threat-and-vulnerability)

### 43. B

*sysadmin.system-administration.patch-management · System Administration Fundamentals :: System Administration · depth 3 · application*

The practice includes inventory, advisory tracking, staged testing, a scheduled maintenance window, and a rollback plan — a snapshot, a held previous package version, or on Red Hat systems `dnf history undo`. A process with everything but a way to undo a bad patch is missing exactly that last step.

- **A.** A rollback plan is part of the described discipline; without one, a patch that causes a problem in production has no defined way to be undone.
- **B.** Correct. A complete patch management process needs a way back out, whether a snapshot, a held previous package version, or a history-based undo.
- **C.** A maintenance window is a real part of the practice, but the description specifically omits any mention of undoing a bad patch, which is the rollback step.
- **D.** Automation of routine security updates is a useful accelerant, not a required component of the underlying discipline the process is missing.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.patch-management](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.patch-management)

### 44. B

*linux.linux-operating-system.gnu-and-the-linux-kernel · Linux Fundamentals :: Linux Operating System · depth 3 · recall*

GNU, begun in 1983, supplied the compiler, shell, core utilities, and most of the license framework years before Linux existed in 1991. It lacked only a free kernel, which the Linux project filled — hence GNU/Linux for the combination.

- **A.** GNU had no working free kernel at that point — it had started one, the GNU Hurd, but that kernel did not run reliably until 2001 — so Linux filled a gap rather than replacing a functioning GNU kernel.
- **B.** Correct. The guide states this directly: GNU supplied nearly the whole system years before Linux existed, lacking only a free kernel.
- **C.** Package managers and release policies are distribution-level decisions, not something the GNU Project itself supplied historically.
- **D.** GNU supplied the compiler (GCC), the shell, core utilities, and the GPL years before Linux existed, which is why the pairing became so natural once a kernel was available.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.gnu-and-the-linux-kernel](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.gnu-and-the-linux-kernel)

### 45. A

*pm.software-application-architecture.monolithic-architecture · IT Project Management Fundamentals :: Software Application Architecture · depth 3 · application*

The CNCF glossary and the guide agree the criterion is the deployable unit, not the instance count, the team size, or the internal module structure. Six replicas of one artefact behind a load balancer is exactly the common way to run a monolith at scale.

- **A.** Correct. A monolith replicated across many instances is still a monolith, because the deployment unit, not the instance count, is the criterion.
- **B.** The instances are copies of the same artefact released together, not services released on separate schedules — the trait microservices actually have.
- **C.** Team size is a factor in which shape suits a system, but it doesn't change what 'monolith' means for the one already built — the same trap as reasoning from scale about a tier count.
- **D.** A well-structured modular monolith is not a contradiction in terms, and horizontal replication doesn't touch packaging at all.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.monolithic-architecture](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.monolithic-architecture)

### 46. B

*sysadmin.system-administration.repository · System Administration Fundamentals :: System Administration · depth 3 · application*

Debian-family systems list repositories in `/etc/apt/sources.list` and files under `/etc/apt/sources.list.d/`; Red Hat-family systems use `.repo` files under `/etc/yum.repos.d/`. Knowing the family-specific location is often the fastest first step in diagnosing a repository problem.

- **A.** The `apt` configuration format and location are specific to the Debian family; Red Hat-family systems use `.repo` files instead.
- **B.** Correct. Each family keeps its client-side repository list in a different, family-specific location and format.
- **C.** Repository configuration is separate, client-side configuration describing where packages come from; no `.deb` control field or `.rpm` header carries a repository list, and it is not read back from installed packages at upgrade time.
- **D.** The package database recording what is installed and the client's repository configuration are different things kept in different places.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.repository](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.repository)

### 47. D

*cloud.performance-availability.auto-scaling · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · recall*

A scaling group's minimum and maximum are guardrails the group's size may never cross, while desired capacity is the target the group is actively held at within those bounds — the maximum in particular exists to stop a runaway metric launching capacity without limit.

- **A.** Desired capacity is the target the group is actively held at; minimum and maximum only bound how far policies are allowed to move it.
- **B.** Health status is a separate, continuously monitored property of each instance, not what these two configured numbers record.
- **C.** Recovery objectives describe tolerable data loss and outage duration in disaster recovery, not capacity bounds on a scaling group.
- **D.** Correct. Minimum and maximum are hard bounds; they are not the target the group actively aims for.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.auto-scaling](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.auto-scaling)

### 48. C

*devops.git-concepts.stash · DevOps Fundamentals :: Git Concepts · depth 1 · recall*

`git stash` records the current working-tree and index changes, then reverts the working directory to match HEAD, so the developer can switch context with a clean tree and restore the work later with `git stash pop`. It sits in `refs/stash`, belongs to no branch, is never pushed to a remote, and is invisible to `git log`.

- **A.** A stash is deliberately not a commit on any branch; treating it as one is the exact mistake the concept warns about — "stash it so the team can see it" is always wrong.
- **B.** The point of stashing is to preserve the work, not discard it — it can be restored later with `git stash pop` once the urgent task is finished.
- **C.** Correct. A stash is not history: it sits outside any branch, is invisible to `git log`, and is never transmitted by a push, which is why it cannot be shared with a colleague.
- **D.** `.gitignore` is a pattern file for untracked paths and has nothing to do with where stashed changes are stored.

Study it: [05-devops/git-concepts.md#s-git-concepts-practice](../study-guide/05-devops/git-concepts.md#s-git-concepts-practice)

### 49. B

*sysadmin.system-administration.suid · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Linux deliberately ignores the set-user-ID bit on scripts: the kernel will not grant privilege to an interpreter that has not itself been verified to run safely with elevated rights. The bit can be set with `chmod u+s` and will show as `s` in `ls -l`, but it does nothing for an interpreted file.

- **A.** The script is executable, and `chmod u+s` succeeds on it; the bit is present, it simply has no effect for the kernel to honour on a script.
- **B.** Correct. The kernel refuses to grant privilege to an interpreter reading a script it has not verified, so a script's SUID bit is inert by design.
- **C.** The sticky bit governs deletion within a directory and has no bearing on whether setuid applies to an executable script.
- **D.** SUID and SGID are independent bits; neither is a prerequisite for the other to take effect on an executable.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.suid](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.suid)

### 50. A

*security.sensitive-data.access-control-models · Security Fundamentals :: Sensitive Data · depth 3 · discrimination*

Under DAC, a subject granted access may pass it on at the owner's discretion. Under MAC, the policy is uniformly enforced and a subject granted access is constrained from passing it on regardless of who owns the object. The separating axis is who holds the decision: the owner in the first case, a system-enforced policy the owner cannot override in the second.

- **A.** Correct. DAC places the decision with the object's owner; MAC enforces a policy uniformly, and a subject cannot pass access on regardless of ownership.
- **B.** Nothing in the scenario names a role; the first system is decided at the owner's discretion and the second by a uniformly enforced policy, not by role assignment.
- **C.** A label only tells an enforcement mechanism what to enforce; the refusal here comes from a mandatory access control policy, the one place labels and enforcement genuinely fuse.
- **D.** The scenario describes a policy uniformly enforced across all subjects and objects, which is the defining feature of MAC rather than an attribute evaluation.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.access-control-models](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.access-control-models)

### 51. D

*linux.linux-operating-system.shell · Linux Fundamentals :: Linux Operating System · depth 3 · application*

Some commands, `cd` among them, are shell builtins with no standalone binary on a Linux system. The external `which` only searches PATH, so it correctly reports nothing found for a builtin even though the shell itself runs it directly.

- **A.** The terminal only renders input and output; it does not cache or intercept command execution, so this does not explain the result.
- **B.** No directory ever contains a `cd` binary on a standard system, because `cd` is a builtin rather than an installed executable; PATH is not the issue.
- **C.** `which` is working as designed; it deliberately only searches PATH for external executables and has no visibility into shell builtins by design.
- **D.** Correct. The guide names `cd` specifically as a builtin that `which` cannot see, which is exactly this symptom.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.shell](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.shell)

### 52. A

*sysadmin.system-administration.zombie-and-orphan-processes · System Administration Fundamentals :: System Administration · depth 1 · recall*

A zombie has already exited but its parent has not yet read its exit status, so its process-table entry lingers, shown as `defunct` in `ps`. It consumes no CPU or memory and cannot be killed because it is already dead — the fix is to have the parent reap it, or wait for PID 1 to do so once the parent itself exits.

- **A.** Correct. A zombie is already dead and holds only a process-table entry; there is nothing left alive for a signal to act on.
- **B.** An orphan is still running and has simply been re-parented to PID 1; a `defunct` entry specifically describes a zombie, which has already exited.
- **C.** A daemon that has detached from its terminal is running normally; `defunct` specifically marks a process that has already exited.
- **D.** Uninterruptible sleep is a different, still-alive state waiting on I/O; a `defunct` entry means the process has already exited.

Study it: [02-system-administration/system-administration.md#s-system-administration-processes](../study-guide/02-system-administration/system-administration.md#s-system-administration-processes)

### 53. C

*cloud.performance-availability.load-balancing · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

Sticky sessions pin a client to the backend holding its state, which is the standard workaround for an application that is not stateless. Their presence is the tell: a truly stateless design would let the balancer route any request to any instance.

- **A.** Pinning a user to one instance is the opposite of resilience to that instance's loss; the pinned client's session dies along with its backend.
- **B.** Sticky routing happens on every request from a given user, not only when an instance fails — that continuous behaviour is load balancing, not the failure-triggered switch failover names.
- **C.** Correct. Sticky sessions are the workaround for an application that has not externalised its session state, and their presence is the visible sign of that gap.
- **D.** Instance sizing is unrelated to whether requests can be freely routed among instances; the constraint here is where session state lives, not how big any one instance is.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.load-balancing](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.load-balancing)

### 54. B

*pm.software-application-architecture.transactions-and-acid · IT Project Management Fundamentals :: Software Application Architecture · depth 1 · recall*

Atomicity and durability are different promises: atomicity means partial steps never take effect, durability means a committed transaction is written to permanent storage before completion is reported — exactly what protects both halves of the transfer from a crash immediately afterward.

- **A.** Atomicity means the steps of a transaction all take effect or none do; there is no guarantee that favours the first step over the second.
- **B.** Correct. That is durability specifically: a completed transaction is written to permanent storage before the database reports it done, so a crash right after cannot lose it.
- **C.** That denies durability specifically — the guarantee that a reported-complete transaction has already been made permanent.
- **D.** Consistency means the database moves between valid states, not a claim about speed; nothing here concerns performance.

Study it: [06-it-project-management/software-application-architecture.md#s-software-application-architecture-data](../study-guide/06-it-project-management/software-application-architecture.md#s-software-application-architecture-data)

### 55. C

*sysadmin.troubleshooting.service-will-not-start · System Administration Fundamentals :: Troubleshooting · depth 4 · application*

`systemctl start` succeeding is not the same claim as the unit staying active; `systemctl status` is what reports the load state, active state and sub-state, and the exit code or signal of the most recent run. `ss -tulpn`'s Local Address column becomes the next useful command once the unit's own state is confirmed.

- **A.** journald does not guarantee a corresponding text file, and this does not confirm the unit's current active state either way.
- **B.** Useful once you know the unit died, but it doesn't explain why a start that reported success failed to keep the process running; check the unit's own state first.
- **C.** Correct. A clean return from `start` only means the command was accepted, not that the unit stayed running; `status` shows the current state after that window has passed.
- **D.** A clean return only confirms the command was accepted, not that the daemon stayed up; a service that restart-loops or exits shortly after can look identical to success at that instant.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.service-will-not-start](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.service-will-not-start)

### 56. A

*devops.git-concepts.version-control · DevOps Fundamentals :: Git Concepts · depth 3 · application*

Version control exists precisely to let any earlier state of a tracked file be recovered, with the author and reason attached. Git is one implementation of this practice; recovering one file's content as of a given day is a version-control operation, not a backup restore or a RAID rebuild.

- **A.** Correct. This is the archetypal version-control use case: recovering one earlier revision of one actively edited file, not the whole machine.
- **B.** A scheduled backup restores a point-in-time copy of a system; it exists to survive loss, not to hand back one prior revision of one file among many still-current ones.
- **C.** RAID survives the loss of a disk; it has no concept of an earlier revision and would have faithfully written the mistaken edit too.
- **D.** A ticket records that an approval happened; it does not itself hold the file's earlier content.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.version-control](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.version-control)

### 57. A

*security.sensitive-data.encryption-key-management · Security Fundamentals :: Sensitive Data · depth 2 · recall*

SP 800-57 Part 1 defines a cryptoperiod as the time span during which a specific key is authorised for use, and bounds it deliberately: a shorter cryptoperiod limits both the material available for cryptanalysis and the exposure if that single key is compromised. It is a time-based limit on one key's authorised lifetime, distinct from a use count, from the broader practice of secrets rotation, and from the separate question of how media is sanitised.

- **A.** Correct. SP 800-57 defines the cryptoperiod exactly this way and gives exactly this reason for bounding it.
- **B.** A cryptoperiod is a time span, not a use count, so this substitutes a different, unrelated limiting factor.
- **C.** Secrets management is the broader operational discipline covering every credential; a cryptoperiod is specific to a single cryptographic key's authorised lifetime.
- **D.** Those categories describe how media is sanitised at disposal, a different concern from how long a key remains authorised for active use.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.encryption-key-management](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.encryption-key-management)

### 58. A

*linux.linux-operating-system.x11-and-wayland · Linux Fundamentals :: Linux Operating System · depth 1 · recall*

X11 and Wayland are the display server protocols underlying Linux graphics, with Wayland being the newer replacement for the older X11. This is recognition-level: know which is newer, not which distribution defaults to which.

- **A.** Correct. This is the recognition-level fact the concept tests: know that Wayland is newer, not the protocol internals of either.
- **B.** Recent default adoption by a distribution does not change which protocol is older; X11 predates Wayland regardless of current default choices.
- **C.** They were not released in the same year; X11 is the long-established older protocol, and Wayland was developed later specifically to replace it.
- **D.** X11 and Wayland are distinct display server protocols, not two names for one thing; the concept exists specifically to test that they are different and one is newer.

Study it: [01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-interfaces](../study-guide/01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-interfaces)

### 59. B

*cloud.performance-availability.sla-slo-and-sli · Cloud Computing Fundamentals :: Performance/Availability · depth 1 · recall*

The SLI is the measurement, the SLO is the internal target set on that measurement, and the SLA is the contract with users that attaches consequences to meeting or missing it. Holding the SLO tighter than the SLA, as here, is the standard safety-margin practice.

- **A.** The SLA is specifically the external contract with users and their remedy; the tighter, internally-held number here is the SLO, held deliberately stricter as a safety margin.
- **B.** Correct. An SLO is a target value on a measurement; only the SLA, the separate contract with users, attaches an explicit remedy to a missed number.
- **C.** 99.95% here is described as a target set on the measurement, not the measurement itself; the SLI is the fraction of successful requests being measured against it.
- **D.** Holding an internal target tighter than the externally published figure is standard practice specifically so there is room to act before a contractual consequence is triggered.

Study it: [03-cloud-computing/performance-availability.md#s-performance-availability-performance](../study-guide/03-cloud-computing/performance-availability.md#s-performance-availability-performance)

### 60. D

*sysadmin.troubleshooting.using-documentation · System Administration Fundamentals :: Troubleshooting · depth 3 · discrimination*

`apropos` and `man -k` both search the whatis database of one-line descriptions for a keyword, which is exactly what's needed when the command's name is unknown. `man` and `info` are direct-lookup tools: both require the name in hand already, which is the one thing missing in this scenario.

- **A.** Given a bare keyword, `man` looks for a page of that name and fails; searching page bodies is a separate mode, `man -K`, and not what plain `man` does.
- **B.** Even where a Texinfo manual is fuller than the man page, `info` is still a direct lookup that needs the manual’s name — the one thing missing in this scenario.
- **C.** That is trial and error against the shell, not a documentation search, and it never actually identifies the correct command name.
- **D.** Correct. Both search the short description database for a matching word; `man -k` is approximately equivalent to `apropos` in what it searches.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.using-documentation](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.using-documentation)

