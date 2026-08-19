<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 06

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-06-answers.md](exam-06-answers.md)

---

### 1.

An administrator proposes a configuration change and personally approves it before applying it to a system they run. Which control did the process fail to enforce?

- **A.** Scheduling the change into an agreed maintenance window.
- **B.** Recording the change in a version-controlled repository.
- **C.** Nothing — an administrator with authority over the system may approve their own change.
- **D.** Independent approval, meaning the approver must be someone other than the requestor.

### 2.

A team running immutable infrastructure needs to undo a bad release. What does the rollback actually consist of?

- **A.** Reversing the specific package or configuration change on each running instance, the same way a rollback works on a mutable, long-lived server.
- **B.** Redeploying the previous versioned image or artifact and shifting traffic back to instances built from it, not reversing a patch on the currently running instances.
- **C.** Restoring the workload's externalised state from its most recent backup.
- **D.** Reapplying the previous version of the infrastructure-as-code definition and waiting for reconciliation, since that is how automation over manual configuration is described as reverting any change.

### 3.

A backup script works perfectly when run by hand at the prompt, but fails to find its input file when the same script runs from a cron job. What is the most likely explanation?

- **A.** Cron strips environment variables the script needs to build the path, since cron jobs run with a stripped-down `PATH` and no interactive shell profile sourced
- **B.** The input file was renamed with a different case between the two runs
- **C.** The script uses a relative path, and cron starts it from a different working directory
- **D.** Cron always runs scripts with `$PWD` unset, so any path lookup fails outright

### 4.

A company's own internal security team reviews its access controls and issues a clean internal report. What can the company now claim to an outside party asking for independent assurance?

- **A.** That it is now audited in exactly the sense a customer's due-diligence questionnaire is asking about.
- **B.** That every control it operates now has documented evidence, since conducting the review process itself creates that evidence.
- **C.** That the company holds a certification, since a clean internal report and an accredited certification carry the same standing.
- **D.** That an internal review found no exceptions, not that an independent assessor has examined anything.

### 5.

A candidate reads a question naming both an organisation and a project it hosts, and correctly suspects it is testing whether they collapse hosting and governing into one role. What is the safest general answer to that kind of question?

- **A.** Assume the named organisation both hosts and governs, since a foundation prominent enough to host a project of that size usually also directs its technical roadmap.
- **B.** State the hosting relationship and the separate governing body explicitly, rather than assuming the host also directs the project technically.
- **C.** Assume the project governs itself entirely with no relationship to any hosting organisation at all.
- **D.** Treat the question as unanswerable without knowing the specific committee names involved.

### 6.

A gap analysis lists six differences between a department's current and desired capability. What can the analysis, by itself, not tell the team?

- **A.** How large the differences are between the current and desired states.
- **B.** What work would be needed to close each of the six differences, since the comparison stops at naming them and leaves the closing actions to a later technique.
- **C.** Whether closing the gaps is achievable and worth committing to, a judgement that belongs to a feasibility study.
- **D.** Nothing — a gap analysis inherently ranks each gap by cost and risk as part of the comparison.

### 7.

Two servers of the same role differ because two different engineers each made their own configuration choices, and neither choice was ever reviewed. What discipline's absence explains this?

- **A.** Standardization — the servers should be rebuilt from a single golden image, which gives uniformity but not a reviewed security floor.
- **B.** Security baselines — a reviewed, approved minimum configuration removes security from the discretion of whoever happened to build the machine.
- **C.** Configuration management — a tool should have converged both servers automatically, once someone declared a state for it to enforce.
- **D.** Nothing is missing — a system running more security controls than another is still compliant.

### 8.

A service role attached to a web application was given administrator permissions during a debugging session two months ago and was never narrowed afterward. What is the standard path this arrangement creates?

- **A.** No real risk, since only a human with console access could exploit an unused administrator permission.
- **B.** From one compromised web application to control of the whole account, since the role's excess permissions travel with whatever compromises the application.
- **C.** A control-plane audit failure above all, since IAM alone is understood to be responsible for automatically detecting, flagging and narrowing any unused permissions on its own.
- **D.** A leaked long-lived access key, since debugging sessions are the most common source of hardcoded credentials.

### 9.

An auditor asks for evidence that a disaster recovery plan is more than a document. What satisfies the request?

- **A.** Signed acknowledgements from every named role confirming they have read the current version.
- **B.** Records of exercises in which the plan was followed and its gaps recorded.
- **C.** Backup job logs showing two years of successful runs.
- **D.** A diagram of the standby site's network topology.

### 10.

A script treats `grep pattern file.txt` returning a non-zero status as proof that something went wrong. `grep` exits 1 here. Is that conclusion correct?

- **A.** No — `grep` returns 1 to mean "no lines matched," and reserves 2 for a real error
- **B.** Yes — any non-zero status from any command always indicates a real failure
- **C.** No — but only because the file was empty, which always forces status 1
- **D.** Yes — `grep` is the one exception where 1 and 2 both mean the same generic failure

### 11.

A team enables account lockout after five failed logins to defend against credential stuffing. Logs later show the attack made only one or two attempts per account across thousands of different accounts. Why did lockout fail, and what would actually stop this?

- **A.** Lockout worked correctly here, and the low per-account attempt count only proves the attack was unsuccessful, when stuffing makes about one or two attempts per account and lockout also opens a denial-of-service vector against real users.
- **B.** Lockout failed because the passwords involved were too weak, and a stronger complexity policy is the actual fix.
- **C.** Lockout failed because this was actually phishing, and user awareness training is the fix instead.
- **D.** Lockout never approached its threshold because stuffing makes few attempts per account; MFA is the defence that covers stuffing because a correct password stops being sufficient.

### 12.

A host cannot reach 192.0.2.44, which is on the same subnet. `ip neigh show dev enp0s3` shows a FAILED entry for that address. What does a FAILED entry mean here?

- **A.** It means routing to 192.0.2.44 has failed somewhere beyond this subnet, which ARP is reporting on behalf of the router.
- **B.** It means the address is definitely down at the operating-system level, since ARP can distinguish a powered-off host from a merely unresponsive one as commonly understood by less experienced staff.
- **C.** The ARP request for 192.0.2.44 went unanswered on this segment; nothing responded, which points at that specific host being off, misconfigured, or on a different segment than assumed.
- **D.** It means DNS resolution for that address's hostname has failed, which `ip neigh` also reports through the same state field.

### 13.

A node running several workloads stops reporting heartbeats to the orchestrator. What happens to the workloads that were running on it?

- **A.** They stay assigned to that node indefinitely, since an orchestrator reacts only to a workload's own process crashing and has no view of whether a node is still reporting in.
- **B.** They are paused rather than recreated, waiting for a human operator to manually confirm the node is actually down.
- **C.** They are recreated elsewhere, because nodes are watched the same way workloads are, and a node that stops reporting has its workloads rescheduled rather than left stranded.
- **D.** They are removed permanently, since an orchestrator treats a lost node as a signal to reduce the declared replica count.

### 14.

Why is an untagged resource described as the enabling gap beneath every other cost-control practice in this competency?

- **A.** Because a budget cannot be created at all for any resource or set of resources that has not first been tagged and registered.
- **B.** Because cost-monitoring dashboards are built to refuse displaying any resource that arrives without a complete set of tags attached.
- **C.** Because chargeback, showback, budgets and orphan-hunting are all attribution questions before they are cost questions, and an untagged resource has no attributable owner.
- **D.** Because untagged resources are automatically billed by the provider at a higher per-unit rate than equivalent tagged ones.

### 15.

An operator runs `cd '~'`, intending to go to their home directory, and instead gets "No such file or directory". What went wrong?

- **A.** `cd` never accepts `~` as an argument, because the builtin requires either an absolute path or a plain directory name
- **B.** Quoting the tilde suppressed expansion, so the shell looked for a directory literally named `~`
- **C.** The account's `$HOME` variable was never set, so expansion had nothing to substitute
- **D.** The home directory does not exist on this system, independent of quoting

### 16.

A downstream distributor modifies three files from an Apache-2.0 project that ships a NOTICE file, then redistributes the result. Beyond MIT's single notice-retention condition, what does Apache-2.0 additionally require here?

- **A.** Nothing additional — Apache-2.0's redistribution conditions reduce in practice to the exact same single copyright-notice requirement that MIT's one-paragraph licence text already carries in full, word for word.
- **B.** Filing a Contributor License Agreement with the upstream project before the modified files may be redistributed to anyone.
- **C.** Relicensing the three modified files under the GPL, since Apache-2.0 becomes a copyleft licence once any file is modified.
- **D.** Marking the three modified files with prominent notices that they were changed, and reproducing the upstream NOTICE file's attributions in the distributor's own NOTICE, documentation, or a generated display.

### 17.

An `/etc/resolv.conf` lists five `nameserver` lines, hoping for extra resilience. How many will actually be used?

- **A.** All five will be queried in parallel on every lookup, since the resolver is designed to race every listed nameserver simultaneously for speed.
- **B.** Only the first one will ever be used, with the remaining four serving no purpose at all under any circumstances.
- **C.** All five will be used, but only in round-robin fashion across successive independent DNS queries rather than in a fixed priority order.
- **D.** Up to MAXNS, currently 3; further lines beyond the third are simply ignored, so listing five does not add any resilience.

### 18.

An application keeps per-user session state in memory on whichever backend first served that user. Requests from the same user are then distributed evenly across every backend by the load balancer's default scheduling algorithm. What problem does this cause, and what feature addresses it?

- **A.** No problem is caused, since every backend behind a load balancer is defined to automatically share in-memory session state with every other backend by default.
- **B.** Later requests may land on a backend without that user's session state, breaking the application; session affinity, or sticky sessions, pins a client to one backend to fix this, at the cost of even distribution.
- **C.** The problem is caused by health checking, and the fix is to disable health checks so that every backend remains in rotation regardless of its actual state.
- **D.** The problem is caused by layer 4 balancing specifically, and the fix is to switch to layer 7 balancing, which is defined to always keep a user on one backend automatically across virtually every environment of this kind.

### 19.

A service already sits behind a network firewall. A proposal adds a host firewall on the machine itself. What determines whether this counts as a genuine second layer of defense in depth?

- **A.** Whether the two fail independently: if a misconfiguration or bypass of the network rule still leaves the host rule enforcing, it is a real second layer.
- **B.** Whether the two run identical rule sets, since matching rules guarantee the second firewall enforces everything the first one does.
- **C.** Whether the second firewall sits on a different host — defense in depth counts layers by the number of machines involved.
- **D.** Whether the host firewall improves availability, since layering is only ever a redundancy measure for uptime.

### 20.

A database instance runs at 4% CPU all month but is still serving live production queries. What is the correct action?

- **A.** Delete it, since a resource this underused has no purpose left.
- **B.** Leave it alone and let autoscaling shrink it automatically as load drops further.
- **C.** Resize it to a smaller instance and re-measure; the resource is wanted, only its size is wrong.
- **D.** Detach and reattach its storage volume, since that resets the meter to reflect true utilisation.

### 21.

An operator needs the five-field time syntax used inside a crontab file, not the usage of the `crontab` command itself. Which invocation opens the correct manual page?

- **A.** `man crontab`, which opens whichever section is searched first
- **B.** `man 5 crontab`, which asks for the file-format section explicitly
- **C.** `man -k crontab`, which searches page descriptions for the keyword
- **D.** `info crontab`, since Texinfo manuals are organised into the same numbered sections as man

### 22.

An engineer manually deletes one pod belonging to a Deployment declaring three replicas, expecting the application to run with two instances until the next deploy. What actually happens within seconds?

- **A.** The Deployment's replica count silently drops to two, since manual deletion is treated as a deliberate scale-down request.
- **B.** Nothing happens until the next scheduled deploy, since the Deployment only reconciles state when a new version is rolled out and otherwise leaves the running pods untouched.
- **C.** A replacement pod appears almost immediately, because the controller continuously compares actual state against the declared replica count and corrects the difference.
- **D.** The Service in front of the pods creates a replacement directly, since it is responsible for maintaining the pod count behind it.

### 23.

A reverse proxy terminates TLS and forwards requests to a backend application over a private address. The backend's access logs show every request coming from the proxy's own IP address rather than the real client's. What explains this, and what fixes it?

- **A.** The backend's own network interface must be misconfigured, since a correctly working reverse proxy is defined to always preserve the original client's IP address in every log entry automatically, so no header configuration is needed on the proxy itself.
- **B.** Because a proxy terminates and re-issues the connection, the backend sees the proxy as its client; a forwarded header, added by the proxy, is what recovers the original client address for logging or access control.
- **C.** This only happens because the reverse proxy is also functioning as a load balancer, and load balancers are what specifically cause this address-masking behaviour.
- **D.** The fix is to switch from a reverse proxy to a forward proxy, since only a forward proxy is capable of preserving the original client's address in backend logs.

### 24.

A developer runs VMware Workstation on a Windows laptop to test a Linux VM alongside their normal desktop applications. Is this a type 1 or type 2 arrangement, and how does it compare to VMware Fusion?

- **A.** Type 2, because the hypervisor runs as an application on the conventional host OS; Workstation is the same class of product as Fusion, just on Windows and Linux instead of macOS.
- **B.** Type 2, and therefore an outdated or insecure choice compared to the type 1 hypervisors cloud providers use, which is why hosted hypervisors are no longer shipped for current desktop operating systems.
- **C.** Type 1 — running VMs alongside desktop applications still counts as bare-metal virtualization, since the hypervisor schedules VM resources straight onto the hardware with no host operating system in the path.
- **D.** Type 2, but unrelated to Fusion — Fusion runs virtual machines using a fundamentally different mechanism, replacing macOS at boot rather than running on top of it.

### 25.

What does a neutral foundation such as the Linux Foundation or the Apache Software Foundation actually provide to a project it hosts?

- **A.** Paid engineering staff, employed by the foundation itself, who write and maintain the code of each project it hosts.
- **B.** A guarantee that every contributor automatically becomes a committer with write access after their first merged change is accepted.
- **C.** Legal entity status, stewardship of assets and trademarks, shared infrastructure, and governance rules — not technical direction, which stays with the project's own maintainers.
- **D.** Direct control over each hosted project's technical roadmap, exercised through decisions made by the foundation's board.

### 26.

Repeated `dig` queries against the same resolver show a record's TTL falling from 300 to 240 to 180 across successive requests a minute apart. Is this evidence of a misconfiguration?

- **A.** Yes — a correctly configured authoritative server should always show a falling TTL exactly like this on every repeated query it answers, a pattern that holds across most deployments encountered.
- **B.** No. A caching resolver returns the remaining lifetime of the cached record on each answer, so a falling TTL across repeated queries is the expected countdown, not an error.
- **C.** Yes, and it indicates the zone's SOA parameters have been misconfigured to force an artificially short negative-caching interval.
- **D.** No, but only because the resolver being queried must actually be the authoritative server rather than a caching, recursive one.

### 27.

A laptop with a LUKS-encrypted disk is stolen while powered off. What does full disk encryption actually protect here, and is the running-and-unlocked case the same?

- **A.** It protects the data equally in both states, since LUKS encrypts continuously regardless of whether the volume is unlocked, when an unlocked volume leaves its files readable to any permitted process exactly as an unencrypted one would.
- **B.** It protects the data because the volume is locked without the key; while the machine was running and unlocked, the same files were readable to any permitted process.
- **C.** It protects the network traffic the laptop last sent, in addition to the stored files.
- **D.** It protects only the LUKS header, not the data volume itself.

### 28.

Comparing the RFC's dynamic port range against what a real Linux client actually uses for its outgoing source port, are they the same range?

- **A.** Yes — Linux follows RFC 6335's ephemeral range exactly for outgoing connections
- **B.** No — Linux uses a narrower range entirely inside the well-known ports, 0-1023
- **C.** No — RFC 6335 puts dynamic ports at 49152-65535, while Linux's default local range is 32768-60999
- **D.** The two ranges differ only for UDP and match exactly for TCP, since the kernel's local port range is consulted only for connectionless sockets

### 29.

A laptop was powered off overnight, missing its scheduled 03:00 cron job entirely; the job never ran once the machine came back on. Is plain cron broken?

- **A.** No — cron simply skips a scheduled time that passes while the machine is off; `anacron` exists specifically to compensate for that
- **B.** Yes, cron should always run a missed job as soon as the machine powers back on
- **C.** No, but the job must have been accidentally removed with `crontab -r` — cron drops a user's table automatically once one of its scheduled runs is missed
- **D.** Yes, and the fix is to switch the job to a `.timer` unit without `Persistent=true`

### 30.

A team connects their application to a provider-operated managed database, but writes and deploys no application code onto the database itself. Does connecting to it make the database part of the team's PaaS usage?

- **A.** Yes — any provider-operated component that a PaaS application depends on is itself part of the PaaS model the application runs on.
- **B.** Yes, because the database runs on the same underlying infrastructure as the application, which is what puts it inside the same service model.
- **C.** No, because managed databases are always billed on a separate invoice from application hosting.
- **D.** No. Nothing of the team's is deployed onto the database, so it is a managed service rather than PaaS, even though the team's application is PaaS.

### 31.

An image tagged only `api:1.4.2`, with no registry host in the name, is pushed with `docker push api:1.4.2` and the team is surprised it never reaches their private registry. Why?

- **A.** `docker push` requires a separate `--registry` flag naming the destination, and the command silently no-ops without it That framing assumes the registry host has to be supplied as a flag rather than read from the tag itself.
- **B.** `docker pull` must run first to establish the private registry as the active destination for subsequent pushes.
- **C.** With no registry host in the tag, `docker push` targets Docker Hub by default, so the image was never sent to the private registry at all.
- **D.** The image was pushed correctly, and the private registry's UI is simply slow to reflect newly uploaded tags.

### 32.

An administrator wants to force `bob` to pick a new password the next time he logs in, without disabling his account. Which change to `/etc/shadow` fields does that, and which command applies it?

- **A.** Set the last-change field to `0` with `chage -d 0 bob`
- **B.** Set the account expiry date with `chage -E`
- **C.** Edit `/etc/passwd` to clear the login shell field
- **D.** Lock the account with `usermod -L`, which forces a password reset on next login

### 33.

Comparing `set` with no arguments against `env`, what is the difference in what each lists, and how does that explain a variable that appears in one but not the other?

- **A.** `set` lists only exported variables, and `env` lists everything including functions
- **B.** Both list identical output; any difference indicates a corrupted shell session
- **C.** `env` includes variables from every user's login shell, not just the current one
- **D.** `set` lists all shell variables and functions; `env` lists only exported ones

### 34.

An engineer runs `ssh-keygen -t ed25519 -C "laptop"` and then needs to install the resulting public key on a remote server they can currently only reach with a password. Which command installs it correctly?

- **A.** `ssh-add ~/.ssh/id_ed25519`, loading the key so the remote server can pick it up on the next connection
- **B.** `ssh-keygen -t ed25519 -C "laptop"` run a second time directly on the remote server
- **C.** `ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host`, appending the public half to the remote account's `authorized_keys`
- **D.** `gpg --verify ~/.ssh/id_ed25519.pub user@host`, verifying the key's signature against the remote account

### 35.

A vendor publishes a product's full source code publicly, but its licence bars any commercial use or competing service built from it. How should this licence be classified?

- **A.** Proprietary. Publishing the source does not grant the field-of-endeavour freedom the Open Source Definition requires, so the licence remains proprietary despite the visible code.
- **B.** Open source, since the Open Source Definition is only concerned with whether the source is available for anyone in the public to read at will.
- **C.** Proprietary only if the vendor also charges a fee for access; a free download of visible source is automatically considered open source regardless of any other restriction in the licence text.
- **D.** Undetermined until the licence is checked for compatibility against whatever other components it might later be combined with in a shipped product.

### 36.

Which directory holds host-specific system configuration, and what does the FHS say may never be placed there?

- **A.** `/etc`, and log files, since logging is considered configuration data
- **B.** `/var`, and binaries, since `/var` is also host-specific
- **C.** `/etc`, and binaries — the FHS is explicit that `/etc` holds settings, not the programs that read them
- **D.** `/usr/local/etc`, and configuration files themselves — since FHS 3.0 moved system-wide configuration out of `/etc` and into that tree

### 37.

A managed DNS service is described as changing the answer it returns for a name automatically when a resource behind it fails. What is this mechanism called?

- **A.** Layer 7 routing, since content-based rules are what redirect traffic away from the failure.
- **B.** Address remapping, since a static address is being pointed at a new resource.
- **C.** Load balancing, since both mechanisms route traffic away from a failure the same way.
- **D.** DNS failover, since the authoritative answer stops pointing at the failed endpoint once its health check fails.

### 38.

A service account's login shell was changed to `/usr/sbin/nologin` last week. Its SSH key is still listed in `authorized_keys`, and an operator runs `ssh svc@host 'systemctl status app'`. What happens?

- **A.** The command does not run, because `sshd` starts it through the account's login shell and `nologin` ignores shell options such as `-c`
- **B.** The command runs normally — `sshd` executes a single non-interactive remote command directly rather than through the account's login shell
- **C.** The connection is refused at authentication, because setting a nologin shell automatically revoked the account's authorised keys
- **D.** The command runs, because `nologin` takes effect only for accounts with a UID of 1000 or above

### 39.

A product team runs one deployable application and complains that a sign-up spike forces them to scale an unrelated video-streaming feature along with it. A colleague separately argues the codebase should be split into microservices because it has become hard to read. Is code readability a reason to make that split?

- **A.** No, because deployment shape and code quality are separate problems; the sign-up spike is a genuine scaling argument, but an untidy codebase is not, and microservices add operational cost regardless of the reason given.
- **B.** Yes, since decomposing a monolith into services is the standard fix whenever a codebase has become difficult to read and to change over time, and the cost of running the extra services is repaid by how much easier each one is to reason about.
- **C.** No, but only because the team has not yet promoted the same built artifact through every environment it deploys to.
- **D.** Yes, provided the newly split services are also defined declaratively as infrastructure as code from the start.

### 40.

A container image built for `linux/amd64` fails to start on a host where `uname -m` reports `aarch64`, with an unhelpful generic error. What kind of problem is this most likely to be?

- **A.** A missing kernel module for the container runtime, unrelated to the image's intended target platform entirely.
- **B.** A kernel version mismatch, since `uname` is the very command that surfaced the problem in the first place.
- **C.** An architecture mismatch; the image's instruction set does not match the host's, not a missing dependency inside the image.
- **D.** The error is unrelated to architecture, since container images are built to run on any host platform by design.

### 41.

A design places three resources into three different subnets of the same virtual private cloud, with no other network configuration made. Which best describes the isolation those resources have from each other?

- **A.** None by default, since subnets in the same network can route to each other; isolation is a property of the virtual private cloud, not of splitting it into subnets.
- **B.** Complete isolation, because putting each resource in its own subnet is exactly what creates an isolation boundary, the same boundary a virtual private cloud itself is supposed to provide between two separate networks.
- **C.** Isolation depends entirely on whether a network ACL has been attached to each subnet.
- **D.** Isolation only from the internet, since a private address range is not routable from outside.

### 42.

A team hardens a freshly provisioned host once at build time and never revisits the configuration. Why does the guide treat hardening as something verified periodically rather than done once?

- **A.** Because CIS Benchmarks are updated so frequently that any host is out of date within days regardless of drift — the benchmark revision, not the host, is what a periodic check is tracking.
- **B.** Because vendors patch default installations weekly, making any earlier hardening pass obsolete.
- **C.** Because attack surface only ever grows through newly disclosed CVEs, not through configuration changes.
- **D.** Because configuration drifts as software is installed and rules are added, so a baseline that was correct at build time can become permissive again over time.

### 43.

`ls -l /proc/1234/status` reports a file size of zero bytes, yet `cat`-ing it returns pages of readable text. Is that a sign of filesystem corruption?

- **A.** Yes, a zero-byte file that returns content when read always indicates filesystem damage
- **B.** No. Entries under `/proc` are generated by the kernel on demand, so they legitimately report zero size while still returning content when read
- **C.** No, but it does mean the process's inode has been exhausted — `/proc` allocates one inode per open file descriptor and drops the reported size to zero once that pool runs out
- **D.** Yes, and the fix is to remount the filesystem `/proc` lives on

### 44.

An administrator needs the exact release string of the running kernel — the number that would let them check whether a specific driver bug fixed upstream is present on this machine. Which command reports it?

- **A.** `uname -a`, which prints every available field including the kernel release among several others.
- **B.** `cat /etc/os-release`, which reports the running system's version.
- **C.** `lsmod`, which lists what is currently loaded into the running kernel.
- **D.** `uname -r`, which prints the kernel release specifically.

### 45.

A support team puts a board with To Do, Doing and Done columns in front of its work and calls the practice Kanban. What is missing from that claim, and what would a Scrum team have instead of the missing piece?

- **A.** A defined Product Owner role, since Kanban requires one of its own just as Scrum does.
- **B.** Explicit work-in-progress limits, the mechanism that actually defines Kanban; a Scrum team instead bounds work with a fixed-length Sprint and a Sprint Goal.
- **C.** Nothing is missing — a board with columns is what Kanban means in practice, and the columns alone are what visualises the flow of work through each stage of the process for the whole team to see.
- **D.** A velocity figure, since both Kanban and Scrum teams are required to forecast from one.

### 46.

A running application's configuration file has changed and it must pick up the change. Should an administrator run `systemctl restart app` or `systemctl reload app`?

- **A.** `reload`, if the application supports it, since that asks the running process to re-read its configuration without stopping it
- **B.** `restart`, since it is always the safer choice regardless of what changed — a restart re-reads the unit file and the application's own configuration in a single step, which reload cannot do
- **C.** `systemctl daemon-reload`, since any configuration change requires reloading the manager
- **D.** `systemctl enable --now app`, to apply the new configuration at the next boot

### 47.

A team stores frequently-read database query results in an in-process memory cache to cut repeated work. A separate team serves their site's static images from edge locations distributed around the world, close to each viewer. Which of the two is a content delivery network, and what makes it a distinct case of the same underlying technique?

- **A.** Both equally, since an in-process cache and a set of edge locations are simply two names for one identical mechanism — collapsing the general technique and its geographically distributed special case into a single mechanism with no distinguishing property left.
- **B.** The first, because a CDN specifically avoids storing any data and only forwards requests toward the nearest origin.
- **C.** Neither, since caching and content delivery are unrelated techniques that happen to share the word 'edge'.
- **D.** The second — a CDN is caching plus geography: it is one specific deployment of the general technique, distinguished by its edge locations sitting near the viewer rather than in application memory.

### 48.

A pipeline stage fails partway through a run. What happens to the change under test, and what happens to the artifact the run had produced up to that point?

- **A.** The remaining stages still execute afterward, since each stage runs independently of whether the one before it passed or failed.
- **B.** The run stops so the change does not progress to later stages, and any artifact from the failed run is never promoted.
- **C.** The previous release is automatically rolled back to undo whatever the failed change would have introduced.
- **D.** Only the failing test is reported, while the build itself is still considered a valid release candidate.

### 49.

A service that was working fine for months is simply absent after an unrelated reboot — no crash, no error, nothing in the logs about it at all. What is the first command to run, and what does a result of `disabled` tell you?

- **A.** `systemctl is-enabled <unit>`; a result of `disabled` is the entire explanation — the unit was configured and started by hand but never enabled
- **B.** `systemctl is-active <unit>`, since an inactive result would explain why it is gone after reboot — it reports the boot-time enablement state alongside the current one
- **C.** `journalctl -u <unit> -b`, since a missing service always leaves an error explaining why it failed to start
- **D.** `systemctl daemon-reload`, since re-reading unit files restores services that vanished after a reboot

### 50.

An analytics export contains a browsing session ID, a product SKU viewed, a postcode, and a date of birth — no name, account number or email address anywhere in the file. Applying NIST SP 800-122's two-part test, what is the status of this export?

- **A.** It is not PII, because no single field in the file can distinguish or trace an individual's identity by itself, and combination effects only matter once a name or account number is also present.
- **B.** It is a classification question rather than a PII question, since data classification exists precisely to flag files containing personal data.
- **C.** It stays anonymous unless the vendor later joins it to an account number, so no obligation attaches to the file as exported today, only to whatever the vendor might eventually build from it.
- **D.** It is PII, because the postcode combined with the date of birth is linked-or-linkable information capable of identifying a person even without a direct identifier.

### 51.

In what year, and in what capacity, did Linus Torvalds begin the Linux kernel?

- **A.** 1991, as a free Unix-like kernel he then developed openly with a growing contributor base.
- **B.** 1991, as an official Linux Foundation project from its founding.
- **C.** 1983, as part of the GNU Project's effort to build a complete free Unix-like system.
- **D.** The exact year is disputed, since the kernel's development predates any reliable public record.

### 52.

Name two advantages a systemd timer has over plain cron for a scheduled job.

- **A.** Timers are simpler to write than crontab lines, and they require no separate unit file
- **B.** Timers run with a full interactive shell environment, unlike cron — the service a timer activates is started from a login shell that sources the user's profile
- **C.** Timers can run system-wide scripts, while cron is restricted to per-user jobs only — every crontab lives in a per-user spool file and cron has no system-wide table
- **D.** Output is captured in the queryable journal rather than mailed, and a missed run can be made up with `Persistent=true`

### 53.

A team says 'we run two application servers, so we have redundancy.' What has not yet been established about the pair?

- **A.** Whether the servers are running the newest version of the operating system — a detail that says nothing about whether the two machines could both be lost to the same rack, power feed or zone-level event.
- **B.** Whether they sit in independent failure domains (separate hosts, racks or zones), so the event that takes out one cannot also take out the other.
- **C.** Whether the pair has been load tested at its maximum request rate.
- **D.** Whether the servers are billed on a monthly or an annual commitment.

### 54.

A project is running two weeks behind schedule. The sponsor proposes adding three new engineers to catch up. What is the likely short-term effect?

- **A.** The project gets slower in the short term, because existing staff spend their time bringing the new engineers up to speed.
- **B.** The project speeds up in rough proportion to headcount, since more people working means more work gets done per day, the same way three cashiers process a queue faster than one.
- **C.** The schedule and cost both improve at once, since adding staff is the standard way to trade cost for time.
- **D.** The team's velocity increases immediately, once the new engineers begin estimating alongside the rest of the team.

### 55.

An administrator wants to see the effective configuration of `nginx.service`, including any override applied through a drop-in file, rather than only the distribution-shipped definition. Which command shows that?

- **A.** Reading `/usr/lib/systemd/system/nginx.service` directly is sufficient, since that is where the definitive file lives
- **B.** `systemctl list-units --type=service`, which lists every loaded service unit — each row naming the drop-ins currently applied to it
- **C.** `systemctl daemon-reload`, which prints the current unit definitions as it reloads them
- **D.** `systemctl cat nginx.service`, which prints the vendor unit plus every applicable drop-in, each labelled with its path

### 56.

A developer runs `git push -u origin main` for the first time on a new branch, then later runs a bare `git push` and it is rejected as a non-fast-forward update. What does `-u` add, and what does the rejection mean?

- **A.** `-u` records `origin main` as the branch's upstream so a bare push resolves the same destination; the rejection means the remote holds commits that are not ancestors of what is being sent, so applying it would discard them.
- **B.** `-u` uploads the branch's tags along with its commits; the rejection means the developer lacks write permission on the remote.
- **C.** `-u` forces the push through even if the remote has diverged; the rejection cannot happen again on this branch afterward.
- **D.** `-u` is required only the very first time any repository pushes to that remote at all; the rejection here means the branch name collides with an existing one on the server that a different contributor already created earlier that day.

### 57.

A system administrator runs an ordinary file-delete command across a directory of sensitive files before decommissioning a drive. Has the data been securely deleted?

- **A.** Yes — once a file has no directory entry pointing to it, its contents are gone from the device, since nothing else on the filesystem still references those blocks.
- **B.** Yes, provided the retention schedule for those files had already expired before the command ran, since an expired schedule makes any deletion method equally final.
- **C.** No — an ordinary delete removes the directory entry and decrements the link count; the blocks holding the contents remain until reallocated and are recoverable.
- **D.** No, but only because a backup copy of the same files still exists elsewhere.

### 58.

An SSH session into a remote server presents a working command prompt. What role is the SSH session filling in this picture?

- **A.** It is acting as the terminal, carrying keyboard input to the remote shell and rendering the shell's output back, without interpreting any of the commands itself.
- **B.** It is acting as the shell, since it is what the user directly interacts with to type and run commands, exactly the role a local shell prompt would otherwise play.
- **C.** It is acting as the kernel, since it manages the network connection that carries the session's data all the way from the client to the server.
- **D.** It is acting as a pseudo-terminal device, which is a kernel object rather than anything the SSH client itself supplies over the connection.

### 59.

A single-writer relational database is running out of capacity on its write path, and the write path cannot be split across multiple nodes. Which capacity move fits, and what does it cost?

- **A.** Horizontal scaling — adding more database nodes behind a load balancer — since that removes the single point of failure with no interruption cost.
- **B.** Auto-scaling — letting a scaling group add database instances against a CPU metric.
- **C.** Caching the write path's results so fewer writes reach the database directly.
- **D.** Vertical scaling — moving the database to a larger instance type — at the cost of a restart and a hard ceiling once the largest available machine is reached.

### 60.

By IP address the API answers with an HTTP 502; by hostname the client hangs until it times out. What do these two results establish separately?

- **A.** Both results point at one firewall rule in the network path between the client and the server, since a rule that silently drops packets addressed by name while mangling those addressed by IP would produce a slow failure in the first case and an error status in the second.
- **B.** Restart the service immediately, since a 502 response always means the backend process itself has crashed outright.
- **C.** The 502 from `curl -v` against the IP proves the connection completed and an HTTP response came back, so the fault is above the transport layers; the timeout by name is resolution, which `dig` isolates.
- **D.** The delay seen only when connecting by name indicates the host itself is CPU-saturated and slow to respond generally.

