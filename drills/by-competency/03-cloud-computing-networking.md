<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Cloud Computing Fundamentals :: Networking

49 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

Why does routing administrative access through one hardened host instead of opening SSH on every server improve security?

- **A.** Because the bastion host replaces the need for any security group rules on the private resources.
- **B.** Because the bastion host routes administrative traffic over a private service endpoint automatically, the same mechanism documented for reaching a managed storage or database service privately.
- **C.** Because a bastion host encrypts traffic that would otherwise travel in the clear.
- **D.** The private resources behind it need no direct inbound exposure of their own, and access is concentrated at one auditable point instead of scattered open ports.

**Answer: D.** A bastion or jump host concentrates administrative access at one auditable point instead of scattering open SSH or RDP ports across every host, so the private resources behind it need no inbound exposure of their own.

- A is wrong: Security groups are still applied to the private resources; the bastion changes what needs to be reachable from outside, not whether filtering rules on the targets are needed.
- B is wrong: A private service endpoint reaches a managed provider service, such as storage or a database; it is unrelated to how an administrator's session reaches a private compute resource through a bastion.
- C is wrong: Encryption is not the property this concept turns on — SSH and RDP are already encrypted protocols; the bastion's contribution is concentrating and auditing the entry point, not adding encryption that was missing.

### 2.

A team replaces a self-managed jump box with a managed service such as Azure Bastion or AWS Systems Manager Session Manager. What changes about the target virtual machines' exposure?

- **A.** Nothing changes for the targets; only the administrator's client software changes, since the managed service is assumed to sit entirely on the administrator's side of the connection.
- **B.** The targets now route their outbound traffic through a NAT gateway instead of directly.
- **C.** The targets are now addressed by a managed DNS name instead of an IP address.
- **D.** They need no public IP address and no open inbound SSH or RDP port at all — the managed service removes the exposed port entirely rather than just auditing it.

**Answer: D.** The managed forms go a step further than a self-managed jump box: Microsoft documents Azure Bastion virtual machines needing no public IP, agent, or special client software, and AWS documents Session Manager as providing node management without opening inbound ports.

- A is wrong: Microsoft documents that virtual machines reached via Azure Bastion need no public IP address, agent, or special client software, and AWS documents Session Manager as needing no open inbound ports at all — the targets' exposure is what actually changes.
- B is wrong: Outbound routing through a NAT gateway is unrelated to how an administrator reaches the machine for a session; the change here concerns inbound administrative access, not general outbound traffic.
- C is wrong: Switching to a DNS name would not by itself remove an open inbound port; the managed service's benefit is eliminating the open port and the public IP address, not changing how the target is named.

### 3.

Why does concentrating administrative access at one bastion or managed service make session logging more complete than per-host access does?

- **A.** Because logging only happens at a private endpoint, and per-host access never uses one.
- **B.** Because peering connections carry built-in session logs that individual hosts lack.
- **C.** It does not — per-host access logs every connection just as completely, since each host keeps its own log.
- **D.** Every session passes through one place, so recording and auditing become possible in a way that scattered per-host access never allows.

**Answer: D.** Because every administrative session passes through one place, session logging and recording become possible in a way that per-host access never allows.

- A is wrong: Private endpoints log access to managed services like storage or a database; they are a different mechanism from the session audit a bastion provides for administrative access to compute resources.
- B is wrong: Peering logging, where it exists, concerns network-to-network traffic between two virtual networks; it has nothing to do with recording an administrator's individual session to a host.
- C is wrong: Per-host logs are scattered across every target and are easy to miss or lose; the point of concentrating access at one place is exactly that a single, complete record becomes possible.

### 4.

Two teams each provisioned their virtual networks independently, and both happened to choose the same private address range. They now want to peer the two networks. What must happen first?

- **A.** Nothing — peering automatically translates addresses on one side to avoid the conflict.
- **B.** Nothing — a more specific route can be added to disambiguate the overlap.
- **C.** Nothing, as long as both sides accept the peering request explicitly.
- **D.** One side must be re-addressed — two networks with overlapping ranges cannot be peered or privately connected without it.

**Answer: D.** Two networks with overlapping ranges cannot be peered or privately connected without re-addressing one of them, which is why non-overlapping ranges are chosen up front.

- A is wrong: No such automatic translation is documented; the peering connection request itself is rejected when ranges overlap, and manual re-addressing of one side is the only fix.
- B is wrong: A more-specific route resolves ambiguity between two distinct ranges; it cannot make a peering connection request between genuinely overlapping ranges succeed, since that request is rejected before any route is even considered.
- C is wrong: Accepting the request is a separate step from whether the request can even be created; a peering connection between overlapping ranges cannot be created in the first place, regardless of acceptance.

### 5.

Why is running short of address space in a virtual network a recoverable problem, while discovering an overlap with another network is not, in the same easy way?

- **A.** Both are equally recoverable, since every major provider allows re-addressing a live network without disruption, treating growing into unused space and untangling an overlap as the same operation regardless of how much infrastructure was already built on the original range.
- **B.** Neither is recoverable, since a subnet's CIDR block can never be resized once created.
- **C.** Address space can be added or expanded after creation on all three major providers, but by the time an overlap is discovered, subnets, peering connections, and on-premises routes have typically already been built around the original range.
- **D.** Neither is recoverable, since any address change breaks every existing peering connection permanently.

**Answer: C.** Running short of addresses is recoverable, because the range is not locked at creation on any of the three major providers; discovering an overlap is not recoverable in the same way, because other infrastructure has usually already been built on the original range.

- A is wrong: Growing addressable space is well supported; undoing an overlap once other infrastructure is built on top of it is a much harder, disruptive re-addressing exercise, not an equally easy operation.
- B is wrong: Azure documents changing a subnet address range after creation and Google Cloud documents expanding a subnet’s primary IPv4 range, so the premise that a subnet block can never be resized is itself false.
- D is wrong: An address change can require rebuilding an affected peering connection, but that is a one-time fix, not a permanent break; conflating the two problems overstates the overlap case and understates the growth case.

### 6.

An AWS VPC's IPv4 CIDR block is being sized. Which statement about the allowed range is accurate?

- **A.** It can be any size from /8 to /32, matching the full range RFC 1918 permits for private addressing.
- **B.** It must be between a /16 and a /28, and an existing block's size cannot be changed in place — a second block is added instead.
- **C.** It must match the size of every subnet carved from it exactly.
- **D.** It is capped at five addresses per Region, matching the reserved public address quota.

**Answer: B.** AWS documents that a VPC's IPv4 CIDR block must be between a /16 and a /28, and that an existing block's size cannot change in place, requiring a second block to be added instead.

- A is wrong: RFC 1918 defines which ranges are private; AWS separately bounds the block size for a single VPC CIDR block to between a /16 and a /28, a narrower constraint than RFC 1918's own ranges.
- C is wrong: A network's CIDR block is a parent range that subnets are carved out of in varying sizes; there is no requirement that the network and its subnets share one size.
- D is wrong: The five-per-Region figure is the default quota on Elastic IP addresses, an entirely different resource from a VPC CIDR block, whose size AWS bounds between a /16 and a /28 rather than by any per-Region address cap.

### 7.

A managed DNS service is described as changing the answer it returns for a name automatically when a resource behind it fails. What is this mechanism called?

- **A.** DNS failover, since the authoritative answer stops pointing at the failed endpoint once its health check fails.
- **B.** Layer 7 routing, since content-based rules are what redirect traffic away from the failure.
- **C.** Address remapping, since a static address is being pointed at a new resource.
- **D.** Load balancing, since both mechanisms route traffic away from a failure the same way.

**Answer: A.** AWS documents DNS failover as the mechanism by which traffic is routed away from an unhealthy resource to a healthy one when several resources perform the same function.

- B is wrong: Layer 7 routing decides among backends based on the request's content; it is a load balancer capability, distinct from DNS changing which address a name resolves to.
- C is wrong: Remapping a reserved address keeps the address itself unchanged and repoints it at a new instance; DNS failover instead changes what a name resolves to, leaving addresses alone.
- D is wrong: A load balancer keeps one unchanged endpoint and stops routing to the unhealthy target internally; DNS failover instead changes what address clients are told to use, which is a different mechanism with a different speed limit.

### 8.

A service relies on DNS failover with a five-minute TTL on its record, while a comparable service sits behind a load balancer with several registered targets whose health check marks one unhealthy within seconds. After a failure, which recovers to serving traffic sooner, and why?

- **A.** They recover equally fast, since both mechanisms detect failure with a health check, and it is the detection step alone that determines how quickly traffic reaches a healthy target, regardless of whether a DNS record or a balancer's routing table has to catch up afterward.
- **B.** The DNS-based service, since layer 7 balancers add request-parsing latency that DNS avoids.
- **C.** The load-balanced service, because it keeps one unchanged endpoint and simply stops sending traffic to the unhealthy target, while DNS failover cannot take effect faster than the TTL lets caches expire.
- **D.** Neither — remapping a reserved address to a healthy instance would outperform both.

**Answer: C.** A load balancer keeps one unchanged endpoint and stops routing to an unhealthy target, so no client has to learn anything new; DNS failover changes which endpoint clients are told to use and is bounded by the record's TTL.

- A is wrong: Detecting the failure is fast in both cases; what differs is what has to happen afterward — DNS failover still has to wait out the TTL across every caching resolver, which a load balancer's internal routing does not.
- B is wrong: Layer 7 parsing latency is on the order of the request itself, not minutes; it does not come close to offsetting a multi-minute TTL-bound DNS failover.
- D is wrong: Remapping a reserved address is a valid third option for masking failure, but the question compares the two mechanisms given, and this answer avoids stating which of those two is faster.

### 9.

A managed DNS service is documented as performing three functions in any combination. What are they?

- **A.** Domain registration, DNS routing, and health checking.
- **B.** Domain registration, layer 4 routing, and layer 7 routing.
- **C.** Domain registration, private endpoint provisioning, and health checking.
- **D.** DNS routing and health checking only — domain registration is a separate, unrelated product.

**Answer: A.** AWS documents its managed DNS service, Route 53, as performing three functions in any combination — domain registration, DNS routing, and health checking.

- B is wrong: Layer 4 and layer 7 routing describe a load balancer's traffic decisions, not a DNS service's documented functions, which include health checking rather than a layer split.
- C is wrong: Private endpoint provisioning is a separate service for reaching managed resources privately; it is not one of the three functions documented for the managed DNS service.
- D is wrong: The service is documented as performing domain registration as one of its three combinable functions, not as a separate product.

### 10.

A requirement reads: route requests for one URL path to one group of servers and everything else to another. Which class of load balancer can satisfy it, and why can the other class not?

- **A.** Either class works equally well, since both forward based on the destination port a request arrives on, and a URL path is treated as just another field of that same connection-level information.
- **B.** A DNS-based routing service, since it can direct different names to different server groups.
- **C.** A network ACL, since it can match on the destination path in its rules.
- **D.** A layer 7 load balancer, because it parses the request and can act on the URL path; a layer 4 load balancer forwards by address and port only and never sees the path.

**Answer: D.** A layer 7 load balancer parses the request and can therefore make decisions on hostname, URL path, headers, or cookies, while a layer 4 balancer forwards connections by address and port alone.

- A is wrong: A URL path is not a port number — it is part of the HTTP request itself, which only a layer 7 balancer reads; a layer 4 balancer has no visibility into it at all.
- B is wrong: DNS resolves names to addresses before a connection even starts; it cannot make a per-request decision based on a URL path arriving after the connection is already open.
- C is wrong: A network ACL filters by address, port and protocol at the network layer; it has no concept of an HTTP path, which is application-layer content.

### 11.

A service balances an arbitrary TCP protocol that is not HTTP, and the requirement is minimal added latency. Which class of load balancer fits, and why?

- **A.** A layer 7 load balancer, since parsing the request lets it apply smarter routing regardless of the protocol involved.
- **B.** DNS-based load distribution, since it adds no per-connection processing at all.
- **C.** A layer 4 load balancer forwards by address and port without parsing the protocol, which is what makes it protocol-agnostic and low-latency.
- **D.** A private connectivity link, since it bypasses the public internet and therefore adds no latency.

**Answer: C.** A layer 4 load balancer forwards connections by address and port and does not read the application protocol at all, which is what makes it suited to an arbitrary TCP or UDP protocol with minimal added latency.

- A is wrong: Layer 7 parsing is specifically built around the application protocol, commonly HTTP; an arbitrary non-HTTP TCP protocol is exactly what it is not designed to interpret, and the parsing step adds the latency the requirement rules out.
- B is wrong: DNS distribution happens once at resolution time and cannot adapt per connection the way a load balancer's ongoing forwarding decision can; it answers a different requirement than the one stated.
- D is wrong: Private connectivity keeps traffic off the public internet but is not a load-balancing mechanism at all — it has no notion of distributing connections across backend servers.

### 12.

Which pairing of a provider with its layer 7 load balancer product name is correct?

- **A.** AWS's is the Network Load Balancer, since inspecting a URL path is a network-layer operation.
- **B.** Azure's is Azure DNS, following the naming pattern of its DNS service.
- **C.** Google Cloud's is Cloud Interconnect, since that is its proxy-based traffic product.
- **D.** AWS's is the Application Load Balancer, Azure's is Application Gateway, and Google Cloud's is the Application Load Balancer.

**Answer: D.** Google Cloud's documentation currently calls its layer 7 product a proxy-based layer 7 load balancer, while older material still uses the earlier name, HTTP(S) Load Balancing, for the same product.

- A is wrong: AWS documents the Network Load Balancer as functioning at the fourth layer of the OSI model; the Application Load Balancer is the one that functions at the seventh layer and evaluates the request itself.
- B is wrong: Azure DNS is the managed DNS service and performs no load balancing; Microsoft documents Application Gateway as operating at OSI layer 7 and routing on URL paths and host headers.
- C is wrong: Cloud Interconnect is Google Cloud’s dedicated circuit to an on-premises network, not a load balancer; Google documents the Application Load Balancer as a proxy-based Layer 7 load balancer.

### 13.

What single fact makes a subnet public on AWS?

- **A.** A checkbox on the subnet's own configuration marked 'public'.
- **B.** Association with a route table that contains a route to an internet gateway — nothing on the subnet itself records this.
- **C.** Attachment of an internet gateway to the virtual private cloud, regardless of any subnet's route table.
- **D.** Assignment of a reserved static address to at least one instance in the subnet.

**Answer: B.** This is the mechanism behind the public/private classification: associating a subnet with a route table that contains a route to an internet gateway is what makes that subnet public, and nothing on the subnet records the fact.

- A is wrong: AWS exposes no such attribute on the subnet object; the classification is derived entirely from the associated route table's contents.
- C is wrong: Attaching the gateway to the network makes it available as a route target; a subnet only becomes public once its own route table actually routes to that gateway.
- D is wrong: A reserved address changes nothing about routing; a subnet's public-or-private classification depends on its route table, independent of what addresses its instances hold.

### 14.

A route table carries a route to a peering connection for a narrow slice of address space, and a broader default route to an internet gateway. A packet is addressed inside that narrow slice. Which route wins?

- **A.** The default route to the internet gateway, since default routes always take priority as the catch-all.
- **B.** The route to the peering connection, because matching is by most specific prefix first, and it matches more precisely than the default route.
- **C.** Neither — the subnet's own address range always takes priority over any listed route.
- **D.** The peering connection is unreachable regardless of the route, since peering requires non-overlapping ranges first.

**Answer: B.** Matching is by destination address, most specific route first, so a narrower route beats a broader default route for a packet addressed inside that narrower range.

- A is wrong: A default route is the least specific possible match and is used only when nothing more specific applies; it does not override a more specific matching route.
- C is wrong: The subnet's own range is covered by the automatic local route, which is a separate entry from either route named here and is not what this question is asking about.
- D is wrong: Whether the ranges overlap governs whether the peering connection could be created at all; given that it exists and has a route, this question is only about which route a specific packet matches.

### 15.

How does Google Cloud's approach to route tables differ from AWS's and Azure's?

- **A.** It does not differ — all three associate a route table with each subnet individually.
- **B.** Google Cloud has no routing mechanism at all, relying entirely on firewall rules.
- **C.** Google Cloud defines routes at the network level, matched by destination and network tag, rather than associating a distinct route table with each subnet.
- **D.** Google Cloud requires a NAT gateway to be named explicitly in every route, unlike AWS or Azure, since a route's target is assumed to always resolve to a provisioned gateway resource of some kind.

**Answer: C.** AWS and Azure both associate a route table with a subnet; Google Cloud instead defines routes at the network level, matched by destination and by instance tag.

- A is wrong: AWS and Azure do associate route tables per subnet, but Google Cloud defines routes at the network level instead; treating all three as identical here misses the documented difference.
- B is wrong: Google Cloud does route traffic, including a system-generated default route; it simply defines routes at the network rather than the subnet level, which is a different claim than having no routing mechanism.
- D is wrong: A route's target can be many things — a peering connection, a VPN gateway, the default internet gateway, and so on — not exclusively a NAT gateway, on any of the three providers.

### 16.

A design places three resources into three different subnets of the same virtual private cloud, with no other network configuration made. Which best describes the isolation those resources have from each other?

- **A.** None by default, since subnets in the same network can route to each other; isolation is a property of the virtual private cloud, not of splitting it into subnets.
- **B.** Complete isolation, because putting each resource in its own subnet is exactly what creates an isolation boundary, the same boundary a virtual private cloud itself is supposed to provide between two separate networks.
- **C.** Isolation depends entirely on whether a network ACL has been attached to each subnet.
- **D.** Isolation only from the internet, since a private address range is not routable from outside.

**Answer: A.** A subnet is a slice of a network's address range where resources are placed and routing is attached; the virtual private cloud, not the subnet, is where isolation actually lives.

- B is wrong: Isolation belongs to the virtual private cloud as a whole; two subnets carved from the same network route to each other by default, so this reassigns the network's property to the subnet.
- C is wrong: A network ACL filters traffic reaching a subnet; it does not create the routing isolation the question asks about, which subnets lack by default regardless of filtering rules.
- D is wrong: The question asks what isolation the three resources have from each other, and internet reachability is a separate matter decided by the subnet's route table rather than by the resources sitting in different subnets.

### 17.

A deployment needs resources spread across three availability zones in one region. On AWS, how many subnets does that require, and why does the same question have a different answer on Azure and Google Cloud?

- **A.** Three everywhere, because a subnet is confined to one Availability Zone on every major provider.
- **B.** One everywhere, because the virtual private cloud itself already spans every zone in the region on all three providers, which would make the three-zone requirement trivial regardless of which provider's subnet rules apply to the deployment.
- **C.** Three on AWS, because a subnet is confined to a single Availability Zone there; on Azure, subnets span every zone in the region, and on Google Cloud a subnet is a regional resource reachable from any zone in it, so one subnet suffices on either.
- **D.** Three on AWS and Azure, one on Google Cloud, because route tables are associated per subnet on the first two, and a per-subnet route table is assumed to be what forces a subnet to stay inside one zone.

**Answer: C.** AWS documents that each subnet must reside entirely within one Availability Zone; Azure and Google Cloud both diverge from that, in slightly different ways, and generalising AWS's rule across providers is the predictable error.

- A is wrong: This is the AWS-specific rule generalised past where it holds — Azure and Google Cloud do not confine a subnet to a single zone.
- B is wrong: The network's regional scope is a separate fact from the subnet's zone relationship, and conflating the two produces the wrong answer for AWS, where the subnet — not the network — is what is zone-confined.
- D is wrong: Route table association is a separate mechanism from zone-scoping; Azure's subnets span every zone despite also carrying a per-subnet route table.

### 18.

Which packet-filtering layer attaches directly to a subnet on AWS but has no equivalent per-subnet attachment on Google Cloud, which instead configures the same kind of rule on the network as a whole?

- **A.** The private address range, since AWS assigns it per subnet and Google Cloud assigns it per network, reflecting how differently the two providers scope a virtual private cloud's overall address space.
- **B.** A network ACL, which AWS associates with a subnet, while Google Cloud's VPC firewall rules are configured on the network and enforced at the instance.
- **C.** A security group, since it is stateful only on AWS and stateless on every other provider.
- **D.** A route table, since Google Cloud has no notion of routing at all.

**Answer: B.** Where a route table and the stateless filtering layer attach differs by provider: AWS and Azure associate a route table with the subnet, and only AWS offers a subnet-attached network ACL, while Google Cloud attaches equivalents at the network level instead.

- A is wrong: Both providers give the address range to the subnet; the network in both cases only supplies the parent block the subnet's range is carved from.
- C is wrong: Security groups are stateful on every provider that offers the concept; state is not what varies by attachment point here.
- D is wrong: A route table directs traffic rather than filtering it, so it is not the layer this question asks about; Google Cloud does route traffic, defining routes at the network level rather than per subnet.

### 19.

A subnet is carved from a block nominally sized for 256 addresses. Why does the number of addresses actually available to resources come out lower than that raw arithmetic?

- **A.** The provider reserves some addresses in every subnet for its own use, so the usable count is always below the raw arithmetic.
- **B.** CIDR planning requires holding back addresses in every subnet for future peering connections, a reservation made well before any specific connection is ever requested.
- **C.** Reserved static addresses are automatically subtracted from the subnet's pool.
- **D.** It does not — the full nominal address count in a subnet is always available to resources.

**Answer: A.** The provider reserves a small number of addresses in every subnet for its own infrastructure, so a subnet's usable capacity is consistently lower than its nominal block size implies.

- B is wrong: Peering does not reserve addresses within a subnet; the reduction described here comes from the provider's own reserved addresses, not from planning for future connections.
- C is wrong: Reserved public addresses are a separate, quota-limited resource assigned to instances; they are not carved out of a subnet's private range.
- D is wrong: Every major provider withholds a handful of addresses per subnet for its own use, so the raw arithmetic overstates what is actually usable.

### 20.

A team needs to join their on-premises data centre to a cloud network by Friday, on a small budget, and expects the answer to differ from what they'd choose if predictable bandwidth mattered more than speed of setup. What should they choose, and how does that decision differ from connecting two cloud networks to each other?

- **A.** Peering, since it is the fastest way to join any two networks regardless of where they sit.
- **B.** A dedicated circuit, since it is always the more secure and therefore correct default choice, whatever the deadline or budget a particular team happens to be working against.
- **C.** A site-to-site VPN, since it needs only a public endpoint at each end and can be configured on equipment already owned; connecting two cloud networks instead uses peering, which reaches a network the provider already runs rather than one it does not.
- **D.** Either option, since the choice is really about which addressing scheme each network already uses, and cost or setup time are treated as secondary once the addressing question has been settled, regardless of how tight the deadline or how small the budget actually is.

**Answer: C.** A site-to-site VPN needs only a public endpoint at each end and is a configuration task on equipment already owned, making it the fit for a short deadline and small budget; a dedicated circuit trades that speed for predictability.

- A is wrong: Peering connects two networks the same cloud provider already runs; an on-premises data centre is outside the provider's cloud entirely, so peering has no path to it at all.
- B is wrong: 'More secure' is not a single axis here: a dedicated circuit gives a private path but does not itself encrypt payload, and it has to be physically provisioned by a connectivity provider — far too slow for a Friday deadline on a small budget.
- D is wrong: Addressing scheme choice matters for avoiding an overlap either way, but it is not what discriminates between a VPN and a dedicated circuit — cost and setup time, which the scenario supplies directly, are.

### 21.

A dedicated circuit connects an on-premises network to the cloud without touching the public internet. Is the traffic on it encrypted?

- **A.** Not inherently — the circuit provides a private path, which is a separate property from encryption of the payload, and encryption there is a decision made separately from choosing the circuit.
- **B.** Yes, automatically, because never touching the public internet is the same thing as being encrypted.
- **C.** Yes, in the same way AWS encrypts all inter-Region peering traffic before it leaves its facilities, treating a dedicated circuit and a peering connection as interchangeable for this purpose.
- **D.** Yes, as long as a security group rule requiring encrypted traffic is attached to the circuit.

**Answer: A.** A dedicated circuit establishes a private path that never enters the public internet, but encryption of the payload is a separate decision from that path's privacy — the two properties are not the same thing.

- B is wrong: Microsoft states plainly that by default traffic over an ExpressRoute connection is not encrypted; keeping traffic off the public internet is a property of the path, not of the payload.
- C is wrong: That documented encryption applies to peering between two cloud networks on AWS's own backbone; a dedicated circuit to an on-premises site is a different mechanism and is not covered by that same guarantee.
- D is wrong: Security groups filter by address, port, and protocol; they have no mechanism for imposing encryption on a dedicated circuit's payload.

### 22.

A dedicated circuit is being provisioned between an on-premises network and a cloud network, and the two happen to use overlapping private address ranges. Does the dedicated circuit avoid the addressing problem that would break a peering connection?

- **A.** Yes — the addressing constraint is specific to peering, since only peering merges two address spaces.
- **B.** No — overlapping ranges break a dedicated circuit connection just as they break peering; the addressing constraint is not something a private path avoids.
- **C.** Yes, because a dedicated circuit is provisioned by a connectivity provider who resolves any overlap automatically before activation.
- **D.** Yes, because the on-premises side's route table can be configured to prefer the more specific range.

**Answer: B.** A dedicated circuit does not remove the addressing constraint: overlapping ranges between the on-premises network and the cloud network break the connection just as they break peering.

- A is wrong: Microsoft states the overlap bar for an on-premises network in the same breath as for another virtual network, so the constraint is not specific to peering.
- C is wrong: No such automatic resolution is documented for either mechanism; a connectivity provider physically provisions the circuit but does not re-address either network to fix an overlap.
- D is wrong: A more-specific-route preference resolves ambiguity between two distinct, non-overlapping ranges; it does nothing to reconcile addresses that genuinely overlap between the two sides.

### 23.

Which pairing of provider and dedicated-circuit product name is correct?

- **A.** AWS's is ExpressRoute and Azure's is Direct Connect — the names are commonly swapped.
- **B.** AWS's is VPC Peering, since that is AWS's private connectivity product.
- **C.** AWS's is Direct Connect, Azure's is ExpressRoute, and Google Cloud's is Cloud Interconnect.
- **D.** Google Cloud's is Private Service Connect, its private-endpoint product.

**Answer: C.** AWS's dedicated-circuit product is Direct Connect, Azure's is ExpressRoute, and Google Cloud's is Cloud Interconnect — three different names for the same mechanism.

- A is wrong: ExpressRoute is Microsoft's product name and Direct Connect is AWS's; swapping them is exactly the mix-up this fact exists to catch.
- B is wrong: VPC Peering connects two AWS networks to each other; it is not the dedicated-circuit product for reaching an on-premises site, which is Direct Connect.
- D is wrong: Private Service Connect is Google Cloud's mechanism for privately reaching managed services, not its dedicated on-premises circuit product, which is Cloud Interconnect.

### 24.

A design states two requirements: 'users must reach the web tier from the internet' and 'the application servers must download patches but must never be reachable from outside.' Which routing target satisfies each?

- **A.** Making the web tier's subnet public and the application tier's subnet private satisfies both requirements on its own, with no gateway needed.
- **B.** An internet gateway for the web tier's two-way reachability, and a NAT gateway for the application servers' outbound-only reachability.
- **C.** A security group for the web tier and a network ACL for the application servers.
- **D.** A NAT gateway for both, since it is the safer default and can be configured for two-way reachability if needed.

**Answer: B.** An internet gateway grants two-way reachability, and a NAT gateway grants outbound-only reachability; mapping a stated requirement to the correct target is the direction question this concept turns on.

- A is wrong: The public/private classification is itself derived from which gateway a subnet's route table points at; it is not an alternative to attaching the gateways, it is a description of having done so.
- C is wrong: Both of those are filtering layers that decide which traffic is allowed once it arrives; neither grants or withholds the reachability direction itself, which is what the routing targets do.
- D is wrong: A NAT gateway's one-way property comes from address translation, not from a rule that can be switched to two-way; it structurally cannot give the web tier the inbound reachability it needs.

### 25.

A topology places a public NAT gateway inside the private subnet it is meant to serve, reasoning that keeping it close to the resources is simplest. What is wrong with that placement?

- **A.** A public NAT gateway must sit in a public subnet, with an Elastic IP, and route the private subnets' traffic to it from there; placing it in the private subnet it serves inverts the intended layout.
- **B.** Nothing — a NAT gateway works from either a public or a private subnet as long as it has an internal route.
- **C.** Nothing is wrong with the gateway; the real problem is that the subnet was never reclassified as public first, and reclassifying it would supposedly move the gateway to a valid location automatically.
- **D.** Nothing is wrong with the placement; a security group rule should be added instead to fix reachability.

**Answer: A.** A public NAT gateway is provisioned in a public subnet and serves the private subnets that route their default traffic to it, from where it is routed on to the internet gateway; placing it in the private subnet it serves is a documented inversion of the intended layout.

- B is wrong: AWS's own architecture puts the public NAT gateway in a public subnet specifically so it can reach the internet gateway; placed in a private subnet it would have no route out either.
- C is wrong: Reclassification is not the missing step here — the NAT gateway itself needs to sit in a subnet with a route to an internet gateway, which is a placement decision distinct from any subnet's own public/private status.
- D is wrong: The reachability problem here is architectural — the gateway has nowhere to route outbound traffic — and no filtering rule addition changes where a gateway needs to sit.

### 26.

An internet gateway is attached to a virtual private cloud, and a route to it is added to a subnet's route table. An instance in that subnet has no public or Elastic IP address. Is the instance reachable from the internet?

- **A.** No. Without a public address on the instance itself, the gateway and the route are not enough; nothing external has an address to send traffic to.
- **B.** Yes — attaching the gateway and routing to it is what makes every instance in the subnet reachable.
- **C.** Yes, because the subnet is now classified as public by definition once the route exists.
- **D.** Yes, as long as the instance is assigned a reserved static address rather than an ephemeral one.

**Answer: A.** An internet gateway alone does not expose anything: without a public address on the resource, and a route pointing at the gateway, nothing is reachable from outside.

- B is wrong: An internet gateway and a route only provide the path; a resource still needs its own public address for anything outside the network to address it.
- C is wrong: The subnet is indeed public by this definition, but public classification describes the subnet's routing, not whether any particular instance in it has an address that makes it individually reachable.
- D is wrong: Either kind of public address would satisfy the addressing requirement; the instance here has neither, so the reserved-versus-ephemeral distinction does not change the answer.

### 27.

Which statement about naming an internet-gateway equivalent across the three major providers is accurate?

- **A.** None of the three names an equivalent; AWS's internet gateway is the only such resource in the industry, with Azure and Google Cloud instead handling inbound reachability through routing rules that carry no dedicated resource name at all.
- **B.** All three name it the same way Azure names its per-subnet outbound-access property.
- **C.** Azure names it as part of its VNet Peering feature instead of as a standalone resource, treating internet reachability and network-to-network peering as one and the same mechanism.
- **D.** Google Cloud's routing documentation names a 'default internet gateway' as the next hop of the system-generated default route it adds to every VPC network, rather than as a resource you attach the way AWS does.

**Answer: D.** Google Cloud names a next hop for its system-generated default route as a default internet gateway, while Azure has no separately named gateway resource at all, relying instead on explicit outbound methods.

- A is wrong: Google Cloud does document a named next hop, its 'default internet gateway', so AWS is not the only provider that names the role.
- B is wrong: The outbound-access property is Azure's own subnet-level setting for outbound reachability, not a named gateway resource, and it is not how AWS or Google Cloud represent the equivalent concept.
- C is wrong: Peering connects two networks to each other privately and has no role in granting internet reachability, which is what an internet gateway equivalent is about.

### 28.

A private subnet's resources reach a managed object storage service through a NAT gateway to the service's public endpoint, incurring internet egress charges along the way. What alternative removes both the NAT hop and the public routing?

- **A.** A peering connection to the provider's own network hosting the storage service.
- **B.** A private service endpoint — it connects the subnet to the service as if it were inside the network, needing no internet gateway, NAT device, or public IP address.
- **C.** A larger NAT gateway sized to handle the additional egress traffic.
- **D.** Assigning the resources public IP addresses so they can reach the service directly, treating a public address as equivalent to a private connection that never leaves the provider's network.

**Answer: B.** AWS documents PrivateLink as connecting a VPC to services and resources as if they were in that VPC, with no internet gateway, NAT device, or public IP address needed — improving security posture and removing the internet egress a NAT path would otherwise bill.

- A is wrong: Peering joins two whole networks and carries the overlapping-address constraint that comes with that; a private endpoint instead exposes one specific service to the network without joining anything else, and without that constraint.
- C is wrong: Scaling the NAT gateway would still route traffic out to the service's public endpoint over the internet, incurring the same egress cost the requirement is trying to remove.
- D is wrong: Public addresses would let the resources be individually reachable from the internet, the opposite of what a private subnet is for, and would not remove the internet egress path the requirement asks to avoid.

### 29.

Which of the following correctly names the private-endpoint mechanism for each provider?

- **A.** AWS's is Private Service Connect, since AWS pioneered private connectivity to managed services.
- **B.** AWS's is PrivateLink, Azure's is Private Link, and Google Cloud's is Private Service Connect.
- **C.** Azure's is ExpressRoute, since that is Azure's private-connectivity product.
- **D.** Google Cloud's is VPC Network Peering, its private-connectivity product.

**Answer: B.** AWS's version is PrivateLink, Azure's is Private Link, and Google Cloud's is Private Service Connect — functionally equivalent private-endpoint mechanisms under three different names.

- A is wrong: Private Service Connect is Google Cloud's name for this mechanism; AWS's is PrivateLink, a distinct product name despite the similar underlying idea.
- C is wrong: ExpressRoute is Azure's dedicated circuit to an on-premises network, a hybrid-connectivity product; Azure's name for a private endpoint to a managed service is Private Link, a different mechanism entirely.
- D is wrong: VPC Network Peering connects two Google Cloud networks to each other; the private-endpoint mechanism for reaching a managed service is Private Service Connect, a different product.

### 30.

A private endpoint is created for a managed database service, and DNS for the service's existing name is updated to resolve to the endpoint's private address. What has to change in the application code that already connects to that name?

- **A.** Nothing — existing clients keep working unchanged, since they already connect by name and the traffic now simply stays inside the provider's network.
- **B.** The application must be rewritten to call a new, endpoint-specific hostname, since a private endpoint is assumed to always introduce its own separate name rather than sit behind the existing one.
- **C.** The application's security group must be updated to allow the new private address range.
- **D.** The application must poll DNS more frequently to pick up the new record promptly.

**Answer: A.** An endpoint is created inside the network and given a private address from the network's own address space; DNS for the service name resolves to that address, so existing clients keep working unchanged while the traffic stays inside the provider's network.

- B is wrong: The private endpoint is placed behind the service's existing DNS name, which is exactly what lets existing clients keep working without any code change.
- C is wrong: Filtering rules may need review in general, but the question is specifically about what changes in the application code, which is nothing — the DNS-to-private-address substitution is transparent to the client.
- D is wrong: DNS record propagation speed is governed by TTL and caching behaviour generally; nothing about a private endpoint specifically requires more frequent polling by the application itself.

### 31.

An instance is replaced, and its public address changes with it because no reservation was ever made for it. What kind of address did it have?

- **A.** A DNS-mapped address, which changes automatically on instance replacement by design.
- **B.** A load balancer address, since load balancers always use ephemeral addressing.
- **C.** An ephemeral public address, drawn from the provider's pool and returned to it when the resource goes away.
- **D.** A reserved static address, since only reserved addresses are assigned to instances by default.

**Answer: C.** By default such addresses are ephemeral, released back to the provider's pool when the resource is deleted; a reserved static address is what survives instance replacement instead.

- A is wrong: DNS maps a name to whatever address is current; the reason the address itself changed here is that it was never reserved, not that DNS was involved.
- B is wrong: Whether an address is ephemeral or reserved is independent of whether it belongs to a load balancer or a single instance; a load balancer's address type is a separate design choice.
- D is wrong: A public address handed out automatically at launch is ephemeral; a reserved address has to be explicitly allocated to the account first, and would have survived the replacement, which this one did not.

### 32.

A failed instance must be replaced without waiting for any DNS record to update and re-cache, and without putting any additional network component in front of it. Which mechanism satisfies that?

- **A.** DNS failover, since it is designed to route around a failed resource automatically.
- **B.** A reserved static address remapped to the replacement instance; the address itself does not change, so no client has to learn anything new.
- **C.** A layer 4 load balancer placed in front of the instance.
- **D.** An ephemeral address reassigned to the new instance, since ephemeral addresses are the simplest option and require no quota-limited reservation to be made in advance.

**Answer: B.** A reserved address exists for exactly this purpose: it can be remapped to a different instance, masking an instance failure without waiting for any DNS record to be updated and re-cached.

- A is wrong: DNS failover changes which address clients are told to use and cannot take effect faster than caching allows, which is exactly the delay the requirement rules out.
- C is wrong: A load balancer would satisfy the DNS half of the requirement, but it is exactly the additional component in front of the instance that the requirement rules out.
- D is wrong: An ephemeral address is exactly what does not survive across instances predictably — reassigning it does not preserve the original address, so clients pointed at the old one would still fail.

### 33.

Why does AWS default to a limit of five Elastic IP addresses per account per Region rather than allocating them freely?

- **A.** IPv4 CIDR blocks are similarly limited to a narrow size range per network, and the two quotas share one cause.
- **B.** Peering connections are also capped at five per network, and the two limits are set together.
- **C.** It does not — Elastic IP addresses are unlimited, since they cost nothing when attached to a running instance.
- **D.** They are a scarce, quota-limited resource meant for failover remapping rather than for addressing every host by default.

**Answer: D.** Reserved addresses are a scarce resource and are quota-limited, which is itself a hint that they are meant for failover remapping rather than as the default way to address every host.

- A is wrong: The CIDR block size limit governs how large a virtual network's private address space can be; it is a different constraint from the separate quota on public reserved addresses.
- B is wrong: Peering connection limits are a separate quota entirely and unrelated to how many reserved public addresses an account may hold.
- C is wrong: AWS documents a default quota of five per Region and charges for every Elastic IP address whether it is in use or idle, so neither half of this option holds.

### 34.

An engineer wants to change a subnet from private to public on AWS and looks for a checkbox on the subnet labelled 'public'. What should they do instead, and why doesn't such a setting exist?

- **A.** Because 'public' and 'private' describe which route table a subnet is associated with, not a flag on the subnet itself, associate its route table with a route to an internet gateway.
- **B.** Attach a NAT gateway to the subnet, since that is the resource that grants outbound reachability, and outbound reachability is the property AWS's own documentation associates with becoming publicly reachable.
- **C.** Edit the local route that covers the network's own address range.
- **D.** Assign the instances in the subnet public IP addresses; that alone makes the subnet public.

**Answer: A.** AWS states the rule directly: association with a route table carrying a route to an internet gateway is what makes a subnet public, and no attribute on the subnet itself records that fact.

- B is wrong: A NAT gateway grants outbound-only reachability from a subnet that is already private; making a subnet public specifically means giving it two-way reachability via an internet gateway, not routing it through a NAT gateway.
- C is wrong: The local route handles intra-network traffic and is not touched to change reachability off the network; the default route to an internet gateway is what needs adding.
- D is wrong: A public IP address does nothing without a route — instances in a subnet with no route to an internet gateway remain unreachable no matter what address they hold.

### 35.

On Azure, a subnet's outbound-access property is set so the subnet has no implicit outbound path. What does Microsoft call the result, and how does that differ from the AWS route-table framing this pair of terms is normally described in?

- **A.** The same as AWS — Azure also determines this purely by which route table is associated with the subnet, with no additional subnet-level property involved in the decision at all, unlike the AWS mechanism this pairing is normally compared against.
- **B.** A subnet with no NAT gateway attached, since Azure names the property after that resource.
- **C.** A subnet with an empty route table, since Azure also associates route tables per subnet.
- **D.** Microsoft calls that a private subnet; a subnet-level property directly controls the classification on Azure, unlike AWS, where there is no such attribute and only the associated route table decides.

**Answer: D.** Azure diverges from the AWS route-table-only framing by exposing a subnet property, `defaultOutboundAccess`, that Microsoft itself calls making the subnet private when disabled.

- A is wrong: Azure exposes a subnet property that Microsoft documents as directly governing outbound reachability; the route-table-only framing is AWS's, not portable to Azure without qualification.
- B is wrong: The property refers to outbound reachability generally, not specifically to whether a NAT gateway resource is attached.
- C is wrong: Azure does associate route tables per subnet, but the specific mechanism this question describes is the dedicated outbound-access property, not the presence or absence of a route table.

### 36.

On Google Cloud, an instance's external IP address is removed to stop it being reachable from the internet. Does this achieve the same result as removing a route on AWS, and why?

- **A.** No — Google Cloud subnets have their own route tables just like AWS, so removing the external IP changes nothing about reachability, since on that reading the subnet's route table association, not the instance's own address, is what would need to change instead.
- **B.** Yes in effect, but by a different mechanism, since Google Cloud has no per-subnet route table to re-point; reachability there turns on the instance's external IP plus the network-level default route and firewall rules, not on a subnet setting.
- **C.** No — only editing the network's system-generated default route changes reachability on Google Cloud.
- **D.** No — only attaching a NAT gateway resource achieves this, and Google Cloud requires one explicitly for any change in reachability.

**Answer: B.** Google Cloud has no per-subnet route table to move, so the same public/private question is answered per instance there rather than per subnet, through the external IP address plus firewall rules.

- A is wrong: Google Cloud defines routes at the network level, not per subnet, so there is no subnet route table for the external IP removal to interact with; removing the external IP does still change reachability, contrary to what this option claims.
- C is wrong: The default route is one ingredient, but Google's documented condition for outgoing access also depends on an egress firewall rule and either an external IP or Cloud NAT; the route alone is not the whole story, and it is untouched here.
- D is wrong: Google Cloud's Cloud NAT is optional infrastructure for outbound-only reachability; removing an instance's external IP is a separate, sufficient way to stop inbound reachability without provisioning Cloud NAT.

### 37.

A private subnet has a NAT gateway attached as its default route target. Which statement about it is accurate?

- **A.** It has no internet access at all, because 'private' means fully cut off.
- **B.** It can be reached from outside as long as its instances have public IP addresses.
- **C.** It can still reach out to the internet through the NAT gateway; it simply cannot be reached from outside.
- **D.** It can be reached from outside only if its route table also carries a local route, the entry every route table gets automatically for its own network's address range.

**Answer: C.** A private subnet routed through a NAT gateway can still initiate outbound connections; the classification only blocks unsolicited inbound reachability.

- A is wrong: This is the mirror-image trap the concept warns about: a private subnet with a NAT route reaches out perfectly well, it just cannot be reached.
- B is wrong: A public address alone does not create inbound reachability; that direction requires a route to an internet gateway, which this subnet's route table does not have.
- D is wrong: A local route only covers intra-network traffic and exists in every subnet automatically; it grants no reachability to or from the internet.

### 38.

A rule set allows inbound HTTP requests to reach a subnet's resources, but replies from those resources never make it back to the client. The subnet uses a stateless filtering layer with only an inbound allow rule written. Which layer is misconfigured, and what general mechanism does it belong to that a host's own firewall does not share this particular failure mode with?

- **A.** A host firewall inside the guest operating system, since firewalls are stateless by definition and therefore always share this exact symptom with any subnet-level filtering layer, regardless of how that host firewall happens to be configured.
- **B.** The route table, because a missing route would produce exactly this symptom.
- **C.** The network ACL, whose stateless evaluation means the reply must be allowed by an explicit outbound rule, unlike a security group or a typical host firewall, which is commonly configured to track connection state.
- **D.** The security group, because security groups are the layer that is stateless, so a rule allowing the inbound request would need a matching outbound rule written for it separately.

**Answer: C.** A security group is stateful and instance-level; a network ACL is stateless and subnet-level, so a reply that never returns is the signature of a missing outbound network ACL rule, not a broken application or an unrelated host firewall.

- A is wrong: Statefulness depends entirely on the implementation, not on the word 'firewall' itself; the layer described here — attached to the subnet with allow-and-deny rules evaluated in order — is a network ACL, not a host firewall.
- B is wrong: A missing route would prevent the reply from being sent anywhere at all, not selectively drop it after arrival at the filtering layer; the described symptom is the signature of a stateless rule set, not a routing gap.
- D is wrong: This reverses the split: a security group is the stateful layer, automatically allowing return traffic, while the network ACL is the one that requires it written explicitly.

### 39.

A requirement calls for blocking one specific malicious IP address from reaching every instance in a subnet, while allowing everything else. Which AWS layer can express that on its own, and which cannot?

- **A.** A security group can, since security group rules can be set to either allow or deny.
- **B.** A network ACL can, because it supports explicit deny rules; a security group cannot, because it carries allow rules only.
- **C.** Neither — blocking one address always requires a host-level firewall rule inside the operating system instead, since neither cloud filtering layer is treated as capable of an explicit deny.
- **D.** Neither — the subnet would need to be reclassified as private to block the address.

**Answer: B.** Because security groups carry allow rules only, an explicit deny of one address cannot be expressed there at all; the network ACL's allow-and-deny rule type is what the requirement actually needs.

- A is wrong: AWS security groups carry allow rules only — there is no deny rule type, so a single blocked address cannot be expressed there at all.
- C is wrong: The network ACL, a provider-managed layer outside the guest operating system, is exactly the tool documented for this: an explicit deny rule at the subnet level, with no host firewall needed.
- D is wrong: Public-versus-private classification governs whether a subnet has a route to the internet at all, not which individual addresses are allowed or denied once traffic can reach it.

### 40.

A network ACL has a low-numbered rule denying a specific address and a higher-numbered rule allowing all traffic. A security group on the same instances has both an equivalent deny attempt and an allow-all rule. What is the practical difference in how rule order matters between the two?

- **A.** For the network ACL, order decides the outcome: the lower-numbered rule is evaluated first and the deny wins; for the security group, there is no deny rule to order against, since it evaluates all of its rules before deciding and only supports allow.
- **B.** Neither layer is order-sensitive; only a host firewall's rule chain is evaluated in sequence.
- **C.** Both are order-sensitive in the same way, since both attach at the same level and evaluate their rules in the same ascending sequence until a match is found.
- **D.** Neither — rule order in both cases is overridden by whichever route table is associated with the subnet, since routing decisions are made before either filtering layer's rules are even consulted, on the reasoning that a route change could substitute for reordering a filtering rule.

**Answer: A.** Rule numbering only matters for the network ACL, which evaluates rules in ascending order until a match is found; a security group evaluates all of its allow-only rules together before deciding.

- B is wrong: The network ACL is explicitly evaluated in ascending rule number until a match is found, which is exactly the order-sensitivity this option denies it has.
- C is wrong: They attach at different levels — instance for the security group, subnet for the network ACL — and only the network ACL's evaluation is order-dependent; the security group considers all of its rules together.
- D is wrong: Route tables decide where traffic goes, not whether a filtering rule takes precedence over another; they have no bearing on how either filtering layer evaluates its own rules.

### 41.

A team migrating from AWS looks for Azure's equivalent of a network ACL to attach at the subnet level, separate from their Network Security Groups. What will they find?

- **A.** No separate stateless layer exists; Azure's Network Security Groups are themselves stateful, with no second, stateless filtering layer to migrate to.
- **B.** Azure Network Security Groups, since Microsoft's name for them is the direct equivalent of a network ACL.
- **C.** A host-level firewall configured inside each virtual machine's operating system.
- **D.** A subnet property comparable to the AWS route table's default target that toggles filtering on or off.

**Answer: A.** AWS's stateless, subnet-level network ACL has no equivalent on Azure or Google Cloud; both of those providers offer only a stateful filtering layer.

- B is wrong: The name is similar but the behaviour is not: Azure's NSGs are stateful, matching AWS's security group rather than its stateless network ACL.
- C is wrong: That would move the filtering inside the guest OS entirely, which is a different mechanism from a provider-managed, subnet-attached layer like AWS's network ACL.
- D is wrong: A subnet-level outbound-access property governs whether a subnet has outbound internet reachability at all; it is not a filtering rule set and has nothing to do with a stateless ACL equivalent.

### 42.

A team provisions an isolated, software-defined network inside a public cloud, choosing its own private address range instead of sharing the provider's default network. They are unsure whether this is best described as a VPC, a VPN, or a private cloud deployment. Which is it, and why?

- **A.** A cloud subnet, since address ranges are subdivided at the subnet level rather than the network level, and on AWS a subnet is additionally confined to a single Availability Zone.
- **B.** A virtual private cloud, meaning logically isolated multi-tenant infrastructure with a chosen address space, not a tunnel and not dedicated hardware.
- **C.** A VPN, because it establishes an encrypted tunnel between two networks over an untrusted path.
- **D.** A private cloud, since the word 'private' in the name means dedicated, single-tenant hardware.

**Answer: B.** The three terms collide on sound alone but name different things: a virtual private cloud is an isolation model on shared hardware, a VPN is an encrypted tunnel, and a private cloud is a deployment model on dedicated infrastructure.

- A is wrong: A subnet is a slice carved out of a network's range; the object being described here — the whole address space and isolation boundary — is the network itself, not a subdivision of it.
- C is wrong: That describes hybrid connectivity's site-to-site VPN case, an encrypted tunnel joining two networks — not a network in itself.
- D is wrong: This is the exact confusion the term invites: a virtual private cloud is logically isolated tenancy on shared hardware, not a deployment model built on dedicated infrastructure.

### 43.

Two teams each provision their own virtual private cloud for their applications. With no additional configuration, can a resource in one reach a resource in the other?

- **A.** No, because a firewall rule is blocking the traffic by default.
- **B.** Yes, as long as both networks were created in the same region.
- **C.** No. Resources in two different virtual networks cannot reach each other by default; a peering connection or private link is required.
- **D.** Yes, because both networks use subnets carved from the same private address ranges, and shared addressing from the same private ranges is what actually establishes reachability between two networks.

**Answer: C.** A virtual private cloud is the outermost isolation boundary in this competency: two of them cannot reach each other at all until an explicit peering connection or private link joins them.

- A is wrong: The block here is architectural, not a filtering rule — no security group or network ACL is even in play until the networks are connected.
- B is wrong: Region alignment does not create a route between separate networks; only an explicit peering connection or private link does.
- D is wrong: Shared addressing between two subnets in different networks is not itself a route — reachability across networks needs peering or a private link, not matching ranges.

### 44.

Which statement about the regional scope of a virtual private cloud is accurate across AWS, Azure, and Google Cloud?

- **A.** All three confine the network itself to a single availability zone, matching the subnet's own zone scoping.
- **B.** All three scope the network the same way they scope a subnet, even though AWS confines a subnet to one Availability Zone while Azure and Google Cloud do not confine the network that way at all.
- **C.** Scope is irrelevant here, because peering merges two networks into a single regional resource.
- **D.** A Google Cloud VPC network is a global resource whose subnets carry the regional scope, whereas an AWS VPC exists within one Region and an Azure virtual network's resources must all sit in its own region.

**Answer: D.** Scope differs by provider and is worth holding separately from a subnet's zone relationship: an AWS VPC and an Azure virtual network are regional, while a Google Cloud VPC network is not itself confined to one region.

- A is wrong: None of the three scopes the network itself to a zone; zone-scoping, where it exists, applies to the subnet, not to the network object.
- B is wrong: Subnet scoping is exactly where the three providers diverge (zone-confined, region-spanning, or regional), so this claim borrows the subnet's variability rather than describing the network.
- C is wrong: Peering connects two networks' address spaces at the routing level; it does not merge them into one resource with a single scope.

### 45.

A team is told their virtual private cloud's address range is permanently fixed once created, and plans to build a second network from scratch rather than requesting more space. Is that premise correct on AWS, Azure, or Google Cloud?

- **A.** Yes — the address range is locked at creation on every major provider, which is why the plan is necessary, and no secondary block, added address space, or subnet expansion can change that later.
- **B.** Only partially — the range can grow, but only after every existing subnet has first been re-addressed.
- **C.** No, because AWS supports secondary CIDR blocks, Azure supports adding address space, and Google Cloud supports expanding a subnet's primary range, so addressable space can grow on all three.
- **D.** No — but only because a new route table can absorb any size of network without limit.

**Answer: C.** The network's address range is not frozen at creation on any of the three major providers; the correction survives from the earlier AWS-only version of this competency.

- A is wrong: This is the corrected error the competency exists to catch: none of the three major providers freezes the range at creation.
- B is wrong: Growing the space (a secondary block, added address space, or subnet expansion) does not require re-addressing what already exists; re-addressing only becomes necessary if the growth would overlap another network.
- D is wrong: Route tables direct traffic and are unrelated to whether the underlying address space itself can be extended.

### 46.

Network A is peered with Network B, and Network B is peered with Network C. A needs to reach C. What does A have, and what would fix it?

- **A.** Nothing to C, because peering is non-transitive, so A needs a direct peering connection to C, or a transit/hub gateway service.
- **B.** A path to C through B automatically, since B is peered with both, and a peering relationship is assumed to extend transitively through any shared network the way a route would.
- **C.** A path to C, but only if A also establishes a VPN tunnel to C directly.
- **D.** A path to C as long as all three networks share the same CIDR block.

**Answer: A.** Peering is non-transitive: a hub-and-spoke arrangement gives the hub reachability to every spoke, but two spokes cannot reach each other through it without a direct peering or a transit service.

- B is wrong: AWS states peering relationships are not transitive: a peered network cannot be used as a transit point for another pair's traffic, so B being peered with both A and C creates no path between them.
- C is wrong: A VPN tunnel is the hybrid-connectivity mechanism for reaching a network the provider does not run, such as an on-premises site; A and C are both cloud networks within reach of ordinary peering, which is the more direct fix here.
- D is wrong: Sharing an address range would disqualify any peering connection outright, since overlapping ranges cannot be peered; distinct, non-overlapping ranges are the prerequisite, not the fix, for connecting A to C.

### 47.

A peering request is submitted between two virtual networks whose IPv4 CIDR blocks overlap. What happens?

- **A.** The request fails outright; a peering connection cannot be created between networks with matching or overlapping CIDR blocks.
- **B.** It succeeds, and the provider automatically re-addresses one side to resolve the overlap.
- **C.** It succeeds, since overlapping ranges only block a dedicated circuit, not a peering connection.
- **D.** It succeeds, but the resulting route table entries silently point at the wrong network.

**Answer: A.** Overlapping addressing disqualifies a peering connection outright: it cannot be created between networks whose CIDR blocks match or overlap, which is the genuine, surviving exam point in this area.

- B is wrong: No major provider re-addresses a network automatically to resolve an overlap; the peering request is instead rejected, and re-addressing one side manually is the only fix.
- C is wrong: Overlapping address ranges block both — a dedicated circuit and a peering connection both require non-overlapping ranges, so this reverses which mechanism the constraint applies to.
- D is wrong: The connection is never created in the first place when ranges overlap, so no route table entries are generated for it to misdirect.

### 48.

A team assumes their peering connection is unencrypted because they never configured any encryption setting for it. Are they right to be concerned?

- **A.** Yes — with no configured encryption, peering traffic travels the public internet in the clear.
- **B.** Yes — only a VPN tunnel provides any encryption, and peering has no equivalent, since nothing in a peering connection's setup ever asks the team to choose or manage an encryption method themselves, unlike the explicit tunnel configuration a VPN requires.
- **C.** Yes, unless a security group rule is added specifically to enable encryption, the same way an inbound rule is added to allow a particular kind of traffic through.
- **D.** Not necessarily. Encryption is not something you configure or control with peering, but the provider may still encrypt the underlying transport; AWS, for instance, documents encrypting all inter-Region peering traffic before it leaves its facilities.

**Answer: D.** With a VPN the encryption is a mechanism the team builds and terminates; with peering it is a property of the provider's fabric they neither configure nor control, and AWS documents encrypting inter-Region peering traffic on its own backbone.

- A is wrong: Peering traffic stays on the provider's own private backbone rather than traversing the public internet at all; the absence of a configured setting does not mean the absence of protection, and AWS documents encrypting inter-Region peering traffic regardless.
- B is wrong: A VPN's encryption is a mechanism the team builds and terminates themselves; peering's traffic protection, where it exists, is a property of the provider's fabric — the two are different arrangements, not one having encryption and the other having none.
- C is wrong: Security groups filter traffic by address, port and protocol; they have no setting that enables or disables encryption on a peering connection.

### 49.

A peering connection has just been accepted by both sides. Does traffic flow immediately?

- **A.** Yes — acceptance is the final step, and routing is configured automatically once both sides agree.
- **B.** Yes, as long as both networks' subnets are already classified as public.
- **C.** No — filtering rules on both sides must also be reviewed, and that alone is what remains.
- **D.** No — each side must still add routes for the other's address range; peering does not fill in routing automatically.

**Answer: D.** A peering connection is requested from one side and accepted from the other, after which each side must still add routes for the other's address range; peering does not merge the two networks or fill in routing automatically.

- A is wrong: Acceptance only establishes the connection itself; AWS documents that each side must separately add routes for the other's CIDR block before any traffic actually flows.
- B is wrong: Public-versus-private classification concerns a subnet's route to the internet, not the internal routes a peering connection needs between the two networks' own address ranges.
- C is wrong: Filtering rules do still apply and are worth reviewing, but the more fundamental gap immediately after acceptance is the absence of any route at all, without which filtering rules never even get evaluated.

