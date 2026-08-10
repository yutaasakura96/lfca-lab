# System Administration Fundamentals

This domain carries 30% of the exam — 1st largest of 6 domains — across five competencies and
173 concepts. Two of those competencies did not exist before the current blueprint took effect
on 2025-09-16, one was reworded substantively, and two are unchanged. LFS200 leaves the
majority of it uncovered: summing the five per-competency figures below gives 28 of 173
concepts that LFS200 touches at all. This file is a map, not a lesson — it defines nothing.
Every concept in the domain is defined exactly once, in the competency file linked from the
section map.

## The weight change, and what it costs you

The domain was 20% under the previous blueprint and is 30% now (`data/competencies.json`,
`previous_weight` 20 against `weight` 30). That is the largest weight increase of any domain
in the 2025 update, and it moved System Administration Fundamentals from joint-largest to
outright largest. The other five domains are Cloud Computing Fundamentals 18, Linux
Fundamentals 16, Security Fundamentals 14, DevOps Fundamentals 12, and IT Project Management
Fundamentals 10 — so this domain now outweighs the next largest by 12 points, and outweighs
DevOps and IT Project Management combined.

Three consequences for study effort, given a 90-minute multiple-choice exam with a 75% pass
mark and no practical component:

- **This domain cannot be triaged.** At 20% a candidate could concede a domain outright and
  still clear 75% on the rest. At 30% that is arithmetically impossible: conceding it caps the
  achievable score at 70%.
- **A 71% score is 4 points of the whole exam short.** Because the domain is 30% of the total,
  closing that entire 4-point gap inside this domain alone means gaining a little over 13
  percentage points of this domain's own marks. That is a realistic target for 173 concepts,
  and it is the cheapest place on the exam to find 4 points.
- **Weight is not evenly distributed inside the domain.** System Administration (71 concepts)
  and Networking (49) are 120 of the 173. Best Practices (20), Disaster Recovery (18) and
  Troubleshooting (15) are the remaining 53. The exam does not publish a per-competency
  breakdown, so treat concept count as the only available proxy — but do not let it push
  Disaster Recovery and Best Practices to the end of the schedule, for the reason in the next
  section.

## What the 2025 update changed here

Per-competency 2025 status, as `npm run guide-plan` reports it:

| Competency | 2025 status | Previous name | Concepts |
| --- | --- | --- | ---: |
| System Administration | reworded (substantive) | System Administration Tasks | 71 |
| Best Practices | added | — | 20 |
| Networking | unchanged | Networking | 49 |
| Troubleshooting | unchanged | Troubleshooting | 15 |
| Disaster Recovery | added | — | 18 |

**Best Practices and Disaster Recovery are new in the 2025 update, so no pre-2025 material
covers either of them.** That is 38 of the domain's 173 concepts — 22% of the domain — for
which every practice test, course, video and study guide predating 2025-09-16 is silent by
construction, not by oversight. A candidate who prepared from older material and scored 71%
should assume those 38 concepts were near-total losses rather than partial ones, and should
not read a low score on them as a comprehension problem.

The rewording of System Administration is marked `substantive` rather than `formatting`, which
in `data/competencies.json` means the scope or emphasis plausibly changed between the retired
"System Administration Tasks" wording and the current one. Pre-2025 material on it is not
void, but it cannot be assumed complete either.

Networking and Troubleshooting are unchanged, so older material on them remains valid — which
makes them the two places in this domain where prior preparation still pays, and therefore the
two places where a 71% score most likely reflects genuine gaps rather than missing syllabus.

## Where LFS200 leaves you

Coverage figures below are the LFS200 breakdown printed by `npm run guide-plan` for each
competency, alongside the per-competency row from `research/lfs200-notes/00-course-map.md`.
The course-map percentages are a lower bound — a concept can be taught without its name
appearing — and the map says so explicitly.

| Competency | LFS200 breakdown (guide-plan) | Course-map row | Lessons |
| --- | --- | --- | ---: |
| System Administration | 5 MENTIONED ONLY, 52 NOT COVERED, 9 FULLY COVERED, 5 PARTIALLY COVERED — 19/71 (27%) are not NOT COVERED | 27%, 19/71 | 5 |
| Networking | 40 NOT COVERED, 4 PARTIALLY COVERED, 2 MENTIONED ONLY, 3 FULLY COVERED — 9/49 (18%) are not NOT COVERED | 18%, 9/49 | 2 |
| Troubleshooting | 15 NOT COVERED — 0/15 (0%) are not NOT COVERED | 0%, 0/15 | 1 |
| Best Practices | 20 NOT COVERED — 0/20 (0%) are not NOT COVERED | 0%, 0/20 | 0 |
| Disaster Recovery | 18 NOT COVERED — 0/18 (0%) are not NOT COVERED | 0%, 0/18 | 1 |

The domain's position in the course map is specific, and it is two positions at once:

- **This domain holds the course's third-best-covered competency and several of its worst.**
  System Administration's 27% is the highest figure of the five, and 3rd of the 22 competency
  rows in the course map's table. Networking's 18% is 5th of 22. The other three are at the
  bottom, tied on 0% with seven other competencies.
- **The course spends more text on this domain than on any other and still leaves 145 of 173
  concepts NOT COVERED.** LFS200's two largest lessons both serve it: ch6.l2 Linux Commands at
  24,959 characters, the largest lesson in the course, and ch7.l3 Network Troubleshooting at
  14,657, which the course map calls the course's strongest material. Volume of instruction is
  not the constraint; syllabus alignment is.
- **Best Practices is one of the six competencies with no lesson at all**, and Disaster
  Recovery has a lesson in name only — the `Backup` page, which contains one character. The
  course map names Disaster Recovery and this domain's Best Practices among the highest-risk
  areas on the exam for exactly this reason.
- **Troubleshooting's 0% is the course map's own worked example of the lower-bound caveat.**
  Its concepts are method-level, and ch7.l3 teaches the method procedurally without naming
  them. Re-reading that lesson is worthwhile despite the 0%; the figure measures vocabulary
  match, not instruction.

Measured absences that fall inside this domain are the highest-confidence evidence in the
course map, since a term with zero occurrences across 158,185 characters is genuinely absent.
Every one of `cron`, `crontab`, `journalctl`, `umask`, `SUID`, `SGID`, `sticky bit`, `ufw`,
`/etc/fstab`, `/etc/hosts`, `/var/log`, `nslookup`, `ifconfig` and `LVM` occurs zero times, as
does the entire disaster-recovery vocabulary — `disaster recovery`, `business continuity`,
`failover`, `redundancy`, `high availability`, `replication`, `RTO`, `RAID`. Those terms are
all defined in the files below, and none of them can be revised from the course. The same
absence list also names `SELinux` and `LUKS`, which read as system administration but are
scoped to Security Fundamentals — they are defined there, not in any file below.

## Section map

Every `## ` section in every competency file of this domain, in file order.

### [System Administration](02-system-administration/system-administration.md) — 71 concepts, 9 sections

- [Users and groups](02-system-administration/system-administration.md#s-system-administration-users-and-groups)
- [Permissions](02-system-administration/system-administration.md#s-system-administration-permissions)
- [Processes](02-system-administration/system-administration.md#s-system-administration-processes)
- [Services and init](02-system-administration/system-administration.md#s-system-administration-services-and-init)
- [Package management](02-system-administration/system-administration.md#s-system-administration-package-management)
- [Filesystem](02-system-administration/system-administration.md#s-system-administration-filesystem)
- [Scheduled tasks](02-system-administration/system-administration.md#s-system-administration-scheduled-tasks)
- [Logging](02-system-administration/system-administration.md#s-system-administration-logging)
- [Boot](02-system-administration/system-administration.md#s-system-administration-boot)

### [Best Practices](02-system-administration/best-practices.md) — 20 concepts, 1 section

- [Operational discipline](02-system-administration/best-practices.md#s-best-practices-operational-discipline)

### [Networking](02-system-administration/networking.md) — 49 concepts, 10 sections

- [Models](02-system-administration/networking.md#s-networking-models)
- [IP addressing](02-system-administration/networking.md#s-networking-ip-addressing)
- [Routing](02-system-administration/networking.md#s-networking-routing)
- [Name resolution](02-system-administration/networking.md#s-networking-name-resolution)
- [Address assignment](02-system-administration/networking.md#s-networking-address-assignment)
- [Transport](02-system-administration/networking.md#s-networking-transport)
- [Application protocols](02-system-administration/networking.md#s-networking-application-protocols)
- [Performance](02-system-administration/networking.md#s-networking-performance)
- [Filtering](02-system-administration/networking.md#s-networking-filtering)
- [Diagnostics](02-system-administration/networking.md#s-networking-diagnostics)

### [Troubleshooting](02-system-administration/troubleshooting.md) — 15 concepts, 2 sections

- [Method](02-system-administration/troubleshooting.md#s-troubleshooting-method)
- [Common faults](02-system-administration/troubleshooting.md#s-troubleshooting-common-faults)

### [Disaster Recovery](02-system-administration/disaster-recovery.md) — 18 concepts, 2 sections

- [Backups](02-system-administration/disaster-recovery.md#s-disaster-recovery-backups)
- [Planning](02-system-administration/disaster-recovery.md#s-disaster-recovery-planning)

## Recommended study order

Read the five files in this order. The order is driven by one structural fact — Troubleshooting
is downstream of the other files — and by where the 2025 additions sit.

1. **[System Administration](02-system-administration/system-administration.md).** Largest
   competency in the largest domain, and the mechanism layer the rest of the domain is stated
   in. Five of the seven faults named in Troubleshooting's Common faults section resolve into
   its sections: service will not start into Services and init, disk full into Filesystem, out
   of memory and high CPU load into Processes, permission denied into Permissions. It is also
   the only file in the domain with depth-5 concepts — four of them — so it carries the
   heaviest per-topic treatment and rewards the freshest attention.
2. **[Networking](02-system-administration/networking.md).** Second-largest, and it supplies
   the remaining two Common faults entries — cannot connect to a service, and name resolution
   failure. Its ten sections run in the order a packet actually travels, so reading it in file
   order is itself the argument; reading it out of order forfeits that. Unchanged in 2025 and
   the domain's second-best LFS200 position, so this is where existing preparation carries
   furthest.
3. **[Troubleshooting](02-system-administration/troubleshooting.md).** Read only after 1 and 2.
   Eight of its fifteen concepts are depth 4, the only competency in the domain where diagnostic
   depth dominates, and its Common faults section names failure modes whose mechanisms live in
   the two files above. Read first, it degrades into a symptom list to be memorised; read here,
   every entry is a pointer to something already understood. Its Method section is the exception
   — it is self-contained, and questions asking what to do *first* are testing that ordering
   alone.
4. **[Disaster Recovery](02-system-administration/disaster-recovery.md).** Added in 2025, zero
   LFS200 coverage, and almost entirely independent of the first three files, so it can be
   studied cold at any point. It is placed fourth rather than last because 18 concepts of
   wholly unfamiliar material need spacing before the exam, not a final-week cram — and because
   the pre-2025 material a repeat candidate is likely to reuse will not remind them it exists.
5. **[Best Practices](02-system-administration/best-practices.md).** Added in 2025, zero LFS200
   coverage, and 7 of its 20 concepts are waived for want of a primary documentation source, so
   they are stated as consensus practice rather than citable fact. It goes last because it is
   the most abstract file in the domain and the one that most needs concrete referents already
   in memory: its patch cadence topic is the discipline around System Administration's patch
   management, and its monitoring and alerting topic is stated against journald. Read cold,
   those distinctions are vocabulary; read after 1 to 4, they are decisions.

Two caveats on the order. It is a reading order for first coverage, not a revision order — for
revision, work the comparison blocks below directly, since a multiple-choice exam tests
discrimination between named alternatives rather than recall of a single term. And the file
sizes are wildly uneven: 1 and 2 together are 120 of 173 concepts, so a schedule that allots
equal time per file will overspend on 3 to 5 by a wide margin.

## Comparison blocks in this domain

Forty-eight comparison blocks, each the canonical treatment of one confusable pair or group.
Every one is the definition site for its distinction; nothing here is restated elsewhere.
Working these directly is the highest-yield revision available for a multiple-choice exam.

### System Administration — 23 blocks

| Block | Section |
| --- | --- |
| [Group vs User account](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.group) | Users and groups |
| [UID and GID vs User account](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.uid-and-gid) | Users and groups |
| [Primary vs supplementary group vs Group](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.primary-vs-supplementary-group) | Users and groups |
| [/etc/passwd vs /etc/shadow](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.etc-passwd) | Users and groups |
| [/etc/group vs /etc/passwd](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.etc-group) | Users and groups |
| [Service account vs User account](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.service-account) | Users and groups |
| [Symbolic vs numeric chmod vs Reading ls -l output vs umask](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.symbolic-vs-numeric-chmod) | Permissions |
| [SGID vs sticky bit vs SUID](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.sgid) | Permissions |
| [sudo vs su vs Root and least privilege](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.sudo-vs-su) | Permissions |
| [Process vs Service vs Zombie and orphan processes](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.process) | Processes |
| [Process priority and nice vs Signals](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.process-priority-and-nice) | Processes |
| [Daemon vs Process](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.daemon) | Processes |
| [Runlevel vs systemd vs systemd target](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.runlevel) | Services and init |
| [Package vs Language package managers vs Repository](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.package) | Package management |
| [apt and dpkg vs dnf, yum and rpm](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.apt-and-dpkg) | Package management |
| [Filesystem Hierarchy Standard vs Filesystem type](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.filesystem-hierarchy-standard) | Filesystem |
| [/dev vs /proc and /sys](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.dev) | Filesystem |
| [Mounting vs Partition](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.mounting) | Filesystem |
| [Hard link vs symbolic link vs inode](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.hard-link-vs-symbolic-link) | Filesystem |
| [cron vs systemd timer](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.cron) | Scheduled tasks |
| [journald vs Monitoring and alerting vs syslog and severity levels](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.journald) | Logging |
| [Boot process vs Bootloader and GRUB](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.boot-process) | Boot |
| [BIOS vs UEFI vs Bootloader and GRUB](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.bios-vs-uefi) | Boot |

### Networking — 13 blocks

| Block | Section |
| --- | --- |
| [OSI model vs TCP/IP model](02-system-administration/networking.md#cmp-sysadmin.networking.osi-model) | Models |
| [IPv4 address vs IPv6 address vs MAC address](02-system-administration/networking.md#cmp-sysadmin.networking.ipv4-address) | IP addressing |
| [Network, host and broadcast addresses vs Subnet mask and CIDR](02-system-administration/networking.md#cmp-sysadmin.networking.network-host-and-broadcast-addresses) | IP addressing |
| [Private vs public IP addresses vs NAT](02-system-administration/networking.md#cmp-sysadmin.networking.private-vs-public-ip-addresses) | IP addressing |
| [Static vs dynamic addressing vs DHCP vs DHCP reservation](02-system-administration/networking.md#cmp-sysadmin.networking.static-vs-dynamic-addressing) | IP addressing |
| [ARP vs DNS](02-system-administration/networking.md#cmp-sysadmin.networking.arp) | IP addressing |
| [IPv4 address classes vs Subnet mask and CIDR](02-system-administration/networking.md#cmp-sysadmin.networking.ipv4-address-classes) | IP addressing |
| [Router vs switch vs MAC address](02-system-administration/networking.md#cmp-sysadmin.networking.router-vs-switch) | Routing |
| [/etc/hosts vs /etc/resolv.conf](02-system-administration/networking.md#cmp-sysadmin.networking.etc-hosts) | Name resolution |
| [DHCP vs DNS](02-system-administration/networking.md#cmp-sysadmin.networking.dhcp) | Address assignment |
| [Well-known ports vs Port ranges](02-system-administration/networking.md#cmp-sysadmin.networking.well-known-ports) | Transport |
| [Load balancer vs Proxy](02-system-administration/networking.md#cmp-sysadmin.networking.load-balancer) | Application protocols |
| [Firewall vs ufw, firewalld and iptables](02-system-administration/networking.md#cmp-sysadmin.networking.firewall) | Filtering |

### Disaster Recovery — 6 blocks

| Block | Section |
| --- | --- |
| [Backup vs version control, archiving, replication, snapshots and RAID](02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.backup) | Backups |
| [RPO vs RTO](02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.rpo) | Planning |
| [Business continuity vs Disaster recovery plan](02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.business-continuity) | Planning |
| [High availability vs disaster recovery, the disaster recovery plan, and failover and failback](02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.high-availability-vs-disaster-recovery) | Planning |
| [Hot, warm and cold sites vs RTO](02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.hot-warm-and-cold-sites) | Planning |
| [Disaster recovery drill vs Restore testing](02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.disaster-recovery-drill) | Planning |

### Best Practices — 5 blocks

| Block | Section |
| --- | --- |
| [Documentation vs Runbooks](02-system-administration/best-practices.md#cmp-sysadmin.best-practices.documentation) | Operational discipline |
| [Change management vs Version control](02-system-administration/best-practices.md#cmp-sysadmin.best-practices.change-management) | Operational discipline |
| [Automation and idempotency vs Configuration management](02-system-administration/best-practices.md#cmp-sysadmin.best-practices.automation-and-idempotency) | Operational discipline |
| [Configuration management vs Infrastructure as code](02-system-administration/best-practices.md#cmp-sysadmin.best-practices.configuration-management) | Operational discipline |
| [Patch cadence vs Patch management](02-system-administration/best-practices.md#cmp-sysadmin.best-practices.patch-cadence) | Operational discipline |

### Troubleshooting — 1 block

| Block | Section |
| --- | --- |
| [Structured troubleshooting method vs Narrowing scope](02-system-administration/troubleshooting.md#cmp-sysadmin.troubleshooting.structured-troubleshooting-method) | Method |

The distribution is itself informative. Twenty-three of the forty-eight blocks are in System
Administration and thirteen in Networking — the two competencies where the exam has the most
adjacent, plausibly-confusable terms to build distractors from. Best Practices, with one
section and twenty concepts, carries five; Troubleshooting carries one, because its concepts
are steps in a sequence rather than alternatives to be told apart.

## Where this domain reads out to other domains

Two comparison pointers in this domain resolve outside it, and both are worth following once
the neighbouring domain has been read:

- Networking's firewall topic points at
  [security group vs network ACL](03-cloud-computing/networking.md#cmp-cloud.networking.security-group-vs-network-acl)
  in Cloud Computing Fundamentals — the same filtering decision expressed in provider terms.
- System Administration's `/home` topic points at
  [root directory vs /root vs home](01-linux-fundamentals/command-line.md#cmp-linux.command-line.root-directory-vs-root-vs-home)
  in Linux Fundamentals.

Inside the domain, three pointers cross files: System Administration's patch management topic
points at Best Practices' patch cadence block, System Administration's RAID levels topic points
at Disaster Recovery's backup block, and Best Practices' monitoring and alerting topic points
at System Administration's journald block. Each of those three is a pair the exam can put in
one question, and each is the reason the recommended order above puts Best Practices after the
material it disciplines.
