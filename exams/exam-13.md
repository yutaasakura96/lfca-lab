<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 13

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-13-answers.md](exam-13-answers.md)

---

### 1.

A responder unfamiliar with a system is paged at 03:00 to restore a service that has failed. Which artifact should they follow?

- **A.** Documentation — it explains why the system is built the way it is.
- **B.** The disaster recovery plan governing activation criteria and notification.
- **C.** The runbook, a numbered, sequential procedure with an expected result at each step, written for exactly this situation.
- **D.** Any document describing the system, since documentation and runbooks serve the same purpose under pressure.

### 2.

Multi-zone deployment, health checks and automated instance replacement are described in this competency as consequences of one underlying assumption. Which assumption is it?

- **A.** That the reliability pillar of a well-architected review is fully satisfied the moment any redundant capacity exists anywhere in the account, regardless of how it is arranged.
- **B.** That high availability and disaster recovery are interchangeable safeguards covering the same failure scope.
- **C.** That every component, whether an instance, disk, zone, dependency or network path, will fail, so its failure must be absorbed as routine rather than treated as an incident.
- **D.** That automating configuration removes any need to plan for the loss of a component.

### 3.

An operator writes `tar -cfz logs.tar.gz /var/log`, with a leading hyphen, intending to create a gzip-compressed archive. What does GNU tar actually do with that command line?

- **A.** A correctly gzip-compressed `logs.tar.gz`, because GNU tar reorders the letters of a cluster before it parses them
- **B.** An uncompressed archive correctly named `logs.tar.gz`, because a cluster silently drops any letter placed after the one that takes an argument
- **C.** A zip-format archive rather than a tar archive, because `z` selects the zip container whenever it follows `f`
- **D.** It takes the letter `z` as the archive name, because in a hyphenated cluster the option that needs an argument has to come last

### 4.

A team tells a new hire that their service is 'compliant' with an unnamed standard. What is missing before that claim means anything an auditor could actually test?

- **A.** A written policy stating the organisation's intent to comply, signed off by leadership.
- **B.** An inventory of the technical controls that are currently enabled across the service.
- **C.** Which standard, over what period, and for what defined boundary the claim is being made.
- **D.** Nothing further, since 'compliant' is a complete claim once the organisation itself believes it to be true.

### 5.

A manifest describing three replicas is applied to a cluster twice in a row, with no changes in between. What happens the second time?

- **A.** Three additional replicas are created, since each apply is treated as an imperative instruction to add that many more instances, rather than as a description of the end state to reconcile toward.
- **B.** Nothing changes, because the description names an end state rather than steps, and applying it twice is the same as applying it once.
- **C.** The cluster rejects the second apply outright, since a manifest can only be applied successfully one time per object.
- **D.** All existing pods are deleted and recreated from scratch, since every apply resets the object's state before reapplying it.

### 6.

Why is a submitted pull request always a proposal rather than an applied change to the project?

- **A.** Only maintainers, and never committers, are legally permitted to accept changes submitted by outside contributors.
- **B.** An outside contributor has no write access to the project's repository; the decision to merge belongs to someone who does, which is why review by that person is a structural step rather than a courtesy.
- **C.** The contributor must first fork the project into an independent line of development before any change can be reviewed at all.
- **D.** Open source licences legally require every proposed change to pass a formal committee vote of the whole community before it may ever be merged into the codebase.

### 7.

A retention policy keeps daily backups for 14 days and nothing longer. A corruption introduced 40 days ago is discovered today. What is the consequence?

- **A.** The oldest retained backup predates the corruption and can therefore be restored intact.
- **B.** Replication to the standby site preserves an uncorrupted version.
- **C.** No clean copy remains, because every retained backup already contains the corruption.
- **D.** The recovery point objective determines whether the data is recoverable.

### 8.

Why does fetching a secret from a managed store at runtime make rotation practical in a way that baking the value into the deployment artifact does not?

- **A.** Runtime retrieval automatically triggers the infrastructure template to reapply whenever the stored value changes.
- **B.** Runtime retrieval narrows the role's permissions a little more each time a secret is fetched.
- **C.** Rotation replaces the stored value without requiring a redeploy, because the workload reads the current value on each retrieval rather than carrying a fixed copy.
- **D.** It does not make any real difference — a value baked directly into a deployment artifact can be rotated just as easily as one fetched at runtime, since only the encryption of the artifact itself differs.

### 9.

In common usage, what do MTTR and MTBF describe?

- **A.** How much data may be lost, and how long restoration may take.
- **B.** How long repair typically takes, and how often failures typically occur.
- **C.** How many copies are kept, and for how long.
- **D.** How quickly a standby activates, and how quickly the primary returns.

### 10.

A script runs `rm -rf "$DIR/"` at a stage where `$DIR` turns out to be unset. What single operand does the shell hand to `rm`?

- **A.** No operand at all, so `rm` exits immediately with a usage error
- **B.** `/`, because the empty expansion leaves only the trailing slash behind
- **C.** The literal text `$DIR/`, since the shell leaves an unset variable's name in place
- **D.** `.`, since the shell substitutes the current directory for a missing path segment

### 11.

An implementation specification under the HIPAA Security Rule is marked 'addressable.' A team decides the specification is not reasonable for its environment and stops there, doing nothing further. Have they met the requirement?

- **A.** Yes, 'addressable' means the entity may choose to skip the specification entirely at its own discretion, with no further obligation to assess or document anything.
- **B.** No, they must also document why it is not a reasonable and appropriate safeguard and implement an equivalent alternative measure where one is reasonable and appropriate.
- **C.** Yes, only specifications labelled 'required' carry any obligation at all, so an addressable one imposes nothing further once the team has assessed it and moved on.
- **D.** No, but only because they must instead notify affected individuals within 60 days of making that decision.

### 12.

Nightly backup jobs have reported success for two years. What does that establish about the organisation's ability to recover?

- **A.** That the recovery time objective is being met.
- **B.** That the disaster recovery plan is validated.
- **C.** That the data is recoverable, since a successful backup implies a successful restore.
- **D.** Nothing about recovery, only that the jobs ran without reporting an error.

### 13.

The same image needs to run unchanged in development, staging, and production, with only the database URL differing between them. What is the standard mechanism for that difference?

- **A.** Three separate images, one built per environment with the correct database URL baked into each Dockerfile.
- **B.** Environment variables set at run time with `-e`, so one image serves all three environments without any rebuild.
- **C.** A different tag per environment, such as `api:dev`, `api:staging`, and `api:prod`, each pointing at differently configured builds.
- **D.** A bind mount pointing at a different configuration directory per environment, chosen by the host running the container.

### 14.

A team describes the three compute purchase options in relation to pay-as-you-go billing. Which of these statements about that relationship is correct?

- **A.** Pay-as-you-go is a fourth purchase option, alongside on-demand, reserved and spot.
- **B.** Reserved pricing converts the spend into a capital purchase, since a multi-year term is being paid for.
- **C.** Reserved and spot are both discounts off the on-demand price, and on-demand is itself the pay-as-you-go baseline priced with no commitment.
- **D.** Spot pricing does not use pay-as-you-go billing at all, since its price is set by a live auction between competing customers rather than by a meter.

### 15.

A file is named `report.txt`, but something about opening it as plain text fails. Which command determines what the file actually is, based on its content rather than its name?

- **A.** `file`, which inspects the content and reports the real type
- **B.** `stat`, which reports the file's extension in its own dedicated field
- **C.** `ls -l`, since the mode string encodes the file's content format
- **D.** Renaming the file with the correct extension and trying again — the extension is what the kernel consults when opening a file

### 16.

The Linux kernel is released under which licence and version, and what does that precise designation prevent?

- **A.** LGPL-2.1-only, which is why proprietary drivers may link against the kernel without conveying their own source code.
- **B.** GPL-3.0-or-later, since all software released as part of the GNU Project defaults automatically to whichever licence version is currently the newest one published.
- **C.** Whichever version happens to be compatible with the licences of the components that were most recently merged into the kernel tree.
- **D.** GPL-2.0-only, not "version 2 or later", so the kernel's terms cannot be swapped for GPLv3's without the consent of every copyright holder involved.

### 17.

A team needs to alias `www.example.com` to `example.com` and also needs `example.com` itself, the zone apex, to carry its own delegation and administrative records. A junior engineer proposes a CNAME at the apex to simplify things. Why won't that work?

- **A.** A CNAME can be placed at the apex without issue; the restriction only ever applies to subdomains, never to the zone apex itself.
- **B.** A CNAME cannot be placed at the apex because CNAME records are restricted to IPv6-only zones, and this zone uses IPv4 addressing, a pattern that holds across most deployments encountered.
- **C.** A CNAME cannot coexist with other records at the same name, and the apex must carry NS and SOA records, so a CNAME cannot be placed there at all.
- **D.** A CNAME cannot be placed at the apex because the apex name is reserved exclusively for A and AAAA records by the DNS protocol.

### 18.

An administrator runs `ip link show enp0s3` looking for the interface's IP address and finds none in the output. Was the command wrong for the question being asked?

- **A.** Yes — `ip link` reports link state and the MAC address only; `ip addr` is the object to use for a layer 3 IP address, since `ip` is object-first and each object answers a different question about the same interface.
- **B.** No — `ip link show` is defined to always include both the MAC address and every configured IP address for the named interface in its output.
- **C.** No, but only because the interface must not actually have any IP address configured at all, which is why nothing appeared in the `ip link` output, since `ip link` falls back to printing addresses only when at least one is actually configured on the interface.
- **D.** Yes, but only because `enp0s3` was misspelled, and the command would have shown IP addresses correctly under the right interface name.

### 19.

A payment processor stores the card verification code printed on the back of customer cards, encrypted, for six months after each transaction completes, in case of later disputes. Is that consistent with PCI-DSS?

- **A.** Yes, because encrypting the data satisfies any PCI-DSS restriction on storage, regardless of what category of card data is actually being stored or for how long.
- **B.** No, sensitive authentication data such as the card verification code is data a transaction may transmit or process but not store, and encrypting it does not turn it into data that may be retained.
- **C.** Yes, provided the processor can point to a documented lawful basis for the retention under Article 6.
- **D.** No, but only because six months exceeds the retention period set out in the processor's own internal policy.

### 20.

A team argues: 'This offering can't be cloud computing because there is no virtual machine involved — customers only invoke short-lived functions and are billed per invocation.' Is the team's reasoning correct?

- **A.** No — NIST's definition does not require a VM; bare-metal instances, containers and functions are all valid cloud services as long as the five characteristics hold.
- **B.** Yes — without virtualization creating an isolated VM per customer, there is no resource pooling and therefore no cloud, since pooling is the one characteristic that cannot be met any other way.
- **C.** Yes — function-based per-invocation billing is a serverless pricing pattern rather than cloud computing in NIST's sense.
- **D.** No, but only because the provider also happens to offer a separate IaaS product alongside the function service.

### 21.

An operator wants to find a long `rsync` command they typed twenty minutes ago without scrolling back through everything since. Which interactive feature is designed for exactly this?

- **A.** `history`, which always jumps straight to the most relevant past command automatically
- **B.** Tab completion, since it recalls whole previous commands the same way it completes filenames
- **C.** `!$`, since it reruns whichever command last used the word "rsync"
- **D.** `Ctrl-R`, which starts a reverse incremental search through history

### 22.

A team wants to adopt continuous deployment, but its automated suite exercises only unit-level behaviour. What does that imply about the plan?

- **A.** The strength of the safety net sets the ceiling on the release practice, so nothing else stands between a merge and production once the gate is removed.
- **B.** Nothing, because continuous deployment only requires the pipeline to have no manual gate, independent of what level its tests happen to exercise on the way through.
- **C.** The pipeline should add an extra manual stage after the tests to compensate for the missing coverage.
- **D.** It does not matter, since automated tests already run on every change regardless of what level they exercise.

### 23.

An address begins with the octet 200. Using the classful ranges, which class does it fall in, and what does that tell you about its mask under modern routing?

- **A.** Class C, identified by the first octet range 192-223. Under modern classless routing, though, its real mask could be anything and is not implied by the class at all.
- **B.** Class B — the first octet 200 was read as falling in the 128-191 range that defines class B.
- **C.** Class C, and because it is class C its real-world mask must also be exactly /24, matching the historical default, regardless of which distribution or vendor is involved.
- **D.** Class D — the first octet 200 was read as falling in the 224-239 multicast range reserved for class D.

### 24.

A question describes a fictional offering as 'a region-internal fault domain with its own independent power, cooling and networking' without naming a vendor. Which infrastructure unit is this describing?

- **A.** A region — the provider's overall geographic footprint, and the smallest unit with its own independent power and cooling.
- **B.** An availability zone, which is AWS's and Azure's shared name for an isolated datacentre grouping within a region.
- **C.** A hyperscaler — one of the three major public cloud providers, each of which operates exactly one such fault domain per region.
- **D.** A private cloud, since dedicated power, cooling and networking imply infrastructure reserved for a single customer.

### 25.

An organisation has a company-wide Definition of Done. One Scrum Team, under schedule pressure, proposes dropping the peer-review requirement for its own product only. Is that allowed?

- **A.** Yes, since each Scrum Team owns its own Definition of Done and may adjust it whenever circumstances demand, provided the change is agreed within the team before the next Sprint begins.
- **B.** Yes, provided the dropped requirement is logged as an accepted risk.
- **C.** Only if the change is approved through the project's formal change control process.
- **D.** No. A team-level Definition of Done can only be stricter than an organisational standard where one exists, never weaker.

### 26.

Given the block 10.4.20.0/27, a colleague proposes assigning 10.4.20.0 to a new server because it is the first address in the range. Using the mask to derive the block's boundaries, what should happen instead?

- **A.** 10.4.20.0 is fine to assign, since only the last address in a block, not the first, is ever reserved from host use.
- **B.** 10.4.20.0 is fine to assign, because reservation of the network address only applies to blocks smaller than a /27.
- **C.** Since /27 leaves 5 host bits for a 32-address block, the all-zero address 10.4.20.0 is the network address and not a usable host, so it must be rejected as a host address.
- **D.** 10.4.20.0 must be rejected, but only because a /27 block must begin at an address one above a multiple of 32, so .0 falls below the first legal boundary of the block it is meant to open.

### 27.

Ransomware encrypts a fileserver, and the attackers had already exfiltrated data before deploying it. The organisation restores every file from a tested, isolated backup. Which loss has been undone, and which has not?

- **A.** Both losses are undone, since a clean restore returns the organisation to its pre-attack state entirely.
- **B.** Neither loss is undone, because a backup restore only ever addresses integrity rather than availability, and the encrypted originals stay unreadable on disk.
- **C.** The availability loss is undone by the restore; the confidentiality loss from exfiltration is not, since restoring copies back does not un-leak what was already taken.
- **D.** Both losses are undone as long as the backup share itself was also mounted on the same network as the fileserver.

### 28.

A pattern copied from documentation uses `colou?r` to match both "color" and "colour" with `grep`, but run without `-E` it finds nothing. Why?

- **A.** grep's default is basic regular expressions, where `?` is a literal character rather than an operator
- **B.** The pattern is a glob, not a regular expression, so `?` behaves as a glob wildcard instead
- **C.** grep requires quantifiers to be written in brackets, such as `[?]`, which is the bracket syntax that turns an ordinary character into an operator
- **D.** The pattern needs a leading anchor `^` before any quantifier will be recognised

### 29.

A service is reported as "running but nothing can connect." Following the standard diagnostic order, what is checked first with `ss -tulpn`, and what does an absent port versus a present-but-loopback-bound port each indicate?

- **A.** First check whether the expected port appears at all: absent means the process is not actually listening, a service problem no firewall change will fix; present but bound to `127.0.0.1` means it is up but unreachable from any other host — the fault, without touching the network further.
- **B.** First check the firewall policy on the host, since `ss -tulpn` output is defined to be meaningless until the firewall configuration has already been reviewed and ruled out as the source of the problem.
- **C.** First check the client's own routing table, since a client-side fault is always the explanation whenever a server-side `ss -tulpn` check would otherwise be needed to confirm what is listening.
- **D.** First check whether `-p` was run with root privilege, since without it `ss -tulpn` is defined to report every socket as entirely absent from its output rather than merely missing the owning process.

### 30.

A provider deprecates the major version of a managed database a team has relied on for years, forcing an upgrade on a fixed timetable the team did not choose. Does this contradict the definition of a managed service?

- **A.** Yes — a genuinely managed service never imposes an unplanned change, so version timing remains under the customer's control throughout, exactly as it does on a self-managed installation the team patches on its own schedule.
- **B.** Yes, because forced runtime upgrades are a PaaS-specific behaviour that should never occur with a managed service — the provider operates only the version the customer selected.
- **C.** No, but only because this database should have been run as IaaS instead, where version timing stays with the customer and no maintenance window applies.
- **D.** No — losing control over the timing of a forced version upgrade is part of the trade a managed service makes; the customer keeps schema and data control but loses root and the ability to hold a retired version.

### 31.

Three teams run the same pipeline definition. Team A's every passing change deploys automatically to an acceptance environment and then waits for a release manager to approve going further. Team B's every passing change goes straight to production with no approval step at all. Team C merges frequently and ends up with a tested artifact, deployed nowhere. Match each team to continuous integration, continuous delivery, or continuous deployment.

- **A.** Team C is continuous integration, Team A is continuous delivery, and Team B is continuous deployment.
- **B.** Team A is continuous deployment, since an acceptance environment counts as production for the purpose of this comparison.
- **C.** Team C is continuous delivery, because producing a tested artifact already makes it releasable at any time.
- **D.** Team A and Team B are the same practice, differing only in which environment name their pipeline happens to use.

### 32.

A file server, a print queue and an ordinary laptop are being provisioned. The file server needs a stable address referenced by an A record; the laptop just needs to get online. Which addressing choice fits each, and on what basis?

- **A.** Both the server and the laptop should get plain dynamic DHCP addresses, since DHCP reservations do not exist as an option separate from an ordinary dynamic lease.
- **B.** Both the server and the laptop should get static addresses configured by hand, since any device an administrator provisions deliberately is assumed to never depend on DHCP.
- **C.** The server gets a static address or a DHCP reservation, since anything referenced by name needs stability; the laptop gets a plain dynamic DHCP address, since managing hundreds of hand-written client configurations does not scale.
- **D.** The choice should instead be based on which device was purchased most recently, since older hardware on the network is generally assumed to need static addressing regardless of its role, which feels reasonable on first encounter in most textbooks and quick references.

### 33.

An unprivileged user runs `cd /root` and gets "Permission denied," not "No such file or directory." What does the specific wording of that error tell an investigator?

- **A.** The two error messages are interchangeable, and neither implies anything about existence
- **B.** The system has no `/root` directory at all, and the shell substituted a generic message when it could not name the failure
- **C.** `cd` cannot report permission errors, so this message must come from a different command
- **D.** The directory exists, but its permissions simply do not grant that user access

### 34.

Which of the following gets an attacker into position for a man-in-the-middle attack in the first place, before certificate validation ever comes into play?

- **A.** A stolen but still-valid password used to log into the target service directly.
- **B.** A phishing email that persuades the victim to click a malicious attachment.
- **C.** A misconfigured `sudo` rule that lets an unprivileged local user run arbitrary commands, since root on one endpoint places the attacker between that host and every party it goes on to talk to.
- **D.** ARP or DNS manipulation that redirects the victim's traffic through the attacker's machine.

### 35.

A library exposes function signatures for other code to call locally, with no network involved. Does it have an API, and is it necessarily RESTful?

- **A.** It has no API, since APIs are by definition HTTP endpoints that some remote caller invokes over a network connection.
- **B.** It has an API, and it is not necessarily RESTful; an API is a contract that need not involve a network at all, while REST is one network-based style of building one.
- **C.** It has an API, and that API is RESTful because any interface presenting a stable contract to its callers counts as REST.
- **D.** It has an API only once someone publishes a machine-readable schema document formally describing its operations, the way an OpenAPI document formalizes a network endpoint's contract for outside callers.

### 36.

Name three capabilities UEFI provides that legacy BIOS does not.

- **A.** Faster boot times, larger RAM support, and multi-core CPU support — capabilities a legacy BIOS machine cannot offer at all, whatever operating system it runs
- **B.** GRUB as the bootloader, kernel parameter passing, and the initramfs
- **C.** Support for more than four partitions total, journaling filesystems, and disk encryption
- **D.** An EFI System Partition holding bootloaders as files, GPT partitioning supporting disks beyond roughly 2 TiB, and Secure Boot

### 37.

A vendor bills a company per named user seat each month, regardless of how many of those seats actually log in. Is this billing pattern typical of SaaS, and why does it differ from IaaS billing?

- **A.** Yes — SaaS is normally billed per-seat or per-tenant, so an unused seat still costs money, unlike IaaS and FaaS's usage-based billing.
- **B.** No — SaaS should scale its billing to zero cost when a seat goes unused, exactly as PaaS does when an application sits idle overnight.
- **C.** No — SaaS is metered per API call, the same usage-based billing IaaS uses, so unused seats cost nothing.
- **D.** Yes, and IaaS bills the same way, per named account rather than per resource consumed.

### 38.

On a current Red Hat-family system, an administrator runs `yum install nginx` instead of `dnf install nginx`. What actually happens?

- **A.** An error, since `yum` was removed entirely once `dnf` became the default
- **B.** The equivalent of `dpkg -i` — a single-file install with no dependency resolution
- **C.** The same operation `dnf install` would perform — `yum` is kept as a compatibility name for the same tool
- **D.** A different package management system entirely, unrelated to `dnf` — with its own separate package database that `dnf` cannot read

### 39.

What is the one-sentence difference between DevOps and site reliability engineering?

- **A.** DevOps focuses on getting code to production; SRE focuses on ensuring code already running in production keeps working, using an error budget to balance change against stability.
- **B.** They are two names the industry uses for the same discipline, applied to the same set of practices by different companies.
- **C.** SRE is the culture of shared ownership between development and operations, and DevOps is the specialist operations discipline built on top of that culture once it is established.
- **D.** SRE is the practice of making automation safely re-runnable, a property that a DevOps pipeline then schedules on a cadence.

### 40.

A rescue shell on a server that will not boot offers exactly one editor, and an operator needs to comment out a bad line in an fstab entry and save. Starting from vi's normal mode, what sequence gets the change saved without leaving the file in a broken state?

- **A.** Type `:wq` immediately from wherever the cursor is
- **B.** Press `a` to append, edit the line, then type `:q!` to save
- **C.** Press `i` to insert, edit the line, press Escape, then type `:wq`
- **D.** Use `nano`'s `Ctrl-O` and `Ctrl-X` sequence, since it also works inside vi

### 41.

Under AWS's stated shared responsibility model, which layer marks the boundary between what the provider controls and what the customer controls?

- **A.** The network perimeter — the provider secures everything outside the customer's virtual network, and the customer secures everything inside it.
- **B.** The application layer — the provider is responsible for securing everything up to and including the customer's own application code.
- **C.** The billing account — everything under one account is the provider's responsibility, and everything under a separate account is the customer's, so the boundary moves whenever a new account is opened.
- **D.** The host operating system and virtualization layer — the provider controls everything at and below that; the customer manages the guest OS, its patches, and their own application software.

### 42.

A team reads a CVE identifier and assumes it already tells them how severe the flaw is. What does a CVE identifier actually name, and where does severity come from instead?

- **A.** The sequence number in the identifier itself encodes the CVSS score, so a higher number means a more severe flaw.
- **B.** Severity comes from how large the affected package's attack surface is, not from any separate score, with the numbering authority recording that measurement alongside the identifier it assigns.
- **C.** Severity comes from how the flaw is classified in the risk-threat-vulnerability framework, not from a numeric score.
- **D.** The identifier is only a name for the defect, assigned by a CVE Numbering Authority; severity comes from a separate CVSS score.

### 43.

A file has one hard link and one symbolic link pointing at it. The hard-linked name is deleted. What happens to the file's data, and what happens to the symlink?

- **A.** The data is deleted immediately, and the symlink becomes dangling — removing any name for a file releases its blocks at once, whatever the link count still says
- **B.** The data survives, but the symlink is automatically updated to point at the remaining name
- **C.** The data survives, since the inode's link count merely drops by one; the symlink still resolves through the surviving name
- **D.** Both the data and the symlink are deleted together, since they share the same inode

### 44.

A variable is set with `MYVAR=value` in an interactive shell. `echo $MYVAR` shows the value, but a script the shell then runs cannot see it at all. Why, and which command would have fixed it?

- **A.** `env` was not run first, and running it would have exported every current shell variable automatically for the script.
- **B.** It was never exported, so it is a shell variable rather than an environment variable and is not inherited by child processes; `export MYVAR` before running the script would fix it.
- **C.** The script uses a different PATH, which prevented it from finding the variable's value anywhere in that path.
- **D.** Interactive shells and scripts are always supposed to share the exact same variables automatically, so an outcome like this one should genuinely never be possible in the first place.

### 45.

A bug fix is deployed to the origin server, but users report seeing the old, broken page for another hour. RFC 9111 governs HTTP caching. What does the cache's behaviour here demonstrate, and what does it not indicate?

- **A.** That the cache is malfunctioning, since a correct cache would always reflect the latest origin state immediately.
- **B.** That the cache accepted staleness in exchange for speed; it does not indicate that the fix failed to deploy or that the origin is broken.
- **C.** That the origin server itself is stateful, since it kept serving the same response.
- **D.** That the API's contract changed without a new version being published.

### 46.

A policy requires every password to be changed at least every 90 days and to warn the user seven days beforehand. Which fields in `/etc/shadow`, changed through `chage`, enforce that?

- **A.** The minimum age field (`-m 90`) and the account expiry field (`-E 7`)
- **B.** The maximum age field (`-M 90`) and the warning period field (`-W 7`)
- **C.** Password complexity settings, since ageing and complexity are the same policy category
- **D.** The login shell field, set to a value that expires automatically after 90 days

### 47.

Which of the following correctly names the private-endpoint mechanism for each provider?

- **A.** AWS's is Private Service Connect, since AWS pioneered private connectivity to managed services.
- **B.** AWS's is PrivateLink, Azure's is Private Link, and Google Cloud's is Private Service Connect.
- **C.** Azure's is ExpressRoute, since that is Azure's private-connectivity product.
- **D.** Google Cloud's is VPC Network Peering, its private-connectivity product.

### 48.

A developer wants to see what changed upstream before deciding what to do next, without disturbing the branch they are currently in the middle of editing. Which command fits, and why does the other one not?

- **A.** `git pull` — it downloads commits the same way fetch does, so it is just as safe to run mid-edit without any risk of disturbing the branch currently checked out.
- **B.** `git pull --rebase` — rebasing is a gentler form of pull that never touches the working tree.
- **C.** `git fetch`, which downloads commits and updates remote-tracking branches only, leaving the current branch, index and working tree untouched.
- **D.** `git remote -v`, since checking the configured URLs is the safest way to see upstream changes

### 49.

A directory is `d-wx------`. Its owner has write and execute but not read. Can the owner list the directory's contents with `ls`, and can they open a file inside it by name?

- **A.** No to listing; yes to opening a known filename, because listing needs read while traversal needs execute
- **B.** No to both, because any operation on a directory needs all three bits together
- **C.** Yes to both, because write on a directory implies read for its owner — the owner class is exempt from the directory read bit on any directory it owns
- **D.** Yes to listing but no to opening a known file, since read must come before execute

### 50.

A breach is assessed as likely to result in a high risk to individuals' rights and freedoms, but the affected data had been encrypted throughout. What follows under GDPR?

- **A.** Neither notification is required, since encrypted data that is later exposed is not treated as a breach at all, no matter what access an attacker actually gained.
- **B.** The supervisory authority is still notified under Article 33; the individual communication under Article 34 is excused because the encryption rendered the data unintelligible to anyone unauthorised.
- **C.** Both notifications are excused, because encryption satisfies GDPR's requirements regardless of the risk assessment's outcome.
- **D.** Only the individual communication under Article 34 is required; the supervisory authority is notified only when HIPAA also applies.

### 51.

A new peripheral is detected by the kernel and its driver module loads successfully, but the device still does not function correctly. Loading the module again changes nothing. What layer might still be at fault?

- **A.** The device's own firmware, low-level software embedded in the device itself, distinct from and running independently of the operating system.
- **B.** The kernel module itself, since simply reloading it again with slightly different options would eventually resolve any remaining fault it still has.
- **C.** The shell used to run `modprobe`, since different shells are widely believed to load kernel modules differently.
- **D.** Nothing further is possible to fix from the OS side or the device side; a successfully loaded driver means the OS's job here is fully done.

### 52.

An organisation wants a per-command audit trail of every administrative action, showing exactly who ran what. Should administrators be told to use `sudo` for individual commands, or `su -` for a shell?

- **A.** `su -`, since it requires the target account's own password and is therefore more accountable
- **B.** Either is equivalent for auditing, since both ultimately grant root access — the kernel records the same audit event for either escalation path
- **C.** `sudo -i`, since it combines the audit benefit of `sudo` with a full login shell
- **D.** `sudo` for individual commands, which logs each invocation, while `su -` only logs the single switch to a shell

### 53.

On Azure, a subnet's outbound-access property is set so the subnet has no implicit outbound path. What does Microsoft call the result, and how does that differ from the AWS route-table framing this pair of terms is normally described in?

- **A.** Microsoft calls that a private subnet; a subnet-level property directly controls the classification on Azure, unlike AWS, where there is no such attribute and only the associated route table decides.
- **B.** The same as AWS — Azure also determines this purely by which route table is associated with the subnet, with no additional subnet-level property involved in the decision at all, unlike the AWS mechanism this pairing is normally compared against.
- **C.** A subnet with no NAT gateway attached, since Azure names the property after that resource.
- **D.** A subnet with an empty route table, since Azure also associates route tables per subnet.

### 54.

The OASIS AMQP 1.0 specification models a queue as a node that stores and forwards messages between a producer and a consumer, named as separate application elements. What does that model rule out?

- **A.** That the producer and consumer must both be available at the same moment; the queue buffers messages between two elements that need not coincide in time.
- **B.** That a queue is essentially a database table that other components are free to query however they like.
- **C.** That the producer and consumer may also call each other directly over a synchronous API when both do happen to be running, since a queue between them forbids every other path.
- **D.** That messages are normally removed once consumed, rather than left in place for other components to read repeatedly.

### 55.

A CI step runs a command that prints an alarming message, but the pipeline continues as though it passed. Checking immediately afterward, running `echo $?` reports 0. What does that tell you?

- **A.** The command's own exit status was 0, so it succeeded from the shell's point of view even though its output looked like a failure.
- **B.** The command failed silently, and `$?` is simply unreliable for this kind of check.
- **C.** The command lacked execute permission on its own binary, or ran from a filesystem mounted `noexec`, both of which are reported as exit status 0.
- **D.** The systemd unit wrapping the step is in a failed state regardless of the command's own status.

### 56.

A team wants to mark the exact commit shipped as version 1.4.0, in a way that will not move even as new commits land on `main` afterward. Should they use a branch or a tag, and why?

- **A.** A branch, since only branches can be checked out later to inspect what shipped
- **B.** Either works identically, since both a branch and a tag are just names pointing at a commit
- **C.** A branch, because a `git stash` entry can be attached to it later to record the release notes once the team decides what belongs in that release.
- **D.** A tag, since committing advances a branch but leaves every tag exactly where it was, making a tag the fixed marker this needs.

### 57.

A firewall permits an outbound HTTPS connection to a partner's API. A DLP rule then blocks one specific message across that same connection. How is that possible?

- **A.** It isn't possible — once a firewall permits a connection, every message across it is necessarily allowed through, since nothing downstream of the firewall inspects the traffic further.
- **B.** The DLP rule is actually a mandatory access control policy overriding the firewall's discretionary decision.
- **C.** A firewall decides by address, port and protocol; DLP decides by what the payload contains, so it can act within a connection the firewall has already allowed.
- **D.** The message was blocked because it contained a credential, which only a secrets manager, not DLP, is able to detect inside outbound network traffic.

### 58.

`free -h` shows a small 'free' figure and a large 'used' figure on a server that feels fine. Which column should actually be trusted to judge whether the system is memory-constrained?

- **A.** 'free', since it is treated as a persistent block device figure and therefore the single most reliable measure of headroom available anywhere on the running system.
- **B.** 'used', since a large 'used' figure always means the system is close to the OOM killer no matter the surrounding context.
- **C.** None of the columns matter; only `uptime`'s load average actually determines memory pressure on a running system.
- **D.** 'available', which estimates what a new process could actually get, correctly accounting for reclaimable cache that the raw 'free' column does not credit back.

### 59.

A cloud provider's contract promises 99.99% monthly availability with service credits if missed. A customer runs a single instance in a single zone on that platform. Which statement is correct?

- **A.** The customer's service inherits 99.99% availability automatically, since that is what the SLA guarantees them — a substitution that ignores everything the customer’s own architecture would have to contribute for that number to hold.
- **B.** The SLA is itself a design for high availability, since it specifies redundancy and failover requirements.
- **C.** Nothing can be concluded, because SLA figures are never comparable to a customer's own measured availability.
- **D.** The provider's figure is a contractual promise about the platform; the customer's own architecture, not the contract, determines whether their service is actually highly available.

### 60.

A file is mode 644, owned by the requesting user, yet opening it returns "Permission denied." `ls -l` on the file shows nothing wrong. What do you check next, and what does the outcome rule out?

- **A.** `journalctl -u` for the service touching the file, since its own log may record the real reason for the denial somewhere.
- **B.** `namei -l` on the full path, or `ls -ld` on each parent directory — a parent missing search (`x`) permission explains the denial and rules out the file's own mode and group membership.
- **C.** Widen the file's mode with chmod until the error stops appearing, since a more permissive mode can only help, not hurt.
- **D.** `df -i` for inode exhaustion on that filesystem, since exhaustion of either kind can also block access to a file.

