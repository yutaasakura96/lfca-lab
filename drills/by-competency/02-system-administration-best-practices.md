<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — System Administration Fundamentals :: Best Practices

27 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A host is compromised, and nobody remembers it exists — it was never entered into any system record. What discipline's absence does that reveal?

- **A.** Monitoring and alerting — the host should have triggered a threshold alert.
- **B.** Asset and inventory management — you cannot patch, secure or decommission what you do not know about.
- **C.** Security baselines — the host fell below the minimum secure configuration.
- **D.** Nothing is missing — the compromise itself is an adequate discovery mechanism.

**Answer: B.** The inventory is the prerequisite every other discipline in this competency quietly assumes: patch cadence applies to the estate it lists, baselines are enforced on the hosts it names, and monitoring watches what it was told exists. A host outside that record is invisible to all of them.

- A is wrong: Monitoring watches only the systems someone configured it to watch, which by construction excludes a forgotten host.
- C is wrong: A baseline shortfall assumes the host is already known and enrolled; the failure here happened before that point.
- D is wrong: Discovering a host only once it is attacked is the failure state the practice exists to avoid, not a substitute for it.

### 2.

A script appends a configuration line to a file every time it runs, rather than checking whether the line is already present. It is scheduled nightly across fifty hosts. What results after a month?

- **A.** Convergence to a single declared state, because the script runs automatically every night.
- **B.** No effect beyond the first run, because the change was already tested once before deployment.
- **C.** Fifty files with duplicated entries; the script is fully automated but not idempotent.
- **D.** Nothing unusual — since the script is automated, running it repeatedly is inherently safe.

**Answer: C.** Automation replaces a manual procedure with a script; idempotency is the separate property that running it twice leaves the same end state with no further change. An unconditional append is automated and not idempotent, and re-running it across a fleet turns one mistake into fifty.

- A is wrong: Being automated says nothing about whether repeated runs are safe; convergence requires the operation itself to check state first.
- B is wrong: A single successful test says nothing about what a second or hundredth run does; only re-running tests for idempotency.
- D is wrong: Idempotency is a property of how the operation is written, not a consequence of it being scheduled or automated.

### 3.

A configuration script is re-run against a host and reports that zero changes were made. What does that result indicate?

- **A.** The configuration-management tool has failed to detect drift, since a healthy tool is expected to report and correct differences every run.
- **B.** An alerting threshold has not yet been crossed, which belongs to a separate practice concerned with notifying someone of a breached condition.
- **C.** The script has not yet been validated in a staging environment, which is a question about where it was tested rather than what it changed.
- **D.** The system already matched the intended state; a no-op second run is the signal of success, not evidence the tool did nothing useful.

**Answer: D.** Idempotent work is typically written as a check followed by a conditional action, or expressed declaratively. A second run reporting no changes is exactly the signal that the system already matches intent, and is read as success rather than as the tool having done nothing useful.

- A is wrong: Detecting no drift and reporting no change is the tool working correctly, not a detection failure.
- B is wrong: Thresholds and alert conditions belong to a different practice entirely and are not what a script's change count reports.
- C is wrong: Where a script was validated is unrelated to what a specific run against a specific host reports.

### 4.

A pre-change snapshot is taken immediately before a risky migration. A week later, the migration is confirmed good. What typically happens to that copy?

- **A.** It automatically becomes part of the routine, retention-scheduled backup regime.
- **B.** It is often discarded, since it existed to undo one identified action rather than to satisfy ongoing retention.
- **C.** It must be kept indefinitely, since any pre-change copy is a permanent compliance record.
- **D.** It is deleted immediately once the change is applied, before the outcome is confirmed.

**Answer: B.** A pre-change copy is tied to one specific change and is often discarded once that change is confirmed good, unlike a routine backup sized against an ongoing recovery point objective. The copy is only useful while the change it guards against remains unconfirmed.

- A is wrong: A pre-change copy exists to undo one identified action; routine backups are a separate, ongoing regime sized by a recovery point objective.
- C is wrong: The change record states where the copy is and how long it is kept, and that period is typically short, not indefinite.
- D is wrong: Deleting it before the change is confirmed good would remove the only rollback that does not depend on the change going as planned.

### 5.

An alert fires when a disk reaches 85% usage. Is that capacity planning?

- **A.** Yes — any statement referencing a resource threshold counts as capacity planning, regardless of whether it describes now or a future planning date.
- **B.** No — it is asset and inventory management confirming the volume exists, which records what systems exist rather than how full they are.
- **C.** No — that is monitoring and alerting reporting the present; capacity planning projects the trend forward to the date the disk will be full.
- **D.** Yes — the 85% figure defines the maintenance window for the expansion work, rather than describing the disk's condition today.

**Answer: C.** Per consensus practice, monitoring reports a value now and alerts when a threshold is crossed — a statement about the present. Capacity planning extrapolates historical utilisation forward against a known ceiling to produce a date, which is what makes procurement and a maintenance window schedulable before they become urgent. The two are complementary, and the planning is only as good as the history the monitoring retained.

- A is wrong: A threshold crossed now is exactly the present-tense statement capacity planning is distinguished from.
- B is wrong: The alert says nothing about whether the volume is recorded in an inventory; it reports a usage level.
- D is wrong: A threshold alert states a current condition; it does not by itself schedule a window for future work.

### 6.

A team keeps every configuration change in Git and requires a reviewed pull request before merging. An auditor asks whether that is change management. What is missing?

- **A.** Nothing — a reviewed pull request already satisfies change management, since every file change already passes through review.
- **B.** The commit history itself, since it records what a file said and who wrote it, which is what version control already provides on its own.
- **C.** Approval and scheduling for changes made by hand on a host, and an archived record for anything that never touches the repository.
- **D.** A defined maintenance window during which merges are permitted, which states only when work may happen rather than whether it was approved.

**Answer: C.** Change management is a human decision process producing an authorisation, distinct from the tool that stores the resulting file state. Git with reviewed pull requests gives history, attribution and file-level review; it does not by itself cover a hand-made change on a host or the impact review and archived approval a full process requires.

- A is wrong: Review gives history and attribution for files, but says nothing about impact review, scheduling, or approval of out-of-band changes.
- B is wrong: That is what version control already provides; it is not the gap the auditor is asking about.
- D is wrong: A window would state when work may happen, not whether it was reviewed and approved at all.

### 7.

An administrator proposes a configuration change and personally approves it before applying it to a system they run. Which control did the process fail to enforce?

- **A.** Scheduling the change into an agreed maintenance window.
- **B.** Recording the change in a version-controlled repository.
- **C.** Nothing — an administrator with authority over the system may approve their own change.
- **D.** Independent approval, meaning the approver must be someone other than the requestor.

**Answer: D.** The control that defines change management is independent approval: the requestor and the approver being different people. Scheduling and recording are separate concerns, and neither substitutes for a second, independent reviewer of the proposed change.

- A is wrong: A window governs when disruptive work may occur; being inside one authorises nothing about whether the change was permitted at all.
- B is wrong: Recording what changed is a separate concern from whether the change was authorised to happen.
- C is wrong: That is the exact self-approval the control forbids, regardless of how much authority the administrator holds.

### 8.

Which question does configuration management answer, as distinct from infrastructure as code?

- **A.** Does this environment exist as declared.
- **B.** Is this operation safe to run a second time.
- **C.** Is this machine configured as declared, rather than whether the machine exists at all.
- **D.** Both ask the same question, since both keep declarations in version control and both re-apply to converge.

**Answer: C.** Configuration management declares and enforces the state inside systems that already exist. Infrastructure as code decides whether the infrastructure itself exists. Both are declarative and both re-apply to converge, which is exactly what makes the pair easy to conflate.

- A is wrong: That is infrastructure as code's question: whether the infrastructure itself has been brought into existence.
- B is wrong: That is a property of a single procedure, which is what automation and idempotency addresses, not the scope of configuration management.
- D is wrong: The shared vocabulary is exactly why they are confusable, but one configures what exists and the other creates what does not yet exist.

### 9.

After a configuration-management playbook is run against a hand-edited host, an operator claims the host now matches the approved baseline. What limits that claim?

- **A.** Only the settings the declaration mentions are corrected; anything it never mentions survives untouched.
- **B.** Baselines are enforced only through configuration management and never through a published, independently maintained industry benchmark.
- **C.** The claim can only be verified once a monitoring alert fires.
- **D.** Nothing limits it — a playbook run always brings every setting into full compliance.

**Answer: A.** The tool changes only what the declaration mentions. Anything a hand edit touched outside that scope survives the run untouched, which is why running the playbook and matching the baseline are different claims.

- B is wrong: Baselines are commonly derived from published benchmarks first and only then held in place by a tool; this reverses that relationship.
- C is wrong: Compliance with a declared baseline is checked by re-applying the declaration, not by waiting for an alert condition.
- D is wrong: A declaration only corrects what it mentions; settings outside its scope are left exactly as the hand edit left them.

### 10.

A new engineer needs to understand why a firewall rule was configured unusually, and has time to research before touching anything. Which artifact should they consult?

- **A.** The runbook covering this firewall, followed step by step, since it explains what to do rather than why the rule was configured this way.
- **B.** The change record showing when the rule was last edited and by whom, without stating why that decision was made or what depends on it.
- **C.** The monitoring dashboard for the firewall's current traffic, which shows values now rather than the reasoning behind the configuration.
- **D.** Documentation — the descriptive record of what the system is and why, written for a reader who has time.

**Answer: D.** Documentation is descriptive reference material consulted by a reader who has time and context. A runbook is prescriptive and written for a stranger under pressure; a change record and a dashboard each capture a narrower fact and neither substitutes for a current-state description of the system and its rationale.

- A is wrong: A runbook instructs a reader under pressure; it deliberately does not explain why the system is built the way it is.
- B is wrong: Even a change record carrying a justification explains one past decision rather than the configuration standing today, and this one carries only who and when.
- C is wrong: A dashboard shows present values, not intent; it is not documentation even though it describes the system.

### 11.

A host has two hundred recorded changes in its history but no single document stating what the host currently runs or why. What is missing?

- **A.** Additional change records covering the gaps in the history, which still requires reconstructing the current state from that history.
- **B.** A runbook for restoring the host after a failure, which instructs what to do rather than describing what the host currently runs.
- **C.** Nothing — a complete change history is equivalent to documentation, since every past change is already recorded somewhere within it.
- **D.** Documentation, since reconstructing current state from a change history is exactly the work it exists to save.

**Answer: D.** Documentation states what is true now, kept next to the system it describes. A change history, however complete, records what happened over time and leaves reconstructing the present state as unfinished work — which is precisely the burden documentation removes.

- A is wrong: More history still requires reconstruction; it does not itself state the current configuration and its rationale.
- B is wrong: A runbook instructs what to do during an incident; it does not describe what the host is or why it is configured as it is.
- C is wrong: A change history and a current-state description answer different questions; one being complete does not produce the other.

### 12.

A change is applied inside an agreed maintenance window but was never reviewed or approved beforehand. Is the change authorised?

- **A.** No. A window states only when disruptive work may occur, not whether it may happen at all.
- **B.** Yes — being inside the agreed window is itself the authorisation.
- **C.** Only if the change's requestor is also its approver.
- **D.** Yes, provided the change is routine rather than an emergency fix.

**Answer: A.** A maintenance window is an agreed period for disruptive work, communicated in advance to those it affects. It answers when work may be done, not whether it was ever approved — an unapproved change does not become permissible because the calendar allowed it.

- B is wrong: An unapproved change does not become permissible because it was applied inside an agreed period for disruptive work.
- C is wrong: That describes the exact self-approval an independent-review control forbids; it does not grant authorisation.
- D is wrong: Whether a change follows a routine or an expedited schedule is a cadence question, not a substitute for review and approval.

### 13.

A dashboard displays CPU, memory and error rate for every host, but nobody is subscribed to any notification channel. A service is down for six hours before anyone notices. Which discipline is missing?

- **A.** Logging — the systemd journal was not queried during the outage.
- **B.** Capacity planning — the growth trend toward exhaustion was never projected.
- **C.** Nothing is missing — a dashboard collecting metrics is monitoring and alerting together.
- **D.** Alerting — collection ran and the evidence exists, but nobody was interrupted in time to act on it.

**Answer: D.** Monitoring is continuous collection; alerting is the notification that interrupts a human when a condition is breached. A dashboard nobody watches makes evidence available afterward but detects nothing at the moment it happens, which is the gap alerting exists to close.

- A is wrong: A local log store is read after someone already suspects a problem; it is not the mechanism that raises the suspicion in the first place.
- B is wrong: Nothing in the scenario describes a resource trending toward a ceiling; the failure is that nobody was told about an active outage.
- C is wrong: Collection without a notification path that reaches someone obliged to answer is monitoring alone, and detects nothing unattended.

### 14.

A low-severity alert fires every few minutes for a condition that needs no action, until the on-call channel mutes all notifications from it. A real outage is later missed. What failed?

- **A.** The runbook for the outage was never written, leaving nobody with a step-by-step procedure to follow once the outage was noticed.
- **B.** Alert quality — a condition that needed no action trained people to ignore the channel, so the next real alert was dismissed too.
- **C.** The outage happened outside an agreed maintenance window, so the disruption itself was never pre-agreed with the people it affected.
- **D.** Escalation — the notification reached an unstaffed channel, so nobody was ever in a position to see it fire in the first place.

**Answer: B.** Alerting on conditions that need no action trains people to ignore alerts, so the next genuine one is dismissed with it. The distinguishing feature here is that the channel was staffed and reachable — the failure is alert quality, not the separate case of a notification reaching nobody.

- A is wrong: Nothing in the scenario turns on whether a procedure existed; the failure is that the alert was never seen at all.
- C is wrong: Whether disruptive work is scheduled is unrelated to why an unscheduled outage's alert was ignored.
- D is wrong: That is a different, real failure mode this practice also names, but it is not what is described: the channel was staffed, and was muted deliberately.

### 15.

A naming scheme fixes role, environment, region and an index in the same order for every host. Per consensus practice, what is that scheme's primary purpose?

- **A.** To serve as the authoritative record of what a host is and who owns it, replacing the need to consult the inventory separately.
- **B.** To ensure no two hosts in the estate can ever hold the same name, which the register that assigns names enforces rather than the pattern those names follow.
- **C.** To let a reader infer a host's identity and purpose from its name alone, without consulting anything else.
- **D.** To guarantee that every host of a given role is configured identically, so a fix written for one of them applies unchanged to the rest.

**Answer: C.** In most implementations of this consensus practice, a fixed, ordered naming scheme lets a reader decide from the name alone whether a host is production or test before deciding how urgently to react. The convention encodes information rather than storing it, so trusting a name as a record — of ownership or of anything else the inventory should carry — is exactly the failure mode the practice invites.

- A is wrong: A name is a string someone typed and encodes information; it does not store it, so treating it as the authoritative record is the practice's usual failure mode.
- B is wrong: Uniqueness across an estate is enforced by whatever assigns and records names; a convention only fixes the shape a name takes.
- D is wrong: That uniformity is standardization's goal; a naming scheme only makes identity readable, not configuration identical.

### 16.

An organisation patches monthly and has no way for an actively exploited vulnerability to bypass that schedule. What is missing from their patch cadence?

- **A.** An inventory of patchable assets, since cadence is one decision inside the whole tracking-testing-applying-verifying practice.
- **B.** An expedited path — a cadence with no emergency route leaves an actively exploited vulnerability waiting for the calendar.
- **C.** A defined maintenance window for the monthly cycle.
- **D.** Nothing — a monthly schedule with no exception path is still a complete cadence.

**Answer: B.** Patch cadence is the rhythm updates are applied on, together with the expedited path critical fixes take when they cannot wait for it. A schedule that never states that exception leaves an actively exploited vulnerability exposed for the length of a full cycle.

- A is wrong: That names the broader patch management practice cadence sits inside; the specific gap described is the missing exception path, not asset tracking.
- C is wrong: A monthly window already exists in the scenario; the gap is the exception path for something that cannot wait for it.
- D is wrong: A critical security fix is expected to leave the routine schedule rather than wait for it, which a schedule with no exception cannot do.

### 17.

A patch is deployed first to a small set of canary systems, then to the rest of the estate once no breakage appears. Which decision does that phasing belong to?

- **A.** Patch management as a whole, since testing, deployment and verification are all part of the wider practice.
- **B.** Patch cadence — the scheduling decision for how and when updates roll out, including the order deployment follows.
- **C.** Testing before production, since canaries function as a staging environment.
- **D.** Maintenance windows, since canaries define which hosts fall inside the agreed window.

**Answer: B.** Patch cadence names the scheduling decision inside patch management: how often updates go out and, within that, the order a rollout follows. Canary-first deployment is a cadence-level rollout decision, distinct from the broader practice, from pre-production testing in an isolated environment, and from the timing question a maintenance window answers.

- A is wrong: Naming the whole surrounding practice loses the specific decision the question asks about — the rollout order is one decision inside it.
- C is wrong: Canary systems are live production hosts receiving the real patch, not an isolated environment used before production is touched.
- D is wrong: A window governs when disruptive work may occur; it does not decide which hosts receive a phased rollout first.

### 18.

Per consensus practice, what trade-off does the principle of least astonishment argue for?

- **A.** Conventional, expected defaults over clever or unusual configurations, because a surprising setup fails badly when nobody has time to read during an incident.
- **B.** Optimised, non-standard configurations, since performance should take priority over convention even when the result surprises an operator.
- **C.** Identical configuration across every host regardless of role, so that no two machines of any kind are ever allowed to differ.
- **D.** An enforceable minimum configuration, reviewed and approved centrally, rather than a design preference recognised by convention alone.

**Answer: A.** Per consensus practice, the principle of least astonishment argues for conventional defaults over clever ones, because a surprising setup fails during incidents when nobody has time to read. It is a design preference recognised at recall level, not an enforceable control like a baseline.

- B is wrong: That is the opposite trade-off from the one this principle argues for; it favours the conventional choice over the clever one.
- C is wrong: Uniformity across hosts of the same role is standardization's claim, not what this principle argues for.
- D is wrong: That describes a baseline; this principle is a design preference for unsurprising behaviour, not an enforceable control.

### 19.

A responder unfamiliar with a system is paged at 03:00 to restore a service that has failed. Which artifact should they follow?

- **A.** Documentation — it explains why the system is built the way it is.
- **B.** The runbook, a numbered, sequential procedure with an expected result at each step, written for exactly this situation.
- **C.** The disaster recovery plan governing activation criteria and notification.
- **D.** Any document describing the system, since documentation and runbooks serve the same purpose under pressure.

**Answer: B.** The conditions a runbook is used under are the conditions people reason worst in. It is written as a sequential procedure with no step assumed, precisely because a step obvious to the author is the step a stranger will get wrong at night.

- A is wrong: Documentation is descriptive and assumes a reader with time; handed to someone at 03:00 who has never seen the system, an explanation is close to useless.
- C is wrong: That plan is broader and governs whether a disaster is declared and who is told; the runbook is the procedure layer inside it, and is what this task needs.
- D is wrong: They are read by the same kind of person at the worst possible time, but one instructs and the other explains, and only one is safe to follow blind.

### 20.

A runbook has sat in the team wiki for two years and has never once been executed. What is the state of its reliability?

- **A.** Unknown. An untested runbook is an assumption, since its steps rot silently as the system changes.
- **B.** Verified, since testing before production would have caught any drift.
- **C.** Verified, since the documentation for the same system is kept current.
- **D.** Reliable — storing the procedure correctly is what maintaining a runbook means.

**Answer: A.** A runbook that has never been exercised is an assumption about whether its steps still work, not evidence that they do. Systems change underneath stored procedures, and the moment someone needs the runbook is the worst possible time to discover a step no longer applies.

- B is wrong: That practice tests whether a change is safe to deploy; it does not exercise whether a stored procedure's steps still match the system.
- C is wrong: Documentation staying current says nothing about whether a separate, unexecuted procedure still works.
- D is wrong: Storage is not maintenance; a runbook's steps can silently stop matching the system it describes.

### 21.

Two servers of the same role differ because two different engineers each made their own configuration choices, and neither choice was ever reviewed. What discipline's absence explains this?

- **A.** Standardization — the servers should be rebuilt from a single golden image, which gives uniformity but not a reviewed security floor.
- **B.** Configuration management — a tool should have converged both servers automatically, once someone declared a state for it to enforce.
- **C.** Security baselines — a reviewed, approved minimum configuration removes security from the discretion of whoever happened to build the machine.
- **D.** Nothing is missing — a system running more security controls than another is still compliant.

**Answer: C.** A security baseline is a defined minimum configuration, formally reviewed and agreed, applied to every system of a given type. It removes security decisions from individual discretion, which is exactly what two divergent, unreviewed configurations of the same role indicates is missing.

- A is wrong: Standardization is the general uniformity goal; the specific control missing here is a reviewed, approved security floor.
- B is wrong: A tool enforces whatever state is declared; it does not by itself supply the reviewed security minimum that state should contain.
- D is wrong: Compliance is measured against the defined floor, not against how a system compares to a less-secure neighbour.

### 22.

An administrator holds root on every host in the fleet, but the change process still requires someone else to approve any change that administrator proposes. What does that arrangement demonstrate?

- **A.** Least privilege — the administrator's access has been scoped to what the role needs.
- **B.** Role-based deprovisioning, since the administrator's excess privilege will eventually be revoked once their role changes again.
- **C.** Separation of duties — no single identity, however privileged, can both make and approve a change alone.
- **D.** Nothing structural — the control applies only to staff below root, so an administrator holding root on every host falls outside its reach entirely.

**Answer: C.** Separation of duties splits a sensitive workflow so no single person can complete it alone, regardless of that person's privilege. Least privilege is a different axis entirely — the size of one identity's authority — and an administrator with root on every host still cannot self-approve a change where duties are genuinely separated.

- A is wrong: Least privilege is about the size of one identity's authority; root on every host is the opposite of a scoped grant.
- B is wrong: Nothing in the scenario describes revoking access on a role change; the control shown operates at the moment of the change itself.
- D is wrong: The control constrains how many identities a workflow requires, and it is not waived by how privileged any one of those identities happens to be.

### 23.

Per consensus practice, what does having a named owner for a service establish, as distinct from the on-call responder or the asset record?

- **A.** The same accountability as the on-call responder, since both may be contacted during an incident.
- **B.** A record of the service's existence, indistinguishable from its inventory entry, rather than an accountability held by any one person.
- **C.** Responsibility for revoking the service's credentials when staff depart, which belongs to the separate offboarding process instead.
- **D.** Accountability for the service's health, cost and lifecycle over its life, not just handling one incident or recording its existence.

**Answer: D.** Per consensus practice, every service has a named owner accountable for its health, cost and lifecycle, so nothing is silently unmaintained. That is distinct from the on-call responder, who handles one incident, and from the asset record, which stores the name rather than the accountability.

- A is wrong: Being reachable during an incident is not the same as holding ongoing accountability for the service's health, cost and lifecycle.
- B is wrong: The inventory stores the service's name and details; ownership is the accountability attached to it, not the record itself.
- C is wrong: Revoking credentials on departure is offboarding's job; service ownership is accountable for the service, not for that specific process.

### 24.

What is the "snowflake host" problem that standardization addresses?

- **A.** A server built and maintained by hand, whose configuration exists nowhere but on the server itself, so no fix or script reliably applies to it.
- **B.** A host whose configuration-management tool has stopped converging it to the declared state, which is drift within an already-managed host.
- **C.** A host that falls short of the organisation's minimum secure configuration, which is a compliance gap rather than an unmanaged snowflake.
- **D.** Any host that has ever been patched by hand, even one whose configuration is otherwise fully recorded elsewhere and rebuildable from a known, reviewed specification.

**Answer: A.** Standardization keeps machines of the same role configured alike so a fix, script or runbook applies to more than one host. The snowflake is the failure case: a hand-built server that works, that nobody dares touch, and whose configuration is recorded nowhere else.

- B is wrong: That describes drift within a managed host, a narrower failure than a host that was never brought under management at all.
- C is wrong: That is a security-baseline shortfall, a compliance question distinct from whether the host is configured like its peers at all.
- D is wrong: One manual patch does not make a host unmanageable; the problem is a host whose configuration lives only on itself.

### 25.

A change has passed every test in staging but has no documented way to be undone. What is still true about its risk?

- **A.** The risk is fully mitigated, since a pre-change snapshot always accompanies staging tests.
- **B.** The risk remains unbounded; testing reduces the chance of a break, but only a rollback path bounds the damage if it happens anyway.
- **C.** The risk is eliminated, because staging testing already proved the change safe under every condition production could present.
- **D.** The risk is bounded by the maintenance window the change will run inside, which limits only when the work happens, not how far it spreads.

**Answer: B.** Testing and a rollback path address different failure moments: testing tries to prevent the break, and the rollback path bounds it if testing missed something. A tested change with no way back is still an unbounded risk.

- A is wrong: Testing establishes nothing about whether a restorable copy exists; the two are separate disciplines.
- C is wrong: A test reduces the chance of failure; it does not bound the damage of the failure it missed.
- D is wrong: A window governs when disruptive work may happen, not how far the damage from a failed change can spread.

### 26.

A departing employee's Unix login account is disabled the same day they leave. Is offboarding complete?

- **A.** No. SSH keys, API tokens, VPN certificates, third-party accounts and shared secrets typically survive the disabling of that one account.
- **B.** Yes — disabling the primary login account revokes everything that identity could do, since no other credential is able to outlive that one account.
- **C.** Yes — least privilege already limited what that account could reach, so nothing further needs to be revoked once the person departs.
- **D.** No — the account must first be added to the asset inventory, before any credential attached to the departing employee can be revoked.

**Answer: A.** Onboarding failures announce themselves within the hour; offboarding failures are silent, because a credential still valid and attached to nobody is watched by nobody. Disabling the login account is only the start — installed keys, tokens, certificates and shared secrets all typically outlive it.

- B is wrong: An enumerated list of everything an identity can hold typically extends well beyond the one account that was disabled.
- C is wrong: Least privilege bounds how much an identity holds at any moment; offboarding is the separate question of completely removing what it holds when it departs.
- D is wrong: The inventory records systems and ownership; it is not a prerequisite for revoking a departing employee's credentials.

### 27.

A team reverts a bad commit in their configuration repository. What is true immediately afterward?

- **A.** The declaration has changed back; nothing on any host changes until the reverted state is re-applied.
- **B.** The running system is restored to the previous state, as if reverting a commit undid the change on every host that was running it.
- **C.** A restorable snapshot of the affected host has been created automatically, independent of anything recorded in the repository itself.
- **D.** The change has been approved for release, as though editing the repository were itself the independent review step it requires.

**Answer: A.** Version control preserves changes as someone meant them, and a revert is one more such change. The limit is precise: reverting alters the declaration, and nothing happens on any host until a tool or a person re-applies it.

- B is wrong: "We reverted it" describes an intention restored, not an outage ended; the host is untouched until something re-applies the declaration.
- C is wrong: A revert changes a file in a repository; it does not capture a copy of any running system.
- D is wrong: Reverting a commit is an edit to the declaration, not an approval decision made by an independent reviewer.

