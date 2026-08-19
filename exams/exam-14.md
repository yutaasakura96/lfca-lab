<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 14

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-14-answers.md](exam-14-answers.md)

---

### 1.

A runbook has sat in the team wiki for two years and has never once been executed. What is the state of its reliability?

- **A.** Verified, since testing before production would have caught any drift.
- **B.** Unknown. An untested runbook is an assumption, since its steps rot silently as the system changes.
- **C.** Verified, since the documentation for the same system is kept current.
- **D.** Reliable — storing the procedure correctly is what maintaining a runbook means.

### 2.

A resource is tagged `owner=alice` while every cost report, backup plan and automation rule in the account selects on the standard key `Owner`. What happens, and does anything raise an error?

- **A.** The resource silently falls outside every report, plan and rule keyed on `Owner`, because tag keys are distinct strings and no error is raised anywhere.
- **B.** Nothing — tagging systems normalise key case automatically, so `owner` and `Owner` are treated as the same key.
- **C.** The resource is billed to a default cost centre automatically until the tag is corrected.
- **D.** The resource loses its network isolation boundary, since tags also serve as isolation boundaries between workloads.

### 3.

Before extracting an unfamiliar archive with `tar xzf`, an operator wants to know whether it will unpack into its own subdirectory or scatter its files across the current directory. Which habit answers that safely, without extracting anything yet?

- **A.** Listing its contents first with `tar tzf`
- **B.** Running `gzip -l` on the archive to preview its member list
- **C.** Extracting it once into a throwaway directory and deleting the result if it looks wrong
- **D.** Running `file` on the archive to read its internal directory structure

### 4.

A controller becomes aware of a personal data breach at 09:00 on Monday. It assesses the breach as unlikely to create a high risk to the affected individuals, though some risk to their rights and freedoms remains. What does Article 33 require of the controller by 09:00 on Thursday, 72 hours later?

- **A.** Notification to every individual affected by the breach, since any residual risk at all triggers the individual-notification duty.
- **B.** Nothing, since the breach was assessed as unlikely to cause a high risk to the affected individuals.
- **C.** Notification to the competent supervisory authority, without undue delay and, where feasible, within the 72-hour window.
- **D.** A report to an Approved Scanning Vendor documenting the scope of the exposure.

### 5.

An operator manually scales a workload up with an imperative command, bypassing its stored manifest. Over time, the replica count drifts back to what the manifest declares. Why?

- **A.** The manual command silently fails to take effect at all, so nothing was ever actually scaled up in the first place.
- **B.** A controller compares desired against actual on a loop and acts on the difference, so an out-of-band change is treated as drift to correct, not a new desired state.
- **C.** The manifest automatically updates itself to match whatever the imperative command set, which is why the file in version control and the live cluster appear to converge over time.
- **D.** The Service in front of the workload enforces the original replica count independently of any controller.

### 6.

A company distributes a modified GPLv2-only tool and is later sued by a contributor who alleges the tool infringes a patent covering that contributor's own submitted code. Under GPLv2 alone, what protection does the licence text itself give the company?

- **A.** The AGPL's network-interaction provisions, since GPLv2 incorporates AGPL section 13 by reference for any distributed, patent-affected work.
- **B.** The same implied patent licence GPLv3 carries, since both versions were published by the same organisation and are treated as legally identical on patents.
- **C.** None from the licence text: GPLv2 contains no express patent grant and no patent-termination clause, and GPLv3 is the version that added both.
- **D.** Apache-2.0's patent-termination clause, invoked on the theory that a permissive licence's patent terms carry over to any GPLv2 work they are combined with.

### 7.

A site takes a full backup on Sunday and a differential backup every weekday night. The server fails on Thursday morning. Which sets must be restored?

- **A.** Sunday's full, then Monday, Tuesday and Wednesday in order.
- **B.** Sunday's full, then Wednesday's differential only.
- **C.** Wednesday's differential only.
- **D.** Sunday's full only, since differentials are for retention rather than restore.

### 8.

How many pillars does AWS's Well-Architected Framework name today, and how does that compare to Azure's framework?

- **A.** AWS names six — operational excellence, security, reliability, performance efficiency, cost optimization and sustainability, the sixth added in a late-2021 revision; Azure names five, with no sustainability pillar.
- **B.** AWS names five, the recognised pillars across the industry, and Azure follows the same five pillar set.
- **C.** AWS names six and Azure also names six, since both frameworks are described as having added a sustainability pillar in the very same late-2021 revision cycle.
- **D.** AWS names five, matching Azure's five, because both providers are commonly assumed to have frozen their published frameworks at the same original pillar count sometime well before the 2021 revision cycle began.

### 9.

A team restores a database backup into an isolated environment each quarter and checks the row counts. Which obligation does this satisfy?

- **A.** Restore testing — proving the backup can be read back and yields usable data.
- **B.** A disaster recovery drill, since the recovery procedure has been exercised.
- **C.** The off-site requirement, since the isolated environment is elsewhere.
- **D.** The retention policy, since quarterly checks confirm the copies still exist.

### 10.

A pipeline runs `uniq -c access.log` directly, without sorting first, hoping to count how many times each line repeats. The counts come out wrong, with the same line counted separately in several places. Why?

- **A.** `uniq -c` is the wrong flag; `-d` is needed to count duplicates
- **B.** `access.log` needs to be piped through `wc -l` first to normalise line endings
- **C.** `uniq` requires `cut` to run first to isolate a single column before counting
- **D.** `uniq` only collapses adjacent duplicate lines, and the file was never sorted

### 11.

A company modifies a GPLv3-licensed program and runs the modified version only as an internal backend service that its own employees use, never distributing a copy of it to anyone outside the company. Does the GPL's source-disclosure duty apply?

- **A.** Yes, because 'free' software always requires publishing any modifications regardless of how the program ends up being used.
- **B.** Yes, because the AGPL requires offering source to any user interacting remotely with a modified version, and that licence controls here.
- **C.** No, GPLv3's trigger is conveying a copy, and running the software as an internal-only service transfers no copy to anyone outside the organisation.
- **D.** No, but only because the company has not yet exceeded a licensed per-seat entitlement for the software.

### 12.

A website resolves correctly but the same domain's email keeps bouncing. Given `dig A example.com` returns a good answer, what should be checked next, and with which query?

- **A.** The mail exchanger records, checked with `dig MX example.com`, since a working A record says nothing about whether mail-directing MX records exist or point anywhere valid.
- **B.** The same A record again, since `dig A` also reports mail-routing status as part of its output when a domain has email configured.
- **C.** The PTR record for the web server's address, since reverse lookups are what mail servers use to decide whether to accept a website's traffic.
- **D.** The TTL on the A record, since a low TTL is what commonly causes email delivery to fail for a domain with an otherwise working website.

### 13.

A container is already running with `LOG_LEVEL=info` set by its Dockerfile's `ENV`. An operator runs `docker start web -e LOG_LEVEL=debug` hoping to change it live. What actually happens?

- **A.** The container picks up `LOG_LEVEL=debug` immediately, since `docker start` is defined to accept the same flags as `docker run`.
- **B.** The command fails to apply the new value, because `docker start` has no `-e` option at all and a container's environment is fixed at the moment the container is created.
- **C.** The Dockerfile's `ENV LOG_LEVEL=info` is permanently overwritten in the image, affecting every future container built from it.
- **D.** The container restarts with a fresh writable layer, discarding whatever it had written before, because a changed setting forces the container to be rebuilt from its image.

### 14.

A finance team reports each department's cloud spend back to them every month but never moves budget between cost centres to do it. Is this chargeback, showback, or chargeback that has simply not been switched on yet?

- **A.** Chargeback, since reporting a team's spend back to them already counts as billing them for it.
- **B.** Cost monitoring, since it is simply a report rather than either accounting practice.
- **C.** Showback — a deliberate choice to influence behaviour through visibility alone, not an earlier stage of chargeback.
- **D.** Chargeback not yet switched on — showback is simply the on-ramp organisations pass through before they start billing internally.

### 15.

An investigator runs `stat` on a file and reads its `ctime` as "when this file was created." Why is that reading wrong?

- **A.** `ctime` is correct for creation, but only on filesystems that support it
- **B.** `ctime` is the inode's status-change time, which is not a creation timestamp at all
- **C.** `atime` is the field that should have been read instead, since it tracks the earliest access
- **D.** `stat` reports creation time correctly, and the confusion is with `mtime` instead

### 16.

Why can MIT-licensed code be absorbed into a GPL-licensed project, while GPL-licensed code cannot be absorbed into an MIT-licensed one?

- **A.** MIT's only condition, carrying the notice forward, can still be met once the combined work goes out under the GPL; the GPL requires the whole conveyed work to go out under the GPL, which an MIT-only licence cannot promise.
- **B.** MIT-licensed code is always written in fewer lines than GPL-licensed code, so it merges more easily into any codebase regardless of licence terms.
- **C.** The GPL only reaches code written after the licence's own effective date, so older MIT-licensed code already in a project is exempt from its terms.
- **D.** Compatibility actually runs both directions equally; either licence can absorb the other as long as attribution notices are preserved throughout.

### 17.

A colleague calls a /26 network 'a class C network' and insists the two terms mean exactly the same thing. What is the actual relationship between IPv4 address classes and CIDR?

- **A.** They are exactly the same thing; "class C" is simply an older, informal name that continues to refer to whatever prefix length a network happens to use today, whatever that length is as commonly understood by less experienced staff.
- **B.** CIDR is simply class D renamed for modern use, since both are commonly described as more flexible successors to the original class A, B and C scheme.
- **C.** Classful addressing fixed three network sizes (/8, /16, /24) inferred from the address itself; CIDR allows any prefix from /0 to /32 stated explicitly, so a /26 is not a class C network; a class C network was specifically /24.
- **D.** The two terms are assumed to differ only in that "class C" refers to IPv6 addressing specifically, while CIDR refers exclusively to IPv4 addressing instead.

### 18.

A monitoring tool flags every address ending in `.255` across a network as "a broadcast address, and therefore misconfigured if assigned." Is that rule reliable?

- **A.** Yes — an address ending in `.255` is always the broadcast address, regardless of which mask applies to that network.
- **B.** No: the broadcast address depends on the mask, not on the last octet; under a /16 mask, 10.0.0.255 is an ordinary usable host address, not a broadcast.
- **C.** No, but only because the rule should instead check for addresses ending in `.0`, which are the true broadcast addresses that routers flood to every host on a subnet.
- **D.** Yes, because 255.255.255.255 is the broadcast address for every network regardless of the mask configured on it.

### 19.

A merchant stores the primary account number for recurring billing, rendered unreadable everywhere it sits, and retains no card verification code at all. Is the merchant meeting PCI-DSS's data-storage expectations, and who could ultimately withdraw its ability to accept cards over a violation?

- **A.** Yes on storage, and violations are enforced by a government regulator empowered under card-industry legislation.
- **B.** No, storing the primary account number at all breaches PCI-DSS regardless of how it is rendered unreadable, in exactly the same way that GDPR restricts transferring personal data outside the European Union to third countries.
- **C.** Yes on storage, and enforcement for a violation runs through the supervisory authority in the merchant's home country.
- **D.** Yes on storage: the account number is cardholder data that may be held when rendered unreadable, no verification code is kept at all, and a violation is enforced through the payment brands and the acquirer rather than a government regulator.

### 20.

A stateful job cannot checkpoint fast enough to survive spot interruption on Azure or Google Cloud, but the same job could survive interruption on AWS. What explains the difference?

- **A.** There is no real difference — all three providers give the same interruption notice, so checkpoint speed alone explains the job's survival.
- **B.** AWS's autoscaling reacts faster than Azure's or Google's, giving the job more time regardless of notice length.
- **C.** AWS gives a two-minute interruption notice before reclaiming a Spot Instance; Azure Spot VMs and Google Cloud Spot or preemptible VMs instead give roughly thirty seconds.
- **D.** AWS waives egress charges specifically on spot reclamation events, giving the job effectively more time to finish persisting its state to another region.

### 21.

A second terminal opened at the same time as a first does not show any of the first terminal's commands in its history, even though both belong to the same user. Why not?

- **A.** Each terminal window is permanently assigned its own separate `HISTFILE`
- **B.** History sharing requires tab completion to be enabled in both sessions
- **C.** Only commands run through `sudo` are written to the shared history file, and everything else is discarded at exit
- **D.** The history file is normally written when a session ends, so a still-open first session has not written its lines yet

### 22.

Terraform, Ansible, and Jenkins are each proposed for a new pipeline. Which one provisions infrastructure, which configures hosts that already exist, and which runs the build and test stages?

- **A.** Terraform is the CI server that runs build and test, Ansible provisions the infrastructure from a declaration, and Jenkins configures the hosts that already exist over SSH.
- **B.** Terraform provisions infrastructure from a declaration, Ansible configures the hosts that already exist, and Jenkins runs the pipeline's build and test stages.
- **C.** All three are infrastructure-as-code tools, and they are distinguished only by which cloud provider each one targets.
- **D.** Terraform and Ansible both run the pipeline's stages, while Jenkins is reserved for provisioning new infrastructure.

### 23.

A technician is told only 'the application is broken.' Checking the host: the interface has a link light and a MAC address, `ip addr` shows a valid IP and default route, ping to the server succeeds, but connecting to the service's TCP port is refused instantly. Which OSI layer does that evidence point to?

- **A.** Layer 3, Network — routing must still be at fault even though the ping already succeeded.
- **B.** Layer 7, Application — the phrase 'the application is broken' names the layer directly.
- **C.** Layer 2, Data Link — an immediate refusal usually points at a switching problem on the segment, since frame delivery is what a live link light actually proves.
- **D.** Layer 4, Transport. The packet reached the host and something answered with a refusal, which is a transport-layer event.

### 24.

A hospital builds a private, self-service platform on its own hardware: clinical teams provision virtual capacity instantly through a portal, usage is metered per department, and capacity scales automatically with load. An auditor claims 'this can't be cloud computing — the hospital owns the hardware.' Evaluate the claim.

- **A.** The claim is right, because true cloud computing requires a third-party provider operating shared, virtualized infrastructure.
- **B.** The claim is right, because only public cloud infrastructure counts under NIST's model, and a platform confined to one hospital's own staff is not public by any reading.
- **C.** The claim is wrong — cloud computing is defined by the delivery model, not by who owns the underlying hardware, and this platform meets the essential characteristics.
- **D.** The claim is right, because on-premises hardware can never be billed by consumption — only depreciated as a capital asset over its service life.

### 25.

A feature works and demonstrates cleanly, but the runbook required by the Definition of Done was never written. What happens at the Sprint Review?

- **A.** It is presented with a note that documentation is pending, since a working demo satisfies the Definition of Done on its own, and paperwork can reasonably follow later.
- **B.** It is presented, and the missing runbook becomes an agenda item for the Sprint Retrospective instead.
- **C.** It is presented, since the feature's own acceptance criteria were met even though the Definition of Done was not.
- **D.** It cannot be presented at the Sprint Review, because work that hasn't met the Definition of Done isn't part of the Increment and returns to the Product Backlog.

### 26.

An operator runs `ss -tulpn` without root privilege and sees a listening socket with a blank process-name column. They conclude nothing is actually listening on that port. Is that conclusion supported?

- **A.** Yes — a blank process-name column in `ss -tulpn` output is defined to always mean the corresponding socket entry itself does not actually exist.
- **B.** No, but only because `-n` was omitted, since adding `-n` is what causes previously hidden sockets owned by other users to appear in the output.
- **C.** No — without root, the `-p` column is blank for processes the operator does not own, which looks like nothing is listening if read carelessly, but the socket itself is genuinely present and listening.
- **D.** Yes, but only because `netstat`, not `ss`, should have been used instead, since `netstat` is defined to always show process names without requiring elevated privilege, since its process column is populated from the socket table itself rather than from /proc.

### 27.

Malware is classified by how it propagates and packages itself, not by what it delivers. Given a program that hides the attacker's presence from the operating system after installation, which classification fits, and could it still deliver a ransomware payload?

- **A.** A worm — and no, worms are defined by carrying only self-replication code and cannot also carry ransomware.
- **B.** A trojan — and no, once classified as a trojan a program cannot also be described as hiding its presence, because the disguise is discarded the moment the program finishes installing and begins running.
- **C.** A rootkit, and yes, any of the propagation classes, rootkits included, can carry any payload, ransomware among them.
- **D.** A virus — and yes, but only viruses among the classifications are capable of carrying a ransomware payload.

### 28.

The glob `*.txt` and a regular expression both use `.` and `*`, but a pattern written for one tool copied unchanged into the other silently matches the wrong thing. What is the underlying reason for that inversion?

- **A.** Both languages assign identical meanings; any mismatch is caused by a shell quoting error instead
- **B.** Regular expressions do not use `.` as a metacharacter at all; only globs assign it a special meaning, leaving it an ordinary literal dot in every regex dialect
- **C.** The inversion only affects `sed`, not `grep`, since they use different regex engines entirely
- **D.** A glob's `*` means "any run of characters" and its `.` is ordinary, while a regex's `*` quantifies the preceding item and its `.` matches any character

### 29.

An administrator statically assigns 192.168.1.50 to a new printer, unaware that the DHCP server's pool for that subnet is 192.168.1.20 through 192.168.1.100. What is the likely consequence, and why?

- **A.** No conflict is possible, because a statically configured address always takes precedence over anything the DHCP server might later offer by default on most systems administrators encounter.
- **B.** A duplicate-address conflict is likely once the DHCP server eventually leases 192.168.1.50 to a client, since the static address sits inside the dynamic pool's range.
- **C.** No conflict is possible, because printers are automatically excluded from DHCP pools by every major DHCP server implementation.
- **D.** A conflict is likely, but only because printers are unable to hold a static IPv4 address under any circumstances.

### 30.

A team runs the same stateless web service on two public providers, but only one of the two deployments is actually tested and kept current; the other has drifted and would take days to bring back into service. A stakeholder claims 'we're multi-cloud, so we're protected against a provider outage.' Evaluate the claim.

- **A.** The claim is right — using two providers for the same workload is itself sufficient for availability across provider outages, whatever state either deployment is in on the day the outage arrives.
- **B.** The claim is wrong: multi-cloud does not automatically deliver high availability; a deployment that is not actually tested and ready to take over fails just as hard as a single-provider setup when its own provider goes down.
- **C.** The claim is right, but only because the two deployments together form a hybrid cloud, which guarantees failover between its parts.
- **D.** The claim is wrong, but only because service level agreements do not cover multi-provider failover scenarios, which is the real gap here.

### 31.

A team practising continuous delivery releases to production twenty times a day, each release still triggered by a person clicking a button. Does this frequency mean the team has actually adopted continuous deployment?

- **A.** Yes, since twenty releases a day is fast enough that the human step has become a formality rather than a genuine decision point in the release.
- **B.** No, because release frequency is not what separates the two practices; continuous delivery constrains who decides, and a human decision is still made on every one of the twenty releases.
- **C.** Yes, because continuous deployment is defined by how often releases happen rather than by whether an approval step exists.
- **D.** No, but only because the team has not also automated its rollback procedure alongside the release button.

### 32.

When higher-level tools such as `ss`, `dig` and `curl` have not explained a behaviour, what does `tcpdump` add, and what does it require to run?

- **A.** It changes the running configuration of the interface it captures on, which is why it requires elevated privilege well beyond what mere passive observation of traffic would normally need.
- **B.** It resolves names the same way `dig` does, adding DNS-specific detail that `ss` and `curl` are not designed to show at all.
- **C.** It requires no special privilege at all, running identically for any unprivileged user exactly as `ss` and `curl` do.
- **D.** It captures the actual packets crossing an interface for direct inspection, selected with `tcpdump -i` to choose the interface, and it requires elevated privilege — it only observes traffic and never changes configuration.

### 33.

A substitution `sed 's/http/https/' urls.txt` is run on a line containing "http" twice, and only the first occurrence is replaced. What flag was left off, and what does it do?

- **A.** The `-n` flag, which suppresses automatic printing so later matches are visible
- **B.** The `g` flag, which replaces every match on the line rather than just the first
- **C.** The `-E` flag, which enables replacing more than one match per line
- **D.** The `-i` flag, since editing the file in place is required before a second match can be found

### 34.

An attacker gains physical console access to a locked-down server. Which of the installed system's software controls stop them from interrupting the boot loader to obtain a root shell?

- **A.** File permissions and authentication on the installed operating system stop this reliably.
- **B.** SELinux or AppArmor in enforcing mode stops this, since mandatory access control confines every process on the host, and its policy is loaded by the boot loader before any menu entry can be edited.
- **C.** Full disk encryption alone stops this, since an encrypted volume cannot be booted into an alternate operating system.
- **D.** None on the installed operating system itself, which requires boot-path controls such as a firmware password and a boot loader password, layered with physical access control.

### 35.

An application server queries a database on behalf of a request from a browser. RFC 9110 describes client and server as roles a program plays on a given connection, not as fixed types of machine. In client-server terms, what is the application server's role?

- **A.** Only a server, since it never itself opens the connection from the browser.
- **B.** A server to the browser and a client to the database, since the same program can hold both roles on different connections.
- **C.** Peer-to-peer, since the same program both answers and initiates requests.
- **D.** Impossible — a single process can only occupy one of the two roles at a time, so it must be either a server everywhere or a client everywhere it appears.

### 36.

An administrator disables Secure Boot in firmware settings to load an unsigned kernel module, and the machine continues to boot normally afterward using UEFI. Is that expected?

- **A.** Yes — Secure Boot is one optional UEFI feature, and turning it off does not disable UEFI booting itself
- **B.** No, disabling Secure Boot should force the machine to fall back to legacy BIOS booting
- **C.** No, because Secure Boot is required for the EFI System Partition to be readable at all
- **D.** Yes, but only because GRUB itself disables Secure Boot automatically when an unsigned module is present

### 37.

What is the structural relationship between a region and an availability zone?

- **A.** An availability zone is one of multiple isolated locations inside a single region, each with independent power, cooling and networking.
- **B.** A region is one of multiple availability zones grouped within a larger datacentre, so a single facility can contain several regions.
- **C.** Regions and availability zones are two names for the same unit of infrastructure, differing only in which provider's documentation uses which word.
- **D.** An availability zone spans multiple regions to provide cross-geography redundancy — a single zonal deployment therefore survives the loss of a whole region.

### 38.

`rpm -q mypackage` reports "package mypackage is not installed," even though the administrator is looking directly at a downloaded `mypackage.rpm` file in the current directory. What is the mistake?

- **A.** `rpm -q` is broken and `dnf` must be used instead for any file-based query, since only `dnf` can read an `.rpm` header directly
- **B.** The `.rpm` file must first be added to a configured repository and indexed with `createrepo` before it can be queried
- **C.** `rpm -q` was given a package *name*, which it looks up in the installed-package database — the file has to be named instead: `rpm -qp mypackage.rpm`
- **D.** `rpm -ql` should have been used instead of `rpm -q` — the `-l` makes `rpm` look on disk rather than in the database

### 39.

A team adopts trunk-based development and expects Git to enforce short-lived branches and frequent merges to `main` on its own. Will Git do that?

- **A.** Yes — Git rejects a commit if it lands on a branch older than a configured age limit under trunk-based development, once the team enables that convention somewhere in their shared repository configuration.
- **B.** Yes, since `git branch -d` refuses to delete a branch that has not been merged, which enforces frequent merging
- **C.** No. Trunk-based development, feature branching and similar strategies are team conventions governing how work travels to the main line; Git provides branches and no opinion about how they are used.
- **D.** Yes, because `git merge --ff-only` is the default merge behaviour and forces short-lived branches to stay caught up

### 40.

A minimal container image has no `nano` installed. Comparing vi and nano for which is guaranteed to be present, which editor can be relied on, and why?

- **A.** Neither; a minimal image guarantees no text editor at all
- **B.** nano, since it is the simpler tool and simpler tools are prioritised in minimal images
- **C.** Whichever editor is named by the `EDITOR` variable, since that guarantees availability
- **D.** vi, because it is POSIX-standardised and present on essentially every Unix-like system

### 41.

A managed message queue charges per message processed and requires no server administration from the customer, but no individual customer-written function is triggered per message — the queue itself is the product. Is this FaaS?

- **A.** Yes — anything billed per use with no server management is FaaS by definition, since FaaS is simply the billing model's proper name.
- **B.** Yes — any component that avoids the continuous resource billing PaaS requires must be FaaS, because that gap is what the term was coined to name, whatever unit of work actually executes.
- **C.** No — it is a managed service, and managed services and serverless are mutually exclusive categories in CNCF's glossary.
- **D.** No — it is serverless without being FaaS; CNCF treats serverless as the broader term spanning PaaS-like through SaaS-like services, with FaaS the narrower, function-specific member.

### 42.

A patch team has to choose between a CVE scored 9.8 in a package that is installed but never run and unreachable from any network, and one scored 6.5 in a package actively serving the internet-facing login. Which should be prioritised, and on what basis?

- **A.** The 9.8, because CVSS base score alone determines patch order regardless of where the package is deployed.
- **B.** Neither should be prioritised over the other until a penetration test confirms both are exploitable, since an unexploited weakness carries no patch priority of its own.
- **C.** The 6.5 on the login service, because deployment and reachability, not the raw CVSS number alone, should drive patch priority.
- **D.** The 9.8, because patching it also reduces the host's overall attack surface more than patching the 6.5 would.

### 43.

A backup script tries `ln /data/report.csv /backup/report.csv` across two different mounted filesystems, and it fails. Switching to `ln -s` succeeds. Why the difference?

- **A.** A hard link refers to an inode number, meaningful only within one filesystem, so it cannot cross a filesystem boundary; a symlink stores a path and has no such restriction
- **B.** `ln` is simply broken for this use case and `ln -s` should always be preferred instead
- **C.** The destination directory must not have existed yet, which only `ln -s` tolerates
- **D.** `/backup` must be a read-only mount, which blocks `ln` but not `ln -s` — a symbolic link is recorded in the source directory rather than the destination, so a read-only target never comes into it

### 44.

Someone wants to see every environment variable currently exported in their session, without printing un-exported shell variables mixed in. Which command gives exactly that?

- **A.** `echo $HOME`, since it prints an environment variable and can simply be repeated for each one.
- **B.** `env`, run with no arguments, which prints only exported environment variables.
- **C.** `export MYVAR`, since naming a variable with `export` prints that variable’s exported value back.
- **D.** Any shell variable that has ever been referenced with `$` automatically shows up in `env` output.

### 45.

A script needs to send a DELETE request to `https://example.com/orders/42` and confirm the exact status code that comes back. Which curl invocation does both?

- **A.** Run `curl -X DELETE -i https://example.com/orders/42`; `curl -X` sets the method word, and `-i` adds the status line and response headers to the output.
- **B.** Run `curl -X HEAD https://example.com/orders/42` to get a proper HEAD response with the status line, since `-X` is assumed to switch the request method the same way `-I` does.
- **C.** Run `curl --head https://example.com/orders/42`; `--head` prints the status line, and the order path in the URL is enough to identify what should be removed.
- **D.** Send the request with PUT instead of DELETE, since PUT and DELETE are both idempotent so either confirms the same outcome.

### 46.

A newly created account must be forced to set its own password the very first time it logs in, rather than continuing to use the temporary password an administrator assigned. Which command achieves that most directly?

- **A.** `chage -m 90 alice`, setting a 90-day minimum age
- **B.** `usermod -L alice`, locking the account
- **C.** `passwd -e alice`, which expires the current password immediately
- **D.** `chsh alice`, changing the login shell — the shell field carries its own expiry timer, which is what prompts for a new password at the next login

### 47.

An instance is replaced, and its public address changes with it because no reservation was ever made for it. What kind of address did it have?

- **A.** An ephemeral public address, drawn from the provider's pool and returned to it when the resource goes away.
- **B.** A DNS-mapped address, which changes automatically on instance replacement by design.
- **C.** A load balancer address, since load balancers always use ephemeral addressing.
- **D.** A reserved static address, since only reserved addresses are assigned to instances by default.

### 48.

A developer's local `main` is behind the remote's `main`, with no local commits of its own since the last sync. They run `git pull`. What happens, given that the histories have not actually diverged?

- **A.** The fetch retrieves the new commits, and the integration step fast-forwards `main` to match; there is no conflict and no merge commit, because there was nothing to diverge from.
- **B.** Pull always opens a merge conflict for review, even when nothing local has changed.
- **C.** Pull refuses to run at all unless `--rebase` or `--no-rebase` is specified up front on the command line, regardless of whether the two branches have actually diverged from one another.
- **D.** Only the remote-tracking branch updates; the local `main` stays behind until a separate `git merge` is run by hand.

### 49.

After a bulk permission change, users report they can no longer traverse into a directory tree at all, though the files inside still show read permission when named directly by another process. What is the most likely cause?

- **A.** The files themselves must have lost their write permission — a directory can only be entered when at least one file inside it is writable by the caller
- **B.** The directories in the tree lost their execute bit, blocking traversal even though file read bits are untouched
- **C.** The owning group of the directories was changed to one nobody belongs to
- **D.** The umask was changed on the server, retroactively affecting the existing tree

### 50.

A service full-disk-encrypts its database volume and terminates every client connection over TLS. Which of the three data states remains unprotected by either control?

- **A.** At rest — because the disk's encryption key is stored on the same host as the ciphertext, the control does not really count as protecting the state.
- **B.** None — encrypting the disk and using TLS between every endpoint covers the data everywhere it exists, leaving no state in the pipeline that still needs a separate control.
- **C.** In use. Plaintext exists inside the server process's memory while it operates on the data, and neither the disk encryption nor the TLS session reaches that memory.
- **D.** In transit — because a DLP inspection point at the network boundary decrypts and re-encrypts the TLS stream, briefly exposing it.

### 51.

A process's memory usage keeps climbing until it is abruptly terminated with no warning in its own logs. What kernel mechanism most likely explains the termination?

- **A.** The out-of-memory (OOM) killer, invoked under severe memory pressure to reclaim RAM by terminating a process.
- **B.** Swap exhaustion causing the storage device holding the swap file to fail outright.
- **C.** The scheduler deprioritising the process until it starves of CPU time entirely.
- **D.** Processes on Linux are never terminated by the OS itself; this must have been an explicit `kill` from another user.

### 52.

On a fresh Ubuntu installation, an administrator runs `su` to become root and it fails no matter what password is entered, even though `sudo` works fine for the same account. Why?

- **A.** The administrator has forgotten the root password and must reset it before `su` will work
- **B.** `su` requires the caller to already be a member of the `sudo` group — Ubuntu drops that membership requirement only once a root password has been set
- **C.** `su` is disabled entirely on Ubuntu and cannot be used under any circumstances
- **D.** Root's password is locked by default on Ubuntu, so `su` to root always fails; `sudo -i` is the intended route to a root shell instead

### 53.

A rule set allows inbound HTTP requests to reach a subnet's resources, but replies from those resources never make it back to the client. The subnet uses a stateless filtering layer with only an inbound allow rule written. Which layer is misconfigured, and what general mechanism does it belong to that a host's own firewall does not share this particular failure mode with?

- **A.** A host firewall inside the guest operating system, since firewalls are stateless by definition and therefore always share this exact symptom with any subnet-level filtering layer, regardless of how that host firewall happens to be configured.
- **B.** The route table, because a missing route would produce exactly this symptom.
- **C.** The security group, because security groups are the layer that is stateless, so a rule allowing the inbound request would need a matching outbound rule written for it separately.
- **D.** The network ACL, whose stateless evaluation means the reply must be allowed by an explicit outbound rule, unlike a security group or a typical host firewall, which is commonly configured to track connection state.

### 54.

After adding an index on a heavily-queried column, read latency improves but nightly batch inserts start taking noticeably longer. What explains the change?

- **A.** The index replaced the table with a faster copy, so writes now pass through an extra layer.
- **B.** The schema was altered when the index was added, which is what slowed the inserts.
- **C.** The index is a separate structure PostgreSQL keeps synchronised as the table changes, so every insert now also updates the index.
- **D.** Indexes are free to maintain, so the slowdown must have an unrelated cause.

### 55.

One user reports that a command fails. Which single additional observation most reduces the set of candidate causes?

- **A.** Have a second user try the same command from the same place, or have the reporter try it from somewhere else.
- **B.** Check what has changed on the host over the last 24 hours, including deployments and package upgrades.
- **C.** Open the failing application's own log and read whatever it recorded for the reporter's session.
- **D.** Reproduce the failure yourself, from your own account, on your own workstation, and see whether it happens there too.

### 56.

A team wants a release tag that records who tagged it, when, and a message — not just a bare reference to the commit. Which form of `git tag` produces that?

- **A.** A lightweight tag, created with plain `git tag <name>` and no other options
- **B.** A remote-tracking tag, since only tags fetched from a remote carry tagger metadata
- **C.** Any tag pushed with `--follow-tags`, since pushing is what attaches tagger metadata to it retroactively, even to a tag that was originally created as lightweight and carried none.
- **D.** An annotated tag, created with `-a` (or implied by supplying `-m` alone), which is a real object in the database carrying the tagger's name, email, date and message.

### 57.

A covered entity decides not to encrypt ePHI at rest, citing that encryption is 'Addressable' rather than 'Required' under the HIPAA Security Rule. Is that decision compliant by itself?

- **A.** No — Addressable requires the entity to assess whether encryption is reasonable and appropriate, implement it if so, and otherwise document why not and adopt an equivalent alternative measure.
- **B.** Yes — 'Addressable' is HIPAA's term for optional, so declining it needs no further justification beyond the entity's own preference not to implement it.
- **C.** Yes, provided the organisation's own scheme has classified the data as low sensitivity, since an internal label can substitute for a federal Security Rule assessment.
- **D.** No — but only because PCI DSS, not HIPAA, is what actually mandates encrypting this data, so the HIPAA specification itself carries no weight here at all.

### 58.

What distinguishes a system call from an ordinary library function call?

- **A.** A system call always runs faster, because it bypasses the shell's own command-interpretation overhead entirely and talks straight to the running program.
- **B.** A system call is the controlled entry point that crosses from user space into the kernel to request privileged work; a library call does not cross that boundary.
- **C.** A system call is written in a different programming language than an ordinary library function is, which is why the two behave so differently at runtime.
- **D.** There is no real distinction; both terms simply describe the same underlying mechanism under different names chosen for historical, not technical, reasons.

### 59.

A retail site slows every weekday at 09:00 and sits idle overnight. The current fix each quarter is to move the web server to a larger instance type; sessions live on local disk. Which single change addresses both the capacity ceiling and the site's single point of failure, and what has to be true of the application first?

- **A.** Vertical scaling to the next instance size, since a bigger machine removes both the ceiling and the single point of failure at once — an assumption that ignores both the restart the resize needs and the ceiling it will eventually hit, however large the next size is.
- **B.** Horizontal scaling, and nothing about the application needs to change first, since a load balancer alone makes any backend interchangeable.
- **C.** Auto-scaling on a schedule, since the slow period is predictable and no design change is needed beyond a scaling policy.
- **D.** Horizontal scaling — identical instances behind a load balancer — but only once sessions are moved off local disk, since a stateless design is the precondition for any instance serving any request.

### 60.

A user was added to a new group with `usermod -aG` an hour ago. In their still-open shell they get "Permission denied" on a file the new group can read. What's happening, and what confirms it?

- **A.** The group membership itself is broken somewhere in the directory service and must be re-applied from scratch before it will work.
- **B.** DNS caching somewhere upstream is delaying the group change from propagating down to this particular host and shell.
- **C.** The service holding the file needs `systemctl status` checked for a stale process left over from before the change.
- **D.** Their session predates the group change; comparing `id` inside the open shell against `id <user>` shows the group lists differ, and a fresh login is what's needed.

