<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — System Administration Fundamentals :: Disaster Recovery

30 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

What does the 3-2-1 backup rule prescribe?

- **A.** Three full backups, two differentials, and one incremental each week.
- **B.** Three sites, two of them warm, and one hot.
- **C.** Three restore tests a year, two of them full, and one tabletop.
- **D.** Three copies of the data, on two types of media, with one held off-site.

**Answer: D.** Three copies, two media types, one off-site. It is a compact expression of what actually makes backups survive a disaster: more than one copy, not all vulnerable to the same failure mode, and not all in the same building.

- A is wrong: The rule says nothing about backup types or schedule; it constrains copies, media and location.
- B is wrong: Site tiers are a separate decision driven by recovery time, not by this rule.
- C is wrong: Testing cadence is a distinct practice and is not what the numbers refer to.

### 2.

A retention policy keeps daily backups for 14 days and nothing longer. A corruption introduced 40 days ago is discovered today. What is the consequence?

- **A.** The oldest retained backup predates the corruption and can therefore be restored intact.
- **B.** Replication to the standby site preserves an uncorrupted version.
- **C.** The recovery point objective determines whether the data is recoverable.
- **D.** No clean copy remains, because every retained backup already contains the corruption.

**Answer: D.** Retention balances recovery reach against storage cost and compliance obligations. It sets the oldest state you can return to, so a fault discovered outside the window is unrecoverable regardless of how reliable the backups were.

- A is wrong: The oldest retained copy is 14 days old, which is well after the corruption occurred.
- B is wrong: Replication tracks the current state and would have copied the corruption when it happened.
- C is wrong: That target describes tolerable data loss in a recovery, not how far back copies survive.

### 3.

A file server replicates every write to a second machine in another rack. An operator deletes a directory by mistake, and the deletion appears on the second machine within seconds. Which safeguard was missing?

- **A.** More replication targets, so at least one copy escapes the deletion.
- **B.** A RAID array, so the directory survives the loss of any single disk.
- **C.** A backup, an independent copy from which the deleted directory can be restored.
- **D.** Nothing — replication to a second machine is a backup.

**Answer: C.** A backup is an independent copy kept so data can be restored after loss, corruption or deletion. Replication and RAID both keep a second copy live, and both apply the destructive operation to that copy as faithfully as to the first. Common tools for taking that independent copy are `tar` for archiving and `rsync` for file-level copies.

- A is wrong: Replication faithfully copies deletions to every target, so adding targets multiplies the deletion rather than escaping it.
- B is wrong: RAID protects against disk failure, not against a delete the filesystem was asked to perform.
- D is wrong: A common belief, and the reason this pair is examinable: replication gives availability, not recoverability.

### 4.

You need to copy a large directory tree to a backup host nightly, transferring only the files that changed since the previous run. Which tool is designed for that?

- **A.** `tar` writing a fresh archive on every run
- **B.** `rsync` run nightly against the backup host
- **C.** A filesystem snapshot of the source volume
- **D.** Continuous replication to the backup host

**Answer: B.** `rsync` exists precisely for repeated directory-tree copies: it determines what differs and sends only that. `tar` creates an archive and is the right tool for bundling, not for incremental transfer.

- A is wrong: It bundles files into a single archive but has no notion of what the destination already holds, so every run copies everything.
- C is wrong: A local snapshot stays on the same storage as the original and never moves data to the backup host.
- D is wrong: That keeps a live mirror rather than a nightly independent copy, and propagates deletions immediately.

### 5.

How do business continuity and disaster recovery relate to each other?

- **A.** Business continuity is the IT subset of the wider disaster recovery discipline.
- **B.** They are two names for the same set of activities.
- **C.** Business continuity applies during an incident; disaster recovery applies afterwards.
- **D.** Disaster recovery is one component of business continuity, which is broader.

**Answer: D.** Business continuity is the discipline of keeping the organisation operating through disruption — staff, premises, suppliers, communications and systems. Disaster recovery is the part of that concerned with restoring IT service. The axis is scope: one contains the other.

- A is wrong: This inverts the containment; the technical procedure sits inside the organisational one.
- B is wrong: They differ in scope, and treating them as synonyms is what the comparison tests.
- C is wrong: Both span the incident and its aftermath; the difference is breadth, not timing.

### 6.

A flood closes an office for a month. Which concern belongs to business continuity rather than to disaster recovery?

- **A.** Where staff will work and how customers will be told.
- **B.** Which systems are restored first and in what order.
- **C.** How much data was lost between the last copy and the flood.
- **D.** Whether the standby site can carry production load.

**Answer: A.** Continuity asks whether the organisation can keep operating; recovery asks whether the systems can be brought back. A month without an office raises questions no restore procedure answers.

- B is wrong: Restoration sequencing is the technical recovery procedure.
- C is wrong: That quantity is bounded by the recovery point objective, a recovery measure.
- D is wrong: Standby capacity is part of the technical recovery arrangement.

### 7.

What does a disaster recovery drill establish that restore testing does not?

- **A.** That the backup media can be read back successfully.
- **B.** That the people involved can execute the plan and know their roles.
- **C.** That the recovery point objective is being met.
- **D.** That the off-site copies are far enough from the primary.

**Answer: B.** A drill is a rehearsed exercise — full failover or tabletop — proving the plan works and that people know their roles. Restore testing proves one artefact can be read back. The axis is scope: an artefact versus the procedure and the people around it.

- A is wrong: That is what restore testing establishes on its own.
- C is wrong: Tolerable data loss is evidenced by copy frequency rather than by a rehearsal.
- D is wrong: Geographic separation is a property of where copies sit, not something a drill measures.

### 8.

A team gathers to walk through the recovery plan verbally, without touching production systems. What is this?

- **A.** Not a drill at all, because no systems were actually failed over to the standby.
- **B.** Restore testing conducted at low cost.
- **C.** A tabletop drill, which is a legitimate form of exercise.
- **D.** A failback rehearsal for the standby site.

**Answer: C.** A drill is a rehearsed exercise proving the plan works and that people know their roles, and it may be a full failover or a tabletop. The tabletop form finds gaps in sequencing, contact details and decision rights at a fraction of the cost and risk.

- A is wrong: Restricting the term to full failover excludes a recognised and useful exercise form.
- B is wrong: No backup was read back, which is what that practice requires.
- D is wrong: Nothing was switched over, so there is no return leg being practised.

### 9.

Which of these belongs in a disaster recovery plan rather than in a runbook for routine operations?

- **A.** The procedure for rotating an expiring TLS certificate.
- **B.** The organisation's strategy for continuing to trade during a disruption.
- **C.** The load balancer's health-check interval for a failing node.
- **D.** The order of system restoration and who is authorised to declare a disaster.

**Answer: D.** A disaster recovery plan is the documented, tested procedure for restoring service after a major failure — including who does what and in what order. Its distinguishing content is the sequencing and the decision rights, which are precisely what nobody can improvise at the time.

- A is wrong: That is scheduled maintenance and does not involve recovering from a major failure.
- B is wrong: That is the broader continuity discipline, of which IT recovery is one component.
- C is wrong: That is an availability mechanism operating within a site rather than a recovery procedure.

### 10.

An auditor asks for evidence that a disaster recovery plan is more than a document. What satisfies the request?

- **A.** Signed acknowledgements from every named role confirming they have read the current version.
- **B.** Records of exercises in which the plan was followed and its gaps recorded.
- **C.** Backup job logs showing two years of successful runs.
- **D.** A diagram of the standby site's network topology.

**Answer: B.** NIST SP 800-34 Rev. 1 makes testing, training and exercises a step of the contingency planning process in its own right: testing validates recovery capabilities and exercising the plan identifies planning gaps. The glossary definition of a disaster recovery plan does not itself use the word tested, so what evidences a working plan is the exercise record rather than the definition. A plan nobody has rehearsed is a proposal: it has never met the conditions it was written for, and the gaps it contains are still unknown.

- A is wrong: Acknowledgement shows awareness but never shows the procedure works.
- C is wrong: Successful writes evidence neither restoration nor the plan around it.
- D is wrong: Documentation of the destination says nothing about whether the procedure was exercised.

### 11.

An organisation has failed over to its standby site three times and never returned to the primary without an unplanned outage. Which step is under-tested?

- **A.** Failback, returning to the primary once it is healthy.
- **B.** Failover, since three activations indicate an unreliable trigger.
- **C.** Restore testing, since the standby data must have been wrong.
- **D.** Retention, since older copies were needed on each return.

**Answer: A.** Failover switches service onto a standby when the primary fails; failback returns it once the primary is healthy. AWS Elastic Disaster Recovery documents failback as a separate operation with its own mechanism — reverse replication of the recovery instances back to the source servers — so a rehearsal of the outbound half establishes nothing about the return leg.

- B is wrong: The failovers succeeded; the outages occurred on the return leg.
- C is wrong: Nothing indicates a bad restore; the fault appears when moving back.
- D is wrong: Retention governs how long copies persist and is not exercised by a site switch.

### 12.

During failback from a standby that has been serving writes for two days, what must be handled before the primary resumes service?

- **A.** Nothing — the primary holds the authoritative copy by definition.
- **B.** The recovery time objective must be lengthened to permit the switch.
- **C.** The standby's snapshots must be deleted to avoid conflicts.
- **D.** The writes accumulated on the standby must be reconciled onto the primary.

**Answer: D.** While the standby serves, it becomes the system of record. AWS Elastic Disaster Recovery describes failback as returning workloads to the original source infrastructure and assists it by replicating data from the recovery instances back to the source servers, so failback has a data problem at its centre rather than merely a routing one — which is why it is harder than failover and more often goes wrong.

- A is wrong: Authority moved with service; treating the stale primary as authoritative discards real data.
- B is wrong: Targets describe requirements and do not resolve a data divergence.
- C is wrong: Removing point-in-time copies destroys evidence and resolves no divergence.

### 13.

A site takes a full backup on Sunday and a differential backup every weekday night. The server fails on Thursday morning. Which sets must be restored?

- **A.** Sunday's full, then Wednesday's differential only.
- **B.** Sunday's full, then Monday, Tuesday and Wednesday in order.
- **C.** Wednesday's differential only.
- **D.** Sunday's full only, since differentials are for retention rather than restore.

**Answer: A.** The distinction lives on the restore side. A differential accumulates all changes since the last full, so a restore needs the full plus one differential. An incremental holds only what changed since the previous backup of any kind, so a restore needs the full plus every incremental in sequence.

- B is wrong: That is the restore sequence for incrementals, each of which holds only what changed since the previous backup.
- C is wrong: A differential is not self-contained; without the full it has no baseline to apply changes to.
- D is wrong: Differentials are restore inputs, and skipping them discards every change made since Sunday.

### 14.

A cluster survives the loss of any single node without interruption. What does that arrangement not provide?

- **A.** Recovery if the whole site or system is lost.
- **B.** Continued service when one node fails.
- **C.** Automatic transfer of work away from the failed node.
- **D.** Continued service while one node is taken out of the cluster for a planned upgrade.

**Answer: A.** High availability avoids downtime from component failure within a site. Disaster recovery restores service after a site or system is lost. They solve different problems and are not substitutes — a perfectly available cluster in a flooded building is unavailable.

- B is wrong: That is precisely what the arrangement does provide.
- C is wrong: Shifting work off a failed member is part of how the cluster stays available.
- D is wrong: Rolling maintenance is one of the things node redundancy is for, so the cluster does provide this.

### 15.

A budget holder proposes cancelling the standby site because the production cluster is already highly available. What is the flaw?

- **A.** The cluster protects against component failure, not against losing the location it sits in.
- **B.** There is no flaw, since a highly available cluster already makes a separate recovery site unnecessary.
- **C.** The cluster cannot meet a recovery point objective of any length.
- **D.** Clusters are unable to fail back once a node returns to health.

**Answer: A.** Availability engineering removes single points of failure inside a site. Recovery engineering assumes the site is gone. Cancelling the second because the first exists leaves the organisation exposed to exactly the event the second was bought for.

- B is wrong: This is the substitution the comparison exists to prevent.
- C is wrong: Data loss targets are governed by copy frequency and are not a property of clustering.
- D is wrong: Returning work to a recovered member is ordinary cluster behaviour.

### 16.

A facility holds installed, running hardware and the most recent backup already loaded, needing only the data written since that backup before it can take over. Which tier is it?

- **A.** A mirrored site.
- **B.** A warm site.
- **C.** A hot site.
- **D.** A cold site.

**Answer: C.** The tiers are separated by how much is already in place. A hot site is fully equipped with the most recent backup loaded and needs only the data written since. Real-time continuous mirroring belongs to the separate and more expensive mirrored site — a distinction that is easy to lose and is exactly where this question sits.

- A is wrong: That tier carries continuously mirrored real-time data and needs no catch-up at all.
- B is wrong: That holds hardware but not current data, which must be restored before it can serve.
- D is wrong: That provides space, power and environmental control only, with no hardware in place.

### 17.

Moving from a hot site to a cold site has which pair of effects?

- **A.** Cost falls and recovery time falls.
- **B.** Cost rises and recovery time falls.
- **C.** Cost falls and recovery time rises.
- **D.** Cost is unchanged and only tolerable data loss rises.

**Answer: C.** Cost falls and recovery time rises as you move from hot to cold. The tier is a purchase of readiness, and readiness is what shortens the outage — so the two move in opposite directions by construction.

- A is wrong: Both cannot improve; the saving is paid for in recovery speed.
- B is wrong: That is the direction of travel toward a hot site, not away from one.
- D is wrong: Site tier drives cost and recovery time; data loss is bounded by copy frequency instead.

### 18.

In common usage, what do MTTR and MTBF describe?

- **A.** How much data may be lost, and how long restoration may take.
- **B.** How long repair typically takes, and how often failures typically occur.
- **C.** How many copies are kept, and for how long.
- **D.** How quickly a standby activates, and how quickly the primary returns.

**Answer: B.** Mean time to repair is how quickly service returns; mean time between failures is how often it breaks. Both are observed averages describing past behaviour, which is what separates them from objectives, which are targets set in advance.

- A is wrong: Those are the recovery point and recovery time objectives, which are targets rather than observed averages.
- C is wrong: That describes retention policy, which is unrelated to either measure.
- D is wrong: Those describe failover and failback timing rather than these two metrics.

### 19.

Backup tapes are stored in a fireproof safe in the same building as the servers. Which requirement remains unmet?

- **A.** Off-site storage, because one physical event could still destroy both.
- **B.** Media diversity, because tape is a single medium.
- **C.** Restore testing, because the tapes have not been read back.
- **D.** Retention, because a safe does not enforce an expiry schedule.

**Answer: A.** The requirement is keeping copies or capacity far enough away that one physical event cannot destroy both. Fire resistance raises the threshold but does not create distance — flood, building collapse or a site-wide loss defeats it.

- B is wrong: Media type is a separate requirement from location and is not what the safe fails.
- C is wrong: Testing is a real obligation but is not the one the storage location bears on.
- D is wrong: Expiry is a policy matter independent of where media is kept.

### 20.

Two application servers are load balanced, each with dual power supplies, and both draw from one switch. Where is the single point of failure?

- **A.** The switch, because no duplicate exists for it.
- **B.** The application servers, because two is too few for redundancy.
- **C.** The dual power supplies, because two units inside one chassis do not count as redundancy.
- **D.** The load balancer, because balancing implies a single decision point.

**Answer: A.** The practice is duplicating components so that no single failure stops the service, and then identifying where no such duplicate exists. The answer is always the component with a count of one on the path every request takes.

- B is wrong: Two is sufficient for the service to survive losing one of them.
- C is wrong: Each server is described as carrying two supplies, so the loss of one supply stops nothing.
- D is wrong: Nothing in the description says the balancer is unduplicated, whereas the switch plainly is.

### 21.

A database is replicated synchronously to a second data centre. A bad migration script corrupts a table at 09:00. What does replication give you at 09:05?

- **A.** The table as it stood before the migration, held on the replica.
- **B.** An automatic rollback once the replica detects the inconsistency.
- **C.** A second copy of the corrupted table, available for service.
- **D.** Protection, because replication satisfies the off-site requirement of the 3-2-1 rule.

**Answer: C.** Replication continuously copies data to another system for availability. Its fidelity is the point and the problem: it reproduces deletions and corruption as faithfully as legitimate writes, which is why it is not a backup.

- A is wrong: That is what a backup or a point-in-time copy provides; a replica tracks the primary rather than lagging it deliberately.
- B is wrong: Replication has no notion of whether a change was intended and performs no such rollback.
- D is wrong: Distance is not the issue here; the replica is off-site and still corrupt.

### 22.

Which requirement is replication the appropriate answer to?

- **A.** A file deleted by an operator last Tuesday must still be recoverable from a retained copy.
- **B.** Service must continue from a second site if the primary becomes unavailable.
- **C.** Restores must be proven to work against a published schedule each quarter.
- **D.** Storage cost must fall as data ages beyond its useful window.

**Answer: B.** Replication answers an availability question — can something else serve if this fails. It does not answer a recoverability question, because it holds only the current state and propagates every change to it.

- A is wrong: Reaching back to a past state needs a retained independent copy, not a current mirror.
- C is wrong: That is a testing obligation and is satisfied by exercising restores, not by copying data.
- D is wrong: That is addressed by retention policy and tiering, which replication does not provide.

### 23.

Nightly backup jobs have reported success for two years. What does that establish about the organisation's ability to recover?

- **A.** That the recovery time objective is being met.
- **B.** That the disaster recovery plan is validated.
- **C.** Nothing about recovery, only that the jobs ran without reporting an error.
- **D.** That the data is recoverable, since a successful backup implies a successful restore.

**Answer: C.** Restore testing periodically proves a backup can actually be restored. Until that is done, an untested backup is an assumption rather than a safeguard — and it is the step most commonly skipped.

- A is wrong: A recovery time target can only be evidenced by timing an actual restore.
- B is wrong: Validating the plan requires rehearsing the procedure and the roles, not reading a job log.
- D is wrong: This is the assumption the practice exists to break; media, encryption keys and tooling all fail silently.

### 24.

A team restores a database backup into an isolated environment each quarter and checks the row counts. Which obligation does this satisfy?

- **A.** Restore testing — proving the backup can be read back and yields usable data.
- **B.** A disaster recovery drill, since the recovery procedure has been exercised.
- **C.** The off-site requirement, since the isolated environment is elsewhere.
- **D.** The retention policy, since quarterly checks confirm the copies still exist.

**Answer: A.** Restoring into an isolated environment and verifying the result is restore testing. It proves the artefact works. It does not prove the organisation can execute its recovery plan under pressure, which is a separate exercise.

- B is wrong: A drill rehearses the whole plan and the people in it, not one artefact restoring correctly.
- C is wrong: Where the test runs is incidental; the off-site requirement is about where copies are kept.
- D is wrong: Retention governs how long copies are kept, which existence checks alone do not establish.

### 25.

A service states a four-hour recovery point objective and a one-hour recovery time objective. What do those two figures constrain?

- **A.** Service must be back within four hours, and at most one hour of data may be lost.
- **B.** At most four hours of data may be lost, and service must be back within one hour.
- **C.** Backups run every four hours and drills run hourly.
- **D.** The system tolerates four hours of downtime a year at one-hour granularity.

**Answer: B.** The recovery point objective looks backwards to the last good copy and therefore dictates backup frequency. The recovery time objective looks forwards to service restoration and therefore dictates recovery method and standby capacity. Reversing them is the classic mistake.

- A is wrong: This swaps the two, which is the single most common error on this pair.
- C is wrong: Backup frequency follows from the recovery point target but is not what the figure states.
- D is wrong: That describes an availability budget, which is a different measure entirely.

### 26.

A team must reduce its recovery point objective from 24 hours to 1 hour. Which change achieves that?

- **A.** Provision a hot site so recovery completes faster.
- **B.** Automate failover so the standby takes over unattended.
- **C.** Capture backups or log shipments at least hourly.
- **D.** Extend retention so more historical copies are available.

**Answer: C.** The recovery point objective is a statement about acceptable data loss, and the only lever on it is how often a recoverable copy is made. Everything that speeds up recovery moves the recovery time objective instead.

- A is wrong: Faster recovery shortens the outage, not the amount of data lost before it began.
- B is wrong: Automated failover reduces time to restore service rather than the recovery point.
- D is wrong: Retention extends how far back you can reach, not how recent the newest copy is.

### 27.

A service carries a 30-minute recovery time objective. Which recovery arrangement is consistent with it?

- **A.** A warm site holding hardware, with data restored from backup when needed.
- **B.** A hot site with equipment running and recent data already loaded.
- **C.** A cold site with space, power and environmental control provisioned.
- **D.** Nightly off-site tape rotation with a documented restore procedure.

**Answer: B.** The recovery time objective dictates the recovery method and the standby capacity that must be paid for. Matching a site tier to a stated recovery time is a textbook question shape: the tighter the target, the more of the destination must already be running.

- A is wrong: The restore step alone will normally exceed thirty minutes.
- C is wrong: Hardware would have to be procured and installed first, which takes days or longer.
- D is wrong: Retrieving and restoring media is measured in hours, not in the stated window.

### 28.

Which measurement would demonstrate that a stated recovery time objective is actually achievable?

- **A.** Confirming the age of the most recent restorable copy.
- **B.** Timing a rehearsed recovery from failure to service restored.
- **C.** Counting how many components have a redundant pair.
- **D.** Reviewing the retention schedule for the backup sets.

**Answer: B.** A recovery time objective is a claim about elapsed time from failure to restored service. The only evidence for it is a timed rehearsal; everything else evidences a different property.

- A is wrong: That evidences the recovery point instead, which measures data loss rather than elapsed time.
- C is wrong: Redundancy reduces the chance of an outage without establishing how long recovery takes.
- D is wrong: Retention concerns how long copies persist, which is unrelated to restoration speed.

### 29.

An administrator takes an LVM snapshot before a risky upgrade. The underlying physical volume then fails outright. What is the state of the snapshot?

- **A.** Intact, because a snapshot is an independent copy of the data held apart from the original volume.
- **B.** Intact, because snapshots are always written to separate storage.
- **C.** Intact, because RAID parity reconstructs it from the surviving disks.
- **D.** Lost with the volume, because a local snapshot is stored on the same storage as the original.

**Answer: D.** A snapshot is a point-in-time view of a volume. Local snapshots live alongside the original, so losing the volume loses them, which is why they are not an independent copy. Cloud provider snapshots are typically written to separate storage and do survive deletion of the source volume — the distinction is where the snapshot is stored, not the word itself.

- A is wrong: That describes a backup; independence from the original storage is exactly what a local snapshot lacks.
- B is wrong: True of typical cloud provider snapshots, but not of local LVM or filesystem snapshots.
- C is wrong: RAID is a separate mechanism and is not implied by taking a snapshot.

### 30.

Which single property separates a backup from a local volume snapshot?

- **A.** The backup is taken at a point in time; the snapshot is continuous.
- **B.** The backup can be restored; the snapshot cannot be restored from.
- **C.** The backup is compressed; the snapshot is stored uncompressed.
- **D.** The backup is independent of the original storage; the local snapshot is not.

**Answer: D.** Both capture a moment. Only the backup is stored independently of the volume it came from, which is what lets it survive the loss of that volume. Cloud snapshots blur this because their storage is separate — the axis is still independence, not the label.

- A is wrong: Both are point-in-time; continuous copying describes replication instead.
- B is wrong: A snapshot can be rolled back to; the limitation is its dependence on the same storage.
- C is wrong: Compression is an implementation detail of either and settles nothing about recoverability.

