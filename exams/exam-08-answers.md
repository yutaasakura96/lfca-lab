<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 08 — answers

### 1. B

*sysadmin.best-practices.configuration-management · System Administration Fundamentals :: Best Practices · depth 3 · application*

The tool changes only what the declaration mentions. Anything a hand edit touched outside that scope survives the run untouched, which is why running the playbook and matching the baseline are different claims.

- **A.** Baselines are commonly derived from published benchmarks first and only then held in place by a tool; this reverses that relationship.
- **B.** Correct. "We ran the playbook" is not the same claim as "the host now matches the baseline" for exactly this reason.
- **C.** Compliance with a declared baseline is checked by re-applying the declaration, not by waiting for an alert condition.
- **D.** A declaration only corrects what it mentions; settings outside its scope are left exactly as the hand edit left them.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.configuration-management](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.configuration-management)

### 2. B

*cloud.best-practices.avoid-hardcoded-credentials · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

This is the half-fix trap: moving the key out of source code and into an environment variable, a private repository, or an untracked config file changes where the key is, not what it is — it is still a static, long-lived credential that can be copied once and used until somebody revokes it.

- **A.** A private repository still travels into CI logs, container layers, backups and screenshots; privacy of the repo does not make the key short-lived.
- **B.** Correct. Moving a key between storage locations does not change its nature as a static, long-lived secret.
- **C.** Moving a value into an environment variable does not add rotation; the same static value simply gets read from a different place.
- **D.** An access key carries whatever permissions were attached to it when it was created; relocating it does not change that binding.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.avoid-hardcoded-credentials](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.avoid-hardcoded-credentials)

### 3. A

*linux.command-line.absolute-vs-relative-paths · Linux Fundamentals :: Command Line · depth 3 · discrimination*

A script runs as a child process, and the working directory is a per-process attribute. The child's `cd` changes only its own copy, which disappears when the child exits, leaving the calling shell exactly where it was.

- **A.** Correct. The current working directory is a per-process attribute inherited at fork time; a child changing its own copy has no effect on the parent's.
- **B.** `cd` works normally inside a script; it changes the script's own working directory, it just cannot propagate that change back to the caller.
- **C.** `/var/log` is a standard, near-universal directory; the described behaviour happens whether or not the target exists, because it is about process inheritance.
- **D.** There is no such distinction; `cd -` simply returns to the previous directory and is subject to the same per-process scoping as any other `cd`.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.absolute-vs-relative-paths](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.absolute-vs-relative-paths)

### 4. D

*security.compliance.consequences-of-non-compliance · Security Fundamentals :: Compliance · depth 2 · application*

GDPR Article 58 gives supervisory authorities corrective powers beyond fines, including imposing a temporary or definitive limitation, including a ban, on processing. Because that can stop a business operating altogether, it is often the costlier consequence even when the fine attached is comparatively modest.

- **A.** The fine is the memorable consequence but not necessarily the costliest, because a processing ban can halt operations outright.
- **B.** Article 83's tiers apply whichever figure is higher, not lower, and this option also just restates the fine mechanism rather than explaining why a ban can cost more.
- **C.** HIPAA's 60-day clock governs breach notification to individuals under US law and has no bearing on a GDPR supervisory authority's processing ban.
- **D.** Correct. A processing ban can halt operations outright, which no fine, however large, does on its own.

Study it: [04-security/compliance.md#c-security.compliance.consequences-of-non-compliance](../study-guide/04-security/compliance.md#c-security.compliance.consequences-of-non-compliance)

### 5. D

*devops.containers.container-runtime-and-oci · DevOps Fundamentals :: Containers · depth 2 · application*

The OCI's Runtime, Image, and Distribution specifications are what keep an image built with one tool running unmodified under another; the portability claim is a specification being honoured, not marketing.

- **A.** No such conversion happens; an image is stored and served as the same OCI-compliant artifact regardless of which registry hosts it.
- **B.** Kubernetes never rebuilds images; it pulls the already-built artifact and hands it to the node's runtime to run as-is.
- **C.** The kubelet drives the sequence of pulling and running through CRI, but it does not translate or reformat the image; the runtime consumes standard OCI layers directly.
- **D.** Correct. Portability here is a specification the tools conform to, not a coincidence of two particular products happening to agree with each other.

Study it: [05-devops/containers.md#c-devops.containers.container-runtime-and-oci](../study-guide/05-devops/containers.md#c-devops.containers.container-runtime-and-oci)

### 6. C

*pm.functional-analysis.requirements-elicitation · IT Project Management Fundamentals :: Functional Analysis · depth 2 · recall*

Elicitation is the work of drawing requirements out of people — interviews, workshops, observation, document study — rather than collecting requirements that already exist in finished form. A team that only transcribes what it was asked for can build exactly that and still fail the people who asked.

- **A.** Diagramming a workflow is a distinct technique with its own artifact; elicitation is not defined by which artifact it produces.
- **B.** Naming that gap is a separate, later technique; elicitation is about drawing needs out of people, not comparing two already-described states.
- **C.** Correct. Users describe solutions they have imagined and workarounds become invisible to the people performing them, so the requirements have to be drawn out rather than transcribed.
- **D.** The word choice is deliberate: 'gathering' presumes the requirements are already there to be picked up, which is exactly the assumption elicitation exists to reject.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.requirements-elicitation](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.requirements-elicitation)

### 7. A

*sysadmin.best-practices.standardization · System Administration Fundamentals :: Best Practices · depth 2 · recall*

Standardization keeps machines of the same role configured alike so a fix, script or runbook applies to more than one host. The snowflake is the failure case: a hand-built server that works, that nobody dares touch, and whose configuration is recorded nowhere else.

- **A.** Correct. That is the failure named by the practice: a one-off machine nobody dares touch because nothing about it is recorded elsewhere.
- **B.** That describes drift within a managed host, a narrower failure than a host that was never brought under management at all.
- **C.** That is a security-baseline shortfall, a compliance question distinct from whether the host is configured like its peers at all.
- **D.** One manual patch does not make a host unmanageable; the problem is a host whose configuration lives only on itself.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.standardization](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.standardization)

### 8. D

*cloud.best-practices.multi-zone-deployment · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

Scope is the trap here. Multi-zone protects against a single datacentre location failing inside one region; the region itself, and the data-residency question of which region to use, are separate matters a multi-zone design does not settle.

- **A.** Multi-zone deployment is not the same as taking a backup; it protects live capacity, not a retained independent copy.
- **B.** Multi-zone is confined to one provider and one region; it is not a multi-cloud arrangement.
- **C.** Zone-level redundancy has a limit at the region boundary; it does not scale up to protect against every outage.
- **D.** Correct. Regions are isolated from each other with no automatic replication, so surviving a whole-region loss needs a multi-region design instead.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.multi-zone-deployment](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.multi-zone-deployment)

### 9. B

*sysadmin.disaster-recovery.high-availability-vs-disaster-recovery · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

Availability engineering removes single points of failure inside a site. Recovery engineering assumes the site is gone. Cancelling the second because the first exists leaves the organisation exposed to exactly the event the second was bought for.

- **A.** This is the substitution the comparison exists to prevent.
- **B.** Correct. The two mechanisms address different failure scopes, so one cannot replace the other.
- **C.** Data loss targets are governed by copy frequency and are not a property of clustering.
- **D.** Returning work to a recovered member is ordinary cluster behaviour.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery)

### 10. C

*linux.command-line.case-sensitivity · Linux Fundamentals :: Command Line · depth 2 · application*

On the filesystems Linux normally runs on, filenames are compared byte for byte, so `Config.yaml` and `config.yaml` are two different names. A script that names one while the actual file is the other fails with an error that reads like a missing file rather than a spelling difference.

- **A.** Dotfile visibility is a display convention affecting `ls`, not a factor in whether a script can open a file it names directly by an exact path.
- **B.** Linux attaches no meaning to a filename extension at all, so an extension mismatch would not itself explain "No such file or directory."
- **C.** Correct. `File.txt` and `file.txt` are different files on the filesystems Linux normally uses, so a script referring to one case variant fails with an error that reads like a missing file rather than a spelling difference.
- **D.** A permissions problem produces "Permission denied," not "No such file or directory," so the wording of the error points at a naming mismatch rather than access control.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.case-sensitivity](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.case-sensitivity)

### 11. C

*security.compliance.controls-and-evidence · Security Fundamentals :: Compliance · depth 3 · application*

Controls are classified by function as preventive, detective or corrective, and by nature as administrative, technical or physical. NIST SP 800-53 Rev. 5’s SI-7 is exactly this mechanism: integrity verification tools that detect unauthorised changes and then take a separately defined action. A monitor that notices and reports without blocking or reversing is a technical, detective control.

- **A.** The monitor reports after the change has already occurred; nothing described blocks it from happening.
- **B.** The scenario describes only the alert itself; nothing about the monitor performs the restoration that would make it corrective.
- **C.** Correct. NIST SP 800-53 Rev. 5’s SI-7 employs integrity verification tools to detect unauthorised changes, and NIST SP 800-100 characterises selected controls as preventive or detective in nature.
- **D.** The monitor itself is a technical mechanism enforced by the system, not a documented human process.

Study it: [04-security/compliance.md#c-security.compliance.controls-and-evidence](../study-guide/04-security/compliance.md#c-security.compliance.controls-and-evidence)

### 12. C

*sysadmin.networking.curl-and-wget · System Administration Fundamentals :: Networking · depth 3 · application*

A `curl` exit status of 0 means the transfer completed, not that the HTTP status was 2xx — the status code has to be read separately, or `--fail` used to make an HTTP error result in a non-zero exit, which is exactly the check a monitoring script needs instead of relying on exit status alone.

- **A.** Exit status 0 reports that the transfer itself completed without a connection-level error; it says nothing about whether the HTTP status code returned was a success code or an error code.
- **B.** `wget` has the same distinction between transfer completion and HTTP status; switching tools does not resolve the underlying need to check the status code or use an equivalent flag separately.
- **C.** Correct. A transfer can complete successfully at the connection level while the server returns an HTTP error status such as 404 or 500; exit code 0 alone does not distinguish those cases from a genuine success.
- **D.** Combining `-I` does not change what exit status 0 reports; a HEAD request can also return an HTTP error status while the transfer itself still completes and exits 0.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.curl-and-wget](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.curl-and-wget)

### 13. D

*devops.containers.container · DevOps Fundamentals :: Containers · depth 3 · command*

A container is created with `docker run` and its lifecycle state is queried with `docker ps`, whose default output filters to running containers only; `-a` includes everything, including containers whose main process already exited.

- **A.** `docker run` always creates a new container and would fail on a name collision rather than revealing the missing one.
- **B.** A container never becomes an image on its own; `docker images` lists templates, not instances.
- **C.** Stopping is not removing: an exited container keeps its writable layer and configuration until something explicitly removes it.
- **D.** Correct. The `-a` flag includes stopped containers, which the default view omits entirely.

Study it: [05-devops/containers.md#c-devops.containers.container](../study-guide/05-devops/containers.md#c-devops.containers.container)

### 14. D

*cloud.budgeting.budgets-and-cost-alerts · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

A budget is not a spending cap. Crossing a threshold notifies a person; it stops no resource and refuses no API call unless an administrator explicitly configured a budget action to do so, and an exam option claiming otherwise is wrong by default.

- **A.** This is the assumption the trap exists to catch — a threshold breach is a message, not an enforcement action, unless a budget action was deliberately configured in advance.
- **B.** Budgets do not identify or delete resources; finding and removing an orphan is a separate, evidence-based practice using inventory, not a budget behaviour.
- **C.** A free-tier allowance and a budget threshold are unrelated instruments; crossing one has no effect on the size of the other.
- **D.** Correct. A budget is not a spending cap: nothing about crossing a threshold halts a running resource or refuses the next API call unless an administrator explicitly configured an action.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.budgets-and-cost-alerts](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.budgets-and-cost-alerts)

### 15. B

*linux.command-line.command-syntax · Linux Fundamentals :: Command Line · depth 3 · application*

Short options take one hyphen and a single letter, and may be clustered behind one hyphen, so `ls -la` is exactly `ls -l -a`. Long options take two hyphens and a whole word and may never be clustered this way. Written without clustering, the same request is `ls -l`.

- **A.** Clustering does not fold case; `-a` and `-A` are different options with different meanings for dotfiles.
- **B.** Correct. Short options take one hyphen each and may be clustered behind a single hyphen, so `-la` is exactly `-l -a`.
- **C.** A single hyphen introduces a cluster of short options; a long option always needs two hyphens.
- **D.** Every letter after the single hyphen is parsed as its own clustered option, not as text handed to the command.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-syntax](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-syntax)

### 16. C

*pm.open-source-software-and-licensing.copyleft-licenses · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · discrimination*

"Viral" is a pejorative, not a term of art, and it misdescribes the mechanism: copyleft is a condition on an act of distribution, triggered deliberately when a covered or combined work is conveyed to someone else.

- **A.** Storage proximity triggers nothing; only conveying a combined or modified work to someone else triggers the obligation.
- **B.** Linking mechanism can affect whether two programs form one combined work, but it does not make the underlying "spreads by contact" description accurate.
- **C.** Correct. The obligation attaches to conveying, which is a deliberate act, and never to proximity or contact alone.
- **D.** The licence governs the work as conveyed; removing the dependency removes any basis for the obligation to have attached going forward.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.copyleft-licenses](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.copyleft-licenses)

### 17. B

*sysadmin.networking.dig-and-nslookup · System Administration Fundamentals :: Networking · depth 4 · application*

Ignoring the status line, NOERROR with an empty ANSWER section means the name exists but has no record of the type asked for, which is not the same as NXDOMAIN — reading the status field first (NXDOMAIN, SERVFAIL, or NOERROR with an empty answer) is exactly the recommended second diagnostic step after confirming naming is the fault, before reaching for terser output such as `dig +short` once the record is confirmed to exist.

- **A.** NOERROR and NXDOMAIN are distinct status codes with different meanings; an empty ANSWER section under NOERROR specifically means the name exists without that record type, not that the name is absent.
- **B.** Correct. Ignoring the status line and conflating an empty-answer NOERROR with NXDOMAIN is a documented mistake; the former confirms the name exists, just not with the queried record type, which points the investigation somewhere different.
- **C.** `+short` prints just the answer data when a record exists; it is not what causes an empty ANSWER section here, and the scenario is about interpreting the status line, not about a missing flag.
- **D.** The distinction between NOERROR (with an empty answer) and NXDOMAIN applies to any record type, not specifically or only to MX; the two statuses always carry different meanings.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dig-and-nslookup](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dig-and-nslookup)

### 18. D

*sysadmin.networking.firewall · System Administration Fundamentals :: Networking · depth 3 · application*

A stateful firewall tracks connections, so a rule permitting outbound traffic implicitly permits the replies, which is why a host with no inbound allows can still browse the web — this is the standard default-deny-inbound posture working as intended, not evidence that no protection exists. `ufw status` and `firewall-cmd --list-all` are the commands that show this policy on Debian-family and Red Hat-family systems respectively.

- **A.** Browsing the web working is expected stateful behaviour, not evidence the firewall is inactive; an unsolicited inbound connection attempt, unlike a reply to outbound traffic, would still be blocked by default-deny.
- **B.** Web traffic is not specially exempted from firewall inspection; the reason it works is ordinary stateful tracking of outbound-initiated connections, applicable to any protocol, not an HTTP-specific bypass.
- **C.** NAT rewrites addresses and is commonly co-located with a firewall, but the mechanism permitting the reply traffic here specifically is stateful firewall inspection, not NAT's address translation itself.
- **D.** Correct. The standard posture is default-deny inbound with explicit allows, and stateful inspection is why outbound-initiated traffic still works without any inbound rule needing to exist for the replies.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.firewall](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.firewall)

### 19. A

*security.security.brute-force-and-credential-stuffing · Security Fundamentals :: Security · depth 3 · recall*

OWASP's three related credential attacks differ in how attempts are spread: brute force tests many passwords against one account, credential stuffing replays known-valid pairs from another breach, and password spraying tests one weak password against a large number of different accounts, which is what lets it hide inside normal login traffic.

- **A.** Correct. The guide defines spraying by that inverted spread — one guess across many accounts — which is precisely what makes it hide inside normal login traffic as effectively as stuffing does.
- **B.** Spraying and brute force both guess; only credential stuffing replays credentials already known to be valid rather than guessing.
- **C.** Exhaustively targeting a single account describes brute force; spraying deliberately spreads a single guess across many accounts instead.
- **D.** MFA is named as the defence covering all three attacks; a strong password policy alone does not reliably stop any of them, spraying included.

Study it: [04-security/security.md#c-security.security.brute-force-and-credential-stuffing](../study-guide/04-security/security.md#c-security.security.brute-force-and-credential-stuffing)

### 20. D

*cloud.budgeting.rightsizing · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

The observation window is the part of rightsizing usually got wrong: a week that misses month-end close, payroll, or a seasonal campaign recommends a size that fails the first time those arrive, converting a cost problem into a performance incident.

- **A.** Monitoring reports spend and trend after the fact; it does not itself catch a flawed observation window before a resize decision is made from it.
- **B.** Storage tiering is a separate mechanism governing object storage cost classes and is not a consequence of resizing compute capacity.
- **C.** Rightsizing is iterative rather than a one-time project, because both the workload and the provider's instance catalogue keep changing — treating one week as sufficient is the trap.
- **D.** Correct. An observation window that misses a real peak, like month-end close, recommends a size that fails the first time that peak recurs, converting a cost decision into a performance problem.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.rightsizing](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.rightsizing)

### 21. C

*linux.command-line.file-management-commands · Linux Fundamentals :: Command Line · depth 3 · application*

`ln -s` records exactly the text it is given as the link's target. A relative target is resolved relative to the link's own directory, not the directory the operator was standing in when they ran the command, so `ln -s config.yaml /etc/app/current.yaml` points at `/etc/app/config.yaml`.

- **A.** That is precisely the assumption the guide warns against; the target is resolved relative to the link's own directory, not the creator's working directory.
- **B.** `ln -s` accepts a relative target without complaint; it simply records the text and resolves it later relative to the link's location, which can silently produce an unintended path.
- **C.** Correct. `ln -s` records exactly the text it is given, and a relative target is resolved relative to the directory the *link* lives in, not the directory the operator was standing in when they created it.
- **D.** `PATH` lookup applies to locating executable commands, not to resolving a symlink's stored target text.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-management-commands](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-management-commands)

### 22. A

*devops.containers.volumes-and-bind-mounts · DevOps Fundamentals :: Containers · depth 3 · command*

Writing the source as an existing host path in `-v source:/path/in/container` produces a bind mount, which depends on and directly reflects the host's own directory structure — ideal for mounting source code into a development container.

- **A.** Correct. A bind mount ties the container directly to a chosen host path, which is exactly what lets an editor on the host affect files the container sees immediately.
- **B.** A named volume lives in a location Docker manages on its own, independent of any project directory, so host edits to source files never reach it.
- **C.** An environment variable configures the application's own settings; it cannot mount a host directory into the container's filesystem.
- **D.** Rebuilding on every edit defeats the instant-reflection requirement and is exactly the workflow a bind mount exists to avoid.

Study it: [05-devops/containers.md#c-devops.containers.volumes-and-bind-mounts](../study-guide/05-devops/containers.md#c-devops.containers.volumes-and-bind-mounts)

### 23. B

*sysadmin.networking.loopback-address · System Administration Fundamentals :: Networking · depth 3 · application*

Loopback is the sharpest fault-localiser available: a service that answers on 127.0.0.1 but not from another machine is proven to be running, which narrows the remaining suspects to a listening-address binding, a firewall rule, or routing between the two hosts.

- **A.** A working loopback response specifically rules out the service being down or broken, narrowing the search to binding, firewall or routing issues between the hosts.
- **B.** Correct. A working loopback response proves the service is alive and functioning; the fault must therefore lie between the two hosts rather than in the service process itself.
- **C.** 127.0.0.1 is a literal address, not a name, so a loopback test using it involves no DNS resolution at all and cannot eliminate a DNS suspect.
- **D.** Loopback traffic never reaches a physical interface at all, so it exercises no cabling and cannot eliminate cabling as a suspect for a remote-client failure.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.loopback-address](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.loopback-address)

### 24. B

*cloud.cloud-computing.cloud-migration-approaches · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · recall*

AWS's prescriptive guidance names the seven strategies as retire, retain, rehost, relocate, repurchase, replatform, and refactor or re-architect. Repurchase — sometimes called drop and shop — is specifically the strategy of replacing an application with a different product or version, typically SaaS; 'replace' is not the term AWS uses, and this guide corrects that exact error.

- **A.** 'Replace' is not one of the seven strategies AWS names; the strategy for swapping an application for a different product is repurchase, which AWS also calls drop and shop.
- **B.** Correct. AWS's own term is repurchase; the guide flags this specifically because the term is easy to misremember as 'replace.'
- **C.** Relocate specifically leaves the application's architecture untouched; it does not involve swapping the application for a different product.
- **D.** Refactor rebuilds the existing application for the cloud; it does not describe dropping the application in favour of a different product.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-migration-approaches](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-migration-approaches)

### 25. A

*pm.open-source-software-and-licensing.open-source-community-roles · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 1 · recall*

Responsibility increases along the chain from user to contributor to committer to maintainer, and it is earned by merit within the project. The concrete line between contributor and committer is write access to merge changes.

- **A.** Correct. Write access, earned by merit rather than employment or seniority, is the concrete distinction between the two roles.
- **B.** Mechanics differ by project, not by role; either mechanism can be used by a contributor or a committer, depending on the project's workflow.
- **C.** Committer status is earned by merit and demonstrated contribution, not by employment status at the hosting foundation.
- **D.** The chain is earned by merit within the project, not by outside seniority or employment, which is exactly what the role structure is designed to keep separate.

Study it: [06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-community](../study-guide/06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-community)

### 26. B

*sysadmin.networking.router-vs-switch · System Administration Fundamentals :: Networking · depth 3 · application*

Every port on a plain switch is in the same broadcast domain, so a switch floods a frame to every port when the destination is unknown or is the broadcast address; a router does not forward broadcasts at all, because it terminates the broadcast domain rather than extending it.

- **A.** The broadcast MAC address, ff:ff:ff:ff:ff:ff, is never learned as belonging to a single port; a switch floods it to every port instead of forwarding it selectively.
- **B.** Correct. A switch extends a single broadcast domain across all its ports, while a router is the boundary of a broadcast domain and does not forward broadcasts onward by default.
- **C.** A switch does not drop broadcasts as a security measure by default; flooding to every port on the shared broadcast domain is its ordinary, expected behaviour.
- **D.** The outcome is precisely the difference between the two devices: a switch floods a broadcast across its domain while a router terminates the broadcast domain and does not forward it.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.router-vs-switch](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.router-vs-switch)

### 27. A

*security.security.denial-of-service · Security Fundamentals :: Security · depth 3 · application*

Blocking the source IP is a valid response to a single-source denial of service, but a distributed attack has no single address whose removal stops it — upstream scrubbing, rate limiting, and added capacity are the distributed answers. Confidentiality and integrity may remain entirely intact throughout, so a data-recovery response does not apply.

- **A.** Correct. The distributed form defeats the naive single-IP response precisely because there is no single source address to block, which is why the guide names scrubbing and rate limiting instead.
- **B.** A denial of service is not a data breach; confidentiality and integrity may be entirely intact, so a restore from backup is not the relevant response to a pure availability attack.
- **C.** Volumetric and amplification-based denial of service exhausts resources through traffic volume, not through exploiting a named defect that patching would fix.
- **D.** Disk encryption protects data confidentiality at rest and has no bearing on a network capacity or connection exhaustion attack.

Study it: [04-security/security.md#c-security.security.denial-of-service](../study-guide/04-security/security.md#c-security.security.denial-of-service)

### 28. B

*linux.command-line.getting-help · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`--help` output is compiled into the binary, so it works even where man pages are separately installed files a minimal image chose to omit.

- **A.** `info` manuals are Texinfo files, a different format from a compiled-in `--help` summary, and neither depends on the other.
- **B.** Correct. A man page is a separate installed file under the manual hierarchy — man(1) lists `/usr/share/man` among its FILES — so a stripped image can leave it out entirely, while the `--help` text is produced by the program itself and ships inside the binary.
- **C.** `apropos` searches the manual index database, which a stripped image would be missing along with the pages themselves, and it plays no part in producing a program's `--help` output.
- **D.** The scenario states `--help` printed a usage summary, so it did not fail, and no such caching or replay happens here.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.getting-help](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.getting-help)

### 29. B

*sysadmin.networking.ufw-firewalld-and-iptables · System Administration Fundamentals :: Networking · depth 3 · application*

`firewall-cmd` distinguishes the runtime configuration from the permanent one: a change without `--permanent` is lost at the next reload, and a `--permanent` change does not take effect until `firewall-cmd --reload`, so adding a rule with `--permanent` and expecting it active immediately is exactly the trap in this scenario.

- **A.** A `--permanent` rule specifically does not take effect immediately; it is written to the permanent configuration only, requiring `firewall-cmd --reload` to activate it in the running policy.
- **B.** Correct. firewalld separates the runtime configuration from the permanent one, and firewall-cmd(1) states that --permanent changes are not effective immediately, only after a service restart, a reload, or a reboot; forgetting the reload is the most commonly failed practical detail in this topic.
- **C.** A rule added without an explicit `--zone` applies to the default zone rather than being discarded; the actual missing step here is reloading to activate the permanent configuration.
- **D.** Restarting the HTTPS service itself has no bearing on whether firewalld's permanent rule has been reloaded into the active runtime configuration; the missing step is `--reload`, not a service restart.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ufw-firewalld-and-iptables](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ufw-firewalld-and-iptables)

### 30. C

*cloud.cloud-computing.iaas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

IaaS gives the customer fundamental resources — compute, storage, network — and leaves the guest operating system, from the boot loader upward, entirely to them: the same patch cadence and the same responsibility as a physical server. PaaS moves that OS-and-runtime ownership beneath the provider's line, which is the single boundary the guide identifies as separating the two models.

- **A.** This swaps the two models — installing and patching your own guest OS is IaaS, and runtime choice is a PaaS-level concern, not what separates A from B here.
- **B.** Billing granularity is an implementation detail of either model and is not the responsibility boundary the scenario is testing.
- **C.** Correct. NIST gives the IaaS consumer 'control over operating systems' and denies the PaaS consumer control of 'the underlying cloud infrastructure including network, servers, operating systems' — OS ownership is exactly that boundary.
- **D.** Nothing in the scenario mentions containers, and PaaS is defined by the deployment relationship, not by any particular packaging technology.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.iaas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.iaas)

### 31. C

*devops.devops-basics.rolling-deployment · DevOps Fundamentals :: DevOps Basics · depth 3 · recall*

A Kubernetes Deployment's strategy type is RollingUpdate unless set otherwise; the only alternative is Recreate, which kills all existing Pods before creating any new ones and so accepts downtime that RollingUpdate is designed to avoid.

- **A.** RollingUpdate is the default, and Recreate has no second environment at all; it simply removes and replaces Pods in place.
- **B.** Restoring a previous revision describes a rollback action, not the Recreate strategy, which only governs how new Pods replace old ones.
- **C.** Correct. This is the stated default and its only named alternative, with the downtime trade-off that separates them.
- **D.** Recreate does not avoid downtime at all; it removes every existing Pod before any replacement exists.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.rolling-deployment](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.rolling-deployment)

### 32. B

*sysadmin.system-administration.daemon-reload · System Administration Fundamentals :: System Administration · depth 3 · discrimination*

`systemctl daemon-reload` takes no unit argument because it is a manager-wide operation: it re-reads every unit file and rebuilds the dependency graph. `reload <unit>` asks one running application to re-read its own configuration, and `restart <unit>` merely stops and starts the process — neither touches the cached unit definitions.

- **A.** That command asks the *nginx process itself* to re-read its own application configuration file — it does nothing to systemd's cached unit definitions.
- **B.** Correct. It is a manager-wide operation, unlike the other two, which each act on one named unit rather than on the set of unit definitions itself.
- **C.** Restart stops and starts the process using whatever unit definition the manager already has cached; it does not re-parse the unit file.
- **D.** They are three genuinely different operations — re-reading unit definitions, asking an application to reload its own configuration, and stopping and starting a process — not scoped variants of one action. `daemon-reload` starts and stops nothing.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.daemon-reload](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.daemon-reload)

### 33. C

*linux.command-line.redirection · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

`>` sends standard output to a file, creating it or truncating it to zero length as soon as the shell sets up the redirection — before the command has run and regardless of whether it would have succeeded. `sort file > file` therefore empties the file first and sorts nothing. The equivalent operator for errors alone is `2>`, leaving standard output untouched.

- **A.** `sort` never gets the chance to fail on this; the shell has already emptied the file during redirection setup, before `sort` even starts.
- **B.** No disk error is needed to explain this; `>` truncating its target before the command runs is a routine, well-documented behaviour that fully accounts for the empty file.
- **C.** Correct. `>` opens and truncates its target to zero length as part of setting up the redirection, which happens before the command runs — so `sort` opens an already-empty file to read from.
- **D.** The scenario specifies `>`, which truncates; `>>` would have appended and left the original content in place rather than emptying it.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.redirection](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.redirection)

### 34. C

*security.security.digital-certificates-and-certificate-authorities · Security Fundamentals :: Security · depth 3 · recall*

A root certificate's trust does not come from its own signature — it signed itself, which proves nothing on its own. It comes from being a trust anchor already present in the operating system's or browser's trust store; a chain that terminates anywhere else fails no matter how well-formed it is.

- **A.** Self-signing is not a stronger form of signature; the root's authority comes entirely from being pre-installed as a trust anchor, not from the signature's mathematics.
- **B.** TLS validates the chain against certificates already in the local trust store; it does not consult a central registry during the handshake.
- **C.** Correct. The root's trustworthiness comes from being included in the operating system's or browser's trust store, since a self-signature alone proves nothing about the signer's honesty.
- **D.** Validation walks the whole chain up to a trust anchor; a chain that never reaches one already in the store fails, however well-formed the intermediate signature is.

Study it: [04-security/security.md#c-security.security.digital-certificates-and-certificate-authorities](../study-guide/04-security/security.md#c-security.security.digital-certificates-and-certificate-authorities)

### 35. A

*pm.project-management.acceptance-criteria · IT Project Management Fundamentals :: Project Management · depth 3 · application*

Acceptance criteria are meant to be agreed before work starts and stated as pass/fail conditions, precisely so that whether an item is complete does not have to be argued about afterward. Changing them once implementation is underway removes the property that made them useful in the first place.

- **A.** Correct. Criteria drafted before work starts let 'complete' be decided objectively; changing them after implementation begins turns that decision into something argued about instead.
- **B.** Revising criteria whenever convenient defeats their purpose, which is to fix in advance what 'complete' means for that item.
- **C.** Both are meant to be agreed before the relevant work begins; the Definition of Done being team-wide doesn't make per-item criteria any less settled in advance.
- **D.** This item is about criteria drafted for one story, not about routing a scope change through the project's formal change process.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.acceptance-criteria](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.acceptance-criteria)

### 36. C

*sysadmin.system-administration.filesystem-hierarchy-standard · System Administration Fundamentals :: System Administration · depth 3 · application*

The FHS reserves `/usr/local` as the parallel tree for software the local administrator builds and installs, kept separate from everything the package manager owns under `/usr`. `/opt` is the related but distinct convention for self-contained third-party packages with their own tree.

- **A.** The package manager treats everything under `/usr/bin` as its own; placing locally compiled software there risks it being overwritten by the next package update.
- **B.** `/opt` is for self-contained third-party packages that keep their own directory tree, a different pattern from software built to install into the normal hierarchy.
- **C.** Correct. The `/usr/local` tree exists precisely so locally built software cannot be overwritten by a package update to the rest of `/usr`.
- **D.** Locally compiled software is static once installed, not data that grows at runtime, so it does not belong under `/var`.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.filesystem-hierarchy-standard](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.filesystem-hierarchy-standard)

### 37. A

*cloud.cloud-computing.private-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

A private cloud is still, first and foremost, a cloud: the five essential characteristics must hold before the question of which deployment model applies even arises. A virtualized cluster with a manual ticket process, no elasticity and no metering fails that first test entirely, so it is not a private cloud — it is simply a virtualized datacentre.

- **A.** Correct. Private cloud is still cloud computing first; the essential characteristics must hold before the private-versus-public distinction is even relevant.
- **B.** On-premises and dedicated to one organisation are necessary but not sufficient; the environment must also meet the essential characteristics, which this one plainly does not.
- **C.** Not being open to the public rules out only public cloud, not the possibility that this is not a cloud at all — process failures on self-service and elasticity are the actual disqualifier.
- **D.** NIST allows the organisation itself to own, manage and operate a private cloud; third-party hosting is not required, so this is not the disqualifying factor here.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.private-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.private-cloud)

### 38. C

*sysadmin.system-administration.mounting · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

`umount` fails with "target is busy" while any process holds a file open on that filesystem or has its working directory inside it. `lsof` or `fuser` names the offending process, which should be addressed directly rather than using `-l` (lazy unmount) to paper over the underlying cause.

- **A.** umount(8) describes `-l` as detaching the filesystem now and cleaning up references only once it is no longer busy, and warns that a reboot may be needed afterwards — it defers the problem rather than identifying the process causing it.
- **B.** umount(8) attributes a busy target to ordinary conditions — open files on the filesystem, a process whose working directory is there, or a swap file in use — with no consistency check involved and nothing implied about corruption.
- **C.** Correct. A busy target means some process still has a file open there or has its working directory inside it; finding and addressing that process resolves the cause rather than papering over it.
- **D.** Identifying and stopping the process holding the mount open resolves this without any reboot being necessary.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.mounting](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.mounting)

### 39. B

*devops.devops-basics.semantic-versioning · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

Semantic versioning is what makes a version number carry information rather than merely increase. A major bump signals a breaking change to the public API; a minor bump signals new, backward-compatible functionality.

- **A.** Treating the scheme as mere formatting rather than a contract is the exact error the concept exists to catch.
- **B.** Correct. MAJOR and MINOR carry distinct information by design; this is exactly the contract semantic versioning makes.
- **C.** Where an artifact is stored has nothing to do with what its version number encodes about API compatibility.
- **D.** Version numbering does not govern what remains retrievable for rollback; that depends on retention in the registry.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.semantic-versioning](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.semantic-versioning)

### 40. A

*linux.command-line.standard-streams · Linux Fundamentals :: Command Line · depth 3 · recall*

Every process starts with three file descriptors: 0 is standard input, 1 is standard output, and 2 is standard error. These are numbers, not files — what they connect to is decided by whoever started the process.

- **A.** Correct. These are the three numbered descriptors every process starts with: 0 is standard input, 1 is standard output, and 2 is standard error.
- **B.** Descriptor numbering starts at 0 for standard input, not 1; shifting the numbers by one misassigns all three streams.
- **C.** Standard output is descriptor 1 and standard error is descriptor 2; this swaps the two, which is a common but incorrect pairing.
- **D.** The numbering 0, 1 and 2 is a fixed Unix convention that every shell and program relies on, not something that varies by shell.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.standard-streams](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.standard-streams)

### 41. D

*cloud.networking.cloud-load-balancer-types · Cloud Computing Fundamentals :: Networking · depth 2 · recall*

A layer 7 load balancer parses the request and can therefore make decisions on hostname, URL path, headers, or cookies, while a layer 4 balancer forwards connections by address and port alone.

- **A.** A URL path is not a port number — it is part of the HTTP request itself, which only a layer 7 balancer reads; a layer 4 balancer has no visibility into it at all.
- **B.** DNS resolves names to addresses before a connection even starts; it cannot make a per-request decision based on a URL path arriving after the connection is already open.
- **C.** A network ACL filters by address, port and protocol at the network layer; it has no concept of an HTTP path, which is application-layer content.
- **D.** Correct. This matches the documented split: layer 7 reads the request, layer 4 does not.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cloud-load-balancer-types](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cloud-load-balancer-types)

### 42. D

*security.security.incident-response · Security Fundamentals :: Security · depth 2 · recall*

The six-step prepare, identify, contain, eradicate, recover, learn sequence — commonly abbreviated PICERL — is SANS's model. NIST SP 800-61 Rev. 2 used a distinct four-phase lifecycle, and Rev. 3 (April 2025) replaced that with the six CSF 2.0 Functions, a different six-item list built around cybersecurity risk management broadly rather than one incident's tactical handling.

- **A.** This misattribution is exactly what the guide flags as routinely made; the six-step sequence is SANS's PICERL, not a NIST SP 800-61 model at any revision.
- **B.** Rev. 3 replaced the four-phase lifecycle with the six CSF 2.0 Functions — Govern, Identify, Protect, Detect, Respond, Recover — a different six-item list from PICERL, not a renaming of it.
- **C.** The CIA triad classifies which security property an incident affects; it is not the source of any incident-response process sequence.
- **D.** Correct. The guide corrects this exact misattribution: Rev. 2 used a four-phase lifecycle and Rev. 3 replaced that with the six CSF 2.0 Functions, neither of which is PICERL.

Study it: [04-security/security.md#c-security.security.incident-response](../study-guide/04-security/security.md#c-security.security.incident-response)

### 43. A

*sysadmin.system-administration.process-priority-and-nice · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Nice is a scheduling bias, not a reservation, and it affects only how CPU time is allocated when the CPU is contended. A machine that is memory-bound and swapping heavily has a different bottleneck entirely, and no amount of renicing addresses memory pressure or I/O wait.

- **A.** Correct. Nice is a bias on who wins CPU time when the CPU is contended; on a machine limited by memory rather than CPU, adjusting it changes nothing.
- **B.** A nice value affects scheduling priority only; it has no mechanism for reclaiming memory or reducing I/O wait for any other process.
- **C.** Stopping the job would free some memory temporarily, but that is a different action from renicing and not what the question is asking about.
- **D.** `renice` is specifically designed to change the nice value of an already-running process, so timing after start is not the issue here.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.process-priority-and-nice](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.process-priority-and-nice)

### 44. D

*linux.linux-operating-system.cpu · Linux Fundamentals :: Linux Operating System · depth 3 · application*

'Number of CPUs' is ambiguous between sockets, physical cores, and logical processors — with hyperthreading, logical count exceeds physical cores. `lscpu`'s fuller output separates these explicitly, avoiding the misreading.

- **A.** That line reports logical processors, which include SMT threads; reading it as physical cores is exactly the misreading the guide warns about.
- **B.** Nothing about SMT implies multiple architectures; hyperthreading multiplies the logical count on a single architecture's physical cores.
- **C.** This is expected, correct behaviour for a system with SMT enabled; it is not a fault, and 'CPU(s)' was never defined to mean socket count.
- **D.** Correct. This is the guide's own trap: 'number of CPUs' is ambiguous between sockets, physical cores, and logical processors, and 16 here counts logical processors.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.cpu](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.cpu)

### 45. A

*pm.project-management.risk-management · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

Risk management is a continuing cycle of identifying, assessing, responding to and monitoring risks. Assessment scores likelihood and impact to produce a priority order; it never itself produces an action. Response is the separate step of choosing to avoid, mitigate, transfer or accept each ranked risk, typically with a contingency reserve set aside if an accepted risk materialises.

- **A.** Correct. Assessment scores likelihood and impact so risks can be ranked; response is the distinct activity of deciding what to actually do about the ranked ones.
- **B.** Ranking sorts risks against each other; it doesn't select avoid, mitigate, transfer or accept for any of them.
- **C.** An issue tracker is for things that have already happened; a risk is an uncertain future event, and logging its score there doesn't select a response.
- **D.** A contingency reserve is one possible outcome of choosing to accept a risk — setting it aside doesn't happen before a response is actually chosen.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.risk-management](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.risk-management)

### 46. D

*sysadmin.system-administration.sgid · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

Setgid on a directory affects only entries created after the bit is set; existing files keep whatever group and mode they already had. The fix for pre-existing files is a one-time `chgrp` and `chmod` pass, after which the setgid bit keeps everything new consistent going forward.

- **A.** The mode was applied successfully to the directory; the symptom is expected, because setgid never rewrites existing entries.
- **B.** The sticky bit restricts deletion, not editing, and has nothing to do with whether teammates can write to a file.
- **C.** Setuid on a regular file changes which identity it runs as if executed; it has no bearing on ordinary read/write sharing of data files.
- **D.** Correct. The bit changes what happens at creation time; it has no effect on files that were already present in the directory.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.sgid](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.sgid)

### 47. B

*cloud.networking.hybrid-connectivity · Cloud Computing Fundamentals :: Networking · depth 3 · application*

A site-to-site VPN needs only a public endpoint at each end and is a configuration task on equipment already owned, making it the fit for a short deadline and small budget; a dedicated circuit trades that speed for predictability.

- **A.** Peering connects two networks the same cloud provider already runs; an on-premises data centre is outside the provider's cloud entirely, so peering has no path to it at all.
- **B.** Correct. This matches the stated constraints — short lead time, small budget — and correctly separates hybrid connectivity from peering.
- **C.** 'More secure' is not a single axis here: a dedicated circuit gives a private path but does not itself encrypt payload, and it has to be physically provisioned by a connectivity provider — far too slow for a Friday deadline on a small budget.
- **D.** Addressing scheme choice matters for avoiding an overlap either way, but it is not what discriminates between a VPN and a dedicated circuit — cost and setup time, which the scenario supplies directly, are.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.hybrid-connectivity](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.hybrid-connectivity)

### 48. A

*devops.git-concepts.branch · DevOps Fundamentals :: Git Concepts · depth 3 · application*

`git switch -c <name>` and the older `git checkout -b <name>` were both built to create a branch and switch to it in one step; `switch` and `restore` were added in Git 2.23 specifically to split `checkout`'s two unrelated jobs — moving between branches and restoring file contents — into separate commands, but the older combined form still works the same way.

- **A.** Correct. This is the older, overloaded `checkout` form of create-and-switch, equivalent for this purpose to `git switch -c`, which was added later to split the job.
- **B.** This creates the pointer but leaves HEAD on the current branch; it does not switch, so it does not satisfy "start working on it."
- **C.** Plain `switch` moves to a branch that already exists; without `-c` it refuses when the named branch is not there yet, rather than creating it.
- **D.** A tag is a fixed label meant to mark a point such as a release; checking one out leaves you in detached HEAD with no branch to advance as you commit.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.branch](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.branch)

### 49. D

*sysadmin.system-administration.systemd · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

systemd activates units in parallel wherever the dependency graph allows, so `blame`'s ranking by duration does not show what was actually on the critical path. `systemd-analyze` alone reports the total boot time split by phase, and `systemd-analyze critical-chain` follows the ordering chain that determined when boot actually converged.

- **A.** Because units start in parallel wherever dependencies allow, the slowest individual unit is not automatically the one that held up the critical path; `blame` ranks every unit by its own initialisation time and does not restrict its output to the critical chain.
- **B.** `blame` measures each unit's own initialisation time during userspace startup, not a kernel-only phase.
- **C.** `blame` reads recorded startup timing from the completed boot; it has no dependency on `daemon-reload` being run beforehand.
- **D.** Correct. A slow unit that nothing else waits on can run fully in parallel and cost nothing, so duration alone does not identify the bottleneck.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd)

### 50. B

*security.security.selinux-and-apparmor · Security Fundamentals :: Security · depth 3 · command*

SELinux being enabled and SELinux being enforcing are different claims, and `getenforce` is what distinguishes them. Permissive mode logs what policy would have denied and permits it anyway, so a service running under it is not actually confined despite SELinux being active.

- **A.** This is precisely the misreading the guide corrects: `Permissive` means denials are logged but still allowed, which is not confinement.
- **B.** Correct. The guide names this exact trap: `getenforce` distinguishes enabled from enforcing, and permissive mode is explicitly not protection despite still being active.
- **C.** `Permissive` is one of SELinux's own three modes alongside `enforcing` and `disabled`; it is not an AppArmor term at all.
- **D.** `getenforce` is exactly the command that reports SELinux's mode; `aa-status` reports AppArmor's state instead and would not apply to this Red Hat host's SELinux question.

Study it: [04-security/security.md#c-security.security.selinux-and-apparmor](../study-guide/04-security/security.md#c-security.security.selinux-and-apparmor)

### 51. A

*linux.linux-operating-system.linux-distribution · Linux Fundamentals :: Linux Operating System · depth 3 · discrimination*

A distribution is one specific product a person installs. A family is the packaging lineage several distributions share. RHEL and Fedora being 'different distributions in the same family' only makes sense once that distinction is held separately.

- **A.** Correct. Granularity is the separating axis: a distribution is a singular product, a family is a category spanning several products.
- **B.** Kernel version identifies neither a distribution nor its family on its own; the kernel is one component shared across an entire family.
- **C.** Arch does belong to a family — its own, built around `pacman` and a rolling model — so this is not the reason the two questions diverge.
- **D.** The exam tests this precisely because they are not interchangeable — RHEL and Fedora are different distributions in the same family, which only makes sense if the terms differ.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.linux-distribution](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.linux-distribution)

### 52. C

*sysadmin.system-administration.tmp · System Administration Fundamentals :: System Administration · depth 2 · recall*

The FHS is explicit that programs must not assume anything in `/tmp` is preserved between invocations, and on most systems it is cleared on reboot or aged out by a cleanup service — `/var/tmp` is the FHS location for temporary data that must survive a reboot instead.

- **A.** That assumption is exactly what the FHS says a program must not make about `/tmp`, whose contents are treated as disposable.
- **B.** World-writable and backed-up are unrelated properties; nothing about `/tmp` implies any backup guarantee.
- **C.** Correct. The FHS is explicit on this point, and on many systems `/tmp` is cleared on reboot or actively aged out, reinforcing that nothing there should be relied upon to persist.
- **D.** The FHS assigns those roles the other way round: section 5.15 is titled "/var/tmp : Temporary files preserved between system reboots" and requires that its contents "must not be deleted when the system is booted", while it is `/tmp` whose deletion at boot is recommended.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.tmp](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.tmp)

### 53. B

*cloud.performance-availability.content-delivery-network · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

The symptom that identifies a CDN is specific: distant users slow, nearby users fine — a distance problem no amount of origin capacity fixes. A universal slowdown present even beside the origin is not a distance problem, so an edge cache changes nothing about it.

- **A.** A CDN serves cacheable content from the edge; a search query's own execution time on the origin is unaffected by where static content is cached.
- **B.** Correct. A CDN answers a distance problem specifically; a slowdown that is uniform everywhere, including at the origin, is not a distance problem.
- **C.** The universal symptom is present even next to the origin, which is exactly what a distance problem does not look like — the fix has to be elsewhere.
- **D.** A CDN typically serves static objects, which does include page assets like images, so the regional symptom described is a standard case for one.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.content-delivery-network](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.content-delivery-network)

### 54. C

*pm.project-management.scrum · IT Project Management Fundamentals :: Project Management · depth 3 · discrimination*

Scrum organises work into fixed-length Sprints with a Product Owner, Scrum Master and Developers; Kanban manages the same kind of work as continuous flow, limited by explicit work-in-progress caps rather than a timebox. The presence or absence of a fixed iteration boundary is the reliable discriminator between the two.

- **A.** Only the first description matches Scrum's fixed-length Sprint and three accountabilities; the second has neither and matches Kanban instead.
- **B.** Scrum is itself a framework beneath agile's values, not agile-in-general; the first description names a specific framework, just as the second does.
- **C.** Correct. Fixed timebox versus continuous flow with WIP limits is the standard axis the exam turns this comparison on.
- **D.** Kanban also maintains an ordered backlog of work to be pulled — a backlog isn't what separates the two.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.scrum](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.scrum)

### 55. D

*sysadmin.system-administration.user-account · System Administration Fundamentals :: System Administration · depth 3 · application*

A named identity is created with `useradd`, its assigned UID is confirmed with `id`, and it is removed with `userdel` once no longer needed. `usermod` changes an existing account rather than creating one, and `whoami` reports the caller rather than a named account.

- **A.** A common slip: `usermod` only changes an account that already exists, so nothing is created by reaching for it first.
- **B.** `whoami` reports the identity of whoever is running the command, not the UID of the account just created.
- **C.** That pair manages a group, not a user account, so nothing about the contractor's login is created at all.
- **D.** Correct. Each command matches the stage it is used at: creation, confirmation, and eventual removal of the account.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.user-account](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.user-account)

### 56. D

*devops.git-concepts.rebase · DevOps Fundamentals :: Git Concepts · depth 3 · discrimination*

Rebase does not undo anything and does not resolve a conflict by itself; it changes where commits sit in history by replacing them, which is exactly what separates it from revert and reset. That replacement is why rebasing a branch other people have already pulled is discouraged: the colleague's repository still contains the discarded originals, so the two histories have diverged even with identical content.

- **A.** A message describes intent but does not change the mechanics: the colleague's repository still contains commits that no longer exist upstream, regardless of how the rewrite is explained.
- **B.** A plain push refuses this exact situation as a non-fast-forward rejection, because the remote holds commits that are no longer ancestors of the rewritten branch; nothing merges automatically.
- **C.** Divergence happens the moment the colleague's repository holds the pre-rebase commits at all; whether they have since added their own commits changes how painful reconciling is, not whether the histories diverged.
- **D.** Correct. Rebase discards the original commit objects and manufactures replacements; anyone who already pulled the originals now has a repository that disagrees with the rewritten branch.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.rebase](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.rebase)

### 57. A

*security.security.zero-trust · Security Fundamentals :: Security · depth 2 · recall*

Zero trust grants no request implicit trust based on where it came from. A device being on the VPN or inside the corporate network confers nothing by itself; each request is still authenticated, authorized, and evaluated against policy on its own merits.

- **A.** Correct. Zero trust removes exactly this assumption: network location, including being on a VPN, does not grant access by itself.
- **B.** This is the perimeter-model assumption zero trust exists to remove; VPN membership is not treated as sufficient for access to anything.
- **C.** Attack surface is about what is reachable at all, a separate concept from whether a request is implicitly trusted by its origin.
- **D.** Being on a network is not treated as an authentication factor in the NIST model; every request is still evaluated against policy independently.

Study it: [04-security/security.md#c-security.security.zero-trust](../study-guide/04-security/security.md#c-security.security.zero-trust)

### 58. A

*linux.linux-operating-system.lts-vs-rolling-release · Linux Fundamentals :: Linux Operating System · depth 2 · recall*

Rolling releases ship continuously with no version to freeze, trading stability for currency. That currency has to be actively managed, which is the real cost against an LTS track that changes only on a scheduled, security-focused basis.

- **A.** Correct. The trade-off is explicit: rolling systems run the newest software at the cost of needing more frequent, active maintenance.
- **B.** Support windows and end-of-life dates are an LTS-track concept; a rolling release has no comparable fixed support window to fall short of.
- **C.** Release policy does not change which package manager a distribution uses; Arch's `pacman` is tied to the distribution, not to being a rolling release.
- **D.** The guide frames this explicitly as a trade-off, not a strict improvement: currency is gained at the cost of stability and maintenance burden.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.lts-vs-rolling-release](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.lts-vs-rolling-release)

### 59. D

*cloud.performance-availability.scalability-vs-elasticity · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · recall*

Elasticity adds automation and bidirectionality on top of scalability: capacity must be provisioned and released without a human deciding each time. A platform that only scales when someone remembers to act on it both ways is scalable, not elastic.

- **A.** NIST defines rapid elasticity as capabilities "elastically provisioned and released, in some cases automatically, to scale rapidly outward and inward commensurate with demand"; capacity that comes back whenever a person next remembers is neither rapid nor commensurate with demand.
- **B.** Being able to grow with more resources is the definition of scalability, which elasticity implies but is not itself sufficient for.
- **C.** An unbounded ceiling is a property of horizontal scaling's headroom, not the reason this platform falls short of elastic.
- **D.** Correct. Elasticity is scalability plus two things: automation, and capacity being released again as demand falls.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.scalability-vs-elasticity](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.scalability-vs-elasticity)

### 60. C

*sysadmin.troubleshooting.disk-full · System Administration Fundamentals :: Troubleshooting · depth 4 · application*

`df -h` and `du -sh /*` answer different questions — filesystem accounting versus a directory-tree walk — and they legitimately disagree when space is held by a file that has been deleted but is still open. The fix is closing or restarting the process holding the descriptor, not finding a bigger file to delete.

- **A.** No amount of searching finds space held by deleted-but-open files, because they no longer have a name for any file search to match.
- **B.** Page cache reclaim is a memory mechanism and has no bearing on filesystem block accounting for an open-but-unlinked file.
- **C.** Correct. An unlinked file's blocks stay allocated until the last open descriptor closes, which makes it invisible to `du` because its name is already gone from the tree.
- **D.** Log rotation renames or truncates files; it does not release blocks held open by a process that is still writing to the old descriptor.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.disk-full](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.disk-full)

