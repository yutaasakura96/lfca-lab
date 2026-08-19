<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 08

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-08-answers.md](exam-08-answers.md)

---

### 1.

After a configuration-management playbook is run against a hand-edited host, an operator claims the host now matches the approved baseline. What limits that claim?

- **A.** Baselines are enforced only through configuration management and never through a published, independently maintained industry benchmark.
- **B.** Only the settings the declaration mentions are corrected; anything it never mentions survives untouched.
- **C.** The claim can only be verified once a monitoring alert fires.
- **D.** Nothing limits it — a playbook run always brings every setting into full compliance.

### 2.

An access key is moved out of application source code into an environment variable inside a private repository's deployment manifest. What has actually changed about the credential?

- **A.** The key is now safe, since a private repository is not accessible to anyone outside the team.
- **B.** Where the key is stored, not what it is; it remains a static, long-lived credential that can be copied once and used until somebody revokes it.
- **C.** The key is now rotated automatically on a fixed schedule, since environment variables are widely believed to be refreshed with a new value on every single deploy.
- **D.** The key now inherits the deploying user's IAM permissions instead of its own.

### 3.

A shell script ends with the line `cd /var/log`, and the operator expects their interactive shell to land in `/var/log` after the script finishes. Why does the interactive shell stay exactly where it was?

- **A.** The script runs as a child process, and a child cannot change its parent's working directory
- **B.** `cd` inside a script is silently disabled for security reasons, since a script is assumed to run in a restricted, non-interactive shell that cannot change directories
- **C.** The path `/var/log` does not exist on most systems, so the `cd` fails quietly
- **D.** Only `cd -` can change a directory permanently; a bare `cd path` is temporary by design

### 4.

A supervisory authority finds that an organisation's processing violated GDPR's basic principles and imposes a temporary ban on that processing rather than issuing the maximum available fine. Why might the ban be the costlier consequence?

- **A.** It cannot be costlier; the fine is always the largest consequence a supervisory authority is able to impose.
- **B.** Because the upper fine tier under Article 83 reaches 20 million euros or 4 percent of worldwide annual turnover, whichever of the two figures happens to be lower.
- **C.** Because imposing a processing ban also starts HIPAA's 60-day individual-notification clock running.
- **D.** Because Article 58's corrective powers include imposing a temporary or definitive limitation, including a ban, on processing, which can stop the business operating in a way no fine amount does.

### 5.

An image built on a laptop with Docker runs unmodified under containerd on a cluster node with no changes needed. What makes that portability guaranteed rather than lucky?

- **A.** Docker Hub silently converts every pushed image into a containerd-specific format before that image can be pulled down onto a cluster node running a different runtime.
- **B.** Kubernetes rebuilds every image from its Dockerfile the first time it is scheduled onto a new node.
- **C.** The node's kubelet translates the image's layers into a Kubernetes-native format before the runtime can use them.
- **D.** The Open Container Initiative's Image, Runtime, and Distribution specifications, which keep images and runtimes from different vendors interchangeable.

### 6.

Why does practice favor 'requirements elicitation' over 'requirements gathering' as the name for this activity?

- **A.** Because gathering only covers workflow diagrams, while elicitation also covers written documents.
- **B.** Because elicitation identifies the gap between current and desired capability, which gathering cannot do, since gathering only records what stakeholders have already written down.
- **C.** 'Gathering' implies finished requirements already exist and only need collecting; elicitation exists because stated wants and actual needs routinely differ.
- **D.** There is no real difference between the two terms; they are used interchangeably across most practice guides and style references.

### 7.

What is the "snowflake host" problem that standardization addresses?

- **A.** A server built and maintained by hand, whose configuration exists nowhere but on the server itself, so no fix or script reliably applies to it.
- **B.** A host whose configuration-management tool has stopped converging it to the declared state, which is drift within an already-managed host.
- **C.** A host that falls short of the organisation's minimum secure configuration, which is a compliance gap rather than an unmanaged snowflake.
- **D.** Any host that has ever been patched by hand, even one whose configuration is otherwise fully recorded elsewhere and rebuildable from a known, reviewed specification.

### 8.

A workload is deployed across three availability zones in one AWS region. Which class of outage does that arrangement leave it fully exposed to?

- **A.** The loss of a nightly backup copy, since spreading instances across zones is itself a backup strategy for the data they hold.
- **B.** An outage at a different cloud vendor entirely, since spreading across zones is a form of running multi-cloud.
- **C.** Nothing — spreading a workload across zones already protects it against an outage of any scale.
- **D.** The loss of the entire region, since multi-zone protects against a zone-level failure inside a region, not a regional one.

### 9.

A budget holder proposes cancelling the standby site because the production cluster is already highly available. What is the flaw?

- **A.** There is no flaw, since a highly available cluster already makes a separate recovery site unnecessary.
- **B.** The cluster protects against component failure, not against losing the location it sits in.
- **C.** The cluster cannot meet a recovery point objective of any length.
- **D.** Clusters are unable to fail back once a node returns to health.

### 10.

A script fails with "No such file or directory" for `Config.yaml`, even though a file is clearly present in the directory when listed. Which mismatch is most likely, given that Linux filesystems compare names exactly?

- **A.** The file is hidden as a dotfile and must be revealed with `ls -la` before the script can see it
- **B.** The file has the wrong extension, and Linux enforces extensions for configuration files
- **C.** The actual file is named `config.yaml`, and the two names are simply different files on a case-sensitive filesystem
- **D.** Case does not matter here; the real cause must be a permissions problem instead, since restrictive permissions are the most common reason a script can't open a file that is clearly visible in a listing

### 11.

A file-integrity monitor alerts the security team within minutes whenever a production binary changes unexpectedly, but does not itself block the change or revert it. How is that control classified by function?

- **A.** Preventive, because the alert is generated early enough to stop the unauthorised change before it takes full effect.
- **B.** Corrective, because the security team's response to the alert restores the binary to a known-good state before any further damage can occur.
- **C.** Detective, because it notices that a change happened rather than stopping it beforehand or restoring the system afterward.
- **D.** Administrative, because responding to the alert is a documented process the security team follows by hand.

### 12.

A `curl` command against a service exits with status 0, and a monitoring script treats this as proof the request succeeded fully. Is that a safe assumption?

- **A.** Yes — a `curl` exit status of 0 is defined to guarantee the HTTP response status was in the 2xx success range for every request made.
- **B.** No, but only because `wget`, not `curl`, is the tool whose exit status can be trusted to reflect the actual HTTP status code returned.
- **C.** No — a `curl` exit status of 0 means the transfer completed, not that the HTTP status was 2xx; the actual status code has to be read separately, or `--fail` used to make an HTTP error a non-zero exit.
- **D.** Yes, but only when `-I` is combined with the request, since a HEAD-only request is defined to make exit status 0 equivalent to a guaranteed HTTP success, since curl aborts a HEAD request as a transfer error whenever the status line is not 2xx.

### 13.

A container was started ten minutes ago but no longer appears in the default output of the listing command. Which command reveals it, and why did the default view hide it?

- **A.** `docker run` again with the same name, because the original process needs to be recreated from scratch.
- **B.** `docker images`, because a container that stops folds back into the image store it was created from.
- **C.** Nothing brings it back, because a container that exits is deleted automatically the moment its process stops.
- **D.** `docker ps -a`, because bare `docker ps` shows only currently running containers by default.

### 14.

A budget's 90 percent threshold has just fired by email. What has the provider actually done to the account as a result?

- **A.** The account is now blocked from provisioning further resources, since the threshold exists specifically to prevent overspend.
- **B.** Any orphaned resources contributing to the overage are automatically found and deleted.
- **C.** The account's free-tier allowance is extended automatically to absorb the extra spend.
- **D.** Nothing by default: a threshold breach sends a notification, and it halts no resource and refuses no API call unless an action was explicitly configured.

### 15.

An operator types `ls -la` to see hidden files in long format. Which two single-letter options does that one hyphenated word actually expand to?

- **A.** `-l` and `-A`, since a clustered letter is read case-insensitively
- **B.** `-l` and `-a`, clustered behind one leading hyphen
- **C.** A single long option spelled with one leading hyphen
- **D.** `-l` only, with the trailing `a` passed on as a separate operand

### 16.

Critics describe copyleft as "viral." Which statement corrects that framing without denying that copyleft has real reach?

- **A.** The framing is accurate: any file merely stored alongside GPL code on the same disk becomes GPL-licensed regardless of whether either is distributed.
- **B.** The framing is accurate only when the combined work is built with static linking rather than dynamic linking against the covered code.
- **C.** Copyleft is a condition attached to the act of distributing a work, not something that spreads automatically by mere contact with the code.
- **D.** The framing is accurate: any product that once depended on a GPL library remains GPL-licensed permanently, even after the dependency is fully removed.

### 17.

A `dig` query returns status NOERROR with a completely empty ANSWER section. A junior engineer reads this the same way as NXDOMAIN, concluding the name does not exist. Is that the correct reading?

- **A.** Yes — NOERROR and NXDOMAIN are defined to be functionally identical outcomes whenever the ANSWER section of a `dig` response happens to be empty.
- **B.** No — NOERROR with an empty ANSWER section means the name exists but has no record of the type asked for, which is a different thing entirely from NXDOMAIN, which means the name itself does not exist.
- **C.** No, but only because the query must have used `+short`, which is defined to always suppress the ANSWER section regardless of whether a record actually exists, because `+short` suppresses the ANSWER section before the response is ever parsed.
- **D.** Yes, but only for MX record queries specifically, since NOERROR and NXDOMAIN are treated as equivalent only when the queried record type is MX.

### 18.

A host with no inbound firewall rules configured at all can still browse the web without issue. A colleague argues this proves the firewall is not actually protecting anything. Is that the right conclusion?

- **A.** Yes — the ability to browse the web with no inbound rules proves the firewall is entirely inactive and providing no protection against inbound connections at all, since a firewall that permits any traffic in either direction has no default-deny policy left to apply.
- **B.** Yes, but only because web browsing specifically bypasses firewall inspection entirely as a documented protocol-level exception unique to HTTP and HTTPS.
- **C.** No, but only because NAT, not the firewall, is what is actually permitting the return web traffic to reach the browsing host in this scenario.
- **D.** No — a stateful firewall tracks connections, so a rule permitting outbound traffic implicitly permits the replies, which is exactly why a host with no inbound allows can still browse the web while remaining protected from unsolicited inbound connections.

### 19.

OWASP separates brute force, credential stuffing, and password spraying as three distinct attacks. What actually differs between password spraying and the other two?

- **A.** Spraying tests one weak password against many different accounts, rather than many passwords against one account or replaying known-valid pairs.
- **B.** Spraying is the only one of the three that does not require any guessing at all.
- **C.** Spraying is the only one of the three that targets a single account exhaustively, working an entire wordlist against one high-value login while the other two spread their attempts across a whole user base.
- **D.** Spraying is the only one of the three defeated by a strong password policy alone.

### 20.

A team collects one week of utilisation data that happens to exclude month-end close, then rightsizes a database down accordingly. What is the likely outcome?

- **A.** Nothing goes wrong, since cost monitoring would have already caught any peak the exercise missed.
- **B.** The database automatically moves to a colder storage tier once it is resized.
- **C.** Sizing to one representative week of data is sufficient, since rightsizing is treated as a one-time project rather than an ongoing, iterative one.
- **D.** The database is undersized for the peak the observation window missed, turning the resize into a performance incident at month-end.

### 21.

An operator runs `ln -s config.yaml /etc/app/current.yaml` while standing in `/home/ops`, expecting the link to point at `/home/ops/config.yaml`. Where does the link actually resolve, and why?

- **A.** To `/home/ops/config.yaml`, because the target is always resolved from the working directory at creation time
- **B.** The link creation fails outright, since `config.yaml` is not an absolute path
- **C.** To `/etc/app/config.yaml`, because a relative target is resolved from the link's own directory
- **D.** To whichever `config.yaml` is found first on `PATH`

### 22.

A requirement states the host team must be able to edit application source files directly with their own editor and see changes reflected instantly inside a development container. Which choice fits, using `docker run -v`?

- **A.** A bind mount, written as `-v /host/path:/path/in/container`, since it maps an existing host directory the team already edits with their own tools.
- **B.** A named volume, written as `-v pgdata:/path/in/container`, since Docker places a named volume inside the project's own source directory where the team's editor already reaches it.
- **C.** `docker run -e SOURCE_PATH=/host/path`, which tells the container which host directory to read source files from.
- **D.** Rebuilding the image with `docker build` every time a source file changes, so the new content is baked in before each run.

### 23.

A service answers correctly when tested on `127.0.0.1` from the local host, but a remote client gets connection refused. Given that loopback works, what has been eliminated and what remains a suspect?

- **A.** Nothing has been eliminated, since a loopback test says nothing more than a remote test would about where the service is failing.
- **B.** The service process itself is eliminated as a suspect, since it clearly is running and answering; a listening-address binding, a firewall rule, or routing between the two hosts remain suspects.
- **C.** The remote client's DNS resolution is eliminated as a suspect, since the loopback test used a name rather than a raw address.
- **D.** The network cabling between the two hosts is eliminated as a suspect, since loopback traffic exercises the same physical path a remote client would use, which feels reasonable on first encounter in most textbooks and quick references.

### 24.

AWS's prescriptive guidance names seven migration strategies, the '7 Rs.' Which term does AWS actually use for replacing an application with a different product, typically SaaS, rather than migrating the existing one?

- **A.** Replace — the customer swaps the application for a different product entirely.
- **B.** Repurchase — also called drop and shop.
- **C.** Relocate — the workload moves to the cloud without changing its architecture.
- **D.** Refactor — the application is rebuilt around cloud-native patterns.

### 25.

In a typical open source project, what separates a contributor from a committer?

- **A.** A contributor proposes changes; a committer has been granted write access to the repository, earned on merit, and is the one who can actually merge them.
- **B.** A contributor works only through a mailing list, while a committer works only through pull requests on a hosting platform.
- **C.** A committer must be a paid employee of the foundation that hosts the project, while a contributor is always an unpaid volunteer with no formal ties.
- **D.** Seniority at the contributor's own outside employer determines who becomes a committer, independent of the actual contributions made to the project.

### 26.

A broadcast frame is sent by a host connected to a plain switch with ten other ports in use. What happens to that frame, and would the outcome differ if a router sat where the switch does instead?

- **A.** The switch forwards the broadcast only to the one port whose MAC learning table entry matches the broadcast address specifically.
- **B.** The switch floods the broadcast to every other port, since every port on a plain switch shares one broadcast domain; a router in its place would not forward the broadcast at all, terminating it there.
- **C.** The switch silently drops the broadcast frame, since flooding traffic to every port is treated as a security risk that switches avoid by default.
- **D.** The outcome would be identical whether a switch or a router occupies that position, since both devices handle broadcast frames the same way by design, broadcast handling being fixed at the frame level rather than per device.

### 27.

A distributed flood of traffic from thousands of source addresses overwhelms a service's connection capacity. Blocking the single loudest source IP does nothing. What does the distributed nature of the attack rule out as a response?

- **A.** Blocking a single source address, since a DDoS has no one address whose removal stops the flood; scrubbing, rate limiting, and added capacity are the distributed answers.
- **B.** Restoring from backup, since a DDoS always corrupts the underlying data alongside exhausting capacity, and the half-written records left behind by dropped connections have to be rolled back before the service can return.
- **C.** Patching the service, since the flood must be exploiting a specific software vulnerability.
- **D.** Enabling full disk encryption, since encrypted storage resists resource exhaustion attacks.

### 28.

A container image ships a stripped-down set of binaries with no man pages installed at all. `man ls` fails with "No manual entry", but `ls --help` still prints a usage summary. Why does `--help` still work?

- **A.** `--help` reads the same source file `info` uses, which the image keeps for licensing reasons
- **B.** Its output is compiled into the binary itself, unlike a man page, which is a separate installed file
- **C.** The image substitutes `apropos` output whenever a man page is missing, falling back to the short description instead
- **D.** Both `man` and `--help` actually failed, and the terminal replayed a cached result

### 29.

A rule is added with `firewall-cmd --permanent --add-service=https`, but clients still cannot reach the service over HTTPS. What is missing?

- **A.** Nothing is missing — a `--permanent` rule is defined to take effect in the running configuration the instant the command completes, without any further step.
- **B.** `firewall-cmd --reload` — a `--permanent` change does not take effect until a reload, so the rule exists in the permanent configuration but not yet in the active runtime policy.
- **C.** The `--zone` flag must be added to the command, since firewalld rules added without an explicit zone are silently discarded rather than applied to any zone at all.
- **D.** The service must also be explicitly restarted, since firewalld rules are defined to have no effect on any service until that service itself is restarted.

### 30.

Two teams each rent capacity from the same provider. Team A installs and patches its own guest operating system on a rented virtual machine. Team B pushes an application build and selects a supported runtime version, with the provider patching the OS beneath it. Which model is Team A using, and what is the deciding boundary against Team B's model?

- **A.** Team A is using PaaS; the boundary is who chooses the runtime version, which is the one decision the provider never delegates.
- **B.** Team A is using IaaS; the boundary is which team is billed per second rather than per month, since only IaaS meters at second granularity.
- **C.** Team A is using IaaS; the boundary is who owns the operating system, which IaaS leaves to the customer, while Team B's model puts it below the provider's line.
- **D.** Team A is using IaaS; the boundary is that Team B's workload runs as a container, which is what makes an offering PaaS rather than IaaS.

### 31.

Which Kubernetes Deployment strategy runs by default, and what does the alternative strategy do differently from it?

- **A.** Recreate is the default strategy, and it behaves much like a blue-green cutover between two complete environments.
- **B.** RollingUpdate is the default, and Recreate is the strategy that restores a previous revision from the rollout history the Deployment retains by default for exactly that purpose.
- **C.** RollingUpdate is the default, replacing instances in batches while the service stays available; Recreate kills every existing Pod before creating any new one, accepting downtime.
- **D.** Both strategies avoid downtime entirely, differing only in how many Pods are replaced within each batch.

### 32.

Three similarly named operations exist: `systemctl daemon-reload`, `systemctl reload nginx`, and `systemctl restart nginx`. Which one re-reads unit files from disk, manager-wide?

- **A.** `systemctl reload nginx`, since "reload" is the word that implies re-reading configuration
- **B.** `systemctl daemon-reload`, which takes no unit argument and rebuilds the dependency graph from every unit file
- **C.** `systemctl restart nginx`, since restarting naturally picks up whatever has changed
- **D.** All three do the same thing at different scopes, so any one of them suffices — `daemon-reload` is simply the variant that applies it to every unit at once

### 33.

An operator intends to sort a file in place with `sort file > file`, expecting the sorted content to replace the original. Instead, `file` ends up empty. What actually happened?

- **A.** `sort` failed silently because reading and writing the same file is blocked at the command level
- **B.** The file was emptied by a disk error unrelated to the redirection
- **C.** The shell truncated `file` when it set up the redirection, before `sort` ever read it
- **D.** `>>` was actually used instead of `>`, which appends rather than truncates

### 34.

A certificate chain runs from a leaf certificate through an intermediate CA to a root certificate that signed itself. Why does the client still trust that root?

- **A.** Because a root certificate's self-signature is cryptographically stronger than any other signature in the chain, when a self-signature proves nothing about the signer's honesty regardless of how the signature itself is constructed.
- **B.** Because TLS 1.3 automatically re-verifies every root certificate against a central registry during the handshake.
- **C.** Because the root is already present in the client's trust store as a trust anchor, not because of its own self-signature.
- **D.** Because the intermediate CA's signature alone is sufficient, and the root is not actually checked.

### 35.

A Product Owner wants to change one story's acceptance criteria after the developers have already started implementing it. What has this change lost?

- **A.** Its function, since criteria agreed before work starts exist to make 'complete' decidable in advance, and changing them mid-implementation reopens what should already be settled.
- **B.** Nothing — acceptance criteria may be revised by the Product Owner at any point right up to the Sprint Review, since they belong to the Product Owner and can be reopened whenever new information arrives.
- **C.** Nothing — only the Definition of Done needs to be fixed in advance, not per-item criteria.
- **D.** Its status as a formal change, since acceptance criteria are never routed through change control.

### 36.

A team is choosing where to install software they compiled themselves, separate from anything the distribution's package manager owns. Which directory is the standard place, and why not `/usr/bin`?

- **A.** `/usr/bin`, since that is simply where all executables belong regardless of who built them
- **B.** `/opt`, since any third-party software belongs there by convention
- **C.** `/usr/local`, because the package manager owns everything under `/usr` except that subtree
- **D.** `/var/local`, since locally built software is variable data

### 37.

A company runs a virtualized server cluster entirely inside its own building, with no self-service provisioning, no elastic scaling and no usage metering — capacity requests go through a manual ticket. Is this a private cloud?

- **A.** No — without on-demand self-service, elasticity and metering, it is a virtualized datacentre rather than a cloud of any deployment model, private included.
- **B.** Yes — any on-premises infrastructure dedicated to one organisation counts as private cloud regardless of how it is provisioned or how long a request takes to fulfil.
- **C.** Yes, since it is not open to the general public and therefore falls under the private cloud model by elimination.
- **D.** No, because private cloud requires third-party hosting, which this arrangement lacks entirely, leaving it outside every NIST model.

### 38.

`umount /mnt/data` fails with "target is busy." What is the correct next step, as opposed to reaching for `umount -l`?

- **A.** `umount -l` is always the correct fix for a busy target, since it forces the unmount immediately
- **B.** Reformat the filesystem, since "busy" indicates it is corrupted — `umount` reports a target as busy only after its superblock consistency check fails
- **C.** Use `lsof` or `fuser` to find the process holding the filesystem open, and stop or redirect it before unmounting
- **D.** Reboot the machine, since a busy mount cannot be resolved without a restart

### 39.

A library moves from version 1.4.2 to 2.0.0. What does that number alone tell a consumer, and what would 1.5.0 have told them instead?

- **A.** Both signal the same underlying thing, a version increase, since which position changed is only a formatting convention rather than a promise.
- **B.** 2.0.0 signals a backward-incompatible change to the public API; 1.5.0 would have signalled new but backward-compatible functionality.
- **C.** 2.0.0 means the artifact was pushed to a different registry, and 1.5.0 means it stayed in the original one.
- **D.** 2.0.0 means the previous version can no longer be rolled back to, and 1.5.0 means it still can be.

### 40.

Which file descriptor numbers correspond to standard input, standard output and standard error, in that order?

- **A.** 0, 1 and 2
- **B.** 1, 2 and 3
- **C.** 0, 2 and 1, with error coming before output
- **D.** There are no fixed numbers; they vary by which shell is running

### 41.

A requirement reads: route requests for one URL path to one group of servers and everything else to another. Which class of load balancer can satisfy it, and why can the other class not?

- **A.** Either class works equally well, since both forward based on the destination port a request arrives on, and a URL path is treated as just another field of that same connection-level information.
- **B.** A DNS-based routing service, since it can direct different names to different server groups.
- **C.** A network ACL, since it can match on the destination path in its rules.
- **D.** A layer 7 load balancer, because it parses the request and can act on the URL path; a layer 4 load balancer forwards by address and port only and never sees the path.

### 42.

A study note attributes the six-step prepare-identify-contain-eradicate-recover-learn sequence to NIST SP 800-61. Is that attribution correct?

- **A.** Yes, and it has appeared unchanged in every revision of NIST SP 800-61 since it was first published.
- **B.** Yes, because NIST SP 800-61 Rev. 3 renamed its four-phase lifecycle into these exact six steps in 2025.
- **C.** No, because the six-step sequence actually comes from the CIA triad's own incident classification scheme, which NIST later adopted wholesale into the Rev. 3 lifecycle.
- **D.** No. That six-step sequence is SANS's model, commonly abbreviated PICERL; no revision of NIST SP 800-61 has ever published it.

### 43.

A batch job is niced all the way down to 19 but a database it is supposedly starving is still slow. `top` shows the machine is not CPU-bound; memory usage is very high and swap activity is heavy. Will renicing the batch job further help?

- **A.** No — nice only biases CPU scheduling, and it does nothing for memory pressure or I/O waits
- **B.** Yes, renicing always frees resources across the board for the higher-priority process
- **C.** Yes, but only if the batch job is also sent SIGSTOP first
- **D.** No, because nice values only take effect immediately after a process starts, not while it runs

### 44.

`lscpu` reports 'CPU(s): 16' on a machine with 8 physical cores and simultaneous multithreading enabled. Is 16 the physical core count?

- **A.** Yes — `lscpu`'s 'CPU(s)' line always reports physical cores regardless of any SMT or hyperthreading settings enabled.
- **B.** The discrepancy means the machine actually has two separate CPU architectures installed side by side on one board.
- **C.** `lscpu` is reporting a fault, since the number of CPUs should always equal the physical socket count exactly, with no legitimate exceptions permitted on real hardware.
- **D.** No. With hyperthreading, the logical processor count exceeds the physical core count; `lscpu` separates sockets, cores, and threads explicitly in its fuller output.

### 45.

A team has assessed a vendor delivery risk, scoring its likelihood and impact and ranking it against other risks. Has the team decided what to do about it?

- **A.** No, because assessment produces a priority order, never an action; deciding to avoid, mitigate, transfer or accept the risk is the separate step of response.
- **B.** Yes — ranking a risk by its likelihood and impact is itself the risk response, since knowing where a risk sits relative to the others already tells the team what to prioritise doing about it.
- **C.** Yes, once the risk is logged in the issue tracker alongside its score.
- **D.** Yes, provided a contingency reserve has already been set aside in the budget.

### 46.

A directory already has `chmod 2770 /srv/shared` applied for a shared team folder. Files that already existed before that change still cannot be edited by other members. What is going on?

- **A.** The setgid bit was not actually applied, since `2770` should have fixed every file in the directory
- **B.** The files need the sticky bit removed before they can be shared — clearing `S_ISVTX` is what lets a directory's group permissions propagate onto entries already inside it
- **C.** The files must individually be given the setuid bit to be shared
- **D.** Setgid inheritance applies only to entries created after the bit was set, not retroactively to existing files

### 47.

A team needs to join their on-premises data centre to a cloud network by Friday, on a small budget, and expects the answer to differ from what they'd choose if predictable bandwidth mattered more than speed of setup. What should they choose, and how does that decision differ from connecting two cloud networks to each other?

- **A.** Peering, since it is the fastest way to join any two networks regardless of where they sit.
- **B.** A site-to-site VPN, since it needs only a public endpoint at each end and can be configured on equipment already owned; connecting two cloud networks instead uses peering, which reaches a network the provider already runs rather than one it does not.
- **C.** A dedicated circuit, since it is always the more secure and therefore correct default choice, whatever the deadline or budget a particular team happens to be working against.
- **D.** Either option, since the choice is really about which addressing scheme each network already uses, and cost or setup time are treated as secondary once the addressing question has been settled, regardless of how tight the deadline or how small the budget actually is.

### 48.

A developer wants to create a branch named `hotfix/login` and start working on it in one step, using the older, more widely recognised form of the command rather than the newer split commands. Which single command does both at once?

- **A.** `git checkout -b hotfix/login`, the pre-2.23 command that both creates and switches to the branch
- **B.** `git branch hotfix/login`, since branch creation is what starts new work
- **C.** `git switch hotfix/login`, since `switch` is the command for moving onto a branch
- **D.** `git tag hotfix/login`, followed by checking that fixed label out to begin editing, since a tag can be checked out the same way a branch can.

### 49.

`systemd-analyze blame` names a unit that took 40 seconds to initialise during a slow boot. Is that unit necessarily the cause of the slow boot?

- **A.** Yes, the slowest unit in `blame`'s output is always what delayed the boot — `blame` reports only the units that sat on the critical chain
- **B.** No, because `blame` only measures time before the kernel finishes loading
- **C.** No, because `blame` requires `daemon-reload` to be run first to produce accurate figures
- **D.** Not necessarily — `blame` ranks duration, not delay; `systemd-analyze critical-chain` shows what actually held boot up

### 50.

`getenforce` reports `Permissive` on a Red Hat host running a web service. A colleague reads this as "SELinux is protecting the service." Is that reading correct?

- **A.** Yes, since `Permissive` means SELinux is active and confining every process on the host, with policy denials both logged and enforced as they occur.
- **B.** No — permissive mode logs what policy would have denied and permits it anyway, so the service is not actually confined.
- **C.** Yes, because `Permissive` is simply AppArmor's name for what SELinux calls `Enforcing`.
- **D.** This cannot be determined from `getenforce` alone; only `aa-status` reveals whether policy is actually being applied.

### 51.

'Which distribution is this' and 'which distribution family is this' are asked about the same server. Do they expect the same answer?

- **A.** No, since the distribution names one specific installable system (for example Ubuntu 24.04), while the family names the packaging lineage it shares with others (the Debian family).
- **B.** Yes — a kernel version determines both the distribution and its family identically, since the exact same kernel build is assumed to ship inside every distribution that uses it at all.
- **C.** No, but only because Arch has no family at all, unlike every other Linux distribution currently in wide use today.
- **D.** No real distinction exists; 'distribution' and 'family' are used interchangeably even in careful technical writing about Linux systems.

### 52.

What does the FHS say a program may assume about the contents of `/tmp` between two separate invocations?

- **A.** That files it wrote there will still be present the next time it runs
- **B.** That files it wrote there are automatically backed up, since `/tmp` is world-writable
- **C.** Nothing, because programs must not assume anything left there is preserved between invocations
- **D.** That files it wrote there will survive a reboot, unlike `/var/tmp` — which the FHS designates as the volatile counterpart, cleared at every system boot

### 53.

Users in a distant region report slow page loads for a media-heavy site while users near the origin report no problem at all. Separately, every user everywhere reports a specific search feature is slow, including users sitting next to the origin. Which symptom is a CDN, such as Amazon CloudFront, the right fix for, and why does it not help the other?

- **A.** The second — a CDN accelerates any slow request regardless of cause, including database queries, once content is placed at the edge — extending the edge’s reach to a class of request it was never built to accelerate, since a query’s own execution time never touches the network at all.
- **B.** The first — a CDN removes geographic distance for the regional symptom; the second is universal, which points at the origin, a query, or another bottleneck that edge caching cannot change.
- **C.** Both equally, since adding edge locations always reduces total request time for every user.
- **D.** Neither — a CDN only ever serves images and video, so a general page-load complaint is out of scope for it entirely.

### 54.

One team is described as having fixed-length two-week cycles, a single ordered backlog, and three defined accountabilities. A second is described as continuous flow with explicit work-in-progress limits and no fixed iteration. Which framework does each describe, and what is the deciding feature?

- **A.** Both describe Scrum, since both are agile frameworks working from a backlog of items to be pulled through.
- **B.** The first describes agile in general, and the second describes one specific framework built beneath it.
- **C.** The first is Scrum and the second is Kanban; the deciding feature is a fixed-length timebox against continuous, work-in-progress-limited flow.
- **D.** The deciding feature is which one has a backlog at all, since only the first maintains an ordered list of work that the team pulls items from as capacity allows.

### 55.

A contractor needs a new Linux account for a six-month engagement. An administrator must create it, confirm the UID the system assigned it, and be ready to remove it entirely once the contract ends. Which sequence of commands does this?

- **A.** Starting from `usermod`, on the belief that it can both create a fresh account and later adjust it, then finishing with `id` and `userdel`
- **B.** The same `useradd` and `userdel` pair, but checking the assigned UID with `whoami` in between
- **C.** Managing the whole lifecycle with `groupadd` and `groupdel` instead, still checking the UID with `id`
- **D.** `useradd` to create the account, `id` to confirm the UID it was assigned, and `userdel` to remove it once the engagement ends

### 56.

A developer pushed `feature/retry` yesterday, and a colleague has already pulled it and started building on top. The developer now wants a cleaner, linear history before merging. Which choice is safe, and which is not?

- **A.** Rebasing is safe as long as the developer includes a clear commit message explaining the rewrite.
- **B.** Rebasing is safe because `git push` will simply merge the two histories back together automatically.
- **C.** Rebasing is unsafe only if the colleague has also committed new work on top of the original commits; a colleague who merely pulled without committing anything further is unaffected either way.
- **D.** Rebasing is unsafe here, because the colleague's clone still holds the original commits, and rewriting them would make the histories diverge even though the content is identical.

### 57.

A request originates from a laptop connected to the corporate VPN. Under a zero-trust architecture, what does that origin grant the request by itself?

- **A.** Nothing, since being on the VPN confers no implicit trust; the request is still authenticated and authorized on its own merits.
- **B.** Full access to any resource reachable from that network segment, since the VPN already authenticated the device.
- **C.** A reduced attack surface — VPN traffic is automatically encrypted end to end.
- **D.** A stronger authentication factor, since VPN connection counts as something you have.

### 58.

What is the practical cost a team accepts by choosing a rolling release over an LTS release?

- **A.** More frequent, active maintenance; updates arrive continuously, and the team must absorb behaviour changes as they land rather than on a scheduled cadence.
- **B.** A shorter support window before the distribution stops receiving any updates whatsoever, forcing a much earlier reinstall than an LTS user would ever expect.
- **C.** A different package manager than the one the distribution family would normally use for its releases.
- **D.** None — rolling releases are strictly an improvement on LTS with no offsetting cost at all worth mentioning.

### 59.

A platform can be given more servers by hand whenever traffic grows, and someone remembers to remove them again once traffic falls. Is the platform elastic?

- **A.** Yes, because capacity is eventually returned to its original level once demand drops — mistaking the eventual return of capacity for the automatic, no-human-involved behaviour the definition actually requires.
- **B.** Yes, since the platform can clearly be given more resources and make use of them.
- **C.** No, because the platform has no defined upper bound on how many servers can be added.
- **D.** No, because elasticity means capacity provisioned and released rapidly and in step with demand, which a cycle waiting on someone to remember is not.

### 60.

`df -h` reports a filesystem at 100% used, but `du -sh /*` on that same mount totals far less. What explains the gap, and what actually fixes it?

- **A.** Search harder for large files with `du`, since some large consumer must be hidden from the first pass.
- **B.** The kernel is caching recently deleted file data in memory and will release the corresponding disk blocks once it comes under memory pressure.
- **C.** Space is held by files deleted while a running process still has them open; identifying and restarting that process releases the blocks.
- **D.** The mismatch is a logging artefact and resolves itself once the logs rotate.

