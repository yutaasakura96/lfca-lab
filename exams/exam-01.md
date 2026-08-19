<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 01

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-01-answers.md](exam-01-answers.md)

---

### 1.

A host is compromised, and nobody remembers it exists — it was never entered into any system record. What discipline's absence does that reveal?

- **A.** Asset and inventory management — you cannot patch, secure or decommission what you do not know about.
- **B.** Monitoring and alerting — the host should have triggered a threshold alert.
- **C.** Security baselines — the host fell below the minimum secure configuration.
- **D.** Nothing is missing — the compromise itself is an adequate discovery mechanism.

### 2.

A team now defines its environments in a version-controlled template applied identically to staging and production, replacing changes engineers used to make by hand in the console. Which problem does this fix, and which does it not fix by itself?

- **A.** It eliminates configuration drift completely and immediately, since the running instances are now replaced rather than edited going forward.
- **B.** It fixes unreproducible environments and unreviewed changes; it does not by itself stop console changes made outside the template, so drift is eliminated only once the template is reapplied continuously.
- **C.** It satisfies the security pillar of a well-architected review outright, since a template that has passed code review is assumed to guarantee least-privilege access on every resource it goes on to create.
- **D.** It removes the need for an audit log, since the template file itself is now the complete record of every action taken against the account.

### 3.

A colon-delimited file has some rows with consecutive colons producing empty fields, and the task is to extract the fourth field with awk using `-F:`. What happens to a run of consecutive delimiters when the separator is set to a single explicit character this way?

- **A.** Consecutive delimiters are automatically collapsed into one, the same as the default whitespace behaviour
- **B.** awk raises an error whenever two delimiters appear next to each other
- **C.** Every occurrence separates a field, so consecutive delimiters produce empty fields between them
- **D.** The field numbering resets at each empty field, so `$4` no longer refers to the fourth field

### 4.

A team rewrites its incident-response runbook to reflect a newly adopted ticketing tool, with no other change to what is required or expected. Which tier changed, and what does that imply for the compliance boundary?

- **A.** The standard changed, so the compliance boundary has moved and the change needs management sign-off before it takes effect.
- **B.** The policy changed, so the organisation's stated intent and who is bound by it has shifted as a result.
- **C.** Nothing changed at any tier, because a runbook sits entirely outside the policy, standard and procedure hierarchy.
- **D.** The procedure changed; that is routine operational work and does not by itself move what an assessor tests against.

### 5.

One image, dockerfile, and registry all appear in a single deployment write-up. Which pairing correctly matches recipe, artifact, and distribution point?

- **A.** The image is the recipe read by the build process, and the Dockerfile is the artifact that recipe produces once built That framing reverses the build direction: nothing reads an image to produce a Dockerfile.
- **B.** The Dockerfile is the recipe, the image is the built artifact produced from it, and the registry is where that artifact is stored and distributed.
- **C.** The registry is the artifact itself, and the image is merely the remote server that stores registries.
- **D.** An image cannot exist unless a registry currently holds it, since the local image store is only a temporary cache of registry content.

### 6.

A finance lead writes: 'The system shall lock a user account after five failed login attempts.' Which classification is correct, and on what basis?

- **A.** Non-functional — the five-attempt count is a numeric bound, and a requirement carrying a number constrains quality rather than behaviour.
- **B.** Functional, since it names a function the system must execute, which is the axis the classification actually turns on.
- **C.** A design decision, since account lockout is an implementation detail better captured as a use case's exception flow.
- **D.** Non-functional, since account lockout is a security matter and security requirements are always non-functional.

### 7.

How do business continuity and disaster recovery relate to each other?

- **A.** Business continuity is the IT subset of the wider disaster recovery discipline.
- **B.** Disaster recovery is one component of business continuity, which is broader.
- **C.** They are two names for the same set of activities.
- **D.** Business continuity applies during an incident; disaster recovery applies afterwards.

### 8.

A stolen disk from a decommissioned volume, and a request sniffed off the network: which form of encryption defends against which?

- **A.** Encryption at rest defends both, since data encrypted on disk stays encrypted through its entire lifecycle, including transmission.
- **B.** Encryption at rest defends the stolen disk; encryption in transit, by TLS, defends the sniffed request, and neither substitutes for the other.
- **C.** A managed secret store defends the stolen disk, and a key management service defends the sniffed request.
- **D.** IAM policy defends the stolen disk, and multi-factor authentication defends the sniffed request.

### 9.

A service carries a 30-minute recovery time objective. Which recovery arrangement is consistent with it?

- **A.** A hot site with equipment running and recent data already loaded.
- **B.** A warm site holding hardware, with data restored from backup when needed.
- **C.** A cold site with space, power and environmental control provisioned.
- **D.** Nightly off-site tape rotation with a documented restore procedure.

### 10.

Running `diff -u old.conf new.conf` produces a unified-format hunk with a line prefixed `-` and another prefixed `+`. Which file does the `-` line come from?

- **A.** The second file, `new.conf` — the operands are read right to left
- **B.** Neither file specifically; `-` marks a line that was moved rather than added or removed
- **C.** Whichever file is alphabetically first, regardless of command-line order
- **D.** The first file, `old.conf`, which is present there and absent from `new.conf`

### 11.

After an unauthorised change is discovered, a manager proposes "enable auditing" as the fix that prevents it from happening again. What is wrong with that framing?

- **A.** Nothing is wrong; enabling auditing is itself a preventive control, because a system that is watching refuses any action it cannot attribute.
- **B.** Auditing is wrong here because the correct fix is always multi-factor authentication, which re-checks the operator's identity before each write.
- **C.** Auditing is a detective control; it can establish that the change happened but cannot itself have stopped it, so the preventive fix is an authorization change.
- **D.** Auditing is wrong because the real gap was in encryption at rest, which would have made the stored record unwritable without the key.

### 12.

A branch office link is upgraded from 100 Mbit/s to 1 Gbit/s. Nightly bulk backups finish much faster, but an interactive ticketing application "feels exactly the same" to users. Why is that outcome expected rather than a sign the upgrade failed?

- **A.** The ticketing application's responsiveness is dominated by latency, the per-request delay for many small requests, which capacity upgrades do not change; bulk backups are throughput-bound and benefit directly from more bandwidth.
- **B.** The upgrade genuinely failed for the interactive application, since any bandwidth increase is defined to proportionally reduce every kind of user-perceived delay equally.
- **C.** The ticketing application must be using UDP rather than TCP, since only a UDP-based application would fail to benefit from additional link bandwidth.
- **D.** The ticketing application's lack of improvement means DNS resolution, not the link itself, must be the actual bottleneck limiting its performance.

### 13.

A colleague argues that deploying `api:latest` guarantees production always runs the newest build. Is that correct?

- **A.** Yes, because the registry automatically recalculates which image is newest and moves the `latest` tag to match on every push, the same way it is assumed to track semantic version numbers.
- **B.** Yes, but only for images built with `docker build -t api .`, since that specific command guarantees a newest-build tag.
- **C.** No, because `latest` is reserved by the registry and can never actually be assigned to a pushed image.
- **D.** No, `latest` is only the default tag a reference falls back to when none is given, and it is a mutable pointer that can be repointed to any image at all.

### 14.

AWS's business case for cloud computing argues the same accounting trade in different words than 'CapEx versus OpEx.' Which pair of terms does that specific page actually use?

- **A.** Fixed expense versus variable expense: the underlying trade is the same, but this page never uses the words 'CapEx' or 'OpEx.'
- **B.** Capital expenditure versus operational expenditure, quoted directly from that same AWS business-case page word for word.
- **C.** Predictable versus elastic capacity, describing the pay-as-you-go meter rather than an accounting category.
- **D.** Committed versus interruptible workload, the axis separating reserved pricing from spot pricing elsewhere in this competency.

### 15.

An operator runs `find . -name *.log` in a directory whose only `.log` file is `error.log`, and the results contain nothing but files named `error.log`, even though several other `.log` files exist in subdirectories. What went wrong with the command?

- **A.** `find` only searches one level deep unless it is given `-R` to recurse
- **B.** `.log` files are treated specially and excluded from recursive search
- **C.** `find` requires `-type f` before `-name` will match anything
- **D.** The unquoted pattern was expanded by the shell before `find` ever saw it

### 16.

A traceability matrix shows every numbered requirement linked to at least one test case. What does that demonstrate, and what does it not?

- **A.** It demonstrates that the system was validated against the real need it was meant to serve, since every requirement has a test exercising it.
- **B.** It demonstrates that user acceptance testing has been completed for every requirement in the release, since a linked test is an executed test.
- **C.** It demonstrates that every requirement passed its test, since each one is linked to a test case and none is left uncovered in the matrix.
- **D.** It demonstrates coverage — every requirement has at least one test linked to it — but not that any test was run or passed, or that the requirement was the right one.

### 17.

A "the network is down" report turns out to have raw IP addresses working perfectly while every name-based connection fails. Which service is implicated, and how does that differ from a DHCP failure?

- **A.** DNS is implicated: it translates names to addresses, and its failure signature is addresses working while names do not; DHCP failure instead shows up as no address at all, or a 169.254 link-local one.
- **B.** DHCP is implicated, since a report described broadly as "the network is down" traces back to an addressing failure before any other service is affected.
- **C.** ARP is implicated, since ARP is the step that maps a hostname onto the MAC address a frame has to carry before it can leave the host.
- **D.** NAT is implicated, since NAT rewrites the hostname carried inside each packet alongside the addresses in its headers.

### 18.

Running `ip -6 addr` on a host with IPv6 routing disabled at the site still shows an address beginning `fe80::`. A colleague concludes IPv6 must be misconfigured somewhere. Is that right?

- **A.** No, every interface self-assigns a link-local address automatically, so seeing `fe80::` is normal even when no site-wide IPv6 routing exists.
- **B.** Yes — a link-local address only appears if a rogue DHCPv6 server on the segment has misassigned it in error in the overwhelming majority of real deployments.
- **C.** Yes — its presence means the host is actively routing IPv6 traffic to the wider internet right now.
- **D.** No, but only because `fe80::` is actually the IPv6 loopback address rather than a link-local one.

### 19.

Authentication, accounting and auditing, and multi-factor authentication are often offered as alternatives to one another. Which axis actually separates them?

- **A.** How strong each is: accounting is the weakest of the three, authentication is moderate, and MFA is the strongest because it checks more than one factor.
- **B.** What each costs to deploy — MFA is the most expensive, authentication moderate, and accounting the cheapest because it only writes log lines.
- **C.** How widely each is scoped: authentication covers a single system, accounting covers a whole organisation, and MFA covers only privileged accounts.
- **D.** When each acts: authentication decides access before it is granted, accounting records what happened afterwards, and MFA strengthens the authentication step rather than adding a further stage.

### 20.

To cut costs, an engineer detaches an idle disk from its virtual machine but does not delete it. How much money does that detachment save?

- **A.** The egress charge for the disk's most recent read, since detaching stops any further data transfer.
- **B.** Most of the storage rate, since detached storage bills at a reduced idle rate compared to attached storage.
- **C.** The full per-gigabyte-month rate is waived once a disk is detached, since it is no longer serving a workload.
- **D.** Nothing, since storage bills for existing, not for being attached or read.

### 21.

Run with no argument at all, what does the `cd` builtin do, and is that a usage error?

- **A.** It reports a usage error, since `cd` always requires a target directory
- **B.** It moves to the root directory `/`, treating a missing argument as the top of the tree
- **C.** It changes to `$HOME`; this is a normal, valid invocation, not an error
- **D.** It repeats the previous `cd` target, the same as `cd -` would

### 22.

A scaling request asks for "five instances" of a service. One engineer interprets this as five pods; another as five containers inside one pod. Which is the Kubernetes model, and why does it matter?

- **A.** Five containers inside one pod, since a pod is simply Kubernetes' name for a larger container that can hold several processes.
- **B.** Either interpretation is equally correct, since the scheduler treats containers and pods as interchangeable units of placement.
- **C.** Five Deployments, one per instance, since each running copy of the service needs its own separate Deployment object.
- **D.** Five pods, since the scheduler places pods, never containers directly, so scaling means creating more pods, not adding more containers to one.

### 23.

A thousand clients connect to the same web server on port 443 at once. How does the server distinguish one client's conversation from another's, given they all target the identical port?

- **A.** By destination port alone, since port 443 is defined to be unique per connection and the server simply opens a fresh port 443 instance for each new client.
- **B.** By MAC address alone, since every client's hardware address is preserved end to end and is what the server actually uses to distinguish one conversation from another.
- **C.** By TTL value alone, since each client's operating system sets a sufficiently distinct starting TTL for the server to use as a unique per-connection identifier.
- **D.** By the full four-tuple (source address, source port, destination address, destination port), since each client's own address and ephemeral source port make its connection unique even though the destination port is shared.

### 24.

What does the named comparison 'container vs virtual machine' refer to, as distinct from the concept 'virtual machine' on its own?

- **A.** It names the selection decision between two isolation technologies — which one to use for a given requirement — while 'virtual machine' names one of the two concrete things being selected between.
- **B.** They are the same concept under two names, since every virtual machine question is really a container-versus-VM question about which of the two technologies to select, and the two phrases are used interchangeably in practice.
- **C.** The comparison names a specific orchestration tool used to run containers on top of virtual machines, in the way a scheduler places workloads across a pool of hosts.
- **D.** The comparison applies only to on-premises infrastructure, while 'virtual machine' applies only to cloud infrastructure, so the two terms never appear in the same discussion.

### 25.

A vendor publishes a product's complete source code in a public repository, but the licence prohibits offering the software as a competing hosted service. Under the Open Source Definition, is this open source software?

- **A.** Yes, because publishing the source publicly is the one thing proprietary software withholds, and this vendor did not withhold it.
- **B.** No, but only because the licence never uses the phrase "free software" anywhere in its text.
- **C.** No; restricting a field of endeavour such as competing commercial use fails OSD 6, regardless of how visible the source is.
- **D.** Yes, since the Open Source Definition is only concerned with whether the source is visible to the public.

### 26.

Name the four layers of the TCP/IP model in order, from the physical segment to the software a user interacts with.

- **A.** Physical, internet, session, application.
- **B.** Link, network, presentation, application.
- **C.** Data link, transport, internet, application.
- **D.** Link, internet, transport, application.

### 27.

Two users choose the same password on a system that stores salted SHA-256 hashes. An attacker steals the database. Why does salting alone not make this table safe against a determined attacker?

- **A.** It is not safe because the salt must be kept secret and this system almost certainly stored it in the clear next to the hash.
- **B.** The salt defeats precomputation and stops the two users producing identical hashes, but SHA-256 is fast, so each individual guess is still cheap to try.
- **C.** It is not safe because SHA-256 is reversible with the right key, unlike a true one-way hash.
- **D.** It is not safe because this describes encryption, not hashing, and encryption always requires a shared key an attacker can also steal.

### 28.

A long listing shows `drwxr-xr-x` for a directory. Who, specifically, is permitted to create a new file inside it?

- **A.** Only the owner, since only the owner triad includes `w`
- **B.** The owner and the group, since both triads include `r` and `x`
- **C.** Everyone, since `x` is set for owner, group and other alike
- **D.** No one, since `w` does not appear anywhere in `drwxr-xr-x`

### 29.

An administrator edits `/etc/default/grub` to change the default boot entry and reboots, but the change has no effect. What step was skipped?

- **A.** Regenerating `grub.cfg` — with `update-grub` on Debian-family systems, or `grub2-mkconfig` on Red Hat-family ones — since `/etc/default/grub` only feeds that generation step
- **B.** Nothing was skipped; `/etc/default/grub` is read directly by GRUB at boot time
- **C.** The change needed `systemctl daemon-reload` to take effect — GRUB's menu is rebuilt by a systemd generator during each boot, so the manager has to be told to re-read its configuration first
- **D.** UEFI Secure Boot must be blocking the new default entry from being honoured

### 30.

A team wants to put a transactional database's live data files directly on object storage to save on cost per gigabyte. Why does this fail mechanically rather than merely run slowly?

- **A.** Object storage replaces an object as a whole on every write; a database needs random in-place writes at arbitrary offsets, which object storage has no mechanism for at all.
- **B.** Because object storage has a strict per-object size limit smaller than most database files — the file would have to be split before it could be stored at all.
- **C.** Because object storage cannot be reached over an HTTP API from the database engine, leaving the engine no path over which to issue its reads and writes.
- **D.** Because object storage requires a filesystem to be formatted onto it before use, unlike block storage, and no filesystem can be formatted onto a key-addressed store.

### 31.

One team merges to its shared branch several times a day, with a build and test run triggered automatically on every merge. A second team runs the same pipeline definition nightly against a set of long-lived feature branches, without merging them anywhere near that often. Which team is practising continuous integration?

- **A.** Both teams, since owning an automated pipeline that builds and tests every change is what continuous integration means, whatever the merge frequency behind those runs happens to be.
- **B.** Neither, unless the resulting build is also deployed automatically into an environment afterward.
- **C.** The first team, because continuous integration is the practice of merging and verifying frequently, which the second team's nightly automation does not by itself establish.
- **D.** The second team, because a scheduled nightly run is more disciplined than merging several times within a single day.

### 32.

`df -h` reports a filesystem at 100% used, but `du -sh` walking the same filesystem from the top totals far less than what `df` reports. What kind of cause does that gap point at?

- **A.** `du` must simply be miscounting, and rerunning it with different flags will resolve the discrepancy
- **B.** The filesystem must have run out of inodes rather than blocks — an exhausted inode table is billed to `df` as used space while contributing nothing that `du` can walk to
- **C.** The discrepancy always means the filesystem needs an `fsck` before anything else is checked
- **D.** A structural cause invisible to `du` — most commonly a deleted file still held open by a running process

### 33.

A script begins with `#!/bin/bash` and is executable, but running it as `sh script.sh` produces different behaviour than running it as `./script.sh`. Why does the shebang not apply in the first case?

- **A.** The shebang is honoured only when the file is executed directly; explicitly naming an interpreter bypasses it
- **B.** The shebang line only takes effect after the script has run once successfully
- **C.** `sh script.sh` and `./script.sh` are two names for the exact same operation, because the shell rewrites the first form into the second before running it
- **D.** The shebang only applies to the first line of output, not the first line of the file

### 34.

Which of the three terms — vulnerability, threat, risk — is the only one that carries a magnitude, and what does removing any one of the three do to it?

- **A.** Threat carries the magnitude, since an actor's capability and intent set the scale of what can happen regardless of the flaw.
- **B.** Only risk carries a magnitude, and removing any one of the three collapses it, so patching the vulnerability, blocking the threat's access, or reducing the impact all work.
- **C.** Vulnerability carries the magnitude, expressed through its CVSS score.
- **D.** All three carry the same magnitude, since they are used interchangeably in practice and describe one underlying exposure viewed from three different angles.

### 35.

An auditor has high influence over a project's release but low day-to-day interest in its progress. What should the communication plan record for her?

- **A.** A summary delivered at phase boundaries, plus immediate notification if anything breaches a defined threshold — matched to her influence and interest, not to the delivery team's daily cadence.
- **B.** Inclusion in the delivery team's daily coordination event, since high influence means she needs the same level of detail as the team, regardless of how much day-to-day interest she actually has.
- **C.** Nothing, since her low day-to-day interest means she does not need to be tracked as a stakeholder at all.
- **D.** Read access to the issue tracker in place of any scheduled communication.

### 36.

How many colon-separated fields does a line in `/etc/group` have, and how does that compare with `/etc/passwd`?

- **A.** Seven fields in both files, since they share the same layout convention
- **B.** Four fields in `/etc/group`, against seven in `/etc/passwd`
- **C.** The reverse pairing — seven for `/etc/group` and four for `/etc/passwd`
- **D.** Four fields in `/etc/group`, against nine in `/etc/passwd`

### 37.

Google's SRE book gives a test for telling an SLA from an SLO. What is that test?

- **A.** Ask whether the target is expressed as a percentage — a percentage always signals an SLA rather than an SLO.
- **B.** Ask whether the target applies to the whole platform or to a single customer's account — platform-wide targets are SLAs, account-specific targets are SLOs.
- **C.** Ask what happens if the target is not met; if there is no explicit consequence, it is an SLO, not an SLA.
- **D.** Ask whether the target is set by the provider or by the customer's own team — provider-set targets are SLAs, self-set targets are SLOs.

### 38.

Why does `visudo` exist instead of editing `/etc/sudoers` with a normal text editor?

- **A.** It is only a convenience wrapper that opens the file in a nicer editor with syntax highlighting
- **B.** It validates the syntax before installing the file, so a mistake cannot lock every administrator out of privilege escalation at once
- **C.** It encrypts the sudoers file so its contents cannot be read by anyone but root — the plaintext is decrypted into memory only while `sudo` evaluates the policy
- **D.** It is required because `/etc/sudoers` cannot otherwise be opened by any editor

### 39.

A team runs Jenkins, Terraform, and a fully automated pipeline, but developers still hand every release to a separate operations group that owns production. Is this team practising DevOps?

- **A.** Yes, since running a modern CI/CD toolchain and infrastructure-as-code is what the term DevOps refers to.
- **B.** Yes, provided the two groups coordinate informally on a regular basis, since regular coordination substitutes for changing who is accountable once work has shipped to users.
- **C.** No, because DevOps is one team owning the whole path from development through production operations, and the toolchain is only how that ownership gets exercised.
- **D.** No, but only because the handoff slows the feedback loop rather than because ownership stayed split.

### 40.

After running `sudo -i`, an operator runs `whoami` and it prints `root`. Which command instead reports the original account that actually logged in?

- **A.** `id -u`, since it reports the numeric UID of the original account
- **B.** `whoami` run a second time, since the first invocation caches a stale result
- **C.** `who am i`, which reads the original login name from the utmp record
- **D.** `w`, since its header always lists the account that first logged in

### 41.

A team adopts containers, an orchestrator and standard SQL specifically to reduce lock-in before choosing a cloud provider. Does this eliminate their exposure to vendor lock-in?

- **A.** No — these portability layers reduce the technical component of lock-in, but they do not touch data gravity, egress cost, or the operational expertise the team will still build up around whichever provider it chooses.
- **B.** Yes — using only portable, standard technologies removes vendor lock-in entirely, regardless of provider, since anything expressed in standard SQL and a container image can be lifted to another platform at no cost at all.
- **C.** Yes, because containers and standard SQL guarantee the application can be moved back to on-premises hardware at no cost, the stored data following the code automatically.
- **D.** No, because standard SQL only works with a single specific cloud provider's managed database offering, so the portability the team thought it was buying was never there.

### 42.

An administrator sets `PasswordAuthentication no` in `sshd_config`, reloads the daemon, and users are still prompted for a password. `PermitRootLogin` is untouched at its default. What is the most likely cause?

- **A.** The setting only takes effect after a full system reboot, not after a daemon reload.
- **B.** `PermitRootLogin` at its default `prohibit-password` is overriding `PasswordAuthentication` for all accounts, not just root, when `prohibit-password` only governs how root itself may authenticate and does not extend to overriding the setting for other named accounts.
- **C.** The public key was never generated with `ssh-keygen`, so the server falls back to a password prompt automatically.
- **D.** `KbdInteractiveAuthentication` is still at its default `yes`, and on a PAM-backed system that path can still prompt for a password.

### 43.

A kernel package was installed an hour ago. What does `uname -r` report right now, and when does that change?

- **A.** The newly installed kernel version, since installation immediately updates the running kernel
- **B.** The distribution release rather than any kernel version, since `uname -r` reports OS release information
- **C.** The previously running kernel version — installing a package changes what is on disk, not what is running, until the machine reboots
- **D.** An error, since two kernel versions cannot coexist on disk at the same time — installing a new kernel package overwrites the previous image and its module directory

### 44.

'Which desktop environment does Ubuntu use' is asked as if it has one fixed answer. What makes that framing unreliable?

- **A.** Desktop environment choice is fixed permanently at the kernel level and cannot vary between different installs of the same distribution's official installation image at all.
- **B.** Most major distributions ship several desktop environments as installable options or spins, so the honest answer is 'whichever the specific install chose,' not a fixed mapping.
- **C.** Ubuntu specifically has never offered more than one desktop environment option to install on any release.
- **D.** The question is reliable; every distribution has exactly one desktop environment it ships with by design choice, always.

### 45.

A project is cancelled halfway through. The team disbands and moves to other work without a formal closure step. What has been skipped, and how does that omission differ from skipping a single Sprint Retrospective?

- **A.** Nothing was skipped, since closure only applies to projects that finish their full planned scope, and a cancellation ends the project's obligations the moment work stops.
- **B.** The Sprint Retrospective, since the team never held one before disbanding, and a Retrospective is where a Scrum Team is conventionally expected to capture what it learned before moving on to whatever comes next, project or otherwise, however the work happens to end.
- **C.** Closure itself — a cancelled project is still formally closed, with contracts ended, resources released and lessons recorded once; a skipped Retrospective instead only loses one team's chance to improve mid-project, not the project's only opportunity to record what happened.
- **D.** Nothing substantive — the issue tracker already holds a record of everything that happened, and anyone curious about the project later can simply read back through its tickets.

### 46.

What is PID 1, and what happens to a process whose parent has exited before it does?

- **A.** PID 1 is reserved for the kernel itself, and an orphaned process is simply terminated
- **B.** PID 1 is the init system, the ancestor of every other process, and an orphaned process is re-parented to it
- **C.** PID 1 is whichever process currently has the highest CPU priority — the kernel renumbers it whenever another process is reniced below the current holder
- **D.** An orphaned process becomes a zombie until an administrator manually reaps it

### 47.

Two teams each provision their own virtual private cloud for their applications. With no additional configuration, can a resource in one reach a resource in the other?

- **A.** No, because a firewall rule is blocking the traffic by default.
- **B.** Yes, as long as both networks were created in the same region.
- **C.** No. Resources in two different virtual networks cannot reach each other by default; a peering connection or private link is required.
- **D.** Yes, because both networks use subnets carved from the same private address ranges, and shared addressing from the same private ranges is what actually establishes reachability between two networks.

### 48.

`main` has not received any new commits since `feature/retry` branched off it. A developer runs `git merge feature/retry` while on `main`. What does the resulting history look like?

- **A.** The `main` pointer simply advances to `feature/retry`'s tip, and no merge commit is created at all.
- **B.** A new merge commit appears with both branch tips as its parents, recording that the merge happened.
- **C.** The commits from `feature/retry` are replayed on top of `main` as new commits with new hashes.
- **D.** Git refuses the merge and asks for a pull request to be opened instead.

### 49.

An administrator argues that logging in via `sudo -i` and staying in that root shell all afternoon satisfies least privilege, because `sudo` was used rather than `su`. Is that correct?

- **A.** Yes, because `sudo` always logs individual commands, which by itself satisfies least privilege
- **B.** Yes, because `sudo` requires the administrator's own password rather than the root password
- **C.** No — an all-afternoon root shell holds the same authority either way; least privilege is about how much and how long, not which command opened it
- **D.** No, but only because `sudo -i` is slower to authenticate with than `su -` — the extra policy lookup `sudo` performs is what the principle is actually measuring

### 50.

A company with 3,000 employees maintains per-user, per-file access grants and finds the list unmanageable as staff join and leave. Which access control model addresses the maintenance problem, and what does adopting it not by itself guarantee?

- **A.** Role-based access control, and it is automatically more secure than discretionary access control because roles are mandatory rather than discretionary.
- **B.** Role-based access control — permissions are defined once per role instead of once per user per object, but adopting it does not by itself make the system more secure than discretionary access control, only cheaper to maintain.
- **C.** Data classification — assigning a sensitivity label to each file removes the need to track individual grants, since the label itself becomes the access decision.
- **D.** Placing every employee in a single Unix group achieves the same result as role-based access control, since a group is also a role.

### 51.

A team debates whether a new internal tool, running exclusively on headless cloud servers and administered over SSH, needs a GUI. What is the strongest justification for defaulting to CLI here?

- **A.** The shell itself cannot run a GUI application under any circumstances, so CLI is therefore claimed to be the only option technically available on the machine in this situation at all.
- **B.** No display server or desktop environment needs to run, saving memory and CPU the server has no other use for, and CLI output can be piped and scripted for automation.
- **C.** A headless server has no terminal available, so CLI administration is not actually possible on it either, in that case.
- **D.** Servers can never run a GUI at all, regardless of configuration, which settles the debate outright either way immediately.

### 52.

Runlevels are described as mutually exclusive, but targets are not. What does that structural difference mean in practice?

- **A.** It means targets are simply renamed runlevels with no real behavioural difference
- **B.** It means runlevels can be active simultaneously but targets cannot — which is why `systemctl isolate` exists, to enforce one target at a time
- **C.** It means only `rescue.target` and `emergency.target` can coexist with other targets
- **D.** Exactly one runlevel could be active at a time under SysV init, while several systemd targets can be active simultaneously

### 53.

An instance in a scaling group terminates unexpectedly, outside of any scale-in event. What does the scaling group do?

- **A.** Nothing, until a human confirms the loss and manually requests a replacement instance.
- **B.** It raises the group's configured maximum capacity to compensate for the loss.
- **C.** It launches a replacement to hold the group back at its desired capacity, without anyone being paged.
- **D.** It triggers a DNS-based redirection to a standby group in another region.

### 54.

A session store is read once per request by session id and never joined to anything else. Storage volume is high and access is always by that one key. Which store family fits, and on what basis?

- **A.** A relational database, since it offers the strongest data-integrity guarantees regardless of access pattern.
- **B.** A NoSQL key-value store, given that fetching a record whole by one key with no joins is the access pattern that model is designed for.
- **C.** Either — NoSQL is simply a faster, schema-free relational database, so the choice between them comes down to preference rather than the shape of the access pattern.
- **D.** A message queue, since high volume calls for a buffer between producer and consumer.

### 55.

`free -h` shows several gigabytes of swap in use on a server that otherwise seems healthy. Is that, by itself, evidence of a memory problem?

- **A.** Yes, any non-zero swap usage means the machine needs more RAM immediately
- **B.** No, but only because `free -h` cannot report swap usage accurately — it reads a cached total that is refreshed only when a swap device is added or removed, so the figure it prints can be arbitrarily stale on a long-running server
- **C.** Yes, and disabling swap entirely is the correct fix for a machine under any memory pressure
- **D.** No — swap in use and swapping in progress are different things; pages evicted hours ago and never touched since remain "used" without indicating current trouble

### 56.

A developer edits `config.yml`, runs `git add config.yml`, then edits `config.yml` again before running `git status`. Under which heading does `git status` list the file, and why?

- **A.** Only "Changes to be committed", since staging a file keeps tracking every edit made to it afterward
- **B.** Under both "Changes to be committed" and "Changes not staged for commit", listing the staged content from the first edit and the later edit as unstaged.
- **C.** Only "Untracked files", since the second edit effectively resets the file's tracking state
- **D.** Neither heading, because `git status` only reports differences since the last commit, not since the last `add`, so a re-edited staged file would be invisible to it entirely

### 57.

A team rotates its outer key-encrypting key every quarter without re-encrypting any of the data that key ultimately protects. How is that possible?

- **A.** It isn't really possible — every key rotation must re-encrypt the underlying data, so the team's process is unsound and will eventually corrupt the dataset it protects.
- **B.** The data was pseudonymized rather than encrypted, so no key ever protected it directly in the first place, which is why nothing needed to change when the outer key rotated.
- **C.** The data was in transit at the time of rotation, so no at-rest key ever needed to change.
- **D.** Envelope encryption — the key-encrypting key only wraps the data-encryption key, so rotating the outer key re-wraps the inner one without touching a byte of the underlying data.

### 58.

`lsblk` output shows `sda` as a parent row with `sda1` and `sda2` indented beneath it. Treating `sda1` as if it were the entire disk, what mistake follows?

- **A.** Assuming the stored data will be permanently lost on the next reboot, since only volatile RAM contents are ever known to reset in that particular way.
- **B.** Believing the filesystem type is always ext4 unless `-f` is explicitly passed as a flag to `lsblk`.
- **C.** Acting on the wrong device; `sda1` is one partition of the whole disk `sda`, and operations meant for the full disk would then target only part of it.
- **D.** No real mistake follows, since `sda` and `sda1` always hold exactly identical data at every point in time.

### 59.

A load balancer forwards TCP connections to backends without ever inspecting the request inside them, and a separate load balancer routes requests to different backend pools depending on the URL path. What is the difference between the two?

- **A.** The first is failover and the second is load balancing, since only the second reacts to every request — a labelling error that assigns the failure-triggered name to two mechanisms that are both, in fact, acting on every single request.
- **B.** The first is for internal traffic only, and the second is for traffic arriving from the public internet.
- **C.** The first operates at the transport layer; the second operates at the application layer, where routing on path, hostname or header becomes possible.
- **D.** The first requires sticky sessions on every backend, and the second never needs them.

### 60.

Mid-investigation, your first theory's test comes back negative. What does that outcome rule out, and what should happen next?

- **A.** It rules out that specific cause and the fix already planned for it; return to theory formation with one candidate eliminated.
- **B.** It rules out nothing yet; apply the fix you had already planned for that cause anyway, on the theory that trying it costs little and might happen to help.
- **C.** It points the investigation toward a user-specific cause rather than a host-wide one, so narrow the scope again.
- **D.** It signals the problem is outside your expertise, so escalate with the evidence gathered so far.

