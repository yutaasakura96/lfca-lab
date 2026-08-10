# Software Application Architecture

Software Application Architecture is the vocabulary competency of IT Project Management
Fundamentals: it asks an IT associate to place a described component correctly — which tier,
which server role, which storage model, which HTTP method — rather than to build anything. Its
domain is worth 10% of the exam — 6th largest of 6 domains — under the current (2025-09-16)
blueprint, and this competency was unchanged by the 2025 update. LFS200 barely reaches it: 15
NOT COVERED, 2 MENTIONED ONLY — 2/17 (12%) are not NOT COVERED, and those two (microservices
and REST) are named in a single lesson rather than taught
(`research/lfs200-notes/00-course-map.md`). Nine of the seventeen concepts also have no primary
documentation source at all, because the architecture vocabulary is industry consensus rather
than a published standard; each of those carries the waiver marker in its own block, and its
claims are hedged accordingly.

<a id="s-software-application-architecture-patterns"></a>
## Patterns

<a id="c-pm.software-application-architecture.client-server-model"></a>
### Client-server model
*id: `pm.software-application-architecture.client-server-model` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** The interaction shape in which one program (the client) initiates a request and
another program (the server) waits for requests and returns responses. Client and server are
usually described as roles taken for a particular exchange, not as machine types: the same
process can typically be a server to a browser and a client to a database in the same second.

**Why it matters** Almost every other concept in this competency is a refinement of this one
shape — tiers, web and application servers, APIs, and REST all describe who requests and who
answers. A candidate who reads "client" as "the user's laptop" and "server" as "the rack in the
data centre" will misplace components that are physically neither, such as an application server
calling a database or one microservice calling another.

**How it works** In the common description, the server binds to a known address and port and
waits; the client, which must know that address, opens a connection and sends a request; the
server processes it and replies. The initiative is one-directional — the server does not
normally call the client back out of the blue — which is why polling, callbacks, and long-lived
connections exist as named exceptions to the pattern rather than as the pattern itself. The
usual contrast is peer-to-peer, where every participant is typically both requester and
responder and there is no designated waiting party.

**Key terms** client role; server role; request/response; peer-to-peer.

<a id="c-pm.software-application-architecture.three-tier-architecture"></a>
### Three-tier architecture
*id: `pm.software-application-architecture.three-tier-architecture` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A logical separation of an application into three layers — a presentation tier
that renders and accepts input, an application (or logic) tier that holds business rules, and a
data tier that stores and retrieves state — so that each can be changed, scaled, or replaced
without rewriting the others. The word "tier" names a layer of responsibility, not a count of
machines.

**Why it matters** The most likely question form is placement: given a component, name its tier.
Getting that right requires the layer definition rather than a hardware picture, because all
three tiers commonly run on one host in development and each tier commonly spans many hosts in
production. It is also the frame in which "scale the web layer, not the database" style
reasoning is expressed.

**How it works** In the usual description the presentation tier — a browser, a mobile app, a
static site served to one — collects input and displays results but holds no business rules. The
application tier validates, authorises, and computes, and it is the only tier that normally talks
to the data tier. The data tier is the database or other store; it is typically not exposed to
the presentation tier directly, which is exactly what makes the middle tier the place to enforce
rules. Two-tier (client talking straight to a database) and n-tier (extra layers such as an
integration or caching tier) are the same idea at different counts.

**Key terms** presentation tier; application tier; data tier; n-tier.

**Traps** A tier is not a server and not a machine: three tiers on one laptop is still three-tier,
and one tier spread over twenty instances is still one tier. A tier is also not a deployment
unit — three-tier says nothing about whether the code ships as one artefact or fifty, which is
the monolith-versus-microservices axis instead. And a load balancer or reverse proxy sitting in
front is typically described as infrastructure serving the presentation and application tiers,
not as a fourth tier of its own.

**What the exam may test** Assigning a named component to a tier — a browser or mobile UI to
presentation, an authorisation rule or pricing calculation to application, a table or document
store to data — and recognising that physical host count is irrelevant to the answer.

*Not to be confused with [web server vs application server](software-application-architecture.md#cmp-pm.software-application-architecture.web-server-vs-application-server).*

<a id="c-pm.software-application-architecture.monolithic-architecture"></a>
### Monolithic architecture
*id: `pm.software-application-architecture.monolithic-architecture` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** An application built and released as one deployable unit: all of its modules
compile, package, and ship together, and a change to any one of them typically requires
redeploying the whole. The defining property is the shared release, not the size of the code or
the age of the project.

**Why it matters** The exam's likely question is a trade-off judgement — which shape suits a
small team, an unproven product, or a system with one tightly coupled workload — and a candidate
who has absorbed "monolith equals legacy" will pick the wrong answer for exactly the scenarios
where a monolith is the better engineering choice.

**How it works** A monolith is typically run by starting the same artefact on as many hosts as
needed and putting a load balancer in front. Calls between modules are in-process function calls
rather than network requests, so they are fast, easy to debug, and can share one database
transaction. The costs are usually described as coupling in the release cycle (a risky change
anywhere blocks the whole deploy), coarse scaling (the entire application scales together even
if only one feature is hot), and a single technology stack for everything.

**Key terms** single deployable unit; in-process call; modular monolith; shared release.

**Traps** "Monolith" is not "one server" — a monolith replicated across fifty instances is still
a monolith, because deployment unit, not instance count, is the criterion. It is not "one
process" either, and it is not the opposite of three-tier: a monolith can perfectly well be a
textbook three-tier application, since tiers describe layers and monolith describes packaging.
A well-structured "modular monolith" is also not a contradiction in terms.

**What the exam may test** Choosing between monolithic and microservice shapes for a stated
situation, and rejecting the distractor that treats horizontal replication of a monolith as
having made it something else.

*Not to be confused with [microservices](software-application-architecture.md#cmp-pm.software-application-architecture.microservices).*

<a id="c-pm.software-application-architecture.microservices"></a>
### Microservices
*id: `pm.software-application-architecture.microservices` · depth 3 · importance 1 · LFS200: MENTIONED ONLY · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** An architecture in which an application is split into services that are
independently deployable, communicate over the network, and each own their data. LFS200 names
the term in one lesson without developing it (`research/lfs200-notes/00-course-map.md`), so
nothing below is drawn from the course.

**Why it matters** The trade-off, not the definition, is what a scenario question turns on:
independent deployment and per-service scaling are bought with network latency, partial failure,
and a large operational burden. The right answer for a three-person team shipping a first
product is usually not microservices, and a question describing that team is usually testing
whether the candidate knows it.

**How it works** Each service is typically built, versioned, released, and scaled on its own
schedule, and reaches other services only through their published interfaces — commonly HTTP
APIs or a message queue — never by reading their tables. That data-ownership rule is what makes
independent deployment real; without it, two services sharing one schema must still be released
together. The consequences usually stated are that a call that was a function call becomes a
network call that can time out, that a single business operation spanning services cannot rely
on one database transaction, and that observability, deployment automation, and service
discovery stop being optional.

**Key terms** independently deployable; service-owned data; network call; partial failure.

**Traps** "Microservices" is not a synonym for "small files," "modules," or "an application with
an API." A codebase split into tidy modules that still ship as one artefact is a modular
monolith. Splitting services while leaving them all reading and writing one shared database is
typically called a distributed monolith — it has taken on the network costs without buying the
independent deployment. Microservices are also not a tier: a single microservice usually spans
presentation-facing and logic responsibilities of its own slice.

**What the exam may test** Matching a stated constraint (independent team release cadence,
wildly uneven scaling between features, mixed language requirements) to microservices, and
matching the opposite constraints (small team, tight coupling, one transaction spanning
everything) to a monolith.

<a id="cmp-pm.software-application-architecture.microservices"></a>
#### Not to be confused with: Microservices vs Monolithic architecture
*compares: `pm.software-application-architecture.microservices`, `pm.software-application-architecture.monolithic-architecture`*

| | Microservices | Monolithic architecture |
| --- | --- | --- |
| Unit of deployment | Many — each service released on its own schedule | One — every module ships in the same artefact |
| Calls between modules | Network requests that can time out or fail alone | In-process calls that fail only with the process |
| Data ownership | Each service typically owns its own store | One shared database is normal |
| Scaling granularity | Per service, so a hot feature scales alone | Whole application, even for one hot feature |
| Transaction spanning modules | Not available from one database transaction | Available — one transaction can cover everything |
| Cost paid | Operational and observability overhead | Coupled releases and coarse scaling |

The separating axis is the release boundary: microservices have many independent deployment
units with network calls and separate data between them, a monolith has exactly one — every
other row follows from that.

#### Scenario

A retailer's checkout runs as one deployable Java artefact on six instances behind a load
balancer, with a browser front end and one relational database. Classify it correctly on two
independent axes rather than one. By layering it is three-tier: the browser is presentation, the
Java application is the application tier, the database is the data tier — running on six hosts
changes none of that. By packaging it is a monolith, and it stays a monolith no matter how many
instances run, because the whole artefact ships together. Every interaction inside it is
client-server in role terms: the browser is a client of the application, and that same
application is a client of the database. If the team later splits inventory into its own
independently deployed service with its own store, the packaging axis moves to microservices
while the tier classification does not move at all.

#### Knowledge check

1. An application is deployed as a single artefact onto twenty instances behind a load balancer.
   Is it a monolith?
   Yes. The criterion is the deployment unit, not the instance count; twenty copies of one
   artefact is still one release unit.
2. What is the one-sentence difference between three-tier architecture and the
   monolith/microservices distinction?
   Tiers describe logical layers of responsibility; monolith versus microservices describes how
   many independently deployable units the code ships as. A monolith can be three-tier.
3. Two services are deployed separately but both read and write the same database schema. What
   has the team actually built?
   A distributed monolith: they have taken on network calls and partial failure without gaining
   independent deployment, because a schema change still forces both to be released together.
4. In the client-server model, can one process be both client and server?
   Yes — client and server are roles per exchange, so an application server is a server to the
   browser and a client to the database at the same time.
5. Name the two costs a team accepts when it moves from a monolith to microservices.
   In-process calls become network calls that can fail or time out independently, and one
   database transaction can no longer span a business operation crossing services (plus the
   operational overhead of running many deployables).

<a id="s-software-application-architecture-components"></a>
## Components

<a id="c-pm.software-application-architecture.web-server-vs-application-server"></a>
### Web server vs application server
*id: `pm.software-application-architecture.web-server-vs-application-server` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Two runtime roles in front of a web application. A web server terminates the HTTP
connection and returns files it already has — HTML, CSS, JavaScript, images — or forwards the
request to something else. An application server runs the application's own code to produce a
response that did not exist until the request arrived. Nginx and the Apache HTTP Server are
commonly described in the first role; Tomcat, Gunicorn, and a Node process serving an Express
application in the second.

**Why it matters** Deployment and troubleshooting questions turn on which of the two a symptom
belongs to. A static asset returning 404 while the API works is usually a web-server
configuration problem; an API returning 500 while static assets load is usually the application
code or its runtime. Answering "the server is broken" resolves nothing, because in this shape
there are conventionally two.

**How it works** The usual arrangement puts the web server at the edge: it listens on 80 and 443,
handles TLS, serves whatever it can from disk, and reverse-proxies the remaining paths to the
application server on an internal port. The application server executes the request against the
application's code, typically querying a database and rendering a response, and hands it back for
the web server to return. Because the roles are functional rather than product-defined, one
product can fill both — an application server can serve static files, and a web server with an
embedded language module can execute code — which is why the exam-relevant question is what a
component is doing, not what it is called.

**Key terms** static content; reverse proxy; dynamic response; TLS termination.

**Traps** A reverse proxy is not the same thing as a load balancer, even though one process
frequently does both: proxying is about forwarding a request on a client's behalf, balancing is
about choosing between several equivalent backends. And "web server" in casual speech sometimes
means the physical machine — in this competency it means the software role that serves HTTP
content.

**What the exam may test** Deciding which component a described symptom or responsibility belongs
to — TLS termination and static files to the web server, business logic and database access to
the application server — and recognising that the two roles usually coexist on the same host.

<a id="cmp-pm.software-application-architecture.web-server-vs-application-server"></a>
#### Not to be confused with: Web server vs application server vs Three-tier architecture
*compares: `pm.software-application-architecture.web-server-vs-application-server`, `pm.software-application-architecture.three-tier-architecture`*

| | Web server vs application server | Three-tier architecture |
| --- | --- | --- |
| What it names | Two concrete runtime roles that serve HTTP | A logical layering of an entire application |
| How many parts | Two, and both are processes you can point at | Three layers of responsibility, each possibly many processes |
| Covers the database | No — neither role is the data store | Yes — the data tier is one of the three |
| Kind of statement | Operational: what is running and what it does | Design: where a responsibility belongs |
| Where they meet | The web server serves presentation-tier content and reverse-proxies the rest; the application server implements the application tier | The layering those two roles serve, with the data tier behind them |

The separating axis is design versus deployment: three-tier names where responsibilities belong,
web server versus application server names which running process is doing the serving — the
application server implements the application tier, while the web server delivers
presentation-tier content and reverse-proxies without being a tier of its own, and neither role
touches the data tier.

#### Scenario

A site's home page loads but every form submission returns 502. Split the stack by role before
touching anything. The 502 is a 5xx, and 502 specifically is what a server acting as a gateway or
proxy returns when the server behind it answered invalidly — so the web server at the edge is
alive and reachable, and the failure is behind it. Static assets loading confirms the same: the
web server is serving files from disk without help. That points at the application server —
crashed, not listening on the internal port it is proxied to, or wedged on database calls — and
not at TLS, DNS, or the browser. In three-tier terms, the presentation tier is being served
correctly and the fault sits in the application tier or the data tier behind it.

#### Knowledge check

1. What is the one-sentence difference between a web server and an application server?
   A web server returns content it already has and forwards what it cannot handle; an
   application server executes the application's code to produce a response that did not exist
   before the request.
2. Static assets load but `/api/orders` returns 500. Which component is the first suspect, and
   why not the other one?
   The application server, because a 500 means the server erred while executing something; the
   web server is demonstrably working since it is serving the static files.
3. Are a reverse proxy and a load balancer the same thing?
   No. Reverse proxying is forwarding a request to a backend on the client's behalf; load
   balancing is choosing among several equivalent backends. One product commonly does both.
4. Which tier of a three-tier architecture has no counterpart in the web-server/application-server
   pair?
   The data tier — neither of those two roles is the data store.

<a id="s-software-application-architecture-interfaces"></a>
## Interfaces

<a id="c-pm.software-application-architecture.api"></a>
### API
*id: `pm.software-application-architecture.api` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: rfc9110*

**What it is** An application programming interface: the published contract by which one piece of
software calls another — the operations available, the inputs each takes, the outputs and errors
each returns — with the implementation deliberately hidden behind it. HTTP is one carrier for
such a contract, and RFC 9110 describes exactly this property of it: HTTP hides how a service is
implemented by presenting a uniform interface to clients.

**Why it matters** The exam's use of "API" is broader than "a URL you can call with JSON," and
distractors exploit that. A library's function signatures, an operating system's system-call
interface, and a cloud provider's HTTP endpoints are all APIs; what makes them one is the stable
contract, not the transport. The point of the contract is that the caller can keep working while
the implementation behind it is rewritten.

**How it works** The provider publishes the contract and commits to it; the caller codes against
the contract, not the internals. Versioning exists because that commitment cannot be broken
silently — a breaking change is normally shipped as a new version rather than applied in place.
Documentation, and increasingly a machine-readable description of the endpoints and their
schemas, is what makes the contract usable by someone who cannot read the source.

**Key terms** contract; abstraction; consumer and provider; versioning.

**Traps** An API is not a protocol, not a data format, and not a server. HTTP is the protocol,
JSON is a format, the application server is what runs behind it — the API is the agreed set of
operations layered on top. "API" is also not a synonym for "REST API": REST is one style of
building one, and SOAP, gRPC, and GraphQL are others over the same transport.

**What the exam may test** Recognising an API as the interface contract rather than the
implementation or the transport, and rejecting options that equate "API" with "REST," "HTTP," or
"JSON."

<a id="cmp-pm.software-application-architecture.api"></a>
#### Not to be confused with: API vs REST
*compares: `pm.software-application-architecture.api`, `pm.software-application-architecture.rest`*

| | API | REST |
| --- | --- | --- |
| Category | A contract between two pieces of software | An architectural style for building such a contract |
| Requires a network | No — a library or system-call interface is an API | Yes in practice; it is defined over HTTP-style request/response |
| Fixes the data format | No | No — JSON is conventional, not mandatory |
| Alternatives at the same level | None; the term names the whole category | SOAP, gRPC, GraphQL are alternative styles |
| Relationship | The superset | One kind of API |

The separating axis is category versus instance: every REST interface is an API, and most APIs
are not REST — so a question naming "the API" has said nothing yet about style, format, or
transport.

<a id="c-pm.software-application-architecture.rest"></a>
### REST
*id: `pm.software-application-architecture.rest` · depth 3 · importance 1 · LFS200: MENTIONED ONLY · sources: rfc9110*

**What it is** Representational State Transfer: an architectural style in which the things a
service exposes are modelled as resources, each addressed by a URL, and acted on with the
standard HTTP methods whose semantics RFC 9110 defines. A response carries a representation of a
resource's state, most often as JSON. LFS200 names REST in one lesson without developing it
(`research/lfs200-notes/00-course-map.md`).

**Why it matters** REST is the default shape of the web APIs an IT associate meets, so a scenario
describing `GET /orders/42` expects the candidate to read the URL as a resource identity and the
method as the operation — not to guess from an endpoint name. Its statelessness constraint is
also the reason REST services scale horizontally so easily, which links this concept directly to
load balancing and to stateless application design.

**How it works** In the usual formulation the URL identifies the resource (`/orders/42`), the
method states the operation (retrieve, replace, modify, remove), and the status code reports the
outcome. REST inherits HTTP's statelessness: RFC 9110 defines HTTP as a stateless protocol in
which each request message's semantics can be understood in isolation, so a REST request carries
whatever identity and context the server needs rather than relying on the server remembering the
previous request. That is what lets any instance behind a load balancer answer any request.

**Key terms** resource; representation; uniform interface; statelessness.

**Traps** REST is a style, not a specification and not a protocol: there is no RFC that defines
REST, and "returns JSON over HTTP" alone does not make an interface RESTful. An endpoint set like
`POST /getOrder` and `POST /deleteOrder` is HTTP and JSON, but it puts the verb in the URL and
uses one method for everything — the opposite of the uniform-interface idea. REST also does not
mandate JSON; XML, plain text, and binary representations are all legitimate.

**What the exam may test** Identifying which of several described interfaces is REST-shaped —
resource URLs plus method semantics plus stateless requests — and separating REST from the HTTP
protocol underneath it and the JSON format inside it.

*Not to be confused with [API](software-application-architecture.md#cmp-pm.software-application-architecture.api).*

<a id="c-pm.software-application-architecture.http-methods-and-status-codes"></a>
### HTTP methods and status codes
*id: `pm.software-application-architecture.http-methods-and-status-codes` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: rfc9110, rfc5789*

**What it is** The two halves of an HTTP exchange's meaning: the request method states what the
client wants done to the target resource, and the three-digit status code states what happened.
RFC 9110 defines the methods and the status classes; PATCH is defined separately, in RFC 5789.

**Why it matters** This is the most literally testable concept in the competency, and the
4xx-versus-5xx boundary is the part that carries diagnostic weight: 4xx says the client seems to
have erred, 5xx says the server is aware that it has erred or is incapable of performing the
requested method. Whether a failing request is the caller's fault or the service's is decided by
that first digit before anything else is investigated.

**How it works** Methods carry two properties worth holding separately. A method is *safe* when
its semantics are essentially read-only, and *idempotent* when the intended effect of several
identical requests is the same as that of one. RFC 9110 states that PUT, DELETE, and the safe
methods are idempotent; RFC 5789 states that PATCH is neither safe nor idempotent.

| Method | What it requests | Safe | Idempotent |
| --- | --- | --- | --- |
| GET | Transfer of a current representation of the target resource | Yes | Yes |
| POST | That the target resource process the enclosed representation by its own semantics | No | No |
| PUT | That the resource's state be created or replaced with the enclosed representation | No | Yes |
| PATCH | That a set of changes described in the request be applied to the resource | No | No |
| DELETE | That the origin server remove the association between the resource and its current functionality | No | Yes |

Status codes group by first digit: 1xx interim, 2xx the request was successfully received,
understood and accepted, 3xx further action is needed by the user agent, 4xx the client seems to
have erred, 5xx the server is aware it has erred or cannot perform the method. The individual
codes worth knowing are 200 OK, 201 Created (which RFC 9110 requires when a PUT creates a
resource that had no representation), 204 No Content, 301 Moved Permanently, 302 Found, 400 Bad
Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 500 Internal
Server Error, 502 Bad Gateway, 503 Service Unavailable, and 504 Gateway Timeout.

**Key terms** safe method; idempotent method; status class; origin server.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `curl -X` | Send an HTTP request with an explicitly chosen method | `-X <method>` sets the method word used in the request | `curl -X DELETE https://example.com/orders/42` | Expecting `-X` to change behaviour: it only changes the method word, so `-X HEAD` does not make a proper HEAD request (`-I` does), and the method set with `-X` is reused on redirects followed with `-L` |
| `curl -i` | Show the response headers, including the status line, along with the body | `-i` include response headers; `-I` fetch the headers only | `curl -i https://example.com` | Confusing `-i` with `-I` — `-i` adds headers to the normal response, while `-I` issues a HEAD request and returns headers only |

**Traps** PUT replaces the whole resource with the representation sent, creating it if it did not
exist; PATCH applies a partial modification described by the request. Sending a partial object
with PUT therefore means "the resource is now only these fields," which is a silent data loss
question the exam can put in a scenario. The second trap is 401 versus 403: 401 Unauthorized
means the request lacks valid authentication credentials — it is about being unauthenticated,
despite the reason phrase — while 403 Forbidden means the server understood the request and
refuses it, and if credentials were supplied it considers them insufficient. The third is 404:
it is a 4xx client error even though the server is the one that could not find a representation,
and RFC 9110 allows a server to answer 404 in place of 403 to hide that a forbidden resource
exists at all. Finally, POST is neither safe nor idempotent, which is why a browser warns before
resubmitting one and why clients should not blindly retry it.

**What the exam may test** Assigning fault from the status class (4xx client, 5xx server),
picking the correct method for a described change (full replacement versus partial update), and
distinguishing 401 from 403 in an access-denied scenario.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.software-application-architecture.json-and-xml` | JSON and XML | Text formats for exchanging structured data between systems; JSON is the current default for web APIs, XML the older and more verbose format still used in SOAP and document standards. | A format is not a protocol and not a schema. RFC 8259 calls JSON language-independent and merely derived from JavaScript object literals, and requires UTF-8 for JSON exchanged outside a closed ecosystem — so "JSON only works with JavaScript" is wrong. |
| `pm.software-application-architecture.message-queue` | Message queue | A buffer that holds messages between a producer and a consumer so the two never have to be available at the same moment. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* A queue decouples in time, which an API call does not: the producer typically gets no answer back, and messages are normally consumed and removed rather than queried like a database. |

#### Scenario

A mobile client updates a saved address by sending the full address object to `PUT /users/7`,
and the phone number stored on that user disappears. Nothing is broken: PUT replaces the
resource's state with what was sent, so a body omitting the phone number means the resource no
longer has one — the partial modification the developer intended is PATCH. Retrying the call is
safe in itself, since PUT is idempotent, but it will not restore the lost field. A second call to
the same API returns 401, and the developer starts checking permissions; the class is right but
the code is not, because 401 means the request lacked valid authentication credentials, so the
token is missing or expired rather than under-privileged — 403 would be the code for
authenticated-but-refused. Everything here is REST-shaped: the URL identifies the resource, the
method states the operation, and the status code reports the outcome.

#### Knowledge check

1. What is the exact difference between PUT and PATCH?
   PUT requests that the resource's state be created or replaced with the representation sent;
   PATCH requests that a set of changes described in the request be applied to it. PUT is whole,
   PATCH is partial.
2. Which of GET, POST, PUT, PATCH and DELETE are idempotent?
   GET, PUT and DELETE. POST and PATCH are not.
3. A request returns 503. Whose fault is the failure, and what does the code say specifically?
   The server's — 5xx means the server is aware it erred or cannot perform the method, and 503
   specifically means it is temporarily unable to handle the request through overload or
   maintenance.
4. A caller with no token gets 401 and a caller with a valid token for a different account gets
   403. Explain both.
   401 means the request lacks valid authentication credentials; 403 means the server understood
   the request and refuses it, treating supplied credentials as insufficient.
5. Does `curl -X HEAD` issue a proper HEAD request?
   No. `-X` only changes the method word in the request; `-I, --head` is the option that actually
   performs a HEAD request.
6. Why is a message queue not just a slower API call?
   Because it decouples the two sides in time: the producer typically does not wait for a reply
   and the consumer need not be running at all when the message is sent.

<a id="s-software-application-architecture-data"></a>
## Data

<a id="c-pm.software-application-architecture.relational-database"></a>
### Relational database
*id: `pm.software-application-architecture.relational-database` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: postgresql-transactions, postgresql-indexes*

**What it is** A store that holds data as tables of rows and columns with a schema declared in
advance, relationships expressed by keys, queries written in SQL, and transactional guarantees
over changes. PostgreSQL, MySQL, MariaDB, Oracle Database, and SQL Server are the common
examples.

**Why it matters** The likely question is a selection one — given a workload, choose relational
or non-relational — and the honest discriminators are whether the data has stable structure,
whether entities must be joined, and whether an operation spanning several rows or tables has to
be all-or-nothing. Those are properties of the requirement, not of the product's popularity.

**How it works** The schema is enforced by the database, so a row that violates a column type or
a foreign key is rejected at write time rather than discovered later by an application. Related
entities are stored once and joined at query time, which is what keeps a value from having to be
updated in twenty places. Transactions bundle multiple steps into a single all-or-nothing
operation, and a transactional database logs a completed transaction to permanent storage before
reporting it complete, so a crash immediately afterwards cannot lose it. Indexes are separate
structures that let the planner find matching rows without scanning the table; PostgreSQL keeps
an index synchronised as the table changes, so each one costs write time and disk space in
exchange for read speed.

**Key terms** schema; primary and foreign key; join; transaction; index.

**Traps** "Relational" is not the same word as "SQL": relational describes the tables-and-keys
data model, SQL is the language used to query it — and some non-relational products offer
SQL-like query languages of their own. Relational is also not the same as "has tables"; a
wide-column store has something table-shaped and no joins or cross-table transactions. And
transactions are not exclusively relational any more: several NoSQL products now offer
transactions of some scope, so "only relational databases have transactions" is a distractor
rather than a rule.

**What the exam may test** Matching a scenario to the relational model when the data is
structured, highly interrelated, and requires all-or-nothing multi-step updates — and knowing
that adding an index speeds reads at the cost of writes rather than being free.

*Not to be confused with [NoSQL database](software-application-architecture.md#cmp-pm.software-application-architecture.nosql-database).*

<a id="c-pm.software-application-architecture.nosql-database"></a>
### NoSQL database
*id: `pm.software-application-architecture.nosql-database` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** An umbrella term for stores that do not use the relational tables-and-joins model.
The four families usually listed are document stores (records as JSON-like documents), key-value
stores (an opaque value retrieved by its key), wide-column stores (rows of sparse columns
partitioned by key), and graph databases (nodes and edges, with traversal as the primary
operation).

**Why it matters** The dataset flags this comparison as one where choosing between the two for a
stated scenario is likely. The usable rule of thumb is shape and access pattern: records that
vary field by field, or that are always fetched whole by one key, or that must be spread across
many nodes for write volume, typically suit a non-relational store; interrelated entities queried
in combinations nobody predicted typically do not.

**How it works** In most of these products the schema is not declared to the database; each
record carries its own structure and the application is responsible for coping with variation.
Joins are typically absent, so related data is either denormalised into the same record or
assembled by the application in several round trips. Horizontal scaling by partitioning across
nodes is usually a design goal rather than a later retrofit, and the transactional scope commonly
offered is one document or one key rather than an arbitrary set of rows across tables.

**Key terms** document store; key-value store; wide-column store; graph database; denormalisation.

**Traps** "NoSQL" does not mean "no SQL syntax" and it does not mean "no schema" — several of
these products expose SQL-like query languages, and the structure does not vanish, it simply
moves from the database into the application. It also does not mean faster in general: it is
usually faster for the access pattern the data was modelled for and considerably worse for the
ones it was not, particularly anything join-shaped. "NoSQL" is a category rather than a product
type, so a question comparing "NoSQL" against a specific relational product is comparing a family
against a member.

**What the exam may test** Picking the store family that fits a described access pattern, and
rejecting the claim that NoSQL is a general-purpose upgrade over relational rather than a
different set of trade-offs.

<a id="cmp-pm.software-application-architecture.nosql-database"></a>
#### Not to be confused with: NoSQL database vs Relational database
*compares: `pm.software-application-architecture.nosql-database`, `pm.software-application-architecture.relational-database`*

| | NoSQL database | Relational database |
| --- | --- | --- |
| Where the schema lives | Typically in the application; records may vary | Declared to and enforced by the database |
| Query language | Product-specific APIs, some SQL-like | SQL, standard across products in the main |
| Joining entities | Typically unavailable; data is denormalised instead | First-class; entities stored once and joined at query time |
| Usual scaling shape | Horizontal partitioning across nodes, designed in | Vertical growth plus read replicas; partitioning is harder |
| Transaction scope typically offered | One document or one key | Many rows across many tables, all-or-nothing |
| Best fit | Records varying in shape, or fetched whole by one key | Structured, interrelated data queried in unpredictable combinations |

The separating axis is where structure is enforced: a relational database holds the schema and
the joins, and a NoSQL store typically pushes both into the application in exchange for scaling
and flexibility.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.software-application-architecture.sql-basics` | SQL basics | SELECT reads rows, INSERT adds them, UPDATE changes existing ones, DELETE removes them, and JOIN combines rows from more than one table on a matching column. | *No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.* Of the four statements, SELECT is the one that changes nothing — JOIN is a clause written inside a query rather than a statement of its own; UPDATE and DELETE without a WHERE clause typically act on every row in the table. |
| `pm.software-application-architecture.schema-table-and-index` | Schema, table and index | The schema is the declared structure, the table is the relation that holds the rows, and an index is a separate structure that speeds lookups on a column. | An index is not part of the data and not a copy of the table: PostgreSQL updates it whenever the table changes, so it buys read speed with write time and disk space. |
| `pm.software-application-architecture.transactions-and-acid` | Transactions and ACID | Atomicity, consistency, isolation and durability — the guarantees that bundle several steps into one all-or-nothing operation that survives a crash once committed. | Atomicity and durability are different promises: atomicity means partial steps never take effect, durability means a committed transaction is written to permanent storage before completion is reported. |

#### Scenario

A team is choosing storage for two features of the same product. The first is an order system:
orders reference customers and products, a checkout must debit stock and record payment together
or do neither, and finance queries the data in combinations nobody anticipated. That is
relational — the join requirement and the all-or-nothing multi-table operation both point there,
and the transaction is what guarantees stock is never debited without the payment row. The second
is a session store read once per request by session id and never joined to anything. That suits a
key-value store, where the per-key transactional scope is all the feature needs. When the orders
table grows and customer lookups slow down, the fix is an index on the looked-up column — which
speeds those reads and slows every insert and update slightly, because the database keeps the
index synchronised with the table.

#### Knowledge check

1. What is the one-sentence difference between a relational and a NoSQL database?
   A relational database enforces the schema and performs the joins itself; a NoSQL store
   typically pushes both into the application in exchange for horizontal scale and flexible
   record shapes.
2. Does "NoSQL" mean the product has no query language and no structure?
   No. Several expose SQL-like languages, and the structure still exists — it is enforced by the
   application rather than declared to the database.
3. What does adding an index cost?
   Write time and disk space: the database keeps the index synchronised as the table changes, so
   faster reads are paid for on every insert, update and delete.
4. Distinguish atomicity from durability.
   Atomicity means the steps of a transaction all take effect or none do; durability means that
   once a transaction is reported complete, it has been recorded to permanent storage and
   survives a crash.
5. Which of SELECT, INSERT, UPDATE, DELETE changes nothing, and which is most dangerous without a
   WHERE clause?
   SELECT changes nothing; UPDATE and DELETE without WHERE typically act on every row in the
   table.

<a id="s-software-application-architecture-performance"></a>
## Performance

<a id="c-pm.software-application-architecture.caching-in-applications"></a>
### Caching in applications
*id: `pm.software-application-architecture.caching-in-applications` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Keeping a copy of a result in faster storage so that repeat requests are answered
without redoing the work. The defining property in most descriptions is that the copy is
expendable: a cache may be emptied at any moment and the system must still be correct, only
slower.

**Why it matters** Caching is the standard answer to a read-heavy performance scenario, and the
standard trap alongside it is staleness. Every cache accepts that a reader may see a value that
is no longer current; the design question is how long that is tolerable, which is why time-to-live
and explicit invalidation appear in the same breath as hit rate.

**How it works** A lookup checks the cache first — a hit returns immediately, a miss falls
through to the original source and typically stores the result on the way back. Entries are
usually retired by a time-to-live, by an eviction policy when the cache is full, or by explicit
invalidation when the underlying data changes. The layers commonly named are the browser, a CDN
at the network edge, a reverse proxy, an in-memory cache beside the application, and the
database's own buffers; a request may be answered by any of them, which is why a stale page can
survive a fix applied at the origin.

**Key terms** hit and miss; time-to-live; eviction; invalidation; staleness.

<a id="c-pm.software-application-architecture.stateless-vs-stateful-applications"></a>
### Stateless vs stateful applications
*id: `pm.software-application-architecture.stateless-vs-stateful-applications` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: rfc9110*

**What it is** Whether a server retains anything about a client between that client's requests. A
stateless application keeps nothing locally: every request arrives carrying whatever identity and
context is needed, so any instance can answer it. A stateful one holds session data in its own
memory or disk, so subsequent requests from that client must reach that same instance.

**Why it matters** This decides how easily instances can be added, replaced, or lost. Stateless
instances are interchangeable, which is what makes load balancing, autoscaling, rolling
deployment, and recovering from a dead instance straightforward; a stateful instance holds
something that dies with it, so the same operations need sticky sessions, session replication, or
an accepted loss of user sessions. The underlying protocol already assumes the stateless case:
RFC 9110 defines HTTP as a stateless protocol in which each request message's semantics can be
understood in isolation, and notes that many implementations depend on that design to reuse
proxied connections or balance requests across multiple servers.

**How it works** Stateless does not mean the application stores no data anywhere — that would be
useless. It means the per-client state lives somewhere shared and external: a database, a shared
cache, or a token the client presents on every request. State has been moved, not eliminated, and
the point of moving it is that no single instance becomes irreplaceable. RFC 9110 makes the same
demand of authentication, which it presumes to be stateless: all the information needed to
authenticate a request must be provided in the request rather than depend on the server
remembering prior ones.

**Key terms** session state; sticky session; shared session store; horizontal scaling.

#### Scenario

Users report being logged out at random after a second application instance is added behind a
load balancer. The application is stateful: it holds session data in the memory of whichever
instance served the login, so any later request routed to the other instance sees no session. Two
fixes exist and they are not equivalent. Sticky sessions pin each user to one instance, which
works until that instance is redeployed or dies and takes its sessions with it. Moving session
state to a shared store or to a token the client presents on every request makes the instances
interchangeable, which is the stateless design HTTP already assumes. A caching layer is a
different answer to a different question: it would reduce repeated reads of the same profile
data, but a cache is expendable by definition, so it is not where session state belongs.

#### Knowledge check

1. Does "stateless" mean the application stores no data?
   No. It means no per-client state is held in the serving instance; that state moves to a shared
   store, a database, or a token the client sends with each request.
2. Why do stateless applications scale horizontally more easily?
   Any instance can answer any request, so instances can be added, replaced or lost without
   losing a user's session or requiring the load balancer to route them consistently.
3. What does a cache accept in exchange for speed, and what must remain true if it is emptied?
   It accepts staleness — a reader may see a value that is no longer current — and the system
   must still be correct, merely slower, if the cache is emptied.
4. A page still shows old content after the origin was fixed. Name two layers that could be
   answering the request.
   Any of the browser cache, a CDN edge, or a reverse proxy in front of the application could be
   returning a cached copy.
5. Why are sticky sessions a weaker fix than an external session store?
   Sticky sessions keep the state inside one instance, so redeploying or losing that instance
   still loses the sessions; an external store leaves the instances interchangeable.
