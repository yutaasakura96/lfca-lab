# Best Practices

Best Practices is the competency covering the design, security and operational habits a cloud
deployment is judged against once it already works: assuming failure, spreading across zones,
provisioning through code, holding identity and secrets correctly, and running the resulting
system with backups, audit logs, tags, right-sized capacity and clean instance replacement. It
sits in Cloud Computing Fundamentals, 18% of the exam — 2nd largest of 6 domains — and the
competency was added in the 2025 update, so no pre-2025 material covers it. LFS200 does not
reach it either: all 15 concepts are NOT COVERED — 0/15 (0%) are not NOT COVERED — so every
topic below is sourced independently of the course
(`research/lfs200-notes/00-course-map.md`). The exam's leverage here is not "is this a good
idea" — every practice named below is obviously a good idea. It is which practice answers the
described problem, and which nearly identical practice does not.

<a id="s-best-practices-architecture"></a>
## Architecture

<a id="c-cloud.best-practices.design-for-failure"></a>
### Design for failure
*id: `cloud.best-practices.design-for-failure` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-reliability-pillar*

**What it is** A design assumption, not a product: every component — instance, disk, zone,
dependency, network path — will fail, so the architecture is built so that its failure is a
routine, absorbed event rather than an incident. It is the opposite stance to designing for
correct operation and bolting on exception handling afterwards.

**Why it matters** It is the assumption the reliability pillar of a well-architected review
tests for, and it is what separates a system that survives an instance loss from one that
merely has not lost an instance yet. On the exam it is the reasoning behind almost every other
Architecture answer: multi-zone deployment, health checks and instance replacement are all
consequences of having made this assumption.

**How it works** Concretely: no single instance holds state that cannot be lost, dependencies
are assumed to time out and are given timeouts and retries, capacity is redundant so the loss
of one unit is absorbed rather than announced, and recovery is automated so it does not wait
on a human. Failure is expected, detected, and replaced.

**Key terms** single point of failure; blast radius; redundancy; automated recovery.

<a id="c-cloud.best-practices.multi-zone-deployment"></a>
### Multi-zone deployment
*id: `cloud.best-practices.multi-zone-deployment` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-regions-and-azs, azure-availability-zones*

**What it is** Spreading a workload's instances across two or more availability zones inside
one region, so the loss of a single datacentre location does not take the service with it. An
availability zone is an isolated location within a region — on Azure, a separated group of
datacenters with independent power, cooling and networking; on AWS, one of several isolated
locations whose code is the region code plus a letter, such as `us-east-1a`.

**Why it matters** This is the most commonly mis-scoped answer in the competency. Multi-zone
protects against a zone-level failure inside a region; it does not protect against the loss of
the whole region, and it does nothing for a data-residency requirement that names a country.
Those are multi-region problems. Multi-zone is also not multi-cloud, and not the same as
taking a backup.

**How it works** Regions are separate geographic areas, isolated from each other, with no
automatic replication between them. Zones inside one region sit far enough apart to fail
independently — Azure states they are typically separated by several kilometres and usually
within 100 km of each other — but close enough that inter-zone latency stays low, which is
what makes synchronous replication across zones practical and cross-region replication
awkward. Some managed services spread themselves across zones automatically (Azure calls these
zone-redundant); others are pinned to one zone and must be deployed per zone deliberately.

**Key terms** availability zone; region; zone-redundant; zonal.

<a id="c-cloud.best-practices.automation-over-manual-configuration"></a>
### Automation over manual configuration
*id: `cloud.best-practices.automation-over-manual-configuration` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-pillars*

**What it is** Expressing infrastructure and configuration as code that a machine applies,
rather than as a sequence of console clicks a person performs. The artifact of the change is a
reviewable, version-controlled file, not a memory of what somebody did in a web console at
three in the morning.

**Why it matters** It converts three separate problems into one solved problem. Reproducibility:
staging and production come from the same definition, so "it works in staging" means something.
Reviewability: an infrastructure change goes through the same diff-and-approve path as an
application change, so a security group opened to the world is caught in review rather than in
an incident. Auditability: the definition itself records what the environment is supposed to be,
which is what any drift detection compares against. The operational excellence pillar of a
well-architected review asks for exactly this.

**How it works** A declarative definition states the desired end state — this many instances,
this network, these permissions — and a tool reconciles the running environment against it,
creating, changing or destroying resources until they match. Because the definition is a file,
it is diffed, reviewed, tagged with a release, and reapplied identically into a second account
or region. Manual console changes made outside that loop are drift: the environment no longer
matches its definition, and the next apply will either revert them silently or fail.

**Key terms** infrastructure as code; declarative; desired state; drift; reconciliation.

**Traps** Automation is not the same thing as immutability, and this is the pair the exam
draws from. Configuration management that logs into long-lived servers and patches them in
place is fully automated and fully mutable — every server is still a unique accumulation of
applied changes. Conversely, an image built by hand and then deployed without modification is
immutable and not automated. The second trap is scope: automating provisioning does not by
itself eliminate drift, because anyone with console access can still make a change out of
band; drift is only eliminated when the definition is reapplied continuously, or when the
instance is replaced rather than edited.

**What the exam may test** Given a described remedy — "the team now defines environments in a
version-controlled template and applies it to both staging and production" versus "the team now
builds a new image for every change and replaces the running instances" — identifying which
practice is being described, and which problem it actually fixes: unreproducible environments
and unreviewed changes for the first, configuration drift for the second.

<a id="cmp-cloud.best-practices.automation-over-manual-configuration"></a>
#### Not to be confused with: Automation over manual configuration vs Immutable infrastructure
*compares: `cloud.best-practices.automation-over-manual-configuration`, `cloud.best-practices.immutable-infrastructure`*

| | Automation over manual configuration | Immutable infrastructure |
| --- | --- | --- |
| What it governs | How a change is expressed and applied — as reviewable code, not console clicks | What happens to a running instance when it must change — it is replaced, not edited |
| The practice it replaces | Manual console configuration performed by a person | In-place modification of a long-lived server |
| Can exist without the other | Yes — automated configuration management that patches long-lived servers in place is automated but mutable | Yes — a hand-built image deployed unmodified is immutable but not automated |
| Effect on configuration drift | Reduces it; eliminates it only if the definition is reapplied continuously | Eliminates it by construction — nothing survives long enough to drift |
| Where a change is made | In the definition file, then reconciled | In a new image or artifact, then rolled out as replacement instances |
| How a rollback works | Reapply the previous definition | Redeploy the previous image and replace the instances again |

The separating axis is what is being constrained: automation constrains the *authoring* of a
change; immutability constrains the *lifetime* of the thing changed. Everything else in the
table follows from that.

<a id="c-cloud.best-practices.immutable-infrastructure"></a>
### Immutable infrastructure
*id: `cloud.best-practices.immutable-infrastructure` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-reliability-pillar*

**What it is** A deployment model in which a running instance is never modified after it is
created. Any change — a package update, a config edit, a new application version — produces a
new image or artifact, and the running instances are replaced by fresh ones built from it. The
old instances are terminated, not repaired.

**Why it matters** It is the only practice in this competency that eliminates configuration
drift rather than merely reducing it. On a long-lived, mutable server, the running state is the
sum of every patch, hotfix and emergency edit ever applied to it, and no two servers in the
fleet accumulate the same history — which is why one node fails in a way its identical siblings
do not. If the maximum age of an instance is a deployment cycle, that history cannot accumulate.
It also makes rollback trivial and, incidentally, makes the reliability practice of routinely
replacing instances safe to do at all.

**How it works** The build produces a versioned artifact — a machine image or container image —
containing the application and its configuration. Deployment launches new instances from that
artifact and shifts traffic to them, then drains and terminates the old ones; blue/green and
rolling replacement are the two common shapes. Rollback is redeploying the previous artifact,
not reversing a patch. Because the instance is disposable, any state it must keep has to live
somewhere else.

**Key terms** machine image; artifact version; blue/green; rolling replacement; disposability.

**Traps** "Immutable" describes the instance, not the data. Anything the workload must not lose
has to be externalised — into a managed database, object storage, or a volume whose lifecycle
is independent of the instance — because replacement destroys everything local. A workload that
writes user uploads to the instance's own disk breaks the moment immutability is adopted, and
the failure looks like data loss rather than like a design error. Second trap: immutable does
not mean unchanging. Changes are frequent; they simply arrive as replacements. Third: patching
an immutable instance by SSHing in and running the package manager does not fail loudly — it
works, and then silently disappears at the next deployment, which is worse.

**What the exam may test** Recognising immutability as the answer to a configuration-drift or
"snowflake server" scenario, distinguishing it from automation as such, and knowing the
precondition it imposes: state must be externalised before instances can be treated as
disposable.

*Not to be confused with [automation over manual configuration](best-practices.md#cmp-cloud.best-practices.automation-over-manual-configuration).*

<a id="c-cloud.best-practices.well-architected-review"></a>
### Well-architected review
*id: `cloud.best-practices.well-architected-review` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-pillars, azure-well-architected-pillars*

**What it is** A structured assessment of a workload against a published set of architectural
pillars, rather than against the single question of whether it currently works. AWS names
**six** pillars: operational excellence, security, reliability, performance efficiency, cost
optimization, and sustainability — sustainability was added in December 2021, so any source
saying "five pillars" predates it. Azure's Well-Architected Framework names five: reliability,
security, cost optimization, operational excellence, and performance efficiency, with no
sustainability pillar.

**Why it matters** The number and names of the pillars are directly recallable facts, and the
five/six discrepancy between the two major providers is exactly the kind of near-miss a
multiple-choice option is built from. More usefully, the pillar set is the vocabulary the rest
of this competency is organised by: encryption and least privilege are the security pillar,
multi-zone deployment is reliability, right-sizing is cost optimization, tagging and logging
are operational excellence.

**How it works** A review walks the workload through questions grouped by pillar and produces
a prioritised list of improvements and the tradeoffs between pillars — more redundancy costs
more, tighter security can cost latency. It is an improvement exercise, not an audit, not a
certification, and not pass/fail; nothing is issued at the end of one except findings.

**Key terms** pillar; tradeoff; operational excellence; sustainability.

#### Scenario

A team runs a single production instance in one availability zone, patches it by hand over SSH,
and has no record of how it was configured. Separate the three defects, because the fixes are
different practices. The single instance in a single zone is a design-for-failure defect, fixed
by redundant capacity spread across zones — but note that multi-zone still leaves the workload
exposed to the loss of the entire region, which is a different problem. The undocumented
configuration is fixed by defining the environment as code, which makes the next build
reproducible and the next change reviewable. The hand-patching is fixed by replacing instances
from a rebuilt image rather than editing them — and that fix cannot be applied until the
application's state has been moved off the instance's local disk. A well-architected review
would surface all three, filed under reliability, operational excellence and reliability
respectively.

#### Knowledge check

1. A service is deployed across three availability zones in one region. What class of outage is
   it still fully exposed to?
   The loss of the whole region — multi-zone protects against a zone-level failure inside a
   region, not a regional one. Data-residency requirements are likewise a multi-region concern.
2. How many pillars does the AWS Well-Architected Framework have, and how does Azure's differ?
   AWS has six — operational excellence, security, reliability, performance efficiency, cost
   optimization, sustainability. Azure names five and has no sustainability pillar.
3. A team automates its server patching with a configuration management tool that logs into
   each long-lived server and applies updates. Is that immutable infrastructure?
   No. It is automated but mutable — each server still accumulates a unique history of applied
   changes, which is exactly the drift immutability removes.
4. What must be true of a workload before its instances can be treated as disposable?
   Its state must live outside the instance — in a managed database, object storage, or a
   volume with an independent lifecycle — because replacement destroys everything local.
5. State the one-line difference between automation over manual configuration and immutable
   infrastructure.
   Automation constrains how a change is authored and applied; immutability constrains how long
   the thing being changed is allowed to live.

<a id="s-best-practices-security-posture"></a>
## Security posture

<a id="c-cloud.best-practices.identity-and-access-management"></a>
### Identity and access management
*id: `cloud.best-practices.identity-and-access-management` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-iam-best-practices*

**What it is** The provider's own system of accounts, groups, roles and policies governing
which identity may call which API against which resource. It covers both authentication (proving
who the caller is) and authorization (deciding what that caller may do) at the level of the
cloud control plane.

**Why it matters** Cloud IAM is not the guest operating system's user database, and confusing
the two is a testable error. An IAM identity governs API calls that create, modify or delete
resources — launching an instance, deleting a storage bucket, reading a secret. A Linux user
account on that instance governs what happens inside the guest once it is running. Removing an
employee's IAM identity does not remove their `sshd` login on a server, and locking their
Unix account does not stop them terminating the instance through the API.

**How it works** Policies attach to identities (users, groups, roles) or to resources, and are
evaluated per API call. Human users should reach the account through federation with an identity
provider, receiving temporary credentials rather than holding long-lived keys; workloads should
assume roles instead of carrying keys at all. Multi-factor authentication is required for human
access, and the account's root or global-administrator identity is protected and used for
essentially nothing routine.

**Key terms** control plane; role; policy; federation; MFA; root user.

<a id="c-cloud.best-practices.secrets-management-in-cloud"></a>
### Secrets management in cloud
*id: `cloud.best-practices.secrets-management-in-cloud` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-secrets-manager*

**What it is** Holding credentials — database passwords, third-party API keys, OAuth tokens — in
a managed secret store that encrypts them at rest, gates retrieval through IAM policy, records
every access, and can rotate them on a schedule. The application fetches the secret at runtime
instead of shipping with it.

**Why it matters** The distinction the exam draws is against the two things a secret store is
not. It is not a key management service: a KMS creates and controls the encryption *keys*, and
AWS's own guidance routes encryption keys to KMS and AWS credentials to IAM, sending only
application and database credentials to Secrets Manager. It is also not "an environment variable,
but encrypted" — an encrypted value baked into an image or a deployment manifest is still an
artifact anyone with access to the pipeline or the registry can extract, and changing it still
requires a redeploy.

**How it works** The secret lives in the store; the workload's role carries permission to read
that specific secret and calls the service for it at startup or on demand. Because retrieval is
a runtime call, rotation replaces the stored value without redeploying the application, which is
what turns a long-lived secret into a short-lived one.

**Key terms** managed secret store; rotation; runtime retrieval; resource policy.

<a id="c-cloud.best-practices.encryption-by-default"></a>
### Encryption by default
*id: `cloud.best-practices.encryption-by-default` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-kms*

**What it is** Turning on encryption at rest and encryption in transit as the standing setting
for every resource, so that an unencrypted resource is a deliberate, justified exception rather
than the accident of nobody having ticked a box.

**Why it matters** At rest and in transit defend against different attackers, and an exam option
will offer one as the fix for the other's threat. Encryption at rest protects the stored bytes —
a stolen disk, a snapshot copied to another account, a decommissioned volume — and does nothing
whatsoever for data crossing a network. TLS protects data on the wire and leaves the disk
readable. Neither protects against an over-privileged identity that is entitled to call the API,
because the service decrypts for authorised callers by design: "the bucket is encrypted" is not
an answer to "the bucket was publicly readable".

**How it works** Data at rest is encrypted with keys held in a key management service; AWS KMS
keys are created, used and deleted entirely inside the service, never leave it unencrypted, and
are protected by FIPS 140-3 Security Level 3 validated hardware security modules. The choice
between a provider-managed key and a customer-managed key is a choice about who controls the key
policy, rotation and audit trail — not about the strength of the cipher. Data in transit is
protected separately, by TLS on the connection.

**Key terms** at rest; in transit; key management service; customer-managed key; TLS.

<a id="c-cloud.best-practices.least-privilege-for-cloud-identities"></a>
### Least privilege for cloud identities
*id: `cloud.best-practices.least-privilege-for-cloud-identities` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-iam-best-practices*

**What it is** Granting each identity — human or machine — only the permissions it actually
needs for its task, instead of the broad administrative policy that is convenient during setup
and dangerous every day afterwards. It is a principle applied *through* IAM, not a feature of
it: IAM is the mechanism, least privilege is the policy decision made with it.

**Why it matters** The identity that gets over-granted in practice is usually not a person. A
service role attached to an application, given administrator permissions during a debugging
session and never narrowed, is the standard path from "one compromised web application" to "the
whole account". The exam's other favourite here is the assumption that read-only access is
inherently safe: read permission on a secret store, a database, or an object storage bucket is
exactly what data exfiltration requires.

**How it works** The workable path is to start from a broad managed policy, then narrow it using
the access activity the identity actually generated — AWS provides IAM Access Analyzer to
generate policies from that activity and to validate the result. Unused users, roles,
permissions and credentials are reviewed and removed on a schedule; policy conditions restrict
access further; and permissions boundaries and organisation-level guardrails cap what can be
granted at all, so delegation cannot exceed the ceiling.

**Key terms** service role; permissions boundary; guardrail; unused credential review.

<a id="c-cloud.best-practices.avoid-hardcoded-credentials"></a>
### Avoid hardcoded credentials
*id: `cloud.best-practices.avoid-hardcoded-credentials` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-iam-best-practices, aws-secrets-manager*

**What it is** Removing long-lived static keys from code, images and configuration entirely, by
giving the workload an identity the platform vouches for — an instance role or workload identity
— from which it receives temporary credentials automatically. Human users get the same treatment
through federation with an identity provider.

**Why it matters** A long-lived access key is the most commonly leaked cloud secret because it
travels: into a repository, a container image layer, a CI log, a screenshot, a backup of any of
those. The trap is the half-fix. Moving the key out of source code and into an environment
variable, a private repository, or an untracked config file changes where the key is, not what
it is — it is still a static, long-lived credential that can be copied once and used until
somebody revokes it. Rotation shortens the exposure window but does not remove the class of
problem.

**How it works** The platform issues short-lived credentials to the running workload through its
attached role, refreshes them automatically, and scopes them to that role's permissions; nothing
static is ever stored. Where a long-lived credential genuinely cannot be avoided — a third-party
service with no federation support — it belongs in a managed secret store with rotation enabled,
not in the application's own configuration.

**Key terms** instance role; workload identity; temporary credentials; static access key.

#### Scenario

An application on a cloud instance reads a database password from an environment variable set in
its deployment manifest, and calls the provider's storage API using an access key checked into a
private repository. Separate the two problems, because they take different fixes. The access key
is a provider credential: it should not exist at all — attach a role to the instance so the
workload receives temporary credentials automatically, which is the only fix that removes the
static key rather than relocating it. The database password is a third-party credential that
must exist somewhere, so it moves into a managed secret store and is fetched at runtime, which
also makes rotation possible without redeploying. Then narrow the role: if it was granted
administrator permissions to get the deployment working, it now needs only the specific storage
actions the application makes. Finally, note what none of this fixed — if the storage bucket is
unencrypted, adding a role does not encrypt it, and if it is encrypted but readable by an
over-broad policy, encryption at rest does not stop the read.

#### Knowledge check

1. What is the difference between a cloud IAM identity and a Linux user account on a cloud
   instance?
   The IAM identity governs control-plane API calls against resources; the Linux account governs
   what happens inside the guest OS. Removing one does not remove the other.
2. A team moves an access key out of source code into an environment variable. What class of
   problem have they solved, and what have they not?
   They have changed where the key is stored, not what it is — it remains a long-lived static
   credential. The fix is an instance role or workload identity issuing temporary credentials.
3. Data in an object storage bucket is encrypted at rest. Which threat does that address, and
   which does it not?
   It addresses recovery of the stored bytes — stolen media, a copied snapshot. It does not
   address data crossing the network (that is TLS) and does not stop an authorised but
   over-privileged identity from reading the data through the API.
4. When does a credential belong in a secret store rather than being eliminated by a role?
   When it is a third-party or database credential that must exist as a value — provider API
   access should use a role and temporary credentials, so no stored secret exists to manage.
5. Why is "read-only" not automatically a safe permission grant?
   Read access to secrets, databases or storage is precisely what data exfiltration needs; least
   privilege is about scope of resources and actions, not about write access alone.

<a id="s-best-practices-operations"></a>
## Operations

<a id="c-cloud.best-practices.backup-and-recovery-in-cloud"></a>
### Backup and recovery in cloud
*id: `cloud.best-practices.backup-and-recovery-in-cloud` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-backup*

**What it is** A policy-driven copy of data, held apart from the running system, together with a
restore procedure that has actually been performed. Managed services such as AWS Backup
centralise this into backup plans that define schedule, retention and lifecycle, and assign
resources to those plans — commonly by tag — instead of leaving each service to be backed up
individually by hand.

**Why it matters** Backup, snapshot and replication are three different things and the exam
offers them as alternatives to one another. Replication copies mistakes as faithfully as it
copies data: a deletion, a bad migration or a ransomware encryption propagates to every replica,
so replication protects against hardware and zone loss but not against error or malice. A
snapshot is a point-in-time copy, which is a backup only once retention, isolation and a tested
restore are attached to it. And "the provider backs it up" misreads the shared responsibility
model: the durability of the storage service is the provider's, but the retention policy and the
restore are yours.

**How it works** A backup plan sets frequency and retention against a recovery point objective
(how much data may be lost) and a recovery time objective (how long restoring may take), with
lifecycle rules moving older copies to cheaper storage. The restore is then exercised
deliberately, because an untested restore path is an assumption, not a recovery capability.

**Key terms** backup plan; retention; lifecycle; RPO; RTO; tested restore.

<a id="c-cloud.best-practices.logging-and-auditing-in-cloud"></a>
### Logging and auditing in cloud
*id: `cloud.best-practices.logging-and-auditing-in-cloud` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-cloudtrail*

**What it is** Recording which identity called which API, against which resource, when, from
where, and with what result. AWS CloudTrail is the canonical example: actions taken by a user,
role or service through the console, CLI, SDKs and APIs are recorded as events.

**Why it matters** An audit log is not an application log and not a metric, and the three answer
different questions. "Who deleted the storage bucket at 02:14, and from what address" is an
audit-log question. "What did the application do just before it crashed" is an application-log
question. "When did latency start rising" is a metrics question. The same distinction makes the
audit trail the basis of change correlation: when a service degrades, the control-plane log says
what changed in the account at that moment.

**How it works** Retention is the detail worth holding. CloudTrail's Event history gives a
searchable, immutable record of the past 90 days of management events in a region, at no charge
and with nothing to configure — but 90 days is the whole of it. Longer retention requires
creating a trail that delivers events to object storage, or an event data store in CloudTrail
Lake. Data events — object-level reads and writes — are not captured by Event history and must be
enabled deliberately. The log destination is then protected from the identities the log audits.

**Key terms** management event; data event; trail; event history; log integrity.

<a id="c-cloud.best-practices.documentation-and-tagging-standards"></a>
### Documentation and tagging standards
*id: `cloud.best-practices.documentation-and-tagging-standards` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-tagging-best-practices*

**What it is** A tag is a key with an optional value attached to a resource as metadata —
`Owner`, `Environment`, `CostCenter`, `Application`. A tagging standard is the enforced agreement
on which keys exist and what values are legal, paired with written architecture documentation so
that ownership and intent survive the people who created the resources.

**Why it matters** Tags are load-bearing rather than decorative: cost allocation reports,
backup plan assignment, patch and automation targeting, and attribute-based access conditions
all select resources by tag. That makes inconsistency expensive rather than untidy — `Owner`,
`owner` and `OWNER` are three different keys, and a resource tagged with the wrong one silently
drops out of the cost report and out of the backup plan, with no error raised anywhere. The
practical consequence is that untagged resources are the ones nobody can attribute and therefore
nobody dares delete.

**How it works** The standard defines a small mandatory key set, is applied at creation time by
the same code that provisions the resource, and is enforced by policy rather than requested by
convention. Note the boundary: a tag can be used as a condition in an access policy, but it is
not itself an isolation boundary — accounts, subscriptions or projects are.

**Key terms** tag key and value; cost allocation tag; tag policy; isolation boundary.

<a id="c-cloud.best-practices.right-size-before-you-scale"></a>
### Right-size before you scale
*id: `cloud.best-practices.right-size-before-you-scale` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-rightsizing-whitepaper*

**What it is** Right sizing is matching instance types and sizes to the workload's measured
performance and capacity requirements at the lowest possible cost, and identifying deployed
instances that can be downsized or eliminated outright without compromising that capacity. Doing
it before scaling means correcting the unit before multiplying it.

**Why it matters** Scaling multiplies whatever the unit costs, including its waste: autoscaling
a workload that idles at 5% CPU on an oversized instance type buys more idle capacity at a
higher price per unit. The documented failure mode is exactly the tempting one — organisations
lift and shift into the cloud, prioritise speed and performance over cost, intend to right size
later, and end up with oversized instances and sustained wasted spend.

**How it works** Right sizing is driven by measurement: utilisation data over a representative
period, including peaks, decides the type and size — and choosing a family that matches the
bottleneck (compute, memory or I/O) matters as much as choosing a smaller size. Keep it distinct
from two neighbours. Scaling is changing how many units run in response to load; committed-use or
reserved pricing is a discount on the rate, which locks in the existing waste rather than
removing it.

**Key terms** utilisation; instance family; idle resource; horizontal scaling; rate discount.

<a id="c-cloud.best-practices.health-checks-and-graceful-shutdown"></a>
### Health checks and graceful shutdown
*id: `cloud.best-practices.health-checks-and-graceful-shutdown` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-elastic-load-balancing*

**What it is** Two halves of one loop. A health check is a probe the platform runs against each
registered target so the load balancer routes traffic only to healthy ones — Elastic Load
Balancing monitors the health of its registered targets and sends requests to the healthy
targets only. Graceful shutdown is the mirror image: before an instance is terminated, it stops
receiving new requests and is given time to finish the ones already in flight.

**Why it matters** Together they are why scaling in, deploying and replacing instances do not
drop requests — which makes them the precondition for immutable replacement being safe. The
distinction to hold is against monitoring: a health check drives an automated decision inside a
control loop (stop routing here, replace this target), whereas monitoring and alerting inform a
human. A second distinction is between liveness and readiness — a shallow TCP check reports
healthy for a process that has accepted the socket but cannot yet serve a request, so instances
enter rotation before they are ready.

**How it works** Deregistration is delayed rather than immediate: Elastic Load Balancing stops
sending requests to a deregistering target and by default waits 300 seconds before completing
deregistration, letting in-flight requests finish; the target's state is `draining` during that
window and `unused` afterwards, at which point an Auto Scaling group may terminate and replace
it. If the target closes its connections before the delay elapses — the exact failure a process
that exits immediately on the termination signal produces — clients receive 500-level errors.
The design trap on the other side is a health check that reaches through to a shared dependency:
when that dependency degrades, every target fails its check at once and the whole fleet is marked
unhealthy.

**Key terms** health check; deregistration delay; connection draining; liveness and readiness.

#### Scenario

A deployment replaces every instance in a fleet, and users see a burst of 500-level errors, after
which a monitoring dashboard shows nothing wrong. Work the operations practices in order. The
errors are a graceful-shutdown failure: the old targets were terminated while requests were still
in flight rather than being allowed to drain, so the fix is in deregistration behaviour and the
application's handling of the termination signal, not in the dashboard — the health check is a
control-loop input, not an alert. Ask separately who triggered the deployment and what else
changed in the account at that minute: that is the control-plane audit trail's question, and if
the incident is investigated more than 90 days later, only a configured trail will still have the
answer. The post-incident review then finds the fleet is running on instances sized for a load
peak that never arrives, and someone proposes autoscaling — right-size the instance type first,
or the scaling multiplies the waste. And nobody can say who owns the fleet, because the resources
carry no `Owner` tag, which is also why they were missing from the backup plan that selects
resources by tag.

#### Knowledge check

1. A nightly replication copies the production database to a second region. An engineer drops a
   table by mistake. Does replication protect against that?
   No. Replication faithfully copies the deletion; it protects against hardware or zone loss,
   not against error or malice. That requires a retained backup with a tested restore.
2. What is the difference between an audit log, an application log, and a metric?
   The audit log records which identity called which API against which resource; the application
   log records what the software did; a metric is a numeric time series. "Who deleted it" is only
   answerable from the first.
3. How long does CloudTrail's Event history retain management events, and what is required for
   longer retention?
   90 days, per region, at no charge. Longer retention requires a trail delivering to object
   storage, or a CloudTrail Lake event data store.
4. Why does a resource tagged `owner=alice` instead of the standard `Owner=alice` cause a
   problem no error message reports?
   Tag keys are distinct strings — the resource silently falls outside every cost report, backup
   plan and automation rule that selects on the standard key.
5. A team plans to add autoscaling because their servers feel slow at peak. What should be
   established first, and why?
   Whether the instances are correctly sized and of the right family for the bottleneck.
   Scaling an oversized or mismatched instance multiplies the waste; committed-use pricing would
   merely discount it.
6. An instance is terminated during a scale-in and clients receive 500-level errors. What
   mechanism was missing?
   Graceful shutdown — the target must stop receiving new requests and drain in-flight ones
   before termination, which is what the load balancer's deregistration delay window (300
   seconds by default) exists to allow.
