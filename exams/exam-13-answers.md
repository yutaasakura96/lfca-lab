<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 13 — answers

### 1. C

*sysadmin.best-practices.runbooks · System Administration Fundamentals :: Best Practices · depth 3 · application*

The conditions a runbook is used under are the conditions people reason worst in. It is written as a sequential procedure with no step assumed, precisely because a step obvious to the author is the step a stranger will get wrong at night.

- **A.** Documentation is descriptive and assumes a reader with time; handed to someone at 03:00 who has never seen the system, an explanation is close to useless.
- **B.** That plan is broader and governs whether a disaster is declared and who is told; the runbook is the procedure layer inside it, and is what this task needs.
- **C.** Correct. A runbook is instruction rather than explanation, written to be followed under pressure by someone who may not know the system.
- **D.** They are read by the same kind of person at the worst possible time, but one instructs and the other explains, and only one is safe to follow blind.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.runbooks](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.runbooks)

### 2. C

*cloud.best-practices.design-for-failure · Cloud Computing Fundamentals :: Best Practices · depth 2 · discrimination*

Design for failure is the reasoning behind almost every other Architecture answer in this competency: multi-zone deployment, health checks and instance replacement are all consequences of having made this one assumption first.

- **A.** A review assesses a design against pillars; it is not the assumption that produces the design.
- **B.** They cover different scopes and are not interchangeable; neither is the underlying assumption named here.
- **C.** Correct. This is the design assumption the competency names as the reasoning behind those three practices.
- **D.** Automation concerns how a change is applied, not whether component loss has been planned for.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.design-for-failure](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.design-for-failure)

### 3. D

*linux.command-line.archiving-and-compression · Linux Fundamentals :: Command Line · depth 3 · application*

Clustering only applies to short options that take no argument, and the option that takes a value must come last in the cluster, which is why `tar czf` works and `tar cfz` does not — writing `f` before its value is expected breaks the intended result.

- **A.** GNU tar does not reorder a hyphenated cluster; `f` takes the next word in cluster order, which here is the letter `z` itself. Without the leading hyphen this would be traditional style, where "the arguments are read in the same order as the option letters" and `tar cfz logs.tar.gz /var/log` does work.
- **B.** Nothing is dropped: `z` is consumed as `f`'s argument, so the file GNU tar creates is named `z`, and `logs.tar.gz` is treated as an input path it then fails to stat.
- **C.** `z` selects gzip compression for a tar archive and never switches to the unrelated zip format; here it is not acting as an option at all, having been consumed as `f`'s argument.
- **D.** Correct. In UNIX short-option style GNU tar clusters only options that take no argument, with an argument-taking option "at the end of such a cluster, e.g. -vkpf a.tar"; `-cfz` puts `f` before `z`, so `f` consumes `z` as the archive name and `logs.tar.gz` is then read as a path to archive.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.archiving-and-compression](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.archiving-and-compression)

### 4. C

*security.compliance.compliance · Security Fundamentals :: Compliance · depth 3 · application*

An organisation that says 'we are compliant' without naming the standard, the period and the scope has not said anything an auditor could test. The claim only becomes testable once all three are fixed.

- **A.** A policy states intent but sets no measurable threshold, so it cannot supply the missing standard, period or scope.
- **B.** Naming controls is not the same as naming the standard, period and scope the compliance claim is measured against.
- **C.** Correct. Compliance is retrospective and scoped: compliance with something, over a period, for a boundary, and none of those has been named.
- **D.** An auditor cannot test a belief; without the standard, period and scope, the claim has nothing to be checked against.

Study it: [04-security/compliance.md#c-security.compliance.compliance](../study-guide/04-security/compliance.md#c-security.compliance.compliance)

### 5. B

*devops.containers.declarative-configuration-and-desired-state · DevOps Fundamentals :: Containers · depth 2 · recall*

Because the description names an end state rather than a sequence of steps, applying it twice is the same as applying it once — the imperative alternative, a script of create-and-modify commands, is not safe to re-run in the same way.

- **A.** Applying the same manifest again is not interpreted as an additive instruction; the controller compares to the declared count, which is unchanged, and does nothing further.
- **B.** Correct. Declarative configuration is idempotent by design: describing the same desired state again produces no additional effect once that state already holds.
- **C.** Reapplying an unchanged manifest is a normal, accepted operation; nothing about declarative configuration limits an object to a single apply.
- **D.** Reconciliation only acts on the difference between actual and desired state; with no difference present, nothing is deleted or recreated.

Study it: [05-devops/containers.md#c-devops.containers.declarative-configuration-and-desired-state](../study-guide/05-devops/containers.md#c-devops.containers.declarative-configuration-and-desired-state)

### 6. B

*pm.open-source-software-and-licensing.contributing-to-open-source · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 2 · recall*

Mechanics differ by project, but the sequence is the same: raise or claim an issue, submit the change for review, and have someone with write access decide. The merge decision belongs to the project, not to the person proposing the change.

- **A.** Committers, who hold write access earned on merit, are the ones who ordinarily merge changes; the restriction is about access, not a legal distinction between roles.
- **B.** Correct. GitHub's own documentation defines a pull request as a proposal to merge, and in the fork-and-pull model the contributor is working in a separate repository they do not have write access to upstream.
- **C.** A platform fork used to open a pull request is a routine step ending in a merge upstream, not a permanent independent line of development.
- **D.** Licences say nothing about a project's review process; a merge decision is a matter of project governance, not a licence requirement.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.contributing-to-open-source](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.contributing-to-open-source)

### 7. C

*sysadmin.disaster-recovery.backup-retention · System Administration Fundamentals :: Disaster Recovery · depth 2 · recall*

Retention balances recovery reach against storage cost and compliance obligations. It sets the oldest state you can return to, so a fault discovered outside the window is unrecoverable regardless of how reliable the backups were.

- **A.** The oldest retained copy is 14 days old, which is well after the corruption occurred.
- **B.** Replication tracks the current state and would have copied the corruption when it happened.
- **C.** Correct. Retention sets how far back recovery can reach, and 14 days does not reach 40.
- **D.** That target describes tolerable data loss in a recovery, not how far back copies survive.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.backup-retention](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.backup-retention)

### 8. C

*cloud.best-practices.secrets-management-in-cloud · Cloud Computing Fundamentals :: Best Practices · depth 2 · recall*

Because retrieval is a runtime call, rotation replaces the stored value without redeploying the application — which is what turns a long-lived secret into a short-lived one, unlike a value baked into an image or manifest that requires a redeploy to change everywhere it is used.

- **A.** Fetching a secret at runtime is unrelated to whether an infrastructure template reapplies; those are separate mechanisms.
- **B.** Fetching a secret does not change a role's granted permissions; narrowing a role is a separate, deliberate action.
- **C.** Correct. Runtime retrieval is what turns a long-lived secret into a short-lived one, since the workload never holds a stale local copy.
- **D.** A baked-in value requires a redeploy to change wherever it is used, which is exactly the friction runtime retrieval removes.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.secrets-management-in-cloud](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.secrets-management-in-cloud)

### 9. B

*sysadmin.disaster-recovery.mttr-and-mtbf · System Administration Fundamentals :: Disaster Recovery · depth 1 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

Mean time to repair is how quickly service returns; mean time between failures is how often it breaks. Both are observed averages describing past behaviour, which is what separates them from objectives, which are targets set in advance.

- **A.** Those are the recovery point and recovery time objectives, which are targets rather than observed averages.
- **B.** Correct. The two terms address repair duration and failure frequency respectively.
- **C.** That describes retention policy, which is unrelated to either measure.
- **D.** Those describe failover and failback timing rather than these two metrics.

Study it: [02-system-administration/disaster-recovery.md#s-disaster-recovery-planning](../study-guide/02-system-administration/disaster-recovery.md#s-disaster-recovery-planning)

### 10. B

*linux.command-line.creating-and-removing-files-and-directories · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

`rm -rf $DIR/` is catastrophic when `$DIR` is unset or empty, because the shell expands it to `rm -rf /` before `rm` ever sees anything — GNU `rm` refuses to act on `/` itself by default, but happily removes directories one level down if a variable expanded to nothing higher in the path.

- **A.** The trailing slash in `"$DIR/"` survives the expansion of the empty variable, leaving a real operand rather than none.
- **B.** Correct. An unset variable inside double quotes expands to the empty string, so the word collapses to `/`. GNU `rm` happens to refuse that one path — `--preserve-root` is its default — but the protection covers `/` alone, so the same bug with `$DIR` set to a wrong value gets none of it.
- **C.** Parameter expansion runs whether or not the variable is set; an unset variable expands to the empty string, not to its own name.
- **D.** There is no such substitution; the shell performs no fallback to `.` when a variable is empty — it simply expands to nothing.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.creating-and-removing-files-and-directories](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.creating-and-removing-files-and-directories)

### 11. B

*security.compliance.hipaa · Security Fundamentals :: Compliance · depth 2 · application*

An addressable implementation specification requires the entity to assess whether it is reasonable and appropriate in its environment, implement it if so, and otherwise document why not and implement an equivalent alternative measure if one is reasonable and appropriate.

- **A.** Addressable does not mean optional; the entity must still assess it and act, either by implementing it or by documenting an equivalent alternative.
- **B.** Correct. Addressable requires an assessment plus either implementation or a documented alternative, not merely a decision to skip it.
- **C.** Addressable specifications still carry an obligation, to assess and then either implement or document an alternative, just not a fixed mandate to implement exactly as written.
- **D.** The 60-day clock in the guide governs breach notification to affected individuals, not how an addressable specification decision is handled.

Study it: [04-security/compliance.md#c-security.compliance.hipaa](../study-guide/04-security/compliance.md#c-security.compliance.hipaa)

### 12. D

*sysadmin.disaster-recovery.restore-testing · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

Restore testing periodically proves a backup can actually be restored. Until that is done, an untested backup is an assumption rather than a safeguard — and it is the step most commonly skipped.

- **A.** A recovery time target can only be evidenced by timing an actual restore.
- **B.** Validating the plan requires rehearsing the procedure and the roles, not reading a job log.
- **C.** This is the assumption the practice exists to break; media, encryption keys and tooling all fail silently.
- **D.** Correct. A successful write says nothing about whether the resulting copy can be read back into a working system.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.restore-testing](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.restore-testing)

### 13. B

*devops.containers.environment-variables-in-containers · DevOps Fundamentals :: Containers · depth 3 · application*

`-e` at run time sets or overrides configuration for a single container without rebuilding the image, which is exactly what makes one image deployable unchanged across environments that differ only in settings like a database URL.

- **A.** Baking a per-environment value into the image is exactly the anti-pattern this mechanism avoids; the requirement is one unchanged image, not three.
- **B.** Correct. Run-time environment variables are exactly the mechanism for configuring an unchanged image differently per environment, without touching the image itself.
- **C.** A tag only names which image a reference resolves to; it does not itself carry per-environment configuration without separate builds behind it.
- **D.** A bind mount is designed for file-based data such as source code, not the lightweight key-value configuration a database URL represents.

Study it: [05-devops/containers.md#c-devops.containers.environment-variables-in-containers](../study-guide/05-devops/containers.md#c-devops.containers.environment-variables-in-containers)

### 14. C

*cloud.budgeting.on-demand-reserved-and-spot-pricing · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

Pay-as-you-go is the meter every purchase option is billed against: on-demand is that meter at full price, and reserved and spot are discounts off it in exchange for a term commitment or an interruption risk respectively.

- **A.** Pay-as-you-go is the account's default billing behaviour, not a fourth item on a menu of purchase options it prices.
- **B.** A reservation is still a rented service, not an owned asset — it buys a rate, not a machine, so it does not become a capital expenditure.
- **C.** Correct. Pay-as-you-go is the charging principle and the undiscounted baseline; on-demand implements it directly, while reserved and spot are discounts off that same on-demand price.
- **D.** Spot capacity is still metered consumption billed under the same measured-service principle; only its price-setting mechanism differs from on-demand, and it is not an auction either.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.on-demand-reserved-and-spot-pricing](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.on-demand-reserved-and-spot-pricing)

### 15. A

*linux.command-line.file-type-and-metadata · Linux Fundamentals :: Command Line · depth 3 · application*

Linux attaches no meaning to a filename extension. `file` inspects the actual content — filesystem tests, then magic-number tests, then language tests — and reports the first that succeeds, which is why it is the right tool when a file "will not open" or "is the wrong type."

- **A.** Correct. file(1) 'tests each argument in an attempt to classify it. There are three sets of tests, performed in this order: filesystem tests, magic tests, and language tests' — all against the actual bytes, so it is right even when the extension is misleading.
- **B.** stat(1) reports inode metadata — size, timestamps, permissions, ownership; it has no extension field and performs no content classification.
- **C.** The mode string encodes only the file type category — regular file, directory, symlink and so on — not what kind of content a regular file holds.
- **D.** Nothing in the kernel's open path consults a filename extension, and file(1) classifies by content, so renaming changes only the name.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-type-and-metadata](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-type-and-metadata)

### 16. D

*pm.open-source-software-and-licensing.gpl · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · recall*

The kernel is GPL-2.0-only, not "v2 or later" — a fact worth holding exactly, since it determines whether GPLv3 terms could ever apply and it is the concrete example the exam reaches for whenever it wants a copyleft licence.

- **A.** The kernel is licensed under the plain GPL, not the LGPL, and its one stated exception is the syscall note, which keeps GPL requirements off user-space programs that call the kernel rather than off drivers built into it.
- **B.** There is no such automatic default; the kernel's licence was fixed as GPL-2.0-only deliberately, and it has not moved to GPLv3.
- **C.** A project's own licence does not shift based on what gets merged into it; compatibility instead constrains what may be merged.
- **D.** Correct. The kernel is GPL-2.0-only, and an "-only" grant blocks the automatic upgrade path an "-or-later" grant would allow.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.gpl](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.gpl)

### 17. C

*sysadmin.networking.dns-record-types · System Administration Fundamentals :: Networking · depth 3 · discrimination*

A CNAME cannot coexist with other record types at the same name, which is why a CNAME cannot be placed at a zone apex — the apex must carry NS and SOA records, and a CNAME there would conflict with both.

- **A.** The restriction applies universally to any name carrying a CNAME, including the apex; the apex is in fact the clearest example of why the rule matters, since it must carry NS and SOA.
- **B.** CNAME restriction has nothing to do with address family; it applies equally in IPv4 and IPv6 zones, and the actual reason is the coexistence rule with other record types.
- **C.** Correct. This is a structural rule of the DNS record system: any name with a CNAME can have no other records at that name, which directly conflicts with the NS and SOA records every zone apex must carry.
- **D.** The apex is not restricted to only A and AAAA records; it also carries NS and SOA, among others — the actual restriction is that a CNAME cannot coexist with any other record at its name.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dns-record-types](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dns-record-types)

### 18. A

*sysadmin.networking.ip-and-ifconfig · System Administration Fundamentals :: Networking · depth 3 · application*

The `ip` command is divided into objects: `ip addr` for layer 3 addresses, `ip link` for layer 2 interface state and hardware addresses, `ip route` for the routing table — using `ip link` to look for IP addresses is a documented common mistake, since it reports link state and MAC only.

- **A.** Correct. `ip link` shows layer 2 interface state, including hardware addresses; using it to look for IP addresses is a documented mismatch, since `ip addr` is the layer 3 object that actually reports them.
- **B.** `ip link` reports layer 2 state only; it does not include IP addresses in its output at all, regardless of how many are configured on the interface.
- **C.** Even a fully configured interface with several IP addresses would show none of them under `ip link`, since that object never reports layer 3 information regardless of configuration.
- **D.** Even with the exact correct interface name, `ip link` would still show no IP address information, since that data belongs to the separate `ip addr` object entirely.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ip-and-ifconfig](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ip-and-ifconfig)

### 19. B

*security.compliance.pci-dss · Security Fundamentals :: Compliance · depth 3 · application*

PCI SSC’s own glossary separates the two kinds of account data: cardholder data, which a merchant may hold, and sensitive authentication data — card verification codes, full track data, PINs and PIN blocks — which a payment transaction may transmit or process but not store. Encrypting a verification code does not move it from the second category into the first.

- **A.** Encryption changes how data is held, not whether it may be held; sensitive authentication data is defined as data a transaction does not store.
- **B.** Correct. The Council’s glossary describes sensitive authentication data as elements that might be transmitted or processed, but not stored, as part of a payment transaction.
- **C.** A GDPR lawful basis governs personal-data processing under EU law; it does not create an exception to PCI-DSS's separate, contractual prohibition on retaining sensitive authentication data.
- **D.** The prohibition here is absolute for sensitive authentication data after authorisation; it does not turn on the length of any policy the processor might set for itself.

Study it: [04-security/compliance.md#c-security.compliance.pci-dss](../study-guide/04-security/compliance.md#c-security.compliance.pci-dss)

### 20. A

*cloud.cloud-computing.cloud-computing · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

Cloud computing is a delivery model, not a technology, and nothing in NIST's definition names virtualization, containers or any particular vendor. Bare-metal instances, containers and functions are all cloud services in their own right provided the five characteristics — on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service — hold. Requiring a VM is exactly the false equivalence the guide warns against, just approached from the opposite direction.

- **A.** Correct. The absence of a customer-visible VM says nothing about self-service, elasticity or metering, which is what the definition actually turns on.
- **B.** Resource pooling does not require a customer-facing VM; a provider can pool bare-metal or container capacity just as well.
- **C.** Serverless and FaaS are themselves cloud service categories; billing per invocation is measured service in action, not evidence against being cloud.
- **D.** Whether IaaS is also offered is irrelevant; the function service qualifies or fails on its own characteristics, not by association with another offering.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-computing](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-computing)

### 21. D

*linux.command-line.history-and-tab-completion · Linux Fundamentals :: Command Line · depth 3 · application*

`Ctrl-R` starts a reverse incremental search through the history list: typing narrows the match, pressing it again steps to the next older one, which is exactly the tool for finding a specific past command without scrolling.

- **A.** `history` lists the numbered command history for the operator to read through; it does not search or jump to a specific past command on its own.
- **B.** Tab completion fills in a partly typed name from what exists on disk or in known commands; it does not search backward through command history.
- **C.** `!$` reuses the previous command line's last argument, not a search by keyword across history; it has no notion of finding a specific past command by content.
- **D.** Correct. Pressing `Ctrl-R` and typing part of the remembered command narrows the search as you type, and pressing it again steps to the next older match.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.history-and-tab-completion](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.history-and-tab-completion)

### 22. A

*devops.devops-basics.automated-testing · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

Automated testing is the safety net that makes frequent deployment tolerable, so the strength of the net sets the ceiling on the release practice. A team cannot honestly run continuous deployment on unit-level coverage alone.

- **A.** Correct. The suite is the only thing left between a defect and users once the manual gate is gone, so weak coverage caps what is safe to do.
- **B.** Removing the gate is necessary but not sufficient; the test coverage left standing has to be able to catch what the gate used to catch.
- **C.** Adding a manual stage would make the practice continuous delivery, which is a different, valid but different, choice than the plan describes.
- **D.** Running on every change says nothing about scope; a suite that only reaches unit-level behaviour cannot catch integration or end-to-end defects.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.automated-testing](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.automated-testing)

### 23. A

*sysadmin.networking.ipv4-address-classes · System Administration Fundamentals :: Networking · depth 3 · application*

The first octet 200 falls within 192-223, the class C range, but classful addressing was superseded by CIDR in 1993: knowing the historical class does not tell you the address's actual mask under modern classless routing, which must be stated explicitly.

- **A.** Correct. 200 falls in the 192-223 range that defines class C historically, but CIDR replaced classful addressing, so the class no longer implies the actual prefix in use.
- **B.** 200 is above 191, placing it in the class C range (192-223), not the class B range (128-191).
- **C.** Modern routing is classless, so an address's class does not imply its actual mask in practice; a 200.x.x.x address may well be a /26 or any other prefix.
- **D.** 224-239 defines class D; 200 falls below that range, in the class C range (192-223) instead.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ipv4-address-classes](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ipv4-address-classes)

### 24. B

*cloud.cloud-computing.major-cloud-providers · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · application*

The exam is vendor-neutral in its wording but expects the candidate to recognise the category or unit being described. 'A region-internal fault domain with independent power, cooling and networking' is precisely how availability zones are defined across providers, whatever brand name a specific question attaches to it.

- **A.** A region is the broader geographic area; the description is of one isolated fault domain inside it, and independent power and cooling belong to that zone, not to the region.
- **B.** Correct. Both AWS and Azure use exactly this term for the concept described, and Google Cloud calls the equivalent a zone.
- **C.** Hyperscaler names the class of company, not a unit of datacentre infrastructure, and a region routinely contains several such zones.
- **D.** Nothing in the description restricts use to one customer; isolation of power and networking is about fault domains, not exclusivity of tenancy.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.major-cloud-providers](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.major-cloud-providers)

### 25. D

*pm.project-management.definition-of-done · IT Project Management Fundamentals :: Project Management · depth 3 · application*

If the organisation has a Definition of Done as a standard, every Scrum Team must follow it as a minimum, and a team's own definition can only be stricter, never weaker. Dropping a requirement under schedule pressure is exactly the quiet relaxation the commitment exists to prevent.

- **A.** Team ownership of the Definition of Done applies when no organisational standard exists; here one does, and it sets a floor, not a suggestion.
- **B.** Logging the gap as a risk doesn't change the rule that an organisational minimum cannot be relaxed by a single team.
- **C.** The Definition of Done is a Scrum commitment governed by the Guide's own rule, not a project scope item that change control approves or rejects.
- **D.** Correct. Where an organisational standard exists, all Scrum Teams must follow it as a minimum; a team may add to it but not relax it.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.definition-of-done](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.definition-of-done)

### 26. C

*sysadmin.networking.network-host-and-broadcast-addresses · System Administration Fundamentals :: Networking · depth 3 · application*

For 10.4.20.0/27 the 5 host bits give a 32-address block from 10.4.20.0 through 10.4.20.31; the network address 10.4.20.0 and the broadcast address 10.4.20.31 are both reserved, leaving 10.4.20.1 through 10.4.20.30 as the 30 usable host addresses.

- **A.** Both ends of the block are reserved: the all-zero address names the network and the all-one address is the broadcast, not just the highest address.
- **B.** The network-address reservation applies to every prefix length that leaves any host bits at all, not to a subset defined by block size.
- **C.** Correct. /27 gives a 32-address block spanning 10.4.20.0 to 10.4.20.31; the network address is 10.4.20.0 and the broadcast is 10.4.20.31, so usable hosts run from .1 to .30.
- **D.** The reason for rejection is that all host bits are zero, marking it as the network address; it does not happen to coincide with the mask value, which is a separate 32-bit quantity entirely.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.network-host-and-broadcast-addresses](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.network-host-and-broadcast-addresses)

### 27. C

*security.security.malware-and-ransomware · Security Fundamentals :: Security · depth 3 · application*

A tested, isolated backup undoes the availability loss ransomware causes by encrypting data. It cannot undo a confidentiality loss from data already exfiltrated before encryption — restoring a copy back does not un-leak what an attacker already took.

- **A.** The guide states this directly: restoring undoes the availability loss but not the confidentiality loss when data was exfiltrated first.
- **B.** The guide names tested offline backups as exactly what restores availability after ransomware; the confidentiality loss is the piece that remains, not the availability one.
- **C.** Correct. Restoring from backup reverses the encryption's effect on availability but has no bearing on data an attacker already copied out before encrypting it.
- **D.** A backup share mounted on the victim network would have been encrypted along with everything else, which is why the guide requires the copy to be offline or otherwise isolated in the first place.

Study it: [04-security/security.md#c-security.security.malware-and-ransomware](../study-guide/04-security/security.md#c-security.security.malware-and-ransomware)

### 28. A

*linux.command-line.regular-expressions · Linux Fundamentals :: Command Line · depth 2 · recall*

In POSIX basic regular expressions — grep's and sed's default — the characters `+ ? | ( ) { }` are literal, and reaching their operator meanings requires backslashing them. `grep -E`, or backslashing as `colou\?r`, makes the quantifier work.

- **A.** Correct. grep’s default dialect is basic regular expressions, in which the meta-characters `?`, `+`, `{`, `|`, `(` and `)` lose their special meaning and are reached only through their backslashed forms; unescaped, `?` is just a literal question mark, which is why `-E` (extended syntax) makes the pattern work.
- **B.** grep interprets its pattern argument as a regular expression, not a glob; `?` there means "optional" only under extended syntax, not the glob meaning of "exactly one character".
- **C.** Wrapping `?` in brackets would make it a literal character class matching a literal question mark, not enable it as a quantifier; that is not how extended syntax is requested.
- **D.** Anchors control where a match starts or ends; they do not change whether `?` is read as an operator or a literal character.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.regular-expressions](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.regular-expressions)

### 29. A

*sysadmin.networking.ss-and-netstat · System Administration Fundamentals :: Networking · depth 4 · diagnostic*

Start on the server, not the client: if the expected port is absent from `ss -tulpn`, the service is not listening and no firewall change will help; if it is present, read the Local Address column, since `127.0.0.1` means loopback only, the service up but unreachable from any other host, and that is the fault.

- **A.** Correct. Starting on the server with `ss -tulpn` and reading the Local Address column separates two entirely different faults — a service that never started, and one that started but is bound to the wrong address — before any firewall or routing investigation begins.
- **B.** Reading firewall rules before checking whether the service is even listening is how administrators spend time investigating a firewall that was never involved; `ss -tulpn` on the server is the correct starting point.
- **C.** "Running but nothing can connect" is a server-side symptom description that `ss -tulpn` on the server itself is specifically designed to diagnose first, before any client-side investigation.
- **D.** Without root, only the process-name column is blanked for sockets owned by other users; the sockets themselves, including the port and address, still appear in the output.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ss-and-netstat](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ss-and-netstat)

### 30. D

*cloud.cloud-computing.managed-services · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

Trading configuration control for reduced operational burden is the definition of a managed service, and losing root — including the timing of forced version upgrades when the provider deprecates an old one — is exactly what that trade costs. It is not a contradiction of the definition; it is the definition working as intended, which is why the decision to accept a managed component should weigh that loss of control deliberately.

- **A.** This treats 'managed' as meaning 'never surprises you,' which the guide explicitly rejects — losing root and version-timing control is precisely what the customer trades away for reduced operational burden.
- **B.** Forced upgrades on the provider's schedule occur under both models for the same reason — the provider owns the underlying component's lifecycle in each case.
- **C.** Running it as IaaS would indeed restore version-timing control, but that is a different architectural choice, not evidence about whether the forced upgrade contradicts the managed-service definition itself.
- **D.** Correct. The guide states this precisely: providers apply updates in maintenance windows, and a version the provider deprecates forces an upgrade on their timetable, not the customer's.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.managed-services](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.managed-services)

### 31. A

*devops.devops-basics.continuous-delivery · DevOps Fundamentals :: DevOps Basics · depth 3 · discrimination*

How far an automatically verified change travels on its own separates the three: CI stops at a tested artifact, delivery carries it to the door of production and waits for a person, and deployment walks it through unattended.

- **A.** Correct. The three teams sit exactly on the three boundaries: nowhere deployed, deployed with a human gate, and deployed with no gate.
- **B.** An acceptance environment is exactly not production; the human approval step is what keeps Team A at delivery.
- **C.** Releasable requires having reached at least an acceptance environment, which Team C's artifact never does.
- **D.** The difference between them is exactly the human gate, not a naming choice about environments.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.continuous-delivery](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.continuous-delivery)

### 32. C

*sysadmin.networking.static-vs-dynamic-addressing · System Administration Fundamentals :: Networking · depth 3 · discrimination*

Static addressing (or a DHCP reservation) suits devices that must stay stable because something references them by name or fixed configuration, such as servers and gateways; ordinary clients are given dynamic addresses because hand-writing hundreds of configurations does not scale.

- **A.** A DHCP reservation is a distinct, real option — binding one MAC to one fixed address — that gives a server-class device stability while remaining a DHCP client.
- **B.** Managing hundreds of hand-written client configurations does not scale; ordinary clients are given dynamic addresses precisely to avoid that burden.
- **C.** Correct. The choice turns on who needs a stable, predictable address (servers, gateways, anything an A record points at) versus who does not (ordinary clients), not on hardware type alone.
- **D.** The addressing choice is driven by whether stability is required by name-based references, not by the age or purchase date of the hardware involved.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.static-vs-dynamic-addressing](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.static-vs-dynamic-addressing)

### 33. D

*linux.command-line.root-directory-vs-root-vs-home · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

An unprivileged user typing `cd /root` normally gets "Permission denied" rather than "No such file or directory," because the directory exists and is conventionally mode 700 — the error message itself distinguishes the two situations.

- **A.** The two messages correspond to different failures on Linux: one means the target is not there, the other means it is there but access was refused.
- **B.** A missing path produces "No such file or directory", not "Permission denied", so this error confirms the opposite — the directory is present.
- **C.** `cd` reports permission errors directly when it cannot enter a directory it can otherwise see; no other command is involved here.
- **D.** Correct. "Permission denied" is reported only when the target is present and access to it is refused; a genuinely missing path produces "No such file or directory" instead. Distributions ship `/root` with restrictive modes — 700 on Debian-derived systems, 550 on Red Hat-derived ones — so an unprivileged `cd` is turned away either way.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.root-directory-vs-root-vs-home](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.root-directory-vs-root-vs-home)

### 34. D

*security.security.man-in-the-middle · Security Fundamentals :: Security · depth 2 · recall*

Before certificate validation can even be tested, the attacker first has to get into the traffic path — through a hostile or spoofed wireless access point, ARP or DNS manipulation, or a compromised router. Validation is then what defeats the attempt, unless it is skipped or the warning is clicked through.

- **A.** Logging in with a stolen credential is a direct authentication compromise, not positioning on the network path between two parties who believe they are talking to each other.
- **B.** Phishing manipulates the victim directly into an action; it does not itself place the attacker on the network path between two communicating parties.
- **C.** A `sudo` misconfiguration is a local privilege-escalation route, unrelated to intercepting traffic between two remote parties.
- **D.** Correct. The guide names ARP or DNS manipulation, a hostile access point, or a compromised router as the ways an attacker gets onto the path in the first place, before validation is even tested.

Study it: [04-security/security.md#c-security.security.man-in-the-middle](../study-guide/04-security/security.md#c-security.security.man-in-the-middle)

### 35. B

*pm.software-application-architecture.api · IT Project Management Fundamentals :: Software Application Architecture · depth 3 · discrimination*

The API/REST comparison's separating axis is category versus instance: every REST interface is an API, but an API needs no network at all — a library's function signatures are the textbook case, and REST is only one style of building a networked one.

- **A.** A uniform HTTP interface is one carrier for a contract, not the definition of the contract itself; a library's function signatures are the classic non-network API example.
- **B.** Correct. REST requires resource URLs and HTTP method semantics over a network; a library's in-process function signatures are a contract without any of that.
- **C.** REST specifically constrains resource URLs, HTTP methods, and statelessness — properties a local function-call interface has no occasion to exhibit.
- **D.** Documentation makes a contract usable to more callers, but the contract exists as soon as the operations, inputs and outputs are fixed — the schema formalises it rather than creating it.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.api](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.api)

### 36. D

*sysadmin.system-administration.bios-vs-uefi · System Administration Fundamentals :: System Administration · depth 3 · recall*

UEFI understands filesystems and reads an EFI executable from a dedicated FAT-formatted EFI System Partition rather than executing a 512-byte boot sector. That capability is what enables GPT partitioning (removing MBR's four-partition and roughly 2 TiB limits) and Secure Boot, none of which legacy BIOS provides.

- **A.** None of those are properties that distinguish UEFI from BIOS; the genuine distinguishing capabilities are the EFI System Partition, GPT support, and Secure Boot.
- **B.** GRUB, kernel parameters and the initramfs are all present regardless of which firmware generation is in use; they are not UEFI-specific capabilities.
- **C.** Journaling and disk encryption are filesystem-level features unrelated to firmware, and MBR already exceeds four partitions through extended partitions; the genuine firmware-linked limit is the roughly 2 TiB one MBR addressing imposes.
- **D.** Correct. Each is a direct consequence of UEFI reading filesystems and executables rather than a fixed 512-byte boot sector the way legacy BIOS does.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.bios-vs-uefi](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.bios-vs-uefi)

### 37. A

*cloud.cloud-computing.saas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · recall*

A SaaS subscription is normally a per-seat or per-tenant fee charged regardless of use, which is why an unused licence still costs money. That is a deliberate contrast with IaaS and FaaS, both of which are billed on actual consumption — the difference is a service-model property, not an accident of one vendor's pricing.

- **A.** Correct. NIST names 'active user accounts' among the units a cloud may meter, while CNCF sets FaaS's usage billing against it by 'eliminating costs when functions are dormant' — a seat charges for access granted, not usage taken.
- **B.** Scaling billing to zero on idle is not a PaaS property either — most PaaS still bills for provisioned instances — and it is even less true of SaaS's per-seat subscription model.
- **C.** Per-call metering describes usage-based IaaS-style billing; SaaS's typical model is a flat subscription regardless of use.
- **D.** IaaS bills for the compute, storage and network resources actually provisioned and consumed, not for named user accounts.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.saas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.saas)

### 38. C

*sysadmin.system-administration.dnf-yum-and-rpm · System Administration Fundamentals :: System Administration · depth 3 · recall*

`dnf` is the successor to `yum`, and on current Red Hat-family systems `yum` is retained as a compatibility name for the same tool — a relationship candidates most often get backwards, treating `dnf` as a variant of `yum` rather than the other way round.

- **A.** `yum` still works on current systems as a compatibility name; it was not removed, only superseded as the primary name.
- **B.** That describes `rpm`, the low-level tool in this family; both `yum` and `dnf` are the repository-aware, dependency-resolving layer.
- **C.** Correct. `dnf` is the successor to `yum`, and current systems retain `yum` only as an alias pointing at the same underlying tool.
- **D.** `yum` and `dnf` are not unrelated systems; `dnf` is specifically the successor built to replace `yum`, and both operate on the same RPM database — there is no second, yum-only package database.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.dnf-yum-and-rpm](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.dnf-yum-and-rpm)

### 39. A

*devops.devops-basics.site-reliability-engineering · DevOps Fundamentals :: DevOps Basics · depth 1 · recall*

SRE applies software engineering to reliability and uses an error budget to trade stability work against release velocity. DevOps is about getting code to production; SRE is about the production system continuing to work once it is there.

- **A.** Correct. This is the boundary the exam draws: delivery focus versus a running-system focus, mediated by an error budget.
- **B.** Treating the two as synonyms erases the distinction the concept exists to test.
- **C.** This reverses the two: DevOps is the shared-ownership culture, and SRE is the specialist operations discipline.
- **D.** That property describes idempotency, an unrelated concept about repeatable operations, not SRE.

Study it: [05-devops/devops-basics.md#s-devops-basics-culture](../study-guide/05-devops/devops-basics.md#s-devops-basics-culture)

### 40. C

*linux.command-line.text-editors · Linux Fundamentals :: Command Line · depth 3 · application*

vi starts in normal mode, where `i` enters insert mode to make changes and Escape returns to normal mode. From normal mode, `:wq` writes the file and quits — typing it while still in insert mode instead inserts those characters literally. On a system with nothing else installed, that one editor is `vi`.

- **A.** If the editor is still in insert mode, those four characters are inserted into the file as literal text instead of being read as a command; Escape must return to normal mode first.
- **B.** `:q!` quits discarding all changes; the command that writes and quits is `:wq`, so this sequence would discard the edit rather than saving it.
- **C.** Correct. vi starts in normal mode where every key is a command; `i` enters insert mode to make the edit, Escape returns to normal mode, and `:wq` from normal mode writes the file and quits.
- **D.** nano's key bindings are specific to nano; vi is modal and uses its own normal-mode commands, not nano's Control-key shortcuts.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.text-editors](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.text-editors)

### 41. D

*cloud.cloud-computing.shared-responsibility-model · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · recall*

AWS states its own side as operating, managing and controlling everything from the host operating system and virtualization layer down to the physical security of the facilities, while the customer manages the guest operating system — including updates and security patches — other application software, and the configuration of the provider-supplied firewall. That single boundary is the one candidates most often misplace.

- **A.** The actual boundary is drawn at the operating system and virtualization layer, not at the network perimeter, and the provider-supplied firewall's configuration remains a customer duty regardless of network boundary.
- **B.** This overstates the provider's share, especially under IaaS, where application software and its configuration remain the customer's responsibility.
- **C.** Account structure has nothing to do with the security responsibility boundary, which is defined by infrastructure layer, not by account organisation.
- **D.** Correct. This matches AWS's own stated boundary: provider from the host OS and virtualization layer down to physical security; customer from the guest OS upward.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.shared-responsibility-model](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.shared-responsibility-model)

### 42. D

*security.security.vulnerabilities-cves-and-patching · Security Fundamentals :: Security · depth 3 · recall*

A CVE identifier of the form CVE-YYYY-NNNN is a name for a publicly known defect, assigned by a CVE Numbering Authority; it carries no severity information. CVSS is the separate 0.0 to 10.0 scoring system that supplies severity, and databases such as the National Vulnerability Database enrich CVE records with those scores.

- **A.** The sequence number is only an assignment order from the numbering authority and carries no severity information at all.
- **B.** Attack surface describes total exposure independent of any one defect; CVSS is the actual severity scoring system for a specific catalogued flaw.
- **C.** The risk framework combines likelihood and impact qualitatively; the numeric 0.0-10.0 severity for a specific CVE is CVSS, a distinct and separately maintained score.
- **D.** Correct. The guide is explicit that confusing a CVE identifier with a CVSS score is a direct, testable error — the identifier lets everyone refer to the same defect, nothing more.

Study it: [04-security/security.md#c-security.security.vulnerabilities-cves-and-patching](../study-guide/04-security/security.md#c-security.security.vulnerabilities-cves-and-patching)

### 43. C

*sysadmin.system-administration.hard-link-vs-symbolic-link · System Administration Fundamentals :: System Administration · depth 3 · application*

A hard link is an additional directory entry pointing at an existing inode, so deleting one name only decrements that inode's link count; the data survives as long as the count has not reached zero. The symlink, holding its own separate path, keeps working through whichever original name still resolves.

- **A.** unlink(2) states the file is deleted only if the removed name was the last link to it and no process still has it open; while another name survives, the data is untouched.
- **B.** A symlink stores a fixed path string; nothing about deleting a hard link causes the symlink's stored target to be rewritten.
- **C.** Correct. A hard link is just another name for the same inode, so removing one name does not touch the data as long as another name (or the symlink's target) still exists.
- **D.** A symlink has its own separate inode holding a path string; it does not share an inode with the file it points to.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.hard-link-vs-symbolic-link](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.hard-link-vs-symbolic-link)

### 44. B

*linux.linux-operating-system.environment-variables · Linux Fundamentals :: Linux Operating System · depth 3 · command*

A shell variable becomes an environment variable only once exported; from that point every child process the shell forks receives a copy. `echo $MYVAR` sees the un-exported variable in the same shell, but a script forked as a child process does not.

- **A.** `env` only prints, or runs a command with, the current environment; it does not export anything itself, and un-exported shell variables never appear in its output.
- **B.** Correct. The guide's own trap: setting a variable without exporting it leaves it visible in the current shell via `echo` but invisible to any child process, including a script.
- **C.** PATH governs how bare command names resolve to executables; it has no bearing on whether a variable is inherited by a child process.
- **D.** Inheritance is one-directional and copy-based, and only exported variables are copied into a child process's environment at all — this is expected behaviour, not a fault.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.environment-variables](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.environment-variables)

### 45. B

*pm.software-application-architecture.caching-in-applications · IT Project Management Fundamentals :: Software Application Architecture · depth 2 · application*

RFC 9111 exists because every layer between origin and browser may hold a copy older than the current one; the guide's own trap is exactly this — a stale page can survive a fix applied at the origin, which is the cache working as designed, not a broken deployment or a stateful server.

- **A.** A cache that always reflected the origin immediately wouldn't be doing its job — reducing repeat work by accepting some staleness is the design, not a fault.
- **B.** Correct. Every cache accepts that a reader may see a value no longer current for as long as its entry's time-to-live allows, which is the defining trade the guide names.
- **C.** Statefulness describes whether a server retains client-specific data between requests; a cache returning a stale shared page is unrelated to that property.
- **D.** Nothing here concerns the interface's contract or its versioning; the page's content became stale in a cache, an entirely different mechanism.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.caching-in-applications](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.caching-in-applications)

### 46. B

*sysadmin.system-administration.password-policy-and-ageing · System Administration Fundamentals :: System Administration · depth 3 · application*

`chage -M` sets the maximum password age and `chage -W` sets the warning period before expiry, both stored in `/etc/shadow`. Complexity requirements are a separate, unrelated policy category from ageing.

- **A.** Minimum age sets the earliest a password may be changed again, and expiry disables the account on a date — neither matches the stated 90-day/7-day requirement.
- **B.** Correct. Maximum age bounds how long a password may stand before it must change, and the warning field controls how far ahead of that the user is notified.
- **C.** Complexity rules govern what a password may contain; they say nothing about how often it must be changed, which is a separate policy.
- **D.** The login shell has no expiry behaviour of any kind; it only names the program started at login.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.password-policy-and-ageing](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.password-policy-and-ageing)

### 47. B

*cloud.networking.private-service-endpoints · Cloud Computing Fundamentals :: Networking · depth 2 · recall*

AWS's version is PrivateLink, Azure's is Private Link, and Google Cloud's is Private Service Connect — functionally equivalent private-endpoint mechanisms under three different names.

- **A.** Private Service Connect is Google Cloud's name for this mechanism; AWS's is PrivateLink, a distinct product name despite the similar underlying idea.
- **B.** Correct. This matches each provider's documented product name for this mechanism.
- **C.** ExpressRoute is Azure's dedicated circuit to an on-premises network, a hybrid-connectivity product; Azure's name for a private endpoint to a managed service is Private Link, a different mechanism entirely.
- **D.** VPC Network Peering connects two Google Cloud networks to each other; the private-endpoint mechanism for reaching a managed service is Private Service Connect, a different product.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.private-service-endpoints](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.private-service-endpoints)

### 48. C

*devops.git-concepts.fetch-vs-pull · DevOps Fundamentals :: Git Concepts · depth 3 · discrimination*

Fetch cannot surprise you; pull can. `git fetch` downloads commits and updates remote-tracking branches, changing nothing about the current branch, index or working tree; `git pull` runs that same fetch and then immediately integrates the result. The documentation lists four integration options: `--ff-only`, which is the default and fails if the local branch has diverged, `--rebase`, `--no-rebase`, which merges, and `--squash`. Any of them touches the branch a mid-edit developer is standing on.

- **A.** Pull is fetch followed immediately by an integration step, which by default fast-forwards and fails outright if the branch has diverged, and merges or rebases when configured to — exactly the disturbance being avoided here.
- **B.** `git pull --rebase` is a rebase, with every history-rewriting consequence that carries; it is not gentler, and it can touch the working tree by replaying commits onto the fetched tip.
- **C.** Correct. Fetch is inspection without disturbance by design: it writes into `refs/remotes/<remote>/*` and never touches what the developer currently has checked out.
- **D.** Listing remote URLs shows configuration, not new commits; it does not retrieve anything from the server at all.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.fetch-vs-pull](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.fetch-vs-pull)

### 49. A

*sysadmin.system-administration.read-write-execute-permissions · System Administration Fundamentals :: System Administration · depth 3 · application*

On a directory, execute means "may traverse into" and is independent of read, which means "may list the entries." With `-wx` set and `r` absent, the owner can enter the directory and open a file whose name they already know, but cannot enumerate what is there with `ls`. `ls -l` and `chmod` are the ordinary tools for inspecting and changing that mode.

- **A.** Correct. On a directory, read permission is what lets the contents be enumerated, and execute is what lets the directory be entered by name — the two are independent.
- **B.** The three bits govern separate operations on a directory; execute alone is enough to traverse into it by a known name.
- **C.** Write on a directory means the owner may create or delete entries; it does not grant read, which is what listing requires.
- **D.** This reverses the actual roles: read enables listing, execute enables traversal, and this directory has execute but not read.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.read-write-execute-permissions](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.read-write-execute-permissions)

### 50. B

*security.sensitive-data.data-breach-and-notification · Security Fundamentals :: Sensitive Data · depth 2 · discrimination*

GDPR splits the duty in two. The supervisory authority is notified under Article 33 essentially whenever there is a risk. The affected individuals are told separately under Article 34, and only when the breach is likely to result in a high risk — and Article 34(3)(a) excuses even that individual communication where protective measures such as encryption rendered the data unintelligible to anyone unauthorised, which is why encryption at rest changes the notification calculus without eliminating the regulator notification.

- **A.** Article 4(12) defines a personal data breach by the security failure itself, including unauthorised access, regardless of whether the data was encrypted.
- **B.** Correct. Article 34(3)(a) excuses only the individual communication where protective measures such as encryption were applied; it does not touch the separate Article 33 duty to the authority.
- **C.** Article 34(3)(a)'s exemption is written for the individual communication specifically; it does not extend to the separate duty to notify the supervisory authority.
- **D.** HIPAA is a separate US regime and has no bearing on whether GDPR's own Article 33 duty to the supervisory authority applies here.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.data-breach-and-notification](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.data-breach-and-notification)

### 51. A

*linux.linux-operating-system.firmware · Linux Fundamentals :: Linux Operating System · depth 1 · discrimination*

Firmware is low-level software embedded in a device, distinct from the operating system above it. A driver operates the device from the OS side; if the device's own embedded software is missing or out of date, no module load fixes it — that is a separate firmware-update process.

- **A.** Correct. Firmware runs on the device's own controller, below the OS entirely; no kernel module load can fix a problem that lives at that separate layer.
- **B.** The scenario states the module already loaded successfully and reloading changes nothing; the driver having loaded correctly is what points elsewhere, toward firmware.
- **C.** Module loading is a kernel operation performed identically regardless of which shell invoked `modprobe`; the shell is not a plausible fault layer here.
- **D.** A loaded driver only means the kernel's side of talking to the device is working; the device's own firmware is a separate layer that can still be at fault.

Study it: [01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-hardware](../study-guide/01-linux-fundamentals/linux-operating-system.md#s-linux-operating-system-hardware)

### 52. D

*sysadmin.system-administration.sudo-vs-su · System Administration Fundamentals :: System Administration · depth 3 · application*

`sudo` run per command logs what was executed and by whom, because each invocation is authenticated and recorded separately. `su -` authenticates once and hands over an entire shell, after which everything typed is anonymous within that session as far as the audit trail is concerned.

- **A.** Requiring the target's password authenticates the switch; it does not create a record of what is done afterward inside that shell.
- **B.** Holding the same privilege level does not mean the same audit trail — `sudo` scoped to commands is specifically what preserves per-action logging.
- **C.** `sudo -i` opens a shell just as `su -` does; commands run inside it are not individually logged the way single-command `sudo` invocations are.
- **D.** Correct. Once inside an `su -` shell everything run is anonymous within that shell, whereas `sudo` records each command as it is run.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.sudo-vs-su](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.sudo-vs-su)

### 53. A

*cloud.networking.public-vs-private-subnet · Cloud Computing Fundamentals :: Networking · depth 3 · discrimination*

Azure diverges from the AWS route-table-only framing by exposing a subnet property, `defaultOutboundAccess`, that Microsoft itself calls making the subnet private when disabled.

- **A.** Correct. Microsoft documents a subnet property that governs outbound reachability directly, in contrast with AWS's route-table-only mechanism.
- **B.** Azure exposes a subnet property that Microsoft documents as directly governing outbound reachability; the route-table-only framing is AWS's, not portable to Azure without qualification.
- **C.** The property refers to outbound reachability generally, not specifically to whether a NAT gateway resource is attached.
- **D.** Azure does associate route tables per subnet, but the specific mechanism this question describes is the dedicated outbound-access property, not the presence or absence of a route table.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.public-vs-private-subnet](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.public-vs-private-subnet)

### 54. A

*pm.software-application-architecture.message-queue · IT Project Management Fundamentals :: Software Application Architecture · depth 1 · recall*

AMQP 1.0 models a queue as a node that stores and forwards messages between a producer and consumer named as separate elements — decoupling in time is the point, which is what separates a queue from an API call or a queryable store.

- **A.** Correct. Store-and-forward between two separate elements is exactly the decoupling-in-time property that distinguishes a queue from a direct call.
- **B.** The specification models the queue as a store-and-forward node passing messages on, not a store other components query arbitrarily like a table.
- **C.** Nothing in the store-and-forward model forbids a direct call between the two elements; the queue describes one route a message may take, not the only channel the two are permitted to use.
- **D.** Messages are normally consumed and removed rather than queried like a database — a real behaviour this denies.

Study it: [06-it-project-management/software-application-architecture.md#s-software-application-architecture-interfaces](../study-guide/06-it-project-management/software-application-architecture.md#s-software-application-architecture-interfaces)

### 55. A

*sysadmin.troubleshooting.exit-status · System Administration Fundamentals :: Troubleshooting · depth 3 · command*

Exit status is the value scripts, systemd and CI pipelines actually check, and zero always means success regardless of what a command printed. A command that writes a scary line to stderr and exits 0 is a success as far as every automated caller is concerned.

- **A.** Correct. Exit status, not printed output, is how scripts and pipelines detect failure, and 0 is unambiguous success regardless of what was written to the terminal.
- **B.** `$?` is exactly the mechanism the shell and every automated caller use to detect failure; the alarming text was not the failure signal.
- **C.** A missing execute bit produces 126, not 0; 0 always means the command ran and exited successfully.
- **D.** Nothing about an ad hoc shell command's exit status reflects a wrapping unit's state; the two are unrelated in this scenario.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.exit-status](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.exit-status)

### 56. D

*devops.git-concepts.tag · DevOps Fundamentals :: Git Concepts · depth 3 · application*

A tag is a fixed label on one commit, conventionally used to mark a release; the defining contrast with a branch is that a tag does not move, while committing advances a branch and leaves every tag exactly where it was. `git tag -a v1.4.0 -m "Release 1.4.0"` creates an annotated tag, the form the documentation describes as meant for releases.

- **A.** A tag can be checked out too, into detached HEAD; the real reason to prefer a tag here is that it stays fixed, while a branch would keep moving as `main` gains commits.
- **B.** They are both names pointing at a commit, which is exactly what makes them interchangeable-looking, but only a tag is guaranteed not to move as new commits are made.
- **C.** A stash holds uncommitted working-tree changes and has nothing to do with recording release notes on a branch or tag.
- **D.** Correct. The defining contrast is movable versus fixed: a branch is meant to keep advancing, while a tag is meant to stay pointed at one specific commit forever.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.tag](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.tag)

### 57. C

*security.sensitive-data.data-loss-prevention · Security Fundamentals :: Sensitive Data · depth 2 · application*

DLP is not a firewall: a firewall decides by address, port and protocol, while DLP decides by what the payload contains, which is why it can permit a connection at the network layer and still block one message across it once the content inside is inspected. The two controls answer different questions and operate at different points in the same path.

- **A.** This treats the firewall's address-and-port decision as the only control on the path, ignoring that DLP inspects content at a different layer entirely.
- **B.** DLP and firewalling are both network controls operating on traffic; neither is an access control model governing subjects and objects the way DAC or MAC does.
- **C.** Correct. The two controls operate on different information, which is exactly why one can permit a connection while the other blocks a single message across it.
- **D.** A secrets manager stores and hands out credentials; detecting a credential inside outbound traffic and blocking it is exactly the content-inspection job DLP performs.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.data-loss-prevention](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.data-loss-prevention)

### 58. D

*linux.linux-operating-system.ram · Linux Fundamentals :: Linux Operating System · depth 3 · command*

The kernel uses otherwise-idle RAM as disk cache, so the raw 'free' column looks low even when memory is not actually constrained. `free`'s 'available' column is the one that estimates real headroom for a new process.

- **A.** 'free' is a RAM figure, not a storage-device one, and it is exactly the column the guide warns against trusting for pressure judgements.
- **B.** `free` calculates `used` as total minus available, so it does already exclude reclaimable memory, but a large `used` value on its own does not establish that the system is near an OOM kill.
- **C.** Load average measures CPU contention, not memory state; `free`'s own columns are what is needed to judge memory pressure specifically.
- **D.** Correct. The guide is explicit that 'free' looks misleadingly low because idle RAM is being used as disk cache; 'available' is the honest figure for this judgement.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.ram](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.ram)

### 59. D

*cloud.performance-availability.high-availability · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · discrimination*

A high provider SLA is a promise about the platform's own shortfall risk. A customer who deploys a single instance in a single zone has built no redundancy or failover of their own, so their service's availability is set by their architecture, not by the number in the contract.

- **A.** This is the substitution the SLA comparison warns against: a high provider SLA does not make an unredundant single-zone deployment highly available.
- **B.** An SLA is a contract with a remedy, not an architecture; it names no redundancy or failover mechanism at all.
- **C.** Both are availability percentages over a window, which makes them directly comparable; the issue is what produced each one, not their comparability.
- **D.** Correct. An SLA prices the provider's own shortfall; it says nothing about what an unredundant deployment built on top of it will achieve.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.high-availability](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.high-availability)

### 60. B

*sysadmin.troubleshooting.permission-denied · System Administration Fundamentals :: Troubleshooting · depth 4 · diagnostic*

The single most common miss on this fault is the traversal case: the file's own mode is fine and a parent directory's is not. `namei -l` walks the path component by component and shows exactly where that traversal bit is missing, which `ls -l` on the file alone cannot reveal.

- **A.** A traversal denial happens at the kernel level during path lookup and is not something the application's own service log would explain.
- **B.** Correct. Path resolution requires search permission on every directory in the prefix, so a perfectly readable file under a restrictive parent is unreachable, and that check isolates exactly that case.
- **C.** The file's own mode already looks fine, so widening it further does not address a parent-directory or credential cause and permanently weakens a file that wasn't the problem.
- **D.** Inode exhaustion blocks creating or writing new files, not reading an existing one, and it produces "No space left on device," not "Permission denied."

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.permission-denied](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.permission-denied)

