<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 11

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-11-answers.md](exam-11-answers.md)

---

### 1.

An organisation patches monthly and has no way for an actively exploited vulnerability to bypass that schedule. What is missing from their patch cadence?

- **A.** An expedited path — a cadence with no emergency route leaves an actively exploited vulnerability waiting for the calendar.
- **B.** An inventory of patchable assets, since cadence is one decision inside the whole tracking-testing-applying-verifying practice.
- **C.** A defined maintenance window for the monthly cycle.
- **D.** Nothing — a monthly schedule with no exception path is still a complete cadence.

### 2.

A backup plan assigns resources by tag, sets a retention period, and moves older copies to cheaper storage on a lifecycle schedule. What is still missing before it can be called a working recovery capability?

- **A.** Nothing — a correctly configured backup plan with retention and lifecycle rules is definitionally complete.
- **B.** A consistent tag key, since resources tagged inconsistently will silently drop out of the plan.
- **C.** An audit log entry recording who created the backup plan, which is treated as sufficient proof on its own that the data the plan protects can actually be restored.
- **D.** A restore that has actually been exercised — an untested restore path is an assumption, not a recovery capability, regardless of how the plan is configured.

### 3.

An operator defines `alias ll='ls -alF'` directly at the prompt, uses it successfully for the rest of the session, then opens a brand-new terminal the next day and finds `ll` is gone. What was missing?

- **A.** Aliases automatically expire after 24 hours regardless of where they are defined
- **B.** The new terminal was opened as a different user, which does not share aliases
- **C.** The alias was never written to a startup file, so it did not persist past that one session
- **D.** `ll` collides with a built-in command name, and the shell silently drops any alias that would shadow a builtin

### 4.

Litigation becomes reasonably anticipated over a dataset that is simultaneously past its retention schedule’s maximum and the subject of an active GDPR erasure request. What governs the data now?

- **A.** The erasure request, because a data subject’s Article 17 rights take precedence over any internal concern the organisation may have about litigation that has not actually been filed yet.
- **B.** A preservation hold for the anticipated litigation, because Article 17(3)(e) disapplies erasure where processing is necessary to establish, exercise or defend legal claims.
- **C.** The retention schedule’s maximum, because it was reached first and nothing may extend a schedule once its stated ceiling has arrived for that category of data.
- **D.** The Clear, Purge or Destroy disposal framework, because the data is now past its stated maximum and has therefore fallen due for verified sanitisation.

### 5.

A cluster loses its control plane for ten minutes because of a networking issue. Do applications already running on healthy nodes stop serving traffic?

- **A.** Yes, every pod in the cluster stops immediately, since the control plane is required continuously for any container to keep running.
- **B.** No, pods already running on healthy nodes keep serving; what stops is new scheduling, updates, and any other change to cluster state.
- **C.** Yes, but only pods managed by a Deployment stop, while bare pods created directly keep running unaffected.
- **D.** No, but only Services stop resolving names while the pods behind them keep running unaffected.

### 6.

A test team already ran system testing against the specification. During UAT, the same testers re-run the identical scripts at the users' own desks. What has been wasted?

- **A.** The one check meant to catch a wrong specification — real users exercising their own work instead of re-verifying conformance.
- **B.** The specification's traceability, since re-running scripts breaks the link between requirement and test.
- **C.** Nothing measurable — repeating verification twice is simply extra assurance, not a waste.
- **D.** Nothing — UAT is meant to be a second pass confirming the test team's results.

### 7.

Per consensus practice, what trade-off does the principle of least astonishment argue for?

- **A.** Optimised, non-standard configurations, since performance should take priority over convention even when the result surprises an operator.
- **B.** Conventional, expected defaults over clever or unusual configurations, because a surprising setup fails badly when nobody has time to read during an incident.
- **C.** Identical configuration across every host regardless of role, so that no two machines of any kind are ever allowed to differ.
- **D.** An enforceable minimum configuration, reviewed and approved centrally, rather than a design preference recognised by convention alone.

### 8.

CloudTrail's Event history has been the only audit configuration in place for over a year. An investigation now needs management events from 120 days ago. What does the team find?

- **A.** The full history going back to the account's creation, since CloudTrail is widely believed to retain management events indefinitely once it is enabled for an account.
- **B.** The events, restored from the account's backup plan alongside the resource data it protects.
- **C.** The events, still visible in the monitoring dashboard's default 120-day metric window.
- **D.** Nothing: Event history retains only the past 90 days of management events per region, and longer retention needs a configured trail or a CloudTrail Lake event data store.

### 9.

A team reverts a bad commit in their configuration repository. What is true immediately afterward?

- **A.** The declaration has changed back; nothing on any host changes until the reverted state is re-applied.
- **B.** The running system is restored to the previous state, as if reverting a commit undid the change on every host that was running it.
- **C.** A restorable snapshot of the affected host has been created automatically, independent of anything recorded in the repository itself.
- **D.** The change has been approved for release, as though editing the repository were itself the independent review step it requires.

### 10.

A deployment script needs to create `/srv/app/logs/2026` in one step, even when `/srv/app/logs` does not exist yet, and must not fail if the full path already exists from a previous run. Which command satisfies both requirements?

- **A.** Running `mkdir -p /srv/app/logs/2026` to create every missing parent in one step
- **B.** Running plain `mkdir /srv/app/logs/2026` without the parents flag, since `mkdir` creates any missing parents whenever the final component is new
- **C.** Running `touch /srv/app/logs/2026` to bring the path into existence
- **D.** Running `cp -r /srv/app/logs /srv/app/logs/2026` to duplicate the parent tree

### 11.

A US-incorporated cloud provider hosts a customer's data in its Frankfurt region. A US law-enforcement request compels the provider to produce that data. What does this illustrate?

- **A.** That the request is automatically unlawful, since data stored anywhere inside the EU is always completely outside the reach of any non-EU jurisdiction's law-enforcement demands, however framed.
- **B.** That the provider has breached GDPR's transfer rules merely by receiving the request.
- **C.** That the customer's contract with the provider determines sovereignty regardless of incorporation or hosting location.
- **D.** That sovereignty follows the operator's own legal exposure as well as the data's physical location, so an EU region does not by itself put the data outside the reach of the provider's home jurisdiction.

### 12.

During failback from a standby that has been serving writes for two days, what must be handled before the primary resumes service?

- **A.** Nothing — the primary holds the authoritative copy by definition.
- **B.** The recovery time objective must be lengthened to permit the switch.
- **C.** The standby's snapshots must be deleted to avoid conflicts.
- **D.** The writes accumulated on the standby must be reconciled onto the primary.

### 13.

A Dockerfile review flags `EXPOSE 8080` and a teammate assumes the service is now reachable on that port. Is that correct?

- **A.** No, `EXPOSE` only documents which port the application listens on; publishing it for outside traffic still requires `-p` at run time.
- **B.** Yes, because `EXPOSE` opens the port on the host the moment the image is built from that Dockerfile.
- **C.** Yes, but only once the image has actually been pushed to a registry that other hosts can reach.
- **D.** No, and the port additionally needs a matching `-e` environment variable set before it becomes reachable That framing invents a dependency between port publishing and environment variables that Docker does not enforce.

### 14.

What decides the correct instance type and size during right sizing, and what does committed-use or reserved pricing do instead?

- **A.** Reserved pricing removes the waste directly and permanently, since committing to a multi-year term is believed to force the workload onto a smaller, better-matched instance automatically.
- **B.** The number of instances currently running, since horizontal scaling and right sizing measure the same underlying quantity.
- **C.** Measured utilisation over a representative period, including peaks, together with a family matched to the actual bottleneck; reserved pricing only discounts the rate, locking in existing waste rather than removing it.
- **D.** Whether the resource is orphaned, since untagged idle resources are what right sizing corrects first.

### 15.

Comparing `rsync -av src/ user@host:/srv/dest/` against the same command with the trailing slash on `src` removed, what is the difference in where the files land?

- **A.** The trailing slash has no effect on rsync; both forms produce identical results
- **B.** Without the slash, rsync refuses to run and reports a syntax error, because a trailing slash on the source is mandatory whenever the destination is remote
- **C.** With the slash, the contents of `src` land directly inside `dest`; without it, a nested `dest/src` is created
- **D.** The slash only affects whether `--delete` is honoured on the destination

### 16.

A company sells discs of a program for $20 each. Every buyer receives the right to run the program for any purpose, study and change its source, and redistribute copies, including modified ones. Does this satisfy the Free Software Foundation's four freedoms?

- **A.** No, because the Free Software Foundation and the Open Source Initiative maintain a single joint list of approved licences, and this vendor's terms were checked against the wrong organisation's separate criteria entirely.
- **B.** No, because charging money for the software directly conflicts with the word "free" in free software.
- **C.** Yes — selling copies is unrestricted; only the enumerated freedoms to run, study, redistribute and modify decide the question, never the price charged.
- **D.** Only if the buyer additionally signs an agreement promising not to resell the discs to anyone else.

### 17.

A database is replicated synchronously to a second data centre. A bad migration script corrupts a table at 09:00. What does replication give you at 09:05?

- **A.** The table as it stood before the migration, held on the replica.
- **B.** A second copy of the corrupted table, available for service.
- **C.** An automatic rollback once the replica detects the inconsistency.
- **D.** Protection, because replication satisfies the off-site requirement of the 3-2-1 rule.

### 18.

A new employee's laptop cannot get online. It shows no IP address at all. A separate report says a colleague's laptop has an address and can ping the gateway, but web pages by name fail while an IP address typed directly still works. Which service is implicated in each case?

- **A.** Both cases implicate DHCP, since DHCP is responsible for issuing addresses and also for resolving the names that web pages depend on.
- **B.** Both cases implicate DNS, since a missing IP address is treated as ultimately a naming failure at a lower layer.
- **C.** The first case implicates DNS, since a missing address is read as evidence the hostname could not be resolved during boot; the second implicates DHCP, since a missing default route is read as evidence the address lease itself never completed.
- **D.** The first case implicates DHCP, since no address means the addressing exchange failed; the second implicates DNS, since an address that works while names do not is DNS's signature, not DHCP's.

### 19.

A developer proposes fixing an injection vulnerability by escaping special characters in the user input before concatenating it into the query. What does OWASP name as the fix that should come first instead?

- **A.** A safe API that never builds the statement by concatenation at all, such as a parameterised query or prepared statement.
- **B.** Escaping is already the primary defence, and parameterised queries are only a supporting measure.
- **C.** Enabling mandatory access control on the database process, which prevents any injected query from executing because the policy labels the query text itself as untrusted before the parser ever sees it.
- **D.** Rate limiting requests to the endpoint that accepts the search term.

### 20.

A cost dashboard exists and its underlying data is technically correct, but nobody has opened it in three months. What does this demonstrate about monitoring on its own?

- **A.** Monitoring is not alerting — a dashboard nobody opens detects nothing, which is why budgets and alerts exist alongside it rather than instead of it.
- **B.** The dashboard's tags must be misconfigured, since a correctly tagged dashboard would have been opened by now.
- **C.** A pricing calculator should replace the dashboard, since estimates need no one to check them.
- **D.** Nothing — the dashboard's data is still being collected correctly, so the organisation is still effectively being warned.

### 21.

A search needs to check every file under `src/` for the string "TODO", not just files directly in that directory. Which option makes `grep` descend into subdirectories?

- **A.** `-r`, recursive search, following symlinks only when named directly on the command line
- **B.** `-n`, since numbering the lines also expands the search into subdirectories
- **C.** No option is needed; `grep` searches subdirectories by default when given a directory
- **D.** `-v`, since inverting the match also inverts the search scope to include subdirectories

### 22.

A statement describes Kubernetes as "governed by the CNCF, which also hosts it." Is that the correct relationship?

- **A.** Yes, since a graduated CNCF project is by definition directly governed by the foundation that hosts it.
- **B.** No, because Kubernetes is not hosted by the CNCF at all, but by the Linux Foundation directly instead.
- **C.** No, the CNCF hosts Kubernetes as a graduated project, but governance rests with Kubernetes' own Steering Committee, an elected body its charter names as the project's governing authority.
- **D.** Yes, and the Steering Committee referenced elsewhere is simply an internal CNCF department with no independent authority, treating hosting and governance as the same relationship rather than two deliberately separated ones.

### 23.

A request to an internal API returns HTTP 502. A junior engineer treats this as the API server itself reporting an error. Is that the right way to read a 502?

- **A.** Yes — any 5xx status code is generated exclusively by the origin application server itself, regardless of whether a proxy or load balancer sits in front of it, because an intermediary is required to pass an upstream status code through untouched.
- **B.** No: 502 is a gateway or proxy reporting a bad or missing answer from the server behind it, not the origin server answering for itself; the investigation should look at the proxy and what lies behind it.
- **C.** No, but only because 502 actually indicates a client-side error, the same category of problem a 4xx status code represents, mislabeled under the 5xx range.
- **D.** Yes, and the fix is always to clear the client's browser cache, since 502 responses are commonly caused by stale cached content on the requesting side.

### 24.

Data is moved to the archive tier to save money, then deleted after 45 days when the project is cancelled early, against a 180-day minimum retention period. What happens to the bill?

- **A.** Nothing extra — early deletion charges are waived once a project is formally cancelled.
- **B.** The data becomes an orphan once the project ends, and is billed at whatever rate applies to orphaned resources until someone notices.
- **C.** The bill simply stops, since deleting data always ends its charges immediately.
- **D.** An early deletion charge applies for the remaining 135 days, which can make the move cost more than leaving the data where it was.

### 25.

A team's change control process has rejected every request submitted to it for the past six months. A stakeholder complains this proves the process is working. What is the flaw in that reasoning, and how would the same six months look if scope creep, not change control, were actually happening?

- **A.** There's no flaw — a change control process exists specifically to say no to requests.
- **B.** A process that only ever rejects is being used as a barrier, not a decision procedure; under creep instead, there would be no rejected requests at all — informal additions would simply accumulate outside the process.
- **C.** The flaw is that six months is too short a period to judge whether change control is functioning.
- **D.** The flaw is that rejected requests should still have moved the project's budget baseline even when refused, so the sponsor can see the cumulative cost of every request ever considered, approved or not, across the whole project.

### 26.

A company's internal hosts, all on private addresses, can browse the internet without issue, but an external partner cannot connect to an internal web server without a separately configured rule. What explains the asymmetry?

- **A.** NAT is configured to allow outbound traffic only as a deliberate security policy decision, actively blocking every inbound connection attempt by design.
- **B.** The internal web server is unreachable because its private address is inherently invalid for any inbound connection, regardless of what NAT rules exist.
- **C.** NAT's translation table is built by outbound traffic; an unsolicited inbound packet has no matching entry and is dropped, so reaching the internal server requires an explicit destination-NAT (port forwarding) rule.
- **D.** The asymmetry is caused by DNS, since the partner's resolver has not yet been updated with the internal server's address.

### 27.

An employee accidentally makes a customer storage bucket public rather than deliberately leaking it. Does the guide's definition of insider threat still cover this case?

- **A.** No, since insider threat only applies when the person acted with deliberate malicious intent.
- **B.** No, because this is properly classified as an attack-surface issue rather than an insider one, since a storage bucket is infrastructure that sits outside the employee's own granted access.
- **C.** No, since only actions taken by permanent employees, not contractors or partners, count as insider threat.
- **D.** Yes. Insider threat covers harm by someone with legitimate access, deliberate or accidental, and a misdirected or misconfigured disclosure is the accidental case named directly.

### 28.

A shell variable `$file` holds the text `my report.txt`. Comparing `rm $file` and `rm "$file"`, what does each actually pass to `rm`?

- **A.** `rm $file` passes two operands, `my` and `report.txt`; `rm "$file"` passes one, `my report.txt`
- **B.** Both forms pass exactly one operand, `my report.txt`, since quoting has no effect on `rm`
- **C.** Both forms fail with a syntax error, since a space inside a variable's value is never allowed unless it is escaped with a backslash first
- **D.** `rm $file` passes one operand and `rm "$file"` passes two, because the quotes are themselves passed along as a second argument

### 29.

A server does not respond to `ping`, and an operator immediately reports it as down. TCP services on the same host, tested separately, work perfectly. What does this combination actually show, and what should the operator have concluded first?

- **A.** It shows the host is genuinely down, since a working TCP connection to the same address without a working ping is a technical impossibility on any real network, because a TCP handshake cannot complete until the same host has already answered an ICMP echo request.
- **B.** It shows DNS is misconfigured for that host, since a failed ping combined with working TCP connections is defined to always indicate a name-resolution problem.
- **C.** It shows ICMP is being filtered or the host is configured not to answer echo requests; the host is clearly up, so "ping fails, therefore the host is down" is the wrong conclusion.
- **D.** It shows the host's routing table is broken, since only a routing failure could explain ICMP failing while TCP traffic to the very same address succeeds.

### 30.

An autoscaling group adds instances under load on Friday afternoon and removes them again over the weekend when traffic drops. Which essential characteristic does the weekend shrink specifically demonstrate?

- **A.** Measured service — the bill only reflects instances actually running over the weekend.
- **B.** On-demand self-service — the system responds to demand without a human placing a request.
- **C.** Rapid elasticity, since capacity scales inward as well as outward to match demand.
- **D.** Resource pooling — many customers share the underlying hardware the instances run on.

### 31.

A team routes one percent of traffic to a new version, measures nothing about how it behaves, and widens the share on a fixed weekly schedule regardless of what happened. What is missing from this practice?

- **A.** The all-at-once cutover, since a canary release is only complete once every user has been switched over simultaneously at a single point.
- **B.** A fixed batch schedule, since instances should be replaced in equal-sized groups rather than by adjusting a traffic percentage.
- **C.** Nothing is actually missing here, provided the deployment mechanism itself is fully automated end to end.
- **D.** The evidence, because a canary that nobody is measuring is a slow rollout with extra steps, since the entire value is in what the small slice reveals.

### 32.

An administrator generates a key pair with `ssh-keygen` and then needs to enable key-based login to a remote server. Which file gets copied to the server, and with which command?

- **A.** The private key file — using `scp`, so that the server holds the same secret material the client uses to authenticate itself.
- **B.** Both the public and private key files — using `sftp`, so the server has a complete, matching copy of the client's key pair on file and can verify a login against either half of it.
- **C.** Neither key file — `ssh-copy-id` instead generates a brand-new key pair directly on the remote server during the copy process.
- **D.** Only the public key file — using `ssh-copy-id`, which logs in with an existing method and appends the public key to the remote `~/.ssh/authorized_keys`.

### 33.

An instruction says to "change to root's home directory." A junior operator runs `cd /home/root` and gets "No such file or directory." Comparing the root directory, `/root`, and a regular user's home shows why the instruction was misread. Where should they actually go, and why does `/home/root` not exist?

- **A.** `cd /`; "root's home" and "the root directory" name the same place, since the superuser's account is rooted at the top of the tree
- **B.** `cd ~root`; the tilde form is required because `/root` is not a real path
- **C.** `cd /home`; regular users and the superuser share one parent directory
- **D.** `cd /root`; the FHS deliberately places the superuser's home outside `/home`

### 34.

A team wants a system that can actually drop malicious packets, not just alert on them. What placement decision does that requirement force, and what is the operational trade-off it carries?

- **A.** The system can stay on a passive tap or mirrored port and still block traffic once it detects it, when blocking traffic requires sitting inline on the path itself, which a passive tap or mirrored port position cannot provide however good the detection is.
- **B.** The placement decision only matters for host-based deployments, not for network-based ones.
- **C.** The system should instead be deployed as a vulnerability scanner, since scanners can already block traffic once a weakness is found.
- **D.** The system must sit inline in the traffic path to be able to drop packets, and that placement means a false positive drops legitimate traffic too.

### 35.

Which single feature distinguishes a Gantt chart from a work breakdown structure?

- **A.** The Gantt chart shows what work is in scope, while the work breakdown structure shows when it happens, since one lists tasks and the other arranges them on a calendar.
- **B.** Detail level — a Gantt chart is simply a more detailed version of the same hierarchy the work breakdown structure shows.
- **C.** The time axis, since a Gantt chart plots tasks against dates and shows durations and dependencies, which the work breakdown structure has none of.
- **D.** The Gantt chart shows the critical path, while the work breakdown structure shows every possible path through the schedule.

### 36.

A vendor `.deb` file is installed with `dpkg -i tool_1.0_amd64.deb` and it fails because a required library is missing. What state is the package left in, and what fixes it?

- **A.** Cleanly rolled back to its pre-install state, as if the command had never been run
- **B.** Unpacked but unconfigured, blocking further operations until `apt --fix-broken install` resolves the missing dependency
- **C.** Refused outright with nothing unpacked, the same behaviour `rpm -i` would show — `dpkg` checks every dependency before it extracts any file
- **D.** Fully installed and working, since `dpkg` silently substitutes a compatible library

### 37.

A team connects to a provider-operated relational database through its normal wire protocol, configuring schema, indexes and access grants, but deploying no application code onto the database itself. Is this PaaS, and what is the deciding fact?

- **A.** Yes — since the provider handles installation, patching and scaling, this meets the definition of PaaS regardless of what is deployed.
- **B.** No — it is a managed service; the deciding fact is whose code is running, and nothing of the team's is deployed onto the database.
- **C.** No, because managed services are never provider-operated components, only self-hosted ones the customer configures remotely.
- **D.** Yes, because NIST SP 800-145 names managed services as a fourth service model alongside IaaS, PaaS and SaaS.

### 38.

An `/etc/fstab` line references `/dev/sdb1` directly rather than a UUID. After a hardware change, the machine boots with the wrong filesystem mounted at that entry's mount point. Why?

- **A.** Kernel device names are not stable across reboots — which physical disk becomes `/dev/sdb` depends on enumeration order
- **B.** `/dev/sdb1` should always refer to the same physical disk once assigned, so this points to a filesystem corruption problem instead
- **C.** The partition table itself must have become corrupted during the hardware change
- **D.** `/etc/fstab` entries expire after a hardware change and must be manually renewed

### 39.

A developer runs `git commit -m "Add retry to the upload path"` and immediately tells a colleague, "it's done, you should see it now." The colleague pulls and sees nothing new. What is missing from that claim, and which command block on this concept explains it?

- **A.** The commit only recorded a snapshot in the local repository; making it visible to a colleague requires the separate act of pushing it to a shared remote.
- **B.** Nothing is missing; committing in Git publishes the change the same way it would in a centralized system such as Subversion, where the working copy and the server share one history.
- **C.** The commit message was too short for the colleague's client to notice a new commit arrived.
- **D.** The colleague needed to run `git fetch` twice before a single commit becomes visible.

### 40.

A process refuses to exit after a plain `kill 4821`. What did the default signal actually do, and what is the next escalation if the process keeps ignoring it?

- **A.** The default already sends SIGKILL, so nothing stronger is available, and `-9` is just an older spelling of that same default signal
- **B.** `kill` requires a process name, not a PID, so `4821` was rejected outright
- **C.** The default sends SIGTERM, which the process can catch and ignore; `kill -9` sends SIGKILL, which it cannot
- **D.** A process stuck in uninterruptible I/O always responds to `kill -9` within seconds

### 41.

A finance director assumes moving a steady, predictable, high-volume workload to public cloud will automatically cut costs. Is that assumption safe?

- **A.** Yes — public cloud infrastructure is always cheaper than owning equivalent hardware, because providers buy at a scale no single customer can match.
- **B.** No — steady workloads should run on private cloud instead, since private cloud is always the cheaper deployment model.
- **C.** No — public cloud's advantage is elasticity and speed, and steady, predictable, high-volume workloads can be cheaper on owned hardware.
- **D.** Yes, because public cloud eliminates capital expenditure for any workload shape, and operating expense is always the cheaper of the two.

### 42.

A TLS 1.3 handshake performs an ephemeral Diffie-Hellman key exchange and a certificate-based signature over that handshake, and then switches to a different kind of cryptography for the actual application data. Why does the protocol switch rather than using one kind throughout?

- **A.** It switches because asymmetric encryption is strictly stronger and the handshake only needs the weaker symmetric form for routine traffic.
- **B.** It switches because symmetric cryptography is what proves the server's identity, while asymmetric only ever protects confidentiality.
- **C.** Asymmetric cryptography authenticates the peer and agrees a fresh key without a pre-shared secret; symmetric cryptography is fast enough to carry the bulk traffic that follows.
- **D.** It switches because hashing replaces asymmetric cryptography once the handshake completes, since hashing is faster still and a digest of the traffic keys is all the record layer needs to keep the channel confidential afterwards.

### 43.

A new hire needs to read and write files shared by the `developers` team without gaining a separate login of their own. Which two concepts does the fix combine?

- **A.** A second user account named `developers`, sharing its UID with every team member
- **B.** A service account created for the `developers` team so nobody needs an interactive login
- **C.** A `sudoers` rule granting the new hire root on the shared files — `/etc/sudoers` is where per-directory sharing grants are recorded, so no group is needed
- **D.** A group named `developers`, granting the permission once, and the user account being added as a member of it

### 44.

Given `ID=fedora` in a system's `/etc/os-release`, which package manager and package format should be expected?

- **A.** `apt`, using `.deb` packages, since Fedora is commonly assumed to follow the same lineage as Ubuntu.
- **B.** `dnf`, using `.rpm` packages, since Fedora belongs to the Red Hat family.
- **C.** `zypper`, using `.rpm` packages, since Fedora and openSUSE are both `.rpm`-based.
- **D.** Whichever manager the administrator prefers, since package format is a matter of local configuration rather than distribution identity.

### 45.

A Sprint is due to end Friday, but the team asks the Product Owner for three extra days to finish the last item. What has this request actually done to the Sprint?

- **A.** Broken the one property a Sprint exists to provide, namely a fixed length inside which forecasting from past Sprints stays meaningful.
- **B.** Nothing significant — a short extension to finish committed work is a normal, expected part of Sprint discipline, and treating it otherwise would make the framework needlessly rigid.
- **C.** Merged the Sprint Review into the following Sprint's planning session.
- **D.** Invalidated the team's velocity figure for every Sprint that follows.

### 46.

A disk uses the older MBR partitioning scheme. What are its two defining limits compared with GPT?

- **A.** At most four partitions total, including logical ones, and no maximum disk size at all
- **B.** At most four primary partitions, and a maximum disk size of roughly 2 TiB
- **C.** No limit on partition count, but a maximum disk size of roughly 2 TiB
- **D.** At most four primary partitions, with no size limit, since size limits belong to the filesystem type rather than the partition table

### 47.

A route table carries a route to a peering connection for a narrow slice of address space, and a broader default route to an internet gateway. A packet is addressed inside that narrow slice. Which route wins?

- **A.** The default route to the internet gateway, since default routes always take priority as the catch-all.
- **B.** Neither — the subnet's own address range always takes priority over any listed route.
- **C.** The route to the peering connection, because matching is by most specific prefix first, and it matches more precisely than the default route.
- **D.** The peering connection is unreachable regardless of the route, since peering requires non-overlapping ranges first.

### 48.

A config file containing an API key was committed and pushed weeks ago. Someone notices and adds the file's name to `.gitignore` to fix it. Does that remove the key from the project's history?

- **A.** Yes — once a path is listed in `.gitignore`, Git removes it from every existing commit that mentions it, including copies already fetched into other collaborators' clones on other machines.
- **B.** Yes, but only after the next `git commit` is made, which silently prunes ignored paths from history
- **C.** No, and the fix is to run `git reset` on the repository to erase the file's history entirely
- **D.** No. `.gitignore` only affects files Git does not yet track; a file already committed keeps its history and stays in every clone taken since, so the credential must be rotated instead.

### 49.

A system needs to survive the loss of any one drive while maximising usable capacity from four drives. Which RAID level fits, and how many drives does it need at minimum?

- **A.** RAID 0, since striping across four drives gives the largest usable capacity of any option
- **B.** RAID 1, since mirroring is the simplest way to survive a drive failure
- **C.** RAID 10, since striping across mirrored pairs also survives the loss of any one drive
- **D.** RAID 5, needing at least three drives and giving the capacity of all but one

### 50.

An engineer trained on LFS200 refers to a service's "SSL certificate" and proposes enabling "SSL" for a new internal API. What is wrong with the terminology, and does it matter for the traffic described?

- **A.** Nothing is wrong; SSL and TLS are simply two names in current use for the identical current protocol.
- **B.** SSL is TLS's obsolete predecessor and must not be enabled; the object commonly called an "SSL certificate" is an X.509 certificate used by TLS, which is what should be configured instead.
- **C.** The terminology only matters for web traffic; an internal API that is not HTTP can safely use SSL, because SSL and TLS diverge only at the HTTP layer and share an identical record format below it.
- **D.** The terminology is fine because TLS is a transport protocol that replaced TCP for encrypted connections.

### 51.

Under exactly which license terms is the Linux kernel released?

- **A.** MIT, chosen specifically to make commercial redistribution far simpler for vendors than the copyleft terms of the GPL would otherwise allow.
- **B.** GPLv2 or later, matching the clause used by most other GNU Project software packages and tools.
- **C.** GPLv2 only — not 'GPLv2 or later' — which is why the exact clause is worth holding separately from other GPL-licensed software.
- **D.** Whatever license the distribution packaging it chooses to apply on top of it during packaging.

### 52.

`/tmp` is world-writable, `drwxrwxrwt`. Name every party who may still delete or rename a file inside it that they do not own.

- **A.** Only the file's owner — write permission on the directory does not matter once the sticky bit is set
- **B.** Any user with write permission on the directory, since the sticky bit only affects renaming, not deletion
- **C.** Only a privileged process, since `/tmp` is meant to be fully protected from ordinary users
- **D.** The file's owner, the directory's owner, and a privileged process — nobody else

### 53.

A topology places a public NAT gateway inside the private subnet it is meant to serve, reasoning that keeping it close to the resources is simplest. What is wrong with that placement?

- **A.** Nothing — a NAT gateway works from either a public or a private subnet as long as it has an internal route.
- **B.** A public NAT gateway must sit in a public subnet, with an Elastic IP, and route the private subnets' traffic to it from there; placing it in the private subnet it serves inverts the intended layout.
- **C.** Nothing is wrong with the gateway; the real problem is that the subnet was never reclassified as public first, and reclassifying it would supposedly move the gateway to a valid location automatically.
- **D.** Nothing is wrong with the placement; a security group rule should be added instead to fix reachability.

### 54.

A vendor must deliver a fixed scope specified in a signed regulatory contract, with no tolerance for redesign once implementation begins. Which sequencing approach does that cue point to, and why?

- **A.** Agile — because welcoming change even late in development reduces the vendor's regulatory exposure.
- **B.** Waterfall, since its main cost is expensive late change, which a genuinely fixed, stable scope has already ruled out.
- **C.** Neither — a signed contract replaces the need for any sequencing methodology at all.
- **D.** Agile, since any modern project should default to iterative delivery regardless of how fixed the scope is, because iteration is now widely treated as the safer default choice for almost any kind of work.

### 55.

A unit has been failing intermittently since this morning's boot. Which single combination narrows the journal to just this unit's own errors and worse, for the current boot?

- **A.** Follow the log live with `tail -f` on /var/log/syslog and wait for the next failure.
- **B.** Run `systemctl status <unit>`, which lists the unit's recent journal lines alongside its load state, active state and the exit code of its last run.
- **C.** Combine the unit filter `journalctl -u` with the priority filter `journalctl -p err`, both restricted to this boot.
- **D.** Run `journalctl -p err` alone, without a unit filter, since a single priority level shows only that unit's errors.

### 56.

A new project directory exists with no version history yet, and no other copy of it exists anywhere to copy from. Which command starts tracking it under Git?

- **A.** `git init`, run inside the directory, to create an empty `.git` directory with no commits and no remote
- **B.** `git clone` pointed at the directory itself, to bring it under version control
- **C.** `git add` on every file, since staging is what begins tracking a project
- **D.** Creating a remote repository on a hosting platform first, then pulling it down locally with `git clone` once the platform has finished provisioning it

### 57.

A seven-year-old customer record is deleted from production under a seven-year retention rule, but a copy still exists in a nightly backup set with a ninety-day expiry. When does that record actually cease to exist?

- **A.** Immediately — deleting the production copy satisfies the retention obligation regardless of what any backups retain, since backups are not considered part of the same dataset.
- **B.** Ninety days later, when the backup set's own expiry ages the copy out — surgical deletion inside backup sets is generally infeasible, so the backup's expiry is the record's real end of life.
- **C.** Never, since a legal hold automatically attaches to any record once it leaves production and enters a backup set.
- **D.** Immediately, provided the production deletion used a Purge-category sanitisation technique rather than an ordinary delete.

### 58.

A program was just installed to `/opt/tool/bin/tool`, but typing `tool` reports 'command not found' even though the file exists and is executable. What is the most likely cause, and what confirms it?

- **A.** The file must actually be corrupted, since `which tool` reporting nothing found always means the binary itself is broken somehow.
- **B.** `/opt/tool/bin` is missing from PATH; `echo $PATH` would show the directory absent, and PATH is searched left to right for the first match on a bare command name.
- **C.** The shell needs to be restarted entirely, since PATH is believed to be fixed permanently at login time and never re-read afterward at all, under any circumstances whatsoever.
- **D.** PATH is searched right to left, so a later directory's match should have been found first regardless of the order it was listed in.

### 59.

A quorum-based data store is marketed as fault tolerant because it keeps serving reads and writes as long as a majority of its members are reachable. A network partition then isolates every member from every other at once. What does 'fault tolerant' fail to promise here?

- **A.** Nothing beyond the defined fault class, given that a fault-tolerant system survives the failures it was designed for, and a total partition of every member falls outside that class.
- **B.** It fails to promise anything, since a properly fault-tolerant system is, by definition, 100% available.
- **C.** It fails to promise a fast recovery, since fault-tolerant systems are only rated on how quickly they detect and fail over — a claim that quietly assumes every fault-tolerant design is also the fastest-recovering one, which the definition never promises.
- **D.** It fails to promise redundancy, since quorum systems can operate with only a single reachable member.

### 60.

A service exits with shell status 137, and its own log shows nothing unusual before it stops. What does that status suggest, and what confirms it?

- **A.** SIGKILL (128+9), consistent with an OOM kill; confirm with `journalctl -k` or `dmesg` around that time.
- **B.** Nothing conclusive — 137 is just as likely to be an ordinary exit code the application chose deliberately on its own way out.
- **C.** It indicates the process was CPU-starved and self-terminated.
- **D.** It means the command was not found on PATH.

