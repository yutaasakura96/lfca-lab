<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Cloud Computing Fundamentals

201 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A team now defines its environments in a version-controlled template applied identically to staging and production, replacing changes engineers used to make by hand in the console. Which problem does this fix, and which does it not fix by itself?

- **A.** It eliminates configuration drift completely and immediately, since the running instances are now replaced rather than edited going forward.
- **B.** It satisfies the security pillar of a well-architected review outright, since a template that has passed code review is assumed to guarantee least-privilege access on every resource it goes on to create.
- **C.** It fixes unreproducible environments and unreviewed changes; it does not by itself stop console changes made outside the template, so drift is eliminated only once the template is reapplied continuously.
- **D.** It removes the need for an audit log, since the template file itself is now the complete record of every action taken against the account.

**Answer: C.** Automation converts reproducibility, reviewability and auditability of the definition into one solved problem, which is exactly what the operational excellence pillar of a well-architected review asks for. It is a distinct axis from immutability: automating provisioning does not by itself eliminate drift, because a console change made outside the loop is still possible until the definition is reapplied continuously or the instance is replaced rather than edited.

- A is wrong: Replacing rather than editing is what immutable infrastructure adds; automating the template's application does not by itself guarantee that.
- B is wrong: A template can still request over-broad permissions; review catches that only if someone checks for it, which automation alone does not guarantee.
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

- **A.** The console change leaves no record at all, since it is commonly assumed that none of the major cloud providers log console activity anywhere by default, which is why teams often skip reviewing it after an incident and move straight to blaming the deployment pipeline instead.
- **B.** Although CloudTrail, Activity Log or Cloud Audit Logs still record by default that the action happened, the console change leaves no reproducible artifact: no reviewable definition that can be diffed, approved and reapplied to recreate the environment.
- **C.** The console change cannot be encrypted at rest, unlike a template stored in version control.
- **D.** The console change bypasses least-privilege enforcement entirely, since every console session is granted administrator rights by default regardless of the identity signing in or the policy attached to it.

**Answer: B.** The auditability argument for infrastructure as code is precise, not sweeping: a console action is recorded by the provider's audit service by default, so the claim that it 'leaves no record' is false. What it genuinely lacks is a reproducible artifact — a reviewable definition of the change that can be diffed, approved and reapplied — which is what a template provides and a console click does not.

- A is wrong: AWS CloudTrail, Azure Activity Log and Google Cloud Audit Logs all record console actions by default; the true gap is the missing reproducible artifact.
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
- **B.** The distinction between replication and backup, since the provider's built-in redundancy is a replica, not a backup.
- **C.** The shared responsibility model — the durability of the storage service is the provider's, but the retention policy and the restore capability are the customer's.
- **D.** The provider's autoscaling policy, which is what actually determines how much data is retained.

**Answer: C.** 'The provider backs it up' misreads the shared responsibility model: the durability of the storage service is the provider's, but the retention policy and the restore are the customer's to build and test.

- A is wrong: Managed durability is not the same as a retained, restorable backup with a policy the customer controls.
- B is wrong: That distinction matters, but the assumption in the stem is specifically about who owns the backup obligation, not about replication versus backup.
- D is wrong: Autoscaling governs compute capacity in response to load; it has no bearing on data retention.

### 7.

A backup plan assigns resources by tag, sets a retention period, and moves older copies to cheaper storage on a lifecycle schedule. What is still missing before it can be called a working recovery capability?

- **A.** A restore that has actually been exercised — an untested restore path is an assumption, not a recovery capability, regardless of how the plan is configured.
- **B.** Nothing — a correctly configured backup plan with retention and lifecycle rules is definitionally complete.
- **C.** A consistent tag key, since resources tagged inconsistently will silently drop out of the plan.
- **D.** An audit log entry recording who created the backup plan, which is treated as sufficient proof on its own that the data the plan protects can actually be restored.

**Answer: A.** A backup plan sets frequency and retention against a recovery point and recovery time objective, with lifecycle rules moving older copies to cheaper storage, but the restore is then exercised deliberately, because an untested restore path is an assumption rather than a recovery capability.

- B is wrong: Configuration alone does not prove a copy can be restored; that has to be exercised deliberately.
- C is wrong: Tag consistency matters for which resources get backed up at all, but the stem already assumes resources are correctly assigned by tag.
- D is wrong: Knowing who created the plan does not establish whether the data it protects can actually be restored.

### 8.

A system is being reviewed and the architect states its guiding assumption as: every component will eventually fail, so failure must be a routine, absorbed event rather than an incident. Which practice does that assumption describe?

- **A.** Design for failure: the design stance that failure is expected and built for, not a fault-tolerance mechanism or a recovery plan.
- **B.** Fault tolerance — the narrower, component-level property that absorbs one defined class of failure with no interruption a user would ever notice.
- **C.** High availability — the weaker property that accepts a short interruption while detection and failover run.
- **D.** A monitoring discipline that watches for failures once they happen, rather than an assumption made at design time.

**Answer: A.** Design for failure is the assumption behind almost every other Architecture practice in this competency, and the exam separates it from the mechanisms and plans that follow from it: fault tolerance absorbs a defined failure invisibly, high availability accepts a short gap, and disaster recovery restores service after a loss the design did not absorb.

- B is wrong: That is a mechanism the assumption motivates, not the assumption itself.
- C is wrong: High availability accepts a brief gap; the stem describes an assumption held before any mechanism runs.
- D is wrong: Monitoring detects failure after the fact; the stem describes a stance taken before the system is built.

### 9.

Multi-zone deployment, health checks and automated instance replacement are described in this competency as consequences of one underlying assumption. Which assumption is it?

- **A.** That the reliability pillar of a well-architected review is fully satisfied the moment any redundant capacity exists anywhere in the account, regardless of how it is arranged.
- **B.** That every component, whether an instance, disk, zone, dependency or network path, will fail, so its failure must be absorbed as routine rather than treated as an incident.
- **C.** That high availability and disaster recovery are interchangeable safeguards covering the same failure scope.
- **D.** That automating configuration removes any need to plan for the loss of a component.

**Answer: B.** Design for failure is the reasoning behind almost every other Architecture answer in this competency: multi-zone deployment, health checks and instance replacement are all consequences of having made this one assumption first.

- A is wrong: A review assesses a design against pillars; it is not the assumption that produces the design.
- C is wrong: They cover different scopes and are not interchangeable; neither is the underlying assumption named here.
- D is wrong: Automation concerns how a change is applied, not whether component loss has been planned for.

### 10.

A resource is tagged `owner=alice` while every cost report, backup plan and automation rule in the account selects on the standard key `Owner`. What happens, and does anything raise an error?

- **A.** Nothing — tagging systems normalise key case automatically, so `owner` and `Owner` are treated as the same key.
- **B.** The resource is billed to a default cost centre automatically until the tag is corrected.
- **C.** The resource loses its network isolation boundary, since tags also serve as isolation boundaries between workloads.
- **D.** The resource silently falls outside every report, plan and rule keyed on `Owner`, because tag keys are distinct strings and no error is raised anywhere.

**Answer: D.** Tags are load-bearing rather than decorative: cost allocation reports, backup plan assignment, and automation targeting all select resources by tag, so `Owner`, `owner` and `OWNER` are three different keys, and a resource tagged with the wrong one silently drops out of every rule that selects on the standard one, with no error raised anywhere.

- A is wrong: Tag keys are matched as exact strings; there is no automatic case normalisation that would unify the two.
- B is wrong: There is no default cost centre fallback; a resource with the wrong tag key simply does not appear in a report keyed on the standard one.
- C is wrong: A tag can be used as a condition in an access policy, but it is not itself an isolation boundary; that role belongs to accounts, subscriptions or projects.

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

- **A.** Yes — encryption at rest specifically blocks reads from any identity that was not present when the encryption key was created.
- **B.** Yes — TLS is widely understood to terminate the connection before an over-privileged but fully authenticated and authorised identity's own request can ever reach the underlying storage layer at all.
- **C.** No, but choosing a customer-managed key instead of a provider-managed key would have stopped the over-privileged read.
- **D.** No. The service decrypts for any caller it has authorised, so neither protects against an over-privileged identity; that is a least-privilege problem, not an encryption problem.

**Answer: D.** At rest and in transit defend against different attackers, and neither protects against an over-privileged identity that is entitled to call the API, because the service decrypts for authorised callers by design — 'the bucket is encrypted' is not an answer to 'the bucket was readable by someone who should not have had access'.

- A is wrong: Encryption at rest protects stored bytes from theft; it does not track or restrict which identities may call the API afterward.
- B is wrong: TLS protects data crossing the network; it does not evaluate whether the caller's identity should be allowed to make the request.
- C is wrong: The choice between key types is about who controls key policy, rotation and audit trail, not about the strength or scope of protection against an authorised caller.

### 13.

A stolen disk from a decommissioned volume, and a request sniffed off the network: which form of encryption defends against which?

- **A.** Encryption at rest defends both, since data encrypted on disk stays encrypted through its entire lifecycle, including transmission.
- **B.** A managed secret store defends the stolen disk, and a key management service defends the sniffed request.
- **C.** IAM policy defends the stolen disk, and multi-factor authentication defends the sniffed request.
- **D.** Encryption at rest defends the stolen disk; encryption in transit, by TLS, defends the sniffed request, and neither substitutes for the other.

**Answer: D.** Encryption at rest protects the stored bytes — a stolen disk, a snapshot copied to another account, a decommissioned volume — and TLS protects data on the wire, leaving the disk readable; the two threats and their defences do not overlap.

- A is wrong: At-rest encryption protects the stored bytes and does nothing whatsoever for data crossing a network; transmission needs TLS separately.
- B is wrong: Neither a secret store nor a key management service defends the network path; TLS is what protects data in transit.
- C is wrong: IAM and MFA govern who is authorised to call an API; neither protects bytes on a stolen disk or on the wire.

### 14.

A load balancer's health check is a shallow TCP check that reports a target healthy as soon as it accepts the socket. What can go wrong because of that shallowness?

- **A.** A target enters rotation before it can actually serve a request, because accepting a connection is not the same as the application layer being ready to handle one.
- **B.** Nothing — accepting a TCP connection is sufficient proof that the application layer is also ready to serve requests.
- **C.** The load balancer stops routing to the target entirely, since a shallow check can never report healthy in the first place.
- **D.** An alert fires and pages a human before the target is added back into rotation.

**Answer: A.** A second distinction the competency draws is between liveness and readiness — a shallow TCP check reports healthy for a process that has accepted the socket but cannot yet serve a request, so instances enter rotation before they are actually ready.

- B is wrong: A process can accept a socket long before it has finished initialising enough to answer a request correctly.
- C is wrong: A shallow check reports healthy easily, which is exactly the problem; it does not withhold traffic.
- D is wrong: A health check drives an automated routing decision inside a control loop; paging a human is what monitoring and alerting do instead.

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
- **C.** Nothing was missed — deleting the IAM identity removes every login the employee had, cloud control plane and guest operating system alike.
- **D.** The Linux user account on the instance is governed separately from the IAM identity; deleting one does not remove the other.

**Answer: D.** Cloud IAM is not the guest operating system's user database. An IAM identity governs API calls that create, modify or delete resources, while a Linux user account governs what happens inside the guest once it is running; removing an employee's IAM identity does not remove their `sshd` login on a server.

- A is wrong: A permissions boundary caps what an IAM identity can be granted; it has no effect on a separate operating-system account.
- B is wrong: Federation changes how the IAM identity authenticates; it does not touch a separate Linux account on an instance.
- C is wrong: An IAM identity and a guest OS account are two separate systems; removing one leaves the other exactly as it was.

### 17.

What does cloud IAM govern, and how should the account's root or global-administrator identity be treated day to day?

- **A.** It governs the guest operating system's user database rather than any cloud-side resource, and the root identity is treated as an ordinary account fit for daily administrative logins across the whole team.
- **B.** It governs only billing and cost visibility rather than resource access, so the root identity is considered safe to share broadly among the finance team for reporting purposes.
- **C.** It governs authentication and authorization for control-plane API calls against resources; the root or global-administrator identity is protected and used for essentially nothing routine.
- **D.** It governs network routing decisions inside a virtual private cloud; the root identity is reserved for network engineers.

**Answer: C.** Policies attach to identities or resources and are evaluated per API call, covering both authentication and authorization at the level of the cloud control plane; the account's root or global-administrator identity is deliberately protected and kept out of routine use.

- A is wrong: That describes an OS account, not the cloud control-plane identity system, and reverses the guidance to reserve root for routine use.
- B is wrong: IAM governs far more than billing, and the root identity is specifically the one that should not be shared.
- D is wrong: Routing configuration is a resource IAM policies can gate, not what IAM itself governs, and root is not reserved for a single team.

### 18.

A workload adopts an immutable deployment model, where every release launches fresh instances from a new image and terminates the old ones. It has been writing user file uploads to the instance's own local disk. What happens at the next deployment?

- **A.** The uploaded files are lost, because replacement destroys everything stored locally on the instance and nothing external retained a copy.
- **B.** Nothing changes, since automation over manual configuration already externalises application state as part of applying a template.
- **C.** The files migrate automatically to the replacement instances, because the platform transparently mirrors local disk contents between old and new instances for the duration of a blue/green rollout.
- **D.** Nothing changes, because 'immutable' means the data already on the instance cannot be modified once it is written.

**Answer: A.** Immutable describes the instance, not the data. Anything the workload must not lose has to be externalised into a managed database, object storage, or a volume with its own lifecycle, because replacement destroys everything local — a workload writing uploads to local disk breaks the moment immutability is adopted, and the failure looks like data loss rather than a design error.

- B is wrong: Automating how a definition is applied says nothing about where application data is stored; that is a separate design decision.
- C is wrong: Blue/green rollout shifts traffic between instance sets; it does not copy local disk contents, which is exactly what object storage exists to solve.
- D is wrong: Immutable describes the instance's lifecycle, not a guarantee about the data it happens to hold locally.

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
- **B.** Yes, provided the secrets store and the bucket are both encrypted at rest.
- **C.** No; read access to those three is exactly what data exfiltration requires, and least privilege scopes both resources and actions, not write access alone.
- **D.** No, but only because a secrets store is considered something that should never be reachable by any read-only policy under any circumstance at all.

**Answer: C.** The exam's other favourite trap here is the assumption that read-only access is inherently safe: read permission on a secret store, a database, or an object storage bucket is exactly what data exfiltration requires, so least privilege has to scope resources and actions together.

- A is wrong: Reading sensitive data causes damage on its own; 'no writes' says nothing about exposure from reading.
- B is wrong: Encryption at rest protects against theft of the storage medium; it does nothing against a caller the service has already authorised to read.
- D is wrong: A secrets store can legitimately be read by identities that need it; the risk is granting read access more broadly than the task requires, not read access itself.

### 23.

"Who deleted the storage bucket at 02:14, and from what address" — which of these answers that: an audit log, an application log, or a metric?

- **A.** The metric, since a numeric time series would show the exact moment the deletion occurred.
- **B.** The application log, since a deployed infrastructure-as-code template records every change made to the environment.
- **C.** Any of the three equally, since all three record what happened to a resource over time.
- **D.** The audit log — it records which identity called which API against which resource, when and from where.

**Answer: D.** An audit log is not an application log and not a metric, and the three answer different questions: 'who deleted the storage bucket, and from what address' is an audit-log question, answered by recording which identity called which API, against which resource, when, from where, and with what result.

- A is wrong: A metric can show that something changed around that time, but not which identity made the call or from where.
- B is wrong: A template records the intended desired state, not a real-time record of who called which API and when.
- C is wrong: The three answer different questions — identity and API call, application behaviour, and numeric trend — and only one of them answers this one.

### 24.

CloudTrail's Event history has been the only audit configuration in place for over a year. An investigation now needs management events from 120 days ago. What does the team find?

- **A.** The full history going back to the account's creation, since CloudTrail is widely believed to retain management events indefinitely once it is enabled for an account.
- **B.** The events, restored from the account's backup plan alongside the resource data it protects.
- **C.** The events, still visible in the monitoring dashboard's default 120-day metric window.
- **D.** Nothing: Event history retains only the past 90 days of management events per region, and longer retention needs a configured trail or a CloudTrail Lake event data store.

**Answer: D.** Retention is the detail worth holding: Event history gives a searchable, immutable record of the past 90 days of management events in a region at no charge, but 90 days is the whole of it — longer retention requires creating a trail that delivers events to object storage, or an event data store in CloudTrail Lake.

- A is wrong: CloudTrail is enabled by default, but Event history's window is bounded to 90 days regardless of how long it has been running.
- B is wrong: A backup plan protects resource data, not the control-plane audit trail; the two are separate systems.
- C is wrong: A metrics dashboard shows numeric trends, not the identity-level audit record that this investigation needs.

### 25.

A workload is deployed across three availability zones in one AWS region. Which class of outage does that arrangement leave it fully exposed to?

- **A.** The loss of a nightly backup copy, since spreading instances across zones is itself a backup strategy for the data they hold.
- **B.** An outage at a different cloud vendor entirely, since spreading across zones is a form of running multi-cloud.
- **C.** Nothing — spreading a workload across zones already protects it against an outage of any scale.
- **D.** The loss of the entire region, since multi-zone protects against a zone-level failure inside a region, not a regional one.

**Answer: D.** Scope is the trap here. Multi-zone protects against a single datacentre location failing inside one region; the region itself, and the data-residency question of which region to use, are separate matters a multi-zone design does not settle.

- A is wrong: Multi-zone deployment is not the same as taking a backup; it protects live capacity, not a retained independent copy.
- B is wrong: Multi-zone is confined to one provider and one region; it is not a multi-cloud arrangement.
- C is wrong: Zone-level redundancy has a limit at the region boundary; it does not scale up to protect against every outage.

### 26.

How does AWS identify one availability zone, and how does Azure describe what an availability zone is?

- **A.** AWS numbers zones sequentially across every region it operates rather than coding them by letter; Azure treats a zone as a single physical building rather than a group of datacenters with independent power and cooling.
- **B.** AWS defines a zone as an entire separate region under another name; Azure has no concept of zones at all.
- **C.** AWS codes it as the region code plus a letter, such as us-east-1a; Azure describes it as a separated group of datacenters with independent power, cooling and networking.
- **D.** Both providers require an availability zone to sit in a different country from its region before the label applies.

**Answer: C.** The two providers' definitions are directly recallable and were fact-checked verbatim against their own documentation: AWS's zone code is the region code plus a letter, and Azure describes a zone as a separated group of datacenters with independent power, cooling and networking, typically within about 100 km of each other.

- A is wrong: AWS zone codes are region-scoped letters, not a global sequence, and Azure's zones are groups of datacenters, not single buildings.
- B is wrong: A zone is a subdivision within one region, not a region itself, and Azure does publish an availability zone concept.
- D is wrong: Zones sit inside one region and are typically within about 100 km of each other, not in a different country.

### 27.

A workload idles at 5% CPU on an oversized instance type. The team responds by adding autoscaling to handle peak load, without first correcting the instance size. What does that purchase them?

- **A.** Lower total cost, since autoscaling automatically shrinks instance size as well as instance count during quiet periods.
- **B.** A lower hourly rate, since adding autoscaling automatically qualifies the workload for reserved or committed-use pricing.
- **C.** More idle capacity at a higher cost for the same useful work, because scaling multiplies the number of units and every added unit carries the same waste the first one did.
- **D.** A higher measured utilisation figure, because spreading the same load across more instances raises the per-instance CPU percentage that the report shows.

**Answer: C.** Scaling multiplies whatever the unit costs, including its waste: autoscaling a workload that idles at 5% CPU on an oversized instance type buys more idle capacity at a higher total cost for the same useful work — the per-unit rate is unchanged — which is the documented failure mode of scaling before correcting the unit.

- A is wrong: Autoscaling adjusts how many instances run, not the type or size of the instance itself.
- B is wrong: Reserved pricing is a separate purchasing decision; enabling autoscaling does not change the rate charged per instance.
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
- **B.** A managed secret store rather than a key management service, which creates and controls encryption keys instead of holding credential values.
- **C.** An instance role, since roles are the platform's general answer to holding any kind of credential.
- **D.** An environment variable marked as encrypted inside the deployment manifest, which is treated as achieving the same protection and rotation guarantees as a properly managed secret store.

**Answer: B.** The distinction the exam draws is against the two things a secret store is not: a key management service, which controls encryption keys rather than credential values, and an encrypted environment variable, which is still a static artifact rather than a runtime-retrieved value.

- A is wrong: A key management service protects encryption keys; it does not itself store or rotate a credential value like an API key.
- C is wrong: A role issues temporary credentials for the platform's own APIs; a third-party API key still has to exist as a value somewhere.
- D is wrong: An encrypted value baked into a manifest is still an artifact anyone with pipeline or registry access can extract, and changing it still requires a redeploy.

### 30.

Why does fetching a secret from a managed store at runtime make rotation practical in a way that baking the value into the deployment artifact does not?

- **A.** Rotation replaces the stored value without requiring a redeploy, because the workload reads the current value on each retrieval rather than carrying a fixed copy.
- **B.** Runtime retrieval automatically triggers the infrastructure template to reapply whenever the stored value changes.
- **C.** Runtime retrieval narrows the role's permissions a little more each time a secret is fetched.
- **D.** It does not make any real difference — a value baked directly into a deployment artifact can be rotated just as easily as one fetched at runtime, since only the encryption of the artifact itself differs.

**Answer: A.** Because retrieval is a runtime call, rotation replaces the stored value without redeploying the application — which is what turns a long-lived secret into a short-lived one, unlike a value baked into an image or manifest that requires a redeploy to change everywhere it is used.

- B is wrong: Fetching a secret at runtime is unrelated to whether an infrastructure template reapplies; those are separate mechanisms.
- C is wrong: Fetching a secret does not change a role's granted permissions; narrowing a role is a separate, deliberate action.
- D is wrong: A baked-in value requires a redeploy to change wherever it is used, which is exactly the friction runtime retrieval removes.

### 31.

How many pillars does AWS's Well-Architected Framework name today, and how does that compare to Azure's framework?

- **A.** AWS names five, the recognised pillars across the industry, and Azure follows the same five pillar set.
- **B.** AWS names six — operational excellence, security, reliability, performance efficiency, cost optimization and sustainability, the sixth added in a late-2021 revision; Azure names five, with no sustainability pillar.
- **C.** AWS names six and Azure also names six, since both frameworks are described as having added a sustainability pillar in the very same late-2021 revision cycle.
- **D.** AWS names five, matching Azure's five, because both providers are commonly assumed to have frozen their published frameworks at the same original pillar count sometime well before the 2021 revision cycle began.

**Answer: B.** The number and names of the pillars are directly recallable facts, and the five/six discrepancy between AWS and Azure is exactly the kind of near-miss a multiple-choice option is built from: this project once stated five as the universal count, before AWS's sustainability pillar, added 2 December 2021, made six the current AWS figure while Azure's own framework stayed at five.

- A is wrong: Five predates AWS’s late-2021 addition of sustainability, and no single provider’s pillar set is universal across vendors.
- C is wrong: Azure's published framework has five pillars with no sustainability pillar at all.
- D is wrong: AWS’s framework was revised in late 2021 to add a sixth pillar, so it was not frozen at five.

### 32.

A team completes a well-architected review of a production workload. What does the review actually produce?

- **A.** A pass/fail certification the team can display publicly, since the review is understood to check strict compliance against each of the named pillars in turn.
- **B.** A revised recovery time objective for the workload's disaster recovery plan.
- **C.** A prioritised list of findings and tradeoffs across the pillars, making it an improvement exercise rather than a pass/fail audit or a certification.
- **D.** A signed attestation that the workload meets its service level agreement.

**Answer: C.** A review walks the workload through questions grouped by pillar and produces a prioritised list of improvements and the tradeoffs between pillars — more redundancy costs more, tighter security can cost latency — because it is an improvement exercise, not an audit or a certification.

- A is wrong: A review is not pass/fail and issues no certification; it produces findings for the team to act on.
- B is wrong: Recovery time targets are set separately from a pillar review, which produces broader architectural findings instead.
- D is wrong: SLA attestation is a separate contractual matter and is not something a well-architected review issues.

### 33.

A team wants one instrument that answers both 'am I about to exceed what I said I would spend' and 'what am I spending it on, and is that changing.' Which instrument does both, and if none does, why not?

- **A.** No single instrument does — a budget answers the first because it has a threshold to cross, and monitoring answers the second because it reports trend with no target of its own.
- **B.** Cost monitoring alone does both, since a rising trend line on a dashboard already implies that some spend threshold is being approached.
- **C.** A pricing calculator does both, since it estimates the number needed to set both a budget and a monitoring baseline.
- **D.** A budget alone does both, since its threshold notification already explains exactly what changed in the estate to cause the breach.

**Answer: A.** Budgets and cost monitoring answer different questions: a budget requires a target decided beforehand and fires when actual or forecast spend crosses it, while monitoring has no number in it at all and simply reports what is happening and how the trend is moving.

- B is wrong: A trend line has no defined threshold of its own; without a configured budget, nothing decides how much of a rise counts as approaching a limit.
- C is wrong: A calculator estimates cost for a configuration before it is built; it does not itself report ongoing spend or notify on a crossed threshold.
- D is wrong: A threshold breach is a notification, not a breakdown; it does not say what changed, which is exactly what monitoring's per-service, per-tag data provides.

### 34.

A budget's 90 percent threshold has just fired by email. What has the provider actually done to the account as a result?

- **A.** The account is now blocked from provisioning further resources, since the threshold exists specifically to prevent overspend.
- **B.** Nothing by default: a threshold breach sends a notification, and it halts no resource and refuses no API call unless an action was explicitly configured.
- **C.** Any orphaned resources contributing to the overage are automatically found and deleted.
- **D.** The account's free-tier allowance is extended automatically to absorb the extra spend.

**Answer: B.** A budget is not a spending cap. Crossing a threshold notifies a person; it stops no resource and refuses no API call unless an administrator explicitly configured a budget action to do so, and an exam option claiming otherwise is wrong by default.

- A is wrong: This is the assumption the trap exists to catch — a threshold breach is a message, not an enforcement action, unless a budget action was deliberately configured in advance.
- C is wrong: Budgets do not identify or delete resources; finding and removing an orphan is a separate, evidence-based practice using inventory, not a budget behaviour.
- D is wrong: A free-tier allowance and a budget threshold are unrelated instruments; crossing one has no effect on the size of the other.

### 35.

Two thresholds are configured on the same budget: one evaluated against actual spend, one against forecast spend. Which one can warn before the money is actually gone, and what caveat applies to both?

- **A.** The actual threshold can warn early, since actual figures are always more current and more trustworthy than any forecast could be.
- **B.** Neither can warn early; only a periodic rightsizing review of provisioned capacity catches overspend before it actually happens.
- **C.** The forecast threshold can warn early; both are still subject to a billing delay, so spend can cross a threshold and keep moving before the notification arrives.
- **D.** Both warn the instant spend crosses the line, since cloud billing is metered and reported in real time.

**Answer: C.** Each threshold is evaluated against either actual spend, which has already accrued, or forecast spend, which has not, so only a forecast threshold can warn before the money is gone. Both remain subject to a documented delay between a charge being incurred and the notification arriving.

- A is wrong: Actual spend has already accrued by definition; it can only report what has already happened, not warn ahead of it the way a forecast can.
- B is wrong: Rightsizing addresses provisioned-versus-utilised waste on existing resources, a different problem from being notified about approaching a spend target.
- D is wrong: Billing lags the usage it describes, so notification is never instantaneous — this is a documented caveat, not an edge case.

### 36.

A finance team argues that moving from owned servers to cloud compute is a straightforward cost win, since the monthly bill is smaller than the loan payments on a server refresh would have been. What does the CapEx-to-OpEx shift actually establish on its own?

- **A.** It proves cloud is cheaper, once staffing and power costs are added to the on-premises side of the comparison.
- **B.** It proves consumption is billed only for work actually performed, not for capacity left running idle.
- **C.** It changes the shape and reversibility of spending, from a fixed sum committed once to a variable charge stoppable at will, not that the eventual total is necessarily smaller.
- **D.** It replaces a capital budgeting process with no budgeting process at all, since usage is metered automatically and the provider is now responsible for staying within any limit.

**Answer: C.** The CapEx-to-OpEx shift changes when money is committed and how reversible that commitment is, not whether the eventual total is smaller — that depends entirely on how well the resulting consumption is controlled.

- A is wrong: That claim requires costing both sides fully, which is what total cost of ownership does, not what the accounting shift itself proves.
- B is wrong: That describes the pay-as-you-go meter's behaviour, and it is false there too — provisioned capacity bills whether or not it is used.
- D is wrong: Consumption is still tracked against a target and controlled deliberately by the customer; nothing about a metered bill removes the need to plan and cap spend, and no provider enforces a limit on your behalf by default.

### 37.

AWS's business case for cloud computing argues the same accounting trade in different words than 'CapEx versus OpEx.' Which pair of terms does that specific page actually use?

- **A.** Fixed expense versus variable expense: the underlying trade is the same, but this page never uses the words 'CapEx' or 'OpEx.'
- **B.** Capital expenditure versus operational expenditure, quoted directly from that same AWS business-case page word for word.
- **C.** Predictable versus elastic capacity, describing the pay-as-you-go meter rather than an accounting category.
- **D.** Committed versus interruptible workload, the axis separating reserved pricing from spot pricing elsewhere in this competency.

**Answer: A.** AWS's page argues the trade in fixed-versus-variable-expense language rather than literally saying CapEx or OpEx. The two vocabularies describe the same accounting shift, but a citation must not assume the source used words it never contains.

- B is wrong: A tempting shortcut, but the source's own wording is fixed and variable expense — assuming it uses the accounting terms verbatim is a citation error, not a paraphrase.
- C is wrong: That pair names the billing principle behind consumption charges, a different concept from the accounting-category trade this page argues.
- D is wrong: That pair names a purchasing-option trade-off, not the fixed-versus-variable expense vocabulary this page uses.

### 38.

A finance team reports each department's cloud spend back to them every month but never moves budget between cost centres to do it. Is this chargeback, showback, or chargeback that has simply not been switched on yet?

- **A.** Chargeback, since reporting a team's spend back to them already counts as billing them for it.
- **B.** Cost monitoring, since it is simply a report rather than either accounting practice.
- **C.** Chargeback not yet switched on — showback is simply the on-ramp organisations pass through before they start billing internally.
- **D.** Showback — a deliberate choice to influence behaviour through visibility alone, not an earlier stage of chargeback.

**Answer: D.** Chargeback bills internal teams for their consumption, moving money between cost centres; showback reports the same consumption without transferring any charge. Showback is not chargeback waiting to be turned on — it is a deliberate, often permanent, choice to change behaviour through visibility alone.

- A is wrong: Chargeback moves money between cost centres with an internal invoice; reporting alone, with no such transfer, is showback rather than a form of billing.
- B is wrong: Cost monitoring is the continuous tracking of spend generally; chargeback and showback specifically concern whether spend already tracked is billed internally or merely reported.
- C is wrong: This pair is confused in both directions, and this is the specific misreading: showback is not chargeback waiting to be turned on, it is a standalone choice organisations can run permanently.

### 39.

A monthly bill rises by 20 percent while the resource inventory stays completely unchanged: same instance count, same disks, same databases. What kind of explanation is monitoring's breakdown suited to find, that a simple resource count cannot?

- **A.** None — a rising bill against an unchanged inventory means a configured budget threshold must already have fired by now.
- **B.** More egress, more requests against the same database, an expired free-tier allowance, or a reservation ending its term — each raises the bill without changing the inventory.
- **C.** A new orphaned resource must have appeared somewhere in the estate, since only orphans are known to raise a bill silently like this.
- **D.** Nothing explains it; a rise in the bill always and only means a rise in the number of resources currently provisioned.

**Answer: B.** Monitoring's breakdown by service, account, region and tag is what a bare total cannot provide: a rise in the bill does not imply a rise in the number of resources, since more egress, more requests, an expired allowance, or an ending reservation term can each raise it with the inventory unchanged.

- A is wrong: A budget threshold only fires if one was configured with a target in the first place; nothing about a rising bill guarantees that one exists or has fired.
- C is wrong: An orphan is a resource with no purpose left; the scenario states inventory is entirely unchanged, which is not consistent with a new orphan appearing.
- D is wrong: This is exactly the assumption monitoring's breakdown exists to correct — several causes raise a bill with no new resources involved at all.

### 40.

A cost dashboard exists and its underlying data is technically correct, but nobody has opened it in three months. What does this demonstrate about monitoring on its own?

- **A.** The dashboard's tags must be misconfigured, since a correctly tagged dashboard would have been opened by now.
- **B.** Monitoring is not alerting — a dashboard nobody opens detects nothing, which is why budgets and alerts exist alongside it rather than instead of it.
- **C.** A pricing calculator should replace the dashboard, since estimates need no one to check them.
- **D.** Nothing — the dashboard's data is still being collected correctly, so the organisation is still effectively being warned.

**Answer: B.** Monitoring is not alerting: a dashboard nobody opens detects nothing, which is exactly why budgets and alerts exist alongside continuous monitoring rather than as a replacement for it.

- A is wrong: Whether the dashboard is opened has nothing to do with whether its tags or underlying data are correctly configured; the two are unrelated facts.
- C is wrong: A calculator estimates cost before something is built; it is not a substitute for observing what has actually happened to a running estate.
- D is wrong: Correct data collection with no one looking at it provides no warning to anyone; being technically correct is not the same as being watched.

### 41.

A finance dashboard shows only a single monthly total for the whole account. What does that coarse granularity hide from view?

- **A.** A three-day spike within the month, which daily or hourly data would show immediately.
- **B.** Which access tier each stored object currently sits in.
- **C.** Whether a given transfer crossed a region boundary during the month.
- **D.** Nothing — a monthly total contains the same information as any finer granularity, just already summed.

**Answer: A.** Granularity is the design decision that determines what monitoring can show: a monthly total hides a three-day spike that daily data would surface immediately, which is why providers expose cost and usage data at daily, sometimes hourly, resolution.

- B is wrong: Storage tier is a property tracked by the storage service itself, not something a coarser or finer cost-report granularity would reveal either way.
- C is wrong: Whether a transfer crossed a region is a routing fact tracked by the transfer service, not something the time granularity of a cost report changes.
- D is wrong: Summing away time resolution is exactly what hides a spike; a total and a time series contain different information, not the same information at different scales.

### 42.

Data is uploaded into a cloud provider's storage service, then later read back out to the public internet. Which of those two transfers is billed?

- **A.** Only the inbound upload, since storage services meter and charge for whatever volume of data they physically receive from a client.
- **B.** Only the outbound read; inbound transfer is generally free, and reading your own data back out is egress like any other transfer.
- **C.** Neither, as long as both transfers stay within a monthly free allowance on the account.
- **D.** Neither — the meter tracks only total volume moved in either direction and does not distinguish inbound from outbound at all.

**Answer: B.** Providers price the asymmetry plainly: data entering the network is generally free while data leaving is billed per gigabyte, and reading your own stored data back out to the internet is egress like any other outbound transfer.

- A is wrong: Storage services bill for holding data over time, not for receiving it — ingress itself is generally free across the major providers.
- C is wrong: A free allowance only covers volume up to its own limit; it does not change which direction of transfer is metered once that limit is exceeded.
- D is wrong: The asymmetry is exactly directional: outbound is billed per gigabyte while inbound is generally free, which is the point this concept tests.

### 43.

On Azure, a service in one North America region reads several terabytes from another North America region in the same month, while a separate copy of that data is read by an application outside Azure over the public internet. Which transfer is priced lower on Azure's own published rates, and is that pattern safe to assume on every provider?

- **A.** Whichever transfer runs on a spot instance, since spot pricing carries a built-in data-transfer discount that applies to whatever the instance sends.
- **B.** Whichever transfer touches a tagged resource, since cost-allocation tags mark traffic for a preferential rate on the data-transfer meter.
- **C.** The inter-region transfer is priced lower at this volume on Azure's published North America rates, but the pattern is not a safe assumption to carry to other providers.
- **D.** Both are priced identically, since egress is metered purely by the volume of data moved and takes no account of where that data is going.

**Answer: C.** Egress is metered by volume and banded by destination: on Azure's published rates, transfer between North America regions is $0.02 per gigabyte against $0.08 and up for internet egress, and same-region transfer is free. The ordering is not universal even within that table — internet egress grants a free first 100 GB that inter-region traffic does not, and from South America inter-region transfer is dearer than internet egress via the transit ISP network — so carrying the pattern to another provider unchecked is exactly the assumption this concept warns against.

- A is wrong: Spot is a compute purchase option and carries no data-transfer discount of its own; the two meters are entirely unrelated.
- B is wrong: Tags are metadata used for attribution and policy; they carry no billing discount for the data-transfer meter itself.
- D is wrong: Egress is metered by volume, but it is also banded by destination — internet-bound and inter-region traffic are priced differently, not identically.

### 44.

Which instrument is built to answer 'what will this architecture cost, before any of it is built'?

- **A.** A pricing calculator, since it estimates cost from a proposed configuration before deployment.
- **B.** Cost monitoring, since it reports the actual spend once the architecture is running.
- **C.** A budget alert, since it flags spend as soon as it crosses a defined threshold.
- **D.** The free tier, since spending nothing during the allowance answers the question by direct observation.

**Answer: A.** Cost monitoring and budgets both report or police money that is already being spent. A pricing calculator is the only instrument here that operates before anything exists, which is the discrimination this question is built on.

- B is wrong: Monitoring reports money already spent on something that exists; it cannot answer a question about a configuration that has not been built yet.
- C is wrong: A budget alert reports against actual or forecast spend once a target and a real account exist; it does not model a hypothetical architecture in advance.
- D is wrong: The free tier still requires building something to consume it, and it is an allowance rather than an estimation tool — it says nothing about cost beyond that allowance.

### 45.

An account exceeds its free-tier allowance mid-month, and a payment method is already on file. What happens to the exceeded portion?

- **A.** It starts billing silently at the standard rate; nothing about exceeding the allowance stops the resource.
- **B.** A budget alert fires automatically, since crossing an allowance is the same thing as crossing a spend threshold.
- **C.** The resource becomes an orphan until someone reattaches a valid payment method.
- **D.** The resource is suspended automatically until the following month's allowance resets.

**Answer: A.** Allowances are metered like any other consumption. On an account with a payment method attached, exceeding one does not stop the resource — it silently starts billing at the standard rate, which is why the allowance needs active tracking rather than passive trust.

- B is wrong: An allowance and a configured budget threshold are separate instruments; crossing the free-tier limit does not by itself trigger a budget notification.
- C is wrong: An orphaned resource has no purpose left at all; this resource is still doing its intended job, just at a rate that is no longer free.
- D is wrong: Suspension on allowance exhaustion is not how any of the free-tier shapes behave when a payment method is attached; billing continues rather than the resource pausing.

### 46.

A team describes the three compute purchase options in relation to pay-as-you-go billing. Which of these statements about that relationship is correct?

- **A.** Pay-as-you-go is a fourth purchase option, alongside on-demand, reserved and spot.
- **B.** Reserved pricing converts the spend into a capital purchase, since a multi-year term is being paid for.
- **C.** Reserved and spot are both discounts off the on-demand price, and on-demand is itself the pay-as-you-go baseline priced with no commitment.
- **D.** Spot pricing does not use pay-as-you-go billing at all, since its price is set by a live auction between competing customers rather than by a meter.

**Answer: C.** Pay-as-you-go is the meter every purchase option is billed against: on-demand is that meter at full price, and reserved and spot are discounts off it in exchange for a term commitment or an interruption risk respectively.

- A is wrong: Pay-as-you-go is the account's default billing behaviour, not a fourth item on a menu of purchase options it prices.
- B is wrong: A reservation is still a rented service, not an owned asset — it buys a rate, not a machine, so it does not become a capital expenditure.
- D is wrong: Spot capacity is still metered consumption billed under the same measured-service principle; only its price-setting mechanism differs from on-demand, and it is not an auction either.

### 47.

A stateful job cannot checkpoint fast enough to survive spot interruption on Azure or Google Cloud, but the same job could survive interruption on AWS. What explains the difference?

- **A.** There is no real difference — all three providers give the same interruption notice, so checkpoint speed alone explains the job's survival.
- **B.** AWS's autoscaling reacts faster than Azure's or Google's, giving the job more time regardless of notice length.
- **C.** AWS gives a two-minute interruption notice before reclaiming a Spot Instance; Azure Spot VMs and Google Cloud Spot or preemptible VMs instead give roughly thirty seconds.
- **D.** AWS waives egress charges specifically on spot reclamation events, giving the job effectively more time to finish persisting its state to another region.

**Answer: C.** AWS terminates, stops, or hibernates a Spot Instance after a two-minute interruption notice, with an earlier rebalance-recommendation signal. Azure Spot VMs and Google Cloud Spot or preemptible VMs instead evict with roughly thirty seconds' best-effort notice and no hibernate option — the mechanics are provider-specific, not a shared standard.

- A is wrong: The interruption notice is provider-specific, not a shared spot or preemptible standard, and stating it as universal is the exact generalisation this concept warns against.
- B is wrong: Autoscaling reacts to load, not to an eviction signal, and has no bearing on how much warning a job receives before spot reclamation.
- D is wrong: Egress pricing and interruption notice length are unrelated meters; nothing about an egress charge changes how much warning a job gets.

### 48.

A queue-driven worker fleet processes jobs that can be safely re-queued if interrupted. Behind it sits a 24/7 primary database that needs a steady, predictable baseline for at least two years. Which pairing of purchase option to workload is correct?

- **A.** Spot for the worker fleet, and reserved for the database's steady baseline.
- **B.** On-demand for both, since neither workload's cost can be estimated in advance without it.
- **C.** Reserved for the worker fleet, since a term commitment guarantees the cheapest price regardless of interruption risk.
- **D.** Spot for both, since spot is simply a smaller, rightsized version of on-demand capacity.

**Answer: A.** Matching a workload to a purchase option turns on what it can tolerate, not on price alone: the worker fleet tolerates interruption and belongs on spot, while the database's steady, long-lived baseline is exactly what a reserved commitment is priced for.

- B is wrong: Cost estimation before deployment is a pricing calculator's job and has nothing to do with which purchase option fits a workload's tolerance for interruption or commitment.
- C is wrong: Reserved buys price with a loss of flexibility, not with immunity from interruption; nothing about a term commitment suits work that is fine being interrupted.
- D is wrong: Spot is a discount tied to interruption risk on the same instance types as on-demand, not a smaller size — sizing is a separate, unrelated practice.

### 49.

A cost report shows a line with no corresponding running workload: an unattached disk left behind when its virtual machine was deleted. Is this an orphan or a rightsizing candidate, and what follows from that?

- **A.** A rightsizing candidate — an unattached disk is simply oversized for its current use and should be resized down.
- **B.** Neither — without an owner tag on the disk, no action can be taken on it at all.
- **C.** An orphan; it serves no purpose at all, so the correct action is deletion, not resizing.
- **D.** It stopped billing once its virtual machine was deleted, so no action is needed either way.

**Answer: C.** An orphan and a rightsizing candidate are told apart by whether the resource still has a purpose: the orphan has none and the answer is deletion, while a rightsizing candidate still serves a purpose at the wrong size and the answer is resizing.

- A is wrong: Rightsizing applies to a resource that still serves a real purpose at the wrong size; this disk has no purpose left at all, so resizing is the wrong lever entirely.
- B is wrong: A missing tag makes finding the owner harder, but it does not block deletion once inventory evidence — attachment state and last activity — confirms the disk has no purpose.
- D is wrong: Deleting a virtual machine does not delete its disks by default on Azure, where they persist in the resource group and keep billing on their own meter until somebody removes them deliberately.

### 50.

To cut costs, an engineer detaches an idle disk from its virtual machine but does not delete it. How much money does that detachment save?

- **A.** Nothing, since storage bills for existing, not for being attached or read.
- **B.** The egress charge for the disk's most recent read, since detaching stops any further data transfer.
- **C.** Most of the storage rate, since detached storage bills at a reduced idle rate compared to attached storage.
- **D.** The full per-gigabyte-month rate is waived once a disk is detached, since it is no longer serving a workload.

**Answer: A.** Detaching a volume saves nothing at all: an unattached disk bills the same per gigabyte-month as an attached one, because storage is charged for existing, not for being read or connected. Only deletion stops the charge.

- B is wrong: Egress bills for data leaving the network during a transfer, not for detaching a disk, which involves no data movement at all.
- C is wrong: There is no discounted idle rate for a merely-detached disk; it bills at the same per-gigabyte-month rate as when it was attached.
- D is wrong: An unattached disk bills exactly the same per gigabyte-month as an attached one; whether it serves a workload has no bearing on the storage meter.

### 51.

Which kind of evidence is used to find an orphaned resource, as distinct from a rightsizing candidate?

- **A.** Telemetry — CPU, memory and IOPS utilisation measured against provisioned capacity.
- **B.** A cost-monitoring dashboard's trend line, since any rising bill is a reliable signal of an orphan.
- **C.** A tagging standard's enforcement log, since any untagged resource is necessarily an orphan.
- **D.** Inventory: attachment state, last activity, and owner tag, rather than utilisation telemetry.

**Answer: D.** Rightsizing and orphan-hunting use different evidence: rightsizing compares utilisation telemetry against provisioned capacity, while finding an orphan means querying inventory for attachment state, last activity and owner tags, because an orphan produces no telemetry signal at all.

- A is wrong: Telemetry against provisioned capacity is what finds a rightsizing candidate, a resource that still has a purpose but the wrong size, not a resource with no purpose left.
- B is wrong: A rising bill can have several causes, only one of which is an orphan appearing; a trend line alone does not identify which cause applies.
- C is wrong: An untagged resource is more likely to become an orphan, but the missing tag alone is not proof that a specific resource has no purpose — inventory evidence is still required.

### 52.

An administrator stops a virtual machine in the Azure portal and expects the compute meter to stop immediately. Support explains that billing has continued. Which state is the machine most likely still in?

- **A.** It was switched from on-demand to reserved pricing, which is billed on a different schedule than a stopped machine.
- **B.** The disk became orphaned the moment the machine stopped, and orphan billing is what is being observed.
- **C.** Stopping any virtual machine, on any provider, always halts its compute meter immediately.
- **D.** Stopped (allocated), since the underlying hardware lease has not been released and only deallocation does that.

**Answer: D.** Pay-as-you-go bills provisioned capacity, and stopping a VM does not always release that provision. Azure specifically distinguishes Stopped (allocated), which keeps billing, from Stopped (deallocated), which releases the hardware lease and stops the meter.

- A is wrong: Purchasing option is unrelated to why a stopped machine keeps billing; that is governed by allocation state, not by on-demand versus reserved pricing.
- B is wrong: The trap here is simpler: a merely-stopped machine is not an orphan at all, since it still has an owner and a purpose, and no deletion has occurred.
- C is wrong: True on some platforms but not universally — Azure specifically continues billing a merely-stopped VM until it reaches the deallocated state.

### 53.

One clean sentence is supposed to separate pay-as-you-go from on-demand pricing. Which sentence is it?

- **A.** On-demand is the charging principle; pay-as-you-go is simply one purchase option chosen among several.
- **B.** Pay-as-you-go is a total-cost calculation performed once per project; on-demand is a single recurring line item counted within that larger calculation.
- **C.** Pay-as-you-go is the charging principle; on-demand is the specific no-commitment purchase option priced under it, and the baseline reserved and spot are discounted from.
- **D.** They are two names for exactly the same thing, so the distinction between them is purely terminological and safe to ignore in practice.

**Answer: C.** Pay-as-you-go is the charging principle and the undiscounted baseline every price in this competency is quoted against; on-demand is the specific purchase option that implements it with no commitment.

- A is wrong: This reverses the relationship — pay-as-you-go is the account's default billing behaviour, not one item on a menu of purchase options.
- B is wrong: Total cost of ownership is the calculation that aggregates full cost across categories; pay-as-you-go is a billing principle, not that calculation.
- D is wrong: One names a charging principle and the other a specific purchase option priced under it; treating them as synonyms misses the level each operates at.

### 54.

A virtual machine idles at 2% CPU for an entire month under pay-as-you-go billing. How does its cost compare to the same machine running at 100% CPU the whole month?

- **A.** Lower, because rightsizing automatically detects the 2% load and bills only that share.
- **B.** Identical, because the meter counts provisioned, running capacity, not utilisation.
- **C.** Lower, because autoscaling would already have shrunk the instance in response to the low load.
- **D.** Lower, because 'pay only for what you use' means paying for work performed rather than capacity held.

**Answer: B.** A virtual machine running at 2% CPU costs exactly what the same machine costs at 100%: the meter counts provisioned, running capacity, not work performed, which is precisely why rightsizing and orphaned resources cost money at all.

- A is wrong: Rightsizing is a deliberate periodic review a human performs; the meter itself does no automatic detection or partial billing.
- C is wrong: Autoscaling changes how many units run in response to live traffic; a single idling instance sitting at 2% is not itself evidence that autoscaling applies or has acted.
- D is wrong: That phrase is routinely misread this way, and the misreading is the single most expensive misunderstanding on a cloud invoice — the meter counts provisioned capacity, not work done.

### 55.

Why is an untagged resource described as the enabling gap beneath every other cost-control practice in this competency?

- **A.** Because a budget cannot be created at all for any resource or set of resources that has not first been tagged and registered.
- **B.** Because cost-monitoring dashboards are built to refuse displaying any resource that arrives without a complete set of tags attached.
- **C.** Because chargeback, showback, budgets and orphan-hunting are all attribution questions before they are cost questions, and an untagged resource has no attributable owner.
- **D.** Because untagged resources are automatically billed by the provider at a higher per-unit rate than equivalent tagged ones.

**Answer: C.** Tagging is the enabling control beneath every other practice in this section: without it a bill is a list of service totals with no owner, and no per-team budget, chargeback, showback or orphan hunt is possible, because all four are attribution questions before they are cost questions.

- A is wrong: A budget can be scoped to an account or service with no tag involved at all; tagging refines scope, it does not gate whether a budget can be created.
- B is wrong: Monitoring dashboards display whatever inventory exists, tagged or not; a missing tag makes attribution harder, not the resource invisible to monitoring.
- D is wrong: Tags are metadata for attribution and carry no effect on the rate a resource is billed at; the cost impact of missing tags is entirely indirect.

### 56.

One team's spend is split across three separate cost-report lines because resources were labelled env, Env, and Environment interchangeably over time. What actually fixes this?

- **A.** A retrospective monthly sweep that merges whichever tag keys happen to appear that month.
- **B.** Three separate budgets, one scoped to each of the three key variants.
- **C.** Nothing needs to change, since cost-allocation reporting automatically recognises and merges near-identical tag keys on its own.
- **D.** A written tagging standard enforced at creation time, so one consistent key is used across the estate going forward.

**Answer: D.** Consistency is the entire game for tagging: env, Env and Environment are three unrelated keys that split one team's spend three ways, so a written standard enforced at creation time is far more reliable than a retrospective cleanup sweep.

- A is wrong: A retrospective sweep treats the symptom repeatedly rather than preventing new inconsistent keys from being created going forward.
- B is wrong: Three budgets working around the split is a workaround at the reporting layer, not a fix, and leaves the underlying attribution problem in place.
- C is wrong: Case and spelling variants are unrelated keys as far as the billing system is concerned; nothing merges them automatically, which is exactly why the split happened.

### 57.

A database instance runs at 4% CPU all month but is still serving live production queries. What is the correct action?

- **A.** Delete it, since a resource this underused has no purpose left.
- **B.** Leave it alone and let autoscaling shrink it automatically as load drops further.
- **C.** Detach and reattach its storage volume, since that resets the meter to reflect true utilisation.
- **D.** Resize it to a smaller instance and re-measure; the resource is wanted, only its size is wrong.

**Answer: D.** Rightsizing matches provisioned capacity to measured demand for a resource that is genuinely wanted, which distinguishes it from deletion, for a resource with no purpose left, and from autoscaling, which changes count rather than size.

- A is wrong: Deletion is for a resource with no purpose left; this one is actively serving production queries, so deleting it would remove something still in use.
- B is wrong: Autoscaling changes how many units run in response to live load; it does not resize a single provisioned unit's capacity, which is a deliberate periodic decision.
- C is wrong: Detaching and reattaching a volume changes nothing about billing, which is charged for provisioned capacity regardless of attachment state.

### 58.

A scenario describes capacity that grows and shrinks automatically, minute by minute, in direct response to live traffic. Which cost practice is actually being described?

- **A.** Rightsizing — some vendor guidance folds live scaling into it, so the minute-by-minute description still qualifies.
- **B.** Orphan cleanup — capacity changing shape usually means unused resources are being found and removed.
- **C.** A configured budget action, since thresholds can be set to add or remove capacity automatically.
- **D.** Autoscaling, the practice that changes how many units run automatically in response to live load.

**Answer: D.** Autoscaling changes how many units run, automatically and continuously, in response to live load. Rightsizing changes how big each unit is, as a deliberate periodic review, so a scenario describing traffic-driven capacity change is autoscaling regardless of the label a question uses.

- A is wrong: Rightsizing is a deliberate, periodic human decision about size; folding in automatic, continuous count changes is exactly the confusion this concept keeps separate for exam purposes.
- B is wrong: Orphan cleanup removes resources that serve no purpose at all; it does not describe capacity that is actively tracking live traffic.
- C is wrong: A budget action, when configured, typically denies further provisioning past a limit; it does not track live traffic minute by minute the way the scenario describes.

### 59.

A team collects one week of utilisation data that happens to exclude month-end close, then rightsizes a database down accordingly. What is the likely outcome?

- **A.** The database is undersized for the peak the observation window missed, turning the resize into a performance incident at month-end.
- **B.** Nothing goes wrong, since cost monitoring would have already caught any peak the exercise missed.
- **C.** The database automatically moves to a colder storage tier once it is resized.
- **D.** Sizing to one representative week of data is sufficient, since rightsizing is treated as a one-time project rather than an ongoing, iterative one.

**Answer: A.** The observation window is the part of rightsizing usually got wrong: a week that misses month-end close, payroll, or a seasonal campaign recommends a size that fails the first time those arrive, converting a cost problem into a performance incident.

- B is wrong: Monitoring reports spend and trend after the fact; it does not itself catch a flawed observation window before a resize decision is made from it.
- C is wrong: Storage tiering is a separate mechanism governing object storage cost classes and is not a consequence of resizing compute capacity.
- D is wrong: Rightsizing is iterative rather than a one-time project, because both the workload and the provider's instance catalogue keep changing — treating one week as sufficient is the trap.

### 60.

A team must decide both which storage type to use for a new dataset and which access tier to place it in. Which decision comes first, and why?

- **A.** Tier first — the intended access tier determines whether the data should be addressed as objects, as blocks, or as files, so the type follows from it.
- **B.** Neither first — both should be settled together, as a single combined rightsizing exercise covering compute capacity and storage placement alike.
- **C.** Order does not really matter here, since a tier change and a storage-type change are, in practice, about equally easy to reverse once the data is in place.
- **D.** Storage type first — tiers and lifecycle rules are features inside a service already chosen, and each service exposes its own API, so changing type later means migrating data and repointing applications.

**Answer: D.** The separating axis is which question is being answered: object, block and file storage names how data is addressed, decided first, while tiers and lifecycle policies name what it costs to keep and retrieve data already stored that way, decided after and revisited continuously.

- A is wrong: Tiers are a cost and access-latency class inside a storage service already chosen; they do not determine how data is addressed to begin with.
- B is wrong: Rightsizing is a compute-capacity practice about matching provisioned size to demand; storage type and tier are a separate decision pair with their own axis.
- C is wrong: A tier change or lifecycle rule keeps the data's address and interface intact, while a storage-type change moves it to a service with a different API and access protocol — the two are not equally reversible.

### 61.

A monitoring system needs to read a log file under a strict low-latency requirement. The file currently sits in the archive tier. What must happen before it can be read?

- **A.** Nothing — cost monitoring will surface and satisfy the read request automatically the moment it is made.
- **B.** Nothing beyond paying the ordinary egress charge for reading the file back out to wherever it is needed.
- **C.** It must be rehydrated to an online tier first, a process measured in hours, so archive is unsuitable for this requirement regardless of price.
- **D.** It can be read immediately, just more slowly than from the hot tier.

**Answer: C.** Archive is offline: a blob in archive cannot be read or modified until it has been rehydrated to an online tier, which takes hours. It is not merely a slower hot tier, so nothing with a latency requirement can be placed there regardless of price.

- A is wrong: Cost monitoring reports spend after the fact; it has no role in making an offline archived blob readable.
- B is wrong: An egress charge is a cost incurred by the read; it is not a substitute for the rehydration step archive requires before any read can occur at all.
- D is wrong: Archive is not simply a slower hot tier — it is offline, and no read succeeds at all until the rehydration step finishes.

### 62.

Data is moved to the archive tier to save money, then deleted after 45 days when the project is cancelled early, against a 180-day minimum retention period. What happens to the bill?

- **A.** An early deletion charge applies for the remaining 135 days, which can make the move cost more than leaving the data where it was.
- **B.** Nothing extra — early deletion charges are waived once a project is formally cancelled.
- **C.** The data becomes an orphan once the project ends, and is billed at whatever rate applies to orphaned resources until someone notices.
- **D.** The bill simply stops, since deleting data always ends its charges immediately.

**Answer: A.** Each transition is a billable operation, and moving data into a colder tier starts a minimum-retention clock: deleting or promoting the data before that clock expires incurs the remaining days as an early deletion charge, which is why aggressive tiering can raise rather than lower the bill.

- B is wrong: No exception for project cancellation is documented; the retention clock runs to term regardless of the business reason the data is being removed.
- C is wrong: An orphan is a resource with no purpose left and carries no separate billing rate of its own; this data's issue is a specific early deletion charge, not orphan status.
- D is wrong: Each transition and deletion is itself a billable event under a minimum-retention tier; deleting archived data early adds a charge rather than simply ending one.

### 63.

A comparison sets a monthly cloud bill against an on-premises server's purchase price alone, and concludes cloud is more expensive. What is missing from the on-premises side of that comparison?

- **A.** Nothing — CapEx and OpEx figures are already directly comparable numbers.
- **B.** Staffing, power and cooling, floor space, and the hardware-refresh cost that a bare purchase price omits.
- **C.** A budget threshold that would have flagged the discrepancy automatically.
- **D.** Nothing is missing at all; a server's purchase price already represents the entire cost of owning and running it.

**Answer: B.** Total cost of ownership is the full cost of delivering a capability, not just the invoice or sticker price. A comparison that sets a cloud bill against a bare purchase price is a TCO error because it drops the staffing, power and hardware-refresh costs the on-premises side still carries.

- A is wrong: CapEx and OpEx are different accounting treatments of spend, not a substitute for costing the full set of expenses on each side of a comparison.
- C is wrong: A budget alert notifies when spend already crosses a configured threshold; it does not supply missing cost categories in a one-off comparison exercise.
- D is wrong: This is precisely the error total cost of ownership exists to catch: a purchase price silently drops staffing, power and refresh costs that only one side of the comparison carries.

### 64.

A company virtualizes its entire datacentre and now runs several hundred VMs, but any new VM still requires a ticket a human approves within two working days. Business units are billed a flat internal rate regardless of how much they use. Is this cloud computing?

- **A.** Yes — running many isolated VMs on shared physical hosts is the resource pooling NIST asks for, and pooling is the characteristic that decides the question.
- **B.** No, because NIST reserves the term for infrastructure a cloud provider owns, and hardware a company bought for itself can never qualify.
- **C.** No. Without on-demand self-service and measured service, virtualizing the hardware alone does not satisfy NIST's definition.
- **D.** Yes — billing business units for what they use is measured service, and measured service is the characteristic the definition actually turns on.

**Answer: C.** NIST SP 800-145 requires all five essential characteristics before an environment counts as cloud computing. Here, provisioning needs a two-day human approval (no on-demand self-service) and billing is a flat rate rather than metered usage (no measured service). Virtualization is the enabling technology beneath many clouds, but its presence alone — without the self-service, elastic, metered delivery model — does not make an environment a cloud.

- A is wrong: Pooling VMs on shared hosts is virtualization, the enabling technology; NIST requires all five characteristics, and self-service and metering both fail here.
- B is wrong: Ownership decides nothing here — a self-service, metered private cloud on owned hardware still qualifies; this environment fails on process, not ownership.
- D is wrong: Internal chargeback is not the same as usage-based metering, and neither substitutes for the self-service and elasticity NIST requires.

### 65.

A team argues: 'This offering can't be cloud computing because there is no virtual machine involved — customers only invoke short-lived functions and are billed per invocation.' Is the team's reasoning correct?

- **A.** Yes — without virtualization creating an isolated VM per customer, there is no resource pooling and therefore no cloud, since pooling is the one characteristic that cannot be met any other way.
- **B.** Yes — function-based per-invocation billing is a serverless pricing pattern rather than cloud computing in NIST's sense.
- **C.** No, but only because the provider also happens to offer a separate IaaS product alongside the function service.
- **D.** No — NIST's definition does not require a VM; bare-metal instances, containers and functions are all valid cloud services as long as the five characteristics hold.

**Answer: D.** Cloud computing is a delivery model, not a technology, and nothing in NIST's definition names virtualization, containers or any particular vendor. Bare-metal instances, containers and functions are all cloud services in their own right provided the five characteristics — on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service — hold. Requiring a VM is exactly the false equivalence the guide warns against, just approached from the opposite direction.

- A is wrong: Resource pooling does not require a customer-facing VM; a provider can pool bare-metal or container capacity just as well.
- B is wrong: Serverless and FaaS are themselves cloud service categories; billing per invocation is measured service in action, not evidence against being cloud.
- C is wrong: Whether IaaS is also offered is irrelevant; the function service qualifies or fails on its own characteristics, not by association with another offering.

### 66.

A hospital builds a private, self-service platform on its own hardware: clinical teams provision virtual capacity instantly through a portal, usage is metered per department, and capacity scales automatically with load. An auditor claims 'this can't be cloud computing — the hospital owns the hardware.' Evaluate the claim.

- **A.** The claim is right, because true cloud computing requires a third-party provider operating shared, virtualized infrastructure.
- **B.** The claim is wrong — cloud computing is defined by the delivery model, not by who owns the underlying hardware, and this platform meets the essential characteristics.
- **C.** The claim is right, because only public cloud infrastructure counts under NIST's model, and a platform confined to one hospital's own staff is not public by any reading.
- **D.** The claim is right, because on-premises hardware can never be billed by consumption — only depreciated as a capital asset over its service life.

**Answer: B.** Cloud is a way of selling and consuming capacity, not a statement about who owns the building or the racks. A private cloud run by the organisation itself on its own hardware still satisfies NIST's definition provided the five essential characteristics — including self-service, elasticity and measured service — actually hold, exactly as this hospital's platform does.

- A is wrong: Virtualization and third-party operation are common, not required; a private cloud on owned hardware satisfies the same definition.
- C is wrong: NIST names private cloud as one of its own deployment models; it is not excluded from being cloud computing.
- D is wrong: Metering is a property of how usage is tracked and charged, not of where the hardware physically sits.

### 67.

Are actions taken through a cloud provider's web console audit-logged the same way as actions taken through its CLI or API?

- **A.** No — console actions leave no record at all, which is precisely why infrastructure as code is treated as the more auditable approach.
- **B.** Yes, but only if the customer explicitly enables logging for the console specifically, since browser sessions sit outside the API audit path by default.
- **C.** Yes: on the major providers, console actions are logged by default alongside CLI, SDK and API actions; what the console lacks is a reviewable artifact, not an audit trail.
- **D.** No, because only infrastructure-as-code changes are recorded as auditable events, the provider logging the plan a tool applies rather than the underlying call.

**Answer: C.** AWS CloudTrail records actions taken by a user, role or service, explicitly including actions in the Management Console as well as the CLI, SDKs and APIs, with 90 days of Event history available automatically; Azure and Google Cloud provide equivalent always-on logging. Console work is therefore recorded — what it lacks is an artifact you can review before it runs, re-run identically, or diff against a prior state.

- A is wrong: This is the routine misstatement the guide corrects: console work is recorded by default; what it lacks is an artifact you can review before it runs, re-run identically, or diff against last week.
- B is wrong: Baseline audit logging on the major providers is on without configuration — CloudTrail Event history is available as soon as an account is created, and Azure Monitor 'collects activity log entries by default with no required configuration' — and the console is a client of the same API, not a separate path.
- D is wrong: All four interfaces are clients of the same API and are logged the same way; infrastructure as code's advantage is a declarative artifact to review, not exclusive access to audit logging.

### 68.

A resource is deleted by hand through the web console, and a week later nobody can reconstruct exactly what state existed before the change or reproduce the fix reliably. What property of infrastructure as code, missing from the console, would have prevented this?

- **A.** Being audit-logged, since the console action itself left no record of who made the change or when, provider audit logs covering only calls made through the API.
- **B.** Being reachable over the network — the console requires an interactive browser session rather than the scriptable connection a recovery process could re-run.
- **C.** A declarative statement of desired state held in version control, reviewable before it is applied and comparable against reality so drift can be detected and corrected.
- **D.** Running under the shared responsibility model, which the console is exempt from because interactive changes fall outside the provider's side of the security boundary.

**Answer: C.** The CLI and API are imperative — a script states an action to take, not a state that should exist — so even they offer no guaranteed baseline to compare against. Infrastructure as code adds a declarative desired state held in version control: reviewable before applying, re-runnable identically, and comparable against live reality so that drift, including an unreviewed console deletion, can be detected and corrected.

- A is wrong: The console action would have been recorded by the provider's default audit logging just as thoroughly as a CLI or API call; the missing property is a reviewable, re-runnable artifact, not a log entry.
- B is wrong: Network reachability is unrelated to the problem described; both the console and infrastructure as code operate over the network, and reachability was never in question.
- D is wrong: The shared responsibility model applies uniformly regardless of which interface makes a change; it has no bearing on whether a change is reviewable or reproducible.

### 69.

AWS's prescriptive guidance names seven migration strategies, the '7 Rs.' Which term does AWS actually use for replacing an application with a different product, typically SaaS, rather than migrating the existing one?

- **A.** Replace — the customer swaps the application for a different product entirely.
- **B.** Relocate — the workload moves to the cloud without changing its architecture.
- **C.** Refactor — the application is rebuilt around cloud-native patterns.
- **D.** Repurchase — also called drop and shop.

**Answer: D.** AWS's prescriptive guidance names the seven strategies as retire, retain, rehost, relocate, repurchase, replatform, and refactor or re-architect. Repurchase — sometimes called drop and shop — is specifically the strategy of replacing an application with a different product or version, typically SaaS; 'replace' is not the term AWS uses, and this guide corrects that exact error.

- A is wrong: 'Replace' is not one of the seven strategies AWS names; the strategy for swapping an application for a different product is repurchase, which AWS also calls drop and shop.
- B is wrong: Relocate specifically leaves the application's architecture untouched; it does not involve swapping the application for a different product.
- C is wrong: Refactor rebuilds the existing application for the cloud; it does not describe dropping the application in favour of a different product.

### 70.

A large migration programme deliberately avoids refactoring any application during the move itself, planning to modernise afterward instead. Which strategies does AWS recommend favouring during the migration, and why not refactor now?

- **A.** Repurchase alone should be used for every application, since it is the fastest of the seven strategies and the only one that leaves nothing running in the source environment.
- **B.** Rehost, replatform, relocate and retire are the common strategies for large migrations; refactoring during the move is the most complex and costly strategy and is hard to manage across many applications at once.
- **C.** Refactor should still be used first, since it is the strategy AWS calls the quickest way to migrate and operate in the cloud, the architecture then only being rebuilt once.
- **D.** Retain and retire should never appear in a large migration plan, since every application must eventually move to the cloud and a portfolio assessment only decides the order in which they are moved.

**Answer: B.** AWS notes that common strategies for large migrations are rehost, replatform, relocate and retire, and recommends against refactoring during the migration itself, since modernising while moving is the most complex option and hard to manage across many applications — the recommended sequence is to migrate cheaply first with one of the low-effort strategies, then modernise afterward once the workload is safely running in the cloud.

- A is wrong: AWS names relocate, not repurchase, as the quickest strategy, and using one strategy for every application ignores that each workload is assessed and assigned individually.
- C is wrong: AWS reserves 'quickest' for relocate specifically, because it leaves the application's architecture untouched; refactor is the strategy AWS calls the most complex and costly, the opposite of quick.
- D is wrong: AWS lists retire and retain as legitimate strategies in their own right; a portfolio assessment that retires an unused application or retains one with a hardware dependency avoids unnecessary migration cost entirely.

### 71.

A platform team must place three workloads: a vendor appliance shipped only as a Windows disk image on an all-Linux estate; a stateless HTTP service redeployed forty times a day; and a workload processing another customer's regulated data where the strongest available isolation boundary is required. Match each to a container or a VM, and identify the one common thread underneath all three.

- **A.** The appliance and the regulated workload need VMs, for a foreign kernel and the strongest isolation boundary respectively, while the HTTP service is a good fit for containers; underneath all three, even the containerised one, sits a hypervisor the platform team never manages directly.
- **B.** All three should run as VMs, since a foreign OS kernel and strong isolation are both container limitations that only VMs solve, and a stateless service redeployed many times a day gains nothing measurable from a container's faster start or its higher density on one host.
- **C.** The HTTP service running in containers means no virtual machines are involved anywhere in this platform — a managed container service schedules containers straight onto bare-metal hosts the provider owns.
- **D.** The regulated workload should be containerised specifically because containers isolate more strongly than virtual machines, since one shared kernel enforces separation in a single place rather than across many guest kernels.

**Answer: A.** The Windows appliance needs its own kernel, which only a VM supplies; the regulated workload needs the strongest boundary available, which is a VM's own kernel rather than a shared one; the frequently redeployed stateless service benefits from a container's start time and density, with no foreign-kernel or heightened-isolation requirement working against it. All three still sit on a type 1 hypervisor the provider operates, whether or not the workload itself is containerised.

- B is wrong: The HTTP service has no foreign-kernel or heightened-isolation requirement; forcing it onto a VM gains nothing and gives up the start-time and density advantage a stateless, frequently redeployed service benefits from.
- C is wrong: On a managed platform, containers still run atop provider-operated virtual machines; choosing containers does not remove virtualization from the picture, only from what the team administers directly.
- D is wrong: This reverses the actual isolation ordering; a shared host kernel gives containers a weaker boundary than a VM's own kernel, which is exactly why the regulated workload calls for a VM instead.

### 72.

A team says 'containers are lightweight, so we should containerise everything and stop paying for virtual machines.' What mechanism does that slogan skip over?

- **A.** The isolation cost — because containers share the host kernel, a kernel-level flaw has a blast radius covering every container on that host, which the slogan does not price in.
- **B.** The mechanism it skips is that containers cannot run on shared physical hardware, unlike virtual machines, so the density the slogan claims is only ever available from a hypervisor.
- **C.** It skips over the fact that containers are always more expensive per workload than virtual machines — each container image carries a full copy of the operating system it needs to boot.
- **D.** It skips over the fact that virtual machines cannot run on public cloud infrastructure at all, so the choice only arises for teams still running their own datacentre.

**Answer: A.** 'Lightweight' describes density and start time honestly, but it says nothing about the isolation boundary being given up: because the kernel is shared, administrators must constrain memory and CPU so one container cannot starve the rest, and a kernel-level compromise is not contained the way it would be inside a VM's own kernel. Picking containers for everything trades that boundary away without pricing the trade.

- B is wrong: Containers run on shared hardware routinely, and that density is the whole basis for the slogan; the actual gap is the isolation cost, not a hardware-sharing limitation.
- C is wrong: Containers typically cost less per workload precisely because the operating system overhead is shared rather than duplicated, and a container image packages the files a process needs rather than an operating system to boot.
- D is wrong: Virtual machines are the canonical IaaS product on every public cloud platform; nothing about the container-versus-VM choice excludes VMs from cloud infrastructure.

### 73.

What does the named comparison 'container vs virtual machine' refer to, as distinct from the concept 'virtual machine' on its own?

- **A.** They are the same concept under two names, since every virtual machine question is really a container-versus-VM question about which of the two technologies to select, and the two phrases are used interchangeably in practice.
- **B.** The comparison names a specific orchestration tool used to run containers on top of virtual machines, in the way a scheduler places workloads across a pool of hosts.
- **C.** The comparison applies only to on-premises infrastructure, while 'virtual machine' applies only to cloud infrastructure, so the two terms never appear in the same discussion.
- **D.** It names the selection decision between two isolation technologies — which one to use for a given requirement — while 'virtual machine' names one of the two concrete things being selected between.

**Answer: D.** 'Container vs virtual machine' names the requirements-to-choice decision itself — an axis, not a thing you can create. 'Virtual machine' names one of the two concrete options inside that decision, the kind of entity a definition or responsibility-boundary question would ask about directly. The same relationship holds between any comparison and either of its members.

- A is wrong: A question can ask purely 'what is a virtual machine' or 'who patches it' with no container involved at all; the comparison specifically concerns the choice between the two technologies.
- B is wrong: No orchestration tool is implied by either term; the comparison is a conceptual selection decision, not a piece of named software.
- C is wrong: Neither term is restricted to one setting — virtual machines and the choice between them and containers both apply equally on-premises and in the cloud.

### 74.

Which five properties does NIST SP 800-145 require before an environment counts as cloud computing?

- **A.** On-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service.
- **B.** On-demand self-service, broad network access, multi-tenancy, rapid elasticity, and pay-as-you-go billing.
- **C.** On-demand self-service, virtualization, resource pooling, rapid elasticity, and high availability.
- **D.** Broad network access, resource pooling, rapid elasticity, measured service, and vendor neutrality.

**Answer: A.** NIST SP 800-145 defines cloud computing through exactly five essential characteristics: on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service. Plausible-sounding substitutes — multi-tenancy, pay-as-you-go, virtualization, high availability — are each real, but none of them is one of the five itself.

- B is wrong: Multi-tenancy and pay-as-you-go are real properties, but NIST folds them inside resource pooling and measured service rather than listing them as separate characteristics.
- C is wrong: Virtualization and high availability are not among NIST's five; virtualization is an enabling technology and high availability is a design goal, not a defining characteristic.
- D is wrong: Vendor neutrality is not one of NIST's five characteristics at all, and this list also drops on-demand self-service entirely.

### 75.

An autoscaling group adds instances under load on Friday afternoon and removes them again over the weekend when traffic drops. Which essential characteristic does the weekend shrink specifically demonstrate?

- **A.** Measured service — the bill only reflects instances actually running over the weekend.
- **B.** On-demand self-service — the system responds to demand without a human placing a request.
- **C.** Rapid elasticity, since capacity scales inward as well as outward to match demand.
- **D.** Resource pooling — many customers share the underlying hardware the instances run on.

**Answer: C.** Rapid elasticity is often summarised as scaling up, but NIST's definition is symmetric: capacity must scale outward and inward to match demand. The autoscaling group growing on Friday and shrinking over the weekend is elasticity working in both directions, and the shrink is what lets measured service produce a smaller bill — a downstream effect, not the characteristic itself.

- A is wrong: That describes the billing consequence of running fewer instances, not the scaling behaviour itself, which is what the question asks about.
- B is wrong: Autoscaling does act without human intervention, but the property being tested here is the inward-and-outward scaling itself, not who or what triggers it.
- D is wrong: Pooling explains why the capacity exists to be requested at all, but it does not describe the scaling behaviour the weekend shrink illustrates.

### 76.

A company keeps regulated data in its own self-service, metered private cloud and bursts overflow batch processing into a public provider, joined by a private network link, shared identity and a common deployment pipeline so workloads can move between the two. Does this qualify as hybrid cloud under NIST, and what would be missing if the connective tissue were removed?

- **A.** Yes. Both parts are themselves clouds and are bound together by technology enabling data and application portability, which is exactly NIST's two-part test; without the connective tissue, it would be two separate estates rather than one hybrid cloud.
- **B.** No — using more than one deployment model at once is what defines multi-cloud, not hybrid cloud, and hybrid is reserved for two providers of the same kind.
- **C.** Yes, and the network link and shared identity are incidental details — placing workloads in two different clouds is sufficient on its own, whatever technology joins them, since NIST's composition clause is descriptive rather than a test of its own.
- **D.** No — hybrid cloud requires a public cloud and a community cloud specifically, not a private and a public cloud, which NIST classes as something else.

**Answer: A.** NIST's hybrid cloud definition has two conditions that must both hold: the components must each be a distinct cloud infrastructure, and they must remain bound together by technology enabling data and application portability between them, with cloud bursting given as the worked example. This scenario states both explicitly, and removing the network link, identity plane and deployment pipeline would strip out exactly the binding condition, leaving two separate estates rather than a hybrid cloud.

- B is wrong: This inverts the two terms: multi-cloud varies the vendor, usually within one deployment model; hybrid varies the deployment model and, unlike multi-cloud, requires the parts to be bound together.
- C is wrong: Placement alone is not sufficient; NIST's binding condition is a separate requirement, and removing the connective tissue would leave two separate estates rather than a hybrid cloud.
- D is wrong: NIST's composition may combine any of private, community or public; a private-plus-public pairing, as described here, is a valid and common hybrid arrangement.

### 77.

A retailer runs production on a public provider and keeps a completely separate analytics environment on a second public provider, with no network link, no shared identity and no data movement between them. Is this hybrid cloud?

- **A.** No — this is multi-cloud only, since no private or community cloud is involved and nothing binds the two providers together.
- **B.** Yes — using two different cloud providers for two different workloads is exactly what hybrid cloud means in everyday industry usage.
- **C.** Yes, because multi-cloud arrangements automatically qualify as hybrid once a second provider is added.
- **D.** No, because neither environment is a private cloud, and hybrid requires at least one private cloud specifically.

**Answer: A.** Two public providers running unrelated workloads with no link, shared identity or data portability between them satisfy the definition of multi-cloud and nothing about hybrid: no private or community cloud is involved, and there is no binding technology joining the parts. The industry often calls arrangements like this hybrid loosely, but NIST's stricter reading is what the exam expects.

- B is wrong: That is the loose industry usage the guide warns against; the exam-safe reading is NIST's stricter one, which this arrangement fails on both conditions.
- C is wrong: Adding a second public provider is the definition of multi-cloud, not a route into hybrid; hybrid needs a mix of deployment models and a binding condition that multi-cloud does not supply.
- D is wrong: NIST's composition allows private, community or public in any mix of two or more; the actual missing ingredient here is the binding condition, not the absence of a private cloud in particular.

### 78.

An engineer proposes calling an architecture 'hybrid cloud' because it uses both a self-hosted Kubernetes cluster — with no self-service provisioning, no metering and manual capacity planning — and a public cloud provider, connected by a VPN. Is the label accurate?

- **A.** No. The self-hosted cluster is not itself a cloud, since it lacks the essential characteristics such as self-service and metering, so there is only one cloud infrastructure in this picture, not the two or more NIST's composition requires.
- **B.** Yes — connecting any on-premises infrastructure to a public cloud by VPN is what makes an architecture hybrid, whatever the on-premises side is capable of, and the VPN supplies the standardised technology the definition asks for.
- **C.** Yes, and this is better described as multi-cloud specifically, since two distinct platforms are involved and each is administered separately.
- **D.** Yes, because Kubernetes provides the portability layer NIST's binding condition requires — and that condition is the only one the definition imposes.

**Answer: A.** Hybrid cloud requires two or more distinct cloud infrastructures, and 'cloud infrastructure' still means something meeting the essential characteristics — self-service, elasticity, metering. A self-hosted cluster with manual capacity planning and no metering is not itself a cloud, so pairing it with a public provider over a VPN produces one cloud and one non-cloud datacentre, not a hybrid composition.

- B is wrong: A VPN link supplies connectivity, not the essential characteristics; the on-premises side must itself be a cloud before the composition can be hybrid.
- C is wrong: Multi-cloud describes using more than one public provider; a self-hosted, non-cloud cluster paired with one public provider is neither hybrid nor multi-cloud as NIST or the industry uses either term.
- D is wrong: Portability tooling can help satisfy the binding condition once both sides are already clouds, but it does nothing to fix the on-premises side's failure to meet the essential characteristics in the first place.

### 79.

A systems engineer must classify Linux KVM as type 1 or type 2. It runs as a module inside the Linux kernel, and a full Linux userland runs alongside it on the same machine. Which classification is correct, and why does the userland not change the answer?

- **A.** Type 2 — since a full conventional operating system userland is present, KVM must be running as an application on top of it, in the same way VirtualBox runs as an ordinary desktop program.
- **B.** Neither — KVM is a virtualization technique rather than a hypervisor product, so the type 1 / type 2 split does not apply to it at all.
- **C.** Type 1, but only because KVM happens to run on cloud provider hardware rather than a desktop, where the same kernel module would instead be classified as type 2.
- **D.** Type 1: the kernel module makes the Linux kernel itself the hypervisor, and it is classified as type 1 despite the full userland running alongside it.

**Answer: D.** KVM is a module inside the Linux kernel, which makes the kernel itself the hypervisor — the lowest software layer scheduling VM resources directly against hardware, exactly what type 1 means. Vendors classify it as type 1 even though a full Linux userland runs alongside it, because that userland does not sit beneath KVM the way a host OS sits beneath a type 2 hypervisor like VirtualBox.

- A is wrong: The presence of a userland is exactly the distractor the guide warns about; what decides the type is whether the hypervisor is the lowest software layer, and as a kernel module, KVM is.
- B is wrong: KVM is a specific hypervisor implementation, and Red Hat names it alongside Hyper-V and vSphere as an example of a type 1 hypervisor; virtualization is the broader capability, and type 1 versus type 2 classifies hypervisors specifically, which KVM is.
- C is wrong: Where KVM is deployed is irrelevant to its classification; the deciding fact is that the kernel module makes the kernel itself the hypervisor, whether on a desktop or in a datacentre.

### 80.

A developer runs VMware Workstation on a Windows laptop to test a Linux VM alongside their normal desktop applications. Is this a type 1 or type 2 arrangement, and how does it compare to VMware Fusion?

- **A.** Type 2, and therefore an outdated or insecure choice compared to the type 1 hypervisors cloud providers use, which is why hosted hypervisors are no longer shipped for current desktop operating systems.
- **B.** Type 1 — running VMs alongside desktop applications still counts as bare-metal virtualization, since the hypervisor schedules VM resources straight onto the hardware with no host operating system in the path.
- **C.** Type 2, because the hypervisor runs as an application on the conventional host OS; Workstation is the same class of product as Fusion, just on Windows and Linux instead of macOS.
- **D.** Type 2, but unrelated to Fusion — Fusion runs virtual machines using a fundamentally different mechanism, replacing macOS at boot rather than running on top of it.

**Answer: C.** VMware Workstation runs as an application atop a conventional operating system, the definition of a type 2, hosted hypervisor — and it is the equivalent product to VMware Fusion, just on Windows and Linux rather than macOS, the same class of software chosen for coexisting with a normal desktop rather than for production datacentre use.

- A is wrong: Type 2 is the developer-workstation kind, chosen because it coexists with a normal desktop — it is not 'the old kind' or 'the insecure kind', and hosted hypervisors are still shipped and supported for current desktops.
- B is wrong: Bare-metal specifically means no intervening host OS; here Workstation runs as an application on top of Windows, which is the defining feature of type 2, not type 1.
- D is wrong: Fusion is the macOS counterpart of Workstation and runs as an application on the installed host operating system, which is what makes a hypervisor type 2; it does not replace the host OS at boot, and the mechanism differs only in which host OS each product targets.

### 81.

Why do cloud providers and enterprise datacentres run type 1 hypervisors such as ESXi or Hyper-V rather than type 2 products such as VirtualBox?

- **A.** Because type 1 hypervisors are simply newer technology than type 2 hypervisors — the hosted products that came before them are no longer maintained by their vendors.
- **B.** Because type 1 hypervisors provide virtualization while type 2 hypervisors do not virtualize hardware at all, offering only the process-level isolation a container runtime provides.
- **C.** Because type 1 hypervisors are required to run containers, which type 2 hypervisors cannot host, so a container platform can never be tested on a developer's laptop.
- **D.** A type 1 hypervisor runs directly on the hardware in place of a host OS, avoiding the extra host-OS layer that type 2 adds, which costs performance and adds a second component that can crash.

**Answer: D.** A type 1 hypervisor is itself the lowest software layer, scheduling VM resources straight to the hardware; a type 2 hypervisor runs as an application on a conventional host OS, which schedules against the hardware in turn. That extra layer in type 2 costs performance and adds a second piece of software that can fail, which is exactly why production cloud and enterprise infrastructure standardises on type 1.

- A is wrong: Age is not the distinction; both types are in active, current use and both are actively maintained, chosen for different situations rather than one superseding the other.
- B is wrong: Both types virtualize hardware and present guests with virtual CPU, memory, disk and network devices; the difference is what sits underneath the hypervisor, and neither type is a process-isolation mechanism.
- C is wrong: Either type of hypervisor can host VMs that in turn run containers; container support has no bearing on the type 1 versus type 2 choice.

### 82.

Two teams each rent capacity from the same provider. Team A installs and patches its own guest operating system on a rented virtual machine. Team B pushes an application build and selects a supported runtime version, with the provider patching the OS beneath it. Which model is Team A using, and what is the deciding boundary against Team B's model?

- **A.** Team A is using PaaS; the boundary is who chooses the runtime version, which is the one decision the provider never delegates.
- **B.** Team A is using IaaS; the boundary is which team is billed per second rather than per month, since only IaaS meters at second granularity.
- **C.** Team A is using IaaS; the boundary is who owns the operating system, which IaaS leaves to the customer, while Team B's model puts it below the provider's line.
- **D.** Team A is using IaaS; the boundary is that Team B's workload runs as a container, which is what makes an offering PaaS rather than IaaS.

**Answer: C.** IaaS gives the customer fundamental resources — compute, storage, network — and leaves the guest operating system, from the boot loader upward, entirely to them: the same patch cadence and the same responsibility as a physical server. PaaS moves that OS-and-runtime ownership beneath the provider's line, which is the single boundary the guide identifies as separating the two models.

- A is wrong: This swaps the two models — installing and patching your own guest OS is IaaS, and runtime choice is a PaaS-level concern, not what separates A from B here.
- B is wrong: Billing granularity is an implementation detail of either model and is not the responsibility boundary the scenario is testing.
- D is wrong: Nothing in the scenario mentions containers, and PaaS is defined by the deployment relationship, not by any particular packaging technology.

### 83.

A critical kernel security patch is released. On a rented IaaS virtual machine, whose job is it to apply it?

- **A.** The provider's — because they operate the underlying infrastructure, patching runs all the way up through the guest operating system.
- **B.** Whichever party originally enabled automatic OS updates on the instance — enabling them transfers patching duty to the provider.
- **C.** The customer's — the provider's responsibility under IaaS stops at the virtualization layer and host operating system.
- **D.** Neither — under IaaS the runtime is patched automatically by the platform, so no kernel patching is needed.

**Answer: C.** Renting a virtual machine does not rent an administered one. From the guest OS boot loader upward the machine behaves exactly like a server in a rack, so kernel patching, host firewall rules and application configuration remain the customer's work — the misconception that the provider covers this is the source of most wrong answers on shared responsibility questions.

- A is wrong: AWS's shared responsibility model puts the host operating system and virtualization layer on the provider and the guest operating system, 'including updates and security patches', on the customer.
- B is wrong: Enabling auto-updates is a customer configuration choice made within their own responsibility, not a transfer of that responsibility to the provider.
- D is wrong: Automatic runtime patching describes PaaS; an IaaS instance is a raw building block with no such platform-managed runtime layer.

### 84.

A team provisions a virtual network and a set of block storage volumes from a provider, without touching any compute instance yet. Is this still an IaaS activity?

- **A.** No — without a running virtual machine there is no IaaS resource in use yet, since the virtual machine is the only genuine IaaS product.
- **B.** No — provisioning storage and networking without deploying application code is a PaaS-level activity.
- **C.** Yes, but only if the team also attaches a managed database to the network, since IaaS requires at least one managed component.
- **D.** Yes — IaaS covers fundamental computing resources broadly, including virtual networks and storage volumes, not only virtual machines.

**Answer: D.** A virtual machine is the canonical IaaS product, but IaaS also covers block storage volumes and virtual networks provisioned as raw building blocks the customer assembles themselves. A question about provisioning a virtual network, with no VM yet involved, is still an IaaS question for exactly that reason.

- A is wrong: A virtual machine is the most familiar IaaS product, but the guide is explicit that provisioning a virtual network is still an IaaS question, not a non-answer.
- B is wrong: PaaS is defined by deploying application code onto a managed platform; raw storage and network provisioning with no application involved is squarely IaaS.
- C is wrong: Attaching a managed database would make that specific component a managed service, but it has no bearing on whether the storage and network provisioning itself counts as IaaS.

### 85.

Amazon S3, Azure Blob Storage and Google Cloud Storage are vendor names for which underlying service category?

- **A.** Block storage, the category backing virtual machine boot disks.
- **B.** Managed relational database, the category behind SQL-compatible engines.
- **C.** Identity and access management, the category behind users, roles and policies.
- **D.** Object storage, the category behind buckets and HTTP-addressable blobs.

**Answer: D.** The three hyperscalers sell a close to one-to-one mapping of service categories under different brand names. Amazon S3, Azure Blob Storage and Cloud Storage are each the provider's object storage product — recognising the category behind an unfamiliar vendor name is the reasonable expectation the exam sets, not memorising pricing or console navigation.

- A is wrong: The block-storage equivalents are Amazon EBS, Azure managed disks and Google Persistent Disk — a different product line entirely.
- B is wrong: The managed database equivalents are Amazon RDS, Azure SQL Database and Cloud SQL, not these three products.
- C is wrong: The identity equivalents are AWS IAM, Microsoft Entra ID and Google Cloud IAM, which none of the three named products provide.

### 86.

A question describes a fictional offering as 'a region-internal fault domain with its own independent power, cooling and networking' without naming a vendor. Which infrastructure unit is this describing?

- **A.** A region — the provider's overall geographic footprint, and the smallest unit with its own independent power and cooling.
- **B.** An availability zone, which is AWS's and Azure's shared name for an isolated datacentre grouping within a region.
- **C.** A hyperscaler — one of the three major public cloud providers, each of which operates exactly one such fault domain per region.
- **D.** A private cloud, since dedicated power, cooling and networking imply infrastructure reserved for a single customer.

**Answer: B.** The exam is vendor-neutral in its wording but expects the candidate to recognise the category or unit being described. 'A region-internal fault domain with independent power, cooling and networking' is precisely how availability zones are defined across providers, whatever brand name a specific question attaches to it.

- A is wrong: A region is the broader geographic area; the description is of one isolated fault domain inside it, and independent power and cooling belong to that zone, not to the region.
- C is wrong: Hyperscaler names the class of company, not a unit of datacentre infrastructure, and a region routinely contains several such zones.
- D is wrong: Nothing in the description restricts use to one customer; isolation of power and networking is about fault domains, not exclusivity of tenancy.

### 87.

A team connects to a provider-operated relational database through its normal wire protocol, configuring schema, indexes and access grants, but deploying no application code onto the database itself. Is this PaaS, and what is the deciding fact?

- **A.** No — it is a managed service; the deciding fact is whose code is running, and nothing of the team's is deployed onto the database.
- **B.** Yes — since the provider handles installation, patching and scaling, this meets the definition of PaaS regardless of what is deployed.
- **C.** No, because managed services are never provider-operated components, only self-hosted ones the customer configures remotely.
- **D.** Yes, because NIST SP 800-145 names managed services as a fourth service model alongside IaaS, PaaS and SaaS.

**Answer: A.** Managed services and PaaS both take significant operational work off the customer, but PaaS is defined by the consumer deploying an application they wrote or acquired, while a managed service is a standard component — a database, queue or cache — the provider installs, patches and operates, that the consumer merely configures and uses through its ordinary interface. Nothing of the team's is deployed onto the database in this scenario, which settles it as a managed service.

- B is wrong: Provider-managed operations are common to both models; what makes PaaS specifically PaaS is the deployed application artifact, which is absent here.
- C is wrong: This gets the definition backwards — a managed service is precisely a provider-operated component; what stays with the customer is configuration, schema and data, not operation of the component itself.
- D is wrong: NIST does not define managed services as a service model at all; it is a consumption pattern that fits within the same consumer/provider control split NIST documents for IaaS, PaaS and SaaS.

### 88.

An application built on a managed database experiences repeated slow queries caused by a missing index. The team assumes the provider will fix it since the database is 'managed.' Is that assumption correct?

- **A.** Yes — 'managed' means the provider assumes full responsibility for the database's behaviour, including the performance of the queries it runs and the indexes chosen to support them.
- **B.** Yes, because managed services provide the same automatic runtime optimisation PaaS platforms apply to deployed code.
- **C.** No, because this is actually a shared responsibility model failure specific to IaaS, not to managed services.
- **D.** No — 'managed' takes over installation, patching, backup mechanics and failover, but schema design, indexes and query efficiency remain the customer's responsibility.

**Answer: D.** A managed service trades configuration control for a large reduction in operational work, but it does not remove all responsibility: the provider installs, patches, backs up and monitors the component, while schema design, indexes, queries, data and access grants stay with the customer. A missing index causing slow queries is exactly the kind of failure the provider will not fix, because it is a decision the customer made, not an operational fault of the component.

- A is wrong: This is the misconception the guide corrects directly: managed does not mean no responsibility, and query and schema performance stay with whoever designed them.
- B is wrong: PaaS platforms manage the runtime executing a deployed application; a managed database has no deployed application code to optimise, and query efficiency is a schema and query design concern the customer owns.
- C is wrong: IaaS is not involved here; the scenario is squarely about a managed database, where operational maintenance is the provider's and data-model decisions like indexing remain the customer's.

### 89.

A provider deprecates the major version of a managed database a team has relied on for years, forcing an upgrade on a fixed timetable the team did not choose. Does this contradict the definition of a managed service?

- **A.** Yes — a genuinely managed service never imposes an unplanned change, so version timing remains under the customer's control throughout, exactly as it does on a self-managed installation the team patches on its own schedule.
- **B.** Yes, because forced runtime upgrades are a PaaS-specific behaviour that should never occur with a managed service — the provider operates only the version the customer selected.
- **C.** No — losing control over the timing of a forced version upgrade is part of the trade a managed service makes; the customer keeps schema and data control but loses root and the ability to hold a retired version.
- **D.** No, but only because this database should have been run as IaaS instead, where version timing stays with the customer and no maintenance window applies.

**Answer: C.** Trading configuration control for reduced operational burden is the definition of a managed service, and losing root — including the timing of forced version upgrades when the provider deprecates an old one — is exactly what that trade costs. It is not a contradiction of the definition; it is the definition working as intended, which is why the decision to accept a managed component should weigh that loss of control deliberately.

- A is wrong: This treats 'managed' as meaning 'never surprises you,' which the guide explicitly rejects — losing root and version-timing control is precisely what the customer trades away for reduced operational burden.
- B is wrong: Forced upgrades on the provider's schedule occur under both models for the same reason — the provider owns the underlying component's lifecycle in each case.
- D is wrong: Running it as IaaS would indeed restore version-timing control, but that is a different architectural choice, not evidence about whether the forced upgrade contradicts the managed-service definition itself.

### 90.

A team runs the same stateless web service on two public providers, but only one of the two deployments is actually tested and kept current; the other has drifted and would take days to bring back into service. A stakeholder claims 'we're multi-cloud, so we're protected against a provider outage.' Evaluate the claim.

- **A.** The claim is right — using two providers for the same workload is itself sufficient for availability across provider outages, whatever state either deployment is in on the day the outage arrives.
- **B.** The claim is right, but only because the two deployments together form a hybrid cloud, which guarantees failover between its parts.
- **C.** The claim is wrong, but only because service level agreements do not cover multi-provider failover scenarios, which is the real gap here.
- **D.** The claim is wrong: multi-cloud does not automatically deliver high availability; a deployment that is not actually tested and ready to take over fails just as hard as a single-provider setup when its own provider goes down.

**Answer: D.** Multi-cloud reduces dependence on a single vendor in principle, but it delivers no availability benefit on its own. A workload partitioned or duplicated across providers only survives a provider outage if it is deployed, tested and genuinely able to fail over on both — an untested, drifted second deployment offers no more protection than having no second provider at all.

- A is wrong: This treats multi-cloud as an unqualified guarantee, which is exactly the assumption the guide warns against; an untested, drifted deployment provides no real protection.
- B is wrong: Two public providers with no private or community component is multi-cloud, not hybrid, and neither term guarantees failover without a tested, current standby.
- C is wrong: An SLA is the wrong frame entirely here — the actual gap is an untested, drifted standby deployment, not a contractual coverage question.

### 91.

An architecture team splits workloads across two public providers by running each application on a common container substrate with an orchestrator, so any workload could in principle run on either provider. What cost does this portability buy against, and what does it typically give up?

- **A.** It eliminates vendor lock-in entirely, since containers are portable by construction and carry their dependencies with them.
- **B.** It converts the architecture into a hybrid cloud, since workloads can move between the two platforms on demand.
- **C.** It spreads risk across providers, but tends to force a lowest-common-denominator architecture that gives up each provider's differentiated managed services.
- **D.** It removes the need for duplicated identity and monitoring tooling across the two providers, since the orchestrator supplies both.

**Answer: C.** In practice, multi-cloud workloads are either partitioned — simple, but each workload stays dependent on its own provider — or made portable on a common substrate such as containers with an orchestrator, which spreads risk but tends to force a lowest-common-denominator design, giving up the differentiated managed services either provider might otherwise offer.

- A is wrong: Portability reduces the technical component of lock-in but does not touch data gravity, egress cost or a team's accumulated platform expertise, so it does not eliminate lock-in.
- B is wrong: Movement between two public providers, without a private or community component, is multi-cloud portability, not hybrid cloud, which NIST reserves for a mix of deployment models.
- D is wrong: Portability at the workload layer does not remove the operational duplication of identity, networking and monitoring that every additional provider brings with it.

### 92.

Which deployment model does NIST SP 800-145 list among its four, and which term is conspicuously absent from that list despite being common industry vocabulary?

- **A.** Multi-cloud is one of NIST's four deployment models; hybrid cloud is the industry term absent from the list.
- **B.** Managed services is one of NIST's four deployment models; public cloud is the absent term.
- **C.** Hybrid cloud is one of NIST's four deployment models (private, community, public, hybrid); multi-cloud is absent from that list entirely.
- **D.** Community cloud is absent from NIST's list, while private cloud and multi-cloud are both named.

**Answer: C.** NIST SP 800-145 names exactly four deployment models — private, community, public and hybrid — and multi-cloud is not among them. That absence is itself examinable: multi-cloud is a real and useful industry term, defined directly by vendors such as AWS, but it is a consumption pattern layered on top of NIST's models rather than a fifth model of its own.

- A is wrong: This reverses the two: hybrid cloud is the NIST-defined model with a binding condition, while multi-cloud is the industry term NIST never defines.
- B is wrong: Managed services is not a deployment model at all, and public cloud is very much one of NIST's four, named explicitly.
- D is wrong: Community cloud is in fact one of NIST's four; multi-cloud is the term that is absent, not community cloud.

### 93.

A team wants to put a transactional database's live data files directly on object storage to save on cost per gigabyte. Why does this fail mechanically rather than merely run slowly?

- **A.** Because object storage has a strict per-object size limit smaller than most database files — the file would have to be split before it could be stored at all.
- **B.** Because object storage cannot be reached over an HTTP API from the database engine, leaving the engine no path over which to issue its reads and writes.
- **C.** Object storage replaces an object as a whole on every write; a database needs random in-place writes at arbitrary offsets, which object storage has no mechanism for at all.
- **D.** Because object storage requires a filesystem to be formatted onto it before use, unlike block storage, and no filesystem can be formatted onto a key-addressed store.

**Answer: C.** Object storage stores each item with its key and metadata, and a write replaces the whole object rather than editing bytes in place — there is no mechanism for a partial, in-place write at all. A database performs exactly that kind of random write to its data files, which is why object storage is not merely a slow choice for this use but a mechanically impossible one.

- A is wrong: Object storage typically scales to enormous sizes; the actual blocker is the write model — whole-object replacement — not a size ceiling.
- B is wrong: Object storage is specifically reached over an HTTP API; the mismatch is that a database needs partial, in-place writes, which that access model does not provide, not that it cannot be reached at all.
- D is wrong: This reverses the two: block storage is what a guest OS formats with a filesystem; object storage has no filesystem to format at all, addressing items by key in a flat namespace instead.

### 94.

Two application servers need to read and write the same set of files concurrently, with ordinary file permissions and locking. A second block storage volume is proposed for the second server. Why is that the wrong shape?

- **A.** Object storage should be used instead, since it scales to any number of concurrent readers and writers and presents them with a mountable POSIX filesystem on which ordinary file permissions and byte-range locking work unchanged.
- **B.** A second block volume works fine, because block storage automatically synchronises writes between volumes attached to instances in the same account — both copies are kept identical.
- **C.** A second block volume works fine, provided both servers are in the same availability zone, since volumes co-located with their instances can be attached to more than one at a time.
- **D.** A block volume is normally attached to one instance at a time; sharing one between instances needs an explicit multi-attach feature plus a cluster-aware filesystem, which file storage over NFS or SMB provides natively.

**Answer: D.** Block storage exposes a raw volume that a guest OS formats and normally attaches to a single instance at a time — sharing it needs an explicit multi-attach feature and a cluster-aware filesystem most teams do not have set up. File storage puts the filesystem on the provider's side and serves it over NFS or SMB precisely so that many machines can mount the same tree concurrently with familiar permissions and locking, which is exactly this requirement.

- A is wrong: Object storage is not a mountable POSIX filesystem and has no partial-write or locking semantics; it is a poor fit for files two servers actively edit together, unlike file storage.
- B is wrong: Block volumes have no built-in cross-volume synchronisation; each is an independent raw device unless deliberately mirrored, which does not solve concurrent shared access at all.
- C is wrong: Zone placement does not change the fact that a block volume is normally attached to a single instance at a time; proximity does not enable concurrent shared attachment on its own.

### 95.

In object storage, is a 'folder' shown in a console listing a real directory?

- **A.** Yes — object storage organises items in a true hierarchical directory tree, the same as a conventional filesystem.
- **B.** Yes, but only within block storage volumes that have been formatted with a hierarchical filesystem.
- **C.** No — it is a prefix on the object's key; the namespace is flat and has no real directory structure underneath it.
- **D.** No, because object storage items are addressed only by a numeric offset rather than any kind of name.

**Answer: C.** Object storage holds items in a flat namespace addressed by key, with no real directory structure underneath. What a console displays as a folder is constructed from a shared prefix on the object keys inside it, not an actual directory the way a filesystem provides one.

- A is wrong: There are no real directories in a flat, key-addressed namespace; the apparent folder structure is constructed entirely from prefixes shared by object keys.
- B is wrong: That describes block storage after a guest OS formats it, which is a different storage shape entirely from the object storage the question is about.
- D is wrong: Object storage items are addressed by a key — typically a name-like string — not by numeric offset, which is a block storage concept instead.

### 96.

Three teams describe their setup: Team X writes application code and pushes it to a platform that runs the OS and language runtime beneath it. Team Y only signs in, configures settings and uploads data into a finished application they did not write. Team Z registers individual functions that start on an event and shut down when idle. Which team is using PaaS, and what single fact distinguishes it from the other two?

- **A.** Team Y — PaaS is distinguished by needing no deployment artifact at all, only configuration of an application the provider already runs.
- **B.** Team X, since PaaS is distinguished by deploying application code the consumer wrote, unlike Team Y's finished application or Team Z's per-event functions.
- **C.** Team Z — PaaS is distinguished by billing only for the duration code actually runs, so an idle platform costs nothing.
- **D.** Team X — PaaS is distinguished by the team never having to select a runtime version, because the provider pins it for them.

**Answer: B.** The three service models differ in what the consumer supplies and who wrote the running code. PaaS runs an application the consumer wrote on infrastructure the provider manages beneath the runtime; SaaS needs no deployment artifact because the provider's own application is what runs; FaaS invokes individual functions per event and, unlike PaaS, typically charges nothing while idle. Team X's arrangement — push code, provider runs OS and runtime — is PaaS on that basis.

- A is wrong: Needing no deployment artifact describes SaaS, Team Y's model; PaaS requires exactly the artifact Team X pushes.
- C is wrong: Pay-only-while-running billing is the FaaS property Team Z exhibits; PaaS typically bills for provisioned instances that stay warm even when idle.
- D is wrong: PaaS still requires selecting a supported runtime from what the provider offers; the provider patches it, but the choice remains the consumer's, much as IaaS leaves the whole OS choice to the consumer.

### 97.

A platform team pushes their application weekly but discovers the bill is unchanged whether traffic is high or completely absent overnight. Why does PaaS behave this way?

- **A.** PaaS scales to zero automatically whenever traffic stops — so a flat overnight bill can only be a billing error worth disputing.
- **B.** Most PaaS platforms bill for provisioned instances that stay warm, so an idle application still costs money even with no traffic.
- **C.** PaaS charges a fixed subscription regardless of infrastructure used, the same as SaaS.
- **D.** PaaS means the team no longer needs to think about scaling at all, so cost is naturally constant.

**Answer: B.** PaaS platforms usually keep application instances provisioned and warm so requests can be served immediately, and that warm capacity is billed whether or not it is handling traffic. That is precisely the line CNCF draws between PaaS and FaaS: FaaS scales to zero and charges nothing when idle, while PaaS's operational relief does not extend to its billing model.

- A is wrong: Scaling to zero and charging nothing when idle is the FaaS property, not PaaS's; a flat overnight charge for a PaaS app is expected behaviour, not a mistake.
- C is wrong: PaaS billing tracks provisioned compute resources, not a per-seat subscription; that billing shape belongs to SaaS instead.
- D is wrong: Not having to manage servers is only half true — the team still configures scaling policies, and provisioned instances that stay warm are exactly why an idle app still costs money.

### 98.

A team connects their application to a provider-operated managed database, but writes and deploys no application code onto the database itself. Does connecting to it make the database part of the team's PaaS usage?

- **A.** Yes — any provider-operated component that a PaaS application depends on is itself part of the PaaS model the application runs on.
- **B.** Yes, because the database runs on the same underlying infrastructure as the application, which is what puts it inside the same service model.
- **C.** No. Nothing of the team's is deployed onto the database, so it is a managed service rather than PaaS, even though the team's application is PaaS.
- **D.** No, because managed databases are always billed on a separate invoice from application hosting.

**Answer: C.** PaaS and a managed service both take work off the customer's plate, but the line between them is whose code is running: PaaS runs an application the consumer wrote, while a managed service runs a standard component the provider maintains. A team connecting to — rather than deploying onto — a managed database is using a managed service alongside their PaaS application, not extending PaaS to cover the database.

- A is wrong: Dependency is not deployment; the guide is explicit that a managed database you connect to is a managed service precisely because you never deploy an application onto it.
- B is wrong: Shared underlying infrastructure does not determine the service model; what matters is whether the consumer deploys application code onto the component.
- D is wrong: Billing separation is not the deciding factor and is not even reliably true across providers; the deciding factor is whether an application artifact is deployed onto the component.

### 99.

A third-party provider owns, operates and hosts an off-premises platform dedicated to exactly one client organisation, with self-service provisioning and metered chargeback to that client's business units. Which NIST deployment model is this, and why does location not decide the answer?

- **A.** Public cloud — since a third party owns and operates the infrastructure rather than the client itself, and third-party operation is what the public model names, on or off the customer's premises.
- **B.** Not a cloud at all, since the client organisation does not own the hardware it provisions capacity on.
- **C.** Private cloud — NIST defines it by exclusive use by one organisation, and explicitly allows the infrastructure to be owned, managed and operated by a third party, on or off premises.
- **D.** Hybrid cloud, because the infrastructure is hosted off the client's own premises while the client's users remain on them.

**Answer: C.** NIST's private cloud definition turns on exclusivity of use by a single organisation, and it explicitly permits that infrastructure to be owned, managed and operated by a third party, on or off premises. An off-premises, third-party-operated platform dedicated to one client is exactly the case the definition anticipates — the common assumption that private cloud must be on-premises and self-run is the trap.

- A is wrong: Third-party operation is common to both models; what makes this public or private is who may use it, and here use is restricted to one organisation, which is private cloud.
- B is wrong: Ownership is irrelevant to whether this is a cloud; the self-service provisioning and metered chargeback described are exactly the essential characteristics that make it one.
- D is wrong: Hybrid requires two or more distinct cloud infrastructures bound together with portability between them; a single dedicated platform, however it is hosted, is not that.

### 100.

A company runs a virtualized server cluster entirely inside its own building, with no self-service provisioning, no elastic scaling and no usage metering — capacity requests go through a manual ticket. Is this a private cloud?

- **A.** Yes — any on-premises infrastructure dedicated to one organisation counts as private cloud regardless of how it is provisioned or how long a request takes to fulfil.
- **B.** Yes, since it is not open to the general public and therefore falls under the private cloud model by elimination.
- **C.** No — without on-demand self-service, elasticity and metering, it is a virtualized datacentre rather than a cloud of any deployment model, private included.
- **D.** No, because private cloud requires third-party hosting, which this arrangement lacks entirely, leaving it outside every NIST model.

**Answer: C.** A private cloud is still, first and foremost, a cloud: the five essential characteristics must hold before the question of which deployment model applies even arises. A virtualized cluster with a manual ticket process, no elasticity and no metering fails that first test entirely, so it is not a private cloud — it is simply a virtualized datacentre.

- A is wrong: On-premises and dedicated to one organisation are necessary but not sufficient; the environment must also meet the essential characteristics, which this one plainly does not.
- B is wrong: Not being open to the public rules out only public cloud, not the possibility that this is not a cloud at all — process failures on self-service and elasticity are the actual disqualifier.
- D is wrong: NIST allows the organisation itself to own, manage and operate a private cloud; third-party hosting is not required, so this is not the disqualifying factor here.

### 101.

A provider offers a single-tenant dedicated host inside its otherwise open public cloud platform, reachable through the same self-service console as every other customer's shared instances. Is the dedicated host best classified as a private cloud?

- **A.** Yes — since only one tenant runs on that specific host, it satisfies private cloud's exclusivity requirement in the only place that requirement can be measured, namely the machine the workload actually runs on.
- **B.** Yes, because public cloud infrastructure can never contain single-tenant hardware by definition — the host must belong to some other model.
- **C.** Yes, because it satisfies hybrid cloud instead, mixing a dedicated host with shared infrastructure inside one provider's estate.
- **D.** No — the surrounding cloud infrastructure is still provisioned for open use by the general public, so a single-tenant host within it reads better as a public-cloud feature than as its own private cloud.

**Answer: D.** NIST does not address single-tenant hardware inside a public platform directly, so the guide treats it as an application of the definition: the surrounding infrastructure is still provisioned for open use by the general public, which makes the dedicated host a public-cloud feature rather than a private cloud of its own, even though only one customer's workload runs on that specific machine.

- A is wrong: Exclusivity applies to the surrounding cloud infrastructure NIST is describing, not to one physical machine carved out of an otherwise open platform.
- B is wrong: Nothing in NIST's public cloud definition forbids single-tenant hardware within it; the host being dedicated does not remove the surrounding platform from being provisioned for open use.
- C is wrong: Hybrid requires two or more distinct, bound-together cloud infrastructures with portability between them; one dedicated host inside one platform is not that composition.

### 102.

A regulator asks whether customer workloads on a public cloud platform are visible to other tenants, since the service is 'open to the public.' What is the accurate answer?

- **A.** No — 'public' describes who may buy the service, not who may see a customer's data; tenants are logically isolated by separate accounts, networks and encryption keys.
- **B.** Yes — anyone who can purchase the service can also see any tenant's data stored on it, since the storage layer is genuinely shared.
- **C.** No, but only because this workload must actually be running in a private cloud rather than a public one, which by itself would rule the platform out of the public category.
- **D.** No, because public cloud providers only sell to businesses and governments, never individuals — the tenant set is vetted in advance.

**Answer: A.** NIST defines public cloud as infrastructure provisioned for open use by the general public — a statement about who may purchase the service. Customers are separated logically through accounts, virtual networks and encryption keys while sharing the same physical estate, so 'public' never implies that one customer's workload is visible to another.

- B is wrong: This is the misreading the term invites; isolation is enforced by the virtualization and identity layers even though the physical estate is shared.
- C is wrong: Nothing about the scenario suggests the workload has moved to a private cloud; public cloud tenants are isolated from each other by design, which is sufficient on its own.
- D is wrong: NIST's definition allows open use by the general public and says nothing about restricting buyers to organisations; isolation, not the buyer's identity, is what protects the data.

### 103.

A finance director assumes moving a steady, predictable, high-volume workload to public cloud will automatically cut costs. Is that assumption safe?

- **A.** Yes — public cloud infrastructure is always cheaper than owning equivalent hardware, because providers buy at a scale no single customer can match.
- **B.** No — public cloud's advantage is elasticity and speed, and steady, predictable, high-volume workloads can be cheaper on owned hardware.
- **C.** No — steady workloads should run on private cloud instead, since private cloud is always the cheaper deployment model.
- **D.** Yes, because public cloud eliminates capital expenditure for any workload shape, and operating expense is always the cheaper of the two.

**Answer: B.** Public cloud's selling point is elastic capacity and speed of provisioning, not an automatic price advantage. A workload whose demand never varies gets no benefit from elasticity and can be cheaper to run on owned hardware sized precisely for it — assuming the move always saves money is the trap the guide calls out directly.

- A is wrong: This treats elasticity's benefit as universal; a workload that never varies gains nothing from elastic capacity it never needs to use.
- C is wrong: Private cloud is not inherently cheaper either — its usual motivations are regulation, residency and control, not cost — so this does not follow from the scenario.
- D is wrong: Avoiding capital expenditure is real, but it is only one factor; a steady high-volume workload may still cost more over time on a public platform than on owned hardware sized for it.

### 104.

What is the structural relationship between a region and an availability zone?

- **A.** A region is one of multiple availability zones grouped within a larger datacentre, so a single facility can contain several regions.
- **B.** Regions and availability zones are two names for the same unit of infrastructure, differing only in which provider's documentation uses which word.
- **C.** An availability zone is one of multiple isolated locations inside a single region, each with independent power, cooling and networking.
- **D.** An availability zone spans multiple regions to provide cross-geography redundancy — a single zonal deployment therefore survives the loss of a whole region.

**Answer: C.** A region is a separate geographic area designed to be isolated from other regions, and an availability zone is one of several isolated locations inside a single region, each with independent power, cooling and networking infrastructure — so that an outage in one zone is survived by the rest of the region.

- A is wrong: This inverts the nesting — the region is the larger geographic container, and availability zones are the smaller isolated units inside it, not the reverse.
- B is wrong: They are two distinct, nested units with different failure scopes: zones address one datacentre-scale failure, regions address the loss of a whole geography.
- D is wrong: An availability zone sits inside exactly one region; cross-geography redundancy is what spreading resources across separate regions provides instead.

### 105.

A service is deployed across three availability zones within one region for resilience. A regional-scale event takes out the entire region. Does the multi-AZ deployment protect against it?

- **A.** No — availability zones protect against the failure of one datacentre-scale location within a region, not against the loss of the region itself.
- **B.** Yes — spreading across multiple availability zones is sufficient protection against any scale of outage, including a whole-region event.
- **C.** Yes, because AWS automatically replicates all resources across regions by default, so a second copy of the workload is already running elsewhere.
- **D.** No, but only because the service should have used a hybrid cloud architecture instead of multiple zones, that being the arrangement which spans separate geographies.

**Answer: A.** Availability zones are isolated datacentre groupings inside one region, so spreading a service across them protects against the loss of any single facility within that region. A regional-scale event is outside that protection boundary entirely; surviving it requires resources placed in a second region, which — because inter-region traffic is generally not fast enough for synchronous replication — is usually an asynchronous, more deliberate design decision.

- B is wrong: Multi-AZ redundancy is bounded by the region it sits inside; nothing about it survives an event that takes out the region as a whole.
- C is wrong: AWS states the opposite: resources are tied to the region specified and are not automatically replicated across regions unless a cross-region design is explicitly built.
- D is wrong: Hybrid cloud concerns mixing deployment models, not geographic redundancy; the actual gap here is the absence of a second region, which a hybrid architecture does not by itself supply.

### 106.

A company subscribes to a SaaS product, signs in, and an employee later shares a report link publicly by mistake, exposing customer data. Who is responsible for the misconfiguration?

- **A.** The customer — sharing settings, access rights and what users upload remain the customer's responsibility even though the provider runs and patches the application.
- **B.** The provider — SaaS means the provider is responsible for security end to end, including how customers choose to share the data they upload, which is why the incident is the vendor's to answer for.
- **C.** The provider — since SaaS, unlike PaaS, gives the customer no configuration surface to misuse in the first place.
- **D.** Neither — public exposure of a shared link is covered by the provider's published SLA, which indemnifies both parties.

**Answer: A.** SaaS is where the operational surface is smallest and the residual customer responsibility is most often forgotten. The provider runs and patches everything, but identity, access rights, data classification and sharing settings remain entirely the customer's — and a leaked report link is exactly that kind of failure, at any service model.

- B is wrong: This is the precise misconception the shared responsibility model exists to correct: the provider secures the application, but a misconfigured sharing link is the customer's failure regardless of service model.
- C is wrong: SaaS does expose limited user-specific configuration, including sharing controls, and misusing that surface is what caused the exposure here.
- D is wrong: An SLA addresses the provider's own availability commitments and remedies; it says nothing about a customer's data-sharing mistake.

### 107.

A vendor bills a company per named user seat each month, regardless of how many of those seats actually log in. Is this billing pattern typical of SaaS, and why does it differ from IaaS billing?

- **A.** No — SaaS should scale its billing to zero cost when a seat goes unused, exactly as PaaS does when an application sits idle overnight.
- **B.** No — SaaS is metered per API call, the same usage-based billing IaaS uses, so unused seats cost nothing.
- **C.** Yes — SaaS is normally billed per-seat or per-tenant, so an unused seat still costs money, unlike IaaS and FaaS's usage-based billing.
- **D.** Yes, and IaaS bills the same way, per named account rather than per resource consumed.

**Answer: C.** A SaaS subscription is normally a per-seat or per-tenant fee charged regardless of use, which is why an unused licence still costs money. That is a deliberate contrast with IaaS and FaaS, both of which are billed on actual consumption — the difference is a service-model property, not an accident of one vendor's pricing.

- A is wrong: Scaling billing to zero on idle is not a PaaS property either — most PaaS still bills for provisioned instances — and it is even less true of SaaS's per-seat subscription model.
- B is wrong: Per-call metering describes usage-based IaaS-style billing; SaaS's typical model is a flat subscription regardless of use.
- D is wrong: IaaS bills for the compute, storage and network resources actually provisioned and consumed, not for named user accounts.

### 108.

A managed message queue charges per message processed and requires no server administration from the customer, but no individual customer-written function is triggered per message — the queue itself is the product. Is this FaaS?

- **A.** Yes — anything billed per use with no server management is FaaS by definition, since FaaS is simply the billing model's proper name.
- **B.** Yes — any component that avoids the continuous resource billing PaaS requires must be FaaS, because that gap is what the term was coined to name, whatever unit of work actually executes.
- **C.** No — it is a managed service, and managed services and serverless are mutually exclusive categories in CNCF's glossary.
- **D.** No — it is serverless without being FaaS; CNCF treats serverless as the broader term spanning PaaS-like through SaaS-like services, with FaaS the narrower, function-specific member.

**Answer: D.** CNCF calls serverless a comprehensive term spanning PaaS-like through SaaS-like services, with FaaS one specific member of it — a managed queue billed per message is serverless without being FaaS, because there is no customer-written, event-triggered function doing the work.

- A is wrong: Pay-per-use with no server management describes serverless generally; FaaS additionally requires that the unit executing is a customer-written, event-triggered function, which this queue lacks.
- B is wrong: The billing pattern is a genuine FaaS discriminator against PaaS, but it does not by itself make every such component FaaS — this queue has no customer function at all.
- C is wrong: They are not mutually exclusive; a serverless offering is very often also a managed service, since the provider operates it end to end.

### 109.

A batch job runs continuously at high load for six hours a day, every day. A team considers moving it from a fixed-size PaaS instance to FaaS to save money. What is the risk in that plan?

- **A.** There is no risk, since serverless always eliminates cost when a workload is idle, and every workload is idle most of the day, batch jobs included.
- **B.** There is no risk, since FaaS and PaaS bill identically for continuous workloads of the same throughput.
- **C.** The risk is that FaaS cannot hold state between invocations, which this batch job requires in order to run at all.
- **D.** Under sustained high load, FaaS's per-invocation pricing can cost more than a continuously running instance sized for the same throughput.

**Answer: D.** FaaS's economics come from charging only for computation and nothing while idle. A workload that is busy for six hours every day is far from idle, so the cost advantage that makes FaaS attractive largely disappears, and a continuously running instance sized for that throughput can end up cheaper — the guide's warning against assuming serverless is always the lower-cost choice.

- A is wrong: This job is not idle — it runs at high load for six hours daily — so the idle-cost advantage that makes FaaS attractive elsewhere does not apply here.
- B is wrong: They do not bill identically — PaaS charges for provisioned capacity regardless of load pattern, while FaaS charges per invocation, and those can diverge sharply under sustained load.
- C is wrong: Statelessness is a real FaaS constraint, but the scenario describes a cost concern under sustained load, not a state-management requirement.

### 110.

A single-instance application running in one availability zone goes down for forty minutes when that zone fails. The provider's platform-wide 99.99% SLA was still met for the month. Who is accountable for the outage, and what does the SLA actually hand the customer?

- **A.** The provider is accountable, since a 99.99% SLA is a guarantee that any application running on the platform will stay available, and one zone failing counts against that platform-wide figure.
- **B.** The provider is accountable, and the SLA entitles the customer to compensation for the business revenue the outage cost, calculated from the losses the customer reports for the affected period.
- **C.** The customer's own architecture is accountable, since a single instance in one zone was exposed to that zone's failure; the SLA only prices the provider's own shortfall, not this outage.
- **D.** The customer is accountable, but only because a managed database was involved in the outage rather than a compute instance.

**Answer: C.** The provider's SLA is a promise about the platform, priced with a service credit if the provider's own threshold is missed — it says nothing about how a customer chooses to deploy on top of it. A single instance in one zone is exposed to exactly the kind of failure that redundancy across zones is meant to absorb; the SLA being met for the month changes nothing about that architectural gap, and the credit it would owe, if triggered at all, would be proportional to the provider's shortfall, not the customer's lost revenue.

- A is wrong: An SLA is a contractual promise about the platform's own availability, not a guarantee about how a customer chooses to deploy on it; high availability is a design property the customer's own architecture must provide.
- B is wrong: SLA remedies are characteristically a service credit against future billing proportional to the shortfall, not compensation for the customer's business losses, and here the SLA threshold was not even missed.
- D is wrong: The scenario describes a single compute instance failing with its zone; no managed database or its patching is implicated in why this outage occurred.

### 111.

Google's SRE book gives a test for telling an SLA from an SLO. What is that test?

- **A.** Ask whether the target is expressed as a percentage — a percentage always signals an SLA rather than an SLO.
- **B.** Ask whether the target applies to the whole platform or to a single customer's account — platform-wide targets are SLAs, account-specific targets are SLOs.
- **C.** Ask whether the target is set by the provider or by the customer's own team — provider-set targets are SLAs, self-set targets are SLOs.
- **D.** Ask what happens if the target is not met; if there is no explicit consequence, it is an SLO, not an SLA.

**Answer: D.** The SRE book defines an SLA as an explicit or implicit contract with users that includes consequences of meeting or missing the objectives it contains, and offers exactly this diagnostic: ask what happens if the target is not met. If there is no explicit consequence, it is almost certainly an SLO being described, not an SLA.

- A is wrong: Both SLAs and SLOs are commonly expressed as availability percentages; the numeric form tells you nothing about whether a consequence is attached.
- B is wrong: Scope of application does not distinguish the two; an SLO can be platform-wide or team-specific, and what makes something an SLA is the presence of a contractual consequence, not its scope.
- C is wrong: A provider can set internal SLOs of its own with no customer-facing consequence attached, so who sets the number does not settle whether it is an SLA.

### 112.

Under AWS's stated shared responsibility model, which layer marks the boundary between what the provider controls and what the customer controls?

- **A.** The host operating system and virtualization layer — the provider controls everything at and below that; the customer manages the guest OS, its patches, and their own application software.
- **B.** The network perimeter — the provider secures everything outside the customer's virtual network, and the customer secures everything inside it.
- **C.** The application layer — the provider is responsible for securing everything up to and including the customer's own application code.
- **D.** The billing account — everything under one account is the provider's responsibility, and everything under a separate account is the customer's, so the boundary moves whenever a new account is opened.

**Answer: A.** AWS states its own side as operating, managing and controlling everything from the host operating system and virtualization layer down to the physical security of the facilities, while the customer manages the guest operating system — including updates and security patches — other application software, and the configuration of the provider-supplied firewall. That single boundary is the one candidates most often misplace.

- B is wrong: The actual boundary is drawn at the operating system and virtualization layer, not at the network perimeter, and the provider-supplied firewall's configuration remains a customer duty regardless of network boundary.
- C is wrong: This overstates the provider's share, especially under IaaS, where application software and its configuration remain the customer's responsibility.
- D is wrong: Account structure has nothing to do with the security responsibility boundary, which is defined by infrastructure layer, not by account organisation.

### 113.

A team moves an application from IaaS to a fully managed SaaS product from the same provider. What happens to the shared responsibility boundary?

- **A.** It disappears entirely, since SaaS providers assume full responsibility once a customer subscribes, including for which of the customer's own staff are granted access.
- **B.** It stays fixed, since the responsibility boundary is set once per provider account rather than per service model, and then applies uniformly to every service in that account.
- **C.** It moves toward the provider — almost everything operational becomes the provider's, though the customer's own data and their identity and access configuration never transfer.
- **D.** It moves toward the customer, since SaaS applications expose more configuration surface than IaaS instances do — the customer is left operating the runtime the application sits on.

**Answer: C.** The model slides with the service model rather than staying fixed: under IaaS the customer patches the guest OS and owns application configuration, while under SaaS almost everything operational — patching, capacity, runtime — moves to the provider. What never moves at any service model is the customer's own data and their identity and access configuration, which is why moving to SaaS narrows but never eliminates customer responsibility.

- A is wrong: No service model removes the customer's responsibility for their own data and for who they grant access to — the boundary moves, but it never vanishes.
- B is wrong: AWS itself notes that responsibility varies by the specific services chosen; the boundary is per-service, and it visibly slides as the service model moves from IaaS toward SaaS.
- D is wrong: SaaS narrows, rather than widens, the customer's operational surface; configuration options are typically more limited than the full OS-and-application control IaaS provides.

### 114.

What accumulates to create vendor lock-in?

- **A.** Dependence on provider-specific services and interfaces, the volume of data and its egress charges, and the team's operational knowledge and tooling built around one platform.
- **B.** Lock-in is a defect that well-run cloud architecture avoids entirely, so choosing a provider-specific managed service is always an architectural mistake, whatever work it saves the team.
- **C.** Only the technical portability of the application code, since data and team expertise are irrelevant to switching providers.
- **D.** The length of the provider's published SLA, since a longer SLA commits a customer for longer and the workload cannot be moved before that term expires.

**Answer: A.** Lock-in comes from three accumulating sources: depending on provider-specific services and interfaces, the sheer volume of data that would need to move plus the egress charges for moving it, and the operational knowledge and tooling a team has built around one platform. None of these is eliminated by addressing only one of the three.

- B is wrong: The guide frames lock-in as a trade-off to price, not a defect to eliminate — provider-specific services are often chosen precisely because they genuinely reduce work.
- C is wrong: Portable code reduces only the technical component of lock-in; data gravity, egress cost and accumulated team expertise remain untouched by code portability alone.
- D is wrong: An SLA is a contractual availability commitment with a remedy for shortfalls; it has no bearing on how costly it would be to move a workload to a different provider.

### 115.

A team adopts containers, an orchestrator and standard SQL specifically to reduce lock-in before choosing a cloud provider. Does this eliminate their exposure to vendor lock-in?

- **A.** No — these portability layers reduce the technical component of lock-in, but they do not touch data gravity, egress cost, or the operational expertise the team will still build up around whichever provider it chooses.
- **B.** Yes — using only portable, standard technologies removes vendor lock-in entirely, regardless of provider, since anything expressed in standard SQL and a container image can be lifted to another platform at no cost at all.
- **C.** Yes, because containers and standard SQL guarantee the application can be moved back to on-premises hardware at no cost, the stored data following the code automatically.
- **D.** No, because standard SQL only works with a single specific cloud provider's managed database offering, so the portability the team thought it was buying was never there.

**Answer: A.** Portable layers — containers, an orchestrator, standard SQL, open protocols, declarative infrastructure — reduce the technical component of lock-in by keeping the application itself movable. They do nothing, however, about data gravity, the egress cost of actually moving stored data, or the operational expertise a team accumulates around whichever platform it operates day to day, so choosing portable technology narrows lock-in without eliminating it.

- B is wrong: This overstates what portability buys; even with fully portable code, the data itself and the team's accumulated platform-specific knowledge still create real costs of leaving.
- C is wrong: Moving back to on-premises would still involve the same data-volume, egress and re-tooling costs the guide describes; portability lowers the technical barrier, not the cost to zero.
- D is wrong: Standard SQL is deliberately provider-neutral; the actual limitation is that portability layers do not address data gravity or accumulated expertise, not that standard SQL is somehow tied to one vendor.

### 116.

What does a virtual machine provide that a container does not, and what does that cost?

- **A.** A VM provides faster startup than a container, since it boots directly from a stored image rather than assembling a filesystem from layers the way a container image does.
- **B.** A VM is essentially a container with more overhead and no additional capability — the two are interchangeable once an image has been built for either one.
- **C.** A VM boots its own kernel, which lets it run a different operating system family than the host and gives a stronger isolation boundary, at the cost of the memory, CPU and patching overhead of a full guest OS.
- **D.** A VM automatically provides higher availability than a physical machine, independent of any platform configuration, because the hypervisor restarts a failed guest elsewhere in the cluster on its own.

**Answer: C.** A virtual machine boots its own kernel and full operating system, which is what lets it run a different OS family from its neighbours and gives it a stronger isolation boundary — a compromised guest kernel stays inside its own VM. That capability is exactly why a VM costs more per workload: its own memory footprint, its own CPU allocation and its own patching, none of which a kernel-sharing container needs to carry.

- A is wrong: This is backwards — a container starts in milliseconds to seconds as a process, while a VM takes seconds to minutes because it performs a full boot: firmware, boot loader, kernel, init system.
- B is wrong: The overhead exists because the VM provides something a container does not — its own kernel, a foreign-OS option and a stronger isolation boundary — not because it is simply a heavier version of the same thing.
- D is wrong: A VM inherits the availability of the host it runs on unless the platform is explicitly configured to restart or migrate it elsewhere; availability is not an automatic property of virtualization, and restarting a guest on another host is a feature that has to be turned on.

### 117.

An operations team needs to move a running workload to a different physical host with little or no downtime, and later wants to roll it back to an earlier point if an upgrade goes wrong. Which property of virtual machines makes both possible?

- **A.** Because a VM is a software-defined computer (a disk image plus configuration), it can be live-migrated to another host and snapshotted, cloned and rolled back with little or no downtime.
- **B.** Because containers, which the VM is built from, are inherently portable across any host, so moving one is only a matter of restarting its image somewhere else with no state to carry.
- **C.** Because the hypervisor automatically replicates every VM to a standby host in real time — a second copy of memory and disk is held in lockstep without any configuration.
- **D.** Because the shared responsibility model assigns migration and rollback duties to the provider, making both a contractual guarantee rather than a technical capability.

**Answer: A.** Because the whole machine — firmware, boot loader, kernel, init system, userland — is represented as a disk image plus configuration rather than bound to particular hardware, it can be created, destroyed, snapshotted, cloned and moved to another host with little or no downtime, a resilience a bare-metal server cannot offer on its own.

- B is wrong: A virtual machine is not built from containers; it is a full guest OS on top of a hypervisor, and its portability comes from being software-defined, not from any container layer.
- C is wrong: Real-time replication to a standby is a specific, separately configured high-availability arrangement, not an automatic property that every VM has by default.
- D is wrong: Shared responsibility describes who patches and secures which layer; it does not explain the technical mechanism that makes live migration or rollback possible at all.

### 118.

A platform needs to isolate ten workloads, one of which requires a Windows kernel while the other nine are fine on Linux, all on shared physical hardware. Why does this requirement rule out containers for at least one workload, and what technology does it point to instead?

- **A.** Containers rule this out because they cannot run on shared physical hardware at all, so each of the ten workloads would need a dedicated physical server of its own.
- **B.** A container shares the host kernel, so it cannot supply a different operating system family than the host — the Windows workload needs virtualization, giving it its own kernel.
- **C.** This points to a cloud-computing solution rather than a virtualization one — only cloud platforms can mix operating system families on shared hardware.
- **D.** This points to a hypervisor product recommendation, specifically a type 2 hypervisor for the Windows workload, because only a hosted hypervisor can give a guest a kernel that differs from the host's.

**Answer: B.** Virtualization gives each guest its own kernel, which is exactly what lets a workload run a different operating system family from its neighbours and from the host. A container, by contrast, shares the host kernel and therefore must match its family — so a Windows workload on a Linux estate needs virtualization specifically, not a denser packaging technology that cannot supply a different kernel at all.

- A is wrong: Containers run on shared hardware routinely — that is their whole appeal for density; the actual limitation is that they share the host's kernel and so cannot run a different OS family.
- C is wrong: Mixing operating system families on one host is a virtualization capability specifically, available on-premises with a hypervisor and not dependent on being a cloud service at all.
- D is wrong: The requirement calls for virtualization as a technique; whether the resulting hypervisor is type 1 or type 2 is a separate, unstated question this scenario does not address, and both types give each guest its own kernel.

### 119.

What is the precise relationship between virtualization and the hypervisor?

- **A.** They are two names for the same thing — naming a product such as ESXi or KVM and naming virtualization amount to the same claim about one layer of the stack.
- **B.** Virtualization is the technique of partitioning one machine into many; the hypervisor is the software layer that actually performs that partitioning.
- **C.** The hypervisor is a type of container runtime specialised for running full operating systems, which is why ESXi and Docker are classified as the same category of software.
- **D.** Virtualization is a cloud-only capability, whereas a hypervisor can also run outside the cloud on a single desktop or server.

**Answer: B.** Virtualization is the capability — partitioning one physical machine so it can run multiple isolated operating systems. The hypervisor is the specific software layer, sitting between hardware and guests, that implements that capability, schedules real resources behind the illusion of dedicated hardware, and comes in the type 1 and type 2 varieties that classify hypervisors, not the concept of virtualization itself.

- A is wrong: The guide treats conflating the two as a trap: naming a product like ESXi or KVM names a hypervisor, while the capability those products provide is virtualization.
- C is wrong: A hypervisor and a container runtime are different technologies entirely — one creates virtual machines with their own kernels, the other starts processes sharing the host kernel.
- D is wrong: Virtualization long predates cloud computing and runs on a single desktop or server with no cloud involved at all; the guide is explicit that virtualization is not itself cloud computing.

### 120.

Why does routing administrative access through one hardened host instead of opening SSH on every server improve security?

- **A.** Because the bastion host replaces the need for any security group rules on the private resources.
- **B.** The private resources behind it need no direct inbound exposure of their own, and access is concentrated at one auditable point instead of scattered open ports.
- **C.** Because the bastion host routes administrative traffic over a private service endpoint automatically, the same mechanism documented for reaching a managed storage or database service privately.
- **D.** Because a bastion host encrypts traffic that would otherwise travel in the clear.

**Answer: B.** A bastion or jump host concentrates administrative access at one auditable point instead of scattering open SSH or RDP ports across every host, so the private resources behind it need no inbound exposure of their own.

- A is wrong: Security groups are still applied to the private resources; the bastion changes what needs to be reachable from outside, not whether filtering rules on the targets are needed.
- C is wrong: A private service endpoint reaches a managed provider service, such as storage or a database; it is unrelated to how an administrator's session reaches a private compute resource through a bastion.
- D is wrong: Encryption is not the property this concept turns on — SSH and RDP are already encrypted protocols; the bastion's contribution is concentrating and auditing the entry point, not adding encryption that was missing.

### 121.

A team replaces a self-managed jump box with a managed service such as Azure Bastion or AWS Systems Manager Session Manager. What changes about the target virtual machines' exposure?

- **A.** Nothing changes for the targets; only the administrator's client software changes, since the managed service is assumed to sit entirely on the administrator's side of the connection.
- **B.** They need no public IP address and no open inbound SSH or RDP port at all — the managed service removes the exposed port entirely rather than just auditing it.
- **C.** The targets now route their outbound traffic through a NAT gateway instead of directly.
- **D.** The targets are now addressed by a managed DNS name instead of an IP address.

**Answer: B.** The managed forms go a step further than a self-managed jump box: Microsoft documents Azure Bastion virtual machines needing no public IP, agent, or special client software, and AWS documents Session Manager as providing node management without opening inbound ports.

- A is wrong: Microsoft documents that virtual machines reached via Azure Bastion need no public IP address, agent, or special client software, and AWS documents Session Manager as needing no open inbound ports at all — the targets' exposure is what actually changes.
- C is wrong: Outbound routing through a NAT gateway is unrelated to how an administrator reaches the machine for a session; the change here concerns inbound administrative access, not general outbound traffic.
- D is wrong: Switching to a DNS name would not by itself remove an open inbound port; the managed service's benefit is eliminating the open port and the public IP address, not changing how the target is named.

### 122.

Why does concentrating administrative access at one bastion or managed service make session logging more complete than per-host access does?

- **A.** Because logging only happens at a private endpoint, and per-host access never uses one.
- **B.** Because peering connections carry built-in session logs that individual hosts lack.
- **C.** It does not — per-host access logs every connection just as completely, since each host keeps its own log.
- **D.** Every session passes through one place, so recording and auditing become possible in a way that scattered per-host access never allows.

**Answer: D.** Because every administrative session passes through one place, session logging and recording become possible in a way that per-host access never allows.

- A is wrong: Private endpoints log access to managed services like storage or a database; they are a different mechanism from the session audit a bastion provides for administrative access to compute resources.
- B is wrong: Peering logging, where it exists, concerns network-to-network traffic between two virtual networks; it has nothing to do with recording an administrator's individual session to a host.
- C is wrong: Per-host logs are scattered across every target and are easy to miss or lose; the point of concentrating access at one place is exactly that a single, complete record becomes possible.

### 123.

Two teams each provisioned their virtual networks independently, and both happened to choose the same private address range. They now want to peer the two networks. What must happen first?

- **A.** Nothing — peering automatically translates addresses on one side to avoid the conflict.
- **B.** One side must be re-addressed — two networks with overlapping ranges cannot be peered or privately connected without it.
- **C.** Nothing — a more specific route can be added to disambiguate the overlap.
- **D.** Nothing, as long as both sides accept the peering request explicitly.

**Answer: B.** Two networks with overlapping ranges cannot be peered or privately connected without re-addressing one of them, which is why non-overlapping ranges are chosen up front.

- A is wrong: No such automatic translation is documented; the peering connection request itself is rejected when ranges overlap, and manual re-addressing of one side is the only fix.
- C is wrong: A more-specific route resolves ambiguity between two distinct ranges; it cannot make a peering connection request between genuinely overlapping ranges succeed, since that request is rejected before any route is even considered.
- D is wrong: Accepting the request is a separate step from whether the request can even be created; a peering connection between overlapping ranges cannot be created in the first place, regardless of acceptance.

### 124.

Why is running short of address space in a virtual network a recoverable problem, while discovering an overlap with another network is not, in the same easy way?

- **A.** Both are equally recoverable, since every major provider allows re-addressing a live network without disruption, treating growing into unused space and untangling an overlap as the same operation regardless of how much infrastructure was already built on the original range.
- **B.** Address space can be added or expanded after creation on all three major providers, but by the time an overlap is discovered, subnets, peering connections, and on-premises routes have typically already been built around the original range.
- **C.** Neither is recoverable, since a subnet's CIDR block can never be resized once created.
- **D.** Neither is recoverable, since any address change breaks every existing peering connection permanently.

**Answer: B.** Running short of addresses is recoverable, because the range is not locked at creation on any of the three major providers; discovering an overlap is not recoverable in the same way, because other infrastructure has usually already been built on the original range.

- A is wrong: Growing addressable space is well supported; undoing an overlap once other infrastructure is built on top of it is a much harder, disruptive re-addressing exercise, not an equally easy operation.
- C is wrong: Azure documents changing a subnet address range after creation and Google Cloud documents expanding a subnet’s primary IPv4 range, so the premise that a subnet block can never be resized is itself false.
- D is wrong: An address change can require rebuilding an affected peering connection, but that is a one-time fix, not a permanent break; conflating the two problems overstates the overlap case and understates the growth case.

### 125.

An AWS VPC's IPv4 CIDR block is being sized. Which statement about the allowed range is accurate?

- **A.** It must be between a /16 and a /28, and an existing block's size cannot be changed in place — a second block is added instead.
- **B.** It can be any size from /8 to /32, matching the full range RFC 1918 permits for private addressing.
- **C.** It must match the size of every subnet carved from it exactly.
- **D.** It is capped at five addresses per Region, matching the reserved public address quota.

**Answer: A.** AWS documents that a VPC's IPv4 CIDR block must be between a /16 and a /28, and that an existing block's size cannot change in place, requiring a second block to be added instead.

- B is wrong: RFC 1918 defines which ranges are private; AWS separately bounds the block size for a single VPC CIDR block to between a /16 and a /28, a narrower constraint than RFC 1918's own ranges.
- C is wrong: A network's CIDR block is a parent range that subnets are carved out of in varying sizes; there is no requirement that the network and its subnets share one size.
- D is wrong: The five-per-Region figure is the default quota on Elastic IP addresses, an entirely different resource from a VPC CIDR block, whose size AWS bounds between a /16 and a /28 rather than by any per-Region address cap.

### 126.

A managed DNS service is described as changing the answer it returns for a name automatically when a resource behind it fails. What is this mechanism called?

- **A.** Layer 7 routing, since content-based rules are what redirect traffic away from the failure.
- **B.** Address remapping, since a static address is being pointed at a new resource.
- **C.** Load balancing, since both mechanisms route traffic away from a failure the same way.
- **D.** DNS failover, since the authoritative answer stops pointing at the failed endpoint once its health check fails.

**Answer: D.** AWS documents DNS failover as the mechanism by which traffic is routed away from an unhealthy resource to a healthy one when several resources perform the same function.

- A is wrong: Layer 7 routing decides among backends based on the request's content; it is a load balancer capability, distinct from DNS changing which address a name resolves to.
- B is wrong: Remapping a reserved address keeps the address itself unchanged and repoints it at a new instance; DNS failover instead changes what a name resolves to, leaving addresses alone.
- C is wrong: A load balancer keeps one unchanged endpoint and stops routing to the unhealthy target internally; DNS failover instead changes what address clients are told to use, which is a different mechanism with a different speed limit.

### 127.

A service relies on DNS failover with a five-minute TTL on its record, while a comparable service sits behind a load balancer with several registered targets whose health check marks one unhealthy within seconds. After a failure, which recovers to serving traffic sooner, and why?

- **A.** The load-balanced service, because it keeps one unchanged endpoint and simply stops sending traffic to the unhealthy target, while DNS failover cannot take effect faster than the TTL lets caches expire.
- **B.** They recover equally fast, since both mechanisms detect failure with a health check, and it is the detection step alone that determines how quickly traffic reaches a healthy target, regardless of whether a DNS record or a balancer's routing table has to catch up afterward.
- **C.** The DNS-based service, since layer 7 balancers add request-parsing latency that DNS avoids.
- **D.** Neither — remapping a reserved address to a healthy instance would outperform both.

**Answer: A.** A load balancer keeps one unchanged endpoint and stops routing to an unhealthy target, so no client has to learn anything new; DNS failover changes which endpoint clients are told to use and is bounded by the record's TTL.

- B is wrong: Detecting the failure is fast in both cases; what differs is what has to happen afterward — DNS failover still has to wait out the TTL across every caching resolver, which a load balancer's internal routing does not.
- C is wrong: Layer 7 parsing latency is on the order of the request itself, not minutes; it does not come close to offsetting a multi-minute TTL-bound DNS failover.
- D is wrong: Remapping a reserved address is a valid third option for masking failure, but the question compares the two mechanisms given, and this answer avoids stating which of those two is faster.

### 128.

A managed DNS service is documented as performing three functions in any combination. What are they?

- **A.** Domain registration, layer 4 routing, and layer 7 routing.
- **B.** Domain registration, private endpoint provisioning, and health checking.
- **C.** Domain registration, DNS routing, and health checking.
- **D.** DNS routing and health checking only — domain registration is a separate, unrelated product.

**Answer: C.** AWS documents its managed DNS service, Route 53, as performing three functions in any combination — domain registration, DNS routing, and health checking.

- A is wrong: Layer 4 and layer 7 routing describe a load balancer's traffic decisions, not a DNS service's documented functions, which include health checking rather than a layer split.
- B is wrong: Private endpoint provisioning is a separate service for reaching managed resources privately; it is not one of the three functions documented for the managed DNS service.
- D is wrong: The service is documented as performing domain registration as one of its three combinable functions, not as a separate product.

### 129.

A requirement reads: route requests for one URL path to one group of servers and everything else to another. Which class of load balancer can satisfy it, and why can the other class not?

- **A.** A layer 7 load balancer, because it parses the request and can act on the URL path; a layer 4 load balancer forwards by address and port only and never sees the path.
- **B.** Either class works equally well, since both forward based on the destination port a request arrives on, and a URL path is treated as just another field of that same connection-level information.
- **C.** A DNS-based routing service, since it can direct different names to different server groups.
- **D.** A network ACL, since it can match on the destination path in its rules.

**Answer: A.** A layer 7 load balancer parses the request and can therefore make decisions on hostname, URL path, headers, or cookies, while a layer 4 balancer forwards connections by address and port alone.

- B is wrong: A URL path is not a port number — it is part of the HTTP request itself, which only a layer 7 balancer reads; a layer 4 balancer has no visibility into it at all.
- C is wrong: DNS resolves names to addresses before a connection even starts; it cannot make a per-request decision based on a URL path arriving after the connection is already open.
- D is wrong: A network ACL filters by address, port and protocol at the network layer; it has no concept of an HTTP path, which is application-layer content.

### 130.

A service balances an arbitrary TCP protocol that is not HTTP, and the requirement is minimal added latency. Which class of load balancer fits, and why?

- **A.** A layer 7 load balancer, since parsing the request lets it apply smarter routing regardless of the protocol involved.
- **B.** DNS-based load distribution, since it adds no per-connection processing at all.
- **C.** A layer 4 load balancer forwards by address and port without parsing the protocol, which is what makes it protocol-agnostic and low-latency.
- **D.** A private connectivity link, since it bypasses the public internet and therefore adds no latency.

**Answer: C.** A layer 4 load balancer forwards connections by address and port and does not read the application protocol at all, which is what makes it suited to an arbitrary TCP or UDP protocol with minimal added latency.

- A is wrong: Layer 7 parsing is specifically built around the application protocol, commonly HTTP; an arbitrary non-HTTP TCP protocol is exactly what it is not designed to interpret, and the parsing step adds the latency the requirement rules out.
- B is wrong: DNS distribution happens once at resolution time and cannot adapt per connection the way a load balancer's ongoing forwarding decision can; it answers a different requirement than the one stated.
- D is wrong: Private connectivity keeps traffic off the public internet but is not a load-balancing mechanism at all — it has no notion of distributing connections across backend servers.

### 131.

Which pairing of a provider with its layer 7 load balancer product name is correct?

- **A.** AWS's is the Network Load Balancer, since inspecting a URL path is a network-layer operation.
- **B.** AWS's is the Application Load Balancer, Azure's is Application Gateway, and Google Cloud's is the Application Load Balancer.
- **C.** Azure's is Azure DNS, following the naming pattern of its DNS service.
- **D.** Google Cloud's is Cloud Interconnect, since that is its proxy-based traffic product.

**Answer: B.** Google Cloud's documentation currently calls its layer 7 product a proxy-based layer 7 load balancer, while older material still uses the earlier name, HTTP(S) Load Balancing, for the same product.

- A is wrong: AWS documents the Network Load Balancer as functioning at the fourth layer of the OSI model; the Application Load Balancer is the one that functions at the seventh layer and evaluates the request itself.
- C is wrong: Azure DNS is the managed DNS service and performs no load balancing; Microsoft documents Application Gateway as operating at OSI layer 7 and routing on URL paths and host headers.
- D is wrong: Cloud Interconnect is Google Cloud’s dedicated circuit to an on-premises network, not a load balancer; Google documents the Application Load Balancer as a proxy-based Layer 7 load balancer.

### 132.

What single fact makes a subnet public on AWS?

- **A.** A checkbox on the subnet's own configuration marked 'public'.
- **B.** Association with a route table that contains a route to an internet gateway — nothing on the subnet itself records this.
- **C.** Attachment of an internet gateway to the virtual private cloud, regardless of any subnet's route table.
- **D.** Assignment of a reserved static address to at least one instance in the subnet.

**Answer: B.** This is the mechanism behind the public/private classification: associating a subnet with a route table that contains a route to an internet gateway is what makes that subnet public, and nothing on the subnet records the fact.

- A is wrong: AWS exposes no such attribute on the subnet object; the classification is derived entirely from the associated route table's contents.
- C is wrong: Attaching the gateway to the network makes it available as a route target; a subnet only becomes public once its own route table actually routes to that gateway.
- D is wrong: A reserved address changes nothing about routing; a subnet's public-or-private classification depends on its route table, independent of what addresses its instances hold.

### 133.

A route table carries a route to a peering connection for a narrow slice of address space, and a broader default route to an internet gateway. A packet is addressed inside that narrow slice. Which route wins?

- **A.** The default route to the internet gateway, since default routes always take priority as the catch-all.
- **B.** Neither — the subnet's own address range always takes priority over any listed route.
- **C.** The route to the peering connection, because matching is by most specific prefix first, and it matches more precisely than the default route.
- **D.** The peering connection is unreachable regardless of the route, since peering requires non-overlapping ranges first.

**Answer: C.** Matching is by destination address, most specific route first, so a narrower route beats a broader default route for a packet addressed inside that narrower range.

- A is wrong: A default route is the least specific possible match and is used only when nothing more specific applies; it does not override a more specific matching route.
- B is wrong: The subnet's own range is covered by the automatic local route, which is a separate entry from either route named here and is not what this question is asking about.
- D is wrong: Whether the ranges overlap governs whether the peering connection could be created at all; given that it exists and has a route, this question is only about which route a specific packet matches.

### 134.

How does Google Cloud's approach to route tables differ from AWS's and Azure's?

- **A.** Google Cloud defines routes at the network level, matched by destination and network tag, rather than associating a distinct route table with each subnet.
- **B.** It does not differ — all three associate a route table with each subnet individually.
- **C.** Google Cloud has no routing mechanism at all, relying entirely on firewall rules.
- **D.** Google Cloud requires a NAT gateway to be named explicitly in every route, unlike AWS or Azure, since a route's target is assumed to always resolve to a provisioned gateway resource of some kind.

**Answer: A.** AWS and Azure both associate a route table with a subnet; Google Cloud instead defines routes at the network level, matched by destination and by instance tag.

- B is wrong: AWS and Azure do associate route tables per subnet, but Google Cloud defines routes at the network level instead; treating all three as identical here misses the documented difference.
- C is wrong: Google Cloud does route traffic, including a system-generated default route; it simply defines routes at the network rather than the subnet level, which is a different claim than having no routing mechanism.
- D is wrong: A route's target can be many things — a peering connection, a VPN gateway, the default internet gateway, and so on — not exclusively a NAT gateway, on any of the three providers.

### 135.

A design places three resources into three different subnets of the same virtual private cloud, with no other network configuration made. Which best describes the isolation those resources have from each other?

- **A.** Complete isolation, because putting each resource in its own subnet is exactly what creates an isolation boundary, the same boundary a virtual private cloud itself is supposed to provide between two separate networks.
- **B.** Isolation depends entirely on whether a network ACL has been attached to each subnet.
- **C.** None by default, since subnets in the same network can route to each other; isolation is a property of the virtual private cloud, not of splitting it into subnets.
- **D.** Isolation only from the internet, since a private address range is not routable from outside.

**Answer: C.** A subnet is a slice of a network's address range where resources are placed and routing is attached; the virtual private cloud, not the subnet, is where isolation actually lives.

- A is wrong: Isolation belongs to the virtual private cloud as a whole; two subnets carved from the same network route to each other by default, so this reassigns the network's property to the subnet.
- B is wrong: A network ACL filters traffic reaching a subnet; it does not create the routing isolation the question asks about, which subnets lack by default regardless of filtering rules.
- D is wrong: The question asks what isolation the three resources have from each other, and internet reachability is a separate matter decided by the subnet's route table rather than by the resources sitting in different subnets.

### 136.

A deployment needs resources spread across three availability zones in one region. On AWS, how many subnets does that require, and why does the same question have a different answer on Azure and Google Cloud?

- **A.** Three on AWS, because a subnet is confined to a single Availability Zone there; on Azure, subnets span every zone in the region, and on Google Cloud a subnet is a regional resource reachable from any zone in it, so one subnet suffices on either.
- **B.** Three everywhere, because a subnet is confined to one Availability Zone on every major provider.
- **C.** One everywhere, because the virtual private cloud itself already spans every zone in the region on all three providers, which would make the three-zone requirement trivial regardless of which provider's subnet rules apply to the deployment.
- **D.** Three on AWS and Azure, one on Google Cloud, because route tables are associated per subnet on the first two, and a per-subnet route table is assumed to be what forces a subnet to stay inside one zone.

**Answer: A.** AWS documents that each subnet must reside entirely within one Availability Zone; Azure and Google Cloud both diverge from that, in slightly different ways, and generalising AWS's rule across providers is the predictable error.

- B is wrong: This is the AWS-specific rule generalised past where it holds — Azure and Google Cloud do not confine a subnet to a single zone.
- C is wrong: The network's regional scope is a separate fact from the subnet's zone relationship, and conflating the two produces the wrong answer for AWS, where the subnet — not the network — is what is zone-confined.
- D is wrong: Route table association is a separate mechanism from zone-scoping; Azure's subnets span every zone despite also carrying a per-subnet route table.

### 137.

Which packet-filtering layer attaches directly to a subnet on AWS but has no equivalent per-subnet attachment on Google Cloud, which instead configures the same kind of rule on the network as a whole?

- **A.** The private address range, since AWS assigns it per subnet and Google Cloud assigns it per network, reflecting how differently the two providers scope a virtual private cloud's overall address space.
- **B.** A security group, since it is stateful only on AWS and stateless on every other provider.
- **C.** A route table, since Google Cloud has no notion of routing at all.
- **D.** A network ACL, which AWS associates with a subnet, while Google Cloud's VPC firewall rules are configured on the network and enforced at the instance.

**Answer: D.** Where a route table and the stateless filtering layer attach differs by provider: AWS and Azure associate a route table with the subnet, and only AWS offers a subnet-attached network ACL, while Google Cloud attaches equivalents at the network level instead.

- A is wrong: Both providers give the address range to the subnet; the network in both cases only supplies the parent block the subnet's range is carved from.
- B is wrong: Security groups are stateful on every provider that offers the concept; state is not what varies by attachment point here.
- C is wrong: A route table directs traffic rather than filtering it, so it is not the layer this question asks about; Google Cloud does route traffic, defining routes at the network level rather than per subnet.

### 138.

A subnet is carved from a block nominally sized for 256 addresses. Why does the number of addresses actually available to resources come out lower than that raw arithmetic?

- **A.** CIDR planning requires holding back addresses in every subnet for future peering connections, a reservation made well before any specific connection is ever requested.
- **B.** Reserved static addresses are automatically subtracted from the subnet's pool.
- **C.** It does not — the full nominal address count in a subnet is always available to resources.
- **D.** The provider reserves some addresses in every subnet for its own use, so the usable count is always below the raw arithmetic.

**Answer: D.** The provider reserves a small number of addresses in every subnet for its own infrastructure, so a subnet's usable capacity is consistently lower than its nominal block size implies.

- A is wrong: Peering does not reserve addresses within a subnet; the reduction described here comes from the provider's own reserved addresses, not from planning for future connections.
- B is wrong: Reserved public addresses are a separate, quota-limited resource assigned to instances; they are not carved out of a subnet's private range.
- C is wrong: Every major provider withholds a handful of addresses per subnet for its own use, so the raw arithmetic overstates what is actually usable.

### 139.

A team needs to join their on-premises data centre to a cloud network by Friday, on a small budget, and expects the answer to differ from what they'd choose if predictable bandwidth mattered more than speed of setup. What should they choose, and how does that decision differ from connecting two cloud networks to each other?

- **A.** Peering, since it is the fastest way to join any two networks regardless of where they sit.
- **B.** A site-to-site VPN, since it needs only a public endpoint at each end and can be configured on equipment already owned; connecting two cloud networks instead uses peering, which reaches a network the provider already runs rather than one it does not.
- **C.** A dedicated circuit, since it is always the more secure and therefore correct default choice, whatever the deadline or budget a particular team happens to be working against.
- **D.** Either option, since the choice is really about which addressing scheme each network already uses, and cost or setup time are treated as secondary once the addressing question has been settled, regardless of how tight the deadline or how small the budget actually is.

**Answer: B.** A site-to-site VPN needs only a public endpoint at each end and is a configuration task on equipment already owned, making it the fit for a short deadline and small budget; a dedicated circuit trades that speed for predictability.

- A is wrong: Peering connects two networks the same cloud provider already runs; an on-premises data centre is outside the provider's cloud entirely, so peering has no path to it at all.
- C is wrong: 'More secure' is not a single axis here: a dedicated circuit gives a private path but does not itself encrypt payload, and it has to be physically provisioned by a connectivity provider — far too slow for a Friday deadline on a small budget.
- D is wrong: Addressing scheme choice matters for avoiding an overlap either way, but it is not what discriminates between a VPN and a dedicated circuit — cost and setup time, which the scenario supplies directly, are.

### 140.

A dedicated circuit connects an on-premises network to the cloud without touching the public internet. Is the traffic on it encrypted?

- **A.** Yes, automatically, because never touching the public internet is the same thing as being encrypted.
- **B.** Not inherently — the circuit provides a private path, which is a separate property from encryption of the payload, and encryption there is a decision made separately from choosing the circuit.
- **C.** Yes, in the same way AWS encrypts all inter-Region peering traffic before it leaves its facilities, treating a dedicated circuit and a peering connection as interchangeable for this purpose.
- **D.** Yes, as long as a security group rule requiring encrypted traffic is attached to the circuit.

**Answer: B.** A dedicated circuit establishes a private path that never enters the public internet, but encryption of the payload is a separate decision from that path's privacy — the two properties are not the same thing.

- A is wrong: Microsoft states plainly that by default traffic over an ExpressRoute connection is not encrypted; keeping traffic off the public internet is a property of the path, not of the payload.
- C is wrong: That documented encryption applies to peering between two cloud networks on AWS's own backbone; a dedicated circuit to an on-premises site is a different mechanism and is not covered by that same guarantee.
- D is wrong: Security groups filter by address, port, and protocol; they have no mechanism for imposing encryption on a dedicated circuit's payload.

### 141.

A dedicated circuit is being provisioned between an on-premises network and a cloud network, and the two happen to use overlapping private address ranges. Does the dedicated circuit avoid the addressing problem that would break a peering connection?

- **A.** No — overlapping ranges break a dedicated circuit connection just as they break peering; the addressing constraint is not something a private path avoids.
- **B.** Yes — the addressing constraint is specific to peering, since only peering merges two address spaces.
- **C.** Yes, because a dedicated circuit is provisioned by a connectivity provider who resolves any overlap automatically before activation.
- **D.** Yes, because the on-premises side's route table can be configured to prefer the more specific range.

**Answer: A.** A dedicated circuit does not remove the addressing constraint: overlapping ranges between the on-premises network and the cloud network break the connection just as they break peering.

- B is wrong: Microsoft states the overlap bar for an on-premises network in the same breath as for another virtual network, so the constraint is not specific to peering.
- C is wrong: No such automatic resolution is documented for either mechanism; a connectivity provider physically provisions the circuit but does not re-address either network to fix an overlap.
- D is wrong: A more-specific-route preference resolves ambiguity between two distinct, non-overlapping ranges; it does nothing to reconcile addresses that genuinely overlap between the two sides.

### 142.

Which pairing of provider and dedicated-circuit product name is correct?

- **A.** AWS's is Direct Connect, Azure's is ExpressRoute, and Google Cloud's is Cloud Interconnect.
- **B.** AWS's is ExpressRoute and Azure's is Direct Connect — the names are commonly swapped.
- **C.** AWS's is VPC Peering, since that is AWS's private connectivity product.
- **D.** Google Cloud's is Private Service Connect, its private-endpoint product.

**Answer: A.** AWS's dedicated-circuit product is Direct Connect, Azure's is ExpressRoute, and Google Cloud's is Cloud Interconnect — three different names for the same mechanism.

- B is wrong: ExpressRoute is Microsoft's product name and Direct Connect is AWS's; swapping them is exactly the mix-up this fact exists to catch.
- C is wrong: VPC Peering connects two AWS networks to each other; it is not the dedicated-circuit product for reaching an on-premises site, which is Direct Connect.
- D is wrong: Private Service Connect is Google Cloud's mechanism for privately reaching managed services, not its dedicated on-premises circuit product, which is Cloud Interconnect.

### 143.

A design states two requirements: 'users must reach the web tier from the internet' and 'the application servers must download patches but must never be reachable from outside.' Which routing target satisfies each?

- **A.** Making the web tier's subnet public and the application tier's subnet private satisfies both requirements on its own, with no gateway needed.
- **B.** A security group for the web tier and a network ACL for the application servers.
- **C.** An internet gateway for the web tier's two-way reachability, and a NAT gateway for the application servers' outbound-only reachability.
- **D.** A NAT gateway for both, since it is the safer default and can be configured for two-way reachability if needed.

**Answer: C.** An internet gateway grants two-way reachability, and a NAT gateway grants outbound-only reachability; mapping a stated requirement to the correct target is the direction question this concept turns on.

- A is wrong: The public/private classification is itself derived from which gateway a subnet's route table points at; it is not an alternative to attaching the gateways, it is a description of having done so.
- B is wrong: Both of those are filtering layers that decide which traffic is allowed once it arrives; neither grants or withholds the reachability direction itself, which is what the routing targets do.
- D is wrong: A NAT gateway's one-way property comes from address translation, not from a rule that can be switched to two-way; it structurally cannot give the web tier the inbound reachability it needs.

### 144.

A topology places a public NAT gateway inside the private subnet it is meant to serve, reasoning that keeping it close to the resources is simplest. What is wrong with that placement?

- **A.** Nothing — a NAT gateway works from either a public or a private subnet as long as it has an internal route.
- **B.** A public NAT gateway must sit in a public subnet, with an Elastic IP, and route the private subnets' traffic to it from there; placing it in the private subnet it serves inverts the intended layout.
- **C.** Nothing is wrong with the gateway; the real problem is that the subnet was never reclassified as public first, and reclassifying it would supposedly move the gateway to a valid location automatically.
- **D.** Nothing is wrong with the placement; a security group rule should be added instead to fix reachability.

**Answer: B.** A public NAT gateway is provisioned in a public subnet and serves the private subnets that route their default traffic to it, from where it is routed on to the internet gateway; placing it in the private subnet it serves is a documented inversion of the intended layout.

- A is wrong: AWS's own architecture puts the public NAT gateway in a public subnet specifically so it can reach the internet gateway; placed in a private subnet it would have no route out either.
- C is wrong: Reclassification is not the missing step here — the NAT gateway itself needs to sit in a subnet with a route to an internet gateway, which is a placement decision distinct from any subnet's own public/private status.
- D is wrong: The reachability problem here is architectural — the gateway has nowhere to route outbound traffic — and no filtering rule addition changes where a gateway needs to sit.

### 145.

An internet gateway is attached to a virtual private cloud, and a route to it is added to a subnet's route table. An instance in that subnet has no public or Elastic IP address. Is the instance reachable from the internet?

- **A.** Yes — attaching the gateway and routing to it is what makes every instance in the subnet reachable.
- **B.** No. Without a public address on the instance itself, the gateway and the route are not enough; nothing external has an address to send traffic to.
- **C.** Yes, because the subnet is now classified as public by definition once the route exists.
- **D.** Yes, as long as the instance is assigned a reserved static address rather than an ephemeral one.

**Answer: B.** An internet gateway alone does not expose anything: without a public address on the resource, and a route pointing at the gateway, nothing is reachable from outside.

- A is wrong: An internet gateway and a route only provide the path; a resource still needs its own public address for anything outside the network to address it.
- C is wrong: The subnet is indeed public by this definition, but public classification describes the subnet's routing, not whether any particular instance in it has an address that makes it individually reachable.
- D is wrong: Either kind of public address would satisfy the addressing requirement; the instance here has neither, so the reserved-versus-ephemeral distinction does not change the answer.

### 146.

Which statement about naming an internet-gateway equivalent across the three major providers is accurate?

- **A.** Google Cloud's routing documentation names a 'default internet gateway' as the next hop of the system-generated default route it adds to every VPC network, rather than as a resource you attach the way AWS does.
- **B.** None of the three names an equivalent; AWS's internet gateway is the only such resource in the industry, with Azure and Google Cloud instead handling inbound reachability through routing rules that carry no dedicated resource name at all.
- **C.** All three name it the same way Azure names its per-subnet outbound-access property.
- **D.** Azure names it as part of its VNet Peering feature instead of as a standalone resource, treating internet reachability and network-to-network peering as one and the same mechanism.

**Answer: A.** Google Cloud names a next hop for its system-generated default route as a default internet gateway, while Azure has no separately named gateway resource at all, relying instead on explicit outbound methods.

- B is wrong: Google Cloud does document a named next hop, its 'default internet gateway', so AWS is not the only provider that names the role.
- C is wrong: The outbound-access property is Azure's own subnet-level setting for outbound reachability, not a named gateway resource, and it is not how AWS or Google Cloud represent the equivalent concept.
- D is wrong: Peering connects two networks to each other privately and has no role in granting internet reachability, which is what an internet gateway equivalent is about.

### 147.

A private subnet's resources reach a managed object storage service through a NAT gateway to the service's public endpoint, incurring internet egress charges along the way. What alternative removes both the NAT hop and the public routing?

- **A.** A peering connection to the provider's own network hosting the storage service.
- **B.** A larger NAT gateway sized to handle the additional egress traffic.
- **C.** A private service endpoint — it connects the subnet to the service as if it were inside the network, needing no internet gateway, NAT device, or public IP address.
- **D.** Assigning the resources public IP addresses so they can reach the service directly, treating a public address as equivalent to a private connection that never leaves the provider's network.

**Answer: C.** AWS documents PrivateLink as connecting a VPC to services and resources as if they were in that VPC, with no internet gateway, NAT device, or public IP address needed — improving security posture and removing the internet egress a NAT path would otherwise bill.

- A is wrong: Peering joins two whole networks and carries the overlapping-address constraint that comes with that; a private endpoint instead exposes one specific service to the network without joining anything else, and without that constraint.
- B is wrong: Scaling the NAT gateway would still route traffic out to the service's public endpoint over the internet, incurring the same egress cost the requirement is trying to remove.
- D is wrong: Public addresses would let the resources be individually reachable from the internet, the opposite of what a private subnet is for, and would not remove the internet egress path the requirement asks to avoid.

### 148.

Which of the following correctly names the private-endpoint mechanism for each provider?

- **A.** AWS's is Private Service Connect, since AWS pioneered private connectivity to managed services.
- **B.** Azure's is ExpressRoute, since that is Azure's private-connectivity product.
- **C.** AWS's is PrivateLink, Azure's is Private Link, and Google Cloud's is Private Service Connect.
- **D.** Google Cloud's is VPC Network Peering, its private-connectivity product.

**Answer: C.** AWS's version is PrivateLink, Azure's is Private Link, and Google Cloud's is Private Service Connect — functionally equivalent private-endpoint mechanisms under three different names.

- A is wrong: Private Service Connect is Google Cloud's name for this mechanism; AWS's is PrivateLink, a distinct product name despite the similar underlying idea.
- B is wrong: ExpressRoute is Azure's dedicated circuit to an on-premises network, a hybrid-connectivity product; Azure's name for a private endpoint to a managed service is Private Link, a different mechanism entirely.
- D is wrong: VPC Network Peering connects two Google Cloud networks to each other; the private-endpoint mechanism for reaching a managed service is Private Service Connect, a different product.

### 149.

A private endpoint is created for a managed database service, and DNS for the service's existing name is updated to resolve to the endpoint's private address. What has to change in the application code that already connects to that name?

- **A.** Nothing — existing clients keep working unchanged, since they already connect by name and the traffic now simply stays inside the provider's network.
- **B.** The application must be rewritten to call a new, endpoint-specific hostname, since a private endpoint is assumed to always introduce its own separate name rather than sit behind the existing one.
- **C.** The application's security group must be updated to allow the new private address range.
- **D.** The application must poll DNS more frequently to pick up the new record promptly.

**Answer: A.** An endpoint is created inside the network and given a private address from the network's own address space; DNS for the service name resolves to that address, so existing clients keep working unchanged while the traffic stays inside the provider's network.

- B is wrong: The private endpoint is placed behind the service's existing DNS name, which is exactly what lets existing clients keep working without any code change.
- C is wrong: Filtering rules may need review in general, but the question is specifically about what changes in the application code, which is nothing — the DNS-to-private-address substitution is transparent to the client.
- D is wrong: DNS record propagation speed is governed by TTL and caching behaviour generally; nothing about a private endpoint specifically requires more frequent polling by the application itself.

### 150.

An instance is replaced, and its public address changes with it because no reservation was ever made for it. What kind of address did it have?

- **A.** A DNS-mapped address, which changes automatically on instance replacement by design.
- **B.** An ephemeral public address, drawn from the provider's pool and returned to it when the resource goes away.
- **C.** A load balancer address, since load balancers always use ephemeral addressing.
- **D.** A reserved static address, since only reserved addresses are assigned to instances by default.

**Answer: B.** By default such addresses are ephemeral, released back to the provider's pool when the resource is deleted; a reserved static address is what survives instance replacement instead.

- A is wrong: DNS maps a name to whatever address is current; the reason the address itself changed here is that it was never reserved, not that DNS was involved.
- C is wrong: Whether an address is ephemeral or reserved is independent of whether it belongs to a load balancer or a single instance; a load balancer's address type is a separate design choice.
- D is wrong: A public address handed out automatically at launch is ephemeral; a reserved address has to be explicitly allocated to the account first, and would have survived the replacement, which this one did not.

### 151.

A failed instance must be replaced without waiting for any DNS record to update and re-cache, and without putting any additional network component in front of it. Which mechanism satisfies that?

- **A.** DNS failover, since it is designed to route around a failed resource automatically.
- **B.** A reserved static address remapped to the replacement instance; the address itself does not change, so no client has to learn anything new.
- **C.** A layer 4 load balancer placed in front of the instance.
- **D.** An ephemeral address reassigned to the new instance, since ephemeral addresses are the simplest option and require no quota-limited reservation to be made in advance.

**Answer: B.** A reserved address exists for exactly this purpose: it can be remapped to a different instance, masking an instance failure without waiting for any DNS record to be updated and re-cached.

- A is wrong: DNS failover changes which address clients are told to use and cannot take effect faster than caching allows, which is exactly the delay the requirement rules out.
- C is wrong: A load balancer would satisfy the DNS half of the requirement, but it is exactly the additional component in front of the instance that the requirement rules out.
- D is wrong: An ephemeral address is exactly what does not survive across instances predictably — reassigning it does not preserve the original address, so clients pointed at the old one would still fail.

### 152.

Why does AWS default to a limit of five Elastic IP addresses per account per Region rather than allocating them freely?

- **A.** IPv4 CIDR blocks are similarly limited to a narrow size range per network, and the two quotas share one cause.
- **B.** Peering connections are also capped at five per network, and the two limits are set together.
- **C.** They are a scarce, quota-limited resource meant for failover remapping rather than for addressing every host by default.
- **D.** It does not — Elastic IP addresses are unlimited, since they cost nothing when attached to a running instance.

**Answer: C.** Reserved addresses are a scarce resource and are quota-limited, which is itself a hint that they are meant for failover remapping rather than as the default way to address every host.

- A is wrong: The CIDR block size limit governs how large a virtual network's private address space can be; it is a different constraint from the separate quota on public reserved addresses.
- B is wrong: Peering connection limits are a separate quota entirely and unrelated to how many reserved public addresses an account may hold.
- D is wrong: AWS documents a default quota of five per Region and charges for every Elastic IP address whether it is in use or idle, so neither half of this option holds.

### 153.

An engineer wants to change a subnet from private to public on AWS and looks for a checkbox on the subnet labelled 'public'. What should they do instead, and why doesn't such a setting exist?

- **A.** Attach a NAT gateway to the subnet, since that is the resource that grants outbound reachability, and outbound reachability is the property AWS's own documentation associates with becoming publicly reachable.
- **B.** Because 'public' and 'private' describe which route table a subnet is associated with, not a flag on the subnet itself, associate its route table with a route to an internet gateway.
- **C.** Edit the local route that covers the network's own address range.
- **D.** Assign the instances in the subnet public IP addresses; that alone makes the subnet public.

**Answer: B.** AWS states the rule directly: association with a route table carrying a route to an internet gateway is what makes a subnet public, and no attribute on the subnet itself records that fact.

- A is wrong: A NAT gateway grants outbound-only reachability from a subnet that is already private; making a subnet public specifically means giving it two-way reachability via an internet gateway, not routing it through a NAT gateway.
- C is wrong: The local route handles intra-network traffic and is not touched to change reachability off the network; the default route to an internet gateway is what needs adding.
- D is wrong: A public IP address does nothing without a route — instances in a subnet with no route to an internet gateway remain unreachable no matter what address they hold.

### 154.

On Azure, a subnet's outbound-access property is set so the subnet has no implicit outbound path. What does Microsoft call the result, and how does that differ from the AWS route-table framing this pair of terms is normally described in?

- **A.** Microsoft calls that a private subnet; a subnet-level property directly controls the classification on Azure, unlike AWS, where there is no such attribute and only the associated route table decides.
- **B.** The same as AWS — Azure also determines this purely by which route table is associated with the subnet, with no additional subnet-level property involved in the decision at all, unlike the AWS mechanism this pairing is normally compared against.
- **C.** A subnet with no NAT gateway attached, since Azure names the property after that resource.
- **D.** A subnet with an empty route table, since Azure also associates route tables per subnet.

**Answer: A.** Azure diverges from the AWS route-table-only framing by exposing a subnet property, `defaultOutboundAccess`, that Microsoft itself calls making the subnet private when disabled.

- B is wrong: Azure exposes a subnet property that Microsoft documents as directly governing outbound reachability; the route-table-only framing is AWS's, not portable to Azure without qualification.
- C is wrong: The property refers to outbound reachability generally, not specifically to whether a NAT gateway resource is attached.
- D is wrong: Azure does associate route tables per subnet, but the specific mechanism this question describes is the dedicated outbound-access property, not the presence or absence of a route table.

### 155.

On Google Cloud, an instance's external IP address is removed to stop it being reachable from the internet. Does this achieve the same result as removing a route on AWS, and why?

- **A.** Yes in effect, but by a different mechanism, since Google Cloud has no per-subnet route table to re-point; reachability there turns on the instance's external IP plus the network-level default route and firewall rules, not on a subnet setting.
- **B.** No — Google Cloud subnets have their own route tables just like AWS, so removing the external IP changes nothing about reachability, since on that reading the subnet's route table association, not the instance's own address, is what would need to change instead.
- **C.** No — only editing the network's system-generated default route changes reachability on Google Cloud.
- **D.** No — only attaching a NAT gateway resource achieves this, and Google Cloud requires one explicitly for any change in reachability.

**Answer: A.** Google Cloud has no per-subnet route table to move, so the same public/private question is answered per instance there rather than per subnet, through the external IP address plus firewall rules.

- B is wrong: Google Cloud defines routes at the network level, not per subnet, so there is no subnet route table for the external IP removal to interact with; removing the external IP does still change reachability, contrary to what this option claims.
- C is wrong: The default route is one ingredient, but Google's documented condition for outgoing access also depends on an egress firewall rule and either an external IP or Cloud NAT; the route alone is not the whole story, and it is untouched here.
- D is wrong: Google Cloud's Cloud NAT is optional infrastructure for outbound-only reachability; removing an instance's external IP is a separate, sufficient way to stop inbound reachability without provisioning Cloud NAT.

### 156.

A private subnet has a NAT gateway attached as its default route target. Which statement about it is accurate?

- **A.** It has no internet access at all, because 'private' means fully cut off.
- **B.** It can still reach out to the internet through the NAT gateway; it simply cannot be reached from outside.
- **C.** It can be reached from outside as long as its instances have public IP addresses.
- **D.** It can be reached from outside only if its route table also carries a local route, the entry every route table gets automatically for its own network's address range.

**Answer: B.** A private subnet routed through a NAT gateway can still initiate outbound connections; the classification only blocks unsolicited inbound reachability.

- A is wrong: This is the mirror-image trap the concept warns about: a private subnet with a NAT route reaches out perfectly well, it just cannot be reached.
- C is wrong: A public address alone does not create inbound reachability; that direction requires a route to an internet gateway, which this subnet's route table does not have.
- D is wrong: A local route only covers intra-network traffic and exists in every subnet automatically; it grants no reachability to or from the internet.

### 157.

A rule set allows inbound HTTP requests to reach a subnet's resources, but replies from those resources never make it back to the client. The subnet uses a stateless filtering layer with only an inbound allow rule written. Which layer is misconfigured, and what general mechanism does it belong to that a host's own firewall does not share this particular failure mode with?

- **A.** The network ACL, whose stateless evaluation means the reply must be allowed by an explicit outbound rule, unlike a security group or a typical host firewall, which is commonly configured to track connection state.
- **B.** A host firewall inside the guest operating system, since firewalls are stateless by definition and therefore always share this exact symptom with any subnet-level filtering layer, regardless of how that host firewall happens to be configured.
- **C.** The route table, because a missing route would produce exactly this symptom.
- **D.** The security group, because security groups are the layer that is stateless, so a rule allowing the inbound request would need a matching outbound rule written for it separately.

**Answer: A.** A security group is stateful and instance-level; a network ACL is stateless and subnet-level, so a reply that never returns is the signature of a missing outbound network ACL rule, not a broken application or an unrelated host firewall.

- B is wrong: Statefulness depends entirely on the implementation, not on the word 'firewall' itself; the layer described here — attached to the subnet with allow-and-deny rules evaluated in order — is a network ACL, not a host firewall.
- C is wrong: A missing route would prevent the reply from being sent anywhere at all, not selectively drop it after arrival at the filtering layer; the described symptom is the signature of a stateless rule set, not a routing gap.
- D is wrong: This reverses the split: a security group is the stateful layer, automatically allowing return traffic, while the network ACL is the one that requires it written explicitly.

### 158.

A requirement calls for blocking one specific malicious IP address from reaching every instance in a subnet, while allowing everything else. Which AWS layer can express that on its own, and which cannot?

- **A.** A security group can, since security group rules can be set to either allow or deny.
- **B.** Neither — blocking one address always requires a host-level firewall rule inside the operating system instead, since neither cloud filtering layer is treated as capable of an explicit deny.
- **C.** A network ACL can, because it supports explicit deny rules; a security group cannot, because it carries allow rules only.
- **D.** Neither — the subnet would need to be reclassified as private to block the address.

**Answer: C.** Because security groups carry allow rules only, an explicit deny of one address cannot be expressed there at all; the network ACL's allow-and-deny rule type is what the requirement actually needs.

- A is wrong: AWS security groups carry allow rules only — there is no deny rule type, so a single blocked address cannot be expressed there at all.
- B is wrong: The network ACL, a provider-managed layer outside the guest operating system, is exactly the tool documented for this: an explicit deny rule at the subnet level, with no host firewall needed.
- D is wrong: Public-versus-private classification governs whether a subnet has a route to the internet at all, not which individual addresses are allowed or denied once traffic can reach it.

### 159.

A network ACL has a low-numbered rule denying a specific address and a higher-numbered rule allowing all traffic. A security group on the same instances has both an equivalent deny attempt and an allow-all rule. What is the practical difference in how rule order matters between the two?

- **A.** For the network ACL, order decides the outcome: the lower-numbered rule is evaluated first and the deny wins; for the security group, there is no deny rule to order against, since it evaluates all of its rules before deciding and only supports allow.
- **B.** Neither layer is order-sensitive; only a host firewall's rule chain is evaluated in sequence.
- **C.** Both are order-sensitive in the same way, since both attach at the same level and evaluate their rules in the same ascending sequence until a match is found.
- **D.** Neither — rule order in both cases is overridden by whichever route table is associated with the subnet, since routing decisions are made before either filtering layer's rules are even consulted, on the reasoning that a route change could substitute for reordering a filtering rule.

**Answer: A.** Rule numbering only matters for the network ACL, which evaluates rules in ascending order until a match is found; a security group evaluates all of its allow-only rules together before deciding.

- B is wrong: The network ACL is explicitly evaluated in ascending rule number until a match is found, which is exactly the order-sensitivity this option denies it has.
- C is wrong: They attach at different levels — instance for the security group, subnet for the network ACL — and only the network ACL's evaluation is order-dependent; the security group considers all of its rules together.
- D is wrong: Route tables decide where traffic goes, not whether a filtering rule takes precedence over another; they have no bearing on how either filtering layer evaluates its own rules.

### 160.

A team migrating from AWS looks for Azure's equivalent of a network ACL to attach at the subnet level, separate from their Network Security Groups. What will they find?

- **A.** Azure Network Security Groups, since Microsoft's name for them is the direct equivalent of a network ACL.
- **B.** A host-level firewall configured inside each virtual machine's operating system.
- **C.** A subnet property comparable to the AWS route table's default target that toggles filtering on or off.
- **D.** No separate stateless layer exists; Azure's Network Security Groups are themselves stateful, with no second, stateless filtering layer to migrate to.

**Answer: D.** AWS's stateless, subnet-level network ACL has no equivalent on Azure or Google Cloud; both of those providers offer only a stateful filtering layer.

- A is wrong: The name is similar but the behaviour is not: Azure's NSGs are stateful, matching AWS's security group rather than its stateless network ACL.
- B is wrong: That would move the filtering inside the guest OS entirely, which is a different mechanism from a provider-managed, subnet-attached layer like AWS's network ACL.
- C is wrong: A subnet-level outbound-access property governs whether a subnet has outbound internet reachability at all; it is not a filtering rule set and has nothing to do with a stateless ACL equivalent.

### 161.

A team provisions an isolated, software-defined network inside a public cloud, choosing its own private address range instead of sharing the provider's default network. They are unsure whether this is best described as a VPC, a VPN, or a private cloud deployment. Which is it, and why?

- **A.** A cloud subnet, since address ranges are subdivided at the subnet level rather than the network level, and on AWS a subnet is additionally confined to a single Availability Zone.
- **B.** A VPN, because it establishes an encrypted tunnel between two networks over an untrusted path.
- **C.** A private cloud, since the word 'private' in the name means dedicated, single-tenant hardware.
- **D.** A virtual private cloud, meaning logically isolated multi-tenant infrastructure with a chosen address space, not a tunnel and not dedicated hardware.

**Answer: D.** The three terms collide on sound alone but name different things: a virtual private cloud is an isolation model on shared hardware, a VPN is an encrypted tunnel, and a private cloud is a deployment model on dedicated infrastructure.

- A is wrong: A subnet is a slice carved out of a network's range; the object being described here — the whole address space and isolation boundary — is the network itself, not a subdivision of it.
- B is wrong: That describes hybrid connectivity's site-to-site VPN case, an encrypted tunnel joining two networks — not a network in itself.
- C is wrong: This is the exact confusion the term invites: a virtual private cloud is logically isolated tenancy on shared hardware, not a deployment model built on dedicated infrastructure.

### 162.

Two teams each provision their own virtual private cloud for their applications. With no additional configuration, can a resource in one reach a resource in the other?

- **A.** No, because a firewall rule is blocking the traffic by default.
- **B.** Yes, as long as both networks were created in the same region.
- **C.** Yes, because both networks use subnets carved from the same private address ranges, and shared addressing from the same private ranges is what actually establishes reachability between two networks.
- **D.** No. Resources in two different virtual networks cannot reach each other by default; a peering connection or private link is required.

**Answer: D.** A virtual private cloud is the outermost isolation boundary in this competency: two of them cannot reach each other at all until an explicit peering connection or private link joins them.

- A is wrong: The block here is architectural, not a filtering rule — no security group or network ACL is even in play until the networks are connected.
- B is wrong: Region alignment does not create a route between separate networks; only an explicit peering connection or private link does.
- C is wrong: Shared addressing between two subnets in different networks is not itself a route — reachability across networks needs peering or a private link, not matching ranges.

### 163.

Which statement about the regional scope of a virtual private cloud is accurate across AWS, Azure, and Google Cloud?

- **A.** All three confine the network itself to a single availability zone, matching the subnet's own zone scoping.
- **B.** A Google Cloud VPC network is a global resource whose subnets carry the regional scope, whereas an AWS VPC exists within one Region and an Azure virtual network's resources must all sit in its own region.
- **C.** All three scope the network the same way they scope a subnet, even though AWS confines a subnet to one Availability Zone while Azure and Google Cloud do not confine the network that way at all.
- **D.** Scope is irrelevant here, because peering merges two networks into a single regional resource.

**Answer: B.** Scope differs by provider and is worth holding separately from a subnet's zone relationship: an AWS VPC and an Azure virtual network are regional, while a Google Cloud VPC network is not itself confined to one region.

- A is wrong: None of the three scopes the network itself to a zone; zone-scoping, where it exists, applies to the subnet, not to the network object.
- C is wrong: Subnet scoping is exactly where the three providers diverge (zone-confined, region-spanning, or regional), so this claim borrows the subnet's variability rather than describing the network.
- D is wrong: Peering connects two networks' address spaces at the routing level; it does not merge them into one resource with a single scope.

### 164.

A team is told their virtual private cloud's address range is permanently fixed once created, and plans to build a second network from scratch rather than requesting more space. Is that premise correct on AWS, Azure, or Google Cloud?

- **A.** Yes — the address range is locked at creation on every major provider, which is why the plan is necessary, and no secondary block, added address space, or subnet expansion can change that later.
- **B.** No, because AWS supports secondary CIDR blocks, Azure supports adding address space, and Google Cloud supports expanding a subnet's primary range, so addressable space can grow on all three.
- **C.** Only partially — the range can grow, but only after every existing subnet has first been re-addressed.
- **D.** No — but only because a new route table can absorb any size of network without limit.

**Answer: B.** The network's address range is not frozen at creation on any of the three major providers; the correction survives from the earlier AWS-only version of this competency.

- A is wrong: This is the corrected error the competency exists to catch: none of the three major providers freezes the range at creation.
- C is wrong: Growing the space (a secondary block, added address space, or subnet expansion) does not require re-addressing what already exists; re-addressing only becomes necessary if the growth would overlap another network.
- D is wrong: Route tables direct traffic and are unrelated to whether the underlying address space itself can be extended.

### 165.

Network A is peered with Network B, and Network B is peered with Network C. A needs to reach C. What does A have, and what would fix it?

- **A.** A path to C through B automatically, since B is peered with both, and a peering relationship is assumed to extend transitively through any shared network the way a route would.
- **B.** A path to C, but only if A also establishes a VPN tunnel to C directly.
- **C.** A path to C as long as all three networks share the same CIDR block.
- **D.** Nothing to C, because peering is non-transitive, so A needs a direct peering connection to C, or a transit/hub gateway service.

**Answer: D.** Peering is non-transitive: a hub-and-spoke arrangement gives the hub reachability to every spoke, but two spokes cannot reach each other through it without a direct peering or a transit service.

- A is wrong: AWS states peering relationships are not transitive: a peered network cannot be used as a transit point for another pair's traffic, so B being peered with both A and C creates no path between them.
- B is wrong: A VPN tunnel is the hybrid-connectivity mechanism for reaching a network the provider does not run, such as an on-premises site; A and C are both cloud networks within reach of ordinary peering, which is the more direct fix here.
- C is wrong: Sharing an address range would disqualify any peering connection outright, since overlapping ranges cannot be peered; distinct, non-overlapping ranges are the prerequisite, not the fix, for connecting A to C.

### 166.

A peering request is submitted between two virtual networks whose IPv4 CIDR blocks overlap. What happens?

- **A.** It succeeds, and the provider automatically re-addresses one side to resolve the overlap.
- **B.** It succeeds, since overlapping ranges only block a dedicated circuit, not a peering connection.
- **C.** It succeeds, but the resulting route table entries silently point at the wrong network.
- **D.** The request fails outright; a peering connection cannot be created between networks with matching or overlapping CIDR blocks.

**Answer: D.** Overlapping addressing disqualifies a peering connection outright: it cannot be created between networks whose CIDR blocks match or overlap, which is the genuine, surviving exam point in this area.

- A is wrong: No major provider re-addresses a network automatically to resolve an overlap; the peering request is instead rejected, and re-addressing one side manually is the only fix.
- B is wrong: Overlapping address ranges block both — a dedicated circuit and a peering connection both require non-overlapping ranges, so this reverses which mechanism the constraint applies to.
- C is wrong: The connection is never created in the first place when ranges overlap, so no route table entries are generated for it to misdirect.

### 167.

A team assumes their peering connection is unencrypted because they never configured any encryption setting for it. Are they right to be concerned?

- **A.** Not necessarily. Encryption is not something you configure or control with peering, but the provider may still encrypt the underlying transport; AWS, for instance, documents encrypting all inter-Region peering traffic before it leaves its facilities.
- **B.** Yes — with no configured encryption, peering traffic travels the public internet in the clear.
- **C.** Yes — only a VPN tunnel provides any encryption, and peering has no equivalent, since nothing in a peering connection's setup ever asks the team to choose or manage an encryption method themselves, unlike the explicit tunnel configuration a VPN requires.
- **D.** Yes, unless a security group rule is added specifically to enable encryption, the same way an inbound rule is added to allow a particular kind of traffic through.

**Answer: A.** With a VPN the encryption is a mechanism the team builds and terminates; with peering it is a property of the provider's fabric they neither configure nor control, and AWS documents encrypting inter-Region peering traffic on its own backbone.

- B is wrong: Peering traffic stays on the provider's own private backbone rather than traversing the public internet at all; the absence of a configured setting does not mean the absence of protection, and AWS documents encrypting inter-Region peering traffic regardless.
- C is wrong: A VPN's encryption is a mechanism the team builds and terminates themselves; peering's traffic protection, where it exists, is a property of the provider's fabric — the two are different arrangements, not one having encryption and the other having none.
- D is wrong: Security groups filter traffic by address, port and protocol; they have no setting that enables or disables encryption on a peering connection.

### 168.

A peering connection has just been accepted by both sides. Does traffic flow immediately?

- **A.** Yes — acceptance is the final step, and routing is configured automatically once both sides agree.
- **B.** Yes, as long as both networks' subnets are already classified as public.
- **C.** No — filtering rules on both sides must also be reviewed, and that alone is what remains.
- **D.** No — each side must still add routes for the other's address range; peering does not fill in routing automatically.

**Answer: D.** A peering connection is requested from one side and accepted from the other, after which each side must still add routes for the other's address range; peering does not merge the two networks or fill in routing automatically.

- A is wrong: Acceptance only establishes the connection itself; AWS documents that each side must separately add routes for the other's CIDR block before any traffic actually flows.
- B is wrong: Public-versus-private classification concerns a subnet's route to the internet, not the internal routes a peering connection needs between the two networks' own address ranges.
- C is wrong: Filtering rules do still apply and are worth reviewing, but the more fundamental gap immediately after acceptance is the absence of any route at all, without which filtering rules never even get evaluated.

### 169.

A scaling group is configured with a minimum of 2, a desired capacity of 4, and a maximum of 10. What do the minimum and maximum represent?

- **A.** Targets the group aims to reach as quickly as possible, ahead of the desired capacity — a reading that quietly promotes the number the group is actively held at into a number it is racing toward as fast as possible.
- **B.** The number of healthy and unhealthy instances currently in the group.
- **C.** The recovery point and recovery time the group is designed to meet.
- **D.** Guardrails the group's size may never cross — it will not be allowed to fall below 2 or rise above 10, whatever a policy or metric requests.

**Answer: D.** A scaling group's minimum and maximum are guardrails the group's size may never cross, while desired capacity is the target the group is actively held at within those bounds — the maximum in particular exists to stop a runaway metric launching capacity without limit.

- A is wrong: Desired capacity is the target the group is actively held at; minimum and maximum only bound how far policies are allowed to move it.
- B is wrong: Health status is a separate, continuously monitored property of each instance, not what these two configured numbers record.
- C is wrong: Recovery objectives describe tolerable data loss and outage duration in disaster recovery, not capacity bounds on a scaling group.

### 170.

An instance in a scaling group terminates unexpectedly, outside of any scale-in event. What does the scaling group do?

- **A.** Nothing, until a human confirms the loss and manually requests a replacement instance.
- **B.** It raises the group's configured maximum capacity to compensate for the loss.
- **C.** It launches a replacement to hold the group back at its desired capacity, without anyone being paged.
- **D.** It triggers a DNS-based redirection to a standby group in another region.

**Answer: C.** An auto-scaling group is also an availability mechanism: it monitors member health and replaces any instance found unhealthy or terminated unexpectedly, holding the group's desired capacity without human intervention.

- A is wrong: Health-based replacement is automatic by design; the whole point is that an instance failure is repaired without a person being paged.
- B is wrong: The configured maximum is a guardrail set deliberately; an unexpected termination does not change it, only the count of running instances within it.
- D is wrong: That describes a cross-site mechanism; a scaling group's own response to a lost member is to replace it within the same group, not to redirect elsewhere.

### 171.

A single, unredundant server reports 99.97% availability over the last quarter, purely by luck — it never happened to be hit by an outage window. A separate service is built with redundant instances across two zones and automatic failover, but had a rough month and only measured 99.5%. Which statement correctly separates what each number shows from what each design achieves?

- **A.** The unredundant server must be the more highly available of the two, since its measured number is larger.
- **B.** Both figures describe the same property, so the two services are equally reliable regardless of design.
- **C.** A redundant, automatically-failing-over design is guaranteed to score higher than an unredundant one over any measurement window — treating the design as a promise about the outcome of any single window, rather than about the long-run average it is actually meant to shift.
- **D.** The first figure is a measured result that can exist without any high-availability design behind it; the second is a high-availability design that can still miss its own target after a bad month.

**Answer: D.** Availability is what you measure over a window; high availability is what you build to raise it. The comparison block's whole point is that a number is not an architecture — each can occur without the other, as this scenario deliberately shows in both directions.

- A is wrong: This treats the measured percentage as if it proved the underlying design, conflating the metric with the architecture that is supposed to raise it.
- B is wrong: Reliability properties such as fault tolerance are separate from an availability figure and are not implied by it.
- C is wrong: High availability lowers the chance of a bad month; it does not guarantee the outcome of any single measured window, as this scenario shows.

### 172.

An SRE team is choosing between two internal SLO targets, both measured over a 30-day month: 99.95% and 99.9%. Relaxing the target from 99.95% to 99.9% permits how much additional downtime across the month?

- **A.** About 4.3 more minutes, since relaxing by one nine only ever changes the figure by the smallest listed increment.
- **B.** About 7.2 hours more, matching the jump from three nines down to two nines rather than the half-step asked about.
- **C.** No measurable difference, because both targets round to the same permitted downtime once expressed per month.
- **D.** About 21.6 more minutes; the allowance grows from roughly 21.6 minutes to roughly 43.2 minutes.

**Answer: D.** Monthly downtime allowance is (1 minus availability) times 30 days times 24 times 60 minutes: about 43.2 minutes at 99.9% and about 21.6 minutes at 99.95%, a difference of 21.6 minutes recomputed directly from the definition rather than copied from the guide's table.

- A is wrong: This mistakes 99.95% to 99.9% for a change of one full nine; the ten-times step applies between whole nines, not half-nines, and understates the real difference.
- B is wrong: That figure is the monthly allowance recovered going from 99.9% down to 99%, a full nine away from the pair in the question.
- C is wrong: The two monthly allowances differ by a factor of two, which is not a rounding artefact.

### 173.

A database server is at 40% CPU utilisation, but its disk queue is deep, with requests waiting well before they are served. Which resource is the bottleneck, and what distinguishes it from the CPU figure?

- **A.** The CPU, since 40% utilisation is already the highest reported number in the scenario.
- **B.** The disk; saturation, not utilisation, is what identifies the constraint, and the deep queue shows work is waiting on the disk specifically.
- **C.** Neither — the bottleneck must be network, since that is the resource most often saturated in cloud deployments generally.
- **D.** Both equally, since CPU and disk always saturate together on any single server.

**Answer: B.** Utilisation measures how much of a resource is in use; saturation measures how much work is queued waiting for it, and only the saturated resource is the actual constraint. A moderately busy CPU next to a deeply queued disk means the disk, not the CPU, is where the fix belongs.

- A is wrong: A moderate utilisation figure with no queue behind it is not saturated; the constraint is wherever work is actually piling up, which is the disk here.
- C is wrong: The scenario gives no network figures at all; the constraint has to be identified from the evidence given, which points at the disk queue.
- D is wrong: The two resources are independent; this scenario specifically shows one saturated (disk) and one merely busy (CPU), which is the point being tested.

### 174.

Support reports checkout feels slow. A team's first move is to add more application instances behind the load balancer, but p99 latency does not improve. What step was skipped?

- **A.** Nothing was skipped, since adding instances is always the correct first response to any latency complaint — application capacity being the usual constraint behind a slow checkout, and the one lever a team can pull without waiting for a measurement.
- **B.** Setting a recovery time objective for the checkout service before making the change.
- **C.** Placing a content delivery network in front of the checkout page.
- **D.** Measuring which resource is actually saturated before acting — the fix should follow the identified constraint, not the most familiar-looking one.

**Answer: D.** The ordering matters more than the technique: measure each resource under load, find the one that is actually saturated, and only then apply a fix aimed at it. Adding instances without first locating the constraint is exactly the attractive wrong answer the exam supplies.

- A is wrong: Horizontal scaling helps only if application capacity was the actual constraint; if the real bottleneck sits elsewhere, such as a database's disk, added instances change nothing.
- B is wrong: Recovery objectives describe disaster-recovery targets around restoring service after a major failure, not a live performance-tuning decision.
- C is wrong: A CDN helps a regional distance problem for cacheable content; it does not address a database-side constraint behind a dynamic checkout flow.

### 175.

A team stores frequently-read database query results in an in-process memory cache to cut repeated work. A separate team serves their site's static images from edge locations distributed around the world, close to each viewer. Which of the two is a content delivery network, and what makes it a distinct case of the same underlying technique?

- **A.** Both equally, since an in-process cache and a set of edge locations are simply two names for one identical mechanism — collapsing the general technique and its geographically distributed special case into a single mechanism with no distinguishing property left.
- **B.** The second — a CDN is caching plus geography: it is one specific deployment of the general technique, distinguished by its edge locations sitting near the viewer rather than in application memory.
- **C.** The first, because a CDN specifically avoids storing any data and only forwards requests toward the nearest origin.
- **D.** Neither, since caching and content delivery are unrelated techniques that happen to share the word 'edge'.

**Answer: B.** Caching is the general technique — a key, a value and an expiry, usable at any layer. A CDN is caching applied with geographic distribution: edge locations near each viewer, holding a copy of what the origin serves. Every CDN is a cache; not every cache is a CDN.

- A is wrong: They are the same general technique at different scope: the CDN adds geographic distribution on top of the caching behaviour the in-process cache already has.
- C is wrong: Forwarding without storing describes routing, not caching; a CDN's edge locations do store copies, which is what lets them serve a fresh request without contacting the origin.
- D is wrong: A CDN is explicitly a deployment of caching, not an unrelated technique; the exam expects the general form to be recognised inside its specific deployments.

### 176.

A cached product page is served to every visitor for an hour before its entry expires, even though the price changed twenty minutes ago. What trade did the cache make, and what does it not remove the need for?

- **A.** Nothing — a correctly configured cache never serves data more than a few seconds old — an assumption that quietly rules out the entire mechanism time-to-live exists to permit, which is exactly what makes caching cheap.
- **B.** Staleness, in exchange for lower latency and origin load — and it does not remove the need for an origin capable of serving the full load, since a cold start or invalidation still sends requests there.
- **C.** Latency, in exchange for guaranteed data freshness on every single request.
- **D.** Availability, since a cache miss makes the requested page temporarily unreachable until the origin responds.

**Answer: B.** Caching cuts latency and origin load at the cost of possibly serving a stale value until expiry, invalidation or eviction. Because a cached copy is not authoritative, the origin still has to be capable of handling the full load on a cold start or after invalidation.

- A is wrong: Staleness up to the full time-to-live is exactly what a cache can serve; describing it as never happening ignores the trade the technique makes by design.
- C is wrong: This reverses the actual trade: caching improves latency at the cost of possible staleness, not the other way round.
- D is wrong: A cache miss still serves the request by falling through to the origin; it does not make the page unreachable, only slower for that one request.

### 177.

Users in a distant region report slow page loads for a media-heavy site while users near the origin report no problem at all. Separately, every user everywhere reports a specific search feature is slow, including users sitting next to the origin. Which symptom is a CDN, such as Amazon CloudFront, the right fix for, and why does it not help the other?

- **A.** The second — a CDN accelerates any slow request regardless of cause, including database queries, once content is placed at the edge — extending the edge’s reach to a class of request it was never built to accelerate, since a query’s own execution time never touches the network at all.
- **B.** The first — a CDN removes geographic distance for the regional symptom; the second is universal, which points at the origin, a query, or another bottleneck that edge caching cannot change.
- **C.** Both equally, since adding edge locations always reduces total request time for every user.
- **D.** Neither — a CDN only ever serves images and video, so a general page-load complaint is out of scope for it entirely.

**Answer: B.** The symptom that identifies a CDN is specific: distant users slow, nearby users fine — a distance problem no amount of origin capacity fixes. A universal slowdown present even beside the origin is not a distance problem, so an edge cache changes nothing about it.

- A is wrong: A CDN serves cacheable content from the edge; a search query's own execution time on the origin is unaffected by where static content is cached.
- C is wrong: The universal symptom is present even next to the origin, which is exactly what a distance problem does not look like — the fix has to be elsewhere.
- D is wrong: A CDN typically serves static objects, which does include page assets like images, so the regional symptom described is a standard case for one.

### 178.

A CDN's edge server receives a request for an object it has never cached before. What has to happen before that first viewer at that edge gets a response?

- **A.** The edge must fetch the object from the origin, the definitive copy, before it can return anything, and it keeps a copy afterward for later requests.
- **B.** Nothing extra — every edge location shares one global cache, so a miss at one edge is always a hit at another — an assumption that erases the whole reason edges are described as geographically distributed rather than as one shared pool.
- **C.** The edge must invalidate every other edge's copy of the same object first.
- **D.** The origin must first push the object out to every edge location in the network.

**Answer: A.** The origin holds the original, definitive copy. A viewer's request resolving to a nearby edge that has never seen the object still requires a fetch from the origin before anything can be returned; only subsequent requests to that edge are served from its cache.

- B is wrong: Edge locations are geographically distributed caches; a miss at one is not automatically covered by another edge holding a copy.
- C is wrong: Invalidation removes an object before its time-to-live expires when content changes; it has no role in serving a first, uncached request.
- D is wrong: A CDN is typically pull-based: edges fetch on demand from the origin and retain a copy, rather than the origin proactively pushing to every location.

### 179.

A backend fails its health check and a load balancer simply stops sending it traffic; the rest of the pool absorbs the load and nothing else changes. A separate incident has the primary database die outright, and a DNS record is switched to point at a standby that then serves all writes. Which of the two events is failover?

- **A.** Both — a health check stopping traffic to a dead backend is exactly the same event as switching a whole service to a standby — erasing the distinction the whole comparison exists to draw, between removing one member from a pool and switching the entire service.
- **B.** Only the load balancer event, since load balancing runs continuously and is therefore the more resilient of the two mechanisms.
- **C.** Neither, because both are examples of auto-scaling responding to reduced capacity.
- **D.** Only the database incident — the whole workload moved to a standby, which is what failover names; the load balancer event removed one member from a pool that keeps working the same way.

**Answer: D.** Failover is the exception path: the whole workload moves to a standby only when the active component fails. Load balancing is the normal path, acting on every request; a health check pulling one dead member from an otherwise-healthy pool is not the same event as switching the service.

- A is wrong: The two overlap only in that both react to a health check; one removes a single member from a working pool and the other switches the entire service, which is not the same event.
- B is wrong: Running continuously describes load balancing's normal-path behaviour; it does not make the health-check removal a case of failover, which is defined by the whole-service switch.
- C is wrong: Neither event adds or removes instances against a metric or schedule, which is what auto-scaling does; both concern routing around or replacing a failed component.

### 180.

A DNS-based failover promotes a standby within thirty seconds of the primary failing, but clients keep sending requests to the dead address for several more minutes. What is the most likely cause?

- **A.** The failure threshold was set too low, so the health check never actually declared the primary unhealthy.
- **B.** Cached DNS records; resolvers and clients keep using the old address until the record's time-to-live expires.
- **C.** The standby has not finished failback yet, so it is refusing the redirected connections.
- **D.** Load balancing rules on the standby are still routing requests back to the primary by mistake.

**Answer: B.** Failover's total delay is the sum of several configured values: probe interval times failure threshold, plus the time for the redirection to take effect. With DNS-based failover, a cached record means clients keep using the old address until the TTL expires, regardless of how fast detection and promotion were.

- A is wrong: The scenario states the standby was promoted within thirty seconds, meaning the health check did fire; the delay is happening after that point.
- C is wrong: Failback is the later, separate step of returning to a recovered primary; nothing in the scenario describes the standby refusing traffic.
- D is wrong: Load balancing distributes traffic across a pool of live backends; it does not explain clients resolving a name to the address of a component that is already down.

### 181.

Two systems each survive a single-node failure. In the first, users see a short window of errors while a health check detects the failure and traffic is redirected to a standby. In the second, redundant nodes are already running the same work concurrently, so nothing is switched and no error appears anywhere. Which is fault tolerant, and why?

- **A.** The first, because detecting a failure and redirecting traffic is the textbook definition of tolerating a fault — collapsing the whole distinction the comparison exists to preserve between a brief switch and no interruption at all.
- **B.** Both equally, since either arrangement keeps the service running after one node is lost.
- **C.** The second. Fault tolerance means no user-visible interruption at all, because the redundant capacity was already doing the work rather than waiting to be switched to.
- **D.** Neither, because a genuinely fault-tolerant system would also survive the loss of every replica at once.

**Answer: C.** Fault tolerance is defined by the absence of interruption: concurrent redundant capacity absorbs the fault with nothing to switch, whereas high availability accepts a brief detection-and-failover window. The comparison block's separating axis is exactly this interruption, not whether the service ultimately survives.

- A is wrong: Detect-then-redirect is exactly the high-availability mechanism, and it is the brief interruption during that process that fault tolerance is defined against.
- B is wrong: Both keep the service running, but the comparison turns on whether the user notices anything, and only one arrangement guarantees they do not.
- D is wrong: Fault tolerance covers a defined class of faults, not every conceivable failure; a correlated loss of all replicas falling outside that class does not disqualify the label.

### 182.

A quorum-based data store is marketed as fault tolerant because it keeps serving reads and writes as long as a majority of its members are reachable. A network partition then isolates every member from every other at once. What does 'fault tolerant' fail to promise here?

- **A.** Nothing beyond the defined fault class, given that a fault-tolerant system survives the failures it was designed for, and a total partition of every member falls outside that class.
- **B.** It fails to promise anything, since a properly fault-tolerant system is, by definition, 100% available.
- **C.** It fails to promise a fast recovery, since fault-tolerant systems are only rated on how quickly they detect and fail over — a claim that quietly assumes every fault-tolerant design is also the fastest-recovering one, which the definition never promises.
- **D.** It fails to promise redundancy, since quorum systems can operate with only a single reachable member.

**Answer: A.** Fault tolerance is a property against a defined class of faults. A quorum design tolerates the loss of a minority of members, but a partition that isolates every member simultaneously is a correlated failure outside that class, and the system is not obligated to survive it.

- B is wrong: Treating fault tolerant as a synonym for always available is the specific error this concept is examined on; 100% availability is not an achievable target for any real service.
- C is wrong: Detection and failover describe high availability's recovery path; a fault-tolerant design has no switch to time in the first place.
- D is wrong: Quorum systems require a majority of members, which presupposes redundancy; the gap here is about fault class, not about whether redundancy exists.

### 183.

A design keeps two application servers on independent power feeds in separate racks, but nothing watches them and nothing redirects traffic if one goes down. Is the arrangement highly available?

- **A.** Yes — duplicate hardware placed in separate failure domains is what the term names.
- **B.** No. Redundancy is only one of the two required ingredients; nothing detects a failure or moves traffic away from it.
- **C.** Yes, provided the two servers are also stateless, since statelessness is what makes availability possible.
- **D.** No, and no amount of automatic failover fixes it either, because true high availability requires zero user-visible interruption.

**Answer: B.** High availability requires both redundancy and automatic failover. This design has only the first ingredient — duplicate components with no health check and no redirection — so it is not yet highly available, though adding failover would complete it.

- A is wrong: That describes redundancy, the ingredient supplying spare capacity, not the completed design that also needs automatic failover.
- C is wrong: Statelessness is the precondition for scaling instances interchangeably; it does not supply the missing detection-and-redirect mechanism here.
- D is wrong: Zero interruption is the stricter fault-tolerance bar; high availability accepts a brief detection-and-switch window, which failover would supply here.

### 184.

A cloud provider's contract promises 99.99% monthly availability with service credits if missed. A customer runs a single instance in a single zone on that platform. Which statement is correct?

- **A.** The customer's service inherits 99.99% availability automatically, since that is what the SLA guarantees them — a substitution that ignores everything the customer’s own architecture would have to contribute for that number to hold.
- **B.** The SLA is itself a design for high availability, since it specifies redundancy and failover requirements.
- **C.** The provider's figure is a contractual promise about the platform; the customer's own architecture, not the contract, determines whether their service is actually highly available.
- **D.** Nothing can be concluded, because SLA figures are never comparable to a customer's own measured availability.

**Answer: C.** A high provider SLA is a promise about the platform's own shortfall risk. A customer who deploys a single instance in a single zone has built no redundancy or failover of their own, so their service's availability is set by their architecture, not by the number in the contract.

- A is wrong: This is the substitution the SLA comparison warns against: a high provider SLA does not make an unredundant single-zone deployment highly available.
- B is wrong: An SLA is a contract with a remedy, not an architecture; it names no redundancy or failover mechanism at all.
- D is wrong: Both are availability percentages over a window, which makes them directly comparable; the issue is what produced each one, not their comparability.

### 185.

A retail site slows every weekday at 09:00 and sits idle overnight. The current fix each quarter is to move the web server to a larger instance type; sessions live on local disk. Which single change addresses both the capacity ceiling and the site's single point of failure, and what has to be true of the application first?

- **A.** Vertical scaling to the next instance size, since a bigger machine removes both the ceiling and the single point of failure at once — an assumption that ignores both the restart the resize needs and the ceiling it will eventually hit, however large the next size is.
- **B.** Horizontal scaling — identical instances behind a load balancer — but only once sessions are moved off local disk, since a stateless design is the precondition for any instance serving any request.
- **C.** Horizontal scaling, and nothing about the application needs to change first, since a load balancer alone makes any backend interchangeable.
- **D.** Auto-scaling on a schedule, since the slow period is predictable and no design change is needed beyond a scaling policy.

**Answer: B.** Horizontal scaling is effectively unbounded and removes the single point of failure a lone server represents, but it only works if any instance can serve any request — which requires externalising session state first. Vertical scaling solves neither problem the scenario names; it just delays the ceiling.

- A is wrong: Vertical scaling still stops at the largest instance type and leaves one machine as the single point of failure; it solves neither problem the scenario names.
- C is wrong: A load balancer distributes requests, but if sessions live on local disk, a request routed to a different instance still cannot find its own session — that gap is what stateless design closes.
- D is wrong: A scheduled scaling policy still adds instances that are only useful once the workload is distributable; the sticky-session problem underneath is unaddressed.

### 186.

A batch job processes one large file start to finish on a single thread; nothing about the work can be split across machines. A team proposes adding ten more instances behind a load balancer to speed it up. What happens?

- **A.** The job finishes proportionally faster, since more instances behind a load balancer always raises throughput regardless of what the work looks like.
- **B.** Nothing measurable; the extra instances sit idle, because the job's constraint is a single non-divisible thread of work that a load balancer cannot spread.
- **C.** The job becomes highly available, since ten instances remove any single point of failure in the pipeline.
- **D.** The job becomes elastic, since instances were added automatically in response to the workload.

**Answer: B.** Horizontal scaling only helps a workload that can actually be divided among instances. Putting more machines behind a load balancer does nothing for a single-threaded batch job with no distributable work, which is exactly the trap the exam sets with this shape of scenario.

- A is wrong: Throughput rises only when the added capacity can take on part of the work; assuming more instances always help ignores that this job has nothing to divide.
- C is wrong: Surviving the loss of an idle instance is not the concern here; the job still runs to completion on whichever single thread is doing the work.
- D is wrong: Nothing in the scenario describes automatic, bidirectional capacity changes against demand; ten instances were simply added by a team's proposal.

### 187.

A dashboard reports average response time as healthy, but users are complaining about slow page loads. What is the average likely hiding, and what should be reported instead?

- **A.** Low throughput — requests per second should be reported instead of a time-based measurement.
- **B.** A slow tail of requests; a percentile such as p95 or p99 should be reported instead, since an average conceals the worst-performing minority.
- **C.** A bandwidth shortfall — the link's raw capacity should be reported instead of application response time.
- **D.** Nothing — average response time is definitionally equal to the experience of a typical user.

**Answer: B.** Latency is reported as a distribution because an average hides the slow tail. Percentiles such as p95 or p99 are quoted precisely because the worst few percent of requests are what users notice and complain about.

- A is wrong: Throughput is a different quantity entirely, measuring volume rather than delay, and would not explain a complaint specifically about per-request slowness.
- C is wrong: Bandwidth is the capacity of the link, not what the system actually achieves over it, and neither is what a per-request latency complaint is measuring.
- D is wrong: An average is skewed by the whole distribution and can look healthy even while a meaningful minority of users are timing out.

### 188.

A queue processor starts batching many small write operations into one larger write to raise throughput. What is the predictable cost?

- **A.** Higher latency for every item now waiting for its batch to fill before being written.
- **B.** Lower throughput, since batching adds processing overhead that outweighs any gain.
- **C.** No cost, since latency and throughput are two names for the same underlying measurement.
- **D.** Reduced availability, since batched writes are more likely to fail outright.

**Answer: A.** Optimising one of latency or throughput can actively worsen the other. Batching many small operations into one larger one raises throughput and simultaneously raises the latency of every item now waiting for the batch to fill — the exam's standard example of the trade-off.

- B is wrong: Batching is chosen specifically because it raises throughput by amortising per-operation overhead across many items, not because it lowers it.
- C is wrong: The two use different units and are not derivable from one another; a system can be excellent at one while poor at the other, exactly as here.
- D is wrong: Nothing about grouping writes together changes whether the underlying storage is redundant or fault tolerant; the trade being made is purely delay versus volume.

### 189.

An application keeps session data in the memory of whichever instance first served a user, and a load balancer is configured with sticky sessions to route each user back to that same instance every time. What does the sticky-session configuration reveal about the application?

- **A.** That the application is not stateless; sticky sessions exist specifically to route a client back to the one instance holding its state.
- **B.** That the application is highly available, since every user's requests are reliably routed to a working instance.
- **C.** That the load balancer is performing failover, since routing based on a health signal is what failover means.
- **D.** That the instance pool needs vertical scaling before it can serve more users.

**Answer: A.** Sticky sessions pin a client to the backend holding its state, which is the standard workaround for an application that is not stateless. Their presence is the tell: a truly stateless design would let the balancer route any request to any instance.

- B is wrong: Pinning a user to one instance is the opposite of resilience to that instance's loss; the pinned client's session dies along with its backend.
- C is wrong: Sticky routing happens on every request from a given user, not only when an instance fails — that continuous behaviour is load balancing, not the failure-triggered switch failover names.
- D is wrong: Instance sizing is unrelated to whether requests can be freely routed among instances; the constraint here is where session state lives, not how big any one instance is.

### 190.

A load balancer forwards TCP connections to backends without ever inspecting the request inside them, and a separate load balancer routes requests to different backend pools depending on the URL path. What is the difference between the two?

- **A.** The first is failover and the second is load balancing, since only the second reacts to every request — a labelling error that assigns the failure-triggered name to two mechanisms that are both, in fact, acting on every single request.
- **B.** The first is for internal traffic only, and the second is for traffic arriving from the public internet.
- **C.** The first requires sticky sessions on every backend, and the second never needs them.
- **D.** The first operates at the transport layer; the second operates at the application layer, where routing on path, hostname or header becomes possible.

**Answer: D.** Balancers operate either at the transport layer, forwarding connections without inspecting them, or at the application layer, where content such as hostname, path or header can drive the routing decision — the two examples in the stem are exactly that pair.

- A is wrong: Both examples described are load balancers acting on every request; failover is the separate, failure-triggered mechanism neither example describes.
- B is wrong: Nothing about layer 4 versus layer 7 routing determines whether traffic originates internally or externally; both can serve either source.
- C is wrong: Sticky sessions are a workaround for stateful applications and apply independently of which layer the balancer operates at.

### 191.

A dashboard alerts when CPU utilisation crosses a threshold someone configured last quarter. A separate practice lets an engineer, faced with an unfamiliar failure nobody predicted, reconstruct what happened by correlating logs, metrics and traces. Which of the two is monitoring, and what can it not do that the other can?

- **A.** The second is monitoring, since correlating multiple signal types is simply a more advanced form of threshold alerting — reversing which practice requires the question to be known in advance and which one exists precisely because it cannot always be.
- **B.** Both are the same practice under different names, since both ultimately rely on numeric time-series data.
- **C.** Neither, because both are simply names for a dashboard, and any dashboard showing logs beside metrics already delivers everything either practice offers.
- **D.** The first is monitoring — it answers a question chosen in advance; it cannot answer a question nobody thought to ask, which is what the second practice, observability, is built for.

**Answer: D.** Monitoring collects predefined numeric signals and alerts when a chosen threshold is crossed — it answers questions you knew to ask in advance. Observability is the broader property, built from logs, metrics and traces together, that lets you answer questions you had not anticipated; metrics are one input to it, not a synonym for it.

- A is wrong: This swaps the pair: threshold alerting on a predefined signal is monitoring, and combining logs, metrics and traces to answer an unanticipated question is observability instead.
- B is wrong: Observability draws on logs and traces as well as metrics, and its defining feature — answering unanticipated questions — is not something monitoring's predefined thresholds provide.
- C is wrong: A dashboard is a display surface for whichever signals were collected; it does not decide whether an unanticipated question can be answered, which is what separates the two practices.

### 192.

The golden signals framework names four metrics to watch first for a running API. Which four should be the starting point, and what does the fourth mean specifically?

- **A.** Latency, traffic, errors and saturation, saturation meaning how full the constraining resource is, not merely how busy it appears.
- **B.** CPU, memory, disk and network, since those are the only resources that can ever be the constraint.
- **C.** Uptime, cost, latency and throughput, since those are the numbers customers care about most.
- **D.** Errors, latency, availability and elasticity, since those cover both failure and demand-tracking behaviour.

**Answer: A.** The four golden signals are latency, traffic, errors and saturation. Saturation specifically measures how full the constraining resource is — queued work against it — which is what actually drives user-visible latency as a system approaches its limit.

- B is wrong: The golden signals are user-facing service signals, not a fixed list of hardware resources, and the actual constraint can also be an external dependency.
- C is wrong: Cost is a separate business concern the golden-signals framework does not include, and the correct fourth signal is saturation, not throughput.
- D is wrong: Elasticity is a design property, not a metric to alert a threshold on, and this list omits traffic and saturation entirely.

### 193.

A team says 'we run two application servers, so we have redundancy.' What has not yet been established about the pair?

- **A.** Whether they sit in independent failure domains (separate hosts, racks or zones), so the event that takes out one cannot also take out the other.
- **B.** Whether the servers are running the newest version of the operating system — a detail that says nothing about whether the two machines could both be lost to the same rack, power feed or zone-level event.
- **C.** Whether the pair has been load tested at its maximum request rate.
- **D.** Whether the servers are billed on a monthly or an annual commitment.

**Answer: A.** Redundancy is duplication placed so that one failure is survivable, which depends on the duplicates sharing no single failure domain. Two servers in the same rack on the same power feed are not redundant against a rack- or feed-level failure even though there are two of them.

- B is wrong: Patch currency is a maintenance concern unrelated to whether the pair can survive a shared failure.
- C is wrong: Capacity testing measures throughput, not whether the two servers share a single point of failure.
- D is wrong: Billing terms have no bearing on whether the pair is placed in independent failure domains.

### 194.

A service is provisioned N+1: three units of load require four running instances. One instance is taken down for planned maintenance. What is true of the remaining capacity?

- **A.** The service is now under-provisioned, since N+1 only covers a single simultaneous unplanned failure, not planned maintenance.
- **B.** Full load can still be carried on the three instances that remain, which is exactly what the extra unit was provisioned for.
- **C.** Traffic must be rejected until the instance returns, because active-passive redundancy requires a promotion step first.
- **D.** The remaining instances must each individually double their capacity to absorb the loss.

**Answer: B.** N+1 provisions one more unit than the load strictly requires, so the loss of any single unit — whether by failure or by planned maintenance — still leaves enough capacity to carry the full load on the survivors.

- A is wrong: N+1 is agnostic to why a unit is unavailable; the spare capacity covers the loss of any one unit regardless of cause.
- C is wrong: Nothing in the scenario states the units are active-passive; N+1 sizing is commonly used with active-active capacity that needs no promotion.
- D is wrong: N+1 sizing already accounts for one unit's worth of spare capacity spread across the pool; no individual instance needs to be resized.

### 195.

A platform can be given more servers by hand whenever traffic grows, and someone remembers to remove them again once traffic falls. Is the platform elastic?

- **A.** Yes, because capacity is eventually returned to its original level once demand drops — mistaking the eventual return of capacity for the automatic, no-human-involved behaviour the definition actually requires.
- **B.** Yes, since the platform can clearly be given more resources and make use of them.
- **C.** No, because the platform has no defined upper bound on how many servers can be added.
- **D.** No, because elasticity means capacity provisioned and released rapidly and in step with demand, which a cycle waiting on someone to remember is not.

**Answer: D.** Elasticity adds automation and bidirectionality on top of scalability: capacity must be provisioned and released without a human deciding each time. A platform that only scales when someone remembers to act on it both ways is scalable, not elastic.

- A is wrong: NIST defines rapid elasticity as capabilities "elastically provisioned and released, in some cases automatically, to scale rapidly outward and inward commensurate with demand"; capacity that comes back whenever a person next remembers is neither rapid nor commensurate with demand.
- B is wrong: Being able to grow with more resources is the definition of scalability, which elasticity implies but is not itself sufficient for.
- C is wrong: An unbounded ceiling is a property of horizontal scaling's headroom, not the reason this platform falls short of elastic.

### 196.

An e-commerce platform automatically adds instances during a flash sale and automatically removes them again once demand returns to normal. Which of the two compared terms best names this behaviour, and what would be lost if only the removal step were dropped?

- **A.** Scalability — and dropping the removal step would make no difference, since scalability never required shrinking in the first place.
- **B.** Elasticity; dropping the automatic removal would leave only scalability, since capacity would grow but never shrink back.
- **C.** Elasticity — and dropping the removal step would remove the platform's ability to add capacity at all.
- **D.** High availability — and dropping the removal step would create a single point of failure.

**Answer: B.** Automatic growth and automatic shrink-back together are elasticity; NIST names this rapid elasticity as one of cloud computing's essential characteristics. Removing only the shrink-back half leaves a system that scales out under load and never scales back in — expensive, not elastic.

- A is wrong: The behaviour described — automatic in both directions — is elasticity's definition, not merely scalability's, so this undercounts what is actually being described.
- C is wrong: Removing the shrink-back half leaves the grow half intact; the platform would still add instances during the sale, just never release them afterwards.
- D is wrong: High availability concerns surviving component failure, not capacity tracking demand; nothing here is about a single point of failure.

### 197.

A team measures the fraction of successful requests as its SLI, and holds an internal target of 99.95% against that measurement — tighter than the 99.9% figure with service credits it publishes to customers. Which term names the internal target, and how does it differ from the customer-facing figure?

- **A.** The SLO, an internal target set on the SLI, distinct from the SLA because missing it carries no contractual consequence on its own.
- **B.** The SLA, since it is the number the organisation is actually held to internally on a day-to-day basis.
- **C.** The SLI, because 99.95% is itself a direct measurement of request success rather than a target.
- **D.** There is no internal target distinct from the customer figure, since a provider only ever tracks the number it publishes.

**Answer: A.** The SLI is the measurement, the SLO is the internal target set on that measurement, and the SLA is the contract with users that attaches consequences to meeting or missing it. Holding the SLO tighter than the SLA, as here, is the standard safety-margin practice.

- B is wrong: The SLA is specifically the external contract with users and their remedy; the tighter, internally-held number here is the SLO, held deliberately stricter as a safety margin.
- C is wrong: 99.95% here is described as a target set on the measurement, not the measurement itself; the SLI is the fraction of successful requests being measured against it.
- D is wrong: Holding an internal target tighter than the externally published figure is standard practice specifically so there is room to act before a contractual consequence is triggered.

### 198.

An application externalises its session data to a shared cache and stores uploaded files in object storage instead of on local disk. Does this make the application stateless, meaning it stores no data at all?

- **A.** Yes — a stateless application by definition has no persistent data anywhere in the system — the specific misreading the concept exists to correct, that no state anywhere is the same claim as no state pinned to one server.
- **B.** Stateless describes where the state lives, not whether the system has any, so no; the application still has state, just not pinned to one server.
- **C.** No, because moving data to a shared cache makes the application highly available instead.
- **D.** Yes, but only once the application is also placed behind a load balancer.

**Answer: B.** Statelessness means no client-specific state is pinned to a particular server between requests. The data still exists — in a shared cache, a database, or object storage — the design choice is only about where it is not stored: locally.

- A is wrong: This is the specific misreading the concept guards against: statelessness is about the locality of state, not its absence.
- C is wrong: A dependency on the shared store's own availability is a real consequence of this design, but it is not the reason the 'no data at all' reading is wrong.
- D is wrong: Statelessness is a property of where the application keeps its data, decided in the code; a load balancer's presence or absence does not change that.

### 199.

An auto-scaling policy terminates an instance mid-shift to bring the group back down to its desired capacity. Which property of the application determines whether any user notices?

- **A.** Whether the group's configured maximum capacity is set high enough to absorb the loss.
- **B.** Whether the application is stateless — an interchangeable instance can be terminated and replaced without anyone's session or in-flight work being tied to it specifically.
- **C.** Whether the instance being terminated was the primary in an active-passive pair.
- **D.** Whether the termination also triggers a scale-out event on a standby instance pool in another region — describing a cross-region event that nothing in the scenario supports, when the change described is a routine single-pool scale-in.

**Answer: B.** Stateless design is what makes instance termination safe: because no request depends on reaching the same instance twice, an auto-scaling group can remove an instance mid-shift and the load balancer simply routes the next request to a survivor, with nothing user-visible lost.

- A is wrong: The maximum bounds how large the group may grow; it says nothing about whether a terminated instance was holding state a user depended on.
- C is wrong: Active-passive versus active-active describes how redundant capacity is deployed, not whether any one instance held irreplaceable client state.
- D is wrong: A routine scale-in within one pool of interchangeable instances is not a cross-region event; it only becomes user-visible if the application is not stateless.

### 200.

A single-writer relational database is running out of capacity on its write path, and the write path cannot be split across multiple nodes. Which capacity move fits, and what does it cost?

- **A.** Vertical scaling — moving the database to a larger instance type — at the cost of a restart and a hard ceiling once the largest available machine is reached.
- **B.** Horizontal scaling — adding more database nodes behind a load balancer — since that removes the single point of failure with no interruption cost.
- **C.** Auto-scaling — letting a scaling group add database instances against a CPU metric.
- **D.** Caching the write path's results so fewer writes reach the database directly.

**Answer: A.** A single-writer path with no way to divide the work is the textbook case for vertical scaling: resize to a bigger instance, at the cost of a restart, and accept that the move is finished once the largest instance type is reached.

- B is wrong: The scenario states the write path cannot be split; adding nodes behind a load balancer does nothing for work that is not distributable.
- C is wrong: Auto-scaling automates adding and removing instances of a distributable workload; it does not apply to a single-writer path that cannot be spread across instances.
- D is wrong: Caching serves repeated reads from a stored copy; it has no mechanism for absorbing writes, which must still reach the authoritative store.

### 201.

A team resizes their single web server to the largest instance type their provider offers, hoping to both raise capacity and reduce outages. What has the resize achieved?

- **A.** Both goals, since a larger instance type also comes with the provider's redundant power and network infrastructure built in — a belief that quietly assumes redundancy under the hypervisor is the same thing as redundancy at the level the application actually runs on.
- **B.** Neither goal, because the resize also required distributing the workload across multiple nodes first.
- **C.** Reduced outages only, since larger instances fail less often than smaller ones.
- **D.** More capacity only. The server is still one machine and still a single point of failure, and it has now reached its ceiling with nowhere further to grow.

**Answer: D.** Vertical scaling raises capacity up to the ceiling of the largest instance type offered, and it stops there — it does not remove the single point of failure a lone server represents, so an availability goal is left unaddressed.

- A is wrong: Infrastructure redundancy underneath the instance does not make the instance itself redundant; the server is still a single point of failure at the application layer.
- B is wrong: Vertical scaling by definition resizes one machine in place; it involves no distribution of the workload across nodes.
- C is wrong: Instance size is not what determines single-point-of-failure risk; a bigger machine is still exactly one machine that can go down.

