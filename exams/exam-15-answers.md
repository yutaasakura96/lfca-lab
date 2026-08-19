<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 15 — answers

### 1. B

*sysadmin.disaster-recovery.backup · System Administration Fundamentals :: Disaster Recovery · depth 3 · discrimination*

A backup is an independent copy kept so data can be restored after loss, corruption or deletion. Replication and RAID both keep a second copy live, and both apply the destructive operation to that copy as faithfully as to the first. Common tools for taking that independent copy are `tar` for archiving and `rsync` for file-level copies.

- **A.** Replication faithfully copies deletions to every target, so adding targets multiplies the deletion rather than escaping it.
- **B.** Correct. A backup is a separate copy taken at a point in time, so a deletion made after it does not reach it.
- **C.** RAID protects against disk failure, not against a delete the filesystem was asked to perform.
- **D.** A common belief, and the reason this pair is examinable: replication gives availability, not recoverability.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.backup](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.backup)

### 2. B

*cloud.best-practices.documentation-and-tagging-standards · Cloud Computing Fundamentals :: Best Practices · depth 2 · discrimination*

A tag can be used as a condition in an access policy, but it is not itself an isolation boundary — accounts, subscriptions or projects are, which is the boundary distinction this competency draws explicitly.

- **A.** Tags are used as access-policy conditions, not as an isolation mechanism, and are not a substitute for a separate account or project boundary.
- **B.** Correct. Tags are metadata a policy can reference; they are not a security or blast-radius boundary on their own.
- **C.** Even paired with a policy, the tag remains a condition the policy references, not an isolation boundary in its own right.
- **D.** Accounts, subscriptions and projects are the isolation boundaries named for this purpose; a VPC is a network construct within one of those, not the only option.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.documentation-and-tagging-standards](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.documentation-and-tagging-standards)

### 3. C

*linux.command-line.awk · Linux Fundamentals :: Command Line · depth 3 · discrimination*

awk reads input one record at a time, splits it into fields, and its default field separator is a run of whitespace with leading and trailing whitespace ignored — exactly why `awk '{print $3}'` correctly picks a column even when the spacing is ragged, which sed and `cut` cannot do as naturally. Run with no field reference at all, plain `awk` still applies its pattern-action pairs to every input record.

- **A.** sed operates on the line as an undivided string for substitution and deletion; it has no native concept of numbered fields the way awk does.
- **B.** awk and sed differ specifically on whether the unit of work is fields or the whole line, which is exactly why one fits a columnar task and the other does not.
- **C.** Correct. awk works on the record split into fields — `$1`, `$3`, `$NF` — and its default field separator is a run of whitespace, which is exactly why ragged columns still line up correctly.
- **D.** `cut` splits on a single fixed delimiter character, so repeated spaces each count as a separate delimiter and produce empty fields on ragged columnar output.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.awk](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.awk)

### 4. D

*security.compliance.consent-and-lawful-basis · Security Fundamentals :: Compliance · depth 1 · recall*

Article 4(11) defines consent as any freely given, specific, informed and unambiguous indication of the data subject’s wishes, signified by a statement or by a clear affirmative action. Recital 32 spells out the consequence: silence, pre-ticked boxes or inactivity do not constitute consent. Article 6(1)(a) makes consent one of six lawful bases but does not itself set the validity bar.

- **A.** Recital 32 names silence, pre-ticked boxes and inactivity as things that do not constitute consent, so no affirmative action was taken here.
- **B.** Contract is one of the six lawful bases in Article 6(1), but marketing is not necessary to perform the purchase, and the question asks about consent in any case.
- **C.** Naming a supervisory authority has nothing to do with whether consent was validly obtained; the defect here is the pre-ticked box itself.
- **D.** Correct. Article 4(11) sets those four conditions and requires a statement or clear affirmative action, and Recital 32 says silence, pre-ticked boxes or inactivity do not constitute consent.

Study it: [04-security/compliance.md#s-compliance-obligations](../study-guide/04-security/compliance.md#s-compliance-obligations)

### 5. A

*devops.containers.image-layers · DevOps Fundamentals :: Containers · depth 2 · recall*

`RUN`, `COPY`, and `ADD` add filesystem content and are the layer-producing instructions in the ordinary case; `WORKDIR` is the exception that looks like metadata but also creates a directory, while `ENV`, `LABEL`, `EXPOSE`, and `CMD` record configuration only.

- **A.** Correct. `COPY` and `RUN` write content directly, and `WORKDIR` is the metadata-looking instruction that also creates a directory when needed.
- **B.** `WORKDIR` looks like metadata but creates its target directory when that directory does not already exist, which is a real filesystem change.
- **C.** `ENV` and `CMD` write configuration metadata with no filesystem content, and `FROM` selects a base rather than adding a layer of its own.
- **D.** Caching applies to every instruction, but only some of them change the filesystem; `ENV` and `CMD` cache metadata, not filesystem content.

Study it: [05-devops/containers.md#c-devops.containers.image-layers](../study-guide/05-devops/containers.md#c-devops.containers.image-layers)

### 6. B

*pm.open-source-software-and-licensing.license-compliance · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 2 · recall*

Compatibility and compliance are routinely offered as each other's distractor. Compatibility asks whether the combination was permitted; compliance asks whether the obligations that combination triggered were actually met when the product shipped.

- **A.** They answer different questions: one is about whether the combination was allowed, the other about whether the resulting obligations were met.
- **B.** Correct. A perfectly compatible stack is still non-compliant if the required attribution file or source offer was never assembled.
- **C.** An inventory makes the obligations enumerable; it does not discharge any of them on its own.
- **D.** Compatibility says the combination is permitted; it does nothing to automatically assemble the notices each licence separately requires.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.license-compliance](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.license-compliance)

### 7. A

*sysadmin.disaster-recovery.off-site-and-geographic-redundancy · System Administration Fundamentals :: Disaster Recovery · depth 2 · recall*

The requirement is keeping copies or capacity far enough away that one physical event cannot destroy both. Fire resistance raises the threshold but does not create distance — flood, building collapse or a site-wide loss defeats it.

- **A.** Correct. Distance is the requirement, and a safe in the same building provides none.
- **B.** Media type is a separate requirement from location and is not what the safe fails.
- **C.** Testing is a real obligation but is not the one the storage location bears on.
- **D.** Expiry is a policy matter independent of where media is kept.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.off-site-and-geographic-redundancy](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.off-site-and-geographic-redundancy)

### 8. A

*cloud.best-practices.well-architected-review · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

A review walks the workload through questions grouped by pillar and produces a prioritised list of improvements and the tradeoffs between pillars — more redundancy costs more, tighter security can cost latency — because it is an improvement exercise, not an audit or a certification.

- **A.** Correct. Nothing is issued at the end of a review except findings and the tradeoffs between pillars.
- **B.** A review is not pass/fail and issues no certification; it produces findings for the team to act on.
- **C.** Recovery time targets are set separately from a pillar review, which produces broader architectural findings instead.
- **D.** SLA attestation is a separate contractual matter and is not something a well-architected review issues.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.well-architected-review](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.well-architected-review)

### 9. D

*sysadmin.disaster-recovery.rpo · System Administration Fundamentals :: Disaster Recovery · depth 3 · discrimination*

The recovery point objective looks backwards to the last good copy and therefore dictates backup frequency. The recovery time objective looks forwards to service restoration and therefore dictates recovery method and standby capacity. Reversing them is the classic mistake.

- **A.** This swaps the two, which is the single most common error on this pair.
- **B.** Backup frequency follows from the recovery point target but is not what the figure states.
- **C.** That describes an availability budget, which is a different measure entirely.
- **D.** Correct. The recovery point bounds data loss looking backwards; the recovery time bounds the outage looking forwards.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.rpo](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.rpo)

### 10. C

*linux.command-line.cut-sort-uniq-and-wc · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`sort -u` and `uniq -u` mean opposite things: `sort -u` keeps one copy of every distinct line, including ones that repeated, while `uniq -u` keeps only lines that never repeated — both require sorted input, but they answer different questions.

- **A.** Even on sorted input the two select differently: `sort -u` keeps one copy of every line including repeats, while `uniq -u` drops every line that repeated at all.
- **B.** `uniq -u` prints no counts; `uniq -c` is the option that prefixes counts, a separate flag from `-u`.
- **C.** Correct. `sort -u` discards duplicates as it sorts, keeping one instance of every line including ones that repeated; `uniq -u` instead keeps only the lines that appeared exactly once, an opposite selection despite the shared word "unique."
- **D.** `sort -u` is a self-contained option on `sort` that discards duplicates as it orders lines; it has no dependency on `uniq` running beforehand.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.cut-sort-uniq-and-wc](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.cut-sort-uniq-and-wc)

### 11. C

*security.compliance.gdpr · Security Fundamentals :: Compliance · depth 3 · application*

GDPR's Chapter V restricts transferring personal data to third countries through an adequacy decision, appropriate safeguards, or a specific derogation. It does not require data to stay in the EU, so a lawful transfer mechanism still allows the data to leave.

- **A.** GDPR contains no general data-localisation rule; Chapter V governs conditions for transferring data out, not a blanket requirement to keep it in.
- **B.** GDPR is a directly applicable regulation, a statute, not a contractual standard, and conflating the two mischaracterises both frameworks.
- **C.** Correct. GDPR imposes no general localisation rule; Chapter V restricts third-country transfers rather than forbidding them outright.
- **D.** Residency is where data physically sits; sovereignty also depends on whose law the hosting operator itself answers to, which an EU region alone does not settle.

Study it: [04-security/compliance.md#c-security.compliance.gdpr](../study-guide/04-security/compliance.md#c-security.compliance.gdpr)

### 12. D

*sysadmin.networking.dns-resolution-order · System Administration Fundamentals :: Networking · depth 3 · application*

`getent hosts` performs a lookup through the same name service switch an application uses, including `/etc/hosts` and any resolver plugin named on the `hosts:` line, while `dig`, `nslookup` and `host` build a DNS query and send it straight to a nameserver, bypassing the switch entirely.

- **A.** `/etc/hosts` is not being ignored; it is consulted by the name service switch that applications use, which `dig` specifically bypasses, explaining the disagreement.
- **B.** `nslookup`, like `dig`, queries DNS directly and does not consult `/etc/hosts` or the name service switch at all.
- **C.** `host`, like `dig` and `nslookup`, queries a nameserver directly; its terse output format has no relationship to whether it consults the name service switch.
- **D.** Correct. `dig` builds a DNS query and sends it straight to a nameserver, never consulting `/etc/hosts` or nsswitch, which is exactly why it can disagree with what applications resolve.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dns-resolution-order](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dns-resolution-order)

### 13. A

*devops.containers.kubernetes-service · DevOps Fundamentals :: Containers · depth 3 · application*

"The frontend cannot reach the backend after a redeploy" is the archetypal scenario caused by addressing pods directly instead of through a Service, which tracks the set of matching, ready pods automatically and gives callers a name that never changes.

- **A.** Correct. A Service exists precisely because pod IPs are ephemeral; addressing through it means a redeploy never breaks the caller.
- **B.** Pod IPs are assigned fresh on each replacement and are not something a Deployment can pin to a fixed value across redeploys.
- **C.** Even a single-replica Deployment gets a new pod, and therefore a new IP, every time that pod is replaced; replica count does not stabilise the address.
- **D.** A volume solves data persistence, not address stability; nothing about a shared volume tracks which pods are currently ready to serve traffic.

Study it: [05-devops/containers.md#c-devops.containers.kubernetes-service](../study-guide/05-devops/containers.md#c-devops.containers.kubernetes-service)

### 14. C

*cloud.budgeting.on-demand-reserved-and-spot-pricing · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

Matching a workload to a purchase option turns on what it can tolerate, not on price alone: the worker fleet tolerates interruption and belongs on spot, while the database's steady, long-lived baseline is exactly what a reserved commitment is priced for.

- **A.** Cost estimation before deployment is a pricing calculator's job and has nothing to do with which purchase option fits a workload's tolerance for interruption or commitment.
- **B.** Reserved buys price with a loss of flexibility, not with immunity from interruption; nothing about a term commitment suits work that is fine being interrupted.
- **C.** Correct. Interruptible, re-queueable work is the textbook spot case; a steady multi-year baseline is exactly what reserved pricing is priced for.
- **D.** Spot is a discount tied to interruption risk on the same instance types as on-demand, not a smaller size — sizing is a separate, unrelated practice.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.on-demand-reserved-and-spot-pricing](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.on-demand-reserved-and-spot-pricing)

### 15. B

*linux.command-line.file-type-and-metadata · Linux Fundamentals :: Command Line · depth 3 · application*

`ls -l` shows `mtime` by default; `ls -lc` shows `ctime` and `ls -lu` shows `atime`. The three timestamps are `atime` (last read), `mtime` (last content change) and `ctime` (last inode change).

- **A.** `ls -lc` shows `ctime`, the inode change time, not `atime`; the mnemonic in the option name does not match what the flag actually selects.
- **B.** Correct. `ls -l` shows `mtime` by default, and `-u` switches the displayed timestamp to `atime`, the last read time.
- **C.** `ls -l` shows `mtime` — the last content modification — by default, not `atime`.
- **D.** GNU `stat -f` switches to reporting on the filesystem itself, an unrelated mode that does not produce a per-file access-time listing.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-type-and-metadata](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-type-and-metadata)

### 16. B

*pm.open-source-software-and-licensing.mit-and-bsd-licenses · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

BSD-3-Clause adds a third clause on top of BSD-2-Clause's notice, conditions and disclaimer requirements, forbidding use of the copyright holder's or contributors' names to endorse derived products without permission — which is exactly what this marketing use does.

- **A.** BSD has no NOTICE-file concept at all; that requirement belongs to Apache-2.0, a different permissive licence.
- **B.** Correct. That third clause is what distinguishes BSD-3-Clause from BSD-2-Clause, and naming the company as a partner without permission is the textbook violation of it.
- **C.** The non-endorsement clause exists precisely to restrict this kind of marketing use of the original author's name.
- **D.** BSD imposes no such reach into the derivative's own licence; that would be a copyleft-style condition BSD does not carry.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.mit-and-bsd-licenses](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.mit-and-bsd-licenses)

### 17. D

*sysadmin.networking.ipv4-address · System Administration Fundamentals :: Networking · depth 3 · discrimination*

MAC identifies an interface on one link and is replaced at every router; IPv4 and IPv6 addresses identify the internetwork endpoint and survive every hop, differing from each other only in address size and notation, not in that role.

- **A.** A MAC address is rewritten by every router the packet passes through, because it only has meaning within one link, not across the whole path.
- **B.** IPv4 addresses are preserved end to end exactly like IPv6 addresses; IPv6 was introduced because of address exhaustion, not because IPv4 gets rewritten in transit.
- **C.** Routers do not assign a new connection identifier per hop; IP addresses are what remains constant across the whole path from source to destination.
- **D.** Correct. IP addressing scopes to the whole internetwork and survives every hop, while a MAC address only identifies an interface on one link and is replaced by each router along the way.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ipv4-address](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ipv4-address)

### 18. A

*sysadmin.networking.network-interface-naming · System Administration Fundamentals :: Networking · depth 3 · application*

A firewall rule, a route or a network configuration file that names the wrong interface fails silently, and writing configuration against `eth0` from habit without checking is exactly that trap — on a predictable-naming system there is usually no such interface, and `ip link` is the only reliable way to find out what the system actually uses.

- **A.** Correct. Writing configuration against `eth0` from habit without checking is a documented mistake, since predictable names such as `enp0s3` are derived from hardware topology instead, and `ip link` is the only reliable way to find out what the system actually uses.
- **B.** `eth0`-style names are not reserved or forbidden; they are simply the older, detection-ordered convention that predictable naming was introduced to replace, and they can still appear if predictable naming is disabled.
- **C.** Moving hardware does not regenerate MAC addresses; the actual issue is that the interface's name itself changed under the predictable-naming scheme, unrelated to any change in its MAC address.
- **D.** `net.ifnames=0` would restore `eth0`-style names, not disable references to them; the scenario describes the opposite situation, moving to hardware that uses predictable naming instead.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.network-interface-naming](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.network-interface-naming)

### 19. D

*security.compliance.licensing-compliance · Security Fundamentals :: Compliance · depth 2 · application*

Permissive licences make attribution travel with the code. MIT's whole condition is that the copyright notice and the permission notice be included in all copies or substantial portions of the software, and stripping them breaks that condition regardless of any other licence's separate rules.

- **A.** MIT is permissive, not condition-free; its whole condition is that the copyright and permission notices travel with the code.
- **B.** The library here is MIT-licensed, a permissive licence with no copyleft source-provision duty; that obligation belongs to licences such as the GPL.
- **C.** The library is MIT-licensed, not Apache-licensed, so Apache 2.0's file-marking condition was never applicable here.
- **D.** Correct. MIT's entire condition is that these notices travel with the code in every copy or substantial portion distributed.

Study it: [04-security/compliance.md#c-security.compliance.licensing-compliance](../study-guide/04-security/compliance.md#c-security.compliance.licensing-compliance)

### 20. B

*cloud.budgeting.total-cost-of-ownership · Cloud Computing Fundamentals :: Budgeting · depth 1 · recall*

Total cost of ownership is the full cost of delivering a capability, not just the invoice or sticker price. A comparison that sets a cloud bill against a bare purchase price is a TCO error because it drops the staffing, power and hardware-refresh costs the on-premises side still carries.

- **A.** CapEx and OpEx are different accounting treatments of spend, not a substitute for costing the full set of expenses on each side of a comparison.
- **B.** Correct. Total cost of ownership is the full cost of a capability, not merely the invoice or sticker price, and a fair comparison must cost both sides the same way.
- **C.** A budget alert notifies when spend already crosses a configured threshold; it does not supply missing cost categories in a one-off comparison exercise.
- **D.** This is precisely the error total cost of ownership exists to catch: a purchase price silently drops staffing, power and refresh costs that only one side of the comparison carries.

Study it: [03-cloud-computing/budgeting.md#s-budgeting-cost-models](../study-guide/03-cloud-computing/budgeting.md#s-budgeting-cost-models)

### 21. D

*linux.command-line.navigating-the-filesystem · Linux Fundamentals :: Command Line · depth 3 · application*

There is no hidden attribute in the filesystem: `ls` simply omits names starting with `.` unless told otherwise. `ls -la` combines the long format with all entries, including dotfiles and the `.`/`..` entries themselves, and would reveal exactly what the plain listing hid.

- **A.** A truly corrupted directory produces a filesystem error, not a clean, silent empty listing; the scenario matches ordinary dotfile hiding instead.
- **B.** Nothing in the scenario suggests two hosts are involved; the question is asking for the local, technical explanation for an empty-looking listing.
- **C.** Plain `ls` prints names without `-l`; the long-format flag changes how much detail is shown, not whether entries appear.
- **D.** Correct. `ls` omits any name starting with a dot by default, so a directory holding only dotfiles looks empty under a plain listing even though it is not.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.navigating-the-filesystem](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.navigating-the-filesystem)

### 22. A

*devops.devops-basics.continuous-deployment · DevOps Fundamentals :: DevOps Basics · depth 3 · application*

Whether an organisation can safely adopt continuous deployment is a question about its test suite and rollback story, not about ambition. Weak coverage paired with no gate is a fault, not a neutral practice.

- **A.** Correct. Weak automated testing plus continuous deployment is exactly the fault the guide names, not a neutral configuration choice.
- **B.** No gate remains anywhere in the description, which is exactly the property that makes this deployment rather than delivery.
- **C.** A documented rollback does not compensate for a test suite that cannot catch what an unattended pipeline needs it to catch.
- **D.** The scenario explicitly reaches production automatically, which is well past where continuous integration's scope ends.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.continuous-deployment](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.continuous-deployment)

### 23. D

*sysadmin.networking.subnet-mask-and-cidr · System Administration Fundamentals :: Networking · depth 3 · application*

A /26 prefix sets 26 leading bits to one, which in dotted-decimal is 255.255.255.192: the first three octets are fully ones, and the last octet has its two most significant bits set, matching the CIDR and dotted-decimal reference table exactly.

- **A.** 255.255.255.128 is the dotted-decimal form of /25, not /26; the last-octet value at /26 is 192, from two set bits rather than one.
- **B.** The prefix length counts leading one-bits across the whole 32-bit address, not a value substituted into a single octet in isolation.
- **C.** 224 in the last octet corresponds to /27, one bit more specific than the /26 given; the extra host bit changes the mask value.
- **D.** Correct. /26 means 26 leading one-bits; the first three octets are entirely ones (255.255.255) and the last octet has its top two bits set, which is 192 in decimal.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.subnet-mask-and-cidr](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.subnet-mask-and-cidr)

### 24. B

*cloud.cloud-computing.container-vs-virtual-machine · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

The Windows appliance needs its own kernel, which only a VM supplies; the regulated workload needs the strongest boundary available, which is a VM's own kernel rather than a shared one; the frequently redeployed stateless service benefits from a container's start time and density, with no foreign-kernel or heightened-isolation requirement working against it. All three still sit on a type 1 hypervisor the provider operates, whether or not the workload itself is containerised.

- **A.** The HTTP service has no foreign-kernel or heightened-isolation requirement; forcing it onto a VM gains nothing and gives up the start-time and density advantage a stateless, frequently redeployed service benefits from.
- **B.** Correct. This matches the guide's own worked scenario precisely: two VM placements for two different reasons, one container placement for density and speed, and virtualization present underneath regardless of the choice.
- **C.** On a managed platform, containers still run atop provider-operated virtual machines; choosing containers does not remove virtualization from the picture, only from what the team administers directly.
- **D.** This reverses the actual isolation ordering; a shared host kernel gives containers a weaker boundary than a VM's own kernel, which is exactly why the regulated workload calls for a VM instead.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.container-vs-virtual-machine](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.container-vs-virtual-machine)

### 25. D

*pm.project-management.deliverable-and-milestone · IT Project Management Fundamentals :: Project Management · depth 3 · discrimination*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

A milestone marks an instant, conventionally with no duration, effort or cost of its own; a schedule line carrying a duration is a task or a phase, however it is labelled. That is a different kind of error from a triple-constraint question, which asks what trades off against what when scope, time or cost changes — sorting deliverables and milestones by type is a categorisation question, not a trade-off question.

- **A.** This treats the entry as already correct and reframes the objection as a scheduling trade-off, which sidesteps the actual defect in the label.
- **B.** Milestones do appear on schedules — as zero-duration markers — so absence from the schedule isn't the objection here.
- **C.** Duration is exactly what disqualifies the entry as a milestone; the acceptance label alone does not exempt it.
- **D.** Correct. Zero duration is the defining property that a two-week span violates; the triple constraint concerns trade-offs between scope, time and cost, a different kind of question entirely.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.deliverable-and-milestone](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.deliverable-and-milestone)

### 26. A

*sysadmin.networking.traceroute · System Administration Fundamentals :: Networking · depth 4 · diagnostic*

Asterisks in the output mean a probe went unanswered, not that traffic stops there; routers routinely deprioritise or block their own ICMP replies while forwarding perfectly, so loss shown at hop 4 that is absent at hops 5 through 9 is exactly that artefact, not a fault — only a failure at the final hop indicates a broken path.

- **A.** Correct. Loss shown at an intermediate hop that is absent at the hops beyond it is an artefact of routers deprioritising their own ICMP replies, not a fault, and reading it as a broken router is a documented trap.
- **B.** Asterisks specifically mean the probe itself went unanswered; the router at that hop can still be forwarding all other traffic normally, which is exactly why the trace continues successfully past it.
- **C.** Re-running with `-I` is a useful step when a trace dies at the first hop entirely, not specifically required to interpret intermediate asterisks when the trace otherwise completes successfully.
- **D.** Traceroute follows a single ongoing path hop by hop; the trace completing past hop 4 does not imply a separate redundant path, it means hop 4 forwarded the later probes normally despite not answering its own.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.traceroute](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.traceroute)

### 27. D

*security.compliance.pci-dss · Security Fundamentals :: Compliance · depth 3 · recall*

PCI-DSS reaches an organisation through the compliance programs of the payment brands and its acquiring bank, not through legislation. The Council publishes this plainly: it does not enforce compliance, and whether an entity is required to comply with or validate compliance to a PCI standard is at the discretion of the organisations that manage compliance programs.

- **A.** The Council states it does not enforce compliance and leaves that to the organisations managing compliance programs, which is not how a statute such as GDPR reaches anyone.
- **B.** Article 3 is GDPR's statutory scope test; PCI-DSS reaches an organisation through a signed merchant agreement, not through legislation with territorial reach.
- **C.** ISO certification is issued by an external certification body; PCI-DSS validation instead runs through self-assessment or a Qualified Security Assessor under the acquirer’s and brands’ programs.
- **D.** Correct. The Council states that it does not enforce compliance and that requiring or validating it is at the discretion of a payment brand, acquirer or other entity managing a compliance program.

Study it: [04-security/compliance.md#c-security.compliance.pci-dss](../study-guide/04-security/compliance.md#c-security.compliance.pci-dss)

### 28. B

*linux.command-line.script-control-flow · Linux Fundamentals :: Command Line · depth 2 · recall*

The shell has no boolean type, and `if` does not evaluate an expression — it runs a command and branches on its exit status, where 0 means "true." That is what makes `if grep -q pattern file; then` a normal, working construct.

- **A.** There is no boolean expression syntax built into `if` itself; it always runs a command and branches on that command's exit status.
- **B.** Correct. The shell has no boolean type; `if` runs a command and branches on its exit status, which is exactly why `if grep -q pattern file; then` is valid — `grep` is the tested command.
- **C.** `if` runs and evaluates its own given command fresh each time, rather than reading a leftover `$?` value from something that ran earlier.
- **D.** The content of the following block has no bearing on whether the `if` branch is taken; that is decided entirely by the tested command's exit status.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.script-control-flow](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.script-control-flow)

### 29. D

*sysadmin.system-administration.boot-process · System Administration Fundamentals :: System Administration · depth 3 · recall*

The ordered handover is: firmware initialises hardware and finds a boot device; the bootloader loads the kernel and an initramfs; the kernel initialises and mounts the real root filesystem; it starts PID 1; and the init system activates units until the default target is reached.

- **A.** Firmware runs first, before any bootloader can be found or executed — this ordering has the first two stages reversed.
- **B.** The bootloader runs before the kernel, not after it — the kernel cannot be loaded until the bootloader has found and loaded it into memory.
- **C.** PID 1 cannot start before the kernel does, since the kernel is what starts PID 1 in the first place — the third and fourth stages are swapped here.
- **D.** Correct. Each stage hands control to the next: firmware finds a boot device, the bootloader loads the kernel, the kernel mounts the real root, and the init system brings up the rest.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.boot-process](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.boot-process)

### 30. C

*cloud.cloud-computing.multi-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

In practice, multi-cloud workloads are either partitioned — simple, but each workload stays dependent on its own provider — or made portable on a common substrate such as containers with an orchestrator, which spreads risk but tends to force a lowest-common-denominator design, giving up the differentiated managed services either provider might otherwise offer.

- **A.** Portability reduces the technical component of lock-in but does not touch data gravity, egress cost or a team's accumulated platform expertise, so it does not eliminate lock-in.
- **B.** Movement between two public providers, without a private or community component, is multi-cloud portability, not hybrid cloud, which NIST reserves for a mix of deployment models.
- **C.** Correct. The guide names exactly this trade-off: portable workloads on a common substrate spread risk but sacrifice provider-specific managed capabilities in the process.
- **D.** Portability at the workload layer does not remove the operational duplication of identity, networking and monitoring that every additional provider brings with it.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.multi-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.multi-cloud)

### 31. A

*devops.devops-basics.deployment-environments · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

Each environment exists to eliminate a class of defect before the next is reached, and that only works if each rung is genuinely more realistic than the last. A staging environment that diverges in topology or configuration tests a fourth environment nobody deploys to.

- **A.** Correct. Staging that differs in topology or configuration mechanism is not standing in for production; it is standing in for itself.
- **B.** Parity applies to every rung of the ladder, and staging that diverges in topology fails the same test a developer environment would.
- **C.** Build-once concerns the artifact being promoted unchanged; the topology and configuration divergence described here is a separate failure.
- **D.** Data realism is only one dimension; a divergent topology or configuration mechanism can hide defects that never appear until production.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.deployment-environments](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.deployment-environments)

### 32. C

*sysadmin.system-administration.etc-fstab · System Administration Fundamentals :: System Administration · depth 3 · recall*

`/etc/fstab` has six positional, unlabelled fields in order: device, mount point, filesystem type, mount options, dump flag, and fsck pass order. Because the fields are positional, a missing options field silently shifts the two numeric fields that follow it.

- **A.** This swaps the third and fourth fields — filesystem type comes before mount options, not after.
- **B.** An fstab line does not record ownership or permission bits at all; the fifth and sixth fields are the dump flag and the fsck pass order.
- **C.** Correct. Each line names what to mount, where, in what format, with what options, and how the two remaining maintenance flags should treat it.
- **D.** UUID and label are alternative ways of naming the first field (the device), not two separate fields of their own.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-fstab](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-fstab)

### 33. B

*linux.command-line.sed · Linux Fundamentals :: Command Line · depth 3 · application*

In-place editing is where GNU and BSD sed diverge. GNU sed takes an optional suffix attached to `-i`; BSD sed, including the one shipped with macOS, requires the suffix as a separate argument, so the portable-looking `sed -i 's/a/b/g' file` fails there.

- **A.** In-place editing is exactly where GNU and BSD sed diverge; the flag's syntax is not portable between them.
- **B.** Correct. GNU sed documents in-place editing as `-i[SUFFIX]`, an optional suffix attached to the flag (`-i` for no backup, `-i.bak` for one), while the BSD sed shipped on macOS documents `-i extension`, taking the extension as a separate argument — so `sed -i 's/a/b/g' file` there swallows the script as the extension and then fails on the filename, and `sed -i '' 's/a/b/g' file` is the form it needs.
- **C.** The mismatch produces an error or an unwanted backup file with a misleading name, not a silent no-op that leaves the file untouched.
- **D.** BSD sed supports the same `s/pattern/replacement/flags` substitution syntax; the divergence specifically concerns `-i`'s argument handling, not the substitution command itself.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.sed](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.sed)

### 34. A

*security.security.package-and-download-verification · Security Fundamentals :: Security · depth 3 · command*

A checksum answers only whether the received bytes match a value; if that value came from the same compromised source as the download, a match proves self-consistency, not authenticity. `gpg --verify` checked against a signing key obtained through an independent, trusted channel is what actually establishes who released the bytes.

- **A.** Correct. The guide states directly that fetching the digest file from the same channel as the download means a matching digest proves only self-consistency, not authenticity.
- **B.** A checksum proves only that bytes match a value; it says nothing about who produced that value, which is exactly the trap the guide describes for a same-server digest.
- **C.** TLS protects the connection during transfer, but it does not establish that the source server itself was not the one compromised in the first place.
- **D.** Running a second, weaker hash algorithm against the same self-consistent source adds no independent verification of origin; the missing step is a signature checked against an independently obtained key.

Study it: [04-security/security.md#c-security.security.package-and-download-verification](../study-guide/04-security/security.md#c-security.security.package-and-download-verification)

### 35. B

*pm.software-application-architecture.microservices · IT Project Management Fundamentals :: Software Application Architecture · depth 3 · discrimination*

The comparison's separating axis is the release boundary. Team A has many independently deployed units with network calls and separate data; Team B has one release and one shared database — a distributed-monolith risk if it split the process without splitting the data.

- **A.** Splitting into tidy modules that still ship as one artefact is a modular monolith; the trait that matters is independent deployment, not module boundaries.
- **B.** Correct. Independent deployment and per-service data ownership are exactly what turns a networked split into microservices rather than an organised monolith.
- **C.** That drops the deployment and data-ownership requirements the term actually carries.
- **D.** HTTP APIs and message queues are named as common interfaces between services, but the requirement is independent deployment and ownership, not one specific transport.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.microservices](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.microservices)

### 36. C

*sysadmin.system-administration.filesystem-type · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

vFAT stores no Unix ownership or permission bits, so files copied onto it come back with whatever the mount options dictate rather than what they had on the source filesystem — a data-loss-looking surprise that is really a property of the destination filesystem type, not a `chmod` mistake.

- **A.** vFAT has no on-disk representation for Unix ownership or permission bits at all, so no `chmod` mistake is needed to produce this result; mount(8) documents `uid=`, `gid=` and `umask=` as the options that set them for every file on the mount.
- **B.** The FHS governs directory layout and says nothing about what any given filesystem type can store; the limitation here is intrinsic to the vFAT format.
- **C.** Correct. Because the filesystem type itself has no concept of Unix ownership, whatever permissions appear are synthesised by the mount options rather than recovered from anything stored on disk.
- **D.** Because vFAT has nowhere to store Unix ownership, any such change would not persist across a remount either.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.filesystem-type](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.filesystem-type)

### 37. B

*cloud.cloud-computing.region-and-availability-zone · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · application*

Availability zones are isolated datacentre groupings inside one region, so spreading a service across them protects against the loss of any single facility within that region. A regional-scale event is outside that protection boundary entirely; surviving it requires resources placed in a second region, which — because inter-region traffic is generally not fast enough for synchronous replication — is usually an asynchronous, more deliberate design decision.

- **A.** Multi-AZ redundancy is bounded by the region it sits inside; nothing about it survives an event that takes out the region as a whole.
- **B.** Correct. The guide is explicit about the boundary: zones address one facility's failure; a whole-region event needs redundancy across separate regions instead.
- **C.** AWS states the opposite: resources are tied to the region specified and are not automatically replicated across regions unless a cross-region design is explicitly built.
- **D.** Hybrid cloud concerns mixing deployment models, not geographic redundancy; the actual gap here is the absence of a second region, which a hybrid architecture does not by itself supply.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.region-and-availability-zone](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.region-and-availability-zone)

### 38. A

*sysadmin.system-administration.inode · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

The number of inodes on a filesystem is normally fixed at creation time, so a filesystem holding many tiny files can exhaust its inode table while gigabytes of data blocks remain free. `df -i` reports inode usage directly, and it is the standard next check when `df -h` shows space but writes still fail.

- **A.** Correct. A filesystem full of tiny files can run out of inodes long before it runs out of data blocks, and that exhaustion is invisible to a plain `df -h` block-usage report.
- **B.** The error is real — it just is not about blocks. Inode exhaustion is a distinct, common cause that block-usage figures alone cannot reveal.
- **C.** `du` totals file sizes, which is the wrong lens when the filesystem still has free space by that measure; the symptom described points at the inode table instead.
- **D.** Checking for shared inodes between two specific files does not explain a filesystem-wide inability to create any new file.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.inode](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.inode)

### 39. C

*devops.git-concepts.git-diff-and-git-log · DevOps Fundamentals :: Git Concepts · depth 3 · application*

Bare `git diff` compares the working tree with the index, showing what could still be staged; after `git add .` that difference is empty even though the index now differs from HEAD. `git diff --staged` (with `--cached` as a synonym) compares the index with HEAD instead, which is exactly what a commit right now would record.

- **A.** That describes `git diff <commit>` against a specific commit, not the bare form; bare `git diff` compares working tree to the index, a different pair of states entirely.
- **B.** Files matched by `.gitignore` being skipped is a real behaviour of `git add`, but it explains a partial stage, not why a bare `git diff` prints nothing for files that clearly were staged.
- **C.** Correct. Bare `git diff` shows only what could still be staged, which is nothing once everything has been staged, even though the last commit is plainly different from the files now.
- **D.** `git status` would still list the staged files under "Changes to be committed"; it is `git diff` specifically, not `git status`, that goes quiet once everything is staged.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.git-diff-and-git-log](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.git-diff-and-git-log)

### 40. A

*linux.command-line.viewing-file-contents · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`less` reads lazily, allowing backward movement and searching, and opens instantly on a huge file because it only loads what it displays — unlike `cat`, which dumps the whole file to standard output at once.

- **A.** Correct. less(1) states that it 'does not have to read the entire input file before starting, so with large input files it starts up faster than text editors like vi', and it allows backward as well as forward movement through the file.
- **B.** `cat` dumps the entire file to standard output at once, which floods the terminal on a multi-gigabyte log rather than paging through it.
- **C.** `head` prints only the first part of a file and exits, so it gives a quick look but never lets the operator move on through the rest.
- **D.** `tail -f` is for watching new lines as they are appended to a growing file, not for reading through an existing large file from the start.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.viewing-file-contents](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.viewing-file-contents)

### 41. A

*cloud.cloud-computing.serverless-and-faas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

FaaS's economics come from charging only for computation and nothing while idle. A workload that is busy for six hours every day is far from idle, so the cost advantage that makes FaaS attractive largely disappears, and a continuously running instance sized for that throughput can end up cheaper — the guide's warning against assuming serverless is always the lower-cost choice.

- **A.** Correct. CNCF ties FaaS's economics to charging 'solely for the duration of computation', with no cost while inactive — a job at high load six hours a day is exactly where that advantage stops applying.
- **B.** This job is not idle — it runs at high load for six hours daily — so the idle-cost advantage that makes FaaS attractive elsewhere does not apply here.
- **C.** They do not bill identically — PaaS charges for provisioned capacity regardless of load pattern, while FaaS charges per invocation, and those can diverge sharply under sustained load.
- **D.** Statelessness is a real FaaS constraint, but the scenario describes a cost concern under sustained load, not a state-management requirement.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.serverless-and-faas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.serverless-and-faas)

### 42. B

*security.security.physical-security · Security Fundamentals :: Security · depth 2 · recall*

Ordinary file deletion typically removes only the filesystem's pointer to the data, leaving the underlying bytes recoverable. The guide's disposal practice is explicit: media that leaves the building is wiped or destroyed, not merely deleted, before it is decommissioned.

- **A.** Ordinary deletion typically only removes the filesystem's reference to the data, not the underlying bytes, which is why the guide requires wiping or destruction instead.
- **B.** Correct. The guide's practice for secure disposal is explicitly wiping or destruction, not ordinary file deletion, which typically leaves the underlying bytes recoverable.
- **C.** Encryption while in service is a separate, valuable control, but the guide's stated disposal practice still calls for wiping or destroying the media, not relying on the earlier encryption state alone.
- **D.** Secure disposal applies to any media leaving the building, drives included, not only to tape backups specifically.

Study it: [04-security/security.md#c-security.security.physical-security](../study-guide/04-security/security.md#c-security.security.physical-security)

### 43. C

*sysadmin.system-administration.lvm · System Administration Fundamentals :: System Administration · depth 1 · recall*

LVM pools physical volumes into a volume group, from which logical volumes are carved out. Its one selling point over a bare partition is that a logical volume can later be grown, shrunk, or moved across several physical disks — recognition of that three-layer vocabulary (PV, VG, LV) is the LFCA-level expectation, summarised respectively by `pvs`, `vgs` and `lvs`.

- **A.** LVM adds a device-mapper abstraction for flexibility; lvm(8) presents it as providing capabilities beyond the physical devices, not as making storage faster, and speed is not the property being tested here.
- **B.** Redundancy against drive failure is what RAID provides; LVM by itself is about flexible sizing and pooling, not fault tolerance.
- **C.** Correct. Pooling physical volumes into a volume group and carving logical volumes out of that pool is exactly what lets a volume grow, shrink or move across devices.
- **D.** A logical volume still needs a filesystem created on it with `mkfs`, exactly like a plain partition would.

Study it: [02-system-administration/system-administration.md#s-system-administration-filesystem](../study-guide/02-system-administration/system-administration.md#s-system-administration-filesystem)

### 44. C

*linux.linux-operating-system.gnu-and-the-linux-kernel · Linux Fundamentals :: Linux Operating System · depth 3 · discrimination*

Linux, strictly, is the kernel Linus Torvalds began in 1991. Most Linux userlands trace to the GNU Project, which is why the pairing is sometimes called GNU/Linux — but not every Linux system has a GNU userland, so the two phrases are not interchangeable.

- **A.** The kernel is one component; the userland running above it is a separate choice, and Android's Bionic userland shows it need not be GNU at all.
- **B.** GNU names a concrete body of software — the compiler, shell, and core utilities from the GNU Project — not merely a license category.
- **C.** Correct. Android is the guide's own counter-example: it runs the Linux kernel with a non-GNU userland, so 'Linux' is the safer umbrella term.
- **D.** No such requirement exists, and the Linux Foundation does not control userland composition; GNU/Linux describes an actual pairing that some systems, like Android, do not have.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.gnu-and-the-linux-kernel](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.gnu-and-the-linux-kernel)

### 45. B

*pm.software-application-architecture.sql-basics · IT Project Management Fundamentals :: Software Application Architecture · depth 1 · recall*

Of the four data-changing statements, SELECT changes nothing; UPDATE and DELETE without a WHERE clause typically act on every row, and JOIN is a clause used inside a query rather than a statement of its own.

- **A.** UPDATE has no notion of 'most recent' without an explicit WHERE or ORDER BY; DELETE without a WHERE clause is just as dangerous as this UPDATE, not safe.
- **B.** Correct. UPDATE without a WHERE clause typically acts on every row in the table, while SELECT is the one statement of the four that reads without writing.
- **C.** PostgreSQL does not require a WHERE clause; omitting one is exactly what makes this statement act on every row.
- **D.** JOIN is a clause written inside a query, not a statement of its own, and it has no bearing on whether an UPDATE carries a WHERE clause.

Study it: [06-it-project-management/software-application-architecture.md#s-software-application-architecture-data](../study-guide/06-it-project-management/software-application-architecture.md#s-software-application-architecture-data)

### 46. D

*sysadmin.system-administration.patch-management · System Administration Fundamentals :: System Administration · depth 3 · discrimination*

Patch management is the disciplined practice around updates — inventory, tracking advisories, testing before production, applying on a schedule, and being able to roll back — not simply the act of running an update command. Applying every update immediately and untested is a change-management failure, not the practice itself.

- **A.** Applying every update immediately, untested, on production is a change-management failure rather than diligence — it is how a patch causes the outage it was meant to prevent.
- **B.** The practice applies to updates generally, though security updates are often prioritised and sometimes automated separately for exactly that reason.
- **C.** Logging what happened after the fact does not substitute for the testing, staged rollout and rollback plan the practice requires beforehand; NIST's definition centres on identifying, prioritising, acquiring, installing and verifying patches, not on recording them afterwards.
- **D.** Correct. Running the command is only the final step of the practice; without testing, scheduling and a rollback path, untested changes reach production directly.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.patch-management](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.patch-management)

### 47. C

*cloud.networking.public-and-elastic-ip-addresses · Cloud Computing Fundamentals :: Networking · depth 2 · application*

A reserved address exists for exactly this purpose: it can be remapped to a different instance, masking an instance failure without waiting for any DNS record to be updated and re-cached.

- **A.** DNS failover changes which address clients are told to use and cannot take effect faster than caching allows, which is exactly the delay the requirement rules out.
- **B.** A load balancer would satisfy the DNS half of the requirement, but it is exactly the additional component in front of the instance that the requirement rules out.
- **C.** Correct. Remapping a reserved address masks the failure without depending on any DNS caching delay.
- **D.** An ephemeral address is exactly what does not survive across instances predictably — reassigning it does not preserve the original address, so clients pointed at the old one would still fail.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.public-and-elastic-ip-addresses](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.public-and-elastic-ip-addresses)

### 48. C

*devops.git-concepts.head · DevOps Fundamentals :: Git Concepts · depth 1 · recall*

HEAD is a pointer to whatever is currently checked out — normally the name of the current branch, which is why committing advances that branch. In detached-HEAD state it names a commit directly instead, with no branch to carry forward, which `git log HEAD` and a bare `git log` both display identically since HEAD is the default starting point either way.

- **A.** HEAD names where you currently are, not where the project is furthest along; it can point at any commit, including one far behind the tips of other branches.
- **B.** Detaching creates no branch at all; that is precisely what "detached" describes, and any commits made there belong to nothing until a branch is created.
- **C.** Correct. Detached HEAD is exactly this: HEAD normally names a branch, and here it names a commit instead, so nothing advances to follow further commits.
- **D.** A remote-tracking branch is a separate local record of the remote's state; detaching HEAD has nothing to do with it and does not repoint it.

Study it: [05-devops/git-concepts.md#s-git-concepts-branching](../study-guide/05-devops/git-concepts.md#s-git-concepts-branching)

### 49. C

*sysadmin.system-administration.repository · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

The client's repository index is a downloaded snapshot cached locally, refreshed only when explicitly asked. "No installation candidate" for a package known to exist is the standard symptom of a stale index rather than a missing package, and refreshing the index is the fix.

- **A.** The scenario states its existence was confirmed, and `apt` does not query repositories live: it works from the locally cached index that `apt update` downloads, so a stale index is the far more common explanation for 'no installation candidate'.
- **B.** An unresolved dependency produces a different, more specific error naming the missing requirement, not a blanket "no installation candidate."
- **C.** Correct. The cached index is a snapshot, not a live view, so a package published after the last refresh is invisible until the index is updated.
- **D.** A corrupted local database of installed packages would produce errors on already-installed packages, not on finding a new one to install.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.repository](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.repository)

### 50. C

*security.security.vulnerability-scanning · Security Fundamentals :: Security · depth 3 · discrimination*

Scanning container images at build time catches a vulnerable base image before it ever runs, which is the same idea as host scanning moved earlier. Once deployed, a scan still only reports known weaknesses in current state on a schedule; noticing an attack actually happening against the running container is the IDPS's continuous, present-tense job instead.

- **A.** Severity reporting is exactly what a vulnerability scan already does through its matched database entries; the gap is live-activity detection, not severity scoring.
- **B.** Checksum and signature verification is a separate supply-chain control performed at download time, not a gap between scanning and intrusion detection specifically.
- **C.** Correct. The comparison's axis is present tense versus latent state: the scanner lists known weaknesses in configured state, while noticing live activity as it happens is the IDPS's job.
- **D.** Confining a compromised process is mandatory access control's job, which is a distinct layer from either scanning for known weaknesses or detecting live intrusions.

Study it: [04-security/security.md#c-security.security.vulnerability-scanning](../study-guide/04-security/security.md#c-security.security.vulnerability-scanning)

### 51. D

*linux.linux-operating-system.shell · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`echo $SHELL` prints the configured login shell. It is worth knowing this can diverge from the shell actually executing a given command, since `$SHELL` is not updated when a different shell is launched interactively.

- **A.** PATH lists directories to search for commands; it does not itself name which program is the user's configured shell.
- **B.** Block devices are unrelated to which interpreter is configured as a login shell.
- **C.** `$0` names the shell that is currently running, which need not be the login shell configured for the account — bash(1) defines SHELL as "the full pathname of the current user's login shell", which is what the question asks for.
- **D.** Correct. This is exactly the variable the guide names for this purpose, printed with `echo`.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.shell](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.shell)

### 52. A

*sysadmin.system-administration.suid · System Administration Fundamentals :: System Administration · depth 3 · application*

The set-user-ID bit makes an executable run with the file owner's effective UID rather than the caller's. `passwd` is owned by root and carries this bit, which is how an ordinary user's invocation of it can write into `/etc/shadow`, a file they cannot otherwise open. Every SUID binary on a system can be enumerated with `find / -perm -4000`.

- **A.** Correct. SUID makes the running process take on the effective UID of the file's owner, which is exactly the controlled privilege escalation this scenario needs.
- **B.** SUID changes the effective UID, not the real UID; the real UID still records who actually launched the process.
- **C.** On Debian-family systems a shadow-group helper is one real design, but the textbook answer for `passwd` itself is the set-user-ID bit running as root.
- **D.** `passwd` does not consult or modify `sudoers`; its escalation comes entirely from the SUID bit on the binary itself.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.suid](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.suid)

### 53. B

*cloud.networking.security-group-vs-network-acl · Cloud Computing Fundamentals :: Networking · depth 3 · discrimination*

Because security groups carry allow rules only, an explicit deny of one address cannot be expressed there at all; the network ACL's allow-and-deny rule type is what the requirement actually needs.

- **A.** AWS security groups carry allow rules only — there is no deny rule type, so a single blocked address cannot be expressed there at all.
- **B.** Correct. This matches AWS's documented rule-type difference between the two layers exactly.
- **C.** The network ACL, a provider-managed layer outside the guest operating system, is exactly the tool documented for this: an explicit deny rule at the subnet level, with no host firewall needed.
- **D.** Public-versus-private classification governs whether a subnet has a route to the internet at all, not which individual addresses are allowed or denied once traffic can reach it.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.security-group-vs-network-acl](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.security-group-vs-network-acl)

### 54. A

*pm.software-application-architecture.stateless-vs-stateful-applications · IT Project Management Fundamentals :: Software Application Architecture · depth 2 · application*

RFC 9110 defines HTTP as stateless so that any instance can answer any request; sticky sessions merely paper over an application that isn't, by pinning routing rather than moving state to a shared store or token — the actual fix, and the reason failing over remains fragile until it's applied.

- **A.** Correct. Sticky sessions keep the per-client state inside one instance rather than moving it to a shared store or token, so the instance remains a single point of failure for that user's session.
- **B.** Consistent routing is a workaround, not a move of state to a shared store or token; the application is exactly as stateful as before.
- **C.** A cache is expendable by definition and holds derived results; session state cannot be lost the way a cache entry can, so a cache answers a different question.
- **D.** Sticky routing is an infrastructure workaround at the load balancer, not a change to the API's resource-and-method design; REST's statelessness constraint concerns request semantics, not instance affinity.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.stateless-vs-stateful-applications](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.stateless-vs-stateful-applications)

### 55. C

*sysadmin.troubleshooting.reproducing-the-fault · System Administration Fundamentals :: Troubleshooting · depth 3 · application*

Reproduction has to match the reported trigger exactly — the same command, the same account, the same host — or a successful run proves nothing about the original failure. Testing as root is the classic version of this error: the superuser is exempt from the checks that a permission fault depends on.

- **A.** A successful run under different conditions is not a verified fix; the original trigger — the unprivileged user's attempt — was never re-tested.
- **B.** The test as run says nothing about the original user's permissions, because root bypasses the checks that would reveal a problem with them.
- **C.** Correct. Reproducing as a different, more privileged user changes the conditions of the test and can make exactly the fault being investigated disappear.
- **D.** Escalation hands over an open problem with evidence gathered; an invalid reproduction attempt is not evidence that the problem is closed.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.reproducing-the-fault](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.reproducing-the-fault)

### 56. A

*devops.git-concepts.version-control · DevOps Fundamentals :: Git Concepts · depth 3 · discrimination*

Version control, backup and change management all produce evidence of "what changed," which is why a scenario can present all three as plausible. Version control recovers author-chosen revisions of actively edited files; backup, taken here with a scheduled `tar` archive, recovers from loss of the whole system; change management records approvals, not file contents.

- **A.** Correct. Version control and backup both keep "another copy," but one is deliberate revision history and the other is scheduled disaster recovery covering files nobody is actively changing.
- **B.** Git only records what someone deliberately committed, not the rest of the disk, and it carries no RPO/RTO guarantee for a lost machine.
- **C.** Centralized versus distributed is an architecture choice orthogonal to this gap; neither kind of version control system is a scheduled disaster-recovery backup.
- **D.** Change management governs who approved a production change, not how to recover files after a disk is lost.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.version-control](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.version-control)

### 57. B

*security.sensitive-data.data-states · Security Fundamentals :: Sensitive Data · depth 2 · discrimination*

The three transformations sit on a fixed axis. Encryption is reversible with a key. Hashing is one-way, keyless, and produces a digest nothing is recovered from. Encoding is reversible by anyone with no key at all and provides no security whatsoever. Only encryption sits at the 'reversible, but only with a key' point on that axis.

- **A.** Hashing is a one-way function; no key is involved and nothing is recovered from the digest by design.
- **B.** Correct. Reversibility gated on key possession is exactly what separates encryption from both hashing and encoding.
- **C.** Encoding is reversible by anyone with no key whatsoever; describing it as a security measure misdescribes it by definition.
- **D.** This mixes two unrelated mechanisms: a key-encrypting key wraps other keys, and salting a hash does not turn a one-way digest into a reversible one.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.data-states](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.data-states)

### 58. D

*linux.linux-operating-system.unix-heritage-and-posix · Linux Fundamentals :: Linux Operating System · depth 1 · recall*

Linux is Unix-like and largely POSIX-conformant, which is why skills and scripts port across Unix systems sharing that conformance. It is a recognition-level fact: know that conformance is the reason, not the contents of the standard.

- **A.** Licensing terms govern redistribution rights, not runtime command or system-call behaviour; they are unrelated to script portability.
- **B.** Different Unix-like systems run entirely different kernels; the shared standard is POSIX conformance, not a shared kernel.
- **C.** Portability across Unix-like systems specifically follows from shared POSIX conformance; it does not extend to unrelated operating systems without that conformance.
- **D.** Correct. This is the recognition-level fact the concept tests: POSIX conformance is the reason for the portability, not an incidental detail.

Study it: [01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-history-and-licensing](../study-guide/01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-history-and-licensing)

### 59. D

*cloud.performance-availability.horizontal-scaling · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · discrimination*

Horizontal scaling only helps a workload that can actually be divided among instances. Putting more machines behind a load balancer does nothing for a single-threaded batch job with no distributable work, which is exactly the trap the exam sets with this shape of scenario.

- **A.** Throughput rises only when the added capacity can take on part of the work; assuming more instances always help ignores that this job has nothing to divide.
- **B.** Surviving the loss of an idle instance is not the concern here; the job still runs to completion on whichever single thread is doing the work.
- **C.** Nothing in the scenario describes automatic, bidirectional capacity changes against demand; ten instances were simply added by a team's proposal.
- **D.** Correct. Horizontal scaling only helps work that can actually be divided; a load balancer has no requests to distribute across a single indivisible job.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.horizontal-scaling](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.horizontal-scaling)

### 60. D

*sysadmin.troubleshooting.service-will-not-start · System Administration Fundamentals :: Troubleshooting · depth 4 · diagnostic*

The state name tells you which half of the problem you're in: `failed` with an exit code means systemd started the process and it died under its own control, ruling out signals and OOM kills, which surface differently. The daemon's own error line is in the unit's journal, not in the short tail `systemctl status` shows.

- **A.** An OOM kill is a signal termination and leaves the unit in the `oom-kill` failed state, not in an ordinary exit-code state.
- **B.** An exit-code state says only that the process exited under its own control; the specific cause could be permissions or something else entirely until the journal is read.
- **C.** "Address already in use" is a specific journal message found with `ss -tulpn`, not something the generic exit-code state alone establishes.
- **D.** Correct. An exit-code result means the process ran and terminated under its own control, so the cause is in the application or its configuration, and the journal for that unit carries its own line about why.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.service-will-not-start](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.service-will-not-start)

