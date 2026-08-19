<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 09

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-09-answers.md](exam-09-answers.md)

---

### 1.

A new engineer needs to understand why a firewall rule was configured unusually, and has time to research before touching anything. Which artifact should they consult?

- **A.** The runbook covering this firewall, followed step by step, since it explains what to do rather than why the rule was configured this way.
- **B.** The change record showing when the rule was last edited and by whom, without stating why that decision was made or what depends on it.
- **C.** Documentation — the descriptive record of what the system is and why, written for a reader who has time.
- **D.** The monitoring dashboard for the firewall's current traffic, which shows values now rather than the reasoning behind the configuration.

### 2.

What removes a long-lived provider access key from a workload entirely, rather than merely relocating it?

- **A.** Moving the key into a managed secret store with rotation enabled, which is treated as removing the provider credential from existence entirely rather than merely relocating it.
- **B.** Encrypting the key wherever it is stored, since encryption removes the risk regardless of how long the key lives.
- **C.** Attaching an instance role or workload identity, so the platform issues temporary credentials automatically and nothing static is ever stored.
- **D.** Narrowing the key's attached policy to only the actions the application actually calls.

### 3.

A command that works fine when typed at the prompt fails with "command not found" when the exact same line is placed inside a script. The command turns out to be an alias. Why does it fail only in the script?

- **A.** A script does not inherit aliases, because it runs in a non-interactive shell
- **B.** Aliases are copied into scripts automatically, so the failure must be a typo instead
- **C.** The script needs `export` applied to the alias before it can be used
- **D.** Aliases only work when defined inside the script file itself, never in `~/.bashrc`

### 4.

A breach at a card-accepting merchant results, from the same incident, in a regulator's fine, the loss of its card-acceptance agreement, a mandatory breach notification, and a visible drop in customer trust. What does this illustrate about the consequences of non-compliance?

- **A.** That regulatory action, contractual loss, mandatory notification and reputational damage are distinct consequence types coming from different authorities, not interchangeable outcomes of one cause.
- **B.** That the merchant is effectively being punished several times over for a single offence, since one incident ought only ever to produce one consequence, imposed by one authority rather than by four at once.
- **C.** That PCI-DSS, unlike GDPR, cannot impose more than one type of consequence for a single breach at the same time.
- **D.** That the reputational damage will be reversed automatically once the fine is paid and the required notification has been sent.

### 5.

A developer argues that running an application as root inside a container is harmless "because it is only a container." Why is that the wrong instinct?

- **A.** Because the kernel is shared with the host, the isolation boundary a compromised root process must cross is thinner than a hypervisor's, so the consequences reach further than in a VM.
- **B.** It is not wrong, since the namespaces a container is started with make root inside that container fully equivalent to an ordinary unprivileged user account on the host machine itself.
- **C.** Because a registry automatically rejects any image that was built and run as root, making the practice self-correcting.
- **D.** Because running as root disables the image's declared `EXPOSE` ports, leaving the application unreachable.

### 6.

A backlog owner marks every requirement 'Must have' under MoSCoW, reasoning that each one genuinely matters to the business. What has this prioritization actually achieved?

- **A.** It has established which gaps between current and desired state are most urgent.
- **B.** Nothing. A scheme where every item is Must has simply relabeled the whole list without forcing any trade-off.
- **C.** It has confirmed that the non-functional requirements are the highest priority.
- **D.** It has correctly captured the business's needs, since a Must-have list should include everything that matters.

### 7.

A change has passed every test in staging but has no documented way to be undone. What is still true about its risk?

- **A.** The risk is fully mitigated, since a pre-change snapshot always accompanies staging tests.
- **B.** The risk is eliminated, because staging testing already proved the change safe under every condition production could present.
- **C.** The risk remains unbounded; testing reduces the chance of a break, but only a rollback path bounds the damage if it happens anyway.
- **D.** The risk is bounded by the maintenance window the change will run inside, which limits only when the work happens, not how far it spreads.

### 8.

How does AWS identify one availability zone, and how does Azure describe what an availability zone is?

- **A.** AWS codes it as the region code plus a letter, such as us-east-1a; Azure describes it as a separated group of datacenters with independent power, cooling and networking.
- **B.** AWS numbers zones sequentially across every region it operates rather than coding them by letter; Azure treats a zone as a single physical building rather than a group of datacenters with independent power and cooling.
- **C.** AWS defines a zone as an entire separate region under another name; Azure has no concept of zones at all.
- **D.** Both providers require an availability zone to sit in a different country from its region before the label applies.

### 9.

A facility holds installed, running hardware and the most recent backup already loaded, needing only the data written since that backup before it can take over. Which tier is it?

- **A.** A mirrored site.
- **B.** A warm site.
- **C.** A cold site.
- **D.** A hot site.

### 10.

A backup script names its archive `backup-$(date +%F).tar.gz` so the filename includes today's date. What does `$(date +%F)` actually do inside that word?

- **A.** It pipes the archive's contents through the `date` command before naming the file
- **B.** It is arithmetic expansion, evaluating `date +%F` as a numeric expression
- **C.** It runs `date +%F` and splices its standard output into the surrounding word
- **D.** It reads `date +%F` as literal text and inserts it unchanged into the filename

### 11.

An assessor reviews 25 of the 400 access-approval tickets generated during the audit period and finds all 25 correctly authorised. What can the assessor conclude from that review alone?

- **A.** That all 400 tickets were reviewed, since a clean sample of this size statistically implies the whole population of tickets must also be clean.
- **B.** That the organisation is now compliant with the relevant standard permanently, since the audit examining this control is finished.
- **C.** That the approval control is preventive rather than detective, since the tickets show approval happened before access was granted.
- **D.** That the sampled tickets support the control having operated correctly for the period tested, not that every one of the 400 tickets was individually checked.

### 12.

A hypervisor host needs a predictable address without visiting the machine to configure it by hand, and the team wants every address kept in one authoritative place rather than scattered across host configurations. Which addressing choice fits, and how does it differ from a plain static address?

- **A.** A plain static address fits equally well, since a static address and a reservation both live on the DHCP server and behave identically in every respect as a matter of routine operational practice, regardless of which distribution or vendor is involved.
- **B.** A DHCP reservation fits. The client stays an ordinary DHCP client while the server binds its MAC to a fixed address, keeping every address centrally managed rather than configured by hand on the host.
- **C.** Neither fits; only a purely dynamic lease from the general pool satisfies the requirement for centrally managed addressing without visiting the host.
- **D.** A reservation fits, but it requires the host to be manually configured with a static IP address in addition to being registered on the server.

### 13.

A dozen containers, defined together with their networks and volumes, run happily through Docker Compose on one developer's laptop. A colleague calls this "orchestration for small deployments." What is the actual dividing line between Compose and an orchestrator?

- **A.** The number of containers involved — Compose is meant for a handful, while an orchestrator is required once a dozen or more are running.
- **B.** Whether the containers are described declaratively — Compose is imperative, while an orchestrator always requires declarative YAML.
- **C.** Whether the containers were built from a Dockerfile — Compose only runs pre-built images, while an orchestrator can build them too.
- **D.** How many hosts are involved and whether anything keeps watching afterward: Compose applies a file to one machine once, an orchestrator schedules across many and keeps reconciling.

### 14.

Two thresholds are configured on the same budget: one evaluated against actual spend, one against forecast spend. Which one can warn before the money is actually gone, and what caveat applies to both?

- **A.** The forecast threshold can warn early; both are still subject to a billing delay, so spend can cross a threshold and keep moving before the notification arrives.
- **B.** The actual threshold can warn early, since actual figures are always more current and more trustworthy than any forecast could be.
- **C.** Neither can warn early; only a periodic rightsizing review of provisioned capacity catches overspend before it actually happens.
- **D.** Both warn the instant spend crosses the line, since cloud billing is metered and reported in real time.

### 15.

A script written for a GNU/Linux server uses `ls --all` to show dotfiles, then is copied to run unmodified on a macOS workstation. What happens on macOS?

- **A.** It runs identically, since long options are part of the POSIX utility syntax
- **B.** The BSD `ls` on macOS rejects `--all`, though `-a` still works there
- **C.** It silently lists nothing, because macOS treats an unknown flag as matching zero files
- **D.** It behaves the same as `ls -A`, since macOS maps unknown long options to the nearest short one

### 16.

A community disagrees with a foundation-hosted project's technical direction and threatens to continue the code independently under new maintainers. Can the foundation or the original licence holder prevent this?

- **A.** No, but only because the community can click "fork" on the hosting platform, which merely creates a repository copy rather than exercising any legal right.
- **B.** No: the licence itself guarantees the right to make and distribute derived works, so no licence holder or foundation can block a community from continuing the code independently.
- **C.** Yes, since the foundation holds the project's trademark and can revoke the community's right to continue using the underlying code under any name.
- **D.** Yes, since the foundation sets the project's technical direction and can withdraw that direction from contributors it disagrees with.

### 17.

A TLS certificate must be issued for a server, and the certificate authority requires an unambiguous, absolute name rather than whatever short label the host happens to answer to locally. Which kind of name is required, and why does it matter here specifically?

- **A.** A fully qualified domain name is required, because it locates the host absolutely within the DNS hierarchy, unlike a bare hostname, which is only meaningful relative to a search domain that varies by context.
- **B.** A bare hostname is sufficient, since certificate authorities are defined to resolve any short label the same way regardless of where the request originates.
- **C.** Either name works identically for this purpose, since `hostname -f` and a plain hostname always resolve to the exact same value on every system.
- **D.** The transient hostname set by DHCP is required, since it is the only name type systemd considers valid for external services such as certificate issuance.

### 18.

A packet travels from a laptop, across two routers, to a server on a different network. Which of the following stays the same across every hop, and which changes at each router?

- **A.** The source and destination IP addresses stay the same end to end; the source and destination MAC addresses are rewritten by each router to the next hop's addresses.
- **B.** The MAC addresses stay the same end to end, since they are the permanent hardware identifiers; the IP addresses are rewritten by each router instead.
- **C.** Both the IP and MAC addresses stay identical at every hop, because routers only inspect headers without modifying either one.
- **D.** Both the IP and MAC addresses are rewritten at every hop, since each router treats the packet as an entirely new transmission.

### 19.

A denial-of-service attack and a ransomware attack are compared as a pair. Which axis actually separates the two, according to the guide's comparison?

- **A.** Severity — denial of service is always classified as more severe than ransomware because it affects availability directly.
- **B.** Duration — a denial of service always lasts longer than a ransomware incident.
- **C.** Attribution — denial-of-service attackers are always anonymous, while ransomware attackers always identify themselves for payment, which is why only the second of the two is ever recorded as a security incident.
- **D.** Whether anything runs on the victim host, since a denial of service overwhelms from outside without executing there, while malware requires code on the host by definition.

### 20.

A team must decide both which storage type to use for a new dataset and which access tier to place it in. Which decision comes first, and why?

- **A.** Tier first — the intended access tier determines whether the data should be addressed as objects, as blocks, or as files, so the type follows from it.
- **B.** Neither first — both should be settled together, as a single combined rightsizing exercise covering compute capacity and storage placement alike.
- **C.** Order does not really matter here, since a tier change and a storage-type change are, in practice, about equally easy to reverse once the data is in place.
- **D.** Storage type first — tiers and lifecycle rules are features inside a service already chosen, and each service exposes its own API, so changing type later means migrating data and repointing applications.

### 21.

Two directory entries, `report.txt` and `report-copy.txt`, both point at the same inode as a hard link pair. One of them is deleted. What happens to the data, and to the link count reported by `ls -l`?

- **A.** The data stays reachable through the remaining name, and the link count drops by one
- **B.** The data is lost immediately, since deleting either hard-linked name removes the underlying file
- **C.** The remaining name becomes a dangling reference, the same as a broken symbolic link
- **D.** The link count is unaffected, since `ls -l` only counts subdirectories, not hard links

### 22.

One release must ship a schema change alongside code that is incompatible with the previous version, so the two cannot coexist serving traffic. A later, unrelated release ships a small, backward-compatible feature that the team wants to validate against real traffic before committing to it fully. Which strategy fits each release?

- **A.** Canary for the first release, since routing a small slice bounds the exposure of the incompatible schema change; blue-green for the second, since a full cutover settles it.
- **B.** A rolling deployment for both releases, since replacing instances in batches works regardless of whether the schema is compatible.
- **C.** Blue-green for the first release, since it never mixes versions at all; canary for the second, since it deliberately samples traffic to gather evidence before widening.
- **D.** Blue-green for both releases, since an all-at-once cutover is always the safest strategy available regardless of what changed.

### 23.

A monitoring check against a new service on port 8443 has been failing since deployment. `nc -zv api.example.com 8443` hangs for the full timeout with no response, while `nc -zv api.example.com 22` succeeds instantly. What does this pair of results indicate, and what is the correct next diagnostic step?

- **A.** Both results indicate the exact same underlying cause, since a timeout and an instant success are treated as equally strong evidence of the identical routing problem.
- **B.** The 8443 timeout proves the entire host is unreachable, and the 22 success must therefore be a stale cached result rather than a genuine current connection.
- **C.** The correct next step is to read the firewall policy first, before checking anything about the server's own service configuration or bind address.
- **D.** The 8443 timeout indicates a silent drop, port-specific since 22 works instantly; routing is ruled out, so the next step is checking the server's own bind address and then the firewall policy for port 8443 specifically.

### 24.

A large migration programme deliberately avoids refactoring any application during the move itself, planning to modernise afterward instead. Which strategies does AWS recommend favouring during the migration, and why not refactor now?

- **A.** Repurchase alone should be used for every application, since it is the fastest of the seven strategies and the only one that leaves nothing running in the source environment.
- **B.** Rehost, replatform, relocate and retire are the common strategies for large migrations; refactoring during the move is the most complex and costly strategy and is hard to manage across many applications at once.
- **C.** Refactor should still be used first, since it is the strategy AWS calls the quickest way to migrate and operate in the cloud, the architecture then only being rebuilt once.
- **D.** Retain and retire should never appear in a large migration plan, since every application must eventually move to the cloud and a portfolio assessment only decides the order in which they are moved.

### 25.

What does a Software Bill of Materials establish about a shipped product, on its own and without any further work?

- **A.** That the product is licence-compliant, since every listed component's obligations have already been checked as part of producing the inventory.
- **B.** That every listed component's licence is compatible with every other one, since an incompatible combination could not have been assembled and inventoried.
- **C.** That the product is free of known vulnerabilities, since the standard inventory formats include a vulnerability scan by default.
- **D.** An inventory of the product's components, their versions and their dependency relationships — it makes licence and vulnerability questions answerable, but it answers none of them by itself.

### 26.

A routing table holds a connected route for 198.51.100.0/24 and a default route for 0.0.0.0/0. Which one is used to reach 198.51.100.7, and why — and which command confirms it without reading the table by eye?

- **A.** The default route wins, since a route explicitly named "default" is always treated as a special case that takes priority over any other route present.
- **B.** Whichever route was added to the table first wins, since kernel routing tables are evaluated strictly in insertion order rather than by prefix specificity, regardless of which distribution or vendor is involved.
- **C.** The /24 route wins, but only because it happens to be listed first when the table is printed by `ip route` without any arguments.
- **D.** The /24 route wins by longest prefix match (24 matching bits beats 0), and `ip route get 198.51.100.7` asks the kernel to show the entry it would actually select.

### 27.

A support ticket asks for a file to be "decrypted" from its SHA-256 hash so the original contents can be recovered. What is wrong with the request?

- **A.** The request is valid, but only `md5sum` supports reversal, not `sha256sum`.
- **B.** There is no such operation; hashing has no key and is one-way by construction, so the original input cannot be recovered from the digest.
- **C.** The request is valid if the correct salt is supplied along with the digest.
- **D.** The request is valid, since `gpg --verify` can recover the original file from a signed digest, because the signature packet embeds a compressed copy of whatever was signed alongside the digest itself.

### 28.

A ticket says "find every log entry mentioning the string ETIMEDOUT." Comparing tools that find things by name against ones that search content, which command actually answers this, and why not `find`?

- **A.** `find`, since it can filter on content as well as name once given the right expression
- **B.** `locate`, since its prebuilt index also stores each file's text content
- **C.** `grep`, because the question is about text stored inside files, not about the files' names
- **D.** `whereis`, since it searches every standard location for matching text, the same way it searches those locations for a command's binary

### 29.

A study note lists 3306 (MySQL) and 5432 (PostgreSQL) as "well-known ports" alongside 22 and 443. Using the strict IANA range definitions, is that labelling correct?

- **A.** No. Strictly, only 0-1023 is the well-known range; 3306 and 5432 both sit above 1023 in the 1024-49151 registered range, so they are registered ports, not well-known ones, however familiar they are.
- **B.** Yes — any port number that is commonly recognised and consistently used for one particular service, like MySQL or PostgreSQL, qualifies as well-known by that usage alone.
- **C.** No, but only because 3306 and 5432 are actually dynamic or ephemeral ports, in the 49152-65535 range, rather than registered ones.
- **D.** Yes, but only for 3306, since 5432 alone falls below 1024 and genuinely belongs in the well-known range while 3306 does not.

### 30.

A critical kernel security patch is released. On a rented IaaS virtual machine, whose job is it to apply it?

- **A.** The customer's — the provider's responsibility under IaaS stops at the virtualization layer and host operating system.
- **B.** The provider's — because they operate the underlying infrastructure, patching runs all the way up through the guest operating system.
- **C.** Whichever party originally enabled automatic OS updates on the instance — enabling them transfers patching duty to the provider.
- **D.** Neither — under IaaS the runtime is patched automatically by the platform, so no kernel patching is needed.

### 31.

A security scan and a design-time threat conversation are added at the pull-request stage, replacing a gate that used to run the week before release. Does this mean developers have taken over the security team's job?

- **A.** No, because shift left is a statement about when testing and security happen, not about who performs them, so responsibility stays shared across the lifecycle.
- **B.** Yes, because moving a task earlier in the pipeline transfers ownership of it to whoever is already working at that earlier stage, which in practice means the developers.
- **C.** No, but only because the operations group still owns whatever deployment gate remains later in the pipeline.
- **D.** Yes, since shortening the time to notice a defect requires developers to run every check themselves without help.

### 32.

A crontab line reads `30 4 1,15 * 5 /usr/local/bin/report.sh`. Both the day-of-month and day-of-week fields are restricted. When does the job actually run?

- **A.** At 04:30, only on whichever day is both the 1st or 15th of the month and a Friday
- **B.** At 04:30 on the 1st and 15th of every month only; the day-of-week field is ignored when the day-of-month field is also set
- **C.** At 04:30 every Friday only; the day-of-month field is ignored when the day-of-week field is also set
- **D.** At 04:30 on the 1st and 15th of every month, and additionally at 04:30 every Friday

### 33.

Comparing `command > out 2>&1` with `command 2>&1 > out`, which one sends both streams to the file, and which leaves errors on the terminal?

- **A.** Both forms are equivalent, since `2>&1` always means "merge the two streams"
- **B.** It is the reverse: naming the file first leaves errors on the terminal, and naming `2>&1` first merges them
- **C.** Putting the file redirect first sends both streams to the file; putting `2>&1` first leaves errors on the terminal
- **D.** Neither ordering can merge both streams; only `&>` can do that, because descriptor duplication with `2>&1` never takes effect on a command that also opens a file

### 34.

A responder finds an intrusion and immediately wipes and rebuilds the affected host before establishing how far the attacker spread. What did skipping ahead of containment cost, in PICERL terms?

- **A.** Nothing was lost, since eradication and containment achieve the same outcome regardless of order.
- **B.** It skipped the preparation phase, which should have happened at this point in the sequence instead.
- **C.** It destroyed the evidence needed to establish scope, so it can no longer be confirmed whether the attacker is still present elsewhere.
- **D.** It skipped the lessons-learned review, which always occurs immediately after identification rather than at the end, so eradication then ran without the findings that review would have produced.

### 35.

Team A ships a small working increment every two weeks and revises its plan as customers respond. Team B produces detailed documentation at every phase gate and finishes one large release after nine months. Which Agile Manifesto value does Team A's practice most directly express, and how does that differ from a waterfall judgement about the same scenario?

- **A.** Following a plan over responding to change, since Team A still plans out each two-week cycle in advance.
- **B.** Responding to change over following a plan — the Manifesto ranks it above a fixed plan without abolishing planning, whereas a waterfall judgement would instead ask only whether each of Team B's phases was signed off before the next began.
- **C.** No value at all, since agile teams are defined by having no plan and no fixed structure, which is why a team practising it is expected to decide everything moment to moment with nothing written down in advance, unlike a team following a documented methodology.
- **D.** The event calendar of daily standups and sprint reviews, since that is what the Manifesto actually specifies.

### 36.

A user starts a long compilation with `make &` in their SSH session and disconnects without using `nohup`. Is the compilation process a daemon?

- **A.** Yes, any process running in the background without an interactive prompt counts as a daemon
- **B.** No. It is still attached to the terminal session and dies with it; a daemon has no controlling terminal at all
- **C.** Yes, because it was started at the command line rather than by `systemctl` — a command launched from an interactive shell is handed off to PID 1 as soon as the prompt returns
- **D.** No, but only because `make` is a build tool rather than a long-running server

### 37.

A provider offers a single-tenant dedicated host inside its otherwise open public cloud platform, reachable through the same self-service console as every other customer's shared instances. Is the dedicated host best classified as a private cloud?

- **A.** No — the surrounding cloud infrastructure is still provisioned for open use by the general public, so a single-tenant host within it reads better as a public-cloud feature than as its own private cloud.
- **B.** Yes — since only one tenant runs on that specific host, it satisfies private cloud's exclusivity requirement in the only place that requirement can be measured, namely the machine the workload actually runs on.
- **C.** Yes, because public cloud infrastructure can never contain single-tenant hardware by definition — the host must belong to some other model.
- **D.** Yes, because it satisfies hybrid cloud instead, mixing a dedicated host with shared infrastructure inside one provider's estate.

### 38.

A long-running job is started interactively in the foreground of an SSH session and then suspended with Ctrl-Z. Which two commands move it to the background and later bring it back?

- **A.** `nohup` to resume it in the background, since it is designed to keep a job running
- **B.** `bg` to resume it in the background, and `fg` to bring it back to the foreground later
- **C.** `jobs` to resume it in the background, and `kill` to bring it back — `jobs` restarts the most recently stopped job whenever it is invoked with no arguments
- **D.** Pressing Ctrl-C to resume it, then Ctrl-Z again to bring it forward

### 39.

A block on this concept also compares it to "forking a project" in the open-source-licensing sense. What separates a platform fork (or a plain `git clone`) from that older meaning of "fork"?

- **A.** A platform fork always changes ownership of the original project immediately and permanently, while an open-source fork leaves the original maintainers in full and undisputed control of the code, its releases, its trademark, and its governance going forward indefinitely.
- **B.** Whether the copy is meant to come back: a platform fork or clone is a mechanical copy made in order to contribute changes back, while forking a project in the open-source sense is a permanent, licence-enabled split into two separately maintained projects.
- **C.** There is no real difference; both terms describe the exact same server-side copy operation performed by the same button on the same hosting platform.
- **D.** A platform fork requires a `git fork` command, while the open-source sense requires only a licence change filed with the project's chosen governing foundation.

### 40.

A command's output is piped into `grep`, and its error messages are noticed to still appear on screen rather than being searched. Why does a plain pipe not carry them along?

- **A.** A pipe carries both streams by default, so `grep` should already be matching against error text too
- **B.** `grep` specifically filters out anything that looks like an error message
- **C.** Redirection with `2>` must precede the pipe for the pipeline to run at all
- **D.** A pipe connects only descriptor 1 by default, so standard error is not carried into the pipeline

### 41.

A service balances an arbitrary TCP protocol that is not HTTP, and the requirement is minimal added latency. Which class of load balancer fits, and why?

- **A.** A layer 7 load balancer, since parsing the request lets it apply smarter routing regardless of the protocol involved.
- **B.** A layer 4 load balancer forwards by address and port without parsing the protocol, which is what makes it protocol-agnostic and low-latency.
- **C.** DNS-based load distribution, since it adds no per-connection processing at all.
- **D.** A private connectivity link, since it bypasses the public internet and therefore adds no latency.

### 42.

A login requires a password, then a one-time code delivered by SMS. An attacker runs a real-time phishing relay that captures both and logs in immediately. Did MFA fail here, and what would have stopped this specific attack?

- **A.** MFA fully succeeded, since two distinct factor categories were checked and that is sufficient against any credential attack by definition.
- **B.** MFA reduced but did not end the risk; only a phishing-resistant authenticator such as a FIDO2 security key breaks a real-time relay.
- **C.** MFA did not apply here at all, since a password and an SMS code are both "something you know."
- **D.** The fix is authorization review, since the account should never have been permitted to log in from a new location.

### 43.

A file is `-rw-r-----`, owned by `alice` and belonging to group `staff`, of which `alice` is also a member. Can `alice` write to it?

- **A.** No, because being a member of the owning group means the more restrictive group bits apply
- **B.** Only if the `other` triad also grants write, since all three classes must agree
- **C.** Yes, because the kernel matches the owner class first and grants read and write there
- **D.** No, because `alice` would need to be listed in `/etc/group` to use owner privileges

### 44.

A new peripheral does not work. `lsmod` shows no module related to it. What is the correct next step before concluding a module needs to be loaded?

- **A.** Check whether a suitable module exists to load with `modprobe` — but also consider that the driver might be compiled directly into the kernel, in which case it would never appear in `lsmod` at all.
- **B.** Assume the device needs a firmware update instead, since `lsmod` never lists device firmware either way regardless of what is loaded.
- **C.** Run `insmod` directly with a guessed module filename, since it behaves identically to `modprobe` in practice for any driver.
- **D.** Conclude the driver is definitely absent, since `lsmod` is supposed to be a complete list of every single driver active on the system right now, with no exceptions for how a driver was originally built into the kernel image.

### 45.

A stakeholder wants a backlog item reprioritised and takes the request straight to a developer, who agrees to work on it next. What does the Scrum Guide say is wrong with that path?

- **A.** Nothing — any team member may reprioritise the backlog as long as the change is communicated afterward to whoever happens to be affected by it that Sprint.
- **B.** The request should have gone to the Scrum Master instead, since ordering is a process concern.
- **C.** Nothing is wrong, since reprioritisation requests are meant to be raised directly at the Daily Scrum.
- **D.** Ordering authority over the Product Backlog sits with the Product Owner; a developer agreeing to reprioritise bypasses the one person accountable for it.

### 46.

Two people log in separately and each run the same text editor program. How many processes exist, and what identifies each one uniquely?

- **A.** One process, since only one copy of the program exists on disk
- **B.** Two services, one per user session — the desktop session manager registers every editor invocation as a per-user service
- **C.** One process with two PPIDs, one for each user
- **D.** Two processes, each with its own PID — one program on disk can be running as many separate processes at once

### 47.

A dedicated circuit connects an on-premises network to the cloud without touching the public internet. Is the traffic on it encrypted?

- **A.** Yes, automatically, because never touching the public internet is the same thing as being encrypted.
- **B.** Yes, in the same way AWS encrypts all inter-Region peering traffic before it leaves its facilities, treating a dedicated circuit and a peering connection as interchangeable for this purpose.
- **C.** Not inherently — the circuit provides a private path, which is a separate property from encryption of the payload, and encryption there is a decision made separately from choosing the circuit.
- **D.** Yes, as long as a security group rule requiring encrypted traffic is attached to the circuit.

### 48.

In the middle of a conflicted merge, a developer runs `git diff` to understand what is in dispute. What does it show, compared to an ordinary `git diff` outside a conflict?

- **A.** The same working-tree-versus-index comparison it always shows, since a merge in progress does not change what `git diff` compares.
- **B.** Nothing, since `git diff` refuses to run at all while a merge is unresolved
- **C.** A list of every commit on both branches that contributed to the conflict
- **D.** A combined three-way diff highlighting the changes from both the HEAD and MERGE_HEAD sides, rather than a normal two-sided patch.

### 49.

A daemon needs to shut down and should be given the chance to flush buffers, close files, and release its lock before it stops. Which signal, and which command, is the right first move?

- **A.** SIGKILL, sent with `kill -9 <pid>`, to guarantee the process actually stops
- **B.** SIGSTOP, to pause the process before deciding what to do next — a process flushes its buffers to disk as part of entering the stopped state
- **C.** SIGTERM, sent with plain `kill <pid>`, since it asks the process to shut down and can be caught
- **D.** SIGHUP, since it is the standard signal for terminating a daemon cleanly

### 50.

"SELinux and AppArmor" and "access control models" are compared as a pair. What separates them, given that both discuss mandatory access control?

- **A.** Instance versus category — SELinux and AppArmor are specific Linux products implementing mandatory access control, while access control models is the taxonomy of discretionary, mandatory, and role-based schemes itself.
- **B.** SELinux and AppArmor implement role-based access control specifically, while access control models covers only discretionary and mandatory.
- **C.** SELinux and AppArmor are Linux-specific, while access control models only describes Windows and macOS systems, which is why neither product appears anywhere in that taxonomy.
- **D.** Only access control models is examinable by command, since a taxonomy is what a `getfacl` listing reports; SELinux and AppArmor are conceptual only.

### 51.

Two different users are logged into the same server at once, each running a process with the identical program name. Why does this not cause a conflict?

- **A.** The shell renames one of the two processes automatically to avoid any naming collision between them at the operating-system level.
- **B.** The kernel schedules and owns each process separately, keeping their memory and permissions apart regardless of which program name either one happens to share.
- **C.** Each user is confined to a separate kernel running in its own lightweight container on the host, fully isolated from every other logged-in user's kernel instance.
- **D.** Only one of the two processes can actually be running at a time; the OS silently queues the second behind it until the first one exits.

### 52.

Why does software compiled from source conventionally install into `/usr/local/bin` rather than `/usr/bin`?

- **A.** Because `/usr/bin` is read-only at the filesystem level and cannot accept new files at all
- **B.** Because the package manager owns everything under `/usr` except `/usr/local`, and installing there avoids being silently overwritten
- **C.** Because `/usr/local/bin` is searched earlier in `$PATH` on every distribution by default
- **D.** Because `/usr/bin` is reserved exclusively for binaries shipped with the kernel itself — the FHS lists it among the directories that must hold nothing outside the base kernel image

### 53.

A CDN's edge server receives a request for an object it has never cached before. What has to happen before that first viewer at that edge gets a response?

- **A.** Nothing extra — every edge location shares one global cache, so a miss at one edge is always a hit at another — an assumption that erases the whole reason edges are described as geographically distributed rather than as one shared pool.
- **B.** The edge must invalidate every other edge's copy of the same object first.
- **C.** The edge must fetch the object from the origin, the definitive copy, before it can return anything, and it keeps a copy afterward for later requests.
- **D.** The origin must first push the object out to every edge location in the network.

### 54.

Midway through a fixed-price project, the sponsor asks for an additional module. The delivery date and the budget both stay exactly as agreed. Which of the following must absorb the change?

- **A.** Nothing, provided the existing team simply works longer hours to cover the extra module.
- **B.** A new milestone, added to the schedule to mark the module's completion.
- **C.** With scope up and both the schedule and the budget frozen, quality is the only remaining quantity the model bounds.
- **D.** Nothing, as long as the module is logged as a minor addition rather than routed as a formal change, since informal requests below a certain size are commonly assumed not to need assessment.

### 55.

An administrator is following a live tail of a busy log with `tail -f` when the log gets rotated by `logrotate` and renamed aside. New entries stop appearing. Which command survives rotation, and why?

- **A.** `tail -f` should already handle rotation correctly, since it is designed to follow a growing log
- **B.** `less +F`, since only `less` supports following a log across rotation — its F command reopens the file by name as soon as the inode behind it changes
- **C.** `tail -F`, because it follows the file by name and reopens it after a rename, rather than staying attached to the old inode
- **D.** Neither survives rotation; the session must be restarted manually every time a log rotates

### 56.

A repository has a remote-tracking branch `origin/main` reporting that the local branch is four commits behind. Does that reading describe the remote server right now?

- **A.** Yes — `origin/main` is a live view of the server, updated automatically whenever the server changes.
- **B.** Yes, because `origin` always refers to the authoritative repository, which every collaborator's client is expected to keep synchronized with in real time as part of the workflow.
- **C.** It depends on whether the branch has an upstream configured with `git push -u`.
- **D.** No, because `origin/main` is a local, read-only record of where the remote's `main` stood at the last fetch, pull or push, so the server may have moved further since.

### 57.

NIST SP 800-207 describes a policy decision point and a policy enforcement point. What role does each play in a zero-trust architecture?

- **A.** The decision point is a firewall at the network edge, and the enforcement point is the VPN concentrator behind it.
- **B.** The decision point evaluates each request against identity and context; the enforcement point opens, monitors, and terminates the resulting connection.
- **C.** The decision point grants trust once at login, and the enforcement point re-checks it only if the session is idle for a long period.
- **D.** The decision point encrypts traffic, and the enforcement point decrypts it at the destination.

### 58.

An exam option must be assigned to either 'the kernel' or 'the operating system': providing the full set of interfaces — system calls, plus the libraries and services built on top of them — that lets an application avoid addressing hardware directly. Which is the more precise assignment?

- **A.** The operating system, because it is the kernel plus the userspace services and libraries built on it, and that whole layer is what supplies the complete set of interfaces.
- **B.** The kernel, because it is the component that actually schedules the CPU and enforces permissions, so it must also be the source of every interface an application calls.
- **C.** The distribution, because its package manager installed the libraries the application links against, and whichever component installs a piece of software becomes the layer that interface belongs to.
- **D.** Neither term applies cleanly, since applications on Linux address hardware directly once a device file has been opened, with the device file itself standing in for any further mediating software layer.

### 59.

An e-commerce platform automatically adds instances during a flash sale and automatically removes them again once demand returns to normal. Which of the two compared terms best names this behaviour, and what would be lost if only the removal step were dropped?

- **A.** Scalability — and dropping the removal step would make no difference, since scalability never required shrinking in the first place.
- **B.** Elasticity — and dropping the removal step would remove the platform's ability to add capacity at all.
- **C.** High availability — and dropping the removal step would create a single point of failure.
- **D.** Elasticity; dropping the automatic removal would leave only scalability, since capacity would grow but never shrink back.

### 60.

`uptime` reports a load average of 24, and `top`'s CPU-state line shows a high `wa` and a low `us`. What does that combination rule out, and what is actually happening?

- **A.** It rules out memory pressure entirely, since any swapping under memory pressure would instead show as a high `us` figure.
- **B.** A load of 24 is high regardless of core count, so this is unambiguous CPU saturation requiring more processing capacity.
- **C.** It rules out CPU saturation; `uptime`'s figure counts D-state processes too, and `top`'s high `wa` shows they're waiting on storage, not the processor.
- **D.** It confirms disk space, not CPU, is the constraint here, and the remedy is freeing space rather than adding processors.

