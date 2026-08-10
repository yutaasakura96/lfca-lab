# Performance/Availability

Performance/Availability is the competency covering how a cloud service is kept fast and kept
running: what availability actually measures, how redundancy, failover and scaling keep a
service up under failure and under load, and how latency, caching and monitoring are reasoned
about once it is up. It sits in Cloud Computing Fundamentals, 18% of the exam — 2nd largest of
6 domains — and the competency was reworded in the 2025 update rather than added or removed.
LFS200 does not reach it at all: all 17 concepts are NOT COVERED — 0/17 (0%) are not NOT
COVERED — so every topic below is sourced independently of the course
(`research/lfs200-notes/00-course-map.md`). This is the file where the exam's favourite
near-synonyms live, and almost every question in it is a discrimination question: availability
against high availability, high availability against fault tolerance, failover against load
balancing, up against out, caching against a CDN.

<a id="s-performance-availability-availability"></a>
## Availability

<a id="c-cloud.performance-availability.availability"></a>
### Availability
*id: `cloud.performance-availability.availability` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: google-sre-book-slos*

**What it is** A measurement, not a design: the proportion of a stated time window during
which a service was usable, quoted as a percentage and conventionally spoken of in "nines."
It is a number you observe after the fact and compare against a target — the architecture that
produced it is a separate question entirely.

**Why it matters** Availability is the quantity every other concept in this section exists to
move. Redundancy, failover and high availability are the means; availability is the reported
outcome. A candidate who treats "99.99% availability" as the name of a design rather than the
result of one will mis-answer the whole family of questions that ask which of two systems
delivered a given figure.

**How it works** Pick a window (a month, a year), measure the time the service was usable
within it, and divide. Site Reliability Engineering treats availability as a service level
indicator — a quantitative measure of service level — and notes it is often defined not as
wall-clock uptime but as the fraction of well-formed requests that succeed. Because the
industry quotes it in nines, the arithmetic worth having memorised is the downtime each nine
permits:

| Availability | Downtime per year | Downtime per 30-day month |
| --- | --- | --- |
| 99% ("two nines") | about 3.65 days | about 7.2 hours |
| 99.9% ("three nines") | about 8.76 hours | about 43.2 minutes |
| 99.95% | about 4.38 hours | about 21.6 minutes |
| 99.99% ("four nines") | about 52.6 minutes | about 4.3 minutes |
| 99.999% ("five nines") | about 5.26 minutes | about 26 seconds |

**Key terms** nines; measurement window; uptime versus yield; service level indicator.

**Traps** Each extra nine divides the permitted downtime by ten, not by some smaller
increment — the step from 99.9% to 99.99% is the difference between most of a working day and
under an hour per year, which is why the cost curve is so steep. A percentage quoted with no
window attached is meaningless: 99.9% measured monthly and 99.9% measured annually allow very
different single outages. And availability is not a synonym for high availability; it is the
metric that high availability is a technique for raising.

**What the exam may test** Converting a nines figure into real downtime in the direction the
question asks (a percentage to hours, or an observed outage duration back to the percentage it
breached), and separating the measured quantity from the design practices that raise it.

<a id="cmp-cloud.performance-availability.availability"></a>
#### Not to be confused with: Availability vs High availability
*compares: `cloud.performance-availability.availability`, `cloud.performance-availability.high-availability`*

| | Availability | High availability |
| --- | --- | --- |
| What it names | A measured quantity | A design approach |
| Expressed as | A percentage over a stated window | An architecture: redundancy plus automatic failover, no single point of failure |
| Established by | Observing the service | Building the service a particular way |
| Can exist without the other | Yes — a single unredundant server has a measurable availability figure, sometimes a flattering one | Yes — an HA design can still miss its target after a bad month |
| What a question about it looks like | "How much downtime does this figure allow?" | "Which change removes the single point of failure?" |

Availability is measured; high availability is designed. A number cannot be an architecture,
and that is the whole distinction.

<a id="c-cloud.performance-availability.high-availability"></a>
### High availability
*id: `cloud.performance-availability.high-availability` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-reliability-pillar*

**What it is** Designing a system so that no single component failure takes the service
down — redundant components, spread across independent failure domains, with failure detected
and worked around automatically. A brief interruption while the switch happens is accepted;
what is not accepted is a failure that requires a human to notice it.

**Why it matters** High availability is the default answer to "how do we improve uptime," and
the exam's distractors are the neighbouring terms: availability (the metric it moves),
redundancy (one of its two ingredients), failover (the other), and fault tolerance (a stricter
version of the same goal). Each is a real, separate concept, and the question wording usually
tells you which is being asked for.

**How it works** Two ingredients, both required. First, redundancy: more than one instance of
every component on the critical path, placed so that one failure cannot take out both — separate
hosts, separate racks, separate availability zones. Second, automatic failover: health checks
that detect a failure and a mechanism that redirects work to the surviving component without
human action. Redundancy alone gives you a spare that nobody switches to; automatic failover
with nothing to fail over to gives you nothing at all.

**Key terms** single point of failure; failure domain; redundancy; automatic failover.

**Traps** High availability is not fault tolerance: an HA design tolerates a short
interruption while detection and failover run, and users of a genuinely fault-tolerant system
see no interruption at all. It is also not disaster recovery: high availability is about
surviving component failure inside the running system, while disaster recovery is about
restoring service after a large-scale loss and is measured in recovery objectives, not nines.
And it is not availability — HA is what you build, availability is what you then measure.

**What the exam may test** Given a described outcome ("the node failed and users saw a
20-second error window before requests resumed"), classifying the system as highly available
rather than fault tolerant, and identifying which missing ingredient — redundancy or automatic
failover — a described design still needs.

*Not to be confused with [service level agreement](cloud-computing.md#cmp-cloud.cloud-computing.service-level-agreement).*
*Not to be confused with [availability](performance-availability.md#cmp-cloud.performance-availability.availability).*
*Not to be confused with [fault tolerance](performance-availability.md#cmp-cloud.performance-availability.fault-tolerance).*

<a id="c-cloud.performance-availability.fault-tolerance"></a>
### Fault tolerance
*id: `cloud.performance-availability.fault-tolerance` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-reliability-pillar*

**What it is** Continuing to operate correctly through a failure with no interruption at
all — the failure is absorbed rather than detected and recovered from. It is a strictly
stronger property than high availability, and correspondingly more expensive.

**Why it matters** The pair "highly available" and "fault tolerant" is the single most
reliably examined near-synonym in this competency, and the discriminator is narrow: whether
the user experiences anything at the moment of failure. Scenarios are written to supply
exactly that detail and then ask for the label.

**How it works** Rather than keeping a standby idle until a health check fails, a
fault-tolerant design runs redundant components concurrently and has each doing, or ready to
do, the work at the moment the fault occurs — mirrored components, replicated writes,
redundant power and network paths, quorum-based systems that continue with a member missing.
There is no detection interval and no switching gap, because nothing has to be switched.

**Key terms** no-interruption operation; concurrent redundancy; quorum; designed fault class.

**Traps** Fault tolerance does not mean "cannot fail." It means a defined class of faults is
survivable without interruption; faults outside that class — a correlated failure that takes
every replica at once, the loss of an entire region, a software defect replicated to all
copies — still bring the service down. Treating "fault tolerant" as "100% available" is the
error the exam is looking for, and it pairs with the fact that 100% availability is not an
achievable target for any real service.

**What the exam may test** Choosing between "fault tolerant" and "highly available" for a
described failure event, using the presence or absence of a user-visible interruption as the
deciding evidence, and rejecting the claim that a fault-tolerant system has no failure modes.

<a id="cmp-cloud.performance-availability.fault-tolerance"></a>
#### Not to be confused with: Fault tolerance vs High availability
*compares: `cloud.performance-availability.fault-tolerance`, `cloud.performance-availability.high-availability`*

| | Fault tolerance | High availability |
| --- | --- | --- |
| Interruption when a component fails | None — the fault is absorbed | Brief — detection plus failover takes time |
| Redundant capacity in normal operation | Running concurrently, carrying or shadowing the work | May sit idle as a standby |
| Mechanism | No switch is needed; the survivors continue | Health check detects, then work is redirected |
| Relative cost | Higher — redundant capacity is paid for and used continuously | Lower — a standby can be smaller, cheaper, or shared |
| What the user notices | Nothing | A short error window, a reconnect, or a slow request |

The separating axis is the interruption: fault tolerance means zero, high availability means
short. Every other row follows from paying for zero rather than short.

<a id="c-cloud.performance-availability.redundancy"></a>
### Redundancy
*id: `cloud.performance-availability.redundancy` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-reliability-pillar*

**What it is** Duplicate components standing ready so that one failure is survivable. It is an
ingredient, not an outcome: redundancy with no mechanism to use it is a spare part, not
availability, and a candidate who equates "we have two of everything" with "we are highly
available" has skipped the failover half of the design.

**Why it matters** Redundancy is the direct answer to a single point of failure — any
component whose loss stops the whole service. Identifying that component is the first move in
almost every availability scenario, and the second is noticing whether anything is positioned
to take over from it.

**How it works** Components are duplicated and, critically, placed in independent failure
domains, so that the event which kills one cannot kill the other — different hosts, racks,
power feeds, or availability zones. Redundant units are deployed either active-active, with
every copy serving traffic and absorbing the survivors' share on a loss, or active-passive,
with a standby idle until promoted. N+1 describes provisioning one more unit than the load
requires, so the loss of any single unit still leaves enough capacity.

**Key terms** single point of failure; failure domain; active-active; active-passive; N+1.

<a id="c-cloud.performance-availability.failover"></a>
### Failover
*id: `cloud.performance-availability.failover` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-reliability-pillar, aws-route53*

**What it is** The automatic transfer of work to a healthy component when one fails — the
mechanism that turns idle redundancy into sustained availability. It is an exception path:
nothing about it runs in normal operation except the health checking that watches for the
moment it is needed.

**Why it matters** Failover is where the interruption in "highly available" comes from. Its
detection interval, its failure threshold, and how quickly the redirection propagates are
exactly what determine whether an outage lasts two seconds or two minutes, which is why the
exam pairs it with both high availability and load balancing.

**How it works** A health check probes the active component on an interval; after a
configured number of consecutive failures it is declared unhealthy, and the traffic path is
changed — a DNS record is switched to the standby's address, a virtual IP is moved, or a
cluster manager promotes a replica to primary. DNS-based failover is the common cloud form:
health checks are attached to records and a failover routing policy sends traffic to the
secondary when the primary's check fails. Failback is the return to the original component
once it is healthy again, and it is a separate decision, often deliberately manual.

**Key terms** health check; failure threshold; active-passive; DNS TTL; failback.

**Traps** Failover is never instantaneous, and the delay is the sum of several configured
values, not one: probe interval times failure threshold, plus the time for the redirection to
take effect. With DNS-based failover, cached records mean clients keep using the old address
until the TTL expires, so a long TTL can dominate the outage even when detection was fast.
Failover is also not load balancing — see the comparison below — and a transfer that a human
has to trigger is a manual recovery procedure, not failover in the sense used here.

**What the exam may test** Identifying failover as the missing piece in a design that has
redundancy but no automatic switch, and recognising DNS TTL as the cause when a described
failover "worked" but clients kept hitting the dead endpoint.

<a id="cmp-cloud.performance-availability.failover"></a>
#### Not to be confused with: Failover vs Load balancing
*compares: `cloud.performance-availability.failover`, `cloud.performance-availability.load-balancing`*

| | Failover | Load balancing |
| --- | --- | --- |
| When it acts | Only when a component fails | On every request, continuously |
| What moves | The whole workload, to a standby | Each individual request, across all healthy backends |
| Standby capacity in normal operation | Idle or serving something else | There is none — all backends are in use |
| Primary problem it solves | Component failure | Distributing load; failure handling is a by-product of health checks |
| Effect of removing it | Redundancy becomes an unused spare | Capacity is stranded on one backend and horizontal scaling buys nothing |

Failover is the exception path, load balancing is the normal path. They overlap only because a
load balancer's health checks also stop sending traffic to a dead backend — but that removes
one member from a working pool, whereas failover switches the service as a whole onto a
standby.

#### Scenario

An order service runs on one application server and one database, with a 99.9% monthly
availability target — about 43.2 minutes of permitted downtime over a 30-day month. The database host dies at
02:00 and someone restores it by hand at 03:10, blowing the month's budget in one event. Work
the fix through the right terms: the database was a single point of failure, so add
redundancy — a replica in a different availability zone. That alone changes nothing, because
nobody is watching; add automatic failover, so a health check promotes the replica without a
human. That makes the system highly available, not fault tolerant: the next failure will still
show users a short error window while detection and promotion run. Separately, the application
tier is a different problem — it is not failing, it is saturating at peak — and the answer
there is a load balancer across several application servers, which acts on every request
rather than only on failure.

#### Knowledge check

1. A service reports 99.99% availability for the year. How much downtime does that permit, and
   how much would 99.9% have permitted?
   About 52.6 minutes at 99.99%; about 8.76 hours at 99.9% — each nine divides the allowance by
   ten.
2. What is the one-sentence difference between availability and high availability?
   Availability is a measured percentage over a window; high availability is a design approach
   — redundancy plus automatic failover — intended to raise it.
3. Users saw a 20-second window of errors while a failed node was replaced automatically. Is
   that system fault tolerant?
   No — that is high availability. Fault tolerance means no user-visible interruption at all.
4. A team says "we have two of everything, so we are highly available." What have they not yet
   established?
   Automatic failover. Redundancy without a mechanism to detect failure and redirect work is a
   spare, not availability.
5. A DNS-based failover promoted the standby within 30 seconds, but clients kept hitting the
   dead address for several minutes. What is the likely cause?
   Cached DNS records — the record's TTL kept resolvers returning the old address after the
   switch.

<a id="s-performance-availability-scaling"></a>
## Scaling

<a id="c-cloud.performance-availability.scalability-vs-elasticity"></a>
### Scalability vs elasticity
*id: `cloud.performance-availability.scalability-vs-elasticity` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145, aws-ec2-auto-scaling*

**What it is** Two properties that are routinely used as synonyms and are not. Scalability is
the capability to grow to meet demand — the system can be given more resources and will make
use of them. Elasticity is doing that automatically and in both directions, so capacity tracks
demand as it changes and is released again when it falls. Elasticity implies scalability; the
reverse does not hold, and that asymmetry is the exam's question.

**Why it matters** A system can be perfectly scalable and not elastic at all: adding four more
servers works, but a person has to decide and do it. Elasticity is the property NIST names as
one of cloud computing's five essential characteristics — rapid elasticity, capabilities
provisioned and released, in some cases automatically, to scale rapidly outward and inward
commensurate with demand — and it is much of what distinguishes cloud from a rack of servers
you happen to own.

**How it works** Scalability is a design property of the workload and its architecture: can
the work be spread over more resources, or the resource made bigger, without redesign?
Elasticity adds two things on top — automation, so no human is in the loop, and
bidirectionality, so capacity is removed again when demand drops. The removal half is where
the cost saving lives, and it is the half candidates forget: a system that automatically grows
under load and never shrinks is not elastic, it is expensive.

**Key terms** scale out; scale in; rapid elasticity; on-demand provisioning; bidirectional.

<a id="c-cloud.performance-availability.vertical-scaling"></a>
### Vertical scaling
*id: `cloud.performance-availability.vertical-scaling` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-ec2-auto-scaling*

**What it is** Making one machine bigger — more vCPUs, more memory, faster storage — usually
by moving the instance to a larger instance type. This is what "scaling up" names, and the
word "up" is the tell.

**Why it matters** It is the simplest capacity move available and needs no application change,
which is why it is the correct answer for workloads that genuinely cannot be split: a
single-writer relational database's write path, software licensed per node, or anything with
state pinned to one process. The exam asks for it in exactly those cases and asks for
horizontal scaling everywhere else.

**How it works** The instance is stopped, its type changed to one with more resources, and
started again — so the move typically costs a restart and therefore a maintenance window. In
exchange, nothing above the machine has to change: no load balancer, no session handling, no
distribution of work.

**Key terms** scaling up; instance type; maintenance window; hard ceiling.

**Traps** Two limits, and both are examined. First, capacity: there is a largest machine the
provider offers, and once you are on it vertical scaling is finished — the ceiling is hard,
where horizontal scaling's is effectively not. Second, and more often missed: vertical scaling
does nothing for availability. A bigger single machine is still a single machine and still a
single point of failure, so a scenario asking for both more capacity and fewer outages is not
answered by resizing.

**What the exam may test** Matching "scale up" to vertical and "scale out" to horizontal
without hesitation, and recognising that a resize buys capacity but neither removes the single
point of failure nor avoids a restart.

*Not to be confused with [horizontal scaling](performance-availability.md#cmp-cloud.performance-availability.horizontal-scaling).*

<a id="c-cloud.performance-availability.horizontal-scaling"></a>
### Horizontal scaling
*id: `cloud.performance-availability.horizontal-scaling` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-ec2-auto-scaling*

**What it is** Adding more machines rather than bigger ones — "scaling out." Capacity becomes
effectively unbounded, and because the work is now spread over many units, losing one stops
being fatal. It carries two preconditions: the workload must be distributable, and something
must sit in front to distribute it.

**Why it matters** This is the cloud's default scaling direction and the one auto-scaling
automates. It is also the only one of the two that improves availability as a side effect,
which is why "add capacity and remove the single point of failure" resolves here rather than
to a resize.

**How it works** Identical instances are placed behind a load balancer, which spreads incoming
requests across them; adding an instance adds throughput, removing one removes it, and no
individual instance is special. That last property is what makes the workload distributable,
and it depends on the application keeping no client-specific state locally — session data,
uploaded files, in-memory caches of user context all have to move somewhere shared before an
arbitrary instance can serve an arbitrary request.

**Key terms** scaling out; instance pool; distributable workload; shared-nothing.

**Traps** Horizontal scaling only helps work that can actually be divided. Putting more
instances behind a load balancer does nothing for a single-threaded batch job, and nothing for
the write path of a database that accepts writes on one node — the extra instances sit idle
while the real constraint is untouched. Nor does horizontal scaling by itself make a system
elastic: adding instances by hand is scaling out, and it becomes elasticity only when
something adds and removes them automatically.

**What the exam may test** Choosing scale-out over scale-up when the scenario also mentions
resilience or an unbounded growth curve, and spotting the case where scale-out is the wrong
answer because the bottleneck is not divisible.

<a id="cmp-cloud.performance-availability.horizontal-scaling"></a>
#### Not to be confused with: Horizontal scaling vs Stateless design vs Vertical scaling
*compares: `cloud.performance-availability.horizontal-scaling`, `cloud.performance-availability.stateless-design`, `cloud.performance-availability.vertical-scaling`*

| | Horizontal scaling | Stateless design | Vertical scaling |
| --- | --- | --- | --- |
| Category | A capacity move | An application property | A capacity move |
| Also called | Scaling out | Shared-nothing | Scaling up |
| Upper bound | Effectively unbounded | Not a capacity concept | The largest instance type offered |
| Interruption to apply | None — new instances join the pool | Not applicable; it is a design choice made in the code | Usually a restart |
| Effect on single point of failure | Removes it — losing one instance of many is survivable | Enables the removal, by making instances interchangeable | None — one larger machine is still one machine |
| Depends on the others | Needs stateless design (or externalised state) to be practical | Independent of both | Works regardless of statefulness |

Two of these three are capacity moves and one is not. Vertical and horizontal are opposite
answers to "how do we get more"; stateless design is the application property that decides
whether the horizontal answer is available at all.

<a id="c-cloud.performance-availability.auto-scaling"></a>
### Auto-scaling
*id: `cloud.performance-availability.auto-scaling` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-ec2-auto-scaling*

**What it is** Adding and removing instances automatically against a metric or a schedule. It
is the mechanism that converts a merely scalable system into an elastic one — the automation
and the "in both directions" that elasticity requires are precisely what auto-scaling supplies.

**Why it matters** Auto-scaling is also, incidentally, an availability mechanism: a group
configured with a desired capacity monitors the health of its members and replaces terminated
or impaired instances to hold that number, so an instance failure is repaired without anyone
being paged.

**How it works** Instances are grouped and the group is given a minimum it may never fall
below, a maximum it may never exceed, and a desired capacity it is held at. Policies then move
the desired capacity within those bounds: dynamic scaling reacts to an observed metric such as
average CPU utilisation or requests per instance, scheduled scaling changes capacity at known
times against the clock, and predictive scaling acts on a forecast of expected load. The
minimum and maximum are guardrails, not targets — the maximum is what stops a runaway metric
from launching capacity without limit.

**Key terms** scaling group; minimum, desired and maximum capacity; dynamic scaling; scheduled
scaling; health-based replacement.

<a id="c-cloud.performance-availability.load-balancing"></a>
### Load balancing
*id: `cloud.performance-availability.load-balancing` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-elastic-load-balancing*

**What it is** Distributing incoming requests across multiple backends while monitoring the
health of the registered backends and routing traffic only to the healthy ones. It runs on
every request in normal operation, which is what separates it from failover.

**Why it matters** A load balancer is the component that makes horizontal scaling usable:
without something in front spreading requests, extra instances receive nothing. It is
simultaneously the thing that lets a backend be removed — for failure, for a deployment, for
scale-in — without clients noticing.

**How it works** Clients address the load balancer rather than any backend. It selects a
backend per request or per connection by an algorithm — round robin, least outstanding
requests, or a hash — and forwards the request. In parallel it probes each registered backend
on an interval; a backend that fails its check stays registered but stops receiving traffic
until it passes again. Balancers operate either at the transport layer, forwarding connections
without inspecting them, or at the application layer, where they can route on hostname, path,
or header.

**Key terms** backend pool; health check; round robin; sticky sessions; layer 4 versus layer 7.

**Traps** The load balancer is itself on the critical path, so an unredundant one reintroduces
exactly the single point of failure the backend pool just removed. Sticky sessions — pinning a
client to one backend — are the standard workaround for an application that is not stateless,
and they partly defeat the point: the pinned client's session dies with its backend, and load
distributes unevenly. And health-check behaviour is not failover: removing one member from a
working pool is not the same event as switching the service onto a standby.

**What the exam may test** Distinguishing continuous distribution from failure-triggered
redirection in a described scenario, and recognising sticky sessions as evidence that an
application is holding local state.

*Not to be confused with [failover](performance-availability.md#cmp-cloud.performance-availability.failover).*

<a id="c-cloud.performance-availability.stateless-design"></a>
### Stateless design
*id: `cloud.performance-availability.stateless-design` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-reliability-pillar*

**What it is** Keeping no client-specific state on the server between requests, so that any
instance can serve any request. Everything the server needs to handle a request arrives with
the request or is fetched from shared storage — it is never assumed to be sitting in this
particular process's memory or on this particular disk.

**Why it matters** This is the precondition for easy horizontal scaling, and for everything
built on it: auto-scaling can terminate an instance mid-shift, a load balancer can route a
returning user to a different backend, and a failed instance can be replaced, all without
losing anyone's session. Where the property is absent, each of those operations becomes a
user-visible fault.

**How it works** State is externalised rather than eliminated. Session data moves to a shared
cache or database, or is carried by the client in a signed token; uploaded files move to object
storage instead of a local disk; anything cached locally is treated as disposable and
rebuildable. What remains on the instance is code and configuration, which is identical
everywhere, so instances become interchangeable.

**Key terms** externalised state; shared session store; token-based session; interchangeable
instances.

**Traps** "Stateless" describes where the state lives, not whether the system has any. A
stateless application still has a database — the point is that the state is not pinned to one
server, so no request depends on reaching the same one twice. The visible sign that a design is
not stateless is the presence of sticky sessions, which exist precisely to route a client back
to the instance holding its state.

**What the exam may test** Identifying statelessness as the property that makes horizontal
scaling and automatic instance replacement safe, and rejecting the reading that a stateless
system stores no data at all.

*Not to be confused with [horizontal scaling](performance-availability.md#cmp-cloud.performance-availability.horizontal-scaling).*

#### Scenario

A retail site is slow every weekday at 09:00 and idle overnight, and the operator's current fix
is to move the web server to a larger instance type each quarter. Diagnose the design. The
resize is vertical scaling: it needs a restart, it stops at the largest type offered, and it
leaves the site on one machine, so the single point of failure is untouched. The right move is
horizontal — several identical web instances behind a load balancer distributing every request
across the healthy ones. That only works if any instance can serve any user, so sessions must
come off local disk into a shared store first; the sticky sessions currently configured are the
evidence that they have not. With that done, an auto-scaling group with a minimum, a maximum
and a schedule adds instances before the morning peak and removes them at night — the removal
is what makes the system elastic rather than merely scalable, and it is where the cost saving
appears.

#### Knowledge check

1. What is the one-sentence difference between scalability and elasticity?
   Scalability is the capability to grow to meet demand; elasticity is doing it automatically
   and in both directions, so capacity is released again when demand falls.
2. Which scaling direction is "scaling out," and which one has a hard ceiling?
   Scaling out is horizontal; vertical scaling has the hard ceiling — the largest instance type
   available.
3. A team doubles the instance size of a single server. What have they improved, and what have
   they not?
   Capacity, up to the next ceiling. Not availability — one larger machine is still a single
   point of failure — and the change needed a restart.
4. Why can a load balancer plus more instances still fail to help an application that stores
   sessions on local disk?
   Because a returning request routed to a different instance cannot find its session; that
   application is not stateless, and sticky sessions are the workaround that admits it.
5. A load balancer stops sending traffic to a backend that failed its health check. Is that
   failover?
   No — that removes one member from a working pool. Failover switches the whole service onto a
   standby when the active component fails.
6. An auto-scaling group has minimum 2, desired 4, maximum 10, and one instance is terminated.
   What happens, and why?
   A replacement is launched: the group holds desired capacity by monitoring member health and
   replacing terminated or impaired instances.

<a id="s-performance-availability-performance"></a>
## Performance

<a id="c-cloud.performance-availability.latency-and-throughput"></a>
### Latency and throughput
*id: `cloud.performance-availability.latency-and-throughput` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-pillars*

**What it is** Two different performance questions with two different units. Latency is the
delay for one operation, measured in milliseconds — how long a single user waits. Throughput is
the volume completed per unit time, measured in requests per second or bytes per second — how
much the system gets through in aggregate. Neither is derivable from the other, and a system
can be excellent at one while being poor at the other.

**Why it matters** Optimising one can actively worsen the other, which is the point the exam
tests. Batching many small operations into one large one raises throughput and raises the
latency of every item that now waits for the batch to fill. Running a system at very high
utilisation maximises throughput and lengthens queues, so latency climbs steeply just as
throughput peaks. "Make it faster" is therefore an ambiguous instruction until someone says
which of the two is meant.

**How it works** Latency is reported as a distribution, not a single number: an average hides
the slow tail, so it is quoted at percentiles — p95 or p99 — because the worst few percent of
requests are what users complain about. Throughput is bounded by the tightest resource on the
path, which is why it is meaningless to discuss without knowing where the bottleneck is.
Throughput is also distinct from bandwidth: bandwidth is the capacity of the link, throughput
is what the system actually achieves over it.

**Key terms** p95 and p99 latency; tail latency; batching; queueing; bandwidth versus
throughput.

<a id="c-cloud.performance-availability.caching"></a>
### Caching
*id: `cloud.performance-availability.caching` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-cloudfront*

**What it is** Storing a computed or fetched result closer to its consumer so that a later
request for the same thing is served without redoing the work. It cuts latency for the reader
and load for the origin, and it pays for both with the possibility of serving something stale.

**Why it matters** Caching is the general technique behind several concepts that look like
separate topics — a CDN, a browser cache, an in-memory session store, a database query
cache — and the exam expects the general form to be recognised in each of its specific
deployments.

**How it works** A cached entry is a key, a value, and an expiry. On a request the cache is
consulted first: a hit returns the stored value immediately, a miss does the real work and
stores the result before returning it. Entries leave either when their time-to-live expires,
when they are explicitly invalidated, or when the cache is full and an eviction policy discards
the least useful. Because the copy is not authoritative, correctness depends entirely on how
long stale data can be tolerated.

**Key terms** hit and miss; time-to-live; eviction; invalidation; origin.

**Traps** The cost of caching is staleness, and it is the trade the exam asks you to name. A
cache also hides an origin problem rather than fixing it: on a cold start, after an
invalidation, or when requests carry unique query strings that defeat the key, the full load
arrives at the origin, which must still be able to survive it. And a cache is not a database —
it is non-authoritative and its entries can be evicted at any time, so nothing may be stored
only there.

**What the exam may test** Naming staleness as the trade-off, recognising a CDN as one
deployment of caching rather than an unrelated technology, and rejecting the claim that a cache
removes the need for a capable origin.

<a id="cmp-cloud.performance-availability.caching"></a>
#### Not to be confused with: Caching vs Content delivery network
*compares: `cloud.performance-availability.caching`, `cloud.performance-availability.content-delivery-network`*

| | Caching | Content delivery network |
| --- | --- | --- |
| What it names | A general technique, usable at any layer | One specific deployment of that technique |
| Where the copy sits | Browser, application memory, a shared cache tier, the database | Edge locations distributed worldwide, near the viewer |
| What it primarily reduces | Repeated work, and therefore origin load | Repeated work *and* geographic distance |
| Typical content | Any expensive-to-produce result | Mostly static objects served over HTTP |
| Relationship | The superset | An instance of the superset |

Every CDN is a cache; not every cache is a CDN. The CDN's distinguishing property is
geographic distribution — cutting the distance the response travels, not just the work of
producing it.

<a id="c-cloud.performance-availability.content-delivery-network"></a>
### Content delivery network
*id: `cloud.performance-availability.content-delivery-network` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-cloudfront*

**What it is** A network of geographically distributed caches — edge locations — that serve
content to each user from a point close to them, while the origin server retains the original,
definitive copy. It is caching plus geography.

**Why it matters** The symptom a CDN answers is specific: users far from the origin are slow
while nearby users are fine. That is a distance problem, and no amount of extra origin capacity
fixes it, because the delay is in the round trips across the network rather than in the origin's
own processing.

**How it works** A distribution is configured naming the origin the content comes from — an
object store or an HTTP server. A viewer's request resolves to a nearby edge server, which
serves the object from its cache if it holds a fresh copy, and otherwise fetches it from the
origin, returns it, and keeps it for subsequent requests according to its time-to-live.
Invalidation removes an object from the edges before its TTL expires when content changes.

**Key terms** edge location; origin; distribution; time-to-live; invalidation.

**Traps** A CDN does not make the origin faster, and it does not help the first request to a
given edge, which must go to the origin anyway. It also does little for genuinely dynamic,
per-user responses that cannot be shared between viewers. Choosing a CDN for a scenario whose
symptom is a slow database query is the classic wrong answer: the query is slow everywhere,
including next door to the origin, which is exactly what a distance problem does not look like.

**What the exam may test** Matching the symptom "users in one distant region are slow" to a
CDN and the symptom "every user is slow, everywhere" to something else — origin capacity, a
query, or a bottleneck elsewhere on the path.

*Not to be confused with [caching](performance-availability.md#cmp-cloud.performance-availability.caching).*

<a id="c-cloud.performance-availability.monitoring-and-metrics"></a>
### Monitoring and metrics
*id: `cloud.performance-availability.monitoring-and-metrics` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-pillars*

**What it is** Collecting quantitative signals continuously — numbers sampled over time — and
alerting when they cross a threshold, so degradation is visible while it is still degradation
and not yet an outage. A metric is a number with a timestamp; monitoring is the practice built
around watching them.

**Why it matters** Every other concept in this file is unverifiable without it: an availability
figure is a measurement, an SLO is a target on a measurement, an auto-scaling policy fires on a
metric, and a bottleneck is found by comparing metrics across resources. Monitoring is what
supplies all of them.

**How it works** Instances and services emit metrics to a time-series store; dashboards render
them and alert rules evaluate them against thresholds over a window. The signals worth watching
first are latency, traffic, errors, and saturation — how full the constraining resource is.
Alerts are deliberately set below the failure point so that a human or an automatic policy acts
while there is still margin.

**Key terms** time series; threshold and alert; latency, traffic, errors and saturation;
percentile.

**Traps** Metrics are aggregates, and aggregation hides things: an average response time can
look healthy while the slowest few percent of users are timing out, which is why alerting is
done on percentiles rather than means. The larger trap is category: monitoring watches
questions someone already knew to ask, which is not the same as being able to ask new ones — see
the comparison below.

**What the exam may test** Distinguishing metrics from logs and traces, recognising that
monitoring presupposes knowing what to measure, and picking a percentile rather than an average
when the scenario describes a minority of very slow requests.

<a id="cmp-cloud.performance-availability.monitoring-and-metrics"></a>
#### Not to be confused with: Monitoring and metrics vs Observability
*compares: `cloud.performance-availability.monitoring-and-metrics`, `devops.devops-basics.observability`*

| | Monitoring and metrics | Observability |
| --- | --- | --- |
| What it names | A practice: collect numeric signals and alert on thresholds | A property of a system: whether its internal state can be inferred from its outputs |
| Signals involved | Metrics — numeric time series | Logs, metrics and traces together |
| Question it answers | Is a condition I predefined being breached? | Why is this unfamiliar thing happening? |
| Requires knowing the question in advance | Yes — a threshold must be chosen before the event | No — that is the point of it |
| Relationship | One of the inputs observability is built from | The broader property that monitoring feeds |

Monitoring answers questions you knew to ask; observability is the property that lets you
answer ones you did not. Metrics are a component of it, not a synonym for it.

<a id="c-cloud.performance-availability.bottleneck-identification"></a>
### Bottleneck identification
*id: `cloud.performance-availability.bottleneck-identification` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-well-architected-pillars*

**What it is** Locating the one constraining resource — CPU, memory, disk I/O, network, or an
external dependency — before attempting any optimisation. At any moment a system has exactly
one binding constraint, and effort spent anywhere else changes nothing measurable, which is why
the ordering matters more than the technique.

**Why it matters** Most wrong answers in a performance scenario are plausible fixes aimed at
the wrong resource: adding instances to a workload constrained by a single database writer,
adding a CDN to a slow query, adding memory to a disk-bound job. The exam supplies the metric
that identifies the real constraint and then offers several fixes, only one of which touches it.

**How it works** Measure each resource on the path under real load and look for the one that is
saturated — not merely busy. Utilisation says how much of a resource is in use; saturation says
how much work is queued waiting for it, and it is saturation that produces the latency users
feel. Correlate the saturated resource with the slow operation to confirm causation rather than
coincidence, then fix it — and expect the constraint to move: relieving one bottleneck promotes
whatever was second, so the measurement is repeated rather than done once.

**Key terms** constraint; utilisation versus saturation; queue depth; the moving bottleneck.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `cloud.performance-availability.sla-slo-and-sli` | SLA, SLO and SLI | The SLI is the measurement, the SLO is the internal target set on that measurement, and the SLA is the contract with users that attaches consequences to meeting or missing it. | Options present the three as interchangeable, and the discriminator is consequences: if missing the number costs nothing contractually it is an SLO, not an SLA — an SLO is a target on an SLI, never a measurement in its own right, and internal targets are normally set stricter than the contracted figure. [Not to be confused with service level agreement](cloud-computing.md#cmp-cloud.cloud-computing.service-level-agreement). |

#### Scenario

Support reports that checkout "feels slow," and average response time on the dashboard is
unchanged. Work it in order. First correct the metric: the average is hiding the tail, and p99
latency has tripled — a minority of requests are very slow, which is exactly what an average
conceals. Then find the constraint rather than guessing: CPU is at 40% on the application
instances, but the database's disk queue is deep and its saturation, not its utilisation, is
what tracks the p99 curve. That rules out the two attractive wrong fixes — more instances, and
a CDN, which would help only if the symptom were regional and the content static. Note also
what the numbers mean contractually: the internal target the team is now breaching is an SLO,
and it is deliberately stricter than the customer-facing SLA, so there is margin to act in
before any consequence is triggered. Fix the database, then measure again: the constraint will
have moved somewhere else.

#### Knowledge check

1. What is the one-sentence difference between latency and throughput, and give one change that
   improves one while worsening the other.
   Latency is delay per operation, throughput is volume per unit time; batching raises
   throughput while raising each item's latency.
2. Why is a CDN the wrong fix for "every user everywhere reports slow page loads"?
   A CDN removes geographic distance, so it helps a regional symptom. A universal slowdown
   points at the origin, a query, or another bottleneck on the path — none of which the edge
   caches change.
3. What is the one-sentence difference between monitoring and observability?
   Monitoring collects predefined signals and alerts on thresholds you chose in advance;
   observability is the property that lets you answer questions you had not anticipated, from
   logs, metrics and traces together.
4. A dashboard shows healthy average latency while users complain. What should be looked at
   instead, and why?
   A high percentile such as p95 or p99 — the average hides the slow tail that users actually
   experience.
5. What is the difference between an SLO and an SLA, in one test?
   Ask what happens if the number is missed: an SLA attaches an explicit consequence, an SLO
   does not.
6. Why is the first step in a performance problem to identify the bottleneck rather than to
   apply the obvious optimisation?
   Only the binding constraint affects the result; work spent on any other resource changes
   nothing, and after the constraint is relieved it moves, so measurement is repeated rather
   than done once.
