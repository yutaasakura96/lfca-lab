<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 16

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-16-answers.md](exam-16-answers.md)

---

### 1.

You need to copy a large directory tree to a backup host nightly, transferring only the files that changed since the previous run. Which tool is designed for that?

- **A.** `rsync` run nightly against the backup host
- **B.** `tar` writing a fresh archive on every run
- **C.** A filesystem snapshot of the source volume
- **D.** Continuous replication to the backup host

### 2.

Data in a storage bucket is encrypted at rest and protected by TLS in transit. Does either of those defend against an over-privileged but authorised identity reading the data?

- **A.** Yes — encryption at rest specifically blocks reads from any identity that was not present when the encryption key was created.
- **B.** Yes — TLS is widely understood to terminate the connection before an over-privileged but fully authenticated and authorised identity's own request can ever reach the underlying storage layer at all.
- **C.** No. The service decrypts for any caller it has authorised, so neither protects against an over-privileged identity; that is a least-privilege problem, not an encryption problem.
- **D.** No, but choosing a customer-managed key instead of a provider-managed key would have stopped the over-privileged read.

### 3.

An operator writes `awk "{print $1}" /etc/passwd` inside double quotes and gets empty output with no error. What consumed the `$1` before awk ever ran?

- **A.** The shell expanded `$1` as its own positional parameter, usually empty, before awk saw the program
- **B.** awk itself does not support `$1` as field syntax; only `$NF` is valid, because awk can address a record's last field by name but no earlier field by number
- **C.** `/etc/passwd` has no first field, so `$1` legitimately prints nothing
- **D.** awk requires `-F` to be set before any field variable will be recognised

### 4.

An assessor has to decide whether a required control met its bar during the review period. Which of policy, standard or procedure supplies the measurable threshold that decision is made against?

- **A.** The procedure, because it sets out the exact steps staff followed, which is the level the control itself has to reach.
- **B.** The policy, because it states the organisation’s overall intent, which is the bar every control it owns has to clear.
- **C.** The standard, because it is the tier that turns intent into a measurable, mandatory requirement a control’s performance can be compared against.
- **D.** A guideline, because guidelines are the mandatory tier an assessor holds a control to before any other is considered.

### 5.

A Dockerfile copies the entire source tree before installing dependencies, and every code change now forces a full dependency reinstall on rebuild. Why?

- **A.** Because dependency installation always re-downloads from the network regardless of what changed, independent of layer order.
- **B.** Because the registry re-validates every layer of an image before allowing a new build to be pushed to it.
- **C.** Because the base image is pulled fresh on every build unless a version tag is explicitly pinned in the `FROM` line.
- **D.** Because a changed layer invalidates the cache for its own layer and every layer that follows it in the file's order.

### 6.

A team already has a gap analysis showing six differences between current and desired capability. What question does a feasibility study add that the gap analysis did not answer?

- **A.** Whether closing those gaps is technically, operationally and economically achievable, before anyone commits.
- **B.** How large the differences are between the current and desired states.
- **C.** Which of the six differences should be addressed first, since ordering by value is treated as part of naming the gaps rather than a separate step.
- **D.** Nothing new — a feasibility study and a gap analysis answer the same question in different words.

### 7.

Two application servers are load balanced, each with dual power supplies, and both draw from one switch. Where is the single point of failure?

- **A.** The switch, because no duplicate exists for it.
- **B.** The application servers, because two is too few for redundancy.
- **C.** The dual power supplies, because two units inside one chassis do not count as redundancy.
- **D.** The load balancer, because balancing implies a single decision point.

### 8.

A finance team argues that moving from owned servers to cloud compute is a straightforward cost win, since the monthly bill is smaller than the loan payments on a server refresh would have been. What does the CapEx-to-OpEx shift actually establish on its own?

- **A.** It proves cloud is cheaper, once staffing and power costs are added to the on-premises side of the comparison.
- **B.** It changes the shape and reversibility of spending, from a fixed sum committed once to a variable charge stoppable at will, not that the eventual total is necessarily smaller.
- **C.** It proves consumption is billed only for work actually performed, not for capacity left running idle.
- **D.** It replaces a capital budgeting process with no budgeting process at all, since usage is metered automatically and the provider is now responsible for staying within any limit.

### 9.

A team must reduce its recovery point objective from 24 hours to 1 hour. Which change achieves that?

- **A.** Capture backups or log shipments at least hourly.
- **B.** Provision a hot site so recovery completes faster.
- **C.** Automate failover so the standby takes over unattended.
- **D.** Extend retention so more historical copies are available.

### 10.

A colon-delimited `/etc/passwd`-style file needs just the first field — the username — printed for every line. Which command does that directly?

- **A.** `sort -k1 /etc/passwd`, since `-k` selects a specific field to work with
- **B.** Running `cut -d: -f1 /etc/passwd` to split on the colon and take the first field
- **C.** `wc -l /etc/passwd`, since it reports on the first line of structured input
- **D.** `uniq -c /etc/passwd`, since it summarises the first column by default and reduces each line to that column with a count in front

### 11.

A vendor tells a customer it is 'SOC 2 certified.' What is wrong with that claim, and how does it differ from what ISO 27001 actually provides?

- **A.** Nothing is wrong; SOC 2 and ISO 27001 both issue certificates, just from different kinds of assessor.
- **B.** Nothing is wrong; SOC 2 is a statutory requirement for any organisation that processes customer data of any kind whatsoever.
- **C.** The claim is wrong because SOC 2 is actually a card-industry standard rather than a voluntary security attestation framework adopted by choice.
- **D.** SOC 2 produces an examination report from a CPA firm, never a certificate; ISO 27001 is the one of the two that produces certification, through an external accredited body.

### 12.

What does the conventional `hosts:` value `files dns` in `/etc/nsswitch.conf` actually determine?

- **A.** It determines which DNS record types a resolver is permitted to request, restricting queries to the record types both listed sources are able to supply.
- **B.** It determines the order name resolution sources are consulted: `/etc/hosts` is read first, and a nameserver is queried only if no entry there matches.
- **C.** It determines the TTL applied to cached answers, with `files` and `dns` each specifying a separate caching duration.
- **D.** It determines whether `/etc/resolv.conf` is regenerated automatically at boot, based on which of the two keywords appears first.

### 13.

A service needs to be reachable from the public internet through a provider-managed load balancer. Which Service type fits, as opposed to the cluster-internal default?

- **A.** ClusterIP, since it is the default type and a default is always the safest starting point for an exposure requirement.
- **B.** NodePort alone, since exposing a static port on every node in the cluster provides the same health checking and traffic distribution a provider-managed load balancer performs.
- **C.** A Deployment with `hostNetwork` enabled, which bypasses the Service abstraction entirely and lets external traffic reach the pod directly.
- **D.** LoadBalancer, which exposes the Service externally through a load balancer, typically provisioned by the cloud provider — unlike ClusterIP, the default that stays internal only.

### 14.

A cost report shows a line with no corresponding running workload: an unattached disk left behind when its virtual machine was deleted. Is this an orphan or a rightsizing candidate, and what follows from that?

- **A.** A rightsizing candidate — an unattached disk is simply oversized for its current use and should be resized down.
- **B.** Neither — without an owner tag on the disk, no action can be taken on it at all.
- **C.** It stopped billing once its virtual machine was deleted, so no action is needed either way.
- **D.** An orphan; it serves no purpose at all, so the correct action is deletion, not resizing.

### 15.

A file was created thirty seconds ago and must be located immediately by name across a large tree. Comparing the tools that answer "where is this file," which one should be used, and which should be ruled out?

- **A.** `locate`, because it is faster and speed is what the scenario asks for
- **B.** `which`, because it searches every directory a file could have been created in
- **C.** `find`, because it walks the tree live; `locate` would miss a file this recent
- **D.** `whereis`, because it searches the whole filesystem for any name given to it — it walks every mounted filesystem before reporting

### 16.

Which condition, if any, does the plain MIT licence impose regarding patents held by the code's contributors?

- **A.** An implied patent licence limited to claims necessarily infringed by the contributor's own code, mirroring Apache-2.0 section 3's scope.
- **B.** A reciprocal obligation requiring any patented derivative work to be licensed back to the community under MIT's own terms.
- **C.** None, because MIT says nothing about patents at all, which is the specific difference Apache-2.0's express patent grant addresses.
- **D.** The identical patent-litigation-termination clause Apache-2.0 carries, since both licences are commonly grouped together as the permissive family.

### 17.

Two hosts show `192.168.5.40/24` and `192.168.5.200/24` in their `ip addr` output. A technician asks whether traffic between them needs a router. What decides the answer, and what is it here?

- **A.** The addresses alone decide it, and since the last octets differ, a router must be involved regardless of any mask.
- **B.** The subnet mask decides it, and here both addresses share the /24 network portion, so they are on the same subnet and no router is needed.
- **C.** The default gateway decides it, since only a configured gateway can determine whether two hosts share a subnet.
- **D.** The hosts' MAC addresses decide it, since matching manufacturer prefixes indicate hosts on the same physical segment, a conclusion that seems to follow from everyday experience.

### 18.

A predictable interface name reads `enp0s3`. Decode what each part of that name is saying about the interface.

- **A.** `en` for Ethernet, `p0` for PCI bus 0, `s3` for slot 3: an Ethernet interface located at PCI bus 0, slot 3, derived from the hardware's own topology.
- **B.** `en` for a wireless interface, `p0s3` for the fourth interface detected at boot, in the same detection-order scheme `eth0` and `eth1` used previously.
- **C.** `en` for the network manager in use, `p0s3` for the fourth priority level assigned to the interface by that manager's configuration.
- **D.** `enp0s3` is an entirely arbitrary, randomly generated label with no decodable structure or relationship to the underlying hardware at all.

### 19.

An engineer with legitimate database access quietly exports a customer table over several weeks. No authentication or authorization control was ever bypassed. Which control is positioned to detect this, and why can the first two As of AAA not catch it by design?

- **A.** Multi-factor authentication, because a stronger login would have stopped the export before any rows left the database.
- **B.** Authorization, because a permission check is re-evaluated on every row a query returns and would have failed partway through the export.
- **C.** Nothing in AAA addresses this; only network segmentation placed between the analyst and the database can detect a slow export.
- **D.** Accounting and auditing, because authentication and authorization only judge whether access is granted, not what a legitimately admitted identity then does with it.

### 20.

A team says 'containers are lightweight, so we should containerise everything and stop paying for virtual machines.' What mechanism does that slogan skip over?

- **A.** The mechanism it skips is that containers cannot run on shared physical hardware, unlike virtual machines, so the density the slogan claims is only ever available from a hypervisor.
- **B.** It skips over the fact that containers are always more expensive per workload than virtual machines — each container image carries a full copy of the operating system it needs to boot.
- **C.** It skips over the fact that virtual machines cannot run on public cloud infrastructure at all, so the choice only arises for teams still running their own datacentre.
- **D.** The isolation cost — because containers share the host kernel, a kernel-level flaw has a blast radius covering every container on that host, which the slogan does not price in.

### 21.

Before running a destructive command against a relative path typed from memory, an operator wants to confirm which directory the shell is actually sitting in. Which single command reports that?

- **A.** `cd`, since it always reports the destination it moved to
- **B.** `ls -la`, since dotfiles are the usual cause of destructive mistakes
- **C.** There is no single command for this; the working directory can only be inferred from the shell prompt
- **D.** `pwd`, which prints the absolute pathname of the current working directory

### 22.

Which implication actually holds between continuous delivery and continuous deployment?

- **A.** Continuous delivery implies continuous deployment, and reversing that direction is the actual error to watch for.
- **B.** The two imply each other, since both automate the same pipeline up to the point where a release could happen.
- **C.** Continuous deployment implies continuous delivery, but continuous delivery does not imply continuous deployment.
- **D.** Neither implies the other; each depends independently on continuous integration having already run.

### 23.

Two engineers argue over whether a /26 network is bigger or smaller than a /24 network. Who is right, and by what factor?

- **A.** A /26 is larger — a longer prefix number means more addresses are set aside for that network.
- **B.** They are the same size — the prefix length only shifts which addresses the block occupies, not how many it contains.
- **C.** A /26 is smaller, a quarter the size of a /24, because each additional bit in the prefix halves the number of addresses in the block.
- **D.** A /26 is smaller, but by a factor of two rather than four, since the whole difference in prefix length halves the block exactly once, leaving 128 addresses against a /24's 256.

### 24.

Which deployment model does NIST SP 800-145 list among its four, and which term is conspicuously absent from that list despite being common industry vocabulary?

- **A.** Multi-cloud is one of NIST's four deployment models; hybrid cloud is the industry term absent from the list.
- **B.** Managed services is one of NIST's four deployment models; public cloud is the absent term.
- **C.** Community cloud is absent from NIST's list, while private cloud and multi-cloud are both named.
- **D.** Hybrid cloud is one of NIST's four deployment models (private, community, public, hybrid); multi-cloud is absent from that list entirely.

### 25.

Why does shipping a binary-only build of a GPL-licensed program create a compliance problem that shipping the same binary-only build of an MIT-licensed program does not?

- **A.** The GPL forbids compiling the covered program into a binary form in the first place, so any binary build already violates it.
- **B.** MIT requires a NOTICE file to accompany every binary it ships to a recipient, a requirement the GPL text does not carry at all.
- **C.** The GPL obliges anyone who conveys object code to also make its Corresponding Source available to recipients; permissive licences impose no source obligation at all.
- **D.** Both licences impose exactly the same source obligation on any binary-only release, since every open source licence treats compiled and source forms as legally identical in every respect.

### 26.

A `traceroute` to a destination dies at the very first hop with no response at all, though the service itself is known to work over TCP. What should be tried before concluding the path is broken?

- **A.** Nothing should be tried further; a trace dying at the first hop with the default method is conclusive proof the entire path to the destination is broken.
- **B.** The DNS resolver should be checked next, since a traceroute dying at the first hop is defined to always indicate a name-resolution failure for the destination.
- **C.** Re-running with `-I` or `-T` to switch to ICMP or TCP probes, since the default UDP method to unusual high ports is the most commonly filtered, and a firewall blocking it does not mean the service itself is unreachable.
- **D.** `mtr` should be run in report mode next as the only tool capable of using a probe method other than the one `traceroute` already tried.

### 27.

A user's browser receives a `401 Unauthorized` response, and a colleague reads that as an authorization failure. What is the correct reading, and which of the two processes must succeed before the other can even be evaluated?

- **A.** `401` means authorization failed, since the status name says "Unauthorized" directly.
- **B.** `401` means authorization failed, and authorization is always evaluated first because it determines whether a login prompt is shown.
- **C.** `401` reports an accounting failure, since the server could not record who made the request, though accounting has no HTTP status code of its own to report through.
- **D.** `401` means authentication failed, and authentication must succeed before authorization is evaluated at all.

### 28.

Comparing `[ $a -eq $b ]` with `[ "$a" = "$b" ]`, what is the difference in what each actually compares?

- **A.** `-eq` compares numbers; `=` compares strings, and using the numeric form on non-numeric text is an error
- **B.** They are interchangeable; both always compare their operands as plain text
- **C.** `-eq` is for use inside `[[ ]]` only, and fails whenever used inside single-bracket `[ ]`
- **D.** `=` only works for comparing filenames, not arbitrary string values, because `[` expands each operand as a glob before comparing them

### 29.

`systemd-analyze blame` names a unit that took 30 seconds during a slow boot, but nothing else was waiting on that unit while it ran. Was it the cause of the slow boot?

- **A.** Yes, the slowest-duration unit in `blame`'s output is always what held boot up
- **B.** Not necessarily — `blame` measures duration, not delay, and a unit that runs in parallel with nothing waiting on it costs nothing to boot time
- **C.** No, because `blame` only reports on the firmware phase, which happens before Linux is even running
- **D.** No, but only because the unit must have failed rather than merely run slowly — `blame` lists only units that exited non-zero, so appearing in its output is itself the failure signal

### 30.

A single-instance application running in one availability zone goes down for forty minutes when that zone fails. The provider's platform-wide 99.99% SLA was still met for the month. Who is accountable for the outage, and what does the SLA actually hand the customer?

- **A.** The provider is accountable, since a 99.99% SLA is a guarantee that any application running on the platform will stay available, and one zone failing counts against that platform-wide figure.
- **B.** The customer's own architecture is accountable, since a single instance in one zone was exposed to that zone's failure; the SLA only prices the provider's own shortfall, not this outage.
- **C.** The provider is accountable, and the SLA entitles the customer to compensation for the business revenue the outage cost, calculated from the losses the customer reports for the affected period.
- **D.** The customer is accountable, but only because a managed database was involved in the outage rather than a compute instance.

### 31.

A developer's laptop cannot match production's request volume, but a container image pins its language runtime's minor version, its linked libc, and its configuration mechanism to match production exactly. Has parity been achieved in the sense the exam means?

- **A.** No, because a laptop can never truly match production's conditions no matter what the container image happens to pin.
- **B.** No, because genuine parity requires an identical number of running instances at every single stage of the environment ladder.
- **C.** Yes, because parity is about shape rather than size, and the things that differ silently are what matter, while raw capacity is not one of them.
- **D.** Yes, but only because the same built artifact is also being promoted unchanged through every later environment.

### 32.

An `/etc/fstab` entry was just added for a new filesystem. What is the safe way to confirm the line is correct before the next reboot depends on it?

- **A.** Nothing is needed; a malformed `/etc/fstab` entry is safely ignored at boot
- **B.** `findmnt --target`, which shows what is currently mounted at the intended path
- **C.** `blkid`, to regenerate the UUID for the new filesystem before rebooting — an fstab line is only honoured once `blkid` has re-registered the filesystem's identifier
- **D.** `mount -a`, which mounts everything in the file not marked `noauto` and surfaces a syntax error while a shell is still available

### 33.

Without any `-n` flag, does `sed` print only the lines its script matched, or every input line regardless of whether it matched?

- **A.** Only the lines that matched the script's pattern, by default
- **B.** Nothing prints by default; sed requires `-p` on the command line to produce any output
- **C.** Only the last line of the file, matching `tail`'s default behaviour
- **D.** Every input line, whether it matched or not, unless `-n` is given

### 34.

`gpg --verify SHA256SUMS.asc SHA256SUMS` prints `Good signature` along with a warning that the signing key is not certified with a trusted signature. Should this be treated as a successful verification?

- **A.** No — the signature matched a key, but the signer's identity is still unestablished until that key was obtained and validated through an independent, trusted channel.
- **B.** Yes, because `Good signature` is the only output that matters and the certification warning is purely informational.
- **C.** No, because `gpg --verify` requires both a detached signature and a clearsigned document to be present simultaneously, when the detached form already takes exactly a signature file and a signed file together, which is the pair this command supplies correctly.
- **D.** Yes, but only if `sha256sum -c` was also run separately against the same SHA256SUMS file first.

### 35.

A migration project's status report lists: 'signed-off design', 'pilot batch accepted', 'base image', and 'bulk migration complete'. Which pair are deliverables rather than milestones?

- **A.** Signed-off design and bulk migration complete, because both appear as work packages in the work breakdown structure.
- **B.** Pilot batch accepted and bulk migration complete, since both are confirmed during project closure.
- **C.** All four, since anything worth putting in a status report counts as a deliverable.
- **D.** Signed-off design and base image, both of them tangible artefacts the project produced and handed over.

### 36.

Two directory entries have the same size, the same modification time, and the same content. What single check confirms they are actually the same file rather than two coincidentally identical copies?

- **A.** Comparing their filenames, since identical filenames always indicate the same underlying file
- **B.** Comparing their inode numbers with `ls -i`, where the same number means the same underlying file
- **C.** Comparing their permission bits with `ls -l`, since identical permissions confirm identity
- **D.** Comparing their paths with `findmnt`, since files on the same filesystem must be identical if their paths resolve similarly

### 37.

What accumulates to create vendor lock-in?

- **A.** Lock-in is a defect that well-run cloud architecture avoids entirely, so choosing a provider-specific managed service is always an architectural mistake, whatever work it saves the team.
- **B.** Dependence on provider-specific services and interfaces, the volume of data and its egress charges, and the team's operational knowledge and tooling built around one platform.
- **C.** Only the technical portability of the application code, since data and team expertise are irrelevant to switching providers.
- **D.** The length of the provider's published SLA, since a longer SLA commits a customer for longer and the workload cannot be moved before that term expires.

### 38.

A team installs a monitoring agent with the distribution's package manager, and separately runs `npm install express` inside one Node.js application. Are both operations installing "packages" in the same sense the exam means?

- **A.** No — the monitoring agent is a system-wide OS package with dependency metadata read by the OS package manager; `npm install` resolves a library scoped to one application
- **B.** Yes, both are the same kind of package, just installed by different front-end commands — `npm` records what it installs in the same system package database
- **C.** No — the OS package came from a repository and the `npm` package did not come from anywhere at all
- **D.** Yes, and the difference only matters for which command performs the removal later — the files land in the same system directories either way

### 39.

A developer wants a compact, one-line-per-commit summary of recent history to scan quickly. Which command and option produces that?

- **A.** `git diff --stat`, since `--stat` produces a one-line-per-file summary
- **B.** `git status -s`, since the short form is described the same way as a condensed view and also prints one line per changed path in the repository.
- **C.** `git log --oneline`, shorthand for `--pretty=oneline --abbrev-commit`, printing one abbreviated hash and subject line per commit
- **D.** `git branch -a`, since listing every branch also lists their most recent commits

### 40.

A log file is rotated at midnight, and a `tail -f` window watching it goes permanently silent afterward even though new entries are clearly being written. Which option fixes this, and why did plain `-f` fail?

- **A.** `tail -n 20`, because increasing the starting line count restores visibility
- **B.** `tail -F`, because it follows the file by name and reopens after rotation
- **C.** `head -c`, because reading by byte count survives rotation where line following does not
- **D.** Nothing fixes this; `tail -f` is expected to stop working after any log rotation permanently

### 41.

A team provisions an isolated, software-defined network inside a public cloud, choosing its own private address range instead of sharing the provider's default network. They are unsure whether this is best described as a VPC, a VPN, or a private cloud deployment. Which is it, and why?

- **A.** A cloud subnet, since address ranges are subdivided at the subnet level rather than the network level, and on AWS a subnet is additionally confined to a single Availability Zone.
- **B.** A VPN, because it establishes an encrypted tunnel between two networks over an untrusted path.
- **C.** A virtual private cloud, meaning logically isolated multi-tenant infrastructure with a chosen address space, not a tunnel and not dedicated hardware.
- **D.** A private cloud, since the word 'private' in the name means dedicated, single-tenant hardware.

### 42.

A scanner reports a critical vulnerability in a package that is installed but never run, on a host unreachable from any network. Is this necessarily high risk?

- **A.** Yes, because a critical severity score is itself the organisation's risk regardless of deployment context, since the score already accounts for exploitability in the wild.
- **B.** Yes, because the presence of a vulnerability always implies an active threat targeting it.
- **C.** Not necessarily, because risk combines likelihood and impact, and the described conditions drive likelihood toward zero even though the vulnerability is real.
- **D.** This cannot be assessed at all without first running a penetration test against the host.

### 43.

A described process covers inventorying installed versions, checking CVE feeds for severity, and testing updates on a staging tier — but has no documented rollback path. What step is missing?

- **A.** Nothing is missing; inventory, severity assessment and staging testing are the complete practice
- **B.** Rollback — a way to undo a patch that turns out to cause a problem once it reaches production
- **C.** A maintenance window, since none was mentioned in the description
- **D.** An automated tool such as `unattended-upgrades`, without which the process is incomplete

### 44.

What did the GNU Project supply before the Linux kernel existed, and what was it still missing?

- **A.** A complete operating system including its own kernel, which Linux later replaced for better overall performance.
- **B.** A compiler, a shell, core utilities, and most of the GPL licensing framework — everything except a free kernel of its own, which Linux later filled.
- **C.** A package manager and release policy, which every GNU/Linux distribution still relies on today for updates.
- **D.** Nothing substantial — GNU contributed little more than a name before Linux ever arrived, with essentially no working software behind it at that point.

### 45.

A three-person startup ships its whole product as one deployable artefact, replicated across six instances behind a load balancer for capacity. A reviewer calls this 'not really a monolith anymore' because it runs on six instances. Is the reviewer correct?

- **A.** No. The defining property is the shared release, not instance count; six copies of one artefact is still one deployable unit.
- **B.** Yes — six independently running instances means six independently deployable units, each free to be released, scaled and rolled back without touching the other five.
- **C.** No, but only because the team is too small to be running microservices.
- **D.** Yes — a 'modular monolith' is a contradiction, so any monolith that scales horizontally has become something else.

### 46.

Where does repository configuration live on a Debian-family system compared with a Red Hat-family one?

- **A.** Both families read the same `/etc/apt/sources.list` file, since the format is a Linux-wide standard
- **B.** `/etc/apt/sources.list` and `/etc/apt/sources.list.d/` on Debian-family; `.repo` files under `/etc/yum.repos.d/` on Red Hat-family
- **C.** The repository list is embedded inside each installed `.deb` or `.rpm` package itself — carried in its control metadata and read back at upgrade time
- **D.** Repository configuration lives under `/var/lib`, the same place the package database itself lives

### 47.

A scaling group is configured with a minimum of 2, a desired capacity of 4, and a maximum of 10. What do the minimum and maximum represent?

- **A.** Targets the group aims to reach as quickly as possible, ahead of the desired capacity — a reading that quietly promotes the number the group is actively held at into a number it is racing toward as fast as possible.
- **B.** The number of healthy and unhealthy instances currently in the group.
- **C.** The recovery point and recovery time the group is designed to meet.
- **D.** Guardrails the group's size may never cross — it will not be allowed to fall below 2 or rise above 10, whatever a policy or metric requests.

### 48.

A developer has uncommitted edits and needs to switch branches to handle an urgent request, without committing half-finished work. They run `git stash`. Where does that work go, and does a colleague running `git log` on the shared remote see it?

- **A.** It becomes a regular commit on the current branch, so a colleague sees it the next time they pull.
- **B.** It is discarded permanently the moment `git stash` runs, freeing the working tree for the urgent branch switch with nothing left to restore afterward.
- **C.** It is set aside under `refs/stash`, belonging to no branch and never pushed to any remote, so a colleague running `git log` sees nothing of it.
- **D.** It is written into `.gitignore` as an untracked change so it is skipped on the next commit

### 49.

An administrator runs `chmod u+s deploy.sh` on a shell script, expecting it to run with the file owner's privileges the way a compiled SUID binary would. It does not. Why?

- **A.** The bit was not actually set, since `chmod u+s` silently fails on non-executable files
- **B.** Linux ignores the set-user-ID bit on interpreted scripts, so the bit is set but never takes effect
- **C.** The script needs the sticky bit as well before setuid takes effect
- **D.** The script must first be made SGID before SUID has any effect — a script's SGID bit is what tells the kernel the interpreter may be trusted with elevated rights

### 50.

A file owner grants a colleague read access to a shared document at their own discretion. On a second system enforcing a mandatory policy, the same owner's attempt to grant that access is refused because the policy does not permit it. Which model governs each system?

- **A.** The first is discretionary access control, where the owner decides. The second is mandatory access control, a system-enforced policy that constrains even the owner.
- **B.** Both are role-based access control, since access is being granted through a role the owner and the policy both recognise, even though neither system names a role explicitly.
- **C.** The second system is really data classification rather than access control — the document's label is what refused the grant, not any policy evaluating the request.
- **D.** The second system is attribute-based access control, evaluating request attributes rather than enforcing a uniform mandatory policy.

### 51.

Running `which cd` reports nothing found, yet typing `cd /tmp` at the same prompt works without error. What explains the mismatch?

- **A.** The terminal is caching the previous command's output and never actually ran `which cd` at all, which is why nothing new appeared on screen.
- **B.** PATH is misconfigured and missing the directory that would normally contain the `cd` executable, since every runnable command needs a directory entry somewhere on that list.
- **C.** `which` is broken on this system, since it should be able to find every command that actually runs successfully, builtin or not.
- **D.** `cd` is a shell builtin with no standalone binary on PATH, so the external `which`, searching only PATH, finds nothing, even though the shell itself executes it directly.

### 52.

`ps` shows a process as `defunct`. What state is it in, and does sending it `kill -9` clear it?

- **A.** It is a zombie — already exited, waiting for its parent to reap its status — and `kill -9` does nothing to it
- **B.** It is an orphan whose parent has died, and `kill -9` forces it to exit properly — an orphan keeps its terminal attachment until something signals it
- **C.** It is a daemon that has lost its controlling terminal, and `kill -9` restarts it cleanly
- **D.** It is a process stuck in uninterruptible sleep, and `kill -9` will eventually succeed once I/O completes

### 53.

An application keeps session data in the memory of whichever instance first served a user, and a load balancer is configured with sticky sessions to route each user back to that same instance every time. What does the sticky-session configuration reveal about the application?

- **A.** That the application is highly available, since every user's requests are reliably routed to a working instance.
- **B.** That the load balancer is performing failover, since routing based on a health signal is what failover means.
- **C.** That the application is not stateless; sticky sessions exist specifically to route a client back to the one instance holding its state.
- **D.** That the instance pool needs vertical scaling before it can serve more users.

### 54.

A multi-step transfer debits one account and credits another. The process crashes immediately after the database reports the transaction complete. What is guaranteed?

- **A.** Only the debit is guaranteed to survive, since it was applied first.
- **B.** The transaction was already logged to permanent storage before completion was reported, so both the debit and the credit survive the crash.
- **C.** Nothing is guaranteed once the process crashes, regardless of what the database reported.
- **D.** Consistency is guaranteed, meaning the transaction ran faster than an equivalent pair of separate updates.

### 55.

`systemctl start nginx.service` returns immediately with no error, but the site is unreachable a moment later. What's the right next command, and why?

- **A.** `tail -f` on /var/log/syslog, since systemd services always write there.
- **B.** `ss -tulpn`, to see whether anything is listening on the expected port.
- **C.** `systemctl status` on the unit, because a forking or notify-type daemon can exit moments after a successful-looking start.
- **D.** Nothing — `systemctl start` returning without error means the service is running and stays running until something explicitly stops it.

### 56.

A configuration file was edited incorrectly three days ago and nobody noticed until today. The team wants to recover exactly what that one file looked like on the day before the mistake. What kind of system provides that?

- **A.** Version control, which retains prior revisions of files under active change, each attributable to an author and a timestamp.
- **B.** An independent backup taken on a schedule, since it is measured in RPO and RTO rather than per-file revisions and restores the whole system to one point in time, not a single document.
- **C.** A RAID array on the server, since it protects the data the file is stored on.
- **D.** A change-management ticket describing who approved the edit.

### 57.

What does a cryptoperiod bound, and why does SP 800-57 recommend bounding it deliberately?

- **A.** The span of time a key is authorised for use; a shorter cryptoperiod limits how much material is available for cryptanalysis and how much is exposed if that one key is compromised.
- **B.** The number of times a key may be used, regardless of how much time has elapsed since it was generated, since usage count rather than elapsed time is what SP 800-57 actually bounds.
- **C.** The interval at which a secret store rotates every credential it holds, cryptographic or not, since a cryptoperiod is simply another name for a rotation schedule.
- **D.** The time before a key must be sanitised using the Clear, Purge or Destroy categories, since those disposal categories are what a cryptoperiod is measuring.

### 58.

Between X11 and Wayland, which is the newer display server protocol intended to replace the older one?

- **A.** Wayland, the newer replacement for the older X11 protocol.
- **B.** X11, since it was adopted more recently by most major distributions as their default.
- **C.** Neither is newer; both were released in the same year as competing standards.
- **D.** The two names refer to the same underlying protocol under different branding.

### 59.

A team measures the fraction of successful requests as its SLI, and holds an internal target of 99.95% against that measurement — tighter than the 99.9% figure with service credits it publishes to customers. Which term names the internal target, and how does it differ from the customer-facing figure?

- **A.** The SLA, since it is the number the organisation is actually held to internally on a day-to-day basis.
- **B.** The SLO, an internal target set on the SLI, distinct from the SLA because missing it carries no contractual consequence on its own.
- **C.** The SLI, because 99.95% is itself a direct measurement of request success rather than a target.
- **D.** There is no internal target distinct from the customer figure, since a provider only ever tracks the number it publishes.

### 60.

You don't recall the name of the command that reports load averages, only that its description mentions "load." Which pair of commands searches manual page descriptions for a keyword, rather than opening a page whose name you already know?

- **A.** `man`, since giving it a keyword instead of a page name still searches the page bodies.
- **B.** `info`, since its Texinfo indices are more complete than the corresponding man pages.
- **C.** Run the suspected command with a guessed name and read `echo $?` after each attempt until one succeeds.
- **D.** `apropos` and `man -k`, both keyword searches over the one-line descriptions of every manual page.

