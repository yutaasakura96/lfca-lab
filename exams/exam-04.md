<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 04

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-04-answers.md](exam-04-answers.md)

---

### 1.

A configuration script is re-run against a host and reports that zero changes were made. What does that result indicate?

- **A.** The configuration-management tool has failed to detect drift, since a healthy tool is expected to report and correct differences every run.
- **B.** The system already matched the intended state; a no-op second run is the signal of success, not evidence the tool did nothing useful.
- **C.** An alerting threshold has not yet been crossed, which belongs to a separate practice concerned with notifying someone of a breached condition.
- **D.** The script has not yet been validated in a staging environment, which is a question about where it was tested rather than what it changed.

### 2.

An employee leaves the company. Their cloud IAM identity is deleted the same day, but their `sshd` login on a production instance still works two weeks later. What was missed?

- **A.** The employee's role should have carried a permissions boundary that would have survived the deletion and blocked the login.
- **B.** The Linux user account on the instance is governed separately from the IAM identity; deleting one does not remove the other.
- **C.** The IAM identity should have been federated through an identity provider rather than deleted directly.
- **D.** Nothing was missed — deleting the IAM identity removes every login the employee had, cloud control plane and guest operating system alike.

### 3.

In `a && b || c`, `a` succeeds but `b` then fails. Which commands actually ran, and why does this chain not behave like an if/then/else?

- **A.** Only `a` and `b` ran; `c` never runs once `a` has already succeeded
- **B.** Only `a` ran, since its success short-circuits the rest of the line entirely
- **C.** The chain raises a syntax error, since `&&` and `||` cannot be combined on one line
- **D.** All three ran, because `||` also reacts to `b`'s failure, not just `a`'s

### 4.

A vendor answers a due-diligence request by saying 'we have multi-factor authentication enabled, and a written policy requiring it.' What is still missing before an assessor can credit the control as audited?

- **A.** Evidence the control actually operated during the stated period; an audit examines evidence, not assurances or documented intent.
- **B.** Nothing further; the enabled setting plus the written policy together are exactly what counts as evidence of a control operating.
- **C.** A signed statement from the vendor's chief executive personally attesting that the control works as described.
- **D.** Confirmation of whether the control is classified as preventive rather than detective in the vendor's own internal control catalogue and taxonomy.

### 5.

A new pod remains stuck in a not-starting state, and every node in the cluster is already running workloads near its resource limit. What level does this problem resolve to?

- **A.** The registry level, since a pod that cannot start is always evidence that the image it references failed to be pulled from the registry named in its manifest.
- **B.** The node level, because no node has enough spare resource capacity for the scheduler to place the pod, which is exactly the constraint it schedules against.
- **C.** The container level, since the pod's individual containers must each be resized before the pod as a whole can be scheduled.
- **D.** The Service level, since a stable network endpoint must exist before the scheduler will place any pod behind it.

### 6.

Which of these is a well-formed non-functional requirement?

- **A.** The system shall let a user search by keyword, with no bound on how quickly results return.
- **B.** Search performance is listed as a Must have on the delivery backlog.
- **C.** The search feature must be fast and pleasant for users to work with.
- **D.** 95% of search requests shall complete within 300 ms under normal load.

### 7.

A change is applied inside an agreed maintenance window but was never reviewed or approved beforehand. Is the change authorised?

- **A.** No. A window states only when disruptive work may occur, not whether it may happen at all.
- **B.** Yes — being inside the agreed window is itself the authorisation.
- **C.** Only if the change's requestor is also its approver.
- **D.** Yes, provided the change is routine rather than an emergency fix.

### 8.

A workload adopts an immutable deployment model, where every release launches fresh instances from a new image and terminates the old ones. It has been writing user file uploads to the instance's own local disk. What happens at the next deployment?

- **A.** Nothing changes, since automation over manual configuration already externalises application state as part of applying a template.
- **B.** The files migrate automatically to the replacement instances, because the platform transparently mirrors local disk contents between old and new instances for the duration of a blue/green rollout.
- **C.** Nothing changes, because 'immutable' means the data already on the instance cannot be modified once it is written.
- **D.** The uploaded files are lost, because replacement destroys everything stored locally on the instance and nothing external retained a copy.

### 9.

A team gathers to walk through the recovery plan verbally, without touching production systems. What is this?

- **A.** A tabletop drill, which is a legitimate form of exercise.
- **B.** Not a drill at all, because no systems were actually failed over to the standby.
- **C.** Restore testing conducted at low cost.
- **D.** A failback rehearsal for the standby site.

### 10.

A crontab carries the environment line `ARCHIVE=~/archive`, and the job that later uses `$ARCHIVE` fails because the path stays literally `~/archive`. A `..` written into that same value resolves normally. Why does the tilde fail where `..` does not?

- **A.** Cron treats `~` as a comment character and discards the rest of the line
- **B.** `..` is also unreliable in a crontab, so the job likely fails for a different reason entirely
- **C.** `~` only expands inside double quotes, and the crontab line was unquoted
- **D.** `~` is shell syntax, and cron assigns that line's value verbatim without a shell

### 11.

A CVE is published for a package installed on your fleet. What separates the attack-surface question from the vulnerability-and-patching question raised by this event?

- **A.** There is no real difference; reducing attack surface and patching a CVE are two names for the same remediation.
- **B.** Attack surface concerns confidentiality only, while a CVE and its patch always concern availability.
- **C.** Attack surface asks how much is exposed at all, independent of any particular defect; patching addresses this one named defect specifically.
- **D.** Attack surface is measured by a vulnerability scanner, while a CVE is only ever found by an intrusion detection system.

### 12.

Which single property separates a backup from a local volume snapshot?

- **A.** The backup is taken at a point in time; the snapshot is continuous.
- **B.** The backup can be restored; the snapshot cannot be restored from.
- **C.** The backup is compressed; the snapshot is stored uncompressed.
- **D.** The backup is independent of the original storage; the local snapshot is not.

### 13.

An application inside a container writes its own log file to `/var/log/app.log` instead of standard output, and `docker logs web` shows nothing useful. What is the fix, and which command exposes the problem?

- **A.** Reconfigure the application to log to stdout and stderr; `docker exec -it web sh` can confirm the file exists inside the container while the platform never sees it.
- **B.** Run `docker logs -f` instead of the plain form, since `-f` widens what the command reads to include log files written anywhere inside the container's own filesystem, not just its output stream.
- **C.** Mount a volume at `/var/log` so the file becomes visible to `docker logs` automatically once it is outside the writable layer.
- **D.** Set `-e LOG_PATH=/var/log/app.log` so the runtime knows where to redirect the captured stream from.

### 14.

Which instrument is built to answer 'what will this architecture cost, before any of it is built'?

- **A.** Cost monitoring, since it reports the actual spend once the architecture is running.
- **B.** A budget alert, since it flags spend as soon as it crosses a defined threshold.
- **C.** A pricing calculator, since it estimates cost from a proposed configuration before deployment.
- **D.** The free tier, since spending nothing during the allowance answers the question by direct observation.

### 15.

`dig app.internal` returns the correct address, but the application on the same host still fails to resolve the same name. Where should the investigation look, given what `dig` does and does not consult?

- **A.** `/etc/hosts` and the resolver configuration, since `dig` queries DNS directly and skips them
- **B.** The DNS server itself, since a successful `dig` proves the server is misconfigured
- **C.** The application's TCP port bindings, since `dig` and name resolution are unrelated to sockets
- **D.** Nowhere further — a successful `dig` result guarantees the application will resolve the name too

### 16.

Why does Creative Commons itself recommend against using its licences for software?

- **A.** Because Creative Commons licences are fully compatible with every OSI-approved software licence, making the recommendation against them redundant rather than a real concern.
- **B.** Because content licensed under any Creative Commons variant can never be redistributed for commercial purposes.
- **C.** Its licences address neither source-code distribution nor patent rights, and most variants are not compatible with the major software licences.
- **D.** Because none of the Creative Commons licences, including the CC0 public domain dedication, are considered open at all.

### 17.

An engineer wants `/etc/hosts` to alias `web01.example.com` and also create an MX record pointing mail at a different host. Which of these can `/etc/hosts` actually express?

- **A.** Only the name-to-address alias; `/etc/hosts` can map a name (and aliases) to an address, but it has no record types at all and cannot express an MX record or anything beyond a literal mapping.
- **B.** Both — `/etc/hosts` supports the full range of DNS record types, including MX, provided each entry is written on its own line.
- **C.** Neither — `/etc/hosts` can only be used for the special name `localhost` and cannot hold any custom name-to-address mapping at all.
- **D.** Only the MX-style mail routing entry — `/etc/hosts` was designed specifically for mail routing, and general name-to-address mapping was only added to its line format much later, during the BSD era.

### 18.

A UDP-based service shows a socket in the ESTAB state under `ss`. A colleague treats this as proof a negotiated connection with a remote peer exists, the same as it would for TCP. Is that a safe reading?

- **A.** Yes — ESTAB means exactly the same thing for UDP as it does for TCP: a fully negotiated, bidirectionally confirmed connection with the remote peer.
- **B.** No. A UDP socket showing ESTAB only records that its application called `connect()` to fix a default peer locally; unlike TCP, it involved no handshake and proves nothing about the far end.
- **C.** No, but only because UDP sockets are never permitted to display ESTAB at all, so the tool output itself must be misreporting the socket's actual state.
- **D.** Yes, but only if the socket is also shown holding a LISTEN state at the same time, which together would confirm a genuine remote conversation.

### 19.

A distributed denial-of-service attack takes a public web service offline for six hours. Investigators confirm no record was read or altered. Which leg of the CIA triad was violated, and is this properly classified as a security incident?

- **A.** Availability was violated; yes, an attack-caused outage is a security incident even though nothing was read or changed.
- **B.** Nothing was violated — no confidentiality or integrity breach occurred, so the outage is purely an operations matter.
- **C.** Integrity was violated, because the service being unreachable means its data can no longer be trusted.
- **D.** Confidentiality was violated, since an outage prevents authorised parties from confirming their data is still private.

### 20.

One clean sentence is supposed to separate pay-as-you-go from on-demand pricing. Which sentence is it?

- **A.** Pay-as-you-go is the charging principle; on-demand is the specific no-commitment purchase option priced under it, and the baseline reserved and spot are discounted from.
- **B.** On-demand is the charging principle; pay-as-you-go is simply one purchase option chosen among several.
- **C.** Pay-as-you-go is a total-cost calculation performed once per project; on-demand is a single recurring line item counted within that larger calculation.
- **D.** They are two names for exactly the same thing, so the distinction between them is purely terminological and safe to ignore in practice.

### 21.

In `cat /etc/shadow | sudo grep root`, run by an unprivileged user, the command fails before `grep` even has a chance to search. Why does prefixing only `grep` with `sudo` not help?

- **A.** `sudo` applies to the entire pipeline once used anywhere in it, because privilege elevation propagates outward to every stage a pipe connects
- **B.** `sudo` in a pipeline applies only to the stage it prefixes, and `cat` runs unprivileged and fails first
- **C.** Pipelines cannot contain privileged commands under any circumstances
- **D.** `grep` cannot read piped input when combined with `sudo`, regardless of position

### 22.

`docker run -p 8080:80 api` is used, and the mapping direction is confirmed correct, yet nothing answers on host port 8080. Inspecting the application shows it listening on `127.0.0.1:80` inside the container. What is the cause?

- **A.** `-p` was written correctly, but it additionally requires `-P` alongside it before either mapping takes effect.
- **B.** The container was created from a stopped state with `docker start`, which does not re-apply port mappings from the original run That framing gets the mechanism backward: `docker start` reapplies the mappings recorded when the container was first created.
- **C.** The image's `Dockerfile` never declared `EXPOSE 80`, so the runtime refuses to forward traffic to that container port.
- **D.** The application is bound to the container's own loopback interface, which is unreachable from outside the container regardless of a correct publish mapping.

### 23.

A private network with no internet connection at all is being designed. A reviewer insists NAT must still be configured "because private addresses always need it." Is the reviewer right?

- **A.** Yes — any use of RFC 1918 addressing requires NAT to be configured somewhere in the design, whether or not the network in question ever reaches the internet at all, regardless of which distribution or vendor is involved.
- **B.** Yes, but only because private addresses are treated as inherently invalid unless a NAT device is present somewhere on the path to validate them first.
- **C.** No, but only because a firewall, not NAT, is what private addresses actually require before they can be used at all.
- **D.** No. Private versus public is a classification of the address itself, while NAT is a rewriting action performed for internet reachability; a network with no internet access needs no NAT at all.

### 24.

An engineer proposes calling an architecture 'hybrid cloud' because it uses both a self-hosted Kubernetes cluster — with no self-service provisioning, no metering and manual capacity planning — and a public cloud provider, connected by a VPN. Is the label accurate?

- **A.** Yes — connecting any on-premises infrastructure to a public cloud by VPN is what makes an architecture hybrid, whatever the on-premises side is capable of, and the VPN supplies the standardised technology the definition asks for.
- **B.** Yes, and this is better described as multi-cloud specifically, since two distinct platforms are involved and each is administered separately.
- **C.** No. The self-hosted cluster is not itself a cloud, since it lacks the essential characteristics such as self-service and metering, so there is only one cloud infrastructure in this picture, not the two or more NIST's composition requires.
- **D.** Yes, because Kubernetes provides the portability layer NIST's binding condition requires — and that condition is the only one the definition imposes.

### 25.

Which single fact separates a permissive licence from a copyleft one?

- **A.** Whether the licence permits commercial use at all — permissive licences allow it freely and copyleft licences forbid it outright in every circumstance.
- **B.** Whether the licence conditions the licence of a derivative work: a permissive licence does not, while a copyleft licence requires the same terms to carry forward on distribution.
- **C.** Whether the licence is compatible with the GPL — permissive licences are always fully compatible with it, and copyleft licences are never compatible with one another at all, under any circumstances.
- **D.** Whether the licence has been approved by the Open Source Initiative — permissive licences are approved by it and copyleft licences never are.

### 26.

A monitoring tool reports that "the handshake failed" for a UDP-based service. Is that a meaningful statement?

- **A.** Yes — every transport protocol, TCP and UDP alike, performs an equivalent handshake before any data is exchanged between two hosts.
- **B.** Yes, but only because the monitoring tool is referring to the TLS handshake layered on top of the UDP service rather than to the TCP handshake.
- **C.** No. UDP has no handshake at all, so "the handshake failed" can never accurately describe a UDP service; the report itself reflects a misunderstanding of the transport in use.
- **D.** No, but only because the report should instead say "the three-way handshake succeeded but the fourth confirmation message was lost" for a UDP service, since UDP completes its own setup exchange in four messages rather than three.

### 27.

A strong perimeter firewall protects a flat internal network. Once an attacker gets past that perimeter, what stops them from reaching every other host inside?

- **A.** On a flat network, nothing; segmentation is the control that limits lateral movement once inside, and the perimeter firewall alone does not provide it.
- **B.** The same perimeter firewall, since its rule set is re-evaluated continuously against every internal connection too, with each host-to-host flow inside the network hairpinned back through it for inspection.
- **C.** Full disk encryption on each host, since an encrypted disk cannot be reached from elsewhere on the network.
- **D.** SSH hardening on the perimeter firewall's own management interface.

### 28.

An application running as user `svc` gets "Permission denied" opening `/srv/app/data/config.yaml`, which is mode 644 and owned by `svc`. Working outward from the file, what should be checked next, and why might the file's own mode be irrelevant to the failure?

- **A.** Whether the file has been renamed, since a rename would explain a permission error
- **B.** The group ownership only, since 644 already grants the owner full access
- **C.** The execute bit on every directory in the path, since a missing `x` on any parent blocks traversal regardless of the file's own mode
- **D.** Whether the filesystem is mounted read-only, since a read-only mount refuses to open any file on it

### 29.

A remote worker connects to a VPN and is told they now behave, for addressing and routing purposes, as though attached to the private network directly. What does that description actually mean in practice?

- **A.** It means the client's own physical network interface is temporarily relocated to the private network's physical location for the duration of the connection, as if the network card itself changed sites.
- **B.** It means DNS records for the private network are automatically republished to the public internet for the duration of the client's VPN session.
- **C.** It means a virtual interface appears on the client and routes are installed pointing some or all destinations through the encrypted tunnel, so private-network resources are reached as though the client were physically on that network.
- **D.** It means the client's MAC address is reassigned to match one already registered on the private network's local switch infrastructure.

### 30.

Three teams describe their setup: Team X writes application code and pushes it to a platform that runs the OS and language runtime beneath it. Team Y only signs in, configures settings and uploads data into a finished application they did not write. Team Z registers individual functions that start on an event and shut down when idle. Which team is using PaaS, and what single fact distinguishes it from the other two?

- **A.** Team Y — PaaS is distinguished by needing no deployment artifact at all, only configuration of an application the provider already runs.
- **B.** Team Z — PaaS is distinguished by billing only for the duration code actually runs, so an idle platform costs nothing.
- **C.** Team X — PaaS is distinguished by the team never having to select a runtime version, because the provider pins it for them.
- **D.** Team X, since PaaS is distinguished by deploying application code the consumer wrote, unlike Team Y's finished application or Team Z's per-event functions.

### 31.

A team plans to handle rising load on a stateful workload the same way they scale their stateless API — simply run more replicas. Why does this not work as cleanly?

- **A.** It works identically for both, since replicas of any workload become fully interchangeable with one another as soon as they are started from the same container image.
- **B.** It fails because stateful workloads cannot be containerized at all and must run directly on bare metal.
- **C.** Scaling a stateful workload is a data problem, not a scheduling one, since each replica would need its own persistent storage and possibly a stable identity.
- **D.** It fails because Docker enforces a hard limit of one replica per stateful container, unlike stateless ones.

### 32.

What is the difference between `chown alice file` and `chown alice: file`?

- **A.** The bare form changes only the owning user; the trailing colon also sets the group to `alice`'s login group
- **B.** There is no difference — `chown` strips a trailing colon before parsing the operand, exactly as it ignores a trailing slash on a pathname
- **C.** `chown alice: file` changes the group only, leaving the owning user untouched
- **D.** `chown alice: file` requires `alice` to already own the file, unlike the bare form

### 33.

A value prints correctly with `echo $BACKUP_DIR` at the interactive prompt, but a script invoked from that same shell reports the variable as empty. What is the most likely cause?

- **A.** Scripts always run with a completely empty environment, regardless of exports
- **B.** The variable was assigned but never exported, so it never left the interactive shell
- **C.** The script needs to be run with `sudo` before it can see any variables, because a child process only receives an environment when it runs as root
- **D.** The variable name is case-sensitive in the script but not at the prompt

### 34.

A cron job runs nightly maintenance as root because that was the simplest way to get it working, and nobody has revisited the decision since. What does this violate, and what does that violation actually cost if the job is ever compromised?

- **A.** It is not a violation — least privilege applies only to human accounts, not to cron jobs and other automated processes running under service identities.
- **B.** It violates least privilege, and the cost is that a bug in the job becomes a root-level compromise instead of one confined to an unprivileged account.
- **C.** It violates defense in depth, since a single overprivileged job removes one layer from the stack.
- **D.** It violates accounting, because a root cron job cannot be attributed to a specific person.

### 35.

A team ships the first version of a feature with reduced test coverage and no documentation, in order to hit a deadline sooner. Is that an MVP?

- **A.** No — an MVP minimises scope, not quality; a release built to a lower standard than the team's usual bar is a defect-laden release, not a minimum viable product.
- **B.** Yes, since 'minimum' means the smallest amount of engineering rigour needed to ship something at all, and rigour beyond that point is generally considered wasted effort on a first release.
- **C.** Yes, provided the missing tests and documentation are added to a future Definition of Done.
- **D.** Only if the feature was originally requested through a properly written user story.

### 36.

An administrator runs `getent passwd alice` and sees `x` in the second field. What does that field actually hold today?

- **A.** The account's password hash, still stored here as the field name suggests
- **B.** Nothing usable — it is a placeholder, and the real password hash lives in `/etc/shadow`
- **C.** The number of days until the password expires — the field was repurposed for ageing data once the hashes themselves moved out to `/etc/shadow`
- **D.** The account's primary GID, encoded as the letter `x`

### 37.

A platform needs to isolate ten workloads, one of which requires a Windows kernel while the other nine are fine on Linux, all on shared physical hardware. Why does this requirement rule out containers for at least one workload, and what technology does it point to instead?

- **A.** Containers rule this out because they cannot run on shared physical hardware at all, so each of the ten workloads would need a dedicated physical server of its own.
- **B.** This points to a cloud-computing solution rather than a virtualization one — only cloud platforms can mix operating system families on shared hardware.
- **C.** A container shares the host kernel, so it cannot supply a different operating system family than the host — the Windows workload needs virtualization, giving it its own kernel.
- **D.** This points to a hypervisor product recommendation, specifically a type 2 hypervisor for the Windows workload, because only a hosted hypervisor can give a guest a kernel that differs from the host's.

### 38.

A service will not start. What is the diagnostic order across `systemctl status`, `journalctl -u <unit> -b`, and `journalctl -p err -b`?

- **A.** `systemctl status <unit>` for the last few lines and exit status, then `journalctl -u <unit> -b` for everything that unit logged this boot, then `journalctl -p err -b` to widen the search to any failing dependency
- **B.** `journalctl -p err -b` first, since severity filtering always finds the root cause fastest regardless of scope, and narrows to the failing unit by itself
- **C.** `journalctl -u <unit> -f` first, to watch it fail live before checking anything else — `-f` replays everything the unit logged during this boot and only then begins following new entries as they arrive
- **D.** `journalctl -p err -b` alone is sufficient, and the other two commands add nothing a severity-wide sweep of the current boot has not already surfaced

### 39.

The same library ends up installed both through a language package manager and through the operating system's package manager on one machine, at two different versions, and which one an application loads now depends on search order rather than intent. What caused this?

- **A.** A missing container image, since an isolated filesystem is the only mechanism that can prevent two copies of one library from coexisting on a machine.
- **B.** Choosing the wrong manager for the kind of dependency involved, since application-level libraries belong to the language package manager and system-wide software belongs to the operating system's own tool.
- **C.** Nothing unusual, since every distributable package bundles its own metadata, dependency list, and install scripts by design.
- **D.** A version-control conflict, since manifest files and lock files exist specifically to prevent this kind of duplication.

### 40.

A glob pattern `*.txt` and a regular expression are sometimes assumed to mean the same thing because they share the `*` character. What does `*` actually mean in each, and what is the regular-expression equivalent of the glob `*.txt`?

- **A.** `*` means the same thing in both, so `*.txt` is already valid as a regular expression
- **B.** Globs do not use `*` at all; only regular expressions define that character, and the wildcard behaviour glob users see actually comes from filename completion instead
- **C.** In a glob, `*` means "any run of characters"; the regex equivalent of `*.txt` is `.*\.txt`
- **D.** The regex equivalent of the glob `*.txt` is simply `*.txt` written inside anchors

### 41.

Two teams each provisioned their virtual networks independently, and both happened to choose the same private address range. They now want to peer the two networks. What must happen first?

- **A.** Nothing — peering automatically translates addresses on one side to avoid the conflict.
- **B.** Nothing — a more specific route can be added to disambiguate the overlap.
- **C.** One side must be re-addressed — two networks with overlapping ranges cannot be peered or privately connected without it.
- **D.** Nothing, as long as both sides accept the peering request explicitly.

### 42.

An employee leaves the organisation. Under SSO, what single action removes their access to every participating application?

- **A.** Disabling the account at the identity provider, since applications trust its assertion rather than running their own login.
- **B.** Nothing single-handed works; each participating application must have its own account disabled separately.
- **C.** Revoking the employee's MFA enrolment, since SSO and MFA are the same control.
- **D.** Rotating the shared password used across every application.

### 43.

A daemon cannot be signalled to reopen its log file after rotation, but the log still must not grow unbounded. Which `logrotate` directive fits, and what is its cost?

- **A.** `postrotate`, since it is the directive used whenever a daemon cannot be signalled — the script it runs swaps the daemon's open file descriptor from outside the process
- **B.** `copytruncate`, which copies the log aside and truncates the original in place — at the cost of losing whatever is written between the copy and the truncate
- **C.** `compress`, since compressing the rotated file avoids needing to signal the daemon at all
- **D.** `delaycompress`, which defers the problem to the next rotation cycle instead of solving it

### 44.

Which pair of paths best illustrates that devices and ordinary data are reached through the same interface on Linux?

- **A.** `/etc/passwd` and `/etc/shadow`, since both concern user account information specifically and sit in the same configuration directory.
- **B.** `/proc/cpuinfo` and `lscpu`'s output, since both ultimately describe the same CPU information in slightly different formats.
- **C.** `/dev/sda` for a disk device and `/home/user/notes.txt` for a document, both opened, read, and written with the same system calls.
- **D.** Any two paths under `/etc`, since configuration files are the clearest example 'everything is a file' offers to a new user.

### 45.

A sponsor formally requests an additional module. The request is assessed for impact, approved by the sponsor, and the schedule and budget baselines are updated to reflect a two-week extension. Is this scope creep?

- **A.** Yes — any addition to scope after the project has started counts as creep, however it was handled.
- **B.** Yes, because the schedule moved, and any movement of a triple-constraint leg after baselining is creep by definition, however the movement came about or who approved it.
- **C.** No; this is change control working as intended: the change was assessed, decided by someone with authority, and written back into the baseline.
- **D.** It's creep unless the same request would also have been approved without any schedule extension at all.

### 46.

After running `usermod -G developers alice`, `alice` reports she can no longer access files under a project she previously worked on through another group. What happened?

- **A.** Her primary group was changed to `developers`, which does not affect existing file access
- **B.** Nothing changed; supplementary group membership has no effect on file access
- **C.** `-G` without `-a` replaced her entire supplementary group list with just `developers`
- **D.** The other project's group was deleted at the same time by an unrelated cleanup

### 47.

A single, unredundant server reports 99.97% availability over the last quarter, purely by luck — it never happened to be hit by an outage window. A separate service is built with redundant instances across two zones and automatic failover, but had a rough month and only measured 99.5%. Which statement correctly separates what each number shows from what each design achieves?

- **A.** The unredundant server must be the more highly available of the two, since its measured number is larger.
- **B.** The first figure is a measured result that can exist without any high-availability design behind it; the second is a high-availability design that can still miss its own target after a bad month.
- **C.** Both figures describe the same property, so the two services are equally reliable regardless of design.
- **D.** A redundant, automatically-failing-over design is guaranteed to score higher than an unredundant one over any measurement window — treating the design as a promise about the outcome of any single window, rather than about the long-run average it is actually meant to shift.

### 48.

A developer on a Git project loses network access on a train and continues committing, branching and reviewing `git log` for an hour before reconnecting. Why does none of that require the network?

- **A.** Git caches the last few commits locally so short offline sessions work, then reconciles with the server automatically on reconnect, discarding whatever the cache could not hold.
- **B.** A centralized system like Subversion works the same way, since the working copy also stores full history.
- **C.** The developer's machine is temporarily acting as `origin` for the rest of the team.
- **D.** Git is distributed: every clone holds the entire history, so committing, branching and reading the log are local operations.

### 49.

An account has a system-range UID, a nologin shell, and no interactive password set, and it is the identity a database daemon runs under. Which term describes it, and is it automatically unprivileged?

- **A.** A service account — and no, its actual privilege still depends entirely on what it was granted
- **B.** A service account, and yes, service accounts are unprivileged by definition
- **C.** A regular user account, since it belongs to a specific named daemon
- **D.** A group, since it is shared by every process the daemon forks — a UID in the system range is allocated out of the group namespace rather than the user namespace

### 50.

A record is subject to a seven-year tax retention rule and a GDPR storage-limitation obligation to delete once no longer necessary. The data has been unnecessary for two years, but the seven years has not yet elapsed. What must happen to the record right now?

- **A.** It is deleted immediately, since the privacy obligation to minimise data always overrides a retention floor.
- **B.** Whether it is kept depends on whether a personal data breach has occurred involving this record in the meantime, since a breach resets which retention rule applies to it.
- **C.** It must be Cleared but not yet Purged, since only two of the seven years under the tax rule have passed, and Clear is the appropriate interim state for partially aged records.
- **D.** It is kept, because the tax rule is a floor that has not yet been reached, even though the privacy ceiling was crossed two years ago.

### 51.

A process attempts to read another process's memory directly, without going through any kernel-provided interface. What stops it, and at what level?

- **A.** The kernel's file permission checks, which reject the read once the attempted access is evaluated against them, the same way any ordinary file read would be checked.
- **B.** The CPU itself: ordinary processes run in a restricted privilege ring that cannot address arbitrary memory, so the attempt fails at the hardware level before any software policy is even consulted.
- **C.** The kernel process itself, which notices the read and terminates the offending process the way a device driver would when it detects unauthorised hardware access.
- **D.** Nothing at the hardware level — this is purely a software convention that a sufficiently privileged process can simply bypass by asking the kernel nicely enough.

### 52.

An administrator runs `chmod -R 755` over a project tree that contained several setgid directories and one setgid helper binary. Which special bits survive?

- **A.** Every special bit is cleared, on the directories and on the binary alike — an omitted leading digit is treated as zero, and that applies uniformly to every kind of file the recursion reaches
- **B.** The directories keep their setgid bit but the helper binary loses its, because `chmod` preserves that bit on directories unless told otherwise
- **C.** Every special bit survives, because a three-digit numeric mode addresses only the owner, group and other triads and never touches the leading digit at all
- **D.** Only the sticky bit is affected — setuid and setgid live outside the mode word, in the inode's extended attributes

### 53.

A dashboard reports average response time as healthy, but users are complaining about slow page loads. What is the average likely hiding, and what should be reported instead?

- **A.** Low throughput — requests per second should be reported instead of a time-based measurement.
- **B.** A bandwidth shortfall — the link's raw capacity should be reported instead of application response time.
- **C.** Nothing — average response time is definitionally equal to the experience of a typical user.
- **D.** A slow tail of requests; a percentile such as p95 or p99 should be reported instead, since an average conceals the worst-performing minority.

### 54.

A checkout application runs as a single Java artefact on twenty instances behind a load balancer: a browser front end, the Java application enforcing pricing rules, and one relational database. How many tiers does this system have, and why?

- **A.** Twenty, since each running instance adds another layer between the browser and the database, one layer for every copy of the artefact running behind the load balancer.
- **B.** Four — presentation, application, data, and the load balancer sitting in front.
- **C.** Two — the browser and the database, since the application logic runs inside the browser tier.
- **D.** Three: presentation (browser), application (the Java artefact), and data (the database); instance count does not change the layer count.

### 55.

A badly behaved application logs routine, harmless status messages at Error severity. What is the consequence for a monitoring filter tuned to alert on Error and above?

- **A.** Nothing changes, since the logging system automatically re-classifies mislabelled messages — the severity is recomputed from the message text as it is written to the log
- **B.** The messages are silently dropped, since Error severity from a non-critical process is filtered out by default
- **C.** It floods the filter with false alarms, because severity is a claim by the emitting program, not an assessment by the logging system
- **D.** The facility field automatically corrects the severity based on which subsystem is logging

### 56.

A contributor's pull request receives review comments asking for changes. What is the usual way to address them, and what is the usual mistake?

- **A.** Close the request, run `git merge` locally to apply the reviewer's suggestions by hand, then push the merged result as a brand-new commit for the platform to pick up.
- **B.** Rebase the branch onto `main` and force-push it, since only a rewritten branch is eligible to receive further review comments.
- **C.** Open a second pull request from the same branch, since each round of review comments needs its own request
- **D.** Push further commits to the same source branch, which updates the existing open request; opening a second pull request to "fix" the first is the usual mistake.

### 57.

An API key is committed to a public repository. A later commit deletes the file that contained it. Is the exposure closed?

- **A.** Yes — once the file is removed from the latest commit, the key is no longer accessible to anyone.
- **B.** No, but only because the exposure now triggers a mandatory regulator notification regardless of what is done next, which is the actual remedy rather than rotating the credential.
- **C.** No — the fix is to rotate the repository's disk encryption key rather than the exposed API key.
- **D.** No. The blob survives in history, in every existing clone and fork, and in CI caches; only rotating the credential closes the exposure.

### 58.

`uptime` reports a load average of 4.0 on one server and 4.0 on another. Are both servers under equal relative load?

- **A.** Yes — a load average of 4.0 is assumed to always mean the same relative load, since the figure is believed to be normalised by the kernel itself before it is ever reported back to a user at all, on any machine.
- **B.** Yes, since `hostnamectl` reports load averages in a normalised, comparable form across every different machine it runs on.
- **C.** Not necessarily, but only because the two servers are certainly running different kernel versions of Linux entirely.
- **D.** Not necessarily — load average is not normalised for CPU count, so 4.0 is a quarter of capacity on a 16-core machine and twice capacity on a 2-core one; `nproc`'s answer is needed to judge either figure.

### 59.

An application externalises its session data to a shared cache and stores uploaded files in object storage instead of on local disk. Does this make the application stateless, meaning it stores no data at all?

- **A.** Stateless describes where the state lives, not whether the system has any, so no; the application still has state, just not pinned to one server.
- **B.** Yes — a stateless application by definition has no persistent data anywhere in the system — the specific misreading the concept exists to correct, that no state anywhere is the same claim as no state pinned to one server.
- **C.** No, because moving data to a shared cache makes the application highly available instead.
- **D.** Yes, but only once the application is also placed behind a load balancer.

### 60.

Two accounts are created with different usernames but the administrator accidentally assigns them the same UID. What does the kernel treat them as, for permission purposes?

- **A.** Two separate identities, because the account name is what the kernel checks
- **B.** The same identity, since the kernel enforces access by the numeric UID, not by the account name
- **C.** Two separate identities, because each has its own entry in `/etc/passwd`
- **D.** Two separate identities, distinguished by their primary group instead — when two rows share a UID the kernel falls back to the GID field to tell the accounts apart

