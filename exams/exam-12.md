<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 12

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-12-answers.md](exam-12-answers.md)

---

### 1.

A patch is deployed first to a small set of canary systems, then to the rest of the estate once no breakage appears. Which decision does that phasing belong to?

- **A.** Patch management as a whole, since testing, deployment and verification are all part of the wider practice.
- **B.** Testing before production, since canaries function as a staging environment.
- **C.** Maintenance windows, since canaries define which hosts fall inside the agreed window.
- **D.** Patch cadence — the scheduling decision for how and when updates roll out, including the order deployment follows.

### 2.

A system is being reviewed and the architect states its guiding assumption as: every component will eventually fail, so failure must be a routine, absorbed event rather than an incident. Which practice does that assumption describe?

- **A.** Design for failure: the design stance that failure is expected and built for, not a fault-tolerance mechanism or a recovery plan.
- **B.** Fault tolerance — the narrower, component-level property that absorbs one defined class of failure with no interruption a user would ever notice.
- **C.** High availability — the weaker property that accepts a short interruption while detection and failover run.
- **D.** A monitoring discipline that watches for failures once they happen, rather than an assumption made at design time.

### 3.

A nightly job takes `tar czf` snapshots of `/var/log/app` and keeps them as the sole recovery mechanism. Comparing archiving against an actual backup strategy, what is missing from relying on archives alone?

- **A.** An archive is a one-off bundle at a point in time, not a managed, retained set of independent recovery copies
- **B.** Nothing is missing; a nightly `tar` archive already satisfies every backup requirement
- **C.** The job would need to switch to `zip` instead of `tar` to count as a real backup
- **D.** Archives cannot be restored at all; only continuous replication to a second host produces recoverable data, because `tar` removes the originals as it bundles them

### 4.

An organisation holds a current, unqualified audit report for a named security standard, then is breached the following week through an attack path the standard's scope never covered. Which statement is accurate?

- **A.** No, an organisation cannot be genuinely compliant while it remains breachable, because compliance implies the system was already secure against every attack.
- **B.** Both can be true together: compliance is conformance to an external obligation over a past period, and security is whether the system actually resists attack.
- **C.** No, a security standard's audit examines the CIA triad directly, so a clean report already means confidentiality, integrity and availability held against every possible attacker.
- **D.** No, an unqualified report means the auditor found zero exceptions anywhere across the organisation's entire technology estate.

### 5.

A candidate must name the control plane component that watches for newly created pods with no assigned node and picks one for them. Which is it?

- **A.** `kube-apiserver`, which is the front end for the Kubernetes API and therefore also performs node selection for every pod.
- **B.** `kube-scheduler`, which selects a node for each unscheduled pod based on its declared resource needs and placement constraints.
- **C.** etcd, since it stores all cluster data and therefore also decides which node a new pod is assigned to.
- **D.** `kube-controller-manager`, which runs the controller processes and therefore also handles new-pod scheduling as one of its controllers.

### 6.

A release passes 100% of its planned tests, and the traceability matrix shows every requirement covered. Two weeks after go-live, the department is still using its old spreadsheet instead. What does this show?

- **A.** Verification succeeded — the system conforms to its specification — but validation was never done, so a wrong specification went undetected.
- **B.** The traceability matrix must be wrong, since full coverage should have caught the department's non-adoption.
- **C.** User acceptance testing must not have been run, since UAT alone verifies conformance to the specification.
- **D.** Nothing is wrong — passing every test in the plan is itself evidence the project succeeded.

### 7.

Per consensus practice, what does having a named owner for a service establish, as distinct from the on-call responder or the asset record?

- **A.** The same accountability as the on-call responder, since both may be contacted during an incident.
- **B.** Accountability for the service's health, cost and lifecycle over its life, not just handling one incident or recording its existence.
- **C.** A record of the service's existence, indistinguishable from its inventory entry, rather than an accountability held by any one person.
- **D.** Responsibility for revoking the service's credentials when staff depart, which belongs to the separate offboarding process instead.

### 8.

A workload needs to store a third-party API key and retrieve it at startup, with rotation on a schedule and every access recorded. Which service is that, and which adjacent service is it not?

- **A.** A key management service, since encrypting the key at rest is what actually protects it.
- **B.** An instance role, since roles are the platform's general answer to holding any kind of credential.
- **C.** An environment variable marked as encrypted inside the deployment manifest, which is treated as achieving the same protection and rotation guarantees as a properly managed secret store.
- **D.** A managed secret store rather than a key management service, which creates and controls encryption keys instead of holding credential values.

### 9.

What does the 3-2-1 backup rule prescribe?

- **A.** Three full backups, two differentials, and one incremental each week.
- **B.** Three sites, two of them warm, and one hot.
- **C.** Three copies of the data, on two types of media, with one held off-site.
- **D.** Three restore tests a year, two of them full, and one tabletop.

### 10.

An operator wants to remove a directory only if it is completely empty, and to be told about it if it is not, rather than having the contents silently swept away. Which command gives that behaviour?

- **A.** Running `rm -r`, which recurses through the tree and clears everything it finds
- **B.** Running `rm -i` and confirming each file individually as it goes
- **C.** `mv` to a temporary location before deleting, since relocating a directory and then removing it from its new location produces the same end result as deleting it directly
- **D.** Running `rmdir` against the target directory, refusing outright if anything remains inside

### 11.

A team deletes a customer's row from its primary database in response to an erasure request, but the same data still exists unmodified in nightly backups and an analytics warehouse. Has disposal actually occurred?

- **A.** No, the same data held in backups, archives and analytics copies is governed by the same schedule, and disposal means verified, documented destruction of every copy.
- **B.** Yes, deleting the row from the primary database is exactly what the phrase ‘we deleted the record’ is generally understood to mean, in ordinary operational usage and in an erasure response alike.
- **C.** Yes, provided the primary-database deletion is logged as evidence for a future audit to examine.
- **D.** No, but only because the analytics warehouse falls entirely outside GDPR's definition of processing personal data.

### 12.

Which requirement is replication the appropriate answer to?

- **A.** Service must continue from a second site if the primary becomes unavailable.
- **B.** A file deleted by an operator last Tuesday must still be recoverable from a retained copy.
- **C.** Restores must be proven to work against a published schedule each quarter.
- **D.** Storage cost must fall as data ages beyond its useful window.

### 13.

`docker build -t api:1.4.2 .` is run from a project directory containing both a `Dockerfile` and a `Dockerfile.dev`. What does the trailing `.` refer to?

- **A.** The build context directory sent to the builder, inside which the Dockerfile named `Dockerfile` is found by default.
- **B.** The specific Dockerfile to build from, so this command would use `Dockerfile.dev` if it sorts first alphabetically.
- **C.** A shorthand telling the CLI to reuse whichever context was used by the previous `docker build` invocation in this shell session.
- **D.** The registry namespace the resulting image will be pushed under once the build finishes.

### 14.

A finance dashboard shows only a single monthly total for the whole account. What does that coarse granularity hide from view?

- **A.** Which access tier each stored object currently sits in.
- **B.** Whether a given transfer crossed a region boundary during the month.
- **C.** Nothing — a monthly total contains the same information as any finer granularity, just already summed.
- **D.** A three-day spike within the month, which daily or hourly data would show immediately.

### 15.

An operator runs `scp -p report.txt user@host:/tmp/`, intending to also select a non-standard SSH port, and mistakenly writes `-p 2222` for that purpose. What actually happens?

- **A.** It works exactly as intended, since `scp` accepts either case for the port flag
- **B.** Lower-case `-p` preserves times and file mode bits in `scp` rather than selecting the port, so `2222` is read as an extra source path
- **C.** The command fails outright with a syntax error before attempting any connection
- **D.** `scp` ignores the flag entirely and connects on the default port 22 regardless, because it validates option letters against `ssh`'s option table before using them

### 16.

FOSS is used as a neutral umbrella term because two separate organisations judge overlapping sets of licences against different texts and for different reasons. Which pairing correctly describes the two?

- **A.** The Free Software Foundation argues from user freedom via the four freedoms; the Open Source Initiative argues the same licences on practical and development grounds via the Open Source Definition.
- **B.** The Open Source Initiative argues from user freedom as an ethical position; the Free Software Foundation runs the review process behind the Open Source Definition's approved-licence list and publishes it on the Initiative's behalf.
- **C.** The Software Package Data Exchange assigns identifiers to both organisations' approved licences, which is why their two lists match item for item.
- **D.** Free software and open source software are opposing camps whose licences reject and actively exclude one another.

### 17.

An administrator whose host has a single configured address of 10.0.5.20/24 runs `ip route add default via 192.168.9.1`. What actually happens?

- **A.** It succeeds anyway, since the kernel automatically adds a temporary connected route to reach any configured gateway address regardless of which subnet that address happens to fall in.
- **B.** It succeeds, but only for traffic to well-known ports, since the kernel treats those destinations as a special case bypassing the gateway check.
- **C.** It is accepted without complaint and installs normally, failing only later when traffic is sent and no ARP reply ever comes back for the gateway address itself.
- **D.** The command is rejected outright with `Error: Nexthop has invalid gateway.`, because a gateway must be on-link, on the same subnet as one of the host's own addresses.

### 18.

A DHCP server on one subnet must serve clients on a physically separate subnet, and DHCP discovery is a broadcast that does not cross routers. What component makes this work, and what does it do?

- **A.** Nothing extra is needed, since routers are defined to always forward the first four bytes of any broadcast packet regardless of protocol.
- **B.** A DHCP reservation configured on the server, which is what allows a single broadcast to be forwarded across a router boundary to remote clients as a matter of routine operational practice.
- **C.** A static default route added to the clients' subnet, which redirects the broadcast DISCOVER message toward the remote DHCP server directly.
- **D.** A relay agent placed on the clients' subnet, which forwards the broadcast DISCOVER on to the DHCP server at a configured address, normally by unicast, and relays the reply back.

### 19.

A consumer fitness app collects heart-rate data directly from its users and is not affiliated with any hospital, insurer, clearinghouse or health-care provider. Does HIPAA govern that data?

- **A.** Yes, because health data as sensitive as a heart-rate reading is automatically protected health information under HIPAA wherever it happens to be collected or held.
- **B.** No, HIPAA's scope follows who holds the data, and an app that is neither a covered entity nor a business associate falls outside it, however sensitive the data is.
- **C.** Yes, because GDPR treats health data as a special category and HIPAA extends the same special-category classification to US-based apps.
- **D.** Only if the app keeps the data for longer than the retention period HIPAA mandates for consumer health apps.

### 20.

A company virtualizes its entire datacentre and now runs several hundred VMs, but any new VM still requires a ticket a human approves within two working days. Business units are billed a flat internal rate regardless of how much they use. Is this cloud computing?

- **A.** Yes — running many isolated VMs on shared physical hosts is the resource pooling NIST asks for, and pooling is the characteristic that decides the question.
- **B.** No, because NIST reserves the term for infrastructure a cloud provider owns, and hardware a company bought for itself can never qualify.
- **C.** No. Without on-demand self-service and measured service, virtualizing the hardware alone does not satisfy NIST's definition.
- **D.** Yes — billing business units for what they use is measured service, and measured service is the characteristic the definition actually turns on.

### 21.

A line containing `!!` behaves as expected when typed at an interactive prompt, but the identical line inside a script does nothing of the kind. Why does the same syntax behave differently in the two contexts?

- **A.** Scripts silently rewrite `!!` into the literal text of the last command run interactively
- **B.** `!!` is bash-only syntax that fails the same way at a prompt and in a script, since no shell has ever implemented it
- **C.** History expansion is disabled in non-interactive shells, so `!!` in a script is not treated specially
- **D.** The script needs `source` instead of direct execution for history expansion to apply

### 22.

A rollback is planned for a service, but the artifact registry has already garbage-collected last week's image. What happens to the rollback?

- **A.** It silently becomes a rebuild from an old commit rather than a retrieval, because the registry is what turns rollback into a retrieval in the first place.
- **B.** Nothing changes, since rollback always rebuilds a version from source regardless of what the registry currently holds.
- **C.** The rollback can still proceed cleanly by requesting the same version number from the source repository instead.
- **D.** The rollback still succeeds without issue, since a registry only ever stores metadata and the built artifact itself lives in source control beside the code.

### 23.

`curl -I https://example.com` is run to confirm a site responds, and it returns `301` with no body shown. A colleague reports the site is down. Is that conclusion supported?

- **A.** Yes — any status code other than exactly 200 returned by `curl -I` is defined to indicate the site is unreachable or malfunctioning.
- **B.** No, but only because `curl -I` is fundamentally the wrong tool to use here, and `wget` would have returned a success status instead for the identical request.
- **C.** Yes, since a HEAD request, which `curl -I` issues, is defined to always fail with a 301 status regardless of how the server is actually configured.
- **D.** No — 301 is a redirect, not a failure; without `-L`, `curl` stops there by design, and the site is answering exactly as configured.

### 24.

Are actions taken through a cloud provider's web console audit-logged the same way as actions taken through its CLI or API?

- **A.** No — console actions leave no record at all, which is precisely why infrastructure as code is treated as the more auditable approach.
- **B.** Yes: on the major providers, console actions are logged by default alongside CLI, SDK and API actions; what the console lacks is a reviewable artifact, not an audit trail.
- **C.** Yes, but only if the customer explicitly enables logging for the console specifically, since browser sessions sit outside the API audit path by default.
- **D.** No, because only infrastructure-as-code changes are recorded as auditable events, the provider logging the plan a tool applies rather than the underlying call.

### 25.

A change request is assessed and approved by the project sponsor, but nobody updates the schedule or budget baseline afterward. What is the practical effect?

- **A.** None — approval by the sponsor is sufficient on its own to make the change fully controlled.
- **B.** It only becomes a problem at project closure, when the missing update is caught during acceptance review, since that is the point at which the whole plan is finally checked against reality.
- **C.** It only becomes a problem if the communication plan fails to notify the delivery team of the approval.
- **D.** Because the plan still shows the old scope, the approved change behaves exactly like creep, and the extra work is absorbed silently rather than tracked.

### 26.

A network with heavy NAT translation in place is described by a manager as "secure, since NAT hides our internal addressing." Is NAT itself a security control?

- **A.** Yes — NAT actively inspects every packet's payload and applies a deny-by-default policy to anything that looks suspicious before translating it.
- **B.** No. NAT blocks unsolicited inbound traffic as a side effect of having no mapping, not as a policy decision, and it inspects nothing; a network can run NAT with no filtering rules at all.
- **C.** Yes, but only in its capacity as the mechanism that also enforces TLS encryption on every translated connection passing through it.
- **D.** No, but only because a firewall is what actually performs NAT's address translation, with NAT itself being a purely cosmetic label.

### 27.

An IDPS and a vulnerability scanner are compared as a pair. What is the separating axis between what each one answers?

- **A.** Present tense versus latent state. The IDPS answers whether something is happening right now, while the scanner answers what could be exploited if someone tried.
- **B.** Cost — the IDPS is always cheaper to run than a vulnerability scanner.
- **C.** Both answer exactly the same question, and either one substitutes for the other in a mature security programme.
- **D.** Only the vulnerability scanner can be deployed on a host; the IDPS only ever runs on network infrastructure, when host-based deployment (HIDS/HIPS) is one of the IDPS's own two forms alongside the network-based one, not something reserved for a scanner.

### 28.

Inside single quotes, which of these has any special meaning to the shell: a dollar sign, a backtick, a backslash, or a wildcard character?

- **A.** The dollar sign still triggers variable expansion inside single quotes
- **B.** None of them; single quotes make every character inside literal
- **C.** The backslash still escapes the character that follows it, even inside single quotes
- **D.** A wildcard character still expands to matching filenames inside single quotes

### 29.

Running `ping web01` produces "Name or service not known." A colleague starts checking cabling and switch ports. Is that the right first move given this particular error message?

- **A.** Yes — "Name or service not known" is defined to always indicate a physical-layer fault, making cabling and switch ports the correct first thing to check, since ping reports resolver failures with a separate 'unknown host' message instead.
- **B.** No — this specific message means name resolution failed, not reachability; ping answers a name as well as an address, so this points straight at DNS or `/etc/hosts`, not at cabling or switching.
- **C.** No, but only because the correct first move is instead to check the default gateway configuration rather than name resolution at all.
- **D.** No, but only because the correct first move is instead to check the ARP cache for the target host's MAC address before anything else.

### 30.

Amazon S3, Azure Blob Storage and Google Cloud Storage are vendor names for which underlying service category?

- **A.** Block storage, the category backing virtual machine boot disks.
- **B.** Object storage, the category behind buckets and HTTP-addressable blobs.
- **C.** Managed relational database, the category behind SQL-compatible engines.
- **D.** Identity and access management, the category behind users, roles and policies.

### 31.

A canary release and an A/B test both split traffic between two versions of a service. What separates the two?

- **A.** Nothing meaningfully separates them, since a canary release is simply the name engineers use for an A/B test conducted against live production infrastructure rather than against a test environment of its own.
- **B.** A canary splits traffic gradually over time, while an A/B test always switches every user at once in a single cutover.
- **C.** A canary's traffic split is chosen deliberately, while an A/B test's split is only a side effect of replacing instances in batches.
- **D.** A canary asks whether a new build is defective and is expected to reach every user; an A/B test tests a hypothesis with two variant implementations and is expected to end with one of them discarded.

### 32.

A user with correctly configured SSH keys is unexpectedly prompted for a password every time they connect, though the same key worked on another server. Their home directory on this server is world-writable. What is the likely cause?

- **A.** The public key was never actually copied to this server at all, since a working key on one server has no bearing on whether it was installed on another.
- **B.** The server's host key has changed since the last connection, which is what triggers SSH to silently fall back to password authentication instead of raising a warning.
- **C.** SSH refuses key authentication silently if permissions are too open — `~/.ssh` should be 700 and `authorized_keys` 600, and a world-writable home directory alone can cause a fall back to password prompts.
- **D.** The remote server is using the legacy SCP protocol instead of SFTP underneath, which is what causes key authentication to be silently skipped for logins.

### 33.

Logged in as root, an operator runs `cd ~` and lands in `/root`. Logged in as an ordinary user named priya, the same bare command lands somewhere else. What determines where `cd ~` goes?

- **A.** The hostname of the machine, since `~` is a per-host shorthand
- **B.** The permissions on `/root`, which redirect unprivileged users elsewhere automatically
- **C.** The value of `$HOME` for whichever account is running the shell
- **D.** Whichever directory the shell most recently visited

### 34.

A user on a hostile wireless access point clicks through a certificate warning rather than cancelling the connection. What does that click actually let an on-path attacker do?

- **A.** Nothing further, since TLS encryption remains effective regardless of whether the certificate warning was heeded, because the session keys are agreed before any certificate is presented and cannot be read by a relay.
- **B.** Present its own certificate as if it were the real server, relay traffic in both directions, and read everything in between.
- **C.** Exhaust the connection's available bandwidth, denying the user service entirely.
- **D.** Install a rootkit on the user's device without any further action required.

### 35.

A RACI matrix lists three people as Responsible for one activity and two people as Accountable for it. What is wrong with that assignment?

- **A.** Exactly one person is conventionally Accountable per activity, though several may be Responsible; two Accountable owners is the malformed part.
- **B.** Nothing — RACI allows any number of people to hold each of the four roles for a given activity, since spreading accountability is generally considered good governance.
- **C.** The problem is having three Responsible people, since only one person may ever do the actual work.
- **D.** The problem is that Consulted and Informed roles are missing from the assignment entirely.

### 36.

An administrator needs to know exactly which files a locally installed package placed on the filesystem, using the installed package database rather than inspecting the original archive. Which command answers that?

- **A.** `dpkg -l nginx` run to list installed packages and their status
- **B.** `apt update` run first, since refreshing the index also reports installed file locations
- **C.** `dpkg -L nginx` run against the local package database
- **D.** `getent passwd nginx` run, treating the package name as an account to look up

### 37.

An application built on a managed database experiences repeated slow queries caused by a missing index. The team assumes the provider will fix it since the database is 'managed.' Is that assumption correct?

- **A.** No — 'managed' takes over installation, patching, backup mechanics and failover, but schema design, indexes and query efficiency remain the customer's responsibility.
- **B.** Yes — 'managed' means the provider assumes full responsibility for the database's behaviour, including the performance of the queries it runs and the indexes chosen to support them.
- **C.** Yes, because managed services provide the same automatic runtime optimisation PaaS platforms apply to deployed code.
- **D.** No, because this is actually a shared responsibility model failure specific to IaaS, not to managed services.

### 38.

What is the behavioural difference between reading from `/dev/null` and reading from `/dev/zero`?

- **A.** They behave identically — both are general-purpose discards for anything written to them
- **B.** `/dev/null` returns end-of-file immediately on read; `/dev/zero` returns an endless stream of zero bytes
- **C.** `/dev/null` is a block device and `/dev/zero` is a character device
- **D.** `/dev/zero` requires root to read from, while `/dev/null` does not — the endless stream it produces is treated as a privileged resource and its node is created mode 0600

### 39.

Monitoring dashboards for a service are in place and green, yet an operator cannot explain a new failure mode nobody anticipated when writing the dashboards. Why can monitoring be in place and the system still be poorly observable?

- **A.** It cannot happen this way, since a system with monitoring already in place is observable by definition once signals are being collected continuously and displayed on a dashboard someone is watching.
- **B.** Because alerting was not configured to interrupt anyone the moment the dashboards would otherwise have turned green.
- **C.** Observability is simply a synonym for having more dashboards deployed than the ones the team already built.
- **D.** Monitoring reports on signals chosen in advance, while observability is what lets an operator answer a question nobody thought to ask before the incident, without shipping new instrumentation.

### 40.

`free -h` shows very little in the "free" column, and an operator concludes the system is nearly out of memory. Which column should actually be read, and why is "free" misleading?

- **A.** "available," because the kernel deliberately uses idle memory as reclaimable page cache
- **B.** "free" is correct as read, and a low value always means the system is memory-starved
- **C.** "buff/cache," because it reports memory reserved exclusively for running applications
- **D.** None of the columns matter; only `top`'s live view reflects real memory pressure, because `free` reads cached totals rather than the live kernel counters

### 41.

A company subscribes to a SaaS product, signs in, and an employee later shares a report link publicly by mistake, exposing customer data. Who is responsible for the misconfiguration?

- **A.** The provider — SaaS means the provider is responsible for security end to end, including how customers choose to share the data they upload, which is why the incident is the vendor's to answer for.
- **B.** The provider — since SaaS, unlike PaaS, gives the customer no configuration surface to misuse in the first place.
- **C.** The customer — sharing settings, access rights and what users upload remain the customer's responsibility even though the provider runs and patches the application.
- **D.** Neither — public exposure of a shared link is covered by the provider's published SLA, which indemnifies both parties.

### 42.

An attacker who phished a low-privilege credential then exploits a writable service unit to obtain a root shell on the same host. Is the exploit itself the way the attacker got in?

- **A.** Yes, since gaining root through the writable unit is itself the moment initial access occurred.
- **B.** This describes horizontal escalation, since the attacker moved to a peer account rather than upward, and a root shell reached from an ordinary user account counts as sideways whenever one host is involved.
- **C.** No. It is a post-access step; the phished credential was the way in, and the writable service unit is what turned that limited access into more.
- **D.** This is denial of service, since the writable service unit was used to disrupt the host.

### 43.

An administrator needs to create a `deploy` group, remove an old `contractors` group that is no longer needed, and add an existing user to `deploy` without disturbing any group memberships that user already has. Which three commands do this?

- **A.** The same two group commands, but dropping the `a` so it reads `usermod -G deploy alice`
- **B.** Reaching for the account-management pair `useradd deploy` and `userdel contractors` before the same `usermod -aG` step
- **C.** `groupadd deploy`, `groupdel contractors`, and `usermod -aG deploy alice`
- **D.** Lower-casing the last step to `usermod -g deploy alice` while keeping the two group commands as written

### 44.

A colleague claims 'CentOS Stream is just CentOS Linux under a new name, still safe to treat as a fixed, stable release.' What is wrong with that claim?

- **A.** CentOS Stream is a rolling preview of upcoming RHEL, not a continuation of the discontinued, fixed-release CentOS Linux; Rocky Linux is the actual fixed-release replacement.
- **B.** Nothing is wrong — both are Red Hat family distributions sharing the same `dnf` package manager and `.rpm` format, so the naming difference carries no practical operational weight at all.
- **C.** The claim is wrong only about the package manager, since CentOS Stream switched to `apt` at some point during its development.
- **D.** The claim is essentially correct; 'Stream' only refers to a faster update channel within that same fixed-release product line.

### 45.

A security reviewer will never use the system being built but has the authority to block its release. Is she a stakeholder?

- **A.** No, because stakeholders are defined as people who will use or directly benefit from the delivered system, which by that reading would exclude reviewers, auditors and anyone outside the delivery team.
- **B.** Only once she is formally added to the project's communication plan.
- **C.** Only if she is assigned one of the four roles in the project's RACI matrix.
- **D.** Yes. A stakeholder is anyone affected by the project or able to affect it, and the ability to block release satisfies that on its own.

### 46.

`lsblk` shows a disk and `df -h` shows nothing for it at all, though `fdisk -l` confirms a partition exists on it. What is the most likely explanation?

- **A.** The partition table must be corrupted, since a real partition should always appear in `df`
- **B.** The partition has no filesystem on it yet — it is invisible to `df` and cannot be mounted until formatted
- **C.** The partition is mounted read-only, which hides it from `df -h` — `df` skips any filesystem it cannot write its temporary probe file to
- **D.** `lsblk` and `fdisk -l` are reporting on two different disks by coincidence

### 47.

A private subnet's resources reach a managed object storage service through a NAT gateway to the service's public endpoint, incurring internet egress charges along the way. What alternative removes both the NAT hop and the public routing?

- **A.** A private service endpoint — it connects the subnet to the service as if it were inside the network, needing no internet gateway, NAT device, or public IP address.
- **B.** A peering connection to the provider's own network hosting the storage service.
- **C.** A larger NAT gateway sized to handle the additional egress traffic.
- **D.** Assigning the resources public IP addresses so they can reach the service directly, treating a public address as equivalent to a private connection that never leaves the provider's network.

### 48.

A repository has commits on both `main` and an unmerged feature branch. From `main`, which command shows only the commits reachable from where you currently are, correctly omitting the feature branch's commits?

- **A.** `git log --all`, since only the `--all` flag limits output to the current branch
- **B.** `git status`, since it reports which branch is currently checked out along with its history
- **C.** A bare `git log`, which walks the parent chain backwards from HEAD
- **D.** `git diff main feature`, since comparing the two branches shows which commits are unique to each

### 49.

A team relies on a mirrored RAID 1 array and treats it as their backup strategy. An operator accidentally deletes a critical directory. What does the mirror do?

- **A.** It protects the directory, since RAID 1 keeps an independent second copy — mirrors resynchronise on a schedule rather than on every write, so the deletion has not reached the second drive yet
- **B.** It faithfully mirrors the deletion to the second drive just as quickly as any other write, so RAID alone does not recover the directory
- **C.** It automatically preserves a prior version of the directory before the deletion, since mirrors are point-in-time
- **D.** It depends on which RAID controller is used, since some controllers block destructive commands

### 50.

A site serves malware over a connection with a perfectly valid, correctly configured TLS certificate. What does the padlock in the browser actually indicate in this case?

- **A.** That the site has passed a security review and its content has been scanned for malware.
- **B.** That the connection is immune to man-in-the-middle interception for the rest of the session, when the padlock only reflects the current handshake and says nothing about interception risk for the remainder of the session.
- **C.** An authenticated, encrypted channel to the named host, and nothing about whether the content served over it is safe or the operator is trustworthy.
- **D.** That the server is running the current TLS 1.3 protocol version rather than an older one.

### 51.

A company wants to redistribute a modified version of the Linux kernel as part of a commercial appliance. What does GPLv2 require of them?

- **A.** The redistributed derivative must also be licensed under GPLv2, and the corresponding source code must be made available to recipients.
- **B.** Nothing — GPLv2 permits silent commercial redistribution with no source obligation attached whatsoever, unlike stricter copyleft licenses.
- **C.** They must switch the derivative to a permissive license before selling it, since GPLv2 forbids commercial use outright by design.
- **D.** They must contribute the change back to the upstream kernel project before shipping the appliance at all.

### 52.

`ls -ld /srv/scratch` shows `drwxrwxr-T`. What does the capital `T` indicate, compared to a lowercase `t`?

- **A.** The capital letter means the sticky bit is somehow "stronger" than lowercase
- **B.** It means the setgid bit is active in addition to the sticky bit
- **C.** The sticky bit is set, but other-execute is not, so the directory is untraversable by anyone outside owner and group
- **D.** It is a typo in the output and should be read as lowercase `t` — `ls` prints the flag in uppercase only when its output is not going to a terminal

### 53.

An engineer wants to change a subnet from private to public on AWS and looks for a checkbox on the subnet labelled 'public'. What should they do instead, and why doesn't such a setting exist?

- **A.** Attach a NAT gateway to the subnet, since that is the resource that grants outbound reachability, and outbound reachability is the property AWS's own documentation associates with becoming publicly reachable.
- **B.** Edit the local route that covers the network's own address range.
- **C.** Because 'public' and 'private' describe which route table a subnet is associated with, not a flag on the subnet itself, associate its route table with a route to an internet gateway.
- **D.** Assign the instances in the subnet public IP addresses; that alone makes the subnet public.

### 54.

A reviewer asks a migration project 'which of your plan items can slip without moving the end date?' The team can't answer from its work breakdown structure. Why not, and where does the answer actually come from?

- **A.** The work breakdown structure does contain dates, but they were left blank in this case by mistake.
- **B.** It can't answer scheduling questions because it only lists who is responsible for each task, not what the tasks actually are or how they relate to one another across the whole deliverable.
- **C.** The work breakdown structure has no time axis, durations or dependency arrows by design; the answer comes from the schedule built on top of it, specifically the critical path.
- **D.** The answer comes from the team's velocity, which shows how much slack the team has each Sprint.

### 55.

You're confident you know how to restart the production database and that doing so would fix the fault, but your role does not authorise changes to production databases. What should you do?

- **A.** Apply the fix yourself, since asking for permission only wastes the time escalation would take.
- **B.** Reproduce the fault one more time to be certain before doing anything else.
- **C.** Restart the method from identification, since a fix you may not apply means one of the earlier steps must have produced the wrong theory.
- **D.** Escalate, handing over the symptom, established scope, what changed recently, and the theories already tested.

### 56.

A colleague copies a teammate's project folder over the network, but deliberately skips the hidden `.git` directory because it "just holds settings." What did the copy actually lose?

- **A.** Only the remote URL, since `git remote -v` reads its output from `.git/config`.
- **B.** Nothing important, since running `git clone` again later can regenerate `.git` from the working files as long as the directory structure is unchanged
- **C.** Only the `.gitignore` patterns, since those are the settings the colleague meant to skip
- **D.** Every commit, branch and tag, since the repository itself lives entirely inside `.git`, leaving only the checked-out files behind.

### 57.

An intrusion occurred in March but was not discovered until a security review in July. When does GDPR's 72-hour notification clock start?

- **A.** In March, when the intrusion actually happened, regardless of when anyone noticed it.
- **B.** It does not start at all, since a breach discovered outside the data's retention window carries no notification duty, regardless of how the breach itself came to light.
- **C.** In July, on becoming aware of the breach — the deadline is to notify from that point, not to have finished remediating the March intrusion.
- **D.** In July, but only if the affected data was found in a backup rather than in the production system.

### 58.

`which mycmd` reports nothing found, but typing `mycmd` at the prompt runs successfully. Which command would reveal what `mycmd` actually is, including cases `which` cannot see?

- **A.** `which -a mycmd`, since adding `-a` extends `which` to also search shell builtins and aliases directly.
- **B.** `echo $PATH`, since reading the full search list would reveal exactly where `mycmd` is hiding on disk.
- **C.** Nothing else needs checking here — `which` finding nothing means `mycmd` does not actually exist as any kind of runnable command at all, in any form.
- **D.** `type mycmd`, which reports how a name would be interpreted — builtin, alias, function, or file — seeing categories the external `which` cannot.

### 59.

A design keeps two application servers on independent power feeds in separate racks, but nothing watches them and nothing redirects traffic if one goes down. Is the arrangement highly available?

- **A.** Yes — duplicate hardware placed in separate failure domains is what the term names.
- **B.** No. Redundancy is only one of the two required ingredients; nothing detects a failure or moves traffic away from it.
- **C.** Yes, provided the two servers are also stateless, since statelessness is what makes availability possible.
- **D.** No, and no amount of automatic failover fixes it either, because true high availability requires zero user-visible interruption.

### 60.

`free -h` on the host shows plenty of available memory, but a process inside one container was OOM-killed. How is that possible, and how do you confirm it?

- **A.** The disk backing swap was full, not the memory itself, which is a separate condition from a cgroup limit being reached.
- **B.** It cannot happen — a healthy `free -h` output measured on the host itself rules out any OOM kill anywhere on that machine.
- **C.** The container's process lacked permission to allocate memory under its cgroup policy, and that restriction surfaces to the process as a kill.
- **D.** The kill was against the container's own cgroup memory limit, not the host total; the kernel message names a memory cgroup rather than system-wide exhaustion.

