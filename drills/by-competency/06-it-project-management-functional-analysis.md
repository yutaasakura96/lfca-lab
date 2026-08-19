<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — IT Project Management Fundamentals :: Functional Analysis

15 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A team already has a gap analysis showing six differences between current and desired capability. What question does a feasibility study add that the gap analysis did not answer?

- **A.** Whether closing those gaps is technically, operationally and economically achievable, before anyone commits.
- **B.** How large the differences are between the current and desired states.
- **C.** Which of the six differences should be addressed first, since ordering by value is treated as part of naming the gaps rather than a separate step.
- **D.** Nothing new — a feasibility study and a gap analysis answer the same question in different words.

**Answer: A.** A feasibility study assesses, before commitment, whether a proposal is technically, operationally and economically achievable — with legal and schedule feasibility often added. Recognition of the term and its dimensions is what this level of the exam expects.

- B is wrong: That is exactly what the gap analysis already produced; it is not the question a feasibility study adds.
- C is wrong: Ordering by value is prioritization's job, a separate step from asking whether the work is achievable at all.
- D is wrong: A gap analysis says how far apart the current and desired states are; a feasibility study asks whether closing that distance is achievable and worth committing to at all.

### 2.

A finance lead writes: 'The system shall lock a user account after five failed login attempts.' Which classification is correct, and on what basis?

- **A.** Non-functional — the five-attempt count is a numeric bound, and a requirement carrying a number constrains quality rather than behaviour.
- **B.** A design decision, since account lockout is an implementation detail better captured as a use case's exception flow.
- **C.** Non-functional, since account lockout is a security matter and security requirements are always non-functional.
- **D.** Functional, since it names a function the system must execute, which is the axis the classification actually turns on.

**Answer: D.** Functional requirements describe the functions the software is to execute; non-functional requirements act to constrain the solution — how well those functions are performed. A number settles nothing on its own: a count of failed attempts is part of the behaviour, while a latency bound is a quality constraint. Neither the subject matter (security, in this case) nor the importance decides the classification.

- A is wrong: The count of failed attempts is part of the function being specified; a non-functional requirement bounds how well a function performs, such as its speed or availability, and numbers appear in both kinds.
- B is wrong: Lockout after failed attempts is the behaviour itself, not a mechanism for achieving some other behaviour; it belongs in the requirement, whether or not a use case later elaborates it.
- C is wrong: Security does appear in the standard list of non-functional categories, but that list covers quality constraints; a security behaviour the system must execute, such as locking an account, is a function like any other.

### 3.

A requirements document contains: 'The system shall store customer records in PostgreSQL.' Which statement about this sentence is correct?

- **A.** It is defective in the same way 'the system shall provide flexible reporting' is defective, since neither sentence can be tested as it is written.
- **B.** It states an implementation choice rather than the need behind it, so it has to be rewritten as behaviour or kept as a constraint with its reason recorded.
- **C.** It is a non-functional requirement of the same kind as a stated latency threshold, since both put a measurable bound on how well the system performs.
- **D.** It is a requirement like any other, since every sentence in a requirements document is by definition a requirement.

**Answer: B.** A functional requirement states what the system must do, phrased as an observable outcome rather than an implementation. Naming a vendor, product or protocol is the clearest tell that a solution has been written into requirement voice. The fix is to rewrite it as the behaviour the product was meant to deliver — or, where the choice really is imposed, to keep it as a design constraint and record why the solution was limited to that one method.

- A is wrong: Untestable wording and a smuggled-in solution are different defects; this sentence is perfectly testable and specific, and its problem is that it names a product instead of a need.
- C is wrong: A quality requirement has to be quantified to be verifiable, and naming a database product states no measurable level of anything, so it is not a statement of that kind.
- D is wrong: Requirements documents routinely carry constraints, assumptions and rationale written in requirement voice; what a sentence is depends on what it states, not on where it happens to sit.

### 4.

A gap analysis lists six differences between a department's current and desired capability. What can the analysis, by itself, not tell the team?

- **A.** How large the differences are between the current and desired states.
- **B.** Whether closing the gaps is achievable and worth committing to, a judgement that belongs to a feasibility study.
- **C.** What work would be needed to close each of the six differences, since the comparison stops at naming them and leaves the closing actions to a later technique.
- **D.** Nothing — a gap analysis inherently ranks each gap by cost and risk as part of the comparison.

**Answer: B.** A gap analysis is a structured comparison whose output is the set of differences and the work needed to close them. What it does not deliver is a judgement on achievability, cost or worth — that is a feasibility question, kept deliberately separate.

- A is wrong: That is exactly what the gap analysis already produced — the six listed differences are its output, not something missing from it.
- C is wrong: Defining the work that closes the difference is part of the gap analysis itself, not something withheld from it; the six differences and the actions they imply are both its output.
- D is wrong: The comparison is done dimension by dimension to state what is missing, not to rank it; ranking and achievability are both judgements the technique deliberately withholds.

### 5.

A backlog review drops a requirement tagged 'non-functional,' reasoning that non-functional items rank below functional ones. What is wrong with that reasoning?

- **A.** The requirement should have been marked 'Won't have' under MoSCoW before being dropped, rather than dropped on classification alone.
- **B.** The requirement was probably untestable as worded, which is the real defect being missed here.
- **C.** Nothing is wrong — 'non-functional' is the conventional label for a lower-priority requirement.
- **D.** Classification and priority are independent axes; a non-functional requirement can be the highest-priority item in the set.

**Answer: D.** Non-functional requirements constrain how well a behaviour performs, and that classification says nothing about necessity. A team that conflates the two can drop a requirement — often the one deciding the architecture — on no stronger basis than its label.

- A is wrong: This treats the symptom rather than the mistake: swapping in the right label for 'dropped' still leaves classification standing in for a priority judgement it cannot make.
- B is wrong: Nothing in the scenario suggests the wording is unmeasurable; the stated reasoning is about priority, not testability.
- C is wrong: This is the inversion itself, restated as if it were the rule: non-functional requirements are frequently the ones that decide the architecture.

### 6.

Which of these is a well-formed non-functional requirement?

- **A.** The system shall let a user search by keyword, with no bound on how quickly results return.
- **B.** Search performance is listed as a Must have on the delivery backlog.
- **C.** 95% of search requests shall complete within 300 ms under normal load.
- **D.** The search feature must be fast and pleasant for users to work with.

**Answer: C.** A usable non-functional requirement carries an attribute, a metric, a threshold, and the conditions the threshold is measured under. Sentences that state a behaviour without a bound, a priority label, or an unmeasurable adjective all fail one of those parts.

- A is wrong: This states a behaviour with no threshold at all, which is what makes it functional rather than non-functional.
- B is wrong: This states a priority, not a quality target; a MoSCoW label carries no attribute, threshold or condition to measure against.
- D is wrong: This reads like a quality requirement but has no threshold, so nothing about it can pass or fail — untestable as worded.

### 7.

A team draws only a to-be swimlane diagram for a redesigned claims workflow and presents it as proof of improvement. What is missing?

- **A.** A gap analysis, since only that technique can say whether the current state is worth changing enough to justify replacing it with the redesigned workflow.
- **B.** A use case for every actor who touches the process.
- **C.** The as-is map; without a baseline of the current workflow there is nothing to demonstrate the difference against.
- **D.** Nothing — a single map of the intended future is sufficient once stakeholders agree it looks right.

**Answer: C.** Process maps cover the whole workflow, including approvals given verbally and work queued in an inbox. Drawn in pairs — current and intended — they make improvement arguable; the as-is half is also where the unwelcome findings usually live.

- A is wrong: A gap analysis needs both states already mapped as its input; it does not substitute for drawing the missing as-is map itself.
- B is wrong: A use case documents one actor's interaction with the system; the workflow spans steps no software touches at all, which a use case would not capture.
- D is wrong: Agreement about how the future should look is not the same as showing what changed; without the present-state map there is no baseline to compare against.

### 8.

Why does practice favor 'requirements elicitation' over 'requirements gathering' as the name for this activity?

- **A.** 'Gathering' implies finished requirements already exist and only need collecting; elicitation exists because stated wants and actual needs routinely differ.
- **B.** Because gathering only covers workflow diagrams, while elicitation also covers written documents.
- **C.** Because elicitation identifies the gap between current and desired capability, which gathering cannot do, since gathering only records what stakeholders have already written down.
- **D.** There is no real difference between the two terms; they are used interchangeably across most practice guides and style references.

**Answer: A.** Elicitation is the work of drawing requirements out of people — interviews, workshops, observation, document study — rather than collecting requirements that already exist in finished form. A team that only transcribes what it was asked for can build exactly that and still fail the people who asked.

- B is wrong: Diagramming a workflow is a distinct technique with its own artifact; elicitation is not defined by which artifact it produces.
- C is wrong: Naming that gap is a separate, later technique; elicitation is about drawing needs out of people, not comparing two already-described states.
- D is wrong: The word choice is deliberate: 'gathering' presumes the requirements are already there to be picked up, which is exactly the assumption elicitation exists to reject.

### 9.

A backlog owner marks every requirement 'Must have' under MoSCoW, reasoning that each one genuinely matters to the business. What has this prioritization actually achieved?

- **A.** It has established which gaps between current and desired state are most urgent.
- **B.** Nothing. A scheme where every item is Must has simply relabeled the whole list without forcing any trade-off.
- **C.** It has confirmed that the non-functional requirements are the highest priority.
- **D.** It has correctly captured the business's needs, since a Must-have list should include everything that matters.

**Answer: B.** Prioritization schemes are applied with a cap on the top band or forced ranking precisely because an unconstrained list tends to fill up with Must-haves. The value shows up only at the moment of pressure, converting a shortfall into a planned reduction of scope rather than an argument.

- A is wrong: Naming gaps between two states is gap analysis's output; labeling a backlog with MoSCoW does not perform that comparison.
- C is wrong: Nothing in the scenario distinguishes functional from non-functional; classification and priority are independent axes, and this labeling touches neither.
- D is wrong: This treats prioritization as a record of importance rather than a forced trade-off, which is the failure mode the scenario illustrates.

### 10.

A specification statement reads: 'The system shall provide flexible reporting and support various export formats.' Why can no test settle whether the delivered system meets it?

- **A.** The sentence is fine; 'flexible' is a legitimate non-functional attribute in the same family as availability or performance.
- **B.** The sentence cannot be traced to a test case, which is the only defect present.
- **C.** Nothing is wrong with it — any sentence phrased as a 'shall' statement is testable by virtue of that phrasing.
- **D.** It is ambiguous and unverifiable as written: 'flexible' has no measurable meaning, and it bundles two requirements into a single statement.

**Answer: D.** A specification's quality caps what verification can catch: no test can pass or fail a statement whose terms have no measurable meaning, because no two readers have to agree on what it demands. Review checklists exist to catch exactly this before it reaches a tester — they call out unverifiable words such as 'flexible,' 'user-friendly' and 'fast,' and they require one thought per requirement statement.

- A is wrong: A real quality attribute needs a threshold and a condition to be measured under; 'flexible' names no measurable quality at all.
- B is wrong: Traceability is a separate property from testability; an untestable requirement is defective whether or not it happens to be linked to a test case.
- C is wrong: The 'shall' form signals intent to state a requirement, but it guarantees nothing about whether the requirement is measurable.

### 11.

A traceability matrix shows every numbered requirement linked to at least one test case. What does that demonstrate, and what does it not?

- **A.** It demonstrates that the system was validated against the real need it was meant to serve, since every requirement has a test exercising it.
- **B.** It demonstrates that user acceptance testing has been completed for every requirement in the release, since a linked test is an executed test.
- **C.** It demonstrates coverage — every requirement has at least one test linked to it — but not that any test was run or passed, or that the requirement was the right one.
- **D.** It demonstrates that every requirement passed its test, since each one is linked to a test case and none is left uncovered in the matrix.

**Answer: C.** Traceability links each requirement forward to design, implementation and test, and back to the need that justified it, so coverage and impact can both be demonstrated. It is confused with testing itself, but a link is not a verdict.

- A is wrong: A link between a requirement and a test says nothing about whether the requirement itself was the right one to have — that is a validation question the matrix does not answer.
- B is wrong: The matrix records links between requirements and tests, not who executed a test or with what outcome.
- D is wrong: A link shows a test exists for the requirement, not that the test was run or that it passed; coverage and correctness are different claims.

### 12.

A backlog item reads: 'As a claims assessor, I want to flag a suspicious claim, so that it gets reviewed before payment.' A stakeholder calls this a use case. What would need to be added for that to be accurate?

- **A.** The actor, preconditions, a numbered main success scenario, and the alternate and exception flows — a use case is written to be complete in itself.
- **B.** Nothing — this is already a complete use case, merely written in a shorter, more casual form for the backlog.
- **C.** A swimlane diagram showing which department reviews the flagged claim before payment is issued, since that is the artifact that would make the missing detail visible.
- **D.** A MoSCoW priority tag showing how urgent the flag is relative to other backlog items.

**Answer: A.** A use case is written to be sufficient on its own — actor, goal, preconditions, main flow, alternate and exception flows, postcondition. A user story is written to be insufficient on purpose, a reminder that a need must still be discussed. The separating axis is intended completeness, not length.

- B is wrong: This is a user story, not a shortened use case; the two differ in intended completeness, not in word count.
- C is wrong: That is process mapping's artifact, for the surrounding business workflow — a use case describes one actor's interaction with the system, not the department hand-offs around it.
- D is wrong: Priority is a separate axis from completeness and does not add any of the detail a use case needs.

### 13.

A use case diagram for a billing system shows an oval labeled 'Generate month-end invoices' connected to an actor labeled 'Scheduler.' A reviewer objects that an automated trigger cannot be an actor. Is the objection correct?

- **A.** Yes — only a person in a role can be an actor, which is the reason the term is used at all.
- **B.** No. An actor is anything outside the system boundary that initiates or participates in the interaction, human or not.
- **C.** The objection is right in spirit — the scheduled trigger should be recorded during elicitation instead of modeled as an actor.
- **D.** No, but only because the diagram should have been a swimlane process map instead.

**Answer: B.** An actor is anyone or anything outside the system boundary that initiates or participates in the interaction — a person in a role, another system, or a scheduled trigger. The diagram itself carries essentially none of the interaction detail; that lives in the use case's flows.

- A is wrong: 'Actor' is preferred over 'user' precisely because it is not limited to people; ruling out a scheduled job or an upstream system is wrong on its face.
- C is wrong: Elicitation is a separate activity for drawing needs out of people; it does not determine what may appear as an actor in a use case.
- D is wrong: A swimlane map is a different artifact for the surrounding workflow; it is not what settles whether a scheduler can be an actor.

### 14.

A test team already ran system testing against the specification. During UAT, the same testers re-run the identical scripts at the users' own desks. What has been wasted?

- **A.** The specification's traceability, since re-running scripts breaks the link between requirement and test.
- **B.** Nothing measurable — repeating verification twice is simply extra assurance, not a waste.
- **C.** The one check meant to catch a wrong specification — real users exercising their own work instead of re-verifying conformance.
- **D.** Nothing — UAT is meant to be a second pass confirming the test team's results.

**Answer: C.** UAT is performed by the people who will use the system, against their real work and acceptance criteria, and typically ends in an explicit business sign-off. Run as a repeat of system testing, it stops being a validation activity and becomes a second, redundant verification pass.

- A is wrong: Traceability links persist regardless of who executes a test or how many times; nothing about repeating scripts breaks that link.
- B is wrong: Extra verification uses up the time and attention meant for validation, which is exactly the resource this scenario shows being spent on the wrong check.
- D is wrong: Treating UAT as a second pass over the test team's script is the wrong mental model; it should exercise the users' own work against their real needs, not the specification a second time.

### 15.

A release passes 100% of its planned tests, and the traceability matrix shows every requirement covered. Two weeks after go-live, the department is still using its old spreadsheet instead. What does this show?

- **A.** Verification succeeded — the system conforms to its specification — but validation was never done, so a wrong specification went undetected.
- **B.** The traceability matrix must be wrong, since full coverage should have caught the department's non-adoption.
- **C.** User acceptance testing must not have been run, since UAT alone verifies conformance to the specification.
- **D.** Nothing is wrong — passing every test in the plan is itself evidence the project succeeded.

**Answer: A.** Verification asks whether the system was built right, against the agreed specification; validation asks whether the right thing was built, against the actual need. The two checks cannot substitute for each other, which is exactly what a fully-tested, unused system demonstrates.

- B is wrong: Coverage is not correctness; the matrix did its job by showing every requirement had a test, and that says nothing about whether the requirement was the right one.
- C is wrong: UAT checks the real need, not conformance to the specification — that is what makes it a validation activity, the opposite of the gap this scenario is illustrating.
- D is wrong: Passing every test in the plan is evidence of conformance to the specification alone; it is not by itself evidence that the project met the actual need.

