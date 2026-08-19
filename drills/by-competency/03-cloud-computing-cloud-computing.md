<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Cloud Computing Fundamentals :: Cloud Computing

56 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A company virtualizes its entire datacentre and now runs several hundred VMs, but any new VM still requires a ticket a human approves within two working days. Business units are billed a flat internal rate regardless of how much they use. Is this cloud computing?

- **A.** Yes — running many isolated VMs on shared physical hosts is the resource pooling NIST asks for, and pooling is the characteristic that decides the question.
- **B.** No. Without on-demand self-service and measured service, virtualizing the hardware alone does not satisfy NIST's definition.
- **C.** No, because NIST reserves the term for infrastructure a cloud provider owns, and hardware a company bought for itself can never qualify.
- **D.** Yes — billing business units for what they use is measured service, and measured service is the characteristic the definition actually turns on.

**Answer: B.** NIST SP 800-145 requires all five essential characteristics before an environment counts as cloud computing. Here, provisioning needs a two-day human approval (no on-demand self-service) and billing is a flat rate rather than metered usage (no measured service). Virtualization is the enabling technology beneath many clouds, but its presence alone — without the self-service, elastic, metered delivery model — does not make an environment a cloud.

- A is wrong: Pooling VMs on shared hosts is virtualization, the enabling technology; NIST requires all five characteristics, and self-service and metering both fail here.
- C is wrong: Ownership decides nothing here — a self-service, metered private cloud on owned hardware still qualifies; this environment fails on process, not ownership.
- D is wrong: Internal chargeback is not the same as usage-based metering, and neither substitutes for the self-service and elasticity NIST requires.

### 2.

A team argues: 'This offering can't be cloud computing because there is no virtual machine involved — customers only invoke short-lived functions and are billed per invocation.' Is the team's reasoning correct?

- **A.** Yes — without virtualization creating an isolated VM per customer, there is no resource pooling and therefore no cloud, since pooling is the one characteristic that cannot be met any other way.
- **B.** Yes — function-based per-invocation billing is a serverless pricing pattern rather than cloud computing in NIST's sense.
- **C.** No — NIST's definition does not require a VM; bare-metal instances, containers and functions are all valid cloud services as long as the five characteristics hold.
- **D.** No, but only because the provider also happens to offer a separate IaaS product alongside the function service.

**Answer: C.** Cloud computing is a delivery model, not a technology, and nothing in NIST's definition names virtualization, containers or any particular vendor. Bare-metal instances, containers and functions are all cloud services in their own right provided the five characteristics — on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service — hold. Requiring a VM is exactly the false equivalence the guide warns against, just approached from the opposite direction.

- A is wrong: Resource pooling does not require a customer-facing VM; a provider can pool bare-metal or container capacity just as well.
- B is wrong: Serverless and FaaS are themselves cloud service categories; billing per invocation is measured service in action, not evidence against being cloud.
- D is wrong: Whether IaaS is also offered is irrelevant; the function service qualifies or fails on its own characteristics, not by association with another offering.

### 3.

A hospital builds a private, self-service platform on its own hardware: clinical teams provision virtual capacity instantly through a portal, usage is metered per department, and capacity scales automatically with load. An auditor claims 'this can't be cloud computing — the hospital owns the hardware.' Evaluate the claim.

- **A.** The claim is right, because true cloud computing requires a third-party provider operating shared, virtualized infrastructure.
- **B.** The claim is wrong — cloud computing is defined by the delivery model, not by who owns the underlying hardware, and this platform meets the essential characteristics.
- **C.** The claim is right, because only public cloud infrastructure counts under NIST's model, and a platform confined to one hospital's own staff is not public by any reading.
- **D.** The claim is right, because on-premises hardware can never be billed by consumption — only depreciated as a capital asset over its service life.

**Answer: B.** Cloud is a way of selling and consuming capacity, not a statement about who owns the building or the racks. A private cloud run by the organisation itself on its own hardware still satisfies NIST's definition provided the five essential characteristics — including self-service, elasticity and measured service — actually hold, exactly as this hospital's platform does.

- A is wrong: Virtualization and third-party operation are common, not required; a private cloud on owned hardware satisfies the same definition.
- C is wrong: NIST names private cloud as one of its own deployment models; it is not excluded from being cloud computing.
- D is wrong: Metering is a property of how usage is tracked and charged, not of where the hardware physically sits.

### 4.

Are actions taken through a cloud provider's web console audit-logged the same way as actions taken through its CLI or API?

- **A.** No — console actions leave no record at all, which is precisely why infrastructure as code is treated as the more auditable approach.
- **B.** Yes: on the major providers, console actions are logged by default alongside CLI, SDK and API actions; what the console lacks is a reviewable artifact, not an audit trail.
- **C.** Yes, but only if the customer explicitly enables logging for the console specifically, since browser sessions sit outside the API audit path by default.
- **D.** No, because only infrastructure-as-code changes are recorded as auditable events, the provider logging the plan a tool applies rather than the underlying call.

**Answer: B.** AWS CloudTrail records actions taken by a user, role or service, explicitly including actions in the Management Console as well as the CLI, SDKs and APIs, with 90 days of Event history available automatically; Azure and Google Cloud provide equivalent always-on logging. Console work is therefore recorded — what it lacks is an artifact you can review before it runs, re-run identically, or diff against a prior state.

- A is wrong: This is the routine misstatement the guide corrects: console work is recorded by default; what it lacks is an artifact you can review before it runs, re-run identically, or diff against last week.
- C is wrong: Baseline audit logging on the major providers is on without configuration — CloudTrail Event history is available as soon as an account is created, and Azure Monitor 'collects activity log entries by default with no required configuration' — and the console is a client of the same API, not a separate path.
- D is wrong: All four interfaces are clients of the same API and are logged the same way; infrastructure as code's advantage is a declarative artifact to review, not exclusive access to audit logging.

### 5.

A resource is deleted by hand through the web console, and a week later nobody can reconstruct exactly what state existed before the change or reproduce the fix reliably. What property of infrastructure as code, missing from the console, would have prevented this?

- **A.** Being audit-logged, since the console action itself left no record of who made the change or when, provider audit logs covering only calls made through the API.
- **B.** Being reachable over the network — the console requires an interactive browser session rather than the scriptable connection a recovery process could re-run.
- **C.** A declarative statement of desired state held in version control, reviewable before it is applied and comparable against reality so drift can be detected and corrected.
- **D.** Running under the shared responsibility model, which the console is exempt from because interactive changes fall outside the provider's side of the security boundary.

**Answer: C.** The CLI and API are imperative — a script states an action to take, not a state that should exist — so even they offer no guaranteed baseline to compare against. Infrastructure as code adds a declarative desired state held in version control: reviewable before applying, re-runnable identically, and comparable against live reality so that drift, including an unreviewed console deletion, can be detected and corrected.

- A is wrong: The console action would have been recorded by the provider's default audit logging just as thoroughly as a CLI or API call; the missing property is a reviewable, re-runnable artifact, not a log entry.
- B is wrong: Network reachability is unrelated to the problem described; both the console and infrastructure as code operate over the network, and reachability was never in question.
- D is wrong: The shared responsibility model applies uniformly regardless of which interface makes a change; it has no bearing on whether a change is reviewable or reproducible.

### 6.

AWS's prescriptive guidance names seven migration strategies, the '7 Rs.' Which term does AWS actually use for replacing an application with a different product, typically SaaS, rather than migrating the existing one?

- **A.** Replace — the customer swaps the application for a different product entirely.
- **B.** Relocate — the workload moves to the cloud without changing its architecture.
- **C.** Repurchase — also called drop and shop.
- **D.** Refactor — the application is rebuilt around cloud-native patterns.

**Answer: C.** AWS's prescriptive guidance names the seven strategies as retire, retain, rehost, relocate, repurchase, replatform, and refactor or re-architect. Repurchase — sometimes called drop and shop — is specifically the strategy of replacing an application with a different product or version, typically SaaS; 'replace' is not the term AWS uses, and this guide corrects that exact error.

- A is wrong: 'Replace' is not one of the seven strategies AWS names; the strategy for swapping an application for a different product is repurchase, which AWS also calls drop and shop.
- B is wrong: Relocate specifically leaves the application's architecture untouched; it does not involve swapping the application for a different product.
- D is wrong: Refactor rebuilds the existing application for the cloud; it does not describe dropping the application in favour of a different product.

### 7.

A large migration programme deliberately avoids refactoring any application during the move itself, planning to modernise afterward instead. Which strategies does AWS recommend favouring during the migration, and why not refactor now?

- **A.** Rehost, replatform, relocate and retire are the common strategies for large migrations; refactoring during the move is the most complex and costly strategy and is hard to manage across many applications at once.
- **B.** Repurchase alone should be used for every application, since it is the fastest of the seven strategies and the only one that leaves nothing running in the source environment.
- **C.** Refactor should still be used first, since it is the strategy AWS calls the quickest way to migrate and operate in the cloud, the architecture then only being rebuilt once.
- **D.** Retain and retire should never appear in a large migration plan, since every application must eventually move to the cloud and a portfolio assessment only decides the order in which they are moved.

**Answer: A.** AWS notes that common strategies for large migrations are rehost, replatform, relocate and retire, and recommends against refactoring during the migration itself, since modernising while moving is the most complex option and hard to manage across many applications — the recommended sequence is to migrate cheaply first with one of the low-effort strategies, then modernise afterward once the workload is safely running in the cloud.

- B is wrong: AWS names relocate, not repurchase, as the quickest strategy, and using one strategy for every application ignores that each workload is assessed and assigned individually.
- C is wrong: AWS reserves 'quickest' for relocate specifically, because it leaves the application's architecture untouched; refactor is the strategy AWS calls the most complex and costly, the opposite of quick.
- D is wrong: AWS lists retire and retain as legitimate strategies in their own right; a portfolio assessment that retires an unused application or retains one with a hardware dependency avoids unnecessary migration cost entirely.

### 8.

A platform team must place three workloads: a vendor appliance shipped only as a Windows disk image on an all-Linux estate; a stateless HTTP service redeployed forty times a day; and a workload processing another customer's regulated data where the strongest available isolation boundary is required. Match each to a container or a VM, and identify the one common thread underneath all three.

- **A.** All three should run as VMs, since a foreign OS kernel and strong isolation are both container limitations that only VMs solve, and a stateless service redeployed many times a day gains nothing measurable from a container's faster start or its higher density on one host.
- **B.** The HTTP service running in containers means no virtual machines are involved anywhere in this platform — a managed container service schedules containers straight onto bare-metal hosts the provider owns.
- **C.** The appliance and the regulated workload need VMs, for a foreign kernel and the strongest isolation boundary respectively, while the HTTP service is a good fit for containers; underneath all three, even the containerised one, sits a hypervisor the platform team never manages directly.
- **D.** The regulated workload should be containerised specifically because containers isolate more strongly than virtual machines, since one shared kernel enforces separation in a single place rather than across many guest kernels.

**Answer: C.** The Windows appliance needs its own kernel, which only a VM supplies; the regulated workload needs the strongest boundary available, which is a VM's own kernel rather than a shared one; the frequently redeployed stateless service benefits from a container's start time and density, with no foreign-kernel or heightened-isolation requirement working against it. All three still sit on a type 1 hypervisor the provider operates, whether or not the workload itself is containerised.

- A is wrong: The HTTP service has no foreign-kernel or heightened-isolation requirement; forcing it onto a VM gains nothing and gives up the start-time and density advantage a stateless, frequently redeployed service benefits from.
- B is wrong: On a managed platform, containers still run atop provider-operated virtual machines; choosing containers does not remove virtualization from the picture, only from what the team administers directly.
- D is wrong: This reverses the actual isolation ordering; a shared host kernel gives containers a weaker boundary than a VM's own kernel, which is exactly why the regulated workload calls for a VM instead.

### 9.

A team says 'containers are lightweight, so we should containerise everything and stop paying for virtual machines.' What mechanism does that slogan skip over?

- **A.** The isolation cost — because containers share the host kernel, a kernel-level flaw has a blast radius covering every container on that host, which the slogan does not price in.
- **B.** The mechanism it skips is that containers cannot run on shared physical hardware, unlike virtual machines, so the density the slogan claims is only ever available from a hypervisor.
- **C.** It skips over the fact that containers are always more expensive per workload than virtual machines — each container image carries a full copy of the operating system it needs to boot.
- **D.** It skips over the fact that virtual machines cannot run on public cloud infrastructure at all, so the choice only arises for teams still running their own datacentre.

**Answer: A.** 'Lightweight' describes density and start time honestly, but it says nothing about the isolation boundary being given up: because the kernel is shared, administrators must constrain memory and CPU so one container cannot starve the rest, and a kernel-level compromise is not contained the way it would be inside a VM's own kernel. Picking containers for everything trades that boundary away without pricing the trade.

- B is wrong: Containers run on shared hardware routinely, and that density is the whole basis for the slogan; the actual gap is the isolation cost, not a hardware-sharing limitation.
- C is wrong: Containers typically cost less per workload precisely because the operating system overhead is shared rather than duplicated, and a container image packages the files a process needs rather than an operating system to boot.
- D is wrong: Virtual machines are the canonical IaaS product on every public cloud platform; nothing about the container-versus-VM choice excludes VMs from cloud infrastructure.

### 10.

What does the named comparison 'container vs virtual machine' refer to, as distinct from the concept 'virtual machine' on its own?

- **A.** It names the selection decision between two isolation technologies — which one to use for a given requirement — while 'virtual machine' names one of the two concrete things being selected between.
- **B.** They are the same concept under two names, since every virtual machine question is really a container-versus-VM question about which of the two technologies to select, and the two phrases are used interchangeably in practice.
- **C.** The comparison names a specific orchestration tool used to run containers on top of virtual machines, in the way a scheduler places workloads across a pool of hosts.
- **D.** The comparison applies only to on-premises infrastructure, while 'virtual machine' applies only to cloud infrastructure, so the two terms never appear in the same discussion.

**Answer: A.** 'Container vs virtual machine' names the requirements-to-choice decision itself — an axis, not a thing you can create. 'Virtual machine' names one of the two concrete options inside that decision, the kind of entity a definition or responsibility-boundary question would ask about directly. The same relationship holds between any comparison and either of its members.

- B is wrong: A question can ask purely 'what is a virtual machine' or 'who patches it' with no container involved at all; the comparison specifically concerns the choice between the two technologies.
- C is wrong: No orchestration tool is implied by either term; the comparison is a conceptual selection decision, not a piece of named software.
- D is wrong: Neither term is restricted to one setting — virtual machines and the choice between them and containers both apply equally on-premises and in the cloud.

### 11.

Which five properties does NIST SP 800-145 require before an environment counts as cloud computing?

- **A.** On-demand self-service, broad network access, multi-tenancy, rapid elasticity, and pay-as-you-go billing.
- **B.** On-demand self-service, virtualization, resource pooling, rapid elasticity, and high availability.
- **C.** On-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service.
- **D.** Broad network access, resource pooling, rapid elasticity, measured service, and vendor neutrality.

**Answer: C.** NIST SP 800-145 defines cloud computing through exactly five essential characteristics: on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service. Plausible-sounding substitutes — multi-tenancy, pay-as-you-go, virtualization, high availability — are each real, but none of them is one of the five itself.

- A is wrong: Multi-tenancy and pay-as-you-go are real properties, but NIST folds them inside resource pooling and measured service rather than listing them as separate characteristics.
- B is wrong: Virtualization and high availability are not among NIST's five; virtualization is an enabling technology and high availability is a design goal, not a defining characteristic.
- D is wrong: Vendor neutrality is not one of NIST's five characteristics at all, and this list also drops on-demand self-service entirely.

### 12.

An autoscaling group adds instances under load on Friday afternoon and removes them again over the weekend when traffic drops. Which essential characteristic does the weekend shrink specifically demonstrate?

- **A.** Rapid elasticity, since capacity scales inward as well as outward to match demand.
- **B.** Measured service — the bill only reflects instances actually running over the weekend.
- **C.** On-demand self-service — the system responds to demand without a human placing a request.
- **D.** Resource pooling — many customers share the underlying hardware the instances run on.

**Answer: A.** Rapid elasticity is often summarised as scaling up, but NIST's definition is symmetric: capacity must scale outward and inward to match demand. The autoscaling group growing on Friday and shrinking over the weekend is elasticity working in both directions, and the shrink is what lets measured service produce a smaller bill — a downstream effect, not the characteristic itself.

- B is wrong: That describes the billing consequence of running fewer instances, not the scaling behaviour itself, which is what the question asks about.
- C is wrong: Autoscaling does act without human intervention, but the property being tested here is the inward-and-outward scaling itself, not who or what triggers it.
- D is wrong: Pooling explains why the capacity exists to be requested at all, but it does not describe the scaling behaviour the weekend shrink illustrates.

### 13.

A company keeps regulated data in its own self-service, metered private cloud and bursts overflow batch processing into a public provider, joined by a private network link, shared identity and a common deployment pipeline so workloads can move between the two. Does this qualify as hybrid cloud under NIST, and what would be missing if the connective tissue were removed?

- **A.** Yes. Both parts are themselves clouds and are bound together by technology enabling data and application portability, which is exactly NIST's two-part test; without the connective tissue, it would be two separate estates rather than one hybrid cloud.
- **B.** No — using more than one deployment model at once is what defines multi-cloud, not hybrid cloud, and hybrid is reserved for two providers of the same kind.
- **C.** Yes, and the network link and shared identity are incidental details — placing workloads in two different clouds is sufficient on its own, whatever technology joins them, since NIST's composition clause is descriptive rather than a test of its own.
- **D.** No — hybrid cloud requires a public cloud and a community cloud specifically, not a private and a public cloud, which NIST classes as something else.

**Answer: A.** NIST's hybrid cloud definition has two conditions that must both hold: the components must each be a distinct cloud infrastructure, and they must remain bound together by technology enabling data and application portability between them, with cloud bursting given as the worked example. This scenario states both explicitly, and removing the network link, identity plane and deployment pipeline would strip out exactly the binding condition, leaving two separate estates rather than a hybrid cloud.

- B is wrong: This inverts the two terms: multi-cloud varies the vendor, usually within one deployment model; hybrid varies the deployment model and, unlike multi-cloud, requires the parts to be bound together.
- C is wrong: Placement alone is not sufficient; NIST's binding condition is a separate requirement, and removing the connective tissue would leave two separate estates rather than a hybrid cloud.
- D is wrong: NIST's composition may combine any of private, community or public; a private-plus-public pairing, as described here, is a valid and common hybrid arrangement.

### 14.

A retailer runs production on a public provider and keeps a completely separate analytics environment on a second public provider, with no network link, no shared identity and no data movement between them. Is this hybrid cloud?

- **A.** No — this is multi-cloud only, since no private or community cloud is involved and nothing binds the two providers together.
- **B.** Yes — using two different cloud providers for two different workloads is exactly what hybrid cloud means in everyday industry usage.
- **C.** Yes, because multi-cloud arrangements automatically qualify as hybrid once a second provider is added.
- **D.** No, because neither environment is a private cloud, and hybrid requires at least one private cloud specifically.

**Answer: A.** Two public providers running unrelated workloads with no link, shared identity or data portability between them satisfy the definition of multi-cloud and nothing about hybrid: no private or community cloud is involved, and there is no binding technology joining the parts. The industry often calls arrangements like this hybrid loosely, but NIST's stricter reading is what the exam expects.

- B is wrong: That is the loose industry usage the guide warns against; the exam-safe reading is NIST's stricter one, which this arrangement fails on both conditions.
- C is wrong: Adding a second public provider is the definition of multi-cloud, not a route into hybrid; hybrid needs a mix of deployment models and a binding condition that multi-cloud does not supply.
- D is wrong: NIST's composition allows private, community or public in any mix of two or more; the actual missing ingredient here is the binding condition, not the absence of a private cloud in particular.

### 15.

An engineer proposes calling an architecture 'hybrid cloud' because it uses both a self-hosted Kubernetes cluster — with no self-service provisioning, no metering and manual capacity planning — and a public cloud provider, connected by a VPN. Is the label accurate?

- **A.** Yes — connecting any on-premises infrastructure to a public cloud by VPN is what makes an architecture hybrid, whatever the on-premises side is capable of, and the VPN supplies the standardised technology the definition asks for.
- **B.** Yes, and this is better described as multi-cloud specifically, since two distinct platforms are involved and each is administered separately.
- **C.** Yes, because Kubernetes provides the portability layer NIST's binding condition requires — and that condition is the only one the definition imposes.
- **D.** No. The self-hosted cluster is not itself a cloud, since it lacks the essential characteristics such as self-service and metering, so there is only one cloud infrastructure in this picture, not the two or more NIST's composition requires.

**Answer: D.** Hybrid cloud requires two or more distinct cloud infrastructures, and 'cloud infrastructure' still means something meeting the essential characteristics — self-service, elasticity, metering. A self-hosted cluster with manual capacity planning and no metering is not itself a cloud, so pairing it with a public provider over a VPN produces one cloud and one non-cloud datacentre, not a hybrid composition.

- A is wrong: A VPN link supplies connectivity, not the essential characteristics; the on-premises side must itself be a cloud before the composition can be hybrid.
- B is wrong: Multi-cloud describes using more than one public provider; a self-hosted, non-cloud cluster paired with one public provider is neither hybrid nor multi-cloud as NIST or the industry uses either term.
- C is wrong: Portability tooling can help satisfy the binding condition once both sides are already clouds, but it does nothing to fix the on-premises side's failure to meet the essential characteristics in the first place.

### 16.

A systems engineer must classify Linux KVM as type 1 or type 2. It runs as a module inside the Linux kernel, and a full Linux userland runs alongside it on the same machine. Which classification is correct, and why does the userland not change the answer?

- **A.** Type 2 — since a full conventional operating system userland is present, KVM must be running as an application on top of it, in the same way VirtualBox runs as an ordinary desktop program.
- **B.** Neither — KVM is a virtualization technique rather than a hypervisor product, so the type 1 / type 2 split does not apply to it at all.
- **C.** Type 1: the kernel module makes the Linux kernel itself the hypervisor, and it is classified as type 1 despite the full userland running alongside it.
- **D.** Type 1, but only because KVM happens to run on cloud provider hardware rather than a desktop, where the same kernel module would instead be classified as type 2.

**Answer: C.** KVM is a module inside the Linux kernel, which makes the kernel itself the hypervisor — the lowest software layer scheduling VM resources directly against hardware, exactly what type 1 means. Vendors classify it as type 1 even though a full Linux userland runs alongside it, because that userland does not sit beneath KVM the way a host OS sits beneath a type 2 hypervisor like VirtualBox.

- A is wrong: The presence of a userland is exactly the distractor the guide warns about; what decides the type is whether the hypervisor is the lowest software layer, and as a kernel module, KVM is.
- B is wrong: KVM is a specific hypervisor implementation, and Red Hat names it alongside Hyper-V and vSphere as an example of a type 1 hypervisor; virtualization is the broader capability, and type 1 versus type 2 classifies hypervisors specifically, which KVM is.
- D is wrong: Where KVM is deployed is irrelevant to its classification; the deciding fact is that the kernel module makes the kernel itself the hypervisor, whether on a desktop or in a datacentre.

### 17.

A developer runs VMware Workstation on a Windows laptop to test a Linux VM alongside their normal desktop applications. Is this a type 1 or type 2 arrangement, and how does it compare to VMware Fusion?

- **A.** Type 2, and therefore an outdated or insecure choice compared to the type 1 hypervisors cloud providers use, which is why hosted hypervisors are no longer shipped for current desktop operating systems.
- **B.** Type 1 — running VMs alongside desktop applications still counts as bare-metal virtualization, since the hypervisor schedules VM resources straight onto the hardware with no host operating system in the path.
- **C.** Type 2, because the hypervisor runs as an application on the conventional host OS; Workstation is the same class of product as Fusion, just on Windows and Linux instead of macOS.
- **D.** Type 2, but unrelated to Fusion — Fusion runs virtual machines using a fundamentally different mechanism, replacing macOS at boot rather than running on top of it.

**Answer: C.** VMware Workstation runs as an application atop a conventional operating system, the definition of a type 2, hosted hypervisor — and it is the equivalent product to VMware Fusion, just on Windows and Linux rather than macOS, the same class of software chosen for coexisting with a normal desktop rather than for production datacentre use.

- A is wrong: Type 2 is the developer-workstation kind, chosen because it coexists with a normal desktop — it is not 'the old kind' or 'the insecure kind', and hosted hypervisors are still shipped and supported for current desktops.
- B is wrong: Bare-metal specifically means no intervening host OS; here Workstation runs as an application on top of Windows, which is the defining feature of type 2, not type 1.
- D is wrong: Fusion is the macOS counterpart of Workstation and runs as an application on the installed host operating system, which is what makes a hypervisor type 2; it does not replace the host OS at boot, and the mechanism differs only in which host OS each product targets.

### 18.

Why do cloud providers and enterprise datacentres run type 1 hypervisors such as ESXi or Hyper-V rather than type 2 products such as VirtualBox?

- **A.** Because type 1 hypervisors are simply newer technology than type 2 hypervisors — the hosted products that came before them are no longer maintained by their vendors.
- **B.** A type 1 hypervisor runs directly on the hardware in place of a host OS, avoiding the extra host-OS layer that type 2 adds, which costs performance and adds a second component that can crash.
- **C.** Because type 1 hypervisors provide virtualization while type 2 hypervisors do not virtualize hardware at all, offering only the process-level isolation a container runtime provides.
- **D.** Because type 1 hypervisors are required to run containers, which type 2 hypervisors cannot host, so a container platform can never be tested on a developer's laptop.

**Answer: B.** A type 1 hypervisor is itself the lowest software layer, scheduling VM resources straight to the hardware; a type 2 hypervisor runs as an application on a conventional host OS, which schedules against the hardware in turn. That extra layer in type 2 costs performance and adds a second piece of software that can fail, which is exactly why production cloud and enterprise infrastructure standardises on type 1.

- A is wrong: Age is not the distinction; both types are in active, current use and both are actively maintained, chosen for different situations rather than one superseding the other.
- C is wrong: Both types virtualize hardware and present guests with virtual CPU, memory, disk and network devices; the difference is what sits underneath the hypervisor, and neither type is a process-isolation mechanism.
- D is wrong: Either type of hypervisor can host VMs that in turn run containers; container support has no bearing on the type 1 versus type 2 choice.

### 19.

Two teams each rent capacity from the same provider. Team A installs and patches its own guest operating system on a rented virtual machine. Team B pushes an application build and selects a supported runtime version, with the provider patching the OS beneath it. Which model is Team A using, and what is the deciding boundary against Team B's model?

- **A.** Team A is using PaaS; the boundary is who chooses the runtime version, which is the one decision the provider never delegates.
- **B.** Team A is using IaaS; the boundary is who owns the operating system, which IaaS leaves to the customer, while Team B's model puts it below the provider's line.
- **C.** Team A is using IaaS; the boundary is which team is billed per second rather than per month, since only IaaS meters at second granularity.
- **D.** Team A is using IaaS; the boundary is that Team B's workload runs as a container, which is what makes an offering PaaS rather than IaaS.

**Answer: B.** IaaS gives the customer fundamental resources — compute, storage, network — and leaves the guest operating system, from the boot loader upward, entirely to them: the same patch cadence and the same responsibility as a physical server. PaaS moves that OS-and-runtime ownership beneath the provider's line, which is the single boundary the guide identifies as separating the two models.

- A is wrong: This swaps the two models — installing and patching your own guest OS is IaaS, and runtime choice is a PaaS-level concern, not what separates A from B here.
- C is wrong: Billing granularity is an implementation detail of either model and is not the responsibility boundary the scenario is testing.
- D is wrong: Nothing in the scenario mentions containers, and PaaS is defined by the deployment relationship, not by any particular packaging technology.

### 20.

A critical kernel security patch is released. On a rented IaaS virtual machine, whose job is it to apply it?

- **A.** The provider's — because they operate the underlying infrastructure, patching runs all the way up through the guest operating system.
- **B.** Whichever party originally enabled automatic OS updates on the instance — enabling them transfers patching duty to the provider.
- **C.** Neither — under IaaS the runtime is patched automatically by the platform, so no kernel patching is needed.
- **D.** The customer's — the provider's responsibility under IaaS stops at the virtualization layer and host operating system.

**Answer: D.** Renting a virtual machine does not rent an administered one. From the guest OS boot loader upward the machine behaves exactly like a server in a rack, so kernel patching, host firewall rules and application configuration remain the customer's work — the misconception that the provider covers this is the source of most wrong answers on shared responsibility questions.

- A is wrong: AWS's shared responsibility model puts the host operating system and virtualization layer on the provider and the guest operating system, 'including updates and security patches', on the customer.
- B is wrong: Enabling auto-updates is a customer configuration choice made within their own responsibility, not a transfer of that responsibility to the provider.
- C is wrong: Automatic runtime patching describes PaaS; an IaaS instance is a raw building block with no such platform-managed runtime layer.

### 21.

A team provisions a virtual network and a set of block storage volumes from a provider, without touching any compute instance yet. Is this still an IaaS activity?

- **A.** No — without a running virtual machine there is no IaaS resource in use yet, since the virtual machine is the only genuine IaaS product.
- **B.** Yes — IaaS covers fundamental computing resources broadly, including virtual networks and storage volumes, not only virtual machines.
- **C.** No — provisioning storage and networking without deploying application code is a PaaS-level activity.
- **D.** Yes, but only if the team also attaches a managed database to the network, since IaaS requires at least one managed component.

**Answer: B.** A virtual machine is the canonical IaaS product, but IaaS also covers block storage volumes and virtual networks provisioned as raw building blocks the customer assembles themselves. A question about provisioning a virtual network, with no VM yet involved, is still an IaaS question for exactly that reason.

- A is wrong: A virtual machine is the most familiar IaaS product, but the guide is explicit that provisioning a virtual network is still an IaaS question, not a non-answer.
- C is wrong: PaaS is defined by deploying application code onto a managed platform; raw storage and network provisioning with no application involved is squarely IaaS.
- D is wrong: Attaching a managed database would make that specific component a managed service, but it has no bearing on whether the storage and network provisioning itself counts as IaaS.

### 22.

Amazon S3, Azure Blob Storage and Google Cloud Storage are vendor names for which underlying service category?

- **A.** Object storage, the category behind buckets and HTTP-addressable blobs.
- **B.** Block storage, the category backing virtual machine boot disks.
- **C.** Managed relational database, the category behind SQL-compatible engines.
- **D.** Identity and access management, the category behind users, roles and policies.

**Answer: A.** The three hyperscalers sell a close to one-to-one mapping of service categories under different brand names. Amazon S3, Azure Blob Storage and Cloud Storage are each the provider's object storage product — recognising the category behind an unfamiliar vendor name is the reasonable expectation the exam sets, not memorising pricing or console navigation.

- B is wrong: The block-storage equivalents are Amazon EBS, Azure managed disks and Google Persistent Disk — a different product line entirely.
- C is wrong: The managed database equivalents are Amazon RDS, Azure SQL Database and Cloud SQL, not these three products.
- D is wrong: The identity equivalents are AWS IAM, Microsoft Entra ID and Google Cloud IAM, which none of the three named products provide.

### 23.

A question describes a fictional offering as 'a region-internal fault domain with its own independent power, cooling and networking' without naming a vendor. Which infrastructure unit is this describing?

- **A.** A region — the provider's overall geographic footprint, and the smallest unit with its own independent power and cooling.
- **B.** A hyperscaler — one of the three major public cloud providers, each of which operates exactly one such fault domain per region.
- **C.** An availability zone, which is AWS's and Azure's shared name for an isolated datacentre grouping within a region.
- **D.** A private cloud, since dedicated power, cooling and networking imply infrastructure reserved for a single customer.

**Answer: C.** The exam is vendor-neutral in its wording but expects the candidate to recognise the category or unit being described. 'A region-internal fault domain with independent power, cooling and networking' is precisely how availability zones are defined across providers, whatever brand name a specific question attaches to it.

- A is wrong: A region is the broader geographic area; the description is of one isolated fault domain inside it, and independent power and cooling belong to that zone, not to the region.
- B is wrong: Hyperscaler names the class of company, not a unit of datacentre infrastructure, and a region routinely contains several such zones.
- D is wrong: Nothing in the description restricts use to one customer; isolation of power and networking is about fault domains, not exclusivity of tenancy.

### 24.

A team connects to a provider-operated relational database through its normal wire protocol, configuring schema, indexes and access grants, but deploying no application code onto the database itself. Is this PaaS, and what is the deciding fact?

- **A.** Yes — since the provider handles installation, patching and scaling, this meets the definition of PaaS regardless of what is deployed.
- **B.** No, because managed services are never provider-operated components, only self-hosted ones the customer configures remotely.
- **C.** Yes, because NIST SP 800-145 names managed services as a fourth service model alongside IaaS, PaaS and SaaS.
- **D.** No — it is a managed service; the deciding fact is whose code is running, and nothing of the team's is deployed onto the database.

**Answer: D.** Managed services and PaaS both take significant operational work off the customer, but PaaS is defined by the consumer deploying an application they wrote or acquired, while a managed service is a standard component — a database, queue or cache — the provider installs, patches and operates, that the consumer merely configures and uses through its ordinary interface. Nothing of the team's is deployed onto the database in this scenario, which settles it as a managed service.

- A is wrong: Provider-managed operations are common to both models; what makes PaaS specifically PaaS is the deployed application artifact, which is absent here.
- B is wrong: This gets the definition backwards — a managed service is precisely a provider-operated component; what stays with the customer is configuration, schema and data, not operation of the component itself.
- C is wrong: NIST does not define managed services as a service model at all; it is a consumption pattern that fits within the same consumer/provider control split NIST documents for IaaS, PaaS and SaaS.

### 25.

An application built on a managed database experiences repeated slow queries caused by a missing index. The team assumes the provider will fix it since the database is 'managed.' Is that assumption correct?

- **A.** Yes — 'managed' means the provider assumes full responsibility for the database's behaviour, including the performance of the queries it runs and the indexes chosen to support them.
- **B.** Yes, because managed services provide the same automatic runtime optimisation PaaS platforms apply to deployed code.
- **C.** No — 'managed' takes over installation, patching, backup mechanics and failover, but schema design, indexes and query efficiency remain the customer's responsibility.
- **D.** No, because this is actually a shared responsibility model failure specific to IaaS, not to managed services.

**Answer: C.** A managed service trades configuration control for a large reduction in operational work, but it does not remove all responsibility: the provider installs, patches, backs up and monitors the component, while schema design, indexes, queries, data and access grants stay with the customer. A missing index causing slow queries is exactly the kind of failure the provider will not fix, because it is a decision the customer made, not an operational fault of the component.

- A is wrong: This is the misconception the guide corrects directly: managed does not mean no responsibility, and query and schema performance stay with whoever designed them.
- B is wrong: PaaS platforms manage the runtime executing a deployed application; a managed database has no deployed application code to optimise, and query efficiency is a schema and query design concern the customer owns.
- D is wrong: IaaS is not involved here; the scenario is squarely about a managed database, where operational maintenance is the provider's and data-model decisions like indexing remain the customer's.

### 26.

A provider deprecates the major version of a managed database a team has relied on for years, forcing an upgrade on a fixed timetable the team did not choose. Does this contradict the definition of a managed service?

- **A.** Yes — a genuinely managed service never imposes an unplanned change, so version timing remains under the customer's control throughout, exactly as it does on a self-managed installation the team patches on its own schedule.
- **B.** Yes, because forced runtime upgrades are a PaaS-specific behaviour that should never occur with a managed service — the provider operates only the version the customer selected.
- **C.** No, but only because this database should have been run as IaaS instead, where version timing stays with the customer and no maintenance window applies.
- **D.** No — losing control over the timing of a forced version upgrade is part of the trade a managed service makes; the customer keeps schema and data control but loses root and the ability to hold a retired version.

**Answer: D.** Trading configuration control for reduced operational burden is the definition of a managed service, and losing root — including the timing of forced version upgrades when the provider deprecates an old one — is exactly what that trade costs. It is not a contradiction of the definition; it is the definition working as intended, which is why the decision to accept a managed component should weigh that loss of control deliberately.

- A is wrong: This treats 'managed' as meaning 'never surprises you,' which the guide explicitly rejects — losing root and version-timing control is precisely what the customer trades away for reduced operational burden.
- B is wrong: Forced upgrades on the provider's schedule occur under both models for the same reason — the provider owns the underlying component's lifecycle in each case.
- C is wrong: Running it as IaaS would indeed restore version-timing control, but that is a different architectural choice, not evidence about whether the forced upgrade contradicts the managed-service definition itself.

### 27.

A team runs the same stateless web service on two public providers, but only one of the two deployments is actually tested and kept current; the other has drifted and would take days to bring back into service. A stakeholder claims 'we're multi-cloud, so we're protected against a provider outage.' Evaluate the claim.

- **A.** The claim is right — using two providers for the same workload is itself sufficient for availability across provider outages, whatever state either deployment is in on the day the outage arrives.
- **B.** The claim is wrong: multi-cloud does not automatically deliver high availability; a deployment that is not actually tested and ready to take over fails just as hard as a single-provider setup when its own provider goes down.
- **C.** The claim is right, but only because the two deployments together form a hybrid cloud, which guarantees failover between its parts.
- **D.** The claim is wrong, but only because service level agreements do not cover multi-provider failover scenarios, which is the real gap here.

**Answer: B.** Multi-cloud reduces dependence on a single vendor in principle, but it delivers no availability benefit on its own. A workload partitioned or duplicated across providers only survives a provider outage if it is deployed, tested and genuinely able to fail over on both — an untested, drifted second deployment offers no more protection than having no second provider at all.

- A is wrong: This treats multi-cloud as an unqualified guarantee, which is exactly the assumption the guide warns against; an untested, drifted deployment provides no real protection.
- C is wrong: Two public providers with no private or community component is multi-cloud, not hybrid, and neither term guarantees failover without a tested, current standby.
- D is wrong: An SLA is the wrong frame entirely here — the actual gap is an untested, drifted standby deployment, not a contractual coverage question.

### 28.

An architecture team splits workloads across two public providers by running each application on a common container substrate with an orchestrator, so any workload could in principle run on either provider. What cost does this portability buy against, and what does it typically give up?

- **A.** It spreads risk across providers, but tends to force a lowest-common-denominator architecture that gives up each provider's differentiated managed services.
- **B.** It eliminates vendor lock-in entirely, since containers are portable by construction and carry their dependencies with them.
- **C.** It converts the architecture into a hybrid cloud, since workloads can move between the two platforms on demand.
- **D.** It removes the need for duplicated identity and monitoring tooling across the two providers, since the orchestrator supplies both.

**Answer: A.** In practice, multi-cloud workloads are either partitioned — simple, but each workload stays dependent on its own provider — or made portable on a common substrate such as containers with an orchestrator, which spreads risk but tends to force a lowest-common-denominator design, giving up the differentiated managed services either provider might otherwise offer.

- B is wrong: Portability reduces the technical component of lock-in but does not touch data gravity, egress cost or a team's accumulated platform expertise, so it does not eliminate lock-in.
- C is wrong: Movement between two public providers, without a private or community component, is multi-cloud portability, not hybrid cloud, which NIST reserves for a mix of deployment models.
- D is wrong: Portability at the workload layer does not remove the operational duplication of identity, networking and monitoring that every additional provider brings with it.

### 29.

Which deployment model does NIST SP 800-145 list among its four, and which term is conspicuously absent from that list despite being common industry vocabulary?

- **A.** Multi-cloud is one of NIST's four deployment models; hybrid cloud is the industry term absent from the list.
- **B.** Hybrid cloud is one of NIST's four deployment models (private, community, public, hybrid); multi-cloud is absent from that list entirely.
- **C.** Managed services is one of NIST's four deployment models; public cloud is the absent term.
- **D.** Community cloud is absent from NIST's list, while private cloud and multi-cloud are both named.

**Answer: B.** NIST SP 800-145 names exactly four deployment models — private, community, public and hybrid — and multi-cloud is not among them. That absence is itself examinable: multi-cloud is a real and useful industry term, defined directly by vendors such as AWS, but it is a consumption pattern layered on top of NIST's models rather than a fifth model of its own.

- A is wrong: This reverses the two: hybrid cloud is the NIST-defined model with a binding condition, while multi-cloud is the industry term NIST never defines.
- C is wrong: Managed services is not a deployment model at all, and public cloud is very much one of NIST's four, named explicitly.
- D is wrong: Community cloud is in fact one of NIST's four; multi-cloud is the term that is absent, not community cloud.

### 30.

A team wants to put a transactional database's live data files directly on object storage to save on cost per gigabyte. Why does this fail mechanically rather than merely run slowly?

- **A.** Object storage replaces an object as a whole on every write; a database needs random in-place writes at arbitrary offsets, which object storage has no mechanism for at all.
- **B.** Because object storage has a strict per-object size limit smaller than most database files — the file would have to be split before it could be stored at all.
- **C.** Because object storage cannot be reached over an HTTP API from the database engine, leaving the engine no path over which to issue its reads and writes.
- **D.** Because object storage requires a filesystem to be formatted onto it before use, unlike block storage, and no filesystem can be formatted onto a key-addressed store.

**Answer: A.** Object storage stores each item with its key and metadata, and a write replaces the whole object rather than editing bytes in place — there is no mechanism for a partial, in-place write at all. A database performs exactly that kind of random write to its data files, which is why object storage is not merely a slow choice for this use but a mechanically impossible one.

- B is wrong: Object storage typically scales to enormous sizes; the actual blocker is the write model — whole-object replacement — not a size ceiling.
- C is wrong: Object storage is specifically reached over an HTTP API; the mismatch is that a database needs partial, in-place writes, which that access model does not provide, not that it cannot be reached at all.
- D is wrong: This reverses the two: block storage is what a guest OS formats with a filesystem; object storage has no filesystem to format at all, addressing items by key in a flat namespace instead.

### 31.

Two application servers need to read and write the same set of files concurrently, with ordinary file permissions and locking. A second block storage volume is proposed for the second server. Why is that the wrong shape?

- **A.** Object storage should be used instead, since it scales to any number of concurrent readers and writers and presents them with a mountable POSIX filesystem on which ordinary file permissions and byte-range locking work unchanged.
- **B.** A second block volume works fine, because block storage automatically synchronises writes between volumes attached to instances in the same account — both copies are kept identical.
- **C.** A second block volume works fine, provided both servers are in the same availability zone, since volumes co-located with their instances can be attached to more than one at a time.
- **D.** A block volume is normally attached to one instance at a time; sharing one between instances needs an explicit multi-attach feature plus a cluster-aware filesystem, which file storage over NFS or SMB provides natively.

**Answer: D.** Block storage exposes a raw volume that a guest OS formats and normally attaches to a single instance at a time — sharing it needs an explicit multi-attach feature and a cluster-aware filesystem most teams do not have set up. File storage puts the filesystem on the provider's side and serves it over NFS or SMB precisely so that many machines can mount the same tree concurrently with familiar permissions and locking, which is exactly this requirement.

- A is wrong: Object storage is not a mountable POSIX filesystem and has no partial-write or locking semantics; it is a poor fit for files two servers actively edit together, unlike file storage.
- B is wrong: Block volumes have no built-in cross-volume synchronisation; each is an independent raw device unless deliberately mirrored, which does not solve concurrent shared access at all.
- C is wrong: Zone placement does not change the fact that a block volume is normally attached to a single instance at a time; proximity does not enable concurrent shared attachment on its own.

### 32.

In object storage, is a 'folder' shown in a console listing a real directory?

- **A.** Yes — object storage organises items in a true hierarchical directory tree, the same as a conventional filesystem.
- **B.** Yes, but only within block storage volumes that have been formatted with a hierarchical filesystem.
- **C.** No, because object storage items are addressed only by a numeric offset rather than any kind of name.
- **D.** No — it is a prefix on the object's key; the namespace is flat and has no real directory structure underneath it.

**Answer: D.** Object storage holds items in a flat namespace addressed by key, with no real directory structure underneath. What a console displays as a folder is constructed from a shared prefix on the object keys inside it, not an actual directory the way a filesystem provides one.

- A is wrong: There are no real directories in a flat, key-addressed namespace; the apparent folder structure is constructed entirely from prefixes shared by object keys.
- B is wrong: That describes block storage after a guest OS formats it, which is a different storage shape entirely from the object storage the question is about.
- C is wrong: Object storage items are addressed by a key — typically a name-like string — not by numeric offset, which is a block storage concept instead.

### 33.

Three teams describe their setup: Team X writes application code and pushes it to a platform that runs the OS and language runtime beneath it. Team Y only signs in, configures settings and uploads data into a finished application they did not write. Team Z registers individual functions that start on an event and shut down when idle. Which team is using PaaS, and what single fact distinguishes it from the other two?

- **A.** Team Y — PaaS is distinguished by needing no deployment artifact at all, only configuration of an application the provider already runs.
- **B.** Team Z — PaaS is distinguished by billing only for the duration code actually runs, so an idle platform costs nothing.
- **C.** Team X — PaaS is distinguished by the team never having to select a runtime version, because the provider pins it for them.
- **D.** Team X, since PaaS is distinguished by deploying application code the consumer wrote, unlike Team Y's finished application or Team Z's per-event functions.

**Answer: D.** The three service models differ in what the consumer supplies and who wrote the running code. PaaS runs an application the consumer wrote on infrastructure the provider manages beneath the runtime; SaaS needs no deployment artifact because the provider's own application is what runs; FaaS invokes individual functions per event and, unlike PaaS, typically charges nothing while idle. Team X's arrangement — push code, provider runs OS and runtime — is PaaS on that basis.

- A is wrong: Needing no deployment artifact describes SaaS, Team Y's model; PaaS requires exactly the artifact Team X pushes.
- B is wrong: Pay-only-while-running billing is the FaaS property Team Z exhibits; PaaS typically bills for provisioned instances that stay warm even when idle.
- C is wrong: PaaS still requires selecting a supported runtime from what the provider offers; the provider patches it, but the choice remains the consumer's, much as IaaS leaves the whole OS choice to the consumer.

### 34.

A platform team pushes their application weekly but discovers the bill is unchanged whether traffic is high or completely absent overnight. Why does PaaS behave this way?

- **A.** Most PaaS platforms bill for provisioned instances that stay warm, so an idle application still costs money even with no traffic.
- **B.** PaaS scales to zero automatically whenever traffic stops — so a flat overnight bill can only be a billing error worth disputing.
- **C.** PaaS charges a fixed subscription regardless of infrastructure used, the same as SaaS.
- **D.** PaaS means the team no longer needs to think about scaling at all, so cost is naturally constant.

**Answer: A.** PaaS platforms usually keep application instances provisioned and warm so requests can be served immediately, and that warm capacity is billed whether or not it is handling traffic. That is precisely the line CNCF draws between PaaS and FaaS: FaaS scales to zero and charges nothing when idle, while PaaS's operational relief does not extend to its billing model.

- B is wrong: Scaling to zero and charging nothing when idle is the FaaS property, not PaaS's; a flat overnight charge for a PaaS app is expected behaviour, not a mistake.
- C is wrong: PaaS billing tracks provisioned compute resources, not a per-seat subscription; that billing shape belongs to SaaS instead.
- D is wrong: Not having to manage servers is only half true — the team still configures scaling policies, and provisioned instances that stay warm are exactly why an idle app still costs money.

### 35.

A team connects their application to a provider-operated managed database, but writes and deploys no application code onto the database itself. Does connecting to it make the database part of the team's PaaS usage?

- **A.** Yes — any provider-operated component that a PaaS application depends on is itself part of the PaaS model the application runs on.
- **B.** Yes, because the database runs on the same underlying infrastructure as the application, which is what puts it inside the same service model.
- **C.** No, because managed databases are always billed on a separate invoice from application hosting.
- **D.** No. Nothing of the team's is deployed onto the database, so it is a managed service rather than PaaS, even though the team's application is PaaS.

**Answer: D.** PaaS and a managed service both take work off the customer's plate, but the line between them is whose code is running: PaaS runs an application the consumer wrote, while a managed service runs a standard component the provider maintains. A team connecting to — rather than deploying onto — a managed database is using a managed service alongside their PaaS application, not extending PaaS to cover the database.

- A is wrong: Dependency is not deployment; the guide is explicit that a managed database you connect to is a managed service precisely because you never deploy an application onto it.
- B is wrong: Shared underlying infrastructure does not determine the service model; what matters is whether the consumer deploys application code onto the component.
- C is wrong: Billing separation is not the deciding factor and is not even reliably true across providers; the deciding factor is whether an application artifact is deployed onto the component.

### 36.

A third-party provider owns, operates and hosts an off-premises platform dedicated to exactly one client organisation, with self-service provisioning and metered chargeback to that client's business units. Which NIST deployment model is this, and why does location not decide the answer?

- **A.** Public cloud — since a third party owns and operates the infrastructure rather than the client itself, and third-party operation is what the public model names, on or off the customer's premises.
- **B.** Not a cloud at all, since the client organisation does not own the hardware it provisions capacity on.
- **C.** Private cloud — NIST defines it by exclusive use by one organisation, and explicitly allows the infrastructure to be owned, managed and operated by a third party, on or off premises.
- **D.** Hybrid cloud, because the infrastructure is hosted off the client's own premises while the client's users remain on them.

**Answer: C.** NIST's private cloud definition turns on exclusivity of use by a single organisation, and it explicitly permits that infrastructure to be owned, managed and operated by a third party, on or off premises. An off-premises, third-party-operated platform dedicated to one client is exactly the case the definition anticipates — the common assumption that private cloud must be on-premises and self-run is the trap.

- A is wrong: Third-party operation is common to both models; what makes this public or private is who may use it, and here use is restricted to one organisation, which is private cloud.
- B is wrong: Ownership is irrelevant to whether this is a cloud; the self-service provisioning and metered chargeback described are exactly the essential characteristics that make it one.
- D is wrong: Hybrid requires two or more distinct cloud infrastructures bound together with portability between them; a single dedicated platform, however it is hosted, is not that.

### 37.

A company runs a virtualized server cluster entirely inside its own building, with no self-service provisioning, no elastic scaling and no usage metering — capacity requests go through a manual ticket. Is this a private cloud?

- **A.** Yes — any on-premises infrastructure dedicated to one organisation counts as private cloud regardless of how it is provisioned or how long a request takes to fulfil.
- **B.** Yes, since it is not open to the general public and therefore falls under the private cloud model by elimination.
- **C.** No, because private cloud requires third-party hosting, which this arrangement lacks entirely, leaving it outside every NIST model.
- **D.** No — without on-demand self-service, elasticity and metering, it is a virtualized datacentre rather than a cloud of any deployment model, private included.

**Answer: D.** A private cloud is still, first and foremost, a cloud: the five essential characteristics must hold before the question of which deployment model applies even arises. A virtualized cluster with a manual ticket process, no elasticity and no metering fails that first test entirely, so it is not a private cloud — it is simply a virtualized datacentre.

- A is wrong: On-premises and dedicated to one organisation are necessary but not sufficient; the environment must also meet the essential characteristics, which this one plainly does not.
- B is wrong: Not being open to the public rules out only public cloud, not the possibility that this is not a cloud at all — process failures on self-service and elasticity are the actual disqualifier.
- C is wrong: NIST allows the organisation itself to own, manage and operate a private cloud; third-party hosting is not required, so this is not the disqualifying factor here.

### 38.

A provider offers a single-tenant dedicated host inside its otherwise open public cloud platform, reachable through the same self-service console as every other customer's shared instances. Is the dedicated host best classified as a private cloud?

- **A.** Yes — since only one tenant runs on that specific host, it satisfies private cloud's exclusivity requirement in the only place that requirement can be measured, namely the machine the workload actually runs on.
- **B.** Yes, because public cloud infrastructure can never contain single-tenant hardware by definition — the host must belong to some other model.
- **C.** No — the surrounding cloud infrastructure is still provisioned for open use by the general public, so a single-tenant host within it reads better as a public-cloud feature than as its own private cloud.
- **D.** Yes, because it satisfies hybrid cloud instead, mixing a dedicated host with shared infrastructure inside one provider's estate.

**Answer: C.** NIST does not address single-tenant hardware inside a public platform directly, so the guide treats it as an application of the definition: the surrounding infrastructure is still provisioned for open use by the general public, which makes the dedicated host a public-cloud feature rather than a private cloud of its own, even though only one customer's workload runs on that specific machine.

- A is wrong: Exclusivity applies to the surrounding cloud infrastructure NIST is describing, not to one physical machine carved out of an otherwise open platform.
- B is wrong: Nothing in NIST's public cloud definition forbids single-tenant hardware within it; the host being dedicated does not remove the surrounding platform from being provisioned for open use.
- D is wrong: Hybrid requires two or more distinct, bound-together cloud infrastructures with portability between them; one dedicated host inside one platform is not that composition.

### 39.

A regulator asks whether customer workloads on a public cloud platform are visible to other tenants, since the service is 'open to the public.' What is the accurate answer?

- **A.** Yes — anyone who can purchase the service can also see any tenant's data stored on it, since the storage layer is genuinely shared.
- **B.** No — 'public' describes who may buy the service, not who may see a customer's data; tenants are logically isolated by separate accounts, networks and encryption keys.
- **C.** No, but only because this workload must actually be running in a private cloud rather than a public one, which by itself would rule the platform out of the public category.
- **D.** No, because public cloud providers only sell to businesses and governments, never individuals — the tenant set is vetted in advance.

**Answer: B.** NIST defines public cloud as infrastructure provisioned for open use by the general public — a statement about who may purchase the service. Customers are separated logically through accounts, virtual networks and encryption keys while sharing the same physical estate, so 'public' never implies that one customer's workload is visible to another.

- A is wrong: This is the misreading the term invites; isolation is enforced by the virtualization and identity layers even though the physical estate is shared.
- C is wrong: Nothing about the scenario suggests the workload has moved to a private cloud; public cloud tenants are isolated from each other by design, which is sufficient on its own.
- D is wrong: NIST's definition allows open use by the general public and says nothing about restricting buyers to organisations; isolation, not the buyer's identity, is what protects the data.

### 40.

A finance director assumes moving a steady, predictable, high-volume workload to public cloud will automatically cut costs. Is that assumption safe?

- **A.** Yes — public cloud infrastructure is always cheaper than owning equivalent hardware, because providers buy at a scale no single customer can match.
- **B.** No — steady workloads should run on private cloud instead, since private cloud is always the cheaper deployment model.
- **C.** Yes, because public cloud eliminates capital expenditure for any workload shape, and operating expense is always the cheaper of the two.
- **D.** No — public cloud's advantage is elasticity and speed, and steady, predictable, high-volume workloads can be cheaper on owned hardware.

**Answer: D.** Public cloud's selling point is elastic capacity and speed of provisioning, not an automatic price advantage. A workload whose demand never varies gets no benefit from elasticity and can be cheaper to run on owned hardware sized precisely for it — assuming the move always saves money is the trap the guide calls out directly.

- A is wrong: This treats elasticity's benefit as universal; a workload that never varies gains nothing from elastic capacity it never needs to use.
- B is wrong: Private cloud is not inherently cheaper either — its usual motivations are regulation, residency and control, not cost — so this does not follow from the scenario.
- C is wrong: Avoiding capital expenditure is real, but it is only one factor; a steady high-volume workload may still cost more over time on a public platform than on owned hardware sized for it.

### 41.

What is the structural relationship between a region and an availability zone?

- **A.** An availability zone is one of multiple isolated locations inside a single region, each with independent power, cooling and networking.
- **B.** A region is one of multiple availability zones grouped within a larger datacentre, so a single facility can contain several regions.
- **C.** Regions and availability zones are two names for the same unit of infrastructure, differing only in which provider's documentation uses which word.
- **D.** An availability zone spans multiple regions to provide cross-geography redundancy — a single zonal deployment therefore survives the loss of a whole region.

**Answer: A.** A region is a separate geographic area designed to be isolated from other regions, and an availability zone is one of several isolated locations inside a single region, each with independent power, cooling and networking infrastructure — so that an outage in one zone is survived by the rest of the region.

- B is wrong: This inverts the nesting — the region is the larger geographic container, and availability zones are the smaller isolated units inside it, not the reverse.
- C is wrong: They are two distinct, nested units with different failure scopes: zones address one datacentre-scale failure, regions address the loss of a whole geography.
- D is wrong: An availability zone sits inside exactly one region; cross-geography redundancy is what spreading resources across separate regions provides instead.

### 42.

A service is deployed across three availability zones within one region for resilience. A regional-scale event takes out the entire region. Does the multi-AZ deployment protect against it?

- **A.** No — availability zones protect against the failure of one datacentre-scale location within a region, not against the loss of the region itself.
- **B.** Yes — spreading across multiple availability zones is sufficient protection against any scale of outage, including a whole-region event.
- **C.** Yes, because AWS automatically replicates all resources across regions by default, so a second copy of the workload is already running elsewhere.
- **D.** No, but only because the service should have used a hybrid cloud architecture instead of multiple zones, that being the arrangement which spans separate geographies.

**Answer: A.** Availability zones are isolated datacentre groupings inside one region, so spreading a service across them protects against the loss of any single facility within that region. A regional-scale event is outside that protection boundary entirely; surviving it requires resources placed in a second region, which — because inter-region traffic is generally not fast enough for synchronous replication — is usually an asynchronous, more deliberate design decision.

- B is wrong: Multi-AZ redundancy is bounded by the region it sits inside; nothing about it survives an event that takes out the region as a whole.
- C is wrong: AWS states the opposite: resources are tied to the region specified and are not automatically replicated across regions unless a cross-region design is explicitly built.
- D is wrong: Hybrid cloud concerns mixing deployment models, not geographic redundancy; the actual gap here is the absence of a second region, which a hybrid architecture does not by itself supply.

### 43.

A company subscribes to a SaaS product, signs in, and an employee later shares a report link publicly by mistake, exposing customer data. Who is responsible for the misconfiguration?

- **A.** The provider — SaaS means the provider is responsible for security end to end, including how customers choose to share the data they upload, which is why the incident is the vendor's to answer for.
- **B.** The customer — sharing settings, access rights and what users upload remain the customer's responsibility even though the provider runs and patches the application.
- **C.** The provider — since SaaS, unlike PaaS, gives the customer no configuration surface to misuse in the first place.
- **D.** Neither — public exposure of a shared link is covered by the provider's published SLA, which indemnifies both parties.

**Answer: B.** SaaS is where the operational surface is smallest and the residual customer responsibility is most often forgotten. The provider runs and patches everything, but identity, access rights, data classification and sharing settings remain entirely the customer's — and a leaked report link is exactly that kind of failure, at any service model.

- A is wrong: This is the precise misconception the shared responsibility model exists to correct: the provider secures the application, but a misconfigured sharing link is the customer's failure regardless of service model.
- C is wrong: SaaS does expose limited user-specific configuration, including sharing controls, and misusing that surface is what caused the exposure here.
- D is wrong: An SLA addresses the provider's own availability commitments and remedies; it says nothing about a customer's data-sharing mistake.

### 44.

A vendor bills a company per named user seat each month, regardless of how many of those seats actually log in. Is this billing pattern typical of SaaS, and why does it differ from IaaS billing?

- **A.** No — SaaS should scale its billing to zero cost when a seat goes unused, exactly as PaaS does when an application sits idle overnight.
- **B.** Yes — SaaS is normally billed per-seat or per-tenant, so an unused seat still costs money, unlike IaaS and FaaS's usage-based billing.
- **C.** No — SaaS is metered per API call, the same usage-based billing IaaS uses, so unused seats cost nothing.
- **D.** Yes, and IaaS bills the same way, per named account rather than per resource consumed.

**Answer: B.** A SaaS subscription is normally a per-seat or per-tenant fee charged regardless of use, which is why an unused licence still costs money. That is a deliberate contrast with IaaS and FaaS, both of which are billed on actual consumption — the difference is a service-model property, not an accident of one vendor's pricing.

- A is wrong: Scaling billing to zero on idle is not a PaaS property either — most PaaS still bills for provisioned instances — and it is even less true of SaaS's per-seat subscription model.
- C is wrong: Per-call metering describes usage-based IaaS-style billing; SaaS's typical model is a flat subscription regardless of use.
- D is wrong: IaaS bills for the compute, storage and network resources actually provisioned and consumed, not for named user accounts.

### 45.

A managed message queue charges per message processed and requires no server administration from the customer, but no individual customer-written function is triggered per message — the queue itself is the product. Is this FaaS?

- **A.** Yes — anything billed per use with no server management is FaaS by definition, since FaaS is simply the billing model's proper name.
- **B.** Yes — any component that avoids the continuous resource billing PaaS requires must be FaaS, because that gap is what the term was coined to name, whatever unit of work actually executes.
- **C.** No — it is serverless without being FaaS; CNCF treats serverless as the broader term spanning PaaS-like through SaaS-like services, with FaaS the narrower, function-specific member.
- **D.** No — it is a managed service, and managed services and serverless are mutually exclusive categories in CNCF's glossary.

**Answer: C.** CNCF calls serverless a comprehensive term spanning PaaS-like through SaaS-like services, with FaaS one specific member of it — a managed queue billed per message is serverless without being FaaS, because there is no customer-written, event-triggered function doing the work.

- A is wrong: Pay-per-use with no server management describes serverless generally; FaaS additionally requires that the unit executing is a customer-written, event-triggered function, which this queue lacks.
- B is wrong: The billing pattern is a genuine FaaS discriminator against PaaS, but it does not by itself make every such component FaaS — this queue has no customer function at all.
- D is wrong: They are not mutually exclusive; a serverless offering is very often also a managed service, since the provider operates it end to end.

### 46.

A batch job runs continuously at high load for six hours a day, every day. A team considers moving it from a fixed-size PaaS instance to FaaS to save money. What is the risk in that plan?

- **A.** There is no risk, since serverless always eliminates cost when a workload is idle, and every workload is idle most of the day, batch jobs included.
- **B.** Under sustained high load, FaaS's per-invocation pricing can cost more than a continuously running instance sized for the same throughput.
- **C.** There is no risk, since FaaS and PaaS bill identically for continuous workloads of the same throughput.
- **D.** The risk is that FaaS cannot hold state between invocations, which this batch job requires in order to run at all.

**Answer: B.** FaaS's economics come from charging only for computation and nothing while idle. A workload that is busy for six hours every day is far from idle, so the cost advantage that makes FaaS attractive largely disappears, and a continuously running instance sized for that throughput can end up cheaper — the guide's warning against assuming serverless is always the lower-cost choice.

- A is wrong: This job is not idle — it runs at high load for six hours daily — so the idle-cost advantage that makes FaaS attractive elsewhere does not apply here.
- C is wrong: They do not bill identically — PaaS charges for provisioned capacity regardless of load pattern, while FaaS charges per invocation, and those can diverge sharply under sustained load.
- D is wrong: Statelessness is a real FaaS constraint, but the scenario describes a cost concern under sustained load, not a state-management requirement.

### 47.

A single-instance application running in one availability zone goes down for forty minutes when that zone fails. The provider's platform-wide 99.99% SLA was still met for the month. Who is accountable for the outage, and what does the SLA actually hand the customer?

- **A.** The provider is accountable, since a 99.99% SLA is a guarantee that any application running on the platform will stay available, and one zone failing counts against that platform-wide figure.
- **B.** The customer's own architecture is accountable, since a single instance in one zone was exposed to that zone's failure; the SLA only prices the provider's own shortfall, not this outage.
- **C.** The provider is accountable, and the SLA entitles the customer to compensation for the business revenue the outage cost, calculated from the losses the customer reports for the affected period.
- **D.** The customer is accountable, but only because a managed database was involved in the outage rather than a compute instance.

**Answer: B.** The provider's SLA is a promise about the platform, priced with a service credit if the provider's own threshold is missed — it says nothing about how a customer chooses to deploy on top of it. A single instance in one zone is exposed to exactly the kind of failure that redundancy across zones is meant to absorb; the SLA being met for the month changes nothing about that architectural gap, and the credit it would owe, if triggered at all, would be proportional to the provider's shortfall, not the customer's lost revenue.

- A is wrong: An SLA is a contractual promise about the platform's own availability, not a guarantee about how a customer chooses to deploy on it; high availability is a design property the customer's own architecture must provide.
- C is wrong: SLA remedies are characteristically a service credit against future billing proportional to the shortfall, not compensation for the customer's business losses, and here the SLA threshold was not even missed.
- D is wrong: The scenario describes a single compute instance failing with its zone; no managed database or its patching is implicated in why this outage occurred.

### 48.

Google's SRE book gives a test for telling an SLA from an SLO. What is that test?

- **A.** Ask whether the target is expressed as a percentage — a percentage always signals an SLA rather than an SLO.
- **B.** Ask what happens if the target is not met; if there is no explicit consequence, it is an SLO, not an SLA.
- **C.** Ask whether the target applies to the whole platform or to a single customer's account — platform-wide targets are SLAs, account-specific targets are SLOs.
- **D.** Ask whether the target is set by the provider or by the customer's own team — provider-set targets are SLAs, self-set targets are SLOs.

**Answer: B.** The SRE book defines an SLA as an explicit or implicit contract with users that includes consequences of meeting or missing the objectives it contains, and offers exactly this diagnostic: ask what happens if the target is not met. If there is no explicit consequence, it is almost certainly an SLO being described, not an SLA.

- A is wrong: Both SLAs and SLOs are commonly expressed as availability percentages; the numeric form tells you nothing about whether a consequence is attached.
- C is wrong: Scope of application does not distinguish the two; an SLO can be platform-wide or team-specific, and what makes something an SLA is the presence of a contractual consequence, not its scope.
- D is wrong: A provider can set internal SLOs of its own with no customer-facing consequence attached, so who sets the number does not settle whether it is an SLA.

### 49.

Under AWS's stated shared responsibility model, which layer marks the boundary between what the provider controls and what the customer controls?

- **A.** The network perimeter — the provider secures everything outside the customer's virtual network, and the customer secures everything inside it.
- **B.** The application layer — the provider is responsible for securing everything up to and including the customer's own application code.
- **C.** The host operating system and virtualization layer — the provider controls everything at and below that; the customer manages the guest OS, its patches, and their own application software.
- **D.** The billing account — everything under one account is the provider's responsibility, and everything under a separate account is the customer's, so the boundary moves whenever a new account is opened.

**Answer: C.** AWS states its own side as operating, managing and controlling everything from the host operating system and virtualization layer down to the physical security of the facilities, while the customer manages the guest operating system — including updates and security patches — other application software, and the configuration of the provider-supplied firewall. That single boundary is the one candidates most often misplace.

- A is wrong: The actual boundary is drawn at the operating system and virtualization layer, not at the network perimeter, and the provider-supplied firewall's configuration remains a customer duty regardless of network boundary.
- B is wrong: This overstates the provider's share, especially under IaaS, where application software and its configuration remain the customer's responsibility.
- D is wrong: Account structure has nothing to do with the security responsibility boundary, which is defined by infrastructure layer, not by account organisation.

### 50.

A team moves an application from IaaS to a fully managed SaaS product from the same provider. What happens to the shared responsibility boundary?

- **A.** It disappears entirely, since SaaS providers assume full responsibility once a customer subscribes, including for which of the customer's own staff are granted access.
- **B.** It stays fixed, since the responsibility boundary is set once per provider account rather than per service model, and then applies uniformly to every service in that account.
- **C.** It moves toward the customer, since SaaS applications expose more configuration surface than IaaS instances do — the customer is left operating the runtime the application sits on.
- **D.** It moves toward the provider — almost everything operational becomes the provider's, though the customer's own data and their identity and access configuration never transfer.

**Answer: D.** The model slides with the service model rather than staying fixed: under IaaS the customer patches the guest OS and owns application configuration, while under SaaS almost everything operational — patching, capacity, runtime — moves to the provider. What never moves at any service model is the customer's own data and their identity and access configuration, which is why moving to SaaS narrows but never eliminates customer responsibility.

- A is wrong: No service model removes the customer's responsibility for their own data and for who they grant access to — the boundary moves, but it never vanishes.
- B is wrong: AWS itself notes that responsibility varies by the specific services chosen; the boundary is per-service, and it visibly slides as the service model moves from IaaS toward SaaS.
- C is wrong: SaaS narrows, rather than widens, the customer's operational surface; configuration options are typically more limited than the full OS-and-application control IaaS provides.

### 51.

What accumulates to create vendor lock-in?

- **A.** Lock-in is a defect that well-run cloud architecture avoids entirely, so choosing a provider-specific managed service is always an architectural mistake, whatever work it saves the team.
- **B.** Only the technical portability of the application code, since data and team expertise are irrelevant to switching providers.
- **C.** The length of the provider's published SLA, since a longer SLA commits a customer for longer and the workload cannot be moved before that term expires.
- **D.** Dependence on provider-specific services and interfaces, the volume of data and its egress charges, and the team's operational knowledge and tooling built around one platform.

**Answer: D.** Lock-in comes from three accumulating sources: depending on provider-specific services and interfaces, the sheer volume of data that would need to move plus the egress charges for moving it, and the operational knowledge and tooling a team has built around one platform. None of these is eliminated by addressing only one of the three.

- A is wrong: The guide frames lock-in as a trade-off to price, not a defect to eliminate — provider-specific services are often chosen precisely because they genuinely reduce work.
- B is wrong: Portable code reduces only the technical component of lock-in; data gravity, egress cost and accumulated team expertise remain untouched by code portability alone.
- C is wrong: An SLA is a contractual availability commitment with a remedy for shortfalls; it has no bearing on how costly it would be to move a workload to a different provider.

### 52.

A team adopts containers, an orchestrator and standard SQL specifically to reduce lock-in before choosing a cloud provider. Does this eliminate their exposure to vendor lock-in?

- **A.** Yes — using only portable, standard technologies removes vendor lock-in entirely, regardless of provider, since anything expressed in standard SQL and a container image can be lifted to another platform at no cost at all.
- **B.** Yes, because containers and standard SQL guarantee the application can be moved back to on-premises hardware at no cost, the stored data following the code automatically.
- **C.** No — these portability layers reduce the technical component of lock-in, but they do not touch data gravity, egress cost, or the operational expertise the team will still build up around whichever provider it chooses.
- **D.** No, because standard SQL only works with a single specific cloud provider's managed database offering, so the portability the team thought it was buying was never there.

**Answer: C.** Portable layers — containers, an orchestrator, standard SQL, open protocols, declarative infrastructure — reduce the technical component of lock-in by keeping the application itself movable. They do nothing, however, about data gravity, the egress cost of actually moving stored data, or the operational expertise a team accumulates around whichever platform it operates day to day, so choosing portable technology narrows lock-in without eliminating it.

- A is wrong: This overstates what portability buys; even with fully portable code, the data itself and the team's accumulated platform-specific knowledge still create real costs of leaving.
- B is wrong: Moving back to on-premises would still involve the same data-volume, egress and re-tooling costs the guide describes; portability lowers the technical barrier, not the cost to zero.
- D is wrong: Standard SQL is deliberately provider-neutral; the actual limitation is that portability layers do not address data gravity or accumulated expertise, not that standard SQL is somehow tied to one vendor.

### 53.

What does a virtual machine provide that a container does not, and what does that cost?

- **A.** A VM provides faster startup than a container, since it boots directly from a stored image rather than assembling a filesystem from layers the way a container image does.
- **B.** A VM is essentially a container with more overhead and no additional capability — the two are interchangeable once an image has been built for either one.
- **C.** A VM automatically provides higher availability than a physical machine, independent of any platform configuration, because the hypervisor restarts a failed guest elsewhere in the cluster on its own.
- **D.** A VM boots its own kernel, which lets it run a different operating system family than the host and gives a stronger isolation boundary, at the cost of the memory, CPU and patching overhead of a full guest OS.

**Answer: D.** A virtual machine boots its own kernel and full operating system, which is what lets it run a different OS family from its neighbours and gives it a stronger isolation boundary — a compromised guest kernel stays inside its own VM. That capability is exactly why a VM costs more per workload: its own memory footprint, its own CPU allocation and its own patching, none of which a kernel-sharing container needs to carry.

- A is wrong: This is backwards — a container starts in milliseconds to seconds as a process, while a VM takes seconds to minutes because it performs a full boot: firmware, boot loader, kernel, init system.
- B is wrong: The overhead exists because the VM provides something a container does not — its own kernel, a foreign-OS option and a stronger isolation boundary — not because it is simply a heavier version of the same thing.
- C is wrong: A VM inherits the availability of the host it runs on unless the platform is explicitly configured to restart or migrate it elsewhere; availability is not an automatic property of virtualization, and restarting a guest on another host is a feature that has to be turned on.

### 54.

An operations team needs to move a running workload to a different physical host with little or no downtime, and later wants to roll it back to an earlier point if an upgrade goes wrong. Which property of virtual machines makes both possible?

- **A.** Because a VM is a software-defined computer (a disk image plus configuration), it can be live-migrated to another host and snapshotted, cloned and rolled back with little or no downtime.
- **B.** Because containers, which the VM is built from, are inherently portable across any host, so moving one is only a matter of restarting its image somewhere else with no state to carry.
- **C.** Because the hypervisor automatically replicates every VM to a standby host in real time — a second copy of memory and disk is held in lockstep without any configuration.
- **D.** Because the shared responsibility model assigns migration and rollback duties to the provider, making both a contractual guarantee rather than a technical capability.

**Answer: A.** Because the whole machine — firmware, boot loader, kernel, init system, userland — is represented as a disk image plus configuration rather than bound to particular hardware, it can be created, destroyed, snapshotted, cloned and moved to another host with little or no downtime, a resilience a bare-metal server cannot offer on its own.

- B is wrong: A virtual machine is not built from containers; it is a full guest OS on top of a hypervisor, and its portability comes from being software-defined, not from any container layer.
- C is wrong: Real-time replication to a standby is a specific, separately configured high-availability arrangement, not an automatic property that every VM has by default.
- D is wrong: Shared responsibility describes who patches and secures which layer; it does not explain the technical mechanism that makes live migration or rollback possible at all.

### 55.

A platform needs to isolate ten workloads, one of which requires a Windows kernel while the other nine are fine on Linux, all on shared physical hardware. Why does this requirement rule out containers for at least one workload, and what technology does it point to instead?

- **A.** A container shares the host kernel, so it cannot supply a different operating system family than the host — the Windows workload needs virtualization, giving it its own kernel.
- **B.** Containers rule this out because they cannot run on shared physical hardware at all, so each of the ten workloads would need a dedicated physical server of its own.
- **C.** This points to a cloud-computing solution rather than a virtualization one — only cloud platforms can mix operating system families on shared hardware.
- **D.** This points to a hypervisor product recommendation, specifically a type 2 hypervisor for the Windows workload, because only a hosted hypervisor can give a guest a kernel that differs from the host's.

**Answer: A.** Virtualization gives each guest its own kernel, which is exactly what lets a workload run a different operating system family from its neighbours and from the host. A container, by contrast, shares the host kernel and therefore must match its family — so a Windows workload on a Linux estate needs virtualization specifically, not a denser packaging technology that cannot supply a different kernel at all.

- B is wrong: Containers run on shared hardware routinely — that is their whole appeal for density; the actual limitation is that they share the host's kernel and so cannot run a different OS family.
- C is wrong: Mixing operating system families on one host is a virtualization capability specifically, available on-premises with a hypervisor and not dependent on being a cloud service at all.
- D is wrong: The requirement calls for virtualization as a technique; whether the resulting hypervisor is type 1 or type 2 is a separate, unstated question this scenario does not address, and both types give each guest its own kernel.

### 56.

What is the precise relationship between virtualization and the hypervisor?

- **A.** They are two names for the same thing — naming a product such as ESXi or KVM and naming virtualization amount to the same claim about one layer of the stack.
- **B.** The hypervisor is a type of container runtime specialised for running full operating systems, which is why ESXi and Docker are classified as the same category of software.
- **C.** Virtualization is a cloud-only capability, whereas a hypervisor can also run outside the cloud on a single desktop or server.
- **D.** Virtualization is the technique of partitioning one machine into many; the hypervisor is the software layer that actually performs that partitioning.

**Answer: D.** Virtualization is the capability — partitioning one physical machine so it can run multiple isolated operating systems. The hypervisor is the specific software layer, sitting between hardware and guests, that implements that capability, schedules real resources behind the illusion of dedicated hardware, and comes in the type 1 and type 2 varieties that classify hypervisors, not the concept of virtualization itself.

- A is wrong: The guide treats conflating the two as a trap: naming a product like ESXi or KVM names a hypervisor, while the capability those products provide is virtualization.
- B is wrong: A hypervisor and a container runtime are different technologies entirely — one creates virtual machines with their own kernels, the other starts processes sharing the host kernel.
- C is wrong: Virtualization long predates cloud computing and runs on a single desktop or server with no cloud involved at all; the guide is explicit that virtualization is not itself cloud computing.

