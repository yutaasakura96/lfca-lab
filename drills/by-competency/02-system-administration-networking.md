<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — System Administration Fundamentals :: Networking

183 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A host can reach every other machine on its own subnet by IP address but a name lookup for one particular server fails. Separately, a different host cannot reach one particular local IP address at all. Which protocol is implicated in each case?

- **A.** Both cases implicate DNS, since any resolution failure of any kind whatsoever is ultimately treated as a DNS problem regardless of its actual scope.
- **B.** The name-lookup failure implicates DNS, which resolves names to addresses across the whole internet; the local-address failure implicates ARP, which resolves an address to a MAC only within one segment.
- **C.** Both cases implicate ARP, since ARP is assumed to be responsible for resolving both names and local hardware addresses on a modern network.
- **D.** The name-lookup failure instead implicates ARP, since ARP requests are assumed to carry hostnames as well as IP addresses; the local-address failure implicates DNS, regardless of which distribution or vendor is involved.

**Answer: B.** DNS resolves a name to an IP address, globally and hierarchically; ARP resolves an IPv4 address to a MAC address, but only on the local segment. A name failure with working raw addresses points at DNS, while a single unreachable local address with everything else working points at ARP.

- A is wrong: ARP resolution operates entirely below DNS, on one local segment, using no IP transport and no port at all; a local address-to-MAC failure is not a DNS problem.
- C is wrong: ARP resolves IPv4 addresses to MAC addresses only; it has no role in resolving names, which is DNS's job across the internet, not a local-segment one.
- D is wrong: ARP requests never carry hostnames — only IPv4 and MAC addresses — and DNS has no role in resolving a local-segment IP-to-MAC mapping.

### 2.

A host cannot reach 192.0.2.44, which is on the same subnet. `ip neigh show dev enp0s3` shows a FAILED entry for that address. What does a FAILED entry mean here?

- **A.** It means routing to 192.0.2.44 has failed somewhere beyond this subnet, which ARP is reporting on behalf of the router.
- **B.** The ARP request for 192.0.2.44 went unanswered on this segment; nothing responded, which points at that specific host being off, misconfigured, or on a different segment than assumed.
- **C.** It means the address is definitely down at the operating-system level, since ARP can distinguish a powered-off host from a merely unresponsive one as commonly understood by less experienced staff.
- **D.** It means DNS resolution for that address's hostname has failed, which `ip neigh` also reports through the same state field.

**Answer: B.** FAILED in `ip neigh` means an ARP request for that address went unanswered on the local segment, which is a strong, specific localisation — it says nothing was reached at all, distinct from a REJECT or a working entry showing the resolved MAC. The deprecated net-tools equivalent, `arp -n`, reports the same cache numerically where installed.

- A is wrong: ARP never crosses a router and has nothing to say about routing beyond the local segment; FAILED specifically reports that no answer arrived to a local ARP request.
- C is wrong: ARP can only report that no reply arrived; it cannot distinguish a powered-off host from one on a different segment, a firewall drop, or any other cause of silence.
- D is wrong: `ip neigh` reports the state of address-to-MAC resolution only; it has no relationship to DNS, which resolves names rather than local hardware addresses.

### 3.

A host at 10.1.1.5/24 sends traffic to 10.1.9.50, which is off-subnet. Checking `ip neigh` afterward, no entry for 10.1.9.50 appears at all. Is that evidence of an ARP failure?

- **A.** Yes — the missing entry means ARP failed to resolve the destination, and that failure is what is preventing the traffic from being delivered.
- **B.** No, but only because the destination is using IPv6 Neighbor Discovery instead of ARP, which stores its entries in a separate table.
- **C.** Yes, and the fix is to manually add a static ARP entry for 10.1.9.50 so the host can resolve it directly.
- **D.** No, ARP never crosses a router, so a host never resolves the MAC of an off-subnet destination; the neighbour cache instead holds an entry for the gateway, which is what actually receives the frame.

**Answer: D.** ARP never crosses a router: a host never learns the MAC of an off-subnet destination, so the neighbour cache holds no entry for that address at all — it resolves the gateway instead, and the frame carrying the packet holds the router's MAC, not the remote destination's.

- A is wrong: An off-subnet destination is never expected to appear in the neighbour cache at all; its absence is normal, not evidence of a failed resolution.
- B is wrong: The scenario uses ordinary IPv4 addressing, so ARP, not IPv6 Neighbor Discovery, is the relevant mechanism; the absence of an entry is explained by the off-subnet rule, not by an IPv6 substitution.
- C is wrong: A static ARP entry for an off-subnet address would be meaningless, since ARP cannot resolve an address that is not on the local segment at all; the frame is properly addressed to the gateway instead.

### 4.

A host on an IPv6-only network needs to resolve a neighbour's address to a MAC address. Which mechanism performs that job, since ARP is IPv4-only?

- **A.** ARP itself, since it was updated to handle both IPv4 and IPv6 addresses transparently in modern implementations.
- **B.** Neighbor Discovery, carried over ICMPv6, performs the same job for IPv6 that ARP performs for IPv4.
- **C.** DNS, since name-to-address resolution and address-to-MAC resolution are handled by the same protocol on IPv6 networks.
- **D.** DHCPv6, since it is responsible for distributing MAC address mappings to every client on an IPv6 network.

**Answer: B.** ARP is IPv4-only; IPv6 uses Neighbor Discovery, carried over ICMPv6, for the same job, and `ip neigh` shows the results of both mechanisms, which is why the command is named for neighbours generally rather than for ARP specifically.

- A is wrong: ARP remains IPv4-only by design; it was not extended to IPv6, which uses the separate Neighbor Discovery mechanism instead.
- C is wrong: DNS resolves names to IP addresses across the internet; it has no role in resolving a local IPv6 address to a MAC address, which is Neighbor Discovery's job.
- D is wrong: DHCPv6 distributes addressing configuration to clients; it does not resolve one host's address to another host's MAC address, which is Neighbor Discovery's role.

### 5.

A branch office link is upgraded from 100 Mbit/s to 1 Gbit/s. Nightly bulk backups finish much faster, but an interactive ticketing application "feels exactly the same" to users. Why is that outcome expected rather than a sign the upgrade failed?

- **A.** The upgrade genuinely failed for the interactive application, since any bandwidth increase is defined to proportionally reduce every kind of user-perceived delay equally.
- **B.** The ticketing application's responsiveness is dominated by latency, the per-request delay for many small requests, which capacity upgrades do not change; bulk backups are throughput-bound and benefit directly from more bandwidth.
- **C.** The ticketing application must be using UDP rather than TCP, since only a UDP-based application would fail to benefit from additional link bandwidth.
- **D.** The ticketing application's lack of improvement means DNS resolution, not the link itself, must be the actual bottleneck limiting its performance.

**Answer: B.** A high-bandwidth link can still feel slow: an interactive session or a page load with many small requests is dominated by latency, not by capacity, so buying more bandwidth changes nothing for that kind of workload, while a bulk transfer is bounded by capacity and benefits directly.

- A is wrong: An interactive workload dominated by small requests is bound by latency, not by bandwidth, so a bandwidth increase alone does not proportionally reduce its perceived delay.
- C is wrong: Which transport protocol the application uses is unrelated to why capacity upgrades do not help a latency-bound workload; the explanation is the dominance of round-trip delay, not protocol choice.
- D is wrong: Nothing in the scenario points at DNS specifically; the described symptom, an interactive app unaffected by more bandwidth, is the textbook signature of latency dominance, not a naming problem.

### 6.

Why does jitter, the variation in latency, matter more for voice traffic than the absolute value of latency itself?

- **A.** Voice traffic is unaffected by either latency or jitter, since audio codecs are defined to fully compensate for both automatically regardless of network conditions.
- **B.** Voice tolerates a steady delay reasonably well but not an unpredictable one, since variation in timing disrupts the playback rhythm listeners depend on.
- **C.** Jitter matters more because it is measured in a completely different unit than latency, making it inherently a larger and more significant number.
- **D.** Jitter matters more only for UDP-based voice traffic, and TCP-based voice traffic is entirely unaffected by any timing variation between packets.

**Answer: B.** Jitter — variation in latency rather than its absolute value — is typically what degrades voice and video, which tolerate a steady delay far better than an unpredictable one, since consistent timing can be adapted to while variable timing disrupts playback.

- A is wrong: Voice traffic is genuinely sensitive to jitter; codecs do not fully compensate for unpredictable timing variation, which is exactly why jitter degrades call quality noticeably.
- C is wrong: Jitter and latency are both measured in time, typically milliseconds; the reason jitter matters more for voice is about how playback timing is disrupted, not about differing units of measurement.
- D is wrong: The sensitivity to jitter comes from the real-time playback nature of voice traffic, not specifically from the choice of UDP as transport; the concept is about timing disruption during playback.

### 7.

A team needs to confirm a service responds and see the status code without downloading its content, and separately needs to download a file to disk from the command line. Which tool and mode suits each task?

- **A.** `curl -I` suits confirming the response without downloading content, issuing a HEAD request; `wget URL` suits downloading a file, since it saves the response to a file by default rather than printing it.
- **B.** `wget -I` suits confirming the response without content, and `curl URL` suits downloading to a file, since `curl` is defined to always write its output to a file by default in every configuration seen in practice.
- **C.** Both tasks are best done with `curl -v`, since verbose mode is defined to automatically save a file to disk in addition to printing the full request and response exchange.
- **D.** Neither tool can perform either task; both require a full browser to confirm a response or download a file from the command line reliably.

**Answer: A.** `curl -I` issues a HEAD request, so only headers come back, confirming a service responds and returns a status code; `wget URL` saves the response to a file named after the URL's last path element, matching the two default behaviours to the two different tasks described.

- B is wrong: `-I` is a `curl` flag, not a `wget` one, and `curl URL` by default writes the response to standard output, flooding the terminal, rather than saving a file the way `wget` does.
- C is wrong: `curl -v` prints the whole exchange for diagnostic purposes; it does not save a file to disk by default, and is not the tool built specifically for a headers-only check or for downloading.
- D is wrong: Both `curl` and `wget` are specifically designed as command-line HTTP clients capable of exactly these tasks without any browser involved at all.

### 8.

A `curl` command against a service exits with status 0, and a monitoring script treats this as proof the request succeeded fully. Is that a safe assumption?

- **A.** Yes — a `curl` exit status of 0 is defined to guarantee the HTTP response status was in the 2xx success range for every request made.
- **B.** No — a `curl` exit status of 0 means the transfer completed, not that the HTTP status was 2xx; the actual status code has to be read separately, or `--fail` used to make an HTTP error a non-zero exit.
- **C.** No, but only because `wget`, not `curl`, is the tool whose exit status can be trusted to reflect the actual HTTP status code returned.
- **D.** Yes, but only when `-I` is combined with the request, since a HEAD-only request is defined to make exit status 0 equivalent to a guaranteed HTTP success, since curl aborts a HEAD request as a transfer error whenever the status line is not 2xx.

**Answer: B.** A `curl` exit status of 0 means the transfer completed, not that the HTTP status was 2xx — the status code has to be read separately, or `--fail` used to make an HTTP error result in a non-zero exit, which is exactly the check a monitoring script needs instead of relying on exit status alone.

- A is wrong: Exit status 0 reports that the transfer itself completed without a connection-level error; it says nothing about whether the HTTP status code returned was a success code or an error code.
- C is wrong: `wget` has the same distinction between transfer completion and HTTP status; switching tools does not resolve the underlying need to check the status code or use an equivalent flag separately.
- D is wrong: Combining `-I` does not change what exit status 0 reports; a HEAD request can also return an HTTP error status while the transfer itself still completes and exits 0.

### 9.

What is the default output destination for `curl URL` compared with `wget URL`, and why does that difference commonly catch people out?

- **A.** `curl URL` saves the response to a file by default, while `wget URL` writes it to standard output, flooding the terminal with the response body instead.
- **B.** Both tools write to standard output by default, and a file is only ever saved when the `-O` flag is explicitly given to either command.
- **C.** `curl URL` writes the response body to standard output by default, flooding the terminal, while `wget URL` saves it to a file — the opposite defaults are the specific difference that catches people out.
- **D.** Both tools save to a file by default, and standard output is only ever used when the `-q` flag is explicitly given to either command.

**Answer: C.** The default output destination is the difference that catches people: `curl URL` floods the terminal with the body, and `wget URL` leaves a file behind — `wget -O -` sends output to standard output instead, and `-q` silences progress, but the plain defaults are opposite from what many expect.

- A is wrong: This reverses the actual defaults: `curl` writes to standard output by default, and `wget` is the one that saves a file, not the other way around.
- B is wrong: `wget` saves to a file by default without requiring any extra flag; `-O` on `curl` is what makes it behave like `wget` by writing to a file, which is not `curl`'s own default.
- D is wrong: `-q` silences progress output for `wget`; it does not control whether output goes to standard output or a file, and `curl`'s actual default is standard output, not a saved file.

### 10.

A page renders correctly and fully in a browser, but `curl -I` (and even a plain `curl` for the body) returns an almost empty response. Is this evidence the service is broken?

- **A.** Yes — any meaningful discrepancy between what a browser displays and what `curl` retrieves is defined to always indicate a server-side fault or misconfiguration.
- **B.** No, but only because `curl -I` specifically strips the body from every response regardless of what content the server actually returned, unlike a plain `curl`.
- **C.** No — neither tool executes JavaScript, so a page that looks right in a browser can legitimately return an almost empty body to them, since much of the content is rendered client-side after the initial response.
- **D.** Yes, and the fix is to add `-L` to follow redirects, since a page rendering fully in a browser while `curl` sees almost nothing is defined to always be a redirect-chasing issue.

**Answer: C.** Neither `curl` nor `wget` executes JavaScript, so a page that looks right in a browser can return an almost empty body to them legitimately, since a large share of the rendered content may be constructed client-side after the initial, minimal HTTP response the tools actually retrieve.

- A is wrong: A discrepancy here has a legitimate, common explanation, the absence of JavaScript execution in either command-line tool, rather than necessarily indicating any server-side fault at all.
- B is wrong: `curl -I` does strip the body by issuing a HEAD request, but the scenario also states a plain `curl` for the body returned an almost empty result, which `-I`'s behaviour alone does not explain.
- D is wrong: `-L` addresses following HTTP redirects specifically; an almost-empty response from a page that otherwise renders fully is a documented JavaScript-execution difference, not necessarily a redirect problem.

### 11.

A user reports pinging colleagues on the office subnet works fine, but nothing beyond the office — no internet, no other sites — is reachable. What should be checked first, and what command shows it directly?

- **A.** The DNS resolver configuration, since any inability to reach a remote site is assumed to always trace back to a naming problem instead under the great majority of ordinary configurations.
- **B.** The default gateway, shown by `ip route show default`; a missing or wrong 0.0.0.0/0 entry produces exactly this "local works, remote does not" pattern.
- **C.** The physical cabling to the switch, since any connectivity problem of any kind is assumed to originate at the physical layer first.
- **D.** The DHCP server, since only a DHCP fault could plausibly explain the local subnet working while remote destinations do not.

**Answer: B.** The default gateway is the route for 0.0.0.0/0, matching everything and losing to every more specific entry; "local works, remote does not" is exactly the symptom a missing or wrong gateway produces, and `ip route show default` filters straight to that entry, narrower than the full table `ip route` prints.

- A is wrong: A working gateway does not imply working DNS, but the symptom described — nothing beyond the subnet at all, not just names — points first at routing rather than at name resolution.
- C is wrong: Working local-subnet connectivity already confirms the physical layer is functioning; a symptom confined to remote destinations points higher up the stack, at routing.
- D is wrong: A DHCP fault would typically prevent the host from getting an address at all, not selectively allow local traffic while blocking remote traffic; that selective pattern points at the gateway.

### 12.

An administrator whose host has a single configured address of 10.0.5.20/24 runs `ip route add default via 192.168.9.1`. What actually happens?

- **A.** It succeeds anyway, since the kernel automatically adds a temporary connected route to reach any configured gateway address regardless of which subnet that address happens to fall in.
- **B.** It succeeds, but only for traffic to well-known ports, since the kernel treats those destinations as a special case bypassing the gateway check.
- **C.** It is accepted without complaint and installs normally, failing only later when traffic is sent and no ARP reply ever comes back for the gateway address itself.
- **D.** The command is rejected outright with `Error: Nexthop has invalid gateway.`, because a gateway must be on-link, on the same subnet as one of the host's own addresses.

**Answer: D.** A gateway address outside every configured subnet cannot be used at all — the host cannot ARP for it, since ARP never crosses a router and the gateway itself must be directly, locally reachable for the route to function.

- A is wrong: The kernel does not fabricate a route to make an unreachable gateway reachable; the gateway must genuinely be on-link for the route to function at all.
- B is wrong: There is no port-based exception to gateway reachability; the requirement that a gateway be on-link applies uniformly regardless of destination port.
- C is wrong: The next hop is validated at the moment the route is added, not at delivery time; `ip route add` rejects an off-link gateway outright unless `onlink` is given to force it.

### 13.

Two default routes exist on a host, each with a different metric, and one of them points out an interface that has since been physically disconnected. What is the likely, and dangerous, consequence?

- **A.** The kernel automatically detects the disconnected interface and falls back to the remaining working default route without any further configuration.
- **B.** Both default routes are always used simultaneously, splitting outbound traffic evenly between the working and the disconnected interface.
- **C.** Neither route is used once one interface is disconnected, since the kernel requires every default route in the table to be simultaneously valid before using any of them as a matter of routine operational practice.
- **D.** If the disconnected interface's route has the lower metric, it silently wins and black-holes outbound traffic, even though a working default route exists on the other interface.

**Answer: D.** More than one default route can exist with different metrics, and the lowest metric wins regardless of whether that path actually works, so a stale low-metric default on a disconnected interface silently black-holes traffic that a working route on another interface could otherwise have carried.

- A is wrong: Route selection is based purely on metric, not on live interface health; the kernel does not automatically demote a route just because its interface is down.
- B is wrong: Route selection picks a single winning entry by metric; it does not load-balance traffic evenly across every default route present in the table.
- C is wrong: The kernel does not require every default route to be valid; it simply selects among whichever entries exist by metric, which is exactly what makes a stale one dangerous.

### 14.

A host has a working default IPv4 route and internet access. Asked about the host's IPv6 reachability, an administrator runs `ip route show default`, which prints the IPv4 default route and nothing at all about IPv6. Does that prove there is no IPv6 default route?

- **A.** No. `ip route show default` without `-6` shows only the IPv4 table; a separate IPv6 default route could still exist and must be checked with `ip -6 route`.
- **B.** Yes — a single routing table governs both address families, so an empty result for one automatically means the other has no default route either, an assumption that holds until it does not.
- **C.** Yes, but only because a host without a working IPv4 default route is assumed to be incapable of holding an IPv6 default route at the same time.
- **D.** No, but only because IPv6 does not use a default route mechanism at all, relying entirely on DNS-based path selection instead.

**Answer: A.** `ip route show default` reports only the IPv4 default route by default; IPv6 keeps a separate table, so an empty IPv4 result must be checked against `ip -6 route` before concluding anything about IPv6 reachability.

- B is wrong: IPv4 and IPv6 maintain separate routing tables; an empty result under one family carries no implication at all about the other.
- C is wrong: The scenario states IPv4 is working; regardless, the two address families are configured and checked independently, with no such dependency between them.
- D is wrong: IPv6 uses the same next-hop routing concept as IPv4, including a default route; DNS has no role in path selection for either address family.

### 15.

A machine has been powered off for far longer than its DHCP lease duration. When it powers back on, what should be expected?

- **A.** It is guaranteed to receive the exact same address as before, since a DHCP server always reserves an expired lease's address permanently for its original holder under the great majority of ordinary configurations.
- **B.** It will fail to obtain any address at all, since a DHCP server never issues a fresh lease to a client whose previous one has expired.
- **C.** It will self-assign a 169.254 link-local address automatically, since that is the defined behaviour whenever a lease has expired for any reason.
- **D.** It may receive a different address than before, since the previous lease will have expired and the address may have been reassigned to another client in the meantime.

**Answer: D.** A lease is a time-bounded allocation the client must renew to keep, which is exactly why a machine switched off longer than its lease may come back to find its old address already reassigned, requiring a fresh DISCOVER to obtain a new one.

- A is wrong: A lease is a time-bounded allocation, not a permanent reservation; once it expires, the address is free to be handed to a different client, so the same address is not guaranteed.
- B is wrong: An expired lease simply means the client starts again from DISCOVER; a DHCP server issues a fresh lease to any requesting client, expired-lease history notwithstanding.
- C is wrong: Self-assignment to link-local space happens when no DHCP server answers at all, not simply because a previous lease expired while the server remains available.

### 16.

At roughly what point in a lease does a client first attempt to renew, and how, and what happens if that first attempt fails?

- **A.** At T1, about half the lease duration, the client tries to renew directly with the server that granted it, by unicast; if that fails, at T2 it broadcasts a renewal request any server may answer.
- **B.** At T2, about seven-eighths of the lease duration, the client tries to renew by broadcast first, only falling back to unicast to the original server if that fails.
- **C.** Exactly at lease expiry, with no earlier renewal attempt made at all, since the client is defined to wait until the very last possible moment.
- **D.** Immediately after the lease is granted, with the client re-requesting the same address again right away as a confirmation step.

**Answer: A.** At T1, by default half the lease time, the client tries to renew directly with the server that granted it, by unicast; if that fails, at T2, seven-eighths of the lease time, it enters rebinding and broadcasts a renewal request that any server may answer, and if the lease expires with no answer it must start again from DISCOVER.

- B is wrong: The order is reversed: the client first tries unicast renewal to the original server at T1, and only broadcasts more broadly at the later point, T2, if that attempt fails.
- C is wrong: The client attempts renewal well before expiry, at T1 (about half the lease) and again at T2 (about seven-eighths), not only at the moment of expiry itself.
- D is wrong: There is no immediate re-request right after a lease is granted; the first renewal attempt happens later, at T1, roughly half the lease duration in.

### 17.

A hypervisor host needs a predictable address without visiting the machine to configure it by hand, and the team wants every address kept in one authoritative place rather than scattered across host configurations. Which addressing choice fits, and how does it differ from a plain static address?

- **A.** A plain static address fits equally well, since a static address and a reservation both live on the DHCP server and behave identically in every respect as a matter of routine operational practice, regardless of which distribution or vendor is involved.
- **B.** A DHCP reservation fits. The client stays an ordinary DHCP client while the server binds its MAC to a fixed address, keeping every address centrally managed rather than configured by hand on the host.
- **C.** Neither fits; only a purely dynamic lease from the general pool satisfies the requirement for centrally managed addressing without visiting the host.
- **D.** A reservation fits, but it requires the host to be manually configured with a static IP address in addition to being registered on the server.

**Answer: B.** A DHCP reservation binds a specific MAC address to a fixed IP on the server side, giving a device like a hypervisor a stable, centrally managed address without visiting it or configuring it by hand — the client is configured for DHCP like any other client, and the stability comes entirely from the server.

- A is wrong: A static address is held by the host itself, not the server, and a static host does not depend on the DHCP server being reachable at boot the way a reservation-based client does.
- C is wrong: A purely dynamic lease from the general pool gives no guarantee of address stability at all, which fails the requirement for a predictable address.
- D is wrong: A reservation requires no extra host-side configuration at all; the client is configured for DHCP like any other client, and the stability comes entirely from the server side.

### 18.

A DHCP server is unreachable when two brand-new machines boot onto the network for the first time. One is configured by hand with a static address; the other has a DHCP reservation waiting for it on the server. What is the difference in outcome?

- **A.** Both machines come up identically, since a reservation is functionally indistinguishable from a static address once it has been configured on the server, which pushes the address into the client's own persistent configuration.
- **B.** The statically configured machine comes up regardless of the server; the reservation-based one gets nothing, because it is still a DHCP client with no lease of its own to fall back on.
- **C.** Neither machine comes up, since any DHCP server outage is defined to block every host on the network from initialising its networking at all.
- **D.** The reservation-based machine comes up regardless of the server, since a reservation is cached locally on the client the first time it is granted.

**Answer: B.** A reservation is not a static address. The client is still a DHCP client, so on a first boot with the server unreachable it has no lease at all, while a statically configured host comes up without needing the server.

- A is wrong: A reservation still requires a successful DHCP exchange at boot; unlike a static address held by the host itself, it fails to come up if the server is unreachable.
- C is wrong: A statically configured host does not depend on DHCP at all, so a DHCP server outage has no bearing on whether it comes up; only the reservation-based client is affected.
- D is wrong: A reservation is a server-side binding and nothing about it is stored on the client. A DHCP client may reuse a previously granted, still-unexpired lease when no server answers, but a machine booting for the first time has no such lease to reuse.

### 19.

A printer's network card fails and is replaced, which changes the device's MAC address. Its DHCP reservation, keyed to the old MAC, is left unchanged. What happens the next time the printer requests an address?

- **A.** The reservation automatically follows the printer to its new MAC address, since DHCP servers are defined to track devices by hostname rather than by MAC in the overwhelming majority of real deployments.
- **B.** The printer fails to obtain any address at all, since a DHCP server refuses to serve any device whose MAC does not match an existing reservation.
- **C.** The reservation is automatically deleted and replaced with a static address configuration pushed to the printer over the network by the server.
- **D.** The reservation silently no longer applies, since it is keyed on the MAC address; the printer receives an ordinary address from the general pool instead of its reserved one.

**Answer: D.** A reservation is keyed on the MAC address, so replacing a failed network card, or a virtual machine getting a regenerated MAC, silently breaks the binding — the device simply receives an ordinary address from the dynamic pool instead, with no error raised.

- A is wrong: A reservation is bound to a MAC address specifically, not a hostname; nothing about the binding automatically updates to follow a device to a new MAC.
- B is wrong: A DHCP server does not refuse unreserved devices outright; the printer simply receives an ordinary address from the general dynamic pool instead of its now-mismatched reservation.
- C is wrong: DHCP servers do not push static configuration to a device; the reservation simply stops matching, and the printer falls back to receiving an ordinary dynamic lease instead.

### 20.

An address inside a Kea DHCP server's dynamic pool is already leased to one host when an administrator adds a reservation for that same address to a different host. What does the server do?

- **A.** It deletes the existing lease immediately — a reservation always outranks an active dynamic lease, so the reserved host is given its reserved address on the spot.
- **B.** It refuses the reservation outright at configuration load time, because an address that falls inside a dynamic pool's active range cannot be reserved for a specific client at all.
- **C.** It cannot hand the address over at once: it parks the newly reserved host on another pool address, and reclaims the reserved one by NAKing the original holder when it next renews.
- **D.** It assigns the reserved address to both hosts at once — each client's own duplicate-address detection then settles the conflict between them.

**Answer: C.** Reservations and leases are stored separately, so reserving an address that is already leased to a different client creates a conflict the server resolves over time: the reserved host is parked on another pool address, and the original holder is NAKed at its next renewal.

- A is wrong: Removing the lease outright does not solve the problem: the reserved host would find the address still in use by the original holder and send a DHCPDECLINE, which is why the server hands it a different address in the meantime.
- B is wrong: In-pool and out-of-pool reservations use identical syntax and are handled uniformly; a reservation may name any address belonging to the subnet, including one that lies inside a dynamic pool.
- D is wrong: The server never deliberately double-assigns an address; it resolves the conflict itself, holding the reserved address back until the original holder's lease has been taken away with a DHCPNAK.

### 21.

A new employee's laptop cannot get online. It shows no IP address at all. A separate report says a colleague's laptop has an address and can ping the gateway, but web pages by name fail while an IP address typed directly still works. Which service is implicated in each case?

- **A.** Both cases implicate DHCP, since DHCP is responsible for issuing addresses and also for resolving the names that web pages depend on.
- **B.** Both cases implicate DNS, since a missing IP address is treated as ultimately a naming failure at a lower layer.
- **C.** The first case implicates DNS, since a missing address is read as evidence the hostname could not be resolved during boot; the second implicates DHCP, since a missing default route is read as evidence the address lease itself never completed.
- **D.** The first case implicates DHCP, since no address means the addressing exchange failed; the second implicates DNS, since an address that works while names do not is DNS's signature, not DHCP's.

**Answer: D.** DHCP hands out addresses and configuration; DNS answers questions about names — a machine with no address needs DHCP, and a machine with an address that cannot resolve a name needs DNS, and conflating the two is the classic error this competency tests.

- A is wrong: DHCP hands out addressing configuration only; it does not resolve names at all, and does not create DNS records by itself, so the second case is not a DHCP problem.
- B is wrong: A completely missing IP address is an addressing failure, which is DHCP's job to provide; DNS has no role in whether a host receives an address at all.
- C is wrong: A missing IP address entirely is an addressing failure — DHCP's job — not a name-resolution failure, and the second case, addresses working while names fail, is squarely DNS.

### 22.

A DHCP server on one subnet must serve clients on a physically separate subnet, and DHCP discovery is a broadcast that does not cross routers. What component makes this work, and what does it do?

- **A.** Nothing extra is needed, since routers are defined to always forward the first four bytes of any broadcast packet regardless of protocol.
- **B.** A DHCP reservation configured on the server, which is what allows a single broadcast to be forwarded across a router boundary to remote clients as a matter of routine operational practice.
- **C.** A static default route added to the clients' subnet, which redirects the broadcast DISCOVER message toward the remote DHCP server directly.
- **D.** A relay agent placed on the clients' subnet, which forwards the broadcast DISCOVER on to the DHCP server at a configured address, normally by unicast, and relays the reply back.

**Answer: D.** Because the client has no address yet, the first DHCP messages are broadcasts, and since broadcasts do not cross routers, serving a subnet whose DHCP server sits elsewhere requires a relay agent on that subnet to forward the requests as unicast to the remote server.

- A is wrong: Routers do not selectively forward parts of a broadcast packet; broadcasts simply do not cross a router at all without a relay agent to convert them to unicast.
- B is wrong: A DHCP reservation binds one MAC to one fixed address; it has no bearing on whether a broadcast crosses a router, which is the relay agent's job entirely.
- C is wrong: A static route affects unicast forwarding of known destinations; it does not enable a broadcast, which by definition has no single destination, to cross a router at all.

### 23.

A laptop comes up with an address in the 169.254.0.0/16 range and no internet access. A colleague calls this "a bad DHCP lease." Is that accurate?

- **A.** No, the laptop received no lease at all; it self-configured a link-local address because no DHCP server answered its broadcast DISCOVER.
- **B.** Yes — a 169.254 address is exactly what a DHCP server issues when its address pool is temporarily exhausted of usable leases.
- **C.** Yes, and the fix is to renew the lease immediately using the DHCP client's renewal command, since the address is simply near expiry and the client is still bound to a lease the server granted earlier.
- **D.** No, but only because 169.254.0.0/16 is actually RFC 1918 private address space rather than link-local space.

**Answer: A.** DHCP hands out addresses and configuration; it does not by itself make an address permanent, and a client showing a 169.254 address has not been given a bad lease — it has received no lease at all and self-configured after no DHCP server answered.

- B is wrong: A 169.254 address is self-assigned by the client, not issued by any DHCP server; pool exhaustion would instead produce a straightforward lease failure with no address issued at all.
- C is wrong: There is no lease to renew, since none was ever granted; the address is self-assigned specifically because DISCOVER went unanswered, not because an existing lease is expiring.
- D is wrong: 169.254.0.0/16 is link-local (APIPA) space, a separate reservation from the three RFC 1918 private ranges, not one of them.

### 24.

Name the four messages of the DHCP exchange in order, and the two UDP ports involved.

- **A.** DISCOVER, OFFER, REQUEST, ACK, using UDP port 67 for the server and port 68 for the client.
- **B.** REQUEST, DISCOVER, ACK, OFFER — using UDP port 68 for the server and port 67 for the client.
- **C.** SYN, SYN-ACK, ACK, FIN — the same four-step exchange used to establish and later close a TCP connection.
- **D.** DISCOVER, REQUEST, OFFER, ACK — using UDP port 53 for the server and port 68 for the client.

**Answer: A.** The exchange is conventionally called DORA: the client broadcasts DISCOVER; a server replies with OFFER; the client broadcasts REQUEST naming the offer it accepts; the server confirms with ACK, over UDP port 67 for the server and port 68 for the client.

- B is wrong: This has both the message order and the port assignment reversed: DISCOVER comes before REQUEST, and the server uses port 67, the client port 68.
- C is wrong: SYN, SYN-ACK, ACK and FIN are TCP handshake and teardown flags, an entirely different exchange from DHCP's DISCOVER, OFFER, REQUEST, ACK sequence.
- D is wrong: REQUEST and OFFER are swapped in order, and port 53 is DNS's port, not DHCP's; the DHCP server uses port 67.

### 25.

A user reports a web application is unreachable. Following the recommended diagnostic order, what is the very first thing to establish, and how?

- **A.** Establish the record's TTL first with `dig`, since knowing the caching interval is defined to be the prerequisite step before anything else can be diagnosed.
- **B.** Establish whether the authoritative server, not the recursive resolver, answers first, using `@`, since bypassing the cache is defined to always be the very first diagnostic step in any outage.
- **C.** Establish whether `getent hosts` and `dig` agree, since checking for a disagreement between the two is defined to always be the first productive diagnostic step regardless of the reported symptom in every configuration seen in practice.
- **D.** Establish whether the fault is naming at all, by reaching the destination directly by IP address — if that works and the name does not, it is DNS, and only then does querying with `dig` or `nslookup` become the productive next step.

**Answer: D.** Establishing whether the fault is naming at all, by reaching the destination by IP address, is the first diagnostic move: if that works and the name does not, it is DNS, and only then do `dig`'s status field and the other DNS-specific checks become the productive next step.

- A is wrong: TTL becomes relevant once a resolution problem is suspected and a change is being planned or traced; it is not the first thing to check when the actual fault category, naming versus connectivity, is still unknown.
- B is wrong: Querying the authoritative server directly is a later step, useful for distinguishing a stale cache from a wrong record, not the first move when the fault category itself is still unknown.
- C is wrong: Comparing `getent hosts` with `dig` is useful once DNS itself is confirmed to be working correctly; testing raw IP reachability first is what actually separates naming from connectivity as the very first move.

### 26.

A `dig` query returns status NOERROR with a completely empty ANSWER section. A junior engineer reads this the same way as NXDOMAIN, concluding the name does not exist. Is that the correct reading?

- **A.** Yes — NOERROR and NXDOMAIN are defined to be functionally identical outcomes whenever the ANSWER section of a `dig` response happens to be empty.
- **B.** No, but only because the query must have used `+short`, which is defined to always suppress the ANSWER section regardless of whether a record actually exists, because `+short` suppresses the ANSWER section before the response is ever parsed.
- **C.** Yes, but only for MX record queries specifically, since NOERROR and NXDOMAIN are treated as equivalent only when the queried record type is MX.
- **D.** No — NOERROR with an empty ANSWER section means the name exists but has no record of the type asked for, which is a different thing entirely from NXDOMAIN, which means the name itself does not exist.

**Answer: D.** Ignoring the status line, NOERROR with an empty ANSWER section means the name exists but has no record of the type asked for, which is not the same as NXDOMAIN — reading the status field first (NXDOMAIN, SERVFAIL, or NOERROR with an empty answer) is exactly the recommended second diagnostic step after confirming naming is the fault, before reaching for terser output such as `dig +short` once the record is confirmed to exist.

- A is wrong: NOERROR and NXDOMAIN are distinct status codes with different meanings; an empty ANSWER section under NOERROR specifically means the name exists without that record type, not that the name is absent.
- B is wrong: `+short` prints just the answer data when a record exists; it is not what causes an empty ANSWER section here, and the scenario is about interpreting the status line, not about a missing flag.
- C is wrong: The distinction between NOERROR (with an empty answer) and NXDOMAIN applies to any record type, not specifically or only to MX; the two statuses always carry different meanings.

### 27.

A `dig @ns1.example.com example.com` query is run to settle an argument about whether a DNS change has taken effect. What does querying the authoritative server directly, with `@`, actually accomplish that a plain `dig example.com` does not?

- **A.** It bypasses every cache in between and asks the source of truth for the zone directly, which is the definitive test of what the zone actually currently contains, separate from what any resolver's cache still holds.
- **B.** It has no meaningful difference from a plain query, since every DNS server, authoritative or caching, is defined to always return the exact same freshly computed answer under the great majority of ordinary configurations.
- **C.** It switches the query from DNS entirely over to using `getent hosts` internally, which is what actually explains any difference in the result observed.
- **D.** It forces the query to use TCP instead of UDP, and that protocol switch alone is what accounts for the more authoritative-seeming answer received.

**Answer: A.** Adding `@server` sends the query to a named server instead, so `dig @ns1.example.com` asks the authoritative server directly and bypasses every cache in between — the definitive test of what the zone actually contains, and the standard way to settle whether a change has genuinely taken effect versus merely being masked by a stale cached answer elsewhere.

- B is wrong: A caching resolver may return a stale, previously cached answer, while the authoritative server always returns its current, configured value directly; the two can genuinely differ, which is the whole point of querying `@`.
- C is wrong: `dig @server` remains a direct DNS query to the named server; it does not invoke `getent hosts` or the local name service switch at all, which is an entirely separate resolution path.
- D is wrong: Using `@server` does not itself force TCP; the reason the result is authoritative is that it comes directly from the zone's source of truth, not because of a transport protocol change.

### 28.

`nslookup` labels an answer "Non-authoritative answer." A user reads this as a warning that something is wrong. What does the label actually mean?

- **A.** It merely means the responding server is not an authority for that zone, typically a recursive resolver answering from its cache, which is the normal and expected case for an ordinary lookup.
- **B.** It means the DNS record being returned is stale or expired and should not be trusted until the resolver's cache is manually flushed.
- **C.** It means the query was sent to the wrong nameserver entirely, and the correct nameserver address needs to be supplied with the `server` command instead.
- **D.** It means the record type requested does not exist for that name, and a different record type should be tried using the `-type=` option instead.

**Answer: A.** `nslookup` labels any answer that did not come from an authoritative server as "Non-authoritative," which is the normal case for a cached recursive answer — trusting it as a warning, rather than as a routine label, is a documented misreading of ordinary output.

- B is wrong: The label does not indicate staleness or an expired record; it simply notes the answer came through a caching resolver rather than the authoritative server itself.
- C is wrong: A "Non-authoritative answer" does not indicate the wrong server was queried; it simply reflects that the answer came from a resolver's cache rather than the zone's own authoritative source.
- D is wrong: The label is unrelated to record-type existence; a nonexistent record type would produce an empty answer or a different status, not this note about the answer's authoritative source.

### 29.

A team needs to alias `www.example.com` to `example.com` and also needs `example.com` itself, the zone apex, to carry its own delegation and administrative records. A junior engineer proposes a CNAME at the apex to simplify things. Why won't that work?

- **A.** A CNAME can be placed at the apex without issue; the restriction only ever applies to subdomains, never to the zone apex itself.
- **B.** A CNAME cannot coexist with other records at the same name, and the apex must carry NS and SOA records, so a CNAME cannot be placed there at all.
- **C.** A CNAME cannot be placed at the apex because CNAME records are restricted to IPv6-only zones, and this zone uses IPv4 addressing, a pattern that holds across most deployments encountered.
- **D.** A CNAME cannot be placed at the apex because the apex name is reserved exclusively for A and AAAA records by the DNS protocol.

**Answer: B.** A CNAME cannot coexist with other record types at the same name, which is why a CNAME cannot be placed at a zone apex — the apex must carry NS and SOA records, and a CNAME there would conflict with both.

- A is wrong: The restriction applies universally to any name carrying a CNAME, including the apex; the apex is in fact the clearest example of why the rule matters, since it must carry NS and SOA.
- C is wrong: CNAME restriction has nothing to do with address family; it applies equally in IPv4 and IPv6 zones, and the actual reason is the coexistence rule with other record types.
- D is wrong: The apex is not restricted to only A and AAAA records; it also carries NS and SOA, among others — the actual restriction is that a CNAME cannot coexist with any other record at its name.

### 30.

A website resolves correctly but the same domain's email keeps bouncing. Given `dig A example.com` returns a good answer, what should be checked next, and with which query?

- **A.** The same A record again, since `dig A` also reports mail-routing status as part of its output when a domain has email configured.
- **B.** The PTR record for the web server's address, since reverse lookups are what mail servers use to decide whether to accept a website's traffic.
- **C.** The mail exchanger records, checked with `dig MX example.com`, since a working A record says nothing about whether mail-directing MX records exist or point anywhere valid.
- **D.** The TTL on the A record, since a low TTL is what commonly causes email delivery to fail for a domain with an otherwise working website.

**Answer: C.** A working forward lookup implies nothing about reverse or mail-routing records: MX names the mail exchangers for a domain, a separate entry from A, so bouncing mail on an otherwise working domain points straight at checking `dig MX` next.

- A is wrong: `dig A` reports only the IPv4 address record; it carries no information about mail routing, which lives in a separate MX record entirely.
- B is wrong: PTR records support reverse lookups for the mail server's own sending address in anti-spam checks, not the website's own forward A record, and are not the first thing to check for bouncing mail on this domain.
- D is wrong: TTL governs cache lifetime for a record and has no direct bearing on whether mail delivery succeeds; the missing piece here is the MX record, a distinct entry entirely.

### 31.

A reverse-lookup zone for 192.0.2.10 needs to be found. Where does that PTR record actually live, and who typically controls that zone?

- **A.** In the same forward zone as the domain's A record, since PTR and A records for the same host are always stored together in one place.
- **B.** At `192.0.2.10.in-addr.arpa`, written in the same forward order as the original address, in a zone controlled by whoever owns the domain name.
- **C.** At `10.2.0.192.in-addr.arpa`, in a zone usually delegated to whoever owns the address block, not to whoever owns the domain name the address happens to be used for.
- **D.** PTR records do not have a fixed location at all; a resolver locates them dynamically by querying every authoritative server it knows about in sequence, stopping at the first one that answers.

**Answer: C.** A PTR record for 192.0.2.10 lives at `10.2.0.192.in-addr.arpa`, in a zone that is usually delegated to whoever owns the address block — not to whoever owns the domain name — which is why its absence breaks mail reputation checks while leaving the website perfectly reachable.

- A is wrong: PTR records live in the separate in-addr.arpa reverse hierarchy, keyed by address, not alongside the forward A record in the domain's own zone.
- B is wrong: The in-addr.arpa naming reverses the address octets, so the reverse name is `10.2.0.192.in-addr.arpa`, not the forward-ordered form, and control follows the address block, not the domain.
- D is wrong: PTR records have a well-defined location, the reverse in-addr.arpa hierarchy for the address in question, not an ad hoc search across arbitrary servers.

### 32.

What is the difference between an A record and a CNAME record, and why does confusing them cost marks?

- **A.** An A record and a CNAME record are functionally identical, differing only in which administrative tool is conventionally used to create each one.
- **B.** An A record maps a name directly to an IPv4 address; a CNAME aliases one name to another name, which is then itself resolved. The two solve different problems and cannot substitute for each other everywhere.
- **C.** An A record is used only for IPv6 addresses, while a CNAME is used only for IPv4 addresses, making them address-family-specific alternatives.
- **D.** An A record can only be queried with `nslookup`, while a CNAME can only be queried with `dig`, because the two record types are carried in different wire formats that only the tool originally written for each one can decode.

**Answer: B.** A maps a name to an IPv4 address directly, terminating the lookup; CNAME aliases one name to another name, which must then itself be resolved — the A-versus-CNAME distinction is a commonly tested, commonly missed structural difference.

- A is wrong: They are structurally different: an A record resolves directly to an address, while a CNAME resolves to another name that must itself then be resolved.
- C is wrong: AAAA, not A, is the IPv6 address record; A is IPv4, and CNAME has no address-family restriction at all since it aliases names, not addresses.
- D is wrong: Both record types can be queried by any of the DNS query tools; the distinction between them is structural, about what each record resolves to, not about tool compatibility.

### 33.

A stale `/etc/hosts` entry sends every application on a host to the wrong server, but `dig` for the same name returns the correct address. Which command reproduces what the applications actually see, and why does `dig` disagree?

- **A.** `dig` reproduces the application's view correctly, and the disagreement means `/etc/hosts` is being silently ignored by the operating system entirely.
- **B.** `nslookup` reproduces the application's view, since it is the one DNS tool that is defined to consult `/etc/hosts` before querying a nameserver.
- **C.** `getent hosts` reproduces the application's view, because it walks the same name service switch applications use, including `/etc/hosts`; `dig` bypasses the switch entirely and queries a nameserver directly.
- **D.** `host` reproduces the application's view, since its terse output format is specifically designed to reflect the nsswitch resolution order.

**Answer: C.** `getent hosts` performs a lookup through the same name service switch an application uses, including `/etc/hosts` and any resolver plugin named on the `hosts:` line, while `dig`, `nslookup` and `host` build a DNS query and send it straight to a nameserver, bypassing the switch entirely.

- A is wrong: `/etc/hosts` is not being ignored; it is consulted by the name service switch that applications use, which `dig` specifically bypasses, explaining the disagreement.
- B is wrong: `nslookup`, like `dig`, queries DNS directly and does not consult `/etc/hosts` or the name service switch at all.
- D is wrong: `host`, like `dig` and `nslookup`, queries a nameserver directly; its terse output format has no relationship to whether it consults the name service switch.

### 34.

What does the conventional `hosts:` value `files dns` in `/etc/nsswitch.conf` actually determine?

- **A.** It determines which DNS record types a resolver is permitted to request, restricting queries to the record types both listed sources are able to supply.
- **B.** It determines the TTL applied to cached answers, with `files` and `dns` each specifying a separate caching duration.
- **C.** It determines whether `/etc/resolv.conf` is regenerated automatically at boot, based on which of the two keywords appears first.
- **D.** It determines the order name resolution sources are consulted: `/etc/hosts` is read first, and a nameserver is queried only if no entry there matches.

**Answer: D.** The `hosts:` line in `/etc/nsswitch.conf` sets the order in which name-resolution sources are consulted; `files dns`, the conventional value, means `/etc/hosts` is read first and a nameserver is queried only if no entry there matches, which explains why a stale hosts entry can silently override a correct DNS record.

- A is wrong: The `hosts:` line governs which sources are consulted and in what order, not which record types may be requested from a nameserver once one is queried.
- B is wrong: TTL governs how long a resolver caches an answer and is set per DNS record, not derived from the `hosts:` line, which is only about source order.
- C is wrong: Regeneration of `/etc/resolv.conf` is managed separately by NetworkManager, a DHCP client, or systemd-resolved; the `hosts:` line has no role in that process.

### 35.

A host running systemd-resolved has `resolve` included on its `hosts:` line, and `getent hosts` returns an answer that seems to come from neither `/etc/hosts` nor the nameserver in `/etc/resolv.conf` directly. What explains this?

- **A.** The `resolve` entry means the query went to the 127.0.0.53 stub listener named in `/etc/resolv.conf`, which is the only route by which systemd-resolved is ever able to answer a lookup.
- **B.** The `resolve` entry means the nsswitch order has been silently reversed to `dns files`, so DNS is now consulted ahead of `/etc/hosts` for every lookup this host performs.
- **C.** The `resolve` entry hands the lookup to systemd-resolved over its own IPC socket, so the answer can come from resolved cache, from its internal `/etc/hosts` handling, or from a synthesized record.
- **D.** The `resolve` entry means the answer must have come from a DHCP-supplied static name mapping handed out with the lease, rather than from any resolver at all.

**Answer: C.** On systems running systemd-resolved the `hosts:` line commonly includes `resolve`, so lookups may be served by a local stub at 127.0.0.53 rather than by the nameserver a naive reading of `/etc/resolv.conf` suggests, which is exactly the kind of source `getent hosts` reveals and `dig` does not.

- A is wrong: The 127.0.0.53 stub serves clients that go through the glibc DNS path or a tool such as `dig`; the `resolve` nsswitch module reaches systemd-resolved over a separate IPC socket, so the stub is not the only route.
- B is wrong: `resolve` names a distinct nsswitch source served by systemd-resolved, not evidence that the files-versus-dns order has been reversed on the `hosts:` line.
- D is wrong: DHCP supplies addressing configuration such as nameserver addresses, not static name-to-address mappings; the answer's source here is systemd-resolved, reached through the `resolve` module.

### 36.

Is reversing the nsswitch `hosts:` line to `dns files`, so DNS is consulted before the local hosts file, a legal configuration?

- **A.** No — `files` must always precede `dns` on the `hosts:` line, since the order is fixed by the nsswitch specification and cannot be changed.
- **B.** Yes, the order is configurable, and reversing it to `dns files` is legal and changes which source wins when both have an entry for the same name.
- **C.** Yes, but only on systems that do not run systemd, since the reversed order is unsupported wherever systemd-resolved is present.
- **D.** No, changing the order requires editing `/etc/hosts` itself rather than `/etc/nsswitch.conf`, since that is where source order is actually configured.

**Answer: B.** Reversing the switch order to `dns files` is legal and changes which source wins for a name present in both; the conventional `files dns` value is a common default, not a fixed rule, so predicting the winning source always requires reading the actual `hosts:` line in force.

- A is wrong: The order on the `hosts:` line is configurable, not fixed; `files dns` is simply the conventional value, not an enforced requirement.
- C is wrong: Reversing the `hosts:` order is a general nsswitch configuration option, not one restricted by whether systemd-resolved happens to be running.
- D is wrong: Source order is configured on the `hosts:` line of `/etc/nsswitch.conf`, not inside `/etc/hosts`, which holds name-to-address mappings rather than resolution order.

### 37.

A "the network is down" report turns out to have raw IP addresses working perfectly while every name-based connection fails. Which service is implicated, and how does that differ from a DHCP failure?

- **A.** DHCP is implicated, since a report described broadly as "the network is down" traces back to an addressing failure before any other service is affected.
- **B.** ARP is implicated, since ARP is the step that maps a hostname onto the MAC address a frame has to carry before it can leave the host.
- **C.** NAT is implicated, since NAT rewrites the hostname carried inside each packet alongside the addresses in its headers.
- **D.** DNS is implicated: it translates names to addresses, and its failure signature is addresses working while names do not; DHCP failure instead shows up as no address at all, or a 169.254 link-local one.

**Answer: D.** A very large share of "the network is down" reports are DNS failures, with a distinct signature — raw IP addresses work while names do not — separate from DHCP failure, whose signature is no address at all or a 169.254 link-local self-assignment.

- A is wrong: A host with working raw IP connectivity already has a working address; the symptom described — names failing while addresses work — is specifically DNS, not DHCP.
- B is wrong: ARP resolves addresses to MAC addresses on the local segment only; a host with working raw IP connectivity to remote addresses has already succeeded past any ARP step involved.
- C is wrong: NAT rewrites addresses in transit and has no role in name resolution at all; a NAT failure would not selectively break names while leaving raw address connectivity intact.

### 38.

Three DNS query tools are available: `dig`, `nslookup` and `host`. A script needs the fewest lines of output to parse programmatically, while a full investigation needs every section and flag visible. Which tool suits each need?

- **A.** `host` gives the terse output the script wants; `dig` gives the full response detail (sections, flags, TTLs) that a full investigation needs.
- **B.** `nslookup` gives the terse script-friendly output, while `host` gives the full response detail a deep investigation requires, including section headers, flags and per-record TTLs.
- **C.** `dig` gives the terse script-friendly output by default, while `host` gives the full response detail with sections and flags.
- **D.** All three tools produce identical output by default, differing only in the command name used to invoke them.

**Answer: A.** `dig` is the detailed query tool showing sections, flags and TTLs; `nslookup` is the older interactive tool with moderate detail; `host` is the terse one, best suited to scripts that just need the answer without parsing extra structure.

- B is wrong: `nslookup` is the older interactive tool with moderate detail, not the terse option; `host` is the terse one, and `dig` is the tool with full response detail, not `host`.
- C is wrong: This reverses the actual defaults: `dig` prints the full response by default, and `host` is the terse tool, not the other way around.
- D is wrong: The three tools have genuinely different default verbosity and output formats; they are not interchangeable wrappers around identical output.

### 39.

A resolver is reachable and answers queries quickly, but every lookup for a particular internal zone returns NXDOMAIN. Is this a connectivity problem?

- **A.** Yes — any resolver returning an error response of any kind is, by definition, evidence that the resolver itself is unreachable or malfunctioning.
- **B.** No: a resolver being reachable does not mean it will answer for that zone; NXDOMAIN from a working resolver is a data problem, not a connectivity problem.
- **C.** No, but only because the internal zone in question must actually be hosted on a completely different port than the standard DNS port 53.
- **D.** Yes, and the fix is always to restart the resolver process, since a reachable resolver returning errors indicates its cache has become corrupted.

**Answer: B.** DNS assigns nothing and configures nothing; it only answers questions, so a reachable, functioning resolver returning NXDOMAIN is reporting a data problem — the name genuinely is not present in that zone as far as the resolver can determine — not a connectivity failure.

- A is wrong: NXDOMAIN is a valid, well-formed answer from a functioning, reachable resolver stating the name does not exist; it is not evidence of unreachability or malfunction.
- C is wrong: DNS conventionally uses port 53 regardless of which zone is being queried; nothing about an internal zone implies a nonstandard port is involved here.
- D is wrong: A cache is not implicated by an NXDOMAIN answer for a name that genuinely does not exist in the zone; restarting the resolver addresses a different class of problem entirely.

### 40.

Over which transport protocol, and on which port, does DNS operate?

- **A.** UDP only, on port 53, since DNS was designed without ever needing a reliable, ordered transport for any of its operations.
- **B.** Both UDP and TCP, on port 53. Ordinary queries usually travel over UDP, while TCP is used when a response is too large for UDP or for zone transfers.
- **C.** TCP only, on port 53, since name resolution is treated as requiring the same connection-oriented reliability guarantees a file transfer needs, so UDP was never assigned a DNS port.
- **D.** Both UDP and TCP, but on two different port numbers, 53 for UDP and 853 for TCP, matching the split used by DNS over TLS.

**Answer: B.** DNS queries usually travel over UDP port 53 for speed; TCP port 53 is used when a response is too large for the UDP path or for zone transfers — both transports share the same port number.

- A is wrong: TCP port 53 is used when a response is too large for UDP, or for zone transfers, so DNS is not UDP-only despite UDP handling the common case.
- C is wrong: Ordinary DNS queries travel over UDP for speed and low overhead; TCP is the exception for large responses and zone transfers, not the default transport.
- D is wrong: Both UDP and TCP DNS use the same port, 53; port 853 is instead associated with DNS over TLS, an unrelated, separately encrypted protocol.

### 41.

A migration test needs one specific hostname to resolve to a new server on a single test machine, without touching DNS or affecting any other host. An engineer edits `/etc/resolv.conf` to add a line for the new server. Was that the right file?

- **A.** No. `/etc/hosts` holds name-to-address mappings directly and takes effect immediately with no restart; `/etc/resolv.conf` only lists which nameservers to ask and contains no name-to-address data at all.
- **B.** Yes — `/etc/resolv.conf` is where individual name-to-address overrides belong, since it is the file most commonly edited by hand for testing purposes.
- **C.** No, but only because the correct approach is instead to lower the target record's TTL and wait for the change to propagate through DNS.
- **D.** No, but only because the correct fix is to add a static ARP entry binding the hostname to the new server's MAC address.

**Answer: A.** `/etc/hosts` is the fastest way to override name resolution on one host — for testing a migration before changing DNS — and because the file is read on each lookup, changes take effect immediately with no restart, unlike `/etc/resolv.conf`, which only names servers to ask and holds no name data of its own.

- B is wrong: `/etc/resolv.conf` lists nameservers to query and search domains; it has no syntax for mapping a specific name to a specific address, which is `/etc/hosts`'s job.
- C is wrong: Lowering a TTL is preparation for a DNS change everywhere, not a way to test on a single machine without touching DNS at all, which is what the scenario specifically asks for.
- D is wrong: ARP resolves IP addresses to MAC addresses on the local segment; it has no mechanism for resolving a hostname at all, which is a completely different layer of the problem.

### 42.

An engineer wants `/etc/hosts` to alias `web01.example.com` and also create an MX record pointing mail at a different host. Which of these can `/etc/hosts` actually express?

- **A.** Both — `/etc/hosts` supports the full range of DNS record types, including MX, provided each entry is written on its own line.
- **B.** Neither — `/etc/hosts` can only be used for the special name `localhost` and cannot hold any custom name-to-address mapping at all.
- **C.** Only the MX-style mail routing entry — `/etc/hosts` was designed specifically for mail routing, and general name-to-address mapping was only added to its line format much later, during the BSD era.
- **D.** Only the name-to-address alias; `/etc/hosts` can map a name (and aliases) to an address, but it has no record types at all and cannot express an MX record or anything beyond a literal mapping.

**Answer: D.** `/etc/hosts` lines contain an address, a canonical hostname, and optional aliases, and nothing else — it has no wildcards, no record types, and no TTL, so it can only ever map a literal name to a literal address, never an MX record or anything else DNS can express.

- A is wrong: `/etc/hosts` has no record-type syntax whatsoever; every line is a plain address-to-name mapping, with no way to express an MX record or any other typed record.
- B is wrong: Every system ships a `127.0.0.1 localhost` entry, but `/etc/hosts` is fully capable of holding arbitrary additional custom mappings beyond that default line.
- C is wrong: `/etc/hosts` predates DNS as a general name-to-address table; it was never designed around mail routing specifically, and it has no MX-record capability at all.

### 43.

A departing contractor left a line in `/etc/hosts` on a production server pointing an internal hostname at a decommissioned test box. How long will this override persist, and who is affected?

- **A.** It persists until the entry's TTL expires, after which it is automatically removed the same way a DNS record's cache entry would be.
- **B.** It affects every host on the network that queries this server for DNS, since `/etc/hosts` entries are automatically propagated out to the other resolvers by the local name service switch.
- **C.** It persists only until the next reboot, at which point the operating system automatically resets `/etc/hosts` to its default contents.
- **D.** Because an override in `/etc/hosts` is per host, it persists indefinitely until someone edits the file and affects only this one host, changing nothing for anyone else on the network.

**Answer: D.** It is per host: an override added on one server changes nothing for anyone else, so a stale `/etc/hosts` entry is a testing tool, not a deployment mechanism, and it persists indefinitely — with no TTL or automatic reset — until someone edits it away.

- A is wrong: `/etc/hosts` has no TTL concept at all; unlike a cached DNS answer, an entry here has no expiry and remains until someone edits the file by hand.
- B is wrong: `/etc/hosts` is strictly local to the host that holds it; nothing propagates its entries to other hosts or resolvers on the network.
- C is wrong: The operating system does not automatically reset `/etc/hosts` on reboot; a hand-edited entry survives across reboots exactly like any other line in the file.

### 44.

Every system ships a default entry in `/etc/hosts` mapping `127.0.0.1` to a name. What is that name, and what is the IPv6-aware equivalent line?

- **A.** `127.0.0.1 gateway`, since the loopback address is conventionally named after the default route it represents on a fresh installation.
- **B.** `0.0.0.0 localhost`, since the wildcard bind address is what every system maps to the name `localhost` by default.
- **C.** The loopback address mapped to the conventional name for the local host: `127.0.0.1 localhost`, and on IPv6-aware systems also `::1 localhost`.
- **D.** `127.0.0.1 hostname`, where `hostname` is a literal keyword rather than the actual configured hostname of the machine.

**Answer: C.** Every system ships with `127.0.0.1 localhost` and, on IPv6-aware systems, `::1 localhost`, giving the conventional loopback name a mapping on both address families by default.

- A is wrong: `localhost`, not `gateway`, is the conventional name for the loopback address; a gateway is an entirely separate concept referring to the route off the local subnet.
- B is wrong: `127.0.0.1`, not `0.0.0.0`, is the loopback address mapped to `localhost`; `0.0.0.0` is a wildcard bind address, a different concept entirely.
- D is wrong: The default entry uses the literal name `localhost`, not a placeholder keyword called `hostname`; the machine's actual hostname is a separate, distinct name.

### 45.

An administrator hand-edits `/etc/resolv.conf` to fix a wrong nameserver, and the fix works — until the next DHCP lease renewal silently reverts it. What went wrong, and where does the durable fix belong?

- **A.** The hand edit failed because `/etc/resolv.conf` is read-only by design and never actually accepted the change in the first place.
- **B.** The DHCP lease renewal reverted the change because `/etc/resolv.conf` entries are considered part of the IP address lease itself and expire along with the address when the lease is renewed.
- **C.** The durable fix belongs in `/etc/hosts` instead, since that is the file that persists correctly across DHCP renewals on a modern system.
- **D.** On a modern system the file is commonly generated by NetworkManager, a DHCP client, or systemd-resolved, so a hand edit is overwritten at the next renewal; the durable change belongs in that generating tool's configuration.

**Answer: D.** On modern systems the file is generated — by NetworkManager, a DHCP client, or as a symlink into systemd-resolved's runtime directory — so a hand edit to a generated file is overwritten at the next lease renewal, reboot or network reconfiguration; the durable change belongs in that tool's own configuration.

- A is wrong: The scenario states the fix worked initially, so the file was writable and the edit took effect; it was later overwritten by regeneration, not rejected outright.
- B is wrong: The nameserver lines are regenerated by whichever tool manages the file, not because they are literally part of the address lease; the mechanism is regeneration, not lease expiry of the file's content.
- C is wrong: `/etc/hosts` holds name-to-address mappings, not nameserver addresses; it has no bearing on which nameservers are queried, which is what `/etc/resolv.conf` governs.

### 46.

An `/etc/resolv.conf` lists five `nameserver` lines, hoping for extra resilience. How many will actually be used?

- **A.** Up to MAXNS, currently 3; further lines beyond the third are simply ignored, so listing five does not add any resilience.
- **B.** All five will be queried in parallel on every lookup, since the resolver is designed to race every listed nameserver simultaneously for speed.
- **C.** Only the first one will ever be used, with the remaining four serving no purpose at all under any circumstances.
- **D.** All five will be used, but only in round-robin fashion across successive independent DNS queries rather than in a fixed priority order.

**Answer: A.** `nameserver` lines list the resolvers to query in order, but up to MAXNS (currently 3) are used and further lines are ignored, so listing more than three nameservers does not add resilience — entries beyond the cap are simply never consulted.

- B is wrong: The resolver does not race every listed nameserver in parallel; it uses up to MAXNS (3) in order, and lines beyond that cap are ignored entirely.
- C is wrong: Up to three nameserver lines are used, not just one; the resolver falls back to subsequent listed servers, up to the MAXNS limit, if the first is unavailable.
- D is wrong: Only up to MAXNS (3) nameserver lines are used at all; the remaining two beyond that cap are never consulted, round-robin or otherwise.

### 47.

A host running systemd-resolved shows only `nameserver 127.0.0.53` in `/etc/resolv.conf`. A junior admin flags this as broken, since it points at the host itself rather than a real upstream server. Is that the right read?

- **A.** Yes — a `nameserver` line pointing at any address on 127.0.0.0/8 always indicates a broken or incomplete DNS configuration.
- **B.** Yes, but only because a correctly configured host must list at least two nameserver lines rather than a single stub address.
- **C.** No, but only because the file must actually be a symlink into `/etc/hosts` rather than a genuine `/etc/resolv.conf` file at all, as is required wherever a stub listener is in use.
- **D.** No, this is normal on a systemd-resolved system, where the file names the local stub resolver at 127.0.0.53 rather than the actual upstream nameserver directly.

**Answer: D.** On modern systems the file is often a symlink into systemd-resolved's runtime directory, in which case it names the local stub, commonly 127.0.0.53, rather than any real upstream server — seeing only that address is normal and does not indicate misconfiguration.

- A is wrong: 127.0.0.53 specifically is the conventional systemd-resolved stub address and is an expected, working configuration, not evidence of a broken setup.
- B is wrong: A single `nameserver` line is a valid, complete configuration when it points to a working resolver, stub or otherwise; the count of lines alone does not determine correctness.
- C is wrong: On a systemd-resolved system the file is typically a symlink into systemd-resolved's own runtime directory, not into `/etc/hosts`, which serves a completely different purpose.

### 48.

What does the `search` directive in `/etc/resolv.conf` do, and how does `options ndots:N` interact with it?

- **A.** `search` lists which record types may be queried, while `ndots` sets the maximum number of nameservers the resolver may contact per query.
- **B.** `search` supplies domain suffixes appended to unqualified names; `options ndots:N` controls how many dots a name must already contain before it is tried as absolute rather than run through the search list first.
- **C.** `search` sets the TTL used for cached negative answers, while `ndots` sets the TTL used for cached positive answers.
- **D.** `search` lists nameservers to fall back to if the primary one in `nameserver` fails, while `ndots` counts how many of those fallbacks may be used.

**Answer: B.** `search <domain> ...` supplies suffixes appended to names that are not fully qualified, and `options ndots:N` controls how many dots a name must contain before it is tried as absolute rather than being run through the search list first — together they determine what an unqualified name actually resolves to.

- A is wrong: Neither directive does this; `search` supplies domain suffixes for unqualified names, and `ndots` governs whether the search list is applied, not record types or nameserver counts.
- C is wrong: TTL values come from the DNS records themselves and the zone's SOA parameters, not from `search` or `ndots`, which govern suffix-appending behaviour instead.
- D is wrong: Fallback nameservers are listed with additional `nameserver` lines up to MAXNS, not with `search`, which is unrelated and governs suffix appending for unqualified names.

### 49.

A service is confirmed running and correctly bound to 0.0.0.0, yet remote clients get connection refused instantly, while another service on a different host times out with no response at all. What does the difference between these two symptoms suggest about the cause?

- **A.** Both symptoms indicate exactly the same underlying cause, since DROP and REJECT firewall policies are defined to always produce identical client-side behaviour.
- **B.** The instant refusal proves no firewall is involved at all, since any device applying a firewall policy is defined to always produce a silent timeout rather than a refusal.
- **C.** The instant refusal suggests a REJECT-style response — something on the path answered; the silent timeout suggests a DROP-style policy — the packet vanished, which is the more classic 'firewall is blocking this' signature.
- **D.** The timeout proves the destination host is completely powered off, since only a powered-off host is capable of producing a connection attempt that never receives any answer.

**Answer: C.** A firewall that drops traffic and one that rejects it produce different symptoms: DROP gives the client a timeout, REJECT gives an immediate refusal — that difference is diagnostic and worth more than the rule text itself, and is the reason to look first at policy versus reachability differently for the two symptoms described.

- A is wrong: DROP and REJECT are deliberately different behaviours precisely so the client-side symptom differs: one is silent, producing a timeout, and the other answers, producing an instant refusal.
- B is wrong: A firewall configured to REJECT rather than DROP produces an immediate refusal too, so an instant refusal does not by itself prove no firewall is involved on the path.
- D is wrong: A silent timeout is also produced by a DROP firewall policy on a fully powered-on, reachable host; it does not by itself prove the destination is powered off.

### 50.

A host with no inbound firewall rules configured at all can still browse the web without issue. A colleague argues this proves the firewall is not actually protecting anything. Is that the right conclusion?

- **A.** Yes — the ability to browse the web with no inbound rules proves the firewall is entirely inactive and providing no protection against inbound connections at all, since a firewall that permits any traffic in either direction has no default-deny policy left to apply.
- **B.** Yes, but only because web browsing specifically bypasses firewall inspection entirely as a documented protocol-level exception unique to HTTP and HTTPS.
- **C.** No, but only because NAT, not the firewall, is what is actually permitting the return web traffic to reach the browsing host in this scenario.
- **D.** No — a stateful firewall tracks connections, so a rule permitting outbound traffic implicitly permits the replies, which is exactly why a host with no inbound allows can still browse the web while remaining protected from unsolicited inbound connections.

**Answer: D.** A stateful firewall tracks connections, so a rule permitting outbound traffic implicitly permits the replies, which is why a host with no inbound allows can still browse the web — this is the standard default-deny-inbound posture working as intended, not evidence that no protection exists. `ufw status` and `firewall-cmd --list-all` are the commands that show this policy on Debian-family and Red Hat-family systems respectively.

- A is wrong: Browsing the web working is expected stateful behaviour, not evidence the firewall is inactive; an unsolicited inbound connection attempt, unlike a reply to outbound traffic, would still be blocked by default-deny.
- B is wrong: Web traffic is not specially exempted from firewall inspection; the reason it works is ordinary stateful tracking of outbound-initiated connections, applicable to any protocol, not an HTTP-specific bypass.
- C is wrong: NAT rewrites addresses and is commonly co-located with a firewall, but the mechanism permitting the reply traffic here specifically is stateful firewall inspection, not NAT's address translation itself.

### 51.

A restrictive network firewall sits in front of a host whose own local firewall is configured permissively, allowing everything. What is the effective policy actually governing traffic to that host?

- **A.** The host's own permissive policy fully governs traffic, since a local firewall is defined to always take precedence over any upstream network firewall's rules.
- **B.** The intersection of both — a host firewall protects only that host, so a permissive host firewall behind a restrictive network firewall means the effective policy is whatever the network firewall still allows through, regardless of the host's own permissiveness.
- **C.** The network firewall's policy is irrelevant once traffic reaches the local network segment, leaving the host's own permissive rules as the sole effective policy from that point onward.
- **D.** Neither firewall's policy applies at all, since having two separate firewalls active on the same path is defined to disable both of them automatically.

**Answer: B.** A host firewall protects only that host, so a permissive host firewall behind a restrictive network firewall — or the reverse — means the effective policy is the intersection of both, since traffic must pass whichever firewall is more restrictive at each point on the path.

- A is wrong: A host firewall does not override an upstream network firewall; traffic must pass both, so the network firewall's restrictions still apply regardless of the host's own permissive local policy.
- C is wrong: The network firewall governs traffic before it even reaches the host's segment; it remains fully relevant and combines with, rather than being superseded by, the host's own local policy.
- D is wrong: Two firewalls on the same path do not disable each other; each continues to filter independently, and the combined, effective result is their intersection.

### 52.

Is a NAT router with no filtering rules configured applying any security policy to the traffic it forwards?

- **A.** Yes — NAT itself is defined to apply a default-deny inbound policy automatically as an inherent part of the address-rewriting process it performs.
- **B.** Yes, but only for outbound traffic, since NAT is defined to inspect and filter every outbound packet's payload before permitting it to be translated and forwarded.
- **C.** No, but only because every NAT router is required to have at least one firewall rule configured by default before it is allowed to forward any traffic at all.
- **D.** No. NAT is not filtering; a NAT router with no rules applies no policy at all, even though it rewrites addresses as traffic crosses it.

**Answer: D.** NAT is not filtering: a NAT router with no rules applies no policy at all, even though its address-rewriting side effect can make unsolicited inbound traffic appear blocked, which is a fundamentally different mechanism from a firewall's deliberate policy decisions.

- A is wrong: NAT's apparent inbound-blocking behaviour is a side effect of having no translation mapping for unsolicited traffic, not a deliberately applied filtering policy; a NAT router with no rules applies no policy at all.
- B is wrong: NAT does not inspect payload content for either direction; it only rewrites addresses and ports and forwards accordingly, applying no content-based policy to outbound traffic either.
- C is wrong: A NAT router is not required to have any filtering rule configured to function; it can forward and translate traffic perfectly well with zero rules present, applying no policy at all.

### 53.

A TLS certificate must be issued for a server, and the certificate authority requires an unambiguous, absolute name rather than whatever short label the host happens to answer to locally. Which kind of name is required, and why does it matter here specifically?

- **A.** A bare hostname is sufficient, since certificate authorities are defined to resolve any short label the same way regardless of where the request originates.
- **B.** A fully qualified domain name is required, because it locates the host absolutely within the DNS hierarchy, unlike a bare hostname, which is only meaningful relative to a search domain that varies by context.
- **C.** Either name works identically for this purpose, since `hostname -f` and a plain hostname always resolve to the exact same value on every system.
- **D.** The transient hostname set by DHCP is required, since it is the only name type systemd considers valid for external services such as certificate issuance.

**Answer: B.** A hostname is only meaningful relative to a search domain, so the same short label can succeed on one host and fail on another; an FQDN locates the host absolutely within the DNS hierarchy, which is exactly why configuration that must work everywhere — TLS certificates, mail routing, cluster membership — uses FQDNs.

- A is wrong: A bare hostname is only meaningful relative to a local search domain; a certificate authority has no such local context, which is exactly why an FQDN is required.
- C is wrong: `hostname -f` resolves a qualified name that can differ from the plain hostname depending on `/etc/hosts` or DNS; the two are not guaranteed to be identical.
- D is wrong: The transient hostname is a runtime label, not a DNS-hierarchy name; it is unrelated to whether a name is fully qualified, which is what certificate issuance actually requires.

### 54.

`hostname -f` fails on a host that clearly has a hostname configured, since `hostname` alone prints a value. What does the failure actually mean?

- **A.** It means the hostname configuration has been wiped and must be reconfigured from scratch using `hostnamectl set-hostname`.
- **B.** It means the host is not running systemd, since `hostname -f` is a systemd-only flag unavailable on non-systemd distributions.
- **C.** It means DHCP failed to issue an address to this host, since `hostname -f` is defined to depend on a successful DHCP lease being present across virtually every environment of this kind.
- **D.** It means nothing resolves the short name to a qualified one (usually a missing `/etc/hosts` line), not that the hostname itself is unset.

**Answer: D.** `hostname -f` asks for the FQDN, which is resolved rather than merely read, and therefore depends on `/etc/hosts` or DNS returning a qualified name; its failure means nothing resolves the short name to a qualified one, usually a missing hosts entry, not that the hostname is unset.

- A is wrong: A plain `hostname` succeeding proves the hostname configuration exists; the `-f` failure is about resolving a qualified form, not about the base configuration being missing.
- B is wrong: `hostname -f` is a flag of the `hostname` command itself, not a systemd-specific feature; `hostnamectl` is the systemd-specific tool, and its absence is a different matter entirely.
- C is wrong: `hostname -f` depends on name resolution, not on DHCP addressing; a host can have a perfectly good DHCP-issued address while `hostname -f` still fails to resolve a qualified name.

### 55.

On a systemd system, `hostnamectl` distinguishes a static, a transient and a pretty hostname. What is the difference between the static and the transient one?

- **A.** The static hostname is persisted in `/etc/hostname` and survives reboots; the transient one is a runtime value, typically from a DHCP lease, and is used only when no static hostname is set.
- **B.** The static hostname is set by DHCP on every boot, while the transient hostname is the one an administrator writes permanently to `/etc/hostname`, a pattern that holds across most deployments encountered.
- **C.** The static hostname is a free-form, human-readable label, while the transient hostname is the strict, machine-parsable form used in DNS lookups.
- **D.** The static hostname only applies to IPv4-configured hosts, while the transient hostname only applies to hosts configured for IPv6.

**Answer: A.** `hostnamectl` distinguishes the static hostname, persisted in `/etc/hostname`, from the transient one, set by the kernel and possibly by DHCP, and from the pretty one, a free-form label — three genuinely different sources of the same general concept.

- B is wrong: This reverses the actual roles: the static hostname is the one persisted in `/etc/hostname`, and the transient one is what the kernel or DHCP may set at runtime.
- C is wrong: The free-form, human-readable label is the pretty hostname, a third distinct category from either the static or the transient one described here.
- D is wrong: Neither the static nor the transient hostname is tied to a specific IP address family; the distinction is about persistence and source, not about IPv4 versus IPv6.

### 56.

A name written as `web01.lab` has a dot in it. Does that dot alone make it an FQDN?

- **A.** Yes — the presence of any dot in a name is what defines it as fully qualified, regardless of what follows the dot.
- **B.** No, but only because a trailing dot at the very end of the whole name is required in addition to the one already present after `web01`.
- **C.** Yes, but only when the name is used inside `/etc/hosts` rather than in a DNS query, since `/etc/hosts` treats any dotted name as fully qualified.
- **D.** No: a name with a dot is not automatically fully qualified; `web01.lab` is qualified only if `lab` is a real domain in the hierarchy being queried.

**Answer: D.** A name with a dot in it is not automatically an FQDN — `web01.lab` is qualified only if `lab` is a real domain in the hierarchy you are querying, and because the resolver appends search domains to unqualified names, a successful `ping web01` proves nothing portable about the name.

- A is wrong: A dot alone is not sufficient; the suffix after the dot must correspond to a real domain in the hierarchy being queried for the name to actually be fully qualified.
- B is wrong: A trailing dot representing the root zone is strict DNS notation for a fully qualified name, but the core issue here is whether `lab` is a genuine domain, not merely whether a trailing dot is present.
- C is wrong: `/etc/hosts` does not redefine what counts as fully qualified; qualification depends on the DNS hierarchy, not on which file or mechanism happens to be resolving the name.

### 57.

A request to an internal API returns HTTP 502. A junior engineer treats this as the API server itself reporting an error. Is that the right way to read a 502?

- **A.** No: 502 is a gateway or proxy reporting a bad or missing answer from the server behind it, not the origin server answering for itself; the investigation should look at the proxy and what lies behind it.
- **B.** Yes — any 5xx status code is generated exclusively by the origin application server itself, regardless of whether a proxy or load balancer sits in front of it, because an intermediary is required to pass an upstream status code through untouched.
- **C.** No, but only because 502 actually indicates a client-side error, the same category of problem a 4xx status code represents, mislabeled under the 5xx range.
- **D.** Yes, and the fix is always to clear the client's browser cache, since 502 responses are commonly caused by stale cached content on the requesting side.

**Answer: A.** The status code is the fastest classifier available: 2xx succeeded, 3xx redirected, 4xx blamed the client, 5xx blamed the server — and specifically, 502 and 504 are by definition a gateway or proxy reporting a bad or missing answer from the server behind it, not that server answering for itself.

- B is wrong: 502 specifically originates from a gateway or proxy reporting trouble with the server behind it; the origin application server did not necessarily generate this particular response at all.
- C is wrong: 502 falls squarely in the 5xx range, meaning the server side is blamed, not the client; it is not a mislabeled 4xx-style client error.
- D is wrong: A 502 is generated by a gateway reporting a problem with an upstream server; clearing a client-side cache addresses a different class of issue entirely and would not resolve this.

### 58.

`curl -I https://example.com` is run to confirm a site responds, and it returns `301` with no body shown. A colleague reports the site is down. Is that conclusion supported?

- **A.** Yes — any status code other than exactly 200 returned by `curl -I` is defined to indicate the site is unreachable or malfunctioning.
- **B.** No, but only because `curl -I` is fundamentally the wrong tool to use here, and `wget` would have returned a success status instead for the identical request.
- **C.** No — 301 is a redirect, not a failure; without `-L`, `curl` stops there by design, and the site is answering exactly as configured.
- **D.** Yes, since a HEAD request, which `curl -I` issues, is defined to always fail with a 301 status regardless of how the server is actually configured.

**Answer: C.** `curl -I` issues a HEAD request and reports the status line the server returns; reading a 301 as a failure is a documented trap, since it is a redirect and, without `-L`, curl stops there by design rather than following it.

- A is wrong: A 3xx status is a normal, successful classification of response, a redirect, not evidence of unreachability; only certain other ranges, like 5xx, indicate a server-side problem.
- B is wrong: `wget` against the same URL would show the same redirect behaviour; the issue is not tool choice but correctly interpreting a 3xx status as a redirect rather than a failure.
- D is wrong: A HEAD request does not inherently produce a 301; the server's own redirect configuration is what causes this particular status, and many HEAD requests return 200 without issue.

### 59.

A site returns HTTP 200 for a request, but the page shown is an internal error message rather than the expected content. An automated monitor reports the site as healthy based on the status code alone. What is being missed?

- **A.** Nothing is being missed — a 200 status code is defined to guarantee the response body is correct and matches what the client expected to receive.
- **B.** The monitor is missing the TLS certificate check, since an expired certificate would be the only explanation for an error page appearing under a 200 status, because a client presents a certificate failure as a 200 response carrying an error body.
- **C.** A 200 response proves the server answered, not that the answer is correct — an error page returned with status 200 is a common misconfiguration that status-code-only monitoring misses entirely.
- **D.** The monitor is missing the DNS TTL, since a low TTL is what causes a server to occasionally return its internal error page instead of the real content.

**Answer: C.** A 200 response proves the server answered, not that the answer is correct — an error page returned with status 200 is a common misconfiguration that automated checks relying on the status code alone will miss, since nothing about a successful HTTP transaction guarantees the content is right.

- A is wrong: A 200 status guarantees only that the server successfully processed and returned a response; it says nothing about whether the body content is the intended, correct content.
- B is wrong: A TLS certificate problem would typically prevent the connection from completing at all, or trigger a browser warning outside the HTTP response; it does not explain a 200-status page showing internal error content.
- D is wrong: DNS TTL governs how long a resolved address is cached; it has no bearing on whether the server's application logic returns an error page under a 200 status.

### 60.

Does HTTPS hide which host a client is talking to, given that the request and response bodies are encrypted?

- **A.** No — the destination IP address is visible by definition, and the server name is normally sent in the clear in the TLS SNI extension, so HTTPS encrypts content but not the fact of which host is being contacted.
- **B.** Yes — HTTPS encrypts every part of the exchange, including the destination IP address and any server name information sent during connection setup, because the TLS handshake completes before any addressing or naming information is placed on the wire.
- **C.** No, but only because HTTPS hides the destination IP address specifically while leaving the server name fully visible in every case.
- **D.** Yes, but only for connections using TLS 1.3, since earlier TLS versions leave both the destination address and server name fully exposed.

**Answer: A.** HTTPS encrypts the request and response, but it does not hide which host is being talked to: the destination IP is visible by definition, and the server name is normally sent in the clear in the TLS SNI extension.

- B is wrong: The destination IP address is necessarily visible for routing to work at all, and the server name is normally sent in the clear in the TLS SNI extension; neither is hidden by HTTPS.
- C is wrong: The destination IP address is inherently visible for routing, not specifically hidden by HTTPS; it is the server name, via SNI, that is normally visible in the clear, not concealed either.
- D is wrong: The visibility of the destination address is a routing necessity independent of TLS version, and SNI is commonly sent in the clear across TLS versions in ordinary configurations.

### 61.

A script written years ago runs `ifconfig` on a freshly provisioned server and fails with "command not found." The engineer assumes the network stack is broken. Is that the right read?

- **A.** Yes — a missing `ifconfig` command is defined to always indicate a corrupted or incomplete networking installation requiring a full reinstall.
- **B.** No, but only because the script must be run with `sudo` first, since `ifconfig` specifically requires elevated privilege just to be found by the shell at all, regardless of which distribution or vendor is involved.
- **C.** Yes, but only because the correct fix is to install net-tools first and then continue relying on `ifconfig` rather than migrating the script to `ip`.
- **D.** No — `ifconfig` comes from the legacy net-tools package, which many current distributions no longer install; the network stack is fine, and `ip` from iproute2 is the supported replacement the script should use.

**Answer: D.** The exam asks which command to use, and the honest answer is `ip` for everything, with `ifconfig` recognised only so that legacy documentation remains readable — reaching for `ifconfig` on a modern system frequently produces "command not found," which is deprecation, not a broken system.

- A is wrong: `ifconfig`'s absence reflects a deliberate packaging choice on many current distributions, not corruption; the fully functional `ip` command remains available for every task `ifconfig` used to perform.
- B is wrong: Privilege level does not affect whether a shell can locate a command at all; `ifconfig` is simply not installed on many current distributions, unrelated to sudo.
- C is wrong: Installing net-tools would technically restore `ifconfig`, but the exam-relevant, forward-looking answer is that `ip` is the current, supported tool the script should be migrated to.

### 62.

An administrator runs `ip link show enp0s3` looking for the interface's IP address and finds none in the output. Was the command wrong for the question being asked?

- **A.** No — `ip link show` is defined to always include both the MAC address and every configured IP address for the named interface in its output.
- **B.** No, but only because the interface must not actually have any IP address configured at all, which is why nothing appeared in the `ip link` output, since `ip link` falls back to printing addresses only when at least one is actually configured on the interface.
- **C.** Yes — `ip link` reports link state and the MAC address only; `ip addr` is the object to use for a layer 3 IP address, since `ip` is object-first and each object answers a different question about the same interface.
- **D.** Yes, but only because `enp0s3` was misspelled, and the command would have shown IP addresses correctly under the right interface name.

**Answer: C.** The `ip` command is divided into objects: `ip addr` for layer 3 addresses, `ip link` for layer 2 interface state and hardware addresses, `ip route` for the routing table — using `ip link` to look for IP addresses is a documented common mistake, since it reports link state and MAC only.

- A is wrong: `ip link` reports layer 2 state only; it does not include IP addresses in its output at all, regardless of how many are configured on the interface.
- B is wrong: Even a fully configured interface with several IP addresses would show none of them under `ip link`, since that object never reports layer 3 information regardless of configuration.
- D is wrong: Even with the exact correct interface name, `ip link` would still show no IP address information, since that data belongs to the separate `ip addr` object entirely.

### 63.

An address added with `ip addr add 192.0.2.20/24 dev enp0s3` does not appear when the same interface is inspected with `ifconfig`. Is one of the two tools reporting incorrectly?

- **A.** Yes — `ifconfig` and `ip addr` are defined to always report identical results for any interface, so a discrepancy here proves one of the two tools is malfunctioning or reading a stale cache.
- **B.** Not necessarily — `ifconfig` predates the model in which one interface holds many addresses, so an address added this way may not show under it unless created as a labelled alias, which is why the two tools can disagree about the same interface.
- **C.** Yes, but only because the address was never actually applied by `ip addr add` in the first place, despite the command completing without any error.
- **D.** No, but only because the address must have already been lost at reboot before `ifconfig` was ever run to check for it in this scenario.

**Answer: B.** `ifconfig` predates the model in which one interface holds many addresses, so addresses added with `ip addr add` may not be shown by it unless they were created as labelled aliases — which is exactly why two tools can disagree about the same interface without either one being simply wrong.

- A is wrong: The two tools are not guaranteed to report identically; `ifconfig`'s older addressing model is a documented reason they can legitimately differ without either being broken.
- C is wrong: `ip addr add` completing without error does apply the address to the running kernel state; the discrepancy is explained by `ifconfig`'s different addressing model, not by the command silently failing.
- D is wrong: The scenario does not describe a reboot occurring; the two tools disagreeing about a still-present, runtime-added address is explained by their different addressing models, not by the address having already vanished.

### 64.

Does either `ip` or `ifconfig` persist a change made with it across a reboot?

- **A.** Neither does, because both change only the running kernel state; permanence belongs to NetworkManager, Netplan or systemd-networkd instead of either command.
- **B.** Only `ip` persists changes automatically across a reboot; `ifconfig` is limited to affecting the running kernel state alone.
- **C.** Only `ifconfig` persists changes automatically across a reboot, since it predates `ip` and was originally designed with permanent configuration in mind.
- **D.** Both persist changes automatically, since any command that successfully modifies a live network interface is defined to also update the on-disk configuration.

**Answer: A.** Neither command persists anything: both `ip` and `ifconfig` change the running kernel state only, and permanence belongs to NetworkManager, Netplan or systemd-networkd — a distinction that explains why a runtime change made with either tool disappears after a reboot or reconfiguration.

- B is wrong: Neither tool persists changes; `ip` behaves identically to `ifconfig` in this respect, both affecting only the running kernel state without writing anything to disk.
- C is wrong: `ifconfig`, despite predating `ip`, does not persist changes either; both tools are limited to the running kernel state, with permanence handled by a separate configuration layer.
- D is wrong: Successfully modifying a live interface does not imply an on-disk configuration update; neither `ip` nor `ifconfig` writes to disk, which is exactly why a permanent change requires the network manager instead.

### 65.

An address begins with the octet 200. Using the classful ranges, which class does it fall in, and what does that tell you about its mask under modern routing?

- **A.** Class B — the first octet 200 was read as falling in the 128-191 range that defines class B.
- **B.** Class C, identified by the first octet range 192-223. Under modern classless routing, though, its real mask could be anything and is not implied by the class at all.
- **C.** Class C, and because it is class C its real-world mask must also be exactly /24, matching the historical default, regardless of which distribution or vendor is involved.
- **D.** Class D — the first octet 200 was read as falling in the 224-239 multicast range reserved for class D.

**Answer: B.** The first octet 200 falls within 192-223, the class C range, but classful addressing was superseded by CIDR in 1993: knowing the historical class does not tell you the address's actual mask under modern classless routing, which must be stated explicitly.

- A is wrong: 200 is above 191, placing it in the class C range (192-223), not the class B range (128-191).
- C is wrong: Modern routing is classless, so an address's class does not imply its actual mask in practice; a 200.x.x.x address may well be a /26 or any other prefix.
- D is wrong: 224-239 defines class D; 200 falls below that range, in the class C range (192-223) instead.

### 66.

A colleague calls a /26 network 'a class C network' and insists the two terms mean exactly the same thing. What is the actual relationship between IPv4 address classes and CIDR?

- **A.** They are exactly the same thing; "class C" is simply an older, informal name that continues to refer to whatever prefix length a network happens to use today, whatever that length is as commonly understood by less experienced staff.
- **B.** CIDR is simply class D renamed for modern use, since both are commonly described as more flexible successors to the original class A, B and C scheme.
- **C.** Classful addressing fixed three network sizes (/8, /16, /24) inferred from the address itself; CIDR allows any prefix from /0 to /32 stated explicitly, so a /26 is not a class C network; a class C network was specifically /24.
- **D.** The two terms are assumed to differ only in that "class C" refers to IPv6 addressing specifically, while CIDR refers exclusively to IPv4 addressing instead.

**Answer: C.** Classful addressing offered exactly three fixed sizes inferred from the address's leading bits — /8, /16, /24 — while CIDR allows any explicitly stated prefix length; a /26 was never a classful size, so calling it "a class C network" conflates two different addressing schemes.

- A is wrong: A class C network specifically meant a /24 under the old fixed-size scheme; CIDR prefixes such as /26 are a different, classless concept the vocabulary was never meant to describe.
- B is wrong: Class D specifically names the 224-239 multicast range under the classful scheme; CIDR is an entirely separate, classless addressing mechanism unrelated to multicast.
- D is wrong: Both classful addressing and CIDR are IPv4 concepts; neither one has any special relationship to IPv6, which uses its own separate addressing architecture.

### 67.

What does class D identify in the classful addressing scheme, and what is the common misreading of it?

- **A.** Class D is reserved for broadcast traffic, delivering to every host on a segment regardless of subscription.
- **B.** Class D is reserved exclusively for the loopback range, 127.0.0.0/8, set aside from the rest of class A.
- **C.** Class D, the 224-239 range, is reserved for multicast, one-to-many delivery to subscribed group members; it is commonly, and wrongly, read as "broadcast."
- **D.** Class D is reserved for RFC 1918 private addressing, distinct from the public ranges assigned to classes A, B and C, a belief that persists because it sounds intuitive.

**Answer: C.** Class D, first octet 224-239, is reserved for multicast — one-to-many delivery to a subscribed group — which is commonly and incorrectly described as "broadcast," a different delivery model entirely.

- A is wrong: Class D is multicast, not broadcast; broadcast delivery to every host on a segment is a different, unrelated mechanism using the all-ones host address within a block.
- B is wrong: Loopback, 127.0.0.0/8, falls within the class A range (1-126 first octet); class D is the separate 224-239 range reserved for multicast.
- D is wrong: RFC 1918 private ranges fall within classes A, B and C (10/8, 172.16/12, 192.168/16); class D is the separate multicast range, unrelated to private addressing.

### 68.

Why is 127 absent from the usable range of class A first octets (1-126) in the classful scheme?

- **A.** 127 is reserved for class B instead, which is why it does not appear in the class A first-octet range.
- **B.** 127 is reserved for RFC 1918 private addressing, carved out of class A for that purpose.
- **C.** 127 was simply never allocated to any class at all, and it remains entirely unused and unreserved to this day.
- **D.** 127.0.0.0/8 is reserved for loopback, so it is carved out of the class A range even though it would otherwise fall within class A's 0-127 first-octet span.

**Answer: D.** 127.0.0.0/8 is reserved for loopback, which is why it is carved out of class A's numeric span even though 127 would otherwise fall within the 0-127 first-octet range that class A occupies, leaving the usable class A range at 1-126.

- A is wrong: Class B's first-octet range is 128-191; 127 does not fall within it at all, and the reason for its exclusion from class A is the loopback reservation, not a class B assignment.
- B is wrong: 127.0.0.0/8 is loopback space, not RFC 1918 private space; the two are separate, commonly confused reservations, and it is loopback that explains the class A gap.
- C is wrong: 127.0.0.0/8 is actively reserved and used for loopback traffic on every host; it is not an unallocated or unused range.

### 69.

A junior admin captures traffic and needs to say which address type — IPv4, IPv6 or MAC — survives unchanged all the way from client to server across several routers. Which one is it, and why do the others not qualify?

- **A.** The IP address (IPv4 or IPv6), which identifies the internetwork endpoint and is preserved end to end, while the MAC address is rewritten at every routed hop.
- **B.** The MAC address — since it is the permanent hardware identifier, it must be the one that is preserved across every hop of the path in every configuration seen in practice.
- **C.** IPv6 only — IPv4 addresses are rewritten hop by hop the same way MAC addresses are, which is why IPv6 was introduced.
- **D.** None of the three; a separate connection identifier assigned by each router is what actually survives the whole path.

**Answer: A.** MAC identifies an interface on one link and is replaced at every router; IPv4 and IPv6 addresses identify the internetwork endpoint and survive every hop, differing from each other only in address size and notation, not in that role.

- B is wrong: A MAC address is rewritten by every router the packet passes through, because it only has meaning within one link, not across the whole path.
- C is wrong: IPv4 addresses are preserved end to end exactly like IPv6 addresses; IPv6 was introduced because of address exhaustion, not because IPv4 gets rewritten in transit.
- D is wrong: Routers do not assign a new connection identifier per hop; IP addresses are what remains constant across the whole path from source to destination.

### 70.

Two hosts show `192.168.5.40/24` and `192.168.5.200/24` in their `ip addr` output. A technician asks whether traffic between them needs a router. What decides the answer, and what is it here?

- **A.** The addresses alone decide it, and since the last octets differ, a router must be involved regardless of any mask.
- **B.** The default gateway decides it, since only a configured gateway can determine whether two hosts share a subnet.
- **C.** The hosts' MAC addresses decide it, since matching manufacturer prefixes indicate hosts on the same physical segment, a conclusion that seems to follow from everyday experience.
- **D.** The subnet mask decides it, and here both addresses share the /24 network portion, so they are on the same subnet and no router is needed.

**Answer: D.** `ip addr` prints each address with its prefix length attached, and applying that mask to two addresses is the only way to know whether they share a network — an address quoted without a mask never answers the question.

- A is wrong: An address by itself does not say where the network/host split falls; only the mask does, and a differing last octet does not by itself imply different subnets.
- B is wrong: The gateway matters for reaching off-subnet destinations, but whether two hosts are on the same subnet is decided purely by applying the mask to both addresses.
- C is wrong: MAC address vendor prefixes say nothing about IP subnet membership; only the IP addresses and the mask applied to them decide that question.

### 71.

An administrator runs `ip addr add 192.0.2.50/24 dev enp0s3` to fix an outage, and the host works immediately. A week later, after a routine reboot, the address is gone. What happened?

- **A.** The address was actually a DHCP lease that silently expired over the course of the week, unrelated to the reboot itself.
- **B.** Interface renaming under the predictable-naming scheme silently moved the address to a differently named interface after the reboot under the great majority of ordinary configurations.
- **C.** The subnet mask given, /24, was invalid for that address range, so the kernel silently discarded it at the next boot.
- **D.** `ip addr add` changes only the running kernel state; it was never written to the distribution's persistent network configuration, so the reboot reverted it.

**Answer: D.** A question about making an address change permanent is never answered by an `ip` command alone: `ip addr add` sets state immediately but writes nothing to disk, so persistence must come from the distribution's network configuration layer.

- A is wrong: The address was assigned manually with `ip addr add`, not leased from DHCP, so there is no lease-expiry mechanism to explain its disappearance.
- B is wrong: Predictable interface names are stable across reboots on the same hardware; renaming does not explain a runtime-only address vanishing entirely.
- C is wrong: /24 is a perfectly valid prefix for 192.0.2.50, and an invalid mask would have been rejected immediately by `ip addr add`, not accepted and later discarded.

### 72.

A service is configured to listen on `0.0.0.0` rather than a specific address. What does that value mean in a listening configuration?

- **A.** It means the service is unreachable from any address until a specific one is configured in its place.
- **B.** It refers specifically to the host's own loopback interface, the same as `127.0.0.1` would.
- **C.** It means the service accepts connections on every address the host holds, not one specific address.
- **D.** It is the broadcast address for whatever subnet the host's primary interface currently belongs to.

**Answer: C.** `0.0.0.0` in a service's listening configuration means every address on the host, which is why binding to it — rather than to a single interface address — is the common fix for 'the service runs but nothing external can reach it.'

- A is wrong: The opposite is true: `0.0.0.0` maximises reachability by binding every address, rather than blocking connections until configured further.
- B is wrong: `127.0.0.1` is the loopback-only address; `0.0.0.0` is the opposite case, meaning every address rather than just the loopback interface.
- D is wrong: A subnet broadcast address depends on the mask and is a specific dotted-decimal value; `0.0.0.0` in a bind configuration is a wildcard, not a broadcast target.

### 73.

Running `ip -6 addr` on a host with IPv6 routing disabled at the site still shows an address beginning `fe80::`. A colleague concludes IPv6 must be misconfigured somewhere. Is that right?

- **A.** No, every interface self-assigns a link-local address automatically, so seeing `fe80::` is normal even when no site-wide IPv6 routing exists.
- **B.** Yes — a link-local address only appears if a rogue DHCPv6 server on the segment has misassigned it in error in the overwhelming majority of real deployments.
- **C.** Yes — its presence means the host is actively routing IPv6 traffic to the wider internet right now.
- **D.** No, but only because `fe80::` is actually the IPv6 loopback address rather than a link-local one.

**Answer: A.** `fe80::/10` link-local addresses are automatically configured on every interface and never routed off the local link, so their presence in `ip -6 addr` output tells you nothing about whether the site actually routes IPv6 traffic anywhere.

- B is wrong: Link-local addresses are self-configured by every interface automatically; no DHCPv6 server, rogue or otherwise, is involved in assigning them.
- C is wrong: A link-local address is confined to the local link by definition and proves nothing about site-wide or internet IPv6 routing.
- D is wrong: The IPv6 loopback address is `::1/128`; `fe80::/10` is the separate link-local range, not the loopback range.

### 74.

A written address reads `2001:db8::0::1`, with two separate `::` runs. Why must this be rejected as invalid notation?

- **A.** Zero compression allows at most one `::` per address, because a second occurrence makes the number of elided zero groups ambiguous.
- **B.** It is invalid because IPv6 addresses may contain at most six hexadecimal groups written out in total.
- **C.** It is invalid because the `db8` group contains a letter, and IPv6 groups may only contain decimal digits.
- **D.** It is invalid because addresses beginning `2001:db8::` are reserved and can never be assigned to a real interface, so no address from that prefix may be written in compressed form.

**Answer: A.** `::` may replace one run of consecutive all-zero groups, and only one such run per address, because allowing two would make the compressed groups impossible to expand back unambiguously.

- B is wrong: An IPv6 address has eight groups when fully expanded; the rule broken here is the double use of `::`, not a limit on the number of groups.
- C is wrong: IPv6 groups are hexadecimal, so letters a through f are entirely valid within a group; that is not the fault in this address.
- D is wrong: 2001:db8::/32 is reserved for documentation examples, which is exactly why it is used in teaching material; that is unrelated to the double-`::` error present.

### 75.

A host needs to confirm it can reach itself over IPv6 before testing anything further. Which address and command combination performs the IPv6 equivalent of `ping 127.0.0.1`?

- **A.** `fe80::1`, since link-local addresses are what IPv6 uses in place of a dedicated loopback address entirely.
- **B.** `::1`, the IPv6 loopback address and the counterpart to `127.0.0.1`, checked with `ip -6 addr` to confirm it is present, then pinged.
- **C.** `0.0.0.0`, checked with `ip addr` rather than `ip -6 addr`, since it represents every address on every protocol version by default on most systems administrators encounter.
- **D.** Any address in `2001:db8::/32`, since that whole documentation range loops back to the originating host by definition.

**Answer: B.** `::1/128` is the IPv6 counterpart of `127.0.0.1`, and `ip -6 addr` is the command that restricts output to IPv6 addresses, making it the tool to confirm the loopback address is present before further troubleshooting.

- A is wrong: Link-local addresses identify an interface on the local link; `::1` is the separate, dedicated loopback address, distinct from any `fe80::` address.
- C is wrong: `0.0.0.0` is an IPv4 wildcard bind address, not an IPv6 loopback address, and `ip addr` without `-6` shows IPv4 addresses.
- D is wrong: 2001:db8::/32 is reserved for documentation examples in written material; it is not a loopback range and does not loop traffic back to the sender.

### 76.

Why does IPv6 have no address that functions as a broadcast address the way IPv4 has one?

- **A.** IPv6 does have a broadcast address; it is simply written as `ff02::1` rather than an all-ones host address.
- **B.** IPv6 has no broadcast address because every IPv6 subnet is limited to a single host by design.
- **C.** IPv6 has no broadcast address because ARP performs that role instead, addressing every host directly.
- **D.** IPv6 replaces every broadcast use case with multicast delivery instead, so there is no IPv6 broadcast address of any kind.

**Answer: D.** IPv6 has no broadcast address of any kind by design; its equivalent functions — such as neighbour discovery — are built on multicast delivery to subscribed groups instead, which is why "the IPv6 broadcast address" is a wrong answer by construction.

- A is wrong: `ff02::1` is the all-nodes multicast address, not a broadcast address; IPv6 has no broadcast concept at all, only multicast.
- B is wrong: A /64 is the conventional IPv6 LAN size and holds vastly more than one host; the absence of broadcast is a design choice, not a consequence of subnet size.
- C is wrong: ARP is not used on IPv6 at all; Neighbor Discovery over ICMPv6 replaces it, and neither one substitutes for a broadcast address.

### 77.

Two questions arrive about the same server: "is the service even running?" and "is anyone actually using it right now?" Which `ss` invocation answers each?

- **A.** `ss -tulpn` alone answers both questions simultaneously, since its `-l` flag is defined to include every established connection alongside the listening sockets.
- **B.** The two are mutually exclusive views of the same table: `ss -tulpn` answers whether it is running, by showing the LISTEN socket, while `ss -t state established` answers who is using it, by showing active ESTAB connections.
- **C.** `ss -t state established` alone answers both questions, since a service with any established connections is thereby proven to also be listening.
- **D.** Neither command answers either question; only reading application logs directly can determine whether a service is running or in use.

**Answer: B.** `ss -tulpn` shows listening sockets, answering whether a service is running and accepting connections, while `ss -t state established` filters to TCP connections in the ESTAB state, answering who is actually using it — a service can be listening with zero clients, or have established connections while its listener is misconfigured elsewhere.

- A is wrong: `-l` restricts output to listening sockets specifically and deliberately excludes established connections, so `ss -tulpn` alone cannot answer who is currently connected.
- C is wrong: A service can have zero established connections while still listening perfectly well; established connections alone do not confirm a listener is present, only that some past connections succeeded.
- D is wrong: `ss -tulpn` and `ss -t state established` are specifically designed to answer these two questions from the socket table directly, without needing to consult application logs at all.

### 78.

A UDP-based service shows a socket in the ESTAB state under `ss`. A colleague treats this as proof a negotiated connection with a remote peer exists, the same as it would for TCP. Is that a safe reading?

- **A.** Yes — ESTAB means exactly the same thing for UDP as it does for TCP: a fully negotiated, bidirectionally confirmed connection with the remote peer.
- **B.** No. A UDP socket showing ESTAB only records that its application called `connect()` to fix a default peer locally; unlike TCP, it involved no handshake and proves nothing about the far end.
- **C.** No, but only because UDP sockets are never permitted to display ESTAB at all, so the tool output itself must be misreporting the socket's actual state.
- **D.** Yes, but only if the socket is also shown holding a LISTEN state at the same time, which together would confirm a genuine remote conversation.

**Answer: B.** A UDP socket bound with no fixed peer shows UNCONN; one whose application has called `connect()` to a single peer shows ESTAB, but that ESTAB is only a local socket property, a default destination the kernel records, not a negotiated connection — unlike TCP it involved no handshake and proves nothing about the far end.

- A is wrong: UDP has no handshake to negotiate anything with a peer; a UDP socket's ESTAB state is purely a local record of a fixed default destination, not a confirmed remote conversation.
- C is wrong: A UDP socket whose application has called `connect()` to a single peer genuinely does show ESTAB; the output is not a misreport, it is simply a different, weaker meaning than TCP's ESTAB carries.
- D is wrong: LISTEN and ESTAB are mutually exclusive states in `ss` output for a given socket entry, not something that can be shown together to reinforce one another.

### 79.

`ss -tulpn` shows a service in the LISTEN state at `127.0.0.1:8080`, and a load balancer reports the connection refused rather than timing out. What does the refusal, as opposed to a timeout, tell you?

- **A.** The refusal tells you the packet never reached the server at all, which would instead be the expected behaviour if a firewall were silently dropping the traffic, since a refusal and a timeout are produced by the same rule and differ only in how quickly the client gives up waiting.
- **B.** The refusal tells you the service crashed between the LISTEN check and the load balancer's connection attempt, which is the only explanation for an instant RST.
- **C.** The refusal tells you DNS resolved the load balancer to the wrong address, which is a name-resolution failure rather than a connection-level one.
- **D.** The refusal tells you the load balancer's SYN reached a host with nothing listening on that specific address; the service is up but bound to loopback only, so it answers with RST when addressed from elsewhere.

**Answer: D.** A listening socket bound to 127.0.0.1 shows up in `ss -tulpn` exactly like one bound to 0.0.0.0, so a service that 'is listening' can still be unreachable from every other host — from the server itself the handshake completes, but from elsewhere the SYN reaches a host with nothing listening on that address and is answered with RST, reported as refused rather than timed out.

- A is wrong: A refusal specifically means a packet reached a live host that answered with RST; a silent firewall drop produces a timeout instead, the opposite symptom from what is described here.
- B is wrong: A crashed service would also close its listening socket, but the scenario shows a working LISTEN entry; the far more direct explanation, consistent with both facts, is the loopback-only bind address.
- C is wrong: The scenario describes a TCP-level refusal after reaching a host, not a resolution failure; DNS is a separate layer entirely from the reachability described here.

### 80.

A `ss` state column shows CLOSE-WAIT for a connection. What does that state typically indicate, and is it usually a network problem?

- **A.** It typically indicates a firewall dropped the connection's traffic mid-stream, which is why the local side is shown waiting to close.
- **B.** It typically indicates the connection is still in the process of being established and has not yet completed its three-way handshake.
- **C.** It typically indicates the peer closed the connection but the local application has not yet closed its end, usually an application bug rather than a network problem.
- **D.** It typically indicates high packet loss on the path, since a poor connection is what most commonly forces a socket into the CLOSE-WAIT state while the kernel retries the lost segments.

**Answer: C.** Between LISTEN and ESTAB lie transient states worth recognising, including CLOSE-WAIT, where the peer closed but the local application has not, which usually indicates an application bug rather than a network one — distinct from a large but normal number of TIME-WAIT entries on a busy server, which is not a leak.

- A is wrong: CLOSE-WAIT is not caused by a firewall drop; it reflects that the peer has already closed cleanly and the local application simply has not finished closing its own end yet.
- B is wrong: A connection still establishing shows SYN-SENT or SYN-RECV, not CLOSE-WAIT, which specifically applies after the peer has already sent FIN on an established connection.
- D is wrong: Packet loss is not what produces CLOSE-WAIT; that state follows a legitimately received FIN from the peer combined with the local application not yet closing its own socket.

### 81.

A team needs a device that keeps a service available when any one of several backend servers fails, distributing load across all of them and removing failed ones from rotation automatically. Is a proxy, generically, defined to do this?

- **A.** Yes — every proxy, reverse or forward, is defined to distribute requests across multiple backends and health-check them as a core part of what a proxy fundamentally is.
- **B.** No, and neither is a load balancer, since removing a failed backend from rotation automatically requires a dedicated firewall device rather than either a proxy or a load balancer.
- **C.** No — a proxy's defining trait is mediating a request on someone's behalf, and a single backend is entirely normal for it; it is a load balancer specifically that selects among several backends by a scheduling algorithm and health-checks them continuously.
- **D.** Yes, but only for a forward proxy specifically; a reverse proxy by definition can never distribute traffic across more than one backend under any circumstances.

**Answer: C.** A load balancer is the standard answer to both handling more traffic and surviving a server failure, distinguished from a proxy by intent: it selects a backend by a scheduling algorithm, health-checks each one continuously, and removes failing ones from rotation, which is not inherent to a proxy simply mediating on someone's behalf.

- A is wrong: A proxy commonly has just one backend behind it; distributing across several backends and health-checking them is what specifically defines a load balancer, not a proxy generically.
- B is wrong: A firewall filters traffic by policy; it does not health-check backends or remove them from a rotation, which is specifically a load balancer's job, and it is exactly the device the team needs here.
- D is wrong: A reverse proxy commonly does distribute traffic across multiple backends once it takes on that role, which is exactly how it becomes a load balancer; the restriction described here does not hold.

### 82.

An application keeps per-user session state in memory on whichever backend first served that user. Requests from the same user are then distributed evenly across every backend by the load balancer's default scheduling algorithm. What problem does this cause, and what feature addresses it?

- **A.** No problem is caused, since every backend behind a load balancer is defined to automatically share in-memory session state with every other backend by default.
- **B.** The problem is caused by health checking, and the fix is to disable health checks so that every backend remains in rotation regardless of its actual state.
- **C.** Later requests may land on a backend without that user's session state, breaking the application; session affinity, or sticky sessions, pins a client to one backend to fix this, at the cost of even distribution.
- **D.** The problem is caused by layer 4 balancing specifically, and the fix is to switch to layer 7 balancing, which is defined to always keep a user on one backend automatically across virtually every environment of this kind.

**Answer: C.** Where an application keeps per-user state in memory, session affinity, or "sticky sessions," pins a client to one backend, at the cost of even distribution — without it, a scheduling algorithm distributing requests evenly across backends will eventually route a returning user to a backend that never saw their session.

- A is wrong: Backends do not automatically share in-memory state with each other by default; a request landing on the wrong backend genuinely loses access to session state kept only in memory there.
- B is wrong: Health checking removes failing backends from rotation for availability reasons; disabling it does not address a session-state mismatch, and it would remove an unrelated safety mechanism.
- D is wrong: Neither layer 4 nor layer 7 balancing automatically pins a client to one backend by default; session affinity is a distinct, explicitly configured feature independent of which layer the balancer operates at.

### 83.

A single load balancer is placed in front of two backend servers to improve availability. A reviewer says this fully removes the single point of failure the two-server design was meant to avoid. Is that correct?

- **A.** Yes — a load balancer is defined to be inherently redundant by design, regardless of whether a second instance of it is deployed alongside the first.
- **B.** No — the load balancer is itself a single point of failure unless it is made redundant too; putting one in front of two servers moves the risk rather than removing it.
- **C.** Yes, but only because health checking on the backends is what specifically eliminates the load balancer itself as a single point of failure.
- **D.** No, but only because the two backend servers themselves remain the single point of failure regardless of whether a load balancer is added in front of them, since two servers in one rotation still share a single failure domain.

**Answer: B.** A load balancer is a single point of failure unless it is itself redundant — putting one in front of two servers moves the risk rather than removing it, since the servers gained resilience at the cost of introducing a new, unprotected single point upstream of them.

- A is wrong: A load balancer is not inherently redundant simply by being a load balancer; it must itself be made redundant, through a second instance or equivalent, to avoid being a single point of failure.
- C is wrong: Health checking monitors the backends the load balancer forwards to; it does nothing to protect against the load balancer itself failing, which remains a single point of failure without its own redundancy.
- D is wrong: Two backend servers behind a load balancer are specifically not a single point of failure for that layer; the unaddressed risk described is the non-redundant load balancer itself, not the backends.

### 84.

What is the practical difference between a layer 4 and a layer 7 load balancer?

- **A.** A layer 4 balancer parses HTTP and can route on hostname, path or header, while a layer 7 balancer forwards TCP or UDP by address and port without reading the payload.
- **B.** A layer 4 balancer only supports TCP, while a layer 7 balancer only supports UDP, matching the transport protocols named by their respective layer numbers.
- **C.** A layer 4 balancer forwards TCP or UDP by address and port without reading the payload; a layer 7 balancer parses HTTP and can route on hostname, path or header.
- **D.** There is no real difference; "layer 4" and "layer 7" are marketing terms describing identical balancing behaviour under two different vendor naming conventions.

**Answer: C.** A layer 4 balancer forwards TCP or UDP by address and port without reading the payload, while a layer 7 balancer parses HTTP and can route on hostname, path or header — the OSI layer number in each name describes how deep into the traffic the balancer looks before deciding where to send it.

- A is wrong: This swaps the two definitions: parsing HTTP content for routing decisions is layer 7's job, and forwarding purely by address and port without reading the payload is layer 4's.
- B is wrong: A layer 4 balancer can forward both TCP and UDP by address and port; the distinguishing trait between the two levels is depth of payload inspection, not which single transport each is restricted to.
- D is wrong: The two genuinely differ in what they inspect and can route on — address and port alone versus parsed HTTP content — not merely in vendor naming for identical behaviour.

### 85.

A web service fails to respond from other machines. Running `ping 127.0.0.1` on the host itself succeeds cleanly. What has this actually confirmed, and what has it not?

- **A.** It confirms the network card, cable and driver are all functioning correctly end to end, since a successful ping is taken as proof that the full network path is intact in the overwhelming majority of real deployments.
- **B.** It confirms the web service itself is correctly configured to accept remote connections on its intended port and address.
- **C.** It confirms the local IP stack is loaded and responding; it says nothing about the NIC, cabling, addressing, routing or firewall rules, since loopback traffic never reaches a physical interface.
- **D.** It confirms the default gateway is correctly configured and reachable from this host on the local subnet.

**Answer: C.** `ping 127.0.0.1` exercises the local TCP/IP stack and nothing else, because the kernel delivers loopback traffic internally without touching any driver; if the service answers on loopback but not remotely, the fault is a binding, firewall or routing issue between the two hosts, not the service itself.

- A is wrong: Loopback traffic is delivered internally by the kernel and never touches the NIC, cable or driver, so a successful loopback ping proves nothing about any of them.
- B is wrong: A loopback ping tests only the IP stack, not any particular service; whether a service is bound to accept remote connections is a separate question entirely.
- D is wrong: Loopback traffic never leaves the host at all, so it says nothing about whether a gateway is configured or reachable on the network.

### 86.

A service answers correctly when tested on `127.0.0.1` from the local host, but a remote client gets connection refused. Given that loopback works, what has been eliminated and what remains a suspect?

- **A.** Nothing has been eliminated, since a loopback test says nothing more than a remote test would about where the service is failing.
- **B.** The remote client's DNS resolution is eliminated as a suspect, since the loopback test used a name rather than a raw address.
- **C.** The network cabling between the two hosts is eliminated as a suspect, since loopback traffic exercises the same physical path a remote client would use, which feels reasonable on first encounter in most textbooks and quick references.
- **D.** The service process itself is eliminated as a suspect, since it clearly is running and answering; a listening-address binding, a firewall rule, or routing between the two hosts remain suspects.

**Answer: D.** Loopback is the sharpest fault-localiser available: a service that answers on 127.0.0.1 but not from another machine is proven to be running, which narrows the remaining suspects to a listening-address binding, a firewall rule, or routing between the two hosts.

- A is wrong: A working loopback response specifically rules out the service being down or broken, narrowing the search to binding, firewall or routing issues between the hosts.
- B is wrong: 127.0.0.1 is a literal address, not a name, so a loopback test using it involves no DNS resolution at all and cannot eliminate a DNS suspect.
- C is wrong: Loopback traffic never reaches a physical interface at all, so it exercises no cabling and cannot eliminate cabling as a suspect for a remote-client failure.

### 87.

A user's `/etc/hosts` file has been edited so that `localhost` now points at a different address entirely. What continues to work, and what does not?

- **A.** `127.0.0.1` continues to work as before, but `localhost` may now resolve somewhere unexpected, because `localhost` is a name resolved through `/etc/hosts` rather than a fixed value.
- **B.** Both `127.0.0.1` and `localhost` stop working entirely, since the edit is assumed to corrupt loopback functionality for the whole host at once.
- **C.** Neither is affected at all, since `/etc/hosts` is assumed to only govern remote name resolution and never the special reserved name `localhost`.
- **D.** `127.0.0.1` stops working entirely, but `localhost` continues to resolve correctly because it is assumed to be hard-coded directly into the kernel by default on most systems administrators encounter.

**Answer: A.** `localhost` is a name resolved through `/etc/hosts`, so an edited or corrupted entry can make it resolve somewhere unexpected while `127.0.0.1` itself, being a literal address, continues to work exactly as before.

- B is wrong: Loopback addressing is handled by the kernel independently of any hosts file entry; editing the name mapping cannot break the literal address 127.0.0.1.
- C is wrong: `localhost` is resolved through `/etc/hosts` exactly like any other name in that file, so editing its entry does change what `localhost` resolves to.
- D is wrong: `localhost` is not hard-coded; it depends entirely on the hosts file or DNS, while 127.0.0.1 is the address that keeps working regardless of any such edit.

### 88.

A developer runs several local services and wants to give each one a distinct loopback address, such as 127.0.0.2 and 127.0.0.3, rather than sharing 127.0.0.1. Is that a valid approach?

- **A.** No — only 127.0.0.1 is reserved for loopback, and the rest of the 127.0.0.0/8 range is ordinary routable address space.
- **B.** No — using any address other than 127.0.0.1 for loopback purposes requires it to first be registered as RFC 1918 private space.
- **C.** Yes, but only up to 127.0.0.255, since the loopback reservation is limited to the final octet rather than the whole /8 block.
- **D.** Yes. The whole 127.0.0.0/8 block is reserved for loopback, so 127.0.0.2 and 127.0.0.3 loop back to the host exactly as 127.0.0.1 does, and are occasionally used this way.

**Answer: D.** The whole 127.0.0.0/8 block is reserved for loopback, not merely 127.0.0.1, so addresses such as 127.0.0.2 also loop back to the host — a fact occasionally used to give several local services distinct local addresses.

- A is wrong: The entire 127.0.0.0/8 block, not just the single address 127.0.0.1, is reserved for loopback and never reaches a network interface.
- B is wrong: Loopback addressing has nothing to do with RFC 1918 private space; the whole 127.0.0.0/8 block is a separate reservation defined independently of RFC 1918.
- C is wrong: The loopback reservation is the full /8 block, 127.0.0.0 through 127.255.255.255, not merely the final octet of the first subnet.

### 89.

A packet travels from a laptop, across two routers, to a server on a different network. Which of the following stays the same across every hop, and which changes at each router?

- **A.** The MAC addresses stay the same end to end, since they are the permanent hardware identifiers; the IP addresses are rewritten by each router instead.
- **B.** Both the IP and MAC addresses stay identical at every hop, because routers only inspect headers without modifying either one.
- **C.** The source and destination IP addresses stay the same end to end; the source and destination MAC addresses are rewritten by each router to the next hop's addresses.
- **D.** Both the IP and MAC addresses are rewritten at every hop, since each router treats the packet as an entirely new transmission.

**Answer: C.** A host fills in its own MAC as source and the next hop's MAC as destination; each router that forwards the packet strips the old frame and builds a new one with new MAC addresses, while the IP addresses in the packet stay untouched end to end — the key exam fact about MAC addresses is negative: they never cross a router.

- A is wrong: This reverses the actual behaviour: MAC addresses are rewritten hop by hop while IP addresses are what remain constant end to end.
- B is wrong: A router necessarily rebuilds the frame with new source and destination MAC addresses for the next hop; only the IP addresses are left untouched.
- D is wrong: IP addresses are preserved end to end specifically so the packet can be routed toward its ultimate destination; only the MAC addresses are rewritten hop by hop.

### 90.

A candidate needs the hardware address of `enp0s3`. Which iproute2 command is the layer 2 view of an interface, reporting the MAC in its `link/ether` field?

- **A.** `ip addr` with the `-6` flag added, since restricting the output to IPv6 is what makes the hardware address appear alongside the IPv6 addresses, which is the assumption most administrators start from.
- **B.** `ip link`, because the link object is the layer 2 view of an interface and reports the hardware address in its `link/ether` field, which `ip addr` also prints above the layer 3 addresses.
- **C.** `ip route`, since the routing table lists the hardware address of the interface associated with each configured route, alongside that route's destination and next hop.
- **D.** `ip neigh`, since the neighbour cache is the table where every local interface's own hardware address is recorded once that interface has been brought up.

**Answer: B.** `ip link` is the layer 2 command, printing each interface with its MAC in the `link/ether` field; `ip addr` is layer 3 only, which is why expecting a hardware address from it is a common mistake.

- A is wrong: `ip -6 addr` restricts output to IPv6 addressing and prints nothing at all for an interface that has no IPv6 address; it never adds hardware address information.
- C is wrong: `ip route` shows the routing table — destinations, next hops and interfaces — and does not display hardware addresses at all.
- D is wrong: `ip neigh` shows the neighbour (ARP) cache of other hosts' resolved addresses, not the local interface's own hardware address, which `ip link` reports.

### 91.

A device's MAC address changes every time it joins a Wi-Fi network, and an administrator flags this as evidence of a hardware fault. Is that the right conclusion?

- **A.** Yes — a MAC address is burned into the hardware and can never legitimately change under any circumstances.
- **B.** No, but only because the device must be silently switching between two separate physical network interfaces each time.
- **C.** No. MAC addresses can be overridden in software, and many systems deliberately randomise them on wireless networks for privacy, which is normal behaviour rather than a fault.
- **D.** Yes, but the fault lies in DHCP rather than in the network hardware, since DHCP is what assigns a new MAC on each join under typical operating conditions, an assumption that holds until it does not.

**Answer: C.** A MAC address is not permanent in practice: it can be overridden in software, and many systems deliberately randomise it on wireless networks for privacy, so a changing MAC on Wi-Fi joins is expected behaviour, not evidence of a hardware fault.

- A is wrong: While the manufacturer burns in an original MAC, it can be overridden in software, and Wi-Fi privacy randomisation is a deliberate, expected feature, not an anomaly.
- B is wrong: A single wireless interface randomising its own MAC address per network is the ordinary explanation; no second physical interface needs to be involved.
- D is wrong: DHCP assigns IP addressing information, not MAC addresses; a device's own operating system, not DHCP, is what randomises the MAC on Wi-Fi.

### 92.

A packet capture on a switch shows a frame addressed to `ff:ff:ff:ff:ff:ff`. What is that destination, and what happens to the frame?

- **A.** It is a malformed or corrupted address, since a real MAC address cannot legitimately consist entirely of the same repeated value.
- **B.** It is the address of the segment's default gateway, since routers conventionally use that reserved value as their MAC address.
- **C.** It is the broadcast MAC address, and the frame is delivered to every interface on that segment.
- **D.** It is a multicast group address, and the frame is delivered only to interfaces that have subscribed to that particular group.

**Answer: C.** The all-ones MAC address, ff:ff:ff:ff:ff:ff, is the broadcast address, delivered to every interface on the segment — the mechanism an ARP request relies on to reach every host without knowing in advance which one holds the target address.

- A is wrong: ff:ff:ff:ff:ff:ff is a valid, reserved value with a specific defined meaning — the broadcast address — not evidence of corruption.
- B is wrong: A gateway's MAC address is an ordinary vendor-assigned address like any host's; ff:ff:ff:ff:ff:ff is reserved specifically as the broadcast address, not for gateways.
- D is wrong: Multicast MAC addresses are identified by the Group bit, the low-order bit of the first octet, being set, not by any vendor-defined pattern; ff:ff:ff:ff:ff:ff is the reserved broadcast address, delivered to every interface rather than only to subscribed group members.

### 93.

A company's internal hosts, all on private addresses, can browse the internet without issue, but an external partner cannot connect to an internal web server without a separately configured rule. What explains the asymmetry?

- **A.** NAT is configured to allow outbound traffic only as a deliberate security policy decision, actively blocking every inbound connection attempt by design.
- **B.** The internal web server is unreachable because its private address is inherently invalid for any inbound connection, regardless of what NAT rules exist.
- **C.** NAT's translation table is built by outbound traffic; an unsolicited inbound packet has no matching entry and is dropped, so reaching the internal server requires an explicit destination-NAT (port forwarding) rule.
- **D.** The asymmetry is caused by DNS, since the partner's resolver has not yet been updated with the internal server's address.

**Answer: C.** NAT is the reason outbound connections from a private network 'just work' while inbound connections do not: the translation table is built by outbound traffic, so an unsolicited inbound packet has no entry to match and is dropped until an explicit destination-NAT rule creates one.

- A is wrong: NAT itself applies no policy at all; it drops unmatched inbound packets purely as a side effect of having no translation entry, not because it makes a security decision.
- B is wrong: A private address is a perfectly valid address on its own network; it becomes reachable from outside once an appropriate NAT and forwarding rule exists, which is exactly the missing piece here.
- D is wrong: The scenario describes a connection failure after a rule is configured, which is about reachability through NAT, not about whether a name resolves to an address.

### 94.

A network with heavy NAT translation in place is described by a manager as "secure, since NAT hides our internal addressing." Is NAT itself a security control?

- **A.** Yes — NAT actively inspects every packet's payload and applies a deny-by-default policy to anything that looks suspicious before translating it.
- **B.** Yes, but only in its capacity as the mechanism that also enforces TLS encryption on every translated connection passing through it.
- **C.** No. NAT blocks unsolicited inbound traffic as a side effect of having no mapping, not as a policy decision, and it inspects nothing; a network can run NAT with no filtering rules at all.
- **D.** No, but only because a firewall is what actually performs NAT's address translation, with NAT itself being a purely cosmetic label.

**Answer: C.** NAT is not a firewall: it blocks unsolicited inbound traffic only as a side effect of having no translation mapping, not as a policy decision, and it inspects nothing about the packet — a network can run NAT with no filtering rules configured at all.

- A is wrong: NAT inspects nothing about a packet's payload and applies no policy; it only rewrites addresses and ports and forwards based on whether a mapping exists.
- B is wrong: NAT has no relationship to TLS or encryption at all; it operates purely on addresses and ports, leaving the payload, encrypted or not, untouched.
- D is wrong: NAT is a real, distinct translation mechanism in its own right, commonly co-located with a firewall on the same device but not identical to or dependent on it.

### 95.

A web server behind a heavily used NAT gateway logs every visitor's IP address for an access-control list based on client location. What problem does this design run into?

- **A.** NAT preserves the original client address unchanged all the way to the server, so the access-control list works exactly as intended without any modification, since translation touches only the destination address on the return path.
- **B.** The server sees the NAT device's translated address as the source for every client, so logs and access-control decisions based on 'client IP' actually reflect the gateway, not the real visitor.
- **C.** The access-control list fails only because NAT blocks all logging traffic outright, preventing the server from recording any address at all.
- **D.** The problem is unrelated to NAT and is instead caused by DNS caching returning a stale address for each visitor's hostname.

**Answer: B.** NAT breaks the end-to-end assumption some protocols and logging schemes make: a server behind NAT sees the translated source address, so logs and access-control lists based on client IP see the NAT device's address rather than the real client's, which is why forwarded headers exist to recover it.

- A is wrong: NAT specifically rewrites the source address as part of its normal operation; the server does not see the original client address unless a forwarded header is added separately.
- C is wrong: NAT does not block logging traffic; the server logs an address just fine, it is simply the gateway's translated address rather than the original client's.
- D is wrong: The scenario concerns the source IP address seen on incoming connections, which is a NAT translation effect, not a DNS caching or name-resolution issue.

### 96.

Why is IPv6 generally said to make NAT unnecessary, rather than to standardise it?

- **A.** IPv6's address space is vast enough that every device can hold a globally unique, routable address, removing the address-scarcity problem that made NAT necessary for IPv4.
- **B.** IPv6 was specifically designed to standardise and formalise NAT as a mandatory part of every network's addressing architecture.
- **C.** IPv6 makes NAT unnecessary because it eliminates private addressing entirely, so every IPv6 address is inherently public and requires no local addressing scheme at all, the private ranges having been dropped in the redesign.
- **D.** IPv6 makes NAT unnecessary because routers under IPv6 forward every packet regardless of its source address, bypassing the need for translation entirely.

**Answer: A.** IPv6 was designed with an address space vast enough that every device can hold its own globally unique, routable address, removing the address-scarcity problem that made NAT necessary for IPv4 — IPv6 was designed to make NAT unnecessary, not to standardise it.

- B is wrong: IPv6 was designed in the opposite direction: to remove the address scarcity that made NAT necessary in IPv4, not to make NAT a mandatory, standardised feature.
- C is wrong: IPv6 retains its own private-style addressing concepts, such as unique local addresses; the reason NAT becomes unnecessary is abundant address space, not the absence of any private addressing.
- D is wrong: Router forwarding behaviour under IPv6 is not what removes the need for NAT; it is the sheer size of the address space, which removes the scarcity that motivated NAT in IPv4.

### 97.

Given the block 10.4.20.0/27, a colleague proposes assigning 10.4.20.0 to a new server because it is the first address in the range. Using the mask to derive the block's boundaries, what should happen instead?

- **A.** 10.4.20.0 is fine to assign, since only the last address in a block, not the first, is ever reserved from host use.
- **B.** Since /27 leaves 5 host bits for a 32-address block, the all-zero address 10.4.20.0 is the network address and not a usable host, so it must be rejected as a host address.
- **C.** 10.4.20.0 is fine to assign, because reservation of the network address only applies to blocks smaller than a /27.
- **D.** 10.4.20.0 must be rejected, but only because a /27 block must begin at an address one above a multiple of 32, so .0 falls below the first legal boundary of the block it is meant to open.

**Answer: B.** For 10.4.20.0/27 the 5 host bits give a 32-address block from 10.4.20.0 through 10.4.20.31; the network address 10.4.20.0 and the broadcast address 10.4.20.31 are both reserved, leaving 10.4.20.1 through 10.4.20.30 as the 30 usable host addresses.

- A is wrong: Both ends of the block are reserved: the all-zero address names the network and the all-one address is the broadcast, not just the highest address.
- C is wrong: The network-address reservation applies to every prefix length that leaves any host bits at all, not to a subset defined by block size.
- D is wrong: The reason for rejection is that all host bits are zero, marking it as the network address; it does not happen to coincide with the mask value, which is a separate 32-bit quantity entirely.

### 98.

A monitoring tool flags every address ending in `.255` across a network as "a broadcast address, and therefore misconfigured if assigned." Is that rule reliable?

- **A.** Yes — an address ending in `.255` is always the broadcast address, regardless of which mask applies to that network.
- **B.** No: the broadcast address depends on the mask, not on the last octet; under a /16 mask, 10.0.0.255 is an ordinary usable host address, not a broadcast.
- **C.** No, but only because the rule should instead check for addresses ending in `.0`, which are the true broadcast addresses that routers flood to every host on a subnet.
- **D.** Yes, because 255.255.255.255 is the broadcast address for every network regardless of the mask configured on it.

**Answer: B.** The broadcast address is derived from the mask, not from a fixed pattern in the address itself: 10.0.1.255 is the broadcast under a /24 mask, but the same-looking 10.0.0.255 is an ordinary usable host under a /16 covering the same range.

- A is wrong: Whether an address ending in .255 is a broadcast address depends entirely on the mask in force; under many masks it is an ordinary usable host address.
- C is wrong: An address ending in .0 is typically the network address under common masks, not the broadcast address; neither fixed ending reliably identifies a broadcast address.
- D is wrong: 255.255.255.255 is the limited broadcast, a separate, never-routed address; it is not the directed broadcast for any particular subnet.

### 99.

What is the practical difference between the limited broadcast address, 255.255.255.255, and a subnet's directed broadcast address?

- **A.** The limited broadcast is local-link only and is never routed anywhere, while a directed broadcast targets one specific subnet and, historically, could be forwarded toward it by routers.
- **B.** They are the same address written two different ways, one in dotted-decimal and the other implied by the subnet mask.
- **C.** The limited broadcast can be routed across the internet to reach any subnet, while a directed broadcast never leaves its originating link.
- **D.** Only the directed broadcast exists in IPv4; the limited broadcast address is an IPv6-only concept with no IPv4 counterpart.

**Answer: A.** 255.255.255.255 is the limited broadcast, confined to the local link and never routed, which is a different thing from a subnet's directed broadcast (such as the highest address in a /27 block) that names one particular network and was historically forwardable toward it.

- B is wrong: 255.255.255.255 is a fixed, single address; a directed broadcast is a different, mask-dependent address computed per subnet, not an alternate notation for the same value.
- C is wrong: This reverses the actual behaviour: the limited broadcast never leaves the local link, while a directed broadcast is the one associated with router-forwarding behaviour.
- D is wrong: Both the limited broadcast and directed broadcasts are IPv4 concepts; IPv6 has no broadcast address of either kind at all.

### 100.

Which RFC changed the required router default for handling directed broadcasts, and what did it change it to?

- **A.** RFC 919 — the original broadcast specification is also the one that mandated routers stop forwarding directed broadcasts by default, and no later RFC revisited that requirement.
- **B.** RFC 1122 — the host requirements document is also the source of the change to router forwarding defaults for broadcasts.
- **C.** RFC 2644 (BCP 34), which changed the required default so that modern routers block receipt and forwarding of directed broadcasts unless explicitly configured otherwise.
- **D.** RFC 4632 — the CIDR specification also happens to be the source of the modern directed-broadcast forwarding default.

**Answer: C.** RFC 919 originally defined a directed broadcast as something gateways forward toward the target network, but RFC 2644 (BCP 34) later changed the required router default so that directed broadcasts are blocked by default rather than forwarded.

- A is wrong: RFC 919 defined the original directed-broadcast behaviour, where gateways forwarded such traffic toward the target network; it was RFC 2644 that later changed the required default.
- B is wrong: RFC 1122 covers host requirements generally; the specific change to router broadcast-forwarding defaults comes from RFC 2644, not RFC 1122.
- D is wrong: RFC 4632 defines classless addressing and prefix notation; it has no bearing on broadcast-forwarding defaults, which come from RFC 2644.

### 101.

A firewall rule and a network configuration file were both written against `eth0` on a server that has since been moved to hardware using predictable interface naming. Deploying the same configuration now fails silently. Why?

- **A.** The configuration fails because `eth0` is a reserved name that can never be assigned to any interface on any Linux system, predictable naming or not.
- **B.** The configuration fails because moving hardware always regenerates the MAC address of every interface, invalidating any rule written against a specific interface name.
- **C.** On a predictable-naming system there is usually no interface literally named `eth0`; the configuration should be written against whatever `ip link` actually shows, such as `enp0s3`, not the old detection-ordered name.
- **D.** The configuration fails because `net.ifnames=0` must have been silently enabled by the move, which is defined to always disable every previously working interface reference.

**Answer: C.** A firewall rule, a route or a network configuration file that names the wrong interface fails silently, and writing configuration against `eth0` from habit without checking is exactly that trap — on a predictable-naming system there is usually no such interface, and `ip link` is the only reliable way to find out what the system actually uses.

- A is wrong: `eth0`-style names are not reserved or forbidden; they are simply the older, detection-ordered convention that predictable naming was introduced to replace, and they can still appear if predictable naming is disabled.
- B is wrong: Moving hardware does not regenerate MAC addresses; the actual issue is that the interface's name itself changed under the predictable-naming scheme, unrelated to any change in its MAC address.
- D is wrong: `net.ifnames=0` would restore `eth0`-style names, not disable references to them; the scenario describes the opposite situation, moving to hardware that uses predictable naming instead.

### 102.

A predictable interface name reads `enp0s3`. Decode what each part of that name is saying about the interface.

- **A.** `en` for a wireless interface, `p0s3` for the fourth interface detected at boot, in the same detection-order scheme `eth0` and `eth1` used previously.
- **B.** `en` for Ethernet, `p0` for PCI bus 0, `s3` for slot 3: an Ethernet interface located at PCI bus 0, slot 3, derived from the hardware's own topology.
- **C.** `en` for the network manager in use, `p0s3` for the fourth priority level assigned to the interface by that manager's configuration.
- **D.** `enp0s3` is an entirely arbitrary, randomly generated label with no decodable structure or relationship to the underlying hardware at all.

**Answer: B.** A predictable name starts with a two-character prefix for the interface type — `en` Ethernet, `wl` wireless LAN, `ww` wireless WAN — followed by a suffix derived from where the device sits: `p<bus>s<slot>` the PCI geographic location, so `enp0s3` reads as Ethernet, PCI bus 0, slot 3.

- A is wrong: `en` specifically denotes Ethernet, not wireless (`wl` is the wireless prefix), and the suffix encodes hardware topology, a PCI bus and slot, not a detection-order count the way `eth0` and `eth1` did.
- C is wrong: The prefix identifies interface type (Ethernet, wireless, and so on), not which network manager is in use, and the suffix encodes hardware location, not a manager-assigned priority level.
- D is wrong: The name is deliberately structured and decodable, derived from hardware topology, precisely so it remains stable and meaningful across reboots, not arbitrary or random.

### 103.

A disk is physically moved from one server to another with a different hardware layout. What happens to a predictable interface name that configuration on that disk refers to?

- **A.** It stays exactly the same regardless of hardware changes, since predictable names are defined to be permanently fixed to the operating system installation rather than to hardware topology, since the assigned name is stored with the installation and read back unchanged at every boot.
- **B.** It reverts automatically to the older `eth0`-style detection-ordered naming scheme whenever a disk is moved to different hardware.
- **C.** It is likely to change — a predictable name is stable but not portable, so moving to different hardware, or a card to a different PCI slot, produces a different name and breaks configuration that hard-codes the old one.
- **D.** It is regenerated based on the interface's MAC address rather than its physical location, so the name stays identical as long as the same network card is reused.

**Answer: C.** A predictable name is stable but not portable: moving a disk to different hardware, or a card to a different PCI slot, produces a different name and breaks configuration that hard-codes the old one — the loopback interface `lo` is the one exception, always named the same regardless of scheme.

- A is wrong: Predictable names are derived from hardware topology specifically, not fixed permanently to the OS installation; moving to different hardware changes the topology and therefore the name.
- B is wrong: Moving hardware does not automatically revert the naming scheme; predictable naming remains in effect and simply derives a different name from the new hardware's topology, unless `net.ifnames=0` is separately set.
- D is wrong: While an `x<MAC>`-based suffix scheme exists as one option, the common PCI-path-based naming described here is location-based, not MAC-based, so a differently located card produces a different name even if the MAC stays the same.

### 104.

How can predictable interface naming be disabled to restore the older `eth0`-style names, and who actually assigns interface names day to day?

- **A.** The `net.ifnames=0` kernel parameter enables the scheme rather than disabling it, and names are assigned directly by whichever network manager, such as NetworkManager, happens to be installed.
- **B.** Predictable naming can only be disabled by physically replacing the network card, and names are assigned by the BIOS or UEFI firmware rather than by any software component.
- **C.** Predictable naming is permanent and cannot be disabled once enabled, and names are assigned directly and irreversibly by the kernel at compile time.
- **D.** The `net.ifnames=0` kernel parameter disables the scheme; day to day, names are assigned by udev's naming policy, not chosen directly by the distribution's networking tool.

**Answer: D.** The scheme can be disabled with the `net.ifnames=0` kernel parameter, restoring `eth0` style names, and the names themselves are not chosen by the distribution's networking tool; they come from udev's naming policy, so renaming an interface reliably means writing a udev rule or a systemd `.link` file rather than editing the network configuration.

- A is wrong: `net.ifnames=0` disables predictable naming, restoring the older scheme, not the other way around; and names are assigned by udev's policy, not directly by the network manager application.
- B is wrong: No hardware replacement is needed; a simple kernel parameter, `net.ifnames=0`, disables the scheme, and names are assigned by udev in the operating system, not by firmware.
- C is wrong: The scheme is not permanent or irreversible; it is a runtime kernel parameter, `net.ifnames=0`, that restores the older naming, and names are assigned by udev's policy at runtime, not fixed at kernel compile time.

### 105.

A monitoring check against a new service on port 8443 has been failing since deployment. `nc -zv api.example.com 8443` hangs for the full timeout with no response, while `nc -zv api.example.com 22` succeeds instantly. What does this pair of results indicate, and what is the correct next diagnostic step?

- **A.** The 8443 timeout indicates a silent drop, port-specific since 22 works instantly; routing is ruled out, so the next step is checking the server's own bind address and then the firewall policy for port 8443 specifically.
- **B.** Both results indicate the exact same underlying cause, since a timeout and an instant success are treated as equally strong evidence of the identical routing problem.
- **C.** The 8443 timeout proves the entire host is unreachable, and the 22 success must therefore be a stale cached result rather than a genuine current connection.
- **D.** The correct next step is to read the firewall policy first, before checking anything about the server's own service configuration or bind address.

**Answer: A.** Timing the failure is the first diagnostic move: an instant refusal means the host is up and reachable, pointing at the service or its bind address, while a timeout means nothing answered at all — testing a known-open port like 22 alongside the failing one isolates whether the filtering is selective by port or a blanket problem, and `ss -tulpn` on the server itself is the complementary check from the listening side, before reading any firewall policy.

- B is wrong: A timeout and an instant success are opposite outcomes with different diagnostic meanings; treating them as equally indicating the same cause discards the most useful evidence in the report.
- C is wrong: A working connection on port 22 to the same host at the same time is genuine evidence of reachability, not a stale cache; the host is clearly reachable, and only port 8443 specifically is affected.
- D is wrong: Reading firewall rules before checking the server's own listening state is how administrators spend an hour on a firewall that was never involved; the server's bind address should be checked first.

### 106.

A port scan reports a target port as "closed." A junior analyst reads this as "blocked by a firewall." Is that the correct reading?

- **A.** Yes — a port reported as closed always means a firewall somewhere on the path silently dropped the connection attempt without ever reaching the host.
- **B.** No, but only because "closed" actually means the destination host does not exist at all, rather than that it exists but has nothing listening.
- **C.** No — closed is not blocked; it is a cooperative answer, an RST, from a working host with nothing listening on that port, which proves layer 3 reachability rather than a block.
- **D.** Yes, but only for UDP scans, since a UDP port reported closed is defined to always indicate a firewall block rather than an application-level absence of a listener, because UDP provides no way for a host to report an absent listener.

**Answer: C.** "Closed" is not "blocked": a closed port is a cooperative answer from a working host, and it proves layer 3 reachability — for TCP, a SYN to a closed port is answered with RST, an answer that arrives fast, unlike the silence a filtered port produces.

- A is wrong: A silently dropped connection attempt is reported as filtered, not closed; closed specifically means the host answered with an RST, proving the packet reached a live host.
- B is wrong: A closed port specifically means a live, existing host answered; a nonexistent host would more typically produce a routing failure or a timeout, not a cooperative RST response.
- D is wrong: A closed UDP port is not a firewall signature: closed UDP ports usually answer with an ICMP port unreachable error, which is exactly how a scan reports them closed. The genuinely ambiguous UDP case is silence, which is reported as open or filtered rather than closed.

### 107.

A firewall configured to REJECT rather than DROP is in the path to a service. A scan against it comes back with an immediate refusal. Does that immediate refusal conclusively prove the destination host itself has nothing listening?

- **A.** No, a REJECT rule answers on the destination host's behalf, so a firewall anywhere on the path can produce the refusal without the destination ever seeing the packet; an immediate refusal proves only that something on the path answered, not that the destination is up with nothing listening.
- **B.** Yes — an immediate refusal is always generated exclusively by the destination host itself and can never originate from an intermediate firewall or security appliance sitting somewhere on the path.
- **C.** No, but only because REJECT rules are exclusively a UDP-scanning artefact and have no bearing whatsoever on TCP-based port scans, which always report closed ports as filtered instead.
- **D.** Yes, but only when the scan is run with `nc -zv` specifically, since other scanning tools are defined to correctly distinguish a REJECT rule from a genuinely closed port by inspecting the reply's source rather than just its type.

**Answer: A.** A firewall configured to REJECT rather than DROP produces the refused response too, so an immediate refusal does not conclusively prove nothing is listening — it does prove something on the path answered, but a REJECT rule sources its reply from the original packet's destination address without the destination host itself ever seeing the packet.

- B is wrong: A REJECT rule on an intermediate firewall specifically can source the refusal on the destination's behalf, so an immediate refusal does not always originate from the destination host itself.
- C is wrong: REJECT rules apply to TCP scans as well as UDP ones; the described subtlety, the reply sourced on the destination's behalf, is not restricted to UDP scanning.
- D is wrong: No standard scanning tool can reliably distinguish a REJECT rule's reply from a genuinely closed port's RST from outside the network; this is an inherent limitation of the technique, not specific to `nc -zv`.

### 108.

Why is a UDP port scan considered fundamentally unreliable compared to a TCP scan?

- **A.** UDP scans are unreliable only because `nc -zv` does not support the `-u` flag needed to test UDP ports at all on any current version.
- **B.** UDP scans are unreliable because UDP packets are always dropped by every firewall by default, making every UDP port appear closed regardless of its actual state.
- **C.** UDP has no handshake, so silence in response to a probe is ambiguous between an open port that simply chose not to reply and a port that is genuinely filtered.
- **D.** UDP scans are unreliable only on IPv6 networks, since IPv4 UDP scanning is defined to always produce a definitive open, closed or filtered result.

**Answer: C.** UDP has no handshake, so no response is ambiguous between an open port that simply does not reply and a filtered one — for TCP, a SYN to an open port gets SYN-ACK and a SYN to a closed port gets RST, both fast, definitive answers UDP has no equivalent of.

- A is wrong: `nc -zv` does support `-u` for testing UDP; the unreliability comes from UDP's lack of a handshake making silence ambiguous, not from a missing tool feature.
- B is wrong: Firewalls do not universally drop all UDP traffic by default; the unreliability is specifically about silence being ambiguous between an open, non-responding port and a genuinely filtered one.
- D is wrong: The ambiguity in UDP scanning comes from UDP's connectionless design itself, applicable to both IPv4 and IPv6, not from any IPv6-specific limitation.

### 109.

A technician is told only 'the application is broken.' Checking the host: the interface has a link light and a MAC address, `ip addr` shows a valid IP and default route, ping to the server succeeds, but connecting to the service's TCP port is refused instantly. Which OSI layer does that evidence point to?

- **A.** Layer 3, Network — routing must still be at fault even though the ping already succeeded.
- **B.** Layer 7, Application — the phrase 'the application is broken' names the layer directly.
- **C.** Layer 4, Transport. The packet reached the host and something answered with a refusal, which is a transport-layer event.
- **D.** Layer 2, Data Link — an immediate refusal usually points at a switching problem on the segment, since frame delivery is what a live link light actually proves.

**Answer: C.** The OSI model is a fault-isolation ladder: each confirmed layer removes it from suspicion. Link and MAC confirm layer 2, a working ping and route confirm layer 3, and an instant TCP refusal is generated at layer 4, which is exactly where the evidence should be read from next.

- A is wrong: The successful ping and valid default route already confirmed layer 3, so a routing explanation ignores evidence already in hand.
- B is wrong: Taking a vague complaint at face value skips the ladder the model exists to support; an instant refusal is a transport-layer signature, not evidence about the application itself.
- D is wrong: Layer 2 was already confirmed by the link light and MAC address; a data-link fault would prevent any frame exchange, not produce a fast refusal from a live host.

### 110.

A candidate says the internet runs on a seven-layer stack because that is the model taught for troubleshooting. Which correction applies, and what is the model the internet actually implements?

- **A.** Both models are implemented side by side, with OSI handling addressing and TCP/IP handling delivery.
- **B.** The internet implements the four-layer TCP/IP model; OSI is a seven-layer teaching and troubleshooting vocabulary, not a deployed stack.
- **C.** The seven-layer model is correct, and TCP/IP is simply an older, deprecated name for the same thing.
- **D.** Neither model applies to the modern internet, which is organized around software-defined layers unrelated to either under typical operating conditions.

**Answer: B.** OSI's seven layers are a vocabulary for describing and dividing responsibilities; TCP/IP's four layers — link, internet, transport, application — are what RFC 1122 specifies and what every host on the internet genuinely runs.

- A is wrong: No host runs two parallel stacks; OSI is a reference vocabulary layered onto discussion of the one stack that is actually implemented.
- C is wrong: TCP/IP is not a deprecated synonym; it is the four-layer model actually implemented, with a different layer count and different boundaries from OSI.
- D is wrong: Every host still implements the four TCP/IP layers regardless of any software-defined overlay built on top of them.

### 111.

List the seven OSI layers in order from the physical medium upward.

- **A.** Physical, Data Link, Network, Transport, Session, Presentation, Application.
- **B.** Physical, Network, Data Link, Session, Transport, Presentation, Application.
- **C.** Data Link, Physical, Network, Transport, Application, Session, Presentation.
- **D.** Physical, Data Link, Network, Session, Transport, Presentation, Application.

**Answer: A.** Layer numbering runs 1 through 7 from the physical medium upward: Physical, Data Link, Network, Transport, Session, Presentation, Application, and questions naming a device or protocol are testing recall of this exact order.

- B is wrong: Data Link and Network are swapped, and so are Transport and Session, which is a common ordering slip.
- C is wrong: The physical medium is layer 1 by definition, and Application belongs last, not in the middle of the stack.
- D is wrong: Transport is layer 4 and Session is layer 5; this ordering has them reversed.

### 112.

A vendor advertises a 'layer 3 switch' and a colleague concludes that switching must therefore be a layer 3 function. What is wrong with that conclusion?

- **A.** Nothing is wrong; a layer 3 switch proves that modern switching hardware has genuinely moved up to operate at the network layer now.
- **B.** The device only routes traffic between subnets and never actually performs any layer 2 switching, despite the marketing name it carries.
- **C.** The device operates entirely at layer 4, since it manages its physical ports the same way a stateful firewall manages transport-layer ports, forwarding on port numbers rather than on MAC addresses.
- **D.** The device performs two functions (switching at layer 2 and routing at layer 3), and combining them in one box does not move switching to a different layer.

**Answer: D.** A hub is layer 1, a switch layer 2, a router layer 3, and a 'layer 3 switch' is simply a device that does both switching and routing — the marketing name does not change which layer either individual function belongs to.

- A is wrong: The name is a marketing label for a device that both switches and routes; it does not redefine which layer switching itself belongs to.
- B is wrong: A layer 3 switch genuinely performs layer 2 switching in addition to layer 3 routing; it is not routing-only under a misleading label.
- C is wrong: Managing ports as physical interfaces on a switch is unrelated to layer 4 transport ports, and the device does not operate at layer 4 for switching.

### 113.

A server does not respond to `ping`, and an operator immediately reports it as down. TCP services on the same host, tested separately, work perfectly. What does this combination actually show, and what should the operator have concluded first?

- **A.** It shows the host is genuinely down, since a working TCP connection to the same address without a working ping is a technical impossibility on any real network, because a TCP handshake cannot complete until the same host has already answered an ICMP echo request.
- **B.** It shows ICMP is being filtered or the host is configured not to answer echo requests; the host is clearly up, so "ping fails, therefore the host is down" is the wrong conclusion.
- **C.** It shows DNS is misconfigured for that host, since a failed ping combined with working TCP connections is defined to always indicate a name-resolution problem.
- **D.** It shows the host's routing table is broken, since only a routing failure could explain ICMP failing while TCP traffic to the very same address succeeds.

**Answer: B.** `ping` is the cheapest reachability test available, but a failed ping does not prove a host is down: ICMP is very commonly blocked by policy while TCP services on the same host work perfectly, which is exactly why treating ping failure as proof of a dead host is a classic, examinable wrong conclusion.

- A is wrong: A host can be fully up and serving TCP connections while ICMP is filtered separately; the two are independent, and a working TCP connection alongside a failed ping is a common, expected combination.
- C is wrong: The scenario does not describe a naming issue at all; both the failed ping and the working TCP connections were tested against the same reachable host, which points at ICMP filtering, not DNS.
- D is wrong: A broken routing table would affect TCP traffic just as much as ICMP traffic to the same destination; the described split, ICMP failing while TCP succeeds, points at protocol-specific filtering, not routing.

### 114.

Running `ping web01` produces "Name or service not known." A colleague starts checking cabling and switch ports. Is that the right first move given this particular error message?

- **A.** Yes — "Name or service not known" is defined to always indicate a physical-layer fault, making cabling and switch ports the correct first thing to check, since ping reports resolver failures with a separate 'unknown host' message instead.
- **B.** No, but only because the correct first move is instead to check the default gateway configuration rather than name resolution at all.
- **C.** No — this specific message means name resolution failed, not reachability; ping answers a name as well as an address, so this points straight at DNS or `/etc/hosts`, not at cabling or switching.
- **D.** No, but only because the correct first move is instead to check the ARP cache for the target host's MAC address before anything else.

**Answer: C.** Reading the failure text before anything else pays off here: "Name or service not known" is DNS, not reachability, and the message states this plainly, which is exactly the distinction readers routinely skip past on their way to checking cabling and switches.

- A is wrong: The message specifically reports a naming failure, not a physical-layer one; checking cabling and switches first skips past the actual, plainly stated cause.
- B is wrong: The gateway matters for reaching off-subnet destinations by address, but this specific error message is about resolving a name, which points at DNS or `/etc/hosts`, not the gateway.
- D is wrong: ARP resolves an already-known IP address to a MAC address on the local segment; a name-resolution failure happens before any address exists to resolve into a MAC at all.

### 115.

A router along the path replies "Destination Host Unreachable" to a `ping`. Who generated that message, and what does it actually report?

- **A.** The target host itself generated it directly, confirming it received the ping but is deliberately refusing to answer it under its current configuration.
- **B.** A router along the path generated it, reporting that it could not deliver the packet; it is a third party's report, not the target host answering.
- **C.** The originating host's own local DNS resolver generated it as a cached response to a previous, unrelated failed lookup for the same name.
- **D.** A firewall on the originating host itself generated it locally, before the ping packet had even left the machine attempting to send it.

**Answer: B.** Destination unreachable (ICMP type 3) is what produces "Destination Host Unreachable," and it is generated by a router on the path reporting it could not deliver the packet — a third party's report, not the target host answering, which is why it does not by itself confirm anything about the target itself.

- A is wrong: This specific message is generated by an intermediate router, not the target host; the target never received the packet at all in this scenario.
- C is wrong: A DNS resolver does not generate ICMP unreachable messages; this message is an ICMP-layer report from a router on the path, unrelated to name resolution or caching.
- D is wrong: The message arrives as a reply from somewhere on the network path, not generated locally before the packet leaves the originating host at all.

### 116.

A TCP handshake to a service succeeds cleanly while `ping` to the same host fails entirely. What does that combination prove about ICMP specifically?

- **A.** It proves the TCP handshake result must be wrong or spurious, since a genuinely reachable host is defined to always also answer ICMP echo requests successfully, because a TCP handshake cannot complete until an ICMP echo has already been exchanged.
- **B.** It proves ICMP is filtered somewhere on the path rather than the host being down, since a successful TCP handshake independently confirms the host is up and reachable.
- **C.** It proves the host's routing table has a fault specific to ICMP traffic while somehow leaving TCP traffic completely unaffected on the same path.
- **D.** It proves DNS resolved the ping target to a different, unreachable address than the one the TCP connection actually used to reach the host successfully.

**Answer: B.** If ping fails but the service must be tested anyway, testing the port directly is the next step: a TCP handshake succeeding while ICMP fails is common and proves ICMP is filtered rather than the host being down, converting an inconclusive ping result into a specific, testable finding.

- A is wrong: There is no such guarantee; ICMP is very commonly filtered independently of TCP reachability, so a successful handshake is the more reliable evidence here, not the ping failure.
- C is wrong: A routing-table fault would typically affect all traffic to a destination, not selectively spare TCP; the more direct and common explanation is a policy that filters ICMP specifically.
- D is wrong: Nothing in the scenario suggests different addresses were used; the straightforward reading is that ICMP is specifically filtered while TCP reaches the same host successfully.

### 117.

A thousand clients connect to the same web server on port 443 at once. How does the server distinguish one client's conversation from another's, given they all target the identical port?

- **A.** By the full four-tuple (source address, source port, destination address, destination port), since each client's own address and ephemeral source port make its connection unique even though the destination port is shared.
- **B.** By destination port alone, since port 443 is defined to be unique per connection and the server simply opens a fresh port 443 instance for each new client.
- **C.** By MAC address alone, since every client's hardware address is preserved end to end and is what the server actually uses to distinguish one conversation from another.
- **D.** By TTL value alone, since each client's operating system sets a sufficiently distinct starting TTL for the server to use as a unique per-connection identifier.

**Answer: A.** A connection is identified by the pair of sockets: source address, source port, destination address, destination port — the four-part identity is why thousands of clients can reach the same server port simultaneously without ambiguity, since each client contributes a distinct address and ephemeral source port.

- B is wrong: The server does not open a new destination port per client; the port stays 443 for every connection, and it is the client-side address and port that make each connection distinct.
- C is wrong: MAC addresses are rewritten at every router and never reach the server intact from a remote client; the server identifies connections by IP address and port, not by MAC.
- D is wrong: TTL is a hop-count field that decrements at every router and is not designed or reliable as a connection identifier; the four-tuple of addresses and ports is what actually distinguishes connections.

### 118.

`ss -tulpn` shows a process listening at `127.0.0.1:8080` and another at `0.0.0.0:9090`. A remote client can reach the second but not the first. Why?

- **A.** The port numbers decide it — 9090 is inherently reachable from remote hosts while 8080 is inherently restricted to local connections regardless of the bind address shown, because the kernel reserves the 8000-8999 band for loopback traffic.
- **B.** The process names decide it, since `ss -tulpn` restricts remote reachability based on which named process owns each socket rather than on the bound address.
- **C.** Whether `-n` was used decides it, since numeric output is what actually enables remote clients to reach a listening socket in the first place.
- **D.** The Local Address column decides it: `127.0.0.1` accepts only from the same machine, while `0.0.0.0` accepts on every address the host holds, including from remote clients.

**Answer: D.** Binding to 127.0.0.1 rather than 0.0.0.0 is the single most common cause of "the service is running but nothing can connect," and it is invisible unless you read the Local Address column rather than just the port — 127.0.0.1 accepts only from the same machine, while 0.0.0.0 accepts on every address the host holds.

- A is wrong: No port number is inherently local-only or inherently remote-reachable; reachability is governed by the bind address in the Local Address column, not by which port number is chosen.
- B is wrong: `ss -tulpn`'s `-p` column reports which process owns a socket for diagnostic purposes; it does not itself restrict or grant reachability, which is governed by the bind address instead.
- C is wrong: `-n` only affects whether ports are displayed numerically rather than as translated service names; it has no effect at all on which addresses a socket is actually reachable from.

### 119.

An unprivileged process tries to bind port 80 directly and fails with a permission error, though the port is not in use by anything else. Why?

- **A.** Ports below 1024 require privilege to bind on Linux, so a non-root process cannot simply listen on 80 regardless of whether the port is otherwise free.
- **B.** The port must actually be in use by something else already, since binding failures below 1024 are always caused by an existing conflicting listener rather than by a privilege check.
- **C.** The process must be trying to bind the wrong address family, since binding failures on low-numbered ports are typically an IPv4-versus-IPv6 mismatch rather than a privilege issue.
- **D.** A firewall rule must be blocking the bind attempt, since firewalls are what typically prevent an unprivileged process from binding a low-numbered port on Linux.

**Answer: A.** Ports below 1024 require privilege to bind on Linux, which is why a non-root process cannot simply listen on 80 — the port is not "opened by the operating system," it is open because a privileged process bound it and is listening, independent of whether the port would otherwise be free.

- B is wrong: The scenario states the port is not in use; the failure is a privilege requirement specific to ports below 1024, not evidence of an undetected conflicting listener.
- C is wrong: An address-family mismatch produces a different kind of error, not specifically a permission error; the described failure is the well-documented privilege requirement for ports below 1024.
- D is wrong: A firewall filters traffic in transit; it does not prevent a local process from binding a socket at all, which is a kernel-level privilege check unrelated to firewall policy.

### 120.

Where does a client's own source port typically come from when it initiates a connection, and does the administrator normally choose it?

- **A.** The kernel picks an unused source port automatically from a configured ephemeral range (on Linux, from `/proc/sys/net/ipv4/ip_local_port_range`, 32768 to 60999 by default), without the administrator choosing it per connection.
- **B.** The administrator manually assigns a fixed source port for every outbound connection a client makes, matching the destination port being contacted so that both ends of the connection use the identical port number.
- **C.** The source port always matches the destination port, so a connection to port 443 automatically uses source port 443 as well on the client side.
- **D.** DHCP assigns the source port to the client alongside its IP address, gateway and DNS servers as part of the same lease.

**Answer: A.** A client's kernel picks an unused source port automatically — on Linux from the range in `/proc/sys/net/ipv4/ip_local_port_range`, 32768 to 60999 by default — and connects to the server's address and port, with no manual per-connection selection required.

- B is wrong: Source ports are picked automatically by the kernel for outbound connections; manually assigning a fixed source port per connection is neither the default nor the ordinary practice.
- C is wrong: The client's source port is an arbitrary ephemeral value chosen by the kernel, unrelated to the destination port; source and destination ports are not required to match.
- D is wrong: DHCP assigns addressing configuration only — address, mask, gateway, DNS servers; it has no role in choosing a source port, which the kernel selects per connection instead.

### 121.

A host holds the address 100.64.0.5. A technician assumes it is RFC 1918 private space because it clearly is not publicly routable. Is that assumption correct?

- **A.** No, 100.64.0.0/10 is carrier-grade NAT space, a fourth non-globally-routable range defined separately from the three RFC 1918 blocks.
- **B.** Yes — anything that is not globally routable on the internet is, by definition, one of the RFC 1918 private ranges under typical operating conditions.
- **C.** No, but only because 100.64.0.5 is actually loopback space rather than RFC 1918 or carrier-grade NAT space.
- **D.** No, but only because 100.64.0.5 is link-local (APIPA) space rather than RFC 1918 or carrier-grade NAT space.

**Answer: A.** RFC 1918 sets aside exactly 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16; 100.64.0.0/10 for carrier-grade NAT, 127.0.0.0/8 for loopback and 169.254.0.0/16 for link-local are all separately defined non-routable ranges outside RFC 1918.

- B is wrong: Non-routability is not the same as RFC 1918 membership; carrier-grade NAT space, loopback and link-local are all non-routable without being RFC 1918.
- C is wrong: Loopback is the fixed 127.0.0.0/8 block; 100.64.0.5 falls in the separate carrier-grade NAT range, not in loopback space.
- D is wrong: Link-local (APIPA) space is 169.254.0.0/16, a different range entirely from the 100.64.0.0/10 carrier-grade NAT block that 100.64.0.5 falls in.

### 122.

A private network with no internet connection at all is being designed. A reviewer insists NAT must still be configured "because private addresses always need it." Is the reviewer right?

- **A.** No. Private versus public is a classification of the address itself, while NAT is a rewriting action performed for internet reachability; a network with no internet access needs no NAT at all.
- **B.** Yes — any use of RFC 1918 addressing requires NAT to be configured somewhere in the design, whether or not the network in question ever reaches the internet at all, regardless of which distribution or vendor is involved.
- **C.** Yes, but only because private addresses are treated as inherently invalid unless a NAT device is present somewhere on the path to validate them first.
- **D.** No, but only because a firewall, not NAT, is what private addresses actually require before they can be used at all.

**Answer: A.** Private versus public is a label on an address; NAT is an action performed on packets crossing toward the public internet. A private network that never needs to reach the internet has no packets for NAT to act on, so it needs no NAT.

- B is wrong: NAT is required only when private addresses must reach a public destination; a fully isolated private network has no such requirement at all.
- C is wrong: Private addresses are valid addresses within their own network on their own terms; NAT is not a validation step, only a translation performed for external reachability.
- D is wrong: Private addresses require neither NAT nor a firewall simply to function on their own isolated network; both are separate concerns from address classification.

### 123.

An address-planning spreadsheet lists 172.15.4.10, 172.20.4.10 and 172.32.4.10, all marked "private, RFC 1918." Which of these markings are wrong, and why?

- **A.** 172.15.4.10 and 172.32.4.10 are wrongly marked. The 172 private range is /12, spanning only 172.16.0.0 through 172.31.255.255, so both fall outside it while 172.20.4.10 is correctly private.
- **B.** Only 172.32.4.10 is wrongly marked; 172.15.4.10 falls inside the private range because the /12 block extends downward from 172.16.0.0 as well as upward, running from 172.15.0.0 to 172.31.255.255.
- **C.** All three are correctly marked, since every address beginning with the octet 172 falls within RFC 1918 private space.
- **D.** None are correctly marked, because RFC 1918 does not reserve any range that begins with the octet 172 at all.

**Answer: A.** The 172 private block is exactly /12: 172.16.0.0 through 172.31.255.255. 172.15.4.10 sits one increment below that boundary and 172.32.4.10 one increment above it, so both are public despite sharing the leading octet with the private range.

- B is wrong: The private range starts at 172.16.0.0, not 172.0.0.0; 172.15.4.10 is one increment below the boundary and is public, not private.
- C is wrong: The 172 private range is restricted to the /12 block 172.16.0.0-172.31.255.255, not the entire 172.0.0.0/8 space that the octet 172 alone would suggest.
- D is wrong: RFC 1918 does reserve a 172-based range, 172.16.0.0/12; the error in the spreadsheet is the boundary, not the absence of any 172-based private block.

### 124.

A company runs an internal application on 10.5.2.20 and wants remote staff on the public internet to reach it directly by that address. Without any further configuration, will that work?

- **A.** Yes — any address can be reached from the internet as long as the destination host's firewall permits inbound traffic on the right port, since reachability is decided at the destination host rather than in transit.
- **B.** Yes, but only if the application server's DNS record is updated to point at the 10.5.2.20 address instead of its current one.
- **C.** No; 10.5.2.20 is RFC 1918 private space, which internet routers do not carry, so it can only be reached from outside once something translates it to a public address.
- **D.** No, but only because 10.5.2.20 is loopback space rather than because it is unroutable private space.

**Answer: C.** Recognising an address as private immediately explains this symptom: internet routers do not carry RFC 1918 prefixes, so a service hosted on one is unreachable from outside until NAT or an equivalent translation makes it appear as a public address.

- A is wrong: A permissive firewall rule cannot make an unroutable private address reachable; internet routers simply do not carry a path to 10.5.2.20 regardless of any firewall policy on the host.
- B is wrong: Publishing a private address in DNS does not make it routable; remote clients would still be unable to reach a destination that no internet router carries a path to.
- D is wrong: Loopback is the fixed 127.0.0.0/8 range; 10.5.2.20 falls in the RFC 1918 10.0.0.0/8 private range instead, which is the actual reason it is unreachable directly.

### 125.

A company wants to filter and log employee web access before it leaves the building, and separately wants to hide an internal application server behind a public hostname. Which kind of proxy fits each need?

- **A.** A reverse proxy fits filtering employee access, since it is the type configured directly by the clients whose traffic needs to be filtered.
- **B.** A forward proxy fits filtering employee access, since it sits in front of clients and is configured by them; a reverse proxy fits hiding the internal server, since it sits in front of servers, invisible to clients.
- **C.** Both needs are met by the same forward proxy, since a forward proxy is capable of hiding an internal server from the public internet as well as filtering client traffic, because a proxy's position in the path rather than which party configures it is what decides its role.
- **D.** Neither need is met by a proxy at all; both require a VPN, since only a VPN is capable of filtering traffic or hiding an internal server from view.

**Answer: B.** A forward proxy sits in front of clients and is configured by them, which is why filtering employee web access, caching outbound requests and enforcing policy are forward-proxy jobs; a reverse proxy sits in front of servers and is invisible to clients, which is why hiding an internal application server behind a public hostname is a reverse-proxy job.

- A is wrong: A forward proxy, not a reverse proxy, is the one configured by clients and positioned in front of them; a reverse proxy sits in front of servers and is invisible to clients instead.
- C is wrong: A forward proxy sits in front of clients and is configured by them; hiding an internal server from the public internet is specifically a reverse-proxy job on the server side instead.
- D is wrong: A VPN provides an encrypted tunnel for network-level access; it does not filter and log web traffic or front an internal application the way a proxy specifically does.

### 126.

A reverse proxy terminates TLS and forwards requests to a backend application over a private address. The backend's access logs show every request coming from the proxy's own IP address rather than the real client's. What explains this, and what fixes it?

- **A.** The backend's own network interface must be misconfigured, since a correctly working reverse proxy is defined to always preserve the original client's IP address in every log entry automatically, so no header configuration is needed on the proxy itself.
- **B.** This only happens because the reverse proxy is also functioning as a load balancer, and load balancers are what specifically cause this address-masking behaviour.
- **C.** Because a proxy terminates and re-issues the connection, the backend sees the proxy as its client; a forwarded header, added by the proxy, is what recovers the original client address for logging or access control.
- **D.** The fix is to switch from a reverse proxy to a forward proxy, since only a forward proxy is capable of preserving the original client's address in backend logs.

**Answer: C.** A reverse proxy is reached because DNS resolves the public name to it, and it forwards to a backend on a private address; because a proxy terminates and re-issues the connection, the backend sees the proxy as its client unless a forwarded header preserves the original address.

- A is wrong: A working reverse proxy does not automatically preserve the original client address in logs; this requires a specific forwarded header to be added, not a fix on the backend's interface.
- B is wrong: The address-masking behaviour follows from being any kind of intermediary that terminates and re-issues the connection, a proxy trait, not specifically from also load-balancing across backends.
- D is wrong: Switching proxy direction does not solve this; a forwarded header, not a change from reverse to forward proxy, is the standard fix that recovers the original client address for the backend.

### 127.

A reverse proxy is added in front of a single backend application server. Later, a second backend is added for capacity, and the proxy begins distributing requests across both, health-checking each. Has the device's function changed, and how should it now be described?

- **A.** Yes — it is now acting as a load balancer as well, since it distributes across several backends and health-checks them, which is a change of purpose, not merely of position.
- **B.** No — it remains simply a reverse proxy throughout, since a reverse proxy is defined to always distribute traffic across multiple backends regardless of how many are configured.
- **C.** Yes — it has become a forward proxy, since adding a second backend changes which side of the connection, client or server, the device is now serving.
- **D.** No, and it also cannot be described as a load balancer, since only a dedicated hardware appliance, not a software reverse proxy, is permitted to hold that label.

**Answer: A.** A reverse proxy is not a load balancer merely by existing — it becomes one when it distributes across several backends and health-checks them, which is exactly the change described: the same box now performs a different function, a change of purpose rather than of physical position.

- B is wrong: A reverse proxy in front of a single backend is not inherently distributing anything; the distribution and health-checking behaviour is specifically what defines a load balancer once a second backend is added.
- C is wrong: The device still sits in front of the servers, serving the service owner's side, exactly as before; adding a backend does not flip it to serving the client side, which is what would make it a forward proxy.
- D is wrong: Load balancing is a functional description, not a hardware requirement; a software reverse proxy that distributes across health-checked backends is genuinely acting as a load balancer.

### 128.

The word "proxy," used without qualification, is ambiguous between forward and reverse. How should a reader decide which one a scenario means?

- **A.** By reading the direction from the scenario itself — "proxy" unqualified usually means forward proxy in a client context and reverse proxy in a server context, so the surrounding description decides it, not the bare word.
- **B.** By assuming "proxy" unqualified always means forward proxy, since that is the only sense the word carries in networking terminology regardless of context.
- **C.** By checking whether TLS is involved, since only a reverse proxy is ever capable of terminating TLS, making that the deciding factor in every scenario.
- **D.** By checking whether the device also performs load balancing, since only a reverse proxy is ever combined with load-balancing functionality in practice.

**Answer: A.** "Proxy" unqualified usually means forward proxy in a client context and reverse proxy in a server context, so the direction has to be read from the scenario rather than the word — filtering employee web access is forward; terminating TLS in front of servers is reverse.

- B is wrong: "Proxy" unqualified is genuinely ambiguous and commonly means reverse proxy in a server context; assuming it is always forward proxy will misread many scenarios.
- C is wrong: TLS termination alone does not decide the direction; a forward proxy can also be involved in TLS-related configurations, and the deciding factor is whose side is being served, not TLS presence.
- D is wrong: Whether load balancing is present does not itself decide forward versus reverse; the deciding factor is which side of the exchange, client or server, the device is described as serving.

### 129.

Two engineering desks need to be added to the same subnet as the rest of engineering, while a separate finance subnet needs to exchange traffic with engineering for the first time. Which device does each task need, and on what basis?

- **A.** Adding desks to the same subnet needs only a switch, which forwards frames by MAC within one broadcast domain; connecting two different subnets needs a router, which forwards packets by IP between them.
- **B.** Both tasks need a router, since only a router is capable of extending a broadcast domain to additional physical ports at all.
- **C.** Both tasks need only a switch, since a switch can join two entirely separate subnets together as easily as it extends one existing subnet.
- **D.** Neither task needs either device; both can be accomplished purely through DHCP server configuration on the existing network.

**Answer: A.** A switch forwards frames within one network by MAC address, at layer 2, and is the right device when devices merely need to join an existing broadcast domain; a router forwards packets between networks by IP address, at layer 3, and is required whenever traffic must cross from one subnet to another.

- B is wrong: Extending a single broadcast domain to more ports is exactly a switch's job; a router does not extend a broadcast domain, it terminates one at its boundary.
- C is wrong: A plain switch keeps every port in the same broadcast domain; it cannot join two different subnets together, which requires a router to forward between them by IP.
- D is wrong: DHCP only hands out addressing configuration to clients; it has no role in extending a broadcast domain or forwarding traffic between two separate subnets.

### 130.

A broadcast frame is sent by a host connected to a plain switch with ten other ports in use. What happens to that frame, and would the outcome differ if a router sat where the switch does instead?

- **A.** The switch floods the broadcast to every other port, since every port on a plain switch shares one broadcast domain; a router in its place would not forward the broadcast at all, terminating it there.
- **B.** The switch forwards the broadcast only to the one port whose MAC learning table entry matches the broadcast address specifically.
- **C.** The switch silently drops the broadcast frame, since flooding traffic to every port is treated as a security risk that switches avoid by default.
- **D.** The outcome would be identical whether a switch or a router occupies that position, since both devices handle broadcast frames the same way by design, broadcast handling being fixed at the frame level rather than per device.

**Answer: A.** Every port on a plain switch is in the same broadcast domain, so a switch floods a frame to every port when the destination is unknown or is the broadcast address; a router does not forward broadcasts at all, because it terminates the broadcast domain rather than extending it.

- B is wrong: The broadcast MAC address, ff:ff:ff:ff:ff:ff, is never learned as belonging to a single port; a switch floods it to every port instead of forwarding it selectively.
- C is wrong: A switch does not drop broadcasts as a security measure by default; flooding to every port on the shared broadcast domain is its ordinary, expected behaviour.
- D is wrong: The outcome is precisely the difference between the two devices: a switch floods a broadcast across its domain while a router terminates the broadcast domain and does not forward it.

### 131.

A DHCP server sits on a different subnet from a group of clients that need to lease addresses from it. Given that DHCP discovery is a broadcast, what is required to make this work?

- **A.** Nothing extra is required, since routers automatically forward DHCP broadcasts to any DHCP server on the network without additional configuration, DHCP being exempt from the usual forwarding rules.
- **B.** A second DHCP server installed locally on the clients' own subnet, since a relay agent cannot forward requests across a router boundary at all.
- **C.** A relay agent on the clients' subnet, since broadcasts do not cross routers unaided and the relay agent forwards the discovery onward to the configured server address.
- **D.** A VLAN trunk between the two subnets, since trunking is the mechanism that allows a broadcast to cross from one subnet to another.

**Answer: C.** Because DHCP discovery and ARP requests are broadcasts, neither crosses a router unaided — DHCP needs a relay agent to serve a subnet whose server sits elsewhere, converting the broadcast into a unicast message the remote server can receive and reply to.

- A is wrong: Routers do not forward broadcasts by default at all; DHCP discovery being a broadcast is exactly why it does not reach a server on another subnet without a relay agent.
- B is wrong: A relay agent exists precisely to forward DHCP requests across a router boundary as unicast; a second local server is an alternative design, not a requirement.
- D is wrong: A VLAN trunk carries traffic for multiple VLANs between switches, but it does not make a router forward a broadcast across separate IP subnets; that still requires a relay agent.

### 132.

A vendor markets a "layer 3 switch." What does that device actually do, and what should not be concluded from the name?

- **A.** It performs layer 2 switching in hardware alongside layer 3 routing in the same box; the name should not be read as evidence that switching itself is a layer 3 function.
- **B.** It performs routing only, and the word "switch" in its name is understood to be a purely historical artefact with no functional meaning today.
- **C.** It performs switching only, with "layer 3" describing merely the number of physical ports the device happens to provide.
- **D.** It performs neither switching nor routing, functioning instead purely as a firewall that happens to be named after both functions for marketing purposes.

**Answer: A.** A "layer 3 switch" is a marketing name for a device that both switches at layer 2 and routes at layer 3; performing routing in hardware inside a switch-shaped box does not make switching itself a layer 3 function, since the two remain distinct operations happening in one device.

- B is wrong: A layer 3 switch genuinely performs layer 2 switching as well as layer 3 routing; the name is not a meaningless historical artefact but describes real dual functionality.
- C is wrong: "Layer 3" refers to the OSI network layer at which the device also routes, not to a port count; the device genuinely adds routing capability, not just extra ports.
- D is wrong: A layer 3 switch genuinely switches and routes; it is not a firewall by function, even though the marketing name references both switching and a layer number.

### 133.

A routing table holds a connected route for 198.51.100.0/24 and a default route for 0.0.0.0/0. Which one is used to reach 198.51.100.7, and why — and which command confirms it without reading the table by eye?

- **A.** The default route wins, since a route explicitly named "default" is always treated as a special case that takes priority over any other route present.
- **B.** Whichever route was added to the table first wins, since kernel routing tables are evaluated strictly in insertion order rather than by prefix specificity, regardless of which distribution or vendor is involved.
- **C.** The /24 route wins by longest prefix match (24 matching bits beats 0), and `ip route get 198.51.100.7` asks the kernel to show the entry it would actually select.
- **D.** The /24 route wins, but only because it happens to be listed first when the table is printed by `ip route` without any arguments.

**Answer: C.** Selection is by longest prefix match: the /24 route, with 24 matching bits, beats the default route's 0 matching bits, regardless of listing order; `ip route get 198.51.100.7` asks the kernel to show which entry it would actually choose, settling any argument.

- A is wrong: The default route has the weakest possible match, 0 bits; it is chosen only when nothing more specific matches, never given special priority over a more specific route.
- B is wrong: Selection is by longest prefix match, not by the order entries were added; a later-added, more specific route still wins over an earlier, less specific one.
- D is wrong: Print order in `ip route` output does not determine which route is selected; the selection is decided by prefix length, and `route get` proves it independently of display order.

### 134.

A network engineer wants exactly one destination address to be redirected through a different next hop, while leaving every other destination unaffected. What technique achieves that without disturbing the rest of the table?

- **A.** Lowering the metric on the existing default route, since adjusting the metric is the only way to influence which destinations use which path.
- **B.** Editing `/etc/hosts` to point that destination's name at a different address, since routing decisions are driven by name resolution rather than by the routing table.
- **C.** Removing the default route entirely, since eliminating it is the only way to force a single destination onto a different next hop.
- **D.** Adding a /32 host route for that one destination; a more specific route always beats the default, so it redirects only that address and nothing else.

**Answer: D.** A more specific route always beats a less specific one, so adding a /32 host route for exactly one destination redirects only that address while leaving every other destination on its existing path — a useful, precise technique that is easy to forget when diagnosing an oddly-behaving single host.

- A is wrong: Adjusting the default route's metric affects every destination that falls back to it, not just the one address in question; it cannot selectively redirect a single destination.
- B is wrong: `/etc/hosts` affects name-to-address resolution, not which next hop is used to reach a given address; routing decisions are made from the routing table, independent of naming.
- C is wrong: Removing the default route would break every destination that relies on it, not just redirect the one address in question, which is a much broader and unwanted change.

### 135.

`route -n` is not installed on a freshly provisioned server, and a technician treats this as evidence the networking stack is broken. Is that the right conclusion?

- **A.** Yes — every properly functioning Linux system ships `route -n` by default, so its absence necessarily indicates a broken or incomplete installation, a belief that persists because it sounds intuitive.
- **B.** No, but only because `route -n` was replaced specifically by `ip neigh`, which is where routing information now lives instead.
- **C.** Yes, and the fix is to reinstall the entire networking stack from scratch, since a missing legacy command usually indicates deeper corruption.
- **D.** No, `route -n` comes from the deprecated net-tools package, which is frequently absent by default; its absence reflects a distribution choice, not a broken system.

**Answer: D.** `route -n` being unavailable is not evidence of a broken system; it is evidence the distribution ships iproute2 only, since net-tools is deprecated and frequently absent — `ip route` remains the fully supported way to inspect the same table.

- A is wrong: Many current distributions ship iproute2 only, deliberately omitting net-tools; that is a normal, supported configuration, not evidence of breakage.
- B is wrong: `ip neigh` shows the neighbour cache, not the routing table; the direct iproute2 replacement for `route -n` is `ip route`, not `ip neigh`.
- C is wrong: A missing legacy net-tools package requires nothing more than installing that specific package if it is genuinely wanted; it implies no corruption of the networking stack at all.

### 136.

What distinguishes a "connected" route in a routing table from every other kind of entry?

- **A.** A connected route is any entry that was added manually with `ip route add`, as opposed to one generated automatically at boot.
- **B.** A connected route has no `via` clause, because the destination is directly on-link through the interface rather than reached through a next-hop router.
- **C.** A connected route is specifically the default route, since it is the one entry that connects the host to every possible destination.
- **D.** A connected route is one where the destination and the next hop share the exact same IP address, rather than one being derived from a subnet in most textbooks and quick references.

**Answer: B.** A typical table holds one connected route per configured subnet, with no `via` clause because the destination is on-link, plus the default route for everything else — the difference between "directly connected" and "via a router" is exactly the distinction most connectivity questions turn on.

- A is wrong: How a route was added — manually or automatically — is unrelated to whether it is "connected"; the defining trait is the absence of a next hop for an on-link destination.
- C is wrong: The default route is a distinct entry, 0.0.0.0/0, matching everything with no specificity; a connected route is the opposite — a specific, directly reachable subnet.
- D is wrong: A connected route has no next hop at all to compare against the destination; it is defined by the absence of a `via` clause, not by a coincidence of matching addresses.

### 137.

A service is reported as "running but nothing can connect." Following the standard diagnostic order, what is checked first with `ss -tulpn`, and what does an absent port versus a present-but-loopback-bound port each indicate?

- **A.** First check the firewall policy on the host, since `ss -tulpn` output is defined to be meaningless until the firewall configuration has already been reviewed and ruled out as the source of the problem.
- **B.** First check the client's own routing table, since a client-side fault is always the explanation whenever a server-side `ss -tulpn` check would otherwise be needed to confirm what is listening.
- **C.** First check whether the expected port appears at all: absent means the process is not actually listening, a service problem no firewall change will fix; present but bound to `127.0.0.1` means it is up but unreachable from any other host — the fault, without touching the network further.
- **D.** First check whether `-p` was run with root privilege, since without it `ss -tulpn` is defined to report every socket as entirely absent from its output rather than merely missing the owning process.

**Answer: C.** Start on the server, not the client: if the expected port is absent from `ss -tulpn`, the service is not listening and no firewall change will help; if it is present, read the Local Address column, since `127.0.0.1` means loopback only, the service up but unreachable from any other host, and that is the fault.

- A is wrong: Reading firewall rules before checking whether the service is even listening is how administrators spend time investigating a firewall that was never involved; `ss -tulpn` on the server is the correct starting point.
- B is wrong: "Running but nothing can connect" is a server-side symptom description that `ss -tulpn` on the server itself is specifically designed to diagnose first, before any client-side investigation.
- D is wrong: Without root, only the process-name column is blanked for sockets owned by other users; the sockets themselves, including the port and address, still appear in the output.

### 138.

An operator runs `ss -tulpn` without root privilege and sees a listening socket with a blank process-name column. They conclude nothing is actually listening on that port. Is that conclusion supported?

- **A.** Yes — a blank process-name column in `ss -tulpn` output is defined to always mean the corresponding socket entry itself does not actually exist.
- **B.** No, but only because `-n` was omitted, since adding `-n` is what causes previously hidden sockets owned by other users to appear in the output.
- **C.** No — without root, the `-p` column is blank for processes the operator does not own, which looks like nothing is listening if read carelessly, but the socket itself is genuinely present and listening.
- **D.** Yes, but only because `netstat`, not `ss`, should have been used instead, since `netstat` is defined to always show process names without requiring elevated privilege, since its process column is populated from the socket table itself rather than from /proc.

**Answer: C.** Without root, the `-p` column is blank for processes you do not own, which looks like "nothing is listening" if read carelessly — re-running with elevated privilege before concluding the process column is genuinely empty is the correct next step.

- A is wrong: A blank process-name column reflects a privilege limitation on process attribution, not the absence of the socket; the socket entry, including its port and address, is still shown.
- B is wrong: `-n` only controls whether ports display numerically instead of as translated service names; it has no effect on whether other users' process names or sockets are visible.
- D is wrong: `netstat` has the same privilege requirement as `ss` for attributing sockets to other users' processes; switching tools would not change the described blank-column behaviour.

### 139.

A colleague reaches for `netstat -tulpn` on a freshly built server and the command is not found, while `ss -tulpn` works fine. Why the difference, and which tool should be relied on going forward?

- **A.** `netstat` and `ss` are functionally identical, so the missing-command result must indicate a broken installation of the iproute2 package rather than a packaging difference, since both commands are shipped by the same iproute2 package on every current distribution.
- **B.** `netstat` requires root privilege just to be found by the shell, while `ss` does not, which fully explains the missing-command result observed here.
- **C.** `netstat` only works over IPv6 while `ss` only works over IPv4, so the correct fix is to use `netstat -6` instead of investigating the missing-command result further.
- **D.** `netstat`, from net-tools, is not installed by default on many current distributions, while `ss`, from iproute2, is the current, supported tool that should be relied on going forward.

**Answer: D.** `ss` is the current tool, from iproute2, while `netstat`, from net-tools, is the legacy one and is often not installed — assuming `netstat` is present is a documented trap, and `ss` is markedly faster on hosts with many connections besides.

- A is wrong: They are not from the same package; `netstat`'s absence reflects that net-tools is often not installed by default, not a fault in the working iproute2 installation that provides `ss`.
- B is wrong: Privilege level does not affect whether a shell can locate an installed command; `netstat`'s absence here is a packaging issue, net-tools not being installed, not a privilege issue.
- C is wrong: Neither tool is restricted to a single address family; the actual explanation for the missing command is that net-tools, which provides `netstat`, is often not installed on current distributions.

### 140.

A busy server shows a short listening-socket list under `ss -tulpn -l`, and a manager questions whether the server is actually handling much traffic given how short the list looks. What is being misread?

- **A.** `-l` excludes established connections by design, so a short listening list says nothing about traffic volume; `ss -t state established` is the command that would show the (likely much longer) list of active client connections.
- **B.** The listening list length is defined to scale directly with total traffic volume, so a short list genuinely does prove the server is not handling much load.
- **C.** The manager should instead check the routing table's size, since a larger routing table is what actually correlates with how much traffic a server can be handling.
- **D.** The manager should instead check `ip link` for interface error counters, since those, not the socket table, are what actually indicate real traffic volume on a busy server.

**Answer: A.** `-l` excludes established connections by design, so a busy server can show a short listening list and still be handling thousands of conversations — `ss -t state established` is the complementary command that reveals the actual volume of active client connections.

- B is wrong: The number of listening sockets reflects how many distinct services are configured to accept connections, not how much traffic each one is currently handling; the two are unrelated.
- C is wrong: Routing table size reflects how many destinations a host knows how to reach, not how much traffic it is currently handling; it has no bearing on the question being asked here.
- D is wrong: Interface error counters reflect link-layer problems, not overall traffic volume; established TCP connections, visible via `ss -t state established`, are the direct evidence of client activity being asked about here.

### 141.

An administrator generates a key pair with `ssh-keygen` and then needs to enable key-based login to a remote server. Which file gets copied to the server, and with which command?

- **A.** The private key file — using `scp`, so that the server holds the same secret material the client uses to authenticate itself.
- **B.** Only the public key file — using `ssh-copy-id`, which logs in with an existing method and appends the public key to the remote `~/.ssh/authorized_keys`.
- **C.** Both the public and private key files — using `sftp`, so the server has a complete, matching copy of the client's key pair on file and can verify a login against either half of it.
- **D.** Neither key file — `ssh-copy-id` instead generates a brand-new key pair directly on the remote server during the copy process.

**Answer: B.** `ssh-keygen` generates a key pair, writing the private key to a file and the public key to a matching `.pub` file, and `ssh-copy-id` logs in using an existing method and appends that public key to the remote `~/.ssh/authorized_keys` — only the public half ever leaves the client.

- A is wrong: The private key must never leave the client; copying it to the server undermines the entire point of key-based authentication, and only the public key is meant to be shared.
- C is wrong: The server needs only the public key to verify a login; sending the private key as well defeats the security model entirely, regardless of which transfer tool is used.
- D is wrong: `ssh-copy-id` installs an existing local public key on the remote host; it does not generate a new key pair on the server as part of that process.

### 142.

A user with correctly configured SSH keys is unexpectedly prompted for a password every time they connect, though the same key worked on another server. Their home directory on this server is world-writable. What is the likely cause?

- **A.** The public key was never actually copied to this server at all, since a working key on one server has no bearing on whether it was installed on another.
- **B.** The server's host key has changed since the last connection, which is what triggers SSH to silently fall back to password authentication instead of raising a warning.
- **C.** SSH refuses key authentication silently if permissions are too open — `~/.ssh` should be 700 and `authorized_keys` 600, and a world-writable home directory alone can cause a fall back to password prompts.
- **D.** The remote server is using the legacy SCP protocol instead of SFTP underneath, which is what causes key authentication to be silently skipped for logins.

**Answer: C.** SSH refuses key authentication silently if permissions are too open: `~/.ssh` should be 700 and `authorized_keys` 600, and a world-writable home directory alone can cause a fall back to password prompts, which is a frequent and confusing source of 'permission denied' or unexpected password-prompt reports.

- A is wrong: This is possible in general, but the scenario specifically flags a world-writable home directory, which is the documented, more likely cause of a silent fall back to password prompts.
- B is wrong: A changed host key produces a loud, explicit warning about the change, not a silent fall back to password prompts; it is a separate class of event from the permission issue described.
- D is wrong: Whether `scp` uses the legacy SCP protocol or SFTP underneath affects file transfer only, not interactive login authentication, which is governed separately by key and permission checks.

### 143.

A user runs `scp -p 2222 report.tar.gz user@web01:/tmp/` against a host whose SSH daemon listens on port 2222. Rather than transferring, `scp` reports `stat local "2222": No such file or directory`. What is wrong, and what should they run instead?

- **A.** The remote path is missing a second colon, and the corrected command needs `user@web01::/tmp/` with two colons before the destination path.
- **B.** `scp` does not support a port option at all, and the fix is to first open an `ssh` session on port 2222 and then transfer the file manually from within that already-authenticated remote shell session.
- **C.** `scp` spells the port flag with a capital `-P`, not lowercase `-p`; lowercase `-p` is a valid flag that preserves times and mode bits, so `2222` was parsed as a source filename. The corrected command is `scp -P 2222 report.tar.gz user@web01:/tmp/`.
- **D.** The file name must be quoted in double quotes for `scp` to accept it, and the reported error is a misleading way of flagging that quoting problem, since `scp` reports an unquoted operand as a missing local file rather than naming the quoting fault itself.

**Answer: C.** Using `-p` for scp is a frequent and confusing difference: `ssh` uses `-p PORT` for a non-default port, while `scp` spells the same option with a capital `-P`, and mixing the two up produces exactly this kind of unrecognised-option error.

- A is wrong: `scp`'s remote path syntax uses a single colon between the host and the path; the actual error here is the port flag's case, which pushed `2222` into the source-file list, not the number of colons used.
- B is wrong: `scp` does support specifying a nonstandard port; it simply uses the capital `-P` flag rather than lowercase `-p`, so a separate manual `ssh` session is not required.
- D is wrong: Quoting only matters when a filename contains spaces or shell metacharacters, and `report.tar.gz` contains neither;

### 144.

What is the practical difference between SFTP and FTPS, given that both names sound like secured variants of FTP?

- **A.** SFTP and FTPS are two names for the exact same protocol, differing only in which vendor's client software happens to use which term.
- **B.** SFTP is FTP wrapped in TLS, while FTPS is the SSH-based subsystem that rides on port 22 alongside ordinary SSH traffic.
- **C.** SFTP and FTPS differ only in that SFTP is used for uploads while FTPS is used exclusively for downloads, both otherwise sharing an identical underlying transport.
- **D.** SFTP rides SSH on port 22, as an SSH subsystem entirely unrelated to FTP or FTPS; FTPS is the original FTP protocol wrapped in TLS instead.

**Answer: D.** SFTP and FTPS are different things despite the similar names: SFTP rides SSH on port 22, unrelated to FTP or FTPS, while FTPS is the original FTP protocol wrapped in TLS — a distinction worth holding onto given how often the two are assumed to be the same.

- A is wrong: They are structurally different protocols — SFTP is an SSH subsystem on port 22, FTPS is FTP wrapped in TLS on FTP's own ports — not two names for identical technology.
- B is wrong: This swaps the two definitions: SFTP is the SSH subsystem on port 22, and FTPS is the one that wraps FTP in TLS, not the other way around.
- C is wrong: Neither protocol is restricted to uploads or downloads only; both support bidirectional transfer, and the actual difference is their underlying transport mechanism, SSH versus TLS-wrapped FTP.

### 145.

A file server, a print queue and an ordinary laptop are being provisioned. The file server needs a stable address referenced by an A record; the laptop just needs to get online. Which addressing choice fits each, and on what basis?

- **A.** The server gets a static address or a DHCP reservation, since anything referenced by name needs stability; the laptop gets a plain dynamic DHCP address, since managing hundreds of hand-written client configurations does not scale.
- **B.** Both the server and the laptop should get plain dynamic DHCP addresses, since DHCP reservations do not exist as an option separate from an ordinary dynamic lease.
- **C.** Both the server and the laptop should get static addresses configured by hand, since any device an administrator provisions deliberately is assumed to never depend on DHCP.
- **D.** The choice should instead be based on which device was purchased most recently, since older hardware on the network is generally assumed to need static addressing regardless of its role, which feels reasonable on first encounter in most textbooks and quick references.

**Answer: A.** Static addressing (or a DHCP reservation) suits devices that must stay stable because something references them by name or fixed configuration, such as servers and gateways; ordinary clients are given dynamic addresses because hand-writing hundreds of configurations does not scale.

- B is wrong: A DHCP reservation is a distinct, real option — binding one MAC to one fixed address — that gives a server-class device stability while remaining a DHCP client.
- C is wrong: Managing hundreds of hand-written client configurations does not scale; ordinary clients are given dynamic addresses precisely to avoid that burden.
- D is wrong: The addressing choice is driven by whether stability is required by name-based references, not by the age or purchase date of the hardware involved.

### 146.

An administrator statically assigns 192.168.1.50 to a new printer, unaware that the DHCP server's pool for that subnet is 192.168.1.20 through 192.168.1.100. What is the likely consequence, and why?

- **A.** No conflict is possible, because a statically configured address always takes precedence over anything the DHCP server might later offer by default on most systems administrators encounter.
- **B.** A duplicate-address conflict is likely once the DHCP server eventually leases 192.168.1.50 to a client, since the static address sits inside the dynamic pool's range.
- **C.** No conflict is possible, because printers are automatically excluded from DHCP pools by every major DHCP server implementation.
- **D.** A conflict is likely, but only because printers are unable to hold a static IPv4 address under any circumstances.

**Answer: B.** Setting a static address inside a DHCP pool's range invites a duplicate-address conflict when the server later leases that same address to someone else, which is exactly why reservations — which exclude the address from the dynamic pool — exist as the safer alternative.

- A is wrong: A DHCP server has no visibility into addresses configured statically outside its own pool bookkeeping, so precedence does not prevent it from later offering the same address.
- C is wrong: DHCP servers have no automatic device-type exclusion; a pool exclusion has to be configured explicitly, which is exactly what a reservation is for.
- D is wrong: Printers are perfectly capable of holding a static address; the conflict arises from the address falling inside the active DHCP pool range, not from any printer-specific limitation.

### 147.

An administrator runs `ip addr add 10.0.5.100/24 dev enp0s3` on a server and calls the address "now static." Is that terminology accurate?

- **A.** Yes — any address set with a manual command like `ip addr add`, rather than obtained automatically, counts as static by definition.
- **B.** No, "static" means the configuration is written into the host's persistent network configuration; `ip addr add` is a temporary runtime change that disappears at the next reboot or reconfiguration.
- **C.** No, but only because the address 10.0.5.100 happens to fall inside a range reserved for dynamic addressing on this network.
- **D.** Yes, and the address will in fact remain assigned across every future reboot exactly as a genuinely static address would.

**Answer: B.** A static address is written into the distribution's persistent network configuration and reapplied at boot; `ip addr add` only changes the running kernel state, so calling that a "static" address is a mislabel that a question about permanence is not answered by.

- A is wrong: 'Static' specifically means the configuration is written into the persistent network configuration and applied at boot; a bare runtime `ip addr add` command does neither.
- C is wrong: Whether an address falls in a particular numeric range has no bearing on whether it is static or dynamic; that distinction is about how and where the configuration is stored.
- D is wrong: A runtime `ip addr add` command is lost on reboot precisely because it writes nothing to disk, unlike a genuinely static address configured in the persistent network configuration.

### 148.

A dynamically leased address has not changed in over six months. A junior admin argues it must actually be static, since 'static' means the address never changes. Is that reasoning sound?

- **A.** Yes — any address that has been observed to stay constant for a long enough period should be reclassified as static.
- **B.** No, but only because the address must actually be a DHCP reservation rather than either a static or an ordinary dynamic address.
- **C.** Yes, since only a DHCP server outage could explain an address remaining the same for that long, which effectively makes it static across virtually every environment of this kind, a conclusion that seems to follow from everyday experience.
- **D.** No: a dynamic address can remain identical for a long time and still be dynamic; the distinction is about who owns the configuration, not whether the value happens to stay constant.

**Answer: D.** A dynamic address can remain identical for months through ordinary lease renewal and still be dynamic, because the distinction is about whether the configuration is written on the host (static) or held and renewable by the server (dynamic), not about whether the value has changed recently.

- A is wrong: There is no duration after which a dynamically leased address becomes static; classification depends on where the configuration is held, not on observed stability over time.
- B is wrong: The scenario describes an ordinary dynamic lease, not a reservation; nothing in the description implies a MAC-to-address binding exists on the server.
- C is wrong: A stable lease renewal, not a server outage, is the ordinary explanation for a long-unchanged dynamic address, and neither explanation reclassifies it as static.

### 149.

A firewall rule needs to be written in dotted-decimal notation, but `ip addr` reports the host as `10.20.30.5/26`. What is the equivalent dotted-decimal mask?

- **A.** 255.255.255.128 — since /26 is one step past /25 in the sequence, the mask must also be one step past 128 in that octet.
- **B.** 255.255.252.0 — the prefix number 26 sets the network boundary inside the third octet, leaving the whole last octet free for host addressing.
- **C.** A /26 leaves 6 host bits, so the mask sets the top two bits of the last octet, giving 192 there: 255.255.255.192.
- **D.** 255.255.255.224 — the mask value that corresponds to a /27 prefix rather than the /26 actually shown.

**Answer: C.** A /26 prefix sets 26 leading bits to one, which in dotted-decimal is 255.255.255.192: the first three octets are fully ones, and the last octet has its two most significant bits set, matching the CIDR and dotted-decimal reference table exactly.

- A is wrong: 255.255.255.128 is the dotted-decimal form of /25, not /26; the last-octet value at /26 is 192, from two set bits rather than one.
- B is wrong: The prefix length counts leading one-bits across the whole 32-bit address, not a value substituted into a single octet in isolation.
- D is wrong: 224 in the last octet corresponds to /27, one bit more specific than the /26 given; the extra host bit changes the mask value.

### 150.

Two engineers argue over whether a /26 network is bigger or smaller than a /24 network. Who is right, and by what factor?

- **A.** A /26 is larger — a longer prefix number means more addresses are set aside for that network.
- **B.** A /26 is smaller, a quarter the size of a /24, because each additional bit in the prefix halves the number of addresses in the block.
- **C.** They are the same size — the prefix length only shifts which addresses the block occupies, not how many it contains.
- **D.** A /26 is smaller, but by a factor of two rather than four, since the whole difference in prefix length halves the block exactly once, leaving 128 addresses against a /24's 256.

**Answer: B.** A larger prefix number always means a smaller network: /26 sets aside 6 host bits for 64 addresses while /24 sets aside 8 for 256, so /26 is a quarter the size of /24, not four times it.

- A is wrong: A larger prefix number means more bits are claimed by the network portion, leaving fewer host bits and therefore a smaller, not larger, network.
- C is wrong: The prefix length directly determines how many host bits remain, and therefore how many addresses the block contains; /26 and /24 do not hold the same count.
- D is wrong: Each additional bit of prefix halves the address count, so two extra bits of prefix (24 to 26) is a factor of four, not two.

### 151.

A /29 block is allocated to a small office. Using the usable-hosts formula 2^(32-prefix) - 2, how many usable host addresses does it provide?

- **A.** Eight — a /29 leaves 3 host bits, and all eight of the resulting addresses can be handed out to hosts.
- **B.** Fourteen — a /29 leaves 4 host bits for 16 total addresses, of which 14 remain after the two reserved ones, regardless of which distribution or vendor is involved.
- **C.** Six, because /29 leaves 3 host bits, giving 8 total addresses, minus the network and broadcast addresses that cannot be assigned to a host.
- **D.** Four — half of every block is held back for the network, the broadcast and future growth, leaving four assignable.

**Answer: C.** A /29 leaves 3 host bits, giving 2^3 = 8 total addresses; subtracting the all-zero network address and the all-one broadcast address, which can never be assigned to a host, leaves 6 usable addresses, matching the reference table.

- A is wrong: Eight is the total block size before subtracting the reserved network and broadcast addresses; the usable count is two fewer than that.
- B is wrong: /28 leaves 4 host bits and 14 usable hosts; /29 leaves only 3 host bits, which yields 6 usable hosts, not 14.
- D is wrong: Exactly two addresses are reserved regardless of block size — the all-zero network address and the all-one broadcast address — not half of the block.

### 152.

A design document proposes a /31 point-to-point link between two routers and states that, like every other prefix, it must reserve a network address and a broadcast address, leaving zero usable hosts. Is that correct?

- **A.** Yes — the subtract-two arithmetic applies at every prefix length without exception, so a /31 leaves no usable host address at all and the design is unworkable.
- **B.** No, but only because /31 is not a legal prefix length at all and the design document should use /30 instead.
- **C.** Yes, and the same reserved-address rule applies to /32, which likewise leaves no usable host address behind.
- **D.** No. RFC 3021 defines /31 as a special case with no reserved network or broadcast address, so both addresses in the two-address block are usable.

**Answer: D.** RFC 3021 defines /31 as a two-address point-to-point link with no network or broadcast address reserved, an explicit exception to the general rule that the all-zero and all-one addresses in a block are unusable.

- A is wrong: RFC 3021 makes /31 an explicit exception to the general subtract-two rule precisely because a two-address block cannot spare either address for reservation.
- B is wrong: /31 is a legal, RFC-defined prefix length for point-to-point links; the document's error is the reserved-address assumption, not the prefix length itself.
- C is wrong: /32 is a single-host route with no block to divide at all, a different case from the two-address /31 exception, not the same exception applied twice.

### 153.

Name the four layers of the TCP/IP model in order, from the physical segment to the software a user interacts with.

- **A.** Physical, internet, session, application.
- **B.** Link, network, presentation, application.
- **C.** Link, internet, transport, application.
- **D.** Data link, transport, internet, application.

**Answer: C.** The TCP/IP model has four layers — link, internet, transport, application — and every host on the internet genuinely implements these; nothing implements OSI's seven layers directly.

- A is wrong: 'Physical' and 'session' are OSI layer names, not TCP/IP layers; the TCP/IP model has no separate session layer at all.
- B is wrong: 'Network' and 'presentation' belong to OSI's seven-layer vocabulary, not to the four TCP/IP layers.
- D is wrong: The transport and internet layers are listed in the wrong order relative to how a packet actually travels outward from a host.

### 154.

A question asks which TCP/IP layer ARP output is used at. Given that ARP carries an internet-layer address inside a link-layer frame, what is the exam-safe placement?

- **A.** ARP is purely an application-layer protocol, since it runs as a background service the way a name resolver like DNS does in most textbooks and quick references.
- **B.** Because ARP joins layer 3 addressing to layer 2 delivery, it sits awkwardly across the link/internet boundary rather than cleanly inside one layer.
- **C.** ARP belongs entirely to the transport layer, because it resolves an identifier the way a port number does.
- **D.** ARP sits entirely within the internet layer, with no link-layer role at all.

**Answer: B.** Sources place ARP at 'layer 2.5' or at either side of the link/internet boundary because it carries an internet-layer address in a link-layer frame; the safe exam answer is that it joins layer 3 addressing to layer 2 delivery rather than sitting cleanly in one layer.

- A is wrong: ARP resolves addresses for local delivery and has no relationship to the application layer at all; DNS is the application-layer name resolver, not ARP.
- C is wrong: ARP resolves addresses, not ports, and has no relationship to TCP or UDP, which are what actually occupy the transport layer.
- D is wrong: ARP requests and replies are carried as raw link-layer frames, not as internet-layer packets, so it cannot be placed entirely at one layer.

### 155.

A trainee claims the OSI and TCP/IP models map one-to-one, seven layers to four, with each OSI layer corresponding to exactly one TCP/IP layer. What is wrong with that claim?

- **A.** The claim is correct, since every OSI layer number simply shifts down by one fixed offset to arrive at its corresponding TCP/IP layer number, so OSI's session layer maps onto TCP/IP's transport layer.
- **B.** The mapping fails only because TCP/IP defines one extra layer that OSI entirely lacks, not because any OSI layers fold together.
- **C.** The mapping fails because TCP/IP layers are numbered in the reverse order compared to how OSI numbers its own seven layers.
- **D.** OSI layers 1 and 2 fold into the single link layer, and OSI layers 5, 6 and 7 fold into the single application layer, so the mapping is many-to-one, not one-to-one.

**Answer: D.** OSI's seven layers do not map one-to-one onto TCP/IP's four: layers 1-2 collapse into the link layer and layers 5-7 collapse into the application layer, so any claim of a clean seven-to-four correspondence is wrong by construction.

- A is wrong: There is no fixed numeric offset; the two models fold multiple OSI layers into single TCP/IP layers rather than shifting numbers uniformly.
- B is wrong: TCP/IP has fewer layers than OSI, not more, and the discrepancy is because layers fold together rather than because one model has an extra layer.
- C is wrong: Both models count upward from the physical medium; the mismatch is in layer count and grouping, not in numbering direction.

### 156.

A UDP-based voice application is described by a colleague as "not really using the TCP/IP stack" because it avoids TCP entirely. Is that accurate?

- **A.** No. The model is named after two of its protocols, but UDP and ICMP are part of the same TCP/IP stack, so a UDP application still uses it.
- **B.** Yes — any protocol other than TCP itself falls entirely outside the boundaries of the TCP/IP model by definition in every configuration seen in practice.
- **C.** Yes — UDP applications instead run over the seven-layer OSI model exclusively, bypassing TCP/IP entirely.
- **D.** No, but only because ICMP silently converts UDP traffic into TCP traffic at the internet layer.

**Answer: A.** The TCP/IP model is named after two of its protocols, but as a model it includes UDP and ICMP as well; any protocol built on this four-layer stack, TCP or not, is still using it.

- B is wrong: The model's name references two protocols for convenience, but UDP and ICMP are defined within the same stack, not excluded from it.
- C is wrong: No host runs OSI as a deployed stack; a UDP application still runs over the same four-layer TCP/IP stack as any TCP application.
- D is wrong: ICMP is a control and error-reporting protocol; it does not convert one transport protocol into another, and no such conversion occurs.

### 157.

A connection attempt to a service hangs with no response at all, while a connection to a different port on the same host is refused instantly. Reading the handshake behaviour, what does each symptom suggest?

- **A.** Both symptoms mean the same thing, that the host is unreachable, since a hang and an instant refusal are simply two presentations of the identical block, selected by how long the client's own connect timeout has been configured rather than by anything the remote host sent back.
- **B.** The hang means a SYN went out and got nothing back, a silent drop usually caused by a firewall; the instant refusal means a SYN reached a live host that answered with RST because nothing was listening on that port.
- **C.** The hang means the TLS handshake failed after the connection was already established, while the instant refusal means the three-way handshake itself failed.
- **D.** The hang means the destination host actively chose UDP instead of TCP for that port, while the instant refusal confirms it is genuinely using TCP.

**Answer: B.** A connection that hangs sent a SYN and got nothing back, a silent drop usually caused by a firewall, while a connection refused instantly got an RST, meaning the packet reached a live host with nothing listening on that port — the handshake is what makes these two TCP failure modes readable and distinct.

- A is wrong: A refusal and a silent drop are different, distinguishable outcomes: a refusal means a live host answered with RST, while a hang means nothing answered at all, usually a firewall drop; the client's connect timeout changes how long the hang lasts, not whether an RST arrives.
- C is wrong: TLS negotiation happens after the three-way handshake completes; a hang before any TCP-level response at all is not a TLS failure, and an instant RST is a TCP-level response, not a TLS one.
- D is wrong: A host does not silently substitute UDP for a TCP connection attempt; the hang and refusal described are both TCP-level handshake behaviours, not a protocol switch.

### 158.

A monitoring tool reports that "the handshake failed" for a UDP-based service. Is that a meaningful statement?

- **A.** Yes — every transport protocol, TCP and UDP alike, performs an equivalent handshake before any data is exchanged between two hosts.
- **B.** Yes, but only because the monitoring tool is referring to the TLS handshake layered on top of the UDP service rather than to the TCP handshake.
- **C.** No, but only because the report should instead say "the three-way handshake succeeded but the fourth confirmation message was lost" for a UDP service, since UDP completes its own setup exchange in four messages rather than three.
- **D.** No. UDP has no handshake at all, so "the handshake failed" can never accurately describe a UDP service; the report itself reflects a misunderstanding of the transport in use.

**Answer: D.** UDP has no handshake at all, so "the handshake failed" can never describe a UDP service — the three-way exchange of SYN, SYN-ACK and ACK is specifically how a TCP connection opens, with nothing equivalent in UDP's connectionless design.

- A is wrong: UDP performs no handshake of any kind; only TCP establishes a connection through the three-way SYN, SYN-ACK, ACK exchange before data flows.
- B is wrong: Not every UDP-based service uses TLS, and even where a UDP service does use a security layer such as DTLS, that is a separate concern from whether "the handshake failed" is a meaningful TCP-style statement.
- C is wrong: TCP's handshake is only three messages, not four, and none of it applies to UDP at all; there is no fourth confirmation message in either protocol's connection setup.

### 159.

Why does a TCP connection open with three messages rather than four, given that both sides must exchange sequence numbers?

- **A.** Three messages suffice because only the client needs to choose an initial sequence number; the server simply echoes the client's number back unchanged in its SYN-ACK and never announces a sequence number of its own.
- **B.** The server's single SYN-ACK does two jobs at once, acknowledging the client's SYN and sending its own SYN, which is why three messages suffice rather than four.
- **C.** Three messages suffice because TCP omits acknowledging the server's own SYN entirely, trusting the connection to be open once the client's ACK is sent.
- **D.** Three messages suffice because closing a TCP connection also uses only three messages, and RFC 9293 requires the two counts to match.

**Answer: B.** Each side chooses an initial sequence number and announces it in its SYN, and the peer acknowledges it by returning that number plus one; the server's single SYN-ACK does both jobs at once, acknowledging the client and sending its own SYN, which is why three messages suffice rather than four.

- A is wrong: Each side chooses its own initial sequence number independently, including the server; the three-message count comes from combining two of the four logical steps, not from only one side needing a number.
- C is wrong: The client's final ACK specifically acknowledges the server's SYN; nothing is omitted, it is simply combined with the server's own SYN into a single SYN-ACK message rather than sent separately.
- D is wrong: Closing a TCP connection is a separate, usually four-message exchange of FIN and ACK in each direction, not a three-message process matched to the opening handshake's count.

### 160.

A packet capture shows a connection ending with FIN and ACK exchanges in both directions, after which the initiating side holds the connection open in a particular state for a period rather than releasing it immediately. What state is that, and why does it exist?

- **A.** SYN-RECV — a half-open state indicating the connection never fully completed its original handshake before being closed.
- **B.** LISTEN — the socket returns to a listening state so it can immediately accept a new connection from the same peer.
- **C.** ESTABLISHED — the connection remains fully active for a period after the FIN and ACK exchange in case either side wants to resume sending data within the same sequence-number space.
- **D.** TIME_WAIT, held for twice the maximum segment lifetime so that delayed segments from the old connection cannot be mistaken for part of a new one.

**Answer: D.** Closing is a separate, usually four-message exchange of FIN and ACK in each direction, after which the initiating side holds the connection in TIME_WAIT for twice the maximum segment lifetime so that delayed segments cannot be mistaken for part of a new connection — `tcpdump`'s `[S]`, `[S.]` and `[.]` notations mark the opening SYN, SYN-ACK and ACK that precede all of this.

- A is wrong: SYN-RECV describes an incomplete opening handshake, not a state following a completed close with FIN and ACK exchanges in both directions.
- B is wrong: LISTEN describes a server socket waiting for new incoming connections generally, not the specific state the initiating side of a just-closed connection holds afterward.
- C is wrong: ESTABLISHED describes an active, ongoing conversation; a connection that has completed FIN and ACK exchanges in both directions is closing, not remaining active for resumed data.

### 161.

A DNS query and a large file download both need to leave a host. One typically rides UDP, the other TCP. Which is which, and why does the choice matter for each?

- **A.** The DNS query typically rides TCP for guaranteed delivery of the answer, while the file download rides UDP so that large files transfer with the least possible overhead, since UDP's lack of per-segment acknowledgement removes the bulk of the transfer's protocol work.
- **B.** The DNS query typically rides UDP, since a retransmitted answer arriving late is worse than useless; the file download rides TCP, since a missing byte in the middle of a file matters more than a millisecond of delay.
- **C.** Both typically ride UDP, since neither a name lookup nor a large transfer benefits meaningfully from TCP's ordering and retransmission guarantees.
- **D.** Both typically ride TCP, since every application-layer protocol on a modern network is now built exclusively on top of TCP rather than UDP.

**Answer: B.** TCP is connection-oriented, numbering and acknowledging every byte and retransmitting what is lost, which bulk transfer needs; UDP is connectionless, with no handshake, acknowledgement or retransmission, which suits DNS queries and other cases where speed matters more than a guarantee.

- A is wrong: This reverses the usual choice: DNS queries commonly use UDP for low overhead, and bulk file transfer uses TCP because missing or out-of-order bytes must be corrected.
- C is wrong: A large file transfer specifically benefits from TCP's guarantees, since a missing or reordered byte would corrupt the result; only the DNS query commonly favours UDP.
- D is wrong: UDP remains in wide use for exactly the applications where low overhead matters more than guaranteed delivery, DNS queries among them; not every protocol has moved to TCP.

### 162.

A firewall rule opens UDP port 53 for DNS but leaves TCP port 53 closed. Ordinary DNS queries succeed, but occasional large responses fail. Why does opening one protocol's port 53 not cover the other?

- **A.** A service is identified by protocol and port together (TCP 53 and UDP 53 are different sockets), so an unopened TCP 53 leaves large responses, which fall back to TCP, blocked while ordinary UDP queries keep working.
- **B.** Opening UDP port 53 always opens TCP port 53 automatically as well, so the described failure must actually be caused by something unrelated to the firewall, most likely the resolver discarding answers that exceed its own configured response-size limit.
- **C.** DNS never uses TCP under any circumstances, so a closed TCP port 53 cannot be the explanation for the large-response failures being reported.
- **D.** The failure is unrelated to the firewall and is instead explained by the resolver's TTL settings being configured too aggressively for large zones.

**Answer: A.** A service is identified by protocol and port together: TCP 53 and UDP 53 are different sockets, and a firewall rule that opens one leaves the other closed, which is exactly why a DNS server reachable for ordinary queries can still fail on the large responses that fall back to TCP.

- B is wrong: A firewall rule for one protocol's port does not automatically open the same port number for the other protocol; TCP 53 and UDP 53 are genuinely separate sockets requiring separate rules, and no resolver response-size setting produces the described asymmetry between small and large answers.
- C is wrong: TCP port 53 is used when a response is too large for the UDP path or for zone transfers, so DNS genuinely does use TCP in specific, expected cases.
- D is wrong: TTL governs how long an answer is cached, not whether a large response can be delivered at all; the described symptom is explained by the closed TCP port, not by caching behaviour.

### 163.

When higher-level tools such as `ss`, `dig` and `curl` have not explained a behaviour, what does `tcpdump` add, and what does it require to run?

- **A.** It changes the running configuration of the interface it captures on, which is why it requires elevated privilege well beyond what mere passive observation of traffic would normally need.
- **B.** It resolves names the same way `dig` does, adding DNS-specific detail that `ss` and `curl` are not designed to show at all.
- **C.** It requires no special privilege at all, running identically for any unprivileged user exactly as `ss` and `curl` do.
- **D.** It captures the actual packets crossing an interface for direct inspection, selected with `tcpdump -i` to choose the interface, and it requires elevated privilege — it only observes traffic and never changes configuration.

**Answer: D.** tcpdump captures packets on an interface for inspection when higher-level tools do not explain the behaviour — `tcpdump -i` selects the interface, it needs elevated privilege to capture raw traffic, and it observes traffic without ever changing configuration, which is enough recognition for LFCA.

- A is wrong: tcpdump is purely observational; it never changes configuration, and its privilege requirement is about accessing raw packet capture, not about making any configuration change.
- B is wrong: tcpdump captures raw packets on the wire; it is not a DNS query tool and does not add DNS-specific resolution detail the way `dig` does.
- C is wrong: Capturing raw packets from an interface does require elevated privilege on Linux, unlike ordinary use of `ss` or `curl`, which is part of what makes tcpdump the more specialised, last-resort tool.

### 164.

A `traceroute -n` run shows three consecutive asterisks at hop 4, but the trace continues and completes successfully at hop 9. A colleague concludes hop 4's router is broken. Is that conclusion supported?

- **A.** No — asterisks mean a probe went unanswered, not that traffic stops there; routers routinely deprioritise or block their own ICMP replies while forwarding perfectly, and only the final hop failing indicates a broken path.
- **B.** Yes — any hop showing asterisks in a `traceroute` output is defined to indicate that specific router is broken and is dropping all traffic, not just probe replies.
- **C.** No, but only because the trace should have been re-run using ICMP probes with `-I` first, since UDP probes alone can never reveal this kind of intermediate-hop behaviour by default, because the UDP method discards every intermediate reply and reports only the final hop reached.
- **D.** Yes, but only because the trace completing at hop 9 must mean a completely different, redundant path was used that bypassed the broken hop 4 router entirely.

**Answer: A.** Asterisks in the output mean a probe went unanswered, not that traffic stops there; routers routinely deprioritise or block their own ICMP replies while forwarding perfectly, so loss shown at hop 4 that is absent at hops 5 through 9 is exactly that artefact, not a fault — only a failure at the final hop indicates a broken path.

- B is wrong: Asterisks specifically mean the probe itself went unanswered; the router at that hop can still be forwarding all other traffic normally, which is exactly why the trace continues successfully past it.
- C is wrong: Re-running with `-I` is a useful step when a trace dies at the first hop entirely, not specifically required to interpret intermediate asterisks when the trace otherwise completes successfully.
- D is wrong: Traceroute follows a single ongoing path hop by hop; the trace completing past hop 4 does not imply a separate redundant path, it means hop 4 forwarded the later probes normally despite not answering its own.

### 165.

A `traceroute` to a destination dies at the very first hop with no response at all, though the service itself is known to work over TCP. What should be tried before concluding the path is broken?

- **A.** Nothing should be tried further; a trace dying at the first hop with the default method is conclusive proof the entire path to the destination is broken.
- **B.** The DNS resolver should be checked next, since a traceroute dying at the first hop is defined to always indicate a name-resolution failure for the destination.
- **C.** Re-running with `-I` or `-T` to switch to ICMP or TCP probes, since the default UDP method to unusual high ports is the most commonly filtered, and a firewall blocking it does not mean the service itself is unreachable.
- **D.** `mtr` should be run in report mode next as the only tool capable of using a probe method other than the one `traceroute` already tried.

**Answer: C.** Because the default method uses UDP to unusual ports, a firewall can block traceroute entirely while the service you actually care about works — which is exactly why `-I` and `-T` exist, and why a trace that dies at the first hop should be re-run with a different method before any conclusion is drawn.

- A is wrong: A first-hop failure with the default UDP method is commonly a filtering artefact of that specific probe method, not conclusive proof of a broken path, especially when the service is independently known to work.
- B is wrong: The scenario specifies the trace is run against a working destination, and a first-hop failure with the default method is a probe-filtering issue, not evidence of a DNS problem.
- D is wrong: `mtr` combines ping and traceroute functionality but is not uniquely capable of switching probe methods; `traceroute` itself supports `-I` and `-T` directly for exactly this purpose.

### 166.

A trace from a client to a server shows the path going through a particular ISP router. The server administrator, tracing back to the client, sees a completely different set of intermediate hops. Is one of the two traces simply wrong?

- **A.** No — the path is one-directional, so traceroute shows the outbound route only, and the return path may genuinely differ, meaning a problem invisible from one end can be obvious from the other.
- **B.** Yes — the two traces must agree exactly, since a path between any two hosts is defined to be identical in both directions on the modern internet.
- **C.** Yes, but only because one of the two administrators must have used `-n` while the other did not, producing a different, incomparable set of results.
- **D.** No, but only because one of the two traces must have used `mtr` instead of `traceroute`, and the two tools are defined to always report different paths for the same route across virtually every environment of this kind.

**Answer: A.** The path is one-directional: traceroute shows the outbound route only, and the return path may differ, so a problem invisible from one end can be obvious from the other — two traces run in opposite directions between the same pair of hosts legitimately showing different hops is expected behaviour.

- B is wrong: Internet paths are frequently asymmetric; nothing guarantees the outbound and return routes between two hosts are the same, so disagreement between the two traces is expected rather than an error.
- C is wrong: `-n` only controls whether hop addresses are resolved to names; it does not change which physical path the probes actually travel, so it cannot explain a genuinely different route.
- D is wrong: `mtr` and `traceroute` report the same underlying path when run from the same host toward the same destination; a genuine difference here reflects path asymmetry, not a tool discrepancy.

### 167.

How does classic Linux `traceroute` typically discover the end of the path, given that its default probes are UDP?

- **A.** It sends UDP probes to an unlikely high destination port, so the final host answers with ICMP port unreachable, which marks the end of the trace.
- **B.** It sends TCP SYN packets to port 80 by default, relying on the final host's web server to answer and confirm the end of the path has been reached.
- **C.** It queries DNS for the destination's PTR record at each hop, and the trace is considered complete once a valid PTR record is returned for that hop's address.
- **D.** It relies on the TTL field reaching exactly 30, the default maximum hop count, at which point the trace is defined to stop and report completion regardless of the actual path length.

**Answer: A.** Classic Linux traceroute sends UDP probes to an unlikely high destination port so that the final host answers with ICMP port unreachable, marking the end of the trace, while each intermediate router along the way returns ICMP time exceeded as its TTL-limited probe is discarded. `tracepath` performs the same kind of trace without requiring superuser privilege.

- B is wrong: The classic default method uses UDP probes, not TCP SYN packets to port 80; `-T` switches to TCP probes as an alternative, not the default behaviour.
- C is wrong: DNS PTR lookups are unrelated to how traceroute detects the end of the path; that mechanism relies on ICMP port-unreachable responses to its UDP probes, not on reverse DNS records.
- D is wrong: Reaching the maximum hop count (`-m`, 30 by default) is a stopping condition for an incomplete trace, not how the tool recognises it has reached the actual, working destination.

### 168.

A service must move to a new address next week with minimal disruption. What should be changed first, and when, relative to the actual move?

- **A.** The record's TTL should be raised right before the change, since a higher TTL is what makes a new answer propagate to every resolver faster.
- **B.** The record's TTL should be lowered well before the change, so resolvers hold the old answer for a shorter time once the change actually lands.
- **C.** Nothing about DNS needs to change beforehand; flushing every resolver's cache at the moment of the move achieves the same effect as lowering the TTL in advance.
- **D.** The A record should be deleted entirely first, then recreated with the new address once the actual move has completed.

**Answer: B.** TTL explains why a DNS change is not visible everywhere at once, and planning a migration means lowering the TTL before the change, not during it, so that resolvers are already holding a short-lived cached answer by the time the actual change lands.

- A is wrong: A higher TTL makes resolvers cache an answer longer, which slows propagation of a later change, not speeds it; lowering the TTL in advance is what shortens the transition.
- C is wrong: Flushing a local cache does nothing to the caches held by every other resolver on the internet; you cannot force other people's resolvers to forget an answer, which is exactly why lowering the TTL in advance is necessary instead.
- D is wrong: Deleting the record first would cause resolution failures during the gap, which is the opposite of minimising disruption; lowering the TTL in advance is the standard, non-disruptive preparation instead.

### 169.

Repeated `dig` queries against the same resolver show a record's TTL falling from 300 to 240 to 180 across successive requests a minute apart. Is this evidence of a misconfiguration?

- **A.** No. A caching resolver returns the remaining lifetime of the cached record on each answer, so a falling TTL across repeated queries is the expected countdown, not an error.
- **B.** Yes — a correctly configured authoritative server should always show a falling TTL exactly like this on every repeated query it answers, a pattern that holds across most deployments encountered.
- **C.** Yes, and it indicates the zone's SOA parameters have been misconfigured to force an artificially short negative-caching interval.
- **D.** No, but only because the resolver being queried must actually be the authoritative server rather than a caching, recursive one.

**Answer: A.** A recursive resolver caches a record and, on each subsequent answer, returns it with the remaining TTL, counting down — repeated queries against a caching resolver showing a falling number are expected, while a query sent to the authoritative server shows the full configured value every time.

- B is wrong: An authoritative server returns the full configured TTL every time, not a falling countdown; the falling pattern specifically indicates the queries hit a caching resolver, not the authoritative server.
- C is wrong: SOA parameters govern negative caching for answers that do not exist; a falling TTL on a normal positive answer from a caching resolver is unrelated to SOA configuration at all.
- D is wrong: A falling TTL specifically indicates a caching resolver rather than the authoritative server; the authoritative server would show the full configured value on every query instead.

### 170.

A name that did not exist yesterday was created this morning, but a branch office still gets NXDOMAIN when looking it up. The zone is confirmed correct at the authoritative server. What explains the branch office's result?

- **A.** NXDOMAIN answers are never cached under any circumstances, so the branch office's resolver must instead be pointed at an entirely different, wrong nameserver.
- **B.** The branch office's `/etc/hosts` file must contain a stale entry actively overriding DNS with an incorrect result for this specific name.
- **C.** The branch office is using a different record type than the rest of the organisation, which is why its query returns NXDOMAIN while others succeed.
- **D.** Negative answers are cached too, governed by the zone's SOA parameters, so the branch office's resolver may still hold a cached NXDOMAIN from before the name existed.

**Answer: D.** Negative answers are cached too, governed by the zone's SOA parameters, so a name queried before it existed can stay NXDOMAIN in a resolver's cache after it is actually created — the branch office's report needs no fix beyond waiting out that cached negative answer's TTL.

- A is wrong: Negative answers are cached too, governed by the zone's SOA parameters, which is exactly the mechanism that explains a stale NXDOMAIN persisting after the name is created.
- B is wrong: An `/etc/hosts` override would need a prior entry for a name that did not previously exist, which is unlikely here; negative DNS caching is the ordinary, sufficient explanation.
- C is wrong: Record type choice does not explain a stale result across offices; a cached negative answer governed by TTL is the direct, sufficient explanation for this pattern.

### 171.

Is lowering a record's TTL ahead of a planned change a free safety margin, or does it have a cost?

- **A.** It is entirely free — lowering a TTL has no effect on anything except how quickly resolvers pick up the eventual new answer, since resolvers re-query on a fixed internal schedule that the record's TTL value does not influence.
- **B.** It has a real cost: a low TTL raises query volume against the authoritative servers, since resolvers must re-ask far more often, so it is a deliberate trade rather than a free margin.
- **C.** It has a cost, but only in the form of a one-time fee charged by the domain registrar each time a TTL value is changed.
- **D.** It is free as long as the change is made using `dig` rather than through the zone's own administrative interface.

**Answer: B.** A low TTL raises query volume and is a cost, not a free safety margin — resolvers cache the answer for less time and must re-ask more often, which is exactly why it has to be lowered deliberately in advance rather than left permanently low.

- A is wrong: A lower TTL means resolvers cache the answer for less time and must re-query more often, which raises load on the authoritative servers; it is not a cost-free change.
- C is wrong: Changing a TTL is not a billable, one-time registrar event; the actual cost is ongoing increased query load against the authoritative servers while the lower value is in effect.
- D is wrong: Which tool is used to inspect or change a TTL has no bearing on the cost of a lower TTL; the cost is the increased query volume against authoritative servers regardless of tooling.

### 172.

An administrator SSHed into an Ubuntu server runs `ufw enable` without first running `ufw allow 22/tcp`. What is the likely, serious consequence?

- **A.** The administrator is likely locked out immediately, since enabling ufw applies default-deny inbound and the active SSH session's port was never explicitly allowed first.
- **B.** Nothing changes for the active session, since ufw is defined to always automatically allow the port the enabling command was itself issued over.
- **C.** The command fails outright with an error and makes no change at all, since ufw refuses to enable itself while an active SSH session lacks an explicit allow rule, because it reads the current connection table before applying any policy.
- **D.** Only outbound traffic is affected, leaving the existing inbound SSH session completely unaffected regardless of any rules configured.

**Answer: A.** Enabling ufw over an SSH session without allowing 22 first is a documented mistake that locks the administrator out immediately, which is why `ufw allow 22/tcp` (or the equivalent for whatever port is in use) has to be run before, not after, enabling the firewall — the general form of the fix is simply `ufw allow` naming the needed port.

- B is wrong: ufw does not automatically detect and allow the port a command was issued over; enabling it without an explicit rule for SSH is exactly what causes the lockout.
- C is wrong: ufw(8) documents a warning prompt when enabling under ssh, not a refusal, and ufw does not read the connection table at all; it flushes the chains and applies the default-deny policy, which is precisely what causes the lockout.
- D is wrong: ufw's default-deny policy governs new inbound connections and can affect the existing session's continuity as well; assuming only outbound traffic is affected is exactly the wrong assumption that causes lockouts.

### 173.

A rule is added with `firewall-cmd --permanent --add-service=https`, but clients still cannot reach the service over HTTPS. What is missing?

- **A.** `firewall-cmd --reload` — a `--permanent` change does not take effect until a reload, so the rule exists in the permanent configuration but not yet in the active runtime policy.
- **B.** Nothing is missing — a `--permanent` rule is defined to take effect in the running configuration the instant the command completes, without any further step.
- **C.** The `--zone` flag must be added to the command, since firewalld rules added without an explicit zone are silently discarded rather than applied to any zone at all.
- **D.** The service must also be explicitly restarted, since firewalld rules are defined to have no effect on any service until that service itself is restarted.

**Answer: A.** `firewall-cmd` distinguishes the runtime configuration from the permanent one: a change without `--permanent` is lost at the next reload, and a `--permanent` change does not take effect until `firewall-cmd --reload`, so adding a rule with `--permanent` and expecting it active immediately is exactly the trap in this scenario.

- B is wrong: A `--permanent` rule specifically does not take effect immediately; it is written to the permanent configuration only, requiring `firewall-cmd --reload` to activate it in the running policy.
- C is wrong: A rule added without an explicit `--zone` applies to the default zone rather than being discarded; the actual missing step here is reloading to activate the permanent configuration.
- D is wrong: Restarting the HTTPS service itself has no bearing on whether firewalld's permanent rule has been reloaded into the active runtime configuration; the missing step is `--reload`, not a service restart.

### 174.

`iptables -L` on a current distribution shows no rule for traffic that a colleague insists was configured natively in nftables. Does the absence of a rule in `iptables -L` prove no such rule exists?

- **A.** No — on current distributions the `iptables` command is frequently a compatibility layer over nftables, so its output may not show rules created natively in nftables at all.
- **B.** Yes — `iptables -L` is defined to display every packet-filtering rule active on the system regardless of which underlying framework or tool originally created it.
- **C.** No, but only because `iptables -L` specifically requires the `-v` flag to reveal any rules created by nftables, which are otherwise omitted from the default terse chain listing shown without it.
- **D.** Yes, but only on distributions using ufw or firewalld as a front-end, since only those two tools are capable of hiding rules from `iptables -L` in this way.

**Answer: A.** On current distributions the `iptables` command is frequently a compatibility layer over nftables, the successor framework, so its output may not show rules created natively in nftables — "the rule is not in `iptables -L`" is not proof that no rule exists.

- B is wrong: `iptables -L` reflects rules visible through its own compatibility layer; a rule created natively in nftables may not appear there at all, so its absence is not conclusive proof of nothing existing.
- C is wrong: `-v` adds verbose output such as packet counters; it does not reveal nftables-native rules that `iptables -L` is simply not designed to display at all.
- D is wrong: The visibility gap comes from `iptables` itself acting as an nftables compatibility layer, independent of whether ufw or firewalld happen to be installed as additional front-ends.

### 175.

On Debian-family and Red Hat-family Linux distributions respectively, which firewall front-end is conventional, and what do both ultimately configure?

- **A.** firewalld is conventional on Debian-family systems and ufw on Red Hat-family systems; both ultimately configure a completely separate framework from netfilter.
- **B.** ufw is conventional on Debian-family systems and firewalld on Red Hat-family systems; both ultimately configure the kernel's netfilter packet-filtering framework.
- **C.** ufw is conventional on Debian-family systems and firewalld on Red Hat-family systems, but each configures a distinct, independent kernel packet filter rather than a shared one.
- **D.** Neither tool is distribution-specific; both ufw and firewalld ship as equally standard defaults across every major Linux distribution family without exception.

**Answer: B.** `ufw` (Uncomplicated Firewall) is the simplified front-end shipped by the Debian family, and `firewalld` is the zone-based, dynamically managed front-end shipped by the Red Hat family — all of them, including raw `iptables`, ultimately configure netfilter in the kernel.

- A is wrong: This reverses the conventional distribution mapping — ufw belongs to Debian-family systems and firewalld to Red Hat-family ones — and both, in fact, configure netfilter, not a separate framework.
- C is wrong: Both front-ends ultimately configure the same kernel packet-filtering framework, netfilter; they are not independent, separately implemented filtering mechanisms underneath.
- D is wrong: ufw and firewalld are each associated with a specific distribution family by convention, Debian and Red Hat respectively, not shipped as equal defaults across every distribution.

### 176.

Two hosts sit on the same physical switch but are configured in different VLANs. Can they communicate directly through the switch alone?

- **A.** Yes — since they share the same physical hardware, VLAN membership has no effect on whether two hosts can reach each other directly.
- **B.** Yes, but only if both VLANs happen to use IP addresses from the same subnet, in which case the switch bridges them automatically.
- **C.** No, but only because 802.1Q tagging actively blocks all traffic between any two ports on the same physical switch by default.
- **D.** No; separate VLANs are separate broadcast domains, exactly as if the hosts were on physically distinct switches, so a router or a layer 3 switch is required to forward between them.

**Answer: D.** VLANs are separate broadcast domains independent of physical location, so hosts in different VLANs cannot reach each other without a router or a layer 3 switch to forward between them, exactly as if they were on physically distinct switches — a broadcast-based protocol such as ARP or DHCP discovery stays inside its own VLAN.

- A is wrong: VLAN membership is exactly what determines broadcast-domain boundaries on a switch; sharing physical hardware does not override that separation.
- B is wrong: VLANs remain separate broadcast domains regardless of whether their addressing happens to overlap; a switch does not automatically bridge VLANs based on address similarity.
- C is wrong: 802.1Q tagging identifies which VLAN a frame belongs to on trunk links; it does not blanket-block traffic between ports, and access ports carry no tag at all.

### 177.

What is the difference between an access port and a trunk port in 802.1Q VLAN configuration?

- **A.** An access port carries every VLAN untagged simultaneously; a trunk port is restricted to exactly one VLAN at a time, because an 802.1Q tag can only ever name a single VLAN membership for the whole of a physical link.
- **B.** An access port and a trunk port are simply two names for the same configuration, differing only in which vendor's equipment uses which term.
- **C.** An access port requires a router directly attached to it, while a trunk port can only ever connect to an end-user host device.
- **D.** An access port carries untagged traffic for a single VLAN; a trunk port carries traffic for several VLANs at once, with an 802.1Q tag inserted into each frame identifying which VLAN it belongs to.

**Answer: D.** Ports are configured as access ports, carrying untagged traffic for a single VLAN, or as trunk ports, carrying traffic for several VLANs with an 802.1Q tag inserted into each frame — a switch strips the tag before delivering a frame to an access port, so end hosts normally never see tags at all.

- A is wrong: This reverses the actual roles: an access port is restricted to one VLAN, while a trunk port is the one that carries multiple VLANs, distinguished by tags.
- B is wrong: Access and trunk describe genuinely different port behaviours defined by the 802.1Q standard, not two vendor-specific names for identical configuration.
- C is wrong: Neither port type requires a router to be directly attached; access ports typically connect to end-host devices and trunk ports typically connect switches to each other.

### 178.

A remote worker connects to a VPN and is told they now behave, for addressing and routing purposes, as though attached to the private network directly. What does that description actually mean in practice?

- **A.** It means a virtual interface appears on the client and routes are installed pointing some or all destinations through the encrypted tunnel, so private-network resources are reached as though the client were physically on that network.
- **B.** It means the client's own physical network interface is temporarily relocated to the private network's physical location for the duration of the connection, as if the network card itself changed sites.
- **C.** It means DNS records for the private network are automatically republished to the public internet for the duration of the client's VPN session.
- **D.** It means the client's MAC address is reassigned to match one already registered on the private network's local switch infrastructure.

**Answer: A.** Typically the client authenticates to a VPN endpoint, a virtual interface appears on the client, and routes are installed pointing some or all destinations through that interface — it is the routing table, not any physical change, that determines which traffic actually enters the tunnel.

- B is wrong: Nothing physical relocates; the effect is produced entirely through a virtual interface and routing changes on the client, not any actual physical relocation of hardware.
- C is wrong: VPN access does not republish private DNS records publicly; it grants the connected client its own private routing and, typically, private-facing name resolution, without exposing anything to the wider internet.
- D is wrong: A VPN operates above the link layer, through routing over an encrypted tunnel; it does not reassign or spoof the client's MAC address to match anything on the remote network's switches.

### 179.

A user reports the VPN client shows "Connected," yet an internal server is still unreachable. What is usually implicated first, given that the tunnel itself reports as up?

- **A.** The tunnel's own encryption must be broken, since a report of unreachability after a successful connection message is always a cryptographic negotiation failure.
- **B.** The VPN endpoint's own internet connection must be down, since a client-reported 'Connected' status is always unreliable and cannot be trusted on its own.
- **C.** The server's firewall must have blocked the VPN client's specific address, since that is the only plausible explanation once a tunnel reports as successfully connected, because a tunnel that reports up necessarily has every destination inside it already routed.
- **D.** Routing or name resolution rather than the tunnel itself — in most implementations the tunnel is genuinely up, and that particular destination simply is not routed through it, which is why the routing table is checked first.

**Answer: D.** Because the routing table decides which traffic enters the tunnel, most "the VPN is connected but I still cannot reach the server" reports are generally routing or DNS problems rather than tunnel problems — the tunnel is up and simply is not being used for that particular destination.

- A is wrong: A successful 'Connected' status means the tunnel and its encryption negotiated successfully; the described unreachability is far more often a routing or split-tunnel configuration issue.
- B is wrong: A "Connected" status from the client reflects a genuinely established tunnel in most implementations; the more common explanation for a specific unreachable destination is routing, not the endpoint's own connectivity.
- C is wrong: A firewall block is possible but is not the first or most usual explanation; routing or name resolution not sending that traffic through the tunnel at all is the more common, better-supported explanation.

### 180.

A study note lists 3306 (MySQL) and 5432 (PostgreSQL) as "well-known ports" alongside 22 and 443. Using the strict IANA range definitions, is that labelling correct?

- **A.** Yes — any port number that is commonly recognised and consistently used for one particular service, like MySQL or PostgreSQL, qualifies as well-known by that usage alone.
- **B.** No, but only because 3306 and 5432 are actually dynamic or ephemeral ports, in the 49152-65535 range, rather than registered ones.
- **C.** No. Strictly, only 0-1023 is the well-known range; 3306 and 5432 both sit above 1023 in the 1024-49151 registered range, so they are registered ports, not well-known ones, however familiar they are.
- **D.** Yes, but only for 3306, since 5432 alone falls below 1024 and genuinely belongs in the well-known range while 3306 does not.

**Answer: C.** Strictly, IANA calls only 0-1023 the well-known or system range; 1024-49151 are registered ports and 49152-65535 are the dynamic or private range — 3306, 3389 and 5432 sit above 1023, so they are registered ports, not well-known ones, however familiar they are.

- A is wrong: Common recognition and consistent use do not define the well-known range; that range is strictly 0-1023 by IANA definition, and 3306 and 5432 fall outside it in the registered range.
- B is wrong: 3306 and 5432 fall in the 1024-49151 registered range, well below the 49152-65535 dynamic range; the correct correction is registered, not dynamic.
- D is wrong: Neither 3306 nor 5432 falls below 1024; both are above it, in the registered range, so neither one genuinely belongs in the well-known range.

### 181.

Match the well-known port numbers to their conventional services: 22, 25, 53, 80, 143, 443.

- **A.** 22 HTTP, 25 SSH, 53 SMTP, 80 DNS, 143 HTTPS, 443 IMAP — each service shifted one position down the list from its actual conventional port.
- **B.** 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP, 443 MySQL — matching the first five correctly but naming a registered-range service for the last one.
- **C.** 22 SSH, 25 DNS, 53 SMTP, 80 HTTP, 143 IMAP, 443 HTTPS — swapping the conventional assignments of 25 and 53 relative to their actual services.
- **D.** 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP, 443 HTTPS, each the conventional assignment recognised in the well-known range.

**Answer: D.** The conventional well-known assignments worth memorising include 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 143 IMAP and 443 HTTPS, all within the 0-1023 well-known range, with `ss -tulpn` remaining the only authoritative statement about what a given host is actually listening on.

- A is wrong: Every pairing here is shifted one position off from the actual conventional assignment; 22 is SSH, not HTTP, and the pattern continues that way down the list.
- B is wrong: 443 is conventionally HTTPS, not MySQL; MySQL's conventional assignment is 3306, a registered port entirely outside this list.
- C is wrong: 25 is conventionally SMTP and 53 is conventionally DNS; this pairing has those two specifically swapped relative to their correct assignments.

### 182.

A security review finds SSH answering on port 2222 on one server instead of port 22. A reviewer argues this cannot really be SSH, since SSH "is" port 22. Is that reasoning sound?

- **A.** Yes — a service can only ever run on its officially registered port number, so anything answering on 2222 must be a different protocol entirely.
- **B.** No, but only because 2222 is itself a second officially registered port for SSH alongside 22, so both numbers are equally valid by definition.
- **C.** No, nothing forces a service onto its conventional port; SSH can genuinely run on 2222, and a port number is evidence about intent, never proof of protocol.
- **D.** Yes, but only because a well-known port and its service are bound together specifically by the operating system's kernel, unlike a registered port such as this one.

**Answer: C.** Nothing forces a service onto its conventional port — SSH on 2222 is still SSH — so a port number is evidence about intent, never proof of protocol; `ss -tulpn` shows only which of the conventional assignments a host is actually listening on, not a guarantee about what protocol answers there.

- A is wrong: No enforcement mechanism binds a protocol to its conventional port number; SSH, like many services, can be configured to listen on any port an administrator chooses.
- B is wrong: 2222 is not a second registered assignment for SSH; it is simply a commonly chosen nonstandard port, not an alternate official one.
- D is wrong: The kernel does not bind any port number to a specific protocol or service at all; a well-known port carries only a lower binding privilege requirement, not a protocol-enforcement mechanism.

### 183.

A client's outbound connection uses source port 51000. Does that number fall inside IANA's dynamic/private range, 49152-65535?

- **A.** No — client source ports are always assigned somewhere within the well-known 0-1023 range regardless of what Linux's ephemeral range configuration says.
- **B.** Yes, it does, but note that Linux's default ephemeral range, 32768 to 60999, overlaps the registered range rather than matching IANA's dynamic range exactly, so a source port can also land below 49152 in the registered band.
- **C.** No — 51000 falls in the registered range, 1024-49151, since IANA defines that range to extend up to the top of the operating system's default ephemeral window, 60999 on Linux, rather than stopping at the nominal 49151 boundary printed in older tables.
- **D.** The question is unanswerable, since IANA does not actually define a fixed numeric boundary for where the dynamic or private port range begins.

**Answer: B.** Linux's default ephemeral range, 32768 to 60999, overlaps the registered range rather than matching IANA's 49152-65535 dynamic range, so a client's source port frequently lands on a number the registry has assigned to something else — a source port of 51000 does sit in IANA's dynamic band, but many others in practice will not.

- A is wrong: Client source ports are ephemeral values from a much higher range; the well-known 0-1023 range is for service ports requiring privilege to bind, not for a client's outbound source port.
- C is wrong: The registered range is defined as 1024-49151 by IANA; 51000 is numerically above that boundary and falls in the 49152-65535 dynamic range as stated, not inside the registered one.
- D is wrong: IANA does define a fixed boundary, 49152, for the start of the dynamic/private range; the boundary is well defined even though Linux's actual default ephemeral range does not align with it exactly.

