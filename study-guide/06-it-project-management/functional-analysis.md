# Functional Analysis

Functional Analysis is the requirements half of IT Project Management Fundamentals: how a need
is drawn out of the people who have it, written down, prioritised, and checked against whatever
eventually gets built. Its domain carries 10% of the exam — 6th largest of 6 domains, so the
smallest weight on the current (2025-09-16) blueprint — and this competency's 2025 status is
unchanged. LFS200 does not reach it at all: 12 NOT COVERED — 0/12 (0%) are not NOT COVERED, so
no lesson of the course backs any topic here (`research/lfs200-notes/00-course-map.md`). All 12
concepts are also waived from the independent-sourcing requirement, because the authoritative
references for business analysis are paywalled, so every topic below carries the
no-primary-source marker. Read the hedging in this file literally: where it says "typically" or
"in most practice," no standard is being quoted, and a question whose answer depends on one
organisation's house terminology is not something this material can settle. What it can settle
is the discriminations — functional against non-functional, verification against validation,
use case against user story — and those are where the marks are.

<a id="s-functional-analysis-requirements"></a>
## Requirements

<a id="c-pm.functional-analysis.functional-requirements"></a>
### Functional requirements
*id: `pm.functional-analysis.functional-requirements` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A statement of behaviour the system must exhibit — something an actor can trigger
and observe. "The system shall email a receipt when a payment succeeds" is functional. "The
receipt shall arrive within 60 seconds" is not, because it constrains how well the behaviour
performs rather than whether the behaviour exists at all. The pair is the point: functional
requirements say *what*, non-functional requirements say *how well*, and most requirement
sentences can be pushed across that line by rewording alone.

**Why it matters** The classification decides how the requirement is checked. A functional
requirement is typically satisfied or not — the behaviour is present or absent — so it is
exercised once and observed. A missing one is a missing capability, and missing capabilities
surface late, in acceptance testing, when they are expensive. Functional requirements are also
the part of a system stakeholders volunteer without being asked, which is exactly why the
non-functional side has to be elicited deliberately rather than waited for.

**How it works** In most practice each behaviour is written as its own statement, in a "the
system shall ..." or equivalent form, phrased as an observable outcome rather than an
implementation. "The system shall store customer records in PostgreSQL" is not usually treated
as a functional requirement: it names a solution. The requirement is "the system shall let a
service agent retrieve any customer record by account number"; the database is a design
decision, or a constraint imposed from outside. Note what the rewrite does not do — it states a
behaviour and stops, adding no threshold, because the moment a bound is attached the sentence
has crossed into the non-functional side. Keeping those apart is what leaves a designer room to
design, and it is a
distinction an exam item can present from either direction — a requirement disguised as a
solution, or a solution offered as a requirement.

**Key terms** behaviour; "shall" statement; observable outcome; actor; design decision versus
requirement.

**Traps** Three confusions, in rough order of how often they are tested. First, functional
against non-functional: "the system shall authenticate users" is functional, "authentication
shall complete within two seconds" is not, and the second sentence exists only because the first
one does. Second, requirement against solution: a named vendor, product or protocol inside a
requirement is usually a constraint smuggled in as a need. Third, and most quietly wrong,
"functional" says nothing about importance — a must-have and a deliberately deferred requirement
can both be functional. Classification and priority are independent axes, so any option that
treats "non-functional" as a synonym for "optional," "nice to have," or "technical detail" is
wrong on its face.

**What the exam may test** Given one requirement sentence, classify it as functional or
non-functional; and, given a short list, spot the item that is not a requirement at all but a
design decision written in requirement voice.

<a id="cmp-pm.functional-analysis.functional-requirements"></a>
#### Not to be confused with: Functional requirements vs Non-functional requirements
*compares: `pm.functional-analysis.functional-requirements`, `pm.functional-analysis.non-functional-requirements`*

| | Functional requirements | Non-functional requirements |
| --- | --- | --- |
| Question answered | What must the system do? | How well must it do it, and under what conditions? |
| Typical wording | "The system shall issue a refund when a return is approved" | "...within 500 ms at 1,000 concurrent users", "available 99.9% of each month" |
| Usually checked by | Exercising the behaviour once and observing the outcome | Measuring against a threshold, under load or over time |
| Effect on architecture | Often addable later as another feature | Frequently decisive up front — retrofitting is a rebuild |
| What failure looks like | The capability is absent or does the wrong thing | The capability works, but too slowly, insecurely, or unreliably |
| How it usually surfaces | Volunteered unprompted — stakeholders describe what they want the system to do | Rarely volunteered; typically has to be drawn out deliberately during elicitation |

The separating axis is what the sentence constrains: a functional requirement constrains
behaviour, a non-functional requirement constrains the quality of that behaviour. Everything
else in the table follows — including why an unquantified non-functional requirement is nearly
worthless, since there is no threshold left to measure against.

<a id="c-pm.functional-analysis.non-functional-requirements"></a>
### Non-functional requirements
*id: `pm.functional-analysis.non-functional-requirements` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Constraints on how well the system performs the behaviours the functional
requirements describe: performance, availability and reliability, scalability, security,
usability, maintainability, portability, and compliance. They are commonly grouped as quality
attributes, or informally as the "-ilities". A non-functional requirement is not an optional
requirement and not a vague one — in most practice a usable one carries an attribute, a metric,
a threshold, and the conditions the threshold is measured under.

**Why it matters** These are frequently the requirements that decide the architecture, which is
why they are worth eliciting early even though nobody volunteers them. A feature can usually be
added to an existing design; "must keep serving during the loss of a data centre" or "must
support 10,000 concurrent sessions" generally cannot be added to a design that never assumed it.
The cost of discovering a non-functional requirement late is therefore structural, not
incremental — that asymmetry is the reasoning an exam scenario is usually reaching for.

**How it works** A typical non-functional requirement names the attribute, then makes it
measurable: "99.9% availability measured monthly" is a budget of roughly 43 minutes of downtime
in a 30-day month, which is a number an operations team can be held to, whereas "highly
available" is not. The same treatment applies across attributes — response time at a stated
percentile and load, recovery time after a failure, a maximum time for a new administrator to
complete a named task. Security and compliance requirements often arrive as externally imposed
constraints rather than stakeholder wishes, and are commonly non-negotiable in a way performance
targets are not: "customer records shall be retained for seven years" is typically fixed by a
records or tax rule rather than chosen, and is usually recorded on the non-functional side as a
constraint on how data is handled — though, as the traps below show, a sentence of this shape is
one of the ones that can be reworded across the line.

**Key terms** quality attribute; threshold and measurement condition; availability target;
percentile response time; imposed constraint.

**Traps** The classification inverts easily under rewording: "the system shall encrypt stored
card data" reads functional, but the same intent expressed as "stored card data shall be
unreadable without the key" reads as a security quality attribute. Both classifications are
defensible in practice, so an exam item that hinges on such a sentence will usually make the
intent obvious — look for whether the sentence adds a behaviour or bounds one. The second trap
is the word itself: "non-functional" describes the *kind* of requirement, never its importance,
and treating it as "lower priority" is the single most common inversion. The third is
untestability: "the system must be fast," "the interface must be user-friendly," "it should
scale" are defects as written, because nothing in them can pass or fail.

**What the exam may test** Classifying a given statement; picking out which of several
non-functional requirements is unverifiable as worded; and recognising a scenario where a late
non-functional discovery forces architectural rework rather than a simple change request.

*Not to be confused with [functional requirements](functional-analysis.md#cmp-pm.functional-analysis.functional-requirements).*

#### Scenario

A finance lead asks for "a faster invoicing system, and it needs an approval step." Split the
sentence before anything else happens. "An approval step" is functional — a behaviour that
either exists or does not, and it needs its actors and its outcome pinned down. "Faster" is
non-functional and, as stated, untestable; it becomes a requirement only when someone commits to
an attribute, a threshold and a condition, such as an invoice batch of 5,000 completing within
ten minutes. Note that the finance lead also said "and put it on the new Oracle box" — that is a
constraint or a design decision, not a requirement, and recording it as one would remove a
choice the designer has not yet had a chance to make. Note finally that "faster" may well be the
higher-priority of the two; being non-functional says nothing about that.

#### Knowledge check

1. Classify each: "the system shall lock an account after five failed logins" and "the system
   shall recover from a node failure within 30 seconds."
   The first is functional — a behaviour that happens or does not. The second is non-functional
   — it bounds how well recovery, a behaviour, performs.
2. Why is "the system must be user-friendly" a defective requirement, and what is the minimum
   that fixes it?
   Nothing in it can pass or fail. It needs a measurable form — an attribute, a threshold and a
   stated condition, such as a named task completed by an untrained user within a set time.
3. A stakeholder writes "the system shall use RabbitMQ for messaging." What kind of statement is
   this, and why does the distinction matter?
   It is a design decision or an imposed constraint, not a requirement — it names a solution
   instead of a need, and recorded as a requirement it removes a design choice without anyone
   deciding to.
4. Does calling a requirement "non-functional" say anything about its priority?
   No. Classification (functional versus non-functional) and priority (must, should, could) are
   independent axes; a non-functional requirement is frequently the highest-priority item in the
   set.

<a id="s-functional-analysis-analysis"></a>
## Analysis

<a id="c-pm.functional-analysis.requirements-elicitation"></a>
### Requirements elicitation
*id: `pm.functional-analysis.requirements-elicitation` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** The work of drawing requirements out of people, rather than collecting them:
interviews, facilitated workshops, observing people doing the job, studying existing documents
and support tickets, surveys, and prototypes shown mainly to provoke a reaction. The word choice
is deliberate in most practice — "gathering" implies requirements already exist in finished form
and merely need picking up, and elicitation exists precisely because they usually do not.

**Why it matters** Stated wants and actual needs differ, routinely and without anyone lying.
Users describe solutions they have imagined ("add a button here") rather than the problem behind
them; long-standing workarounds become invisible to the people performing them; and rules that
govern the work often survive only in a document nobody has read for years. A team that
transcribes what it was asked for and builds exactly that can deliver a system that passes every
check against the specification and still fails the people who asked for it.

**How it works** Techniques are typically combined because they fail differently. Interviews
reach individual expertise but capture what someone can articulate on the spot; workshops
surface disagreement between stakeholders that individual interviews hide; observation catches
the workaround the interviewee never thought to mention; document and ticket analysis catches
constraints and recurring failures nobody remembers to raise. Elicitation is also a distinct step
from what follows it — structuring and modelling what was heard, writing it down as agreed
statements, and checking later that the right thing was built are separate activities with
separate failure modes.

**Key terms** interview; facilitated workshop; observation; document analysis; stated want versus
actual need.

<a id="c-pm.functional-analysis.use-case"></a>
### Use case
*id: `pm.functional-analysis.use-case` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A structured description of how an actor interacts with the system to achieve a
goal, written to be complete enough to build and test against. In most practice it carries a
named actor, a goal, preconditions, a main success scenario written as numbered steps,
alternate and exception flows for the ways the interaction can diverge or fail, and the
postcondition that holds once it is done. The alternate paths are not decoration — they are the
part that distinguishes a use case from a one-line statement of need.

**Why it matters** Most of the cost and most of the defects in an interaction live outside its
happy path: the card is declined, the session expires mid-form, the approver is on leave, the
external service times out. A use case is the artifact that forces those to be decided before
implementation rather than discovered in testing, and it gives the tester a ready-made list of
paths to exercise.

**How it works** An actor is anyone or anything outside the system boundary that initiates or
participates in the interaction — a person in a role, another system, or a scheduled trigger,
which is why "actor" is preferred over "user". The main success scenario states the shortest
path from precondition to postcondition; each alternate flow attaches to the step it branches
from and rejoins or terminates explicitly. The description stays on the interaction: what the
actor does, what the system does in response, and what is observable. How the system achieves
it internally is design, and belongs elsewhere.

**Key terms** actor; goal; precondition and postcondition; main success scenario; alternate and
exception flow; system boundary.

**Traps** A use case diagram is not a use case: the diagram shows actors, the system boundary
and named interactions as ovals, and carries essentially none of the detail — the flows live in
the text, and a question offering the diagram as "the use case" is testing that. An actor need
not be human, so an option that rules out a scheduled job or an upstream system as an actor is
wrong. And a use case is not a user story at a longer word count; see the comparison below,
because the difference is one of intended completeness, not of length.

**What the exam may test** Naming an artifact from a fragment of it — a numbered interaction
with an exception branch is a use case, a single "as a role, I want ..." sentence is a user
story, a swimlane of hand-offs between departments is a process map; and recognising that
alternate and exception flows belong inside the use case rather than in a separate defect list.

<a id="cmp-pm.functional-analysis.use-case"></a>
#### Not to be confused with: Use case vs User story
*compares: `pm.functional-analysis.use-case`, `pm.project-management.user-story`*

| | Use case | User story |
| --- | --- | --- |
| Form | Actor, goal, preconditions, numbered main flow, alternate and exception flows, postcondition | One sentence — as a role, I want a capability, so that a benefit — usually with acceptance criteria |
| Intended completeness | Complete in itself: meant to be sufficient to build and test from | Deliberately incomplete: a placeholder for a conversation still to be had |
| Alternate paths | Explicit and part of the artifact | Not carried in the sentence; they emerge as acceptance criteria or separate stories |
| Usual home | Structured, plan-driven analysis; often accompanied by a use case diagram | An item on an agile backlog, estimated and pulled into an iteration |
| Written mainly for | Anyone who needs the interaction pinned down before build | The delivery team, as a reminder that a need must be discussed |

The separating axis is intended completeness, not length: a use case is written to be sufficient
on its own, and a user story is written to be insufficient on purpose. Every other row follows
from that — including why the alternate flows sit inside one and outside the other.

<a id="c-pm.functional-analysis.process-mapping"></a>
### Process mapping
*id: `pm.functional-analysis.process-mapping` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Diagramming a workflow — who does what, in what order, with what waiting in
between — so that hand-offs, delays, rework loops and duplicated effort become visible. Common
forms in practice include the plain flowchart, the swimlane diagram (one lane per role or
department, so every crossing of a lane boundary is a hand-off), and value stream style maps
that record the time work spends waiting as well as the time it spends being done.

**Why it matters** Process maps are usually drawn in two versions: the current workflow as it
actually runs, and the intended workflow after the change. The pair is what makes improvement
arguable — a single map of the intended future proves nothing, because there is no baseline to
show the difference against, and a map of the present alone names no destination. The as-is map
is also where the unwelcome findings live, since it is the artifact that shows a step existing
only because a system twenty years ago required it.

**How it works** The map covers the whole workflow, including the parts no software touches:
approvals given verbally, work queued in an inbox, a form carried between desks. That breadth is
what separates it from an interaction-level artifact — a use case describes one actor pursuing
one goal against the system, whereas a process map describes the surrounding business flow that
the interaction is only part of. Mapping is also usually done with the people who perform the
work rather than for them, on the same reasoning that makes elicitation more than transcription.

**Key terms** as-is map; to-be map; swimlane; hand-off; rework loop.

<a id="c-pm.functional-analysis.gap-analysis"></a>
### Gap analysis
*id: `pm.functional-analysis.gap-analysis` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A structured comparison of the current state against a desired state, whose
output is the set of differences and the work needed to close them. It presupposes that both
states have actually been described — which is what makes an as-is process map, or a documented
current capability inventory, a prerequisite rather than an optional extra.

**Why it matters** The list of gaps is what becomes scope: requirements, backlog items, or work
packages. Skipping the current-state half is the recurring failure, and it produces a plan that
funds work already done and omits work nobody realised was missing. Gap analysis is also how a
compliance or audit finding turns into a project — the desired state is the control set, the
current state is the assessment, and the gaps are the remediation plan.

**How it works** In most practice the comparison is done dimension by dimension — capability,
process step, control, skill, tooling — so each difference can be stated as a specific missing
or inadequate thing rather than a general sense of shortfall. What the technique does *not*
deliver is a judgement: it names the distance but not whether closing it is achievable,
affordable or worth doing. That judgement is a feasibility question, and a separate one from
whether a gap exists. Nor does it explain causes — asking why the current state is what it is
is root cause analysis, again a different activity.

**Key terms** current state; desired state; capability inventory; remediation; scope input.

<a id="c-pm.functional-analysis.requirements-prioritization"></a>
### Requirements prioritization
*id: `pm.functional-analysis.requirements-prioritization` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Ordering requirements by value and necessity so that, when time or budget runs
short, what gets dropped is decided deliberately and in advance rather than by whatever happens
to be unfinished. MoSCoW is a common scheme: Must have, Should have, Could have, and Won't have
— the last conventionally understood as "not in this delivery," a recorded decision with a
scope, not a permanent rejection.

**Why it matters** Prioritisation only does work when it forces a trade-off. A backlog where
every item is a Must has ordered nothing and has simply relabelled the whole list, which is why
schemes are usually applied with a cap on the top band or by forced ranking into a strict order.
The value shows up at the moment of pressure: an agreed ordering converts a delivery shortfall
into a planned reduction of scope instead of an argument.

**How it works** Beyond MoSCoW, practice uses forced ranking into a single ordered list,
value-versus-effort scoring, and weighted criteria where several stakeholder groups each carry a
weight. Whichever scheme is used, priority is its own axis and should not be conflated with the
neighbouring ones: it is not the requirement's classification (a non-functional requirement can
be a Must), not its effort estimate (a cheap item can be low priority and an expensive one can
be mandatory), and not a defect's severity, which is a property of a fault rather than of a
requirement.

**Key terms** MoSCoW; Must, Should, Could, Won't have this time; forced ranking; value versus
effort; priority versus estimate.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.functional-analysis.feasibility-study` | Feasibility study | An assessment, made before commitment, of whether a proposal is technically, operationally and economically achievable — with legal and schedule feasibility often added. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* Confused with gap analysis: a gap analysis says how far apart the current and desired states are, while a feasibility study asks whether closing that distance is achievable and worth committing to at all. Recognition of the term and its dimensions is enough at this level. |

#### Scenario

A claims department wants "the claims system replaced." Order the work. Elicitation first, and
not by asking what features they want: interview the assessors, then watch them work for a day,
because the spreadsheet three of them maintain privately will not come up in an interview. Map
the current workflow in swimlanes and the hand-off from assessment to payments turns out to
cross departments four times. Now the desired workflow can be drawn and the gap analysis becomes
concrete — six differences, of which two are process changes needing no software at all. The
feasibility question is separate and comes next: the two integrations required are the part that
may not be achievable in the budget, and a gap analysis says nothing about that. Finally,
prioritise: if every one of the six is a Must, nothing has been prioritised.

#### Knowledge check

1. Why does practice prefer "elicitation" to "requirements gathering"?
   Gathering implies finished requirements exist and only need collecting; stated wants and
   actual needs differ, so the requirements have to be drawn out and interpreted, not
   transcribed.
2. A team hands you a swimlane diagram of how work will flow after the project. What is missing,
   and why does it matter?
   The as-is map. Without a baseline there is nothing to compare against, so no gap can be
   demonstrated and no improvement can be argued.
3. What is the one-sentence difference between a gap analysis and a feasibility study?
   A gap analysis names the distance between current and desired state; a feasibility study
   judges whether closing that distance is achievable and worth committing to.
4. In MoSCoW, what does "Won't have" mean, and what does it not mean?
   Not in this delivery — a recorded, scoped decision. It does not mean rejected forever.
5. Is a use case diagram sufficient to build from?
   No. The diagram shows actors, the system boundary and named interactions; the main success
   scenario and the alternate and exception flows live in the use case text.
6. Give two ways priority differs from effort.
   Priority is about value and necessity, effort about cost to build: a cheap item can be low
   priority, and an expensive one can be mandatory. Scheduling combines them, but they are
   recorded separately.

<a id="s-functional-analysis-quality"></a>
## Quality

<a id="c-pm.functional-analysis.verification-vs-validation"></a>
### Verification vs validation
*id: `pm.functional-analysis.verification-vs-validation` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Two different checks, against two different references. Verification asks whether
the system was built right — does it match the specification that was agreed. Validation asks
whether the right thing was built — does it meet the actual need, whatever the specification
happened to say. The usual mnemonic, and the phrasing an exam item tends to echo, is "are we
building the product right" against "are we building the right product."

**Why it matters** The pair is trivially easy to invert, and it is inverted often enough that a
question can be built entirely on the inversion. The substantive point behind it is that a
system can pass verification completely and still fail: if the specification captured the wrong
need, then conformance to it is precisely the wrong thing to have achieved. That is why the two
checks cannot substitute for each other, and why passing every test in the plan is not by itself
evidence that the project succeeded.

**How it works** In most practice, verification activities compare an artifact to its stated
requirement — reviews and inspections of documents and design, static analysis, and unit,
integration and system testing written against specified behaviour. Validation activities put
the thing in front of the people whose need it is meant to serve: prototypes, demonstrations,
pilots, and user acceptance testing. Verification therefore tends to run continuously through
build; validation clusters at the points where real users can react to something concrete, which
is one reason iterative approaches validate earlier than sequential ones. Traceability supports
verification in particular, because demonstrating that every requirement has a test is a
conformance claim.

**Key terms** built right versus right thing built; review and inspection; conformance;
acceptance.

<a id="c-pm.functional-analysis.user-acceptance-testing"></a>
### User acceptance testing
*id: `pm.functional-analysis.user-acceptance-testing` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Testing performed by the people who will actually use the system — or business
representatives standing in for them — against their real work and agreed acceptance criteria,
rather than against the specification alone. It is typically the last gate before go-live, and
in most practice it ends in an explicit acceptance decision by the business rather than a defect
count from a test team.

**Why it matters** UAT is the clearest instance of validation in a delivery, which is what makes
it examinable: it is where "the right thing" is checked by the only people qualified to say so.
It is also where the wrong mental model shows up — treating UAT as a second pass over what the
test team already ran means the users spend it re-verifying conformance rather than exercising
their own work, and the one check that could catch a wrong specification is wasted.

**How it works** Users work through realistic tasks against realistic data, usually in a
dedicated environment, recording whether each acceptance criterion is met. It sits alongside
neighbouring activities that are routinely offered as distractors: system or QA testing is done
by testers against the specification and is verification, not validation; beta testing exposes a
near-final build to a wider, often external audience to find what a controlled test cannot;
operational acceptance testing checks that the thing can be *run* — backup and restore,
monitoring, failover, runbooks — and is typically performed by the operations team, not by end
users.

**Key terms** acceptance criteria; business sign-off; validation activity; system testing;
operational acceptance testing.

<a id="c-pm.functional-analysis.specification-documentation"></a>
### Specification documentation
*id: `pm.functional-analysis.specification-documentation` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Writing requirements down precisely enough that they can be agreed by
stakeholders, built against by a delivery team, and tested against afterwards — all three from
the same text. The individual statement is the requirement; the document that collects, numbers
and baselines them is the specification, and the exam can use either word.

**Why it matters** The specification is what verification compares against, so its quality caps
what verification can catch: an ambiguous statement cannot fail a review, because two readers who
disagree can both claim to conform. It is also the agreed baseline, which is what gives change
control something to control — without a baselined text, a change is indistinguishable from a
clarification, and scope drifts without anyone deciding that it should.

**How it works** Practice converges, loosely and without a single citable authority, on a
familiar set of qualities: each statement unambiguous, testable, necessary, consistent with the
others, feasible, and traceable to a source and forward to a test. The corresponding habits are
negative — avoid "fast," "user-friendly," "flexible," "etc.," and "and/or"; state one requirement
per statement so that half of it cannot pass; and keep solutions out, because a specification
states what is required, while how it will be built belongs in a design document. Numbering
statements is what makes traceability and change control mechanically possible at all.

**Key terms** requirement versus specification; baseline; unambiguous and testable; one statement
per requirement; design document.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.functional-analysis.traceability` | Traceability | Linking each requirement forward to its design, implementation and tests, and back to the need that justified it, so coverage and impact can both be demonstrated. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* Confused with testing itself: traceability shows that every requirement has a test and that every piece of work has a reason, not that anything passed. It is also what makes impact analysis possible when a requirement changes. |

#### Scenario

A release passes every test in the plan, and the traceability matrix shows each numbered
requirement mapped to at least one test case. Two weeks after go-live the department is still
using its old spreadsheet. Nothing here contradicts anything: the tests demonstrated
verification — the system conforms to the specification — and the matrix demonstrated coverage,
not correctness of the need. What was never done was validation, and the specification statement
at fault reads "the system shall provide flexible reporting," which no reviewer could have failed
because no two readers had to agree on what it meant. Real user acceptance testing, run by
assessors against their own work rather than as a second pass over the test team's script, would
have surfaced the mismatch before release rather than after it.

#### Knowledge check

1. State verification and validation in one sentence each, without using the other word.
   Verification checks the system against the agreed specification; validation checks it against
   the actual need it was meant to serve.
2. A system passes 100% of its verification tests and is still the wrong system. How?
   The specification captured the wrong need, so conformance to it is conformance to the wrong
   target. Verification cannot detect that; validation can.
3. Is user acceptance testing verification or validation, and what is the closest activity on the
   other side?
   Validation. System or QA testing, run by testers against the specification, is the
   verification counterpart.
4. What does a traceability matrix demonstrate, and what does it not?
   That every requirement is linked to design, implementation and at least one test — coverage
   and impact. It does not demonstrate that any test passed or that the requirement was right.
5. Why is "the system shall provide flexible reporting" a defect in a specification rather than
   merely a weak sentence?
   It is not testable and not unambiguous, so it can neither fail a review nor fail a test; two
   readers can conform to opposite readings of it.
6. What does baselining a specification buy a project?
   A fixed reference: change control has something definite to control, so a change can be
   distinguished from a clarification instead of scope moving unnoticed.
