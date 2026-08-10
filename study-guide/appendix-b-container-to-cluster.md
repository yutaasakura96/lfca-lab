# Appendix B: from container to cluster

One application, followed from a text file in a source tree to a load-balanced workload
answering on a stable address, as a single causal chain. Every link exists because the link
before it produced something the next one consumes, and every link has a characteristic
failure with a characteristic symptom. That is the whole point of the appendix: the terms in
this area are easy to learn one at a time and useless that way, because the exam asks which
link a described symptom belongs to.

The chain crosses two domains. The container mechanics belong to DevOps Fundamentals, worth
12% of the current (2025-09-16) exam; the container-versus-virtual-machine and
shared-responsibility material belongs to Cloud Computing Fundamentals, worth 18%. Course
support is thin: Containers is the weakest-covered competency in its own domain — LFS200
touches 1 of its 24 concepts, 1 FULLY COVERED and 23 NOT COVERED (4%), against 28% for DevOps
Basics and 23% for Git Concepts — and the one it touches is the bare idea of an isolated
process. The Containers lesson never reaches Docker, images, registries or orchestration
(`research/lfs200-notes/00-course-map.md`), so almost nothing below is reinforced by the course
and nearly all of it has to come from somewhere else.

<a id="b-how-to-read"></a>
## How to read this

**This file defines nothing.** Every term below is a link to its single definition site in
[Containers](05-devops/containers.md) or
[Cloud computing](03-cloud-computing/cloud-computing.md). If a link's target says something
different from what you remember reading here, the target is right — it is the definition,
this is the wiring diagram. Read a step, follow the link, come back to the next step.

Ten steps, in causal order:

1. [The Dockerfile and the build context](#b-step-1)
2. [Layers, and which instructions make them](#b-step-2)
3. [The image and its tag](#b-step-3)
4. [Push, pull, and the registry](#b-step-4)
5. [The runtime: namespaces and cgroups](#b-step-5)
6. [Container versus virtual machine: what is shared](#b-step-6)
7. [The pod as the scheduling unit](#b-step-7)
8. [The Deployment and replica management](#b-step-8)
9. [The Service and cluster networking](#b-step-9)
10. [Where orchestration takes over from the runtime](#b-step-10)

Steps 1 to 6 happen identically with Docker alone on one laptop. Steps 7 to 10 exist only
because there is more than one machine. That boundary — not the number of containers — is the
one the exam keeps testing.

| # | Step | Produces | Characteristic failure |
| ---: | --- | --- | --- |
| 1 | Dockerfile + build context | Instructions and the files they may read | Build stops at `COPY`: the path is outside the context |
| 2 | Layer creation | Read-only filesystem layers, content-addressed | Cache thrash; a secret permanently recoverable from a layer |
| 3 | Image + tag | An artifact with a digest and a mutable label | Two hosts run different code under one tag |
| 4 | Registry push/pull | The image reachable from every node | `denied` on push; `ImagePullBackOff` on pull |
| 5 | Runtime | A process in namespaces, under cgroup limits | Container exits immediately; `OOMKilled`, exit code 137 |
| 6 | Kernel sharing | The isolation boundary you actually bought | `exec format error`; a foreign-kernel workload that cannot run |
| 7 | Pod | The unit the scheduler places | Pod stuck `Pending`, event `FailedScheduling` |
| 8 | Deployment | A maintained replica count and a rollout | Rollout stalls; `ProgressDeadlineExceeded` |
| 9 | Service | One stable address in front of changing pods | Everything exists, nothing connects: no endpoints |
| 10 | Orchestration seam | Declared state reconciled continuously | Control plane down: no new scheduling, running pods unaffected |

<a id="b-build"></a>
## Build: source to image

<a id="b-step-1"></a>
### 1. The Dockerfile and the build context

**Mechanism.** The [Dockerfile](05-devops/containers.md#c-devops.containers.dockerfile) is a
recipe; the build context is the set of files the builder is allowed to read while following
it. In `docker build -t api:1.4.2 .` the trailing `.` is the context directory, not the
Dockerfile — the Dockerfile is found inside it by default and named explicitly with `-f`. The
context is sent to the builder before any instruction runs, minus whatever `.dockerignore`
excludes. `COPY` and `ADD` can only reach paths inside that context: there is no path out of
it, by design, because a build that could read arbitrary host paths would not be reproducible
anywhere else.

The build never runs the application. It executes `RUN` commands and records configuration;
`CMD` and `ENTRYPOINT` are written into the image's configuration for later, and `EXPOSE`
records a port as documentation and publishes nothing. A candidate who expects the build to
start the service has already mislocated every downstream symptom.

**Failure and symptom.** A `COPY` whose source sits outside the context, or is excluded by
`.dockerignore`, fails the build at that instruction with a not-found error naming the path —
not at run time, and not silently. A context that accidentally includes the whole repository,
`node_modules` and a `.git` directory shows up as a slow "transferring context" phase and an
image far larger than the application. Nothing downstream exists yet: there is no image, so
there is nothing to tag, push, pull or schedule.

<a id="b-step-2"></a>
### 2. Layers, and which instructions make them

**Mechanism.** `RUN`, `COPY` and `ADD` create a filesystem
[layer](05-devops/containers.md#c-devops.containers.image-layers). Most other instructions —
`FROM` aside, which selects the base image whose layers you inherit — write metadata into the
image configuration only: `ENV`, `LABEL`, `EXPOSE`, `USER`, `ARG`, `CMD`, `ENTRYPOINT`.
`WORKDIR` writes metadata too, but also creates its directory when that directory is missing,
so it too can add a layer. That single fact answers two different exam questions: how many
layers a shown Dockerfile adds, and why an instruction that "changes the image" left the
filesystem untouched.

Instructions execute in order and each layer's result is cached. A change invalidates its own
layer and every layer after it, which is the entire argument for copying a dependency
manifest and installing dependencies *before* copying the source tree. Layers are
content-addressable, so identical content has an identical digest and is stored and
transferred once — the same property that makes a pull fetch only the layers a host lacks.

The consequence people miss is that a layer records a change, and later changes do not erase
earlier ones. A file added in one layer and deleted in a later one is still present in the
earlier layer. There is no "undo" instruction, and a rebuild that deletes a leaked credential
in a subsequent `RUN` has not removed anything.

**Failure and symptom.** Cache invalidation put in the wrong order shows up as a build whose
time is dominated by a step that has not changed — the dependency install running on every
source edit. A secret written into a layer shows up as nothing at all, which is exactly the
problem: the image passes every test and the credential is extractable by anyone who can pull
it. Both failures survive into every later step, because the image is immutable once built.

<a id="b-step-3"></a>
### 3. The image and its tag

**Mechanism.** The [image](05-devops/containers.md#c-devops.containers.container-image) is the
built artifact: a manifest listing its contents, a configuration object holding the run-time
defaults, and the layer archives themselves. Its identity is a content digest —
`api@sha256:…` — which names exact bytes.

A [tag](05-devops/containers.md#c-devops.containers.image-tags) is not an identity. It is a
mutable, human-readable pointer inside a repository, and it can be repointed at any time by
pushing something else under the same name. `latest` is not "the newest build" and is not
computed from version numbers; it is simply the label applied by default when a build or a
reference specifies no tag at all. Kubernetes encodes this in its own defaults: when
`imagePullPolicy` is left unset, an image referenced by a specific non-`latest` tag defaults
to `IfNotPresent`, while an image referenced as `:latest` or with no tag at all defaults to
`Always` — because the platform cannot assume a mutable pointer still means what it meant an
hour ago. The Kubernetes documentation's own advice is to avoid `:latest` in production and
pin a meaningful tag, a digest, or both.

**Failure and symptom.** A tag repointed between two pulls means two nodes legitimately run
different code under one name; the symptom is behaviour that differs per replica with no
configuration difference to explain it, and it gets worse as replicas are rescheduled at
different times. A rollback attempted against `:latest` has no earlier reference to return to.
Both are step-3 failures even though they only become visible at step 8, during a rollout.

<a id="b-distribute"></a>
## Distribute: image to node

<a id="b-step-4"></a>
### 4. Push, pull, and the registry

**Mechanism.** The [registry](05-devops/containers.md#c-devops.containers.registry) is the
hand-off between building and running: one host builds, the registry stores, and every host
that will run the workload pulls. A full reference is
`registry/namespace/repository:tag` — `registry.example.com/team/api:1.4.2`. Omit the registry
host and the Docker CLI substitutes Docker Hub, which is why the bare name `ubuntu` resolves
to a Docker Hub repository and why an image tagged only `api:1.4.2` pushes to Docker Hub
rather than to the private registry someone assumed. The registry API the push and pull travel
over is standardised by the OCI Distribution Specification, one of the three specifications
that make an image built with one tool runnable by another
([runtime and OCI](05-devops/containers.md#c-devops.containers.container-runtime-and-oci)).

In a cluster the pull happens once per node, not once per cluster, and it happens with the
node's credentials — not the credentials of the laptop the image was built on.

**Failure and symptom.** Pushing without authentication, or into a namespace you do not own,
returns an access-denied error at push time. On the pull side Kubernetes has a named state:
the container sits in `Waiting` with reason `ImagePullBackOff`, meaning the image could not be
pulled — a wrong name, a nonexistent tag, or a private registry with no `imagePullSecret` —
and the kubelet is retrying with a growing delay. This is the step that owns "it works on my
laptop but the cluster will not start it": the image is in the local image store of the build
host and was never pushed, or the reference names a registry the node cannot reach or
authenticate to.

<a id="b-run"></a>
## Run: a process on a kernel

<a id="b-step-5"></a>
### 5. The runtime: namespaces and cgroups

**Mechanism.** The [container runtime](05-devops/containers.md#c-devops.containers.container-runtime-and-oci)
turns the image into a running process. It unpacks the image's layers into a filesystem
bundle, stacks them read-only with one thin writable layer on top for this container alone,
then hands the bundle to a low-level runtime — runc is the default implementation underneath
both containerd and CRI-O — which does the actual work.

That work is two kernel features, and naming them is what separates a candidate who
understands containers from one who has memorised a slogan. **Namespaces** narrow what the
process can see: its own process tree (pid), its own network stack and interfaces (net), its
own mount table (mnt), its own hostname (uts), its own inter-process communication objects
(ipc), and optionally its own user and group ID mapping (user). **Cgroups** limit what it can
consume: a share of CPU, a ceiling on memory, accounting for both. Neither one is a virtual
machine, and neither one boots anything. The process is then executed as PID 1 inside that
narrowed view, and the [container](05-devops/containers.md#c-devops.containers.container)
exists exactly as long as that process runs.

**Failure and symptom.** A container whose main process exits immediately is the commonest
symptom in the whole area, and it is almost never broken isolation — it is a command that ran
and finished, or failed to start. `docker ps` shows nothing because it lists only running
containers; `docker ps -a` shows it as `Exited`, and
[logs](05-devops/containers.md#c-devops.containers.container-logs-and-exec) show why. Note
which diagnostic still works: logs replay a captured stream and work on a dead container,
while `exec` needs a live process to join and does not.

The cgroup failure has its own fingerprint. A process that exceeds its memory limit is killed
by the kernel, the container is reported as `OOMKilled`, and the exit code is 137 — 128 plus
signal 9. In Kubernetes a container that keeps exiting is restarted with a growing delay and
reported as `CrashLoopBackOff`, which is a statement about the restart loop, not a diagnosis:
the diagnosis is in the previous container's logs.

<a id="b-step-6"></a>
### 6. Container versus virtual machine: what is shared

**Mechanism.** Everything at step 5 rests on one architectural fact:
[a container shares the host kernel](03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.container-vs-virtual-machine).
What is *not* shared is the process's view — the namespaced pieces above — plus a
cgroup-bounded share of CPU and memory, plus its own writable layer. What *is* shared is the
kernel itself, its version and modules, its scheduler, and the machine's CPU architecture.

A [virtual machine](03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.virtual-machine)
inverts that: the [hypervisor](03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.hypervisor)
gives each guest virtual hardware, the guest boots its own kernel through firmware, boot
loader and init, and therefore can run a different OS family and keeps a compromise inside its
own kernel. Every difference the exam lists — millisecond start versus a boot, density,
weaker isolation, no guest OS to patch — is a consequence of that one choice, not an
independent fact to memorise. The two are also not alternatives in practice: in a public cloud
your containers run on provider-operated VMs, which is where
[virtualization](03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.virtualization)
and the [shared responsibility model](03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.shared-responsibility-model)
re-enter the chain.

**Failure and symptom.** Choosing a container where a foreign kernel is required does not
produce a subtle bug, it produces an impossibility: a Windows-kernel workload cannot be a
container on a Linux host, and a Linux image on a Windows or macOS workstation is running
inside a Linux VM whether or not anyone says so. The architecture mismatch has its own crisp
symptom — an image built for one CPU architecture started on another fails with
`exec format error`, which reads like a corrupt binary and is actually a portability
assumption that was never true. And the isolation failure has no symptom at all until it
matters: a kernel-level flaw is shared by every container on that kernel, which is precisely
why "it is only a container, run it as root" is the wrong instinct
([container security basics](05-devops/containers.md#c-devops.containers.container-security-basics)).

<a id="b-schedule"></a>
## Schedule: pod, Deployment, Service

<a id="b-step-7"></a>
### 7. The pod as the scheduling unit

**Mechanism.** A [pod](05-devops/containers.md#c-devops.containers.pod) is not a synonym for a
container. It is Kubernetes' smallest deployable unit: one or more containers plus the
namespaces and volumes they share, always co-located and co-scheduled on one
[node](05-devops/containers.md#c-devops.containers.cluster-and-node). The scheduler places
pods, never containers, so a pod's containers can never be split across two machines.

Kubernetes documents the sharing precisely. Every container in a pod shares the network
namespace, which means one IP address and one port space: they reach each other over
`localhost`, and two of them cannot bind the same port. They can share volumes declared at pod
level, and they see the pod's name as their hostname. They do not share a process namespace by
default — that is opt-in. One container per pod is the normal case, with the pod acting as a
wrapper; more than one belongs together only when the containers are genuinely tightly
coupled, and grouping them is a co-location decision, never a scaling one. Scaling means more
pods.

Pods are disposable. A failing pod is replaced rather than repaired, and the replacement is a
new pod with a new name and a new IP address — which is the whole reason step 9 exists.

**Failure and symptom.** The step-7 failure is scheduling, and it looks unlike every failure
above it: the pod sits in `Pending` with a `FailedScheduling` event, because no node has
enough allocatable CPU or memory, or no node matches the pod's constraints. Nothing is wrong
with the image, the registry, or the application — a candidate who reaches for `logs` here
finds nothing, because no container was ever created. A second, quieter step-7 failure is two
containers in one pod configured on the same port: one of them fails to bind, because they
share a port space by definition.

<a id="b-step-8"></a>
### 8. The Deployment and replica management

**Mechanism.** A [Deployment](05-devops/containers.md#c-devops.containers.deployment) declares
how many pods should exist and the template they are created from. It does not create pods
directly: the Deployment creates a ReplicaSet, and the ReplicaSet creates the pods, with a
`pod-template-hash` label keeping one Deployment's ReplicaSets from overlapping.

Changing the pod template — a new image tag, a new environment value — creates a *new*
ReplicaSet, which is scaled up while the old one is scaled down. Kubernetes' default rolling
update allows 25% of the desired pods to be unavailable and 25% extra to be created above the
count during the transition; each template change is a revision, ten old ReplicaSets are
retained by default, and `kubectl rollout undo` returns to a previous one. This is where
replica count, rolling updates and rollback live — not on the pod, which knows nothing about
how many of itself should exist, and not on the Service, which only addresses whatever pods
currently match its selector.

Reconciliation is continuous, which is the mechanism behind every "self-healing" claim
([declarative configuration and desired state](05-devops/containers.md#c-devops.containers.declarative-configuration-and-desired-state)).
Delete one of its pods by hand and the declared count is unsatisfied, so a replacement appears
within seconds. Removing the workload means changing or deleting the Deployment.

**Failure and symptom.** A rollout that stalls is the signature step-8 failure, and it is
usually a step-3, step-4 or step-5 fault surfacing here: the new ReplicaSet's pods never become
Ready — bad tag, failed pull, crash on startup — so the old ReplicaSet is never fully scaled
down and both exist at once. `kubectl rollout status` does not return; the Deployment reports a
`Progressing` condition with reason `ProgressDeadlineExceeded`; the pod list shows old pods
`Running` and new pods in `ImagePullBackOff` or `CrashLoopBackOff`. Kubernetes takes no
corrective action on its own — it reports the condition and waits. Note that the rolling update
parameters are what stopped this from being an outage: the old pods were never removed, because
the new ones never became available.

<a id="b-step-9"></a>
### 9. The Service and cluster networking

**Mechanism.** A [Service](05-devops/containers.md#c-devops.containers.kubernetes-service)
exists because pod IPs are not stable. It selects a set of pods by label, tracks the ready ones
automatically as they come and go, and presents one address and one DNS name in front of them,
balancing traffic across whatever is ready at that instant. A Service in namespace `my-ns`
called `my-service` is resolvable in-cluster as `my-service.my-ns`, and that name resolves to
the Service's cluster IP, not to any pod.

The three types answer an exposure question, and the exam asks it directly. `ClusterIP` is the
default and is reachable only from inside the cluster. `NodePort` additionally exposes the
Service on a static port on every node — and still allocates a cluster IP underneath.
`LoadBalancer` exposes it externally through a load balancer that Kubernetes does not itself
provide: you supply one, or the [cloud provider](03-cloud-computing/cloud-computing.md#c-cloud.cloud-computing.managed-services)
provisions it.

The linkage is labels alone. A Service neither creates pods nor knows which Deployment produced
them, and that indifference is exactly what lets a rolling update replace every pod underneath
without a caller noticing.

**Failure and symptom.** The archetypal step-9 failure is "everything is created, nothing
works". A Service whose selector matches no pod labels still exists, still owns a cluster IP,
and still resolves in DNS — it just has no backends, so connections to it fail while every
`kubectl get` output looks healthy. The same empty-backend symptom appears when the pods exist
but are not Ready, because a Service only routes to ready pods; that makes a failing readiness
probe present as a networking fault. A third variant reaches the pod and dies there: a
`targetPort` naming a port nothing inside the container listens on, which is the cluster-scale
version of the single-host mistake of publishing a port the application never bound
([port mapping](05-devops/containers.md#c-devops.containers.port-mapping)). And a `ClusterIP`
Service is not reachable from outside the cluster no matter how the application is configured.

<a id="b-seam"></a>
## The seam

<a id="b-step-10"></a>
### 10. Where orchestration takes over from the runtime

**Mechanism.** The division of labour is clean, and stating it is worth more marks than any
individual definition in this appendix.

The runtime's job stops at one machine. Given an image and a specification, it creates
namespaces, applies cgroups, and starts a process — steps 5 and 6, and nothing else. It does
not decide which machine, does not know how many copies should exist, does not notice that a
node has died, and never builds an image.

[Orchestration](05-devops/containers.md#c-devops.containers.container-orchestration) is
everything the runtime cannot do because it only sees one host: choosing a node, maintaining a
replica count, replacing what fails, rolling out a change gradually, and putting a stable
address in front of an unstable set of instances. Its distinguishing property is not "manages
many containers" — [Docker Compose](05-devops/containers.md#c-devops.containers.docker-compose)
does that on one host and is still not an orchestrator. It is many hosts *plus* continuous
reconciliation: something that keeps comparing actual against declared, indefinitely, with no
human running a command.

The kubelet is the hinge. It watches the [control plane](05-devops/containers.md#c-devops.containers.control-plane)
for pods bound to its node and drives that node's runtime through the Container Runtime
Interface to make them real. That interface is why the "Kubernetes dropped Docker" story is a
non-event for images: Kubernetes removed its built-in dockershim in v1.24 and talks to
containerd, CRI-O or another CRI implementation instead, while images produced by Docker
remain OCI images that run there unchanged. One more governance fact rides along here, because
it is examinable and routinely inverted: [Kubernetes](05-devops/containers.md#c-devops.containers.kubernetes)
is *hosted by* the [CNCF](05-devops/containers.md#c-devops.containers.cncf) as a graduated
project and *governed by* its own Steering Committee. The CNCF hosts, funds and supports; it
does not govern.

**Failure and symptom.** Losing the control plane does not stop the application: pods already
running on healthy nodes keep serving traffic, because the kubelet and the runtime on each node
need no permission to continue. What stops is everything that requires a decision — new
scheduling, rollouts, scaling, replacing a pod that dies during the outage. The mirror-image
failure is at the node: lose a node in a Compose-style single-host deployment and the
application is simply down, because nothing is watching; lose one in a cluster and its pods are
recreated elsewhere, with new names and new IPs, which is only survivable because step 9 never
addressed them individually in the first place.

<a id="b-backwards"></a>
## Reading the chain backwards

The chain is also a diagnostic order. Given a symptom, the earliest step that can produce it
is where to look first — later steps are frequently the place a fault becomes *visible*, not
the place it lives.

| Symptom | Earliest step that explains it | What to check |
| --- | --- | --- |
| Build stops at a `COPY` | 1 | The path is outside the build context or excluded by `.dockerignore` |
| Every code change triggers a full dependency install | 2 | Instruction order — a changed layer invalidates every layer after it |
| A deleted secret is still extractable from the image | 2 | It was written into a layer; only a rebuild that never adds it helps |
| Two replicas behave differently with identical config | 3 | A mutable tag was repointed between pulls; pin a version or a digest |
| Push rejected with an access-denied error | 4 | The image name carries no registry host, or the credentials lack access |
| `ImagePullBackOff` on a node | 4 | Wrong name or tag, unreachable registry, or a missing image pull secret |
| Container exits immediately, `docker ps` shows nothing | 5 | `docker ps -a` plus logs — the main process ran and finished, or failed |
| Container killed, exit code 137, `OOMKilled` | 5 | The cgroup memory limit, or the application's real footprint |
| `exec format error` | 6 | Image CPU architecture does not match the host |
| A workload needs a different OS kernel | 6 | It is a VM requirement; a container shares the host kernel |
| Pod stuck in `Pending`, `FailedScheduling` | 7 | Node capacity or placement constraints; no container was created |
| Two containers in one pod, one will not bind its port | 7 | They share one network namespace and one port space |
| Deleted pod reappears within seconds | 8 | Working as declared — the replica count is being reconciled |
| Rollout never completes, `ProgressDeadlineExceeded` | 8 | New pods are not becoming Ready; the cause is usually step 3, 4 or 5 |
| Everything is created, nothing connects | 9 | Selector-to-label mismatch, or no pod is Ready, so there are no endpoints |
| Reachable inside the cluster, not outside | 9 | `ClusterIP` is internal-only; `NodePort` or `LoadBalancer` is the change |
| Cluster changes are refused, running apps unaffected | 10 | Control plane availability, not workload health |

<a id="b-check"></a>
## Knowledge check

1. Which Dockerfile instructions create a filesystem layer, and what do the rest do?
   `RUN`, `COPY` and `ADD` create layers; most other instructions record configuration
   metadata in the image config only. `WORKDIR` is the edge case: it sets metadata but also
   creates its directory when that directory is missing, so it can add a layer too.
2. What is the trailing `.` in `docker build -t api:1.4.2 .`, and what does it constrain?
   The build context directory. `COPY` and `ADD` may only read paths inside it, so a source
   outside the context fails the build.
3. Why is a tag not an identity, and what is?
   A tag is a mutable pointer inside a repository and can be repointed by a later push; the
   content digest names exact bytes and cannot be.
4. Name the two kernel features that make a container, and what each one does.
   Namespaces narrow what the process can see — process tree, network, mounts, hostname, IPC —
   and cgroups limit what it can consume, chiefly CPU and memory.
5. A container exits with code 137 and is reported `OOMKilled`. Which step of the chain is
   that, and what is the immediate cause?
   Step 5: the process exceeded its cgroup memory limit and was killed by the kernel with
   signal 9.
6. A pod sits in `Pending` with a `FailedScheduling` event. Why are the container logs no help?
   No container was created — the scheduler could not place the pod, so the runtime was never
   asked to do anything.
7. A rollout stalls with old pods `Running` and new pods in `ImagePullBackOff`. Which object
   reports the stall, and where does the fault actually live?
   The Deployment reports it as a `Progressing` condition with reason
   `ProgressDeadlineExceeded`; the fault is upstream, at the image reference or the registry.
8. Every object exists and looks healthy, but nothing can connect to the Service. What are the
   two usual causes?
   The selector matches no pod labels, or the matching pods are not Ready — either way the
   Service has no endpoints while still owning a cluster IP and a DNS name.
9. State the boundary between the runtime and the orchestrator in one sentence each.
   The runtime creates and runs containers on one machine; the orchestrator decides which
   machine, how many, and what to do when that changes, and keeps reconciling indefinitely.
10. What is the relationship between the CNCF and Kubernetes?
    The CNCF hosts Kubernetes as a graduated project and provides funding and support;
    Kubernetes is governed by its own Steering Committee.
