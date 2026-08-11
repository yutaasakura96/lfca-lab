# Best Practices

Best Practices is the operational-discipline competency of System Administration Fundamentals,
the exam's largest domain at 30% of the exam — 1st largest of 6 domains — under the blueprint
effective 2025-09-16, and the competency was added in the 2025 update, so no pre-2025 study
material covers it at all. LFS200 does not help here either: all 20 of its concepts are NOT
COVERED — 0/20 (0%) are not NOT COVERED (`research/lfs200-notes/00-course-map.md`) — so every
topic below is sourced independently, and 4 of the 20 have no primary documentation source
even so and carry an explicit marker saying so. The competency is process rather than
mechanism: nothing in it is settled by typing a command, and every question about it is a
question about which discipline a described situation actually calls for.

<a id="s-best-practices-operational-discipline"></a>
## Operational discipline

<a id="c-sysadmin.best-practices.documentation"></a>
### Documentation
*id: `sysadmin.best-practices.documentation` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** The written record of what a system does, why it was configured the way it was,
and how it would be rebuilt or recovered. It is descriptive and reference-shaped: a reader
consults it to understand a system, not to execute a task while the system is on fire.

**Why it matters** An undocumented system fails badly precisely when the person who built it
is unavailable — the knowledge that made it maintainable lived only in one head, and the
replacement engineer has to reverse-engineer intent from configuration files that record what
was decided but never why. The exam's angle is narrower than "documentation is good": it asks
which artifact answers which question, because documentation, a runbook, and a change record
are three different artifacts that a careless reader treats as one.

**How it works** Useful documentation is kept next to the thing it describes and updated as
part of the change that made it stale, rather than in a periodic documentation sweep that
never happens. It records the system's purpose and dependencies, the rationale behind
non-obvious choices, who owns it, and what recovery is expected to look like. Configuration
management practice treats the reviewed, agreed specification of a system as an artifact in
its own right — one that may only be altered through change control — and treats the record of
each approved change as something archived rather than discarded.

**Key terms** rationale; system of record; change record; recovery expectation.

**Traps** Documentation is not a runbook. Documentation explains; a runbook instructs, and an
explanation handed to someone at 03:00 who has never seen the system is close to useless. It
is also not a change log: a change record states what was altered, by whom, and when, whereas
documentation states what is true now — a stack of change records is not documentation, because
reconstructing current state from a change history is exactly the work documentation exists to
save. Nor is a monitoring dashboard documentation: it shows the system's present values, not
its intent.

**What the exam may test** Given a described need — "a responder must restore this service at
night", "a new hire must understand why this host is configured unusually", "an auditor must
see who approved last month's change" — choosing the artifact that answers it, rather than
picking documentation as the generically virtuous answer.

<a id="cmp-sysadmin.best-practices.documentation"></a>
#### Not to be confused with: Documentation vs Runbooks
*compares: `sysadmin.best-practices.documentation`, `sysadmin.best-practices.runbooks`*

| | Documentation | Runbooks |
| --- | --- | --- |
| Shape | Descriptive reference — what exists, and why | Prescriptive procedure — ordered steps to perform |
| Consulted when | Understanding, auditing, or rebuilding a system, with time to read | Executing a known task or responding to an incident, under pressure |
| Answers | Why is it like this, and what depends on what | What do I do next, and how do I know the step worked |
| Written for | A reader who has time and context | A reader who has neither, and may not know the system |
| Goes stale when | The system changes | The procedure's steps stop matching the system |

The separating axis is explanation versus instruction: documentation is read to acquire
understanding, a runbook is followed to produce an outcome, and neither substitutes for the
other.

<a id="c-sysadmin.best-practices.change-management"></a>
### Change management
*id: `sysadmin.best-practices.change-management` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** The process of proposing, reviewing, approving, scheduling, and recording a
change before it is applied. It is a decision procedure that binds people, not a tool: its
output is an authorisation and a durable record, not a modified file.

**Why it matters** The highest-yield question in any outage is "what changed?", and it is only
answerable if changes were recorded with times and owners. Change management exists so an
incident can be correlated with what changed; without it, every investigation starts by
interviewing the team about what they remember doing.

**How it works** A change request states what will change, what it affects, and how it will be
undone. It is reviewed and approved before it is applied, and the approver is someone
independent of the requestor — configuration change control practice treats it as a baseline
requirement that a change be vetted by at least one authorised individual who is not the person
proposing it, so an administrator cannot unilaterally propose and approve a change to a system
they run. The approved change is scheduled, applied, and its outcome recorded in an artifact
that is archived. Emergency changes are not exempt from the process; they take a faster path
and are documented after the fact.

**Key terms** change request; independent approval; impact review; emergency change; change
record.

**Traps** "We use Git, with pull requests" is not the same claim as "we have change management".
Version control records what a file said and who wrote it; it does not by itself cover a change
someone made by hand on a host, and it says nothing about when a change was permitted to be
applied. Change management is also not the maintenance window: the window is *when* a change may
be applied, approval is *whether* it may be applied at all, and being inside a window authorises
nothing on its own.

**What the exam may test** Distinguishing the approval decision from the tooling that stores
the change and from the scheduling that releases it, and recognising independent approval —
requestor and approver being different people — as the control that defines the practice.

<a id="cmp-sysadmin.best-practices.change-management"></a>
#### Not to be confused with: Change management vs Version control
*compares: `sysadmin.best-practices.change-management`, `devops.git-concepts.version-control`*

| | Change management | Version control |
| --- | --- | --- |
| What it is | A human decision process producing an authorisation | A tool recording successive states of files |
| What it answers | Was this change reviewed, approved, and scheduled | What did this file say, when, and who wrote it |
| Separates requestor from approver | Yes — that is its central control | Only if a review workflow is layered on top of it |
| Sees a change made by hand on a host | Yes — an unapproved change is still within its scope | No — a change never committed is invisible to it |
| Primary artifact | An approved, archived change record | A commit history |

The separating axis is authorisation versus history: change management decides whether a change
may happen, version control records what a file contained once someone decided.

<a id="c-sysadmin.best-practices.standardization"></a>
### Standardization
*id: `sysadmin.best-practices.standardization` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** Keeping machines of the same role configured alike, so that a fix, a script, or
a runbook applies to all of them rather than to one hand-built host. The failure it names is the
snowflake: a server that works, that nobody dares touch, and whose configuration exists nowhere
but on the server itself.

**Why it matters** Uniformity is what makes every other discipline in this competency cheap.
A runbook is worth writing only if it applies to more than one machine; drift is detectable
only if there is a defined state to drift from; and troubleshooting knowledge transfers between
hosts only when the hosts are alike. Standardization is the goal, not the mechanism —
configuration management is one way of reaching and holding it, and a security baseline is the
security-specific slice of the same idea.

**How it works** The standard is expressed once as a defined target — an image, an agreed
specification, or a declared configuration — and hosts are brought to it by rebuilding or
re-applying rather than by editing each one individually. Deviation is then a measurable
condition rather than a matter of opinion, which is what allows an automated check to report
that a system no longer matches its approved specification.

**Key terms** snowflake host; drift; golden image; approved specification.

<a id="c-sysadmin.best-practices.naming-conventions"></a>
### Naming conventions
*id: `sysadmin.best-practices.naming-conventions` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A predictable scheme for naming hosts, users, groups, and resources so that
identity and purpose can typically be inferred from the name without consulting anything else.
A name such as `web-prod-eu-02` is doing work that an arbitrary name like `saturn` is not.

**Why it matters** Names appear in alerts, logs, tickets, and firewall rules, usually stripped
of surrounding context — an alert naming a host is often all a responder gets. In most
implementations of this practice, the point is to let a reader decide, from the name alone,
whether the affected machine is production or test before deciding how urgently to react.

**How it works** A convention typically fixes a small number of components in a fixed order —
role, environment, region, and an index — and forbids ad-hoc exceptions, since a scheme with
exceptions cannot be relied on and therefore stops being read at all. The convention encodes
information; it does not store it. The authoritative record of what a host is and who owns it
belongs to the inventory, and treating a name as if it were that record is the practice's usual
failure mode: a hostname is a string that someone typed, so automation that grants privilege by
matching a name pattern is trusting a label rather than a fact.

**Key terms** host naming scheme; environment token; convention versus record.

<a id="c-sysadmin.best-practices.automation-and-idempotency"></a>
### Automation and idempotency
*id: `sysadmin.best-practices.automation-and-idempotency` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: ansible-glossary-idempotency*

**What it is** Two joined ideas that the exam is likely to separate. Automation is replacing a
repeated manual procedure with a script or tool. Idempotency is a property that procedure should
have: running it a second time produces the same end state as the first and makes no further
change.

**Why it matters** Automation without idempotency multiplies mistakes instead of removing them.
A script that appends a configuration line rather than ensuring it is present is fully automated
and, re-run across fifty hosts, leaves fifty files with duplicate entries. Idempotency is also
what makes recovery from a partial failure ordinary: when a run dies halfway through, the safe
response is typically to run it again, and that is only safe if repetition is harmless.

**How it works** Idempotent work is generally written as a check followed by a conditional
action — "is this user present?" rather than "create this user" — or expressed declaratively as
a desired end state, leaving the tool to decide whether anything needs doing. In most
implementations of this practice, a second run that reports no changes is taken as the signal
that the system already matches intent, which is why a "changed: 0" style result is treated as
success rather than as the tool having done nothing useful.

**Key terms** idempotent operation; convergence; declarative versus imperative; dry run.

**Traps** Automation is not itself idempotency, and the exam can offer them as if one implied
the other. A scheduled job is automated whether or not it is safe to repeat. Idempotency is
also a property of the operation rather than of the tool: a configuration-management tool
invoking a raw shell command is typically no more idempotent than that command itself, unless
the task is explicitly guarded by a condition that skips it once the work is already done. And
"it worked when I ran it" is not evidence of idempotency — only the second run tests for it.

**What the exam may test** Given a described procedure, judging whether re-running it is safe,
and recognising that the fix for a non-idempotent script is to make the operation
state-checking or declarative, not to run it less often.

<a id="cmp-sysadmin.best-practices.automation-and-idempotency"></a>
#### Not to be confused with: Automation and idempotency vs Configuration management
*compares: `sysadmin.best-practices.automation-and-idempotency`, `sysadmin.best-practices.configuration-management`*

| | Automation and idempotency | Configuration management |
| --- | --- | --- |
| What it names | A way of writing repeated work, plus a property that work should have | A tool-enforced discipline of declaring system state and holding it |
| Usually expressed as | A script or task — imperative steps in an order | A declared desired state kept in version-controlled files |
| A second run | Is safe only if the author wrote it to be | Converges on the declared state by design |
| Detects deviation | No — it acts only when something runs it | Yes — re-applying reports and corrects what no longer matches |
| Scope | One procedure | The configuration of a fleet |

The separating axis is property versus system: automation and idempotency describe how a piece
of work is written, while configuration management is the surrounding system that decides what
the work should produce.

<a id="c-sysadmin.best-practices.configuration-management"></a>
### Configuration management
*id: `sysadmin.best-practices.configuration-management` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** Declaring the desired state of systems in version-controlled files and having a
tool apply and re-apply that declaration — Ansible, Puppet, Chef, and Salt are the named
examples. The declaration, not the machine, becomes the authority on how the machine should be
configured.

**Why it matters** It collapses two artifacts into one: the record of how a system is meant to
be configured and the thing that configures it are the same file, so they cannot disagree the
way a wiki page and a live server can. That is also what makes deviation detectable — the tool
can compare the declared state against the actual state and report the difference.

**How it works** The recognised phases of the practice are planning, identifying and
implementing configurations, controlling changes to them, and monitoring for deviation from the
approved specification. In operation, the tool reads the declaration, inspects the host,
changes only what differs, and reports what it changed; automated checking of this kind is what
surfaces undocumented components, misconfigurations, and unauthorised changes that would
otherwise accumulate silently.

**Key terms** desired state; convergence; drift; approved baseline; manifest or playbook.

**Traps** A configuration-management tool is not version control — the repository stores and
attributes the declaration, the tool applies it, and each is useless for the other's job.
It is also not provisioning: it configures systems that already exist rather than creating them.
And re-applying a declaration does not restore a hand-edited host to a known state, because only
the settings the declaration mentions are corrected; anything the declaration never mentions
survives untouched, which is why "we ran the playbook" is not the same claim as "the host now
matches the baseline".

**What the exam may test** Separating the repository, the tool, and the provisioning layer when
a scenario describes all three loosely, and recognising drift detection as a property of
re-applying a declaration rather than of having written one.

*Not to be confused with [automation and idempotency](best-practices.md#cmp-sysadmin.best-practices.automation-and-idempotency).*

<a id="cmp-sysadmin.best-practices.configuration-management"></a>
#### Not to be confused with: Configuration management vs Infrastructure as code
*compares: `sysadmin.best-practices.configuration-management`, `devops.devops-basics.infrastructure-as-code`*

| | Configuration management | Infrastructure as code |
| --- | --- | --- |
| What it acts on | The state inside systems that already exist | The existence and shape of the infrastructure itself |
| Typical result of a run | Packages installed, files rendered, services running | Servers, networks, storage, and load balancers created or destroyed |
| Question it answers | Is this machine configured as declared | Does this environment exist as declared |
| If the host is gone | Nothing to converge — it configures, it does not create | Recreates it from the declaration |
| Shared ground | Both keep declarations in version control and both re-apply to converge | Both keep declarations in version control and both re-apply to converge |

The separating axis is whether the declaration brings the thing into existence or configures it
once it exists; the shared vocabulary of declarative files and convergence is exactly why the
two are confusable.

<a id="c-sysadmin.best-practices.version-control-for-configuration"></a>
### Version control for configuration
*id: `sysadmin.best-practices.version-control-for-configuration` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** Keeping configuration files in a version control system — Git in practice — so
that every change to them is reviewable before it lands, attributable to a person afterwards,
and revertible to any earlier state.

**Why it matters** It supplies the three properties that make a configuration auditable at all:
someone else saw the change, the history says who made it, and the previous state still exists.
It is also the substrate the rest of the competency assumes — configuration management declares
state in files, and those files are only trustworthy if their history is.

**How it works** Configuration is edited in a working copy, reviewed, and committed with a
message that records intent; the history then serves as evidence of what was in force at any
past moment. The limit is worth stating precisely: reverting a commit changes the declaration,
not the running system. Nothing happens on any host until a tool or a person re-applies the
reverted state, so "we reverted it" describes an intention restored, not an outage ended. Nor is
a repository a backup: a backup preserves data as it happened to be, while version control
preserves changes as someone meant them.

**Key terms** commit history; attribution; review before merge; revert versus re-apply.

<a id="c-sysadmin.best-practices.testing-before-production"></a>
### Testing before production
*id: `sysadmin.best-practices.testing-before-production` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** Validating a change in a non-production environment before it reaches the systems
users depend on, and having a rollback path established before the change is applied rather than
improvised once it has gone wrong.

**Why it matters** The two halves are separately examinable. Testing reduces the chance that a
change breaks something; a rollback path bounds the damage when testing missed it. A change
that has been tested but has no way back is still an unbounded risk, which is why an approved
change request is expected to state how the change is undone.

**How it works** Organisations that take this seriously maintain a test environment isolated
from production, used to evaluate proposed configuration settings and vendor patches before
they are rolled out. The value of that environment is entirely a function of how closely it
resembles production: a staging host with different package versions, a different dataset size,
or no load tests almost nothing. The same caution applies to the rollback path — a restore
procedure that has never been exercised is an assumption, not a plan, which is why recovery
exercises deliberately include restoring from backup media rather than merely confirming that
backups exist.

**Key terms** test environment; staging fidelity; rollback path; canary or phased rollout.

<a id="c-sysadmin.best-practices.monitoring-and-alerting"></a>
### Monitoring and alerting
*id: `sysadmin.best-practices.monitoring-and-alerting` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** Two halves of one practice that the exam separates deliberately. Monitoring is
the continuous collection of metrics, logs, and configuration state; alerting is the act of
notifying a human when a threshold or condition is breached. Monitoring observes; alerting
interrupts.

**Why it matters** The distinction decides who finds out and when. A dashboard nobody is
watching is monitoring without alerting, and it detects nothing at 03:00 — it merely makes the
evidence available afterwards. The reverse failure is as testable: alerting on conditions that
need no action trains people to ignore alerts, so the next real one is dismissed too.

**How it works** Collection runs continuously and independently of anyone looking. Rules
evaluate the collected data and, when a condition holds, push a notification through a channel
someone is obliged to answer. The same machinery serves security as well as availability:
continuous checking of a system's configuration against its approved specification is what
surfaces misconfigurations and unauthorised changes, since planning a secure configuration and
then controlling changes to it is not by itself enough to keep a system in that state.

**Key terms** metric; threshold; notification channel; alert fatigue; false positive.

**Traps** Monitoring is not logging. A local log store such as the systemd journal holds one
host's records for later reading, and reading it is an act someone performs after they already
suspect a problem; monitoring is continuous, usually aggregated across hosts, and its whole
point is to raise the suspicion in the first place. "Check the logs" answers what happened;
monitoring and alerting answer who was told, and when. Note also that alerting is not
escalation — a notification that reaches an unstaffed channel has fired correctly and helped
nobody.

**What the exam may test** Given a described gap — nobody noticed for six hours, or everybody
noticed and ignored it — deciding whether the missing discipline is collection, alerting rules,
the notification path, or alert quality, rather than answering "monitoring" to all four.

*Not to be confused with [journald](system-administration.md#cmp-sysadmin.system-administration.journald).*

<a id="c-sysadmin.best-practices.capacity-planning"></a>
### Capacity planning
*id: `sysadmin.best-practices.capacity-planning` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Projecting how resource consumption will grow so that expansion is scheduled in
advance, rather than triggered by the outage that exhaustion causes.

**Why it matters** Capacity is one of the few classes of failure that announce themselves well
in advance and are still routinely missed, because the announcement is a trend rather than an
event. In most descriptions of this practice, the deliverable is a date — the point at which
current growth meets the current limit — because a date is what makes procurement, budget
approval, and a maintenance window schedulable before they are urgent.

**How it works** Historical utilisation is extrapolated forward against a known ceiling, with
headroom reserved for spikes and for the lead time that adding capacity actually requires.
The discipline it is most often confused with is monitoring: monitoring reports the value now
and alerts when a threshold is crossed, which is a statement about the present, while capacity
planning is a statement about the future made from the same data. An alert at 85% disk usage is
monitoring doing its job; deciding in March that the array will be full in September, and
ordering accordingly, is capacity planning. Typically the two are complementary, and the
planning is only as good as the history the monitoring retained.

**Key terms** growth trend; headroom; lead time; resource ceiling.

<a id="c-sysadmin.best-practices.maintenance-windows"></a>
### Maintenance windows
*id: `sysadmin.best-practices.maintenance-windows` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-40r4*

**What it is** An agreed period during which disruptive work may be performed, communicated in
advance to the people the disruption affects. The agreement, not the calendar entry, is the
substance of it.

**Why it matters** Disruptive work is not optional — patching in particular requires scheduled
downtime and carries the risk of further downtime if something goes wrong, which is exactly why
business owners resist it and why routine work gets postponed until it becomes an emergency. A
standing window converts that argument into a schedule: the disruption is pre-agreed, so the
work no longer needs to be negotiated each time.

**How it works** A window is defined per system or per group of systems with similar
availability needs, since a batch processing host and a customer-facing service tolerate
interruption at different hours. Affected users and service owners are told before the work,
not after. Two boundaries matter for the exam. A window says *when* work may be done; it is not
an approval, and an unapproved change does not become permissible because it was applied inside
one. And a genuine emergency — an actively exploited vulnerability, for instance — is precisely
the case that overrides the window under an expedited path, at the cost of the disruption the
window existed to schedule.

**Key terms** scheduled outage; advance notice; availability requirement; expedited path.

<a id="c-sysadmin.best-practices.separation-of-duties"></a>
### Separation of duties
*id: `sysadmin.best-practices.separation-of-duties` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** Splitting a sensitive workflow across two or more people so that no single person
can both make and approve a change, or both initiate and complete a transaction. It is a
structural control: it does not depend on trusting anyone in particular.

**Why it matters** It defends against two things at once, which is typically the argument made
for the friction it adds: a malicious insider needs a collaborator, and an honest
administrator's mistake meets a second pair of eyes before it reaches production. Both benefits
come from the same structure, and both disappear the moment one person holds both roles.

**How it works** NIST SP 800-128 states the control directly for configuration change control:
changes must be vetted by at least one authorized individual independent of the requestor, so
that system administrators and developers are not given authority to unilaterally propose and
approve changes to a system's configuration. In most implementations of this practice, the
sensitive workflow is decomposed so that the person who requests a change is not the person who
approves it, and often not the person who reviews the resulting audit record either. The discipline it is routinely confused
with is least privilege, and the exam can offer both as answers to the same scenario. Least
privilege is about the size of one identity's authority — give this account only what it needs.
Separation of duties is about how many identities a workflow requires — even an account with
every privilege should not be able to complete this workflow alone. An administrator with root
on every host still cannot self-approve a change where duties are genuinely separated, which is
the discrimination the question is testing.

**Key terms** requestor versus approver; four-eyes principle; collusion; audit trail.

<a id="c-sysadmin.best-practices.runbooks"></a>
### Runbooks
*id: `sysadmin.best-practices.runbooks` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-34r1*

**What it is** Step-by-step procedures for known operational tasks and known failure modes,
written to be followed under pressure by someone who may not know the system. A runbook is
instruction, not explanation: its unit is a numbered step with an expected result.

**Why it matters** The conditions under which a runbook is used are the conditions in which
people reason worst — at night, mid-incident, often with the wrong person on call. Contingency
planning guidance is explicit that plans should be formatted to give quick, clear directions in
the event that personnel unfamiliar with the plan or the systems are the ones called on to
perform recovery, and that checklists and step-by-step procedures should be used wherever
possible for exactly that reason.

**How it works** Procedures are written in a straightforward, sequential style with no step
assumed or omitted, because a step that is obvious to the author is precisely the step a
stranger will get wrong. A checklist format is preferred: it documents the sequence and also
serves as a diagnostic aid when the outcome is not what the procedure predicted, since the last
successful step localises the problem. Each step should state what to do and how to confirm it
worked, and the procedure ends with a verification that the system is genuinely back rather than
merely responding.

**Key terms** checklist; sequential procedure; expected result; verification step; escalation
point.

**Traps** A runbook that explains rather than instructs has failed at the job it exists for, and
a runbook is equally not a replacement for documentation — it says what to do and deliberately
does not say why the system is built the way it is, so a responder who follows it cannot reason
about a situation the author did not anticipate. A runbook is also narrower than a disaster
recovery plan: the plan governs activation criteria, notification, and the return to normal
operation, while the runbook is the procedure layer inside it. Finally, an untested runbook is
an assumption — steps rot silently as the system changes, and the moment of use is the worst
possible time to discover it.

**What the exam may test** Choosing the runbook over documentation when the scenario stresses
speed, unfamiliarity, or pressure; and recognising that the correct maintenance of a runbook is
exercising it, not merely storing it.

*Not to be confused with [documentation](best-practices.md#cmp-sysadmin.best-practices.documentation).*

<a id="c-sysadmin.best-practices.asset-and-inventory-management"></a>
### Asset and inventory management
*id: `sysadmin.best-practices.asset-and-inventory-management` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** Maintaining an accurate record of which systems exist, what software runs on
them, and who owns them — a descriptive record of components down to the system level, kept
current rather than compiled once.

**Why it matters** You cannot patch, secure, or decommission what you do not know about, so the
inventory is the prerequisite that every other discipline here quietly assumes: patch cadence
applies to the estate the inventory lists, baselines are enforced on the hosts it names, and
offboarding revokes access to the systems it records. The dangerous host is always the one
nobody remembered.

**How it works** A comprehensive inventory of a dynamic estate is rarely achievable by hand, so
the realistic goal is a close-to-comprehensive record maintained by automated discovery that
continuously finds new assets and refreshes what is known about existing ones. The confusion
worth pre-empting is with monitoring: monitoring watches the systems someone configured it to
watch, which by construction excludes the forgotten host, whereas discovery-driven inventory is
the mechanism that finds it. Ownership is part of the record, not an afterthought — an asset
with no named owner is the one whose patch nobody schedules.

**Key terms** component inventory; automated discovery; ownership record; decommissioning.

<a id="c-sysadmin.best-practices.security-baselines"></a>
### Security baselines
*id: `sysadmin.best-practices.security-baselines` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** A defined minimum secure configuration applied to every system of a given type —
a set of specifications formally reviewed and agreed at a point in time, changeable only through
change control, and used as the basis for future builds and releases.

**Why it matters** A baseline removes the security of a machine from the discretion of whoever
built it. Without one, two servers of the same role differ because two people made different
choices, and neither choice was ever reviewed. With one, the question "is this host secure?"
becomes answerable by comparison rather than by opinion, which is what allows automated
checking to report non-compliance at all.

**How it works** Baselines are commonly derived from published benchmarks — recognised,
standardised configuration guides for a given platform — and then adapted to the organisation's
needs and frozen as the approved specification. Two boundaries matter. A baseline is the target
state; hardening is the act of bringing a system to it, and monitoring is what measures the gap
afterwards, so the three are not interchangeable answers. And a baseline is a floor rather than
a ceiling: a system may need more than the baseline requires, but a system with less than it is
non-compliant by definition, no matter how well it happens to be running.

**Key terms** approved specification; benchmark; compliance check; hardening; deviation.

<a id="c-sysadmin.best-practices.user-onboarding-and-offboarding"></a>
### User onboarding and offboarding
*id: `sysadmin.best-practices.user-onboarding-and-offboarding` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-53r5*

**What it is** Defined procedures for granting access when someone joins, changes role, or
leaves. Onboarding grants; offboarding revokes — and offboarding is the half that carries the
risk, because an account that should have been closed leaves no symptom to notice. NIST SP
800-53 Rev. 5 control AC-2 (Account Management) states this directly: accounts are created,
enabled, modified, disabled and removed under policy, account managers are notified when users
are terminated or transferred, and account management processes must be aligned with personnel
termination and transfer processes.

**Why it matters** An orphaned account is a standing exposure: a credential still valid,
attached to nobody, and therefore watched by nobody. Onboarding failures announce themselves
within the hour because the new joiner cannot work, which is typically why they get fixed;
offboarding failures are silent, and in most accounts of this practice that asymmetry is the
whole reason the procedure is written down rather than left to memory.

**How it works** The practice usually starts from an enumerated list of everything an identity
can hold, because the exam's trap and the real one are the same: disabling the login account is
not revoking access. SSH public keys already installed on hosts, API tokens and service
credentials, VPN or client certificates, third-party accounts outside the directory, and shared
passwords the departing person knew all typically survive the disabling of a Unix login account
untouched, and everything held outside that account survives its deletion as well. Role changes
are the commonly neglected third case — access accumulates because the old role's grants are
rarely removed when the new role's are added, which is how a long-serving employee ends up with
more authority than anyone intended. This is adjacent to least privilege
but not the same thing: least privilege governs how much an identity should hold at any moment,
while offboarding governs the complete removal of what it does hold.

**Key terms** orphaned account; credential inventory; deprovisioning; role change; shared
secret.

<a id="c-sysadmin.best-practices.backup-before-change"></a>
### Backup before change
*id: `sysadmin.best-practices.backup-before-change` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128, nist-sp-800-34r1*

**What it is** Capturing a restorable copy or snapshot immediately before a risky change, so
that the way back does not depend on the change itself going as planned.

**Why it matters** Rollback plans usually assume the change is reversible by undoing it —
reinstall the old package, restore the old configuration file. That assumption fails exactly
when it matters: a migration that half-completed, a configuration change that corrupted data, a
package downgrade the vendor does not support. A copy taken before the change is the only
rollback that does not depend on the failure being tidy.

**How it works** The copy is taken at a known instant tied to a specific change, and the change
record states where it is and how long it is kept. That is what distinguishes it from the
scheduled backup regime: routine backups protect against loss over time and are sized by a
recovery point objective measured in hours or days, whereas a pre-change copy exists to undo one
identified action and is often discarded once the change is confirmed good. The discipline is
incomplete without restore verification — an untested copy is a belief about the future, which
is why recovery exercises are built around actually restoring from backup media rather than
confirming that media exist. On virtualised or cloud systems a snapshot usually serves the same
role, with the same caveat: a snapshot of a running database may capture an inconsistent state
unless the application is quiesced first.

**Key terms** snapshot; restore verification; recovery point objective; rollback path.

<a id="c-sysadmin.best-practices.patch-cadence"></a>
### Patch cadence
*id: `sysadmin.best-practices.patch-cadence` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-40r4*

**What it is** The regular, scheduled rhythm at which updates are applied, together with the
expedited path that critical security fixes take when they cannot wait for it. It is the
timing decision inside patching, not the mechanics of patching.

**Why it matters** Cadence is what separates patching as preventive maintenance from patching
as crisis response. Routine patching covers patches on a normal release cycle that have not been
elevated to emergency status, and it is the bulk of all patching; because it lacks urgency and
because installing patches interrupts operations through reboots and restarts, it is the work
most often postponed. That postponement is compounding rather than neutral: every deferred cycle
widens the window in which known vulnerabilities remain exploitable, and it makes the eventual
emergency patch slower and more disruptive, because the emergency patch often depends on earlier
patches that must be installed first.

**How it works** A cadence is defined per group of systems with similar maintenance needs and
similar tolerance for interruption, and it is paired with named exception paths. Emergency
patching is the procedure for a severe or actively exploited vulnerability, where the normal
schedule is abandoned deliberately. Emergency mitigation covers the case where no usable patch
exists yet — or where the patch itself is flawed — and the exposure is reduced by other means,
such as disabling functionality or isolating the asset, until a patch is available. Assets that
genuinely cannot be patched are handled as a standing case through isolation rather than
pretended into the routine cycle. Even routine deployment is normally phased: the patch goes
first to a small set of canary systems that reveal breakage before the rest of the estate
receives it.

**Key terms** routine patching; emergency patching; emergency mitigation; phased deployment;
canary system; unpatchable asset.

**Traps** Cadence is not patch management: the practice includes inventory, acquisition,
testing, deployment, and verification, and cadence is one decision within it. "We patch monthly"
also does not describe a cadence completely, because a cadence without an emergency path leaves
an actively exploited vulnerability waiting for the calendar. And a maintenance window is not a
cadence either — the window is when disruptive work may occur, the cadence is how often it is
supposed to occur.

**What the exam may test** Distinguishing the scheduling decision from the surrounding patch
management practice, and recognising that a critical security fix is expected to leave the
routine schedule rather than wait for it.

<a id="cmp-sysadmin.best-practices.patch-cadence"></a>
#### Not to be confused with: Patch cadence vs Patch management
*compares: `sysadmin.best-practices.patch-cadence`, `sysadmin.system-administration.patch-management`*

| | Patch cadence | Patch management |
| --- | --- | --- |
| What it names | The rhythm updates are applied on, and the exception path when they cannot wait | The whole practice: tracking, testing, applying, and verifying updates |
| Question it answers | How often, and what happens when a fix cannot wait for the next cycle | How are updates identified, validated, and installed at all |
| Scope | One decision inside the practice | The practice that contains the decision |
| Changes when | Tolerance for disruption or for risk changes | Tooling, platforms, or the estate change |
| Can exist without the other | No — a cadence with no process behind it is a calendar entry | Yes, badly — ad hoc patching is patch management without a cadence |

The separating axis is part versus whole: cadence is the schedule, plus its emergency
exception, that sits inside patch management, and never a synonym for the practice itself.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `sysadmin.best-practices.principle-of-least-astonishment` | Principle of least astonishment | Configure systems so they behave the way an experienced administrator would expect, because surprising setups fail during incidents when nobody has time to read. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* Recognition only — it argues for conventional defaults over clever ones, which is the opposite trade-off from optimisation, and it is a design preference rather than an enforceable control. |
| `sysadmin.best-practices.service-ownership` | Service ownership | Every service has a named owner accountable for its health, cost, and lifecycle, so nothing is silently unmaintained. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* Recognition only — distinguish the owner (accountable for the service over its life) from the on-call responder (handling one incident) and from the asset record (which stores the name rather than the accountability). |

#### Scenario

A new engineer must raise a kernel limit on forty application servers. The request is written
up and approved by someone other than its author, because self-approval is what separation of
duties forbids; it is scheduled into a window the service owner already agreed to, which
authorises the timing and not the change. The setting is edited in the version-controlled
configuration repository rather than on the hosts, so the configuration-management tool applies
it identically everywhere and the forty-first server built next month inherits it — the
standardisation that makes one runbook cover the fleet. A snapshot is taken first, so rollback
does not depend on the change succeeding. It goes to staging, then to two canary hosts, then to
the rest. Monitoring confirms the metric moved and no alert fires. Finally the runbook is
corrected where its steps are now wrong, and the documentation records why the limit was raised.

#### Knowledge check

1. What is the one-sentence difference between documentation and a runbook?
   Documentation explains what a system is and why; a runbook instructs, step by step, so
   someone unfamiliar with the system can act under pressure.
2. A team keeps all configuration in Git and requires a reviewed pull request before merging.
   Do they have change management?
   Only partly. That gives history, attribution, and independent review of the files. It does
   not cover changes made by hand on a host, scheduling against an agreed window, or an impact
   review and archived approval record for changes that never touch the repository.
3. A script is run nightly by a scheduler. Is it idempotent?
   Nothing about being scheduled makes it idempotent. Idempotency means a second run leaves the
   same end state and changes nothing further, which is a property of how the operation is
   written — checking state before acting, or declaring the desired state — not of how often it
   runs.
4. An alert fires at 85% disk usage. Is that capacity planning?
   No, that is monitoring and alerting reporting the present. Capacity planning is projecting
   the trend forward to the date the disk will be full and arranging the expansion before then.
5. A departing employee's Unix account has been disabled. Is offboarding complete?
   No. Installed SSH public keys, API tokens and service credentials, VPN or client
   certificates, third-party accounts outside the directory, and any shared secrets the person
   knew typically survive account disablement and must be revoked or rotated separately.
6. What is the one-sentence difference between patch cadence and patch management?
   Patch cadence is the schedule updates follow, plus the expedited path for critical fixes;
   patch management is the whole practice of tracking, testing, applying, and verifying them.
