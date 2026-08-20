<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 10 — answers

### 1. D

*sysadmin.best-practices.documentation · System Administration Fundamentals :: Best Practices · depth 3 · application*

Documentation states what is true now, kept next to the system it describes. A change history, however complete, records what happened over time and leaves reconstructing the present state as unfinished work — which is precisely the burden documentation removes.

- **A.** More history still requires reconstruction; it does not itself state the current configuration and its rationale.
- **B.** A runbook instructs what to do during an incident; it does not describe what the host is or why it is configured as it is.
- **C.** A change history and a current-state description answer different questions; one being complete does not produce the other.
- **D.** Correct. A stack of change records is not documentation, because nobody should have to replay history to learn what is true now.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.documentation](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.documentation)

### 2. B

*cloud.best-practices.backup-and-recovery-in-cloud · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

'The provider backs it up' misreads the shared responsibility model: the durability of the storage service is the provider's, but the retention policy and the restore are the customer's to build and test.

- **A.** Managed durability is not the same as a retained, restorable backup with a policy the customer controls.
- **B.** Correct. Provider durability guarantees the underlying storage will not silently corrupt; it says nothing about how far back the customer can restore.
- **C.** That distinction matters, but the assumption in the stem is specifically about who owns the backup obligation, not about replication versus backup.
- **D.** Autoscaling governs compute capacity in response to load; it has no bearing on data retention.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.backup-and-recovery-in-cloud](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.backup-and-recovery-in-cloud)

### 3. A

*linux.command-line.aliases · Linux Fundamentals :: Command Line · depth 3 · application*

`type` distinguishes an alias from a function, a builtin and a file on `PATH`, while `which` cannot see the first three at all — it only reports the file `rm` would resolve to if there were no alias shadowing it.

- **A.** Correct. `type` reports what a name actually resolves to — alias, function, builtin or file — while `which` only reports a file on `PATH` and says nothing about an alias shadowing it.
- **B.** `which rm` reports the file on `PATH`, ignoring an alias entirely; it would show the same result on both accounts even though their actual behaviour differs.
- **C.** A man page documents the command itself, not a particular account's shell configuration; it has no way to reflect an alias defined in `~/.bashrc`.
- **D.** History records commands that were run, not their definitions; it does not show whether a name is currently aliased.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.aliases](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.aliases)

### 4. D

*security.compliance.data-retention-obligations · Security Fundamentals :: Compliance · depth 3 · application*

Data retention obligations are floors imposed from outside, pointing in the opposite direction from an erasure right. GDPR Article 17(3) reconciles the two explicitly, disapplying erasure only to the extent a legal obligation requires the processing, so the two rules are reconciled record category by record category rather than one simply overriding the other.

- **A.** Article 17(3) explicitly disapplies erasure to the extent a legal retention obligation requires the processing, so a blanket erasure would itself be non-compliant.
- **B.** That practice governs the organisation's own ceiling on keeping data once its purpose ends; a statutory retention obligation is a floor imposed from outside that this practice must still respect.
- **C.** An obligation imposed from outside the organisation cannot be shortened by an internal policy that disagrees with it.
- **D.** Correct. GDPR resolves the conflict explicitly, carving out only the specific records the retention obligation covers.

Study it: [04-security/compliance.md#c-security.compliance.data-retention-obligations](../study-guide/04-security/compliance.md#c-security.compliance.data-retention-obligations)

### 5. A

*devops.containers.container-security-basics · DevOps Fundamentals :: Containers · depth 2 · application*

A value passed through `ARG` or set with `ENV` persists in the image and can be recovered from it even if a later instruction unsets it, because layers record history and nothing erases an earlier one — the only reliable approach is to never write a secret into a layer at all.

- **A.** Correct. A layer records history rather than current state, so a value written and then unset is still readable from the earlier layer that recorded it.
- **B.** Layers are additive history; unsetting a variable in a later instruction changes the final metadata but does not retroactively remove it from the earlier layer.
- **C.** Pinning the base image's version affects reproducibility of the build, not whether an `ARG` value persists in a layer once written.
- **D.** Both an `ARG` value used during the build and an `ENV` default persist in the image's layers or configuration; using `ARG` alone does not make it safe.

Study it: [05-devops/containers.md#c-devops.containers.container-security-basics](../study-guide/05-devops/containers.md#c-devops.containers.container-security-basics)

### 6. D

*pm.functional-analysis.specification-documentation · IT Project Management Fundamentals :: Functional Analysis · depth 2 · application*

A specification's quality caps what verification can catch: no test can pass or fail a statement whose terms have no measurable meaning, because no two readers have to agree on what it demands. Review checklists exist to catch exactly this before it reaches a tester — they call out unverifiable words such as 'flexible,' 'user-friendly' and 'fast,' and they require one thought per requirement statement.

- **A.** A real quality attribute needs a threshold and a condition to be measured under; 'flexible' names no measurable quality at all.
- **B.** Traceability is a separate property from testability; an untestable requirement is defective whether or not it happens to be linked to a test case.
- **C.** The 'shall' form signals intent to state a requirement, but it guarantees nothing about whether the requirement is measurable.
- **D.** Correct. Two readers can hold opposite readings of 'flexible' and both be right, and stating two requirements in one sentence means half of it can pass while the other half fails unnoticed.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.specification-documentation](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.specification-documentation)

### 7. D

*sysadmin.best-practices.monitoring-and-alerting · System Administration Fundamentals :: Best Practices · depth 3 · application*

Alerting on conditions that need no action trains people to ignore alerts, so the next genuine one is dismissed with it. The distinguishing feature here is that the channel was staffed and reachable — the failure is alert quality, not the separate case of a notification reaching nobody.

- **A.** Nothing in the scenario turns on whether a procedure existed; the failure is that the alert was never seen at all.
- **B.** Whether disruptive work is scheduled is unrelated to why an unscheduled outage's alert was ignored.
- **C.** That is a different, real failure mode this practice also names, but it is not what is described: the channel was staffed, and was muted deliberately.
- **D.** Correct. Alerting on conditions that need no action is the reverse failure to under-alerting, and it is just as examinable.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.monitoring-and-alerting](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.monitoring-and-alerting)

### 8. D

*cloud.best-practices.right-size-before-you-scale · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

Scaling multiplies whatever the unit costs, including its waste: autoscaling a workload that idles at 5% CPU on an oversized instance type buys more idle capacity at a higher total cost for the same useful work — the per-unit rate is unchanged — which is the documented failure mode of scaling before correcting the unit.

- **A.** Autoscaling adjusts how many instances run, not the type or size of the instance itself.
- **B.** Reserved pricing is a separate purchasing decision; enabling autoscaling does not change the rate charged per instance.
- **C.** Spreading a fixed load across more instances lowers per-instance utilisation rather than raising it, while adding cost for the extra capacity.
- **D.** Correct. Autoscaling changes the number of units running; it does not correct the fact that each unit is oversized for the load.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.right-size-before-you-scale](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.right-size-before-you-scale)

### 9. C

*sysadmin.best-practices.user-onboarding-and-offboarding · System Administration Fundamentals :: Best Practices · depth 2 · application*

Onboarding failures announce themselves within the hour; offboarding failures are silent, because a credential still valid and attached to nobody is watched by nobody. Disabling the login account is only the start — installed keys, tokens, certificates and shared secrets all typically outlive it.

- **A.** An enumerated list of everything an identity can hold typically extends well beyond the one account that was disabled.
- **B.** Least privilege bounds how much an identity holds at any moment; offboarding is the separate question of completely removing what it holds when it departs.
- **C.** Correct. Disabling the login account is not revoking access; everything held outside that account survives its disabling untouched.
- **D.** The inventory records systems and ownership; it is not a prerequisite for revoking a departing employee's credentials.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.user-onboarding-and-offboarding](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.user-onboarding-and-offboarding)

### 10. B

*linux.command-line.command-substitution · Linux Fundamentals :: Command Line · depth 2 · discrimination*

A pipe sends output to another command's standard input; substitution turns output into arguments instead. A command that does not read standard input, such as `echo` or `rm`, can only be fed by substitution.

- **A.** A pipe only helps if the receiving command reads standard input; `echo` does not, so piped text would simply be discarded.
- **B.** Correct. A pipe sends output to another command's standard input, which `echo` ignores; command substitution instead turns output into an argument, which is exactly what a non-input-reading command needs.
- **C.** `<` feeds a file to standard input, the same channel `echo` does not read; it does not place anything into the argument list.
- **D.** Command substitution specifically exists to solve this — turning another command's output into an argument for a command that never reads standard input.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-substitution](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-substitution)

### 11. C

*security.compliance.data-sovereignty-and-residency · Security Fundamentals :: Compliance · depth 2 · recall*

Residency is where data physically sits; sovereignty is which legal system it is subject to, following from residency and from who operates the service and under whose law. Selecting an EU region fixes residency but does not, on its own, settle sovereignty.

- **A.** Sovereignty follows from residency and from who operates the service and under whose law that operator is incorporated, not from region choice alone.
- **B.** GDPR imposes no general localisation rule and needs no derogation for data that simply stays within the EU; derogations concern transfers to third countries instead.
- **C.** Correct. A provider incorporated elsewhere may remain subject to its home jurisdiction's demands regardless of where the bytes live.
- **D.** Region choice has no bearing on retention periods, which are set by separate statutory, contractual or purpose-based rules.

Study it: [04-security/compliance.md#c-security.compliance.data-sovereignty-and-residency](../study-guide/04-security/compliance.md#c-security.compliance.data-sovereignty-and-residency)

### 12. C

*sysadmin.disaster-recovery.hot-warm-and-cold-sites · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

Cost falls and recovery time rises as you move from hot to cold. The tier is a purchase of readiness, and readiness is what shortens the outage — so the two move in opposite directions by construction.

- **A.** Both cannot improve; the saving is paid for in recovery speed.
- **B.** That is the direction of travel toward a hot site, not away from one.
- **C.** Correct. Less standing capability is cheaper to hold and slower to bring into service.
- **D.** Site tier drives cost and recovery time; data loss is bounded by copy frequency instead.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.hot-warm-and-cold-sites](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.hot-warm-and-cold-sites)

### 13. D

*devops.containers.docker-compose · DevOps Fundamentals :: Containers · depth 3 · command*

`docker compose up` creates the network, volumes, and containers declared in the file, in dependency order, all on the single host the command runs on; `-d` detaches so the shell returns immediately while the services keep running.

- **A.** Compose is a single-host tool; every service in the project runs on the one machine where the command was issued, with no cross-host distribution.
- **B.** Compose creates the network and volumes declared in the file as part of the same command, not as a separate manual step.
- **C.** `docker compose up` reuses existing images unless a rebuild is requested with `--build`; it does not rebuild unconditionally on every invocation.
- **D.** Correct. `-d` runs it detached; Compose brings up every declared service together on that one machine, respecting the dependencies declared between them.

Study it: [05-devops/containers.md#c-devops.containers.docker-compose](../study-guide/05-devops/containers.md#c-devops.containers.docker-compose)

### 14. C

*cloud.budgeting.cost-monitoring · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

Monitoring's breakdown by service, account, region and tag is what a bare total cannot provide: a rise in the bill does not imply a rise in the number of resources, since more egress, more requests, an expired allowance, or an ending reservation term can each raise it with the inventory unchanged.

- **A.** A budget threshold only fires if one was configured with a target in the first place; nothing about a rising bill guarantees that one exists or has fired.
- **B.** An orphan is a resource with no purpose left; the scenario states inventory is entirely unchanged, which is not consistent with a new orphan appearing.
- **C.** Correct. A rise in the bill does not imply a rise in resource count: more egress, more requests, an ending allowance, or an ending reservation term will each raise the bill with the inventory unchanged, and diagnosing by counting instances misses all four.
- **D.** This is exactly the assumption monitoring's breakdown exists to correct — several causes raise a bill with no new resources involved at all.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.cost-monitoring](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.cost-monitoring)

### 15. C

*linux.command-line.command-syntax · Linux Fundamentals :: Command Line · depth 3 · application*

A double hyphen on its own marks the end of options, so any operand after it — including one that starts with a hyphen — is treated as an operand rather than parsed as an option.

- **A.** Quoting stops the shell from expanding the word, but the command itself would still parse a leading hyphen as an option.
- **B.** A backslash escapes shell metacharacters; a hyphen has no special meaning to the shell, so this changes nothing about how the command parses its arguments.
- **C.** Correct. A double hyphen on its own is the end-of-options marker; every word after it is treated as an operand even if it starts with a hyphen.
- **D.** Writing `./-r` does keep the argument from beginning with a hyphen, but it works by rewriting the pathname itself rather than by marking where options stop, and it does nothing for an operand that is not a pathname.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-syntax](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-syntax)

### 16. C

*pm.open-source-software-and-licensing.forking-a-project · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · discrimination*

In the governance sense, forking is a deliberate, permanent split with independent maintainers; in day-to-day platform vocabulary, "fork" also names a server-side repository copy created as the first step of an ordinary contribution — the opposite outcome.

- **A.** Cloning copies a repository locally; forking creates a server-side copy, typically used when the contributor lacks write access to the original.
- **B.** Neither meaning of "fork" depends on a CLA; a CLA concerns contributing changes back, not the act of copying a repository.
- **C.** Correct. The two meanings point in opposite directions: one ends in rejoining upstream, the other is a deliberate, lasting split.
- **D.** Open source licences grant the right to make and distribute derived works automatically; no separate permission from the original project is required.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.forking-a-project](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.forking-a-project)

### 17. D

*sysadmin.networking.dhcp-reservation · System Administration Fundamentals :: Networking · depth 3 · application*

A reservation is not a static address. The client is still a DHCP client, so on a first boot with the server unreachable it has no lease at all, while a statically configured host comes up without needing the server.

- **A.** A reservation still requires a successful DHCP exchange at boot; unlike a static address held by the host itself, it fails to come up if the server is unreachable.
- **B.** A statically configured host does not depend on DHCP at all, so a DHCP server outage has no bearing on whether it comes up; only the reservation-based client is affected.
- **C.** A reservation is a server-side binding and nothing about it is stored on the client. A DHCP client may reuse a previously granted, still-unexpired lease when no server answers, but a machine booting for the first time has no such lease to reuse.
- **D.** Correct. A reservation is not a static address: the client is still a DHCP client, so on a first boot with the server unreachable it has no remembered lease to reuse and comes up with no address, whereas a statically configured host comes up regardless.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dhcp-reservation](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dhcp-reservation)

### 18. B

*sysadmin.networking.fqdn-and-hostname · System Administration Fundamentals :: Networking · depth 3 · application*

`hostname -f` asks for the FQDN, which is resolved rather than merely read, and therefore depends on `/etc/hosts` or DNS returning a qualified name; its failure means nothing resolves the short name to a qualified one, usually a missing hosts entry, not that the hostname is unset.

- **A.** A plain `hostname` succeeding proves the hostname configuration exists; the `-f` failure is about resolving a qualified form, not about the base configuration being missing.
- **B.** Correct. `hostname -f` depends on resolution succeeding, so its failure is a resolution problem, most often a missing hosts entry, and not evidence that the hostname configuration is absent.
- **C.** `hostname -f` is a flag of the `hostname` command itself, not a systemd-specific feature; `hostnamectl` is the systemd-specific tool, and its absence is a different matter entirely.
- **D.** `hostname -f` depends on name resolution, not on DHCP addressing; a host can have a perfectly good DHCP-issued address while `hostname -f` still fails to resolve a qualified name.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.fqdn-and-hostname](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.fqdn-and-hostname)

### 19. D

*security.compliance.risk-assessment · Security Fundamentals :: Compliance · depth 2 · application*

Risk response is the separate activity of deciding what to do about an already-assessed risk. Accepting, avoiding, mitigating, sharing and transferring are the five recognised responses, and buying insurance is a textbook case of transfer.

- **A.** Insurance changes who bears the cost of an incident; it does not reduce the likelihood of the incident happening, which is what mitigation targets.
- **B.** Transfer, alongside accept, avoid, mitigate and share, is one of the named risk responses, and insurance is a standard example of it.
- **C.** Purchasing insurance is a response to a risk that was already ranked, not a re-run of the identification and ranking activity.
- **D.** Correct. Buying insurance transfers the financial consequence of the risk to a third party, one of the named risk responses.

Study it: [04-security/compliance.md#c-security.compliance.risk-assessment](../study-guide/04-security/compliance.md#c-security.compliance.risk-assessment)

### 20. C

*cloud.budgeting.storage-tiers-and-lifecycle-policies · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

Archive is offline: a blob in archive cannot be read or modified until it has been rehydrated to an online tier, which takes hours. It is not merely a slower hot tier, so nothing with a latency requirement can be placed there regardless of price.

- **A.** Cost monitoring reports spend after the fact; it has no role in making an offline archived blob readable.
- **B.** An egress charge is a cost incurred by the read; it is not a substitute for the rehydration step archive requires before any read can occur at all.
- **C.** Correct. Archive is an offline tier: a blob cannot be read or modified at all until rehydrated to an online tier, which takes hours, so nothing with a latency requirement can sit there regardless of price.
- **D.** Archive is not simply a slower hot tier — it is offline, and no read succeeds at all until the rehydration step finishes.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.storage-tiers-and-lifecycle-policies](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.storage-tiers-and-lifecycle-policies)

### 21. B

*linux.command-line.file-transfer · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`rsync` compares source and destination first and transfers only what differs, which is what makes repeated runs cheap. `scp` and `sftp` always send the whole file regardless of what is already at the far end. The invocation behind that delta transfer is `rsync -av`.

- **A.** Both tools authenticate exactly as an SSH login does; the deciding factor for a repeated sync is delta transfer, which `scp` does not perform at all.
- **B.** Correct. `rsync` compares source and destination first and sends only what changed, which makes repeated runs of a mostly-unchanged tree far cheaper than `scp` or `sftp`, which always send the whole file regardless of what already exists at the far end.
- **C.** Sharing a transport does not make them equally efficient for repeated syncs; only `rsync` compares both ends first to avoid re-sending unchanged data.
- **D.** `sftp` transfers whole files just like `scp`, with no caching of previous transfers that would let it skip unchanged content.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-transfer](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-transfer)

### 22. A

*devops.devops-basics.blue-green-deployment · DevOps Fundamentals :: DevOps Basics · depth 3 · application*

A shared database that both versions must use silently removes the instant-rollback property, because switching traffic back does not un-apply a schema change or un-write rows the new version already created.

- **A.** Correct. A shared database silently removes the instant-rollback property, since traffic can switch back but the data cannot.
- **B.** Code and data rollback are separate concerns, and redeploying old code never automatically undoes writes or migrations.
- **C.** Blue-green switches all traffic at one cutover; there is no percentage split at any point, unlike canary.
- **D.** The old environment being untouched only protects the code path; a shared database is written to by whichever version is live.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.blue-green-deployment](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.blue-green-deployment)

### 23. B

*sysadmin.networking.mac-address · System Administration Fundamentals :: Networking · depth 3 · application*

`ip link` is the layer 2 command, printing each interface with its MAC in the `link/ether` field; `ip addr` is layer 3 only, which is why expecting a hardware address from it is a common mistake.

- **A.** `ip -6 addr` restricts output to IPv6 addressing and prints nothing at all for an interface that has no IPv6 address; it never adds hardware address information.
- **B.** Correct. `ip link` is the layer 2 view of an interface and `link/ether` is the field carrying the MAC; ifconfig(8) itself directs readers to ip-link(8) to display link layer information including the hardware address.
- **C.** `ip route` shows the routing table — destinations, next hops and interfaces — and does not display hardware addresses at all.
- **D.** `ip neigh` shows the neighbour (ARP) cache of other hosts' resolved addresses, not the local interface's own hardware address, which `ip link` reports.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.mac-address](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.mac-address)

### 24. D

*cloud.cloud-computing.essential-characteristics · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · recall*

NIST SP 800-145 defines cloud computing through exactly five essential characteristics: on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service. Plausible-sounding substitutes — multi-tenancy, pay-as-you-go, virtualization, high availability — are each real, but none of them is one of the five itself.

- **A.** Multi-tenancy and pay-as-you-go are real properties, but NIST folds them inside resource pooling and measured service rather than listing them as separate characteristics.
- **B.** Virtualization and high availability are not among NIST's five; virtualization is an enabling technology and high availability is a design goal, not a defining characteristic.
- **C.** Vendor neutrality is not one of NIST's five characteristics at all, and this list also drops on-demand self-service entirely.
- **D.** Correct. These are exactly the five characteristics NIST's definition lists.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.essential-characteristics](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.essential-characteristics)

### 25. B

*pm.project-management.agile · IT Project Management Fundamentals :: Project Management · depth 3 · application*

Agile is a set of values and principles; Scrum is one framework that operationalises them, with its own accountabilities, events and artefacts. Substituting 'we run Scrum's ceremonies' for 'we hold agile's values' is the examinable move — a team can hold every event and still violate the principles beneath them.

- **A.** The statement doesn't mention the Review or Retrospective specifically, so that particular pair isn't what's being confused here.
- **B.** Correct. Running Scrum's events faithfully is not the same as holding the values those events serve; a team can run the calendar while violating the principles.
- **C.** The Manifesto is a statement of values; attending meetings is a mechanism, and mechanism without the underlying preference doesn't establish it.
- **D.** The statement describes Scrum's iteration, not Kanban's flow, so this pairing isn't the confusion in play.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.agile](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.agile)

### 26. C

*sysadmin.networking.open-closed-and-filtered-ports · System Administration Fundamentals :: Networking · depth 4 · application*

"Closed" is not "blocked": a closed port is a cooperative answer from a working host, and it proves layer 3 reachability — for TCP, a SYN to a closed port is answered with RST, an answer that arrives fast, unlike the silence a filtered port produces.

- **A.** A silently dropped connection attempt is reported as filtered, not closed; closed specifically means the host answered with an RST, proving the packet reached a live host.
- **B.** A closed port specifically means a live, existing host answered; a nonexistent host would more typically produce a routing failure or a timeout, not a cooperative RST response.
- **C.** Correct. "Closed" is not "blocked": a closed port is a cooperative answer from a working host, and it proves reachability, which is the opposite of what a silent, filtered block would indicate.
- **D.** A closed UDP port is not a firewall signature: closed UDP ports usually answer with an ICMP port unreachable error, which is exactly how a scan reports them closed. The genuinely ambiguous UDP case is silence, which is reported as open or filtered rather than closed.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.open-closed-and-filtered-ports](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.open-closed-and-filtered-ports)

### 27. A

*security.security.hashing · Security Fundamentals :: Security · depth 3 · command*

`sha256sum -c` compares a locally computed digest against a file of previously recorded ones and reports OK or FAILED per entry. A match tells you the bytes you received are the bytes that were hashed — integrity — but says nothing about who produced them, since a digest carries no signature and no key.

- **A.** Correct. `sha256sum -c` reads a file of previously recorded digests and reports OK or FAILED, and a digest match by itself establishes integrity, not origin.
- **B.** `md5sum` computes MD5 digests, not SHA-256, and MD5 is broken for collision resistance; it would not correctly validate a SHA256SUMS file at all.
- **C.** `gpg --verify` checks a cryptographic signature against a key, a different operation from comparing digests, and it requires an actual signature file to check against.
- **D.** A checksum proves only that the bytes match a value; it says nothing about who produced that value, which is what a signature is for.

Study it: [04-security/security.md#c-security.security.hashing](../study-guide/04-security/security.md#c-security.security.hashing)

### 28. A

*linux.command-line.grep · Linux Fundamentals :: Command Line · depth 3 · application*

`-i` ignores case, `-n` prefixes each output line with its line number, and `-v` inverts the selection to print non-matching lines — combined, `grep -inv healthy app.log` gives every case-insensitive non-match with its line number.

- **A.** Correct. `-i` makes the match case-insensitive, `-n` prefixes each line with its number, and `-v` inverts the selection to print lines that do not match — together they give exactly the requested output.
- **B.** `-c` prints only a count of matching lines, with no line text or numbers at all, and does not invert the selection the way this task needs.
- **C.** `-r` makes `grep` recurse into directories; it neither numbers lines nor inverts the selection, and it would be unnecessary against a single file.
- **D.** Matching is not case-insensitive by default; omitting `-i` here would miss a line spelled "Healthy" or "HEALTHY", and this option also drops the requested line numbers.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.grep](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.grep)

### 29. A

*sysadmin.networking.routing-table · System Administration Fundamentals :: Networking · depth 3 · application*

A more specific route always beats a less specific one, so adding a /32 host route for exactly one destination redirects only that address while leaving every other destination on its existing path — a useful, precise technique that is easy to forget when diagnosing an oddly-behaving single host.

- **A.** Correct. A /32 matches only the single address it names, and longest-prefix-match rules guarantee it is preferred over any less specific route, leaving everything else on the existing path.
- **B.** Adjusting the default route's metric affects every destination that falls back to it, not just the one address in question; it cannot selectively redirect a single destination.
- **C.** `/etc/hosts` affects name-to-address resolution, not which next hop is used to reach a given address; routing decisions are made from the routing table, independent of naming.
- **D.** Removing the default route would break every destination that relies on it, not just redirect the one address in question, which is a much broader and unwanted change.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.routing-table](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.routing-table)

### 30. C

*cloud.cloud-computing.iaas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

A virtual machine is the canonical IaaS product, but IaaS also covers block storage volumes and virtual networks provisioned as raw building blocks the customer assembles themselves. A question about provisioning a virtual network, with no VM yet involved, is still an IaaS question for exactly that reason.

- **A.** A virtual machine is the most familiar IaaS product, but the guide is explicit that provisioning a virtual network is still an IaaS question, not a non-answer.
- **B.** PaaS is defined by deploying application code onto a managed platform; raw storage and network provisioning with no application involved is squarely IaaS.
- **C.** Correct. NIST's definition names processing, storage and networks together as IaaS resources; a VM is the canonical example, not the only one.
- **D.** Attaching a managed database would make that specific component a managed service, but it has no bearing on whether the storage and network provisioning itself counts as IaaS.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.iaas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.iaas)

### 31. B

*devops.devops-basics.silos-and-shared-responsibility · DevOps Fundamentals :: DevOps Basics · depth 2 · discrimination*

A silo is an incentive boundary, not an org-chart boundary. Merging two teams while leaving developers rewarded for velocity and operators for uptime leaves the conflict, and the silo, exactly where it was.

- **A.** Reporting structure is not what the concept turns on; unchanged incentives are what preserve a silo.
- **B.** Correct. The discrimination the exam wants is exactly this: incentives, not org charts, define the silo.
- **C.** A reorganisation on paper is not the culture change DevOps requires; the incentives described here have not moved.
- **D.** Release cadence is a downstream effect of removing the silo, not the test for whether it has been removed.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.silos-and-shared-responsibility](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.silos-and-shared-responsibility)

### 32. B

*sysadmin.networking.well-known-ports · System Administration Fundamentals :: Networking · depth 3 · recall*

The conventional well-known assignments worth memorising include 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP and 443 HTTPS, all within the 0-1023 well-known range, with `ss -tulpn` remaining the only authoritative statement about what a given host is actually listening on.

- **A.** Every pairing here is shifted one position off from the actual conventional assignment; 22 is SSH, not HTTP, and the pattern continues that way down the list.
- **B.** Correct. These are exactly the conventional service-to-port assignments an administrator is expected to recognise on sight in the well-known 0-1023 range.
- **C.** 443 is conventionally HTTPS, not MySQL; MySQL's conventional assignment is 3306, a registered port entirely outside this list.
- **D.** 25 is conventionally SMTP and 53 is conventionally DNS; this pairing has those two specifically swapped relative to their correct assignments.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.well-known-ports](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.well-known-ports)

### 33. C

*linux.command-line.redirection · Linux Fundamentals :: Command Line · depth 3 · application*

`&>` is a bash and zsh feature, not POSIX, so it is a portability trap in a script targeting `/bin/sh`. `> file 2>&1` achieves the same "both streams to one file" result and works everywhere.

- **A.** `&>` is a convenient bash and zsh shortcut for the same result, but it is not POSIX and will not work under a strict `/bin/sh`.
- **B.** Opening the same file independently for each descriptor can interleave writes unpredictably rather than reliably merging them; it is not the standard portable idiom.
- **C.** Correct. This form is POSIX-portable: it opens the file for descriptor 1, then duplicates descriptor 1's destination onto descriptor 2, working on any POSIX-compliant shell.
- **D.** `tee` reads standard input from a pipe, but a plain pipe still carries only descriptor 1 by default, so error output would not reach it without the same `2>&1` merging step first.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.redirection](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.redirection)

### 34. D

*security.security.insider-threat · Security Fundamentals :: Security · depth 2 · application*

An insider already holds legitimate access, so they pass authentication normally, never cross a perimeter to be filtered, and exploit no software flaw for patching to address. What does apply is least privilege and need-to-know limiting reach, separation of duties, and accounting and auditing to detect and attribute the misuse afterward.

- **A.** Geography plays no role in why these controls miss an insider; the reason is that the actor's access is legitimate, not where they are located.
- **B.** MFA, filtering and patching are preventive controls; what actually addresses an insider is a different set of preventive and detective controls, not a shift in control type generally.
- **C.** There is no delayed engagement here; these controls simply have nothing to check, since the contractor's login and access were already legitimate throughout.
- **D.** Correct. The guide states plainly that the insider passes authentication legitimately, which is exactly why the controls that dominate the rest of this competency do not engage at all.

Study it: [04-security/security.md#c-security.security.insider-threat](../study-guide/04-security/security.md#c-security.security.insider-threat)

### 35. A

*pm.project-management.critical-path · IT Project Management Fundamentals :: Project Management · depth 1 · recall*

The critical path is the longest chain of dependent tasks through the schedule, and its length sets the earliest possible finish. 'Critical' is a statement about duration and float, not importance or difficulty — shortening a task that isn't on that chain typically buys no time, which is the discrimination this question shape is built to test.

- **A.** Correct. 'Critical' means longest-duration and zero-float, not most important — a task off that chain can typically shrink or grow without moving the finish.
- **B.** Only tasks on the critical path affect the finish date; shortening others usually buys no time at all.
- **C.** A Gantt chart is a display of the schedule, not the mechanism that determines the finish date — that mechanism is which chain of dependencies is longest.
- **D.** The work breakdown structure has no time axis and no bearing on the schedule's finish date at all.

Study it: [06-it-project-management/project-management.md#s-project-management-planning](../study-guide/06-it-project-management/project-management.md#s-project-management-planning)

### 36. A

*sysadmin.system-administration.daemon · System Administration Fundamentals :: System Administration · depth 3 · discrimination*

A daemon is defined by how it runs — detached from a terminal, long-lived — which this program achieves through the classic double-fork pattern. A service is a management layer on top of that, and without a unit file nothing restarts it or brings it back at boot, so it is a daemon without being a service.

- **A.** Correct. "Daemon" describes how the process runs, while "service" describes whether a management layer wraps it — this program has the first property but not the second.
- **B.** The two terms are not interchangeable: a program can detach itself perfectly well without any unit file, in which case it is a daemon but not a managed service.
- **C.** A service specifically implies a supervision policy — starting, stopping, restarting — which this program has none of without a unit file.
- **D.** The classic self-detaching pattern (fork, `setsid()`, re-parent to PID 1) is exactly what makes a process a daemon, with or without systemd managing it.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.daemon](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.daemon)

### 37. B

*cloud.cloud-computing.public-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

NIST defines public cloud as infrastructure provisioned for open use by the general public — a statement about who may purchase the service. Customers are separated logically through accounts, virtual networks and encryption keys while sharing the same physical estate, so 'public' never implies that one customer's workload is visible to another.

- **A.** This is the misreading the term invites; isolation is enforced by the virtualization and identity layers even though the physical estate is shared.
- **B.** Correct. NIST defines public cloud by who may use the service — 'provisioned for open use by the general public' — while SP 800-146 describes tenants' workloads as 'separated only by access policies implemented by a provider's software', which is isolation, not visibility.
- **C.** Nothing about the scenario suggests the workload has moved to a private cloud; public cloud tenants are isolated from each other by design, which is sufficient on its own.
- **D.** NIST's definition allows open use by the general public and says nothing about restricting buyers to organisations; isolation, not the buyer's identity, is what protects the data.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.public-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.public-cloud)

### 38. B

*sysadmin.system-administration.foreground-and-background-jobs · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

`&` returns the prompt but the job is still the terminal session's child, so the SIGHUP sent on hangup is usually forwarded to it and kills it. `nohup` makes the command immune to that specific signal, which is the missing half of surviving a dropped SSH session.

- **A.** Backgrounding with `&` returns the prompt but leaves the job still attached to the shell, which is exactly what a hangup signal on disconnect can kill.
- **B.** Correct. When a terminal closes, the kernel sends SIGHUP to its foreground process group and most shells forward it to background jobs too, which is what `&` alone does not prevent.
- **C.** `renice` adjusts scheduling priority for an already-running process; it has no bearing on whether a job survives a terminal hangup.
- **D.** An ordinary user keeps a background job alive across a hangup with `nohup` or `disown`; nothing about surviving SIGHUP requires the service manager or PID 1.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.foreground-and-background-jobs](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.foreground-and-background-jobs)

### 39. A

*devops.git-concepts.clone-vs-fork · DevOps Fundamentals :: Git Concepts · depth 3 · application*

Cloning is a Git operation that copies a repository with its full history into a new local directory; forking is a hosting-platform operation that creates a server-side copy under the contributor's own account. The standard route when write access is missing is fork on the platform, `git clone` the fork locally, then push changes to the fork the contributor can write to.

- **A.** Correct. Forking solves the write-access problem by creating a copy the contributor owns; cloning that fork afterward gets the history onto their machine to work with.
- **B.** Clone copies what the contributor can read; whether they may push is decided entirely by the remote's permissions, and cloning changes none of that.
- **C.** A pull request names a source branch that must already exist somewhere the contributor can push to; without a fork or write access, there is no branch of theirs to name.
- **D.** Being granted write access is a change to the project's access settings, which the stem rules out; forking needs no action from the maintainers at all.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.clone-vs-fork](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.clone-vs-fork)

### 40. B

*linux.command-line.system-commands · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

When `df` reports a full filesystem that `du` says is mostly empty, a process is still holding a deleted file open, and that space is not released until the process closes it or exits — `df` counts allocated blocks, `du` only sums what it can see in the directory tree. The same family includes `ps aux` for a process snapshot, `du -sh` for a directory's total size, `uptime` for the load averages, and `uname -a` for kernel and machine details.

- **A.** `du` is accurate for what it measures — visible files in the tree it walks; the disagreement here has a specific cause, a deleted-but-open file, not a general unreliability.
- **B.** Correct. A process holding a deleted file open keeps its blocks allocated; `df` reports actual filesystem usage including that space, while `du` only sums what is visible by walking the directory tree, and cannot see an unlinked file.
- **C.** `-h` only makes the sizes human-readable; GNU df reports block usage by default and inode usage only under `-i`, and nothing in the scenario points at inode exhaustion.
- **D.** Nothing in the scenario suggests a mount boundary between the two checks; the standard explanation for this exact disagreement is a deleted file still held open by a process.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.system-commands](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.system-commands)

### 41. B

*cloud.networking.cloud-route-tables · Cloud Computing Fundamentals :: Networking · depth 2 · recall*

This is the mechanism behind the public/private classification: associating a subnet with a route table that contains a route to an internet gateway is what makes that subnet public, and nothing on the subnet records the fact.

- **A.** AWS exposes no such attribute on the subnet object; the classification is derived entirely from the associated route table's contents.
- **B.** Correct. The route table association is the mechanism behind the public/private classification.
- **C.** Attaching the gateway to the network makes it available as a route target; a subnet only becomes public once its own route table actually routes to that gateway.
- **D.** A reserved address changes nothing about routing; a subnet's public-or-private classification depends on its route table, independent of what addresses its instances hold.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cloud-route-tables](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cloud-route-tables)

### 42. A

*security.security.password-hashing-and-salting · Security Fundamentals :: Security · depth 3 · discrimination*

Hashing is one-way by construction: there is no key and no decryption step, so nothing that can be displayed back to a user was ever properly hashed. A system that can show an existing password is storing it reversibly, and calling that step "hashing" does not change what actually happened to the data.

- **A.** Correct. The guide states this exactly as the trap: a system that can show a user their existing password is storing it reversibly, which is not hashing regardless of what it is called internally.
- **B.** Hash function speed has nothing to do with whether the original input can be recovered — a one-way hash cannot be reversed regardless of how fast it runs.
- **C.** A pepper is an additional secret layered on top of hashing, not a mechanism that makes a one-way function reversible.
- **D.** Nothing in the claim describes a key pair, and password storage is expected to be one-way hashing, not any form of encryption at all.

Study it: [04-security/security.md#c-security.security.password-hashing-and-salting](../study-guide/04-security/security.md#c-security.security.password-hashing-and-salting)

### 43. D

*sysadmin.system-administration.owner-group-other · System Administration Fundamentals :: System Administration · depth 3 · application*

The owner is still matched by the owner triad, which was untouched by narrowing `other`. Removing access from one class narrows only that class's users; it does not tighten or loosen either of the other two.

- **A.** Permission classes do not combine or narrow one another; each is a self-contained answer for the users it applies to.
- **B.** The owner's access is whatever the owner triad states, not a function of the other two classes.
- **C.** The sticky bit governs deletion within a directory and has no bearing on a regular file's own read/write bits.
- **D.** Correct. Each class is evaluated independently once matched; narrowing `other` has no bearing on what the owner's own triad allows.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.owner-group-other](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.owner-group-other)

### 44. A

*linux.linux-operating-system.device-drivers-and-kernel-modules · Linux Fundamentals :: Linux Operating System · depth 3 · recall*

A device driver can be built directly into the kernel image (`Y`) or as a loadable module (`M`) that attaches and detaches at runtime. A built-in driver is already part of the running kernel and has no separate module to list in `lsmod`.

- **A.** Correct. Kconfig's `Y` means built in; `M` would mean a loadable module instead — the two are alternatives, not a hierarchy where one is always preferred.
- **B.** A `.ko` file describes a loadable module, which is what `M` produces; a `Y` marking means no separate module file exists at all.
- **C.** Firmware runs on the device's own controller and is a separate layer entirely; a Kconfig `Y` marking concerns kernel-side driver code, not device firmware.
- **D.** Kconfig's tristate option genuinely supports either compiled-in (`Y`) or module (`M`) builds; `Y` is not deprecated, and either can be the correct choice depending on the driver.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.device-drivers-and-kernel-modules](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.device-drivers-and-kernel-modules)

### 45. B

*pm.project-management.software-development-lifecycle · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

The SDLC names the phases software passes through; it says nothing about their batch size or rhythm. Waterfall completes each phase before the next begins for the whole scope at once; agile traverses the same phases repeatedly, in miniature, inside each iteration. Treating 'SDLC' as a synonym for waterfall is the single most common confusion in this competency.

- **A.** An agile team still passes through requirements, design, implementation and testing, repeatedly, in small batches; it doesn't skip them.
- **B.** Correct. The phase list describes what work must happen; how much scope moves through it at once, and how often the loop runs, is the methodology's business, not the lifecycle's.
- **C.** Maintenance is last in the conventional list, not first, and the ordering issue isn't the actual defect in the claim.
- **D.** Requirements, design, implementation and so on are development phases, not a risk-management framework.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.software-development-lifecycle](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.software-development-lifecycle)

### 46. D

*sysadmin.system-administration.process · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

`ps` reports CPU time as a share of the process's entire lifetime, while `top` reports CPU share over the interval since its last screen refresh. A process bursting briefly can look idle to the lifetime average and busy to the recent sample without either tool being wrong.

- **A.** Disagreement is expected and does not indicate a fault — the tools compute genuinely different statistics rather than reporting the same one two ways.
- **B.** Neither figure is more "accurate" than the other; they measure different things, and continuous updating does not make one the correct answer to the other's question.
- **C.** Nothing in the scenario suggests a fork; the discrepancy is fully explained by the different measurement windows the two tools use.
- **D.** Correct. The two commands answer different questions: a lifetime average can look low even while the current sampled rate is high, especially for a process with short, intense bursts.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.process](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.process)

### 47. C

*cloud.networking.internet-gateway-and-nat-gateway · Cloud Computing Fundamentals :: Networking · depth 3 · application*

An internet gateway grants two-way reachability, and a NAT gateway grants outbound-only reachability; mapping a stated requirement to the correct target is the direction question this concept turns on.

- **A.** The public/private classification is itself derived from which gateway a subnet's route table points at; it is not an alternative to attaching the gateways, it is a description of having done so.
- **B.** Both of those are filtering layers that decide which traffic is allowed once it arrives; neither grants or withholds the reachability direction itself, which is what the routing targets do.
- **C.** Correct. This matches the direction each requirement calls for exactly: two-way for the web tier, outbound-only for the application servers.
- **D.** A NAT gateway's one-way property comes from address translation, not from a rule that can be switched to two-way; it structurally cannot give the web tier the inbound reachability it needs.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.internet-gateway-and-nat-gateway](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.internet-gateway-and-nat-gateway)

### 48. A

*devops.git-concepts.remote-and-origin · DevOps Fundamentals :: Git Concepts · depth 3 · command*

A remote is a short name bound to the URL of another copy of the repository, and `git remote -v` lists every configured remote with its fetch and push URLs. `origin` is not a keyword; it is simply the name `git clone` assigns to the repository it cloned from, and additional remotes such as `upstream` are added the same way any other one is.

- **A.** Correct. It lists every configured remote alongside its fetch and push URLs, which is exactly the pairing being asked for.
- **B.** That lists branch names, including remote-tracking ones, but not the remote names and their configured URLs, which is a different piece of configuration.
- **C.** That shows commits reachable from remote-tracking refs, not the remote names and URLs behind those refs.
- **D.** The documentation is explicit that `-v` must sit between `remote` and any subcommand; it is a flag on `remote` itself and does not take a remote name as an argument this way.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.remote-and-origin](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.remote-and-origin)

### 49. A

*sysadmin.system-administration.signals · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

A process in uninterruptible sleep (state `D` in `ps`) is blocked inside a kernel call waiting on I/O and cannot respond to any signal, SIGKILL included, until that call returns. This, along with an already-dead zombie, is the standard explanation for an apparent "kill -9 did nothing" report.

- **A.** Correct. A process blocked in the kernel on I/O is not in a position to respond to any signal, including SIGKILL, until the kernel call it is stuck in resolves.
- **B.** SIGTERM (signal 15) is weaker than SIGKILL, not stronger, and neither signal can reach a process stuck in uninterruptible sleep.
- **C.** A zombie has already exited and holds only a table entry; this process is still actively blocked on I/O, a different state entirely.
- **D.** Ownership would produce a permission error immediately, not a process that appears to survive the signal indefinitely.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.signals](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.signals)

### 50. C

*security.security.symmetric-vs-asymmetric-encryption · Security Fundamentals :: Security · depth 3 · discrimination*

The comparison's separating axis is reversibility and speed: encryption is designed to be undone by the key holder, while general hashing is one-way and fast and password hashing is one-way and deliberately slow. Using a general-purpose hash where a password hash belongs, or expecting either hash to be reversible, is the error the table exists to prevent.

- **A.** This reverses the table: encryption involves a shared key or a key pair, while general hashing uses no key at all and password hashing uses a salt and work factor instead of a key.
- **B.** The comparison does not turn on output length at all; it turns on whether the transformation can be undone.
- **C.** Correct. The comparison table names reversibility and speed as the separating axis, and reversibility is what cleanly distinguishes encryption from either hashing form.
- **D.** Relative age of the algorithms is not a property the guide's table tracks or that determines which primitive to choose for a job.

Study it: [04-security/security.md#c-security.security.symmetric-vs-asymmetric-encryption](../study-guide/04-security/security.md#c-security.security.symmetric-vs-asymmetric-encryption)

### 51. C

*linux.linux-operating-system.multi-user-and-multitasking · Linux Fundamentals :: Linux Operating System · depth 2 · application*

Every permission model in this domain rests on the assumption that many users and processes run concurrently, isolated by the kernel. Process ownership — not the program's name — is what a signal's permission check is actually evaluated against.

- **A.** PATH resolves command names to executables when launching a program; it plays no role in routing a signal to an already-running process.
- **B.** Signals target a specific process ID, and the kernel's ownership check on that ID — not the program's name — is what prevents cross-user interference.
- **C.** Correct. This is the coherent system of permission checks the guide says exists precisely because Linux assumes many users and processes running concurrently.
- **D.** This is exactly the assumption the multi-user design is built to prevent: ownership and permission checks, not naming, determine which process a signal can reach.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.multi-user-and-multitasking](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.multi-user-and-multitasking)

### 52. A

*sysadmin.system-administration.var · System Administration Fundamentals :: System Administration · depth 2 · recall*

`/var` holds variable data — logs, spools, caches, application state — that grows while the system runs, and it is frequently its own partition. A full `/var` is a very common cause of service failure, and it fails in the characteristic way described: writes fail while the rest of the system keeps working.

- **A.** Correct. Services that cannot write logs or state files stop or refuse to start while the rest of the system keeps working, because `/var` is often its own filesystem.
- **B.** `/usr` is read-only and static under normal operation; it is `/var`, holding variable data such as logs, that characteristically fills and causes this symptom.
- **C.** Configuration files are small and static; `/etc` filling up is not the characteristic cause of a service failing to write its logs.
- **D.** A service typically has no meaningful presence under `/home`; the FHS places spool directories, logging data and application state under `/var`, which is where a daemon's growing files actually live.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.var](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.var)

### 53. B

*cloud.performance-availability.failover · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

Failover's total delay is the sum of several configured values: probe interval times failure threshold, plus the time for the redirection to take effect. With DNS-based failover, a cached record means clients keep using the old address until the TTL expires, regardless of how fast detection and promotion were.

- **A.** The scenario states the standby was promoted within thirty seconds, meaning the health check did fire; the delay is happening after that point.
- **B.** Correct. A long TTL can dominate the total outage even when detection and the record switch were both fast.
- **C.** Failback is the later, separate step of returning to a recovered primary; nothing in the scenario describes the standby refusing traffic.
- **D.** Load balancing distributes traffic across a pool of live backends; it does not explain clients resolving a name to the address of a component that is already down.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.failover](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.failover)

### 54. D

*pm.project-management.user-story · IT Project Management Fundamentals :: Project Management · depth 3 · application*

A user story is conventionally three clauses — as a role, I want a capability, so that a benefit — and what disqualifies most failed candidates is a missing benefit or a task phrased as though it were a need. 'Add an index' names an implementation with no role and no stated reason, which is exactly the shape the exam uses to test recognition of the template.

- **A.** A task written in technical terms with no user in it is precisely what a story is not, however well-defined the task itself is.
- **B.** Acceptance criteria are attached to a story once it exists; their absence doesn't explain why this item isn't a story in the first place.
- **C.** Sprint Backlog membership is about scheduling, not format; placing a task in a Sprint doesn't turn it into a story.
- **D.** Correct. The item names an implementation, not a role, a capability or a reason; the benefit clause is what lets the team propose an alternative solution to the same underlying need.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.user-story](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.user-story)

### 55. A

*sysadmin.troubleshooting.change-correlation · System Administration Fundamentals :: Troubleshooting · depth 3 · application*

Change correlation is a prioritisation heuristic, not a literal question about human action. Certificates expire, disks fill from log growth, scheduled jobs run, DNS records reach their TTL and unattended upgrades apply patches — all changes nobody performed deliberately but that a system which ran correctly yesterday can still have undergone.

- **A.** Correct. Passive changes happen constantly and are the whole reason this heuristic exists; treating them as "nothing" ends the investigation on a false premise.
- **B.** Reproduction and change correlation answer different questions; skipping one does not make the other unnecessary.
- **C.** The journal records what a component reported, not when a configuration or dependency changed, which is what correlating against the symptom timeline needs.
- **D.** Accepting "nothing changed" at face value is exactly the trap this heuristic warns against; a change without a deliberate actor is still a change.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.change-correlation](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.change-correlation)

### 56. C

*devops.git-concepts.revert-vs-reset · DevOps Fundamentals :: Git Concepts · depth 3 · application*

`git revert <commit>` records a new commit applying the inverse of an existing one, leaving the original in place, so history grows and nothing is rewritten — safe on a branch others already have. `git reset` moves the branch pointer, and `git rebase` replays commits as new objects; both rewrite history, which is why rebasing or resetting a branch that colleagues have already pulled forces them to reconcile diverged histories.

- **A.** Removing the commit outright is exactly the problem: the next push is rejected as a non-fast-forward, and forcing it takes commits away from the colleagues who already pulled.
- **B.** They share a goal but not a mechanism: revert keeps the original commit and adds an inverse, while reset drops commits off the branch by rewriting where it points.
- **C.** Correct. Revert grows history without rewriting it, which is exactly why it works on a branch others have already pulled, while reset and rebase both make the branch disagree with what those colleagues hold.
- **D.** Merge never rewrites existing commits, on a fast-forward or a diverged merge alike, which is exactly what makes merge safe on shared branches and rebase not.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.revert-vs-reset](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.revert-vs-reset)

### 57. D

*security.sensitive-data.backups-of-sensitive-data · Security Fundamentals :: Sensitive Data · depth 2 · application*

A backup inherits everything about its contents: the same classification, the same encryption requirement, the same access control. An encrypted production database dumped nightly to an unencrypted bucket has been downgraded to the weakest copy, and an attacker will take the weakest copy — the control travels with the data, not with the server it started on.

- **A.** This is exactly where the protection is forgotten: whoever can read the backup can read the data, regardless of how well the primary copy was protected.
- **B.** The exposure exists for however long the copy sits unprotected in the bucket; a future deletion date does not remedy the present downgrade.
- **C.** Securely stored keys protect nothing if the backup they would unlock was never encrypted with them in the first place.
- **D.** Correct. The control travels with the data, not with the server; an unencrypted, broadly readable bucket is now the easiest way in.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.backups-of-sensitive-data](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.backups-of-sensitive-data)

### 58. D

*linux.linux-operating-system.operating-system · Linux Fundamentals :: Linux Operating System · depth 3 · application*

Applications never touch hardware directly. They call OS-provided interfaces, and the OS — kernel plus the services above it — translates that call into whatever the specific installed hardware needs. That indirection is the entire point of the layer.

- **A.** Everything-is-a-file explains how devices are reached through the filesystem namespace; it does not remove the mediating layer the request still passes through.
- **B.** Drivers are controller-specific, but the editor never talks to one directly; it calls a general interface that the OS routes onward.
- **C.** Controllers still vary enough that a driver is required underneath; the standardisation happens at the OS's interface layer, not by eliminating the need for one.
- **D.** Correct. Hiding controller-specific detail behind a general interface is exactly the indirection the operating system exists to provide.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.operating-system](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.operating-system)

### 59. C

*cloud.performance-availability.fault-tolerance · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · discrimination*

Fault tolerance is defined by the absence of interruption: concurrent redundant capacity absorbs the fault with nothing to switch, whereas high availability accepts a brief detection-and-failover window. The comparison block's separating axis is exactly this interruption, not whether the service ultimately survives.

- **A.** Detect-then-redirect is exactly the high-availability mechanism, and it is the brief interruption during that process that fault tolerance is defined against.
- **B.** Both keep the service running, but the comparison turns on whether the user notices anything, and only one arrangement guarantees they do not.
- **C.** Correct. The absence of any interruption, not merely a fast one, is the property that separates fault tolerance from high availability.
- **D.** Fault tolerance covers a defined class of faults, not every conceivable failure; a correlated loss of all replicas falling outside that class does not disqualify the label.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.fault-tolerance](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.fault-tolerance)

### 60. B

*sysadmin.troubleshooting.high-cpu-load · System Administration Fundamentals :: Troubleshooting · depth 4 · application*

Every useful conclusion about load average requires dividing by the core count first, which `nproc` supplies. The manual is explicit that the same raw figure describes an idle system on many cores and a saturated one on few.

- **A.** A load average of 1 means only a single-CPU system is loaded all the time; on a 4-CPU system the same figure means the system was idle 75% of the time.
- **B.** Correct. Load average is a count of queued and running work, not normalised for CPU count on its own, so the same figure means different things on different hardware.
- **C.** Swap usage is a separate memory metric; load average can be a genuine problem even with no swap activity at all.
- **D.** Load average has no network component; it counts processes runnable or blocked on local I/O, not requests waiting on the network.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.high-cpu-load](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.high-cpu-load)

