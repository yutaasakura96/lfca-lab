<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — DevOps Fundamentals

158 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A candidate is asked to place cluster, node, pod, and container in a containment hierarchy from largest to smallest. What is the correct order?

- **A.** A cluster contains nodes, a node runs pods, and a pod holds containers.
- **B.** A node contains clusters, a cluster runs pods, and a pod holds containers.
- **C.** A cluster contains pods directly, and nodes are an optional layer that some clusters omit entirely.
- **D.** A pod contains nodes, and a node runs directly inside a container.

**Answer: A.** Node, pod, and container form a containment hierarchy the exam expects a candidate to keep straight: a cluster contains nodes, a node runs pods, and a pod holds containers.

- B is wrong: This reverses the cluster and the node; a cluster is the larger pool that a node belongs to, not the other way around.
- C is wrong: Every cluster needs at least one worker node in order to run pods at all; a node is not an optional layer.
- D is wrong: This inverts the entire hierarchy; a node is a machine that runs pods, not something contained inside one.

### 2.

A new pod remains stuck in a not-starting state, and every node in the cluster is already running workloads near its resource limit. What level does this problem resolve to?

- **A.** The node level, because no node has enough spare resource capacity for the scheduler to place the pod, which is exactly the constraint it schedules against.
- **B.** The registry level, since a pod that cannot start is always evidence that the image it references failed to be pulled from the registry named in its manifest.
- **C.** The container level, since the pod's individual containers must each be resized before the pod as a whole can be scheduled.
- **D.** The Service level, since a stable network endpoint must exist before the scheduler will place any pod behind it.

**Answer: A.** Node capacity is what the scheduler places workloads against, so a pod stuck not starting frequently resolves to a node-level answer — insufficient resources, or no node matching the pod's constraints.

- B is wrong: The scenario describes nodes already at their resource limit, not a failed pull; a registry problem would surface differently.
- C is wrong: Scheduling decides which node a pod goes to as a whole; resizing individual containers inside it does not address the described lack of node capacity.
- D is wrong: A Service governs addressing after pods exist; it is not a prerequisite the scheduler checks before placing a pod on a node.

### 3.

A node running several pods that belong to Deployments is drained for maintenance. What happens to those pods, and why is this considered safe?

- **A.** They pause in place on the draining node and resume there once maintenance finishes, since draining marks a node unschedulable without moving the pods already running on it.
- **B.** They are recreated on other nodes, which is safe only because pods are treated as disposable and their replacements can serve requests just as well.
- **C.** They are deleted permanently, since draining is treated identically to scaling the replica count down to zero.
- **D.** They are converted into a Service so that traffic can continue reaching the maintenance node directly.

**Answer: B.** Nodes are replaceable: draining one causes its pods to be recreated elsewhere, which is only safe because pods are treated as disposable rather than as irreplaceable, hand-tended processes.

- A is wrong: Draining specifically causes a node's pods to be recreated elsewhere so maintenance can proceed without leaving workloads stranded on it.
- C is wrong: Draining moves workloads to other nodes rather than reducing any declared count; the pods are recreated, not permanently removed.
- D is wrong: A Service is an addressing abstraction in front of pods; draining a node has no effect that converts a pod into one.

### 4.

Which statement correctly places the CNCF relative to the Linux Foundation and to Kubernetes?

- **A.** The CNCF is part of the nonprofit Linux Foundation and hosts Kubernetes as one of its graduated projects, providing infrastructure, events, and marketing rather than technical direction.
- **B.** The CNCF is the parent organisation of the Linux Foundation, and Kubernetes is therefore governed directly by the CNCF's own board rather than by any elected committee belonging to the project.
- **C.** The CNCF hosts only the Linux kernel, while Kubernetes is hosted by a separate and unrelated foundation with no Linux Foundation ties.
- **D.** The CNCF is a for-profit vendor consortium that owns the trademarks of every open source project it hosts, Kubernetes included.

**Answer: A.** The Cloud Native Computing Foundation is part of the nonprofit Linux Foundation and hosts a large portfolio of vendor-neutral open source projects, Kubernetes among them, sustaining the ecosystem with infrastructure, events, and marketing rather than technical governance.

- B is wrong: The relationship runs the other way — the CNCF is part of the Linux Foundation, not its parent — and Kubernetes is governed by its own Steering Committee regardless.
- C is wrong: The CNCF's portfolio is the cloud-native ecosystem, Kubernetes included; the Linux kernel is a Linux Foundation project hosted separately from the CNCF's own portfolio.
- D is wrong: The CNCF is a nonprofit foundation whose mission is making cloud native computing ubiquitous, not a for-profit vendor consortium.

### 5.

A candidate reads a question naming both an organisation and a project it hosts, and correctly suspects it is testing whether they collapse hosting and governing into one role. What is the safest general answer to that kind of question?

- **A.** Assume the named organisation both hosts and governs, since a foundation prominent enough to host a project of that size usually also directs its technical roadmap.
- **B.** Assume the project governs itself entirely with no relationship to any hosting organisation at all.
- **C.** Treat the question as unanswerable without knowing the specific committee names involved.
- **D.** State the hosting relationship and the separate governing body explicitly, rather than assuming the host also directs the project technically.

**Answer: D.** This is the same shape as the Linux Foundation's relationship to the Linux kernel, and a question that names one organisation and one project is usually probing whether the candidate collapses the two roles into one — naming hosting and governing as distinct answers it correctly.

- A is wrong: The CNCF charter states that included projects continue under their existing technical governance structure, so hosting a project does not carry technical direction with it.
- B is wrong: The hosting relationship is real and examinable — funding, infrastructure, and marketing support genuinely come from the host — so denying it entirely is also wrong.
- C is wrong: The relationship can be stated correctly without naming an individual: the CNCF hosts and funds, while the project's own elected Steering Committee governs.

### 6.

A new open source project applies to join the CNCF's portfolio. What does progressing from sandbox to graduated status actually represent?

- **A.** The point at which the CNCF takes over day-to-day technical decisions from the project's own maintainers.
- **B.** A rebranding step in which the project's name and trademark transfer fully to Linux Foundation ownership.
- **C.** Demonstrated adoption and governance maturity, tracked by the CNCF as hosting stages, not a transfer of technical direction to the foundation.
- **D.** The moment a project is required to switch its container runtime to containerd and adopt the CNCF's own release cadence as a condition of remaining hosted.

**Answer: C.** Projects enter at sandbox level and progress through incubating to graduated as adoption and governance maturity are demonstrated; a Technical Oversight Committee maintains the foundation's technical vision, while day-to-day technical authority stays with each project's own maintainers.

- A is wrong: Day-to-day technical authority stays with each project's own maintainers and governance structures regardless of hosting stage.
- B is wrong: Graduation is a hosting-maturity classification, not a trademark or naming transfer event of that kind.
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

- **A.** A container problem: stopping and starting the same container refreshes its filesystem to match whatever the image currently contains Under that framing, editing a running container's files and restarting it would silently discard the edits.
- **B.** A registry problem: the fix is to point the deployment at a different registry host that happens to carry a patched dependency.
- **C.** An image problem: the dependency is baked into the layers, so it requires rebuilding, retagging and repushing before any container can pick up the fix.
- **D.** An environment-variable problem: setting the correct version string at run time overrides whatever the filesystem contains.

**Answer: C.** Deciding whether a fix belongs to the image or the running container is the class/instance discrimination this concept exists to teach: filesystem content is an image-level fact, and only a rebuild changes it.

- A is wrong: Starting a stopped container reuses the writable layer it already has; it never re-syncs against a newer version of the image.
- B is wrong: The registry only stores whatever artifact was pushed to it; switching hosts does not change what is inside the image itself.
- D is wrong: Environment variables configure the application at run time; they cannot rewrite a dependency already compiled into the filesystem.

### 10.

Every container built from a particular image was removed with `docker rm`, yet the host's disk usage barely changed. What still occupies the space?

- **A.** The image itself, which is a separate object from any container and persists on disk until something removes it directly.
- **B.** Nothing should remain, so the missing space is most likely an accounting delay in the disk usage tool being consulted That framing assumes the reported figures are simply stale rather than measuring genuinely different things left on disk.
- **C.** Named volumes attached to those containers, which Docker never releases automatically under any circumstance.
- **D.** Cached build context from the last time the image was built, which is stored independently of the image layers.

**Answer: A.** An image is a distinct object from any container created from it, and `docker rm` only removes a container and its writable layer; the underlying image, and the disk it occupies, needs `docker rmi` to reclaim.

- B is wrong: The image genuinely still exists on disk; this is not a reporting artifact but the expected, documented behaviour.
- C is wrong: Volumes are a separate persistence mechanism entirely, and the question describes ordinary container removal with no volumes mentioned.
- D is wrong: Build context is sent to the builder during a build and is not retained afterward as a separate disk consumer.

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

- **A.** Named volumes, since Docker silently doubles their size on every container restart as a caching side effect.
- **B.** Registry credentials cached locally for every image ever pulled, which grow without bound.
- **C.** Log output from `docker exec` sessions, which Docker retains indefinitely by default for every interactive session opened That framing conflates the process a container was started with and the extra processes attached to it afterward.
- **D.** Stopped containers and unused images that were never removed, each still holding its writable layer or full set of image layers.

**Answer: D.** A stopped container keeps its writable layer, and an image with no containers referencing it still occupies disk until explicitly removed. This accumulation is a very common cause of disk pressure on hosts that run many short-lived containers.

- A is wrong: Restarting a container that mounts a named volume does not duplicate or grow the volume's content in any way.
- B is wrong: Cached registry credentials are a small, fixed-size artifact and are not a plausible source of meaningful disk pressure.
- C is wrong: An exec session is not logged or retained separately by Docker at all; it runs an additional process and leaves no persistent record of its own.

### 14.

`docker stop web` is issued against a container whose application ignores termination signals. What happens next?

- **A.** `docker stop` waits indefinitely, since it is defined to never force-terminate a container under any circumstance.
- **B.** The container is immediately removed along with its writable layer, since ignoring the signal is treated as a failure requiring cleanup.
- **C.** The runtime sends SIGTERM, waits a grace period, and then forcibly kills the process if it has not exited by then.
- **D.** The runtime restarts the container automatically to give the application another chance to shut down properly.

**Answer: C.** `docker stop` sends SIGTERM and, if the process has not exited after a grace period (`-t` controls it), sends SIGKILL. This lets applications shut down cleanly when they honour the signal, while still guaranteeing termination when they do not.

- A is wrong: `docker stop` always eventually force-kills the process once its grace period elapses; it does not wait forever for voluntary termination.
- B is wrong: Ignoring the signal only delays the stop; the container is left in a stopped state afterward, not removed.
- D is wrong: A stop request does not trigger a restart cycle; the runtime proceeds toward stopping the same container, not recreating it.

### 15.

A container exited five minutes ago with an error. Which diagnostic step still works, and which does not?

- **A.** Neither works once a container has exited, since both diagnostic commands require the container to still be running.
- **B.** `docker exec -it` still works on an exited container as long as `-t` allocates a fresh terminal for it.
- **C.** `docker logs` still works, because it replays the already-captured stdout and stderr stream; `docker exec -it` does not, because it needs a running process to join.
- **D.** Both work identically, because Docker keeps an exited container's filesystem on disk and queryable, which is all that either of the two commands needs in order to run.

**Answer: C.** Diagnostic order matters: `docker logs` reads the captured stdout/stderr stream and works on a container that has already exited, while `docker exec -it` needs a running process to join and does not.

- A is wrong: `docker logs` specifically works on an exited container because it reads a captured stream rather than talking to a live process.
- B is wrong: Allocating a terminal does not create a process to run inside; exec always needs a running container to attach its new process to.
- D is wrong: An exited container's filesystem being on disk does not make it possible to start a new process inside it; exec still requires a live main process.

### 16.

An application inside a container writes its own log file to `/var/log/app.log` instead of standard output, and `docker logs web` shows nothing useful. What is the fix, and which command exposes the problem?

- **A.** Run `docker logs -f` instead of the plain form, since `-f` widens what the command reads to include log files written anywhere inside the container's own filesystem, not just its output stream.
- **B.** Mount a volume at `/var/log` so the file becomes visible to `docker logs` automatically once it is outside the writable layer.
- **C.** Reconfigure the application to log to stdout and stderr; `docker exec -it web sh` can confirm the file exists inside the container while the platform never sees it.
- **D.** Set `-e LOG_PATH=/var/log/app.log` so the runtime knows where to redirect the captured stream from.

**Answer: C.** Containers deliberately have no journal or syslog by convention, so applications are expected to log to stdout and stderr, which the platform captures. A file written inside the container is invisible to `docker logs` and lost when the container is removed.

- A is wrong: `-f` only follows the same captured stdout/stderr stream live; it does not search the container's filesystem for log files.
- B is wrong: A volume makes a path persistent across container recreation, but it does not make `docker logs` read arbitrary files; that command only ever reads the captured output stream.
- D is wrong: An environment variable configures the application, not what `docker logs` reads; the platform always captures stdout and stderr regardless of any such setting.

### 17.

A container's logging driver is configured to ship output to a remote system, and `docker logs` is run against it locally. What should be expected?

- **A.** It always fails outright, because a remote logging driver replaces the local capture entirely with no exceptions.
- **B.** Unless that cache is explicitly disabled, it generally still works, because Docker Engine keeps a local cache of the stream even under a remote driver.
- **C.** It returns the container's entire filesystem contents instead of just the captured output stream, since the remote driver changes what is read.
- **D.** It requires `docker exec -it` to be run first to establish a connection to the remote logging system before logs can be read.

**Answer: B.** Docker Engine's dual logging keeps a local cache of the captured stream even when a remote driver such as `syslog` or `splunk` ships it elsewhere, so `docker logs` still works under a remote driver — it fails only where that cache is explicitly disabled, and returns nothing at all under the `none` driver.

- A is wrong: A remote driver does not categorically replace local capture; Docker Engine's dual logging keeps a local cache in the ordinary case.
- C is wrong: `docker logs` only ever reads the captured stdout/stderr stream, never the filesystem, regardless of which driver is configured.
- D is wrong: `docker logs` and `docker exec -it` are independent commands; neither is a prerequisite for the other under any logging driver configuration.

### 18.

A candidate uses `docker attach` to a running container's main process instead of `docker exec -it`, and a stray Ctrl-C stops the container entirely. What distinguishes the two commands?

- **A.** Both commands behave identically, and the container would have stopped regardless of which one was used.
- **B.** `docker attach` only works on stopped containers, so the described scenario could not have actually involved it.
- **C.** `docker exec -it` is the one that connects to the container's existing main process, while `docker attach` is the one that starts an additional shell alongside it.
- **D.** `docker attach` connects a terminal to the existing main process, so signals reach it directly; `docker exec` starts a separate new process instead.

**Answer: D.** `docker exec` starts a new process inside a running container, isolated from the main one; `docker attach` connects your terminal directly to the existing main process, where signals such as a stray Ctrl-C can reach and stop it.

- A is wrong: An exec session runs an additional process separate from the main one, so a Ctrl-C there terminates only that additional process, not the container.
- B is wrong: `docker attach` requires a running container, since it connects to that container's live main process; it does not work on a stopped one.
- C is wrong: This reverses the two: `docker exec` starts a new process, while `docker attach` connects to the existing main process.

### 19.

A production fleet needs to survive a node failure, scale up under load, and roll out new versions without downtime. A single-host Compose setup already runs the containers involved. What is missing, and why does adding more containers to the same host not fix it?

- **A.** Orchestration across a pool of hosts with continuous reconciliation: the requirement is about surviving a host failure and rescheduling, which a bigger single host cannot provide.
- **B.** More containers on the same host, since orchestration is fundamentally about running a far larger number of containers than a Compose project on one machine was ever designed to handle.
- **C.** A bigger base image with more resources allocated per container, so each one can absorb more load individually.
- **D.** A faster registry, so that images pull more quickly whenever the single host needs to restart a container.

**Answer: A.** The exam's alternative answer to an orchestration requirement is always a single-host tool, usually Compose. The discriminating property is multiple hosts plus continuous reconciliation — something that keeps comparing running state against declared state and acts on the difference indefinitely, which a single, larger host still cannot provide.

- B is wrong: Container count is not the discriminator; the requirement is surviving a host failure, which no number of containers on one host can satisfy.
- C is wrong: Resource allocation per container does not address a host dying entirely, which removes every container on it regardless of how well-resourced each one was.
- D is wrong: Pull speed does not create the additional hosts, scheduling, or health-checking that surviving a node failure and scaling under load require.

### 20.

A node running several workloads stops reporting heartbeats to the orchestrator. What happens to the workloads that were running on it?

- **A.** They stay assigned to that node indefinitely, since an orchestrator reacts only to a workload's own process crashing and has no view of whether a node is still reporting in.
- **B.** They are paused rather than recreated, waiting for a human operator to manually confirm the node is actually down.
- **C.** They are recreated elsewhere, because nodes are watched the same way workloads are, and a node that stops reporting has its workloads rescheduled rather than left stranded.
- **D.** They are removed permanently, since an orchestrator treats a lost node as a signal to reduce the declared replica count.

**Answer: C.** Nodes are watched the same way individual instances are: a node that stops reporting has its workloads recreated elsewhere instead of left stranded, which is exactly the self-healing property a single-host tool cannot offer.

- A is wrong: Nodes are health-checked the same way workloads are; a node that stops reporting triggers rescheduling of its workloads onto healthy nodes.
- B is wrong: Reconciliation acts automatically once a node is detected as unhealthy; it does not wait on a manual confirmation step before rescheduling.
- D is wrong: A lost node does not change what was declared; the orchestrator still works to satisfy the same declared count by scheduling replacements elsewhere.

### 21.

A CI pipeline builds an image, pushes it, and submits an updated declaration to the cluster. Weeks later, a pod crashes and is replaced automatically. Which component is responsible for that replacement?

- **A.** The orchestrator, because what keeps the declaration true afterward is the orchestrator's continuous reconciliation, not the pipeline that ran once at deploy time.
- **B.** The CI pipeline, since it is triggered automatically to rerun whenever any workload in the cluster crashes.
- **C.** The registry, because it revalidates every image it has served on a fixed schedule and triggers a replacement whenever one of those scheduled checks comes back failing.
- **D.** The container runtime on the node, acting entirely on its own without any coordination from a cluster-level component.

**Answer: A.** Orchestration is not CI/CD: a pipeline builds the image, pushes it, and may submit the updated declaration, but what keeps that declaration true for the weeks afterward — including replacing a crashed workload — is the orchestrator, continuously reconciling.

- B is wrong: A pipeline builds and pushes; it plays no role in detecting a crashed workload weeks after it last ran and has no ongoing connection to the cluster's runtime state.
- C is wrong: A registry only stores and serves images on request; it has no scheduling role and does not trigger replacements for crashed workloads.
- D is wrong: The runtime on a node executes what it is told, but deciding to recreate a crashed workload and where to place it is the orchestrator's reconciliation logic, not an independent runtime decision.

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
- **C.** No, and the actual runtime is the registry that images are pulled from before a node can start them.
- **D.** No, Docker is a full toolchain layered above a runtime; containerd and CRI-O are the components a Kubernetes node typically uses to actually run containers.

**Answer: D.** Docker is a full toolchain — CLI, image building, networking, volume management — layered above a runtime. The runtime itself is the component, typically containerd or CRI-O on a Kubernetes node, that actually creates and runs the container process.

- A is wrong: Kubernetes talks to a runtime through the Container Runtime Interface and supports containerd, CRI-O, and other implementations; it never required Docker specifically.
- B is wrong: Images produced by Docker are ordinary OCI images and run unmodified under containerd or CRI-O; the OCI specifications exist precisely to guarantee this.
- C is wrong: A registry only stores and distributes images; it plays no role in actually creating or running a container process on a node.

### 24.

An image built on a laptop with Docker runs unmodified under containerd on a cluster node with no changes needed. What makes that portability guaranteed rather than lucky?

- **A.** The Open Container Initiative's Image, Runtime, and Distribution specifications, which keep images and runtimes from different vendors interchangeable.
- **B.** Docker Hub silently converts every pushed image into a containerd-specific format before that image can be pulled down onto a cluster node running a different runtime.
- **C.** Kubernetes rebuilds every image from its Dockerfile the first time it is scheduled onto a new node.
- **D.** The node's kubelet translates the image's layers into a Kubernetes-native format before the runtime can use them.

**Answer: A.** The OCI's Runtime, Image, and Distribution specifications are what keep an image built with one tool running unmodified under another; the portability claim is a specification being honoured, not marketing.

- B is wrong: No such conversion happens; an image is stored and served as the same OCI-compliant artifact regardless of which registry hosts it.
- C is wrong: Kubernetes never rebuilds images; it pulls the already-built artifact and hands it to the node's runtime to run as-is.
- D is wrong: The kubelet drives the sequence of pulling and running through CRI, but it does not translate or reformat the image; the runtime consumes standard OCI layers directly.

### 25.

A team hears that "Kubernetes dropped Docker" and worries their Docker-built images will stop working on newer clusters. Is that concern justified?

- **A.** No, Kubernetes changed which runtime component it talks to directly, but images produced by Docker remain standard OCI images and run there without change.
- **B.** Yes, because dropping Docker means the cluster can no longer read images built anywhere except with containerd's own build tool.
- **C.** Yes, and every image will need to be repushed to a containerd-specific registry before it can be pulled again.
- **D.** No, because Kubernetes never had any hand in running containers in the first place, so no change it makes to its own components could affect image compatibility either way.

**Answer: A.** Kubernetes talks to a runtime through the Container Runtime Interface and supports containerd, CRI-O, and other CRI implementations. Images produced by Docker remain ordinary OCI images and run there without change — the runtime interface changed, not the image format.

- B is wrong: The image format is OCI-standard regardless of which build tool produced it; the runtime change concerns how Kubernetes runs containers, not what it can read.
- C is wrong: Registries store OCI images regardless of runtime; nothing about a runtime change requires repushing to a different kind of registry.
- D is wrong: Kubernetes does drive container execution through a runtime via the kubelet; the accurate reassurance is about image portability, not that nothing was ever running.

### 26.

A developer argues that running an application as root inside a container is harmless "because it is only a container." Why is that the wrong instinct?

- **A.** It is not wrong, since the namespaces a container is started with make root inside that container fully equivalent to an ordinary unprivileged user account on the host machine itself.
- **B.** Because a registry automatically rejects any image that was built and run as root, making the practice self-correcting.
- **C.** Because running as root disables the image's declared `EXPOSE` ports, leaving the application unreachable.
- **D.** Because the kernel is shared with the host, the isolation boundary a compromised root process must cross is thinner than a hypervisor's, so the consequences reach further than in a VM.

**Answer: D.** Container isolation is weaker than a virtual machine's because the kernel is shared, so a compromise inside a container that runs as root reaches further than the same compromise would inside a VM — the practical answer is running as a non-root user, not adding a scanner at the end.

- A is wrong: Namespaces narrow what a process can see, but they do not eliminate the shared-kernel attack surface a root process can still reach.
- B is wrong: A registry stores whatever it is pushed and performs no inspection of which user an image runs as.
- C is wrong: The user a process runs as has no effect on port publishing; `EXPOSE` and `-p` are unrelated to the container's user.

### 27.

A registry credential is passed into a build with `ARG`, and a later Dockerfile instruction unsets the variable before the image is finished. Is the credential safe once the build completes?

- **A.** Yes, because unsetting a build argument removes that value from every layer of the finished image, not only from the single layer in which the value was last read during the build.
- **B.** Yes, but only if the base image was pinned to a specific version rather than left unpinned.
- **C.** It depends on whether the credential was also set with `ENV` in addition to `ARG`, since only `ENV` values persist in layers.
- **D.** No, it is still present in the layer where it was written, and unsetting it later does not erase it; it must never enter a layer in the first place.

**Answer: D.** A value passed through `ARG` or set with `ENV` persists in the image and can be recovered from it even if a later instruction unsets it, because layers record history and nothing erases an earlier one — the only reliable approach is to never write a secret into a layer at all.

- A is wrong: Layers are additive history; unsetting a variable in a later instruction changes the final metadata but does not retroactively remove it from the earlier layer.
- B is wrong: Pinning the base image's version affects reproducibility of the build, not whether an `ARG` value persists in a layer once written.
- C is wrong: Both an `ARG` value used during the build and an `ENV` default persist in the image's layers or configuration; using `ARG` alone does not make it safe.

### 28.

A team believes a one-time vulnerability scan performed when an image was first built is sufficient going forward. What is missing from that plan?

- **A.** Nothing is missing, since a base image that passed a scan once can never later be found vulnerable without the image itself changing.
- **B.** Scanning needs to be continuous, because vulnerabilities are discovered later in images that have not themselves changed at all.
- **C.** The scan should have been run against the Dockerfile's text instead of the built image, since vulnerabilities live in instructions, not artifacts.
- **D.** The scan needs to be run once per container created from the image rather than once per image, since each container has its own writable layer.

**Answer: B.** Scanning is a continuous activity rather than a one-off, because vulnerabilities are discovered in images that have not changed at all — a smaller, version-pinned base image reduces what there is to find, but does not remove the need to keep checking.

- A is wrong: New vulnerabilities are regularly disclosed in already-published software, so an unchanged image can become newly flagged with no rebuild involved.
- C is wrong: Vulnerabilities are found in the software packages inside the built image, not in the Dockerfile text describing how it was assembled.
- D is wrong: Vulnerabilities live in the shared image layers, not in any single container's writable layer, so scanning per-container adds nothing a single image-level scan does not already cover.

### 29.

Internal documentation needs one accurate sentence separating a container, the image it came from, and the Kubernetes pod that may wrap it. Which statement keeps the three straight?

- **A.** The container is the read-only template and the image is one running instance created from it, while the pod bundles several unrelated images together Under that framing, deleting the pod would also delete every image it happened to bundle.
- **B.** A pod is simply another name Kubernetes uses for a container, and the image is the file produced by saving a running one Under that framing, restarting a pod would just restart the same underlying container object rather than create a new one.
- **C.** Because a pod schedules its containers together, restarting one always removes and recreates the image it was built from.
- **D.** The image is the read-only template, the container is one running or stopped instance created from it, and the pod is Kubernetes' unit wrapping one or more containers with shared network and storage.

**Answer: D.** The image/container/pod comparison separates template, running instance, and Kubernetes wrapper. Confusing any two of them is the exam's most common trap in this section, because each concept genuinely resembles its neighbours until the cardinality and mutability are pinned down.

- A is wrong: This swaps the template and the instance; the image is immutable and the container is what runs from it, not the reverse.
- B is wrong: A pod is a distinct Kubernetes object that can wrap several containers together; it is not a synonym for container.
- C is wrong: Restarting a container never touches the image; the image is untouched by anything that happens to the containers created from it.

### 30.

A container was started ten minutes ago but no longer appears in the default output of the listing command. Which command reveals it, and why did the default view hide it?

- **A.** `docker run` again with the same name, because the original process needs to be recreated from scratch.
- **B.** `docker ps -a`, because bare `docker ps` shows only currently running containers by default.
- **C.** `docker images`, because a container that stops folds back into the image store it was created from.
- **D.** Nothing brings it back, because a container that exits is deleted automatically the moment its process stops.

**Answer: B.** A container is created with `docker run` and its lifecycle state is queried with `docker ps`, whose default output filters to running containers only; `-a` includes everything, including containers whose main process already exited.

- A is wrong: `docker run` always creates a new container and would fail on a name collision rather than revealing the missing one.
- C is wrong: A container never becomes an image on its own; `docker images` lists templates, not instances.
- D is wrong: Stopping is not removing: an exited container keeps its writable layer and configuration until something explicitly removes it.

### 31.

A team wants to run a Windows-only binary inside a container on a Linux host, reasoning that containers are lightweight and portable. Why does this fail?

- **A.** The registry blocks cross-platform images from being pulled onto a host running a different operating system.
- **B.** A container shares the host kernel rather than booting its own, so it cannot run a program built for a different OS family than the host.
- **C.** The image's Dockerfile would need an extra `RUN` instruction to install a compatibility layer before the build succeeds.
- **D.** Containers behave like small virtual machines, so the fix is simply to boot the container with the correct guest kernel selected, the way a hypervisor picks a guest kernel for a virtual machine.

**Answer: B.** Because a container is a process isolated with namespaces and cgroups on the host's own kernel, it can only run binaries compatible with that kernel. A virtual machine, by contrast, carries and boots its own kernel and can therefore run a different OS family.

- A is wrong: A registry stores and serves images without inspecting or restricting which kernel they were built to run on.
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

- **A.** Yes, every pod in the cluster stops immediately, since the control plane is required continuously for any container to keep running.
- **B.** No, pods already running on healthy nodes keep serving; what stops is new scheduling, updates, and any other change to cluster state.
- **C.** Yes, but only pods managed by a Deployment stop, while bare pods created directly keep running unaffected.
- **D.** No, but only Services stop resolving names while the pods behind them keep running unaffected.

**Answer: B.** Losing the control plane stops new scheduling and new changes, while pods already running on healthy nodes keep serving traffic — a availability distinction the exam likes because it separates decision-making from execution.

- A is wrong: A running pod's containers keep executing on their node independent of a momentarily unreachable control plane; nothing about their process execution depends on it directly.
- C is wrong: Whether a pod is managed by a Deployment or created bare has no bearing on whether it keeps running during a control plane outage; both keep serving on their nodes.
- D is wrong: Cluster DNS and Service resolution are not what fails during a brief control plane outage in this scenario; the accurate distinction is scheduling and changes stopping while running workloads continue.

### 34.

A candidate must name the control plane component that watches for newly created pods with no assigned node and picks one for them. Which is it?

- **A.** `kube-apiserver`, which is the front end for the Kubernetes API and therefore also performs node selection for every pod.
- **B.** etcd, since it stores all cluster data and therefore also decides which node a new pod is assigned to.
- **C.** `kube-controller-manager`, which runs the controller processes and therefore also handles new-pod scheduling as one of its controllers.
- **D.** `kube-scheduler`, which selects a node for each unscheduled pod based on its declared resource needs and placement constraints.

**Answer: D.** The four control plane components have cleanly separable jobs: the API server serves the API, etcd stores state, `kube-scheduler` chooses nodes for unscheduled pods, and `kube-controller-manager` reconciles state through its controllers.

- A is wrong: The API server is the front end for the Kubernetes control plane and exposes the Kubernetes API, but it does not select a node for a pod; that is the scheduler's job.
- B is wrong: etcd is the consistent key-value store backing cluster data; it stores decisions made elsewhere but does not itself decide node placement.
- C is wrong: The controller manager runs reconciliation controllers for existing objects; assigning a node to a newly created, unscheduled pod is the scheduler's separate, dedicated job.

### 35.

A team decides to back up only their application data volumes, reasoning that cluster configuration can always be reapplied from source control. Which single control plane component still deserves its own backup, and why?

- **A.** `kube-scheduler`, because its record of where each pod was placed cannot be reconstructed from manifests in source control and must therefore be preserved in a backup of its own.
- **B.** etcd, because it is the one stateful control plane component, holding the cluster's actual recorded state rather than something rederivable from manifests alone.
- **C.** `kube-apiserver`, because it caches every API request it has ever served and would lose that history without a backup.
- **D.** `kube-controller-manager`, because its reconciliation loops must resume from an exact saved point rather than simply restarting fresh.

**Answer: B.** etcd is the consistent, highly available key-value store backing all cluster data — the one stateful control plane piece, which makes it the thing to back up; the other three components are effectively replaceable without their own persisted state.

- A is wrong: The scheduler makes placement decisions on the fly rather than storing durable state of its own; nothing here needs a dedicated backup.
- C is wrong: The API server is a front end that processes requests against etcd; it is not itself a durable store of request history requiring backup.
- D is wrong: A controller's reconciliation loop compares current state to desired state on each pass and does not require resuming from a precise saved checkpoint of its own.

### 36.

A manifest describing three replicas is applied to a cluster twice in a row, with no changes in between. What happens the second time?

- **A.** Nothing changes, because the description names an end state rather than steps, and applying it twice is the same as applying it once.
- **B.** Three additional replicas are created, since each apply is treated as an imperative instruction to add that many more instances, rather than as a description of the end state to reconcile toward.
- **C.** The cluster rejects the second apply outright, since a manifest can only be applied successfully one time per object.
- **D.** All existing pods are deleted and recreated from scratch, since every apply resets the object's state before reapplying it.

**Answer: A.** Because the description names an end state rather than a sequence of steps, applying it twice is the same as applying it once — the imperative alternative, a script of create-and-modify commands, is not safe to re-run in the same way.

- B is wrong: Applying the same manifest again is not interpreted as an additive instruction; the controller compares to the declared count, which is unchanged, and does nothing further.
- C is wrong: Reapplying an unchanged manifest is a normal, accepted operation; nothing about declarative configuration limits an object to a single apply.
- D is wrong: Reconciliation only acts on the difference between actual and desired state; with no difference present, nothing is deleted or recreated.

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

- **A.** The file names the end state the cluster is continuously driven toward; the running cluster is only wherever reconciliation currently stands relative to it.
- **B.** It is not actually justified, since the live cluster is always more authoritative than any file describing what it should look like.
- **C.** Because version control automatically applies every commit to the cluster the instant it is pushed, keeping the two permanently identical without any separate deployment step.
- **D.** Because the control plane refuses to accept any change that was not first committed to version control.

**Answer: A.** Desired state is stored through the API server, and controllers observe actual state, compare it with desired state, and act to reduce the difference — which is exactly why manifests belong in version control: the file is the source of truth for what the cluster should look like.

- B is wrong: The declarative model inverts that intuition deliberately: the file is what the cluster is continuously reconciled toward, making it the authoritative description.
- C is wrong: Version control by itself applies nothing; some separate process or pipeline must submit the manifest before the cluster reconciles toward it.
- D is wrong: The control plane enforces no such requirement; it accepts any valid submission regardless of whether it originated from version control.

### 39.

Deployment, Kubernetes service, and pod all appear in a change request describing a rolling update. Which statement correctly assigns each object's role?

- **A.** The Deployment governs how many pods and which version, the Service governs how callers address them, and the pod is where the containers actually run.
- **B.** The Service governs how many pods and which version, and the Deployment only selects existing pods by label without creating anything, swapping which object owns replica count and which one owns addressing.
- **C.** The pod governs how many replicas should exist, and the Deployment is merely where the containers physically run.
- **D.** All three objects are interchangeable names for the same underlying Kubernetes resource, differing only by which command created them.

**Answer: A.** The Deployment/Service/pod comparison separates lifecycle, addressing, and execution: the Deployment declares how many pods and which version, the Service provides a stable address for whichever pods currently match its selector, and the pod is where the containers actually run.

- B is wrong: This swaps the two roles: the Deployment creates ReplicaSets and declares the replica count, while the Service selects existing pods and creates nothing.
- C is wrong: A pod knows nothing about how many of itself should exist; replica count is declared on the Deployment, not the pod.
- D is wrong: They are three distinct object types with distinct APIs and responsibilities, not interchangeable names for one resource.

### 40.

An engineer manually deletes one pod belonging to a Deployment declaring three replicas, expecting the application to run with two instances until the next deploy. What actually happens within seconds?

- **A.** The Deployment's replica count silently drops to two, since manual deletion is treated as a deliberate scale-down request.
- **B.** Nothing happens until the next scheduled deploy, since the Deployment only reconciles state when a new version is rolled out and otherwise leaves the running pods untouched.
- **C.** A replacement pod appears almost immediately, because the controller continuously compares actual state against the declared replica count and corrects the difference.
- **D.** The Service in front of the pods creates a replacement directly, since it is responsible for maintaining the pod count behind it.

**Answer: C.** Because the controller is continuously comparing actual against desired, deleting one of its pods does not reduce the count — the replica count is now unsatisfied, so a replacement pod appears almost immediately.

- A is wrong: Manual pod deletion is not interpreted as a scaling instruction; the declared count on the Deployment is untouched by it.
- B is wrong: Reconciliation runs continuously, not only at deploy time; a shortfall against the declared count is corrected immediately, independent of any new rollout.
- D is wrong: A Service selects existing pods and creates nothing; maintaining replica count is the Deployment's job through the ReplicaSet it owns.

### 41.

A Deployment using the default update strategy has its pod template changed to reference a new image version. What actually happens to the running pods, mechanically?

- **A.** A new ReplicaSet is created and scaled up while the old ReplicaSet is scaled down, replacing pods gradually rather than all at once.
- **B.** Every existing pod is edited in place to reference the new image, with no new ReplicaSet or pod ever created.
- **C.** All old pods are deleted immediately and simultaneously, and new ones are created only after every old one is gone.
- **D.** The Service in front of the pods is recreated first, and only then are the pods themselves updated to match.

**Answer: A.** Changing the pod template creates a new ReplicaSet, which is scaled up while the old one is scaled down, so pods are replaced gradually rather than all at once; each such change is a revision that can be rolled back.

- B is wrong: Pods are not edited in place for an image change; a new ReplicaSet is created and its pods gradually replace the old ones.
- C is wrong: A rolling update scales the new ReplicaSet up while scaling the old one down gradually, not an all-at-once delete-then-create sequence.
- D is wrong: A Service selects pods by label and needs no recreation when the Deployment's pod template changes; it keeps routing to whatever currently matches.

### 42.

A workload needs a stable per-instance identity and its own dedicated storage that must not be shared across replicas. Is a Deployment the right object for it?

- **A.** Yes, since a Deployment can be configured to assign a fixed identity to each of its replicas by setting the replica count to a specific value and leaving it unchanged thereafter.
- **B.** No, a Deployment assumes interchangeable, essentially stateless pods, and a workload needing stable identity and per-instance storage is not its job.
- **C.** Yes, because attaching a volume to the Deployment's pod template automatically gives each replica its own separate copy of the data.
- **D.** No, but only because Deployments are limited to stateless container images and cannot reference any image running a database.

**Answer: B.** A Deployment provides declarative updates for pods and ReplicaSets, but it assumes interchangeable, essentially stateless pods — a workload needing stable identity and per-instance storage needs a different workload object built for that purpose.

- A is wrong: The replica count only controls how many interchangeable pods exist; it grants no per-instance identity or dedicated storage to any of them.
- C is wrong: A volume declared on a shared pod template does not automatically partition into separate per-replica copies; interchangeable pods from one template share the same storage definition.
- D is wrong: A Deployment places no restriction on what the image contains; the actual mismatch is the model's assumption of interchangeable replicas, not the image type.

### 43.

A dozen containers, defined together with their networks and volumes, run happily through Docker Compose on one developer's laptop. A colleague calls this "orchestration for small deployments." What is the actual dividing line between Compose and an orchestrator?

- **A.** The number of containers involved — Compose is meant for a handful, while an orchestrator is required once a dozen or more are running.
- **B.** Whether the containers are described declaratively — Compose is imperative, while an orchestrator always requires declarative YAML.
- **C.** Whether the containers were built from a Dockerfile — Compose only runs pre-built images, while an orchestrator can build them too.
- **D.** How many hosts are involved and whether anything keeps watching afterward: Compose applies a file to one machine once, an orchestrator schedules across many and keeps reconciling.

**Answer: D.** Compose and an orchestrator are a named confusable pair, and the dividing line is hosts plus persistence of intent: Compose applies a file to one machine once, while an orchestrator schedules across a fleet and keeps reconciling afterward — not how many containers are involved.

- A is wrong: Compose has no such container-count limit; a dozen containers on one host is well within its normal use, and container count is not what makes something an orchestrator.
- B is wrong: A Compose file is itself declarative, describing services, networks and volumes to be created; declarativeness is not what separates it from an orchestrator.
- C is wrong: A Compose file can reference a build context the same way a plain `docker build` can; build capability is not the dividing line described here.

### 44.

A project's Compose file defines a web service, a worker service, and a shared database, and `docker compose up -d` is run. What creates, and in what relationship?

- **A.** It distributes the three services across whichever machines in the local network have spare capacity, balancing the load automatically.
- **B.** It only creates the containers, leaving the operator to run `docker volume create` and attach each declared mount by hand afterwards for everything else the Compose file happens to describe.
- **C.** It builds fresh images for all three services from their Dockerfiles every time, regardless of whether anything changed.
- **D.** It creates the network, volumes, and containers for all three services on the single host where the command ran, starting anything they depend on as it goes, and detaches immediately.

**Answer: D.** `docker compose up` creates the network, volumes, and containers declared in the file, in dependency order, all on the single host the command runs on; `-d` detaches so the shell returns immediately while the services keep running.

- A is wrong: Compose is a single-host tool; every service in the project runs on the one machine where the command was issued, with no cross-host distribution.
- B is wrong: Compose creates the network and volumes declared in the file as part of the same command, not as a separate manual step.
- C is wrong: `docker compose up` reuses existing images unless a rebuild is requested with `--build`; it does not rebuild unconditionally on every invocation.

### 45.

A machine running a Compose project loses power overnight, and the project declares no restart policy for any of its services. What happens to the application when it comes back, if no one intervenes?

- **A.** It resumes automatically on the same machine, since Compose registers a restart policy with the host's boot process by default.
- **B.** It migrates to another machine on the network automatically, since Compose treats every Docker host it can reach as one interchangeable pool to place services into.
- **C.** It stays down, because Compose has no cross-host scheduling or automatic rescheduling after a host failure; nothing was watching to bring it back.
- **D.** It resumes only the database service, since Compose prioritizes services declared with persistent volumes over stateless ones.

**Answer: C.** Compose has no cross-host scheduling and no rescheduling after a host failure: if the machine dies, the application dies with it, and nothing brings it back until the command is run again — the exact gap an orchestrator is built to close.

- A is wrong: Compose configures no such automatic boot-time recovery by default; nothing restarts the project unless the operator runs the command again.
- B is wrong: Compose has no concept of a pool of hosts at all; it is bound to the single machine where the command was run.
- D is wrong: Compose applies no such prioritization on its own; without the command being run again, nothing in the project restarts regardless of which services declare volumes.

### 46.

An operator stops a Compose project with `docker compose stop` instead of bringing it down, then wonders why the network and containers are still visible in `docker ps -a`. What is the distinction?

- **A.** There is no distinction, and both commands are expected to remove the containers and network identically.
- **B.** The visibility in `docker ps -a` is a stale cache and will clear itself automatically within a few minutes regardless of which command was used.
- **C.** Stopping halts the containers without removing them or the network; only bringing the project down deletes the containers and network it created.
- **D.** Stopping only affects services that declare a database volume, leaving stateless services running as before.

**Answer: C.** Stopping a Compose project halts its containers, mirroring `docker stop`; bringing it down removes the containers and network it created, mirroring `docker rm`. The two are not interchangeable, exactly as at the single-container level.

- A is wrong: Stopping a project merely halts it; only bringing it down removes the containers and network, so the two commands are not interchangeable.
- B is wrong: The containers genuinely still exist after a stop; this is not a caching artifact but the expected state of a stopped, unremoved container.
- D is wrong: Stopping a project halts every service it declares, regardless of whether that service is stateless or stateful.

### 47.

A Dockerfile review flags `EXPOSE 8080` and a teammate assumes the service is now reachable on that port. Is that correct?

- **A.** Yes, because `EXPOSE` opens the port on the host the moment the image is built from that Dockerfile.
- **B.** Yes, but only once the image has actually been pushed to a registry that other hosts can reach.
- **C.** No, and the port additionally needs a matching `-e` environment variable set before it becomes reachable That framing invents a dependency between port publishing and environment variables that Docker does not enforce.
- **D.** No, `EXPOSE` only documents which port the application listens on; publishing it for outside traffic still requires `-p` at run time.

**Answer: D.** `EXPOSE` records intent in the image's metadata and publishes nothing on its own. Traffic only reaches the container once `-p` (or `-P` for every `EXPOSE`d port) is used at `docker run` time to actually publish it on the host.

- A is wrong: `EXPOSE` runs at build time and writes documentation into the image configuration; it performs no host-level publishing at all.
- B is wrong: Pushing to a registry changes where an image can be pulled from; it has no bearing on which ports a running container publishes.
- C is wrong: Reachability is controlled by port publishing alone; no environment variable is required to make a published port answer traffic.

### 48.

`docker build -t api:1.4.2 .` is run from a project directory containing both a `Dockerfile` and a `Dockerfile.dev`. What does the trailing `.` refer to?

- **A.** The specific Dockerfile to build from, so this command would use `Dockerfile.dev` if it sorts first alphabetically.
- **B.** The build context directory sent to the builder, inside which the Dockerfile named `Dockerfile` is found by default.
- **C.** A shorthand telling the CLI to reuse whichever context was used by the previous `docker build` invocation in this shell session.
- **D.** The registry namespace the resulting image will be pushed under once the build finishes.

**Answer: B.** The trailing argument to `docker build` names the build context sent to the builder; the Dockerfile inside it is `Dockerfile` by default and can be redirected with `-f` when another name, such as `Dockerfile.dev`, is intended. Naming the tag explicitly with `docker build -t` is what makes the resulting image referenceable afterward.

- A is wrong: A trailing path argument names the build context, not a specific Dockerfile; an alternate filename must be given explicitly with `-f`.
- C is wrong: The CLI keeps no memory of a previous build's context between invocations; `.` always resolves to the current working directory.
- D is wrong: Namespace and registry are determined entirely by the `-t` tag given to the build, not by the trailing context path.

### 49.

A Dockerfile has `ENTRYPOINT ["python", "app.py"]` and `CMD ["--debug"]`. A user runs `docker run api --verbose`. What actually executes?

- **A.** `python app.py --debug --verbose`, because trailing arguments on `docker run` are appended after whatever `CMD` already supplied.
- **B.** Only `--verbose`, because supplying any argument on `docker run` overrides `ENTRYPOINT` as well as `CMD`.
- **C.** `python app.py --verbose`, because an argument supplied after the image name replaces `CMD` while `ENTRYPOINT` still runs unchanged.
- **D.** `python app.py --debug`, because arguments after the image name on `docker run` are ignored once both `ENTRYPOINT` and `CMD` are set.

**Answer: C.** `ENTRYPOINT` sets the executable and `CMD` supplies its default arguments. Arguments given after the image name on `docker run` replace `CMD`, so the entrypoint still runs but with the new argument in place of the Dockerfile's default.

- A is wrong: A trailing argument on `docker run` replaces `CMD` entirely rather than appending to it, so `--debug` does not survive.
- B is wrong: `ENTRYPOINT` is fixed and is not replaced by trailing run-time arguments; only `CMD` is what those arguments substitute for.
- D is wrong: Trailing run-time arguments are not ignored; they specifically replace `CMD`, which is exactly why `--debug` disappears here.

### 50.

A Dockerfile author chooses `ADD` over `COPY` to bring a local configuration file into the image, believing the two are interchangeable. What can go wrong that `COPY` would have avoided?

- **A.** `ADD` refuses to copy any file larger than a few kilobytes, silently truncating anything bigger.
- **B.** `ADD` does not create a filesystem layer the way `COPY` does, so the configuration file would be lost on rebuild.
- **C.** `ADD` requires the source file to already exist inside a registry, whereas `COPY` reads only from the local build context, treating `ADD`'s remote-URL support as if it excluded local files entirely.
- **D.** `ADD` also auto-extracts recognised local archive files and can fetch remote URLs, behaviour a plain copy instruction should not carry.

**Answer: D.** `ADD` can auto-extract local tar archives and fetch remote URLs in addition to plain copying, which is precisely why `COPY` is the recommended default whenever a plain file copy is all that is wanted — `COPY` cannot surprise you.

- A is wrong: `ADD` has no such size restriction; its extra behaviour is auto-extraction and remote fetching, not truncation.
- B is wrong: Both `ADD` and `COPY` add filesystem content and create layers; neither is metadata-only.
- C is wrong: `ADD` reads from the local build context the same way `COPY` does, aside from its additional URL-fetching capability; it has no registry dependency.

### 51.

The same image needs to run unchanged in development, staging, and production, with only the database URL differing between them. What is the standard mechanism for that difference?

- **A.** Three separate images, one built per environment with the correct database URL baked into each Dockerfile.
- **B.** A different tag per environment, such as `api:dev`, `api:staging`, and `api:prod`, each pointing at differently configured builds.
- **C.** A bind mount pointing at a different configuration directory per environment, chosen by the host running the container.
- **D.** Environment variables set at run time with `-e`, so one image serves all three environments without any rebuild.

**Answer: D.** `-e` at run time sets or overrides configuration for a single container without rebuilding the image, which is exactly what makes one image deployable unchanged across environments that differ only in settings like a database URL.

- A is wrong: Baking a per-environment value into the image is exactly the anti-pattern this mechanism avoids; the requirement is one unchanged image, not three.
- B is wrong: A tag only names which image a reference resolves to; it does not itself carry per-environment configuration without separate builds behind it.
- C is wrong: A bind mount is designed for file-based data such as source code, not the lightweight key-value configuration a database URL represents.

### 52.

A container is already running with `LOG_LEVEL=info` set by its Dockerfile's `ENV`. An operator runs `docker start web -e LOG_LEVEL=debug` hoping to change it live. What actually happens?

- **A.** The container picks up `LOG_LEVEL=debug` immediately, since `docker start` is defined to accept the same flags as `docker run`.
- **B.** The Dockerfile's `ENV LOG_LEVEL=info` is permanently overwritten in the image, affecting every future container built from it.
- **C.** The container restarts with a fresh writable layer, discarding whatever it had written before, because a changed setting forces the container to be rebuilt from its image.
- **D.** The command fails to apply the new value, because `docker start` has no `-e` option at all and a container's environment is fixed at the moment the container is created.

**Answer: D.** `ENV` in a Dockerfile writes a default every container from that image inherits; `-e` at run time overrides it for one container, but only at creation. Because those values are fixed once a container exists, `docker start` cannot apply a new one.

- A is wrong: `docker start` resumes an existing container using its original configuration and does not accept new run-time flags such as `-e`.
- B is wrong: Neither `docker start` nor a run-time `-e` value ever modifies the image; the image's `ENV` default is untouched by anything done to a container.
- C is wrong: `docker start` never resets a container's writable layer; the described failure is that the new flag has no effect at all, not that data is lost.

### 53.

A developer sets a database password with `-e DB_PASSWORD=...` instead of hardcoding it in application code, reasoning this keeps it out of sight. Is the credential now safe?

- **A.** Yes, because environment variables are encrypted by the container runtime the moment the container starts.
- **B.** Yes, but only because `-e` values are discarded from memory once the application process finishes reading them at startup.
- **C.** No, an `-e` value is ordinary container configuration that anyone able to inspect the container can read, so it is no better protected than any other setting.
- **D.** No, but only because the value should have been baked in with `ENV` in the Dockerfile instead, which is the genuinely secure form.

**Answer: C.** Neither `ENV` nor `-e` is a secret store: an `ENV` value is baked into the image and readable by anyone who can pull it, and a `-e` value is readable from the container's configuration on the host. Real secrets belong in a dedicated secret manager instead.

- A is wrong: Neither `ENV` nor `-e` values are encrypted by the runtime; both are stored and readable as plain configuration.
- B is wrong: A `-e` value remains part of the container's recorded configuration for its whole lifetime; it is not discarded after the application first reads it.
- D is wrong: An `ENV` default is part of the image and readable by anyone who can pull it, which is more widely exposed than a run-time `-e` value, not less.

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
- **C.** All six instructions, since every line in a Dockerfile is executed in order and caches its own result as a layer.
- **D.** `COPY`, `RUN`, and `WORKDIR`, because each changes the filesystem, and `WORKDIR` creates its directory when it is missing.

**Answer: D.** `RUN`, `COPY`, and `ADD` add filesystem content and are the layer-producing instructions in the ordinary case; `WORKDIR` is the exception that looks like metadata but also creates a directory, while `ENV`, `LABEL`, `EXPOSE`, and `CMD` record configuration only.

- A is wrong: `WORKDIR` looks like metadata but creates its target directory when that directory does not already exist, which is a real filesystem change.
- B is wrong: `ENV` and `CMD` write configuration metadata with no filesystem content, and `FROM` selects a base rather than adding a layer of its own.
- C is wrong: Caching applies to every instruction, but only some of them change the filesystem; `ENV` and `CMD` cache metadata, not filesystem content.

### 56.

A Dockerfile copies the entire source tree before installing dependencies, and every code change now forces a full dependency reinstall on rebuild. Why?

- **A.** Because dependency installation always re-downloads from the network regardless of what changed, independent of layer order.
- **B.** Because the registry re-validates every layer of an image before allowing a new build to be pushed to it.
- **C.** Because a changed layer invalidates the cache for its own layer and every layer that follows it in the file's order.
- **D.** Because the base image is pulled fresh on every build unless a version tag is explicitly pinned in the `FROM` line.

**Answer: C.** Layers cache in Dockerfile order, and invalidating one layer invalidates every layer after it. Copying the dependency manifest first, installing, and only then copying source keeps the expensive install layer cached across ordinary code changes.

- A is wrong: A dependency install step is cached exactly like any other `RUN`, and reordering the Dockerfile changes how often it actually re-executes.
- B is wrong: The registry plays no role during a local build; it only stores and serves images that have already been built.
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
- **C.** No, `latest` is only the default tag a reference falls back to when none is given, and it is a mutable pointer that can be repointed to any image at all.
- **D.** No, because `latest` is reserved by the registry and can never actually be assigned to a pushed image.

**Answer: C.** A tag is a mutable pointer to an immutable image. `latest` carries no special comparison logic — it is simply the fallback tag used when a reference names a repository without a tag, and whatever was most recently pushed under that name is what it currently points to.

- A is wrong: There is no automatic recalculation; `latest` moves only because a push explicitly named that tag, the same as any other tag.
- B is wrong: That command produces `api:latest` because no tag was given, not because the build process verified it was the newest version.
- D is wrong: `latest` is an ordinary tag like any other; a registry places no restriction on pushing an image under that name.

### 59.

Two nodes pull an image referenced only as `nginx`, minutes apart, and end up running different code even though neither node changed anything. What best explains this?

- **A.** One node pulled from the registry and the other from its local image store, which are guaranteed to diverge over time.
- **B.** Each node's container runtime applies a different default `CMD` when none is pinned by an explicit tag.
- **C.** The nodes are running different container runtimes, and each interprets an untagged reference according to its own rules That framing treats tag resolution as a runtime-specific behaviour rather than something the registry controls uniformly.
- **D.** The reference resolved to `nginx:latest`, and the tag was repointed to a different image by a push that happened between the two pulls.

**Answer: D.** Because a bare `nginx` reference resolves to `nginx:latest`, and `latest` is a mutable pointer rather than a fixed version, two pulls separated in time can legitimately fetch different images. Pinning an explicit version tag, or a digest, is what avoids this drift.

- A is wrong: A pull always checks the registry; a local store is only consulted by `docker run` when deciding whether a pull is even needed.
- B is wrong: A runtime does not alter an image's configured command based on how the image was tagged; `CMD` comes from the image itself.
- C is wrong: Tag resolution is a registry and CLI convention, not a runtime-specific behaviour that would vary between compliant OCI runtimes.

### 60.

A rollback needs to return production to the exact bytes it ran last week, with no possibility of the reference being repointed later. Which reference form guarantees that?

- **A.** The content digest, such as `api@sha256:...`, since it names exact bytes and cannot be repointed the way a tag can.
- **B.** An explicit version tag such as `1.4.2`, because unlike `latest` a numbered tag is guaranteed never to be reused for a different push.
- **C.** Rebuilding from the same Dockerfile a second time, since an identical file always produces byte-identical output.
- **D.** The image's creation timestamp recorded by `docker images`, referenced instead of any tag or digest.

**Answer: A.** Tags, including numbered ones, remain mutable pointers that a later push can repoint. Only a content digest names exact, unrepointable bytes, which is why reproducibility guarantees pin the digest rather than any tag.

- B is wrong: Any tag, numbered or not, is an ordinary mutable pointer; nothing prevents a later push from repointing `1.4.2` to different content.
- C is wrong: A rebuild re-executes instructions such as base image pulls and package installs, which can pick up different content even from an unchanged Dockerfile.
- D is wrong: A timestamp is descriptive metadata for a human reading a list; it is not a reference form that `docker pull` or `docker run` can resolve against.

### 61.

A frontend calls a backend by directly recording one of its pod IP addresses. After a routine redeploy, the frontend cannot reach the backend at all. What is the fix, and why does it hold up across future redeploys?

- **A.** Pin the backend's Deployment to always reuse the exact same pod IP address on every redeploy, so recording it once remains valid.
- **B.** Address the backend through a Kubernetes service instead, since it tracks the current set of matching, ready pods automatically and gives callers one address that never changes.
- **C.** Reduce the backend's replica count to exactly one, since a single-replica Deployment is guaranteed to keep the same pod IP forever, treating replica count as if it controlled address stability.
- **D.** Mount a shared volume between the frontend and backend so the address can be read from a file instead of hardcoded.

**Answer: B.** "The frontend cannot reach the backend after a redeploy" is the archetypal scenario caused by addressing pods directly instead of through a Service, which tracks the set of matching, ready pods automatically and gives callers a name that never changes.

- A is wrong: Pod IPs are assigned fresh on each replacement and are not something a Deployment can pin to a fixed value across redeploys.
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

- **A.** No, because the Service selects by label rather than by address, so it keeps answering as the set of matching pods changes underneath it.
- **B.** Yes, because the Service must be manually recreated after every pod replacement to pick up the new addresses.
- **C.** Yes, because the Service knows which Deployment produced its pods and must wait for that Deployment's rollout to finish before routing again.
- **D.** No, but only because cluster DNS caches the old pod addresses until the rollout is fully finished.

**Answer: A.** The Service's selector matches labels on pods, and the set of matching, ready pods is tracked automatically as pods come and go — the linkage is labels alone, which is exactly what allows a rolling update to swap every pod underneath without the caller noticing.

- B is wrong: A Service tracks matching, ready pods automatically through its label selector; it requires no manual recreation as pods are replaced.
- C is wrong: A Service neither creates pods nor knows which Deployment produced them; the linkage is labels alone, not an awareness of the owning Deployment.
- D is wrong: Continuity comes from the Service tracking ready pods by label in real time, not from DNS caching stale addresses through the rollout.

### 65.

A statement describes Kubernetes as "governed by the CNCF, which also hosts it." Is that the correct relationship?

- **A.** Yes, since a graduated CNCF project is by definition directly governed by the foundation that hosts it.
- **B.** No, because Kubernetes is not hosted by the CNCF at all, but by the Linux Foundation directly instead.
- **C.** Yes, and the Steering Committee referenced elsewhere is simply an internal CNCF department with no independent authority, treating hosting and governance as the same relationship rather than two deliberately separated ones.
- **D.** No, the CNCF hosts Kubernetes as a graduated project, but governance rests with Kubernetes' own Steering Committee, an elected body its charter names as the project's governing authority.

**Answer: D.** Two facts about Kubernetes' standing are routinely confused and both are examinable: it is hosted by the CNCF as a graduated project, and it is governed by its own Steering Committee — the CNCF hosts, funds, and supports; it does not govern.

- A is wrong: Graduation describes hosting maturity, not governance; Kubernetes' own Steering Committee, not the CNCF, is named as its governing body.
- B is wrong: The CNCF, itself part of the Linux Foundation, is specifically the body that hosts Kubernetes as a graduated project.
- C is wrong: The Steering Committee is Kubernetes' own elected governing body, distinct from and not subordinate to the CNCF's internal structure.

### 66.

A candidate preparing for LFCA wonders whether they need to be able to write Kubernetes manifests and pass operational tasks like a CKA candidate. What level of Kubernetes knowledge does the exam actually expect?

- **A.** Vocabulary and purpose, meaning recognising what Kubernetes is for and naming its core objects, not operational skill such as writing manifests.
- **B.** Full manifest-writing ability, since LFCA and CKA test the exact same depth of Kubernetes operational skill.
- **C.** No Kubernetes knowledge at all, since the Containers competency confines itself entirely to single-host Docker concepts.
- **D.** Only enough to describe the CNCF's governance structure, with no expectation of naming any Kubernetes object.

**Answer: A.** LFCA wants vocabulary and purpose, not operational skill — recognising what Kubernetes is for and what its objects are called, not writing manifests or passing a CKA-level practical assessment.

- B is wrong: LFCA and CKA target different depths; LFCA stops at recognition and purpose, while CKA-level operational skill is explicitly out of scope here.
- C is wrong: Kubernetes vocabulary — cluster, node, control plane, pod, Deployment, Service — is explicitly part of the working vocabulary this exam expects.
- D is wrong: Governance is one examinable fact among several; the working vocabulary of cluster, node, pod, Deployment, and Service is expected alongside it.

### 67.

Someone draws an analogy between the CNCF's relationship to Kubernetes and the Linux Foundation's relationship to the Linux kernel. Is that comparison sound?

- **A.** Yes, both foundations host and fund the project without setting its technical direction, which stays with the project's own governance structures.
- **B.** No, because the Linux Foundation directly sets the kernel's technical direction through its own board, while the CNCF deliberately leaves Kubernetes' direction to the project.
- **C.** No, because the CNCF is an entirely separate organisation from the Linux Foundation with no structural relationship between them.
- **D.** Yes, but only because both projects share the exact same Steering Committee membership across kernel and Kubernetes decisions.

**Answer: A.** The governance point mirrors a distinction the exam makes elsewhere: the Linux Foundation hosts and funds the Linux kernel without setting its technical direction, and the CNCF stands in the same relation to Kubernetes.

- B is wrong: Neither foundation sets its hosted project's technical direction; both relationships are hosting and funding without governing.
- C is wrong: The CNCF is part of the nonprofit Linux Foundation, not a separate, unrelated organisation.
- D is wrong: Kubernetes' Steering Committee and the Linux kernel's own governance are separate bodies for separate projects; the analogy is about structural shape, not shared membership.

### 68.

A scaling request asks for "five instances" of a service. One engineer interprets this as five pods; another as five containers inside one pod. Which is the Kubernetes model, and why does it matter?

- **A.** Five containers inside one pod, since a pod is simply Kubernetes' name for a larger container that can hold several processes.
- **B.** Either interpretation is equally correct, since the scheduler treats containers and pods as interchangeable units of placement.
- **C.** Five pods, since the scheduler places pods, never containers directly, so scaling means creating more pods, not adding more containers to one.
- **D.** Five Deployments, one per instance, since each running copy of the service needs its own separate Deployment object.

**Answer: C.** This is the distinction most often missed: the scheduler places pods, not containers, so a pod's containers can never be split across two nodes, and scaling always means creating more pods, never adding more containers to one pod.

- A is wrong: A pod is not a bigger container; it is a distinct wrapper, and adding more containers to one pod is a co-location decision, not a scaling one.
- B is wrong: The scheduler places pods specifically; it has no mechanism for placing individual containers independently of the pod that wraps them.
- D is wrong: A single Deployment already declares a replica count and manages that many pods from one pod template; five separate Deployments would be redundant.

### 69.

A pod holds a main application container and a sidecar container that must share the main container's network so it can inspect traffic on `localhost`. Why does putting both in one pod satisfy that requirement?

- **A.** Containers in the same pod share a network namespace, one IP address and one port space, so they reach each other over `localhost` by design.
- **B.** Because Kubernetes automatically creates a Service between any two containers placed in the same pod.
- **C.** Because every container in a cluster can already reach every other container over `localhost`, regardless of which pod holds it, extending pod-scoped network sharing to the whole cluster.
- **D.** Because both containers were built from the same image, which is what grants them a shared network namespace.

**Answer: A.** Containers in a pod share a network namespace, meaning one IP address and one port space between them, which is exactly why a sidecar that must share the main container's network belongs in the same pod rather than a separate one.

- B is wrong: A Service addresses a set of pods from outside, not two containers within the same pod; pod-internal reachability comes from the shared network namespace itself.
- C is wrong: Localhost reachability is scoped to containers sharing the same pod's network namespace; it does not extend cluster-wide between unrelated pods.
- D is wrong: Network namespace sharing is a property of pod membership, not of whether two containers happen to come from the same image.

### 70.

A failing pod is replaced automatically. Is the replacement the same pod, repaired, or something else?

- **A.** The same pod, repaired in place, since Kubernetes preserves a pod's identity and IP address across any failure it recovers from.
- **B.** Something else; pods are ephemeral, so a failing one is not repaired but replaced by a new pod with a new name and a new IP address.
- **C.** The same pod, but only its IP address changes while its name and configuration stay identical to before the failure.
- **D.** A different pod entirely, created on the same node the failed one was running on, since replacement never crosses node boundaries.

**Answer: B.** Pods are ephemeral: a failing pod is not repaired but replaced, and the replacement is a new pod with a new name and a new IP address — which is exactly why addressing a pod directly is a bug waiting for the next restart.

- A is wrong: A pod's replacement is a genuinely new pod with a new identity and IP; pods are not repaired and resumed the way a stopped container can be.
- C is wrong: Both the name and the IP address change on replacement; nothing about the failed pod's identity is preserved.
- D is wrong: A replacement pod can be scheduled onto any node with capacity; nothing ties it to the specific node the failed pod happened to run on.

### 71.

A bare pod is created directly through the Kubernetes API, with no Deployment involved. What limitation does this carry compared to a pod created by a workload controller?

- **A.** Nothing keeps a declared count of it, and nothing recreates it if it fails, since a bare pod has no controller reconciling toward a desired replica count.
- **B.** It cannot share a network namespace between its own containers the way a Deployment-created pod can, so its containers must reach each other over the cluster network instead.
- **C.** It cannot be scheduled onto a node at all, since only Deployment-created pods are eligible for scheduling.
- **D.** It automatically becomes a Deployment after its first restart, adopting a replica count of one.

**Answer: A.** Bare pods are rarely created directly — a workload controller such as a Deployment is normally what creates them, because it is the controller that watches and maintains a declared replica count; a bare pod has no such supervision and is not recreated if it fails.

- B is wrong: Network namespace sharing between containers is a property of the pod itself, present whether or not a workload controller created it.
- C is wrong: The scheduler places any pod regardless of how it was created; a bare pod is scheduled the same way a Deployment-created one is.
- D is wrong: A bare pod never converts into a Deployment on its own; without one explicitly created, nothing supervises the pod at all.

### 72.

A container is started with `docker run -p 80:8080 api`, and the operator expected the application to become reachable on port 80. It is not. What is wrong?

- **A.** `docker run -p` only works for ports below 1024, so port 80 silently fails to bind and needs root privileges specified separately That framing borrows a general Unix privileged-port rule and applies it directly to the containerized process without checking it.
- **B.** The mapping is reversed: the host port is written first, so this actually forwards host port 80 to container port 8080, not the intended pairing.
- **C.** `EXPOSE` was never declared in the Dockerfile, so `-p` has no effect regardless of which order the ports are written in.
- **D.** The container needs to be recreated with `docker start -p` instead, since `docker run` does not accept port mappings directly.

**Answer: B.** `-p hostPort:containerPort` places the host side first. Writing `-p 80:8080` when port 8080 is the intended host-facing port and 80 is what the application listens on sends traffic the wrong direction — the mapping needs to be reversed.

- A is wrong: Binding a low host port needs the process to have permission to do so, but that is not why this mapping fails, and no such categorical restriction exists in `-p` itself.
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

- **A.** Yes, because every container port is unreachable by anything, including sibling containers, until it has been published with `-p` That framing ignores the shared user-defined network Docker Compose sets up between the project's own containers.
- **B.** No, containers on the same user-defined network reach each other directly by container name on any port, entirely without publishing.
- **C.** Yes, but only `-P` is required rather than an explicit `-p`, since `-P` covers container-to-container traffic specifically.
- **D.** It depends on whether the target container declared `EXPOSE` for that port in its Dockerfile.

**Answer: B.** Publishing with `-p` or `-P` is only about letting traffic in from the host and beyond. Containers attached to the same user-defined network already reach each other directly by container name on any port, with no publishing involved at all.

- A is wrong: Publishing is specifically about host and external reachability; containers sharing a network reach each other's ports without any `-p` involved.
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
- **B.** `registry.example.com` is the registry, the server that stores and distributes the artifact; the artifact it holds is the image referenced by the rest of the string.
- **C.** `team/api` is the registry and `registry.example.com` is only the network address used to reach it, which are treated as the same field.
- **D.** `1.4.2` is the registry, since it is the part of the reference that changes most often as new versions are shipped.

**Answer: B.** A full reference is `registry/repository:tag`. The registry is the server, the repository is a named collection of tags inside it, and the image is the artifact a given tag points to.

- A is wrong: The reference does identify the artifact, but the leading host segment names a distinct server that stores and serves it, not part of the image itself.
- C is wrong: `team/api` is the repository, a named collection of tags inside the registry, not the registry itself.
- D is wrong: `1.4.2` is the tag, a mutable pointer to one image inside a repository; it has no relationship to the registry hostname.

### 77.

An image tagged only `api:1.4.2`, with no registry host in the name, is pushed with `docker push api:1.4.2` and the team is surprised it never reaches their private registry. Why?

- **A.** `docker push` requires a separate `--registry` flag naming the destination, and the command silently no-ops without it That framing assumes the registry host has to be supplied as a flag rather than read from the tag itself.
- **B.** With no registry host in the tag, `docker push` targets Docker Hub by default, so the image was never sent to the private registry at all.
- **C.** `docker pull` must run first to establish the private registry as the active destination for subsequent pushes.
- **D.** The image was pushed correctly, and the private registry's UI is simply slow to reflect newly uploaded tags.

**Answer: B.** Pushing to a private registry requires the image to be tagged with that registry's host name first. Without it, `docker push` and `docker pull` both resolve against Docker Hub, the CLI's default when no host is given.

- A is wrong: `docker push` takes no such flag; its destination comes entirely from how the image itself is named and tagged.
- C is wrong: Pulling and pushing are independent operations, each resolved from the reference given at the time, not from prior commands run in the session.
- D is wrong: The push genuinely went to Docker Hub rather than the private registry; this is not a display lag on the private registry's side.

### 78.

`docker images` on a workstation shows an image that was built there and never pushed anywhere. Does this contradict the idea that images live in a registry?

- **A.** Yes, because every `docker build` implicitly pushes its result to the default registry before the command returns Under that framing, a build run with no network connection at all would still have to fail or hang.
- **B.** No, but only because `docker images` actually reads from Docker Hub over the network rather than from local disk.
- **C.** Yes, so the image must actually be a cached copy of some public repository the workstation once pulled from.
- **D.** No, because the local image store is separate from any registry, and an image can exist purely locally without ever having been pushed.

**Answer: D.** A registry is where images are stored and distributed once shared, but it is not the only place an image can exist — the local store on any host that ran `docker build` holds a fully usable image with no registry involved.

- A is wrong: A build produces an image in the local store only; nothing is transmitted to any registry unless `docker push` is run separately.
- B is wrong: `docker images` reports the contents of the local image store on disk; it makes no network call to any registry.
- C is wrong: A locally built image built from a Dockerfile has no source repository at all; it need not correspond to anything ever pulled.

### 79.

"It works on my laptop but the cluster cannot start it" is reported for a newly built image. The node logs show it cannot find `team/api:2.0.0` anywhere. Which explanation fits a registry-level cause rather than an application bug?

- **A.** The image was built and tagged locally but was never pushed to a registry the cluster's nodes can reach.
- **B.** The application inside the image has a bug that only manifests once it is scheduled onto a cluster node instead of a laptop.
- **C.** The Dockerfile used `ADD` instead of `COPY`, which produces images that only run on the machine that built them.
- **D.** The image was built without any environment variables set, so the runtime refuses to schedule it anywhere.

**Answer: A.** The registry is the hand-off point between build and run: a scenario where an image works locally but cannot be found by other machines is characteristically a push that never happened, an unreachable registry, or an authentication failure on the node's side.

- B is wrong: The described symptom is a failure to find the image at all, which happens before any application code runs.
- C is wrong: The choice between `ADD` and `COPY` affects what a build step can fetch or extract, not which hosts can later run the resulting image.
- D is wrong: Missing environment variables affect application configuration at run time; they do not prevent a runtime from pulling and starting a container at all.

### 80.

A web API container holds no data of its own and pushes everything to an external database, while a message-queue container stores its messages on local disk. How should these two be classified?

- **A.** Both are stateless, because neither one runs a database engine directly inside its own container.
- **B.** Both are stateful, because every container writes something to its own writable layer while it runs.
- **C.** The API is stateful because it depends on an external database, and the queue is stateless because messages in transit are transient and never need to outlive the instance holding them.
- **D.** The API is stateless, so any instance can serve any request and is freely replaceable; the queue is stateful and needs persistent storage and careful handling.

**Answer: D.** A stateless container keeps nothing that has to outlive it and is freely interchangeable; a stateful container owns data that must survive it and therefore needs persistent storage and, usually, a stable identity.

- A is wrong: Owning data on local disk is what makes a workload stateful, regardless of whether that data lives in a dedicated database engine.
- B is wrong: Writing to a writable layer during normal operation does not make a workload stateful; what matters is whether data must survive the instance being replaced.
- C is wrong: Depending on an external stateful service does not make the dependent instance itself stateful, and messages stored on local disk are exactly the kind of data that must survive the instance.

### 81.

A team plans to handle rising load on a stateful workload the same way they scale their stateless API — simply run more replicas. Why does this not work as cleanly?

- **A.** It works identically for both, since replicas of any workload become fully interchangeable with one another as soon as they are started from the same container image.
- **B.** Scaling a stateful workload is a data problem, not a scheduling one, since each replica would need its own persistent storage and possibly a stable identity.
- **C.** It fails because stateful workloads cannot be containerized at all and must run directly on bare metal.
- **D.** It fails because Docker enforces a hard limit of one replica per stateful container, unlike stateless ones.

**Answer: B.** Horizontal scaling, rolling updates, and self-healing all assume replicas are indistinguishable, which is true by design for stateless workloads. A stateful workload's replicas each need their own persistent storage, which is why scaling it is a data problem rather than simply adding more copies.

- A is wrong: Sharing an image says nothing about whether replicas share or duplicate data; a stateful workload's replicas remain distinct by the data they hold.
- C is wrong: Stateful workloads run in containers routinely, provided they are given persistent storage; containerization itself is not the obstacle.
- D is wrong: There is no such enforced replica limit; the real obstacle is that additional replicas each need their own persistent storage and coordination, not a platform-imposed cap.

### 82.

An on-call engineer kills a misbehaving instance of a service without checking anything first, trusting the platform to recover. For which kind of workload is that trust well placed by default?

- **A.** A stateless one, where killing one instance costs nothing but in-flight work, since any other instance can serve the same requests.
- **B.** A stateful one, since persistent storage automatically makes a workload resilient to any instance being killed at will.
- **C.** Either kind equally, since the orchestrator recreates any killed instance the same way regardless of what it holds.
- **D.** Neither kind, since killing any running instance without warning always risks losing in-flight requests regardless of statelessness.

**Answer: A.** The whole point of a stateless workload is that killing any one instance costs nothing durable — any other instance is equally capable of serving the same requests, which is exactly what self-healing and freewheeling replacement rely on.

- B is wrong: Persistent storage protects the data, but killing a stateful instance without checking anything can still cause data loss or downtime depending on how it manages that storage.
- C is wrong: Recreating an instance says nothing about whether the data it uniquely held survives; that is exactly the distinction between the two kinds of workload.
- D is wrong: In-flight work is a minor, expected cost either way; the distinction that decides whether the trust is well placed is whether irreplaceable data is also at risk.

### 83.

A database container is started with no `-v` flag, runs for weeks, and is then removed and recreated from the same image to pick up a patch. What happens to the data it wrote?

- **A.** It is preserved automatically, because Docker keeps a hidden backup of every container's writable layer and restores it into any replacement container built from the same image.
- **B.** It is preserved, because the new container is created from the same image and therefore inherits the old container's filesystem state along with everything that container wrote at run time.
- **C.** It is preserved as long as the old container was stopped rather than removed before the new one was created.
- **D.** It is gone, because with no volume or bind mount attached, every write landed in the writable layer that is destroyed with the container.

**Answer: D.** A container's writable layer exists only for the lifetime of that specific container. Without a volume or bind mount, data written inside it is destroyed the moment the container is removed, which is the single most common beginner error this concept guards against. Managed storage created ahead of time is inspected with `docker volume`.

- A is wrong: Docker keeps no such backup; a writable layer is deleted along with the container that owned it, with nothing retained.
- B is wrong: A new container starts from the image's layers only; it has no knowledge of, or access to, a previous container's writable layer.
- C is wrong: The scenario explicitly removes the old container, and even a stopped-but-not-removed container's data cannot transfer to a separate new container without an explicit mount.

### 84.

A requirement states the host team must be able to edit application source files directly with their own editor and see changes reflected instantly inside a development container. Which choice fits, using `docker run -v`?

- **A.** A named volume, written as `-v pgdata:/path/in/container`, since Docker places a named volume inside the project's own source directory where the team's editor already reaches it.
- **B.** `docker run -e SOURCE_PATH=/host/path`, which tells the container which host directory to read source files from.
- **C.** Rebuilding the image with `docker build` every time a source file changes, so the new content is baked in before each run.
- **D.** A bind mount, written as `-v /host/path:/path/in/container`, since it maps an existing host directory the team already edits with their own tools.

**Answer: D.** Writing the source as an existing host path in `-v source:/path/in/container` produces a bind mount, which depends on and directly reflects the host's own directory structure — ideal for mounting source code into a development container.

- A is wrong: A named volume lives in a location Docker manages on its own, independent of any project directory, so host edits to source files never reach it.
- B is wrong: An environment variable configures the application's own settings; it cannot mount a host directory into the container's filesystem.
- C is wrong: Rebuilding on every edit defeats the instant-reflection requirement and is exactly the workflow a bind mount exists to avoid.

### 85.

A team wants Docker itself to own and manage where data lives, rather than depending on a specific host directory layout that might differ between machines. Which mechanism fits, and why not the alternative?

- **A.** A bind mount, because mapping an arbitrary host path is what makes storage portable across machines whose directory layouts and operating systems differ from one another.
- **B.** The container's own writable layer, since it is created fresh by Docker on every run without any host dependency at all.
- **C.** A named volume, because it is created and managed by Docker in a location it owns, independent of the host's own directory structure.
- **D.** An `ENV` value pointing at a data directory, letting the application decide where Docker should store its files.

**Answer: C.** Volumes are managed by Docker, independent of the host's own directory layout, easier to back up and migrate, and shareable between containers; bind mounts depend on the host's own structure, which is what makes them portable in the wrong direction for this requirement.

- A is wrong: A bind mount depends on the host's own directory structure existing at the given path, which is the opposite of portability across differently laid-out machines.
- B is wrong: The writable layer is destroyed with its container and is not a persistence mechanism at all, host-independent or otherwise.
- D is wrong: An environment variable configures the application; it has no ability to create or manage storage on Docker's behalf.

### 86.

A container mounts a named volume at `/data`, but the application actually writes its files to `/var/lib/app`. After the container is removed and recreated, is the data still there?

- **A.** Yes, because any volume mounted anywhere in the container protects the entire container filesystem, not just its own mount point.
- **B.** Yes, because Docker automatically detects where an application actually writes and redirects those writes into the nearest mounted volume it can find in the container.
- **C.** No, only the mounted path is persistent; anything written to a different path inside the container still lands in the writable layer and is lost on removal.
- **D.** It depends on whether the volume was created with `docker volume create` in advance rather than implicitly by `docker run -v`.

**Answer: C.** Neither a volume nor a bind mount protects data written to some other path in the container — only the specific mounted path is persistent, which is why mounting the wrong directory silently persists nothing.

- A is wrong: A mount only covers its own path; the rest of the container's filesystem, including `/var/lib/app` here, remains part of the ordinary writable layer.
- B is wrong: Docker performs no such detection or redirection; a mount applies only to the exact path it was given, nothing else.
- D is wrong: How a named volume came to exist does not change which path it protects; only the mount point given at run time determines that.

### 87.

A rollback is planned for a service, but the artifact registry has already garbage-collected last week's image. What happens to the rollback?

- **A.** Nothing changes, since rollback always rebuilds a version from source regardless of what the registry currently holds.
- **B.** The rollback can still proceed cleanly by requesting the same version number from the source repository instead.
- **C.** The rollback still succeeds without issue, since a registry only ever stores metadata and the built artifact itself lives in source control beside the code.
- **D.** It silently becomes a rebuild from an old commit rather than a retrieval, because the registry is what turns rollback into a retrieval in the first place.

**Answer: D.** A registry stores built artifacts and images so a specific version can be retrieved and redeployed. If that artifact no longer exists anywhere, rollback quietly turns into a rebuild of an old commit, which may not reproduce the same result.

- A is wrong: The whole point of a registry is that rollback is normally a retrieval rather than a rebuild; this claims that never mattered.
- B is wrong: A source repository holds inputs, not the built artifact; the two are not interchangeable stand-ins for one another.
- C is wrong: A registry stores the built artifact itself, not merely metadata about it, which is exactly why losing it matters.

### 88.

A team wants to adopt continuous deployment, but its automated suite exercises only unit-level behaviour. What does that imply about the plan?

- **A.** Nothing, because continuous deployment only requires the pipeline to have no manual gate, independent of what level its tests happen to exercise on the way through.
- **B.** The pipeline should add an extra manual stage after the tests to compensate for the missing coverage.
- **C.** The strength of the safety net sets the ceiling on the release practice, so nothing else stands between a merge and production once the gate is removed.
- **D.** It does not matter, since automated tests already run on every change regardless of what level they exercise.

**Answer: C.** Automated testing is the safety net that makes frequent deployment tolerable, so the strength of the net sets the ceiling on the release practice. A team cannot honestly run continuous deployment on unit-level coverage alone.

- A is wrong: Removing the gate is necessary but not sufficient; the test coverage left standing has to be able to catch what the gate used to catch.
- B is wrong: Adding a manual stage would make the practice continuous delivery, which is a different, valid but different, choice than the plan describes.
- D is wrong: Running on every change says nothing about scope; a suite that only reaches unit-level behaviour cannot catch integration or end-to-end defects.

### 89.

One release must ship a schema change alongside code that is incompatible with the previous version, so the two cannot coexist serving traffic. A later, unrelated release ships a small, backward-compatible feature that the team wants to validate against real traffic before committing to it fully. Which strategy fits each release?

- **A.** Blue-green for the first release, since it never mixes versions at all; canary for the second, since it deliberately samples traffic to gather evidence before widening.
- **B.** Canary for the first release, since routing a small slice bounds the exposure of the incompatible schema change; blue-green for the second, since a full cutover settles it.
- **C.** A rolling deployment for both releases, since replacing instances in batches works regardless of whether the schema is compatible.
- **D.** Blue-green for both releases, since an all-at-once cutover is always the safest strategy available regardless of what changed.

**Answer: A.** Each strategy fails differently. Blue-green never splits traffic and suits an all-at-once, lockstep change; canary splits it deliberately to learn from production; a rolling deployment splits it only as a side effect of replacing instances.

- B is wrong: A canary briefly runs both versions against a live database, which is exactly what an incompatible schema change cannot tolerate.
- C is wrong: A rolling deployment guarantees a mixed-version window, which is precisely what an incompatible schema change cannot survive.
- D is wrong: Blue-green needs a full second environment and gives up the chance to learn from real traffic, which the second release does not need to pay for.

### 90.

A blue-green cutover switches all traffic to the new environment, and a defect that survived pre-switch testing is discovered ten minutes later. Both versions share one database, and the new version has already written to it. What happens to the promised near-instant rollback?

- **A.** It still holds, because rollback of the code and rollback of the underlying data are the same operation by definition.
- **B.** It is lost, because switching traffic back does not undo the writes the new version already made against the shared database.
- **C.** It still holds, since blue-green always keeps some percentage of users on the old version as a built-in fallback.
- **D.** It still holds regardless, because the old environment is retained and untouched no matter what the new version wrote while it was serving.

**Answer: B.** A shared database that both versions must use silently removes the instant-rollback property, because switching traffic back does not un-apply a schema change or un-write rows the new version already created.

- A is wrong: Code and data rollback are separate concerns, and redeploying old code never automatically undoes writes or migrations.
- C is wrong: Blue-green switches all traffic at one cutover; there is no percentage split at any point, unlike canary.
- D is wrong: The old environment being untouched only protects the code path; a shared database is written to by whichever version is live.

### 91.

Staging and production are each built separately from the same source commit, using slightly different base images and dependency resolutions each time. What class of problem does this practice invite?

- **A.** None, since both environments are still climbing the same ladder from development up toward production.
- **B.** It only matters for developer laptops, and not for environments that sit further along the pipeline.
- **C.** None at all, provided the two separate builds are each triggered from the exact same commit hash, which fixes every input the build consumes.
- **D.** It defeats build once, deploy many, because what was tested in staging is not the same binary running in production even though the source commit is identical.

**Answer: D.** One build produces one artifact, which is then promoted unchanged through every environment. Building separately per environment can silently produce different binaries from an identical commit, which is a whole class of hard-to-diagnose incidents.

- A is wrong: Climbing the same ladder of environments does not fix a rebuild that produces a genuinely different binary at each rung.
- B is wrong: Parity for developer environments is a separate concern; the build-once rule applies equally to staging and production.
- C is wrong: An identical commit can still produce different binaries when the base image or dependency resolution differs between builds.

### 92.

A team routes one percent of traffic to a new version, measures nothing about how it behaves, and widens the share on a fixed weekly schedule regardless of what happened. What is missing from this practice?

- **A.** The all-at-once cutover, since a canary release is only complete once every user has been switched over simultaneously at a single point.
- **B.** The evidence, because a canary that nobody is measuring is a slow rollout with extra steps, since the entire value is in what the small slice reveals.
- **C.** A fixed batch schedule, since instances should be replaced in equal-sized groups rather than by adjusting a traffic percentage.
- **D.** Nothing is actually missing here, provided the deployment mechanism itself is fully automated end to end.

**Answer: B.** A canary's entire purpose is learning from production: a slice of traffic is watched so that widening is a decision informed by real measurement. Without that measurement, the same rollout provides none of the safety it is chosen for.

- A is wrong: An all-at-once cutover describes blue-green; a canary is defined by gradual widening, not a single switch.
- C is wrong: Batch-based replacement describes a rolling deployment; a canary is defined by a traffic share, not by which instances are swapped.
- D is wrong: Automation of the mechanism does not substitute for watching error rate, latency, and business signals during the exposure.

### 93.

A canary release and an A/B test both split traffic between two versions of a service. What separates the two?

- **A.** A canary asks whether a new build is defective and is expected to reach every user; an A/B test tests a hypothesis with two variant implementations and is expected to end with one of them discarded.
- **B.** Nothing meaningfully separates them, since a canary release is simply the name engineers use for an A/B test conducted against live production infrastructure rather than against a test environment of its own.
- **C.** A canary splits traffic gradually over time, while an A/B test always switches every user at once in a single cutover.
- **D.** A canary's traffic split is chosen deliberately, while an A/B test's split is only a side effect of replacing instances in batches.

**Answer: A.** Both split traffic between versions, but a canary is a health check expected to widen to 100 percent once the new build proves sound, while an A/B test is a preference experiment expected to end with the losing variant removed.

- B is wrong: Treating them as synonyms erases the different questions each is designed to answer and the different outcome each expects.
- C is wrong: That single, all-at-once switch describes blue-green; an A/B test can split traffic gradually or evenly, much like a canary can.
- D is wrong: A side-effect split from batch replacement describes a rolling deployment, not an A/B test, which is also deliberate.

### 94.

Terraform, Ansible, and Jenkins are each proposed for a new pipeline. Which one provisions infrastructure, which configures hosts that already exist, and which runs the build and test stages?

- **A.** Terraform is the CI server that runs build and test, Ansible provisions the infrastructure from a declaration, and Jenkins configures the hosts that already exist over SSH.
- **B.** All three are infrastructure-as-code tools, and they are distinguished only by which cloud provider each one targets.
- **C.** Terraform provisions infrastructure from a declaration, Ansible configures the hosts that already exist, and Jenkins runs the pipeline's build and test stages.
- **D.** Terraform and Ansible both run the pipeline's stages, while Jenkins is reserved for provisioning new infrastructure.

**Answer: C.** Recognition of the category each tool belongs to is what matters. Terraform provisions, Ansible configures existing hosts, and Jenkins (alongside GitHub Actions and GitLab CI) runs the pipeline's stages.

- A is wrong: This is category confusion, assigning each tool to the wrong one of the three jobs it does not perform.
- B is wrong: Only Terraform provisions infrastructure declaratively; Ansible configures existing hosts and Jenkins runs pipeline stages instead.
- D is wrong: Running pipeline stages is Jenkins's job; neither Terraform nor Ansible executes build or test stages.

### 95.

Three teams run the same pipeline definition. Team A's every passing change deploys automatically to an acceptance environment and then waits for a release manager to approve going further. Team B's every passing change goes straight to production with no approval step at all. Team C merges frequently and ends up with a tested artifact, deployed nowhere. Match each team to continuous integration, continuous delivery, or continuous deployment.

- **A.** Team A is continuous deployment, since an acceptance environment counts as production for the purpose of this comparison.
- **B.** Team C is continuous delivery, because producing a tested artifact already makes it releasable at any time.
- **C.** Team C is continuous integration, Team A is continuous delivery, and Team B is continuous deployment.
- **D.** Team A and Team B are the same practice, differing only in which environment name their pipeline happens to use.

**Answer: C.** How far an automatically verified change travels on its own separates the three: CI stops at a tested artifact, delivery carries it to the door of production and waits for a person, and deployment walks it through unattended.

- A is wrong: An acceptance environment is exactly not production; the human approval step is what keeps Team A at delivery.
- B is wrong: Releasable requires having reached at least an acceptance environment, which Team C's artifact never does.
- D is wrong: The difference between them is exactly the human gate, not a naming choice about environments.

### 96.

A team practising continuous delivery releases to production twenty times a day, each release still triggered by a person clicking a button. Does this frequency mean the team has actually adopted continuous deployment?

- **A.** No, because release frequency is not what separates the two practices; continuous delivery constrains who decides, and a human decision is still made on every one of the twenty releases.
- **B.** Yes, since twenty releases a day is fast enough that the human step has become a formality rather than a genuine decision point in the release.
- **C.** Yes, because continuous deployment is defined by how often releases happen rather than by whether an approval step exists.
- **D.** No, but only because the team has not also automated its rollback procedure alongside the release button.

**Answer: A.** The difference from continuous deployment is exactly the manual gate and nothing else. A team can practise continuous delivery at any release frequency, so long as a person still decides each time.

- B is wrong: However fast the cadence, the step is still a real decision point; frequency alone does not remove the gate.
- C is wrong: This inverts the actual definition, which turns on the presence or absence of the human gate, not on cadence.
- D is wrong: A rollback procedure is part of a complete delivery practice, but it is not what distinguishes delivery from deployment here.

### 97.

An organisation removes the manual approval step from its delivery pipeline, so every passing change now reaches production unattended. Its automated test suite covers only unit-level behaviour. What does this scenario describe?

- **A.** Continuous delivery, since removing a single approval step from the pipeline is still consistent with the release waiting on a human decision made somewhere else in the organisation's approval chain before anything reaches users.
- **B.** A fault, because continuous deployment is normally paired with comprehensive automated testing and progressive rollout, since nothing else stands between a defect and users once the gate is gone.
- **C.** A safe practice, provided the team has documented its rollback procedure somewhere for later reference.
- **D.** Continuous integration, because the stated risk concerns test coverage rather than anything about deployment.

**Answer: B.** Whether an organisation can safely adopt continuous deployment is a question about its test suite and rollback story, not about ambition. Weak coverage paired with no gate is a fault, not a neutral practice.

- A is wrong: No gate remains anywhere in the description, which is exactly the property that makes this deployment rather than delivery.
- C is wrong: A documented rollback does not compensate for a test suite that cannot catch what an unattended pipeline needs it to catch.
- D is wrong: The scenario explicitly reaches production automatically, which is well past where continuous integration's scope ends.

### 98.

Which implication actually holds between continuous delivery and continuous deployment?

- **A.** Continuous delivery implies continuous deployment, and reversing that direction is the actual error to watch for.
- **B.** The two imply each other, since both automate the same pipeline up to the point where a release could happen.
- **C.** Continuous deployment implies continuous delivery, but continuous delivery does not imply continuous deployment.
- **D.** Neither implies the other; each depends independently on continuous integration having already run.

**Answer: C.** Continuous deployment implies continuous delivery because it satisfies everything delivery requires and then removes the remaining gate. Reversing the implication, assuming delivery guarantees deployment, is the standard error.

- A is wrong: This states the implication backwards; delivery is the weaker claim and does not guarantee the gate has been removed.
- B is wrong: Sharing an abbreviation and a pipeline is exactly why the two are confused, but the gate makes them distinct, non-equivalent practices.
- D is wrong: Both do depend on continuous integration, but that shared dependency does not make the implication between them symmetric or absent.

### 99.

One team merges to its shared branch several times a day, with a build and test run triggered automatically on every merge. A second team runs the same pipeline definition nightly against a set of long-lived feature branches, without merging them anywhere near that often. Which team is practising continuous integration?

- **A.** Both teams, since owning an automated pipeline that builds and tests every change is what continuous integration means, whatever the merge frequency behind those runs happens to be.
- **B.** Neither, unless the resulting build is also deployed automatically into an environment afterward.
- **C.** The first team, because continuous integration is the practice of merging and verifying frequently, which the second team's nightly automation does not by itself establish.
- **D.** The second team, because a scheduled nightly run is more disciplined than merging several times within a single day.

**Answer: C.** Continuous integration is a team practice — merge to a shared branch often, verify every change automatically — separate from the pipeline machinery that carries it out. A team can own automation without meaningfully integrating.

- A is wrong: A pipeline can run nightly against long-lived branches with no continuous integration behind it; the machinery is not the practice.
- B is wrong: Deploying anywhere moves the scenario into delivery or deployment; continuous integration stops at a tested artifact.
- D is wrong: Discipline is not the criterion; frequent merging to a shared branch is, and the second team's cadence is the opposite of that.

### 100.

A described workflow ends with: the build passed, and a tested artifact was produced. Nothing further is stated about where that artifact went afterward. Which practice has the description covered so far?

- **A.** Continuous delivery, since producing a tested artifact already means it is inherently something that could be released.
- **B.** The full pipeline stage list, because build and test are only two of several stages a pipeline definition can contain.
- **C.** Continuous integration, since the process runs from a committed change to a tested, deployable artifact and the description stops exactly there.
- **D.** Build and artifact promotion in full, since an artifact was produced and every environment further along the pipeline must therefore already have received it.

**Answer: C.** CI is about integrating and verifying, not about releasing. A scenario that stops at a tested artifact has described CI in full; extending it into deployment moves the description into delivery or deployment instead.

- A is wrong: Releasability requires deployment into at least an acceptance environment, which this description never mentions happening.
- B is wrong: The pipeline is the mechanism running the stages; the description is naming the practice being exercised, not the object running it.
- D is wrong: Nothing in the description says the artifact was promoted anywhere; promotion is a later, unstated step.

### 101.

A staging environment runs a different network topology and a different configuration mechanism than production, though it does use a realistic dataset. What does this arrangement fail to achieve?

- **A.** Nothing important, because parity is a concern that belongs to developer laptops rather than to a shared staging environment.
- **B.** It ends up testing a fourth environment nobody actually deploys to, since each rung on the ladder only works if it is genuinely closer to production than the one below it.
- **C.** It fails to build once and deploy many, since a staging environment that differs from production in topology was clearly built separately from it.
- **D.** It succeeds at the goal, because using a realistic dataset is the one part of parity that genuinely matters here.

**Answer: B.** Each environment exists to eliminate a class of defect before the next is reached, and that only works if each rung is genuinely more realistic than the last. A staging environment that diverges in topology or configuration tests a fourth environment nobody deploys to.

- A is wrong: Parity applies to every rung of the ladder, and staging that diverges in topology fails the same test a developer environment would.
- C is wrong: Build-once concerns the artifact being promoted unchanged; the topology and configuration divergence described here is a separate failure.
- D is wrong: Data realism is only one dimension; a divergent topology or configuration mechanism can hide defects that never appear until production.

### 102.

A developer's laptop cannot match production's request volume, but a container image pins its language runtime's minor version, its linked libc, and its configuration mechanism to match production exactly. Has parity been achieved in the sense the exam means?

- **A.** Yes, because parity is about shape rather than size, and the things that differ silently are what matter, while raw capacity is not one of them.
- **B.** No, because a laptop can never truly match production's conditions no matter what the container image happens to pin.
- **C.** No, because genuine parity requires an identical number of running instances at every single stage of the environment ladder.
- **D.** Yes, but only because the same built artifact is also being promoted unchanged through every later environment.

**Answer: A.** Parity is about shape, not size. A laptop is never going to match production's capacity and does not need to; what must match are the things that differ silently, such as runtime version, linked libraries, and configuration mechanism.

- B is wrong: This treats capacity as though it were part of parity, but parity never required the laptop to match production's scale.
- C is wrong: Instance count is a scale concern belonging to the environment ladder, not to whether the developer's runtime and configuration match production's shape.
- D is wrong: Artifact promotion is a separate practice about environments further along the pipeline, not about what makes a developer's local setup match production.

### 103.

A team runs Jenkins, Terraform, and a fully automated pipeline, but developers still hand every release to a separate operations group that owns production. Is this team practising DevOps?

- **A.** No, because DevOps is one team owning the whole path from development through production operations, and the toolchain is only how that ownership gets exercised.
- **B.** Yes, since running a modern CI/CD toolchain and infrastructure-as-code is what the term DevOps refers to.
- **C.** Yes, provided the two groups coordinate informally on a regular basis, since regular coordination substitutes for changing who is accountable once work has shipped to users.
- **D.** No, but only because the handoff slows the feedback loop rather than because ownership stayed split.

**Answer: A.** DevOps is a culture and operating model first: one team owns delivery end to end. A full toolchain run by a separate operations group that still receives handoffs is automation without the ownership change that defines the practice.

- B is wrong: This is the most common wrong answer the guide warns about: framing DevOps as a toolchain rather than as shared ownership.
- C is wrong: Coordination without changed accountability leaves the handoff, and the incentive split behind it, untouched.
- D is wrong: The slower feedback loop is a consequence of the handoff, not an independent reason the team fails the definition.

### 104.

A company moves from quarterly releases bundling hundreds of changes to daily releases of a handful each. Why does this reduce risk rather than increase it?

- **A.** Each release carries less change, so the candidate causes of a failure are few and the time between making a change and learning its effect is short.
- **B.** Moving testing and security earlier in the lifecycle catches more defects before any release ships at all.
- **C.** Releasing daily forces the team to add substantially more automated test coverage than it had before.
- **D.** It does not reduce risk, because releasing more often simply multiplies the number of separate occasions on which something can go wrong in front of users.

**Answer: A.** A feedback loop is measured in latency, not volume. Smaller, more frequent releases shrink the set of possible causes when something breaks and shorten the interval before the breakage is noticed.

- B is wrong: That describes shift left, a related but separate practice about when quality work happens, not about release size.
- C is wrong: Nothing about release frequency mandates new coverage; the safety net and the cadence are separate levers.
- D is wrong: This mistakes release count for accumulated risk and ignores that each release now carries far less change.

### 105.

An automation task declares that a package must be installed at a given version, checking the current state before acting, and it is run three times in a row against a host that already satisfies that state. Describe what happens on the second and third runs.

- **A.** Both reinstall the package all over again, since idempotent means the exact same action happens on every run regardless of current state.
- **B.** Both report configuration drift, since re-running a task that has already converged always surfaces something new to review.
- **C.** Both trigger the pipeline's automated test suite to run again, since idempotency is a property of the pipeline rather than of the task itself.
- **D.** Both find the declared state already satisfied and change nothing further, which is exactly what makes the task safely re-runnable.

**Answer: D.** An idempotent task checks the current state before acting; once the declared state is satisfied, a second or third run finds nothing to do. That is what makes automation safely re-runnable after an interrupted or retried run.

- A is wrong: This confuses idempotent with unconditional; an idempotent task is defined by checking state first, not by repeating an action blindly.
- B is wrong: A converged, idempotent task reports nothing to change; drift only appears when reality has diverged from the declaration since the last run.
- C is wrong: Idempotency is a property of the individual task's behaviour on repeated runs, not something that governs whether an unrelated test suite reruns.

### 106.

A team keeps a shell script in Git that creates a set of cloud resources. Running the script a second time creates a second set of the same resources, and there is no way to compare what currently exists against what was intended. Is this infrastructure as code?

- **A.** Yes, since both approaches keep their definitions in version control and both are meant to converge on the same eventual result whenever the automation is run again from the top.
- **B.** Yes, because keeping the script in Git and reviewing every change to it is what makes something infrastructure as code.
- **C.** No, but only because the script has not yet been made safely re-runnable at the level of its individual actions.
- **D.** No, it is imperative automation, because infrastructure as code declares a desired end state that re-applying converges on, rather than repeating an action each time it runs.

**Answer: D.** Infrastructure as code declares a desired end state and lets a tool converge on it; a script that duplicates resources on every run and offers nothing to compare reality against is imperative automation, not infrastructure as code.

- A is wrong: Being in Git is not what makes something infrastructure as code; the script here has no declared state to converge toward at all.
- B is wrong: Version control and review are good practice for any code, but they do not supply the declarative, convergent behaviour the concept requires.
- C is wrong: Making the actions idempotent is a related but separate property from declaring infrastructure's desired state and detecting drift against it.

### 107.

What is the one-sentence difference between infrastructure as code and configuration management?

- **A.** The two are the same activity, only applied through different named tools such as Terraform on one side and Ansible on the other.
- **B.** Infrastructure as code brings resources into existence and destroys them; configuration management acts on the state inside systems that already exist.
- **C.** Infrastructure as code runs only on a fixed schedule, while configuration management runs only in response to a commit.
- **D.** Infrastructure as code is always declarative, while configuration management is always written as an imperative script.

**Answer: B.** Infrastructure as code and configuration management both keep declarations in version control and both re-apply to converge, but infrastructure as code brings resources into existence while configuration management acts on systems that already exist.

- A is wrong: The tools do overlap in practice, but the concept's line is which question the run answers, not which vendor happens to be involved.
- C is wrong: Trigger mechanism is incidental to both practices and is not the axis that separates provisioning from configuring.
- D is wrong: Configuration-management tools are typically declarative too; the real separating line is provisioning existence against configuring state.

### 108.

A developer installs a JavaScript library so that only the single project importing it can see it, and separately a system administrator installs a runtime package so that every process on the machine can use it. Which kind of tool performed each installation?

- **A.** A language package manager performed the project-local install, and the operating system's package manager performed the machine-wide one.
- **B.** The operating system's package manager performed both installs, since a package is a package regardless of which tool is used to install it.
- **C.** A container image performed the project-local install, since containers are what pins a project's dependency versions.
- **D.** A language package manager performed both installs, since the operating system exposes identical installation semantics to any caller.

**Answer: A.** A language package manager resolves application-level dependencies for one project; the operating system's package manager installs system-wide software for the machine as a whole. The two answer different questions even though both share the word package.

- B is wrong: The two answer different questions: one resolves what a single application needs, the other installs software for the machine as a whole.
- C is wrong: A container image can carry pinned dependencies, but the install described here is the ordinary job of a language package manager, not a container.
- D is wrong: Machine-wide software is normally the operating system package manager's job; the two tools answer different questions about scope.

### 109.

The same library ends up installed both through a language package manager and through the operating system's package manager on one machine, at two different versions, and which one an application loads now depends on search order rather than intent. What caused this?

- **A.** A missing container image, since an isolated filesystem is the only mechanism that can prevent two copies of one library from coexisting on a machine.
- **B.** Nothing unusual, since every distributable package bundles its own metadata, dependency list, and install scripts by design.
- **C.** Choosing the wrong manager for the kind of dependency involved, since application-level libraries belong to the language package manager and system-wide software belongs to the operating system's own tool.
- **D.** A version-control conflict, since manifest files and lock files exist specifically to prevent this kind of duplication.

**Answer: C.** Installing the same library through both kinds of manager is the classic failure of this boundary: two copies at different versions end up on the system, and which one an application loads depends on search order rather than intent.

- A is wrong: Containers can reduce this risk, but the underlying cause is choosing the wrong manager, not the absence of a container.
- B is wrong: That description of a package's contents does not explain why two managers both installed the same dependency at conflicting versions.
- D is wrong: Manifest and lock files control what one language package manager resolves; they say nothing about a separate install through the operating system's tool.

### 110.

A product team runs one deployable application and complains that a sign-up spike forces them to scale an unrelated video-streaming feature along with it. A colleague separately argues the codebase should be split into microservices because it has become hard to read. Is code readability a reason to make that split?

- **A.** Yes, since decomposing a monolith into services is the standard fix whenever a codebase has become difficult to read and to change over time, and the cost of running the extra services is repaid by how much easier each one is to reason about.
- **B.** No, but only because the team has not yet promoted the same built artifact through every environment it deploys to.
- **C.** Yes, provided the newly split services are also defined declaratively as infrastructure as code from the start.
- **D.** No, because deployment shape and code quality are separate problems; the sign-up spike is a genuine scaling argument, but an untidy codebase is not, and microservices add operational cost regardless of the reason given.

**Answer: D.** The dividing line between a monolith and microservices is deployment independence, not code size or quality. Splitting to scale a genuinely divergent workload is a real trade; splitting because a codebase is hard to read addresses the wrong problem and still buys the operational overhead.

- A is wrong: Splitting for readability spends operational effort on machinery that does not address a code-quality problem at all.
- B is wrong: Build and artifact promotion is an unrelated concern about how a release travels through environments, not about whether to split the codebase.
- C is wrong: Whether infrastructure is declared as code is orthogonal to whether the split is justified by a readability complaint in the first place.

### 111.

Monitoring dashboards for a service are in place and green, yet an operator cannot explain a new failure mode nobody anticipated when writing the dashboards. Why can monitoring be in place and the system still be poorly observable?

- **A.** It cannot happen this way, since a system with monitoring already in place is observable by definition once signals are being collected continuously and displayed on a dashboard someone is watching.
- **B.** Because alerting was not configured to interrupt anyone the moment the dashboards would otherwise have turned green.
- **C.** Observability is simply a synonym for having more dashboards deployed than the ones the team already built.
- **D.** Monitoring reports on signals chosen in advance, while observability is what lets an operator answer a question nobody thought to ask before the incident, without shipping new instrumentation.

**Answer: D.** Monitoring watches signals chosen in advance and answers questions already known to be worth asking. Observability is the property that lets an operator answer a question nobody anticipated, without shipping new instrumentation to find out.

- A is wrong: Collecting quantitative signals continuously is what monitoring is; observability is a further property about answering questions nobody anticipated.
- B is wrong: Alerting is the separate practice of interrupting a human on a breached threshold; it does not explain a gap in answering an unforeseen question.
- C is wrong: More dashboards still only answer questions someone already thought to ask, which is exactly the limit observability exists to lift.

### 112.

A described pipeline builds a container image, runs unit and integration tests against it, and then pushes it to a registry, but it only ever runs when someone manually triggers it against a release branch about once a month. Is this pipeline practising continuous integration?

- **A.** Yes, since every stage associated with continuous integration, build, test, and package, is visibly present in this pipeline's own definition file kept in the repository beside the source.
- **B.** Yes, because pushing the finished image to a registry is what makes the resulting change releasable.
- **C.** No, because the automation exists but continuous integration is defined by merging frequently to a shared branch, which a once-a-month trigger plainly does not provide.
- **D.** No, but only because the pipeline definition was not written in a named tool such as GitHub Actions or Jenkins.

**Answer: C.** A pipeline is the concrete machinery a change runs through, distinct from the practices it may or may not implement. A monthly, manually triggered pipeline is a pipeline and is neither continuously integrating nor delivering.

- A is wrong: Owning the stages is not the same as merging often; a pipeline is not CI/CD by itself, regardless of which stages it lists.
- B is wrong: Releasability is a claim about continuous delivery, not about whether the described merge frequency counts as continuous integration.
- D is wrong: Which tool authors the definition file has no bearing on whether merges to the shared branch happen often.

### 113.

A pipeline stage fails partway through a run. What happens to the change under test, and what happens to the artifact the run had produced up to that point?

- **A.** The remaining stages still execute afterward, since each stage runs independently of whether the one before it passed or failed.
- **B.** The run stops so the change does not progress to later stages, and any artifact from the failed run is never promoted.
- **C.** The previous release is automatically rolled back to undo whatever the failed change would have introduced.
- **D.** Only the failing test is reported, while the build itself is still considered a valid release candidate.

**Answer: B.** A trigger starts a run, and stages execute in order so a failing stage stops the run from progressing. The artifact from a failed run is never promoted, which is why the artifact that reaches an environment is always the one that passed.

- A is wrong: Stages run in order precisely so a failure stops progress; independence between them would defeat the ordering's purpose.
- C is wrong: Rollback concerns an already-released version; nothing here has reached an environment for a rollback to apply to.
- D is wrong: The output of a failing run is binary rather than partial credit; a failed test means the run failed, full stop.

### 114.

A deployment is rolled back by redeploying the previous artifact, but the incident does not end. What is the most likely reason?

- **A.** Data, because a schema migration or writes made by the new version are not undone by redeploying old code, since rollback of code is not rollback of data.
- **B.** The artifact registry must have been misconfigured, since a correctly performed rollback always resolves the underlying incident.
- **C.** The wrong version tag was almost certainly pulled from the registry, targeting the redeploy at the wrong artifact.
- **D.** The team should have used a blue-green cutover instead of simply redeploying the same previous artifact.

**Answer: A.** Rollback returns a system to the previous known-good version, but redeploying yesterday's code does not un-apply a schema migration or un-write rows the new version created, which is why an irreversible change removes the safety net rollback appears to provide.

- B is wrong: This assumes rollback is always sufficient, which is exactly the gap an irreversible migration or write can leave open.
- C is wrong: Nothing in the scenario suggests the wrong artifact was retrieved; the described symptom is consistent with a correct redeploy that data alone defeats.
- D is wrong: Switching strategies would not fix a data problem; even a blue-green rollback cannot undo writes a shared database already received.

### 115.

A Kubernetes Deployment rolls out a new version in batches, waiting for each batch of new Pods to become healthy before scaling down the corresponding old ones. Halfway through, some requests are hitting the new version and some the old one. Is anything evaluating how the new version is behaving under the traffic it has already taken?

- **A.** No, because the mixed-version window is a side effect of replacing instances in batches, not a sample deliberately chosen to be observed the way a canary's slice is.
- **B.** No, but that is expected, since a rolling deployment never allows two different versions to serve production traffic at the same moment.
- **C.** Yes, and any failure during the roll automatically restores a previous revision from the Deployment's rollout history.
- **D.** Yes, because both versions are visibly serving traffic at once, which is a reasonable basis for assuming the rollout is being evaluated.

**Answer: A.** During the roll, some traffic reaches the new version as a consequence of how many instances have been replaced, not as a sample chosen to be observed. Treating a rolling update as though it provided canary-style safety is the error this pair exists to catch.

- B is wrong: Both versions do serve real traffic simultaneously for the duration of the roll; that is exactly the risk the strategy carries.
- C is wrong: Restoring a previous revision is a manual rollback action, not something the roll itself evaluates or triggers automatically.
- D is wrong: Two versions serving traffic simultaneously is not the same as anything measuring how the new one is performing; that is the trap this pair exists to catch.

### 116.

Which Kubernetes Deployment strategy runs by default, and what does the alternative strategy do differently from it?

- **A.** Recreate is the default strategy, and it behaves much like a blue-green cutover between two complete environments.
- **B.** RollingUpdate is the default, replacing instances in batches while the service stays available; Recreate kills every existing Pod before creating any new one, accepting downtime.
- **C.** RollingUpdate is the default, and Recreate is the strategy that restores a previous revision from the rollout history the Deployment retains by default for exactly that purpose.
- **D.** Both strategies avoid downtime entirely, differing only in how many Pods are replaced within each batch.

**Answer: B.** A Kubernetes Deployment's strategy type is RollingUpdate unless set otherwise; the only alternative is Recreate, which kills all existing Pods before creating any new ones and so accepts downtime that RollingUpdate is designed to avoid.

- A is wrong: RollingUpdate is the default, and Recreate has no second environment at all; it simply removes and replaces Pods in place.
- C is wrong: Restoring a previous revision describes a rollback action, not the Recreate strategy, which only governs how new Pods replace old ones.
- D is wrong: Recreate does not avoid downtime at all; it removes every existing Pod before any replacement exists.

### 117.

A library moves from version 1.4.2 to 2.0.0. What does that number alone tell a consumer, and what would 1.5.0 have told them instead?

- **A.** Both signal the same underlying thing, a version increase, since which position changed is only a formatting convention rather than a promise.
- **B.** 2.0.0 means the artifact was pushed to a different registry, and 1.5.0 means it stayed in the original one.
- **C.** 2.0.0 signals a backward-incompatible change to the public API; 1.5.0 would have signalled new but backward-compatible functionality.
- **D.** 2.0.0 means the previous version can no longer be rolled back to, and 1.5.0 means it still can be.

**Answer: C.** Semantic versioning is what makes a version number carry information rather than merely increase. A major bump signals a breaking change to the public API; a minor bump signals new, backward-compatible functionality.

- A is wrong: Treating the scheme as mere formatting rather than a contract is the exact error the concept exists to catch.
- B is wrong: Where an artifact is stored has nothing to do with what its version number encodes about API compatibility.
- D is wrong: Version numbering does not govern what remains retrievable for rollback; that depends on retention in the registry.

### 118.

A security scan and a design-time threat conversation are added at the pull-request stage, replacing a gate that used to run the week before release. Does this mean developers have taken over the security team's job?

- **A.** Yes, because moving a task earlier in the pipeline transfers ownership of it to whoever is already working at that earlier stage, which in practice means the developers.
- **B.** No, but only because the operations group still owns whatever deployment gate remains later in the pipeline.
- **C.** Yes, since shortening the time to notice a defect requires developers to run every check themselves without help.
- **D.** No, because shift left is a statement about when testing and security happen, not about who performs them, so responsibility stays shared across the lifecycle.

**Answer: D.** Shift left moves when testing and security happen, earlier in the lifecycle where a defect is cheaper to fix. It does not mean developers absorb the QA or security team's job; the sharing of responsibility is unchanged.

- A is wrong: This is the exact conflation the guide warns against: earlier is a when, not a transfer of who does the work.
- B is wrong: A remaining downstream gate is not why the answer is no; the definition itself rules out the transfer being described.
- C is wrong: Shortening detection time is a feedback-loop concern and does not require developers to absorb another team's checks.

### 119.

Two teams are merged onto one org chart, but developers are still measured on feature velocity and operators on uptime. Has the silo been removed?

- **A.** Yes, since a single reporting line is what defines a silo in the first place.
- **B.** Yes, because a merged org chart is itself the evidence that an organisation has adopted DevOps, whatever the two groups are each still measured on individually.
- **C.** No, but only because the merged team's release cadence has not yet increased.
- **D.** No, because a silo is an incentive boundary rather than an org-chart boundary, and the conflicting measures preserve it regardless of the new reporting line.

**Answer: D.** A silo is an incentive boundary, not an org-chart boundary. Merging two teams while leaving developers rewarded for velocity and operators for uptime leaves the conflict, and the silo, exactly where it was.

- A is wrong: Reporting structure is not what the concept turns on; unchanged incentives are what preserve a silo.
- B is wrong: A reorganisation on paper is not the culture change DevOps requires; the incentives described here have not moved.
- C is wrong: Release cadence is a downstream effect of removing the silo, not the test for whether it has been removed.

### 120.

What is the one-sentence difference between DevOps and site reliability engineering?

- **A.** DevOps focuses on getting code to production; SRE focuses on ensuring code already running in production keeps working, using an error budget to balance change against stability.
- **B.** They are two names the industry uses for the same discipline, applied to the same set of practices by different companies.
- **C.** SRE is the culture of shared ownership between development and operations, and DevOps is the specialist operations discipline built on top of that culture once it is established.
- **D.** SRE is the practice of making automation safely re-runnable, a property that a DevOps pipeline then schedules on a cadence.

**Answer: A.** SRE applies software engineering to reliability and uses an error budget to trade stability work against release velocity. DevOps is about getting code to production; SRE is about the production system continuing to work once it is there.

- B is wrong: Treating the two as synonyms erases the distinction the concept exists to test.
- C is wrong: This reverses the two: DevOps is the shared-ownership culture, and SRE is the specialist operations discipline.
- D is wrong: That property describes idempotency, an unrelated concept about repeatable operations, not SRE.

### 121.

A developer runs `git branch feature/retry` while on `main`, then immediately makes a commit. On which branch does the new commit land, and why?

- **A.** On `feature/retry`, because creating a branch also checks it out
- **B.** Still on `main`: `git branch` only creates the new pointer at the current commit and does not move HEAD, so the developer never left `main`.
- **C.** On both branches at once, since a new branch starts as an exact copy of the one it was created from and stays synchronized with it until deleted.
- **D.** On neither, because the commit is left unattached until a branch is explicitly switched to

**Answer: B.** A branch is a movable pointer stored under `refs/heads/`, and `git branch <name>` creates that pointer at the current commit without switching to it. `git switch -c <name>` and the older `git checkout -b <name>` both create and switch in one step, which is the distinct behaviour this question is testing against.

- A is wrong: That is what `git switch -c` or `git checkout -b` do; plain `git branch` creates the pointer and deliberately leaves you where you were.
- C is wrong: A branch is a single pointer to one commit, not a copy of the project; a commit advances exactly one branch — whichever one HEAD currently names.
- D is wrong: HEAD always names some branch or commit; the developer stayed on `main` throughout, so the commit is not orphaned, it simply advances `main`.

### 122.

A developer wants to create a branch named `hotfix/login` and start working on it in one step, using the older, more widely recognised form of the command rather than the newer split commands. Which single command does both at once?

- **A.** `git branch hotfix/login`, since branch creation is what starts new work
- **B.** `git checkout -b hotfix/login`, the pre-2.23 command that both creates and switches to the branch
- **C.** `git switch hotfix/login`, since `switch` is the command for moving onto a branch
- **D.** `git tag hotfix/login`, followed by checking that fixed label out to begin editing, since a tag can be checked out the same way a branch can.

**Answer: B.** `git switch -c <name>` and the older `git checkout -b <name>` were both built to create a branch and switch to it in one step; `switch` and `restore` were added in Git 2.23 specifically to split `checkout`'s two unrelated jobs — moving between branches and restoring file contents — into separate commands, but the older combined form still works the same way.

- A is wrong: This creates the pointer but leaves HEAD on the current branch; it does not switch, so it does not satisfy "start working on it."
- C is wrong: Plain `switch` moves to a branch that already exists; without `-c` it refuses when the named branch is not there yet, rather than creating it.
- D is wrong: A tag is a fixed label meant to mark a point such as a release; checking one out leaves you in detached HEAD with no branch to advance as you commit.

### 123.

A team adopts trunk-based development and expects Git to enforce short-lived branches and frequent merges to `main` on its own. Will Git do that?

- **A.** No. Trunk-based development, feature branching and similar strategies are team conventions governing how work travels to the main line; Git provides branches and no opinion about how they are used.
- **B.** Yes — Git rejects a commit if it lands on a branch older than a configured age limit under trunk-based development, once the team enables that convention somewhere in their shared repository configuration.
- **C.** Yes, since `git branch -d` refuses to delete a branch that has not been merged, which enforces frequent merging
- **D.** Yes, because `git merge --ff-only` is the default merge behaviour and forces short-lived branches to stay caught up

**Answer: A.** Branching strategies such as trunk-based development, feature branching and release branches are conventions governing how work travels from a developer to the main line. Git enforces none of them and offers no command for any of them, so a question naming a strategy is asking about team process, not about a command or an option.

- B is wrong: Git has no such age-based enforcement mechanism; a branch can live indefinitely without any commit being rejected for it.
- C is wrong: That protects against losing unmerged commits on deletion; it says nothing about how often branches must be merged, and `-D` overrides it anyway when someone wants to.
- D is wrong: `--ff-only` is not Git's default merge behaviour, and even where used it only refuses a non-fast-forward merge — it does not compel branches to be short-lived.

### 124.

A block on this concept also compares it to "forking a project" in the open-source-licensing sense. What separates a platform fork (or a plain `git clone`) from that older meaning of "fork"?

- **A.** A platform fork always changes ownership of the original project immediately and permanently, while an open-source fork leaves the original maintainers in full and undisputed control of the code, its releases, its trademark, and its governance going forward indefinitely.
- **B.** There is no real difference; both terms describe the exact same server-side copy operation performed by the same button on the same hosting platform.
- **C.** Whether the copy is meant to come back: a platform fork or clone is a mechanical copy made in order to contribute changes back, while forking a project in the open-source sense is a permanent, licence-enabled split into two separately maintained projects.
- **D.** A platform fork requires a `git fork` command, while the open-source sense requires only a licence change filed with the project's chosen governing foundation.

**Answer: C.** Clone versus fork, and forking-a-project in the open-source sense, share only the word: a platform fork or a `git clone` is a mechanical copy made routinely, by any contributor, in order to send changes back; forking a project is a rare, deliberate, permanent split that a project's open-source licence explicitly protects the right to make.

- A is wrong: A platform fork changes nothing about the original repository or its ownership; it only creates a separate server-side copy under the forker's own account.
- B is wrong: The two senses share a word but not a meaning: one is a routine, frequent contribution step, the other a rare and deliberate community split, usually after a governance dispute.
- D is wrong: There is no `git fork` command at all — forking is a hosting-platform feature, not something Git itself does — so neither sense of the word involves one.

### 125.

A contributor has read access but no write access to a project's hosted repository and wants to submit a bug fix. What is the correct first step, given that write access is decided by the remote, not by having a copy of the code?

- **A.** `git clone` the original repository directly, since a clone always grants push access to wherever it was copied from once the URL resolves and the transfer finishes successfully.
- **B.** Open a pull request against the original repository directly, without cloning or forking anything first.
- **C.** Ask an administrator to add the contributor as a collaborator with write access to the original repository.
- **D.** Fork the project on the hosting platform first, to obtain a server-side copy the contributor can push to, then `git clone` that fork locally.

**Answer: D.** Cloning is a Git operation that copies a repository with its full history into a new local directory; forking is a hosting-platform operation that creates a server-side copy under the contributor's own account. The standard route when write access is missing is fork on the platform, `git clone` the fork locally, then push changes to the fork the contributor can write to.

- A is wrong: Clone copies what the contributor can read; whether they may push is decided entirely by the remote's permissions, and cloning changes none of that.
- B is wrong: A pull request names a source branch that must already exist somewhere the contributor can push to; without a fork or write access, there is no branch of theirs to name.
- C is wrong: That would work but is not the usual contribution route for an outside contributor; forking is the standard first step that needs no administrative action from the project's owners.

### 126.

A reviewer asks a contributor to improve a commit message that currently reads only "fix." What information does a good message add that the diff itself can never supply?

- **A.** A complete restatement of which lines were added or removed, for readers who skip the diff
- **B.** The author's name and the commit's timestamp, since those are otherwise missing from the commit and have to be supplied somewhere in its metadata by hand
- **C.** Why the change was made, and what alternative was considered and rejected — reasoning the diff cannot show at all.
- **D.** Which branch the commit belongs to, so `git log` can group commits by branch

**Answer: C.** The convention of a short imperative summary followed by a body exists because the diff already shows what changed, in complete and permanent detail, while nothing else in the repository records why the change was made or what was rejected along the way.

- A is wrong: That information is exactly what the diff already shows permanently; repeating it in the message adds nothing the repository does not already provide.
- B is wrong: Author and timestamp are already recorded on the commit object itself, independent of the message text, so a message adds nothing new there.
- D is wrong: A commit does not belong to a branch in a way the message would need to record; branch membership is just reachability from a movable pointer, unrelated to message content.

### 127.

A developer runs `git commit -m "Add retry to the upload path"` and immediately tells a colleague, "it's done, you should see it now." The colleague pulls and sees nothing new. What is missing from that claim, and which command block on this concept explains it?

- **A.** Nothing is missing; committing in Git publishes the change the same way it would in a centralized system such as Subversion, where the working copy and the server share one history.
- **B.** The commit only recorded a snapshot in the local repository; making it visible to a colleague requires the separate act of pushing it to a shared remote.
- **C.** The commit message was too short for the colleague's client to notice a new commit arrived.
- **D.** The colleague needed to run `git fetch` twice before a single commit becomes visible.

**Answer: B.** A commit is an immutable local snapshot; nothing leaves the machine it was made on until a push. That commit/push split is exactly what the "Not to be confused with: Commit vs Push" block on this concept exists to test — `git commit -m` records, push publishes, and only the second one needs a network.

- A is wrong: That is the centralized-tool model, where committing writes to the one shared history; in Git committing writes only to the author's own copy.
- C is wrong: Message length affects readability, not whether a commit is transmitted anywhere; a one-word message is committed and stays exactly as local as a long one.
- D is wrong: One fetch is enough to retrieve a commit that has actually reached the remote; the real issue here is that nothing was pushed yet, so no number of fetches would find it.

### 128.

A repository has commits on both `main` and an unmerged feature branch. From `main`, which command shows only the commits reachable from where you currently are, correctly omitting the feature branch's commits?

- **A.** `git log --all`, since only the `--all` flag limits output to the current branch
- **B.** `git status`, since it reports which branch is currently checked out along with its history
- **C.** `git diff main feature`, since comparing the two branches shows which commits are unique to each
- **D.** A bare `git log`, which walks the parent chain backwards from HEAD

**Answer: D.** Each commit carries a link to its parent (two parents for an ordinary merge commit, more for an octopus merge of several branches at once, and none for the very first commit), and `git log` walks that chain backwards from HEAD. A commit sitting only on another, unmerged branch is not on that path and so does not appear, which is a statement about reachability, not about the commit being lost.

- A is wrong: `--all` does the opposite of limiting: it shows commits reachable from every ref in the repository, including the feature branch this question wants excluded.
- B is wrong: `git status` reports the working tree, staging area and current branch name, not a list of commits — that is `git log`'s job.
- C is wrong: `git diff` reports line-level content differences between two endpoints, not a list of commit objects; it answers a different question than "what happened."

### 129.

A developer on a Git project loses network access on a train and continues committing, branching and reviewing `git log` for an hour before reconnecting. Why does none of that require the network?

- **A.** Git is distributed: every clone holds the entire history, so committing, branching and reading the log are local operations.
- **B.** Git caches the last few commits locally so short offline sessions work, then reconciles with the server automatically on reconnect, discarding whatever the cache could not hold.
- **C.** A centralized system like Subversion works the same way, since the working copy also stores full history.
- **D.** The developer's machine is temporarily acting as `origin` for the rest of the team.

**Answer: A.** In a distributed system, cloning copies the object database, not just the latest files, so the clone is a full peer that can operate offline. A centralized system keeps one authoritative server copy and needs a round trip for most operations — the architectural fact this whole competency keeps circling back to.

- B is wrong: There is no partial local cache to run out of — a clone holds the complete history from the start, not a rolling window of recent commits.
- C is wrong: The opposite is true of a centralized system: the working copy holds little or none of the history, and most operations need a round trip to the one authoritative server.
- D is wrong: Being a full peer copy is not the same as being the team's configured remote; `origin` is a name assigned by convention, and nothing here reassigns it.

### 130.

A developer wants to see what changed upstream before deciding what to do next, without disturbing the branch they are currently in the middle of editing. Which command fits, and why does the other one not?

- **A.** `git pull` — it downloads commits the same way fetch does, so it is just as safe to run mid-edit without any risk of disturbing the branch currently checked out.
- **B.** `git pull --rebase` — rebasing is a gentler form of pull that never touches the working tree.
- **C.** `git remote -v`, since checking the configured URLs is the safest way to see upstream changes
- **D.** `git fetch`, which downloads commits and updates remote-tracking branches only, leaving the current branch, index and working tree untouched.

**Answer: D.** Fetch cannot surprise you; pull can. `git fetch` downloads commits and updates remote-tracking branches, changing nothing about the current branch, index or working tree; `git pull` runs that same fetch and then immediately integrates the result. The documentation lists four integration options: `--ff-only`, which is the default and fails if the local branch has diverged, `--rebase`, `--no-rebase`, which merges, and `--squash`. Any of them touches the branch a mid-edit developer is standing on.

- A is wrong: Pull is fetch followed immediately by an integration step, which by default fast-forwards and fails outright if the branch has diverged, and merges or rebases when configured to — exactly the disturbance being avoided here.
- B is wrong: `git pull --rebase` is a rebase, with every history-rewriting consequence that carries; it is not gentler, and it can touch the working tree by replaying commits onto the fetched tip.
- C is wrong: Listing remote URLs shows configuration, not new commits; it does not retrieve anything from the server at all.

### 131.

A developer's local `main` is behind the remote's `main`, with no local commits of its own since the last sync. They run `git pull`. What happens, given that the histories have not actually diverged?

- **A.** Pull always opens a merge conflict for review, even when nothing local has changed.
- **B.** Pull refuses to run at all unless `--rebase` or `--no-rebase` is specified up front on the command line, regardless of whether the two branches have actually diverged from one another.
- **C.** The fetch retrieves the new commits, and the integration step fast-forwards `main` to match; there is no conflict and no merge commit, because there was nothing to diverge from.
- **D.** Only the remote-tracking branch updates; the local `main` stays behind until a separate `git merge` is run by hand.

**Answer: C.** `git pull` is fetch followed by an integration step. The documentation gives four options for that step and names `--ff-only` the default, so a branch that is merely behind fast-forwards with nothing specified. Only when the two histories have genuinely diverged does that default fail, at which point the developer chooses `--rebase`, `--no-rebase` or `--squash`, or sets `pull.rebase`, `pull.squash` or `pull.ff`.

- A is wrong: A conflict requires both sides to have changed the same region; with no local commits since the last sync there is nothing on this side to conflict with, so pull completes cleanly.
- B is wrong: Failure is specific to the diverged case: the documented default is `--ff-only`, which fails only when the local branch has diverged, so a branch that is merely behind fast-forwards with no flag at all.
- D is wrong: That describes what a bare `git fetch` would leave behind; `git pull` is precisely fetch plus the integration step, so it also moves the local branch here.

### 132.

A developer runs `git add .` to stage every change, then runs a bare `git diff` and it prints nothing. They conclude nothing changed. Are they right?

- **A.** Yes — `git diff` compares the working tree to the last commit, so empty output always means the files match HEAD exactly, whether or not anything was staged first with `git add` beforehand.
- **B.** No, but only because `git add .` silently failed to stage anything ignored by `.gitignore`
- **C.** Yes, because `git status` would have reported the same empty result if anything remained changed
- **D.** No: a bare `git diff` compares the working tree with the index, and staging moved the changes into the index; `git diff --staged` compares the index with HEAD and would show them.

**Answer: D.** Bare `git diff` compares the working tree with the index, showing what could still be staged; after `git add .` that difference is empty even though the index now differs from HEAD. `git diff --staged` (with `--cached` as a synonym) compares the index with HEAD instead, which is exactly what a commit right now would record.

- A is wrong: That describes `git diff <commit>` against a specific commit, not the bare form; bare `git diff` compares working tree to the index, a different pair of states entirely.
- B is wrong: Files matched by `.gitignore` being skipped is a real behaviour of `git add`, but it explains a partial stage, not why a bare `git diff` prints nothing for files that clearly were staged.
- C is wrong: `git status` would still list the staged files under "Changes to be committed"; it is `git diff` specifically, not `git status`, that goes quiet once everything is staged.

### 133.

A developer wants a compact, one-line-per-commit summary of recent history to scan quickly. Which command and option produces that?

- **A.** `git diff --stat`, since `--stat` produces a one-line-per-file summary
- **B.** `git status -s`, since the short form is described the same way as a condensed view and also prints one line per changed path in the repository.
- **C.** `git log --oneline`, shorthand for `--pretty=oneline --abbrev-commit`, printing one abbreviated hash and subject line per commit
- **D.** `git branch -a`, since listing every branch also lists their most recent commits

**Answer: C.** `git log` answers "what happened," walking parents backwards from HEAD so it lists only commits reachable from where you currently are; `--oneline` is shorthand for `--pretty=oneline --abbrev-commit`, giving one abbreviated hash and subject line per commit for quick scanning.

- A is wrong: `--stat` summarizes changed files in a diff, not commits in the history; it answers "what changed," not "what happened," and shows files, not commits.
- B is wrong: `git status -s` condenses the working tree and staging area's state into short codes; it says nothing about commit history at all.
- D is wrong: `git branch -a` lists branch names, local and remote-tracking; it does not print a scrollable per-commit history at all.

### 134.

A config file containing an API key was committed and pushed weeks ago. Someone notices and adds the file's name to `.gitignore` to fix it. Does that remove the key from the project's history?

- **A.** Yes — once a path is listed in `.gitignore`, Git removes it from every existing commit that mentions it, including copies already fetched into other collaborators' clones on other machines.
- **B.** No. `.gitignore` only affects files Git does not yet track; a file already committed keeps its history and stays in every clone taken since, so the credential must be rotated instead.
- **C.** Yes, but only after the next `git commit` is made, which silently prunes ignored paths from history
- **D.** No, and the fix is to run `git reset` on the repository to erase the file's history entirely

**Answer: B.** `.gitignore` specifies intentionally untracked files, and files already tracked by Git are not affected by it at all. Once a secret is committed and pushed, it is in the history and in every existing clone; the only reliable remediation is to treat the credential as compromised and rotate it, since the copies that already left cannot be recalled.

- A is wrong: This is the exact trap the concept warns about: `.gitignore` governs future tracking decisions, not past commits, so nothing in the existing history changes.
- C is wrong: No ordinary commit prunes prior history; committing again only records the current state going forward and leaves every earlier snapshot exactly as it was.
- D is wrong: The first half is right, but `git reset` only moves the current branch pointer and does not rewrite or erase commits other clones have already taken; it is not the remediation here.

### 135.

After checking out a specific commit hash directly instead of a branch name, `git status` reports "HEAD detached." What does that phrase mean HEAD is now pointing at?

- **A.** The single newest commit in the entire repository, regardless of which branch it is on
- **B.** A newly created branch that Git names automatically after the detach
- **C.** The commit itself, directly by its hash, with no branch name carrying it forward as new commits are made.
- **D.** The remote-tracking branch for `origin`, since detaching disconnects HEAD from the local branches only and reattaches it to the nearest remote-tracking ref instead.

**Answer: C.** HEAD is a pointer to whatever is currently checked out — normally the name of the current branch, which is why committing advances that branch. In detached-HEAD state it names a commit directly instead, with no branch to carry forward, which `git log HEAD` and a bare `git log` both display identically since HEAD is the default starting point either way.

- A is wrong: HEAD names where you currently are, not where the project is furthest along; it can point at any commit, including one far behind the tips of other branches.
- B is wrong: Detaching creates no branch at all; that is precisely what "detached" describes, and any commits made there belong to nothing until a branch is created.
- D is wrong: A remote-tracking branch is a separate local record of the remote's state; detaching HEAD has nothing to do with it and does not repoint it.

### 136.

A `git merge` stops mid-operation with conflict markers written into a file, and the developer edits the file, removing the markers and keeping the content they want. What is the correct next step to mark that file resolved?

- **A.** Run `git merge --abort` to accept the manual edit as the final state.
- **B.** Nothing further is needed, since deleting the conflict markers already resolves the conflict on its own.
- **C.** Re-clone the repository fresh and redo the edits, since a conflicted merge cannot be completed in place.
- **D.** `git add` the edited file, then continue the merge — staging is what tells Git the conflict is settled.

**Answer: D.** A merge conflict is Git declining to guess when both sides changed the same region of a file, so resolution is by definition manual: edit the file, stage it with `git add`, then finish with `git commit` or `git merge --continue`. Git never checks whether the staged content is a sensible merge — that correctness is entirely on the person resolving it.

- A is wrong: `--abort` throws the whole merge attempt away and returns to the pre-merge state; it does not keep the edit or complete anything.
- B is wrong: Git never validates a resolution and the file is still listed as unmerged until it is staged; removing markers alone leaves the path unresolved from Git's point of view.
- C is wrong: A conflicted merge is completed in place all the time; re-cloning discards the very work being resolved and is not how Git expects conflicts to be handled.

### 137.

In the middle of a conflicted merge, a developer runs `git diff` to understand what is in dispute. What does it show, compared to an ordinary `git diff` outside a conflict?

- **A.** The same working-tree-versus-index comparison it always shows, since a merge in progress does not change what `git diff` compares.
- **B.** A combined three-way diff highlighting the changes from both the HEAD and MERGE_HEAD sides, rather than a normal two-sided patch.
- **C.** Nothing, since `git diff` refuses to run at all while a merge is unresolved
- **D.** A list of every commit on both branches that contributed to the conflict

**Answer: B.** `git status` lists conflicted paths under "Unmerged paths" and states that staging with `git add` is how resolution is marked; `git diff` complements that by showing a combined three-way diff against HEAD and MERGE_HEAD during a conflict, rather than its ordinary working-tree-versus-index comparison.

- A is wrong: A conflict is a special case: `git diff` switches to a three-way combined diff against both merge parents instead of its usual working-tree-versus-index comparison.
- C is wrong: `git diff` works normally during a conflict; it is one of the two commands `git status` points to for understanding what needs resolving, alongside listing the unmerged paths.
- D is wrong: Listing commits is `git log`'s job, based on reachability from a ref; `git diff` reports line-level content differences, not a set of commit objects.

### 138.

`main` has not received any new commits since `feature/retry` branched off it. A developer runs `git merge feature/retry` while on `main`. What does the resulting history look like?

- **A.** A new merge commit appears with both branch tips as its parents, recording that the merge happened.
- **B.** The `main` pointer simply advances to `feature/retry`'s tip, and no merge commit is created at all.
- **C.** The commits from `feature/retry` are replayed on top of `main` as new commits with new hashes.
- **D.** Git refuses the merge and asks for a pull request to be opened instead.

**Answer: B.** "Merging always creates a merge commit" is false and is a plausible-sounding distractor precisely because it is true in the more visible, diverged case. When the current branch's tip is already an ancestor of the commit being merged, Git fast-forwards the pointer and creates no merge commit at all; `--no-ff` is the option that forces one anyway.

- A is wrong: That outcome only happens when the two histories have genuinely diverged; here `main` never moved, so there is nothing for a merge commit to combine.
- C is wrong: Replaying commits as new objects with new hashes is what `git rebase` does; `git merge` never rewrites existing commits, on a fast-forward or otherwise.
- D is wrong: A pull request is a hosting-platform review wrapper with no effect on local Git behaviour; `git merge` runs and completes locally regardless of whether one exists.

### 139.

A contributor says: "I merged my branch, so I opened a pull request, and then I rebased it once more to be sure." A reviewer points out that this sentence treats three different things as interchangeable steps in one workflow. Sort them correctly by what each actually is.

- **A.** All three are Git commands with slightly different flags but the same underlying effect on history.
- **B.** Merge is a Git command that joins two histories; a pull request is the hosting platform's review wrapper around a proposed merge, not a Git operation; rebase replays commits onto a new base, rewriting their hashes.
- **C.** Merge and pull request are both Git commands, and rebase is the platform-side review step.
- **D.** Rebase and pull request both rewrite commit hashes, while merge is the only one of the three that leaves history untouched on every kind of merge, fast-forward or diverged, run locally or triggered from a hosted review.

**Answer: B.** Merge and rebase are two Git operations for integrating work — merge preserves both histories and joins them with a merge commit when they diverged, rebase replays commits as new objects onto a different base. A pull request is not an integration operation at all; it is a platform's review wrapper placed around one, and git-scm.com does not define it because it is not a Git concept.

- A is wrong: A pull request has no Git command that opens one — `git request-pull` only prints a summary for a human to send — so it is not a Git operation at all, let alone one with the same effect as merge or rebase.
- C is wrong: Rebase runs entirely locally with `git rebase`; review and status checks are what actually happen on the platform, and a pull request is that platform layer, not merge's counterpart.
- D is wrong: A pull request changes no history at all — opening one only asks that a merge be performed later; rebase is the one that rewrites hashes, not the pull request.

### 140.

An exam-style question lists "pull request" alongside `git commit` and `git merge` as three Git operations to define. Which part of that framing is wrong?

- **A.** Nothing is wrong; all three are standard Git commands documented on git-scm.com with their own manual pages and option lists.
- **B.** "Pull request" is not a Git operation at all; it is a hosting platform's concept, defined nowhere in git-scm.com's documentation, and its own primary source here is GitHub's own documentation rather than a Git manual page.
- **C.** `git merge` is the odd one out, since only commit and pull request happen without a network connection at all, and merge always requires contacting a remote server before it can complete, even when combining two purely local branches.
- **D.** `git commit` is the odd one out, because only merge and pull request combine two branches into a single resulting line of history.

**Answer: B.** A pull request is a proposal, raised on a hosting platform rather than in Git, to merge one branch into another, and the place where review and automated checks attach before that merge happens. It is process, not mechanism: `git commit` and `git merge` both run locally with no platform involved, while a pull request has no Git command that opens one at all.

- A is wrong: `git commit` and `git merge` are documented Git commands; a pull request is a platform feature with no equivalent entry in Git's own manual pages.
- C is wrong: `git merge` runs locally with no network needed, same as `git commit`; a pull request is the one requiring the platform, which is the actual odd one out.
- D is wrong: A pull request does not itself combine anything — it only proposes a merge that a human or the platform performs later — so it does not share that property with `git merge`.

### 141.

A contributor's pull request receives review comments asking for changes. What is the usual way to address them, and what is the usual mistake?

- **A.** Close the request, run `git merge` locally to apply the reviewer's suggestions by hand, then push the merged result as a brand-new commit for the platform to pick up.
- **B.** Rebase the branch onto `main` and force-push it, since only a rewritten branch is eligible to receive further review comments.
- **C.** Push further commits to the same source branch, which updates the existing open request; opening a second pull request to "fix" the first is the usual mistake.
- **D.** Open a second pull request from the same branch, since each round of review comments needs its own request

**Answer: C.** A pull request is the place where review comments and automated checks attach to a proposed merge; pushing further commits to the source branch is typically how those comments get addressed, since it updates the same open request rather than requiring a new one. Merging is generally then carried out by the platform, using whichever strategy the project has configured.

- A is wrong: There is nothing to merge locally at this stage — the branch is still unreviewed and unmerged — and closing the request throws away the review already in progress for no reason.
- B is wrong: Ordinary commits pushed to the source branch are enough to update the request; rebasing is a separate, riskier choice that is not required just to address review feedback.
- D is wrong: This is exactly the wrong reflex the concept warns about: pushing further commits to the source branch is what updates an open request, not opening another one.

### 142.

Using the block that separates recording from publishing, place `git commit` and `git push` on the correct sides of that line.

- **A.** Both commands require a network, since Git needs to contact the remote to compute a commit's hash.
- **B.** `git commit` records the staged content in the local repository, needing no network and visible only to the author; `git push` uploads those commits to a remote branch, needing a network and becoming visible to anyone with access.
- **C.** `git commit` uploads to the remote, and `git push` only updates the local branch pointer.
- **D.** Neither can be refused by the other side; both always succeed once the local repository accepts them, regardless of what state the remote branch, its full commit history, or its configured upstream tracking reference happen to be in at that particular moment.

**Answer: B.** Committing only records a snapshot in the local repository; nothing reaches the remote until a push. The commit/push split is the single most common misconception carried in from centralized tools, where committing itself publishes to the one shared history — Git keeps the two acts separate and only the second one needs a network.

- A is wrong: A commit's hash is computed entirely from local content and the parent it points at; no remote is contacted to produce it, and `git commit` runs the same with or without network access.
- C is wrong: That reverses the two roles: uploading to a remote branch is what `git push` does, while `git commit` only ever moves the local branch pointer, in the local repository.
- D is wrong: A push can be refused as a non-fast-forward update when the remote holds commits it would otherwise discard; a local commit has no equivalent remote-side rejection to worry about.

### 143.

A developer runs `git push -u origin main` for the first time on a new branch, then later runs a bare `git push` and it is rejected as a non-fast-forward update. What does `-u` add, and what does the rejection mean?

- **A.** `-u` records `origin main` as the branch's upstream so a bare push resolves the same destination; the rejection means the remote holds commits that are not ancestors of what is being sent, so applying it would discard them.
- **B.** `-u` uploads the branch's tags along with its commits; the rejection means the developer lacks write permission on the remote.
- **C.** `-u` forces the push through even if the remote has diverged; the rejection cannot happen again on this branch afterward.
- **D.** `-u` is required only the very first time any repository pushes to that remote at all; the rejection here means the branch name collides with an existing one on the server that a different contributor already created earlier that day.

**Answer: A.** `git push -u origin main` both pushes and sets that upstream, letting a later bare `git push` know where to send it. Separately, the remote refuses any update where its current commit is not an ancestor of what is being sent, because applying it would discard commits the remote already has — the documented explanation is that a rejected push also happens in a repository nobody else pushes to, whenever a commit already sent is amended or rebased.

- B is wrong: Tags are never pushed by a plain push regardless of `-u` — they need `--tags`, `--follow-tags`, or being named directly — and a non-fast-forward rejection is usually not a permissions problem at all.
- C is wrong: That describes `--force`, a different flag with the opposite intent of `-u`; a later push can still be rejected as a non-fast-forward if the remote moves again.
- D is wrong: `-u` is about setting this branch's own upstream, unrelated to whether anyone else has pushed to the remote before; the rejection is about commit ancestry, not a name collision.

### 144.

A developer runs `git rebase main` on a feature branch. Afterward, the commits look identical in content to before. Are they the same commit objects Git had a moment ago?

- **A.** Yes — rebase only changes where the existing commit objects sit in history, leaving their hashes untouched the same way moving a branch pointer forward during a fast-forward merge does.
- **B.** Yes, because rebase and merge both preserve every original commit's hash by design.
- **C.** No. Each is replayed as a new commit with a new hash, even though the resulting content looks the same as if the work had started from the current `main` all along.
- **D.** No, because `git reset --hard` deleted the originals and nothing new was created to replace them

**Answer: C.** `git rebase` (here as `git rebase main`) lists the commits on the current branch that have no equivalent in `main`, checks out `main` with the equivalent of `git checkout --detach`, replays those commits one by one in a way the documentation likens to `git cherry-pick`, and then repoints the branch at the final replayed commit. The documentation's own diagram writes the results as `A'--B'--C'` rather than `A--B--C`. That rewriting property is the entire crux of why rebasing a branch other people have already pulled is discouraged: their repositories still hold the discarded originals.

- A is wrong: That describes what a rebase looks like from the outside, but the mechanism is replacement: the original commits are discarded and new ones with new hashes are manufactured in their place.
- B is wrong: Preserving original hashes is what merge does; rebase is defined by the opposite property — replacing commits with replayed ones — which is the whole reason it produces linear history.
- D is wrong: The current documentation describes a rebase as checking out the upstream detached and then replaying the saved commits one by one, similar to `git cherry-pick`, so replacements are created rather than nothing.

### 145.

A developer pushed `feature/retry` yesterday, and a colleague has already pulled it and started building on top. The developer now wants a cleaner, linear history before merging. Which choice is safe, and which is not?

- **A.** Rebasing is safe as long as the developer includes a clear commit message explaining the rewrite.
- **B.** Rebasing is safe because `git push` will simply merge the two histories back together automatically.
- **C.** Rebasing is unsafe here, because the colleague's clone still holds the original commits, and rewriting them would make the histories diverge even though the content is identical.
- **D.** Rebasing is unsafe only if the colleague has also committed new work on top of the original commits; a colleague who merely pulled without committing anything further is unaffected either way.

**Answer: C.** Rebase does not undo anything and does not resolve a conflict by itself; it changes where commits sit in history by replacing them, which is exactly what separates it from revert and reset. That replacement is why rebasing a branch other people have already pulled is discouraged: the colleague's repository still contains the discarded originals, so the two histories have diverged even with identical content.

- A is wrong: A message describes intent but does not change the mechanics: the colleague's repository still contains commits that no longer exist upstream, regardless of how the rewrite is explained.
- B is wrong: A plain push refuses this exact situation as a non-fast-forward rejection, because the remote holds commits that are no longer ancestors of the rewritten branch; nothing merges automatically.
- D is wrong: Divergence happens the moment the colleague's repository holds the pre-rebase commits at all; whether they have since added their own commits changes how painful reconciling is, not whether the histories diverged.

### 146.

A repository has a remote-tracking branch `origin/main` reporting that the local branch is four commits behind. Does that reading describe the remote server right now?

- **A.** No, because `origin/main` is a local, read-only record of where the remote's `main` stood at the last fetch, pull or push, so the server may have moved further since.
- **B.** Yes — `origin/main` is a live view of the server, updated automatically whenever the server changes.
- **C.** Yes, because `origin` always refers to the authoritative repository, which every collaborator's client is expected to keep synchronized with in real time as part of the workflow.
- **D.** It depends on whether the branch has an upstream configured with `git push -u`.

**Answer: A.** A remote is a short name bound to a URL, and `origin/main` is a remote-tracking branch: a local record of where the remote's branch stood the last time this repository communicated with it. Those records update on fetch, pull and push and nowhere else, so a report of being "behind" describes the last contact, not the server at this instant.

- B is wrong: There is no automatic update channel; `origin/main` only changes when this repository performs a fetch, pull or push, so it can be stale without anything being wrong.
- C is wrong: `origin` carries no special technical authority; it is simply the conventional name `git clone` assigns, and nothing keeps it synchronized without an explicit network operation.
- D is wrong: Setting an upstream affects where a bare `git push` or `git pull` goes; it does not change how or when the remote-tracking branch itself is refreshed.

### 147.

A repository has two remotes configured, `origin` and `upstream`, and a developer wants to see both names next to the URLs they push and fetch from. Which command shows that?

- **A.** `git branch -a`, since it lists both local and remote-tracking branches
- **B.** `git log --all --remotes`, since it walks history across every remote-tracking ref
- **C.** `git remote -v`, with `-v` placed after `origin` to scope it to that one remote
- **D.** `git remote -v`, with `-v` placed between `remote` and any subcommand

**Answer: D.** A remote is a short name bound to the URL of another copy of the repository, and `git remote -v` lists every configured remote with its fetch and push URLs. `origin` is not a keyword; it is simply the name `git clone` assigns to the repository it cloned from, and additional remotes such as `upstream` are added the same way any other one is.

- A is wrong: That lists branch names, including remote-tracking ones, but not the remote names and their configured URLs, which is a different piece of configuration.
- B is wrong: That shows commits reachable from remote-tracking refs, not the remote names and URLs behind those refs.
- C is wrong: The documentation is explicit that `-v` must sit between `remote` and any subcommand; it is a flag on `remote` itself and does not take a remote name as an argument this way.

### 148.

A new project directory exists with no version history yet, and no other copy of it exists anywhere to copy from. Which command starts tracking it under Git?

- **A.** `git clone` pointed at the directory itself, to bring it under version control
- **B.** `git add` on every file, since staging is what begins tracking a project
- **C.** `git init`, run inside the directory, to create an empty `.git` directory with no commits and no remote
- **D.** Creating a remote repository on a hosting platform first, then pulling it down locally with `git clone` once the platform has finished provisioning it

**Answer: C.** `git init` creates an empty repository — a `.git` directory with an object store and an initial branch carrying no commits — and configures no remote, which fits a directory with nothing to copy from. `git clone` is the other repository-creating command, but it requires an existing source and copies its history rather than starting fresh.

- A is wrong: Clone needs an existing source repository to copy history from and configures a remote for it; there is nothing here yet to clone.
- B is wrong: Adding stages the content of files already inside a repository; it does not create the `.git` directory that makes tracking possible in the first place.
- D is wrong: A remote is optional and unrelated to whether a local `.git` directory exists; a project can be a complete repository with no remote configured at all.

### 149.

A colleague copies a teammate's project folder over the network, but deliberately skips the hidden `.git` directory because it "just holds settings." What did the copy actually lose?

- **A.** Only the remote URL, since `git remote -v` reads its output from `.git/config`.
- **B.** Every commit, branch and tag, since the repository itself lives entirely inside `.git`, leaving only the checked-out files behind.
- **C.** Nothing important, since running `git clone` again later can regenerate `.git` from the working files as long as the directory structure is unchanged
- **D.** Only the `.gitignore` patterns, since those are the settings the colleague meant to skip

**Answer: B.** The `.git` directory is where every commit, branch ref and tag physically lives; the project files beside it are a checked-out view, not the history itself. Deleting or skipping `.git` leaves the files intact and destroys the repository, which is a different loss from losing files.

- A is wrong: The remote configuration is one small piece of what `.git` holds; the far larger loss is the entire commit history, which also lives there.
- C is wrong: `git clone` needs an existing source repository to copy from; the working files alone carry no history for it to reconstruct.
- D is wrong: `.gitignore` is an ordinary tracked file that lives in the working tree, not inside `.git`, so skipping `.git` does not affect it at all.

### 150.

A bad commit was pushed yesterday and two colleagues have already pulled it. The block comparing this concept to rebase makes the same point twice about shared branches — which undo command is safe here, and which Git operation shares its unsafe property?

- **A.** `git reset --hard` is safe, since it removes the bad commit outright rather than leaving a visible trace of the mistake for reviewers, auditors, or the release notes to ever find later on down the line.
- **B.** Both `git revert` and `git reset` are equally safe here, since both are described as ways to undo a commit.
- **C.** `git revert` is safe, as it adds a new commit undoing the old one and leaves the original in place; rebase shares reset's unsafe property of rewriting history that others have already pulled.
- **D.** `git revert` is safe, and merge shares the same unsafe rewriting property as reset on a shared branch.

**Answer: C.** `git revert <commit>` records a new commit applying the inverse of an existing one, leaving the original in place, so history grows and nothing is rewritten — safe on a branch others already have. `git reset` moves the branch pointer, and `git rebase` replays commits as new objects; both rewrite history, which is why rebasing or resetting a branch that colleagues have already pulled forces them to reconcile diverged histories.

- A is wrong: Removing the commit outright is exactly the problem: the next push is rejected as a non-fast-forward, and forcing it takes commits away from the colleagues who already pulled.
- B is wrong: They share a goal but not a mechanism: revert keeps the original commit and adds an inverse, while reset drops commits off the branch by rewriting where it points.
- D is wrong: Merge never rewrites existing commits, on a fast-forward or a diverged merge alike, which is exactly what makes merge safe on shared branches and rebase not.

### 151.

A developer has three local, unpushed commits they want to undo, and wants the changes to remain in the working tree as unstaged edits so they can be reworked. Which `git reset` mode fits, versus the other two?

- **A.** `--soft`, since it always leaves the fewest changes behind of the three modes
- **B.** `--mixed`, the default, which resets the index but leaves the working tree alone, so the undone changes remain as unstaged edits ready to rework.
- **C.** `--hard`, since it is the mode most commonly reached for when reworking a change
- **D.** `git revert` run three times in a row, once per commit, since it also leaves the working tree unstaged and requires the same manual staging step reset does.

**Answer: B.** Reset's three common modes differ only in how far the change propagates: `--soft` moves HEAD and leaves index and working tree alone, so changes remain staged; `--mixed`, the default, resets the index but not the working tree, leaving unstaged edits; `--hard` resets both together, discarding tracked changes since that commit with no commit left to recover them from.

- A is wrong: `--soft` moves HEAD and leaves both the index and working tree alone, so the undone changes stay staged rather than becoming unstaged edits.
- C is wrong: `--hard` resets the index and working tree together, discarding the tracked changes entirely — with no commit holding them, there is nothing left to rework.
- D is wrong: `git revert` commits its result by default rather than leaving anything unstaged, and it adds inverse commits instead of moving the branch pointer, which is a different operation from reset entirely.

### 152.

A developer has uncommitted edits and needs to switch branches to handle an urgent request, without committing half-finished work. They run `git stash`. Where does that work go, and does a colleague running `git log` on the shared remote see it?

- **A.** It becomes a regular commit on the current branch, so a colleague sees it the next time they pull.
- **B.** It is discarded permanently the moment `git stash` runs, freeing the working tree for the urgent branch switch with nothing left to restore afterward.
- **C.** It is written into `.gitignore` as an untracked change so it is skipped on the next commit
- **D.** It is set aside under `refs/stash`, belonging to no branch and never pushed to any remote, so a colleague running `git log` sees nothing of it.

**Answer: D.** `git stash` records the current working-tree and index changes, then reverts the working directory to match HEAD, so the developer can switch context with a clean tree and restore the work later with `git stash pop`. It sits in `refs/stash`, belongs to no branch, is never pushed to a remote, and is invisible to `git log`.

- A is wrong: A stash is deliberately not a commit on any branch; treating it as one is the exact mistake the concept warns about — "stash it so the team can see it" is always wrong.
- B is wrong: The point of stashing is to preserve the work, not discard it — it can be restored later with `git stash pop` once the urgent task is finished.
- C is wrong: `.gitignore` is a pattern file for untracked paths and has nothing to do with where stashed changes are stored.

### 153.

A team wants to mark the exact commit shipped as version 1.4.0, in a way that will not move even as new commits land on `main` afterward. Should they use a branch or a tag, and why?

- **A.** A tag, since committing advances a branch but leaves every tag exactly where it was, making a tag the fixed marker this needs.
- **B.** A branch, since only branches can be checked out later to inspect what shipped
- **C.** Either works identically, since both a branch and a tag are just names pointing at a commit
- **D.** A branch, because a `git stash` entry can be attached to it later to record the release notes once the team decides what belongs in that release.

**Answer: A.** A tag is a fixed label on one commit, conventionally used to mark a release; the defining contrast with a branch is that a tag does not move, while committing advances a branch and leaves every tag exactly where it was. `git tag -a v1.4.0 -m "Release 1.4.0"` creates an annotated tag, the form the documentation describes as meant for releases.

- B is wrong: A tag can be checked out too, into detached HEAD; the real reason to prefer a tag here is that it stays fixed, while a branch would keep moving as `main` gains commits.
- C is wrong: They are both names pointing at a commit, which is exactly what makes them interchangeable-looking, but only a tag is guaranteed not to move as new commits are made.
- D is wrong: A stash holds uncommitted working-tree changes and has nothing to do with recording release notes on a branch or tag.

### 154.

A team wants a release tag that records who tagged it, when, and a message — not just a bare reference to the commit. Which form of `git tag` produces that?

- **A.** A lightweight tag, created with plain `git tag <name>` and no other options
- **B.** A remote-tracking tag, since only tags fetched from a remote carry tagger metadata
- **C.** Any tag pushed with `--follow-tags`, since pushing is what attaches tagger metadata to it retroactively, even to a tag that was originally created as lightweight and carried none.
- **D.** An annotated tag, created with `-a` (or implied by supplying `-m` alone), which is a real object in the database carrying the tagger's name, email, date and message.

**Answer: D.** `git tag <name>` creates a lightweight tag, a bare reference with no metadata; `git tag -a <name> -m "<message>"` creates an annotated tag, a real database object carrying the tagger's name and email, a creation date, a message and optionally a signature — and per the documentation, supplying `-m` without `-a`, `-s` or `-u` implies `-a`.

- A is wrong: A lightweight tag is a bare reference to an object with no metadata of its own; the documentation describes it as meant for private or temporary labels, not releases needing a recorded tagger and message.
- B is wrong: There is no separate "remote-tracking tag" category with different metadata rules; whether a tag carries a tagger, date and message is decided by lightweight versus annotated, not by its origin.
- C is wrong: `--follow-tags` only controls whether a push also sends annotated tags reachable from what is being pushed; it does not create or add metadata to a tag that lacks it.

### 155.

A five-person team keeps its infrastructure-as-code in Git and separately runs a nightly `tar` archive of the same server to an offsite host. Someone asks why both exist, since Git already keeps every version of the code. What is the accurate answer?

- **A.** Git already backs up the whole server, so the nightly archive is redundant and can be dropped once everyone trusts the repository and code review to catch mistakes before they ever reach production.
- **B.** Switching the team to a centralized system like Subversion would let one server hold both roles at once.
- **C.** Routing server changes through a change-management approval step would make the archive unnecessary.
- **D.** Git records author-initiated snapshots of files someone is actively editing; the nightly archive is a scheduled, independent copy meant to let the whole server be restored after loss.

**Answer: D.** Version control, backup and change management all produce evidence of "what changed," which is why a scenario can present all three as plausible. Version control recovers author-chosen revisions of actively edited files; backup, taken here with a scheduled `tar` archive, recovers from loss of the whole system; change management records approvals, not file contents.

- A is wrong: Git only records what someone deliberately committed, not the rest of the disk, and it carries no RPO/RTO guarantee for a lost machine.
- B is wrong: Centralized versus distributed is an architecture choice orthogonal to this gap; neither kind of version control system is a scheduled disaster-recovery backup.
- C is wrong: Change management governs who approved a production change, not how to recover files after a disk is lost.

### 156.

A configuration file was edited incorrectly three days ago and nobody noticed until today. The team wants to recover exactly what that one file looked like on the day before the mistake. What kind of system provides that?

- **A.** Version control, which retains prior revisions of files under active change, each attributable to an author and a timestamp.
- **B.** An independent backup taken on a schedule, since it is measured in RPO and RTO rather than per-file revisions and restores the whole system to one point in time, not a single document.
- **C.** A RAID array on the server, since it protects the data the file is stored on.
- **D.** A change-management ticket describing who approved the edit.

**Answer: A.** Version control exists precisely to let any earlier state of a tracked file be recovered, with the author and reason attached. Git is one implementation of this practice; recovering one file's content as of a given day is a version-control operation, not a backup restore or a RAID rebuild.

- B is wrong: A scheduled backup restores a point-in-time copy of a system; it exists to survive loss, not to hand back one prior revision of one file among many still-current ones.
- C is wrong: RAID survives the loss of a disk; it has no concept of an earlier revision and would have faithfully written the mistaken edit too.
- D is wrong: A ticket records that an approval happened; it does not itself hold the file's earlier content.

### 157.

A developer edits `config.yml`, runs `git add config.yml`, then edits `config.yml` again before running `git status`. Under which heading does `git status` list the file, and why?

- **A.** Only "Changes to be committed", since staging a file keeps tracking every edit made to it afterward
- **B.** Only "Untracked files", since the second edit effectively resets the file's tracking state
- **C.** Under both "Changes to be committed" and "Changes not staged for commit", listing the staged content from the first edit and the later edit as unstaged.
- **D.** Neither heading, because `git status` only reports differences since the last commit, not since the last `add`, so a re-edited staged file would be invisible to it entirely

**Answer: C.** `git status` reports the working tree, the staging area and the repository in plain words: "Changes to be committed" is the index, "Changes not staged for commit" is the working tree, and "Untracked files" are paths Git has never seen. `git add` copies a file's content as it is at that instant, which is why editing again afterward leaves that file listed under both of the first two headings at once.

- A is wrong: `git add` snapshots content at that instant rather than registering the file for continuous tracking, so later edits are not automatically folded in.
- B is wrong: Untracked means Git has never been told about the path at all; this file was already staged once, so it cannot fall back to untracked by being edited again.
- D is wrong: `git status` compares all three states against each other — working tree, index and HEAD — so a staged-then-re-edited file shows up under both headings at once.

### 158.

A developer edits two tracked files and creates one brand-new file, then runs `git commit -a -m "Update config"`. Which files end up in the new commit?

- **A.** All three files, since `-a` is defined to stage every change in the working directory, tracked or not, before the commit is created
- **B.** Only the two edited tracked files, because `-a` auto-stages modifications and deletions of files Git already tracks and never adds a new untracked file.
- **C.** None of them, because `git commit -a` requires a prior `git add` for every file named in the commit, including files that were never tracked before this session began.
- **D.** Just the new file, since `-a` is meant to catch anything not yet under version control

**Answer: B.** `git commit -a` auto-stages modifications and deletions of already-tracked files as part of committing, but it never adds a file Git has never seen — that still needs an explicit `git add`. A commit records exactly what the index holds at the moment `git commit` runs, nothing else.

- A is wrong: This is the exact trap `-a` sets: it auto-stages tracked-file changes only, so a genuinely new file needs `git add` before it is ever committed.
- C is wrong: That is backwards: `-a` exists specifically to skip `git add` for files Git already tracks, and it does stage and commit their changes.
- D is wrong: `-a` has the opposite scope: it only ever touches paths Git already tracks, and a new file is by definition not one of those.

