<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 14 — answers

### 1. B

*sysadmin.best-practices.runbooks · System Administration Fundamentals :: Best Practices · depth 3 · application*

A runbook that has never been exercised is an assumption about whether its steps still work, not evidence that they do. Systems change underneath stored procedures, and the moment someone needs the runbook is the worst possible time to discover a step no longer applies.

- **A.** That practice tests whether a change is safe to deploy; it does not exercise whether a stored procedure's steps still match the system.
- **B.** Correct. The correct maintenance of a runbook is exercising it, not merely storing it, and the moment of real use is the worst time to discover it has rotted.
- **C.** Documentation staying current says nothing about whether a separate, unexecuted procedure still works.
- **D.** Storage is not maintenance; a runbook's steps can silently stop matching the system it describes.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.runbooks](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.runbooks)

### 2. A

*cloud.best-practices.documentation-and-tagging-standards · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

Tags are load-bearing rather than decorative: cost allocation reports, backup plan assignment, and automation targeting all select resources by tag, so `Owner`, `owner` and `OWNER` are three different keys, and a resource tagged with the wrong one silently drops out of every rule that selects on the standard one, with no error raised anywhere.

- **A.** Correct. `Owner`, `owner` and `OWNER` are three different keys to any system matching on the exact string.
- **B.** Tag keys are matched as exact strings; there is no automatic case normalisation that would unify the two.
- **C.** There is no default cost centre fallback; a resource with the wrong tag key simply does not appear in a report keyed on the standard one.
- **D.** A tag can be used as a condition in an access policy, but it is not itself an isolation boundary; that role belongs to accounts, subscriptions or projects.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.documentation-and-tagging-standards](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.documentation-and-tagging-standards)

### 3. A

*linux.command-line.archiving-and-compression · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

An archive whose members are stored with a leading path component unpacks into that directory, while one built from bare filenames scatters them across the current directory — listing first with `tar tzf` is the habit that reveals which case applies before anything is extracted.

- **A.** Correct. `t` lists the archive's members without extracting them, which reveals whether they are stored under a leading path component — unpacking into a subdirectory — or as bare filenames that would scatter across the current directory.
- **B.** `gzip -l` reports compressed and uncompressed size information about a `.gz` stream; it does not list a tar archive's individual member files.
- **C.** Listing first with `tar tzf` answers the question without extracting anything at all, which is safer and faster than a trial extraction.
- **D.** `file` reports the archive's overall type from its magic bytes, such as "gzip compressed data"; it does not enumerate the individual paths stored inside.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.archiving-and-compression](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.archiving-and-compression)

### 4. C

*security.compliance.gdpr · Security Fundamentals :: Compliance · depth 3 · application*

Article 33 fixes a 72-hour clock, where feasible, for notifying the supervisory authority of a breach, excused only when the breach is unlikely to result in any risk to rights and freedoms. Notifying affected individuals is a separate duty with no fixed hour count, triggered only by a likely high risk to them.

- **A.** Individual notification is triggered only by a likely high risk to the individuals, which the scenario says has not been assessed as present.
- **B.** The 72-hour authority-notification duty is excused only when the breach is unlikely to result in any risk to rights and freedoms, and some risk remains here.
- **C.** Correct. Article 33 requires notifying the supervisory authority within 72 hours where feasible, unless the breach is unlikely to result in any risk to rights and freedoms.
- **D.** An Approved Scanning Vendor is a role tied to external vulnerability scanning under PCI-DSS and has no part in GDPR's breach-notification duty.

Study it: [04-security/compliance.md#c-security.compliance.gdpr](../study-guide/04-security/compliance.md#c-security.compliance.gdpr)

### 5. B

*devops.containers.declarative-configuration-and-desired-state · DevOps Fundamentals :: Containers · depth 2 · application*

It is the mechanism behind every self-healing claim: a controller compares desired against actual on a loop and acts on the difference, which is the same reason a manually scaled workload drifts back to the declared count — the manifest is the source of truth, not the momentary imperative change.

- **A.** The manual command does take effect immediately; the drift back happens afterward, as reconciliation corrects the difference from the declared state.
- **B.** Correct. The manifest remains the source of truth the controller reconciles toward; a manual change that never updates it is corrected on the next reconciliation pass.
- **C.** A manifest in version control does not update itself in response to cluster-side changes; convergence happens because the cluster is pulled back toward the unchanged manifest, not the reverse.
- **D.** A Service has no role in maintaining replica counts; that is the controller's reconciliation loop acting on the Deployment or similar object.

Study it: [05-devops/containers.md#c-devops.containers.declarative-configuration-and-desired-state](../study-guide/05-devops/containers.md#c-devops.containers.declarative-configuration-and-desired-state)

### 6. C

*pm.open-source-software-and-licensing.gpl · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

GPLv3 adds to GPLv2 an express patent grant and a cure provision for a terminated licence; GPLv2 has neither and terminates on violation with no cure clause, so the company's protection here is nothing that the GPLv2 text itself supplies.

- **A.** The AGPL is a separate licence with its own network trigger; GPLv2 does not incorporate any of its provisions by reference.
- **B.** Sharing a publisher does not make the two versions' terms identical; GPLv3 section 11 is an express patent grant that GPLv2's text never contains.
- **C.** Correct. GPLv3's express patent grant and its termination and cure provisions live in its section 11; GPLv2's text contains no patent grant at all.
- **D.** Apache-2.0 section 3 terminates only 'patent licenses granted to You under this License', so it reaches works licensed under Apache-2.0 and gives no protection to a work distributed under GPLv2.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.gpl](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.gpl)

### 7. B

*sysadmin.disaster-recovery.full-incremental-and-differential-backups · System Administration Fundamentals :: Disaster Recovery · depth 2 · recall*

The distinction lives on the restore side. A differential accumulates all changes since the last full, so a restore needs the full plus one differential. An incremental holds only what changed since the previous backup of any kind, so a restore needs the full plus every incremental in sequence.

- **A.** That is the restore sequence for incrementals, each of which holds only what changed since the previous backup.
- **B.** Correct. A differential holds everything changed since the last full, so only the most recent one is needed.
- **C.** A differential is not self-contained; without the full it has no baseline to apply changes to.
- **D.** Differentials are restore inputs, and skipping them discards every change made since Sunday.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.full-incremental-and-differential-backups](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.full-incremental-and-differential-backups)

### 8. A

*cloud.best-practices.well-architected-review · Cloud Computing Fundamentals :: Best Practices · depth 2 · recall*

The number and names of the pillars are directly recallable facts, and the five/six discrepancy between AWS and Azure is exactly the kind of near-miss a multiple-choice option is built from: this project once stated five as the universal count, before AWS's sustainability pillar, added 2 December 2021, made six the current AWS figure while Azure's own framework stayed at five.

- **A.** Correct. Both counts match the frameworks’ own published pillar lists, and AWS’s revision history dates the sustainability pillar to late 2021.
- **B.** Five predates AWS’s late-2021 addition of sustainability, and no single provider’s pillar set is universal across vendors.
- **C.** Azure's published framework has five pillars with no sustainability pillar at all.
- **D.** AWS’s framework was revised in late 2021 to add a sixth pillar, so it was not frozen at five.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.well-architected-review](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.well-architected-review)

### 9. A

*sysadmin.disaster-recovery.restore-testing · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

Restoring into an isolated environment and verifying the result is restore testing. It proves the artefact works. It does not prove the organisation can execute its recovery plan under pressure, which is a separate exercise.

- **A.** Correct. Reading the copy back and confirming its contents is exactly what this practice requires.
- **B.** A drill rehearses the whole plan and the people in it, not one artefact restoring correctly.
- **C.** Where the test runs is incidental; the off-site requirement is about where copies are kept.
- **D.** Retention governs how long copies are kept, which existence checks alone do not establish.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.restore-testing](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.restore-testing)

### 10. D

*linux.command-line.cut-sort-uniq-and-wc · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

`uniq` compares only adjacent lines. That single fact makes `sort` a prerequisite rather than a stylistic choice — running `uniq -c` on unsorted input scatters identical lines and each is reported separately instead of merged into one count. Setting the delimiter is always `cut -d`, paired with `-f` to name the field.

- **A.** `-c` is exactly the flag that prefixes each line with its count; `-d` instead restricts output to only the duplicated lines, without counts.
- **B.** `wc -l` only counts lines; it does not reorder or normalise them, and would not affect whether duplicates are adjacent.
- **C.** `uniq` compares whole lines by default and works without `cut`; the missing step here is sorting, not field extraction.
- **D.** Correct. `uniq` merges runs of identical *adjacent* lines; unsorted input leaves identical lines scattered through the file, and each separated occurrence is counted on its own.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.cut-sort-uniq-and-wc](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.cut-sort-uniq-and-wc)

### 11. C

*security.compliance.licensing-compliance · Security Fundamentals :: Compliance · depth 2 · recall*

Copyleft licences such as the GPL trigger their source-disclosure duty on conveying, not on mere use. GPLv3 states outright that interacting with a user over a network without transferring a copy is not conveying, so running a modified version purely as an internal service does not by itself require publishing source.

- **A.** Open source removes the fee, not the licence's specific conditions; GPLv3's disclosure duty is triggered by conveying, which internal-only use does not do.
- **B.** The scenario names GPLv3, not the AGPL, and even under the AGPL the trigger is remote interaction by outside users, not merely internal employee use.
- **C.** Correct. GPLv3 states that mere interaction with a user through a computer network, with no transfer of a copy, is not conveying.
- **D.** Per-seat entitlements are a proprietary-licensing concept; GPLv3's obligations turn on conveying a copy, not on how many seats are in use.

Study it: [04-security/compliance.md#c-security.compliance.licensing-compliance](../study-guide/04-security/compliance.md#c-security.compliance.licensing-compliance)

### 12. A

*sysadmin.networking.dns-record-types · System Administration Fundamentals :: Networking · depth 3 · application*

A working forward lookup implies nothing about reverse or mail-routing records: MX names the mail exchangers for a domain, a separate entry from A, so bouncing mail on an otherwise working domain points straight at checking `dig MX` next.

- **A.** Correct. A working forward lookup implies nothing about mail delivery; MX records are a completely separate entry that directs where mail for the domain should go.
- **B.** `dig A` reports only the IPv4 address record; it carries no information about mail routing, which lives in a separate MX record entirely.
- **C.** PTR records support reverse lookups for the mail server's own sending address in anti-spam checks, not the website's own forward A record, and are not the first thing to check for bouncing mail on this domain.
- **D.** TTL governs cache lifetime for a record and has no direct bearing on whether mail delivery succeeds; the missing piece here is the MX record, a distinct entry entirely.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dns-record-types](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dns-record-types)

### 13. B

*devops.containers.environment-variables-in-containers · DevOps Fundamentals :: Containers · depth 3 · command*

`ENV` in a Dockerfile writes a default every container from that image inherits; `-e` at run time overrides it for one container, but only at creation. Because those values are fixed once a container exists, `docker start` cannot apply a new one.

- **A.** `docker start` resumes an existing container using its original configuration and does not accept new run-time flags such as `-e`.
- **B.** Correct. Run-time environment values are recorded at container creation; changing one requires creating a new container with `docker run -e`, not restarting the old one.
- **C.** Neither `docker start` nor a run-time `-e` value ever modifies the image; the image's `ENV` default is untouched by anything done to a container.
- **D.** `docker start` never resets a container's writable layer; the described failure is that the new flag has no effect at all, not that data is lost.

Study it: [05-devops/containers.md#c-devops.containers.environment-variables-in-containers](../study-guide/05-devops/containers.md#c-devops.containers.environment-variables-in-containers)

### 14. C

*cloud.budgeting.chargeback-and-showback · Cloud Computing Fundamentals :: Budgeting · depth 1 · recall*

Chargeback bills internal teams for their consumption, moving money between cost centres; showback reports the same consumption without transferring any charge. Showback is not chargeback waiting to be turned on — it is a deliberate, often permanent, choice to change behaviour through visibility alone.

- **A.** Chargeback moves money between cost centres with an internal invoice; reporting alone, with no such transfer, is showback rather than a form of billing.
- **B.** Cost monitoring is the continuous tracking of spend generally; chargeback and showback specifically concern whether spend already tracked is billed internally or merely reported.
- **C.** Correct. Showback reports consumption without transferring any charge; it is a permanent, deliberate practice in many organisations, not a waiting room on the way to chargeback.
- **D.** This pair is confused in both directions, and this is the specific misreading: showback is not chargeback waiting to be turned on, it is a standalone choice organisations can run permanently.

Study it: [03-cloud-computing/budgeting.md#s-budgeting-cost-control](../study-guide/03-cloud-computing/budgeting.md#s-budgeting-cost-control)

### 15. B

*linux.command-line.file-type-and-metadata · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`ctime` is the last change to the inode itself, including a permission or ownership change, not a creation time. Traditional Unix metadata simply has no field recording when a file was originally created.

- **A.** `ctime` never records creation on any filesystem; where a birth time exists, `stat` exposes it separately as `%w`, not as `ctime`.
- **B.** Correct. stat(1) documents `%z` as the 'time of last status change': it moves whenever the inode changes — ownership, permissions, link count — even if the contents did not. Where a filesystem records a creation time at all, `stat` reports it as a separate field, `%w`.
- **C.** `atime` records the most recent read, not the earliest one, and is not a creation timestamp either.
- **D.** `mtime` is `%y`, the time of last data modification — another non-creation timestamp; none of `atime`, `mtime` or `ctime` records when a file came into existence.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-type-and-metadata](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-type-and-metadata)

### 16. A

*pm.open-source-software-and-licensing.license-compatibility · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 2 · recall*

Compatibility is directional: permissive code can enter a copyleft project because its condition (carry the notice) survives the combination, while GPL code cannot enter a permissive project because the GPL's whole-work condition cannot be promised by permissive terms.

- **A.** Correct. Compatibility is directional precisely because one side's obligation survives the combination and the other side's does not.
- **B.** Code length has nothing to do with legal compatibility; the direction is set by what each licence's conditions require of the combined work.
- **C.** The GPL's reach depends on how code is combined and conveyed, not on when the code was originally written.
- **D.** This is the assumption the directional rule exists to correct; the reverse direction fails because the GPL's whole-work condition cannot be satisfied under permissive terms.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.license-compatibility](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.license-compatibility)

### 17. C

*sysadmin.networking.ipv4-address-classes · System Administration Fundamentals :: Networking · depth 3 · discrimination*

Classful addressing offered exactly three fixed sizes inferred from the address's leading bits — /8, /16, /24 — while CIDR allows any explicitly stated prefix length; a /26 was never a classful size, so calling it "a class C network" conflates two different addressing schemes.

- **A.** A class C network specifically meant a /24 under the old fixed-size scheme; CIDR prefixes such as /26 are a different, classless concept the vocabulary was never meant to describe.
- **B.** Class D specifically names the 224-239 multicast range under the classful scheme; CIDR is an entirely separate, classless addressing mechanism unrelated to multicast.
- **C.** Correct. The colleague conflates a historical, address-implied /24 default with a CIDR prefix that is explicitly stated and can be any length, including /26, which was never a classful size at all.
- **D.** Both classful addressing and CIDR are IPv4 concepts; neither one has any special relationship to IPv6, which uses its own separate addressing architecture.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ipv4-address-classes](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ipv4-address-classes)

### 18. B

*sysadmin.networking.network-host-and-broadcast-addresses · System Administration Fundamentals :: Networking · depth 3 · recall*

The broadcast address is derived from the mask, not from a fixed pattern in the address itself: 10.0.1.255 is the broadcast under a /24 mask, but the same-looking 10.0.0.255 is an ordinary usable host under a /16 covering the same range.

- **A.** Whether an address ending in .255 is a broadcast address depends entirely on the mask in force; under many masks it is an ordinary usable host address.
- **B.** Correct. In 10.0.0.0/16 the broadcast is 10.0.255.255, so 10.0.0.255 sits well inside the usable range; the same-looking address is only a broadcast under a different mask such as /24.
- **C.** An address ending in .0 is typically the network address under common masks, not the broadcast address; neither fixed ending reliably identifies a broadcast address.
- **D.** 255.255.255.255 is the limited broadcast, a separate, never-routed address; it is not the directed broadcast for any particular subnet.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.network-host-and-broadcast-addresses](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.network-host-and-broadcast-addresses)

### 19. D

*security.compliance.pci-dss · Security Fundamentals :: Compliance · depth 3 · discrimination*

PCI-DSS permits the primary account number to be stored if rendered unreadable, while sensitive authentication data may not be retained after authorisation at all. It is contractual, not governmental, and is enforced through the merchant agreement with an acquirer and the payment brands rather than by a regulator.

- **A.** PCI-DSS is not legislation; the Council states that requiring or validating compliance is at the discretion of a payment brand, acquirer or other entity that manages a compliance program.
- **B.** The primary account number may be stored if rendered unreadable; the guide's contrast with GDPR's transfer rules does not extend to forbidding account-number storage outright.
- **C.** PCI-DSS has no supervisory authority of its own; that mechanism belongs to statutory regimes such as GDPR, not to a card-industry contract.
- **D.** Correct. The Council treats rendering a stored account number unreadable as its protection method, and states that requiring or validating compliance sits with a payment brand or acquirer.

Study it: [04-security/compliance.md#c-security.compliance.pci-dss](../study-guide/04-security/compliance.md#c-security.compliance.pci-dss)

### 20. C

*cloud.budgeting.on-demand-reserved-and-spot-pricing · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

AWS terminates, stops, or hibernates a Spot Instance after a two-minute interruption notice, with an earlier rebalance-recommendation signal. Azure Spot VMs and Google Cloud Spot or preemptible VMs instead evict with roughly thirty seconds' best-effort notice and no hibernate option — the mechanics are provider-specific, not a shared standard.

- **A.** The interruption notice is provider-specific, not a shared spot or preemptible standard, and stating it as universal is the exact generalisation this concept warns against.
- **B.** Autoscaling reacts to load, not to an eviction signal, and has no bearing on how much warning a job receives before spot reclamation.
- **C.** Correct. AWS documents a two-minute Spot interruption notice, plus an earlier rebalance-recommendation signal; Azure and Google Cloud instead give roughly thirty seconds, delivered best-effort with no hibernate option.
- **D.** Egress pricing and interruption notice length are unrelated meters; nothing about an egress charge changes how much warning a job gets.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.on-demand-reserved-and-spot-pricing](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.on-demand-reserved-and-spot-pricing)

### 21. D

*linux.command-line.history-and-tab-completion · Linux Fundamentals :: Command Line · depth 3 · application*

The shell keeps its history list in memory and writes it to `HISTFILE` — `~/.bash_history` by default — when the session ends, which is why a second terminal opened at the same time does not see the first session's commands until it exits.

- **A.** By default all sessions for a user share the same `HISTFILE`; the gap here is about when each session writes to it, not separate files per window.
- **B.** Tab completion and history are separate readline features; enabling one has no bearing on whether one session's commands appear in another's history.
- **C.** Bash copies the session's history entries to the history file without regard to privilege; nothing in its history handling singles out `sudo` or drops unprivileged commands.
- **D.** Correct. The shell keeps the history list in memory during a session and writes it to `HISTFILE` — `~/.bash_history` by default — typically at session exit, so a concurrently open second terminal has nothing new to read yet.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.history-and-tab-completion](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.history-and-tab-completion)

### 22. B

*devops.devops-basics.ci-cd-tooling · DevOps Fundamentals :: DevOps Basics · depth 2 · recall*

Recognition of the category each tool belongs to is what matters. Terraform provisions, Ansible configures existing hosts, and Jenkins (alongside GitHub Actions and GitLab CI) runs the pipeline's stages.

- **A.** This is category confusion, assigning each tool to the wrong one of the three jobs it does not perform.
- **B.** Correct. Placing each named tool into the correct one of the three categories is exactly what the concept asks for.
- **C.** Only Terraform provisions infrastructure declaratively; Ansible configures existing hosts and Jenkins runs pipeline stages instead.
- **D.** Running pipeline stages is Jenkins's job; neither Terraform nor Ansible executes build or test stages.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.ci-cd-tooling](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.ci-cd-tooling)

### 23. D

*sysadmin.networking.osi-model · System Administration Fundamentals :: Networking · depth 3 · application*

The OSI model is a fault-isolation ladder: each confirmed layer removes it from suspicion. Link and MAC confirm layer 2, a working ping and route confirm layer 3, and an instant TCP refusal is generated at layer 4, which is exactly where the evidence should be read from next.

- **A.** The successful ping and valid default route already confirmed layer 3, so a routing explanation ignores evidence already in hand.
- **B.** Taking a vague complaint at face value skips the ladder the model exists to support; an instant refusal is a transport-layer signature, not evidence about the application itself.
- **C.** Layer 2 was already confirmed by the link light and MAC address; a data-link fault would prevent any frame exchange, not produce a fast refusal from a live host.
- **D.** Correct. TCP and port numbers live at the transport layer, and an instant refusal is generated there, not by the application code above it.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.osi-model](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.osi-model)

### 24. C

*cloud.cloud-computing.cloud-computing · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Cloud is a way of selling and consuming capacity, not a statement about who owns the building or the racks. A private cloud run by the organisation itself on its own hardware still satisfies NIST's definition provided the five essential characteristics — including self-service, elasticity and measured service — actually hold, exactly as this hospital's platform does.

- **A.** Virtualization and third-party operation are common, not required; a private cloud on owned hardware satisfies the same definition.
- **B.** NIST names private cloud as one of its own deployment models; it is not excluded from being cloud computing.
- **C.** Correct. NIST's characteristics say nothing about ownership; an organisation running its own private cloud is still cloud computing if self-service, elasticity and metering hold.
- **D.** Metering is a property of how usage is tracked and charged, not of where the hardware physically sits.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-computing](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-computing)

### 25. D

*pm.project-management.definition-of-done · IT Project Management Fundamentals :: Project Management · depth 3 · application*

The Definition of Done is a commitment attached to the Increment, and work that doesn't meet it is not part of that Increment — it cannot be released or even presented at the Sprint Review, and returns to the Product Backlog. A working demo is not the same as meeting every element of the standard, including documentation the team has committed to.

- **A.** Working software alone doesn't satisfy the Definition of Done when it explicitly includes documentation such as the runbook.
- **B.** Whether the item can be presented is settled before the Review happens; the Retrospective addresses process, not this item's admission to the Review.
- **C.** Meeting a story's own criteria doesn't substitute for the team-wide Definition of Done, which is the standard actually being missed here.
- **D.** Correct. The Guide's rule ties directly to this scenario: undone work is not releasable and cannot even be shown at the Review.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.definition-of-done](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.definition-of-done)

### 26. C

*sysadmin.networking.ss-and-netstat · System Administration Fundamentals :: Networking · depth 4 · application*

Without root, the `-p` column is blank for processes you do not own, which looks like "nothing is listening" if read carelessly — re-running with elevated privilege before concluding the process column is genuinely empty is the correct next step.

- **A.** A blank process-name column reflects a privilege limitation on process attribution, not the absence of the socket; the socket entry, including its port and address, is still shown.
- **B.** `-n` only controls whether ports display numerically instead of as translated service names; it has no effect on whether other users' process names or sockets are visible.
- **C.** Correct. The socket entry itself, port and address, still appears without root privilege; only the owning process name is blanked for sockets belonging to other users, a distinction easy to misread as "nothing is listening."
- **D.** `netstat` has the same privilege requirement as `ss` for attributing sockets to other users' processes; switching tools would not change the described blank-column behaviour.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ss-and-netstat](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ss-and-netstat)

### 27. C

*security.security.malware-and-ransomware · Security Fundamentals :: Security · depth 3 · recall*

The malware classifications describe propagation and packaging, not payload: a worm spreads on its own, a virus attaches to a host file, a trojan arrives disguised, and a rootkit hides the attacker's presence from the operating system. Any of them, rootkits included, can carry any payload, ransomware included.

- **A.** A worm is defined by spreading on its own across a network, not by hiding the attacker's presence, and the guide states any propagation class can carry any payload.
- **B.** A trojan is defined by arriving disguised as something wanted, which is a separate property from hiding presence after installation; the classifications are not mutually exclusive labels for payload.
- **C.** Correct. The guide defines a rootkit specifically by its hiding behaviour and states that the classifications describe propagation and packaging, not payload, so any of them can carry ransomware.
- **D.** A virus is defined by attaching to a host file and spreading when it runs, not by hiding the attacker's presence, and the guide states the payload capability is not exclusive to any one class.

Study it: [04-security/security.md#c-security.security.malware-and-ransomware](../study-guide/04-security/security.md#c-security.security.malware-and-ransomware)

### 28. D

*linux.command-line.regular-expressions · Linux Fundamentals :: Command Line · depth 2 · discrimination*

A regular expression is not a glob. In a glob, `*` means "any run of characters" and `.` is an ordinary character; in a regular expression, `*` means "zero or more of the preceding item" and `.` matches any character — the glob `*.txt` becomes the regex `.*\.txt`.

- **A.** The meanings genuinely differ between a glob and a regular expression; this is not an artifact of quoting, which affects whether expansion happens at all, not what the pattern characters mean.
- **B.** A regular expression's `.` is one of its most common metacharacters, matching any single character; it is very much defined there.
- **C.** Both `grep` and `sed` default to the same basic regular expression dialect, so the glob-versus-regex inversion applies to patterns used with either tool.
- **D.** Correct. The two pattern languages assign different meanings to the same characters, so a pattern copied from one context to the other changes meaning without producing any error to flag it.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.regular-expressions](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.regular-expressions)

### 29. B

*sysadmin.networking.static-vs-dynamic-addressing · System Administration Fundamentals :: Networking · depth 3 · application*

Setting a static address inside a DHCP pool's range invites a duplicate-address conflict when the server later leases that same address to someone else, which is exactly why reservations — which exclude the address from the dynamic pool — exist as the safer alternative.

- **A.** A DHCP server has no visibility into addresses configured statically outside its own pool bookkeeping, so precedence does not prevent it from later offering the same address.
- **B.** Correct. Setting a static address inside a DHCP pool invites exactly this conflict, because the server has no knowledge that the address is already claimed outside its own bookkeeping.
- **C.** DHCP servers have no automatic device-type exclusion; a pool exclusion has to be configured explicitly, which is exactly what a reservation is for.
- **D.** Printers are perfectly capable of holding a static address; the conflict arises from the address falling inside the active DHCP pool range, not from any printer-specific limitation.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.static-vs-dynamic-addressing](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.static-vs-dynamic-addressing)

### 30. B

*cloud.cloud-computing.multi-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Multi-cloud reduces dependence on a single vendor in principle, but it delivers no availability benefit on its own. A workload partitioned or duplicated across providers only survives a provider outage if it is deployed, tested and genuinely able to fail over on both — an untested, drifted second deployment offers no more protection than having no second provider at all.

- **A.** This treats multi-cloud as an unqualified guarantee, which is exactly the assumption the guide warns against; an untested, drifted deployment provides no real protection.
- **B.** Correct. The guide states this directly: running on two providers only survives an outage if the workload is actually deployed, tested and able to fail over on both.
- **C.** Two public providers with no private or community component is multi-cloud, not hybrid, and neither term guarantees failover without a tested, current standby.
- **D.** An SLA is the wrong frame entirely here — the actual gap is an untested, drifted standby deployment, not a contractual coverage question.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.multi-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.multi-cloud)

### 31. B

*devops.devops-basics.continuous-delivery · DevOps Fundamentals :: DevOps Basics · depth 3 · application*

The difference from continuous deployment is exactly the manual gate and nothing else. A team can practise continuous delivery at any release frequency, so long as a person still decides each time.

- **A.** However fast the cadence, the step is still a real decision point; frequency alone does not remove the gate.
- **B.** Correct. The trap named in the guide is exactly this: delivery does not mean releasing rarely, it means a person still decides.
- **C.** This inverts the actual definition, which turns on the presence or absence of the human gate, not on cadence.
- **D.** A rollback procedure is part of a complete delivery practice, but it is not what distinguishes delivery from deployment here.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.continuous-delivery](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.continuous-delivery)

### 32. D

*sysadmin.networking.tcpdump · System Administration Fundamentals :: Networking · depth 1 · recall*

tcpdump captures packets on an interface for inspection when higher-level tools do not explain the behaviour — `tcpdump -i` selects the interface, it needs elevated privilege to capture raw traffic, and it observes traffic without ever changing configuration, which is enough recognition for LFCA.

- **A.** tcpdump is purely observational; it never changes configuration, and its privilege requirement is about accessing raw packet capture, not about making any configuration change.
- **B.** tcpdump captures raw packets on the wire; it is not a DNS query tool and does not add DNS-specific resolution detail the way `dig` does.
- **C.** Capturing raw packets from an interface does require elevated privilege on Linux, unlike ordinary use of `ss` or `curl`, which is part of what makes tcpdump the more specialised, last-resort tool.
- **D.** Correct. tcpdump is the last resort that shows what actually crossed the wire, recognition-level material for LFCA: know that `-i` selects the interface, that it needs elevated privilege, and that it observes rather than configures anything.

Study it: [02-system-administration/networking.md#s-networking-diagnostics](../study-guide/02-system-administration/networking.md#s-networking-diagnostics)

### 33. B

*linux.command-line.sed · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

The useful flags on `s/pattern/replacement/flags` include `g`, which replaces every match on the line rather than only the first. Its absence is exactly why a line with two occurrences of "http" only had the first one changed. The substitution form behind all of this is `sed 's/a/b/g'`.

- **A.** `-n` suppresses sed's default per-line printing; it controls what gets printed, not how many matches on a line get replaced.
- **B.** Correct. Without `g`, `sed`'s substitution command replaces only the first match on each line; adding `g` extends it to every match on that line.
- **C.** `-E` switches sed to extended regular expression syntax; it has no effect on how many matches per line are replaced.
- **D.** `-i` controls whether changes are written back to the file or sent to standard output; it does not change how many occurrences per line are substituted.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.sed](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.sed)

### 34. D

*security.security.physical-security · Security Fundamentals :: Security · depth 2 · recall*

An attacker at the console operates below the level most software controls occupy: interrupting the boot loader, booting from removable media, or simply removing the disk are none of them stopped by the installed system's authentication or file permissions. The layered answer combines physical access control with boot-path controls and full disk encryption, which is the piece that still holds once the hardware itself is in someone else's hands.

- **A.** The guide is explicit that authentication and file permissions on the installed system cannot prevent interrupting the boot loader, since the attacker acts before that system is even running.
- **B.** Mandatory access control confines processes running under the installed operating system; it has no bearing on interrupting the boot sequence before that system has started.
- **C.** Full disk encryption protects data confidentiality if the drive is removed; it does not by itself prevent interrupting the boot loader on the running hardware, which boot-path controls address.
- **D.** Correct. The guide states directly that an attacker at the console operates below the level most software controls occupy, so boot-path and physical controls, not the installed OS, are what address this.

Study it: [04-security/security.md#c-security.security.physical-security](../study-guide/04-security/security.md#c-security.security.physical-security)

### 35. B

*pm.software-application-architecture.client-server-model · IT Project Management Fundamentals :: Software Application Architecture · depth 2 · application*

RFC 9110 states plainly that the same program might act as a client on some connections and a server on others — role is a property of a connection, not an identity stamped on a process. An application server is exactly this case: server to the tier above it, client to the tier below.

- **A.** That treats role as a fixed identity of the process rather than a per-connection role — the same trap as misassigning a component's tier.
- **B.** Correct. RFC 9110 defines client and server per connection, so one program answering a browser while calling a database occupies both roles at once.
- **C.** Peer-to-peer names a shape with no designated waiting party; a service that both answers a browser and calls a database is two ordinary client-server exchanges, not that.
- **D.** A common misreading of client and server as a permanent identity rather than a role assumed once per connection.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.client-server-model](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.client-server-model)

### 36. A

*sysadmin.system-administration.bios-vs-uefi · System Administration Fundamentals :: System Administration · depth 3 · application*

Secure Boot is one optional UEFI feature that verifies the signature of each executable in the boot chain; it is not synonymous with UEFI itself. Turning it off to permit an unsigned kernel module leaves UEFI booting — the EFI System Partition, GPT, everything else — unaffected.

- **A.** Correct. UEFI and Secure Boot are not the same thing; Secure Boot can be switched off independently while the firmware continues to boot through its normal UEFI path.
- **B.** Secure Boot is a UEFI feature layered on top of the normal boot path; disabling it does not revert the firmware to an entirely different, older boot mode.
- **C.** The EFI System Partition is read as part of ordinary UEFI booting regardless of whether Secure Boot's signature verification is enabled.
- **D.** GRUB does not silently disable a firmware-level setting; Secure Boot was turned off directly in firmware, which is what allowed the unsigned module to load.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.bios-vs-uefi](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.bios-vs-uefi)

### 37. A

*cloud.cloud-computing.region-and-availability-zone · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · recall*

A region is a separate geographic area designed to be isolated from other regions, and an availability zone is one of several isolated locations inside a single region, each with independent power, cooling and networking infrastructure — so that an outage in one zone is survived by the rest of the region.

- **A.** Correct. This is exactly how the two nest: region is the broader geographic area, and zones are the isolated datacentre groupings within it.
- **B.** This inverts the nesting — the region is the larger geographic container, and availability zones are the smaller isolated units inside it, not the reverse.
- **C.** They are two distinct, nested units with different failure scopes: zones address one datacentre-scale failure, regions address the loss of a whole geography.
- **D.** An availability zone sits inside exactly one region; cross-geography redundancy is what spreading resources across separate regions provides instead.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.region-and-availability-zone](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.region-and-availability-zone)

### 38. C

*sysadmin.system-administration.dnf-yum-and-rpm · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

`rpm -q` given a bare package *name* looks that name up in the database of installed packages, which is why a package plainly present on disk is reported as "not installed". To query the download itself, name it as a file — `rpm -qp mypackage.rpm`, where `-p` tells `rpm` the argument is a package file to read directly.

- **A.** `rpm -q` works correctly for its intended purpose, and it reads package headers directly when pointed at a file; the fix is to name the file, not to switch tools.
- **B.** An uninstalled local file can be queried directly with `rpm -q -p`; nothing about querying it requires a repository or a `createrepo` index first.
- **C.** Correct. A bare name argument is resolved against the database of what is already installed, which correctly reports the not-yet-installed download as absent; `-p` tells `rpm` to read the named package file directly instead.
- **D.** `-l` only changes what is listed about whichever package was selected; the selection still comes from the installed-package database when a bare name is given, so `rpm -ql mypackage` shows the identical 'not installed' result.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.dnf-yum-and-rpm](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.dnf-yum-and-rpm)

### 39. C

*devops.git-concepts.branching-strategies · DevOps Fundamentals :: Git Concepts · depth 1 · recall*

Branching strategies such as trunk-based development, feature branching and release branches are conventions governing how work travels from a developer to the main line. Git enforces none of them and offers no command for any of them, so a question naming a strategy is asking about team process, not about a command or an option.

- **A.** Git has no such age-based enforcement mechanism; a branch can live indefinitely without any commit being rejected for it.
- **B.** That protects against losing unmerged commits on deletion; it says nothing about how often branches must be merged, and `-D` overrides it anyway when someone wants to.
- **C.** Correct. Recognition of the term is what matters here: these are agreements between people, not a feature Git enforces or offers a command for.
- **D.** `--ff-only` is not Git's default merge behaviour, and even where used it only refuses a non-fast-forward merge — it does not compel branches to be short-lived.

Study it: [05-devops/git-concepts.md#s-git-concepts-practice](../study-guide/05-devops/git-concepts.md#s-git-concepts-practice)

### 40. D

*linux.command-line.text-editors · Linux Fundamentals :: Command Line · depth 3 · discrimination*

vi is standardised by POSIX and present on essentially every Unix-like system, including minimal containers and rescue images, even if the build is a cut-down one. nano is modeless and easier to start with, but it is a separate package a minimal system may not have.

- **A.** vi's ubiquity is precisely the practical point of this topic — a rescue shell, a container, or a stripped-down server that offers exactly one editor offers vi.
- **B.** The scenario states nano is specifically absent from this image; nano is also a separate package that a minimal system may not include at all.
- **C.** `EDITOR` only names a preference; it does not guarantee the named program is actually installed on a minimal image.
- **D.** Correct. vi is standardised by POSIX and shipped on essentially every Unix-like system including minimal containers and rescue images, though the actual build may be a cut-down one such as vim-tiny or BusyBox vi.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.text-editors](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.text-editors)

### 41. D

*cloud.cloud-computing.serverless-and-faas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

CNCF calls serverless a comprehensive term spanning PaaS-like through SaaS-like services, with FaaS one specific member of it — a managed queue billed per message is serverless without being FaaS, because there is no customer-written, event-triggered function doing the work.

- **A.** Pay-per-use with no server management describes serverless generally; FaaS additionally requires that the unit executing is a customer-written, event-triggered function, which this queue lacks.
- **B.** The billing pattern is a genuine FaaS discriminator against PaaS, but it does not by itself make every such component FaaS — this queue has no customer function at all.
- **C.** They are not mutually exclusive; a serverless offering is very often also a managed service, since the provider operates it end to end.
- **D.** Correct. FaaS specifically means individual event-triggered functions the consumer writes; a managed queue with no customer function is serverless in its operational model but not FaaS.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.serverless-and-faas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.serverless-and-faas)

### 42. C

*security.security.vulnerabilities-cves-and-patching · Security Fundamentals :: Security · depth 3 · application*

Patch priority should follow severity, whether the affected component is actually deployed and reachable, and whether exploitation is observed in the wild — not the raw CVSS number in isolation. An unreachable, unused package's high score matters less than a lower score on a service actively exposed to attackers.

- **A.** The guide names this exact ranking as the trap: a CVSS base score describes the flaw in the abstract, not deployment context, which is what actually determines risk.
- **B.** Reachability and deployment context are already known and sufficient to prioritise; a penetration test is not a prerequisite for an ordinary patch-priority decision.
- **C.** Correct. The guide states directly that a 9.8 in software that is never run and unreachable may matter less than a 6.5 on an internet-facing service, since exposure is what turns a score into actual risk.
- **D.** Patching a named defect in software that keeps running does not reduce attack surface at all; that is a separate remediation, not a reason to rank this CVE higher.

Study it: [04-security/security.md#c-security.security.vulnerabilities-cves-and-patching](../study-guide/04-security/security.md#c-security.security.vulnerabilities-cves-and-patching)

### 43. A

*sysadmin.system-administration.hard-link-vs-symbolic-link · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

A hard link is a reference to an inode number, and inode numbers are meaningful only within one filesystem, so `ln` refuses to create one across a filesystem boundary. A symbolic link stores a path string instead and has no such restriction, which is why `ln -s` succeeds where `ln` does not.

- **A.** Correct. Because a hard link is a directory entry bound to an inode number, and inode numbers are only meaningful within one filesystem, link(2) fails with EXDEV when the two paths are not on the same mounted filesystem; `ln -s` merely stores a path string, which carries no such restriction.
- **B.** `ln` works correctly within a single filesystem; the failure here is specifically the cross-filesystem restriction, not a general defect.
- **C.** Nothing in the scenario indicates a missing destination directory; the described failure is the standard cross-filesystem restriction on hard links.
- **D.** Both link types create a new entry in the destination directory, so a read-only `/backup` would fail for `ln -s` just as readily; the failure described is link(2)'s EXDEV, raised when the two paths are not on the same mounted filesystem.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.hard-link-vs-symbolic-link](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.hard-link-vs-symbolic-link)

### 44. B

*linux.linux-operating-system.environment-variables · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`env`, run with no arguments, prints the current environment — exported variables only, not un-exported shell variables. `echo` prints a single named value rather than enumerating the environment.

- **A.** `echo $HOME` prints one specific variable's value; it does not enumerate the full set of exported variables the way `env` does.
- **B.** Correct. `env` with no arguments prints the current environment specifically, excluding shell variables that were never exported.
- **C.** `export NAME` marks the named variable for export and prints nothing; it is bare `export` or `export -p` that lists exported names, and `env` that prints the environment itself.
- **D.** Referencing a variable with `$` only reads its current-shell value; it does not export it, and un-exported variables are absent from `env`'s output regardless of how often they were referenced.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.environment-variables](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.environment-variables)

### 45. A

*pm.software-application-architecture.http-methods-and-status-codes · IT Project Management Fundamentals :: Software Application Architecture · depth 3 · command*

The curl manual is explicit that `-X` only changes the method word and does not alter how curl behaves, which is why `-X HEAD` is not a proper HEAD request and `--head` is. Pairing `-X DELETE` with `-i` sends the method RFC 9110 defines for removing a resource and prints the status line that came back, while `--head` alone would issue a HEAD and never delete anything.

- **A.** Correct. `-X <method>` sets the method word used in the request, and `-i` includes the response headers, including the status line, alongside the body — together they cover both requirements.
- **B.** Expecting `-X` to change request behaviour is the documented mistake: `-X HEAD` does not perform a proper HEAD request — `-I, --head` is the option that does.
- **C.** `-I, --head` fetches the headers only by issuing a HEAD request, so no DELETE is ever sent and the status line reported belongs to the HEAD rather than to the removal the script needs.
- **D.** Idempotence describes what happens on repetition, not equivalence between operations; PUT replaces the resource rather than removing it, so it doesn't answer whether the delete succeeded.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.http-methods-and-status-codes](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.http-methods-and-status-codes)

### 46. C

*sysadmin.system-administration.password-policy-and-ageing · System Administration Fundamentals :: System Administration · depth 3 · command*

`passwd -e` expires an account's password immediately, which forces the user to set a new one at their next login — the direct way to retire a temporary administrator-assigned password.

- **A.** A minimum age controls how soon a password can be changed again; it does not force an immediate change.
- **B.** Locking prevents password authentication outright rather than prompting for a new password at next login.
- **C.** Correct. Expiring the password forces a change at the very next authentication, which is exactly the stated requirement.
- **D.** Changing the shell affects what program starts at login, not whether the password must be renewed.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.password-policy-and-ageing](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.password-policy-and-ageing)

### 47. A

*cloud.networking.public-and-elastic-ip-addresses · Cloud Computing Fundamentals :: Networking · depth 2 · recall*

By default such addresses are ephemeral, released back to the provider's pool when the resource is deleted; a reserved static address is what survives instance replacement instead.

- **A.** Correct. An ephemeral address is exactly the kind that does not survive instance replacement.
- **B.** DNS maps a name to whatever address is current; the reason the address itself changed here is that it was never reserved, not that DNS was involved.
- **C.** Whether an address is ephemeral or reserved is independent of whether it belongs to a load balancer or a single instance; a load balancer's address type is a separate design choice.
- **D.** A public address handed out automatically at launch is ephemeral; a reserved address has to be explicitly allocated to the account first, and would have survived the replacement, which this one did not.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.public-and-elastic-ip-addresses](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.public-and-elastic-ip-addresses)

### 48. A

*devops.git-concepts.fetch-vs-pull · DevOps Fundamentals :: Git Concepts · depth 3 · application*

`git pull` is fetch followed by an integration step. The documentation gives four options for that step and names `--ff-only` the default, so a branch that is merely behind fast-forwards with nothing specified. Only when the two histories have genuinely diverged does that default fail, at which point the developer chooses `--rebase`, `--no-rebase` or `--squash`, or sets `pull.rebase`, `pull.squash` or `pull.ff`.

- **A.** Correct. Pull is fetch followed by merge or rebase; when the local branch is merely behind, that integration is a fast-forward, the same painless case a plain `git merge` would also take.
- **B.** A conflict requires both sides to have changed the same region; with no local commits since the last sync there is nothing on this side to conflict with, so pull completes cleanly.
- **C.** Failure is specific to the diverged case: the documented default is `--ff-only`, which fails only when the local branch has diverged, so a branch that is merely behind fast-forwards with no flag at all.
- **D.** That describes what a bare `git fetch` would leave behind; `git pull` is precisely fetch plus the integration step, so it also moves the local branch here.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.fetch-vs-pull](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.fetch-vs-pull)

### 49. B

*sysadmin.system-administration.read-write-execute-permissions · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Traversal requires execute on every directory along the path, independent of what the files inside allow. A bulk change that strips execute from directories — a common side effect of an overly broad `chmod -R` — produces exactly this symptom.

- **A.** Write permission on the files controls whether their contents can be changed, not whether the directory holding them can be entered.
- **B.** Correct. Traversal into a directory is governed by its own execute bit, independent of the read permission on the files it contains.
- **C.** A group change would affect the group triad's access, but the scenario describes a traversal failure consistent with a missing execute bit specifically.
- **D.** A umask only affects the permissions given to newly created files and directories; it cannot retroactively change an existing tree.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.read-write-execute-permissions](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.read-write-execute-permissions)

### 50. C

*security.sensitive-data.data-states · Security Fundamentals :: Sensitive Data · depth 2 · application*

Full-disk encryption protects information located on the storage component, and TLS protects it while it is on the wire between endpoints. Neither reaches the address space of the process that is actually working on the data, which is why data in use is the hardest of the three states and has no everyday answer built from 'we encrypted it'.

- **A.** That is a real custody concern, but it belongs to key management, not to whether the at-rest state itself is covered here.
- **B.** This is the assumption the third state exists to break: in use has no comparable boundary on an ordinary system.
- **C.** Correct. Both controls guard a boundary the data crosses or sits behind; the address space of a running process is outside both boundaries.
- **D.** That describes a specific inspection architecture, not a gap in TLS itself, and is not what leaves this scenario's in-use state uncovered.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.data-states](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.data-states)

### 51. A

*linux.linux-operating-system.ram · Linux Fundamentals :: Linux Operating System · depth 3 · application*

When RAM is exhausted, the kernel either swaps pages to disk, slowing sharply, or under severe pressure invokes the OOM killer to terminate a process and reclaim memory — which explains an abrupt termination with no corresponding application-level warning.

- **A.** Correct. Under severe pressure the kernel's OOM killer is exactly the mechanism that terminates a process to reclaim memory, independent of anything the process itself logs.
- **B.** Swap running low slows the system by paging heavily; it does not itself terminate a process the way the OOM killer does.
- **C.** Starving for CPU time causes slowness, not termination; only the OOM killer actually ends a process to reclaim memory.
- **D.** The OOM killer is a real, kernel-initiated termination mechanism specifically for reclaiming memory under pressure, distinct from any user-issued signal.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.ram](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.ram)

### 52. D

*sysadmin.system-administration.sudo-vs-su · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

On Ubuntu, and on any Debian installation where no root password was set during setup, the root account's password is locked, so `su` to root fails regardless of what is typed. The intended route to a root shell is `sudo -i`, which authenticates with the caller's own password instead.

- **A.** The account is not merely forgotten — it is locked by the distribution's design, so no password will ever satisfy it until it is explicitly unlocked.
- **B.** `su` authenticates against the target account's own password; group membership in `sudo` is what governs whether `sudo` itself is permitted.
- **C.** The command is present and works to switch into any account whose password is set; only the root account specifically is locked by default.
- **D.** Correct. A locked root password makes `su` unusable regardless of what is typed, and Ubuntu deliberately routes administration through `sudo` instead.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.sudo-vs-su](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.sudo-vs-su)

### 53. D

*cloud.networking.security-group-vs-network-acl · Cloud Computing Fundamentals :: Networking · depth 3 · application*

A security group is stateful and instance-level; a network ACL is stateless and subnet-level, so a reply that never returns is the signature of a missing outbound network ACL rule, not a broken application or an unrelated host firewall.

- **A.** Statefulness depends entirely on the implementation, not on the word 'firewall' itself; the layer described here — attached to the subnet with allow-and-deny rules evaluated in order — is a network ACL, not a host firewall.
- **B.** A missing route would prevent the reply from being sent anywhere at all, not selectively drop it after arrival at the filtering layer; the described symptom is the signature of a stateless rule set, not a routing gap.
- **C.** This reverses the split: a security group is the stateful layer, automatically allowing return traffic, while the network ACL is the one that requires it written explicitly.
- **D.** Correct. A missing outbound rule on a stateless layer is exactly the diagnostic signature this concept describes.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.security-group-vs-network-acl](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.security-group-vs-network-acl)

### 54. C

*pm.software-application-architecture.schema-table-and-index · IT Project Management Fundamentals :: Software Application Architecture · depth 1 · recall*

PostgreSQL keeps each index synchronised as the underlying table changes. That is exactly the trade the guide names: read speed bought with write time and disk space, not a free structure or a schema change.

- **A.** An index is not a copy of the table's data; it is a separate lookup structure alongside it, and the table itself is unchanged.
- **B.** Adding an index doesn't redeclare the schema; the slowdown comes from maintaining the index structure itself, not a schema change.
- **C.** Correct. An index buys read speed by costing write time and disk space, because the database maintains it in step with the table on every write.
- **D.** An index is not free: PostgreSQL updates it whenever the table changes, so faster reads are paid for on every insert, update and delete.

Study it: [06-it-project-management/software-application-architecture.md#s-software-application-architecture-data](../study-guide/06-it-project-management/software-application-architecture.md#s-software-application-architecture-data)

### 55. A

*sysadmin.troubleshooting.narrowing-scope · System Administration Fundamentals :: Troubleshooting · depth 3 · application*

Scope is established by contrast, not by observing the failure alone. A comparison case that changes exactly one dimension — same command, different user; same user, different host — tells you which dimension the cause lives in, eliminating whole categories at once.

- **A.** Correct. A deliberately chosen comparison case that differs in exactly one dimension is what turns a single data point into a scoped result.
- **B.** That is a useful theory-generating step later, but it does not by itself establish whether the fault is user-specific or host-wide.
- **C.** A log entry from one session carries no comparison case, so it cannot discriminate between a user-specific and a host-wide cause.
- **D.** That adds a second observation that differs in several dimensions at once — account, host and possibly network path — so no category of cause is eliminated by it.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.narrowing-scope](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.narrowing-scope)

### 56. D

*devops.git-concepts.tag · DevOps Fundamentals :: Git Concepts · depth 3 · command*

`git tag <name>` creates a lightweight tag, a bare reference with no metadata; `git tag -a <name> -m "<message>"` creates an annotated tag, a real database object carrying the tagger's name and email, a creation date, a message and optionally a signature — and per the documentation, supplying `-m` without `-a`, `-s` or `-u` implies `-a`.

- **A.** A lightweight tag is a bare reference to an object with no metadata of its own; the documentation describes it as meant for private or temporary labels, not releases needing a recorded tagger and message.
- **B.** There is no separate "remote-tracking tag" category with different metadata rules; whether a tag carries a tagger, date and message is decided by lightweight versus annotated, not by its origin.
- **C.** `--follow-tags` only controls whether a push also sends annotated tags reachable from what is being pushed; it does not create or add metadata to a tag that lacks it.
- **D.** Correct. Only the annotated form is a full object with metadata; the documentation describes it as the form meant for releases specifically because of that recorded metadata.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.tag](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.tag)

### 57. A

*security.sensitive-data.protected-health-and-payment-data · Security Fundamentals :: Sensitive Data · depth 2 · application*

Encryption of ePHI is Addressable both at rest and in transmission, and 45 CFR 164.306(d)(3) defines what Addressable means: assess whether the safeguard is reasonable and appropriate, implement it if it is, and otherwise document why not and put an equivalent alternative measure in place where that is itself reasonable and appropriate. Declining encryption with no such assessment or documentation does not satisfy that standard.

- **A.** Correct. 45 CFR 164.306(d)(3) sets out exactly that assessment-implement-or-document sequence for every Addressable specification.
- **B.** Addressable is not optional; it obliges an assessment and, if the specification is not implemented, a documented reason and an equivalent alternative.
- **C.** An internal classification label has no bearing on a HIPAA Addressable requirement, which is assessed against reasonableness and appropriateness, not an internal scheme.
- **D.** The scenario is about ePHI under HIPAA's own Security Rule; pulling in PCI DSS answers a different regime's question.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.protected-health-and-payment-data](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.protected-health-and-payment-data)

### 58. B

*linux.linux-operating-system.system-call · Linux Fundamentals :: Linux Operating System · depth 1 · recall*

A system call is the controlled entry point by which a userspace program asks the kernel to do privileged work, such as opening a file. A library call that stays in userspace never crosses that boundary at all.

- **A.** Speed is not the distinguishing property, and system calls are not defined by any relationship to the shell.
- **B.** Correct. This is the recognition-level distinction the concept exists to test: crossing into the kernel versus staying entirely in userspace.
- **C.** Language choice is an implementation detail; the boundary crossed is what defines a system call, not the language it happens to be written in.
- **D.** They are not interchangeable: only a system call crosses into the kernel-privileged context, which is exactly the property the term names.

Study it: [01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-fundamentals](../study-guide/01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-fundamentals)

### 59. D

*cloud.performance-availability.horizontal-scaling · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

Horizontal scaling is effectively unbounded and removes the single point of failure a lone server represents, but it only works if any instance can serve any request — which requires externalising session state first. Vertical scaling solves neither problem the scenario names; it just delays the ceiling.

- **A.** Vertical scaling still stops at the largest instance type and leaves one machine as the single point of failure; it solves neither problem the scenario names.
- **B.** A load balancer distributes requests, but if sessions live on local disk, a request routed to a different instance still cannot find its own session — that gap is what stateless design closes.
- **C.** A scheduled scaling policy still adds instances that are only useful once the workload is distributable; the sticky-session problem underneath is unaddressed.
- **D.** Correct. Horizontal scaling removes the ceiling and the single point of failure, but it depends on statelessness; sessions pinned to one disk block any other instance from serving that user.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.horizontal-scaling](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.horizontal-scaling)

### 60. D

*sysadmin.troubleshooting.permission-denied · System Administration Fundamentals :: Troubleshooting · depth 4 · application*

`id` reports the credentials of the current process, not the account's configured groups, so an open shell started before a group change still carries the old set. Comparing it against `id <user>` exposes exactly that gap, and the fix is a new login rather than another permission change.

- **A.** The configuration is already correct; the running session simply predates it, which another `usermod` command does not fix.
- **B.** Group membership is a local kernel-held credential on the running process, with no involvement from DNS resolution or caching at all.
- **C.** The denial here is on a user's own interactive shell reading a file, not a service's process state, which `systemctl status` doesn't speak to.
- **D.** Correct. Group membership is evaluated from the credentials a process already holds, so a user added to a group is unaffected until a new login picks up the change.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.permission-denied](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.permission-denied)

