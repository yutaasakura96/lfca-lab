<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — IT Project Management Fundamentals :: Project Management

37 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A story's own acceptance criteria are all met, but the team's automated test suite, required by their standing quality bar, was never run against it. What happens to the story, and which of the two commitments governs the outcome?

- **A.** It is not part of the Increment and returns to the Product Backlog — the Definition of Done, the team-wide bar every item must meet, governs here, not the story's own criteria.
- **B.** It is accepted, since meeting its own acceptance criteria is what the Scrum Guide itself defines as done.
- **C.** It is accepted, because acceptance criteria and the Definition of Done are simply two names for the same check, applied at whatever level of detail the team happens to prefer from one item to the next.
- **D.** It is accepted at the Sprint Review, where the Definition of Done can be applied retroactively if needed.

**Answer: A.** Acceptance criteria are per-item conditions agreed before work starts; the Definition of Done is the team-wide quality bar every item must meet uniformly. An item can satisfy every one of its own criteria and still fail the Definition of Done, and the Guide's answer is that undone work is not part of the Increment — it returns to the Product Backlog.

- B is wrong: This inverts which commitment the Scrum Guide actually defines — it defines the Definition of Done, not acceptance criteria, as a Scrum element.
- C is wrong: The two differ in scope — one item's criteria versus every item's uniform bar — and treating them as synonyms is the exact confusion this comparison tests.
- D is wrong: Undone work cannot even be presented at the Sprint Review; there is no retroactive application of the Definition of Done there.

### 2.

A Product Owner wants to change one story's acceptance criteria after the developers have already started implementing it. What has this change lost?

- **A.** Nothing — acceptance criteria may be revised by the Product Owner at any point right up to the Sprint Review, since they belong to the Product Owner and can be reopened whenever new information arrives.
- **B.** Nothing — only the Definition of Done needs to be fixed in advance, not per-item criteria.
- **C.** Its status as a formal change, since acceptance criteria are never routed through change control.
- **D.** Its function, since criteria agreed before work starts exist to make 'complete' decidable in advance, and changing them mid-implementation reopens what should already be settled.

**Answer: D.** Acceptance criteria are meant to be agreed before work starts and stated as pass/fail conditions, precisely so that whether an item is complete does not have to be argued about afterward. Changing them once implementation is underway removes the property that made them useful in the first place.

- A is wrong: Revising criteria whenever convenient defeats their purpose, which is to fix in advance what 'complete' means for that item.
- B is wrong: Both are meant to be agreed before the relevant work begins; the Definition of Done being team-wide doesn't make per-item criteria any less settled in advance.
- C is wrong: This item is about criteria drafted for one story, not about routing a scope change through the project's formal change process.

### 3.

Team A ships a small working increment every two weeks and revises its plan as customers respond. Team B produces detailed documentation at every phase gate and finishes one large release after nine months. Which Agile Manifesto value does Team A's practice most directly express, and how does that differ from a waterfall judgement about the same scenario?

- **A.** Following a plan over responding to change, since Team A still plans out each two-week cycle in advance.
- **B.** No value at all, since agile teams are defined by having no plan and no fixed structure, which is why a team practising it is expected to decide everything moment to moment with nothing written down in advance, unlike a team following a documented methodology.
- **C.** Responding to change over following a plan — the Manifesto ranks it above a fixed plan without abolishing planning, whereas a waterfall judgement would instead ask only whether each of Team B's phases was signed off before the next began.
- **D.** The event calendar of daily standups and sprint reviews, since that is what the Manifesto actually specifies.

**Answer: C.** Agile's fourth value statement ranks responding to change above following a fixed plan, without abolishing planning; Team A revises what it does as it learns. Waterfall instead evaluates whether each phase completed and was signed off before the next began, a sequencing judgement, not a values one — conflating the two levels is the common mistake.

- A is wrong: Team A plans each cycle, but the point of the practice is that the plan is revised as more is learned, not followed at the expense of change.
- B is wrong: The Manifesto states the lower-ranked item still has value; 'no plan at all' is the misreading it explicitly warns against.
- D is wrong: Standups and sprint reviews belong to Scrum, one framework beneath agile's values — the Manifesto itself specifies no events.

### 4.

A manager says: 'We hold a daily standup and a two-week sprint, so we're agile.' Which distinction does this statement collapse?

- **A.** It collapses the Sprint Review with the Sprint Retrospective, since both happen within the same two-week cycle and are often scheduled back to back on the calendar.
- **B.** Nothing — attending the prescribed ceremonies is sufficient to be agile by definition.
- **C.** The value layer (agile, the Manifesto's principles) into the framework layer (Scrum, one particular way of operationalising them).
- **D.** Kanban's continuous flow with Scrum's fixed-length iterations.

**Answer: C.** Agile is a set of values and principles; Scrum is one framework that operationalises them, with its own accountabilities, events and artefacts. Substituting 'we run Scrum's ceremonies' for 'we hold agile's values' is the examinable move — a team can hold every event and still violate the principles beneath them.

- A is wrong: The statement doesn't mention the Review or Retrospective specifically, so that particular pair isn't what's being confused here.
- B is wrong: The Manifesto is a statement of values; attending meetings is a mechanism, and mechanism without the underlying preference doesn't establish it.
- D is wrong: The statement describes Scrum's iteration, not Kanban's flow, so this pairing isn't the confusion in play.

### 5.

A team's change control process has rejected every request submitted to it for the past six months. A stakeholder complains this proves the process is working. What is the flaw in that reasoning, and how would the same six months look if scope creep, not change control, were actually happening?

- **A.** A process that only ever rejects is being used as a barrier, not a decision procedure; under creep instead, there would be no rejected requests at all — informal additions would simply accumulate outside the process.
- **B.** There's no flaw — a change control process exists specifically to say no to requests.
- **C.** The flaw is that six months is too short a period to judge whether change control is functioning.
- **D.** The flaw is that rejected requests should still have moved the project's budget baseline even when refused, so the sponsor can see the cumulative cost of every request ever considered, approved or not, across the whole project.

**Answer: A.** Change control is a decision procedure, not a mechanism for saying no; its purpose is to force an explicit answer to what else must give if scope is added, including approving worthwhile changes. An all-rejection record suggests the process is being misused as a blanket refusal. Scope creep, by contrast, leaves no rejected requests behind at all — it accumulates from additions that never went through the process to be rejected or approved.

- B is wrong: The purpose is to force the trade-off question to be answered explicitly, which includes approving changes that are genuinely worth their cost, not just refusing all of them.
- C is wrong: The stated period isn't the issue; an all-rejection record is suspicious regardless of how long it has run.
- D is wrong: Rejected requests are recorded so the same request doesn't reappear informally, but a rejection specifically does not update the baseline; only an approval does.

### 6.

A change request is assessed and approved by the project sponsor, but nobody updates the schedule or budget baseline afterward. What is the practical effect?

- **A.** None — approval by the sponsor is sufficient on its own to make the change fully controlled.
- **B.** It only becomes a problem at project closure, when the missing update is caught during acceptance review, since that is the point at which the whole plan is finally checked against reality.
- **C.** Because the plan still shows the old scope, the approved change behaves exactly like creep, and the extra work is absorbed silently rather than tracked.
- **D.** It only becomes a problem if the communication plan fails to notify the delivery team of the approval.

**Answer: C.** Approval is only part of a controlled change; on approval, the scope, schedule and cost baselines are meant to be updated together and the decision communicated. Skip the baseline update and an approved, assessed change produces exactly the same symptom as creep — a plan that still shows the original scope while the team quietly absorbs more.

- A is wrong: Approval alone doesn't complete the process; the Guide's account of change control requires the baseline to be updated as well, not just a decision recorded.
- B is wrong: The mismatch causes trouble immediately, in every status report and schedule check between now and closure, not only when acceptance is reviewed.
- D is wrong: Notifying the delivery team doesn't substitute for the plan itself reflecting the new scope; the baseline, not just awareness, is what's missing.

### 7.

An auditor has high influence over a project's release but low day-to-day interest in its progress. What should the communication plan record for her?

- **A.** A summary delivered at phase boundaries, plus immediate notification if anything breaches a defined threshold — matched to her influence and interest, not to the delivery team's daily cadence.
- **B.** Inclusion in the delivery team's daily coordination event, since high influence means she needs the same level of detail as the team, regardless of how much day-to-day interest she actually has.
- **C.** Nothing, since her low day-to-day interest means she does not need to be tracked as a stakeholder at all.
- **D.** Read access to the issue tracker in place of any scheduled communication.

**Answer: A.** A communication plan turns stakeholder analysis into action: each group is mapped to a content level, a frequency and a channel matched to how much influence and interest they have. High influence and low day-to-day interest is the textbook case for periodic summaries at phase boundaries plus immediate notice of anything crossing a defined threshold, not daily detail or unscheduled browsing.

- B is wrong: Daily detail suits the delivery team's own coordination need, not a reviewer whose interest is low day to day despite her high influence over release.
- C is wrong: Influence alone is enough to make someone a stakeholder; low day-to-day interest changes what she's sent, not whether she's tracked.
- D is wrong: Read access to a ticket system isn't a decided content level, frequency or channel — it substitutes browsing for the deliberate plan the practice calls for.

### 8.

A three-day task not on the critical path is shortened to one day. What happens to the project's finish date?

- **A.** It moves the finish date earlier, since any task shortened anywhere in the schedule speeds up the whole project.
- **B.** Nothing, given that only the longest chain of dependent tasks determines the earliest possible finish, and this task isn't part of it.
- **C.** It moves the finish date, because shortening any bar on a Gantt chart shifts every bar that comes after it.
- **D.** It moves the finish date, since shortening a task also shrinks its parent grouping in the work breakdown structure, and a smaller parent should logically finish sooner than before.

**Answer: B.** The critical path is the longest chain of dependent tasks through the schedule, and its length sets the earliest possible finish. 'Critical' is a statement about duration and float, not importance or difficulty — shortening a task that isn't on that chain typically buys no time, which is the discrimination this question shape is built to test.

- A is wrong: Only tasks on the critical path affect the finish date; shortening others usually buys no time at all.
- C is wrong: A Gantt chart is a display of the schedule, not the mechanism that determines the finish date — that mechanism is which chain of dependencies is longest.
- D is wrong: The work breakdown structure has no time axis and no bearing on the schedule's finish date at all.

### 9.

An organisation has a company-wide Definition of Done. One Scrum Team, under schedule pressure, proposes dropping the peer-review requirement for its own product only. Is that allowed?

- **A.** Yes, since each Scrum Team owns its own Definition of Done and may adjust it whenever circumstances demand, provided the change is agreed within the team before the next Sprint begins.
- **B.** Yes, provided the dropped requirement is logged as an accepted risk.
- **C.** No. A team-level Definition of Done can only be stricter than an organisational standard where one exists, never weaker.
- **D.** Only if the change is approved through the project's formal change control process.

**Answer: C.** If the organisation has a Definition of Done as a standard, every Scrum Team must follow it as a minimum, and a team's own definition can only be stricter, never weaker. Dropping a requirement under schedule pressure is exactly the quiet relaxation the commitment exists to prevent.

- A is wrong: Team ownership of the Definition of Done applies when no organisational standard exists; here one does, and it sets a floor, not a suggestion.
- B is wrong: Logging the gap as a risk doesn't change the rule that an organisational minimum cannot be relaxed by a single team.
- D is wrong: The Definition of Done is a Scrum commitment governed by the Guide's own rule, not a project scope item that change control approves or rejects.

### 10.

A feature works and demonstrates cleanly, but the runbook required by the Definition of Done was never written. What happens at the Sprint Review?

- **A.** It is presented with a note that documentation is pending, since a working demo satisfies the Definition of Done on its own, and paperwork can reasonably follow later.
- **B.** It cannot be presented at the Sprint Review, because work that hasn't met the Definition of Done isn't part of the Increment and returns to the Product Backlog.
- **C.** It is presented, and the missing runbook becomes an agenda item for the Sprint Retrospective instead.
- **D.** It is presented, since the feature's own acceptance criteria were met even though the Definition of Done was not.

**Answer: B.** The Definition of Done is a commitment attached to the Increment, and work that doesn't meet it is not part of that Increment — it cannot be released or even presented at the Sprint Review, and returns to the Product Backlog. A working demo is not the same as meeting every element of the standard, including documentation the team has committed to.

- A is wrong: Working software alone doesn't satisfy the Definition of Done when it explicitly includes documentation such as the runbook.
- C is wrong: Whether the item can be presented is settled before the Review happens; the Retrospective addresses process, not this item's admission to the Review.
- D is wrong: Meeting a story's own criteria doesn't substitute for the team-wide Definition of Done, which is the standard actually being missed here.

### 11.

A schedule line reads 'Runbook accepted — 2 weeks'. A reviewer flags it. What is wrong with calling that line a milestone, and how does the objection differ from a question about the triple constraint?

- **A.** The line is fine as a milestone; the real issue is that adding two weeks to it silently moved the schedule leg of the triple constraint without anyone formally agreeing to that trade-off in advance, which is a wholly separate kind of oversight from how the line happened to be labelled.
- **B.** Milestones cannot appear on a schedule at all — only bars with durations, as on a Gantt chart, are legitimate schedule entries.
- **C.** A milestone conventionally carries zero duration, so a two-week span is a task or phase mislabelled — the triple constraint, by contrast, is about trading scope, time and cost against each other, not sorting schedule items by type.
- **D.** The label is correct, since 'accepted' items are always logged as milestones however long the acceptance activity takes.

**Answer: C.** A milestone marks an instant, conventionally with no duration, effort or cost of its own; a schedule line carrying a duration is a task or a phase, however it is labelled. That is a different kind of error from a triple-constraint question, which asks what trades off against what when scope, time or cost changes — sorting deliverables and milestones by type is a categorisation question, not a trade-off question.

- A is wrong: This treats the entry as already correct and reframes the objection as a scheduling trade-off, which sidesteps the actual defect in the label.
- B is wrong: Milestones do appear on schedules — as zero-duration markers — so absence from the schedule isn't the objection here.
- D is wrong: Duration is exactly what disqualifies the entry as a milestone; the acceptance label alone does not exempt it.

### 12.

A migration project's status report lists: 'signed-off design', 'pilot batch accepted', 'base image', and 'bulk migration complete'. Which pair are deliverables rather than milestones?

- **A.** Signed-off design and bulk migration complete, because both appear as work packages in the work breakdown structure.
- **B.** Pilot batch accepted and bulk migration complete, since both are confirmed during project closure.
- **C.** All four, since anything worth putting in a status report counts as a deliverable.
- **D.** Signed-off design and base image, both of them tangible artefacts the project produced and handed over.

**Answer: D.** A deliverable is a tangible output — a document, an image, a migrated fleet. A milestone is a marked point signifying something is now true, typically carrying no duration of its own. 'Signed-off design' and 'base image' are things that exist; 'pilot batch accepted' and 'bulk migration complete' are checkpoints, not artefacts.

- A is wrong: Work packages are units of the decomposition, not the test for whether an item is a deliverable; 'bulk migration complete' reads as an event, not an artefact.
- B is wrong: Both of those read as checkpoints — 'accepted' and 'complete' — not as artefacts that were produced, and closure confirms acceptance of deliverables rather than defining what one is.
- C is wrong: Status-report visibility doesn't distinguish the two; 'pilot batch accepted' and 'bulk migration complete' are events, not things produced.

### 13.

A manager tells a team to 'raise your velocity next Sprint.' Why is that instruction self-defeating in a way the exam likes to test?

- **A.** It isn't self-defeating — velocity is an objective measure of output, so raising it means the team genuinely produced more useful work than it did in any of its previous Sprints.
- **B.** It's self-defeating because velocity is set by the Product Owner, not by the Developers who do the estimating.
- **C.** Velocity is denominated in the team's own relative units, so it can be inflated by estimating the same work as larger without delivering any more of it.
- **D.** It's self-defeating because velocity can only be measured once a Sprint has been extended past its fixed length.

**Answer: C.** Velocity is the amount of work a team completes per Sprint, denominated in the team's own relative units and used to forecast, not to score productivity. A team told to raise it can do so by inflating estimates without delivering anything more, because nothing external calibrates the unit — and velocity figures aren't comparable between teams for the same reason.

- A is wrong: Velocity is a forecasting input calculated from past Sprints, not an objective productivity score, which is exactly why the instruction backfires.
- B is wrong: The Developers who do the work are responsible for sizing it; the Product Owner may help with trade-offs but doesn't set velocity.
- D is wrong: Velocity is calculated from completed work per Sprint at its normal fixed length; extending the Sprint isn't a precondition for measuring it.

### 14.

Which single feature distinguishes a Gantt chart from a work breakdown structure?

- **A.** The Gantt chart shows what work is in scope, while the work breakdown structure shows when it happens, since one lists tasks and the other arranges them on a calendar.
- **B.** Detail level — a Gantt chart is simply a more detailed version of the same hierarchy the work breakdown structure shows.
- **C.** The Gantt chart shows the critical path, while the work breakdown structure shows every possible path through the schedule.
- **D.** The time axis, since a Gantt chart plots tasks against dates and shows durations and dependencies, which the work breakdown structure has none of.

**Answer: D.** A Gantt chart is a bar chart of tasks against time, showing duration and, as usually drawn, dependencies — associated with plan-driven scheduling. A work breakdown structure decomposes the deliverable hierarchically and has no time axis at all; that absence is the entire basis of the comparison.

- A is wrong: This reverses the two — the work breakdown structure shows what is in scope, and the Gantt chart is what shows when things happen.
- B is wrong: The two aren't the same hierarchy at different resolutions; one has no time axis and the other is built around one.
- C is wrong: A work breakdown structure has no paths or dependencies to compare against; a Gantt chart can display the critical path, but that isn't the axis separating the two artefacts.

### 15.

A vendor missed a delivery date last week. Should that be logged as a risk or as an issue?

- **A.** An issue, as it has already happened and needs resolving and escalating, unlike a risk, which is an uncertain future event assessed for likelihood and impact.
- **B.** A risk, since the vendor might miss further deadlines going forward, and treating the pattern as an ongoing risk keeps the team focused on preventing a recurrence rather than dwelling on the past.
- **C.** A risk, because it should be scored for likelihood and impact before any action is taken.
- **D.** Neither — it should only be raised through the communication plan's escalation path.

**Answer: A.** Issue tracking records work and defects, each with an identifier, an owner and a state, so status is visible without asking. An issue is something that has already occurred and needs resolving; a risk is an uncertain future event assessed for likelihood and impact. A missed delivery date last week has already happened, so it belongs in the tracker as an issue.

- B is wrong: Concern about a future recurrence doesn't change what already happened; this specific event needs resolving now, which is what makes it an issue.
- C is wrong: There's nothing left to assess for likelihood; the event already occurred, and scoring likelihood and impact applies to risks, not to something that has happened.
- D is wrong: The communication plan governs who is told and when, not where the item itself is recorded; it belongs in the tracker regardless of who is escalated to.

### 16.

A support team puts a board with To Do, Doing and Done columns in front of its work and calls the practice Kanban. What is missing from that claim, and what would a Scrum team have instead of the missing piece?

- **A.** Explicit work-in-progress limits, the mechanism that actually defines Kanban; a Scrum team instead bounds work with a fixed-length Sprint and a Sprint Goal.
- **B.** A defined Product Owner role, since Kanban requires one of its own just as Scrum does.
- **C.** Nothing is missing — a board with columns is what Kanban means in practice, and the columns alone are what visualises the flow of work through each stage of the process for the whole team to see.
- **D.** A velocity figure, since both Kanban and Scrum teams are required to forecast from one.

**Answer: A.** Kanban's defining mechanism is the explicit work-in-progress limit per stage, which turns the board into a pull system. A board with columns and no limits constrains nothing. Scrum instead bounds a batch of work with the fixed-length Sprint and its Sprint Goal — the two frameworks limit different things: how much is in flight at once, versus how long a batch may run before inspection.

- B is wrong: Kanban defines no accountabilities of its own; existing roles continue, so a missing Product Owner isn't the gap here.
- C is wrong: A board with columns is not what makes the practice Kanban — the Kanban Guide explicitly distinguishes a Kanban board from practising Kanban, and the limits are the difference.
- D is wrong: Kanban's characteristic measures are lead time, delivery rate and WIP, not velocity, which is a Scrum-adjacent convention.

### 17.

A team takes unplanned production incidents all day and would break a Sprint Goal at the first outage. Which practice fits that pattern, and what should it track instead of a burndown chart?

- **A.** Scrum, run with very short one-day Sprints to absorb the unpredictability.
- **B.** Kanban, but it should still track a burndown chart since that is how all agile teams measure progress.
- **C.** Kanban, tracking the team's risk register instead of a burndown chart.
- **D.** Kanban, tracking lead time and delivery rate as its flow measures rather than a Sprint's burndown.

**Answer: D.** A fixed Sprint Goal breaks the moment an unplanned incident forces reprioritisation, which is why interrupt-driven work is the standard case for Kanban's continuous flow instead. Its characteristic measures follow from that flow view: lead time, the time an item takes end to end, and delivery rate, the count completed per unit of time, not a burndown, which is tied to a Sprint's timebox.

- A is wrong: Committing to even a one-day goal still breaks at the first unplanned incident; the fit is continuous flow, not a shorter timebox.
- B is wrong: A burndown is a Scrum-adjacent forecasting convention tied to a Sprint Goal; it doesn't fit a practice with no fixed iteration.
- C is wrong: A risk register tracks uncertain future events, not the flow of work already in progress — it isn't Kanban's characteristic measure.

### 18.

A team ships the first version of a feature with reduced test coverage and no documentation, in order to hit a deadline sooner. Is that an MVP?

- **A.** Yes, since 'minimum' means the smallest amount of engineering rigour needed to ship something at all, and rigour beyond that point is generally considered wasted effort on a first release.
- **B.** No — an MVP minimises scope, not quality; a release built to a lower standard than the team's usual bar is a defect-laden release, not a minimum viable product.
- **C.** Yes, provided the missing tests and documentation are added to a future Definition of Done.
- **D.** Only if the feature was originally requested through a properly written user story.

**Answer: B.** An MVP is the smallest release that delivers real value and produces learning about whether the wider idea is worth continuing — both halves matter, so it has to be genuinely usable. Cutting testing or documentation to ship sooner is not what 'minimum' refers to; it produces something else, built to a lower standard than the team's own bar.

- A is wrong: That reading of 'minimum' is the trap the exam sets — it minimises what the release does, not how carefully it was built.
- C is wrong: Deferring quality work to a future standard doesn't retroactively make a lower-quality release an MVP; the standard applies at the time of release.
- D is wrong: Whether the underlying need was captured in a well-formed user story is unrelated to whether a given release counts as minimum viable.

### 19.

A team describes its Sprint Backlog as 'the items we pulled into this Sprint.' What does that description leave out?

- **A.** Nothing — the Sprint Backlog is defined as exactly the set of Product Backlog items selected for the Sprint.
- **B.** The Sprint Goal, why the work matters, and the actionable plan for delivering the Increment, how it will get done — the selected items are only one of its three parts.
- **C.** The team's velocity figure, which should be recalculated and attached to every Sprint Backlog so that stakeholders can see how much capacity remains for the rest of the Sprint.
- **D.** The Definition of Done, which the description should have named explicitly.

**Answer: B.** The Sprint Backlog has three parts: the Sprint Goal (why), the selected Product Backlog items (what), and an actionable plan (how). Describing it as only the selected items drops the goal and the plan, leaving what would just be a filtered slice of the Product Backlog rather than a plan by and for the Developers.

- A is wrong: That description names only one of the Sprint Backlog's three parts and omits the goal and the plan entirely.
- C is wrong: Velocity is a forecasting input calculated from past Sprints; it isn't one of the Sprint Backlog's own components.
- D is wrong: The Definition of Done is a separate commitment attached to the Increment, not a component the Sprint Backlog itself is missing.

### 20.

A project is running two weeks behind schedule. The sponsor proposes adding three new engineers to catch up. What is the likely short-term effect?

- **A.** The project speeds up in rough proportion to headcount, since more people working means more work gets done per day, the same way three cashiers process a queue faster than one.
- **B.** The schedule and cost both improve at once, since adding staff is the standard way to trade cost for time.
- **C.** The team's velocity increases immediately, once the new engineers begin estimating alongside the rest of the team.
- **D.** The project gets slower in the short term, because existing staff spend their time bringing the new engineers up to speed.

**Answer: D.** Cost and schedule are separate measurements — a project can be under budget and late at once — and adding people to work that is already behind typically slows it further in the short term, because existing staff are diverted to bringing newcomers up to speed. 'Hire more engineers' is usually the distractor in this competency's budget-and-resource questions, not the answer.

- A is wrong: Work doesn't scale linearly with headcount added mid-project; ramp-up time works against the very speed-up being sought.
- B is wrong: Cost rises with new hires while schedule typically worsens before it improves; the two don't move together the way this option implies.
- C is wrong: Velocity reflects what a team has actually completed; new engineers don't retroactively raise a figure calculated from past Sprints, and they need ramp-up time before contributing to future ones.

### 21.

A project is cancelled halfway through. The team disbands and moves to other work without a formal closure step. What has been skipped, and how does that omission differ from skipping a single Sprint Retrospective?

- **A.** Nothing was skipped, since closure only applies to projects that finish their full planned scope, and a cancellation ends the project's obligations the moment work stops.
- **B.** The Sprint Retrospective, since the team never held one before disbanding, and a Retrospective is where a Scrum Team is conventionally expected to capture what it learned before moving on to whatever comes next, project or otherwise, however the work happens to end.
- **C.** Closure itself — a cancelled project is still formally closed, with contracts ended, resources released and lessons recorded once; a skipped Retrospective instead only loses one team's chance to improve mid-project, not the project's only opportunity to record what happened.
- **D.** Nothing substantive — the issue tracker already holds a record of everything that happened, and anyone curious about the project later can simply read back through its tickets.

**Answer: C.** Closure formally ends a project — confirming acceptance, releasing resources, and recording lessons — and it applies to a cancelled project as much as a finished one, arguably more, since the lessons are the only thing a cancelled effort produced. That is a different kind of omission from a missed Sprint Retrospective, which repeats every Sprint for one team while work continues and directs its improvement inward, not outward to the organisation.

- A is wrong: The definition applies to cancelled projects at least as much as finished ones; skipping it on cancellation is the exact failure mode the exam tests.
- B is wrong: The Retrospective repeats every Sprint for one team while work continues; its absence here is a separate, smaller loss than skipping closure, which never happened once for the whole project.
- D is wrong: A tracker records individual items and their states; it isn't the acceptance, handover and organisation-wide lessons record that closure produces.

### 22.

A project's last deliverable is finished and demoed, but it was never formally accepted against the criteria agreed at the start, and the operations team was never given the runbook. Is the project closed?

- **A.** No, since acceptance against the original criteria and handover to operations are what actually end a project, and neither has happened yet.
- **B.** Yes — closure is simply whatever happens once the last piece of planned work is finished, since there is nothing left on the plan for anyone to keep working on after that point.
- **C.** Yes, since the deliverable's completion is itself the final milestone marking the project's end.
- **D.** Yes, provided a final Sprint Retrospective is held to capture lessons from the last iteration.

**Answer: A.** Closure is not the same as the last piece of work being finished. It requires confirming the deliverables were accepted against the criteria agreed at the start and handing the result over to whoever will operate it, including the runbook and support arrangement the operating team actually needs. A demoed but unaccepted, unhanded-over deliverable is an unfinished closure, not a completed one.

- B is wrong: That reading treats the finished deliverable as sufficient, but the operating team still can't run what was built without the runbook, and nothing has been formally accepted.
- C is wrong: A milestone marking completion doesn't substitute for acceptance and handover; the demo happening is an event, not confirmation the result was accepted or usable by operations.
- D is wrong: A Retrospective is a once-per-Sprint improvement exercise for one team; it doesn't confirm acceptance or complete handover to operations.

### 23.

An operations team is asked to migrate four hundred servers to a new LTS release by the end of Q3. Once complete, the team continues patching those same servers every month indefinitely. Which of the two activities is the project?

- **A.** The migration, because it is the larger and more technically demanding of the two efforts, and demanding, high-visibility work is what most people mean when they informally call something a project.
- **B.** The migration, because it has a defined end date and a unique objective; the monthly patching that follows is ongoing operations, however large an effort it continues to be.
- **C.** Whichever activity the sponsor currently considers the higher priority this quarter.
- **D.** Whichever activity is currently drawing more budget and headcount.

**Answer: B.** A project is temporary work with a defined end and a unique objective; its opposite is operations, the ongoing work of running what already exists. The migration ends and produces something new; the patching repeats indefinitely as part of keeping the fleet current, so it is operations regardless of its size.

- A is wrong: Size and difficulty are not the discriminator; a small effort with an end date is still a project, and a huge recurring effort is still operations.
- C is wrong: Priority describes how much attention something gets, not whether it is temporary with a unique objective.
- D is wrong: Spend and staffing describe scale, not the temporary-versus-ongoing distinction the definition turns on.

### 24.

A RACI matrix lists three people as Responsible for one activity and two people as Accountable for it. What is wrong with that assignment?

- **A.** Nothing — RACI allows any number of people to hold each of the four roles for a given activity, since spreading accountability is generally considered good governance.
- **B.** The problem is having three Responsible people, since only one person may ever do the actual work.
- **C.** The problem is that Consulted and Informed roles are missing from the assignment entirely.
- **D.** Exactly one person is conventionally Accountable per activity, though several may be Responsible; two Accountable owners is the malformed part.

**Answer: D.** A RACI matrix clarifies who is Responsible for doing the work, Accountable for its outcome, Consulted before it and Informed after it. The tested convention is that several people may be Responsible for one activity, but exactly one is Accountable — two Accountable owners defeats the purpose of naming a single answerable person.

- A is wrong: Responsible can be shared, but Accountable is conventionally exactly one person per activity — that's the point tested here.
- B is wrong: Several people sharing Responsible for one activity is normal; nothing about that count is the defect in this matrix.
- C is wrong: A matrix can validly assign only Responsible and Accountable for a given activity; omitting Consulted or Informed isn't automatically a malformation.

### 25.

A team has assessed a vendor delivery risk, scoring its likelihood and impact and ranking it against other risks. Has the team decided what to do about it?

- **A.** Yes — ranking a risk by its likelihood and impact is itself the risk response, since knowing where a risk sits relative to the others already tells the team what to prioritise doing about it.
- **B.** Yes, once the risk is logged in the issue tracker alongside its score.
- **C.** No, because assessment produces a priority order, never an action; deciding to avoid, mitigate, transfer or accept the risk is the separate step of response.
- **D.** Yes, provided a contingency reserve has already been set aside in the budget.

**Answer: C.** Risk management is a continuing cycle of identifying, assessing, responding to and monitoring risks. Assessment scores likelihood and impact to produce a priority order; it never itself produces an action. Response is the separate step of choosing to avoid, mitigate, transfer or accept each ranked risk, typically with a contingency reserve set aside if an accepted risk materialises.

- A is wrong: Ranking sorts risks against each other; it doesn't select avoid, mitigate, transfer or accept for any of them.
- B is wrong: An issue tracker is for things that have already happened; a risk is an uncertain future event, and logging its score there doesn't select a response.
- D is wrong: A contingency reserve is one possible outcome of choosing to accept a risk — setting it aside doesn't happen before a response is actually chosen.

### 26.

A customer asks a delivery team for an extra report field. The team agrees on the spot, adds it, and the schedule and budget both stay exactly as originally planned. Is this scope creep?

- **A.** No, because the request came directly from the customer rather than from inside the team, and customer-originated requests are generally treated as legitimate by default.
- **B.** Yes. The defining property is the absence of assessment, approval and a re-baselined schedule and budget, not the size of the addition.
- **C.** No, since the addition is small enough that it doesn't need to be tracked as a formal change.
- **D.** No, because the schedule and budget staying unchanged proves the addition had no real cost.

**Answer: B.** Scope creep is growth that happens without a matching adjustment to time, cost or baseline. A customer asking for more is normal; what turns it into creep is the team absorbing the request informally, with no impact assessment and no re-baselining, which is exactly what happened here, however small the field.

- A is wrong: The source of the request, customer or team, doesn't determine whether it's creep; the missing step is assessment and approval, wherever the request originated.
- C is wrong: 'Small' is exactly the size of request that accumulates into creep; the size doesn't exempt it from needing assessment.
- D is wrong: An unchanged schedule and budget after adding work usually means the cost was absorbed silently, not that there was none — that absorption is the mechanism of creep.

### 27.

A sponsor formally requests an additional module. The request is assessed for impact, approved by the sponsor, and the schedule and budget baselines are updated to reflect a two-week extension. Is this scope creep?

- **A.** Yes — any addition to scope after the project has started counts as creep, however it was handled.
- **B.** Yes, because the schedule moved, and any movement of a triple-constraint leg after baselining is creep by definition, however the movement came about or who approved it.
- **C.** It's creep unless the same request would also have been approved without any schedule extension at all.
- **D.** No; this is change control working as intended: the change was assessed, decided by someone with authority, and written back into the baseline.

**Answer: D.** Change control and scope creep both involve scope growing — the difference is whether that growth was assessed, decided by a named authority, and reflected in an updated baseline. Here it was, on all three counts, so the two extra weeks are the price of an approved trade-off, not an uncontrolled failure mode.

- A is wrong: Treating any post-start addition as creep ignores the actual test, which is whether the change went through assessment and approval; this one did.
- B is wrong: A leg moving is a normal outcome of an approved trade-off; the triple constraint doesn't forbid movement, it describes how legs trade off against each other.
- C is wrong: Whether the extension was strictly necessary isn't the test; the test is whether the change was assessed and decided by someone with the authority to decide.

### 28.

During a Sprint Review, an attendee raises: 'Handovers to the support team keep stalling.' The Scrum Master says this belongs in a different event. Which one, and why?

- **A.** The Daily Scrum, since any process complaint should be raised at the very next working day's event.
- **B.** Sprint Planning, since process changes should be scheduled before the next Sprint even starts.
- **C.** Project closure, since only a fully finished project can act on a systemic handover problem, because closure is the point at which lessons are finally written down for anyone else to read.
- **D.** The Sprint Retrospective, which inspects the team's own process, whereas the Review inspects the product and what to build next.

**Answer: D.** The Sprint Review and the Sprint Retrospective are the most reliably examined discrimination in this competency: the Review inspects the product and what to do next, and the Retrospective inspects individuals, interactions, processes and tools. A complaint about how the team works belongs in the Retrospective regardless of which event it happens to surface in.

- A is wrong: The Daily Scrum is fifteen minutes for the Developers to inspect progress toward the Sprint Goal, not a venue for raising process complaints.
- B is wrong: Sprint Planning addresses what will be built and how, not a review of what went wrong in the process last Sprint.
- C is wrong: Closure happens once, at the very end of a project; a recurring handover problem needs addressing every Sprint, not held until the project ends.

### 29.

A stakeholder wants a backlog item reprioritised and takes the request straight to a developer, who agrees to work on it next. What does the Scrum Guide say is wrong with that path?

- **A.** Nothing — any team member may reprioritise the backlog as long as the change is communicated afterward to whoever happens to be affected by it that Sprint.
- **B.** Ordering authority over the Product Backlog sits with the Product Owner; a developer agreeing to reprioritise bypasses the one person accountable for it.
- **C.** The request should have gone to the Scrum Master instead, since ordering is a process concern.
- **D.** Nothing is wrong, since reprioritisation requests are meant to be raised directly at the Daily Scrum.

**Answer: B.** The three Scrum accountabilities are distinct: the Product Owner owns Product Backlog ordering and value, the Scrum Master owns the process and impediment removal, and the Developers own how the work gets done. Anyone wanting the backlog changed does so by convincing the Product Owner, whose decisions the organisation must respect.

- A is wrong: Ordering authority is not distributed to whoever hears the request first; it belongs specifically to the Product Owner.
- C is wrong: The Scrum Master owns the process and coaches self-management, not backlog ordering, which is the Product Owner's accountability.
- D is wrong: The Daily Scrum is for the Developers to inspect progress toward the Sprint Goal, not a channel for stakeholders to reprioritise work.

### 30.

One team is described as having fixed-length two-week cycles, a single ordered backlog, and three defined accountabilities. A second is described as continuous flow with explicit work-in-progress limits and no fixed iteration. Which framework does each describe, and what is the deciding feature?

- **A.** The first is Scrum and the second is Kanban; the deciding feature is a fixed-length timebox against continuous, work-in-progress-limited flow.
- **B.** Both describe Scrum, since both are agile frameworks working from a backlog of items to be pulled through.
- **C.** The first describes agile in general, and the second describes one specific framework built beneath it.
- **D.** The deciding feature is which one has a backlog at all, since only the first maintains an ordered list of work that the team pulls items from as capacity allows.

**Answer: A.** Scrum organises work into fixed-length Sprints with a Product Owner, Scrum Master and Developers; Kanban manages the same kind of work as continuous flow, limited by explicit work-in-progress caps rather than a timebox. The presence or absence of a fixed iteration boundary is the reliable discriminator between the two.

- B is wrong: Only the first description matches Scrum's fixed-length Sprint and three accountabilities; the second has neither and matches Kanban instead.
- C is wrong: Scrum is itself a framework beneath agile's values, not agile-in-general; the first description names a specific framework, just as the second does.
- D is wrong: Kanban also maintains an ordered backlog of work to be pulled — a backlog isn't what separates the two.

### 31.

A candidate claims: 'the SDLC is waterfall, since the phases are always listed requirements, design, implementation, testing, deployment, maintenance, in that order.' What is wrong with the claim?

- **A.** The SDLC names the phases that must happen; waterfall is one policy for sequencing them, and an agile team runs the same phases repeatedly inside every iteration.
- **B.** Nothing — an agile team skips design and testing entirely, so only waterfall actually uses the listed phases.
- **C.** The claim gets the sequencing policy right but the order wrong — maintenance is actually the first phase in most descriptions, since systems are maintained from the moment requirements are first drafted.
- **D.** The phases listed are risk-management activities, not lifecycle phases at all.

**Answer: A.** The SDLC names the phases software passes through; it says nothing about their batch size or rhythm. Waterfall completes each phase before the next begins for the whole scope at once; agile traverses the same phases repeatedly, in miniature, inside each iteration. Treating 'SDLC' as a synonym for waterfall is the single most common confusion in this competency.

- B is wrong: An agile team still passes through requirements, design, implementation and testing, repeatedly, in small batches; it doesn't skip them.
- C is wrong: Maintenance is last in the conventional list, not first, and the ordering issue isn't the actual defect in the claim.
- D is wrong: Requirements, design, implementation and so on are development phases, not a risk-management framework.

### 32.

A Sprint is due to end Friday, but the team asks the Product Owner for three extra days to finish the last item. What has this request actually done to the Sprint?

- **A.** Broken the one property a Sprint exists to provide, namely a fixed length inside which forecasting from past Sprints stays meaningful.
- **B.** Nothing significant — a short extension to finish committed work is a normal, expected part of Sprint discipline, and treating it otherwise would make the framework needlessly rigid.
- **C.** Merged the Sprint Review into the following Sprint's planning session.
- **D.** Invalidated the team's velocity figure for every Sprint that follows.

**Answer: A.** A Sprint is a fixed-length event, commonly two weeks though the length is a convention, and the fixed box is what makes it possible to forecast from what a team has completed in the past. Extending it 'to finish' destroys that property for the Sprint it happens to, even though only the Product Owner has the authority to cancel a Sprint outright.

- B is wrong: Extending the timebox to finish work is exactly the practice the fixed-length rule exists to prevent, not a normal accommodation.
- C is wrong: Nothing about extending the Sprint's end date merges two named events into one.
- D is wrong: One extended Sprint doesn't retroactively invalidate every later velocity figure, though it does distort the extended Sprint's own data point.

### 33.

A security reviewer will never use the system being built but has the authority to block its release. Is she a stakeholder?

- **A.** Yes. A stakeholder is anyone affected by the project or able to affect it, and the ability to block release satisfies that on its own.
- **B.** No, because stakeholders are defined as people who will use or directly benefit from the delivered system, which by that reading would exclude reviewers, auditors and anyone outside the delivery team.
- **C.** Only once she is formally added to the project's communication plan.
- **D.** Only if she is assigned one of the four roles in the project's RACI matrix.

**Answer: A.** Stakeholder status turns on impact-or-influence, not on being a user or a team member. A reviewer who can block release without ever touching the system is a stakeholder on the influence test alone, and missing that is a commonly cited source of late-surfacing requirements.

- B is wrong: That definition excludes exactly the peripheral reviewers, auditors and downstream teams the exam most often asks about.
- C is wrong: A communication plan is built for stakeholders already identified; being listed there is a consequence of being a stakeholder, not a precondition.
- D is wrong: A RACI entry assigns responsibility for a task; stakeholder status doesn't depend on holding one of its four roles.

### 34.

Midway through a fixed-price project, the sponsor asks for an additional module. The delivery date and the budget both stay exactly as agreed. Which of the following must absorb the change?

- **A.** Nothing, provided the existing team simply works longer hours to cover the extra module.
- **B.** With scope up and both the schedule and the budget frozen, quality is the only remaining quantity the model bounds.
- **C.** A new milestone, added to the schedule to mark the module's completion.
- **D.** Nothing, as long as the module is logged as a minor addition rather than routed as a formal change, since informal requests below a certain size are commonly assumed not to need assessment.

**Answer: B.** The triple constraint holds that scope, time and cost bound quality; fixing any two forces the third — or, if none may move, quality — to absorb the change. 'The team works harder' names none of the three legs and is the trap answer; adding scope without adjusting schedule or cost only relabels the same problem.

- A is wrong: Extra effort from the same team is not one of the three legs; it typically produces slower delivery, not a free absorption of more scope.
- C is wrong: A milestone is a schedule marker, not one of the three legs the model bounds — adding one doesn't answer what actually gives.
- D is wrong: Treating an unassessed addition as minor is exactly how scope creep starts, not a way of avoiding a trade-off.

### 35.

A backlog item reads: 'Add a composite index to the orders table.' A reviewer says it is not a user story. What is missing, and what does the missing part usually let a team do?

- **A.** Nothing is missing — any single, well-defined unit of backlog work counts as a user story, provided it is small enough to fit comfortably inside one Sprint's worth of capacity.
- **B.** The role and benefit clauses; without a stated 'so that', the team cannot judge whether a different, cheaper implementation would satisfy the actual need.
- **C.** Its acceptance criteria — adding some would make it a proper story.
- **D.** An entry in the Sprint Backlog — placing it there would make it a story.

**Answer: B.** A user story is conventionally three clauses — as a role, I want a capability, so that a benefit — and what disqualifies most failed candidates is a missing benefit or a task phrased as though it were a need. 'Add an index' names an implementation with no role and no stated reason, which is exactly the shape the exam uses to test recognition of the template.

- A is wrong: A task written in technical terms with no user in it is precisely what a story is not, however well-defined the task itself is.
- C is wrong: Acceptance criteria are attached to a story once it exists; their absence doesn't explain why this item isn't a story in the first place.
- D is wrong: Sprint Backlog membership is about scheduling, not format; placing a task in a Sprint doesn't turn it into a story.

### 36.

A vendor must deliver a fixed scope specified in a signed regulatory contract, with no tolerance for redesign once implementation begins. Which sequencing approach does that cue point to, and why?

- **A.** Agile — because welcoming change even late in development reduces the vendor's regulatory exposure.
- **B.** Neither — a signed contract replaces the need for any sequencing methodology at all.
- **C.** Waterfall, since its main cost is expensive late change, which a genuinely fixed, stable scope has already ruled out.
- **D.** Agile, since any modern project should default to iterative delivery regardless of how fixed the scope is, because iteration is now widely treated as the safer default choice for almost any kind of work.

**Answer: C.** Waterfall moves the whole scope through completed, approved phases in sequence, which is predictable precisely when requirements won't change. A fixed regulatory contract with no tolerance for redesign is the textbook cue for it — the choice is about requirements stability, not about which approach is inherently faster or more modern.

- A is wrong: Welcoming late change is a poor fit for scope that cannot be redesigned mid-flight; it doesn't reduce risk here, it invites cost.
- B is wrong: A contract states what must be delivered, not how the team sequences the work to get there — some methodology still governs execution.
- D is wrong: Iterative delivery is valuable for uncertain requirements, but this scenario describes the opposite condition: stability, not uncertainty.

### 37.

A reviewer asks a migration project 'which of your plan items can slip without moving the end date?' The team can't answer from its work breakdown structure. Why not, and where does the answer actually come from?

- **A.** The work breakdown structure does contain dates, but they were left blank in this case by mistake.
- **B.** It can't answer scheduling questions because it only lists who is responsible for each task, not what the tasks actually are or how they relate to one another across the whole deliverable.
- **C.** The answer comes from the team's velocity, which shows how much slack the team has each Sprint.
- **D.** The work breakdown structure has no time axis, durations or dependency arrows by design; the answer comes from the schedule built on top of it, specifically the critical path.

**Answer: D.** A work breakdown structure decomposes the deliverable into work packages small enough to estimate and assign, organised by what is being produced — it has no time axis, no durations and no dependency arrows. Only afterwards, once those packages are sequenced into a schedule, do dates and dependencies appear, and it's the critical path within that schedule that answers which tasks can slip without moving the finish.

- A is wrong: The absence of dates is by design, not an omission — a work breakdown structure is a structure, not a timeline, and was never meant to carry them.
- B is wrong: It shows the decomposition of the deliverable, organised by what is produced, not an assignment of owners — an org chart is a different malformation of the same idea.
- C is wrong: Velocity is a Scrum forecasting figure calculated from completed work per Sprint; it doesn't identify which schedule items are on the critical path.

