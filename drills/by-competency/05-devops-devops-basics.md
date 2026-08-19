<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — DevOps Fundamentals :: DevOps Basics

34 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A rollback is planned for a service, but the artifact registry has already garbage-collected last week's image. What happens to the rollback?

- **A.** It silently becomes a rebuild from an old commit rather than a retrieval, because the registry is what turns rollback into a retrieval in the first place.
- **B.** Nothing changes, since rollback always rebuilds a version from source regardless of what the registry currently holds.
- **C.** The rollback can still proceed cleanly by requesting the same version number from the source repository instead.
- **D.** The rollback still succeeds without issue, since a registry only ever stores metadata and the built artifact itself lives in source control beside the code.

**Answer: A.** A registry stores built artifacts and images so a specific version can be retrieved and redeployed. If that artifact no longer exists anywhere, rollback quietly turns into a rebuild of an old commit, which may not reproduce the same result.

- B is wrong: The whole point of a registry is that rollback is normally a retrieval rather than a rebuild; this claims that never mattered.
- C is wrong: A source repository holds inputs, not the built artifact; the two are not interchangeable stand-ins for one another.
- D is wrong: A registry stores the built artifact itself, not merely metadata about it, which is exactly why losing it matters.

### 2.

A team wants to adopt continuous deployment, but its automated suite exercises only unit-level behaviour. What does that imply about the plan?

- **A.** Nothing, because continuous deployment only requires the pipeline to have no manual gate, independent of what level its tests happen to exercise on the way through.
- **B.** The pipeline should add an extra manual stage after the tests to compensate for the missing coverage.
- **C.** It does not matter, since automated tests already run on every change regardless of what level they exercise.
- **D.** The strength of the safety net sets the ceiling on the release practice, so nothing else stands between a merge and production once the gate is removed.

**Answer: D.** Automated testing is the safety net that makes frequent deployment tolerable, so the strength of the net sets the ceiling on the release practice. A team cannot honestly run continuous deployment on unit-level coverage alone.

- A is wrong: Removing the gate is necessary but not sufficient; the test coverage left standing has to be able to catch what the gate used to catch.
- B is wrong: Adding a manual stage would make the practice continuous delivery, which is a different, valid but different, choice than the plan describes.
- C is wrong: Running on every change says nothing about scope; a suite that only reaches unit-level behaviour cannot catch integration or end-to-end defects.

### 3.

One release must ship a schema change alongside code that is incompatible with the previous version, so the two cannot coexist serving traffic. A later, unrelated release ships a small, backward-compatible feature that the team wants to validate against real traffic before committing to it fully. Which strategy fits each release?

- **A.** Blue-green for the first release, since it never mixes versions at all; canary for the second, since it deliberately samples traffic to gather evidence before widening.
- **B.** Canary for the first release, since routing a small slice bounds the exposure of the incompatible schema change; blue-green for the second, since a full cutover settles it.
- **C.** A rolling deployment for both releases, since replacing instances in batches works regardless of whether the schema is compatible.
- **D.** Blue-green for both releases, since an all-at-once cutover is always the safest strategy available regardless of what changed.

**Answer: A.** Each strategy fails differently. Blue-green never splits traffic and suits an all-at-once, lockstep change; canary splits it deliberately to learn from production; a rolling deployment splits it only as a side effect of replacing instances.

- B is wrong: A canary briefly runs both versions against a live database, which is exactly what an incompatible schema change cannot tolerate.
- C is wrong: A rolling deployment guarantees a mixed-version window, which is precisely what an incompatible schema change cannot survive.
- D is wrong: Blue-green needs a full second environment and gives up the chance to learn from real traffic, which the second release does not need to pay for.

### 4.

A blue-green cutover switches all traffic to the new environment, and a defect that survived pre-switch testing is discovered ten minutes later. Both versions share one database, and the new version has already written to it. What happens to the promised near-instant rollback?

- **A.** It still holds, because rollback of the code and rollback of the underlying data are the same operation by definition.
- **B.** It still holds, since blue-green always keeps some percentage of users on the old version as a built-in fallback.
- **C.** It still holds regardless, because the old environment is retained and untouched no matter what the new version wrote while it was serving.
- **D.** It is lost, because switching traffic back does not undo the writes the new version already made against the shared database.

**Answer: D.** A shared database that both versions must use silently removes the instant-rollback property, because switching traffic back does not un-apply a schema change or un-write rows the new version already created.

- A is wrong: Code and data rollback are separate concerns, and redeploying old code never automatically undoes writes or migrations.
- B is wrong: Blue-green switches all traffic at one cutover; there is no percentage split at any point, unlike canary.
- C is wrong: The old environment being untouched only protects the code path; a shared database is written to by whichever version is live.

### 5.

Staging and production are each built separately from the same source commit, using slightly different base images and dependency resolutions each time. What class of problem does this practice invite?

- **A.** None, since both environments are still climbing the same ladder from development up toward production.
- **B.** It only matters for developer laptops, and not for environments that sit further along the pipeline.
- **C.** It defeats build once, deploy many, because what was tested in staging is not the same binary running in production even though the source commit is identical.
- **D.** None at all, provided the two separate builds are each triggered from the exact same commit hash, which fixes every input the build consumes.

**Answer: C.** One build produces one artifact, which is then promoted unchanged through every environment. Building separately per environment can silently produce different binaries from an identical commit, which is a whole class of hard-to-diagnose incidents.

- A is wrong: Climbing the same ladder of environments does not fix a rebuild that produces a genuinely different binary at each rung.
- B is wrong: Parity for developer environments is a separate concern; the build-once rule applies equally to staging and production.
- D is wrong: An identical commit can still produce different binaries when the base image or dependency resolution differs between builds.

### 6.

A team routes one percent of traffic to a new version, measures nothing about how it behaves, and widens the share on a fixed weekly schedule regardless of what happened. What is missing from this practice?

- **A.** The all-at-once cutover, since a canary release is only complete once every user has been switched over simultaneously at a single point.
- **B.** A fixed batch schedule, since instances should be replaced in equal-sized groups rather than by adjusting a traffic percentage.
- **C.** The evidence, because a canary that nobody is measuring is a slow rollout with extra steps, since the entire value is in what the small slice reveals.
- **D.** Nothing is actually missing here, provided the deployment mechanism itself is fully automated end to end.

**Answer: C.** A canary's entire purpose is learning from production: a slice of traffic is watched so that widening is a decision informed by real measurement. Without that measurement, the same rollout provides none of the safety it is chosen for.

- A is wrong: An all-at-once cutover describes blue-green; a canary is defined by gradual widening, not a single switch.
- B is wrong: Batch-based replacement describes a rolling deployment; a canary is defined by a traffic share, not by which instances are swapped.
- D is wrong: Automation of the mechanism does not substitute for watching error rate, latency, and business signals during the exposure.

### 7.

A canary release and an A/B test both split traffic between two versions of a service. What separates the two?

- **A.** Nothing meaningfully separates them, since a canary release is simply the name engineers use for an A/B test conducted against live production infrastructure rather than against a test environment of its own.
- **B.** A canary splits traffic gradually over time, while an A/B test always switches every user at once in a single cutover.
- **C.** A canary's traffic split is chosen deliberately, while an A/B test's split is only a side effect of replacing instances in batches.
- **D.** A canary asks whether a new build is defective and is expected to reach every user; an A/B test tests a hypothesis with two variant implementations and is expected to end with one of them discarded.

**Answer: D.** Both split traffic between versions, but a canary is a health check expected to widen to 100 percent once the new build proves sound, while an A/B test is a preference experiment expected to end with the losing variant removed.

- A is wrong: Treating them as synonyms erases the different questions each is designed to answer and the different outcome each expects.
- B is wrong: That single, all-at-once switch describes blue-green; an A/B test can split traffic gradually or evenly, much like a canary can.
- C is wrong: A side-effect split from batch replacement describes a rolling deployment, not an A/B test, which is also deliberate.

### 8.

Terraform, Ansible, and Jenkins are each proposed for a new pipeline. Which one provisions infrastructure, which configures hosts that already exist, and which runs the build and test stages?

- **A.** Terraform provisions infrastructure from a declaration, Ansible configures the hosts that already exist, and Jenkins runs the pipeline's build and test stages.
- **B.** Terraform is the CI server that runs build and test, Ansible provisions the infrastructure from a declaration, and Jenkins configures the hosts that already exist over SSH.
- **C.** All three are infrastructure-as-code tools, and they are distinguished only by which cloud provider each one targets.
- **D.** Terraform and Ansible both run the pipeline's stages, while Jenkins is reserved for provisioning new infrastructure.

**Answer: A.** Recognition of the category each tool belongs to is what matters. Terraform provisions, Ansible configures existing hosts, and Jenkins (alongside GitHub Actions and GitLab CI) runs the pipeline's stages.

- B is wrong: This is category confusion, assigning each tool to the wrong one of the three jobs it does not perform.
- C is wrong: Only Terraform provisions infrastructure declaratively; Ansible configures existing hosts and Jenkins runs pipeline stages instead.
- D is wrong: Running pipeline stages is Jenkins's job; neither Terraform nor Ansible executes build or test stages.

### 9.

Three teams run the same pipeline definition. Team A's every passing change deploys automatically to an acceptance environment and then waits for a release manager to approve going further. Team B's every passing change goes straight to production with no approval step at all. Team C merges frequently and ends up with a tested artifact, deployed nowhere. Match each team to continuous integration, continuous delivery, or continuous deployment.

- **A.** Team C is continuous integration, Team A is continuous delivery, and Team B is continuous deployment.
- **B.** Team A is continuous deployment, since an acceptance environment counts as production for the purpose of this comparison.
- **C.** Team C is continuous delivery, because producing a tested artifact already makes it releasable at any time.
- **D.** Team A and Team B are the same practice, differing only in which environment name their pipeline happens to use.

**Answer: A.** How far an automatically verified change travels on its own separates the three: CI stops at a tested artifact, delivery carries it to the door of production and waits for a person, and deployment walks it through unattended.

- B is wrong: An acceptance environment is exactly not production; the human approval step is what keeps Team A at delivery.
- C is wrong: Releasable requires having reached at least an acceptance environment, which Team C's artifact never does.
- D is wrong: The difference between them is exactly the human gate, not a naming choice about environments.

### 10.

A team practising continuous delivery releases to production twenty times a day, each release still triggered by a person clicking a button. Does this frequency mean the team has actually adopted continuous deployment?

- **A.** Yes, since twenty releases a day is fast enough that the human step has become a formality rather than a genuine decision point in the release.
- **B.** Yes, because continuous deployment is defined by how often releases happen rather than by whether an approval step exists.
- **C.** No, because release frequency is not what separates the two practices; continuous delivery constrains who decides, and a human decision is still made on every one of the twenty releases.
- **D.** No, but only because the team has not also automated its rollback procedure alongside the release button.

**Answer: C.** The difference from continuous deployment is exactly the manual gate and nothing else. A team can practise continuous delivery at any release frequency, so long as a person still decides each time.

- A is wrong: However fast the cadence, the step is still a real decision point; frequency alone does not remove the gate.
- B is wrong: This inverts the actual definition, which turns on the presence or absence of the human gate, not on cadence.
- D is wrong: A rollback procedure is part of a complete delivery practice, but it is not what distinguishes delivery from deployment here.

### 11.

An organisation removes the manual approval step from its delivery pipeline, so every passing change now reaches production unattended. Its automated test suite covers only unit-level behaviour. What does this scenario describe?

- **A.** Continuous delivery, since removing a single approval step from the pipeline is still consistent with the release waiting on a human decision made somewhere else in the organisation's approval chain before anything reaches users.
- **B.** A safe practice, provided the team has documented its rollback procedure somewhere for later reference.
- **C.** A fault, because continuous deployment is normally paired with comprehensive automated testing and progressive rollout, since nothing else stands between a defect and users once the gate is gone.
- **D.** Continuous integration, because the stated risk concerns test coverage rather than anything about deployment.

**Answer: C.** Whether an organisation can safely adopt continuous deployment is a question about its test suite and rollback story, not about ambition. Weak coverage paired with no gate is a fault, not a neutral practice.

- A is wrong: No gate remains anywhere in the description, which is exactly the property that makes this deployment rather than delivery.
- B is wrong: A documented rollback does not compensate for a test suite that cannot catch what an unattended pipeline needs it to catch.
- D is wrong: The scenario explicitly reaches production automatically, which is well past where continuous integration's scope ends.

### 12.

Which implication actually holds between continuous delivery and continuous deployment?

- **A.** Continuous delivery implies continuous deployment, and reversing that direction is the actual error to watch for.
- **B.** The two imply each other, since both automate the same pipeline up to the point where a release could happen.
- **C.** Continuous deployment implies continuous delivery, but continuous delivery does not imply continuous deployment.
- **D.** Neither implies the other; each depends independently on continuous integration having already run.

**Answer: C.** Continuous deployment implies continuous delivery because it satisfies everything delivery requires and then removes the remaining gate. Reversing the implication, assuming delivery guarantees deployment, is the standard error.

- A is wrong: This states the implication backwards; delivery is the weaker claim and does not guarantee the gate has been removed.
- B is wrong: Sharing an abbreviation and a pipeline is exactly why the two are confused, but the gate makes them distinct, non-equivalent practices.
- D is wrong: Both do depend on continuous integration, but that shared dependency does not make the implication between them symmetric or absent.

### 13.

One team merges to its shared branch several times a day, with a build and test run triggered automatically on every merge. A second team runs the same pipeline definition nightly against a set of long-lived feature branches, without merging them anywhere near that often. Which team is practising continuous integration?

- **A.** The first team, because continuous integration is the practice of merging and verifying frequently, which the second team's nightly automation does not by itself establish.
- **B.** Both teams, since owning an automated pipeline that builds and tests every change is what continuous integration means, whatever the merge frequency behind those runs happens to be.
- **C.** Neither, unless the resulting build is also deployed automatically into an environment afterward.
- **D.** The second team, because a scheduled nightly run is more disciplined than merging several times within a single day.

**Answer: A.** Continuous integration is a team practice — merge to a shared branch often, verify every change automatically — separate from the pipeline machinery that carries it out. A team can own automation without meaningfully integrating.

- B is wrong: A pipeline can run nightly against long-lived branches with no continuous integration behind it; the machinery is not the practice.
- C is wrong: Deploying anywhere moves the scenario into delivery or deployment; continuous integration stops at a tested artifact.
- D is wrong: Discipline is not the criterion; frequent merging to a shared branch is, and the second team's cadence is the opposite of that.

### 14.

A described workflow ends with: the build passed, and a tested artifact was produced. Nothing further is stated about where that artifact went afterward. Which practice has the description covered so far?

- **A.** Continuous delivery, since producing a tested artifact already means it is inherently something that could be released.
- **B.** Continuous integration, since the process runs from a committed change to a tested, deployable artifact and the description stops exactly there.
- **C.** The full pipeline stage list, because build and test are only two of several stages a pipeline definition can contain.
- **D.** Build and artifact promotion in full, since an artifact was produced and every environment further along the pipeline must therefore already have received it.

**Answer: B.** CI is about integrating and verifying, not about releasing. A scenario that stops at a tested artifact has described CI in full; extending it into deployment moves the description into delivery or deployment instead.

- A is wrong: Releasability requires deployment into at least an acceptance environment, which this description never mentions happening.
- C is wrong: The pipeline is the mechanism running the stages; the description is naming the practice being exercised, not the object running it.
- D is wrong: Nothing in the description says the artifact was promoted anywhere; promotion is a later, unstated step.

### 15.

A staging environment runs a different network topology and a different configuration mechanism than production, though it does use a realistic dataset. What does this arrangement fail to achieve?

- **A.** Nothing important, because parity is a concern that belongs to developer laptops rather than to a shared staging environment.
- **B.** It ends up testing a fourth environment nobody actually deploys to, since each rung on the ladder only works if it is genuinely closer to production than the one below it.
- **C.** It fails to build once and deploy many, since a staging environment that differs from production in topology was clearly built separately from it.
- **D.** It succeeds at the goal, because using a realistic dataset is the one part of parity that genuinely matters here.

**Answer: B.** Each environment exists to eliminate a class of defect before the next is reached, and that only works if each rung is genuinely more realistic than the last. A staging environment that diverges in topology or configuration tests a fourth environment nobody deploys to.

- A is wrong: Parity applies to every rung of the ladder, and staging that diverges in topology fails the same test a developer environment would.
- C is wrong: Build-once concerns the artifact being promoted unchanged; the topology and configuration divergence described here is a separate failure.
- D is wrong: Data realism is only one dimension; a divergent topology or configuration mechanism can hide defects that never appear until production.

### 16.

A developer's laptop cannot match production's request volume, but a container image pins its language runtime's minor version, its linked libc, and its configuration mechanism to match production exactly. Has parity been achieved in the sense the exam means?

- **A.** Yes, because parity is about shape rather than size, and the things that differ silently are what matter, while raw capacity is not one of them.
- **B.** No, because a laptop can never truly match production's conditions no matter what the container image happens to pin.
- **C.** No, because genuine parity requires an identical number of running instances at every single stage of the environment ladder.
- **D.** Yes, but only because the same built artifact is also being promoted unchanged through every later environment.

**Answer: A.** Parity is about shape, not size. A laptop is never going to match production's capacity and does not need to; what must match are the things that differ silently, such as runtime version, linked libraries, and configuration mechanism.

- B is wrong: This treats capacity as though it were part of parity, but parity never required the laptop to match production's scale.
- C is wrong: Instance count is a scale concern belonging to the environment ladder, not to whether the developer's runtime and configuration match production's shape.
- D is wrong: Artifact promotion is a separate practice about environments further along the pipeline, not about what makes a developer's local setup match production.

### 17.

A team runs Jenkins, Terraform, and a fully automated pipeline, but developers still hand every release to a separate operations group that owns production. Is this team practising DevOps?

- **A.** No, because DevOps is one team owning the whole path from development through production operations, and the toolchain is only how that ownership gets exercised.
- **B.** Yes, since running a modern CI/CD toolchain and infrastructure-as-code is what the term DevOps refers to.
- **C.** Yes, provided the two groups coordinate informally on a regular basis, since regular coordination substitutes for changing who is accountable once work has shipped to users.
- **D.** No, but only because the handoff slows the feedback loop rather than because ownership stayed split.

**Answer: A.** DevOps is a culture and operating model first: one team owns delivery end to end. A full toolchain run by a separate operations group that still receives handoffs is automation without the ownership change that defines the practice.

- B is wrong: This is the most common wrong answer the guide warns about: framing DevOps as a toolchain rather than as shared ownership.
- C is wrong: Coordination without changed accountability leaves the handoff, and the incentive split behind it, untouched.
- D is wrong: The slower feedback loop is a consequence of the handoff, not an independent reason the team fails the definition.

### 18.

A company moves from quarterly releases bundling hundreds of changes to daily releases of a handful each. Why does this reduce risk rather than increase it?

- **A.** Moving testing and security earlier in the lifecycle catches more defects before any release ships at all.
- **B.** Each release carries less change, so the candidate causes of a failure are few and the time between making a change and learning its effect is short.
- **C.** Releasing daily forces the team to add substantially more automated test coverage than it had before.
- **D.** It does not reduce risk, because releasing more often simply multiplies the number of separate occasions on which something can go wrong in front of users.

**Answer: B.** A feedback loop is measured in latency, not volume. Smaller, more frequent releases shrink the set of possible causes when something breaks and shorten the interval before the breakage is noticed.

- A is wrong: That describes shift left, a related but separate practice about when quality work happens, not about release size.
- C is wrong: Nothing about release frequency mandates new coverage; the safety net and the cadence are separate levers.
- D is wrong: This mistakes release count for accumulated risk and ignores that each release now carries far less change.

### 19.

An automation task declares that a package must be installed at a given version, checking the current state before acting, and it is run three times in a row against a host that already satisfies that state. Describe what happens on the second and third runs.

- **A.** Both reinstall the package all over again, since idempotent means the exact same action happens on every run regardless of current state.
- **B.** Both report configuration drift, since re-running a task that has already converged always surfaces something new to review.
- **C.** Both trigger the pipeline's automated test suite to run again, since idempotency is a property of the pipeline rather than of the task itself.
- **D.** Both find the declared state already satisfied and change nothing further, which is exactly what makes the task safely re-runnable.

**Answer: D.** An idempotent task checks the current state before acting; once the declared state is satisfied, a second or third run finds nothing to do. That is what makes automation safely re-runnable after an interrupted or retried run.

- A is wrong: This confuses idempotent with unconditional; an idempotent task is defined by checking state first, not by repeating an action blindly.
- B is wrong: A converged, idempotent task reports nothing to change; drift only appears when reality has diverged from the declaration since the last run.
- C is wrong: Idempotency is a property of the individual task's behaviour on repeated runs, not something that governs whether an unrelated test suite reruns.

### 20.

A team keeps a shell script in Git that creates a set of cloud resources. Running the script a second time creates a second set of the same resources, and there is no way to compare what currently exists against what was intended. Is this infrastructure as code?

- **A.** Yes, since both approaches keep their definitions in version control and both are meant to converge on the same eventual result whenever the automation is run again from the top.
- **B.** Yes, because keeping the script in Git and reviewing every change to it is what makes something infrastructure as code.
- **C.** No, but only because the script has not yet been made safely re-runnable at the level of its individual actions.
- **D.** No, it is imperative automation, because infrastructure as code declares a desired end state that re-applying converges on, rather than repeating an action each time it runs.

**Answer: D.** Infrastructure as code declares a desired end state and lets a tool converge on it; a script that duplicates resources on every run and offers nothing to compare reality against is imperative automation, not infrastructure as code.

- A is wrong: Being in Git is not what makes something infrastructure as code; the script here has no declared state to converge toward at all.
- B is wrong: Version control and review are good practice for any code, but they do not supply the declarative, convergent behaviour the concept requires.
- C is wrong: Making the actions idempotent is a related but separate property from declaring infrastructure's desired state and detecting drift against it.

### 21.

What is the one-sentence difference between infrastructure as code and configuration management?

- **A.** The two are the same activity, only applied through different named tools such as Terraform on one side and Ansible on the other.
- **B.** Infrastructure as code brings resources into existence and destroys them; configuration management acts on the state inside systems that already exist.
- **C.** Infrastructure as code runs only on a fixed schedule, while configuration management runs only in response to a commit.
- **D.** Infrastructure as code is always declarative, while configuration management is always written as an imperative script.

**Answer: B.** Infrastructure as code and configuration management both keep declarations in version control and both re-apply to converge, but infrastructure as code brings resources into existence while configuration management acts on systems that already exist.

- A is wrong: The tools do overlap in practice, but the concept's line is which question the run answers, not which vendor happens to be involved.
- C is wrong: Trigger mechanism is incidental to both practices and is not the axis that separates provisioning from configuring.
- D is wrong: Configuration-management tools are typically declarative too; the real separating line is provisioning existence against configuring state.

### 22.

A developer installs a JavaScript library so that only the single project importing it can see it, and separately a system administrator installs a runtime package so that every process on the machine can use it. Which kind of tool performed each installation?

- **A.** A language package manager performed the project-local install, and the operating system's package manager performed the machine-wide one.
- **B.** The operating system's package manager performed both installs, since a package is a package regardless of which tool is used to install it.
- **C.** A container image performed the project-local install, since containers are what pins a project's dependency versions.
- **D.** A language package manager performed both installs, since the operating system exposes identical installation semantics to any caller.

**Answer: A.** A language package manager resolves application-level dependencies for one project; the operating system's package manager installs system-wide software for the machine as a whole. The two answer different questions even though both share the word package.

- B is wrong: The two answer different questions: one resolves what a single application needs, the other installs software for the machine as a whole.
- C is wrong: A container image can carry pinned dependencies, but the install described here is the ordinary job of a language package manager, not a container.
- D is wrong: Machine-wide software is normally the operating system package manager's job; the two tools answer different questions about scope.

### 23.

The same library ends up installed both through a language package manager and through the operating system's package manager on one machine, at two different versions, and which one an application loads now depends on search order rather than intent. What caused this?

- **A.** A missing container image, since an isolated filesystem is the only mechanism that can prevent two copies of one library from coexisting on a machine.
- **B.** Choosing the wrong manager for the kind of dependency involved, since application-level libraries belong to the language package manager and system-wide software belongs to the operating system's own tool.
- **C.** Nothing unusual, since every distributable package bundles its own metadata, dependency list, and install scripts by design.
- **D.** A version-control conflict, since manifest files and lock files exist specifically to prevent this kind of duplication.

**Answer: B.** Installing the same library through both kinds of manager is the classic failure of this boundary: two copies at different versions end up on the system, and which one an application loads depends on search order rather than intent.

- A is wrong: Containers can reduce this risk, but the underlying cause is choosing the wrong manager, not the absence of a container.
- C is wrong: That description of a package's contents does not explain why two managers both installed the same dependency at conflicting versions.
- D is wrong: Manifest and lock files control what one language package manager resolves; they say nothing about a separate install through the operating system's tool.

### 24.

A product team runs one deployable application and complains that a sign-up spike forces them to scale an unrelated video-streaming feature along with it. A colleague separately argues the codebase should be split into microservices because it has become hard to read. Is code readability a reason to make that split?

- **A.** Yes, since decomposing a monolith into services is the standard fix whenever a codebase has become difficult to read and to change over time, and the cost of running the extra services is repaid by how much easier each one is to reason about.
- **B.** No, because deployment shape and code quality are separate problems; the sign-up spike is a genuine scaling argument, but an untidy codebase is not, and microservices add operational cost regardless of the reason given.
- **C.** No, but only because the team has not yet promoted the same built artifact through every environment it deploys to.
- **D.** Yes, provided the newly split services are also defined declaratively as infrastructure as code from the start.

**Answer: B.** The dividing line between a monolith and microservices is deployment independence, not code size or quality. Splitting to scale a genuinely divergent workload is a real trade; splitting because a codebase is hard to read addresses the wrong problem and still buys the operational overhead.

- A is wrong: Splitting for readability spends operational effort on machinery that does not address a code-quality problem at all.
- C is wrong: Build and artifact promotion is an unrelated concern about how a release travels through environments, not about whether to split the codebase.
- D is wrong: Whether infrastructure is declared as code is orthogonal to whether the split is justified by a readability complaint in the first place.

### 25.

Monitoring dashboards for a service are in place and green, yet an operator cannot explain a new failure mode nobody anticipated when writing the dashboards. Why can monitoring be in place and the system still be poorly observable?

- **A.** It cannot happen this way, since a system with monitoring already in place is observable by definition once signals are being collected continuously and displayed on a dashboard someone is watching.
- **B.** Because alerting was not configured to interrupt anyone the moment the dashboards would otherwise have turned green.
- **C.** Observability is simply a synonym for having more dashboards deployed than the ones the team already built.
- **D.** Monitoring reports on signals chosen in advance, while observability is what lets an operator answer a question nobody thought to ask before the incident, without shipping new instrumentation.

**Answer: D.** Monitoring watches signals chosen in advance and answers questions already known to be worth asking. Observability is the property that lets an operator answer a question nobody anticipated, without shipping new instrumentation to find out.

- A is wrong: Collecting quantitative signals continuously is what monitoring is; observability is a further property about answering questions nobody anticipated.
- B is wrong: Alerting is the separate practice of interrupting a human on a breached threshold; it does not explain a gap in answering an unforeseen question.
- C is wrong: More dashboards still only answer questions someone already thought to ask, which is exactly the limit observability exists to lift.

### 26.

A described pipeline builds a container image, runs unit and integration tests against it, and then pushes it to a registry, but it only ever runs when someone manually triggers it against a release branch about once a month. Is this pipeline practising continuous integration?

- **A.** Yes, since every stage associated with continuous integration, build, test, and package, is visibly present in this pipeline's own definition file kept in the repository beside the source.
- **B.** Yes, because pushing the finished image to a registry is what makes the resulting change releasable.
- **C.** No, but only because the pipeline definition was not written in a named tool such as GitHub Actions or Jenkins.
- **D.** No, because the automation exists but continuous integration is defined by merging frequently to a shared branch, which a once-a-month trigger plainly does not provide.

**Answer: D.** A pipeline is the concrete machinery a change runs through, distinct from the practices it may or may not implement. A monthly, manually triggered pipeline is a pipeline and is neither continuously integrating nor delivering.

- A is wrong: Owning the stages is not the same as merging often; a pipeline is not CI/CD by itself, regardless of which stages it lists.
- B is wrong: Releasability is a claim about continuous delivery, not about whether the described merge frequency counts as continuous integration.
- C is wrong: Which tool authors the definition file has no bearing on whether merges to the shared branch happen often.

### 27.

A pipeline stage fails partway through a run. What happens to the change under test, and what happens to the artifact the run had produced up to that point?

- **A.** The remaining stages still execute afterward, since each stage runs independently of whether the one before it passed or failed.
- **B.** The previous release is automatically rolled back to undo whatever the failed change would have introduced.
- **C.** Only the failing test is reported, while the build itself is still considered a valid release candidate.
- **D.** The run stops so the change does not progress to later stages, and any artifact from the failed run is never promoted.

**Answer: D.** A trigger starts a run, and stages execute in order so a failing stage stops the run from progressing. The artifact from a failed run is never promoted, which is why the artifact that reaches an environment is always the one that passed.

- A is wrong: Stages run in order precisely so a failure stops progress; independence between them would defeat the ordering's purpose.
- B is wrong: Rollback concerns an already-released version; nothing here has reached an environment for a rollback to apply to.
- C is wrong: The output of a failing run is binary rather than partial credit; a failed test means the run failed, full stop.

### 28.

A deployment is rolled back by redeploying the previous artifact, but the incident does not end. What is the most likely reason?

- **A.** The artifact registry must have been misconfigured, since a correctly performed rollback always resolves the underlying incident.
- **B.** Data, because a schema migration or writes made by the new version are not undone by redeploying old code, since rollback of code is not rollback of data.
- **C.** The wrong version tag was almost certainly pulled from the registry, targeting the redeploy at the wrong artifact.
- **D.** The team should have used a blue-green cutover instead of simply redeploying the same previous artifact.

**Answer: B.** Rollback returns a system to the previous known-good version, but redeploying yesterday's code does not un-apply a schema migration or un-write rows the new version created, which is why an irreversible change removes the safety net rollback appears to provide.

- A is wrong: This assumes rollback is always sufficient, which is exactly the gap an irreversible migration or write can leave open.
- C is wrong: Nothing in the scenario suggests the wrong artifact was retrieved; the described symptom is consistent with a correct redeploy that data alone defeats.
- D is wrong: Switching strategies would not fix a data problem; even a blue-green rollback cannot undo writes a shared database already received.

### 29.

A Kubernetes Deployment rolls out a new version in batches, waiting for each batch of new Pods to become healthy before scaling down the corresponding old ones. Halfway through, some requests are hitting the new version and some the old one. Is anything evaluating how the new version is behaving under the traffic it has already taken?

- **A.** No, but that is expected, since a rolling deployment never allows two different versions to serve production traffic at the same moment.
- **B.** Yes, and any failure during the roll automatically restores a previous revision from the Deployment's rollout history.
- **C.** No, because the mixed-version window is a side effect of replacing instances in batches, not a sample deliberately chosen to be observed the way a canary's slice is.
- **D.** Yes, because both versions are visibly serving traffic at once, which is a reasonable basis for assuming the rollout is being evaluated.

**Answer: C.** During the roll, some traffic reaches the new version as a consequence of how many instances have been replaced, not as a sample chosen to be observed. Treating a rolling update as though it provided canary-style safety is the error this pair exists to catch.

- A is wrong: Both versions do serve real traffic simultaneously for the duration of the roll; that is exactly the risk the strategy carries.
- B is wrong: Restoring a previous revision is a manual rollback action, not something the roll itself evaluates or triggers automatically.
- D is wrong: Two versions serving traffic simultaneously is not the same as anything measuring how the new one is performing; that is the trap this pair exists to catch.

### 30.

Which Kubernetes Deployment strategy runs by default, and what does the alternative strategy do differently from it?

- **A.** Recreate is the default strategy, and it behaves much like a blue-green cutover between two complete environments.
- **B.** RollingUpdate is the default, and Recreate is the strategy that restores a previous revision from the rollout history the Deployment retains by default for exactly that purpose.
- **C.** RollingUpdate is the default, replacing instances in batches while the service stays available; Recreate kills every existing Pod before creating any new one, accepting downtime.
- **D.** Both strategies avoid downtime entirely, differing only in how many Pods are replaced within each batch.

**Answer: C.** A Kubernetes Deployment's strategy type is RollingUpdate unless set otherwise; the only alternative is Recreate, which kills all existing Pods before creating any new ones and so accepts downtime that RollingUpdate is designed to avoid.

- A is wrong: RollingUpdate is the default, and Recreate has no second environment at all; it simply removes and replaces Pods in place.
- B is wrong: Restoring a previous revision describes a rollback action, not the Recreate strategy, which only governs how new Pods replace old ones.
- D is wrong: Recreate does not avoid downtime at all; it removes every existing Pod before any replacement exists.

### 31.

A library moves from version 1.4.2 to 2.0.0. What does that number alone tell a consumer, and what would 1.5.0 have told them instead?

- **A.** Both signal the same underlying thing, a version increase, since which position changed is only a formatting convention rather than a promise.
- **B.** 2.0.0 signals a backward-incompatible change to the public API; 1.5.0 would have signalled new but backward-compatible functionality.
- **C.** 2.0.0 means the artifact was pushed to a different registry, and 1.5.0 means it stayed in the original one.
- **D.** 2.0.0 means the previous version can no longer be rolled back to, and 1.5.0 means it still can be.

**Answer: B.** Semantic versioning is what makes a version number carry information rather than merely increase. A major bump signals a breaking change to the public API; a minor bump signals new, backward-compatible functionality.

- A is wrong: Treating the scheme as mere formatting rather than a contract is the exact error the concept exists to catch.
- C is wrong: Where an artifact is stored has nothing to do with what its version number encodes about API compatibility.
- D is wrong: Version numbering does not govern what remains retrievable for rollback; that depends on retention in the registry.

### 32.

A security scan and a design-time threat conversation are added at the pull-request stage, replacing a gate that used to run the week before release. Does this mean developers have taken over the security team's job?

- **A.** Yes, because moving a task earlier in the pipeline transfers ownership of it to whoever is already working at that earlier stage, which in practice means the developers.
- **B.** No, but only because the operations group still owns whatever deployment gate remains later in the pipeline.
- **C.** No, because shift left is a statement about when testing and security happen, not about who performs them, so responsibility stays shared across the lifecycle.
- **D.** Yes, since shortening the time to notice a defect requires developers to run every check themselves without help.

**Answer: C.** Shift left moves when testing and security happen, earlier in the lifecycle where a defect is cheaper to fix. It does not mean developers absorb the QA or security team's job; the sharing of responsibility is unchanged.

- A is wrong: This is the exact conflation the guide warns against: earlier is a when, not a transfer of who does the work.
- B is wrong: A remaining downstream gate is not why the answer is no; the definition itself rules out the transfer being described.
- D is wrong: Shortening detection time is a feedback-loop concern and does not require developers to absorb another team's checks.

### 33.

Two teams are merged onto one org chart, but developers are still measured on feature velocity and operators on uptime. Has the silo been removed?

- **A.** Yes, since a single reporting line is what defines a silo in the first place.
- **B.** No, because a silo is an incentive boundary rather than an org-chart boundary, and the conflicting measures preserve it regardless of the new reporting line.
- **C.** Yes, because a merged org chart is itself the evidence that an organisation has adopted DevOps, whatever the two groups are each still measured on individually.
- **D.** No, but only because the merged team's release cadence has not yet increased.

**Answer: B.** A silo is an incentive boundary, not an org-chart boundary. Merging two teams while leaving developers rewarded for velocity and operators for uptime leaves the conflict, and the silo, exactly where it was.

- A is wrong: Reporting structure is not what the concept turns on; unchanged incentives are what preserve a silo.
- C is wrong: A reorganisation on paper is not the culture change DevOps requires; the incentives described here have not moved.
- D is wrong: Release cadence is a downstream effect of removing the silo, not the test for whether it has been removed.

### 34.

What is the one-sentence difference between DevOps and site reliability engineering?

- **A.** DevOps focuses on getting code to production; SRE focuses on ensuring code already running in production keeps working, using an error budget to balance change against stability.
- **B.** They are two names the industry uses for the same discipline, applied to the same set of practices by different companies.
- **C.** SRE is the culture of shared ownership between development and operations, and DevOps is the specialist operations discipline built on top of that culture once it is established.
- **D.** SRE is the practice of making automation safely re-runnable, a property that a DevOps pipeline then schedules on a cadence.

**Answer: A.** SRE applies software engineering to reliability and uses an error budget to trade stability work against release velocity. DevOps is about getting code to production; SRE is about the production system continuing to work once it is there.

- B is wrong: Treating the two as synonyms erases the distinction the concept exists to test.
- C is wrong: This reverses the two: DevOps is the shared-ownership culture, and SRE is the specialist operations discipline.
- D is wrong: That property describes idempotency, an unrelated concept about repeatable operations, not SRE.

