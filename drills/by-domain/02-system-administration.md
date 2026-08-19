<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — System Administration Fundamentals

391 question(s), every question in the bank for this scope, in concept order.

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
- **C.** Nothing unusual — since the script is automated, running it repeatedly is inherently safe.
- **D.** Fifty files with duplicated entries; the script is fully automated but not idempotent.

**Answer: D.** Automation replaces a manual procedure with a script; idempotency is the separate property that running it twice leaves the same end state with no further change. An unconditional append is automated and not idempotent, and re-running it across a fleet turns one mistake into fifty.

- A is wrong: Being automated says nothing about whether repeated runs are safe; convergence requires the operation itself to check state first.
- B is wrong: A single successful test says nothing about what a second or hundredth run does; only re-running tests for idempotency.
- C is wrong: Idempotency is a property of how the operation is written, not a consequence of it being scheduled or automated.

### 3.

A configuration script is re-run against a host and reports that zero changes were made. What does that result indicate?

- **A.** The configuration-management tool has failed to detect drift, since a healthy tool is expected to report and correct differences every run.
- **B.** An alerting threshold has not yet been crossed, which belongs to a separate practice concerned with notifying someone of a breached condition.
- **C.** The system already matched the intended state; a no-op second run is the signal of success, not evidence the tool did nothing useful.
- **D.** The script has not yet been validated in a staging environment, which is a question about where it was tested rather than what it changed.

**Answer: C.** Idempotent work is typically written as a check followed by a conditional action, or expressed declaratively. A second run reporting no changes is exactly the signal that the system already matches intent, and is read as success rather than as the tool having done nothing useful.

- A is wrong: Detecting no drift and reporting no change is the tool working correctly, not a detection failure.
- B is wrong: Thresholds and alert conditions belong to a different practice entirely and are not what a script's change count reports.
- D is wrong: Where a script was validated is unrelated to what a specific run against a specific host reports.

### 4.

A pre-change snapshot is taken immediately before a risky migration. A week later, the migration is confirmed good. What typically happens to that copy?

- **A.** It automatically becomes part of the routine, retention-scheduled backup regime.
- **B.** It must be kept indefinitely, since any pre-change copy is a permanent compliance record.
- **C.** It is often discarded, since it existed to undo one identified action rather than to satisfy ongoing retention.
- **D.** It is deleted immediately once the change is applied, before the outcome is confirmed.

**Answer: C.** A pre-change copy is tied to one specific change and is often discarded once that change is confirmed good, unlike a routine backup sized against an ongoing recovery point objective. The copy is only useful while the change it guards against remains unconfirmed.

- A is wrong: A pre-change copy exists to undo one identified action; routine backups are a separate, ongoing regime sized by a recovery point objective.
- B is wrong: The change record states where the copy is and how long it is kept, and that period is typically short, not indefinite.
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
- **C.** A defined maintenance window during which merges are permitted, which states only when work may happen rather than whether it was approved.
- **D.** Approval and scheduling for changes made by hand on a host, and an archived record for anything that never touches the repository.

**Answer: D.** Change management is a human decision process producing an authorisation, distinct from the tool that stores the resulting file state. Git with reviewed pull requests gives history, attribution and file-level review; it does not by itself cover a hand-made change on a host or the impact review and archived approval a full process requires.

- A is wrong: Review gives history and attribution for files, but says nothing about impact review, scheduling, or approval of out-of-band changes.
- B is wrong: That is what version control already provides; it is not the gap the auditor is asking about.
- C is wrong: A window would state when work may happen, not whether it was reviewed and approved at all.

### 7.

An administrator proposes a configuration change and personally approves it before applying it to a system they run. Which control did the process fail to enforce?

- **A.** Scheduling the change into an agreed maintenance window.
- **B.** Recording the change in a version-controlled repository.
- **C.** Independent approval, meaning the approver must be someone other than the requestor.
- **D.** Nothing — an administrator with authority over the system may approve their own change.

**Answer: C.** The control that defines change management is independent approval: the requestor and the approver being different people. Scheduling and recording are separate concerns, and neither substitutes for a second, independent reviewer of the proposed change.

- A is wrong: A window governs when disruptive work may occur; being inside one authorises nothing about whether the change was permitted at all.
- B is wrong: Recording what changed is a separate concern from whether the change was authorised to happen.
- D is wrong: That is the exact self-approval the control forbids, regardless of how much authority the administrator holds.

### 8.

Which question does configuration management answer, as distinct from infrastructure as code?

- **A.** Does this environment exist as declared.
- **B.** Is this machine configured as declared, rather than whether the machine exists at all.
- **C.** Is this operation safe to run a second time.
- **D.** Both ask the same question, since both keep declarations in version control and both re-apply to converge.

**Answer: B.** Configuration management declares and enforces the state inside systems that already exist. Infrastructure as code decides whether the infrastructure itself exists. Both are declarative and both re-apply to converge, which is exactly what makes the pair easy to conflate.

- A is wrong: That is infrastructure as code's question: whether the infrastructure itself has been brought into existence.
- C is wrong: That is a property of a single procedure, which is what automation and idempotency addresses, not the scope of configuration management.
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

- **A.** Documentation, since reconstructing current state from a change history is exactly the work it exists to save.
- **B.** Additional change records covering the gaps in the history, which still requires reconstructing the current state from that history.
- **C.** A runbook for restoring the host after a failure, which instructs what to do rather than describing what the host currently runs.
- **D.** Nothing — a complete change history is equivalent to documentation, since every past change is already recorded somewhere within it.

**Answer: A.** Documentation states what is true now, kept next to the system it describes. A change history, however complete, records what happened over time and leaves reconstructing the present state as unfinished work — which is precisely the burden documentation removes.

- B is wrong: More history still requires reconstruction; it does not itself state the current configuration and its rationale.
- C is wrong: A runbook instructs what to do during an incident; it does not describe what the host is or why it is configured as it is.
- D is wrong: A change history and a current-state description answer different questions; one being complete does not produce the other.

### 12.

A change is applied inside an agreed maintenance window but was never reviewed or approved beforehand. Is the change authorised?

- **A.** Yes — being inside the agreed window is itself the authorisation.
- **B.** Only if the change's requestor is also its approver.
- **C.** No. A window states only when disruptive work may occur, not whether it may happen at all.
- **D.** Yes, provided the change is routine rather than an emergency fix.

**Answer: C.** A maintenance window is an agreed period for disruptive work, communicated in advance to those it affects. It answers when work may be done, not whether it was ever approved — an unapproved change does not become permissible because the calendar allowed it.

- A is wrong: An unapproved change does not become permissible because it was applied inside an agreed period for disruptive work.
- B is wrong: That describes the exact self-approval an independent-review control forbids; it does not grant authorisation.
- D is wrong: Whether a change follows a routine or an expedited schedule is a cadence question, not a substitute for review and approval.

### 13.

A dashboard displays CPU, memory and error rate for every host, but nobody is subscribed to any notification channel. A service is down for six hours before anyone notices. Which discipline is missing?

- **A.** Logging — the systemd journal was not queried during the outage.
- **B.** Alerting — collection ran and the evidence exists, but nobody was interrupted in time to act on it.
- **C.** Capacity planning — the growth trend toward exhaustion was never projected.
- **D.** Nothing is missing — a dashboard collecting metrics is monitoring and alerting together.

**Answer: B.** Monitoring is continuous collection; alerting is the notification that interrupts a human when a condition is breached. A dashboard nobody watches makes evidence available afterward but detects nothing at the moment it happens, which is the gap alerting exists to close.

- A is wrong: A local log store is read after someone already suspects a problem; it is not the mechanism that raises the suspicion in the first place.
- C is wrong: Nothing in the scenario describes a resource trending toward a ceiling; the failure is that nobody was told about an active outage.
- D is wrong: Collection without a notification path that reaches someone obliged to answer is monitoring alone, and detects nothing unattended.

### 14.

A low-severity alert fires every few minutes for a condition that needs no action, until the on-call channel mutes all notifications from it. A real outage is later missed. What failed?

- **A.** The runbook for the outage was never written, leaving nobody with a step-by-step procedure to follow once the outage was noticed.
- **B.** The outage happened outside an agreed maintenance window, so the disruption itself was never pre-agreed with the people it affected.
- **C.** Alert quality — a condition that needed no action trained people to ignore the channel, so the next real alert was dismissed too.
- **D.** Escalation — the notification reached an unstaffed channel, so nobody was ever in a position to see it fire in the first place.

**Answer: C.** Alerting on conditions that need no action trains people to ignore alerts, so the next genuine one is dismissed with it. The distinguishing feature here is that the channel was staffed and reachable — the failure is alert quality, not the separate case of a notification reaching nobody.

- A is wrong: Nothing in the scenario turns on whether a procedure existed; the failure is that the alert was never seen at all.
- B is wrong: Whether disruptive work is scheduled is unrelated to why an unscheduled outage's alert was ignored.
- D is wrong: That is a different, real failure mode this practice also names, but it is not what is described: the channel was staffed, and was muted deliberately.

### 15.

A naming scheme fixes role, environment, region and an index in the same order for every host. Per consensus practice, what is that scheme's primary purpose?

- **A.** To serve as the authoritative record of what a host is and who owns it, replacing the need to consult the inventory separately.
- **B.** To ensure no two hosts in the estate can ever hold the same name, which the register that assigns names enforces rather than the pattern those names follow.
- **C.** To guarantee that every host of a given role is configured identically, so a fix written for one of them applies unchanged to the rest.
- **D.** To let a reader infer a host's identity and purpose from its name alone, without consulting anything else.

**Answer: D.** In most implementations of this consensus practice, a fixed, ordered naming scheme lets a reader decide from the name alone whether a host is production or test before deciding how urgently to react. The convention encodes information rather than storing it, so trusting a name as a record — of ownership or of anything else the inventory should carry — is exactly the failure mode the practice invites.

- A is wrong: A name is a string someone typed and encodes information; it does not store it, so treating it as the authoritative record is the practice's usual failure mode.
- B is wrong: Uniqueness across an estate is enforced by whatever assigns and records names; a convention only fixes the shape a name takes.
- C is wrong: That uniformity is standardization's goal; a naming scheme only makes identity readable, not configuration identical.

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

- **A.** Optimised, non-standard configurations, since performance should take priority over convention even when the result surprises an operator.
- **B.** Conventional, expected defaults over clever or unusual configurations, because a surprising setup fails badly when nobody has time to read during an incident.
- **C.** Identical configuration across every host regardless of role, so that no two machines of any kind are ever allowed to differ.
- **D.** An enforceable minimum configuration, reviewed and approved centrally, rather than a design preference recognised by convention alone.

**Answer: B.** Per consensus practice, the principle of least astonishment argues for conventional defaults over clever ones, because a surprising setup fails during incidents when nobody has time to read. It is a design preference recognised at recall level, not an enforceable control like a baseline.

- A is wrong: That is the opposite trade-off from the one this principle argues for; it favours the conventional choice over the clever one.
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

- **A.** Verified, since testing before production would have caught any drift.
- **B.** Verified, since the documentation for the same system is kept current.
- **C.** Unknown. An untested runbook is an assumption, since its steps rot silently as the system changes.
- **D.** Reliable — storing the procedure correctly is what maintaining a runbook means.

**Answer: C.** A runbook that has never been exercised is an assumption about whether its steps still work, not evidence that they do. Systems change underneath stored procedures, and the moment someone needs the runbook is the worst possible time to discover a step no longer applies.

- A is wrong: That practice tests whether a change is safe to deploy; it does not exercise whether a stored procedure's steps still match the system.
- B is wrong: Documentation staying current says nothing about whether a separate, unexecuted procedure still works.
- D is wrong: Storage is not maintenance; a runbook's steps can silently stop matching the system it describes.

### 21.

Two servers of the same role differ because two different engineers each made their own configuration choices, and neither choice was ever reviewed. What discipline's absence explains this?

- **A.** Standardization — the servers should be rebuilt from a single golden image, which gives uniformity but not a reviewed security floor.
- **B.** Security baselines — a reviewed, approved minimum configuration removes security from the discretion of whoever happened to build the machine.
- **C.** Configuration management — a tool should have converged both servers automatically, once someone declared a state for it to enforce.
- **D.** Nothing is missing — a system running more security controls than another is still compliant.

**Answer: B.** A security baseline is a defined minimum configuration, formally reviewed and agreed, applied to every system of a given type. It removes security decisions from individual discretion, which is exactly what two divergent, unreviewed configurations of the same role indicates is missing.

- A is wrong: Standardization is the general uniformity goal; the specific control missing here is a reviewed, approved security floor.
- C is wrong: A tool enforces whatever state is declared; it does not by itself supply the reviewed security minimum that state should contain.
- D is wrong: Compliance is measured against the defined floor, not against how a system compares to a less-secure neighbour.

### 22.

An administrator holds root on every host in the fleet, but the change process still requires someone else to approve any change that administrator proposes. What does that arrangement demonstrate?

- **A.** Least privilege — the administrator's access has been scoped to what the role needs.
- **B.** Role-based deprovisioning, since the administrator's excess privilege will eventually be revoked once their role changes again.
- **C.** Nothing structural — the control applies only to staff below root, so an administrator holding root on every host falls outside its reach entirely.
- **D.** Separation of duties — no single identity, however privileged, can both make and approve a change alone.

**Answer: D.** Separation of duties splits a sensitive workflow so no single person can complete it alone, regardless of that person's privilege. Least privilege is a different axis entirely — the size of one identity's authority — and an administrator with root on every host still cannot self-approve a change where duties are genuinely separated.

- A is wrong: Least privilege is about the size of one identity's authority; root on every host is the opposite of a scoped grant.
- B is wrong: Nothing in the scenario describes revoking access on a role change; the control shown operates at the moment of the change itself.
- C is wrong: The control constrains how many identities a workflow requires, and it is not waived by how privileged any one of those identities happens to be.

### 23.

Per consensus practice, what does having a named owner for a service establish, as distinct from the on-call responder or the asset record?

- **A.** The same accountability as the on-call responder, since both may be contacted during an incident.
- **B.** Accountability for the service's health, cost and lifecycle over its life, not just handling one incident or recording its existence.
- **C.** A record of the service's existence, indistinguishable from its inventory entry, rather than an accountability held by any one person.
- **D.** Responsibility for revoking the service's credentials when staff depart, which belongs to the separate offboarding process instead.

**Answer: B.** Per consensus practice, every service has a named owner accountable for its health, cost and lifecycle, so nothing is silently unmaintained. That is distinct from the on-call responder, who handles one incident, and from the asset record, which stores the name rather than the accountability.

- A is wrong: Being reachable during an incident is not the same as holding ongoing accountability for the service's health, cost and lifecycle.
- C is wrong: The inventory stores the service's name and details; ownership is the accountability attached to it, not the record itself.
- D is wrong: Revoking credentials on departure is offboarding's job; service ownership is accountable for the service, not for that specific process.

### 24.

What is the "snowflake host" problem that standardization addresses?

- **A.** A host whose configuration-management tool has stopped converging it to the declared state, which is drift within an already-managed host.
- **B.** A host that falls short of the organisation's minimum secure configuration, which is a compliance gap rather than an unmanaged snowflake.
- **C.** Any host that has ever been patched by hand, even one whose configuration is otherwise fully recorded elsewhere and rebuildable from a known, reviewed specification.
- **D.** A server built and maintained by hand, whose configuration exists nowhere but on the server itself, so no fix or script reliably applies to it.

**Answer: D.** Standardization keeps machines of the same role configured alike so a fix, script or runbook applies to more than one host. The snowflake is the failure case: a hand-built server that works, that nobody dares touch, and whose configuration is recorded nowhere else.

- A is wrong: That describes drift within a managed host, a narrower failure than a host that was never brought under management at all.
- B is wrong: That is a security-baseline shortfall, a compliance question distinct from whether the host is configured like its peers at all.
- C is wrong: One manual patch does not make a host unmanageable; the problem is a host whose configuration lives only on itself.

### 25.

A change has passed every test in staging but has no documented way to be undone. What is still true about its risk?

- **A.** The risk remains unbounded; testing reduces the chance of a break, but only a rollback path bounds the damage if it happens anyway.
- **B.** The risk is fully mitigated, since a pre-change snapshot always accompanies staging tests.
- **C.** The risk is eliminated, because staging testing already proved the change safe under every condition production could present.
- **D.** The risk is bounded by the maintenance window the change will run inside, which limits only when the work happens, not how far it spreads.

**Answer: A.** Testing and a rollback path address different failure moments: testing tries to prevent the break, and the rollback path bounds it if testing missed something. A tested change with no way back is still an unbounded risk.

- B is wrong: Testing establishes nothing about whether a restorable copy exists; the two are separate disciplines.
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

- **A.** The running system is restored to the previous state, as if reverting a commit undid the change on every host that was running it.
- **B.** The declaration has changed back; nothing on any host changes until the reverted state is re-applied.
- **C.** A restorable snapshot of the affected host has been created automatically, independent of anything recorded in the repository itself.
- **D.** The change has been approved for release, as though editing the repository were itself the independent review step it requires.

**Answer: B.** Version control preserves changes as someone meant them, and a revert is one more such change. The limit is precise: reverting alters the declaration, and nothing happens on any host until a tool or a person re-applies it.

- A is wrong: "We reverted it" describes an intention restored, not an outage ended; the host is untouched until something re-applies the declaration.
- C is wrong: A revert changes a file in a repository; it does not capture a copy of any running system.
- D is wrong: Reverting a commit is an edit to the declaration, not an approval decision made by an independent reviewer.

### 28.

What does the 3-2-1 backup rule prescribe?

- **A.** Three full backups, two differentials, and one incremental each week.
- **B.** Three copies of the data, on two types of media, with one held off-site.
- **C.** Three sites, two of them warm, and one hot.
- **D.** Three restore tests a year, two of them full, and one tabletop.

**Answer: B.** Three copies, two media types, one off-site. It is a compact expression of what actually makes backups survive a disaster: more than one copy, not all vulnerable to the same failure mode, and not all in the same building.

- A is wrong: The rule says nothing about backup types or schedule; it constrains copies, media and location.
- C is wrong: Site tiers are a separate decision driven by recovery time, not by this rule.
- D is wrong: Testing cadence is a distinct practice and is not what the numbers refer to.

### 29.

A retention policy keeps daily backups for 14 days and nothing longer. A corruption introduced 40 days ago is discovered today. What is the consequence?

- **A.** The oldest retained backup predates the corruption and can therefore be restored intact.
- **B.** Replication to the standby site preserves an uncorrupted version.
- **C.** The recovery point objective determines whether the data is recoverable.
- **D.** No clean copy remains, because every retained backup already contains the corruption.

**Answer: D.** Retention balances recovery reach against storage cost and compliance obligations. It sets the oldest state you can return to, so a fault discovered outside the window is unrecoverable regardless of how reliable the backups were.

- A is wrong: The oldest retained copy is 14 days old, which is well after the corruption occurred.
- B is wrong: Replication tracks the current state and would have copied the corruption when it happened.
- C is wrong: That target describes tolerable data loss in a recovery, not how far back copies survive.

### 30.

A file server replicates every write to a second machine in another rack. An operator deletes a directory by mistake, and the deletion appears on the second machine within seconds. Which safeguard was missing?

- **A.** More replication targets, so at least one copy escapes the deletion.
- **B.** A backup, an independent copy from which the deleted directory can be restored.
- **C.** A RAID array, so the directory survives the loss of any single disk.
- **D.** Nothing — replication to a second machine is a backup.

**Answer: B.** A backup is an independent copy kept so data can be restored after loss, corruption or deletion. Replication and RAID both keep a second copy live, and both apply the destructive operation to that copy as faithfully as to the first. Common tools for taking that independent copy are `tar` for archiving and `rsync` for file-level copies.

- A is wrong: Replication faithfully copies deletions to every target, so adding targets multiplies the deletion rather than escaping it.
- C is wrong: RAID protects against disk failure, not against a delete the filesystem was asked to perform.
- D is wrong: A common belief, and the reason this pair is examinable: replication gives availability, not recoverability.

### 31.

You need to copy a large directory tree to a backup host nightly, transferring only the files that changed since the previous run. Which tool is designed for that?

- **A.** `rsync` run nightly against the backup host
- **B.** `tar` writing a fresh archive on every run
- **C.** A filesystem snapshot of the source volume
- **D.** Continuous replication to the backup host

**Answer: A.** `rsync` exists precisely for repeated directory-tree copies: it determines what differs and sends only that. `tar` creates an archive and is the right tool for bundling, not for incremental transfer.

- B is wrong: It bundles files into a single archive but has no notion of what the destination already holds, so every run copies everything.
- C is wrong: A local snapshot stays on the same storage as the original and never moves data to the backup host.
- D is wrong: That keeps a live mirror rather than a nightly independent copy, and propagates deletions immediately.

### 32.

How do business continuity and disaster recovery relate to each other?

- **A.** Business continuity is the IT subset of the wider disaster recovery discipline.
- **B.** They are two names for the same set of activities.
- **C.** Business continuity applies during an incident; disaster recovery applies afterwards.
- **D.** Disaster recovery is one component of business continuity, which is broader.

**Answer: D.** Business continuity is the discipline of keeping the organisation operating through disruption — staff, premises, suppliers, communications and systems. Disaster recovery is the part of that concerned with restoring IT service. The axis is scope: one contains the other.

- A is wrong: This inverts the containment; the technical procedure sits inside the organisational one.
- B is wrong: They differ in scope, and treating them as synonyms is what the comparison tests.
- C is wrong: Both span the incident and its aftermath; the difference is breadth, not timing.

### 33.

A flood closes an office for a month. Which concern belongs to business continuity rather than to disaster recovery?

- **A.** Which systems are restored first and in what order.
- **B.** Where staff will work and how customers will be told.
- **C.** How much data was lost between the last copy and the flood.
- **D.** Whether the standby site can carry production load.

**Answer: B.** Continuity asks whether the organisation can keep operating; recovery asks whether the systems can be brought back. A month without an office raises questions no restore procedure answers.

- A is wrong: Restoration sequencing is the technical recovery procedure.
- C is wrong: That quantity is bounded by the recovery point objective, a recovery measure.
- D is wrong: Standby capacity is part of the technical recovery arrangement.

### 34.

What does a disaster recovery drill establish that restore testing does not?

- **A.** That the backup media can be read back successfully.
- **B.** That the recovery point objective is being met.
- **C.** That the off-site copies are far enough from the primary.
- **D.** That the people involved can execute the plan and know their roles.

**Answer: D.** A drill is a rehearsed exercise — full failover or tabletop — proving the plan works and that people know their roles. Restore testing proves one artefact can be read back. The axis is scope: an artefact versus the procedure and the people around it.

- A is wrong: That is what restore testing establishes on its own.
- B is wrong: Tolerable data loss is evidenced by copy frequency rather than by a rehearsal.
- C is wrong: Geographic separation is a property of where copies sit, not something a drill measures.

### 35.

A team gathers to walk through the recovery plan verbally, without touching production systems. What is this?

- **A.** A tabletop drill, which is a legitimate form of exercise.
- **B.** Not a drill at all, because no systems were actually failed over to the standby.
- **C.** Restore testing conducted at low cost.
- **D.** A failback rehearsal for the standby site.

**Answer: A.** A drill is a rehearsed exercise proving the plan works and that people know their roles, and it may be a full failover or a tabletop. The tabletop form finds gaps in sequencing, contact details and decision rights at a fraction of the cost and risk.

- B is wrong: Restricting the term to full failover excludes a recognised and useful exercise form.
- C is wrong: No backup was read back, which is what that practice requires.
- D is wrong: Nothing was switched over, so there is no return leg being practised.

### 36.

Which of these belongs in a disaster recovery plan rather than in a runbook for routine operations?

- **A.** The procedure for rotating an expiring TLS certificate.
- **B.** The order of system restoration and who is authorised to declare a disaster.
- **C.** The organisation's strategy for continuing to trade during a disruption.
- **D.** The load balancer's health-check interval for a failing node.

**Answer: B.** A disaster recovery plan is the documented, tested procedure for restoring service after a major failure — including who does what and in what order. Its distinguishing content is the sequencing and the decision rights, which are precisely what nobody can improvise at the time.

- A is wrong: That is scheduled maintenance and does not involve recovering from a major failure.
- C is wrong: That is the broader continuity discipline, of which IT recovery is one component.
- D is wrong: That is an availability mechanism operating within a site rather than a recovery procedure.

### 37.

An auditor asks for evidence that a disaster recovery plan is more than a document. What satisfies the request?

- **A.** Records of exercises in which the plan was followed and its gaps recorded.
- **B.** Signed acknowledgements from every named role confirming they have read the current version.
- **C.** Backup job logs showing two years of successful runs.
- **D.** A diagram of the standby site's network topology.

**Answer: A.** NIST SP 800-34 Rev. 1 makes testing, training and exercises a step of the contingency planning process in its own right: testing validates recovery capabilities and exercising the plan identifies planning gaps. The glossary definition of a disaster recovery plan does not itself use the word tested, so what evidences a working plan is the exercise record rather than the definition. A plan nobody has rehearsed is a proposal: it has never met the conditions it was written for, and the gaps it contains are still unknown.

- B is wrong: Acknowledgement shows awareness but never shows the procedure works.
- C is wrong: Successful writes evidence neither restoration nor the plan around it.
- D is wrong: Documentation of the destination says nothing about whether the procedure was exercised.

### 38.

An organisation has failed over to its standby site three times and never returned to the primary without an unplanned outage. Which step is under-tested?

- **A.** Failover, since three activations indicate an unreliable trigger.
- **B.** Failback, returning to the primary once it is healthy.
- **C.** Restore testing, since the standby data must have been wrong.
- **D.** Retention, since older copies were needed on each return.

**Answer: B.** Failover switches service onto a standby when the primary fails; failback returns it once the primary is healthy. AWS Elastic Disaster Recovery documents failback as a separate operation with its own mechanism — reverse replication of the recovery instances back to the source servers — so a rehearsal of the outbound half establishes nothing about the return leg.

- A is wrong: The failovers succeeded; the outages occurred on the return leg.
- C is wrong: Nothing indicates a bad restore; the fault appears when moving back.
- D is wrong: Retention governs how long copies persist and is not exercised by a site switch.

### 39.

During failback from a standby that has been serving writes for two days, what must be handled before the primary resumes service?

- **A.** The writes accumulated on the standby must be reconciled onto the primary.
- **B.** Nothing — the primary holds the authoritative copy by definition.
- **C.** The recovery time objective must be lengthened to permit the switch.
- **D.** The standby's snapshots must be deleted to avoid conflicts.

**Answer: A.** While the standby serves, it becomes the system of record. AWS Elastic Disaster Recovery describes failback as returning workloads to the original source infrastructure and assists it by replicating data from the recovery instances back to the source servers, so failback has a data problem at its centre rather than merely a routing one — which is why it is harder than failover and more often goes wrong.

- B is wrong: Authority moved with service; treating the stale primary as authoritative discards real data.
- C is wrong: Targets describe requirements and do not resolve a data divergence.
- D is wrong: Removing point-in-time copies destroys evidence and resolves no divergence.

### 40.

A site takes a full backup on Sunday and a differential backup every weekday night. The server fails on Thursday morning. Which sets must be restored?

- **A.** Sunday's full, then Monday, Tuesday and Wednesday in order.
- **B.** Wednesday's differential only.
- **C.** Sunday's full, then Wednesday's differential only.
- **D.** Sunday's full only, since differentials are for retention rather than restore.

**Answer: C.** The distinction lives on the restore side. A differential accumulates all changes since the last full, so a restore needs the full plus one differential. An incremental holds only what changed since the previous backup of any kind, so a restore needs the full plus every incremental in sequence.

- A is wrong: That is the restore sequence for incrementals, each of which holds only what changed since the previous backup.
- B is wrong: A differential is not self-contained; without the full it has no baseline to apply changes to.
- D is wrong: Differentials are restore inputs, and skipping them discards every change made since Sunday.

### 41.

A cluster survives the loss of any single node without interruption. What does that arrangement not provide?

- **A.** Continued service when one node fails.
- **B.** Automatic transfer of work away from the failed node.
- **C.** Continued service while one node is taken out of the cluster for a planned upgrade.
- **D.** Recovery if the whole site or system is lost.

**Answer: D.** High availability avoids downtime from component failure within a site. Disaster recovery restores service after a site or system is lost. They solve different problems and are not substitutes — a perfectly available cluster in a flooded building is unavailable.

- A is wrong: That is precisely what the arrangement does provide.
- B is wrong: Shifting work off a failed member is part of how the cluster stays available.
- C is wrong: Rolling maintenance is one of the things node redundancy is for, so the cluster does provide this.

### 42.

A budget holder proposes cancelling the standby site because the production cluster is already highly available. What is the flaw?

- **A.** The cluster protects against component failure, not against losing the location it sits in.
- **B.** There is no flaw, since a highly available cluster already makes a separate recovery site unnecessary.
- **C.** The cluster cannot meet a recovery point objective of any length.
- **D.** Clusters are unable to fail back once a node returns to health.

**Answer: A.** Availability engineering removes single points of failure inside a site. Recovery engineering assumes the site is gone. Cancelling the second because the first exists leaves the organisation exposed to exactly the event the second was bought for.

- B is wrong: This is the substitution the comparison exists to prevent.
- C is wrong: Data loss targets are governed by copy frequency and are not a property of clustering.
- D is wrong: Returning work to a recovered member is ordinary cluster behaviour.

### 43.

A facility holds installed, running hardware and the most recent backup already loaded, needing only the data written since that backup before it can take over. Which tier is it?

- **A.** A hot site.
- **B.** A mirrored site.
- **C.** A warm site.
- **D.** A cold site.

**Answer: A.** The tiers are separated by how much is already in place. A hot site is fully equipped with the most recent backup loaded and needs only the data written since. Real-time continuous mirroring belongs to the separate and more expensive mirrored site — a distinction that is easy to lose and is exactly where this question sits.

- B is wrong: That tier carries continuously mirrored real-time data and needs no catch-up at all.
- C is wrong: That holds hardware but not current data, which must be restored before it can serve.
- D is wrong: That provides space, power and environmental control only, with no hardware in place.

### 44.

Moving from a hot site to a cold site has which pair of effects?

- **A.** Cost falls and recovery time falls.
- **B.** Cost falls and recovery time rises.
- **C.** Cost rises and recovery time falls.
- **D.** Cost is unchanged and only tolerable data loss rises.

**Answer: B.** Cost falls and recovery time rises as you move from hot to cold. The tier is a purchase of readiness, and readiness is what shortens the outage — so the two move in opposite directions by construction.

- A is wrong: Both cannot improve; the saving is paid for in recovery speed.
- C is wrong: That is the direction of travel toward a hot site, not away from one.
- D is wrong: Site tier drives cost and recovery time; data loss is bounded by copy frequency instead.

### 45.

In common usage, what do MTTR and MTBF describe?

- **A.** How much data may be lost, and how long restoration may take.
- **B.** How many copies are kept, and for how long.
- **C.** How quickly a standby activates, and how quickly the primary returns.
- **D.** How long repair typically takes, and how often failures typically occur.

**Answer: D.** Mean time to repair is how quickly service returns; mean time between failures is how often it breaks. Both are observed averages describing past behaviour, which is what separates them from objectives, which are targets set in advance.

- A is wrong: Those are the recovery point and recovery time objectives, which are targets rather than observed averages.
- B is wrong: That describes retention policy, which is unrelated to either measure.
- C is wrong: Those describe failover and failback timing rather than these two metrics.

### 46.

Backup tapes are stored in a fireproof safe in the same building as the servers. Which requirement remains unmet?

- **A.** Media diversity, because tape is a single medium.
- **B.** Restore testing, because the tapes have not been read back.
- **C.** Off-site storage, because one physical event could still destroy both.
- **D.** Retention, because a safe does not enforce an expiry schedule.

**Answer: C.** The requirement is keeping copies or capacity far enough away that one physical event cannot destroy both. Fire resistance raises the threshold but does not create distance — flood, building collapse or a site-wide loss defeats it.

- A is wrong: Media type is a separate requirement from location and is not what the safe fails.
- B is wrong: Testing is a real obligation but is not the one the storage location bears on.
- D is wrong: Expiry is a policy matter independent of where media is kept.

### 47.

Two application servers are load balanced, each with dual power supplies, and both draw from one switch. Where is the single point of failure?

- **A.** The application servers, because two is too few for redundancy.
- **B.** The dual power supplies, because two units inside one chassis do not count as redundancy.
- **C.** The switch, because no duplicate exists for it.
- **D.** The load balancer, because balancing implies a single decision point.

**Answer: C.** The practice is duplicating components so that no single failure stops the service, and then identifying where no such duplicate exists. The answer is always the component with a count of one on the path every request takes.

- A is wrong: Two is sufficient for the service to survive losing one of them.
- B is wrong: Each server is described as carrying two supplies, so the loss of one supply stops nothing.
- D is wrong: Nothing in the description says the balancer is unduplicated, whereas the switch plainly is.

### 48.

A database is replicated synchronously to a second data centre. A bad migration script corrupts a table at 09:00. What does replication give you at 09:05?

- **A.** The table as it stood before the migration, held on the replica.
- **B.** An automatic rollback once the replica detects the inconsistency.
- **C.** A second copy of the corrupted table, available for service.
- **D.** Protection, because replication satisfies the off-site requirement of the 3-2-1 rule.

**Answer: C.** Replication continuously copies data to another system for availability. Its fidelity is the point and the problem: it reproduces deletions and corruption as faithfully as legitimate writes, which is why it is not a backup.

- A is wrong: That is what a backup or a point-in-time copy provides; a replica tracks the primary rather than lagging it deliberately.
- B is wrong: Replication has no notion of whether a change was intended and performs no such rollback.
- D is wrong: Distance is not the issue here; the replica is off-site and still corrupt.

### 49.

Which requirement is replication the appropriate answer to?

- **A.** A file deleted by an operator last Tuesday must still be recoverable from a retained copy.
- **B.** Restores must be proven to work against a published schedule each quarter.
- **C.** Storage cost must fall as data ages beyond its useful window.
- **D.** Service must continue from a second site if the primary becomes unavailable.

**Answer: D.** Replication answers an availability question — can something else serve if this fails. It does not answer a recoverability question, because it holds only the current state and propagates every change to it.

- A is wrong: Reaching back to a past state needs a retained independent copy, not a current mirror.
- B is wrong: That is a testing obligation and is satisfied by exercising restores, not by copying data.
- C is wrong: That is addressed by retention policy and tiering, which replication does not provide.

### 50.

Nightly backup jobs have reported success for two years. What does that establish about the organisation's ability to recover?

- **A.** That the recovery time objective is being met.
- **B.** Nothing about recovery, only that the jobs ran without reporting an error.
- **C.** That the disaster recovery plan is validated.
- **D.** That the data is recoverable, since a successful backup implies a successful restore.

**Answer: B.** Restore testing periodically proves a backup can actually be restored. Until that is done, an untested backup is an assumption rather than a safeguard — and it is the step most commonly skipped.

- A is wrong: A recovery time target can only be evidenced by timing an actual restore.
- C is wrong: Validating the plan requires rehearsing the procedure and the roles, not reading a job log.
- D is wrong: This is the assumption the practice exists to break; media, encryption keys and tooling all fail silently.

### 51.

A team restores a database backup into an isolated environment each quarter and checks the row counts. Which obligation does this satisfy?

- **A.** A disaster recovery drill, since the recovery procedure has been exercised.
- **B.** The off-site requirement, since the isolated environment is elsewhere.
- **C.** Restore testing — proving the backup can be read back and yields usable data.
- **D.** The retention policy, since quarterly checks confirm the copies still exist.

**Answer: C.** Restoring into an isolated environment and verifying the result is restore testing. It proves the artefact works. It does not prove the organisation can execute its recovery plan under pressure, which is a separate exercise.

- A is wrong: A drill rehearses the whole plan and the people in it, not one artefact restoring correctly.
- B is wrong: Where the test runs is incidental; the off-site requirement is about where copies are kept.
- D is wrong: Retention governs how long copies are kept, which existence checks alone do not establish.

### 52.

A service states a four-hour recovery point objective and a one-hour recovery time objective. What do those two figures constrain?

- **A.** Service must be back within four hours, and at most one hour of data may be lost.
- **B.** Backups run every four hours and drills run hourly.
- **C.** The system tolerates four hours of downtime a year at one-hour granularity.
- **D.** At most four hours of data may be lost, and service must be back within one hour.

**Answer: D.** The recovery point objective looks backwards to the last good copy and therefore dictates backup frequency. The recovery time objective looks forwards to service restoration and therefore dictates recovery method and standby capacity. Reversing them is the classic mistake.

- A is wrong: This swaps the two, which is the single most common error on this pair.
- B is wrong: Backup frequency follows from the recovery point target but is not what the figure states.
- C is wrong: That describes an availability budget, which is a different measure entirely.

### 53.

A team must reduce its recovery point objective from 24 hours to 1 hour. Which change achieves that?

- **A.** Capture backups or log shipments at least hourly.
- **B.** Provision a hot site so recovery completes faster.
- **C.** Automate failover so the standby takes over unattended.
- **D.** Extend retention so more historical copies are available.

**Answer: A.** The recovery point objective is a statement about acceptable data loss, and the only lever on it is how often a recoverable copy is made. Everything that speeds up recovery moves the recovery time objective instead.

- B is wrong: Faster recovery shortens the outage, not the amount of data lost before it began.
- C is wrong: Automated failover reduces time to restore service rather than the recovery point.
- D is wrong: Retention extends how far back you can reach, not how recent the newest copy is.

### 54.

A service carries a 30-minute recovery time objective. Which recovery arrangement is consistent with it?

- **A.** A warm site holding hardware, with data restored from backup when needed.
- **B.** A hot site with equipment running and recent data already loaded.
- **C.** A cold site with space, power and environmental control provisioned.
- **D.** Nightly off-site tape rotation with a documented restore procedure.

**Answer: B.** The recovery time objective dictates the recovery method and the standby capacity that must be paid for. Matching a site tier to a stated recovery time is a textbook question shape: the tighter the target, the more of the destination must already be running.

- A is wrong: The restore step alone will normally exceed thirty minutes.
- C is wrong: Hardware would have to be procured and installed first, which takes days or longer.
- D is wrong: Retrieving and restoring media is measured in hours, not in the stated window.

### 55.

Which measurement would demonstrate that a stated recovery time objective is actually achievable?

- **A.** Confirming the age of the most recent restorable copy.
- **B.** Timing a rehearsed recovery from failure to service restored.
- **C.** Counting how many components have a redundant pair.
- **D.** Reviewing the retention schedule for the backup sets.

**Answer: B.** A recovery time objective is a claim about elapsed time from failure to restored service. The only evidence for it is a timed rehearsal; everything else evidences a different property.

- A is wrong: That evidences the recovery point instead, which measures data loss rather than elapsed time.
- C is wrong: Redundancy reduces the chance of an outage without establishing how long recovery takes.
- D is wrong: Retention concerns how long copies persist, which is unrelated to restoration speed.

### 56.

An administrator takes an LVM snapshot before a risky upgrade. The underlying physical volume then fails outright. What is the state of the snapshot?

- **A.** Lost with the volume, because a local snapshot is stored on the same storage as the original.
- **B.** Intact, because a snapshot is an independent copy of the data held apart from the original volume.
- **C.** Intact, because snapshots are always written to separate storage.
- **D.** Intact, because RAID parity reconstructs it from the surviving disks.

**Answer: A.** A snapshot is a point-in-time view of a volume. Local snapshots live alongside the original, so losing the volume loses them, which is why they are not an independent copy. Cloud provider snapshots are typically written to separate storage and do survive deletion of the source volume — the distinction is where the snapshot is stored, not the word itself.

- B is wrong: That describes a backup; independence from the original storage is exactly what a local snapshot lacks.
- C is wrong: True of typical cloud provider snapshots, but not of local LVM or filesystem snapshots.
- D is wrong: RAID is a separate mechanism and is not implied by taking a snapshot.

### 57.

Which single property separates a backup from a local volume snapshot?

- **A.** The backup is taken at a point in time; the snapshot is continuous.
- **B.** The backup can be restored; the snapshot cannot be restored from.
- **C.** The backup is independent of the original storage; the local snapshot is not.
- **D.** The backup is compressed; the snapshot is stored uncompressed.

**Answer: C.** Both capture a moment. Only the backup is stored independently of the volume it came from, which is what lets it survive the loss of that volume. Cloud snapshots blur this because their storage is separate — the axis is still independence, not the label.

- A is wrong: Both are point-in-time; continuous copying describes replication instead.
- B is wrong: A snapshot can be rolled back to; the limitation is its dependence on the same storage.
- D is wrong: Compression is an implementation detail of either and settles nothing about recoverability.

### 58.

A host can reach every other machine on its own subnet by IP address but a name lookup for one particular server fails. Separately, a different host cannot reach one particular local IP address at all. Which protocol is implicated in each case?

- **A.** Both cases implicate DNS, since any resolution failure of any kind whatsoever is ultimately treated as a DNS problem regardless of its actual scope.
- **B.** Both cases implicate ARP, since ARP is assumed to be responsible for resolving both names and local hardware addresses on a modern network.
- **C.** The name-lookup failure implicates DNS, which resolves names to addresses across the whole internet; the local-address failure implicates ARP, which resolves an address to a MAC only within one segment.
- **D.** The name-lookup failure instead implicates ARP, since ARP requests are assumed to carry hostnames as well as IP addresses; the local-address failure implicates DNS, regardless of which distribution or vendor is involved.

**Answer: C.** DNS resolves a name to an IP address, globally and hierarchically; ARP resolves an IPv4 address to a MAC address, but only on the local segment. A name failure with working raw addresses points at DNS, while a single unreachable local address with everything else working points at ARP.

- A is wrong: ARP resolution operates entirely below DNS, on one local segment, using no IP transport and no port at all; a local address-to-MAC failure is not a DNS problem.
- B is wrong: ARP resolves IPv4 addresses to MAC addresses only; it has no role in resolving names, which is DNS's job across the internet, not a local-segment one.
- D is wrong: ARP requests never carry hostnames — only IPv4 and MAC addresses — and DNS has no role in resolving a local-segment IP-to-MAC mapping.

### 59.

A host cannot reach 192.0.2.44, which is on the same subnet. `ip neigh show dev enp0s3` shows a FAILED entry for that address. What does a FAILED entry mean here?

- **A.** It means routing to 192.0.2.44 has failed somewhere beyond this subnet, which ARP is reporting on behalf of the router.
- **B.** It means the address is definitely down at the operating-system level, since ARP can distinguish a powered-off host from a merely unresponsive one as commonly understood by less experienced staff.
- **C.** The ARP request for 192.0.2.44 went unanswered on this segment; nothing responded, which points at that specific host being off, misconfigured, or on a different segment than assumed.
- **D.** It means DNS resolution for that address's hostname has failed, which `ip neigh` also reports through the same state field.

**Answer: C.** FAILED in `ip neigh` means an ARP request for that address went unanswered on the local segment, which is a strong, specific localisation — it says nothing was reached at all, distinct from a REJECT or a working entry showing the resolved MAC. The deprecated net-tools equivalent, `arp -n`, reports the same cache numerically where installed.

- A is wrong: ARP never crosses a router and has nothing to say about routing beyond the local segment; FAILED specifically reports that no answer arrived to a local ARP request.
- B is wrong: ARP can only report that no reply arrived; it cannot distinguish a powered-off host from one on a different segment, a firewall drop, or any other cause of silence.
- D is wrong: `ip neigh` reports the state of address-to-MAC resolution only; it has no relationship to DNS, which resolves names rather than local hardware addresses.

### 60.

A host at 10.1.1.5/24 sends traffic to 10.1.9.50, which is off-subnet. Checking `ip neigh` afterward, no entry for 10.1.9.50 appears at all. Is that evidence of an ARP failure?

- **A.** Yes — the missing entry means ARP failed to resolve the destination, and that failure is what is preventing the traffic from being delivered.
- **B.** No, but only because the destination is using IPv6 Neighbor Discovery instead of ARP, which stores its entries in a separate table.
- **C.** No, ARP never crosses a router, so a host never resolves the MAC of an off-subnet destination; the neighbour cache instead holds an entry for the gateway, which is what actually receives the frame.
- **D.** Yes, and the fix is to manually add a static ARP entry for 10.1.9.50 so the host can resolve it directly.

**Answer: C.** ARP never crosses a router: a host never learns the MAC of an off-subnet destination, so the neighbour cache holds no entry for that address at all — it resolves the gateway instead, and the frame carrying the packet holds the router's MAC, not the remote destination's.

- A is wrong: An off-subnet destination is never expected to appear in the neighbour cache at all; its absence is normal, not evidence of a failed resolution.
- B is wrong: The scenario uses ordinary IPv4 addressing, so ARP, not IPv6 Neighbor Discovery, is the relevant mechanism; the absence of an entry is explained by the off-subnet rule, not by an IPv6 substitution.
- D is wrong: A static ARP entry for an off-subnet address would be meaningless, since ARP cannot resolve an address that is not on the local segment at all; the frame is properly addressed to the gateway instead.

### 61.

A host on an IPv6-only network needs to resolve a neighbour's address to a MAC address. Which mechanism performs that job, since ARP is IPv4-only?

- **A.** ARP itself, since it was updated to handle both IPv4 and IPv6 addresses transparently in modern implementations.
- **B.** DNS, since name-to-address resolution and address-to-MAC resolution are handled by the same protocol on IPv6 networks.
- **C.** Neighbor Discovery, carried over ICMPv6, performs the same job for IPv6 that ARP performs for IPv4.
- **D.** DHCPv6, since it is responsible for distributing MAC address mappings to every client on an IPv6 network.

**Answer: C.** ARP is IPv4-only; IPv6 uses Neighbor Discovery, carried over ICMPv6, for the same job, and `ip neigh` shows the results of both mechanisms, which is why the command is named for neighbours generally rather than for ARP specifically.

- A is wrong: ARP remains IPv4-only by design; it was not extended to IPv6, which uses the separate Neighbor Discovery mechanism instead.
- B is wrong: DNS resolves names to IP addresses across the internet; it has no role in resolving a local IPv6 address to a MAC address, which is Neighbor Discovery's job.
- D is wrong: DHCPv6 distributes addressing configuration to clients; it does not resolve one host's address to another host's MAC address, which is Neighbor Discovery's role.

### 62.

A branch office link is upgraded from 100 Mbit/s to 1 Gbit/s. Nightly bulk backups finish much faster, but an interactive ticketing application "feels exactly the same" to users. Why is that outcome expected rather than a sign the upgrade failed?

- **A.** The ticketing application's responsiveness is dominated by latency, the per-request delay for many small requests, which capacity upgrades do not change; bulk backups are throughput-bound and benefit directly from more bandwidth.
- **B.** The upgrade genuinely failed for the interactive application, since any bandwidth increase is defined to proportionally reduce every kind of user-perceived delay equally.
- **C.** The ticketing application must be using UDP rather than TCP, since only a UDP-based application would fail to benefit from additional link bandwidth.
- **D.** The ticketing application's lack of improvement means DNS resolution, not the link itself, must be the actual bottleneck limiting its performance.

**Answer: A.** A high-bandwidth link can still feel slow: an interactive session or a page load with many small requests is dominated by latency, not by capacity, so buying more bandwidth changes nothing for that kind of workload, while a bulk transfer is bounded by capacity and benefits directly.

- B is wrong: An interactive workload dominated by small requests is bound by latency, not by bandwidth, so a bandwidth increase alone does not proportionally reduce its perceived delay.
- C is wrong: Which transport protocol the application uses is unrelated to why capacity upgrades do not help a latency-bound workload; the explanation is the dominance of round-trip delay, not protocol choice.
- D is wrong: Nothing in the scenario points at DNS specifically; the described symptom, an interactive app unaffected by more bandwidth, is the textbook signature of latency dominance, not a naming problem.

### 63.

Why does jitter, the variation in latency, matter more for voice traffic than the absolute value of latency itself?

- **A.** Voice traffic is unaffected by either latency or jitter, since audio codecs are defined to fully compensate for both automatically regardless of network conditions.
- **B.** Voice tolerates a steady delay reasonably well but not an unpredictable one, since variation in timing disrupts the playback rhythm listeners depend on.
- **C.** Jitter matters more because it is measured in a completely different unit than latency, making it inherently a larger and more significant number.
- **D.** Jitter matters more only for UDP-based voice traffic, and TCP-based voice traffic is entirely unaffected by any timing variation between packets.

**Answer: B.** Jitter — variation in latency rather than its absolute value — is typically what degrades voice and video, which tolerate a steady delay far better than an unpredictable one, since consistent timing can be adapted to while variable timing disrupts playback.

- A is wrong: Voice traffic is genuinely sensitive to jitter; codecs do not fully compensate for unpredictable timing variation, which is exactly why jitter degrades call quality noticeably.
- C is wrong: Jitter and latency are both measured in time, typically milliseconds; the reason jitter matters more for voice is about how playback timing is disrupted, not about differing units of measurement.
- D is wrong: The sensitivity to jitter comes from the real-time playback nature of voice traffic, not specifically from the choice of UDP as transport; the concept is about timing disruption during playback.

### 64.

A team needs to confirm a service responds and see the status code without downloading its content, and separately needs to download a file to disk from the command line. Which tool and mode suits each task?

- **A.** `wget -I` suits confirming the response without content, and `curl URL` suits downloading to a file, since `curl` is defined to always write its output to a file by default in every configuration seen in practice.
- **B.** Both tasks are best done with `curl -v`, since verbose mode is defined to automatically save a file to disk in addition to printing the full request and response exchange.
- **C.** `curl -I` suits confirming the response without downloading content, issuing a HEAD request; `wget URL` suits downloading a file, since it saves the response to a file by default rather than printing it.
- **D.** Neither tool can perform either task; both require a full browser to confirm a response or download a file from the command line reliably.

**Answer: C.** `curl -I` issues a HEAD request, so only headers come back, confirming a service responds and returns a status code; `wget URL` saves the response to a file named after the URL's last path element, matching the two default behaviours to the two different tasks described.

- A is wrong: `-I` is a `curl` flag, not a `wget` one, and `curl URL` by default writes the response to standard output, flooding the terminal, rather than saving a file the way `wget` does.
- B is wrong: `curl -v` prints the whole exchange for diagnostic purposes; it does not save a file to disk by default, and is not the tool built specifically for a headers-only check or for downloading.
- D is wrong: Both `curl` and `wget` are specifically designed as command-line HTTP clients capable of exactly these tasks without any browser involved at all.

### 65.

A `curl` command against a service exits with status 0, and a monitoring script treats this as proof the request succeeded fully. Is that a safe assumption?

- **A.** Yes — a `curl` exit status of 0 is defined to guarantee the HTTP response status was in the 2xx success range for every request made.
- **B.** No — a `curl` exit status of 0 means the transfer completed, not that the HTTP status was 2xx; the actual status code has to be read separately, or `--fail` used to make an HTTP error a non-zero exit.
- **C.** No, but only because `wget`, not `curl`, is the tool whose exit status can be trusted to reflect the actual HTTP status code returned.
- **D.** Yes, but only when `-I` is combined with the request, since a HEAD-only request is defined to make exit status 0 equivalent to a guaranteed HTTP success, since curl aborts a HEAD request as a transfer error whenever the status line is not 2xx.

**Answer: B.** A `curl` exit status of 0 means the transfer completed, not that the HTTP status was 2xx — the status code has to be read separately, or `--fail` used to make an HTTP error result in a non-zero exit, which is exactly the check a monitoring script needs instead of relying on exit status alone.

- A is wrong: Exit status 0 reports that the transfer itself completed without a connection-level error; it says nothing about whether the HTTP status code returned was a success code or an error code.
- C is wrong: `wget` has the same distinction between transfer completion and HTTP status; switching tools does not resolve the underlying need to check the status code or use an equivalent flag separately.
- D is wrong: Combining `-I` does not change what exit status 0 reports; a HEAD request can also return an HTTP error status while the transfer itself still completes and exits 0.

### 66.

What is the default output destination for `curl URL` compared with `wget URL`, and why does that difference commonly catch people out?

- **A.** `curl URL` saves the response to a file by default, while `wget URL` writes it to standard output, flooding the terminal with the response body instead.
- **B.** `curl URL` writes the response body to standard output by default, flooding the terminal, while `wget URL` saves it to a file — the opposite defaults are the specific difference that catches people out.
- **C.** Both tools write to standard output by default, and a file is only ever saved when the `-O` flag is explicitly given to either command.
- **D.** Both tools save to a file by default, and standard output is only ever used when the `-q` flag is explicitly given to either command.

**Answer: B.** The default output destination is the difference that catches people: `curl URL` floods the terminal with the body, and `wget URL` leaves a file behind — `wget -O -` sends output to standard output instead, and `-q` silences progress, but the plain defaults are opposite from what many expect.

- A is wrong: This reverses the actual defaults: `curl` writes to standard output by default, and `wget` is the one that saves a file, not the other way around.
- C is wrong: `wget` saves to a file by default without requiring any extra flag; `-O` on `curl` is what makes it behave like `wget` by writing to a file, which is not `curl`'s own default.
- D is wrong: `-q` silences progress output for `wget`; it does not control whether output goes to standard output or a file, and `curl`'s actual default is standard output, not a saved file.

### 67.

A page renders correctly and fully in a browser, but `curl -I` (and even a plain `curl` for the body) returns an almost empty response. Is this evidence the service is broken?

- **A.** Yes — any meaningful discrepancy between what a browser displays and what `curl` retrieves is defined to always indicate a server-side fault or misconfiguration.
- **B.** No, but only because `curl -I` specifically strips the body from every response regardless of what content the server actually returned, unlike a plain `curl`.
- **C.** Yes, and the fix is to add `-L` to follow redirects, since a page rendering fully in a browser while `curl` sees almost nothing is defined to always be a redirect-chasing issue.
- **D.** No — neither tool executes JavaScript, so a page that looks right in a browser can legitimately return an almost empty body to them, since much of the content is rendered client-side after the initial response.

**Answer: D.** Neither `curl` nor `wget` executes JavaScript, so a page that looks right in a browser can return an almost empty body to them legitimately, since a large share of the rendered content may be constructed client-side after the initial, minimal HTTP response the tools actually retrieve.

- A is wrong: A discrepancy here has a legitimate, common explanation, the absence of JavaScript execution in either command-line tool, rather than necessarily indicating any server-side fault at all.
- B is wrong: `curl -I` does strip the body by issuing a HEAD request, but the scenario also states a plain `curl` for the body returned an almost empty result, which `-I`'s behaviour alone does not explain.
- C is wrong: `-L` addresses following HTTP redirects specifically; an almost-empty response from a page that otherwise renders fully is a documented JavaScript-execution difference, not necessarily a redirect problem.

### 68.

A user reports pinging colleagues on the office subnet works fine, but nothing beyond the office — no internet, no other sites — is reachable. What should be checked first, and what command shows it directly?

- **A.** The DNS resolver configuration, since any inability to reach a remote site is assumed to always trace back to a naming problem instead under the great majority of ordinary configurations.
- **B.** The physical cabling to the switch, since any connectivity problem of any kind is assumed to originate at the physical layer first.
- **C.** The DHCP server, since only a DHCP fault could plausibly explain the local subnet working while remote destinations do not.
- **D.** The default gateway, shown by `ip route show default`; a missing or wrong 0.0.0.0/0 entry produces exactly this "local works, remote does not" pattern.

**Answer: D.** The default gateway is the route for 0.0.0.0/0, matching everything and losing to every more specific entry; "local works, remote does not" is exactly the symptom a missing or wrong gateway produces, and `ip route show default` filters straight to that entry, narrower than the full table `ip route` prints.

- A is wrong: A working gateway does not imply working DNS, but the symptom described — nothing beyond the subnet at all, not just names — points first at routing rather than at name resolution.
- B is wrong: Working local-subnet connectivity already confirms the physical layer is functioning; a symptom confined to remote destinations points higher up the stack, at routing.
- C is wrong: A DHCP fault would typically prevent the host from getting an address at all, not selectively allow local traffic while blocking remote traffic; that selective pattern points at the gateway.

### 69.

An administrator whose host has a single configured address of 10.0.5.20/24 runs `ip route add default via 192.168.9.1`. What actually happens?

- **A.** It succeeds anyway, since the kernel automatically adds a temporary connected route to reach any configured gateway address regardless of which subnet that address happens to fall in.
- **B.** It succeeds, but only for traffic to well-known ports, since the kernel treats those destinations as a special case bypassing the gateway check.
- **C.** It is accepted without complaint and installs normally, failing only later when traffic is sent and no ARP reply ever comes back for the gateway address itself.
- **D.** The command is rejected outright with `Error: Nexthop has invalid gateway.`, because a gateway must be on-link, on the same subnet as one of the host's own addresses.

**Answer: D.** A gateway address outside every configured subnet cannot be used at all — the host cannot ARP for it, since ARP never crosses a router and the gateway itself must be directly, locally reachable for the route to function.

- A is wrong: The kernel does not fabricate a route to make an unreachable gateway reachable; the gateway must genuinely be on-link for the route to function at all.
- B is wrong: There is no port-based exception to gateway reachability; the requirement that a gateway be on-link applies uniformly regardless of destination port.
- C is wrong: The next hop is validated at the moment the route is added, not at delivery time; `ip route add` rejects an off-link gateway outright unless `onlink` is given to force it.

### 70.

Two default routes exist on a host, each with a different metric, and one of them points out an interface that has since been physically disconnected. What is the likely, and dangerous, consequence?

- **A.** The kernel automatically detects the disconnected interface and falls back to the remaining working default route without any further configuration.
- **B.** Both default routes are always used simultaneously, splitting outbound traffic evenly between the working and the disconnected interface.
- **C.** If the disconnected interface's route has the lower metric, it silently wins and black-holes outbound traffic, even though a working default route exists on the other interface.
- **D.** Neither route is used once one interface is disconnected, since the kernel requires every default route in the table to be simultaneously valid before using any of them as a matter of routine operational practice.

**Answer: C.** More than one default route can exist with different metrics, and the lowest metric wins regardless of whether that path actually works, so a stale low-metric default on a disconnected interface silently black-holes traffic that a working route on another interface could otherwise have carried.

- A is wrong: Route selection is based purely on metric, not on live interface health; the kernel does not automatically demote a route just because its interface is down.
- B is wrong: Route selection picks a single winning entry by metric; it does not load-balance traffic evenly across every default route present in the table.
- D is wrong: The kernel does not require every default route to be valid; it simply selects among whichever entries exist by metric, which is exactly what makes a stale one dangerous.

### 71.

A host has a working default IPv4 route and internet access. Asked about the host's IPv6 reachability, an administrator runs `ip route show default`, which prints the IPv4 default route and nothing at all about IPv6. Does that prove there is no IPv6 default route?

- **A.** Yes — a single routing table governs both address families, so an empty result for one automatically means the other has no default route either, an assumption that holds until it does not.
- **B.** No. `ip route show default` without `-6` shows only the IPv4 table; a separate IPv6 default route could still exist and must be checked with `ip -6 route`.
- **C.** Yes, but only because a host without a working IPv4 default route is assumed to be incapable of holding an IPv6 default route at the same time.
- **D.** No, but only because IPv6 does not use a default route mechanism at all, relying entirely on DNS-based path selection instead.

**Answer: B.** `ip route show default` reports only the IPv4 default route by default; IPv6 keeps a separate table, so an empty IPv4 result must be checked against `ip -6 route` before concluding anything about IPv6 reachability.

- A is wrong: IPv4 and IPv6 maintain separate routing tables; an empty result under one family carries no implication at all about the other.
- C is wrong: The scenario states IPv4 is working; regardless, the two address families are configured and checked independently, with no such dependency between them.
- D is wrong: IPv6 uses the same next-hop routing concept as IPv4, including a default route; DNS has no role in path selection for either address family.

### 72.

A machine has been powered off for far longer than its DHCP lease duration. When it powers back on, what should be expected?

- **A.** It may receive a different address than before, since the previous lease will have expired and the address may have been reassigned to another client in the meantime.
- **B.** It is guaranteed to receive the exact same address as before, since a DHCP server always reserves an expired lease's address permanently for its original holder under the great majority of ordinary configurations.
- **C.** It will fail to obtain any address at all, since a DHCP server never issues a fresh lease to a client whose previous one has expired.
- **D.** It will self-assign a 169.254 link-local address automatically, since that is the defined behaviour whenever a lease has expired for any reason.

**Answer: A.** A lease is a time-bounded allocation the client must renew to keep, which is exactly why a machine switched off longer than its lease may come back to find its old address already reassigned, requiring a fresh DISCOVER to obtain a new one.

- B is wrong: A lease is a time-bounded allocation, not a permanent reservation; once it expires, the address is free to be handed to a different client, so the same address is not guaranteed.
- C is wrong: An expired lease simply means the client starts again from DISCOVER; a DHCP server issues a fresh lease to any requesting client, expired-lease history notwithstanding.
- D is wrong: Self-assignment to link-local space happens when no DHCP server answers at all, not simply because a previous lease expired while the server remains available.

### 73.

At roughly what point in a lease does a client first attempt to renew, and how, and what happens if that first attempt fails?

- **A.** At T2, about seven-eighths of the lease duration, the client tries to renew by broadcast first, only falling back to unicast to the original server if that fails.
- **B.** Exactly at lease expiry, with no earlier renewal attempt made at all, since the client is defined to wait until the very last possible moment.
- **C.** Immediately after the lease is granted, with the client re-requesting the same address again right away as a confirmation step.
- **D.** At T1, about half the lease duration, the client tries to renew directly with the server that granted it, by unicast; if that fails, at T2 it broadcasts a renewal request any server may answer.

**Answer: D.** At T1, by default half the lease time, the client tries to renew directly with the server that granted it, by unicast; if that fails, at T2, seven-eighths of the lease time, it enters rebinding and broadcasts a renewal request that any server may answer, and if the lease expires with no answer it must start again from DISCOVER.

- A is wrong: The order is reversed: the client first tries unicast renewal to the original server at T1, and only broadcasts more broadly at the later point, T2, if that attempt fails.
- B is wrong: The client attempts renewal well before expiry, at T1 (about half the lease) and again at T2 (about seven-eighths), not only at the moment of expiry itself.
- C is wrong: There is no immediate re-request right after a lease is granted; the first renewal attempt happens later, at T1, roughly half the lease duration in.

### 74.

A hypervisor host needs a predictable address without visiting the machine to configure it by hand, and the team wants every address kept in one authoritative place rather than scattered across host configurations. Which addressing choice fits, and how does it differ from a plain static address?

- **A.** A DHCP reservation fits. The client stays an ordinary DHCP client while the server binds its MAC to a fixed address, keeping every address centrally managed rather than configured by hand on the host.
- **B.** A plain static address fits equally well, since a static address and a reservation both live on the DHCP server and behave identically in every respect as a matter of routine operational practice, regardless of which distribution or vendor is involved.
- **C.** Neither fits; only a purely dynamic lease from the general pool satisfies the requirement for centrally managed addressing without visiting the host.
- **D.** A reservation fits, but it requires the host to be manually configured with a static IP address in addition to being registered on the server.

**Answer: A.** A DHCP reservation binds a specific MAC address to a fixed IP on the server side, giving a device like a hypervisor a stable, centrally managed address without visiting it or configuring it by hand — the client is configured for DHCP like any other client, and the stability comes entirely from the server.

- B is wrong: A static address is held by the host itself, not the server, and a static host does not depend on the DHCP server being reachable at boot the way a reservation-based client does.
- C is wrong: A purely dynamic lease from the general pool gives no guarantee of address stability at all, which fails the requirement for a predictable address.
- D is wrong: A reservation requires no extra host-side configuration at all; the client is configured for DHCP like any other client, and the stability comes entirely from the server side.

### 75.

A DHCP server is unreachable when two brand-new machines boot onto the network for the first time. One is configured by hand with a static address; the other has a DHCP reservation waiting for it on the server. What is the difference in outcome?

- **A.** Both machines come up identically, since a reservation is functionally indistinguishable from a static address once it has been configured on the server, which pushes the address into the client's own persistent configuration.
- **B.** The statically configured machine comes up regardless of the server; the reservation-based one gets nothing, because it is still a DHCP client with no lease of its own to fall back on.
- **C.** Neither machine comes up, since any DHCP server outage is defined to block every host on the network from initialising its networking at all.
- **D.** The reservation-based machine comes up regardless of the server, since a reservation is cached locally on the client the first time it is granted.

**Answer: B.** A reservation is not a static address. The client is still a DHCP client, so on a first boot with the server unreachable it has no lease at all, while a statically configured host comes up without needing the server.

- A is wrong: A reservation still requires a successful DHCP exchange at boot; unlike a static address held by the host itself, it fails to come up if the server is unreachable.
- C is wrong: A statically configured host does not depend on DHCP at all, so a DHCP server outage has no bearing on whether it comes up; only the reservation-based client is affected.
- D is wrong: A reservation is a server-side binding and nothing about it is stored on the client. A DHCP client may reuse a previously granted, still-unexpired lease when no server answers, but a machine booting for the first time has no such lease to reuse.

### 76.

A printer's network card fails and is replaced, which changes the device's MAC address. Its DHCP reservation, keyed to the old MAC, is left unchanged. What happens the next time the printer requests an address?

- **A.** The reservation automatically follows the printer to its new MAC address, since DHCP servers are defined to track devices by hostname rather than by MAC in the overwhelming majority of real deployments.
- **B.** The printer fails to obtain any address at all, since a DHCP server refuses to serve any device whose MAC does not match an existing reservation.
- **C.** The reservation is automatically deleted and replaced with a static address configuration pushed to the printer over the network by the server.
- **D.** The reservation silently no longer applies, since it is keyed on the MAC address; the printer receives an ordinary address from the general pool instead of its reserved one.

**Answer: D.** A reservation is keyed on the MAC address, so replacing a failed network card, or a virtual machine getting a regenerated MAC, silently breaks the binding — the device simply receives an ordinary address from the dynamic pool instead, with no error raised.

- A is wrong: A reservation is bound to a MAC address specifically, not a hostname; nothing about the binding automatically updates to follow a device to a new MAC.
- B is wrong: A DHCP server does not refuse unreserved devices outright; the printer simply receives an ordinary address from the general dynamic pool instead of its now-mismatched reservation.
- C is wrong: DHCP servers do not push static configuration to a device; the reservation simply stops matching, and the printer falls back to receiving an ordinary dynamic lease instead.

### 77.

An address inside a Kea DHCP server's dynamic pool is already leased to one host when an administrator adds a reservation for that same address to a different host. What does the server do?

- **A.** It deletes the existing lease immediately — a reservation always outranks an active dynamic lease, so the reserved host is given its reserved address on the spot.
- **B.** It refuses the reservation outright at configuration load time, because an address that falls inside a dynamic pool's active range cannot be reserved for a specific client at all.
- **C.** It cannot hand the address over at once: it parks the newly reserved host on another pool address, and reclaims the reserved one by NAKing the original holder when it next renews.
- **D.** It assigns the reserved address to both hosts at once — each client's own duplicate-address detection then settles the conflict between them.

**Answer: C.** Reservations and leases are stored separately, so reserving an address that is already leased to a different client creates a conflict the server resolves over time: the reserved host is parked on another pool address, and the original holder is NAKed at its next renewal.

- A is wrong: Removing the lease outright does not solve the problem: the reserved host would find the address still in use by the original holder and send a DHCPDECLINE, which is why the server hands it a different address in the meantime.
- B is wrong: In-pool and out-of-pool reservations use identical syntax and are handled uniformly; a reservation may name any address belonging to the subnet, including one that lies inside a dynamic pool.
- D is wrong: The server never deliberately double-assigns an address; it resolves the conflict itself, holding the reserved address back until the original holder's lease has been taken away with a DHCPNAK.

### 78.

A new employee's laptop cannot get online. It shows no IP address at all. A separate report says a colleague's laptop has an address and can ping the gateway, but web pages by name fail while an IP address typed directly still works. Which service is implicated in each case?

- **A.** Both cases implicate DHCP, since DHCP is responsible for issuing addresses and also for resolving the names that web pages depend on.
- **B.** Both cases implicate DNS, since a missing IP address is treated as ultimately a naming failure at a lower layer.
- **C.** The first case implicates DHCP, since no address means the addressing exchange failed; the second implicates DNS, since an address that works while names do not is DNS's signature, not DHCP's.
- **D.** The first case implicates DNS, since a missing address is read as evidence the hostname could not be resolved during boot; the second implicates DHCP, since a missing default route is read as evidence the address lease itself never completed.

**Answer: C.** DHCP hands out addresses and configuration; DNS answers questions about names — a machine with no address needs DHCP, and a machine with an address that cannot resolve a name needs DNS, and conflating the two is the classic error this competency tests.

- A is wrong: DHCP hands out addressing configuration only; it does not resolve names at all, and does not create DNS records by itself, so the second case is not a DHCP problem.
- B is wrong: A completely missing IP address is an addressing failure, which is DHCP's job to provide; DNS has no role in whether a host receives an address at all.
- D is wrong: A missing IP address entirely is an addressing failure — DHCP's job — not a name-resolution failure, and the second case, addresses working while names fail, is squarely DNS.

### 79.

A DHCP server on one subnet must serve clients on a physically separate subnet, and DHCP discovery is a broadcast that does not cross routers. What component makes this work, and what does it do?

- **A.** Nothing extra is needed, since routers are defined to always forward the first four bytes of any broadcast packet regardless of protocol.
- **B.** A DHCP reservation configured on the server, which is what allows a single broadcast to be forwarded across a router boundary to remote clients as a matter of routine operational practice.
- **C.** A relay agent placed on the clients' subnet, which forwards the broadcast DISCOVER on to the DHCP server at a configured address, normally by unicast, and relays the reply back.
- **D.** A static default route added to the clients' subnet, which redirects the broadcast DISCOVER message toward the remote DHCP server directly.

**Answer: C.** Because the client has no address yet, the first DHCP messages are broadcasts, and since broadcasts do not cross routers, serving a subnet whose DHCP server sits elsewhere requires a relay agent on that subnet to forward the requests as unicast to the remote server.

- A is wrong: Routers do not selectively forward parts of a broadcast packet; broadcasts simply do not cross a router at all without a relay agent to convert them to unicast.
- B is wrong: A DHCP reservation binds one MAC to one fixed address; it has no bearing on whether a broadcast crosses a router, which is the relay agent's job entirely.
- D is wrong: A static route affects unicast forwarding of known destinations; it does not enable a broadcast, which by definition has no single destination, to cross a router at all.

### 80.

A laptop comes up with an address in the 169.254.0.0/16 range and no internet access. A colleague calls this "a bad DHCP lease." Is that accurate?

- **A.** Yes — a 169.254 address is exactly what a DHCP server issues when its address pool is temporarily exhausted of usable leases.
- **B.** Yes, and the fix is to renew the lease immediately using the DHCP client's renewal command, since the address is simply near expiry and the client is still bound to a lease the server granted earlier.
- **C.** No, the laptop received no lease at all; it self-configured a link-local address because no DHCP server answered its broadcast DISCOVER.
- **D.** No, but only because 169.254.0.0/16 is actually RFC 1918 private address space rather than link-local space.

**Answer: C.** DHCP hands out addresses and configuration; it does not by itself make an address permanent, and a client showing a 169.254 address has not been given a bad lease — it has received no lease at all and self-configured after no DHCP server answered.

- A is wrong: A 169.254 address is self-assigned by the client, not issued by any DHCP server; pool exhaustion would instead produce a straightforward lease failure with no address issued at all.
- B is wrong: There is no lease to renew, since none was ever granted; the address is self-assigned specifically because DISCOVER went unanswered, not because an existing lease is expiring.
- D is wrong: 169.254.0.0/16 is link-local (APIPA) space, a separate reservation from the three RFC 1918 private ranges, not one of them.

### 81.

Name the four messages of the DHCP exchange in order, and the two UDP ports involved.

- **A.** DISCOVER, OFFER, REQUEST, ACK, using UDP port 67 for the server and port 68 for the client.
- **B.** REQUEST, DISCOVER, ACK, OFFER — using UDP port 68 for the server and port 67 for the client.
- **C.** SYN, SYN-ACK, ACK, FIN — the same four-step exchange used to establish and later close a TCP connection.
- **D.** DISCOVER, REQUEST, OFFER, ACK — using UDP port 53 for the server and port 68 for the client.

**Answer: A.** The exchange is conventionally called DORA: the client broadcasts DISCOVER; a server replies with OFFER; the client broadcasts REQUEST naming the offer it accepts; the server confirms with ACK, over UDP port 67 for the server and port 68 for the client.

- B is wrong: This has both the message order and the port assignment reversed: DISCOVER comes before REQUEST, and the server uses port 67, the client port 68.
- C is wrong: SYN, SYN-ACK, ACK and FIN are TCP handshake and teardown flags, an entirely different exchange from DHCP's DISCOVER, OFFER, REQUEST, ACK sequence.
- D is wrong: REQUEST and OFFER are swapped in order, and port 53 is DNS's port, not DHCP's; the DHCP server uses port 67.

### 82.

A user reports a web application is unreachable. Following the recommended diagnostic order, what is the very first thing to establish, and how?

- **A.** Establish whether the fault is naming at all, by reaching the destination directly by IP address — if that works and the name does not, it is DNS, and only then does querying with `dig` or `nslookup` become the productive next step.
- **B.** Establish the record's TTL first with `dig`, since knowing the caching interval is defined to be the prerequisite step before anything else can be diagnosed.
- **C.** Establish whether the authoritative server, not the recursive resolver, answers first, using `@`, since bypassing the cache is defined to always be the very first diagnostic step in any outage.
- **D.** Establish whether `getent hosts` and `dig` agree, since checking for a disagreement between the two is defined to always be the first productive diagnostic step regardless of the reported symptom in every configuration seen in practice.

**Answer: A.** Establishing whether the fault is naming at all, by reaching the destination by IP address, is the first diagnostic move: if that works and the name does not, it is DNS, and only then do `dig`'s status field and the other DNS-specific checks become the productive next step.

- B is wrong: TTL becomes relevant once a resolution problem is suspected and a change is being planned or traced; it is not the first thing to check when the actual fault category, naming versus connectivity, is still unknown.
- C is wrong: Querying the authoritative server directly is a later step, useful for distinguishing a stale cache from a wrong record, not the first move when the fault category itself is still unknown.
- D is wrong: Comparing `getent hosts` with `dig` is useful once DNS itself is confirmed to be working correctly; testing raw IP reachability first is what actually separates naming from connectivity as the very first move.

### 83.

A `dig` query returns status NOERROR with a completely empty ANSWER section. A junior engineer reads this the same way as NXDOMAIN, concluding the name does not exist. Is that the correct reading?

- **A.** No — NOERROR with an empty ANSWER section means the name exists but has no record of the type asked for, which is a different thing entirely from NXDOMAIN, which means the name itself does not exist.
- **B.** Yes — NOERROR and NXDOMAIN are defined to be functionally identical outcomes whenever the ANSWER section of a `dig` response happens to be empty.
- **C.** No, but only because the query must have used `+short`, which is defined to always suppress the ANSWER section regardless of whether a record actually exists, because `+short` suppresses the ANSWER section before the response is ever parsed.
- **D.** Yes, but only for MX record queries specifically, since NOERROR and NXDOMAIN are treated as equivalent only when the queried record type is MX.

**Answer: A.** Ignoring the status line, NOERROR with an empty ANSWER section means the name exists but has no record of the type asked for, which is not the same as NXDOMAIN — reading the status field first (NXDOMAIN, SERVFAIL, or NOERROR with an empty answer) is exactly the recommended second diagnostic step after confirming naming is the fault, before reaching for terser output such as `dig +short` once the record is confirmed to exist.

- B is wrong: NOERROR and NXDOMAIN are distinct status codes with different meanings; an empty ANSWER section under NOERROR specifically means the name exists without that record type, not that the name is absent.
- C is wrong: `+short` prints just the answer data when a record exists; it is not what causes an empty ANSWER section here, and the scenario is about interpreting the status line, not about a missing flag.
- D is wrong: The distinction between NOERROR (with an empty answer) and NXDOMAIN applies to any record type, not specifically or only to MX; the two statuses always carry different meanings.

### 84.

A `dig @ns1.example.com example.com` query is run to settle an argument about whether a DNS change has taken effect. What does querying the authoritative server directly, with `@`, actually accomplish that a plain `dig example.com` does not?

- **A.** It has no meaningful difference from a plain query, since every DNS server, authoritative or caching, is defined to always return the exact same freshly computed answer under the great majority of ordinary configurations.
- **B.** It bypasses every cache in between and asks the source of truth for the zone directly, which is the definitive test of what the zone actually currently contains, separate from what any resolver's cache still holds.
- **C.** It switches the query from DNS entirely over to using `getent hosts` internally, which is what actually explains any difference in the result observed.
- **D.** It forces the query to use TCP instead of UDP, and that protocol switch alone is what accounts for the more authoritative-seeming answer received.

**Answer: B.** Adding `@server` sends the query to a named server instead, so `dig @ns1.example.com` asks the authoritative server directly and bypasses every cache in between — the definitive test of what the zone actually contains, and the standard way to settle whether a change has genuinely taken effect versus merely being masked by a stale cached answer elsewhere.

- A is wrong: A caching resolver may return a stale, previously cached answer, while the authoritative server always returns its current, configured value directly; the two can genuinely differ, which is the whole point of querying `@`.
- C is wrong: `dig @server` remains a direct DNS query to the named server; it does not invoke `getent hosts` or the local name service switch at all, which is an entirely separate resolution path.
- D is wrong: Using `@server` does not itself force TCP; the reason the result is authoritative is that it comes directly from the zone's source of truth, not because of a transport protocol change.

### 85.

`nslookup` labels an answer "Non-authoritative answer." A user reads this as a warning that something is wrong. What does the label actually mean?

- **A.** It merely means the responding server is not an authority for that zone, typically a recursive resolver answering from its cache, which is the normal and expected case for an ordinary lookup.
- **B.** It means the DNS record being returned is stale or expired and should not be trusted until the resolver's cache is manually flushed.
- **C.** It means the query was sent to the wrong nameserver entirely, and the correct nameserver address needs to be supplied with the `server` command instead.
- **D.** It means the record type requested does not exist for that name, and a different record type should be tried using the `-type=` option instead.

**Answer: A.** `nslookup` labels any answer that did not come from an authoritative server as "Non-authoritative," which is the normal case for a cached recursive answer — trusting it as a warning, rather than as a routine label, is a documented misreading of ordinary output.

- B is wrong: The label does not indicate staleness or an expired record; it simply notes the answer came through a caching resolver rather than the authoritative server itself.
- C is wrong: A "Non-authoritative answer" does not indicate the wrong server was queried; it simply reflects that the answer came from a resolver's cache rather than the zone's own authoritative source.
- D is wrong: The label is unrelated to record-type existence; a nonexistent record type would produce an empty answer or a different status, not this note about the answer's authoritative source.

### 86.

A team needs to alias `www.example.com` to `example.com` and also needs `example.com` itself, the zone apex, to carry its own delegation and administrative records. A junior engineer proposes a CNAME at the apex to simplify things. Why won't that work?

- **A.** A CNAME cannot coexist with other records at the same name, and the apex must carry NS and SOA records, so a CNAME cannot be placed there at all.
- **B.** A CNAME can be placed at the apex without issue; the restriction only ever applies to subdomains, never to the zone apex itself.
- **C.** A CNAME cannot be placed at the apex because CNAME records are restricted to IPv6-only zones, and this zone uses IPv4 addressing, a pattern that holds across most deployments encountered.
- **D.** A CNAME cannot be placed at the apex because the apex name is reserved exclusively for A and AAAA records by the DNS protocol.

**Answer: A.** A CNAME cannot coexist with other record types at the same name, which is why a CNAME cannot be placed at a zone apex — the apex must carry NS and SOA records, and a CNAME there would conflict with both.

- B is wrong: The restriction applies universally to any name carrying a CNAME, including the apex; the apex is in fact the clearest example of why the rule matters, since it must carry NS and SOA.
- C is wrong: CNAME restriction has nothing to do with address family; it applies equally in IPv4 and IPv6 zones, and the actual reason is the coexistence rule with other record types.
- D is wrong: The apex is not restricted to only A and AAAA records; it also carries NS and SOA, among others — the actual restriction is that a CNAME cannot coexist with any other record at its name.

### 87.

A website resolves correctly but the same domain's email keeps bouncing. Given `dig A example.com` returns a good answer, what should be checked next, and with which query?

- **A.** The same A record again, since `dig A` also reports mail-routing status as part of its output when a domain has email configured.
- **B.** The mail exchanger records, checked with `dig MX example.com`, since a working A record says nothing about whether mail-directing MX records exist or point anywhere valid.
- **C.** The PTR record for the web server's address, since reverse lookups are what mail servers use to decide whether to accept a website's traffic.
- **D.** The TTL on the A record, since a low TTL is what commonly causes email delivery to fail for a domain with an otherwise working website.

**Answer: B.** A working forward lookup implies nothing about reverse or mail-routing records: MX names the mail exchangers for a domain, a separate entry from A, so bouncing mail on an otherwise working domain points straight at checking `dig MX` next.

- A is wrong: `dig A` reports only the IPv4 address record; it carries no information about mail routing, which lives in a separate MX record entirely.
- C is wrong: PTR records support reverse lookups for the mail server's own sending address in anti-spam checks, not the website's own forward A record, and are not the first thing to check for bouncing mail on this domain.
- D is wrong: TTL governs cache lifetime for a record and has no direct bearing on whether mail delivery succeeds; the missing piece here is the MX record, a distinct entry entirely.

### 88.

A reverse-lookup zone for 192.0.2.10 needs to be found. Where does that PTR record actually live, and who typically controls that zone?

- **A.** In the same forward zone as the domain's A record, since PTR and A records for the same host are always stored together in one place.
- **B.** At `192.0.2.10.in-addr.arpa`, written in the same forward order as the original address, in a zone controlled by whoever owns the domain name.
- **C.** At `10.2.0.192.in-addr.arpa`, in a zone usually delegated to whoever owns the address block, not to whoever owns the domain name the address happens to be used for.
- **D.** PTR records do not have a fixed location at all; a resolver locates them dynamically by querying every authoritative server it knows about in sequence, stopping at the first one that answers.

**Answer: C.** A PTR record for 192.0.2.10 lives at `10.2.0.192.in-addr.arpa`, in a zone that is usually delegated to whoever owns the address block — not to whoever owns the domain name — which is why its absence breaks mail reputation checks while leaving the website perfectly reachable.

- A is wrong: PTR records live in the separate in-addr.arpa reverse hierarchy, keyed by address, not alongside the forward A record in the domain's own zone.
- B is wrong: The in-addr.arpa naming reverses the address octets, so the reverse name is `10.2.0.192.in-addr.arpa`, not the forward-ordered form, and control follows the address block, not the domain.
- D is wrong: PTR records have a well-defined location, the reverse in-addr.arpa hierarchy for the address in question, not an ad hoc search across arbitrary servers.

### 89.

What is the difference between an A record and a CNAME record, and why does confusing them cost marks?

- **A.** An A record and a CNAME record are functionally identical, differing only in which administrative tool is conventionally used to create each one.
- **B.** An A record is used only for IPv6 addresses, while a CNAME is used only for IPv4 addresses, making them address-family-specific alternatives.
- **C.** An A record maps a name directly to an IPv4 address; a CNAME aliases one name to another name, which is then itself resolved. The two solve different problems and cannot substitute for each other everywhere.
- **D.** An A record can only be queried with `nslookup`, while a CNAME can only be queried with `dig`, because the two record types are carried in different wire formats that only the tool originally written for each one can decode.

**Answer: C.** A maps a name to an IPv4 address directly, terminating the lookup; CNAME aliases one name to another name, which must then itself be resolved — the A-versus-CNAME distinction is a commonly tested, commonly missed structural difference.

- A is wrong: They are structurally different: an A record resolves directly to an address, while a CNAME resolves to another name that must itself then be resolved.
- B is wrong: AAAA, not A, is the IPv6 address record; A is IPv4, and CNAME has no address-family restriction at all since it aliases names, not addresses.
- D is wrong: Both record types can be queried by any of the DNS query tools; the distinction between them is structural, about what each record resolves to, not about tool compatibility.

### 90.

A stale `/etc/hosts` entry sends every application on a host to the wrong server, but `dig` for the same name returns the correct address. Which command reproduces what the applications actually see, and why does `dig` disagree?

- **A.** `getent hosts` reproduces the application's view, because it walks the same name service switch applications use, including `/etc/hosts`; `dig` bypasses the switch entirely and queries a nameserver directly.
- **B.** `dig` reproduces the application's view correctly, and the disagreement means `/etc/hosts` is being silently ignored by the operating system entirely.
- **C.** `nslookup` reproduces the application's view, since it is the one DNS tool that is defined to consult `/etc/hosts` before querying a nameserver.
- **D.** `host` reproduces the application's view, since its terse output format is specifically designed to reflect the nsswitch resolution order.

**Answer: A.** `getent hosts` performs a lookup through the same name service switch an application uses, including `/etc/hosts` and any resolver plugin named on the `hosts:` line, while `dig`, `nslookup` and `host` build a DNS query and send it straight to a nameserver, bypassing the switch entirely.

- B is wrong: `/etc/hosts` is not being ignored; it is consulted by the name service switch that applications use, which `dig` specifically bypasses, explaining the disagreement.
- C is wrong: `nslookup`, like `dig`, queries DNS directly and does not consult `/etc/hosts` or the name service switch at all.
- D is wrong: `host`, like `dig` and `nslookup`, queries a nameserver directly; its terse output format has no relationship to whether it consults the name service switch.

### 91.

What does the conventional `hosts:` value `files dns` in `/etc/nsswitch.conf` actually determine?

- **A.** It determines the order name resolution sources are consulted: `/etc/hosts` is read first, and a nameserver is queried only if no entry there matches.
- **B.** It determines which DNS record types a resolver is permitted to request, restricting queries to the record types both listed sources are able to supply.
- **C.** It determines the TTL applied to cached answers, with `files` and `dns` each specifying a separate caching duration.
- **D.** It determines whether `/etc/resolv.conf` is regenerated automatically at boot, based on which of the two keywords appears first.

**Answer: A.** The `hosts:` line in `/etc/nsswitch.conf` sets the order in which name-resolution sources are consulted; `files dns`, the conventional value, means `/etc/hosts` is read first and a nameserver is queried only if no entry there matches, which explains why a stale hosts entry can silently override a correct DNS record.

- B is wrong: The `hosts:` line governs which sources are consulted and in what order, not which record types may be requested from a nameserver once one is queried.
- C is wrong: TTL governs how long a resolver caches an answer and is set per DNS record, not derived from the `hosts:` line, which is only about source order.
- D is wrong: Regeneration of `/etc/resolv.conf` is managed separately by NetworkManager, a DHCP client, or systemd-resolved; the `hosts:` line has no role in that process.

### 92.

A host running systemd-resolved has `resolve` included on its `hosts:` line, and `getent hosts` returns an answer that seems to come from neither `/etc/hosts` nor the nameserver in `/etc/resolv.conf` directly. What explains this?

- **A.** The `resolve` entry means the query went to the 127.0.0.53 stub listener named in `/etc/resolv.conf`, which is the only route by which systemd-resolved is ever able to answer a lookup.
- **B.** The `resolve` entry hands the lookup to systemd-resolved over its own IPC socket, so the answer can come from resolved cache, from its internal `/etc/hosts` handling, or from a synthesized record.
- **C.** The `resolve` entry means the nsswitch order has been silently reversed to `dns files`, so DNS is now consulted ahead of `/etc/hosts` for every lookup this host performs.
- **D.** The `resolve` entry means the answer must have come from a DHCP-supplied static name mapping handed out with the lease, rather than from any resolver at all.

**Answer: B.** On systems running systemd-resolved the `hosts:` line commonly includes `resolve`, which answers from systemd-resolved over the `/run/systemd/resolve/io.systemd.Resolve` socket rather than through the 127.0.0.53 stub that the separate glibc DNS path uses — either way the answer need not come from the nameserver a naive reading of `/etc/resolv.conf` suggests, which is exactly the kind of source `getent hosts` reveals and `dig` does not.

- A is wrong: The 127.0.0.53 stub serves clients that go through the glibc DNS path or a tool such as `dig`; the `resolve` nsswitch module reaches systemd-resolved over a separate IPC socket, so the stub is not the only route.
- C is wrong: `resolve` names a distinct nsswitch source served by systemd-resolved, not evidence that the files-versus-dns order has been reversed on the `hosts:` line.
- D is wrong: DHCP supplies addressing configuration such as nameserver addresses, not static name-to-address mappings; the answer's source here is systemd-resolved, reached through the `resolve` module.

### 93.

Is reversing the nsswitch `hosts:` line to `dns files`, so DNS is consulted before the local hosts file, a legal configuration?

- **A.** No — `files` must always precede `dns` on the `hosts:` line, since the order is fixed by the nsswitch specification and cannot be changed.
- **B.** Yes, but only on systems that do not run systemd, since the reversed order is unsupported wherever systemd-resolved is present.
- **C.** No, changing the order requires editing `/etc/hosts` itself rather than `/etc/nsswitch.conf`, since that is where source order is actually configured.
- **D.** Yes, the order is configurable, and reversing it to `dns files` is legal and changes which source wins when both have an entry for the same name.

**Answer: D.** Reversing the switch order to `dns files` is legal and changes which source wins for a name present in both; the conventional `files dns` value is a common default, not a fixed rule, so predicting the winning source always requires reading the actual `hosts:` line in force.

- A is wrong: The order on the `hosts:` line is configurable, not fixed; `files dns` is simply the conventional value, not an enforced requirement.
- B is wrong: Reversing the `hosts:` order is a general nsswitch configuration option, not one restricted by whether systemd-resolved happens to be running.
- C is wrong: Source order is configured on the `hosts:` line of `/etc/nsswitch.conf`, not inside `/etc/hosts`, which holds name-to-address mappings rather than resolution order.

### 94.

A "the network is down" report turns out to have raw IP addresses working perfectly while every name-based connection fails. Which service is implicated, and how does that differ from a DHCP failure?

- **A.** DHCP is implicated, since a report described broadly as "the network is down" traces back to an addressing failure before any other service is affected.
- **B.** ARP is implicated, since ARP is the step that maps a hostname onto the MAC address a frame has to carry before it can leave the host.
- **C.** DNS is implicated: it translates names to addresses, and its failure signature is addresses working while names do not; DHCP failure instead shows up as no address at all, or a 169.254 link-local one.
- **D.** NAT is implicated, since NAT rewrites the hostname carried inside each packet alongside the addresses in its headers.

**Answer: C.** A very large share of "the network is down" reports are DNS failures, with a distinct signature — raw IP addresses work while names do not — separate from DHCP failure, whose signature is no address at all or a 169.254 link-local self-assignment.

- A is wrong: A host with working raw IP connectivity already has a working address; the symptom described — names failing while addresses work — is specifically DNS, not DHCP.
- B is wrong: ARP resolves addresses to MAC addresses on the local segment only; a host with working raw IP connectivity to remote addresses has already succeeded past any ARP step involved.
- D is wrong: NAT rewrites addresses in transit and has no role in name resolution at all; a NAT failure would not selectively break names while leaving raw address connectivity intact.

### 95.

Three DNS query tools are available: `dig`, `nslookup` and `host`. A script needs the fewest lines of output to parse programmatically, while a full investigation needs every section and flag visible. Which tool suits each need?

- **A.** `nslookup` gives the terse script-friendly output, while `host` gives the full response detail a deep investigation requires, including section headers, flags and per-record TTLs.
- **B.** `dig` gives the terse script-friendly output by default, while `host` gives the full response detail with sections and flags.
- **C.** `host` gives the terse output the script wants; `dig` gives the full response detail (sections, flags, TTLs) that a full investigation needs.
- **D.** All three tools produce identical output by default, differing only in the command name used to invoke them.

**Answer: C.** `dig` is the detailed query tool showing sections, flags and TTLs; `nslookup` is the older interactive tool with moderate detail; `host` is the terse one, best suited to scripts that just need the answer without parsing extra structure.

- A is wrong: `nslookup` is the older interactive tool with moderate detail, not the terse option; `host` is the terse one, and `dig` is the tool with full response detail, not `host`.
- B is wrong: This reverses the actual defaults: `dig` prints the full response by default, and `host` is the terse tool, not the other way around.
- D is wrong: The three tools have genuinely different default verbosity and output formats; they are not interchangeable wrappers around identical output.

### 96.

A resolver is reachable and answers queries quickly, but every lookup for a particular internal zone returns NXDOMAIN. Is this a connectivity problem?

- **A.** No: a resolver being reachable does not mean it will answer for that zone; NXDOMAIN from a working resolver is a data problem, not a connectivity problem.
- **B.** Yes — any resolver returning an error response of any kind is, by definition, evidence that the resolver itself is unreachable or malfunctioning.
- **C.** No, but only because the internal zone in question must actually be hosted on a completely different port than the standard DNS port 53.
- **D.** Yes, and the fix is always to restart the resolver process, since a reachable resolver returning errors indicates its cache has become corrupted.

**Answer: A.** DNS assigns nothing and configures nothing; it only answers questions, so a reachable, functioning resolver returning NXDOMAIN is reporting a data problem — the name genuinely is not present in that zone as far as the resolver can determine — not a connectivity failure.

- B is wrong: NXDOMAIN is a valid, well-formed answer from a functioning, reachable resolver stating the name does not exist; it is not evidence of unreachability or malfunction.
- C is wrong: DNS conventionally uses port 53 regardless of which zone is being queried; nothing about an internal zone implies a nonstandard port is involved here.
- D is wrong: A cache is not implicated by an NXDOMAIN answer for a name that genuinely does not exist in the zone; restarting the resolver addresses a different class of problem entirely.

### 97.

Over which transport protocol, and on which port, does DNS operate?

- **A.** UDP only, on port 53, since DNS was designed without ever needing a reliable, ordered transport for any of its operations.
- **B.** TCP only, on port 53, since name resolution is treated as requiring the same connection-oriented reliability guarantees a file transfer needs, so UDP was never assigned a DNS port.
- **C.** Both UDP and TCP, on port 53. Ordinary queries usually travel over UDP, while TCP is used when a response is too large for UDP or for zone transfers.
- **D.** Both UDP and TCP, but on two different port numbers, 53 for UDP and 853 for TCP, matching the split used by DNS over TLS.

**Answer: C.** DNS queries usually travel over UDP port 53 for speed; TCP port 53 is used when a response is too large for the UDP path or for zone transfers — both transports share the same port number.

- A is wrong: TCP port 53 is used when a response is too large for UDP, or for zone transfers, so DNS is not UDP-only despite UDP handling the common case.
- B is wrong: Ordinary DNS queries travel over UDP for speed and low overhead; TCP is the exception for large responses and zone transfers, not the default transport.
- D is wrong: Both UDP and TCP DNS use the same port, 53; port 853 is instead associated with DNS over TLS, an unrelated, separately encrypted protocol.

### 98.

A migration test needs one specific hostname to resolve to a new server on a single test machine, without touching DNS or affecting any other host. An engineer edits `/etc/resolv.conf` to add a line for the new server. Was that the right file?

- **A.** Yes — `/etc/resolv.conf` is where individual name-to-address overrides belong, since it is the file most commonly edited by hand for testing purposes.
- **B.** No, but only because the correct approach is instead to lower the target record's TTL and wait for the change to propagate through DNS.
- **C.** No, but only because the correct fix is to add a static ARP entry binding the hostname to the new server's MAC address.
- **D.** No. `/etc/hosts` holds name-to-address mappings directly and takes effect immediately with no restart; `/etc/resolv.conf` only lists which nameservers to ask and contains no name-to-address data at all.

**Answer: D.** `/etc/hosts` is the fastest way to override name resolution on one host — for testing a migration before changing DNS — and because the file is read on each lookup, changes take effect immediately with no restart, unlike `/etc/resolv.conf`, which only names servers to ask and holds no name data of its own.

- A is wrong: `/etc/resolv.conf` lists nameservers to query and search domains; it has no syntax for mapping a specific name to a specific address, which is `/etc/hosts`'s job.
- B is wrong: Lowering a TTL is preparation for a DNS change everywhere, not a way to test on a single machine without touching DNS at all, which is what the scenario specifically asks for.
- C is wrong: ARP resolves IP addresses to MAC addresses on the local segment; it has no mechanism for resolving a hostname at all, which is a completely different layer of the problem.

### 99.

An engineer wants `/etc/hosts` to alias `web01.example.com` and also create an MX record pointing mail at a different host. Which of these can `/etc/hosts` actually express?

- **A.** Both — `/etc/hosts` supports the full range of DNS record types, including MX, provided each entry is written on its own line.
- **B.** Neither — `/etc/hosts` can only be used for the special name `localhost` and cannot hold any custom name-to-address mapping at all.
- **C.** Only the name-to-address alias; `/etc/hosts` can map a name (and aliases) to an address, but it has no record types at all and cannot express an MX record or anything beyond a literal mapping.
- **D.** Only the MX-style mail routing entry — `/etc/hosts` was designed specifically for mail routing, and general name-to-address mapping was only added to its line format much later, during the BSD era.

**Answer: C.** `/etc/hosts` lines contain an address, a canonical hostname, and optional aliases, and nothing else — it has no wildcards, no record types, and no TTL, so it can only ever map a literal name to a literal address, never an MX record or anything else DNS can express.

- A is wrong: `/etc/hosts` has no record-type syntax whatsoever; every line is a plain address-to-name mapping, with no way to express an MX record or any other typed record.
- B is wrong: Every system ships a `127.0.0.1 localhost` entry, but `/etc/hosts` is fully capable of holding arbitrary additional custom mappings beyond that default line.
- D is wrong: `/etc/hosts` predates DNS as a general name-to-address table; it was never designed around mail routing specifically, and it has no MX-record capability at all.

### 100.

A departing contractor left a line in `/etc/hosts` on a production server pointing an internal hostname at a decommissioned test box. How long will this override persist, and who is affected?

- **A.** Because an override in `/etc/hosts` is per host, it persists indefinitely until someone edits the file and affects only this one host, changing nothing for anyone else on the network.
- **B.** It persists until the entry's TTL expires, after which it is automatically removed the same way a DNS record's cache entry would be.
- **C.** It affects every host on the network that queries this server for DNS, since `/etc/hosts` entries are automatically propagated out to the other resolvers by the local name service switch.
- **D.** It persists only until the next reboot, at which point the operating system automatically resets `/etc/hosts` to its default contents.

**Answer: A.** It is per host: an override added on one server changes nothing for anyone else, so a stale `/etc/hosts` entry is a testing tool, not a deployment mechanism, and it persists indefinitely — with no TTL or automatic reset — until someone edits it away.

- B is wrong: `/etc/hosts` has no TTL concept at all; unlike a cached DNS answer, an entry here has no expiry and remains until someone edits the file by hand.
- C is wrong: `/etc/hosts` is strictly local to the host that holds it; nothing propagates its entries to other hosts or resolvers on the network.
- D is wrong: The operating system does not automatically reset `/etc/hosts` on reboot; a hand-edited entry survives across reboots exactly like any other line in the file.

### 101.

Every system ships a default entry in `/etc/hosts` mapping `127.0.0.1` to a name. What is that name, and what is the IPv6-aware equivalent line?

- **A.** `127.0.0.1 gateway`, since the loopback address is conventionally named after the default route it represents on a fresh installation.
- **B.** The loopback address mapped to the conventional name for the local host: `127.0.0.1 localhost`, and on IPv6-aware systems also `::1 localhost`.
- **C.** `0.0.0.0 localhost`, since the wildcard bind address is what every system maps to the name `localhost` by default.
- **D.** `127.0.0.1 hostname`, where `hostname` is a literal keyword rather than the actual configured hostname of the machine.

**Answer: B.** Every system ships with `127.0.0.1 localhost` and, on IPv6-aware systems, `::1 localhost`, giving the conventional loopback name a mapping on both address families by default.

- A is wrong: `localhost`, not `gateway`, is the conventional name for the loopback address; a gateway is an entirely separate concept referring to the route off the local subnet.
- C is wrong: `127.0.0.1`, not `0.0.0.0`, is the loopback address mapped to `localhost`; `0.0.0.0` is a wildcard bind address, a different concept entirely.
- D is wrong: The default entry uses the literal name `localhost`, not a placeholder keyword called `hostname`; the machine's actual hostname is a separate, distinct name.

### 102.

An administrator hand-edits `/etc/resolv.conf` to fix a wrong nameserver, and the fix works — until the next DHCP lease renewal silently reverts it. What went wrong, and where does the durable fix belong?

- **A.** The hand edit failed because `/etc/resolv.conf` is read-only by design and never actually accepted the change in the first place.
- **B.** The DHCP lease renewal reverted the change because `/etc/resolv.conf` entries are considered part of the IP address lease itself and expire along with the address when the lease is renewed.
- **C.** The durable fix belongs in `/etc/hosts` instead, since that is the file that persists correctly across DHCP renewals on a modern system.
- **D.** On a modern system the file is commonly generated by NetworkManager, a DHCP client, or systemd-resolved, so a hand edit is overwritten at the next renewal; the durable change belongs in that generating tool's configuration.

**Answer: D.** On modern systems the file is generated — by NetworkManager, a DHCP client, or as a symlink into systemd-resolved's runtime directory — so a hand edit to a generated file is overwritten at the next lease renewal, reboot or network reconfiguration; the durable change belongs in that tool's own configuration.

- A is wrong: The scenario states the fix worked initially, so the file was writable and the edit took effect; it was later overwritten by regeneration, not rejected outright.
- B is wrong: The nameserver lines are regenerated by whichever tool manages the file, not because they are literally part of the address lease; the mechanism is regeneration, not lease expiry of the file's content.
- C is wrong: `/etc/hosts` holds name-to-address mappings, not nameserver addresses; it has no bearing on which nameservers are queried, which is what `/etc/resolv.conf` governs.

### 103.

An `/etc/resolv.conf` lists five `nameserver` lines, hoping for extra resilience. How many will actually be used?

- **A.** All five will be queried in parallel on every lookup, since the resolver is designed to race every listed nameserver simultaneously for speed.
- **B.** Only the first one will ever be used, with the remaining four serving no purpose at all under any circumstances.
- **C.** All five will be used, but only in round-robin fashion across successive independent DNS queries rather than in a fixed priority order.
- **D.** Up to MAXNS, currently 3; further lines beyond the third are simply ignored, so listing five does not add any resilience.

**Answer: D.** `nameserver` lines list the resolvers to query in order, but up to MAXNS (currently 3) are used and further lines are ignored, so listing more than three nameservers does not add resilience — entries beyond the cap are simply never consulted.

- A is wrong: The resolver does not race every listed nameserver in parallel; it uses up to MAXNS (3) in order, and lines beyond that cap are ignored entirely.
- B is wrong: Up to three nameserver lines are used, not just one; the resolver falls back to subsequent listed servers, up to the MAXNS limit, if the first is unavailable.
- C is wrong: Only up to MAXNS (3) nameserver lines are used at all; the remaining two beyond that cap are never consulted, round-robin or otherwise.

### 104.

A host running systemd-resolved shows only `nameserver 127.0.0.53` in `/etc/resolv.conf`. A junior admin flags this as broken, since it points at the host itself rather than a real upstream server. Is that the right read?

- **A.** No, this is normal on a systemd-resolved system, where the file names the local stub resolver at 127.0.0.53 rather than the actual upstream nameserver directly.
- **B.** Yes — a `nameserver` line pointing at any address on 127.0.0.0/8 always indicates a broken or incomplete DNS configuration.
- **C.** Yes, but only because a correctly configured host must list at least two nameserver lines rather than a single stub address.
- **D.** No, but only because the file must actually be a symlink into `/etc/hosts` rather than a genuine `/etc/resolv.conf` file at all, as is required wherever a stub listener is in use.

**Answer: A.** On modern systems the file is often a symlink into systemd-resolved's runtime directory, in which case it names the local stub, commonly 127.0.0.53, rather than any real upstream server — seeing only that address is normal and does not indicate misconfiguration.

- B is wrong: 127.0.0.53 specifically is the conventional systemd-resolved stub address and is an expected, working configuration, not evidence of a broken setup.
- C is wrong: A single `nameserver` line is a valid, complete configuration when it points to a working resolver, stub or otherwise; the count of lines alone does not determine correctness.
- D is wrong: On a systemd-resolved system the file is typically a symlink into systemd-resolved's own runtime directory, not into `/etc/hosts`, which serves a completely different purpose.

### 105.

What does the `search` directive in `/etc/resolv.conf` do, and how does `options ndots:N` interact with it?

- **A.** `search` supplies domain suffixes appended to unqualified names; `options ndots:N` controls how many dots a name must already contain before it is tried as absolute rather than run through the search list first.
- **B.** `search` lists which record types may be queried, while `ndots` sets the maximum number of nameservers the resolver may contact per query.
- **C.** `search` sets the TTL used for cached negative answers, while `ndots` sets the TTL used for cached positive answers.
- **D.** `search` lists nameservers to fall back to if the primary one in `nameserver` fails, while `ndots` counts how many of those fallbacks may be used.

**Answer: A.** `search <domain> ...` supplies suffixes appended to names that are not fully qualified, and `options ndots:N` controls how many dots a name must contain before it is tried as absolute rather than being run through the search list first — together they determine what an unqualified name actually resolves to.

- B is wrong: Neither directive does this; `search` supplies domain suffixes for unqualified names, and `ndots` governs whether the search list is applied, not record types or nameserver counts.
- C is wrong: TTL values come from the DNS records themselves and the zone's SOA parameters, not from `search` or `ndots`, which govern suffix-appending behaviour instead.
- D is wrong: Fallback nameservers are listed with additional `nameserver` lines up to MAXNS, not with `search`, which is unrelated and governs suffix appending for unqualified names.

### 106.

A service is confirmed running and correctly bound to 0.0.0.0, yet remote clients get connection refused instantly, while another service on a different host times out with no response at all. What does the difference between these two symptoms suggest about the cause?

- **A.** Both symptoms indicate exactly the same underlying cause, since DROP and REJECT firewall policies are defined to always produce identical client-side behaviour.
- **B.** The instant refusal proves no firewall is involved at all, since any device applying a firewall policy is defined to always produce a silent timeout rather than a refusal.
- **C.** The instant refusal suggests a REJECT-style response — something on the path answered; the silent timeout suggests a DROP-style policy — the packet vanished, which is the more classic 'firewall is blocking this' signature.
- **D.** The timeout proves the destination host is completely powered off, since only a powered-off host is capable of producing a connection attempt that never receives any answer.

**Answer: C.** A firewall that drops traffic and one that rejects it produce different symptoms: DROP gives the client a timeout, REJECT gives an immediate refusal — that difference is diagnostic and worth more than the rule text itself, and is the reason to look first at policy versus reachability differently for the two symptoms described.

- A is wrong: DROP and REJECT are deliberately different behaviours precisely so the client-side symptom differs: one is silent, producing a timeout, and the other answers, producing an instant refusal.
- B is wrong: A firewall configured to REJECT rather than DROP produces an immediate refusal too, so an instant refusal does not by itself prove no firewall is involved on the path.
- D is wrong: A silent timeout is also produced by a DROP firewall policy on a fully powered-on, reachable host; it does not by itself prove the destination is powered off.

### 107.

A host with no inbound firewall rules configured at all can still browse the web without issue. A colleague argues this proves the firewall is not actually protecting anything. Is that the right conclusion?

- **A.** Yes — the ability to browse the web with no inbound rules proves the firewall is entirely inactive and providing no protection against inbound connections at all, since a firewall that permits any traffic in either direction has no default-deny policy left to apply.
- **B.** Yes, but only because web browsing specifically bypasses firewall inspection entirely as a documented protocol-level exception unique to HTTP and HTTPS.
- **C.** No, but only because NAT, not the firewall, is what is actually permitting the return web traffic to reach the browsing host in this scenario.
- **D.** No — a stateful firewall tracks connections, so a rule permitting outbound traffic implicitly permits the replies, which is exactly why a host with no inbound allows can still browse the web while remaining protected from unsolicited inbound connections.

**Answer: D.** A stateful firewall tracks connections, so a rule permitting outbound traffic implicitly permits the replies, which is why a host with no inbound allows can still browse the web — this is the standard default-deny-inbound posture working as intended, not evidence that no protection exists. `ufw status` and `firewall-cmd --list-all` are the commands that show this policy on Debian-family and Red Hat-family systems respectively.

- A is wrong: Browsing the web working is expected stateful behaviour, not evidence the firewall is inactive; an unsolicited inbound connection attempt, unlike a reply to outbound traffic, would still be blocked by default-deny.
- B is wrong: Web traffic is not specially exempted from firewall inspection; the reason it works is ordinary stateful tracking of outbound-initiated connections, applicable to any protocol, not an HTTP-specific bypass.
- C is wrong: NAT rewrites addresses and is commonly co-located with a firewall, but the mechanism permitting the reply traffic here specifically is stateful firewall inspection, not NAT's address translation itself.

### 108.

A restrictive network firewall sits in front of a host whose own local firewall is configured permissively, allowing everything. What is the effective policy actually governing traffic to that host?

- **A.** The host's own permissive policy fully governs traffic, since a local firewall is defined to always take precedence over any upstream network firewall's rules.
- **B.** The intersection of both — a host firewall protects only that host, so a permissive host firewall behind a restrictive network firewall means the effective policy is whatever the network firewall still allows through, regardless of the host's own permissiveness.
- **C.** The network firewall's policy is irrelevant once traffic reaches the local network segment, leaving the host's own permissive rules as the sole effective policy from that point onward.
- **D.** Neither firewall's policy applies at all, since having two separate firewalls active on the same path is defined to disable both of them automatically.

**Answer: B.** A host firewall protects only that host, so a permissive host firewall behind a restrictive network firewall — or the reverse — means the effective policy is the intersection of both, since traffic must pass whichever firewall is more restrictive at each point on the path.

- A is wrong: A host firewall does not override an upstream network firewall; traffic must pass both, so the network firewall's restrictions still apply regardless of the host's own permissive local policy.
- C is wrong: The network firewall governs traffic before it even reaches the host's segment; it remains fully relevant and combines with, rather than being superseded by, the host's own local policy.
- D is wrong: Two firewalls on the same path do not disable each other; each continues to filter independently, and the combined, effective result is their intersection.

### 109.

Is a NAT router with no filtering rules configured applying any security policy to the traffic it forwards?

- **A.** Yes — NAT itself is defined to apply a default-deny inbound policy automatically as an inherent part of the address-rewriting process it performs.
- **B.** Yes, but only for outbound traffic, since NAT is defined to inspect and filter every outbound packet's payload before permitting it to be translated and forwarded.
- **C.** No. NAT is not filtering; a NAT router with no rules applies no policy at all, even though it rewrites addresses as traffic crosses it.
- **D.** No, but only because every NAT router is required to have at least one firewall rule configured by default before it is allowed to forward any traffic at all.

**Answer: C.** NAT is not filtering: a NAT router with no rules applies no policy at all, even though its address-rewriting side effect can make unsolicited inbound traffic appear blocked, which is a fundamentally different mechanism from a firewall's deliberate policy decisions.

- A is wrong: NAT's apparent inbound-blocking behaviour is a side effect of having no translation mapping for unsolicited traffic, not a deliberately applied filtering policy; a NAT router with no rules applies no policy at all.
- B is wrong: NAT does not inspect payload content for either direction; it only rewrites addresses and ports and forwards accordingly, applying no content-based policy to outbound traffic either.
- D is wrong: A NAT router is not required to have any filtering rule configured to function; it can forward and translate traffic perfectly well with zero rules present, applying no policy at all.

### 110.

A TLS certificate must be issued for a server, and the certificate authority requires an unambiguous, absolute name rather than whatever short label the host happens to answer to locally. Which kind of name is required, and why does it matter here specifically?

- **A.** A bare hostname is sufficient, since certificate authorities are defined to resolve any short label the same way regardless of where the request originates.
- **B.** A fully qualified domain name is required, because it locates the host absolutely within the DNS hierarchy, unlike a bare hostname, which is only meaningful relative to a search domain that varies by context.
- **C.** Either name works identically for this purpose, since `hostname -f` and a plain hostname always resolve to the exact same value on every system.
- **D.** The transient hostname set by DHCP is required, since it is the only name type systemd considers valid for external services such as certificate issuance.

**Answer: B.** A hostname is only meaningful relative to a search domain, so the same short label can succeed on one host and fail on another; an FQDN locates the host absolutely within the DNS hierarchy, which is exactly why configuration that must work everywhere — TLS certificates, mail routing, cluster membership — uses FQDNs.

- A is wrong: A bare hostname is only meaningful relative to a local search domain; a certificate authority has no such local context, which is exactly why an FQDN is required.
- C is wrong: `hostname -f` resolves a qualified name that can differ from the plain hostname depending on `/etc/hosts` or DNS; the two are not guaranteed to be identical.
- D is wrong: The transient hostname is a runtime label, not a DNS-hierarchy name; it is unrelated to whether a name is fully qualified, which is what certificate issuance actually requires.

### 111.

`hostname -f` fails on a host that clearly has a hostname configured, since `hostname` alone prints a value. What does the failure actually mean?

- **A.** It means the hostname configuration has been wiped and must be reconfigured from scratch using `hostnamectl set-hostname`.
- **B.** It means the host is not running systemd, since `hostname -f` is a systemd-only flag unavailable on non-systemd distributions.
- **C.** It means nothing resolves the short name to a qualified one (usually a missing `/etc/hosts` line), not that the hostname itself is unset.
- **D.** It means DHCP failed to issue an address to this host, since `hostname -f` is defined to depend on a successful DHCP lease being present across virtually every environment of this kind.

**Answer: C.** `hostname -f` asks for the FQDN, which is resolved rather than merely read, and therefore depends on `/etc/hosts` or DNS returning a qualified name; its failure means nothing resolves the short name to a qualified one, usually a missing hosts entry, not that the hostname is unset.

- A is wrong: A plain `hostname` succeeding proves the hostname configuration exists; the `-f` failure is about resolving a qualified form, not about the base configuration being missing.
- B is wrong: `hostname -f` is a flag of the `hostname` command itself, not a systemd-specific feature; `hostnamectl` is the systemd-specific tool, and its absence is a different matter entirely.
- D is wrong: `hostname -f` depends on name resolution, not on DHCP addressing; a host can have a perfectly good DHCP-issued address while `hostname -f` still fails to resolve a qualified name.

### 112.

On a systemd system, `hostnamectl` distinguishes a static, a transient and a pretty hostname. What is the difference between the static and the transient one?

- **A.** The static hostname is set by DHCP on every boot, while the transient hostname is the one an administrator writes permanently to `/etc/hostname`, a pattern that holds across most deployments encountered.
- **B.** The static hostname is a free-form, human-readable label, while the transient hostname is the strict, machine-parsable form used in DNS lookups.
- **C.** The static hostname only applies to IPv4-configured hosts, while the transient hostname only applies to hosts configured for IPv6.
- **D.** The static hostname is persisted in `/etc/hostname` and survives reboots; the transient one is a runtime value, typically from a DHCP lease, and is used only when no static hostname is set.

**Answer: D.** `hostnamectl` distinguishes the static hostname, persisted in `/etc/hostname`, from the transient one, set by the kernel and possibly by DHCP, and from the pretty one, a free-form label — three genuinely different sources of the same general concept.

- A is wrong: This reverses the actual roles: the static hostname is the one persisted in `/etc/hostname`, and the transient one is what the kernel or DHCP may set at runtime.
- B is wrong: The free-form, human-readable label is the pretty hostname, a third distinct category from either the static or the transient one described here.
- C is wrong: Neither the static nor the transient hostname is tied to a specific IP address family; the distinction is about persistence and source, not about IPv4 versus IPv6.

### 113.

A name written as `web01.lab` has a dot in it. Does that dot alone make it an FQDN?

- **A.** Yes — the presence of any dot in a name is what defines it as fully qualified, regardless of what follows the dot.
- **B.** No, but only because a trailing dot at the very end of the whole name is required in addition to the one already present after `web01`.
- **C.** No: a name with a dot is not automatically fully qualified; `web01.lab` is qualified only if `lab` is a real domain in the hierarchy being queried.
- **D.** Yes, but only when the name is used inside `/etc/hosts` rather than in a DNS query, since `/etc/hosts` treats any dotted name as fully qualified.

**Answer: C.** A name with a dot in it is not automatically an FQDN — `web01.lab` is qualified only if `lab` is a real domain in the hierarchy you are querying, and because the resolver appends search domains to unqualified names, a successful `ping web01` proves nothing portable about the name.

- A is wrong: A dot alone is not sufficient; the suffix after the dot must correspond to a real domain in the hierarchy being queried for the name to actually be fully qualified.
- B is wrong: A trailing dot representing the root zone is strict DNS notation for a fully qualified name, but the core issue here is whether `lab` is a genuine domain, not merely whether a trailing dot is present.
- D is wrong: `/etc/hosts` does not redefine what counts as fully qualified; qualification depends on the DNS hierarchy, not on which file or mechanism happens to be resolving the name.

### 114.

A request to an internal API returns HTTP 502. A junior engineer treats this as the API server itself reporting an error. Is that the right way to read a 502?

- **A.** Yes — any 5xx status code is generated exclusively by the origin application server itself, regardless of whether a proxy or load balancer sits in front of it, because an intermediary is required to pass an upstream status code through untouched.
- **B.** No: 502 is a gateway or proxy reporting a bad or missing answer from the server behind it, not the origin server answering for itself; the investigation should look at the proxy and what lies behind it.
- **C.** No, but only because 502 actually indicates a client-side error, the same category of problem a 4xx status code represents, mislabeled under the 5xx range.
- **D.** Yes, and the fix is always to clear the client's browser cache, since 502 responses are commonly caused by stale cached content on the requesting side.

**Answer: B.** The status code is the fastest classifier available: 2xx succeeded, 3xx redirected, 4xx blamed the client, 5xx blamed the server — and specifically, 502 and 504 are by definition a gateway or proxy reporting a bad or missing answer from the server behind it, not that server answering for itself.

- A is wrong: 502 specifically originates from a gateway or proxy reporting trouble with the server behind it; the origin application server did not necessarily generate this particular response at all.
- C is wrong: 502 falls squarely in the 5xx range, meaning the server side is blamed, not the client; it is not a mislabeled 4xx-style client error.
- D is wrong: A 502 is generated by a gateway reporting a problem with an upstream server; clearing a client-side cache addresses a different class of issue entirely and would not resolve this.

### 115.

`curl -I https://example.com` is run to confirm a site responds, and it returns `301` with no body shown. A colleague reports the site is down. Is that conclusion supported?

- **A.** No — 301 is a redirect, not a failure; without `-L`, `curl` stops there by design, and the site is answering exactly as configured.
- **B.** Yes — any status code other than exactly 200 returned by `curl -I` is defined to indicate the site is unreachable or malfunctioning.
- **C.** No, but only because `curl -I` is fundamentally the wrong tool to use here, and `wget` would have returned a success status instead for the identical request.
- **D.** Yes, since a HEAD request, which `curl -I` issues, is defined to always fail with a 301 status regardless of how the server is actually configured.

**Answer: A.** `curl -I` issues a HEAD request and reports the status line the server returns; reading a 301 as a failure is a documented trap, since it is a redirect and, without `-L`, curl stops there by design rather than following it.

- B is wrong: A 3xx status is a normal, successful classification of response, a redirect, not evidence of unreachability; only certain other ranges, like 5xx, indicate a server-side problem.
- C is wrong: `wget` against the same URL would show the same redirect behaviour; the issue is not tool choice but correctly interpreting a 3xx status as a redirect rather than a failure.
- D is wrong: A HEAD request does not inherently produce a 301; the server's own redirect configuration is what causes this particular status, and many HEAD requests return 200 without issue.

### 116.

A site returns HTTP 200 for a request, but the page shown is an internal error message rather than the expected content. An automated monitor reports the site as healthy based on the status code alone. What is being missed?

- **A.** Nothing is being missed — a 200 status code is defined to guarantee the response body is correct and matches what the client expected to receive.
- **B.** A 200 response proves the server answered, not that the answer is correct — an error page returned with status 200 is a common misconfiguration that status-code-only monitoring misses entirely.
- **C.** The monitor is missing the TLS certificate check, since an expired certificate would be the only explanation for an error page appearing under a 200 status, because a client presents a certificate failure as a 200 response carrying an error body.
- **D.** The monitor is missing the DNS TTL, since a low TTL is what causes a server to occasionally return its internal error page instead of the real content.

**Answer: B.** A 200 response proves the server answered, not that the answer is correct — an error page returned with status 200 is a common misconfiguration that automated checks relying on the status code alone will miss, since nothing about a successful HTTP transaction guarantees the content is right.

- A is wrong: A 200 status guarantees only that the server successfully processed and returned a response; it says nothing about whether the body content is the intended, correct content.
- C is wrong: A TLS certificate problem would typically prevent the connection from completing at all, or trigger a browser warning outside the HTTP response; it does not explain a 200-status page showing internal error content.
- D is wrong: DNS TTL governs how long a resolved address is cached; it has no bearing on whether the server's application logic returns an error page under a 200 status.

### 117.

Does HTTPS hide which host a client is talking to, given that the request and response bodies are encrypted?

- **A.** Yes — HTTPS encrypts every part of the exchange, including the destination IP address and any server name information sent during connection setup, because the TLS handshake completes before any addressing or naming information is placed on the wire.
- **B.** No, but only because HTTPS hides the destination IP address specifically while leaving the server name fully visible in every case.
- **C.** Yes, but only for connections using TLS 1.3, since earlier TLS versions leave both the destination address and server name fully exposed.
- **D.** No — the destination IP address is visible by definition, and the server name is normally sent in the clear in the TLS SNI extension, so HTTPS encrypts content but not the fact of which host is being contacted.

**Answer: D.** HTTPS encrypts the request and response, but it does not hide which host is being talked to: the destination IP is visible by definition, and the server name is normally sent in the clear in the TLS SNI extension.

- A is wrong: The destination IP address is necessarily visible for routing to work at all, and the server name is normally sent in the clear in the TLS SNI extension; neither is hidden by HTTPS.
- B is wrong: The destination IP address is inherently visible for routing, not specifically hidden by HTTPS; it is the server name, via SNI, that is normally visible in the clear, not concealed either.
- C is wrong: The visibility of the destination address is a routing necessity independent of TLS version, and SNI is commonly sent in the clear across TLS versions in ordinary configurations.

### 118.

A script written years ago runs `ifconfig` on a freshly provisioned server and fails with "command not found." The engineer assumes the network stack is broken. Is that the right read?

- **A.** Yes — a missing `ifconfig` command is defined to always indicate a corrupted or incomplete networking installation requiring a full reinstall.
- **B.** No — `ifconfig` comes from the legacy net-tools package, which many current distributions no longer install; the network stack is fine, and `ip` from iproute2 is the supported replacement the script should use.
- **C.** No, but only because the script must be run with `sudo` first, since `ifconfig` specifically requires elevated privilege just to be found by the shell at all, regardless of which distribution or vendor is involved.
- **D.** Yes, but only because the correct fix is to install net-tools first and then continue relying on `ifconfig` rather than migrating the script to `ip`.

**Answer: B.** The exam asks which command to use, and the honest answer is `ip` for everything, with `ifconfig` recognised only so that legacy documentation remains readable — reaching for `ifconfig` on a modern system frequently produces "command not found," which is deprecation, not a broken system.

- A is wrong: `ifconfig`'s absence reflects a deliberate packaging choice on many current distributions, not corruption; the fully functional `ip` command remains available for every task `ifconfig` used to perform.
- C is wrong: Privilege level does not affect whether a shell can locate a command at all; `ifconfig` is simply not installed on many current distributions, unrelated to sudo.
- D is wrong: Installing net-tools restores the `ifconfig` binary, but the option's premise is still false: the network stack was never broken, so "yes" is the wrong answer to the question asked, whatever is installed afterwards.

### 119.

An administrator runs `ip link show enp0s3` looking for the interface's IP address and finds none in the output. Was the command wrong for the question being asked?

- **A.** Yes — `ip link` reports link state and the MAC address only; `ip addr` is the object to use for a layer 3 IP address, since `ip` is object-first and each object answers a different question about the same interface.
- **B.** No — `ip link show` is defined to always include both the MAC address and every configured IP address for the named interface in its output.
- **C.** No, but only because the interface must not actually have any IP address configured at all, which is why nothing appeared in the `ip link` output, since `ip link` falls back to printing addresses only when at least one is actually configured on the interface.
- **D.** Yes, but only because `enp0s3` was misspelled, and the command would have shown IP addresses correctly under the right interface name.

**Answer: A.** The `ip` command is divided into objects: `ip addr` for layer 3 addresses, `ip link` for layer 2 interface state and hardware addresses, `ip route` for the routing table — using `ip link` to look for IP addresses is a documented common mistake, since it reports link state and MAC only.

- B is wrong: `ip link` reports layer 2 state only; it does not include IP addresses in its output at all, regardless of how many are configured on the interface.
- C is wrong: Even a fully configured interface with several IP addresses would show none of them under `ip link`, since that object never reports layer 3 information regardless of configuration.
- D is wrong: Even with the exact correct interface name, `ip link` would still show no IP address information, since that data belongs to the separate `ip addr` object entirely.

### 120.

An address added with `ip addr add 192.0.2.20/24 dev enp0s3` does not appear when the same interface is inspected with `ifconfig`. Is one of the two tools reporting incorrectly?

- **A.** Yes — `ifconfig` and `ip addr` are defined to always report identical results for any interface, so a discrepancy here proves one of the two tools is malfunctioning or reading a stale cache.
- **B.** Yes, but only because the address was never actually applied by `ip addr add` in the first place, despite the command completing without any error.
- **C.** Not necessarily — `ifconfig` predates the model in which one interface holds many addresses, so an address added this way may not show under it unless created as a labelled alias, which is why the two tools can disagree about the same interface.
- **D.** No, but only because the address must have already been lost at reboot before `ifconfig` was ever run to check for it in this scenario.

**Answer: C.** `ifconfig` predates the model in which one interface holds many addresses, so addresses added with `ip addr add` may not be shown by it unless they were created as labelled aliases — which is exactly why two tools can disagree about the same interface without either one being simply wrong.

- A is wrong: The two tools are not guaranteed to report identically; `ifconfig`'s older addressing model is a documented reason they can legitimately differ without either being broken.
- B is wrong: `ip addr add` completing without error does apply the address to the running kernel state; the discrepancy is explained by `ifconfig`'s different addressing model, not by the command silently failing.
- D is wrong: The scenario does not describe a reboot occurring; the two tools disagreeing about a still-present, runtime-added address is explained by their different addressing models, not by the address having already vanished.

### 121.

Does either `ip` or `ifconfig` persist a change made with it across a reboot?

- **A.** Neither does, because both change only the running kernel state; permanence belongs to NetworkManager, Netplan or systemd-networkd instead of either command.
- **B.** Only `ip` persists changes automatically across a reboot; `ifconfig` is limited to affecting the running kernel state alone.
- **C.** Only `ifconfig` persists changes automatically across a reboot, since it predates `ip` and was originally designed with permanent configuration in mind.
- **D.** Both persist changes automatically, since any command that successfully modifies a live network interface is defined to also update the on-disk configuration.

**Answer: A.** Neither command persists anything: both `ip` and `ifconfig` change the running kernel state only, and permanence belongs to NetworkManager, Netplan or systemd-networkd — a distinction that explains why a runtime change made with either tool disappears after a reboot or reconfiguration.

- B is wrong: Neither tool persists changes; `ip` behaves identically to `ifconfig` in this respect, both affecting only the running kernel state without writing anything to disk.
- C is wrong: `ifconfig`, despite predating `ip`, does not persist changes either; both tools are limited to the running kernel state, with permanence handled by a separate configuration layer.
- D is wrong: Successfully modifying a live interface does not imply an on-disk configuration update; neither `ip` nor `ifconfig` writes to disk, which is exactly why a permanent change requires the network manager instead.

### 122.

An address begins with the octet 200. Using the classful ranges, which class does it fall in, and what does that tell you about its mask under modern routing?

- **A.** Class B — the first octet 200 was read as falling in the 128-191 range that defines class B.
- **B.** Class C, and because it is class C its real-world mask must also be exactly /24, matching the historical default, regardless of which distribution or vendor is involved.
- **C.** Class C, identified by the first octet range 192-223. Under modern classless routing, though, its real mask could be anything and is not implied by the class at all.
- **D.** Class D — the first octet 200 was read as falling in the 224-239 multicast range reserved for class D.

**Answer: C.** The first octet 200 falls within 192-223, the class C range, but classful addressing was superseded by CIDR in 1993: knowing the historical class does not tell you the address's actual mask under modern classless routing, which must be stated explicitly.

- A is wrong: 200 is above 191, placing it in the class C range (192-223), not the class B range (128-191).
- B is wrong: Modern routing is classless, so an address's class does not imply its actual mask in practice; a 200.x.x.x address may well be a /26 or any other prefix.
- D is wrong: 224-239 defines class D; 200 falls below that range, in the class C range (192-223) instead.

### 123.

A colleague calls a /26 network 'a class C network' and insists the two terms mean exactly the same thing. What is the actual relationship between IPv4 address classes and CIDR?

- **A.** They are exactly the same thing; "class C" is simply an older, informal name that continues to refer to whatever prefix length a network happens to use today, whatever that length is as commonly understood by less experienced staff.
- **B.** CIDR is simply class D renamed for modern use, since both are commonly described as more flexible successors to the original class A, B and C scheme.
- **C.** The two terms are assumed to differ only in that "class C" refers to IPv6 addressing specifically, while CIDR refers exclusively to IPv4 addressing instead.
- **D.** Classful addressing fixed three network sizes (/8, /16, /24) inferred from the address itself; CIDR allows any prefix from /0 to /32 stated explicitly, so a /26 is not a class C network; a class C network was specifically /24.

**Answer: D.** Classful addressing offered exactly three fixed sizes inferred from the address's leading bits — /8, /16, /24 — while CIDR allows any explicitly stated prefix length; a /26 was never a classful size, so calling it "a class C network" conflates two different addressing schemes.

- A is wrong: A class C network specifically meant a /24 under the old fixed-size scheme; CIDR prefixes such as /26 are a different, classless concept the vocabulary was never meant to describe.
- B is wrong: Class D specifically names the 224-239 multicast range under the classful scheme; CIDR is an entirely separate, classless addressing mechanism unrelated to multicast.
- C is wrong: Both classful addressing and CIDR are IPv4 concepts; neither one has any special relationship to IPv6, which uses its own separate addressing architecture.

### 124.

What does class D identify in the classful addressing scheme, and what is the common misreading of it?

- **A.** Class D is reserved for broadcast traffic, delivering to every host on a segment regardless of subscription.
- **B.** Class D is reserved exclusively for the loopback range, 127.0.0.0/8, set aside from the rest of class A.
- **C.** Class D, the 224-239 range, is reserved for multicast, one-to-many delivery to subscribed group members; it is commonly, and wrongly, read as "broadcast."
- **D.** Class D is reserved for RFC 1918 private addressing, distinct from the public ranges assigned to classes A, B and C, a belief that persists because it sounds intuitive.

**Answer: C.** Class D, first octet 224-239, is reserved for multicast — one-to-many delivery to a subscribed group — which is commonly and incorrectly described as "broadcast," a different delivery model entirely.

- A is wrong: Class D is multicast, not broadcast; broadcast delivery to every host on a segment is a different, unrelated mechanism using the all-ones host address within a block.
- B is wrong: Loopback, 127.0.0.0/8, falls within the class A range (1-126 first octet); class D is the separate 224-239 range reserved for multicast.
- D is wrong: RFC 1918 private ranges fall within classes A, B and C (10/8, 172.16/12, 192.168/16); class D is the separate multicast range, unrelated to private addressing.

### 125.

Why is 127 absent from the usable range of class A first octets (1-126) in the classful scheme?

- **A.** 127.0.0.0/8 is reserved for loopback, so it is carved out of the class A range even though it would otherwise fall within class A's 0-127 first-octet span.
- **B.** 127 is reserved for class B instead, which is why it does not appear in the class A first-octet range.
- **C.** 127 is reserved for RFC 1918 private addressing, carved out of class A for that purpose.
- **D.** 127 was simply never allocated to any class at all, and it remains entirely unused and unreserved to this day.

**Answer: A.** 127.0.0.0/8 is reserved for loopback, which is why it is carved out of class A's numeric span even though 127 would otherwise fall within the 0-127 first-octet range that class A occupies, leaving the usable class A range at 1-126.

- B is wrong: Class B's first-octet range is 128-191; 127 does not fall within it at all, and the reason for its exclusion from class A is the loopback reservation, not a class B assignment.
- C is wrong: 127.0.0.0/8 is loopback space, not RFC 1918 private space; the two are separate, commonly confused reservations, and it is loopback that explains the class A gap.
- D is wrong: 127.0.0.0/8 is actively reserved and used for loopback traffic on every host; it is not an unallocated or unused range.

### 126.

A junior admin captures traffic and needs to say which address type — IPv4, IPv6 or MAC — survives unchanged all the way from client to server across several routers. Which one is it, and why do the others not qualify?

- **A.** The MAC address — since it is the permanent hardware identifier, it must be the one that is preserved across every hop of the path in every configuration seen in practice.
- **B.** The IP address (IPv4 or IPv6), which identifies the internetwork endpoint and is preserved end to end, while the MAC address is rewritten at every routed hop.
- **C.** IPv6 only — IPv4 addresses are rewritten hop by hop the same way MAC addresses are, which is why IPv6 was introduced.
- **D.** None of the three; a separate connection identifier assigned by each router is what actually survives the whole path.

**Answer: B.** MAC identifies an interface on one link and is replaced at every router; IPv4 and IPv6 addresses identify the internetwork endpoint and survive every hop, differing from each other only in address size and notation, not in that role.

- A is wrong: A MAC address is rewritten by every router the packet passes through, because it only has meaning within one link, not across the whole path.
- C is wrong: IPv4 addresses are preserved end to end exactly like IPv6 addresses; IPv6 was introduced because of address exhaustion, not because IPv4 gets rewritten in transit.
- D is wrong: Routers do not assign a new connection identifier per hop; IP addresses are what remains constant across the whole path from source to destination.

### 127.

Two hosts show `192.168.5.40/24` and `192.168.5.200/24` in their `ip addr` output. A technician asks whether traffic between them needs a router. What decides the answer, and what is it here?

- **A.** The addresses alone decide it, and since the last octets differ, a router must be involved regardless of any mask.
- **B.** The default gateway decides it, since only a configured gateway can determine whether two hosts share a subnet.
- **C.** The hosts' MAC addresses decide it, since matching manufacturer prefixes indicate hosts on the same physical segment, a conclusion that seems to follow from everyday experience.
- **D.** The subnet mask decides it, and here both addresses share the /24 network portion, so they are on the same subnet and no router is needed.

**Answer: D.** `ip addr` prints each address with its prefix length attached, and applying that mask to two addresses is the only way to know whether they share a network — an address quoted without a mask never answers the question.

- A is wrong: An address by itself does not say where the network/host split falls; only the mask does, and a differing last octet does not by itself imply different subnets.
- B is wrong: The gateway matters for reaching off-subnet destinations, but whether two hosts are on the same subnet is decided purely by applying the mask to both addresses.
- C is wrong: MAC address vendor prefixes say nothing about IP subnet membership; only the IP addresses and the mask applied to them decide that question.

### 128.

An administrator runs `ip addr add 192.0.2.50/24 dev enp0s3` to fix an outage, and the host works immediately. A week later, after a routine reboot, the address is gone. What happened?

- **A.** `ip addr add` changes only the running kernel state; it was never written to the distribution's persistent network configuration, so the reboot reverted it.
- **B.** The address was actually a DHCP lease that silently expired over the course of the week, unrelated to the reboot itself.
- **C.** Interface renaming under the predictable-naming scheme silently moved the address to a differently named interface after the reboot under the great majority of ordinary configurations.
- **D.** The subnet mask given, /24, was invalid for that address range, so the kernel silently discarded it at the next boot.

**Answer: A.** A question about making an address change permanent is never answered by an `ip` command alone: `ip addr add` sets state immediately but writes nothing to disk, so persistence must come from the distribution's network configuration layer.

- B is wrong: The address was assigned manually with `ip addr add`, not leased from DHCP, so there is no lease-expiry mechanism to explain its disappearance.
- C is wrong: Predictable interface names are stable across reboots on the same hardware; renaming does not explain a runtime-only address vanishing entirely.
- D is wrong: /24 is a perfectly valid prefix for 192.0.2.50, and an invalid mask would have been rejected immediately by `ip addr add`, not accepted and later discarded.

### 129.

A service is configured to listen on `0.0.0.0` rather than a specific address. What does that value mean in a listening configuration?

- **A.** It means the service is unreachable from any address until a specific one is configured in its place.
- **B.** It means the service accepts connections on every address the host holds, not one specific address.
- **C.** It refers specifically to the host's own loopback interface, the same as `127.0.0.1` would.
- **D.** It is the broadcast address for whatever subnet the host's primary interface currently belongs to.

**Answer: B.** `0.0.0.0` in a service's listening configuration means every address on the host, which is why binding to it — rather than to a single interface address — is the common fix for 'the service runs but nothing external can reach it.'

- A is wrong: The opposite is true: `0.0.0.0` maximises reachability by binding every address, rather than blocking connections until configured further.
- C is wrong: `127.0.0.1` is the loopback-only address; `0.0.0.0` is the opposite case, meaning every address rather than just the loopback interface.
- D is wrong: A subnet broadcast address depends on the mask and is a specific dotted-decimal value; `0.0.0.0` in a bind configuration is a wildcard, not a broadcast target.

### 130.

Running `ip -6 addr` on a host with IPv6 routing disabled at the site still shows an address beginning `fe80::`. A colleague concludes IPv6 must be misconfigured somewhere. Is that right?

- **A.** Yes — a link-local address only appears if a rogue DHCPv6 server on the segment has misassigned it in error in the overwhelming majority of real deployments.
- **B.** Yes — its presence means the host is actively routing IPv6 traffic to the wider internet right now.
- **C.** No, every interface self-assigns a link-local address automatically, so seeing `fe80::` is normal even when no site-wide IPv6 routing exists.
- **D.** No, but only because `fe80::` is actually the IPv6 loopback address rather than a link-local one.

**Answer: C.** `fe80::/10` link-local addresses are automatically configured on every interface and never routed off the local link, so their presence in `ip -6 addr` output tells you nothing about whether the site actually routes IPv6 traffic anywhere.

- A is wrong: Link-local addresses are self-configured by every interface automatically; no DHCPv6 server, rogue or otherwise, is involved in assigning them.
- B is wrong: A link-local address is confined to the local link by definition and proves nothing about site-wide or internet IPv6 routing.
- D is wrong: The IPv6 loopback address is `::1/128`; `fe80::/10` is the separate link-local range, not the loopback range.

### 131.

A written address reads `2001:db8::0::1`, with two separate `::` runs. Why must this be rejected as invalid notation?

- **A.** Zero compression allows at most one `::` per address, because a second occurrence makes the number of elided zero groups ambiguous.
- **B.** It is invalid because IPv6 addresses may contain at most six hexadecimal groups written out in total.
- **C.** It is invalid because the `db8` group contains a letter, and IPv6 groups may only contain decimal digits.
- **D.** It is invalid because addresses beginning `2001:db8::` are reserved and can never be assigned to a real interface, so no address from that prefix may be written in compressed form.

**Answer: A.** `::` may replace one run of consecutive all-zero groups, and only one such run per address, because allowing two would make the compressed groups impossible to expand back unambiguously.

- B is wrong: An IPv6 address has eight groups when fully expanded; the rule broken here is the double use of `::`, not a limit on the number of groups.
- C is wrong: IPv6 groups are hexadecimal, so letters a through f are entirely valid within a group; that is not the fault in this address.
- D is wrong: 2001:db8::/32 is reserved for documentation examples, which is exactly why it is used in teaching material; that is unrelated to the double-`::` error present.

### 132.

A host needs to confirm it can reach itself over IPv6 before testing anything further. Which address and command combination performs the IPv6 equivalent of `ping 127.0.0.1`?

- **A.** `fe80::1`, since link-local addresses are what IPv6 uses in place of a dedicated loopback address entirely.
- **B.** `0.0.0.0`, checked with `ip addr` rather than `ip -6 addr`, since it represents every address on every protocol version by default on most systems administrators encounter.
- **C.** Any address in `2001:db8::/32`, since that whole documentation range loops back to the originating host by definition.
- **D.** `::1`, the IPv6 loopback address and the counterpart to `127.0.0.1`, checked with `ip -6 addr` to confirm it is present, then pinged.

**Answer: D.** `::1/128` is the IPv6 counterpart of `127.0.0.1`, and `ip -6 addr` is the command that restricts output to IPv6 addresses, making it the tool to confirm the loopback address is present before further troubleshooting.

- A is wrong: Link-local addresses identify an interface on the local link; `::1` is the separate, dedicated loopback address, distinct from any `fe80::` address.
- B is wrong: `0.0.0.0` is an IPv4 wildcard bind address, not an IPv6 loopback address, and `ip addr` without `-6` shows IPv4 addresses.
- C is wrong: 2001:db8::/32 is reserved for documentation examples in written material; it is not a loopback range and does not loop traffic back to the sender.

### 133.

Why does IPv6 have no address that functions as a broadcast address the way IPv4 has one?

- **A.** IPv6 does have a broadcast address; it is simply written as `ff02::1` rather than an all-ones host address.
- **B.** IPv6 has no broadcast address because every IPv6 subnet is limited to a single host by design.
- **C.** IPv6 replaces every broadcast use case with multicast delivery instead, so there is no IPv6 broadcast address of any kind.
- **D.** IPv6 has no broadcast address because ARP performs that role instead, addressing every host directly.

**Answer: C.** IPv6 has no broadcast address of any kind by design; its equivalent functions — such as neighbour discovery — are built on multicast delivery to subscribed groups instead, which is why "the IPv6 broadcast address" is a wrong answer by construction.

- A is wrong: `ff02::1` is the all-nodes multicast address, not a broadcast address; IPv6 has no broadcast concept at all, only multicast.
- B is wrong: A /64 is the conventional IPv6 LAN size and holds vastly more than one host; the absence of broadcast is a design choice, not a consequence of subnet size.
- D is wrong: ARP is not used on IPv6 at all; Neighbor Discovery over ICMPv6 replaces it, and neither one substitutes for a broadcast address.

### 134.

Two questions arrive about the same server: "is the service even running?" and "is anyone actually using it right now?" Which `ss` invocation answers each?

- **A.** `ss -tulpn` alone answers both questions simultaneously, since its `-l` flag is defined to include every established connection alongside the listening sockets.
- **B.** `ss -t state established` alone answers both questions, since a service with any established connections is thereby proven to also be listening.
- **C.** The two are mutually exclusive views of the same table: `ss -tulpn` answers whether it is running, by showing the LISTEN socket, while `ss -t state established` answers who is using it, by showing active ESTAB connections.
- **D.** Neither command answers either question; only reading application logs directly can determine whether a service is running or in use.

**Answer: C.** `ss -tulpn` shows listening sockets, answering whether a service is running and accepting connections, while `ss -t state established` filters to TCP connections in the ESTAB state, answering who is actually using it — a service can be listening with zero clients, or have established connections while its listener is misconfigured elsewhere.

- A is wrong: `-l` restricts output to listening sockets specifically and deliberately excludes established connections, so `ss -tulpn` alone cannot answer who is currently connected.
- B is wrong: A service can have zero established connections while still listening perfectly well; established connections alone do not confirm a listener is present, only that some past connections succeeded.
- D is wrong: `ss -tulpn` and `ss -t state established` are specifically designed to answer these two questions from the socket table directly, without needing to consult application logs at all.

### 135.

A UDP-based service shows a socket in the ESTAB state under `ss`. A colleague treats this as proof a negotiated connection with a remote peer exists, the same as it would for TCP. Is that a safe reading?

- **A.** No. A UDP socket showing ESTAB only records that its application called `connect()` to fix a default peer locally; unlike TCP, it involved no handshake and proves nothing about the far end.
- **B.** Yes — ESTAB means exactly the same thing for UDP as it does for TCP: a fully negotiated, bidirectionally confirmed connection with the remote peer.
- **C.** No, but only because UDP sockets are never permitted to display ESTAB at all, so the tool output itself must be misreporting the socket's actual state.
- **D.** Yes, but only if the socket is also shown holding a LISTEN state at the same time, which together would confirm a genuine remote conversation.

**Answer: A.** A UDP socket bound with no fixed peer shows UNCONN; one whose application has called `connect()` to a single peer shows ESTAB, but that ESTAB is only a local socket property, a default destination the kernel records, not a negotiated connection — unlike TCP it involved no handshake and proves nothing about the far end.

- B is wrong: UDP has no handshake to negotiate anything with a peer; a UDP socket's ESTAB state is purely a local record of a fixed default destination, not a confirmed remote conversation.
- C is wrong: A UDP socket whose application has called `connect()` to a single peer genuinely does show ESTAB; the output is not a misreport, it is simply a different, weaker meaning than TCP's ESTAB carries.
- D is wrong: LISTEN and ESTAB are mutually exclusive states in `ss` output for a given socket entry, not something that can be shown together to reinforce one another.

### 136.

`ss -tulpn` shows a service in the LISTEN state at `127.0.0.1:8080`, and a load balancer reports the connection refused rather than timing out. What does the refusal, as opposed to a timeout, tell you?

- **A.** The refusal tells you the packet never reached the server at all, which would instead be the expected behaviour if a firewall were silently dropping the traffic, since a refusal and a timeout are produced by the same rule and differ only in how quickly the client gives up waiting.
- **B.** The refusal tells you the service crashed between the LISTEN check and the load balancer's connection attempt, which is the only explanation for an instant RST.
- **C.** The refusal tells you DNS resolved the load balancer to the wrong address, which is a name-resolution failure rather than a connection-level one.
- **D.** The refusal tells you the load balancer's SYN reached a host with nothing listening on that specific address; the service is up but bound to loopback only, so it answers with RST when addressed from elsewhere.

**Answer: D.** A listening socket bound to 127.0.0.1 shows up in `ss -tulpn` exactly like one bound to 0.0.0.0, so a service that 'is listening' can still be unreachable from every other host — from the server itself the handshake completes, but from elsewhere the SYN reaches a host with nothing listening on that address and is answered with RST, reported as refused rather than timed out.

- A is wrong: A refusal specifically means a packet reached a live host that answered with RST; a silent firewall drop produces a timeout instead, the opposite symptom from what is described here.
- B is wrong: A crashed service would also close its listening socket, but the scenario shows a working LISTEN entry; the far more direct explanation, consistent with both facts, is the loopback-only bind address.
- C is wrong: The scenario describes a TCP-level refusal after reaching a host, not a resolution failure; DNS is a separate layer entirely from the reachability described here.

### 137.

A `ss` state column shows CLOSE-WAIT for a connection. What does that state typically indicate, and is it usually a network problem?

- **A.** It typically indicates a firewall dropped the connection's traffic mid-stream, which is why the local side is shown waiting to close.
- **B.** It typically indicates the connection is still in the process of being established and has not yet completed its three-way handshake.
- **C.** It typically indicates high packet loss on the path, since a poor connection is what most commonly forces a socket into the CLOSE-WAIT state while the kernel retries the lost segments.
- **D.** It typically indicates the peer closed the connection but the local application has not yet closed its end, usually an application bug rather than a network problem.

**Answer: D.** Between LISTEN and ESTAB lie transient states worth recognising, including CLOSE-WAIT, where the peer closed but the local application has not, which usually indicates an application bug rather than a network one — distinct from a large but normal number of TIME-WAIT entries on a busy server, which is not a leak.

- A is wrong: CLOSE-WAIT is not caused by a firewall drop; it reflects that the peer has already closed cleanly and the local application simply has not finished closing its own end yet.
- B is wrong: A connection still establishing shows SYN-SENT or SYN-RECV, not CLOSE-WAIT, which specifically applies after the peer has already sent FIN on an established connection.
- C is wrong: Packet loss is not what produces CLOSE-WAIT; that state follows a legitimately received FIN from the peer combined with the local application not yet closing its own socket.

### 138.

A team needs a device that keeps a service available when any one of several backend servers fails, distributing load across all of them and removing failed ones from rotation automatically. Is a proxy, generically, defined to do this?

- **A.** Yes — every proxy, reverse or forward, is defined to distribute requests across multiple backends and health-check them as a core part of what a proxy fundamentally is.
- **B.** No, and neither is a load balancer, since removing a failed backend from rotation automatically requires a dedicated firewall device rather than either a proxy or a load balancer.
- **C.** No — a proxy's defining trait is mediating a request on someone's behalf, and a single backend is entirely normal for it; it is a load balancer specifically that selects among several backends by a scheduling algorithm and health-checks them continuously.
- **D.** Yes, but only for a forward proxy specifically; a reverse proxy by definition can never distribute traffic across more than one backend under any circumstances.

**Answer: C.** A load balancer is the standard answer to both handling more traffic and surviving a server failure, distinguished from a proxy by intent: it selects a backend by a scheduling algorithm, health-checks each one continuously, and removes failing ones from rotation, which is not inherent to a proxy simply mediating on someone's behalf.

- A is wrong: A proxy commonly has just one backend behind it; distributing across several backends and health-checking them is what specifically defines a load balancer, not a proxy generically.
- B is wrong: A firewall filters traffic by policy; it does not health-check backends or remove them from a rotation, which is specifically a load balancer's job, and it is exactly the device the team needs here.
- D is wrong: A reverse proxy commonly does distribute traffic across multiple backends once it takes on that role, which is exactly how it becomes a load balancer; the restriction described here does not hold.

### 139.

An application keeps per-user session state in memory on whichever backend first served that user. Requests from the same user are then distributed evenly across every backend by the load balancer's default scheduling algorithm. What problem does this cause, and what feature addresses it?

- **A.** No problem is caused, since every backend behind a load balancer is defined to automatically share in-memory session state with every other backend by default.
- **B.** Later requests may land on a backend without that user's session state, breaking the application; session affinity, or sticky sessions, pins a client to one backend to fix this, at the cost of even distribution.
- **C.** The problem is caused by health checking, and the fix is to disable health checks so that every backend remains in rotation regardless of its actual state.
- **D.** The problem is caused by layer 4 balancing specifically, and the fix is to switch to layer 7 balancing, which is defined to always keep a user on one backend automatically across virtually every environment of this kind.

**Answer: B.** Where an application keeps per-user state in memory, session affinity, or "sticky sessions," pins a client to one backend, at the cost of even distribution — without it, a scheduling algorithm distributing requests evenly across backends will eventually route a returning user to a backend that never saw their session.

- A is wrong: Backends do not automatically share in-memory state with each other by default; a request landing on the wrong backend genuinely loses access to session state kept only in memory there.
- C is wrong: Health checking removes failing backends from rotation for availability reasons; disabling it does not address a session-state mismatch, and it would remove an unrelated safety mechanism.
- D is wrong: Neither layer 4 nor layer 7 balancing automatically pins a client to one backend by default; session affinity is a distinct, explicitly configured feature independent of which layer the balancer operates at.

### 140.

A single load balancer is placed in front of two backend servers to improve availability. A reviewer says this fully removes the single point of failure the two-server design was meant to avoid. Is that correct?

- **A.** Yes — a load balancer is defined to be inherently redundant by design, regardless of whether a second instance of it is deployed alongside the first.
- **B.** No — the load balancer is itself a single point of failure unless it is made redundant too; putting one in front of two servers moves the risk rather than removing it.
- **C.** Yes, but only because health checking on the backends is what specifically eliminates the load balancer itself as a single point of failure.
- **D.** No, but only because the two backend servers themselves remain the single point of failure regardless of whether a load balancer is added in front of them, since two servers in one rotation still share a single failure domain.

**Answer: B.** A load balancer is a single point of failure unless it is itself redundant — putting one in front of two servers moves the risk rather than removing it, since the servers gained resilience at the cost of introducing a new, unprotected single point upstream of them.

- A is wrong: A load balancer is not inherently redundant simply by being a load balancer; it must itself be made redundant, through a second instance or equivalent, to avoid being a single point of failure.
- C is wrong: Health checking monitors the backends the load balancer forwards to; it does nothing to protect against the load balancer itself failing, which remains a single point of failure without its own redundancy.
- D is wrong: Two backend servers behind a load balancer are specifically not a single point of failure for that layer; the unaddressed risk described is the non-redundant load balancer itself, not the backends.

### 141.

What is the practical difference between a layer 4 and a layer 7 load balancer?

- **A.** A layer 4 balancer parses HTTP and can route on hostname, path or header, while a layer 7 balancer forwards TCP or UDP by address and port without reading the payload.
- **B.** A layer 4 balancer only supports TCP, while a layer 7 balancer only supports UDP, matching the transport protocols named by their respective layer numbers.
- **C.** A layer 4 balancer forwards TCP or UDP by address and port without reading the payload; a layer 7 balancer parses HTTP and can route on hostname, path or header.
- **D.** There is no real difference; "layer 4" and "layer 7" are marketing terms describing identical balancing behaviour under two different vendor naming conventions.

**Answer: C.** A layer 4 balancer forwards TCP or UDP by address and port without reading the payload, while a layer 7 balancer parses HTTP and can route on hostname, path or header — the OSI layer number in each name describes how deep into the traffic the balancer looks before deciding where to send it.

- A is wrong: This swaps the two definitions: parsing HTTP content for routing decisions is layer 7's job, and forwarding purely by address and port without reading the payload is layer 4's.
- B is wrong: A layer 4 balancer can forward both TCP and UDP by address and port; the distinguishing trait between the two levels is depth of payload inspection, not which single transport each is restricted to.
- D is wrong: The two genuinely differ in what they inspect and can route on — address and port alone versus parsed HTTP content — not merely in vendor naming for identical behaviour.

### 142.

A web service fails to respond from other machines. Running `ping 127.0.0.1` on the host itself succeeds cleanly. What has this actually confirmed, and what has it not?

- **A.** It confirms the network card, cable and driver are all functioning correctly end to end, since a successful ping is taken as proof that the full network path is intact in the overwhelming majority of real deployments.
- **B.** It confirms the web service itself is correctly configured to accept remote connections on its intended port and address.
- **C.** It confirms the local IP stack is loaded and responding; it says nothing about the NIC, cabling, addressing, routing or firewall rules, since loopback traffic never reaches a physical interface.
- **D.** It confirms the default gateway is correctly configured and reachable from this host on the local subnet.

**Answer: C.** `ping 127.0.0.1` exercises the local TCP/IP stack and nothing else, because the kernel delivers loopback traffic internally without touching any driver; if the service answers on loopback but not remotely, the fault is a binding, firewall or routing issue between the two hosts, not the service itself.

- A is wrong: Loopback traffic is delivered internally by the kernel and never touches the NIC, cable or driver, so a successful loopback ping proves nothing about any of them.
- B is wrong: A loopback ping tests only the IP stack, not any particular service; whether a service is bound to accept remote connections is a separate question entirely.
- D is wrong: Loopback traffic never leaves the host at all, so it says nothing about whether a gateway is configured or reachable on the network.

### 143.

A service answers correctly when tested on `127.0.0.1` from the local host, but a remote client gets connection refused. Given that loopback works, what has been eliminated and what remains a suspect?

- **A.** Nothing has been eliminated, since a loopback test says nothing more than a remote test would about where the service is failing.
- **B.** The remote client's DNS resolution is eliminated as a suspect, since the loopback test used a name rather than a raw address.
- **C.** The network cabling between the two hosts is eliminated as a suspect, since loopback traffic exercises the same physical path a remote client would use, which feels reasonable on first encounter in most textbooks and quick references.
- **D.** The service process itself is eliminated as a suspect, since it clearly is running and answering; a listening-address binding, a firewall rule, or routing between the two hosts remain suspects.

**Answer: D.** Loopback is the sharpest fault-localiser available: a service that answers on 127.0.0.1 but not from another machine is proven to be running, which narrows the remaining suspects to a listening-address binding, a firewall rule, or routing between the two hosts.

- A is wrong: A working loopback response specifically rules out the service being down or broken, narrowing the search to binding, firewall or routing issues between the hosts.
- B is wrong: 127.0.0.1 is a literal address, not a name, so a loopback test using it involves no DNS resolution at all and cannot eliminate a DNS suspect.
- C is wrong: Loopback traffic never reaches a physical interface at all, so it exercises no cabling and cannot eliminate cabling as a suspect for a remote-client failure.

### 144.

A user's `/etc/hosts` file has been edited so that `localhost` now points at a different address entirely. What continues to work, and what does not?

- **A.** Both `127.0.0.1` and `localhost` stop working entirely, since the edit is assumed to corrupt loopback functionality for the whole host at once.
- **B.** Neither is affected at all, since `/etc/hosts` is assumed to only govern remote name resolution and never the special reserved name `localhost`.
- **C.** `127.0.0.1` continues to work as before, but `localhost` may now resolve somewhere unexpected, because `localhost` is a name resolved through `/etc/hosts` rather than a fixed value.
- **D.** `127.0.0.1` stops working entirely, but `localhost` continues to resolve correctly because it is assumed to be hard-coded directly into the kernel by default on most systems administrators encounter.

**Answer: C.** `localhost` is a name resolved through `/etc/hosts`, so an edited or corrupted entry can make it resolve somewhere unexpected while `127.0.0.1` itself, being a literal address, continues to work exactly as before.

- A is wrong: Loopback addressing is handled by the kernel independently of any hosts file entry; editing the name mapping cannot break the literal address 127.0.0.1.
- B is wrong: `localhost` is resolved through `/etc/hosts` exactly like any other name in that file, so editing its entry does change what `localhost` resolves to.
- D is wrong: `localhost` is not hard-coded; it depends entirely on the hosts file or DNS, while 127.0.0.1 is the address that keeps working regardless of any such edit.

### 145.

A developer runs several local services and wants to give each one a distinct loopback address, such as 127.0.0.2 and 127.0.0.3, rather than sharing 127.0.0.1. Is that a valid approach?

- **A.** No — only 127.0.0.1 is reserved for loopback, and the rest of the 127.0.0.0/8 range is ordinary routable address space.
- **B.** No — using any address other than 127.0.0.1 for loopback purposes requires it to first be registered as RFC 1918 private space.
- **C.** Yes, but only up to 127.0.0.255, since the loopback reservation is limited to the final octet rather than the whole /8 block.
- **D.** Yes. The whole 127.0.0.0/8 block is reserved for loopback, so 127.0.0.2 and 127.0.0.3 loop back to the host exactly as 127.0.0.1 does, and are occasionally used this way.

**Answer: D.** The whole 127.0.0.0/8 block is reserved for loopback, not merely 127.0.0.1, so addresses such as 127.0.0.2 also loop back to the host — a fact occasionally used to give several local services distinct local addresses.

- A is wrong: The entire 127.0.0.0/8 block, not just the single address 127.0.0.1, is reserved for loopback and never reaches a network interface.
- B is wrong: Loopback addressing has nothing to do with RFC 1918 private space; the whole 127.0.0.0/8 block is a separate reservation defined independently of RFC 1918.
- C is wrong: The loopback reservation is the full /8 block, 127.0.0.0 through 127.255.255.255, not merely the final octet of the first subnet.

### 146.

A packet travels from a laptop, across two routers, to a server on a different network. Which of the following stays the same across every hop, and which changes at each router?

- **A.** The MAC addresses stay the same end to end, since they are the permanent hardware identifiers; the IP addresses are rewritten by each router instead.
- **B.** The source and destination IP addresses stay the same end to end; the source and destination MAC addresses are rewritten by each router to the next hop's addresses.
- **C.** Both the IP and MAC addresses stay identical at every hop, because routers only inspect headers without modifying either one.
- **D.** Both the IP and MAC addresses are rewritten at every hop, since each router treats the packet as an entirely new transmission.

**Answer: B.** A host fills in its own MAC as source and the next hop's MAC as destination; each router that forwards the packet strips the old frame and builds a new one with new MAC addresses, while the IP addresses in the packet stay untouched end to end — the key exam fact about MAC addresses is negative: they never cross a router.

- A is wrong: This reverses the actual behaviour: MAC addresses are rewritten hop by hop while IP addresses are what remain constant end to end.
- C is wrong: A router necessarily rebuilds the frame with new source and destination MAC addresses for the next hop; only the IP addresses are left untouched.
- D is wrong: IP addresses are preserved end to end specifically so the packet can be routed toward its ultimate destination; only the MAC addresses are rewritten hop by hop.

### 147.

A candidate needs the hardware address of `enp0s3`. Which iproute2 command is the layer 2 view of an interface, reporting the MAC in its `link/ether` field?

- **A.** `ip addr` with the `-6` flag added, since restricting the output to IPv6 is what makes the hardware address appear alongside the IPv6 addresses, which is the assumption most administrators start from.
- **B.** `ip route`, since the routing table lists the hardware address of the interface associated with each configured route, alongside that route's destination and next hop.
- **C.** `ip neigh`, since the neighbour cache is the table where every local interface's own hardware address is recorded once that interface has been brought up.
- **D.** `ip link`, because the link object is the layer 2 view of an interface and reports the hardware address in its `link/ether` field, which `ip addr` also prints above the layer 3 addresses.

**Answer: D.** `ip link` is the layer 2 command, printing each interface with its MAC in the `link/ether` field; `ip addr` is layer 3 only, which is why expecting a hardware address from it is a common mistake.

- A is wrong: `ip -6 addr` restricts output to IPv6 addressing and prints nothing at all for an interface that has no IPv6 address; it never adds hardware address information.
- B is wrong: `ip route` shows the routing table — destinations, next hops and interfaces — and does not display hardware addresses at all.
- C is wrong: `ip neigh` shows the neighbour (ARP) cache of other hosts' resolved addresses, not the local interface's own hardware address, which `ip link` reports.

### 148.

A device's MAC address changes every time it joins a Wi-Fi network, and an administrator flags this as evidence of a hardware fault. Is that the right conclusion?

- **A.** Yes — a MAC address is burned into the hardware and can never legitimately change under any circumstances.
- **B.** No. MAC addresses can be overridden in software, and many systems deliberately randomise them on wireless networks for privacy, which is normal behaviour rather than a fault.
- **C.** No, but only because the device must be silently switching between two separate physical network interfaces each time.
- **D.** Yes, but the fault lies in DHCP rather than in the network hardware, since DHCP is what assigns a new MAC on each join under typical operating conditions, an assumption that holds until it does not.

**Answer: B.** A MAC address is not permanent in practice: it can be overridden in software, and many systems deliberately randomise it on wireless networks for privacy, so a changing MAC on Wi-Fi joins is expected behaviour, not evidence of a hardware fault.

- A is wrong: While the manufacturer burns in an original MAC, it can be overridden in software, and Wi-Fi privacy randomisation is a deliberate, expected feature, not an anomaly.
- C is wrong: A single wireless interface randomising its own MAC address per network is the ordinary explanation; no second physical interface needs to be involved.
- D is wrong: DHCP assigns IP addressing information, not MAC addresses; a device's own operating system, not DHCP, is what randomises the MAC on Wi-Fi.

### 149.

A packet capture on a switch shows a frame addressed to `ff:ff:ff:ff:ff:ff`. What is that destination, and what happens to the frame?

- **A.** It is the broadcast MAC address, and the frame is delivered to every interface on that segment.
- **B.** It is a malformed or corrupted address, since a real MAC address cannot legitimately consist entirely of the same repeated value.
- **C.** It is the address of the segment's default gateway, since routers conventionally use that reserved value as their MAC address.
- **D.** It is a multicast group address, and the frame is delivered only to interfaces that have subscribed to that particular group.

**Answer: A.** The all-ones MAC address, ff:ff:ff:ff:ff:ff, is the broadcast address, delivered to every interface on the segment — the mechanism an ARP request relies on to reach every host without knowing in advance which one holds the target address.

- B is wrong: ff:ff:ff:ff:ff:ff is a valid, reserved value with a specific defined meaning — the broadcast address — not evidence of corruption.
- C is wrong: A gateway's MAC address is an ordinary vendor-assigned address like any host's; ff:ff:ff:ff:ff:ff is reserved specifically as the broadcast address, not for gateways.
- D is wrong: Multicast MAC addresses are identified by the Group bit, the low-order bit of the first octet, being set, not by any vendor-defined pattern; ff:ff:ff:ff:ff:ff is the reserved broadcast address, delivered to every interface rather than only to subscribed group members.

### 150.

A company's internal hosts, all on private addresses, can browse the internet without issue, but an external partner cannot connect to an internal web server without a separately configured rule. What explains the asymmetry?

- **A.** NAT is configured to allow outbound traffic only as a deliberate security policy decision, actively blocking every inbound connection attempt by design.
- **B.** NAT's translation table is built by outbound traffic; an unsolicited inbound packet has no matching entry and is dropped, so reaching the internal server requires an explicit destination-NAT (port forwarding) rule.
- **C.** The internal web server is unreachable because its private address is inherently invalid for any inbound connection, regardless of what NAT rules exist.
- **D.** The asymmetry is caused by DNS, since the partner's resolver has not yet been updated with the internal server's address.

**Answer: B.** NAT is the reason outbound connections from a private network 'just work' while inbound connections do not: the translation table is built by outbound traffic, so an unsolicited inbound packet has no entry to match and is dropped until an explicit destination-NAT rule creates one.

- A is wrong: NAT itself applies no policy at all; it drops unmatched inbound packets purely as a side effect of having no translation entry, not because it makes a security decision.
- C is wrong: A private address is a perfectly valid address on its own network; it becomes reachable from outside once an appropriate NAT and forwarding rule exists, which is exactly the missing piece here.
- D is wrong: The scenario describes a connection failure after a rule is configured, which is about reachability through NAT, not about whether a name resolves to an address.

### 151.

A network with heavy NAT translation in place is described by a manager as "secure, since NAT hides our internal addressing." Is NAT itself a security control?

- **A.** No. NAT blocks unsolicited inbound traffic as a side effect of having no mapping, not as a policy decision, and it inspects nothing; a network can run NAT with no filtering rules at all.
- **B.** Yes — NAT actively inspects every packet's payload and applies a deny-by-default policy to anything that looks suspicious before translating it.
- **C.** Yes, but only in its capacity as the mechanism that also enforces TLS encryption on every translated connection passing through it.
- **D.** No, but only because a firewall is what actually performs NAT's address translation, with NAT itself being a purely cosmetic label.

**Answer: A.** NAT is not a firewall: it blocks unsolicited inbound traffic only as a side effect of having no translation mapping, not as a policy decision, and it inspects nothing about the packet — a network can run NAT with no filtering rules configured at all.

- B is wrong: NAT inspects nothing about a packet's payload and applies no policy; it only rewrites addresses and ports and forwards based on whether a mapping exists.
- C is wrong: NAT has no relationship to TLS or encryption at all; it operates purely on addresses and ports, leaving the payload, encrypted or not, untouched.
- D is wrong: NAT is a real, distinct translation mechanism in its own right, commonly co-located with a firewall on the same device but not identical to or dependent on it.

### 152.

A web server behind a heavily used NAT gateway logs every visitor's IP address for an access-control list based on client location. What problem does this design run into?

- **A.** NAT preserves the original client address unchanged all the way to the server, so the access-control list works exactly as intended without any modification, since translation touches only the destination address on the return path.
- **B.** The server sees the NAT device's translated address as the source for every client, so logs and access-control decisions based on 'client IP' actually reflect the gateway, not the real visitor.
- **C.** The access-control list fails only because NAT blocks all logging traffic outright, preventing the server from recording any address at all.
- **D.** The problem is unrelated to NAT and is instead caused by DNS caching returning a stale address for each visitor's hostname.

**Answer: B.** NAT breaks the end-to-end assumption some protocols and logging schemes make: a server behind NAT sees the translated source address, so logs and access-control lists based on client IP see the NAT device's address rather than the real client's, which is why forwarded headers exist to recover it.

- A is wrong: NAT specifically rewrites the source address as part of its normal operation; the server does not see the original client address unless a forwarded header is added separately.
- C is wrong: NAT does not block logging traffic; the server logs an address just fine, it is simply the gateway's translated address rather than the original client's.
- D is wrong: The scenario concerns the source IP address seen on incoming connections, which is a NAT translation effect, not a DNS caching or name-resolution issue.

### 153.

Why is IPv6 generally said to make NAT unnecessary, rather than to standardise it?

- **A.** IPv6 was specifically designed to standardise and formalise NAT as a mandatory part of every network's addressing architecture.
- **B.** IPv6's address space is vast enough that every device can hold a globally unique, routable address, removing the address-scarcity problem that made NAT necessary for IPv4.
- **C.** IPv6 makes NAT unnecessary because it eliminates private addressing entirely, so every IPv6 address is inherently public and requires no local addressing scheme at all, the private ranges having been dropped in the redesign.
- **D.** IPv6 makes NAT unnecessary because routers under IPv6 forward every packet regardless of its source address, bypassing the need for translation entirely.

**Answer: B.** IPv6 was designed with an address space vast enough that every device can hold its own globally unique, routable address, removing the address-scarcity problem that made NAT necessary for IPv4 — IPv6 was designed to make NAT unnecessary, not to standardise it.

- A is wrong: IPv6 was designed in the opposite direction: to remove the address scarcity that made NAT necessary in IPv4, not to make NAT a mandatory, standardised feature.
- C is wrong: IPv6 retains its own private-style addressing concepts, such as unique local addresses; the reason NAT becomes unnecessary is abundant address space, not the absence of any private addressing.
- D is wrong: Router forwarding behaviour under IPv6 is not what removes the need for NAT; it is the sheer size of the address space, which removes the scarcity that motivated NAT in IPv4.

### 154.

Given the block 10.4.20.0/27, a colleague proposes assigning 10.4.20.0 to a new server because it is the first address in the range. Using the mask to derive the block's boundaries, what should happen instead?

- **A.** 10.4.20.0 is fine to assign, since only the last address in a block, not the first, is ever reserved from host use.
- **B.** Since /27 leaves 5 host bits for a 32-address block, the all-zero address 10.4.20.0 is the network address and not a usable host, so it must be rejected as a host address.
- **C.** 10.4.20.0 is fine to assign, because reservation of the network address only applies to blocks smaller than a /27.
- **D.** 10.4.20.0 must be rejected, but only because a /27 block must begin at an address one above a multiple of 32, so .0 falls below the first legal boundary of the block it is meant to open.

**Answer: B.** For 10.4.20.0/27 the 5 host bits give a 32-address block from 10.4.20.0 through 10.4.20.31; the network address 10.4.20.0 and the broadcast address 10.4.20.31 are both reserved, leaving 10.4.20.1 through 10.4.20.30 as the 30 usable host addresses.

- A is wrong: Both ends of the block are reserved: the all-zero address names the network and the all-one address is the broadcast, not just the highest address.
- C is wrong: The network-address reservation applies to every prefix length that leaves any host bits at all, not to a subset defined by block size.
- D is wrong: The reason for rejection is that all host bits are zero, marking it as the network address; it does not happen to coincide with the mask value, which is a separate 32-bit quantity entirely.

### 155.

A monitoring tool flags every address ending in `.255` across a network as "a broadcast address, and therefore misconfigured if assigned." Is that rule reliable?

- **A.** Yes — an address ending in `.255` is always the broadcast address, regardless of which mask applies to that network.
- **B.** No, but only because the rule should instead check for addresses ending in `.0`, which are the true broadcast addresses that routers flood to every host on a subnet.
- **C.** Yes, because 255.255.255.255 is the broadcast address for every network regardless of the mask configured on it.
- **D.** No: the broadcast address depends on the mask, not on the last octet; under a /16 mask, 10.0.0.255 is an ordinary usable host address, not a broadcast.

**Answer: D.** The broadcast address is derived from the mask, not from a fixed pattern in the address itself: 10.0.1.255 is the broadcast under a /24 mask, but the same-looking 10.0.0.255 is an ordinary usable host under a /16 covering the same range.

- A is wrong: Whether an address ending in .255 is a broadcast address depends entirely on the mask in force; under many masks it is an ordinary usable host address.
- B is wrong: An address ending in .0 is typically the network address under common masks, not the broadcast address; neither fixed ending reliably identifies a broadcast address.
- C is wrong: 255.255.255.255 is the limited broadcast, a separate, never-routed address; it is not the directed broadcast for any particular subnet.

### 156.

What is the practical difference between the limited broadcast address, 255.255.255.255, and a subnet's directed broadcast address?

- **A.** They are the same address written two different ways, one in dotted-decimal and the other implied by the subnet mask.
- **B.** The limited broadcast is local-link only and is never routed anywhere, while a directed broadcast targets one specific subnet and, historically, could be forwarded toward it by routers.
- **C.** The limited broadcast can be routed across the internet to reach any subnet, while a directed broadcast never leaves its originating link.
- **D.** Only the directed broadcast exists in IPv4; the limited broadcast address is an IPv6-only concept with no IPv4 counterpart.

**Answer: B.** 255.255.255.255 is the limited broadcast, confined to the local link and never routed, which is a different thing from a subnet's directed broadcast (such as the highest address in a /27 block) that names one particular network and was historically forwardable toward it.

- A is wrong: 255.255.255.255 is a fixed, single address; a directed broadcast is a different, mask-dependent address computed per subnet, not an alternate notation for the same value.
- C is wrong: This reverses the actual behaviour: the limited broadcast never leaves the local link, while a directed broadcast is the one associated with router-forwarding behaviour.
- D is wrong: Both the limited broadcast and directed broadcasts are IPv4 concepts; IPv6 has no broadcast address of either kind at all.

### 157.

Which RFC changed the required router default for handling directed broadcasts, and what did it change it to?

- **A.** RFC 919 — the original broadcast specification is also the one that mandated routers stop forwarding directed broadcasts by default, and no later RFC revisited that requirement.
- **B.** RFC 1122 — the host requirements document is also the source of the change to router forwarding defaults for broadcasts.
- **C.** RFC 2644 (BCP 34), which changed the required default so that modern routers block receipt and forwarding of directed broadcasts unless explicitly configured otherwise.
- **D.** RFC 4632 — the CIDR specification also happens to be the source of the modern directed-broadcast forwarding default.

**Answer: C.** RFC 919 originally defined a directed broadcast as something gateways forward toward the target network, but RFC 2644 (BCP 34) later changed the required router default so that directed broadcasts are blocked by default rather than forwarded.

- A is wrong: RFC 919 defined the original directed-broadcast behaviour, where gateways forwarded such traffic toward the target network; it was RFC 2644 that later changed the required default.
- B is wrong: RFC 1122 covers host requirements generally; the specific change to router broadcast-forwarding defaults comes from RFC 2644, not RFC 1122.
- D is wrong: RFC 4632 defines classless addressing and prefix notation; it has no bearing on broadcast-forwarding defaults, which come from RFC 2644.

### 158.

A firewall rule and a network configuration file were both written against `eth0` on a server that has since been moved to hardware using predictable interface naming. Deploying the same configuration now fails silently. Why?

- **A.** The configuration fails because `eth0` is a reserved name that can never be assigned to any interface on any Linux system, predictable naming or not.
- **B.** The configuration fails because moving hardware always regenerates the MAC address of every interface, invalidating any rule written against a specific interface name.
- **C.** The configuration fails because `net.ifnames=0` must have been silently enabled by the move, which is defined to always disable every previously working interface reference.
- **D.** On a predictable-naming system there is usually no interface literally named `eth0`; the configuration should be written against whatever `ip link` actually shows, such as `enp0s3`, not the old detection-ordered name.

**Answer: D.** A firewall rule, a route or a network configuration file that names the wrong interface fails silently, and writing configuration against `eth0` from habit without checking is exactly that trap — on a predictable-naming system there is usually no such interface, and `ip link` is the only reliable way to find out what the system actually uses.

- A is wrong: `eth0`-style names are not reserved or forbidden; they are simply the older, detection-ordered convention that predictable naming was introduced to replace, and they can still appear if predictable naming is disabled.
- B is wrong: Moving hardware does not regenerate MAC addresses; the actual issue is that the interface's name itself changed under the predictable-naming scheme, unrelated to any change in its MAC address.
- C is wrong: `net.ifnames=0` would restore `eth0`-style names, not disable references to them; the scenario describes the opposite situation, moving to hardware that uses predictable naming instead.

### 159.

A predictable interface name reads `enp0s3`. Decode what each part of that name is saying about the interface.

- **A.** `en` for a wireless interface, `p0s3` for the fourth interface detected at boot, in the same detection-order scheme `eth0` and `eth1` used previously.
- **B.** `en` for the network manager in use, `p0s3` for the fourth priority level assigned to the interface by that manager's configuration.
- **C.** `enp0s3` is an entirely arbitrary, randomly generated label with no decodable structure or relationship to the underlying hardware at all.
- **D.** `en` for Ethernet, `p0` for PCI bus 0, `s3` for slot 3: an Ethernet interface located at PCI bus 0, slot 3, derived from the hardware's own topology.

**Answer: D.** A predictable name starts with a two-character prefix for the interface type — `en` Ethernet, `wl` wireless LAN, `ww` wireless WAN — followed by a suffix derived from where the device sits: `p<bus>s<slot>` the PCI geographic location, so `enp0s3` reads as Ethernet, PCI bus 0, slot 3.

- A is wrong: `en` specifically denotes Ethernet, not wireless (`wl` is the wireless prefix), and the suffix encodes hardware topology, a PCI bus and slot, not a detection-order count the way `eth0` and `eth1` did.
- B is wrong: The prefix identifies interface type (Ethernet, wireless, and so on), not which network manager is in use, and the suffix encodes hardware location, not a manager-assigned priority level.
- C is wrong: The name is deliberately structured and decodable, derived from hardware topology, precisely so it remains stable and meaningful across reboots, not arbitrary or random.

### 160.

A disk is physically moved from one server to another with a different hardware layout. What happens to a predictable interface name that configuration on that disk refers to?

- **A.** It stays exactly the same regardless of hardware changes, since predictable names are defined to be permanently fixed to the operating system installation rather than to hardware topology, since the assigned name is stored with the installation and read back unchanged at every boot.
- **B.** It reverts automatically to the older `eth0`-style detection-ordered naming scheme whenever a disk is moved to different hardware.
- **C.** It is likely to change — a predictable name is stable but not portable, so moving to different hardware, or a card to a different PCI slot, produces a different name and breaks configuration that hard-codes the old one.
- **D.** It is regenerated based on the interface's MAC address rather than its physical location, so the name stays identical as long as the same network card is reused.

**Answer: C.** A predictable name is stable but not portable: moving a disk to different hardware, or a card to a different PCI slot, produces a different name and breaks configuration that hard-codes the old one — the loopback interface `lo` is the one exception, always named the same regardless of scheme.

- A is wrong: Predictable names are derived from hardware topology specifically, not fixed permanently to the OS installation; moving to different hardware changes the topology and therefore the name.
- B is wrong: Moving hardware does not automatically revert the naming scheme; predictable naming remains in effect and simply derives a different name from the new hardware's topology, unless `net.ifnames=0` is separately set.
- D is wrong: While an `x<MAC>`-based suffix scheme exists as one option, the common PCI-path-based naming described here is location-based, not MAC-based, so a differently located card produces a different name even if the MAC stays the same.

### 161.

How can predictable interface naming be disabled to restore the older `eth0`-style names, and who actually assigns interface names day to day?

- **A.** The `net.ifnames=0` kernel parameter enables the scheme rather than disabling it, and names are assigned directly by whichever network manager, such as NetworkManager, happens to be installed.
- **B.** Predictable naming can only be disabled by physically replacing the network card, and names are assigned by the BIOS or UEFI firmware rather than by any software component.
- **C.** Predictable naming is permanent and cannot be disabled once enabled, and names are assigned directly and irreversibly by the kernel at compile time.
- **D.** The `net.ifnames=0` kernel parameter disables the scheme; day to day, names are assigned by udev's naming policy, not chosen directly by the distribution's networking tool.

**Answer: D.** The scheme can be disabled with the `net.ifnames=0` kernel parameter, restoring `eth0` style names, and the names themselves are not chosen by the distribution's networking tool; they come from udev's naming policy, so renaming an interface reliably means writing a udev rule or a systemd `.link` file rather than editing the network configuration.

- A is wrong: `net.ifnames=0` disables predictable naming, restoring the older scheme, not the other way around; and names are assigned by udev's policy, not directly by the network manager application.
- B is wrong: No hardware replacement is needed; a simple kernel parameter, `net.ifnames=0`, disables the scheme, and names are assigned by udev in the operating system, not by firmware.
- C is wrong: The scheme is not permanent or irreversible; it is a runtime kernel parameter, `net.ifnames=0`, that restores the older naming, and names are assigned by udev's policy at runtime, not fixed at kernel compile time.

### 162.

A monitoring check against a new service on port 8443 has been failing since deployment. `nc -zv api.example.com 8443` hangs for the full timeout with no response, while `nc -zv api.example.com 22` succeeds instantly. What does this pair of results indicate, and what is the correct next diagnostic step?

- **A.** The 8443 timeout indicates a silent drop, port-specific since 22 works instantly; routing is ruled out, so the next step is checking the server's own bind address and then the firewall policy for port 8443 specifically.
- **B.** Both results indicate the exact same underlying cause, since a timeout and an instant success are treated as equally strong evidence of the identical routing problem.
- **C.** The 8443 timeout proves the entire host is unreachable, and the 22 success must therefore be a stale cached result rather than a genuine current connection.
- **D.** The correct next step is to read the firewall policy first, before checking anything about the server's own service configuration or bind address.

**Answer: A.** Timing the failure is the first diagnostic move: an instant refusal means the host is up and reachable, pointing at the service or its bind address, while a timeout means nothing answered at all — testing a known-open port like 22 alongside the failing one isolates whether the filtering is selective by port or a blanket problem, and `ss -tulpn` on the server itself is the complementary check from the listening side, before reading any firewall policy.

- B is wrong: A timeout and an instant success are opposite outcomes with different diagnostic meanings; treating them as equally indicating the same cause discards the most useful evidence in the report.
- C is wrong: A working connection on port 22 to the same host at the same time is genuine evidence of reachability, not a stale cache; the host is clearly reachable, and only port 8443 specifically is affected.
- D is wrong: Reading firewall rules before checking the server's own listening state is how administrators spend an hour on a firewall that was never involved; the server's bind address should be checked first.

### 163.

A port scan reports a target port as "closed." A junior analyst reads this as "blocked by a firewall." Is that the correct reading?

- **A.** Yes — a port reported as closed always means a firewall somewhere on the path silently dropped the connection attempt without ever reaching the host.
- **B.** No — closed is not blocked; it is a cooperative answer, an RST, from a working host with nothing listening on that port, which proves layer 3 reachability rather than a block.
- **C.** No, but only because "closed" actually means the destination host does not exist at all, rather than that it exists but has nothing listening.
- **D.** Yes, but only for UDP scans, since a UDP port reported closed is defined to always indicate a firewall block rather than an application-level absence of a listener, because UDP provides no way for a host to report an absent listener.

**Answer: B.** "Closed" is not "blocked": a closed port is a cooperative answer from a working host, and it proves layer 3 reachability — for TCP, a SYN to a closed port is answered with RST, an answer that arrives fast, unlike the silence a filtered port produces.

- A is wrong: A silently dropped connection attempt is reported as filtered, not closed; closed specifically means the host answered with an RST, proving the packet reached a live host.
- C is wrong: A closed port specifically means a live, existing host answered; a nonexistent host would more typically produce a routing failure or a timeout, not a cooperative RST response.
- D is wrong: A closed UDP port is not a firewall signature: closed UDP ports usually answer with an ICMP port unreachable error, which is exactly how a scan reports them closed. The genuinely ambiguous UDP case is silence, which is reported as open or filtered rather than closed.

### 164.

A firewall configured to REJECT rather than DROP is in the path to a service. A scan against it comes back with an immediate refusal. Does that immediate refusal conclusively prove the destination host itself has nothing listening?

- **A.** Yes — an immediate refusal is always generated exclusively by the destination host itself and can never originate from an intermediate firewall or security appliance sitting somewhere on the path.
- **B.** No, but only because REJECT rules are exclusively a UDP-scanning artefact and have no bearing whatsoever on TCP-based port scans, which always report closed ports as filtered instead.
- **C.** Yes, but only when the scan is run with `nc -zv` specifically, since other scanning tools are defined to correctly distinguish a REJECT rule from a genuinely closed port by inspecting the reply's source rather than just its type.
- **D.** No, a REJECT rule answers on the destination host's behalf, so a firewall anywhere on the path can produce the refusal without the destination ever seeing the packet; an immediate refusal proves only that something on the path answered, not that the destination is up with nothing listening.

**Answer: D.** A firewall configured to REJECT rather than DROP produces the refused response too, so an immediate refusal does not conclusively prove nothing is listening — it does prove something on the path answered, but a REJECT rule sources its reply from the original packet's destination address without the destination host itself ever seeing the packet.

- A is wrong: A REJECT rule on an intermediate firewall specifically can source the refusal on the destination's behalf, so an immediate refusal does not always originate from the destination host itself.
- B is wrong: REJECT rules apply to TCP scans as well as UDP ones; the described subtlety, the reply sourced on the destination's behalf, is not restricted to UDP scanning.
- C is wrong: No standard scanning tool can reliably distinguish a REJECT rule's reply from a genuinely closed port's RST from outside the network; this is an inherent limitation of the technique, not specific to `nc -zv`.

### 165.

Why is a UDP port scan considered fundamentally unreliable compared to a TCP scan?

- **A.** UDP scans are unreliable only because `nc -zv` does not support the `-u` flag needed to test UDP ports at all on any current version.
- **B.** UDP scans are unreliable because UDP packets are always dropped by every firewall by default, making every UDP port appear closed regardless of its actual state.
- **C.** UDP scans are unreliable only on IPv6 networks, since IPv4 UDP scanning is defined to always produce a definitive open, closed or filtered result.
- **D.** UDP has no handshake, so silence in response to a probe is ambiguous between an open port that simply chose not to reply and a port that is genuinely filtered.

**Answer: D.** UDP has no handshake, so no response is ambiguous between an open port that simply does not reply and a filtered one — for TCP, a SYN to an open port gets SYN-ACK and a SYN to a closed port gets RST, both fast, definitive answers UDP has no equivalent of.

- A is wrong: `nc -zv` does support `-u` for testing UDP; the unreliability comes from UDP's lack of a handshake making silence ambiguous, not from a missing tool feature.
- B is wrong: Firewalls do not universally drop all UDP traffic by default; the unreliability is specifically about silence being ambiguous between an open, non-responding port and a genuinely filtered one.
- C is wrong: The ambiguity in UDP scanning comes from UDP's connectionless design itself, applicable to both IPv4 and IPv6, not from any IPv6-specific limitation.

### 166.

A technician is told only 'the application is broken.' Checking the host: the interface has a link light and a MAC address, `ip addr` shows a valid IP and default route, ping to the server succeeds, but connecting to the service's TCP port is refused instantly. Which OSI layer does that evidence point to?

- **A.** Layer 4, Transport. The packet reached the host and something answered with a refusal, which is a transport-layer event.
- **B.** Layer 3, Network — routing must still be at fault even though the ping already succeeded.
- **C.** Layer 7, Application — the phrase 'the application is broken' names the layer directly.
- **D.** Layer 2, Data Link — an immediate refusal usually points at a switching problem on the segment, since frame delivery is what a live link light actually proves.

**Answer: A.** The OSI model is a fault-isolation ladder: each confirmed layer removes it from suspicion. Link and MAC confirm layer 2, a working ping and route confirm layer 3, and an instant TCP refusal is generated at layer 4, which is exactly where the evidence should be read from next.

- B is wrong: The successful ping and valid default route already confirmed layer 3, so a routing explanation ignores evidence already in hand.
- C is wrong: Taking a vague complaint at face value skips the ladder the model exists to support; an instant refusal is a transport-layer signature, not evidence about the application itself.
- D is wrong: Layer 2 was already confirmed by the link light and MAC address; a data-link fault would prevent any frame exchange, not produce a fast refusal from a live host.

### 167.

A candidate says the internet runs on a seven-layer stack because that is the model taught for troubleshooting. Which correction applies, and what is the model the internet actually implements?

- **A.** The internet implements the four-layer TCP/IP model; OSI is a seven-layer teaching and troubleshooting vocabulary, not a deployed stack.
- **B.** Both models are implemented side by side, with OSI handling addressing and TCP/IP handling delivery.
- **C.** The seven-layer model is correct, and TCP/IP is simply an older, deprecated name for the same thing.
- **D.** Neither model applies to the modern internet, which is organized around software-defined layers unrelated to either under typical operating conditions.

**Answer: A.** OSI's seven layers are a vocabulary for describing and dividing responsibilities; TCP/IP's four layers — link, internet, transport, application — are what RFC 1122 specifies and what every host on the internet genuinely runs.

- B is wrong: No host runs two parallel stacks; OSI is a reference vocabulary layered onto discussion of the one stack that is actually implemented.
- C is wrong: TCP/IP is not a deprecated synonym; it is the four-layer model actually implemented, with a different layer count and different boundaries from OSI.
- D is wrong: Every host still implements the four TCP/IP layers regardless of any software-defined overlay built on top of them.

### 168.

List the seven OSI layers in order from the physical medium upward.

- **A.** Physical, Network, Data Link, Session, Transport, Presentation, Application.
- **B.** Data Link, Physical, Network, Transport, Application, Session, Presentation.
- **C.** Physical, Data Link, Network, Session, Transport, Presentation, Application.
- **D.** Physical, Data Link, Network, Transport, Session, Presentation, Application.

**Answer: D.** Layer numbering runs 1 through 7 from the physical medium upward: Physical, Data Link, Network, Transport, Session, Presentation, Application, and questions naming a device or protocol are testing recall of this exact order.

- A is wrong: Data Link and Network are swapped, and so are Transport and Session, which is a common ordering slip.
- B is wrong: The physical medium is layer 1 by definition, and Application belongs last, not in the middle of the stack.
- C is wrong: Transport is layer 4 and Session is layer 5; this ordering has them reversed.

### 169.

A vendor advertises a 'layer 3 switch' and a colleague concludes that switching must therefore be a layer 3 function. What is wrong with that conclusion?

- **A.** The device performs two functions (switching at layer 2 and routing at layer 3), and combining them in one box does not move switching to a different layer.
- **B.** Nothing is wrong; a layer 3 switch proves that modern switching hardware has genuinely moved up to operate at the network layer now.
- **C.** The device only routes traffic between subnets and never actually performs any layer 2 switching, despite the marketing name it carries.
- **D.** The device operates entirely at layer 4, since it manages its physical ports the same way a stateful firewall manages transport-layer ports, forwarding on port numbers rather than on MAC addresses.

**Answer: A.** A hub is layer 1, a switch layer 2, a router layer 3, and a 'layer 3 switch' is simply a device that does both switching and routing — the marketing name does not change which layer either individual function belongs to.

- B is wrong: The name is a marketing label for a device that both switches and routes; it does not redefine which layer switching itself belongs to.
- C is wrong: A layer 3 switch genuinely performs layer 2 switching in addition to layer 3 routing; it is not routing-only under a misleading label.
- D is wrong: Managing ports as physical interfaces on a switch is unrelated to layer 4 transport ports, and the device does not operate at layer 4 for switching.

### 170.

A server does not respond to `ping`, and an operator immediately reports it as down. TCP services on the same host, tested separately, work perfectly. What does this combination actually show, and what should the operator have concluded first?

- **A.** It shows ICMP is being filtered or the host is configured not to answer echo requests; the host is clearly up, so "ping fails, therefore the host is down" is the wrong conclusion.
- **B.** It shows the host is genuinely down, since a working TCP connection to the same address without a working ping is a technical impossibility on any real network, because a TCP handshake cannot complete until the same host has already answered an ICMP echo request.
- **C.** It shows DNS is misconfigured for that host, since a failed ping combined with working TCP connections is defined to always indicate a name-resolution problem.
- **D.** It shows the host's routing table is broken, since only a routing failure could explain ICMP failing while TCP traffic to the very same address succeeds.

**Answer: A.** `ping` is the cheapest reachability test available, but a failed ping does not prove a host is down: ICMP is very commonly blocked by policy while TCP services on the same host work perfectly, which is exactly why treating ping failure as proof of a dead host is a classic, examinable wrong conclusion.

- B is wrong: A host can be fully up and serving TCP connections while ICMP is filtered separately; the two are independent, and a working TCP connection alongside a failed ping is a common, expected combination.
- C is wrong: The scenario does not describe a naming issue at all; both the failed ping and the working TCP connections were tested against the same reachable host, which points at ICMP filtering, not DNS.
- D is wrong: A broken routing table would affect TCP traffic just as much as ICMP traffic to the same destination; the described split, ICMP failing while TCP succeeds, points at protocol-specific filtering, not routing.

### 171.

Running `ping web01` produces "Name or service not known." A colleague starts checking cabling and switch ports. Is that the right first move given this particular error message?

- **A.** No — this specific message means name resolution failed, not reachability; ping answers a name as well as an address, so this points straight at DNS or `/etc/hosts`, not at cabling or switching.
- **B.** Yes — "Name or service not known" is defined to always indicate a physical-layer fault, making cabling and switch ports the correct first thing to check, since ping reports resolver failures with a separate 'unknown host' message instead.
- **C.** No, but only because the correct first move is instead to check the default gateway configuration rather than name resolution at all.
- **D.** No, but only because the correct first move is instead to check the ARP cache for the target host's MAC address before anything else.

**Answer: A.** Reading the failure text before anything else pays off here: "Name or service not known" is DNS, not reachability, and the message states this plainly, which is exactly the distinction readers routinely skip past on their way to checking cabling and switches.

- B is wrong: The message specifically reports a naming failure, not a physical-layer one; checking cabling and switches first skips past the actual, plainly stated cause.
- C is wrong: The gateway matters for reaching off-subnet destinations by address, but this specific error message is about resolving a name, which points at DNS or `/etc/hosts`, not the gateway.
- D is wrong: ARP resolves an already-known IP address to a MAC address on the local segment; a name-resolution failure happens before any address exists to resolve into a MAC at all.

### 172.

A router along the path replies "Destination Host Unreachable" to a `ping`. Who generated that message, and what does it actually report?

- **A.** The target host itself generated it directly, confirming it received the ping but is deliberately refusing to answer it under its current configuration.
- **B.** A router along the path generated it, reporting that it could not deliver the packet; it is a third party's report, not the target host answering.
- **C.** The originating host's own local DNS resolver generated it as a cached response to a previous, unrelated failed lookup for the same name.
- **D.** A firewall on the originating host itself generated it locally, before the ping packet had even left the machine attempting to send it.

**Answer: B.** Destination unreachable (ICMP type 3) is what produces "Destination Host Unreachable," and it is generated by a router on the path reporting it could not deliver the packet — a third party's report, not the target host answering, which is why it does not by itself confirm anything about the target itself.

- A is wrong: This specific message is generated by an intermediate router, not the target host; the target never received the packet at all in this scenario.
- C is wrong: A DNS resolver does not generate ICMP unreachable messages; this message is an ICMP-layer report from a router on the path, unrelated to name resolution or caching.
- D is wrong: The message arrives as a reply from somewhere on the network path, not generated locally before the packet leaves the originating host at all.

### 173.

A TCP handshake to a service succeeds cleanly while `ping` to the same host fails entirely. What does that combination prove about ICMP specifically?

- **A.** It proves ICMP is filtered somewhere on the path rather than the host being down, since a successful TCP handshake independently confirms the host is up and reachable.
- **B.** It proves the TCP handshake result must be wrong or spurious, since a genuinely reachable host is defined to always also answer ICMP echo requests successfully, because a TCP handshake cannot complete until an ICMP echo has already been exchanged.
- **C.** It proves the host's routing table has a fault specific to ICMP traffic while somehow leaving TCP traffic completely unaffected on the same path.
- **D.** It proves DNS resolved the ping target to a different, unreachable address than the one the TCP connection actually used to reach the host successfully.

**Answer: A.** If ping fails but the service must be tested anyway, testing the port directly is the next step: a TCP handshake succeeding while ICMP fails is common and proves ICMP is filtered rather than the host being down, converting an inconclusive ping result into a specific, testable finding.

- B is wrong: There is no such guarantee; ICMP is very commonly filtered independently of TCP reachability, so a successful handshake is the more reliable evidence here, not the ping failure.
- C is wrong: A routing-table fault would typically affect all traffic to a destination, not selectively spare TCP; the more direct and common explanation is a policy that filters ICMP specifically.
- D is wrong: Nothing in the scenario suggests different addresses were used; the straightforward reading is that ICMP is specifically filtered while TCP reaches the same host successfully.

### 174.

A thousand clients connect to the same web server on port 443 at once. How does the server distinguish one client's conversation from another's, given they all target the identical port?

- **A.** By the full four-tuple (source address, source port, destination address, destination port), since each client's own address and ephemeral source port make its connection unique even though the destination port is shared.
- **B.** By destination port alone, since port 443 is defined to be unique per connection and the server simply opens a fresh port 443 instance for each new client.
- **C.** By MAC address alone, since every client's hardware address is preserved end to end and is what the server actually uses to distinguish one conversation from another.
- **D.** By TTL value alone, since each client's operating system sets a sufficiently distinct starting TTL for the server to use as a unique per-connection identifier.

**Answer: A.** A connection is identified by the pair of sockets: source address, source port, destination address, destination port — the four-part identity is why thousands of clients can reach the same server port simultaneously without ambiguity, since each client contributes a distinct address and ephemeral source port.

- B is wrong: The server does not open a new destination port per client; the port stays 443 for every connection, and it is the client-side address and port that make each connection distinct.
- C is wrong: MAC addresses are rewritten at every router and never reach the server intact from a remote client; the server identifies connections by IP address and port, not by MAC.
- D is wrong: TTL is a hop-count field that decrements at every router and is not designed or reliable as a connection identifier; the four-tuple of addresses and ports is what actually distinguishes connections.

### 175.

`ss -tulpn` shows a process listening at `127.0.0.1:8080` and another at `0.0.0.0:9090`. A remote client can reach the second but not the first. Why?

- **A.** The Local Address column decides it: `127.0.0.1` accepts only from the same machine, while `0.0.0.0` accepts on every address the host holds, including from remote clients.
- **B.** The port numbers decide it — 9090 is inherently reachable from remote hosts while 8080 is inherently restricted to local connections regardless of the bind address shown, because the kernel reserves the 8000-8999 band for loopback traffic.
- **C.** The process names decide it, since `ss -tulpn` restricts remote reachability based on which named process owns each socket rather than on the bound address.
- **D.** Whether `-n` was used decides it, since numeric output is what actually enables remote clients to reach a listening socket in the first place.

**Answer: A.** Binding to 127.0.0.1 rather than 0.0.0.0 is the single most common cause of "the service is running but nothing can connect," and it is invisible unless you read the Local Address column rather than just the port — 127.0.0.1 accepts only from the same machine, while 0.0.0.0 accepts on every address the host holds.

- B is wrong: No port number is inherently local-only or inherently remote-reachable; reachability is governed by the bind address in the Local Address column, not by which port number is chosen.
- C is wrong: `ss -tulpn`'s `-p` column reports which process owns a socket for diagnostic purposes; it does not itself restrict or grant reachability, which is governed by the bind address instead.
- D is wrong: `-n` only affects whether ports are displayed numerically rather than as translated service names; it has no effect at all on which addresses a socket is actually reachable from.

### 176.

An unprivileged process tries to bind port 80 directly and fails with a permission error, though the port is not in use by anything else. Why?

- **A.** The port must actually be in use by something else already, since binding failures below 1024 are always caused by an existing conflicting listener rather than by a privilege check.
- **B.** The process must be trying to bind the wrong address family, since binding failures on low-numbered ports are typically an IPv4-versus-IPv6 mismatch rather than a privilege issue.
- **C.** Ports below 1024 require privilege to bind on Linux, so a non-root process cannot simply listen on 80 regardless of whether the port is otherwise free.
- **D.** A firewall rule must be blocking the bind attempt, since firewalls are what typically prevent an unprivileged process from binding a low-numbered port on Linux.

**Answer: C.** Ports below 1024 require privilege to bind on Linux, which is why a non-root process cannot simply listen on 80 — the port is not "opened by the operating system," it is open because a privileged process bound it and is listening, independent of whether the port would otherwise be free.

- A is wrong: The scenario states the port is not in use; the failure is a privilege requirement specific to ports below 1024, not evidence of an undetected conflicting listener.
- B is wrong: An address-family mismatch produces a different kind of error, not specifically a permission error; the described failure is the well-documented privilege requirement for ports below 1024.
- D is wrong: A firewall filters traffic in transit; it does not prevent a local process from binding a socket at all, which is a kernel-level privilege check unrelated to firewall policy.

### 177.

Where does a client's own source port typically come from when it initiates a connection, and does the administrator normally choose it?

- **A.** The kernel picks an unused source port automatically from a configured ephemeral range (on Linux, from `/proc/sys/net/ipv4/ip_local_port_range`, 32768 to 60999 by default), without the administrator choosing it per connection.
- **B.** The administrator manually assigns a fixed source port for every outbound connection a client makes, matching the destination port being contacted so that both ends of the connection use the identical port number.
- **C.** The source port always matches the destination port, so a connection to port 443 automatically uses source port 443 as well on the client side.
- **D.** DHCP assigns the source port to the client alongside its IP address, gateway and DNS servers as part of the same lease.

**Answer: A.** A client's kernel picks an unused source port automatically — on Linux from the range in `/proc/sys/net/ipv4/ip_local_port_range`, 32768 to 60999 by default — and connects to the server's address and port, with no manual per-connection selection required.

- B is wrong: Source ports are picked automatically by the kernel for outbound connections; manually assigning a fixed source port per connection is neither the default nor the ordinary practice.
- C is wrong: The client's source port is an arbitrary ephemeral value chosen by the kernel, unrelated to the destination port; source and destination ports are not required to match.
- D is wrong: DHCP assigns addressing configuration only — address, mask, gateway, DNS servers; it has no role in choosing a source port, which the kernel selects per connection instead.

### 178.

A host holds the address 100.64.0.5. A technician assumes it is RFC 1918 private space because it clearly is not publicly routable. Is that assumption correct?

- **A.** Yes — anything that is not globally routable on the internet is, by definition, one of the RFC 1918 private ranges under typical operating conditions.
- **B.** No, but only because 100.64.0.5 is actually loopback space rather than RFC 1918 or carrier-grade NAT space.
- **C.** No, 100.64.0.0/10 is carrier-grade NAT space, a fourth non-globally-routable range defined separately from the three RFC 1918 blocks.
- **D.** No, but only because 100.64.0.5 is link-local (APIPA) space rather than RFC 1918 or carrier-grade NAT space.

**Answer: C.** RFC 1918 sets aside exactly 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16; 100.64.0.0/10 for carrier-grade NAT, 127.0.0.0/8 for loopback and 169.254.0.0/16 for link-local are all separately defined non-routable ranges outside RFC 1918.

- A is wrong: Non-routability is not the same as RFC 1918 membership; carrier-grade NAT space, loopback and link-local are all non-routable without being RFC 1918.
- B is wrong: Loopback is the fixed 127.0.0.0/8 block; 100.64.0.5 falls in the separate carrier-grade NAT range, not in loopback space.
- D is wrong: Link-local (APIPA) space is 169.254.0.0/16, a different range entirely from the 100.64.0.0/10 carrier-grade NAT block that 100.64.0.5 falls in.

### 179.

A private network with no internet connection at all is being designed. A reviewer insists NAT must still be configured "because private addresses always need it." Is the reviewer right?

- **A.** Yes — any use of RFC 1918 addressing requires NAT to be configured somewhere in the design, whether or not the network in question ever reaches the internet at all, regardless of which distribution or vendor is involved.
- **B.** Yes, but only because private addresses are treated as inherently invalid unless a NAT device is present somewhere on the path to validate them first.
- **C.** No, but only because a firewall, not NAT, is what private addresses actually require before they can be used at all.
- **D.** No. Private versus public is a classification of the address itself, while NAT is a rewriting action performed for internet reachability; a network with no internet access needs no NAT at all.

**Answer: D.** Private versus public is a label on an address; NAT is an action performed on packets crossing toward the public internet. A private network that never needs to reach the internet has no packets for NAT to act on, so it needs no NAT.

- A is wrong: NAT is required only when private addresses must reach a public destination; a fully isolated private network has no such requirement at all.
- B is wrong: Private addresses are valid addresses within their own network on their own terms; NAT is not a validation step, only a translation performed for external reachability.
- C is wrong: Private addresses require neither NAT nor a firewall simply to function on their own isolated network; both are separate concerns from address classification.

### 180.

An address-planning spreadsheet lists 172.15.4.10, 172.20.4.10 and 172.32.4.10, all marked "private, RFC 1918." Which of these markings are wrong, and why?

- **A.** 172.15.4.10 and 172.32.4.10 are wrongly marked. The 172 private range is /12, spanning only 172.16.0.0 through 172.31.255.255, so both fall outside it while 172.20.4.10 is correctly private.
- **B.** Only 172.32.4.10 is wrongly marked; 172.15.4.10 falls inside the private range because the /12 block extends downward from 172.16.0.0 as well as upward, running from 172.15.0.0 to 172.31.255.255.
- **C.** All three are correctly marked, since every address beginning with the octet 172 falls within RFC 1918 private space.
- **D.** None are correctly marked, because RFC 1918 does not reserve any range that begins with the octet 172 at all.

**Answer: A.** The 172 private block is exactly /12: 172.16.0.0 through 172.31.255.255. 172.15.4.10 sits one increment below that boundary and 172.32.4.10 one increment above it, so both are public despite sharing the leading octet with the private range.

- B is wrong: The private range starts at 172.16.0.0, not 172.0.0.0; 172.15.4.10 is one increment below the boundary and is public, not private.
- C is wrong: The 172 private range is restricted to the /12 block 172.16.0.0-172.31.255.255, not the entire 172.0.0.0/8 space that the octet 172 alone would suggest.
- D is wrong: RFC 1918 does reserve a 172-based range, 172.16.0.0/12; the error in the spreadsheet is the boundary, not the absence of any 172-based private block.

### 181.

A company runs an internal application on 10.5.2.20 and wants remote staff on the public internet to reach it directly by that address. Without any further configuration, will that work?

- **A.** Yes — any address can be reached from the internet as long as the destination host's firewall permits inbound traffic on the right port, since reachability is decided at the destination host rather than in transit.
- **B.** No; 10.5.2.20 is RFC 1918 private space, which internet routers do not carry, so it can only be reached from outside once something translates it to a public address.
- **C.** Yes, but only if the application server's DNS record is updated to point at the 10.5.2.20 address instead of its current one.
- **D.** No, but only because 10.5.2.20 is loopback space rather than because it is unroutable private space.

**Answer: B.** Recognising an address as private immediately explains this symptom: internet routers do not carry RFC 1918 prefixes, so a service hosted on one is unreachable from outside until NAT or an equivalent translation makes it appear as a public address.

- A is wrong: A permissive firewall rule cannot make an unroutable private address reachable; internet routers simply do not carry a path to 10.5.2.20 regardless of any firewall policy on the host.
- C is wrong: Publishing a private address in DNS does not make it routable; remote clients would still be unable to reach a destination that no internet router carries a path to.
- D is wrong: Loopback is the fixed 127.0.0.0/8 range; 10.5.2.20 falls in the RFC 1918 10.0.0.0/8 private range instead, which is the actual reason it is unreachable directly.

### 182.

A company wants to filter and log employee web access before it leaves the building, and separately wants to hide an internal application server behind a public hostname. Which kind of proxy fits each need?

- **A.** A reverse proxy fits filtering employee access, since it is the type configured directly by the clients whose traffic needs to be filtered.
- **B.** Both needs are met by the same forward proxy, since a forward proxy is capable of hiding an internal server from the public internet as well as filtering client traffic, because a proxy's position in the path rather than which party configures it is what decides its role.
- **C.** Neither need is met by a proxy at all; both require a VPN, since only a VPN is capable of filtering traffic or hiding an internal server from view.
- **D.** A forward proxy fits filtering employee access, since it sits in front of clients and is configured by them; a reverse proxy fits hiding the internal server, since it sits in front of servers, invisible to clients.

**Answer: D.** A forward proxy sits in front of clients and is configured by them, which is why filtering employee web access, caching outbound requests and enforcing policy are forward-proxy jobs; a reverse proxy sits in front of servers and is invisible to clients, which is why hiding an internal application server behind a public hostname is a reverse-proxy job.

- A is wrong: A forward proxy, not a reverse proxy, is the one configured by clients and positioned in front of them; a reverse proxy sits in front of servers and is invisible to clients instead.
- B is wrong: A forward proxy sits in front of clients and is configured by them; hiding an internal server from the public internet is specifically a reverse-proxy job on the server side instead.
- C is wrong: A VPN provides an encrypted tunnel for network-level access; it does not filter and log web traffic or front an internal application the way a proxy specifically does.

### 183.

A reverse proxy terminates TLS and forwards requests to a backend application over a private address. The backend's access logs show every request coming from the proxy's own IP address rather than the real client's. What explains this, and what fixes it?

- **A.** The backend's own network interface must be misconfigured, since a correctly working reverse proxy is defined to always preserve the original client's IP address in every log entry automatically, so no header configuration is needed on the proxy itself.
- **B.** This only happens because the reverse proxy is also functioning as a load balancer, and load balancers are what specifically cause this address-masking behaviour.
- **C.** Because a proxy terminates and re-issues the connection, the backend sees the proxy as its client; a forwarded header, added by the proxy, is what recovers the original client address for logging or access control.
- **D.** The fix is to switch from a reverse proxy to a forward proxy, since only a forward proxy is capable of preserving the original client's address in backend logs.

**Answer: C.** A reverse proxy is reached because DNS resolves the public name to it, and it forwards to a backend on a private address; because a proxy terminates and re-issues the connection, the backend sees the proxy as its client unless a forwarded header preserves the original address.

- A is wrong: A working reverse proxy does not automatically preserve the original client address in logs; this requires a specific forwarded header to be added, not a fix on the backend's interface.
- B is wrong: The address-masking behaviour follows from being any kind of intermediary that terminates and re-issues the connection, a proxy trait, not specifically from also load-balancing across backends.
- D is wrong: Switching proxy direction does not solve this; a forwarded header, not a change from reverse to forward proxy, is the standard fix that recovers the original client address for the backend.

### 184.

A reverse proxy is added in front of a single backend application server. Later, a second backend is added for capacity, and the proxy begins distributing requests across both, health-checking each. Has the device's function changed, and how should it now be described?

- **A.** No — it remains simply a reverse proxy throughout, since a reverse proxy is defined to always distribute traffic across multiple backends regardless of how many are configured.
- **B.** Yes — it has become a forward proxy, since adding a second backend changes which side of the connection, client or server, the device is now serving.
- **C.** No, and it also cannot be described as a load balancer, since only a dedicated hardware appliance, not a software reverse proxy, is permitted to hold that label.
- **D.** Yes — it is now acting as a load balancer as well, since it distributes across several backends and health-checks them, which is a change of purpose, not merely of position.

**Answer: D.** A reverse proxy is not a load balancer merely by existing — it becomes one when it distributes across several backends and health-checks them, which is exactly the change described: the same box now performs a different function, a change of purpose rather than of physical position.

- A is wrong: A reverse proxy in front of a single backend is not inherently distributing anything; the distribution and health-checking behaviour is specifically what defines a load balancer once a second backend is added.
- B is wrong: The device still sits in front of the servers, serving the service owner's side, exactly as before; adding a backend does not flip it to serving the client side, which is what would make it a forward proxy.
- C is wrong: Load balancing is a functional description, not a hardware requirement; a software reverse proxy that distributes across health-checked backends is genuinely acting as a load balancer.

### 185.

The word "proxy," used without qualification, is ambiguous between forward and reverse. How should a reader decide which one a scenario means?

- **A.** By assuming "proxy" unqualified always means forward proxy, since that is the only sense the word carries in networking terminology regardless of context.
- **B.** By reading the direction from the scenario itself — "proxy" unqualified usually means forward proxy in a client context and reverse proxy in a server context, so the surrounding description decides it, not the bare word.
- **C.** By checking whether TLS is involved, since only a reverse proxy is ever capable of terminating TLS, making that the deciding factor in every scenario.
- **D.** By checking whether the device also performs load balancing, since only a reverse proxy is ever combined with load-balancing functionality in practice.

**Answer: B.** "Proxy" unqualified usually means forward proxy in a client context and reverse proxy in a server context, so the direction has to be read from the scenario rather than the word — filtering employee web access is forward; terminating TLS in front of servers is reverse.

- A is wrong: "Proxy" unqualified is genuinely ambiguous and commonly means reverse proxy in a server context; assuming it is always forward proxy will misread many scenarios.
- C is wrong: TLS termination alone does not decide the direction; a forward proxy can also be involved in TLS-related configurations, and the deciding factor is whose side is being served, not TLS presence.
- D is wrong: Whether load balancing is present does not itself decide forward versus reverse; the deciding factor is which side of the exchange, client or server, the device is described as serving.

### 186.

Two engineering desks need to be added to the same subnet as the rest of engineering, while a separate finance subnet needs to exchange traffic with engineering for the first time. Which device does each task need, and on what basis?

- **A.** Both tasks need a router, since only a router is capable of extending a broadcast domain to additional physical ports at all.
- **B.** Both tasks need only a switch, since a switch can join two entirely separate subnets together as easily as it extends one existing subnet.
- **C.** Neither task needs either device; both can be accomplished purely through DHCP server configuration on the existing network.
- **D.** Adding desks to the same subnet needs only a switch, which forwards frames by MAC within one broadcast domain; connecting two different subnets needs a router, which forwards packets by IP between them.

**Answer: D.** A switch forwards frames within one network by MAC address, at layer 2, and is the right device when devices merely need to join an existing broadcast domain; a router forwards packets between networks by IP address, at layer 3, and is required whenever traffic must cross from one subnet to another.

- A is wrong: Extending a single broadcast domain to more ports is exactly a switch's job; a router does not extend a broadcast domain, it terminates one at its boundary.
- B is wrong: A plain switch keeps every port in the same broadcast domain; it cannot join two different subnets together, which requires a router to forward between them by IP.
- C is wrong: DHCP only hands out addressing configuration to clients; it has no role in extending a broadcast domain or forwarding traffic between two separate subnets.

### 187.

A broadcast frame is sent by a host connected to a plain switch with ten other ports in use. What happens to that frame, and would the outcome differ if a router sat where the switch does instead?

- **A.** The switch floods the broadcast to every other port, since every port on a plain switch shares one broadcast domain; a router in its place would not forward the broadcast at all, terminating it there.
- **B.** The switch forwards the broadcast only to the one port whose MAC learning table entry matches the broadcast address specifically.
- **C.** The switch silently drops the broadcast frame, since flooding traffic to every port is treated as a security risk that switches avoid by default.
- **D.** The outcome would be identical whether a switch or a router occupies that position, since both devices handle broadcast frames the same way by design, broadcast handling being fixed at the frame level rather than per device.

**Answer: A.** Every port on a plain switch is in the same broadcast domain, so a switch floods a frame to every port when the destination is unknown or is the broadcast address; a router does not forward broadcasts at all, because it terminates the broadcast domain rather than extending it.

- B is wrong: The broadcast MAC address, ff:ff:ff:ff:ff:ff, is never learned as belonging to a single port; a switch floods it to every port instead of forwarding it selectively.
- C is wrong: A switch does not drop broadcasts as a security measure by default; flooding to every port on the shared broadcast domain is its ordinary, expected behaviour.
- D is wrong: The outcome is precisely the difference between the two devices: a switch floods a broadcast across its domain while a router terminates the broadcast domain and does not forward it.

### 188.

A DHCP server sits on a different subnet from a group of clients that need to lease addresses from it. Given that DHCP discovery is a broadcast, what is required to make this work?

- **A.** A relay agent on the clients' subnet, since broadcasts do not cross routers unaided and the relay agent forwards the discovery onward to the configured server address.
- **B.** Nothing extra is required, since routers automatically forward DHCP broadcasts to any DHCP server on the network without additional configuration, DHCP being exempt from the usual forwarding rules.
- **C.** A second DHCP server installed locally on the clients' own subnet, since a relay agent cannot forward requests across a router boundary at all.
- **D.** A VLAN trunk between the two subnets, since trunking is the mechanism that allows a broadcast to cross from one subnet to another.

**Answer: A.** Because DHCP discovery and ARP requests are broadcasts, neither crosses a router unaided — DHCP needs a relay agent to serve a subnet whose server sits elsewhere, converting the broadcast into a unicast message the remote server can receive and reply to.

- B is wrong: Routers do not forward broadcasts by default at all; DHCP discovery being a broadcast is exactly why it does not reach a server on another subnet without a relay agent.
- C is wrong: A relay agent exists precisely to forward DHCP requests across a router boundary as unicast; a second local server is an alternative design, not a requirement.
- D is wrong: A VLAN trunk carries traffic for multiple VLANs between switches, but it does not make a router forward a broadcast across separate IP subnets; that still requires a relay agent.

### 189.

A vendor markets a "layer 3 switch." What does that device actually do, and what should not be concluded from the name?

- **A.** It performs routing only, and the word "switch" in its name is understood to be a purely historical artefact with no functional meaning today.
- **B.** It performs switching only, with "layer 3" describing merely the number of physical ports the device happens to provide.
- **C.** It performs neither switching nor routing, functioning instead purely as a firewall that happens to be named after both functions for marketing purposes.
- **D.** It performs layer 2 switching in hardware alongside layer 3 routing in the same box; the name should not be read as evidence that switching itself is a layer 3 function.

**Answer: D.** A "layer 3 switch" is a marketing name for a device that both switches at layer 2 and routes at layer 3; performing routing in hardware inside a switch-shaped box does not make switching itself a layer 3 function, since the two remain distinct operations happening in one device.

- A is wrong: A layer 3 switch genuinely performs layer 2 switching as well as layer 3 routing; the name is not a meaningless historical artefact but describes real dual functionality.
- B is wrong: "Layer 3" refers to the OSI network layer at which the device also routes, not to a port count; the device genuinely adds routing capability, not just extra ports.
- C is wrong: A layer 3 switch genuinely switches and routes; it is not a firewall by function, even though the marketing name references both switching and a layer number.

### 190.

A routing table holds a connected route for 198.51.100.0/24 and a default route for 0.0.0.0/0. Which one is used to reach 198.51.100.7, and why — and which command confirms it without reading the table by eye?

- **A.** The default route wins, since a route explicitly named "default" is always treated as a special case that takes priority over any other route present.
- **B.** Whichever route was added to the table first wins, since kernel routing tables are evaluated strictly in insertion order rather than by prefix specificity, regardless of which distribution or vendor is involved.
- **C.** The /24 route wins by longest prefix match (24 matching bits beats 0), and `ip route get 198.51.100.7` asks the kernel to show the entry it would actually select.
- **D.** The /24 route wins, but only because it happens to be listed first when the table is printed by `ip route` without any arguments.

**Answer: C.** Selection is by longest prefix match: the /24 route, with 24 matching bits, beats the default route's 0 matching bits, regardless of listing order; `ip route get 198.51.100.7` asks the kernel to show which entry it would actually choose, settling any argument.

- A is wrong: The default route has the weakest possible match, 0 bits; it is chosen only when nothing more specific matches, never given special priority over a more specific route.
- B is wrong: Selection is by longest prefix match, not by the order entries were added; a later-added, more specific route still wins over an earlier, less specific one.
- D is wrong: Print order in `ip route` output does not determine which route is selected; the selection is decided by prefix length, and `route get` proves it independently of display order.

### 191.

A network engineer wants exactly one destination address to be redirected through a different next hop, while leaving every other destination unaffected. What technique achieves that without disturbing the rest of the table?

- **A.** Adding a /32 host route for that one destination; a more specific route always beats the default, so it redirects only that address and nothing else.
- **B.** Lowering the metric on the existing default route, since adjusting the metric is the only way to influence which destinations use which path.
- **C.** Editing `/etc/hosts` to point that destination's name at a different address, since routing decisions are driven by name resolution rather than by the routing table.
- **D.** Removing the default route entirely, since eliminating it is the only way to force a single destination onto a different next hop.

**Answer: A.** A more specific route always beats a less specific one, so adding a /32 host route for exactly one destination redirects only that address while leaving every other destination on its existing path — a useful, precise technique that is easy to forget when diagnosing an oddly-behaving single host.

- B is wrong: Adjusting the default route's metric affects every destination that falls back to it, not just the one address in question; it cannot selectively redirect a single destination.
- C is wrong: `/etc/hosts` affects name-to-address resolution, not which next hop is used to reach a given address; routing decisions are made from the routing table, independent of naming.
- D is wrong: Removing the default route would break every destination that relies on it, not just redirect the one address in question, which is a much broader and unwanted change.

### 192.

`route -n` is not installed on a freshly provisioned server, and a technician treats this as evidence the networking stack is broken. Is that the right conclusion?

- **A.** Yes — every properly functioning Linux system ships `route -n` by default, so its absence necessarily indicates a broken or incomplete installation, a belief that persists because it sounds intuitive.
- **B.** No, `route -n` comes from the deprecated net-tools package, which is frequently absent by default; its absence reflects a distribution choice, not a broken system.
- **C.** No, but only because `route -n` was replaced specifically by `ip neigh`, which is where routing information now lives instead.
- **D.** Yes, and the fix is to reinstall the entire networking stack from scratch, since a missing legacy command usually indicates deeper corruption.

**Answer: B.** `route -n` being unavailable is not evidence of a broken system; it is evidence the distribution ships iproute2 only, since net-tools is deprecated and frequently absent — `ip route` remains the fully supported way to inspect the same table.

- A is wrong: Many current distributions ship iproute2 only, deliberately omitting net-tools; that is a normal, supported configuration, not evidence of breakage.
- C is wrong: `ip neigh` shows the neighbour cache, not the routing table; the direct iproute2 replacement for `route -n` is `ip route`, not `ip neigh`.
- D is wrong: A missing legacy net-tools package requires nothing more than installing that specific package if it is genuinely wanted; it implies no corruption of the networking stack at all.

### 193.

What distinguishes a "connected" route in a routing table from every other kind of entry?

- **A.** A connected route has no `via` clause, because the destination is directly on-link through the interface rather than reached through a next-hop router.
- **B.** A connected route is any entry that was added manually with `ip route add`, as opposed to one generated automatically at boot.
- **C.** A connected route is specifically the default route, since it is the one entry that connects the host to every possible destination.
- **D.** A connected route is one where the destination and the next hop share the exact same IP address, rather than one being derived from a subnet in most textbooks and quick references.

**Answer: A.** A typical table holds one connected route per configured subnet, with no `via` clause because the destination is on-link, plus the default route for everything else — the difference between "directly connected" and "via a router" is exactly the distinction most connectivity questions turn on.

- B is wrong: How a route was added — manually or automatically — is unrelated to whether it is "connected"; the defining trait is the absence of a next hop for an on-link destination.
- C is wrong: The default route is a distinct entry, 0.0.0.0/0, matching everything with no specificity; a connected route is the opposite — a specific, directly reachable subnet.
- D is wrong: A connected route has no next hop at all to compare against the destination; it is defined by the absence of a `via` clause, not by a coincidence of matching addresses.

### 194.

A service is reported as "running but nothing can connect." Following the standard diagnostic order, what is checked first with `ss -tulpn`, and what does an absent port versus a present-but-loopback-bound port each indicate?

- **A.** First check the firewall policy on the host, since `ss -tulpn` output is defined to be meaningless until the firewall configuration has already been reviewed and ruled out as the source of the problem.
- **B.** First check the client's own routing table, since a client-side fault is always the explanation whenever a server-side `ss -tulpn` check would otherwise be needed to confirm what is listening.
- **C.** First check whether `-p` was run with root privilege, since without it `ss -tulpn` is defined to report every socket as entirely absent from its output rather than merely missing the owning process.
- **D.** First check whether the expected port appears at all: absent means the process is not actually listening, a service problem no firewall change will fix; present but bound to `127.0.0.1` means it is up but unreachable from any other host — the fault, without touching the network further.

**Answer: D.** Start on the server, not the client: if the expected port is absent from `ss -tulpn`, the service is not listening and no firewall change will help; if it is present, read the Local Address column, since `127.0.0.1` means loopback only, the service up but unreachable from any other host, and that is the fault.

- A is wrong: Reading firewall rules before checking whether the service is even listening is how administrators spend time investigating a firewall that was never involved; `ss -tulpn` on the server is the correct starting point.
- B is wrong: "Running but nothing can connect" is a server-side symptom description that `ss -tulpn` on the server itself is specifically designed to diagnose first, before any client-side investigation.
- C is wrong: Without root, only the process-name column is blanked for sockets owned by other users; the sockets themselves, including the port and address, still appear in the output.

### 195.

An operator runs `ss -tulpn` without root privilege and sees a listening socket with a blank process-name column. They conclude nothing is actually listening on that port. Is that conclusion supported?

- **A.** No — without root, the `-p` column is blank for processes the operator does not own, which looks like nothing is listening if read carelessly, but the socket itself is genuinely present and listening.
- **B.** Yes — a blank process-name column in `ss -tulpn` output is defined to always mean the corresponding socket entry itself does not actually exist.
- **C.** No, but only because `-n` was omitted, since adding `-n` is what causes previously hidden sockets owned by other users to appear in the output.
- **D.** Yes, but only because `netstat`, not `ss`, should have been used instead, since `netstat` is defined to always show process names without requiring elevated privilege, since its process column is populated from the socket table itself rather than from /proc.

**Answer: A.** Without root, the `-p` column is blank for processes you do not own, which looks like "nothing is listening" if read carelessly — re-running with elevated privilege before concluding the process column is genuinely empty is the correct next step.

- B is wrong: A blank process-name column reflects a privilege limitation on process attribution, not the absence of the socket; the socket entry, including its port and address, is still shown.
- C is wrong: `-n` only controls whether ports display numerically instead of as translated service names; it has no effect on whether other users' process names or sockets are visible.
- D is wrong: `netstat` has the same privilege requirement as `ss` for attributing sockets to other users' processes; switching tools would not change the described blank-column behaviour.

### 196.

A colleague reaches for `netstat -tulpn` on a freshly built server and the command is not found, while `ss -tulpn` works fine. Why the difference, and which tool should be relied on going forward?

- **A.** `netstat` and `ss` are functionally identical, so the missing-command result must indicate a broken installation of the iproute2 package rather than a packaging difference, since both commands are shipped by the same iproute2 package on every current distribution.
- **B.** `netstat` requires root privilege just to be found by the shell, while `ss` does not, which fully explains the missing-command result observed here.
- **C.** `netstat`, from net-tools, is not installed by default on many current distributions, while `ss`, from iproute2, is the current, supported tool that should be relied on going forward.
- **D.** `netstat` only works over IPv6 while `ss` only works over IPv4, so the correct fix is to use `netstat -6` instead of investigating the missing-command result further.

**Answer: C.** `ss` is the current tool, from iproute2, while `netstat`, from net-tools, is the legacy one and is often not installed — assuming `netstat` is present is a documented trap, and `ss` is markedly faster on hosts with many connections besides.

- A is wrong: They are not from the same package; `netstat`'s absence reflects that net-tools is often not installed by default, not a fault in the working iproute2 installation that provides `ss`.
- B is wrong: Privilege level does not affect whether a shell can locate an installed command; `netstat`'s absence here is a packaging issue, net-tools not being installed, not a privilege issue.
- D is wrong: Neither tool is restricted to a single address family; the actual explanation for the missing command is that net-tools, which provides `netstat`, is often not installed on current distributions.

### 197.

A busy server shows a short listening-socket list under `ss -tulpn -l`, and a manager questions whether the server is actually handling much traffic given how short the list looks. What is being misread?

- **A.** The listening list length is defined to scale directly with total traffic volume, so a short list genuinely does prove the server is not handling much load.
- **B.** The manager should instead check the routing table's size, since a larger routing table is what actually correlates with how much traffic a server can be handling.
- **C.** `-l` excludes established connections by design, so a short listening list says nothing about traffic volume; `ss -t state established` is the command that would show the (likely much longer) list of active client connections.
- **D.** The manager should instead check `ip link` for interface error counters, since those, not the socket table, are what actually indicate real traffic volume on a busy server.

**Answer: C.** `-l` excludes established connections by design, so a busy server can show a short listening list and still be handling thousands of conversations — `ss -t state established` is the complementary command that reveals the actual volume of active client connections.

- A is wrong: The number of listening sockets reflects how many distinct services are configured to accept connections, not how much traffic each one is currently handling; the two are unrelated.
- B is wrong: Routing table size reflects how many destinations a host knows how to reach, not how much traffic it is currently handling; it has no bearing on the question being asked here.
- D is wrong: Interface error counters reflect link-layer problems, not overall traffic volume; established TCP connections, visible via `ss -t state established`, are the direct evidence of client activity being asked about here.

### 198.

An administrator generates a key pair with `ssh-keygen` and then needs to enable key-based login to a remote server. Which file gets copied to the server, and with which command?

- **A.** The private key file — using `scp`, so that the server holds the same secret material the client uses to authenticate itself.
- **B.** Both the public and private key files — using `sftp`, so the server has a complete, matching copy of the client's key pair on file and can verify a login against either half of it.
- **C.** Neither key file — `ssh-copy-id` instead generates a brand-new key pair directly on the remote server during the copy process.
- **D.** Only the public key file — using `ssh-copy-id`, which logs in with an existing method and appends the public key to the remote `~/.ssh/authorized_keys`.

**Answer: D.** `ssh-keygen` generates a key pair, writing the private key to a file and the public key to a matching `.pub` file, and `ssh-copy-id` logs in using an existing method and appends that public key to the remote `~/.ssh/authorized_keys` — only the public half ever leaves the client.

- A is wrong: The private key must never leave the client; copying it to the server undermines the entire point of key-based authentication, and only the public key is meant to be shared.
- B is wrong: The server needs only the public key to verify a login; sending the private key as well defeats the security model entirely, regardless of which transfer tool is used.
- C is wrong: `ssh-copy-id` installs an existing local public key on the remote host; it does not generate a new key pair on the server as part of that process.

### 199.

A user with correctly configured SSH keys is unexpectedly prompted for a password every time they connect, though the same key worked on another server. Their home directory on this server is world-writable. What is the likely cause?

- **A.** SSH refuses key authentication silently if permissions are too open — `~/.ssh` should be 700 and `authorized_keys` 600, and a world-writable home directory alone can cause a fall back to password prompts.
- **B.** The public key was never actually copied to this server at all, since a working key on one server has no bearing on whether it was installed on another.
- **C.** The server's host key has changed since the last connection, which is what triggers SSH to silently fall back to password authentication instead of raising a warning.
- **D.** The remote server is using the legacy SCP protocol instead of SFTP underneath, which is what causes key authentication to be silently skipped for logins.

**Answer: A.** SSH refuses key authentication silently if permissions are too open: `~/.ssh` should be 700 and `authorized_keys` 600, and a world-writable home directory alone can cause a fall back to password prompts, which is a frequent and confusing source of 'permission denied' or unexpected password-prompt reports.

- B is wrong: This is possible in general, but the scenario specifically flags a world-writable home directory, which is the documented, more likely cause of a silent fall back to password prompts.
- C is wrong: A changed host key produces a loud, explicit warning about the change, not a silent fall back to password prompts; it is a separate class of event from the permission issue described.
- D is wrong: Whether `scp` uses the legacy SCP protocol or SFTP underneath affects file transfer only, not interactive login authentication, which is governed separately by key and permission checks.

### 200.

A user runs `scp -p 2222 report.tar.gz user@web01:/tmp/` against a host whose SSH daemon listens on port 2222. Rather than transferring, `scp` reports `stat local "2222": No such file or directory`. What is wrong, and what should they run instead?

- **A.** `scp` spells the port flag with a capital `-P`, not lowercase `-p`; lowercase `-p` is a valid flag that preserves times and mode bits, so `2222` was parsed as a source filename. The corrected command is `scp -P 2222 report.tar.gz user@web01:/tmp/`.
- **B.** The remote path is missing a second colon, and the corrected command needs `user@web01::/tmp/` with two colons before the destination path.
- **C.** `scp` does not support a port option at all, and the fix is to first open an `ssh` session on port 2222 and then transfer the file manually from within that already-authenticated remote shell session.
- **D.** The file name must be quoted in double quotes for `scp` to accept it, and the reported error is a misleading way of flagging that quoting problem, since `scp` reports an unquoted operand as a missing local file rather than naming the quoting fault itself.

**Answer: A.** Using `-p` for scp is a frequent and confusing difference: `ssh` uses `-p PORT` for a non-default port, while `scp` spells the same option with a capital `-P`, and mixing the two up produces exactly this kind of unrecognised-option error.

- B is wrong: `scp`'s remote path syntax uses a single colon between the host and the path; the actual error here is the port flag's case, which pushed `2222` into the source-file list, not the number of colons used.
- C is wrong: `scp` does support specifying a nonstandard port; it simply uses the capital `-P` flag rather than lowercase `-p`, so a separate manual `ssh` session is not required.
- D is wrong: Quoting only matters when a filename contains spaces or shell metacharacters, and `report.tar.gz` contains neither;

### 201.

What is the practical difference between SFTP and FTPS, given that both names sound like secured variants of FTP?

- **A.** SFTP rides SSH on port 22, as an SSH subsystem entirely unrelated to FTP or FTPS; FTPS is the original FTP protocol wrapped in TLS instead.
- **B.** SFTP and FTPS are two names for the exact same protocol, differing only in which vendor's client software happens to use which term.
- **C.** SFTP is FTP wrapped in TLS, while FTPS is the SSH-based subsystem that rides on port 22 alongside ordinary SSH traffic.
- **D.** SFTP and FTPS differ only in that SFTP is used for uploads while FTPS is used exclusively for downloads, both otherwise sharing an identical underlying transport.

**Answer: A.** SFTP and FTPS are different things despite the similar names: SFTP rides SSH on port 22, unrelated to FTP or FTPS, while FTPS is the original FTP protocol wrapped in TLS — a distinction worth holding onto given how often the two are assumed to be the same.

- B is wrong: They are structurally different protocols — SFTP is an SSH subsystem on port 22, FTPS is FTP wrapped in TLS on FTP's own ports — not two names for identical technology.
- C is wrong: This swaps the two definitions: SFTP is the SSH subsystem on port 22, and FTPS is the one that wraps FTP in TLS, not the other way around.
- D is wrong: Neither protocol is restricted to uploads or downloads only; both support bidirectional transfer, and the actual difference is their underlying transport mechanism, SSH versus TLS-wrapped FTP.

### 202.

A file server, a print queue and an ordinary laptop are being provisioned. The file server needs a stable address referenced by an A record; the laptop just needs to get online. Which addressing choice fits each, and on what basis?

- **A.** Both the server and the laptop should get plain dynamic DHCP addresses, since DHCP reservations do not exist as an option separate from an ordinary dynamic lease.
- **B.** Both the server and the laptop should get static addresses configured by hand, since any device an administrator provisions deliberately is assumed to never depend on DHCP.
- **C.** The choice should instead be based on which device was purchased most recently, since older hardware on the network is generally assumed to need static addressing regardless of its role, which feels reasonable on first encounter in most textbooks and quick references.
- **D.** The server gets a static address or a DHCP reservation, since anything referenced by name needs stability; the laptop gets a plain dynamic DHCP address, since managing hundreds of hand-written client configurations does not scale.

**Answer: D.** Static addressing (or a DHCP reservation) suits devices that must stay stable because something references them by name or fixed configuration, such as servers and gateways; ordinary clients are given dynamic addresses because hand-writing hundreds of configurations does not scale.

- A is wrong: A DHCP reservation is a distinct, real option — binding one MAC to one fixed address — that gives a server-class device stability while remaining a DHCP client.
- B is wrong: Managing hundreds of hand-written client configurations does not scale; ordinary clients are given dynamic addresses precisely to avoid that burden.
- C is wrong: The addressing choice is driven by whether stability is required by name-based references, not by the age or purchase date of the hardware involved.

### 203.

An administrator statically assigns 192.168.1.50 to a new printer, unaware that the DHCP server's pool for that subnet is 192.168.1.20 through 192.168.1.100. What is the likely consequence, and why?

- **A.** No conflict is possible, because a statically configured address always takes precedence over anything the DHCP server might later offer by default on most systems administrators encounter.
- **B.** A duplicate-address conflict is likely once the DHCP server eventually leases 192.168.1.50 to a client, since the static address sits inside the dynamic pool's range.
- **C.** No conflict is possible, because printers are automatically excluded from DHCP pools by every major DHCP server implementation.
- **D.** A conflict is likely, but only because printers are unable to hold a static IPv4 address under any circumstances.

**Answer: B.** Setting a static address inside a DHCP pool's range invites a duplicate-address conflict when the server later leases that same address to someone else, which is exactly why reservations — which exclude the address from the dynamic pool — exist as the safer alternative.

- A is wrong: A DHCP server has no visibility into addresses configured statically outside its own pool bookkeeping, so precedence does not prevent it from later offering the same address.
- C is wrong: DHCP servers have no automatic device-type exclusion; a pool exclusion has to be configured explicitly, which is exactly what a reservation is for.
- D is wrong: Printers are perfectly capable of holding a static address; the conflict arises from the address falling inside the active DHCP pool range, not from any printer-specific limitation.

### 204.

An administrator runs `ip addr add 10.0.5.100/24 dev enp0s3` on a server and calls the address "now static." Is that terminology accurate?

- **A.** Yes — any address set with a manual command like `ip addr add`, rather than obtained automatically, counts as static by definition.
- **B.** No, "static" means the configuration is written into the host's persistent network configuration; `ip addr add` is a temporary runtime change that disappears at the next reboot or reconfiguration.
- **C.** No, but only because the address 10.0.5.100 happens to fall inside a range reserved for dynamic addressing on this network.
- **D.** Yes, and the address will in fact remain assigned across every future reboot exactly as a genuinely static address would.

**Answer: B.** A static address is written into the distribution's persistent network configuration and reapplied at boot; `ip addr add` only changes the running kernel state, so calling that a "static" address is a mislabel that a question about permanence is not answered by.

- A is wrong: 'Static' specifically means the configuration is written into the persistent network configuration and applied at boot; a bare runtime `ip addr add` command does neither.
- C is wrong: Whether an address falls in a particular numeric range has no bearing on whether it is static or dynamic; that distinction is about how and where the configuration is stored.
- D is wrong: A runtime `ip addr add` command is lost on reboot precisely because it writes nothing to disk, unlike a genuinely static address configured in the persistent network configuration.

### 205.

A dynamically leased address has not changed in over six months. A junior admin argues it must actually be static, since 'static' means the address never changes. Is that reasoning sound?

- **A.** Yes — any address that has been observed to stay constant for a long enough period should be reclassified as static.
- **B.** No, but only because the address must actually be a DHCP reservation rather than either a static or an ordinary dynamic address.
- **C.** Yes, since only a DHCP server outage could explain an address remaining the same for that long, which effectively makes it static across virtually every environment of this kind, a conclusion that seems to follow from everyday experience.
- **D.** No: a dynamic address can remain identical for a long time and still be dynamic; the distinction is about who owns the configuration, not whether the value happens to stay constant.

**Answer: D.** A dynamic address can remain identical for months through ordinary lease renewal and still be dynamic, because the distinction is about whether the configuration is written on the host (static) or held and renewable by the server (dynamic), not about whether the value has changed recently.

- A is wrong: There is no duration after which a dynamically leased address becomes static; classification depends on where the configuration is held, not on observed stability over time.
- B is wrong: The scenario describes an ordinary dynamic lease, not a reservation; nothing in the description implies a MAC-to-address binding exists on the server.
- C is wrong: A stable lease renewal, not a server outage, is the ordinary explanation for a long-unchanged dynamic address, and neither explanation reclassifies it as static.

### 206.

A firewall rule needs to be written in dotted-decimal notation, but `ip addr` reports the host as `10.20.30.5/26`. What is the equivalent dotted-decimal mask?

- **A.** 255.255.255.128 — since /26 is one step past /25 in the sequence, the mask must also be one step past 128 in that octet.
- **B.** 255.255.252.0 — the prefix number 26 sets the network boundary inside the third octet, leaving the whole last octet free for host addressing.
- **C.** A /26 leaves 6 host bits, so the mask sets the top two bits of the last octet, giving 192 there: 255.255.255.192.
- **D.** 255.255.255.224 — the mask value that corresponds to a /27 prefix rather than the /26 actually shown.

**Answer: C.** A /26 prefix sets 26 leading bits to one, which in dotted-decimal is 255.255.255.192: the first three octets are fully ones, and the last octet has its two most significant bits set, matching the CIDR and dotted-decimal reference table exactly.

- A is wrong: 255.255.255.128 is the dotted-decimal form of /25, not /26; the last-octet value at /26 is 192, from two set bits rather than one.
- B is wrong: The prefix length counts leading one-bits across the whole 32-bit address, not a value substituted into a single octet in isolation.
- D is wrong: 224 in the last octet corresponds to /27, one bit more specific than the /26 given; the extra host bit changes the mask value.

### 207.

Two engineers argue over whether a /26 network is bigger or smaller than a /24 network. Who is right, and by what factor?

- **A.** A /26 is larger — a longer prefix number means more addresses are set aside for that network.
- **B.** They are the same size — the prefix length only shifts which addresses the block occupies, not how many it contains.
- **C.** A /26 is smaller, but by a factor of two rather than four, since the whole difference in prefix length halves the block exactly once, leaving 128 addresses against a /24's 256.
- **D.** A /26 is smaller, a quarter the size of a /24, because each additional bit in the prefix halves the number of addresses in the block.

**Answer: D.** A larger prefix number always means a smaller network: /26 sets aside 6 host bits for 64 addresses while /24 sets aside 8 for 256, so /26 is a quarter the size of /24, not four times it.

- A is wrong: A larger prefix number means more bits are claimed by the network portion, leaving fewer host bits and therefore a smaller, not larger, network.
- B is wrong: The prefix length directly determines how many host bits remain, and therefore how many addresses the block contains; /26 and /24 do not hold the same count.
- C is wrong: Each additional bit of prefix halves the address count, so two extra bits of prefix (24 to 26) is a factor of four, not two.

### 208.

A /29 block is allocated to a small office. Using the usable-hosts formula 2^(32-prefix) - 2, how many usable host addresses does it provide?

- **A.** Eight — a /29 leaves 3 host bits, and all eight of the resulting addresses can be handed out to hosts.
- **B.** Fourteen — a /29 leaves 4 host bits for 16 total addresses, of which 14 remain after the two reserved ones, regardless of which distribution or vendor is involved.
- **C.** Four — half of every block is held back for the network, the broadcast and future growth, leaving four assignable.
- **D.** Six, because /29 leaves 3 host bits, giving 8 total addresses, minus the network and broadcast addresses that cannot be assigned to a host.

**Answer: D.** A /29 leaves 3 host bits, giving 2^3 = 8 total addresses; subtracting the all-zero network address and the all-one broadcast address, which can never be assigned to a host, leaves 6 usable addresses, matching the reference table.

- A is wrong: Eight is the total block size before subtracting the reserved network and broadcast addresses; the usable count is two fewer than that.
- B is wrong: /28 leaves 4 host bits and 14 usable hosts; /29 leaves only 3 host bits, which yields 6 usable hosts, not 14.
- C is wrong: Exactly two addresses are reserved regardless of block size — the all-zero network address and the all-one broadcast address — not half of the block.

### 209.

A design document proposes a /31 point-to-point link between two routers and states that, like every other prefix, it must reserve a network address and a broadcast address, leaving zero usable hosts. Is that correct?

- **A.** No. RFC 3021 defines /31 as a special case with no reserved network or broadcast address, so both addresses in the two-address block are usable.
- **B.** Yes — the subtract-two arithmetic applies at every prefix length without exception, so a /31 leaves no usable host address at all and the design is unworkable.
- **C.** No, but only because /31 is not a legal prefix length at all and the design document should use /30 instead.
- **D.** Yes, and the same reserved-address rule applies to /32, which likewise leaves no usable host address behind.

**Answer: A.** RFC 3021 defines /31 as a two-address point-to-point link with no network or broadcast address reserved, an explicit exception to the general rule that the all-zero and all-one addresses in a block are unusable.

- B is wrong: RFC 3021 makes /31 an explicit exception to the general subtract-two rule precisely because a two-address block cannot spare either address for reservation.
- C is wrong: /31 is a legal, RFC-defined prefix length for point-to-point links; the document's error is the reserved-address assumption, not the prefix length itself.
- D is wrong: /32 is a single-host route with no block to divide at all, a different case from the two-address /31 exception, not the same exception applied twice.

### 210.

Name the four layers of the TCP/IP model in order, from the physical segment to the software a user interacts with.

- **A.** Physical, internet, session, application.
- **B.** Link, internet, transport, application.
- **C.** Link, network, presentation, application.
- **D.** Data link, transport, internet, application.

**Answer: B.** The TCP/IP model has four layers — link, internet, transport, application — and every host on the internet genuinely implements these; nothing implements OSI's seven layers directly.

- A is wrong: 'Physical' and 'session' are OSI layer names, not TCP/IP layers; the TCP/IP model has no separate session layer at all.
- C is wrong: 'Network' and 'presentation' belong to OSI's seven-layer vocabulary, not to the four TCP/IP layers.
- D is wrong: The transport and internet layers are listed in the wrong order relative to how a packet actually travels outward from a host.

### 211.

A question asks which TCP/IP layer ARP output is used at. Given that ARP carries an internet-layer address inside a link-layer frame, what is the exam-safe placement?

- **A.** ARP is purely an application-layer protocol, since it runs as a background service the way a name resolver like DNS does in most textbooks and quick references.
- **B.** ARP belongs entirely to the transport layer, because it resolves an identifier the way a port number does.
- **C.** Because ARP joins layer 3 addressing to layer 2 delivery, it sits awkwardly across the link/internet boundary rather than cleanly inside one layer.
- **D.** ARP sits entirely within the internet layer, with no link-layer role at all.

**Answer: C.** Sources place ARP at 'layer 2.5' or at either side of the link/internet boundary because it carries an internet-layer address in a link-layer frame; the safe exam answer is that it joins layer 3 addressing to layer 2 delivery rather than sitting cleanly in one layer.

- A is wrong: ARP resolves addresses for local delivery and has no relationship to the application layer at all; DNS is the application-layer name resolver, not ARP.
- B is wrong: ARP resolves addresses, not ports, and has no relationship to TCP or UDP, which are what actually occupy the transport layer.
- D is wrong: ARP requests and replies are carried as raw link-layer frames, not as internet-layer packets, so it cannot be placed entirely at one layer.

### 212.

A trainee claims the OSI and TCP/IP models map one-to-one, seven layers to four, with each OSI layer corresponding to exactly one TCP/IP layer. What is wrong with that claim?

- **A.** The claim is correct, since every OSI layer number simply shifts down by one fixed offset to arrive at its corresponding TCP/IP layer number, so OSI's session layer maps onto TCP/IP's transport layer.
- **B.** The mapping fails only because TCP/IP defines one extra layer that OSI entirely lacks, not because any OSI layers fold together.
- **C.** OSI layers 1 and 2 fold into the single link layer, and OSI layers 5, 6 and 7 fold into the single application layer, so the mapping is many-to-one, not one-to-one.
- **D.** The mapping fails because TCP/IP layers are numbered in the reverse order compared to how OSI numbers its own seven layers.

**Answer: C.** OSI's seven layers do not map one-to-one onto TCP/IP's four: layers 1-2 collapse into the link layer and layers 5-7 collapse into the application layer, so any claim of a clean seven-to-four correspondence is wrong by construction.

- A is wrong: There is no fixed numeric offset; the two models fold multiple OSI layers into single TCP/IP layers rather than shifting numbers uniformly.
- B is wrong: TCP/IP has fewer layers than OSI, not more, and the discrepancy is because layers fold together rather than because one model has an extra layer.
- D is wrong: Both models count upward from the physical medium; the mismatch is in layer count and grouping, not in numbering direction.

### 213.

A UDP-based voice application is described by a colleague as "not really using the TCP/IP stack" because it avoids TCP entirely. Is that accurate?

- **A.** Yes — any protocol other than TCP itself falls entirely outside the boundaries of the TCP/IP model by definition in every configuration seen in practice.
- **B.** Yes — UDP applications instead run over the seven-layer OSI model exclusively, bypassing TCP/IP entirely.
- **C.** No, but only because ICMP silently converts UDP traffic into TCP traffic at the internet layer.
- **D.** No. The model is named after two of its protocols, but UDP and ICMP are part of the same TCP/IP stack, so a UDP application still uses it.

**Answer: D.** The TCP/IP model is named after two of its protocols, but as a model it includes UDP and ICMP as well; any protocol built on this four-layer stack, TCP or not, is still using it.

- A is wrong: The model's name references two protocols for convenience, but UDP and ICMP are defined within the same stack, not excluded from it.
- B is wrong: No host runs OSI as a deployed stack; a UDP application still runs over the same four-layer TCP/IP stack as any TCP application.
- C is wrong: ICMP is a control and error-reporting protocol; it does not convert one transport protocol into another, and no such conversion occurs.

### 214.

A connection attempt to a service hangs with no response at all, while a connection to a different port on the same host is refused instantly. Reading the handshake behaviour, what does each symptom suggest?

- **A.** Both symptoms mean the same thing, that the host is unreachable, since a hang and an instant refusal are simply two presentations of the identical block, selected by how long the client's own connect timeout has been configured rather than by anything the remote host sent back.
- **B.** The hang means the TLS handshake failed after the connection was already established, while the instant refusal means the three-way handshake itself failed.
- **C.** The hang means the destination host actively chose UDP instead of TCP for that port, while the instant refusal confirms it is genuinely using TCP.
- **D.** The hang means a SYN went out and got nothing back, a silent drop usually caused by a firewall; the instant refusal means a SYN reached a live host that answered with RST because nothing was listening on that port.

**Answer: D.** A connection that hangs sent a SYN and got nothing back, a silent drop usually caused by a firewall, while a connection refused instantly got an RST, meaning the packet reached a live host with nothing listening on that port — the handshake is what makes these two TCP failure modes readable and distinct.

- A is wrong: A refusal and a silent drop are different, distinguishable outcomes: a refusal means a live host answered with RST, while a hang means nothing answered at all, usually a firewall drop; the client's connect timeout changes how long the hang lasts, not whether an RST arrives.
- B is wrong: TLS negotiation happens after the three-way handshake completes; a hang before any TCP-level response at all is not a TLS failure, and an instant RST is a TCP-level response, not a TLS one.
- C is wrong: A host does not silently substitute UDP for a TCP connection attempt; the hang and refusal described are both TCP-level handshake behaviours, not a protocol switch.

### 215.

A monitoring tool reports that "the handshake failed" for a UDP-based service. Is that a meaningful statement?

- **A.** Yes — every transport protocol, TCP and UDP alike, performs an equivalent handshake before any data is exchanged between two hosts.
- **B.** No. UDP has no handshake at all, so "the handshake failed" can never accurately describe a UDP service; the report itself reflects a misunderstanding of the transport in use.
- **C.** Yes, but only because the monitoring tool is referring to the TLS handshake layered on top of the UDP service rather than to the TCP handshake.
- **D.** No, but only because the report should instead say "the three-way handshake succeeded but the fourth confirmation message was lost" for a UDP service, since UDP completes its own setup exchange in four messages rather than three.

**Answer: B.** UDP has no handshake at all, so "the handshake failed" can never describe a UDP service — the three-way exchange of SYN, SYN-ACK and ACK is specifically how a TCP connection opens, with nothing equivalent in UDP's connectionless design.

- A is wrong: UDP performs no handshake of any kind; only TCP establishes a connection through the three-way SYN, SYN-ACK, ACK exchange before data flows.
- C is wrong: Not every UDP-based service uses TLS, and even where a UDP service does use a security layer such as DTLS, that is a separate concern from whether "the handshake failed" is a meaningful TCP-style statement.
- D is wrong: TCP's handshake is only three messages, not four, and none of it applies to UDP at all; there is no fourth confirmation message in either protocol's connection setup.

### 216.

Why does a TCP connection open with three messages rather than four, given that both sides must exchange sequence numbers?

- **A.** Three messages suffice because only the client needs to choose an initial sequence number; the server simply echoes the client's number back unchanged in its SYN-ACK and never announces a sequence number of its own.
- **B.** The server's single SYN-ACK does two jobs at once, acknowledging the client's SYN and sending its own SYN, which is why three messages suffice rather than four.
- **C.** Three messages suffice because TCP omits acknowledging the server's own SYN entirely, trusting the connection to be open once the client's ACK is sent.
- **D.** Three messages suffice because closing a TCP connection also uses only three messages, and RFC 9293 requires the two counts to match.

**Answer: B.** Each side chooses an initial sequence number and announces it in its SYN, and the peer acknowledges it by returning that number plus one; the server's single SYN-ACK does both jobs at once, acknowledging the client and sending its own SYN, which is why three messages suffice rather than four.

- A is wrong: Each side chooses its own initial sequence number independently, including the server; the three-message count comes from combining two of the four logical steps, not from only one side needing a number.
- C is wrong: The client's final ACK specifically acknowledges the server's SYN; nothing is omitted, it is simply combined with the server's own SYN into a single SYN-ACK message rather than sent separately.
- D is wrong: Closing a TCP connection is a separate, usually four-message exchange of FIN and ACK in each direction, not a three-message process matched to the opening handshake's count.

### 217.

A packet capture shows a connection ending with FIN and ACK exchanges in both directions, after which the initiating side holds the connection open in a particular state for a period rather than releasing it immediately. What state is that, and why does it exist?

- **A.** TIME_WAIT, held for twice the maximum segment lifetime so that delayed segments from the old connection cannot be mistaken for part of a new one.
- **B.** SYN-RECV — a half-open state indicating the connection never fully completed its original handshake before being closed.
- **C.** LISTEN — the socket returns to a listening state so it can immediately accept a new connection from the same peer.
- **D.** ESTABLISHED — the connection remains fully active for a period after the FIN and ACK exchange in case either side wants to resume sending data within the same sequence-number space.

**Answer: A.** Closing is a separate, usually four-message exchange of FIN and ACK in each direction, after which the initiating side holds the connection in TIME_WAIT for twice the maximum segment lifetime so that delayed segments cannot be mistaken for part of a new connection — `tcpdump`'s `[S]`, `[S.]` and `[.]` notations mark the opening SYN, SYN-ACK and ACK that precede all of this.

- B is wrong: SYN-RECV describes an incomplete opening handshake, not a state following a completed close with FIN and ACK exchanges in both directions.
- C is wrong: LISTEN describes a server socket waiting for new incoming connections generally, not the specific state the initiating side of a just-closed connection holds afterward.
- D is wrong: ESTABLISHED describes an active, ongoing conversation; a connection that has completed FIN and ACK exchanges in both directions is closing, not remaining active for resumed data.

### 218.

A DNS query and a large file download both need to leave a host. One typically rides UDP, the other TCP. Which is which, and why does the choice matter for each?

- **A.** The DNS query typically rides UDP, since a retransmitted answer arriving late is worse than useless; the file download rides TCP, since a missing byte in the middle of a file matters more than a millisecond of delay.
- **B.** The DNS query typically rides TCP for guaranteed delivery of the answer, while the file download rides UDP so that large files transfer with the least possible overhead, since UDP's lack of per-segment acknowledgement removes the bulk of the transfer's protocol work.
- **C.** Both typically ride UDP, since neither a name lookup nor a large transfer benefits meaningfully from TCP's ordering and retransmission guarantees.
- **D.** Both typically ride TCP, since every application-layer protocol on a modern network is now built exclusively on top of TCP rather than UDP.

**Answer: A.** TCP is connection-oriented, numbering and acknowledging every byte and retransmitting what is lost, which bulk transfer needs; UDP is connectionless, with no handshake, acknowledgement or retransmission, which suits DNS queries and other cases where speed matters more than a guarantee.

- B is wrong: This reverses the usual choice: DNS queries commonly use UDP for low overhead, and bulk file transfer uses TCP because missing or out-of-order bytes must be corrected.
- C is wrong: A large file transfer specifically benefits from TCP's guarantees, since a missing or reordered byte would corrupt the result; only the DNS query commonly favours UDP.
- D is wrong: UDP remains in wide use for exactly the applications where low overhead matters more than guaranteed delivery, DNS queries among them; not every protocol has moved to TCP.

### 219.

A firewall rule opens UDP port 53 for DNS but leaves TCP port 53 closed. Ordinary DNS queries succeed, but occasional large responses fail. Why does opening one protocol's port 53 not cover the other?

- **A.** Opening UDP port 53 always opens TCP port 53 automatically as well, so the described failure must actually be caused by something unrelated to the firewall, most likely the resolver discarding answers that exceed its own configured response-size limit.
- **B.** A service is identified by protocol and port together (TCP 53 and UDP 53 are different sockets), so an unopened TCP 53 leaves large responses, which fall back to TCP, blocked while ordinary UDP queries keep working.
- **C.** DNS never uses TCP under any circumstances, so a closed TCP port 53 cannot be the explanation for the large-response failures being reported.
- **D.** The failure is unrelated to the firewall and is instead explained by the resolver's TTL settings being configured too aggressively for large zones.

**Answer: B.** A service is identified by protocol and port together: TCP 53 and UDP 53 are different sockets, and a firewall rule that opens one leaves the other closed, which is exactly why a DNS server reachable for ordinary queries can still fail on the large responses that fall back to TCP.

- A is wrong: A firewall rule for one protocol's port does not automatically open the same port number for the other protocol; TCP 53 and UDP 53 are genuinely separate sockets requiring separate rules, and no resolver response-size setting produces the described asymmetry between small and large answers.
- C is wrong: TCP port 53 is used when a response is too large for the UDP path or for zone transfers, so DNS genuinely does use TCP in specific, expected cases.
- D is wrong: TTL governs how long an answer is cached, not whether a large response can be delivered at all; the described symptom is explained by the closed TCP port, not by caching behaviour.

### 220.

When higher-level tools such as `ss`, `dig` and `curl` have not explained a behaviour, what does `tcpdump` add, and what does it require to run?

- **A.** It changes the running configuration of the interface it captures on, which is why it requires elevated privilege well beyond what mere passive observation of traffic would normally need.
- **B.** It captures the actual packets crossing an interface for direct inspection, selected with `tcpdump -i` to choose the interface, and it requires elevated privilege — it only observes traffic and never changes configuration.
- **C.** It resolves names the same way `dig` does, adding DNS-specific detail that `ss` and `curl` are not designed to show at all.
- **D.** It requires no special privilege at all, running identically for any unprivileged user exactly as `ss` and `curl` do.

**Answer: B.** tcpdump captures packets on an interface for inspection when higher-level tools do not explain the behaviour — `tcpdump -i` selects the interface, it needs elevated privilege to capture raw traffic, and it observes traffic without ever changing configuration, which is enough recognition for LFCA.

- A is wrong: tcpdump is purely observational; it never changes configuration, and its privilege requirement is about accessing raw packet capture, not about making any configuration change.
- C is wrong: tcpdump captures raw packets on the wire; it is not a DNS query tool and does not add DNS-specific resolution detail the way `dig` does.
- D is wrong: Capturing raw packets from an interface does require elevated privilege on Linux, unlike ordinary use of `ss` or `curl`, which is part of what makes tcpdump the more specialised, last-resort tool.

### 221.

A `traceroute -n` run shows three consecutive asterisks at hop 4, but the trace continues and completes successfully at hop 9. A colleague concludes hop 4's router is broken. Is that conclusion supported?

- **A.** Yes — any hop showing asterisks in a `traceroute` output is defined to indicate that specific router is broken and is dropping all traffic, not just probe replies.
- **B.** No — asterisks mean a probe went unanswered, not that traffic stops there; routers routinely deprioritise or block their own ICMP replies while forwarding perfectly, and only the final hop failing indicates a broken path.
- **C.** No, but only because the trace should have been re-run using ICMP probes with `-I` first, since UDP probes alone can never reveal this kind of intermediate-hop behaviour by default, because the UDP method discards every intermediate reply and reports only the final hop reached.
- **D.** Yes, but only because the trace completing at hop 9 must mean a completely different, redundant path was used that bypassed the broken hop 4 router entirely.

**Answer: B.** Asterisks in the output mean a probe went unanswered, not that traffic stops there; routers routinely deprioritise or block their own ICMP replies while forwarding perfectly, so loss shown at hop 4 that is absent at hops 5 through 9 is exactly that artefact, not a fault — only a failure at the final hop indicates a broken path.

- A is wrong: Asterisks specifically mean the probe itself went unanswered; the router at that hop can still be forwarding all other traffic normally, which is exactly why the trace continues successfully past it.
- C is wrong: Re-running with `-I` is a useful step when a trace dies at the first hop entirely, not specifically required to interpret intermediate asterisks when the trace otherwise completes successfully.
- D is wrong: Traceroute follows a single ongoing path hop by hop; the trace completing past hop 4 does not imply a separate redundant path, it means hop 4 forwarded the later probes normally despite not answering its own.

### 222.

A `traceroute` to a destination dies at the very first hop with no response at all, though the service itself is known to work over TCP. What should be tried before concluding the path is broken?

- **A.** Nothing should be tried further; a trace dying at the first hop with the default method is conclusive proof the entire path to the destination is broken.
- **B.** The DNS resolver should be checked next, since a traceroute dying at the first hop is defined to always indicate a name-resolution failure for the destination.
- **C.** `mtr` should be run in report mode next as the only tool capable of using a probe method other than the one `traceroute` already tried.
- **D.** Re-running with `-I` or `-T` to switch to ICMP or TCP probes, since the default UDP method to unusual high ports is the most commonly filtered, and a firewall blocking it does not mean the service itself is unreachable.

**Answer: D.** Because the default method uses UDP to unusual ports, a firewall can block traceroute entirely while the service you actually care about works — which is exactly why `-I` and `-T` exist, and why a trace that dies at the first hop should be re-run with a different method before any conclusion is drawn.

- A is wrong: A first-hop failure with the default UDP method is commonly a filtering artefact of that specific probe method, not conclusive proof of a broken path, especially when the service is independently known to work.
- B is wrong: The scenario specifies the trace is run against a working destination, and a first-hop failure with the default method is a probe-filtering issue, not evidence of a DNS problem.
- C is wrong: `mtr` combines ping and traceroute functionality but is not uniquely capable of switching probe methods; `traceroute` itself supports `-I` and `-T` directly for exactly this purpose.

### 223.

A trace from a client to a server shows the path going through a particular ISP router. The server administrator, tracing back to the client, sees a completely different set of intermediate hops. Is one of the two traces simply wrong?

- **A.** Yes — the two traces must agree exactly, since a path between any two hosts is defined to be identical in both directions on the modern internet.
- **B.** Yes, but only because one of the two administrators must have used `-n` while the other did not, producing a different, incomparable set of results.
- **C.** No — the path is one-directional, so traceroute shows the outbound route only, and the return path may genuinely differ, meaning a problem invisible from one end can be obvious from the other.
- **D.** No, but only because one of the two traces must have used `mtr` instead of `traceroute`, and the two tools are defined to always report different paths for the same route across virtually every environment of this kind.

**Answer: C.** The path is one-directional: traceroute shows the outbound route only, and the return path may differ, so a problem invisible from one end can be obvious from the other — two traces run in opposite directions between the same pair of hosts legitimately showing different hops is expected behaviour.

- A is wrong: Internet paths are frequently asymmetric; nothing guarantees the outbound and return routes between two hosts are the same, so disagreement between the two traces is expected rather than an error.
- B is wrong: `-n` only controls whether hop addresses are resolved to names; it does not change which physical path the probes actually travel, so it cannot explain a genuinely different route.
- D is wrong: `mtr` and `traceroute` report the same underlying path when run from the same host toward the same destination; a genuine difference here reflects path asymmetry, not a tool discrepancy.

### 224.

How does classic Linux `traceroute` typically discover the end of the path, given that its default probes are UDP?

- **A.** It sends TCP SYN packets to port 80 by default, relying on the final host's web server to answer and confirm the end of the path has been reached.
- **B.** It queries DNS for the destination's PTR record at each hop, and the trace is considered complete once a valid PTR record is returned for that hop's address.
- **C.** It sends UDP probes to an unlikely high destination port, so the final host answers with ICMP port unreachable, which marks the end of the trace.
- **D.** It relies on the TTL field reaching exactly 30, the default maximum hop count, at which point the trace is defined to stop and report completion regardless of the actual path length.

**Answer: C.** Classic Linux traceroute sends UDP probes to an unlikely high destination port so that the final host answers with ICMP port unreachable, marking the end of the trace, while each intermediate router along the way returns ICMP time exceeded as its TTL-limited probe is discarded. `tracepath` performs the same kind of trace without requiring superuser privilege.

- A is wrong: The classic default method uses UDP probes, not TCP SYN packets to port 80; `-T` switches to TCP probes as an alternative, not the default behaviour.
- B is wrong: DNS PTR lookups are unrelated to how traceroute detects the end of the path; that mechanism relies on ICMP port-unreachable responses to its UDP probes, not on reverse DNS records.
- D is wrong: Reaching the maximum hop count (`-m`, 30 by default) is a stopping condition for an incomplete trace, not how the tool recognises it has reached the actual, working destination.

### 225.

A service must move to a new address next week with minimal disruption. What should be changed first, and when, relative to the actual move?

- **A.** The record's TTL should be lowered well before the change, so resolvers hold the old answer for a shorter time once the change actually lands.
- **B.** The record's TTL should be raised right before the change, since a higher TTL is what makes a new answer propagate to every resolver faster.
- **C.** Nothing about DNS needs to change beforehand; flushing every resolver's cache at the moment of the move achieves the same effect as lowering the TTL in advance.
- **D.** The A record should be deleted entirely first, then recreated with the new address once the actual move has completed.

**Answer: A.** TTL explains why a DNS change is not visible everywhere at once, and planning a migration means lowering the TTL before the change, not during it, so that resolvers are already holding a short-lived cached answer by the time the actual change lands.

- B is wrong: A higher TTL makes resolvers cache an answer longer, which slows propagation of a later change, not speeds it; lowering the TTL in advance is what shortens the transition.
- C is wrong: Flushing a local cache does nothing to the caches held by every other resolver on the internet; you cannot force other people's resolvers to forget an answer, which is exactly why lowering the TTL in advance is necessary instead.
- D is wrong: Deleting the record first would cause resolution failures during the gap, which is the opposite of minimising disruption; lowering the TTL in advance is the standard, non-disruptive preparation instead.

### 226.

Repeated `dig` queries against the same resolver show a record's TTL falling from 300 to 240 to 180 across successive requests a minute apart. Is this evidence of a misconfiguration?

- **A.** Yes — a correctly configured authoritative server should always show a falling TTL exactly like this on every repeated query it answers, a pattern that holds across most deployments encountered.
- **B.** Yes, and it indicates the zone's SOA parameters have been misconfigured to force an artificially short negative-caching interval.
- **C.** No, but only because the resolver being queried must actually be the authoritative server rather than a caching, recursive one.
- **D.** No. A caching resolver returns the remaining lifetime of the cached record on each answer, so a falling TTL across repeated queries is the expected countdown, not an error.

**Answer: D.** A recursive resolver caches a record and, on each subsequent answer, returns it with the remaining TTL, counting down — repeated queries against a caching resolver showing a falling number are expected, while a query sent to the authoritative server shows the full configured value every time.

- A is wrong: An authoritative server returns the full configured TTL every time, not a falling countdown; the falling pattern specifically indicates the queries hit a caching resolver, not the authoritative server.
- B is wrong: SOA parameters govern negative caching for answers that do not exist; a falling TTL on a normal positive answer from a caching resolver is unrelated to SOA configuration at all.
- C is wrong: A falling TTL specifically indicates a caching resolver rather than the authoritative server; the authoritative server would show the full configured value on every query instead.

### 227.

A name that did not exist yesterday was created this morning, but a branch office still gets NXDOMAIN when looking it up. The zone is confirmed correct at the authoritative server. What explains the branch office's result?

- **A.** NXDOMAIN answers are never cached under any circumstances, so the branch office's resolver must instead be pointed at an entirely different, wrong nameserver.
- **B.** The branch office's `/etc/hosts` file must contain a stale entry actively overriding DNS with an incorrect result for this specific name.
- **C.** Negative answers are cached too, governed by the zone's SOA parameters, so the branch office's resolver may still hold a cached NXDOMAIN from before the name existed.
- **D.** The branch office is using a different record type than the rest of the organisation, which is why its query returns NXDOMAIN while others succeed.

**Answer: C.** Negative answers are cached too, governed by the zone's SOA parameters, so a name queried before it existed can stay NXDOMAIN in a resolver's cache after it is actually created — the branch office's report needs no fix beyond waiting out that cached negative answer's TTL.

- A is wrong: Negative answers are cached too, governed by the zone's SOA parameters, which is exactly the mechanism that explains a stale NXDOMAIN persisting after the name is created.
- B is wrong: An `/etc/hosts` override would need a prior entry for a name that did not previously exist, which is unlikely here; negative DNS caching is the ordinary, sufficient explanation.
- D is wrong: Record type choice does not explain a stale result across offices; a cached negative answer governed by TTL is the direct, sufficient explanation for this pattern.

### 228.

Is lowering a record's TTL ahead of a planned change a free safety margin, or does it have a cost?

- **A.** It is entirely free — lowering a TTL has no effect on anything except how quickly resolvers pick up the eventual new answer, since resolvers re-query on a fixed internal schedule that the record's TTL value does not influence.
- **B.** It has a cost, but only in the form of a one-time fee charged by the domain registrar each time a TTL value is changed.
- **C.** It has a real cost: a low TTL raises query volume against the authoritative servers, since resolvers must re-ask far more often, so it is a deliberate trade rather than a free margin.
- **D.** It is free as long as the change is made using `dig` rather than through the zone's own administrative interface.

**Answer: C.** A low TTL raises query volume and is a cost, not a free safety margin — resolvers cache the answer for less time and must re-ask more often, which is exactly why it has to be lowered deliberately in advance rather than left permanently low.

- A is wrong: A lower TTL means resolvers cache the answer for less time and must re-query more often, which raises load on the authoritative servers; it is not a cost-free change.
- B is wrong: Changing a TTL is not a billable, one-time registrar event; the actual cost is ongoing increased query load against the authoritative servers while the lower value is in effect.
- D is wrong: Which tool is used to inspect or change a TTL has no bearing on the cost of a lower TTL; the cost is the increased query volume against authoritative servers regardless of tooling.

### 229.

An administrator SSHed into an Ubuntu server runs `ufw enable` without first running `ufw allow 22/tcp`. What is the likely, serious consequence?

- **A.** Nothing changes for the active session, since ufw is defined to always automatically allow the port the enabling command was itself issued over.
- **B.** The command fails outright with an error and makes no change at all, since ufw refuses to enable itself while an active SSH session lacks an explicit allow rule, because it reads the current connection table before applying any policy.
- **C.** Only outbound traffic is affected, leaving the existing inbound SSH session completely unaffected regardless of any rules configured.
- **D.** The administrator is likely locked out immediately, since enabling ufw applies default-deny inbound and the active SSH session's port was never explicitly allowed first.

**Answer: D.** Enabling ufw over an SSH session without allowing 22 first is a documented mistake that locks the administrator out immediately, which is why `ufw allow 22/tcp` (or the equivalent for whatever port is in use) has to be run before, not after, enabling the firewall — the general form of the fix is simply `ufw allow` naming the needed port.

- A is wrong: ufw does not automatically detect and allow the port a command was issued over; enabling it without an explicit rule for SSH is exactly what causes the lockout.
- B is wrong: ufw(8) documents a warning prompt when enabling under ssh, not a refusal, and ufw does not read the connection table at all; it flushes the chains and applies the default-deny policy, which is precisely what causes the lockout.
- C is wrong: ufw's default-deny policy governs new inbound connections and can affect the existing session's continuity as well; assuming only outbound traffic is affected is exactly the wrong assumption that causes lockouts.

### 230.

A rule is added with `firewall-cmd --permanent --add-service=https`, but clients still cannot reach the service over HTTPS. What is missing?

- **A.** Nothing is missing — a `--permanent` rule is defined to take effect in the running configuration the instant the command completes, without any further step.
- **B.** `firewall-cmd --reload` — a `--permanent` change does not take effect until a reload, so the rule exists in the permanent configuration but not yet in the active runtime policy.
- **C.** The `--zone` flag must be added to the command, since firewalld rules added without an explicit zone are silently discarded rather than applied to any zone at all.
- **D.** The service must also be explicitly restarted, since firewalld rules are defined to have no effect on any service until that service itself is restarted.

**Answer: B.** `firewall-cmd` distinguishes the runtime configuration from the permanent one: a change without `--permanent` is lost at the next reload, and a `--permanent` change does not take effect until `firewall-cmd --reload`, so adding a rule with `--permanent` and expecting it active immediately is exactly the trap in this scenario.

- A is wrong: A `--permanent` rule specifically does not take effect immediately; it is written to the permanent configuration only, requiring `firewall-cmd --reload` to activate it in the running policy.
- C is wrong: A rule added without an explicit `--zone` applies to the default zone rather than being discarded; the actual missing step here is reloading to activate the permanent configuration.
- D is wrong: Restarting the HTTPS service itself has no bearing on whether firewalld's permanent rule has been reloaded into the active runtime configuration; the missing step is `--reload`, not a service restart.

### 231.

`iptables -L` on a current distribution shows no rule for traffic that a colleague insists was configured natively in nftables. Does the absence of a rule in `iptables -L` prove no such rule exists?

- **A.** No — on current distributions the `iptables` command is frequently a compatibility layer over nftables, so its output may not show rules created natively in nftables at all.
- **B.** Yes — `iptables -L` is defined to display every packet-filtering rule active on the system regardless of which underlying framework or tool originally created it.
- **C.** No, but only because `iptables -L` specifically requires the `-v` flag to reveal any rules created by nftables, which are otherwise omitted from the default terse chain listing shown without it.
- **D.** Yes, but only on distributions using ufw or firewalld as a front-end, since only those two tools are capable of hiding rules from `iptables -L` in this way.

**Answer: A.** On current distributions the `iptables` command is frequently a compatibility layer over nftables, the successor framework, so its output may not show rules created natively in nftables — "the rule is not in `iptables -L`" is not proof that no rule exists.

- B is wrong: `iptables -L` reflects rules visible through its own compatibility layer; a rule created natively in nftables may not appear there at all, so its absence is not conclusive proof of nothing existing.
- C is wrong: `-v` adds verbose output such as packet counters; it does not reveal nftables-native rules that `iptables -L` is simply not designed to display at all.
- D is wrong: The visibility gap comes from `iptables` itself acting as an nftables compatibility layer, independent of whether ufw or firewalld happen to be installed as additional front-ends.

### 232.

On Debian-family and Red Hat-family Linux distributions respectively, which firewall front-end is conventional, and what do both ultimately configure?

- **A.** firewalld is conventional on Debian-family systems and ufw on Red Hat-family systems; both ultimately configure a completely separate framework from netfilter.
- **B.** ufw is conventional on Debian-family systems and firewalld on Red Hat-family systems; both ultimately configure the kernel's netfilter packet-filtering framework.
- **C.** ufw is conventional on Debian-family systems and firewalld on Red Hat-family systems, but each configures a distinct, independent kernel packet filter rather than a shared one.
- **D.** Neither tool is distribution-specific; both ufw and firewalld ship as equally standard defaults across every major Linux distribution family without exception.

**Answer: B.** `ufw` (Uncomplicated Firewall) is the simplified front-end shipped by the Debian family, and `firewalld` is the zone-based, dynamically managed front-end shipped by the Red Hat family — all of them, including raw `iptables`, ultimately configure netfilter in the kernel.

- A is wrong: This reverses the conventional distribution mapping — ufw belongs to Debian-family systems and firewalld to Red Hat-family ones — and both, in fact, configure netfilter, not a separate framework.
- C is wrong: Both front-ends ultimately configure the same kernel packet-filtering framework, netfilter; they are not independent, separately implemented filtering mechanisms underneath.
- D is wrong: ufw and firewalld are each associated with a specific distribution family by convention, Debian and Red Hat respectively, not shipped as equal defaults across every distribution.

### 233.

Two hosts sit on the same physical switch but are configured in different VLANs. Can they communicate directly through the switch alone?

- **A.** No; separate VLANs are separate broadcast domains, exactly as if the hosts were on physically distinct switches, so a router or a layer 3 switch is required to forward between them.
- **B.** Yes — since they share the same physical hardware, VLAN membership has no effect on whether two hosts can reach each other directly.
- **C.** Yes, but only if both VLANs happen to use IP addresses from the same subnet, in which case the switch bridges them automatically.
- **D.** No, but only because 802.1Q tagging actively blocks all traffic between any two ports on the same physical switch by default.

**Answer: A.** VLANs are separate broadcast domains independent of physical location, so hosts in different VLANs cannot reach each other without a router or a layer 3 switch to forward between them, exactly as if they were on physically distinct switches — a broadcast-based protocol such as ARP or DHCP discovery stays inside its own VLAN.

- B is wrong: VLAN membership is exactly what determines broadcast-domain boundaries on a switch; sharing physical hardware does not override that separation.
- C is wrong: VLANs remain separate broadcast domains regardless of whether their addressing happens to overlap; a switch does not automatically bridge VLANs based on address similarity.
- D is wrong: 802.1Q tagging identifies which VLAN a frame belongs to on trunk links; it does not blanket-block traffic between ports, and access ports carry no tag at all.

### 234.

What is the difference between an access port and a trunk port in 802.1Q VLAN configuration?

- **A.** An access port carries untagged traffic for a single VLAN; a trunk port carries traffic for several VLANs at once, with an 802.1Q tag inserted into each frame identifying which VLAN it belongs to.
- **B.** An access port carries every VLAN untagged simultaneously; a trunk port is restricted to exactly one VLAN at a time, because an 802.1Q tag can only ever name a single VLAN membership for the whole of a physical link.
- **C.** An access port and a trunk port are simply two names for the same configuration, differing only in which vendor's equipment uses which term.
- **D.** An access port requires a router directly attached to it, while a trunk port can only ever connect to an end-user host device.

**Answer: A.** Ports are configured as access ports, carrying untagged traffic for a single VLAN, or as trunk ports, carrying traffic for several VLANs with an 802.1Q tag inserted into each frame — a switch strips the tag before delivering a frame to an access port, so end hosts normally never see tags at all.

- B is wrong: This reverses the actual roles: an access port is restricted to one VLAN, while a trunk port is the one that carries multiple VLANs, distinguished by tags.
- C is wrong: Access and trunk describe genuinely different port behaviours defined by the 802.1Q standard, not two vendor-specific names for identical configuration.
- D is wrong: Neither port type requires a router to be directly attached; access ports typically connect to end-host devices and trunk ports typically connect switches to each other.

### 235.

A remote worker connects to a VPN and is told they now behave, for addressing and routing purposes, as though attached to the private network directly. What does that description actually mean in practice?

- **A.** It means a virtual interface appears on the client and routes are installed pointing some or all destinations through the encrypted tunnel, so private-network resources are reached as though the client were physically on that network.
- **B.** It means the client's own physical network interface is temporarily relocated to the private network's physical location for the duration of the connection, as if the network card itself changed sites.
- **C.** It means DNS records for the private network are automatically republished to the public internet for the duration of the client's VPN session.
- **D.** It means the client's MAC address is reassigned to match one already registered on the private network's local switch infrastructure.

**Answer: A.** Typically the client authenticates to a VPN endpoint, a virtual interface appears on the client, and routes are installed pointing some or all destinations through that interface — it is the routing table, not any physical change, that determines which traffic actually enters the tunnel.

- B is wrong: Nothing physical relocates; the effect is produced entirely through a virtual interface and routing changes on the client, not any actual physical relocation of hardware.
- C is wrong: VPN access does not republish private DNS records publicly; it grants the connected client its own private routing and, typically, private-facing name resolution, without exposing anything to the wider internet.
- D is wrong: A VPN operates above the link layer, through routing over an encrypted tunnel; it does not reassign or spoof the client's MAC address to match anything on the remote network's switches.

### 236.

A user reports the VPN client shows "Connected," yet an internal server is still unreachable. What is usually implicated first, given that the tunnel itself reports as up?

- **A.** The tunnel's own encryption must be broken, since a report of unreachability after a successful connection message is always a cryptographic negotiation failure.
- **B.** The VPN endpoint's own internet connection must be down, since a client-reported 'Connected' status is always unreliable and cannot be trusted on its own.
- **C.** The server's firewall must have blocked the VPN client's specific address, since that is the only plausible explanation once a tunnel reports as successfully connected, because a tunnel that reports up necessarily has every destination inside it already routed.
- **D.** Routing or name resolution rather than the tunnel itself — in most implementations the tunnel is genuinely up, and that particular destination simply is not routed through it, which is why the routing table is checked first.

**Answer: D.** Because the routing table decides which traffic enters the tunnel, most "the VPN is connected but I still cannot reach the server" reports are generally routing or DNS problems rather than tunnel problems — the tunnel is up and simply is not being used for that particular destination.

- A is wrong: A successful 'Connected' status means the tunnel and its encryption negotiated successfully; the described unreachability is far more often a routing or split-tunnel configuration issue.
- B is wrong: A "Connected" status from the client reflects a genuinely established tunnel in most implementations; the more common explanation for a specific unreachable destination is routing, not the endpoint's own connectivity.
- C is wrong: A firewall block is possible but is not the first or most usual explanation; routing or name resolution not sending that traffic through the tunnel at all is the more common, better-supported explanation.

### 237.

A study note lists 3306 (MySQL) and 5432 (PostgreSQL) as "well-known ports" alongside 22 and 443. Using the strict IANA range definitions, is that labelling correct?

- **A.** Yes — any port number that is commonly recognised and consistently used for one particular service, like MySQL or PostgreSQL, qualifies as well-known by that usage alone.
- **B.** No, but only because 3306 and 5432 are actually dynamic or ephemeral ports, in the 49152-65535 range, rather than registered ones.
- **C.** Yes, but only for 3306, since 5432 alone falls below 1024 and genuinely belongs in the well-known range while 3306 does not.
- **D.** No. Strictly, only 0-1023 is the well-known range; 3306 and 5432 both sit above 1023 in the 1024-49151 registered range, so they are registered ports, not well-known ones, however familiar they are.

**Answer: D.** Strictly, IANA calls only 0-1023 the well-known or system range; 1024-49151 are registered ports and 49152-65535 are the dynamic or private range — 3306, 3389 and 5432 sit above 1023, so they are registered ports, not well-known ones, however familiar they are.

- A is wrong: Common recognition and consistent use do not define the well-known range; that range is strictly 0-1023 by IANA definition, and 3306 and 5432 fall outside it in the registered range.
- B is wrong: 3306 and 5432 fall in the 1024-49151 registered range, well below the 49152-65535 dynamic range; the correct correction is registered, not dynamic.
- C is wrong: Neither 3306 nor 5432 falls below 1024; both are above it, in the registered range, so neither one genuinely belongs in the well-known range.

### 238.

Match the well-known port numbers to their conventional services: 22, 25, 53, 80, 143, 443.

- **A.** 22 HTTP, 25 SSH, 53 SMTP, 80 DNS, 143 HTTPS, 443 IMAP — each service shifted one position down the list from its actual conventional port.
- **B.** 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP, 443 HTTPS, each the conventional assignment recognised in the well-known range.
- **C.** 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP, 443 MySQL — matching the first five correctly but naming a registered-range service for the last one.
- **D.** 22 SSH, 25 DNS, 53 SMTP, 80 HTTP, 143 IMAP, 443 HTTPS — swapping the conventional assignments of 25 and 53 relative to their actual services.

**Answer: B.** The conventional well-known assignments worth memorising include 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP and 443 HTTPS, all within the 0-1023 well-known range, with `ss -tulpn` remaining the only authoritative statement about what a given host is actually listening on.

- A is wrong: Every pairing here is shifted one position off from the actual conventional assignment; 22 is SSH, not HTTP, and the pattern continues that way down the list.
- C is wrong: 443 is conventionally HTTPS, not MySQL; MySQL's conventional assignment is 3306, a registered port entirely outside this list.
- D is wrong: 25 is conventionally SMTP and 53 is conventionally DNS; this pairing has those two specifically swapped relative to their correct assignments.

### 239.

A security review finds SSH answering on port 2222 on one server instead of port 22. A reviewer argues this cannot really be SSH, since SSH "is" port 22. Is that reasoning sound?

- **A.** Yes — a service can only ever run on its officially registered port number, so anything answering on 2222 must be a different protocol entirely.
- **B.** No, but only because 2222 is itself a second officially registered port for SSH alongside 22, so both numbers are equally valid by definition.
- **C.** No, nothing forces a service onto its conventional port; SSH can genuinely run on 2222, and a port number is evidence about intent, never proof of protocol.
- **D.** Yes, but only because a well-known port and its service are bound together specifically by the operating system's kernel, unlike a registered port such as this one.

**Answer: C.** Nothing forces a service onto its conventional port — SSH on 2222 is still SSH — so a port number is evidence about intent, never proof of protocol; `ss -tulpn` shows only which of the conventional assignments a host is actually listening on, not a guarantee about what protocol answers there.

- A is wrong: No enforcement mechanism binds a protocol to its conventional port number; SSH, like many services, can be configured to listen on any port an administrator chooses.
- B is wrong: 2222 is not a second registered assignment for SSH; it is simply a commonly chosen nonstandard port, not an alternate official one.
- D is wrong: The kernel does not bind any port number to a specific protocol or service at all; a well-known port carries only a lower binding privilege requirement, not a protocol-enforcement mechanism.

### 240.

A client's outbound connection uses source port 51000. Does that number fall inside IANA's dynamic/private range, 49152-65535?

- **A.** No — client source ports are always assigned somewhere within the well-known 0-1023 range regardless of what Linux's ephemeral range configuration says.
- **B.** No — 51000 falls in the registered range, 1024-49151, since IANA defines that range to extend up to the top of the operating system's default ephemeral window, 60999 on Linux, rather than stopping at the nominal 49151 boundary printed in older tables.
- **C.** The question is unanswerable, since IANA does not actually define a fixed numeric boundary for where the dynamic or private port range begins.
- **D.** Yes, it does, but note that Linux's default ephemeral range, 32768 to 60999, overlaps the registered range rather than matching IANA's dynamic range exactly, so a source port can also land below 49152 in the registered band.

**Answer: D.** Linux's default ephemeral range, 32768 to 60999, overlaps the registered range rather than matching IANA's 49152-65535 dynamic range, so a client's source port frequently lands on a number the registry has assigned to something else — a source port of 51000 does sit in IANA's dynamic band, but many others in practice will not.

- A is wrong: Client source ports are ephemeral values from a much higher range; the well-known 0-1023 range is for service ports requiring privilege to bind, not for a client's outbound source port.
- B is wrong: The registered range is defined as 1024-49151 by IANA; 51000 is numerically above that boundary and falls in the 49152-65535 dynamic range as stated, not inside the registered one.
- C is wrong: IANA does define a fixed boundary, 49152, for the start of the dynamic/private range; the boundary is well defined even though Linux's actual default ephemeral range does not align with it exactly.

### 241.

A vendor `.deb` file is installed with `dpkg -i tool_1.0_amd64.deb` and it fails because a required library is missing. What state is the package left in, and what fixes it?

- **A.** Cleanly rolled back to its pre-install state, as if the command had never been run
- **B.** Refused outright with nothing unpacked, the same behaviour `rpm -i` would show — `dpkg` checks every dependency before it extracts any file
- **C.** Fully installed and working, since `dpkg` silently substitutes a compatible library
- **D.** Unpacked but unconfigured, blocking further operations until `apt --fix-broken install` resolves the missing dependency

**Answer: D.** `dpkg -i` performs no dependency resolution. On a missing requirement it unpacks the package but cannot finish configuring it, leaving it in a half-configured state that blocks later operations until `apt --fix-broken install` (or `apt install`, which resolves dependencies from the start even for a local file) repairs it. `apt upgrade`, by contrast, only touches packages already installed from a repository.

- A is wrong: `dpkg -i` does not roll back on a missing dependency; it leaves the package unpacked and unconfigured, blocking later operations until the gap is filled.
- B is wrong: `dpkg -i` unpacks first and only then fails at the configure step, leaving the package in dpkg's `unpacked` state; the pre-extraction refusal described here is `rpm -i` behaviour on a Red Hat-family system, not dpkg's.
- C is wrong: `dpkg` performs no dependency resolution or substitution at all; a missing requirement blocks configuration rather than being silently worked around.

### 242.

An administrator needs to know exactly which files a locally installed package placed on the filesystem, using the installed package database rather than inspecting the original archive. Which command answers that?

- **A.** `dpkg -L nginx` run against the local package database
- **B.** `dpkg -l nginx` run to list installed packages and their status
- **C.** `apt update` run first, since refreshing the index also reports installed file locations
- **D.** `getent passwd nginx` run, treating the package name as an account to look up

**Answer: A.** `dpkg -L` lists the files a named installed package placed on the system, reading the local package database. It is easily confused with lowercase `dpkg -l`, which lists installed packages and their status rather than any one package's file list.

- B is wrong: Lowercase `-l` lists installed packages and their status flags; it does not list the files a specific package owns.
- C is wrong: `apt update` only refreshes the cached repository indexes; it reports nothing about files an installed package placed.
- D is wrong: That looks up a user account by name in the passwd database; it has nothing to do with querying package contents.

### 243.

Name three capabilities UEFI provides that legacy BIOS does not.

- **A.** Faster boot times, larger RAM support, and multi-core CPU support — capabilities a legacy BIOS machine cannot offer at all, whatever operating system it runs
- **B.** An EFI System Partition holding bootloaders as files, GPT partitioning supporting disks beyond roughly 2 TiB, and Secure Boot
- **C.** GRUB as the bootloader, kernel parameter passing, and the initramfs
- **D.** Support for more than four partitions total, journaling filesystems, and disk encryption

**Answer: B.** UEFI understands filesystems and reads an EFI executable from a dedicated FAT-formatted EFI System Partition rather than executing a 512-byte boot sector. That capability is what enables GPT partitioning (removing MBR's four-partition and roughly 2 TiB limits) and Secure Boot, none of which legacy BIOS provides.

- A is wrong: None of those are properties that distinguish UEFI from BIOS; the genuine distinguishing capabilities are the EFI System Partition, GPT support, and Secure Boot.
- C is wrong: GRUB, kernel parameters and the initramfs are all present regardless of which firmware generation is in use; they are not UEFI-specific capabilities.
- D is wrong: Journaling and disk encryption are filesystem-level features unrelated to firmware, and MBR already exceeds four partitions through extended partitions; the genuine firmware-linked limit is the roughly 2 TiB one MBR addressing imposes.

### 244.

An administrator disables Secure Boot in firmware settings to load an unsigned kernel module, and the machine continues to boot normally afterward using UEFI. Is that expected?

- **A.** No, disabling Secure Boot should force the machine to fall back to legacy BIOS booting
- **B.** No, because Secure Boot is required for the EFI System Partition to be readable at all
- **C.** Yes — Secure Boot is one optional UEFI feature, and turning it off does not disable UEFI booting itself
- **D.** Yes, but only because GRUB itself disables Secure Boot automatically when an unsigned module is present

**Answer: C.** Secure Boot is one optional UEFI feature that verifies the signature of each executable in the boot chain; it is not synonymous with UEFI itself. Turning it off to permit an unsigned kernel module leaves UEFI booting — the EFI System Partition, GPT, everything else — unaffected.

- A is wrong: Secure Boot is a UEFI feature layered on top of the normal boot path; disabling it does not revert the firmware to an entirely different, older boot mode.
- B is wrong: The EFI System Partition is read as part of ordinary UEFI booting regardless of whether Secure Boot's signature verification is enabled.
- D is wrong: GRUB does not silently disable a firmware-level setting; Secure Boot was turned off directly in firmware, which is what allowed the unsigned module to load.

### 245.

Put the five stages of the boot process in order, from power-on to a running system.

- **A.** Firmware, bootloader, kernel plus initramfs, PID 1 (the init system), then units until the default target
- **B.** Bootloader, firmware, kernel, units, then PID 1 — on modern machines the bootloader is what loads the firmware into memory
- **C.** Firmware, kernel, bootloader, PID 1, then units — the kernel starts first and then invokes a bootloader to locate the root filesystem
- **D.** Firmware, bootloader, PID 1, kernel, then units

**Answer: A.** The ordered handover is: firmware initialises hardware and finds a boot device; the bootloader loads the kernel and an initramfs; the kernel initialises and mounts the real root filesystem; it starts PID 1; and the init system activates units until the default target is reached.

- B is wrong: Firmware runs first, before any bootloader can be found or executed — this ordering has the first two stages reversed.
- C is wrong: The bootloader runs before the kernel, not after it — the kernel cannot be loaded until the bootloader has found and loaded it into memory.
- D is wrong: PID 1 cannot start before the kernel does, since the kernel is what starts PID 1 in the first place — the third and fourth stages are swapped here.

### 246.

`systemd-analyze blame` names a unit that took 30 seconds during a slow boot, but nothing else was waiting on that unit while it ran. Was it the cause of the slow boot?

- **A.** Yes, the slowest-duration unit in `blame`'s output is always what held boot up
- **B.** Not necessarily — `blame` measures duration, not delay, and a unit that runs in parallel with nothing waiting on it costs nothing to boot time
- **C.** No, because `blame` only reports on the firmware phase, which happens before Linux is even running
- **D.** No, but only because the unit must have failed rather than merely run slowly — `blame` lists only units that exited non-zero, so appearing in its output is itself the failure signal

**Answer: B.** systemd activates units in parallel wherever the dependency graph allows, so `blame`'s ranking by duration does not by itself show what delayed boot. `systemd-analyze critical-chain` identifies the actual ordering chain that determined when boot converged, which a merely slow but unwaited-on unit does not appear on.

- A is wrong: Duration alone does not establish delay when units run in parallel; `systemd-analyze critical-chain` is what shows the ordering chain that actually determined boot time.
- C is wrong: `blame` reports how long userspace units spent initialising; the firmware runs earlier still, before anything on disk has been read, and is outside what the command measures.
- D is wrong: Nothing in the scenario suggests the unit failed; it ran successfully but slowly, and the question is whether that slowness delayed anything else.

### 247.

An administrator edits `/etc/default/grub` to change the default boot entry and reboots, but the change has no effect. What step was skipped?

- **A.** Nothing was skipped; `/etc/default/grub` is read directly by GRUB at boot time
- **B.** The change needed `systemctl daemon-reload` to take effect — GRUB's menu is rebuilt by a systemd generator during each boot, so the manager has to be told to re-read its configuration first
- **C.** Regenerating `grub.cfg` — with `update-grub` on Debian-family systems, or `grub2-mkconfig` on Red Hat-family ones — since `/etc/default/grub` only feeds that generation step
- **D.** UEFI Secure Boot must be blocking the new default entry from being honoured

**Answer: C.** GRUB's runtime configuration, `grub.cfg`, is generated from `/etc/default/grub` and the scripts in `/etc/grub.d/`, not edited directly — the same "edited the source, did not rebuild the artefact" shape as a systemd unit needing `daemon-reload`. `update-grub` (Debian-family) or `grub2-mkconfig` (Red Hat-family) must run to regenerate it.

- A is wrong: GRUB reads the generated `grub.cfg`, not `/etc/default/grub` directly — the source file only takes effect once the generation step rewrites the config GRUB actually loads.
- B is wrong: `daemon-reload` re-reads systemd unit files and has nothing to do with GRUB's configuration, which is generated by a separate, unrelated tool.
- D is wrong: Secure Boot verifies signatures on boot executables; it does not selectively block a default-entry change, and nothing in the scenario points at signature verification.

### 248.

An administrator on a Red Hat-family server runs `update-grub` to regenerate the configuration after a kernel update, and it fails: command not found. Why?

- **A.** `update-grub` is a Debian-family wrapper script; Red Hat-family systems regenerate the configuration with `grub2-mkconfig` instead
- **B.** GRUB configuration regeneration is not supported at all on Red Hat-family systems
- **C.** The command failed because Secure Boot is enabled and blocking configuration regeneration
- **D.** The command failed because the kernel update has not finished installing yet — `update-grub` is shipped by the kernel package and appears only once the update completes

**Answer: A.** `update-grub` is a Debian-family wrapper around `grub-mkconfig -o /boot/grub/grub.cfg`, and it does not exist on Red Hat-family systems, which instead call `grub2-mkconfig -o /boot/grub2/grub.cfg` directly — reaching for the wrong family's command is a mix-up the exam can present directly.

- B is wrong: Regeneration is fully supported; it simply uses a different command name, `grub2-mkconfig -o /boot/grub2/grub.cfg`, on that family.
- C is wrong: Secure Boot governs signature verification of boot executables and has no bearing on whether a configuration-generation command exists on the system.
- D is wrong: The failure described is "command not found," which indicates the wrong tool was invoked, not that an install is still in progress.

### 249.

A file was copied as root into `alice`'s home directory and is now owned by root. `alice` wants to take ownership herself. Can she run `chown alice file` to do it?

- **A.** Yes, any user may change the ownership of a file they can currently read
- **B.** Yes, but only because she is changing it to her own account rather than someone else's
- **C.** No — only a privileged process may give a file away to another user; `alice` cannot chown it to herself either
- **D.** No, but `chgrp` would work instead — group changes carry no privilege check at all, so any user may set any group on any file

**Answer: C.** Only a privileged process may change a file's owning user, so `alice` must ask an administrator to run `chown alice file` as root. An unprivileged user may change the group of a file they own, but only to a group they themselves belong to, which is a narrower privilege.

- A is wrong: Read access has no bearing on the ownership-change privilege, which is restricted regardless of what the caller can already do with the file.
- B is wrong: The restriction applies to the operation itself, not to whether the target happens to be the caller — an ordinary user cannot chown a file at all.
- D is wrong: An unprivileged user may change a file's group, but only to a group they belong to — it is not unrestricted, and it does not change the owner.

### 250.

What is the difference between `chown alice file` and `chown alice: file`?

- **A.** There is no difference — `chown` strips a trailing colon before parsing the operand, exactly as it ignores a trailing slash on a pathname
- **B.** `chown alice: file` changes the group only, leaving the owning user untouched
- **C.** The bare form changes only the owning user; the trailing colon also sets the group to `alice`'s login group
- **D.** `chown alice: file` requires `alice` to already own the file, unlike the bare form

**Answer: C.** `chown alice file` changes only the owning user. `chown alice: file` — with a trailing colon and nothing after it — additionally sets the group to `alice`'s own login group, which is a separate and easily missed effect of the syntax.

- A is wrong: The colon is meaningful syntax: its presence, even with nothing following it, adds a group change to the command.
- B is wrong: The bare user name before the colon still sets the owner; the colon adds a group change on top of it rather than replacing it.
- D is wrong: Both forms are subject to the same ownership-change restriction; the colon does not add or remove that requirement.

### 251.

A user wants to edit their personal crontab. Why is `crontab -e` preferred over opening the spool file under `/var/spool/cron/` directly in a text editor?

- **A.** `crontab -e` validates the syntax before installing the result and ensures the daemon notices the change
- **B.** There is no real difference; both approaches update the same file identically
- **C.** Editing the spool file is preferred, since `crontab -e` only works for system crontabs, not personal ones
- **D.** `crontab -e` is required because personal crontabs cannot contain more than one line

**Answer: A.** A user crontab is edited through `crontab -e` because the command validates the syntax and installs the result into the spool directory the daemon watches. Editing the spool file directly can leave cron unaware of the change and skips the validation step entirely.

- B is wrong: The command path adds a validation step and guarantees the daemon picks up the change, neither of which a direct file edit provides.
- C is wrong: `crontab -e` is specifically the personal crontab editor; system crontabs under `/etc/cron.d/` are a different, separate mechanism.
- D is wrong: A personal crontab can hold any number of lines; the reason to prefer the command is validation and daemon notification, not a line-count restriction.

### 252.

A laptop was powered off overnight, missing its scheduled 03:00 cron job entirely; the job never ran once the machine came back on. Is plain cron broken?

- **A.** Yes, cron should always run a missed job as soon as the machine powers back on
- **B.** No, but the job must have been accidentally removed with `crontab -r` — cron drops a user's table automatically once one of its scheduled runs is missed
- **C.** No — cron simply skips a scheduled time that passes while the machine is off; `anacron` exists specifically to compensate for that
- **D.** Yes, and the fix is to switch the job to a `.timer` unit without `Persistent=true`

**Answer: C.** Cron simply skips a scheduled time that passes while the machine is powered off — it is not a fault. `anacron` exists to compensate for that on machines that are not on continuously, and a systemd timer with `Persistent=true` is the equivalent modern alternative. `crontab -l` would have confirmed the job was still scheduled all along.

- A is wrong: That catch-up behaviour is exactly what plain cron lacks and what `anacron` was built to add — expecting it from cron itself is the mistake here.
- B is wrong: Nothing in the scenario suggests the crontab was removed; a missed run on a machine that was off is the far more direct and standard explanation.
- D is wrong: A timer without `Persistent=true` would show exactly the same behaviour as cron here; the catch-up property requires that setting specifically.

### 253.

A crontab line reads `30 4 1,15 * 5 /usr/local/bin/report.sh`. Both the day-of-month and day-of-week fields are restricted. When does the job actually run?

- **A.** At 04:30 on the 1st and 15th of every month, and additionally at 04:30 every Friday
- **B.** At 04:30, only on whichever day is both the 1st or 15th of the month and a Friday
- **C.** At 04:30 on the 1st and 15th of every month only; the day-of-week field is ignored when the day-of-month field is also set
- **D.** At 04:30 every Friday only; the day-of-month field is ignored when the day-of-week field is also set

**Answer: A.** When both the day-of-month and day-of-week fields are restricted (neither is `*`), cron combines them with OR rather than AND: the command runs when either matches. `30 4 1,15 * 5` therefore runs at 04:30 on the 1st and 15th and every Friday — a genuinely counter-intuitive rule worth memorising precisely. Entries like this are installed through `crontab -e`.

- B is wrong: The two day fields do not combine with AND; treating them that way would make the job run far less often than the five-field syntax specifies.
- C is wrong: Neither day field is ever silently ignored — when both are restricted, both take effect and combine with OR.
- D is wrong: Both restricted day fields take effect together via OR; the day-of-month field is not overridden by the day-of-week field.

### 254.

A crontab entry runs `backup.sh` (a bare command name, no path) and works perfectly when typed by hand at the shell, but silently does nothing on schedule. What is the standard diagnostic first step, and what is usually wrong?

- **A.** The crontab syntax must contain a typo in one of the five time fields
- **B.** Assume the environment: cron does not source shell startup files and supplies a minimal `PATH`, so a bare command name is often not found
- **C.** The job must have been removed by an accidental `crontab -r` — a crontab entry naming a command without an absolute path is rejected and discarded at install time
- **D.** cron jobs cannot execute shell scripts at all, only single binaries

**Answer: B.** The environment a cron job runs in is not the interactive shell's: cron sets a short default `PATH`, does not source `~/.bashrc` or `/etc/profile`, and takes `HOME`/`LOGNAME` from `/etc/passwd`. A bare command name that resolves fine interactively is the classic case that fails silently under cron; the fix is an absolute path or an explicit `PATH=` line in the crontab.

- A is wrong: A typo in the time fields would produce a run at the wrong time or not at all in a way distinguishable from this, but the described symptom — total silence with no output — is the signature of the sparse cron environment, not a scheduling error.
- C is wrong: If the crontab had been removed, `crontab -l` would show it missing entirely; the scenario describes the entry running silently on schedule with no visible effect.
- D is wrong: Cron happily executes shell scripts; the actual obstacle here is that the bare command name cannot be found under cron's minimal `PATH`.

### 255.

An administrator edits `nginx.service` to add `Restart=on-failure`, then runs `systemctl restart nginx`. The new restart policy does not appear to take effect. What is missing?

- **A.** Nothing is missing; `restart` always re-reads the unit file before restarting the process
- **B.** `systemctl daemon-reload` — until it runs, systemd is still acting on the unit definition it parsed earlier, not the edited file
- **C.** The change needed `systemctl reload nginx` instead of `restart` — `reload` is the verb that re-reads the unit file without interrupting the service
- **D.** The unit needed `systemctl enable --now` run again to pick up the change

**Answer: B.** systemd caches parsed unit files, so editing one and then restarting the service still runs against the old cached definition. `systemctl daemon-reload` rescans the unit directories and rebuilds the dependency graph, and only after that does a restart pick up the change.

- A is wrong: A plain restart does not re-parse the unit file — that is specifically what `daemon-reload` does, and skipping it is the whole reason the edit appears to have no effect.
- C is wrong: `reload` asks the running nginx process to re-read its own application configuration. systemctl(1) is explicit that it 'will reload the service-specific configuration, not the unit configuration file of systemd'; only `daemon-reload` does the latter.
- D is wrong: Re-enabling only recreates the boot-time symlink; it does not make the manager re-parse an edited unit file.

### 256.

Three similarly named operations exist: `systemctl daemon-reload`, `systemctl reload nginx`, and `systemctl restart nginx`. Which one re-reads unit files from disk, manager-wide?

- **A.** `systemctl reload nginx`, since "reload" is the word that implies re-reading configuration
- **B.** `systemctl daemon-reload`, which takes no unit argument and rebuilds the dependency graph from every unit file
- **C.** `systemctl restart nginx`, since restarting naturally picks up whatever has changed
- **D.** All three do the same thing at different scopes, so any one of them suffices — `daemon-reload` is simply the variant that applies it to every unit at once

**Answer: B.** `systemctl daemon-reload` takes no unit argument because it is a manager-wide operation: it re-reads every unit file and rebuilds the dependency graph. `reload <unit>` asks one running application to re-read its own configuration, and `restart <unit>` merely stops and starts the process — neither touches the cached unit definitions.

- A is wrong: That command asks the *nginx process itself* to re-read its own application configuration file — it does nothing to systemd's cached unit definitions.
- C is wrong: Restart stops and starts the process using whatever unit definition the manager already has cached; it does not re-parse the unit file.
- D is wrong: They are three genuinely different operations — re-reading unit definitions, asking an application to reload its own configuration, and stopping and starting a process — not scoped variants of one action. `daemon-reload` starts and stops nothing.

### 257.

A user starts a long compilation with `make &` in their SSH session and disconnects without using `nohup`. Is the compilation process a daemon?

- **A.** Yes, any process running in the background without an interactive prompt counts as a daemon
- **B.** No. It is still attached to the terminal session and dies with it; a daemon has no controlling terminal at all
- **C.** Yes, because it was started at the command line rather than by `systemctl` — a command launched from an interactive shell is handed off to PID 1 as soon as the prompt returns
- **D.** No, but only because `make` is a build tool rather than a long-running server

**Answer: B.** A daemon is a long-running background process with no controlling terminal, typically started at boot. A job merely backgrounded with `&` is still attached to its terminal session and, without `nohup` or `disown`, is usually killed when that session ends — it has not detached the way a daemon does.

- A is wrong: Not every background process is a daemon: this one is still attached to a terminal session and is typically killed when that session ends.
- C is wrong: How a process is started does not determine whether it is a daemon; what matters is whether it has detached from a controlling terminal.
- D is wrong: The distinction is about terminal attachment and lifetime, not about what category of program is running.

### 258.

A program was written to detach itself from its terminal on startup — forking, calling `setsid()`, and re-parenting to PID 1 — but has no systemd unit file. Is it a daemon? Is it a service?

- **A.** It cannot be a daemon without a unit file, since daemons and services are the same thing under systemd
- **B.** It is both a daemon and a service, since any long-running background process qualifies as a service
- **C.** It is a daemon, because it has detached and runs in the background continuously; it is not a service, because nothing is supervising or restarting it
- **D.** It is neither, since only systemd-managed processes count as daemons on a modern distribution — the term was retired from Linux terminology when SysV init was replaced

**Answer: C.** A daemon is defined by how it runs — detached from a terminal, long-lived — which this program achieves through the classic double-fork pattern. A service is a management layer on top of that, and without a unit file nothing restarts it or brings it back at boot, so it is a daemon without being a service.

- A is wrong: The two terms are not interchangeable: a program can detach itself perfectly well without any unit file, in which case it is a daemon but not a managed service.
- B is wrong: A service specifically implies a supervision policy — starting, stopping, restarting — which this program has none of without a unit file.
- D is wrong: The classic self-detaching pattern (fork, `setsid()`, re-parent to PID 1) is exactly what makes a process a daemon, with or without systemd managing it.

### 259.

What is a dependency, in the context of installing an OS package?

- **A.** Any package that is merely recommended alongside the one being installed
- **B.** A configuration file the package writes into `/etc` on installation
- **C.** The repository a package was downloaded from — which is what the package's `Depends` field records
- **D.** A package that another package requires in order to work, resolved automatically by a repository-aware manager

**Answer: D.** A dependency is a package another package requires — usually a shared library or helper binary. A repository-aware manager such as `apt` or `dnf` resolves these recursively, which is the single feature that separates it from a single-package tool such as `dpkg` or `rpm`.

- A is wrong: A recommended or suggested package is a softer relationship than a hard dependency; only a hard dependency blocks installation if it is missing.
- B is wrong: A configuration file is a piece of the package's own content, not another package it requires in order to function.
- C is wrong: Where a package came from is a separate concept from what other packages it needs installed alongside it; the `Depends` field names required packages, never a repository.

### 260.

An `/etc/fstab` line references `/dev/sdb1` directly rather than a UUID. After a hardware change, the machine boots with the wrong filesystem mounted at that entry's mount point. Why?

- **A.** `/dev/sdb1` should always refer to the same physical disk once assigned, so this points to a filesystem corruption problem instead
- **B.** The partition table itself must have become corrupted during the hardware change
- **C.** `/etc/fstab` entries expire after a hardware change and must be manually renewed
- **D.** Kernel device names are not stable across reboots — which physical disk becomes `/dev/sdb` depends on enumeration order

**Answer: D.** Kernel device names such as `/dev/sdb` depend on enumeration order at boot and are not guaranteed stable, especially after a hardware change. `/etc/fstab` should reference a UUID rather than a device node for exactly this reason.

- A is wrong: Device names are explicitly not guaranteed stable: fstab(5) states that "device names are often a coincidence of hardware detection order, and can change when other disks are added or removed", and recommends `LABEL=` or `UUID=` instead.
- B is wrong: Nothing about a device name shifting requires partition table corruption; enumeration order alone is sufficient to explain the mismatch.
- C is wrong: Fstab entries do not expire; the actual issue is that the referenced device name no longer points at the intended disk.

### 261.

What is the behavioural difference between reading from `/dev/null` and reading from `/dev/zero`?

- **A.** They behave identically — both are general-purpose discards for anything written to them
- **B.** `/dev/null` is a block device and `/dev/zero` is a character device
- **C.** `/dev/zero` requires root to read from, while `/dev/null` does not — the endless stream it produces is treated as a privileged resource and its node is created mode 0600
- **D.** `/dev/null` returns end-of-file immediately on read; `/dev/zero` returns an endless stream of zero bytes

**Answer: D.** `/dev/null` discards data written to it and returns end-of-file immediately when read, while `/dev/zero` returns an endless stream of zero bytes on read — a common trap for anyone assuming `/dev/null` is a general-purpose discard for every use.

- A is wrong: They agree on write behaviour (both discard input), but they behave very differently on read, which the "general-purpose discard" framing misses.
- B is wrong: Both are character devices; the distinguishing property here is read behaviour, not the block-versus-character classification.
- C is wrong: null(4) shows both nodes created identically and world-accessible — `mknod -m 666 /dev/null c 1 3` and `mknod -m 666 /dev/zero c 1 5` — so neither is restricted to root.

### 262.

`df -h` reports a filesystem at 100% used, but `du -sh` walking the same filesystem from the top totals far less than what `df` reports. What kind of cause does that gap point at?

- **A.** `du` must simply be miscounting, and rerunning it with different flags will resolve the discrepancy
- **B.** The filesystem must have run out of inodes rather than blocks — an exhausted inode table is billed to `df` as used space while contributing nothing that `du` can walk to
- **C.** The discrepancy always means the filesystem needs an `fsck` before anything else is checked
- **D.** A structural cause invisible to `du` — most commonly a deleted file still held open by a running process

**Answer: D.** `df` reports what the filesystem itself has allocated, which includes blocks belonging to files that have been unlinked but are still held open by a running process; `du` walks directory names and cannot see such a file at all, since it has no name left to walk to. That is the classic explanation when `du`'s total falls well short of `df`'s.

- A is wrong: `du` is not miscounting; it fundamentally cannot see certain categories of space, such as a deleted-but-open file, regardless of which flags are used.
- B is wrong: Inode exhaustion shows up in `df -i`, not as inflated block usage in `df -h`; it produces "No space left on device" on new writes while blocks remain free, and does not open a gap between reported used space and a directory walk.
- C is wrong: A structural check is not the standard first response to this specific symptom; `df` and `du` disagreeing has well-known, non-corruption causes to check first.

### 263.

A filesystem reports full. Walk through the correct diagnostic order: what is checked first, second, and third?

- **A.** `du -sh /` immediately, since it directly finds the largest files on the whole machine in one pass
- **B.** `lsof +L1` first, since deleted-but-open files are always the cause of a full filesystem — every other cause of a full filesystem will already have been reported as an error long before `df` shows 100%
- **C.** `df -h` to find which filesystem is full, then `df -i` to rule out inode exhaustion, then `du -sh` descending from the mount point to locate the largest tree
- **D.** `fsck` immediately, since a full filesystem should always be checked for structural damage first

**Answer: C.** The efficient order works outward from the cheapest check: `df -h` identifies which filesystem is full, `df -i` on that filesystem rules in or out inode exhaustion, and only then does `du -sh` descending from the mount point locate the specific directory responsible — checking the three structural causes (unlinked-open file, hidden mount, reserved blocks) if `du`'s total still falls short.

- A is wrong: Running `du` over the entire machine first skips identifying which filesystem is actually affected and wastes time walking filesystems that are not the problem.
- B is wrong: Deleted-but-open files are one possible cause among several, and nothing reports the ordinary ones in advance; checking for them before confirming which filesystem and which resource is full is out of order.
- D is wrong: A full filesystem is not itself evidence of corruption, and running `fsck` first skips the cheap checks that usually explain the symptom directly.

### 264.

On a current Red Hat-family system, an administrator runs `yum install nginx` instead of `dnf install nginx`. What actually happens?

- **A.** An error, since `yum` was removed entirely once `dnf` became the default
- **B.** The equivalent of `dpkg -i` — a single-file install with no dependency resolution
- **C.** The same operation `dnf install` would perform — `yum` is kept as a compatibility name for the same tool
- **D.** A different package management system entirely, unrelated to `dnf` — with its own separate package database that `dnf` cannot read

**Answer: C.** `dnf` is the successor to `yum`, and on current Red Hat-family systems `yum` is retained as a compatibility name for the same tool — a relationship candidates most often get backwards, treating `dnf` as a variant of `yum` rather than the other way round.

- A is wrong: `yum` still works on current systems as a compatibility name; it was not removed, only superseded as the primary name.
- B is wrong: That describes `rpm`, the low-level tool in this family; both `yum` and `dnf` are the repository-aware, dependency-resolving layer.
- D is wrong: `yum` and `dnf` are not unrelated systems; `dnf` is specifically the successor built to replace `yum`, and both operate on the same RPM database — there is no second, yum-only package database.

### 265.

`rpm -q mypackage` reports "package mypackage is not installed," even though the administrator is looking directly at a downloaded `mypackage.rpm` file in the current directory. What is the mistake?

- **A.** `rpm -q` was given a package *name*, which it looks up in the installed-package database — the file has to be named instead: `rpm -qp mypackage.rpm`
- **B.** `rpm -q` is broken and `dnf` must be used instead for any file-based query, since only `dnf` can read an `.rpm` header directly
- **C.** The `.rpm` file must first be added to a configured repository and indexed with `createrepo` before it can be queried
- **D.** `rpm -ql` should have been used instead of `rpm -q` — the `-l` makes `rpm` look on disk rather than in the database

**Answer: A.** `rpm -q` given a bare package *name* looks that name up in the database of installed packages, which is why a package plainly present on disk is reported as "not installed". To query the download itself, name it as a file — `rpm -qp mypackage.rpm`, where `-p` tells `rpm` the argument is a package file to read directly.

- B is wrong: `rpm -q` works correctly for its intended purpose, and it reads package headers directly when pointed at a file; the fix is to name the file, not to switch tools.
- C is wrong: An uninstalled local file can be queried directly with `rpm -q -p`; nothing about querying it requires a repository or a `createrepo` index first.
- D is wrong: `-l` only changes what is listed about whichever package was selected; the selection still comes from the installed-package database when a bare name is given, so `rpm -ql mypackage` shows the identical 'not installed' result.

### 266.

List the six whitespace-separated fields of an `/etc/fstab` line, in order.

- **A.** Device, mount point, filesystem type, mount options, dump flag, and fsck pass order
- **B.** Device, mount point, mount options, filesystem type, dump flag, and fsck pass order
- **C.** Device, mount point, filesystem type, owner, group, and permissions
- **D.** UUID, label, device, mount point, options, and fsck pass order

**Answer: A.** `/etc/fstab` has six positional, unlabelled fields in order: device, mount point, filesystem type, mount options, dump flag, and fsck pass order. Because the fields are positional, a missing options field silently shifts the two numeric fields that follow it.

- B is wrong: This swaps the third and fourth fields — filesystem type comes before mount options, not after.
- C is wrong: An fstab line does not record ownership or permission bits at all; the fifth and sixth fields are the dump flag and the fsck pass order.
- D is wrong: UUID and label are alternative ways of naming the first field (the device), not two separate fields of their own.

### 267.

An `/etc/fstab` entry was just added for a new filesystem. What is the safe way to confirm the line is correct before the next reboot depends on it?

- **A.** Nothing is needed; a malformed `/etc/fstab` entry is safely ignored at boot
- **B.** `findmnt --target`, which shows what is currently mounted at the intended path
- **C.** `blkid`, to regenerate the UUID for the new filesystem before rebooting — an fstab line is only honoured once `blkid` has re-registered the filesystem's identifier
- **D.** `mount -a`, which mounts everything in the file not marked `noauto` and surfaces a syntax error while a shell is still available

**Answer: D.** A malformed or wrong `/etc/fstab` entry can leave the boot process waiting on a device that cannot be found and dropping into emergency mode. `mount -a` applies the file to the running system immediately, surfacing any error while a working shell is still available to fix it.

- A is wrong: A malformed or unsatisfiable entry does not fail quietly — fstab(5) documents the `nofail` option as meaning "do not report errors for this device if it does not exist", which exists precisely because, without it, a bad entry is reported as an error at boot.
- B is wrong: That command reports the running kernel's current mount table, not whether the newly written fstab line itself is syntactically valid.
- C is wrong: `blkid` reports the type, UUID and label of filesystems that already exist; it neither generates identifiers nor validates or applies an fstab entry.

### 268.

How many colon-separated fields does a line in `/etc/group` have, and how does that compare with `/etc/passwd`?

- **A.** Seven fields in both files, since they share the same layout convention
- **B.** The reverse pairing — seven for `/etc/group` and four for `/etc/passwd`
- **C.** Four fields in `/etc/group`, against nine in `/etc/passwd`
- **D.** Four fields in `/etc/group`, against seven in `/etc/passwd`

**Answer: D.** `/etc/group` has four fields — group name, password placeholder, GID, and the comma-separated supplementary member list — against `/etc/passwd`'s seven, because one row describes an entire group rather than a single account's full set of attributes. `getent group` is the NSS-aware way to query a row rather than reading the file directly.

- A is wrong: The two files describe different kinds of row and do not share a field count; `/etc/group` has fewer fields.
- B is wrong: This reverses the actual counts: `/etc/passwd` is the seven-field file describing an account.
- C is wrong: Nine is the field count for `/etc/shadow`, not `/etc/passwd`, which has seven.

### 269.

`getent group developers` lists three members. A fourth user has `developers` as their primary group. Does that user appear in the output?

- **A.** Yes, every member of the group appears in the member list regardless of how they joined it
- **B.** No. The member list in `/etc/group` records supplementary membership only
- **C.** No, because primary group membership is not recorded anywhere on the system
- **D.** Yes, but only after running `groupadd` again to refresh the membership list

**Answer: B.** The fourth field of `/etc/group` is the supplementary member list only. A user whose primary group is `developers` is recorded on their own `/etc/passwd` row, not in `/etc/group`, so answering "who is in this group" completely requires reading both files.

- A is wrong: The field only ever lists supplementary members; anyone whose primary group this is will be missing from it.
- C is wrong: It is recorded — in field four of that user's `/etc/passwd` row — just not in `/etc/group`'s member list.
- D is wrong: `groupadd` creates a group; it does not recompute or refresh any membership list.

### 270.

Counting the colon-separated fields of a line in `/etc/passwd` in order, which field is the login shell?

- **A.** The seventh and last field
- **B.** The sixth field, since the password placeholder is usually skipped when counting
- **C.** The fourth field, the same position as the primary GID
- **D.** It is not in `/etc/passwd` at all — login shells are recorded only in `/etc/shadow`

**Answer: A.** `/etc/passwd` has seven fields: username, password placeholder (x), UID, GID, comment/GECOS, home directory, and login shell. The placeholder is the field most often dropped when counting by memory, which shifts every later field. `getent passwd` is the NSS-aware way to look up a row without opening the file directly.

- B is wrong: The placeholder field is easy to forget, but it is still field two — omitting it miscounts everything after it by one.
- C is wrong: The fourth field is the primary GID; the login shell comes three fields later.
- D is wrong: `/etc/shadow` holds password hashes and ageing data, not the login shell, which lives in `/etc/passwd`.

### 271.

An administrator runs `getent passwd alice` and sees `x` in the second field. What does that field actually hold today?

- **A.** The account's password hash, still stored here as the field name suggests
- **B.** The number of days until the password expires — the field was repurposed for ageing data once the hashes themselves moved out to `/etc/shadow`
- **C.** Nothing usable — it is a placeholder, and the real password hash lives in `/etc/shadow`
- **D.** The account's primary GID, encoded as the letter `x`

**Answer: C.** `/etc/passwd` is world-readable, so it cannot safely hold a password hash; the second field is a placeholder (`x` on most systems) pointing administrators at `/etc/shadow`, which is not world-readable and holds the real hash.

- A is wrong: Despite the field's name, the hash has not lived in `/etc/passwd` for decades — it is world-readable, which a hash cannot safely be.
- B is wrong: Expiry is tracked in `/etc/shadow`'s ageing fields, not in this world-readable file.
- D is wrong: The GID is the next field over and is always numeric, not the placeholder character.

### 272.

A Debian-family server and a Red Hat-family server both protect `/etc/shadow` from ordinary users, but by different means. What are the two modes?

- **A.** `0644 root:root` on every distribution, since the file only needs to block writes
- **B.** `0600 root:root` universally, matching the private key convention
- **C.** `0640 shadow:root` on both families, with the group and owner reversed from the Debian scheme
- **D.** `0640 root:shadow` on Debian-family systems, and `0000 root:root` on Red Hat-family systems

**Answer: D.** Exact permissions are distribution-specific: Debian-family systems ship `/etc/shadow` as `0640 root:shadow` so the `shadow` group can read it, while Red Hat-family systems ship it `0000 root:root`, relying on root bypassing permission checks entirely. Neither figure should be stated as universal. `chage` is the tool for reading or changing the ageing fields this file holds.

- A is wrong: That mode would leave the file world-readable, exposing every password hash — exactly what shadowing exists to prevent.
- B is wrong: The two families do not converge on one mode; the permissions genuinely differ by family, which is the point being tested.
- C is wrong: This reverses the actual Debian-family ownership, where `root` owns the file and `shadow` is the readable group.

### 273.

An administrator wants to force `bob` to pick a new password the next time he logs in, without disabling his account. Which change to `/etc/shadow` fields does that, and which command applies it?

- **A.** Set the last-change field to `0` with `chage -d 0 bob`
- **B.** Set the account expiry date with `chage -E`
- **C.** Edit `/etc/passwd` to clear the login shell field
- **D.** Lock the account with `usermod -L`, which forces a password reset on next login

**Answer: A.** `/etc/shadow` records the date of last password change as days since the epoch, and setting that field to `0` is the documented way to force a change at next login; `chage -d 0` sets it. Locking the account or setting an expiry date achieves a different outcome.

- B is wrong: An expiry date disables the account outright once reached, rather than merely prompting for a new password.
- C is wrong: The login shell controls what runs at login, not whether a password change is required — and it is the wrong file for ageing data.
- D is wrong: Locking prefixes the stored hash with `!` so no password matches at all — it prevents login rather than prompting for a new password.

### 274.

Why does `visudo` exist instead of editing `/etc/sudoers` with a normal text editor?

- **A.** It is only a convenience wrapper that opens the file in a nicer editor with syntax highlighting
- **B.** It encrypts the sudoers file so its contents cannot be read by anyone but root — the plaintext is decrypted into memory only while `sudo` evaluates the policy
- **C.** It is required because `/etc/sudoers` cannot otherwise be opened by any editor
- **D.** It validates the syntax before installing the file, so a mistake cannot lock every administrator out of privilege escalation at once

**Answer: D.** `visudo` locks the file against simultaneous edits, runs an editor, then parses the result and refuses to install it if there is a syntax error — printing the offending line and offering to re-edit. A plain editor has no such check, and a broken sudoers file makes `sudo` refuse its entire policy for everyone.

- A is wrong: The validation step is the substantive purpose; a plain editor with highlighting would still allow an unparseable file to be saved and installed.
- B is wrong: Sudoers is a plain-text policy file; `visudo`'s role is validating syntax, not encrypting the file's contents.
- C is wrong: The file can be opened by any editor; nothing technically prevents that. The reason to avoid it is the lack of a safety check before saving.

### 275.

`sudo` has stopped working for every user on a server after a configuration change earlier today. What is the diagnostic order for recovering, starting from a surviving root session?

- **A.** Run `visudo -c` to see whether the main file parses, then check every drop-in under `/etc/sudoers.d/`, since a broken drop-in produces the same symptom
- **B.** Delete `/etc/sudoers` and let the package manager regenerate a default copy — the sudo package's post-install script reinstalls a known-good policy whenever the file is missing
- **C.** Reboot the server, since a sudoers problem is always resolved by a fresh boot
- **D.** Run `chmod 777 /etc/sudoers` so every user can bypass the broken policy temporarily

**Answer: A.** A file that fails to parse is not partially applied — `sudo` refuses the whole policy, not just the broken line. From a surviving root session, `visudo -c` checks the main file, and because `visudo -c` also validates included files, checking `/etc/sudoers.d/` next catches a broken drop-in with the same symptom.

- B is wrong: Deleting the policy file removes the ability to reason about what changed and is far more destructive than checking syntax with `visudo -c` first.
- C is wrong: Rebooting does not repair a syntax error in a text file; the broken policy would still be in force after restart.
- D is wrong: Opening the file to everyone is both unsafe and beside the point — `sudo` refuses a policy that fails to parse regardless of who can read it.

### 276.

Which directory holds host-specific system configuration, and what does the FHS say may never be placed there?

- **A.** `/etc`, and log files, since logging is considered configuration data
- **B.** `/var`, and binaries, since `/var` is also host-specific
- **C.** `/usr/local/etc`, and configuration files themselves — since FHS 3.0 moved system-wide configuration out of `/etc` and into that tree
- **D.** `/etc`, and binaries — the FHS is explicit that `/etc` holds settings, not the programs that read them

**Answer: D.** `/etc` holds host-specific configuration, and by FHS convention its contents are editable text files — no binaries belong there. Nearly every configuration file this competency names, from `/etc/passwd` to `/etc/systemd/system`, lives under this directory precisely because of that classification.

- A is wrong: Log files belong under `/var/log`, since they are variable data that grows at runtime — a different classification from `/etc`'s static configuration.
- B is wrong: `/var` is unshareable and variable, holding logs and runtime state, not the static configuration that `/etc` holds.
- C is wrong: FHS 3.0 still defines `/etc` as host-specific system configuration and it is exactly configuration files that belong there; `/usr/local/etc` is defined only as host-specific configuration for locally installed binaries, not as a replacement for `/etc`.

### 277.

Someone asks "what filesystem does the FHS use?" What is wrong with the question?

- **A.** Nothing is wrong; the FHS is a specific on-disk format like ext4 or XFS — the one the Linux Foundation defines as the default for the root partition
- **B.** The FHS is not a filesystem at all; it is a convention for what each directory means, not an on-disk format
- **C.** The question is fine, and the answer is whichever filesystem type the root partition uses
- **D.** The question is fine, and the answer is `tmpfs`, since that is what most FHS directories use

**Answer: B.** The Filesystem Hierarchy Standard is a naming convention — what `/etc`, `/var`, `/usr` and the rest are for — not an on-disk format. Filesystem type (ext4, XFS, Btrfs, and so on) is the entirely separate concept that determines journaling, block size and maximum file size.

- A is wrong: The FHS says nothing about journaling, block size, or maximum file size — those are properties of a filesystem type, a distinct concept that happens to share the word "filesystem" — and it defines no on-disk format at all, default or otherwise.
- C is wrong: The FHS applies identically regardless of which on-disk format is chosen underneath it; the two are independent concepts sharing a name.
- D is wrong: Most FHS-defined directories sit on whatever the administrator chose at `mkfs` time, not universally on `tmpfs`.

### 278.

A team is choosing where to install software they compiled themselves, separate from anything the distribution's package manager owns. Which directory is the standard place, and why not `/usr/bin`?

- **A.** `/usr/bin`, since that is simply where all executables belong regardless of who built them
- **B.** `/usr/local`, because the package manager owns everything under `/usr` except that subtree
- **C.** `/opt`, since any third-party software belongs there by convention
- **D.** `/var/local`, since locally built software is variable data

**Answer: B.** The FHS reserves `/usr/local` as the parallel tree for software the local administrator builds and installs, kept separate from everything the package manager owns under `/usr`. `/opt` is the related but distinct convention for self-contained third-party packages with their own tree.

- A is wrong: The package manager treats everything under `/usr/bin` as its own; placing locally compiled software there risks it being overwritten by the next package update.
- C is wrong: `/opt` is for self-contained third-party packages that keep their own directory tree, a different pattern from software built to install into the normal hierarchy.
- D is wrong: Locally compiled software is static once installed, not data that grows at runtime, so it does not belong under `/var`.

### 279.

A team plans to grow a filesystem while it stays mounted, and possibly shrink it later. Between ext4 and XFS, which choice keeps the shrink option open?

- **A.** XFS, since it is the more modern of the two and therefore supports every resize operation
- **B.** Either — resizing capability is governed by the Filesystem Hierarchy Standard, not by the filesystem type
- **C.** Neither, since resizing any mounted Linux filesystem always requires reformatting first
- **D.** ext4, since `resize2fs` can shrink it, though only while unmounted; XFS is designed to be grown online and offers no general way to shrink

**Answer: D.** Filesystem type determines resizing capability directly: XFS can be grown while mounted but offers no general way to shrink (xfs_growfs(8) implements only the narrow last-allocation-group case), while ext4 can be shrunk, but only while unmounted. A plan that assumes "we will resize it later" is only safe once the type is known — created with `mkfs` and confirmed afterward with `blkid`.

- A is wrong: Being more modern does not imply broader capability here — xfs_growfs(8) expands a mounted filesystem, and the only shrink it implements is the narrow last-allocation-group case, so XFS cannot be relied on to shrink.
- B is wrong: Resize capability is a property of the on-disk format itself, which is exactly what filesystem type governs; the FHS says nothing about it.
- C is wrong: `resize2fs` shrinks an unmounted ext4 filesystem in place, so reformatting is not the only route to a smaller filesystem.

### 280.

Files copied onto a USB stick formatted vFAT come back with different Unix ownership and permission bits than they had on the source filesystem. Is this a `chmod` failure?

- **A.** Yes, `chmod` must have been run incorrectly before the files were copied — vFAT copies the source mode bits verbatim into each directory entry's attribute byte, so a bad source mode is what shows up afterwards
- **B.** No, but only because the FHS forbids storing permissions on removable media
- **C.** Yes, and re-running `chown` and `chmod` on the USB stick will make the change permanent
- **D.** No — vFAT stores no Unix ownership or permission bits at all, so what is shown afterward comes entirely from the mount options

**Answer: D.** vFAT stores no Unix ownership or permission bits, so files copied onto it come back with whatever the mount options dictate rather than what they had on the source filesystem — a data-loss-looking surprise that is really a property of the destination filesystem type, not a `chmod` mistake.

- A is wrong: vFAT has no on-disk representation for Unix ownership or permission bits at all, so no `chmod` mistake is needed to produce this result; mount(8) documents `uid=`, `gid=` and `umask=` as the options that set them for every file on the mount.
- B is wrong: The FHS governs directory layout and says nothing about what any given filesystem type can store; the limitation here is intrinsic to the vFAT format.
- C is wrong: Because vFAT has nowhere to store Unix ownership, any such change would not persist across a remount either.

### 281.

A long-running job is started interactively in the foreground of an SSH session and then suspended with Ctrl-Z. Which two commands move it to the background and later bring it back?

- **A.** `nohup` to resume it in the background, since it is designed to keep a job running
- **B.** `jobs` to resume it in the background, and `kill` to bring it back — `jobs` restarts the most recently stopped job whenever it is invoked with no arguments
- **C.** `bg` to resume it in the background, and `fg` to bring it back to the foreground later
- **D.** Pressing Ctrl-C to resume it, then Ctrl-Z again to bring it forward

**Answer: C.** Ctrl-Z suspends the foreground job with SIGTSTP. `bg` sends SIGCONT and lets it continue running in the background under a job number such as `%1`; `fg` later brings that same job back to the foreground and reattaches the terminal.

- A is wrong: `nohup` only makes a process immune to the hangup signal; it does not resume a job that Ctrl-Z has stopped, and it does not background anything by itself.
- B is wrong: `jobs` only lists the current jobs; it does not change any job's state, and `kill` sends a signal rather than restoring foreground attachment.
- D is wrong: Ctrl-C sends SIGINT, which typically terminates the job rather than resuming a stopped one; Ctrl-Z only ever suspends.

### 282.

A job was started with `./long-job.sh &` over SSH and the connection later drops. The job dies along with it, even though `&` was used. What was missing?

- **A.** `nohup`, so the job is immune to the SIGHUP sent when the terminal closes
- **B.** Nothing was missing; `&` alone is sufficient to survive a dropped connection
- **C.** The job should have been started with `renice` instead of `&`
- **D.** The job needed to be registered as a systemd unit, since only PID 1 can hold a process open across a dropped connection — an unprivileged shell has no way to hand a running job off to anything that outlives it

**Answer: A.** `&` returns the prompt but the job is still the terminal session's child, so the SIGHUP sent on hangup is usually forwarded to it and kills it. `nohup` makes the command immune to that specific signal, which is the missing half of surviving a dropped SSH session.

- B is wrong: Backgrounding with `&` returns the prompt but leaves the job still attached to the shell, which is exactly what a hangup signal on disconnect can kill.
- C is wrong: `renice` adjusts scheduling priority for an already-running process; it has no bearing on whether a job survives a terminal hangup.
- D is wrong: An ordinary user keeps a background job alive across a hangup with `nohup` or `disown`; nothing about surviving SIGHUP requires the service manager or PID 1.

### 283.

A new hire needs to read and write files shared by the `developers` team without gaining a separate login of their own. Which two concepts does the fix combine?

- **A.** A group named `developers`, granting the permission once, and the user account being added as a member of it
- **B.** A second user account named `developers`, sharing its UID with every team member
- **C.** A service account created for the `developers` team so nobody needs an interactive login
- **D.** A `sudoers` rule granting the new hire root on the shared files — `/etc/sudoers` is where per-directory sharing grants are recorded, so no group is needed

**Answer: A.** A group is a named collection of users used to grant a permission once to many accounts, so the resolution is a `developers` group with the new account added as a member, rather than a new personal account or blanket root access. Membership can be confirmed afterward with `groups`.

- B is wrong: A user account is one named identity with one UID; it is not how membership in a team is modelled.
- C is wrong: A service account exists to run a daemon, not to give a person shared access to files.
- D is wrong: Root access is far broader than the stated need and bypasses the ordinary permission model rather than using it.

### 284.

An administrator needs to create a `deploy` group, remove an old `contractors` group that is no longer needed, and add an existing user to `deploy` without disturbing any group memberships that user already has. Which three commands do this?

- **A.** The same two group commands, but dropping the `a` so it reads `usermod -G deploy alice`
- **B.** Reaching for the account-management pair `useradd deploy` and `userdel contractors` before the same `usermod -aG` step
- **C.** Lower-casing the last step to `usermod -g deploy alice` while keeping the two group commands as written
- **D.** `groupadd deploy`, `groupdel contractors`, and `usermod -aG deploy alice`

**Answer: D.** `groupadd` and `groupdel` create and remove groups, and `usermod -aG` appends a supplementary group to an account without touching its existing memberships — the destructive alternative is `-G` alone, which replaces the whole list.

- A is wrong: Without `-a`, `-G` replaces the entire supplementary group list, which can silently drop every other group `alice` belonged to.
- B is wrong: Those commands create and remove user accounts rather than groups, so nothing about `deploy` or `contractors` as groups is actually built or removed.
- C is wrong: Lowercase `-g` replaces the primary group entirely rather than adding a supplementary one, which is a different change than asked for.

### 285.

A file has one hard link and one symbolic link pointing at it. The hard-linked name is deleted. What happens to the file's data, and what happens to the symlink?

- **A.** The data is deleted immediately, and the symlink becomes dangling — removing any name for a file releases its blocks at once, whatever the link count still says
- **B.** The data survives, but the symlink is automatically updated to point at the remaining name
- **C.** Both the data and the symlink are deleted together, since they share the same inode
- **D.** The data survives, since the inode's link count merely drops by one; the symlink still resolves through the surviving name

**Answer: D.** A hard link is an additional directory entry pointing at an existing inode, so deleting one name only decrements that inode's link count; the data survives as long as the count has not reached zero. The symlink, holding its own separate path, keeps working through whichever original name still resolves.

- A is wrong: unlink(2) states the file is deleted only if the removed name was the last link to it and no process still has it open; while another name survives, the data is untouched.
- B is wrong: A symlink stores a fixed path string; nothing about deleting a hard link causes the symlink's stored target to be rewritten.
- C is wrong: A symlink has its own separate inode holding a path string; it does not share an inode with the file it points to.

### 286.

A backup script tries `ln /data/report.csv /backup/report.csv` across two different mounted filesystems, and it fails. Switching to `ln -s` succeeds. Why the difference?

- **A.** A hard link refers to an inode number, meaningful only within one filesystem, so it cannot cross a filesystem boundary; a symlink stores a path and has no such restriction
- **B.** `ln` is simply broken for this use case and `ln -s` should always be preferred instead
- **C.** The destination directory must not have existed yet, which only `ln -s` tolerates
- **D.** `/backup` must be a read-only mount, which blocks `ln` but not `ln -s` — a symbolic link is recorded in the source directory rather than the destination, so a read-only target never comes into it

**Answer: A.** A hard link is a reference to an inode number, and inode numbers are meaningful only within one filesystem, so `ln` refuses to create one across a filesystem boundary. A symbolic link stores a path string instead and has no such restriction, which is why `ln -s` succeeds where `ln` does not.

- B is wrong: `ln` works correctly within a single filesystem; the failure here is specifically the cross-filesystem restriction, not a general defect.
- C is wrong: Nothing in the scenario indicates a missing destination directory; the described failure is the standard cross-filesystem restriction on hard links.
- D is wrong: Both link types create a new entry in the destination directory, so a read-only `/backup` would fail for `ln -s` just as readily; the failure described is link(2)'s EXDEV, raised when the two paths are not on the same mounted filesystem.

### 287.

Where is the superuser's home directory, and why does the FHS keep it separate from `/home`?

- **A.** `/home/root`, the same convention every other account follows — the FHS reserves a numbered subdirectory of `/home` for UID 0 exactly as it does for every other account
- **B.** `/usr/root`, since root is considered part of the shareable, static hierarchy
- **C.** There is no dedicated home directory for root; it uses `/` directly
- **D.** `/root`, kept outside `/home` so the system does not need a fallback default if `/home` — often a separate partition — fails to mount

**Answer: D.** Root's home directory is `/root`, a separate optional directory kept outside `/home`. The FHS's stated rationale is that if root's home were not stored on the root partition, the system would need a fallback default in case that location could not be found — exactly the risk `/home` carries when mounted from a separate partition that fails to come up.

- A is wrong: The FHS gives the root account its own top-level directory, section 3.14 `/root`, and reserves no subdirectory of `/home` for UID 0.
- B is wrong: FHS 4.1 states that `/usr` is shareable, read-only data that "must not be written to", which rules out any account's home directory — a place its owner writes to — being located there.
- C is wrong: Root has its own dedicated home directory, `/root`, distinct from the filesystem root `/`.

### 288.

`df -h` reports a filesystem is only half full, but creating a new file on it fails with "No space left on device." What should be checked next, and why?

- **A.** Nothing further is needed; `df -h` already proves there is no real problem and the error is spurious
- **B.** `df -i`, since the filesystem may have exhausted its inode table while data blocks remain free
- **C.** `du -sh`, to find which directory is consuming the most space
- **D.** `ls -i`, to confirm two files are not accidentally hard-linked together

**Answer: B.** The number of inodes on a filesystem is normally fixed at creation time, so a filesystem holding many tiny files can exhaust its inode table while gigabytes of data blocks remain free. `df -i` reports inode usage directly, and it is the standard next check when `df -h` shows space but writes still fail.

- A is wrong: The error is real — it just is not about blocks. Inode exhaustion is a distinct, common cause that block-usage figures alone cannot reveal.
- C is wrong: `du` totals file sizes, which is the wrong lens when the filesystem still has free space by that measure; the symptom described points at the inode table instead.
- D is wrong: Checking for shared inodes between two specific files does not explain a filesystem-wide inability to create any new file.

### 289.

Two directory entries have the same size, the same modification time, and the same content. What single check confirms they are actually the same file rather than two coincidentally identical copies?

- **A.** Comparing their filenames, since identical filenames always indicate the same underlying file
- **B.** Comparing their permission bits with `ls -l`, since identical permissions confirm identity
- **C.** Comparing their inode numbers with `ls -i`, where the same number means the same underlying file
- **D.** Comparing their paths with `findmnt`, since files on the same filesystem must be identical if their paths resolve similarly

**Answer: C.** The inode holds everything the filesystem knows about a file except its name; a directory entry is just a mapping from a name to an inode number. Two names sharing the same inode number, as reported by `ls -i`, are provably the same file rather than two files that merely look alike.

- A is wrong: A filename is only a directory entry pointing at an inode; two different files in different directories can easily share a name without being the same file.
- B is wrong: Two entirely separate files can easily share identical permission bits by coincidence; that says nothing about whether they are the same underlying file.
- D is wrong: `findmnt` reports on mounted filesystems, not on individual file identity, and nothing about path similarity establishes that two entries share an inode.

### 290.

After a crash, `journalctl -b -1` returns nothing at all, as if the previous boot never happened. What is the most likely explanation, and what confirms it?

- **A.** The journal is volatile: without `/var/log/journal` existing, it lives under `/run` and is discarded at every reboot; `journalctl --list-boots` confirms what is retained
- **B.** `journalctl` itself must be malfunctioning, since a crash should always leave some trace
- **C.** The messages must be in `/var/log/syslog` instead, since journald never captures kernel or crash messages
- **D.** `-b -1` is the wrong syntax and should instead be `-b 1` to see the previous boot — journalctl numbers boots forward from the first one ever recorded and rejects negative offsets outright

**Answer: A.** The journal is persistent only if `/var/log/journal` exists; otherwise it lives in `/run/log/journal`, which is memory-backed and discarded at every reboot. `journalctl --list-boots` shows what is actually retained, and if nothing is, that absence is itself the finding — enabling persistent storage is the first remediation.

- B is wrong: The tool is working correctly; an empty result for the previous boot is the expected behaviour of a volatile, non-persistent journal, not a fault in `journalctl`.
- C is wrong: journald does capture kernel and crash-time messages when persistent storage exists; the issue here is that persistence was never configured at all.
- D is wrong: `-b -1` is the correct syntax for the boot before the current one; the empty result is a persistence problem, not a syntax error.

### 291.

A service will not start. What is the diagnostic order across `systemctl status`, `journalctl -u <unit> -b`, and `journalctl -p err -b`?

- **A.** `journalctl -p err -b` first, since severity filtering always finds the root cause fastest regardless of scope, and narrows to the failing unit by itself
- **B.** `journalctl -u <unit> -f` first, to watch it fail live before checking anything else — `-f` replays everything the unit logged during this boot and only then begins following new entries as they arrive
- **C.** `journalctl -p err -b` alone is sufficient, and the other two commands add nothing a severity-wide sweep of the current boot has not already surfaced
- **D.** `systemctl status <unit>` for the last few lines and exit status, then `journalctl -u <unit> -b` for everything that unit logged this boot, then `journalctl -p err -b` to widen the search to any failing dependency

**Answer: D.** `systemctl status <unit>` gives the fastest read — the last few lines and exit status. `journalctl -u` narrowed to the unit and `journalctl -b` narrowed to this boot together widen to everything that unit logged this boot. `journalctl -p err` widens further still, to catch a dependency that failed first and is the real cause; `journalctl -f` is the live-following variant used while reproducing a fault in real time.

- A is wrong: Starting with a system-wide severity filter skips the fastest, most direct signal — the unit's own status and its own log entries — which usually explains the failure on its own.
- B is wrong: Following live only helps while reproducing the failure in real time; the described scenario is investigating a failure that has already occurred, for which status and boot logs come first.
- C is wrong: A severity-wide filter can miss a failure logged at a lower severity or buried among many other units' errors; the unit-specific commands narrow the search far more directly.

### 292.

A kernel package was installed an hour ago. What does `uname -r` report right now, and when does that change?

- **A.** The newly installed kernel version, since installation immediately updates the running kernel
- **B.** The distribution release rather than any kernel version, since `uname -r` reports OS release information
- **C.** The previously running kernel version — installing a package changes what is on disk, not what is running, until the machine reboots
- **D.** An error, since two kernel versions cannot coexist on disk at the same time — installing a new kernel package overwrites the previous image and its module directory

**Answer: C.** Installing a kernel package changes what is on disk — a new image under `/boot` and new modules under `/lib/modules/<version>/` — but not what is currently running. `uname -r` continues to report the previously booted kernel until the machine actually reboots into the new one.

- A is wrong: Installing a kernel package changes files under `/boot` and `/lib/modules`; it does not swap the kernel actually running in memory until the next reboot.
- B is wrong: `uname -r` reports the kernel release specifically; the distribution release is reported separately by `/etc/os-release`.
- D is wrong: Multiple kernel versions coexisting on disk is normal and expected — each has its own image and module directory, selectable from the bootloader menu.

### 293.

A server does not come back after a kernel upgrade and reboot: the GRUB menu appears and the kernel prints messages before the process stops, with no login prompt ever appearing. Which stage does that narrow the fault to?

- **A.** Firmware or the bootloader, since any boot failure should be treated as a firmware problem first
- **B.** The package manager's database, since a kernel upgrade updates package metadata
- **C.** UEFI Secure Boot, since an upgraded kernel is unsigned by default — signature verification runs only once the kernel begins starting userspace, which is exactly where this boot stopped
- **D.** After the kernel starts and before the init system finishes — the initramfs, the root filesystem, or a failing unit, rather than firmware or the bootloader

**Answer: D.** Knowing the stage order makes a boot failure diagnosable: the GRUB menu appearing rules out firmware and the bootloader, and kernel messages appearing before a stall rules out the kernel failing to start at all, narrowing the fault to the initramfs, the root filesystem, or an init-system unit — after which selecting the previous kernel is the standard first recovery step.

- A is wrong: The GRUB menu appearing and the kernel printing messages both demonstrate firmware and the bootloader worked correctly; the fault lies later in the sequence.
- B is wrong: A corrupted package database would not produce this specific symptom of the kernel printing messages and then stopping before a login prompt.
- C is wrong: A Secure Boot signature failure would typically prevent the kernel from starting at all, not let it print messages and then stall partway through initialisation.

### 294.

A huge log file is deleted by hand to free disk space, but `df -h` still reports the filesystem as full afterward. Why, and what is the correct long-term fix?

- **A.** `df -h` is simply slow to update and will reflect the freed space after a short wait
- **B.** The log must actually be compressed already, which is why deleting it did not free space
- **C.** The daemon still has the file open, so its blocks stay allocated until the descriptor closes; the fix is scheduled log rotation, not manual deletion
- **D.** The filesystem must have run out of inodes rather than blocks — removing one very large file frees the blocks it occupied but never releases the inode that indexed them

**Answer: C.** Removing a file a daemon still has open frees no space at all until that descriptor closes, which is exactly the `df`/`du` discrepancy this concept explains. The durable fix is configuring log rotation so files never grow unbounded in the first place, rather than deleting a huge log after the fact.

- A is wrong: The reported figure will not change on its own; the blocks remain allocated as long as the daemon keeps the deleted file's descriptor open, however long that is.
- B is wrong: Compression status has nothing to do with whether deleting the file frees its blocks; the cause here is an open file descriptor held by a running process.
- D is wrong: Inode exhaustion produces a distinct "No space left" symptom with free blocks still showing; this scenario describes blocks that remain allocated, consistent with a held-open deleted file.

### 295.

A daemon cannot be signalled to reopen its log file after rotation, but the log still must not grow unbounded. Which `logrotate` directive fits, and what is its cost?

- **A.** `copytruncate`, which copies the log aside and truncates the original in place — at the cost of losing whatever is written between the copy and the truncate
- **B.** `postrotate`, since it is the directive used whenever a daemon cannot be signalled — the script it runs swaps the daemon's open file descriptor from outside the process
- **C.** `compress`, since compressing the rotated file avoids needing to signal the daemon at all
- **D.** `delaycompress`, which defers the problem to the next rotation cycle instead of solving it

**Answer: A.** `copytruncate` copies the log's contents aside and truncates the original file in place, so a daemon that cannot be signalled keeps writing to the same inode without interruption — at the cost of losing anything written in the brief window between the copy and the truncate.

- B is wrong: A `postrotate` script is exactly the mechanism used to signal a daemon; it is the wrong choice for a daemon that specifically cannot be signalled.
- C is wrong: Compression controls whether old generations are stored compressed; it has no bearing on whether the daemon needs to be told to reopen its log file.
- D is wrong: logrotate(8) presents `delaycompress` as a way to avoid compressing a file a program may still be writing to; it changes only when compression happens, and leaves the daemon writing to the renamed file, so the new log stays empty and the old one keeps growing.

### 296.

An account must own a set of files and be usable as the identity a backup script runs under, but must never be usable to log in interactively. Which change accomplishes that?

- **A.** Set its login shell to `/usr/sbin/nologin`
- **B.** Lock the account's password with `passwd -l`
- **C.** Delete the account's entry from `/etc/shadow`
- **D.** Set the account's UID to a value above 60000

**Answer: A.** The login shell is the program started at login, and setting it to `/usr/sbin/nologin` is the standard way to create an account that owns files and can be used to run scheduled work but cannot be used to log in interactively. `chsh` is the ordinary command for changing which shell an account uses.

- B is wrong: Locking blocks password authentication specifically, but key-based or other authentication methods can still start an interactive shell.
- C is wrong: Removing the shadow row breaks password authentication entirely and leaves the account in an inconsistent, unsupported state.
- D is wrong: A high UID is a convention for distinguishing service accounts visually; it has no effect on whether login is possible.

### 297.

A service account's login shell was changed to `/usr/sbin/nologin` last week. Its SSH key is still listed in `authorized_keys`, and an operator runs `ssh svc@host 'systemctl status app'`. What happens?

- **A.** The command does not run, because `sshd` starts it through the account's login shell and `nologin` ignores shell options such as `-c`
- **B.** The command runs normally — `sshd` executes a single non-interactive remote command directly rather than through the account's login shell
- **C.** The connection is refused at authentication, because setting a nologin shell automatically revoked the account's authorised keys
- **D.** The command runs, because `nologin` takes effect only for accounts with a UID of 1000 or above

**Answer: A.** A nologin shell is not an account lock — it does not remove authorised keys, and key authentication still succeeds — but it is not limited to interactive sessions either. `sshd` runs a non-interactive remote command by invoking the account's login shell with `-c`, and `nologin` ignores those shell options and exits 1, so the command never runs. Restoring a real shell restores both paths at once, which is why the shell field and the key file must be reasoned about separately.

- B is wrong: A non-interactive command is handed to the account's login shell too, which is precisely why a nologin shell stops it.
- C is wrong: Changing the login shell does not touch `authorized_keys` at all; the key is still accepted, and the refusal comes later, from the shell.
- D is wrong: The nologin shell applies to whatever account it is set on; the UID range is a naming convention with no bearing on it.

### 298.

What advantage does an LVM logical volume have over a plain disk partition, which is the reason it is worth recognising for this exam?

- **A.** It is faster than a plain partition for every kind of workload — the device-mapper layer coalesces I/O so that every access path is shorter than on a raw partition
- **B.** It can be resized and can span more than one physical disk, which a plain partition cannot do
- **C.** It automatically protects data against drive failure, the way RAID does
- **D.** It removes the need for a filesystem to be created on top of it

**Answer: B.** LVM pools physical volumes into a volume group, from which logical volumes are carved out. Its one selling point over a bare partition is that a logical volume can later be grown, shrunk, or moved across several physical disks — recognition of that three-layer vocabulary (PV, VG, LV) is the LFCA-level expectation, summarised respectively by `pvs`, `vgs` and `lvs`.

- A is wrong: LVM adds a device-mapper abstraction for flexibility; lvm(8) presents it as providing capabilities beyond the physical devices, not as making storage faster, and speed is not the property being tested here.
- C is wrong: Redundancy against drive failure is what RAID provides; LVM by itself is about flexible sizing and pooling, not fault tolerance.
- D is wrong: A logical volume still needs a filesystem created on it with `mkfs`, exactly like a plain partition would.

### 299.

An administrator runs `mount /dev/sdb1 /srv/data`, but `/srv/data` already contained files. What happens to those pre-existing files?

- **A.** They are permanently deleted, since the mount overwrites the directory
- **B.** They are merged with the new filesystem's contents, showing both sets of files together
- **C.** They are hidden for as long as the mount lasts, not merged and not deleted
- **D.** Nothing changes, because a partition must be formatted before `mount` will do anything at all

**Answer: C.** Mounting attaches a filesystem into the tree at a chosen mount point. Any files that already existed at that path are hidden for as long as the mount lasts — neither merged nor deleted — and reappear once the filesystem is unmounted, which is the usual explanation for space or files that seem to have disappeared. `findmnt` reads the kernel's own view of what is currently mounted, rather than `/etc/fstab`'s stated intent.

- A is wrong: Nothing is deleted — the original contents still exist on the underlying filesystem and reappear as soon as the mount is undone.
- B is wrong: Mounting does not merge directory contents; it entirely obscures the mount point's previous contents for the duration of the mount.
- D is wrong: `/dev/sdb1` is presumed already formatted here, and even if it were not, that would produce an error rather than leaving the pre-existing files visible.

### 300.

`umount /mnt/data` fails with "target is busy." What is the correct next step, as opposed to reaching for `umount -l`?

- **A.** `umount -l` is always the correct fix for a busy target, since it forces the unmount immediately
- **B.** Use `lsof` or `fuser` to find the process holding the filesystem open, and stop or redirect it before unmounting
- **C.** Reformat the filesystem, since "busy" indicates it is corrupted — `umount` reports a target as busy only after its superblock consistency check fails
- **D.** Reboot the machine, since a busy mount cannot be resolved without a restart

**Answer: B.** `umount` fails with "target is busy" while any process holds a file open on that filesystem or has its working directory inside it. `lsof` or `fuser` names the offending process, which should be addressed directly rather than using `-l` (lazy unmount) to paper over the underlying cause.

- A is wrong: umount(8) describes `-l` as detaching the filesystem now and cleaning up references only once it is no longer busy, and warns that a reboot may be needed afterwards — it defers the problem rather than identifying the process causing it.
- C is wrong: umount(8) attributes a busy target to ordinary conditions — open files on the filesystem, a process whose working directory is there, or a swap file in use — with no consistency check involved and nothing implied about corruption.
- D is wrong: Identifying and stopping the process holding the mount open resolves this without any reboot being necessary.

### 301.

A file is `-rw-r-----`, owned by `alice` and belonging to group `staff`, of which `alice` is also a member. Can `alice` write to it?

- **A.** No, because being a member of the owning group means the more restrictive group bits apply
- **B.** Only if the `other` triad also grants write, since all three classes must agree
- **C.** No, because `alice` would need to be listed in `/etc/group` to use owner privileges
- **D.** Yes, because the kernel matches the owner class first and grants read and write there

**Answer: D.** The kernel checks owner, group, and other in that order and stops at the first class that applies. `alice` is the owner, so the owner triad (`rw-`) governs her access regardless of what the group or other triads say, as read directly from `ls -l`.

- A is wrong: Class matching stops at the first match; membership in the group does not pull a more restrictive triad in for the owner.
- B is wrong: Classes do not need to agree with one another; only the first matching class is consulted at all.
- C is wrong: Owner privilege comes from being the file's owner, not from appearing in the group's supplementary member list.

### 302.

A file is `-r--rw-rw-`. Its owner removes all permission from the `other` class, leaving `-r--rw----`. Does that change what the owner can do to the file?

- **A.** Yes, narrowing any one class tightens the effective permission for everyone
- **B.** No; removing permission from `other` never restricts the owner or group classes
- **C.** Yes, because the owner's access is always the most restrictive of the three classes
- **D.** It depends on whether the sticky bit is also set on the file

**Answer: B.** The owner is still matched by the owner triad, which was untouched by narrowing `other`. Removing access from one class narrows only that class's users; it does not tighten or loosen either of the other two.

- A is wrong: Permission classes do not combine or narrow one another; each is a self-contained answer for the users it applies to.
- C is wrong: The owner's access is whatever the owner triad states, not a function of the other two classes.
- D is wrong: The sticky bit governs deletion within a directory and has no bearing on a regular file's own read/write bits.

### 303.

A team installs a monitoring agent with the distribution's package manager, and separately runs `npm install express` inside one Node.js application. Are both operations installing "packages" in the same sense the exam means?

- **A.** Yes, both are the same kind of package, just installed by different front-end commands — `npm` records what it installs in the same system package database
- **B.** No — the OS package came from a repository and the `npm` package did not come from anywhere at all
- **C.** Yes, and the difference only matters for which command performs the removal later — the files land in the same system directories either way
- **D.** No — the monitoring agent is a system-wide OS package with dependency metadata read by the OS package manager; `npm install` resolves a library scoped to one application

**Answer: D.** A package is a distributable archive bundling software with its metadata, dependency list and install scripts, resolved by the OS package manager against the system database. Language package managers such as `npm`, `pip` and Maven resolve an application's own libraries instead, a distinct and narrower scope.

- A is wrong: They differ in scope: an OS package is recorded in the system package database and owned by the distribution, while `npm` resolves libraries for one application only and writes them into that project's own `node_modules` directory.
- B is wrong: Both are fetched from somewhere; the distinguishing factor is scope (system-wide versus one application), not whether a remote source was involved.
- C is wrong: The difference is more than a removal-command detail: it is what the software is meant to serve and whose responsibility it is. A locally installed `npm` package lands under the project's own directory, not in a system path.

### 304.

What does installing a package register that a plain tarball copied into place by hand does not?

- **A.** Nothing meaningful — a package and a tarball extracted to the same paths behave identically afterward
- **B.** An entry in a local database recording which files belong to it, so the system can answer "who owns this file" or remove it cleanly later
- **C.** A cryptographic signature that is re-checked on every subsequent boot — by the integrity service the package manager installs alongside it
- **D.** A dependency manifest inside the target application's own project directory

**Answer: B.** Installing a package registers it in a local database — dpkg's status database or the RPM database — recording which files it placed and what it depends on. That database is what later answers "which package owns this file" and lets removal be clean, neither of which a hand-copied tarball supports.

- A is wrong: The database registration is exactly the thing a manually extracted tarball lacks, which is why files copied by hand cannot be cleanly removed or queried later.
- C is wrong: Signature verification happens at install time, against the package and the repository metadata; neither `dpkg` nor `rpm` runs any boot-time service that re-checks installed files.
- D is wrong: That describes a language-level manifest for one project; an OS package registers into the system-wide package database instead.

### 305.

A disk uses the older MBR partitioning scheme. What are its two defining limits compared with GPT?

- **A.** At most four primary partitions, and a maximum disk size of roughly 2 TiB
- **B.** At most four partitions total, including logical ones, and no maximum disk size at all
- **C.** No limit on partition count, but a maximum disk size of roughly 2 TiB
- **D.** At most four primary partitions, with no size limit, since size limits belong to the filesystem type rather than the partition table

**Answer: A.** MBR is limited to four primary partitions (one of which can be an extended partition holding further logical ones) and to disks of roughly 2 TiB, both consequences of its fixed, small on-disk structure. GPT, the UEFI-era replacement, removes both limits.

- B is wrong: One of MBR's four primary slots can hold an extended partition containing further logical partitions, and MBR does impose a roughly 2 TiB size ceiling.
- C is wrong: MBR does cap primary partitions at four; the count limit is real, not absent.
- D is wrong: The 2 TiB ceiling is a property of the MBR partition table format itself, independent of whatever filesystem type is later created on a partition.

### 306.

`lsblk` shows a disk and `df -h` shows nothing for it at all, though `fdisk -l` confirms a partition exists on it. What is the most likely explanation?

- **A.** The partition table must be corrupted, since a real partition should always appear in `df`
- **B.** The partition has no filesystem on it yet — it is invisible to `df` and cannot be mounted until formatted
- **C.** The partition is mounted read-only, which hides it from `df -h` — `df` skips any filesystem it cannot write its temporary probe file to
- **D.** `lsblk` and `fdisk -l` are reporting on two different disks by coincidence

**Answer: B.** A partition with no filesystem on it is invisible to `df` and cannot be mounted, so "the disk does not show up" in `df` while `lsblk` and `fdisk -l` confirm the partition exists often means simply that it was never formatted with `mkfs`.

- A is wrong: `fdisk -l` already confirms the partition table is intact and the partition exists; the missing piece is a filesystem, not a corrupted table.
- C is wrong: `df` writes nothing at all; it reports every mounted filesystem regardless of the read-only flag, so a read-only mount appears normally with its usage shown.
- D is wrong: Nothing in the scenario suggests two different disks; the simpler and standard explanation is an unformatted partition.

### 307.

A policy requires every password to be changed at least every 90 days and to warn the user seven days beforehand. Which fields in `/etc/shadow`, changed through `chage`, enforce that?

- **A.** The minimum age field (`-m 90`) and the account expiry field (`-E 7`)
- **B.** Password complexity settings, since ageing and complexity are the same policy category
- **C.** The maximum age field (`-M 90`) and the warning period field (`-W 7`)
- **D.** The login shell field, set to a value that expires automatically after 90 days

**Answer: C.** `chage -M` sets the maximum password age and `chage -W` sets the warning period before expiry, both stored in `/etc/shadow`. Complexity requirements are a separate, unrelated policy category from ageing.

- A is wrong: Minimum age sets the earliest a password may be changed again, and expiry disables the account on a date — neither matches the stated 90-day/7-day requirement.
- B is wrong: Complexity rules govern what a password may contain; they say nothing about how often it must be changed, which is a separate policy.
- D is wrong: The login shell has no expiry behaviour of any kind; it only names the program started at login.

### 308.

A newly created account must be forced to set its own password the very first time it logs in, rather than continuing to use the temporary password an administrator assigned. Which command achieves that most directly?

- **A.** `chage -m 90 alice`, setting a 90-day minimum age
- **B.** `usermod -L alice`, locking the account
- **C.** `chsh alice`, changing the login shell — the shell field carries its own expiry timer, which is what prompts for a new password at the next login
- **D.** `passwd -e alice`, which expires the current password immediately

**Answer: D.** `passwd -e` expires an account's password immediately, which forces the user to set a new one at their next login — the direct way to retire a temporary administrator-assigned password.

- A is wrong: A minimum age controls how soon a password can be changed again; it does not force an immediate change.
- B is wrong: Locking prevents password authentication outright rather than prompting for a new password at next login.
- C is wrong: Changing the shell affects what program starts at login, not whether the password must be renewed.

### 309.

A team runs `apt upgrade -y` on every server the moment any update becomes available, with no staging tier and no rollback plan. Are they practicing patch management?

- **A.** Yes, applying updates the moment they appear is the definition of good patch management
- **B.** No — patch management is the surrounding discipline (inventory, testing, scheduled rollout, rollback), not merely running an update command
- **C.** No, because patch management applies only to security updates, not general package upgrades
- **D.** Yes, provided the updates are also logged somewhere after they are applied — that record is what turns ad-hoc updating into managed patching

**Answer: B.** Patch management is the disciplined practice around updates — inventory, tracking advisories, testing before production, applying on a schedule, and being able to roll back — not simply the act of running an update command. Applying every update immediately and untested is a change-management failure, not the practice itself.

- A is wrong: Applying every update immediately, untested, on production is a change-management failure rather than diligence — it is how a patch causes the outage it was meant to prevent.
- C is wrong: The practice applies to updates generally, though security updates are often prioritised and sometimes automated separately for exactly that reason.
- D is wrong: Logging what happened after the fact does not substitute for the testing, staged rollout and rollback plan the practice requires beforehand; NIST's definition centres on identifying, prioritising, acquiring, installing and verifying patches, not on recording them afterwards.

### 310.

A described process covers inventorying installed versions, checking CVE feeds for severity, and testing updates on a staging tier — but has no documented rollback path. What step is missing?

- **A.** Nothing is missing; inventory, severity assessment and staging testing are the complete practice
- **B.** Rollback — a way to undo a patch that turns out to cause a problem once it reaches production
- **C.** A maintenance window, since none was mentioned in the description
- **D.** An automated tool such as `unattended-upgrades`, without which the process is incomplete

**Answer: B.** The practice includes inventory, advisory tracking, staged testing, a scheduled maintenance window, and a rollback plan — a snapshot, a held previous package version, or on Red Hat systems `dnf history undo`. A process with everything but a way to undo a bad patch is missing exactly that last step.

- A is wrong: A rollback plan is part of the described discipline; without one, a patch that causes a problem in production has no defined way to be undone.
- C is wrong: A maintenance window is a real part of the practice, but the description specifically omits any mention of undoing a bad patch, which is the rollback step.
- D is wrong: Automation of routine security updates is a useful accelerant, not a required component of the underlying discipline the process is missing.

### 311.

What is PID 1, and what happens to a process whose parent has exited before it does?

- **A.** PID 1 is reserved for the kernel itself, and an orphaned process is simply terminated
- **B.** PID 1 is whichever process currently has the highest CPU priority — the kernel renumbers it whenever another process is reniced below the current holder
- **C.** An orphaned process becomes a zombie until an administrator manually reaps it
- **D.** PID 1 is the init system, the ancestor of every other process, and an orphaned process is re-parented to it

**Answer: D.** The kernel starts PID 1 first — the init system — and it becomes the ancestor of everything else. When a process's parent dies before it does, the kernel re-parents it to PID 1 rather than terminating it. `ps -ef` prints PID and PPID side by side, and `pgrep` finds PIDs by name or attribute.

- A is wrong: PID 1 is a user-space init process, not the kernel, and an orphan is re-parented rather than killed outright.
- B is wrong: PID number assignment has nothing to do with scheduling priority; PID 1 is fixed as the first process the kernel starts.
- C is wrong: Orphaning and becoming a zombie are different outcomes — an orphan is re-parented and continues running; a zombie has already exited.

### 312.

A stale monitoring script keeps a PID recorded in a file from an hour ago and sends it a signal to check on a long-running job. The signal reaches an entirely unrelated process instead. What explains this?

- **A.** PIDs are reused once a process exits, so the recorded number may now belong to a different process entirely
- **B.** PID files are guaranteed unique for the life of the machine and cannot be reused
- **C.** The script must be running inside a different PID namespace than the job it is checking
- **D.** The job's PPID must have changed, which the script failed to account for — `kill` resolves a recorded PID against its parent before deciding where to deliver the signal

**Answer: A.** PIDs identify a process only while it lives; once it exits, the kernel is free to reuse that number for something else. A PID recorded in a file and used later without checking is a well-known source of signalling the wrong process, which is why service managers prefer tracking by cgroup instead.

- B is wrong: PIDs wrap and are reused once `pid_max` is reached, and more simply, as soon as the original process exits its number becomes available again.
- C is wrong: Namespace differences change what number a process sees for itself, but nothing in this scenario describes containers or namespaces.
- D is wrong: A changed PPID would affect parentage lookups, not which process a plain PID-based signal is delivered to.

### 313.

A user belongs to `developers` as a supplementary group and `staff` as their primary group. Which group owns a file they create in their home directory with no special tooling involved?

- **A.** `developers`, because supplementary groups grant access to newly created files too
- **B.** Whichever group appears first alphabetically among the ones the user belongs to
- **C.** `staff`, because a newly created file takes the creator's primary group
- **D.** `root`, because only a privileged process can set group ownership on creation

**Answer: C.** Every user has exactly one primary group, and that is the group applied to files they create; supplementary groups only add access to files that already exist, unless a directory carries the SGID bit. `id` and `groups` both show the current membership; `usermod -g` changes the primary group, while `usermod -aG` appends a supplementary one.

- A is wrong: Supplementary groups grant access to files that already exist; they do not become the owning group of a new one.
- B is wrong: Group ownership follows the primary/supplementary distinction, not alphabetical order.
- D is wrong: An unprivileged process still creates files under its own primary group; no privilege is required for that.

### 314.

After running `usermod -G developers alice`, `alice` reports she can no longer access files under a project she previously worked on through another group. What happened?

- **A.** Her primary group was changed to `developers`, which does not affect existing file access
- **B.** `-G` without `-a` replaced her entire supplementary group list with just `developers`
- **C.** Nothing changed; supplementary group membership has no effect on file access
- **D.** The other project's group was deleted at the same time by an unrelated cleanup

**Answer: B.** `usermod -G` without `-a` silently replaces the whole supplementary group list rather than adding to it — a classic destructive mistake. `usermod -aG developers alice` would have appended `developers` while leaving her other memberships intact.

- A is wrong: `-G` affects the supplementary list, not the primary group, and either way this would not explain losing access.
- C is wrong: Supplementary groups are exactly what extend a user's access to files owned by a group other than their primary one.
- D is wrong: Nothing in the scenario describes a group being deleted, and the command given fully explains the symptom on its own.

### 315.

An administrator writes a new value to `/proc/sys/vm/swappiness` to change kernel tuning immediately. Does that change survive the next reboot?

- **A.** Yes, any write under `/proc/sys` is automatically persisted to disk — the kernel mirrors each accepted write into `/etc/sysctl.conf` as it happens
- **B.** No, and it also requires a reboot before it takes effect on the running system at all
- **C.** Yes, because `/proc/sys` entries are actually device nodes stored under `/dev`
- **D.** No — the change applies to the running kernel immediately but is lost at the next boot unless also recorded under `/etc/sysctl.d/`

**Answer: D.** Writing to `/proc/sys/vm/swappiness` changes the running kernel immediately, but the change is not persistent — it is lost at the next boot unless the same setting is also recorded in `/etc/sysctl.conf` or a file under `/etc/sysctl.d/`, which is applied at startup. Other read-only entries, such as `cat /proc/cpuinfo`, expose kernel state without any tunable to persist.

- A is wrong: `/proc` is a pseudo-filesystem generated by the kernel and writes nothing back to disk; persistence works the other way round, with `systemd-sysctl.service` reading `/etc/sysctl.d/*.conf` at boot and writing each key into `/proc/sys`.
- B is wrong: The opposite is true: the write to `/proc/sys` takes effect on the running kernel immediately, without any reboot.
- C is wrong: Device nodes live under `/dev` and represent hardware; `/proc/sys` is a distinct virtual filesystem exposing tunable kernel parameters as files.

### 316.

`ls -l /proc/1234/status` reports a file size of zero bytes, yet `cat`-ing it returns pages of readable text. Is that a sign of filesystem corruption?

- **A.** Yes, a zero-byte file that returns content when read always indicates filesystem damage
- **B.** No, but it does mean the process's inode has been exhausted — `/proc` allocates one inode per open file descriptor and drops the reported size to zero once that pool runs out
- **C.** No. Entries under `/proc` are generated by the kernel on demand, so they legitimately report zero size while still returning content when read
- **D.** Yes, and the fix is to remount the filesystem `/proc` lives on

**Answer: C.** Reading a path under `/proc` causes the kernel to generate its contents on demand, which is why such entries report a size of zero to `ls -l` yet return real data when read — an artefact of `/proc` being a virtual filesystem with no disk-backed size, not a sign of corruption.

- A is wrong: On an ordinary on-disk filesystem that mismatch would be suspicious, but `/proc` is a virtual filesystem where every entry behaves exactly this way by design.
- B is wrong: Inode exhaustion is a property of on-disk filesystems with a fixed inode table; `/proc` entries are generated by the kernel on read and consume no on-disk inodes, and the zero size is unconditional rather than a symptom of anything.
- D is wrong: Nothing about this symptom indicates a mount problem; it is the expected, permanent behaviour of every entry under `/proc`.

### 317.

An unprivileged user wants to lower the nice value of their own running batch job from 10 to 0, to give it more CPU time. Can they do it with plain `renice`?

- **A.** No — lowering a nice value requires root or `CAP_SYS_NICE`, unless the administrator has raised `RLIMIT_NICE`, which by default allows no reduction
- **B.** Yes, any user may freely move their own process's nice value in either direction
- **C.** Yes, but only using `nice` rather than `renice`, since they behave differently for this purpose
- **D.** No, because only the process's original parent may ever change its nice value — the kernel keeps the permitted nice range in the parent's task structure rather than the child's

**Answer: A.** Raising a process's own nice value — making it less demanding — is always allowed. Lowering it back down requires root or `CAP_SYS_NICE`, unless the administrator has raised the process's `RLIMIT_NICE` resource limit, which by default allows no reduction at all.

- B is wrong: Movement is asymmetric: raising is unrestricted, but lowering — even back toward a value the user held before — needs privilege by default.
- C is wrong: Both commands are subject to the same privilege rule for lowering a nice value; the restriction is not specific to one command over the other.
- D is wrong: The restriction is about privilege level, not about parentage; a sufficiently privileged unrelated user or process can lower it too.

### 318.

A batch job is niced all the way down to 19 but a database it is supposedly starving is still slow. `top` shows the machine is not CPU-bound; memory usage is very high and swap activity is heavy. Will renicing the batch job further help?

- **A.** No — nice only biases CPU scheduling, and it does nothing for memory pressure or I/O waits
- **B.** Yes, renicing always frees resources across the board for the higher-priority process
- **C.** Yes, but only if the batch job is also sent SIGSTOP first
- **D.** No, because nice values only take effect immediately after a process starts, not while it runs

**Answer: A.** Nice is a scheduling bias, not a reservation, and it affects only how CPU time is allocated when the CPU is contended. A machine that is memory-bound and swapping heavily has a different bottleneck entirely, and no amount of renicing addresses memory pressure or I/O wait.

- B is wrong: A nice value affects scheduling priority only; it has no mechanism for reclaiming memory or reducing I/O wait for any other process.
- C is wrong: Stopping the job would free some memory temporarily, but that is a different action from renicing and not what the question is asking about.
- D is wrong: `renice` is specifically designed to change the nice value of an already-running process, so timing after start is not the issue here.

### 319.

Two people log in separately and each run the same text editor program. How many processes exist, and what identifies each one uniquely?

- **A.** One process, since only one copy of the program exists on disk
- **B.** Two services, one per user session — the desktop session manager registers every editor invocation as a per-user service
- **C.** One process with two PPIDs, one for each user
- **D.** Two processes, each with its own PID — one program on disk can be running as many separate processes at once

**Answer: D.** A process is a running instance of a program: its own PID, address space, open files, and credentials. One program file can be executed many times over, producing as many independent processes, each separately identified by its PID.

- A is wrong: The file on disk is the program; each execution of it is a separate process with its own memory and PID, regardless of how many copies of the file exist.
- B is wrong: Neither invocation is managed by an init system with a restart policy, so "service" is not the right term for either.
- C is wrong: A process has exactly one parent and therefore one PPID; two independent invocations are two separate processes, not one with two parents.

### 320.

A process appears idle in a snapshot from `ps` but `top` shows it pegged at 100% CPU. Which reading is correct?

- **A.** One of the two tools must be malfunctioning, since they disagree about the same process
- **B.** `top`'s figure is always more accurate because it updates continuously
- **C.** The process must have forked a hidden child that `ps` is not counting — `ps` excludes from its CPU accounting any process it did not itself start
- **D.** Both can be correct at once — `ps` reports a total divided over the process's whole lifetime, while `top` samples over a short recent interval

**Answer: D.** `ps` reports CPU time as a share of the process's entire lifetime, while `top` reports CPU share over the interval since its last screen refresh. A process bursting briefly can look idle to the lifetime average and busy to the recent sample without either tool being wrong.

- A is wrong: Disagreement is expected and does not indicate a fault — the tools compute genuinely different statistics rather than reporting the same one two ways.
- B is wrong: Neither figure is more "accurate" than the other; they measure different things, and continuous updating does not make one the correct answer to the other's question.
- C is wrong: Nothing in the scenario suggests a fork; the discrepancy is fully explained by the different measurement windows the two tools use.

### 321.

A system needs to survive the loss of any one drive while maximising usable capacity from four drives. Which RAID level fits, and how many drives does it need at minimum?

- **A.** RAID 0, since striping across four drives gives the largest usable capacity of any option
- **B.** RAID 5, needing at least three drives and giving the capacity of all but one
- **C.** RAID 1, since mirroring is the simplest way to survive a drive failure
- **D.** RAID 10, since striping across mirrored pairs also survives the loss of any one drive

**Answer: B.** RAID 5 needs at least three drives, gives the capacity of all but one, and survives exactly one drive failure — the best capacity-to-redundancy trade-off of the options for surviving a single drive loss. RAID 6, RAID 10 and RAID 1 all trade away more capacity for additional protection.

- A is wrong: RAID 0 has no redundancy at all and loses everything if any single drive fails — it does not survive a drive loss, which the requirement specifically asks for.
- C is wrong: RAID 1 survives a drive loss but gives only the capacity of one drive regardless of how many are mirrored, which does not maximise usable capacity from four drives.
- D is wrong: RAID 10 does survive a single drive loss, but holding two copies of every block leaves only half the raw capacity usable, which is less than RAID 5's all-but-one on the same four drives.

### 322.

A team relies on a mirrored RAID 1 array and treats it as their backup strategy. An operator accidentally deletes a critical directory. What does the mirror do?

- **A.** It protects the directory, since RAID 1 keeps an independent second copy — mirrors resynchronise on a schedule rather than on every write, so the deletion has not reached the second drive yet
- **B.** It automatically preserves a prior version of the directory before the deletion, since mirrors are point-in-time
- **C.** It depends on which RAID controller is used, since some controllers block destructive commands
- **D.** It faithfully mirrors the deletion to the second drive just as quickly as any other write, so RAID alone does not recover the directory

**Answer: D.** RAID protects only against a drive failing — not against accidental deletion, corruption, or any other destructive write, all of which are mirrored or parity-protected just as faithfully as a legitimate write. That is why RAID levels are never a substitute for backups.

- A is wrong: The second drive is kept in lockstep with the first rather than independent of it, so the "protection" a backup provides against deletion is not what mirroring gives.
- B is wrong: A mirror is continuously kept current with the primary, not captured at a point in time, so there is no earlier version retained anywhere in the array.
- C is wrong: RAID operates below the filesystem, mirroring whatever writes the operating system issues; it has no awareness of whether a given write is destructive.

### 323.

A directory is `d-wx------`. Its owner has write and execute but not read. Can the owner list the directory's contents with `ls`, and can they open a file inside it by name?

- **A.** No to both, because any operation on a directory needs all three bits together
- **B.** Yes to both, because write on a directory implies read for its owner — the owner class is exempt from the directory read bit on any directory it owns
- **C.** No to listing; yes to opening a known filename, because listing needs read while traversal needs execute
- **D.** Yes to listing but no to opening a known file, since read must come before execute

**Answer: C.** On a directory, execute means "may traverse into" and is independent of read, which means "may list the entries." With `-wx` set and `r` absent, the owner can enter the directory and open a file whose name they already know, but cannot enumerate what is there with `ls`. `ls -l` and `chmod` are the ordinary tools for inspecting and changing that mode.

- A is wrong: The three bits govern separate operations on a directory; execute alone is enough to traverse into it by a known name.
- B is wrong: Write on a directory means the owner may create or delete entries; it does not grant read, which is what listing requires.
- D is wrong: This reverses the actual roles: read enables listing, execute enables traversal, and this directory has execute but not read.

### 324.

After a bulk permission change, users report they can no longer traverse into a directory tree at all, though the files inside still show read permission when named directly by another process. What is the most likely cause?

- **A.** The files themselves must have lost their write permission — a directory can only be entered when at least one file inside it is writable by the caller
- **B.** The owning group of the directories was changed to one nobody belongs to
- **C.** The directories in the tree lost their execute bit, blocking traversal even though file read bits are untouched
- **D.** The umask was changed on the server, retroactively affecting the existing tree

**Answer: C.** Traversal requires execute on every directory along the path, independent of what the files inside allow. A bulk change that strips execute from directories — a common side effect of an overly broad `chmod -R` — produces exactly this symptom.

- A is wrong: Write permission on the files controls whether their contents can be changed, not whether the directory holding them can be entered.
- B is wrong: A group change would affect the group triad's access, but the scenario describes a traversal failure consistent with a missing execute bit specifically.
- D is wrong: A umask only affects the permissions given to newly created files and directories; it cannot retroactively change an existing tree.

### 325.

A package released an hour ago is reported by the package manager as having "no installation candidate," even though it is confirmed to exist. What is the most likely explanation?

- **A.** The package genuinely does not exist yet, despite what was confirmed — `apt` queries the configured repositories live at install time
- **B.** The locally cached repository index is stale and has not been refreshed since the package was published
- **C.** The package's dependencies cannot be resolved, which is unrelated to the index
- **D.** The local package database has become corrupted and needs to be rebuilt

**Answer: B.** The client's repository index is a downloaded snapshot cached locally, refreshed only when explicitly asked. "No installation candidate" for a package known to exist is the standard symptom of a stale index rather than a missing package, and refreshing the index is the fix.

- A is wrong: The scenario states its existence was confirmed, and `apt` does not query repositories live: it works from the locally cached index that `apt update` downloads, so a stale index is the far more common explanation for 'no installation candidate'.
- C is wrong: An unresolved dependency produces a different, more specific error naming the missing requirement, not a blanket "no installation candidate."
- D is wrong: A corrupted local database of installed packages would produce errors on already-installed packages, not on finding a new one to install.

### 326.

Where does repository configuration live on a Debian-family system compared with a Red Hat-family one?

- **A.** `/etc/apt/sources.list` and `/etc/apt/sources.list.d/` on Debian-family; `.repo` files under `/etc/yum.repos.d/` on Red Hat-family
- **B.** Both families read the same `/etc/apt/sources.list` file, since the format is a Linux-wide standard
- **C.** The repository list is embedded inside each installed `.deb` or `.rpm` package itself — carried in its control metadata and read back at upgrade time
- **D.** Repository configuration lives under `/var/lib`, the same place the package database itself lives

**Answer: A.** Debian-family systems list repositories in `/etc/apt/sources.list` and files under `/etc/apt/sources.list.d/`; Red Hat-family systems use `.repo` files under `/etc/yum.repos.d/`. Knowing the family-specific location is often the fastest first step in diagnosing a repository problem.

- B is wrong: The `apt` configuration format and location are specific to the Debian family; Red Hat-family systems use `.repo` files instead.
- C is wrong: Repository configuration is separate, client-side configuration describing where packages come from; no `.deb` control field or `.rpm` header carries a repository list, and it is not read back from installed packages at upgrade time.
- D is wrong: The package database recording what is installed and the client's repository configuration are different things kept in different places.

### 327.

An administrator argues that logging in via `sudo -i` and staying in that root shell all afternoon satisfies least privilege, because `sudo` was used rather than `su`. Is that correct?

- **A.** No — an all-afternoon root shell holds the same authority either way; least privilege is about how much and how long, not which command opened it
- **B.** Yes, because `sudo` always logs individual commands, which by itself satisfies least privilege
- **C.** Yes, because `sudo` requires the administrator's own password rather than the root password
- **D.** No, but only because `sudo -i` is slower to authenticate with than `su -` — the extra policy lookup `sudo` performs is what the principle is actually measuring

**Answer: A.** Least privilege is about granting the smallest privilege sufficient for the task, for the shortest time. An all-afternoon `sudo -i` session holds full root authority for as long as `su -` would, so the choice of command does not by itself satisfy the principle.

- B is wrong: `sudo -i` opens a shell, and commands run inside it are not individually logged the way single-command invocations are — logging is not what the principle is measuring here in any case.
- C is wrong: Which password authenticates the session is a separate question from how much privilege is then held and for how long.
- D is wrong: Authentication speed has nothing to do with the least-privilege principle; the issue is the breadth and duration of access held.

### 328.

A file is `chmod 000`, owned by root. Can a process running as root read and write it despite the mode granting no bits to anyone?

- **A.** No, `000` blocks every process including root, since the mode has no bits set for any class
- **B.** Yes: root bypasses the ordinary permission check entirely, so the mode bits are irrelevant to it
- **C.** Only if root is also the file's owner, which grants an exception to the check
- **D.** Only through `sudo`, since plain root access still respects file modes — `sudo` sets an override flag on the process that a direct root login does not carry

**Answer: B.** Root is UID 0, the identity for which the kernel's ordinary permission checks are bypassed entirely. A mode of `000` blocks every other identity, but a root process is unaffected by mode bits at all — which is exactly why some distributions can ship sensitive files with no permission bits set.

- A is wrong: Root is not subject to the same check the mode bits express; it is exactly why Red Hat-family systems can ship `/etc/shadow` at `0000` and still have it work.
- C is wrong: Root's bypass does not depend on ownership of the specific file; it applies to root's access generally.
- D is wrong: A process running as root, whether reached via `sudo`, `su`, or direct login, is subject to the same kernel-level bypass.

### 329.

Under the systemd compatibility mapping, which target does SysV runlevel 5 correspond to, and which does runlevel 0 correspond to?

- **A.** Runlevel 5 maps to `graphical.target`; runlevel 0 maps to `poweroff.target`
- **B.** The pairing is reversed from that: `poweroff.target` is what 5 reaches, and `graphical.target` is what 0 reaches
- **C.** Runlevel 5 and runlevel 0 both map to `multi-user.target`, since several runlevels collapse onto it
- **D.** Neither maps to anything under systemd, since runlevels are not supported at all on modern systems

**Answer: A.** systemd documents the mapping as 0 to `poweroff.target`, 1 to `rescue.target`, 2/3/4 to `multi-user.target`, 5 to `graphical.target`, and 6 to `reboot.target`. Because three runlevels collapse onto one target, the mapping loses information and cannot be reversed cleanly.

- B is wrong: This reverses the actual mapping — 0 has always meant halt, not a graphical login state, in both the SysV and systemd schemes.
- C is wrong: Runlevels 2, 3 and 4 collapse onto `multi-user.target`, but 5 and 0 each map to their own distinct target.
- D is wrong: systemd documents an approximate compatibility mapping for every runlevel number rather than dropping support for the concept entirely.

### 330.

Runlevels are described as mutually exclusive, but targets are not. What does that structural difference mean in practice?

- **A.** It means targets are simply renamed runlevels with no real behavioural difference
- **B.** Exactly one runlevel could be active at a time under SysV init, while several systemd targets can be active simultaneously
- **C.** It means runlevels can be active simultaneously but targets cannot — which is why `systemctl isolate` exists, to enforce one target at a time
- **D.** It means only `rescue.target` and `emergency.target` can coexist with other targets

**Answer: B.** Runlevels were mutually exclusive under SysV init — the system was in exactly one at a time. Targets compose: `graphical.target` does not replace `multi-user.target`, it pulls it in, so several targets are active together. That is why the runlevel-to-target mapping is approximate rather than a straightforward rename. The `runlevel` command still prints the previous and current SysV runlevel on systems that track it.

- A is wrong: The mapping is explicitly approximate, not a rename, precisely because the exclusivity assumption behind runlevels does not hold for targets.
- C is wrong: This reverses the actual relationship; it is targets that compose and can be active together, not runlevels. `isolate` is an operation an administrator chooses to invoke, not evidence that targets are mutually exclusive by nature.
- D is wrong: Composability is not limited to those two special targets — `graphical.target` and `multi-user.target` coexist too, since one pulls in the other.

### 331.

What is the purpose of creating a dedicated service account for a web server daemon rather than running it under an administrator's own account?

- **A.** To give the daemon a personal login so a human can use it to authenticate interactively
- **B.** To grant the daemon root access automatically, since service accounts are privileged by convention
- **C.** To limit the damage a compromised daemon can do, by giving it only the privilege it needs
- **D.** To let the daemon be scheduled with `cron` instead of `systemd`

**Answer: C.** A service account is an unprivileged account created to run a daemon rather than to be logged into, so that a compromised service is confined to whatever narrow privilege that account holds instead of an administrator's full access.

- A is wrong: A service account exists to run a daemon, not to provide anyone with an interactive login.
- B is wrong: A service account is created unprivileged by design; nothing about the category grants root automatically.
- D is wrong: Which scheduler runs a job is unrelated to whether it runs under a dedicated account.

### 332.

An account has a system-range UID, a nologin shell, and no interactive password set, and it is the identity a database daemon runs under. Which term describes it, and is it automatically unprivileged?

- **A.** A service account, and yes, service accounts are unprivileged by definition
- **B.** A regular user account, since it belongs to a specific named daemon
- **C.** A group, since it is shared by every process the daemon forks — a UID in the system range is allocated out of the group namespace rather than the user namespace
- **D.** A service account — and no, its actual privilege still depends entirely on what it was granted

**Answer: D.** The description matches a service account: an unprivileged-by-intent identity for a daemon. But "unprivileged" is a design goal, not an automatic property — a service account can still be granted excessive privilege if it is configured that way.

- A is wrong: Nothing about the category enforces low privilege automatically — a poorly configured service account can hold broad access just like any other account.
- B is wrong: A regular user account is meant for a person to log into; this one is defined by running a daemon and having no interactive login.
- C is wrong: The description is of a single account with a UID and a shell, not a group with a member list.

### 333.

A process launched by hand at the shell keeps dying, and nothing restarts it. The same program launched via a systemd unit restarts automatically after a crash. What accounts for the difference?

- **A.** The unit wraps the process in a supervision policy — a service, as opposed to a bare process nobody is watching
- **B.** Nothing — a process and a service are the same object under two different names
- **C.** The systemd version must be running as a daemon while the hand-launched one is not
- **D.** The hand-launched process was niced too low to be restarted automatically — the scheduler declines to re-admit a process whose nice value sits below its control group's floor

**Answer: A.** A service is a process wrapped in a management policy: how to start it, what to do when it exits, and whether it should come back at boot. A process launched by hand has none of that definition behind it, which is why only the unit-managed copy restarts itself. `systemctl` is the control interface for units and the manager that supplies that policy.

- B is wrong: The underlying program is identical either way; what differs is whether a management layer is watching and restarting it.
- C is wrong: Both could equally detach from a terminal; the restart behaviour comes from the unit's `Restart=` policy, not from daemon status.
- D is wrong: A nice value affects CPU scheduling priority and has no bearing on whether anything restarts a process after it exits.

### 334.

A running application's configuration file has changed and it must pick up the change. Should an administrator run `systemctl restart app` or `systemctl reload app`?

- **A.** `restart`, since it is always the safer choice regardless of what changed — a restart re-reads the unit file and the application's own configuration in a single step, which reload cannot do
- **B.** `systemctl daemon-reload`, since any configuration change requires reloading the manager
- **C.** `reload`, if the application supports it, since that asks the running process to re-read its configuration without stopping it
- **D.** `systemctl enable --now app`, to apply the new configuration at the next boot

**Answer: C.** `systemctl restart` stops and starts the process, while `systemctl reload` tells the already-running process to re-read its own configuration file — the appropriate choice when only the application's configuration, not the unit definition, has changed and the daemon supports reload.

- A is wrong: Restart stops and starts the process, causing an interruption that a reload — when supported — avoids entirely for a configuration-only change.
- B is wrong: `daemon-reload` re-reads unit files, not an application's own configuration file; it would not make the running process notice the change at all.
- D is wrong: Enabling changes only boot-time activation; it does not make the currently running process re-read anything right now.

### 335.

A team wants a shared directory where every file a member creates is automatically writable by the whole team, without each person having to `chgrp` and `chmod` after every save. Which combination builds that?

- **A.** `chmod 4770 /srv/shared` alone, since setuid on a directory gives every file the owner's privileges
- **B.** `chgrp developers /srv/shared`, `chmod 2770 /srv/shared`, and a umask of `002` in members' sessions
- **C.** `chmod u+s /srv/shared`, since it runs new files with the file owner's privileges
- **D.** Adding the sticky bit to `/srv/shared` so files inherit the shared group

**Answer: B.** Setgid on a directory, set with `chmod g+s` or the numeric `2770`, makes newly created entries inherit the directory's group rather than the creator's primary group. That alone still leaves new files with whatever the umask allows, so a `002` umask is needed too, or teammates still cannot write to each other's files.

- A is wrong: Set-user-ID has no defined meaning on a directory in Linux; only setgid and the sticky bit have directory semantics.
- C is wrong: That is the setuid bit, which has no effect on a directory; the group-inheritance behaviour needed here comes from setgid.
- D is wrong: The sticky bit restricts who may delete an entry; it has no effect on which group new files inherit.

### 336.

A directory already has `chmod 2770 /srv/shared` applied for a shared team folder. Files that already existed before that change still cannot be edited by other members. What is going on?

- **A.** The setgid bit was not actually applied, since `2770` should have fixed every file in the directory
- **B.** The files need the sticky bit removed before they can be shared — clearing `S_ISVTX` is what lets a directory's group permissions propagate onto entries already inside it
- **C.** The files must individually be given the setuid bit to be shared
- **D.** Setgid inheritance applies only to entries created after the bit was set, not retroactively to existing files

**Answer: D.** Setgid on a directory affects only entries created after the bit is set; existing files keep whatever group and mode they already had. The fix for pre-existing files is a one-time `chgrp` and `chmod` pass, after which the setgid bit keeps everything new consistent going forward.

- A is wrong: The mode was applied successfully to the directory; the symptom is expected, because setgid never rewrites existing entries.
- B is wrong: The sticky bit restricts deletion, not editing, and has nothing to do with whether teammates can write to a file.
- C is wrong: Setuid on a regular file changes which identity it runs as if executed; it has no bearing on ordinary read/write sharing of data files.

### 337.

A daemon needs to shut down and should be given the chance to flush buffers, close files, and release its lock before it stops. Which signal, and which command, is the right first move?

- **A.** SIGKILL, sent with `kill -9 <pid>`, to guarantee the process actually stops
- **B.** SIGTERM, sent with plain `kill <pid>`, since it asks the process to shut down and can be caught
- **C.** SIGSTOP, to pause the process before deciding what to do next — a process flushes its buffers to disk as part of entering the stopped state
- **D.** SIGHUP, since it is the standard signal for terminating a daemon cleanly

**Answer: B.** `kill` sends SIGTERM by default, which a well-behaved daemon can catch to flush buffers, close files, and release locks before exiting. SIGKILL should be reserved for a process that does not respond, since it gives no opportunity to clean up. `killall` and `pkill` send the same signals but select processes by name or pattern rather than by PID.

- A is wrong: SIGKILL removes the process from the scheduler immediately with no chance to clean up, which is the opposite of what an orderly shutdown needs as a first move.
- C is wrong: SIGSTOP freezes the process rather than asking it to exit, and it cannot be caught or handled by the program at all.
- D is wrong: SIGHUP is conventionally used to ask a daemon to reload its configuration, not to terminate it.

### 338.

`kill -9` is sent to a process stuck reading from an unresponsive network filesystem, and the process is still there afterward. What explains this apparent failure?

- **A.** SIGKILL failed and a stronger signal such as `-15` should be tried instead — signal numbers above 9 are reserved for the kernel's own escalation path
- **B.** The process must actually be a zombie, which explains why it cannot be killed
- **C.** `kill -9` only works on processes owned by the caller, and this one must belong to another user
- **D.** The process is in uninterruptible sleep, waiting inside the kernel on I/O, and cannot be reaped until that I/O returns or times out

**Answer: D.** A process in uninterruptible sleep (state `D` in `ps`) is blocked inside a kernel call waiting on I/O and cannot respond to any signal, SIGKILL included, until that call returns. This, along with an already-dead zombie, is the standard explanation for an apparent "kill -9 did nothing" report.

- A is wrong: SIGTERM (signal 15) is weaker than SIGKILL, not stronger, and neither signal can reach a process stuck in uninterruptible sleep.
- B is wrong: A zombie has already exited and holds only a table entry; this process is still actively blocked on I/O, a different state entirely.
- C is wrong: Ownership would produce a permission error immediately, not a process that appears to survive the signal indefinitely.

### 339.

`/tmp` is world-writable, `drwxrwxrwt`. Name every party who may still delete or rename a file inside it that they do not own.

- **A.** Only the file's owner — write permission on the directory does not matter once the sticky bit is set
- **B.** Any user with write permission on the directory, since the sticky bit only affects renaming, not deletion
- **C.** The file's owner, the directory's owner, and a privileged process — nobody else
- **D.** Only a privileged process, since `/tmp` is meant to be fully protected from ordinary users

**Answer: C.** The sticky bit, set with `chmod +t`, restricts deletion and renaming inside a shared-writable directory to three parties: the file's own owner, the directory's owner, and a privileged process. Naming only "the file's owner" and forgetting the other two is the standard way this fact is gotten wrong.

- A is wrong: This is the recurring error: the directory's owner and a privileged process may also remove an entry, not the file's owner alone.
- B is wrong: The sticky bit restricts both renaming and deletion equally; it does not carve out deletion as unaffected.
- D is wrong: Ordinary users routinely delete their own files in `/tmp`; the restriction is narrower than blocking every ordinary user.

### 340.

`ls -ld /srv/scratch` shows `drwxrwxr-T`. What does the capital `T` indicate, compared to a lowercase `t`?

- **A.** The capital letter means the sticky bit is somehow "stronger" than lowercase
- **B.** It means the setgid bit is active in addition to the sticky bit
- **C.** The sticky bit is set, but other-execute is not, so the directory is untraversable by anyone outside owner and group
- **D.** It is a typo in the output and should be read as lowercase `t` — `ls` prints the flag in uppercase only when its output is not going to a terminal

**Answer: C.** In the other triad's execute position, lowercase `t` means the sticky bit is set and execute is also present; uppercase `T` means the sticky bit is set but execute is not, which — on a directory — makes it untraversable to anyone outside the owner and group, usually unintentionally.

- A is wrong: Case does not indicate strength; it indicates whether the corresponding execute bit is also present, which changes traversal rather than the protection itself.
- B is wrong: Setgid would appear as `s` or `S` in the group triad, a different position from the sticky bit shown here in the other triad.
- D is wrong: The distinction between the two cases is meaningful output, not an error, and changes what the mode string is telling you.

### 341.

An organisation wants a per-command audit trail of every administrative action, showing exactly who ran what. Should administrators be told to use `sudo` for individual commands, or `su -` for a shell?

- **A.** `su -`, since it requires the target account's own password and is therefore more accountable
- **B.** `sudo` for individual commands, which logs each invocation, while `su -` only logs the single switch to a shell
- **C.** Either is equivalent for auditing, since both ultimately grant root access — the kernel records the same audit event for either escalation path
- **D.** `sudo -i`, since it combines the audit benefit of `sudo` with a full login shell

**Answer: B.** `sudo` run per command logs what was executed and by whom, because each invocation is authenticated and recorded separately. `su -` authenticates once and hands over an entire shell, after which everything typed is anonymous within that session as far as the audit trail is concerned.

- A is wrong: Requiring the target's password authenticates the switch; it does not create a record of what is done afterward inside that shell.
- C is wrong: Holding the same privilege level does not mean the same audit trail — `sudo` scoped to commands is specifically what preserves per-action logging.
- D is wrong: `sudo -i` opens a shell just as `su -` does; commands run inside it are not individually logged the way single-command `sudo` invocations are.

### 342.

On a fresh Ubuntu installation, an administrator runs `su` to become root and it fails no matter what password is entered, even though `sudo` works fine for the same account. Why?

- **A.** Root's password is locked by default on Ubuntu, so `su` to root always fails; `sudo -i` is the intended route to a root shell instead
- **B.** The administrator has forgotten the root password and must reset it before `su` will work
- **C.** `su` requires the caller to already be a member of the `sudo` group — Ubuntu drops that membership requirement only once a root password has been set
- **D.** `su` is disabled entirely on Ubuntu and cannot be used under any circumstances

**Answer: A.** On Ubuntu, and on any Debian installation where no root password was set during setup, the root account's password is locked, so `su` to root fails regardless of what is typed. The intended route to a root shell is `sudo -i`, which authenticates with the caller's own password instead.

- B is wrong: The account is not merely forgotten — it is locked by the distribution's design, so no password will ever satisfy it until it is explicitly unlocked.
- C is wrong: `su` authenticates against the target account's own password; group membership in `sudo` is what governs whether `sudo` itself is permitted.
- D is wrong: The command is present and works to switch into any account whose password is set; only the root account specifically is locked by default.

### 343.

Why can an ordinary, unprivileged user successfully run `passwd` to change their own password, when `passwd` needs to write to `/etc/shadow`, which the user cannot open directly?

- **A.** The user's real UID temporarily becomes root's for the duration of the command — the kernel restores the caller's original real UID once `passwd` exits
- **B.** `passwd` carries the set-group-ID bit, running with the group `shadow`'s privileges
- **C.** `passwd` carries the set-user-ID bit, so it runs with the file owner's (root's) privileges rather than the caller's
- **D.** The user is temporarily added to the `sudoers` file for the duration of the command

**Answer: C.** The set-user-ID bit makes an executable run with the file owner's effective UID rather than the caller's. `passwd` is owned by root and carries this bit, which is how an ordinary user's invocation of it can write into `/etc/shadow`, a file they cannot otherwise open. Every SUID binary on a system can be enumerated with `find / -perm -4000`.

- A is wrong: SUID changes the effective UID, not the real UID; the real UID still records who actually launched the process.
- B is wrong: On Debian-family systems a shadow-group helper is one real design, but the textbook answer for `passwd` itself is the set-user-ID bit running as root.
- D is wrong: `passwd` does not consult or modify `sudoers`; its escalation comes entirely from the SUID bit on the binary itself.

### 344.

An administrator runs `chmod u+s deploy.sh` on a shell script, expecting it to run with the file owner's privileges the way a compiled SUID binary would. It does not. Why?

- **A.** Linux ignores the set-user-ID bit on interpreted scripts, so the bit is set but never takes effect
- **B.** The bit was not actually set, since `chmod u+s` silently fails on non-executable files
- **C.** The script needs the sticky bit as well before setuid takes effect
- **D.** The script must first be made SGID before SUID has any effect — a script's SGID bit is what tells the kernel the interpreter may be trusted with elevated rights

**Answer: A.** Linux deliberately ignores the set-user-ID bit on scripts: the kernel will not grant privilege to an interpreter that has not itself been verified to run safely with elevated rights. The bit can be set with `chmod u+s` and will show as `s` in `ls -l`, but it does nothing for an interpreted file.

- B is wrong: The script is executable, and `chmod u+s` succeeds on it; the bit is present, it simply has no effect for the kernel to honour on a script.
- C is wrong: The sticky bit governs deletion within a directory and has no bearing on whether setuid applies to an executable script.
- D is wrong: SUID and SGID are independent bits; neither is a prerequisite for the other to take effect on an executable.

### 345.

`free -h` shows several gigabytes of swap in use on a server that otherwise seems healthy. Is that, by itself, evidence of a memory problem?

- **A.** Yes, any non-zero swap usage means the machine needs more RAM immediately
- **B.** No — swap in use and swapping in progress are different things; pages evicted hours ago and never touched since remain "used" without indicating current trouble
- **C.** No, but only because `free -h` cannot report swap usage accurately — it reads a cached total that is refreshed only when a swap device is added or removed, so the figure it prints can be arbitrarily stale on a long-running server
- **D.** Yes, and disabling swap entirely is the correct fix for a machine under any memory pressure

**Answer: B.** Swap usage is a diagnostic signal that is easy to misread. Some swap in use is normal, since the kernel evicts genuinely idle pages to free RAM for cache; what actually indicates trouble is a high rate of swap-in and swap-out happening now, which `free`'s repeated sampling (`-s`) shows better than a single snapshot.

- A is wrong: Some swap usage is normal — the kernel pages out genuinely idle memory to free RAM for cache — and does not by itself indicate a shortage.
- C is wrong: free(1) reports swap from SwapTotal and SwapFree in `/proc/meminfo`, which the kernel keeps current on every read; the difficulty is interpreting a non-zero figure, not the accuracy of the tool.
- D is wrong: Disabling swap does not remove memory pressure; it converts a slow, swapping system into one where the kernel's out-of-memory killer terminates a process instead.

### 346.

A newly created swap partition has been prepared but `swapon --show` lists nothing active, and `swapon /dev/sdb2` reports an error. What step was most likely skipped?

- **A.** The partition needs to be formatted with `mkfs -t ext4` before it can be used as swap
- **B.** An `/etc/fstab` entry must exist before `swapon` will activate any device at all
- **C.** The partition must first be added to a volume group before it can hold swap — `mkswap` refuses to write its signature to anything that is not a logical volume
- **D.** `mkswap` was never run on the device, so it has no swap signature for `swapon` to activate

**Answer: D.** Swap space is created with `mkswap`, which writes the signature `swapon` looks for, and only then activated with `swapon`. Running `swapon` on a partition that was never prepared with `mkswap` fails because there is no swap signature there for it to recognise.

- A is wrong: Swap space is not a regular filesystem and is not created with `mkfs`; it is prepared specifically with `mkswap`.
- B is wrong: A device can be activated directly with `swapon <device>` without any fstab entry; the entry is only needed for it to activate automatically at boot.
- C is wrong: mkswap(8) documents its device argument as "usually a disk partition (something like /dev/sdb7) but can also be a file"; no volume group is involved at any point.

### 347.

A file is `rwxr-xr-x` with the setgid bit already set for a shared workflow. An administrator must add write for the group without disturbing anything else, including the setgid bit. Which command is safe?

- **A.** `chmod 775 file`, since 775 already includes group write
- **B.** `umask 002` applied before the next write to the file — the mask is re-applied to a file's mode on every write, so the next write widens the group bits
- **C.** `chmod g+w file`, a symbolic clause that changes only the named bit
- **D.** `chmod -R g+w file`, adding the recursive flag for safety

**Answer: C.** Symbolic mode expresses a relative change: `g+w` adds exactly the group-write bit and leaves the rest, including the setgid special bit, untouched. A three-digit numeric mode like `775` is absolute and always clears the setuid/setgid/sticky digit unless it is explicitly included — both are forms of the same `chmod` command, and the notation chosen changes what survives.

- A is wrong: A three-digit numeric mode is absolute and rewrites all nine permission bits; on a regular file such as this one the omitted leading digit is taken as zero, silently dropping the setgid bit.
- B is wrong: A umask only affects permissions assigned to files created afterward; it has no effect on a file that already exists.
- D is wrong: Recursion is unnecessary and potentially harmful on a single file; the target here is one file, not a tree.

### 348.

An administrator runs `chmod -R 755` over a project tree that contained several setgid directories and one setgid helper binary. Which special bits survive?

- **A.** Every special bit is cleared, on the directories and on the binary alike — an omitted leading digit is treated as zero, and that applies uniformly to every kind of file the recursion reaches
- **B.** The directories keep their setgid bit but the helper binary loses its, because `chmod` preserves that bit on directories unless told otherwise
- **C.** Every special bit survives, because a three-digit numeric mode addresses only the owner, group and other triads and never touches the leading digit at all
- **D.** Only the sticky bit is affected — setuid and setgid live outside the mode word, in the inode's extended attributes

**Answer: B.** A three-digit octal mode is absolute and an omitted digit counts as a leading zero, so `chmod 755` clears setuid, setgid and sticky on a **regular file**. Directories are the exception worth memorising: `chmod` preserves a directory's set-user-ID and set-group-ID bits unless told otherwise, so a recursive `chmod 755` leaves setgid directories inheriting the shared group exactly as before. Clearing a directory's special bits numerically requires an explicit leading zero (`00755`), a leading minus (`-6000`) or a leading equals (`=755`); symbolically it is `g-s`.

- A is wrong: True of the regular file, but not of the directories; clearing a directory's setgid numerically takes an explicit `00755`, `-6000` or `=755`.
- C is wrong: The three-digit form does clear the special bits on a regular file, which is why the helper binary comes out of this with its setgid bit gone.
- D is wrong: All three special bits sit in the same mode word as the nine permission bits, as the leading octal digit of `stat -c %a`.

### 349.

A filter is set to capture severity level 3 (Error) and above. Does it also capture Warning-level messages?

- **A.** Yes, "level 3 and above" naturally includes Warning since it feels like a lesser problem than Error
- **B.** It depends on the facility the message was logged under, not the severity level — a severity filter matches only messages carrying the daemon facility
- **C.** No — severity 3 and above means levels 3, 2, 1 and 0, and Warning is level 4, a less severe level than 3
- **D.** Yes, because syslog severities count upward from least to most severe starting at 1

**Answer: C.** Syslog severity runs from Emergency (0) as most severe down to Debug (7) as least severe — the numbering is inverted from intuition. Filtering to "level 3 and above" in severity means 3, 2, 1 and 0 (Error through Emergency), which does not include Warning at level 4.

- A is wrong: Numerically, Warning (4) is a higher number than Error (3), and on this inverted scale a higher number is less severe, so it falls outside the filter.
- B is wrong: Facility identifies the source subsystem and is a separate dimension from severity; it does not change whether a given severity number is captured by this filter.
- D is wrong: The scale starts at 0 for Emergency, the most severe level, and counts upward toward less severe levels, the opposite of what this option describes.

### 350.

A badly behaved application logs routine, harmless status messages at Error severity. What is the consequence for a monitoring filter tuned to alert on Error and above?

- **A.** Nothing changes, since the logging system automatically re-classifies mislabelled messages — the severity is recomputed from the message text as it is written to the log
- **B.** The messages are silently dropped, since Error severity from a non-critical process is filtered out by default
- **C.** It floods the filter with false alarms, because severity is a claim by the emitting program, not an assessment by the logging system
- **D.** The facility field automatically corrects the severity based on which subsystem is logging

**Answer: C.** Severity is set by whichever program emits the message, not assessed independently by the logging system. A badly behaved application logging routine chatter at Error level floods any filter tuned to catch real problems at that severity, since the system has no mechanism to override the emitter's own claim.

- A is wrong: No such automatic re-classification happens; the logging system records whatever severity the emitting program attaches to a message.
- B is wrong: There is no default behaviour that drops messages based on which process emitted them; the messages pass through at the severity the application chose.
- D is wrong: Facility identifies the source subsystem and is independent of severity; it does not adjust or override the severity a message carries.

### 351.

A requirement states a service must both be running right now and still be running after every future reboot. Which single command satisfies both halves in one step?

- **A.** `systemctl start nginx` alone, since a successful start implies it will also come back after a reboot
- **B.** `systemctl enable nginx` alone, since enabling a unit also starts it immediately — the manager reload that `enable` performs activates it
- **C.** `systemctl daemon-reload nginx`, since reloading applies both the running and boot-time state
- **D.** `systemctl enable --now nginx`, enabling the boot-time symlink and starting it immediately in one step

**Answer: D.** `systemctl start` and `systemctl enable` are orthogonal: one affects the running system now, the other affects the next boot, and neither implies the other. `systemctl enable --now` is exactly the shorthand for doing both in a single command.

- A is wrong: Starting acts on the running system only and consults nothing about the next boot — a started-but-not-enabled service is simply absent after a reboot.
- B is wrong: `enable` only creates the boot-time symlink from `[Install]`. It does reload the manager configuration afterwards so the new symlink takes effect, but systemctl(1) is explicit that this 'does not have the effect of also starting any of the units being enabled'.
- C is wrong: `daemon-reload` takes no unit argument and only re-reads unit files; it neither starts a unit nor changes its boot-time activation.

### 352.

A service that was working fine for months is simply absent after an unrelated reboot — no crash, no error, nothing in the logs about it at all. What is the first command to run, and what does a result of `disabled` tell you?

- **A.** `systemctl is-active <unit>`, since an inactive result would explain why it is gone after reboot — it reports the boot-time enablement state alongside the current one
- **B.** `systemctl is-enabled <unit>`; a result of `disabled` is the entire explanation — the unit was configured and started by hand but never enabled
- **C.** `journalctl -u <unit> -b`, since a missing service always leaves an error explaining why it failed to start
- **D.** `systemctl daemon-reload`, since re-reading unit files restores services that vanished after a reboot

**Answer: B.** "The service is gone after a reboot" is diagnosed by checking `systemctl is-enabled <unit>` first. A reply of `disabled` fully explains the symptom: the service was started manually at some point and worked until the next reboot, at which point nothing pulled it back in because it was never enabled.

- A is wrong: Checking whether it is active now says nothing about why it failed to come back, and `is-active` reports only whether the unit is running; the boot-time question is answered by `is-enabled`.
- C is wrong: A unit that was simply never enabled produces no failure at all — there is nothing in the logs to find, because the unit was never even asked to start.
- D is wrong: Re-reading unit files has no bearing on whether a unit's boot-time symlink exists; it neither creates nor removes that state.

### 353.

A server needs to boot into a minimal, non-graphical state permanently from now on, not just for the next boot. Which command sets that as the standing default?

- **A.** `systemctl set-default multi-user.target`, rewriting the standing default target
- **B.** `systemctl isolate multi-user.target`, since isolating a target makes it the new default
- **C.** `systemctl get-default multi-user.target`, since it sets the target it is given
- **D.** `runlevel 3`, the SysV-era equivalent of the same request

**Answer: A.** `default.target` is a symlink naming where boot converges, and `systemctl set-default` rewrites it — a change that persists across every future boot. `systemctl get-default` reads the current setting, and `isolate` changes the running system immediately but leaves the standing default untouched.

- B is wrong: `isolate` only changes the running system right now; it does nothing about which target the next boot converges on.
- C is wrong: `get-default` only reads and prints the current default; it takes no target argument to change anything.
- D is wrong: `runlevel` only prints the previous and current SysV runlevel; it does not set anything, on this system or any other.

### 354.

To troubleshoot a graphical login failure right now, an administrator proposes `systemctl isolate rescue.target` on a production server that is currently serving traffic. What happens to units that `rescue.target` does not want?

- **A.** Nothing changes for them; `isolate` only affects graphical-session units — `rescue.target` sets `IgnoreOnIsolate=yes` for everything outside that group
- **B.** They are only stopped after the next reboot, since `isolate` schedules rather than acts immediately
- **C.** They are stopped immediately, which is disruptive on a live production server and should be done deliberately, not casually
- **D.** They are paused rather than stopped, and resume automatically once `default.target` is restored

**Answer: C.** `systemctl isolate` switches to a target immediately, starting what it wants and stopping every unit that is not part of it — on a running production server that stops real services, which is precisely why it is a disruptive command to reach for casually rather than the safer, non-immediate `set-default`.

- A is wrong: `isolate` is not scoped to graphical units: it stops every currently running unit the named target does not want, which can include production services. `IgnoreOnIsolate=` is set on the individual units that are to be spared, not by the target being isolated to.
- B is wrong: `isolate` acts on the running system immediately; it is `set-default` that only affects a future boot.
- D is wrong: `isolate` stops units outright rather than pausing them; nothing about the operation is reversible on its own.

### 355.

An administrator enables `backup.service` directly, expecting it to run on a schedule the way a cron job would. What actually happens?

- **A.** The service runs on the schedule defined by `OnCalendar=` in the paired `.timer` unit, since they are linked automatically
- **B.** Nothing happens, since `.service` units cannot be enabled without a crontab entry pointing at them
- **C.** The service is rejected by `systemctl` because it has no `OnCalendar=` directive of its own
- **D.** The service starts at every boot, which is not a schedule at all; the `.timer` unit is what needed to be enabled instead

**Answer: D.** A timer unit is paired by name with a service unit it activates on a schedule. Enabling the service instead of the timer is the standard mistake: it makes the job run at every boot, which is not a schedule — the timer, not the service, is what must be enabled to get scheduled activation. `systemctl list-timers` shows every timer with its next and last activation.

- A is wrong: Enabling the service does not consult the timer's schedule at all; only enabling the `.timer` unit itself causes activation on that schedule.
- B is wrong: A `.service` unit can be enabled on its own perfectly well; the issue is that doing so only activates it at boot, not on any recurring schedule.
- C is wrong: `OnCalendar=` belongs to the `.timer` unit, not the `.service` unit; a service unit is not expected to carry that directive and enabling it does not fail for lacking one.

### 356.

Name two advantages a systemd timer has over plain cron for a scheduled job.

- **A.** Timers are simpler to write than crontab lines, and they require no separate unit file
- **B.** Timers run with a full interactive shell environment, unlike cron — the service a timer activates is started from a login shell that sources the user's profile
- **C.** Output is captured in the queryable journal rather than mailed, and a missed run can be made up with `Persistent=true`
- **D.** Timers can run system-wide scripts, while cron is restricted to per-user jobs only — every crontab lives in a per-user spool file and cron has no system-wide table

**Answer: C.** Because a timer activates a real systemd service rather than handing a command to a shell, it inherits the manager's features automatically: output captured in the journal (queryable with `journalctl -u`), full dependency ordering, and — with `Persistent=true` — the ability to catch up on a run missed while the machine was off.

- A is wrong: A timer requires a separate `.timer` unit paired with a `.service` unit — genuinely more moving parts than a single crontab line, not fewer.
- B is wrong: The examinable advantages are journal logging, dependency handling and catch-up behaviour — a full interactive environment is not one of them.
- D is wrong: System-wide scheduled jobs exist under plain cron too, via `/etc/crontab` and `/etc/cron.d/`; that is not a capability unique to timers.

### 357.

Someone says "systemd" and "`systemctl`" as if they were interchangeable. What is the actual relationship?

- **A.** They are two names for the same running process, used interchangeably by convention
- **B.** `systemctl` is the older SysV name for what became systemd — kept on modern systems only as the `/sbin/init` compatibility symlink
- **C.** systemd only manages boot; `systemctl` is the separate tool that manages running services
- **D.** systemd is the manager process running as PID 1; `systemctl` is the client command used to control it

**Answer: D.** systemd is the init system and service manager, running as PID 1 for the life of the machine. `systemctl` is the command-line client used to query and control it. Conflating the manager with the tool used to talk to it is a common but avoidable mix-up.

- A is wrong: Only systemd itself runs as PID 1; `systemctl` is a separate, short-lived command invoked each time it is run.
- B is wrong: The older SysV-era mechanism is runlevels and `init`, not `systemctl`, which is a systemd-specific control command; the `/sbin/init` symlink points at systemd itself, not at `systemctl`.
- C is wrong: systemd itself supervises services throughout the machine's life, not only at boot; `systemctl` is simply how it is instructed either way.

### 358.

`systemd-analyze blame` names a unit that took 40 seconds to initialise during a slow boot. Is that unit necessarily the cause of the slow boot?

- **A.** Not necessarily — `blame` ranks duration, not delay; `systemd-analyze critical-chain` shows what actually held boot up
- **B.** Yes, the slowest unit in `blame`'s output is always what delayed the boot — `blame` reports only the units that sat on the critical chain
- **C.** No, because `blame` only measures time before the kernel finishes loading
- **D.** No, because `blame` requires `daemon-reload` to be run first to produce accurate figures

**Answer: A.** systemd activates units in parallel wherever the dependency graph allows, so `blame`'s ranking by duration does not show what was actually on the critical path. `systemd-analyze` alone reports the total boot time split by phase, and `systemd-analyze critical-chain` follows the ordering chain that determined when boot actually converged.

- B is wrong: Because units start in parallel wherever dependencies allow, the slowest individual unit is not automatically the one that held up the critical path; `blame` ranks every unit by its own initialisation time and does not restrict its output to the critical chain.
- C is wrong: `blame` measures each unit's own initialisation time during userspace startup, not a kernel-only phase.
- D is wrong: `blame` reads recorded startup timing from the completed boot; it has no dependency on `daemon-reload` being run beforehand.

### 359.

What does the FHS say a program may assume about the contents of `/tmp` between two separate invocations?

- **A.** That files it wrote there will still be present the next time it runs
- **B.** That files it wrote there are automatically backed up, since `/tmp` is world-writable
- **C.** Nothing, because programs must not assume anything left there is preserved between invocations
- **D.** That files it wrote there will survive a reboot, unlike `/var/tmp` — which the FHS designates as the volatile counterpart, cleared at every system boot

**Answer: C.** The FHS is explicit that programs must not assume anything in `/tmp` is preserved between invocations, and on most systems it is cleared on reboot or aged out by a cleanup service — `/var/tmp` is the FHS location for temporary data that must survive a reboot instead.

- A is wrong: That assumption is exactly what the FHS says a program must not make about `/tmp`, whose contents are treated as disposable.
- B is wrong: World-writable and backed-up are unrelated properties; nothing about `/tmp` implies any backup guarantee.
- D is wrong: The FHS assigns those roles the other way round: section 5.15 is titled "/var/tmp : Temporary files preserved between system reboots" and requires that its contents "must not be deleted when the system is booted", while it is `/tmp` whose deletion at boot is recommended.

### 360.

Two accounts are created with different usernames but the administrator accidentally assigns them the same UID. What does the kernel treat them as, for permission purposes?

- **A.** Two separate identities, because the account name is what the kernel checks
- **B.** Two separate identities, because each has its own entry in `/etc/passwd`
- **C.** The same identity, since the kernel enforces access by the numeric UID, not by the account name
- **D.** Two separate identities, distinguished by their primary group instead — when two rows share a UID the kernel falls back to the GID field to tell the accounts apart

**Answer: C.** UID 0 is root regardless of what any account sharing it is called, and more generally the kernel checks the number rather than the name. Two accounts sharing a UID are indistinguishable to every permission check the kernel makes, even though `/etc/passwd` lists them as separate rows. `id` is the command that prints the UID and GID actually in force for a given account.

- A is wrong: The name is a convenience for humans; the number is what the kernel actually enforces access against.
- B is wrong: A distinct row in the account database does not create a distinct identity if the numeric UID field is shared.
- D is wrong: The primary group affects new files created, not whose identity a process runs as.

### 361.

With `umask 022` in effect, what mode does a newly created regular file receive, given that programs typically request `0666` for a new file?

- **A.** `022`, because the umask is applied directly as the resulting mode
- **B.** `755`, the same result `chmod 755` would produce on the file — a umask is applied as the complement of the mode a program requests, so `022` yields `755`
- **C.** `666`, since a umask only affects directories, not regular files
- **D.** `644`, because the umask subtracts write for group and other from the requested `666`

**Answer: D.** A umask subtracts bits from the mode a program requests when creating a file. Programs conventionally request `0666` for a regular file, and a umask of `022` removes write from group and other, leaving `644`. The umask cannot grant permission — only remove it. The `umask` command reports or sets the current mask for a shell session.

- A is wrong: A umask is a mask of bits to remove, not the mode itself — it never becomes the file's permissions verbatim.
- B is wrong: A umask acts on future file creation and subtracts bits; `chmod 755` is an absolute, present-tense change to an existing file — the two are not interchangeable.
- C is wrong: A umask affects both files and directories created afterward; regular files are not exempt from it.

### 362.

An administrator wants to see the effective configuration of `nginx.service`, including any override applied through a drop-in file, rather than only the distribution-shipped definition. Which command shows that?

- **A.** Reading `/usr/lib/systemd/system/nginx.service` directly is sufficient, since that is where the definitive file lives
- **B.** `systemctl cat nginx.service`, which prints the vendor unit plus every applicable drop-in, each labelled with its path
- **C.** `systemctl list-units --type=service`, which lists every loaded service unit — each row naming the drop-ins currently applied to it
- **D.** `systemctl daemon-reload`, which prints the current unit definitions as it reloads them

**Answer: B.** `systemctl cat` prints the effective unit file plus every drop-in that applies to it, with each file's path shown as a comment — the way to see what is actually in effect rather than only the vendor-shipped definition under `/usr/lib/systemd/system`. `systemctl list-units` instead lists units currently loaded, not any single unit's file contents.

- A is wrong: That path holds only the distribution-shipped definition; an `/etc/systemd/system` override or a drop-in changing behaviour would not be visible there.
- C is wrong: That command lists which units are currently loaded, with their load, active and sub states and a description; it prints neither one unit's configuration nor any drop-in path.
- D is wrong: That command re-reads unit files and rebuilds the dependency graph; it does not print the unit's contents to the terminal.

### 363.

On a Debian-family system, which command actually installs newer versions of software already on the machine: `apt update` or `apt upgrade`?

- **A.** `apt update`, since "update" is the word that implies bringing software up to date
- **B.** `apt upgrade`; `apt update` only refreshes the cached repository indexes and installs nothing
- **C.** Both do the same thing, and either one may be used interchangeably — `apt upgrade` refreshes the index itself before it upgrades anything
- **D.** `apt full-upgrade`, since only the "full" variant actually installs anything

**Answer: B.** `apt update` downloads and rewrites the local repository index only; nothing on the system changes. `apt upgrade` then compares installed versions against that cache and installs newer ones — the word "update" is the trap, since it does not update any software.

- A is wrong: The name is exactly the trap here: `apt update` downloads index files only and changes nothing about installed software.
- C is wrong: They are two different operations with different effects. `apt upgrade` installs from the index exactly as it already stands and does not refresh it first, which is why `apt update` has to be run separately.
- D is wrong: `apt upgrade` already installs newer versions; `full-upgrade` is a variant that is additionally permitted to remove packages to complete the upgrade.

### 364.

A contractor needs a new Linux account for a six-month engagement. An administrator must create it, confirm the UID the system assigned it, and be ready to remove it entirely once the contract ends. Which sequence of commands does this?

- **A.** Starting from `usermod`, on the belief that it can both create a fresh account and later adjust it, then finishing with `id` and `userdel`
- **B.** `useradd` to create the account, `id` to confirm the UID it was assigned, and `userdel` to remove it once the engagement ends
- **C.** The same `useradd` and `userdel` pair, but checking the assigned UID with `whoami` in between
- **D.** Managing the whole lifecycle with `groupadd` and `groupdel` instead, still checking the UID with `id`

**Answer: B.** A named identity is created with `useradd`, its assigned UID is confirmed with `id`, and it is removed with `userdel` once no longer needed. `usermod` changes an existing account rather than creating one, and `whoami` reports the caller rather than a named account.

- A is wrong: A common slip: `usermod` only changes an account that already exists, so nothing is created by reaching for it first.
- C is wrong: `whoami` reports the identity of whoever is running the command, not the UID of the account just created.
- D is wrong: That pair manages a group, not a user account, so nothing about the contractor's login is created at all.

### 365.

Why does software compiled from source conventionally install into `/usr/local/bin` rather than `/usr/bin`?

- **A.** Because `/usr/bin` is read-only at the filesystem level and cannot accept new files at all
- **B.** Because `/usr/local/bin` is searched earlier in `$PATH` on every distribution by default
- **C.** Because the package manager owns everything under `/usr` except `/usr/local`, and installing there avoids being silently overwritten
- **D.** Because `/usr/bin` is reserved exclusively for binaries shipped with the kernel itself — the FHS lists it among the directories that must hold nothing outside the base kernel image

**Answer: C.** `/usr` is shareable and static, and package managers own everything under it except `/usr/local`, which is left alone for the local administrator. That division is exactly why software built from source conventionally installs into `/usr/local/bin` rather than risking a package update overwriting it.

- A is wrong: `/usr` being "read-only" describes the FHS convention that nothing there should change during normal operation, not a hard filesystem-level write restriction.
- B is wrong: `$PATH` ordering is a separate configuration choice and is not the reason the FHS reserves this subtree for locally built software.
- D is wrong: FHS 4.4 titles `/usr/bin` "Most user commands"; it holds ordinary user-land programs installed by the distribution's package manager and is not tied to the kernel.

### 366.

An administrator is following a live tail of a busy log with `tail -f` when the log gets rotated by `logrotate` and renamed aside. New entries stop appearing. Which command survives rotation, and why?

- **A.** `tail -f` should already handle rotation correctly, since it is designed to follow a growing log
- **B.** `less +F`, since only `less` supports following a log across rotation — its F command reopens the file by name as soon as the inode behind it changes
- **C.** `tail -F`, because it follows the file by name and reopens it after a rename, rather than staying attached to the old inode
- **D.** Neither survives rotation; the session must be restarted manually every time a log rotates

**Answer: C.** `tail -f` follows the specific file descriptor it opened, which after rotation still points at the old, now-static file under its renamed path. `tail -F` follows the *name* instead, reopening the newly created file once rotation replaces it — the option that keeps working across a rotation.

- A is wrong: `-f` stays with the original inode it opened, which is exactly what stops updating the moment the log is rotated away under a new name.
- B is wrong: less(1) says the F command behaves similarly to `tail -f`, and that without `--follow-name` less keeps displaying the original file when it is renamed; the option that specifically reopens by name is `tail -F`.
- D is wrong: `tail -F` is specifically designed to survive rotation by reopening the file under its name, so a manual restart is not required.

### 367.

A service on the host stops writing its logs and refuses to start, while every other service on the machine keeps working normally. What is the first thing to check?

- **A.** Whether `/usr` has filled up, since that is where the service's program files live
- **B.** Whether `/etc` has filled up, since that is where the service's configuration lives
- **C.** Whether the service's home directory under `/home` has filled up — daemons keep their spool and state files in the home directory of the account they run as
- **D.** Whether `/var` (or the log directory under it) has filled up, since a full `/var` is one of the most common causes of exactly this symptom

**Answer: D.** `/var` holds variable data — logs, spools, caches, application state — that grows while the system runs, and it is frequently its own partition. A full `/var` is a very common cause of service failure, and it fails in the characteristic way described: writes fail while the rest of the system keeps working.

- A is wrong: `/usr` is read-only and static under normal operation; it is `/var`, holding variable data such as logs, that characteristically fills and causes this symptom.
- B is wrong: Configuration files are small and static; `/etc` filling up is not the characteristic cause of a service failing to write its logs.
- C is wrong: A service typically has no meaningful presence under `/home`; the FHS places spool directories, logging data and application state under `/var`, which is where a daemon's growing files actually live.

### 368.

`ps` shows a process as `defunct`. What state is it in, and does sending it `kill -9` clear it?

- **A.** It is an orphan whose parent has died, and `kill -9` forces it to exit properly — an orphan keeps its terminal attachment until something signals it
- **B.** It is a daemon that has lost its controlling terminal, and `kill -9` restarts it cleanly
- **C.** It is a zombie — already exited, waiting for its parent to reap its status — and `kill -9` does nothing to it
- **D.** It is a process stuck in uninterruptible sleep, and `kill -9` will eventually succeed once I/O completes

**Answer: C.** A zombie has already exited but its parent has not yet read its exit status, so its process-table entry lingers, shown as `defunct` in `ps`. It consumes no CPU or memory and cannot be killed because it is already dead — the fix is to have the parent reap it, or wait for PID 1 to do so once the parent itself exits.

- A is wrong: An orphan is still running and has simply been re-parented to PID 1; a `defunct` entry specifically describes a zombie, which has already exited.
- B is wrong: A daemon that has detached from its terminal is running normally; `defunct` specifically marks a process that has already exited.
- D is wrong: Uninterruptible sleep is a different, still-alive state waiting on I/O; a `defunct` entry means the process has already exited.

### 369.

A client gets "connection refused" reaching an internal API on its normal port. `systemctl status` on the server confirms the service is active. What do you check next, and what does its Local Address column rule out or confirm?

- **A.** `dig` against the service name, since a stale DNS answer somewhere in the resolution chain would explain a refusal like this.
- **B.** `ss -tulpn`. If it shows the socket bound to `127.0.0.1` rather than `0.0.0.0`, that explains a refusal from every remote client without any firewall rule being involved.
- **C.** Nothing further — "connection refused" from a client always means the service itself is down on the server side.
- **D.** `ls -ld` on the socket file itself, checking for a permissions problem that might be blocking the connection.

**Answer: B.** The layers of a connection failure are separately testable, and `ss -tulpn`'s Local Address column is the highest-value command once the process is confirmed running: `127.0.0.1` accepts only local clients while `0.0.0.0` accepts any, and that single field explains "works locally, fails remotely" without touching the firewall.

- A is wrong: A stale DNS answer typically produces a timeout against the wrong host, not an active refusal from a host that is confirmed running the service.
- C is wrong: `systemctl status` already confirmed the service is active, so "the service is down" is a conclusion the evidence has already ruled out.
- D is wrong: A TCP connection refusal is a network-layer response, not a filesystem permission fault, so a directory's mode bits are not the relevant evidence here.

### 370.

By IP address the API answers with an HTTP 502; by hostname the client hangs until it times out. What do these two results establish separately?

- **A.** Both results point at one firewall rule in the network path between the client and the server, since a rule that silently drops packets addressed by name while mangling those addressed by IP would produce a slow failure in the first case and an error status in the second.
- **B.** The 502 from `curl -v` against the IP proves the connection completed and an HTTP response came back, so the fault is above the transport layers; the timeout by name is resolution, which `dig` isolates.
- **C.** Restart the service immediately, since a 502 response always means the backend process itself has crashed outright.
- **D.** The delay seen only when connecting by name indicates the host itself is CPU-saturated and slow to respond generally.

**Answer: B.** `curl -v` distinguishes "never connected" from "connected and got an HTTP error" by showing the connection steps separately; a 502 by IP rules out every layer beneath the application. The hang by hostname is a different failure entirely, and `dig` and `ping` against the name versus the IP is how it gets confined to resolution.

- A is wrong: A 502 is a completed HTTP exchange, not a network failure, so it cannot share a cause with a connection that never completes at all.
- C is wrong: A 502 proves the TCP connection succeeded and the server responded; the process is running, it's simply returning an error status, which is not evidence of a crash.
- D is wrong: The IP-based test already showed the host responding promptly, so a name-based hang implicates resolution timing, not host CPU load.

### 371.

A system that worked yesterday fails today. The team insists nothing changed. How should that claim be treated?

- **A.** As irrelevant — skip it entirely and go straight to reproducing the fault instead of chasing down a change that may not even exist.
- **B.** As unlikely to be literally true, since certificate expiry, log growth filling a disk, a scheduled job, or an unattended upgrade can each alter behaviour with no deliberate human action.
- **C.** As a reason to skip straight to the journal instead, since a component's own log always names the underlying cause directly and completely.
- **D.** As accurate, and the investigation should move on from there to a purely structural explanation for the failure instead of a change-based one.

**Answer: B.** Change correlation is a prioritisation heuristic, not a literal question about human action. Certificates expire, disks fill from log growth, scheduled jobs run, DNS records reach their TTL and unattended upgrades apply patches — all changes nobody performed deliberately but that a system which ran correctly yesterday can still have undergone.

- A is wrong: Reproduction and change correlation answer different questions; skipping one does not make the other unnecessary.
- C is wrong: The journal records what a component reported, not when a configuration or dependency changed, which is what correlating against the symptom timeline needs.
- D is wrong: Accepting "nothing changed" at face value is exactly the trap this heuristic warns against; a change without a deliberate actor is still a change.

### 372.

A unit has been failing intermittently since this morning's boot. Which single combination narrows the journal to just this unit's own errors and worse, for the current boot?

- **A.** Combine the unit filter `journalctl -u` with the priority filter `journalctl -p err`, both restricted to this boot.
- **B.** Follow the log live with `tail -f` on /var/log/syslog and wait for the next failure.
- **C.** Run `systemctl status <unit>`, which lists the unit's recent journal lines alongside its load state, active state and the exit code of its last run.
- **D.** Run `journalctl -p err` alone, without a unit filter, since a single priority level shows only that unit's errors.

**Answer: A.** `journalctl -u` restricts output to one unit and `journalctl -p err` filters by severity, inclusive of everything worse than the named level; combined and scoped to the current boot they isolate exactly the failing unit's own errors. `tail -f` only follows a growing text file and cannot show history, and a system without persistent journal storage has nothing under `/var/log` for it to watch at all.

- B is wrong: That watches a text log grow in real time but shows nothing that already happened, and a journald-only system may have no such file to tail at all.
- C is wrong: That tail is a short, ellipsized summary of the current invocation only, not a full priority-filtered history across the boot.
- D is wrong: Without `-u` the output covers every unit and kernel record system-wide, drowning the one line that matters in unrelated noise.

### 373.

Writes to /var fail with "No space left on device," but `df -h /var` shows 40% used. What do you check next, and what does the outcome rule out?

- **A.** `journalctl -u` for the affected service, since the daemon's own log will name the cause of any resource exhaustion it hits.
- **B.** Delete the largest files you can find, since that's how a full disk is normally resolved.
- **C.** `df -i /var`. If `IUse%` is at 100%, the inode pool is exhausted, which rules out any remedy based on file size.
- **D.** `ls -ld` on /var, in case a restrictive parent directory is blocking access.

**Answer: C.** A filesystem can run out of data blocks or out of inodes independently, and both produce the same "No space left on device" message. `df -h` reports blocks; `df -i` reports the separate inode pool, which is consumed one per file regardless of that file’s size.

- A is wrong: A unit's journal won't explain a block-versus-inode discrepancy that the filesystem itself already surfaced.
- B is wrong: Inode exhaustion is caused by many small files, not large ones, so deleting a few large files changes nothing about the actual constraint.
- D is wrong: A traversal permission problem produces "Permission denied," not "No space left on device"; the symptom already points at the filesystem, not the path.

### 374.

`df -h` reports a filesystem at 100% used, but `du -sh /*` on that same mount totals far less. What explains the gap, and what actually fixes it?

- **A.** Search harder for large files with `du`, since some large consumer must be hidden from the first pass.
- **B.** The kernel is caching recently deleted file data in memory and will release the corresponding disk blocks once it comes under memory pressure.
- **C.** Space is held by files deleted while a running process still has them open; identifying and restarting that process releases the blocks.
- **D.** The mismatch is a logging artefact and resolves itself once the logs rotate.

**Answer: C.** `df -h` and `du -sh /*` answer different questions — filesystem accounting versus a directory-tree walk — and they legitimately disagree when space is held by a file that has been deleted but is still open. The fix is closing or restarting the process holding the descriptor, not finding a bigger file to delete.

- A is wrong: No amount of searching finds space held by deleted-but-open files, because they no longer have a name for any file search to match.
- B is wrong: Page cache reclaim is a memory mechanism and has no bearing on filesystem block accounting for an open-but-unlinked file.
- D is wrong: Log rotation renames or truncates files; it does not release blocks held open by a process that is still writing to the old descriptor.

### 375.

You're confident you know how to restart the production database and that doing so would fix the fault, but your role does not authorise changes to production databases. What should you do?

- **A.** Escalate, handing over the symptom, established scope, what changed recently, and the theories already tested.
- **B.** Apply the fix yourself, since asking for permission only wastes the time escalation would take.
- **C.** Reproduce the fault one more time to be certain before doing anything else.
- **D.** Restart the method from identification, since a fix you may not apply means one of the earlier steps must have produced the wrong theory.

**Answer: A.** Two distinct limits force escalation: competence and authority, and the second is the one technically capable people under-weight. Knowing how to perform a fix does not grant permission to perform it, and the handover exists precisely so the next person does not repeat eliminations already made.

- B is wrong: Authority boundaries exist independently of whether the action would work; performing it anyway is out of bounds regardless of technical confidence.
- C is wrong: Reproduction is already presumed established here; the blocker is authority to act, which another reproduction attempt does not resolve.
- D is wrong: The theory was never disconfirmed here — the fix it implies is simply outside your authority to apply, and repeating the earlier steps does not change who is allowed to act.

### 376.

A CI step runs a command that prints an alarming message, but the pipeline continues as though it passed. Checking immediately afterward, running `echo $?` reports 0. What does that tell you?

- **A.** The command's own exit status was 0, so it succeeded from the shell's point of view even though its output looked like a failure.
- **B.** The command failed silently, and `$?` is simply unreliable for this kind of check.
- **C.** The command lacked execute permission on its own binary, or ran from a filesystem mounted `noexec`, both of which are reported as exit status 0.
- **D.** The systemd unit wrapping the step is in a failed state regardless of the command's own status.

**Answer: A.** Exit status is the value scripts, systemd and CI pipelines actually check, and zero always means success regardless of what a command printed. A command that writes a scary line to stderr and exits 0 is a success as far as every automated caller is concerned.

- B is wrong: `$?` is exactly the mechanism the shell and every automated caller use to detect failure; the alarming text was not the failure signal.
- C is wrong: A missing execute bit produces 126, not 0; 0 always means the command ran and exited successfully.
- D is wrong: Nothing about an ad hoc shell command's exit status reflects a wrapping unit's state; the two are unrelated in this scenario.

### 377.

`uptime` reports a load average of 24, and `top`'s CPU-state line shows a high `wa` and a low `us`. What does that combination rule out, and what is actually happening?

- **A.** It rules out CPU saturation; `uptime`'s figure counts D-state processes too, and `top`'s high `wa` shows they're waiting on storage, not the processor.
- **B.** It rules out memory pressure entirely, since any swapping under memory pressure would instead show as a high `us` figure.
- **C.** A load of 24 is high regardless of core count, so this is unambiguous CPU saturation requiring more processing capacity.
- **D.** It confirms disk space, not CPU, is the constraint here, and the remedy is freeing space rather than adding processors.

**Answer: A.** The load average includes processes in uninterruptible sleep (state D), typically blocked on disk I/O, alongside runnable ones, so a high figure with a mostly idle CPU is a storage-bound queue rather than a processor shortage. `top`'s `wa` field is what separates the two causes that produce an identical load number.

- B is wrong: Memory pressure is not read off the `us`/`wa` split at all; that pair distinguishes CPU-bound work from I/O-bound work, not memory state.
- C is wrong: Load average is a count of queued work, not a percentage, and is meaningless without dividing by the number of cores first; the `wa` field here already points away from CPU saturation.
- D is wrong: I/O wait reflects processes queued on storage latency, which is a different condition from a filesystem running out of free space.

### 378.

A host reports a load average of 6. Is that a problem, and what determines the answer?

- **A.** Yes — a load figure above 1 always indicates a problem on any host, regardless of how many processor cores that host actually has available.
- **B.** No — swap usage, not load average, is what indicates trouble.
- **C.** It depends on core count; divide the load by `nproc`. A load of 6 on a 32-core host is unremarkable, 6 on a 2-core host is severe.
- **D.** It depends on network latency, which the load average also reflects.

**Answer: C.** Every useful conclusion about load average requires dividing by the core count first, which `nproc` supplies. The manual is explicit that the same raw figure describes an idle system on many cores and a saturated one on few.

- A is wrong: A load average of 1 means only a single-CPU system is loaded all the time; on a 4-CPU system the same figure means the system was idle 75% of the time.
- B is wrong: Swap usage is a separate memory metric; load average can be a genuine problem even with no swap activity at all.
- D is wrong: Load average has no network component; it counts processes runnable or blocked on local I/O, not requests waiting on the network.

### 379.

Users can't reach internal.example.com. Connecting by its literal IP address works. `dig` against the hostname returns SERVFAIL from the configured resolver. What does each result rule out?

- **A.** Check `journalctl -u` for the resolver's own systemd service, in case it logged something about the failed lookup.
- **B.** SERVFAIL means the record simply doesn't exist in the zone, exactly the same thing NXDOMAIN means when returned instead.
- **C.** The working IP test means DNS itself is fine across the board and something else entirely must be wrong here.
- **D.** The working IP rules out connectivity, routing and the firewall; SERVFAIL rules out a missing record and points upstream — the resolver was reached but couldn't complete the lookup.

**Answer: D.** Trying an IP address directly separates a DNS fault from a connectivity fault decisively: if the IP works and the name does not, the fault is in resolution. `dig`'s status field then discriminates further — NXDOMAIN, SERVFAIL and an unreachable-resolver report each point at a different remedy.

- A is wrong: The status field `dig` already returned identifies the failure mode directly; the resolver's own service log is not needed to interpret SERVFAIL.
- B is wrong: NXDOMAIN is an authoritative "this name does not exist"; SERVFAIL means the resolver was reached and failed to complete the lookup, which points at a different class of cause.
- C is wrong: A working IP alongside a failing name is exactly the signature of a resolution fault, not evidence that DNS is fine; it isolates the fault to resolution rather than away from it.

### 380.

`cat /etc/resolv.conf` shows a single line, `nameserver 127.0.0.53`. Where should you look for the real upstream DNS servers, and why?

- **A.** Add the real upstream servers directly to `/etc/resolv.conf`, since that's what the resolver reads.
- **B.** Check `journalctl -k` for kernel-level DNS errors, since name resolution failures are logged by the kernel alongside other network events.
- **C.** In `systemd-resolved`'s own configuration, since 127.0.0.53 is the local stub resolver and this file doesn't hold the actual upstream servers on such systems.
- **D.** Run `ping` against the resolver's address to check reachability first.

**Answer: C.** A single `127.0.0.53` nameserver line is the signature of `systemd-resolved`'s stub resolver rather than the real upstream configuration, which lives with that service instead of in the generated file. Editing the file directly is overwritten the next time the stub is regenerated.

- A is wrong: On a `systemd-resolved` system the file is generated, and a manual edit to it is overwritten rather than taking effect.
- B is wrong: DNS resolution is handled in user space by the resolver service; kernel messages are not where its upstream server configuration is recorded.
- D is wrong: Reachability of the stub address doesn't reveal where the actual upstream servers are configured, which is what the question asks.

### 381.

One user reports that a command fails. Which single additional observation most reduces the set of candidate causes?

- **A.** Check what has changed on the host over the last 24 hours, including deployments and package upgrades.
- **B.** Have a second user try the same command from the same place, or have the reporter try it from somewhere else.
- **C.** Open the failing application's own log and read whatever it recorded for the reporter's session.
- **D.** Reproduce the failure yourself, from your own account, on your own workstation, and see whether it happens there too.

**Answer: B.** Scope is established by contrast, not by observing the failure alone. A comparison case that changes exactly one dimension — same command, different user; same user, different host — tells you which dimension the cause lives in, eliminating whole categories at once.

- A is wrong: That is a useful theory-generating step later, but it does not by itself establish whether the fault is user-specific or host-wide.
- C is wrong: A log entry from one session carries no comparison case, so it cannot discriminate between a user-specific and a host-wide cause.
- D is wrong: That adds a second observation that differs in several dimensions at once — account, host and possibly network path — so no category of cause is eliminated by it.

### 382.

A service exits with shell status 137, and its own log shows nothing unusual before it stops. What does that status suggest, and what confirms it?

- **A.** Nothing conclusive — 137 is just as likely to be an ordinary exit code the application chose deliberately on its own way out.
- **B.** SIGKILL (128+9), consistent with an OOM kill; confirm with `journalctl -k` or `dmesg` around that time.
- **C.** It indicates the process was CPU-starved and self-terminated.
- **D.** It means the command was not found on PATH.

**Answer: B.** A shell exit status of 137 is 128+9, the signature of SIGKILL, which is exactly how the OOM killer terminates its victim. The kill itself is recorded in the kernel ring buffer — readable live with `dmesg` or, from the journal, with `journalctl -k` — which is where "died for no reason, nothing in its own log" gets its explanation.

- A is wrong: 137 is 128 plus a signal number and cannot come from a plain exit; the value itself already points at a fatal signal, here SIGKILL.
- C is wrong: CPU starvation does not send a process a fatal signal; a self-terminating process under load would ordinarily report an exit code, not 128+N.
- D is wrong: Command-not-found is exit status 127, a plain exit rather than a signal termination, and it is a different value entirely from 137.

### 383.

`free -h` on the host shows plenty of available memory, but a process inside one container was OOM-killed. How is that possible, and how do you confirm it?

- **A.** The disk backing swap was full, not the memory itself, which is a separate condition from a cgroup limit being reached.
- **B.** The kill was against the container's own cgroup memory limit, not the host total; the kernel message names a memory cgroup rather than system-wide exhaustion.
- **C.** It cannot happen — a healthy `free -h` output measured on the host itself rules out any OOM kill anywhere on that machine.
- **D.** The container's process lacked permission to allocate memory under its cgroup policy, and that restriction surfaces to the process as a kill.

**Answer: B.** A memory cgroup limit is enforced independently of host-wide memory availability, so a container can be OOM-killed on a host with gigabytes free. The kernel’s own OOM report is what discriminates the two cases: a kill made against a cgroup’s limit names that memory cgroup, while a system-wide exhaustion does not.

- A is wrong: The OOM killer responds to an unsatisfiable memory allocation, not to disk state, and a full swap disk is a separate condition from a cgroup limit being hit.
- C is wrong: Host-level memory figures say nothing about a cgroup's own configured limit, which is exactly what a container can be killed against while the host has memory to spare.
- D is wrong: A permissions fault produces EACCES or EPERM on an operation, not a kernel-initiated SIGKILL for memory exhaustion.

### 384.

A file is mode 644, owned by the requesting user, yet opening it returns "Permission denied." `ls -l` on the file shows nothing wrong. What do you check next, and what does the outcome rule out?

- **A.** `namei -l` on the full path, or `ls -ld` on each parent directory — a parent missing search (`x`) permission explains the denial and rules out the file's own mode and group membership.
- **B.** `journalctl -u` for the service touching the file, since its own log may record the real reason for the denial somewhere.
- **C.** Widen the file's mode with chmod until the error stops appearing, since a more permissive mode can only help, not hurt.
- **D.** `df -i` for inode exhaustion on that filesystem, since exhaustion of either kind can also block access to a file.

**Answer: A.** The single most common miss on this fault is the traversal case: the file's own mode is fine and a parent directory's is not. `namei -l` walks the path component by component and shows exactly where that traversal bit is missing, which `ls -l` on the file alone cannot reveal.

- B is wrong: A traversal denial happens at the kernel level during path lookup and is not something the application's own service log would explain.
- C is wrong: The file's own mode already looks fine, so widening it further does not address a parent-directory or credential cause and permanently weakens a file that wasn't the problem.
- D is wrong: Inode exhaustion blocks creating or writing new files, not reading an existing one, and it produces "No space left on device," not "Permission denied."

### 385.

A user was added to a new group with `usermod -aG` an hour ago. In their still-open shell they get "Permission denied" on a file the new group can read. What's happening, and what confirms it?

- **A.** The group membership itself is broken somewhere in the directory service and must be re-applied from scratch before it will work.
- **B.** DNS caching somewhere upstream is delaying the group change from propagating down to this particular host and shell.
- **C.** The service holding the file needs `systemctl status` checked for a stale process left over from before the change.
- **D.** Their session predates the group change; comparing `id` inside the open shell against `id <user>` shows the group lists differ, and a fresh login is what's needed.

**Answer: D.** `id` reports the credentials of the current process, not the account's configured groups, so an open shell started before a group change still carries the old set. Comparing it against `id <user>` exposes exactly that gap, and the fix is a new login rather than another permission change.

- A is wrong: The configuration is already correct; the running session simply predates it, which another `usermod` command does not fix.
- B is wrong: Group membership is a local kernel-held credential on the running process, with no involvement from DNS resolution or caching at all.
- C is wrong: The denial here is on a user's own interactive shell reading a file, not a service's process state, which `systemctl status` doesn't speak to.

### 386.

A reported permission fault will not reproduce when you run the same command as root. What does that success establish?

- **A.** Nothing about the reported fault; root is exempt from the ordinary mode checks, so the failing condition was never exercised.
- **B.** That the fault is fixed, since the reproduction attempt succeeded.
- **C.** That the file's mode, ownership, and every parent directory along the path must already be correct and fully permissive for the reporting user.
- **D.** That the issue can be escalated as resolved, since it did not recur under test.

**Answer: A.** Reproduction has to match the reported trigger exactly — the same command, the same account, the same host — or a successful run proves nothing about the original failure. Testing as root is the classic version of this error: the superuser is exempt from the checks that a permission fault depends on.

- B is wrong: A successful run under different conditions is not a verified fix; the original trigger — the unprivileged user's attempt — was never re-tested.
- C is wrong: The test as run says nothing about the original user's permissions, because root bypasses the checks that would reveal a problem with them.
- D is wrong: Escalation hands over an open problem with evidence gathered; an invalid reproduction attempt is not evidence that the problem is closed.

### 387.

`systemctl status` on a unit shows `Active: failed (Result: exit-code)` with a non-zero status. What does that state rule out, and where is the daemon's own message?

- **A.** It confirms an OOM kill happened, since the process is no longer running and something must have terminated it against its will.
- **B.** It confirms a permissions problem on the unit's data directory or one of its configuration files somewhere along the path.
- **C.** It confirms the listening port is already bound by another process, most likely a previous instance of the same daemon.
- **D.** It rules out a signal or OOM kill, since those leave the unit in a `signal` or `oom-kill` failed state instead; the message is in `journalctl -u` for this unit.

**Answer: D.** The state name tells you which half of the problem you're in: `failed` with an exit code means systemd started the process and it died under its own control, ruling out signals and OOM kills, which surface differently. The daemon's own error line is in the unit's journal, not in the short tail `systemctl status` shows.

- A is wrong: An OOM kill is a signal termination and leaves the unit in the `oom-kill` failed state, not in an ordinary exit-code state.
- B is wrong: An exit-code state says only that the process exited under its own control; the specific cause could be permissions or something else entirely until the journal is read.
- C is wrong: "Address already in use" is a specific journal message found with `ss -tulpn`, not something the generic exit-code state alone establishes.

### 388.

`systemctl start nginx.service` returns immediately with no error, but the site is unreachable a moment later. What's the right next command, and why?

- **A.** `tail -f` on /var/log/syslog, since systemd services always write there.
- **B.** `systemctl status` on the unit, because a forking or notify-type daemon can exit moments after a successful-looking start.
- **C.** `ss -tulpn`, to see whether anything is listening on the expected port.
- **D.** Nothing — `systemctl start` returning without error means the service is running and stays running until something explicitly stops it.

**Answer: B.** `systemctl start` succeeding is not the same claim as the unit staying active; `systemctl status` is what reports the load state, active state and sub-state, and the exit code or signal of the most recent run. `ss -tulpn`'s Local Address column becomes the next useful command once the unit's own state is confirmed.

- A is wrong: journald does not guarantee a corresponding text file, and this does not confirm the unit's current active state either way.
- C is wrong: Useful once you know the unit died, but it doesn't explain why a start that reported success failed to keep the process running; check the unit's own state first.
- D is wrong: A clean return only confirms the command was accepted, not that the daemon stayed up; a service that restart-loops or exits shortly after can look identical to success at that instant.

### 389.

Mid-investigation, your first theory's test comes back negative. What does that outcome rule out, and what should happen next?

- **A.** It rules out nothing yet; apply the fix you had already planned for that cause anyway, on the theory that trying it costs little and might happen to help.
- **B.** It points the investigation toward a user-specific cause rather than a host-wide one, so narrow the scope again.
- **C.** It signals the problem is outside your expertise, so escalate with the evidence gathered so far.
- **D.** It rules out that specific cause and the fix already planned for it; return to theory formation with one candidate eliminated.

**Answer: D.** Each step in the method gates the next, and a negative test is itself informative: it rules out one candidate cause and the fix that went with it, and sends the investigation back to theory formation rather than forward to implementation. Reaching for `journalctl -u` or any other command at this point does not change what a failed test means.

- A is wrong: This is the trap the method exists to prevent: implementing a fix for a theory that just failed its test cannot be verified against anything and wastes the elimination.
- B is wrong: A negative test result says nothing about blast radius; that is a separate technique with its own comparison case.
- C is wrong: One eliminated theory is not an authority or competence boundary; escalation is triggered by those limits, not by an ordinary negative result.

### 390.

How do the structured troubleshooting method and narrowing scope differ, once both are in play on the same fault?

- **A.** Narrowing scope also ends with a verified, documented fix, so the two are interchangeable in practice.
- **B.** The method requires reproducing the fault before anything else can happen, and narrowing scope becomes entirely optional once reproduction has already succeeded.
- **C.** The method is the whole ordered procedure from identification through documentation; narrowing scope is one technique used inside its early steps.
- **D.** Narrowing scope applies to every fault as a discipline, while the method applies only when the blast radius is already unclear.

**Answer: C.** The comparison turns on scope: the structured troubleshooting method names the entire ordered procedure and is what answers "what do I do first," while narrowing scope is a single early technique that produces a reduced set of candidates rather than a completed, verified fix.

- A is wrong: Narrowing scope ends with a reduced candidate set, not a fix; only the full method reaches verification and documentation.
- B is wrong: Reproduction is a distinct precondition for verification, not a gate that narrowing scope depends on or replaces.
- D is wrong: This reverses the actual scope: the method applies to every fault as a discipline, and narrowing scope is only useful where the blast radius is not already known.

### 391.

You don't recall the name of the command that reports load averages, only that its description mentions "load." Which pair of commands searches manual page descriptions for a keyword, rather than opening a page whose name you already know?

- **A.** `apropos` and `man -k`, both keyword searches over the one-line descriptions of every manual page.
- **B.** `man`, since giving it a keyword instead of a page name still searches the page bodies.
- **C.** `info`, since its Texinfo indices are more complete than the corresponding man pages.
- **D.** Run the suspected command with a guessed name and read `echo $?` after each attempt until one succeeds.

**Answer: A.** `apropos` and `man -k` both search the whatis database of one-line descriptions for a keyword, which is exactly what's needed when the command's name is unknown. `man` and `info` are direct-lookup tools: both require the name in hand already, which is the one thing missing in this scenario.

- B is wrong: Given a bare keyword, `man` looks for a page of that name and fails; searching page bodies is a separate mode, `man -K`, and not what plain `man` does.
- C is wrong: Even where a Texinfo manual is fuller than the man page, `info` is still a direct lookup that needs the manual’s name — the one thing missing in this scenario.
- D is wrong: That is trial and error against the shell, not a documentation search, and it never actually identifies the correct command name.

