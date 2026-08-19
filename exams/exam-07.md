<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 07

> **60 questions, 90 minutes.** Both are the real exam's figures. The Linux Foundation states
> the count on its Multiple Choice Exams: Important Instructions page — "the multiple-choice exam
> is delivered online and consists of 60\* multiple-choice questions" — and the 90 minutes on the
> same page and on the LFCA certification page. Captured at
> `docs/verification/exam-facts-2026-08-11/`.
>
> That is **90 seconds per question**, and **45 correct out of 60** to reach the 75% pass mark.
> Sit this one under the clock.

Answers: [exam-07-answers.md](exam-07-answers.md)

---

### 1.

Which question does configuration management answer, as distinct from infrastructure as code?

- **A.** Is this machine configured as declared, rather than whether the machine exists at all.
- **B.** Does this environment exist as declared.
- **C.** Is this operation safe to run a second time.
- **D.** Both ask the same question, since both keep declarations in version control and both re-apply to converge.

### 2.

A policy grants an identity read-only access to a secrets store, a database and an object storage bucket. Is that a safe default because it grants no write access?

- **A.** Yes — without write permissions the identity cannot cause any damage to the account.
- **B.** Yes, provided the secrets store and the bucket are both encrypted at rest.
- **C.** No, but only because a secrets store is considered something that should never be reachable by any read-only policy under any circumstance at all.
- **D.** No; read access to those three is exactly what data exfiltration requires, and least privilege scopes both resources and actions, not write access alone.

### 3.

A directory was reached by following a symlink. Which command reports the physical location with the symlink resolved, rather than the logical path the shell has been tracking as text?

- **A.** Running `pwd -P` to print the physical path with symlinks resolved
- **B.** Running `pwd -L`, the logical form and also the default behaviour
- **C.** `cd -P`, run with no other arguments
- **D.** `ls -ld` on the current directory, which prints the directory's own resolved physical path in the listing

### 4.

A team enables multi-factor authentication on every externally reachable SSH endpoint and can show the configuration export to prove it. An assessor asks for something more before crediting the control. What is missing?

- **A.** A completed audit report that lists multi-factor authentication as being within its examined scope.
- **B.** Evidence that the control actually challenged users during the audit period, such as the authentication logs, not just the configuration showing it is turned on.
- **C.** A written policy that requires multi-factor authentication on all externally reachable endpoints.
- **D.** Nothing further; the enabled setting shown in the configuration export is itself sufficient proof that the control actually ran and challenged users throughout the entire audit period.

### 5.

A candidate claims Docker is the container runtime that actually creates and runs containers on a Kubernetes node. Is that accurate?

- **A.** Yes, and from the release that removed dockershim onward Kubernetes stopped supporting any cluster that does not run Docker specifically as the runtime on every one of its worker nodes.
- **B.** Yes, and images built with any other tool cannot run under containerd or CRI-O as a result.
- **C.** No, and the actual runtime is the registry that images are pulled from before a node can start them.
- **D.** No, Docker is a full toolchain layered above a runtime; containerd and CRI-O are the components a Kubernetes node typically uses to actually run containers.

### 6.

A team draws only a to-be swimlane diagram for a redesigned claims workflow and presents it as proof of improvement. What is missing?

- **A.** A gap analysis, since only that technique can say whether the current state is worth changing enough to justify replacing it with the redesigned workflow.
- **B.** The as-is map; without a baseline of the current workflow there is nothing to demonstrate the difference against.
- **C.** A use case for every actor who touches the process.
- **D.** Nothing — a single map of the intended future is sufficient once stakeholders agree it looks right.

### 7.

An administrator holds root on every host in the fleet, but the change process still requires someone else to approve any change that administrator proposes. What does that arrangement demonstrate?

- **A.** Least privilege — the administrator's access has been scoped to what the role needs.
- **B.** Role-based deprovisioning, since the administrator's excess privilege will eventually be revoked once their role changes again.
- **C.** Separation of duties — no single identity, however privileged, can both make and approve a change alone.
- **D.** Nothing structural — the control applies only to staff below root, so an administrator holding root on every host falls outside its reach entirely.

### 8.

A team wants one instrument that answers both 'am I about to exceed what I said I would spend' and 'what am I spending it on, and is that changing.' Which instrument does both, and if none does, why not?

- **A.** No single instrument does — a budget answers the first because it has a threshold to cross, and monitoring answers the second because it reports trend with no target of its own.
- **B.** Cost monitoring alone does both, since a rising trend line on a dashboard already implies that some spend threshold is being approached.
- **C.** A pricing calculator does both, since it estimates the number needed to set both a budget and a monitoring baseline.
- **D.** A budget alone does both, since its threshold notification already explains exactly what changed in the estate to cause the breach.

### 9.

A cluster survives the loss of any single node without interruption. What does that arrangement not provide?

- **A.** Recovery if the whole site or system is lost.
- **B.** Continued service when one node fails.
- **C.** Automatic transfer of work away from the failed node.
- **D.** Continued service while one node is taken out of the cluster for a planned upgrade.

### 10.

A repository built on macOS, whose default filesystem is case-insensitive but case-preserving, is extracted on a Linux server running ext4. It contained both `Readme.md` and `readme.md`, which macOS treated as one file. What happens on the Linux server?

- **A.** Only one file survives, since Linux also folds case for compatibility with common archive tools
- **B.** Both names extract as two separate files, since ext4 compares names byte for byte
- **C.** The extraction fails outright, since ext4 rejects archives containing case collisions
- **D.** Both names extract to the same file, whichever was written last silently overwriting the other

### 11.

Brute force and credential stuffing are compared against phishing as a pair. Which axis does the guide use to separate them?

- **A.** Which one targets a database versus which one targets an operating system.
- **B.** Which one is automated versus which one is always performed manually by a person.
- **C.** Which one is stopped by rate limiting versus which one is stopped only by patching software, since a login endpoint that has been patched can no longer be automated against at any request rate.
- **D.** Who supplies the credential: the attacker derives or replays it themselves in one case, and the account holder hands it over in the other.

### 12.

A team needs to confirm a service responds and see the status code without downloading its content, and separately needs to download a file to disk from the command line. Which tool and mode suits each task?

- **A.** `wget -I` suits confirming the response without content, and `curl URL` suits downloading to a file, since `curl` is defined to always write its output to a file by default in every configuration seen in practice.
- **B.** `curl -I` suits confirming the response without downloading content, issuing a HEAD request; `wget URL` suits downloading a file, since it saves the response to a file by default rather than printing it.
- **C.** Both tasks are best done with `curl -v`, since verbose mode is defined to automatically save a file to disk in addition to printing the full request and response exchange.
- **D.** Neither tool can perform either task; both require a full browser to confirm a response or download a file from the command line reliably.

### 13.

Internal documentation needs one accurate sentence separating a container, the image it came from, and the Kubernetes pod that may wrap it. Which statement keeps the three straight?

- **A.** The image is the read-only template, the container is one running or stopped instance created from it, and the pod is Kubernetes' unit wrapping one or more containers with shared network and storage.
- **B.** The container is the read-only template and the image is one running instance created from it, while the pod bundles several unrelated images together Under that framing, deleting the pod would also delete every image it happened to bundle.
- **C.** A pod is simply another name Kubernetes uses for a container, and the image is the file produced by saving a running one Under that framing, restarting a pod would just restart the same underlying container object rather than create a new one.
- **D.** Because a pod schedules its containers together, restarting one always removes and recreates the image it was built from.

### 14.

One team's spend is split across three separate cost-report lines because resources were labelled env, Env, and Environment interchangeably over time. What actually fixes this?

- **A.** A retrospective monthly sweep that merges whichever tag keys happen to appear that month.
- **B.** Three separate budgets, one scoped to each of the three key variants.
- **C.** A written tagging standard enforced at creation time, so one consistent key is used across the estate going forward.
- **D.** Nothing needs to change, since cost-allocation reporting automatically recognises and merges near-identical tag keys on its own.

### 15.

A process is killed by SIGKILL, signal number 9. What exit status does the shell report for it, and what is the general rule this follows?

- **A.** 9, the signal number itself, reported directly as the exit status
- **B.** 126, the same status used for a command that is found but not executable
- **C.** 137, because a signal death reports 128 plus the signal number
- **D.** 1, the generic failure value used whenever a process does not exit cleanly

### 16.

A developer modifies a GPLv3-licensed tool for internal use only, running it exclusively on the company's own servers with no copy ever leaving the building. What obligation does the GPL impose in this situation?

- **A.** The obligation to preserve the copyright notice throughout the internal build, exactly the way a permissive licence would require regardless of distribution.
- **B.** The obligation to publish the Corresponding Source the moment any modification is made, whether or not the modified program is ever distributed.
- **C.** None, since the GPL's obligations attach to conveying a copy to someone else; running or modifying a work that is never conveyed is entirely unconditioned.
- **D.** The obligation to offer the Corresponding Source to anyone who interacts with it over a network, since the tool is reachable from other machines on-site.

### 17.

A user reports a web application is unreachable. Following the recommended diagnostic order, what is the very first thing to establish, and how?

- **A.** Establish the record's TTL first with `dig`, since knowing the caching interval is defined to be the prerequisite step before anything else can be diagnosed.
- **B.** Establish whether the fault is naming at all, by reaching the destination directly by IP address — if that works and the name does not, it is DNS, and only then does querying with `dig` or `nslookup` become the productive next step.
- **C.** Establish whether the authoritative server, not the recursive resolver, answers first, using `@`, since bypassing the cache is defined to always be the very first diagnostic step in any outage.
- **D.** Establish whether `getent hosts` and `dig` agree, since checking for a disagreement between the two is defined to always be the first productive diagnostic step regardless of the reported symptom in every configuration seen in practice.

### 18.

A service is confirmed running and correctly bound to 0.0.0.0, yet remote clients get connection refused instantly, while another service on a different host times out with no response at all. What does the difference between these two symptoms suggest about the cause?

- **A.** The instant refusal suggests a REJECT-style response — something on the path answered; the silent timeout suggests a DROP-style policy — the packet vanished, which is the more classic 'firewall is blocking this' signature.
- **B.** Both symptoms indicate exactly the same underlying cause, since DROP and REJECT firewall policies are defined to always produce identical client-side behaviour.
- **C.** The instant refusal proves no firewall is involved at all, since any device applying a firewall policy is defined to always produce a silent timeout rather than a refusal.
- **D.** The timeout proves the destination host is completely powered off, since only a powered-off host is capable of producing a connection attempt that never receives any answer.

### 19.

A user's login requires a password and a security question. Why does this fail to count as a second layer of defense in depth even though two credentials are checked?

- **A.** It does count, since checking two separate pieces of information is exactly what defense in depth means.
- **B.** It fails because a security question violates least privilege by granting more access than the task requires.
- **C.** It fails because security questions are a form of biometric authentication, which is inherently unreliable as a second factor.
- **D.** Both are "something you know," so they fall to the same disclosure and share a failure mode rather than failing independently.

### 20.

A scenario describes capacity that grows and shrinks automatically, minute by minute, in direct response to live traffic. Which cost practice is actually being described?

- **A.** Rightsizing — some vendor guidance folds live scaling into it, so the minute-by-minute description still qualifies.
- **B.** Autoscaling, the practice that changes how many units run automatically in response to live load.
- **C.** Orphan cleanup — capacity changing shape usually means unused resources are being found and removed.
- **D.** A configured budget action, since thresholds can be set to add or remove capacity automatically.

### 21.

A symlink points at a large file, and an operator wants a copy of the symlink itself — a small file pointing at the same target — rather than a full copy of the target's contents. Plain `cp` does not give that. Which option does?

- **A.** `cp -L`, since dereferencing is what tells `cp` to copy the link entry itself
- **B.** `cp -a`, which preserves symlinks instead of following them
- **C.** `ln -s` run against the copy after the fact, to convert it back into a link
- **D.** `mv` instead of `cp`, since moving preserves everything by definition

### 22.

A database container is started with no `-v` flag, runs for weeks, and is then removed and recreated from the same image to pick up a patch. What happens to the data it wrote?

- **A.** It is preserved automatically, because Docker keeps a hidden backup of every container's writable layer and restores it into any replacement container built from the same image.
- **B.** It is preserved, because the new container is created from the same image and therefore inherits the old container's filesystem state along with everything that container wrote at run time.
- **C.** It is gone, because with no volume or bind mount attached, every write landed in the writable layer that is destroyed with the container.
- **D.** It is preserved as long as the old container was stopped rather than removed before the new one was created.

### 23.

A web service fails to respond from other machines. Running `ping 127.0.0.1` on the host itself succeeds cleanly. What has this actually confirmed, and what has it not?

- **A.** It confirms the network card, cable and driver are all functioning correctly end to end, since a successful ping is taken as proof that the full network path is intact in the overwhelming majority of real deployments.
- **B.** It confirms the web service itself is correctly configured to accept remote connections on its intended port and address.
- **C.** It confirms the default gateway is correctly configured and reachable from this host on the local subnet.
- **D.** It confirms the local IP stack is loaded and responding; it says nothing about the NIC, cabling, addressing, routing or firewall rules, since loopback traffic never reaches a physical interface.

### 24.

Why do cloud providers and enterprise datacentres run type 1 hypervisors such as ESXi or Hyper-V rather than type 2 products such as VirtualBox?

- **A.** Because type 1 hypervisors are simply newer technology than type 2 hypervisors — the hosted products that came before them are no longer maintained by their vendors.
- **B.** Because type 1 hypervisors provide virtualization while type 2 hypervisors do not virtualize hardware at all, offering only the process-level isolation a container runtime provides.
- **C.** Because type 1 hypervisors are required to run containers, which type 2 hypervisors cannot host, so a container platform can never be tested on a developer's laptop.
- **D.** A type 1 hypervisor runs directly on the hardware in place of a host OS, avoiding the extra host-OS layer that type 2 adds, which costs performance and adds a second component that can crash.

### 25.

How does the LGPL let a proprietary application link against a covered library without the whole application becoming GPL-licensed?

- **A.** It confines the same-licence condition to the library itself; the application may be conveyed under its own terms if users can relink against a modified library (LGPLv3 §4, or LGPL-2.1 §6).
- **B.** It does not — linking a proprietary application against any LGPL library still requires the entire application to be released under the full terms of the GPL, exactly as with the plain GPL.
- **C.** It grants the exception only when the application is never offered as a network service, mirroring the AGPL's network trigger in reverse.
- **D.** It removes copyleft obligations entirely, so the library itself may also be redistributed under proprietary terms once any application links to it.

### 26.

Two engineering desks need to be added to the same subnet as the rest of engineering, while a separate finance subnet needs to exchange traffic with engineering for the first time. Which device does each task need, and on what basis?

- **A.** Both tasks need a router, since only a router is capable of extending a broadcast domain to additional physical ports at all.
- **B.** Adding desks to the same subnet needs only a switch, which forwards frames by MAC within one broadcast domain; connecting two different subnets needs a router, which forwards packets by IP between them.
- **C.** Both tasks need only a switch, since a switch can join two entirely separate subnets together as easily as it extends one existing subnet.
- **D.** Neither task needs either device; both can be accomplished purely through DHCP server configuration on the existing network.

### 27.

A LUKS volume's header is accidentally overwritten during a disk operation. No header backup was ever taken, the volume is not currently open, and the correct passphrase is still known. What is the state of the data?

- **A.** Fully recoverable, since the correct passphrase alone is sufficient to derive the volume key directly from the encrypted data, because the key derivation is seeded from the first encrypted sector rather than from anything the header held.
- **B.** Unrecoverable, but only because a second key slot would have been needed regardless of the header's condition.
- **C.** Recoverable by restoring from a nightly database backup instead of the encrypted volume.
- **D.** Unrecoverable, because the header holds the wrapped volume key, and destroying it makes the data unreadable even with the correct passphrase.

### 28.

`apropos ssh` prints "nothing appropriate" on a server that clearly has OpenSSH installed, yet `man ssh` opens a page without trouble. What is the most likely cause?

- **A.** OpenSSH ships no man pages, only a `--help` summary
- **B.** `apropos` only searches section 8 administration pages, and `ssh` lives in section 1
- **C.** The manual index that `apropos` searches has not been built
- **D.** The keyword needs to be quoted, since `apropos` otherwise expands it as a glob

### 29.

An administrator SSHed into an Ubuntu server runs `ufw enable` without first running `ufw allow 22/tcp`. What is the likely, serious consequence?

- **A.** The administrator is likely locked out immediately, since enabling ufw applies default-deny inbound and the active SSH session's port was never explicitly allowed first.
- **B.** Nothing changes for the active session, since ufw is defined to always automatically allow the port the enabling command was itself issued over.
- **C.** The command fails outright with an error and makes no change at all, since ufw refuses to enable itself while an active SSH session lacks an explicit allow rule, because it reads the current connection table before applying any policy.
- **D.** Only outbound traffic is affected, leaving the existing inbound SSH session completely unaffected regardless of any rules configured.

### 30.

A third-party provider owns, operates and hosts an off-premises platform dedicated to exactly one client organisation, with self-service provisioning and metered chargeback to that client's business units. Which NIST deployment model is this, and why does location not decide the answer?

- **A.** Public cloud — since a third party owns and operates the infrastructure rather than the client itself, and third-party operation is what the public model names, on or off the customer's premises.
- **B.** Not a cloud at all, since the client organisation does not own the hardware it provisions capacity on.
- **C.** Hybrid cloud, because the infrastructure is hosted off the client's own premises while the client's users remain on them.
- **D.** Private cloud — NIST defines it by exclusive use by one organisation, and explicitly allows the infrastructure to be owned, managed and operated by a third party, on or off premises.

### 31.

What is the one-sentence difference between infrastructure as code and configuration management?

- **A.** The two are the same activity, only applied through different named tools such as Terraform on one side and Ansible on the other.
- **B.** Infrastructure as code runs only on a fixed schedule, while configuration management runs only in response to a commit.
- **C.** Infrastructure as code brings resources into existence and destroys them; configuration management acts on the state inside systems that already exist.
- **D.** Infrastructure as code is always declarative, while configuration management is always written as an imperative script.

### 32.

An administrator edits `nginx.service` to add `Restart=on-failure`, then runs `systemctl restart nginx`. The new restart policy does not appear to take effect. What is missing?

- **A.** `systemctl daemon-reload` — until it runs, systemd is still acting on the unit definition it parsed earlier, not the edited file
- **B.** Nothing is missing; `restart` always re-reads the unit file before restarting the process
- **C.** The change needed `systemctl reload nginx` instead of `restart` — `reload` is the verb that re-reads the unit file without interrupting the service
- **D.** The unit needed `systemctl enable --now` run again to pick up the change

### 33.

`ss -tulpn` is run without the `n` flag, and the output shows a service name instead of a raw port number for a listening socket. What does dropping `n` actually change, and is the resulting name proof of what is running?

- **A.** Nothing changes; `n` only affects whether IP addresses are shown numerically
- **B.** It disables the `p` column, hiding the owning process entirely
- **C.** It maps the port number to a name from `/etc/services`, a lookup describing convention, not a check of the actual process
- **D.** It switches the tool from TCP sockets to UDP sockets only, leaving the listening filter and the process column as they were

### 34.

During SSH's publickey authentication, what does the client actually transmit to the server, and why does this resist replay in a way a password does not?

- **A.** A signature over session-specific data, never the private key or anything reusable, so an attacker recording the exchange gains nothing replayable.
- **B.** The private key itself, encrypted with the server's public key so only that server can read it.
- **C.** A one-time password derived from the key pair, refreshed every thirty seconds like a hardware token.
- **D.** A hash of the password the user would otherwise have typed, computed locally before sending.

### 35.

A story's own acceptance criteria are all met, but the team's automated test suite, required by their standing quality bar, was never run against it. What happens to the story, and which of the two commitments governs the outcome?

- **A.** It is accepted, since meeting its own acceptance criteria is what the Scrum Guide itself defines as done.
- **B.** It is accepted, because acceptance criteria and the Definition of Done are simply two names for the same check, applied at whatever level of detail the team happens to prefer from one item to the next.
- **C.** It is not part of the Increment and returns to the Product Backlog — the Definition of Done, the team-wide bar every item must meet, governs here, not the story's own criteria.
- **D.** It is accepted at the Sprint Review, where the Definition of Done can be applied retroactively if needed.

### 36.

Someone asks "what filesystem does the FHS use?" What is wrong with the question?

- **A.** Nothing is wrong; the FHS is a specific on-disk format like ext4 or XFS — the one the Linux Foundation defines as the default for the root partition
- **B.** The FHS is not a filesystem at all; it is a convention for what each directory means, not an on-disk format
- **C.** The question is fine, and the answer is whichever filesystem type the root partition uses
- **D.** The question is fine, and the answer is `tmpfs`, since that is what most FHS directories use

### 37.

A service relies on DNS failover with a five-minute TTL on its record, while a comparable service sits behind a load balancer with several registered targets whose health check marks one unhealthy within seconds. After a failure, which recovers to serving traffic sooner, and why?

- **A.** They recover equally fast, since both mechanisms detect failure with a health check, and it is the detection step alone that determines how quickly traffic reaches a healthy target, regardless of whether a DNS record or a balancer's routing table has to catch up afterward.
- **B.** The load-balanced service, because it keeps one unchanged endpoint and simply stops sending traffic to the unhealthy target, while DNS failover cannot take effect faster than the TTL lets caches expire.
- **C.** The DNS-based service, since layer 7 balancers add request-parsing latency that DNS avoids.
- **D.** Neither — remapping a reserved address to a healthy instance would outperform both.

### 38.

Where is the superuser's home directory, and why does the FHS keep it separate from `/home`?

- **A.** `/home/root`, the same convention every other account follows — the FHS reserves a numbered subdirectory of `/home` for UID 0 exactly as it does for every other account
- **B.** `/usr/root`, since root is considered part of the shareable, static hierarchy
- **C.** There is no dedicated home directory for root; it uses `/` directly
- **D.** `/root`, kept outside `/home` so the system does not need a fallback default if `/home` — often a separate partition — fails to mount

### 39.

A deployment is rolled back by redeploying the previous artifact, but the incident does not end. What is the most likely reason?

- **A.** The artifact registry must have been misconfigured, since a correctly performed rollback always resolves the underlying incident.
- **B.** Data, because a schema migration or writes made by the new version are not undone by redeploying old code, since rollback of code is not rollback of data.
- **C.** The wrong version tag was almost certainly pulled from the registry, targeting the redeploy at the wrong artifact.
- **D.** The team should have used a blue-green cutover instead of simply redeploying the same previous artifact.

### 40.

A command's output is captured to a file with `>`, yet an error message from that same command still appears on the screen. Comparing what "output" covers against the three numbered streams, why does this happen?

- **A.** "Output" always includes both streams, so this must indicate a shell bug
- **B.** The error is arriving through a pipe from a background process instead
- **C.** Errors bypass redirection entirely and cannot be captured under any circumstances
- **D.** Only descriptor 1 was redirected; descriptor 2 still points at the terminal

### 41.

A deployment needs resources spread across three availability zones in one region. On AWS, how many subnets does that require, and why does the same question have a different answer on Azure and Google Cloud?

- **A.** Three on AWS, because a subnet is confined to a single Availability Zone there; on Azure, subnets span every zone in the region, and on Google Cloud a subnet is a regional resource reachable from any zone in it, so one subnet suffices on either.
- **B.** Three everywhere, because a subnet is confined to one Availability Zone on every major provider.
- **C.** One everywhere, because the virtual private cloud itself already spans every zone in the region on all three providers, which would make the three-zone requirement trivial regardless of which provider's subnet rules apply to the deployment.
- **D.** Three on AWS and Azure, one on Google Cloud, because route tables are associated per subnet on the first two, and a per-subnet route table is assumed to be what forces a subnet to stay inside one zone.

### 42.

A fresh Linux install ships with several services enabled and a permissive default account that most administrators never need. Why does this happen, and whose responsibility is it to fix?

- **A.** It happens because the vendor made an oversight, and the fix is to wait for a vendor patch that disables the defaults.
- **B.** Vendors ship for broad usability rather than for any one threat model, so tightening the defaults for a specific deployment is the operator's hardening task.
- **C.** It happens because the CVE program has not yet catalogued the default configuration as a weakness, and the vendor is barred from tightening the defaults until an identifier has been assigned.
- **D.** It happens only on systems without SELinux or AppArmor installed, and enabling either removes the need for hardening.

### 43.

An administrator runs `mount /dev/sdb1 /srv/data`, but `/srv/data` already contained files. What happens to those pre-existing files?

- **A.** They are permanently deleted, since the mount overwrites the directory
- **B.** They are merged with the new filesystem's contents, showing both sets of files together
- **C.** Nothing changes, because a partition must be formatted before `mount` will do anything at all
- **D.** They are hidden for as long as the mount lasts, not merged and not deleted

### 44.

A batch job needs to know how many processing units are actually available to it right now, which may be fewer than the machine's physical total under a cgroup limit. Which command answers that specifically?

- **A.** `lscpu`, whose `CPU(s):` summary line gives the number of processing units the job can actually use.
- **B.** `free -h`, since memory and CPU limits are reported together under cgroups.
- **C.** `nproc`, which reports the number of processing units currently available to the calling process.
- **D.** `nproc --all` and plain `nproc` always report the same number, so either serves the purpose.

### 45.

An operations team is asked to migrate four hundred servers to a new LTS release by the end of Q3. Once complete, the team continues patching those same servers every month indefinitely. Which of the two activities is the project?

- **A.** The migration, because it is the larger and more technically demanding of the two efforts, and demanding, high-visibility work is what most people mean when they informally call something a project.
- **B.** Whichever activity the sponsor currently considers the higher priority this quarter.
- **C.** Whichever activity is currently drawing more budget and headcount.
- **D.** The migration, because it has a defined end date and a unique objective; the monthly patching that follows is ongoing operations, however large an effort it continues to be.

### 46.

An unprivileged user wants to lower the nice value of their own running batch job from 10 to 0, to give it more CPU time. Can they do it with plain `renice`?

- **A.** Yes, any user may freely move their own process's nice value in either direction
- **B.** Yes, but only using `nice` rather than `renice`, since they behave differently for this purpose
- **C.** No, because only the process's original parent may ever change its nice value — the kernel keeps the permitted nice range in the parent's task structure rather than the child's
- **D.** No — lowering a nice value requires root or `CAP_SYS_NICE`, unless the administrator has raised `RLIMIT_NICE`, which by default allows no reduction

### 47.

A cached product page is served to every visitor for an hour before its entry expires, even though the price changed twenty minutes ago. What trade did the cache make, and what does it not remove the need for?

- **A.** Nothing — a correctly configured cache never serves data more than a few seconds old — an assumption that quietly rules out the entire mechanism time-to-live exists to permit, which is exactly what makes caching cheap.
- **B.** Latency, in exchange for guaranteed data freshness on every single request.
- **C.** Staleness, in exchange for lower latency and origin load — and it does not remove the need for an origin capable of serving the full load, since a cold start or invalidation still sends requests there.
- **D.** Availability, since a cache miss makes the requested page temporarily unreachable until the origin responds.

### 48.

A Kubernetes Deployment rolls out a new version in batches, waiting for each batch of new Pods to become healthy before scaling down the corresponding old ones. Halfway through, some requests are hitting the new version and some the old one. Is anything evaluating how the new version is behaving under the traffic it has already taken?

- **A.** No, because the mixed-version window is a side effect of replacing instances in batches, not a sample deliberately chosen to be observed the way a canary's slice is.
- **B.** No, but that is expected, since a rolling deployment never allows two different versions to serve production traffic at the same moment.
- **C.** Yes, and any failure during the roll automatically restores a previous revision from the Deployment's rollout history.
- **D.** Yes, because both versions are visibly serving traffic at once, which is a reasonable basis for assuming the rollout is being evaluated.

### 49.

A team wants a shared directory where every file a member creates is automatically writable by the whole team, without each person having to `chgrp` and `chmod` after every save. Which combination builds that?

- **A.** `chmod 4770 /srv/shared` alone, since setuid on a directory gives every file the owner's privileges
- **B.** `chgrp developers /srv/shared`, `chmod 2770 /srv/shared`, and a umask of `002` in members' sessions
- **C.** `chmod u+s /srv/shared`, since it runs new files with the file owner's privileges
- **D.** Adding the sticky bit to `/srv/shared` so files inherit the shared group

### 50.

A web service logs visitors' IP addresses and nothing else. Under GDPR Article 4(1), read with Recital 26, when does that log hold personal data?

- **A.** Never, because Article 4(1) confines personal data to information about a named individual, and an address identifies a device rather than a person who could be named from it.
- **B.** Only once the service joins the log to its own account table, because until that join happens Article 4(1) treats an address as anonymous information in every hand that holds it.
- **C.** Whenever the person behind an address can be identified directly or indirectly by means reasonably likely to be used, since Article 4(1) names an online identifier as one of the references through which that identification may run.
- **D.** Whenever the log is commercially sensitive, since Article 4(1) extends to any information whose disclosure would harm the company holding it, regardless of whom the information relates to.

### 51.

A script needs to identify which distribution it is running on before choosing between `apt` and `dnf`. Which command reads the machine-readable identity file for that purpose?

- **A.** `uname -r`, which reports the running kernel version so the script can infer the distribution from that number.
- **B.** `uname -a`, which prints a full summary line ending with the operating system name.
- **C.** `lsblk`, which lists the disks the distribution's files happen to be installed on.
- **D.** `cat /etc/os-release`, which prints the standard distribution identity file every installed system carries.

### 52.

Someone says "systemd" and "`systemctl`" as if they were interchangeable. What is the actual relationship?

- **A.** They are two names for the same running process, used interchangeably by convention
- **B.** `systemctl` is the older SysV name for what became systemd — kept on modern systems only as the `/sbin/init` compatibility symlink
- **C.** systemd is the manager process running as PID 1; `systemctl` is the client command used to control it
- **D.** systemd only manages boot; `systemctl` is the separate tool that manages running services

### 53.

A service is provisioned N+1: three units of load require four running instances. One instance is taken down for planned maintenance. What is true of the remaining capacity?

- **A.** Full load can still be carried on the three instances that remain, which is exactly what the extra unit was provisioned for.
- **B.** The service is now under-provisioned, since N+1 only covers a single simultaneous unplanned failure, not planned maintenance.
- **C.** Traffic must be rejected until the instance returns, because active-passive redundancy requires a promotion step first.
- **D.** The remaining instances must each individually double their capacity to absorb the loss.

### 54.

During a Sprint Review, an attendee raises: 'Handovers to the support team keep stalling.' The Scrum Master says this belongs in a different event. Which one, and why?

- **A.** The Daily Scrum, since any process complaint should be raised at the very next working day's event.
- **B.** Sprint Planning, since process changes should be scheduled before the next Sprint even starts.
- **C.** Project closure, since only a fully finished project can act on a systemic handover problem, because closure is the point at which lessons are finally written down for anyone else to read.
- **D.** The Sprint Retrospective, which inspects the team's own process, whereas the Review inspects the product and what to build next.

### 55.

On a Debian-family system, which command actually installs newer versions of software already on the machine: `apt update` or `apt upgrade`?

- **A.** `apt update`, since "update" is the word that implies bringing software up to date
- **B.** Both do the same thing, and either one may be used interchangeably — `apt upgrade` refreshes the index itself before it upgrades anything
- **C.** `apt upgrade`; `apt update` only refreshes the cached repository indexes and installs nothing
- **D.** `apt full-upgrade`, since only the "full" variant actually installs anything

### 56.

A developer runs `git rebase main` on a feature branch. Afterward, the commits look identical in content to before. Are they the same commit objects Git had a moment ago?

- **A.** No. Each is replayed as a new commit with a new hash, even though the resulting content looks the same as if the work had started from the current `main` all along.
- **B.** Yes — rebase only changes where the existing commit objects sit in history, leaving their hashes untouched the same way moving a branch pointer forward during a fast-forward merge does.
- **C.** Yes, because rebase and merge both preserve every original commit's hash by design.
- **D.** No, because `git reset --hard` deleted the originals and nothing new was created to replace them

### 57.

A self-encrypting drive is retired by issuing a command that destroys its media encryption key, leaving only ciphertext behind. Which SP 800-88 category does this fall under, and what limits how much it can be trusted?

- **A.** Destroy — the drive can never store data again once its key is gone, which is what distinguishes Destroy from Purge.
- **B.** Clear — logical techniques like this only defeat simple, non-invasive recovery attempts, nothing more.
- **C.** Purge, via cryptographic erase — it is fast, but only as trustworthy as the drive's own encryption implementation.
- **D.** Purge, and its trustworthiness is limited by whether the drive's retention schedule had already expired.

### 58.

A production database server must not have package behaviour shift unexpectedly underneath a running service. Which release policy fits that requirement, and why?

- **A.** An LTS release, because its package versions stay frozen after release and only security-relevant patches are backported into those same versions.
- **B.** A rolling release, because it always runs the newest software and therefore carries the fewest known bugs at any given time.
- **C.** Whichever release the distribution family recommends, since family and release policy amount to one single decision.
- **D.** Rolling releases also freeze versions, they just do it more frequently, so either policy satisfies the requirement equally well over a long enough window.

### 59.

A team resizes their single web server to the largest instance type their provider offers, hoping to both raise capacity and reduce outages. What has the resize achieved?

- **A.** Both goals, since a larger instance type also comes with the provider's redundant power and network infrastructure built in — a belief that quietly assumes redundancy under the hypervisor is the same thing as redundancy at the level the application actually runs on.
- **B.** More capacity only. The server is still one machine and still a single point of failure, and it has now reached its ceiling with nowhere further to grow.
- **C.** Neither goal, because the resize also required distributing the workload across multiple nodes first.
- **D.** Reduced outages only, since larger instances fail less often than smaller ones.

### 60.

Writes to /var fail with "No space left on device," but `df -h /var` shows 40% used. What do you check next, and what does the outcome rule out?

- **A.** `journalctl -u` for the affected service, since the daemon's own log will name the cause of any resource exhaustion it hits.
- **B.** `df -i /var`. If `IUse%` is at 100%, the inode pool is exhausted, which rules out any remedy based on file size.
- **C.** Delete the largest files you can find, since that's how a full disk is normally resolved.
- **D.** `ls -ld` on /var, in case a restrictive parent directory is blocking access.

