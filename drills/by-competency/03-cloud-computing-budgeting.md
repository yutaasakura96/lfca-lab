<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Cloud Computing Fundamentals :: Budgeting

31 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A team wants one instrument that answers both 'am I about to exceed what I said I would spend' and 'what am I spending it on, and is that changing.' Which instrument does both, and if none does, why not?

- **A.** Cost monitoring alone does both, since a rising trend line on a dashboard already implies that some spend threshold is being approached.
- **B.** A pricing calculator does both, since it estimates the number needed to set both a budget and a monitoring baseline.
- **C.** No single instrument does — a budget answers the first because it has a threshold to cross, and monitoring answers the second because it reports trend with no target of its own.
- **D.** A budget alone does both, since its threshold notification already explains exactly what changed in the estate to cause the breach.

**Answer: C.** Budgets and cost monitoring answer different questions: a budget requires a target decided beforehand and fires when actual or forecast spend crosses it, while monitoring has no number in it at all and simply reports what is happening and how the trend is moving.

- A is wrong: A trend line has no defined threshold of its own; without a configured budget, nothing decides how much of a rise counts as approaching a limit.
- B is wrong: A calculator estimates cost for a configuration before it is built; it does not itself report ongoing spend or notify on a crossed threshold.
- D is wrong: A threshold breach is a notification, not a breakdown; it does not say what changed, which is exactly what monitoring's per-service, per-tag data provides.

### 2.

A budget's 90 percent threshold has just fired by email. What has the provider actually done to the account as a result?

- **A.** The account is now blocked from provisioning further resources, since the threshold exists specifically to prevent overspend.
- **B.** Any orphaned resources contributing to the overage are automatically found and deleted.
- **C.** Nothing by default: a threshold breach sends a notification, and it halts no resource and refuses no API call unless an action was explicitly configured.
- **D.** The account's free-tier allowance is extended automatically to absorb the extra spend.

**Answer: C.** A budget is not a spending cap. Crossing a threshold notifies a person; it stops no resource and refuses no API call unless an administrator explicitly configured a budget action to do so, and an exam option claiming otherwise is wrong by default.

- A is wrong: This is the assumption the trap exists to catch — a threshold breach is a message, not an enforcement action, unless a budget action was deliberately configured in advance.
- B is wrong: Budgets do not identify or delete resources; finding and removing an orphan is a separate, evidence-based practice using inventory, not a budget behaviour.
- D is wrong: A free-tier allowance and a budget threshold are unrelated instruments; crossing one has no effect on the size of the other.

### 3.

Two thresholds are configured on the same budget: one evaluated against actual spend, one against forecast spend. Which one can warn before the money is actually gone, and what caveat applies to both?

- **A.** The actual threshold can warn early, since actual figures are always more current and more trustworthy than any forecast could be.
- **B.** Neither can warn early; only a periodic rightsizing review of provisioned capacity catches overspend before it actually happens.
- **C.** Both warn the instant spend crosses the line, since cloud billing is metered and reported in real time.
- **D.** The forecast threshold can warn early; both are still subject to a billing delay, so spend can cross a threshold and keep moving before the notification arrives.

**Answer: D.** Each threshold is evaluated against either actual spend, which has already accrued, or forecast spend, which has not, so only a forecast threshold can warn before the money is gone. Both remain subject to a documented delay between a charge being incurred and the notification arriving.

- A is wrong: Actual spend has already accrued by definition; it can only report what has already happened, not warn ahead of it the way a forecast can.
- B is wrong: Rightsizing addresses provisioned-versus-utilised waste on existing resources, a different problem from being notified about approaching a spend target.
- C is wrong: Billing lags the usage it describes, so notification is never instantaneous — this is a documented caveat, not an edge case.

### 4.

A finance team argues that moving from owned servers to cloud compute is a straightforward cost win, since the monthly bill is smaller than the loan payments on a server refresh would have been. What does the CapEx-to-OpEx shift actually establish on its own?

- **A.** It proves cloud is cheaper, once staffing and power costs are added to the on-premises side of the comparison.
- **B.** It proves consumption is billed only for work actually performed, not for capacity left running idle.
- **C.** It changes the shape and reversibility of spending, from a fixed sum committed once to a variable charge stoppable at will, not that the eventual total is necessarily smaller.
- **D.** It replaces a capital budgeting process with no budgeting process at all, since usage is metered automatically and the provider is now responsible for staying within any limit.

**Answer: C.** The CapEx-to-OpEx shift changes when money is committed and how reversible that commitment is, not whether the eventual total is smaller — that depends entirely on how well the resulting consumption is controlled.

- A is wrong: That claim requires costing both sides fully, which is what total cost of ownership does, not what the accounting shift itself proves.
- B is wrong: That describes the pay-as-you-go meter's behaviour, and it is false there too — provisioned capacity bills whether or not it is used.
- D is wrong: Consumption is still tracked against a target and controlled deliberately by the customer; nothing about a metered bill removes the need to plan and cap spend, and no provider enforces a limit on your behalf by default.

### 5.

AWS's business case for cloud computing argues the same accounting trade in different words than 'CapEx versus OpEx.' Which pair of terms does that specific page actually use?

- **A.** Capital expenditure versus operational expenditure, quoted directly from that same AWS business-case page word for word.
- **B.** Predictable versus elastic capacity, describing the pay-as-you-go meter rather than an accounting category.
- **C.** Committed versus interruptible workload, the axis separating reserved pricing from spot pricing elsewhere in this competency.
- **D.** Fixed expense versus variable expense: the underlying trade is the same, but this page never uses the words 'CapEx' or 'OpEx.'

**Answer: D.** AWS's page argues the trade in fixed-versus-variable-expense language rather than literally saying CapEx or OpEx. The two vocabularies describe the same accounting shift, but a citation must not assume the source used words it never contains.

- A is wrong: A tempting shortcut, but the source's own wording is fixed and variable expense — assuming it uses the accounting terms verbatim is a citation error, not a paraphrase.
- B is wrong: That pair names the billing principle behind consumption charges, a different concept from the accounting-category trade this page argues.
- C is wrong: That pair names a purchasing-option trade-off, not the fixed-versus-variable expense vocabulary this page uses.

### 6.

A finance team reports each department's cloud spend back to them every month but never moves budget between cost centres to do it. Is this chargeback, showback, or chargeback that has simply not been switched on yet?

- **A.** Chargeback, since reporting a team's spend back to them already counts as billing them for it.
- **B.** Cost monitoring, since it is simply a report rather than either accounting practice.
- **C.** Showback — a deliberate choice to influence behaviour through visibility alone, not an earlier stage of chargeback.
- **D.** Chargeback not yet switched on — showback is simply the on-ramp organisations pass through before they start billing internally.

**Answer: C.** Chargeback bills internal teams for their consumption, moving money between cost centres; showback reports the same consumption without transferring any charge. Showback is not chargeback waiting to be turned on — it is a deliberate, often permanent, choice to change behaviour through visibility alone.

- A is wrong: Chargeback moves money between cost centres with an internal invoice; reporting alone, with no such transfer, is showback rather than a form of billing.
- B is wrong: Cost monitoring is the continuous tracking of spend generally; chargeback and showback specifically concern whether spend already tracked is billed internally or merely reported.
- D is wrong: This pair is confused in both directions, and this is the specific misreading: showback is not chargeback waiting to be turned on, it is a standalone choice organisations can run permanently.

### 7.

A monthly bill rises by 20 percent while the resource inventory stays completely unchanged: same instance count, same disks, same databases. What kind of explanation is monitoring's breakdown suited to find, that a simple resource count cannot?

- **A.** More egress, more requests against the same database, an expired free-tier allowance, or a reservation ending its term — each raises the bill without changing the inventory.
- **B.** None — a rising bill against an unchanged inventory means a configured budget threshold must already have fired by now.
- **C.** A new orphaned resource must have appeared somewhere in the estate, since only orphans are known to raise a bill silently like this.
- **D.** Nothing explains it; a rise in the bill always and only means a rise in the number of resources currently provisioned.

**Answer: A.** Monitoring's breakdown by service, account, region and tag is what a bare total cannot provide: a rise in the bill does not imply a rise in the number of resources, since more egress, more requests, an expired allowance, or an ending reservation term can each raise it with the inventory unchanged.

- B is wrong: A budget threshold only fires if one was configured with a target in the first place; nothing about a rising bill guarantees that one exists or has fired.
- C is wrong: An orphan is a resource with no purpose left; the scenario states inventory is entirely unchanged, which is not consistent with a new orphan appearing.
- D is wrong: This is exactly the assumption monitoring's breakdown exists to correct — several causes raise a bill with no new resources involved at all.

### 8.

A cost dashboard exists and its underlying data is technically correct, but nobody has opened it in three months. What does this demonstrate about monitoring on its own?

- **A.** Monitoring is not alerting — a dashboard nobody opens detects nothing, which is why budgets and alerts exist alongside it rather than instead of it.
- **B.** The dashboard's tags must be misconfigured, since a correctly tagged dashboard would have been opened by now.
- **C.** A pricing calculator should replace the dashboard, since estimates need no one to check them.
- **D.** Nothing — the dashboard's data is still being collected correctly, so the organisation is still effectively being warned.

**Answer: A.** Monitoring is not alerting: a dashboard nobody opens detects nothing, which is exactly why budgets and alerts exist alongside continuous monitoring rather than as a replacement for it.

- B is wrong: Whether the dashboard is opened has nothing to do with whether its tags or underlying data are correctly configured; the two are unrelated facts.
- C is wrong: A calculator estimates cost before something is built; it is not a substitute for observing what has actually happened to a running estate.
- D is wrong: Correct data collection with no one looking at it provides no warning to anyone; being technically correct is not the same as being watched.

### 9.

A finance dashboard shows only a single monthly total for the whole account. What does that coarse granularity hide from view?

- **A.** Which access tier each stored object currently sits in.
- **B.** A three-day spike within the month, which daily or hourly data would show immediately.
- **C.** Whether a given transfer crossed a region boundary during the month.
- **D.** Nothing — a monthly total contains the same information as any finer granularity, just already summed.

**Answer: B.** Granularity is the design decision that determines what monitoring can show: a monthly total hides a three-day spike that daily data would surface immediately, which is why providers expose cost and usage data at daily, sometimes hourly, resolution.

- A is wrong: Storage tier is a property tracked by the storage service itself, not something a coarser or finer cost-report granularity would reveal either way.
- C is wrong: Whether a transfer crossed a region is a routing fact tracked by the transfer service, not something the time granularity of a cost report changes.
- D is wrong: Summing away time resolution is exactly what hides a spike; a total and a time series contain different information, not the same information at different scales.

### 10.

Data is uploaded into a cloud provider's storage service, then later read back out to the public internet. Which of those two transfers is billed?

- **A.** Only the inbound upload, since storage services meter and charge for whatever volume of data they physically receive from a client.
- **B.** Only the outbound read; inbound transfer is generally free, and reading your own data back out is egress like any other transfer.
- **C.** Neither, as long as both transfers stay within a monthly free allowance on the account.
- **D.** Neither — the meter tracks only total volume moved in either direction and does not distinguish inbound from outbound at all.

**Answer: B.** Providers price the asymmetry plainly: data entering the network is generally free while data leaving is billed per gigabyte, and reading your own stored data back out to the internet is egress like any other outbound transfer.

- A is wrong: Storage services bill for holding data over time, not for receiving it — ingress itself is generally free across the major providers.
- C is wrong: A free allowance only covers volume up to its own limit; it does not change which direction of transfer is metered once that limit is exceeded.
- D is wrong: The asymmetry is exactly directional: outbound is billed per gigabyte while inbound is generally free, which is the point this concept tests.

### 11.

On Azure, a service in one North America region reads several terabytes from another North America region in the same month, while a separate copy of that data is read by an application outside Azure over the public internet. Which transfer is priced lower on Azure's own published rates, and is that pattern safe to assume on every provider?

- **A.** Whichever transfer runs on a spot instance, since spot pricing carries a built-in data-transfer discount that applies to whatever the instance sends.
- **B.** Whichever transfer touches a tagged resource, since cost-allocation tags mark traffic for a preferential rate on the data-transfer meter.
- **C.** The inter-region transfer is priced lower at this volume on Azure's published North America rates, but the pattern is not a safe assumption to carry to other providers.
- **D.** Both are priced identically, since egress is metered purely by the volume of data moved and takes no account of where that data is going.

**Answer: C.** Egress is metered by volume and banded by destination: on Azure's published rates, transfer between North America regions is $0.02 per gigabyte against $0.08 and up for internet egress, and same-region transfer is free. The ordering is not universal even within that table — internet egress grants a free first 100 GB that inter-region traffic does not, and from South America inter-region transfer is dearer than internet egress via the transit ISP network — so carrying the pattern to another provider unchecked is exactly the assumption this concept warns against.

- A is wrong: Spot is a compute purchase option and carries no data-transfer discount of its own; the two meters are entirely unrelated.
- B is wrong: Tags are metadata used for attribution and policy; they carry no billing discount for the data-transfer meter itself.
- D is wrong: Egress is metered by volume, but it is also banded by destination — internet-bound and inter-region traffic are priced differently, not identically.

### 12.

Which instrument is built to answer 'what will this architecture cost, before any of it is built'?

- **A.** Cost monitoring, since it reports the actual spend once the architecture is running.
- **B.** A pricing calculator, since it estimates cost from a proposed configuration before deployment.
- **C.** A budget alert, since it flags spend as soon as it crosses a defined threshold.
- **D.** The free tier, since spending nothing during the allowance answers the question by direct observation.

**Answer: B.** Cost monitoring and budgets both report or police money that is already being spent. A pricing calculator is the only instrument here that operates before anything exists, which is the discrimination this question is built on.

- A is wrong: Monitoring reports money already spent on something that exists; it cannot answer a question about a configuration that has not been built yet.
- C is wrong: A budget alert reports against actual or forecast spend once a target and a real account exist; it does not model a hypothetical architecture in advance.
- D is wrong: The free tier still requires building something to consume it, and it is an allowance rather than an estimation tool — it says nothing about cost beyond that allowance.

### 13.

An account exceeds its free-tier allowance mid-month, and a payment method is already on file. What happens to the exceeded portion?

- **A.** A budget alert fires automatically, since crossing an allowance is the same thing as crossing a spend threshold.
- **B.** The resource becomes an orphan until someone reattaches a valid payment method.
- **C.** The resource is suspended automatically until the following month's allowance resets.
- **D.** It starts billing silently at the standard rate; nothing about exceeding the allowance stops the resource.

**Answer: D.** Allowances are metered like any other consumption. On an account with a payment method attached, exceeding one does not stop the resource — it silently starts billing at the standard rate, which is why the allowance needs active tracking rather than passive trust.

- A is wrong: An allowance and a configured budget threshold are separate instruments; crossing the free-tier limit does not by itself trigger a budget notification.
- B is wrong: An orphaned resource has no purpose left at all; this resource is still doing its intended job, just at a rate that is no longer free.
- C is wrong: Suspension on allowance exhaustion is not how any of the free-tier shapes behave when a payment method is attached; billing continues rather than the resource pausing.

### 14.

A team describes the three compute purchase options in relation to pay-as-you-go billing. Which of these statements about that relationship is correct?

- **A.** Pay-as-you-go is a fourth purchase option, alongside on-demand, reserved and spot.
- **B.** Reserved pricing converts the spend into a capital purchase, since a multi-year term is being paid for.
- **C.** Reserved and spot are both discounts off the on-demand price, and on-demand is itself the pay-as-you-go baseline priced with no commitment.
- **D.** Spot pricing does not use pay-as-you-go billing at all, since its price is set by a live auction between competing customers rather than by a meter.

**Answer: C.** Pay-as-you-go is the meter every purchase option is billed against: on-demand is that meter at full price, and reserved and spot are discounts off it in exchange for a term commitment or an interruption risk respectively.

- A is wrong: Pay-as-you-go is the account's default billing behaviour, not a fourth item on a menu of purchase options it prices.
- B is wrong: A reservation is still a rented service, not an owned asset — it buys a rate, not a machine, so it does not become a capital expenditure.
- D is wrong: Spot capacity is still metered consumption billed under the same measured-service principle; only its price-setting mechanism differs from on-demand, and it is not an auction either.

### 15.

A stateful job cannot checkpoint fast enough to survive spot interruption on Azure or Google Cloud, but the same job could survive interruption on AWS. What explains the difference?

- **A.** There is no real difference — all three providers give the same interruption notice, so checkpoint speed alone explains the job's survival.
- **B.** AWS gives a two-minute interruption notice before reclaiming a Spot Instance; Azure Spot VMs and Google Cloud Spot or preemptible VMs instead give roughly thirty seconds.
- **C.** AWS's autoscaling reacts faster than Azure's or Google's, giving the job more time regardless of notice length.
- **D.** AWS waives egress charges specifically on spot reclamation events, giving the job effectively more time to finish persisting its state to another region.

**Answer: B.** AWS terminates, stops, or hibernates a Spot Instance after a two-minute interruption notice, with an earlier rebalance-recommendation signal. Azure Spot VMs and Google Cloud Spot or preemptible VMs instead evict with roughly thirty seconds' best-effort notice and no hibernate option — the mechanics are provider-specific, not a shared standard.

- A is wrong: The interruption notice is provider-specific, not a shared spot or preemptible standard, and stating it as universal is the exact generalisation this concept warns against.
- C is wrong: Autoscaling reacts to load, not to an eviction signal, and has no bearing on how much warning a job receives before spot reclamation.
- D is wrong: Egress pricing and interruption notice length are unrelated meters; nothing about an egress charge changes how much warning a job gets.

### 16.

A queue-driven worker fleet processes jobs that can be safely re-queued if interrupted. Behind it sits a 24/7 primary database that needs a steady, predictable baseline for at least two years. Which pairing of purchase option to workload is correct?

- **A.** Spot for the worker fleet, and reserved for the database's steady baseline.
- **B.** On-demand for both, since neither workload's cost can be estimated in advance without it.
- **C.** Reserved for the worker fleet, since a term commitment guarantees the cheapest price regardless of interruption risk.
- **D.** Spot for both, since spot is simply a smaller, rightsized version of on-demand capacity.

**Answer: A.** Matching a workload to a purchase option turns on what it can tolerate, not on price alone: the worker fleet tolerates interruption and belongs on spot, while the database's steady, long-lived baseline is exactly what a reserved commitment is priced for.

- B is wrong: Cost estimation before deployment is a pricing calculator's job and has nothing to do with which purchase option fits a workload's tolerance for interruption or commitment.
- C is wrong: Reserved buys price with a loss of flexibility, not with immunity from interruption; nothing about a term commitment suits work that is fine being interrupted.
- D is wrong: Spot is a discount tied to interruption risk on the same instance types as on-demand, not a smaller size — sizing is a separate, unrelated practice.

### 17.

A cost report shows a line with no corresponding running workload: an unattached disk left behind when its virtual machine was deleted. Is this an orphan or a rightsizing candidate, and what follows from that?

- **A.** A rightsizing candidate — an unattached disk is simply oversized for its current use and should be resized down.
- **B.** Neither — without an owner tag on the disk, no action can be taken on it at all.
- **C.** An orphan; it serves no purpose at all, so the correct action is deletion, not resizing.
- **D.** It stopped billing once its virtual machine was deleted, so no action is needed either way.

**Answer: C.** An orphan and a rightsizing candidate are told apart by whether the resource still has a purpose: the orphan has none and the answer is deletion, while a rightsizing candidate still serves a purpose at the wrong size and the answer is resizing.

- A is wrong: Rightsizing applies to a resource that still serves a real purpose at the wrong size; this disk has no purpose left at all, so resizing is the wrong lever entirely.
- B is wrong: A missing tag makes finding the owner harder, but it does not block deletion once inventory evidence — attachment state and last activity — confirms the disk has no purpose.
- D is wrong: Deleting a virtual machine does not delete its disks by default on Azure, where they persist in the resource group and keep billing on their own meter until somebody removes them deliberately.

### 18.

To cut costs, an engineer detaches an idle disk from its virtual machine but does not delete it. How much money does that detachment save?

- **A.** The egress charge for the disk's most recent read, since detaching stops any further data transfer.
- **B.** Nothing, since storage bills for existing, not for being attached or read.
- **C.** Most of the storage rate, since detached storage bills at a reduced idle rate compared to attached storage.
- **D.** The full per-gigabyte-month rate is waived once a disk is detached, since it is no longer serving a workload.

**Answer: B.** Detaching a volume saves nothing at all: an unattached disk bills the same per gigabyte-month as an attached one, because storage is charged for existing, not for being read or connected. Only deletion stops the charge.

- A is wrong: Egress bills for data leaving the network during a transfer, not for detaching a disk, which involves no data movement at all.
- C is wrong: There is no discounted idle rate for a merely-detached disk; it bills at the same per-gigabyte-month rate as when it was attached.
- D is wrong: An unattached disk bills exactly the same per gigabyte-month as an attached one; whether it serves a workload has no bearing on the storage meter.

### 19.

Which kind of evidence is used to find an orphaned resource, as distinct from a rightsizing candidate?

- **A.** Inventory: attachment state, last activity, and owner tag, rather than utilisation telemetry.
- **B.** Telemetry — CPU, memory and IOPS utilisation measured against provisioned capacity.
- **C.** A cost-monitoring dashboard's trend line, since any rising bill is a reliable signal of an orphan.
- **D.** A tagging standard's enforcement log, since any untagged resource is necessarily an orphan.

**Answer: A.** Rightsizing and orphan-hunting use different evidence: rightsizing compares utilisation telemetry against provisioned capacity, while finding an orphan means querying inventory for attachment state, last activity and owner tags, because an orphan produces no telemetry signal at all.

- B is wrong: Telemetry against provisioned capacity is what finds a rightsizing candidate, a resource that still has a purpose but the wrong size, not a resource with no purpose left.
- C is wrong: A rising bill can have several causes, only one of which is an orphan appearing; a trend line alone does not identify which cause applies.
- D is wrong: An untagged resource is more likely to become an orphan, but the missing tag alone is not proof that a specific resource has no purpose — inventory evidence is still required.

### 20.

An administrator stops a virtual machine in the Azure portal and expects the compute meter to stop immediately. Support explains that billing has continued. Which state is the machine most likely still in?

- **A.** Stopped (allocated), since the underlying hardware lease has not been released and only deallocation does that.
- **B.** It was switched from on-demand to reserved pricing, which is billed on a different schedule than a stopped machine.
- **C.** The disk became orphaned the moment the machine stopped, and orphan billing is what is being observed.
- **D.** Stopping any virtual machine, on any provider, always halts its compute meter immediately.

**Answer: A.** Pay-as-you-go bills provisioned capacity, and stopping a VM does not always release that provision. Azure specifically distinguishes Stopped (allocated), which keeps billing, from Stopped (deallocated), which releases the hardware lease and stops the meter.

- B is wrong: Purchasing option is unrelated to why a stopped machine keeps billing; that is governed by allocation state, not by on-demand versus reserved pricing.
- C is wrong: The trap here is simpler: a merely-stopped machine is not an orphan at all, since it still has an owner and a purpose, and no deletion has occurred.
- D is wrong: True on some platforms but not universally — Azure specifically continues billing a merely-stopped VM until it reaches the deallocated state.

### 21.

One clean sentence is supposed to separate pay-as-you-go from on-demand pricing. Which sentence is it?

- **A.** On-demand is the charging principle; pay-as-you-go is simply one purchase option chosen among several.
- **B.** Pay-as-you-go is the charging principle; on-demand is the specific no-commitment purchase option priced under it, and the baseline reserved and spot are discounted from.
- **C.** Pay-as-you-go is a total-cost calculation performed once per project; on-demand is a single recurring line item counted within that larger calculation.
- **D.** They are two names for exactly the same thing, so the distinction between them is purely terminological and safe to ignore in practice.

**Answer: B.** Pay-as-you-go is the charging principle and the undiscounted baseline every price in this competency is quoted against; on-demand is the specific purchase option that implements it with no commitment.

- A is wrong: This reverses the relationship — pay-as-you-go is the account's default billing behaviour, not one item on a menu of purchase options.
- C is wrong: Total cost of ownership is the calculation that aggregates full cost across categories; pay-as-you-go is a billing principle, not that calculation.
- D is wrong: One names a charging principle and the other a specific purchase option priced under it; treating them as synonyms misses the level each operates at.

### 22.

A virtual machine idles at 2% CPU for an entire month under pay-as-you-go billing. How does its cost compare to the same machine running at 100% CPU the whole month?

- **A.** Identical, because the meter counts provisioned, running capacity, not utilisation.
- **B.** Lower, because rightsizing automatically detects the 2% load and bills only that share.
- **C.** Lower, because autoscaling would already have shrunk the instance in response to the low load.
- **D.** Lower, because 'pay only for what you use' means paying for work performed rather than capacity held.

**Answer: A.** A virtual machine running at 2% CPU costs exactly what the same machine costs at 100%: the meter counts provisioned, running capacity, not work performed, which is precisely why rightsizing and orphaned resources cost money at all.

- B is wrong: Rightsizing is a deliberate periodic review a human performs; the meter itself does no automatic detection or partial billing.
- C is wrong: Autoscaling changes how many units run in response to live traffic; a single idling instance sitting at 2% is not itself evidence that autoscaling applies or has acted.
- D is wrong: That phrase is routinely misread this way, and the misreading is the single most expensive misunderstanding on a cloud invoice — the meter counts provisioned capacity, not work done.

### 23.

Why is an untagged resource described as the enabling gap beneath every other cost-control practice in this competency?

- **A.** Because a budget cannot be created at all for any resource or set of resources that has not first been tagged and registered.
- **B.** Because cost-monitoring dashboards are built to refuse displaying any resource that arrives without a complete set of tags attached.
- **C.** Because untagged resources are automatically billed by the provider at a higher per-unit rate than equivalent tagged ones.
- **D.** Because chargeback, showback, budgets and orphan-hunting are all attribution questions before they are cost questions, and an untagged resource has no attributable owner.

**Answer: D.** Tagging is the enabling control beneath every other practice in this section: without it a bill is a list of service totals with no owner, and no per-team budget, chargeback, showback or orphan hunt is possible, because all four are attribution questions before they are cost questions.

- A is wrong: A budget can be scoped to an account or service with no tag involved at all; tagging refines scope, it does not gate whether a budget can be created.
- B is wrong: Monitoring dashboards display whatever inventory exists, tagged or not; a missing tag makes attribution harder, not the resource invisible to monitoring.
- C is wrong: Tags are metadata for attribution and carry no effect on the rate a resource is billed at; the cost impact of missing tags is entirely indirect.

### 24.

One team's spend is split across three separate cost-report lines because resources were labelled env, Env, and Environment interchangeably over time. What actually fixes this?

- **A.** A retrospective monthly sweep that merges whichever tag keys happen to appear that month.
- **B.** Three separate budgets, one scoped to each of the three key variants.
- **C.** Nothing needs to change, since cost-allocation reporting automatically recognises and merges near-identical tag keys on its own.
- **D.** A written tagging standard enforced at creation time, so one consistent key is used across the estate going forward.

**Answer: D.** Consistency is the entire game for tagging: env, Env and Environment are three unrelated keys that split one team's spend three ways, so a written standard enforced at creation time is far more reliable than a retrospective cleanup sweep.

- A is wrong: A retrospective sweep treats the symptom repeatedly rather than preventing new inconsistent keys from being created going forward.
- B is wrong: Three budgets working around the split is a workaround at the reporting layer, not a fix, and leaves the underlying attribution problem in place.
- C is wrong: Case and spelling variants are unrelated keys as far as the billing system is concerned; nothing merges them automatically, which is exactly why the split happened.

### 25.

A database instance runs at 4% CPU all month but is still serving live production queries. What is the correct action?

- **A.** Resize it to a smaller instance and re-measure; the resource is wanted, only its size is wrong.
- **B.** Delete it, since a resource this underused has no purpose left.
- **C.** Leave it alone and let autoscaling shrink it automatically as load drops further.
- **D.** Detach and reattach its storage volume, since that resets the meter to reflect true utilisation.

**Answer: A.** Rightsizing matches provisioned capacity to measured demand for a resource that is genuinely wanted, which distinguishes it from deletion, for a resource with no purpose left, and from autoscaling, which changes count rather than size.

- B is wrong: Deletion is for a resource with no purpose left; this one is actively serving production queries, so deleting it would remove something still in use.
- C is wrong: Autoscaling changes how many units run in response to live load; it does not resize a single provisioned unit's capacity, which is a deliberate periodic decision.
- D is wrong: Detaching and reattaching a volume changes nothing about billing, which is charged for provisioned capacity regardless of attachment state.

### 26.

A scenario describes capacity that grows and shrinks automatically, minute by minute, in direct response to live traffic. Which cost practice is actually being described?

- **A.** Autoscaling, the practice that changes how many units run automatically in response to live load.
- **B.** Rightsizing — some vendor guidance folds live scaling into it, so the minute-by-minute description still qualifies.
- **C.** Orphan cleanup — capacity changing shape usually means unused resources are being found and removed.
- **D.** A configured budget action, since thresholds can be set to add or remove capacity automatically.

**Answer: A.** Autoscaling changes how many units run, automatically and continuously, in response to live load. Rightsizing changes how big each unit is, as a deliberate periodic review, so a scenario describing traffic-driven capacity change is autoscaling regardless of the label a question uses.

- B is wrong: Rightsizing is a deliberate, periodic human decision about size; folding in automatic, continuous count changes is exactly the confusion this concept keeps separate for exam purposes.
- C is wrong: Orphan cleanup removes resources that serve no purpose at all; it does not describe capacity that is actively tracking live traffic.
- D is wrong: A budget action, when configured, typically denies further provisioning past a limit; it does not track live traffic minute by minute the way the scenario describes.

### 27.

A team collects one week of utilisation data that happens to exclude month-end close, then rightsizes a database down accordingly. What is the likely outcome?

- **A.** Nothing goes wrong, since cost monitoring would have already caught any peak the exercise missed.
- **B.** The database is undersized for the peak the observation window missed, turning the resize into a performance incident at month-end.
- **C.** The database automatically moves to a colder storage tier once it is resized.
- **D.** Sizing to one representative week of data is sufficient, since rightsizing is treated as a one-time project rather than an ongoing, iterative one.

**Answer: B.** The observation window is the part of rightsizing usually got wrong: a week that misses month-end close, payroll, or a seasonal campaign recommends a size that fails the first time those arrive, converting a cost problem into a performance incident.

- A is wrong: Monitoring reports spend and trend after the fact; it does not itself catch a flawed observation window before a resize decision is made from it.
- C is wrong: Storage tiering is a separate mechanism governing object storage cost classes and is not a consequence of resizing compute capacity.
- D is wrong: Rightsizing is iterative rather than a one-time project, because both the workload and the provider's instance catalogue keep changing — treating one week as sufficient is the trap.

### 28.

A team must decide both which storage type to use for a new dataset and which access tier to place it in. Which decision comes first, and why?

- **A.** Tier first — the intended access tier determines whether the data should be addressed as objects, as blocks, or as files, so the type follows from it.
- **B.** Neither first — both should be settled together, as a single combined rightsizing exercise covering compute capacity and storage placement alike.
- **C.** Storage type first — tiers and lifecycle rules are features inside a service already chosen, and each service exposes its own API, so changing type later means migrating data and repointing applications.
- **D.** Order does not really matter here, since a tier change and a storage-type change are, in practice, about equally easy to reverse once the data is in place.

**Answer: C.** The separating axis is which question is being answered: object, block and file storage names how data is addressed, decided first, while tiers and lifecycle policies name what it costs to keep and retrieve data already stored that way, decided after and revisited continuously.

- A is wrong: Tiers are a cost and access-latency class inside a storage service already chosen; they do not determine how data is addressed to begin with.
- B is wrong: Rightsizing is a compute-capacity practice about matching provisioned size to demand; storage type and tier are a separate decision pair with their own axis.
- D is wrong: A tier change or lifecycle rule keeps the data's address and interface intact, while a storage-type change moves it to a service with a different API and access protocol — the two are not equally reversible.

### 29.

A monitoring system needs to read a log file under a strict low-latency requirement. The file currently sits in the archive tier. What must happen before it can be read?

- **A.** Nothing — cost monitoring will surface and satisfy the read request automatically the moment it is made.
- **B.** Nothing beyond paying the ordinary egress charge for reading the file back out to wherever it is needed.
- **C.** It can be read immediately, just more slowly than from the hot tier.
- **D.** It must be rehydrated to an online tier first, a process measured in hours, so archive is unsuitable for this requirement regardless of price.

**Answer: D.** Archive is offline: a blob in archive cannot be read or modified until it has been rehydrated to an online tier, which takes hours. It is not merely a slower hot tier, so nothing with a latency requirement can be placed there regardless of price.

- A is wrong: Cost monitoring reports spend after the fact; it has no role in making an offline archived blob readable.
- B is wrong: An egress charge is a cost incurred by the read; it is not a substitute for the rehydration step archive requires before any read can occur at all.
- C is wrong: Archive is not simply a slower hot tier — it is offline, and no read succeeds at all until the rehydration step finishes.

### 30.

Data is moved to the archive tier to save money, then deleted after 45 days when the project is cancelled early, against a 180-day minimum retention period. What happens to the bill?

- **A.** Nothing extra — early deletion charges are waived once a project is formally cancelled.
- **B.** The data becomes an orphan once the project ends, and is billed at whatever rate applies to orphaned resources until someone notices.
- **C.** The bill simply stops, since deleting data always ends its charges immediately.
- **D.** An early deletion charge applies for the remaining 135 days, which can make the move cost more than leaving the data where it was.

**Answer: D.** Each transition is a billable operation, and moving data into a colder tier starts a minimum-retention clock: deleting or promoting the data before that clock expires incurs the remaining days as an early deletion charge, which is why aggressive tiering can raise rather than lower the bill.

- A is wrong: No exception for project cancellation is documented; the retention clock runs to term regardless of the business reason the data is being removed.
- B is wrong: An orphan is a resource with no purpose left and carries no separate billing rate of its own; this data's issue is a specific early deletion charge, not orphan status.
- C is wrong: Each transition and deletion is itself a billable event under a minimum-retention tier; deleting archived data early adds a charge rather than simply ending one.

### 31.

A comparison sets a monthly cloud bill against an on-premises server's purchase price alone, and concludes cloud is more expensive. What is missing from the on-premises side of that comparison?

- **A.** Nothing — CapEx and OpEx figures are already directly comparable numbers.
- **B.** Staffing, power and cooling, floor space, and the hardware-refresh cost that a bare purchase price omits.
- **C.** A budget threshold that would have flagged the discrepancy automatically.
- **D.** Nothing is missing at all; a server's purchase price already represents the entire cost of owning and running it.

**Answer: B.** Total cost of ownership is the full cost of delivering a capability, not just the invoice or sticker price. A comparison that sets a cloud bill against a bare purchase price is a TCO error because it drops the staffing, power and hardware-refresh costs the on-premises side still carries.

- A is wrong: CapEx and OpEx are different accounting treatments of spend, not a substitute for costing the full set of expenses on each side of a comparison.
- C is wrong: A budget alert notifies when spend already crosses a configured threshold; it does not supply missing cost categories in a one-off comparison exercise.
- D is wrong: This is precisely the error total cost of ownership exists to catch: a purchase price silently drops staffing, power and refresh costs that only one side of the comparison carries.

