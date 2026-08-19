<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — DevOps Fundamentals :: Containers

86 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A candidate is asked to place cluster, node, pod, and container in a containment hierarchy from largest to smallest. What is the correct order?

- **A.** A node contains clusters, a cluster runs pods, and a pod holds containers.
- **B.** A cluster contains pods directly, and nodes are an optional layer that some clusters omit entirely.
- **C.** A pod contains nodes, and a node runs directly inside a container.
- **D.** A cluster contains nodes, a node runs pods, and a pod holds containers.

**Answer: D.** Node, pod, and container form a containment hierarchy the exam expects a candidate to keep straight: a cluster contains nodes, a node runs pods, and a pod holds containers.

- A is wrong: This reverses the cluster and the node; a cluster is the larger pool that a node belongs to, not the other way around.
- B is wrong: Every cluster needs at least one worker node in order to run pods at all; a node is not an optional layer.
- C is wrong: This inverts the entire hierarchy; a node is a machine that runs pods, not something contained inside one.

### 2.

A new pod remains stuck in a not-starting state, and every node in the cluster is already running workloads near its resource limit. What level does this problem resolve to?

- **A.** The registry level, since a pod that cannot start is always evidence that the image it references failed to be pulled from the registry named in its manifest.
- **B.** The container level, since the pod's individual containers must each be resized before the pod as a whole can be scheduled.
- **C.** The node level, because no node has enough spare resource capacity for the scheduler to place the pod, which is exactly the constraint it schedules against.
- **D.** The Service level, since a stable network endpoint must exist before the scheduler will place any pod behind it.

**Answer: C.** Node capacity is what the scheduler places workloads against, so a pod stuck not starting frequently resolves to a node-level answer — insufficient resources, or no node matching the pod's constraints.

- A is wrong: The scenario describes nodes already at their resource limit, not a failed pull; a registry problem would surface differently.
- B is wrong: Scheduling decides which node a pod goes to as a whole; resizing individual containers inside it does not address the described lack of node capacity.
- D is wrong: A Service governs addressing after pods exist; it is not a prerequisite the scheduler checks before placing a pod on a node.

### 3.

A node running several pods that belong to Deployments is drained for maintenance. What happens to those pods, and why is this considered safe?

- **A.** They are recreated on other nodes, which is safe only because pods are treated as disposable and their replacements can serve requests just as well.
- **B.** They pause in place on the draining node and resume there once maintenance finishes, since draining marks a node unschedulable without moving the pods already running on it.
- **C.** They are deleted permanently, since draining is treated identically to scaling the replica count down to zero.
- **D.** They are converted into a Service so that traffic can continue reaching the maintenance node directly.

**Answer: A.** Nodes are replaceable: draining one causes its pods to be recreated elsewhere, which is only safe because pods are treated as disposable rather than as irreplaceable, hand-tended processes.

- B is wrong: Draining specifically causes a node's pods to be recreated elsewhere so maintenance can proceed without leaving workloads stranded on it.
- C is wrong: Draining moves workloads to other nodes rather than reducing any declared count; the pods are recreated, not permanently removed.
- D is wrong: A Service is an addressing abstraction in front of pods; draining a node has no effect that converts a pod into one.

### 4.

Which statement correctly places the CNCF relative to the Linux Foundation and to Kubernetes?

- **A.** The CNCF is the parent organisation of the Linux Foundation, and Kubernetes is therefore governed directly by the CNCF's own board rather than by any elected committee belonging to the project.
- **B.** The CNCF hosts only the Linux kernel, while Kubernetes is hosted by a separate and unrelated foundation with no Linux Foundation ties.
- **C.** The CNCF is a for-profit vendor consortium that owns the trademarks of every open source project it hosts, Kubernetes included.
- **D.** The CNCF is part of the nonprofit Linux Foundation and hosts Kubernetes as one of its graduated projects, providing infrastructure, events, and marketing rather than technical direction.

**Answer: D.** The Cloud Native Computing Foundation is part of the nonprofit Linux Foundation and hosts a large portfolio of vendor-neutral open source projects, Kubernetes among them, sustaining the ecosystem with infrastructure, events, and marketing rather than technical governance.

- A is wrong: The relationship runs the other way — the CNCF is part of the Linux Foundation, not its parent — and Kubernetes is governed by its own Steering Committee regardless.
- B is wrong: The CNCF's portfolio is the cloud-native ecosystem, Kubernetes included; the Linux kernel is a Linux Foundation project hosted separately from the CNCF's own portfolio.
- C is wrong: The CNCF is a nonprofit foundation whose mission is making cloud native computing ubiquitous, not a for-profit vendor consortium.

### 5.

A candidate reads a question naming both an organisation and a project it hosts, and correctly suspects it is testing whether they collapse hosting and governing into one role. What is the safest general answer to that kind of question?

- **A.** State the hosting relationship and the separate governing body explicitly, rather than assuming the host also directs the project technically.
- **B.** Assume the named organisation both hosts and governs, since a foundation prominent enough to host a project of that size usually also directs its technical roadmap.
- **C.** Assume the project governs itself entirely with no relationship to any hosting organisation at all.
- **D.** Treat the question as unanswerable without knowing the specific committee names involved.

**Answer: A.** This is the same shape as the Linux Foundation's relationship to the Linux kernel, and a question that names one organisation and one project is usually probing whether the candidate collapses the two roles into one — naming hosting and governing as distinct answers it correctly.

- B is wrong: The CNCF charter states that included projects continue under their existing technical governance structure, so hosting a project does not carry technical direction with it.
- C is wrong: The hosting relationship is real and examinable — funding, infrastructure, and marketing support genuinely come from the host — so denying it entirely is also wrong.
- D is wrong: The relationship can be stated correctly without naming an individual: the CNCF hosts and funds, while the project's own elected Steering Committee governs.

### 6.

A new open source project applies to join the CNCF's portfolio. What does progressing from sandbox to graduated status actually represent?

- **A.** The point at which the CNCF takes over day-to-day technical decisions from the project's own maintainers.
- **B.** Demonstrated adoption and governance maturity, tracked by the CNCF as hosting stages, not a transfer of technical direction to the foundation.
- **C.** A rebranding step in which the project's name and trademark transfer fully to Linux Foundation ownership.
- **D.** The moment a project is required to switch its container runtime to containerd and adopt the CNCF's own release cadence as a condition of remaining hosted.

**Answer: B.** Projects enter at sandbox level and progress through incubating to graduated as adoption and governance maturity are demonstrated; a Technical Oversight Committee maintains the foundation's technical vision, while day-to-day technical authority stays with each project's own maintainers.

- A is wrong: Day-to-day technical authority stays with each project's own maintainers and governance structures regardless of hosting stage.
- C is wrong: Graduation is a hosting-maturity classification, not a trademark or naming transfer event of that kind.
- D is wrong: Hosting stage has no bearing on which container runtime a project uses; the CNCF imposes no such technical requirement as a condition of graduation.

### 7.

One image, dockerfile, and registry all appear in a single deployment write-up. Which pairing correctly matches recipe, artifact, and distribution point?

- **A.** The image is the recipe read by the build process, and the Dockerfile is the artifact that recipe produces once built That framing reverses the build direction: nothing reads an image to produce a Dockerfile.
- **B.** The Dockerfile is the recipe, the image is the built artifact produced from it, and the registry is where that artifact is stored and distributed.
- **C.** The registry is the artifact itself, and the image is merely the remote server that stores registries.
- **D.** An image cannot exist unless a registry currently holds it, since the local image store is only a temporary cache of registry content.

**Answer: B.** The Dockerfile/image/registry comparison separates recipe, built artifact, and distribution point. An image can exist purely locally with no Dockerfile in sight and no registry ever involved, which is exactly what the wrong answers deny.

- A is wrong: This reverses the two: the Dockerfile is read to produce the image, never the other way around.
- C is wrong: The registry is the server; the image is the artifact it stores, not the reverse relationship.
- D is wrong: An image built locally and never pushed anywhere is still a complete, usable image; the registry is optional distribution, not a requirement for existence.

### 8.

An engineer wants to see which artifacts occupy local disk before deciding what to prune, distinct from what is currently running. Which command answers that, and what does it list?

- **A.** `docker ps -a`, which lists every container instance so far created, running or not.
- **B.** `docker images`, which lists the templates held in the local image store rather than any running or stopped instance.
- **C.** `docker build .`, which rebuilds every locally cached layer and prints a fresh inventory as it goes That framing treats a build command as a reporting tool rather than one that produces a new image.
- **D.** `docker pull`, which downloads the current state of every image the host has ever referenced.

**Answer: B.** `docker images` enumerates the local image store, the class-level view of what could be run; `docker build` produces new images from a Dockerfile and executes no application code in the process.

- A is wrong: That reports instances, not the templates they were created from, and would not show unused images at all.
- C is wrong: A build compiles a new image from a Dockerfile; it does not enumerate what already exists in the local store.
- D is wrong: A pull fetches one named image from a registry; it does not summarise what is already sitting locally.

### 9.

A production incident traces to an outdated dependency compiled into the application's filesystem. Which fix category does this belong to, as opposed to a wrong runtime flag?

- **A.** An image problem: the dependency is baked into the layers, so it requires rebuilding, retagging and repushing before any container can pick up the fix.
- **B.** A container problem: stopping and starting the same container refreshes its filesystem to match whatever the image currently contains Under that framing, editing a running container's files and restarting it would silently discard the edits.
- **C.** A registry problem: the fix is to point the deployment at a different registry host that happens to carry a patched dependency.
- **D.** An environment-variable problem: setting the correct version string at run time overrides whatever the filesystem contains.

**Answer: A.** Deciding whether a fix belongs to the image or the running container is the class/instance discrimination this concept exists to teach: filesystem content is an image-level fact, and only a rebuild changes it.

- B is wrong: Starting a stopped container reuses the writable layer it already has; it never re-syncs against a newer version of the image.
- C is wrong: The registry only stores whatever artifact was pushed to it; switching hosts does not change what is inside the image itself.
- D is wrong: Environment variables configure the application at run time; they cannot rewrite a dependency already compiled into the filesystem.

### 10.

Every container built from a particular image was removed with `docker rm`, yet the host's disk usage barely changed. What still occupies the space?

- **A.** Nothing should remain, so the missing space is most likely an accounting delay in the disk usage tool being consulted That framing assumes the reported figures are simply stale rather than measuring genuinely different things left on disk.
- **B.** Named volumes attached to those containers, which Docker never releases automatically under any circumstance.
- **C.** Cached build context from the last time the image was built, which is stored independently of the image layers.
- **D.** The image itself, which is a separate object from any container and persists on disk until something removes it directly.

**Answer: D.** An image is a distinct object from any container created from it, and `docker rm` only removes a container and its writable layer; the underlying image, and the disk it occupies, needs `docker rmi` to reclaim.

- A is wrong: The image genuinely still exists on disk; this is not a reporting artifact but the expected, documented behaviour.
- B is wrong: Volumes are a separate persistence mechanism entirely, and the question describes ordinary container removal with no volumes mentioned.
- C is wrong: Build context is sent to the builder during a build and is not retained afterward as a separate disk consumer.

### 11.

An operator says a container was "deleted" after running `docker stop web`. Is the container actually gone?

- **A.** Yes, because `docker stop` and `docker rm` both delete the container object and reclaim its disk space identically, treating a stopped container as already gone rather than merely paused.
- **B.** No, but the confusion is harmless since a stopped container can never be started again under any circumstance.
- **C.** No, it is stopped, not removed; it still holds its writable layer, configuration, and logs, and continues to consume disk until it is explicitly removed.
- **D.** Yes, and the underlying image it was built from is removed along with it as part of the same operation.

**Answer: C.** The lifecycle runs created, running, paused, stopped, and removed. Stopping is not removing: a stopped container keeps its identity, its writable layer, and its logs until `docker rm` deletes it.

- A is wrong: `docker stop` and `docker rm` act on different lifecycle transitions; only removal deletes the container object and frees its writable layer.
- B is wrong: A stopped container is exactly the object `docker start` resumes, using the configuration it was created with; it is very much restartable.
- D is wrong: Stopping, and even removing, a container never touches the image it came from; images and containers are removed by separate commands.

### 12.

A running container needs its published port changed from 8080 to 9090. An engineer tries `docker start web -p 9090:80` and it fails. What is the correct sequence?

- **A.** Run `docker stop web` and then `docker start web -p 9090:80`, since stopping clears the old configuration for the next start That framing assumes `docker start` accepts new flags at all, which it does not.
- **B.** Stop the container, remove it with `docker rm`, and `docker run` a new one with the new `-p` mapping, since run-time flags are fixed at creation.
- **C.** Edit the image with `docker build` to bake in the new port, then restart the same container.
- **D.** Set a new environment variable with `docker run -e` naming the port, which the running container will pick up automatically.

**Answer: B.** `docker start` resumes an existing stopped container using the configuration it was created with; a changed published port or environment variable requires `docker stop`, `docker rm`, and a fresh `docker run` with the new flags.

- A is wrong: `docker start` never accepts new run-time flags regardless of whether the container was just stopped; the configuration it resumes is fixed.
- C is wrong: A published port is a run-time container setting, not something recorded in the image; rebuilding the image changes nothing about it.
- D is wrong: An environment variable does not control which host port is published, and a running container does not pick up new run-time settings at all.

### 13.

A container host is running low on disk, and the application data itself is small. What is the most likely accumulation causing it?

- **A.** Stopped containers and unused images that were never removed, each still holding its writable layer or full set of image layers.
- **B.** Named volumes, since Docker silently doubles their size on every container restart as a caching side effect.
- **C.** Registry credentials cached locally for every image ever pulled, which grow without bound.
- **D.** Log output from `docker exec` sessions, which Docker retains indefinitely by default for every interactive session opened That framing conflates the process a container was started with and the extra processes attached to it afterward.

**Answer: A.** A stopped container keeps its writable layer, and an image with no containers referencing it still occupies disk until explicitly removed. This accumulation is a very common cause of disk pressure on hosts that run many short-lived containers.

- B is wrong: Restarting a container that mounts a named volume does not duplicate or grow the volume's content in any way.
- C is wrong: Cached registry credentials are a small, fixed-size artifact and are not a plausible source of meaningful disk pressure.
- D is wrong: An exec session is not logged or retained separately by Docker at all; it runs an additional process and leaves no persistent record of its own.

### 14.

`docker stop web` is issued against a container whose application ignores termination signals. What happens next?

- **A.** The runtime sends SIGTERM, waits a grace period, and then forcibly kills the process if it has not exited by then.
- **B.** `docker stop` waits indefinitely, since it is defined to never force-terminate a container under any circumstance.
- **C.** The container is immediately removed along with its writable layer, since ignoring the signal is treated as a failure requiring cleanup.
- **D.** The runtime restarts the container automatically to give the application another chance to shut down properly.

**Answer: A.** `docker stop` sends SIGTERM and, if the process has not exited after a grace period (`-t` controls it), sends SIGKILL. This lets applications shut down cleanly when they honour the signal, while still guaranteeing termination when they do not.

- B is wrong: `docker stop` always eventually force-kills the process once its grace period elapses; it does not wait forever for voluntary termination.
- C is wrong: Ignoring the signal only delays the stop; the container is left in a stopped state afterward, not removed.
- D is wrong: A stop request does not trigger a restart cycle; the runtime proceeds toward stopping the same container, not recreating it.

### 15.

A container exited five minutes ago with an error. Which diagnostic step still works, and which does not?

- **A.** `docker logs` still works, because it replays the already-captured stdout and stderr stream; `docker exec -it` does not, because it needs a running process to join.
- **B.** Neither works once a container has exited, since both diagnostic commands require the container to still be running.
- **C.** `docker exec -it` still works on an exited container as long as `-t` allocates a fresh terminal for it.
- **D.** Both work identically, because Docker keeps an exited container's filesystem on disk and queryable, which is all that either of the two commands needs in order to run.

**Answer: A.** Diagnostic order matters: `docker logs` reads the captured stdout/stderr stream and works on a container that has already exited, while `docker exec -it` needs a running process to join and does not.

- B is wrong: `docker logs` specifically works on an exited container because it reads a captured stream rather than talking to a live process.
- C is wrong: Allocating a terminal does not create a process to run inside; exec always needs a running container to attach its new process to.
- D is wrong: An exited container's filesystem being on disk does not make it possible to start a new process inside it; exec still requires a live main process.

### 16.

An application inside a container writes its own log file to `/var/log/app.log` instead of standard output, and `docker logs web` shows nothing useful. What is the fix, and which command exposes the problem?

- **A.** Run `docker logs -f` instead of the plain form, since `-f` widens what the command reads to include log files written anywhere inside the container's own filesystem, not just its output stream.
- **B.** Mount a volume at `/var/log` so the file becomes visible to `docker logs` automatically once it is outside the writable layer.
- **C.** Set `-e LOG_PATH=/var/log/app.log` so the runtime knows where to redirect the captured stream from.
- **D.** Reconfigure the application to log to stdout and stderr; `docker exec -it web sh` can confirm the file exists inside the container while the platform never sees it.

**Answer: D.** Containers deliberately have no journal or syslog by convention, so applications are expected to log to stdout and stderr, which the platform captures. A file written inside the container is invisible to `docker logs` and lost when the container is removed.

- A is wrong: `-f` only follows the same captured stdout/stderr stream live; it does not search the container's filesystem for log files.
- B is wrong: A volume makes a path persistent across container recreation, but it does not make `docker logs` read arbitrary files; that command only ever reads the captured output stream.
- C is wrong: An environment variable configures the application, not what `docker logs` reads; the platform always captures stdout and stderr regardless of any such setting.

### 17.

A container's logging driver is configured to ship output to a remote system, and `docker logs` is run against it locally. What should be expected?

- **A.** It always fails outright, because a remote logging driver replaces the local capture entirely with no exceptions.
- **B.** It returns the container's entire filesystem contents instead of just the captured output stream, since the remote driver changes what is read.
- **C.** It requires `docker exec -it` to be run first to establish a connection to the remote logging system before logs can be read.
- **D.** Unless that cache is explicitly disabled, it generally still works, because Docker Engine keeps a local cache of the stream even under a remote driver.

**Answer: D.** Docker Engine's dual logging keeps a local cache of the captured stream even when a remote driver such as `syslog` or `splunk` ships it elsewhere, so `docker logs` still works under a remote driver — it fails only where that cache is explicitly disabled, and returns nothing at all under the `none` driver.

- A is wrong: A remote driver does not categorically replace local capture; Docker Engine's dual logging keeps a local cache in the ordinary case.
- B is wrong: `docker logs` only ever reads the captured stdout/stderr stream, never the filesystem, regardless of which driver is configured.
- C is wrong: `docker logs` and `docker exec -it` are independent commands; neither is a prerequisite for the other under any logging driver configuration.

### 18.

A candidate uses `docker attach` to a running container's main process instead of `docker exec -it`, and a stray Ctrl-C stops the container entirely. What distinguishes the two commands?

- **A.** Both commands behave identically, and the container would have stopped regardless of which one was used.
- **B.** `docker attach` connects a terminal to the existing main process, so signals reach it directly; `docker exec` starts a separate new process instead.
- **C.** `docker attach` only works on stopped containers, so the described scenario could not have actually involved it.
- **D.** `docker exec -it` is the one that connects to the container's existing main process, while `docker attach` is the one that starts an additional shell alongside it.

**Answer: B.** `docker exec` starts a new process inside a running container, isolated from the main one; `docker attach` connects your terminal directly to the existing main process, where signals such as a stray Ctrl-C can reach and stop it.

- A is wrong: An exec session runs an additional process separate from the main one, so a Ctrl-C there terminates only that additional process, not the container.
- C is wrong: `docker attach` requires a running container, since it connects to that container's live main process; it does not work on a stopped one.
- D is wrong: This reverses the two: `docker exec` starts a new process, while `docker attach` connects to the existing main process.

### 19.

A production fleet needs to survive a node failure, scale up under load, and roll out new versions without downtime. A single-host Compose setup already runs the containers involved. What is missing, and why does adding more containers to the same host not fix it?

- **A.** More containers on the same host, since orchestration is fundamentally about running a far larger number of containers than a Compose project on one machine was ever designed to handle.
- **B.** A bigger base image with more resources allocated per container, so each one can absorb more load individually.
- **C.** A faster registry, so that images pull more quickly whenever the single host needs to restart a container.
- **D.** Orchestration across a pool of hosts with continuous reconciliation: the requirement is about surviving a host failure and rescheduling, which a bigger single host cannot provide.

**Answer: D.** The exam's alternative answer to an orchestration requirement is always a single-host tool, usually Compose. The discriminating property is multiple hosts plus continuous reconciliation — something that keeps comparing running state against declared state and acts on the difference indefinitely, which a single, larger host still cannot provide.

- A is wrong: Container count is not the discriminator; the requirement is surviving a host failure, which no number of containers on one host can satisfy.
- B is wrong: Resource allocation per container does not address a host dying entirely, which removes every container on it regardless of how well-resourced each one was.
- C is wrong: Pull speed does not create the additional hosts, scheduling, or health-checking that surviving a node failure and scaling under load require.

### 20.

A node running several workloads stops reporting heartbeats to the orchestrator. What happens to the workloads that were running on it?

- **A.** They stay assigned to that node indefinitely, since an orchestrator reacts only to a workload's own process crashing and has no view of whether a node is still reporting in.
- **B.** They are recreated elsewhere, because nodes are watched the same way workloads are, and a node that stops reporting has its workloads rescheduled rather than left stranded.
- **C.** They are paused rather than recreated, waiting for a human operator to manually confirm the node is actually down.
- **D.** They are removed permanently, since an orchestrator treats a lost node as a signal to reduce the declared replica count.

**Answer: B.** Nodes are watched the same way individual instances are: a node that stops reporting has its workloads recreated elsewhere instead of left stranded, which is exactly the self-healing property a single-host tool cannot offer.

- A is wrong: Nodes are health-checked the same way workloads are; a node that stops reporting triggers rescheduling of its workloads onto healthy nodes.
- C is wrong: Reconciliation acts automatically once a node is detected as unhealthy; it does not wait on a manual confirmation step before rescheduling.
- D is wrong: A lost node does not change what was declared; the orchestrator still works to satisfy the same declared count by scheduling replacements elsewhere.

### 21.

A CI pipeline builds an image, pushes it, and submits an updated declaration to the cluster. Weeks later, a pod crashes and is replaced automatically. Which component is responsible for that replacement?

- **A.** The CI pipeline, since it is triggered automatically to rerun whenever any workload in the cluster crashes.
- **B.** The registry, because it revalidates every image it has served on a fixed schedule and triggers a replacement whenever one of those scheduled checks comes back failing.
- **C.** The container runtime on the node, acting entirely on its own without any coordination from a cluster-level component.
- **D.** The orchestrator, because what keeps the declaration true afterward is the orchestrator's continuous reconciliation, not the pipeline that ran once at deploy time.

**Answer: D.** Orchestration is not CI/CD: a pipeline builds the image, pushes it, and may submit the updated declaration, but what keeps that declaration true for the weeks afterward — including replacing a crashed workload — is the orchestrator, continuously reconciling.

- A is wrong: A pipeline builds and pushes; it plays no role in detecting a crashed workload weeks after it last ran and has no ongoing connection to the cluster's runtime state.
- B is wrong: A registry only stores and serves images on request; it has no scheduling role and does not trigger replacements for crashed workloads.
- C is wrong: The runtime on a node executes what it is told, but deciding to recreate a crashed workload and where to place it is the orchestrator's reconciliation logic, not an independent runtime decision.

### 22.

Someone claims the orchestrator itself is what starts container processes and isolates them, the same way a runtime does. What is wrong with that claim?

- **A.** Orchestration is not a runtime: the orchestrator decides what should run where, while the runtime on each node is what actually starts and isolates the container.
- **B.** Nothing is wrong with it, since the orchestrator and the runtime are simply two names for the same underlying component.
- **C.** It is wrong only because orchestration also does not build or push images, which is a separate and unrelated gap in the claim.
- **D.** It is wrong only because orchestration operates on pods rather than on individual containers, which makes the whole disagreement a Kubernetes-specific matter of vocabulary.

**Answer: A.** Orchestration is not a runtime and not containerization: the orchestrator decides what should run where, and the runtime on each node actually starts it, isolated with namespaces and cgroups, from an image that already exists.

- B is wrong: They are distinct layers with distinct jobs — scheduling and reconciliation versus actually creating and isolating the process — not two names for one thing.
- C is wrong: That is a true additional gap, but it does not address the specific runtime-versus-orchestrator confusion the claim actually makes.
- D is wrong: That distinction is real but separate; the claim's core error is conflating the orchestrator's scheduling role with the runtime's execution role.

### 23.

A candidate claims Docker is the container runtime that actually creates and runs containers on a Kubernetes node. Is that accurate?

- **A.** Yes, and from the release that removed dockershim onward Kubernetes stopped supporting any cluster that does not run Docker specifically as the runtime on every one of its worker nodes.
- **B.** Yes, and images built with any other tool cannot run under containerd or CRI-O as a result.
- **C.** No, Docker is a full toolchain layered above a runtime; containerd and CRI-O are the components a Kubernetes node typically uses to actually run containers.
- **D.** No, and the actual runtime is the registry that images are pulled from before a node can start them.

**Answer: C.** Docker is a full toolchain — CLI, image building, networking, volume management — layered above a runtime. The runtime itself is the component, typically containerd or CRI-O on a Kubernetes node, that actually creates and runs the container process.

- A is wrong: Kubernetes talks to a runtime through the Container Runtime Interface and supports containerd, CRI-O, and other implementations; it never required Docker specifically.
- B is wrong: Images produced by Docker are ordinary OCI images and run unmodified under containerd or CRI-O; the OCI specifications exist precisely to guarantee this.
- D is wrong: A registry only stores and distributes images; it plays no role in actually creating or running a container process on a node.

### 24.

An image built on a laptop with Docker runs unmodified under containerd on a cluster node with no changes needed. What makes that portability guaranteed rather than lucky?

- **A.** Docker Hub silently converts every pushed image into a containerd-specific format before that image can be pulled down onto a cluster node running a different runtime.
- **B.** Kubernetes rebuilds every image from its Dockerfile the first time it is scheduled onto a new node.
- **C.** The Open Container Initiative's Image, Runtime, and Distribution specifications, which keep images and runtimes from different vendors interchangeable.
- **D.** The node's kubelet translates the image's layers into a Kubernetes-native format before the runtime can use them.

**Answer: C.** The OCI's Runtime, Image, and Distribution specifications are what keep an image built with one tool running unmodified under another; the portability claim is a specification being honoured, not marketing.

- A is wrong: No such conversion happens; an image is stored and served as the same OCI-compliant artifact regardless of which registry hosts it.
- B is wrong: Kubernetes never rebuilds images; it pulls the already-built artifact and hands it to the node's runtime to run as-is.
- D is wrong: The kubelet drives the sequence of pulling and running through CRI, but it does not translate or reformat the image; the runtime consumes standard OCI layers directly.

### 25.

A team hears that "Kubernetes dropped Docker" and worries their Docker-built images will stop working on newer clusters. Is that concern justified?

- **A.** Yes, because dropping Docker means the cluster can no longer read images built anywhere except with containerd's own build tool.
- **B.** No, Kubernetes changed which runtime component it talks to directly, but images produced by Docker remain standard OCI images and run there without change.
- **C.** Yes, and every image will need to be repushed to a containerd-specific registry before it can be pulled again.
- **D.** No, because Kubernetes never had any hand in running containers in the first place, so no change it makes to its own components could affect image compatibility either way.

**Answer: B.** Kubernetes talks to a runtime through the Container Runtime Interface and supports containerd, CRI-O, and other CRI implementations. Images produced by Docker remain ordinary OCI images and run there without change — the runtime interface changed, not the image format.

- A is wrong: The image format is OCI-standard regardless of which build tool produced it; the runtime change concerns how Kubernetes runs containers, not what it can read.
- C is wrong: Registries store OCI images regardless of runtime; nothing about a runtime change requires repushing to a different kind of registry.
- D is wrong: Kubernetes does drive container execution through a runtime via the kubelet; the accurate reassurance is about image portability, not that nothing was ever running.

### 26.

A developer argues that running an application as root inside a container is harmless "because it is only a container." Why is that the wrong instinct?

- **A.** It is not wrong, since the namespaces a container is started with make root inside that container fully equivalent to an ordinary unprivileged user account on the host machine itself.
- **B.** Because the kernel is shared with the host, the isolation boundary a compromised root process must cross is thinner than a hypervisor's, so the consequences reach further than in a VM.
- **C.** Because a registry automatically rejects any image that was built and run as root, making the practice self-correcting.
- **D.** Because running as root disables the image's declared `EXPOSE` ports, leaving the application unreachable.

**Answer: B.** Container isolation is weaker than a virtual machine's because the kernel is shared, so a compromise inside a container that runs as root reaches further than the same compromise would inside a VM — the practical answer is running as a non-root user, not adding a scanner at the end.

- A is wrong: Namespaces narrow what a process can see, but they do not eliminate the shared-kernel attack surface a root process can still reach.
- C is wrong: A registry stores whatever it is pushed and performs no inspection of which user an image runs as.
- D is wrong: The user a process runs as has no effect on port publishing; `EXPOSE` and `-p` are unrelated to the container's user.

### 27.

A registry credential is passed into a build with `ARG`, and a later Dockerfile instruction unsets the variable before the image is finished. Is the credential safe once the build completes?

- **A.** Yes, because unsetting a build argument removes that value from every layer of the finished image, not only from the single layer in which the value was last read during the build.
- **B.** Yes, but only if the base image was pinned to a specific version rather than left unpinned.
- **C.** No, it is still present in the layer where it was written, and unsetting it later does not erase it; it must never enter a layer in the first place.
- **D.** It depends on whether the credential was also set with `ENV` in addition to `ARG`, since only `ENV` values persist in layers.

**Answer: C.** A value passed through `ARG` or set with `ENV` persists in the image and can be recovered from it even if a later instruction unsets it, because layers record history and nothing erases an earlier one — the only reliable approach is to never write a secret into a layer at all.

- A is wrong: Layers are additive history; unsetting a variable in a later instruction changes the final metadata but does not retroactively remove it from the earlier layer.
- B is wrong: Pinning the base image's version affects reproducibility of the build, not whether an `ARG` value persists in a layer once written.
- D is wrong: Both an `ARG` value used during the build and an `ENV` default persist in the image's layers or configuration; using `ARG` alone does not make it safe.

### 28.

A team believes a one-time vulnerability scan performed when an image was first built is sufficient going forward. What is missing from that plan?

- **A.** Scanning needs to be continuous, because vulnerabilities are discovered later in images that have not themselves changed at all.
- **B.** Nothing is missing, since a base image that passed a scan once can never later be found vulnerable without the image itself changing.
- **C.** The scan should have been run against the Dockerfile's text instead of the built image, since vulnerabilities live in instructions, not artifacts.
- **D.** The scan needs to be run once per container created from the image rather than once per image, since each container has its own writable layer.

**Answer: A.** Scanning is a continuous activity rather than a one-off, because vulnerabilities are discovered in images that have not changed at all — a smaller, version-pinned base image reduces what there is to find, but does not remove the need to keep checking.

- B is wrong: New vulnerabilities are regularly disclosed in already-published software, so an unchanged image can become newly flagged with no rebuild involved.
- C is wrong: Vulnerabilities are found in the software packages inside the built image, not in the Dockerfile text describing how it was assembled.
- D is wrong: Vulnerabilities live in the shared image layers, not in any single container's writable layer, so scanning per-container adds nothing a single image-level scan does not already cover.

### 29.

Internal documentation needs one accurate sentence separating a container, the image it came from, and the Kubernetes pod that may wrap it. Which statement keeps the three straight?

- **A.** The image is the read-only template, the container is one running or stopped instance created from it, and the pod is Kubernetes' unit wrapping one or more containers with shared network and storage.
- **B.** The container is the read-only template and the image is one running instance created from it, while the pod bundles several unrelated images together Under that framing, deleting the pod would also delete every image it happened to bundle.
- **C.** A pod is simply another name Kubernetes uses for a container, and the image is the file produced by saving a running one Under that framing, restarting a pod would just restart the same underlying container object rather than create a new one.
- **D.** Because a pod schedules its containers together, restarting one always removes and recreates the image it was built from.

**Answer: A.** The image/container/pod comparison separates template, running instance, and Kubernetes wrapper. Confusing any two of them is the exam's most common trap in this section, because each concept genuinely resembles its neighbours until the cardinality and mutability are pinned down.

- B is wrong: This swaps the template and the instance; the image is immutable and the container is what runs from it, not the reverse.
- C is wrong: A pod is a distinct Kubernetes object that can wrap several containers together; it is not a synonym for container.
- D is wrong: Restarting a container never touches the image; the image is untouched by anything that happens to the containers created from it.

### 30.

A container was started ten minutes ago but no longer appears in the default output of the listing command. Which command reveals it, and why did the default view hide it?

- **A.** `docker ps -a`, because bare `docker ps` shows only currently running containers by default.
- **B.** `docker run` again with the same name, because the original process needs to be recreated from scratch.
- **C.** `docker images`, because a container that stops folds back into the image store it was created from.
- **D.** Nothing brings it back, because a container that exits is deleted automatically the moment its process stops.

**Answer: A.** A container is created with `docker run` and its lifecycle state is queried with `docker ps`, whose default output filters to running containers only; `-a` includes everything, including containers whose main process already exited.

- B is wrong: `docker run` always creates a new container and would fail on a name collision rather than revealing the missing one.
- C is wrong: A container never becomes an image on its own; `docker images` lists templates, not instances.
- D is wrong: Stopping is not removing: an exited container keeps its writable layer and configuration until something explicitly removes it.

### 31.

A team wants to run a Windows-only binary inside a container on a Linux host, reasoning that containers are lightweight and portable. Why does this fail?

- **A.** A container shares the host kernel rather than booting its own, so it cannot run a program built for a different OS family than the host.
- **B.** The registry blocks cross-platform images from being pulled onto a host running a different operating system.
- **C.** The image's Dockerfile would need an extra `RUN` instruction to install a compatibility layer before the build succeeds.
- **D.** Containers behave like small virtual machines, so the fix is simply to boot the container with the correct guest kernel selected, the way a hypervisor picks a guest kernel for a virtual machine.

**Answer: A.** Because a container is a process isolated with namespaces and cgroups on the host's own kernel, it can only run binaries compatible with that kernel. A virtual machine, by contrast, carries and boots its own kernel and can therefore run a different OS family.

- B is wrong: A registry stores and serves images without inspecting or restricting which kernel they were built to run on.
- C is wrong: No Dockerfile instruction changes which kernel the resulting container runs against once it starts.
- D is wrong: A container has no guest kernel to select at all; the belief that it does is exactly the mistake that produces this failure.

### 32.

A container built from a one-shot batch script exits within a second of being started every time, and the operator suspects broken isolation. What is the more likely explanation?

- **A.** The container's PID 1 process finished its work and exited, and the container's life ends exactly when that process ends.
- **B.** The virtual machine hosting the container ran out of allocated boot time before the guest kernel could finish loading That framing assumes containers boot a guest kernel the way a virtual machine does, which is not how container isolation works.
- **C.** The image it was built from is corrupted, so the container cannot be created and silently fails.
- **D.** The cgroup limits placed on the container killed the process for exceeding its memory allowance.

**Answer: A.** The runtime executes the image's configured command as PID 1 inside the container's namespaces; when that process exits, the container stops immediately. A one-shot script is expected to behave exactly this way, and it is not evidence of broken isolation.

- B is wrong: A container has no guest kernel and no boot sequence to time out on; nothing here boots at all.
- C is wrong: A corrupted image would fail to create the container at all rather than start it and let it exit seconds later.
- D is wrong: An out-of-memory kill is a distinct, loggable event, not the routine behaviour of a short-lived script finishing on schedule.

### 33.

A cluster loses its control plane for ten minutes because of a networking issue. Do applications already running on healthy nodes stop serving traffic?

- **A.** No, pods already running on healthy nodes keep serving; what stops is new scheduling, updates, and any other change to cluster state.
- **B.** Yes, every pod in the cluster stops immediately, since the control plane is required continuously for any container to keep running.
- **C.** Yes, but only pods managed by a Deployment stop, while bare pods created directly keep running unaffected.
- **D.** No, but only Services stop resolving names while the pods behind them keep running unaffected.

**Answer: A.** Losing the control plane stops new scheduling and new changes, while pods already running on healthy nodes keep serving traffic — a availability distinction the exam likes because it separates decision-making from execution.

- B is wrong: A running pod's containers keep executing on their node independent of a momentarily unreachable control plane; nothing about their process execution depends on it directly.
- C is wrong: Whether a pod is managed by a Deployment or created bare has no bearing on whether it keeps running during a control plane outage; both keep serving on their nodes.
- D is wrong: Cluster DNS and Service resolution are not what fails during a brief control plane outage in this scenario; the accurate distinction is scheduling and changes stopping while running workloads continue.

### 34.

A candidate must name the control plane component that watches for newly created pods with no assigned node and picks one for them. Which is it?

- **A.** `kube-scheduler`, which selects a node for each unscheduled pod based on its declared resource needs and placement constraints.
- **B.** `kube-apiserver`, which is the front end for the Kubernetes API and therefore also performs node selection for every pod.
- **C.** etcd, since it stores all cluster data and therefore also decides which node a new pod is assigned to.
- **D.** `kube-controller-manager`, which runs the controller processes and therefore also handles new-pod scheduling as one of its controllers.

**Answer: A.** The four control plane components have cleanly separable jobs: the API server serves the API, etcd stores state, `kube-scheduler` chooses nodes for unscheduled pods, and `kube-controller-manager` reconciles state through its controllers.

- B is wrong: The API server is the front end for the Kubernetes control plane and exposes the Kubernetes API, but it does not select a node for a pod; that is the scheduler's job.
- C is wrong: etcd is the consistent key-value store backing cluster data; it stores decisions made elsewhere but does not itself decide node placement.
- D is wrong: The controller manager runs reconciliation controllers for existing objects; assigning a node to a newly created, unscheduled pod is the scheduler's separate, dedicated job.

### 35.

A team decides to back up only their application data volumes, reasoning that cluster configuration can always be reapplied from source control. Which single control plane component still deserves its own backup, and why?

- **A.** etcd, because it is the one stateful control plane component, holding the cluster's actual recorded state rather than something rederivable from manifests alone.
- **B.** `kube-scheduler`, because its record of where each pod was placed cannot be reconstructed from manifests in source control and must therefore be preserved in a backup of its own.
- **C.** `kube-apiserver`, because it caches every API request it has ever served and would lose that history without a backup.
- **D.** `kube-controller-manager`, because its reconciliation loops must resume from an exact saved point rather than simply restarting fresh.

**Answer: A.** etcd is the consistent, highly available key-value store backing all cluster data — the one stateful control plane piece, which makes it the thing to back up; the other three components are effectively replaceable without their own persisted state.

- B is wrong: The scheduler makes placement decisions on the fly rather than storing durable state of its own; nothing here needs a dedicated backup.
- C is wrong: The API server is a front end that processes requests against etcd; it is not itself a durable store of request history requiring backup.
- D is wrong: A controller's reconciliation loop compares current state to desired state on each pass and does not require resuming from a precise saved checkpoint of its own.

### 36.

A manifest describing three replicas is applied to a cluster twice in a row, with no changes in between. What happens the second time?

- **A.** Three additional replicas are created, since each apply is treated as an imperative instruction to add that many more instances, rather than as a description of the end state to reconcile toward.
- **B.** The cluster rejects the second apply outright, since a manifest can only be applied successfully one time per object.
- **C.** All existing pods are deleted and recreated from scratch, since every apply resets the object's state before reapplying it.
- **D.** Nothing changes, because the description names an end state rather than steps, and applying it twice is the same as applying it once.

**Answer: D.** Because the description names an end state rather than a sequence of steps, applying it twice is the same as applying it once — the imperative alternative, a script of create-and-modify commands, is not safe to re-run in the same way.

- A is wrong: Applying the same manifest again is not interpreted as an additive instruction; the controller compares to the declared count, which is unchanged, and does nothing further.
- B is wrong: Reapplying an unchanged manifest is a normal, accepted operation; nothing about declarative configuration limits an object to a single apply.
- C is wrong: Reconciliation only acts on the difference between actual and desired state; with no difference present, nothing is deleted or recreated.

### 37.

An operator manually scales a workload up with an imperative command, bypassing its stored manifest. Over time, the replica count drifts back to what the manifest declares. Why?

- **A.** A controller compares desired against actual on a loop and acts on the difference, so an out-of-band change is treated as drift to correct, not a new desired state.
- **B.** The manual command silently fails to take effect at all, so nothing was ever actually scaled up in the first place.
- **C.** The manifest automatically updates itself to match whatever the imperative command set, which is why the file in version control and the live cluster appear to converge over time.
- **D.** The Service in front of the workload enforces the original replica count independently of any controller.

**Answer: A.** It is the mechanism behind every self-healing claim: a controller compares desired against actual on a loop and acts on the difference, which is the same reason a manually scaled workload drifts back to the declared count — the manifest is the source of truth, not the momentary imperative change.

- B is wrong: The manual command does take effect immediately; the drift back happens afterward, as reconciliation corrects the difference from the declared state.
- C is wrong: A manifest in version control does not update itself in response to cluster-side changes; convergence happens because the cluster is pulled back toward the unchanged manifest, not the reverse.
- D is wrong: A Service has no role in maintaining replica counts; that is the controller's reconciliation loop acting on the Deployment or similar object.

### 38.

A team keeps their cluster manifests in version control and treats that repository as the source of truth for what should exist. What justifies calling the file, not the running cluster, the source of truth?

- **A.** It is not actually justified, since the live cluster is always more authoritative than any file describing what it should look like.
- **B.** Because version control automatically applies every commit to the cluster the instant it is pushed, keeping the two permanently identical without any separate deployment step.
- **C.** Because the control plane refuses to accept any change that was not first committed to version control.
- **D.** The file names the end state the cluster is continuously driven toward; the running cluster is only wherever reconciliation currently stands relative to it.

**Answer: D.** Desired state is stored through the API server, and controllers observe actual state, compare it with desired state, and act to reduce the difference — which is exactly why manifests belong in version control: the file is the source of truth for what the cluster should look like.

- A is wrong: The declarative model inverts that intuition deliberately: the file is what the cluster is continuously reconciled toward, making it the authoritative description.
- B is wrong: Version control by itself applies nothing; some separate process or pipeline must submit the manifest before the cluster reconciles toward it.
- C is wrong: The control plane enforces no such requirement; it accepts any valid submission regardless of whether it originated from version control.

### 39.

Deployment, Kubernetes service, and pod all appear in a change request describing a rolling update. Which statement correctly assigns each object's role?

- **A.** The Service governs how many pods and which version, and the Deployment only selects existing pods by label without creating anything, swapping which object owns replica count and which one owns addressing.
- **B.** The Deployment governs how many pods and which version, the Service governs how callers address them, and the pod is where the containers actually run.
- **C.** The pod governs how many replicas should exist, and the Deployment is merely where the containers physically run.
- **D.** All three objects are interchangeable names for the same underlying Kubernetes resource, differing only by which command created them.

**Answer: B.** The Deployment/Service/pod comparison separates lifecycle, addressing, and execution: the Deployment declares how many pods and which version, the Service provides a stable address for whichever pods currently match its selector, and the pod is where the containers actually run.

- A is wrong: This swaps the two roles: the Deployment creates ReplicaSets and declares the replica count, while the Service selects existing pods and creates nothing.
- C is wrong: A pod knows nothing about how many of itself should exist; replica count is declared on the Deployment, not the pod.
- D is wrong: They are three distinct object types with distinct APIs and responsibilities, not interchangeable names for one resource.

### 40.

An engineer manually deletes one pod belonging to a Deployment declaring three replicas, expecting the application to run with two instances until the next deploy. What actually happens within seconds?

- **A.** The Deployment's replica count silently drops to two, since manual deletion is treated as a deliberate scale-down request.
- **B.** A replacement pod appears almost immediately, because the controller continuously compares actual state against the declared replica count and corrects the difference.
- **C.** Nothing happens until the next scheduled deploy, since the Deployment only reconciles state when a new version is rolled out and otherwise leaves the running pods untouched.
- **D.** The Service in front of the pods creates a replacement directly, since it is responsible for maintaining the pod count behind it.

**Answer: B.** Because the controller is continuously comparing actual against desired, deleting one of its pods does not reduce the count — the replica count is now unsatisfied, so a replacement pod appears almost immediately.

- A is wrong: Manual pod deletion is not interpreted as a scaling instruction; the declared count on the Deployment is untouched by it.
- C is wrong: Reconciliation runs continuously, not only at deploy time; a shortfall against the declared count is corrected immediately, independent of any new rollout.
- D is wrong: A Service selects existing pods and creates nothing; maintaining replica count is the Deployment's job through the ReplicaSet it owns.

### 41.

A Deployment using the default update strategy has its pod template changed to reference a new image version. What actually happens to the running pods, mechanically?

- **A.** Every existing pod is edited in place to reference the new image, with no new ReplicaSet or pod ever created.
- **B.** A new ReplicaSet is created and scaled up while the old ReplicaSet is scaled down, replacing pods gradually rather than all at once.
- **C.** All old pods are deleted immediately and simultaneously, and new ones are created only after every old one is gone.
- **D.** The Service in front of the pods is recreated first, and only then are the pods themselves updated to match.

**Answer: B.** Changing the pod template creates a new ReplicaSet, which is scaled up while the old one is scaled down, so pods are replaced gradually rather than all at once; each such change is a revision that can be rolled back.

- A is wrong: Pods are not edited in place for an image change; a new ReplicaSet is created and its pods gradually replace the old ones.
- C is wrong: A rolling update scales the new ReplicaSet up while scaling the old one down gradually, not an all-at-once delete-then-create sequence.
- D is wrong: A Service selects pods by label and needs no recreation when the Deployment's pod template changes; it keeps routing to whatever currently matches.

### 42.

A workload needs a stable per-instance identity and its own dedicated storage that must not be shared across replicas. Is a Deployment the right object for it?

- **A.** Yes, since a Deployment can be configured to assign a fixed identity to each of its replicas by setting the replica count to a specific value and leaving it unchanged thereafter.
- **B.** Yes, because attaching a volume to the Deployment's pod template automatically gives each replica its own separate copy of the data.
- **C.** No, a Deployment assumes interchangeable, essentially stateless pods, and a workload needing stable identity and per-instance storage is not its job.
- **D.** No, but only because Deployments are limited to stateless container images and cannot reference any image running a database.

**Answer: C.** A Deployment provides declarative updates for pods and ReplicaSets, but it assumes interchangeable, essentially stateless pods — a workload needing stable identity and per-instance storage needs a different workload object built for that purpose.

- A is wrong: The replica count only controls how many interchangeable pods exist; it grants no per-instance identity or dedicated storage to any of them.
- B is wrong: A volume declared on a shared pod template does not automatically partition into separate per-replica copies; interchangeable pods from one template share the same storage definition.
- D is wrong: A Deployment places no restriction on what the image contains; the actual mismatch is the model's assumption of interchangeable replicas, not the image type.

### 43.

A dozen containers, defined together with their networks and volumes, run happily through Docker Compose on one developer's laptop. A colleague calls this "orchestration for small deployments." What is the actual dividing line between Compose and an orchestrator?

- **A.** The number of containers involved — Compose is meant for a handful, while an orchestrator is required once a dozen or more are running.
- **B.** Whether the containers are described declaratively — Compose is imperative, while an orchestrator always requires declarative YAML.
- **C.** How many hosts are involved and whether anything keeps watching afterward: Compose applies a file to one machine once, an orchestrator schedules across many and keeps reconciling.
- **D.** Whether the containers were built from a Dockerfile — Compose only runs pre-built images, while an orchestrator can build them too.

**Answer: C.** Compose and an orchestrator are a named confusable pair, and the dividing line is hosts plus persistence of intent: Compose applies a file to one machine once, while an orchestrator schedules across a fleet and keeps reconciling afterward — not how many containers are involved.

- A is wrong: Compose has no such container-count limit; a dozen containers on one host is well within its normal use, and container count is not what makes something an orchestrator.
- B is wrong: A Compose file is itself declarative, describing services, networks and volumes to be created; declarativeness is not what separates it from an orchestrator.
- D is wrong: A Compose file can reference a build context the same way a plain `docker build` can; build capability is not the dividing line described here.

### 44.

A project's Compose file defines a web service, a worker service, and a shared database, and `docker compose up -d` is run. What creates, and in what relationship?

- **A.** It distributes the three services across whichever machines in the local network have spare capacity, balancing the load automatically.
- **B.** It only creates the containers, leaving the operator to run `docker volume create` and attach each declared mount by hand afterwards for everything else the Compose file happens to describe.
- **C.** It creates the network, volumes, and containers for all three services on the single host where the command ran, starting anything they depend on as it goes, and detaches immediately.
- **D.** It builds fresh images for all three services from their Dockerfiles every time, regardless of whether anything changed.

**Answer: C.** `docker compose up` creates the network, volumes, and containers declared in the file, in dependency order, all on the single host the command runs on; `-d` detaches so the shell returns immediately while the services keep running.

- A is wrong: Compose is a single-host tool; every service in the project runs on the one machine where the command was issued, with no cross-host distribution.
- B is wrong: Compose creates the network and volumes declared in the file as part of the same command, not as a separate manual step.
- D is wrong: `docker compose up` reuses existing images unless a rebuild is requested with `--build`; it does not rebuild unconditionally on every invocation.

### 45.

A machine running a Compose project loses power overnight, and the project declares no restart policy for any of its services. What happens to the application when it comes back, if no one intervenes?

- **A.** It resumes automatically on the same machine, since Compose registers a restart policy with the host's boot process by default.
- **B.** It stays down, because Compose has no cross-host scheduling or automatic rescheduling after a host failure; nothing was watching to bring it back.
- **C.** It migrates to another machine on the network automatically, since Compose treats every Docker host it can reach as one interchangeable pool to place services into.
- **D.** It resumes only the database service, since Compose prioritizes services declared with persistent volumes over stateless ones.

**Answer: B.** Compose has no cross-host scheduling and no rescheduling after a host failure: if the machine dies, the application dies with it, and nothing brings it back until the command is run again — the exact gap an orchestrator is built to close.

- A is wrong: Compose configures no such automatic boot-time recovery by default; nothing restarts the project unless the operator runs the command again.
- C is wrong: Compose has no concept of a pool of hosts at all; it is bound to the single machine where the command was run.
- D is wrong: Compose applies no such prioritization on its own; without the command being run again, nothing in the project restarts regardless of which services declare volumes.

### 46.

An operator stops a Compose project with `docker compose stop` instead of bringing it down, then wonders why the network and containers are still visible in `docker ps -a`. What is the distinction?

- **A.** There is no distinction, and both commands are expected to remove the containers and network identically.
- **B.** The visibility in `docker ps -a` is a stale cache and will clear itself automatically within a few minutes regardless of which command was used.
- **C.** Stopping only affects services that declare a database volume, leaving stateless services running as before.
- **D.** Stopping halts the containers without removing them or the network; only bringing the project down deletes the containers and network it created.

**Answer: D.** Stopping a Compose project halts its containers, mirroring `docker stop`; bringing it down removes the containers and network it created, mirroring `docker rm`. The two are not interchangeable, exactly as at the single-container level.

- A is wrong: Stopping a project merely halts it; only bringing it down removes the containers and network, so the two commands are not interchangeable.
- B is wrong: The containers genuinely still exist after a stop; this is not a caching artifact but the expected state of a stopped, unremoved container.
- C is wrong: Stopping a project halts every service it declares, regardless of whether that service is stateless or stateful.

### 47.

A Dockerfile review flags `EXPOSE 8080` and a teammate assumes the service is now reachable on that port. Is that correct?

- **A.** Yes, because `EXPOSE` opens the port on the host the moment the image is built from that Dockerfile.
- **B.** No, `EXPOSE` only documents which port the application listens on; publishing it for outside traffic still requires `-p` at run time.
- **C.** Yes, but only once the image has actually been pushed to a registry that other hosts can reach.
- **D.** No, and the port additionally needs a matching `-e` environment variable set before it becomes reachable That framing invents a dependency between port publishing and environment variables that Docker does not enforce.

**Answer: B.** `EXPOSE` records intent in the image's metadata and publishes nothing on its own. Traffic only reaches the container once `-p` (or `-P` for every `EXPOSE`d port) is used at `docker run` time to actually publish it on the host.

- A is wrong: `EXPOSE` runs at build time and writes documentation into the image configuration; it performs no host-level publishing at all.
- C is wrong: Pushing to a registry changes where an image can be pulled from; it has no bearing on which ports a running container publishes.
- D is wrong: Reachability is controlled by port publishing alone; no environment variable is required to make a published port answer traffic.

### 48.

`docker build -t api:1.4.2 .` is run from a project directory containing both a `Dockerfile` and a `Dockerfile.dev`. What does the trailing `.` refer to?

- **A.** The specific Dockerfile to build from, so this command would use `Dockerfile.dev` if it sorts first alphabetically.
- **B.** A shorthand telling the CLI to reuse whichever context was used by the previous `docker build` invocation in this shell session.
- **C.** The build context directory sent to the builder, inside which the Dockerfile named `Dockerfile` is found by default.
- **D.** The registry namespace the resulting image will be pushed under once the build finishes.

**Answer: C.** The trailing argument to `docker build` names the build context sent to the builder; the Dockerfile inside it is `Dockerfile` by default and can be redirected with `-f` when another name, such as `Dockerfile.dev`, is intended. Naming the tag explicitly with `docker build -t` is what makes the resulting image referenceable afterward.

- A is wrong: A trailing path argument names the build context, not a specific Dockerfile; an alternate filename must be given explicitly with `-f`.
- B is wrong: The CLI keeps no memory of a previous build's context between invocations; `.` always resolves to the current working directory.
- D is wrong: Namespace and registry are determined entirely by the `-t` tag given to the build, not by the trailing context path.

### 49.

A Dockerfile has `ENTRYPOINT ["python", "app.py"]` and `CMD ["--debug"]`. A user runs `docker run api --verbose`. What actually executes?

- **A.** `python app.py --verbose`, because an argument supplied after the image name replaces `CMD` while `ENTRYPOINT` still runs unchanged.
- **B.** `python app.py --debug --verbose`, because trailing arguments on `docker run` are appended after whatever `CMD` already supplied.
- **C.** Only `--verbose`, because supplying any argument on `docker run` overrides `ENTRYPOINT` as well as `CMD`.
- **D.** `python app.py --debug`, because arguments after the image name on `docker run` are ignored once both `ENTRYPOINT` and `CMD` are set.

**Answer: A.** `ENTRYPOINT` sets the executable and `CMD` supplies its default arguments. Arguments given after the image name on `docker run` replace `CMD`, so the entrypoint still runs but with the new argument in place of the Dockerfile's default.

- B is wrong: A trailing argument on `docker run` replaces `CMD` entirely rather than appending to it, so `--debug` does not survive.
- C is wrong: `ENTRYPOINT` is fixed and is not replaced by trailing run-time arguments; only `CMD` is what those arguments substitute for.
- D is wrong: Trailing run-time arguments are not ignored; they specifically replace `CMD`, which is exactly why `--debug` disappears here.

### 50.

A Dockerfile author chooses `ADD` over `COPY` to bring a local configuration file into the image, believing the two are interchangeable. What can go wrong that `COPY` would have avoided?

- **A.** `ADD` refuses to copy any file larger than a few kilobytes, silently truncating anything bigger.
- **B.** `ADD` also auto-extracts recognised local archive files and can fetch remote URLs, behaviour a plain copy instruction should not carry.
- **C.** `ADD` does not create a filesystem layer the way `COPY` does, so the configuration file would be lost on rebuild.
- **D.** `ADD` requires the source file to already exist inside a registry, whereas `COPY` reads only from the local build context, treating `ADD`'s remote-URL support as if it excluded local files entirely.

**Answer: B.** `ADD` can auto-extract local tar archives and fetch remote URLs in addition to plain copying, which is precisely why `COPY` is the recommended default whenever a plain file copy is all that is wanted — `COPY` cannot surprise you.

- A is wrong: `ADD` has no such size restriction; its extra behaviour is auto-extraction and remote fetching, not truncation.
- C is wrong: Both `ADD` and `COPY` add filesystem content and create layers; neither is metadata-only.
- D is wrong: `ADD` reads from the local build context the same way `COPY` does, aside from its additional URL-fetching capability; it has no registry dependency.

### 51.

The same image needs to run unchanged in development, staging, and production, with only the database URL differing between them. What is the standard mechanism for that difference?

- **A.** Three separate images, one built per environment with the correct database URL baked into each Dockerfile.
- **B.** A different tag per environment, such as `api:dev`, `api:staging`, and `api:prod`, each pointing at differently configured builds.
- **C.** Environment variables set at run time with `-e`, so one image serves all three environments without any rebuild.
- **D.** A bind mount pointing at a different configuration directory per environment, chosen by the host running the container.

**Answer: C.** `-e` at run time sets or overrides configuration for a single container without rebuilding the image, which is exactly what makes one image deployable unchanged across environments that differ only in settings like a database URL.

- A is wrong: Baking a per-environment value into the image is exactly the anti-pattern this mechanism avoids; the requirement is one unchanged image, not three.
- B is wrong: A tag only names which image a reference resolves to; it does not itself carry per-environment configuration without separate builds behind it.
- D is wrong: A bind mount is designed for file-based data such as source code, not the lightweight key-value configuration a database URL represents.

### 52.

A container is already running with `LOG_LEVEL=info` set by its Dockerfile's `ENV`. An operator runs `docker start web -e LOG_LEVEL=debug` hoping to change it live. What actually happens?

- **A.** The container picks up `LOG_LEVEL=debug` immediately, since `docker start` is defined to accept the same flags as `docker run`.
- **B.** The command fails to apply the new value, because `docker start` has no `-e` option at all and a container's environment is fixed at the moment the container is created.
- **C.** The Dockerfile's `ENV LOG_LEVEL=info` is permanently overwritten in the image, affecting every future container built from it.
- **D.** The container restarts with a fresh writable layer, discarding whatever it had written before, because a changed setting forces the container to be rebuilt from its image.

**Answer: B.** `ENV` in a Dockerfile writes a default every container from that image inherits; `-e` at run time overrides it for one container, but only at creation. Because those values are fixed once a container exists, `docker start` cannot apply a new one.

- A is wrong: `docker start` resumes an existing container using its original configuration and does not accept new run-time flags such as `-e`.
- C is wrong: Neither `docker start` nor a run-time `-e` value ever modifies the image; the image's `ENV` default is untouched by anything done to a container.
- D is wrong: `docker start` never resets a container's writable layer; the described failure is that the new flag has no effect at all, not that data is lost.

### 53.

A developer sets a database password with `-e DB_PASSWORD=...` instead of hardcoding it in application code, reasoning this keeps it out of sight. Is the credential now safe?

- **A.** Yes, because environment variables are encrypted by the container runtime the moment the container starts.
- **B.** Yes, but only because `-e` values are discarded from memory once the application process finishes reading them at startup.
- **C.** No, but only because the value should have been baked in with `ENV` in the Dockerfile instead, which is the genuinely secure form.
- **D.** No, an `-e` value is ordinary container configuration that anyone able to inspect the container can read, so it is no better protected than any other setting.

**Answer: D.** Neither `ENV` nor `-e` is a secret store: an `ENV` value is baked into the image and readable by anyone who can pull it, and a `-e` value is readable from the container's configuration on the host. Real secrets belong in a dedicated secret manager instead.

- A is wrong: Neither `ENV` nor `-e` values are encrypted by the runtime; both are stored and readable as plain configuration.
- B is wrong: A `-e` value remains part of the container's recorded configuration for its whole lifetime; it is not discarded after the application first reads it.
- C is wrong: An `ENV` default is part of the image and readable by anyone who can pull it, which is more widely exposed than a run-time `-e` value, not less.

### 54.

An image's Dockerfile sets `ENV TIMEOUT=30`, and a container is run with `docker run -e TIMEOUT=60 api`. Which value does the application see?

- **A.** 30, because a value set inside the Dockerfile is treated as fixed configuration that a run-time flag cannot change.
- **B.** 60, because a run-time `-e` value overrides whatever default the image's `ENV` instruction baked in.
- **C.** Neither value, because setting the same variable in two places causes Docker to refuse to start the container.
- **D.** Both, concatenated as `30,60`, since Docker merges duplicate environment variable definitions rather than choosing one.

**Answer: B.** `ENV` in the Dockerfile writes a default every container inherits; `-e` at run time sets or overrides a value for that one container, and the run-time value takes precedence whenever both are given.

- A is wrong: An image's `ENV` is a default, not a lock — `-e` at run time is specifically designed to override it for that container.
- C is wrong: Docker resolves the conflict by letting the run-time value win; it does not refuse to start over a variable being set twice.
- D is wrong: Docker does not merge duplicate variable values; the run-time `-e` value simply replaces the image's default for that container.

### 55.

A Dockerfile has, in order, `FROM`, `COPY`, `RUN`, `ENV`, `WORKDIR`, and `CMD`. Which of these instructions add a filesystem layer?

- **A.** `COPY` and `RUN` only, since every other instruction in the list is purely descriptive metadata with no filesystem effect at all.
- **B.** `FROM`, `ENV`, and `CMD`, because they configure the image and configuration is what layers exist to record.
- **C.** `COPY`, `RUN`, and `WORKDIR`, because each changes the filesystem, and `WORKDIR` creates its directory when it is missing.
- **D.** All six instructions, since every line in a Dockerfile is executed in order and caches its own result as a layer.

**Answer: C.** `RUN`, `COPY`, and `ADD` add filesystem content and are the layer-producing instructions in the ordinary case; `WORKDIR` is the exception that looks like metadata but also creates a directory, while `ENV`, `LABEL`, `EXPOSE`, and `CMD` record configuration only.

- A is wrong: `WORKDIR` looks like metadata but creates its target directory when that directory does not already exist, which is a real filesystem change.
- B is wrong: `ENV` and `CMD` write configuration metadata with no filesystem content, and `FROM` selects a base rather than adding a layer of its own.
- D is wrong: Caching applies to every instruction, but only some of them change the filesystem; `ENV` and `CMD` cache metadata, not filesystem content.

### 56.

A Dockerfile copies the entire source tree before installing dependencies, and every code change now forces a full dependency reinstall on rebuild. Why?

- **A.** Because dependency installation always re-downloads from the network regardless of what changed, independent of layer order.
- **B.** Because a changed layer invalidates the cache for its own layer and every layer that follows it in the file's order.
- **C.** Because the registry re-validates every layer of an image before allowing a new build to be pushed to it.
- **D.** Because the base image is pulled fresh on every build unless a version tag is explicitly pinned in the `FROM` line.

**Answer: B.** Layers cache in Dockerfile order, and invalidating one layer invalidates every layer after it. Copying the dependency manifest first, installing, and only then copying source keeps the expensive install layer cached across ordinary code changes.

- A is wrong: A dependency install step is cached exactly like any other `RUN`, and reordering the Dockerfile changes how often it actually re-executes.
- C is wrong: The registry plays no role during a local build; it only stores and serves images that have already been built.
- D is wrong: A pinned or unpinned base image affects whether the base layer is refreshed, not whether the dependency-install layer downstream is invalidated by a source change.

### 57.

A credential was accidentally copied into an image, then removed with a later instruction and the image rebuilt. Is the credential gone from the resulting artifact?

- **A.** Yes, because rebuilding an image always discards every previous layer and starts the filesystem from a clean state.
- **B.** It depends on whether the credential was set with `ENV` or copied as a file, since only one of those two forms is treated as persistent layer content by the image builder.
- **C.** No, because the earlier layer that added it is still present underneath, and deletion in a later layer only hides the file rather than erasing it.
- **D.** Yes, because the registry strips any file matching a known secret pattern before accepting a pushed image.

**Answer: C.** A layer records changes relative to the one beneath it, and nothing about a later layer erases an earlier one's content — a file added and then removed is still present in the layer where it was added, which is why a secret must never enter a layer in the first place.

- A is wrong: A rebuild reuses cached layers where possible and appends new ones; it does not erase history the way a fresh filesystem would.
- B is wrong: Both a copied file and an `ENV` value are written into the image's layers or configuration and persist the same way regardless of form.
- D is wrong: A registry stores whatever bytes it is pushed; it performs no content inspection or secret scanning of its own.

### 58.

A colleague argues that deploying `api:latest` guarantees production always runs the newest build. Is that correct?

- **A.** Yes, because the registry automatically recalculates which image is newest and moves the `latest` tag to match on every push, the same way it is assumed to track semantic version numbers.
- **B.** Yes, but only for images built with `docker build -t api .`, since that specific command guarantees a newest-build tag.
- **C.** No, because `latest` is reserved by the registry and can never actually be assigned to a pushed image.
- **D.** No, `latest` is only the default tag a reference falls back to when none is given, and it is a mutable pointer that can be repointed to any image at all.

**Answer: D.** A tag is a mutable pointer to an immutable image. `latest` carries no special comparison logic — it is simply the fallback tag used when a reference names a repository without a tag, and whatever was most recently pushed under that name is what it currently points to.

- A is wrong: There is no automatic recalculation; `latest` moves only because a push explicitly named that tag, the same as any other tag.
- B is wrong: That command produces `api:latest` because no tag was given, not because the build process verified it was the newest version.
- C is wrong: `latest` is an ordinary tag like any other; a registry places no restriction on pushing an image under that name.

### 59.

Two nodes pull an image referenced only as `nginx`, minutes apart, and end up running different code even though neither node changed anything. What best explains this?

- **A.** One node pulled from the registry and the other from its local image store, which are guaranteed to diverge over time.
- **B.** The reference resolved to `nginx:latest`, and the tag was repointed to a different image by a push that happened between the two pulls.
- **C.** Each node's container runtime applies a different default `CMD` when none is pinned by an explicit tag.
- **D.** The nodes are running different container runtimes, and each interprets an untagged reference according to its own rules That framing treats tag resolution as a runtime-specific behaviour rather than something the registry controls uniformly.

**Answer: B.** Because a bare `nginx` reference resolves to `nginx:latest`, and `latest` is a mutable pointer rather than a fixed version, two pulls separated in time can legitimately fetch different images. Pinning an explicit version tag, or a digest, is what avoids this drift.

- A is wrong: A pull always checks the registry; a local store is only consulted by `docker run` when deciding whether a pull is even needed.
- C is wrong: A runtime does not alter an image's configured command based on how the image was tagged; `CMD` comes from the image itself.
- D is wrong: Tag resolution is a registry and CLI convention, not a runtime-specific behaviour that would vary between compliant OCI runtimes.

### 60.

A rollback needs to return production to the exact bytes it ran last week, with no possibility of the reference being repointed later. Which reference form guarantees that?

- **A.** An explicit version tag such as `1.4.2`, because unlike `latest` a numbered tag is guaranteed never to be reused for a different push.
- **B.** Rebuilding from the same Dockerfile a second time, since an identical file always produces byte-identical output.
- **C.** The image's creation timestamp recorded by `docker images`, referenced instead of any tag or digest.
- **D.** The content digest, such as `api@sha256:...`, since it names exact bytes and cannot be repointed the way a tag can.

**Answer: D.** Tags, including numbered ones, remain mutable pointers that a later push can repoint. Only a content digest names exact, unrepointable bytes, which is why reproducibility guarantees pin the digest rather than any tag.

- A is wrong: Any tag, numbered or not, is an ordinary mutable pointer; nothing prevents a later push from repointing `1.4.2` to different content.
- B is wrong: A rebuild re-executes instructions such as base image pulls and package installs, which can pick up different content even from an unchanged Dockerfile.
- C is wrong: A timestamp is descriptive metadata for a human reading a list; it is not a reference form that `docker pull` or `docker run` can resolve against.

### 61.

A frontend calls a backend by directly recording one of its pod IP addresses. After a routine redeploy, the frontend cannot reach the backend at all. What is the fix, and why does it hold up across future redeploys?

- **A.** Address the backend through a Kubernetes service instead, since it tracks the current set of matching, ready pods automatically and gives callers one address that never changes.
- **B.** Pin the backend's Deployment to always reuse the exact same pod IP address on every redeploy, so recording it once remains valid.
- **C.** Reduce the backend's replica count to exactly one, since a single-replica Deployment is guaranteed to keep the same pod IP forever, treating replica count as if it controlled address stability.
- **D.** Mount a shared volume between the frontend and backend so the address can be read from a file instead of hardcoded.

**Answer: A.** "The frontend cannot reach the backend after a redeploy" is the archetypal scenario caused by addressing pods directly instead of through a Service, which tracks the set of matching, ready pods automatically and gives callers a name that never changes.

- B is wrong: Pod IPs are assigned fresh on each replacement and are not something a Deployment can pin to a fixed value across redeploys.
- C is wrong: Even a single-replica Deployment gets a new pod, and therefore a new IP, every time that pod is replaced; replica count does not stabilise the address.
- D is wrong: A volume solves data persistence, not address stability; nothing about a shared volume tracks which pods are currently ready to serve traffic.

### 62.

A service needs to be reachable from the public internet through a provider-managed load balancer. Which Service type fits, as opposed to the cluster-internal default?

- **A.** LoadBalancer, which exposes the Service externally through a load balancer, typically provisioned by the cloud provider — unlike ClusterIP, the default that stays internal only.
- **B.** ClusterIP, since it is the default type and a default is always the safest starting point for an exposure requirement.
- **C.** NodePort alone, since exposing a static port on every node in the cluster provides the same health checking and traffic distribution a provider-managed load balancer performs.
- **D.** A Deployment with `hostNetwork` enabled, which bypasses the Service abstraction entirely and lets external traffic reach the pod directly.

**Answer: A.** ClusterIP exposes the Service inside the cluster only and is the default; NodePort additionally exposes it on a port on each node; LoadBalancer exposes it externally through a load balancer, typically provisioned by the cloud provider.

- B is wrong: ClusterIP is explicitly internal-only and cannot be reached from outside the cluster no matter how the application is configured.
- C is wrong: NodePort exposes a port on each node directly, which is a different mechanism from a provider-managed external load balancer, even though both allow outside traffic in.
- D is wrong: That setting concerns which network namespace a pod uses, not how external clients discover a stable address; it is not the standard mechanism for external exposure.

### 63.

A Service is created with a label selector that matches no currently running pod, due to a typo. What is observed, and what is it not?

- **A.** The Service fails to be created at all, since Kubernetes rejects any selector that does not match at least one existing pod.
- **B.** The Service automatically falls back to routing traffic to any pod in the namespace when its selector matches nothing.
- **C.** The underlying Deployment is paused automatically until the Service's selector is corrected to match its pods.
- **D.** The Service exists and resolves normally but has no endpoints, so connections fail; the cause is a label mismatch, not a networking fault.

**Answer: D.** A Service whose selector matches no pods still exists and still resolves, but has no endpoints, so connections fail — an "everything is created, nothing works" symptom that is a label mismatch, not a networking fault.

- A is wrong: Kubernetes does not validate a selector against currently running pods at creation time; the Service is created regardless and simply has no endpoints.
- B is wrong: There is no such fallback; a Service with no matching pods simply has no endpoints and routes to nothing.
- C is wrong: A Deployment operates independently of any Service in front of it; a selector mismatch on the Service has no effect on the Deployment's own reconciliation.

### 64.

A Deployment's rolling update replaces every pod behind a Service, one at a time, over several minutes. Do callers using the Service's name notice any interruption from the changeover itself?

- **A.** Yes, because the Service must be manually recreated after every pod replacement to pick up the new addresses.
- **B.** No, because the Service selects by label rather than by address, so it keeps answering as the set of matching pods changes underneath it.
- **C.** Yes, because the Service knows which Deployment produced its pods and must wait for that Deployment's rollout to finish before routing again.
- **D.** No, but only because cluster DNS caches the old pod addresses until the rollout is fully finished.

**Answer: B.** The Service's selector matches labels on pods, and the set of matching, ready pods is tracked automatically as pods come and go — the linkage is labels alone, which is exactly what allows a rolling update to swap every pod underneath without the caller noticing.

- A is wrong: A Service tracks matching, ready pods automatically through its label selector; it requires no manual recreation as pods are replaced.
- C is wrong: A Service neither creates pods nor knows which Deployment produced them; the linkage is labels alone, not an awareness of the owning Deployment.
- D is wrong: Continuity comes from the Service tracking ready pods by label in real time, not from DNS caching stale addresses through the rollout.

### 65.

A statement describes Kubernetes as "governed by the CNCF, which also hosts it." Is that the correct relationship?

- **A.** Yes, since a graduated CNCF project is by definition directly governed by the foundation that hosts it.
- **B.** No, because Kubernetes is not hosted by the CNCF at all, but by the Linux Foundation directly instead.
- **C.** No, the CNCF hosts Kubernetes as a graduated project, but governance rests with Kubernetes' own Steering Committee, an elected body its charter names as the project's governing authority.
- **D.** Yes, and the Steering Committee referenced elsewhere is simply an internal CNCF department with no independent authority, treating hosting and governance as the same relationship rather than two deliberately separated ones.

**Answer: C.** Two facts about Kubernetes' standing are routinely confused and both are examinable: it is hosted by the CNCF as a graduated project, and it is governed by its own Steering Committee — the CNCF hosts, funds, and supports; it does not govern.

- A is wrong: Graduation describes hosting maturity, not governance; Kubernetes' own Steering Committee, not the CNCF, is named as its governing body.
- B is wrong: The CNCF, itself part of the Linux Foundation, is specifically the body that hosts Kubernetes as a graduated project.
- D is wrong: The Steering Committee is Kubernetes' own elected governing body, distinct from and not subordinate to the CNCF's internal structure.

### 66.

A candidate preparing for LFCA wonders whether they need to be able to write Kubernetes manifests and pass operational tasks like a CKA candidate. What level of Kubernetes knowledge does the exam actually expect?

- **A.** Full manifest-writing ability, since LFCA and CKA test the exact same depth of Kubernetes operational skill.
- **B.** No Kubernetes knowledge at all, since the Containers competency confines itself entirely to single-host Docker concepts.
- **C.** Only enough to describe the CNCF's governance structure, with no expectation of naming any Kubernetes object.
- **D.** Vocabulary and purpose, meaning recognising what Kubernetes is for and naming its core objects, not operational skill such as writing manifests.

**Answer: D.** LFCA wants vocabulary and purpose, not operational skill — recognising what Kubernetes is for and what its objects are called, not writing manifests or passing a CKA-level practical assessment.

- A is wrong: LFCA and CKA target different depths; LFCA stops at recognition and purpose, while CKA-level operational skill is explicitly out of scope here.
- B is wrong: Kubernetes vocabulary — cluster, node, control plane, pod, Deployment, Service — is explicitly part of the working vocabulary this exam expects.
- C is wrong: Governance is one examinable fact among several; the working vocabulary of cluster, node, pod, Deployment, and Service is expected alongside it.

### 67.

Someone draws an analogy between the CNCF's relationship to Kubernetes and the Linux Foundation's relationship to the Linux kernel. Is that comparison sound?

- **A.** No, because the Linux Foundation directly sets the kernel's technical direction through its own board, while the CNCF deliberately leaves Kubernetes' direction to the project.
- **B.** No, because the CNCF is an entirely separate organisation from the Linux Foundation with no structural relationship between them.
- **C.** Yes, but only because both projects share the exact same Steering Committee membership across kernel and Kubernetes decisions.
- **D.** Yes, both foundations host and fund the project without setting its technical direction, which stays with the project's own governance structures.

**Answer: D.** The governance point mirrors a distinction the exam makes elsewhere: the Linux Foundation hosts and funds the Linux kernel without setting its technical direction, and the CNCF stands in the same relation to Kubernetes.

- A is wrong: Neither foundation sets its hosted project's technical direction; both relationships are hosting and funding without governing.
- B is wrong: The CNCF is part of the nonprofit Linux Foundation, not a separate, unrelated organisation.
- C is wrong: Kubernetes' Steering Committee and the Linux kernel's own governance are separate bodies for separate projects; the analogy is about structural shape, not shared membership.

### 68.

A scaling request asks for "five instances" of a service. One engineer interprets this as five pods; another as five containers inside one pod. Which is the Kubernetes model, and why does it matter?

- **A.** Five containers inside one pod, since a pod is simply Kubernetes' name for a larger container that can hold several processes.
- **B.** Either interpretation is equally correct, since the scheduler treats containers and pods as interchangeable units of placement.
- **C.** Five Deployments, one per instance, since each running copy of the service needs its own separate Deployment object.
- **D.** Five pods, since the scheduler places pods, never containers directly, so scaling means creating more pods, not adding more containers to one.

**Answer: D.** This is the distinction most often missed: the scheduler places pods, not containers, so a pod's containers can never be split across two nodes, and scaling always means creating more pods, never adding more containers to one pod.

- A is wrong: A pod is not a bigger container; it is a distinct wrapper, and adding more containers to one pod is a co-location decision, not a scaling one.
- B is wrong: The scheduler places pods specifically; it has no mechanism for placing individual containers independently of the pod that wraps them.
- C is wrong: A single Deployment already declares a replica count and manages that many pods from one pod template; five separate Deployments would be redundant.

### 69.

A pod holds a main application container and a sidecar container that must share the main container's network so it can inspect traffic on `localhost`. Why does putting both in one pod satisfy that requirement?

- **A.** Because Kubernetes automatically creates a Service between any two containers placed in the same pod.
- **B.** Because every container in a cluster can already reach every other container over `localhost`, regardless of which pod holds it, extending pod-scoped network sharing to the whole cluster.
- **C.** Containers in the same pod share a network namespace, one IP address and one port space, so they reach each other over `localhost` by design.
- **D.** Because both containers were built from the same image, which is what grants them a shared network namespace.

**Answer: C.** Containers in a pod share a network namespace, meaning one IP address and one port space between them, which is exactly why a sidecar that must share the main container's network belongs in the same pod rather than a separate one.

- A is wrong: A Service addresses a set of pods from outside, not two containers within the same pod; pod-internal reachability comes from the shared network namespace itself.
- B is wrong: Localhost reachability is scoped to containers sharing the same pod's network namespace; it does not extend cluster-wide between unrelated pods.
- D is wrong: Network namespace sharing is a property of pod membership, not of whether two containers happen to come from the same image.

### 70.

A failing pod is replaced automatically. Is the replacement the same pod, repaired, or something else?

- **A.** The same pod, repaired in place, since Kubernetes preserves a pod's identity and IP address across any failure it recovers from.
- **B.** The same pod, but only its IP address changes while its name and configuration stay identical to before the failure.
- **C.** Something else; pods are ephemeral, so a failing one is not repaired but replaced by a new pod with a new name and a new IP address.
- **D.** A different pod entirely, created on the same node the failed one was running on, since replacement never crosses node boundaries.

**Answer: C.** Pods are ephemeral: a failing pod is not repaired but replaced, and the replacement is a new pod with a new name and a new IP address — which is exactly why addressing a pod directly is a bug waiting for the next restart.

- A is wrong: A pod's replacement is a genuinely new pod with a new identity and IP; pods are not repaired and resumed the way a stopped container can be.
- B is wrong: Both the name and the IP address change on replacement; nothing about the failed pod's identity is preserved.
- D is wrong: A replacement pod can be scheduled onto any node with capacity; nothing ties it to the specific node the failed pod happened to run on.

### 71.

A bare pod is created directly through the Kubernetes API, with no Deployment involved. What limitation does this carry compared to a pod created by a workload controller?

- **A.** It cannot share a network namespace between its own containers the way a Deployment-created pod can, so its containers must reach each other over the cluster network instead.
- **B.** Nothing keeps a declared count of it, and nothing recreates it if it fails, since a bare pod has no controller reconciling toward a desired replica count.
- **C.** It cannot be scheduled onto a node at all, since only Deployment-created pods are eligible for scheduling.
- **D.** It automatically becomes a Deployment after its first restart, adopting a replica count of one.

**Answer: B.** Bare pods are rarely created directly — a workload controller such as a Deployment is normally what creates them, because it is the controller that watches and maintains a declared replica count; a bare pod has no such supervision and is not recreated if it fails.

- A is wrong: Network namespace sharing between containers is a property of the pod itself, present whether or not a workload controller created it.
- C is wrong: The scheduler places any pod regardless of how it was created; a bare pod is scheduled the same way a Deployment-created one is.
- D is wrong: A bare pod never converts into a Deployment on its own; without one explicitly created, nothing supervises the pod at all.

### 72.

A container is started with `docker run -p 80:8080 api`, and the operator expected the application to become reachable on port 80. It is not. What is wrong?

- **A.** The mapping is reversed: the host port is written first, so this actually forwards host port 80 to container port 8080, not the intended pairing.
- **B.** `docker run -p` only works for ports below 1024, so port 80 silently fails to bind and needs root privileges specified separately That framing borrows a general Unix privileged-port rule and applies it directly to the containerized process without checking it.
- **C.** `EXPOSE` was never declared in the Dockerfile, so `-p` has no effect regardless of which order the ports are written in.
- **D.** The container needs to be recreated with `docker start -p` instead, since `docker run` does not accept port mappings directly.

**Answer: A.** `-p hostPort:containerPort` places the host side first. Writing `-p 80:8080` when port 8080 is the intended host-facing port and 80 is what the application listens on sends traffic the wrong direction — the mapping needs to be reversed.

- B is wrong: Binding a low host port needs the process to have permission to do so, but that is not why this mapping fails, and no such categorical restriction exists in `-p` itself.
- C is wrong: `-p` publishes a port independently of whether the Dockerfile declares `EXPOSE`; `EXPOSE` is documentation only and not a prerequisite for publishing.
- D is wrong: `docker run -p` is exactly where a port mapping is set; `docker start` accepts no new flags at all, including a port mapping.

### 73.

`docker run -p 8080:80 api` is used, and the mapping direction is confirmed correct, yet nothing answers on host port 8080. Inspecting the application shows it listening on `127.0.0.1:80` inside the container. What is the cause?

- **A.** `-p` was written correctly, but it additionally requires `-P` alongside it before either mapping takes effect.
- **B.** The application is bound to the container's own loopback interface, which is unreachable from outside the container regardless of a correct publish mapping.
- **C.** The container was created from a stopped state with `docker start`, which does not re-apply port mappings from the original run That framing gets the mechanism backward: `docker start` reapplies the mappings recorded when the container was first created.
- **D.** The image's `Dockerfile` never declared `EXPOSE 80`, so the runtime refuses to forward traffic to that container port.

**Answer: B.** A correct `-p` mapping forwards host traffic into the container's network namespace, but if the application only listens on `127.0.0.1` inside that namespace, it accepts connections solely from processes inside the same container — forwarded host traffic never qualifies, no matter how the publish is written.

- A is wrong: `-p` alone is sufficient to publish a specific mapping; `-P` is an alternative for publishing every `EXPOSE`d port and is not required alongside it.
- C is wrong: The scenario describes a fresh `docker run`, not a resumed container, and the described symptom is specifically a loopback bind, not a lost mapping.
- D is wrong: `EXPOSE` is documentation only and has no effect on whether `-p` can forward traffic; its absence would not cause this symptom.

### 74.

Two containers are attached to the same user-defined Docker network. One needs to call the other by name on its internal port, with no traffic ever coming from outside the host. Is a `-p` publish required?

- **A.** No, containers on the same user-defined network reach each other directly by container name on any port, entirely without publishing.
- **B.** Yes, because every container port is unreachable by anything, including sibling containers, until it has been published with `-p` That framing ignores the shared user-defined network Docker Compose sets up between the project's own containers.
- **C.** Yes, but only `-P` is required rather than an explicit `-p`, since `-P` covers container-to-container traffic specifically.
- **D.** It depends on whether the target container declared `EXPOSE` for that port in its Dockerfile.

**Answer: A.** Publishing with `-p` or `-P` is only about letting traffic in from the host and beyond. Containers attached to the same user-defined network already reach each other directly by container name on any port, with no publishing involved at all.

- B is wrong: Publishing is specifically about host and external reachability; containers sharing a network reach each other's ports without any `-p` involved.
- C is wrong: `-P` publishes `EXPOSE`d ports to the host the same way `-p` does; neither flag governs container-to-container traffic on a shared network.
- D is wrong: `EXPOSE` is documentation and affects neither host publishing nor container-to-container reachability on a shared network.

### 75.

An image declares `EXPOSE 80` and `EXPOSE 443`, and it is started with `docker run -P api` rather than an explicit `-p`. What happens to those two ports?

- **A.** Both are published directly onto host ports 80 and 443, identical to writing `-p 80:80 -p 443:443` explicitly.
- **B.** Only the first `EXPOSE`d port is published; `-P` publishes a single port at a time by design.
- **C.** Both are published to the host, each on a separately chosen ephemeral high-numbered port rather than 80 and 443 themselves.
- **D.** Neither is published, because `-P` requires a matching `-e` environment variable naming each port before it takes effect That framing invents a dependency between `-P` and environment variables that the flag does not have.

**Answer: C.** `-P` publishes every port the image declares with `EXPOSE`, each to an ephemeral high-numbered host port chosen automatically, in contrast to `-p` which lets the operator choose the exact host port for one mapping at a time.

- A is wrong: `-P` deliberately avoids reusing the container's own port numbers on the host; it assigns ephemeral ports instead.
- B is wrong: `-P` publishes every port the image declares with `EXPOSE`, not only the first one listed.
- D is wrong: `-P` requires no accompanying environment variable; it acts directly on whatever ports the image declared with `EXPOSE`.

### 76.

Given the reference `registry.example.com/team/api:1.4.2`, which part names the registry, and how does that differ from the image itself?

- **A.** The whole string is the image, and there is no separate registry concept because a reference already fully identifies the artifact.
- **B.** `team/api` is the registry and `registry.example.com` is only the network address used to reach it, which are treated as the same field.
- **C.** `registry.example.com` is the registry, the server that stores and distributes the artifact; the artifact it holds is the image referenced by the rest of the string.
- **D.** `1.4.2` is the registry, since it is the part of the reference that changes most often as new versions are shipped.

**Answer: C.** A full reference is `registry/repository:tag`. The registry is the server, the repository is a named collection of tags inside it, and the image is the artifact a given tag points to.

- A is wrong: The reference does identify the artifact, but the leading host segment names a distinct server that stores and serves it, not part of the image itself.
- B is wrong: `team/api` is the repository, a named collection of tags inside the registry, not the registry itself.
- D is wrong: `1.4.2` is the tag, a mutable pointer to one image inside a repository; it has no relationship to the registry hostname.

### 77.

An image tagged only `api:1.4.2`, with no registry host in the name, is pushed with `docker push api:1.4.2` and the team is surprised it never reaches their private registry. Why?

- **A.** `docker push` requires a separate `--registry` flag naming the destination, and the command silently no-ops without it That framing assumes the registry host has to be supplied as a flag rather than read from the tag itself.
- **B.** `docker pull` must run first to establish the private registry as the active destination for subsequent pushes.
- **C.** The image was pushed correctly, and the private registry's UI is simply slow to reflect newly uploaded tags.
- **D.** With no registry host in the tag, `docker push` targets Docker Hub by default, so the image was never sent to the private registry at all.

**Answer: D.** Pushing to a private registry requires the image to be tagged with that registry's host name first. Without it, `docker push` and `docker pull` both resolve against Docker Hub, the CLI's default when no host is given.

- A is wrong: `docker push` takes no such flag; its destination comes entirely from how the image itself is named and tagged.
- B is wrong: Pulling and pushing are independent operations, each resolved from the reference given at the time, not from prior commands run in the session.
- C is wrong: The push genuinely went to Docker Hub rather than the private registry; this is not a display lag on the private registry's side.

### 78.

`docker images` on a workstation shows an image that was built there and never pushed anywhere. Does this contradict the idea that images live in a registry?

- **A.** No, because the local image store is separate from any registry, and an image can exist purely locally without ever having been pushed.
- **B.** Yes, because every `docker build` implicitly pushes its result to the default registry before the command returns Under that framing, a build run with no network connection at all would still have to fail or hang.
- **C.** No, but only because `docker images` actually reads from Docker Hub over the network rather than from local disk.
- **D.** Yes, so the image must actually be a cached copy of some public repository the workstation once pulled from.

**Answer: A.** A registry is where images are stored and distributed once shared, but it is not the only place an image can exist — the local store on any host that ran `docker build` holds a fully usable image with no registry involved.

- B is wrong: A build produces an image in the local store only; nothing is transmitted to any registry unless `docker push` is run separately.
- C is wrong: `docker images` reports the contents of the local image store on disk; it makes no network call to any registry.
- D is wrong: A locally built image built from a Dockerfile has no source repository at all; it need not correspond to anything ever pulled.

### 79.

"It works on my laptop but the cluster cannot start it" is reported for a newly built image. The node logs show it cannot find `team/api:2.0.0` anywhere. Which explanation fits a registry-level cause rather than an application bug?

- **A.** The application inside the image has a bug that only manifests once it is scheduled onto a cluster node instead of a laptop.
- **B.** The Dockerfile used `ADD` instead of `COPY`, which produces images that only run on the machine that built them.
- **C.** The image was built without any environment variables set, so the runtime refuses to schedule it anywhere.
- **D.** The image was built and tagged locally but was never pushed to a registry the cluster's nodes can reach.

**Answer: D.** The registry is the hand-off point between build and run: a scenario where an image works locally but cannot be found by other machines is characteristically a push that never happened, an unreachable registry, or an authentication failure on the node's side.

- A is wrong: The described symptom is a failure to find the image at all, which happens before any application code runs.
- B is wrong: The choice between `ADD` and `COPY` affects what a build step can fetch or extract, not which hosts can later run the resulting image.
- C is wrong: Missing environment variables affect application configuration at run time; they do not prevent a runtime from pulling and starting a container at all.

### 80.

A web API container holds no data of its own and pushes everything to an external database, while a message-queue container stores its messages on local disk. How should these two be classified?

- **A.** Both are stateless, because neither one runs a database engine directly inside its own container.
- **B.** Both are stateful, because every container writes something to its own writable layer while it runs.
- **C.** The API is stateless, so any instance can serve any request and is freely replaceable; the queue is stateful and needs persistent storage and careful handling.
- **D.** The API is stateful because it depends on an external database, and the queue is stateless because messages in transit are transient and never need to outlive the instance holding them.

**Answer: C.** A stateless container keeps nothing that has to outlive it and is freely interchangeable; a stateful container owns data that must survive it and therefore needs persistent storage and, usually, a stable identity.

- A is wrong: Owning data on local disk is what makes a workload stateful, regardless of whether that data lives in a dedicated database engine.
- B is wrong: Writing to a writable layer during normal operation does not make a workload stateful; what matters is whether data must survive the instance being replaced.
- D is wrong: Depending on an external stateful service does not make the dependent instance itself stateful, and messages stored on local disk are exactly the kind of data that must survive the instance.

### 81.

A team plans to handle rising load on a stateful workload the same way they scale their stateless API — simply run more replicas. Why does this not work as cleanly?

- **A.** It works identically for both, since replicas of any workload become fully interchangeable with one another as soon as they are started from the same container image.
- **B.** It fails because stateful workloads cannot be containerized at all and must run directly on bare metal.
- **C.** Scaling a stateful workload is a data problem, not a scheduling one, since each replica would need its own persistent storage and possibly a stable identity.
- **D.** It fails because Docker enforces a hard limit of one replica per stateful container, unlike stateless ones.

**Answer: C.** Horizontal scaling, rolling updates, and self-healing all assume replicas are indistinguishable, which is true by design for stateless workloads. A stateful workload's replicas each need their own persistent storage, which is why scaling it is a data problem rather than simply adding more copies.

- A is wrong: Sharing an image says nothing about whether replicas share or duplicate data; a stateful workload's replicas remain distinct by the data they hold.
- B is wrong: Stateful workloads run in containers routinely, provided they are given persistent storage; containerization itself is not the obstacle.
- D is wrong: There is no such enforced replica limit; the real obstacle is that additional replicas each need their own persistent storage and coordination, not a platform-imposed cap.

### 82.

An on-call engineer kills a misbehaving instance of a service without checking anything first, trusting the platform to recover. For which kind of workload is that trust well placed by default?

- **A.** A stateful one, since persistent storage automatically makes a workload resilient to any instance being killed at will.
- **B.** Either kind equally, since the orchestrator recreates any killed instance the same way regardless of what it holds.
- **C.** A stateless one, where killing one instance costs nothing but in-flight work, since any other instance can serve the same requests.
- **D.** Neither kind, since killing any running instance without warning always risks losing in-flight requests regardless of statelessness.

**Answer: C.** The whole point of a stateless workload is that killing any one instance costs nothing durable — any other instance is equally capable of serving the same requests, which is exactly what self-healing and freewheeling replacement rely on.

- A is wrong: Persistent storage protects the data, but killing a stateful instance without checking anything can still cause data loss or downtime depending on how it manages that storage.
- B is wrong: Recreating an instance says nothing about whether the data it uniquely held survives; that is exactly the distinction between the two kinds of workload.
- D is wrong: In-flight work is a minor, expected cost either way; the distinction that decides whether the trust is well placed is whether irreplaceable data is also at risk.

### 83.

A database container is started with no `-v` flag, runs for weeks, and is then removed and recreated from the same image to pick up a patch. What happens to the data it wrote?

- **A.** It is preserved automatically, because Docker keeps a hidden backup of every container's writable layer and restores it into any replacement container built from the same image.
- **B.** It is preserved, because the new container is created from the same image and therefore inherits the old container's filesystem state along with everything that container wrote at run time.
- **C.** It is gone, because with no volume or bind mount attached, every write landed in the writable layer that is destroyed with the container.
- **D.** It is preserved as long as the old container was stopped rather than removed before the new one was created.

**Answer: C.** A container's writable layer exists only for the lifetime of that specific container. Without a volume or bind mount, data written inside it is destroyed the moment the container is removed, which is the single most common beginner error this concept guards against. Managed storage created ahead of time is inspected with `docker volume`.

- A is wrong: Docker keeps no such backup; a writable layer is deleted along with the container that owned it, with nothing retained.
- B is wrong: A new container starts from the image's layers only; it has no knowledge of, or access to, a previous container's writable layer.
- D is wrong: The scenario explicitly removes the old container, and even a stopped-but-not-removed container's data cannot transfer to a separate new container without an explicit mount.

### 84.

A requirement states the host team must be able to edit application source files directly with their own editor and see changes reflected instantly inside a development container. Which choice fits, using `docker run -v`?

- **A.** A named volume, written as `-v pgdata:/path/in/container`, since Docker places a named volume inside the project's own source directory where the team's editor already reaches it.
- **B.** A bind mount, written as `-v /host/path:/path/in/container`, since it maps an existing host directory the team already edits with their own tools.
- **C.** `docker run -e SOURCE_PATH=/host/path`, which tells the container which host directory to read source files from.
- **D.** Rebuilding the image with `docker build` every time a source file changes, so the new content is baked in before each run.

**Answer: B.** Writing the source as an existing host path in `-v source:/path/in/container` produces a bind mount, which depends on and directly reflects the host's own directory structure — ideal for mounting source code into a development container.

- A is wrong: A named volume lives in a location Docker manages on its own, independent of any project directory, so host edits to source files never reach it.
- C is wrong: An environment variable configures the application's own settings; it cannot mount a host directory into the container's filesystem.
- D is wrong: Rebuilding on every edit defeats the instant-reflection requirement and is exactly the workflow a bind mount exists to avoid.

### 85.

A team wants Docker itself to own and manage where data lives, rather than depending on a specific host directory layout that might differ between machines. Which mechanism fits, and why not the alternative?

- **A.** A bind mount, because mapping an arbitrary host path is what makes storage portable across machines whose directory layouts and operating systems differ from one another.
- **B.** The container's own writable layer, since it is created fresh by Docker on every run without any host dependency at all.
- **C.** An `ENV` value pointing at a data directory, letting the application decide where Docker should store its files.
- **D.** A named volume, because it is created and managed by Docker in a location it owns, independent of the host's own directory structure.

**Answer: D.** Volumes are managed by Docker, independent of the host's own directory layout, easier to back up and migrate, and shareable between containers; bind mounts depend on the host's own structure, which is what makes them portable in the wrong direction for this requirement.

- A is wrong: A bind mount depends on the host's own directory structure existing at the given path, which is the opposite of portability across differently laid-out machines.
- B is wrong: The writable layer is destroyed with its container and is not a persistence mechanism at all, host-independent or otherwise.
- C is wrong: An environment variable configures the application; it has no ability to create or manage storage on Docker's behalf.

### 86.

A container mounts a named volume at `/data`, but the application actually writes its files to `/var/lib/app`. After the container is removed and recreated, is the data still there?

- **A.** Yes, because any volume mounted anywhere in the container protects the entire container filesystem, not just its own mount point.
- **B.** Yes, because Docker automatically detects where an application actually writes and redirects those writes into the nearest mounted volume it can find in the container.
- **C.** It depends on whether the volume was created with `docker volume create` in advance rather than implicitly by `docker run -v`.
- **D.** No, only the mounted path is persistent; anything written to a different path inside the container still lands in the writable layer and is lost on removal.

**Answer: D.** Neither a volume nor a bind mount protects data written to some other path in the container — only the specific mounted path is persistent, which is why mounting the wrong directory silently persists nothing.

- A is wrong: A mount only covers its own path; the rest of the container's filesystem, including `/var/lib/app` here, remains part of the ordinary writable layer.
- B is wrong: Docker performs no such detection or redirection; a mount applies only to the exact path it was given, nothing else.
- C is wrong: How a named volume came to exist does not change which path it protects; only the mount point given at run time determines that.

