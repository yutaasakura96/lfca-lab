# Appendix A: A packet's life

This appendix defines nothing. Every term in it is defined once, elsewhere, and linked here.
Its job is the part a per-competency file structurally cannot do: run one request end to end so
the facts stop being a list and start being a chain.

The request is `curl https://example.com` typed at a shell on an ordinary Linux workstation
behind a home or office router. The concepts it touches belong mostly to Networking inside
System Administration Fundamentals, the exam's largest domain at 30%, and partly to Security
Fundamentals at 14% — which is itself the point. The exam splits this material across two
domains; the packet does not.

Read it twice. The first pass is the mechanism: what has to be true, in what order, for the
page to arrive. The second pass is diagnostic: each step names what breaks if it fails and what
the failure looks like from the outside, so the chain read backwards is a fault-isolation
order. A candidate who can name the step a symptom belongs to has already eliminated most of
the distractors in a scenario question.

Two things are worth fixing before the walk starts. First, the order below is causal, not
pedagogical, and in one place they differ: ARP is usually taught immediately after addressing,
but it happens *after* the routing decision, not before, because the routing table is what
decides which address needs resolving. That inversion is called out where it lands. Second,
"the resolver" is two different pieces of software with two different failure modes, and
keeping them apart is most of what makes DNS troubleshooting tractable.

---

## Step 0: what curl decides before touching the network

`curl` parses the URL first, entirely locally. The scheme `https` fixes the default destination
port at 443 and mandates TLS; `example.com` becomes both the name to resolve and the name that
will later be checked against the server's certificate. Nothing has left the machine yet.

Two consequences that scenario questions lean on. The name serves two independent purposes — a
lookup key and an identity assertion — so a host reached by the *right* address under the
*wrong* name fails at the certificate check, not at connectivity. And the port is implied by
the scheme, not by the protocol: [HTTP and HTTPS](02-system-administration/networking.md#c-sysadmin.networking.http-and-https)
are the same protocol, and 443 is a convention that `https://example.com:8443/` overrides
without changing anything else about the request.

**What breaks here** Almost nothing, which is why this step is worth stating: a URL typo
produces a resolution failure at step 1 and looks exactly like a DNS outage. Before blaming the
network, confirm the name.

---

## Step 1: the resolver library — what your host does, not what DNS does

This is the step most often collapsed into "DNS", and the collapse is the reason the evidence
in a resolution incident so often looks self-contradictory.

`curl` does not send a DNS query. It calls `getaddrinfo()` in the C library, and that function
consults the *name service switch* — the `hosts:` line in `/etc/nsswitch.conf` — to decide
which sources to try and in what order. This is
[DNS resolution order](02-system-administration/networking.md#c-sysadmin.networking.dns-resolution-order),
and the conventional value `files dns` means
[/etc/hosts](02-system-administration/networking.md#c-sysadmin.networking.etc-hosts) is read
first and a nameserver is contacted only if nothing there matches.

Only if the switch reaches the `dns` source does the *stub resolver* — still library code,
still inside the `curl` process — build an actual DNS query. It reads
[/etc/resolv.conf](02-system-administration/networking.md#c-sysadmin.networking.etc-resolv-conf)
for the nameservers to ask, tries them in order, and applies two rules that surprise people:

- The `search` list and `options ndots:N`. On glibc the default is `ndots:1`, so a name
  containing at least one dot — `example.com` does — is tried as an absolute name first. A
  single-label name such as `web01` is tried against the search domains first, which is why the
  same command can succeed on one host and fail on another. That distinction is the practical
  content of [FQDN and hostname](02-system-administration/networking.md#c-sysadmin.networking.fqdn-and-hostname).
- Timeouts and retries. glibc's defaults are `timeout:5` seconds and `attempts:2` per
  nameserver, tunable through `options`. Two dead nameservers listed before a live one
  therefore cost real seconds before anything succeeds, and no more than MAXNS (3) `nameserver`
  lines are used at all.

Because `getaddrinfo()` is called with no address family constraint, it asks for both A and
AAAA — [DNS record types](02-system-administration/networking.md#c-sysadmin.networking.dns-record-types)
— and returns a list. Modern `curl` then applies Happy Eyeballs to that list, giving the IPv6
candidate a head start (libcurl's documented default is 200 ms) before racing an IPv4 attempt
in parallel and keeping whichever connects first. A host with a broken
[IPv6 address](02-system-administration/networking.md#c-sysadmin.networking.ipv6-address) path
therefore usually still works, just slower — which is precisely why nobody notices it is
broken.

Note also what the stub resolver does *not* do: on a plain glibc system it holds no cache of
its own. Caching lives further out — in `systemd-resolved` or `nscd` if present, and in the
recursive resolver. "Flush the DNS cache" on a machine running neither is an instruction with
no target.

**What breaks, and what it looks like**

| Failure | Symptom |
| --- | --- |
| Stale line in `/etc/hosts` | The connection succeeds to the *wrong* host, or fails a certificate check. `dig` shows the correct address; the application does not. |
| `hosts:` line reordered to `dns files` | `/etc/hosts` overrides stop working, silently, for every application on the host. |
| `/etc/resolv.conf` names a dead nameserver | Every name fails after a multi-second stall. `curl` exits 6, "Could not resolve host". Raw IP addresses work perfectly. |
| Hand-edited `/etc/resolv.conf` on a managed host | The fix works until the next DHCP renewal or reboot regenerates the file. |

The single diagnostic that separates these from a real DNS problem is comparing
[dig and nslookup](02-system-administration/networking.md#c-sysadmin.networking.dig-and-nslookup)
against `getent hosts`. `dig` builds a DNS query and sends it to a nameserver, bypassing the
switch entirely; `getent hosts` goes through the switch and therefore shows what `curl` will
actually get. When the two disagree, the disagreement *is* the diagnosis, and the fault is
local.

---

## Step 2: the recursive resolver — what the DNS server does

The query leaves the host as a UDP datagram to port 53 on the nameserver named in
`/etc/resolv.conf` (or to the local stub at 127.0.0.53 on a `systemd-resolved` system, which
forwards it onward). From here the work belongs to [DNS](02-system-administration/networking.md#c-sysadmin.networking.dns)
proper, and the division of labour is exact.

The stub resolver sends a *recursive* query: "give me the final answer, do the work yourself."
The recursive resolver, if it has nothing cached, does that work by sending *iterative* queries
of its own and following referrals:

1. Ask a root server for `example.com`. The root holds no answer; it returns a referral — NS
   records for the `com` servers.
2. Ask a `com` server. It also holds no answer; it returns a referral to the authoritative
   servers for `example.com`.
3. Ask an authoritative server for the zone. It answers from its own zone data, with the
   authoritative-answer flag set.

The thirteen root server identities (`a.root-servers.net` through `m.root-servers.net`) are
each anycast to many physical instances, which is why "the root servers" are neither thirteen
machines nor a plausible single point of failure.

Three distinctions in this step carry exam weight. An *authoritative* server holds a zone's
data and answers only for it; it never walks the hierarchy for you. A *recursive* server holds
no zone at all; it walks the hierarchy and caches what it learns. A *stub* resolver does
neither — it just asks. And the transport is not "DNS uses UDP": queries go over UDP 53 by
default, but a response too large for the negotiated UDP path comes back truncated with the TC
bit set, and the resolver retries the same query over TCP 53. Zone transfers use TCP as well.
This is why [TCP vs UDP](02-system-administration/networking.md#c-sysadmin.networking.tcp-vs-udp)
matters for a firewall rule: TCP 53 and UDP 53 are different sockets, and permitting one leaves
the other blocked — a DNS server that answers small queries and hangs on large ones has exactly
this rule.

**What breaks, and what it looks like**

| Failure | Symptom |
| --- | --- |
| Recursive resolver unreachable | All lookups time out; `dig` reports no servers could be reached. IP connectivity is unaffected. |
| Name genuinely absent from the zone | NXDOMAIN, returned fast. This is a data problem at the authoritative server, not a connectivity problem. |
| Name exists but has no record of the type asked for | NOERROR with an empty answer section — the single most misread `dig` output there is. |
| UDP 53 permitted, TCP 53 blocked | Ordinary lookups work; large responses (many records, DNSSEC) fail. |

---

## Step 3: the answer, its type, and how long it lasts

The authoritative server returns an A record — a name-to-IPv4 mapping — possibly after a CNAME
chain, and possibly an AAAA record too. The recursive resolver caches the result for the
record's TTL and hands it back. [TTL and DNS caching](02-system-administration/networking.md#c-sysadmin.networking.ttl-and-dns-caching)
is the reason a correct change is not a visible change: every resolver that already answered
this question holds its answer until the TTL runs out, and no action taken at the zone can
shorten that. Negative answers are cached too, governed by the zone's SOA parameters, so a name
queried before it existed can stay NXDOMAIN in someone's cache after it is created.

The record type chosen at the zone constrains everything downstream. A CNAME cannot sit at a
zone apex, because a CNAME cannot coexist with the NS and SOA records the apex must carry. An
MX record must point at a name with an address record, not at another alias. A working forward
lookup implies nothing about the reverse PTR, which lives in a delegated `in-addr.arpa` zone
usually controlled by whoever owns the address block rather than the domain.

**What breaks, and what it looks like** A TTL that was not lowered before a migration produces
the classic split reality: the change works for you, for your colleague on a different
resolver, and for nobody in the branch office, for exactly as long as the old TTL. Nothing is
wrong; nothing can be fixed; it resolves itself on a schedule set before the change. The
control is to lower the TTL in advance, which is a planning answer, not a troubleshooting one.

---

## Step 4: the routing decision

The host now has an address — call it 203.0.113.10, from the block RFC 5737 reserves for
documentation — and must decide where to send the packet. The
kernel consults the [routing table](02-system-administration/networking.md#c-sysadmin.networking.routing-table)
and selects by longest prefix match: the most specific route covering the destination wins,
regardless of the order entries were added. A connected route (one covering a subnet the host
has an address on) means "deliver directly on this link". Anything not covered by a connected
or more specific route falls to 0.0.0.0/0, the
[default gateway](02-system-administration/networking.md#c-sysadmin.networking.default-gateway).

Two properties of this step get tested. The gateway must itself be *on-link* — inside a subnet
the host already has an address in, per its
[subnet mask and CIDR](02-system-administration/networking.md#c-sysadmin.networking.subnet-mask-and-cidr)
— because the host has to address a frame to it directly and has no other way to reach it. And
the routing decision also fixes the source address and the outgoing interface, which is what
`ip route get` will tell you in one line rather than three of table-reading.

**What breaks, and what it looks like** A missing default route does not time out. `connect()`
fails immediately with `ENETUNREACH`, and `curl` exits 7 reporting a failed connection with
"Network is unreachable". That instant failure is the tell: a packet that was never sent cannot
time out. The corresponding user report is "I can reach everything in the office and nothing on
the internet" — local destinations match connected routes and work perfectly, so the fault is
invisible until traffic has to leave the subnet. A *wrong* default route behaves differently
again: packets leave and vanish, which times out, and
[traceroute](02-system-administration/networking.md#c-sysadmin.networking.traceroute) shows
where the path stops.

---

## Step 5: ARP resolves the next hop — and only the next hop

Now, and only now, comes [ARP](02-system-administration/networking.md#c-sysadmin.networking.arp).
This is the inversion mentioned at the start: ARP is commonly taught right after IP addressing,
but it cannot run until routing has chosen a next hop, because the next hop is what it resolves.

The kernel has an IP address to hand the frame to — the gateway's, not the web server's — and
needs the corresponding [MAC address](02-system-administration/networking.md#c-sysadmin.networking.mac-address).
If the neighbour cache has no usable entry, it broadcasts an ARP request to
`ff:ff:ff:ff:ff:ff` on the local segment; the owner replies unicast with its hardware address;
the answer is cached with an expiry.

The consequence candidates lose marks on: the destination IP in the packet stays
203.0.113.10 the whole way, while the destination MAC is rewritten at every routed hop. There
is never an ARP entry for a remote host, because ARP never crosses a router — a
[router](02-system-administration/networking.md#c-sysadmin.networking.router-vs-switch)
terminates the broadcast domain, and a switch does not. Layer 3 addressing is end to end; layer
2 addressing is one hop at a time.

Note also that ARP is IPv4-only. The IPv6 half of a dual-stack connection uses Neighbor
Discovery over ICMPv6 for the same job, which is why the command that shows the cache is named
`ip neigh` rather than for ARP.

**What breaks, and what it looks like** A gateway that does not answer ARP leaves a `FAILED`
entry in `ip neigh` and produces a total outage to everything off-subnet, with on-subnet
traffic unaffected — indistinguishable from a missing gateway at the user level, and separated
from it in one command. Two hosts sharing an IP address produce inconsistent replies and
therefore *intermittent* connectivity, which is the signature worth memorising: clean failures
suggest configuration, alternating ones suggest a duplicate.

---

## Step 6: leaving the network — egress filtering and NAT

The frame reaches the gateway, which strips it, reads the destination IP, consults its own
routing table, and rebuilds a frame for its own next hop. Two things usually happen to the
packet on the way out.

First, filtering. A host [firewall](02-system-administration/networking.md#c-sysadmin.networking.firewall)
sees the packet on its OUTPUT path and a network firewall sees it on the FORWARD path, and
either may have an egress policy. Most sites do not restrict outbound traffic, which is why the
outbound direction is the half candidates forget exists — but where egress filtering is in
place it produces oddly specific symptoms: TCP 443 permitted while UDP 53 is not gives a host
that cannot resolve anything but connects instantly to any address you hand it.

Second, [NAT](02-system-administration/networking.md#c-sysadmin.networking.nat). The
workstation's [private address](02-system-administration/networking.md#c-sysadmin.networking.private-vs-public-ip-addresses)
is not routable on the internet, so the gateway rewrites the source address to its own public
one and, in the usual port-translating form, the source port as well, recording the mapping in
a translation table. Everything about the reply path depends on that table entry: the reply
arrives addressed to the public address and the translated port, and the gateway reverses the
substitution to deliver it to the right internal host.

This is where the exam's favourite NAT question lives. Outbound works because the outbound
packet *created* the mapping. Inbound to an internal service does not work, because no packet
ever created a mapping for it, and making it work requires an explicit destination-NAT rule.
That asymmetry is a side effect of how translation works, not a policy — NAT inspects nothing
and permits nothing deliberately, so it is not a
[firewall](02-system-administration/networking.md#c-sysadmin.networking.firewall) and does not
substitute for one.

**What breaks, and what it looks like** Egress filtering of an unusual port produces a timeout
on that service alone while everything else works. NAT failure is rarer but distinctive: the
translation table has a finite size, and exhaustion produces intermittent connection failures
under load that clear when load drops. Also note the logging consequence — the server at the
far end sees the gateway's address, not the workstation's, so any access control or rate limit
keyed on client IP treats the whole site as one client.

---

## Step 7: the TCP three-way handshake

The packet arrives at the web server. Everything so far has been addressing and delivery;
nothing has established that anyone is willing to talk. That is what the
[TCP three-way handshake](02-system-administration/networking.md#c-sysadmin.networking.tcp-three-way-handshake)
does: the client sends SYN with its initial sequence number, the server answers SYN-ACK —
acknowledging the client's number and announcing its own — and the client replies ACK. Three
messages suffice because the server's single SYN-ACK does two jobs at once.

This is the step whose failure modes are the most readable in the entire chain, because the
outcome takes one of three shapes — an acceptance, a refusal, or silence — and each names a
different cause:

- **SYN-ACK comes back.** A listener accepted the connection. Whether the application behind it
  works is a separate question.
- **RST comes back, immediately.** Nothing is
  [listening](02-system-administration/networking.md#c-sysadmin.networking.listening-vs-established-connections)
  on that port. `curl` exits 7, "Connection refused". This is a *closed* port, and it is a
  cooperative answer: it proves something on the path answered, which is more than most failures
  give you. What it does not prove is *which* thing answered — see the caveat below.
- **Nothing comes back.** The SYN was dropped silently by a policy somewhere. The client
  retries and eventually times out. This is a *filtered* port, and the
  [open, closed and filtered](02-system-administration/networking.md#c-sysadmin.networking.open-closed-and-filtered-ports)
  distinction is exactly this split between an answer, a refusal and silence.

The caveat on the middle case is the one exception that breaks the heuristic, so learn it with
the heuristic. A firewall on the path can manufacture the refusal without the packet ever
reaching the destination host: netfilter's `REJECT --reject-with tcp-reset` sends back a TCP RST
built with the original packet's *destination* as its source address, and `--reject-with
icmp-admin-prohibited` returns ICMP type 3 code 13 instead. Both arrive as fast as a real
refusal. So an instant refusal proves a reachable *responder*, not necessarily a live
destination host — and the DROP-versus-REJECT choice described in step 11 is what decides which
one you are looking at.

The duration of the failure is therefore itself evidence, and it is free. Instant refusal points
at the service, its bind address, or a rejecting filter; a slow timeout points at silent
filtering or at routing. A candidate who records both as "the port is closed" has discarded the
most useful fact in the report.

One correction worth carrying: a completed handshake proves a socket accepted the connection and
nothing more. It does not prove the application is healthy, and it certainly does not prove TLS
will succeed — which is the next step, and a different failure domain entirely.

---

## Step 8: the ports, on both ends

Underneath the handshake sit four numbers that identify the conversation. The connection is
keyed on the four-tuple of source address, source port, destination address and destination
port — this is what [ports and sockets](02-system-administration/networking.md#c-sysadmin.networking.ports-and-sockets)
means in practice, and why thousands of clients can hold connections to the same server port
with no ambiguity.

The destination port is 443, a
[well-known port](02-system-administration/networking.md#c-sysadmin.networking.well-known-ports)
in IANA's system range (0-1023) and the conventional home of HTTPS. The source port is chosen
by the client's kernel from the local ephemeral range — on Linux 32768 to 60999 by default,
readable at `/proc/sys/net/ipv4/ip_local_port_range`. Note that this overlaps IANA's
*registered* band (1024-49151) rather than matching its dynamic band (49152-65535), so a
client's source port routinely lands on a number the registry has assigned to some service.
Reading a port number as proof of protocol is wrong in both directions: nothing forces a service
onto its conventional port, and nothing stops a client borrowing one.

On the server side, the port is open because a process bound it and called listen — not because
the operating system opened it. That is why stopping the service closes the port whatever the
firewall says, and why the Local Address column matters as much as the port number. A service
bound to 127.0.0.1 is bound to the
[loopback address](02-system-administration/networking.md#c-sysadmin.networking.loopback-address)
and reachable only from the machine itself, while appearing perfectly healthy in
[ss and netstat](02-system-administration/networking.md#c-sysadmin.networking.ss-and-netstat)
output to anyone who reads only the port.

**What breaks, and what it looks like** A loopback-only bind produces "connection refused" from
every other host and complete success when tested on the server — the single most common
misdiagnosis in this whole chain, because it is tested locally, works, and gets blamed on the
firewall. The discriminator is that a firewall drop times out and a wrong bind address refuses.

---

## Step 9: TLS — above TCP, not instead of it

The TCP connection is established. No application data has been exchanged, and no HTTP exists
yet. What happens next is the [TLS](04-security/security.md#c-security.security.tls-and-https)
handshake, and its position in the stack is worth stating precisely because the name misleads.

Despite being called Transport Layer Security, TLS is not a transport protocol and does not
replace TCP. RFC 8446 specifies it as running over a reliable transport — in practice, on top of
an established TCP connection. In TCP/IP model terms it sits inside the
[application layer](02-system-administration/networking.md#c-sysadmin.networking.tcp-ip-model);
in [OSI](02-system-administration/networking.md#c-sysadmin.networking.osi-model) terms it is
conventionally placed at layers 5-6, between transport and application. Whichever model a
question uses, the operational fact is the same: three TCP messages complete first, then TLS
negotiates over the connection they created, then HTTP travels inside TLS. A TLS failure is
therefore never a connectivity failure — the connection demonstrably worked, or there would
have been nothing to negotiate over.

The handshake does two things at once, and separating them is what the security half of this
appendix is for:

- **Key agreement.** The client and server derive fresh symmetric keys through an ephemeral
  exchange. Asymmetric cryptography is used to establish those keys and to sign; the bulk data
  is encrypted symmetrically, because symmetric ciphers are enormously faster. That division of
  labour is the whole content of
  [symmetric vs asymmetric encryption](04-security/security.md#c-security.security.symmetric-vs-asymmetric-encryption)
  in its most concrete form. TLS 1.3 removed the static RSA and static Diffie-Hellman key
  exchanges, so capturing the traffic and later stealing the server's long-term key no longer
  decrypts the recorded session.
- **Authentication.** The server presents its certificate chain, and the client validates it.
  This is where [digital certificates and certificate authorities](04-security/security.md#c-security.security.digital-certificates-and-certificate-authorities)
  do their work: the certificate binds a public key to the name `example.com`, and the CA
  vouches for that binding. Validation walks the chain from the leaf up to a trust anchor
  already in the client's store, per
  [certificate expiry and validation](04-security/security.md#c-security.security.certificate-expiry-and-validation)
  — checking each signature, each validity window, the requested hostname against the
  certificate's names, and revocation status.

Authentication is the part that matters, and it is the part that gets skipped. Encryption
without it buys nothing against a
[man-in-the-middle](04-security/security.md#c-security.security.man-in-the-middle): an on-path
attacker will happily negotiate a flawless encrypted session with the client and a second one
onward to the real server. What defeats them is that they cannot produce a certificate for
`example.com` that chains to an anchor the client trusts — which is exactly why `curl -k` and
clicking through a browser warning are not workarounds but the removal of the control.

Two mechanical details that appear in questions. The requested hostname travels in the SNI
extension of the ClientHello, in the clear, so TLS conceals the content of the request and not
the identity of the site — a fact worth holding against any claim that HTTPS makes browsing
anonymous. And the negotiated application protocol (HTTP/1.1 or HTTP/2) is chosen during the
handshake via ALPN, before any HTTP is sent.

**What breaks, and what it looks like**

| Failure | Symptom |
| --- | --- |
| No protocol version or cipher suite in common | The handshake aborts. `curl` exits 35, "SSL connect error". The TCP connection succeeded first. |
| Certificate expired, self-signed, or missing an intermediate | `curl` exits 60, peer certificate cannot be authenticated. Browsers show an interstitial warning. |
| Certificate valid but issued for a different name | The same class of warning, and a completely different fix — reissue, not renew. |
| Client clock badly wrong | A valid certificate is rejected as not-yet-valid or expired. The fix is NTP, not the certificate. |
| TLS terminated at a proxy or load balancer | The certificate presented is the intermediary's, not the origin's. |

The unifying trap: an expired certificate still encrypts perfectly. What has failed is trust,
not confidentiality, so "the connection is unencrypted" is a misreading of the warning. And
because validation reports only the first failure it hits, fixing one can simply reveal the
next.

---

## Step 10: the HTTP request, and what actually comes back

Inside the TLS session, `curl` finally sends HTTP: a method (GET), a target, and headers
including `Host: example.com`, which is mandatory in HTTP/1.1 and is what lets one address serve
many sites. The server returns a status line, headers and a body.

The status code's first digit classifies the outcome faster than any other single field: 2xx
succeeded, 3xx redirected, 4xx blames the client, 5xx blames the server. The distinction that
saves time is that 502 and 503 are characteristically emitted by a
[proxy](02-system-administration/networking.md#c-sysadmin.networking.proxy) or
[load balancer](02-system-administration/networking.md#c-sysadmin.networking.load-balancer) in
front of the application, meaning the intermediary is up and the backend is not — a different
investigation from a 500 generated by the application itself.

Two habits worth carrying out of [curl and wget](02-system-administration/networking.md#c-sysadmin.networking.curl-and-wget):
`curl -I` issues a HEAD request and returns headers only, which is enough to classify most web
failures without downloading anything, and `curl -v` prints the resolved address, the TLS
handshake summary and both header sets — which is this entire appendix rendered as one command's
output. Note that a `curl` exit status of 0 means the transfer completed, not that the status
code was 2xx; an error page served with status 200 satisfies both `curl` and most naive
monitoring checks.

Strictly, `curl` prints; a browser renders. Rendering adds steps this appendix does not cover —
subresource fetches, each with its own name resolution and connection, and script execution that
`curl` performs not at all. A page that looks correct in a browser and nearly empty to `curl` is
usually neither a network fault nor a server fault.

---

## Step 11: the return path, and firewall traversal in both directions

Every step above has a mirror, and the mirror is where the stateful behaviour of firewalls
becomes visible.

The server's response leaves on the same connection. On the server, its host firewall sees the
outbound packets and permits them because a stateful policy recognises them as belonging to a
flow it already accepted — this is why a server with default-deny inbound and one allow rule for
443 can still answer. At the site boundary, the NAT gateway matches the reply against its
translation table and rewrites the destination back to the workstation's private address and
port. On the workstation, its own firewall permits the inbound packets for the same stateful
reason: they belong to a connection this host opened.

That stateful bookkeeping is why "default-deny inbound" does not mean "cannot browse the web",
which is the reasoning step a surprising number of questions want. It is also why the same
reasoning does not extend to UDP: with no connection to track, a stateful firewall keeps a UDP
flow only for a short idle timeout, after which a late reply arrives unmatched and is dropped.

Two return-path failures deserve naming because they do not look like firewall problems at all:

- **Asymmetric filtering.** An inbound allow with no corresponding state or egress permission
  gives a connection that establishes and then produces nothing — the SYN got in, the SYN-ACK
  did not get out.
- **A blocked ICMP path breaking Path MTU Discovery.** A router that must fragment a
  don't-fragment packet signals it with ICMP type 3 code 4 (or ICMPv6 Packet Too Big). Where a
  well-meaning rule blocks all [ICMP](02-system-administration/networking.md#c-sysadmin.networking.ping-and-icmp),
  that signal never arrives and the sender keeps retransmitting a segment that cannot pass. The
  symptom is unmistakable once seen and baffling until then: small exchanges work, so the TCP
  handshake completes and `ping` succeeds, but the connection stalls the moment something large
  crosses — typically the server's certificate chain during the TLS handshake, or the first full
  response body. Blocking ICMP wholesale is a self-inflicted black hole, not a hardening
  measure.

At the network boundary in either direction, the DROP-versus-REJECT choice determines what the
far end learns. DROP produces a timeout and tells an attacker nothing; REJECT produces an
immediate refusal and is friendlier to legitimate users. This is the other half of the step 7
caveat: because the rejection is forged with the destination's address as its source, a REJECT
rule anywhere on the path is why an instant "connection refused" cannot be read as proof that
the destination host itself is alive. The tools that express this policy —
[ufw, firewalld and iptables](02-system-administration/networking.md#c-sysadmin.networking.ufw-firewalld-and-iptables)
— all configure the same kernel machinery, and the firewalld runtime-versus-permanent split is
the practical detail most often missed: a rule added with `--permanent` and no reload is
configured and not in force, which presents as a firewall that "has the rule" and still drops
the traffic. At a broader level this is one layer of
[defense in depth](04-security/security.md#c-security.security.defense-in-depth), and the
effective policy for any given packet is the intersection of every filter on its path, which is
why testing from progressively more distant vantage points localises the rule.

---

## The chain, condensed into a diagnostic order

Read top to bottom, this is the request. Read as a lookup table, it is a fault-isolation order:
find the symptom, and the step names both the mechanism and the concept that teaches it.

| Symptom | Step that failed | Where it is taught |
| --- | --- | --- |
| Names fail, raw IP addresses work | 1-2, resolution | [DNS](02-system-administration/networking.md#c-sysadmin.networking.dns) |
| `dig` is right, the application is wrong | 1, the switch and `/etc/hosts` | [DNS resolution order](02-system-administration/networking.md#c-sysadmin.networking.dns-resolution-order) |
| Every lookup stalls, then fails | 1, `/etc/resolv.conf` | [/etc/resolv.conf](02-system-administration/networking.md#c-sysadmin.networking.etc-resolv-conf) |
| NOERROR with an empty answer section | 3, wrong record type | [DNS record types](02-system-administration/networking.md#c-sysadmin.networking.dns-record-types) |
| Correct for some users, stale for others | 3, caching | [TTL and DNS caching](02-system-administration/networking.md#c-sysadmin.networking.ttl-and-dns-caching) |
| Local subnet fine, everything else instantly unreachable | 4, no default route | [Default gateway](02-system-administration/networking.md#c-sysadmin.networking.default-gateway) |
| One destination unreachable, `ip neigh` shows FAILED | 5, next hop not answering | [ARP](02-system-administration/networking.md#c-sysadmin.networking.arp) |
| Outbound works, inbound to an internal service does not | 6, no translation mapping | [NAT](02-system-administration/networking.md#c-sysadmin.networking.nat) |
| Instant "connection refused" | 7, RST — nothing listening, or a REJECT rule on the path | [Open, closed and filtered ports](02-system-administration/networking.md#c-sysadmin.networking.open-closed-and-filtered-ports) |
| Slow timeout on one port only | 7, SYN silently dropped | [Firewall](02-system-administration/networking.md#c-sysadmin.networking.firewall) |
| Works on the server, refused from everywhere else | 8, bound to loopback | [Ports and sockets](02-system-administration/networking.md#c-sysadmin.networking.ports-and-sockets) |
| Connects, then fails during negotiation | 9, TLS version or cipher | [TLS and HTTPS](04-security/security.md#c-security.security.tls-and-https) |
| Browser warning, connection otherwise fine | 9, certificate validation | [Certificate expiry and validation](04-security/security.md#c-security.security.certificate-expiry-and-validation) |
| Handshake completes, transfer stalls on large data | 11, ICMP blocked, PMTU black hole | [Ping and ICMP](02-system-administration/networking.md#c-sysadmin.networking.ping-and-icmp) |
| 502 or 503 rather than a timeout | 10, intermediary up, backend down | [Load balancer](02-system-administration/networking.md#c-sysadmin.networking.load-balancer) |

---

## What this chain is actually worth on the exam

Three habits transfer directly from it.

**Time the failure before reading anything.** Instant refusal, instant unreachable, and slow
timeout are three different diagnoses available before any tool is run, and scenario questions
supply exactly this detail because it is the discriminator. Instant refusal means something on
the path answered — the fault is at or above the listener, unless a firewall on the path is
configured to REJECT rather than DROP, and the DROP-versus-REJECT distinction in step 11 is what
decides which. Instant "network unreachable" means the packet
never left — the fault is the routing table. A timeout means something dropped it in silence —
the fault is policy or path.

**Ask which layer proved itself.** Every completed step certifies the ones below it. A TLS error
proves TCP worked, which proves routing and ARP worked, which proves resolution returned
something. Working the chain downward from the symptom throws away most of the search space
immediately, and it is why "check the firewall first" is usually an hour spent on a device that
was never involved.

**Keep the resolver and the server apart.** The two most common name-resolution incidents —
a stale `/etc/hosts` entry and a dead nameserver — are both local, and neither is a DNS problem
in the sense of anything wrong with DNS. `getent hosts` and `dig` disagreeing is not confusing
evidence; it is the answer.

The exam splits this material between System Administration Fundamentals and Security
Fundamentals, and asks about the pieces one at a time. The pieces are only memorable as a
sequence, which is what this appendix is for: not a summary of the competency files, but the
thread they are cut from.
