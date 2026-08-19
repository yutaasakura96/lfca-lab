<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# LFCA practice exam 12 — answers

### 1. D

*sysadmin.best-practices.patch-cadence · System Administration Fundamentals :: Best Practices · depth 3 · application*

Patch cadence names the scheduling decision inside patch management: how often updates go out and, within that, the order a rollout follows. Canary-first deployment is a cadence-level rollout decision, distinct from the broader practice, from pre-production testing in an isolated environment, and from the timing question a maintenance window answers.

- **A.** Naming the whole surrounding practice loses the specific decision the question asks about — the rollout order is one decision inside it.
- **B.** Canary systems are live production hosts receiving the real patch, not an isolated environment used before production is touched.
- **C.** A window governs when disruptive work may occur; it does not decide which hosts receive a phased rollout first.
- **D.** Correct. Even routine deployment is normally phased, and the order it follows is part of the cadence decision, not a separate practice.

Study it: [02-system-administration/best-practices.md#c-sysadmin.best-practices.patch-cadence](../study-guide/02-system-administration/best-practices.md#c-sysadmin.best-practices.patch-cadence)

### 2. A

*cloud.best-practices.design-for-failure · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

Design for failure is the assumption behind almost every other Architecture practice in this competency, and the exam separates it from the mechanisms and plans that follow from it: fault tolerance absorbs a defined failure invisibly, high availability accepts a short gap, and disaster recovery restores service after a loss the design did not absorb.

- **A.** Correct. It is a design assumption, distinct from the mechanisms and plans it motivates.
- **B.** That is a mechanism the assumption motivates, not the assumption itself.
- **C.** High availability accepts a brief gap; the stem describes an assumption held before any mechanism runs.
- **D.** Monitoring detects failure after the fact; the stem describes a stance taken before the system is built.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.design-for-failure](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.design-for-failure)

### 3. A

*linux.command-line.archiving-and-compression · Linux Fundamentals :: Command Line · depth 3 · discrimination*

Archiving with `tar` bundles files into one stream at a point in time; it is a tool a backup strategy can use, but retention, verification and a restore plan are what turn a one-off archive into an actual backup — the two are related but distinct. Compressing a single stream on its own, independent of tar, is the job of `gzip`; unpacking a zip container instead of a tar archive is `unzip`.

- **A.** Correct. Archiving with `tar` bundles files into one stream, but a backup strategy also needs retention, verification and a restore plan across multiple points in time — properties an ad hoc nightly `tar` alone does not guarantee.
- **B.** Treating an archive as automatically equivalent to a full backup strategy overlooks retention and restore planning, which is exactly the confusable pair this scenario is built around.
- **C.** The archive format is not the issue — `zip` also bundles and compresses without addressing retention or restore planning any more than `tar` does.
- **D.** A `tar` archive is fully restorable with `tar xzf`, and `tar` does not remove the files it archives - `--remove-files` is a separate opt-in option; the gap this scenario is about is retention and a documented recovery process, not restorability.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.archiving-and-compression](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.archiving-and-compression)

### 4. B

*security.compliance.compliance · Security Fundamentals :: Compliance · depth 3 · discrimination*

Compliance is a claim about an organisation, measured against an obligation written outside the team that runs the system. Security is a claim about the system itself, tested against whether an attacker can defeat it. A system can satisfy one while failing the other, and the exam relies on candidates conflating the two.

- **A.** This treats compliance as a claim about resisting attack, which is what the CIA triad measures, not what compliance measures.
- **B.** Correct. The two properties are measured against different yardsticks, so neither state implies the other.
- **C.** An audit examines evidence against the standard's own criteria and scope, not against every attack path the CIA triad might eventually face.
- **D.** An unqualified report speaks only to the stated scope and period; it says nothing about systems the audit never examined.

Study it: [04-security/compliance.md#c-security.compliance.compliance](../study-guide/04-security/compliance.md#c-security.compliance.compliance)

### 5. B

*devops.containers.control-plane · DevOps Fundamentals :: Containers · depth 2 · recall*

The four control plane components have cleanly separable jobs: the API server serves the API, etcd stores state, `kube-scheduler` chooses nodes for unscheduled pods, and `kube-controller-manager` reconciles state through its controllers.

- **A.** The API server is the front end for the Kubernetes control plane and exposes the Kubernetes API, but it does not select a node for a pod; that is the scheduler's job.
- **B.** Correct. Choosing a node for a pod with no assignment is precisely the scheduler's defined responsibility among the four control plane components.
- **C.** etcd is the consistent key-value store backing cluster data; it stores decisions made elsewhere but does not itself decide node placement.
- **D.** The controller manager runs reconciliation controllers for existing objects; assigning a node to a newly created, unscheduled pod is the scheduler's separate, dedicated job.

Study it: [05-devops/containers.md#c-devops.containers.control-plane](../study-guide/05-devops/containers.md#c-devops.containers.control-plane)

### 6. A

*pm.functional-analysis.verification-vs-validation · IT Project Management Fundamentals :: Functional Analysis · depth 2 · discrimination*

Verification asks whether the system was built right, against the agreed specification; validation asks whether the right thing was built, against the actual need. The two checks cannot substitute for each other, which is exactly what a fully-tested, unused system demonstrates.

- **A.** Correct. A system can pass verification completely and still fail, because conformance to a specification that captured the wrong need is conformance to the wrong thing.
- **B.** Coverage is not correctness; the matrix did its job by showing every requirement had a test, and that says nothing about whether the requirement was the right one.
- **C.** UAT checks the real need, not conformance to the specification — that is what makes it a validation activity, the opposite of the gap this scenario is illustrating.
- **D.** Passing every test in the plan is evidence of conformance to the specification alone; it is not by itself evidence that the project met the actual need.

Study it: [06-it-project-management/functional-analysis.md#c-pm.functional-analysis.verification-vs-validation](../study-guide/06-it-project-management/functional-analysis.md#c-pm.functional-analysis.verification-vs-validation)

### 7. B

*sysadmin.best-practices.service-ownership · System Administration Fundamentals :: Best Practices · depth 1 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

Per consensus practice, every service has a named owner accountable for its health, cost and lifecycle, so nothing is silently unmaintained. That is distinct from the on-call responder, who handles one incident, and from the asset record, which stores the name rather than the accountability.

- **A.** Being reachable during an incident is not the same as holding ongoing accountability for the service's health, cost and lifecycle.
- **B.** Correct. The owner is accountable across the service's whole life, which is a different role from the responder handling a single incident.
- **C.** The inventory stores the service's name and details; ownership is the accountability attached to it, not the record itself.
- **D.** Revoking credentials on departure is offboarding's job; service ownership is accountable for the service, not for that specific process.

Study it: [02-system-administration/best-practices.md#s-best-practices-operational-discipline](../study-guide/02-system-administration/best-practices.md#s-best-practices-operational-discipline)

### 8. D

*cloud.best-practices.secrets-management-in-cloud · Cloud Computing Fundamentals :: Best Practices · depth 2 · application*

The distinction the exam draws is against the two things a secret store is not: a key management service, which controls encryption keys rather than credential values, and an encrypted environment variable, which is still a static artifact rather than a runtime-retrieved value.

- **A.** A key management service protects encryption keys; it does not itself store or rotate a credential value like an API key.
- **B.** A role issues temporary credentials for the platform's own APIs; a third-party API key still has to exist as a value somewhere.
- **C.** An encrypted value baked into a manifest is still an artifact anyone with pipeline or registry access can extract, and changing it still requires a redeploy.
- **D.** Correct. AWS's own guidance routes database, application and third-party credentials, OAuth tokens and API keys to a secret store, and encryption keys to a separate key management service.

Study it: [03-cloud-computing/best-practices.md#c-cloud.best-practices.secrets-management-in-cloud](../study-guide/03-cloud-computing/best-practices.md#c-cloud.best-practices.secrets-management-in-cloud)

### 9. C

*sysadmin.disaster-recovery.3-2-1-rule · System Administration Fundamentals :: Disaster Recovery · depth 2 · recall*

Three copies, two media types, one off-site. It is a compact expression of what actually makes backups survive a disaster: more than one copy, not all vulnerable to the same failure mode, and not all in the same building.

- **A.** The rule says nothing about backup types or schedule; it constrains copies, media and location.
- **B.** Site tiers are a separate decision driven by recovery time, not by this rule.
- **C.** Correct. That is the rule as stated: copy count, media diversity, and one copy at a distance.
- **D.** Testing cadence is a distinct practice and is not what the numbers refer to.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.3-2-1-rule](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.3-2-1-rule)

### 10. D

*linux.command-line.creating-and-removing-files-and-directories · Linux Fundamentals :: Command Line · depth 3 · discrimination*

`rmdir` removes a directory only if it is empty, failing on any directory that still has contents. `rm -r` recurses and removes everything regardless.

- **A.** `rm -r` recurses into a directory and deletes everything inside it without stopping to check whether it was empty.
- **B.** Prompting per file still allows the deletion to proceed once confirmed; it does not refuse based on the directory being non-empty the way `rmdir` does.
- **C.** Moving the directory sidesteps the question rather than answering it, and does not on its own refuse to act on non-empty contents.
- **D.** Correct. `rmdir` deliberately refuses and reports an error on any directory that still has contents, which is a safety feature rather than a limitation.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.creating-and-removing-files-and-directories](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.creating-and-removing-files-and-directories)

### 11. A

*security.compliance.data-retention-obligations · Security Fundamentals :: Compliance · depth 3 · discrimination*

Disposal is verified, documented destruction of every copy of the data, not deletion of a single pointer in one system. Backups, archives, log aggregators and analytics copies hold the same data and are governed by the same retention schedule.

- **A.** Correct. NIST SP 800-88 frames disposal as verified and documented, and backups and other copies are the same data under the same schedule.
- **B.** 'We deleted the record' usually means one row in one database, while backups, archives and analytics copies remain the same data under the same schedule.
- **C.** A log entry evidences that one action took place; it does not establish that every remaining copy of the data was actually destroyed.
- **D.** Analytics copies of personal data are processing like any other; the actual gap here is that they were never disposed of, not that they fall outside scope.

Study it: [04-security/compliance.md#c-security.compliance.data-retention-obligations](../study-guide/04-security/compliance.md#c-security.compliance.data-retention-obligations)

### 12. A

*sysadmin.disaster-recovery.replication · System Administration Fundamentals :: Disaster Recovery · depth 3 · application*

Replication answers an availability question — can something else serve if this fails. It does not answer a recoverability question, because it holds only the current state and propagates every change to it.

- **A.** Correct. Keeping a current copy live elsewhere is exactly what replication is for.
- **B.** Reaching back to a past state needs a retained independent copy, not a current mirror.
- **C.** That is a testing obligation and is satisfied by exercising restores, not by copying data.
- **D.** That is addressed by retention policy and tiering, which replication does not provide.

Study it: [02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.replication](../study-guide/02-system-administration/disaster-recovery.md#c-sysadmin.disaster-recovery.replication)

### 13. A

*devops.containers.dockerfile · DevOps Fundamentals :: Containers · depth 3 · command*

The trailing argument to `docker build` names the build context sent to the builder; the Dockerfile inside it is `Dockerfile` by default and can be redirected with `-f` when another name, such as `Dockerfile.dev`, is intended. Naming the tag explicitly with `docker build -t` is what makes the resulting image referenceable afterward.

- **A.** Correct. The context, not the Dockerfile itself, is what a bare path argument names; `-f` is needed to point at a differently named file.
- **B.** A trailing path argument names the build context, not a specific Dockerfile; an alternate filename must be given explicitly with `-f`.
- **C.** The CLI keeps no memory of a previous build's context between invocations; `.` always resolves to the current working directory.
- **D.** Namespace and registry are determined entirely by the `-t` tag given to the build, not by the trailing context path.

Study it: [05-devops/containers.md#c-devops.containers.dockerfile](../study-guide/05-devops/containers.md#c-devops.containers.dockerfile)

### 14. D

*cloud.budgeting.cost-monitoring · Cloud Computing Fundamentals :: Budgeting · depth 3 · recall*

Granularity is the design decision that determines what monitoring can show: a monthly total hides a three-day spike that daily data would surface immediately, which is why providers expose cost and usage data at daily, sometimes hourly, resolution.

- **A.** Storage tier is a property tracked by the storage service itself, not something a coarser or finer cost-report granularity would reveal either way.
- **B.** Whether a transfer crossed a region is a routing fact tracked by the transfer service, not something the time granularity of a cost report changes.
- **C.** Summing away time resolution is exactly what hides a spike; a total and a time series contain different information, not the same information at different scales.
- **D.** Correct. Granularity is the design decision that determines what can be seen: a monthly total hides a short spike that daily, or sometimes hourly, data would surface immediately.

Study it: [03-cloud-computing/budgeting.md#c-cloud.budgeting.cost-monitoring](../study-guide/03-cloud-computing/budgeting.md#c-cloud.budgeting.cost-monitoring)

### 15. B

*linux.command-line.file-transfer · Linux Fundamentals :: Command Line · depth 3 · application*

`scp` spells the port option `-P`, unlike `ssh`'s lower-case `-p`; in `scp`, lower-case `-p` instead means "preserve timestamps and modes," so using it for the port is a trap that silently does something else.

- **A.** `scp` does not treat `-p` and `-P` as interchangeable; they are two different options with two different meanings.
- **B.** Correct. scp(1) documents `-p` as "Preserves modification times, access times, and file mode bits from the source file" and `-P port` for the port, noting the capital "because -p is already reserved for preserving the times and mode bits"; `-p` takes no argument, so `2222` becomes another source operand and the connection still uses port 22.
- **C.** `-p` is a valid `scp` option - just not the port one - so there is no syntax error; scp proceeds, and any complaint it makes is about the operand `2222` not existing, after option parsing rather than before it.
- **D.** `scp` has its own option set rather than validating against `ssh`'s - which is precisely why `-p` means different things to the two commands - and it does not ignore `-p`: it acts on it, preserving times and mode bits.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.file-transfer](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.file-transfer)

### 16. A

*pm.open-source-software-and-licensing.free-software-and-foss · IT Project Management Fundamentals :: Open Source Software and Licensing · depth 3 · discrimination*

FOSS exists precisely so a sentence can name both camps without taking a side: the FSF's ethical framing and the OSI's practical framing judge nearly the same licences against different documents, maintained by different bodies.

- **A.** Correct. That is the documented split in framing between the two bodies, even though they bless nearly the same set of licences.
- **B.** This swaps the two organisations' roles and their defining documents entirely.
- **C.** SPDX assigns identifiers but does not decide either list, and the two organisations' lists overlap heavily without matching exactly.
- **D.** They are two framings that land on almost the same licences, not opposing or mutually exclusive camps.

Study it: [06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.free-software-and-foss](../study-guide/06-it-project-management/open-source-software-and-licensing.md#c-pm.open-source-software-and-licensing.free-software-and-foss)

### 17. D

*sysadmin.networking.default-gateway · System Administration Fundamentals :: Networking · depth 3 · application*

A gateway address outside every configured subnet cannot be used at all — the host cannot ARP for it, since ARP never crosses a router and the gateway itself must be directly, locally reachable for the route to function.

- **A.** The kernel does not fabricate a route to make an unreachable gateway reachable; the gateway must genuinely be on-link for the route to function at all.
- **B.** There is no port-based exception to gateway reachability; the requirement that a gateway be on-link applies uniformly regardless of destination port.
- **C.** The next hop is validated at the moment the route is added, not at delivery time; `ip route add` rejects an off-link gateway outright unless `onlink` is given to force it.
- **D.** Correct. The kernel validates the next hop against the host's own interface prefixes when the route is added, and the `onlink` flag exists precisely to override that check.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.default-gateway](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.default-gateway)

### 18. D

*sysadmin.networking.dhcp · System Administration Fundamentals :: Networking · depth 3 · application*

Because the client has no address yet, the first DHCP messages are broadcasts, and since broadcasts do not cross routers, serving a subnet whose DHCP server sits elsewhere requires a relay agent on that subnet to forward the requests as unicast to the remote server.

- **A.** Routers do not selectively forward parts of a broadcast packet; broadcasts simply do not cross a router at all without a relay agent to convert them to unicast.
- **B.** A DHCP reservation binds one MAC to one fixed address; it has no bearing on whether a broadcast crosses a router, which is the relay agent's job entirely.
- **C.** A static route affects unicast forwarding of known destinations; it does not enable a broadcast, which by definition has no single destination, to cross a router at all.
- **D.** Correct. Since broadcasts do not cross routers, serving a subnet whose DHCP server sits elsewhere requires a relay agent on that subnet to forward the request onward to a configured server address and to hand the reply back to the client.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.dhcp](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.dhcp)

### 19. B

*security.compliance.hipaa · Security Fundamentals :: Compliance · depth 2 · recall*

HIPAA binds covered entities, health plans, clearinghouses, and providers transmitting health information electronically, plus their business associates. An app collecting the same kind of data outside that relationship is simply not in scope, regardless of sensitivity.

- **A.** The same reading is protected health information inside a hospital's system and outside HIPAA entirely in an unaffiliated consumer app; sensitivity alone does not trigger coverage.
- **B.** Correct. HIPAA's scope is defined by who holds the data, not by how sensitive it is.
- **C.** HIPAA's coverage test turns on the entity's role as a covered entity or business associate, not on a special-category classification imported from a different law.
- **D.** Retention period has no bearing on whether HIPAA applies in the first place; applicability turns on the entity's role, which the scenario has already ruled out.

Study it: [04-security/compliance.md#c-security.compliance.hipaa](../study-guide/04-security/compliance.md#c-security.compliance.hipaa)

### 20. C

*cloud.cloud-computing.cloud-computing · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · discrimination*

NIST SP 800-145 requires all five essential characteristics before an environment counts as cloud computing. Here, provisioning needs a two-day human approval (no on-demand self-service) and billing is a flat rate rather than metered usage (no measured service). Virtualization is the enabling technology beneath many clouds, but its presence alone — without the self-service, elastic, metered delivery model — does not make an environment a cloud.

- **A.** Pooling VMs on shared hosts is virtualization, the enabling technology; NIST requires all five characteristics, and self-service and metering both fail here.
- **B.** Ownership decides nothing here — a self-service, metered private cloud on owned hardware still qualifies; this environment fails on process, not ownership.
- **C.** Correct. Two of the five essential characteristics fail outright, and the definition requires all five, not the presence of virtual machines.
- **D.** Internal chargeback is not the same as usage-based metering, and neither substitutes for the self-service and elasticity NIST requires.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-computing](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-computing)

### 21. C

*linux.command-line.history-and-tab-completion · Linux Fundamentals :: Command Line · depth 3 · discrimination*

History expansion is an interactive-shell feature. `!!` is replaced by the previous command line at a live prompt, but a script containing the same characters runs in a non-interactive shell, where history expansion is off.

- **A.** A script has no access to the interactive shell's history at all; it simply does not perform history expansion, rather than substituting anything from a separate session.
- **B.** The scenario states `!!` behaves as expected at the interactive prompt, so it is not uniformly broken; bash documents `!` style history substitution and enables it by default for interactive shells.
- **C.** Correct. History expansion is an interactive-only feature; a script containing `!!` does not get the previous-command substitution the same text produces at a live prompt.
- **D.** Sourcing runs a script in the current shell but does not itself enable history expansion, which is governed by interactive-versus-non-interactive mode, not by how the script is invoked.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.history-and-tab-completion](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.history-and-tab-completion)

### 22. A

*devops.devops-basics.artifact-registry · DevOps Fundamentals :: DevOps Basics · depth 2 · application*

A registry stores built artifacts and images so a specific version can be retrieved and redeployed. If that artifact no longer exists anywhere, rollback quietly turns into a rebuild of an old commit, which may not reproduce the same result.

- **A.** Correct. Once the artifact is gone from the registry, returning to it means rebuilding and hoping the result matches, not retrieving what actually ran.
- **B.** The whole point of a registry is that rollback is normally a retrieval rather than a rebuild; this claims that never mattered.
- **C.** A source repository holds inputs, not the built artifact; the two are not interchangeable stand-ins for one another.
- **D.** A registry stores the built artifact itself, not merely metadata about it, which is exactly why losing it matters.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.artifact-registry](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.artifact-registry)

### 23. D

*sysadmin.networking.http-and-https · System Administration Fundamentals :: Networking · depth 3 · application*

`curl -I` issues a HEAD request and reports the status line the server returns; reading a 301 as a failure is a documented trap, since it is a redirect and, without `-L`, curl stops there by design rather than following it.

- **A.** A 3xx status is a normal, successful classification of response, a redirect, not evidence of unreachability; only certain other ranges, like 5xx, indicate a server-side problem.
- **B.** `wget` against the same URL would show the same redirect behaviour; the issue is not tool choice but correctly interpreting a 3xx status as a redirect rather than a failure.
- **C.** A HEAD request does not inherently produce a 301; the server's own redirect configuration is what causes this particular status, and many HEAD requests return 200 without issue.
- **D.** Correct. Reading a 301 as a failure is a documented trap: it is a redirect, and the server responded correctly — `curl -L` would follow it to see the final destination.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.http-and-https](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.http-and-https)

### 24. B

*cloud.cloud-computing.cloud-control-planes · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · recall*

AWS CloudTrail records actions taken by a user, role or service, explicitly including actions in the Management Console as well as the CLI, SDKs and APIs, with 90 days of Event history available automatically; Azure and Google Cloud provide equivalent always-on logging. Console work is therefore recorded — what it lacks is an artifact you can review before it runs, re-run identically, or diff against a prior state.

- **A.** This is the routine misstatement the guide corrects: console work is recorded by default; what it lacks is an artifact you can review before it runs, re-run identically, or diff against last week.
- **B.** Correct. AWS CloudTrail explicitly records console actions alongside the CLI, SDKs and APIs, and equivalent logging exists on the other two major providers — the real gap is reproducibility, not auditability.
- **C.** Baseline audit logging on the major providers is on without configuration — CloudTrail Event history is available as soon as an account is created, and Azure Monitor 'collects activity log entries by default with no required configuration' — and the console is a client of the same API, not a separate path.
- **D.** All four interfaces are clients of the same API and are logged the same way; infrastructure as code's advantage is a declarative artifact to review, not exclusive access to audit logging.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-control-planes](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.cloud-control-planes)

### 25. D

*pm.project-management.change-control · IT Project Management Fundamentals :: Project Management · depth 3 · application*

Approval is only part of a controlled change; on approval, the scope, schedule and cost baselines are meant to be updated together and the decision communicated. Skip the baseline update and an approved, assessed change produces exactly the same symptom as creep — a plan that still shows the original scope while the team quietly absorbs more.

- **A.** Approval alone doesn't complete the process; the Guide's account of change control requires the baseline to be updated as well, not just a decision recorded.
- **B.** The mismatch causes trouble immediately, in every status report and schedule check between now and closure, not only when acceptance is reviewed.
- **C.** Notifying the delivery team doesn't substitute for the plan itself reflecting the new scope; the baseline, not just awareness, is what's missing.
- **D.** Correct. Without a baseline update, the schedule and budget still show the old scope, so the extra work has no home in the plan and is absorbed the same way an uncontrolled addition would be.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.change-control](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.change-control)

### 26. B

*sysadmin.networking.nat · System Administration Fundamentals :: Networking · depth 3 · recall*

NAT is not a firewall: it blocks unsolicited inbound traffic only as a side effect of having no translation mapping, not as a policy decision, and it inspects nothing about the packet — a network can run NAT with no filtering rules configured at all.

- **A.** NAT inspects nothing about a packet's payload and applies no policy; it only rewrites addresses and ports and forwards based on whether a mapping exists.
- **B.** Correct. NAT performs address and port rewriting only; any security benefit is incidental to that mechanism, not the result of NAT applying or enforcing any policy of its own.
- **C.** NAT has no relationship to TLS or encryption at all; it operates purely on addresses and ports, leaving the payload, encrypted or not, untouched.
- **D.** NAT is a real, distinct translation mechanism in its own right, commonly co-located with a firewall on the same device but not identical to or dependent on it.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.nat](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.nat)

### 27. A

*security.security.intrusion-detection-and-prevention · Security Fundamentals :: Security · depth 3 · discrimination*

An IDPS examines live traffic and host activity continuously, answering whether an attack is happening right now; a vulnerability scanner examines configured state on a schedule or in a build pipeline, answering what could be exploited if someone tried. Neither substitutes for the other, since one is initiated by the attacker's activity and the other by you.

- **A.** Correct. The comparison names this exact axis: continuous observation of live activity versus a scheduled or pipeline-run check of configured state.
- **B.** Relative cost is not the property the comparison table tracks; it separates the two by what each examines and when it runs, not by price.
- **C.** The guide states directly that neither substitutes for the other; one watches live activity continuously and the other checks configured state on a schedule.
- **D.** IDPS deployment includes both network-based (NIDS/NIPS) and host-based (HIDS/HIPS) forms, so host deployment is not exclusive to the scanner.

Study it: [04-security/security.md#c-security.security.intrusion-detection-and-prevention](../study-guide/04-security/security.md#c-security.security.intrusion-detection-and-prevention)

### 28. B

*linux.command-line.quoting · Linux Fundamentals :: Command Line · depth 2 · application*

Single quotes suppress everything: no character inside them has any special meaning to the shell. That is also why a single quote can never appear inside single quotes — there is no escape mechanism available there.

- **A.** Variable expansion is exactly one of the mechanisms single quotes suppress; a dollar sign inside them stays a literal character rather than starting an expansion.
- **B.** Correct. Single quotes are absolute — a dollar sign, a backtick, a backslash and a wildcard are all ordinary literal characters inside them, with no expansion of any kind performed.
- **C.** A backslash loses its escaping role inside single quotes too; it becomes just another literal character, unlike inside double quotes where it retains a limited role.
- **D.** Pathname expansion is also suppressed inside single quotes; a wildcard there stays a literal character rather than triggering a glob match.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.quoting](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.quoting)

### 29. B

*sysadmin.networking.ping-and-icmp · System Administration Fundamentals :: Networking · depth 4 · application*

Reading the failure text before anything else pays off here: "Name or service not known" is DNS, not reachability, and the message states this plainly, which is exactly the distinction readers routinely skip past on their way to checking cabling and switches.

- **A.** The message specifically reports a naming failure, not a physical-layer one; checking cabling and switches first skips past the actual, plainly stated cause.
- **B.** Correct. Ping answers a name as well as an address, so a ping that fails with "Name or service not known" is a DNS failure, not a reachability failure, a distinction the output states plainly and readers routinely skip.
- **C.** The gateway matters for reaching off-subnet destinations by address, but this specific error message is about resolving a name, which points at DNS or `/etc/hosts`, not the gateway.
- **D.** ARP resolves an already-known IP address to a MAC address on the local segment; a name-resolution failure happens before any address exists to resolve into a MAC at all.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ping-and-icmp](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ping-and-icmp)

### 30. B

*cloud.cloud-computing.major-cloud-providers · Cloud Computing Fundamentals :: Cloud Computing · depth 2 · recall*

The three hyperscalers sell a close to one-to-one mapping of service categories under different brand names. Amazon S3, Azure Blob Storage and Cloud Storage are each the provider's object storage product — recognising the category behind an unfamiliar vendor name is the reasonable expectation the exam sets, not memorising pricing or console navigation.

- **A.** The block-storage equivalents are Amazon EBS, Azure managed disks and Google Persistent Disk — a different product line entirely.
- **B.** Correct. All three are the respective providers' object storage products, despite the different brand names.
- **C.** The managed database equivalents are Amazon RDS, Azure SQL Database and Cloud SQL, not these three products.
- **D.** The identity equivalents are AWS IAM, Microsoft Entra ID and Google Cloud IAM, which none of the three named products provide.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.major-cloud-providers](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.major-cloud-providers)

### 31. D

*devops.devops-basics.canary-release · DevOps Fundamentals :: DevOps Basics · depth 3 · discrimination*

Both split traffic between versions, but a canary is a health check expected to widen to 100 percent once the new build proves sound, while an A/B test is a preference experiment expected to end with the losing variant removed.

- **A.** Treating them as synonyms erases the different questions each is designed to answer and the different outcome each expects.
- **B.** That single, all-at-once switch describes blue-green; an A/B test can split traffic gradually or evenly, much like a canary can.
- **C.** A side-effect split from batch replacement describes a rolling deployment, not an A/B test, which is also deliberate.
- **D.** Correct. The two share a mechanism but ask different questions with different expected outcomes, which is the axis the comparison turns on.

Study it: [05-devops/devops-basics.md#c-devops.devops-basics.canary-release](../study-guide/05-devops/devops-basics.md#c-devops.devops-basics.canary-release)

### 32. C

*sysadmin.networking.ssh · System Administration Fundamentals :: Networking · depth 3 · application*

SSH refuses key authentication silently if permissions are too open: `~/.ssh` should be 700 and `authorized_keys` 600, and a world-writable home directory alone can cause a fall back to password prompts, which is a frequent and confusing source of 'permission denied' or unexpected password-prompt reports.

- **A.** This is possible in general, but the scenario specifically flags a world-writable home directory, which is the documented, more likely cause of a silent fall back to password prompts.
- **B.** A changed host key produces a loud, explicit warning about the change, not a silent fall back to password prompts; it is a separate class of event from the permission issue described.
- **C.** Correct. This is a documented, specific behaviour: SSH silently declines key authentication under loose permissions rather than producing an obvious error, leading many administrators to suspect the key itself instead.
- **D.** Whether `scp` uses the legacy SCP protocol or SFTP underneath affects file transfer only, not interactive login authentication, which is governed separately by key and permission checks.

Study it: [02-system-administration/networking.md#c-sysadmin.networking.ssh](../study-guide/02-system-administration/networking.md#c-sysadmin.networking.ssh)

### 33. C

*linux.command-line.root-directory-vs-root-vs-home · Linux Fundamentals :: Command Line · depth 3 · application*

`cd ~` expands to whatever `$HOME` holds for the account running the shell — typically `/root` for root and `/home/name` for an ordinary user — which is why the same typed command reaches two completely different places.

- **A.** The hostname plays no part in tilde expansion; the resolution depends entirely on the account's `$HOME`, not on which machine is running the shell.
- **B.** Permissions determine whether an unprivileged user can enter a directory, but they do not change what `~` expands to; priya's `~` never targets `/root` at all.
- **C.** Correct. `~` expands to `$HOME`; for root that is typically `/root`, and for priya it is typically `/home/priya`, so the same command resolves differently per account.
- **D.** That describes `cd -`, the previous-directory shortcut, not `~`, which is always tied to the account's home rather than recent history.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.root-directory-vs-root-vs-home](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.root-directory-vs-root-vs-home)

### 34. B

*security.security.man-in-the-middle · Security Fundamentals :: Security · depth 2 · recall*

An on-path attacker relays traffic between two parties who each believe they are talking directly to the other. Certificate validation is what defeats this, because the attacker cannot present a certificate for the real name that chains to a trusted anchor — which is exactly why clicking through the warning removes that defence.

- **A.** Certificate validation is what defeats a man-in-the-middle; skipping it or clicking through is one of the named ways the attack actually succeeds, not a detail encryption alone covers.
- **B.** Correct. Clicking through the warning is exactly the failure mode the guide names: it defeats the certificate validation that would otherwise have exposed the attacker's inability to present a trusted certificate for the real name.
- **C.** Resource exhaustion describes a denial-of-service attack; an on-path attacker here is relaying and reading traffic, not overwhelming capacity.
- **D.** A rootkit requires code execution on the victim device, which is a separate malware concern from intercepting and relaying network traffic.

Study it: [04-security/security.md#c-security.security.man-in-the-middle](../study-guide/04-security/security.md#c-security.security.man-in-the-middle)

### 35. A

*pm.project-management.raci · IT Project Management Fundamentals :: Project Management · depth 1 · recall*

*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*

A RACI matrix clarifies who is Responsible for doing the work, Accountable for its outcome, Consulted before it and Informed after it. The tested convention is that several people may be Responsible for one activity, but exactly one is Accountable — two Accountable owners defeats the purpose of naming a single answerable person.

- **A.** Correct. Multiple people can share doing the work, which is what Responsible captures; Accountable is conventionally singular, so it names the one person answerable for the outcome.
- **B.** Responsible can be shared, but Accountable is conventionally exactly one person per activity — that's the point tested here.
- **C.** Several people sharing Responsible for one activity is normal; nothing about that count is the defect in this matrix.
- **D.** A matrix can validly assign only Responsible and Accountable for a given activity; omitting Consulted or Informed isn't automatically a malformation.

Study it: [06-it-project-management/project-management.md#s-project-management-control](../study-guide/06-it-project-management/project-management.md#s-project-management-control)

### 36. C

*sysadmin.system-administration.apt-and-dpkg · System Administration Fundamentals :: System Administration · depth 3 · command*

`dpkg -L` lists the files a named installed package placed on the system, reading the local package database. It is easily confused with lowercase `dpkg -l`, which lists installed packages and their status rather than any one package's file list.

- **A.** Lowercase `-l` lists installed packages and their status flags; it does not list the files a specific package owns.
- **B.** `apt update` only refreshes the cached repository indexes; it reports nothing about files an installed package placed.
- **C.** Correct. It lists the files a named installed package placed on the system, reading the local database rather than the archive it came from.
- **D.** That looks up a user account by name in the passwd database; it has nothing to do with querying package contents.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.apt-and-dpkg](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.apt-and-dpkg)

### 37. A

*cloud.cloud-computing.managed-services · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

A managed service trades configuration control for a large reduction in operational work, but it does not remove all responsibility: the provider installs, patches, backs up and monitors the component, while schema design, indexes, queries, data and access grants stay with the customer. A missing index causing slow queries is exactly the kind of failure the provider will not fix, because it is a decision the customer made, not an operational fault of the component.

- **A.** Correct. The guide names exactly this failure mode: a managed database still fails from a missing index, and none of that is the provider's to fix.
- **B.** This is the misconception the guide corrects directly: managed does not mean no responsibility, and query and schema performance stay with whoever designed them.
- **C.** PaaS platforms manage the runtime executing a deployed application; a managed database has no deployed application code to optimise, and query efficiency is a schema and query design concern the customer owns.
- **D.** IaaS is not involved here; the scenario is squarely about a managed database, where operational maintenance is the provider's and data-model decisions like indexing remain the customer's.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.managed-services](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.managed-services)

### 38. B

*sysadmin.system-administration.dev · System Administration Fundamentals :: System Administration · depth 3 · discrimination*

`/dev/null` discards data written to it and returns end-of-file immediately when read, while `/dev/zero` returns an endless stream of zero bytes on read — a common trap for anyone assuming `/dev/null` is a general-purpose discard for every use.

- **A.** They agree on write behaviour (both discard input), but they behave very differently on read, which the "general-purpose discard" framing misses.
- **B.** Correct. The two pseudo-devices differ specifically in what a read from them produces: nothing at all versus an unbounded stream of zero bytes.
- **C.** Both are character devices; the distinguishing property here is read behaviour, not the block-versus-character classification.
- **D.** null(4) shows both nodes created identically and world-accessible — `mknod -m 666 /dev/null c 1 3` and `mknod -m 666 /dev/zero c 1 5` — so neither is restricted to root.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.dev](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.dev)

### 39. D

*devops.devops-basics.observability · DevOps Fundamentals :: DevOps Basics · depth 1 · discrimination*

Monitoring watches signals chosen in advance and answers questions already known to be worth asking. Observability is the property that lets an operator answer a question nobody anticipated, without shipping new instrumentation to find out.

- **A.** Collecting quantitative signals continuously is what monitoring is; observability is a further property about answering questions nobody anticipated.
- **B.** Alerting is the separate practice of interrupting a human on a breached threshold; it does not explain a gap in answering an unforeseen question.
- **C.** More dashboards still only answer questions someone already thought to ask, which is exactly the limit observability exists to lift.
- **D.** Correct. This is the exact distinction the exam draws between a practice built on foreseen signals and a property that supports unforeseen questions.

Study it: [05-devops/devops-basics.md#s-devops-basics-automation](../study-guide/05-devops/devops-basics.md#s-devops-basics-automation)

### 40. A

*linux.command-line.system-commands · Linux Fundamentals :: Command Line · depth 3 · discrimination*

Reading the "free" column as memory available to applications is a routine misreading; the kernel deliberately uses idle memory as reclaimable page cache, so "available" — which accounts for that reclaimable cache — is the meaningful figure.

- **A.** Correct. The kernel keeps idle memory in use as page cache to speed up future reads, so "free" reports very little even on a healthy system; "available" is the figure that accounts for what applications can actually still get.
- **B.** A low "free" value on its own does not indicate memory pressure, because reclaimable page cache is counted there; "available" is the meaningful figure for application headroom.
- **C.** "buff/cache" reports the reclaimable cache itself, not memory reserved for applications; it is part of what makes "available" larger than "free," not a separate application-reserved figure.
- **D.** `free` reads the same live `/proc/meminfo` fields `top` does - its "available" column is MemAvailable - so it is neither cached nor coarse, and it answers this question directly.

Study it: [01-linux-fundamentals/command-line.md#c-linux.command-line.system-commands](../study-guide/01-linux-fundamentals/command-line.md#c-linux.command-line.system-commands)

### 41. C

*cloud.cloud-computing.saas · Cloud Computing Fundamentals :: Cloud Computing · depth 3 · application*

SaaS is where the operational surface is smallest and the residual customer responsibility is most often forgotten. The provider runs and patches everything, but identity, access rights, data classification and sharing settings remain entirely the customer's — and a leaked report link is exactly that kind of failure, at any service model.

- **A.** This is the precise misconception the shared responsibility model exists to correct: the provider secures the application, but a misconfigured sharing link is the customer's failure regardless of service model.
- **B.** SaaS does expose limited user-specific configuration, including sharing controls, and misusing that surface is what caused the exposure here.
- **C.** Correct. SaaS shrinks the operational surface to almost nothing, but identity, access configuration and data sharing are exactly the residual responsibilities that survive at every service model.
- **D.** An SLA addresses the provider's own availability commitments and remedies; it says nothing about a customer's data-sharing mistake.

Study it: [03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.saas](../study-guide/03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.saas)

### 42. C

*security.security.privilege-escalation · Security Fundamentals :: Security · depth 2 · recall*

Privilege escalation turns access already obtained into more access than was granted; it is a post-access step, not a way in. An attacker who phished a credential still needed that credential to gain initial access — the writable service unit is what let them reach further from that foothold.

- **A.** Initial access already happened through the phished credential; the writable unit is what let the attacker reach beyond what that access already allowed.
- **B.** Moving from a low-privilege account to root is vertical escalation, moving up in privilege, not horizontal movement to a peer account at the same level.
- **C.** Correct. The guide is explicit that escalation is a post-access step, not a way in, and that ordering is exactly what the exam tests.
- **D.** Nothing here disrupts availability; the attacker instead gains more access than they started with, which is what escalation names.

Study it: [04-security/security.md#c-security.security.privilege-escalation](../study-guide/04-security/security.md#c-security.security.privilege-escalation)

### 43. C

*sysadmin.system-administration.group · System Administration Fundamentals :: System Administration · depth 3 · command*

`groupadd` and `groupdel` create and remove groups, and `usermod -aG` appends a supplementary group to an account without touching its existing memberships — the destructive alternative is `-G` alone, which replaces the whole list.

- **A.** Without `-a`, `-G` replaces the entire supplementary group list, which can silently drop every other group `alice` belonged to.
- **B.** Those commands create and remove user accounts rather than groups, so nothing about `deploy` or `contractors` as groups is actually built or removed.
- **C.** Correct. `-aG` appends the named group to the account's existing supplementary list rather than replacing it.
- **D.** Lowercase `-g` replaces the primary group entirely rather than adding a supplementary one, which is a different change than asked for.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.group](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.group)

### 44. A

*linux.linux-operating-system.distribution-families · Linux Fundamentals :: Linux Operating System · depth 3 · application*

CentOS Stream is not CentOS Linux — it is a rolling preview of upcoming RHEL, not the discontinued fixed-release CentOS Linux. Rocky Linux exists specifically as CentOS Linux's downstream, fixed-release replacement.

- **A.** Correct. The guide names this exact confusion as a trap: Stream previews what RHEL will become, it does not stand in for the old fixed-release product.
- **B.** Sharing a family's tooling does not make two products interchangeable; release stability and support model differ sharply between a rolling preview and a fixed release.
- **C.** CentOS Stream remains `.rpm`/`dnf`-based, staying within the Red Hat family; the package manager was never the issue with the claim.
- **D.** This restates the misconception rather than correcting it — Stream previews upcoming RHEL and is not the discontinued fixed-release CentOS Linux at all.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.distribution-families](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.distribution-families)

### 45. D

*pm.project-management.stakeholder · IT Project Management Fundamentals :: Project Management · depth 2 · recall*

Stakeholder status turns on impact-or-influence, not on being a user or a team member. A reviewer who can block release without ever touching the system is a stakeholder on the influence test alone, and missing that is a commonly cited source of late-surfacing requirements.

- **A.** That definition excludes exactly the peripheral reviewers, auditors and downstream teams the exam most often asks about.
- **B.** A communication plan is built for stakeholders already identified; being listed there is a consequence of being a stakeholder, not a precondition.
- **C.** A RACI entry assigns responsibility for a task; stakeholder status doesn't depend on holding one of its four roles.
- **D.** Correct. The test is impact-or-influence, not proximity or use — someone who can block release plainly satisfies it.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.stakeholder](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.stakeholder)

### 46. B

*sysadmin.system-administration.partition · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

A partition with no filesystem on it is invisible to `df` and cannot be mounted, so "the disk does not show up" in `df` while `lsblk` and `fdisk -l` confirm the partition exists often means simply that it was never formatted with `mkfs`.

- **A.** `fdisk -l` already confirms the partition table is intact and the partition exists; the missing piece is a filesystem, not a corrupted table.
- **B.** Correct. A partition is only a region of space; `df` reports on mounted filesystems, and an unformatted partition has neither a filesystem nor a mount to report.
- **C.** `df` writes nothing at all; it reports every mounted filesystem regardless of the read-only flag, so a read-only mount appears normally with its usage shown.
- **D.** Nothing in the scenario suggests two different disks; the simpler and standard explanation is an unformatted partition.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.partition](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.partition)

### 47. A

*cloud.networking.private-service-endpoints · Cloud Computing Fundamentals :: Networking · depth 2 · application*

AWS documents PrivateLink as connecting a VPC to services and resources as if they were in that VPC, with no internet gateway, NAT device, or public IP address needed — improving security posture and removing the internet egress a NAT path would otherwise bill.

- **A.** Correct. This matches AWS's documented description of what a private-endpoint mechanism eliminates.
- **B.** Peering joins two whole networks and carries the overlapping-address constraint that comes with that; a private endpoint instead exposes one specific service to the network without joining anything else, and without that constraint.
- **C.** Scaling the NAT gateway would still route traffic out to the service's public endpoint over the internet, incurring the same egress cost the requirement is trying to remove.
- **D.** Public addresses would let the resources be individually reachable from the internet, the opposite of what a private subnet is for, and would not remove the internet egress path the requirement asks to avoid.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.private-service-endpoints](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.private-service-endpoints)

### 48. C

*devops.git-concepts.commit · DevOps Fundamentals :: Git Concepts · depth 3 · command*

Each commit carries a link to its parent (two parents for an ordinary merge commit, more for an octopus merge of several branches at once, and none for the very first commit), and `git log` walks that chain backwards from HEAD. A commit sitting only on another, unmerged branch is not on that path and so does not appear, which is a statement about reachability, not about the commit being lost.

- **A.** `--all` does the opposite of limiting: it shows commits reachable from every ref in the repository, including the feature branch this question wants excluded.
- **B.** `git status` reports the working tree, staging area and current branch name, not a list of commits — that is `git log`'s job.
- **C.** Correct. `git log` lists commits reachable from HEAD by walking parent links; commits that exist only on an unmerged branch are simply not on that path.
- **D.** `git diff` reports line-level content differences between two endpoints, not a list of commit objects; it answers a different question than "what happened."

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.commit](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.commit)

### 49. B

*sysadmin.system-administration.raid-levels · System Administration Fundamentals :: System Administration · depth 3 · application*

RAID protects only against a drive failing — not against accidental deletion, corruption, or any other destructive write, all of which are mirrored or parity-protected just as faithfully as a legitimate write. That is why RAID levels are never a substitute for backups.

- **A.** The second drive is kept in lockstep with the first rather than independent of it, so the "protection" a backup provides against deletion is not what mirroring gives.
- **B.** Correct. RAID protects against a drive failing; it applies every write, including a deletion, to both members with equal fidelity, which is exactly why it is not a substitute for a backup.
- **C.** A mirror is continuously kept current with the primary, not captured at a point in time, so there is no earlier version retained anywhere in the array.
- **D.** RAID operates below the filesystem, mirroring whatever writes the operating system issues; it has no awareness of whether a given write is destructive.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.raid-levels](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.raid-levels)

### 50. C

*security.security.tls-and-https · Security Fundamentals :: Security · depth 3 · recall*

TLS protects the channel between client and server — encrypting it, protecting it from tampering, and authenticating the server via its certificate. It says nothing about the honesty of what that server chooses to send, so a valid padlock and malicious content are entirely compatible.

- **A.** A certificate attests to a key-to-name binding through the CA, not to any review or scan of the site's content.
- **B.** The padlock reflects that the current handshake authenticated the peer; it says nothing about future compromise of the endpoint delivering malware over that same valid channel.
- **C.** Correct. HTTPS protects the channel, not the endpoint; a compromised or malicious server can serve harmful content over a perfectly valid TLS connection.
- **D.** The padlock does not itself distinguish protocol version; a connection can be encrypted under an older TLS version and still show the same indicator.

Study it: [04-security/security.md#c-security.security.tls-and-https](../study-guide/04-security/security.md#c-security.security.tls-and-https)

### 51. A

*linux.linux-operating-system.open-source-licensing-of-linux · Linux Fundamentals :: Linux Operating System · depth 2 · application*

GPLv2 is copyleft: anyone may run, study, modify, and redistribute the code, but a redistributed derivative must also be licensed under GPLv2 with source made available to recipients. Commercial use is permitted; the obligation is about license and source, not about selling.

- **A.** Correct. Copyleft is the operative mechanism: anyone may modify and redistribute, but a derivative must stay under GPLv2 with source made available.
- **B.** GPLv2 is copyleft precisely because it does impose a source-availability obligation on redistribution, unlike a permissive license that would not.
- **C.** GPLv2 explicitly permits commercial redistribution; it does not forbid selling the software, it only requires the derivative to remain under GPLv2 with source available.
- **D.** GPLv2 requires making source available to recipients of the redistribution; it does not require contributing changes back to any upstream project.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.open-source-licensing-of-linux](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.open-source-licensing-of-linux)

### 52. C

*sysadmin.system-administration.sticky-bit · System Administration Fundamentals :: System Administration · depth 3 · diagnostic*

In the other triad's execute position, lowercase `t` means the sticky bit is set and execute is also present; uppercase `T` means the sticky bit is set but execute is not, which — on a directory — makes it untraversable to anyone outside the owner and group, usually unintentionally.

- **A.** Case does not indicate strength; it indicates whether the corresponding execute bit is also present, which changes traversal rather than the protection itself.
- **B.** Setgid would appear as `s` or `S` in the group triad, a different position from the sticky bit shown here in the other triad.
- **C.** Correct. A capital letter in that position always signals a bit set alongside a missing execute bit for that class, which here makes the directory unreachable to `other`.
- **D.** The distinction between the two cases is meaningful output, not an error, and changes what the mode string is telling you.

Study it: [02-system-administration/system-administration.md#c-sysadmin.system-administration.sticky-bit](../study-guide/02-system-administration/system-administration.md#c-sysadmin.system-administration.sticky-bit)

### 53. C

*cloud.networking.public-vs-private-subnet · Cloud Computing Fundamentals :: Networking · depth 3 · application*

AWS states the rule directly: association with a route table carrying a route to an internet gateway is what makes a subnet public, and no attribute on the subnet itself records that fact.

- **A.** A NAT gateway grants outbound-only reachability from a subnet that is already private; making a subnet public specifically means giving it two-way reachability via an internet gateway, not routing it through a NAT gateway.
- **B.** The local route handles intra-network traffic and is not touched to change reachability off the network; the default route to an internet gateway is what needs adding.
- **C.** Correct. AWS states the classification directly as a route-table property, with no separate flag on the subnet object.
- **D.** A public IP address does nothing without a route — instances in a subnet with no route to an internet gateway remain unreachable no matter what address they hold.

Study it: [03-cloud-computing/networking.md#c-cloud.networking.public-vs-private-subnet](../study-guide/03-cloud-computing/networking.md#c-cloud.networking.public-vs-private-subnet)

### 54. C

*pm.project-management.work-breakdown-structure · IT Project Management Fundamentals :: Project Management · depth 3 · discrimination*

A work breakdown structure decomposes the deliverable into work packages small enough to estimate and assign, organised by what is being produced — it has no time axis, no durations and no dependency arrows. Only afterwards, once those packages are sequenced into a schedule, do dates and dependencies appear, and it's the critical path within that schedule that answers which tasks can slip without moving the finish.

- **A.** The absence of dates is by design, not an omission — a work breakdown structure is a structure, not a timeline, and was never meant to carry them.
- **B.** It shows the decomposition of the deliverable, organised by what is produced, not an assignment of owners — an org chart is a different malformation of the same idea.
- **C.** Correct. The work breakdown structure decomposes the deliverable into work packages and holds no dates at all; the schedule, and within it the critical path, is what actually answers a slack question.
- **D.** Velocity is a Scrum forecasting figure calculated from completed work per Sprint; it doesn't identify which schedule items are on the critical path.

Study it: [06-it-project-management/project-management.md#c-pm.project-management.work-breakdown-structure](../study-guide/06-it-project-management/project-management.md#c-pm.project-management.work-breakdown-structure)

### 55. D

*sysadmin.troubleshooting.escalation · System Administration Fundamentals :: Troubleshooting · depth 3 · application*

Two distinct limits force escalation: competence and authority, and the second is the one technically capable people under-weight. Knowing how to perform a fix does not grant permission to perform it, and the handover exists precisely so the next person does not repeat eliminations already made.

- **A.** Authority boundaries exist independently of whether the action would work; performing it anyway is out of bounds regardless of technical confidence.
- **B.** Reproduction is already presumed established here; the blocker is authority to act, which another reproduction attempt does not resolve.
- **C.** The theory was never disconfirmed here — the fix it implies is simply outside your authority to apply, and repeating the earlier steps does not change who is allowed to act.
- **D.** Correct. The limit here is authority, not competence, and both are valid triggers for escalation; the handover carries everything eliminated so far.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.escalation](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.escalation)

### 56. D

*devops.git-concepts.repository · DevOps Fundamentals :: Git Concepts · depth 3 · application*

The `.git` directory is where every commit, branch ref and tag physically lives; the project files beside it are a checked-out view, not the history itself. Deleting or skipping `.git` leaves the files intact and destroys the repository, which is a different loss from losing files.

- **A.** The remote configuration is one small piece of what `.git` holds; the far larger loss is the entire commit history, which also lives there.
- **B.** `git clone` needs an existing source repository to copy from; the working files alone carry no history for it to reconstruct.
- **C.** `.gitignore` is an ordinary tracked file that lives in the working tree, not inside `.git`, so skipping `.git` does not affect it at all.
- **D.** Correct. The repository is strictly the `.git` directory; the working tree beside it is only a checked-out view of one point in that history.

Study it: [05-devops/git-concepts.md#c-devops.git-concepts.repository](../study-guide/05-devops/git-concepts.md#c-devops.git-concepts.repository)

### 57. C

*security.sensitive-data.data-breach-and-notification · Security Fundamentals :: Sensitive Data · depth 2 · application*

GDPR Article 33(1) requires notification without undue delay and, where feasible, not later than 72 hours after becoming aware of the breach. The clock starts at awareness, not at intrusion — a compromise that went unnoticed for months still starts its 72 hours the day it is discovered, and the deadline is a deadline to notify, not a deadline to have finished remediating.

- **A.** The clock is not backdated to the moment of compromise; awareness, not intrusion, is the trigger the article names.
- **B.** Retention windows govern how long data may be kept, not whether a breach discovered later must be reported; the two obligations are independent.
- **C.** Correct. Article 33(1) starts the clock at awareness, and a compromise unnoticed for months still starts its 72 hours the day it is discovered.
- **D.** Where the compromised data was stored has no bearing on when the clock starts; awareness of the breach is what triggers it, not which copy was affected.

Study it: [04-security/sensitive-data.md#c-security.sensitive-data.data-breach-and-notification](../study-guide/04-security/sensitive-data.md#c-security.sensitive-data.data-breach-and-notification)

### 58. D

*linux.linux-operating-system.path · Linux Fundamentals :: Linux Operating System · depth 3 · command*

`which` only searches PATH for external executables and has no visibility into shell builtins or aliases. `type` reports more generally what a name resolves to — builtin, alias, function, or file — which is why it succeeds where `which` reports nothing found.

- **A.** `-a` only lists every PATH match for an external command; it does not extend `which`'s visibility to builtins or aliases, which stay outside its scope entirely.
- **B.** If `mycmd` is a builtin or alias, it has no file on PATH at all to be found by reading the list; PATH inspection would not resolve this case.
- **C.** The command visibly ran, so it exists in some form; `which` finding nothing only means it is not an external file on PATH, which `type` can still identify.
- **D.** Correct. The guide names `type` specifically as seeing builtins and aliases that the external `which`, limited to searching PATH, cannot.

Study it: [01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.path](../study-guide/01-linux-fundamentals/linux-operating-system.md#c-linux.linux-operating-system.path)

### 59. B

*cloud.performance-availability.high-availability · Cloud Computing Fundamentals :: Performance/Availability · depth 3 · application*

High availability requires both redundancy and automatic failover. This design has only the first ingredient — duplicate components with no health check and no redirection — so it is not yet highly available, though adding failover would complete it.

- **A.** That describes redundancy, the ingredient supplying spare capacity, not the completed design that also needs automatic failover.
- **B.** Correct. High availability needs redundancy plus automatic failover; a spare with no mechanism to use it is not yet either.
- **C.** Statelessness is the precondition for scaling instances interchangeably; it does not supply the missing detection-and-redirect mechanism here.
- **D.** Zero interruption is the stricter fault-tolerance bar; high availability accepts a brief detection-and-switch window, which failover would supply here.

Study it: [03-cloud-computing/performance-availability.md#c-cloud.performance-availability.high-availability](../study-guide/03-cloud-computing/performance-availability.md#c-cloud.performance-availability.high-availability)

### 60. D

*sysadmin.troubleshooting.out-of-memory-and-the-oom-killer · System Administration Fundamentals :: Troubleshooting · depth 4 · application*

A memory cgroup limit is enforced independently of host-wide memory availability, so a container can be OOM-killed on a host with gigabytes free. The kernel’s own OOM report is what discriminates the two cases: a kill made against a cgroup’s limit names that memory cgroup, while a system-wide exhaustion does not.

- **A.** The OOM killer responds to an unsatisfiable memory allocation, not to disk state, and a full swap disk is a separate condition from a cgroup limit being hit.
- **B.** Host-level memory figures say nothing about a cgroup's own configured limit, which is exactly what a container can be killed against while the host has memory to spare.
- **C.** A permissions fault produces EACCES or EPERM on an operation, not a kernel-initiated SIGKILL for memory exhaustion.
- **D.** Correct. "Allowed memory" for a badness score depends on the context that triggered the kill, and a cgroup hitting its own limit is evaluated against that limit, not the host's free memory.

Study it: [02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.out-of-memory-and-the-oom-killer](../study-guide/02-system-administration/troubleshooting.md#c-sysadmin.troubleshooting.out-of-memory-and-the-oom-killer)

