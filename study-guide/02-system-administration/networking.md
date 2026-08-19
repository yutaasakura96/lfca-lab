# Networking

Networking is the competency inside System Administration Fundamentals that covers how hosts
address each other, find each other by name, reach each other through routers, expose
services on ports, filter that traffic, and prove where a failure sits. Its domain carries
30% of the exam — 1st largest of 6 domains — and the competency's 2025 status is unchanged.
LFS200 barely touches it: of 49 concepts, 40 are NOT COVERED, 4 PARTIALLY COVERED, 2
MENTIONED ONLY and 3 FULLY COVERED — 9/49 (18%) are not NOT COVERED — so all but a fifth of
what follows is sourced independently against RFCs, man pages and vendor documentation
(`research/lfs200-notes/00-course-map.md`). This file is written to be read as a mechanism,
not a glossary: the sections run in the order a packet actually travels, and every topic is
taken to the point where the reader can name what the concept is *not*.

<a id="s-networking-models"></a>
## Models

<a id="c-sysadmin.networking.osi-model"></a>
### OSI model
*id: `sysadmin.networking.osi-model` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: itu-t-x200-osi-basic-reference-model-pdf*

**What it is** A seven-layer reference model for how communication functions stack: 1
Physical, 2 Data Link, 3 Network, 4 Transport, 5 Session, 6 Presentation, 7 Application. It
is a *reference* model — a vocabulary for describing and dividing responsibilities — not a
description of the protocol stack any modern host actually runs.

**Why it matters** Its practical value to an administrator is as a fault-isolation ladder.
"The application is broken" is not a diagnosis; "layer 1 is up, layer 2 has a MAC entry,
layer 3 pings, layer 4 refuses the connection" is. Exam scenarios that describe a symptom and
ask which layer to suspect are asking you to walk this ladder, and questions that name a
device or protocol and ask for its layer are pure recall of the list above.

**How it works** Each layer consumes the service of the layer below and adds its own header
on the way down — encapsulation. Layer 4 hands a segment to layer 3, which wraps it in an IP
packet, which layer 2 wraps in a frame with source and destination MAC addresses, which
layer 1 transmits as signal. The receiving host strips the headers in reverse order. The
protocol data unit has a different name at each level: bits at layer 1, frames at layer 2,
packets at layer 3, segments (TCP) or datagrams (UDP) at layer 4.

**Key terms** encapsulation; protocol data unit; layer numbering; reference model.

**Traps** The OSI model is not what the internet is built on — the internet implements the
four-layer TCP/IP model, and OSI's layers 5 and 6 have no separate existence in it. Layer
numbering runs from the physical medium *up*, so "lower layer" means closer to the wire, and
a "layer 3 problem" is a routing or addressing problem, not an application one. A "layer 3
switch" is a marketing name for a device that routes as well as switches; the phrase does not
make switching a layer 3 function. A hub is layer 1, a switch layer 2, a router layer 3, and
a firewall's layer depends entirely on what it inspects — a port-and-address filter is layer
3/4, an application-aware proxy is layer 7.

**What the exam may test** Placing a named device, protocol or address type at the right
layer (MAC at 2, IP at 3, TCP and UDP and port numbers at 4, HTTP and DNS and SSH at 7), and
choosing which layer a described symptom implicates before choosing a tool.

<a id="cmp-sysadmin.networking.osi-model"></a>
#### Not to be confused with: OSI model vs TCP/IP model
*compares: `sysadmin.networking.osi-model`, `sysadmin.networking.tcp-ip-model`*

| | OSI model | TCP/IP model |
| --- | --- | --- |
| Layer count | Seven | Four |
| Status | Reference model — a vocabulary for describing stacks | Descriptive model of the stack actually deployed, specified in RFC 1122 |
| Layer names | Physical, Data Link, Network, Transport, Session, Presentation, Application | Link, Internet, Transport, Application |
| Session and presentation | Separate layers 5 and 6 | No equivalent — those functions live inside the application layer |
| Physical and data link | Separate layers 1 and 2 | Collapsed into one link layer |
| Where you meet it | Troubleshooting vocabulary ("that's a layer 2 problem") | Protocol specifications and host requirements |

The separating axis is purpose: OSI is a teaching and troubleshooting vocabulary with seven
named layers; TCP/IP is the four-layer description of what hosts actually implement.
Everything else in the table follows from that.

<a id="c-sysadmin.networking.tcp-ip-model"></a>
### TCP/IP model
*id: `sysadmin.networking.tcp-ip-model` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1122-host-requirements, itu-t-x200-osi-basic-reference-model-pdf*

**What it is** The four-layer model the internet is genuinely built on, as set out in RFC
1122's host requirements: link, internet, transport, application. Every host on the internet
implements these four; nothing implements OSI's seven directly.

**Why it matters** When a question asks "which layer does IP operate at", the answer depends
on which model is named — internet layer in TCP/IP, layer 3 (network) in OSI. Candidates who
memorise one model and answer questions about the other lose marks on wording alone.

**How it works** The link layer moves frames across one physical segment and is where MAC
addressing, Ethernet and Wi-Fi live. The internet layer moves packets between networks and is
where IP, ICMP and ARP's output are used — this is the only layer that routes. The transport
layer provides host-to-host delivery and is where TCP and UDP and port numbers live. The
application layer holds everything above that: HTTP, DNS, SSH, SMTP, and also the formatting
and session handling OSI gives separate layers to.

**Key terms** link layer; internet layer; transport layer; RFC 1122.

**Traps** The model is named after two of its protocols, but "TCP/IP" as a model includes UDP
and ICMP too — a UDP-based application is still using the TCP/IP stack. The mapping to OSI is
not one-to-one in both directions: OSI 1 and 2 fold into the single link layer, and OSI 5, 6
and 7 fold into the single application layer, so any answer claiming a clean seven-to-four
correspondence is wrong. ARP sits awkwardly across the link/internet boundary — it carries
internet-layer addresses in a link-layer frame — which is why sources place it at "layer 2.5"
or at either side; the exam-safe statement is that ARP joins layer 3 addressing to layer 2
delivery.

**What the exam may test** Naming the four layers in order and matching a protocol to the
right one, and recognising when a question's layer number implies the OSI model rather than
this one.

*Not to be confused with [OSI model](networking.md#cmp-sysadmin.networking.osi-model).*

#### Scenario

A user reports that `https://intranet.example.com` will not load. Walk the stack rather than
guessing. Link layer: the interface is up and has a MAC address, so layer 1 and 2 are alive.
Internet layer: the host has an IP address and a default gateway, and can reach that gateway,
so layer 3 works locally. Application layer, but the *naming* part of it: the name resolves
to an address — if it did not, nothing above would ever be attempted. Internet layer again:
that address is off-subnet, so the packet is addressed to the gateway's MAC but keeps the
server's IP. Transport layer: the connection to port 443 is refused immediately rather than
timing out, which means the packet reached a host that had nothing listening. That single
observation eliminates every layer below transport and points at a stopped service, not a
network fault at all.

#### Knowledge check

1. Name the seven OSI layers in order from 1 to 7.
   Physical, Data Link, Network, Transport, Session, Presentation, Application.
2. Name the four TCP/IP layers, and say which OSI layers each absorbs.
   Link (OSI 1-2), Internet (OSI 3), Transport (OSI 4), Application (OSI 5-7).
3. Which model does the internet actually implement, and which one is the troubleshooting
   vocabulary?
   TCP/IP is implemented; OSI is the reference vocabulary.
4. A frame, a packet and a segment are the same data at different points. Which layer names
   each?
   Frame at layer 2, packet at layer 3, segment at layer 4 (a UDP one is a datagram).
5. Why is "a layer 3 switch proves switching is a layer 3 function" wrong?
   It is a device that both switches at layer 2 and routes at layer 3; the layer of a
   function does not change because one box performs two of them.

<a id="s-networking-ip-addressing"></a>
## IP addressing

<a id="c-sysadmin.networking.ipv4-address"></a>
### IPv4 address
*id: `sysadmin.networking.ipv4-address` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-791-internet-protocol, man7-ip-iproute2*

**What it is** A 32-bit identifier for one interface on one network, written as four decimal
octets separated by dots, each 0-255. It is split into a network portion and a host portion —
but the address alone does not say where the split falls. Only the subnet mask does.

**Why it matters** Every "are these two hosts on the same network" question, and therefore
every question about whether traffic needs a router at all, is decided by applying the mask to
both addresses. An address quoted without a mask is not enough information to answer, and the
exam sets questions that hinge on exactly that omission.

**How it works** `ip addr` prints each interface's addresses with the prefix length attached
(`192.0.2.15/24`), which is the mask in CIDR form. The kernel uses that prefix to derive the
on-link route for the subnet: destinations matching it are reached directly through the
interface; everything else goes to a router. One interface may carry several addresses, and
`ip addr` shows all of them.

**Key terms** octet; dotted decimal; network portion; host portion; prefix length.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip addr` | Show (or change) protocol addresses on interfaces | `show` is the default subcommand; `add`/`del` modify | `ip addr show enp0s3` | Reading only the address and ignoring the `/nn` prefix printed with it — the prefix is what decides which destinations are on-link |

**Traps** An address configured with `ip addr add` exists only until reboot; persistence
belongs to the distribution's configuration layer (Netplan, NetworkManager,
systemd-networkd), and a question about "making the change permanent" is not answered by an
`ip` command. `127.0.0.1` is a valid IPv4 address but never leaves the host. `0.0.0.0` in a
service's listening configuration means "every address on this host", not a specific one.

**What the exam may test** Deciding whether two given addresses are on the same subnet — which
always requires the mask — and knowing which command shows an interface's current addresses
versus which one would persist them.

<a id="cmp-sysadmin.networking.ipv4-address"></a>
#### Not to be confused with: IPv4 address vs IPv6 address vs MAC address
*compares: `sysadmin.networking.ipv4-address`, `sysadmin.networking.ipv6-address`, `sysadmin.networking.mac-address`*

| | IPv4 address | IPv6 address | MAC address |
| --- | --- | --- | --- |
| Size | 32 bits | 128 bits | 48 bits |
| Written as | Four dotted decimal octets | Eight colon-separated hex groups, zeros compressible with `::` | Six colon- or hyphen-separated hex octets |
| Layer | Internet / OSI 3 | Internet / OSI 3 | Link / OSI 2 |
| Crosses a router | Yes — preserved end to end | Yes — preserved end to end | No — rewritten at every hop |
| Assigned by | Administrator or DHCP | Administrator, DHCPv6, or self-configured from the router advertisement | The manufacturer (first 24 bits are the OUI), overridable in software |
| Shown by | `ip addr` | `ip -6 addr` | `ip link` |

The separating axis is scope: MAC identifies an interface on one link and is replaced at
every router; IP identifies an interface on the internetwork and survives every hop. IPv4 and
IPv6 differ only in address size and notation, not in that role.

<a id="c-sysadmin.networking.ipv6-address"></a>
### IPv6 address
*id: `sysadmin.networking.ipv6-address` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: rfc-4291-ipv6-addressing-architecture, rfc-1752-ipng-recommendation*

**What it is** A 128-bit address written as eight groups of four hexadecimal digits separated
by colons, adopted because 32 bits of IPv4 space could not cover the number of connected
devices. For LFCA this is recognition-level: read the notation, know the special addresses,
know why it exists.

**Why it matters** IPv6 addresses appear in `ip addr` output on almost every modern Linux
host whether or not the site routes IPv6, because every interface self-assigns a link-local
address. A candidate who cannot recognise `fe80::` will misread ordinary output as a
misconfiguration.

**How it works** Leading zeros within a group may be dropped, and one — only one — run of
all-zero groups may be replaced by `::`. So `2001:0db8:0000:0000:0000:0000:0000:0001`
compresses to `2001:db8::1`. `ip -6 addr` shows only the IPv6 addresses. `::1/128` is the
loopback, the IPv6 counterpart of `127.0.0.1`. `fe80::/10` is link-local: automatically
configured, never routed off the link, and ambiguous without a zone identifier, which is why
link-local addresses are written with an interface suffix such as `fe80::1%enp0s3`. A /64
prefix is the conventional size for a single LAN.

**Key terms** hexadecimal group; zero compression; link-local; `fe80::/10`; `::1`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip -6 addr` | Show IPv6 addresses only | `-6` restricts the address family; `-4` does the same for IPv4 | `ip -6 addr show enp0s3` | Concluding IPv6 is "configured" because a `fe80::` address is listed — link-local addresses appear with no IPv6 routing at all |

**Traps** `::` may appear at most once in an address, because two occurrences would make the
number of elided zero groups ambiguous. IPv6 has no broadcast address at all — its equivalent
functions use multicast, so "the IPv6 broadcast address" is a wrong answer by construction.
ARP is not used on IPv6; Neighbor Discovery over ICMPv6 replaces it.

**What the exam may test** Expanding or compressing a written IPv6 address correctly,
recognising `::1` and `fe80::` on sight, and stating why IPv6 was introduced (address
exhaustion) rather than any performance claim.

*Not to be confused with [IPv4 address](networking.md#cmp-sysadmin.networking.ipv4-address).*

<a id="c-sysadmin.networking.subnet-mask-and-cidr"></a>
### Subnet mask and CIDR
*id: `sysadmin.networking.subnet-mask-and-cidr` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: rfc-4632-cidr, rfc-791-internet-protocol*

**What it is** The mask marks where the network portion of an address ends and the host
portion begins. `255.255.255.0` (dotted decimal) and `/24` (CIDR prefix length) are two
notations for the same 24 leading one-bits, not two different things.

**Why it matters** Moving between the two notations under time pressure is an expected skill,
and the mask is the input to every other addressing calculation in this section: network
address, broadcast address, usable host count, and whether a destination is on-link or needs
the gateway.

**How it works** The prefix length counts the leading one-bits. Bits set in the mask belong to
the network; bits clear belong to the host. Usable hosts in an IPv4 subnet are
2^(32 − prefix) − 2, because the all-zero host address names the network and the all-one host
address is the broadcast.

| Prefix | Dotted decimal | Addresses | Usable hosts |
| --- | --- | ---: | ---: |
| /8 | 255.0.0.0 | 16777216 | 16777214 |
| /16 | 255.255.0.0 | 65536 | 65534 |
| /24 | 255.255.255.0 | 256 | 254 |
| /25 | 255.255.255.128 | 128 | 126 |
| /26 | 255.255.255.192 | 64 | 62 |
| /27 | 255.255.255.224 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 14 |
| /29 | 255.255.255.248 | 8 | 6 |
| /30 | 255.255.255.252 | 4 | 2 |

**Key terms** prefix length; dotted-decimal mask; CIDR; supernetting; longest prefix.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip addr` | Show the address together with its prefix length | `show dev NAME` narrows to one interface | `ip addr show dev enp0s3` | Expecting a dotted-decimal mask in the output — iproute2 prints CIDR (`/24`), and the conversion is yours to do |

**Traps** A larger prefix number means a *smaller* network: /26 is a quarter of a /24, not
four times it. The subtraction of two does not apply universally — RFC 3021 defines /31 as a
two-address point-to-point link with no network or broadcast address reserved, and /32 is a
single host route. CIDR replaced classful addressing precisely so that a mask no longer has
to be inferred from the first octet.

**What the exam may test** Converting `/26` to `255.255.255.192` and back, computing usable
host counts, and judging whether two addresses fall in the same subnet under a stated mask.

*Not to be confused with [IPv4 address classes](networking.md#cmp-sysadmin.networking.ipv4-address-classes).*
*Not to be confused with [network, host and broadcast addresses](networking.md#cmp-sysadmin.networking.network-host-and-broadcast-addresses).*

<a id="c-sysadmin.networking.network-host-and-broadcast-addresses"></a>
### Network, host and broadcast addresses
*id: `sysadmin.networking.network-host-and-broadcast-addresses` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-919-broadcasting-internet-datagrams, rfc-1122-host-requirements, rfc-2644-bcp34*

**What it is** Within any IPv4 subnet, the address whose host bits are all zero identifies the
network itself, and the address whose host bits are all one is the directed broadcast for that
network. Neither may be assigned to an interface. Everything between them is a usable host
address.

**Why it matters** Address-planning questions hand you a network and a prefix and ask for the
first usable address, the last usable address, or the broadcast. Getting the boundary wrong by
one is the single most common arithmetic error in this competency, and a host configured with
the network or broadcast address will not communicate.

**How it works** Take 192.168.10.0/26. The prefix leaves 6 host bits, so the block holds 64
addresses: 192.168.10.0 through 192.168.10.63. The network address is 192.168.10.0, the
broadcast is 192.168.10.63, and the usable range is 192.168.10.1 to 192.168.10.62 — 62
addresses. The next block of the same size starts at 192.168.10.64. A packet sent to the
broadcast address is delivered to every host in that subnet. RFC 919 defined a directed
broadcast as something gateways forward toward the target network; RFC 2644 (BCP 34) later
changed the required router default, so modern routers block receipt and forwarding of
directed broadcasts unless explicitly configured otherwise.

**Key terms** network address; directed broadcast; usable range; block boundary.

**Traps** 255.255.255.255 is the *limited* broadcast — local link only, never routed — and is
a different thing from a subnet's directed broadcast. The broadcast address depends on the
mask, not on the address ending in 255: in 10.0.0.0/16 the broadcast is 10.0.255.255, while in
10.0.1.0/24 the address ending in 255 (10.0.1.255) is the broadcast, whereas under the /16 the
same-looking 10.0.0.255 is an ordinary usable host address — a different subnet from
10.0.1.0/24 entirely, not a value inside it. IPv6 has no broadcast address of any kind.

**What the exam may test** Producing the network address, broadcast address and usable range
for a given CIDR block, and recognising that a host assigned the block's first or last address
is misconfigured.

<a id="cmp-sysadmin.networking.network-host-and-broadcast-addresses"></a>
#### Not to be confused with: Network, host and broadcast addresses vs Subnet mask and CIDR
*compares: `sysadmin.networking.network-host-and-broadcast-addresses`, `sysadmin.networking.subnet-mask-and-cidr`*

| | Network, host and broadcast addresses | Subnet mask and CIDR |
| --- | --- | --- |
| What it names | Three specific addresses inside a block, and the range between them | The boundary that defines where the block starts and ends |
| Is it an address | Yes — each is a concrete dotted-decimal value | No — it is a bit boundary, written `/24` or `255.255.255.0` |
| Which is derived from which | Derived: you cannot find them without the mask | Primary: it is the input |
| Assignable to a host | Only the host addresses between the two ends | Not applicable |
| What gets it wrong | Off-by-one at the block boundary | Confusing a bigger prefix number with a bigger network |

The separating axis is input versus output: the mask is the boundary you are given, and the
network, broadcast and usable range are what you compute from it.

<a id="c-sysadmin.networking.private-vs-public-ip-addresses"></a>
### Private vs public IP addresses
*id: `sysadmin.networking.private-vs-public-ip-addresses` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1918-private-address-space, rfc-3022-traditional-nat*

**What it is** RFC 1918 sets aside three IPv4 blocks for private use — 10.0.0.0/8,
172.16.0.0/12 and 192.168.0.0/16 — which internet routers do not carry. Everything else in the
unicast range is public and globally routable. A private address reaches the internet only if
something translates it.

**Why it matters** Recognising an address as private immediately explains a class of symptoms:
an internal host cannot be reached from outside without a translation or forwarding rule, and
a public service cannot be published on a private address. It also tells you which addresses
may be reused freely across sites, which is why 192.168.1.0/24 exists on millions of home
networks at once.

**How it works** The three ranges, in full: 10.0.0.0 through 10.255.255.255; 172.16.0.0
through 172.31.255.255; 192.168.0.0 through 192.168.255.255. Traffic leaving a private network
has its source address rewritten to a public one by NAT, and the return traffic is rewritten
back. Nothing about a private address is enforced by the host — it is a routing-policy
convention, honoured by upstream routers that refuse to forward these prefixes.

**Key terms** RFC 1918; globally routable; address reuse; translation.

**Traps** The 172 range is /12, not /16: 172.16.x.x through 172.31.x.x are private, but
172.32.0.0 and 172.15.0.0 are public. 169.254.0.0/16 is link-local (APIPA), not private
address space — a host holding a 169.254 address has usually failed to get a DHCP lease, which
is a diagnosis, not a design. 127.0.0.0/8 is loopback, also not RFC 1918. Carrier-grade NAT
space, 100.64.0.0/10, is a fourth non-globally-routable range that is not RFC 1918 either.

**What the exam may test** Classifying a given address as private, public, loopback or
link-local on sight, and explaining why an internal host with a private address needs NAT or
port forwarding to be reachable from the internet.

<a id="cmp-sysadmin.networking.private-vs-public-ip-addresses"></a>
#### Not to be confused with: Private vs public IP addresses vs NAT
*compares: `sysadmin.networking.private-vs-public-ip-addresses`, `sysadmin.networking.nat`*

| | Private vs public IP addresses | NAT |
| --- | --- | --- |
| What it is | A classification of address ranges | A process that rewrites addresses in transit |
| Where it lives | In the address plan | In a router or firewall's forwarding path |
| What it decides | Whether an address may appear on the public internet | How a private address is made to appear as a public one |
| Exists without the other | Yes — a private network with no internet access needs no NAT | No — NAT exists because private addresses cannot be routed publicly |
| Failure it explains | "This address can never be reached from outside" | "Outbound works, inbound needs an explicit forwarding rule" |

The separating axis is category: private versus public is a property of an address; NAT is an
action performed on a packet. One is a label, the other is a rewrite.

<a id="c-sysadmin.networking.loopback-address"></a>
### Loopback address
*id: `sysadmin.networking.loopback-address` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1122-host-requirements, rfc-791-internet-protocol*

**What it is** 127.0.0.1 — conventionally named `localhost`, on the interface `lo` — is the
address a host uses to talk to itself. The whole 127.0.0.0/8 block is reserved for this, and
`::1/128` is the IPv6 equivalent. Traffic to it never reaches a network interface or a cable.

**Why it matters** Loopback is the sharpest fault-localiser in the toolkit. If a service
answers on 127.0.0.1 but not from another machine, the service is running and the problem is
between the two hosts — a listening-address binding, a firewall rule, or routing. If it does
not answer even on loopback, the service itself is the problem, and no amount of network
troubleshooting will help.

**How it works** The kernel handles loopback traffic entirely internally; it is delivered
without touching the driver of any physical NIC. `ping 127.0.0.1` therefore exercises the
local IP stack and nothing else. A daemon configured to bind 127.0.0.1 accepts connections
only from the same host; binding 0.0.0.0 (or `::`) accepts on every address the host holds.

**Key terms** `lo`; `localhost`; bind address; 127.0.0.0/8; `::1`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ping 127.0.0.1` | Confirm the local IP stack responds | `-c N` stop after N packets | `ping -c 3 127.0.0.1` | Treating a successful reply as evidence the network card, cable or driver works — loopback traffic never reaches the NIC at all |

**Traps** A successful `ping 127.0.0.1` proves only that the TCP/IP stack is loaded; it says
nothing about link, addressing or routing. `localhost` is a name resolved through
`/etc/hosts`, so an edited or corrupted hosts file can make `localhost` resolve somewhere
unexpected while 127.0.0.1 still works. The whole /8 is loopback, so 127.0.0.2 also loops
back, which is occasionally used to give several services distinct local addresses.

**What the exam may test** Interpreting the difference between "reachable on loopback" and
"reachable from another host" as a service-binding or filtering problem rather than a
service-down problem.

<a id="c-sysadmin.networking.static-vs-dynamic-addressing"></a>
### Static vs dynamic addressing
*id: `sysadmin.networking.static-vs-dynamic-addressing` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-2131-dhcp, man7-ip-iproute2*

**What it is** A static address is written into the host's own configuration and does not
change; a dynamic address is leased from a DHCP server and may change when the lease is not
renewed. The distinction is about *who holds the configuration*, not about whether the address
happens to stay the same.

**Why it matters** Servers, gateways, printers and anything referenced by an A record need a
stable address, so they are given a static address or a DHCP reservation. Clients are given
dynamic addresses because managing hundreds of hand-written configurations does not scale.
Scenario questions that name a device type are usually testing this choice.

**How it works** A static address is set in the distribution's network configuration —
Netplan YAML on Ubuntu, NetworkManager connection profiles on Red Hat family systems,
systemd-networkd unit files elsewhere — and applied at boot. A dynamic address is requested by
a DHCP client at boot and renewed periodically. The runtime `ip addr add` command sets an
address immediately but writes nothing to disk, so the change disappears on reboot or on the
next reconfiguration by the network manager.

**Key terms** persistence; configuration owner; DHCP client; Netplan; NetworkManager.

**Traps** Setting a static address inside a DHCP pool's range invites a duplicate-address
conflict when the server later leases the same address to someone else — this is why
reservations exist. "Static" does not mean "configured with `ip addr add`": that is a
temporary runtime change, and a question asking for a permanent address change is not answered
by it. A dynamic address can remain identical for months and still be dynamic.

**What the exam may test** Choosing static, dynamic or reserved addressing for a described
device, and identifying which configuration change survives a reboot.

<a id="cmp-sysadmin.networking.static-vs-dynamic-addressing"></a>
#### Not to be confused with: Static vs dynamic addressing vs DHCP vs DHCP reservation
*compares: `sysadmin.networking.static-vs-dynamic-addressing`, `sysadmin.networking.dhcp`, `sysadmin.networking.dhcp-reservation`*

| | Static vs dynamic addressing | DHCP | DHCP reservation |
| --- | --- | --- | --- |
| What it names | The choice of who owns the address configuration | The protocol that hands out configuration | A server-side rule binding one MAC to one address |
| Configuration lives | On the host (static) or on the server (dynamic) | On the DHCP server | On the DHCP server |
| Host-side setup | Manual for static; a DHCP client for dynamic | The client side of the exchange | None — the client is an ordinary DHCP client |
| Address stability | Guaranteed for static; not guaranteed for dynamic | Depends on the pool and lease | Stable, by binding |
| Also supplies gateway and DNS | Must be entered by hand when static | Yes, as lease options | Yes, as lease options |

The separating axis is where the configuration is stored: static puts it on the host, DHCP
puts it on the server, and a reservation is DHCP with the server told always to answer one
particular MAC with the same address.

<a id="c-sysadmin.networking.mac-address"></a>
### MAC address
*id: `sysadmin.networking.mac-address` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-826-arp, man7-ip-iproute2*

**What it is** A 48-bit hardware address burned into (or configured on) a network interface,
written as six hexadecimal octets such as `52:54:00:1a:2b:3c`. The first 24 bits are the
Organizationally Unique Identifier assigned to the manufacturer. It identifies an interface
within one link and nowhere else.

**Why it matters** MAC addresses are the layer 2 half of every delivery on a local segment,
and they are how DHCP reservations, switch port security and ARP tables identify a machine.
The key exam fact is negative: a MAC address does not cross a router, so it can never be used
to identify a host on the far side of one.

**How it works** `ip link` prints each interface with its MAC in the `link/ether` field. When
a host sends a frame, it fills in its own MAC as source and the *next hop's* MAC as
destination — the target host's if the destination is on the same subnet, the router's if it
is not. Each router that forwards the packet strips the old frame and builds a new one with
new source and destination MACs, while the IP addresses stay untouched end to end. The
all-ones MAC `ff:ff:ff:ff:ff:ff` is the broadcast address, delivered to every interface on the
segment.

**Key terms** OUI; `link/ether`; broadcast MAC; frame rewriting.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip link` | Show or change link-layer interface state, including MAC addresses | `show` is the default; `set dev NAME up`/`down` changes state | `ip link show enp0s3` | Expecting IP addresses in the output — `ip link` is layer 2 only; use `ip addr` for layer 3 |

**Traps** A MAC is not permanent in practice: it can be overridden in software, and many
systems randomise it on wireless networks for privacy. "Physical address" and "hardware
address" are synonyms for it. Because MACs are rewritten hop by hop, capturing traffic on a
remote segment shows the local router's MAC as the source, not the original sender's — a
frequent misreading of packet captures.

**What the exam may test** Distinguishing what changes and what stays constant as a packet
crosses routers (MAC changes, IP does not), and choosing `ip link` rather than `ip addr` when
the question asks for the hardware address.

*Not to be confused with [IPv4 address](networking.md#cmp-sysadmin.networking.ipv4-address).*
*Not to be confused with [router vs switch](networking.md#cmp-sysadmin.networking.router-vs-switch).*

<a id="c-sysadmin.networking.arp"></a>
### ARP
*id: `sysadmin.networking.arp` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-826-arp, man7-ip-iproute2*

**What it is** The Address Resolution Protocol maps a known IPv4 address to the MAC address
that owns it on the local segment. It is the join between layer 3 addressing and layer 2
delivery: without it, a host knows where to send a packet but not how to address the frame
carrying it.

**Why it matters** Every single outbound packet depends on an ARP result, cached or fresh, so
ARP failures look like total connectivity failure to one destination while everything else
works. Reading the neighbour table is how you prove a host is present on the segment at all,
independently of whether it answers ping.

**How it works** The sender broadcasts an ARP request — "who has 192.0.2.10, tell
192.0.2.15" — to `ff:ff:ff:ff:ff:ff`. Every host on the segment sees it; only the owner replies,
unicast, with its MAC. The answer is stored in the neighbour cache with an expiry, so the
exchange does not repeat per packet. `ip neigh` prints that cache in iproute2, with states such
as REACHABLE, STALE and FAILED; the deprecated net-tools equivalent is `arp -n`.

**Key terms** neighbour cache; broadcast request; unicast reply; REACHABLE/STALE/FAILED.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip neigh` | Show or manipulate the neighbour (ARP/NDP) cache | `show`, `flush dev NAME`, `del ADDR dev NAME` | `ip neigh show dev enp0s3` | Reading a `FAILED` entry as a routing problem — it means the address did not answer on this segment at all |
| `arp -n` | Show the ARP cache numerically (net-tools) | `-n` skip name resolution; `-d` delete an entry | `arp -n` | Assuming it is installed — net-tools is absent by default on many current distributions; `ip neigh` is the supported tool |

**Traps** ARP is IPv4-only. IPv6 uses Neighbor Discovery, carried over ICMPv6, for the same
job — and `ip neigh` shows both, which is why the command is named for neighbours rather than
for ARP. ARP never crosses a router: a host never learns the MAC of an off-subnet destination,
so `ip neigh` holds no entry for that address at all — it resolves the gateway instead, and the
frame carrying a packet to a remote host holds the router's MAC, not the destination's. Two
hosts configured with the same IP produce inconsistent ARP replies, which presents as
intermittent connectivity rather than a clean failure.

**What the exam may test** Recognising ARP as an IPv4 layer 2/3 join that operates only within
one segment, and choosing the neighbour cache as the check for "is that host present on this
network".

<a id="cmp-sysadmin.networking.arp"></a>
#### Not to be confused with: ARP vs DNS
*compares: `sysadmin.networking.arp`, `sysadmin.networking.dns`*

| | ARP | DNS |
| --- | --- | --- |
| Resolves | An IPv4 address to a MAC address | A name to an IP address |
| Scope | One local segment only | Global, hierarchical, across the internet |
| Layer | Joins layer 3 to layer 2 | Application layer |
| Transport | Raw broadcast frames on the link — no IP transport, no port | UDP and TCP port 53 |
| Cache lives | In the kernel neighbour table (`ip neigh`) | In a resolver, governed by each record's TTL |
| Failure looks like | One destination unreachable on the local subnet | Names fail while raw IP addresses still work |

The separating axis is which end of the address chain each one resolves: DNS turns a name into
an IP address, ARP turns an IP address into a hardware address. They sit at opposite ends of
the same lookup sequence and never substitute for each other.

<a id="c-sysadmin.networking.ipv4-address-classes"></a>
### IPv4 address classes
*id: `sysadmin.networking.ipv4-address-classes` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-791-internet-protocol, rfc-4632-cidr*

**What it is** The original classful scheme, in which the leading bits of an address fixed its
network size: class A had an 8-bit network portion, class B 16, class C 24, with class D
reserved for multicast and class E for experimental use. CIDR superseded it in 1993, but the
vocabulary survives and is still examined.

**Why it matters** You will meet "class C network" used loosely to mean "a /24", and exam
questions still ask which class an address falls in. Knowing that the answer is a historical
label rather than a live routing rule is as important as knowing the ranges.

**How it works** The class is read from the first octet:

| Class | First octet | Leading bits | Default prefix | Purpose |
| --- | --- | --- | --- | --- |
| A | 1-126 | 0 | /8 | Large networks |
| B | 128-191 | 10 | /16 | Medium networks |
| C | 192-223 | 110 | /24 | Small networks |
| D | 224-239 | 1110 | none | Multicast |
| E | 240-255 | 1111 | none | Reserved/experimental |

127 is absent from class A's usable range because 127.0.0.0/8 is loopback.

**Key terms** classful addressing; default mask; multicast range; classless routing.

**Traps** Classes tell you nothing about whether an address is private: 10.0.0.0/8 is a class
A range and RFC 1918 private, while 11.0.0.0/8 is a class A range and public. Modern routing
is classless, so an address's class does not imply its actual mask — a 192.0.2.x address may
well be a /26 in practice. Class D is multicast, not "broadcast", and multicast is a
one-to-many delivery to subscribers rather than to everyone on a segment.

**What the exam may test** Naming the class of a given first octet, stating class D as
multicast, and recognising that CIDR replaced the scheme so the default masks are historical
defaults only.

<a id="cmp-sysadmin.networking.ipv4-address-classes"></a>
#### Not to be confused with: IPv4 address classes vs Subnet mask and CIDR
*compares: `sysadmin.networking.ipv4-address-classes`, `sysadmin.networking.subnet-mask-and-cidr`*

| | IPv4 address classes | Subnet mask and CIDR |
| --- | --- | --- |
| Era | Original 1981 scheme (RFC 791), superseded by CIDR from 1993 | The current scheme, now specified by RFC 4632 |
| Where the boundary comes from | Implied by the address's leading bits | Stated explicitly by the mask or prefix |
| Available network sizes | Three fixed sizes: /8, /16, /24 | Any prefix length from /0 to /32 |
| Still used for | Vocabulary ("a class C network"), and exam recall | Every real address plan and routing decision |
| Multicast | Class D names the 224-239 range | Expressed as the prefix 224.0.0.0/4 |

The separating axis is whether the network boundary is inferred or declared: classful reads it
from the address itself, classless requires a mask to be stated. Once a mask is given, the
class is irrelevant.

#### Scenario

A workstation on 192.168.10.0/26 cannot reach the file server at 192.168.10.80, though it
reaches 192.168.10.20 fine. Do the arithmetic before touching anything: /26 gives a 64-address
block, so this subnet spans 192.168.10.0 to 192.168.10.63, with .0 the network address, .63
the broadcast, and .1 to .62 usable. 192.168.10.80 is in the *next* block, so it is off-subnet
and must be reached through the gateway; 192.168.10.20 is on-subnet and is reached directly
after an ARP exchange. `ip neigh` confirms the difference: an entry for .20 shows the server's
own MAC, and there is no entry for .80 at all, because traffic for .80 uses the router's MAC.
If the workstation has no gateway configured, the on-subnet host works and the off-subnet one
does not — exactly the symptom reported. Both addresses are RFC 1918 private, so neither is
reachable from the internet without translation, whatever the gateway does.

#### Knowledge check

1. Two hosts are 10.1.4.20 and 10.1.5.20. Are they on the same subnet?
   Unanswerable without the mask — under /16 yes, under /24 no. The address alone never
   decides it.
2. For 172.20.8.0/22, give the broadcast address and the number of usable hosts.
   Broadcast 172.20.11.255; 1022 usable hosts (2^10 − 2).
3. Which of 172.15.0.1, 172.20.0.1, 172.35.0.1 are RFC 1918 private?
   Only 172.20.0.1 — the private range is 172.16.0.0 through 172.31.255.255.
4. A host has the address 169.254.14.9. What has most likely happened?
   It failed to obtain a DHCP lease and self-assigned a link-local address; 169.254.0.0/16 is
   not RFC 1918 space.
5. What is the one-sentence difference between ARP and DNS?
   ARP resolves an IP address to a MAC on the local link; DNS resolves a name to an IP address
   across the internet.
6. `ping 127.0.0.1` succeeds but no other host answers. What has been ruled out, and what has
   not?
   The local IP stack is working; nothing about the NIC, cabling, addressing, routing or
   filtering has been tested, because loopback traffic never reaches an interface.

<a id="s-networking-routing"></a>
## Routing

<a id="c-sysadmin.networking.default-gateway"></a>
### Default gateway
*id: `sysadmin.networking.default-gateway` · depth 3 · importance 4 · LFS200: MENTIONED ONLY · sources: rfc-1122-host-requirements, man7-ip-iproute2*

**What it is** The router a host sends a packet to when the destination is not on any of its
own directly connected subnets. In the routing table it is the route for 0.0.0.0/0 — the
prefix that matches everything and therefore loses to every more specific entry.

**Why it matters** This is one of the highest-yield troubleshooting concepts on the exam,
because a missing or wrong gateway produces a distinctive symptom: everything on the local
subnet works perfectly, and nothing beyond it works at all. Any scenario that reads "I can
ping other machines in the office but not the internet" is testing this first.

**How it works** `ip route` prints the whole table; the default route appears as a line
beginning `default via <router> dev <interface>`. `ip route show default` filters to that one
entry. When the kernel has a packet whose destination matches no more specific route, it sends
it to the gateway's MAC address with the original destination IP intact, and the gateway
forwards it onward. The gateway address must itself be directly reachable — on the same subnet
as one of the host's own addresses — or the host has no way to deliver the frame.

**Key terms** 0.0.0.0/0; `default via`; next hop; on-link.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip route` | Show or manipulate the routing table | `show` (default), `add`, `del`, `get ADDR` to see the chosen route | `ip route` | Adding a route at runtime and assuming it persists — like `ip addr add`, it is lost on reboot |
| `ip route show default` | Show only the default route | `default` is a prefix selector, equivalent to 0.0.0.0/0 | `ip route show default` | Concluding there is no gateway when the output is empty for IPv4 while an IPv6 default exists; check `ip -6 route` too |

**Traps** More than one default route can exist, with different metrics; the lowest metric
wins, so a stale low-metric default on a disconnected interface silently black-holes traffic.
A gateway address outside every configured subnet cannot be used at all — the host cannot ARP
for it. And a working gateway does not imply working DNS: gateway problems and resolver
problems both present as "the internet is down", and only testing an IP address directly
separates them.

**What the exam may test** Recognising "local works, remote does not" as a default-gateway
symptom, reading `default via` out of `ip route` output, and knowing that the gateway must be
on-link.

<a id="c-sysadmin.networking.routing-table"></a>
### Routing table
*id: `sysadmin.networking.routing-table` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1122-host-requirements, man7-ip-iproute2*

**What it is** The ordered set of rules the kernel consults for every outbound packet to
decide which interface to use and which next hop, if any, to send it to. Selection is by
longest prefix match: the most specific route that covers the destination wins, regardless of
the order the entries were added.

**Why it matters** Every routing symptom — asymmetric traffic, a VPN that captures more than
it should, a host that reaches one subnet but not another — is read out of this table. It is
also where the difference between "directly connected" and "via a router" is visible, which
is the distinction most connectivity questions turn on.

**How it works** A typical table holds one connected route per configured subnet (no `via`
clause, because the destination is on-link), plus the default route. For a packet to
198.51.100.7 with routes for 198.51.100.0/24 and 0.0.0.0/0 present, the /24 wins because 24
matching bits beat 0. `ip route get 198.51.100.7` asks the kernel to show which entry it would
actually choose, which settles arguments faster than reading the table by eye. The legacy
net-tools view is `route -n`, which prints the same information in a different layout and
shows the default route as destination 0.0.0.0 with mask 0.0.0.0.

**Key terms** longest prefix match; connected route; next hop; metric; `route get`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip route` | Show the kernel routing table | `get ADDR` shows the route actually selected for one destination | `ip route get 198.51.100.7` | Assuming the first line listed is the one used — selection is by longest prefix and metric, not by listed order |
| `route -n` | Show the routing table numerically (net-tools) | `-n` skip name resolution | `route -n` | Expecting it to be installed; net-tools is deprecated and frequently absent, and it cannot display all modern route attributes |

**Traps** A more specific route always beats the default, so adding a /32 host route can
redirect exactly one destination while leaving everything else alone — useful, and easy to
forget when diagnosing. Routes added with `ip route add` do not survive a reboot. `route -n`
being unavailable is not evidence of a broken system; it is evidence the distribution ships
iproute2 only.

**What the exam may test** Applying longest-prefix match to pick the winning route from a
short table, and reading the default route out of both `ip route` and `route -n` layouts.

<a id="c-sysadmin.networking.router-vs-switch"></a>
### Router vs switch
*id: `sysadmin.networking.router-vs-switch` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1122-host-requirements, rfc-1812-router-requirements*

**What it is** A switch forwards frames within one network by MAC address, at layer 2. A
router forwards packets between networks by IP address, at layer 3. Both "move traffic", which
is why they are confused; the difference is what they read to decide where it goes.

**Why it matters** Whether a described problem needs a switch or a router is a design question
the exam asks in scenario form: two devices in the same subnet need a switch; two subnets that
must talk need a router. It also explains broadcast behaviour, which underlies both ARP and
DHCP reach.

**How it works** A switch learns which MAC address is reachable through which port by
observing source addresses in arriving frames, and floods a frame to every port only when the
destination MAC is unknown or is the broadcast address. Every port on a plain switch is in the
same broadcast domain. A router does not forward broadcasts at all; it terminates the
broadcast domain, examines the destination IP, consults its routing table, and rebuilds the
frame for the next hop with new source and destination MAC addresses. Splitting a switch into
several broadcast domains without buying more switches is exactly what VLANs do.

**Key terms** MAC learning table; broadcast domain; flooding; forwarding decision.

**Traps** A router is the boundary of a broadcast domain; a switch is not. Because DHCP
discovery and ARP requests are broadcasts, neither crosses a router unaided — DHCP needs a
relay agent to serve a subnet whose server is elsewhere. A "layer 3 switch" performs routing
in hardware but is still doing routing when it does so, and a home "router" is usually a
router, switch, wireless access point, firewall and NAT device in one box, which is why the
word is used so loosely.

**What the exam may test** Assigning a described forwarding behaviour to the right device and
layer, and recognising that anything requiring traffic to cross between subnets requires a
router, not a switch.

<a id="cmp-sysadmin.networking.router-vs-switch"></a>
#### Not to be confused with: Router vs switch vs MAC address
*compares: `sysadmin.networking.router-vs-switch`, `sysadmin.networking.mac-address`*

| | Router vs switch | MAC address |
| --- | --- | --- |
| What it names | Two devices, distinguished by the layer they forward at | One 48-bit link-layer identifier |
| Relationship | The switch forwards *using* MAC addresses; the router forwards despite them | The value both devices read or rewrite |
| Broadcast domain | The router ends one; the switch extends one | The broadcast MAC `ff:ff:ff:ff:ff:ff` is what floods within one |
| Survives a hop | Not applicable — these are devices | No — it is replaced at every routed hop |

The separating axis is device versus datum: router and switch are the two kinds of forwarding
device, and the MAC address is one of the fields they read. A question about "what changes as
a packet crosses the network" is about the address; a question about "which box do I need" is
about the device.

<a id="c-sysadmin.networking.nat"></a>
### NAT
*id: `sysadmin.networking.nat` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-3022-traditional-nat, rfc-1918-private-address-space*

**What it is** Network Address Translation rewrites addresses (and, in its usual form, ports)
in packets as they cross a router, so hosts with private addresses can communicate with the
public internet through one or a few public addresses.

**Why it matters** NAT is the reason outbound connections from a private network "just work"
while inbound connections do not: the translation table is built by outbound traffic, so an
unsolicited inbound packet has no entry to match and is dropped. Every question about why a
service inside a network is unreachable from outside without a port-forwarding rule is about
this asymmetry.

**How it works** In the common form — RFC 3022 calls it NAPT, and it is also called PAT or
masquerading — the router replaces the private source address and source port with its own
public address and a chosen port, records the mapping, and reverses the substitution on the
reply. Because the port is part of the mapping, many internal hosts share one public address
simultaneously. Making an internal service reachable requires an explicit inbound rule
(destination NAT, "port forwarding") that maps a public address and port to an internal one,
because no outbound packet exists to create the mapping.

**Key terms** NAPT/PAT; masquerading; translation table; port forwarding; destination NAT.

**Traps** NAT is not a firewall. It blocks unsolicited inbound traffic as a side effect of
having no mapping, not as a policy decision, and it inspects nothing. A network can run NAT
with no filtering rules at all. NAT also breaks the end-to-end assumption some protocols make:
a server behind NAT sees the translated source address, so logs and access-control lists based
on client IP see the NAT device's address rather than the real client. IPv6 was designed to
make NAT unnecessary, not to standardise it.

**What the exam may test** Explaining why outbound works and inbound needs a forwarding rule,
and rejecting "NAT secures the network" as a security control in its own right.

*Not to be confused with [private vs public IP addresses](networking.md#cmp-sysadmin.networking.private-vs-public-ip-addresses).*

<a id="c-sysadmin.networking.vlan"></a>
### VLAN
*id: `sysadmin.networking.vlan` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: rfc-5517-private-vlans*

**What it is** A Virtual LAN is a logical grouping of ports and devices into a separate
broadcast domain, independent of where they physically sit. One switch can host several
VLANs, and one VLAN can span several switches, because IEEE 802.1Q defines a tag carried in
the frame that says which VLAN it belongs to. This is recognition-level material for LFCA.

**Why it matters** VLANs are how a single physical switch is divided into what behave as
separate networks — finance on one, guests on another — without buying more hardware. The
consequence worth holding onto is that separate VLANs are separate broadcast domains, so
hosts in different VLANs cannot reach each other without a router or a layer 3 switch, exactly
as if they were on physically distinct switches. That also means a broadcast-based protocol
such as ARP, or DHCP discovery, stays inside its own VLAN.

**How it works** Ports are configured as access ports, which carry untagged traffic for a
single VLAN, or as trunk ports, which carry traffic for several VLANs with an 802.1Q tag
inserted into each frame. The tag includes a 12-bit VLAN identifier, of which 0 and 4095 are
reserved, leaving 4094 usable values. A switch receiving a tagged frame on a trunk forwards it
only to ports belonging to that VLAN, and strips the tag before delivering it to an access
port, so end hosts normally never see tags at all.

**Key terms** broadcast domain; 802.1Q tag; VLAN identifier; access port; trunk port.

#### Scenario

A host on 10.20.0.0/24 can reach every machine on its own subnet and its gateway at 10.20.0.1,
but nothing beyond. Read the routing table first: `ip route` shows the connected route
10.20.0.0/24 and nothing else — no `default via` line — so any destination outside the /24
matches no route and never leaves the host. Adding the default route restores internet access,
but only because NAT on that gateway rewrites the private 10.20.0.x source address to the
site's public address; without translation those packets would be unroutable on the internet
whatever the routing table said. A colleague then asks why the accounting machines on the same
physical switch are still unreachable: they sit in a different VLAN, a different broadcast
domain, so reaching them requires the router to forward between the two VLANs — and the frames
that arrive from them will carry the router's MAC, not the accounting host's, because a MAC
address never survives a routed hop.

#### Knowledge check

1. A host can ping every machine on its own subnet but nothing beyond it. What is the first
   thing to check, and what command shows it?
   The default gateway — `ip route show default`, or the `default via` line in `ip route`.
2. A routing table has both 0.0.0.0/0 and 10.0.0.0/8. Which is used for 10.5.1.1, and why?
   10.0.0.0/8 — longest prefix match selects the most specific covering route, regardless of
   listing order.
3. What is the one-sentence difference between a switch and a router?
   A switch forwards frames by MAC address within one broadcast domain; a router forwards
   packets by IP address between networks and terminates the broadcast domain.
4. Why does a service behind NAT accept outbound connections but need a port-forwarding rule
   for inbound ones?
   The translation table is created by outbound traffic; an unsolicited inbound packet matches
   no mapping, so an explicit destination-NAT rule must create one.
5. Two hosts are on the same physical switch but in different VLANs. What is needed for them
   to communicate?
   A router or layer 3 switch — separate VLANs are separate broadcast domains and separate IP
   subnets.
6. Is NAT a security control?
   No. It hides internal addressing and drops unmatched inbound packets as a side effect of
   having no mapping, but it applies no policy and inspects nothing; a firewall does that.

<a id="s-networking-name-resolution"></a>
## Name resolution

<a id="c-sysadmin.networking.dns"></a>
### DNS
*id: `sysadmin.networking.dns` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1034-dns-concepts, rfc-1035-dns-implementation*

**What it is** The Domain Name System is the distributed, hierarchical database that
translates names into IP addresses (and back, and into other record types). It is a
client-server application protocol on port 53, not a property of the network itself.

**Why it matters** A very large share of "the network is down" reports are DNS failures, and
they have a signature: raw IP addresses work while names do not. Learning to test that
distinction in one step — ping an address, then ping a name — converts a vague outage report
into a specific fault within seconds.

**How it works** A stub resolver on the host asks a recursive resolver, configured in
`/etc/resolv.conf`. If the recursive resolver has no cached answer, it walks the hierarchy: a
root server refers it to the servers for the top-level domain, which refer it to the
authoritative servers for the zone, which return the answer. The recursive resolver caches the
result for the record's TTL and returns it to the client. Queries usually travel over UDP port
53; TCP port 53 is used when a response is too large for the UDP path or for zone transfers.
`dig` is the detailed query tool, `nslookup` the older interactive one, and `host` the terse
one.

**Key terms** stub resolver; recursive resolver; authoritative server; zone; port 53.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `dig` | Query DNS and show the full response, including sections and flags | `+short` terse output; `@server` query a specific server; `+trace` walk from the root | `dig www.example.com` | Reading a NOERROR response with an empty ANSWER section as success — the name exists but has no record of that type |
| `nslookup` | Query DNS interactively or from arguments | `-type=MX` set the record type; `server` sets the server in interactive mode | `nslookup www.example.com` | Trusting its "Non-authoritative answer" line as a warning — it merely means the answer came from a cache, which is normal |
| `host` | Resolve a name or address with short output | `-t TYPE` record type; `-a` all records | `host www.example.com` | Using it when the full response detail matters — it hides flags, TTLs and section structure that `dig` shows |

**Traps** DNS assigns nothing and configures nothing; it only answers questions. A resolver
being reachable does not mean it will answer for your zone — a NXDOMAIN from a working
resolver is a data problem, not a connectivity problem. And because `dig`, `nslookup` and
`host` query a nameserver directly, they bypass `/etc/hosts` entirely: a name that `dig`
resolves correctly can still resolve to something else for every actual application on the
host.

**What the exam may test** Separating a name-resolution failure from a connectivity failure by
testing an IP address directly, and knowing that DNS uses port 53 over both UDP and TCP.

*Not to be confused with [ARP](networking.md#cmp-sysadmin.networking.arp).*
*Not to be confused with [DHCP](networking.md#cmp-sysadmin.networking.dhcp).*

<a id="c-sysadmin.networking.dns-resolution-order"></a>
### DNS resolution order
*id: `sysadmin.networking.dns-resolution-order` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man7-nsswitch-conf, man7-hosts*

**What it is** The order in which a host's name-resolution sources are consulted, set by the
`hosts:` line of `/etc/nsswitch.conf`. The conventional value is `files dns`, which means
`/etc/hosts` is read first and a nameserver is queried only if no entry matches.

**Why it matters** This ordering explains the most confusing class of resolution bugs: a stale
or leftover line in `/etc/hosts` silently overrides a perfectly correct DNS record, for
applications, while diagnostic tools that query DNS directly show the correct answer. Without
knowing the order, the evidence looks contradictory.

**How it works** Applications resolve names through the C library's name service switch, which
walks the sources listed on the `hosts:` line in order. `getent hosts <name>` performs a lookup
through that same switch, so it shows what an application would actually get — including
`/etc/hosts` entries, and including any resolver plugin such as `mdns` or `resolve` that the
line names. `dig`, `nslookup` and `host` do not use the switch at all; they build a DNS query
and send it to a nameserver.

**Key terms** `/etc/nsswitch.conf`; `hosts:` line; name service switch; `files dns`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `getent hosts` | Resolve a name the way an application does, through nsswitch | `getent ahosts` uses `getaddrinfo` and shows both address families | `getent hosts www.example.com` | Using `dig` instead when the question is "what will the application see" — `dig` skips `/etc/hosts` and nsswitch entirely |

**Traps** `dig` and `getent hosts` disagreeing is not a bug; it is the diagnosis. If `dig`
returns the right address and `getent hosts` returns a different one, look in `/etc/hosts`
first and at the `hosts:` line second. Reversing the switch order to `dns files` is legal and
changes which source wins. On systems running systemd-resolved the `hosts:` line commonly
includes `resolve`, which answers from systemd-resolved directly over the
`/run/systemd/resolve/io.systemd.Resolve` socket — not through the 127.0.0.53 stub, which is the
separate compatibility path taken by the glibc DNS module when it reads a generated
`/etc/resolv.conf`. Either way the answer need not come from the nameserver a naive reading of
`/etc/resolv.conf` suggests, but the two routes are distinct and nss-resolve(8) documents only
the socket.

**What the exam may test** Predicting which source answers a lookup given a `hosts:` line, and
choosing `getent hosts` over `dig` when the question is about application behaviour rather
than about the DNS data itself.

<a id="c-sysadmin.networking.etc-hosts"></a>
### /etc/hosts
*id: `sysadmin.networking.etc-hosts` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man7-hosts, man7-nsswitch-conf*

**What it is** A plain-text local table mapping IP addresses to hostnames, one entry per line:
an address, a canonical hostname, then optional aliases. It predates DNS and, where the
nsswitch order is `files dns`, it is consulted before any nameserver.

**Why it matters** It is the fastest way to override name resolution on one host — for testing
a migration before changing DNS, or for naming machines on a network with no DNS at all — and
correspondingly the fastest way to create a resolution bug that outlives the reason for it.

**How it works** Lines look like `192.0.2.10 web01.example.com web01`. Comments start with
`#`. Every system ships with `127.0.0.1 localhost` and, on IPv6-aware systems, `::1
localhost`. Because the file is read on each lookup, changes take effect immediately with no
service reload and no cache to flush. It has no wildcards, no record types, and no TTL: it can
only map a literal name to a literal address.

**Key terms** canonical hostname; alias; `127.0.0.1 localhost`; local override.

**Traps** An entry here beats DNS for every application on the host while leaving `dig`
unaffected, which is the classic "it works on my machine" resolution bug. It cannot express a
CNAME, an MX record or anything other than a name-to-address mapping. And it is per host: an
override added on one server changes nothing for anyone else, so it is a testing tool, not a
deployment mechanism.

**What the exam may test** Recognising that a stale local entry can override correct DNS, and
knowing that this file takes effect immediately without restarting anything.

<a id="cmp-sysadmin.networking.etc-hosts"></a>
#### Not to be confused with: /etc/hosts vs /etc/resolv.conf
*compares: `sysadmin.networking.etc-hosts`, `sysadmin.networking.etc-resolv-conf`*

| | /etc/hosts | /etc/resolv.conf |
| --- | --- | --- |
| Contains | Name-to-address mappings | The addresses of nameservers to ask, plus search domains and options |
| Answers a lookup itself | Yes, directly | No — it only says whom to ask |
| Consulted when | `files` appears on the nsswitch `hosts:` line, conventionally first | A DNS query is actually made |
| Typically edited by hand | Yes | Usually not — commonly generated by NetworkManager, systemd-resolved or a DHCP client |
| Effect of a wrong entry | One name resolves to the wrong address for this host only | Every DNS lookup fails or goes to the wrong server |

The separating axis is data versus directory: `/etc/hosts` holds answers, `/etc/resolv.conf`
holds the address of whoever has the answers. A mistake in the first breaks one name; a
mistake in the second breaks all of them.

<a id="c-sysadmin.networking.etc-resolv-conf"></a>
### /etc/resolv.conf
*id: `sysadmin.networking.etc-resolv-conf` · depth 3 · importance 4 · LFS200: MENTIONED ONLY · sources: man7-resolv-conf*

**What it is** The resolver configuration file: which nameservers to query, which domains to
append to unqualified names, and options that tune the resolver's behaviour. It contains no
name-to-address data of its own.

**Why it matters** If this file names an unreachable or wrong nameserver, every DNS lookup on
the host fails or returns the wrong answers, while raw IP connectivity remains perfect — the
classic "DNS is broken, the network is fine" state. It is also the file most likely to be
edited by hand and then silently reverted.

**How it works** `nameserver <address>` lines list the resolvers to query, in order; up to
MAXNS (currently 3) are used, and further lines are ignored. `search <domain> ...` supplies
suffixes appended to names that are not fully qualified. `options ndots:N` controls how many
dots a name must contain before it is tried as absolute rather than being run through the
search list first. On modern systems the file is generated — by NetworkManager, by a DHCP
client, or as a symlink into systemd-resolved's runtime directory, in which case it names the
local stub 127.0.0.53 rather than any real upstream server.

**Key terms** `nameserver`; `search`; `options ndots`; MAXNS; stub resolver.

**Traps** A hand edit to a generated file is overwritten at the next lease renewal, reboot or
network reconfiguration — the durable change belongs in NetworkManager, Netplan or
systemd-resolved configuration. Listing more than three nameservers does not add resilience,
because entries beyond MAXNS are ignored. Seeing only `nameserver 127.0.0.53` is normal on a
systemd-resolved system and does not mean DNS is misconfigured. And a correct
`/etc/resolv.conf` still loses to an `/etc/hosts` entry, because the switch consults files
first.

**What the exam may test** Identifying this file as the source of nameserver configuration
rather than of name data, and recognising that hand edits on a modern system do not persist.

*Not to be confused with [/etc/hosts](networking.md#cmp-sysadmin.networking.etc-hosts).*

<a id="c-sysadmin.networking.dns-record-types"></a>
### DNS record types
*id: `sysadmin.networking.dns-record-types` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1035-dns-implementation, rfc-1034-dns-concepts*

**What it is** The typed entries that make up a DNS zone. The set an LFCA candidate must
recognise: A maps a name to an IPv4 address, AAAA to an IPv6 address, CNAME aliases one name
to another name, MX names the mail exchangers for a domain, PTR maps an address back to a
name, TXT carries arbitrary text such as SPF policy, NS delegates a zone to its authoritative
servers, and SOA holds the zone's administrative parameters.

**Why it matters** "Which record type would you create" is a direct, frequently asked
question, and the A-versus-CNAME distinction in particular is one candidates lose marks on. It
also underpins troubleshooting: a mail delivery failure and a web failure implicate different
record types entirely.

**How it works** A record has a name, a TTL, a class (almost always IN), a type and data. An
MX record carries a preference number as well as a hostname, and the lowest preference value
is tried first. A PTR record for 192.0.2.10 lives at `10.2.0.192.in-addr.arpa`, in a zone that
is usually delegated to whoever owns the address block — not to whoever owns the domain name.
Querying a specific type is done by naming it: `dig A` and `dig MX` set the type in the query.

**Key terms** A; AAAA; CNAME; MX preference; PTR; `in-addr.arpa`; TXT.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `dig A` | Query the IPv4 address record for a name | Documented argument order is `dig @server name type`; `+short` prints just the data | `dig example.com A` | Assuming a bare `dig name` shows every record — with no type given, dig queries A only |
| `dig MX` | Query the mail exchanger records for a domain | `+short` shows preference and host only | `dig example.com MX` | Querying MX for a host name such as `www.example.com` — MX records belong at the domain that appears after the `@` in an address |

**Traps** A CNAME cannot coexist with other record types at the same name, which is why a
CNAME cannot be placed at a zone apex (`example.com` itself) — the apex must carry NS and SOA
records. An MX record must point to a hostname that has an A or AAAA record, not to a CNAME.
AAAA is for IPv6, not "a second A record". And a working forward lookup implies nothing about
reverse: a PTR record is a separate entry in a separate zone, and its absence breaks mail
reputation checks while leaving the website perfectly reachable.

**What the exam may test** Choosing the record type that solves a stated requirement (alias a
name, publish a second web address, direct mail, publish SPF), and explaining why a CNAME at
the zone apex is not permitted.

<a id="c-sysadmin.networking.fqdn-and-hostname"></a>
### FQDN and hostname
*id: `sysadmin.networking.fqdn-and-hostname` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1034-dns-concepts*

**What it is** A hostname is the label a machine carries for itself — `web01`. A fully
qualified domain name is that label plus every domain above it up to the root —
`web01.example.com` — which locates the host unambiguously in the DNS hierarchy. In strict DNS
notation an FQDN ends with a trailing dot representing the root zone.

**Why it matters** An unqualified name is only meaningful relative to a search domain, so the
same command can succeed on one host and fail on another purely because of the `search` line
in `/etc/resolv.conf`. Configuration that must work everywhere — TLS certificates, mail
routing, cluster membership — uses FQDNs for exactly this reason.

**How it works** `hostname` prints the configured name; `hostname -f` asks for the FQDN, which
is resolved rather than merely read, and therefore depends on `/etc/hosts` or DNS returning a
qualified name. On systemd systems `hostnamectl` shows and sets the hostname, distinguishing
the static hostname (persisted in `/etc/hostname`), the transient one (set by the kernel, and
possibly by DHCP), and the pretty one (a free-form label).

**Key terms** label; search domain; trailing dot; static vs transient hostname.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `hostname` | Print or temporarily set the system hostname | `-f`/`--fqdn` display the FQDN; `-i` show addresses | `hostname -f` | Using `hostname NAME` for a permanent change — it lasts until reboot; `hostnamectl set-hostname` persists it |
| `hostnamectl` | Show or set hostname and related metadata on systemd systems | `set-hostname NAME`; `--static`, `--transient`, `--pretty` | `hostnamectl` | Assuming it exists everywhere — it is systemd-specific and absent on non-systemd distributions |

**Traps** `hostname -f` failing does not mean the hostname is unset; it means nothing resolves
the short name to a qualified one, usually a missing `/etc/hosts` line. A name with a dot in it
is not automatically an FQDN — `web01.lab` is qualified only if `lab` is a real domain in the
hierarchy you are querying. And because the resolver appends search domains to unqualified
names, `ping web01` reaching the right host proves nothing portable about the name.

**What the exam may test** Distinguishing a hostname from an FQDN in a given string, and
choosing the command that changes the hostname persistently rather than for the current boot.

<a id="c-sysadmin.networking.ttl-and-dns-caching"></a>
### TTL and DNS caching
*id: `sysadmin.networking.ttl-and-dns-caching` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-1034-dns-concepts, rfc-1035-dns-implementation*

**What it is** Every DNS record carries a time-to-live in seconds, set by the zone's operator,
which tells any resolver how long it may cache the answer. Caching is what keeps DNS fast and
the root servers idle; the TTL is the only control the zone owner has over it.

**Why it matters** TTL explains why a DNS change is not visible everywhere at once, and why
"it works for me but not for them" is the normal state of the world for some minutes or hours
after a change. Planning a migration means lowering the TTL *before* the change, not during
it.

**How it works** An authoritative server returns the record with its configured TTL. A
recursive resolver caches it and, on each subsequent answer, returns the record with the
*remaining* TTL, counting down. So repeated `dig` queries against a caching resolver show a
falling number, while a query sent to the authoritative server shows the full configured
value every time. Negative answers are cached too, governed by the zone's SOA parameters, so
a name queried before it existed can stay NXDOMAIN in a resolver's cache after it is created.

**Key terms** time-to-live; recursive cache; countdown; negative caching; SOA.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `dig` | Show the TTL in the answer section, and query a chosen server | `@server` bypass the cache by asking the authoritative server; `+noall +answer` show the answer section only | `dig @ns1.example.com example.com` | Comparing TTLs from a caching resolver with those from an authoritative server and reading the difference as an error — the countdown is expected |

**Traps** Flushing a local cache does nothing to the caches held by every other resolver on the
internet; you cannot force other people's resolvers to forget an answer, which is precisely why
the TTL has to be lowered in advance. A low TTL raises query volume and is a cost, not a free
safety margin. And an unchanged TTL in repeated authoritative answers is not evidence of
caching — that is the configured value being returned each time.

**What the exam may test** Explaining why a DNS change propagates unevenly, and identifying
lowering the TTL ahead of a planned change as the correct preparation.

#### Scenario

An application on a web server suddenly resolves `db.example.com` to the wrong address, though
the DBA insists DNS was updated correctly. Split the two halves of resolution. `dig
db.example.com` returns the new address, so the DNS data is right and the resolver is
reachable. `getent hosts db.example.com` returns the old address — and that is what the
application sees, because the nsswitch `hosts:` line puts `files` before `dns`, and a leftover
line in `/etc/hosts` from last month's migration test still names the old server. Removing the
line fixes it instantly, with no cache to flush. On a second server `dig` itself fails, because
`/etc/resolv.conf` names a decommissioned nameserver; editing it by hand works until the next
DHCP renewal regenerates the file, so the durable change belongs in the network manager's
configuration. A third report — branch offices still seeing the old address — needs no fix:
their resolvers will hold the cached record until its TTL expires.

#### Knowledge check

1. `dig` returns the correct address but the application connects to a different one. What is
   the explanation, and which command reproduces the application's view?
   An `/etc/hosts` entry (or another nsswitch source) is consulted before DNS; `getent hosts`
   shows what the application gets.
2. Which file lists nameservers, and which file lists name-to-address mappings?
   `/etc/resolv.conf` lists nameservers; `/etc/hosts` holds mappings.
3. Why can a CNAME not be placed at a zone apex?
   A CNAME cannot coexist with other records at the same name, and the apex must carry NS and
   SOA records.
4. You must move a service to a new address next week with minimal disruption. What do you
   change first, and when?
   Lower the record's TTL well before the change, so resolvers hold the old answer for a
   shorter time when the change lands.
5. What is the one-sentence difference between DNS and ARP?
   DNS resolves a name to an IP address across the internet; ARP resolves an IP address to a
   MAC address on the local link.
6. Repeated `dig` queries show the TTL falling from 300 to 240 to 180. Is something wrong?
   No — a caching resolver returns the remaining lifetime of the cached record; the
   authoritative server would return 300 each time.

<a id="s-networking-address-assignment"></a>
## Address assignment

<a id="c-sysadmin.networking.dhcp"></a>
### DHCP
*id: `sysadmin.networking.dhcp` · depth 3 · importance 4 · LFS200: FULLY COVERED · sources: rfc-2131-dhcp*

**What it is** The Dynamic Host Configuration Protocol issues addressing configuration to
clients automatically: an IP address and mask, plus options such as the default gateway, DNS
servers and domain name. It removes per-host manual setup, and it is the only concept in this
section LFS200 covers fully.

**Why it matters** DHCP failure has a recognisable signature — a 169.254.x.x link-local
address, or no address at all — and it explains a whole family of "one machine cannot get
online" reports. It also matters as a discrimination point: DHCP and DNS are the two
automatic-sounding network services, and conflating them is the classic error in this
competency.

**How it works** The exchange is four messages, conventionally DORA. The client broadcasts
DISCOVER; a server replies with OFFER; the client broadcasts REQUEST naming the offer it
accepts; the server confirms with ACK. Because the client has no address yet, the first
messages are broadcasts, using UDP port 67 for the server and port 68 for the client. Since
broadcasts do not cross routers, serving a subnet whose DHCP server sits elsewhere requires a
relay agent on that subnet to forward the requests as unicast.

**Key terms** DISCOVER/OFFER/REQUEST/ACK; UDP 67 and 68; scope or pool; relay agent; options.

**Traps** DHCP hands out addresses and configuration; it does not resolve names, and it does
not create DNS records by itself. It also does not, by itself, make an address permanent — a
client that cannot renew may receive a different address next time. A client showing a
169.254 address has not been given a bad lease; it has received no lease at all and
self-configured.

**What the exam may test** Naming the DORA sequence and its ports, separating DHCP's job from
DNS's, and reading a 169.254 address as "no DHCP server reachable".

*Not to be confused with [static vs dynamic addressing](networking.md#cmp-sysadmin.networking.static-vs-dynamic-addressing).*

<a id="cmp-sysadmin.networking.dhcp"></a>
#### Not to be confused with: DHCP vs DNS
*compares: `sysadmin.networking.dhcp`, `sysadmin.networking.dns`*

| | DHCP | DNS |
| --- | --- | --- |
| Job | Hands out addresses and configuration | Answers questions about names |
| Direction | Server pushes configuration to a client that has none | Client asks, server answers; nothing is configured |
| Transport | UDP, ports 67 (server) and 68 (client) | UDP and TCP port 53 |
| Scope | One broadcast domain, unless a relay agent extends it | Global hierarchy |
| Failure symptom | No address, or a 169.254 link-local address | Addresses work, names do not |
| Fixes what | "This machine has no IP configuration" | "This machine cannot resolve a name" |

The separating axis is give versus tell: DHCP gives a host its configuration, DNS tells a host
what a name means. A machine with no address needs DHCP; a machine with an address that cannot
resolve a name needs DNS.

<a id="c-sysadmin.networking.dhcp-lease"></a>
### DHCP lease
*id: `sysadmin.networking.dhcp-lease` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: rfc-2131-dhcp*

**What it is** A lease is a time-bounded allocation of an address to one client. The client
does not own the address; it borrows it for the lease duration and must renew to keep it,
which is what allows a finite pool to serve a changing population of machines.

**Why it matters** The lease timer is why a "dynamic" address can look stable for weeks and
then change after an outage, and why a machine that has been switched off longer than the
lease may come back with a different address. It also bounds how long a DHCP server outage
stays invisible: existing clients keep working until their renewals start failing, so the
symptom appears gradually rather than all at once.

**How it works** The ACK that grants a lease also states its duration and two timers. At T1,
by default half the lease time, the client tries to renew directly with the server that
granted it, by unicast. If that fails, at T2 — seven-eighths of the lease time — it enters
rebinding and broadcasts a renewal request that any server may answer. If the lease expires
with no answer, the client must stop using the address and start again from DISCOVER.

**Key terms** lease duration; renewal (T1); rebinding (T2); expiry; address pool.

<a id="c-sysadmin.networking.dhcp-reservation"></a>
### DHCP reservation
*id: `sysadmin.networking.dhcp-reservation` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: isc-dhcpd-conf-manual, rfc-2131-dhcp*

**What it is** A rule on the DHCP server binding one client's MAC address to one fixed IP
address, so that client always receives the same lease. The client is configured for DHCP like
any other; the stability comes entirely from the server side.

**Why it matters** It gives a printer, a hypervisor or an appliance a predictable address
without visiting the device, and it keeps every address in one authoritative place — the DHCP
server — instead of scattering hand-written configurations across machines. Scenario questions
about "a stable address without configuring the host" are asking for exactly this.

**How it works** In ISC dhcpd the binding is a `host` declaration containing a `hardware
ethernet` clause naming the MAC and a `fixed-address` clause naming the address; other server
implementations use equivalent settings. When that MAC appears in a DISCOVER, the server
offers the reserved address rather than one from the general pool. Reserved addresses are
normally placed outside the dynamic range so the pool cannot hand the same address to someone
else.

**Key terms** MAC binding; `fixed-address`; pool exclusion; server-side configuration.

**Traps** A reservation is not a static address: the client is still a DHCP client, so if the
DHCP server is unreachable at boot the client gets nothing, whereas a statically configured
host comes up regardless. It is keyed on the MAC address, so replacing a failed network card —
or a virtual machine getting a regenerated MAC — silently breaks the binding. And a
reservation inside the dynamic pool's range can still collide unless the pool excludes it.

**What the exam may test** Choosing a reservation over a static address when the requirement is
central management plus stability, and knowing that a reservation still depends on the DHCP
server being available.

*Not to be confused with [static vs dynamic addressing](networking.md#cmp-sysadmin.networking.static-vs-dynamic-addressing).*

#### Scenario

A laptop comes up with 169.254.7.31 and no internet. That address is self-assigned link-local,
so the DHCP exchange never completed: either no server answered the broadcast DISCOVER, or the
switch port sits in a VLAN with no server and no relay agent. A nearby desktop still works,
because its lease has not reached T1 — evidence that the server became unreachable recently
rather than that the desktop is configured differently. Once it is restored, the laptop
completes DISCOVER, OFFER, REQUEST, ACK and receives an address, mask, gateway and DNS servers
in one exchange. The site's label printer is then given a reservation binding its MAC to an
address outside the pool, not a static address on the device, because it must stay centrally
managed. Note what none of this fixes: if names still fail to resolve once an address arrives,
that is DNS, a separate service DHCP merely pointed the client at.

#### Knowledge check

1. Name the four DHCP messages in order and the two UDP ports involved.
   DISCOVER, OFFER, REQUEST, ACK; port 67 for the server and 68 for the client.
2. What is the one-sentence difference between DHCP and DNS?
   DHCP gives a client its IP configuration; DNS answers questions about what a name means.
3. A host has 169.254.66.10. What does this tell you?
   No DHCP server answered, so the host self-assigned a link-local address; it is not an RFC
   1918 private address and will not route.
4. A DHCP server is on a different subnet from its clients. What is required, and why?
   A relay agent, because DISCOVER is a broadcast and routers do not forward broadcasts.
5. How does a DHCP reservation differ from a static address configured on the host?
   The reservation lives on the server and the client is still a DHCP client, so it depends on
   the server being reachable; a static address is held by the host itself.
6. At roughly what point in a lease does a client first try to renew, and with whom?
   At T1, half the lease duration, by unicast to the server that granted it.

<a id="s-networking-transport"></a>
## Transport

<a id="c-sysadmin.networking.tcp-vs-udp"></a>
### TCP vs UDP
*id: `sysadmin.networking.tcp-vs-udp` · depth 2 · importance 4 · LFS200: PARTIALLY COVERED · sources: rfc-9293-tcp, rfc-768-udp*

**What it is** The two transport protocols. TCP is connection-oriented: it establishes a
connection before sending data, numbers every byte, acknowledges what arrives, retransmits
what does not, and delivers the stream to the application in order. UDP is connectionless: it
adds a source port, destination port, length and checksum to a datagram and sends it, with no
handshake, no acknowledgement, no retransmission and no ordering.

**Why it matters** The trade is reliability against latency and overhead, and the exam tests
it as a choice: bulk transfer, web pages, remote shells and mail take TCP because a missing
byte matters more than a millisecond; DNS queries, DHCP, NTP, voice and video streaming take
UDP because a retransmitted packet arriving late is worse than useless. The two traps sit
either side of this. First, "UDP is unreliable" does not mean lossy in practice — it means the
protocol offers no guarantee, and any needed reliability is the application's job, which is
exactly what QUIC and TFTP do on top of UDP. Second, a service is identified by protocol *and*
port together: TCP 53 and UDP 53 are different sockets, and a firewall rule that opens one
leaves the other closed, which is why a DNS server reachable for ordinary queries can still
fail on large responses that fall back to TCP.

**How it works** A TCP header is at least 20 bytes and carries sequence and acknowledgement
numbers, flags (SYN, ACK, FIN, RST) and a receive window used for flow control; the connection
is set up by a three-way handshake and torn down with FIN exchanges. A UDP header is exactly 8
bytes: source port, destination port, length, checksum. Nothing in UDP tracks state, so a UDP
"connection" exists only as a socket on each end and as a firewall's notion of a recent
exchange.

**Key terms** connection-oriented; connectionless; sequence number; acknowledgement;
retransmission; datagram.

<a id="c-sysadmin.networking.tcp-three-way-handshake"></a>
### TCP three-way handshake
*id: `sysadmin.networking.tcp-three-way-handshake` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-9293-tcp*

**What it is** The three-message exchange that opens a TCP connection: the client sends SYN,
the server answers SYN-ACK, the client replies ACK. Only after the third message does either
side send application data.

**Why it matters** The handshake is what makes TCP failure modes readable. A connection that
hangs sent a SYN and got nothing back — a silent drop, usually a firewall. A connection
refused instantly got an RST — the packet reached a live host with nothing listening on that
port. Being able to name which of the three messages went missing turns "it won't connect"
into a specific hypothesis.

**How it works** Each side chooses an initial sequence number and announces it in its SYN; the
peer acknowledges it by returning that number plus one. The server's single SYN-ACK does both
jobs at once, which is why three messages suffice rather than four. Closing is a separate,
usually four-message exchange of FIN and ACK in each direction, after which the initiating side
holds the connection in TIME_WAIT for twice the maximum segment lifetime so that delayed
segments cannot be mistaken for part of a new connection. `tcpdump` shows all of this: `[S]`,
`[S.]` and `[.]` flag notations mark SYN, SYN-ACK and ACK.

**Key terms** SYN; SYN-ACK; ACK; initial sequence number; RST; FIN; TIME_WAIT.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `tcpdump` | Capture and print packets, showing the handshake flags directly | `-i IFACE` choose an interface; `-n` skip name resolution; a filter expression such as `port 443` narrows the capture | `tcpdump -n port 443` | Capturing without a filter on a busy host and losing the exchange in the noise; also forgetting it needs elevated privilege |

**Traps** The TCP handshake is not the TLS handshake. TLS negotiation happens *after* the
three-way handshake completes, over the established connection, so a failure during
certificate negotiation is not a connectivity failure. UDP has no handshake at all, so
"the handshake failed" can never describe a UDP service. And a completed handshake proves only
that a listener accepted the connection — it says nothing about whether the application behind
it will answer correctly.

**What the exam may test** Naming the three messages in order, and mapping observed behaviour
(instant refusal versus timeout) to which message was answered and which was not.

<a id="c-sysadmin.networking.ports-and-sockets"></a>
### Ports and sockets
*id: `sysadmin.networking.ports-and-sockets` · depth 3 · importance 4 · LFS200: FULLY COVERED · sources: rfc-9293-tcp, rfc-6335-port-number-procedures*

**What it is** A port is a 16-bit number, 0 to 65535, that identifies one service endpoint on
a host. A socket is the combination of transport protocol, IP address and port — one end of a
conversation. A connection is identified by the pair of sockets: source address, source port,
destination address, destination port.

**Why it matters** Ports are how one IP address serves many services at once, and the four-part
identity of a connection is why thousands of clients can reach the same server port
simultaneously without ambiguity. Practically, "is the service listening, and on which
address" is the first question in most service-down investigations, and `ss -tulpn` answers it
in one line.

**How it works** A server binds a socket to an address and port and listens. A client's kernel
picks an unused source port automatically — on Linux from the range in
`/proc/sys/net/ipv4/ip_local_port_range`, 32768 to 60999 by default — and connects to the
server's address and port. `ss -tulpn` lists TCP (`-t`) and UDP (`-u`) listening sockets
(`-l`) with the owning process (`-p`) and with ports left as numbers rather than translated
into service names (`-n`). The Local Address column matters as much as the port: `0.0.0.0:80`
accepts on every address, `127.0.0.1:80` only from the same machine, and `[::]:80` is the IPv6
wildcard.

**Key terms** port number; socket; four-tuple; bind address; ephemeral port.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ss -tulpn` | List listening TCP and UDP sockets with the owning process, numerically | `-t` TCP, `-u` UDP, `-l` listening only, `-p` process, `-n` numeric so ports keep their numbers | `ss -tulpn` | Running it without privilege and seeing no process names — `-p` needs root to attribute sockets to other users' processes |

**Traps** A port is not "opened by the operating system"; it is open because a process bound it
and is listening. Stopping the service closes the port whatever the firewall says. Binding to
127.0.0.1 rather than 0.0.0.0 is the single most common cause of "the service is running but
nothing can connect", and it is invisible unless you read the address column rather than just
the port. Ports below 1024 require privilege to bind on Linux, which is why a non-root process
cannot simply listen on 80.

**What the exam may test** Reading `ss -tulpn` output to decide whether a service is listening
and on which addresses, and distinguishing a port from a socket from a connection.

<a id="c-sysadmin.networking.well-known-ports"></a>
### Well-known ports
*id: `sysadmin.networking.well-known-ports` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-6335-port-number-procedures, iana-service-name-port-registry*

**What it is** The conventional service-to-port assignments an administrator is expected to
recognise on sight. Strictly, IANA calls only 0-1023 the "well-known" or system range;
1024-49151 are registered ports and 49152-65535 are the dynamic or private range.

**Why it matters** Direct recall of these numbers is very likely to be tested, and they also
carry diagnostic weight: seeing an unexpected listener on 3306 tells you a database is exposed,
and a firewall rule quoting 443 rather than 80 tells you which side of a TLS migration a
service is on.

**How it works** The set worth memorising:

| Port | Service | Transport | Range |
| ---: | --- | --- | --- |
| 22 | SSH | TCP | well-known |
| 25 | SMTP | TCP | well-known |
| 53 | DNS | UDP and TCP | well-known |
| 67, 68 | DHCP server, DHCP client | UDP | well-known |
| 80 | HTTP | TCP | well-known |
| 123 | NTP | UDP | well-known |
| 143 | IMAP | TCP | well-known |
| 443 | HTTPS | TCP | well-known |
| 3306 | MySQL | TCP | registered |
| 3389 | RDP | TCP | registered |
| 5432 | PostgreSQL | TCP | registered |

`ss -tulpn` shows which of these a host is actually listening on, which is the only
authoritative statement about that host — the registry records a convention, not a
requirement.

**Key terms** system/well-known range 0-1023; registered range 1024-49151; dynamic range
49152-65535; IANA registry.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ss -tulpn` | Show which ports this host actually listens on | `-n` keeps numeric ports so they can be matched against the table above | `ss -tulpn` | Dropping `-n` and reading the service *name* from `/etc/services` as proof of which program is listening — the name is a lookup of the number, not an inspection of the process |

**Traps** The terminology trap is the one to hold: 3306, 3389 and 5432 sit above 1023, so they
are **registered** ports, not well-known ones, however familiar they are. Nothing forces a
service onto its conventional port — SSH on 2222 is still SSH — so a port number is evidence
about intent, never proof of protocol. And Linux's default ephemeral range, 32768 to 60999,
overlaps the registered range rather than matching IANA's 49152-65535 dynamic range, so a
client's source port frequently lands on a number the registry has assigned to something else.

**What the exam may test** Direct recall of the common assignments, and the range boundaries —
particularly that "well-known" is a defined range and not a synonym for "commonly used".

<a id="cmp-sysadmin.networking.well-known-ports"></a>
#### Not to be confused with: Well-known ports vs Port ranges
*compares: `sysadmin.networking.well-known-ports`, `linux.command-line.port-ranges`*

| | Well-known ports | Port ranges |
| --- | --- | --- |
| What it names | Specific conventional assignments (22 SSH, 443 HTTPS) | The three numeric bands the 0-65535 space is divided into |
| Boundaries | 0-1023 is the well-known band itself | 0-1023 well-known/system, 1024-49151 registered, 49152-65535 dynamic/ephemeral |
| Where 3306 and 5432 sit | Commonly recognised, but **registered**, not well-known | In the registered band, by definition |
| Privilege to bind | Binding anything in 0-1023 needs privilege on Linux | Only the first band carries that restriction |
| Used for | Recognising a service from its port | Deciding whether a port is a service port or a client's ephemeral one |

The separating axis is instance versus band: well-known ports are the individual assignments
you memorise, port ranges are the numeric bands that give those assignments their status. A
port can be commonly used without being in the well-known range.

<a id="c-sysadmin.networking.listening-vs-established-connections"></a>
### Listening vs established connections
*id: `sysadmin.networking.listening-vs-established-connections` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-9293-tcp, man7-ss*

**What it is** A listening socket is a server waiting for clients: it has a local address and
port and no peer. An established connection is an active conversation: it has both ends filled
in and has completed the three-way handshake.

**Why it matters** These answer two different questions that get conflated. "Is the service
running and accepting connections" is answered by the presence of a LISTEN socket. "Is anyone
actually using it" is answered by established connections. A service can be listening with
zero clients, or have many established connections while its listener has been misconfigured
to the wrong address.

**How it works** `ss -tulpn` shows listening sockets; the state column reads LISTEN for TCP,
and UDP sockets show UNCONN because UDP has no listen state and a server socket has no peer.
`ss -t state established` filters to TCP connections in the ESTAB state, showing both peers.
Between the two lie transient states worth recognising: SYN-SENT (the client's SYN is unanswered),
SYN-RECV (a half-open connection), TIME-WAIT (a recently closed connection held briefly by the
side that closed first), and CLOSE-WAIT (the peer closed but the local application has not,
which usually indicates an application bug rather than a network one).

**Key terms** LISTEN; ESTAB; UNCONN; TIME-WAIT; CLOSE-WAIT; peer address.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ss -tulpn` | Show what is listening | `-l` restricts to listening sockets, so established connections are excluded | `ss -tulpn` | Expecting established connections in this output — `-l` deliberately excludes them |
| `ss -t state established` | Show TCP connections currently established | `state` takes any TCP state name; add `-p` for the owning process | `ss -t state established` | Combining it with `-l`; listening and established are mutually exclusive views of the same table |

**Traps** A UDP socket bound with no fixed peer shows UNCONN; one whose application has called
`connect()` to a single peer shows ESTAB. That ESTAB is only a local socket property — a
default destination the kernel records — not a negotiated connection, so unlike TCP it proves
nothing about the far end and involved no handshake. A large number of TIME-WAIT entries is
normal on a busy server and is not a leak. And a listening socket bound to 127.0.0.1 shows up
in `ss -tulpn` exactly like one bound to 0.0.0.0, so a service that "is listening" can still be
unreachable from every other host.

**What the exam may test** Choosing the right `ss` invocation for "is it running" versus "who
is connected", and interpreting LISTEN, ESTAB and UNCONN in output.

#### Scenario

A web application is unreachable from a load balancer, though the application team insists the
service is up. `ss -tulpn` on the server shows a LISTEN socket, so the process is bound — but
the Local Address column reads `127.0.0.1:8080`, not `0.0.0.0:8080`, so it accepts only from
the same machine. That single field explains everything: from the server itself the three-way
handshake completes; from the balancer the SYN reaches a host with nothing listening on that
address and is answered with an RST, which the balancer reports as "connection refused" rather
than as a timeout. Had it timed out instead, the SYN would have been dropped silently and a
firewall, not a bind address, would be the hypothesis. After the fix, `ss -t state established`
confirms real client connections rather than merely a listener. None of this would apply to a
UDP service: with no handshake to refuse, the same fault produces silence either way.

#### Knowledge check

1. What is the one-sentence difference between TCP and UDP?
   TCP establishes a connection and guarantees ordered, retransmitted delivery; UDP sends
   datagrams with no connection, ordering or retransmission.
2. Name the three handshake messages in order, and say what an immediate RST instead means.
   SYN, SYN-ACK, ACK; an RST means the host is reachable but nothing is listening on that
   port.
3. Give the three IANA port bands with their numeric boundaries, and say which band 5432 is
   in.
   0-1023 well-known/system, 1024-49151 registered, 49152-65535 dynamic; 5432 is registered.
4. `ss -tulpn` shows the service listening on `127.0.0.1:8080`. Why can no other host connect?
   It is bound to loopback only; it must bind 0.0.0.0 (or a routable address) to accept
   connections from other hosts.
5. Why does a listening UDP service show UNCONN rather than LISTEN in `ss -tulpn`?
   UDP has no handshake and no listen state, so an unconnected UDP socket is reported UNCONN;
   a UDP socket connected to one peer does show ESTAB, but that only records a fixed local
   destination, not an established conversation.
6. What identifies a single TCP connection uniquely?
   The four-tuple of source address, source port, destination address and destination port.

<a id="s-networking-application-protocols"></a>
## Application protocols

<a id="c-sysadmin.networking.http-and-https"></a>
### HTTP and HTTPS
*id: `sysadmin.networking.http-and-https` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-9110-http-semantics, iana-service-name-port-registry*

**What it is** HTTP is the request/response protocol the web is built on, conventionally on
TCP port 80. HTTPS is the same protocol carried inside a TLS session, conventionally on TCP
port 443. The semantics — methods, status codes, headers — are identical; only the transport
is wrapped.

**Why it matters** Confirming that a web service answers, and reading what it answers with, is
a routine administrative check, and the status code is the fastest classifier available: 2xx
succeeded, 3xx redirected, 4xx blamed the client, 5xx blamed the server. Knowing that 502 and
504 are by definition a gateway or proxy reporting a bad or missing answer from the server
behind it, rather than that server answering for itself, redirects an investigation
immediately.

**How it works** A client opens a TCP connection, and for HTTPS negotiates TLS over it before
any HTTP is sent. It then issues a request — a method (GET, HEAD, POST, PUT, DELETE), a target
and headers — and the server returns a status line, headers and usually a body. `curl -I`
issues a HEAD request, so the server returns the headers it would have sent for a GET without
the body, which is enough to confirm the service responds, see the status code, and read
`Server`, `Location` and content-type headers.

**Key terms** method; status code; header; TLS; HEAD request.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `curl -I` | Fetch response headers only, using a HEAD request | `-L` follow redirects; `-k` skip certificate verification (diagnostic only); `-v` show the whole exchange | `curl -I https://example.com` | Reading a 301 as a failure — it is a redirect, and without `-L` curl stops there by design |

**Traps** HTTPS encrypts the request and response, but it does not hide which host you are
talking to: the destination IP is visible by definition, and the server name is normally sent
in the clear in the TLS SNI extension. A valid certificate proves identity, not that the site
is trustworthy. And a 200 response proves the server answered, not that the answer is correct —
an error page returned with status 200 is a common misconfiguration that automated checks
miss.

**What the exam may test** Classifying a status code by its first digit, identifying HTTPS as
HTTP over TLS on 443 rather than a separate protocol, and choosing `curl -I` to test a service
without downloading its content.

<a id="c-sysadmin.networking.ssh"></a>
### SSH
*id: `sysadmin.networking.ssh` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: openssh-ssh-manpage, iana-service-name-port-registry*

**What it is** The Secure Shell protocol, on TCP port 22, provides an encrypted, authenticated
channel for remote login, remote command execution, file transfer and tunnelling. It is the
standard way to administer a Linux host remotely.

**Why it matters** Essentially every remote-administration scenario on the exam runs over SSH,
and the key-based authentication workflow — generate a key pair, copy the public half, keep the
private half — is both examinable and the most common source of "permission denied" confusion
in practice.

**How it works** `ssh user@host` opens the session; `scp` and `sftp` transfer files over the
same protocol and port, and modern OpenSSH `scp` uses the SFTP protocol underneath by default
rather than the legacy SCP protocol. `ssh-keygen` generates a key pair, writing the private key
to a file such as `~/.ssh/id_ed25519` and the public key to `~/.ssh/id_ed25519.pub`.
`ssh-copy-id user@host` logs in using an existing method and appends that public key to the
remote `~/.ssh/authorized_keys`. On first connection the client records the server's host key,
which is why a changed host key later produces a loud warning.

**Key terms** key pair; `authorized_keys`; known hosts; passphrase; host key.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ssh` | Open a remote shell or run a remote command | `-p PORT` non-default port; `-i FILE` identity file; `-v` verbose for authentication debugging | `ssh user@web01.example.com` | Using `-p` for scp — `scp` spells the port `-P`, which is a frequent and confusing difference |
| `scp` | Copy files over SSH | `-r` recursive; `-P PORT` port; `-O` force the legacy SCP protocol | `scp report.tar.gz user@web01:/tmp/` | Forgetting that the remote path follows a colon — omitting it copies to a local file named after the host |
| `sftp` | Interactive or batch file transfer over SSH | `-b FILE` batch file of commands | `sftp user@web01.example.com` | Expecting FTP semantics or FTP ports — SFTP is an SSH subsystem on port 22, unrelated to FTP or FTPS |
| `ssh-keygen` | Generate, manage and convert authentication keys | `-t ed25519` key type; `-C` comment; `-f` output file | `ssh-keygen -t ed25519` | Copying the private key to the server; only the `.pub` half ever leaves the client |
| `ssh-copy-id` | Install a public key in a remote `authorized_keys` | `-i FILE` choose which public key to send | `ssh-copy-id user@web01.example.com` | Running it when password authentication is disabled — it needs a working login method to install the key |

**Traps** SSH refuses key authentication silently if permissions are too open: `~/.ssh` should
be 700 and `authorized_keys` 600, and a world-writable home directory alone can cause a fall
back to password prompts. A host key warning is not a certificate error and not a network
error — it means the server presented a different key than last time, which is either a rebuild
or an interception. SFTP and FTPS are different things: SFTP rides SSH on port 22, FTPS is FTP
wrapped in TLS.

**What the exam may test** Selecting the right tool for a stated remote task, knowing that only
the public key is copied to the server, and recognising permission problems on `~/.ssh` as the
cause of unexpected password prompts.

<a id="c-sysadmin.networking.load-balancer"></a>
### Load balancer
*id: `sysadmin.networking.load-balancer` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-9110-http-semantics*

**What it is** A device or service that accepts incoming requests and distributes them across
several backend servers, so that capacity scales with the number of backends and the failure of
one backend does not take the service down.

**Why it matters** It is the standard answer to both "how do we handle more traffic" and "how
do we survive a server failure", and the exam distinguishes those two motives — capacity and
availability — from the superficially similar job a proxy does. Its health-checking behaviour
is also the mechanism behind "the site stayed up when a server died".

**How it works** Clients resolve one name to the load balancer's address and connect to it. It
selects a backend by a scheduling algorithm — round robin, least connections, weighted
variants — and forwards the request, then returns the response. It health-checks each backend
continuously and removes failing ones from rotation. A layer 4 balancer forwards TCP or UDP by
address and port without reading the payload; a layer 7 balancer parses HTTP and can route on
hostname, path or header. Where an application keeps per-user state in memory, session affinity
("sticky sessions") pins a client to one backend, at the cost of even distribution.

**Key terms** backend pool; health check; round robin; layer 4 versus layer 7; session
affinity.

**Traps** A load balancer is a single point of failure unless it is itself redundant — putting
one in front of two servers moves the risk rather than removing it. Because the backends see
the balancer's address as the client, request logs and IP-based access rules need a forwarded
header to recover the real client address. And balancing is not caching: unless it is
explicitly configured to cache, every request still reaches a backend.

**What the exam may test** Distinguishing the capacity-and-availability motive for a load
balancer from the mediation motive for a proxy, and recognising health checking as what makes
backend failure invisible to clients.

<a id="cmp-sysadmin.networking.load-balancer"></a>
#### Not to be confused with: Load balancer vs Proxy
*compares: `sysadmin.networking.load-balancer`, `sysadmin.networking.proxy`*

| | Load balancer | Proxy |
| --- | --- | --- |
| Primary purpose | Spread load across backends and survive their failure | Mediate a request on someone's behalf — for policy, caching, anonymity or TLS termination |
| Number of backends | Several, by definition | One is entirely normal |
| Chooses a backend | Yes, by a scheduling algorithm | Not its job |
| Health checks backends | Yes, continuously | Not inherently |
| Which side it serves | The service owner's side | A forward proxy serves the client side; a reverse proxy serves the service owner's side |
| Overlap | A reverse proxy commonly also balances | A load balancer commonly also terminates TLS like a reverse proxy |

The separating axis is intent rather than position: a load balancer exists to distribute work
across many backends; a proxy exists to stand in for one party in the exchange. One product
often does both, which is why the exam asks about purpose, not about the box.

<a id="c-sysadmin.networking.proxy"></a>
### Proxy
*id: `sysadmin.networking.proxy` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-9110-http-semantics*

**What it is** An intermediary that receives a request and forwards it on the requester's
behalf. A forward proxy sits in front of clients and is configured by them; a reverse proxy
sits in front of servers and is invisible to clients, who believe they are talking to the
service itself.

**Why it matters** The two directions solve opposite problems, and the exam tests which one a
scenario describes. Filtering employee web access, caching outbound requests and enforcing
policy are forward-proxy jobs. Terminating TLS, hiding an internal application server, serving
static content and presenting several applications under one hostname are reverse-proxy jobs.

**How it works** A forward proxy requires the client to be pointed at it — through browser
settings, the `http_proxy` and `https_proxy` environment variables that tools such as `curl`
honour, or transparent interception on the network — and it sees which client asked for what. A
reverse proxy is reached because DNS resolves the public name to it; it forwards to a backend
on a private address and returns the response, so the backend sees the proxy as its client
unless a forwarded header preserves the original address.

**Key terms** forward proxy; reverse proxy; TLS termination; `http_proxy`; forwarded header.

**Traps** "Proxy" unqualified usually means forward proxy in a client context and reverse proxy
in a server context, so the direction has to be read from the scenario rather than the word. A
reverse proxy is not a load balancer merely by existing — it becomes one when it distributes
across several backends and health-checks them. And because a proxy terminates and re-issues
the connection, the backend's logs show the proxy's address, which quietly breaks IP-based
access control that was written before the proxy was introduced.

**What the exam may test** Classifying a described intermediary as forward or reverse from
whose side it serves, and separating that from the load-balancing question of how many
backends there are.

*Not to be confused with [load balancer](networking.md#cmp-sysadmin.networking.load-balancer).*

<a id="c-sysadmin.networking.vpn"></a>
### VPN
*id: `sysadmin.networking.vpn` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-77r1*

**What it is** A Virtual Private Network is typically described as an encrypted tunnel between
a host (or a site) and a private network, carrying traffic across an untrusted network in such
a way that the remote host behaves, for addressing and routing purposes, as though it were
attached to the private network directly.

**Why it matters** In most implementations of this practice a VPN is what makes internal
services reachable from outside without exposing them to the internet — the alternative being
port forwarding, which publishes a service to everyone. The distinction usually drawn is that a
VPN authenticates and encrypts the whole path and then grants network-level access, whereas a
port-forwarding rule grants public access to one service and relies on that service's own
authentication.

**How it works** Typically the client authenticates to a VPN endpoint, a virtual interface
appears on the client, and routes are installed pointing some or all destinations through that
interface. In what is commonly called a full-tunnel configuration all traffic is routed through
the VPN; in a split-tunnel configuration only the private ranges are, and everything else
continues to use the local default route. Because the routing table decides which traffic
enters the tunnel, most "the VPN is connected but I still cannot reach the server" reports are
generally routing or DNS problems rather than tunnel problems — the tunnel is up and simply is
not being used for that destination.

**Key terms** tunnel; virtual interface; full tunnel; split tunnel; endpoint.

#### Scenario

An internal dashboard is being published to remote staff. The first proposal is a port forward
from the site's public address straight to the application server on port 8080, which would
expose the dashboard to anyone on the internet. Instead a reverse
proxy is placed in front of it: clients resolve `dash.example.com` to the proxy, the proxy
terminates TLS on 443 and forwards to the application's private address, and `curl -I
https://dash.example.com` confirms a 200 with the proxy's headers rather than the
application's. When a second application server is added for capacity, the same box becomes a
load balancer — it now health-checks two backends and distributes between them, which is a
change of purpose, not of position. Staff needing SSH to the servers get no second port
forward; they connect over the VPN, which typically places them on the private network so port
22 never faces the internet.

#### Knowledge check

1. What is the one-sentence difference between HTTP and HTTPS?
   Same protocol semantics; HTTPS carries HTTP inside a TLS session, conventionally on TCP
   port 443 rather than 80.
2. Which half of an SSH key pair is copied to the server, and by which command?
   The public half, by `ssh-copy-id` (it is appended to the remote `~/.ssh/authorized_keys`).
3. A proxy sits in front of servers, invisible to clients. What is it called, and how does it
   differ from a load balancer?
   A reverse proxy; it mediates for the servers, while a load balancer's defining job is
   distributing requests across several health-checked backends.
4. `curl -I` returns `301`. Has the request failed?
   No — it is a redirect; `curl -L` would follow it.
5. What does HTTPS not conceal?
   The destination IP address, and normally the server name, which is sent in the TLS SNI
   extension in the clear.
6. A user reports the VPN is connected but an internal server is still unreachable. What is
   usually implicated?
   Routing or name resolution rather than the tunnel — in most implementations the tunnel is
   up and that destination simply is not routed through it.

<a id="s-networking-performance"></a>
## Performance

<a id="c-sysadmin.networking.bandwidth-latency-and-throughput"></a>
### Bandwidth, latency and throughput
*id: `sysadmin.networking.bandwidth-latency-and-throughput` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: rfc6349-tcp-throughput*

**What it is** Three quantities that are routinely conflated. Bandwidth is generally described
as the maximum capacity of a link, in bits per second; latency is usually defined as the delay
for data to travel from one end to the other, in milliseconds, with round-trip time the
there-and-back figure `ping` reports; and throughput is conventionally the rate a real transfer
achieves, at most the bandwidth and usually less.

**Why it matters** The usual conclusion drawn from these definitions is that a high-bandwidth
link can still feel slow: an interactive session, a database query or a page load with many
small requests is dominated by latency, not by capacity, so buying more bandwidth changes
nothing. The distinction also separates two very different complaints — "the file copy is
slow" points at throughput and capacity, while "the application feels sluggish" usually points
at latency.

**How it works** For a single TCP stream, throughput is commonly held to be bounded by the
receive window divided by the round-trip time, which is why a long-distance link with generous
bandwidth can deliver poor single-stream throughput until windows are tuned or several streams
are used in parallel. Packet loss reduces throughput further, because retransmission and
congestion control both cost time. Jitter — variation in latency rather than its absolute
value — is typically what degrades voice and video, which tolerate a steady delay far better
than an unpredictable one.

**Key terms** bits per second; round-trip time; jitter; packet loss; receive window.

#### Scenario

Two complaints arrive about the same link between a branch office and headquarters. The first
is that a nightly 40 GB backup no longer finishes in its window; the second is that the
ticketing application "feels slow" all day. They are generally not the same fault. The backup
is a throughput problem: it is bounded by capacity, by any packet loss forcing retransmission,
and — over a long-distance link — by the interaction of the receive window with round-trip
time, which is why running several parallel streams often helps where adding bandwidth does
not. The ticketing application makes hundreds of small requests per page, so its user-visible
delay is dominated by latency, and it would feel identical on a link with ten times the
bandwidth. `ping` reports the round-trip time that matters for the second complaint but says
almost nothing about the first, and a raw bandwidth figure from the carrier says almost
nothing about either on its own.

#### Knowledge check

1. What is the one-sentence difference between bandwidth and throughput?
   Bandwidth is the link's maximum capacity; throughput is the rate a real transfer actually
   achieves, which is at most the bandwidth.
2. A link is upgraded from 100 Mbit/s to 1 Gbit/s and an interactive application feels exactly
   the same. Why is that expected?
   Its responsiveness is dominated by latency — the per-request delay — which capacity does not
   change.
3. Which quantity does `ping` report, and which complaint does it help with?
   Round-trip time, that is latency; it addresses "the application feels sluggish", not "the
   large transfer is slow".
4. Why does jitter matter more than absolute latency for voice traffic?
   Voice tolerates a steady delay but not an unpredictable one, since variation disrupts
   playback timing.

<a id="s-networking-filtering"></a>
## Filtering

<a id="c-sysadmin.networking.firewall"></a>
### Firewall
*id: `sysadmin.networking.firewall` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-41r1, man-iptables-8*

**What it is** A policy engine that decides, packet by packet, what is allowed through, based
on source and destination address, port, protocol, interface and — on a stateful firewall —
whether the packet belongs to a connection already permitted. On Linux the enforcement lives in
the kernel's netfilter framework; the tools an administrator uses are front-ends to it.

**Why it matters** The standard posture is default-deny inbound with explicit allows, and a
great many "the service is running but nothing can connect" scenarios end at a missing allow
rule. Recognising the firewall's characteristic symptom — a silent timeout rather than an
immediate refusal — is what tells you to look at policy rather than at the service.

**How it works** Rules are evaluated in order within a chain, and the first match decides;
what happens to a packet matching nothing is set by the chain's default policy. A stateful
firewall tracks connections, so a rule permitting outbound traffic implicitly permits the
replies, which is why a host with no inbound allows can still browse the web. Direction
matters: an inbound rule governs traffic arriving at this host, and a forwarding rule governs
traffic passing through it to somewhere else. `ufw status` reports the state and rules on
Debian-family systems, `firewall-cmd --list-all` does the same for one firewalld zone — the
default zone unless `--zone` names another — on Red Hat-family systems.

**Key terms** default-deny; stateful inspection; chain; rule order; zone.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ufw status` | Show whether ufw is active and list its rules | `verbose` adds default policies and logging state; `numbered` adds indices for deletion | `ufw status verbose` | Running it unprivileged — ufw requires root, and reporting "inactive" from memory rather than checking is how a firewall gets blamed for a bind-address problem |
| `firewall-cmd --list-all` | Show everything configured in the default zone | `--zone=NAME` inspect another zone instead; `--list-all-zones` show every zone | `firewall-cmd --list-all` | Reading one zone's output as the whole policy — an interface bound to a different zone is governed by that zone's rules |

**Traps** A firewall that drops traffic and one that rejects it produce different symptoms:
DROP gives the client a timeout, REJECT gives an immediate refusal. That difference is
diagnostic and worth more than the rule text itself. A host firewall protects only that host,
so a permissive host firewall behind a restrictive network firewall — or the reverse — means
the effective policy is the intersection of both. And NAT is not filtering: a NAT router with
no rules applies no policy at all.

**What the exam may test** Recognising default-deny inbound as the standard posture, mapping
timeout versus refusal onto DROP versus REJECT, and choosing the right front-end for the
distribution family in front of you.

*Not to be confused with [security group vs network ACL](../03-cloud-computing/networking.md#cmp-cloud.networking.security-group-vs-network-acl).*

<a id="cmp-sysadmin.networking.firewall"></a>
#### Not to be confused with: Firewall vs ufw, firewalld and iptables
*compares: `sysadmin.networking.firewall`, `sysadmin.networking.ufw-firewalld-and-iptables`*

| | Firewall | ufw, firewalld and iptables |
| --- | --- | --- |
| What it names | The function: a policy that filters traffic | The specific tools that express that policy on Linux |
| Where it runs | Conceptually anywhere — host, router, cloud service | In userspace, configuring the kernel's netfilter framework |
| Distribution-specific | No | Yes — ufw is Debian-family, firewalld is Red Hat-family |
| What a question about it asks | What the policy should be, and what symptom it causes | Which command changes it, and whether the change persists |

The separating axis is function versus implementation: "firewall" names what is being done,
and ufw, firewalld and iptables are three ways of telling one kernel to do it.

<a id="c-sysadmin.networking.ufw-firewalld-and-iptables"></a>
### ufw, firewalld and iptables
*id: `sysadmin.networking.ufw-firewalld-and-iptables` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-iptables-nft-8, ubuntu-ufw-man, firewalld-documentation*

**What it is** Three names at two different levels. `iptables` is the classic rule-level
interface to the kernel's packet filter; `ufw` (Uncomplicated Firewall) is the simplified
front-end shipped by the Debian family; `firewalld` is the zone-based, dynamically managed
front-end shipped by the Red Hat family. All of them ultimately configure netfilter in the
kernel.

**Why it matters** The exam asks which tool belongs to which distribution family, and asks it
in the same style as the package-manager questions: given a system, name the tool. It also
tests the practical consequence of the front-end model — that mixing raw `iptables` rules with
a managing front-end produces a policy neither one fully describes.

**How it works** `ufw allow 22/tcp` expresses a rule in service terms and ufw translates it
into the underlying filter's syntax; `ufw` is inactive by default on Ubuntu until enabled.
`firewall-cmd` operates on zones, each holding a set of interfaces and a policy, and
distinguishes the runtime configuration from the permanent one: a change without `--permanent`
is lost at the next reload, and a `--permanent` change does not take effect until
`firewall-cmd --reload`. `iptables -L` lists the rules of the filter table, which is the
default table when `-t` is not given, across its INPUT, FORWARD and OUTPUT chains. On current
distributions the `iptables` command is frequently a compatibility layer over nftables, the
successor framework, so its output may not show rules created natively in nftables.

**Key terms** netfilter; nftables; zone; runtime versus permanent; filter table.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ufw allow` | Permit traffic, named by port, protocol or application profile | `ufw allow 22/tcp`; `ufw allow from 10.0.0.0/8`; `ufw delete` removes a rule | `ufw allow 22/tcp` | Enabling ufw over an SSH session without allowing 22 first, which locks the administrator out immediately |
| `firewall-cmd` | Query and change firewalld's configuration | `--add-port=443/tcp`, `--add-service=https`, `--permanent`, `--reload`, `--zone=NAME` | `firewall-cmd --permanent --add-service=https` | Adding a rule with `--permanent` and expecting it to be active without `firewall-cmd --reload` |
| `iptables -L` | List rules in the filter table | `-n` numeric (much faster), `-v` verbose with counters, `--line-numbers` for deletion | `iptables -L -n -v` | Running plain `iptables -L` and blaming the delay on the firewall — it is reverse DNS on every address, avoided with `-n` |

**Traps** ufw and firewalld are not interchangeable per distribution; installing one on a
system managed by the other leaves two things editing the same kernel tables. Rules added
directly with `iptables` do not survive a reboot unless a persistence mechanism saves them, and
they are invisible to a front-end that believes it owns the policy. And because `iptables` is
often an nftables compatibility front-end now, "the rule is not in `iptables -L`" is not proof
that no rule exists.

**What the exam may test** Matching tool to distribution family, and the firewalld
runtime-versus-permanent distinction, which is the most commonly failed practical detail in
this topic.

*Not to be confused with [firewall](networking.md#cmp-sysadmin.networking.firewall).*

<a id="c-sysadmin.networking.open-closed-and-filtered-ports"></a>
### Open, closed and filtered ports
*id: `sysadmin.networking.open-closed-and-filtered-ports` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: nmap-port-scanning-basics, man7-ss*

**What it is** Three distinct outcomes of trying to reach a port, distinguished by what comes
back. Open: a listener accepted the connection. Closed: the host is reachable and answered, but
nothing is listening, so it refused. Filtered: nothing came back at all, because a policy
dropped the packet silently.

**Why it matters** This is the distinction that converts a vague "I cannot connect" into a
specific cause without touching the server. Refused means the packet reached a live host and
the problem is the service. Timed out means the packet did not get an answer at all and the
problem is almost always filtering or routing. A candidate who treats both as "the port is
closed" has thrown away the most useful piece of evidence in the report.

**How it works** For TCP, a SYN to an open port is answered with SYN-ACK, and a SYN to a closed
port is answered with RST — both are answers, and both arrive fast. A filtered port produces
no answer, so the client retries and eventually times out, which is why the *duration* of the
failure is itself the diagnostic. `nc -zv host port` performs exactly this test and reports
"succeeded" or "Connection refused" or hangs until timeout. `ss -tulpn` answers the
complementary question from the server's own side: is anything actually listening, and on
which address.

**Key terms** SYN-ACK; RST; silent drop; connection refused; timeout.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `nc -zv` | Test whether a port accepts a connection, without sending data | `-z` scan only, `-v` report the outcome, `-w SECS` shorten the timeout, `-u` test UDP | `nc -zv web01.example.com 443` | Testing UDP with `-u` and reading "succeeded" as proof — with no handshake, a UDP probe cannot distinguish open from filtered |
| `ss -tulpn` | Check from the server side what is listening and where | `-l` listening only; read the Local Address column, not just the port | `ss -tulpn` | Checking the port but not the bind address, so a loopback-only listener looks like a firewall problem |

**Traps** "Closed" is not "blocked": a closed port is a cooperative answer from a working host,
and it proves layer 3 reachability. A firewall configured to REJECT rather than DROP produces
the refused response too, so an immediate refusal does not conclusively prove that nothing is
listening — but it does prove that something on the path answered, which is not the same as
proving the destination host is up: a REJECT rule sources its RST or ICMP reply from the
original packet's destination address without the destination host itself ever seeing the
packet. UDP defeats the whole scheme: with no handshake, silence is ambiguous between open and
filtered, which is why UDP scanning is unreliable by nature.

**Symptoms and diagnostic order**

1. Time the failure. Instant "Connection refused" and a slow timeout are different diagnoses;
   note which one you have before anything else.
2. If it refused instantly, the host is up and reachable. Move to the server: `ss -tulpn`
   there, and read the Local Address column. Nothing listening means a stopped service; a
   `127.0.0.1` binding means the service is up but unreachable from off-host.
3. If it timed out, decide whether anything reaches the host at all. Test a port you know is
   open (typically 22) with `nc -zv`. If that also times out but ping succeeds, filtering is
   selective by port; if everything times out, suspect routing or a blanket policy.
4. Test from a second location — the server itself, then another host on the same subnet, then
   one across the router. The point at which the behaviour changes names the device holding the
   rule.
5. Only now read the policy: `ufw status` or `firewall-cmd --list-all` on the host, then the
   network firewall. Checking rules first is how administrators spend an hour on a firewall
   that was never involved.
6. If the port is open and the application still misbehaves, the transport layer is finished
   and the problem is above it — that is an application question, not a networking one.

**What the exam may test** Mapping refused to "reachable, nothing listening" and timeout to
"filtered or unrouted", and choosing the first diagnostic step from a described symptom rather
than reading rules immediately.

#### Scenario

A monitoring check for a new API on port 8443 has been failing since deployment. From the
monitoring host, `nc -zv api.example.com 8443` hangs for the full timeout — silence, not
refusal — so something dropped the packet rather than answering it. The same test against port
22 succeeds instantly, which rules out routing and makes the filtering port-specific. On the
server, `ss -tulpn` shows the API listening on `0.0.0.0:8443`, so the service is bound
correctly. `firewall-cmd --list-all` shows 443 and 22 permitted in the default zone and no
mention of 8443: the deployment added the rule with `--permanent` and no reload, so it sits in
the permanent configuration and not the runtime one. A reload activates it. Had `nc -zv`
returned "Connection refused" instead, the whole firewall investigation would have been wasted
— that answer proves the packet reached a live host, pointing at the service or its bind
address, not at policy.

#### Knowledge check

1. What is the one-sentence difference between a closed port and a filtered port?
   Closed answers with an RST, so the host is reachable with nothing listening; filtered
   answers with nothing at all, so a policy dropped the packet.
2. Which is more likely a firewall: an instant "Connection refused" or a 30-second timeout?
   The timeout — a silent drop. A refusal means something answered.
3. On Debian-family and Red Hat-family systems, which firewall front-end is conventional, and
   what does each of them ultimately configure?
   ufw and firewalld respectively; both configure the kernel's netfilter packet filter.
4. A firewalld rule was added with `--permanent` but has no effect. What is missing?
   `firewall-cmd --reload` — permanent changes do not enter the runtime configuration until a
   reload.
5. Why is a UDP port scan unreliable?
   UDP has no handshake, so no response is ambiguous between an open port that simply does not
   reply and a filtered one.
6. Why does default-deny inbound still allow a host to browse the web?
   The firewall is stateful: replies to connections the host itself opened are recognised as
   part of an established flow and permitted.

<a id="s-networking-diagnostics"></a>
## Diagnostics

<a id="c-sysadmin.networking.ping-and-icmp"></a>
### Ping and ICMP
*id: `sysadmin.networking.ping-and-icmp` · depth 4 · importance 4 · LFS200: FULLY COVERED · sources: rfc-792-icmp*

**What it is** ICMP is the internet layer's control and error-reporting protocol — it carries
no application data and uses no ports. `ping` uses two of its message types, echo request
(type 8) and echo reply (type 0), to test whether a destination responds and how long the
round trip takes.

**Why it matters** Ping is the cheapest reachability test available and the first tool most
people reach for, which is exactly why its limits are examined. A failed ping does not prove a
host is down: ICMP is very commonly blocked by policy while TCP services on the same host work
perfectly. Treating ping failure as proof of a dead host is a classic wrong conclusion.

**How it works** `ping` sends an echo request and waits for the matching reply, reporting the
round-trip time and, at the end, packet loss statistics. Other ICMP types do work you see
indirectly: destination unreachable (type 3) is what produces "Destination Host Unreachable"
and, with the port-unreachable code, tells a UDP sender that nothing was listening; time
exceeded (type 11) is what a router returns when a packet's TTL reaches zero, and is the entire
mechanism behind traceroute. ICMPv6 does the same jobs for IPv6 with different type numbers,
and additionally carries Neighbor Discovery, which is why blocking ICMPv6 wholesale breaks
IPv6 networking outright.

**Key terms** echo request/reply; type 3 destination unreachable; type 11 time exceeded;
round-trip time; packet loss.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ping` | Send ICMP echo requests and report replies | `-c N` stop after N packets; `-i` interval; `-W` reply timeout; `-4`/`-6` force address family | `ping -c 4 www.example.com` | Reading "0% packet loss" as proof the application works — ping tests reachability of the host, not of any service on it |

**Traps** Ping answers a name as well as an address, so a successful ping silently proves DNS
worked too — and a ping that fails with "Name or service not known" is a DNS failure, not a
reachability failure, a distinction the output states plainly and readers routinely skip. A
router replying "Destination Host Unreachable" is not the target answering; it is a third party
reporting that it could not deliver. And ping to a name resolving to IPv6 tests a different
path than the IPv4 one, which is why `-4` is worth forcing when comparing results.

**Symptoms and diagnostic order**

1. Read the failure text before anything else. "Name or service not known" is DNS. "Destination
   Host Unreachable" is a router reporting a routing or ARP failure. "Request timeout" is
   silence, which means filtering, a down host, or a return-path problem.
2. `ping 127.0.0.1` to confirm the local stack, then the host's own address, then the default
   gateway. Each step that works removes a layer from suspicion.
3. Ping a known-good address by IP — a well-known public resolver, or another server on the
   same subnet — to separate connectivity from name resolution.
4. If ping fails but the service must be tested anyway, test the port directly with `nc -zv`.
   A TCP handshake succeeding while ICMP fails is common and proves ICMP is filtered rather
   than the host being down.
5. If replies arrive but are slow or intermittent, read the loss percentage and the variation
   in round-trip times rather than the average — loss and jitter cause the symptoms users
   describe as "the network is bad".
6. Escalate to a path view with traceroute only once you know a single-hop test fails; ping
   tells you *that* something is wrong, traceroute tells you *where*.

**What the exam may test** Rejecting "ping fails, therefore the host is down", and reading a
specific ping error message as a specific class of fault.

<a id="c-sysadmin.networking.traceroute"></a>
### Traceroute
*id: `sysadmin.networking.traceroute` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man7-traceroute, rfc-792-icmp*

**What it is** A tool that reveals the path packets take hop by hop, by exploiting the TTL
field: it sends probes with deliberately small TTLs so that each successive router along the
path is forced to discard one and report the discard back.

**Why it matters** Ping tells you a destination does not answer; traceroute tells you how far
you get before the answers stop, which localises the fault to a network segment instead of a
whole path. On the exam it is the tool named when a question asks *where* connectivity breaks
rather than whether it works.

**How it works** The first probe carries TTL 1, so the first router decrements it to zero,
discards the packet, and returns an ICMP time exceeded message — which reveals that router's
address. The next probe carries TTL 2, reaching the second router, and so on. Classic Linux
traceroute sends UDP probes to an unlikely high destination port so that the final host answers
with ICMP port unreachable, marking the end of the trace; `-I` switches to ICMP echo probes and
`-T` to TCP, both of which pass firewalls that block the default UDP method. `tracepath` does
the same job without requiring superuser privilege and also discovers the path MTU, and `mtr`
runs the trace continuously, accumulating per-hop loss and latency statistics.

**Key terms** TTL; ICMP time exceeded; hop; path MTU; per-hop loss.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `traceroute` | Print the route packets take to a host | `-I` ICMP probes, `-T` TCP probes, `-n` numeric, `-m` max hops (30 by default), `-p` destination port base | `traceroute -n www.example.com` | Reading a line of asterisks as a broken hop — many routers simply do not answer probes while still forwarding traffic normally |
| `tracepath` | Trace the path and discover the path MTU | `-n` numeric; `-m` max hops; needs no elevated privilege | `tracepath www.example.com` | Expecting traceroute's option set — it deliberately has few options |
| `mtr` | Combine ping and traceroute into a continuously updating per-hop report | `-r` report mode for a fixed run; `-n` numeric; `-c` cycle count | `mtr -r -c 100 www.example.com` | Reading loss at an intermediate hop as the fault — loss that does not persist to the final hop usually reflects rate-limited ICMP replies at that router |

**Traps** Asterisks in the output mean a probe went unanswered, not that traffic stops there;
routers routinely deprioritise or block their own ICMP replies while forwarding perfectly.
Loss shown at hop 5 that is absent at hops 6 through 10 is an artefact of that behaviour, not a
fault. The path is one-directional: traceroute shows the outbound route only, and the return
path may differ, so a problem invisible from one end can be obvious from the other. And because
the default method uses UDP to unusual ports, a firewall can block traceroute entirely while
the service you actually care about works — which is exactly why `-I` and `-T` exist, and why
a trace that dies at the first hop should be re-run with a different method before any
conclusion is drawn.

**Symptoms and diagnostic order**

1. Establish first that the destination does not answer at all — traceroute on a working path
   tells you little.
2. Run the trace numerically (`-n`) so a slow reverse-DNS lookup is not mistaken for network
   latency.
3. Find the last hop that answers. That router, or the link beyond it, bounds the problem; hops
   before it are working.
4. Check whether the trace stops inside your own network or beyond your border router. Inside
   is yours to fix; beyond it is the provider's, and the trace output is the evidence to hand
   over.
5. If the trace dies immediately, re-run with `-I` or `-T` before concluding anything — the
   default UDP probes are the most commonly filtered.
6. For intermittent faults, switch to `mtr` and watch loss accumulate over time; a single
   traceroute is a snapshot and cannot distinguish a steady fault from a transient one.

**What the exam may test** Selecting traceroute when the question asks where a path fails,
and refusing to read unanswered probes or intermediate-hop loss as proof of a broken router.

<a id="c-sysadmin.networking.ip-and-ifconfig"></a>
### ip and ifconfig
*id: `sysadmin.networking.ip-and-ifconfig` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man7-ip-iproute2, man7-ifconfig-nettools*

**What it is** `ip`, from the iproute2 suite, is the current tool for inspecting and
configuring addresses, links and routes. `ifconfig`, from the older net-tools package, did part
of the same job and is deprecated — absent by default on many current distributions.

**Why it matters** The exam asks which command to use, and the honest answer is `ip` for
everything, with `ifconfig` recognised only so that legacy documentation and older exam
material remain readable. Reaching for `ifconfig` on a modern system frequently produces
"command not found", which candidates misread as a broken system.

**How it works** The `ip` command is divided into objects: `ip addr` for layer 3 addresses,
`ip link` for layer 2 interface state and hardware addresses, `ip route` for the routing table,
`ip neigh` for the ARP/neighbour cache. Each takes subcommands — `show` by default, plus `add`,
`del` and `set`. `ifconfig` with no arguments lists active interfaces with address, mask and
counters, blending layer 2 and layer 3 in one view.

**Key terms** iproute2; net-tools; object and subcommand; deprecation.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip addr` | Show or change layer 3 addresses | `show`, `add ADDR/PREFIX dev NAME`, `del` | `ip addr show` | Expecting a dotted-decimal netmask; iproute2 prints the CIDR prefix |
| `ip link` | Show or change layer 2 interface state | `set dev NAME up`/`down`; `show` | `ip link set dev enp0s3 up` | Using it to look for IP addresses — it reports link state and MAC only |
| `ip route` | Show or change the routing table | `add`, `del`, `get ADDR` | `ip route` | Assuming a route added here persists across a reboot |
| `ifconfig` | Legacy interface configuration and display (net-tools) | `-a` include inactive interfaces; `IFACE up`/`down` | `ifconfig -a` | Treating its absence as a fault — it is deprecated, and `ip` is the supported replacement |

**Traps** `ifconfig` predates the model in which one interface holds many addresses, so
addresses added with `ip addr add` may not be shown by it unless they were created as labelled
aliases — which is why two tools can disagree about the same interface. Neither command
persists anything: both change the running kernel state only, and permanence belongs to
NetworkManager, Netplan or systemd-networkd. And `ip` is object-first, so `ip link show` and
`ip addr show` answer different questions about the same interface.

**What the exam may test** Choosing the right `ip` object for a stated question, and knowing
that `ifconfig` is deprecated rather than merely uninstalled.

<a id="c-sysadmin.networking.ss-and-netstat"></a>
### ss and netstat
*id: `sysadmin.networking.ss-and-netstat` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man7-ss*

**What it is** Two tools that list sockets: which ports the host is listening on, which
connections are established, and which process owns each. `ss` is the current tool, from
iproute2; `netstat`, from net-tools, is the legacy one and is often not installed.

**Why it matters** These answer the two questions that decide most service investigations — is
it listening, and on which address — and they answer them from the server's own side, which is
the only place the truth lives. Practically every "the service is running but nothing can
connect" scenario is resolved by reading one column of this output.

**How it works** `ss -tulpn` and `netstat -tulpn` take the same option letters and produce
comparable output: `-t` TCP, `-u` UDP, `-l` listening only, `-p` the owning process, `-n`
numeric. What `-n` suppresses differs slightly: in both tools it stops a port being shown as a
service name, and in `netstat` it additionally stops an address being resolved to a host name —
something `ss` does not do at all unless asked with `-r`. `ss` reads socket information from
the kernel through netlink, whereas `netstat` parses files under `/proc/net`, which is why
`ss` is markedly faster on hosts with many connections. `ss` also accepts state filters — `ss
-t state established` — that netstat has no equivalent for.

**Key terms** netlink; `/proc/net`; Local Address column; State column; owning process.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ss -tulpn` | List listening TCP and UDP sockets with owning processes | `-t`, `-u`, `-l`, `-p`, `-n`; add `-a` for all sockets rather than listening only | `ss -tulpn` | Reading only the port column; the Local Address prefix (`0.0.0.0`, `127.0.0.1`, `[::]`) is what decides reachability |
| `netstat -tulpn` | The same view from the legacy net-tools package | Identical letters; `-r` prints the routing table, `-i` interface statistics | `netstat -tulpn` | Assuming it is present — net-tools is not installed by default on many current distributions |

**Traps** Without root, the `-p` column is blank for processes you do not own, which looks
like "nothing is listening" if read carelessly. Dropping `-n` makes the output translate 22
into `ssh` via `/etc/services`, which is a lookup of the number and not evidence of what the
process actually is. And `-l` excludes established connections by design, so a busy server can
show a short listening list and still be handling thousands of conversations.

**Symptoms and diagnostic order**

1. Start on the server, not the client. `ss -tulpn` and look for the expected port.
2. If the port is absent, the service is not listening: check that the process is running and
   read its logs. No firewall change will help.
3. If the port is present, read the Local Address column. `127.0.0.1` means loopback only —
   the service is up but unreachable from any other host, and that is the fault.
4. If it is bound to `0.0.0.0` or a routable address and clients still fail, the socket layer
   is exonerated; move outward to filtering and routing.
5. Use `ss -t state established` to confirm real client connections arrive. Zero established
   connections while clients report timeouts means their packets are not reaching the socket
   at all.
6. Re-run with elevated privilege before concluding the process column is empty — an
   unprivileged run hides other users' processes.

**What the exam may test** Choosing `ss` over `netstat` on a modern system, and reading a
listening-socket line to distinguish "not running" from "running but bound to loopback".

<a id="c-sysadmin.networking.dig-and-nslookup"></a>
### dig and nslookup
*id: `sysadmin.networking.dig-and-nslookup` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: isc-bind9-manpages*

**What it is** Two tools that query DNS directly. `dig` prints the full response — question,
answer, authority and additional sections, flags, TTLs and the server that answered.
`nslookup` is the older tool, usable interactively, with terser output.

**Why it matters** They separate a name-resolution failure from a connectivity failure in one
step, which is the highest-value early move in a great many outage investigations. They are
also the tools that prove where an answer came from, which is what settles arguments about
whether a DNS change has taken effect.

**How it works** `dig name` queries the resolvers in `/etc/resolv.conf` and prints everything;
`dig +short name` prints just the answer data, which is what scripts want. Adding `@server`
sends the query to a named server instead, so `dig @ns1.example.com` asks the authoritative
server directly and bypasses every cache in between — the definitive test of what the zone
actually contains. `nslookup name` performs the same lookup with less detail, and labels any
answer that did not come from an authoritative server as "Non-authoritative", which is the
normal case for a cached recursive answer.

**Key terms** answer section; `@server`; `+short`; authoritative versus cached; NXDOMAIN.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `dig` | Query DNS and print the full response | `@server`, `+trace` walk from the root, `+noall +answer` show just the answer section | `dig www.example.com` | Ignoring the status line — NOERROR with an empty answer section means the name exists but has no record of the type asked for, which is not the same as NXDOMAIN |
| `dig +short` | Print only the answer data | Combine with a type: `dig +short example.com MX` | `dig +short www.example.com` | Using it while diagnosing — it hides the status, TTL and answering server, which is exactly the information a diagnosis needs |
| `nslookup` | Query DNS with terse output, interactively or from arguments | `-type=TYPE`; in interactive mode, `server ADDR` switches resolver | `nslookup www.example.com` | Reading "Non-authoritative answer" as an error — it just means the answer came from a cache |

**Traps** Both tools bypass `/etc/hosts` and the name service switch entirely, so they show
what DNS says and not what an application will get; `getent hosts` is the tool for the latter.
A working `dig` therefore does not prove the application can resolve the name. And an answer
from a caching resolver may be stale by design — only `@` the authoritative server settles what
the zone currently holds.

**Symptoms and diagnostic order**

1. Establish whether the fault is naming at all: reach the destination by IP address. If that
   works and the name does not, it is DNS.
2. `dig` the name. Read the status field first: NXDOMAIN means the name does not exist,
   SERVFAIL points at the resolver or the zone's servers, and NOERROR with an empty answer
   means the name exists without that record type.
3. If `dig` returns nothing at all, check `/etc/resolv.conf` — an unreachable or wrong
   nameserver produces a timeout rather than an answer.
4. Compare with `getent hosts`. A disagreement between the two means `/etc/hosts` or the
   nsswitch order is overriding DNS, and the fix is local, not in the zone.
5. Query the authoritative server directly with `@` to distinguish a stale cached answer from
   a wrong record. If the authoritative answer is right and the cached one is wrong, wait out
   the TTL.
6. Only then consider flushing local caches — and remember that flushing yours does nothing for
   anyone else's resolver.

**What the exam may test** Choosing a DNS query tool to separate resolution from connectivity,
and knowing that these tools do not consult `/etc/hosts`.

<a id="c-sysadmin.networking.curl-and-wget"></a>
### curl and wget
*id: `sysadmin.networking.curl-and-wget` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: curl-manpage*

**What it is** Two command-line HTTP clients with different defaults. `curl` transfers a URL
and writes the result to standard output; `wget` is a downloader that saves to a file and can
walk a site recursively.

**Why it matters** They are how an administrator proves a web service actually responds,
without a browser and without leaving the shell. `curl -I` in particular confirms a service is
answering and returns the status code and headers, which is enough to classify most web
failures.

**How it works** `curl -I` issues a HEAD request, so only headers come back. `curl -v` prints
the whole exchange — the resolved address, the TLS handshake summary, the request headers sent
and the response headers received — which is what turns "it doesn't work" into a specific line
of evidence. `wget URL` saves the response to a file named after the URL's last path element;
`wget -O -` sends it to standard output instead, and `-q` silences progress output.

**Key terms** HEAD request; status code; standard output versus file; verbose exchange.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `curl -I` | Fetch headers only, with a HEAD request | `-L` follow redirects; `-m` timeout | `curl -I https://example.com` | Assuming every server implements HEAD identically to GET — a few return different status codes for it |
| `curl -v` | Show the full request and response exchange | Combine with `-I` or `-o /dev/null` to keep the body out of the way | `curl -v https://example.com` | Reading TLS handshake lines as errors; they are informational unless the transfer actually fails |
| `wget` | Download a URL to a file | `-O FILE` choose the output file (`-O -` for stdout); `-q` quiet; `-r` recursive | `wget https://example.com/file.tar.gz` | Running it in a directory expecting stdout — unlike curl, it writes a file by default and can silently overwrite |

**Traps** The default output destination is the difference that catches people: `curl URL`
floods the terminal with the body, and `wget URL` leaves a file behind. Neither one executes
JavaScript, so a page that looks right in a browser can return an almost empty body to them
legitimately. And a `curl` exit status of 0 means the transfer completed, not that the HTTP
status was 2xx — the status code has to be read separately, or `--fail` used to make an HTTP
error a non-zero exit.

**What the exam may test** Choosing `curl -I` to check a service without downloading content,
and knowing which of the two writes to standard output by default.

<a id="c-sysadmin.networking.network-interface-naming"></a>
### Network interface naming
*id: `sysadmin.networking.network-interface-naming` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: systemd-net-naming-scheme*

**What it is** The scheme by which interfaces get their names. Traditional kernel names —
`eth0`, `eth1`, `wlan0` — were assigned in detection order, which could change between boots.
Predictable names such as `enp0s3` are derived instead from the hardware's own topology, so an
interface keeps its name across reboots and hardware changes elsewhere in the machine.

**Why it matters** A firewall rule, a route or a network configuration file that names the
wrong interface fails silently, and on a multi-NIC machine that used to be a real risk every
time the boot order changed. Reading a predictable name and knowing what it describes is also
straightforward recall the exam can ask for directly.

**How it works** A predictable name starts with a two-character prefix for the interface type —
`en` Ethernet, `wl` wireless LAN, `ww` wireless WAN, `ib` InfiniBand, `sl` serial line IP —
followed by a suffix derived from where the device sits. `o<index>` is an onboard device index
from firmware, `s<slot>` a hotplug slot, `p<bus>s<slot>` the PCI geographic location, and
`x<MAC>` the MAC address itself. So `enp0s3` reads as Ethernet, PCI bus 0, slot 3. `ip link`
lists whatever names the running system actually uses, which is the only reliable way to find
out. The scheme can be disabled with the `net.ifnames=0` kernel parameter, restoring `eth0`
style names.

**Key terms** predictable naming; `en`/`wl`/`ww` prefix; PCI path; `net.ifnames=0`; `lo`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ip link` | List the interfaces this system actually has, with their names and state | `show` is the default; `set dev NAME up`/`down` changes state | `ip link` | Writing configuration against `eth0` from habit without checking — on a predictable-naming system there is usually no such interface |

**Traps** The loopback interface is always `lo`, whichever scheme is in use. A predictable name
is stable but not portable: moving a disk to different hardware, or a card to a different PCI
slot, produces a different name and breaks configuration that hard-codes the old one. And the
names are not chosen by the distribution's networking tool; they come from udev's naming
policy, so renaming an interface reliably means writing a udev rule or a systemd `.link` file
rather than editing the network configuration.

**What the exam may test** Decoding a name such as `enp0s3` into interface type and location,
and recognising that predictable naming exists to keep names stable across reboots.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `sysadmin.networking.tcpdump` | tcpdump | A packet capture tool that prints the traffic on an interface, selected by a filter expression, when higher-level tools do not explain the behaviour. | Recognition only — know it is the last resort that shows what actually crossed the wire, that `tcpdump -i` selects the interface, and that it needs elevated privilege; it observes traffic and never changes configuration. |

#### Scenario

An internal reporting site has "stopped working" for one office. Take the tools in the order
that eliminates the most per step. `ping` to the site's name fails with "Name or service not
known" — DNS, not reachability, and the message says so.
`dig +short reports.example.com` returns the right address, so the zone is fine, while
`/etc/resolv.conf` on the affected machines names a nameserver decommissioned last week. With
that fixed the name resolves, but the page still times out. `curl -v` shows the connection
stalling before any response, while `nc -zv` to port 22 on the same host succeeds instantly, so
the host is reachable and the filtering is port-specific. `traceroute -n` reaches the site's
border router and stops there, bounding the fault to that device rather than the server, and
`ss -tulpn` on the server confirms the site listening on `0.0.0.0:443`. A cleanup had removed
the border firewall's rule for that office's subnet; restoring it ends the incident.

#### Knowledge check

1. `ping` to a server fails, but `nc -zv server 443` succeeds. What has been proved?
   ICMP is being filtered or the host does not answer echo requests; the host is up and the
   service is reachable, so "ping fails, host is down" is wrong.
2. Which command shows what a *server* is listening on, and which column decides whether other
   hosts can reach it?
   `ss -tulpn`; the Local Address column — `127.0.0.1` means loopback only, `0.0.0.0` means
   every address.
3. `dig` returns the correct answer but the application resolves the name differently. Which
   command reproduces the application's view, and why do the two differ?
   `getent hosts`; `dig` queries DNS directly and bypasses `/etc/hosts` and the nsswitch order,
   which the C library honours.
4. Traceroute output shows three asterisks at hop 4 but completes at hop 9. Is hop 4 broken?
   No — that router did not answer the probes while still forwarding them; only the final hop
   failing indicates a broken path.
5. What is the difference in default behaviour between `curl URL` and `wget URL`?
   `curl` writes the response to standard output; `wget` saves it to a file.
6. Decode `enp0s3`, and say why the scheme exists.
   Ethernet interface at PCI bus 0, slot 3; predictable names are derived from hardware
   topology so they do not change between reboots the way detection-ordered `eth0` names could.



