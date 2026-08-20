<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Cloud Computing Fundamentals :: Best Practices

32 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A team now defines its environments in a version-controlled template applied identically to staging and production, replacing changes engineers used to make by hand in the console. Which problem does this fix, and which does it not fix by itself?

- **A.** It eliminates configuration drift completely and immediately, since the running instances are now replaced rather than edited going forward.
- **B.** It fixes unreproducible environments and unreviewed changes; it does not by itself stop console changes made outside the template, so drift is eliminated only once the template is reapplied continuously.
- **C.** It satisfies the security pillar of a well-architected review outright, since a template that has passed code review is assumed to guarantee least-privilege access on every resource it goes on to create.
- **D.** It removes the need for an audit log, since the template file itself is now the complete record of every action taken against the account.

**Answer: B.** Automation converts reproducibility, reviewability and auditability of the definition into one solved problem, which is exactly what the operational excellence pillar of a well-architected review asks for. It is a distinct axis from immutability: automating provisioning does not by itself eliminate drift, because a console change made outside the loop is still possible until the definition is reapplied continuously or the instance is replaced rather than edited.

- A is wrong: Replacing rather than editing is what immutable infrastructure adds; automating the template's application does not by itself guarantee that.
- C is wrong: A template can still request over-broad permissions; review catches that only if someone checks for it, which automation alone does not guarantee.
- D is wrong: The template records the intended state; who called which API and when is still a separate audit-log question.

### 2.

A configuration management tool logs into every long-lived server nightly and applies patches automatically, without a person present. Is that automation over manual configuration, immutable infrastructure, both, or neither?

- **A.** Automation over manual configuration only; it is fully automated, but each server still accumulates its own unique history of applied changes because none of them is ever replaced.
- **B.** Immutable infrastructure only — applying a fresh set of patches to the same running server each night counts as replacing the instance in every sense that matters, since the software on it is now current.
- **C.** Both, since any process that changes a server without a human present satisfies the definition of immutable infrastructure automatically.
- **D.** Neither, since a well-architected review would not classify unattended patch automation under either practice.

**Answer: A.** Configuration management that logs into long-lived servers and patches them in place is fully automated and fully mutable — every server is still a unique accumulation of applied changes, which is the exact trap this competency names between the two practices.

- B is wrong: Patching a running server in place is precisely what immutable infrastructure replaces with launching new instances from a new artifact.
- C is wrong: Immutability is about the instance's lifetime, not about who or what triggers the change; automated in-place patching is not immutable.
- D is wrong: The tool's own automated, template-driven application of changes is exactly what automation over manual configuration describes.

### 3.

After an incident, engineers argue that a change made directly in the cloud console is riskier than one applied through a version-controlled template — not because the console change leaves nothing to investigate, but for a narrower reason. What is that reason?

- **A.** Although CloudTrail, Activity Log or Cloud Audit Logs still record by default that the action happened, the console change leaves no reproducible artifact: no reviewable definition that can be diffed, approved and reapplied to recreate the environment.
- **B.** The console change leaves no record at all, since it is commonly assumed that none of the major cloud providers log console activity anywhere by default, which is why teams often skip reviewing it after an incident and move straight to blaming the deployment pipeline instead.
- **C.** The console change cannot be encrypted at rest, unlike a template stored in version control.
- **D.** The console change bypasses least-privilege enforcement entirely, since every console session is granted administrator rights by default regardless of the identity signing in or the policy attached to it.

**Answer: A.** The auditability argument for infrastructure as code is precise, not sweeping: a console action is recorded by the provider's audit service by default, so the claim that it 'leaves no record' is false. What it genuinely lacks is a reproducible artifact — a reviewable definition of the change that can be diffed, approved and reapplied — which is what a template provides and a console click does not.

- B is wrong: AWS CloudTrail, Azure Activity Log and Google Cloud Audit Logs all record console actions by default; the true gap is the missing reproducible artifact.
- C is wrong: Encryption at rest is unrelated to whether a change was made through a console or a template.
- D is wrong: Console access is governed by the same IAM policy as any other API call; it does not inherently carry administrator rights.

### 4.

An access key is moved out of application source code into an environment variable inside a private repository's deployment manifest. What has actually changed about the credential?

- **A.** The key is now safe, since a private repository is not accessible to anyone outside the team.
- **B.** The key is now rotated automatically on a fixed schedule, since environment variables are widely believed to be refreshed with a new value on every single deploy.
- **C.** The key now inherits the deploying user's IAM permissions instead of its own.
- **D.** Where the key is stored, not what it is; it remains a static, long-lived credential that can be copied once and used until somebody revokes it.

**Answer: D.** This is the half-fix trap: moving the key out of source code and into an environment variable, a private repository, or an untracked config file changes where the key is, not what it is — it is still a static, long-lived credential that can be copied once and used until somebody revokes it.

- A is wrong: A private repository still travels into CI logs, container layers, backups and screenshots; privacy of the repo does not make the key short-lived.
- B is wrong: Moving a value into an environment variable does not add rotation; the same static value simply gets read from a different place.
- C is wrong: An access key carries whatever permissions were attached to it when it was created; relocating it does not change that binding.

### 5.

What removes a long-lived provider access key from a workload entirely, rather than merely relocating it?

- **A.** Moving the key into a managed secret store with rotation enabled, which is treated as removing the provider credential from existence entirely rather than merely relocating it.
- **B.** Attaching an instance role or workload identity, so the platform issues temporary credentials automatically and nothing static is ever stored.
- **C.** Encrypting the key wherever it is stored, since encryption removes the risk regardless of how long the key lives.
- **D.** Narrowing the key's attached policy to only the actions the application actually calls.

**Answer: B.** AWS's own remedy is to stop issuing long-lived keys rather than guard them better: the platform issues short-lived credentials to the running workload through its attached role, refreshes them automatically, and scopes them to that role's permissions, so nothing static is ever stored.

- A is wrong: That still keeps a static provider credential in existence; AWS's own remedy for provider access is to stop issuing keys at all, in favour of roles.
- C is wrong: Encryption protects the key at rest but does not shorten its lifetime or eliminate it as a credential that can be copied and reused.
- D is wrong: Narrowing scope reduces the damage a leaked key can do, but the key itself still exists as a static, long-lived credential.

### 6.

A team assumes 'the provider backs it up' satisfies their backup obligation for a managed database service. What does that assumption misread?

- **A.** Nothing — managed services back up customer data automatically as part of the service, so no further action is needed.
- **B.** The shared responsibility model — the durability of the storage service is the provider's, but the retention policy and the restore capability are the customer's.
- **C.** The distinction between replication and backup, since the provider's built-in redundancy is a replica, not a backup.
- **D.** The provider's autoscaling policy, which is what actually determines how much data is retained.

**Answer: B.** 'The provider backs it up' misreads the shared responsibility model: the durability of the storage service is the provider's, but the retention policy and the restore are the customer's to build and test.

- A is wrong: Managed durability is not the same as a retained, restorable backup with a policy the customer controls.
- C is wrong: That distinction matters, but the assumption in the stem is specifically about who owns the backup obligation, not about replication versus backup.
- D is wrong: Autoscaling governs compute capacity in response to load; it has no bearing on data retention.

### 7.

A backup plan assigns resources by tag, sets a retention period, and moves older copies to cheaper storage on a lifecycle schedule. What is still missing before it can be called a working recovery capability?

- **A.** Nothing — a correctly configured backup plan with retention and lifecycle rules is definitionally complete.
- **B.** A consistent tag key, since resources tagged inconsistently will silently drop out of the plan.
- **C.** A restore that has actually been exercised — an untested restore path is an assumption, not a recovery capability, regardless of how the plan is configured.
- **D.** An audit log entry recording who created the backup plan, which is treated as sufficient proof on its own that the data the plan protects can actually be restored.

**Answer: C.** A backup plan sets frequency and retention against a recovery point and recovery time objective, with lifecycle rules moving older copies to cheaper storage, but the restore is then exercised deliberately, because an untested restore path is an assumption rather than a recovery capability.

- A is wrong: Configuration alone does not prove a copy can be restored; that has to be exercised deliberately.
- B is wrong: Tag consistency matters for which resources get backed up at all, but the stem already assumes resources are correctly assigned by tag.
- D is wrong: Knowing who created the plan does not establish whether the data it protects can actually be restored.

### 8.

A system is being reviewed and the architect states its guiding assumption as: every component will eventually fail, so failure must be a routine, absorbed event rather than an incident. Which practice does that assumption describe?

- **A.** Fault tolerance — the narrower, component-level property that absorbs one defined class of failure with no interruption a user would ever notice.
- **B.** High availability — the weaker property that accepts a short interruption while detection and failover run.
- **C.** Design for failure: the design stance that failure is expected and built for, not a fault-tolerance mechanism or a recovery plan.
- **D.** A monitoring discipline that watches for failures once they happen, rather than an assumption made at design time.

**Answer: C.** Design for failure is the assumption behind almost every other Architecture practice in this competency, and the exam separates it from the mechanisms and plans that follow from it: fault tolerance absorbs a defined failure invisibly, high availability accepts a short gap, and disaster recovery restores service after a loss the design did not absorb.

- A is wrong: That is a mechanism the assumption motivates, not the assumption itself.
- B is wrong: High availability accepts a brief gap; the stem describes an assumption held before any mechanism runs.
- D is wrong: Monitoring detects failure after the fact; the stem describes a stance taken before the system is built.

### 9.

Multi-zone deployment, health checks and automated instance replacement are described in this competency as consequences of one underlying assumption. Which assumption is it?

- **A.** That every component, whether an instance, disk, zone, dependency or network path, will fail, so its failure must be absorbed as routine rather than treated as an incident.
- **B.** That the reliability pillar of a well-architected review is fully satisfied the moment any redundant capacity exists anywhere in the account, regardless of how it is arranged.
- **C.** That high availability and disaster recovery are interchangeable safeguards covering the same failure scope.
- **D.** That automating configuration removes any need to plan for the loss of a component.

**Answer: A.** Design for failure is the reasoning behind almost every other Architecture answer in this competency: multi-zone deployment, health checks and instance replacement are all consequences of having made this one assumption first.

- B is wrong: A review assesses a design against pillars; it is not the assumption that produces the design.
- C is wrong: They cover different scopes and are not interchangeable; neither is the underlying assumption named here.
- D is wrong: Automation concerns how a change is applied, not whether component loss has been planned for.

### 10.

A resource is tagged `owner=alice` while every cost report, backup plan and automation rule in the account selects on the standard key `Owner`. What happens, and does anything raise an error?

- **A.** Nothing — tagging systems normalise key case automatically, so `owner` and `Owner` are treated as the same key.
- **B.** The resource silently falls outside every report, plan and rule keyed on `Owner`, because tag keys are distinct strings and no error is raised anywhere.
- **C.** The resource is billed to a default cost centre automatically until the tag is corrected.
- **D.** The resource loses its network isolation boundary, since tags also serve as isolation boundaries between workloads.

**Answer: B.** Tags are load-bearing rather than decorative: cost allocation reports, backup plan assignment, and automation targeting all select resources by tag, so `Owner`, `owner` and `OWNER` are three different keys, and a resource tagged with the wrong one silently drops out of every rule that selects on the standard one, with no error raised anywhere.

- A is wrong: Tag keys are matched as exact strings; there is no automatic case normalisation that would unify the two.
- C is wrong: There is no default cost centre fallback; a resource with the wrong tag key simply does not appear in a report keyed on the standard one.
- D is wrong: A tag can be used as a condition in an access policy, but it is not itself an isolation boundary; that role belongs to accounts, subscriptions or projects.

### 11.

Can a resource tag act as an isolation boundary between two teams' workloads in the same account?

- **A.** Yes — tagging resources by team is a recognised way to isolate them from each other.
- **B.** No — a tag can be used as a condition in an access policy, but the isolation boundary itself is an account, subscription or project.
- **C.** Yes, provided the tag is combined with a least-privilege policy that denies cross-team access by default.
- **D.** No, because only a virtual private cloud boundary, and nothing else, can separate two teams' workloads.

**Answer: B.** A tag can be used as a condition in an access policy, but it is not itself an isolation boundary — accounts, subscriptions or projects are, which is the boundary distinction this competency draws explicitly.

- A is wrong: Tags are used as access-policy conditions, not as an isolation mechanism, and are not a substitute for a separate account or project boundary.
- C is wrong: Even paired with a policy, the tag remains a condition the policy references, not an isolation boundary in its own right.
- D is wrong: Accounts, subscriptions and projects are the isolation boundaries named for this purpose; a VPC is a network construct within one of those, not the only option.

### 12.

Data in a storage bucket is encrypted at rest and protected by TLS in transit. Does either of those defend against an over-privileged but authorised identity reading the data?

- **A.** No. The service decrypts for any caller it has authorised, so neither protects against an over-privileged identity; that is a least-privilege problem, not an encryption problem.
- **B.** Yes — encryption at rest specifically blocks reads from any identity that was not present when the encryption key was created.
- **C.** Yes — TLS is widely understood to terminate the connection before an over-privileged but fully authenticated and authorised identity's own request can ever reach the underlying storage layer at all.
- **D.** No, but choosing a customer-managed key instead of a provider-managed key would have stopped the over-privileged read.

**Answer: A.** At rest and in transit defend against different attackers, and neither protects against an over-privileged identity that is entitled to call the API, because the service decrypts for authorised callers by design — 'the bucket is encrypted' is not an answer to 'the bucket was readable by someone who should not have had access'.

- B is wrong: Encryption at rest protects stored bytes from theft; it does not track or restrict which identities may call the API afterward.
- C is wrong: TLS protects data crossing the network; it does not evaluate whether the caller's identity should be allowed to make the request.
- D is wrong: The choice between key types is about who controls key policy, rotation and audit trail, not about the strength or scope of protection against an authorised caller.

### 13.

A stolen disk from a decommissioned volume, and a request sniffed off the network: which form of encryption defends against which?

- **A.** Encryption at rest defends both, since data encrypted on disk stays encrypted through its entire lifecycle, including transmission.
- **B.** A managed secret store defends the stolen disk, and a key management service defends the sniffed request.
- **C.** Encryption at rest defends the stolen disk; encryption in transit, by TLS, defends the sniffed request, and neither substitutes for the other.
- **D.** IAM policy defends the stolen disk, and multi-factor authentication defends the sniffed request.

**Answer: C.** Encryption at rest protects the stored bytes — a stolen disk, a snapshot copied to another account, a decommissioned volume — and TLS protects data on the wire, leaving the disk readable; the two threats and their defences do not overlap.

- A is wrong: At-rest encryption protects the stored bytes and does nothing whatsoever for data crossing a network; transmission needs TLS separately.
- B is wrong: Neither a secret store nor a key management service defends the network path; TLS is what protects data in transit.
- D is wrong: IAM and MFA govern who is authorised to call an API; neither protects bytes on a stolen disk or on the wire.

### 14.

A load balancer's health check is a shallow TCP check that reports a target healthy as soon as it accepts the socket. What can go wrong because of that shallowness?

- **A.** Nothing — accepting a TCP connection is sufficient proof that the application layer is also ready to serve requests.
- **B.** The load balancer stops routing to the target entirely, since a shallow check can never report healthy in the first place.
- **C.** An alert fires and pages a human before the target is added back into rotation.
- **D.** A target enters rotation before it can actually serve a request, because accepting a connection is not the same as the application layer being ready to handle one.

**Answer: D.** A second distinction the competency draws is between liveness and readiness — a shallow TCP check reports healthy for a process that has accepted the socket but cannot yet serve a request, so instances enter rotation before they are actually ready.

- A is wrong: A process can accept a socket long before it has finished initialising enough to answer a request correctly.
- B is wrong: A shallow check reports healthy easily, which is exactly the problem; it does not withhold traffic.
- C is wrong: A health check drives an automated routing decision inside a control loop; paging a human is what monitoring and alerting do instead.

### 15.

During a scale-in event, a target is terminated while requests are still in flight, and clients see a burst of 500-level errors. Which mechanism was missing?

- **A.** A health check, since only a failed health check should ever be allowed to cause a target's termination.
- **B.** Graceful shutdown — the target must stop receiving new requests and drain the ones already in flight during the deregistration delay window before it is terminated.
- **C.** Right-sizing, since an undersized target is what produces errors during a scale-in event.
- **D.** Immutable infrastructure, since only replacing instances from new images would have avoided losing in-flight requests.

**Answer: B.** If the target closes its connections before the deregistration delay elapses — the exact failure a process that exits immediately on the termination signal produces — clients receive 500-level errors, which is why graceful shutdown and the deregistration delay window exist as a pair with health checks.

- A is wrong: A scale-in termination is a capacity decision, not a health-check failure; the missing piece is draining in-flight work, not a check.
- C is wrong: Instance size is unrelated to whether in-flight requests are drained before termination; the errors come from an abrupt cutoff, not from capacity.
- D is wrong: Immutability governs how instances are built and replaced, not whether in-flight requests are drained during any given termination.

### 16.

An employee leaves the company. Their cloud IAM identity is deleted the same day, but their `sshd` login on a production instance still works two weeks later. What was missed?

- **A.** The employee's role should have carried a permissions boundary that would have survived the deletion and blocked the login.
- **B.** The IAM identity should have been federated through an identity provider rather than deleted directly.
- **C.** The Linux user account on the instance is governed separately from the IAM identity; deleting one does not remove the other.
- **D.** Nothing was missed — deleting the IAM identity removes every login the employee had, cloud control plane and guest operating system alike.

**Answer: C.** Cloud IAM is not the guest operating system's user database. An IAM identity governs API calls that create, modify or delete resources, while a Linux user account governs what happens inside the guest once it is running; removing an employee's IAM identity does not remove their `sshd` login on a server.

- A is wrong: A permissions boundary caps what an IAM identity can be granted; it has no effect on a separate operating-system account.
- B is wrong: Federation changes how the IAM identity authenticates; it does not touch a separate Linux account on an instance.
- D is wrong: An IAM identity and a guest OS account are two separate systems; removing one leaves the other exactly as it was.

### 17.

What does cloud IAM govern, and how should the account's root or global-administrator identity be treated day to day?

- **A.** It governs the guest operating system's user database rather than any cloud-side resource, and the root identity is treated as an ordinary account fit for daily administrative logins across the whole team.
- **B.** It governs only billing and cost visibility rather than resource access, so the root identity is considered safe to share broadly among the finance team for reporting purposes.
- **C.** It governs network routing decisions inside a virtual private cloud; the root identity is reserved for network engineers.
- **D.** It governs authentication and authorization for control-plane API calls against resources; the root or global-administrator identity is protected and used for essentially nothing routine.

**Answer: D.** Policies attach to identities or resources and are evaluated per API call, covering both authentication and authorization at the level of the cloud control plane; the account's root or global-administrator identity is deliberately protected and kept out of routine use.

- A is wrong: That describes an OS account, not the cloud control-plane identity system, and reverses the guidance to reserve root for routine use.
- B is wrong: IAM governs far more than billing, and the root identity is specifically the one that should not be shared.
- C is wrong: Routing configuration is a resource IAM policies can gate, not what IAM itself governs, and root is not reserved for a single team.

### 18.

A workload adopts an immutable deployment model, where every release launches fresh instances from a new image and terminates the old ones. It has been writing user file uploads to the instance's own local disk. What happens at the next deployment?

- **A.** Nothing changes, since automation over manual configuration already externalises application state as part of applying a template.
- **B.** The files migrate automatically to the replacement instances, because the platform transparently mirrors local disk contents between old and new instances for the duration of a blue/green rollout.
- **C.** Nothing changes, because 'immutable' means the data already on the instance cannot be modified once it is written.
- **D.** The uploaded files are lost, because replacement destroys everything stored locally on the instance and nothing external retained a copy.

**Answer: D.** Immutable describes the instance, not the data. Anything the workload must not lose has to be externalised into a managed database, object storage, or a volume with its own lifecycle, because replacement destroys everything local — a workload writing uploads to local disk breaks the moment immutability is adopted, and the failure looks like data loss rather than a design error.

- A is wrong: Automating how a definition is applied says nothing about where application data is stored; that is a separate design decision.
- B is wrong: Blue/green rollout shifts traffic between instance sets; it does not copy local disk contents, which is exactly what object storage exists to solve.
- C is wrong: Immutable describes the instance's lifecycle, not a guarantee about the data it happens to hold locally.

### 19.

Which practice in this competency eliminates configuration drift entirely, rather than merely reducing it?

- **A.** Automation over manual configuration — once a declarative definition is applied, the running environment always matches it exactly from then on.
- **B.** Well-architected review — its operational excellence pillar audits every resource for drift on a fixed schedule.
- **C.** Immutable infrastructure: nothing survives long enough on a running instance to drift, because replacement removes the possibility outright.
- **D.** Health checks and graceful shutdown — an unhealthy, drifted target is automatically deregistered before it can serve traffic.

**Answer: C.** It is the only practice in this competency that eliminates configuration drift rather than merely reducing it: if the maximum age of an instance is a deployment cycle, the accumulated history that produces drift cannot form in the first place, which is why replacing instances is safe to do routinely.

- A is wrong: Automation reduces drift but does not eliminate it, because a console change made outside the loop can still occur unless reapplied continuously.
- B is wrong: A review surfaces findings periodically; it does not itself act on the environment between reviews.
- D is wrong: Deregistration removes a target from rotation; it says nothing about whether the target's configuration matches its definition.

### 20.

A team running immutable infrastructure needs to undo a bad release. What does the rollback actually consist of?

- **A.** Reversing the specific package or configuration change on each running instance, the same way a rollback works on a mutable, long-lived server.
- **B.** Restoring the workload's externalised state from its most recent backup.
- **C.** Reapplying the previous version of the infrastructure-as-code definition and waiting for reconciliation, since that is how automation over manual configuration is described as reverting any change.
- **D.** Redeploying the previous versioned image or artifact and shifting traffic back to instances built from it, not reversing a patch on the currently running instances.

**Answer: D.** Because the running instance is never modified, rollback is redeploying the previous artifact and replacing instances again, using the same blue/green or canary pattern as any other release — not reversing a patch, which has no meaning once nothing is ever patched in place.

- A is wrong: Editing instances in place is exactly what immutable infrastructure replaces; a rollback here is a new deployment, not an in-place reversal.
- B is wrong: A backup restores data; the rollback described here is about which application version is running, which is a separate artifact.
- C is wrong: That reverts the definition of the environment's shape; it is not what rolls back which application artifact the instances are running.

### 21.

A service role attached to a web application was given administrator permissions during a debugging session two months ago and was never narrowed afterward. What is the standard path this arrangement creates?

- **A.** No real risk, since only a human with console access could exploit an unused administrator permission.
- **B.** A control-plane audit failure above all, since IAM alone is understood to be responsible for automatically detecting, flagging and narrowing any unused permissions on its own.
- **C.** A leaked long-lived access key, since debugging sessions are the most common source of hardcoded credentials.
- **D.** From one compromised web application to control of the whole account, since the role's excess permissions travel with whatever compromises the application.

**Answer: D.** The identity that gets over-granted in practice is usually not a person: a service role given administrator permissions during a debugging session and never narrowed is the standard path from one compromised web application to the whole account.

- A is wrong: A compromised application inherits its role's permissions automatically; no separate human console session is required.
- B is wrong: IAM enforces policy; narrowing an over-granted role is a deliberate action a team must take, not an automatic IAM behaviour.
- C is wrong: The scenario describes an over-granted role, not a hardcoded key; those are two different failure modes.

### 22.

A policy grants an identity read-only access to a secrets store, a database and an object storage bucket. Is that a safe default because it grants no write access?

- **A.** Yes — without write permissions the identity cannot cause any damage to the account.
- **B.** No; read access to those three is exactly what data exfiltration requires, and least privilege scopes both resources and actions, not write access alone.
- **C.** Yes, provided the secrets store and the bucket are both encrypted at rest.
- **D.** No, but only because a secrets store is considered something that should never be reachable by any read-only policy under any circumstance at all.

**Answer: B.** The exam's other favourite trap here is the assumption that read-only access is inherently safe: read permission on a secret store, a database, or an object storage bucket is exactly what data exfiltration requires, so least privilege has to scope resources and actions together.

- A is wrong: Reading sensitive data causes damage on its own; 'no writes' says nothing about exposure from reading.
- C is wrong: Encryption at rest protects against theft of the storage medium; it does nothing against a caller the service has already authorised to read.
- D is wrong: A secrets store can legitimately be read by identities that need it; the risk is granting read access more broadly than the task requires, not read access itself.

### 23.

"Who deleted the storage bucket at 02:14, and from what address" — which of these answers that: an audit log, an application log, or a metric?

- **A.** The metric, since a numeric time series would show the exact moment the deletion occurred.
- **B.** The audit log — it records which identity called which API against which resource, when and from where.
- **C.** The application log, since a deployed infrastructure-as-code template records every change made to the environment.
- **D.** Any of the three equally, since all three record what happened to a resource over time.

**Answer: B.** An audit log is not an application log and not a metric, and the three answer different questions: 'who deleted the storage bucket, and from what address' is an audit-log question, answered by recording which identity called which API, against which resource, when, from where, and with what result.

- A is wrong: A metric can show that something changed around that time, but not which identity made the call or from where.
- C is wrong: A template records the intended desired state, not a real-time record of who called which API and when.
- D is wrong: The three answer different questions — identity and API call, application behaviour, and numeric trend — and only one of them answers this one.

### 24.

CloudTrail's Event history has been the only audit configuration in place for over a year. An investigation now needs management events from 120 days ago. What does the team find?

- **A.** Nothing: Event history retains only the past 90 days of management events per region, and longer retention needs a configured trail or a CloudTrail Lake event data store.
- **B.** The full history going back to the account's creation, since CloudTrail is widely believed to retain management events indefinitely once it is enabled for an account.
- **C.** The events, restored from the account's backup plan alongside the resource data it protects.
- **D.** The events, still visible in the monitoring dashboard's default 120-day metric window.

**Answer: A.** Retention is the detail worth holding: Event history gives a searchable, immutable record of the past 90 days of management events in a region at no charge, but 90 days is the whole of it — longer retention requires creating a trail that delivers events to object storage, or an event data store in CloudTrail Lake.

- B is wrong: CloudTrail is enabled by default, but Event history's window is bounded to 90 days regardless of how long it has been running.
- C is wrong: A backup plan protects resource data, not the control-plane audit trail; the two are separate systems.
- D is wrong: A metrics dashboard shows numeric trends, not the identity-level audit record that this investigation needs.

### 25.

A workload is deployed across three availability zones in one AWS region. Which class of outage does that arrangement leave it fully exposed to?

- **A.** The loss of a nightly backup copy, since spreading instances across zones is itself a backup strategy for the data they hold.
- **B.** An outage at a different cloud vendor entirely, since spreading across zones is a form of running multi-cloud.
- **C.** The loss of the entire region, since multi-zone protects against a zone-level failure inside a region, not a regional one.
- **D.** Nothing — spreading a workload across zones already protects it against an outage of any scale.

**Answer: C.** Scope is the trap here. Multi-zone protects against a single datacentre location failing inside one region; the region itself, and the data-residency question of which region to use, are separate matters a multi-zone design does not settle.

- A is wrong: Multi-zone deployment is not the same as taking a backup; it protects live capacity, not a retained independent copy.
- B is wrong: Multi-zone is confined to one provider and one region; it is not a multi-cloud arrangement.
- D is wrong: Zone-level redundancy has a limit at the region boundary; it does not scale up to protect against every outage.

### 26.

How does AWS identify one availability zone, and how does Azure describe what an availability zone is?

- **A.** AWS codes it as the region code plus a letter, such as us-east-1a; Azure describes it as a separated group of datacenters with independent power, cooling and networking.
- **B.** AWS numbers zones sequentially across every region it operates rather than coding them by letter; Azure treats a zone as a single physical building rather than a group of datacenters with independent power and cooling.
- **C.** AWS defines a zone as an entire separate region under another name; Azure has no concept of zones at all.
- **D.** Both providers require an availability zone to sit in a different country from its region before the label applies.

**Answer: A.** The two providers' definitions are directly recallable and were fact-checked verbatim against their own documentation: AWS's zone code is the region code plus a letter, and Azure describes a zone as a separated group of datacenters with independent power, cooling and networking, typically within about 100 km of each other.

- B is wrong: AWS zone codes are region-scoped letters, not a global sequence, and Azure's zones are groups of datacenters, not single buildings.
- C is wrong: A zone is a subdivision within one region, not a region itself, and Azure does publish an availability zone concept.
- D is wrong: Zones sit inside one region and are typically within about 100 km of each other, not in a different country.

### 27.

A workload idles at 5% CPU on an oversized instance type. The team responds by adding autoscaling to handle peak load, without first correcting the instance size. What does that purchase them?

- **A.** More idle capacity at a higher cost for the same useful work, because scaling multiplies the number of units and every added unit carries the same waste the first one did.
- **B.** Lower total cost, since autoscaling automatically shrinks instance size as well as instance count during quiet periods.
- **C.** A lower hourly rate, since adding autoscaling automatically qualifies the workload for reserved or committed-use pricing.
- **D.** A higher measured utilisation figure, because spreading the same load across more instances raises the per-instance CPU percentage that the report shows.

**Answer: A.** Scaling multiplies whatever the unit costs, including its waste: autoscaling a workload that idles at 5% CPU on an oversized instance type buys more idle capacity at a higher total cost for the same useful work — the per-unit rate is unchanged — which is the documented failure mode of scaling before correcting the unit.

- B is wrong: Autoscaling adjusts how many instances run, not the type or size of the instance itself.
- C is wrong: Reserved pricing is a separate purchasing decision; enabling autoscaling does not change the rate charged per instance.
- D is wrong: Spreading a fixed load across more instances lowers per-instance utilisation rather than raising it, while adding cost for the extra capacity.

### 28.

What decides the correct instance type and size during right sizing, and what does committed-use or reserved pricing do instead?

- **A.** Reserved pricing removes the waste directly and permanently, since committing to a multi-year term is believed to force the workload onto a smaller, better-matched instance automatically.
- **B.** The number of instances currently running, since horizontal scaling and right sizing measure the same underlying quantity.
- **C.** Measured utilisation over a representative period, including peaks, together with a family matched to the actual bottleneck; reserved pricing only discounts the rate, locking in existing waste rather than removing it.
- **D.** Whether the resource is orphaned, since untagged idle resources are what right sizing corrects first.

**Answer: C.** Right sizing is driven by measurement: utilisation data over a representative period, including peaks, decides the type and size, and choosing a family that matches the bottleneck matters as much as choosing a smaller size — committed-use or reserved pricing is a discount on the rate, which locks in the existing waste rather than removing it.

- A is wrong: A reserved commitment locks in a rate for whatever instance size is chosen; it does not itself choose or resize anything.
- B is wrong: Horizontal scaling changes how many units run; right sizing changes what each unit is, which is a different decision.
- D is wrong: An orphaned resource with no owner is a different, tagging-related problem from an active but oversized resource.

### 29.

A workload needs to store a third-party API key and retrieve it at startup, with rotation on a schedule and every access recorded. Which service is that, and which adjacent service is it not?

- **A.** A key management service, since encrypting the key at rest is what actually protects it.
- **B.** An instance role, since roles are the platform's general answer to holding any kind of credential.
- **C.** An environment variable marked as encrypted inside the deployment manifest, which is treated as achieving the same protection and rotation guarantees as a properly managed secret store.
- **D.** A managed secret store rather than a key management service, which creates and controls encryption keys instead of holding credential values.

**Answer: D.** The distinction the exam draws is against the two things a secret store is not: a key management service, which controls encryption keys rather than credential values, and an encrypted environment variable, which is still a static artifact rather than a runtime-retrieved value.

- A is wrong: A key management service protects encryption keys; it does not itself store or rotate a credential value like an API key.
- B is wrong: A role issues temporary credentials for the platform's own APIs; a third-party API key still has to exist as a value somewhere.
- C is wrong: An encrypted value baked into a manifest is still an artifact anyone with pipeline or registry access can extract, and changing it still requires a redeploy.

### 30.

Why does fetching a secret from a managed store at runtime make rotation practical in a way that baking the value into the deployment artifact does not?

- **A.** Runtime retrieval automatically triggers the infrastructure template to reapply whenever the stored value changes.
- **B.** Runtime retrieval narrows the role's permissions a little more each time a secret is fetched.
- **C.** It does not make any real difference — a value baked directly into a deployment artifact can be rotated just as easily as one fetched at runtime, since only the encryption of the artifact itself differs.
- **D.** Rotation replaces the stored value without requiring a redeploy, because the workload reads the current value on each retrieval rather than carrying a fixed copy.

**Answer: D.** Because retrieval is a runtime call, rotation replaces the stored value without redeploying the application — which is what turns a long-lived secret into a short-lived one, unlike a value baked into an image or manifest that requires a redeploy to change everywhere it is used.

- A is wrong: Fetching a secret at runtime is unrelated to whether an infrastructure template reapplies; those are separate mechanisms.
- B is wrong: Fetching a secret does not change a role's granted permissions; narrowing a role is a separate, deliberate action.
- C is wrong: A baked-in value requires a redeploy to change wherever it is used, which is exactly the friction runtime retrieval removes.

### 31.

How many pillars does AWS's Well-Architected Framework name today, and how does that compare to Azure's framework?

- **A.** AWS names five, the recognised pillars across the industry, and Azure follows the same five pillar set.
- **B.** AWS names six and Azure also names six, since both frameworks are described as having added a sustainability pillar in the very same late-2021 revision cycle.
- **C.** AWS names six — operational excellence, security, reliability, performance efficiency, cost optimization and sustainability, the sixth added in a late-2021 revision; Azure names five, with no sustainability pillar.
- **D.** AWS names five, matching Azure's five, because both providers are commonly assumed to have frozen their published frameworks at the same original pillar count sometime well before the 2021 revision cycle began.

**Answer: C.** The number and names of the pillars are directly recallable facts, and the five/six discrepancy between AWS and Azure is exactly the kind of near-miss a multiple-choice option is built from: this project once stated five as the universal count, before AWS's sustainability pillar, added 2 December 2021, made six the current AWS figure while Azure's own framework stayed at five.

- A is wrong: Five predates AWS’s late-2021 addition of sustainability, and no single provider’s pillar set is universal across vendors.
- B is wrong: Azure's published framework has five pillars with no sustainability pillar at all.
- D is wrong: AWS’s framework was revised in late 2021 to add a sixth pillar, so it was not frozen at five.

### 32.

A team completes a well-architected review of a production workload. What does the review actually produce?

- **A.** A prioritised list of findings and tradeoffs across the pillars, making it an improvement exercise rather than a pass/fail audit or a certification.
- **B.** A pass/fail certification the team can display publicly, since the review is understood to check strict compliance against each of the named pillars in turn.
- **C.** A revised recovery time objective for the workload's disaster recovery plan.
- **D.** A signed attestation that the workload meets its service level agreement.

**Answer: A.** A review walks the workload through questions grouped by pillar and produces a prioritised list of improvements and the tradeoffs between pillars — more redundancy costs more, tighter security can cost latency — because it is an improvement exercise, not an audit or a certification.

- B is wrong: A review is not pass/fail and issues no certification; it produces findings for the team to act on.
- C is wrong: Recovery time targets are set separately from a pillar review, which produces broader architectural findings instead.
- D is wrong: SLA attestation is a separate contractual matter and is not something a well-architected review issues.

