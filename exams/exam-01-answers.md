<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 01 — answers

### 1. A

*sysadmin.best-practices.asset-and-inventory-management · System Administration Fundamentals :: Best Practices · depth 2 · recall*

The inventory is the prerequisite every other discipline in this competency quietly assumes: patch cadence applies to the estate it lists, baselines are enforced on the hosts it names, and monitoring watches what it was told exists. A host outside that record is invisible to all of them.

- **A.** Correct. The dangerous host is always the one nobody remembered, which is exactly what a maintained inventory exists to prevent.
- **B.** Monitoring watches only the systems someone configured it to watch, which by construction excludes a forgotten host.
- **C.** A baseline shortfall assumes the host is already known and enrolled; the failure here happened before that point.
- **D.** Discovering a host only once it is attacked is the failure state the practice exists to avoid, not a substitute for it.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.asset-and-inventory-management](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.asset-and-inventory-management)

### 2. B

*cloud.best-practices.automation-over-manual-configuration · Cloud Computing Fundamentals :: Best Practices · depth 3 · application*

Automation converts reproducibility, reviewability and auditability of the definition into one solved problem, which is exactly what the operational excellence pillar of a well-architected review asks for. It is a distinct axis from immutability: automating provisioning does not by itself eliminate drift, because a console change made outside the loop is still possible until the definition is reapplied continuously or the instance is replaced rather than edited.

- **A.** Replacing rather than editing is what immutable infrastructure adds; automating the template's application does not by itself guarantee that.
- **B.** Correct. Automation converts reproducibility and review into a solved problem, but anyone with console access can still act outside the loop unless reconciliation is continuous.
- **C.** A template can still request over-broad permissions; review catches that only if someone checks for it, which automation alone does not guarantee.
- **D.** The template records the intended state; who called which API and when is still a separate audit-log question.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.automation-over-manual-configuration](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.automation-over-manual-configuration)

### 3. C

*linux.command-line.awk · Linux Fundamentals :: Command Line · depth 3 · application*

The default field separator is a run of whitespace, with leading and trailing whitespace ignored — but with an explicit single-character separator set by `-F`, every occurrence separates a field, so consecutive delimiters produce empty fields.

- **A.** The whitespace-collapsing behaviour applies only to the default separator; an explicit single-character separator like `-F:` does not collapse repeats.
- **B.** awk does not error on adjacent delimiters; it simply produces an empty field between them, silently.
- **C.** Correct. With an explicit single-character separator such as `-F:`, awk treats every colon as its own delimiter, so two colons in a row create an empty field rather than being collapsed together.
- **D.** Field numbering is a straightforward left-to-right count including empty fields; it does not reset partway through a record.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.awk](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.awk)

### 4. D

*security.compliance.policy-standard-and-procedure · Security Fundamentals :: Compliance · depth 2 · application*

The three tiers change at different costs and by different authority. A procedure is routine operational work to update; a standard changes what an assessor tests against, so changing it moves the compliance boundary and typically needs sign-off.

- **A.** Nothing about the measurable requirement changed here, only the steps used to satisfy it, so the standard was never touched.
- **B.** A policy states intent and who is bound; swapping the ticketing tool changes neither.
- **C.** A runbook is exactly the procedure tier, the steps that satisfy a standard, so it is not outside the hierarchy at all.
- **D.** Correct. Rewriting a procedure is routine operational work, unlike changing a standard, which moves the compliance boundary.

Study it: [04-security/compliance.md#c-security.compliance.policy-standard-and-procedure](../study-guide/04-security/compliance.md#c-security.compliance.policy-standard-and-procedure)

### 5. B

*devops.containers.container-image · DevOps Fundamentals :: Containers · depth 3 · discrimination*

The Dockerfile/image/registry comparison separates recipe, built artifact, and distribution point. An image can exist purely locally with no Dockerfile in sight and no registry ever involved, which is exactly what the wrong answers deny.

- **A.** This reverses the two: the Dockerfile is read to produce the image, never the other way around.
- **B.** Correct. Each term names a different stage: source recipe, the thing built from it, and the warehouse it is shipped through.
- **C.** The registry is the server; the image is the artifact it stores, not the reverse relationship.
- **D.** An image built locally and never pushed anywhere is still a complete, usable image; the registry is optional distribution, not a requirement for existence.

Study it: [05-devops/containers.md#c-devops.containers.container-image](../study-guide/05-devops/containers.md#c-devops.containers.container-image)

### 6. B

*pm.functional-analysis.functional-requirements · IT Project Management Fundamentals :: Functional Analysis · depth 3 · discrimination*

Functional requirements describe the functions the software is to execute; non-functional requirements act to constrain the solution — how well those functions are performed. A number settles nothing on its own: a count of failed attempts is part of the behaviour, while a latency bound is a quality constraint. Neither the subject matter (security, in this case) nor the importance decides the classification.

- **A.** The count of failed attempts is part of the function being specified; a non-functional requirement bounds how well a function performs, such as its speed or availability, and numbers appear in both kinds.
- **B.** Correct. Functional requirements describe the functions the software is to execute, while non-functional ones act to constrain the solution, so a stated behaviour lands on the functional side.
- **C.** Lockout after failed attempts is the behaviour itself, not a mechanism for achieving some other behaviour; it belongs in the requirement, whether or not a use case later elaborates it.
- **D.** Security does appear in the standard list of non-functional categories, but that list covers quality constraints; a security behaviour the system must execute, such as locking an account, is a function like any other.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.functional-requirements](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.functional-requirements)

### 7. B

*sysadmin.disaster-recovery.business-continuity · System Administration Fundamentals :: Disaster Recovery · depth 3 · discrimination*

Business continuity is the discipline of keeping the organisation operating through disruption — staff, premises, suppliers, communications and systems. Disaster recovery is the part of that concerned with restoring IT service. The axis is scope: one contains the other.

- **A.** This inverts the containment; the technical procedure sits inside the organisational one.
- **B.** Correct. Continuity covers keeping the organisation operating; IT recovery is one part of that.
- **C.** They differ in scope, and treating them as synonyms is what the comparison tests.
- **D.** Both span the incident and its aftermath; the difference is breadth, not timing.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.business-continuity](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.business-continuity)

### 8. B

*cloud.best-practices.encryption-by-default · Cloud Computing Fundamentals :: Best Practices · depth 2 · recall*

Encryption at rest protects the stored bytes — a stolen disk, a snapshot copied to another account, a decommissioned volume — and TLS protects data on the wire, leaving the disk readable; the two threats and their defences do not overlap.

- **A.** At-rest encryption protects the stored bytes and does nothing whatsoever for data crossing a network; transmission needs TLS separately.
- **B.** Correct. The two protect different points in the data's path and address different threats.
- **C.** Neither a secret store nor a key management service defends the network path; TLS is what protects data in transit.
- **D.** IAM and MFA govern who is authorised to call an API; neither protects bytes on a stolen disk or on the wire.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.encryption-by-default](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.encryption-by-default)

### 9. A

*sysadmin.disaster-recovery.rto · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

The recovery time objective dictates the recovery method and the standby capacity that must be paid for. Matching a site tier to a stated recovery time is a textbook question shape: the tighter the target, the more of the destination must already be running.

- **A.** Correct. Only an already-equipped, already-loaded facility can take over inside half an hour.
- **B.** The restore step alone will normally exceed thirty minutes.
- **C.** Hardware would have to be procured and installed first, which takes days or longer.
- **D.** Retrieving and restoring media is measured in hours, not in the stated window.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.rto](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.rto)

### 10. D

*linux.command-line.diff-and-comparison · Linux Fundamentals :: Command Line · depth 3 · application*

Unified output shows a `---` header for the first file and a `+++` header for the second, with changed lines prefixed `-` (removed from the first) and `+` (added in the second) — reversing the operands inverts the meaning of every line. The unified form that produces this exact output is `diff -u`.

- **A.** The operands are read left to right, matching the order given on the command line, so `-` corresponds to the first-named file, not the second.
- **B.** Unified diff has no separate "moved" marker; a line simply present in one file and absent in the other shows as removed (`-`) or added (`+`).
- **C.** The assignment of `-` and `+` follows the order the files were given on the command line, not alphabetical order.
- **D.** Correct. In unified output, the `---` header names the first file and `+++` names the second; a `-` line is present in the first file and absent from the second, while `+` marks the reverse.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.diff-and-comparison](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.diff-and-comparison)

### 11. C

*security.security.accounting-and-auditing · Security Fundamentals :: Security · depth 3 · discrimination*

Accounting is a detective control: it establishes that an action occurred and by whom, but it cannot itself prevent the action. The preventive remedy for an unauthorised change is tightening authorization, not enabling more logging around it.

- **A.** This is precisely the misconception the guide warns against: accounting only ever establishes that an action occurred, never stops it.
- **B.** MFA strengthens login proof and does not address an authorization problem, which is what an unauthorised change actually is.
- **C.** Correct. The guide is explicit that accounting is never a preventive control — offering it as the fix for an unauthorised action mistakes detection for prevention.
- **D.** Encryption at rest protects stored data from being read by someone who obtains the medium; it does not decide who may change a record, which is what an unauthorised change turns on.

Study it: [04-security/security.md#c-security.security.accounting-and-auditing](../study-guide/04-security/security.md#c-security.security.accounting-and-auditing)

### 12. A

*sysadmin.networking.bandwidth-latency-and-throughput · System Administration Fundamentals :: Networking · depth 2 · application*

A high-bandwidth link can still feel slow: an interactive session or a page load with many small requests is dominated by latency, not by capacity, so buying more bandwidth changes nothing for that kind of workload, while a bulk transfer is bounded by capacity and benefits directly.

- **A.** Correct. A high-bandwidth link can still feel slow for an interactive workload dominated by many small requests, because that experience is governed by round-trip latency rather than by how much data the link can carry per second.
- **B.** An interactive workload dominated by small requests is bound by latency, not by bandwidth, so a bandwidth increase alone does not proportionally reduce its perceived delay.
- **C.** Which transport protocol the application uses is unrelated to why capacity upgrades do not help a latency-bound workload; the explanation is the dominance of round-trip delay, not protocol choice.
- **D.** Nothing in the scenario points at DNS specifically; the described symptom, an interactive app unaffected by more bandwidth, is the textbook signature of latency dominance, not a naming problem.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.bandwidth-latency-and-throughput](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.bandwidth-latency-and-throughput)

### 13. D

*devops.containers.image-tags · DevOps Fundamentals :: Containers · depth 2 · recall*

A tag is a mutable pointer to an immutable image. `latest` carries no special comparison logic — it is simply the fallback tag used when a reference names a repository without a tag, and whatever was most recently pushed under that name is what it currently points to.

- **A.** There is no automatic recalculation; `latest` moves only because a push explicitly named that tag, the same as any other tag.
- **B.** That command produces `api:latest` because no tag was given, not because the build process verified it was the newest version.
- **C.** `latest` is an ordinary tag like any other; a registry places no restriction on pushing an image under that name.
- **D.** Correct. `latest` is not computed by comparing version numbers; it is simply whichever image was most recently pushed under that name.

Study it: [05-devops/containers.md#c-devops.containers.image-tags](../study-guide/05-devops/containers.md#c-devops.containers.image-tags)

### 14. A

*cloud.budgeting.capex-vs-opex · Cloud Computing Fundamentals :: Budgeting · depth 2 · discrimination*

AWS's page argues the trade in fixed-versus-variable-expense language rather than literally saying CapEx or OpEx. The two vocabularies describe the same accounting shift, but a citation must not assume the source used words it never contains.

- **A.** Correct. The source behind this concept states the trade as fixed versus variable expense, not in the literal accounting vocabulary.
- **B.** A tempting shortcut, but the source's own wording is fixed and variable expense — assuming it uses the accounting terms verbatim is a citation error, not a paraphrase.
- **C.** That pair names the billing principle behind consumption charges, a different concept from the accounting-category trade this page argues.
- **D.** That pair names a purchasing-option trade-off, not the fixed-versus-variable expense vocabulary this page uses.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.capex-vs-opex](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.capex-vs-opex)

### 15. D

*linux.command-line.finding-files · Linux Fundamentals :: Command Line · depth 3 · application*

Because `-name` takes a shell pattern, that pattern must be quoted — `find . -name '*.log'` — otherwise the shell expands it against the current directory before `find` runs, so `find` receives whatever matched there instead of the pattern itself.

- **A.** find(1) descends the directory hierarchy from each starting point by default and has no `-R` option at all; the symptom comes from shell expansion consuming the pattern.
- **B.** There is no such exclusion; `find` treats a `.log` extension like any other part of a filename once it receives the pattern correctly.
- **C.** `-name` matches on its own without a required `-type` filter; adding `-type f` narrows results but its absence does not explain this symptom.
- **D.** Correct. `-name` expects a shell pattern as its own argument, but an unquoted `*.log` is expanded by the shell against the current directory first, so `find` receives an already-resolved filename instead of a pattern to apply recursively.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.finding-files](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.finding-files)

### 16. D

*pm.functional-analysis.traceability · IT Project Management Fundamentals :: Functional Analysis · depth 1 · recall*

Traceability links each requirement forward to design, implementation and test, and back to the need that justified it, so coverage and impact can both be demonstrated. It is confused with testing itself, but a link is not a verdict.

- **A.** A link between a requirement and a test says nothing about whether the requirement itself was the right one to have — that is a validation question the matrix does not answer.
- **B.** The matrix records links between requirements and tests, not who executed a test or with what outcome.
- **C.** A link shows a test exists for the requirement, not that the test was run or that it passed; coverage and correctness are different claims.
- **D.** Correct. Traceability shows that a link exists in both directions, forward to tests and back to the need that justified the requirement; it makes no claim at all about outcomes.

Study it: [06-it-project-management/functional-analysis.md#s-functional-analysis-quality](../study-guide/06-it-project-management/functional-analysis.md#s-functional-analysis-quality)

### 17. A

*sysadmin.networking.dns · System Administration Fundamentals :: Networking · depth 3 · discrimination*

A very large share of "the network is down" reports are DNS failures, with a distinct signature — raw IP addresses work while names do not — separate from DHCP failure, whose signature is no address at all or a 169.254 link-local self-assignment.

- **A.** Correct. DNS and DHCP are the two automatic-sounding services most often conflated, but their failure signatures are opposite and distinct: one affects naming, the other affects getting an address in the first place.
- **B.** A host with working raw IP connectivity already has a working address; the symptom described — names failing while addresses work — is specifically DNS, not DHCP.
- **C.** ARP resolves addresses to MAC addresses on the local segment only; a host with working raw IP connectivity to remote addresses has already succeeded past any ARP step involved.
- **D.** NAT rewrites addresses in transit and has no role in name resolution at all; a NAT failure would not selectively break names while leaving raw address connectivity intact.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dns](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dns)

### 18. A

*sysadmin.networking.ipv6-address · System Administration Fundamentals :: Networking · depth 3 · application*

`fe80::/10` link-local addresses are automatically configured on every interface and never routed off the local link, so their presence in `ip -6 addr` output tells you nothing about whether the site actually routes IPv6 traffic anywhere.

- **A.** Correct. Link-local addresses in the `fe80::/10` range are configured automatically and never routed off the link, independent of whether the site routes IPv6 at all.
- **B.** Link-local addresses are self-configured by every interface automatically; no DHCPv6 server, rogue or otherwise, is involved in assigning them.
- **C.** A link-local address is confined to the local link by definition and proves nothing about site-wide or internet IPv6 routing.
- **D.** The IPv6 loopback address is `::1/128`; `fe80::/10` is the separate link-local range, not the loopback range.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ipv6-address](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ipv6-address)

### 19. D

*security.security.authentication-vs-authorization · Security Fundamentals :: Security · depth 3 · discrimination*

The named comparison block separates authentication/authorization, accounting and auditing, and multi-factor authentication by timing: the first pair is preventive and acts before and during access, accounting is detective and acts afterward from records, and MFA is not a fourth A at all — it strengthens the authentication step itself.

- **A.** Accounting is not a weaker authentication — it answers a different question entirely, recording what an already-admitted identity did rather than deciding whether to admit it.
- **B.** Deployment cost does not distinguish them; each answers a different question and acts at a different moment relative to the access decision.
- **C.** Scope of rollout is a deployment choice, not a property of the controls; all three can apply to any account on any number of systems.
- **D.** Correct. NIST defines authentication as verifying identity "often as a prerequisite to allowing access", and audit as the "independent review and examination of records and activities" that follows; MFA acts at the same moment as authentication, only with more than one factor category (SP 800-63B-4).

Study it: [04-security/security.md#c-security.security.authentication-vs-authorization](../study-guide/04-security/security.md#c-security.security.authentication-vs-authorization)

### 20. D

*cloud.budgeting.orphaned-resources · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

Detaching a volume saves nothing at all: an unattached disk bills the same per gigabyte-month as an attached one, because storage is charged for existing, not for being read or connected. Only deletion stops the charge.

- **A.** Egress bills for data leaving the network during a transfer, not for detaching a disk, which involves no data movement at all.
- **B.** There is no discounted idle rate for a merely-detached disk; it bills at the same per-gigabyte-month rate as when it was attached.
- **C.** An unattached disk bills exactly the same per gigabyte-month as an attached one; whether it serves a workload has no bearing on the storage meter.
- **D.** Correct. Storage is charged for existing on the platform, not for being attached to a running instance or being read from; only deletion stops the meter.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.orphaned-resources](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.orphaned-resources)

### 21. C

*linux.command-line.navigating-the-filesystem · Linux Fundamentals :: Command Line · depth 3 · recall*

`cd` with no argument goes to `$HOME`, and `cd -` returns to the previous directory, printing where it landed. Neither is an error condition.

- **A.** A bare `cd` is explicitly defined to go home; it does not require an argument and produces no error.
- **B.** A bare `cd` goes to `$HOME`, not to the filesystem root; those are two different, easily confused destinations.
- **C.** Correct. `cd` with no operand goes to the value of `$HOME`, which is a deliberate default rather than a missing-argument failure.
- **D.** `cd -` specifically returns to the previous directory; a bare `cd` with no argument goes to `$HOME` instead, a different and fixed destination.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.navigating-the-filesystem](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.navigating-the-filesystem)

### 22. D

*devops.containers.pod · DevOps Fundamentals :: Containers · depth 3 · discrimination*

This is the distinction most often missed: the scheduler places pods, not containers, so a pod's containers can never be split across two nodes, and scaling always means creating more pods, never adding more containers to one pod.

- **A.** A pod is not a bigger container; it is a distinct wrapper, and adding more containers to one pod is a co-location decision, not a scaling one.
- **B.** The scheduler places pods specifically; it has no mechanism for placing individual containers independently of the pod that wraps them.
- **C.** A single Deployment already declares a replica count and manages that many pods from one pod template; five separate Deployments would be redundant.
- **D.** Correct. Kubernetes manages pods, not containers directly, so scale-out is expressed entirely in terms of the number of pods, not containers packed into one.

Study it: [05-devops/containers.md#c-devops.containers.pod](../study-guide/05-devops/containers.md#c-devops.containers.pod)

### 23. D

*sysadmin.networking.ports-and-sockets · System Administration Fundamentals :: Networking · depth 3 · application*

A connection is identified by the pair of sockets: source address, source port, destination address, destination port — the four-part identity is why thousands of clients can reach the same server port simultaneously without ambiguity, since each client contributes a distinct address and ephemeral source port.

- **A.** The server does not open a new destination port per client; the port stays 443 for every connection, and it is the client-side address and port that make each connection distinct.
- **B.** MAC addresses are rewritten at every router and never reach the server intact from a remote client; the server identifies connections by IP address and port, not by MAC.
- **C.** TTL is a hop-count field that decrements at every router and is not designed or reliable as a connection identifier; the four-tuple of addresses and ports is what actually distinguishes connections.
- **D.** Correct. A connection is identified by the pair of sockets, and it is the client side of that pair, a different source address and ephemeral port for each client, that keeps a shared destination port unambiguous.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ports-and-sockets](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ports-and-sockets)

### 24. A

*cloud.cloud-computing.container-vs-virtual-machine · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · recall*

'Container vs virtual machine' names the requirements-to-choice decision itself — an axis, not a thing you can create. 'Virtual machine' names one of the two concrete options inside that decision, the kind of entity a definition or responsibility-boundary question would ask about directly. The same relationship holds between any comparison and either of its members.

- **A.** Correct. The comparison is a decision an engineer makes; a virtual machine is a thing an engineer creates, boots and destroys — different categories answering different questions.
- **B.** A question can ask purely 'what is a virtual machine' or 'who patches it' with no container involved at all; the comparison specifically concerns the choice between the two technologies.
- **C.** No orchestration tool is implied by either term; the comparison is a conceptual selection decision, not a piece of named software.
- **D.** Neither term is restricted to one setting — virtual machines and the choice between them and containers both apply equally on-premises and in the cloud.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.container-vs-virtual-machine](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.container-vs-virtual-machine)

### 25. C

*pm.open-source-software-and-licensing.open-source-software · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

The Open Source Definition's ten criteria decide the question, not marketing or source visibility. A no-competing-use clause restricts a field of endeavour (OSD 6), which disqualifies the licence however openly the code is published.

- **A.** Source visibility alone settles nothing; proprietary software can also be source-available while still reserving redistribution.
- **B.** The Open Source Definition does not require any particular wording; it is judged on what rights the licence grants.
- **C.** Correct. OSD 6 bars discrimination against fields of endeavour, and a no-competing-service clause is exactly that kind of restriction.
- **D.** This is the reasoning the field-of-endeavour criterion exists to rule out; visibility is necessary but nowhere near sufficient.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.open-source-software](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.open-source-software)

### 26. D

*sysadmin.networking.tcp-ip-model · System Administration Fundamentals :: Networking · depth 3 · recall*

The TCP/IP model has four layers — link, internet, transport, application — and every host on the internet genuinely implements these; nothing implements OSI's seven layers directly.

- **A.** 'Physical' and 'session' are OSI layer names, not TCP/IP layers; the TCP/IP model has no separate session layer at all.
- **B.** 'Network' and 'presentation' belong to OSI's seven-layer vocabulary, not to the four TCP/IP layers.
- **C.** The transport and internet layers are listed in the wrong order relative to how a packet actually travels outward from a host.
- **D.** Correct. RFC 1122 defines these four layers as what every host on the internet actually implements, in this order.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.tcp-ip-model](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.tcp-ip-model)

### 27. B

*security.security.password-hashing-and-salting · Security Fundamentals :: Security · depth 3 · application*

A salt exists to prevent precomputed rainbow tables and to stop identical passwords producing identical hashes across accounts; it does not slow down the hash function itself. SHA-256 is deliberately fast, so a salted SHA-256 password table still falls quickly to an attacker who can attempt guesses at speed — the fix is a deliberately slow, memory-hard function, not more salting.

- **A.** The salt does not need to be secret — its job is uniqueness, and storing it in the clear alongside the hash is correct and expected, not the flaw here.
- **B.** Correct. Salting solves uniqueness and rainbow-table reuse, not speed; a deliberately slow function such as Argon2id, scrypt, bcrypt or PBKDF2 is what raises the per-guess cost.
- **C.** SHA-256 has no key and is not reversible; the weakness described is its speed against brute-force guessing, not reversibility.
- **D.** Storing a one-way digest with a salt is hashing, not encryption; there is no key involved and nothing here is reversible.

Study it: [04-security/security.md#c-security.security.password-hashing-and-salting](../study-guide/04-security/security.md#c-security.security.password-hashing-and-salting)

### 28. A

*linux.command-line.reading-ls-l-output · Linux Fundamentals :: Command Line · depth 5 · application*

On a directory, `r` means list the names inside, `x` means traverse it, and `w` means create, delete or rename entries inside it. In `drwxr-xr-x`, only the owner triad (`rwx`) has `w` set, so only the owner may create a file there.

- **A.** Correct. On a directory, `w` is what allows creating, deleting or renaming entries inside it, and in `drwxr-xr-x` only the first (owner) triad has `w` set.
- **B.** Read and execute on a directory govern listing and traversal, not creation; creating an entry specifically requires `w`, which only the owner triad has here.
- **C.** `x` on a directory permits traversal — resolving a path through it — not creating new entries, which needs `w` specifically.
- **D.** Reading `rwxr-xr-x` triad by triad, the owner's triad is `rwx`, which does include `w`; only group and other lack it here.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.reading-ls-l-output](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.reading-ls-l-output)

### 29. A

*sysadmin.system-administration.bootloader-and-grub · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

GRUB's runtime configuration, `grub.cfg`, is generated from `/etc/default/grub` and the scripts in `/etc/grub.d/`, not edited directly — the same "edited the source, did not rebuild the artefact" shape as a systemd unit needing `daemon-reload`. `update-grub` (Debian-family) or `grub2-mkconfig` (Red Hat-family) must run to regenerate it.

- **A.** Correct. `grub.cfg` is the file GRUB actually reads at boot, and it is generated from `/etc/default/grub` rather than being read directly, so a source edit alone has no effect until regeneration runs.
- **B.** GRUB reads the generated `grub.cfg`, not `/etc/default/grub` directly — the source file only takes effect once the generation step rewrites the config GRUB actually loads.
- **C.** `daemon-reload` re-reads systemd unit files and has nothing to do with GRUB's configuration, which is generated by a separate, unrelated tool.
- **D.** Secure Boot verifies signatures on boot executables; it does not selectively block a default-entry change, and nothing in the scenario points at signature verification.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.bootloader-and-grub](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.bootloader-and-grub)

### 30. A

*cloud.cloud-computing.object-block-and-file-storage · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Object storage stores each item with its key and metadata, and a write replaces the whole object rather than editing bytes in place — there is no mechanism for a partial, in-place write at all. A database performs exactly that kind of random write to its data files, which is why object storage is not merely a slow choice for this use but a mechanically impossible one.

- **A.** Correct. The guide states this precisely: whole-object replacement makes putting live database files there mechanically impossible, not merely slow.
- **B.** Object storage typically scales to enormous sizes; the actual blocker is the write model — whole-object replacement — not a size ceiling.
- **C.** Object storage is specifically reached over an HTTP API; the mismatch is that a database needs partial, in-place writes, which that access model does not provide, not that it cannot be reached at all.
- **D.** This reverses the two: block storage is what a guest OS formats with a filesystem; object storage has no filesystem to format at all, addressing items by key in a flat namespace instead.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.object-block-and-file-storage](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.object-block-and-file-storage)

### 31. C

*devops.devops-basics.continuous-integration · DevOps Fundamentals :: DevOps Basics · depth 3 · discrimination*

Continuous integration is a team practice — merge to a shared branch often, verify every change automatically — separate from the pipeline machinery that carries it out. A team can own automation without meaningfully integrating.

- **A.** A pipeline can run nightly against long-lived branches with no continuous integration behind it; the machinery is not the practice.
- **B.** Deploying anywhere moves the scenario into delivery or deployment; continuous integration stops at a tested artifact.
- **C.** Correct. Merge frequency to a shared branch is the behaviour the practice names; owning an automated pipeline is not sufficient on its own.
- **D.** Discipline is not the criterion; frequent merging to a shared branch is, and the second team's cadence is the opposite of that.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.continuous-integration](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.continuous-integration)

### 32. D

*sysadmin.system-administration.disk-usage-vs-free-space · System Administration Fundamentals :: System Administration · depth 4 · application*

`df` reports what the filesystem itself has allocated, which includes blocks belonging to files that have been unlinked but are still held open by a running process; `du` walks directory names and cannot see such a file at all, since it has no name left to walk to. That is the classic explanation when `du`'s total falls well short of `df`'s.

- **A.** `du` is not miscounting; it fundamentally cannot see certain categories of space, such as a deleted-but-open file, regardless of which flags are used.
- **B.** Inode exhaustion shows up in `df -i`, not as inflated block usage in `df -h`; it produces "No space left on device" on new writes while blocks remain free, and does not open a gap between reported used space and a directory walk.
- **C.** A structural check is not the standard first response to this specific symptom; `df` and `du` disagreeing has well-known, non-corruption causes to check first.
- **D.** Correct. A deleted-but-open file keeps its blocks allocated on the filesystem, but has no name left for `du` to walk to, so it never appears in the total.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.disk-usage-vs-free-space](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.disk-usage-vs-free-space)

### 33. A

*linux.command-line.shell-scripting-basics · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

The kernel's `execve` inspects a file's first bytes only when it is executed directly; if they are `#!`, it runs the named interpreter. Invoking the script as `sh script.sh` runs it under `sh` explicitly instead, ignoring the shebang entirely.

- **A.** Correct. The kernel consults the shebang only at direct execution time, via `execve`; invoking the file as an argument to `sh` runs it under `sh` instead, ignoring the interpreter the shebang names.
- **B.** There is no such warm-up requirement; the shebang is either consulted at direct execution or not consulted at all when a different interpreter is named explicitly.
- **C.** The shell performs no such rewrite: `./script.sh` is a direct execution in which the kernel reads the shebang, while `sh script.sh` runs `sh` and hands it the file as an argument, which is what bypasses the shebang.
- **D.** The shebang is read from the very first bytes of the file itself by the kernel before anything runs; it has nothing to do with the script's output.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.shell-scripting-basics](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.shell-scripting-basics)

### 34. B

*security.security.risk-threat-and-vulnerability · Security Fundamentals :: Security · depth 2 · recall*

A vulnerability is a weakness and a threat is a potential exploiter — neither carries a magnitude on its own. Risk is the combination of likelihood and impact, and removing any one of the three factors — patching the weakness, blocking the threat's access path, or reducing impact through segmentation and backups — collapses the resulting risk.

- **A.** It is risk, not threat, that is expressed as a magnitude of likelihood and impact combined; a threat is a circumstance or actor, not a scored quantity.
- **B.** Correct. SP 800-30r1 determines risk as "typically a function of the degree of harm and likelihood of harm occurring" given the potential for threats exploiting vulnerabilities, so removing any factor in that relationship collapses the resulting risk.
- **C.** CVSS scores a specific catalogued defect's severity, which is a different measurement from the likelihood-and-impact combination that defines risk.
- **D.** NIST keeps the three distinct: a vulnerability is a weakness, a threat is a circumstance or actor with the potential to exploit it, and only risk is expressed as a magnitude combining likelihood and harm.

Study it: [04-security/security.md#c-security.security.risk-threat-and-vulnerability](../study-guide/04-security/security.md#c-security.security.risk-threat-and-vulnerability)

### 35. A

*pm.project-management.communication-plan · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

A communication plan turns stakeholder analysis into action: each group is mapped to a content level, a frequency and a channel matched to how much influence and interest they have. High influence and low day-to-day interest is the textbook case for periodic summaries at phase boundaries plus immediate notice of anything crossing a defined threshold, not daily detail or unscheduled browsing.

- **A.** Correct. The plan maps each stakeholder to a content level, frequency and channel suited to their influence and interest, not a one-size cadence; high influence with low daily interest points to periodic summaries plus threshold-based alerts.
- **B.** Daily detail suits the delivery team's own coordination need, not a reviewer whose interest is low day to day despite her high influence over release.
- **C.** Influence alone is enough to make someone a stakeholder; low day-to-day interest changes what she's sent, not whether she's tracked.
- **D.** Read access to a ticket system isn't a decided content level, frequency or channel — it substitutes browsing for the deliberate plan the practice calls for.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.communication-plan](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.communication-plan)

### 36. B

*sysadmin.system-administration.etc-group · System Administration Fundamentals :: System Administration · depth 3 · discrimination*

`/etc/group` has four fields — group name, password placeholder, GID, and the comma-separated supplementary member list — against `/etc/passwd`'s seven, because one row describes an entire group rather than a single account's full set of attributes. `getent group` is the NSS-aware way to query a row rather than reading the file directly.

- **A.** The two files describe different kinds of row and do not share a field count; `/etc/group` has fewer fields.
- **B.** Correct. `/etc/group` records group name, password placeholder, GID, and the member list — fewer fields because a group carries less per-row data than an account.
- **C.** This reverses the actual counts: `/etc/passwd` is the seven-field file describing an account.
- **D.** Nine is the field count for `/etc/shadow`, not `/etc/passwd`, which has seven.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-group](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-group)

### 37. C

*cloud.cloud-computing.service-level-agreement · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · recall*

The SRE book defines an SLA as an explicit or implicit contract with users that includes consequences of meeting or missing the objectives it contains, and offers exactly this diagnostic: ask what happens if the target is not met. If there is no explicit consequence, it is almost certainly an SLO being described, not an SLA.

- **A.** Both SLAs and SLOs are commonly expressed as availability percentages; the numeric form tells you nothing about whether a consequence is attached.
- **B.** Scope of application does not distinguish the two; an SLO can be platform-wide or team-specific, and what makes something an SLA is the presence of a contractual consequence, not its scope.
- **C.** Correct. This is the SRE book's own stated test: an SLA is an explicit or implicit contract that includes consequences of meeting or missing the objectives it contains.
- **D.** A provider can set internal SLOs of its own with no customer-facing consequence attached, so who sets the number does not settle whether it is an SLA.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.service-level-agreement](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.service-level-agreement)

### 38. B

*sysadmin.system-administration.etc-sudoers-and-visudo · System Administration Fundamentals :: System Administration · depth 5 · application*

`visudo` locks the file against simultaneous edits, runs an editor, then parses the result and refuses to install it if there is a syntax error — printing the offending line and offering to re-edit. A plain editor has no such check, and a broken sudoers file makes `sudo` refuse its entire policy for everyone.

- **A.** The validation step is the substantive purpose; a plain editor with highlighting would still allow an unparseable file to be saved and installed.
- **B.** Correct. Because a broken sudoers file makes `sudo` refuse the whole policy, `visudo` checks the result before it ever takes effect.
- **C.** Sudoers is a plain-text policy file; `visudo`'s role is validating syntax, not encrypting the file's contents.
- **D.** The file can be opened by any editor; nothing technically prevents that. The reason to avoid it is the lack of a safety check before saving.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-sudoers-and-visudo](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-sudoers-and-visudo)

### 39. C

*devops.devops-basics.devops · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

DevOps is a culture and operating model first: one team owns delivery end to end. A full toolchain run by a separate operations group that still receives handoffs is automation without the ownership change that defines the practice.

- **A.** This is the most common wrong answer the guide warns about: framing DevOps as a toolchain rather than as shared ownership.
- **B.** Coordination without changed accountability leaves the handoff, and the incentive split behind it, untouched.
- **C.** Correct. Ownership of the whole lifecycle is the definition; the toolchain is a means to it, not the thing itself.
- **D.** The slower feedback loop is a consequence of the handoff, not an independent reason the team fails the definition.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.devops](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.devops)

### 40. C

*linux.command-line.who-is-logged-in · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

`whoami` reports the effective user, so inside `sudo -i` it says `root` no matter who started the session. `who am i`, or `logname`, reports the original login name from the utmp record, which is the whole point of an accountability question.

- **A.** `id -u` reports the effective UID of the current shell — 0 for root after `sudo -i` — not the original login account.
- **B.** `whoami` has no caching; running it again after `sudo -i` still reports the effective user, `root`, not the original login.
- **C.** Correct. `whoami` reports the effective user, which is `root` after `sudo -i` regardless of who started the session; `who am i` (or `logname`) reports the login identity from the utmp record instead.
- **D.** `w`'s header reports the current time, uptime and system-wide load, not a designated "original login" account; it lists every current session's user rather than singling one out.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.who-is-logged-in](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.who-is-logged-in)

### 41. A

*cloud.cloud-computing.vendor-lock-in · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · application*

Portable layers — containers, an orchestrator, standard SQL, open protocols, declarative infrastructure — reduce the technical component of lock-in by keeping the application itself movable. They do nothing, however, about data gravity, the egress cost of actually moving stored data, or the operational expertise a team accumulates around whichever platform it operates day to day, so choosing portable technology narrows lock-in without eliminating it.

- **A.** Correct. The guide states this directly: portable layers reduce technical portability barriers but leave the other sources of lock-in untouched.
- **B.** This overstates what portability buys; even with fully portable code, the data itself and the team's accumulated platform-specific knowledge still create real costs of leaving.
- **C.** Moving back to on-premises would still involve the same data-volume, egress and re-tooling costs the guide describes; portability lowers the technical barrier, not the cost to zero.
- **D.** Standard SQL is deliberately provider-neutral; the actual limitation is that portability layers do not address data gravity or accumulated expertise, not that standard SQL is somehow tied to one vendor.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.vendor-lock-in](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.vendor-lock-in)

### 42. D

*security.security.ssh-hardening · Security Fundamentals :: Security · depth 5 · application*

Disabling `PasswordAuthentication` is not by itself sufficient to stop password entry: `KbdInteractiveAuthentication` defaults to `yes`, and on a PAM-backed system that path can still prompt for a password. A real baseline sets both to `no`.

- **A.** Changes take effect when the daemon reloads its configuration; a reboot is not required, and the running session is unaffected only until that reload happens.
- **B.** `PermitRootLogin prohibit-password` only governs root's login method; it does not override the `PasswordAuthentication` setting for ordinary named accounts.
- **C.** Whether a client has a key pair does not change what the server's `sshd_config` permits; the server is still offering a password path because that directive is separately enabled.
- **D.** Correct. Turning off `PasswordAuthentication` alone is not sufficient, since the keyboard-interactive path defaults to `yes` and can still supply a password prompt through PAM.

Study it: [04-security/security.md#c-security.security.ssh-hardening](../study-guide/04-security/security.md#c-security.security.ssh-hardening)

### 43. C

*sysadmin.system-administration.kernel · System Administration Fundamentals :: System Administration · depth 3 · application*

Installing a kernel package changes what is on disk — a new image under `/boot` and new modules under `/lib/modules/<version>/` — but not what is currently running. `uname -r` continues to report the previously booted kernel until the machine actually reboots into the new one.

- **A.** Installing a kernel package changes files under `/boot` and `/lib/modules`; it does not swap the kernel actually running in memory until the next reboot.
- **B.** `uname -r` reports the kernel release specifically; the distribution release is reported separately by `/etc/os-release`.
- **C.** Correct. The newly installed kernel takes effect only after a reboot; until then the running kernel, and therefore `uname -r`'s output, is whatever was booted before the install.
- **D.** Multiple kernel versions coexisting on disk is normal and expected — each has its own image and module directory, selectable from the bootloader menu.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.kernel](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.kernel)

### 44. B

*linux.linux-operating-system.desktop-environments · Linux Fundamentals :: Linux Operating System · depth 2 · recall*

A desktop environment — window manager, panel, file manager, settings, and default applications — is a coherent product whose choice is independent of the distribution. Most major distributions ship several as installable options, so a fixed distribution-to-desktop mapping does not hold.

- **A.** Desktop environment choice runs on top of a display server and is independent of the kernel entirely; nothing about it is fixed at that layer.
- **B.** Correct. The guide names this directly as a distractor-heavy question style precisely because that fixed one-to-one mapping does not actually hold.
- **C.** Ubuntu ships official spins with different desktop environments (GNOME by default, others via spins), which is itself a counterexample to a single fixed answer.
- **D.** This restates the very assumption the guide flags as unreliable — most major distributions offer more than one installable desktop environment.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.desktop-environments](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.desktop-environments)

### 45. C

*pm.project-management.project-closure-and-lessons-learned · IT Project Management Fundamentals :: Project Management · depth 3 · discrimination*

Closure formally ends a project — confirming acceptance, releasing resources, and recording lessons — and it applies to a cancelled project as much as a finished one, arguably more, since the lessons are the only thing a cancelled effort produced. That is a different kind of omission from a missed Sprint Retrospective, which repeats every Sprint for one team while work continues and directs its improvement inward, not outward to the organisation.

- **A.** The definition applies to cancelled projects at least as much as finished ones; skipping it on cancellation is the exact failure mode the exam tests.
- **B.** The Retrospective repeats every Sprint for one team while work continues; its absence here is a separate, smaller loss than skipping closure, which never happened once for the whole project.
- **C.** Correct. Closure is a process, not a reward for finishing; arguably a cancelled project's lessons matter more, since they're the only thing it produced — a missed Retrospective, by contrast, only costs one team one Sprint's worth of process improvement.
- **D.** A tracker records individual items and their states; it isn't the acceptance, handover and organisation-wide lessons record that closure produces.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.project-closure-and-lessons-learned](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.project-closure-and-lessons-learned)

### 46. B

*sysadmin.system-administration.pid-and-ppid · System Administration Fundamentals :: System Administration · depth 3 · recall*

The kernel starts PID 1 first — the init system — and it becomes the ancestor of everything else. When a process's parent dies before it does, the kernel re-parents it to PID 1 rather than terminating it. `ps -ef` prints PID and PPID side by side, and `pgrep` finds PIDs by name or attribute.

- **A.** PID 1 is a user-space init process, not the kernel, and an orphan is re-parented rather than killed outright.
- **B.** Correct. The kernel starts PID 1 first and reassigns any orphan to it, which is why PID 1 always shows up as the ultimate ancestor in a process tree.
- **C.** PID number assignment has nothing to do with scheduling priority; PID 1 is fixed as the first process the kernel starts.
- **D.** Orphaning and becoming a zombie are different outcomes — an orphan is re-parented and continues running; a zombie has already exited.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.pid-and-ppid](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.pid-and-ppid)

### 47. C

*cloud.networking.virtual-private-cloud · Cloud Computing Fundamentals :: Networking · depth 3 · discrimination*

A virtual private cloud is the outermost isolation boundary in this competency: two of them cannot reach each other at all until an explicit peering connection or private link joins them.

- **A.** The block here is architectural, not a filtering rule — no security group or network ACL is even in play until the networks are connected.
- **B.** Region alignment does not create a route between separate networks; only an explicit peering connection or private link does.
- **C.** Correct. Isolation between separate virtual networks is complete by default; nothing routes between them without an explicit connection.
- **D.** Shared addressing between two subnets in different networks is not itself a route — reachability across networks needs peering or a private link, not matching ranges.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.virtual-private-cloud](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.virtual-private-cloud)

### 48. A

*devops.git-concepts.merge · DevOps Fundamentals :: Git Concepts · depth 3 · application*

"Merging always creates a merge commit" is false and is a plausible-sounding distractor precisely because it is true in the more visible, diverged case. When the current branch's tip is already an ancestor of the commit being merged, Git fast-forwards the pointer and creates no merge commit at all; `--no-ff` is the option that forces one anyway.

- **A.** Correct. Because `main`'s tip is already an ancestor of the commit being merged, Git fast-forwards: it moves the pointer forward and there is nothing to combine, so no merge commit is needed.
- **B.** That outcome only happens when the two histories have genuinely diverged; here `main` never moved, so there is nothing for a merge commit to combine.
- **C.** Replaying commits as new objects with new hashes is what `git rebase` does; `git merge` never rewrites existing commits, on a fast-forward or otherwise.
- **D.** A pull request is a hosting-platform review wrapper with no effect on local Git behaviour; `git merge` runs and completes locally regardless of whether one exists.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.merge](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.merge)

### 49. C

*sysadmin.system-administration.root-and-least-privilege · System Administration Fundamentals :: System Administration · depth 3 · application*

Least privilege is about granting the smallest privilege sufficient for the task, for the shortest time. An all-afternoon `sudo -i` session holds full root authority for as long as `su -` would, so the choice of command does not by itself satisfy the principle.

- **A.** `sudo -i` opens a shell, and commands run inside it are not individually logged the way single-command invocations are — logging is not what the principle is measuring here in any case.
- **B.** Which password authenticates the session is a separate question from how much privilege is then held and for how long.
- **C.** Correct. The principle concerns the scope and duration of the privilege actually held, and an extended root shell is the same exposure regardless of the command that started it.
- **D.** Authentication speed has nothing to do with the least-privilege principle; the issue is the breadth and duration of access held.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.root-and-least-privilege](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.root-and-least-privilege)

### 50. B

*security.sensitive-data.access-control-models · Security Fundamentals :: Sensitive Data · depth 3 · application*

RBAC attaches permissions to roles instead of individual identities, so churn in headcount does not multiply into per-object grants — a maintenance-cost argument, and the common organisational choice for anything with meaningful headcount. It is not automatically more secure than DAC in the abstract, a data label is not a substitute for an access-granting mechanism, and a Unix group remains a discretionary construct under the owner's control rather than an administered role.

- **A.** Roles are administered rather than owner-discretionary, but that is a maintenance property, not a security guarantee over DAC by itself.
- **B.** Correct. RBAC's argument is a scalability argument about maintenance cost, not an inherent security claim over DAC in the abstract.
- **C.** A label tells an enforcement mechanism what to enforce; it does not itself replace the work of granting and revoking access.
- **D.** A Unix group is a DAC construct — the file's owner still decides what the group may do with it — and is not the same mechanism as administered role assignment.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.access-control-models](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.access-control-models)

### 51. B

*linux.linux-operating-system.gui-vs-cli · Linux Fundamentals :: Linux Operating System · depth 3 · application*

A CLI session needs only a shell and a terminal or SSH connection — no display server or desktop environment, which would otherwise consume memory and CPU the server has no other use for. CLI is also scriptable and remotable in ways a GUI is not.

- **A.** GUI versus CLI names the interface paradigm as a whole; the shell is a specific CLI-side program and its existence does not by itself rule out a GUI running elsewhere on the machine.
- **B.** Correct. The guide expects this reasoning specifically — scriptability, remotability, and resource cost — not merely the fact that servers 'don't have GUIs.'
- **C.** A CLI session needs only a shell and a terminal, or an SSH connection carrying one — no display server required, which is exactly why CLI works on a headless machine.
- **D.** A GUI can run on a server if a display server and desktop stack are installed; the real justification is cost and scriptability, not technical impossibility.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.gui-vs-cli](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.gui-vs-cli)

### 52. D

*sysadmin.system-administration.runlevel · System Administration Fundamentals :: System Administration · depth 3 · discrimination*

Runlevels were mutually exclusive under SysV init — the system was in exactly one at a time. Targets compose: `graphical.target` does not replace `multi-user.target`, it pulls it in, so several targets are active together. That is why the runlevel-to-target mapping is approximate rather than a straightforward rename. The `runlevel` command still prints the previous and current SysV runlevel on systems that track it.

- **A.** The mapping is explicitly approximate, not a rename, precisely because the exclusivity assumption behind runlevels does not hold for targets.
- **B.** This reverses the actual relationship; it is targets that compose and can be active together, not runlevels. `isolate` is an operation an administrator chooses to invoke, not evidence that targets are mutually exclusive by nature.
- **C.** Composability is not limited to those two special targets — `graphical.target` and `multi-user.target` coexist too, since one pulls in the other.
- **D.** Correct. This is the structural reason the runlevel-to-target mapping loses information: a single exclusive state maps onto a set of targets that can coexist.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.runlevel](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.runlevel)

### 53. C

*cloud.performance-availability.auto-scaling · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · application*

An auto-scaling group is also an availability mechanism: it monitors member health and replaces any instance found unhealthy or terminated unexpectedly, holding the group's desired capacity without human intervention.

- **A.** Health-based replacement is automatic by design; the whole point is that an instance failure is repaired without a person being paged.
- **B.** The configured maximum is a guardrail set deliberately; an unexpected termination does not change it, only the count of running instances within it.
- **C.** Correct. Documented health-based replacement means an unexpectedly terminated or impaired instance is replaced automatically to maintain desired capacity.
- **D.** That describes a cross-site mechanism; a scaling group's own response to a lost member is to replace it within the same group, not to redirect elsewhere.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.auto-scaling](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.auto-scaling)

### 54. B

*pm.software-application-architecture.nosql-database · IT Project Management Fundamentals :: Software Application Architecture · depth 3 · discrimination*

The comparison's separating axis is where structure is enforced: a session fetched whole by one key with no joins is the textbook NoSQL fit, while a relational database would enforce a schema and offer join and cross-table transaction guarantees this workload never uses.

- **A.** Relational strength is joins and cross-table transactions; a workload with no joins and one lookup key gains nothing from either and pays declared-schema overhead for no benefit.
- **B.** Correct. No cross-entity joins and a single-key lookup are exactly the shape a document/key-value store optimises for, at the cost of the schema and join guarantees it doesn't offer.
- **C.** NoSQL is a category defined by rejecting the relational tables-and-joins model, not a faster drop-in replacement for it.
- **D.** Nothing here describes a producer-consumer handoff; the requirement is a fast lookup by key, which a queue is not built to serve.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.nosql-database](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.nosql-database)

### 55. D

*sysadmin.system-administration.swap · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Swap usage is a diagnostic signal that is easy to misread. Some swap in use is normal, since the kernel evicts genuinely idle pages to free RAM for cache; what actually indicates trouble is a high rate of swap-in and swap-out happening now, which `free`'s repeated sampling (`-s`) shows better than a single snapshot.

- **A.** Some swap usage is normal — the kernel pages out genuinely idle memory to free RAM for cache — and does not by itself indicate a shortage.
- **B.** free(1) reports swap from SwapTotal and SwapFree in `/proc/meminfo`, which the kernel keeps current on every read; the difficulty is interpreting a non-zero figure, not the accuracy of the tool.
- **C.** Disabling swap does not remove memory pressure; it converts a slow, swapping system into one where the kernel's out-of-memory killer terminates a process instead.
- **D.** Correct. A non-zero swap-used figure only shows that some memory was paged out at some point; the actual warning sign is a sustained non-zero `si`/`so` in `vmstat`, which are per-second rates of paging in and out rather than a standing level.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.swap](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.swap)

### 56. B

*devops.git-concepts.working-directory-staging-area-and-repository · DevOps Fundamentals :: Git Concepts · depth 3 · application*

`git status` reports the working tree, the staging area and the repository in plain words: "Changes to be committed" is the index, "Changes not staged for commit" is the working tree, and "Untracked files" are paths Git has never seen. `git add` copies a file's content as it is at that instant, which is why editing again afterward leaves that file listed under both of the first two headings at once.

- **A.** `git add` snapshots content at that instant rather than registering the file for continuous tracking, so later edits are not automatically folded in.
- **B.** Correct. `git add` copies content into the index at the instant it runs; edits made afterwards are a further difference between the working tree and that already-staged snapshot.
- **C.** Untracked means Git has never been told about the path at all; this file was already staged once, so it cannot fall back to untracked by being edited again.
- **D.** `git status` compares all three states against each other — working tree, index and HEAD — so a staged-then-re-edited file shows up under both headings at once.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.working-directory-staging-area-and-repository](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.working-directory-staging-area-and-repository)

### 57. D

*security.sensitive-data.encryption-key-management · Security Fundamentals :: Sensitive Data · depth 2 · application*

Rotation in practice usually means envelope encryption: a data-encryption key protects the data directly, and a key-encrypting key protects that data-encryption key. Rotating the outer key re-wraps the inner one without re-encrypting a byte of the data itself, which is exactly what lets the outer key rotate on a quarterly schedule at negligible cost.

- **A.** This is precisely what envelope encryption is designed to avoid; rotating the outer key deliberately does not require touching the data it indirectly protects.
- **B.** The scenario states the data is protected by an encryption key hierarchy, not that it was replaced by a token — pseudonymization is a different technique entirely.
- **C.** Nothing in the scenario places the data in transit, and the explanation for cheap rotation is envelope encryption's structure, not which state the data happened to be in.
- **D.** Correct. SP 800-57 defines a key-encrypting key as exactly that: a key used to encrypt or decrypt other keys, which is what makes this rotation cheap.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.encryption-key-management](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.encryption-key-management)

### 58. C

*linux.linux-operating-system.storage-devices · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`lsblk` presents whole disks as parents and partitions as children in its hierarchy. Treating a partition row like `sda1` as the whole disk `sda` means acting on the wrong device — a common, testable misreading.

- **A.** Reboot data loss is a property of volatile RAM, not of a storage partition; `sda1` persists across reboots like any other block device.
- **B.** `-f` reveals filesystem type and UUID, which are absent from the default columns, but that omission is a different mistake than confusing a partition with its parent disk.
- **C.** Correct. The guide names this specific misreading: treating a partition row as if it were the whole disk and acting on the wrong device.
- **D.** A partition and its parent disk are not identical; the parent spans the whole device while a partition is one region of it, so operations differ in scope.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.storage-devices](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.storage-devices)

### 59. C

*cloud.performance-availability.load-balancing · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · discrimination*

Balancers operate either at the transport layer, forwarding connections without inspecting them, or at the application layer, where content such as hostname, path or header can drive the routing decision — the two examples in the stem are exactly that pair.

- **A.** Both examples described are load balancers acting on every request; failover is the separate, failure-triggered mechanism neither example describes.
- **B.** Nothing about layer 4 versus layer 7 routing determines whether traffic originates internally or externally; both can serve either source.
- **C.** Correct. Layer 4 forwards connections without inspecting them; layer 7 reads application-layer content such as the path to make its routing decision.
- **D.** Sticky sessions are a workaround for stateful applications and apply independently of which layer the balancer operates at.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.load-balancing](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.load-balancing)

### 60. A

*sysadmin.troubleshooting.structured-troubleshooting-method · System Administration Fundamentals :: Troubleshooting · depth 4 · diagnostic*

Each step in the method gates the next, and a negative test is itself informative: it rules out one candidate cause and the fix that went with it, and sends the investigation back to theory formation rather than forward to implementation. Reaching for `journalctl -u` or any other command at this point does not change what a failed test means.

- **A.** Correct. A negative test eliminates a candidate cause without settling the fault itself, so the next step is a new theory, not a fix.
- **B.** This is the trap the method exists to prevent: implementing a fix for a theory that just failed its test cannot be verified against anything and wastes the elimination.
- **C.** A negative test result says nothing about blast radius; that is a separate technique with its own comparison case.
- **D.** One eliminated theory is not an authority or competence boundary; escalation is triggered by those limits, not by an ordinary negative result.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.structured-troubleshooting-method](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.structured-troubleshooting-method)

