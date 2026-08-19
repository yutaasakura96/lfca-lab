<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 05 — answers

### 1. B

*sysadmin.best-practices.change-management · System Administration Fundamentals :: Best Practices · depth 3 · application*

Change management is a human decision process producing an authorisation, distinct from the tool that stores the resulting file state. Git with reviewed pull requests gives history, attribution and file-level review; it does not by itself cover a hand-made change on a host or the impact review and archived approval a full process requires.

- **A.** Review gives history and attribution for files, but says nothing about impact review, scheduling, or approval of out-of-band changes.
- **B.** Correct. Version control covers only what was committed; an unapproved change made directly on a host is still within change management's scope but outside the repository's.
- **C.** That is what version control already provides; it is not the gap the auditor is asking about.
- **D.** A window would state when work may happen, not whether it was reviewed and approved at all.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.change-management](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.change-management)

### 2. D

*cloud.best-practices.identity-and-access-management · Cloud Computing Fundamentals :: Best Practices · depth 2 · recall*

Policies attach to identities or resources and are evaluated per API call, covering both authentication and authorization at the level of the cloud control plane; the account's root or global-administrator identity is deliberately protected and kept out of routine use.

- **A.** That describes an OS account, not the cloud control-plane identity system, and reverses the guidance to reserve root for routine use.
- **B.** IAM governs far more than billing, and the root identity is specifically the one that should not be shared.
- **C.** Routing configuration is a resource IAM policies can gate, not what IAM itself governs, and root is not reserved for a single team.
- **D.** Correct. Root or global-administrator access is set aside for exceptional situations rather than everyday work.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.identity-and-access-management](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.identity-and-access-management)

### 3. A

*linux.command-line.command-exit-status · Linux Fundamentals :: Command Line · depth 3 · application*

`$?` holds the status of the most recently completed foreground command. Running any other command first — including the `echo` used to report it — overwrites that value, so it must be checked immediately. Checking it manually is always `echo $?`, run immediately after the command in question.

- **A.** Correct. `$?` is overwritten by every command that runs, including `echo`, so it must be checked immediately after the command whose status matters, before anything else runs.
- **B.** `echo` is a command like any other and sets its own exit status when it finishes, overwriting whatever `$?` held immediately before.
- **C.** `$?` holds a single command's status, not a combination of several; there is no such OR-of-statuses behaviour in the shell.
- **D.** `PIPESTATUS` is a separate array populated only after a pipeline, and nothing in the scenario involves one; `$?` simply reflects the single most recently completed command.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-exit-status](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-exit-status)

### 4. A

*security.compliance.audit · Security Fundamentals :: Compliance · depth 3 · application*

A SOC 2 Type 1 report asks whether controls were suitably designed on a given date; a Type 2 report asks whether they operated effectively across months. The second costs more to obtain and claims more about the intervening period.

- **A.** Correct. An opinion on design as of a date and an opinion on operating effectiveness across a period are separate determinations resting on different evidence.
- **B.** Suitable design as of one date is a statement about how a control is built, not about how it behaved over the months that followed.
- **C.** A period opinion has to sample assessment objects from across the period, so it rests on evidence a point-in-time design opinion never gathers.
- **D.** ISO states that it does not itself certify: certification is issued by an external certification body, a different artifact from a service auditor’s examination report.

Study it: [04-security/compliance.md#c-security.compliance.audit](../study-guide/04-security/compliance.md#c-security.compliance.audit)

### 5. D

*devops.containers.cncf · DevOps Fundamentals :: Containers · depth 2 · recall*

The Cloud Native Computing Foundation is part of the nonprofit Linux Foundation and hosts a large portfolio of vendor-neutral open source projects, Kubernetes among them, sustaining the ecosystem with infrastructure, events, and marketing rather than technical governance.

- **A.** The relationship runs the other way — the CNCF is part of the Linux Foundation, not its parent — and Kubernetes is governed by its own Steering Committee regardless.
- **B.** The CNCF's portfolio is the cloud-native ecosystem, Kubernetes included; the Linux kernel is a Linux Foundation project hosted separately from the CNCF's own portfolio.
- **C.** The CNCF is a nonprofit foundation whose mission is making cloud native computing ubiquitous, not a for-profit vendor consortium.
- **D.** Correct. This places the CNCF correctly within the Linux Foundation and correctly separates hosting support from governing authority over Kubernetes.

Study it: [05-devops/containers.md#c-devops.containers.cncf](../study-guide/05-devops/containers.md#c-devops.containers.cncf)

### 6. C

*pm.functional-analysis.use-case · IT Project Management Fundamentals :: Functional Analysis · depth 3 · discrimination*

A use case is written to be sufficient on its own — actor, goal, preconditions, main flow, alternate and exception flows, postcondition. A user story is written to be insufficient on purpose, a reminder that a need must still be discussed. The separating axis is intended completeness, not length.

- **A.** This is a user story, not a shortened use case; the two differ in intended completeness, not in word count.
- **B.** That is process mapping's artifact, for the surrounding business workflow — a use case describes one actor's interaction with the system, not the department hand-offs around it.
- **C.** Correct. This sentence is deliberately a placeholder for a conversation still to be had; a use case is meant to be sufficient to build and test from without one.
- **D.** Priority is a separate axis from completeness and does not add any of the detail a use case needs.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.use-case](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.use-case)

### 7. A

*sysadmin.best-practices.naming-conventions · System Administration Fundamentals :: Best Practices · depth 2 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

In most implementations of this consensus practice, a fixed, ordered naming scheme lets a reader decide from the name alone whether a host is production or test before deciding how urgently to react. The convention encodes information rather than storing it, so trusting a name as a record — of ownership or of anything else the inventory should carry — is exactly the failure mode the practice invites.

- **A.** Correct. Names appear stripped of context in alerts and logs, so a reader typically has only the name to decide how to react.
- **B.** A name is a string someone typed and encodes information; it does not store it, so treating it as the authoritative record is the practice's usual failure mode.
- **C.** Uniqueness across an estate is enforced by whatever assigns and records names; a convention only fixes the shape a name takes.
- **D.** That uniformity is standardization's goal; a naming scheme only makes identity readable, not configuration identical.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.naming-conventions](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.naming-conventions)

### 8. C

*cloud.best-practices.immutable-infrastructure · Cloud Computing Fundamentals :: Best Practices · depth 3 · discrimination*

It is the only practice in this competency that eliminates configuration drift rather than merely reducing it: if the maximum age of an instance is a deployment cycle, the accumulated history that produces drift cannot form in the first place, which is why replacing instances is safe to do routinely.

- **A.** Automation reduces drift but does not eliminate it, because a console change made outside the loop can still occur unless reapplied continuously.
- **B.** A review surfaces findings periodically; it does not itself act on the environment between reviews.
- **C.** Correct. A maximum instance age of one deployment cycle means history cannot accumulate on any single server.
- **D.** Deregistration removes a target from rotation; it says nothing about whether the target's configuration matches its definition.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.immutable-infrastructure](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.immutable-infrastructure)

### 9. C

*sysadmin.disaster-recovery.disaster-recovery-plan · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

A disaster recovery plan is the documented, tested procedure for restoring service after a major failure — including who does what and in what order. Its distinguishing content is the sequencing and the decision rights, which are precisely what nobody can improvise at the time.

- **A.** That is scheduled maintenance and does not involve recovering from a major failure.
- **B.** That is the broader continuity discipline, of which IT recovery is one component.
- **C.** Correct. Sequencing and decision authority under a major failure are what this document exists to fix in advance.
- **D.** That is an availability mechanism operating within a site rather than a recovery procedure.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.disaster-recovery-plan](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.disaster-recovery-plan)

### 10. B

*linux.command-line.dot-dotdot-and-tilde · Linux Fundamentals :: Command Line · depth 3 · discrimination*

In bash, `cd ..` is logical by default: the shell strips the last component from `$PWD` textually. After arriving through a symlink, that can land somewhere different from what `..` physically points at on disk; `cd -P ..` follows the physical structure instead.

- **A.** Nothing in the scenario suggests the symlink vanished, and removing it would not retroactively change the `$PWD` string the shell had already recorded; the discrepancy is the ordinary result of logical-versus-physical resolution.
- **B.** Correct. The shell tracks `$PWD` as a string and strips its last component textually, so after arriving through a symlink the logical parent can differ from the physical one; `cd -P ..` follows the physical structure instead.
- **C.** That special case applies only to `..` evaluated at the actual filesystem root, not to an ordinary directory reached through a symlink elsewhere in the tree.
- **D.** Bash's default `cd ..` is explicitly logical, tracking `$PWD` as text, which is exactly why it can diverge from the kernel's physical parent.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.dot-dotdot-and-tilde](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.dot-dotdot-and-tilde)

### 11. D

*security.security.attack-surface · Security Fundamentals :: Security · depth 3 · recall*

Attack surface is the total set of points an attacker can attempt to interact with — listening ports, exposed endpoints, installed packages, and enabled accounts among them. A stale but still-active account is exactly this kind of point, whether or not anyone currently uses it.

- **A.** A score for software that is not present does not touch this host's attack surface at all; nothing here is reachable.
- **B.** A retention setting governs how long recoverable copies persist and is not a point an attacker can interact with directly.
- **C.** A response procedure describes what happens after compromise, not a point of possible entry beforehand.
- **D.** Correct. Enabled accounts are explicitly listed as part of the surface: anything an attacker can reach and interact with counts, including stale but active logins.

Study it: [04-security/security.md#c-security.security.attack-surface](../study-guide/04-security/security.md#c-security.security.attack-surface)

### 12. A

*sysadmin.networking.arp · System Administration Fundamentals :: Networking · depth 3 · discrimination*

DNS resolves a name to an IP address, globally and hierarchically; ARP resolves an IPv4 address to a MAC address, but only on the local segment. A name failure with working raw addresses points at DNS, while a single unreachable local address with everything else working points at ARP.

- **A.** Correct. DNS and ARP resolve opposite ends of the address chain — DNS turns a name into an IP address, ARP turns an IP address into a hardware address — and they never substitute for each other.
- **B.** ARP resolution operates entirely below DNS, on one local segment, using no IP transport and no port at all; a local address-to-MAC failure is not a DNS problem.
- **C.** ARP resolves IPv4 addresses to MAC addresses only; it has no role in resolving names, which is DNS's job across the internet, not a local-segment one.
- **D.** ARP requests never carry hostnames — only IPv4 and MAC addresses — and DNS has no role in resolving a local-segment IP-to-MAC mapping.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.arp](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.arp)

### 13. B

*devops.containers.container-lifecycle · DevOps Fundamentals :: Containers · depth 3 · discrimination*

The lifecycle runs created, running, paused, stopped, and removed. Stopping is not removing: a stopped container keeps its identity, its writable layer, and its logs until `docker rm` deletes it.

- **A.** `docker stop` and `docker rm` act on different lifecycle transitions; only removal deletes the container object and frees its writable layer.
- **B.** Correct. Stopping asks the main process to terminate; the container object itself, and everything it holds, remains on disk afterward.
- **C.** A stopped container is exactly the object `docker start` resumes, using the configuration it was created with; it is very much restartable.
- **D.** Stopping, and even removing, a container never touches the image it came from; images and containers are removed by separate commands.

Study it: [05-devops/containers.md#c-devops.containers.container-lifecycle](../study-guide/05-devops/containers.md#c-devops.containers.container-lifecycle)

### 14. D

*cloud.budgeting.free-tier-and-pricing-calculators · Cloud Computing Fundamentals :: Budgeting · depth 2 · application*

Allowances are metered like any other consumption. On an account with a payment method attached, exceeding one does not stop the resource — it silently starts billing at the standard rate, which is why the allowance needs active tracking rather than passive trust.

- **A.** An allowance and a configured budget threshold are separate instruments; crossing the free-tier limit does not by itself trigger a budget notification.
- **B.** An orphaned resource has no purpose left at all; this resource is still doing its intended job, just at a rate that is no longer free.
- **C.** Suspension on allowance exhaustion is not how any of the free-tier shapes behave when a payment method is attached; billing continues rather than the resource pausing.
- **D.** Correct. Exceeding an allowance generally does not stop the resource on an account with a payment method attached — it starts billing at the standard rate, without any warning built in.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.free-tier-and-pricing-calculators](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.free-tier-and-pricing-calculators)

### 15. A

*linux.command-line.general-networking-commands · Linux Fundamentals :: Command Line · depth 3 · application*

`ss -tulpn` lists listening TCP and UDP sockets with ports and owning processes: `t` TCP, `u` UDP, `l` listening, `p` process, `n` numeric so no service-name lookup happens — exactly what is needed to confirm what is bound to 8080.

- **A.** Correct. `ss -tulpn` lists TCP and UDP listening sockets with their owning process and numeric port numbers — `t` TCP, `u` UDP, `l` listening only, `p` process, `n` numeric — which is exactly the "who is listening on which port" answer.
- **B.** `curl -I` fetches HTTP response headers if a service answers; it says nothing about which process on the host is bound to the port, and requires a service to already be responding.
- **C.** `traceroute` maps the network path to a destination hop by hop; it has no way to enumerate which local processes are listening on which ports.
- **D.** `hostname -I` shows configured addresses, not port or process information; it does not list listening sockets at all.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.general-networking-commands](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.general-networking-commands)

### 16. C

*pm.open-source-software-and-licensing.apache-license-2-0 · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

Section 3 grants a scoped patent licence and terminates it for anyone who files patent litigation alleging the work infringes — a mechanism unique to Apache-2.0 among the permissive licences and central to what it adds over MIT and BSD.

- **A.** MIT's and BSD's silence on patents is beside the point here; Apache-2.0's own section 3 does carry a termination clause, and it applies.
- **B.** Termination under section 3 is scoped to the litigant's own licences; the NOTICE file's attribution list has no bearing on whose grant ends.
- **C.** Correct. Section 3 states that patent licences granted to You terminate as of the date such litigation is filed.
- **D.** Apache-2.0's patent-termination clause is a feature of its own permissive text and needs no copyleft licence layered on top to take effect.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.apache-license-2-0](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.apache-license-2-0)

### 17. D

*sysadmin.networking.etc-resolv-conf · System Administration Fundamentals :: Networking · depth 3 · application*

On modern systems the file is generated — by NetworkManager, a DHCP client, or as a symlink into systemd-resolved's runtime directory — so a hand edit to a generated file is overwritten at the next lease renewal, reboot or network reconfiguration; the durable change belongs in that tool's own configuration.

- **A.** The scenario states the fix worked initially, so the file was writable and the edit took effect; it was later overwritten by regeneration, not rejected outright.
- **B.** The nameserver lines are regenerated by whichever tool manages the file, not because they are literally part of the address lease; the mechanism is regeneration, not lease expiry of the file's content.
- **C.** `/etc/hosts` holds name-to-address mappings, not nameserver addresses; it has no bearing on which nameservers are queried, which is what `/etc/resolv.conf` governs.
- **D.** Correct. A hand edit to a generated file is overwritten at the next lease renewal, reboot, or network reconfiguration — the durable change belongs in NetworkManager, Netplan or systemd-resolved configuration instead.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.etc-resolv-conf](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.etc-resolv-conf)

### 18. D

*sysadmin.networking.load-balancer · System Administration Fundamentals :: Networking · depth 3 · discrimination*

A load balancer is the standard answer to both handling more traffic and surviving a server failure, distinguished from a proxy by intent: it selects a backend by a scheduling algorithm, health-checks each one continuously, and removes failing ones from rotation, which is not inherent to a proxy simply mediating on someone's behalf.

- **A.** A proxy commonly has just one backend behind it; distributing across several backends and health-checking them is what specifically defines a load balancer, not a proxy generically.
- **B.** A firewall filters traffic by policy; it does not health-check backends or remove them from a rotation, which is specifically a load balancer's job, and it is exactly the device the team needs here.
- **C.** A reverse proxy commonly does distribute traffic across multiple backends once it takes on that role, which is exactly how it becomes a load balancer; the restriction described here does not hold.
- **D.** Correct. The separating axis is intent rather than position: a load balancer exists to distribute work across many backends and survive their failure, while a proxy exists to stand in for one party in an exchange, which does not inherently require more than one backend.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.load-balancer](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.load-balancer)

### 19. B

*security.security.cia-triad · Security Fundamentals :: Security · depth 3 · discrimination*

A backup restore serves availability (the service returns) and integrity (the data is known-good), which is exactly why the guide names it an availability-and-integrity control. It is not automatically a confidentiality control, and an unencrypted backup file continues to expose confidentiality even after a clean restore.

- **A.** A successful restore says nothing about confidentiality, and the guide is explicit that an unencrypted backup weakens exactly that leg.
- **B.** Correct. Restoring known-good data serves both integrity and availability, but a backup that anyone with access to the media can read still weakens confidentiality.
- **C.** The guide states a backup restores known-good data and is therefore both an availability and an integrity control.
- **D.** Authentication and authorization are not legs of the CIA triad; they belong to the separate AAA trio.

Study it: [04-security/security.md#c-security.security.cia-triad](../study-guide/04-security/security.md#c-security.security.cia-triad)

### 20. C

*cloud.budgeting.pay-as-you-go · Cloud Computing Fundamentals :: Budgeting · depth 3 · application*

A virtual machine running at 2% CPU costs exactly what the same machine costs at 100%: the meter counts provisioned, running capacity, not work performed, which is precisely why rightsizing and orphaned resources cost money at all.

- **A.** Rightsizing is a deliberate periodic review a human performs; the meter itself does no automatic detection or partial billing.
- **B.** Autoscaling changes how many units run in response to live traffic; a single idling instance sitting at 2% is not itself evidence that autoscaling applies or has acted.
- **C.** Correct. A cloud meter charges for capacity being provisioned and running, regardless of how much of it any workload actually uses.
- **D.** That phrase is routinely misread this way, and the misreading is the single most expensive misunderstanding on a cloud invoice — the meter counts provisioned capacity, not work done.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.pay-as-you-go](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.pay-as-you-go)

### 21. B

*linux.command-line.port-ranges · Linux Fundamentals :: Command Line · depth 3 · application*

Binding a port below 1024 requires the `CAP_NET_BIND_SERVICE` capability on Linux, usually held by root but grantable to a specific binary or systemd unit — which is exactly why an unprivileged process can bind 8080 but not 80 unless it holds that capability.

- **A.** The actual privileged boundary is 1024, not 8080; ports from 1024 up to 49151 are registered but unprivileged, so plenty of ports below 8080 need no special capability at all.
- **B.** Correct. On Linux only a process holding `CAP_NET_BIND_SERVICE` may bind a port below 1024; that capability can be granted to a specific binary or systemd unit, letting a modern web server bind port 80 while still running unprivileged.
- **C.** The `CAP_NET_BIND_SERVICE` capability specifically allows binding a privileged port without the process running as root at all, which is exactly how modern web servers avoid running as root.
- **D.** The restriction is a kernel capability check performed at bind time - ip(7) gives EACCES for "binding to a privileged port without superuser privileges (the CAP_NET_BIND_SERVICE capability)" - so it holds with no firewall rules present at all.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.port-ranges](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.port-ranges)

### 22. C

*devops.containers.container-orchestration · DevOps Fundamentals :: Containers · depth 3 · discrimination*

The exam's alternative answer to an orchestration requirement is always a single-host tool, usually Compose. The discriminating property is multiple hosts plus continuous reconciliation — something that keeps comparing running state against declared state and acts on the difference indefinitely, which a single, larger host still cannot provide.

- **A.** Container count is not the discriminator; the requirement is surviving a host failure, which no number of containers on one host can satisfy.
- **B.** Resource allocation per container does not address a host dying entirely, which removes every container on it regardless of how well-resourced each one was.
- **C.** Correct. The discriminating property is many hosts plus a controller that keeps comparing actual state to desired state, not how many containers run on one machine.
- **D.** Pull speed does not create the additional hosts, scheduling, or health-checking that surviving a node failure and scaling under load require.

Study it: [05-devops/containers.md#c-devops.containers.container-orchestration](../study-guide/05-devops/containers.md#c-devops.containers.container-orchestration)

### 23. D

*sysadmin.networking.proxy · System Administration Fundamentals :: Networking · depth 3 · application*

A forward proxy sits in front of clients and is configured by them, which is why filtering employee web access, caching outbound requests and enforcing policy are forward-proxy jobs; a reverse proxy sits in front of servers and is invisible to clients, which is why hiding an internal application server behind a public hostname is a reverse-proxy job.

- **A.** A forward proxy, not a reverse proxy, is the one configured by clients and positioned in front of them; a reverse proxy sits in front of servers and is invisible to clients instead.
- **B.** A forward proxy sits in front of clients and is configured by them; hiding an internal server from the public internet is specifically a reverse-proxy job on the server side instead.
- **C.** A VPN provides an encrypted tunnel for network-level access; it does not filter and log web traffic or front an internal application the way a proxy specifically does.
- **D.** Correct. The two directions solve opposite problems: filtering and policy enforcement on outbound client traffic is a forward-proxy job, while hiding and fronting an internal server is a reverse-proxy job.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.proxy](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.proxy)

### 24. D

*cloud.cloud-computing.hypervisor · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

KVM is a module inside the Linux kernel, which makes the kernel itself the hypervisor — the lowest software layer scheduling VM resources directly against hardware, exactly what type 1 means. Vendors classify it as type 1 even though a full Linux userland runs alongside it, because that userland does not sit beneath KVM the way a host OS sits beneath a type 2 hypervisor like VirtualBox.

- **A.** The presence of a userland is exactly the distractor the guide warns about; what decides the type is whether the hypervisor is the lowest software layer, and as a kernel module, KVM is.
- **B.** KVM is a specific hypervisor implementation, and Red Hat names it alongside Hyper-V and vSphere as an example of a type 1 hypervisor; virtualization is the broader capability, and type 1 versus type 2 classifies hypervisors specifically, which KVM is.
- **C.** Where KVM is deployed is irrelevant to its classification; the deciding fact is that the kernel module makes the kernel itself the hypervisor, whether on a desktop or in a datacentre.
- **D.** Correct. KVM is precisely the case the guide singles out as testing understanding rather than recall: being a kernel module makes the kernel the lowest software layer, which is what type 1 means, regardless of what else runs on top.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hypervisor](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hypervisor)

### 25. C

*pm.open-source-software-and-licensing.dual-licensing · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 1 · recall*

Dual licensing is offering the same code under two licences at once, and only the copyright holder — directly, or through contributor agreements it collects — can do it. A downstream recipient's copy stays under the terms it was received on.

- **A.** A CLA grants a project rights over a contribution; it does not hand a downstream recipient the rights holder's own relicensing authority.
- **B.** Compatibility between two licences does not create authority to relicense; that authority belongs to the copyright holder alone.
- **C.** Correct. Dual licensing is a right of the rights holder, and downstream recipients do not inherit the ability to relicense code they only received.
- **D.** Dual licensing changes nothing about the terms of the copy already received; it is not a route into the public domain for recipients.

Study it: [06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-compliance](../study-guide/06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-compliance)

### 26. A

*sysadmin.networking.ttl-and-dns-caching · System Administration Fundamentals :: Networking · depth 3 · application*

TTL explains why a DNS change is not visible everywhere at once, and planning a migration means lowering the TTL before the change, not during it, so that resolvers are already holding a short-lived cached answer by the time the actual change lands.

- **A.** Correct. Planning a migration means lowering the TTL before the change, not during it, since a TTL that is only lowered at the moment of the change has not yet propagated and does nothing to shorten the transition.
- **B.** A higher TTL makes resolvers cache an answer longer, which slows propagation of a later change, not speeds it; lowering the TTL in advance is what shortens the transition.
- **C.** Flushing a local cache does nothing to the caches held by every other resolver on the internet; you cannot force other people's resolvers to forget an answer, which is exactly why lowering the TTL in advance is necessary instead.
- **D.** Deleting the record first would cause resolution failures during the gap, which is the opposite of minimising disruption; lowering the TTL in advance is the standard, non-disruptive preparation instead.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ttl-and-dns-caching](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ttl-and-dns-caching)

### 27. C

*security.security.firewalls-and-network-segmentation · Security Fundamentals :: Security · depth 2 · application*

Rules are written default-deny — permit what is required, drop everything else — and a stateful firewall tracks connection state so return traffic for a permitted outbound flow is allowed automatically, without a separate inbound rule having to mirror it.

- **A.** That describes a stateless design; a stateful firewall tracks the connection and admits the matching return traffic without a mirrored inbound rule.
- **B.** Segmentation and stateful tracking are separate mechanisms; return traffic for a permitted flow is admitted by the stateful property itself, independent of zoning.
- **C.** Correct. Stateful filtering is precisely what lets return traffic for a permitted flow through automatically, which is why the rule set can stay default-deny elsewhere.
- **D.** TLS encrypts the payload but does not exempt the connection from firewall filtering, and stateful tracking already handles return traffic without needing this exception.

Study it: [04-security/security.md#c-security.security.firewalls-and-network-segmentation](../study-guide/04-security/security.md#c-security.security.firewalls-and-network-segmentation)

### 28. B

*linux.command-line.reading-ls-l-output · Linux Fundamentals :: Command Line · depth 5 · recall*

The type character is `-` for a regular file, `d` for a directory, `l` for a symbolic link, and several other letters for device files, pipes and sockets. `l` specifically identifies a symbolic link.

- **A.** File attributes such as immutability are not represented in the leading type character at all; a regular file always shows `-` there regardless of its attributes.
- **B.** Correct. The leading type character is `l` specifically for a symbolic link, distinct from `-` for a regular file and `d` for a directory.
- **C.** Link-count limits are not represented in the type character either, and a directory always shows `d` there, not `l`.
- **D.** A hard link is simply an additional name for an ordinary inode and shows the same `-` type character as any other regular file; `l` is reserved for symbolic links.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.reading-ls-l-output](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.reading-ls-l-output)

### 29. A

*sysadmin.system-administration.cron · System Administration Fundamentals :: System Administration · depth 3 · application*

A user crontab is edited through `crontab -e` because the command validates the syntax and installs the result into the spool directory the daemon watches. Editing the spool file directly can leave cron unaware of the change and skips the validation step entirely.

- **A.** Correct. Editing the spool file directly can leave the daemon unaware of the edit and bypasses the syntax check the command performs before installing anything.
- **B.** The command path adds a validation step and guarantees the daemon picks up the change, neither of which a direct file edit provides.
- **C.** `crontab -e` is specifically the personal crontab editor; system crontabs under `/etc/cron.d/` are a different, separate mechanism.
- **D.** A personal crontab can hold any number of lines; the reason to prefer the command is validation and daemon notification, not a line-count restriction.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.cron](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.cron)

### 30. A

*cloud.cloud-computing.paas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

PaaS platforms usually keep application instances provisioned and warm so requests can be served immediately, and that warm capacity is billed whether or not it is handling traffic. That is precisely the line CNCF draws between PaaS and FaaS: FaaS scales to zero and charges nothing when idle, while PaaS's operational relief does not extend to its billing model.

- **A.** Correct. CNCF's FaaS entry draws exactly this line: FaaS eliminates costs when functions are dormant, 'distinguishing it from other models like Platform as a Service (PaaS), which require continuous resource availability'.
- **B.** Scaling to zero and charging nothing when idle is the FaaS property, not PaaS's; a flat overnight charge for a PaaS app is expected behaviour, not a mistake.
- **C.** PaaS billing tracks provisioned compute resources, not a per-seat subscription; that billing shape belongs to SaaS instead.
- **D.** Not having to manage servers is only half true — the team still configures scaling policies, and provisioned instances that stay warm are exactly why an idle app still costs money.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.paas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.paas)

### 31. D

*devops.containers.registry · DevOps Fundamentals :: Containers · depth 3 · discrimination*

A full reference is `registry/repository:tag`. The registry is the server, the repository is a named collection of tags inside it, and the image is the artifact a given tag points to.

- **A.** The reference does identify the artifact, but the leading host segment names a distinct server that stores and serves it, not part of the image itself.
- **B.** `team/api` is the repository, a named collection of tags inside the registry, not the registry itself.
- **C.** `1.4.2` is the tag, a mutable pointer to one image inside a repository; it has no relationship to the registry hostname.
- **D.** Correct. The registry is the hosting server; everything after it names a repository and tag inside that server, pointing at the image itself.

Study it: [05-devops/containers.md#c-devops.containers.registry](../study-guide/05-devops/containers.md#c-devops.containers.registry)

### 32. B

*sysadmin.system-administration.dependency · System Administration Fundamentals :: System Administration · depth 2 · recall*

A dependency is a package another package requires — usually a shared library or helper binary. A repository-aware manager such as `apt` or `dnf` resolves these recursively, which is the single feature that separates it from a single-package tool such as `dpkg` or `rpm`.

- **A.** A recommended or suggested package is a softer relationship than a hard dependency; only a hard dependency blocks installation if it is missing.
- **B.** Correct. The manager reads the requested package's declared requirements and works out the full set that must be present first.
- **C.** A configuration file is a piece of the package's own content, not another package it requires in order to function.
- **D.** Where a package came from is a separate concept from what other packages it needs installed alongside it; the `Depends` field names required packages, never a repository.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.dependency](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.dependency)

### 33. D

*linux.command-line.shell-variables-and-export · Linux Fundamentals :: Command Line · depth 3 · application*

`export NAME=value` assigns and exports in one step, and `export` may also be applied after a plain assignment; either way, what matters is that the variable has been exported before the child process that needs it starts.

- **A.** bash(1) gives the builtin's synopsis as `export [-fn] [name[=value]] ...`, so assigning and exporting in one statement is documented syntax, not an error.
- **B.** A space around `=` breaks the assignment entirely — `NAME = value` is parsed as running a command called `NAME` with two arguments — so this would introduce a new bug rather than combining the lines safely.
- **C.** Exporting does not discard or reset a variable's value; it only marks the existing value for inclusion in the environment of future child processes.
- **D.** Correct. `export` can mark a variable for the environment either at the same time it is assigned or afterward; what matters is that the export has happened by the time a child process that needs it is started.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.shell-variables-and-export](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.shell-variables-and-export)

### 34. A

*security.security.principle-of-least-privilege · Security Fundamentals :: Security · depth 3 · recall*

Least privilege means granting only the access a task requires, for no longer than it needs it. Elevating per command through `sudo` rather than logging in as root applies that idea to duration as well as to scope.

- **A.** Correct. Per-command elevation is the guide's stated example of least privilege applied to duration as well as scope.
- **B.** `sudo` elevation narrows how much authority the account holds at any moment; it does not add a separately-failing barrier on the path in.
- **C.** Per-command `sudo` elevation does not itself introduce a second, distinct factor category the way MFA does.
- **D.** Logging elevated commands is a side benefit for accounting, but the practice being described — using ordinary accounts and elevating per command — is what least privilege names.

Study it: [04-security/security.md#c-security.security.principle-of-least-privilege](../study-guide/04-security/security.md#c-security.security.principle-of-least-privilege)

### 35. A

*pm.open-source-software-and-licensing.proprietary-software · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

Copyright reserves all rights to the author by default; this licence gives away only the right to run a copy, which is the proprietary pattern regardless of the zero price attached to it.

- **A.** Correct. Proprietary status turns on the rights withheld, and this licence withholds exactly the rights the definition cites.
- **B.** Zero cost is not evidence of open source status; the licence still withholds source and reserves modification and redistribution.
- **C.** Zero cost is a price point, not a licence category; a program whose users lack the freedoms to study, modify and redistribute it is nonfree however little it costs.
- **D.** Source-available describes a licence where the code is published; nothing here has been published, so the label does not apply.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.proprietary-software](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.proprietary-software)

### 36. C

*sysadmin.system-administration.etc-shadow · System Administration Fundamentals :: System Administration · depth 3 · recall*

Exact permissions are distribution-specific: Debian-family systems ship `/etc/shadow` as `0640 root:shadow` so the `shadow` group can read it, while Red Hat-family systems ship it `0000 root:root`, relying on root bypassing permission checks entirely. Neither figure should be stated as universal. `chage` is the tool for reading or changing the ageing fields this file holds.

- **A.** That mode would leave the file world-readable, exposing every password hash — exactly what shadowing exists to prevent.
- **B.** The two families do not converge on one mode; the permissions genuinely differ by family, which is the point being tested.
- **C.** Correct. Debian-family lets the `shadow` group read it under a non-zero mode; Red Hat-family ships no permission bits at all and relies on root bypassing checks.
- **D.** This reverses the actual Debian-family ownership, where `root` owns the file and `shadow` is the readable group.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-shadow](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.etc-shadow)

### 37. B

*cloud.cloud-computing.virtualization · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

Virtualization is the capability — partitioning one physical machine so it can run multiple isolated operating systems. The hypervisor is the specific software layer, sitting between hardware and guests, that implements that capability, schedules real resources behind the illusion of dedicated hardware, and comes in the type 1 and type 2 varieties that classify hypervisors, not the concept of virtualization itself.

- **A.** The guide treats conflating the two as a trap: naming a product like ESXi or KVM names a hypervisor, while the capability those products provide is virtualization.
- **B.** Correct. This is the exact distinction the guide draws: one names a capability, the other names the specific program implementing it.
- **C.** A hypervisor and a container runtime are different technologies entirely — one creates virtual machines with their own kernels, the other starts processes sharing the host kernel.
- **D.** Virtualization long predates cloud computing and runs on a single desktop or server with no cloud involved at all; the guide is explicit that virtualization is not itself cloud computing.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.virtualization](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.virtualization)

### 38. C

*sysadmin.system-administration.login-shell · System Administration Fundamentals :: System Administration · depth 3 · application*

The login shell is the program started at login, and setting it to `/usr/sbin/nologin` is the standard way to create an account that owns files and can be used to run scheduled work but cannot be used to log in interactively. `chsh` is the ordinary command for changing which shell an account uses.

- **A.** Locking blocks password authentication specifically, but key-based or other authentication methods can still start an interactive shell.
- **B.** Removing the shadow row breaks password authentication entirely and leaves the account in an inconsistent, unsupported state.
- **C.** Correct. A nologin shell is exactly the standard mechanism for an account that must exist and own files but never provide an interactive session.
- **D.** A high UID is a convention for distinguishing service accounts visually; it has no effect on whether login is possible.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.login-shell](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.login-shell)

### 39. A

*devops.devops-basics.idempotency-in-automation · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

An idempotent task checks the current state before acting; once the declared state is satisfied, a second or third run finds nothing to do. That is what makes automation safely re-runnable after an interrupted or retried run.

- **A.** Correct. An idempotent task checks state before acting, so repeated runs beyond the first that already satisfies it have no additional effect.
- **B.** This confuses idempotent with unconditional; an idempotent task is defined by checking state first, not by repeating an action blindly.
- **C.** A converged, idempotent task reports nothing to change; drift only appears when reality has diverged from the declaration since the last run.
- **D.** Idempotency is a property of the individual task's behaviour on repeated runs, not something that governs whether an unrelated test suite reruns.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.idempotency-in-automation](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.idempotency-in-automation)

### 40. A

*linux.linux-operating-system.cpu-architecture · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`uname -m` reports the machine hardware name via its `-m` option, distinct from `-r`'s kernel release. `arch` reports the same value as a thin wrapper, so the two commands do not disagree on Linux.

- **A.** Correct. The guide names `-m` specifically for machine hardware name, distinct from `-r` for kernel release.
- **B.** `-r` reports the kernel release, a version string, not the machine hardware name; it answers a different question than the one the pipeline asked.
- **C.** `lscpu` does report an `Architecture:` line, but it is not the only place: `uname -m` prints the machine hardware name directly, which is the field the task calls for.
- **D.** On Linux, `arch` is effectively a thin wrapper around the same value `uname -m` reports; assuming disagreement is possible is the guide's stated trap.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.cpu-architecture](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.cpu-architecture)

### 41. C

*cloud.networking.cidr-planning-for-cloud-networks · Cloud Computing Fundamentals :: Networking · depth 2 · recall*

Running short of addresses is recoverable, because the range is not locked at creation on any of the three major providers; discovering an overlap is not recoverable in the same way, because other infrastructure has usually already been built on the original range.

- **A.** Growing addressable space is well supported; undoing an overlap once other infrastructure is built on top of it is a much harder, disruptive re-addressing exercise, not an equally easy operation.
- **B.** Azure documents changing a subnet address range after creation and Google Cloud documents expanding a subnet’s primary IPv4 range, so the premise that a subnet block can never be resized is itself false.
- **C.** Correct. AWS documents adding a further CIDR block to an existing VPC, Azure documents adding an address range to a live virtual network, and Google Cloud documents expanding a subnet’s primary IPv4 range.
- **D.** An address change can require rebuilding an affected peering connection, but that is a one-time fix, not a permanent break; conflating the two problems overstates the overlap case and understates the growth case.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cidr-planning-for-cloud-networks](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cidr-planning-for-cloud-networks)

### 42. B

*security.security.single-sign-on · Security Fundamentals :: Security · depth 2 · recall*

SSO reduces the number of separate passwords a user manages and centralises the control point for offboarding, but it does not by itself make any single authentication event stronger. Putting every application behind one login concentrates risk there, which is why MFA is enforced at the identity provider alongside SSO rather than replaced by it.

- **A.** SSO centralises where authentication happens; strengthening it to require MFA is a separate, deliberate decision enforced at the identity provider.
- **B.** Correct. The guide is explicit that SSO and MFA are offered as alternatives on the exam precisely because SSO alone does not add authentication strength.
- **C.** SSO does not mandate any particular authenticator type; what it changes is how many separate logins the user performs.
- **D.** SSO concentrates risk in one login, which is exactly why MFA is enforced alongside it rather than a reason to call SSO weaker in every case.

Study it: [04-security/security.md#c-security.security.single-sign-on](../study-guide/04-security/security.md#c-security.security.single-sign-on)

### 43. B

*sysadmin.system-administration.proc-and-sys · System Administration Fundamentals :: System Administration · depth 3 · application*

Writing to `/proc/sys/vm/swappiness` changes the running kernel immediately, but the change is not persistent — it is lost at the next boot unless the same setting is also recorded in `/etc/sysctl.conf` or a file under `/etc/sysctl.d/`, which is applied at startup. Other read-only entries, such as `cat /proc/cpuinfo`, expose kernel state without any tunable to persist.

- **A.** `/proc` is a pseudo-filesystem generated by the kernel and writes nothing back to disk; persistence works the other way round, with `systemd-sysctl.service` reading `/etc/sysctl.d/*.conf` at boot and writing each key into `/proc/sys`.
- **B.** Correct. Writes under `/proc/sys` take effect on the live kernel right away, but persistence across a reboot needs the same setting recorded in configuration read at startup.
- **C.** The opposite is true: the write to `/proc/sys` takes effect on the running kernel immediately, without any reboot.
- **D.** Device nodes live under `/dev` and represent hardware; `/proc/sys` is a distinct virtual filesystem exposing tunable kernel parameters as files.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.proc-and-sys](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.proc-and-sys)

### 44. A

*linux.linux-operating-system.kernel · Linux Fundamentals :: Linux Operating System · depth 3 · discrimination*

The kernel schedules the CPU across processes, manages memory, drives devices, and enforces the permission model. Every other concept in this competency ultimately routes through it, which is why 'what actually does X' questions resolve to the kernel even when the wording says 'Linux' or 'the OS.'

- **A.** Correct. These are the specific responsibilities the guide assigns to the kernel by name, not to the OS as a whole.
- **B.** The operating system is the broader layer the kernel belongs to; the kernel is its privileged core, not an interchangeable label for it.
- **C.** An init system is an ordinary userspace process the kernel starts and schedules like any other; it does not itself perform scheduling or memory management.
- **D.** A shell only requests process control through system calls; the kernel is what actually performs the scheduling and enforcement behind that request.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.kernel](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.kernel)

### 45. D

*pm.project-management.product-and-sprint-backlog · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

The Sprint Backlog has three parts: the Sprint Goal (why), the selected Product Backlog items (what), and an actionable plan (how). Describing it as only the selected items drops the goal and the plan, leaving what would just be a filtered slice of the Product Backlog rather than a plan by and for the Developers.

- **A.** That description names only one of the Sprint Backlog's three parts and omits the goal and the plan entirely.
- **B.** Velocity is a forecasting input calculated from past Sprints; it isn't one of the Sprint Backlog's own components.
- **C.** The Definition of Done is a separate commitment attached to the Increment, not a component the Sprint Backlog itself is missing.
- **D.** Correct. The Sprint Backlog is composed of the Sprint Goal, the selected items, and a plan for delivering them — dropping two of three leaves just a filtered view of the Product Backlog.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.product-and-sprint-backlog](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.product-and-sprint-backlog)

### 46. C

*sysadmin.system-administration.service · System Administration Fundamentals :: System Administration · depth 3 · application*

A service is a process wrapped in a management policy: how to start it, what to do when it exits, and whether it should come back at boot. A process launched by hand has none of that definition behind it, which is why only the unit-managed copy restarts itself. `systemctl` is the control interface for units and the manager that supplies that policy.

- **A.** The underlying program is identical either way; what differs is whether a management layer is watching and restarting it.
- **B.** Both could equally detach from a terminal; the restart behaviour comes from the unit's `Restart=` policy, not from daemon status.
- **C.** Correct. A service adds restart behaviour, dependency ordering and boot-time activation on top of the process; a hand-launched process has none of that.
- **D.** A nice value affects CPU scheduling priority and has no bearing on whether anything restarts a process after it exits.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.service](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.service)

### 47. A

*cloud.performance-availability.availability · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

Monthly downtime allowance is (1 minus availability) times 30 days times 24 times 60 minutes: about 43.2 minutes at 99.9% and about 21.6 minutes at 99.95%, a difference of 21.6 minutes recomputed directly from the definition rather than copied from the guide's table.

- **A.** Correct. 43.2 minus 21.6 minutes is 21.6 minutes; both figures follow from (1 minus availability) times the 30-day window.
- **B.** This mistakes 99.95% to 99.9% for a change of one full nine; the ten-times step applies between whole nines, not half-nines, and understates the real difference.
- **C.** That figure is the monthly allowance recovered going from 99.9% down to 99%, a full nine away from the pair in the question.
- **D.** The two monthly allowances differ by a factor of two, which is not a rounding artefact.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.availability](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.availability)

### 48. D

*devops.devops-basics.pipeline · DevOps Fundamentals :: DevOps Basics · depth 3 · application*

A pipeline is the concrete machinery a change runs through, distinct from the practices it may or may not implement. A monthly, manually triggered pipeline is a pipeline and is neither continuously integrating nor delivering.

- **A.** Owning the stages is not the same as merging often; a pipeline is not CI/CD by itself, regardless of which stages it lists.
- **B.** Releasability is a claim about continuous delivery, not about whether the described merge frequency counts as continuous integration.
- **C.** Which tool authors the definition file has no bearing on whether merges to the shared branch happen often.
- **D.** Correct. A pipeline is the mechanism; whether the team practises continuous integration depends on merge frequency, which this pipeline does not establish.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.pipeline](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.pipeline)

### 49. B

*sysadmin.system-administration.systemctl-start-vs-enable · System Administration Fundamentals :: System Administration · depth 5 · application*

`systemctl start` and `systemctl enable` are orthogonal: one affects the running system now, the other affects the next boot, and neither implies the other. `systemctl enable --now` is exactly the shorthand for doing both in a single command.

- **A.** Starting acts on the running system only and consults nothing about the next boot — a started-but-not-enabled service is simply absent after a reboot.
- **B.** Correct. It creates the boot-time symlink from the unit's `[Install]` section and starts the unit immediately, covering both halves of the requirement at once.
- **C.** `enable` only creates the boot-time symlink from `[Install]`. It does reload the manager configuration afterwards so the new symlink takes effect, but systemctl(1) is explicit that this 'does not have the effect of also starting any of the units being enabled'.
- **D.** `daemon-reload` takes no unit argument and only re-reads unit files; it neither starts a unit nor changes its boot-time activation.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.systemctl-start-vs-enable](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.systemctl-start-vs-enable)

### 50. A

*security.sensitive-data.data-retention-and-disposal · Security Fundamentals :: Sensitive Data · depth 3 · application*

A legal hold suspends the retention schedule: once a hold is in place for a matter, the affected records must not be destroyed even if the schedule says their time is up, and the hold overrides the schedule until it is lifted. It applies to the records themselves, wherever they sit, and is enforced by suspending the retention process rather than by any content-inspection control.

- **A.** Correct. A legal hold overrides the schedule for as long as it is in place, regardless of what the retention period would otherwise require.
- **B.** A legal hold applies to existing records precisely to prevent their destruction while a matter is pending; it is not limited to future data.
- **C.** A legal hold covers the affected records wherever they exist, including production; it does not selectively skip the copy the litigation is actually about.
- **D.** DLP inspects data leaving the organisation; a legal hold is enforced by suspending the retention schedule itself, not by a content-inspection control.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.data-retention-and-disposal](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.data-retention-and-disposal)

### 51. C

*linux.linux-operating-system.linux-history · Linux Fundamentals :: Linux Operating System · depth 2 · discrimination*

Kernel development runs through a maintainer hierarchy escalating to Torvalds. The Linux Foundation provides infrastructure, funding, and trademark stewardship — sponsorship and hosting, not technical governance.

- **A.** Employing contributors and lending its name to a certification are sponsorship activities; the Foundation does not decide which patches merge or set the kernel's direction.
- **B.** Subsystem maintainers review and merge the vast majority of patches, escalating disputed changes upward; Torvalds is the top of a hierarchy, not the sole reviewer.
- **C.** Correct. Subsystem maintainers merge patches and Torvalds closes each merge window, while the Foundation manages the Linux Kernel Organization and keeps the infrastructure running.
- **D.** The Foundation provides neutral ground for vendors to collaborate, but kernel technical decisions run through the maintainer hierarchy, not a vendor vote.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.linux-history](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.linux-history)

### 52. D

*sysadmin.system-administration.systemd-timer · System Administration Fundamentals :: System Administration · depth 3 · application*

A timer unit is paired by name with a service unit it activates on a schedule. Enabling the service instead of the timer is the standard mistake: it makes the job run at every boot, which is not a schedule — the timer, not the service, is what must be enabled to get scheduled activation. `systemctl list-timers` shows every timer with its next and last activation.

- **A.** Enabling the service does not consult the timer's schedule at all; only enabling the `.timer` unit itself causes activation on that schedule.
- **B.** A `.service` unit can be enabled on its own perfectly well; the issue is that doing so only activates it at boot, not on any recurring schedule.
- **C.** `OnCalendar=` belongs to the `.timer` unit, not the `.service` unit; a service unit is not expected to carry that directive and enabling it does not fail for lacking one.
- **D.** Correct. A timer and its paired service are separate units, and enabling the service on its own only activates it at boot rather than on the timer's intended schedule.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd-timer](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd-timer)

### 53. B

*cloud.performance-availability.latency-and-throughput · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · application*

Optimising one of latency or throughput can actively worsen the other. Batching many small operations into one larger one raises throughput and simultaneously raises the latency of every item now waiting for the batch to fill — the exam's standard example of the trade-off.

- **A.** Batching is chosen specifically because it raises throughput by amortising per-operation overhead across many items, not because it lowers it.
- **B.** Correct. Batching trades per-item delay for aggregate volume; each item waits longer so the batch it belongs to can complete.
- **C.** The two use different units and are not derivable from one another; a system can be excellent at one while poor at the other, exactly as here.
- **D.** Nothing about grouping writes together changes whether the underlying storage is redundant or fault tolerant; the trade being made is purely delay versus volume.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.latency-and-throughput](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.latency-and-throughput)

### 54. B

*pm.software-application-architecture.web-server-vs-application-server · IT Project Management Fundamentals :: Software Application Architecture · depth 3 · application*

Static assets loading confirms the web server is alive and serving files it already has; a 502 means it forwarded a request and got back an invalid response, which locates the fault in the application server behind it — exactly the diagnostic split the two roles exist to support.

- **A.** 502 specifically means a gateway or proxy got an invalid response from upstream; it is evidence the web server is working as a proxy and the upstream is not.
- **B.** Correct. The web server is demonstrably serving files from disk without help; the fault sits behind it, where the application server executes the request.
- **C.** A load balancer or reverse proxy sitting in front is typically described as infrastructure serving the tiers, not a tier of its own.
- **D.** Nothing here isolates the database specifically; the symptom points at whatever is behind the web server's proxy, which is the application server first.

Study it: [06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.web-server-vs-application-server](../study-guide/06-it-project-management/software-application-architecture.md#c-pm.software-application-architecture.web-server-vs-application-server)

### 55. D

*sysadmin.system-administration.umask · System Administration Fundamentals :: System Administration · depth 3 · application*

A umask subtracts bits from the mode a program requests when creating a file. Programs conventionally request `0666` for a regular file, and a umask of `022` removes write from group and other, leaving `644`. The umask cannot grant permission — only remove it. The `umask` command reports or sets the current mask for a shell session.

- **A.** A umask is a mask of bits to remove, not the mode itself — it never becomes the file's permissions verbatim.
- **B.** A umask acts on future file creation and subtracts bits; `chmod 755` is an absolute, present-tense change to an existing file — the two are not interchangeable.
- **C.** A umask affects both files and directories created afterward; regular files are not exempt from it.
- **D.** Correct. A umask of `022` removes write from the group and other classes, turning the requested `666` into `644`.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.umask](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.umask)

### 56. C

*devops.git-concepts.push · DevOps Fundamentals :: Git Concepts · depth 3 · application*

Committing only records a snapshot in the local repository; nothing reaches the remote until a push. The commit/push split is the single most common misconception carried in from centralized tools, where committing itself publishes to the one shared history — Git keeps the two acts separate and only the second one needs a network.

- **A.** A commit's hash is computed entirely from local content and the parent it points at; no remote is contacted to produce it, and `git commit` runs the same with or without network access.
- **B.** That reverses the two roles: uploading to a remote branch is what `git push` does, while `git commit` only ever moves the local branch pointer, in the local repository.
- **C.** Correct. That is the separating axis exactly: commit writes history into the author's own copy; push is the separate, explicit act of making that history exist anywhere else.
- **D.** A push can be refused as a non-fast-forward update when the remote holds commits it would otherwise discard; a local commit has no equivalent remote-side rejection to worry about.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.push](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.push)

### 57. C

*security.sensitive-data.secrets-management · Security Fundamentals :: Sensitive Data · depth 2 · application*

An environment variable delivers a value to a process but provides none of a secret store's guarantees: it is inherited by every child process, readable by the process owner and root, and it routinely ends up in crash dumps, CI job logs and container inspect output. 'We moved it out of the code into an env var' is a partial answer — an improvement over source, but not access-controlled, audited or rotatable in the way a secret store is.

- **A.** Process-local is not the same as access-controlled or audited; the value still leaks into logs, dumps and any process that inherits the environment.
- **B.** A secret store's value is access control, an audit trail and rotation without a code change, none of which follows automatically from encryption at rest of the host.
- **C.** Correct. An environment variable is inherited by every child process and turns up in crash dumps and container inspect output, which is short of what a purpose-built secret store provides.
- **D.** Moving it out of source does remove it from every clone and code review, which is a real improvement even though the destination still falls short of a proper store.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.secrets-management](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.secrets-management)

### 58. B

*linux.linux-operating-system.terminal · Linux Fundamentals :: Linux Operating System · depth 3 · discrimination*

The terminal manages display and input; the shell interprets commands. A command hung on I/O is a shell-side condition needing a signal to the process, not a terminal-emulator restart — even though users describe both situations as 'the terminal froze.'

- **A.** The terminal displays; the shell interprets and forks commands. They are routinely conflated in speech, but they are different programs with different fixes.
- **B.** Correct. Casual speech conflates the two, but the fix differs: a genuinely frozen emulator needs killing at the window-manager level, a hung command needs a signal instead.
- **C.** Waiting on network I/O is ordinary blocking behaviour, not a kernel scheduling failure; nothing here implicates the kernel itself.
- **D.** Treating every unresponsive prompt as a terminal problem is exactly the looseness the exam exploits; the description here points at the shell's foreground command, not the display program.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.terminal](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.terminal)

### 59. B

*cloud.performance-availability.stateless-design · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

Stateless design is what makes instance termination safe: because no request depends on reaching the same instance twice, an auto-scaling group can remove an instance mid-shift and the load balancer simply routes the next request to a survivor, with nothing user-visible lost.

- **A.** The maximum bounds how large the group may grow; it says nothing about whether a terminated instance was holding state a user depended on.
- **B.** Correct. Statelessness is the precondition that lets auto-scaling, load balancing and instance replacement all happen without a user-visible fault.
- **C.** Active-passive versus active-active describes how redundant capacity is deployed, not whether any one instance held irreplaceable client state.
- **D.** A routine scale-in within one pool of interchangeable instances is not a cross-region event; it only becomes user-visible if the application is not stateless.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.stateless-design](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.stateless-design)

### 60. D

*sysadmin.troubleshooting.cannot-connect-to-a-service · System Administration Fundamentals :: Troubleshooting · depth 4 · diagnostic*

The layers of a connection failure are separately testable, and `ss -tulpn`'s Local Address column is the highest-value command once the process is confirmed running: `127.0.0.1` accepts only local clients while `0.0.0.0` accepts any, and that single field explains "works locally, fails remotely" without touching the firewall.

- **A.** A stale DNS answer typically produces a timeout against the wrong host, not an active refusal from a host that is confirmed running the service.
- **B.** `systemctl status` already confirmed the service is active, so "the service is down" is a conclusion the evidence has already ruled out.
- **C.** A TCP connection refusal is a network-layer response, not a filesystem permission fault, so a directory's mode bits are not the relevant evidence here.
- **D.** Correct. A daemon bound only to the loopback address is up, healthy and unreachable from anywhere else, and every remote test fails the same way regardless of firewall rules.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.cannot-connect-to-a-service](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.cannot-connect-to-a-service)

