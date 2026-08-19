<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 05

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-05-answers.md](exam-05-answers.md)

---

### 1.

A team keeps every configuration change in Git and requires a reviewed pull request before merging. An auditor asks whether that is change management. What is missing?

- **A.** Nothing — a reviewed pull request already satisfies change management, since every file change already passes through review.
- **B.** Approval and scheduling for changes made by hand on a host, and an archived record for anything that never touches the repository.
- **C.** The commit history itself, since it records what a file said and who wrote it, which is what version control already provides on its own.
- **D.** A defined maintenance window during which merges are permitted, which states only when work may happen rather than whether it was approved.

### 2.

What does cloud IAM govern, and how should the account's root or global-administrator identity be treated day to day?

- **A.** It governs the guest operating system's user database rather than any cloud-side resource, and the root identity is treated as an ordinary account fit for daily administrative logins across the whole team.
- **B.** It governs only billing and cost visibility rather than resource access, so the root identity is considered safe to share broadly among the finance team for reporting purposes.
- **C.** It governs network routing decisions inside a virtual private cloud; the root identity is reserved for network engineers.
- **D.** It governs authentication and authorization for control-plane API calls against resources; the root or global-administrator identity is protected and used for essentially nothing routine.

### 3.

A script runs a command, then a moment later checks `$?`, but has printed a status message with `echo` in between. What value does `$?` actually report at that point?

- **A.** The exit status of the `echo` command itself, not the original command
- **B.** The original command's status, since `echo` does not affect shell parameters
- **C.** The logical OR of both commands' statuses
- **D.** Whatever `PIPESTATUS` recorded for the last pipeline that ran

### 4.

A prospective customer asks whether a vendor's controls were merely designed correctly, or actually operated correctly, over the last six months. Which report answers that question, and why?

- **A.** A Type 2 report, because it tests operating effectiveness across a period, while a Type 1 report addresses design as of a single date.
- **B.** A Type 1 report, since confirming the design of a control already implies it was exercised correctly afterward.
- **C.** Either report equally, since both examine exactly the same underlying evidence and only differ in how the findings happen to be formatted.
- **D.** An ISO 27001 certificate, since certification always speaks to a rolling period of operation rather than a single date.

### 5.

Which statement correctly places the CNCF relative to the Linux Foundation and to Kubernetes?

- **A.** The CNCF is the parent organisation of the Linux Foundation, and Kubernetes is therefore governed directly by the CNCF's own board rather than by any elected committee belonging to the project.
- **B.** The CNCF hosts only the Linux kernel, while Kubernetes is hosted by a separate and unrelated foundation with no Linux Foundation ties.
- **C.** The CNCF is a for-profit vendor consortium that owns the trademarks of every open source project it hosts, Kubernetes included.
- **D.** The CNCF is part of the nonprofit Linux Foundation and hosts Kubernetes as one of its graduated projects, providing infrastructure, events, and marketing rather than technical direction.

### 6.

A backlog item reads: 'As a claims assessor, I want to flag a suspicious claim, so that it gets reviewed before payment.' A stakeholder calls this a use case. What would need to be added for that to be accurate?

- **A.** Nothing — this is already a complete use case, merely written in a shorter, more casual form for the backlog.
- **B.** A swimlane diagram showing which department reviews the flagged claim before payment is issued, since that is the artifact that would make the missing detail visible.
- **C.** The actor, preconditions, a numbered main success scenario, and the alternate and exception flows — a use case is written to be complete in itself.
- **D.** A MoSCoW priority tag showing how urgent the flag is relative to other backlog items.

### 7.

A naming scheme fixes role, environment, region and an index in the same order for every host. Per consensus practice, what is that scheme's primary purpose?

- **A.** To let a reader infer a host's identity and purpose from its name alone, without consulting anything else.
- **B.** To serve as the authoritative record of what a host is and who owns it, replacing the need to consult the inventory separately.
- **C.** To ensure no two hosts in the estate can ever hold the same name, which the register that assigns names enforces rather than the pattern those names follow.
- **D.** To guarantee that every host of a given role is configured identically, so a fix written for one of them applies unchanged to the rest.

### 8.

Which practice in this competency eliminates configuration drift entirely, rather than merely reducing it?

- **A.** Automation over manual configuration — once a declarative definition is applied, the running environment always matches it exactly from then on.
- **B.** Well-architected review — its operational excellence pillar audits every resource for drift on a fixed schedule.
- **C.** Immutable infrastructure: nothing survives long enough on a running instance to drift, because replacement removes the possibility outright.
- **D.** Health checks and graceful shutdown — an unhealthy, drifted target is automatically deregistered before it can serve traffic.

### 9.

Which of these belongs in a disaster recovery plan rather than in a runbook for routine operations?

- **A.** The procedure for rotating an expiring TLS certificate.
- **B.** The organisation's strategy for continuing to trade during a disruption.
- **C.** The order of system restoration and who is authorised to declare a disaster.
- **D.** The load balancer's health-check interval for a failing node.

### 10.

An operator `cd`s into a directory through a symlink and then runs `cd ..`. The result is not the directory that physically contains the symlink's target. What explains this?

- **A.** The symlink itself was deleted between the two commands, which makes the shell fall back to the physical parent
- **B.** Bash's `cd ..` is logical by default, stripping the last component of `$PWD` as text
- **C.** `..` at the root of a symlinked mount always resolves to `/` regardless of position
- **D.** Only `~` behaves this way; `..` always matches the kernel's physical parent

### 11.

Which of the following is part of a system's attack surface?

- **A.** A CVE severity score published for a package the host has never installed.
- **B.** The retention period configured for the organisation's nightly backups.
- **C.** The six-step order an incident responder follows once an intrusion is confirmed.
- **D.** An enabled account that can still log in even though the person who used it left the team last year.

### 12.

A host can reach every other machine on its own subnet by IP address but a name lookup for one particular server fails. Separately, a different host cannot reach one particular local IP address at all. Which protocol is implicated in each case?

- **A.** The name-lookup failure implicates DNS, which resolves names to addresses across the whole internet; the local-address failure implicates ARP, which resolves an address to a MAC only within one segment.
- **B.** Both cases implicate DNS, since any resolution failure of any kind whatsoever is ultimately treated as a DNS problem regardless of its actual scope.
- **C.** Both cases implicate ARP, since ARP is assumed to be responsible for resolving both names and local hardware addresses on a modern network.
- **D.** The name-lookup failure instead implicates ARP, since ARP requests are assumed to carry hostnames as well as IP addresses; the local-address failure implicates DNS, regardless of which distribution or vendor is involved.

### 13.

An operator says a container was "deleted" after running `docker stop web`. Is the container actually gone?

- **A.** Yes, because `docker stop` and `docker rm` both delete the container object and reclaim its disk space identically, treating a stopped container as already gone rather than merely paused.
- **B.** No, it is stopped, not removed; it still holds its writable layer, configuration, and logs, and continues to consume disk until it is explicitly removed.
- **C.** No, but the confusion is harmless since a stopped container can never be started again under any circumstance.
- **D.** Yes, and the underlying image it was built from is removed along with it as part of the same operation.

### 14.

An account exceeds its free-tier allowance mid-month, and a payment method is already on file. What happens to the exceeded portion?

- **A.** A budget alert fires automatically, since crossing an allowance is the same thing as crossing a spend threshold.
- **B.** The resource becomes an orphan until someone reattaches a valid payment method.
- **C.** The resource is suspended automatically until the following month's allowance resets.
- **D.** It starts billing silently at the standard rate; nothing about exceeding the allowance stops the resource.

### 15.

An operator needs to confirm which process is listening on TCP port 8080 on a server, with numeric ports rather than looked-up service names. Which command and options answer that directly?

- **A.** `ss -tulpn`, filtered by eye to the 8080 line
- **B.** `curl -I` against the port, since header output reveals the owning process
- **C.** `traceroute` to the loopback address, since it maps every listening port along the way
- **D.** `hostname -I`, since it lists every port currently open on the machine

### 16.

A contributor to an Apache-2.0 project files a lawsuit alleging the project's work infringes a patent that contributor holds. What happens under section 3 to the patent licences that contributor holds in the work?

- **A.** Nothing happens to them, since MIT and the BSD licences carry no patent-termination mechanism at all for either side to ever invoke.
- **B.** They terminate for every contributor to the project at once, not just the one who filed suit, since the NOTICE file lists all contributors jointly by name.
- **C.** They terminate for that contributor, because Apache-2.0 ends the patent licences granted to anyone who files patent litigation alleging the work infringes.
- **D.** They terminate only if the project is also dual-licensed under a copyleft licence, since permissive terms alone cannot enforce patent termination.

### 17.

An administrator hand-edits `/etc/resolv.conf` to fix a wrong nameserver, and the fix works — until the next DHCP lease renewal silently reverts it. What went wrong, and where does the durable fix belong?

- **A.** The hand edit failed because `/etc/resolv.conf` is read-only by design and never actually accepted the change in the first place.
- **B.** The DHCP lease renewal reverted the change because `/etc/resolv.conf` entries are considered part of the IP address lease itself and expire along with the address when the lease is renewed.
- **C.** The durable fix belongs in `/etc/hosts` instead, since that is the file that persists correctly across DHCP renewals on a modern system.
- **D.** On a modern system the file is commonly generated by NetworkManager, a DHCP client, or systemd-resolved, so a hand edit is overwritten at the next renewal; the durable change belongs in that generating tool's configuration.

### 18.

A team needs a device that keeps a service available when any one of several backend servers fails, distributing load across all of them and removing failed ones from rotation automatically. Is a proxy, generically, defined to do this?

- **A.** Yes — every proxy, reverse or forward, is defined to distribute requests across multiple backends and health-check them as a core part of what a proxy fundamentally is.
- **B.** No, and neither is a load balancer, since removing a failed backend from rotation automatically requires a dedicated firewall device rather than either a proxy or a load balancer.
- **C.** Yes, but only for a forward proxy specifically; a reverse proxy by definition can never distribute traffic across more than one backend under any circumstances.
- **D.** No — a proxy's defining trait is mediating a request on someone's behalf, and a single backend is entirely normal for it; it is a load balancer specifically that selects among several backends by a scheduling algorithm and health-checks them continuously.

### 19.

An unencrypted nightly backup restores a deleted table correctly after a fault. Which CIA property did the restoration itself demonstrate, and which property does the backup's lack of encryption still leave exposed?

- **A.** The restore demonstrated confidentiality; encryption of the backup file is irrelevant once the restore succeeds.
- **B.** The restore demonstrated integrity and availability; the unencrypted backup leaves confidentiality exposed.
- **C.** The restore demonstrated availability only; a backup is never an integrity control regardless of encryption.
- **D.** The restore demonstrated authentication and authorization, since only a permitted operator could run it.

### 20.

A virtual machine idles at 2% CPU for an entire month under pay-as-you-go billing. How does its cost compare to the same machine running at 100% CPU the whole month?

- **A.** Lower, because rightsizing automatically detects the 2% load and bills only that share.
- **B.** Lower, because autoscaling would already have shrunk the instance in response to the low load.
- **C.** Identical, because the meter counts provisioned, running capacity, not utilisation.
- **D.** Lower, because 'pay only for what you use' means paying for work performed rather than capacity held.

### 21.

A web server process running as an unprivileged user can bind port 8080 but is refused when it tries port 80. What determines that boundary, and what would let the same process bind 80 without running as root?

- **A.** The boundary is 8080 itself; any port above it needs no privilege and any port below it always does
- **B.** Ports below 1024 need the `CAP_NET_BIND_SERVICE` capability, which can be granted to the binary without making it root
- **C.** Only the root user account can ever bind port 80, with no exceptions on Linux
- **D.** The distinction is enforced only by the firewall and not by the kernel, so flushing the firewall rules would let any user bind port 80

### 22.

A production fleet needs to survive a node failure, scale up under load, and roll out new versions without downtime. A single-host Compose setup already runs the containers involved. What is missing, and why does adding more containers to the same host not fix it?

- **A.** More containers on the same host, since orchestration is fundamentally about running a far larger number of containers than a Compose project on one machine was ever designed to handle.
- **B.** A bigger base image with more resources allocated per container, so each one can absorb more load individually.
- **C.** Orchestration across a pool of hosts with continuous reconciliation: the requirement is about surviving a host failure and rescheduling, which a bigger single host cannot provide.
- **D.** A faster registry, so that images pull more quickly whenever the single host needs to restart a container.

### 23.

A company wants to filter and log employee web access before it leaves the building, and separately wants to hide an internal application server behind a public hostname. Which kind of proxy fits each need?

- **A.** A reverse proxy fits filtering employee access, since it is the type configured directly by the clients whose traffic needs to be filtered.
- **B.** Both needs are met by the same forward proxy, since a forward proxy is capable of hiding an internal server from the public internet as well as filtering client traffic, because a proxy's position in the path rather than which party configures it is what decides its role.
- **C.** Neither need is met by a proxy at all; both require a VPN, since only a VPN is capable of filtering traffic or hiding an internal server from view.
- **D.** A forward proxy fits filtering employee access, since it sits in front of clients and is configured by them; a reverse proxy fits hiding the internal server, since it sits in front of servers, invisible to clients.

### 24.

A systems engineer must classify Linux KVM as type 1 or type 2. It runs as a module inside the Linux kernel, and a full Linux userland runs alongside it on the same machine. Which classification is correct, and why does the userland not change the answer?

- **A.** Type 2 — since a full conventional operating system userland is present, KVM must be running as an application on top of it, in the same way VirtualBox runs as an ordinary desktop program.
- **B.** Neither — KVM is a virtualization technique rather than a hypervisor product, so the type 1 / type 2 split does not apply to it at all.
- **C.** Type 1, but only because KVM happens to run on cloud provider hardware rather than a desktop, where the same kernel module would instead be classified as type 2.
- **D.** Type 1: the kernel module makes the Linux kernel itself the hypervisor, and it is classified as type 1 despite the full userland running alongside it.

### 25.

A developer downloads a dual-licensed library under its open source terms and wants to relicense their own unmodified copy for resale under separate commercial terms. May they?

- **A.** Yes, as long as they first sign a contributor licence agreement with the original project granting them the necessary rights.
- **B.** Yes, provided the new commercial terms remain compatible with the original open source licence the library was received under.
- **C.** No; only the copyright holder can offer a work under both an open source and a commercial licence, and a recipient who merely received the code under one of those licences cannot grant it under the other.
- **D.** Yes — dual licensing means the software has effectively entered the public domain for anyone who receives a copy under either of the two licences the rights holder chose to offer.

### 26.

A service must move to a new address next week with minimal disruption. What should be changed first, and when, relative to the actual move?

- **A.** The record's TTL should be lowered well before the change, so resolvers hold the old answer for a shorter time once the change actually lands.
- **B.** The record's TTL should be raised right before the change, since a higher TTL is what makes a new answer propagate to every resolver faster.
- **C.** Nothing about DNS needs to change beforehand; flushing every resolver's cache at the moment of the move achieves the same effect as lowering the TTL in advance.
- **D.** The A record should be deleted entirely first, then recreated with the new address once the actual move has completed.

### 27.

A stateful firewall permits an outbound connection from an internal host to a remote service. Does it need a separate inbound rule to allow that service's response traffic back in?

- **A.** Yes, since every direction of traffic always needs its own explicit rule regardless of the firewall's design.
- **B.** No, but only because the internal host is also segmented into its own network zone.
- **C.** No, since a stateful firewall tracks connection state and allows return traffic for a permitted outbound flow without a separate inbound rule.
- **D.** Yes, unless the connection uses TLS, in which case the encrypted channel bypasses the firewall's rules entirely, when stateful tracking already admits return traffic for a permitted flow regardless of whether that traffic happens to be encrypted under TLS.

### 28.

A mode string begins with the letter `l` rather than `-` or `d`. What kind of filesystem entry does that indicate?

- **A.** A regular file with the immutable attribute set
- **B.** A symbolic link
- **C.** A directory that has reached its link-count limit
- **D.** A hard link, as opposed to an ordinary file

### 29.

A user wants to edit their personal crontab. Why is `crontab -e` preferred over opening the spool file under `/var/spool/cron/` directly in a text editor?

- **A.** `crontab -e` validates the syntax before installing the result and ensures the daemon notices the change
- **B.** There is no real difference; both approaches update the same file identically
- **C.** Editing the spool file is preferred, since `crontab -e` only works for system crontabs, not personal ones
- **D.** `crontab -e` is required because personal crontabs cannot contain more than one line

### 30.

A platform team pushes their application weekly but discovers the bill is unchanged whether traffic is high or completely absent overnight. Why does PaaS behave this way?

- **A.** Most PaaS platforms bill for provisioned instances that stay warm, so an idle application still costs money even with no traffic.
- **B.** PaaS scales to zero automatically whenever traffic stops — so a flat overnight bill can only be a billing error worth disputing.
- **C.** PaaS charges a fixed subscription regardless of infrastructure used, the same as SaaS.
- **D.** PaaS means the team no longer needs to think about scaling at all, so cost is naturally constant.

### 31.

Given the reference `registry.example.com/team/api:1.4.2`, which part names the registry, and how does that differ from the image itself?

- **A.** The whole string is the image, and there is no separate registry concept because a reference already fully identifies the artifact.
- **B.** `team/api` is the registry and `registry.example.com` is only the network address used to reach it, which are treated as the same field.
- **C.** `1.4.2` is the registry, since it is the part of the reference that changes most often as new versions are shipped.
- **D.** `registry.example.com` is the registry, the server that stores and distributes the artifact; the artifact it holds is the image referenced by the rest of the string.

### 32.

What is a dependency, in the context of installing an OS package?

- **A.** Any package that is merely recommended alongside the one being installed
- **B.** A package that another package requires in order to work, resolved automatically by a repository-aware manager
- **C.** A configuration file the package writes into `/etc` on installation
- **D.** The repository a package was downloaded from — which is what the package's `Depends` field records

### 33.

A script sets `DEPLOY_ENV=staging` and then calls `export DEPLOY_ENV` afterward before running a helper program. Could the assignment and the export have been combined into fewer lines, and does order matter here?

- **A.** No — `export` and assignment must always be written on two separate lines, since `export NAME=value` is rejected as a syntax error
- **B.** Yes, but only if a space is placed around the `=` sign, matching ordinary assignment style
- **C.** No, because exporting a variable after assignment silently discards its value
- **D.** Yes — `export DEPLOY_ENV=staging` does both at once, and either order works as long as export happens before the helper runs

### 34.

An administrator elevates through `sudo` for individual commands rather than logging in directly as root for the whole session. Which practice does this illustrate?

- **A.** Least privilege, since access above the ordinary account is granted only per command and only for as long as it is needed.
- **B.** Defense in depth, because `sudo` adds an independent layer on top of the login itself.
- **C.** Multi-factor authentication, since a second credential is effectively required for each elevated command.
- **D.** Accounting, because `sudo` records who ran which command.

### 35.

A company distributes a zero-cost "community edition" of its database engine. The source is not published, and the licence permits running the software but forbids modifying or redistributing it. What is this software?

- **A.** Proprietary software: price is irrelevant here, and the licence withholds the source and reserves modification and redistribution rights to the vendor.
- **B.** Open source software offered as freeware, since no fee is charged for downloading a copy and the vendor markets it as free to use for everyone.
- **C.** Neither open source nor proprietary, since freeware is understood to be its own separate licensing category carrying no legal reservation of rights of any kind at all.
- **D.** Source-available software, since the vendor retains the option to publish the source later without changing any of the licence terms.

### 36.

A Debian-family server and a Red Hat-family server both protect `/etc/shadow` from ordinary users, but by different means. What are the two modes?

- **A.** `0644 root:root` on every distribution, since the file only needs to block writes
- **B.** `0600 root:root` universally, matching the private key convention
- **C.** `0640 root:shadow` on Debian-family systems, and `0000 root:root` on Red Hat-family systems
- **D.** `0640 shadow:root` on both families, with the group and owner reversed from the Debian scheme

### 37.

What is the precise relationship between virtualization and the hypervisor?

- **A.** They are two names for the same thing — naming a product such as ESXi or KVM and naming virtualization amount to the same claim about one layer of the stack.
- **B.** Virtualization is the technique of partitioning one machine into many; the hypervisor is the software layer that actually performs that partitioning.
- **C.** The hypervisor is a type of container runtime specialised for running full operating systems, which is why ESXi and Docker are classified as the same category of software.
- **D.** Virtualization is a cloud-only capability, whereas a hypervisor can also run outside the cloud on a single desktop or server.

### 38.

An account must own a set of files and be usable as the identity a backup script runs under, but must never be usable to log in interactively. Which change accomplishes that?

- **A.** Lock the account's password with `passwd -l`
- **B.** Delete the account's entry from `/etc/shadow`
- **C.** Set its login shell to `/usr/sbin/nologin`
- **D.** Set the account's UID to a value above 60000

### 39.

An automation task declares that a package must be installed at a given version, checking the current state before acting, and it is run three times in a row against a host that already satisfies that state. Describe what happens on the second and third runs.

- **A.** Both find the declared state already satisfied and change nothing further, which is exactly what makes the task safely re-runnable.
- **B.** Both reinstall the package all over again, since idempotent means the exact same action happens on every run regardless of current state.
- **C.** Both report configuration drift, since re-running a task that has already converged always surfaces something new to review.
- **D.** Both trigger the pipeline's automated test suite to run again, since idempotency is a property of the pipeline rather than of the task itself.

### 40.

A deployment pipeline needs the machine's instruction set architecture to pick the right container image tag. Which command reports it, using the option that reports machine hardware name specifically?

- **A.** `uname -m`, whose `-m` option reports the machine hardware name — `x86_64` or `aarch64` — the CPU instruction set the kernel was built for.
- **B.** `uname -r`, whose kernel release string identifies the platform the container image must match.
- **C.** `lscpu`, whose `Architecture:` line is the only place the system exposes the instruction set.
- **D.** `arch` and `uname -m` can disagree on the same machine, so both should be checked and reconciled manually.

### 41.

Why is running short of address space in a virtual network a recoverable problem, while discovering an overlap with another network is not, in the same easy way?

- **A.** Both are equally recoverable, since every major provider allows re-addressing a live network without disruption, treating growing into unused space and untangling an overlap as the same operation regardless of how much infrastructure was already built on the original range.
- **B.** Neither is recoverable, since a subnet's CIDR block can never be resized once created.
- **C.** Address space can be added or expanded after creation on all three major providers, but by the time an overlap is discovered, subnets, peering connections, and on-premises routes have typically already been built around the original range.
- **D.** Neither is recoverable, since any address change breaks every existing peering connection permanently.

### 42.

A security architect wants to reduce how many separate passwords staff must choose and remember. Does deploying SSO by itself also make each individual login stronger?

- **A.** Yes, since consolidating logins into one identity provider automatically enforces a stronger authenticator everywhere.
- **B.** No. SSO reduces credential sprawl and centralises the control point, but it changes how many times a user authenticates, not how strongly.
- **C.** Yes, because SSO always requires public-key authentication instead of a password.
- **D.** No, and SSO actually weakens security in every deployment by design.

### 43.

An administrator writes a new value to `/proc/sys/vm/swappiness` to change kernel tuning immediately. Does that change survive the next reboot?

- **A.** Yes, any write under `/proc/sys` is automatically persisted to disk — the kernel mirrors each accepted write into `/etc/sysctl.conf` as it happens
- **B.** No — the change applies to the running kernel immediately but is lost at the next boot unless also recorded under `/etc/sysctl.d/`
- **C.** No, and it also requires a reboot before it takes effect on the running system at all
- **D.** Yes, because `/proc/sys` entries are actually device nodes stored under `/dev`

### 44.

Which single component is directly responsible for scheduling processes onto the CPU, managing memory, and enforcing the permission boundary between them?

- **A.** The kernel, being the privileged core that performs scheduling, memory management, and permission enforcement itself, with everything else built above it.
- **B.** The operating system in general, since 'kernel' is simply informal shorthand people use for the same broader system, the way 'Windows' and 'PC' get used interchangeably.
- **C.** The distribution's init system, since it is the first process started and therefore owns the machine's resources from that point on, ahead of anything the kernel itself does.
- **D.** Whichever shell the administrator is currently using, since shell commands are what visibly control processes on the machine and appear to issue every instruction directly.

### 45.

A team describes its Sprint Backlog as 'the items we pulled into this Sprint.' What does that description leave out?

- **A.** Nothing — the Sprint Backlog is defined as exactly the set of Product Backlog items selected for the Sprint.
- **B.** The team's velocity figure, which should be recalculated and attached to every Sprint Backlog so that stakeholders can see how much capacity remains for the rest of the Sprint.
- **C.** The Definition of Done, which the description should have named explicitly.
- **D.** The Sprint Goal, why the work matters, and the actionable plan for delivering the Increment, how it will get done — the selected items are only one of its three parts.

### 46.

A process launched by hand at the shell keeps dying, and nothing restarts it. The same program launched via a systemd unit restarts automatically after a crash. What accounts for the difference?

- **A.** Nothing — a process and a service are the same object under two different names
- **B.** The systemd version must be running as a daemon while the hand-launched one is not
- **C.** The unit wraps the process in a supervision policy — a service, as opposed to a bare process nobody is watching
- **D.** The hand-launched process was niced too low to be restarted automatically — the scheduler declines to re-admit a process whose nice value sits below its control group's floor

### 47.

An SRE team is choosing between two internal SLO targets, both measured over a 30-day month: 99.95% and 99.9%. Relaxing the target from 99.95% to 99.9% permits how much additional downtime across the month?

- **A.** About 21.6 more minutes; the allowance grows from roughly 21.6 minutes to roughly 43.2 minutes.
- **B.** About 4.3 more minutes, since relaxing by one nine only ever changes the figure by the smallest listed increment.
- **C.** About 7.2 hours more, matching the jump from three nines down to two nines rather than the half-step asked about.
- **D.** No measurable difference, because both targets round to the same permitted downtime once expressed per month.

### 48.

A described pipeline builds a container image, runs unit and integration tests against it, and then pushes it to a registry, but it only ever runs when someone manually triggers it against a release branch about once a month. Is this pipeline practising continuous integration?

- **A.** Yes, since every stage associated with continuous integration, build, test, and package, is visibly present in this pipeline's own definition file kept in the repository beside the source.
- **B.** Yes, because pushing the finished image to a registry is what makes the resulting change releasable.
- **C.** No, but only because the pipeline definition was not written in a named tool such as GitHub Actions or Jenkins.
- **D.** No, because the automation exists but continuous integration is defined by merging frequently to a shared branch, which a once-a-month trigger plainly does not provide.

### 49.

A requirement states a service must both be running right now and still be running after every future reboot. Which single command satisfies both halves in one step?

- **A.** `systemctl start nginx` alone, since a successful start implies it will also come back after a reboot
- **B.** `systemctl enable --now nginx`, enabling the boot-time symlink and starting it immediately in one step
- **C.** `systemctl enable nginx` alone, since enabling a unit also starts it immediately — the manager reload that `enable` performs activates it
- **D.** `systemctl daemon-reload nginx`, since reloading applies both the running and boot-time state

### 50.

A retention schedule marks a customer's records for deletion this month, but a legal hold was placed on that customer's data last week for pending litigation. What happens to the scheduled deletion?

- **A.** It is suspended: records under a legal hold must not be destroyed even though the schedule says their time is up, until the hold is lifted.
- **B.** It proceeds as scheduled, since a legal hold only prevents new data from being created, not existing data from being deleted.
- **C.** It proceeds for the production copy, but the backup copy is retroactively covered by the hold instead, since a hold attaches to whichever copy is created most recently.
- **D.** It is blocked by the data loss prevention system rather than by the retention process, since DLP is what enforces legal holds.

### 51.

Who sets the Linux kernel's technical direction, and what role does the Linux Foundation actually play in that?

- **A.** The Linux Foundation sets technical direction, since its name appears on the certification program and it directly employs a large number of the kernel's most active and visible contributors working on it today.
- **B.** Torvalds alone personally decides every single patch that merges, without any maintainer hierarchy standing beneath him at any level of the project.
- **C.** Torvalds and the kernel's maintainer hierarchy set technical direction; the Linux Foundation supplies the technical, financial and staffing support behind the project's infrastructure, an organisational role rather than a technical one.
- **D.** A vote among major distribution vendors decides technical direction, coordinated entirely through the Foundation's regular meetings.

### 52.

An administrator enables `backup.service` directly, expecting it to run on a schedule the way a cron job would. What actually happens?

- **A.** The service runs on the schedule defined by `OnCalendar=` in the paired `.timer` unit, since they are linked automatically
- **B.** Nothing happens, since `.service` units cannot be enabled without a crontab entry pointing at them
- **C.** The service is rejected by `systemctl` because it has no `OnCalendar=` directive of its own
- **D.** The service starts at every boot, which is not a schedule at all; the `.timer` unit is what needed to be enabled instead

### 53.

A queue processor starts batching many small write operations into one larger write to raise throughput. What is the predictable cost?

- **A.** Lower throughput, since batching adds processing overhead that outweighs any gain.
- **B.** Higher latency for every item now waiting for its batch to fill before being written.
- **C.** No cost, since latency and throughput are two names for the same underlying measurement.
- **D.** Reduced availability, since batched writes are more likely to fail outright.

### 54.

A site's home page loads instantly and every static image renders, but every form submission returns 502 Bad Gateway. Which component is the first suspect, and on what basis?

- **A.** The web server — since it is the process that returned the 502 status code to the browser, the fault must lie in whatever generated that particular response.
- **B.** The application server — a 502 is what a gateway or proxy returns when the backend it forwards to answers invalidly, and static content loading proves the web server itself is reachable.
- **C.** The application tier is fine, but the load balancer sitting in front needs to be treated as a fourth tier before this diagnosis can go any further.
- **D.** The database, since form submissions are the only kind of request in this scenario that would ever need to reach it at all, and every other component in the path already proved itself by serving the static assets correctly.

### 55.

With `umask 022` in effect, what mode does a newly created regular file receive, given that programs typically request `0666` for a new file?

- **A.** `022`, because the umask is applied directly as the resulting mode
- **B.** `755`, the same result `chmod 755` would produce on the file — a umask is applied as the complement of the mode a program requests, so `022` yields `755`
- **C.** `666`, since a umask only affects directories, not regular files
- **D.** `644`, because the umask subtracts write for group and other from the requested `666`

### 56.

Using the block that separates recording from publishing, place `git commit` and `git push` on the correct sides of that line.

- **A.** Both commands require a network, since Git needs to contact the remote to compute a commit's hash.
- **B.** `git commit` uploads to the remote, and `git push` only updates the local branch pointer.
- **C.** `git commit` records the staged content in the local repository, needing no network and visible only to the author; `git push` uploads those commits to a remote branch, needing a network and becoming visible to anyone with access.
- **D.** Neither can be refused by the other side; both always succeed once the local repository accepts them, regardless of what state the remote branch, its full commit history, or its configured upstream tracking reference happen to be in at that particular moment.

### 57.

A team moves a database password out of source code and into an environment variable that the application reads at startup. Have they achieved secrets management?

- **A.** Yes, fully — environment variables are process-local and therefore as secure as a purpose-built secret store, since nothing outside the process can ever read them.
- **B.** Yes, fully — the variable is encrypted at rest by the operating system, which is all a secret store provides beyond simply holding a value for a process to read.
- **C.** Partially — the value is no longer in source, but an environment variable is not access-controlled or audited and cannot be rotated without restarting the process, so it is a delivery mechanism rather than a store.
- **D.** No progress at all — an environment variable is exactly as exposed as leaving the password in the source file, since both are readable by anyone with host access.

### 58.

A user reports 'my terminal is frozen.' A foreground command is actually hung waiting on network I/O, and the terminal emulator itself is rendering fine. Was the report accurate?

- **A.** Yes — 'terminal' and 'shell' name the same thing, so a hung shell command is by definition the terminal itself freezing, with no meaningful difference between the two at all.
- **B.** No; the terminal is displaying correctly. It is the shell's foreground command that is hung, which needs a signal (Ctrl-C) rather than restarting the terminal emulator.
- **C.** No — the report describes a kernel scheduling failure, since only the kernel can cause a process to stop responding at all, regardless of what it is waiting on.
- **D.** Yes — any unresponsive prompt is, by definition, a frozen terminal no matter what is actually blocking it, since the symptom looks identical either way.

### 59.

An auto-scaling policy terminates an instance mid-shift to bring the group back down to its desired capacity. Which property of the application determines whether any user notices?

- **A.** Whether the group's configured maximum capacity is set high enough to absorb the loss.
- **B.** Whether the application is stateless — an interchangeable instance can be terminated and replaced without anyone's session or in-flight work being tied to it specifically.
- **C.** Whether the instance being terminated was the primary in an active-passive pair.
- **D.** Whether the termination also triggers a scale-out event on a standby instance pool in another region — describing a cross-region event that nothing in the scenario supports, when the change described is a routine single-pool scale-in.

### 60.

A client gets "connection refused" reaching an internal API on its normal port. `systemctl status` on the server confirms the service is active. What do you check next, and what does its Local Address column rule out or confirm?

- **A.** `dig` against the service name, since a stale DNS answer somewhere in the resolution chain would explain a refusal like this.
- **B.** Nothing further — "connection refused" from a client always means the service itself is down on the server side.
- **C.** `ls -ld` on the socket file itself, checking for a permissions problem that might be blocking the connection.
- **D.** `ss -tulpn`. If it shows the socket bound to `127.0.0.1` rather than `0.0.0.0`, that explains a refusal from every remote client without any firewall rule being involved.

