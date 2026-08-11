# DevOps Fundamentals

DevOps Fundamentals is worth 12% of the exam — 5th largest of 6 domains — under the current
(2025-09-16) blueprint. On the retired blueprint it was worth 16% (`data/competencies.json`,
`previous_weight`), so it lost four percentage points while System Administration Fundamentals
gained ten. What it did not lose is content: the domain still carries 71 concepts across its
three competencies, which is 5.9 concepts per percentage point of the exam — the second-densest
ratio of the six domains, behind only IT Project Management Fundamentals at 8.0. The weight
drop therefore makes this domain a worse *return* on study time, not a smaller *body* of study
time, and it is the specific shape that invites a bad triage decision. Resist it on arithmetic:
against a 75% pass mark, a 71% attempt needs four points, and this domain is worth up to twelve.
Twelve points supply all four only if you are currently losing most of them here — a candidate
who dropped marks evenly across the six domains recovers about 1.7 of the four by halving the
DevOps error rate. So this domain is part of a plan rather than the plan, and the three
competencies below are far smaller than System Administration's 173 concepts.

## What the 2025 update did to this domain

`npm run guide-plan` prints `2025 status: unchanged` for all three competencies —
[DevOps Basics](05-devops/devops-basics.md), [Git Concepts](05-devops/git-concepts.md) and
[Containers](05-devops/containers.md). None was added in the 2025 update, none was reworded,
and the domain itself was not renamed (`changes_2025.renamed_from` is `null`). This domain is
the quiet one: only the weight drop and one removal distinguish it from its predecessor.

That matters because of the rule that governs the noisy domains. A competency **added** in the
2025 update has, by definition, no pre-2025 material behind it — no book chapter, no course
lesson, no practice bank written before 2025-09-16 was aimed at an objective that did not then
exist, so anything you find on such a competency is either newly written or repurposed from a
neighbouring topic, and it has to be sourced independently. Nothing in DevOps Fundamentals
triggers that rule. Every competency name here predates the update, so pre-2025 DevOps material
is still on-syllabus for all three.

The one asymmetry runs the other way. `Deployment Environments` was a competency of this domain
before 2025-09-16 and was **removed** (`changes_2025.removed_competencies`). Its surviving
material is now a single concept inside DevOps Basics —
[deployment environments](05-devops/devops-basics.md#c-devops.devops-basics.deployment-environments).
Older material is therefore not wrong about it, but it is badly *weighted*: it will give the
subject a chapter's worth of attention where the current blueprint gives it one concept among
25. Read old DevOps material for content, never for proportion.

## Where LFS200 leaves you

Taken verbatim from each competency's `guide-plan` header:

| Competency | LFS200 coverage (which concepts LFS200 touches at all, not how deeply) |
| --- | --- |
| DevOps Basics | 2 FULLY COVERED, 18 NOT COVERED, 4 PARTIALLY COVERED, 1 MENTIONED ONLY — 7/25 (28%) are not NOT COVERED |
| Git Concepts | 5 FULLY COVERED, 17 NOT COVERED — 5/22 (23%) are not NOT COVERED |
| Containers | 1 FULLY COVERED, 23 NOT COVERED — 1/24 (4%) are not NOT COVERED |

Those three lines add to 13 of the domain's 71 concepts. In the per-competency table of
`research/lfs200-notes/00-course-map.md`, which ranks all 22 competencies, the three sit at
28%, 23% and 4% — one of only two domains, with Linux Fundamentals, whose every competency has
non-zero coverage, and still a 24-point internal range:

- **DevOps Basics, 28% (7/25), 2 lessons** — second-highest coverage of the 22 competencies,
  behind only IT Project Management :: Open Source Software and Licensing at 32%.
- **Git Concepts, 23% (5/22), 1 lesson** — fourth-highest. That lesson, `ch10.l5` at 8,727
  characters, is one of only four the course map names as material the course covers *well*.
- **Containers, 4% (1/24), 1 lesson** — eleventh of the 22, and the second-lowest non-zero
  figure; only Security :: Security at 3% sits below it, and the remaining ten are all at 0%.

The structural evidence behind the Containers figure is stronger than a percentage. The course
map's measured-absence pass records that `Docker`, `pod`, `registry`, `orchestration` and
`container image` each occur **zero times** across the course's 158,185 characters — in a
chapter that has a Containers lesson (`ch10.l3`, 3,926 characters). The lesson exists and stops
short of every noun the exam uses.

Two calibrations before you act on the numbers. First, the course map states its own
percentages are a **lower bound**: a concept can be taught without its name appearing, so
`NOT COVERED` means "the concept's term was not matched in a lesson teaching that competency",
not "you were never taught this". Second, the DevOps chapter also carries `ch10.l4 Deployment
Environments` (2,397 characters) — a lesson for the competency the 2025 update removed, which
is the clearest single illustration of the course map's Finding 1, that LFS200 is still built
on the retired syllabus.

## Section map

### [DevOps Basics](05-devops/devops-basics.md) — 25 concepts

| Section | Covers |
| --- | --- |
| [Culture](05-devops/devops-basics.md#s-devops-basics-culture) | What the practice is and the organisational problem it answers |
| [CI/CD](05-devops/devops-basics.md#s-devops-basics-ci-cd) | The integrate/deliver/deploy axis, pipelines, builds, artifacts, versioning, tooling |
| [Delivery](05-devops/devops-basics.md#s-devops-basics-delivery) | Environments, the three release strategies, rollback, environment parity, language package managers |
| [Automation](05-devops/devops-basics.md#s-devops-basics-automation) | Infrastructure as code and idempotency |
| [Architecture](05-devops/devops-basics.md#s-devops-basics-architecture) | Monolith against microservices, and what that choice implies downstream |

### [Git Concepts](05-devops/git-concepts.md) — 22 concepts

| Section | Covers |
| --- | --- |
| [Fundamentals](05-devops/git-concepts.md#s-git-concepts-fundamentals) | Version control, the distributed model, repositories, the three-state model, commits |
| [Branching](05-devops/git-concepts.md#s-git-concepts-branching) | Branches, merge, rebase, conflicts |
| [Collaboration](05-devops/git-concepts.md#s-git-concepts-collaboration) | Remotes, push, fetch against pull, clone against fork, pull requests, tags |
| [Practice](05-devops/git-concepts.md#s-git-concepts-practice) | `.gitignore`, the undo operations, inspection commands |

### [Containers](05-devops/containers.md) — 24 concepts

| Section | Covers |
| --- | --- |
| [Fundamentals](05-devops/containers.md#s-containers-fundamentals) | Containers, images, layers, registries, tags |
| [Building](05-devops/containers.md#s-containers-building) | The Dockerfile and which instructions add a layer |
| [Running](05-devops/containers.md#s-containers-running) | Lifecycle, ports, volumes and bind mounts, environment variables, logs and exec, state |
| [Ecosystem](05-devops/containers.md#s-containers-ecosystem) | Runtimes and OCI, Docker Compose, container security |
| [Orchestration](05-devops/containers.md#s-containers-orchestration) | Kubernetes: clusters and nodes, pods, Deployments, Services, control plane, desired state, CNCF |

Every section listed above carries its own Scenario and Knowledge check; the apparatus is per
section, not per file, so a second pass over one section's checks is a complete unit of work.

## Comparison blocks

Eleven comparison blocks are owned by concepts in this domain. They are where the domain's
marks actually are: every one of them is a set of terms the exam can place side by side as
options in a single question.

| Block | File |
| --- | --- |
| [Continuous integration vs Pipeline](05-devops/devops-basics.md#cmp-devops.devops-basics.continuous-integration) | DevOps Basics |
| [Continuous delivery vs Continuous deployment vs Continuous integration](05-devops/devops-basics.md#cmp-devops.devops-basics.continuous-delivery) | DevOps Basics |
| [Blue-green deployment vs Canary release vs Rolling deployment](05-devops/devops-basics.md#cmp-devops.devops-basics.blue-green-deployment) | DevOps Basics |
| [Commit vs Push](05-devops/git-concepts.md#cmp-devops.git-concepts.commit) | Git Concepts |
| [Merge vs Pull request vs Rebase](05-devops/git-concepts.md#cmp-devops.git-concepts.merge) | Git Concepts |
| [Clone vs fork vs Forking a project](05-devops/git-concepts.md#cmp-devops.git-concepts.clone-vs-fork) | Git Concepts |
| [Revert vs reset vs Rebase](05-devops/git-concepts.md#cmp-devops.git-concepts.revert-vs-reset) | Git Concepts |
| [Container vs Container image vs Pod](05-devops/containers.md#cmp-devops.containers.container) | Containers |
| [Container image vs Dockerfile vs Registry](05-devops/containers.md#cmp-devops.containers.container-image) | Containers |
| [Container orchestration vs Docker Compose](05-devops/containers.md#cmp-devops.containers.container-orchestration) | Containers |
| [Deployment vs Kubernetes service vs Pod](05-devops/containers.md#cmp-devops.containers.deployment) | Containers |

Note two structural features of that list. Rebase appears in two different blocks, and Pod
appears in two — a concept can be a member of more than one comparison, so recalling one
block's axis is not the same as being able to place the term. And one block reaches out of the
domain entirely: `Clone vs fork vs Forking a project` compares a Git concept against a concept
belonging to IT Project Management :: Open Source Software and Licensing.

Five concepts in this domain are compared inside seven blocks **owned elsewhere**. The canonical
treatment of each lives in the other domain's file, and the DevOps-side concept carries only a
pointer to it, so these are the comparisons most easily missed by reading this domain alone:

| DevOps concept | Compared inside |
| --- | --- |
| Container | [Virtual machine](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.virtual-machine) |
| Container | [Virtualization](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.virtualization) |
| Observability | [Monitoring and metrics](03-cloud-computing/performance-availability.md#cmp-cloud.performance-availability.monitoring-and-metrics) |
| Version control | [Change management](02-system-administration/best-practices.md#cmp-sysadmin.best-practices.change-management) |
| Version control | [Backup](02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.backup) |
| Infrastructure as code | [Configuration management](02-system-administration/best-practices.md#cmp-sysadmin.best-practices.configuration-management) |
| Language package managers | [Package](02-system-administration/system-administration.md#cmp-sysadmin.system-administration.package) |

## Recommended study order

Read the three competencies in this order — **DevOps Basics, then Containers, then Git
Concepts** — for two reasons that pull the same way: vocabulary dependency, and the point in
your available time at which each subject can still absorb effort.

1. **[DevOps Basics](05-devops/devops-basics.md) first.** It is the only one of the three whose
   vocabulary the other two reuse. Containers' Orchestration section runs on terms — Deployment,
   rollout, desired state — that collide directly with the release-strategy terms in Delivery,
   and its Ecosystem section presumes the pipeline and artifact vocabulary from CI/CD. Reading
   Containers first means meeting `Deployment` twice with no way to tell which sense is being
   tested. The Architecture section is also the motivation for the whole Containers competency,
   so it belongs before it rather than after.
2. **[Containers](05-devops/containers.md) second.** It is the domain's largest
   independent-study burden — 1/24, against 7/25 and 5/22 — and the one competency here you
   should read assuming nothing was taught to you. It is also the domain's densest chain: Dockerfile to image to registry to runtime to
   pod to Deployment to Service, with four owned comparison blocks strung along it. Work of that
   shape degrades badly when it is done last and rushed, which is the argument for taking it
   while attention is still available rather than saving the hardest thing for the end.
3. **[Git Concepts](05-devops/git-concepts.md) third.** It is the one competency here whose
   single dedicated lesson (`ch10.l5`, 8,727 characters) the course map lists among the four it
   covers well — 23% coverage, fourth-highest of the 22 — and it is the one a working candidate
   is most likely to know partially from practice already. That makes it the safest to read late, and it
   changes what "reading" means for it: skim the Fundamentals section for gaps, then spend the
   time on Practice and on the four comparison blocks, since day-to-day Git use teaches merge
   against rebase and revert against reset by muscle memory rather than by the distinction the
   exam asks you to state.

Then make a second pass over the eleven owned comparison blocks and the seven inbound ones
above, in a single sitting, without re-reading the topics around them. A comparison block you
can only reconstruct by re-reading its concepts has not been learned to the standard a
multiple-choice option set tests. For a candidate four points short, that second pass is a
better use of an hour than any first pass over material you have already read once.
