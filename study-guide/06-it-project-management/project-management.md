# Project Management

Project Management is the largest competency by concept count (29) in IT Project Management
Fundamentals, the domain carrying 10% of the exam — 6th largest of 6 domains — under the
current (2025-09-16) blueprint, and its objective was **reworded** in the 2025 update, having
previously been titled "Software Project Management" inside a domain then called Supporting
Applications and Developers. LFS200 barely touches it: 4 FULLY COVERED, 25 NOT COVERED —
4/29 (14%) are not NOT COVERED, and the four it does reach (project, waterfall, agile,
sprint) sit in a single lesson (`research/lfs200-notes/00-course-map.md`). One structural
warning, and this file carries the heaviest concentration of it in the guide: 13 of these 29
concepts remain waived from the independent-sourcing requirement because the authoritative
references for classical project management — PMBOK, the PMI Lexicon, ISO 21500/21502 — are
paywalled (the cycle 3 waiver sourcing sprint cleared the other six). Every still-waived
concept below carries an explicit marker and is written as consensus practice, deliberately
hedged. Where a primary source does exist (the Agile Manifesto, the 2020 Scrum Guide, the
Kanban Guide) the language is firm, and the difference between the two registers is
intentional: treat a hedged claim as the industry's common answer, not as something a
standards body has stated.

<a id="s-project-management-fundamentals"></a>
## Fundamentals

<a id="c-pm.project-management.project"></a>
### Project
*id: `pm.project-management.project` · depth 2 · importance 1 · LFS200: FULLY COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A temporary effort with a defined start, a defined end, and a defined
objective. Temporariness is the definition — not size, not budget, not how technical the work
is. Its opposite is operations: the ongoing, repeating work of running what already exists.
Migrating four hundred servers to a new release is typically classed as a project; patching
those servers every month afterwards is operations, however large the effort.

**Why it matters** The commonest question shape in this competency presents several described
activities and asks which one is a project. The discriminator is almost never effort or
complexity — it is whether the work has an end date and a unique objective, or whether it
repeats indefinitely as part of keeping the lights on.

**How it works** In most descriptions of the practice a project is authorised by a sponsor,
scoped against its objective, delivered, and then formally closed — at which point whatever it
produced is handed to operations to run. Related projects are commonly grouped into a
programme, and programmes and projects together into a portfolio for investment decisions;
those are containers of larger scope, not bigger projects.

**Key terms** temporary; operations (business as usual); unique objective; sponsor; programme;
portfolio.

<a id="c-pm.project-management.triple-constraint"></a>
### Triple constraint
*id: `pm.project-management.triple-constraint` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Three interdependent limits on any project — scope (what is being built), time
(when it must be finished), and cost (what may be spent) — which together bound the quality of
the result. It is commonly drawn as a triangle and called the iron triangle. Changing any one
leg forces a change in at least one other; if no other leg is allowed to move, quality absorbs
the difference silently.

**Why it matters** This is the model the exam most reliably reaches for when it wants a
judgement rather than a recall answer: a stakeholder asks for more scope at the same date and
the same budget, and the candidate must name what actually gives. Answering "the team works
harder" is the trap option, because it names none of the three legs and quietly sacrifices the
fourth quantity the model is about.

**How it works** In the usual statement of the model, fixing any two legs determines the
third. Adding scope with the date and budget frozen leaves only quality to give. Pulling the
date in without cutting scope typically means either more cost (more people, overtime,
contractors) or lower quality. Adding people to work that is already late is the classic
false economy: new people typically consume the time of the people already there before they
produce anything, so the short-term effect is usually slower, not faster.

**Key terms** scope; schedule; cost; quality; baseline; trade-off.

**Traps** Quality is generally presented as the quantity the three legs bound, not as a fourth
lever that can be traded freely — a scenario in which "we will just lower quality" is offered
as a deliberate, priced decision is describing a scope cut, not a fourth constraint. The
triple constraint is also not a list of what the project produces, and it is not the "pick any
two" joke in a literal sense: all three are always in play, and what "pick two" really means is
that fixing two of them determines the third rather than leaving it free.

**What the exam may test** Given a scenario in which one leg is changed by a stakeholder, name
which other leg must move, or name what is being sacrificed if none is allowed to. Recognising
that the correct answer is a trade-off, not an appeal to effort, is the whole skill.

*Not to be confused with [deliverable and milestone](project-management.md#cmp-pm.project-management.deliverable-and-milestone).*

<a id="c-pm.project-management.stakeholder"></a>
### Stakeholder
*id: `pm.project-management.stakeholder` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Anyone affected by the project or able to affect it. That is a deliberately
wide net: it includes the sponsor who funds it, the end users, the operations team who will
inherit and run the result, and the security, legal, or compliance reviewers who can block it
without ever using it. A stakeholder is not necessarily a customer, and not necessarily
anyone on the delivery team.

**Why it matters** The examinable move is almost always to name someone peripheral — an
auditor, the service desk, a downstream team whose integration will break — and ask whether
they are a stakeholder. The test is impact-or-influence, not proximity on an org chart, so the
answer is usually yes.

**How it works** Stakeholders are typically identified at the start and recorded, then
classified by how much influence they hold and how much interest they have, so that the amount
and kind of communication each receives can be decided deliberately rather than by whoever
shouts loudest. That classification is what a communication plan then encodes. Missing a
stakeholder is commonly described as a leading cause of late-surfacing requirements, because
an unidentified stakeholder's constraints arrive as a surprise at review time.

**Key terms** sponsor; end user; influence and interest; stakeholder register; blocker.

<a id="c-pm.project-management.deliverable-and-milestone"></a>
### Deliverable and milestone
*id: `pm.project-management.deliverable-and-milestone` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A deliverable is a tangible output the project produces and hands over: a
migration runbook, a signed-off design, a released binary, the migrated fleet itself. A
milestone is a marked point in the schedule signifying that something significant is now true
— typically carrying zero duration and consuming no effort or budget, because it marks an
event rather than performing work.

**Why it matters** These two are routinely used as if interchangeable in status reports, and
the exam exploits that. "Design complete" is a milestone; the design document is the
deliverable. A question that asks which items in a list are milestones is testing whether the
candidate knows a milestone has no duration.

**How it works** In common practice, deliverables are what the work breakdown structure
decomposes and what acceptance criteria are written against; milestones are what the schedule
hangs on, usually placed at phase boundaries, external dependencies, or the acceptance of a
major deliverable. A milestone therefore often marks a deliverable — "runbook accepted" — but
the two are different objects: one is a thing that exists, the other is a date on which
something became true.

**Key terms** output; acceptance; zero duration; phase gate; schedule marker.

**Traps** A milestone is not a task and, in most scheduling conventions, has no duration, no
assignee doing work inside it, and no cost of its own — a schedule showing a two-week
milestone is showing a mislabelled task. A deliverable is not automatically a milestone
either: a project can produce dozens of deliverables and mark only a handful of milestones.
Nor is a phase a milestone; the phase is the span of work, the milestone is the instant at
its boundary.

**What the exam may test** Sorting a mixed list into deliverables and milestones, and
recognising the zero-duration property as the giveaway. A secondary form asks what a milestone
being missed actually tells you: that a checkpoint was not reached on its date, which is a
schedule signal, not by itself a statement about what was or was not produced.

<a id="cmp-pm.project-management.deliverable-and-milestone"></a>
#### Not to be confused with: Deliverable and milestone vs Triple constraint
*compares: `pm.project-management.deliverable-and-milestone`, `pm.project-management.triple-constraint`*

| | Deliverable and milestone | Triple constraint |
| --- | --- | --- |
| What it names | What the project produces, and the dated checkpoints marking progress | The three limits — scope, time, cost — that bound the work and the quality of its result |
| Category | Objects and schedule points, countable and listable | A relationship between three quantities, not a thing you can list |
| How it changes | New deliverables are added by changing scope; milestones move when the schedule moves | Legs are traded against each other; moving one forces another to move |
| What a question about it asks | "Which of these is a milestone?" — sorting items by type | "Scope grew and the date is fixed — what gives?" — naming a trade-off |
| Relationship | Deliverables are the concrete content of the scope leg; milestones are markers on the time leg | The frame within which those deliverables and dates are negotiated |

The separating axis is category: deliverables and milestones are the countable contents of a
project, while the triple constraint is the relationship between the limits those contents are
negotiated inside.

<a id="c-pm.project-management.software-development-lifecycle"></a>
### Software development lifecycle
*id: `pm.project-management.software-development-lifecycle` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: nist-sp-800-64-sdlc-phases*

**What it is** The set of phases software passes through on its way from an idea to a retired
system: requirements, design, implementation, testing, deployment, and maintenance. The list
names the work that has to happen. It does not name the order, the batch size, or the rhythm
in which that work is done — those are the methodology's business.

**Why it matters** The single most common misunderstanding in this competency is treating
"SDLC" as a synonym for waterfall, because the phases are conventionally listed in that
order. They are not the same thing: waterfall is one policy for traversing these phases (each
one completed before the next begins), and an agile team traverses the same phases repeatedly,
in miniature, inside every iteration.

**How it works** In most descriptions the phases feed one another — requirements inform
design, design informs implementation, testing validates against the requirements — and
maintenance, which typically consumes the largest share of a system's total lifetime cost, is
a phase in its own right rather than an afterthought. What varies between methodologies is how
much scope goes through the phases at a time and how often the loop runs.

**Key terms** phase; requirements; design; implementation; testing; deployment; maintenance.

#### Scenario

An operations team is told to move four hundred servers to a new LTS release by the end of Q3.
That is a project: temporary, with an end date and a unique objective — the monthly patching
that continues afterwards is operations, however large. The runbook and the migrated fleet are
deliverables; "pilot batch accepted" is a milestone, marking an instant rather than occupying
two weeks of the plan. The security lead who must sign off the base image never touches a
server but can stop the work, so she is a stakeholder on the influence test alone. Mid-way the
sponsor adds a hundred servers with date and budget untouched: with scope up and two legs
frozen, either the date, the budget, or quality gives. Whichever methodology the team picks,
the same lifecycle phases still occur — the choice only changes how much scope passes through
them at a time.

#### Knowledge check

1. What single property separates a project from operations, and which property does not?
   A defined end with a unique objective separates them; size, budget, and technical
   difficulty do not.
2. A schedule line reads "Design complete — 2 weeks". What is wrong with calling that a
   milestone?
   A milestone conventionally has zero duration: it marks the instant something became true.
   A two-week span is a task or a phase, mislabelled.
3. Scope grows, the delivery date is frozen, and no extra budget is available. Name what must
   absorb the change.
   Quality — it is the quantity the three legs bound. "The team works harder" is not one of
   the legs and is the distractor.
4. Why is "the SDLC is waterfall" wrong?
   The SDLC names the phases that must happen; waterfall is one policy for sequencing them.
   An agile team runs the same phases repeatedly inside each iteration.
5. An internal auditor will never use the system but can refuse to approve its release. Is
   the auditor a stakeholder?
   Yes — the test is whether someone is affected by the project or able to affect it, not
   whether they are a user or on the team.

<a id="s-project-management-methodologies"></a>
## Methodologies

<a id="c-pm.project-management.waterfall"></a>
### Waterfall
*id: `pm.project-management.waterfall` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A sequencing policy for the lifecycle phases: each phase is completed and
approved before the next one starts, and the whole scope moves through the phases together in
one batch. Waterfall is not the phase list itself — the phases belong to the lifecycle — it is
the rule that you finish one before beginning the next.

**Why it matters** Methodology questions in this competency are routinely a
waterfall-or-agile judgement dressed in a scenario, and the exam expects a candidate to pick
waterfall on genuinely stable requirements rather than to treat it as an obsolete mistake.
Fixed regulatory scope, a fixed-price contract with a specified deliverable, or a dependency
on hardware that cannot be redesigned mid-flight are all cues that point at waterfall.

**How it works** In the usual account, each phase ends in an approved artefact — a signed
requirements specification, an approved design — that becomes the input to the next phase and
the baseline against which later change is measured. Because the whole scope moves as one
batch, working software typically appears only once and late, after implementation and
testing. That is where waterfall's risk sits: an error made in requirements is commonly not
discovered until the test phase, by which time everything built on it has to be revisited.

**Key terms** phase gate; sign-off; baseline; big-bang delivery; predictability.

**Traps** Waterfall does not forbid change; it routes change through change control and prices
it, and the price rises the later the change lands. Nor is waterfall defined by producing
documentation — an agile team can produce a great deal of documentation and still not be doing
waterfall, because what defines waterfall is the one-batch, finish-before-you-start sequencing.
And "we do waterfall" is not a synonym for "we have a plan": plan-driven scheduling artefacts
such as Gantt charts are associated with it, but having a schedule is not what makes an
approach waterfall.

**What the exam may test** Reading a scenario for the requirements-stability cue and choosing
waterfall or an iterative approach on that basis, and identifying that late change is expensive
in waterfall because completed downstream phases must be redone — not because change is
forbidden.

*Not to be confused with [agile](project-management.md#cmp-pm.project-management.agile).*

<a id="c-pm.project-management.agile"></a>
### Agile
*id: `pm.project-management.agile` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: agile-manifesto, agile-principles*

**What it is** A set of values and principles for software development, published in 2001 as
the Manifesto for Agile Software Development and its twelve accompanying principles. It is not
a process, a framework, or a set of meetings — it is a statement of what to prefer when two
good things compete. Its four value statements each rank one thing above another: people and
their interactions above processes and tools; software that works above comprehensive
documentation; collaboration with the customer above negotiating the contract; and responding
to change above following the plan.

**Why it matters** Because agile is values rather than mechanism, exam options routinely
substitute a framework for it — offering "Scrum" where the question is about agile, or
describing a daily standup as though attending one made a team agile. The candidate has to
hold the levels apart: agile is the value system, Scrum and Kanban are among the ways teams
operationalise it.

**How it works** The twelve principles supply the mechanism the values imply: satisfy the
customer through early and continuous delivery of valuable software; welcome changing
requirements even late in development; deliver working software frequently, on a timescale
from a couple of weeks to a couple of months, preferring the shorter; treat working software
as the primary measure of progress; sustain a constant pace indefinitely; and have the team
reflect at regular intervals on how to become more effective and adjust accordingly. Short
cycles are the engine — they are what makes late change affordable, because only one small
batch of work is ever exposed to it.

**Key terms** iteration; working software; welcoming change; continuous delivery of value;
regular reflection.

**Traps** The Manifesto explicitly says the lower-ranked item in each pair still has value —
so "agile means no documentation," "agile means no plan," and "agile means no contract" are
all misreadings of a preference as an abolition. Agile is also not Scrum: Scrum is one
framework beneath the values, and a team can be running Scrum's events faithfully while
violating the principles. And agile is not the absence of discipline: a fixed-length sprint,
a definition of done, and a refusal to let quality drop are all more constraining than most
ad-hoc processes.

**What the exam may test** Distinguishing the value layer (agile) from the framework layer
(Scrum, Kanban) when both appear as options, and recognising which described behaviour matches
a principle — frequent delivery of working software, welcoming late change — rather than
matching a ceremony name.

<a id="cmp-pm.project-management.agile"></a>
#### Not to be confused with: Agile vs Waterfall
*compares: `pm.project-management.agile`, `pm.project-management.waterfall`*

| | Agile | Waterfall |
| --- | --- | --- |
| What it is | A set of values and principles (2001 Manifesto), realised through frameworks such as Scrum or Kanban | A sequencing policy for the lifecycle phases: complete and approve one before starting the next |
| How requirements are treated | Expected to change; change is welcomed even late in development | Baselined early; later change goes through change control and costs more the later it arrives |
| When working software appears | Early and repeatedly, one small increment at a time | Typically once and late, after implementation and testing |
| Where risk concentrates | Spread across iterations; wrong assumptions surface within weeks | At the end; a requirements error can go undetected until the test phase |
| Batch size | One iteration's worth of scope | The whole scope, moving through the phases together |
| Best fit | Uncertain or evolving requirements, where feedback is worth more than a fixed plan | Genuinely stable requirements, fixed regulatory or contractual scope, hard external dependencies |

The separating axis is batch size and when change is allowed: agile moves a small slice of
scope through the whole lifecycle repeatedly so change stays cheap, while waterfall moves all
of the scope through once so change after sign-off is expensive by construction.

<a id="c-pm.project-management.scrum"></a>
### Scrum
*id: `pm.project-management.scrum` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: scrum-guide-2020*

**What it is** A lightweight framework — the Scrum Guide's own word — for generating value
through adaptive solutions to complex problems. Concretely it is one Scrum Team of typically
ten or fewer people, three accountabilities (Product Owner, Scrum Master, Developers), five
events, and three artefacts each carrying a commitment. It is one agile framework, not agile
itself, and not a general project-management methodology.

**Why it matters** Scrum supplies most of this competency's vocabulary, and exam wording often
uses "Scrum" loosely where it means "agile" or even "any iterative process." Knowing what
Scrum actually defines — and, just as importantly, what it does not — is what lets a candidate
reject a plausible-sounding option that describes a common add-on rather than the framework.

**How it works** The Scrum Guide's own summary is a loop: the Product Owner orders the work
for a complex problem into a Product Backlog; the Scrum Team turns a selection of that work
into an Increment of value during a Sprint; the team and its stakeholders inspect the results
and adjust for the next Sprint; repeat. The whole design rests on empirical process control —
transparency, inspection, and adaptation — which is why the events exist at fixed points and
why the artefacts are required to be visible.

**Key terms** framework; accountabilities; empiricism (transparency, inspection, adaptation);
Increment; Scrum Team.

**Traps** Scrum defines no project manager and no team lead, and the Scrum Master is not a
substitute for one. It also does not prescribe user stories, story points, velocity, or
burndown charts — those are widely used add-ons, and the Guide mentions forecasting practices
such as burn-downs only to note that, while useful, they do not replace empiricism. The 2020
edition also changed vocabulary that older material still uses: it speaks of three
*accountabilities*, not roles,
and of *Developers* within one Scrum Team, not a separate "Development Team." A question
built on pre-2020 wording is still answerable, but the current terms are the safer reading.

**What the exam may test** Separating Scrum from agile-in-general, separating what the
framework requires from what teams commonly bolt on, and distinguishing Scrum's fixed-length
iteration model from Kanban's continuous flow.

*Not to be confused with [Kanban](project-management.md#cmp-pm.project-management.kanban).*

<a id="c-pm.project-management.sprint"></a>
### Sprint
*id: `pm.project-management.sprint` · depth 2 · importance 1 · LFS200: FULLY COVERED · sources: scrum-guide-2020*

**What it is** A fixed-length event of one month or less, inside which all the other Scrum
events take place — the Sprint is itself an event, and a container for the rest, not merely a
period of time between meetings. A new Sprint starts immediately after the previous one
concludes. Two weeks is a very common length; it is a convention, not a rule.

**Why it matters** The fixed length is the mechanism, not a detail: because the box does not
move, the only variable is how much fits inside it, which is what makes forecasting from past
Sprints possible at all. A scenario in which a Sprint is extended "just a few days to finish"
has destroyed the one property the Sprint exists to provide.

**How it works** The Scrum Guide sets four conditions that hold during a Sprint: no changes
are made that would endanger the Sprint Goal; quality does not decrease; the Product Backlog
is refined as needed; and scope may be clarified and renegotiated with the Product Owner as
more is learned. That last condition is the nuance most often missed — the Sprint is not
sealed against all change, only against change that would put the Sprint Goal at risk. A Sprint
may be cancelled if the Sprint Goal becomes obsolete, and only the Product Owner has the
authority to cancel it.

**Key terms** timebox; Sprint Goal; Increment; refinement; cancellation.

<a id="c-pm.project-management.scrum-roles"></a>
### Scrum roles
*id: `pm.project-management.scrum-roles` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: scrum-guide-2020*

**What it is** The three accountabilities within a single Scrum Team. The Product Owner is
accountable for maximising the value of the product resulting from the team's work, and for
effective Product Backlog management — developing and communicating the Product Goal, creating
and clearly communicating backlog items, ordering them, and keeping the backlog transparent.
The Scrum Master is accountable for establishing Scrum as defined in the Guide and for the
team's effectiveness, coaching self-management, and causing the removal of impediments. The
Developers are accountable for creating the Sprint Backlog, instilling quality by adhering to
the Definition of Done, adapting their plan each day toward the Sprint Goal, and holding each
other accountable as professionals.

**Why it matters** Every one of the three is routinely mapped onto a traditional job title,
and each mapping is wrong in an examinable way: the Scrum Master is not the manager who assigns
work, the Product Owner is not a messenger relaying requests from a committee, and the
Developers are not a resource pool told how to do the work.

**How it works** Ordering authority sits with one person: those who want the Product Backlog
changed do so by convincing the Product Owner, whose decisions the organisation must respect.
The Product Owner may delegate the work of backlog management but remains accountable for it.
The Developers decide how the work gets done — no one else tells them how to turn backlog items
into an Increment. The Scrum Guide's 2020 edition calls these accountabilities rather than
roles, and names the third group "Developers" rather than the older "Development Team."

**Key terms** accountability; Product Goal; impediment; self-management; ordering authority.

<a id="c-pm.project-management.scrum-ceremonies"></a>
### Scrum ceremonies
*id: `pm.project-management.scrum-ceremonies` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: scrum-guide-2020*

**What it is** The four events held inside the Sprint — Sprint Planning, the Daily Scrum, the
Sprint Review, and the Sprint Retrospective — plus the Sprint itself, which contains them.
"Ceremonies" is industry usage, not the Scrum Guide's word; the Guide calls them events. Each
exists to create a formal opportunity to inspect something and adapt, which is why skipping one
is not merely dropping a meeting.

**Why it matters** The most reliably examined discrimination in the whole competency lives
here: the Sprint Review inspects the product, the Sprint Retrospective inspects the process.
Questions describe a purpose — "the team wants to improve how it works together" — and expect
the right event by name, with the other three present as plausible options.

**How it works** Timeboxes are stated for a one-month Sprint and shorter Sprints usually have
shorter events. Sprint Planning, at most eight hours, addresses three topics: why this Sprint
is valuable (producing the Sprint Goal, which must be finalised before planning ends), what can
be done, and how the chosen work will get done. The Daily Scrum is a 15-minute event for the
Developers, held at the same time and place each working day, to inspect progress toward the
Sprint Goal and adapt the Sprint Backlog. The Sprint Review, at most four hours, is the second
to last event: the team presents results to key stakeholders, progress toward the Product Goal
is discussed, and attendees collaborate on what to do next. The Sprint Retrospective, at most
three hours, concludes the Sprint and inspects how the last Sprint went with regard to
individuals, interactions, processes, tools, and the Definition of Done.

**Key terms** event; timebox; Sprint Goal; inspection and adaptation; impediment.

**Traps** The Daily Scrum is for the Developers, not a status report delivered to a manager;
if the Product Owner or Scrum Master are actively working on Sprint Backlog items they
participate as Developers, and it is explicitly not the only time Developers may adjust their
plan. The Sprint Review is not a gate to releasing value — an Increment may be delivered to
stakeholders before the Sprint ends — and it is not merely a demo, because deciding what to do
next is part of it. And the fifteen-minute figure belongs to the Daily Scrum alone; the other
events' limits are hours, scaled down for shorter Sprints.

**What the exam may test** Matching a described purpose to the correct event, especially
Review (product) against Retrospective (process); recalling that the Daily Scrum is fifteen
minutes and is the Developers' event; and recognising that the Retrospective concludes the
Sprint while a new Sprint begins immediately afterwards.

*Not to be confused with [project closure and lessons learned](project-management.md#cmp-pm.project-management.project-closure-and-lessons-learned).*

<a id="c-pm.project-management.product-and-sprint-backlog"></a>
### Product and sprint backlog
*id: `pm.project-management.product-and-sprint-backlog` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: scrum-guide-2020*

**What it is** Two different artefacts with two different owners. The Product Backlog is an
emergent, ordered list of what is needed to improve the product, and the single source of work
undertaken by the Scrum Team; its commitment is the Product Goal. The Sprint Backlog is
composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint
(what), and an actionable plan for delivering the Increment (how); its commitment is the Sprint
Goal.

**Why it matters** Describing the Sprint Backlog as "the items pulled into the Sprint" drops
two of its three parts, and that omission is exactly what a question hinges on: without the
goal and the plan, the Sprint Backlog would just be a filtered view of the Product Backlog
rather than a plan by and for the Developers.

**How it works** The Product Backlog is ordered — a single sequence, not priority buckets —
and the Product Owner holds that ordering authority. Refinement is the ongoing activity of
breaking items down and adding detail, order, and size; the Developers who will do the work are
responsible for the sizing, though the Product Owner may help them understand trade-offs. Items
that the team could complete within one Sprint are deemed ready for selection at Sprint
Planning. The Sprint Backlog is updated throughout the Sprint as more is learned, and it
belongs to the Developers.

**Key terms** ordered list; refinement; Product Goal; Sprint Goal; sizing.

<a id="c-pm.project-management.kanban"></a>
### Kanban
*id: `pm.project-management.kanban` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: kanban-guide*

**What it is** A method for managing work as continuous flow rather than in fixed iterations,
built on six general practices: visualise the work, limit work in progress, manage flow, make
policies explicit, implement feedback loops, and improve collaboratively while evolving
experimentally. Its change-management principles are equally characteristic: start with what
you do now, agree to pursue improvement through evolutionary change, and encourage acts of
leadership at all levels.

**Why it matters** Kanban is the standard foil for Scrum in exam questions, and the axis the
question turns on is almost always the same: continuous flow with explicit work-in-progress
limits, against fixed-length iterations with a goal committed for the duration. Kanban is also
the natural fit for interrupt-driven operational work, where a two-week commitment would be
broken by the first incident.

**How it works** Work in progress limits are the mechanism everything else hangs off. By
capping how many items may sit in a stage at once, they turn the board into a pull system: new
work enters only when finishing something frees capacity. The Kanban Guide's core metrics
follow from that flow view — lead time, the time a single item takes to pass through the system
from the commitment point to completion; delivery rate, the number of completed items per unit
of time; and WIP itself, the number of items in the system at a point in time.

**Key terms** work in progress limit; pull system; flow; lead time; delivery rate;
commitment point.

**Traps** A board with columns is not Kanban. Without explicit WIP limits nothing constrains
the amount of work started, so there is no pull system and none of the flow benefits follow —
"we use a Kanban board" and "we practise Kanban" are different claims. Kanban also defines no
iterations, no timeboxes, and no team accountabilities of its own; the Kanban Guide describes
it as neither a methodology nor a process framework but a management method applied on top of
an existing way of working, which is why "Kanban or Scrum" is a false opposition in its own
terms even when an exam poses it as a choice. Feedback loops in Kanban are called cadences,
and they are not Scrum events under another name.

**What the exam may test** Naming WIP limits as Kanban's defining mechanism rather than the
board; choosing Kanban for continuous, unpredictable, interrupt-driven work and Scrum for
planned increments delivered on a cadence; and recognising lead time and delivery rate as flow
measures rather than productivity scores.

<a id="cmp-pm.project-management.kanban"></a>
#### Not to be confused with: Kanban vs Scrum
*compares: `pm.project-management.kanban`, `pm.project-management.scrum`*

| | Kanban | Scrum |
| --- | --- | --- |
| What it is | A management method applied on top of an existing process | A framework adopted as a whole, with defined accountabilities, events and artefacts |
| Rhythm of work | Continuous flow; items are pulled as capacity frees up | Fixed-length Sprints of one month or less |
| Limiting mechanism | Explicit work-in-progress limits per stage | The Sprint Goal and the fixed-length timebox around it |
| Roles defined | None of its own; existing roles continue | Three accountabilities: Product Owner, Scrum Master, Developers |
| Reprioritising mid-cycle | At any time — nothing was committed for a window | Not if it endangers the Sprint Goal, though scope may be clarified and renegotiated with the Product Owner |
| Characteristic measures | Lead time, delivery rate, WIP | An Increment meeting the Definition of Done each Sprint |

The separating axis is what each one limits: Kanban limits how much work may be in progress at
once and lets it flow continuously, while Scrum limits how long a batch of work may run before
it is inspected.

#### Scenario

A platform team runs two-week Sprints. On day four the Product Owner asks to swap in an urgent
integration; the Scrum Master's answer is not a flat refusal but the Sprint's actual rule —
scope may be clarified and renegotiated with the Product Owner, but no change may endanger the
Sprint Goal, and if the goal is now obsolete only the Product Owner can cancel the Sprint. At
the Sprint Review the team shows the Increment and agrees what comes next; the complaint that
"handovers to support keep stalling" is a process problem and belongs in the Retrospective, not
the Review. The support team next door works the same product but takes unplanned incidents all
day, so a Sprint Goal would break at the first outage: it runs Kanban with a WIP limit of three
per stage and watches lead time. Owning a board with columns is not what makes that Kanban;
the limits are.

#### Knowledge check

1. What is the one-sentence difference between agile and Scrum?
   Agile is a set of values and principles; Scrum is one framework that implements them, with
   defined accountabilities, events and artefacts.
2. Which Scrum event inspects the product, and which inspects the team's process?
   The Sprint Review inspects the product and what to do next; the Sprint Retrospective
   inspects individuals, interactions, processes, tools, and the Definition of Done.
3. How long is the Daily Scrum, and who is it for?
   Fifteen minutes, for the Developers — it is not a status report to a manager, and if the
   Product Owner or Scrum Master are actively working on Sprint Backlog items they take part
   as Developers.
4. Name the three parts of the Sprint Backlog.
   The Sprint Goal (why), the selected Product Backlog items (what), and an actionable plan
   for delivering the Increment (how).
5. A team has a board with To Do, Doing and Done columns and no other rules. Are they doing
   Kanban?
   No — without explicit work-in-progress limits there is no pull system, and WIP limits are
   the defining mechanism, not the board.
6. Scope for a regulated system is fixed by statute and cannot change during delivery. Which
   sequencing approach does that cue point to, and why?
   Waterfall — its expense comes from late change, which this scenario has ruled out, and its
   predictability is worth most when requirements are genuinely stable.

<a id="s-project-management-requirements"></a>
## Requirements

<a id="c-pm.project-management.user-story"></a>
### User story
*id: `pm.project-management.user-story` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: agile-alliance-glossary-user-story-template*

**What it is** A short statement of a need written from the user's point of view, conventionally
in three clauses: as a *role*, I want a *capability*, so that a *benefit*. The three clauses do
different jobs — the role says who wants it, the capability says what they want to be able to
do, and the benefit says why, which is the clause that lets the team propose a cheaper or
better solution than the one the requester had in mind.

**Why it matters** Exam items typically show a candidate sentence and ask whether it is a user
story. What disqualifies most of them is the missing benefit clause or an implementation
phrased as a need — "add an index to the users table" names a task, not a user, a capability,
or a reason.

**How it works** In common practice a story is deliberately small and deliberately incomplete:
it is a placeholder for a conversation rather than a specification, so the detail arrives
through refinement and through acceptance criteria attached to it. Larger needs that cannot be
finished in one iteration are usually called epics and split. Note that Scrum does not require
user stories at all; they are a widely used convention layered on top of the Product Backlog —
the 2020 Scrum Guide, cited under Scrum above, prescribes no format for Product Backlog items.

**Key terms** role; capability; benefit; epic; placeholder for a conversation.

**Traps** A user story is not a requirements specification — it is shorter and looser on
purpose. It is not a task either: tasks are how the team decomposes a story for its own
planning, and they are typically written in technical terms with no user in them. And a story
missing "so that" is the recurring defect in practice: with no benefit stated, the team cannot
tell whether a different implementation would satisfy the need just as well.

**What the exam may test** Recognising the canonical three-clause template and rejecting
sentences that are tasks, implementation instructions, or specifications wearing the template's
clothing.

*Not to be confused with [use case](functional-analysis.md#cmp-pm.functional-analysis.use-case).*

<a id="c-pm.project-management.acceptance-criteria"></a>
### Acceptance criteria
*id: `pm.project-management.acceptance-criteria` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: scrum-guide-2020*

**What it is** The specific conditions one work item must satisfy before it can be considered
complete, agreed before the work starts and written so each condition is objectively pass or
fail. They are per item: two stories in the same Sprint carry different criteria, because they
describe different needs.

**Why it matters** The pairing that gets tested is acceptance criteria against the Definition
of Done, and candidates who learned the two terms as synonyms lose the question. Scope is the
discriminator — one item versus every item — and it decides who writes them, how often they
change, and what failing them means.

**How it works** Criteria are typically drafted with the Product Owner or requester while the
item is refined, then used at review time as the checklist deciding acceptance. Because they
are stated as conditions rather than as solutions, they usually translate directly into tests.
Note that the Scrum Guide does not define acceptance criteria as a Scrum element at all; what
it defines is the Definition of Done, so treat "acceptance criteria" as the widely used
practice sitting alongside Scrum rather than as part of the framework.

**Key terms** per-item condition; pass/fail; agreed in advance; refinement; acceptance.

**Traps** Acceptance criteria are not the Definition of Done, and they do not replace it: an
item can satisfy every one of its own criteria and still be undone because the team-wide
quality bar was not met. They are also not test cases, though they normally drive them —
criteria state the condition, tests state how it is checked. And criteria agreed after
implementation has started have lost their function, which was to make "complete" decidable
before anyone argued about it.

**What the exam may test** Sorting a mixed list of conditions into per-item criteria and
team-wide Definition of Done entries — "the export includes VAT" against "all code is peer
reviewed and covered by automated tests" — and identifying who agrees each and when.

<a id="cmp-pm.project-management.acceptance-criteria"></a>
#### Not to be confused with: Acceptance criteria vs Definition of done
*compares: `pm.project-management.acceptance-criteria`, `pm.project-management.definition-of-done`*

| | Acceptance criteria | Definition of Done |
| --- | --- | --- |
| Scope | One work item; every item has its own | Every item the team produces, uniformly |
| Typical content | Functional conditions specific to that need | The quality bar: tested, reviewed, integrated, documented |
| Who agrees it | The requester or Product Owner with the team, per item | The Scrum Team — or the organisation's standard, which teams must follow as a minimum |
| How often it changes | Constantly; each new item brings new criteria | Rarely; when it changes it applies to everything |
| What failing it means | That item is not accepted | The work is not part of the Increment: it cannot be released or presented at the Sprint Review and returns to the Product Backlog |
| Status in Scrum | A common practice layered on top, not defined by the Scrum Guide | A commitment of the Increment, defined by the Scrum Guide |

The separating axis is scope: acceptance criteria answer "is *this* item what was asked for?",
the Definition of Done answers "is *any* item finished to the standard this team ships at?"

<a id="c-pm.project-management.definition-of-done"></a>
### Definition of done
*id: `pm.project-management.definition-of-done` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: scrum-guide-2020*

**What it is** In the Scrum Guide's terms, a formal description of the state of the Increment
when it meets the quality measures required for the product — and one of the three artefact
commitments, the one attached to the Increment. The moment a Product Backlog item meets the
Definition of Done, an Increment is born.

**Why it matters** It is the mechanism that makes "done" mean the same thing to everyone,
which is why it is a commitment and not a checklist a team may quietly relax under schedule
pressure. Exam scenarios usually reach it through the consequence: what happens to work that
is functionally finished but has not met the standard.

**How it works** Work that does not meet the Definition of Done cannot be released and cannot
even be presented at the Sprint Review; it returns to the Product Backlog for future
consideration. If the organisation has a Definition of Done as a standard, all Scrum Teams
must follow it as a minimum; if it does not, the Scrum Team must create one appropriate for the
product. Where several Scrum Teams work on one product they must mutually define and comply
with the same Definition of Done, and the Developers are required to conform to it.

**Key terms** commitment; Increment; quality measures; organisational minimum; conformance.

**Traps** The Definition of Done is not a list of the features an item must have — that is what
acceptance criteria are for — and it is not per story, per Sprint, or per developer. It is also
not something the Product Owner can waive to get an item into the Review: the Guide's rule is
that undone work returns to the Product Backlog. And a team-level Definition of Done cannot be
weaker than an organisational standard where one exists; it can only be stricter.

**What the exam may test** Naming the consequence of failing it (not releasable, not presented
at the Sprint Review, returned to the Product Backlog) and distinguishing its team-wide scope
from the per-item scope of acceptance criteria.

*Not to be confused with [acceptance criteria](project-management.md#cmp-pm.project-management.acceptance-criteria).*

<a id="c-pm.project-management.minimum-viable-product"></a>
### Minimum viable product
*id: `pm.project-management.minimum-viable-product` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: agile-alliance-glossary-mvp*

**What it is** The smallest release that delivers real value to real users and, in doing so,
produces learning about whether the wider idea is worth continuing. Both halves matter: it has
to be genuinely usable, and it has to answer a question the team could not answer by discussing
it.

**Why it matters** The word "minimum" is the trap. What an MVP minimises is scope — how many
things it does — not quality, which is why an MVP built to a lower standard than the team's
usual bar is not an MVP but a defect-laden release. Exam options that describe cutting testing
or documentation to ship sooner are describing something else.

**How it works** In common practice the team picks the narrowest slice that a real user can
get value from, ships it, and treats the resulting usage as evidence for what to build next.
That distinguishes it from a prototype or proof of concept, which is typically built to answer
a technical question, shown to a limited audience, and then discarded rather than operated. An
MVP is a release; a prototype usually is not.

**Key terms** smallest valuable release; validated learning; scope minimised, not quality;
prototype; proof of concept.

#### Scenario

A team is asked to build a self-service password reset portal. The refined story reads as a
role wanting a capability so that they stop waiting on the service desk — the "so that" clause
is what lets the team later propose an existing identity provider's flow instead of writing
one. Its acceptance criteria are specific to it: reset links expire after fifteen minutes,
failed attempts are logged. The Definition of Done is not specific to it at all — peer
reviewed, automated tests passing, runbook updated — and applies to the next twelve stories
too. On review day the feature works but the runbook was never written, so the Definition of
Done is not met: it cannot be presented at the Sprint Review and returns to the Product
Backlog. The first release covers staff accounts only: that is the MVP, minimal in scope, not
in quality, and it exists to test whether self-service actually cuts service-desk volume.

#### Knowledge check

1. What is the one-sentence difference between acceptance criteria and the Definition of Done?
   Acceptance criteria are the conditions for one item; the Definition of Done is the
   team-wide quality standard every item must meet.
2. A story satisfies all of its own acceptance criteria but the automated tests required by
   the team's standard were never written. What happens to it in Scrum?
   It is not part of the Increment: it cannot be released or presented at the Sprint Review,
   and it returns to the Product Backlog for future consideration.
3. Which clause of a user story is most often missing, and what is lost with it?
   The "so that" benefit clause. Without it the team cannot judge whether a different, cheaper
   implementation would satisfy the need equally well.
4. What does an MVP minimise, and what does it not?
   It minimises scope. It does not minimise quality — the team's Definition of Done still
   applies.
5. Does Scrum require user stories?
   No. The Scrum Guide leaves the format of Product Backlog items open; user stories are a
   widely used convention layered on top.
6. What separates an MVP from a proof of concept?
   An MVP is released to real users to produce learning from real use; a proof of concept
   typically answers a technical question for a limited audience and is discarded.

<a id="s-project-management-planning"></a>
## Planning

<a id="c-pm.project-management.estimation-and-velocity"></a>
### Estimation and velocity
*id: `pm.project-management.estimation-and-velocity` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: scrum-guide-2020*

**What it is** Two linked practices. Estimation here means sizing work relatively — judging
one item against another rather than predicting hours — and velocity means the amount of work a
team actually completes per Sprint, averaged over recent Sprints and used to forecast how much
will fit in the next one. Velocity is an input to a forecast, not a measure of how hard a team
is working.

**Why it matters** Velocity misread as a productivity score is the examinable error, and it is
self-defeating in a way the exam likes: a team told to raise its velocity can do so by
inflating its estimates without delivering anything more, because velocity is denominated in
the team's own units. Those units are also not comparable between teams for the same reason.

**How it works** In Scrum the Developers who will do the work are responsible for sizing it;
the Product Owner may influence them by helping them understand and select trade-offs, but does
not set the sizes. The Scrum Guide frames Sprint forecasting on the Developers' knowledge of
their past performance, their upcoming capacity, and their Definition of Done — and it names
neither story points nor velocity, which are common conventions rather than framework elements.
It also cautions that forecasting practices such as burn-downs, burn-ups and cumulative flow
diagrams do not replace empiricism: only what has already happened supports forward-looking
decisions.

**Key terms** relative sizing; forecast; capacity; past performance; empiricism.

<a id="c-pm.project-management.work-breakdown-structure"></a>
### Work breakdown structure
*id: `pm.project-management.work-breakdown-structure` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: nasa-wbs-handbook-sp-2016-3404-rev1*

**What it is** A hierarchical decomposition of the project's deliverable into progressively
smaller pieces, ending in work packages small enough to estimate, assign, and track. It is
organised by what is being produced, not by when things happen and not by who reports to whom.

**Why it matters** The work breakdown structure is the artefact that turns a scope statement
into something estimable, so it sits upstream of both the schedule and the budget. A candidate
who thinks of it as an early draft of the schedule will pick the wrong answer when a question
asks which artefact shows dependencies or dates — because a work breakdown structure shows
neither.

**How it works** In the usual account the top node is the whole deliverable; each level below
decomposes its parent completely, so that the children together account for all of the parent
and nothing beyond it — commonly stated as the hundred percent rule. Decomposition stops at
the work package: the level at which a piece of work can be given an owner, an estimate, and a
completion test. Only afterwards are those packages sequenced into a schedule, which is where
durations, dependencies, and dates first appear.

**Key terms** decomposition; work package; hundred percent rule; deliverable-oriented;
scope baseline.

**Traps** A work breakdown structure has no time axis, no durations, and no dependency arrows
— everything that makes a schedule a schedule is absent from it by design. It is also not an
org chart of who does what, and it is not a flat task list: the hierarchy is the point, because
it is what lets a reader confirm nothing in scope was left out. Decomposing by phase or by
team rather than by deliverable is the common malformation.

**What the exam may test** Choosing the work breakdown structure as the artefact that answers
"what work is in scope and what are its parts", against a Gantt chart or network diagram for
"when does each task run and what must finish first", and recognising the work package as the
unit that gets estimated.

<a id="cmp-pm.project-management.work-breakdown-structure"></a>
#### Not to be confused with: Work breakdown structure vs Gantt chart
*compares: `pm.project-management.work-breakdown-structure`, `pm.project-management.gantt-chart`*

| | Work breakdown structure | Gantt chart |
| --- | --- | --- |
| What it shows | The deliverable decomposed hierarchically into work packages | Tasks drawn as bars against a time axis, with durations and dependencies |
| Time axis | None — it is a structure, not a timeline | Yes; it is the chart's defining feature |
| Question it answers | "What work is in scope, and what are its parts?" | "When does each task run, and what must finish before it?" |
| Shows dependencies | No | Yes |
| Where it sits in the sequence | Before estimating and scheduling; its work packages are the units that get estimated | After decomposition and estimation, as the schedule's presentation |

The separating axis is time: the work breakdown structure decomposes scope and contains no
dates at all, while the Gantt chart schedules that same work along a timeline.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.project-management.gantt-chart` | Gantt chart | A bar chart of tasks plotted against a time axis, showing each task's duration and, as the chart is typically drawn today, its dependencies, associated with plan-driven scheduling. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* It is typically confused with the work breakdown structure: the Gantt chart is a schedule view with time as its defining axis, while the work breakdown structure decomposes the deliverable and has no time axis at all. [Not to be confused with work breakdown structure](project-management.md#cmp-pm.project-management.work-breakdown-structure). |
| `pm.project-management.critical-path` | Critical path | The longest chain of dependent tasks through a schedule; its length sets the earliest possible finish, so any delay on it delays the whole project. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* "Critical" is generally taken to mean longest-duration and zero-float, not most important or most difficult: shortening a task that is not on the critical path typically buys no time at all, which is the discrimination a question is usually after. |

#### Scenario

A migration project's plan is challenged in review. The team presents a hierarchy — the
migrated estate at the top, decomposed into base image, pilot batch, bulk batches, and
decommissioning, each broken down until every leaf can be given an owner and an estimate. That
is the work breakdown structure, and the reviewer's question "which of these can slip without
moving the end date?" cannot be answered from it, because it holds no dates and no dependencies.
The answer comes from the schedule built on top: base image to pilot to bulk batch one is the
longest dependent chain, so it is the critical path, and speeding up decommissioning — off that
chain — would buy nothing. The same team forecasts each Sprint from what it actually completed
recently, which is useful to them and meaningless against the neighbouring team, whose units
are its own.

#### Knowledge check

1. Which artefact shows dependencies and dates, and which shows the decomposition of scope?
   The Gantt chart (or a network diagram) shows dependencies and dates; the work breakdown
   structure shows the decomposition and has no time axis.
2. A task on the plan is shortened by three days. When does that not move the finish date?
   When the task is not on the critical path — only the longest chain of dependent tasks
   determines the earliest possible finish.
3. Why is velocity not a productivity measure?
   It is denominated in the team's own relative units, so it can be inflated by estimating
   larger without delivering more, and it is not comparable between teams.
4. In Scrum, who is responsible for sizing Product Backlog items?
   The Developers who will do the work; the Product Owner may help them understand trade-offs
   but does not set the sizes.
5. What does the hundred percent rule require of a work breakdown structure?
   That each level's children account for all of their parent's scope and nothing outside it,
   so nothing in scope is missing and nothing extra is added.

<a id="s-project-management-control"></a>
## Control

<a id="c-pm.project-management.risk-management"></a>
### Risk management
*id: `pm.project-management.risk-management` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: nist-sp-800-30r1*

**What it is** A continuing cycle of four distinct activities: identifying risks, assessing
them, planning responses, and monitoring both the risks and the responses. The activities are
routinely conflated in exam options, and one boundary carries most of the marks — assessment
scores a risk's likelihood and impact so that risks can be ranked; response decides what to
actually do about the ranked ones. Assessment produces a priority order, never an action.

**Why it matters** A risk is an uncertain future event; an issue is something that has already
happened. That distinction decides where a described situation belongs: an unresolved
uncertainty goes in the risk register with a likelihood and an impact, while "the vendor
missed the delivery date last week" is an issue and is tracked and escalated, not assessed for
probability.

**How it works** In common practice risks are recorded in a risk register with an owner, a
likelihood, an impact, and a planned response, and reviewed on a cadence rather than once at
kickoff. Responses are usually grouped into a small set of options: avoid the risk by changing
the plan so it cannot occur, reduce or mitigate its likelihood or impact, transfer it to
another party (insurance, a contract clause, a managed service), or accept it — typically with
a contingency reserve set aside if it materialises.

**Key terms** likelihood; impact; risk register; risk owner; avoid, mitigate, transfer,
accept; contingency; issue.

<a id="c-pm.project-management.scope-creep"></a>
### Scope creep
*id: `pm.project-management.scope-creep` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Growth of scope that happens without a matching adjustment to time, cost, or
the baseline — uncontrolled growth, not growth as such. It is usually described as the most
common way projects fail, and it rarely arrives as one big decision: it accumulates from
individually reasonable additions that nobody priced.

**Why it matters** The examinable subtlety is that scope changing is not the failure. A
customer asking for more is normal and expected; a project accepting more without assessing,
approving, and re-baselining is what makes it creep. Options describing an approved,
re-planned scope increase are describing change control working correctly, and are the wrong
answer to a question about creep.

**How it works** The usual mechanism is informal agreement: a request made in a corridor or a
comment on a ticket is absorbed by whoever heard it, no impact assessment happens, and the
baseline still shows the original scope. Because the schedule and budget were never adjusted,
the extra work is paid for out of the only leg still free to move — quality, or the team's
slack, until neither is left. Gold-plating, where the team adds refinements nobody requested,
produces the same result with no external requester at all.

**Key terms** uncontrolled growth; baseline; impact assessment; gold-plating; informal
agreement.

**Traps** Not every scope change is scope creep, and this is the discrimination the exam
tests: the defining property is the absence of control, not the presence of change. Nor is
scope creep the same as a bad estimate — an underestimated task is the same scope costing more
than expected, while creep is more scope than was agreed. And a project with a formal change
process can still suffer creep if the process is routinely bypassed for "small" items.

**What the exam may test** Distinguishing an approved change from creep in a described
situation, and identifying the missing step — impact assessment, approval, or baseline update —
that turns one into the other.

*Not to be confused with [change control](project-management.md#cmp-pm.project-management.change-control).*

<a id="c-pm.project-management.change-control"></a>
### Change control
*id: `pm.project-management.change-control` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** The defined process by which a proposed change to scope is raised, assessed for
its impact, decided by a named authority, and — if approved — reflected in an updated baseline
that everyone then works to. It is a decision procedure, not a barrier.

**Why it matters** Change control is routinely mistaken for a mechanism for saying no. Its
actual purpose is to make the trade-off explicit: to force the question "if we add this, which
of time, cost, or scope elsewhere moves?" to be answered by someone with the authority to
answer it, rather than absorbed silently by the team. An approved change that moves the date
is a success of the process, not a failure.

**How it works** In most implementations of this practice a change request is written down
with what is being asked and why; someone assesses its impact on scope, schedule, cost, quality
and risk; a defined authority — a sponsor, or a change control board on larger efforts — approves
or rejects it; and on approval the scope, schedule and budget baselines are updated together
and the decision is communicated to the stakeholders who need it. Rejected requests are
recorded too, so the same request does not reappear informally.

**Key terms** change request; impact assessment; approval authority; change control board;
re-baselining.

**Traps** Change control is not scope freeze, and a process that only ever rejects is being
used wrongly. It is also not the same as version control or release change management, which
govern changes to code and to running systems rather than to the project's agreed scope — a
question mentioning a change advisory board in an operations context is asking about a
different practice with a similar name. And approval alone is not enough: without the baseline
update, an approved change behaves exactly like creep, because the plan still shows the old
scope.

**What the exam may test** Naming the step that separates a controlled change from creep
(assessment and approval followed by a baseline update), and recognising that the correct
response to a mid-project request is to route it through the process rather than to refuse it
or to absorb it.

<a id="cmp-pm.project-management.change-control"></a>
#### Not to be confused with: Change control vs Scope creep
*compares: `pm.project-management.change-control`, `pm.project-management.scope-creep`*

| | Change control | Scope creep |
| --- | --- | --- |
| What it is | A defined process for proposing, assessing and deciding changes to scope | The failure mode in which scope grows without that process |
| Is the baseline updated | Yes — approval updates scope, schedule and cost together | No; that omission is what makes it creep |
| Who decides | A named authority: the sponsor, or a change control board | Effectively nobody; it accumulates from informal agreements |
| Effect on the triple constraint | The trade-off is made explicit and renegotiated | The trade-off is absorbed silently, usually by quality or by the schedule |
| Attitude to change | Change is expected and handled | Change is unmanaged, not unwelcome |
| Typical symptom | A dated decision log and a revised plan | A team quietly working longer hours against an unchanged plan |

The separating axis is not whether scope changed — it changed in both — but whether the change
was assessed, decided by someone with authority, and written back into the baseline.

<a id="c-pm.project-management.issue-tracking"></a>
### Issue tracking
*id: `pm.project-management.issue-tracking` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Recording work items, defects and problems in a shared system, each with an
identifier, an owner and a state, so that the status of anything is visible by looking rather
than by asking. The visibility is the deliverable — a tracker nobody updates provides none of
the benefit and all of the overhead.

**Why it matters** The vocabulary trips candidates twice. An issue is something that has
already occurred and needs resolving, which is what separates it from a risk, an event that
may occur and is assessed for likelihood and impact. And a tracker is not a plan: a backlog of
tickets says what exists and what state each is in, but not when anything will happen or what
depends on what.

**How it works** In common practice each item carries a unique identifier, a description, an
owner, a priority and a workflow state, and moves through that workflow as work proceeds. The
resulting record does three jobs beyond day-to-day coordination: it is the audit trail for who
decided what and when, it is the raw material for lessons learned at closure, and it is the
place escalation is recorded rather than being remembered as a conversation.

**Key terms** ticket; state and workflow; owner; audit trail; issue versus risk.

<a id="c-pm.project-management.project-budget-and-resource-management"></a>
### Project budget and resource management
*id: `pm.project-management.project-budget-and-resource-management` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** The cost leg of the triple constraint made concrete: estimating what the work
will cost, baselining that as a budget, then tracking actual spend and actual effort against
the plan and forecasting the finish from the difference. "Resource" here is broader than
money — it is people with the right skills available at the right time, plus equipment,
licences and environments.

**Why it matters** The examinable reasoning is about what money can and cannot buy back. Cost
and schedule are separate measurements — a project can be under budget and late at once — and
adding people to work that is already behind typically slows it in the short term, because
existing staff spend their time bringing newcomers up to speed. "Hire more engineers" is
therefore usually the distractor, not the answer.

**How it works** In common practice the budget is baselined alongside the schedule, actuals
are collected on a regular cadence, and the gap between planned and actual is expressed as a
variance and used to forecast the total at completion. A contingency reserve is commonly held
against identified risks, distinct from ordinary budget, so that spending it is a visible
decision rather than an overrun. Resource management runs in parallel: availability and skill
mix constrain the schedule just as hard as money does, and a named specialist available only in
August is a scheduling constraint whatever the budget says.

**Key terms** baseline; actuals; variance; forecast at completion; contingency reserve;
resource availability.

<a id="c-pm.project-management.communication-plan"></a>
### Communication plan
*id: `pm.project-management.communication-plan` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A decision made in advance about who needs what information, in how much
detail, how often, through which channel, and produced by whom. It is a plan, not a tool and
not a meeting: naming a weekly call satisfies none of those questions on its own.

**Why it matters** The plan is where stakeholder analysis becomes action, so the two are tested
together: having identified that an auditor has high influence and low day-to-day interest, the
communication plan is what records that she receives a summary at phase boundaries rather than
the daily detail the delivery team gets. Communication failures are commonly described as the
largest single source of project trouble, which is why the plan is made deliberately rather
than left to whoever remembers to send an email.

**How it works** In most descriptions of the practice each stakeholder group is mapped to a
content level, a frequency, and a channel, with an owner for producing it — the sponsor might
receive a monthly summary plus immediate notification of anything breaching a threshold, while
the delivery team works from a daily coordination event. Escalation paths belong here too: who
is told, in what timeframe, when something exceeds the project's tolerance.

**Key terms** audience; content level; frequency; channel; escalation path.

<a id="c-pm.project-management.project-closure-and-lessons-learned"></a>
### Project closure and lessons learned
*id: `pm.project-management.project-closure-and-lessons-learned` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** The formal ending of a project: confirming that the deliverables were accepted
against the criteria agreed for them, handing the result over to whoever will operate it,
releasing the team and closing contracts and budget lines, archiving the documentation, and
recording what should be done differently next time somewhere a future project will actually
find it.

**Why it matters** Closure is a process, not a celebration, and the examinable consequence is
that it happens to cancelled projects too — arguably it matters more there, because a cancelled
project's lessons are the only thing it produced. A project whose last deliverable is finished
but which was never accepted or handed over is not closed; acceptance and handover are what end
it.

**How it works** In common practice acceptance is confirmed against the same criteria the work
was agreed on, so closure and the requirements written at the start bracket the project.
Handover moves the result from the temporary project into permanent operations, which is where
the project-versus-operations distinction becomes concrete. Lessons learned are typically
gathered from the people who did the work and from the issue record, then written into a
repository the organisation shares — the recording is the easy part and the retrieval is where
the practice usually fails, since a lesson nobody can find has produced nothing.

**Key terms** acceptance; handover to operations; resource release; archive; lessons
repository.

**Traps** Closure is not the same as the last piece of work being finished, and it is not
optional on cancellation. Lessons learned are also not the same as a Sprint Retrospective:
the retrospective repeats every Sprint and improves the same team while the work is still going
on, whereas closure happens once and directs its learning outward, to other projects and to the
organisation. And handover is not merely deployment — the operating team has to be able to run
the thing, which is why the runbook and the support arrangement are closure items rather than
niceties.

**What the exam may test** Recognising that a cancelled project is still formally closed,
naming acceptance and handover as what actually ends a project, and separating the
once-per-project lessons-learned exercise from the once-per-Sprint retrospective.

<a id="cmp-pm.project-management.project-closure-and-lessons-learned"></a>
#### Not to be confused with: Project closure and lessons learned vs Scrum ceremonies
*compares: `pm.project-management.project-closure-and-lessons-learned`, `pm.project-management.scrum-ceremonies`*

| | Project closure and lessons learned | Scrum ceremonies |
| --- | --- | --- |
| How often | Once, at the end of the project — including a cancelled one | Every Sprint, throughout the work |
| What is inspected | The whole project: acceptance, handover, and what to do differently next time | The product at the Sprint Review, the team's process at the Sprint Retrospective |
| Who acts on the output | Future projects and the wider organisation | The same team, typically in the very next Sprint |
| Timeboxed | Not conventionally | Yes — for a one-month Sprint, at most three hours for the Retrospective and four for the Review |
| What it ends | The project itself, together with its contracts and its team | The Sprint Retrospective concludes the Sprint, but the next Sprint starts immediately |

The separating axis is who the learning is for and how often it is collected: the retrospective
improves one team repeatedly while the work continues, while closure ends the work once and
sends its learning outward.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.project-management.raci` | RACI | A matrix assigning, for every activity, who is Responsible for doing it, Accountable for its outcome, Consulted before it, and Informed after it. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* The tested points are that exactly one person is conventionally Accountable per activity while several may be Responsible, and that Consulted is two-way input gathered before a decision whereas Informed is one-way notification after it. |

#### Scenario

Before a migration's cutover the vendor warns a firmware batch may arrive late. That is a risk,
not an issue: it is assessed for likelihood and impact, ranked, and answered — mitigate by
starting with batches needing no new firmware, accept the residual against a contingency
reserve. A week later the batch genuinely fails to arrive: now an issue, raised in the tracker
with an owner and escalated along the path the communication plan already defined. The sponsor
then asks to add twenty servers while the date holds. Routed through change control it is
assessed, approved with a two-week extension, and the baseline updated; absorbed in a corridor
instead, it would have been scope creep — the difference is the assessment and the
re-baselining, not the answer given. At closure, acceptance is confirmed against the criteria
agreed at the start, the fleet and runbook go to operations, and the firmware lesson is
recorded where the next migration looks.

#### Knowledge check

1. What separates risk assessment from risk response?
   Assessment scores likelihood and impact to rank risks; response decides what to do about
   them — avoid, mitigate, transfer, or accept. Assessment alone produces a priority order,
   never an action.
2. A scope change is requested, assessed, approved by the sponsor, and the schedule and budget
   baselines are updated. Is that scope creep?
   No — that is change control working. Creep is growth without assessment, approval, or a
   baseline update.
3. What is the one-sentence difference between a risk and an issue?
   A risk is an uncertain future event carrying a likelihood and an impact; an issue has
   already happened and needs resolving and escalating.
4. In a RACI matrix, how many people are Accountable for an activity, and how does Consulted
   differ from Informed?
   Conventionally exactly one is Accountable, though several may be Responsible; Consulted is
   two-way input taken before the decision, Informed is one-way notification after it.
5. A project is cancelled halfway through. Does it still get closed?
   Yes — closure is a process, not a reward: contracts and budget lines are closed, resources
   released, documentation archived, and the lessons recorded.
6. Why is "add more engineers" usually the wrong answer to a project running late?
   Existing staff must spend their time bringing newcomers up to speed, so the short-term
   effect is typically slower delivery, not faster; cost and schedule are also separate
   measurements and buying one does not automatically buy the other.
