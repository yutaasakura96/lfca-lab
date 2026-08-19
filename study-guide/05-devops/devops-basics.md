# DevOps Basics

DevOps Basics is the conceptual spine of the DevOps Fundamentals domain — the practices,
release strategies, and automation vocabulary that the rest of the domain (containers, Git)
sits inside. The domain is worth 12% of the exam — 5th largest of 6 domains — on the current
(2025-09-16) blueprint, and this competency was unchanged by the 2025 update. LFS200 touches
it narrowly: across its 25 concepts the coverage is 2 FULLY COVERED, 18 NOT COVERED, 4
PARTIALLY COVERED, 1 MENTIONED ONLY — 7/25 (28%) are not NOT COVERED, and the lesson that
carries them is the single CI/CD lesson in the course's DevOps chapter
(`research/lfs200-notes/00-course-map.md`). The remaining 18 are sourced independently below.
Nothing in this competency is a command: every concept is a distinction between practices,
which is exactly the shape the questions take.

<a id="s-devops-basics-culture"></a>
## Culture

<a id="c-devops.devops-basics.devops"></a>
### DevOps
*id: `devops.devops-basics.devops` · depth 2 · importance 1 · LFS200: FULLY COVERED · sources: cncf-glossary-devops*

**What it is** A methodology in which one team owns the whole path from application
development through to production operations, rather than handing work between a development
group and an operations group. It is a culture and an operating model first, and a toolchain
second: automation and fast feedback are how DevOps is achieved, not what it is.

**Why it matters** The most common wrong answers frame DevOps as a product, a pipeline tool,
or a job title. A team can run Jenkins, Terraform, and a full CI/CD pipeline and still not be
doing DevOps if development and operations remain separately accountable; conversely a team
with shared ownership and short feedback loops is doing DevOps whichever tools it happens to
use. When a question offers "a CI/CD tool," "a person whose title is DevOps engineer," and "a
way of organising responsibility for delivery," the third is the definition.

**How it works** Ownership of the whole lifecycle removes handoffs, which is where errors and
queueing delay accumulate: each handoff is a point where work waits and where nobody is
accountable for the outcome, only for passing it on. Teams work on small components rather
than whole features, so changes are smaller and their consequences are traceable to the team
that made them.

**Key terms** shared ownership; handoff; lead time; culture over toolchain.

<a id="c-devops.devops-basics.silos-and-shared-responsibility"></a>
### Silos and shared responsibility
*id: `devops.devops-basics.silos-and-shared-responsibility` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: cncf-glossary-devops, google-sre-book-embracing-risk*

**What it is** The problem DevOps exists to address: a development group measured on shipping
change and an operations group measured on keeping things stable, each rational on its own
terms and in direct conflict with the other. Shared responsibility replaces the two measures
with one — the change is not done when it is handed over, it is done when it is running
correctly in production.

**Why it matters** A silo is an incentive boundary, not an org-chart boundary, and that is the
discrimination the exam wants. Merging two teams on paper while leaving developers rewarded
for feature velocity and operators rewarded for uptime leaves the silo intact. Equally,
formally separate teams that share an on-call rotation and a single definition of done are not
siloed in the sense that matters here.

**How it works** In a siloed organisation, work is fragmented between groups and each
completed piece is queued for the next, so lead times grow and nobody owns the result. By the
time a defect appears in production, it has passed through enough hands that tracing its origin
is itself a project. Shared responsibility collapses the queue: the people who wrote the change
are the people paged when it misbehaves, which changes what they choose to write.

**Key terms** conflicting incentives; handoff queue; definition of done; on-call ownership.

<a id="c-devops.devops-basics.feedback-loops"></a>
### Feedback loops
*id: `devops.devops-basics.feedback-loops` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: fowler-continuous-integration*

**What it is** The time between making a change and learning its effect. Shortening that
interval is the mechanism that makes small, frequent releases safer than large, rare ones —
not a slogan about agility.

**Why it matters** The counterintuitive claim is the examinable one: deploying more often
reduces risk. Each release carries less change, so the set of possible causes when something
breaks is small, and the interval before the breakage is noticed is short. A quarterly release
bundles hundreds of changes whose interactions nobody has observed, and the feedback on any
one of them arrives months after its author stopped thinking about it.

**How it works** A feedback loop is measured in latency, not in volume. Adding dashboards, or
collecting more signals, does not shorten a loop if the release cadence and the time to notice
stay the same. The loops that matter run at several scales — a failing unit test in seconds, a
failing pipeline stage in minutes, a canary's error rate in hours, a user complaint in days —
and shortening the outer ones is what shift left and continuous delivery are both for.

**Key terms** cycle time; batch size; time to detect; latency of information.

<a id="c-devops.devops-basics.shift-left"></a>
### Shift left
*id: `devops.devops-basics.shift-left` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: cncf-glossary-shift-left*

**What it is** Moving testing, security, and other quality practices earlier in the software
lifecycle — "left" being earlier on a timeline drawn left to right — rather than performing
them at the end, just before or after release. Originally about testing, it now covers security
and deployment concerns as well.

**Why it matters** The justification is cost, and the exam expects the reasoning rather than
the slogan: a defect or a vulnerability found at design time is a conversation, the same defect
found after deployment is an incident, a rollback, and possibly a disclosure. The claim shift
left makes is about cost, not volume: it is justified by how much cheaper a defect is to remove
when found while the change is still cheap to alter, not by a promise that fewer defects are
written.

**How it works** Shift left is a statement about *when*, not about *who* or *which tool*. It
does not mean developers absorb the QA team's job or that a scanner replaces a review; it means
responsibility for testing and security is shared across the whole lifecycle, from the
engineers writing code through quality assurance to operations. Static analysis on a pull
request, dependency scanning in the pipeline, and threat modelling during design are all the
same move applied at different stages.

**Key terms** cost of a late defect; DevSecOps; earlier stage; shared responsibility for quality.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `devops.devops-basics.site-reliability-engineering` | Site reliability engineering | An operations discipline that applies software engineering to infrastructure and operations problems, building systems that run applications rather than building product features, and using error budgets to balance change against stability. | Not a synonym for DevOps, and not a rebranding of sysadmin: DevOps concentrates on getting code to production, SRE on ensuring code already in production works properly. An error budget is what makes that concrete — reliability below target buys stability work, reliability above target buys release velocity. |

#### Scenario

A company reorganises: developers now carry the pager for what they ship, and the release
committee that met monthly is dissolved. Within a quarter, release size falls from a hundred
changes to a handful, and the mean time to identify the cause of an incident falls with it —
that is the feedback loop shortening, not a coincidence. Security review, previously a gate a
week before release, is moved into the pull request as automated dependency scanning plus a
design-time threat conversation; that is shift left, and its payoff is measured in what a fix
costs, not in how many issues are found. A separate reliability group is stood up to build
tooling that keeps the running services healthy and to hold an error budget — SRE, distinct
from the delivery-focused work the product teams now own end to end.

#### Knowledge check

1. A team runs Jenkins, Terraform, and a fully automated pipeline, but developers still hand
   releases to an operations group that owns production. Are they doing DevOps?
   No. DevOps is ownership of the whole lifecycle by one team; the toolchain is a means, not
   the definition, and the handoff is exactly what it removes.
2. Why does deploying more frequently reduce risk rather than increase it?
   Each release carries less change, so the candidate causes of a failure are few and the time
   between making a change and learning its effect is short.
3. What is the one-sentence difference between DevOps and SRE?
   DevOps focuses on getting code to production; SRE focuses on ensuring code running in
   production works properly.
4. Does shift left mean developers take over the QA team's work?
   No — it is a statement about when testing and security happen, not about who performs them;
   responsibility is shared across the lifecycle rather than transferred.
5. Two teams are merged into one on the org chart, but developers are still measured on
   feature velocity and operators on uptime. Has the silo been removed?
   No. A silo is an incentive boundary; unchanged conflicting measures preserve it regardless
   of reporting lines.

<a id="s-devops-basics-ci-cd"></a>
## CI/CD

<a id="c-devops.devops-basics.continuous-integration"></a>
### Continuous integration
*id: `devops.devops-basics.continuous-integration` · depth 3 · importance 1 · LFS200: PARTIALLY COVERED · sources: cncf-glossary-continuous-integration*

**What it is** The practice of integrating code changes into a shared branch as regularly as
possible, with an automated build and test run triggered by every change. The process
conventionally begins when a change is committed to source control and ends with a tested
artifact ready to be consumed by a delivery system. CI is a prerequisite for continuous
delivery, not an alternative to it.

**Why it matters** CI is about integrating and verifying, not about releasing — that single
sentence answers most questions in this area. A scenario that ends with "the build passed and
a tested artifact was produced" has described CI and stopped there; the moment the description
continues into deploying that artifact anywhere, it has moved into delivery or deployment. The
problem CI solves is also worth holding: multiple developers working in parallel make
conflicting changes and unknowingly break each other's work, and every one of them would
otherwise repeat the same testing and quality checks by hand.

**How it works** A commit to the source control system triggers a server that checks the
change merges cleanly, builds it, and runs tests and code-quality checks. The output is binary
and immediate: every commit becomes either a concrete failure or a viable release candidate.
The "continuous" part is the merge frequency, not the server — integrating daily against a
shared branch is what keeps the conflicts small enough to resolve.

**Key terms** shared branch; merge conflict; release candidate; trigger on commit.

**Traps** Owning a CI server is not doing CI. A team whose developers work on long-lived
feature branches for weeks, with a build running dutifully on each branch, is running
automation but is not continuously *integrating* — the merges they are avoiding are exactly
what CI is about. In the other direction, CI does not deploy anything: if a described process
puts a build onto a running environment, the concept being tested is no longer CI.

**What the exam may test** Given a described workflow, deciding whether it is continuous
integration, continuous delivery, or continuous deployment, using the two boundaries — does it
merge and verify frequently, and does anything reach an environment — rather than the presence
of a tool.

*Not to be confused with [continuous delivery](devops-basics.md#cmp-devops.devops-basics.continuous-delivery).*

<a id="cmp-devops.devops-basics.continuous-integration"></a>
#### Not to be confused with: Continuous integration vs Pipeline
*compares: `devops.devops-basics.continuous-integration`, `devops.devops-basics.pipeline`*

| | Continuous integration | Pipeline |
| --- | --- | --- |
| What it names | A team practice: merge to a shared branch often, verify every change automatically | The concrete automated sequence of stages a change is run through |
| Evidence you would look for | Merge frequency in the shared branch's history | A definition file in the repository and a run history in the tool |
| Can the other exist without it | A pipeline can run nightly against long-lived branches with no continuous integration behind it | CI with no automation at all is not CI — the verification must be automatic |
| What a question is asking for | "What is this team doing?" | "What is running, and in what order?" |

The separating axis is practice versus machinery: continuous integration is the behaviour, a
pipeline is the implementation that carries it out — which is why a team can have one without
meaningfully having the other.

<a id="c-devops.devops-basics.continuous-delivery"></a>
### Continuous delivery
*id: `devops.devops-basics.continuous-delivery` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: cncf-glossary-continuous-delivery*

**What it is** A set of practices in which every change that passes the pipeline is
automatically deployed into an acceptance environment and is therefore *releasable* at any
time — but promotion into production remains a human decision. The practices crucially include
testing the software adequately before deployment and providing a way to roll changes back.

**Why it matters** The difference from continuous deployment is exactly the manual gate, and
nothing else. Both abbreviate to CD, both run the same pipeline, both aim at a fully automated
path to production; delivery stops one step short and waits for a person to say release.
Because the two share an abbreviation, a question that writes "CD" without expanding it is
usually testing whether the candidate knows the term is ambiguous.

**How it works** Continuous integration produces a tested artifact; the delivery pipeline takes
that artifact and deploys it automatically into an acceptance or staging environment, running
whatever further tests that environment allows. The artifact then sits ready, and the release
decision is a button, not a build. That decision may be held for a business reason — a
marketing date, a change freeze, a regulator's sign-off — which is why the human gate is
frequently a deliberate choice rather than a failure to automate.

**Key terms** acceptance environment; releasable at any time; release gate; rollback procedure.

**Traps** Continuous delivery does not mean releasing rarely. It constrains who decides, not
how often; a team practising continuous delivery may release twenty times a day, each time by
a human action. Nor does "releasable" mean "released" — the claim being made is that the
artifact would work in production if promoted, which is a claim about the pipeline's testing,
not about anything having reached users.

**What the exam may test** Distinguishing delivery from deployment purely by the presence or
absence of a human approval step, and recognising that continuous deployment implies continuous
delivery while the reverse does not hold.

<a id="cmp-devops.devops-basics.continuous-delivery"></a>
#### Not to be confused with: Continuous delivery vs Continuous deployment vs Continuous integration
*compares: `devops.devops-basics.continuous-delivery`, `devops.devops-basics.continuous-deployment`, `devops.devops-basics.continuous-integration`*

| | Continuous delivery | Continuous deployment | Continuous integration |
| --- | --- | --- | --- |
| What the practice guarantees | Every passing change *could* be released | Every passing change *is* released | Every change is merged and verified |
| Where a passing change ends up | An acceptance or staging environment | Production, with real users on it | A tested artifact, deployed nowhere |
| Human approval before production | Yes — the defining feature | No — there is no gate to hold | Not applicable; nothing is being released |
| Abbreviation | CD | CD — the same two letters | CI |
| Depends on | Continuous integration | Continuous integration and continuous delivery | Nothing further up the chain |

The separating axis is how far an automatically verified change travels on its own: CI stops at
a tested artifact, continuous delivery carries it to the door of production and waits for a
person, and continuous deployment walks it through.

<a id="c-devops.devops-basics.continuous-deployment"></a>
### Continuous deployment
*id: `devops.devops-basics.continuous-deployment` · depth 3 · importance 1 · LFS200: PARTIALLY COVERED · sources: cncf-glossary-continuous-deployment*

**What it is** Continuous deployment goes a step further than continuous delivery by deploying
finished software directly to production. Every change that passes the pipeline reaches real
users automatically; there is no approval step, because removing that step is the whole point.

**Why it matters** Whether an organisation can adopt it is a question about its test suite and
its rollback story, not about its ambition. With no human between a merge and production, the
pipeline is the only thing standing between a defect and users — which is why continuous
deployment is normally paired with progressive strategies such as canary releases and with
automated rollback. A scenario describing weak automated testing and continuous deployment is
describing a fault, not a practice.

**How it works** The pipeline is the same one continuous delivery uses, minus the gate: CI
tests that the change is valid, and the delivery machinery then moves it through the
organisation's environments from test to production without waiting. The organisational effect
is what the practice is usually justified by — it forces operations work to be automated,
because a painful manual deployment step cannot survive running many times a day.

**Key terms** no manual gate; blast-radius control; automated rollback; release cadence.

**Traps** Continuous deployment implies continuous delivery, but continuous delivery does not
imply continuous deployment — the implication runs one way only, and reversing it is the
standard error. The shared "CD" abbreviation is the mechanism of the confusion: "we do CI/CD"
is not by itself a claim that anything reaches production automatically.

**What the exam may test** Reading a described release process and naming it correctly, and
recognising which supporting practices (comprehensive automated testing, canary or blue-green
rollout, rehearsed rollback) continuous deployment presupposes.

*Not to be confused with [continuous delivery](devops-basics.md#cmp-devops.devops-basics.continuous-delivery).*

<a id="c-devops.devops-basics.pipeline"></a>
### Pipeline
*id: `devops.devops-basics.pipeline` · depth 3 · importance 1 · LFS200: MENTIONED ONLY · sources: jenkins-pipeline-doc, gitlab-ci-yaml*

**What it is** The automated sequence of stages a change passes through: build, test, package,
deploy. It is a concrete, configured object — a definition file in a repository, a set of jobs
in a CI server — not a practice or a philosophy.

**Why it matters** Most pipeline questions are about ordering and attribution: given a
described failure, which stage should have caught it, and what does the pipeline do next. The
ordering carries real content. Build comes first because nothing can be tested until it
compiles; test comes before deploy so that nothing unverified reaches an environment. Whether
tests run before or after packaging varies — a container image is frequently built first and
then tested as the artifact — and what does not vary is that the artifact promoted is the one
that passed, which is why the same artifact reaches every environment.

**How it works** A trigger — a commit, a merge, a tag, a schedule — starts a run. Stages
execute in order on runners or agents, and a failing stage stops the run so the change does not
progress; the artifact from a failed run is never promoted. Later stages are often gated on
approvals or on the branch involved, which is how one pipeline definition serves both a feature
branch and a production release.

**Key terms** stage; trigger; runner or agent; gate.

**Traps** A pipeline is not CI/CD. It is the mechanism; whether the team practises continuous
integration depends on how often they merge, and whether they practise delivery or deployment
depends on where the pipeline is allowed to end and whether a person has to press anything. A
pipeline that only ever runs on a release branch once a month is a pipeline and is neither.

**What the exam may test** Naming the stage order, assigning a described failure to the correct
stage, and separating the pipeline as an object from the practices it may or may not be
implementing.

*Not to be confused with [continuous integration](devops-basics.md#cmp-devops.devops-basics.continuous-integration).*

<a id="c-devops.devops-basics.build-and-artifact"></a>
### Build and artifact
*id: `devops.devops-basics.build-and-artifact` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: twelve-factor-build-release-run*

**What it is** The build is the act of compiling or packaging source into an artifact — a jar,
a wheel, a tarball, a container image — and the artifact is that produced, versioned, deployable
file. The rule the concept exists to teach is build once, deploy many: one build produces one
artifact, and that identical artifact is promoted unchanged through every environment.

**Why it matters** Building separately per environment defeats the purpose. If staging and
production are each built from source, the two binaries can differ — different base image,
different dependency resolution, a toolchain that moved — even when the commit is identical, so
what was tested in staging is not what is running in production. That gap is a whole class of
"it worked in staging" incidents, and it is invisible in the source history.

**How it works** The pipeline builds once, publishes the artifact with a version, and every
later stage pulls that same artifact by that version. What varies between environments is
configuration, injected at deploy time through environment variables, mounted config files, or
a secrets store — never baked into the artifact, because baking it in is what forces a rebuild
per environment.

**Key terms** build once, deploy many; immutable artifact; promotion; externalised configuration.

<a id="c-devops.devops-basics.automated-testing"></a>
### Automated testing
*id: `devops.devops-basics.automated-testing` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: google-sre-book-testing-reliability*

**What it is** Unit, integration, and end-to-end tests executed by the pipeline rather than by
a person. The three names describe scope, not tooling: a unit test exercises one function or
class in isolation, an integration test exercises components working together — often including
a real database or a real HTTP call — and an end-to-end test drives the whole assembled system
the way a user would.

**Why it matters** Automated testing is the safety net that makes frequent deployment
tolerable, which means the strength of the net sets the ceiling on the release practice. A team
cannot honestly adopt continuous deployment with a test suite that only covers unit-level
behaviour, because nothing else stands between a merge and production. Conversely, "we have
tests" is not an answer to "what would catch this" unless the described defect is in scope for
the tests that exist.

**How it works** Tests run on every change, cheapest first: unit tests in seconds so the
feedback arrives while the author is still looking at the code, then the slower integration and
end-to-end layers, which are fewer because they are expensive to run and to keep stable. A
failing test stops the pipeline, so the failure is a fact about the change rather than an item
in someone's queue.

**Key terms** unit; integration; end-to-end; fail fast.

<a id="c-devops.devops-basics.artifact-registry"></a>
### Artifact registry
*id: `devops.devops-basics.artifact-registry` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: docker-overview, docker-what-is-a-registry*

**What it is** A store for built artifacts and container images, versioned so that a specific
build can be retrieved and redeployed later. A registry holds outputs; a source-code repository
holds inputs. Docker Hub is a public registry that anyone can use and the one Docker looks in
by default, and private registries — self-hosted or cloud-provider-run — are ordinary.

**Why it matters** The registry is what makes rollback a retrieval rather than a rebuild.
Returning to the previous known-good version means pulling the artifact that was already built,
tested, and running last week; if that artifact no longer exists anywhere, "roll back" silently
becomes "rebuild an old commit and hope the result is identical," which is the same trap as
building per environment.

**How it works** The pipeline pushes a tagged artifact to the registry after the build; deploys
pull it by that reference. A tag is a mutable pointer — it can be moved to a different image —
while a content digest identifies exactly one immutable artifact, which is why pinning a
deployment by digest is stronger than pinning it by tag. With Docker specifically, `docker pull`
and `docker run` fetch from the configured registry and `docker push` sends to it.

**Key terms** registry versus repository; tag; digest; push and pull.

<a id="c-devops.devops-basics.semantic-versioning"></a>
### Semantic versioning
*id: `devops.devops-basics.semantic-versioning` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: semver*

**What it is** A versioning scheme of the form MAJOR.MINOR.PATCH in which the position that
changed carries the meaning: MAJOR increments for backward-incompatible changes to the public
API, MINOR for new backward-compatible functionality, PATCH for backward-compatible bug fixes.
It is what makes a version number carry information rather than merely increase.

**Why it matters** It underpins image tagging, dependency pinning, and release communication
alike. `1.4.2` to `1.5.0` says "new features, your code still works"; `1.4.2` to `2.0.0` says
"read the migration notes before upgrading." A dependency range that accepts minor upgrades but
not major ones is only safe because the publisher followed the rule, which is why the exam
treats the scheme as a contract rather than a formatting convention.

**How it works** Incrementing minor resets patch to zero; incrementing major resets both minor
and patch to zero. Major version zero — `0.y.z` — is reserved for initial development where
anything may change at any time, and `1.0.0` is the release that defines the public API. Once a
version has been released, its contents must not be modified: any change is published as a new
version. Pre-release identifiers (`1.0.0-alpha`) sort *below* the corresponding normal version,
and build metadata after a `+` is ignored entirely when comparing precedence.

**Key terms** MAJOR, MINOR, PATCH; breaking change; `0.y.z`; immutable release.

<a id="c-devops.devops-basics.ci-cd-tooling"></a>
### CI/CD tooling
*id: `devops.devops-basics.ci-cd-tooling` · depth 2 · importance 1 · LFS200: PARTIALLY COVERED · sources: terraform-intro, ansible-getting-started, jenkins-pipeline-doc*

**What it is** The common implementations, grouped by the job they do. Pipeline and CI servers:
GitHub Actions and GitLab CI, both built into their hosting platform and driven by a definition
file in the repository, and Jenkins, a self-hosted server extended through plugins.
Infrastructure and configuration: Terraform, which provisions infrastructure from declarative
files, and Ansible, which configures hosts that already exist, typically over SSH and without
an agent installed on the target.

**Why it matters** Recognition of the category each tool belongs to is what matters, and it is
usually all that is asked. The error the question is built around is category confusion:
naming Terraform as a CI server, or Jenkins as a configuration-management tool. Terraform
creates the machine; Ansible decides what is installed on it; GitHub Actions, GitLab CI, and
Jenkins run the stages that build and ship the software onto it.

**How it works** A pipeline tool watches the repository, reacts to an event such as a push or a
tag, and executes stages on runners. Terraform reads a declaration of desired infrastructure and
applies the difference between that and what exists. Ansible reads a playbook and brings each
listed host to the declared configuration. Being able to place an unfamiliar tool name into one
of these three boxes is more useful here than any detail of its syntax.

**Key terms** CI server; runner; provisioning versus configuration; declarative definition file.

#### Scenario

A change is merged to the main branch. The pipeline triggers: it builds the service once,
producing a single container image; runs unit tests in seconds and integration tests in
minutes; packages nothing further, because the image already is the artifact; and pushes that
image to the registry tagged `2.3.0`. Up to the point the image existed and the tests passed,
what happened was continuous integration. The pipeline then deploys that exact image to
staging automatically — continuous delivery — and stops, because a release manager must approve
production. Had the approval step been absent, the same run would have been continuous
deployment. The next release adds a backward-incompatible API change, so it is published as
`3.0.0` rather than `2.4.0`, and every environment receives the same image by that tag rather
than being rebuilt from source.

#### Knowledge check

1. What is the one-sentence difference between continuous delivery and continuous deployment?
   Delivery means every passing change *could* be released and a human decides; deployment
   means every passing change *is* released, with no gate.
2. Which of the two implies the other, and in which direction?
   Continuous deployment implies continuous delivery; continuous delivery does not imply
   continuous deployment.
3. A team runs a build on every long-lived feature branch but merges to the shared branch about
   once a month. Are they doing continuous integration?
   No. The automation exists but the integration does not — CI is defined by frequent merging
   to a shared branch, not by owning a CI server.
4. Why must an artifact be built once and promoted unchanged, rather than rebuilt per
   environment?
   Because two builds from the same source can differ, so what was tested in staging would not
   be what runs in production; only configuration should vary between environments.
5. A library moves from `1.4.2` to `2.0.0`. What does the version number alone tell a
   consumer, and what would `1.5.0` have told them instead?
   `2.0.0` signals a backward-incompatible change to the public API; `1.5.0` would have
   signalled new but backward-compatible functionality.
6. Terraform, Ansible, Jenkins: which provisions infrastructure, which configures existing
   hosts, and which runs pipeline stages?
   Terraform provisions, Ansible configures, Jenkins runs the pipeline.

<a id="s-devops-basics-delivery"></a>
## Delivery

<a id="c-devops.devops-basics.deployment-environments"></a>
### Deployment environments
*id: `devops.devops-basics.deployment-environments` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: twelve-factor-dev-prod-parity*

**What it is** The ladder a change climbs: development, testing, staging, production, each
closer to real conditions than the last. Development is where code is written and broken
freely; testing runs the automated suite; staging is deliberately production-like; production
is where real users are. Deployment Environments was a separately named competency before the
2025 update and is no longer one, but the subject matter sits squarely inside DevOps Basics.

**Why it matters** Each rung exists to eliminate a class of defect before the next rung can be
reached, and the ladder only works if each rung is genuinely more realistic than the one below.
Staging that runs a different topology, a different configuration mechanism, or a scrubbed
dataset with a different shape does not test what production will do — it tests a fourth
environment nobody deploys to.

**How it works** The same artifact is promoted upward; only configuration, credentials, and
scale change. What genuinely differs between environments is who has access, whether the data
is real, and whether a failure is visible to users. Where the environments must differ — real
customer data cannot live in staging — the difference is a known limitation to compensate for,
not a detail to forget.

**Key terms** promotion; staging; parity; blast radius.

<a id="c-devops.devops-basics.blue-green-deployment"></a>
### Blue-green deployment
*id: `devops.devops-basics.blue-green-deployment` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: cncf-glossary-blue-green-deployment, fowler-blue-green-deployment*

**What it is** A strategy for updating a running system with minimal downtime by maintaining
two environments, conventionally called blue and green. One serves production traffic while
the other is updated and tested; once testing on the inactive environment concludes, production
traffic is switched over, usually at a load balancer. The term normally means switching entire
environments — many services at once — rather than one component.

**Why it matters** Rollback is near-instant, and that is the property questions are built
around: the previous environment is still running, still warm, and completely untouched, so
reversing the release is another traffic switch rather than another deployment. Blue-green is
also the right answer when components must change in lockstep — a website and a database
schema that are not compatible across versions have to move together, and only an all-at-once
cutover can do that without visible downtime.

**How it works** The idle environment is updated to the new version and validated while the
live one keeps serving. The cutover redirects all traffic at once, typically by repointing a
load balancer or a DNS record. The old environment is retained for a period as the rollback
path, then either torn down or made the target of the next release.

**Key terms** blue and green environments; cutover; traffic switch; lockstep change.

**Traps** Blue-green is not gradual. There is no percentage of users on the new version at any
point — the switch is binary, so a defect that survives pre-switch testing hits everyone at
once. It also requires enough capacity to run two full environments simultaneously. And a
single shared database that both versions must use silently removes the instant-rollback
property, because switching traffic back does not undo a schema change the new version applied.

**What the exam may test** Choosing blue-green when the stated requirement is minimal downtime,
instant rollback, or a change that must happen in lockstep, as against canary when the stated
requirement is limiting exposure while a new version is evaluated with real traffic.

<a id="cmp-devops.devops-basics.blue-green-deployment"></a>
#### Not to be confused with: Blue-green deployment vs Canary release vs Rolling deployment
*compares: `devops.devops-basics.blue-green-deployment`, `devops.devops-basics.canary-release`, `devops.devops-basics.rolling-deployment`*

| | Blue-green deployment | Canary release | Rolling deployment |
| --- | --- | --- | --- |
| Traffic split during the change | None — all traffic moves at one cutover | Deliberate: a small share first, widened in steps | Incidental: whatever share the replaced instances happen to carry |
| Why two versions coexist | They do not serve at once; one is idle but ready | On purpose, to gather evidence before widening | As a side effect of replacing instances in batches |
| Extra capacity required | A second complete environment | A little — enough to run the canary slice | Little or none |
| Rollback | Switch traffic back to the untouched old environment — near-instant | Route the small share back; exposure was already bounded | Roll the batches back one at a time — the slowest of the three |
| Primary purpose | Minimal downtime for an all-at-once or lockstep change | Discovering problems in production at limited blast radius | Keeping the service available while every instance is replaced |

The separating axis is what the traffic split is *for*: blue-green never splits traffic, canary
splits it deliberately as an experiment, and rolling splits it only as a by-product of replacing
instances — which is why a rolling update is not a canary even though both briefly serve two
versions.

<a id="c-devops.devops-basics.canary-release"></a>
### Canary release
*id: `devops.devops-basics.canary-release` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: cncf-glossary-canary-deployment, fowler-canary-release*

**What it is** A strategy that starts with two environments — one carrying live traffic, one
running the updated code with none — and then moves traffic gradually from the old version to
the new: perhaps 1%, then 10%, then 25%, and onward until everything runs on the new version.
The name is the canary in a coal mine: if the new code is unhealthy, traffic is evacuated back
to the stable version before most users are affected.

**Why it matters** It is the only strategy here whose purpose is to *learn* something from
production. No amount of pre-release testing finds every bug, and shifting 100% of traffic at
once turns any survivor into a full outage; a canary bounds the damage to the share of traffic
deliberately exposed, and lets an organisation test the new version in real conditions, gather
feedback, diagnose errors, and roll back quickly.

**How it works** A routing layer sends a chosen fraction of live requests to the new version.
That slice is then watched — error rate, latency, and business signals compared against the
stable version — for long enough to be meaningful before the share is increased. Widening is a
decision informed by those measurements; rollback is routing the slice back to the stable
version.

**Key terms** blast radius; traffic share; bake time; canary analysis.

**Traps** A canary that nobody is measuring is not a canary — it is a slow rollout with extra
steps, because the entire value is in the evidence gathered while exposure is small. It is also
not A/B testing: both split traffic between versions, but a canary asks whether a new build is
defective and is expected to reach 100%, while an A/B test asks which of two variants users
prefer and is expected to end with one discarded.

**What the exam may test** Recognising the strategy from wording about a small percentage of
users or limited blast radius, and pairing it with the observability it depends on — a canary
without metrics on the canary slice cannot do the job it is chosen for.

*Not to be confused with [blue-green deployment](devops-basics.md#cmp-devops.devops-basics.blue-green-deployment).*

<a id="c-devops.devops-basics.rolling-deployment"></a>
### Rolling deployment
*id: `devops.devops-basics.rolling-deployment` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: k8s-deployment*

**What it is** Replacing running instances with the new version in batches, scaling the old set
down as the new set comes up, so the service stays available throughout. It is the default
update strategy for container orchestrators: a Kubernetes Deployment's `.spec.strategy.type` is
`RollingUpdate` unless set otherwise, the only alternative being `Recreate`, which kills all
existing Pods before creating any new ones.

**Why it matters** It is the strategy a candidate will meet by default without choosing it, so
its implications are the examinable part. Chief among them: both versions serve real traffic
simultaneously for the duration of the roll. Anything that cannot tolerate that — an
incompatible database schema change, an API contract both clients and servers must agree on —
breaks during the window, and the failure looks intermittent because only some requests hit the
new instances.

**How it works** Two bounds control the roll. `maxUnavailable` caps how far below the desired
replica count the Deployment may drop, and `maxSurge` caps how far above it may go while
bringing new instances up; in Kubernetes both default to 25%. Batches proceed until every
instance runs the new version. Reversing is the same process run backwards —
`kubectl rollout undo` restores a previous revision from the Deployment's retained history —
which is why rolling back a rolling deployment is slower than flipping a blue-green switch.

**Key terms** batch; `maxUnavailable`; `maxSurge`; `Recreate`.

**Traps** A rolling deployment is not a canary. During the roll some traffic does reach the new
version, but that fraction is a consequence of how many instances have been replaced, not a
sample chosen to be observed. The roll advances as each batch of replacements becomes healthy —
a Kubernetes rollout waits for new Pods to become available before scaling the old set down
further — but nothing evaluates how the new version is behaving under the traffic it has
already taken. Treating a rolling update as though it provided canary-style safety is the error
the pair exists to catch.

**What the exam may test** Identifying rolling deployment from wording about replacing
instances in batches or keeping the service up during an update, and recognising the
mixed-version window as the risk it introduces.

*Not to be confused with [blue-green deployment](devops-basics.md#cmp-devops.devops-basics.blue-green-deployment).*

<a id="c-devops.devops-basics.rollback"></a>
### Rollback
*id: `devops.devops-basics.rollback` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: k8s-deployment, fowler-blue-green-deployment*

**What it is** Returning a system to the previous known-good version. A deployment strategy
without a rehearsed rollback is incomplete: every strategy above is chosen partly for how
quickly and how completely it can be reversed, so the reversal path is part of the design
rather than an afterthought.

**Why it matters** Two distinctions decide most questions. Rollback is not roll forward —
rolling back restores a version that already ran successfully, while rolling forward fixes the
defect in a new release, and the second is a bet that the fix is correct under pressure.
Rollback of code is also not rollback of data: redeploying yesterday's artifact does not
un-apply a schema migration or un-write rows the new version created, which is why an
irreversible migration removes the safety the strategy appeared to provide.

**How it works** The previously published artifact is redeployed from the registry by its
version — retrieved, not rebuilt from an older commit. Orchestrators keep a bounded history for
exactly this: a Kubernetes Deployment stores each revision in the ReplicaSet that carried it
and retains ten old ReplicaSets by default, so `kubectl rollout undo` can restore one; once a
revision is pruned from that history, rolling back to it is no longer possible.

**Key terms** known-good version; roll forward; revision history; irreversible migration.

<a id="c-devops.devops-basics.developer-environments-and-parity"></a>
### Developer environments and parity
*id: `devops.devops-basics.developer-environments-and-parity` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: docker-overview, twelve-factor-dev-prod-parity*

**What it is** Keeping the environment a developer works in close enough to production that
"works on my machine" stops being a defence. Containers are one common way to achieve it: an
image is a read-only template that carries the application together with the runtime,
libraries, and configuration it needs, so the same image runs the same way wherever it is
started.

**Why it matters** Parity is about shape, not size. A laptop is never going to match
production's capacity, and it does not need to; what it must match is the things that differ
silently — the language runtime's minor version, the libc the binary was linked against, the
mechanism configuration arrives through, the version of the database behind it. Those are
exactly the differences that produce a defect visible only after promotion, when the feedback
loop is long and the person who wrote the change has moved on.

**How it works** Packaging the application and its dependencies into an image pins the runtime
so that the artifact tested locally is the artifact deployed; the same image the developer ran
is the one that reaches staging and production. The gaps that remain are worth naming, because
containers do not close them: data volume, network latency between services, real secrets, and
scale. Those stay the job of a production-like staging environment.

**Key terms** parity; container image; configuration drift; backing services.

<a id="c-devops.devops-basics.language-package-managers"></a>
### Language package managers
*id: `devops.devops-basics.language-package-managers` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: maven-dependency-mechanism, pypa-externally-managed-environments, npm-install-locally*

**What it is** Tools that resolve and install *application*-level dependencies for one project
in one language — npm for JavaScript, pip for Python, Maven for Java, and their equivalents in
other ecosystems. They are typically distinct from the operating system's package manager
(`apt`, `dnf`, and the rest), which installs system-wide software for the machine as a whole.

**Why it matters** The two answer different questions and the exam plays on the shared word
"package". Installing a language runtime for the machine is normally OS package manager work;
installing a library that one application imports is normally language package manager work.
Choosing the wrong one produces problems that do not look like packaging problems at all —
a library installed system-wide for every project, or a runtime installed per project that the
system's own tooling cannot see.

**How it works** In most implementations of this practice a project declares its direct
dependencies in a manifest file kept alongside the source, and the tool resolves the full
transitive set and records the exact resolved versions in a lock file so that a later install
reproduces the same tree. Installation typically targets a project-local directory or a
per-project virtual environment rather than system paths, which is why it usually does not
require root, unlike an OS package installation.

**Key terms** manifest; lock file; transitive dependency; per-project isolation.

**Traps** Installing the same library through both managers is the classic failure: two copies
at different versions typically end up on the system, and which one an application loads
depends on search order rather than intent. Ecosystems also differ in convention, so "pip
always installs per project" is not safe as a general rule — a system-wide install is possible
in most of them, and is usually the thing that caused the conflict.

**What the exam may test** Given a described package — a system service, a language runtime, an
application library — choosing the manager that owns it, and recognising the symptoms of having
installed one kind of thing with the other kind of tool.

*Not to be confused with [package](../02-system-administration/system-administration.md#cmp-sysadmin.system-administration.package).*

#### Scenario

A service must ship a schema change alongside the code that depends on it, and neither version
works against the other's database. Canary is unavailable — the two versions cannot coexist —
and a rolling deployment would guarantee a mixed-version window, so blue-green is the strategy
that fits: build the green environment, migrate, validate, and cut all traffic over at once.
The rollback plan is where the reasoning is tested: switching traffic back restores the code but
does not un-apply the migration, so the migration must be written to be reversible or the
"instant rollback" is fiction. A later, backward-compatible release ships as a canary at 1%
instead, with that slice's error rate watched before widening — and both deploy the identical
artifact staging already ran, only configuration differing.

#### Knowledge check

1. What is the one-sentence difference between a canary release and a rolling deployment?
   A canary splits traffic deliberately, to gather evidence before widening; a rolling
   deployment splits it only as a side effect of replacing instances in batches, and nothing
   evaluates how the new version is behaving on the share it has taken.
2. Why is blue-green rollback near-instant, and what single design choice can destroy that
   property?
   The old environment is still running untouched, so reversing is a traffic switch; a shared
   database that the new version has migrated cannot be switched back with it.
3. A deployment is rolled back by redeploying the previous artifact, but the incident does not
   end. What is the most likely reason?
   Data: a schema migration or writes made by the new version are not reversed by redeploying
   old code.
4. Which Kubernetes Deployment strategy is the default, and what does the alternative do?
   `RollingUpdate` is the default; `Recreate` kills all existing Pods before creating new ones,
   accepting downtime.
5. What does a lock file give a project that a manifest alone does not?
   The exact resolved versions of the full transitive dependency set, so a later install
   reproduces the same tree.
6. Staging uses a scrubbed dataset a fraction of production's size and a single application
   instance instead of six. Which of those two is the parity problem?
   The single instance. Parity is about shape, not size: one instance cannot exhibit the
   cross-instance or mixed-version behaviour six will. Data that cannot be real in staging is a
   known limitation to compensate for rather than a parity failure — unless the scrubbed set's
   distribution differs in shape rather than merely in volume, which exercises different code
   paths.

<a id="s-devops-basics-automation"></a>
## Automation

<a id="c-devops.devops-basics.infrastructure-as-code"></a>
### Infrastructure as code
*id: `devops.devops-basics.infrastructure-as-code` · depth 3 · importance 1 · LFS200: PARTIALLY COVERED · sources: cncf-glossary-iac*

**What it is** The practice of storing the definition of infrastructure as one or more
version-controlled files, replacing a model in which servers, networks, and load balancers are
provisioned manually through a console or by ad-hoc shell scripts. The files are the authority
on what should exist, and they are reviewed, diffed, and versioned like application code.

**Why it matters** Cloud-native operation requires infrastructure to be disposable and
reproducible, and to scale on demand without a human clicking through a console. Manual
provisioning is not reproducible, hits scale limits quickly, and introduces misconfiguration
errors that nobody can later account for. Representing the resources as code gives a single
source of truth for every configuration and lets infrastructure changes travel through the same
pipeline, review, and version control that code does.

**How it works** The declaration states desired end state; the tool inspects what exists and
applies the difference. That declarative posture is the working distinction against an
imperative script: a shell script that creates a server is automation, and it is code, but
running it twice creates two servers, whereas re-applying a declaration converges on the state
declared. Divergence between the declaration and reality — drift — is detectable precisely
because there is a declaration to compare against.

**Key terms** declarative; desired state; drift; single source of truth.

**Traps** Infrastructure as code is not configuration management, even though both keep
declarations in version control and both re-apply to converge. Infrastructure as code brings
resources into existence and destroys them; configuration management acts on the state inside
systems that already exist. Terraform and Ansible are the usual named examples of the two
sides, and the tools do overlap in practice — the exam's line is which question the run
answers, not which vendor is involved.

**What the exam may test** Separating provisioning from configuration when a scenario describes
both loosely, and recognising that an automation script is not infrastructure as code unless
re-running it converges on a declared state rather than repeating an action.

*Not to be confused with [configuration management](../02-system-administration/best-practices.md#cmp-sysadmin.best-practices.configuration-management).*

<a id="c-devops.devops-basics.idempotency-in-automation"></a>
### Idempotency in automation
*id: `devops.devops-basics.idempotency-in-automation` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: cncf-glossary-idempotence, ansible-getting-started*

**What it is** The property of an operation that always leads to the same outcome no matter how
many times it is executed: given the same parameters, running it repeatedly has no additional
effect beyond the first run that had work to do. It is the property that makes automation
safely re-runnable.

**Why it matters** Without it, "run it again" is a risk rather than a remedy, and every
interrupted or half-failed run needs a human to work out what already happened before anything
can proceed. With it, a playbook that died halfway is simply re-run, a scheduled convergence
run is harmless, and a retry after a network timeout cannot double-apply the change. That is
why declarative automation tools advertise the property at the level of individual tasks.

**How it works** An idempotent task declares an end state — this package installed at this
version, this line present in this file, this service running — and checks the current state
before acting, so a second run finds nothing to do. A non-idempotent task performs an
unconditional action — append this line, run this installer, increment this counter — and each
run adds to the last. Idempotent is not the same as "has no effect": the first run changes
things, and it is also not the same as atomic or reversible, which are different guarantees
entirely.

**Key terms** desired state; convergence; unconditional action; safe retry.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `devops.devops-basics.observability` | Observability | The property of a system whose external outputs — logs, metrics, and traces together — reveal enough about its internal state to answer new questions about it without shipping new code. | Confused with monitoring, which is a practice rather than a property: monitoring watches signals someone chose in advance and answers questions already known to be worth asking, while observability is what lets an operator answer one nobody anticipated. [Not to be confused with monitoring and metrics](../03-cloud-computing/performance-availability.md#cmp-cloud.performance-availability.monitoring-and-metrics). |

#### Scenario

An environment is defined in version-controlled declarative files: the tool is asked to apply
them, finds three of four subnets already present, creates the fourth, and reports exactly that
— infrastructure as code doing the provisioning, and idempotency making the partial state
harmless rather than a problem to unpick. A colleague proposes the shell script they already
have instead. It creates the same resources, but a second run creates a second copy of each and
it cannot report drift, because there is no declaration to compare reality against. Once the
environment exists, the question shifts: bringing the hosts inside it to a declared
configuration is the configuration-management job, not the provisioning one, and when the new
service starts misbehaving in a way nobody predicted, it is the
observability of its outputs — not a predefined threshold — that decides whether the cause can
be found at all.

#### Knowledge check

1. A shell script reliably creates the required servers and is kept in Git. Is that
   infrastructure as code in the sense the exam means?
   No — it is imperative automation. Infrastructure as code declares a desired state that
   re-applying converges on; running the script twice creates a second set of servers.
2. What is the one-sentence difference between infrastructure as code and configuration
   management?
   Infrastructure as code brings resources into existence; configuration management brings the
   state inside already-existing systems to a declaration.
3. An idempotent task is run three times. Describe what happens on each run.
   The first run makes whatever change is needed; the second and third find the declared state
   already satisfied and change nothing.
4. Is "idempotent" the same as "has no effect", "atomic", or "reversible"?
   None of them — an idempotent operation does act on its first run, and it offers no
   all-or-nothing or undo guarantee.
5. Why can monitoring be in place and a system still be poorly observable?
   Monitoring reports on signals chosen in advance; observability is the property of emitting
   enough output to answer questions nobody thought to ask before the incident.

<a id="s-devops-basics-architecture"></a>
## Architecture

<a id="c-devops.devops-basics.monolith-vs-microservices"></a>
### Monolith vs microservices
*id: `devops.devops-basics.monolith-vs-microservices` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: cncf-glossary-monolithic-apps, cncf-glossary-microservices-architecture*

**What it is** Two architectural shapes distinguished by one thing: how many independently
deployable units the application has. A monolithic application contains all its functionality
in a single deployable program. A microservices architecture breaks the application into
individual independent services, each focused on a specific capability, which together appear
to the user as one system.

**Why it matters** The examinable content is the trade-off, not a verdict. Microservices make
functionality easier to deploy, update, and scale independently — a surge in sign-ups can be
met by scaling the sign-up service rather than the whole application, which is precisely what a
monolith cannot do. In exchange, operational overhead rises by an order of magnitude: more
things to deploy, monitor, secure, and keep running, plus network latency, partial failure, and
versioned interfaces between services that used to be function calls. An answer asserting that
microservices are simply better is wrong for that reason.

**How it works** The dividing line is deployment independence, not code size or code quality.
A monolith is not "badly written" and a microservice is not defined by being small: a
well-designed monolith is often the simplest way to get an application running and the right
place to start, and decomposing it is worth doing once the product has proven valuable and the
codebase's shared ownership has become the constraint. Building microservices before that point
spends engineering effort on operational machinery for an application that may yield no value.

**Key terms** deployable unit; independent scaling; operational overhead; network boundary.

#### Scenario

A product team runs one deployable application and complains that a spike in sign-ups forces
them to scale every part of the system, including video streaming that is not busy at all. That
is the monolith's scaling unit doing what it does, and splitting the sign-up capability into
its own service would fix it. Before agreeing, count what the split adds: two artifacts and two
pipelines instead of one, a network call where a function call used to be, a version contract
between the two, and twice the surface to monitor and roll back independently. The trade is
worth making when the load profiles genuinely diverge and the product has proved valuable; it
is premature when the real complaint is that the codebase is untidy, since deployment
independence and code quality are separate problems.

#### Knowledge check

1. What single property distinguishes a monolith from a microservices architecture?
   The number of independently deployable units — one, versus many.
2. Name the cost that microservices buy independent scaling and release with.
   Operational overhead: many more things to deploy, monitor, secure, and keep running, plus
   network latency, partial failure, and interface versioning between services.
3. Is a monolith by definition poorly designed?
   No. Deployment shape and code quality are independent; a well-designed monolith is often the
   right starting point and can be decomposed later.
4. A team's complaint is that their codebase is hard to read and change. Is splitting it into
   microservices the indicated fix?
   Not on that evidence — that is a code-quality problem. Microservices address independent
   deployment and scaling, and add operational cost while doing it.
