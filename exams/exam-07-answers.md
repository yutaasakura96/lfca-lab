<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 07 — answers

### 1. A

*sysadmin.best-practices.configuration-management · System Administration Fundamentals :: Best Practices · depth 3 · application*

Configuration management declares and enforces the state inside systems that already exist. Infrastructure as code decides whether the infrastructure itself exists. Both are declarative and both re-apply to converge, which is exactly what makes the pair easy to conflate.

- **A.** Correct. Configuration management acts on the state inside systems that already exist; it configures rather than creates.
- **B.** That is infrastructure as code's question: whether the infrastructure itself has been brought into existence.
- **C.** That is a property of a single procedure, which is what automation and idempotency addresses, not the scope of configuration management.
- **D.** The shared vocabulary is exactly why they are confusable, but one configures what exists and the other creates what does not yet exist.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.configuration-management](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.configuration-management)

### 2. D

*cloud.best-practices.least-privilege-for-cloud-identities · Cloud Computing Fundamentals :: Best Practices · depth 2 · discrimination*

The exam's other favourite trap here is the assumption that read-only access is inherently safe: read permission on a secret store, a database, or an object storage bucket is exactly what data exfiltration requires, so least privilege has to scope resources and actions together.

- **A.** Reading sensitive data causes damage on its own; 'no writes' says nothing about exposure from reading.
- **B.** Encryption at rest protects against theft of the storage medium; it does nothing against a caller the service has already authorised to read.
- **C.** A secrets store can legitimately be read by identities that need it; the risk is granting read access more broadly than the task requires, not read access itself.
- **D.** Correct. Reading a secret, a database, or a bucket is enough to exfiltrate data, so 'read-only' is not automatically safe.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.least-privilege-for-cloud-identities](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.least-privilege-for-cloud-identities)

### 3. A

*linux.command-line.absolute-vs-relative-paths · Linux Fundamentals :: Command Line · depth 3 · command*

The shell tracks the working directory as a text string in `$PWD`, and plain `pwd` prints that logical path, following whatever symlinks were used to arrive. `pwd -P` instead prints the physical path with all symlinks resolved.

- **A.** Correct. `-P` prints the physical path with symlinks resolved; plain `pwd` prints the logical path the shell tracked as it followed the symlink.
- **B.** `-L` is the logical form, and it is also the default; it returns the same symlink-preserving path plain `pwd` already gives.
- **C.** `cd -P` changes directory while resolving symlinks along the way; it does not print the current location the way `pwd` does.
- **D.** A long listing of the directory entry shows its mode, links, owner, size and name; it never prints the working directory's own pathname, resolved or otherwise.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.absolute-vs-relative-paths](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.absolute-vs-relative-paths)

### 4. B

*security.compliance.controls-and-evidence · Security Fundamentals :: Compliance · depth 3 · discrimination*

A control is the safeguard; evidence is the artifact showing it operated. A configuration export shows the control was designed. Only logs, tickets or review records generated as a by-product of the control running during the period count as evidence that it operated.

- **A.** An audit is a periodic examination of evidence by an assessor; it is not itself the evidence the control produced day to day.
- **B.** Correct. A configuration export is evidence of design; the logs for the period are the evidence that the control operated.
- **C.** A policy document is evidence a control was designed, never evidence that it actually operated.
- **D.** 'We have it enabled' is an assurance, not evidence; only the logs proving it actually challenged users during the period count as evidence.

Study it: [04-security/compliance.md#c-security.compliance.controls-and-evidence](../study-guide/04-security/compliance.md#c-security.compliance.controls-and-evidence)

### 5. D

*devops.containers.container-runtime-and-oci · DevOps Fundamentals :: Containers · depth 2 · recall*

Docker is a full toolchain — CLI, image building, networking, volume management — layered above a runtime. The runtime itself is the component, typically containerd or CRI-O on a Kubernetes node, that actually creates and runs the container process.

- **A.** Kubernetes talks to a runtime through the Container Runtime Interface and supports containerd, CRI-O, and other implementations; it never required Docker specifically.
- **B.** Images produced by Docker are ordinary OCI images and run unmodified under containerd or CRI-O; the OCI specifications exist precisely to guarantee this.
- **C.** A registry only stores and distributes images; it plays no role in actually creating or running a container process on a node.
- **D.** Correct. The runtime is the lower-level piece that does the actual work; Docker adds a CLI, image building, and networking on top of one.

Study it: [05-devops/containers.md#c-devops.containers.container-runtime-and-oci](../study-guide/05-devops/containers.md#c-devops.containers.container-runtime-and-oci)

### 6. B

*pm.functional-analysis.process-mapping · IT Project Management Fundamentals :: Functional Analysis · depth 2 · application*

Process maps cover the whole workflow, including approvals given verbally and work queued in an inbox. Drawn in pairs — current and intended — they make improvement arguable; the as-is half is also where the unwelcome findings usually live.

- **A.** A gap analysis needs both states already mapped as its input; it does not substitute for drawing the missing as-is map itself.
- **B.** Correct. A single map of the intended future proves nothing on its own; process maps are usually drawn in two versions precisely so improvement is arguable rather than asserted.
- **C.** A use case documents one actor's interaction with the system; the workflow spans steps no software touches at all, which a use case would not capture.
- **D.** Agreement about how the future should look is not the same as showing what changed; without the present-state map there is no baseline to compare against.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.process-mapping](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.process-mapping)

### 7. C

*sysadmin.best-practices.separation-of-duties · System Administration Fundamentals :: Best Practices · depth 2 · discrimination*

Separation of duties splits a sensitive workflow so no single person can complete it alone, regardless of that person's privilege. Least privilege is a different axis entirely — the size of one identity's authority — and an administrator with root on every host still cannot self-approve a change where duties are genuinely separated.

- **A.** Least privilege is about the size of one identity's authority; root on every host is the opposite of a scoped grant.
- **B.** Nothing in the scenario describes revoking access on a role change; the control shown operates at the moment of the change itself.
- **C.** Correct. It is a structural control on how many identities a workflow requires, independent of how much any one of them is trusted.
- **D.** The control constrains how many identities a workflow requires, and it is not waived by how privileged any one of those identities happens to be.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.separation-of-duties](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.separation-of-duties)

### 8. A

*cloud.budgeting.budgets-and-cost-alerts · Cloud Computing Fundamentals :: Budgeting · depth 3 · discrimination*

Budgets and cost monitoring answer different questions: a budget requires a target decided beforehand and fires when actual or forecast spend crosses it, while monitoring has no number in it at all and simply reports what is happening and how the trend is moving.

- **A.** Correct. A budget requires a target decided in advance and fires an event when a threshold is crossed; monitoring has no number in it and simply describes what is happening — they answer different questions.
- **B.** A trend line has no defined threshold of its own; without a configured budget, nothing decides how much of a rise counts as approaching a limit.
- **C.** A calculator estimates cost for a configuration before it is built; it does not itself report ongoing spend or notify on a crossed threshold.
- **D.** A threshold breach is a notification, not a breakdown; it does not say what changed, which is exactly what monitoring's per-service, per-tag data provides.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.budgets-and-cost-alerts](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.budgets-and-cost-alerts)

### 9. A

*sysadmin.disaster-recovery.high-availability-vs-disaster-recovery · System Administration Fundamentals :: Disaster Recovery · depth 3 · discrimination*

High availability avoids downtime from component failure within a site. Disaster recovery restores service after a site or system is lost. They solve different problems and are not substitutes — a perfectly available cluster in a flooded building is unavailable.

- **A.** Correct. Availability within a site does not address losing the site itself.
- **B.** That is precisely what the arrangement does provide.
- **C.** Shifting work off a failed member is part of how the cluster stays available.
- **D.** That is the recovery plan, which is a document rather than something a cluster provides.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery)

### 10. B

*linux.command-line.case-sensitivity · Linux Fundamentals :: Command Line · depth 2 · recall*

Case sensitivity is a property of the filesystem, not of Linux itself. ext4 compares names byte for byte, so a repository built on a case-insensitive, case-preserving filesystem like macOS's default can expand on Linux into two files where the author saw one.

- **A.** Linux performs no case folding of its own on the filesystems it is normally installed on; the shell, `ls` and glob patterns all match exactly.
- **B.** Correct. ext4, like the filesystems Linux normally runs on, compares filenames exactly; two names differing only in case are two distinct files there, even though macOS folded them into one.
- **C.** There is no such rejection; ext4 simply stores both names as distinct entries, which is precisely the behaviour that surprises someone used to a case-insensitive filesystem.
- **D.** That overwrite behaviour is what a case-insensitive filesystem does; ext4 is case-sensitive and keeps both names as separate files instead.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.case-sensitivity](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.case-sensitivity)

### 11. D

*security.security.brute-force-and-credential-stuffing · Security Fundamentals :: Security · depth 3 · discrimination*

The separating axis is who supplies the credential: an attacker guesses or replays it themselves in brute force and credential stuffing, with the victim unaware throughout, while phishing requires the victim to actively hand the credential over. That difference is why one is fought with rate limits and breached-password checks and the other with training.

- **A.** Neither attack is defined by which layer of a system it targets; both can be aimed at any login surface regardless of what sits behind it.
- **B.** Both brute force and stuffing are automated at scale, and phishing campaigns are frequently automated too; automation level is not the table's separating property.
- **C.** Neither attack is defeated by patching software; the guide names MFA, rate limiting and breached-password checks for one side and user awareness for the other.
- **D.** Correct. The comparison's separating axis is exactly this: the user is unaware in a guessing or stuffing attack but has to actively participate in a phishing attack.

Study it: [04-security/security.md#c-security.security.brute-force-and-credential-stuffing](../study-guide/04-security/security.md#c-security.security.brute-force-and-credential-stuffing)

### 12. B

*sysadmin.networking.curl-and-wget · System Administration Fundamentals :: Networking · depth 3 · application*

`curl -I` issues a HEAD request, so only headers come back, confirming a service responds and returns a status code; `wget URL` saves the response to a file named after the URL's last path element, matching the two default behaviours to the two different tasks described.

- **A.** `-I` is a `curl` flag, not a `wget` one, and `curl URL` by default writes the response to standard output, flooding the terminal, rather than saving a file the way `wget` does.
- **B.** Correct. `curl -I` issues a HEAD request so only headers come back, confirming a service responds without transferring the body, while `wget` is a downloader that saves to a file by default, matching each task to the tool built for it.
- **C.** `curl -v` prints the whole exchange for diagnostic purposes; it does not save a file to disk by default, and is not the tool built specifically for a headers-only check or for downloading.
- **D.** Both `curl` and `wget` are specifically designed as command-line HTTP clients capable of exactly these tasks without any browser involved at all.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.curl-and-wget](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.curl-and-wget)

### 13. A

*devops.containers.container · DevOps Fundamentals :: Containers · depth 3 · discrimination*

The image/container/pod comparison separates template, running instance, and Kubernetes wrapper. Confusing any two of them is the exam's most common trap in this section, because each concept genuinely resembles its neighbours until the cardinality and mutability are pinned down.

- **A.** Correct. Each term names a different layer: template, instance, and the Kubernetes wrapper around instances.
- **B.** This swaps the template and the instance; the image is immutable and the container is what runs from it, not the reverse.
- **C.** A pod is a distinct Kubernetes object that can wrap several containers together; it is not a synonym for container.
- **D.** Restarting a container never touches the image; the image is untouched by anything that happens to the containers created from it.

Study it: [05-devops/containers.md#c-devops.containers.container](../study-guide/05-devops/containers.md#c-devops.containers.container)

### 14. C

*cloud.budgeting.resource-tagging · Cloud Computing Fundamentals :: Budgeting · depth 2 · application*

Consistency is the entire game for tagging: env, Env and Environment are three unrelated keys that split one team's spend three ways, so a written standard enforced at creation time is far more reliable than a retrospective cleanup sweep.

- **A.** A retrospective sweep treats the symptom repeatedly rather than preventing new inconsistent keys from being created going forward.
- **B.** Three budgets working around the split is a workaround at the reporting layer, not a fix, and leaves the underlying attribution problem in place.
- **C.** Correct. Consistency is the entire game: a written standard plus enforcement at creation time is far more reliable than fixing an existing split after the fact.
- **D.** Case and spelling variants are unrelated keys as far as the billing system is concerned; nothing merges them automatically, which is exactly why the split happened.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.resource-tagging](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.resource-tagging)

### 15. C

*linux.command-line.command-exit-status · Linux Fundamentals :: Command Line · depth 3 · recall*

A command killed by signal N returns 128 plus N, so a process killed by SIGKILL (9) reports 137, and one killed by SIGTERM (15) reports 143. A command not found returns 127, and one found but not executable returns 126.

- **A.** The raw signal number is not used directly as the exit status; the shell reports 128 plus the signal number instead, giving 137 for SIGKILL.
- **B.** 126 specifically means the command was found but could not be executed; a signal death is a distinct case reported as 128 plus the signal number.
- **C.** Correct. The convention is 128+N for a command killed by signal N, so SIGKILL (9) produces 137 and SIGTERM (15) produces 143.
- **D.** Status 1 is a generic tool-defined failure value; a signal death has its own specific convention of 128 plus the signal number, not the generic 1.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.command-exit-status](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.command-exit-status)

### 16. C

*pm.open-source-software-and-licensing.copyleft-licenses · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · application*

Copyleft's reciprocal obligation is a condition on an act of distribution, not something that spreads by contact. Modifying a covered program for internal use and never handing it to anyone obliges nothing at all.

- **A.** Copyleft's obligations are heavier than notice retention and, unlike a permissive licence, they trigger on distribution, not on the mere existence of a build.
- **B.** This is the "viral by contact" misreading the licence's own text rules out; obligations attach to conveying, not to modifying.
- **C.** Correct. GPLv3 states plainly that you may make, run and propagate covered works you do not convey without conditions.
- **D.** That network trigger belongs to the AGPL's section 13, not the plain GPL, and nothing here describes remote users interacting with the tool.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.copyleft-licenses](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.copyleft-licenses)

### 17. B

*sysadmin.networking.dig-and-nslookup · System Administration Fundamentals :: Networking · depth 4 · diagnostic*

Establishing whether the fault is naming at all, by reaching the destination by IP address, is the first diagnostic move: if that works and the name does not, it is DNS, and only then do `dig`'s status field and the other DNS-specific checks become the productive next step.

- **A.** TTL becomes relevant once a resolution problem is suspected and a change is being planned or traced; it is not the first thing to check when the actual fault category, naming versus connectivity, is still unknown.
- **B.** Correct. This separates a name-resolution failure from a connectivity failure in one step, which is the highest-value early move in a great many outage investigations, before spending time reading DNS response detail.
- **C.** Querying the authoritative server directly is a later step, useful for distinguishing a stale cache from a wrong record, not the first move when the fault category itself is still unknown.
- **D.** Comparing `getent hosts` with `dig` is useful once DNS itself is confirmed to be working correctly; testing raw IP reachability first is what actually separates naming from connectivity as the very first move.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dig-and-nslookup](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dig-and-nslookup)

### 18. A

*sysadmin.networking.firewall · System Administration Fundamentals :: Networking · depth 3 · discrimination*

A firewall that drops traffic and one that rejects it produce different symptoms: DROP gives the client a timeout, REJECT gives an immediate refusal — that difference is diagnostic and worth more than the rule text itself, and is the reason to look first at policy versus reachability differently for the two symptoms described.

- **A.** Correct. DROP gives the client a timeout while REJECT gives an immediate refusal, and that difference is diagnostic and worth more than the rule text itself when deciding where to look next.
- **B.** DROP and REJECT are deliberately different behaviours precisely so the client-side symptom differs: one is silent, producing a timeout, and the other answers, producing an instant refusal.
- **C.** A firewall configured to REJECT rather than DROP produces an immediate refusal too, so an instant refusal does not by itself prove no firewall is involved on the path.
- **D.** A silent timeout is also produced by a DROP firewall policy on a fully powered-on, reachable host; it does not by itself prove the destination is powered off.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.firewall](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.firewall)

### 19. D

*security.security.defense-in-depth · Security Fundamentals :: Security · depth 3 · discrimination*

Defense in depth requires layers to fail for different reasons. A password and a security question are both "something you know" and both fall to the same kind of disclosure, so duplicating the check does not add independence — it duplicates one layer rather than adding a second.

- **A.** Counting layers by number of checks rather than by independence of failure is the error the guide's comparison exists to correct.
- **B.** Least privilege is about how much authority an identity holds once admitted, not about how login credentials are structured.
- **C.** A security question is a knowledge factor, not a biometric, and the objection here is about shared failure mode rather than factor type.
- **D.** Correct. Two controls that share a failure mode are one layer, not two, and a password plus a security question are both defeated by the same kind of leak.

Study it: [04-security/security.md#c-security.security.defense-in-depth](../study-guide/04-security/security.md#c-security.security.defense-in-depth)

### 20. B

*cloud.budgeting.rightsizing · Cloud Computing Fundamentals :: Budgeting · depth 3 · discrimination*

Autoscaling changes how many units run, automatically and continuously, in response to live load. Rightsizing changes how big each unit is, as a deliberate periodic review, so a scenario describing traffic-driven capacity change is autoscaling regardless of the label a question uses.

- **A.** Rightsizing is a deliberate, periodic human decision about size; folding in automatic, continuous count changes is exactly the confusion this concept keeps separate for exam purposes.
- **B.** Correct. Capacity following live traffic minute by minute is the defining behaviour of autoscaling, whatever word a question attaches to it.
- **C.** Orphan cleanup removes resources that serve no purpose at all; it does not describe capacity that is actively tracking live traffic.
- **D.** A budget action, when configured, typically denies further provisioning past a limit; it does not track live traffic minute by minute the way the scenario describes.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.rightsizing](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.rightsizing)

### 21. B

*linux.command-line.file-management-commands · Linux Fundamentals :: Command Line · depth 3 · discrimination*

Plain `cp` follows a symbolic link and copies the target's contents, and so do `cp -L` and `cp -p`. Archive mode `cp -a` expands to `-dR --preserve=all`, and its `-d` (`--no-dereference`) component is what preserves the link itself; `cp -d`, `cp -P` and recursive `cp -r` preserve links for the same reason. The same family also covers `ls -la` for a full listing, `stat` and `file` for inspecting an entry, `mv` for relocation, `ln -s` for creating a link, and `rm -i` for a confirmed removal.

- **A.** `-L` is `--dereference`, documented as "always follow symbolic links in SOURCE", so it produces a full copy of the target's contents, which is the opposite of what is wanted.
- **B.** Correct. Plain `cp` follows a symbolic link and copies the target's contents; `cp -a` is archive mode, documented as `-dR --preserve=all`, and the `-d` part is `--no-dereference`, so the link itself is copied along with mode, ownership and timestamps.
- **C.** By that point the full target contents have already been copied; recreating a symlink afterward does not undo the unwanted full copy.
- **D.** `mv` relocates the symlink rather than copying it, which is a different operation entirely and does not answer "how do I copy a symlink as a symlink."

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-management-commands](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-management-commands)

### 22. C

*devops.containers.volumes-and-bind-mounts · DevOps Fundamentals :: Containers · depth 3 · application*

A container's writable layer exists only for the lifetime of that specific container. Without a volume or bind mount, data written inside it is destroyed the moment the container is removed, which is the single most common beginner error this concept guards against. Managed storage created ahead of time is inspected with `docker volume`.

- **A.** Docker keeps no such backup; a writable layer is deleted along with the container that owned it, with nothing retained.
- **B.** A new container starts from the image's layers only; it has no knowledge of, or access to, a previous container's writable layer.
- **C.** Correct. Anything written outside a mounted path lives only in the container's own writable layer, which does not survive removal.
- **D.** The scenario explicitly removes the old container, and even a stopped-but-not-removed container's data cannot transfer to a separate new container without an explicit mount.

Study it: [05-devops/containers.md#c-devops.containers.volumes-and-bind-mounts](../study-guide/05-devops/containers.md#c-devops.containers.volumes-and-bind-mounts)

### 23. D

*sysadmin.networking.loopback-address · System Administration Fundamentals :: Networking · depth 3 · application*

`ping 127.0.0.1` exercises the local TCP/IP stack and nothing else, because the kernel delivers loopback traffic internally without touching any driver; if the service answers on loopback but not remotely, the fault is a binding, firewall or routing issue between the two hosts, not the service itself.

- **A.** Loopback traffic is delivered internally by the kernel and never touches the NIC, cable or driver, so a successful loopback ping proves nothing about any of them.
- **B.** A loopback ping tests only the IP stack, not any particular service; whether a service is bound to accept remote connections is a separate question entirely.
- **C.** Loopback traffic never leaves the host at all, so it says nothing about whether a gateway is configured or reachable on the network.
- **D.** Correct. The kernel handles loopback entirely internally, without touching any NIC driver, so a successful loopback ping only exercises the local stack, not the network path.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.loopback-address](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.loopback-address)

### 24. D

*cloud.cloud-computing.hypervisor · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

A type 1 hypervisor is itself the lowest software layer, scheduling VM resources straight to the hardware; a type 2 hypervisor runs as an application on a conventional host OS, which schedules against the hardware in turn. That extra layer in type 2 costs performance and adds a second piece of software that can fail, which is exactly why production cloud and enterprise infrastructure standardises on type 1.

- **A.** Age is not the distinction; both types are in active, current use and both are actively maintained, chosen for different situations rather than one superseding the other.
- **B.** Both types virtualize hardware and present guests with virtual CPU, memory, disk and network devices; the difference is what sits underneath the hypervisor, and neither type is a process-isolation mechanism.
- **C.** Either type of hypervisor can host VMs that in turn run containers; container support has no bearing on the type 1 versus type 2 choice.
- **D.** Correct. This is the practical consequence the guide draws from the split: removing the host OS layer removes both its overhead and its failure mode.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hypervisor](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hypervisor)

### 25. A

*pm.open-source-software-and-licensing.lgpl · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 1 · recall*

Weak copyleft narrows the reciprocal obligation to a defined boundary. The LGPL confines it to the library, letting the linking application ship under its own terms once relink conditions are met, while the library's own code stays copyleft.

- **A.** Correct. Weak copyleft narrows the reach to the library boundary, leaving the linking application free under its own terms.
- **B.** That whole-work reach is precisely what strong copyleft does and weak copyleft is designed to avoid for the linking application.
- **C.** The LGPL's relinking condition has nothing to do with network offering; that concern belongs to the AGPL's separate section 13 trigger.
- **D.** Modifications to the library itself stay under the LGPL; only the surrounding application gains freedom from the same-licence condition.

Study it: [06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-specific-licenses](../study-guide/06-it-project-management/open-source-software-and-licensing.md#s-open-source-software-and-licensing-specific-licenses)

### 26. B

*sysadmin.networking.router-vs-switch · System Administration Fundamentals :: Networking · depth 3 · discrimination*

A switch forwards frames within one network by MAC address, at layer 2, and is the right device when devices merely need to join an existing broadcast domain; a router forwards packets between networks by IP address, at layer 3, and is required whenever traffic must cross from one subnet to another.

- **A.** Extending a single broadcast domain to more ports is exactly a switch's job; a router does not extend a broadcast domain, it terminates one at its boundary.
- **B.** Correct. The device needed follows directly from whether traffic stays inside one broadcast domain (switch) or must cross between two separate ones (router).
- **C.** A plain switch keeps every port in the same broadcast domain; it cannot join two different subnets together, which requires a router to forward between them by IP.
- **D.** DHCP only hands out addressing configuration to clients; it has no role in extending a broadcast domain or forwarding traffic between two separate subnets.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.router-vs-switch](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.router-vs-switch)

### 27. D

*security.security.full-disk-encryption · Security Fundamentals :: Security · depth 2 · recall*

Each LUKS key slot holds the volume key wrapped by a passphrase-derived key, and the volume key itself lives in the header. Destroying or overwriting the header removes what any passphrase would unwrap, which is why header backups are treated as part of the practice, not an optional extra.

- **A.** The passphrase-derived key only unwraps the volume key held in the header; it cannot derive that key directly from the encrypted data once the header is gone.
- **B.** Additional key slots let more than one passphrase unlock the same volume; they do not change the fact that losing the header itself is what makes any passphrase useless.
- **C.** A separate backup might independently hold the data, but that does not change the state of this LUKS volume itself, which is what the question asks about.
- **D.** Correct. The passphrase only unwraps the volume key stored in the header; without that header, there is nothing left for the correct passphrase to unwrap.

Study it: [04-security/security.md#c-security.security.full-disk-encryption](../study-guide/04-security/security.md#c-security.security.full-disk-encryption)

### 28. C

*linux.command-line.getting-help · Linux Fundamentals :: Command Line · depth 3 · diagnostic*

`man -k` and `apropos` search the same prebuilt index of page descriptions rather than the page bodies, so an unbuilt or stale `mandb` index produces "nothing appropriate" even though the page itself opens with `man` directly.

- **A.** OpenSSH does ship man pages, and the scenario states `man ssh` already opens one successfully.
- **B.** `apropos` searches descriptions across all sections; it is not restricted to section 8.
- **C.** Correct. `apropos` and `man -k` search a prebuilt index of page descriptions, generated by `mandb`, and that index can be missing or stale even when the pages themselves are present.
- **D.** `apropos` takes the keyword as a plain operand; there is no glob expansion involved in the failure described.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.getting-help](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.getting-help)

### 29. A

*sysadmin.networking.ufw-firewalld-and-iptables · System Administration Fundamentals :: Networking · depth 3 · application*

Enabling ufw over an SSH session without allowing 22 first is a documented mistake that locks the administrator out immediately, which is why `ufw allow 22/tcp` (or the equivalent for whatever port is in use) has to be run before, not after, enabling the firewall — the general form of the fix is simply `ufw allow` naming the needed port.

- **A.** Correct. Enabling ufw over an SSH session without allowing port 22 first is a documented, common mistake that locks the administrator out of the very session being used to make the change.
- **B.** ufw does not automatically detect and allow the port a command was issued over; enabling it without an explicit rule for SSH is exactly what causes the lockout.
- **C.** ufw(8) documents a warning prompt when enabling under ssh, not a refusal, and ufw does not read the connection table at all; it flushes the chains and applies the default-deny policy, which is precisely what causes the lockout.
- **D.** ufw's default-deny policy governs new inbound connections and can affect the existing session's continuity as well; assuming only outbound traffic is affected is exactly the wrong assumption that causes lockouts.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ufw-firewalld-and-iptables](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ufw-firewalld-and-iptables)

### 30. D

*cloud.cloud-computing.private-cloud · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

NIST's private cloud definition turns on exclusivity of use by a single organisation, and it explicitly permits that infrastructure to be owned, managed and operated by a third party, on or off premises. An off-premises, third-party-operated platform dedicated to one client is exactly the case the definition anticipates — the common assumption that private cloud must be on-premises and self-run is the trap.

- **A.** Third-party operation is common to both models; what makes this public or private is who may use it, and here use is restricted to one organisation, which is private cloud.
- **B.** Ownership is irrelevant to whether this is a cloud; the self-service provisioning and metered chargeback described are exactly the essential characteristics that make it one.
- **C.** Hybrid requires two or more distinct cloud infrastructures bound together with portability between them; a single dedicated platform, however it is hosted, is not that.
- **D.** Correct. Exclusivity of use, not physical location or ownership, is the criterion NIST states, and this scenario satisfies it exactly.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.private-cloud](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.private-cloud)

### 31. C

*devops.devops-basics.infrastructure-as-code · DevOps Fundamentals :: DevOps Basics · depth 3 · discrimination*

Infrastructure as code and configuration management both keep declarations in version control and both re-apply to converge, but infrastructure as code brings resources into existence while configuration management acts on systems that already exist.

- **A.** The tools do overlap in practice, but the concept's line is which question the run answers, not which vendor happens to be involved.
- **B.** Trigger mechanism is incidental to both practices and is not the axis that separates provisioning from configuring.
- **C.** Correct. This is the boundary the exam draws: which question the tool run answers, provisioning existence versus configuring state.
- **D.** Configuration-management tools are typically declarative too; the real separating line is provisioning existence against configuring state.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.infrastructure-as-code](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.infrastructure-as-code)

### 32. A

*sysadmin.system-administration.daemon-reload · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

systemd caches parsed unit files, so editing one and then restarting the service still runs against the old cached definition. `systemctl daemon-reload` rescans the unit directories and rebuilds the dependency graph, and only after that does a restart pick up the change.

- **A.** Correct. A restart uses whatever definition the manager already has cached; only a reload makes it re-read the unit file from disk before the next activation.
- **B.** A plain restart does not re-parse the unit file — that is specifically what `daemon-reload` does, and skipping it is the whole reason the edit appears to have no effect.
- **C.** `reload` asks the running nginx process to re-read its own application configuration. systemctl(1) is explicit that it 'will reload the service-specific configuration, not the unit configuration file of systemd'; only `daemon-reload` does the latter.
- **D.** Re-enabling only recreates the boot-time symlink; it does not make the manager re-parse an edited unit file.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.daemon-reload](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.daemon-reload)

### 33. C

*linux.command-line.port-ranges · Linux Fundamentals :: Command Line · depth 3 · application*

Dropping `n` and reading the service name from `/etc/services` as proof of what is running is a standing trap: the name is a lookup of the conventional use of that number, not an inspection of the actual process bound to it.

- **A.** `n` governs numeric ports as well as addresses; dropping it specifically substitutes a looked-up service name for the raw port number.
- **B.** `n` and `p` are independent flags; dropping `n` changes how ports are displayed, not whether the owning-process column appears.
- **C.** Correct. ss(8) documents `-n, --numeric` as "Do not try to resolve service names", so dropping it lets ss look the port number up in the system's service list; services(5) describes that file as "a mapping between human-friendly textual names for internet services, and their underlying assigned port numbers" - a naming convention, not an inspection of what is actually bound there.
- **D.** Protocol selection is controlled by the separate `t` and `u` flags; `n` has nothing to do with which protocol's sockets are shown.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.port-ranges](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.port-ranges)

### 34. A

*security.security.public-key-authentication · Security Fundamentals :: Security · depth 3 · application*

SSH's publickey method has the client sign a session-specific challenge with its private key and send only the resulting signature. Because the signature is bound to that session, an attacker who records the exchange gains nothing replayable — unlike a password, which the server must receive and could log, leak, or have phished.

- **A.** Correct. RFC 4252 has the client sign a session-specific challenge with the private key and send only the signature, unlike a password which the server must receive directly.
- **B.** The private key never leaves the client under any circumstance; what crosses the wire is a signature, not the key in any form.
- **C.** SSH publickey authentication is not a time-based one-time code scheme; it signs session-specific data at the moment of connection.
- **D.** There is no password involved in publickey authentication at all; the mechanism authenticates by proving possession of the private key, not by hashing a secret.

Study it: [04-security/security.md#c-security.security.public-key-authentication](../study-guide/04-security/security.md#c-security.security.public-key-authentication)

### 35. C

*pm.project-management.acceptance-criteria · IT Project Management Fundamentals :: Project Management · depth 3 · discrimination*

Acceptance criteria are per-item conditions agreed before work starts; the Definition of Done is the team-wide quality bar every item must meet uniformly. An item can satisfy every one of its own criteria and still fail the Definition of Done, and the Guide's answer is that undone work is not part of the Increment — it returns to the Product Backlog.

- **A.** This inverts which commitment the Scrum Guide actually defines — it defines the Definition of Done, not acceptance criteria, as a Scrum element.
- **B.** The two differ in scope — one item's criteria versus every item's uniform bar — and treating them as synonyms is the exact confusion this comparison tests.
- **C.** Correct. The Scrum Guide's rule is that undone work returns to the Product Backlog; the Definition of Done, not the per-item criteria, is what the automated tests belong to.
- **D.** Undone work cannot even be presented at the Sprint Review; there is no retroactive application of the Definition of Done there.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.acceptance-criteria](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.acceptance-criteria)

### 36. B

*sysadmin.system-administration.filesystem-hierarchy-standard · System Administration Fundamentals :: System Administration · depth 3 · recall*

The Filesystem Hierarchy Standard is a naming convention — what `/etc`, `/var`, `/usr` and the rest are for — not an on-disk format. Filesystem type (ext4, XFS, Btrfs, and so on) is the entirely separate concept that determines journaling, block size and maximum file size.

- **A.** The FHS says nothing about journaling, block size, or maximum file size — those are properties of a filesystem type, a distinct concept that happens to share the word "filesystem" — and it defines no on-disk format at all, default or otherwise.
- **B.** Correct. The Filesystem Hierarchy Standard names directory purposes such as `/etc` and `/var`; journaling and on-disk layout belong to a completely separate concept, the filesystem type.
- **C.** The FHS applies identically regardless of which on-disk format is chosen underneath it; the two are independent concepts sharing a name.
- **D.** Most FHS-defined directories sit on whatever the administrator chose at `mkfs` time, not universally on `tmpfs`.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.filesystem-hierarchy-standard](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.filesystem-hierarchy-standard)

### 37. B

*cloud.networking.cloud-dns · Cloud Computing Fundamentals :: Networking · depth 2 · application*

A load balancer keeps one unchanged endpoint and stops routing to an unhealthy target, so no client has to learn anything new; DNS failover changes which endpoint clients are told to use and is bounded by the record's TTL.

- **A.** Detecting the failure is fast in both cases; what differs is what has to happen afterward — DNS failover still has to wait out the TTL across every caching resolver, which a load balancer's internal routing does not.
- **B.** Correct. This matches the documented discrimination between the two mechanisms' recovery speed.
- **C.** Layer 7 parsing latency is on the order of the request itself, not minutes; it does not come close to offsetting a multi-minute TTL-bound DNS failover.
- **D.** Remapping a reserved address is a valid third option for masking failure, but the question compares the two mechanisms given, and this answer avoids stating which of those two is faster.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cloud-dns](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cloud-dns)

### 38. D

*sysadmin.system-administration.home · System Administration Fundamentals :: System Administration · depth 2 · recall*

Root's home directory is `/root`, a separate optional directory kept outside `/home`. The FHS's stated rationale is that if root's home were not stored on the root partition, the system would need a fallback default in case that location could not be found — exactly the risk `/home` carries when mounted from a separate partition that fails to come up.

- **A.** The FHS gives the root account its own top-level directory, section 3.14 `/root`, and reserves no subdirectory of `/home` for UID 0.
- **B.** FHS 4.1 states that `/usr` is shareable, read-only data that "must not be written to", which rules out any account's home directory — a place its owner writes to — being located there.
- **C.** Root has its own dedicated home directory, `/root`, distinct from the filesystem root `/`.
- **D.** Correct. If root's home lived under `/home` and that partition failed to come up, there would need to be a fallback location, exactly the risk keeping it on the root partition avoids.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.home](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.home)

### 39. B

*devops.devops-basics.rollback · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

Rollback returns a system to the previous known-good version, but redeploying yesterday's code does not un-apply a schema migration or un-write rows the new version created, which is why an irreversible change removes the safety net rollback appears to provide.

- **A.** This assumes rollback is always sufficient, which is exactly the gap an irreversible migration or write can leave open.
- **B.** Correct. This is the distinction the concept turns on: reversing the code does nothing to reverse what the new version already wrote.
- **C.** Nothing in the scenario suggests the wrong artifact was retrieved; the described symptom is consistent with a correct redeploy that data alone defeats.
- **D.** Switching strategies would not fix a data problem; even a blue-green rollback cannot undo writes a shared database already received.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.rollback](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.rollback)

### 40. D

*linux.command-line.standard-streams · Linux Fundamentals :: Command Line · depth 3 · discrimination*

A program writes results to descriptor 1 and diagnostics to descriptor 2. Both default to the terminal, so they look like one stream until something is redirected — `command > file` moves only descriptor 1, leaving descriptor 2's error messages on screen.

- **A.** This ambiguity is the point of the design, not a bug: only the operator that explicitly names descriptor 2 moves error messages, and `>` alone does not.
- **B.** Nothing in the scenario involves a pipe or a background process; the error is simply travelling on the untouched descriptor 2, as it always does by default.
- **C.** Errors can be captured with an operator that names descriptor 2, such as `2>`; they are not immune to redirection, they are simply on a separate descriptor that `>` alone does not touch.
- **D.** Correct. Standard output and standard error are separate descriptors — 1 and 2 — and by default both point at the terminal; redirecting one leaves the other exactly where it was.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.standard-streams](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.standard-streams)

### 41. A

*cloud.networking.cloud-subnets · Cloud Computing Fundamentals :: Networking · depth 3 · discrimination*

AWS documents that each subnet must reside entirely within one Availability Zone; Azure and Google Cloud both diverge from that, in slightly different ways, and generalising AWS's rule across providers is the predictable error.

- **A.** Correct. This matches each provider's documented zone relationship for a subnet, which is exactly where the three diverge.
- **B.** This is the AWS-specific rule generalised past where it holds — Azure and Google Cloud do not confine a subnet to a single zone.
- **C.** The network's regional scope is a separate fact from the subnet's zone relationship, and conflating the two produces the wrong answer for AWS, where the subnet — not the network — is what is zone-confined.
- **D.** Route table association is a separate mechanism from zone-scoping; Azure's subnets span every zone despite also carrying a per-subnet route table.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.cloud-subnets](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.cloud-subnets)

### 42. B

*security.security.system-hardening · Security Fundamentals :: Security · depth 2 · recall*

Vendors ship for broad usability rather than for any particular organisation's threat model, so a default installation is necessarily more permissive than most deployments need. Hardening — removing unnecessary packages, closing ports, disabling unused accounts — is the deploying organisation's own task, not something a vendor patch resolves.

- **A.** This is not a defect to be patched; it reflects a deliberate usability trade-off the vendor made, which the deploying organisation is expected to tighten itself.
- **B.** Correct. The guide states plainly that a default installation is by definition more permissive than a deployed system needs, because vendors optimise for general usability.
- **C.** A permissive default is not a discrete catalogued defect; it is expected behaviour a deploying organisation tightens through hardening, not something a CVE would name.
- **D.** Mandatory access control confines what a process may do; it does not remove unnecessary services or accounts, which is a separate hardening task.

Study it: [04-security/security.md#c-security.security.system-hardening](../study-guide/04-security/security.md#c-security.security.system-hardening)

### 43. D

*sysadmin.system-administration.mounting · System Administration Fundamentals :: System Administration · depth 3 · application*

Mounting attaches a filesystem into the tree at a chosen mount point. Any files that already existed at that path are hidden for as long as the mount lasts — neither merged nor deleted — and reappear once the filesystem is unmounted, which is the usual explanation for space or files that seem to have disappeared. `findmnt` reads the kernel's own view of what is currently mounted, rather than `/etc/fstab`'s stated intent.

- **A.** Nothing is deleted — the original contents still exist on the underlying filesystem and reappear as soon as the mount is undone.
- **B.** Mounting does not merge directory contents; it entirely obscures the mount point's previous contents for the duration of the mount.
- **C.** `/dev/sdb1` is presumed already formatted here, and even if it were not, that would produce an error rather than leaving the pre-existing files visible.
- **D.** Correct. Mounting attaches the new filesystem at that path, which obscures whatever was already there rather than combining or removing it; the original contents reappear once unmounted.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.mounting](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.mounting)

### 44. C

*linux.linux-operating-system.cpu · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`nproc` reports processing units currently available to the calling process, which can be fewer than the physical total under cgroup or affinity constraints. `lscpu` describes the machine's overall topology instead.

- **A.** `lscpu` reports the machine’s CPU topology from sysfs and /proc/cpuinfo; its `CPU(s)` count does not account for a cgroup or affinity restriction on the calling process, which is what `nproc` reports.
- **B.** `free -h` reports memory and swap usage; it says nothing about how many processing units a process can use.
- **C.** Correct. The guide names `nproc` specifically as reporting what is available to the caller, not the unconstrained physical total.
- **D.** `--all` counts all installed processors regardless of restriction, while plain `nproc` reports what is currently available to the caller — exactly the distinction this task needs.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.cpu](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.cpu)

### 45. D

*pm.project-management.project · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

A project is temporary work with a defined end and a unique objective; its opposite is operations, the ongoing work of running what already exists. The migration ends and produces something new; the patching repeats indefinitely as part of keeping the fleet current, so it is operations regardless of its size.

- **A.** Size and difficulty are not the discriminator; a small effort with an end date is still a project, and a huge recurring effort is still operations.
- **B.** Priority describes how much attention something gets, not whether it is temporary with a unique objective.
- **C.** Spend and staffing describe scale, not the temporary-versus-ongoing distinction the definition turns on.
- **D.** Correct. Temporariness — a defined start, end and objective — is the definition; effort and technical difficulty are not part of it.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.project](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.project)

### 46. D

*sysadmin.system-administration.process-priority-and-nice · System Administration Fundamentals :: System Administration · depth 3 · application*

Raising a process's own nice value — making it less demanding — is always allowed. Lowering it back down requires root or `CAP_SYS_NICE`, unless the administrator has raised the process's `RLIMIT_NICE` resource limit, which by default allows no reduction at all.

- **A.** Movement is asymmetric: raising is unrestricted, but lowering — even back toward a value the user held before — needs privilege by default.
- **B.** Both commands are subject to the same privilege rule for lowering a nice value; the restriction is not specific to one command over the other.
- **C.** The restriction is about privilege level, not about parentage; a sufficiently privileged unrelated user or process can lower it too.
- **D.** Correct. Raising your own niceness is always permitted, but lowering it back down needs privilege that an ordinary user does not hold unless a resource limit has been explicitly relaxed.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.process-priority-and-nice](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.process-priority-and-nice)

### 47. C

*cloud.performance-availability.caching · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

Caching cuts latency and origin load at the cost of possibly serving a stale value until expiry, invalidation or eviction. Because a cached copy is not authoritative, the origin still has to be capable of handling the full load on a cold start or after invalidation.

- **A.** Staleness up to the full time-to-live is exactly what a cache can serve; describing it as never happening ignores the trade the technique makes by design.
- **B.** This reverses the actual trade: caching improves latency at the cost of possible staleness, not the other way round.
- **C.** Correct. The cost of caching is always the possibility of serving something stale, and the cache is non-authoritative — the origin must still be able to survive real load.
- **D.** A cache miss still serves the request by falling through to the origin; it does not make the page unreachable, only slower for that one request.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.caching](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.caching)

### 48. A

*devops.devops-basics.rolling-deployment · DevOps Fundamentals :: DevOps Basics · depth 3 · application*

During the roll, some traffic reaches the new version as a consequence of how many instances have been replaced, not as a sample chosen to be observed. Treating a rolling update as though it provided canary-style safety is the error this pair exists to catch.

- **A.** Correct. The rolling update advances based only on Pod health, not on any evaluation of how the new version is behaving under real traffic.
- **B.** Both versions do serve real traffic simultaneously for the duration of the roll; that is exactly the risk the strategy carries.
- **C.** Restoring a previous revision is a manual rollback action, not something the roll itself evaluates or triggers automatically.
- **D.** Two versions serving traffic simultaneously is not the same as anything measuring how the new one is performing; that is the trap this pair exists to catch.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.rolling-deployment](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.rolling-deployment)

### 49. B

*sysadmin.system-administration.sgid · System Administration Fundamentals :: System Administration · depth 3 · application*

Setgid on a directory, set with `chmod g+s` or the numeric `2770`, makes newly created entries inherit the directory's group rather than the creator's primary group. That alone still leaves new files with whatever the umask allows, so a `002` umask is needed too, or teammates still cannot write to each other's files.

- **A.** Set-user-ID has no defined meaning on a directory in Linux; only setgid and the sticky bit have directory semantics.
- **B.** Correct. Setgid makes new files inherit the directory's group, and a `002` umask leaves group write intact on those new files — together they give exactly the described behaviour.
- **C.** That is the setuid bit, which has no effect on a directory; the group-inheritance behaviour needed here comes from setgid.
- **D.** The sticky bit restricts who may delete an entry; it has no effect on which group new files inherit.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.sgid](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.sgid)

### 50. C

*security.sensitive-data.personally-identifiable-information · Security Fundamentals :: Sensitive Data · depth 3 · discrimination*

Article 4(1) defines an identifiable natural person as one who can be identified directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data or an online identifier. Recital 26 supplies the test that decides the case: account is taken of all the means reasonably likely to be used, by the controller or by another person, to identify the person. An IP address is therefore neither outside the Regulation because it names a device nor personal data unconditionally in every hand, and commercial sensitivity is an unrelated axis.

- **A.** Article 4(1) expressly covers indirect identification and names an online identifier, so a value attached to a device is not excluded from scope by its form alone.
- **B.** Recital 26 asks about the means reasonably likely to be used by the controller or by another person, so an unjoined log can already be personal data before any join occurs.
- **C.** Correct. Article 4(1) reaches identification 'directly or indirectly' and lists an online identifier among the references, while Recital 26 makes the test turn on the means reasonably likely to be used.
- **D.** Sensitive and personal are separate axes: Article 4(1) turns on whether information relates to an identified or identifiable natural person, not on commercial harm.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.personally-identifiable-information](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.personally-identifiable-information)

### 51. D

*linux.linux-operating-system.linux-distribution · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`/etc/os-release` is the standard, machine-readable file carrying a distribution's identity. `uname -r` answers a different question — kernel version — which the guide's own trap warns against confusing with distribution identity.

- **A.** `uname -r` reports only the kernel release; the kernel version does not by itself identify which distribution is installed.
- **B.** It can include an OS name field on some builds, but it does not report the distribution's specific identity the way `/etc/os-release` does.
- **C.** Block device listings say nothing about which distribution is installed; they describe storage, not software identity.
- **D.** Correct. This is the specific standard, machine-readable file the guide names for identifying a distribution.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.linux-distribution](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.linux-distribution)

### 52. C

*sysadmin.system-administration.systemd · System Administration Fundamentals :: System Administration · depth 3 · application*

systemd is the init system and service manager, running as PID 1 for the life of the machine. `systemctl` is the command-line client used to query and control it. Conflating the manager with the tool used to talk to it is a common but avoidable mix-up.

- **A.** Only systemd itself runs as PID 1; `systemctl` is a separate, short-lived command invoked each time it is run.
- **B.** The older SysV-era mechanism is runlevels and `init`, not `systemctl`, which is a systemd-specific control command; the `/sbin/init` symlink points at systemd itself, not at `systemctl`.
- **C.** Correct. They are not the same object: one is the long-running manager, the other is the tool an administrator types commands into to talk to it.
- **D.** systemd itself supervises services throughout the machine's life, not only at boot; `systemctl` is simply how it is instructed either way.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.systemd)

### 53. A

*cloud.performance-availability.redundancy · Cloud Computing Fundamentals :: Performance/Availability · depth 2 · application*

N+1 provisions one more unit than the load strictly requires, so the loss of any single unit — whether by failure or by planned maintenance — still leaves enough capacity to carry the full load on the survivors.

- **A.** Correct. N+1 means one more unit than load requires, so losing any single unit — planned or not — still leaves enough capacity.
- **B.** N+1 is agnostic to why a unit is unavailable; the spare capacity covers the loss of any one unit regardless of cause.
- **C.** Nothing in the scenario states the units are active-passive; N+1 sizing is commonly used with active-active capacity that needs no promotion.
- **D.** N+1 sizing already accounts for one unit's worth of spare capacity spread across the pool; no individual instance needs to be resized.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.redundancy](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.redundancy)

### 54. D

*pm.project-management.scrum-ceremonies · IT Project Management Fundamentals :: Project Management · depth 3 · application*

The Sprint Review and the Sprint Retrospective are the most reliably examined discrimination in this competency: the Review inspects the product and what to do next, and the Retrospective inspects individuals, interactions, processes and tools. A complaint about how the team works belongs in the Retrospective regardless of which event it happens to surface in.

- **A.** The Daily Scrum is fifteen minutes for the Developers to inspect progress toward the Sprint Goal, not a venue for raising process complaints.
- **B.** Sprint Planning addresses what will be built and how, not a review of what went wrong in the process last Sprint.
- **C.** Closure happens once, at the very end of a project; a recurring handover problem needs addressing every Sprint, not held until the project ends.
- **D.** Correct. The Review inspects the Increment and discusses what to do next; process complaints about how the team works belong to the Retrospective.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.scrum-ceremonies](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.scrum-ceremonies)

### 55. C

*sysadmin.system-administration.update-vs-upgrade · System Administration Fundamentals :: System Administration · depth 3 · application*

`apt update` downloads and rewrites the local repository index only; nothing on the system changes. `apt upgrade` then compares installed versions against that cache and installs newer ones — the word "update" is the trap, since it does not update any software.

- **A.** The name is exactly the trap here: `apt update` downloads index files only and changes nothing about installed software.
- **B.** They are two different operations with different effects. `apt upgrade` installs from the index exactly as it already stands and does not refresh it first, which is why `apt update` has to be run separately.
- **C.** Correct. The naming is misleading: despite its name, `update` changes only the local index; `upgrade` is the command that actually installs newer packages.
- **D.** `apt upgrade` already installs newer versions; `full-upgrade` is a variant that is additionally permitted to remove packages to complete the upgrade.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.update-vs-upgrade](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.update-vs-upgrade)

### 56. A

*devops.git-concepts.rebase · DevOps Fundamentals :: Git Concepts · depth 3 · application*

`git rebase` (here as `git rebase main`) lists the commits on the current branch that have no equivalent in `main`, checks out `main` with the equivalent of `git checkout --detach`, replays those commits one by one in a way the documentation likens to `git cherry-pick`, and then repoints the branch at the final replayed commit. The documentation's own diagram writes the results as `A'--B'--C'` rather than `A--B--C`. That rewriting property is the entire crux of why rebasing a branch other people have already pulled is discouraged: their repositories still hold the discarded originals.

- **A.** Correct. Rebase resets the branch to the new base and reapplies the saved commits one at a time; each replay produces a new commit object, not a relocated copy of the old one.
- **B.** That describes what a rebase looks like from the outside, but the mechanism is replacement: the original commits are discarded and new ones with new hashes are manufactured in their place.
- **C.** Preserving original hashes is what merge does; rebase is defined by the opposite property — replacing commits with replayed ones — which is the whole reason it produces linear history.
- **D.** The current documentation describes a rebase as checking out the upstream detached and then replaying the saved commits one by one, similar to `git cherry-pick`, so replacements are created rather than nothing.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.rebase](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.rebase)

### 57. C

*security.sensitive-data.secure-deletion · Security Fundamentals :: Sensitive Data · depth 2 · application*

SP 800-88 Rev. 2 defines Clear, Purge and Destroy as three distinct categories. Cryptographic erase is the Purge technique that destroys a self-encrypting drive's media encryption key, leaving only ciphertext — fast, but only as trustworthy as the drive's encryption implementation, and it leaves the media itself still usable, which is what separates it from Destroy.

- **A.** The drive remains physically usable for storage after cryptographic erase; Destroy specifically requires leaving the media unusable for storage, which this does not do.
- **B.** Clear defeats simple non-invasive recovery; cryptographic erase is specifically classified as Purge, rendering recovery infeasible against state-of-the-art laboratory techniques.
- **C.** Correct. Cryptographic erase is the Purge technique that destroys the media encryption key, and its assurance depends entirely on that implementation being sound.
- **D.** A retention schedule governs when disposal should happen, not how much the sanitisation technique itself can be trusted once disposal is under way.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.secure-deletion](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.secure-deletion)

### 58. A

*linux.linux-operating-system.lts-vs-rolling-release · Linux Fundamentals :: Linux Operating System · depth 2 · application*

LTS releases freeze a version and backport only security and bug fixes for a fixed window; rolling releases ship every update continuously with no freeze at all. For a production system where shifting behaviour is the bigger risk, LTS is the safer choice.

- **A.** Correct. Stability against currency is the exact trade-off: LTS changes least over its support life, which is what a production server needs most.
- **B.** Newest is not safest for a running service — rolling releases update continuously, which is exactly the shifting behaviour the requirement rules out.
- **C.** Release policy is a separate axis from family; Ubuntu, in the Debian family, still offers both an LTS and a non-LTS track.
- **D.** A rolling release has no freeze at all — updates flow continuously with no single version to point to — which is the opposite of what the requirement asks for.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.lts-vs-rolling-release](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.lts-vs-rolling-release)

### 59. B

*cloud.performance-availability.vertical-scaling · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · discrimination*

Vertical scaling raises capacity up to the ceiling of the largest instance type offered, and it stops there — it does not remove the single point of failure a lone server represents, so an availability goal is left unaddressed.

- **A.** Infrastructure redundancy underneath the instance does not make the instance itself redundant; the server is still a single point of failure at the application layer.
- **B.** Correct. Vertical scaling does nothing for availability; a bigger single machine remains a single machine, and the largest instance type is a hard limit.
- **C.** Vertical scaling by definition resizes one machine in place; it involves no distribution of the workload across nodes.
- **D.** Instance size is not what determines single-point-of-failure risk; a bigger machine is still exactly one machine that can go down.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.vertical-scaling](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.vertical-scaling)

### 60. B

*sysadmin.troubleshooting.disk-full · System Administration Fundamentals :: Troubleshooting · depth 4 · diagnostic*

A filesystem can run out of data blocks or out of inodes independently, and both produce the same "No space left on device" message. `df -h` reports blocks; `df -i` reports the separate inode pool, which is consumed one per file regardless of that file’s size.

- **A.** A unit's journal won't explain a block-versus-inode discrepancy that the filesystem itself already surfaced.
- **B.** Correct. Data blocks and inodes are exhausted independently, and the block figure alone cannot show which one has actually run out.
- **C.** Inode exhaustion is caused by many small files, not large ones, so deleting a few large files changes nothing about the actual constraint.
- **D.** A traversal permission problem produces "Permission denied," not "No space left on device"; the symptom already points at the filesystem, not the path.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.disk-full](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.disk-full)

