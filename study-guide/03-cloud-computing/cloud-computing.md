# Cloud Computing

Cloud Computing is the anchor competency of the Cloud Computing Fundamentals domain, which
carries 18% of the exam — the 2nd largest of 6 domains on the current (2025-09-16)
blueprint — and the competency itself was reworded, not introduced, by the 2025 update.
LFS200 barely reaches it: of its 23 concepts, 1 is FULLY COVERED, 20 are NOT COVERED and 2
are MENTIONED ONLY — 3 of 23, 13%, that the course touches at all
(`research/lfs200-notes/00-course-map.md`). Everything else below is sourced independently:
NIST SP 800-145 for the service and deployment model definitions, and provider primary
documentation for the operational facts. The exam is vendor-neutral, so provider names
appear here only as worked examples of a category, never as the answer to a category
question.

<a id="s-cloud-computing-fundamentals"></a>
## Fundamentals

<a id="c-cloud.cloud-computing.cloud-computing"></a>
### Cloud computing
*id: `cloud.cloud-computing.cloud-computing` · depth 3 · importance 2 · LFS200: FULLY COVERED · sources: nist-sp-800-145*

**What it is** A delivery model, not a technology. NIST SP 800-145 defines cloud computing
as a model for enabling on-demand network access to a shared pool of configurable computing
resources that can be rapidly provisioned and released with minimal management effort or
service provider interaction. The consumption is metered and billed by use rather than by
capital purchase. Nothing in that definition names virtualization, containers, or any
particular vendor.

**Why it matters** Almost every wrong answer in this domain comes from treating "cloud" as
a synonym for something narrower — a hypervisor, a datacentre someone else owns, a rented
virtual machine. The definition is the discriminator: if a system does not provide
self-service provisioning, elastic scaling and measured usage, it is not cloud, however
modern its hardware.

**How it works** A provider pools physical compute, storage and network capacity, exposes
it through an API and a console, and multiplexes many customers onto it. A customer
requests capacity programmatically, gets it in seconds without a human transaction, and
stops paying when they release it. The five characteristics below are the load-bearing part
of the definition; the service and deployment models are just two ways of slicing where the
boundary of responsibility falls.

**Key terms** on-demand; metered consumption; shared pool; provisioned and released.

**Traps** "We virtualized our datacentre, so we are on the cloud" is the classic false
equivalence — virtualization is one enabling technology, and a virtualized estate with a
ticket-based provisioning process fails the on-demand self-service test outright. The
reverse error is equally testable: not every cloud resource is a VM. Bare-metal instances,
containers and functions are all cloud services, so "cloud means virtual machines" is
wrong in the other direction. Cloud is also not defined by who owns the hardware — a
private cloud is still cloud.

**What the exam may test** Given a described environment (an owned datacentre with
automated self-service and chargeback; a colocation rack rented by the month; a virtualized
cluster with a manual request form), decide which qualifies as cloud computing and name the
characteristic that decides it.

<a id="cmp-cloud.cloud-computing.cloud-computing"></a>
#### Not to be confused with: Cloud computing vs Virtualization
*compares: `cloud.cloud-computing.cloud-computing`, `cloud.cloud-computing.virtualization`*

| | Cloud computing | Virtualization |
| --- | --- | --- |
| Category | A service delivery and billing model | A technology for partitioning hardware |
| Defined by | Self-service, network access, pooling, elasticity, measured service | One physical host presenting many isolated virtual computers |
| Can exist without the other | Yes — bare-metal and function-based cloud services use no customer-visible VM | Yes — a single virtualized server in a cupboard is not a cloud |
| Who can have it | A provider or an organisation running its own private cloud | Anyone with a hypervisor and a host |
| What buying it gets you | Capacity on demand, billed by consumption | Better utilisation of hardware you already own |

The separating axis is category: virtualization is a technique for slicing a machine; cloud
computing is a way of selling and consuming capacity. Virtualization usually powers cloud,
but neither implies the other.

<a id="c-cloud.cloud-computing.essential-characteristics"></a>
### Essential characteristics
*id: `cloud.cloud-computing.essential-characteristics` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** The five properties NIST SP 800-145 requires before something counts as
cloud: on-demand self-service (the consumer provisions capacity unilaterally, without human
interaction with the provider), broad network access (available over the network through
standard mechanisms, to thin and thick clients alike), resource pooling (a multi-tenant
model with resources dynamically assigned, and the consumer generally unaware of their exact
physical location), rapid elasticity (capacity scales outward *and inward* to match demand,
appearing effectively unlimited), and measured service (a metering capability that controls,
reports and bills usage).

**Why it matters** These five are the test the exam applies when a scenario asks whether an
arrangement is really cloud, or which property a described benefit depends on. They are also
the source of the standard distractors: "virtualization", "multi-tenancy", "pay as you go"
and "high availability" are all plausible-sounding items that are not on the list.

**How it works** Each characteristic underwrites a different observable behaviour. Measured
service is why the bill tracks usage; rapid elasticity is why an autoscaling group shrinks
overnight; resource pooling is why you cannot generally point at the physical server your
instance runs on; on-demand self-service is why no ticket is needed. Multi-tenancy is
described inside resource pooling, not as a sixth item, and pay-per-use is the billing
consequence of measured service, not a characteristic in its own right.

**Key terms** on-demand self-service; broad network access; resource pooling; rapid
elasticity; measured service.

<a id="c-cloud.cloud-computing.major-cloud-providers"></a>
### Major cloud providers
*id: `cloud.cloud-computing.major-cloud-providers` · depth 2 · importance 2 · LFS200: MENTIONED ONLY · sources: aws-regions-and-azs, azure-availability-zones*

**What it is** Amazon Web Services, Microsoft Azure and Google Cloud are the three
hyperscale public providers. Each sells the same small set of service categories under
different brand names, and the LFCA is vendor-neutral: it can reasonably expect you to
recognise a category from a product name, but not to know pricing, quotas or console
navigation for any one provider.

**Why it matters** Scenario questions borrow vendor vocabulary casually. Being able to map a
named product back to its category — object storage, managed relational database, identity
service — lets you answer the underlying category question even when the wording is
AWS-flavoured or Azure-flavoured.

**How it works** The mapping is close to one-to-one across the three, because the categories
are structural rather than proprietary:

| Category | AWS | Azure | Google Cloud |
| --- | --- | --- | --- |
| Virtual machines | Amazon EC2 | Azure Virtual Machines | Compute Engine |
| Object storage | Amazon S3 | Azure Blob Storage | Cloud Storage |
| Managed relational database | Amazon RDS | Azure SQL Database | Cloud SQL |
| Identity and access management | AWS IAM | Microsoft Entra ID | Cloud IAM |
| Region-internal fault domain | Availability Zone | Availability zone | Zone |

**Key terms** hyperscaler; service category; vendor-neutral.

#### Scenario

A finance team asks whether the company is "already on the cloud" because the internal
datacentre was virtualized last year and now runs a few hundred VMs. Apply the definition
rather than the vocabulary: provisioning a new VM still requires a ticket that a human
approves within two working days, so on-demand self-service fails; capacity is fixed at the
size of the purchased cluster, so rapid elasticity fails; and there is no metering, so
business units are billed a flat internal charge regardless of use — measured service fails
too. Three of the five essential characteristics are absent, so this is a virtualized
datacentre, not a cloud. When the team then asks which provider to compare against, the
answer is category-first: whatever they need in object storage will be Amazon S3, Azure Blob
Storage or Cloud Storage, and the choice turns on price and region availability, not on the
brand name.

#### Knowledge check

1. State the five essential characteristics of cloud computing.
   On-demand self-service, broad network access, resource pooling, rapid elasticity,
   measured service.
2. Is multi-tenancy one of the five essential characteristics?
   No — it is described inside resource pooling. Naming it as a sixth characteristic is a
   distractor.
3. A company virtualizes its entire datacentre but keeps a manual approval workflow for new
   servers. Is that cloud computing?
   No. Virtualization is a technology, not the delivery model; without on-demand
   self-service (and typically elasticity and metering) the definition is not met.
4. Rapid elasticity is often summarised as "it scales up." What does that summary leave out,
   and why does it matter for cost?
   It scales *in* as well as out, commensurate with demand — the inward direction is what
   makes measured service produce a smaller bill when load drops.
5. Which category do Amazon S3, Azure Blob Storage and Cloud Storage all belong to?
   Object storage.

<a id="s-cloud-computing-service-models"></a>
## Service models

<a id="c-cloud.cloud-computing.iaas"></a>
### IaaS
*id: `cloud.cloud-computing.iaas` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** Infrastructure as a Service. NIST defines the capability as provisioning
processing, storage, networks and other fundamental computing resources on which the
consumer can deploy and run arbitrary software, including operating systems. The consumer
does not manage the underlying cloud infrastructure but does control operating systems,
storage and deployed applications, and possibly limited networking components such as host
firewalls.

**Why it matters** IaaS is where candidates most consistently over-estimate the provider.
Renting a virtual machine does not rent an administered virtual machine: guest OS patching,
kernel upgrades, host-level firewall rules, backups of the data inside the instance and
application configuration all remain the customer's work. That single misconception
generates wrong answers in the shared responsibility, security and troubleshooting
questions alike.

**How it works** The provider operates the physical facility, the hardware, the
virtualization layer and the host operating system, and hands the customer a bare virtual
machine with an image of their choosing. From the guest OS boot loader upward, the machine
behaves exactly like a server in a rack: the same package manager, the same `systemd`, the
same patch cadence, the same responsibility. Storage volumes and virtual networks are
provisioned the same way — as raw building blocks the customer assembles.

**Key terms** guest operating system; fundamental computing resources; raw building blocks;
customer-managed patching.

**Traps** "The provider patches the OS" is false for IaaS and true for SaaS, and the exam
uses that asymmetry directly. A second trap is scope: a virtual machine is the canonical
IaaS product, but IaaS also covers block storage volumes and virtual networks, so a question
about "provisioning a virtual network" is still an IaaS question. A third: managed backup or
monitoring bolted onto an IaaS instance does not convert it to PaaS — the customer still
controls the OS.

**What the exam may test** Given a task (apply a kernel security patch, resize a volume,
change an application's runtime version), decide whether it falls to the customer or the
provider under IaaS — and recognise that the answer changes as the service model moves up.

<a id="cmp-cloud.cloud-computing.iaas"></a>
#### Not to be confused with: IaaS vs PaaS
*compares: `cloud.cloud-computing.iaas`, `cloud.cloud-computing.paas`*

| | IaaS | PaaS |
| --- | --- | --- |
| What you are given | Fundamental resources: compute, storage, network | A platform that runs application code you deploy |
| Highest layer you control | The operating system and everything above it | The deployed application and some hosting configuration |
| Who patches the guest OS | You | The provider |
| Who chooses the runtime version | You, by installing it | The provider offers versions; you select one |
| Unit you deploy | A machine image or an instance | An application artifact — code, a build, a package |
| Typical failure you own | An unpatched kernel, a misconfigured host firewall | An application defect or an unsupported runtime version |

The separating axis is where the operating system sits: in IaaS the OS is yours to run and
patch, in PaaS it is beneath the line the provider draws. Everything else in the table
follows from that one boundary.

<a id="c-cloud.cloud-computing.paas"></a>
### PaaS
*id: `cloud.cloud-computing.paas` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** Platform as a Service. NIST defines the capability as deploying onto the
cloud infrastructure consumer-created or acquired applications, built with programming
languages, libraries, services and tools the provider supports. The consumer does not manage
the network, servers, operating systems or storage beneath, but does control the deployed
applications and possibly configuration settings for the application-hosting environment.

**Why it matters** PaaS is the middle term in the model question the exam asks most often,
and it is the one defined by what you deploy rather than by what you rent. It is also the
boundary where responsibility for the runtime changes hands: the provider patches the OS and
usually the language runtime, while the code and its dependencies stay yours.

**How it works** You push an application artifact — source, a build, a package — and the
platform builds or accepts it, places it on infrastructure you never see, attaches routing
and TLS, and scales the number of application instances. Scaling policies, runtime versions
and environment variables are exposed as configuration; the machines behind them are not.
The trade is real control for real operational relief: you cannot install an arbitrary
system package, and you cannot choose a runtime version the provider does not offer.

**Key terms** application artifact; supported runtime; hosting environment configuration;
deploy rather than provision.

**Traps** "PaaS means I do not have to think about scaling" is only half true — most PaaS
platforms still bill for provisioned instances that stay warm, so an idle application costs
money; that is the specific line CNCF draws between PaaS and FaaS. The other trap is calling
every provider-operated component PaaS: a managed database you connect to is a managed
service, because you never deploy an application onto it.

**What the exam may test** Placing a described arrangement in the right model when the
wording is deliberately ambiguous — "the provider runs the runtime, we push code" is PaaS,
"the provider runs the whole application, we log in" is SaaS, "we rent the machine and
install the runtime" is IaaS.

*Not to be confused with [IaaS](cloud-computing.md#cmp-cloud.cloud-computing.iaas).*
*Not to be confused with [managed services](cloud-computing.md#cmp-cloud.cloud-computing.managed-services).*

<a id="cmp-cloud.cloud-computing.paas"></a>
#### Not to be confused with: PaaS vs SaaS vs Serverless and FaaS
*compares: `cloud.cloud-computing.paas`, `cloud.cloud-computing.saas`, `cloud.cloud-computing.serverless-and-faas`*

| | PaaS | SaaS | Serverless and FaaS |
| --- | --- | --- | --- |
| What the consumer supplies | An application they wrote or acquired | Only their data, users and settings | Individual functions plus their triggers |
| Who wrote the running application | The consumer | The provider | The consumer |
| Unit of deployment | A whole application | Nothing — it is already deployed | A single event-triggered function |
| Billing when idle | Usually still charged for provisioned instances | A subscription or per-seat fee, regardless of use | Typically nothing — charges apply while code runs |
| Scaling trigger | A policy the consumer configures | Invisible to the consumer | Each incoming event, automatically |
| State | May be held in the running instance | Held by the provider's application | Must be externalised; functions are stateless |

The separating axis is who wrote the running code and what triggers it: PaaS and FaaS both
run *your* code and differ in whether it stays resident or wakes per event, while SaaS runs
the *provider's* code and gives you no deployment unit at all.

<a id="c-cloud.cloud-computing.saas"></a>
### SaaS
*id: `cloud.cloud-computing.saas` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** Software as a Service. NIST defines the capability as using the provider's
applications running on a cloud infrastructure, reached through a thin client such as a
browser or through a program interface. The consumer does not manage the underlying
infrastructure, and does not control even individual application capabilities, with the
possible exception of limited user-specific configuration settings.

**Why it matters** SaaS is where the operational surface is smallest and the residual
customer responsibility is most often forgotten. The provider runs and patches everything,
but identity, access rights, data classification, sharing settings and what your users
upload are still entirely yours — and those are exactly the controls that fail in real
incidents.

**How it works** You buy a subscription, sign in, and configure the application within the
limits the provider exposes. There is no artifact to deploy, no runtime to select and no
server to size. Extension is limited to whatever API, webhook or plug-in framework the
provider publishes; if a feature is not offered, it cannot be installed.

**Key terms** thin client interface; user-specific configuration; subscription; residual
customer responsibility.

**Traps** "SaaS means the provider is responsible for security" is the misconception the
shared responsibility model exists to correct: the provider secures the application and its
infrastructure, but a misconfigured public sharing link or an over-privileged account is the
customer's failure at every service model. A second trap is billing: SaaS is normally a
per-seat or per-tenant subscription, so an unused seat still costs money — SaaS is not
consumption-billed in the way IaaS and FaaS are.

**What the exam may test** Identifying which residual responsibilities survive at SaaS
(identity, access control, data, configuration) and which do not (patching, capacity,
runtime versions).

*Not to be confused with [PaaS](cloud-computing.md#cmp-cloud.cloud-computing.paas).*

<a id="c-cloud.cloud-computing.serverless-and-faas"></a>
### Serverless and FaaS
*id: `cloud.cloud-computing.serverless-and-faas` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: cncf-glossary-serverless, nist-sp-800-145*

**What it is** Two related but distinct terms. The CNCF glossary defines serverless
computing as abstracting servers away from the user, with operational management — physical
machines, VM provisioning, scaling, resource provisioning — falling to the provider, and
charging on a pay-per-use basis. Function as a Service is the narrower model: individual
event-triggered functions that start on an event, run briefly, and shut down, with an
instance created per request and terminated afterwards, which is what allows charges to
disappear entirely when the code is dormant.

**Why it matters** Serverless is not a NIST service model, so exam wording tends to place it
against PaaS. CNCF states the distinction explicitly: FaaS charges only for computation time
while PaaS requires continuous resource availability. That, not "no servers," is the real
discriminator.

**How it works** You register a function with a trigger — an HTTP request, a queue message,
an object upload, a schedule. The platform holds no instance until an event arrives, creates
one, runs the function, and reclaims it. Because instances come and go, functions must be
stateless and hold durable state elsewhere: a database, an object store, a cache. The first
invocation after an idle period pays a cold start, which is a latency cost, not a billing
one.

**Key terms** event trigger; per-request instance; stateless; cold start; scale to zero.

**Traps** "Serverless means there are no servers" is the headline trap and it is simply
false — servers exist, the provider manages them, and the CNCF entry says so directly. The
second trap is treating serverless and FaaS as synonyms: CNCF calls serverless a
comprehensive term spanning PaaS through SaaS, with FaaS one member of it, so a managed
queue billed per message is serverless without being FaaS. The third is assuming serverless
is always cheaper — a function under sustained high load can cost more than a
continuously-running instance sized for the same throughput.

**What the exam may test** Separating the billing property (no charge when idle) from the
management property (no servers to administer), and recognising that a stateful,
long-running workload is a poor fit for FaaS regardless of how attractive the pricing looks.

*Not to be confused with [PaaS](cloud-computing.md#cmp-cloud.cloud-computing.paas).*

#### Scenario

A team runs a public web application on rented virtual machines and is told to cut
operational toil. Walk the models. Today it is IaaS: they patch the guest OS, manage the
runtime and own the host firewall rules. Moving the application onto a platform where they
push a build and select a supported runtime version makes it PaaS — the provider takes over
OS and runtime patching, and the team keeps the code and its dependencies. The nightly
thumbnail-generation job is a different shape: it runs for ninety seconds an hour and sits
idle the rest of the time, so an event-triggered function fits, and the bill drops to
computation time rather than a permanently provisioned instance. The internal helpdesk tool
they also maintain is retired in favour of a subscription product; that is SaaS, and the
only work left is provisioning accounts and deciding who may see what — which is still
their responsibility, not the vendor's.

#### Knowledge check

1. In IaaS, who applies operating system security patches inside the virtual machine?
   The customer. The provider's responsibility stops at the virtualization layer and host
   operating system.
2. What single boundary separates IaaS from PaaS?
   Who owns the operating system: in IaaS the customer runs and patches it; in PaaS it is
   below the line the provider draws.
3. What distinguishes FaaS from PaaS in billing terms?
   FaaS charges only while code executes and can scale to zero; PaaS normally requires
   continuously available provisioned resources that are billed whether used or not.
4. Are "serverless" and "FaaS" interchangeable?
   No. Serverless is the broader category spanning PaaS-like through SaaS-like services;
   FaaS is specifically event-triggered, short-lived, per-request function execution.
5. A vendor hosts an application; you log in, configure options and load your data. Which
   model, and what remains your responsibility?
   SaaS. Identity, access rights, sharing configuration and the data itself remain yours.
6. Why is a stateful, long-running process a poor candidate for FaaS?
   Function instances are created per request and terminated after execution, so state must
   live outside the function; long execution also loses the idle-cost advantage.

<a id="s-cloud-computing-deployment-models"></a>
## Deployment models

<a id="c-cloud.cloud-computing.public-cloud"></a>
### Public cloud
*id: `cloud.cloud-computing.public-cloud` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** In NIST's wording, cloud infrastructure provisioned for open use by the
general public. It may be owned, managed and operated by a business, an academic institution
or a government organisation, and it exists on the premises of the cloud provider.

**Why it matters** Public cloud is the default assumption behind most scenario questions —
elastic capacity, no capital expenditure, a global footprint of regions — and it is the
model whose name most often misleads. "Public" describes who may buy the service, not who
may see the data.

**How it works** The provider owns the facilities and hardware and sells capacity to anyone
who signs up. Customers are separated logically — separate accounts, separate virtual
networks, separate encryption keys, isolation enforced by the virtualization and identity
layers — while sharing the same physical estate. Capacity is effectively unbounded from any
one customer's perspective, which is what makes elasticity credible.

**Key terms** open use by the general public; provider premises; multi-tenant isolation;
no capital expenditure.

**Traps** "Public cloud means the data is public" is the misreading the term invites; the
adjective describes the availability of the service, not the visibility of your workload. A
second trap is assuming public cloud always costs less — steady, predictable, high-volume
workloads can be cheaper on owned hardware, and public cloud's advantage is elasticity and
speed, not an automatic discount.

**What the exam may test** Reading a described arrangement and matching it to the right NIST
deployment model, particularly when the scenario mixes ownership (who owns the hardware)
with access (who may buy the service).

*Not to be confused with [private cloud](cloud-computing.md#cmp-cloud.cloud-computing.private-cloud).*

<a id="c-cloud.cloud-computing.private-cloud"></a>
### Private cloud
*id: `cloud.cloud-computing.private-cloud` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** In NIST's wording, cloud infrastructure provisioned for exclusive use by a
single organisation comprising multiple consumers such as business units. Critically, NIST
adds that it may be owned, managed and operated by the organisation, a third party, or some
combination, and that it may exist on or off premises.

**Why it matters** That last clause is the whole exam trap. Private cloud is defined by
*exclusivity of use*, not by physical location and not by who owns the hardware. A
third-party-hosted, third-party-operated environment dedicated to one organisation is a
private cloud; a rack of servers in your own building with no self-service and no metering
is not a cloud at all.

**How it works** The organisation (or a provider acting for it) runs a cloud platform whose
tenants are all internal. The five essential characteristics still have to hold: business
units self-serve, capacity is pooled across them, usage is metered and charged back.
Motivations are usually regulatory, data-residency or latency-driven rather than economic,
since the organisation now carries the capacity-planning risk that a public provider would
otherwise absorb.

**Key terms** exclusive use; single organisation; on or off premises; chargeback.

**Traps** Two symmetrical errors: "private cloud means on-premises" (NIST explicitly allows
off-premises) and "on-premises means private cloud" (a virtualized datacentre without
self-service, elasticity and metering is just a datacentre). A third, less obvious one:
dedicated hardware inside a public provider — a single-tenant host — is a public-cloud
feature, not a private cloud, because the surrounding infrastructure is still offered for
open use.

**What the exam may test** Whether a described environment is a private cloud, a public
cloud, or not a cloud at all, when the scenario deliberately varies ownership, location and
the presence of the essential characteristics independently.

<a id="cmp-cloud.cloud-computing.private-cloud"></a>
#### Not to be confused with: Private cloud vs Public cloud
*compares: `cloud.cloud-computing.private-cloud`, `cloud.cloud-computing.public-cloud`*

| | Private cloud | Public cloud |
| --- | --- | --- |
| Provisioned for | Exclusive use by one organisation | Open use by the general public |
| Physical location | On or off premises — NIST allows both | The premises of the cloud provider |
| Who may own and operate it | The organisation, a third party, or both | A business, academic or government organisation |
| Who the tenants are | Internal consumers, such as business units | Any paying customer |
| Who carries capacity risk | The organisation — it sizes the estate | The provider — capacity appears unbounded |
| Usual motivation | Regulation, data residency, latency, control | Elasticity, speed, no capital expenditure |

The separating axis is exclusivity of use, not location or ownership: one organisation only
means private, open to anyone means public, and both may run on hardware someone else owns
in a building neither party occupies.

<a id="c-cloud.cloud-computing.hybrid-cloud"></a>
### Hybrid cloud
*id: `cloud.cloud-computing.hybrid-cloud` · depth 3 · importance 2 · LFS200: MENTIONED ONLY · sources: nist-sp-800-145*

**What it is** In NIST's wording, a composition of two or more distinct cloud infrastructures
— private, community or public — that remain unique entities but are bound together by
standardised or proprietary technology enabling data and application portability, with cloud
bursting for load balancing given as the example.

**Why it matters** Hybrid is the deployment model with the most demanding definition and the
loosest everyday usage. Two conditions must both hold: the components must each be clouds,
and they must be *bound together* so that data and applications can move between them. Any
scenario missing the binding is describing two separate estates, not a hybrid cloud.

**How it works** A typical hybrid arrangement keeps regulated or latency-sensitive workloads
in a private cloud and bursts overflow, batch or disaster-recovery capacity into a public
cloud, joined by a private network link, a common identity plane and a shared deployment
pipeline. That connective tissue — networking, identity, tooling — is what the definition
means by bound together, and it is also where the real engineering cost sits.

**Key terms** composition; distinct entities; portability; cloud bursting; connective
tissue.

**Traps** "We use a public cloud and we also have servers in our building, so we are hybrid"
fails the definition twice over if those servers are not themselves a cloud and there is no
portability between them. The industry uses "hybrid" loosely for exactly that arrangement,
so the exam-safe reading is NIST's stricter one. The other trap is the multi-cloud
confusion: two public providers side by side is not hybrid, because hybrid is about
combining *different deployment models*, not different vendors.

**What the exam may test** Deciding whether a described estate is genuinely hybrid, and
separating it from multi-cloud when the scenario names more than one provider.

<a id="cmp-cloud.cloud-computing.hybrid-cloud"></a>
#### Not to be confused with: Hybrid cloud vs Multi-cloud
*compares: `cloud.cloud-computing.hybrid-cloud`, `cloud.cloud-computing.multi-cloud`*

| | Hybrid cloud | Multi-cloud |
| --- | --- | --- |
| What is being mixed | Different deployment models — private with public | Different providers of the same model, usually public |
| A NIST deployment model | Yes, one of the four | No — an industry term, not in SP 800-145 |
| Binding required by the definition | Yes — data and application portability between the parts | No — the providers may be entirely independent |
| Typical motivation | Data residency, regulation, cloud bursting | Avoiding dependence on one vendor, best-of-breed services, negotiating leverage |
| Minimum example | One private cloud plus one public cloud, connected | Two public providers, connected or not |
| Main cost | Building and operating the connective layer | Duplicated expertise, tooling and operational processes |

The separating axis is what varies: hybrid varies the deployment model and demands the parts
be joined; multi-cloud varies the vendor and demands nothing about joining them. An estate
can be both at once, and neither implies the other.

<a id="c-cloud.cloud-computing.multi-cloud"></a>
### Multi-cloud
*id: `cloud.cloud-computing.multi-cloud` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** Deliberately using more than one public cloud provider. It is an industry
term, not one of NIST SP 800-145's four deployment models — those are private, community,
public and hybrid — and that absence is itself examinable.

**Why it matters** Multi-cloud is usually adopted to reduce dependence on a single vendor or
to reach a capability only one provider offers. Both motives are real, and both come with a
cost the exam expects you to name: every additional provider duplicates identity, networking,
monitoring, billing and staff expertise.

**How it works** In practice multi-cloud takes one of two shapes. Workloads may be
*partitioned* — this application here, that one there — which is straightforward but leaves
each workload dependent on its own provider. Or they may be made *portable*, running on a
common substrate such as containers with an orchestrator, which spreads risk but tends to
force a lowest-common-denominator architecture that gives up each provider's differentiated
managed services.

**Key terms** provider diversity; partitioned workloads; portable workloads;
lowest common denominator.

**Traps** Multi-cloud does not automatically deliver high availability. Running a workload on
two providers only survives a provider outage if it is actually deployed, tested and able to
fail over on both — an application partitioned across providers fails just as hard as a
single-provider one when its own provider goes down. The second trap is the hybrid confusion
in reverse: adding a second public provider does not make an estate hybrid.

**What the exam may test** Naming the trade-off honestly — reduced vendor dependence and
negotiating leverage against duplicated operational cost and often a weaker architecture —
rather than treating multi-cloud as an unqualified best practice.

*Not to be confused with [hybrid cloud](cloud-computing.md#cmp-cloud.cloud-computing.hybrid-cloud).*

#### Scenario

An insurer must keep policyholder records in-country under regulation but wants elastic
capacity for quarterly modelling runs. It builds a self-service, metered platform in its own
regional datacentre for the records — exclusive use by one organisation, so a private cloud
even though the hardware is its own — and connects it by a private link and a shared identity
plane to a public provider that absorbs the modelling burst. Because the two are bound
together and workloads move between them, this is genuinely hybrid, not merely two estates.
A year later the insurer adds a second public provider for a machine-learning service the
first does not offer. That addition is multi-cloud, and it does not change the hybrid
classification, add availability on its own, or reduce lock-in for the workloads that stay
where they are.

#### Knowledge check

1. Name NIST SP 800-145's four deployment models.
   Private cloud, community cloud, public cloud, hybrid cloud. Multi-cloud is not among
   them.
2. Must a private cloud be on-premises?
   No. NIST states it may be owned, managed and operated by the organisation or a third
   party, and may exist on or off premises. Exclusivity of use is the criterion.
3. What two conditions must hold before an estate counts as hybrid under NIST?
   Each part must itself be a cloud infrastructure, and the parts must be bound together by
   technology enabling data and application portability.
4. A company runs production on one public provider and analytics on another, with no link
   between them. Hybrid, multi-cloud, or both?
   Multi-cloud only. No private or community cloud is involved, and nothing binds the two.
5. Does "public cloud" describe the visibility of your data?
   No — it describes who may purchase the service. Tenant workloads remain logically
   isolated.

<a id="s-cloud-computing-virtualization"></a>
## Virtualization

<a id="c-cloud.cloud-computing.virtualization"></a>
### Virtualization
*id: `cloud.cloud-computing.virtualization` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: cncf-glossary-virtualization, vmware-hypervisor*

**What it is** Taking one physical computer and allowing it to run multiple isolated
operating systems, each with its own dedicated share of CPU, memory and network. Those
isolated operating systems are the virtual machines. The CNCF glossary describes cloud
computing as primarily powered by virtualization technology — a leased cloud "computer" is
usually a VM.

**Why it matters** Virtualization is the mechanism that makes resource pooling economically
possible: without it, a provider would need one physical server per customer workload. It is
also the layer whose ownership the shared responsibility model assigns to the provider, so
knowing where it sits tells you where the responsibility boundary is drawn.

**How it works** A hypervisor sits between the hardware and the guest operating systems,
presenting each guest with what looks like dedicated hardware and scheduling real CPU,
memory and I/O behind that illusion. Guests are unaware they share a machine. Because a VM is
software-defined, it can be created, destroyed, snapshotted, cloned and moved to another host
without touching the physical estate.

**Key terms** guest; host; isolation; software-defined computer; consolidation ratio.

**Traps** Virtualization is not cloud computing (see the comparison above) and it is not the
same thing as the hypervisor: virtualization is the technique, the hypervisor is the program
that implements it. It is also not containerisation — a container shares the host kernel
rather than running its own, so a technology question about "isolating workloads" has two
plausible answers that differ in exactly that respect.

**What the exam may test** Assigning a described capability — consolidating ten servers onto
one, live-migrating a workload, running Windows and Linux side by side on one host — to
virtualization specifically, rather than to cloud, containers, or the hypervisor product
name.

*Not to be confused with [cloud computing](cloud-computing.md#cmp-cloud.cloud-computing.cloud-computing).*
*Not to be confused with [hypervisor](cloud-computing.md#cmp-cloud.cloud-computing.hypervisor).*

<a id="cmp-cloud.cloud-computing.virtualization"></a>
#### Not to be confused with: Virtualization vs Containers
*compares: `cloud.cloud-computing.virtualization`, `devops.containers.container`*

| | Virtualization | Container |
| --- | --- | --- |
| What is duplicated per workload | A whole operating system, including its kernel | Nothing — the workload is a process on the host kernel |
| Isolation mechanism | The hypervisor, backed by CPU virtualization features | Kernel features constraining a process's resources and visibility |
| Guest OS choice | Any OS the hardware supports, including a different family | Must match the host kernel family |
| Start time | Seconds to minutes — a full boot | Milliseconds to seconds — a process start |
| Overhead per workload | A full OS image, memory and CPU for it | The application and its dependencies only |
| Strength of the boundary | Stronger — a compromised guest kernel is still inside its VM | Weaker — a host kernel flaw is shared by every container |

The separating axis is the kernel: virtualization gives each workload its own, containers
share one. Density, start time and isolation strength all follow from that single choice.

<a id="c-cloud.cloud-computing.hypervisor"></a>
### Hypervisor
*id: `cloud.cloud-computing.hypervisor` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: vmware-hypervisor, cncf-glossary-virtualization*

**What it is** The software layer that creates, runs and schedules virtual machines. Type 1,
also called native or bare-metal, runs directly on the host's hardware and takes the place of
a host operating system, scheduling VM resources straight to the hardware. Type 2, also
called hosted, runs on a conventional operating system as an application, and schedules VM
resources against that host OS, which in turn executes against the hardware.

**Why it matters** The type 1 / type 2 split is a named, memorisable distinction of exactly
the shape a multiple-choice question takes, and it carries a practical consequence: cloud
providers and enterprise datacentres run type 1 because the extra host OS layer of type 2
costs performance and adds a second thing that can crash.

**How it works** Both types present each guest with virtual CPU, memory, disk and network
devices, and multiplex real hardware behind them. The difference is what sits underneath. A
type 1 hypervisor *is* the lowest software layer; the classic examples are VMware vSphere/ESXi
and Microsoft Hyper-V. A type 2 hypervisor is an application on a general-purpose desktop OS;
VMware Workstation and Oracle VirtualBox are the standard examples. KVM is the case that
tests understanding rather than recall: it is a module inside the Linux kernel, which makes
the kernel itself the hypervisor, and vendors classify it as type 1 even though a full Linux
userland runs alongside it.

**Key terms** type 1 (bare-metal); type 2 (hosted); guest; host OS; KVM.

**Traps** Type 2 is not "the old kind" or "the insecure kind" — it is the developer-workstation
kind, chosen because it coexists with a normal desktop. The other trap is the
hypervisor/virtualization conflation: naming a product (ESXi, Hyper-V, KVM, VirtualBox) is
naming a hypervisor, while the capability those products provide is virtualization.

**What the exam may test** Classifying a named hypervisor as type 1 or type 2, and
explaining why production cloud infrastructure uses type 1 — no intervening host operating
system between the hypervisor and the hardware.

<a id="cmp-cloud.cloud-computing.hypervisor"></a>
#### Not to be confused with: Hypervisor vs Virtualization
*compares: `cloud.cloud-computing.hypervisor`, `cloud.cloud-computing.virtualization`*

| | Hypervisor | Virtualization |
| --- | --- | --- |
| What it names | The specific software layer that creates and runs VMs | The technique of partitioning one machine into many |
| Category | A program you can install and name a version of | A capability, not a product |
| Has types | Yes — type 1 bare-metal, type 2 hosted | No — types belong to the hypervisor, not the concept |
| Examples | ESXi, Hyper-V, KVM, VirtualBox | Server consolidation, live migration, snapshots |
| Fails how | The hypervisor crashes and takes its guests with it | Not applicable — a concept does not fail |

The separating axis is product versus technique: virtualization is what is being done, the
hypervisor is the thing doing it. Type 1 and type 2 classify hypervisors only.

<a id="c-cloud.cloud-computing.virtual-machine"></a>
### Virtual machine
*id: `cloud.cloud-computing.virtual-machine` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: cncf-glossary-virtualization, vmware-hypervisor*

**What it is** A computer and its operating system that is not bound to a particular piece of
hardware — a software-defined computer that looks and behaves like a real one while sharing
physical hardware with its neighbours. Each VM boots its own kernel and runs its own full
operating system.

**Why it matters** The VM is the unit the IaaS model sells and the unit the shared
responsibility model draws its line beneath: the provider owns the hypervisor and everything
below, the customer owns the guest OS and everything above. It is also the thing containers
are most often — and most wrongly — described as a lighter version of.

**How it works** The hypervisor allocates virtual CPU, memory, disk and network interfaces,
and the VM boots from a disk image exactly as physical hardware would: firmware, boot loader,
kernel, init system, userland. Because the whole machine is a file plus configuration, it can
be snapshotted, cloned, resized and live-migrated to another host with little or no downtime
— resilience a bare-metal server cannot offer.

**Key terms** guest operating system; disk image; snapshot; live migration; software-defined
computer.

**Traps** A VM is not "a container with more overhead". The overhead exists because the VM
provides something a container does not: its own kernel, and therefore the ability to run a
different operating system family from the host and a stronger isolation boundary. Nor is a
VM automatically more available than a physical machine — it inherits the availability of the
host it runs on unless the platform is configured to restart or migrate it elsewhere.

**What the exam may test** Choosing a VM over a container for a stated requirement — a
different OS kernel, a strict isolation or compliance boundary, a legacy application
expecting a full system — and recognising when the requirement does not justify it.

*Not to be confused with [container vs virtual machine](cloud-computing.md#cmp-cloud.cloud-computing.container-vs-virtual-machine).*

<a id="cmp-cloud.cloud-computing.virtual-machine"></a>
#### Not to be confused with: Virtual machine vs Container
*compares: `cloud.cloud-computing.virtual-machine`, `devops.containers.container`*

| | Virtual machine | Container |
| --- | --- | --- |
| What it is | A whole computer with its own operating system | A running process with resource and capability constraints |
| Kernel | Its own | The host's, shared with every other container |
| What is packaged | A disk image of a full system | A container image of the application and its dependencies |
| Boots | Yes — firmware, boot loader, kernel, init | No — it is started as a process |
| Can run a different OS family than the host | Yes | No |
| Typical lifetime | Long-lived, patched in place | Short-lived, replaced by a new image |

The separating axis is again the kernel: a VM brings its own and therefore boots; a container
borrows the host's and therefore merely starts.

<a id="c-cloud.cloud-computing.container-vs-virtual-machine"></a>
### Container vs virtual machine
*id: `cloud.cloud-computing.container-vs-virtual-machine` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: cncf-glossary-virtualization*

**What it is** The named choice between two isolation technologies, not a third technology.
A VM virtualizes hardware and runs its own kernel; a container is a process on the host
kernel whose resources and visibility the operating system constrains. Containers start
faster and pack denser; VMs isolate more strongly and can run a different OS family.

**Why it matters** This is one of the most heavily tested comparisons in the whole domain,
and the exam asks it as a selection problem: given a requirement, which one. Answering it
needs the mechanism, not the slogan — "containers are lightweight" does not tell you whether
a workload requiring a Windows kernel can run on a Linux host.

**How it works** The VM path costs a full guest OS per workload: its own kernel, its own
memory footprint, its own patching. The container path costs almost nothing per workload
because the operating system is already running — CNCF notes that containers share the same
operating system and machine resources, spreading that overhead and allowing many more
applications on one physical machine. The trade is the isolation boundary: because the kernel
is shared, CNCF is explicit that container processes can be considered less secure than the
alternatives, and administrators must constrain memory and CPU so one container cannot starve
the rest.

**Key terms** shared kernel; resource constraints; density; blast radius; image.

**Traps** The two are not mutually exclusive and the exam likes that: in every major cloud,
containers run inside provider-managed VMs, so "we use containers, therefore no VMs are
involved" is wrong. A second trap is inferring portability from containerisation — a Linux
container image still needs a Linux kernel and a matching CPU architecture, so it is portable
across hosts, not across kernel families. A third is treating "container" as automatically
meaning a particular orchestrator; orchestration is a separate layer.

**What the exam may test** Picking the right isolation unit for a stated constraint — strict
tenant separation or a foreign OS kernel points to VMs; fast start, high density and
identical dependency sets point to containers — and stating the isolation cost of the
container choice rather than presenting it as free.

<a id="cmp-cloud.cloud-computing.container-vs-virtual-machine"></a>
#### Not to be confused with: Container vs virtual machine vs Virtual machine
*compares: `cloud.cloud-computing.container-vs-virtual-machine`, `cloud.cloud-computing.virtual-machine`*

| | Container vs virtual machine | Virtual machine |
| --- | --- | --- |
| What it names | The selection decision between two isolation technologies | One of the two technologies being selected between |
| Category | A comparison, an axis | A concrete thing you can create, boot and destroy |
| Answers the question | "Which should I use, and why" | "What is this thing I am running" |
| Can be deployed | No — it is a decision, not an artifact | Yes |
| Where it appears in a question | A requirements-to-choice scenario | A definition or responsibility-boundary scenario |

The separating axis is category: one is the decision, the other is one of its two options —
the same relationship a comparison has to either term inside it.

#### Scenario

A platform team must place three workloads. The first is a vendor appliance shipped as a
Windows disk image; the Linux hosts cannot run it as a container, because a container shares
the host kernel and cannot supply a different OS family, so it becomes a VM. The second is a
stateless HTTP service deployed forty times a day; containers win on start time and density,
and they will run on provider-managed VMs regardless, so choosing containers does not remove
virtualization from the picture. The third is a workload processing another customer's
regulated data, where the team wants the strongest boundary available: a separate VM, because
a shared host kernel is a single flaw away from being a shared failure. Underneath all three
sits a type 1 hypervisor the provider operates and the team never sees — the layer that
converts one physical machine into the pool the essential characteristics describe.

#### Knowledge check

1. What is the one-sentence difference between a container and a virtual machine?
   A VM runs its own kernel and boots a full operating system; a container is a process on
   the host's kernel, constrained by the operating system.
2. What is the difference between virtualization and a hypervisor?
   Virtualization is the technique of partitioning one machine into many; the hypervisor is
   the software layer that performs it.
3. Classify VMware ESXi, Oracle VirtualBox and KVM as type 1 or type 2.
   ESXi is type 1; VirtualBox is type 2; KVM is classified type 1 because the Linux kernel
   itself becomes the hypervisor.
4. Can a Linux container image run on a Windows kernel without a virtual machine underneath?
   No. The container shares the host kernel, so a Linux image requires a Linux kernel — on a
   Windows host that means a Linux VM beneath it.
5. Why is a container's isolation boundary considered weaker than a VM's?
   Every container shares one kernel, so a kernel-level flaw has a blast radius covering all
   of them; a VM's own kernel keeps a compromise inside that VM.
6. "We moved to containers, so we no longer use virtual machines." Why is that usually wrong
   in a public cloud?
   Managed container platforms run containers on provider-operated virtual machines; the VMs
   are still there, just not the customer's to administer.

<a id="s-cloud-computing-operating-model"></a>
## Operating model

<a id="c-cloud.cloud-computing.shared-responsibility-model"></a>
### Shared responsibility model
*id: `cloud.cloud-computing.shared-responsibility-model` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-shared-responsibility-model*

**What it is** The division of security duties between provider and customer, usually
summarised as security *of* the cloud versus security *in* the cloud. AWS states its own side
as operating, managing and controlling everything from the host operating system and
virtualization layer down to the physical security of the facilities, while the customer
assumes management of the guest operating system — including updates and security patches —
other application software, and the configuration of the provider-supplied firewall.

**Why it matters** Candidates routinely over-estimate the provider's share, and the
over-estimate is worst exactly where the exam concentrates: IaaS. The model is also not
fixed — it slides as the service model rises, which is what makes it a discrimination
question rather than a recall one.

**How it works** The lower the service model, the more the customer owns. Under IaaS the
customer patches the guest OS, configures the firewall and encrypts their own data; under
PaaS the provider absorbs the OS and runtime; under SaaS almost everything operational moves
to the provider. What never moves, at any level, is the customer's own data, their identity
and access configuration, and who they grant permissions to. AWS also notes that
responsibilities vary by the specific services chosen, so the boundary is per-service, not
per-account.

**Key terms** security of the cloud; security in the cloud; guest OS patching; identity
configuration; per-service boundary.

<a id="c-cloud.cloud-computing.region-and-availability-zone"></a>
### Region and availability zone
*id: `cloud.cloud-computing.region-and-availability-zone` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-regions-and-azs, azure-availability-zones*

**What it is** Two nested units of a provider's global footprint. A region is a separate
geographic area, designed to be isolated from other regions; AWS states that resources are
tied to the region you specify and are not automatically replicated across regions. An
availability zone is one of multiple isolated locations inside a single region — Azure
describes zones as separated groups of datacentres within a region, each with independent
power, cooling and networking infrastructure, so an outage in one is survived by the rest.

**Why it matters** Spreading instances across availability zones is the basic availability
technique in every cloud, and the exam tests whether you know what each level protects
against. Zones address the failure of one datacentre; regions address the loss of a whole
geography, and also latency and data-residency requirements that zones do nothing for.

**How it works** You choose a region for legal, latency or cost reasons, then place resources
in two or more of its zones so that no single facility failure takes the service down. AWS
identifies zones by the region code plus a letter, such as `us-east-1a`. Traffic between
zones in one region is fast enough for synchronous replication; traffic between regions is
not, which is why cross-region designs are usually asynchronous, more expensive, and reserved
for disaster recovery or residency rather than routine redundancy.

**Key terms** region; availability zone; fault domain; multi-AZ; data residency.

<a id="c-cloud.cloud-computing.managed-services"></a>
### Managed services
*id: `cloud.cloud-computing.managed-services` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** Standard infrastructure components — relational and NoSQL databases, message
queues, caches, search indexes, load balancers — that the provider installs, patches, backs
up, monitors and scales, and that you consume through the component's normal interface. You
trade configuration control for a large reduction in operational work.

**Why it matters** The managed-versus-self-hosted decision is the everyday version of the
service-model question, and it is the main mechanism by which vendor lock-in accumulates. It
is also the boundary candidates most often mislabel: a managed database is not PaaS, because
nothing of yours is deployed onto it.

**How it works** The provider runs the component on infrastructure you never log into and
exposes it through its ordinary protocol — a database endpoint speaking the database's own
wire protocol, a queue speaking its API. What you keep is everything specific to your use:
schema design, indexes, queries, data, retention, access grants. What you lose is root: you
generally cannot install arbitrary extensions, patch on your own schedule, or hold a version
the provider has retired.

**Key terms** provider-operated component; normal interface; maintenance window; loss of
root; operational burden.

**Traps** "Managed" does not mean "no responsibility". A managed database still fails from a
missing index, an unbounded query, an exhausted connection pool or a permission granted too
widely — none of which the provider will fix. It also does not mean "never patched by
surprise": providers apply updates in maintenance windows, and a version the provider
deprecates forces an upgrade on their timetable, not yours.

**What the exam may test** Separating what the provider takes over (installation, patching,
backup mechanics, failover, capacity) from what stays with the customer (data model, query
efficiency, access control, retention policy), and distinguishing a managed service from PaaS
when a scenario blurs them.

<a id="cmp-cloud.cloud-computing.managed-services"></a>
#### Not to be confused with: Managed services vs PaaS
*compares: `cloud.cloud-computing.managed-services`, `cloud.cloud-computing.paas`*

| | Managed services | PaaS |
| --- | --- | --- |
| What runs on it | A standard component the provider chose and operates | Consumer-created or acquired application code |
| What you supply | Configuration, schema and data | An application artifact to deploy |
| NIST service model | Not defined as one — it is a consumption pattern | One of the three service models |
| Interface you use | The component's own protocol or API | A deployment pipeline and hosting configuration |
| What you lose | Root on the component, and version timing | Choice of operating system and unsupported runtimes |
| Example question shape | "Should we run our own database or use the provider's" | "Should we manage servers or just push code" |

The separating axis is whose code is running: PaaS runs an application you wrote, a managed
service runs a standard component the provider maintains. If nothing of yours is deployed
onto it, it is a managed service.

<a id="c-cloud.cloud-computing.cloud-control-planes"></a>
### Cloud control planes
*id: `cloud.cloud-computing.cloud-control-planes` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-cloudtrail*

**What it is** The four ways to drive the same platform: the web console, the CLI, the API,
and infrastructure as code. They are interfaces onto one control plane, not four different
platforms — anything one can do, the others can generally do too, because the console and the
CLI are themselves clients of the API.

**Why it matters** The real difference is reproducibility, and it is routinely misstated as
auditability. All four are audit-logged by the provider by default: AWS CloudTrail records
actions taken by a user, role or service — explicitly including actions taken in the AWS
Management Console as well as the CLI, SDKs and APIs — and its Event history is available
automatically when the account is created, covering the last 90 days of management events.
Azure retains Activity Log events for 90 days, and Google Cloud's Admin Activity audit logs
are always written and cannot be configured, excluded or disabled. Console work is therefore
recorded; what it lacks is an artifact you can review before it runs, re-run identically, or
diff against last week.

**How it works** The console is discoverable and good for inspection and one-off
investigation. The CLI and API are scriptable and automatable but imperative: a script says
what to do, not what should exist, so running it twice may not be safe. Infrastructure as
code adds the property the other three lack — a declarative statement of desired state, held
in version control, reviewable before it is applied, and comparable against reality so drift
can be detected and corrected.

**Key terms** control plane; audit log; reproducibility; declarative desired state; drift
detection.

<a id="c-cloud.cloud-computing.service-level-agreement"></a>
### Service level agreement
*id: `cloud.cloud-computing.service-level-agreement` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: google-sre-book-slos*

**What it is** The provider's contractual commitment about a service level, together with the
consequences of missing it. Google's SRE book defines an SLA as an explicit or implicit
contract with users that includes consequences of meeting or missing the objectives it
contains, and offers the decisive test: ask what happens if the target is not met — if there
is no explicit consequence, it is an objective, not an agreement.

**Why it matters** SLA questions look like arithmetic and are really about category. A
published availability percentage tells you what the provider owes you if they fall short; it
tells you nothing about what your own architecture will achieve on top of it, and the exam
exploits exactly that gap.

**How it works** An SLA states a measurable target over a defined window — most often
availability as a percentage of a month — plus exclusions (scheduled maintenance, customer
misconfiguration, force majeure) and a remedy. The remedy is characteristically a service
credit against future billing, proportional to the shortfall, not compensation for the
revenue the outage cost you. Availability percentages compose downward: a chain of dependent
services each promising 99.9% delivers less than 99.9% overall, because each one's downtime
adds.

**Key terms** availability percentage; measurement window; exclusions; service credit;
composite availability.

**Traps** A high provider SLA does not make your service highly available: run a single
instance in a single availability zone on a 99.99% platform and your architecture, not the
platform, sets your availability. The second trap is confusing the remedy with a refund of
losses — credits are typically capped at a fraction of the fees for the affected service, and
the burden of claiming is usually the customer's. The third is treating the SLA as a target
to design to; it is a floor the provider accepts liability below, and internal targets should
be set separately.

**What the exam may test** Distinguishing the contractual promise from the internal target
and the measurement behind it, and recognising that architecture — redundancy across zones,
automatic failover — is what produces availability, while the SLA only prices its absence.

<a id="cmp-cloud.cloud-computing.service-level-agreement"></a>
#### Not to be confused with: Service level agreement vs High availability vs SLA, SLO and SLI
*compares: `cloud.cloud-computing.service-level-agreement`, `cloud.performance-availability.high-availability`, `cloud.performance-availability.sla-slo-and-sli`*

| | Service level agreement | High availability | SLA, SLO and SLI |
| --- | --- | --- | --- |
| Category | A contract | A design property of a system | A three-term vocabulary for service levels |
| Who provides it | The provider, to you | Your architecture, to your users | Nobody — it is a distinction to hold |
| What it produces | A remedy when a target is missed | Survival of a single component failure | Clarity about which of the three a number is |
| Made real by | Legal terms and service credits | Redundancy, health checks, automatic failover | Measuring the indicator and comparing to the objective |
| Missing it means | A credit is owed | An outage the design was supposed to absorb | Ambiguity — usually an SLO being called an SLA |
| Under your control | No | Yes | The objective and indicator are; the agreement is not |

The separating axis is what kind of thing each is: the SLA is a promise you receive, high
availability is a property you build, and SLA/SLO/SLI is the vocabulary that keeps a promise,
a target and a measurement from being called the same word.

#### Scenario

An outage report says the payments service was unavailable for forty minutes and asks who is
accountable. Work the layers. The service ran as a single instance in one availability zone,
so the loss of that zone's datacentre took it down — a design gap, since the region offered
other zones with independent power, cooling and networking. The provider's 99.99% SLA was
still met for the month, so the remedy is nothing: the promise covers the platform, not the
customer's placement of a single instance on it. The database beneath was a managed service,
which is why nobody had to patch it, but the connection-pool exhaustion that made recovery
slow was a customer-side configuration the provider was never responsible for. Finally,
somebody asks who made the change that removed the second instance last month. The console
was used rather than the pipeline, so the change is in the audit log — the actor and the
timestamp are recorded — but there is no reviewable artifact to diff, which is the reason the
removal was never noticed.

#### Knowledge check

1. Where does the provider's responsibility end under IaaS, in the provider's own words?
   AWS states it controls from the host operating system and virtualization layer down to
   physical security; the customer manages the guest OS, its patches, application software
   and the provided firewall's configuration.
2. What responsibility never transfers to the provider, at any service model?
   The customer's own data, and their identity and access configuration — who may do what.
3. What does deploying across two availability zones protect against, and what does it not?
   It protects against the failure of one datacentre-scale location within a region; it does
   not protect against the loss of the whole region, nor address data residency or latency
   from a distant geography.
4. Are changes made in a cloud web console audit-logged?
   Yes. CloudTrail explicitly records console actions and its 90-day Event history is
   available automatically; Azure retains Activity Log events for 90 days; Google Cloud's
   Admin Activity audit logs are always written and cannot be disabled. What console work
   lacks is reproducibility, not an audit trail.
5. Which control plane gives declarative desired state and drift detection, and why do the
   CLI and API not?
   Infrastructure as code. The CLI and API are imperative — they state actions to take, not
   the state that should exist, so there is nothing to compare reality against.
6. A provider publishes a 99.99% availability SLA. Does using that provider make your
   application highly available?
   No. The SLA prices the provider's shortfall; availability at your layer comes from your
   own redundancy and failover design.
7. What is the usual remedy when an SLA is missed?
   A service credit against future billing, proportional to the shortfall — not
   compensation for business losses.

<a id="s-cloud-computing-storage"></a>
## Storage

<a id="c-cloud.cloud-computing.object-block-and-file-storage"></a>
### Object, block and file storage
*id: `cloud.cloud-computing.object-block-and-file-storage` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: azure-storage-introduction*

**What it is** Three storage shapes with different access models. Object storage holds whole
items addressed by a key in a flat namespace and reached over an HTTP API — Azure describes
its blob service as a massively scalable object store for text and binary data. Block storage
presents raw volumes that a virtual machine attaches and puts a filesystem on; Azure's managed
disks are block-level storage volumes for Azure VMs. File storage presents a shared network
filesystem that many clients mount at once, which is what Azure Files provides as managed file
shares.

**Why it matters** "Which storage type" is one of the most predictable scenario questions in
this domain, and it is decided by access pattern, not by capacity or price. Getting it wrong
in the real world is expensive and in the exam is avoidable, because each shape rules itself
out of specific uses on mechanism alone.

**How it works** Object storage stores each item with its key and metadata; writes replace
the whole object rather than editing bytes in place, and there are no real directories — what
looks like a folder is a prefix on the key. That is what lets it scale to enormous sizes and
serve content directly over HTTP, and also what makes it unsuitable for anything needing
random in-place writes. Block storage exposes fixed-size blocks with no notion of files at
all; the guest OS builds a filesystem on top and gets ordinary random read and write, which
is what boot disks and database data files require. A volume is normally attached to one
instance at a time, and sharing one between instances needs an explicit multi-attach feature
plus a cluster-aware filesystem. File storage puts the filesystem on the provider's side and
serves it over NFS or SMB, so many machines mount the same tree concurrently with familiar
permissions and locking.

**Key terms** key and flat namespace; block device; NFS and SMB; random in-place write;
concurrent mount.

**Traps** Object storage is not a filesystem: you cannot install an operating system on it,
put a database's live data files on it, or `mount` it and expect POSIX semantics — prefixes
are not directories and whole-object replacement is not a partial write. Block storage is not
shared storage by default, so "two servers need the same files" is a file-storage answer, not
a second block volume. And file storage is not a scaling substitute for object storage: it is
excellent for shared working data and poor for hundreds of millions of internet-served items.

**What the exam may test** Mapping a requirement to a shape: a VM boot disk or a transactional
database means block; a shared home directory or a legacy application expecting a mounted path
means file; backups, media, logs and static web content mean object.

*Not to be confused with [storage tiers and lifecycle policies](budgeting.md#cmp-cloud.budgeting.storage-tiers-and-lifecycle-policies).*

#### Scenario

A media company is sizing storage for one application. The web servers boot from disks and
run a transactional database, which needs random in-place writes and exclusive attachment —
block storage, one volume per instance. The editors share a working directory that a dozen
workstations mount simultaneously with ordinary permissions and file locking — file storage
over SMB, because a second block volume cannot be mounted read-write by twelve machines
without a cluster-aware filesystem. The finished videos, the nightly database backups and the
access logs are all write-once, read-many items served or retrieved by name, with no partial
updates and no mount required — object storage, which is also the only one of the three that
scales to that item count comfortably. The tempting mistake is to put the database files on
object storage because it is cheapest per gigabyte; whole-object replacement makes that
mechanically impossible, not merely slow.

#### Knowledge check

1. What is the one-sentence difference between object and block storage?
   Object storage holds whole items addressed by key in a flat namespace over an HTTP API;
   block storage exposes raw blocks that a guest OS formats and writes to at arbitrary
   offsets.
2. Why can a database's live data files not live on object storage?
   Objects are replaced as a whole rather than updated in place, so the random partial
   writes a database performs have no mechanism there.
3. Two application servers must read and write the same set of files at the same time. Which
   storage type, and why not the others?
   File storage, mounted over NFS or SMB. Object storage is not a mountable POSIX filesystem,
   and a block volume is normally attached to a single instance unless multi-attach plus a
   cluster-aware filesystem is used.
4. Is a "folder" in object storage a real directory?
   No. It is a prefix on the object key; the namespace is flat.
5. Which storage type backs a virtual machine's boot disk?
   Block storage.

<a id="s-cloud-computing-adoption"></a>
## Adoption

<a id="c-cloud.cloud-computing.cloud-migration-approaches"></a>
### Cloud migration approaches
*id: `cloud.cloud-computing.cloud-migration-approaches` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-migration-7rs*

**What it is** A spectrum of strategies for moving a workload, ordered by effort and by how
much cloud benefit the result actually gets. Rehost — lift and shift — moves the workload
essentially unchanged. Replatform makes targeted changes, such as swapping a self-managed
database for a managed one, without redesigning the application. Refactor or re-architect
rebuilds it around cloud-native patterns. Replace retires the application in favour of a
different product, usually SaaS. AWS's prescriptive guidance names seven strategies in total,
the *7 Rs*: retire, retain, rehost, relocate, repurchase, replatform, and refactor or
re-architect.

**Why it matters** The exam tests the trade-off, not the vocabulary: rehosting is fastest and
lowest-risk but carries the least benefit, because a VM moved unchanged still costs what a VM
costs and gains no elasticity. Refactoring earns the most and costs the most. Retire and
retain are legitimate outcomes — AWS lists both — and a portfolio assessment that discovers an
application nobody uses has saved more than any migration would.

**How it works** Each workload in a portfolio is assessed and assigned a strategy, and large
migrations deliberately favour the cheap end: AWS notes that common strategies for large
migrations are rehost, replatform, relocate and retire, and recommends against refactoring
during the migration itself because modernising while moving is the most complex option and
hard to manage across many applications. Modernisation is then done afterwards, once the
workload is running.

**Key terms** rehost (lift and shift); replatform; refactor; repurchase; retire; retain;
portfolio assessment.

<a id="c-cloud.cloud-computing.vendor-lock-in"></a>
### Vendor lock-in
*id: `cloud.cloud-computing.vendor-lock-in` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-migration-7rs*

**What it is** The accumulated cost of leaving a provider. It comes from depending on
provider-specific services and interfaces, from the volume of data that would have to be moved
and the egress charges for moving it, and from the operational knowledge and tooling a team
has built around one platform.

**Why it matters** Lock-in is a trade-off to price, not a defect to eliminate, and the exam
expects that framing. Provider-specific managed services are usually chosen because they
genuinely reduce work; the honest question is what an exit would cost and whether that cost is
proportionate to the benefit taken.

**How it works** The migration strategy chosen largely sets the lock-in incurred. Rehosting a
VM leaves it portable and gains little; refactoring around a provider's proprietary serverless,
queue and database services gains a great deal and is expensive to reverse. Portable layers —
containers, an orchestrator, standard SQL, open protocols, declarative infrastructure
definitions — reduce the technical component of lock-in, but they do not touch data gravity,
egress cost or the team's accumulated platform expertise. Multi-cloud reduces dependence on any
one provider while adding duplicated operational cost and pressure toward a
lowest-common-denominator design.

**Key terms** cost of exit; proprietary interface; data gravity; egress charges; portability
layer.

#### Scenario

A retailer plans a two-year migration of ninety applications. The portfolio assessment retires
eleven that nobody has opened in a year and retains four that a hardware dependency pins in
place — both legitimate outcomes, and between them the cheapest wins available. Sixty are
rehosted, because the goal is to vacate a datacentre lease on a fixed date and lift and shift
is the fastest, lowest-risk route; the team accepts that those workloads gain almost no
elasticity and plans modernisation afterward rather than refactoring mid-migration. The
remaining fifteen are replatformed onto managed databases, which removes patching work and
deepens lock-in at the same time — a trade the retailer accepts deliberately, having priced
the exit as a schema migration plus egress on the stored data rather than pretending it is
free. One customer-facing service is refactored around event-driven functions; it gains the
most and is the hardest to move again.

#### Knowledge check

1. Which migration strategy is fastest, and what does its speed cost you?
   Rehost, or lift and shift. It gains the least cloud benefit — a VM moved unchanged is
   still a VM, with no new elasticity and little cost saving.
2. Why does AWS advise against refactoring during a large migration?
   Refactoring modernises the application while moving it, which is the most complex strategy
   and hard to manage across many applications; rehost, relocate or replatform first, then
   modernise.
3. Are "retire" and "retain" migration strategies?
   Yes — both are among the 7 Rs, and retiring an unused application is often the highest-value
   outcome of a portfolio assessment.
4. Name three distinct sources of vendor lock-in.
   Provider-specific service interfaces, the data itself with its egress charges and sheer
   volume, and the team's accumulated platform expertise and tooling.
5. Does adopting containers eliminate lock-in?
   No. It reduces the technical portability barrier but leaves data gravity, egress cost and
   operational expertise untouched.
