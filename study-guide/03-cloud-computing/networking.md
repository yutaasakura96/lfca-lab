# Networking

Networking is the competency that covers how an isolated virtual network is defined inside a
public cloud, how traffic is admitted to it and routed out of it, and how it is joined to
other networks. It sits in Cloud Computing Fundamentals, which is 18% of the exam — 2nd
largest of 6 domains on the current (2025-09-16) blueprint. The competency was added in the
2025 update, so nothing written before 2025 covers it, and LFS200 does not cover it either:
of its 14 concepts, 14 are NOT COVERED — 0/14 (0%) are not NOT COVERED, meaning the course
touches none of them at any depth (`research/lfs200-notes/00-course-map.md`). Every topic
below is sourced independently from provider documentation. The exam is vendor-neutral while
the industry's vocabulary is not, so each topic states the mechanism first and the three
providers' names for it second; the table below is the translation key, and a question that
names one vendor's product is nearly always asking about the mechanism in the left column.

**Provider name map**

| Mechanism | AWS | Azure | Google Cloud |
| --- | --- | --- | --- |
| Isolated virtual network | VPC | Virtual Network (VNet) | VPC network |
| Subdivision of that network | Subnet — confined to one Availability Zone | Subnet — spans every availability zone in the region | Subnet — a regional resource spanning zones in its region |
| Stateful, resource-attached filtering | Security group | Network security group (NSG) | VPC firewall rule |
| Stateless, subnet-attached filtering | Network ACL | No separate equivalent | No separate equivalent |
| Two-way internet path | Internet gateway (created and attached) | No named gateway resource — outbound requires an explicit method (NAT gateway, load-balancer outbound rules, or public IP) | Default internet gateway (next hop of the default route) |
| Outbound-only internet path | NAT gateway | Azure NAT Gateway | Cloud NAT |
| Reserved public address | Elastic IP | Static public IP | Static external IP address |
| Managed authoritative DNS | Route 53 | Azure DNS | Cloud DNS |
| Layer 4 load balancer | Network Load Balancer | Load Balancer | Network Load Balancer |
| Layer 7 load balancer | Application Load Balancer | Application Gateway | HTTP(S) Load Balancer |
| Network-to-network private link | VPC Peering | VNet Peering | VPC Network Peering |
| Dedicated circuit to on-premises | Direct Connect | ExpressRoute | Cloud Interconnect |
| Private reach to managed services | PrivateLink | Private Link | Private Service Connect |
| Managed administrative access | Systems Manager Session Manager | Azure Bastion | Identity-Aware Proxy |

<a id="s-networking-cloud-network"></a>
## Cloud network

<a id="c-cloud.networking.virtual-private-cloud"></a>
### Virtual private cloud
*id: `cloud.networking.virtual-private-cloud` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-vpc-configure-subnets, azure-virtual-network*

**What it is** An isolated, software-defined network you define inside a provider's shared
infrastructure, with private address ranges and subnets of your own choosing rather than a
share of the provider's default network. AWS calls it a VPC, Azure a Virtual Network, and
Google Cloud a VPC network; the isolation model is the same and is what the exam asks about.
It is not a VPN — that is an encrypted tunnel between networks, not a network — and it is not
a private cloud, which is a deployment model built on infrastructure dedicated to one tenant.
A virtual private cloud is logically isolated tenancy on shared public-cloud hardware.

**Why it matters** It is the outermost boundary every other concept in this competency hangs
from: subnets subdivide it, route tables belong to it, gateways attach to it, and peering
joins two of them. Resources in two different virtual networks cannot reach each other by
default at all — a fact that turns up in scenario questions as "the application can't reach
the database" where the real answer is that they were placed in separate networks with no
peering, not that a firewall rule is wrong.

**How it works** You allocate a private address range, carve subnets out of it, attach the
gateways that give the network a path off itself, and associate route tables that decide
where each subnet's outbound traffic goes. Scope differs by provider and is worth holding
separately: an AWS VPC and an Azure virtual network are regional, while a Google Cloud VPC
network is not itself confined to one region — its subnets are the regional resources. The
isolation is enforced in the provider's software-defined network fabric, not by giving you
physically separate hardware.

**Key terms** address space; isolation boundary; software-defined network; tenancy.

**Traps** Three near-identical phrases collide here. "Virtual private cloud" is an isolated
network inside a public cloud; "virtual private network (VPN)" is an encrypted tunnel joining
networks over an untrusted path; "private cloud" is a deployment model on single-tenant
infrastructure. Also, the network's address range is not frozen at creation on any of the
three major providers — AWS supports secondary CIDR blocks, Azure supports adding address
space, Google Cloud supports expanding a subnet's primary range — so "you can never change it
later" is a wrong answer even though careful up-front planning is still right.

**What the exam may test** Assigning a described artefact to the correct layer — network,
subnet, or routing target — and separating the virtual-private-cloud term from VPN and from
private cloud when all three appear as options to the same question.

*Not to be confused with [cloud subnets](networking.md#cmp-cloud.networking.cloud-subnets).*

<a id="c-cloud.networking.cloud-subnets"></a>
### Cloud subnets
*id: `cloud.networking.cloud-subnets` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-vpc-configure-subnets*

**What it is** A subdivision of a virtual network that reserves part of its address range for
a group of resources. The subnet is where a resource is actually placed, where a route table
is associated, and — on AWS — where the stateless filtering layer attaches.

**Why it matters** Subnet design is where availability and reachability are decided at the
same time. The zone relationship is the single most provider-specific fact in this
competency, and the one most often over-generalised: AWS documents that each subnet must
reside entirely within one Availability Zone and cannot span zones, so a multi-AZ deployment
needs one subnet per zone. Azure documents the opposite arrangement — virtual networks and
their subnets span all availability zones in a region — and a Google Cloud subnet is a
regional resource whose address range is available to instances in any zone of that region at
once. The word "subnet" is identical everywhere; the zone scoping is not.

**How it works** You give the subnet a CIDR block carved from the parent network's range, and
the provider reserves some addresses in it for its own use, so the usable count is always
lower than the raw arithmetic. Placement follows: a resource created in a subnet takes a
private address from that block, inherits the route table associated with the subnet, and — on
AWS — is subject to the network ACL associated with it. Whether the subnet can reach the
internet is not a property of the subnet; it is a property of the route table it is
associated with.

**Key terms** CIDR block; availability zone; route table association; regional versus zonal
resource.

**Traps** Carrying AWS's one-subnet-per-zone rule across to Azure or Google Cloud is the
predictable error, and it inverts the correct answer to any "how many subnets do I need for
three zones" question. The reverse error is treating the subnet as the isolation boundary:
two subnets in the same virtual network can route to each other by default, so putting a
database in "its own subnet" isolates nothing on its own — filtering rules or a separate
network do that.

**What the exam may test** Whether a described resource layout needs one subnet per zone or
one subnet for the region, and whether a stated reachability property belongs to the subnet
itself or to the route table associated with it.

<a id="cmp-cloud.networking.cloud-subnets"></a>
#### Not to be confused with: Cloud subnets vs Virtual private cloud
*compares: `cloud.networking.cloud-subnets`, `cloud.networking.virtual-private-cloud`*

| | Cloud subnets | Virtual private cloud |
| --- | --- | --- |
| What it names | A slice of an address range that resources are placed into | The whole isolated network and the address space it owns |
| Created | Second, from the parent network's range | First; the subnet cannot exist without it |
| Zone relationship | AWS: one Availability Zone only. Azure: spans every zone in the region. Google Cloud: a regional resource spanning its region's zones | AWS and Azure: regional. Google Cloud: the network itself is not confined to one region; its subnets are |
| What attaches to it | A route table association, and on AWS a network ACL | Gateways (internet, NAT), peering connections, the overall address space |
| Isolation strength | None by default — subnets in one network route to each other | Complete by default — two networks cannot reach each other without peering or a private link |

The separating axis is containment: the virtual private cloud is the isolation boundary and
the address space; a subnet is a slice of that space where resources are placed and routing
is attached. Isolation lives at the network level, placement and routing at the subnet level.

<a id="c-cloud.networking.public-vs-private-subnet"></a>
### Public vs private subnet
*id: `cloud.networking.public-vs-private-subnet` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-vpc-configure-subnets, aws-vpc-route-tables*

**What it is** A classification of a subnet by the routes available to it, not a setting on
the subnet. AWS states the rule directly: a subnet associated with a route table that has a
route to an internet gateway is a public subnet, and a subnet associated with a route table
that does not have such a route is a private subnet. A private subnet can still initiate
outbound connections indirectly, by routing through a NAT gateway.

**Why it matters** The standard secure layout — public subnets holding only load balancers
and NAT gateways, private subnets holding application servers and databases — is the layout
exam scenarios describe, and every question about "why can this host be reached" or "why can
this host not reach the package repository" resolves to which of these two a subnet is.

**How it works** Routing is evaluated against the destination address, most specific route
first. A public subnet's route table carries a default route (`0.0.0.0/0` for IPv4, `::/0` for
IPv6) whose target is the internet gateway; a private subnet's default route either does not
exist or points at a NAT gateway. AWS notes that instances in a public subnet must
additionally have a public IPv4 address or an Elastic IP to communicate over the internet
gateway, and conversely that instances in a private subnet cannot communicate with the
internet even if they do have public IP addresses, because there is no route.

**Key terms** default route; internet gateway target; NAT path; route table association.

**Traps** Two mirror-image errors. First, assuming a public IP address makes a host reachable:
without a route to an internet gateway it does not, because the packet has nowhere to go.
Second, assuming "private subnet" means "no internet at all": a private subnet with a NAT
route reaches out perfectly well, it simply cannot be reached. There is also no flag,
checkbox, or subnet attribute named "public" — moving the route is what changes the
classification, which is why the fix for an accidentally exposed subnet is a route table
change, not a subnet setting.

**What the exam may test** Given a route table and an address assignment, deciding whether a
host is reachable inbound, reachable outbound only, or unreachable in both directions — and
naming the single change that would alter that.

<a id="cmp-cloud.networking.public-vs-private-subnet"></a>
#### Not to be confused with: Public vs private subnet vs Internet gateway and NAT gateway
*compares: `cloud.networking.public-vs-private-subnet`, `cloud.networking.internet-gateway-and-nat-gateway`*

| | Public vs private subnet | Internet gateway and NAT gateway |
| --- | --- | --- |
| Category | A classification of a subnet, derived from its routes | Routing targets — actual resources a route can point at |
| Where it exists | Nowhere as an object; it is a description of a route table association | As a resource attached to the network (AWS internet gateway) or provisioned in a subnet (NAT gateway) |
| What it determines | Which of the two states a given subnet is in | Which direction of reachability a route grants: two-way (internet gateway) or outbound-only (NAT gateway) |
| Changed by | Associating a different route table, or editing the route | Creating, deleting, or re-targeting the gateway resource |
| Common wrong answer | "Set the subnet to public" | "Add a NAT gateway so the servers can be reached from outside" |

The separating axis is object versus description: the gateways are the things a route points
at; public and private are the names for what a subnet becomes once its route table points at
one of them.

<a id="c-cloud.networking.security-group-vs-network-acl"></a>
### Security group vs network ACL
*id: `cloud.networking.security-group-vs-network-acl` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-vpc-security-groups-vs-nacls*

**What it is** Two layers of cloud network filtering that differ on two axes at once, state
and attachment point. A security group is stateful and operates at the instance level: allow
an inbound request and the matching return traffic is automatically allowed back out. A
network access control list (network ACL) is stateless and operates at the subnet level, so
inbound and outbound must each be written explicitly or the reply is silently dropped.

**Why it matters** The stateful/stateless split is the crux of the concept and is very easy
to state backwards under time pressure. It also drives a real diagnostic pattern: a rule set
where requests arrive but replies never return is the signature of a stateless layer with a
missing outbound rule, not of a broken application.

**How it works** AWS's own comparison sets out five differences: level of operation is
instance versus subnet; scope is all instances associated with the security group versus all
instances in the associated subnets; rule type is allow rules only versus allow and deny
rules; rule evaluation considers all rules before deciding versus evaluating rules in
ascending order until a match is found; and return traffic is automatically allowed
(stateful) versus must be explicitly allowed (stateless). The other two providers do not
offer the second, stateless layer at all. Azure's network security groups are stateful and
are associated with a subnet or with a network interface. Google Cloud's VPC firewall rules
are stateful too, are configured on the VPC network rather than per subnet, and select their
targets by network tag or service account while being enforced at the instance.

**Key terms** stateful; stateless; return traffic; rule evaluation order; allow-only.

**Traps** Beyond reversing stateful and stateless, two consequences are testable in their own
right. Because security groups carry allow rules only, "block this one IP address" cannot be
expressed as a security group rule at all — on AWS that requires a network ACL deny rule.
And because the network ACL is evaluated in ascending rule order until a match is found,
rule numbering matters there in a way it never does for a security group, which evaluates all
of its rules before deciding. Neither layer is a substitute for the other: a security group
allow cannot rescue traffic a subnet's network ACL has already denied.

**What the exam may test** Choosing the correct layer for a described requirement — per-server
policy versus a blanket subnet rule, an allow versus an explicit deny — and predicting which
of the two would drop a reply that never came back.

<a id="cmp-cloud.networking.security-group-vs-network-acl"></a>
#### Not to be confused with: Security group vs network ACL vs Firewall
*compares: `cloud.networking.security-group-vs-network-acl`, `sysadmin.networking.firewall`*

| | Security group vs network ACL | Firewall |
| --- | --- | --- |
| What it names | Two specific provider-managed filtering layers and the difference between them | The general mechanism: filtering traffic by address, port, and protocol |
| Where it is enforced | In the provider's network fabric, outside the guest operating system | Anywhere the mechanism is implemented — a host's own kernel, an appliance, or a cloud layer |
| Configured through | The provider's control plane; no access to the instance is needed | Whatever owns the implementation — host tooling for a host firewall, the vendor's console for an appliance |
| Stateful | Security group yes, network ACL no | Depends entirely on the implementation |
| Default posture | Default-deny inbound, and the security group has no way to express a deny | Default-deny inbound with explicit allows is the standard posture |

The separating axis is generality: a firewall is the mechanism, while security groups and
network ACLs are two particular cloud implementations of it that happen to differ from each
other on state and attachment point. A question describing filtering inside the guest OS is
asking about a host firewall, not about either of these.

<a id="c-cloud.networking.internet-gateway-and-nat-gateway"></a>
### Internet gateway and NAT gateway
*id: `cloud.networking.internet-gateway-and-nat-gateway` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-vpc-internet-gateway, aws-vpc-nat-gateway*

**What it is** Two routing targets with opposite reachability. An internet gateway gives a
subnet's traffic two-way internet reachability: resources with a public address can be
reached from outside as well as reach outward. A NAT gateway gives outbound-only
reachability: resources behind it can connect to services outside the network, but external
services cannot initiate a connection to them.

**Why it matters** This is the direction question, and it is asked constantly in disguise:
"the servers must download patches but must not be reachable from the internet" is a NAT
gateway requirement, while "users must reach the web tier" is an internet gateway
requirement. Reaching for the wrong one is the single most common wrong answer in this part
of the competency.

**How it works** AWS's internet gateway is a resource you create and attach to a VPC; it
provides a target in route tables for internet-routable traffic and, for IPv4, performs the
network address translation between an instance's private address and its public one. A
public NAT gateway is provisioned in a *public* subnet with an Elastic IP, and the private
subnets it serves route their default traffic to it, from where it is routed on to the
internet gateway. The other providers arrange the same two directions differently: Google
Cloud's routing documentation names a "default internet gateway" next hop, which is what its
system-generated default route points at rather than something you provision, and offers
Cloud NAT for the outbound-only case; Azure has no separately named internet-gateway resource
at all, so outbound reachability comes from an explicit method attached to the deployment — a
NAT gateway associated with the subnet, outbound rules on a Standard Load Balancer, or a
public IP on the virtual machine — while inbound reachability still requires a public IP or a
public load balancer. Do not read that as "Azure gives it to you for free": Azure formerly
granted an implicit "default outbound access" to a virtual machine deployed without any
explicit method, and Microsoft is retiring it. Its documentation states that for the API
released after 31 March 2026 new virtual networks default to using private subnets, meaning
an explicit outbound method must be enabled in order to reach public endpoints, and the
portal already creates subnets as private by default.

**Key terms** routing target; two-way reachability; outbound-only; address translation.

**Traps** A NAT gateway is not a firewall. Its one-way property falls out of address
translation — there is no public address to send an unsolicited packet to — not out of any
rule you wrote, so it neither filters ports nor replaces a security group. The placement is
also inverted from intuition: a public NAT gateway lives in a public subnet and serves the
private ones, so "put the NAT gateway in the private subnet" is wrong. And an internet
gateway alone does not expose anything: without a public address on the resource, and a route
pointing at the gateway, nothing is reachable.

**What the exam may test** Mapping a stated reachability requirement onto the correct target,
and spotting the placement error in a described topology where a NAT gateway sits in the
subnet it is meant to serve.

*Not to be confused with [public vs private subnet](networking.md#cmp-cloud.networking.public-vs-private-subnet).*

<a id="c-cloud.networking.public-and-elastic-ip-addresses"></a>
### Public and elastic IP addresses
*id: `cloud.networking.public-and-elastic-ip-addresses` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-elastic-ip-addresses*

**What it is** A publicly routable address assigned to a cloud resource, in two flavours that
the exam wants distinguished. An ephemeral public address is drawn from the provider's pool
and returned to it when the resource goes away; a reserved static address is allocated to
your account and stays yours until you release it, which is what makes it survivable across
instance replacement. AWS calls the reserved form an Elastic IP, Azure a static public IP,
and Google Cloud a static external IP address.

**Why it matters** The reserved form exists for one purpose the exam cares about: it can be
remapped to a different instance, which masks an instance failure without waiting for any DNS
record to be updated and re-cached. The ephemeral form cannot do that, so any scenario whose
requirement is "the address must not change when we replace the server" rules it out.

**How it works** AWS documents the Elastic IP as a static IPv4 address allocated to the
account and yours until released, usable to mask the failure of an instance by rapidly
remapping the address to another instance in the same account. Reserved addresses are a
scarce resource and are quota-limited — AWS's default is five per Region — which is itself a
hint that they are meant for failover remapping rather than as the default way to address
every host.

**Key terms** ephemeral versus reserved; remapping; release; quota.

<a id="c-cloud.networking.cloud-dns"></a>
### Cloud DNS
*id: `cloud.networking.cloud-dns` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-route53*

**What it is** A managed, authoritative DNS service run by the cloud provider — it answers
queries for the zones you host in it — typically integrated with the provider's health
checking so that the answer returned can change when a resource fails. AWS's is Route 53,
Azure's is Azure DNS, Google Cloud's is Cloud DNS.

**Why it matters** The integration, not the product name, is the examinable part. AWS
documents Route 53 as performing three functions in any combination — domain registration,
DNS routing, and health checking — and documents DNS failover as the mechanism by which
traffic is routed away from an unhealthy resource to a healthy one when several resources
perform the same function.

**How it works** Health checks monitor an endpoint; records are associated with those checks;
when a check fails, the authoritative answer for that name stops pointing at the failed
endpoint. The important limitation is that this is DNS, so the change propagates only as fast
as resolvers and clients expire their cached answers — the record's TTL sets the floor on
failover time. That is the discrimination the exam wants: a load balancer removes an unhealthy
target from rotation behind a single unchanged endpoint, taking effect immediately, whereas
DNS failover changes which endpoint clients are told to use and cannot take effect faster
than caching allows.

**Key terms** authoritative; health check; DNS failover; TTL.

<a id="c-cloud.networking.cloud-load-balancer-types"></a>
### Cloud load balancer types
*id: `cloud.networking.cloud-load-balancer-types` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-elastic-load-balancing*

**What it is** Two classes distinguished by how much of the traffic they interpret. A layer 4
(transport-layer) load balancer forwards connections by address and port and does not read
the application protocol at all. A layer 7 (application-layer) load balancer parses the
request and can therefore make decisions on hostname, URL path, headers, or cookies. AWS
places its Network Load Balancer at the fourth layer of the OSI model and its Application
Load Balancer at the application layer, the seventh; Azure splits the same way between Load
Balancer and Application Gateway, and Google Cloud between its Network and HTTP(S) load
balancers.

**Why it matters** Requirements map onto the split cleanly, and the exam states them as
requirements rather than as layer numbers. "Route `/api` to one group of servers and
everything else to another", "terminate TLS at the balancer", or "match on the Host header"
are all layer 7 — a layer 4 balancer cannot see any of it. "Balance an arbitrary TCP or UDP
protocol", or "pass traffic through with minimal added latency", point at layer 4, which is
protocol-agnostic precisely because it does not parse anything.

**How it works** The layer 4 balancer makes its decision from the connection's addresses and
ports and forwards; the layer 7 balancer terminates the client connection, reads the request,
and opens or reuses a connection to a chosen backend, which is what lets it apply
content-based rules and per-request health awareness.

**Key terms** layer 4; layer 7; content-based routing; TLS termination.

<a id="c-cloud.networking.vpc-peering-and-private-connectivity"></a>
### VPC peering and private connectivity
*id: `cloud.networking.vpc-peering-and-private-connectivity` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: aws-vpc-peering, aws-privatelink*

**What it is** Connecting two networks privately at the IP level, so traffic never traverses
the public internet. All three providers use "peering" for the cloud-to-cloud case — VPC
Peering, VNet Peering, VPC Network Peering — and in each the traffic stays on the provider's
own backbone rather than routing over the internet.

**Why it matters** Peering is how separate networks that belong to you (per environment, per
team, per account or subscription) are made to talk without exposing anything publicly, and
its two hard limits are exactly the material a comparison question is built from.

**How it works** A peering connection is requested from one side and accepted from the other,
after which each side must add routes for the other's address range: peering does not merge
the two networks or fill in routing automatically, and filtering rules on both sides still
apply. AWS states the two limits plainly. Peering is non-transitive — a peering relationship
between A and B and another between B and C gives A no path to C. And overlapping addressing
disqualifies the connection outright: a peering connection cannot be created between networks
whose IPv4 or IPv6 CIDR blocks match or overlap, and adding a secondary CIDR block that
overlaps the other side's range causes the request to fail.

**Key terms** non-transitive; backbone; route propagation; overlapping CIDR.

**Traps** Non-transitivity is the trap the exam reaches for first, because a hub-and-spoke
diagram makes the wrong answer look obvious; a full mesh, or a transit/hub gateway service,
is what actually connects three or more networks. The second trap is treating peering as a
VPN: peering is not a tunnel you established, and it exposes no encryption setting you own,
terminate, or key-manage. That is not the same as saying the traffic is unencrypted — the
provider may encrypt the underlying transport, and AWS documents that all inter-Region
peering traffic is encrypted before leaving AWS facilities and always stays on the global AWS
backbone rather than traversing the public internet. The examinable difference is ownership:
with a VPN the encryption is the mechanism you built and terminate, whereas with peering it
is a property of the provider's fabric that you neither configure nor control. The third trap
is expecting connectivity the moment the connection is accepted — without routes on both
sides, nothing flows.

**What the exam may test** Whether a described three-network topology needs additional
peerings or a transit service, and why a peering request between two given address ranges
would be rejected before any routing is configured.

*Not to be confused with [hybrid connectivity](networking.md#cmp-cloud.networking.hybrid-connectivity).*

<a id="c-cloud.networking.hybrid-connectivity"></a>
### Hybrid connectivity
*id: `cloud.networking.hybrid-connectivity` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: azure-expressroute*

**What it is** Joining an on-premises network to a cloud network, by one of two mechanisms:
an encrypted VPN tunnel that runs across the public internet, or a dedicated private circuit
arranged through a connectivity provider that bypasses the internet entirely. AWS's
dedicated-circuit product is Direct Connect, Azure's is ExpressRoute, and Google Cloud's is
Cloud Interconnect.

**Why it matters** The exam turns this into a trade-off question, not a product question. A
site-to-site VPN needs only a public endpoint at each end and can be configured in hours, at
low cost — but it shares the public internet, so bandwidth and latency vary with conditions
nobody controls. A dedicated circuit has to be ordered and physically provisioned through a
partner or colocation facility, taking weeks and costing considerably more, and buys
predictability in exchange. Microsoft states the payoff for ExpressRoute directly: because
the connections do not go over the public internet, they offer more reliability, faster
speeds, consistent latencies, and higher security than typical internet connections.

**How it works** The VPN case builds an encrypted tunnel between an on-premises VPN device
and a cloud VPN gateway; the packets still travel the public internet, but confidentiality is
provided by the tunnel. The dedicated-circuit case establishes a private layer 2 or layer 3
path from your network into the provider's edge, so the traffic never enters the public
internet in the first place; encryption there is a separate decision, because privacy of path
is not the same property as encryption of payload.

**Key terms** site-to-site VPN; dedicated circuit; connectivity provider; predictable
latency.

**Traps** "More secure" is not a single axis: the VPN encrypts but rides a shared path, and
the dedicated circuit gives a private path whose payload is not encrypted merely by being
private. Setup time and cost are the discriminators an exam scenario actually supplies —
"needed by Friday, small budget" is a VPN answer regardless of how attractive a circuit
sounds. And a dedicated circuit does not remove the addressing constraint: overlapping ranges
between the on-premises network and the cloud network break the connection just as they break
peering.

**What the exam may test** Selecting VPN or dedicated circuit from a scenario's stated
constraints on time, cost, bandwidth predictability, and confidentiality — and recognising
that the choice is independent of which provider is named.

<a id="cmp-cloud.networking.hybrid-connectivity"></a>
#### Not to be confused with: Hybrid connectivity vs VPC peering and private connectivity
*compares: `cloud.networking.hybrid-connectivity`, `cloud.networking.vpc-peering-and-private-connectivity`*

| | Hybrid connectivity | VPC peering and private connectivity |
| --- | --- | --- |
| What it joins | An on-premises network to a cloud network | Two networks inside the same provider's cloud |
| Path | Encrypted tunnel over the public internet, or a dedicated circuit that avoids it | The provider's own private backbone |
| How it is provisioned | A VPN device plus a cloud VPN gateway, or a circuit ordered through a connectivity provider | A request from one network, accepted by the other, plus routes on both sides |
| Lead time | Hours for a VPN; weeks for a dedicated circuit | Minutes — it is a control-plane operation |
| Encryption | Inherent to the VPN case; a separate decision on a dedicated circuit | Not something you configure or control; the provider may encrypt the underlying transport — AWS encrypts inter-Region peering traffic — but peering is not a tunnel you established |
| Blocked by overlapping address ranges | Yes | Yes — the connection cannot be created at all |

The separating axis is which side of the cloud boundary the far end sits on: peering joins two
networks the provider already runs, so it is a control-plane action; hybrid connectivity
reaches a network the provider does not run, so it needs either a tunnel across the internet
or physical circuit provisioning.

<a id="c-cloud.networking.cloud-route-tables"></a>
### Cloud route tables
*id: `cloud.networking.cloud-route-tables` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-vpc-route-tables*

**What it is** The set of rules that decide where traffic leaving a subnet goes next, each
rule pairing a destination address range with a target. AWS creates a main route table with
the network and lets you associate more specific ones per subnet; Azure likewise associates a
route table with a subnet; Google Cloud instead defines routes at the network level, matched
by destination and by instance tag.

**Why it matters** This is the mechanism behind the public/private classification, and it is
worth stating as the mechanism rather than as trivia: associating a subnet with a route table
that contains a route to an internet gateway is what makes that subnet public. Nothing on the
subnet records the fact.

**How it works** Every route pairs a destination CIDR block with a target — an internet
gateway, a NAT gateway, a peering connection, a VPN or circuit gateway. Matching is by
destination address, most specific prefix first, so a `10.0.0.0/16` route beats a `0.0.0.0/0`
default route for a packet addressed inside that range. Two automatic entries matter: the
local route covering the network's own address range, which makes intra-network traffic work
without configuration and which you do not remove, and, in Google Cloud, a system-generated
default route whose next hop is the default internet gateway. A subnet with no explicit
association falls back to the network's main or default routing.

**Key terms** destination and target; most-specific match; local route; main route table.

<a id="c-cloud.networking.bastion-and-jump-hosts"></a>
### Bastion and jump hosts
*id: `cloud.networking.bastion-and-jump-hosts` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: azure-bastion*

**What it is** A single hardened, monitored entry point that administrators connect to first
and hop onward from, so that the private resources behind it need no inbound exposure of
their own. The traditional form is a self-managed jump box in a public subnet; the modern
form is a managed service — Azure Bastion, Google Cloud's Identity-Aware Proxy, or AWS
Systems Manager Session Manager.

**Why it matters** The concept concentrates administrative access at one auditable point
instead of scattering open SSH or RDP ports across every host, which is the difference the
exam tests. The managed services go one step further and remove the exposed port entirely:
Microsoft documents Azure Bastion as providing RDP and SSH connectivity to virtual machines
over TLS, with the virtual machines needing no public IP address, agent, or special client
software; AWS documents Session Manager as providing node management without opening inbound
ports, maintaining bastion hosts, or managing SSH keys.

**How it works** The administrator authenticates to the bastion or the managed service, which
holds the only path into the private network; the session to the target host is then made
over private addressing. Because every session passes through one place, session logging and
recording become possible in a way that per-host access never allows.

**Key terms** jump box; hardened host; session audit; agent-based access.

<a id="c-cloud.networking.cidr-planning-for-cloud-networks"></a>
### CIDR planning for cloud networks
*id: `cloud.networking.cidr-planning-for-cloud-networks` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-vpc-peering, azure-virtual-network*

**What it is** Choosing non-overlapping private address ranges — normally from RFC 1918's
`10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16` — for every virtual network up front, so
that any two of them can later be peered or privately connected. Two networks with
overlapping ranges cannot be joined without re-addressing one of them.

**Why it matters** The consequence is asymmetric, and that asymmetry is the whole point.
Running short of addresses is recoverable: the range is not locked at creation on any of the
three major providers — AWS supports associating additional, secondary CIDR blocks with an
existing VPC, Google Cloud supports expanding a subnet's primary IPv4 range in place, and
Azure supports adding address space to an existing virtual network. Discovering an overlap is
not recoverable in the same way, because by then subnets, peering connections, and
on-premises routes have all been built on the original range.

**How it works** You allocate each network a distinct block large enough for its subnets, and
keep a register so that no two networks — including partner and on-premises networks you may
later connect — collide. Provider constraints bound the choice: an AWS VPC's IPv4 CIDR block
must be between a `/16` and a `/28`, an existing block's size cannot be changed in place (a
second block is added instead), and any block added later must not overlap the network's
existing ranges or, on Azure, the address space of peered or on-premises networks.

**Key terms** RFC 1918; non-overlapping; secondary CIDR block; re-addressing.

<a id="c-cloud.networking.private-service-endpoints"></a>
### Private service endpoints
*id: `cloud.networking.private-service-endpoints` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: aws-privatelink*

**What it is** A mechanism for reaching a managed provider service — object storage, a
managed database, a message queue — over the provider's private network instead of routing
out to that service's public endpoint. AWS's is PrivateLink, Azure's is Private Link, and
Google Cloud's is Private Service Connect.

**Why it matters** Managed services are addressed by public DNS names by default, so a
resource in a private subnet reaching one of them normally sends the traffic outbound through
a NAT gateway to a public address. A private endpoint replaces that path: AWS documents
PrivateLink as connecting a VPC to services and resources as if they were in that VPC, with
no internet gateway, NAT device, public IP address, Direct Connect connection, or
site-to-site VPN needed. The result improves security posture and removes the internet egress
that the NAT path would otherwise bill.

**How it works** An endpoint is created inside your own network and given a private address
from your address space; DNS for the service name resolves to that address, so existing
clients keep working unchanged while the traffic stays inside the provider's network. This is
one-way and service-scoped, which is what separates it from peering: a private endpoint
exposes one service to your network, whereas peering joins two whole networks and therefore
carries the overlapping-address constraint that an endpoint does not.

**Key terms** private endpoint; service-scoped; DNS resolution to a private address; egress
cost.

#### Scenario

An application in a private subnet cannot reach its managed object storage, and the team's
first instinct is to give its instances public IP addresses. Work it through instead. The
instances sit in a subnet whose route table has no route to an internet gateway, which is
precisely what makes it private, so a public address changes nothing — there is no route to
carry the packet. Two correct fixes exist and they differ in kind: route the subnet's default
traffic to a NAT gateway sitting in a public subnet, giving outbound-only reachability, or
create a private endpoint for the storage service so the traffic never leaves the provider's
network at all. If replies still fail after the route is right, suspect the stateless layer:
a security group would have allowed the return traffic automatically, so a missing outbound
network ACL rule is the remaining candidate.

#### Knowledge check

1. What single change turns a private subnet into a public one, and what does *not*?
   Associating it with a route table that has a route to an internet gateway. Assigning
   public IP addresses to the instances does not — with no route, they are unreachable
   anyway; and there is no "public" attribute on the subnet itself to set.
2. State the two axes on which a security group and a network ACL differ, in the right
   direction.
   State and attachment point: the security group is stateful and attaches at the instance
   level, so return traffic is allowed automatically; the network ACL is stateless and
   attaches at the subnet level, so inbound and outbound rules must each be written.
3. A design calls for resources in three availability zones. How many subnets does that need
   on AWS, and how many on Google Cloud?
   On AWS, three — a subnet cannot span Availability Zones. On Google Cloud, one is enough,
   because a subnet is a regional resource whose range serves every zone in its region
   (Azure behaves like Google Cloud here: virtual networks and subnets span all availability
   zones in a region).
4. Network A is peered with B, and B with C. What can A reach, and what would it take to
   reach C?
   Only B. Peering is non-transitive, so A reaches C only via a direct A-to-C peering or a
   transit/hub gateway service — and only if their address ranges do not overlap.
5. Why is "you can never change a virtual network's address range after creation" wrong, and
   what is the true constraint?
   All three major providers allow the addressable space to grow — AWS secondary CIDR blocks,
   Azure added address space, Google Cloud subnet range expansion. The real constraint is
   overlap: two networks with overlapping ranges cannot be peered or privately connected
   without re-addressing one of them, and that is what up-front planning protects against.
6. A load balancer must send `/api` requests to one group of servers and everything else to
   another. Which layer, and why can the other one not do it?
   Layer 7. A layer 4 balancer forwards by address and port only and never parses the
   request, so the URL path is invisible to it.
