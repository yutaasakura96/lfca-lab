<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — IT Project Management Fundamentals

100 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A team already has a gap analysis showing six differences between current and desired capability. What question does a feasibility study add that the gap analysis did not answer?

- **A.** How large the differences are between the current and desired states.
- **B.** Which of the six differences should be addressed first, since ordering by value is treated as part of naming the gaps rather than a separate step.
- **C.** Whether closing those gaps is technically, operationally and economically achievable, before anyone commits.
- **D.** Nothing new — a feasibility study and a gap analysis answer the same question in different words.

**Answer: C.** A feasibility study assesses, before commitment, whether a proposal is technically, operationally and economically achievable — with legal and schedule feasibility often added. Recognition of the term and its dimensions is what this level of the exam expects.

- A is wrong: That is exactly what the gap analysis already produced; it is not the question a feasibility study adds.
- B is wrong: Ordering by value is prioritization's job, a separate step from asking whether the work is achievable at all.
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
- **B.** It is a non-functional requirement of the same kind as a stated latency threshold, since both put a measurable bound on how well the system performs.
- **C.** It is a requirement like any other, since every sentence in a requirements document is by definition a requirement.
- **D.** It states an implementation choice rather than the need behind it, so it has to be rewritten as behaviour or kept as a constraint with its reason recorded.

**Answer: D.** A functional requirement states what the system must do, phrased as an observable outcome rather than an implementation. Naming a vendor, product or protocol is the clearest tell that a solution has been written into requirement voice. The fix is to rewrite it as the behaviour the product was meant to deliver — or, where the choice really is imposed, to keep it as a design constraint and record why the solution was limited to that one method.

- A is wrong: Untestable wording and a smuggled-in solution are different defects; this sentence is perfectly testable and specific, and its problem is that it names a product instead of a need.
- B is wrong: A quality requirement has to be quantified to be verifiable, and naming a database product states no measurable level of anything, so it is not a statement of that kind.
- C is wrong: Requirements documents routinely carry constraints, assumptions and rationale written in requirement voice; what a sentence is depends on what it states, not on where it happens to sit.

### 4.

A gap analysis lists six differences between a department's current and desired capability. What can the analysis, by itself, not tell the team?

- **A.** Whether closing the gaps is achievable and worth committing to, a judgement that belongs to a feasibility study.
- **B.** How large the differences are between the current and desired states.
- **C.** What work would be needed to close each of the six differences, since the comparison stops at naming them and leaves the closing actions to a later technique.
- **D.** Nothing — a gap analysis inherently ranks each gap by cost and risk as part of the comparison.

**Answer: A.** A gap analysis is a structured comparison whose output is the set of differences and the work needed to close them. What it does not deliver is a judgement on achievability, cost or worth — that is a feasibility question, kept deliberately separate.

- B is wrong: That is exactly what the gap analysis already produced — the six listed differences are its output, not something missing from it.
- C is wrong: Defining the work that closes the difference is part of the gap analysis itself, not something withheld from it; the six differences and the actions they imply are both its output.
- D is wrong: The comparison is done dimension by dimension to state what is missing, not to rank it; ranking and achievability are both judgements the technique deliberately withholds.

### 5.

A backlog review drops a requirement tagged 'non-functional,' reasoning that non-functional items rank below functional ones. What is wrong with that reasoning?

- **A.** The requirement should have been marked 'Won't have' under MoSCoW before being dropped, rather than dropped on classification alone.
- **B.** The requirement was probably untestable as worded, which is the real defect being missed here.
- **C.** Classification and priority are independent axes; a non-functional requirement can be the highest-priority item in the set.
- **D.** Nothing is wrong — 'non-functional' is the conventional label for a lower-priority requirement.

**Answer: C.** Non-functional requirements constrain how well a behaviour performs, and that classification says nothing about necessity. A team that conflates the two can drop a requirement — often the one deciding the architecture — on no stronger basis than its label.

- A is wrong: This treats the symptom rather than the mistake: swapping in the right label for 'dropped' still leaves classification standing in for a priority judgement it cannot make.
- B is wrong: Nothing in the scenario suggests the wording is unmeasurable; the stated reasoning is about priority, not testability.
- D is wrong: This is the inversion itself, restated as if it were the rule: non-functional requirements are frequently the ones that decide the architecture.

### 6.

Which of these is a well-formed non-functional requirement?

- **A.** The system shall let a user search by keyword, with no bound on how quickly results return.
- **B.** Search performance is listed as a Must have on the delivery backlog.
- **C.** The search feature must be fast and pleasant for users to work with.
- **D.** 95% of search requests shall complete within 300 ms under normal load.

**Answer: D.** A usable non-functional requirement carries an attribute, a metric, a threshold, and the conditions the threshold is measured under. Sentences that state a behaviour without a bound, a priority label, or an unmeasurable adjective all fail one of those parts.

- A is wrong: This states a behaviour with no threshold at all, which is what makes it functional rather than non-functional.
- B is wrong: This states a priority, not a quality target; a MoSCoW label carries no attribute, threshold or condition to measure against.
- C is wrong: This reads like a quality requirement but has no threshold, so nothing about it can pass or fail — untestable as worded.

### 7.

A team draws only a to-be swimlane diagram for a redesigned claims workflow and presents it as proof of improvement. What is missing?

- **A.** A gap analysis, since only that technique can say whether the current state is worth changing enough to justify replacing it with the redesigned workflow.
- **B.** A use case for every actor who touches the process.
- **C.** Nothing — a single map of the intended future is sufficient once stakeholders agree it looks right.
- **D.** The as-is map; without a baseline of the current workflow there is nothing to demonstrate the difference against.

**Answer: D.** Process maps cover the whole workflow, including approvals given verbally and work queued in an inbox. Drawn in pairs — current and intended — they make improvement arguable; the as-is half is also where the unwelcome findings usually live.

- A is wrong: A gap analysis needs both states already mapped as its input; it does not substitute for drawing the missing as-is map itself.
- B is wrong: A use case documents one actor's interaction with the system; the workflow spans steps no software touches at all, which a use case would not capture.
- C is wrong: Agreement about how the future should look is not the same as showing what changed; without the present-state map there is no baseline to compare against.

### 8.

Why does practice favor 'requirements elicitation' over 'requirements gathering' as the name for this activity?

- **A.** Because gathering only covers workflow diagrams, while elicitation also covers written documents.
- **B.** Because elicitation identifies the gap between current and desired capability, which gathering cannot do, since gathering only records what stakeholders have already written down.
- **C.** 'Gathering' implies finished requirements already exist and only need collecting; elicitation exists because stated wants and actual needs routinely differ.
- **D.** There is no real difference between the two terms; they are used interchangeably across most practice guides and style references.

**Answer: C.** Elicitation is the work of drawing requirements out of people — interviews, workshops, observation, document study — rather than collecting requirements that already exist in finished form. A team that only transcribes what it was asked for can build exactly that and still fail the people who asked.

- A is wrong: Diagramming a workflow is a distinct technique with its own artifact; elicitation is not defined by which artifact it produces.
- B is wrong: Naming that gap is a separate, later technique; elicitation is about drawing needs out of people, not comparing two already-described states.
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

- **A.** It is ambiguous and unverifiable as written: 'flexible' has no measurable meaning, and it bundles two requirements into a single statement.
- **B.** The sentence is fine; 'flexible' is a legitimate non-functional attribute in the same family as availability or performance.
- **C.** The sentence cannot be traced to a test case, which is the only defect present.
- **D.** Nothing is wrong with it — any sentence phrased as a 'shall' statement is testable by virtue of that phrasing.

**Answer: A.** A specification's quality caps what verification can catch: no test can pass or fail a statement whose terms have no measurable meaning, because no two readers have to agree on what it demands. Review checklists exist to catch exactly this before it reaches a tester — they call out unverifiable words such as 'flexible,' 'user-friendly' and 'fast,' and they require one thought per requirement statement.

- B is wrong: A real quality attribute needs a threshold and a condition to be measured under; 'flexible' names no measurable quality at all.
- C is wrong: Traceability is a separate property from testability; an untestable requirement is defective whether or not it happens to be linked to a test case.
- D is wrong: The 'shall' form signals intent to state a requirement, but it guarantees nothing about whether the requirement is measurable.

### 11.

A traceability matrix shows every numbered requirement linked to at least one test case. What does that demonstrate, and what does it not?

- **A.** It demonstrates coverage — every requirement has at least one test linked to it — but not that any test was run or passed, or that the requirement was the right one.
- **B.** It demonstrates that the system was validated against the real need it was meant to serve, since every requirement has a test exercising it.
- **C.** It demonstrates that user acceptance testing has been completed for every requirement in the release, since a linked test is an executed test.
- **D.** It demonstrates that every requirement passed its test, since each one is linked to a test case and none is left uncovered in the matrix.

**Answer: A.** Traceability links each requirement forward to design, implementation and test, and back to the need that justified it, so coverage and impact can both be demonstrated. It is confused with testing itself, but a link is not a verdict.

- B is wrong: A link between a requirement and a test says nothing about whether the requirement itself was the right one to have — that is a validation question the matrix does not answer.
- C is wrong: The matrix records links between requirements and tests, not who executed a test or with what outcome.
- D is wrong: A link shows a test exists for the requirement, not that the test was run or that it passed; coverage and correctness are different claims.

### 12.

A backlog item reads: 'As a claims assessor, I want to flag a suspicious claim, so that it gets reviewed before payment.' A stakeholder calls this a use case. What would need to be added for that to be accurate?

- **A.** Nothing — this is already a complete use case, merely written in a shorter, more casual form for the backlog.
- **B.** A swimlane diagram showing which department reviews the flagged claim before payment is issued, since that is the artifact that would make the missing detail visible.
- **C.** The actor, preconditions, a numbered main success scenario, and the alternate and exception flows — a use case is written to be complete in itself.
- **D.** A MoSCoW priority tag showing how urgent the flag is relative to other backlog items.

**Answer: C.** A use case is written to be sufficient on its own — actor, goal, preconditions, main flow, alternate and exception flows, postcondition. A user story is written to be insufficient on purpose, a reminder that a need must still be discussed. The separating axis is intended completeness, not length.

- A is wrong: This is a user story, not a shortened use case; the two differ in intended completeness, not in word count.
- B is wrong: That is process mapping's artifact, for the surrounding business workflow — a use case describes one actor's interaction with the system, not the department hand-offs around it.
- D is wrong: Priority is a separate axis from completeness and does not add any of the detail a use case needs.

### 13.

A use case diagram for a billing system shows an oval labeled 'Generate month-end invoices' connected to an actor labeled 'Scheduler.' A reviewer objects that an automated trigger cannot be an actor. Is the objection correct?

- **A.** No. An actor is anything outside the system boundary that initiates or participates in the interaction, human or not.
- **B.** Yes — only a person in a role can be an actor, which is the reason the term is used at all.
- **C.** The objection is right in spirit — the scheduled trigger should be recorded during elicitation instead of modeled as an actor.
- **D.** No, but only because the diagram should have been a swimlane process map instead.

**Answer: A.** An actor is anyone or anything outside the system boundary that initiates or participates in the interaction — a person in a role, another system, or a scheduled trigger. The diagram itself carries essentially none of the interaction detail; that lives in the use case's flows.

- B is wrong: 'Actor' is preferred over 'user' precisely because it is not limited to people; ruling out a scheduled job or an upstream system is wrong on its face.
- C is wrong: Elicitation is a separate activity for drawing needs out of people; it does not determine what may appear as an actor in a use case.
- D is wrong: A swimlane map is a different artifact for the surrounding workflow; it is not what settles whether a scheduler can be an actor.

### 14.

A test team already ran system testing against the specification. During UAT, the same testers re-run the identical scripts at the users' own desks. What has been wasted?

- **A.** The specification's traceability, since re-running scripts breaks the link between requirement and test.
- **B.** The one check meant to catch a wrong specification — real users exercising their own work instead of re-verifying conformance.
- **C.** Nothing measurable — repeating verification twice is simply extra assurance, not a waste.
- **D.** Nothing — UAT is meant to be a second pass confirming the test team's results.

**Answer: B.** UAT is performed by the people who will use the system, against their real work and acceptance criteria, and typically ends in an explicit business sign-off. Run as a repeat of system testing, it stops being a validation activity and becomes a second, redundant verification pass.

- A is wrong: Traceability links persist regardless of who executes a test or how many times; nothing about repeating scripts breaks that link.
- C is wrong: Extra verification uses up the time and attention meant for validation, which is exactly the resource this scenario shows being spent on the wrong check.
- D is wrong: Treating UAT as a second pass over the test team's script is the wrong mental model; it should exercise the users' own work against their real needs, not the specification a second time.

### 15.

A release passes 100% of its planned tests, and the traceability matrix shows every requirement covered. Two weeks after go-live, the department is still using its old spreadsheet instead. What does this show?

- **A.** The traceability matrix must be wrong, since full coverage should have caught the department's non-adoption.
- **B.** User acceptance testing must not have been run, since UAT alone verifies conformance to the specification.
- **C.** Nothing is wrong — passing every test in the plan is itself evidence the project succeeded.
- **D.** Verification succeeded — the system conforms to its specification — but validation was never done, so a wrong specification went undetected.

**Answer: D.** Verification asks whether the system was built right, against the agreed specification; validation asks whether the right thing was built, against the actual need. The two checks cannot substitute for each other, which is exactly what a fully-tested, unused system demonstrates.

- A is wrong: Coverage is not correctness; the matrix did its job by showing every requirement had a test, and that says nothing about whether the requirement was the right one.
- B is wrong: UAT checks the real need, not conformance to the specification — that is what makes it a validation activity, the opposite of the gap this scenario is illustrating.
- C is wrong: Passing every test in the plan is evidence of conformance to the specification alone; it is not by itself evidence that the project met the actual need.

### 16.

What does AGPL section 13 add on top of the plain GPL, and what specifically triggers it?

- **A.** Nothing beyond the plain GPL — conveying a copy remains the only trigger, since GPLv3 section 5 already covers network interaction on its own.
- **B.** An obligation, triggered by that network interaction rather than by conveying a copy, to offer the Corresponding Source to users who interact with a modified version remotely over a network.
- **C.** A requirement to publish a Software Bill of Materials each time the hosted service is updated with new dependencies.
- **D.** An obligation that applies to any software running on a server that users reach over the internet, regardless of which licence that software carries.

**Answer: B.** The AGPL was written to close the gap where a modified program is offered as a service but never conveyed to anyone. Section 13's trigger is network interaction with a modified version, independent of whether a copy ever changes hands.

- A is wrong: GPLv3 section 5 concerns conveying a copy; it does not reach a hosted, never-distributed service, which is exactly the gap section 13 closes.
- C is wrong: Section 13 requires offering Corresponding Source to network users; it says nothing about producing a bill of materials.
- D is wrong: Section 13 is a term of the AGPL specifically; software under other licences, including the plain GPL, is not reached by it at all.

### 17.

A contributor to an Apache-2.0 project files a lawsuit alleging the project's work infringes a patent that contributor holds. What happens under section 3 to the patent licences that contributor holds in the work?

- **A.** Nothing happens to them, since MIT and the BSD licences carry no patent-termination mechanism at all for either side to ever invoke.
- **B.** They terminate for every contributor to the project at once, not just the one who filed suit, since the NOTICE file lists all contributors jointly by name.
- **C.** They terminate for that contributor, because Apache-2.0 ends the patent licences granted to anyone who files patent litigation alleging the work infringes.
- **D.** They terminate only if the project is also dual-licensed under a copyleft licence, since permissive terms alone cannot enforce patent termination.

**Answer: C.** Section 3 grants a scoped patent licence and terminates it for anyone who files patent litigation alleging the work infringes — a mechanism unique to Apache-2.0 among the permissive licences and central to what it adds over MIT and BSD.

- A is wrong: MIT's and BSD's silence on patents is beside the point here; Apache-2.0's own section 3 does carry a termination clause, and it applies.
- B is wrong: Termination under section 3 is scoped to the litigant's own licences; the NOTICE file's attribution list has no bearing on whose grant ends.
- D is wrong: Apache-2.0's patent-termination clause is a feature of its own permissive text and needs no copyleft licence layered on top to take effect.

### 18.

A downstream distributor modifies three files from an Apache-2.0 project that ships a NOTICE file, then redistributes the result. Beyond MIT's single notice-retention condition, what does Apache-2.0 additionally require here?

- **A.** Nothing additional — Apache-2.0's redistribution conditions reduce in practice to the exact same single copyright-notice requirement that MIT's one-paragraph licence text already carries in full, word for word.
- **B.** Marking the three modified files with prominent notices that they were changed, and reproducing the upstream NOTICE file's attributions in the distributor's own NOTICE, documentation, or a generated display.
- **C.** Filing a Contributor License Agreement with the upstream project before the modified files may be redistributed to anyone.
- **D.** Relicensing the three modified files under the GPL, since Apache-2.0 becomes a copyleft licence once any file is modified.

**Answer: B.** Section 4 conditions redistribution on carrying the licence text, marking modified files, retaining existing notices, and propagating an existing NOTICE file's attributions — obligations layered on top of, not replacing, the basic notice-retention condition MIT shares.

- A is wrong: Apache-2.0 section 4 adds modification-notice and NOTICE-propagation requirements that MIT's one-sentence condition does not have.
- C is wrong: A CLA governs contributing changes back to a project, not redistributing a downstream product built from its code.
- D is wrong: Apache-2.0 is not a copyleft licence at any point; none of section 4's conditions reach the licence of the derivative work as a whole.

### 19.

Why is a submitted pull request always a proposal rather than an applied change to the project?

- **A.** An outside contributor has no write access to the project's repository; the decision to merge belongs to someone who does, which is why review by that person is a structural step rather than a courtesy.
- **B.** Only maintainers, and never committers, are legally permitted to accept changes submitted by outside contributors.
- **C.** The contributor must first fork the project into an independent line of development before any change can be reviewed at all.
- **D.** Open source licences legally require every proposed change to pass a formal committee vote of the whole community before it may ever be merged into the codebase.

**Answer: A.** Mechanics differ by project, but the sequence is the same: raise or claim an issue, submit the change for review, and have someone with write access decide. The merge decision belongs to the project, not to the person proposing the change.

- B is wrong: Committers, who hold write access earned on merit, are the ones who ordinarily merge changes; the restriction is about access, not a legal distinction between roles.
- C is wrong: A platform fork used to open a pull request is a routine step ending in a merge upstream, not a permanent independent line of development.
- D is wrong: Licences say nothing about a project's review process; a merge decision is a matter of project governance, not a licence requirement.

### 20.

How does a Contributor License Agreement differ from a copyright assignment?

- **A.** A CLA grants the contributor write access to the repository, while a copyright assignment only grants them read access to it.
- **B.** A CLA must be signed before Apache-2.0 section 3's patent grant applies to any contribution, while copyright assignment bypasses that section entirely.
- **C.** A CLA grants the project a licence, often including patent rights, over the contribution, while the contributor keeps ownership; an assignment transfers ownership of the contribution outright.
- **D.** There is no real difference; both terms describe the identical transfer of copyright ownership from the contributor to the project.

**Answer: C.** A CLA is a grant of rights, not a transfer: it lets the project use, and often sublicense, a contribution while the contributor keeps ownership. Some projects use a Developer Certificate of Origin sign-off instead, asserting provenance rather than granting rights.

- A is wrong: Neither instrument grants repository access: the ASF, for one, requires a signed individual CLA before commit rights are given, but the rights themselves are conferred by the project on merit, not by the agreement.
- B is wrong: Section 3's patent grant is a term of the licence covering the project's code as distributed, not something a CLA switches on for individual contributions.
- D is wrong: This collapses a rights grant into an ownership transfer; the distinguishing fact is precisely that a CLA leaves ownership with the contributor.

### 21.

A developer modifies a GPLv3-licensed tool for internal use only, running it exclusively on the company's own servers with no copy ever leaving the building. What obligation does the GPL impose in this situation?

- **A.** The obligation to preserve the copyright notice throughout the internal build, exactly the way a permissive licence would require regardless of distribution.
- **B.** The obligation to publish the Corresponding Source the moment any modification is made, whether or not the modified program is ever distributed.
- **C.** The obligation to offer the Corresponding Source to anyone who interacts with it over a network, since the tool is reachable from other machines on-site.
- **D.** None, since the GPL's obligations attach to conveying a copy to someone else; running or modifying a work that is never conveyed is entirely unconditioned.

**Answer: D.** Copyleft's reciprocal obligation is a condition on an act of distribution, not something that spreads by contact. Modifying a covered program for internal use and never handing it to anyone obliges nothing at all.

- A is wrong: Copyleft's obligations are heavier than notice retention and, unlike a permissive licence, they trigger on distribution, not on the mere existence of a build.
- B is wrong: This is the "viral by contact" misreading the licence's own text rules out; obligations attach to conveying, not to modifying.
- C is wrong: That network trigger belongs to the AGPL's section 13, not the plain GPL, and nothing here describes remote users interacting with the tool.

### 22.

Critics describe copyleft as "viral." Which statement corrects that framing without denying that copyleft has real reach?

- **A.** The framing is accurate: any file merely stored alongside GPL code on the same disk becomes GPL-licensed regardless of whether either is distributed.
- **B.** Copyleft is a condition attached to the act of distributing a work, not something that spreads automatically by mere contact with the code.
- **C.** The framing is accurate only when the combined work is built with static linking rather than dynamic linking against the covered code.
- **D.** The framing is accurate: any product that once depended on a GPL library remains GPL-licensed permanently, even after the dependency is fully removed.

**Answer: B.** "Viral" is a pejorative, not a term of art, and it misdescribes the mechanism: copyleft is a condition on an act of distribution, triggered deliberately when a covered or combined work is conveyed to someone else.

- A is wrong: Storage proximity triggers nothing; only conveying a combined or modified work to someone else triggers the obligation.
- C is wrong: Linking mechanism can affect whether two programs form one combined work, but it does not make the underlying "spreads by contact" description accurate.
- D is wrong: The licence governs the work as conveyed; removing the dependency removes any basis for the obligation to have attached going forward.

### 23.

Why does Creative Commons itself recommend against using its licences for software?

- **A.** Because Creative Commons licences are fully compatible with every OSI-approved software licence, making the recommendation against them redundant rather than a real concern.
- **B.** Because content licensed under any Creative Commons variant can never be redistributed for commercial purposes.
- **C.** Because none of the Creative Commons licences, including the CC0 public domain dedication, are considered open at all.
- **D.** Its licences address neither source-code distribution nor patent rights, and most variants are not compatible with the major software licences.

**Answer: D.** Creative Commons licences were built for content rather than code and address neither source distribution nor patents, which is why the organisation itself steers software toward other licences and treats CC0 as the software-compatible exception.

- A is wrong: Compatibility is limited, not full — for example, only CC BY-SA 4.0 is one-way compatible with GPLv3, and most variants are not compatible with software licences at all.
- B is wrong: Only the NC (NonCommercial) variant restricts commercial use; several other Creative Commons variants permit it freely.
- C is wrong: CC0 is a genuine public domain dedication, generally accepted as GPL-compatible and acceptable for software, unlike the content-oriented CC licences.

### 24.

A developer downloads a dual-licensed library under its open source terms and wants to relicense their own unmodified copy for resale under separate commercial terms. May they?

- **A.** Yes, as long as they first sign a contributor licence agreement with the original project granting them the necessary rights.
- **B.** Yes, provided the new commercial terms remain compatible with the original open source licence the library was received under.
- **C.** No; only the copyright holder can offer a work under both an open source and a commercial licence, and a recipient who merely received the code under one of those licences cannot grant it under the other.
- **D.** Yes — dual licensing means the software has effectively entered the public domain for anyone who receives a copy under either of the two licences the rights holder chose to offer.

**Answer: C.** Dual licensing is offering the same code under two licences at once, and only the copyright holder — directly, or through contributor agreements it collects — can do it. A downstream recipient's copy stays under the terms it was received on.

- A is wrong: A CLA grants a project rights over a contribution; it does not hand a downstream recipient the rights holder's own relicensing authority.
- B is wrong: Compatibility between two licences does not create authority to relicense; that authority belongs to the copyright holder alone.
- D is wrong: Dual licensing changes nothing about the terms of the copy already received; it is not a route into the public domain for recipients.

### 25.

A community disagrees with a foundation-hosted project's technical direction and threatens to continue the code independently under new maintainers. Can the foundation or the original licence holder prevent this?

- **A.** No, but only because the community can click "fork" on the hosting platform, which merely creates a repository copy rather than exercising any legal right.
- **B.** Yes, since the foundation holds the project's trademark and can revoke the community's right to continue using the underlying code under any name.
- **C.** Yes, since the foundation sets the project's technical direction and can withdraw that direction from contributors it disagrees with.
- **D.** No: the licence itself guarantees the right to make and distribute derived works, so no licence holder or foundation can block a community from continuing the code independently.

**Answer: D.** The fork is the structural reason open source governance disputes have an exit: no licence holder, foundation, or vendor can prevent a community that disagrees with a project's direction from continuing the code themselves, though the fork must be renamed since trademarks stay with the original.

- A is wrong: A platform fork is a routine contribution step that ends in a merge upstream; the right being exercised here is the governance-sense fork, a permanent divergence.
- B is wrong: A fork does not inherit the project's trademark or name, but the code itself, under its licence, cannot be revoked from a fork that took a lawful copy.
- C is wrong: A foundation provides legal and governance infrastructure, not technical direction, which stays with the project's maintainers rather than the foundation itself.

### 26.

Which pairing correctly separates the two everyday meanings of the word "fork" in open source work?

- **A.** A platform fork is a server-side repository copy made as the first step of an ordinary contribution that ends in a merge upstream; a governance fork is a permanent divergence with its own maintainers and releases.
- **B.** A fork and a clone name the same operation; both create a server-side copy of a repository used to open a pull request.
- **C.** A platform fork requires a signed contributor licence agreement before it may be created, while a governance fork does not require one.
- **D.** A governance fork can only occur with the original project's explicit written permission, since the licence does not grant the right to fork automatically.

**Answer: A.** In the governance sense, forking is a deliberate, permanent split with independent maintainers; in day-to-day platform vocabulary, "fork" also names a server-side repository copy created as the first step of an ordinary contribution — the opposite outcome.

- B is wrong: Cloning copies a repository locally; forking creates a server-side copy, typically used when the contributor lacks write access to the original.
- C is wrong: Neither meaning of "fork" depends on a CLA; a CLA concerns contributing changes back, not the act of copying a repository.
- D is wrong: Open source licences grant the right to make and distribute derived works automatically; no separate permission from the original project is required.

### 27.

A company sells discs of a program for $20 each. Every buyer receives the right to run the program for any purpose, study and change its source, and redistribute copies, including modified ones. Does this satisfy the Free Software Foundation's four freedoms?

- **A.** No, because the Free Software Foundation and the Open Source Initiative maintain a single joint list of approved licences, and this vendor's terms were checked against the wrong organisation's separate criteria entirely.
- **B.** Yes — selling copies is unrestricted; only the enumerated freedoms to run, study, redistribute and modify decide the question, never the price charged.
- **C.** No, because charging money for the software directly conflicts with the word "free" in free software.
- **D.** Only if the buyer additionally signs an agreement promising not to resell the discs to anyone else.

**Answer: B.** The four freedoms concern rights, not cost. Selling copies violates nothing, and this licence grants freedoms 0 through 3 in full, so it qualifies as free software regardless of its $20 price.

- A is wrong: The FSF and OSI maintain separate lists against different texts; there is no single joint list to consult incorrectly.
- C is wrong: Free as in freedom, not price: freedom 2 and 3 protect redistribution, and nothing in the four freedoms bars a sale.
- D is wrong: No such additional agreement is part of the four freedoms; redistribution rights travel with the copy automatically.

### 28.

FOSS is used as a neutral umbrella term because two separate organisations judge overlapping sets of licences against different texts and for different reasons. Which pairing correctly describes the two?

- **A.** The Open Source Initiative argues from user freedom as an ethical position; the Free Software Foundation runs the review process behind the Open Source Definition's approved-licence list and publishes it on the Initiative's behalf.
- **B.** The Free Software Foundation argues from user freedom via the four freedoms; the Open Source Initiative argues the same licences on practical and development grounds via the Open Source Definition.
- **C.** The Software Package Data Exchange assigns identifiers to both organisations' approved licences, which is why their two lists match item for item.
- **D.** Free software and open source software are opposing camps whose licences reject and actively exclude one another.

**Answer: B.** FOSS exists precisely so a sentence can name both camps without taking a side: the FSF's ethical framing and the OSI's practical framing judge nearly the same licences against different documents, maintained by different bodies.

- A is wrong: This swaps the two organisations' roles and their defining documents entirely.
- C is wrong: SPDX assigns identifiers but does not decide either list, and the two organisations' lists overlap heavily without matching exactly.
- D is wrong: They are two framings that land on almost the same licences, not opposing or mutually exclusive camps.

### 29.

What does a neutral foundation such as the Linux Foundation or the Apache Software Foundation actually provide to a project it hosts?

- **A.** Legal entity status, stewardship of assets and trademarks, shared infrastructure, and governance rules — not technical direction, which stays with the project's own maintainers.
- **B.** Paid engineering staff, employed by the foundation itself, who write and maintain the code of each project it hosts.
- **C.** A guarantee that every contributor automatically becomes a committer with write access after their first merged change is accepted.
- **D.** Direct control over each hosted project's technical roadmap, exercised through decisions made by the foundation's board.

**Answer: A.** Neutral non-profits such as the Linux Foundation and Apache Software Foundation hold a project's assets, trademarks, and infrastructure so no single vendor controls it, while deliberately leaving technical direction to the project's own maintainers.

- B is wrong: Foundations do not staff their projects' development: the ASF states that all participants in its projects are volunteers and that nobody is paid by the foundation to do their job.
- C is wrong: Committer status is earned on merit within each project over time; a foundation does not grant it automatically after one contribution.
- D is wrong: A foundation holds assets and sets governance rules; the technical roadmap remains a decision for the project's own maintainers, not the board.

### 30.

The Linux kernel is released under which licence and version, and what does that precise designation prevent?

- **A.** LGPL-2.1-only, which is why proprietary drivers may link against the kernel without conveying their own source code.
- **B.** GPL-3.0-or-later, since all software released as part of the GNU Project defaults automatically to whichever licence version is currently the newest one published.
- **C.** GPL-2.0-only, not "version 2 or later", so the kernel's terms cannot be swapped for GPLv3's without the consent of every copyright holder involved.
- **D.** Whichever version happens to be compatible with the licences of the components that were most recently merged into the kernel tree.

**Answer: C.** The kernel is GPL-2.0-only, not "v2 or later" — a fact worth holding exactly, since it determines whether GPLv3 terms could ever apply and it is the concrete example the exam reaches for whenever it wants a copyleft licence.

- A is wrong: The kernel is licensed under the plain GPL, not the LGPL, and its one stated exception is the syscall note, which keeps GPL requirements off user-space programs that call the kernel rather than off drivers built into it.
- B is wrong: There is no such automatic default; the kernel's licence was fixed as GPL-2.0-only deliberately, and it has not moved to GPLv3.
- D is wrong: A project's own licence does not shift based on what gets merged into it; compatibility instead constrains what may be merged.

### 31.

A company distributes a modified GPLv2-only tool and is later sued by a contributor who alleges the tool infringes a patent covering that contributor's own submitted code. Under GPLv2 alone, what protection does the licence text itself give the company?

- **A.** The AGPL's network-interaction provisions, since GPLv2 incorporates AGPL section 13 by reference for any distributed, patent-affected work.
- **B.** The same implied patent licence GPLv3 carries, since both versions were published by the same organisation and are treated as legally identical on patents.
- **C.** Apache-2.0's patent-termination clause, invoked on the theory that a permissive licence's patent terms carry over to any GPLv2 work they are combined with.
- **D.** None from the licence text: GPLv2 contains no express patent grant and no patent-termination clause, and GPLv3 is the version that added both.

**Answer: D.** GPLv3 adds to GPLv2 an express patent grant and a cure provision for a terminated licence; GPLv2 has neither and terminates on violation with no cure clause, so the company's protection here is nothing that the GPLv2 text itself supplies.

- A is wrong: The AGPL is a separate licence with its own network trigger; GPLv2 does not incorporate any of its provisions by reference.
- B is wrong: Sharing a publisher does not make the two versions' terms identical; GPLv3 section 11 is an express patent grant that GPLv2's text never contains.
- C is wrong: Apache-2.0 section 3 terminates only 'patent licenses granted to You under this License', so it reaches works licensed under Apache-2.0 and gives no protection to a work distributed under GPLv2.

### 32.

How does the LGPL let a proprietary application link against a covered library without the whole application becoming GPL-licensed?

- **A.** It does not — linking a proprietary application against any LGPL library still requires the entire application to be released under the full terms of the GPL, exactly as with the plain GPL.
- **B.** It grants the exception only when the application is never offered as a network service, mirroring the AGPL's network trigger in reverse.
- **C.** It confines the same-licence condition to the library itself; the application may be conveyed under its own terms if users can relink against a modified library (LGPLv3 §4, or LGPL-2.1 §6).
- **D.** It removes copyleft obligations entirely, so the library itself may also be redistributed under proprietary terms once any application links to it.

**Answer: C.** Weak copyleft narrows the reciprocal obligation to a defined boundary. The LGPL confines it to the library, letting the linking application ship under its own terms once relink conditions are met, while the library's own code stays copyleft.

- A is wrong: That whole-work reach is precisely what strong copyleft does and weak copyleft is designed to avoid for the linking application.
- B is wrong: The LGPL's relinking condition has nothing to do with network offering; that concern belongs to the AGPL's separate section 13 trigger.
- D is wrong: Modifications to the library itself stay under the LGPL; only the surrounding application gains freedom from the same-licence condition.

### 33.

Why can MIT-licensed code be absorbed into a GPL-licensed project, while GPL-licensed code cannot be absorbed into an MIT-licensed one?

- **A.** MIT-licensed code is always written in fewer lines than GPL-licensed code, so it merges more easily into any codebase regardless of licence terms.
- **B.** The GPL only reaches code written after the licence's own effective date, so older MIT-licensed code already in a project is exempt from its terms.
- **C.** MIT's only condition, carrying the notice forward, can still be met once the combined work goes out under the GPL; the GPL requires the whole conveyed work to go out under the GPL, which an MIT-only licence cannot promise.
- **D.** Compatibility actually runs both directions equally; either licence can absorb the other as long as attribution notices are preserved throughout.

**Answer: C.** Compatibility is directional: permissive code can enter a copyleft project because its condition (carry the notice) survives the combination, while GPL code cannot enter a permissive project because the GPL's whole-work condition cannot be promised by permissive terms.

- A is wrong: Code length has nothing to do with legal compatibility; the direction is set by what each licence's conditions require of the combined work.
- B is wrong: The GPL's reach depends on how code is combined and conveyed, not on when the code was originally written.
- D is wrong: This is the assumption the directional rule exists to correct; the reverse direction fails because the GPL's whole-work condition cannot be satisfied under permissive terms.

### 34.

A shipped product combines only licences that are fully compatible with each other. Does that fact alone guarantee the product is compliant?

- **A.** Yes, since compatibility and compliance both refer to the same question of whether the combination is legally permitted.
- **B.** No. Compatibility asks whether the combination was legally permitted at all; compliance separately asks whether the obligations that combination triggered, such as notices and source offers, were actually discharged before shipping.
- **C.** Yes, provided the shipped artifact also includes a Software Bill of Materials listing every component it contains.
- **D.** Yes, because a compatible combination automatically satisfies every component licence's own notice, attribution, and source-offer requirements as an automatic side effect of the components being legally combinable in the first place.

**Answer: B.** Compatibility and compliance are routinely offered as each other's distractor. Compatibility asks whether the combination was permitted; compliance asks whether the obligations that combination triggered were actually met when the product shipped.

- A is wrong: They answer different questions: one is about whether the combination was allowed, the other about whether the resulting obligations were met.
- C is wrong: An inventory makes the obligations enumerable; it does not discharge any of them on its own.
- D is wrong: Compatibility says the combination is permitted; it does nothing to automatically assemble the notices each licence separately requires.

### 35.

A redistributor ships a modified BSD-3-Clause utility and, in the product's marketing materials, names the original author's company as an official partner to help promote the product. Which clause does this violate?

- **A.** Section 4's NOTICE-file propagation requirement, since the marketing materials never reproduced an upstream NOTICE file's attributions.
- **B.** None — BSD-3-Clause has no restriction on how a redistributor markets a derived product, only on copying the underlying code itself.
- **C.** The requirement that any derived product be licensed under terms compatible with the original before it may be sold commercially.
- **D.** The non-endorsement clause: using the copyright holder's or contributors' names to endorse a derived product without specific prior written permission is exactly what BSD-3-Clause's third clause forbids.

**Answer: D.** BSD-3-Clause adds a third clause on top of BSD-2-Clause's notice, conditions and disclaimer requirements, forbidding use of the copyright holder's or contributors' names to endorse derived products without permission — which is exactly what this marketing use does.

- A is wrong: BSD has no NOTICE-file concept at all; that requirement belongs to Apache-2.0, a different permissive licence.
- B is wrong: The non-endorsement clause exists precisely to restrict this kind of marketing use of the original author's name.
- C is wrong: BSD imposes no such reach into the derivative's own licence; that would be a copyleft-style condition BSD does not carry.

### 36.

Which condition, if any, does the plain MIT licence impose regarding patents held by the code's contributors?

- **A.** An implied patent licence limited to claims necessarily infringed by the contributor's own code, mirroring Apache-2.0 section 3's scope.
- **B.** A reciprocal obligation requiring any patented derivative work to be licensed back to the community under MIT's own terms.
- **C.** None, because MIT says nothing about patents at all, which is the specific difference Apache-2.0's express patent grant addresses.
- **D.** The identical patent-litigation-termination clause Apache-2.0 carries, since both licences are commonly grouped together as the permissive family.

**Answer: C.** Neither MIT nor any BSD variant grants patent rights, requires a NOTICE file, or requires modified files to be marked — a difference from Apache-2.0, not a reassurance, since it means patent risk is simply left unaddressed.

- A is wrong: MIT contains no patent language at all, implied or otherwise; that scoped grant is Apache-2.0's own express provision.
- B is wrong: That reach-into-the-derivative pattern describes copyleft reasoning, which MIT, as a permissive licence, does not carry.
- D is wrong: Being grouped in the same permissive family does not make MIT's terms identical to Apache-2.0's; the termination clause is specific to Apache-2.0's section 3.

### 37.

In a typical open source project, what separates a contributor from a committer?

- **A.** A contributor proposes changes; a committer has been granted write access to the repository, earned on merit, and is the one who can actually merge them.
- **B.** A contributor works only through a mailing list, while a committer works only through pull requests on a hosting platform.
- **C.** A committer must be a paid employee of the foundation that hosts the project, while a contributor is always an unpaid volunteer with no formal ties.
- **D.** Seniority at the contributor's own outside employer determines who becomes a committer, independent of the actual contributions made to the project.

**Answer: A.** Responsibility increases along the chain from user to contributor to committer to maintainer, and it is earned by merit within the project. The concrete line between contributor and committer is write access to merge changes.

- B is wrong: Mechanics differ by project, not by role; either mechanism can be used by a contributor or a committer, depending on the project's workflow.
- C is wrong: Committer status is earned by merit and demonstrated contribution, not by employment status at the hosting foundation.
- D is wrong: The chain is earned by merit within the project, not by outside seniority or employment, which is exactly what the role structure is designed to keep separate.

### 38.

What does the Open Source Initiative do?

- **A.** It stewards the ten-criterion Open Source Definition and runs the review process that decides which licences are approved against it.
- **B.** It certifies individual software projects as open source directly, inspecting each maintainer's published code before granting the certification.
- **C.** It holds trademarks and infrastructure on behalf of hosted projects, in the manner of a neutral foundation.
- **D.** It is the body that maintains the Free Software Definition and the enumeration of the four freedoms.

**Answer: A.** The OSI approves licences against the Open Source Definition's ten criteria; it does not certify projects, hold assets for foundations, or maintain the Free Software Foundation's separate four-freedoms definition.

- B is wrong: The OSI approves licences, not projects; a project is open source because the licence it uses is OSI-approved.
- C is wrong: Holding assets and infrastructure for hosted projects is what a foundation such as the Linux Foundation does, not the OSI's role.
- D is wrong: That document and its four freedoms belong to the Free Software Foundation, a separate organisation with its own criteria.

### 39.

A vendor publishes a product's complete source code in a public repository, but the licence prohibits offering the software as a competing hosted service. Under the Open Source Definition, is this open source software?

- **A.** No; restricting a field of endeavour such as competing commercial use fails OSD 6, regardless of how visible the source is.
- **B.** Yes, because publishing the source publicly is the one thing proprietary software withholds, and this vendor did not withhold it.
- **C.** No, but only because the licence never uses the phrase "free software" anywhere in its text.
- **D.** Yes, since the Open Source Definition is only concerned with whether the source is visible to the public.

**Answer: A.** The Open Source Definition's ten criteria decide the question, not marketing or source visibility. A no-competing-use clause restricts a field of endeavour (OSD 6), which disqualifies the licence however openly the code is published.

- B is wrong: Source visibility alone settles nothing; proprietary software can also be source-available while still reserving redistribution.
- C is wrong: The Open Source Definition does not require any particular wording; it is judged on what rights the licence grants.
- D is wrong: This is the reasoning the field-of-endeavour criterion exists to rule out; visibility is necessary but nowhere near sufficient.

### 40.

Product A is sold for a subscription fee, but its licence grants every recipient the source code plus the rights to modify and redistribute it, including modified versions. Product B is downloadable at no cost, but its licence forbids redistributing any modified copy. Which product is open source software?

- **A.** Product B, because the Free Software Foundation's definition of "free" is about price rather than the rights a licence happens to grant.
- **B.** Neither, since charging money for a copy disqualifies a licence from open source status under any of the ten criteria.
- **C.** Product A, since price is irrelevant to the definition and its licence grants the modification and redistribution rights the definition requires.
- **D.** Product B, because barring redistribution of modified copies is simply a stricter, more protective variant of the same open source terms rather than a different category of licence entirely.

**Answer: C.** Two of the ten OSD criteria decide most such questions: free redistribution without a required royalty, and permission to make and distribute derived works. Product A satisfies both; Product B fails the second regardless of its zero price.

- A is wrong: "Free" in free software means liberty, not price, so a zero-cost download that bars redistribution is neither free software nor open source.
- B is wrong: OSD 1 explicitly permits selling open source software as part of an aggregate distribution; charging is not disqualifying.
- D is wrong: Barring redistribution of derived works removes exactly the right OSD 3 requires; it is a disqualifying restriction, not a stricter variant.

### 41.

A startup embeds a lightly modified MIT-licensed parsing library inside its closed-source commercial product and ships only a compiled binary. What does the MIT licence require of the startup?

- **A.** That the modified parsing library, and the entire product it has been combined into, be released under the MIT licence as well.
- **B.** Nothing at all, since permissive licences are widely understood to impose no conditions of any kind on anyone who reuses or redistributes the code.
- **C.** Only that the copyright notice and permission notice travel with the copies distributed; nothing about the product's own source or its licence.
- **D.** That the startup grant every recipient an express, litigation-terminating patent licence covering its own modifications to the library.

**Answer: C.** MIT's conditions are of one kind: preserve the copyright notice, licence text and disclaimer. Nothing in it reaches the licence of the surrounding work, so the startup may ship a closed binary with nothing published but an attribution file.

- A is wrong: That reciprocal, whole-work reach is copyleft's defining feature; a permissive licence conditions nothing about the derivative's own licence.
- B is wrong: Permissive is not obligation-free: stripping the notice out of an MIT-licensed file is the standard permissive-licence violation.
- D is wrong: MIT says nothing about patents at all; that express patent grant is Apache-2.0's addition, not MIT's.

### 42.

Which single fact separates a permissive licence from a copyleft one?

- **A.** Whether the licence permits commercial use at all — permissive licences allow it freely and copyleft licences forbid it outright in every circumstance.
- **B.** Whether the licence is compatible with the GPL — permissive licences are always fully compatible with it, and copyleft licences are never compatible with one another at all, under any circumstances.
- **C.** Whether the licence has been approved by the Open Source Initiative — permissive licences are approved by it and copyleft licences never are.
- **D.** Whether the licence conditions the licence of a derivative work: a permissive licence does not, while a copyleft licence requires the same terms to carry forward on distribution.

**Answer: D.** The separating axis is whether the licence says anything about the licence of what you build: copyleft imposes the same terms on the distributed derivative, and permissive imposes only attribution. Neither commercial use nor OSI approval status decides it.

- A is wrong: Copyleft does not forbid commercial use or charging for copies; it constrains what is passed to recipients, not whether money changes hands.
- B is wrong: Compatibility varies by specific licence and version and is not a fixed permissive-versus-copyleft rule.
- C is wrong: Both families include OSI-approved licences; approval status is not what separates them.

### 43.

A company distributes a zero-cost "community edition" of its database engine. The source is not published, and the licence permits running the software but forbids modifying or redistributing it. What is this software?

- **A.** Open source software offered as freeware, since no fee is charged for downloading a copy and the vendor markets it as free to use for everyone.
- **B.** Proprietary software: price is irrelevant here, and the licence withholds the source and reserves modification and redistribution rights to the vendor.
- **C.** Neither open source nor proprietary, since freeware is understood to be its own separate licensing category carrying no legal reservation of rights of any kind at all.
- **D.** Source-available software, since the vendor retains the option to publish the source later without changing any of the licence terms.

**Answer: B.** Copyright reserves all rights to the author by default; this licence gives away only the right to run a copy, which is the proprietary pattern regardless of the zero price attached to it.

- A is wrong: Zero cost is not evidence of open source status; the licence still withholds source and reserves modification and redistribution.
- C is wrong: Zero cost is a price point, not a licence category; a program whose users lack the freedoms to study, modify and redistribute it is nonfree however little it costs.
- D is wrong: Source-available describes a licence where the code is published; nothing here has been published, so the label does not apply.

### 44.

A vendor publishes a product's full source code publicly, but its licence bars any commercial use or competing service built from it. How should this licence be classified?

- **A.** Open source, since the Open Source Definition is only concerned with whether the source is available for anyone in the public to read at will.
- **B.** Proprietary only if the vendor also charges a fee for access; a free download of visible source is automatically considered open source regardless of any other restriction in the licence text.
- **C.** Undetermined until the licence is checked for compatibility against whatever other components it might later be combined with in a shipped product.
- **D.** Proprietary. Publishing the source does not grant the field-of-endeavour freedom the Open Source Definition requires, so the licence remains proprietary despite the visible code.

**Answer: D.** Source visibility satisfies nothing on its own. A no-competing-use clause restricts a field of endeavour and removes the licence from open source status, leaving a source-available product that is proprietary in the licensing sense that matters.

- A is wrong: Readability is necessary but not sufficient; the OSD also requires derivative-work rights and no field-of-endeavour restriction.
- B is wrong: Price plays no role in this classification; the disqualifying feature is the field-of-endeavour restriction, not any fee.
- C is wrong: Compatibility with other components is a separate question from whether this licence alone meets the Open Source Definition.

### 45.

What does a Software Bill of Materials establish about a shipped product, on its own and without any further work?

- **A.** That the product is licence-compliant, since every listed component's obligations have already been checked as part of producing the inventory.
- **B.** That every listed component's licence is compatible with every other one, since an incompatible combination could not have been assembled and inventoried.
- **C.** That the product is free of known vulnerabilities, since the standard inventory formats include a vulnerability scan by default.
- **D.** An inventory of the product's components, their versions and their dependency relationships — it makes licence and vulnerability questions answerable, but it answers none of them by itself.

**Answer: D.** An SBOM is an inventory, increasingly required for supply-chain transparency. It is not itself a compliance artifact and not a vulnerability scan: it makes licence and CVE questions answerable, and resolves neither on its own.

- A is wrong: Producing an inventory does not discharge any licence obligation; compliance still requires separately meeting each component's own terms.
- B is wrong: An SBOM records what was shipped; it does not verify that the components were legally combinable in the first place.
- C is wrong: An SBOM is an inventory, not a vulnerability scan; it makes CVE questions answerable against the listed versions but performs no scan itself.

### 46.

Why does shipping a binary-only build of a GPL-licensed program create a compliance problem that shipping the same binary-only build of an MIT-licensed program does not?

- **A.** The GPL forbids compiling the covered program into a binary form in the first place, so any binary build already violates it.
- **B.** MIT requires a NOTICE file to accompany every binary it ships to a recipient, a requirement the GPL text does not carry at all.
- **C.** Both licences impose exactly the same source obligation on any binary-only release, since every open source licence treats compiled and source forms as legally identical in every respect.
- **D.** The GPL obliges anyone who conveys object code to also make its Corresponding Source available to recipients; permissive licences impose no source obligation at all.

**Answer: D.** Several licences attach obligations specifically to distributing the binary form. The GPL's Corresponding Source requirement is triggered by conveying object code; permissive licences require only that notices travel with whatever form is shipped.

- A is wrong: The GPL does not forbid compiling; it conditions distributing the resulting object code on offering the Corresponding Source.
- B is wrong: MIT has no NOTICE-file concept; that requirement belongs to Apache-2.0, not to MIT or to the GPL.
- C is wrong: This is the assumption the distinction exists to correct: only copyleft licences attach an obligation to the binary form.

### 47.

A story's own acceptance criteria are all met, but the team's automated test suite, required by their standing quality bar, was never run against it. What happens to the story, and which of the two commitments governs the outcome?

- **A.** It is accepted, since meeting its own acceptance criteria is what the Scrum Guide itself defines as done.
- **B.** It is accepted, because acceptance criteria and the Definition of Done are simply two names for the same check, applied at whatever level of detail the team happens to prefer from one item to the next.
- **C.** It is accepted at the Sprint Review, where the Definition of Done can be applied retroactively if needed.
- **D.** It is not part of the Increment and returns to the Product Backlog — the Definition of Done, the team-wide bar every item must meet, governs here, not the story's own criteria.

**Answer: D.** Acceptance criteria are per-item conditions agreed before work starts; the Definition of Done is the team-wide quality bar every item must meet uniformly. An item can satisfy every one of its own criteria and still fail the Definition of Done, and the Guide's answer is that undone work is not part of the Increment — it returns to the Product Backlog.

- A is wrong: This inverts which commitment the Scrum Guide actually defines — it defines the Definition of Done, not acceptance criteria, as a Scrum element.
- B is wrong: The two differ in scope — one item's criteria versus every item's uniform bar — and treating them as synonyms is the exact confusion this comparison tests.
- C is wrong: Undone work cannot even be presented at the Sprint Review; there is no retroactive application of the Definition of Done there.

### 48.

A Product Owner wants to change one story's acceptance criteria after the developers have already started implementing it. What has this change lost?

- **A.** Its function, since criteria agreed before work starts exist to make 'complete' decidable in advance, and changing them mid-implementation reopens what should already be settled.
- **B.** Nothing — acceptance criteria may be revised by the Product Owner at any point right up to the Sprint Review, since they belong to the Product Owner and can be reopened whenever new information arrives.
- **C.** Nothing — only the Definition of Done needs to be fixed in advance, not per-item criteria.
- **D.** Its status as a formal change, since acceptance criteria are never routed through change control.

**Answer: A.** Acceptance criteria are meant to be agreed before work starts and stated as pass/fail conditions, precisely so that whether an item is complete does not have to be argued about afterward. Changing them once implementation is underway removes the property that made them useful in the first place.

- B is wrong: Revising criteria whenever convenient defeats their purpose, which is to fix in advance what 'complete' means for that item.
- C is wrong: Both are meant to be agreed before the relevant work begins; the Definition of Done being team-wide doesn't make per-item criteria any less settled in advance.
- D is wrong: This item is about criteria drafted for one story, not about routing a scope change through the project's formal change process.

### 49.

Team A ships a small working increment every two weeks and revises its plan as customers respond. Team B produces detailed documentation at every phase gate and finishes one large release after nine months. Which Agile Manifesto value does Team A's practice most directly express, and how does that differ from a waterfall judgement about the same scenario?

- **A.** Following a plan over responding to change, since Team A still plans out each two-week cycle in advance.
- **B.** Responding to change over following a plan — the Manifesto ranks it above a fixed plan without abolishing planning, whereas a waterfall judgement would instead ask only whether each of Team B's phases was signed off before the next began.
- **C.** No value at all, since agile teams are defined by having no plan and no fixed structure, which is why a team practising it is expected to decide everything moment to moment with nothing written down in advance, unlike a team following a documented methodology.
- **D.** The event calendar of daily standups and sprint reviews, since that is what the Manifesto actually specifies.

**Answer: B.** Agile's fourth value statement ranks responding to change above following a fixed plan, without abolishing planning; Team A revises what it does as it learns. Waterfall instead evaluates whether each phase completed and was signed off before the next began, a sequencing judgement, not a values one — conflating the two levels is the common mistake.

- A is wrong: Team A plans each cycle, but the point of the practice is that the plan is revised as more is learned, not followed at the expense of change.
- C is wrong: The Manifesto states the lower-ranked item still has value; 'no plan at all' is the misreading it explicitly warns against.
- D is wrong: Standups and sprint reviews belong to Scrum, one framework beneath agile's values — the Manifesto itself specifies no events.

### 50.

A manager says: 'We hold a daily standup and a two-week sprint, so we're agile.' Which distinction does this statement collapse?

- **A.** It collapses the Sprint Review with the Sprint Retrospective, since both happen within the same two-week cycle and are often scheduled back to back on the calendar.
- **B.** Nothing — attending the prescribed ceremonies is sufficient to be agile by definition.
- **C.** Kanban's continuous flow with Scrum's fixed-length iterations.
- **D.** The value layer (agile, the Manifesto's principles) into the framework layer (Scrum, one particular way of operationalising them).

**Answer: D.** Agile is a set of values and principles; Scrum is one framework that operationalises them, with its own accountabilities, events and artefacts. Substituting 'we run Scrum's ceremonies' for 'we hold agile's values' is the examinable move — a team can hold every event and still violate the principles beneath them.

- A is wrong: The statement doesn't mention the Review or Retrospective specifically, so that particular pair isn't what's being confused here.
- B is wrong: The Manifesto is a statement of values; attending meetings is a mechanism, and mechanism without the underlying preference doesn't establish it.
- C is wrong: The statement describes Scrum's iteration, not Kanban's flow, so this pairing isn't the confusion in play.

### 51.

A team's change control process has rejected every request submitted to it for the past six months. A stakeholder complains this proves the process is working. What is the flaw in that reasoning, and how would the same six months look if scope creep, not change control, were actually happening?

- **A.** There's no flaw — a change control process exists specifically to say no to requests.
- **B.** A process that only ever rejects is being used as a barrier, not a decision procedure; under creep instead, there would be no rejected requests at all — informal additions would simply accumulate outside the process.
- **C.** The flaw is that six months is too short a period to judge whether change control is functioning.
- **D.** The flaw is that rejected requests should still have moved the project's budget baseline even when refused, so the sponsor can see the cumulative cost of every request ever considered, approved or not, across the whole project.

**Answer: B.** Change control is a decision procedure, not a mechanism for saying no; its purpose is to force an explicit answer to what else must give if scope is added, including approving worthwhile changes. An all-rejection record suggests the process is being misused as a blanket refusal. Scope creep, by contrast, leaves no rejected requests behind at all — it accumulates from additions that never went through the process to be rejected or approved.

- A is wrong: The purpose is to force the trade-off question to be answered explicitly, which includes approving changes that are genuinely worth their cost, not just refusing all of them.
- C is wrong: The stated period isn't the issue; an all-rejection record is suspicious regardless of how long it has run.
- D is wrong: Rejected requests are recorded so the same request doesn't reappear informally, but a rejection specifically does not update the baseline; only an approval does.

### 52.

A change request is assessed and approved by the project sponsor, but nobody updates the schedule or budget baseline afterward. What is the practical effect?

- **A.** None — approval by the sponsor is sufficient on its own to make the change fully controlled.
- **B.** It only becomes a problem at project closure, when the missing update is caught during acceptance review, since that is the point at which the whole plan is finally checked against reality.
- **C.** Because the plan still shows the old scope, the approved change behaves exactly like creep, and the extra work is absorbed silently rather than tracked.
- **D.** It only becomes a problem if the communication plan fails to notify the delivery team of the approval.

**Answer: C.** Approval is only part of a controlled change; on approval, the scope, schedule and cost baselines are meant to be updated together and the decision communicated. Skip the baseline update and an approved, assessed change produces exactly the same symptom as creep — a plan that still shows the original scope while the team quietly absorbs more.

- A is wrong: Approval alone doesn't complete the process; the Guide's account of change control requires the baseline to be updated as well, not just a decision recorded.
- B is wrong: The mismatch causes trouble immediately, in every status report and schedule check between now and closure, not only when acceptance is reviewed.
- D is wrong: Notifying the delivery team doesn't substitute for the plan itself reflecting the new scope; the baseline, not just awareness, is what's missing.

### 53.

An auditor has high influence over a project's release but low day-to-day interest in its progress. What should the communication plan record for her?

- **A.** Inclusion in the delivery team's daily coordination event, since high influence means she needs the same level of detail as the team, regardless of how much day-to-day interest she actually has.
- **B.** Nothing, since her low day-to-day interest means she does not need to be tracked as a stakeholder at all.
- **C.** Read access to the issue tracker in place of any scheduled communication.
- **D.** A summary delivered at phase boundaries, plus immediate notification if anything breaches a defined threshold — matched to her influence and interest, not to the delivery team's daily cadence.

**Answer: D.** A communication plan turns stakeholder analysis into action: each group is mapped to a content level, a frequency and a channel matched to how much influence and interest they have. High influence and low day-to-day interest is the textbook case for periodic summaries at phase boundaries plus immediate notice of anything crossing a defined threshold, not daily detail or unscheduled browsing.

- A is wrong: Daily detail suits the delivery team's own coordination need, not a reviewer whose interest is low day to day despite her high influence over release.
- B is wrong: Influence alone is enough to make someone a stakeholder; low day-to-day interest changes what she's sent, not whether she's tracked.
- C is wrong: Read access to a ticket system isn't a decided content level, frequency or channel — it substitutes browsing for the deliberate plan the practice calls for.

### 54.

A three-day task not on the critical path is shortened to one day. What happens to the project's finish date?

- **A.** Nothing, given that only the longest chain of dependent tasks determines the earliest possible finish, and this task isn't part of it.
- **B.** It moves the finish date earlier, since any task shortened anywhere in the schedule speeds up the whole project.
- **C.** It moves the finish date, because shortening any bar on a Gantt chart shifts every bar that comes after it.
- **D.** It moves the finish date, since shortening a task also shrinks its parent grouping in the work breakdown structure, and a smaller parent should logically finish sooner than before.

**Answer: A.** The critical path is the longest chain of dependent tasks through the schedule, and its length sets the earliest possible finish. 'Critical' is a statement about duration and float, not importance or difficulty — shortening a task that isn't on that chain typically buys no time, which is the discrimination this question shape is built to test.

- B is wrong: Only tasks on the critical path affect the finish date; shortening others usually buys no time at all.
- C is wrong: A Gantt chart is a display of the schedule, not the mechanism that determines the finish date — that mechanism is which chain of dependencies is longest.
- D is wrong: The work breakdown structure has no time axis and no bearing on the schedule's finish date at all.

### 55.

An organisation has a company-wide Definition of Done. One Scrum Team, under schedule pressure, proposes dropping the peer-review requirement for its own product only. Is that allowed?

- **A.** Yes, since each Scrum Team owns its own Definition of Done and may adjust it whenever circumstances demand, provided the change is agreed within the team before the next Sprint begins.
- **B.** No. A team-level Definition of Done can only be stricter than an organisational standard where one exists, never weaker.
- **C.** Yes, provided the dropped requirement is logged as an accepted risk.
- **D.** Only if the change is approved through the project's formal change control process.

**Answer: B.** If the organisation has a Definition of Done as a standard, every Scrum Team must follow it as a minimum, and a team's own definition can only be stricter, never weaker. Dropping a requirement under schedule pressure is exactly the quiet relaxation the commitment exists to prevent.

- A is wrong: Team ownership of the Definition of Done applies when no organisational standard exists; here one does, and it sets a floor, not a suggestion.
- C is wrong: Logging the gap as a risk doesn't change the rule that an organisational minimum cannot be relaxed by a single team.
- D is wrong: The Definition of Done is a Scrum commitment governed by the Guide's own rule, not a project scope item that change control approves or rejects.

### 56.

A feature works and demonstrates cleanly, but the runbook required by the Definition of Done was never written. What happens at the Sprint Review?

- **A.** It is presented with a note that documentation is pending, since a working demo satisfies the Definition of Done on its own, and paperwork can reasonably follow later.
- **B.** It is presented, and the missing runbook becomes an agenda item for the Sprint Retrospective instead.
- **C.** It is presented, since the feature's own acceptance criteria were met even though the Definition of Done was not.
- **D.** It cannot be presented at the Sprint Review, because work that hasn't met the Definition of Done isn't part of the Increment and returns to the Product Backlog.

**Answer: D.** The Definition of Done is a commitment attached to the Increment, and work that doesn't meet it is not part of that Increment — it cannot be released or even presented at the Sprint Review, and returns to the Product Backlog. A working demo is not the same as meeting every element of the standard, including documentation the team has committed to.

- A is wrong: Working software alone doesn't satisfy the Definition of Done when it explicitly includes documentation such as the runbook.
- B is wrong: Whether the item can be presented is settled before the Review happens; the Retrospective addresses process, not this item's admission to the Review.
- C is wrong: Meeting a story's own criteria doesn't substitute for the team-wide Definition of Done, which is the standard actually being missed here.

### 57.

A schedule line reads 'Runbook accepted — 2 weeks'. A reviewer flags it. What is wrong with calling that line a milestone, and how does the objection differ from a question about the triple constraint?

- **A.** A milestone conventionally carries zero duration, so a two-week span is a task or phase mislabelled — the triple constraint, by contrast, is about trading scope, time and cost against each other, not sorting schedule items by type.
- **B.** The line is fine as a milestone; the real issue is that adding two weeks to it silently moved the schedule leg of the triple constraint without anyone formally agreeing to that trade-off in advance, which is a wholly separate kind of oversight from how the line happened to be labelled.
- **C.** Milestones cannot appear on a schedule at all — only bars with durations, as on a Gantt chart, are legitimate schedule entries.
- **D.** The label is correct, since 'accepted' items are always logged as milestones however long the acceptance activity takes.

**Answer: A.** A milestone marks an instant, conventionally with no duration, effort or cost of its own; a schedule line carrying a duration is a task or a phase, however it is labelled. That is a different kind of error from a triple-constraint question, which asks what trades off against what when scope, time or cost changes — sorting deliverables and milestones by type is a categorisation question, not a trade-off question.

- B is wrong: This treats the entry as already correct and reframes the objection as a scheduling trade-off, which sidesteps the actual defect in the label.
- C is wrong: Milestones do appear on schedules — as zero-duration markers — so absence from the schedule isn't the objection here.
- D is wrong: Duration is exactly what disqualifies the entry as a milestone; the acceptance label alone does not exempt it.

### 58.

A migration project's status report lists: 'signed-off design', 'pilot batch accepted', 'base image', and 'bulk migration complete'. Which pair are deliverables rather than milestones?

- **A.** Signed-off design and bulk migration complete, because both appear as work packages in the work breakdown structure.
- **B.** Signed-off design and base image, both of them tangible artefacts the project produced and handed over.
- **C.** Pilot batch accepted and bulk migration complete, since both are confirmed during project closure.
- **D.** All four, since anything worth putting in a status report counts as a deliverable.

**Answer: B.** A deliverable is a tangible output — a document, an image, a migrated fleet. A milestone is a marked point signifying something is now true, typically carrying no duration of its own. 'Signed-off design' and 'base image' are things that exist; 'pilot batch accepted' and 'bulk migration complete' are checkpoints, not artefacts.

- A is wrong: Work packages are units of the decomposition, not the test for whether an item is a deliverable; 'bulk migration complete' reads as an event, not an artefact.
- C is wrong: Both of those read as checkpoints — 'accepted' and 'complete' — not as artefacts that were produced, and closure confirms acceptance of deliverables rather than defining what one is.
- D is wrong: Status-report visibility doesn't distinguish the two; 'pilot batch accepted' and 'bulk migration complete' are events, not things produced.

### 59.

A manager tells a team to 'raise your velocity next Sprint.' Why is that instruction self-defeating in a way the exam likes to test?

- **A.** It isn't self-defeating — velocity is an objective measure of output, so raising it means the team genuinely produced more useful work than it did in any of its previous Sprints.
- **B.** It's self-defeating because velocity is set by the Product Owner, not by the Developers who do the estimating.
- **C.** Velocity is denominated in the team's own relative units, so it can be inflated by estimating the same work as larger without delivering any more of it.
- **D.** It's self-defeating because velocity can only be measured once a Sprint has been extended past its fixed length.

**Answer: C.** Velocity is the amount of work a team completes per Sprint, denominated in the team's own relative units and used to forecast, not to score productivity. A team told to raise it can do so by inflating estimates without delivering anything more, because nothing external calibrates the unit — and velocity figures aren't comparable between teams for the same reason.

- A is wrong: Velocity is a forecasting input calculated from past Sprints, not an objective productivity score, which is exactly why the instruction backfires.
- B is wrong: The Developers who do the work are responsible for sizing it; the Product Owner may help with trade-offs but doesn't set velocity.
- D is wrong: Velocity is calculated from completed work per Sprint at its normal fixed length; extending the Sprint isn't a precondition for measuring it.

### 60.

Which single feature distinguishes a Gantt chart from a work breakdown structure?

- **A.** The Gantt chart shows what work is in scope, while the work breakdown structure shows when it happens, since one lists tasks and the other arranges them on a calendar.
- **B.** Detail level — a Gantt chart is simply a more detailed version of the same hierarchy the work breakdown structure shows.
- **C.** The Gantt chart shows the critical path, while the work breakdown structure shows every possible path through the schedule.
- **D.** The time axis, since a Gantt chart plots tasks against dates and shows durations and dependencies, which the work breakdown structure has none of.

**Answer: D.** A Gantt chart is a bar chart of tasks against time, showing duration and, as usually drawn, dependencies — associated with plan-driven scheduling. A work breakdown structure decomposes the deliverable hierarchically and has no time axis at all; that absence is the entire basis of the comparison.

- A is wrong: This reverses the two — the work breakdown structure shows what is in scope, and the Gantt chart is what shows when things happen.
- B is wrong: The two aren't the same hierarchy at different resolutions; one has no time axis and the other is built around one.
- C is wrong: A work breakdown structure has no paths or dependencies to compare against; a Gantt chart can display the critical path, but that isn't the axis separating the two artefacts.

### 61.

A vendor missed a delivery date last week. Should that be logged as a risk or as an issue?

- **A.** An issue, as it has already happened and needs resolving and escalating, unlike a risk, which is an uncertain future event assessed for likelihood and impact.
- **B.** A risk, since the vendor might miss further deadlines going forward, and treating the pattern as an ongoing risk keeps the team focused on preventing a recurrence rather than dwelling on the past.
- **C.** A risk, because it should be scored for likelihood and impact before any action is taken.
- **D.** Neither — it should only be raised through the communication plan's escalation path.

**Answer: A.** Issue tracking records work and defects, each with an identifier, an owner and a state, so status is visible without asking. An issue is something that has already occurred and needs resolving; a risk is an uncertain future event assessed for likelihood and impact. A missed delivery date last week has already happened, so it belongs in the tracker as an issue.

- B is wrong: Concern about a future recurrence doesn't change what already happened; this specific event needs resolving now, which is what makes it an issue.
- C is wrong: There's nothing left to assess for likelihood; the event already occurred, and scoring likelihood and impact applies to risks, not to something that has happened.
- D is wrong: The communication plan governs who is told and when, not where the item itself is recorded; it belongs in the tracker regardless of who is escalated to.

### 62.

A support team puts a board with To Do, Doing and Done columns in front of its work and calls the practice Kanban. What is missing from that claim, and what would a Scrum team have instead of the missing piece?

- **A.** Explicit work-in-progress limits, the mechanism that actually defines Kanban; a Scrum team instead bounds work with a fixed-length Sprint and a Sprint Goal.
- **B.** A defined Product Owner role, since Kanban requires one of its own just as Scrum does.
- **C.** Nothing is missing — a board with columns is what Kanban means in practice, and the columns alone are what visualises the flow of work through each stage of the process for the whole team to see.
- **D.** A velocity figure, since both Kanban and Scrum teams are required to forecast from one.

**Answer: A.** Kanban's defining mechanism is the explicit work-in-progress limit per stage, which turns the board into a pull system. A board with columns and no limits constrains nothing. Scrum instead bounds a batch of work with the fixed-length Sprint and its Sprint Goal — the two frameworks limit different things: how much is in flight at once, versus how long a batch may run before inspection.

- B is wrong: Kanban defines no accountabilities of its own; existing roles continue, so a missing Product Owner isn't the gap here.
- C is wrong: A board with columns is not what makes the practice Kanban — the Kanban Guide explicitly distinguishes a Kanban board from practising Kanban, and the limits are the difference.
- D is wrong: Kanban's characteristic measures are lead time, delivery rate and WIP, not velocity, which is a Scrum-adjacent convention.

### 63.

A team takes unplanned production incidents all day and would break a Sprint Goal at the first outage. Which practice fits that pattern, and what should it track instead of a burndown chart?

- **A.** Scrum, run with very short one-day Sprints to absorb the unpredictability.
- **B.** Kanban, but it should still track a burndown chart since that is how all agile teams measure progress.
- **C.** Kanban, tracking lead time and delivery rate as its flow measures rather than a Sprint's burndown.
- **D.** Kanban, tracking the team's risk register instead of a burndown chart.

**Answer: C.** A fixed Sprint Goal breaks the moment an unplanned incident forces reprioritisation, which is why interrupt-driven work is the standard case for Kanban's continuous flow instead. Its characteristic measures follow from that flow view: lead time, the time an item takes end to end, and delivery rate, the count completed per unit of time, not a burndown, which is tied to a Sprint's timebox.

- A is wrong: Committing to even a one-day goal still breaks at the first unplanned incident; the fit is continuous flow, not a shorter timebox.
- B is wrong: A burndown is a Scrum-adjacent forecasting convention tied to a Sprint Goal; it doesn't fit a practice with no fixed iteration.
- D is wrong: A risk register tracks uncertain future events, not the flow of work already in progress — it isn't Kanban's characteristic measure.

### 64.

A team ships the first version of a feature with reduced test coverage and no documentation, in order to hit a deadline sooner. Is that an MVP?

- **A.** Yes, since 'minimum' means the smallest amount of engineering rigour needed to ship something at all, and rigour beyond that point is generally considered wasted effort on a first release.
- **B.** No — an MVP minimises scope, not quality; a release built to a lower standard than the team's usual bar is a defect-laden release, not a minimum viable product.
- **C.** Yes, provided the missing tests and documentation are added to a future Definition of Done.
- **D.** Only if the feature was originally requested through a properly written user story.

**Answer: B.** An MVP is the smallest release that delivers real value and produces learning about whether the wider idea is worth continuing — both halves matter, so it has to be genuinely usable. Cutting testing or documentation to ship sooner is not what 'minimum' refers to; it produces something else, built to a lower standard than the team's own bar.

- A is wrong: That reading of 'minimum' is the trap the exam sets — it minimises what the release does, not how carefully it was built.
- C is wrong: Deferring quality work to a future standard doesn't retroactively make a lower-quality release an MVP; the standard applies at the time of release.
- D is wrong: Whether the underlying need was captured in a well-formed user story is unrelated to whether a given release counts as minimum viable.

### 65.

A team describes its Sprint Backlog as 'the items we pulled into this Sprint.' What does that description leave out?

- **A.** The Sprint Goal, why the work matters, and the actionable plan for delivering the Increment, how it will get done — the selected items are only one of its three parts.
- **B.** Nothing — the Sprint Backlog is defined as exactly the set of Product Backlog items selected for the Sprint.
- **C.** The team's velocity figure, which should be recalculated and attached to every Sprint Backlog so that stakeholders can see how much capacity remains for the rest of the Sprint.
- **D.** The Definition of Done, which the description should have named explicitly.

**Answer: A.** The Sprint Backlog has three parts: the Sprint Goal (why), the selected Product Backlog items (what), and an actionable plan (how). Describing it as only the selected items drops the goal and the plan, leaving what would just be a filtered slice of the Product Backlog rather than a plan by and for the Developers.

- B is wrong: That description names only one of the Sprint Backlog's three parts and omits the goal and the plan entirely.
- C is wrong: Velocity is a forecasting input calculated from past Sprints; it isn't one of the Sprint Backlog's own components.
- D is wrong: The Definition of Done is a separate commitment attached to the Increment, not a component the Sprint Backlog itself is missing.

### 66.

A project is running two weeks behind schedule. The sponsor proposes adding three new engineers to catch up. What is the likely short-term effect?

- **A.** The project speeds up in rough proportion to headcount, since more people working means more work gets done per day, the same way three cashiers process a queue faster than one.
- **B.** The project gets slower in the short term, because existing staff spend their time bringing the new engineers up to speed.
- **C.** The schedule and cost both improve at once, since adding staff is the standard way to trade cost for time.
- **D.** The team's velocity increases immediately, once the new engineers begin estimating alongside the rest of the team.

**Answer: B.** Cost and schedule are separate measurements — a project can be under budget and late at once — and adding people to work that is already behind typically slows it further in the short term, because existing staff are diverted to bringing newcomers up to speed. 'Hire more engineers' is usually the distractor in this competency's budget-and-resource questions, not the answer.

- A is wrong: Work doesn't scale linearly with headcount added mid-project; ramp-up time works against the very speed-up being sought.
- C is wrong: Cost rises with new hires while schedule typically worsens before it improves; the two don't move together the way this option implies.
- D is wrong: Velocity reflects what a team has actually completed; new engineers don't retroactively raise a figure calculated from past Sprints, and they need ramp-up time before contributing to future ones.

### 67.

A project is cancelled halfway through. The team disbands and moves to other work without a formal closure step. What has been skipped, and how does that omission differ from skipping a single Sprint Retrospective?

- **A.** Nothing was skipped, since closure only applies to projects that finish their full planned scope, and a cancellation ends the project's obligations the moment work stops.
- **B.** Closure itself — a cancelled project is still formally closed, with contracts ended, resources released and lessons recorded once; a skipped Retrospective instead only loses one team's chance to improve mid-project, not the project's only opportunity to record what happened.
- **C.** The Sprint Retrospective, since the team never held one before disbanding, and a Retrospective is where a Scrum Team is conventionally expected to capture what it learned before moving on to whatever comes next, project or otherwise, however the work happens to end.
- **D.** Nothing substantive — the issue tracker already holds a record of everything that happened, and anyone curious about the project later can simply read back through its tickets.

**Answer: B.** Closure formally ends a project — confirming acceptance, releasing resources, and recording lessons — and it applies to a cancelled project as much as a finished one, arguably more, since the lessons are the only thing a cancelled effort produced. That is a different kind of omission from a missed Sprint Retrospective, which repeats every Sprint for one team while work continues and directs its improvement inward, not outward to the organisation.

- A is wrong: The definition applies to cancelled projects at least as much as finished ones; skipping it on cancellation is the exact failure mode the exam tests.
- C is wrong: The Retrospective repeats every Sprint for one team while work continues; its absence here is a separate, smaller loss than skipping closure, which never happened once for the whole project.
- D is wrong: A tracker records individual items and their states; it isn't the acceptance, handover and organisation-wide lessons record that closure produces.

### 68.

A project's last deliverable is finished and demoed, but it was never formally accepted against the criteria agreed at the start, and the operations team was never given the runbook. Is the project closed?

- **A.** Yes — closure is simply whatever happens once the last piece of planned work is finished, since there is nothing left on the plan for anyone to keep working on after that point.
- **B.** Yes, since the deliverable's completion is itself the final milestone marking the project's end.
- **C.** No, since acceptance against the original criteria and handover to operations are what actually end a project, and neither has happened yet.
- **D.** Yes, provided a final Sprint Retrospective is held to capture lessons from the last iteration.

**Answer: C.** Closure is not the same as the last piece of work being finished. It requires confirming the deliverables were accepted against the criteria agreed at the start and handing the result over to whoever will operate it, including the runbook and support arrangement the operating team actually needs. A demoed but unaccepted, unhanded-over deliverable is an unfinished closure, not a completed one.

- A is wrong: That reading treats the finished deliverable as sufficient, but the operating team still can't run what was built without the runbook, and nothing has been formally accepted.
- B is wrong: A milestone marking completion doesn't substitute for acceptance and handover; the demo happening is an event, not confirmation the result was accepted or usable by operations.
- D is wrong: A Retrospective is a once-per-Sprint improvement exercise for one team; it doesn't confirm acceptance or complete handover to operations.

### 69.

An operations team is asked to migrate four hundred servers to a new LTS release by the end of Q3. Once complete, the team continues patching those same servers every month indefinitely. Which of the two activities is the project?

- **A.** The migration, because it is the larger and more technically demanding of the two efforts, and demanding, high-visibility work is what most people mean when they informally call something a project.
- **B.** Whichever activity the sponsor currently considers the higher priority this quarter.
- **C.** Whichever activity is currently drawing more budget and headcount.
- **D.** The migration, because it has a defined end date and a unique objective; the monthly patching that follows is ongoing operations, however large an effort it continues to be.

**Answer: D.** A project is temporary work with a defined end and a unique objective; its opposite is operations, the ongoing work of running what already exists. The migration ends and produces something new; the patching repeats indefinitely as part of keeping the fleet current, so it is operations regardless of its size.

- A is wrong: Size and difficulty are not the discriminator; a small effort with an end date is still a project, and a huge recurring effort is still operations.
- B is wrong: Priority describes how much attention something gets, not whether it is temporary with a unique objective.
- C is wrong: Spend and staffing describe scale, not the temporary-versus-ongoing distinction the definition turns on.

### 70.

A RACI matrix lists three people as Responsible for one activity and two people as Accountable for it. What is wrong with that assignment?

- **A.** Nothing — RACI allows any number of people to hold each of the four roles for a given activity, since spreading accountability is generally considered good governance.
- **B.** Exactly one person is conventionally Accountable per activity, though several may be Responsible; two Accountable owners is the malformed part.
- **C.** The problem is having three Responsible people, since only one person may ever do the actual work.
- **D.** The problem is that Consulted and Informed roles are missing from the assignment entirely.

**Answer: B.** A RACI matrix clarifies who is Responsible for doing the work, Accountable for its outcome, Consulted before it and Informed after it. The tested convention is that several people may be Responsible for one activity, but exactly one is Accountable — two Accountable owners defeats the purpose of naming a single answerable person.

- A is wrong: Responsible can be shared, but Accountable is conventionally exactly one person per activity — that's the point tested here.
- C is wrong: Several people sharing Responsible for one activity is normal; nothing about that count is the defect in this matrix.
- D is wrong: A matrix can validly assign only Responsible and Accountable for a given activity; omitting Consulted or Informed isn't automatically a malformation.

### 71.

A team has assessed a vendor delivery risk, scoring its likelihood and impact and ranking it against other risks. Has the team decided what to do about it?

- **A.** Yes — ranking a risk by its likelihood and impact is itself the risk response, since knowing where a risk sits relative to the others already tells the team what to prioritise doing about it.
- **B.** No, because assessment produces a priority order, never an action; deciding to avoid, mitigate, transfer or accept the risk is the separate step of response.
- **C.** Yes, once the risk is logged in the issue tracker alongside its score.
- **D.** Yes, provided a contingency reserve has already been set aside in the budget.

**Answer: B.** Risk management is a continuing cycle of identifying, assessing, responding to and monitoring risks. Assessment scores likelihood and impact to produce a priority order; it never itself produces an action. Response is the separate step of choosing to avoid, mitigate, transfer or accept each ranked risk, typically with a contingency reserve set aside if an accepted risk materialises.

- A is wrong: Ranking sorts risks against each other; it doesn't select avoid, mitigate, transfer or accept for any of them.
- C is wrong: An issue tracker is for things that have already happened; a risk is an uncertain future event, and logging its score there doesn't select a response.
- D is wrong: A contingency reserve is one possible outcome of choosing to accept a risk — setting it aside doesn't happen before a response is actually chosen.

### 72.

A customer asks a delivery team for an extra report field. The team agrees on the spot, adds it, and the schedule and budget both stay exactly as originally planned. Is this scope creep?

- **A.** Yes. The defining property is the absence of assessment, approval and a re-baselined schedule and budget, not the size of the addition.
- **B.** No, because the request came directly from the customer rather than from inside the team, and customer-originated requests are generally treated as legitimate by default.
- **C.** No, since the addition is small enough that it doesn't need to be tracked as a formal change.
- **D.** No, because the schedule and budget staying unchanged proves the addition had no real cost.

**Answer: A.** Scope creep is growth that happens without a matching adjustment to time, cost or baseline. A customer asking for more is normal; what turns it into creep is the team absorbing the request informally, with no impact assessment and no re-baselining, which is exactly what happened here, however small the field.

- B is wrong: The source of the request, customer or team, doesn't determine whether it's creep; the missing step is assessment and approval, wherever the request originated.
- C is wrong: 'Small' is exactly the size of request that accumulates into creep; the size doesn't exempt it from needing assessment.
- D is wrong: An unchanged schedule and budget after adding work usually means the cost was absorbed silently, not that there was none — that absorption is the mechanism of creep.

### 73.

A sponsor formally requests an additional module. The request is assessed for impact, approved by the sponsor, and the schedule and budget baselines are updated to reflect a two-week extension. Is this scope creep?

- **A.** Yes — any addition to scope after the project has started counts as creep, however it was handled.
- **B.** Yes, because the schedule moved, and any movement of a triple-constraint leg after baselining is creep by definition, however the movement came about or who approved it.
- **C.** It's creep unless the same request would also have been approved without any schedule extension at all.
- **D.** No; this is change control working as intended: the change was assessed, decided by someone with authority, and written back into the baseline.

**Answer: D.** Change control and scope creep both involve scope growing — the difference is whether that growth was assessed, decided by a named authority, and reflected in an updated baseline. Here it was, on all three counts, so the two extra weeks are the price of an approved trade-off, not an uncontrolled failure mode.

- A is wrong: Treating any post-start addition as creep ignores the actual test, which is whether the change went through assessment and approval; this one did.
- B is wrong: A leg moving is a normal outcome of an approved trade-off; the triple constraint doesn't forbid movement, it describes how legs trade off against each other.
- C is wrong: Whether the extension was strictly necessary isn't the test; the test is whether the change was assessed and decided by someone with the authority to decide.

### 74.

During a Sprint Review, an attendee raises: 'Handovers to the support team keep stalling.' The Scrum Master says this belongs in a different event. Which one, and why?

- **A.** The Sprint Retrospective, which inspects the team's own process, whereas the Review inspects the product and what to build next.
- **B.** The Daily Scrum, since any process complaint should be raised at the very next working day's event.
- **C.** Sprint Planning, since process changes should be scheduled before the next Sprint even starts.
- **D.** Project closure, since only a fully finished project can act on a systemic handover problem, because closure is the point at which lessons are finally written down for anyone else to read.

**Answer: A.** The Sprint Review and the Sprint Retrospective are the most reliably examined discrimination in this competency: the Review inspects the product and what to do next, and the Retrospective inspects individuals, interactions, processes and tools. A complaint about how the team works belongs in the Retrospective regardless of which event it happens to surface in.

- B is wrong: The Daily Scrum is fifteen minutes for the Developers to inspect progress toward the Sprint Goal, not a venue for raising process complaints.
- C is wrong: Sprint Planning addresses what will be built and how, not a review of what went wrong in the process last Sprint.
- D is wrong: Closure happens once, at the very end of a project; a recurring handover problem needs addressing every Sprint, not held until the project ends.

### 75.

A stakeholder wants a backlog item reprioritised and takes the request straight to a developer, who agrees to work on it next. What does the Scrum Guide say is wrong with that path?

- **A.** Nothing — any team member may reprioritise the backlog as long as the change is communicated afterward to whoever happens to be affected by it that Sprint.
- **B.** The request should have gone to the Scrum Master instead, since ordering is a process concern.
- **C.** Ordering authority over the Product Backlog sits with the Product Owner; a developer agreeing to reprioritise bypasses the one person accountable for it.
- **D.** Nothing is wrong, since reprioritisation requests are meant to be raised directly at the Daily Scrum.

**Answer: C.** The three Scrum accountabilities are distinct: the Product Owner owns Product Backlog ordering and value, the Scrum Master owns the process and impediment removal, and the Developers own how the work gets done. Anyone wanting the backlog changed does so by convincing the Product Owner, whose decisions the organisation must respect.

- A is wrong: Ordering authority is not distributed to whoever hears the request first; it belongs specifically to the Product Owner.
- B is wrong: The Scrum Master owns the process and coaches self-management, not backlog ordering, which is the Product Owner's accountability.
- D is wrong: The Daily Scrum is for the Developers to inspect progress toward the Sprint Goal, not a channel for stakeholders to reprioritise work.

### 76.

One team is described as having fixed-length two-week cycles, a single ordered backlog, and three defined accountabilities. A second is described as continuous flow with explicit work-in-progress limits and no fixed iteration. Which framework does each describe, and what is the deciding feature?

- **A.** The first is Scrum and the second is Kanban; the deciding feature is a fixed-length timebox against continuous, work-in-progress-limited flow.
- **B.** Both describe Scrum, since both are agile frameworks working from a backlog of items to be pulled through.
- **C.** The first describes agile in general, and the second describes one specific framework built beneath it.
- **D.** The deciding feature is which one has a backlog at all, since only the first maintains an ordered list of work that the team pulls items from as capacity allows.

**Answer: A.** Scrum organises work into fixed-length Sprints with a Product Owner, Scrum Master and Developers; Kanban manages the same kind of work as continuous flow, limited by explicit work-in-progress caps rather than a timebox. The presence or absence of a fixed iteration boundary is the reliable discriminator between the two.

- B is wrong: Only the first description matches Scrum's fixed-length Sprint and three accountabilities; the second has neither and matches Kanban instead.
- C is wrong: Scrum is itself a framework beneath agile's values, not agile-in-general; the first description names a specific framework, just as the second does.
- D is wrong: Kanban also maintains an ordered backlog of work to be pulled — a backlog isn't what separates the two.

### 77.

A candidate claims: 'the SDLC is waterfall, since the phases are always listed requirements, design, implementation, testing, deployment, maintenance, in that order.' What is wrong with the claim?

- **A.** Nothing — an agile team skips design and testing entirely, so only waterfall actually uses the listed phases.
- **B.** The SDLC names the phases that must happen; waterfall is one policy for sequencing them, and an agile team runs the same phases repeatedly inside every iteration.
- **C.** The claim gets the sequencing policy right but the order wrong — maintenance is actually the first phase in most descriptions, since systems are maintained from the moment requirements are first drafted.
- **D.** The phases listed are risk-management activities, not lifecycle phases at all.

**Answer: B.** The SDLC names the phases software passes through; it says nothing about their batch size or rhythm. Waterfall completes each phase before the next begins for the whole scope at once; agile traverses the same phases repeatedly, in miniature, inside each iteration. Treating 'SDLC' as a synonym for waterfall is the single most common confusion in this competency.

- A is wrong: An agile team still passes through requirements, design, implementation and testing, repeatedly, in small batches; it doesn't skip them.
- C is wrong: Maintenance is last in the conventional list, not first, and the ordering issue isn't the actual defect in the claim.
- D is wrong: Requirements, design, implementation and so on are development phases, not a risk-management framework.

### 78.

A Sprint is due to end Friday, but the team asks the Product Owner for three extra days to finish the last item. What has this request actually done to the Sprint?

- **A.** Nothing significant — a short extension to finish committed work is a normal, expected part of Sprint discipline, and treating it otherwise would make the framework needlessly rigid.
- **B.** Merged the Sprint Review into the following Sprint's planning session.
- **C.** Invalidated the team's velocity figure for every Sprint that follows.
- **D.** Broken the one property a Sprint exists to provide, namely a fixed length inside which forecasting from past Sprints stays meaningful.

**Answer: D.** A Sprint is a fixed-length event, commonly two weeks though the length is a convention, and the fixed box is what makes it possible to forecast from what a team has completed in the past. Extending it 'to finish' destroys that property for the Sprint it happens to, even though only the Product Owner has the authority to cancel a Sprint outright.

- A is wrong: Extending the timebox to finish work is exactly the practice the fixed-length rule exists to prevent, not a normal accommodation.
- B is wrong: Nothing about extending the Sprint's end date merges two named events into one.
- C is wrong: One extended Sprint doesn't retroactively invalidate every later velocity figure, though it does distort the extended Sprint's own data point.

### 79.

A security reviewer will never use the system being built but has the authority to block its release. Is she a stakeholder?

- **A.** No, because stakeholders are defined as people who will use or directly benefit from the delivered system, which by that reading would exclude reviewers, auditors and anyone outside the delivery team.
- **B.** Only once she is formally added to the project's communication plan.
- **C.** Yes. A stakeholder is anyone affected by the project or able to affect it, and the ability to block release satisfies that on its own.
- **D.** Only if she is assigned one of the four roles in the project's RACI matrix.

**Answer: C.** Stakeholder status turns on impact-or-influence, not on being a user or a team member. A reviewer who can block release without ever touching the system is a stakeholder on the influence test alone, and missing that is a commonly cited source of late-surfacing requirements.

- A is wrong: That definition excludes exactly the peripheral reviewers, auditors and downstream teams the exam most often asks about.
- B is wrong: A communication plan is built for stakeholders already identified; being listed there is a consequence of being a stakeholder, not a precondition.
- D is wrong: A RACI entry assigns responsibility for a task; stakeholder status doesn't depend on holding one of its four roles.

### 80.

Midway through a fixed-price project, the sponsor asks for an additional module. The delivery date and the budget both stay exactly as agreed. Which of the following must absorb the change?

- **A.** Nothing, provided the existing team simply works longer hours to cover the extra module.
- **B.** A new milestone, added to the schedule to mark the module's completion.
- **C.** With scope up and both the schedule and the budget frozen, quality is the only remaining quantity the model bounds.
- **D.** Nothing, as long as the module is logged as a minor addition rather than routed as a formal change, since informal requests below a certain size are commonly assumed not to need assessment.

**Answer: C.** The triple constraint holds that scope, time and cost bound quality; fixing any two forces the third — or, if none may move, quality — to absorb the change. 'The team works harder' names none of the three legs and is the trap answer; adding scope without adjusting schedule or cost only relabels the same problem.

- A is wrong: Extra effort from the same team is not one of the three legs; it typically produces slower delivery, not a free absorption of more scope.
- B is wrong: A milestone is a schedule marker, not one of the three legs the model bounds — adding one doesn't answer what actually gives.
- D is wrong: Treating an unassessed addition as minor is exactly how scope creep starts, not a way of avoiding a trade-off.

### 81.

A backlog item reads: 'Add a composite index to the orders table.' A reviewer says it is not a user story. What is missing, and what does the missing part usually let a team do?

- **A.** Nothing is missing — any single, well-defined unit of backlog work counts as a user story, provided it is small enough to fit comfortably inside one Sprint's worth of capacity.
- **B.** The role and benefit clauses; without a stated 'so that', the team cannot judge whether a different, cheaper implementation would satisfy the actual need.
- **C.** Its acceptance criteria — adding some would make it a proper story.
- **D.** An entry in the Sprint Backlog — placing it there would make it a story.

**Answer: B.** A user story is conventionally three clauses — as a role, I want a capability, so that a benefit — and what disqualifies most failed candidates is a missing benefit or a task phrased as though it were a need. 'Add an index' names an implementation with no role and no stated reason, which is exactly the shape the exam uses to test recognition of the template.

- A is wrong: A task written in technical terms with no user in it is precisely what a story is not, however well-defined the task itself is.
- C is wrong: Acceptance criteria are attached to a story once it exists; their absence doesn't explain why this item isn't a story in the first place.
- D is wrong: Sprint Backlog membership is about scheduling, not format; placing a task in a Sprint doesn't turn it into a story.

### 82.

A vendor must deliver a fixed scope specified in a signed regulatory contract, with no tolerance for redesign once implementation begins. Which sequencing approach does that cue point to, and why?

- **A.** Waterfall, since its main cost is expensive late change, which a genuinely fixed, stable scope has already ruled out.
- **B.** Agile — because welcoming change even late in development reduces the vendor's regulatory exposure.
- **C.** Neither — a signed contract replaces the need for any sequencing methodology at all.
- **D.** Agile, since any modern project should default to iterative delivery regardless of how fixed the scope is, because iteration is now widely treated as the safer default choice for almost any kind of work.

**Answer: A.** Waterfall moves the whole scope through completed, approved phases in sequence, which is predictable precisely when requirements won't change. A fixed regulatory contract with no tolerance for redesign is the textbook cue for it — the choice is about requirements stability, not about which approach is inherently faster or more modern.

- B is wrong: Welcoming late change is a poor fit for scope that cannot be redesigned mid-flight; it doesn't reduce risk here, it invites cost.
- C is wrong: A contract states what must be delivered, not how the team sequences the work to get there — some methodology still governs execution.
- D is wrong: Iterative delivery is valuable for uncertain requirements, but this scenario describes the opposite condition: stability, not uncertainty.

### 83.

A reviewer asks a migration project 'which of your plan items can slip without moving the end date?' The team can't answer from its work breakdown structure. Why not, and where does the answer actually come from?

- **A.** The work breakdown structure has no time axis, durations or dependency arrows by design; the answer comes from the schedule built on top of it, specifically the critical path.
- **B.** The work breakdown structure does contain dates, but they were left blank in this case by mistake.
- **C.** It can't answer scheduling questions because it only lists who is responsible for each task, not what the tasks actually are or how they relate to one another across the whole deliverable.
- **D.** The answer comes from the team's velocity, which shows how much slack the team has each Sprint.

**Answer: A.** A work breakdown structure decomposes the deliverable into work packages small enough to estimate and assign, organised by what is being produced — it has no time axis, no durations and no dependency arrows. Only afterwards, once those packages are sequenced into a schedule, do dates and dependencies appear, and it's the critical path within that schedule that answers which tasks can slip without moving the finish.

- B is wrong: The absence of dates is by design, not an omission — a work breakdown structure is a structure, not a timeline, and was never meant to carry them.
- C is wrong: It shows the decomposition of the deliverable, organised by what is produced, not an assignment of owners — an org chart is a different malformation of the same idea.
- D is wrong: Velocity is a Scrum forecasting figure calculated from completed work per Sprint; it doesn't identify which schedule items are on the critical path.

### 84.

A library exposes function signatures for other code to call locally, with no network involved. Does it have an API, and is it necessarily RESTful?

- **A.** It has no API, since APIs are by definition HTTP endpoints that some remote caller invokes over a network connection.
- **B.** It has an API, and it is not necessarily RESTful; an API is a contract that need not involve a network at all, while REST is one network-based style of building one.
- **C.** It has an API, and that API is RESTful because any interface presenting a stable contract to its callers counts as REST.
- **D.** It has an API only once someone publishes a machine-readable schema document formally describing its operations, the way an OpenAPI document formalizes a network endpoint's contract for outside callers.

**Answer: B.** The API/REST comparison's separating axis is category versus instance: every REST interface is an API, but an API needs no network at all — a library's function signatures are the textbook case, and REST is only one style of building a networked one.

- A is wrong: A uniform HTTP interface is one carrier for a contract, not the definition of the contract itself; a library's function signatures are the classic non-network API example.
- C is wrong: REST specifically constrains resource URLs, HTTP methods, and statelessness — properties a local function-call interface has no occasion to exhibit.
- D is wrong: Documentation makes a contract usable to more callers, but the contract exists as soon as the operations, inputs and outputs are fixed — the schema formalises it rather than creating it.

### 85.

A bug fix is deployed to the origin server, but users report seeing the old, broken page for another hour. RFC 9111 governs HTTP caching. What does the cache's behaviour here demonstrate, and what does it not indicate?

- **A.** That the cache is malfunctioning, since a correct cache would always reflect the latest origin state immediately.
- **B.** That the origin server itself is stateful, since it kept serving the same response.
- **C.** That the cache accepted staleness in exchange for speed; it does not indicate that the fix failed to deploy or that the origin is broken.
- **D.** That the API's contract changed without a new version being published.

**Answer: C.** RFC 9111 exists because every layer between origin and browser may hold a copy older than the current one; the guide's own trap is exactly this — a stale page can survive a fix applied at the origin, which is the cache working as designed, not a broken deployment or a stateful server.

- A is wrong: A cache that always reflected the origin immediately wouldn't be doing its job — reducing repeat work by accepting some staleness is the design, not a fault.
- B is wrong: Statefulness describes whether a server retains client-specific data between requests; a cache returning a stale shared page is unrelated to that property.
- D is wrong: Nothing here concerns the interface's contract or its versioning; the page's content became stale in a cache, an entirely different mechanism.

### 86.

An application server queries a database on behalf of a request from a browser. RFC 9110 describes client and server as roles a program plays on a given connection, not as fixed types of machine. In client-server terms, what is the application server's role?

- **A.** Only a server, since it never itself opens the connection from the browser.
- **B.** A server to the browser and a client to the database, since the same program can hold both roles on different connections.
- **C.** Peer-to-peer, since the same program both answers and initiates requests.
- **D.** Impossible — a single process can only occupy one of the two roles at a time, so it must be either a server everywhere or a client everywhere it appears.

**Answer: B.** RFC 9110 states plainly that the same program might act as a client on some connections and a server on others — role is a property of a connection, not an identity stamped on a process. An application server is exactly this case: server to the tier above it, client to the tier below.

- A is wrong: That treats role as a fixed identity of the process rather than a per-connection role — the same trap as misassigning a component's tier.
- C is wrong: Peer-to-peer names a shape with no designated waiting party; a service that both answers a browser and calls a database is two ordinary client-server exchanges, not that.
- D is wrong: A common misreading of client and server as a permanent identity rather than a role assumed once per connection.

### 87.

A script needs to send a DELETE request to `https://example.com/orders/42` and confirm the exact status code that comes back. Which curl invocation does both?

- **A.** Run `curl -X HEAD https://example.com/orders/42` to get a proper HEAD response with the status line, since `-X` is assumed to switch the request method the same way `-I` does.
- **B.** Run `curl --head https://example.com/orders/42`; `--head` prints the status line, and the order path in the URL is enough to identify what should be removed.
- **C.** Run `curl -X DELETE -i https://example.com/orders/42`; `curl -X` sets the method word, and `-i` adds the status line and response headers to the output.
- **D.** Send the request with PUT instead of DELETE, since PUT and DELETE are both idempotent so either confirms the same outcome.

**Answer: C.** The curl manual is explicit that `-X` only changes the method word and does not alter how curl behaves, which is why `-X HEAD` is not a proper HEAD request and `--head` is. Pairing `-X DELETE` with `-i` sends the method RFC 9110 defines for removing a resource and prints the status line that came back, while `--head` alone would issue a HEAD and never delete anything.

- A is wrong: Expecting `-X` to change request behaviour is the documented mistake: `-X HEAD` does not perform a proper HEAD request — `-I, --head` is the option that does.
- B is wrong: `-I, --head` fetches the headers only by issuing a HEAD request, so no DELETE is ever sent and the status line reported belongs to the HEAD rather than to the removal the script needs.
- D is wrong: Idempotence describes what happens on repetition, not equivalence between operations; PUT replaces the resource rather than removing it, so it doesn't answer whether the delete succeeded.

### 88.

RFC 8259 calls JSON 'language-independent' though its syntax is merely 'derived from' JavaScript object literals, and it requires UTF-8 for JSON exchanged outside a closed ecosystem. What does that rule out?

- **A.** That a JSON document can omit a declared schema, since RFC 8259 requires one, the same way a relational table's columns are declared before any row can be inserted.
- **B.** That XML remains the current default for web APIs, since RFC 8259 only standardises JSON.
- **C.** That JSON exchanged between systems can use any character encoding interchangeably.
- **D.** That JSON only works with JavaScript, whereas RFC 8259 defines it as independent of any particular language.

**Answer: D.** RFC 8259 is explicit on both traps this concept invites: JSON's syntax is derived from JavaScript but the format itself is language-independent, and UTF-8 is required once JSON leaves a closed ecosystem — 'JavaScript-only' and 'any encoding will do' are both wrong for the same reason.

- A is wrong: RFC 8259 defines JSON's syntax and encoding; it says nothing about requiring a schema, which is a separate and often-optional practice.
- B is wrong: The guide names JSON, not XML, as the current default for web APIs; RFC 8259 standardising JSON doesn't revive XML's status.
- C is wrong: RFC 8259 requires UTF-8 for JSON text exchanged outside a closed ecosystem, which is a real constraint this denies.

### 89.

The OASIS AMQP 1.0 specification models a queue as a node that stores and forwards messages between a producer and a consumer, named as separate application elements. What does that model rule out?

- **A.** That a queue is essentially a database table that other components are free to query however they like.
- **B.** That the producer and consumer may also call each other directly over a synchronous API when both do happen to be running, since a queue between them forbids every other path.
- **C.** That the producer and consumer must both be available at the same moment; the queue buffers messages between two elements that need not coincide in time.
- **D.** That messages are normally removed once consumed, rather than left in place for other components to read repeatedly.

**Answer: C.** AMQP 1.0 models a queue as a node that stores and forwards messages between a producer and consumer named as separate elements — decoupling in time is the point, which is what separates a queue from an API call or a queryable store.

- A is wrong: The specification models the queue as a store-and-forward node passing messages on, not a store other components query arbitrarily like a table.
- B is wrong: Nothing in the store-and-forward model forbids a direct call between the two elements; the queue describes one route a message may take, not the only channel the two are permitted to use.
- D is wrong: Messages are normally consumed and removed rather than queried like a database — a real behaviour this denies.

### 90.

Team A's services are versioned and deployed independently, each with its own datastore, reaching each other only over the network. Team B's services live in one shared codebase, ship in one release, and read and write one common database, though the code is split along clean module boundaries. Which team has microservices?

- **A.** Team B — its modules are already split along clean boundaries, which is what makes an architecture microservices.
- **B.** Both — any system organised into services with clear boundaries qualifies, regardless of how it deploys, since module boundaries are what the term is really pointing at.
- **C.** Neither — microservices additionally require a message queue rather than direct network calls between services.
- **D.** Team A, because independent deployment, network calls between services, and each service owning its data are the defining traits.

**Answer: D.** The comparison's separating axis is the release boundary. Team A has many independently deployed units with network calls and separate data; Team B has one release and one shared database — a distributed-monolith risk if it split the process without splitting the data.

- A is wrong: Splitting into tidy modules that still ship as one artefact is a modular monolith; the trait that matters is independent deployment, not module boundaries.
- B is wrong: That drops the deployment and data-ownership requirements the term actually carries.
- C is wrong: HTTP APIs and message queues are named as common interfaces between services, but the requirement is independent deployment and ownership, not one specific transport.

### 91.

A three-person startup ships its whole product as one deployable artefact, replicated across six instances behind a load balancer for capacity. A reviewer calls this 'not really a monolith anymore' because it runs on six instances. Is the reviewer correct?

- **A.** Yes — six independently running instances means six independently deployable units, each free to be released, scaled and rolled back without touching the other five.
- **B.** No. The defining property is the shared release, not instance count; six copies of one artefact is still one deployable unit.
- **C.** No, but only because the team is too small to be running microservices.
- **D.** Yes — a 'modular monolith' is a contradiction, so any monolith that scales horizontally has become something else.

**Answer: B.** The CNCF glossary and the guide agree the criterion is the deployable unit, not the instance count, the team size, or the internal module structure. Six replicas of one artefact behind a load balancer is exactly the common way to run a monolith at scale.

- A is wrong: The instances are copies of the same artefact released together, not services released on separate schedules — the trait microservices actually have.
- C is wrong: Team size is a factor in which shape suits a system, but it doesn't change what 'monolith' means for the one already built — the same trap as reasoning from scale about a tier count.
- D is wrong: A well-structured modular monolith is not a contradiction in terms, and horizontal replication doesn't touch packaging at all.

### 92.

A session store is read once per request by session id and never joined to anything else. Storage volume is high and access is always by that one key. Which store family fits, and on what basis?

- **A.** A relational database, since it offers the strongest data-integrity guarantees regardless of access pattern.
- **B.** A NoSQL key-value store, given that fetching a record whole by one key with no joins is the access pattern that model is designed for.
- **C.** Either — NoSQL is simply a faster, schema-free relational database, so the choice between them comes down to preference rather than the shape of the access pattern.
- **D.** A message queue, since high volume calls for a buffer between producer and consumer.

**Answer: B.** The comparison's separating axis is where structure is enforced: a session fetched whole by one key with no joins is the textbook NoSQL fit, while a relational database would enforce a schema and offer join and cross-table transaction guarantees this workload never uses.

- A is wrong: Relational strength is joins and cross-table transactions; a workload with no joins and one lookup key gains nothing from either and pays declared-schema overhead for no benefit.
- C is wrong: NoSQL is a category defined by rejecting the relational tables-and-joins model, not a faster drop-in replacement for it.
- D is wrong: Nothing here describes a producer-consumer handoff; the requirement is a fast lookup by key, which a queue is not built to serve.

### 93.

A checkout must debit stock and record payment together, or do neither, and finance later queries orders joined against customers and products in combinations nobody anticipated. A colleague proposes a wide-column NoSQL store because 'NoSQL scales better.' What actually discriminates this choice?

- **A.** Scale alone — NoSQL is simply the faster choice once a workload's volume grows large enough to matter, regardless of whether the data being stored has any relationships that need enforcing.
- **B.** The all-or-nothing multi-table update and the unpredictable joins — a relational database enforces the schema and performs the joins this workload needs.
- **C.** Neither store — only a message queue between the two steps can guarantee the debit and payment happen together.
- **D.** It makes no real difference either way, since several NoSQL products now offer transactions of their own too.

**Answer: B.** The honest discriminators are structure, joins, and atomicity across tables, not popularity or raw scale. PostgreSQL's own model — enforced schema, joins performed by the database, a transaction logged to permanent storage before completion is reported — is built for exactly this checkout.

- A is wrong: NoSQL is usually faster for the access pattern the data was modelled for and considerably worse for join-shaped queries like this one; volume alone doesn't decide it.
- C is wrong: A queue decouples producer and consumer in time; it has no notion of an all-or-nothing operation across two tables, which is what a transaction provides.
- D is wrong: Some NoSQL products do offer transactions, but typically scoped to one document or key — not the arbitrary multi-table span this checkout needs.

### 94.

An interface exposes `POST /getOrder` and `POST /deleteOrder`, both returning JSON over HTTP. A developer calls it a REST API. What is missing?

- **A.** Resource URLs and method semantics — the verb belongs in the URL and one method is used for everything, the opposite of the uniform interface REST requires.
- **B.** Nothing at all — returning a JSON body over an HTTP connection is already sufficient to call an interface RESTful.
- **C.** A published, machine-readable contract describing the interface's available inputs and outputs to callers.
- **D.** A message queue sitting between the client and the service to decouple the two in time, the missing piece that would let the caller stop waiting for an immediate response.

**Answer: A.** The example is HTTP and JSON but not REST-shaped: the verb sits in the URL, and one method handles every operation, which is exactly the uniform-interface violation the guide's trap calls out.

- B is wrong: REST is a style, not a specification, and returning JSON over HTTP alone does not make an interface RESTful; JSON isn't even mandated.
- C is wrong: That describes any API's documentation and doesn't determine whether the design underneath is REST-shaped.
- D is wrong: REST is a synchronous request/response style over HTTP; nothing about it involves decoupling client and server in time the way a queue does.

### 95.

After adding an index on a heavily-queried column, read latency improves but nightly batch inserts start taking noticeably longer. What explains the change?

- **A.** The index replaced the table with a faster copy, so writes now pass through an extra layer.
- **B.** The schema was altered when the index was added, which is what slowed the inserts.
- **C.** Indexes are free to maintain, so the slowdown must have an unrelated cause.
- **D.** The index is a separate structure PostgreSQL keeps synchronised as the table changes, so every insert now also updates the index.

**Answer: D.** PostgreSQL keeps each index synchronised as the underlying table changes. That is exactly the trade the guide names: read speed bought with write time and disk space, not a free structure or a schema change.

- A is wrong: An index is not a copy of the table's data; it is a separate lookup structure alongside it, and the table itself is unchanged.
- B is wrong: Adding an index doesn't redeclare the schema; the slowdown comes from maintaining the index structure itself, not a schema change.
- C is wrong: An index is not free: PostgreSQL updates it whenever the table changes, so faster reads are paid for on every insert, update and delete.

### 96.

A junior engineer runs `UPDATE orders SET status = 'cancelled';` against production with no WHERE clause. What has just happened, and which statement would have changed nothing if run the same way?

- **A.** Every row in the table was updated to 'cancelled'; a bare `SELECT` run the same way would have changed nothing.
- **B.** Only the most recently inserted row was updated; a bare `DELETE` run the same way would have changed nothing.
- **C.** Nothing, because PostgreSQL requires a WHERE clause on UPDATE by default.
- **D.** Every row was updated, and adding a `JOIN` clause would have prevented it.

**Answer: A.** Of the four data-changing statements, SELECT changes nothing; UPDATE and DELETE without a WHERE clause typically act on every row, and JOIN is a clause used inside a query rather than a statement of its own.

- B is wrong: UPDATE has no notion of 'most recent' without an explicit WHERE or ORDER BY; DELETE without a WHERE clause is just as dangerous as this UPDATE, not safe.
- C is wrong: PostgreSQL does not require a WHERE clause; omitting one is exactly what makes this statement act on every row.
- D is wrong: JOIN is a clause written inside a query, not a statement of its own, and it has no bearing on whether an UPDATE carries a WHERE clause.

### 97.

Users get logged out at random after a second application instance is added behind a load balancer, because each instance holds session data only in its own memory. A quick fix pins each user to the instance that logged them in. RFC 9110 describes HTTP as a stateless protocol whose requests can be understood in isolation. What does the sticky-session fix actually change?

- **A.** Nothing about statelessness — it works around a stateful application by routing consistently, but the session still dies if that instance is redeployed or lost.
- **B.** It makes the application stateless, since the load balancer now handles routing consistently.
- **C.** It satisfies the same requirement a cache would, since both exist to keep repeat requests answered quickly.
- **D.** It moves the application's REST interface to a stateful style, since REST normally requires statelessness.

**Answer: A.** RFC 9110 defines HTTP as stateless so that any instance can answer any request; sticky sessions merely paper over an application that isn't, by pinning routing rather than moving state to a shared store or token — the actual fix, and the reason failing over remains fragile until it's applied.

- B is wrong: Consistent routing is a workaround, not a move of state to a shared store or token; the application is exactly as stateful as before.
- C is wrong: A cache is expendable by definition and holds derived results; session state cannot be lost the way a cache entry can, so a cache answers a different question.
- D is wrong: Sticky routing is an infrastructure workaround at the load balancer, not a change to the API's resource-and-method design; REST's statelessness constraint concerns request semantics, not instance affinity.

### 98.

A checkout application runs as a single Java artefact on twenty instances behind a load balancer: a browser front end, the Java application enforcing pricing rules, and one relational database. How many tiers does this system have, and why?

- **A.** Twenty, since each running instance adds another layer between the browser and the database, one layer for every copy of the artefact running behind the load balancer.
- **B.** Four — presentation, application, data, and the load balancer sitting in front.
- **C.** Three: presentation (browser), application (the Java artefact), and data (the database); instance count does not change the layer count.
- **D.** Two — the browser and the database, since the application logic runs inside the browser tier.

**Answer: C.** Tier counts responsibility layers, not hosts or processes. Twenty instances of one artefact is still one application tier, and a load balancer sits in front of the tiers as infrastructure rather than adding one, per the three-tier model.

- A is wrong: Instance count measures deployment scale, not the number of responsibility layers — the same confusion that treats packaging as if it changed the layering.
- B is wrong: A load balancer or reverse proxy in front is typically described as infrastructure serving the presentation and application tiers, not a tier of its own.
- D is wrong: That merges the application tier into presentation; the Java artefact enforcing pricing rules is a separate application tier that does not run in the browser.

### 99.

A multi-step transfer debits one account and credits another. The process crashes immediately after the database reports the transaction complete. What is guaranteed?

- **A.** Only the debit is guaranteed to survive, since it was applied first.
- **B.** Nothing is guaranteed once the process crashes, regardless of what the database reported.
- **C.** The transaction was already logged to permanent storage before completion was reported, so both the debit and the credit survive the crash.
- **D.** Consistency is guaranteed, meaning the transaction ran faster than an equivalent pair of separate updates.

**Answer: C.** Atomicity and durability are different promises: atomicity means partial steps never take effect, durability means a committed transaction is written to permanent storage before completion is reported — exactly what protects both halves of the transfer from a crash immediately afterward.

- A is wrong: Atomicity means the steps of a transaction all take effect or none do; there is no guarantee that favours the first step over the second.
- B is wrong: That denies durability specifically — the guarantee that a reported-complete transaction has already been made permanent.
- D is wrong: Consistency means the database moves between valid states, not a claim about speed; nothing here concerns performance.

### 100.

A site's home page loads instantly and every static image renders, but every form submission returns 502 Bad Gateway. Which component is the first suspect, and on what basis?

- **A.** The application server — a 502 is what a gateway or proxy returns when the backend it forwards to answers invalidly, and static content loading proves the web server itself is reachable.
- **B.** The web server — since it is the process that returned the 502 status code to the browser, the fault must lie in whatever generated that particular response.
- **C.** The application tier is fine, but the load balancer sitting in front needs to be treated as a fourth tier before this diagnosis can go any further.
- **D.** The database, since form submissions are the only kind of request in this scenario that would ever need to reach it at all, and every other component in the path already proved itself by serving the static assets correctly.

**Answer: A.** Static assets loading confirms the web server is alive and serving files it already has; a 502 means it forwarded a request and got back an invalid response, which locates the fault in the application server behind it — exactly the diagnostic split the two roles exist to support.

- B is wrong: 502 specifically means a gateway or proxy got an invalid response from upstream; it is evidence the web server is working as a proxy and the upstream is not.
- C is wrong: A load balancer or reverse proxy sitting in front is typically described as infrastructure serving the tiers, not a tier of its own.
- D is wrong: Nothing here isolates the database specifically; the symptom points at whatever is behind the web server's proxy, which is the application server first.

