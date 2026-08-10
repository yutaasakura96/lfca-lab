# Cloud Computing Fundamentals

The domain index. It carries no definitions — every concept is defined once, in one of the
five competency files below, and everything here links to those definition sites. Cloud
Computing Fundamentals is 18% of the exam — 2nd largest of 6 domains on the current
(2025-09-16) blueprint — and holds 82 of the guide's 537 concepts across five competency
files.

## Weight, and what the change means for study effort

`data/competencies.json` records the domain at **18%**, against a **previous_weight of 20%**
under the pre-2025-09-16 syllabus. That is a two-point reduction, and the rank moved with it. At
20% the domain was joint-largest under the retired syllabus, tied with Linux Fundamentals (20)
and System Administration Fundamentals (20), with nothing above it. At 18% it is a clear second,
behind System Administration Fundamentals (30) — which absorbed ten points — and ahead of Linux
Fundamentals (16), Security Fundamentals (14), DevOps Fundamentals (12) and IT Project
Management Fundamentals (10).

Do not scale effort to the two points lost, because the material moved the other way. The same
update removed Serverless as a named competency and added two new ones. Best Practices and
Networking together account for 29 of this domain's 82 concepts — over a third of the domain —
so the syllabus surface here grew while the weight shrank. Cost per mark rose.

Against the corpus, the domain is proportionate: 82 of 537 concepts (15%) for 18% of the
exam. The imbalance is inside the domain, not against it. For a candidate who scored 71%
against a 75% pass mark, 18% of the exam is more than the whole shortfall, and the two added
competencies are the part of it with no legacy study material of any kind.

## What the 2025 update changed

| Competency | 2025 status | Previous name | Rewording significance |
| --- | --- | --- | --- |
| Cloud Computing | reworded | Cloud Computing Fundamentals | substantive |
| Performance/Availability | reworded | Performance / Availability | formatting |
| Budgeting | reworded | Cloud Costs and Budgeting | substantive |
| Best Practices | **added** | — | — |
| Networking | **added** | — | — |

One competency was removed: **Serverless**. It survives in this guide as a concept inside
Cloud Computing's Service models section — see
[serverless and FaaS](03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.serverless-and-faas) —
because the subject is still examinable under Cloud Computing even though the syllabus no
longer names a competency after it. The other collision the update created is that
**Networking** now names two different competencies in two different domains; this one is the
cloud network, and the on-the-wire protocol material is System Administration's.

Best Practices and Networking are marked `added`, and the consequence is absolute rather than
a matter of degree: **no pre-2025 material covers an added competency.** No older courseware,
no question bank predating 2025-09-16, and no LFS200 lesson can have been written against an
objective that did not exist when they were made. Any resource that claims complete LFCA cloud
coverage and predates the current exam is silent on these 29 concepts by construction, not by
oversight. Everything in those two files had to be sourced independently.

The three `reworded` competencies split. `data/competencies.json`'s
`rewording_significance_note` states that `formatting` means only punctuation or whitespace
differs between the two page renders, so pre-2025 material on **Performance/Availability**
remains valid — the name went from "Performance / Availability" to "Performance/Availability"
and nothing else. `substantive` means the scope or emphasis plausibly changed, which applies to
**Cloud Computing** and **Budgeting**; older material on those two may still be accurate on
individual facts while being scoped to a different objective, so use it for content and not for
deciding what is in scope.

## LFS200 coverage position

`research/lfs200-notes/00-course-map.md` measures LFS200 against this dataset. Its structural
findings and its per-competency figures both go one way here.

Structurally: the course carries **one substantive cloud lesson**, ch8.l2 "Software and Cloud
Computing :: Cloud Computing Basics", 6,242 characters — about 4% of the course's 158,185
characters of instructional text — and it is the only lesson any concept in this domain cites
(`data/topics/03-cloud-computing.json`, `lfs200_sources`). Three of the five competencies
(Performance/Availability, Best Practices, Networking) have **no lesson at all**. Budgeting is
mapped to a lesson in the course map's coverage table but registers zero covered concepts. The course map's own conclusion is that cloud is the worst weight-to-coverage ratio
on the exam, and it lists `serverless`, `elasticity`, `scalability`, `load balancer`, `CDN`,
`VPC`, `region` and `availability zone` as exact strings occurring **zero** times across the
entire course.

Per competency, taken verbatim from `npm run guide-plan`:

| Competency | LFS200 coverage (which concepts LFS200 touches at all, not how deeply) |
| --- | --- |
| Cloud Computing | 1 FULLY COVERED, 20 NOT COVERED, 2 MENTIONED ONLY — 3/23 (13%) are not NOT COVERED |
| Performance/Availability | 17 NOT COVERED — 0/17 (0%) are not NOT COVERED |
| Budgeting | 13 NOT COVERED — 0/13 (0%) are not NOT COVERED |
| Best Practices | 15 NOT COVERED — 0/15 (0%) are not NOT COVERED |
| Networking | 14 NOT COVERED — 0/14 (0%) are not NOT COVERED |

Three of the domain's 82 concepts are touched by the course at any depth, and all three are in
Cloud Computing. One of them is FULLY COVERED; the other two are MENTIONED ONLY, which is a
weaker claim than covered.

Two caveats, both from the course map's own Method section, and they pull in opposite
directions. The percentages are a **lower bound** — a concept can be taught without its name
appearing, and the cross-check that removes false positives admits false negatives — so true
coverage is somewhat higher than 3/82. Against that, LFS200 is still built on the retired
syllabus: its chapter and lesson names are the old domain and competency names, so where it
does teach cloud material it teaches it to the pre-2025 scope. Neither caveat changes the
practical position: completing LFS200 leaves this domain essentially unstudied.

## Section map

Every `## ` section in every competency file of this domain, with its concept count.

### [Cloud Computing](03-cloud-computing/cloud-computing.md) — 23 concepts, 7 at depth 2 and 16 at depth 3

| Section | Concepts |
| --- | ---: |
| [Fundamentals](03-cloud-computing/cloud-computing.md#s-cloud-computing-fundamentals) | 3 |
| [Service models](03-cloud-computing/cloud-computing.md#s-cloud-computing-service-models) | 4 |
| [Deployment models](03-cloud-computing/cloud-computing.md#s-cloud-computing-deployment-models) | 4 |
| [Virtualization](03-cloud-computing/cloud-computing.md#s-cloud-computing-virtualization) | 4 |
| [Operating model](03-cloud-computing/cloud-computing.md#s-cloud-computing-operating-model) | 5 |
| [Storage](03-cloud-computing/cloud-computing.md#s-cloud-computing-storage) | 1 |
| [Adoption](03-cloud-computing/cloud-computing.md#s-cloud-computing-adoption) | 2 |

### [Performance/Availability](03-cloud-computing/performance-availability.md) — 17 concepts, 1 at depth 1, 5 at depth 2, 11 at depth 3

| Section | Concepts |
| --- | ---: |
| [Availability](03-cloud-computing/performance-availability.md#s-performance-availability-availability) | 5 |
| [Scaling](03-cloud-computing/performance-availability.md#s-performance-availability-scaling) | 6 |
| [Performance](03-cloud-computing/performance-availability.md#s-performance-availability-performance) | 6 |

### [Budgeting](03-cloud-computing/budgeting.md) — 13 concepts, 2 at depth 1, 4 at depth 2, 7 at depth 3

| Section | Concepts |
| --- | ---: |
| [Cost models](03-cloud-computing/budgeting.md#s-budgeting-cost-models) | 5 |
| [Cost control](03-cloud-computing/budgeting.md#s-budgeting-cost-control) | 8 |

### [Best Practices](03-cloud-computing/best-practices.md) — 15 concepts, 13 at depth 2 and 2 at depth 3

| Section | Concepts |
| --- | ---: |
| [Architecture](03-cloud-computing/best-practices.md#s-best-practices-architecture) | 5 |
| [Security posture](03-cloud-computing/best-practices.md#s-best-practices-security-posture) | 5 |
| [Operations](03-cloud-computing/best-practices.md#s-best-practices-operations) | 5 |

### [Networking](03-cloud-computing/networking.md) — 14 concepts, 7 at depth 2 and 7 at depth 3

| Section | Concepts |
| --- | ---: |
| [Cloud network](03-cloud-computing/networking.md#s-networking-cloud-network) | 14 |

Networking is the domain's only single-section file, and the only one whose opener carries a
provider name map — AWS, Azure and Google Cloud terms against the vendor-neutral mechanism.
Read that table before the topics, not after.

## Recommended study order

Read in dependency order, not weight order. Each file below assumes the vocabulary of the ones
above it, and six of the domain's 26 comparison blocks pair a concept in one file with a
concept in another.

1. **[Cloud Computing](03-cloud-computing/cloud-computing.md)** — first, because it supplies
   the terms the other four assume: service models, deployment models, region and availability
   zone, the shared responsibility split, the virtualization stack, and the object/block/file
   storage distinction that Budgeting's storage-tier comparison is written against. It also
   owns 11 of the domain's 26 comparison blocks, and it is the only file where prior LFS200
   study gives you anything (3 of 23 concepts).
2. **[Performance/Availability](03-cloud-computing/performance-availability.md)** — second,
   because it is the domain's discrimination-heaviest file: 11 of its 17 concepts sit at depth
   3, meaning each is one end of a named confusable pair, and it owns six comparison blocks.
   Its SLA material is compared directly against Cloud Computing's, so it reads badly out of
   order.
3. **[Networking](03-cloud-computing/networking.md)** — third, because it is mechanism, and
   the mechanism has to be in place before a design can be judged. Multi-zone deployment is the
   one practice Best Practices names that turns on a network fact — whether spreading a
   workload across zones needs one subnet per zone or one subnet for the whole region — and
   that fact is stated here, not there. The rest of the vocabulary a described architecture
   arrives in — virtual private cloud, public and private subnets, internet and NAT gateways,
   security groups, bastion hosts, private connectivity — is defined only in this file.
4. **[Budgeting](03-cloud-computing/budgeting.md)** — fourth, because it prices decisions the
   first three files make. Instance size, storage class, zone and region placement, and the
   direction of data transfer are all cost questions whose underlying mechanism you now have.
5. **[Best Practices](03-cloud-computing/best-practices.md)** — last, because it synthesises.
   13 of its 15 concepts are depth 2 — conceptual, not one end of a named confusable pair —
   and the exam's leverage in this file is not whether a practice is a good idea but which of
   two nearly identical good ideas answers the described problem. That judgement needs the
   other four files behind it.

Last does not mean lightest. Positions 3 and 5 are the two competencies added in 2025: 29
concepts with no pre-2025 material and no course lesson, which is the most plausible place for
a 71% score to have leaked. Budget time for them by concept count, not by reading order.

## Comparison blocks in this domain

26 blocks, each owned by one concept and written once at the anchor below. A concept that is a
member rather than the owner carries a pointer to the same anchor from its own topic, so
approaching from either side lands here.

| Comparison | Owned in | Crosses a file boundary |
| --- | --- | --- |
| [Cloud computing vs Virtualization](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.cloud-computing) | Cloud Computing | no |
| [IaaS vs PaaS](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.iaas) | Cloud Computing | no |
| [PaaS vs SaaS vs Serverless and FaaS](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.paas) | Cloud Computing | no |
| [Private cloud vs Public cloud](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.private-cloud) | Cloud Computing | no |
| [Hybrid cloud vs Multi-cloud](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.hybrid-cloud) | Cloud Computing | no |
| [Virtualization vs Containers](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.virtualization) | Cloud Computing | yes — DevOps :: Containers |
| [Hypervisor vs Virtualization](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.hypervisor) | Cloud Computing | no |
| [Virtual machine vs Container](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.virtual-machine) | Cloud Computing | yes — DevOps :: Containers |
| [Container vs virtual machine vs Virtual machine](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.container-vs-virtual-machine) | Cloud Computing | no |
| [Managed services vs PaaS](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.managed-services) | Cloud Computing | no |
| [Service level agreement vs High availability vs SLA, SLO and SLI](03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.service-level-agreement) | Cloud Computing | yes — Performance/Availability |
| [Availability vs High availability](03-cloud-computing/performance-availability.md#cmp-cloud.performance-availability.availability) | Performance/Availability | no |
| [Fault tolerance vs High availability](03-cloud-computing/performance-availability.md#cmp-cloud.performance-availability.fault-tolerance) | Performance/Availability | no |
| [Failover vs Load balancing](03-cloud-computing/performance-availability.md#cmp-cloud.performance-availability.failover) | Performance/Availability | no |
| [Horizontal scaling vs Stateless design vs Vertical scaling](03-cloud-computing/performance-availability.md#cmp-cloud.performance-availability.horizontal-scaling) | Performance/Availability | no |
| [Caching vs Content delivery network](03-cloud-computing/performance-availability.md#cmp-cloud.performance-availability.caching) | Performance/Availability | no |
| [Monitoring and metrics vs Observability](03-cloud-computing/performance-availability.md#cmp-cloud.performance-availability.monitoring-and-metrics) | Performance/Availability | yes — DevOps :: DevOps Basics |
| [On-demand, reserved and spot pricing vs Pay-as-you-go](03-cloud-computing/budgeting.md#cmp-cloud.budgeting.on-demand-reserved-and-spot-pricing) | Budgeting | no |
| [Orphaned resources vs Rightsizing](03-cloud-computing/budgeting.md#cmp-cloud.budgeting.orphaned-resources) | Budgeting | no |
| [Budgets and cost alerts vs Cost monitoring](03-cloud-computing/budgeting.md#cmp-cloud.budgeting.budgets-and-cost-alerts) | Budgeting | no |
| [Storage tiers and lifecycle policies vs Object, block and file storage](03-cloud-computing/budgeting.md#cmp-cloud.budgeting.storage-tiers-and-lifecycle-policies) | Budgeting | yes — Cloud Computing |
| [Automation over manual configuration vs Immutable infrastructure](03-cloud-computing/best-practices.md#cmp-cloud.best-practices.automation-over-manual-configuration) | Best Practices | no |
| [Cloud subnets vs Virtual private cloud](03-cloud-computing/networking.md#cmp-cloud.networking.cloud-subnets) | Networking | no |
| [Public vs private subnet vs Internet gateway and NAT gateway](03-cloud-computing/networking.md#cmp-cloud.networking.public-vs-private-subnet) | Networking | no |
| [Security group vs network ACL vs Firewall](03-cloud-computing/networking.md#cmp-cloud.networking.security-group-vs-network-acl) | Networking | yes — System Administration :: Networking |
| [Hybrid connectivity vs VPC peering and private connectivity](03-cloud-computing/networking.md#cmp-cloud.networking.hybrid-connectivity) | Networking | no |

Four blocks reach outside the domain entirely — two into DevOps :: Containers, one into DevOps
:: DevOps Basics, one into System Administration :: Networking. Those four are the ones worth
revisiting after the DevOps and System Administration domains, because a question can arrive
from either side of the boundary and the cloud file only carries the cloud half of the answer.
