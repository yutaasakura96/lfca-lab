# Budgeting

Budgeting is the competency covering what cloud spending is actually made of and how it is
kept under control: the accounting shift from buying capacity to renting it, the purchasing
options a provider offers for the same unit of compute, and the practices — rightsizing,
tagging, budgets, tiering — that stop a consumption-billed invoice drifting upward unnoticed.
It sits in Cloud Computing Fundamentals, 18% of the exam — 2nd largest of 6 domains — and the
competency was reworded in the 2025 update rather than added or removed. LFS200 does not
reach it at all: 13 NOT COVERED — 0/13 (0%) are not NOT COVERED — so every topic below is
sourced independently of the course (`research/lfs200-notes/00-course-map.md`). No price
appears anywhere in this file, deliberately: published rates change constantly and the exam
does not ask for them. What it asks for is the model — which billing option fits which
workload, which cost is avoidable and which is structural, and which direction of data
transfer is the one that costs money.

<a id="s-budgeting-cost-models"></a>
## Cost models

<a id="c-cloud.budgeting.capex-vs-opex"></a>
### CapEx vs OpEx
*id: `cloud.budgeting.capex-vs-opex` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-rightsizing-whitepaper*

**What it is** Two accounting categories for the same computing capability. Capital
expenditure (CapEx) buys an asset outright — servers, storage arrays, a rack, a perpetual
licence — and the cost is capitalised and written down over the asset's useful life.
Operational expenditure (OpEx) pays for a service as it is consumed and is expensed in the
period it is incurred. Cloud does not make the hardware disappear; it moves the same
capability from the first column to the second, where somebody else owns the asset and you
rent its output.

**Why it matters** The examinable point is the consequence, not the label. The trade is
predictability against elasticity: a capital purchase is a known number decided once and hard
to reverse once the hardware is on the floor, while a consumption charge is an unknown number
decided continuously by whoever can click "create" — stoppable the moment the resource is
deleted, but with no built-in ceiling either. "Cloud is cheaper" is not the claim the
distinction supports. It changes the *shape* and *reversibility* of the spending; whether it
is also cheaper depends entirely on how well the resulting consumption is controlled.

**How it works** Buying a server means sizing for the peak you expect over its whole life and
paying for that peak permanently, idle months included. Renting the same capacity per hour
means paying only while it is provisioned, at the size it is provisioned at, so the spend
follows demand instead of anticipating it. Committing to a cloud reservation for one or three
years reintroduces a commitment that *feels* like CapEx — but it is still a service you rent
rather than an asset you own, and it buys a rate, not a machine.

**Key terms** capitalisation and depreciation; up-front commitment; consumption-based
expense; peak provisioning.

<a id="c-cloud.budgeting.pay-as-you-go"></a>
### pay-as-you-go
*id: `cloud.budgeting.pay-as-you-go` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-145*

**What it is** A billing principle rather than a product: charges accrue against a metered
quantity of consumption — instance-hours, GB-months of storage, requests served, GB
transferred — and nothing at all accrues for capacity you have never provisioned. It is the
default behaviour of a cloud account, and the list-price baseline every discount in this
section is quoted against.

**Why it matters** The phrase "pay only for what you use" is routinely misread as "pay only
for what you utilise," and the difference is the single most expensive misunderstanding on a
cloud invoice. A virtual machine running at 2% CPU costs exactly what the same machine costs
at 100%: the meter counts provisioned, running capacity, not work performed. An unattached
disk, a reserved public address, and a load balancer with no traffic all bill at their full
rate while doing nothing. This is precisely why rightsizing and orphaned resources cost money
at all — under a genuine utilisation-based meter, neither would.

**How it works** Metering is one of the defining characteristics of cloud computing: NIST's
definition names *measured service* as an essential characteristic, meaning the provider
automatically meters resource use at a granularity appropriate to the service and reports it
back to both parties. Billing then follows that meter. Granularity varies by service and
matters: compute commonly bills per second or per hour of provisioned time, storage per
GB-month regardless of whether anything reads it, and request-driven or serverless services
per request and per unit of execution time — which is the only shape that comes close to
charging for actual utilisation, because there is no idle provisioned unit for the meter to
count.

**Key terms** measured service; metered consumption; provisioned versus utilised; billing
granularity.

**Traps** Stopping a virtual machine is not the same as it costing nothing, and on some
providers stopping does not even stop the compute meter: Azure bills a VM in the *Stopped*
(allocated) state for instance usage and only stops billing once it reaches *Stopped
(deallocated)*, because only deallocation releases the underlying hardware. Even after the
compute meter stops, attached disks, snapshots, and any reserved address the machine holds
keep billing on their own meters, which is why "we shut everything down overnight" saves far
less than a team expects. Equally, pay-as-you-go is not a synonym for "cheapest" — it is the
undiscounted baseline, and both reserved and spot pricing are cheaper per unit than it is.

**What the exam may test** Separating the charging principle from the purchase options priced
under it, and recognising that idle-but-provisioned capacity is billed in full — the fact
that makes every cost-control practice in the next section necessary.

*Not to be confused with [on-demand, reserved and spot pricing](budgeting.md#cmp-cloud.budgeting.on-demand-reserved-and-spot-pricing).*

<a id="c-cloud.budgeting.on-demand-reserved-and-spot-pricing"></a>
### on-demand, reserved and spot pricing
*id: `cloud.budgeting.on-demand-reserved-and-spot-pricing` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-spot-instances*

**What it is** Three purchasing options for one and the same unit of compute. **On-demand**
is full list price with no commitment: start it, stop it, pay for the time it ran.
**Reserved** capacity (sold variously as reserved instances, committed use, or savings plans)
trades a term commitment — typically one or three years — for a discount off that list price.
**Spot** (also called preemptible) sells the provider's spare capacity at a steep discount on
the condition that the provider may reclaim it at short notice.

**Why it matters** Matching a workload to one of the three is the archetypal scenario
question in this competency, and the axis it turns on is not price. Every candidate can rank
the three by cost. The question is what the workload can *tolerate*: a multi-year commitment,
or an abrupt interruption. A workload that can tolerate neither belongs on-demand and pays
for the privilege.

**How it works** On-demand and spot both provision the same instance types from the same
pools; the difference is which pool and what guarantee. Spot draws from unused capacity, and
its hourly price is set by the provider and adjusted gradually according to long-term supply
and demand — not by a live auction between customers, which is the outdated mental model most
candidates carry. When the provider needs the capacity back, it terminates, stops, or
hibernates the instance after a two-minute interruption notice; a separate rebalance
recommendation signal may arrive earlier, flagging elevated interruption risk so work can be
moved before that two-minute window opens. Reserved pricing changes nothing about the
instance: it is a billing arrangement in which you commit to a level of spend or usage for
the term and receive a lower rate in exchange.

**Key terms** term commitment; interruption notice; spare capacity; interruptible workload.

**Traps** A reservation that goes unused still bills for the full committed term — the
discount is bought with the commitment, not with usage, so an over-committed reservation
wastes money exactly as an oversized instance does. There is no delete button for it. Any
exit is narrow, provider-specific and conditional: AWS, for one, lets unused *Standard*
Reserved Instances be listed for sale on its Reserved Instance Marketplace (Convertible ones
cannot be sold, only exchanged for another Convertible reservation), and accepts a Savings
Plan return only within seven days of purchase, in the same calendar month, and under
documented limits. None of that refunds a commitment on demand. Spot's discount is not
"reserved pricing without the paperwork": spot buys price with the risk of losing the
instance, reserved buys price with loss of flexibility, and the two are not substitutes. Anything holding state that cannot be checkpointed inside two
minutes — a production database, a stateful session tier, a long single-threaded job with no
restart point — is unsuitable for spot at any discount.

**What the exam may test** Given a described workload (a nightly batch render, a 24/7
production database, a two-week proof of concept, a queue-driven worker fleet), choosing the
purchasing option; and recognising that spot capacity is reclaimed by the provider when it
needs the hardware back, not lost to a competing bidder outbidding you.

<a id="cmp-cloud.budgeting.on-demand-reserved-and-spot-pricing"></a>
#### Not to be confused with: on-demand, reserved and spot pricing vs pay-as-you-go
*compares: `cloud.budgeting.on-demand-reserved-and-spot-pricing`, `cloud.budgeting.pay-as-you-go`*

| | on-demand, reserved and spot pricing | pay-as-you-go |
| --- | --- | --- |
| What it names | Three concrete purchase options for the same capacity | The charging principle those options are priced against |
| Level | A per-workload decision you make | The account's default billing behaviour, not an item on a menu |
| Commitment involved | On-demand none; reserved a one- or three-year term; spot none | None inherent to the principle |
| Relationship to discounts | Reserved and spot are discounts *off* on-demand | It is the undiscounted baseline; it has no discount of its own |

The separating axis is level: pay-as-you-go is the meter, and on-demand, reserved and spot
are the three prices that same meter can be billed at.

<a id="c-cloud.budgeting.free-tier-and-pricing-calculators"></a>
### free tier and pricing calculators
*id: `cloud.budgeting.free-tier-and-pricing-calculators` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-budgets*

**What it is** Two different pre-commitment instruments, usually named in one breath. A free
tier is a provider allowance that makes some consumption cost nothing, and it comes in three
distinct shapes: a perpetual per-service monthly allowance, a time-limited trial window, and
a one-off credit grant. A pricing calculator is an estimation tool that models a
configuration's cost before any of it is built.

**Why it matters** The entry-level form of this question is "how do you find out what an
architecture will cost *before* you spend the money," and the correct answer names estimation
rather than observation. Cost monitoring and budgets, later in this file, both report or
police money that is already being spent; a calculator is the only instrument here that
operates before anything exists. Confusing the two is the discrimination the question is
built on.

**How it works** Allowances are metered like any other consumption, and on an account with a
payment method attached, exceeding one generally does not stop the resource — it starts
billing it, silently, at the standard rate. Which of the
three shapes applies determines when that happens: a perpetual allowance resets each month, a
trial window expires on a date whether or not you noticed, and a credit grant is exhausted by
spend. Calculators multiply published list prices by the quantities you enter, which means
they default to on-demand rates and include only what you thought to enter. Egress,
cross-region transfer, snapshot storage, support plans and taxes are absent unless added by
hand, which is the structural reason a calculator estimate lands below the real invoice
rather than above it.

**Key terms** perpetual allowance; trial window; credit grant; list-price estimate.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `cloud.budgeting.total-cost-of-ownership` | total cost of ownership | The full cost of delivering a capability — hardware, staff time, power and cooling, floor space, licensing, migration effort and the opportunity cost of capital — not merely the provider invoice or the purchase price. | It is confused with the invoice or the sticker price. A cloud-versus-on-premises comparison that sets a monthly cloud bill against a server's purchase price alone is a TCO error, because it silently drops the staffing, power and hardware-refresh costs that only one side of the comparison carries. |

#### Scenario

A team must cost two workloads before approval. The first is a nightly render that runs for
three hours, is fully restartable, and does not care when it finishes; the second is the
customer-facing API behind it, running continuously for at least two years. The render is the
textbook spot candidate — it survives a two-minute interruption notice by re-queueing the job
— while the API's steady, long-lived baseline is what reserved pricing exists for, with
on-demand covering only the burst above it. Costing both before build means a pricing
calculator, not the billing console, and the estimate must have egress added by hand or it
will read low. The finance reviewer asks whether this beats buying two servers: the honest
comparison is total cost of ownership, and the real change is from a capital purchase decided
once to an operating charge decided continuously.

#### Knowledge check

1. A virtual machine sits at 3% CPU all month. Under pay-as-you-go, how much less does it
   cost than the same machine at 100%?
   Nothing — the meter counts provisioned, running capacity, not utilisation. That gap is
   what rightsizing exists to close.
2. What is the one-sentence difference between pay-as-you-go and on-demand pricing?
   Pay-as-you-go is the charging principle (metered consumption); on-demand is the specific
   purchase option that implements it with no commitment, and it is the baseline reserved and
   spot are discounted from.
3. A team says spot instances are risky because "another customer might outbid us." What is
   wrong with that description?
   Spot price is set by the provider and moves gradually with long-term supply and demand, not
   by a live auction. The instance is reclaimed when the provider needs the capacity back,
   with a two-minute interruption notice.
4. A three-year reservation was bought for a service that was decommissioned after four
   months. What happens to the spend?
   It continues for the remaining term — the discount was bought with the commitment, not
   with usage, so an unused reservation is as wasteful as an oversized instance. There is no
   delete button; any exit is a narrow, provider-specific resale, exchange or short-window
   return path, and none of them refunds the commitment on demand.
5. Why does a pricing calculator estimate typically come in under the eventual invoice?
   It multiplies list prices by only the quantities entered — egress, cross-region transfer,
   snapshots, support and tax are omitted unless added deliberately.
6. Name the two things a CapEx-to-OpEx shift genuinely changes, and the one thing it does not
   guarantee.
   It changes the shape of spending (up-front and fixed becomes ongoing and variable) and its
   reversibility (an asset you own becomes a service you can stop). It does not guarantee a
   lower total cost.

<a id="s-budgeting-cost-control"></a>
## Cost control

<a id="c-cloud.budgeting.rightsizing"></a>
### rightsizing
*id: `cloud.budgeting.rightsizing` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-rightsizing-whitepaper*

**What it is** Matching provisioned capacity to measured workload requirements at the lowest
cost that still meets them — shrinking an instance, disk, or database that is far larger than
its observed demand, or occasionally growing one that is throttling. The resource is
genuinely wanted; only its size is wrong.

**Why it matters** Because pay-as-you-go bills provisioned capacity rather than utilisation,
an oversized resource wastes money continuously and completely silently. Nothing fails,
nothing alerts, no user complains — the only symptom is a line on an invoice that nobody is
reading. AWS's right-sizing guidance describes exactly the failure mode that produces it:
environments lifted and shifted at migration time with speed prioritised over cost, on the
assumption that rightsizing will happen later, which leaves oversized instances and
substantial wasted spend behind.

**How it works** Collect utilisation metrics — CPU, memory, IOPS, network — over a window
long enough to contain the workload's real peaks, then compare them against what is
provisioned and step the resource down, re-measuring afterwards. The observation window is
the part that is usually got wrong: a week that misses month-end close, a payroll run, or a
seasonal campaign will recommend a size that fails the first time those arrive. Rightsizing
is iterative rather than a one-time project, because both the workload and the provider's
instance catalogue keep changing.

**Key terms** utilisation metrics; observation window; instance family; iterative review.

**Traps** Rightsizing is not autoscaling. Autoscaling changes how *many* units run,
automatically and in response to live load; rightsizing changes how *big* each unit is, as a
deliberate periodic decision by a human. A scenario describing capacity that follows traffic
minute by minute is describing autoscaling, whatever word the question uses. Sizing to
average utilisation rather than to peak is the other reliable failure: it converts a cost
problem into a performance incident. Note also that some vendor guidance folds "eliminate the
resource entirely" into rightsizing; for exam purposes keep elimination separate, because the
action, the evidence and the saving all differ — see the comparison below.

**What the exam may test** Given a resource at consistently low utilisation that is still
serving a purpose, choosing to resize rather than delete; and separating rightsizing from
autoscaling when a scenario describes capacity changing over time.

*Not to be confused with [orphaned resources](budgeting.md#cmp-cloud.budgeting.orphaned-resources).*

<a id="c-cloud.budgeting.orphaned-resources"></a>
### orphaned resources
*id: `cloud.budgeting.orphaned-resources` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-rightsizing-whitepaper*

**What it is** Resources still provisioned and still billing after whatever they existed to
serve has gone: a disk left behind when its virtual machine was deleted, a load balancer with
no healthy targets, a static IP address no longer attached to anything, snapshots of volumes
that no longer exist, a proof-of-concept environment nobody switched off. They are not
oversized. They are unneeded.

**Why it matters** An orphan produces no errors, no alerts, and no complaints, because the
person who would have complained has moved on — which is exactly why it survives. The cost is
open-ended: unlike a one-off overspend, an orphan bills every hour until somebody deletes it,
and the estate accumulates them faster than anyone removes them. Attribution is the only
practical defence, which is why resource tagging below is the enabling control for this
topic rather than a separate housekeeping concern.

**How it works** Deletion in most providers is deliberately asymmetric: removing a virtual
machine does not necessarily remove its attached disks, its snapshots, or the address
reservation it held, and each of those keeps billing on its own meter afterwards. Finding
orphans therefore means querying inventory rather than reading telemetry — filter on
attachment state (volumes with no instance, addresses with no association), on last activity
(load balancers with zero requests, environments with no logins), and cross-reference the
owner and environment tags to find who to ask before deleting. The remedy is deletion; there
is no size to adjust.

**Key terms** unattached volume; reserved address; snapshot sprawl; idle environment.

**Traps** Detaching a volume saves nothing at all — an unattached disk bills the same per
GB-month as an attached one, because storage is charged for existing, not for being read.
Only deletion stops it. In the same family: stopping a virtual machine is not deleting it,
and a stopped machine's disks, snapshots and reserved address continue to bill even though
its compute meter has stopped.

**What the exam may test** Given a cost line with no corresponding running workload,
identifying it as an orphan and choosing deletion over resizing; and recognising that
stopping, detaching, or "cleaning up" a resource is not the same as removing the thing that
bills.

<a id="cmp-cloud.budgeting.orphaned-resources"></a>
#### Not to be confused with: orphaned resources vs rightsizing
*compares: `cloud.budgeting.orphaned-resources`, `cloud.budgeting.rightsizing`*

| | orphaned resources | rightsizing |
| --- | --- | --- |
| What is wrong | The resource serves no purpose at all | The resource serves a real purpose, at the wrong size |
| Correct action | Delete it | Resize it, then re-measure |
| Evidence used to find it | Inventory: attachment state, last activity, owner tag | Telemetry: utilisation against provisioned capacity over a full peak cycle |
| Saving achieved | The whole of that resource's cost | Only the difference between two sizes |
| Risk of getting it wrong | Deleting something that was still in use | Undersizing, turning a cost problem into a performance incident |

The separating axis is whether the resource still has a purpose: if the purpose is gone the
answer is deletion, and if the purpose is intact but the capacity is not, the answer is
resizing.

<a id="c-cloud.budgeting.data-egress-charges"></a>
### data egress charges
*id: `cloud.budgeting.data-egress-charges` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: azure-bandwidth-pricing*

**What it is** The per-gigabyte charge providers levy on data leaving their network, against
which data entering it is generally free. Microsoft's bandwidth pricing states the asymmetry
plainly for Azure: inbound data transfer into its datacentres is free, while outbound
transfer is billed per gigabyte above a monthly free allowance. The other major providers
price the same way. Getting your data in costs nothing; getting it out is a meter.

**Why it matters** Egress prices *architecture*, not feature usage, which is why it surprises
people who have budgeted carefully for compute and storage. Replicating backups to a second
region, or letting an analytics tool in one provider read a database in another, each turn a
one-time architectural decision into a recurring per-gigabyte charge that appears in none of
the line items anyone was watching. It is also the concrete mechanism behind the lock-in
argument: the cost of leaving is a function of how much data you hold.

**How it works** Egress is metered by volume transferred out and banded by destination.
Traffic out to the internet is one band; traffic to a different region of the same provider
is another, and on Azure's published rates the inter-region band is the cheaper of the two.
Traffic that stays inside a single region may be free or charged depending on the provider —
Azure states that transfer between Azure services located within the same region is not
charged, which is not a safe assumption to carry elsewhere. Reading your own data back out to
the internet is egress like any other; the meter does not care that you put the data there.
The asymmetry has one documented exemption: AWS, Azure and Google Cloud each waive egress
charges for a customer moving their data off the platform entirely, which is an exit
concession rather than a change to the model.

**Key terms** ingress; egress; per-gigabyte metering; cross-region transfer.

<a id="c-cloud.budgeting.resource-tagging"></a>
### resource tagging
*id: `cloud.budgeting.resource-tagging` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-tagging-best-practices*

**What it is** Attaching metadata to resources as labels — AWS describes each tag as a simple
label consisting of a key and an optional value — so that resources can be categorised by
owner, environment, cost centre, application, or any other axis the business cares about.
For budgeting purposes the point of a tag is attribution: turning an anonymous line on an
invoice into somebody's line.

**Why it matters** Tagging is the enabling control beneath every other practice in this
section. Without it a bill is a list of service totals with no owner, and no per-team budget,
chargeback, showback, or orphan hunt is possible, because all four are attribution questions
before they are cost questions. An untagged resource is also the resource most likely to
become an orphan, since nothing records who created it or why.

**How it works** Tags are applied at creation or added later, and providers expose them as
filter dimensions across inventory, automation, and — once the specific tag key has been
activated as a cost-allocation dimension in the billing system — cost reporting. Consistency
is the entire game: `env`, `Env`, and `Environment` are three unrelated keys that split one
team's spend three ways, so a written tagging standard plus enforcement at creation time
(policy that refuses an untagged resource) is far more reliable than a retrospective sweep.
A tag is only useful for cost attribution if it was present on the resource while the
resource was being billed and the billing system was told to treat that key as a cost
dimension.

**Key terms** key-value pair; cost-allocation tag; tagging standard; attribution.

<a id="c-cloud.budgeting.budgets-and-cost-alerts"></a>
### budgets and cost alerts
*id: `cloud.budgeting.budgets-and-cost-alerts` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-budgets*

**What it is** A target amount set in advance for a defined scope and period, together with
thresholds that raise a notification when spend crosses them. AWS Budgets is the
representative implementation: a budget tracks cost or usage against a target, and can also
track reservation or savings-plan utilisation and coverage, notifying by email or a
notification topic when a threshold is breached.

**Why it matters** Consumption billing has no natural ceiling, so something has to supply
one. A budget is the mechanism that turns a silent overrun into a message someone receives
while there is still a month left to act. The discrimination the exam wants is what that
message does and does not do: a threshold breach notifies. On its own it stops nothing.

**How it works** Define the scope (an account, a service, a set of tagged resources), the
period, and the target amount, then attach thresholds expressed as a percentage of that
amount. Each threshold is configured to evaluate either **actual** spend, which has already
accrued, or **forecast** spend for the period, which has not — so forecast thresholds are the
ones capable of warning before the money is gone. Budgets can additionally trigger a
configured action, such as attaching a restrictive IAM policy that denies further
provisioning, but that action is something an administrator sets up deliberately; it is not
what an alert does by default. AWS documents a further caveat worth holding: there is a delay
between incurring a charge and being notified about it, because resource usage is billed some
time after it happens, so spend can pass a threshold — and keep moving — before the
notification arrives.

**Key terms** threshold; actual versus forecast; budget scope; budget action.

**Traps** A budget is not a spending cap. Nothing about crossing a threshold halts a running
resource or refuses the next API call unless an action was explicitly configured to do so,
and an exam option offering "the budget prevents further spending" is wrong by default. A
second trap is scope: a single budget over an entire account will not surface one team's
runaway spend until it is large relative to the whole account, which is the argument for
tag-scoped or per-account budgets. A third is timing — an alert fired on actual spend is by
construction news about money already committed.

**What the exam may test** Whether a budget alert stops spending (it does not); the
difference between an actual and a forecast threshold; and choosing a budget rather than a
monitoring dashboard when the requirement is to be told about a specific number being
crossed.

<a id="cmp-cloud.budgeting.budgets-and-cost-alerts"></a>
#### Not to be confused with: budgets and cost alerts vs cost monitoring
*compares: `cloud.budgeting.budgets-and-cost-alerts`, `cloud.budgeting.cost-monitoring`*

| | budgets and cost alerts | cost monitoring |
| --- | --- | --- |
| What it is | A target amount plus thresholds set in advance | Continuous observation and attribution of actual spend |
| Requires a number decided beforehand | Yes — with no target there is nothing to cross | No — it reports whether or not anyone set a target |
| Orientation in time | Fires when actual or forecast spend crosses the line | Reports what has been spent and how the trend is moving |
| Output | A notification, pushed to a person; an action only if one was configured | A report, breakdown, or dashboard, pulled by a person |
| Question it answers | "Am I about to exceed what I said I would spend?" | "What am I spending it on, and is that changing?" |

The separating axis is whether a threshold exists: a budget is a number you must not cross
and an event when you do, while monitoring has no number in it at all and simply describes
what is happening.

<a id="c-cloud.budgeting.cost-monitoring"></a>
### cost monitoring
*id: `cloud.budgeting.cost-monitoring` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-budgets*

**What it is** Continuous tracking of actual spend — broken down by service, account, region
and tag, and plotted over time against its own trend and forecast — because cloud cost is a
variable that moves with usage rather than a fixed figure that can be checked annually.

**Why it matters** Last month's bill is not a prediction of this month's, so the useful
signal is the shape of the change rather than the total: a service appearing that was not
there before, a steady climb from an autoscaling group that never scales back down, a
step change on the day a free-tier allowance expired. Monitoring is also the prerequisite for
everything else in this section. You cannot rightsize what has never been measured, and you
cannot find an orphan in an invoice that has no breakdown.

**How it works** Providers expose cost and usage data at daily, sometimes hourly, granularity,
sliceable by service, account, region and activated cost-allocation tag, with a forecast
projected from the observed trend. Granularity is the design decision that determines what
you can see: a monthly total hides a three-day spike that daily data shows immediately.
Billing data lags the usage it describes — the same delay that makes budget notifications
late makes monitoring near-real-time at best — so a dashboard read at noon is describing
yesterday's estate, and a genuinely instantaneous view of spend does not exist.

**Key terms** granularity; cost and usage data; forecast; attribution.

**Traps** Monitoring is not alerting. A dashboard nobody opens detects nothing, which is
exactly why budgets and alerts exist alongside it rather than instead of it. And a rise in
the bill does not imply a rise in the number of resources: more egress from the same servers,
more requests against the same database, a free-tier allowance ending, or a reservation
reaching the end of its term will each raise the bill with the resource inventory completely
unchanged. Diagnosing a cost increase by counting instances will miss all four.

**What the exam may test** Separating continuous observation from threshold alerting when a
scenario names one and describes the other; and explaining a bill that rose while the number
of provisioned resources stayed flat.

*Not to be confused with [budgets and cost alerts](budgeting.md#cmp-cloud.budgeting.budgets-and-cost-alerts).*

<a id="c-cloud.budgeting.storage-tiers-and-lifecycle-policies"></a>
### storage tiers and lifecycle policies
*id: `cloud.budgeting.storage-tiers-and-lifecycle-policies` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: azure-blob-access-tiers, azure-blob-lifecycle-management*

**What it is** A paired mechanism. **Tiers** are cost classes inside one storage service,
differing in how quickly data can be read back and in how the price is split between holding
the data and touching it. **Lifecycle policies** are rules that move objects between those
tiers, or delete them outright, automatically, as they age.

**Why it matters** The trade is not "cheap versus expensive" — it is *where* the cost sits.
Azure states the pattern explicitly across its blob tiers: hot carries higher storage costs
but lower access and transaction costs, cool and cold carry lower storage costs but higher
access costs, and archive has the lowest storage cost and the highest access and transaction
costs of all. Data that is read often therefore costs *more* in a cold tier than in a hot one,
which is why "move everything to archive to save money" is a wrong answer rather than an
aggressive one.

**How it works** Azure's blob tiers show the full shape. Hot, cool and cold are online: data
is readable immediately, with time-to-first-byte in milliseconds. Cool carries a minimum
recommended retention of 30 days and cold 90 days. Archive is an *offline* tier: a blob in
archive cannot be read or modified at all until it has been rehydrated to an online tier,
which takes hours, and its data must remain there at least 180 days or attract an early
deletion charge — Microsoft's own worked example is a blob moved to archive and then deleted
after 45 days, charged as if it had been stored for the remaining 135. Lifecycle policies are
JSON rule sets: each rule has conditions on blob creation time, last modified time, or last
accessed time, at least one action such as changing tier or deleting, and optional filters by
path prefix or blob tag. Adding or editing a policy can take up to 24 hours to take effect,
and the policy engine cannot rehydrate blobs out of archive — that path is one-way as far as
lifecycle automation is concerned.

**Key terms** access tier; minimum retention period; early deletion charge; rehydration;
lifecycle rule.

**Traps** Archive is not simply a slower hot tier — it is offline, and a read requires an
explicit rehydration step measured in hours, so nothing with a latency requirement can sit
there regardless of price. Aggressive tiering can also *raise* the bill: each transition is a
billable operation, moving data into a colder tier starts a minimum-retention clock, and
deleting or promoting the data before that clock expires incurs the remaining days as an
early deletion charge. Finally, a lifecycle policy is not a backup or retention-safety
mechanism; its delete action deletes, and the rule fires on age or access time with no
awareness of whether the data still matters.

**What the exam may test** Matching an access pattern and retention requirement to the right
tier; recognising that reading archived data requires rehydration first rather than a normal
read; and recognising that lifecycle rules act on the age or access time of an object, never
on its cost.

<a id="cmp-cloud.budgeting.storage-tiers-and-lifecycle-policies"></a>
#### Not to be confused with: storage tiers and lifecycle policies vs object, block and file storage
*compares: `cloud.budgeting.storage-tiers-and-lifecycle-policies`, `cloud.cloud-computing.object-block-and-file-storage`*

| | storage tiers and lifecycle policies | object, block and file storage |
| --- | --- | --- |
| What it names | A cost and access-latency class for data already inside a storage service, plus the rules that move data between classes | The storage type — how data is addressed and presented to a client |
| The decision it represents | How cheap to hold, and how fast to read back | Whether data is reached as keyed objects, as raw blocks under a filesystem, or over a shared network filesystem |
| Changing it | A tier change or a lifecycle rule; the data keeps its address and its interface | A different service entirely; data must be migrated and applications repointed |
| When it is decided | After the storage type is chosen, and revisited continuously as data ages | First — it is the top-level choice that any tiering question presupposes |
| Where it applies | Chiefly object storage, where per-object tiering and lifecycle rules exist | Across all three types, as the definition of the types themselves |

The separating axis is which question is being answered: object, block and file storage names
how the data is *addressed*, while tiers and lifecycle policies name what it costs to *keep
and retrieve* it. Pick the type first, then tier within it.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `cloud.budgeting.chargeback-and-showback` | chargeback and showback | Chargeback bills internal teams for the cloud they consume, moving money between cost centres; showback reports the same consumption back to them without transferring any charge. | The pair is confused in both directions. Showback is not "chargeback that has not been switched on yet" — it is a deliberate choice to change behaviour through visibility alone, with no accounting entry and no internal invoice. Both depend entirely on resource tagging for attribution, so neither works on an untagged estate. |

#### Scenario

A monthly bill rises by a third with no new servers provisioned. Cost monitoring gives the
breakdown that a total cannot: compute is flat, storage is flat, and the increase is almost
entirely outbound data transfer, traced to a new nightly backup replicating to a second
region — egress, priced by the gigabyte, invisible in the lines everyone had been watching.
The same breakdown, sliced by the `environment` tag, surfaces two further items: an
unattached volume left by a deleted test machine, which is an orphan and must be deleted
rather than detached, and a database instance at 4% CPU all month, which is a rightsizing
candidate and must be resized rather than deleted. The team then sets a forecast-threshold
budget scoped to that tag — accepting that it will notify, not cap — and a lifecycle rule
tiering backups older than 90 days to colder storage.

#### Knowledge check

1. What is the one-sentence difference between an orphaned resource and a rightsizing
   candidate?
   The orphan has no purpose left and must be deleted; the rightsizing candidate still has a
   purpose but is provisioned larger than its measured demand and must be resized.
2. A volume is detached from its virtual machine to save money. How much is saved?
   Nothing — storage bills for existing, not for being attached or read. Only deleting the
   volume stops the charge.
3. Which direction of data transfer is normally charged, and which is free?
   Outbound (egress) is charged per gigabyte; inbound (ingress) is normally free. Cross-region
   transfer is charged as its own band, and intra-region rules vary by provider.
4. A budget threshold at 90% has just fired. What has the provider done to the account?
   Nothing — a threshold breach sends a notification. It halts no resource and refuses no API
   call unless an administrator explicitly configured a budget action.
5. What must happen before an object in an offline archive tier can be read, and roughly how
   long does it take?
   It must be rehydrated to an online tier first, which takes hours. Archive is not a slow
   online tier; it is unreadable until rehydrated.
6. Why can moving rarely-used data to a colder tier increase rather than decrease the bill?
   Colder tiers shift cost from storage to access and transactions, each transition is a
   billable operation, and the move starts a minimum retention clock — deleting or promoting
   the data early incurs the remaining days as an early deletion charge.
