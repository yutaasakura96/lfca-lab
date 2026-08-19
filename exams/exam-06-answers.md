<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 06 — answers

### 1. D

*sysadmin.best-practices.change-management · System Administration Fundamentals :: Best Practices · depth 3 · application*

The control that defines change management is independent approval: the requestor and the approver being different people. Scheduling and recording are separate concerns, and neither substitutes for a second, independent reviewer of the proposed change.

- **A.** A window governs when disruptive work may occur; being inside one authorises nothing about whether the change was permitted at all.
- **B.** Recording what changed is a separate concern from whether the change was authorised to happen.
- **C.** That is the exact self-approval the control forbids, regardless of how much authority the administrator holds.
- **D.** Correct. Configuration change control requires a change to be vetted by an authorised individual independent of whoever proposed it.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.change-management](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.change-management)

### 2. B

*cloud.best-practices.immutable-infrastructure · Cloud Computing Fundamentals :: Best Practices · depth 3 · application*

Because the running instance is never modified, rollback is redeploying the previous artifact and replacing instances again, using the same blue/green or canary pattern as any other release — not reversing a patch, which has no meaning once nothing is ever patched in place.

- **A.** Editing instances in place is exactly what immutable infrastructure replaces; a rollback here is a new deployment, not an in-place reversal.
- **B.** Correct. Because instances are never modified after creation, the only lever available is deploying a different artifact and replacing instances with it.
- **C.** A backup restores data; the rollback described here is about which application version is running, which is a separate artifact.
- **D.** That reverts the definition of the environment's shape; it is not what rolls back which application artifact the instances are running.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.immutable-infrastructure](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.immutable-infrastructure)

### 3. C

*linux.command-line.absolute-vs-relative-paths · Linux Fundamentals :: Command Line · depth 3 · application*

A relative path is resolved from the calling process's current working directory. Cron, a systemd unit, or a container entrypoint typically start with a different working directory than an interactive shell, so a relative path that works by hand can silently name the wrong file, or none, elsewhere.

- **A.** Cron does run a minimal environment, but the scenario describes a path lookup failure, not a missing variable.
- **B.** Nothing in the scenario indicates a name change; the same script works by hand and fails only from cron, which points at the environment, not the filename.
- **C.** Correct. A relative path resolves from the current working directory, which is a per-process attribute; cron does not inherit the interactive shell's directory.
- **D.** Every process has a current working directory, and the shell cron starts sets `PWD` for itself; a lookup does not fail 'outright' for want of that variable, and the resulting error would differ from the one described.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.absolute-vs-relative-paths](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.absolute-vs-relative-paths)

### 4. D

*security.compliance.audit · Security Fundamentals :: Compliance · depth 3 · discrimination*

An audit can be internal, the organisation examining itself, or performed by an independent external assessor. The two are not interchangeable claims, and a clean internal review does not license a claim of independent assurance.

- **A.** Being un-audited by an independent party is not the same as non-compliant, but a clean internal review is also not the same as an independent audit result.
- **B.** The review is the examination; whether the controls it examined already had evidence produced is a separate, prior question the review does not settle.
- **C.** ISO states that certification is performed by external certification bodies, so an internal review, however clean, is not one.
- **D.** Correct. NIST SP 800-53 Rev. 5 treats assessor independence as a separate property an organisation has to require, which an in-house review does not supply.

Study it: [04-security/compliance.md#c-security.compliance.audit](../study-guide/04-security/compliance.md#c-security.compliance.audit)

### 5. B

*devops.containers.cncf · DevOps Fundamentals :: Containers · depth 2 · application*

This is the same shape as the Linux Foundation's relationship to the Linux kernel, and a question that names one organisation and one project is usually probing whether the candidate collapses the two roles into one — naming hosting and governing as distinct answers it correctly.

- **A.** The CNCF charter states that included projects continue under their existing technical governance structure, so hosting a project does not carry technical direction with it.
- **B.** Correct. The CNCF charter says projects included in the CNCF continue to run through their existing technical governance structure, and the Kubernetes Steering Committee charter names that committee the governing body of the project, so the two roles are held by two different bodies and are stated separately.
- **C.** The hosting relationship is real and examinable — funding, infrastructure, and marketing support genuinely come from the host — so denying it entirely is also wrong.
- **D.** The relationship can be stated correctly without naming an individual: the CNCF hosts and funds, while the project's own elected Steering Committee governs.

Study it: [05-devops/containers.md#c-devops.containers.cncf](../study-guide/05-devops/containers.md#c-devops.containers.cncf)

### 6. C

*pm.functional-analysis.gap-analysis · IT Project Management Fundamentals :: Functional Analysis · depth 2 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

A gap analysis is a structured comparison whose output is the set of differences and the work needed to close them. What it does not deliver is a judgement on achievability, cost or worth — that is a feasibility question, kept deliberately separate.

- **A.** That is exactly what the gap analysis already produced — the six listed differences are its output, not something missing from it.
- **B.** Defining the work that closes the difference is part of the gap analysis itself, not something withheld from it; the six differences and the actions they imply are both its output.
- **C.** Correct. Gap analysis names the distance between two states; it delivers no judgement about whether closing that distance is achievable, affordable or worth doing.
- **D.** The comparison is done dimension by dimension to state what is missing, not to rank it; ranking and achievability are both judgements the technique deliberately withholds.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.gap-analysis](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.gap-analysis)

### 7. B

*sysadmin.best-practices.security-baselines · System Administration Fundamentals :: Best Practices · depth 2 · recall*

A security baseline is a defined minimum configuration, formally reviewed and agreed, applied to every system of a given type. It removes security decisions from individual discretion, which is exactly what two divergent, unreviewed configurations of the same role indicates is missing.

- **A.** Standardization is the general uniformity goal; the specific control missing here is a reviewed, approved security floor.
- **B.** Correct. Without a baseline, the question "is this host secure" is answerable only by opinion; a baseline makes it answerable by comparison.
- **C.** A tool enforces whatever state is declared; it does not by itself supply the reviewed security minimum that state should contain.
- **D.** Compliance is measured against the defined floor, not against how a system compares to a less-secure neighbour.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.security-baselines](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.security-baselines)

### 8. B

*cloud.best-practices.least-privilege-for-cloud-identities · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

The identity that gets over-granted in practice is usually not a person: a service role given administrator permissions during a debugging session and never narrowed is the standard path from one compromised web application to the whole account.

- **A.** A compromised application inherits its role's permissions automatically; no separate human console session is required.
- **B.** Correct. A service role over-granted at setup and left unreviewed is the standard route from a single compromise to full account control.
- **C.** IAM enforces policy; narrowing an over-granted role is a deliberate action a team must take, not an automatic IAM behaviour.
- **D.** The scenario describes an over-granted role, not a hardcoded key; those are two different failure modes.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.least-privilege-for-cloud-identities](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.least-privilege-for-cloud-identities)

### 9. B

*sysadmin.disaster-recovery.disaster-recovery-plan · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

NIST SP 800-34 Rev. 1 makes testing, training and exercises a step of the contingency planning process in its own right: testing validates recovery capabilities and exercising the plan identifies planning gaps. The glossary definition of a disaster recovery plan does not itself use the word tested, so what evidences a working plan is the exercise record rather than the definition. A plan nobody has rehearsed is a proposal: it has never met the conditions it was written for, and the gaps it contains are still unknown.

- **A.** Acknowledgement shows awareness but never shows the procedure works.
- **B.** Correct. NIST SP 800-34 Rev. 1 has testing validate recovery capabilities and exercises identify planning gaps, so the exercise record is the evidence.
- **C.** Successful writes evidence neither restoration nor the plan around it.
- **D.** Documentation of the destination says nothing about whether the procedure was exercised.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.disaster-recovery-plan](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.disaster-recovery-plan)

### 10. A

*linux.command-line.command-exit-status · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

`grep` returns 1 when it simply found no matching line and 2 when it hit a real error, so treating grep's 1 as a failure of the search misreads an ordinary, expected outcome.

- **A.** Correct. Non-zero does not always mean failure: `grep`'s exit status of 1 is an ordinary, expected outcome meaning the pattern was not found, distinct from status 2, which signals an actual error.
- **B.** Several tools, `grep` among them, define non-zero values that are not errors; treating every non-zero status as failure misreads exactly this case.
- **C.** Status 1 from `grep` means no matching line was found, regardless of whether that is because the file is empty or simply lacks the pattern; file emptiness is not a separate special case.
- **D.** `grep` distinguishes the two: 1 means no match, 2 means an actual error occurred, so they are not the same outcome collapsed into one meaning.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-exit-status](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-exit-status)

### 11. D

*security.security.brute-force-and-credential-stuffing · Security Fundamentals :: Security · depth 3 · application*

Credential stuffing tests username-password pairs already known to be valid from another breach, making roughly one or two attempts per account, so it never approaches a lockout threshold and also creates a denial-of-service vector against real users if lockout is relied on. MFA is the defence that covers brute force, stuffing, and spraying alike, because it removes the sufficiency of a correct password alone.

- **A.** The guide states lockout is the reflexive but wrong answer for stuffing and spraying specifically because those attacks stay under any lockout threshold by design.
- **B.** Strong password policies do nothing against credential stuffing when the reused password was already strong; checking candidates against known-breached lists is what addresses reuse.
- **C.** Credential stuffing replays credentials the attacker already possesses and requires no action from the victim, unlike phishing, which needs the user to hand over a credential.
- **D.** Correct. Credential stuffing replays pairs already known to be valid elsewhere, staying well under any per-account threshold, which is exactly why MFA — not lockout — is the control that generalises across all three related attacks.

Study it: [04-security/security.md#c-security.security.brute-force-and-credential-stuffing](../study-guide/04-security/security.md#c-security.security.brute-force-and-credential-stuffing)

### 12. C

*sysadmin.networking.arp · System Administration Fundamentals :: Networking · depth 3 · application*

FAILED in `ip neigh` means an ARP request for that address went unanswered on the local segment, which is a strong, specific localisation — it says nothing was reached at all, distinct from a REJECT or a working entry showing the resolved MAC. The deprecated net-tools equivalent, `arp -n`, reports the same cache numerically where installed.

- **A.** ARP never crosses a router and has nothing to say about routing beyond the local segment; FAILED specifically reports that no answer arrived to a local ARP request.
- **B.** ARP can only report that no reply arrived; it cannot distinguish a powered-off host from one on a different segment, a firewall drop, or any other cause of silence.
- **C.** Correct. A FAILED state means the address did not answer an ARP request on this segment, which localises the problem to that specific host rather than to routing or a wider network issue.
- **D.** `ip neigh` reports the state of address-to-MAC resolution only; it has no relationship to DNS, which resolves names rather than local hardware addresses.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.arp](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.arp)

### 13. C

*devops.containers.container-orchestration · DevOps Fundamentals :: Containers · depth 3 · application*

Nodes are watched the same way individual instances are: a node that stops reporting has its workloads recreated elsewhere instead of left stranded, which is exactly the self-healing property a single-host tool cannot offer.

- **A.** Nodes are health-checked the same way workloads are; a node that stops reporting triggers rescheduling of its workloads onto healthy nodes.
- **B.** Reconciliation acts automatically once a node is detected as unhealthy; it does not wait on a manual confirmation step before rescheduling.
- **C.** Correct. Continuous reconciliation applies to node health too, not only to individual workload health, so a lost node's work is moved rather than abandoned.
- **D.** A lost node does not change what was declared; the orchestrator still works to satisfy the same declared count by scheduling replacements elsewhere.

Study it: [05-devops/containers.md#c-devops.containers.container-orchestration](../study-guide/05-devops/containers.md#c-devops.containers.container-orchestration)

### 14. C

*cloud.budgeting.resource-tagging · Cloud Computing Fundamentals :: Budgeting · depth 2 · recall*

Tagging is the enabling control beneath every other practice in this section: without it a bill is a list of service totals with no owner, and no per-team budget, chargeback, showback or orphan hunt is possible, because all four are attribution questions before they are cost questions.

- **A.** A budget can be scoped to an account or service with no tag involved at all; tagging refines scope, it does not gate whether a budget can be created.
- **B.** Monitoring dashboards display whatever inventory exists, tagged or not; a missing tag makes attribution harder, not the resource invisible to monitoring.
- **C.** Correct. Without a tag, a bill is a list of service totals with no owner, and no per-team budget, chargeback, showback or orphan hunt is possible, because all four depend on knowing whose resource it is.
- **D.** Tags are metadata for attribution and carry no effect on the rate a resource is billed at; the cost impact of missing tags is entirely indirect.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.resource-tagging](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.resource-tagging)

### 15. B

*linux.command-line.dot-dotdot-and-tilde · Linux Fundamentals :: Command Line · depth 3 · application*

Tilde expansion happens only when the tilde is unquoted and starts a word. `'~'` and `"~"` are both literal, so `cd '~'` tries to enter a directory actually named `~` rather than the account's home directory.

- **A.** bash(1) documents unquoted `cd ~` as a normal way to reach the home directory, and `cd` accepts relative pathnames as well; the failure here is caused specifically by the quoting.
- **B.** Correct. Tilde expansion happens only when the tilde is unquoted and starts a word; single quotes make it a literal character like any other.
- **C.** An unset `$HOME` would also break the unquoted form; the scenario's failure is produced by the quotes, which suppress expansion regardless of `$HOME`.
- **D.** Nothing in the scenario indicates a missing home directory; the described symptom is the classic result of quoting a tilde.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.dot-dotdot-and-tilde](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.dot-dotdot-and-tilde)

### 16. D

*pm.open-source-software-and-licensing.apache-license-2-0 · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · recall*

Section 4 conditions redistribution on carrying the licence text, marking modified files, retaining existing notices, and propagating an existing NOTICE file's attributions — obligations layered on top of, not replacing, the basic notice-retention condition MIT shares.

- **A.** Apache-2.0 section 4 adds modification-notice and NOTICE-propagation requirements that MIT's one-sentence condition does not have.
- **B.** A CLA governs contributing changes back to a project, not redistributing a downstream product built from its code.
- **C.** Apache-2.0 is not a copyleft licence at any point; none of section 4's conditions reach the licence of the derivative work as a whole.
- **D.** Correct. Section 4(b) requires the change notices and section 4(d) requires propagating an existing NOTICE file's contents.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.apache-license-2-0](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.apache-license-2-0)

### 17. D

*sysadmin.networking.etc-resolv-conf · System Administration Fundamentals :: Networking · depth 3 · recall*

`nameserver` lines list the resolvers to query in order, but up to MAXNS (currently 3) are used and further lines are ignored, so listing more than three nameservers does not add resilience — entries beyond the cap are simply never consulted.

- **A.** The resolver does not race every listed nameserver in parallel; it uses up to MAXNS (3) in order, and lines beyond that cap are ignored entirely.
- **B.** Up to three nameserver lines are used, not just one; the resolver falls back to subsequent listed servers, up to the MAXNS limit, if the first is unavailable.
- **C.** Only up to MAXNS (3) nameserver lines are used at all; the remaining two beyond that cap are never consulted, round-robin or otherwise.
- **D.** Correct. MAXNS caps the number of nameserver lines the resolver will use at 3; entries beyond that limit are present in the file but never consulted.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.etc-resolv-conf](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.etc-resolv-conf)

### 18. B

*sysadmin.networking.load-balancer · System Administration Fundamentals :: Networking · depth 3 · application*

Where an application keeps per-user state in memory, session affinity, or "sticky sessions," pins a client to one backend, at the cost of even distribution — without it, a scheduling algorithm distributing requests evenly across backends will eventually route a returning user to a backend that never saw their session.

- **A.** Backends do not automatically share in-memory state with each other by default; a request landing on the wrong backend genuinely loses access to session state kept only in memory there.
- **B.** Correct. Where an application keeps per-user state in memory, session affinity is exactly the mechanism designed to trade perfectly even load distribution for consistent routing back to the backend holding that state.
- **C.** Health checking removes failing backends from rotation for availability reasons; disabling it does not address a session-state mismatch, and it would remove an unrelated safety mechanism.
- **D.** Neither layer 4 nor layer 7 balancing automatically pins a client to one backend by default; session affinity is a distinct, explicitly configured feature independent of which layer the balancer operates at.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.load-balancer](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.load-balancer)

### 19. A

*security.security.defense-in-depth · Security Fundamentals :: Security · depth 3 · application*

Defense in depth is layering independent controls so no single failure exposes the asset. A host firewall enforcing at the machine itself fails for reasons distinct from a network-edge misconfiguration, which is exactly the independence the practice requires — unlike two firewalls duplicating the same rule set at the same boundary.

- **A.** Correct. SP 800-53r5 warns that replicated protection mechanisms give only illusory additional protection when the mechanisms are similar, because an adversary can attack them in series; independence of failure is what makes a second control a second layer.
- **B.** Identical mechanisms are precisely what makes the extra protection illusory — SP 800-53r5 states that if the mechanisms are similar the adversary can simply attack them in series.
- **C.** Layers are counted by independent failure modes, not by machines; two hosts enforcing the same flawed rule fall together.
- **D.** Layering addresses resistance to compromise rather than uptime, and a firewall can serve confidentiality, integrity or availability depending on what it filters.

Study it: [04-security/security.md#c-security.security.defense-in-depth](../study-guide/04-security/security.md#c-security.security.defense-in-depth)

### 20. C

*cloud.budgeting.rightsizing · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

Rightsizing matches provisioned capacity to measured demand for a resource that is genuinely wanted, which distinguishes it from deletion, for a resource with no purpose left, and from autoscaling, which changes count rather than size.

- **A.** Deletion is for a resource with no purpose left; this one is actively serving production queries, so deleting it would remove something still in use.
- **B.** Autoscaling changes how many units run in response to live load; it does not resize a single provisioned unit's capacity, which is a deliberate periodic decision.
- **C.** Correct. The resource still serves a genuine purpose; rightsizing matches provisioned capacity to measured demand without removing what is still needed.
- **D.** Detaching and reattaching a volume changes nothing about billing, which is charged for provisioned capacity regardless of attachment state.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.rightsizing](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.rightsizing)

### 21. B

*linux.command-line.getting-help · Linux Fundamentals :: Command Line · depth 3 · application*

Manual sections are fixed, and section 5 covers file formats and configuration files while section 1 covers user commands. `man 5 crontab` asks for the file-format page explicitly, which is the one with the five time fields.

- **A.** The default section search order reaches section 1 before section 5, so this opens the command page, not the file-format page.
- **B.** Correct. Section 5 documents file formats and configuration files, and a leading section number selects it directly.
- **C.** That searches the short descriptions in the manual index and returns a list of matches; it does not open the file-format page directly.
- **D.** Texinfo manuals are not divided into man's numbered sections, so this does not target the file-format documentation specifically.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.getting-help](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.getting-help)

### 22. C

*devops.containers.deployment · DevOps Fundamentals :: Containers · depth 3 · application*

Because the controller is continuously comparing actual against desired, deleting one of its pods does not reduce the count — the replica count is now unsatisfied, so a replacement pod appears almost immediately.

- **A.** Manual pod deletion is not interpreted as a scaling instruction; the declared count on the Deployment is untouched by it.
- **B.** Reconciliation runs continuously, not only at deploy time; a shortfall against the declared count is corrected immediately, independent of any new rollout.
- **C.** Correct. Deleting a pod does not change what was declared; the Deployment's controller notices the shortfall and restores it without anyone asking again.
- **D.** A Service selects existing pods and creates nothing; maintaining replica count is the Deployment's job through the ReplicaSet it owns.

Study it: [05-devops/containers.md#c-devops.containers.deployment](../study-guide/05-devops/containers.md#c-devops.containers.deployment)

### 23. B

*sysadmin.networking.proxy · System Administration Fundamentals :: Networking · depth 3 · application*

A reverse proxy is reached because DNS resolves the public name to it, and it forwards to a backend on a private address; because a proxy terminates and re-issues the connection, the backend sees the proxy as its client unless a forwarded header preserves the original address.

- **A.** A working reverse proxy does not automatically preserve the original client address in logs; this requires a specific forwarded header to be added, not a fix on the backend's interface.
- **B.** Correct. This is a documented trap: because a proxy terminates and re-issues the connection, the backend logs show the proxy's address, which quietly breaks IP-based access control written before the proxy was introduced, unless a forwarded header preserves the original client address.
- **C.** The address-masking behaviour follows from being any kind of intermediary that terminates and re-issues the connection, a proxy trait, not specifically from also load-balancing across backends.
- **D.** Switching proxy direction does not solve this; a forwarded header, not a change from reverse to forward proxy, is the standard fix that recovers the original client address for the backend.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.proxy](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.proxy)

### 24. A

*cloud.cloud-computing.hypervisor · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

VMware Workstation runs as an application atop a conventional operating system, the definition of a type 2, hosted hypervisor — and it is the equivalent product to VMware Fusion, just on Windows and Linux rather than macOS, the same class of software chosen for coexisting with a normal desktop rather than for production datacentre use.

- **A.** Correct. Both coexist with a normal desktop OS as an application rather than replacing it, which is exactly what makes each a type 2, hosted hypervisor.
- **B.** Type 2 is the developer-workstation kind, chosen because it coexists with a normal desktop — it is not 'the old kind' or 'the insecure kind', and hosted hypervisors are still shipped and supported for current desktops.
- **C.** Bare-metal specifically means no intervening host OS; here Workstation runs as an application on top of Windows, which is the defining feature of type 2, not type 1.
- **D.** Fusion is the macOS counterpart of Workstation and runs as an application on the installed host operating system, which is what makes a hypervisor type 2; it does not replace the host OS at boot, and the mechanism differs only in which host OS each product targets.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hypervisor](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hypervisor)

### 25. C

*pm.open-source-software-and-licensing.governance-and-foundations · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 1 · recall*

Neutral non-profits such as the Linux Foundation and Apache Software Foundation hold a project's assets, trademarks, and infrastructure so no single vendor controls it, while deliberately leaving technical direction to the project's own maintainers.

- **A.** Foundations do not staff their projects' development: the ASF states that all participants in its projects are volunteers and that nobody is paid by the foundation to do their job.
- **B.** Committer status is earned on merit within each project over time; a foundation does not grant it automatically after one contribution.
- **C.** Correct. A foundation provides legal shelter and governance structure so no single vendor controls a project, without dictating what the project builds.
- **D.** A foundation holds assets and sets governance rules; the technical roadmap remains a decision for the project's own maintainers, not the board.

Study it: [06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-community](../study-guide/06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-community)

### 26. B

*sysadmin.networking.ttl-and-dns-caching · System Administration Fundamentals :: Networking · depth 3 · application*

A recursive resolver caches a record and, on each subsequent answer, returns it with the remaining TTL, counting down — repeated queries against a caching resolver showing a falling number are expected, while a query sent to the authoritative server shows the full configured value every time.

- **A.** An authoritative server returns the full configured TTL every time, not a falling countdown; the falling pattern specifically indicates the queries hit a caching resolver, not the authoritative server.
- **B.** Correct. A recursive resolver caches a record and returns it with the remaining TTL on each subsequent answer, so watching the number count down across repeated queries is exactly the expected behaviour.
- **C.** SOA parameters govern negative caching for answers that do not exist; a falling TTL on a normal positive answer from a caching resolver is unrelated to SOA configuration at all.
- **D.** A falling TTL specifically indicates a caching resolver rather than the authoritative server; the authoritative server would show the full configured value on every query instead.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ttl-and-dns-caching](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ttl-and-dns-caching)

### 27. B

*security.security.full-disk-encryption · Security Fundamentals :: Security · depth 2 · recall*

Full disk encryption survives the physical loss of powered-off, locked hardware — a stolen laptop yields nothing without the passphrase. It does not extend to a machine that is running with the volume already unlocked, where files remain readable to any process with the right permissions.

- **A.** Once unlocked, the volume's files are readable as normal to permitted processes; encryption at rest specifically addresses the powered-off, locked case, not a running unlocked one.
- **B.** Correct. Full disk encryption is the control that survives physical loss of powered-off, locked media; it does not extend to a running system where the volume is already unlocked.
- **C.** Full disk encryption is a storage control; it has no bearing on data that already crossed the network, which is encryption in transit's domain.
- **D.** The header wraps the volume key that protects the actual data; both matter, but the encryption's purpose is protecting the data volume, not merely the header in isolation.

Study it: [04-security/security.md#c-security.security.full-disk-encryption](../study-guide/04-security/security.md#c-security.security.full-disk-encryption)

### 28. C

*linux.command-line.port-ranges · Linux Fundamentals :: Command Line · depth 3 · discrimination*

RFC 6335 puts dynamic ports at 49152-65535, but the kernel's `net.ipv4.ip_local_port_range` defaults to 32768-60999, so a real Linux client's source port usually falls in the User (registered) Ports range instead of the RFC's Dynamic Ports range.

- **A.** Linux's actual default range diverges from the RFC; this is precisely the specification-versus-implementation gap the topic tests.
- **B.** Linux's ephemeral source-port range sits well above 1023, in the registered-port territory (32768-60999 by default), not inside the privileged well-known range.
- **C.** Correct. The kernel's `net.ipv4.ip_local_port_range` defaults to 32768 through 60999, not the RFC's 49152-65535, so a real Linux client's source port usually falls inside the registered range rather than the dynamic one.
- **D.** The kernel documentation defines ip_local_port_range as "the local port range that is used by TCP and UDP to choose the local port" - one setting covering both, so it is not protocol-specific in the way this option claims.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.port-ranges](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.port-ranges)

### 29. A

*sysadmin.system-administration.cron · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Cron simply skips a scheduled time that passes while the machine is powered off — it is not a fault. `anacron` exists to compensate for that on machines that are not on continuously, and a systemd timer with `Persistent=true` is the equivalent modern alternative. `crontab -l` would have confirmed the job was still scheduled all along.

- **A.** Correct. Cron has no memory of a missed schedule window; catching up on a run missed while powered off is a separate mechanism cron does not provide by itself.
- **B.** That catch-up behaviour is exactly what plain cron lacks and what `anacron` was built to add — expecting it from cron itself is the mistake here.
- **C.** Nothing in the scenario suggests the crontab was removed; a missed run on a machine that was off is the far more direct and standard explanation.
- **D.** A timer without `Persistent=true` would show exactly the same behaviour as cron here; the catch-up property requires that setting specifically.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.cron](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.cron)

### 30. D

*cloud.cloud-computing.paas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

PaaS and a managed service both take work off the customer's plate, but the line between them is whose code is running: PaaS runs an application the consumer wrote, while a managed service runs a standard component the provider maintains. A team connecting to — rather than deploying onto — a managed database is using a managed service alongside their PaaS application, not extending PaaS to cover the database.

- **A.** Dependency is not deployment; the guide is explicit that a managed database you connect to is a managed service precisely because you never deploy an application onto it.
- **B.** Shared underlying infrastructure does not determine the service model; what matters is whether the consumer deploys application code onto the component.
- **C.** Billing separation is not the deciding factor and is not even reliably true across providers; the deciding factor is whether an application artifact is deployed onto the component.
- **D.** Correct. PaaS is defined by deploying consumer-created application code; a managed database the team merely connects to has no such deployment, which is exactly the managed-services distinction.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.paas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.paas)

### 31. C

*devops.containers.registry · DevOps Fundamentals :: Containers · depth 3 · command*

Pushing to a private registry requires the image to be tagged with that registry's host name first. Without it, `docker push` and `docker pull` both resolve against Docker Hub, the CLI's default when no host is given.

- **A.** `docker push` takes no such flag; its destination comes entirely from how the image itself is named and tagged.
- **B.** Pulling and pushing are independent operations, each resolved from the reference given at the time, not from prior commands run in the session.
- **C.** Correct. A push's destination is derived entirely from the image's own name, and an unqualified name resolves to Docker Hub.
- **D.** The push genuinely went to Docker Hub rather than the private registry; this is not a display lag on the private registry's side.

Study it: [05-devops/containers.md#c-devops.containers.registry](../study-guide/05-devops/containers.md#c-devops.containers.registry)

### 32. A

*sysadmin.system-administration.etc-shadow · System Administration Fundamentals :: System Administration · depth 3 · application*

`/etc/shadow` records the date of last password change as days since the epoch, and setting that field to `0` is the documented way to force a change at next login; `chage -d 0` sets it. Locking the account or setting an expiry date achieves a different outcome.

- **A.** Correct. A value of `0` in the last-change field means "must change at next login," which is exactly the stated goal.
- **B.** An expiry date disables the account outright once reached, rather than merely prompting for a new password.
- **C.** The login shell controls what runs at login, not whether a password change is required — and it is the wrong file for ageing data.
- **D.** Locking prefixes the stored hash with `!` so no password matches at all — it prevents login rather than prompting for a new password.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-shadow](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-shadow)

### 33. D

*linux.command-line.shell-variables-and-export · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`set` with no arguments lists all shell variables and functions; `env` (and `printenv`) lists only exported ones. A variable visible in `set` but absent from `env` is exactly a shell variable that was never exported.

- **A.** This reverses the roles: `set` is the broader listing including unexported variables and functions, while `env` (and `printenv`) shows only the exported subset.
- **B.** The two commands are expected to differ whenever unexported shell variables exist; that difference is normal, not a sign of corruption.
- **C.** `env` reports the current process's own environment, not other users' sessions; it is scoped to the invoking shell just as `set` is.
- **D.** Correct. A variable visible in `set` but absent from `env` is exactly a shell variable that was assigned but never exported, so it has never left the current shell.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.shell-variables-and-export](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.shell-variables-and-export)

### 34. C

*security.security.public-key-authentication · Security Fundamentals :: Security · depth 3 · command*

`ssh-keygen` generates the key pair; `ssh-copy-id` installs the *public* half into the remote account's `authorized_keys`, and needs a working login — typically the still-enabled password — the first time it runs. Copying the private key instead of the `.pub` file is the classic and dangerous mix-up.

- **A.** `ssh-add` loads a private key into the agent on the local machine and installs nothing on the remote host, so the server still holds no copy of the public key.
- **B.** `ssh-keygen` generates a new key pair; it does not install an existing public key anywhere, and running it again would just create an unrelated pair on the server.
- **C.** Correct. `ssh-copy-id` appends the named public key to the remote account's `authorized_keys`, and it needs a working login such as the still-enabled password the first time.
- **D.** `gpg --verify` checks a signature over a file against a signing key; it has no role in installing an SSH public key into a remote account.

Study it: [04-security/security.md#c-security.security.public-key-authentication](../study-guide/04-security/security.md#c-security.security.public-key-authentication)

### 35. A

*pm.open-source-software-and-licensing.proprietary-software · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · discrimination*

Source visibility satisfies nothing on its own. A no-competing-use clause restricts a field of endeavour and removes the licence from open source status, leaving a source-available product that is proprietary in the licensing sense that matters.

- **A.** Correct. A source-available licence that restricts a field of endeavour fails the OSD and is proprietary software with published code.
- **B.** Readability is necessary but not sufficient; the OSD also requires derivative-work rights and no field-of-endeavour restriction.
- **C.** Price plays no role in this classification; the disqualifying feature is the field-of-endeavour restriction, not any fee.
- **D.** Compatibility with other components is a separate question from whether this licence alone meets the Open Source Definition.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.proprietary-software](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.proprietary-software)

### 36. C

*sysadmin.system-administration.etc · System Administration Fundamentals :: System Administration · depth 2 · recall*

`/etc` holds host-specific configuration, and by FHS convention its contents are editable text files — no binaries belong there. Nearly every configuration file this competency names, from `/etc/passwd` to `/etc/systemd/system`, lives under this directory precisely because of that classification.

- **A.** Log files belong under `/var/log`, since they are variable data that grows at runtime — a different classification from `/etc`'s static configuration.
- **B.** `/var` is unshareable and variable, holding logs and runtime state, not the static configuration that `/etc` holds.
- **C.** Correct. The classification "unshareable and static" is what makes `/etc` the natural place for configuration text files rather than executables.
- **D.** FHS 3.0 still defines `/etc` as host-specific system configuration and it is exactly configuration files that belong there; `/usr/local/etc` is defined only as host-specific configuration for locally installed binaries, not as a replacement for `/etc`.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc)

### 37. D

*cloud.networking.cloud-dns · Cloud Computing Fundamentals :: Networking · depth 2 · recall*

AWS documents DNS failover as the mechanism by which traffic is routed away from an unhealthy resource to a healthy one when several resources perform the same function.

- **A.** Layer 7 routing decides among backends based on the request's content; it is a load balancer capability, distinct from DNS changing which address a name resolves to.
- **B.** Remapping a reserved address keeps the address itself unchanged and repoints it at a new instance; DNS failover instead changes what a name resolves to, leaving addresses alone.
- **C.** A load balancer keeps one unchanged endpoint and stops routing to the unhealthy target internally; DNS failover instead changes what address clients are told to use, which is a different mechanism with a different speed limit.
- **D.** Correct. This matches the documented mechanism by which DNS routes traffic away from an unhealthy resource.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cloud-dns](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cloud-dns)

### 38. A

*sysadmin.system-administration.login-shell · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

A nologin shell is not an account lock — it does not remove authorised keys, and key authentication still succeeds — but it is not limited to interactive sessions either. `sshd` runs a non-interactive remote command by invoking the account's login shell with `-c`, and `nologin` ignores those shell options and exits 1, so the command never runs. Restoring a real shell restores both paths at once, which is why the shell field and the key file must be reasoned about separately.

- **A.** Correct. nologin(8) documents that shell command-line options are ignored and that its exit status is always 1, so the remote command never executes.
- **B.** A non-interactive command is handed to the account's login shell too, which is precisely why a nologin shell stops it.
- **C.** Changing the login shell does not touch `authorized_keys` at all; the key is still accepted, and the refusal comes later, from the shell.
- **D.** The nologin shell applies to whatever account it is set on; the UID range is a naming convention with no bearing on it.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.login-shell](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.login-shell)

### 39. A

*devops.devops-basics.monolith-vs-microservices · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

The dividing line between a monolith and microservices is deployment independence, not code size or quality. Splitting to scale a genuinely divergent workload is a real trade; splitting because a codebase is hard to read addresses the wrong problem and still buys the operational overhead.

- **A.** Correct. The dividing line is deployment independence, not code size or code quality, so readability alone does not justify the split.
- **B.** Splitting for readability spends operational effort on machinery that does not address a code-quality problem at all.
- **C.** Build and artifact promotion is an unrelated concern about how a release travels through environments, not about whether to split the codebase.
- **D.** Whether infrastructure is declared as code is orthogonal to whether the split is justified by a readability complaint in the first place.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.monolith-vs-microservices](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.monolith-vs-microservices)

### 40. C

*linux.linux-operating-system.cpu-architecture · Linux Fundamentals :: Linux Operating System · depth 3 · application*

Binaries and container images are architecture-specific. `amd64` naming a target that does not match the host's `aarch64` is an architecture mismatch, not a missing dependency — recognising the symptom avoids wrong-direction debugging.

- **A.** Nothing in the scenario points at a missing driver; the architecture strings named — `amd64` versus `aarch64` — are what identify the actual cause.
- **B.** `uname -m` reports hardware architecture specifically; a kernel version mismatch would involve `uname -r`, a different field entirely.
- **C.** Correct. This exact symptom is named directly: an architecture mismatch producing an unhelpful failure message, easily misread as a missing-package error.
- **D.** Container images and the binaries inside them are architecture-specific; one built for one instruction set will not run natively on another without emulation, which is exactly this failure.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.cpu-architecture](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.cpu-architecture)

### 41. A

*cloud.networking.cloud-subnets · Cloud Computing Fundamentals :: Networking · depth 3 · application*

A subnet is a slice of a network's address range where resources are placed and routing is attached; the virtual private cloud, not the subnet, is where isolation actually lives.

- **A.** Correct. Two subnets in one network route to each other automatically, so placing resources in separate subnets creates no isolation on its own.
- **B.** Isolation belongs to the virtual private cloud as a whole; two subnets carved from the same network route to each other by default, so this reassigns the network's property to the subnet.
- **C.** A network ACL filters traffic reaching a subnet; it does not create the routing isolation the question asks about, which subnets lack by default regardless of filtering rules.
- **D.** The question asks what isolation the three resources have from each other, and internet reachability is a separate matter decided by the subnet's route table rather than by the resources sitting in different subnets.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cloud-subnets](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cloud-subnets)

### 42. D

*security.security.system-hardening · Security Fundamentals :: Security · depth 2 · recall*

Vendors ship for broad usability, and a hardening baseline applied once reflects the system's state at that moment only. As software is installed and rules are added over the system's life, configuration drifts away from that baseline, which is why hardening is verified periodically against a published standard rather than treated as a one-time task.

- **A.** Benchmark cadence is not the reason periodic verification matters; the guide points to configuration drift on the host itself, from ordinary operational changes.
- **B.** Patching addresses named defects, a separate concern from whether unnecessary services, accounts, or ports have crept back in since the initial hardening pass.
- **C.** Attack surface grows through configuration changes too — a newly installed package or re-enabled account — which is exactly the drift hardening verification is meant to catch.
- **D.** Correct. The guide names configuration drift specifically as the reason a one-time hardening pass is insufficient, and periodic verification is what catches it.

Study it: [04-security/security.md#c-security.security.system-hardening](../study-guide/04-security/security.md#c-security.security.system-hardening)

### 43. B

*sysadmin.system-administration.proc-and-sys · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Reading a path under `/proc` causes the kernel to generate its contents on demand, which is why such entries report a size of zero to `ls -l` yet return real data when read — an artefact of `/proc` being a virtual filesystem with no disk-backed size, not a sign of corruption.

- **A.** On an ordinary on-disk filesystem that mismatch would be suspicious, but `/proc` is a virtual filesystem where every entry behaves exactly this way by design.
- **B.** Correct. Reading a path under `/proc` causes the kernel to generate the contents at that moment, which is why the reported size and the actual read content do not match the way an ordinary file would.
- **C.** Inode exhaustion is a property of on-disk filesystems with a fixed inode table; `/proc` entries are generated by the kernel on read and consume no on-disk inodes, and the zero size is unconditional rather than a symptom of anything.
- **D.** Nothing about this symptom indicates a mount problem; it is the expected, permanent behaviour of every entry under `/proc`.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.proc-and-sys](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.proc-and-sys)

### 44. D

*linux.linux-operating-system.kernel · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`uname -r` prints only the kernel's own release string. `uname -a` also includes it but mixed with unrelated fields, and `cat /etc/os-release` answers a different question entirely — distribution identity, not kernel version.

- **A.** It contains the release string but buries it among hostname, architecture, and build-date fields the task did not ask for; `-r` isolates the one field needed.
- **B.** That file reports distribution identity, not kernel version; assuming it reports the kernel is the exact mistake the guide's own trap describes.
- **C.** `lsmod` shows loaded modules, not a version string, and would not answer a question about which kernel release is running.
- **D.** Correct. The `-r` option is documented to report the kernel release, which is precisely the version string a driver-fix check needs.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.kernel](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.kernel)

### 45. B

*pm.project-management.kanban · IT Project Management Fundamentals :: Project Management · depth 3 · discrimination*

Kanban's defining mechanism is the explicit work-in-progress limit per stage, which turns the board into a pull system. A board with columns and no limits constrains nothing. Scrum instead bounds a batch of work with the fixed-length Sprint and its Sprint Goal — the two frameworks limit different things: how much is in flight at once, versus how long a batch may run before inspection.

- **A.** Kanban defines no accountabilities of its own; existing roles continue, so a missing Product Owner isn't the gap here.
- **B.** Correct. Without WIP limits nothing constrains how much work is started, so there's no pull system and none of Kanban's flow benefits follow; Scrum bounds work with the Sprint's timebox instead.
- **C.** A board with columns is not what makes the practice Kanban — the Kanban Guide explicitly distinguishes a Kanban board from practising Kanban, and the limits are the difference.
- **D.** Kanban's characteristic measures are lead time, delivery rate and WIP, not velocity, which is a Scrum-adjacent convention.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.kanban](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.kanban)

### 46. A

*sysadmin.system-administration.service · System Administration Fundamentals :: System Administration · depth 3 · discrimination*

`systemctl restart` stops and starts the process, while `systemctl reload` tells the already-running process to re-read its own configuration file — the appropriate choice when only the application's configuration, not the unit definition, has changed and the daemon supports reload.

- **A.** Correct. `reload` tells the already-running process to re-read its own configuration in place, avoiding the interruption a stop-then-start restart causes.
- **B.** Restart stops and starts the process, causing an interruption that a reload — when supported — avoids entirely for a configuration-only change.
- **C.** `daemon-reload` re-reads unit files, not an application's own configuration file; it would not make the running process notice the change at all.
- **D.** Enabling changes only boot-time activation; it does not make the currently running process re-read anything right now.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.service](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.service)

### 47. D

*cloud.performance-availability.caching · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · discrimination*

Caching is the general technique — a key, a value and an expiry, usable at any layer. A CDN is caching applied with geographic distribution: edge locations near each viewer, holding a copy of what the origin serves. Every CDN is a cache; not every cache is a CDN.

- **A.** They are the same general technique at different scope: the CDN adds geographic distribution on top of the caching behaviour the in-process cache already has.
- **B.** Forwarding without storing describes routing, not caching; a CDN's edge locations do store copies, which is what lets them serve a fresh request without contacting the origin.
- **C.** A CDN is explicitly a deployment of caching, not an unrelated technique; the exam expects the general form to be recognised inside its specific deployments.
- **D.** Correct. Every CDN is a cache, but not every cache is a CDN; the CDN's distinguishing property is geographic distribution, not the caching mechanism itself.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.caching](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.caching)

### 48. B

*devops.devops-basics.pipeline · DevOps Fundamentals :: DevOps Basics · depth 3 · recall*

A trigger starts a run, and stages execute in order so a failing stage stops the run from progressing. The artifact from a failed run is never promoted, which is why the artifact that reaches an environment is always the one that passed.

- **A.** Stages run in order precisely so a failure stops progress; independence between them would defeat the ordering's purpose.
- **B.** Correct. A failing stage halts the run; only a passing run's artifact is the one that gets promoted onward.
- **C.** Rollback concerns an already-released version; nothing here has reached an environment for a rollback to apply to.
- **D.** The output of a failing run is binary rather than partial credit; a failed test means the run failed, full stop.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.pipeline](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.pipeline)

### 49. A

*sysadmin.system-administration.systemctl-start-vs-enable · System Administration Fundamentals :: System Administration · depth 5 · diagnostic*

"The service is gone after a reboot" is diagnosed by checking `systemctl is-enabled <unit>` first. A reply of `disabled` fully explains the symptom: the service was started manually at some point and worked until the next reboot, at which point nothing pulled it back in because it was never enabled.

- **A.** Correct. A unit that reports `disabled` was never going to survive a reboot regardless of how well it was running beforehand, since starting it never touches its boot-time state.
- **B.** Checking whether it is active now says nothing about why it failed to come back, and `is-active` reports only whether the unit is running; the boot-time question is answered by `is-enabled`.
- **C.** A unit that was simply never enabled produces no failure at all — there is nothing in the logs to find, because the unit was never even asked to start.
- **D.** Re-reading unit files has no bearing on whether a unit's boot-time symlink exists; it neither creates nor removes that state.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.systemctl-start-vs-enable](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.systemctl-start-vs-enable)

### 50. D

*security.sensitive-data.personally-identifiable-information · Security Fundamentals :: Sensitive Data · depth 3 · application*

NIST SP 800-122 splits PII into information that distinguishes or traces an identity by itself and information that is linked or linkable to one in combination. A postcode and a date of birth carry no direct identifier but routinely narrow a population to a single person, which places the export in the second category regardless of what label the file carries or what a downstream vendor might later do with it.

- **A.** Stopping the analysis at direct identifiers is exactly the trap: removing a name does not end the question if what remains is still linkable.
- **B.** Classification is a label the organisation assigns; PII is a fact about the content that holds whether or not any label has been applied.
- **C.** The postcode-and-date-of-birth combination is already linkable on its own; waiting for a future join understates the risk in hand.
- **D.** Correct. NIST's second limb covers information that becomes identifying once combined, and a postcode plus date of birth is routinely enough on its own.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.personally-identifiable-information](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.personally-identifiable-information)

### 51. A

*linux.linux-operating-system.linux-history · Linux Fundamentals :: Linux Operating System · depth 2 · recall*

Torvalds began the Linux kernel in 1991 as a free Unix-like kernel, developing it openly with a large contributor base ever since — years before the Linux Foundation existed to sponsor it.

- **A.** Correct. This is the founding fact the guide states plainly, distinct from any later organisational involvement.
- **B.** In 1991 the kernel was Torvalds's own project, released under his personal copyright notice; the Linux Foundation came later and took a sponsoring role once the project was already established.
- **C.** 1983 belongs to the GNU Project's beginnings, not to Linux; GNU had assembled the whole system apart from a kernel by the early 90s, and that is the gap Linux filled.
- **D.** 1991 is well documented and not in dispute; the kernel's early history is one of the better-recorded parts of its story.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.linux-history](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.linux-history)

### 52. D

*sysadmin.system-administration.systemd-timer · System Administration Fundamentals :: System Administration · depth 3 · discrimination*

Because a timer activates a real systemd service rather than handing a command to a shell, it inherits the manager's features automatically: output captured in the journal (queryable with `journalctl -u`), full dependency ordering, and — with `Persistent=true` — the ability to catch up on a run missed while the machine was off.

- **A.** A timer requires a separate `.timer` unit paired with a `.service` unit — genuinely more moving parts than a single crontab line, not fewer.
- **B.** The examinable advantages are journal logging, dependency handling and catch-up behaviour — a full interactive environment is not one of them.
- **C.** System-wide scheduled jobs exist under plain cron too, via `/etc/crontab` and `/etc/cron.d/`; that is not a capability unique to timers.
- **D.** Correct. Both are direct consequences of a timer activating a fully-fledged systemd service rather than handing a command straight to a shell the way cron does.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd-timer](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd-timer)

### 53. B

*cloud.performance-availability.redundancy · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · recall*

Redundancy is duplication placed so that one failure is survivable, which depends on the duplicates sharing no single failure domain. Two servers in the same rack on the same power feed are not redundant against a rack- or feed-level failure even though there are two of them.

- **A.** Patch currency is a maintenance concern unrelated to whether the pair can survive a shared failure.
- **B.** Correct. Redundancy only survives failure if the duplicate is placed somewhere the same fault cannot reach both copies.
- **C.** Capacity testing measures throughput, not whether the two servers share a single point of failure.
- **D.** Billing terms have no bearing on whether the pair is placed in independent failure domains.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.redundancy](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.redundancy)

### 54. A

*pm.project-management.project-budget-and-resource-management · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

Cost and schedule are separate measurements — a project can be under budget and late at once — and adding people to work that is already behind typically slows it further in the short term, because existing staff are diverted to bringing newcomers up to speed. 'Hire more engineers' is usually the distractor in this competency's budget-and-resource questions, not the answer.

- **A.** Correct. Onboarding new people consumes the time of people already there before the newcomers produce anything, so the near-term effect is typically slower delivery, not faster.
- **B.** Work doesn't scale linearly with headcount added mid-project; ramp-up time works against the very speed-up being sought.
- **C.** Cost rises with new hires while schedule typically worsens before it improves; the two don't move together the way this option implies.
- **D.** Velocity reflects what a team has actually completed; new engineers don't retroactively raise a figure calculated from past Sprints, and they need ramp-up time before contributing to future ones.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.project-budget-and-resource-management](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.project-budget-and-resource-management)

### 55. D

*sysadmin.system-administration.unit-and-unit-file · System Administration Fundamentals :: System Administration · depth 3 · application*

`systemctl cat` prints the effective unit file plus every drop-in that applies to it, with each file's path shown as a comment — the way to see what is actually in effect rather than only the vendor-shipped definition under `/usr/lib/systemd/system`. `systemctl list-units` instead lists units currently loaded, not any single unit's file contents.

- **A.** That path holds only the distribution-shipped definition; an `/etc/systemd/system` override or a drop-in changing behaviour would not be visible there.
- **B.** That command lists which units are currently loaded, with their load, active and sub states and a description; it prints neither one unit's configuration nor any drop-in path.
- **C.** That command re-reads unit files and rebuilds the dependency graph; it does not print the unit's contents to the terminal.
- **D.** Correct. It is specifically designed to show what is actually in effect, including administrator overrides layered on top of the vendor-shipped file.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.unit-and-unit-file](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.unit-and-unit-file)

### 56. A

*devops.git-concepts.push · DevOps Fundamentals :: Git Concepts · depth 3 · discrimination*

`git push -u origin main` both pushes and sets that upstream, letting a later bare `git push` know where to send it. Separately, the remote refuses any update where its current commit is not an ancestor of what is being sent, because applying it would discard commits the remote already has — the documented explanation is that a rejected push also happens in a repository nobody else pushes to, whenever a commit already sent is amended or rebased.

- **A.** Correct. Both facts are documented: `-u`/`--set-upstream` records the tracking reference for future bare pushes, and the remote refuses updates that would drop commits it already has.
- **B.** Tags are never pushed by a plain push regardless of `-u` — they need `--tags`, `--follow-tags`, or being named directly — and a non-fast-forward rejection is usually not a permissions problem at all.
- **C.** That describes `--force`, a different flag with the opposite intent of `-u`; a later push can still be rejected as a non-fast-forward if the remote moves again.
- **D.** `-u` is about setting this branch's own upstream, unrelated to whether anyone else has pushed to the remote before; the rejection is about commit ancestry, not a name collision.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.push](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.push)

### 57. C

*security.sensitive-data.secure-deletion · Security Fundamentals :: Sensitive Data · depth 2 · application*

Deleting a file removes a directory entry and decrements the link count; the blocks holding the contents stay on the device until something else reallocates them, which is why undelete and forensic tools recover them routinely. NIST SP 800-88 warns specifically against methods that simply remove file pointers, and an exam option offering 'delete the files' as a disposal method for sensitive media is offering the wrong one.

- **A.** The contents stay on the device until something else reallocates the blocks, which is exactly why undelete and forensic tools recover them routinely.
- **B.** Whether the retention period has expired governs whether the data should be disposed of; it says nothing about whether the disposal method actually erased it.
- **C.** Correct. Deletion is a namespace operation, not a data operation, which is the single insight NIST SP 800-88 warns against confusing with sanitisation.
- **D.** Even with no backup anywhere, the delete command still leaves the original blocks recoverable on this drive — the backup's existence is not what makes the answer no.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.secure-deletion](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.secure-deletion)

### 58. A

*linux.linux-operating-system.terminal · Linux Fundamentals :: Linux Operating System · depth 3 · recall*

The terminal, historically a physical device, is today usually a terminal emulator window or a remote session over SSH. It manages display and input and hands typed input to whatever program it launched — usually a shell — over a pseudo-terminal device.

- **A.** Correct. A remote session over SSH is named directly as a modern form of terminal in the guide, alongside a physical device or a terminal emulator window.
- **B.** Direct interaction does not make it the interpreter; the remote shell running on the server does the interpreting, the SSH session only carries the input and output.
- **C.** Network connection handling is a kernel-level detail on both ends, but that does not make the SSH session itself a kernel component.
- **D.** A pty is the kernel-side channel the terminal and shell communicate over; the SSH session itself is the terminal program using that channel, not the channel itself.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.terminal](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.terminal)

### 59. D

*cloud.performance-availability.vertical-scaling · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

A single-writer path with no way to divide the work is the textbook case for vertical scaling: resize to a bigger instance, at the cost of a restart, and accept that the move is finished once the largest instance type is reached.

- **A.** The scenario states the write path cannot be split; adding nodes behind a load balancer does nothing for work that is not distributable.
- **B.** Auto-scaling automates adding and removing instances of a distributable workload; it does not apply to a single-writer path that cannot be spread across instances.
- **C.** Caching serves repeated reads from a stored copy; it has no mechanism for absorbing writes, which must still reach the authoritative store.
- **D.** Correct. A workload that cannot be divided is exactly the case vertical scaling answers, and its two limits are the restart and the ceiling.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.vertical-scaling](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.vertical-scaling)

### 60. C

*sysadmin.troubleshooting.cannot-connect-to-a-service · System Administration Fundamentals :: Troubleshooting · depth 4 · application*

`curl -v` distinguishes "never connected" from "connected and got an HTTP error" by showing the connection steps separately; a 502 by IP rules out every layer beneath the application. The hang by hostname is a different failure entirely, and `dig` and `ping` against the name versus the IP is how it gets confined to resolution.

- **A.** A 502 is a completed HTTP exchange, not a network failure, so it cannot share a cause with a connection that never completes at all.
- **B.** A 502 proves the TCP connection succeeded and the server responded; the process is running, it's simply returning an error status, which is not evidence of a crash.
- **C.** Correct. A 502 is only returned after the TCP connection succeeds, so it rules out every network layer beneath it, while the separate hang-by-name result confines the second fault to DNS.
- **D.** The IP-based test already showed the host responding promptly, so a name-based hang implicates resolution timing, not host CPU load.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.cannot-connect-to-a-service](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.cannot-connect-to-a-service)

