<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — IT Project Management Fundamentals :: Open Source Software and Licensing

31 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

What does AGPL section 13 add on top of the plain GPL, and what specifically triggers it?

- **A.** Nothing beyond the plain GPL — conveying a copy remains the only trigger, since GPLv3 section 5 already covers network interaction on its own.
- **B.** A requirement to publish a Software Bill of Materials each time the hosted service is updated with new dependencies.
- **C.** An obligation that applies to any software running on a server that users reach over the internet, regardless of which licence that software carries.
- **D.** An obligation, triggered by that network interaction rather than by conveying a copy, to offer the Corresponding Source to users who interact with a modified version remotely over a network.

**Answer: D.** The AGPL was written to close the gap where a modified program is offered as a service but never conveyed to anyone. Section 13's trigger is network interaction with a modified version, independent of whether a copy ever changes hands.

- A is wrong: GPLv3 section 5 concerns conveying a copy; it does not reach a hosted, never-distributed service, which is exactly the gap section 13 closes.
- B is wrong: Section 13 requires offering Corresponding Source to network users; it says nothing about producing a bill of materials.
- C is wrong: Section 13 is a term of the AGPL specifically; software under other licences, including the plain GPL, is not reached by it at all.

### 2.

A contributor to an Apache-2.0 project files a lawsuit alleging the project's work infringes a patent that contributor holds. What happens under section 3 to the patent licences that contributor holds in the work?

- **A.** Nothing happens to them, since MIT and the BSD licences carry no patent-termination mechanism at all for either side to ever invoke.
- **B.** They terminate for every contributor to the project at once, not just the one who filed suit, since the NOTICE file lists all contributors jointly by name.
- **C.** They terminate for that contributor, because Apache-2.0 ends the patent licences granted to anyone who files patent litigation alleging the work infringes.
- **D.** They terminate only if the project is also dual-licensed under a copyleft licence, since permissive terms alone cannot enforce patent termination.

**Answer: C.** Section 3 grants a scoped patent licence and terminates it for anyone who files patent litigation alleging the work infringes — a mechanism unique to Apache-2.0 among the permissive licences and central to what it adds over MIT and BSD.

- A is wrong: MIT's and BSD's silence on patents is beside the point here; Apache-2.0's own section 3 does carry a termination clause, and it applies.
- B is wrong: Termination under section 3 is scoped to the litigant's own licences; the NOTICE file's attribution list has no bearing on whose grant ends.
- D is wrong: Apache-2.0's patent-termination clause is a feature of its own permissive text and needs no copyleft licence layered on top to take effect.

### 3.

A downstream distributor modifies three files from an Apache-2.0 project that ships a NOTICE file, then redistributes the result. Beyond MIT's single notice-retention condition, what does Apache-2.0 additionally require here?

- **A.** Marking the three modified files with prominent notices that they were changed, and reproducing the upstream NOTICE file's attributions in the distributor's own NOTICE, documentation, or a generated display.
- **B.** Nothing additional — Apache-2.0's redistribution conditions reduce in practice to the exact same single copyright-notice requirement that MIT's one-paragraph licence text already carries in full, word for word.
- **C.** Filing a Contributor License Agreement with the upstream project before the modified files may be redistributed to anyone.
- **D.** Relicensing the three modified files under the GPL, since Apache-2.0 becomes a copyleft licence once any file is modified.

**Answer: A.** Section 4 conditions redistribution on carrying the licence text, marking modified files, retaining existing notices, and propagating an existing NOTICE file's attributions — obligations layered on top of, not replacing, the basic notice-retention condition MIT shares.

- B is wrong: Apache-2.0 section 4 adds modification-notice and NOTICE-propagation requirements that MIT's one-sentence condition does not have.
- C is wrong: A CLA governs contributing changes back to a project, not redistributing a downstream product built from its code.
- D is wrong: Apache-2.0 is not a copyleft licence at any point; none of section 4's conditions reach the licence of the derivative work as a whole.

### 4.

Why is a submitted pull request always a proposal rather than an applied change to the project?

- **A.** Only maintainers, and never committers, are legally permitted to accept changes submitted by outside contributors.
- **B.** The contributor must first fork the project into an independent line of development before any change can be reviewed at all.
- **C.** Open source licences legally require every proposed change to pass a formal committee vote of the whole community before it may ever be merged into the codebase.
- **D.** An outside contributor has no write access to the project's repository; the decision to merge belongs to someone who does, which is why review by that person is a structural step rather than a courtesy.

**Answer: D.** Mechanics differ by project, but the sequence is the same: raise or claim an issue, submit the change for review, and have someone with write access decide. The merge decision belongs to the project, not to the person proposing the change.

- A is wrong: Committers, who hold write access earned on merit, are the ones who ordinarily merge changes; the restriction is about access, not a legal distinction between roles.
- B is wrong: A platform fork used to open a pull request is a routine step ending in a merge upstream, not a permanent independent line of development.
- C is wrong: Licences say nothing about a project's review process; a merge decision is a matter of project governance, not a licence requirement.

### 5.

How does a Contributor License Agreement differ from a copyright assignment?

- **A.** A CLA grants the project a licence, often including patent rights, over the contribution, while the contributor keeps ownership; an assignment transfers ownership of the contribution outright.
- **B.** A CLA grants the contributor write access to the repository, while a copyright assignment only grants them read access to it.
- **C.** A CLA must be signed before Apache-2.0 section 3's patent grant applies to any contribution, while copyright assignment bypasses that section entirely.
- **D.** There is no real difference; both terms describe the identical transfer of copyright ownership from the contributor to the project.

**Answer: A.** A CLA is a grant of rights, not a transfer: it lets the project use, and often sublicense, a contribution while the contributor keeps ownership. Some projects use a Developer Certificate of Origin sign-off instead, asserting provenance rather than granting rights.

- B is wrong: Neither instrument grants repository access: the ASF, for one, requires a signed individual CLA before commit rights are given, but the rights themselves are conferred by the project on merit, not by the agreement.
- C is wrong: Section 3's patent grant is a term of the licence covering the project's code as distributed, not something a CLA switches on for individual contributions.
- D is wrong: This collapses a rights grant into an ownership transfer; the distinguishing fact is precisely that a CLA leaves ownership with the contributor.

### 6.

A developer modifies a GPLv3-licensed tool for internal use only, running it exclusively on the company's own servers with no copy ever leaving the building. What obligation does the GPL impose in this situation?

- **A.** The obligation to preserve the copyright notice throughout the internal build, exactly the way a permissive licence would require regardless of distribution.
- **B.** None, since the GPL's obligations attach to conveying a copy to someone else; running or modifying a work that is never conveyed is entirely unconditioned.
- **C.** The obligation to publish the Corresponding Source the moment any modification is made, whether or not the modified program is ever distributed.
- **D.** The obligation to offer the Corresponding Source to anyone who interacts with it over a network, since the tool is reachable from other machines on-site.

**Answer: B.** Copyleft's reciprocal obligation is a condition on an act of distribution, not something that spreads by contact. Modifying a covered program for internal use and never handing it to anyone obliges nothing at all.

- A is wrong: Copyleft's obligations are heavier than notice retention and, unlike a permissive licence, they trigger on distribution, not on the mere existence of a build.
- C is wrong: This is the "viral by contact" misreading the licence's own text rules out; obligations attach to conveying, not to modifying.
- D is wrong: That network trigger belongs to the AGPL's section 13, not the plain GPL, and nothing here describes remote users interacting with the tool.

### 7.

Critics describe copyleft as "viral." Which statement corrects that framing without denying that copyleft has real reach?

- **A.** Copyleft is a condition attached to the act of distributing a work, not something that spreads automatically by mere contact with the code.
- **B.** The framing is accurate: any file merely stored alongside GPL code on the same disk becomes GPL-licensed regardless of whether either is distributed.
- **C.** The framing is accurate only when the combined work is built with static linking rather than dynamic linking against the covered code.
- **D.** The framing is accurate: any product that once depended on a GPL library remains GPL-licensed permanently, even after the dependency is fully removed.

**Answer: A.** "Viral" is a pejorative, not a term of art, and it misdescribes the mechanism: copyleft is a condition on an act of distribution, triggered deliberately when a covered or combined work is conveyed to someone else.

- B is wrong: Storage proximity triggers nothing; only conveying a combined or modified work to someone else triggers the obligation.
- C is wrong: Linking mechanism can affect whether two programs form one combined work, but it does not make the underlying "spreads by contact" description accurate.
- D is wrong: The licence governs the work as conveyed; removing the dependency removes any basis for the obligation to have attached going forward.

### 8.

Why does Creative Commons itself recommend against using its licences for software?

- **A.** Because Creative Commons licences are fully compatible with every OSI-approved software licence, making the recommendation against them redundant rather than a real concern.
- **B.** Because content licensed under any Creative Commons variant can never be redistributed for commercial purposes.
- **C.** Because none of the Creative Commons licences, including the CC0 public domain dedication, are considered open at all.
- **D.** Its licences address neither source-code distribution nor patent rights, and most variants are not compatible with the major software licences.

**Answer: D.** Creative Commons licences were built for content rather than code and address neither source distribution nor patents, which is why the organisation itself steers software toward other licences and treats CC0 as the software-compatible exception.

- A is wrong: Compatibility is limited, not full — for example, only CC BY-SA 4.0 is one-way compatible with GPLv3, and most variants are not compatible with software licences at all.
- B is wrong: Only the NC (NonCommercial) variant restricts commercial use; several other Creative Commons variants permit it freely.
- C is wrong: CC0 is a genuine public domain dedication, generally accepted as GPL-compatible and acceptable for software, unlike the content-oriented CC licences.

### 9.

A developer downloads a dual-licensed library under its open source terms and wants to relicense their own unmodified copy for resale under separate commercial terms. May they?

- **A.** Yes, as long as they first sign a contributor licence agreement with the original project granting them the necessary rights.
- **B.** No; only the copyright holder can offer a work under both an open source and a commercial licence, and a recipient who merely received the code under one of those licences cannot grant it under the other.
- **C.** Yes, provided the new commercial terms remain compatible with the original open source licence the library was received under.
- **D.** Yes — dual licensing means the software has effectively entered the public domain for anyone who receives a copy under either of the two licences the rights holder chose to offer.

**Answer: B.** Dual licensing is offering the same code under two licences at once, and only the copyright holder — directly, or through contributor agreements it collects — can do it. A downstream recipient's copy stays under the terms it was received on.

- A is wrong: A CLA grants a project rights over a contribution; it does not hand a downstream recipient the rights holder's own relicensing authority.
- C is wrong: Compatibility between two licences does not create authority to relicense; that authority belongs to the copyright holder alone.
- D is wrong: Dual licensing changes nothing about the terms of the copy already received; it is not a route into the public domain for recipients.

### 10.

A community disagrees with a foundation-hosted project's technical direction and threatens to continue the code independently under new maintainers. Can the foundation or the original licence holder prevent this?

- **A.** No, but only because the community can click "fork" on the hosting platform, which merely creates a repository copy rather than exercising any legal right.
- **B.** Yes, since the foundation holds the project's trademark and can revoke the community's right to continue using the underlying code under any name.
- **C.** No: the licence itself guarantees the right to make and distribute derived works, so no licence holder or foundation can block a community from continuing the code independently.
- **D.** Yes, since the foundation sets the project's technical direction and can withdraw that direction from contributors it disagrees with.

**Answer: C.** The fork is the structural reason open source governance disputes have an exit: no licence holder, foundation, or vendor can prevent a community that disagrees with a project's direction from continuing the code themselves, though the fork must be renamed since trademarks stay with the original.

- A is wrong: A platform fork is a routine contribution step that ends in a merge upstream; the right being exercised here is the governance-sense fork, a permanent divergence.
- B is wrong: A fork does not inherit the project's trademark or name, but the code itself, under its licence, cannot be revoked from a fork that took a lawful copy.
- D is wrong: A foundation provides legal and governance infrastructure, not technical direction, which stays with the project's maintainers rather than the foundation itself.

### 11.

Which pairing correctly separates the two everyday meanings of the word "fork" in open source work?

- **A.** A fork and a clone name the same operation; both create a server-side copy of a repository used to open a pull request.
- **B.** A platform fork requires a signed contributor licence agreement before it may be created, while a governance fork does not require one.
- **C.** A platform fork is a server-side repository copy made as the first step of an ordinary contribution that ends in a merge upstream; a governance fork is a permanent divergence with its own maintainers and releases.
- **D.** A governance fork can only occur with the original project's explicit written permission, since the licence does not grant the right to fork automatically.

**Answer: C.** In the governance sense, forking is a deliberate, permanent split with independent maintainers; in day-to-day platform vocabulary, "fork" also names a server-side repository copy created as the first step of an ordinary contribution — the opposite outcome.

- A is wrong: Cloning copies a repository locally; forking creates a server-side copy, typically used when the contributor lacks write access to the original.
- B is wrong: Neither meaning of "fork" depends on a CLA; a CLA concerns contributing changes back, not the act of copying a repository.
- D is wrong: Open source licences grant the right to make and distribute derived works automatically; no separate permission from the original project is required.

### 12.

A company sells discs of a program for $20 each. Every buyer receives the right to run the program for any purpose, study and change its source, and redistribute copies, including modified ones. Does this satisfy the Free Software Foundation's four freedoms?

- **A.** No, because the Free Software Foundation and the Open Source Initiative maintain a single joint list of approved licences, and this vendor's terms were checked against the wrong organisation's separate criteria entirely.
- **B.** Yes — selling copies is unrestricted; only the enumerated freedoms to run, study, redistribute and modify decide the question, never the price charged.
- **C.** No, because charging money for the software directly conflicts with the word "free" in free software.
- **D.** Only if the buyer additionally signs an agreement promising not to resell the discs to anyone else.

**Answer: B.** The four freedoms concern rights, not cost. Selling copies violates nothing, and this licence grants freedoms 0 through 3 in full, so it qualifies as free software regardless of its $20 price.

- A is wrong: The FSF and OSI maintain separate lists against different texts; there is no single joint list to consult incorrectly.
- C is wrong: Free as in freedom, not price: freedom 2 and 3 protect redistribution, and nothing in the four freedoms bars a sale.
- D is wrong: No such additional agreement is part of the four freedoms; redistribution rights travel with the copy automatically.

### 13.

FOSS is used as a neutral umbrella term because two separate organisations judge overlapping sets of licences against different texts and for different reasons. Which pairing correctly describes the two?

- **A.** The Open Source Initiative argues from user freedom as an ethical position; the Free Software Foundation runs the review process behind the Open Source Definition's approved-licence list and publishes it on the Initiative's behalf.
- **B.** The Free Software Foundation argues from user freedom via the four freedoms; the Open Source Initiative argues the same licences on practical and development grounds via the Open Source Definition.
- **C.** The Software Package Data Exchange assigns identifiers to both organisations' approved licences, which is why their two lists match item for item.
- **D.** Free software and open source software are opposing camps whose licences reject and actively exclude one another.

**Answer: B.** FOSS exists precisely so a sentence can name both camps without taking a side: the FSF's ethical framing and the OSI's practical framing judge nearly the same licences against different documents, maintained by different bodies.

- A is wrong: This swaps the two organisations' roles and their defining documents entirely.
- C is wrong: SPDX assigns identifiers but does not decide either list, and the two organisations' lists overlap heavily without matching exactly.
- D is wrong: They are two framings that land on almost the same licences, not opposing or mutually exclusive camps.

### 14.

What does a neutral foundation such as the Linux Foundation or the Apache Software Foundation actually provide to a project it hosts?

- **A.** Legal entity status, stewardship of assets and trademarks, shared infrastructure, and governance rules — not technical direction, which stays with the project's own maintainers.
- **B.** Paid engineering staff, employed by the foundation itself, who write and maintain the code of each project it hosts.
- **C.** A guarantee that every contributor automatically becomes a committer with write access after their first merged change is accepted.
- **D.** Direct control over each hosted project's technical roadmap, exercised through decisions made by the foundation's board.

**Answer: A.** Neutral non-profits such as the Linux Foundation and Apache Software Foundation hold a project's assets, trademarks, and infrastructure so no single vendor controls it, while deliberately leaving technical direction to the project's own maintainers.

- B is wrong: Foundations do not staff their projects' development: the ASF states that all participants in its projects are volunteers and that nobody is paid by the foundation to do their job.
- C is wrong: Committer status is earned on merit within each project over time; a foundation does not grant it automatically after one contribution.
- D is wrong: A foundation holds assets and sets governance rules; the technical roadmap remains a decision for the project's own maintainers, not the board.

### 15.

The Linux kernel is released under which licence and version, and what does that precise designation prevent?

- **A.** LGPL-2.1-only, which is why proprietary drivers may link against the kernel without conveying their own source code.
- **B.** GPL-3.0-or-later, since all software released as part of the GNU Project defaults automatically to whichever licence version is currently the newest one published.
- **C.** GPL-2.0-only, not "version 2 or later", so the kernel's terms cannot be swapped for GPLv3's without the consent of every copyright holder involved.
- **D.** Whichever version happens to be compatible with the licences of the components that were most recently merged into the kernel tree.

**Answer: C.** The kernel is GPL-2.0-only, not "v2 or later" — a fact worth holding exactly, since it determines whether GPLv3 terms could ever apply and it is the concrete example the exam reaches for whenever it wants a copyleft licence.

- A is wrong: The kernel is licensed under the plain GPL, not the LGPL, and its one stated exception is the syscall note, which keeps GPL requirements off user-space programs that call the kernel rather than off drivers built into it.
- B is wrong: There is no such automatic default; the kernel's licence was fixed as GPL-2.0-only deliberately, and it has not moved to GPLv3.
- D is wrong: A project's own licence does not shift based on what gets merged into it; compatibility instead constrains what may be merged.

### 16.

A company distributes a modified GPLv2-only tool and is later sued by a contributor who alleges the tool infringes a patent covering that contributor's own submitted code. Under GPLv2 alone, what protection does the licence text itself give the company?

- **A.** None from the licence text: GPLv2 contains no express patent grant and no patent-termination clause, and GPLv3 is the version that added both.
- **B.** The AGPL's network-interaction provisions, since GPLv2 incorporates AGPL section 13 by reference for any distributed, patent-affected work.
- **C.** The same implied patent licence GPLv3 carries, since both versions were published by the same organisation and are treated as legally identical on patents.
- **D.** Apache-2.0's patent-termination clause, invoked on the theory that a permissive licence's patent terms carry over to any GPLv2 work they are combined with.

**Answer: A.** GPLv3 adds to GPLv2 an express patent grant and a cure provision for a terminated licence; GPLv2 has neither and terminates on violation with no cure clause, so the company's protection here is nothing that the GPLv2 text itself supplies.

- B is wrong: The AGPL is a separate licence with its own network trigger; GPLv2 does not incorporate any of its provisions by reference.
- C is wrong: Sharing a publisher does not make the two versions' terms identical; GPLv3 section 11 is an express patent grant that GPLv2's text never contains.
- D is wrong: Apache-2.0 section 3 terminates only 'patent licenses granted to You under this License', so it reaches works licensed under Apache-2.0 and gives no protection to a work distributed under GPLv2.

### 17.

How does the LGPL let a proprietary application link against a covered library without the whole application becoming GPL-licensed?

- **A.** It confines the same-licence condition to the library itself; the application may be conveyed under its own terms if users can relink against a modified library (LGPLv3 §4, or LGPL-2.1 §6).
- **B.** It does not — linking a proprietary application against any LGPL library still requires the entire application to be released under the full terms of the GPL, exactly as with the plain GPL.
- **C.** It grants the exception only when the application is never offered as a network service, mirroring the AGPL's network trigger in reverse.
- **D.** It removes copyleft obligations entirely, so the library itself may also be redistributed under proprietary terms once any application links to it.

**Answer: A.** Weak copyleft narrows the reciprocal obligation to a defined boundary. The LGPL confines it to the library, letting the linking application ship under its own terms once relink conditions are met, while the library's own code stays copyleft.

- B is wrong: That whole-work reach is precisely what strong copyleft does and weak copyleft is designed to avoid for the linking application.
- C is wrong: The LGPL's relinking condition has nothing to do with network offering; that concern belongs to the AGPL's separate section 13 trigger.
- D is wrong: Modifications to the library itself stay under the LGPL; only the surrounding application gains freedom from the same-licence condition.

### 18.

Why can MIT-licensed code be absorbed into a GPL-licensed project, while GPL-licensed code cannot be absorbed into an MIT-licensed one?

- **A.** MIT-licensed code is always written in fewer lines than GPL-licensed code, so it merges more easily into any codebase regardless of licence terms.
- **B.** MIT's only condition, carrying the notice forward, can still be met once the combined work goes out under the GPL; the GPL requires the whole conveyed work to go out under the GPL, which an MIT-only licence cannot promise.
- **C.** The GPL only reaches code written after the licence's own effective date, so older MIT-licensed code already in a project is exempt from its terms.
- **D.** Compatibility actually runs both directions equally; either licence can absorb the other as long as attribution notices are preserved throughout.

**Answer: B.** Compatibility is directional: permissive code can enter a copyleft project because its condition (carry the notice) survives the combination, while GPL code cannot enter a permissive project because the GPL's whole-work condition cannot be promised by permissive terms.

- A is wrong: Code length has nothing to do with legal compatibility; the direction is set by what each licence's conditions require of the combined work.
- C is wrong: The GPL's reach depends on how code is combined and conveyed, not on when the code was originally written.
- D is wrong: This is the assumption the directional rule exists to correct; the reverse direction fails because the GPL's whole-work condition cannot be satisfied under permissive terms.

### 19.

A shipped product combines only licences that are fully compatible with each other. Does that fact alone guarantee the product is compliant?

- **A.** No. Compatibility asks whether the combination was legally permitted at all; compliance separately asks whether the obligations that combination triggered, such as notices and source offers, were actually discharged before shipping.
- **B.** Yes, since compatibility and compliance both refer to the same question of whether the combination is legally permitted.
- **C.** Yes, provided the shipped artifact also includes a Software Bill of Materials listing every component it contains.
- **D.** Yes, because a compatible combination automatically satisfies every component licence's own notice, attribution, and source-offer requirements as an automatic side effect of the components being legally combinable in the first place.

**Answer: A.** Compatibility and compliance are routinely offered as each other's distractor. Compatibility asks whether the combination was permitted; compliance asks whether the obligations that combination triggered were actually met when the product shipped.

- B is wrong: They answer different questions: one is about whether the combination was allowed, the other about whether the resulting obligations were met.
- C is wrong: An inventory makes the obligations enumerable; it does not discharge any of them on its own.
- D is wrong: Compatibility says the combination is permitted; it does nothing to automatically assemble the notices each licence separately requires.

### 20.

A redistributor ships a modified BSD-3-Clause utility and, in the product's marketing materials, names the original author's company as an official partner to help promote the product. Which clause does this violate?

- **A.** Section 4's NOTICE-file propagation requirement, since the marketing materials never reproduced an upstream NOTICE file's attributions.
- **B.** None — BSD-3-Clause has no restriction on how a redistributor markets a derived product, only on copying the underlying code itself.
- **C.** The non-endorsement clause: using the copyright holder's or contributors' names to endorse a derived product without specific prior written permission is exactly what BSD-3-Clause's third clause forbids.
- **D.** The requirement that any derived product be licensed under terms compatible with the original before it may be sold commercially.

**Answer: C.** BSD-3-Clause adds a third clause on top of BSD-2-Clause's notice, conditions and disclaimer requirements, forbidding use of the copyright holder's or contributors' names to endorse derived products without permission — which is exactly what this marketing use does.

- A is wrong: BSD has no NOTICE-file concept at all; that requirement belongs to Apache-2.0, a different permissive licence.
- B is wrong: The non-endorsement clause exists precisely to restrict this kind of marketing use of the original author's name.
- D is wrong: BSD imposes no such reach into the derivative's own licence; that would be a copyleft-style condition BSD does not carry.

### 21.

Which condition, if any, does the plain MIT licence impose regarding patents held by the code's contributors?

- **A.** An implied patent licence limited to claims necessarily infringed by the contributor's own code, mirroring Apache-2.0 section 3's scope.
- **B.** None, because MIT says nothing about patents at all, which is the specific difference Apache-2.0's express patent grant addresses.
- **C.** A reciprocal obligation requiring any patented derivative work to be licensed back to the community under MIT's own terms.
- **D.** The identical patent-litigation-termination clause Apache-2.0 carries, since both licences are commonly grouped together as the permissive family.

**Answer: B.** Neither MIT nor any BSD variant grants patent rights, requires a NOTICE file, or requires modified files to be marked — a difference from Apache-2.0, not a reassurance, since it means patent risk is simply left unaddressed.

- A is wrong: MIT contains no patent language at all, implied or otherwise; that scoped grant is Apache-2.0's own express provision.
- C is wrong: That reach-into-the-derivative pattern describes copyleft reasoning, which MIT, as a permissive licence, does not carry.
- D is wrong: Being grouped in the same permissive family does not make MIT's terms identical to Apache-2.0's; the termination clause is specific to Apache-2.0's section 3.

### 22.

In a typical open source project, what separates a contributor from a committer?

- **A.** A contributor proposes changes; a committer has been granted write access to the repository, earned on merit, and is the one who can actually merge them.
- **B.** A contributor works only through a mailing list, while a committer works only through pull requests on a hosting platform.
- **C.** A committer must be a paid employee of the foundation that hosts the project, while a contributor is always an unpaid volunteer with no formal ties.
- **D.** Seniority at the contributor's own outside employer determines who becomes a committer, independent of the actual contributions made to the project.

**Answer: A.** Responsibility increases along the chain from user to contributor to committer to maintainer, and it is earned by merit within the project. The concrete line between contributor and committer is write access to merge changes.

- B is wrong: Mechanics differ by project, not by role; either mechanism can be used by a contributor or a committer, depending on the project's workflow.
- C is wrong: Committer status is earned by merit and demonstrated contribution, not by employment status at the hosting foundation.
- D is wrong: The chain is earned by merit within the project, not by outside seniority or employment, which is exactly what the role structure is designed to keep separate.

### 23.

What does the Open Source Initiative do?

- **A.** It certifies individual software projects as open source directly, inspecting each maintainer's published code before granting the certification.
- **B.** It holds trademarks and infrastructure on behalf of hosted projects, in the manner of a neutral foundation.
- **C.** It stewards the ten-criterion Open Source Definition and runs the review process that decides which licences are approved against it.
- **D.** It is the body that maintains the Free Software Definition and the enumeration of the four freedoms.

**Answer: C.** The OSI approves licences against the Open Source Definition's ten criteria; it does not certify projects, hold assets for foundations, or maintain the Free Software Foundation's separate four-freedoms definition.

- A is wrong: The OSI approves licences, not projects; a project is open source because the licence it uses is OSI-approved.
- B is wrong: Holding assets and infrastructure for hosted projects is what a foundation such as the Linux Foundation does, not the OSI's role.
- D is wrong: That document and its four freedoms belong to the Free Software Foundation, a separate organisation with its own criteria.

### 24.

A vendor publishes a product's complete source code in a public repository, but the licence prohibits offering the software as a competing hosted service. Under the Open Source Definition, is this open source software?

- **A.** Yes, because publishing the source publicly is the one thing proprietary software withholds, and this vendor did not withhold it.
- **B.** No, but only because the licence never uses the phrase "free software" anywhere in its text.
- **C.** Yes, since the Open Source Definition is only concerned with whether the source is visible to the public.
- **D.** No; restricting a field of endeavour such as competing commercial use fails OSD 6, regardless of how visible the source is.

**Answer: D.** The Open Source Definition's ten criteria decide the question, not marketing or source visibility. A no-competing-use clause restricts a field of endeavour (OSD 6), which disqualifies the licence however openly the code is published.

- A is wrong: Source visibility alone settles nothing; proprietary software can also be source-available while still reserving redistribution.
- B is wrong: The Open Source Definition does not require any particular wording; it is judged on what rights the licence grants.
- C is wrong: This is the reasoning the field-of-endeavour criterion exists to rule out; visibility is necessary but nowhere near sufficient.

### 25.

Product A is sold for a subscription fee, but its licence grants every recipient the source code plus the rights to modify and redistribute it, including modified versions. Product B is downloadable at no cost, but its licence forbids redistributing any modified copy. Which product is open source software?

- **A.** Product B, because the Free Software Foundation's definition of "free" is about price rather than the rights a licence happens to grant.
- **B.** Neither, since charging money for a copy disqualifies a licence from open source status under any of the ten criteria.
- **C.** Product B, because barring redistribution of modified copies is simply a stricter, more protective variant of the same open source terms rather than a different category of licence entirely.
- **D.** Product A, since price is irrelevant to the definition and its licence grants the modification and redistribution rights the definition requires.

**Answer: D.** Two of the ten OSD criteria decide most such questions: free redistribution without a required royalty, and permission to make and distribute derived works. Product A satisfies both; Product B fails the second regardless of its zero price.

- A is wrong: "Free" in free software means liberty, not price, so a zero-cost download that bars redistribution is neither free software nor open source.
- B is wrong: OSD 1 explicitly permits selling open source software as part of an aggregate distribution; charging is not disqualifying.
- C is wrong: Barring redistribution of derived works removes exactly the right OSD 3 requires; it is a disqualifying restriction, not a stricter variant.

### 26.

A startup embeds a lightly modified MIT-licensed parsing library inside its closed-source commercial product and ships only a compiled binary. What does the MIT licence require of the startup?

- **A.** That the modified parsing library, and the entire product it has been combined into, be released under the MIT licence as well.
- **B.** Nothing at all, since permissive licences are widely understood to impose no conditions of any kind on anyone who reuses or redistributes the code.
- **C.** Only that the copyright notice and permission notice travel with the copies distributed; nothing about the product's own source or its licence.
- **D.** That the startup grant every recipient an express, litigation-terminating patent licence covering its own modifications to the library.

**Answer: C.** MIT's conditions are of one kind: preserve the copyright notice, licence text and disclaimer. Nothing in it reaches the licence of the surrounding work, so the startup may ship a closed binary with nothing published but an attribution file.

- A is wrong: That reciprocal, whole-work reach is copyleft's defining feature; a permissive licence conditions nothing about the derivative's own licence.
- B is wrong: Permissive is not obligation-free: stripping the notice out of an MIT-licensed file is the standard permissive-licence violation.
- D is wrong: MIT says nothing about patents at all; that express patent grant is Apache-2.0's addition, not MIT's.

### 27.

Which single fact separates a permissive licence from a copyleft one?

- **A.** Whether the licence permits commercial use at all — permissive licences allow it freely and copyleft licences forbid it outright in every circumstance.
- **B.** Whether the licence conditions the licence of a derivative work: a permissive licence does not, while a copyleft licence requires the same terms to carry forward on distribution.
- **C.** Whether the licence is compatible with the GPL — permissive licences are always fully compatible with it, and copyleft licences are never compatible with one another at all, under any circumstances.
- **D.** Whether the licence has been approved by the Open Source Initiative — permissive licences are approved by it and copyleft licences never are.

**Answer: B.** The separating axis is whether the licence says anything about the licence of what you build: copyleft imposes the same terms on the distributed derivative, and permissive imposes only attribution. Neither commercial use nor OSI approval status decides it.

- A is wrong: Copyleft does not forbid commercial use or charging for copies; it constrains what is passed to recipients, not whether money changes hands.
- C is wrong: Compatibility varies by specific licence and version and is not a fixed permissive-versus-copyleft rule.
- D is wrong: Both families include OSI-approved licences; approval status is not what separates them.

### 28.

A company distributes a zero-cost "community edition" of its database engine. The source is not published, and the licence permits running the software but forbids modifying or redistributing it. What is this software?

- **A.** Open source software offered as freeware, since no fee is charged for downloading a copy and the vendor markets it as free to use for everyone.
- **B.** Proprietary software: price is irrelevant here, and the licence withholds the source and reserves modification and redistribution rights to the vendor.
- **C.** Neither open source nor proprietary, since freeware is understood to be its own separate licensing category carrying no legal reservation of rights of any kind at all.
- **D.** Source-available software, since the vendor retains the option to publish the source later without changing any of the licence terms.

**Answer: B.** Copyright reserves all rights to the author by default; this licence gives away only the right to run a copy, which is the proprietary pattern regardless of the zero price attached to it.

- A is wrong: Zero cost is not evidence of open source status; the licence still withholds source and reserves modification and redistribution.
- C is wrong: Zero cost is a price point, not a licence category; a program whose users lack the freedoms to study, modify and redistribute it is nonfree however little it costs.
- D is wrong: Source-available describes a licence where the code is published; nothing here has been published, so the label does not apply.

### 29.

A vendor publishes a product's full source code publicly, but its licence bars any commercial use or competing service built from it. How should this licence be classified?

- **A.** Open source, since the Open Source Definition is only concerned with whether the source is available for anyone in the public to read at will.
- **B.** Proprietary only if the vendor also charges a fee for access; a free download of visible source is automatically considered open source regardless of any other restriction in the licence text.
- **C.** Undetermined until the licence is checked for compatibility against whatever other components it might later be combined with in a shipped product.
- **D.** Proprietary. Publishing the source does not grant the field-of-endeavour freedom the Open Source Definition requires, so the licence remains proprietary despite the visible code.

**Answer: D.** Source visibility satisfies nothing on its own. A no-competing-use clause restricts a field of endeavour and removes the licence from open source status, leaving a source-available product that is proprietary in the licensing sense that matters.

- A is wrong: Readability is necessary but not sufficient; the OSD also requires derivative-work rights and no field-of-endeavour restriction.
- B is wrong: Price plays no role in this classification; the disqualifying feature is the field-of-endeavour restriction, not any fee.
- C is wrong: Compatibility with other components is a separate question from whether this licence alone meets the Open Source Definition.

### 30.

What does a Software Bill of Materials establish about a shipped product, on its own and without any further work?

- **A.** That the product is licence-compliant, since every listed component's obligations have already been checked as part of producing the inventory.
- **B.** That every listed component's licence is compatible with every other one, since an incompatible combination could not have been assembled and inventoried.
- **C.** That the product is free of known vulnerabilities, since the standard inventory formats include a vulnerability scan by default.
- **D.** An inventory of the product's components, their versions and their dependency relationships — it makes licence and vulnerability questions answerable, but it answers none of them by itself.

**Answer: D.** An SBOM is an inventory, increasingly required for supply-chain transparency. It is not itself a compliance artifact and not a vulnerability scan: it makes licence and CVE questions answerable, and resolves neither on its own.

- A is wrong: Producing an inventory does not discharge any licence obligation; compliance still requires separately meeting each component's own terms.
- B is wrong: An SBOM records what was shipped; it does not verify that the components were legally combinable in the first place.
- C is wrong: An SBOM is an inventory, not a vulnerability scan; it makes CVE questions answerable against the listed versions but performs no scan itself.

### 31.

Why does shipping a binary-only build of a GPL-licensed program create a compliance problem that shipping the same binary-only build of an MIT-licensed program does not?

- **A.** The GPL forbids compiling the covered program into a binary form in the first place, so any binary build already violates it.
- **B.** MIT requires a NOTICE file to accompany every binary it ships to a recipient, a requirement the GPL text does not carry at all.
- **C.** The GPL obliges anyone who conveys object code to also make its Corresponding Source available to recipients; permissive licences impose no source obligation at all.
- **D.** Both licences impose exactly the same source obligation on any binary-only release, since every open source licence treats compiled and source forms as legally identical in every respect.

**Answer: C.** Several licences attach obligations specifically to distributing the binary form. The GPL's Corresponding Source requirement is triggered by conveying object code; permissive licences require only that notices travel with whatever form is shipped.

- A is wrong: The GPL does not forbid compiling; it conditions distributing the resulting object code on offering the Corresponding Source.
- B is wrong: MIT has no NOTICE-file concept; that requirement belongs to Apache-2.0, not to MIT or to the GPL.
- D is wrong: This is the assumption the distinction exists to correct: only copyleft licences attach an obligation to the binary form.

