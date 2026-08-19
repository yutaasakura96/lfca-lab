<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — IT Project Management Fundamentals :: Software Application Architecture

17 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A library exposes function signatures for other code to call locally, with no network involved. Does it have an API, and is it necessarily RESTful?

- **A.** It has an API, and it is not necessarily RESTful; an API is a contract that need not involve a network at all, while REST is one network-based style of building one.
- **B.** It has no API, since APIs are by definition HTTP endpoints that some remote caller invokes over a network connection.
- **C.** It has an API, and that API is RESTful because any interface presenting a stable contract to its callers counts as REST.
- **D.** It has an API only once someone publishes a machine-readable schema document formally describing its operations, the way an OpenAPI document formalizes a network endpoint's contract for outside callers.

**Answer: A.** The API/REST comparison's separating axis is category versus instance: every REST interface is an API, but an API needs no network at all — a library's function signatures are the textbook case, and REST is only one style of building a networked one.

- B is wrong: A uniform HTTP interface is one carrier for a contract, not the definition of the contract itself; a library's function signatures are the classic non-network API example.
- C is wrong: REST specifically constrains resource URLs, HTTP methods, and statelessness — properties a local function-call interface has no occasion to exhibit.
- D is wrong: Documentation makes a contract usable to more callers, but the contract exists as soon as the operations, inputs and outputs are fixed — the schema formalises it rather than creating it.

### 2.

A bug fix is deployed to the origin server, but users report seeing the old, broken page for another hour. RFC 9111 governs HTTP caching. What does the cache's behaviour here demonstrate, and what does it not indicate?

- **A.** That the cache is malfunctioning, since a correct cache would always reflect the latest origin state immediately.
- **B.** That the cache accepted staleness in exchange for speed; it does not indicate that the fix failed to deploy or that the origin is broken.
- **C.** That the origin server itself is stateful, since it kept serving the same response.
- **D.** That the API's contract changed without a new version being published.

**Answer: B.** RFC 9111 exists because every layer between origin and browser may hold a copy older than the current one; the guide's own trap is exactly this — a stale page can survive a fix applied at the origin, which is the cache working as designed, not a broken deployment or a stateful server.

- A is wrong: A cache that always reflected the origin immediately wouldn't be doing its job — reducing repeat work by accepting some staleness is the design, not a fault.
- C is wrong: Statefulness describes whether a server retains client-specific data between requests; a cache returning a stale shared page is unrelated to that property.
- D is wrong: Nothing here concerns the interface's contract or its versioning; the page's content became stale in a cache, an entirely different mechanism.

### 3.

An application server queries a database on behalf of a request from a browser. RFC 9110 describes client and server as roles a program plays on a given connection, not as fixed types of machine. In client-server terms, what is the application server's role?

- **A.** Only a server, since it never itself opens the connection from the browser.
- **B.** A server to the browser and a client to the database, since the same program can hold both roles on different connections.
- **C.** Peer-to-peer, since the same program both answers and initiates requests.
- **D.** Impossible — a single process can only occupy one of the two roles at a time, so it must be either a server everywhere or a client everywhere it appears.

**Answer: B.** RFC 9110 states plainly that the same program might act as a client on some connections and a server on others — role is a property of a connection, not an identity stamped on a process. An application server is exactly this case: server to the tier above it, client to the tier below.

- A is wrong: That treats role as a fixed identity of the process rather than a per-connection role — the same trap as misassigning a component's tier.
- C is wrong: Peer-to-peer names a shape with no designated waiting party; a service that both answers a browser and calls a database is two ordinary client-server exchanges, not that.
- D is wrong: A common misreading of client and server as a permanent identity rather than a role assumed once per connection.

### 4.

A script needs to send a DELETE request to `https://example.com/orders/42` and confirm the exact status code that comes back. Which curl invocation does both?

- **A.** Run `curl -X HEAD https://example.com/orders/42` to get a proper HEAD response with the status line, since `-X` is assumed to switch the request method the same way `-I` does.
- **B.** Run `curl -X DELETE -i https://example.com/orders/42`; `curl -X` sets the method word, and `-i` adds the status line and response headers to the output.
- **C.** Run `curl --head https://example.com/orders/42`; `--head` prints the status line, and the order path in the URL is enough to identify what should be removed.
- **D.** Send the request with PUT instead of DELETE, since PUT and DELETE are both idempotent so either confirms the same outcome.

**Answer: B.** The curl manual is explicit that `-X` only changes the method word and does not alter how curl behaves, which is why `-X HEAD` is not a proper HEAD request and `--head` is. Pairing `-X DELETE` with `-i` sends the method RFC 9110 defines for removing a resource and prints the status line that came back, while `--head` alone would issue a HEAD and never delete anything.

- A is wrong: Expecting `-X` to change request behaviour is the documented mistake: `-X HEAD` does not perform a proper HEAD request — `-I, --head` is the option that does.
- C is wrong: `-I, --head` fetches the headers only by issuing a HEAD request, so no DELETE is ever sent and the status line reported belongs to the HEAD rather than to the removal the script needs.
- D is wrong: Idempotence describes what happens on repetition, not equivalence between operations; PUT replaces the resource rather than removing it, so it doesn't answer whether the delete succeeded.

### 5.

RFC 8259 calls JSON 'language-independent' though its syntax is merely 'derived from' JavaScript object literals, and it requires UTF-8 for JSON exchanged outside a closed ecosystem. What does that rule out?

- **A.** That a JSON document can omit a declared schema, since RFC 8259 requires one, the same way a relational table's columns are declared before any row can be inserted.
- **B.** That XML remains the current default for web APIs, since RFC 8259 only standardises JSON.
- **C.** That JSON exchanged between systems can use any character encoding interchangeably.
- **D.** That JSON only works with JavaScript, whereas RFC 8259 defines it as independent of any particular language.

**Answer: D.** RFC 8259 is explicit on both traps this concept invites: JSON's syntax is derived from JavaScript but the format itself is language-independent, and UTF-8 is required once JSON leaves a closed ecosystem — 'JavaScript-only' and 'any encoding will do' are both wrong for the same reason.

- A is wrong: RFC 8259 defines JSON's syntax and encoding; it says nothing about requiring a schema, which is a separate and often-optional practice.
- B is wrong: The guide names JSON, not XML, as the current default for web APIs; RFC 8259 standardising JSON doesn't revive XML's status.
- C is wrong: RFC 8259 requires UTF-8 for JSON text exchanged outside a closed ecosystem, which is a real constraint this denies.

### 6.

The OASIS AMQP 1.0 specification models a queue as a node that stores and forwards messages between a producer and a consumer, named as separate application elements. What does that model rule out?

- **A.** That a queue is essentially a database table that other components are free to query however they like.
- **B.** That the producer and consumer may also call each other directly over a synchronous API when both do happen to be running, since a queue between them forbids every other path.
- **C.** That the producer and consumer must both be available at the same moment; the queue buffers messages between two elements that need not coincide in time.
- **D.** That messages are normally removed once consumed, rather than left in place for other components to read repeatedly.

**Answer: C.** AMQP 1.0 models a queue as a node that stores and forwards messages between a producer and consumer named as separate elements — decoupling in time is the point, which is what separates a queue from an API call or a queryable store.

- A is wrong: The specification models the queue as a store-and-forward node passing messages on, not a store other components query arbitrarily like a table.
- B is wrong: Nothing in the store-and-forward model forbids a direct call between the two elements; the queue describes one route a message may take, not the only channel the two are permitted to use.
- D is wrong: Messages are normally consumed and removed rather than queried like a database — a real behaviour this denies.

### 7.

Team A's services are versioned and deployed independently, each with its own datastore, reaching each other only over the network. Team B's services live in one shared codebase, ship in one release, and read and write one common database, though the code is split along clean module boundaries. Which team has microservices?

- **A.** Team B — its modules are already split along clean boundaries, which is what makes an architecture microservices.
- **B.** Team A, because independent deployment, network calls between services, and each service owning its data are the defining traits.
- **C.** Both — any system organised into services with clear boundaries qualifies, regardless of how it deploys, since module boundaries are what the term is really pointing at.
- **D.** Neither — microservices additionally require a message queue rather than direct network calls between services.

**Answer: B.** The comparison's separating axis is the release boundary. Team A has many independently deployed units with network calls and separate data; Team B has one release and one shared database — a distributed-monolith risk if it split the process without splitting the data.

- A is wrong: Splitting into tidy modules that still ship as one artefact is a modular monolith; the trait that matters is independent deployment, not module boundaries.
- C is wrong: That drops the deployment and data-ownership requirements the term actually carries.
- D is wrong: HTTP APIs and message queues are named as common interfaces between services, but the requirement is independent deployment and ownership, not one specific transport.

### 8.

A three-person startup ships its whole product as one deployable artefact, replicated across six instances behind a load balancer for capacity. A reviewer calls this 'not really a monolith anymore' because it runs on six instances. Is the reviewer correct?

- **A.** Yes — six independently running instances means six independently deployable units, each free to be released, scaled and rolled back without touching the other five.
- **B.** No, but only because the team is too small to be running microservices.
- **C.** No. The defining property is the shared release, not instance count; six copies of one artefact is still one deployable unit.
- **D.** Yes — a 'modular monolith' is a contradiction, so any monolith that scales horizontally has become something else.

**Answer: C.** The CNCF glossary and the guide agree the criterion is the deployable unit, not the instance count, the team size, or the internal module structure. Six replicas of one artefact behind a load balancer is exactly the common way to run a monolith at scale.

- A is wrong: The instances are copies of the same artefact released together, not services released on separate schedules — the trait microservices actually have.
- B is wrong: Team size is a factor in which shape suits a system, but it doesn't change what 'monolith' means for the one already built — the same trap as reasoning from scale about a tier count.
- D is wrong: A well-structured modular monolith is not a contradiction in terms, and horizontal replication doesn't touch packaging at all.

### 9.

A session store is read once per request by session id and never joined to anything else. Storage volume is high and access is always by that one key. Which store family fits, and on what basis?

- **A.** A relational database, since it offers the strongest data-integrity guarantees regardless of access pattern.
- **B.** Either — NoSQL is simply a faster, schema-free relational database, so the choice between them comes down to preference rather than the shape of the access pattern.
- **C.** A message queue, since high volume calls for a buffer between producer and consumer.
- **D.** A NoSQL key-value store, given that fetching a record whole by one key with no joins is the access pattern that model is designed for.

**Answer: D.** The comparison's separating axis is where structure is enforced: a session fetched whole by one key with no joins is the textbook NoSQL fit, while a relational database would enforce a schema and offer join and cross-table transaction guarantees this workload never uses.

- A is wrong: Relational strength is joins and cross-table transactions; a workload with no joins and one lookup key gains nothing from either and pays declared-schema overhead for no benefit.
- B is wrong: NoSQL is a category defined by rejecting the relational tables-and-joins model, not a faster drop-in replacement for it.
- C is wrong: Nothing here describes a producer-consumer handoff; the requirement is a fast lookup by key, which a queue is not built to serve.

### 10.

A checkout must debit stock and record payment together, or do neither, and finance later queries orders joined against customers and products in combinations nobody anticipated. A colleague proposes a wide-column NoSQL store because 'NoSQL scales better.' What actually discriminates this choice?

- **A.** The all-or-nothing multi-table update and the unpredictable joins — a relational database enforces the schema and performs the joins this workload needs.
- **B.** Scale alone — NoSQL is simply the faster choice once a workload's volume grows large enough to matter, regardless of whether the data being stored has any relationships that need enforcing.
- **C.** Neither store — only a message queue between the two steps can guarantee the debit and payment happen together.
- **D.** It makes no real difference either way, since several NoSQL products now offer transactions of their own too.

**Answer: A.** The honest discriminators are structure, joins, and atomicity across tables, not popularity or raw scale. PostgreSQL's own model — enforced schema, joins performed by the database, a transaction logged to permanent storage before completion is reported — is built for exactly this checkout.

- B is wrong: NoSQL is usually faster for the access pattern the data was modelled for and considerably worse for join-shaped queries like this one; volume alone doesn't decide it.
- C is wrong: A queue decouples producer and consumer in time; it has no notion of an all-or-nothing operation across two tables, which is what a transaction provides.
- D is wrong: Some NoSQL products do offer transactions, but typically scoped to one document or key — not the arbitrary multi-table span this checkout needs.

### 11.

An interface exposes `POST /getOrder` and `POST /deleteOrder`, both returning JSON over HTTP. A developer calls it a REST API. What is missing?

- **A.** Nothing at all — returning a JSON body over an HTTP connection is already sufficient to call an interface RESTful.
- **B.** A published, machine-readable contract describing the interface's available inputs and outputs to callers.
- **C.** A message queue sitting between the client and the service to decouple the two in time, the missing piece that would let the caller stop waiting for an immediate response.
- **D.** Resource URLs and method semantics — the verb belongs in the URL and one method is used for everything, the opposite of the uniform interface REST requires.

**Answer: D.** The example is HTTP and JSON but not REST-shaped: the verb sits in the URL, and one method handles every operation, which is exactly the uniform-interface violation the guide's trap calls out.

- A is wrong: REST is a style, not a specification, and returning JSON over HTTP alone does not make an interface RESTful; JSON isn't even mandated.
- B is wrong: That describes any API's documentation and doesn't determine whether the design underneath is REST-shaped.
- C is wrong: REST is a synchronous request/response style over HTTP; nothing about it involves decoupling client and server in time the way a queue does.

### 12.

After adding an index on a heavily-queried column, read latency improves but nightly batch inserts start taking noticeably longer. What explains the change?

- **A.** The index replaced the table with a faster copy, so writes now pass through an extra layer.
- **B.** The schema was altered when the index was added, which is what slowed the inserts.
- **C.** Indexes are free to maintain, so the slowdown must have an unrelated cause.
- **D.** The index is a separate structure PostgreSQL keeps synchronised as the table changes, so every insert now also updates the index.

**Answer: D.** PostgreSQL keeps each index synchronised as the underlying table changes. That is exactly the trade the guide names: read speed bought with write time and disk space, not a free structure or a schema change.

- A is wrong: An index is not a copy of the table's data; it is a separate lookup structure alongside it, and the table itself is unchanged.
- B is wrong: Adding an index doesn't redeclare the schema; the slowdown comes from maintaining the index structure itself, not a schema change.
- C is wrong: An index is not free: PostgreSQL updates it whenever the table changes, so faster reads are paid for on every insert, update and delete.

### 13.

A junior engineer runs `UPDATE orders SET status = 'cancelled';` against production with no WHERE clause. What has just happened, and which statement would have changed nothing if run the same way?

- **A.** Every row in the table was updated to 'cancelled'; a bare `SELECT` run the same way would have changed nothing.
- **B.** Only the most recently inserted row was updated; a bare `DELETE` run the same way would have changed nothing.
- **C.** Nothing, because PostgreSQL requires a WHERE clause on UPDATE by default.
- **D.** Every row was updated, and adding a `JOIN` clause would have prevented it.

**Answer: A.** Of the four data-changing statements, SELECT changes nothing; UPDATE and DELETE without a WHERE clause typically act on every row, and JOIN is a clause used inside a query rather than a statement of its own.

- B is wrong: UPDATE has no notion of 'most recent' without an explicit WHERE or ORDER BY; DELETE without a WHERE clause is just as dangerous as this UPDATE, not safe.
- C is wrong: PostgreSQL does not require a WHERE clause; omitting one is exactly what makes this statement act on every row.
- D is wrong: JOIN is a clause written inside a query, not a statement of its own, and it has no bearing on whether an UPDATE carries a WHERE clause.

### 14.

Users get logged out at random after a second application instance is added behind a load balancer, because each instance holds session data only in its own memory. A quick fix pins each user to the instance that logged them in. RFC 9110 describes HTTP as a stateless protocol whose requests can be understood in isolation. What does the sticky-session fix actually change?

- **A.** Nothing about statelessness — it works around a stateful application by routing consistently, but the session still dies if that instance is redeployed or lost.
- **B.** It makes the application stateless, since the load balancer now handles routing consistently.
- **C.** It satisfies the same requirement a cache would, since both exist to keep repeat requests answered quickly.
- **D.** It moves the application's REST interface to a stateful style, since REST normally requires statelessness.

**Answer: A.** RFC 9110 defines HTTP as stateless so that any instance can answer any request; sticky sessions merely paper over an application that isn't, by pinning routing rather than moving state to a shared store or token — the actual fix, and the reason failing over remains fragile until it's applied.

- B is wrong: Consistent routing is a workaround, not a move of state to a shared store or token; the application is exactly as stateful as before.
- C is wrong: A cache is expendable by definition and holds derived results; session state cannot be lost the way a cache entry can, so a cache answers a different question.
- D is wrong: Sticky routing is an infrastructure workaround at the load balancer, not a change to the API's resource-and-method design; REST's statelessness constraint concerns request semantics, not instance affinity.

### 15.

A checkout application runs as a single Java artefact on twenty instances behind a load balancer: a browser front end, the Java application enforcing pricing rules, and one relational database. How many tiers does this system have, and why?

- **A.** Twenty, since each running instance adds another layer between the browser and the database, one layer for every copy of the artefact running behind the load balancer.
- **B.** Four — presentation, application, data, and the load balancer sitting in front.
- **C.** Three: presentation (browser), application (the Java artefact), and data (the database); instance count does not change the layer count.
- **D.** Two — the browser and the database, since the application logic runs inside the browser tier.

**Answer: C.** Tier counts responsibility layers, not hosts or processes. Twenty instances of one artefact is still one application tier, and a load balancer sits in front of the tiers as infrastructure rather than adding one, per the three-tier model.

- A is wrong: Instance count measures deployment scale, not the number of responsibility layers — the same confusion that treats packaging as if it changed the layering.
- B is wrong: A load balancer or reverse proxy in front is typically described as infrastructure serving the presentation and application tiers, not a tier of its own.
- D is wrong: That merges the application tier into presentation; the Java artefact enforcing pricing rules is a separate application tier that does not run in the browser.

### 16.

A multi-step transfer debits one account and credits another. The process crashes immediately after the database reports the transaction complete. What is guaranteed?

- **A.** Only the debit is guaranteed to survive, since it was applied first.
- **B.** Nothing is guaranteed once the process crashes, regardless of what the database reported.
- **C.** The transaction was already logged to permanent storage before completion was reported, so both the debit and the credit survive the crash.
- **D.** Consistency is guaranteed, meaning the transaction ran faster than an equivalent pair of separate updates.

**Answer: C.** Atomicity and durability are different promises: atomicity means partial steps never take effect, durability means a committed transaction is written to permanent storage before completion is reported — exactly what protects both halves of the transfer from a crash immediately afterward.

- A is wrong: Atomicity means the steps of a transaction all take effect or none do; there is no guarantee that favours the first step over the second.
- B is wrong: That denies durability specifically — the guarantee that a reported-complete transaction has already been made permanent.
- D is wrong: Consistency means the database moves between valid states, not a claim about speed; nothing here concerns performance.

### 17.

A site's home page loads instantly and every static image renders, but every form submission returns 502 Bad Gateway. Which component is the first suspect, and on what basis?

- **A.** The application server — a 502 is what a gateway or proxy returns when the backend it forwards to answers invalidly, and static content loading proves the web server itself is reachable.
- **B.** The web server — since it is the process that returned the 502 status code to the browser, the fault must lie in whatever generated that particular response.
- **C.** The application tier is fine, but the load balancer sitting in front needs to be treated as a fourth tier before this diagnosis can go any further.
- **D.** The database, since form submissions are the only kind of request in this scenario that would ever need to reach it at all, and every other component in the path already proved itself by serving the static assets correctly.

**Answer: A.** Static assets loading confirms the web server is alive and serving files it already has; a 502 means it forwarded a request and got back an invalid response, which locates the fault in the application server behind it — exactly the diagnostic split the two roles exist to support.

- B is wrong: 502 specifically means a gateway or proxy got an invalid response from upstream; it is evidence the web server is working as a proxy and the upstream is not.
- C is wrong: A load balancer or reverse proxy sitting in front is typically described as infrastructure serving the tiers, not a tier of its own.
- D is wrong: Nothing here isolates the database specifically; the symptom points at whatever is behind the web server's proxy, which is the application server first.

