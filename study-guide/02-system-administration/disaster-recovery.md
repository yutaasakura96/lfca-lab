# Disaster Recovery

Disaster Recovery sits inside System Administration Fundamentals, which carries 30% of the
exam — the 1st largest of 6 domains — and this competency is new in the 2025 update, so no
pre-2025 material covers it. LFS200 does not cover it either: all 18 of its concepts are NOT
COVERED, 0/18 (0%), and the course's one nominal `Backup` lesson contains a single character
(`research/lfs200-notes/00-course-map.md`). Everything below is sourced independently, mostly
from NIST SP 800-34 Rev. 1 and the NIST CSRC glossary, with two concepts explicitly waived
for want of a free primary source. The whole competency is definitional and comparative:
almost every question is a discrimination between two terms that both sound right — backup
against snapshot, RPO against RTO, high availability against disaster recovery, warm site
against hot site.

<a id="s-disaster-recovery-backups"></a>
## Backups

<a id="c-sysadmin.disaster-recovery.backup"></a>
### Backup
*id: `sysadmin.disaster-recovery.backup` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** An independent copy of data, kept so the data can be restored after loss,
corruption, or deletion. The load-bearing word is *independent*: a copy that shares a failure
domain with the original — the same disk, the same volume, the same array, the same
continuously synchronised pair — is not a backup, however many bytes it duplicates.

**Why it matters** Every other concept in this competency is either a way of making backups
better (the 3-2-1 rule, retention, off-site storage) or a thing candidates mistake for a
backup (snapshots, replication, RAID, version control, an archive). The exam's favourite
shape is a scenario that describes one of those look-alikes and asks whether the data is
actually protected.

**How it works** A backup process reads the source data at a chosen moment and writes a copy
somewhere the source's failures cannot reach, on a schedule set by the tolerable data loss
(the RPO). NIST SP 800-34 Rev. 1 treats data backup as a core contingency control and pairs
it with offsite storage, because a copy that stays in the same building dies with the
building. Restoring is a separate operation with its own failure modes, which is why it has
to be tested rather than assumed.

**Key terms** independent copy; restore; offsite storage; failure domain.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `tar` | Bundle files, with their permissions and timestamps, into one archive suitable for storing or shipping off-site | `-c` create, `-x` extract, `-f` name the archive file, `-z` filter through gzip, `-g` / `--listed-incremental=FILE` (GNU tar only) keep a snapshot file so later runs archive only what changed since the previous dump | `tar -czf /backup/etc.tar.gz /etc` | Leaving the archive on the same disk as its source and calling it a backup — repackaging data does not make the copy independent of the original |
| `rsync` | Copy or synchronise a directory tree to another path or host, sending only the differences | `-a` archive mode (equivalent to `-rlptgoD`), `--delete` remove files from the destination that no longer exist on the source, `-n` / `--dry-run` trial run with no changes, `--link-dest=DIR` hardlink unchanged files against a previous copy | `rsync -a --delete /srv/data/ backup:/srv/data/` | Adding `--delete` and calling the result a backup — that makes it a mirror, so a deletion or an encryption event on the source is faithfully applied to the copy |

**Traps** `rsync -a` is `-rlptgoD`; it does *not* preserve ACLs (`-A`), extended attributes
(`-X`), or hardlinks (`-H`), so an "archive mode" copy can still lose metadata a restore
needs. A trailing slash on an `rsync` source copies that directory's contents into the
destination, while omitting it creates the directory itself inside the destination — the
difference silently changes where a restore lands. And GNU `tar` compresses only when told
to: `-z`, `-j`, and `-J` select gzip, bzip2, and xz respectively, so a plain `-cf` archive is
bundled but not compressed.

**What the exam may test** Given a described arrangement — a nightly `rsync --delete` to a
second server, an LVM snapshot, a RAID 1 mirror, a git repository — deciding whether it
constitutes a backup, and if not, which specific failure it fails to survive.

<a id="cmp-sysadmin.disaster-recovery.backup"></a>
#### Not to be confused with: Backup vs version control, archiving, replication, snapshots and RAID
*compares: `sysadmin.disaster-recovery.backup`, `devops.git-concepts.version-control`, `linux.command-line.archiving-and-compression`, `sysadmin.disaster-recovery.replication`, `sysadmin.disaster-recovery.snapshot`, `sysadmin.system-administration.raid-levels`*

| | Backup | Version control | Archiving and compression | Replication | Snapshot | RAID levels |
| --- | --- | --- | --- | --- | --- | --- |
| What it is | An independent copy kept for restoration | A recorded history of changes to tracked files, with authorship | `tar` bundling files into one archive; gzip, bzip2 or xz shrinking it | A continuous copy to another system | A point-in-time view of a volume | Several disks combined into one array for redundancy or speed |
| Independent of the original | Yes, by definition | Yes, once the repository is cloned or pushed elsewhere | Only if the archive is then moved somewhere else | No — the copy tracks the source | Local snapshots typically no; provider snapshots typically yes | No — one array is one failure domain |
| Survives deletion of the source data | Yes | Yes — a deletion is itself a recorded revision | Yes, if the archive predates the deletion | No — the deletion is replicated | Yes, for a snapshot taken before it, provided the volume survives | No — the delete is written through to every member disk |
| Survives loss of the whole machine | Yes, if stored off-site | Yes, if a remote copy exists | Yes, if the archive is off-site | Yes — the replica is a different system | Only if the snapshot lives off the machine | No |
| Primary purpose | Recovery from data loss | Change history and collaboration | Packing and shrinking files for transport or storage | Availability, and a short RTO | Fast local rollback of a change | Uptime through a single disk failure |

The separating axis is independence from the original. Only a backup is defined as a copy
that outlives whatever happens to the source; every other column either shares the source's
failure domain (RAID, a local snapshot), faithfully reproduces the source's mistakes
(replication), or exists for a different purpose entirely (version control, archiving).

<a id="c-sysadmin.disaster-recovery.full-incremental-and-differential-backups"></a>
### Full, incremental and differential backups
*id: `sysadmin.disaster-recovery.full-incremental-and-differential-backups` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** Three backup methods, distinguished by what each one copies. A full backup
captures everything in scope. An incremental captures what changed since the last backup *of
any kind*. A differential captures what changed since the last *full* backup. The trade is
backup time and storage against restore complexity.

**Why it matters** The question is almost never "what does each one copy" on its own — it is
"how many sets of media does a restore need." That number is the difference between the two
non-full methods, and it is the only part candidates reliably get wrong.

**How it works** Restoring from incrementals needs the last full plus *every* incremental
taken since it, applied in order: NIST SP 800-34 Rev. 1's worked example needs the full plus
each day's incremental to rebuild a directory. Restoring from differentials needs the last
full plus *one* differential — the most recent. The cost is symmetrical: incrementals are
fastest to take and slowest to restore, while differentials grow larger each day until the
next full resets them, so they take longer to write but restore from two sets.

**Key terms** restore chain; media set; last full backup; changed since.

<a id="c-sysadmin.disaster-recovery.snapshot"></a>
### Snapshot
*id: `sysadmin.disaster-recovery.snapshot` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A point-in-time view of a volume or filesystem, typically created almost
instantly and typically stored as a record of what has changed since the moment it was
taken, rather than as a second full copy of the data.

**Why it matters** Snapshots are the single most common thing mistaken for a backup, because
they behave like one right up to the failure that matters: they roll back a bad upgrade or a
mistaken `rm` in seconds, and then — in the local case — typically vanish along with the
volume when the underlying storage dies. A scenario that says "we snapshot nightly" is
usually asking whether that is protection.

**How it works** In most implementations, a local snapshot — LVM, ZFS, Btrfs, a hypervisor's
volume snapshot — lives in the same volume group or storage pool as the origin, so losing
that storage typically loses both at once. Cloud provider snapshots are usually different:
they are generally written to separate, provider-managed storage, so they typically survive
deletion of the source volume and can behave much more like a backup. Local snapshots also
tend to consume space that grows as the origin diverges from the snapshot point, which is why
they are usually kept for hours or days rather than months.

**Key terms** point-in-time; copy-on-write; volume group; provider snapshot.

**Traps** "Snapshot" is one word covering two very different guarantees, and the exam can use
either. The local kind is generally not an independent copy and typically fails the backup
test; the provider kind typically passes it. Answering "a snapshot is never a backup" is as
wrong as answering "a snapshot is a backup" — the discriminator is where the snapshot is
stored relative to the source.

**What the exam may test** Given a snapshot arrangement and a described failure (volume
deleted, storage array lost, file deleted by mistake), deciding whether the snapshot can
still be used to recover.

*Not to be confused with [backup](disaster-recovery.md#cmp-sysadmin.disaster-recovery.backup).*

<a id="c-sysadmin.disaster-recovery.replication"></a>
### Replication
*id: `sysadmin.disaster-recovery.replication` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** Continuously copying data to another system so that a second, current copy is
always available. Synchronous replication acknowledges a write only once the remote copy has
it; asynchronous replication lets the remote lag by some interval.

**Why it matters** Replication is what buys a short RTO — the standby already holds the data,
so there is nothing to restore. It buys nothing at all against the failure modes backups
exist for, and confusing the two is the classic disaster-recovery design error the exam
reproduces as a question.

**How it works** Every write to the primary is propagated to the replica, at the block or
database level. That propagation is indiscriminate: a deletion, a truncation, a schema
corruption, or a ransomware encryption pass is a write like any other and reaches the replica
too, in seconds. NIST SP 800-34 Rev. 1 makes the same point about high availability
generally — data corruption can propagate through an HA system and leave it unusable, so
without a copy held separately from the system itself, recovery may not be possible.

**Key terms** synchronous; asynchronous; replica lag; propagation.

**Traps** Replication is not a backup and not a snapshot. It has no point in time to return
to: it holds one state, the current one, so once bad data is written there is no earlier
version anywhere in the arrangement. A backup's whole value is that it is deliberately *not*
current.

**What the exam may test** Recognising that a replicated pair survives hardware and site loss
but not logical corruption or deletion, and that "we replicate to a second region" therefore
does not answer "do you have backups."

*Not to be confused with [backup](disaster-recovery.md#cmp-sysadmin.disaster-recovery.backup).*

<a id="c-sysadmin.disaster-recovery.3-2-1-rule"></a>
### 3-2-1 rule
*id: `sysadmin.disaster-recovery.3-2-1-rule` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: cisa-data-backup-options*

**What it is** A rule of thumb for backup arrangements, stated by CISA/US-CERT's *Data Backup
Options* as: keep 3 copies of any important file — one primary and two backups; keep them on
2 different media types; and store 1 copy off-site.

**Why it matters** It compresses three independent failure modes into one memorable rule.
Three copies covers a single copy going bad; two media types covers a fault that takes out a
whole class of device or a whole storage system; one off-site copy covers the fire, flood, or
theft that destroys the location. Drop any digit and one of those three failures becomes
unrecoverable.

**How it works** The counting is the part that trips people up: the 3 includes the original.
One primary plus two backups is three copies, not four — a candidate who reads "three copies"
as "three backups" over-counts by one. The 2 is media *types*, not two devices of the same
kind, so two disks in the same server satisfies neither the 2 nor the 1. The 1 off-site copy
is what turns a backup regime into disaster recovery rather than mere data protection.

**Key terms** three copies including the original; two media types; one off-site.

<a id="c-sysadmin.disaster-recovery.restore-testing"></a>
### Restore testing
*id: `sysadmin.disaster-recovery.restore-testing` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** Periodically performing an actual restore from backup media and verifying the
result, rather than trusting that the backup job reported success. An untested backup is an
assumption; a tested one is a recovery capability.

**Why it matters** This is the most commonly skipped step in the whole competency, and the
exam knows it. A backup job's exit status proves that bytes were written, not that they can
be read back, that the media is still readable, that the encryption key still exists, or that
the restored data is consistent. Each of those fails silently until someone tries.

**How it works** NIST SP 800-34 Rev. 1 defines testing as evaluation using quantifiable
metrics to validate operability in an environment as close to operational as possible, and
specifically directs that backup media be tested regularly to confirm data is stored
correctly and retrievable without errors — including testing the media *at the alternate
site*, to confirm that site supports the same backup configuration. A restore test therefore
produces a number: how long the restore took, and whether the result matched. That number is
what proves an RTO is achievable rather than aspirational.

**Key terms** verified restore; media readability; quantifiable metric; alternate-site test.

**Traps** Restore testing is not a disaster recovery drill. It validates a technical
component — the data comes back — and involves whoever runs the restore. A drill validates
the plan and the people. Passing a restore test says nothing about whether anyone knows who
declares a disaster or in what order systems come up.

**What the exam may test** Distinguishing "the backup completed successfully" from "the
backup was verified by restoring it," and identifying restore testing as the step that
converts a backup into a proven recovery capability.

*Not to be confused with [disaster recovery drill](disaster-recovery.md#cmp-sysadmin.disaster-recovery.disaster-recovery-drill).*

<a id="c-sysadmin.disaster-recovery.backup-retention"></a>
### Backup retention
*id: `sysadmin.disaster-recovery.backup-retention` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** The policy stating how long each backup copy is kept and when it expires,
balancing how far back a recovery can reach against storage cost and any legal or regulatory
obligation to hold — or to destroy — data by a given date.

**Why it matters** Retention, not backup frequency, decides whether a slow-burning problem is
recoverable. Corruption or a malicious deletion discovered six weeks later is only fixable if
a copy older than six weeks still exists; a regime that keeps seven daily backups and nothing
else cannot reach past a week, no matter how often it runs.

**How it works** A retention policy is one of the questions NIST SP 800-34 Rev. 1 says a
system backup policy must answer explicitly — how long media are retained, alongside where
they are stored and what the rotation schedule is — and it is bounded from below by media
life, since each medium has a storage life beyond which it cannot be relied on for recovery.
Tiered schemes (keep daily copies for weeks, weekly for months, monthly for years) exist to
extend reach without holding every copy forever.

**Key terms** retention period; expiry; rotation schedule; media life.

#### Scenario

A database server is deleted by a mistaken automation run at 02:00. The team's arrangement:
`rsync -a --delete` to a second host every 15 minutes, an LVM snapshot nightly, and a weekly
`tar` archive written to a NAS in the same rack. Work through it. The rsync target is a
mirror, so the deletion propagated within 15 minutes — no help. The LVM snapshot lived in the
same volume group as the deleted volume, so it went with it. The weekly `tar` archive
survives, because it is genuinely independent, but it is up to seven days stale — the actual
RPO is a week, not 15 minutes, and nobody had ever restored from it to find out whether the
NAS media was still readable. Three copies existed; none of the first two was a backup, and
the third had never been restore-tested.

#### Knowledge check

1. What single property separates a backup from a snapshot, a replica, and a RAID array?
   Independence from the original — a backup survives whatever destroys the source, while the
   others share its failure domain, propagate its writes, or both.
2. A restore is needed. How many media sets does it take under an incremental scheme, and
   under a differential scheme?
   Incremental: the last full plus every incremental since it, in order. Differential: the
   last full plus the single most recent differential.
3. "We replicate synchronously to a second region, so we are covered." What failure is that
   statement silently excluding?
   Logical loss — deletion, corruption, or ransomware encryption. Replication reproduces those
   writes on the replica; only a non-current, independent copy survives them.
4. In the 3-2-1 rule, how many *backups* are there, and what does the 2 refer to?
   Two backups, because the 3 counts the original as one of the three copies. The 2 is two
   different media types, not two devices of the same type.
5. A backup job has reported success every night for a year. What has that proved, and what
   has it not?
   It has proved bytes were written. It has not proved the media is readable, the key still
   exists, the data is consistent, or that a restore finishes inside the RTO — only a restore
   test shows that.
6. Backups run hourly and are kept for seven days. Corruption introduced five weeks ago is
   discovered today. Is it recoverable, and which policy decides?
   No. Retention, not frequency, sets how far back recovery can reach.

<a id="s-disaster-recovery-planning"></a>
## Planning

<a id="c-sysadmin.disaster-recovery.rpo"></a>
### RPO
*id: `sysadmin.disaster-recovery.rpo` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-glossary-rpo, nist-sp-800-34r1*

**What it is** Recovery Point Objective: the point in time to which data must be recovered
after an outage. In practice it is stated as a duration — "one hour" — meaning up to one
hour of the most recent data may be lost, and that loss is accepted in advance.

**Why it matters** RPO is the requirement that sets backup or replication frequency. An RPO
of 24 hours permits nightly backups; an RPO of five minutes rules backups out entirely and
forces continuous replication or log shipping. Every "how often should this be backed up"
question resolves to an RPO.

**How it works** RPO measures backwards from the moment of failure to the most recent
recoverable copy: whatever was written in the gap between that copy and the failure is gone.
NIST SP 800-34 Rev. 1 is explicit that, unlike RTO, RPO is not considered part of the maximum
tolerable downtime — it is a measure of how much data loss the business process can tolerate,
not of how long the outage may last.

**Key terms** data loss tolerance; backup frequency; last good copy; measured backwards.

**Traps** RPO is a quantity of *data*, expressed in units of time. That is what makes it
confusable with RTO, which is a quantity of *outage*, expressed in the same units. "Four
hours" as an answer is meaningless until you know which of the two it is. An RPO can never be
better than the interval between copies, so a stated RPO shorter than the backup schedule is
an unmet requirement, not a fact about the system.

**What the exam may test** Reading a stated requirement ("we can afford to lose no more than
15 minutes of transactions") and naming it as an RPO rather than an RTO, then deriving the
backup or replication frequency it implies.

<a id="cmp-sysadmin.disaster-recovery.rpo"></a>
#### Not to be confused with: RPO vs RTO
*compares: `sysadmin.disaster-recovery.rpo`, `sysadmin.disaster-recovery.rto`*

| | RPO | RTO |
| --- | --- | --- |
| What it caps | How much data may be lost | How long service may stay down |
| Direction from the failure | Backwards, to the last recoverable copy | Forwards, to service restored |
| What it dictates | Backup or replication frequency | Recovery method and standby capacity — site type, warm spares, HA |
| Met by | Copying more often | Recovering faster |
| Relation to maximum tolerable downtime (MTD) | Not part of MTD — a separate data-loss measure | Must normally be shorter than the MTD |

The separating axis is direction in time from the moment of failure: RPO looks backwards to
the last good copy, RTO looks forwards to service restored. Both are quoted in hours, which
is precisely why a question can offer them as alternatives.

<a id="c-sysadmin.disaster-recovery.rto"></a>
### RTO
*id: `sysadmin.disaster-recovery.rto` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-glossary-rto, nist-sp-800-34r1*

**What it is** Recovery Time Objective: the overall length of time a system's components may
be in the recovery phase before the organisation's mission or business processes are
negatively impacted. It is the maximum acceptable outage duration, agreed in advance.

**Why it matters** RTO is what selects the recovery *method*. Restoring a large dataset from
off-site media takes as long as it takes; if the RTO is shorter than that, no amount of backup
discipline meets it and the answer has to be standby capacity — a warm or hot site, a
replicated standby, an HA cluster. Cost rises steeply as the RTO shrinks, which is the
trade-off most site-selection questions are built on.

**How it works** RTO is derived from business impact, not from what the current infrastructure
happens to achieve. NIST SP 800-34 Rev. 1 defines it as the maximum time a system resource
can remain unavailable before there is unacceptable impact on other resources and on the MTD,
and notes the RTO must normally be shorter than the MTD, because reprocessing time after
recovery still has to fit inside the total tolerable downtime.

**Key terms** outage duration; maximum tolerable downtime; recovery method; standby capacity.

**Traps** RTO is a target, not a measurement — an organisation states it, and the
architecture is then bought to satisfy it. Confusing it with the *observed* recovery time, or
with MTTR (an average repair duration derived from past incidents), reverses the direction of
the relationship. Meeting a short RTO also does not imply a short RPO: a hot standby can be up
in minutes and still be missing the last hour of data if replication lags.

**What the exam may test** Matching a stated RTO to a recovery strategy — which alternate
site type or standby arrangement can actually deliver it — and separating it from the RPO
when both appear in the same scenario.

*Not to be confused with [hot, warm and cold sites](disaster-recovery.md#cmp-sysadmin.disaster-recovery.hot-warm-and-cold-sites).*
*Not to be confused with [RPO](disaster-recovery.md#cmp-sysadmin.disaster-recovery.rpo).*

<a id="c-sysadmin.disaster-recovery.disaster-recovery-plan"></a>
### Disaster recovery plan
*id: `sysadmin.disaster-recovery.disaster-recovery-plan` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-glossary-drp, nist-sp-800-34r1*

**What it is** A written plan for recovering one or more information systems at an alternate
facility after a major hardware or software failure or destruction of facilities. It names
who does what, in what order, with what authority to declare the disaster.

**Why it matters** The plan is the artefact that makes recovery repeatable by someone other
than the one engineer who knows the system. It is also the thing an exam scenario is usually
missing: a shop with good backups, a warm site, and no documented order of restoration will
still miss its RTO, because sequencing and decision authority are not technical problems.

**How it works** NIST SP 800-34 Rev. 1 scopes the DRP tightly: it is information
system-focused, applies to major, usually physical disruptions that deny access to the
primary facility for an extended period, and addresses only disruptions that require
relocation. It may support a business continuity plan by restoring the systems that the
business processes depend on. A plan that is written but never exercised is worth
proportionately less — which is what drills are for.

**Key terms** activation criteria; recovery sequence; roles and responsibilities; alternate
facility.

**Traps** The DRP is not the business continuity plan, and it is not the whole of disaster
recovery either — it is the document. It is also distinct from an incident response plan,
which handles security incidents, and from a continuity-of-operations plan, which is about
the organisation's essential functions rather than its systems.

**What the exam may test** Placing the DRP correctly in the plan hierarchy: narrower than
business continuity, system- and site-focused, invoked for events serious enough to require
relocation rather than for any outage.

*Not to be confused with [business continuity](disaster-recovery.md#cmp-sysadmin.disaster-recovery.business-continuity).*
*Not to be confused with [high availability vs disaster recovery](disaster-recovery.md#cmp-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery).*

<a id="c-sysadmin.disaster-recovery.business-continuity"></a>
### Business continuity
*id: `sysadmin.disaster-recovery.business-continuity` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-glossary-bcp, nist-sp-800-34r1*

**What it is** The discipline of sustaining an organisation's mission and business processes
during and after a significant disruption. Its artefact, the business continuity plan, is the
documented set of procedures for doing so; IT disaster recovery is one component of it.

**Why it matters** Continuity is the layer above the systems. It covers the things a DRP does
not: where staff work if the office is unusable, how customers are told, which processes run
manually while systems are down, which processes are allowed to stop. A candidate who treats
"business continuity" and "disaster recovery" as synonyms will pick the wrong scope on any
question that separates them.

**How it works** NIST SP 800-34 Rev. 1 draws the boundary by subject: continuity planning
applies to the mission or business itself and concerns the ability to keep critical functions
running during and after an event, while contingency and disaster recovery planning apply to
information systems and the steps needed to recover them. A business continuity plan is
written per business process — payroll, customer service — and coordinates with system owners
so that what the plan assumes and what the systems can deliver actually match.

**Key terms** mission/business process; manual workaround; scope above IT; disruption.

**Traps** Business continuity is not a bigger disaster recovery plan; it is a different
subject with a different unit of analysis. The DRP's unit is a system or a site. The BCP's
unit is a business process. A question naming a non-IT consequence — staff cannot reach the
building, a supplier has failed, the phone lines are down — is in continuity territory even
if servers are also involved.

**What the exam may test** Assigning a described responsibility to the right layer: restoring
the order-processing servers at an alternate site is disaster recovery; deciding that orders
will be taken on paper meanwhile is business continuity.

<a id="cmp-sysadmin.disaster-recovery.business-continuity"></a>
#### Not to be confused with: Business continuity vs Disaster recovery plan
*compares: `sysadmin.disaster-recovery.business-continuity`, `sysadmin.disaster-recovery.disaster-recovery-plan`*

| | Business continuity | Disaster recovery plan |
| --- | --- | --- |
| Unit of analysis | A mission or business process | An information system, at a site |
| Goal | Keep the organisation operating through the disruption | Restore system operability at an alternate facility |
| Scope of measures | Includes non-IT measures: alternate workspace, manual workarounds, communications | Technical recovery, sequencing, and roles for systems |
| Which contains which | The broader discipline; IT disaster recovery is one part of it | Supports the continuity plan by restoring the systems it depends on |
| Triggered by | Any significant disruption to processes | A major disruption requiring relocation to an alternate site |

The separating axis is the unit being recovered: continuity recovers a business process, the
disaster recovery plan recovers a system at a site. Everything else in the table follows from
that difference in scope.

<a id="c-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery"></a>
### High availability vs disaster recovery
*id: `sysadmin.disaster-recovery.high-availability-vs-disaster-recovery` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** Two different goals, addressed by different architectures. High availability
keeps a service running through the failure of a component inside a site — a disk, a node, a
network path — usually without anyone noticing. Disaster recovery restores a service after
the site or the system as a whole is lost. They are complements, not substitutes.

**Why it matters** This is the single most consequential confusion in the competency, because
the two are bought as though interchangeable. An HA cluster with 99.999% uptime does nothing
for a fire, a region-wide outage, or a corrupting write — and a good backup regime does
nothing for the node that fails at 14:00 on a Tuesday.

**How it works** NIST SP 800-34 Rev. 1 describes HA as building redundancy and failover into
a system to maximise uptime, targeting around 99.999% — a few minutes of downtime a year — by
duplicating hardware and adding failover software to eliminate single points of failure. It
then states the limit directly: HA cannot replace a solid backup strategy, because corruption
of data can propagate through an HA system and render it unusable, and without a copy held
separately from the system itself recovery may not be possible. HA implemented at a single
site protects only while that facility is intact, which is why the same guide recommends
extending HA mechanisms, such as block mirroring, to an alternate location.

**Key terms** uptime target; component failure; site loss; propagating corruption.

**Traps** "Highly available" is not "backed up," and "we have a DR site" is not "we have high
availability." A question describing an unnoticed, automatic recovery from one failed node is
HA; a question describing a declared, coordinated move to another location is DR. Also, HA
raises cost sharply and is worth it only for systems that genuinely cannot tolerate
downtime — an HA answer to a scenario with a 24-hour RTO is over-engineering, not the right
answer.

**What the exam may test** Given a failure and a proposed control, deciding whether the
control addresses that failure at all: HA for component failure, disaster recovery for site
or system loss, backups for logical loss.

<a id="cmp-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery"></a>
#### Not to be confused with: High availability vs disaster recovery, the disaster recovery plan, and failover and failback
*compares: `sysadmin.disaster-recovery.high-availability-vs-disaster-recovery`, `sysadmin.disaster-recovery.disaster-recovery-plan`, `sysadmin.disaster-recovery.failover-and-failback`*

| | High availability vs disaster recovery | Disaster recovery plan | Failover and failback |
| --- | --- | --- | --- |
| Category | A contrast between two goals | A document | A pair of operations |
| What it addresses | HA: a component failing inside a site. DR: the site or system being lost | How the recovery is carried out, by whom, in what order | Moving service onto a standby, and later moving it back |
| Human involvement | HA is designed to need none; DR is a declared, coordinated response | Written and invoked by people | HA failover is typically automatic; a DR cutover and almost all failback are decisions |
| Used by the other | Frames why both a DRP and failover exist | Specifies when failover is triggered and who declares it | The mechanism a DRP's cutover step actually executes |
| Its own blind spot | Neither goal covers logical corruption; that is what backups are for | A plan never drilled is unproven | Failback is the half most often untested, and can cause a second outage |

The separating axis is category, not subject matter: high availability versus disaster
recovery is a contrast between goals, the disaster recovery plan is the document that
executes one of them, and failover and failback are the operations that document invokes.

<a id="c-sysadmin.disaster-recovery.redundancy-and-single-points-of-failure"></a>
### Redundancy and single points of failure
*id: `sysadmin.disaster-recovery.redundancy-and-single-points-of-failure` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** Redundancy is duplicating a component so that no single failure stops the
service. A single point of failure (SPOF) is any component with no such duplicate — the one
whose loss takes everything with it.

**Why it matters** SPOF analysis is how an architecture is actually assessed. The useful
question is never "is this redundant" but "redundant against what": two power supplies in one
chassis do nothing about the chassis, two servers in one rack do nothing about the rack, two
racks in one building do nothing about the building. Each layer of duplication removes exactly
one class of failure.

**How it works** NIST SP 800-34 Rev. 1 treats eliminating single points of failure as a
design activity, listing redundant communications paths, fault tolerance in network
components, appropriately sized backup power, load balancing, and data mirroring among the
contingency measures to build in early — and specifically directs planners to identify the
single points of failure affecting critical systems, then to add duplicates only where the
cost is justified. Duplicating everything is not the goal; knowing which unduplicated
component is load-bearing is.

**Key terms** single point of failure; fault tolerance; failure domain; redundant path.

<a id="c-sysadmin.disaster-recovery.failover-and-failback"></a>
### Failover and failback
*id: `sysadmin.disaster-recovery.failover-and-failback` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** Failover is switching service onto a standby when the primary fails. Failback
is returning service to the primary once it is healthy again. They are two halves of one
operation, and only the first half is usually rehearsed.

**Why it matters** Failback is where recoveries go wrong a second time. While the standby has
been serving, it has accumulated data the primary never saw; returning to the primary means
reconciling that divergence, and doing so under time pressure, with the organisation already
believing the incident is over. A plan that documents failover and stops has documented half
a procedure.

**How it works** Failover redirects clients — by DNS change, by a load balancer or cluster
manager moving a virtual address, or by promoting a replica to primary — to a standby that
already holds the data. In an HA cluster this is automatic and takes seconds. In a
site-level disaster recovery cutover it is a deliberate decision, made against the plan's
activation criteria, because it is disruptive and hard to reverse. Failback then runs the
same machinery in the opposite direction, but with an extra step first: resynchronising the
primary from the standby, so no data written during the outage is lost on the way back.

**Key terms** standby promotion; cutover; resynchronisation; split-brain.

**Traps** Failover is not by itself disaster recovery — it is one mechanism a recovery uses,
and it is equally at home inside an HA cluster where no disaster has occurred. Nor is failing
over free: an automatic failover triggered by a network partition rather than a real failure
can leave two nodes each believing they are primary, which corrupts data rather than
protecting it.

**What the exam may test** Identifying failback as the untested half, and recognising that a
successful failover leaves an unfinished operation rather than a completed recovery.

*Not to be confused with [high availability vs disaster recovery](disaster-recovery.md#cmp-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery).*

<a id="c-sysadmin.disaster-recovery.off-site-and-geographic-redundancy"></a>
### Off-site and geographic redundancy
*id: `sysadmin.disaster-recovery.off-site-and-geographic-redundancy` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** Keeping copies of data, or standby capacity, far enough from the primary site
that a single physical event cannot destroy both. "Off-site" is the storage case; "geographic
redundancy" is the same idea applied to running capacity in another region.

**Why it matters** This is the digit in the 3-2-1 rule that most arrangements fail, and it is
the difference between surviving a disk and surviving a disaster. It is also where a plausible
wrong answer lives: a second data centre across the campus is off-site by the letter and
useless against the flood, fire, or power event that takes the campus.

**How it works** NIST SP 800-34 Rev. 1 lists geographic area as an explicit selection
criterion for offsite storage — the distance from the organisation and the probability of the
storage site being affected by the same disaster as the primary — alongside accessibility (how
long retrieval takes, and the facility's operating hours), security, environmental controls,
and cost. The same reasoning applies to alternate processing sites: the guide directs that a
fixed alternate site be in a geographic area unlikely to be affected by the same hazard as the
primary. Distance therefore trades against retrieval time and replication latency, and the
right distance is the smallest one that breaks the shared hazard.

**Key terms** shared hazard; retrieval time; region; offsite storage criteria.

<a id="c-sysadmin.disaster-recovery.hot-warm-and-cold-sites"></a>
### Hot, warm and cold sites
*id: `sysadmin.disaster-recovery.hot-warm-and-cold-sites` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1, nist-glossary-warm-site*

**What it is** Three levels of readiness at an alternate facility. A cold site is space, power
and environmental controls with no computer equipment and no telecommunications service in
place — NIST's alternate-site criteria table records hardware and telecommunications alike as
"None" — so it is a shell ready to receive replacement equipment. A warm site is partially
equipped: hardware and telecommunications are installed and available, but that equipment is
not loaded with the software or data needed to run the system, so a restore must run before it
can serve. A hot site is fully equipped and configured, with the current production software
installed and the most recent backup already loaded, so it needs only the data written since
that backup and can take over quickly. Cost falls and recovery time rises as you move from hot
to cold.

**Why it matters** Matching a site type to an RTO and a budget is a textbook question shape,
and it is decidable only if the three definitions are held apart precisely. The wrong mental
model — "a warm site is a hot site with a delay" — makes the middle option indistinguishable
from the top one and turns a three-way question into a coin flip.

**How it works** NIST SP 800-34 Rev. 1's alternate-site criteria table sets the three apart on
four axes at once. Cold: low cost, no hardware equipment, no telecommunications, long setup
time. Warm: medium cost, partial hardware, partial or full telecommunications, medium setup
time. Hot: medium-to-high cost, full hardware, full telecommunications, short setup time. The
NIST CSRC glossary reinforces the warm site's position — an environmentally conditioned work
space *partially* equipped with systems and telecommunications equipment — and the cold site's:
a facility with the electrical and physical components of a computer facility but without the
computer equipment in place, ready to receive replacement equipment. The guide's narrative
settles what each tier holds by way of data: a hot site should have the most recent version of
backed-up data loaded, requiring only updating with data since the last backup; a warm site's
equipment is installed but *not* loaded with the software or data required to operate the
system; a cold site has no equipment or telecommunications established or in place at all, so
everything — hardware, links, software, data — is acquired and loaded during the recovery.

**Key terms** alternate site; setup time; partially equipped; readiness tier.

**Traps** The warm site is where the marks are lost. It is partially equipped and its
equipment carries neither the operating software nor the data; the restore still has to happen
before it can serve, which is exactly why its setup time is "medium" rather than "short."
Treating it as a hot site that takes longer to switch on inverts the reason for the delay.
Note too that NIST's fully redundant,
real-time-mirrored facility is a separate variation — a *mirrored* site, identical to the
primary in all technical respects and the most expensive option — not a synonym for a hot
site.

**What the exam may test** Selecting the cheapest site type that still satisfies a stated
RTO, and identifying which type a described facility is from what it does and does not
contain.

<a id="cmp-sysadmin.disaster-recovery.hot-warm-and-cold-sites"></a>
#### Not to be confused with: Hot, warm and cold sites vs RTO
*compares: `sysadmin.disaster-recovery.hot-warm-and-cold-sites`, `sysadmin.disaster-recovery.rto`*

| | Hot, warm and cold sites | RTO |
| --- | --- | --- |
| What it names | Three levels of readiness at an alternate facility | A maximum acceptable outage duration |
| Category | A capability that is bought and maintained | A requirement that is set from business impact |
| Expressed as | Cost, hardware present, telecommunications present, setup time | A single number, in hours |
| Which constrains which | The site type is chosen to satisfy the RTO | The RTO is fixed first, independent of what any site can do |
| What a question asks | Which site type fits this recovery time and budget | Which objective this stated number is — outage length, not data loss |

The separating axis is requirement versus capability: the RTO is the target, and the site tier
is one of the things purchased in order to hit it. Reasoning in the other direction — deriving
the RTO from the site the organisation happens to have — is the error the pairing tests.

<a id="c-sysadmin.disaster-recovery.disaster-recovery-drill"></a>
### Disaster recovery drill
*id: `sysadmin.disaster-recovery.disaster-recovery-drill` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** A rehearsed exercise against a scenario, run to prove that the plan works and
that the people named in it know their roles. It ranges from a tabletop discussion to a full
failover of live service to the alternate site.

**Why it matters** A drill tests the parts of recovery that no technical check can reach:
whether anyone has authority to declare a disaster, whether the contact list is current,
whether the recovery order is right, whether the documented steps match the system as it
exists today. Those are the failures that turn a four-hour RTO into a two-day outage.

**How it works** NIST SP 800-34 Rev. 1, following SP 800-84, separates exercises from tests.
An exercise is a simulation of an emergency, scenario-driven, run to validate the viability of
one or more aspects of the plan, with the people who hold roles in it. Tabletop exercises are
discussion-based: participants meet, a facilitator presents a scenario, and they talk through
roles, responsibilities, coordination and decisions — with no equipment deployed. Functional
exercises go further, having personnel perform their duties in a simulated operational
environment, up to full-scale exercises covering all plan elements. Tests, by contrast, use
quantifiable metrics to validate that a system or component actually operates.

**Key terms** tabletop exercise; functional exercise; scenario-driven; plan validation.

**Traps** A drill is not a restore test. The restore test is a *test* in NIST's vocabulary —
it validates a component with a metric. The drill is an *exercise* — it validates the plan and
the people with a scenario. A tabletop drill in particular deploys no equipment at all, so
passing one proves the decision-making, not the technology; a shop can pass every tabletop and
still fail to restore.

**What the exam may test** Distinguishing exercise from test, and tabletop from functional:
which one validates data recoverability, which validates roles and coordination, and which
deploys nothing.

<a id="cmp-sysadmin.disaster-recovery.disaster-recovery-drill"></a>
#### Not to be confused with: Disaster recovery drill vs Restore testing
*compares: `sysadmin.disaster-recovery.disaster-recovery-drill`, `sysadmin.disaster-recovery.restore-testing`*

| | Disaster recovery drill | Restore testing |
| --- | --- | --- |
| NIST category | An exercise — a scenario-driven simulation | A test — component validation with quantifiable metrics |
| What it validates | The plan, the sequence, and the people's roles | That the backup media can actually be read back and the data is intact |
| Who takes part | Everyone with a role in the plan | Whoever operates the backup system |
| Typical form | Tabletop discussion, or a functional exercise up to full failover | An actual restore to a scratch target, timed and verified |
| What passing does not prove | That the data restores — a tabletop deploys no equipment | That anyone knows who declares a disaster, or in what order systems come up |

The separating axis is what is under test: the drill exercises the plan and the people, the
restore test exercises the data path. Neither substitutes for the other, and an organisation
that does only one has an untested half.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `sysadmin.disaster-recovery.mttr-and-mtbf` | MTTR and MTBF | Usually stated as: mean time to repair is the average time a fix takes once something has broken, and mean time between failures the average interval between breakages. | Both are observed averages, not targets: the target is the RTO, and quoting an MTTR where a scenario asks for an objective reverses that. MTBF is a frequency and says nothing about recovery speed — reliability work raises MTBF, recovery work lowers MTTR, and improving one does not improve the other. *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* |

#### Scenario

A retailer sets an RTO of four hours and an RPO of 15 minutes for its order system, and is
offered three options. A cold site is cheapest but has no equipment at all, so its setup time
runs to days — it cannot meet a four-hour RTO. A warm site holds partial hardware but nothing
loaded on it, so the software and data have to be restored before it serves; whether it fits
depends entirely on how long that restore takes, which only a timed restore test can answer. A
hot site already has the last backup loaded and a short setup time, so it clears the RTO with
only the writes since that backup to make up, at the highest cost. The RPO is a
separate decision: 15 minutes rules out nightly backups and forces replication, and the
replica is not a backup, so independent copies must still be kept off-site under the 3-2-1
rule. Finally, the team schedules a tabletop drill — which will validate who declares the
cutover and in what order systems come back, but will deploy nothing and prove nothing about
the media.

#### Knowledge check

1. A requirement says "no more than 30 minutes of data may be lost." Which objective is that,
   and what does it constrain?
   RPO. It constrains how often data is copied — backup or replication frequency — not how
   long the outage may last.
2. In one sentence, what is the difference in scope between a disaster recovery plan and
   business continuity?
   The DRP recovers information systems at a site; business continuity keeps the
   organisation's business processes running, and IT disaster recovery is one part of it.
3. An HA cluster survived a node failure invisibly last month. What class of failure does that
   say nothing about?
   Site loss and logical corruption — corruption propagates through the redundant copies, so
   HA is not a substitute for backups or for a disaster recovery capability.
4. What exactly is a warm site missing that a hot site has, and what follows from that?
   Installed equipment carrying the production software with the most recent backup already
   loaded — a hot site needs only the data written since that backup, while a warm site has no
   software or data loaded at all, so a full restore must run first. That is why its setup time
   is medium rather than short, not because it is a hot site with a delay.
5. Which half of failover/failback is usually untested, and why is that dangerous?
   Failback. The standby has accumulated data the primary never saw, so returning without
   resynchronising risks losing the outage's work or causing a second outage.
6. A team passed its annual tabletop exercise. Does that prove backups are restorable?
   No. A tabletop is discussion-based and deploys no equipment; only a restore test — a test,
   not an exercise — proves the data comes back.
