# Containers

Containers is the technical core of the DevOps Fundamentals domain, which is worth 12% of the
exam and is the 5th largest of 6 domains under the current (2025-09-16) blueprint; the
competency was unchanged by the 2025 update. Course support is thin: of its 24 concepts, 1 is
FULLY COVERED and 23 are NOT COVERED — 1/24 (4%) that LFS200 touches at all. The course's
Containers lesson stays at the level of what an isolated process is and never reaches Docker,
images, registries, or orchestration (`research/lfs200-notes/00-course-map.md`), so everything
from the container image onward is sourced independently below and written to a fuller
treatment than its 1/24 LFS200 coverage would suggest. The chain
this file has to make mechanical, because a question can enter it at any link, is: Dockerfile →
image (layers, tag) → registry → runtime on a node → pod → Deployment → Service.

<a id="s-containers-fundamentals"></a>
## Fundamentals

<a id="c-devops.containers.container"></a>
### Container
*id: `devops.containers.container` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: docker-overview, cncf-glossary-container*

**What it is** A container is a process — sometimes a small group of processes — running on the
host's own kernel with its view of the system deliberately narrowed, packaged together with the
dependencies it needs so it behaves the same wherever it is started. It is not a small virtual
machine: nothing boots, there is no guest kernel, no firmware, and no init sequence. It is also
not the image it came from, and not a Kubernetes pod.

**Why it matters** Nearly every wrong answer in this competency traces to treating a container
as a lightweight VM. The shared kernel is what makes containers start in milliseconds and pack
densely; it is equally what stops a container from running a different OS family than its host
and what makes its isolation boundary weaker than a hypervisor's. Every performance,
portability, and security claim about containers follows from that one architectural fact.

**How it works** The runtime assembles the image's read-only layers into a root filesystem,
creates kernel namespaces so the process sees only its own process tree, network stack, mount
table and hostname, applies cgroup limits so it can consume only its share of CPU and memory,
and then executes the image's configured command as PID 1 inside that view. The container
exists exactly as long as that PID 1 process runs: when the process exits, the container stops.
That is why a container whose main process is a one-shot command "dies immediately" — it did
what it was told and finished.

**Key terms** namespace; cgroup; PID 1; shared host kernel; ephemeral.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker run` | Create a new container from an image and start it | `-d` detached, `--rm` delete on exit, `--name` assign a name | `docker run -d --name web nginx` | Expecting it to restart an existing container — `docker run` always creates a new one; `docker start` resumes an existing one |
| `docker ps` | List containers | `-a` include stopped ones, `-q` IDs only | `docker ps -a` | Reading bare `docker ps` as "everything that exists" — by default it shows only running containers, so a container that crashed on startup is invisible until `-a` |

**Traps** A container is an instance, an image is the template — "one image, many containers" is
the phrasing the exam rewards. A container is also not a pod: pods are a Kubernetes concept,
absent from Docker, and a pod may hold several containers. And a container that "exited immediately" is usually not
broken isolation but a main process that terminated, which `docker logs` will show and
`docker ps -a` will confirm.

**What the exam may test** Assigning a described property — millisecond start, shared kernel,
cannot run a different OS family, weaker isolation than a VM, no boot sequence — to a container
rather than a virtual machine, and distinguishing the running instance from the image and from
the Kubernetes pod that may wrap it.

*Not to be confused with [virtual machine](../03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.virtual-machine).*
*Not to be confused with [virtualization](../03-cloud-computing/cloud-computing.md#cmp-cloud.cloud-computing.virtualization).*

<a id="cmp-devops.containers.container"></a>
#### Not to be confused with: Container vs Container image vs Pod
*compares: `devops.containers.container`, `devops.containers.container-image`, `devops.containers.pod`*

| | Container | Container image | Pod |
| --- | --- | --- | --- |
| What it is | One running or stopped instance | The immutable read-only template it was created from | Kubernetes' scheduling unit, wrapping one or more containers |
| Cardinality | Many containers from one image | One image serves any number of containers | One pod holds one container in the common case, several when tightly coupled |
| Where the idea exists | Any runtime — Docker, containerd, CRI-O | A local image store or a registry | Kubernetes, and Kubernetes-compatible tools such as Podman; Docker has no pods |
| Writable state | Yes — a writable layer that dies with the container | No — read-only, shared by every container using it | Its containers have their own; the pod adds a shared network namespace and shared volumes |
| Brought into being by | `docker run` | `docker build`, or a pull from a registry | Created through the Kubernetes API from a pod spec — normally by a workload controller such as a Deployment; the scheduler then assigns it to a node |

The separating axis is template, instance, wrapper: the image is the template, the container is
one running instance of it, and the pod is Kubernetes' wrapper around one or more of those
instances plus the network and storage they share.

<a id="c-devops.containers.container-image"></a>
### Container image
*id: `devops.containers.container-image` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: docker-overview, oci-image-spec-config, docker-image-layers*

**What it is** The immutable, read-only template a container is created from: a stack of
filesystem layers plus a configuration object recording the default command, environment
variables, declared ports, working directory, and user. One image, many containers. Building an
image never runs the application; running a container never modifies the image.

**Why it matters** The image/container split is the class/instance distinction of this whole
domain, and it decides where a fix belongs. A wrong dependency baked into the filesystem is an
image problem — rebuild, retag, repush, redeploy. A wrong port or environment value is a
container problem — recreate the container with different run-time flags. Answering one with the
other is the discrimination the exam is looking for.

**How it works** An OCI image is a manifest listing the image's contents, a configuration blob
holding the run-time defaults, and one or more compressed layer archives. When a container
starts, those layers are stacked read-only and a thin writable layer is added on top for that
container alone; the writable layer is discarded when the container is removed, which is why
image size and container disk usage are different numbers. Images are identified precisely by a
content digest and referred to conveniently by tag.

**Key terms** immutable; manifest; image config; writable layer; digest.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker images` | List images in the local image store | `-a` include intermediate images, `-q` IDs only | `docker images` | Confusing it with `docker ps` — one lists templates on disk, the other lists instances |
| `docker build` | Build an image from a Dockerfile and a build context | `-t` name and tag, `-f` alternate Dockerfile, `--no-cache` ignore the cache | `docker build .` | Assuming the build runs the application — it executes build instructions only; the image's command runs later, at `docker run` |

**Traps** Removing containers does not reclaim image space: `docker rm` removes a container,
`docker rmi` removes an image, and an image with no containers still occupies disk. An image is
also not a Dockerfile — the Dockerfile is the recipe, the image is the artifact — and it is not
a registry, which is merely where images are stored.

**What the exam may test** Given a described change (new library version, new port, new
environment value, new application code), deciding whether it requires rebuilding the image or
only recreating the container, and picking the command that lists images rather than containers.

*Not to be confused with [container](containers.md#cmp-devops.containers.container).*

<a id="cmp-devops.containers.container-image"></a>
#### Not to be confused with: Container image vs Dockerfile vs Registry
*compares: `devops.containers.container-image`, `devops.containers.dockerfile`, `devops.containers.registry`*

| | Container image | Dockerfile | Registry |
| --- | --- | --- | --- |
| What it is | The built artifact | The text recipe for building it | The server that stores and distributes built artifacts |
| Lives where | The local image store, or inside a registry | In source control, next to the application code | Remote (Docker Hub, GHCR, a cloud registry) or self-hosted |
| Acted on by | Produced by `docker build`, consumed by `docker run` | Read by `docker build` | Written by `docker push`, read by `docker pull` |
| Mutable | No — content-addressed and immutable | Yes — an ordinary source file | Its contents are immutable, but a tag inside it can be repointed |
| Exists without the others | Yes — an image can be pulled with no Dockerfile in sight | Yes — a recipe never built is still a Dockerfile | Yes — an empty registry is still a registry |

The separating axis is recipe, artifact, distribution: the Dockerfile is the recipe, the image
is the artifact built from it, and the registry is the warehouse the artifact is shipped through.

<a id="c-devops.containers.image-layers"></a>
### Image layers
*id: `devops.containers.image-layers` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: docker-image-layers, oci-image-spec-config*

**What it is** An image is a stack of read-only layers, each one a set of filesystem changes —
additions, deletions, modifications — relative to the layer beneath it. Layers are what make
images cheap to rebuild and cheap to distribute, because identical layers are reused rather than
duplicated. Not every Dockerfile instruction produces one: `RUN`, `COPY` and `ADD` add filesystem
layers, while `ENV`, `LABEL`, `EXPOSE` and `CMD` record configuration metadata and add nothing to
the filesystem. `WORKDIR` is the instruction that looks like pure metadata and is not — it creates
its directory when that directory is missing, which is a filesystem change like any other.

**Why it matters** Layer caching explains build behaviour a candidate is expected to predict.
Instructions execute in order, and a change invalidates the cache for its own layer and every
layer after it — so a Dockerfile that copies the whole source tree before installing
dependencies reinstalls the dependencies on every single code change, while one that copies the
dependency manifest first, installs, and only then copies the source rebuilds in seconds. The
same sharing works on the wire: pulling an image downloads only the layers the host does not
already have.

**How it works** Layers are content-addressable, so identical content is identified by identical
digest and stored once. Each downloaded layer is extracted into its own directory on the host;
at container start a union filesystem stacks those directories into one unified view, plus a
directory specific to that container so it can write without touching the shared layers. That
also means deletion is not erasure — a file added in one layer and removed in a later one is
still present in the earlier layer, which is why a secret copied into an image cannot be
un-copied by deleting it afterwards.

**Key terms** union filesystem; build cache; content-addressable; cache invalidation.

<a id="c-devops.containers.registry"></a>
### Registry
*id: `devops.containers.registry` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: docker-overview*

**What it is** A server that stores and distributes images. Docker Hub is the best known public
one and the default the Docker CLI assumes when no registry host is given; GitHub Container
Registry, Quay, and the cloud providers' own registries are common alternatives, and a registry
can be run privately inside an organisation.

**Why it matters** The registry is the hand-off point between building and running: the build
host produces an image, the registry holds it, and every node that will run it pulls from there.
An exam scenario in which "the image works on my laptop but the cluster cannot start it" is
usually a registry question — the image was never pushed, the node cannot authenticate, or the
reference names a registry the node cannot reach.

**How it works** A full image reference is `registry/repository:tag`, for example
`registry.example.com/team/api:1.4.2`, where the registry host is `registry.example.com`, the
repository is `team/api` and the tag is `1.4.2`. The repository name is the whole path after the
host, not just its last segment: the OCI Distribution Specification allows it to carry
slash-separated components, so the leading segment reads as a namespace — `team` owning `team/api`
on a private registry, `library` owning `library/nginx` on Docker Hub. Omit the registry host and
the Docker CLI substitutes Docker Hub, which is why the bare name `ubuntu` resolves to Docker
Hub's official `ubuntu` repository. A registry holds repositories; a repository holds many tagged
images of one application. Pushing to a private registry requires the image to be tagged with that registry's
host name first, and requires authentication; pulling from a public repository generally does
not.

**Key terms** repository; namespace; image reference; authentication.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker pull` | Download an image from a registry into the local store | `-a` all tags in the repository | `docker pull nginx:1.27` | Thinking a pull is always needed — `docker run` pulls implicitly when the image is not present locally |
| `docker push` | Upload a local image to a registry | (the destination comes from the image's own name) | `docker push registry.example.com/team/api:1.4.2` | Pushing an image tagged only `api:1.4.2` — with no registry host in the name the push targets Docker Hub, not the private registry |

**Traps** A registry is not a repository: the registry is the server, the repository is one named
collection of tags inside it. A registry is also not the image store on your own machine —
`docker images` lists what is local, and an image can be local without ever having been pushed
anywhere.

**What the exam may test** Reading an image reference and naming which part is the registry,
which is the repository, and which is the tag; and choosing push versus pull for a described
direction of travel.

*Not to be confused with [container image](containers.md#cmp-devops.containers.container-image).*

<a id="c-devops.containers.image-tags"></a>
### Image tags
*id: `devops.containers.image-tags` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: docker-overview, dockerfile-reference*

**What it is** Human-readable labels attached to images inside a repository — `1.4.2`, `stable`,
`latest`. The crucial property is that a tag is a mutable pointer to an immutable image: the
image a tag names today can be replaced tomorrow by pushing something else under the same tag.

**Why it matters** `latest` is the most-cited mistake in container practice, and it is a
misreading of the name. `latest` is nothing more than the tag a reference falls back to when it
names a repository but no tag; it is not computed by comparing version numbers, and there is no
rule that it points at the newest build. Deploying `:latest` therefore means two nodes that pull
at different moments can legitimately run different code, a rollback has no earlier tag to
return to, and "which version is in production" has no answer.

**How it works** Building with `docker build -t api:1.4.2 .` writes the tag into the local
store. `latest` is supplied only where a reference names a repository but no tag — `docker build
-t api .` produces `api:latest`, and `docker pull nginx` fetches `nginx:latest`. A build given no
name at all is a different case entirely: `docker build .` produces an untagged image that
`docker images` lists as `<none>`, not one tagged `latest`. Because tags move, the reproducible way to pin an
image is its content digest — `api@sha256:...` — which names exact bytes and cannot be
repointed. Production deployments pin an explicit version tag at minimum, and a digest when
reproducibility must be guaranteed.

**Key terms** mutable pointer; `latest`; digest pinning; reproducibility.

#### Scenario

An engineer runs `docker run -d --name api registry.example.com/team/api` on a fresh host and
the container starts. Trace what happened and what did not. No tag was given, so the reference
resolved to the `latest` tag — not "the newest build", just the default label — and the image
was not present locally, so the runtime pulled it from `registry.example.com`, fetching only
the layers the host lacked and reusing any shared with images already there. The image is the
template; the running process is one container created from it, with a writable layer of its
own. A colleague asks why redeploying the same command a week later produced different
behaviour: because the tag was repointed by a newer push, while the image it originally named
never changed. The fix is to reference `team/api:1.4.2` or a digest, not to rebuild anything.

#### Knowledge check

1. What is the one-sentence difference between a container and a container image?
   The image is the immutable read-only template; the container is one running instance created
   from it, with its own writable layer.
2. `docker ps` shows nothing, but a container was definitely started a minute ago. What
   happened, and which flag reveals it?
   Its main process exited, so the container is stopped; `docker ps -a` lists stopped containers
   as well as running ones.
3. Which Dockerfile instructions create a filesystem layer, and what do the others do?
   `RUN`, `COPY` and `ADD` add filesystem content and create layers; `ENV`, `LABEL`, `EXPOSE` and
   `CMD` record configuration metadata only. `WORKDIR` is the edge case: it sets metadata but
   creates its directory when that directory is missing, so it can create a layer as well.
4. Does the tag `latest` mean the newest image in a repository?
   No — it is only the tag a reference falls back to when it names a repository but no tag, and it
   is a mutable pointer that can name any image at all.
5. In the reference `registry.example.com/team/api:1.4.2`, name the registry, the repository and
   the tag.
   Registry `registry.example.com`; repository `team/api`; tag `1.4.2`.
6. Deleting every container built from an image did not free the disk space the image occupies.
   Why?
   Containers and images are separate objects: `docker rm` removes containers and their writable
   layers, while the image itself persists until `docker rmi` removes it.

<a id="s-containers-building"></a>
## Building

<a id="c-devops.containers.dockerfile"></a>
### Dockerfile
*id: `devops.containers.dockerfile` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: dockerfile-reference, docker-build-best-practices, oci-image-spec-config*

**What it is** The declarative recipe for building an image: a text file of instructions executed
in order against a build context. `FROM` selects the base image, `RUN` executes a command during
the build, `COPY` and `ADD` bring files in, and `ENV`, `LABEL`, `WORKDIR`, `EXPOSE`, `USER`,
`ARG`, `CMD` and `ENTRYPOINT` set build-time or image configuration. `RUN`, `COPY` and `ADD` are
the instructions that add filesystem layers; `ENV`, `LABEL`, `EXPOSE`, `USER`, `ARG`, `CMD` and
`ENTRYPOINT` only write metadata into the image configuration, and `WORKDIR` writes metadata but
also creates its directory when that directory is missing, so it too can add a layer.

**Why it matters** This is where the exam asks its most literal questions, and each of them has a
plausible-sounding wrong answer: `EXPOSE` sounds like it opens a port and does not, `CMD` sounds
like it runs during the build and does not, `ADD` sounds like a better `COPY` and is not
recommended as one. Knowing which instruction acts at build time and which merely records intent
for run time is the discrimination being tested.

**How it works** The build sends the context directory to the builder, then executes each
instruction in sequence, caching the result of each. `EXPOSE` records which port the application
listens on as documentation between the image's author and its user — publishing still requires
`-p` (or `-P`, which publishes every `EXPOSE`d port to ephemeral high-numbered host ports) at
run time. `ENTRYPOINT` sets the executable and `CMD` supplies its default arguments; with no
`ENTRYPOINT`, `CMD` is the whole default command, and arguments given after the image name on
`docker run` replace `CMD`. `ADD` can additionally fetch remote URLs and auto-extract local tar
archives, which is precisely why `COPY` is preferred when plain copying is all that is wanted:
`COPY` cannot surprise you.

**Key terms** build context; base image; `.dockerignore`; `CMD` versus `ENTRYPOINT`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker build -t` | Build an image from a Dockerfile and give it a name and tag | `-t name:tag`, `-f` path to an alternate Dockerfile, `--no-cache` rebuild every layer, `--pull` refresh the base image | `docker build -t api:1.4.2 .` | Reading the trailing `.` as "the Dockerfile" — it is the build context directory; the Dockerfile is found inside it by default and named explicitly with `-f` |

**Traps** `EXPOSE` publishes nothing. Not every instruction creates a layer — `ENV`, `LABEL`,
`EXPOSE` and `CMD` write metadata only, while `RUN`, `COPY` and `ADD` write filesystem content
(and `WORKDIR` creates its directory, so it can add one too). A secret supplied through `ARG` or
set with `ENV` is baked into the image and can be recovered from it, and a later instruction that
unsets the variable does not remove it from the layer where it was written. And the Dockerfile is not the image: editing the file changes
nothing until a build runs.

**What the exam may test** Naming what a given instruction does and does not do — especially
`EXPOSE` versus `-p`, `CMD` versus `ENTRYPOINT`, and `ADD` versus `COPY` — and identifying which
instructions in a shown Dockerfile added layers.

*Not to be confused with [container image](containers.md#cmp-devops.containers.container-image).*

#### Scenario

A build that used to take fifteen seconds now takes four minutes on every code change. The
Dockerfile copies the entire source tree in one `COPY` and then runs the dependency install with
`RUN`. Because instructions execute in order and a changed layer invalidates every layer after
it, editing any source file invalidates the `COPY` layer and forces the `RUN` install to execute
again. Reordering — copy the dependency manifest, run the install, then copy the source —
restores the cache for the expensive step. While reviewing, the same engineer notices `EXPOSE
8080` and assumes the port is reachable; it is not, because `EXPOSE` only documents intent and
`-p` at run time is what publishes it. They also spot an API token passed through `ARG`: it is
already in the image's layers, so removing the line and rebuilding a new image is the only fix,
not deleting the file in a later instruction.

#### Knowledge check

1. What does `EXPOSE` actually do, and what publishes a port?
   `EXPOSE` records which port the application listens on, as documentation only; `-p` at run
   time (or `-P` for all exposed ports) publishes it on the host.
2. A Dockerfile has `ENTRYPOINT ["python", "app.py"]` and `CMD ["--debug"]`. What runs, and what
   happens if the user appends an argument to `docker run`?
   `python app.py --debug` runs; an argument supplied after the image name replaces `CMD`, so
   `ENTRYPOINT` still runs but with the new argument instead of `--debug`.
3. Why is `COPY` preferred over `ADD` for plain file copying?
   `ADD` also fetches remote URLs and auto-extracts local tar archives, so it can do more than
   intended; `COPY` does exactly one thing.
4. An engineer removes a leaked credential file with a later `RUN rm` and rebuilds. Is the
   credential gone from the image?
   No — the earlier layer that added it still contains it; layers record changes and nothing
   erases history. The file must never enter a layer in the first place.
5. What is the trailing `.` in `docker build -t api:1.4.2 .`?
   The build context directory sent to the builder, not the Dockerfile.

<a id="s-containers-running"></a>
## Running

<a id="c-devops.containers.container-lifecycle"></a>
### Container lifecycle
*id: `devops.containers.container-lifecycle` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: docker-container-ls*

**What it is** The states a container moves through: created, running, paused, stopped (exited),
and removed. The distinction that carries exam weight is that stopping is not removing — a
stopped container still exists, still holds its writable layer, its configuration and its logs,
and still consumes disk.

**Why it matters** "The container is gone" and "the container is stopped" demand different
commands and have different consequences. A stopped container can be restarted with its state
and its original flags intact; a removed one cannot be restarted at all, and everything written
inside it that was not on a volume is gone. Disks filling up on a container host are very often
an accumulation of stopped containers and unused images, not application data.

**How it works** `docker run` creates and starts in a single step. `docker stop` asks the main
process to terminate with SIGTERM and, if it is still running after a grace period, kills it —
so a well-behaved application gets a chance to shut down cleanly. A stopped container keeps its
identity and its writable layer until `docker rm` deletes it. `docker start` resumes an existing
stopped container using the configuration it was created with: run-time flags such as `-p` and
`-e` are fixed at creation, so changing a published port or an environment variable means
creating a new container, not restarting the old one.

**Key terms** exited state; SIGTERM then SIGKILL; writable layer; restart policy.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker start` | Start one or more stopped containers | `-a` attach output, `-i` attach stdin | `docker start web` | Expecting it to accept the configuration flags `docker run` takes — it has no `-p` and no `-e`; port and environment settings are fixed when the container is created |
| `docker stop` | Stop a running container gracefully | `-t` seconds to wait before killing | `docker stop web` | Assuming it deletes the container — it leaves a stopped container behind, visible with `docker ps -a` |
| `docker rm` | Remove one or more stopped containers | `-f` force-remove a running container, `-v` also remove anonymous volumes | `docker rm web` | Confusing it with `docker rmi`, which removes images; removing a container reclaims only its writable layer |

**Traps** `docker rm` and `docker rmi` are different objects, and neither reclaims the other's
space. A container removed with plain `docker rm` leaves named volumes intact, which is
intentional but surprises people looking for reclaimed disk. And restarting a container never
picks up a new image: a rebuilt image is only used by a container created after the rebuild.

**What the exam may test** Choosing between stop, start and remove for a described outcome, and
recognising that a configuration change to a running container requires recreating it.

<a id="c-devops.containers.port-mapping"></a>
### Port mapping
*id: `devops.containers.port-mapping` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: dockerfile-reference, docker-overview*

**What it is** Publishing a port the container listens on so that traffic arriving at the host
reaches the containerised service. The syntax is `-p hostPort:containerPort` — host side first —
and without it the service is unreachable from outside the container's network, no matter what
the Dockerfile said.

**Why it matters** "The container is running but nothing answers on the port" is one of the most
common troubleshooting scenarios in the whole domain, and it has exactly three usual causes: no
port was published, the mapping was written backwards, or the application inside the container
bound to `127.0.0.1` instead of all interfaces, so it is unreachable even through a correct
mapping.

**How it works** `-p 8080:80` accepts traffic on host port 8080 and forwards it to port 80 inside
the container, binding all host interfaces by default; `-p 127.0.0.1:8080:80` restricts the host
side to loopback. `-P` publishes every port the image declares with `EXPOSE`, each to an
ephemeral high-numbered host port chosen for you. `EXPOSE` in the Dockerfile publishes nothing on
its own. Containers attached to the same user-defined Docker network reach each other directly
by container name on any port, with no publishing at all — publishing is only about reaching in
from the host and beyond.

**Key terms** publish; host port versus container port; `EXPOSE`; bind address.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker run -p` | Publish a container port on the host | `-p host:container`, `-p ip:host:container` to bind one interface, `-P` publish all `EXPOSE`d ports | `docker run -p 8080:80 nginx` | Reversing the pair — the host port is written first, so `-p 80:8080` sends host port 80 to container port 8080, which is usually not what was meant |

**Traps** The container port never changes because you published it differently: `-p 8080:80`
does not make the application inside listen on 8080. Publishing also cannot help if the process
inside is bound to loopback, since the container's loopback is its own.

**What the exam may test** Reading a `-p` mapping and stating which side is the host, and
diagnosing an unreachable service as a missing publish, a reversed mapping, or a loopback bind
rather than an application fault.

<a id="c-devops.containers.volumes-and-bind-mounts"></a>
### Volumes and bind mounts
*id: `devops.containers.volumes-and-bind-mounts` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: docker-volumes*

**What it is** The two ways to keep data outside a container's writable layer. A volume is
persistent storage created and managed by Docker in a directory on the host that Docker owns; a
bind mount maps an arbitrary existing host path into the container. Anything written anywhere
else lives in the writable layer and is destroyed with the container.

**Why it matters** Assuming that data written inside a container persists is the single most
common beginner error in this competency, and the exam states it as a scenario: a database
container is removed and recreated, and the data is gone. It was never persisted, because a
container's writable layer exists only for the lifetime of that container. Note the precise
boundary — stopping a container does not lose the writable layer; removing it does.

**How it works** In `-v source:/path/in/container`, a source written as a path — absolute, or
relative starting with `./` or `../`, which Docker Engine has accepted since version 23 — is a
bind mount of that host directory, while a plain name is a named volume, created on demand if it
does not exist. Volumes are managed by Docker, independent of the host's directory layout, easier
to back up and migrate, and can be shared between containers; bind mounts depend on the host's
own directory structure and OS, which is what makes them ideal for
mounting source code into a development container and poor for production data. A volume's
contents outlive every container that uses it: `docker rm` leaves named volumes alone, so
persistent data survives a container being deleted and recreated.

**Key terms** named volume; bind mount; writable layer; persistence.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker volume` | Manage volumes | subcommands `create`, `ls`, `inspect`, `rm`, `prune` | `docker volume ls` | Expecting removing containers to remove their volumes — named volumes persist until removed explicitly, so unused volumes quietly accumulate |
| `docker run -v` | Mount a volume or a host directory into a container | `-v name:/path` named volume, `-v /host/path:/path` bind mount | `docker run -v pgdata:/var/lib/postgresql postgres:18` | Writing a bare name where a host path was intended (or the reverse) — whether the source reads as a path or as a plain name is what decides which of the two you get; and mounting a path the image does not actually store its data under, which silently persists nothing |

**Traps** A volume is not a bind mount, and the exam distinguishes them by who manages the
storage, not by what the container sees — inside the container both are just a directory.
Neither one protects data written to some *other* path in the container: only the mounted path
is persistent.

**What the exam may test** Deciding whether described data survives `docker stop`, `docker rm`,
or neither; and choosing a volume versus a bind mount from a requirement such as "the host must
be able to edit these files directly" (bind mount) or "Docker should manage and back this up"
(volume).

<a id="c-devops.containers.environment-variables-in-containers"></a>
### Environment variables in containers
*id: `devops.containers.environment-variables-in-containers` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: dockerfile-reference, docker-overview*

**What it is** The standard way to configure an image at run time without rebuilding it: `-e
KEY=value` on the run command (or a file of them with `--env-file`), overriding any default the
image baked in with `ENV`.

**Why it matters** It is what makes one image deployable to development, staging and production
unchanged. If changing a database URL requires a rebuild, the configuration is in the wrong
place — and an exam scenario describing "the same image running with different settings in each
environment" is describing exactly this mechanism, not three images.

**How it works** `ENV` in a Dockerfile writes a default into the image's configuration, which
every container from that image inherits; `-e` at run time sets or overrides a value for that
one container. The run-time values are recorded in the container's configuration, and because
they are fixed at creation, changing one means creating a new container rather than restarting
the existing one. Neither mechanism is a secret store: an `ENV` value is part of the image and
can be read out of it by anyone who can pull the image, and a `-e` value is readable from the
container's configuration on the host. Real secrets belong in a secret manager, a Kubernetes
Secret, or a build-time secret that never lands in a layer.

**Key terms** `ENV` default; run-time override; `--env-file`; secret handling.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker run -e` | Set an environment variable inside the new container | `-e KEY=value`, `-e KEY` to pass through the host's value, `--env-file` to read many from a file | `docker run -e LOG_LEVEL=debug api:1.4.2` | Expecting the change to reach an existing container — environment is fixed at creation, so `docker start` cannot apply a new value |

**Traps** An `ENV` in the Dockerfile is a default, not a lock: `-e` wins. And putting a
credential in `ENV` to "keep it out of the code" moves it into the image, where it is more
widely readable, not less.

**What the exam may test** Recognising environment variables as the run-time configuration
mechanism that avoids a rebuild, and knowing that applying a new value requires a new container.

<a id="c-devops.containers.container-logs-and-exec"></a>
### Container logs and exec
*id: `devops.containers.container-logs-and-exec` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: docker-overview*

**What it is** The first two diagnostic steps for a misbehaving container. `docker logs` prints
what the container's main process wrote to standard output and standard error; `docker exec -it`
starts an additional process — usually a shell — inside a container that is already running.

**Why it matters** Containers deliberately have no syslog, no journal and often no editor, so the
convention is that applications log to stdout and stderr and the platform captures the stream.
An application configured to write a log file inside the container defeats this twice over: the
file is invisible to `docker logs`, and it disappears when the container is removed. Diagnostic
order matters too — logs work on a container that has already exited, and exec does not.

**How it works** The runtime captures the main process's stdout and stderr through a logging
driver, and `docker logs` replays that captured stream, with `-f` to follow it live and `--tail`
to show only the end. Docker Engine keeps a local cache of that stream, called dual logging, so
`docker logs` still works even when the configured driver ships the logs elsewhere, as `syslog`
and `splunk` do; where that cache is explicitly disabled the command returns an error rather
than empty output, and under the `none` driver nothing is captured to read at all. Under a
remote driver the logs are not lost, they are simply somewhere else. `docker exec -it` runs a
new command in a running container with stdin kept open (`-i`) and a terminal
allocated (`-t`); it requires both that the container is running and that the image actually
contains the shell being asked for, which minimal images often do not.

**Key terms** stdout/stderr convention; logging driver; interactive TTY; exited container.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker logs` | Show the container's captured stdout and stderr | `-f` follow, `--tail N` last N lines, `--since` time filter | `docker logs --tail 50 web` | Expecting to see a log file the application wrote inside the container — only the captured stdout/stderr stream appears here |
| `docker exec -it` | Run an additional command inside a running container, interactively | `-i` keep stdin open, `-t` allocate a TTY, `-u` run as another user | `docker exec -it web sh` | Trying it on a stopped container — exec needs a running process to join; for a container that already exited, `docker logs` is what remains |

**Traps** Anything changed through an exec session lives only in that container's writable layer
and vanishes when the container is replaced — fixing a container by hand is never a fix, the
image or the run configuration is. `docker exec` is also not `docker attach`: exec starts a new
process, attach connects your terminal to the existing main process, where a stray Ctrl-C can
stop the container.

**What the exam may test** Picking the right first diagnostic step for a described symptom —
logs for a container that exited or is producing errors, exec for inspecting a live container's
filesystem or configuration — and recognising the stdout/stderr logging convention.

<a id="c-devops.containers.stateless-vs-stateful-containers"></a>
### Stateless vs stateful containers
*id: `devops.containers.stateless-vs-stateful-containers` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: cncf-glossary-stateless-apps, cncf-glossary-stateful-apps*

**What it is** A stateless container keeps nothing that has to outlive it: every instance is
interchangeable, any instance can serve any request, and killing one costs nothing but the
in-flight work. A stateful container owns data — a database's files, a message queue's contents,
an uploaded file — and therefore needs persistent storage and, usually, a stable identity that
survives restart.

**Why it matters** The whole container operating model assumes statelessness by default:
horizontal scaling, rolling updates, and self-healing all rely on replicas being
indistinguishable. Recognising a described workload as stateful is what tells a candidate that
volumes, backups and a different orchestration object are required, rather than "just add more
replicas".

**How it works** Stateless services push their state outward — to a database, a cache, an object
store — so the container itself can be created and destroyed freely. Stateful services keep it
in a volume attached to a specific instance; scaling them is a data problem, not a scheduling
problem, which is why orchestrators provide a separate workload type with stable names and
per-instance storage for them.

**Key terms** interchangeable replica; horizontal scaling; persistent volume; stable identity.

#### Scenario

A containerised API answers on the host at port 8080 and a Postgres container beside it holds
its data. The API returns errors, so the first step is `docker logs` on the API container, which
shows connection refused to the database. `docker ps -a` shows the database container in an
exited state — so exec is not available on it, and the logs are the only evidence, showing an
out-of-disk error. After recreating it, the team finds the data gone: the database was started
without `-v`, so its files lived in the writable layer that `docker rm` deleted. Recreating with
a named volume fixes it permanently, and the credentials that were passed as `-e` are moved to a
secret store, since a value visible in the container's configuration is not a secret. The API's
own mapping, `-p 8080:80`, is confirmed correct: host first, container second.

#### Knowledge check

1. A container is stopped, not removed. What survives, and what is required to get the data back
   after a `docker rm`?
   Stopping preserves the writable layer, configuration and logs; after removal only data on a
   volume or a bind mount survives, because the writable layer is deleted with the container.
2. What is the one-sentence difference between a volume and a bind mount?
   A volume is storage Docker creates and manages in a location it owns; a bind mount maps an
   existing host path chosen by you into the container.
3. `-p 8080:80` was set but the service is still unreachable, and the application logs show it
   listening on `127.0.0.1:80`. What is wrong?
   The application is bound to the container's own loopback interface, so no traffic arriving
   from outside reaches it regardless of the mapping; it must listen on all interfaces.
4. Why can you not change a published port or an environment variable with `docker start`?
   Those are run-time settings fixed when the container was created; changing them requires
   creating a new container from the image.
5. A container has already exited. Which of `docker logs` and `docker exec -it` still works, and
   why?
   `docker logs`, because it replays the captured output stream; `docker exec -it` needs a
   running container to start a new process inside.
6. A workload writes uploaded files to local disk and cannot be freely killed and replaced. What
   is that called, and what does it need?
   Stateful — it needs persistent storage and a stable identity, not simply more replicas.

<a id="s-containers-ecosystem"></a>
## Ecosystem

<a id="c-devops.containers.container-runtime-and-oci"></a>
### Container runtime and OCI
*id: `devops.containers.container-runtime-and-oci` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: oci-overview, k8s-architecture*

**What it is** The container runtime is the component that actually creates and runs containers —
containerd and CRI-O are the ones a Kubernetes node typically uses, with the low-level tool runc
underneath doing the final work of setting up namespaces and executing the process. Docker is not
the runtime: it is a full toolchain — CLI, image building, networking, volume management — layered
above a runtime. The Open Container Initiative, formed under the Linux Foundation, publishes the
specifications that keep those pieces interchangeable: a Runtime Specification, an Image
Specification, and a Distribution Specification.

**Why it matters** Those standards are the reason an image built on a laptop with Docker runs
unmodified under containerd or CRI-O on a cluster node — the exam's portability claim is not
marketing, it is a specification. It also defuses the recurring "Kubernetes dropped Docker"
confusion: Kubernetes talks to a runtime through the Container Runtime Interface and supports
containerd, CRI-O and other CRI implementations, while images produced by Docker remain OCI
images and run there without change.

**How it works** An implementation downloads an OCI image, unpacks its layers into a filesystem
bundle on disk, and hands that bundle to an OCI runtime, which creates the container process. On
a Kubernetes node the kubelet drives that sequence through CRI; on a workstation the Docker CLI
drives it through Docker's own daemon. The image spec defines the manifest, configuration and
layer serialisation; the distribution spec standardises the registry API those images move over.

**Key terms** containerd; CRI-O; runc; CRI; OCI image spec.

<a id="c-devops.containers.docker-compose"></a>
### Docker Compose
*id: `devops.containers.docker-compose` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: docker-compose-features*

**What it is** A tool that defines a multi-container application — its services, networks and
volumes — in a single declarative YAML file and starts, stops and rebuilds the whole set with one
command. It is a single-host tool. It is not an orchestrator.

**Why it matters** Compose and Kubernetes are a named confusable pair, and the tempting wrong
answer is that Compose is "orchestration for small deployments". The dividing line is not how
many containers are involved — Compose happily runs a dozen — but how many hosts, and whether
anything keeps watching. Compose applies your file to one machine when you run it; an
orchestrator schedules across a fleet and keeps reconciling afterwards.

**How it works** The Compose file declares each service with its image or build context, ports,
environment and volumes, plus the dependencies between them. Bringing the project up creates the
network, the volumes and the containers in dependency order, reusing what already matches the
file, and tearing it down removes them again. Because everything is in the file, the same
environment can be recreated from source control on any machine with a container engine. Compose
is invoked as a Docker CLI plugin — `docker compose`, with a space — which supersedes the older
standalone `docker-compose` binary.

**Key terms** service; Compose file; single host; dependency order.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `docker compose up` | Create and start everything defined in the Compose file | `-d` detached, `--build` rebuild images first, `--force-recreate` | `docker compose up -d` | Assuming it distributes services across machines — every service in the project runs on the single host where the command was run |

**Traps** Compose has no cross-host scheduling and no rescheduling after a host failure: if the
machine dies, the application dies with it. Stopping a project is also not the same as removing
it — bringing it down deletes the containers and network, while stopping merely halts them.

**What the exam may test** Choosing Compose versus an orchestrator from a stated requirement
(one developer machine or CI job versus a production fleet needing scaling and failure
recovery), and recognising Compose's single-host limit as the deciding property.

*Not to be confused with [container orchestration](containers.md#cmp-devops.containers.container-orchestration).*

<a id="c-devops.containers.container-security-basics"></a>
### Container security basics
*id: `devops.containers.container-security-basics` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: docker-build-best-practices*

**What it is** Four habits that carry most of the practical risk reduction: build from a minimal,
trusted, version-pinned base image; run the application as a non-root user rather than the
default root; scan images for known vulnerabilities and rebuild to pick up fixes; and keep
secrets out of images and out of the Dockerfile entirely.

**Why it matters** Container isolation is weaker than a virtual machine's because the kernel is
shared, so the consequences of a compromise inside a container reach further than they would
inside a VM. That is why "run as root because it is only a container" is the wrong instinct, and
why the exam frames the answer as reducing what is in the image and what privileges it holds,
not as adding a scanner at the end.

**How it works** A smaller base image contains fewer packages, so it carries fewer known
vulnerabilities and less for an attacker to use; pinning the base version keeps rebuilds
predictable. Creating an unprivileged user in the Dockerfile and switching to it with `USER`
means the application does not run as root inside the container. Scanning is a continuous
activity rather than a one-off, because vulnerabilities are discovered in images that have not
changed. Secrets require the most care: a value passed as a build argument or set with `ENV`
persists in the image and can be recovered from it even if a later instruction unsets it, so the
only reliable approach is never to write it into a layer.

**Key terms** minimal base image; non-root `USER`; image scanning; build secret.

#### Scenario

A team is asked whether their Compose setup can be "promoted to production" for a service that
must survive a machine failure. It cannot: Compose runs every service on the single host where
the command was issued, so a host failure takes the whole application with it — that requirement
names an orchestrator. Reviewing the images before that move surfaces three fixes: the base image
is a full distribution pinned to no version, the container runs as root because no `USER` was
set, and a registry credential is passed as a build argument and is therefore recoverable from
the image's layers. None of that changes portability, because the images are OCI images and will
run under the cluster's containerd or CRI-O exactly as they run under Docker today — the runtime
differs, the image format does not.

#### Knowledge check

1. What is the one-sentence difference between Docker and a container runtime such as containerd?
   Docker is a full toolchain — CLI, build, networking, volumes — layered above a runtime;
   containerd is the component that actually creates and runs the containers.
2. Which three specifications does the OCI publish, and what do they buy you?
   Runtime, Image and Distribution specifications; together they make images and runtimes
   interchangeable, so an image built with one tool runs under another.
3. Compose runs twelve containers with dependencies and shared networks. Does that make it an
   orchestrator?
   No — it is single-host and one-shot; orchestration means scheduling across many hosts and
   continuously reconciling toward a declared state.
4. Why is running as root inside a container a bigger concern than running as root inside a VM?
   The kernel is shared with the host, so the isolation boundary a compromised root process must
   cross is thinner than a hypervisor's.
5. A secret was passed with `ARG` during a build and removed in a later instruction. Is it safe?
   No — it is still present in the layer where it was written and can be recovered; it must never
   enter a layer.

<a id="s-containers-orchestration"></a>
## Orchestration

<a id="c-devops.containers.container-orchestration"></a>
### Container orchestration
*id: `devops.containers.container-orchestration` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: cncf-glossary-container-orchestration, k8s-architecture*

**What it is** Automating the placement, scaling, networking, health-checking and restart of
containers across many hosts treated as a single pool. It answers questions a container engine on
one machine cannot: which machine should this run on, how many copies should exist, what happens
when a machine dies, and how do callers find a set of instances that keeps changing.

**Why it matters** The exam's alternative answer is always a single-host tool, usually Compose,
and the discriminating property is not "runs multiple containers". It is multiple hosts plus
continuous reconciliation — something that keeps comparing what is running against what was
declared and acts on the difference, indefinitely, without a human running a command.

**How it works** A scheduler chooses a host for each workload using the resources the workload
declares it needs and any placement constraints it carries; because placement is fitting declared
requests into available capacity, a pool of machines can be packed far more densely than one
workload per machine allows. Controllers watch actual state against declared state and take
corrective action — recreating a failed instance, moving work off a lost node, adding or removing
copies to match a replica count. Failure is detected explicitly rather than inferred: instances
are health-checked, so one that has stopped responding is restarted, and one that is running but
not yet able to serve is kept out of rotation until it is. Nodes are watched the same way, so a
node that stops reporting has its workloads recreated elsewhere instead of left stranded. A
service abstraction provides a stable address in front of instances whose addresses change.
Updates roll out by replacing instances gradually and can be rolled back. Kubernetes is the
dominant implementation; Nomad and Docker Swarm are others.

**Key terms** scheduler; controller; reconciliation; rolling update; replica.

**Traps** Orchestration is not a runtime: the orchestrator decides what should run where, and the
runtime on each node actually starts it. It is also not containerization — an orchestrator does
not build or isolate anything, it manages containers that already exist as images. And it is not
CI/CD: a pipeline builds the image, pushes it, and may submit the updated declaration, but what
keeps that declaration true for the weeks afterwards is the orchestrator, not the pipeline.

**What the exam may test** Selecting orchestration over a single-host tool from a stated
requirement (survive a node failure, scale to demand, roll out without downtime), separating the
orchestrator's role from the runtime's, and naming continuous reconciliation across a pool of
hosts — not the number of containers involved — as the property that makes a tool an
orchestrator.

<a id="cmp-devops.containers.container-orchestration"></a>
#### Not to be confused with: Container orchestration vs Docker Compose
*compares: `devops.containers.container-orchestration`, `devops.containers.docker-compose`*

| | Container orchestration | Docker Compose |
| --- | --- | --- |
| Hosts | Many, pooled and scheduled across | Exactly one — the machine the command runs on |
| When a host fails | Workloads are rescheduled onto healthy nodes | The application is down; nothing moves it |
| Scaling | A declared replica count the system maintains | Manual, and bounded by the single host |
| After the command finishes | Controllers keep reconciling actual state toward desired state | Nothing watches; the file was applied once |
| Typical use | Production fleets, rolling updates, self-healing | Local development, CI, a small single-server deployment |

The separating axis is hosts plus persistence of intent: Compose applies a file to one machine
once, an orchestrator schedules across many machines and never stops reconciling.

<a id="c-devops.containers.kubernetes"></a>
### Kubernetes
*id: `devops.containers.kubernetes` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: k8s-steering-charter, cncf-charter, cncf-who-we-are, cncf-project-kubernetes*

**What it is** The dominant open source container orchestrator. Two facts about its standing are
routinely confused and both are examinable: it is *hosted by* the CNCF as a graduated project,
and it is *governed by* its own Kubernetes Steering Committee, an elected body that its charter
names as the governing body of the project. The CNCF hosts, funds and provides marketing,
infrastructure and trademark support; it does not govern Kubernetes.

**Why it matters** LFCA wants vocabulary and purpose, not operational skill — recognising what
Kubernetes is for and what its objects are called, not writing manifests or passing a CKA. The
governance point is worth holding separately because it mirrors a distinction the exam already
makes elsewhere: the Linux Foundation hosts and funds the Linux kernel without setting its
technical direction, and the CNCF stands in the same relation to Kubernetes.

**How it works** You submit declarations of desired state to the cluster's API; controllers
reconcile the cluster toward them continuously. Within the project, the Steering Committee holds
non-technical governance and delegates technical responsibility to Special Interest Groups,
requesting funds and support from the CNCF rather than receiving direction from it. For this
exam, the working vocabulary is cluster, node, control plane, pod, Deployment and Service, plus
what each one is for.

**Key terms** graduated project; Steering Committee; SIG; declarative API.

<a id="c-devops.containers.cluster-and-node"></a>
### Cluster and node
*id: `devops.containers.cluster-and-node` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: k8s-architecture*

**What it is** A Kubernetes cluster is a control plane plus a set of worker machines, called
nodes, that run the containerised applications; every cluster needs at least one worker node in
order to run pods. A node is one machine, physical or virtual, running a container runtime, the
kubelet, and a network proxy component so that Service behaviour works on its network.

**Why it matters** Node, pod and container form a containment hierarchy the exam expects a
candidate to keep straight: a cluster contains nodes, a node runs pods, a pod holds containers.
Node capacity is also what the scheduler places workloads against, so "why is this pod not
starting" frequently resolves to a node-level answer — insufficient resources, or no node
matching the pod's constraints.

**How it works** The kubelet on each node receives pod specifications from the control plane and
makes sure the described containers are running and healthy, driving the node's container runtime
to do it. The proxy component makes Service addressing work on that node's network; some network
plugins provide their own implementation instead. Nodes are replaceable: draining one causes its
pods to be recreated elsewhere, which is only safe because pods are treated as disposable.

**Key terms** worker node; kubelet; container runtime per node; drain.

<a id="c-devops.containers.pod"></a>
### Pod
*id: `devops.containers.pod` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: k8s-pods*

**What it is** The smallest deployable unit you can create and manage in Kubernetes: a group of
one or more containers with shared storage and network resources and a specification for how to
run them. A pod's contents are always co-located and co-scheduled on one node. Kubernetes manages
pods; it does not manage containers directly.

**Why it matters** This is the distinction most often missed. The scheduler places pods, not
containers, so a pod's containers can never be split across two nodes; scaling means creating
more pods, never adding more containers to one pod; and every other Kubernetes object in this
competency is defined in terms of pods — a Deployment creates them, a Service selects them.

**How it works** Containers in a pod share a network namespace, which means one IP address and
one port space between them: they reach each other over `localhost`, and two of them cannot bind
the same port. They can also share volumes declared at pod level. The one-container-per-pod model
is the common case, with the pod acting as a wrapper; multiple containers belong in one pod only
when they are tightly coupled, such as a sidecar that must share the main container's filesystem
or network. Pods are ephemeral: a failing pod is not repaired but replaced, and the replacement
is a new pod with a new name and a new IP address. Bare pods are rarely created directly — a
workload controller such as a Deployment creates them.

**Key terms** co-scheduling; shared network namespace; sidecar; ephemeral IP.

**Traps** A pod is not a container, and it is not a Deployment: the pod is the unit that runs,
the Deployment is the object that declares how many pods should exist and recreates them.
Because pod IPs change on every replacement, addressing a pod directly is a bug waiting for the
next restart — that is what a Service exists to solve.

**What the exam may test** Naming the pod as Kubernetes' smallest deployable unit and the thing
the scheduler actually places, and distinguishing "scale to five" (five pods) from "put five
containers in a pod" (a co-location decision, not a scaling one).

*Not to be confused with [container](containers.md#cmp-devops.containers.container).*
*Not to be confused with [deployment](containers.md#cmp-devops.containers.deployment).*

<a id="c-devops.containers.deployment"></a>
### Deployment
*id: `devops.containers.deployment` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: k8s-deployment*

**What it is** A Kubernetes object that manages a set of pods running an application workload,
declaring the desired number of replicas and the pod template they are created from. It provides
declarative updates for pods and ReplicaSets: you describe the desired state, and the Deployment
controller changes the actual state to match it at a controlled rate.

**Why it matters** Replica count, rolling updates and rollbacks all live here — not on the pod,
which knows nothing about how many of itself should exist, and not on the Service, which only
addresses whatever pods currently match its selector. A scenario asking how to update an
application without downtime, or how to return to the previous version, is asking about the
Deployment.

**How it works** A Deployment creates a ReplicaSet, and the ReplicaSet creates the pods. Changing
the pod template creates a new ReplicaSet, which is scaled up while the old one is scaled down,
so pods are replaced gradually rather than all at once; each such change is a revision that can
be rolled back. Because the controller is continuously comparing actual against desired, deleting
one of its pods does not reduce the count — the replica count is now unsatisfied, so a
replacement pod appears almost immediately. Removing the workload means changing or deleting the
Deployment, not deleting pods.

**Key terms** ReplicaSet; replicas; pod template; rolling update; revision.

**Traps** A Deployment is not a Service: one decides what runs and how many, the other decides
how it is reached. It also assumes interchangeable, essentially stateless pods — a workload
needing stable identity and per-instance storage is not a Deployment's job.

**What the exam may test** Assigning a described capability — scaling to a replica count, rolling
out a new image version, rolling back — to the Deployment rather than the pod or the Service, and
explaining why a manually deleted pod reappears.

<a id="cmp-devops.containers.deployment"></a>
#### Not to be confused with: Deployment vs Kubernetes service vs Pod
*compares: `devops.containers.deployment`, `devops.containers.kubernetes-service`, `devops.containers.pod`*

| | Deployment | Kubernetes service | Pod |
| --- | --- | --- | --- |
| What it is | A declaration of how many pods, from which template | A stable network endpoint in front of a changing set of pods | The unit that actually runs the containers |
| Question it answers | How many, which version, rolled out how | What address do callers use | What is running together on one node |
| What it creates | ReplicaSets, which create pods | Nothing — it selects existing pods by label | Its own containers |
| Survives one of its pods being deleted | Yes — a replacement is created | Yes — it routes to whatever pods currently match | No — the deleted pod is gone; any replacement is a different pod |
| Where scaling is configured | Here, as the replica count | Not here | Not here |

The separating axis is lifecycle, addressing, execution: the Deployment governs the lifecycle of
pods, the Service governs how they are addressed, and the pod is where the containers actually
run.

<a id="c-devops.containers.kubernetes-service"></a>
### Kubernetes service
*id: `devops.containers.kubernetes-service` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: k8s-service*

**What it is** An abstraction that exposes a logical set of pods — normally chosen by a label
selector — as a single stable network endpoint, together with a policy for how they are reached.
It exists because pods are ephemeral resources: each has its own IP address, and the set of pods
backing an application changes from moment to moment as they are replaced, rescheduled or scaled.

**Why it matters** "The frontend cannot reach the backend after a redeploy" is the archetypal
scenario, and the cause is addressing pods directly instead of through a Service. It is also the
exam's pick-the-type question: ClusterIP exposes the Service inside the cluster only and is the
default, NodePort additionally exposes it on a port on each node, and LoadBalancer exposes it
externally through a load balancer, typically provisioned by the cloud provider.

**How it works** The Service's selector matches labels on pods; the set of matching, ready pods
is tracked automatically as pods come and go, and traffic sent to the Service is balanced across
them. In-cluster DNS resolves the Service name, so callers use a name that never changes while
the pods behind it do. The linkage is labels alone — a Service neither creates pods nor knows
which Deployment produced them, which is exactly what allows a rolling update to swap every pod
underneath without the caller noticing.

**Key terms** label selector; endpoints; ClusterIP; NodePort; LoadBalancer; cluster DNS.

**Traps** A Service whose selector matches no pods still exists and still resolves, but has no
endpoints, so connections fail — an "everything is created, nothing works" symptom that is a
label mismatch, not a networking fault. And a ClusterIP Service is not reachable from outside the
cluster no matter how the application is configured.

**What the exam may test** Identifying the Service as the answer to unstable pod addressing,
choosing among ClusterIP, NodePort and LoadBalancer from a stated exposure requirement, and
separating the Service's addressing role from the Deployment's lifecycle role.

*Not to be confused with [deployment](containers.md#cmp-devops.containers.deployment).*

<a id="c-devops.containers.control-plane"></a>
### Control plane
*id: `devops.containers.control-plane` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: k8s-architecture*

**What it is** The set of components that make global decisions about the cluster and respond to
cluster events, as distinct from the worker nodes that run the workloads. Its components are the
API server (`kube-apiserver`), which is the front end for the Kubernetes API; etcd, the
consistent and highly available key-value store used as the backing store for all cluster data;
the scheduler (`kube-scheduler`), which watches for newly created pods with no assigned node and
selects one for them; and the controller manager (`kube-controller-manager`), which runs the
controller processes, joined by a cloud controller manager where a cloud provider is integrated.

**Why it matters** "Which component does X" is a direct recall question, and the four have
cleanly separable jobs: serving the API, storing state, choosing nodes, and reconciling. The
split also explains an availability question the exam likes: losing the control plane stops new
scheduling and new changes, while pods already running on healthy nodes keep serving traffic.

**How it works** Everything passes through the API server, which is the only component that talks
to etcd; controllers and the scheduler watch the API for changes and write their decisions back
through it. Control plane components can run on any machine in the cluster, but are usually kept
on dedicated machines that run no user workloads, and are replicated across several machines in
production for fault tolerance. etcd is the one stateful piece, which makes it the thing to back
up.

**Key terms** `kube-apiserver`; etcd; `kube-scheduler`; `kube-controller-manager`.

<a id="c-devops.containers.declarative-configuration-and-desired-state"></a>
### Declarative configuration and desired state
*id: `devops.containers.declarative-configuration-and-desired-state` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: k8s-deployment, k8s-architecture*

**What it is** The operating model of an orchestrator: you submit a description of what should
exist — how many replicas, which image, which ports — and the system continuously drives actual
state toward that description, instead of executing a sequence of imperative steps once and
walking away.

**Why it matters** It is the mechanism behind every "self-healing" claim, and the exam expects the
mechanism rather than the adjective. Nothing notices a crash and runs a repair script; a
controller compares desired against actual on a loop and acts on the difference, which is the same
reason a manually deleted pod comes straight back and a manually scaled workload drifts back to
the declared count. It is also why manifests belong in version control: the file is the source of
truth for what the cluster should look like.

**How it works** Desired state is stored through the API server; controllers observe actual state,
compare it with desired state, and take action to reduce the difference, repeating indefinitely.
Because the description names an end state rather than steps, applying it twice is the same as
applying it once — the imperative alternative, a script of create-and-modify commands, is not
safe to re-run and has no answer for state drifting afterwards.

**Key terms** manifest; reconciliation loop; controller; idempotence.

<a id="c-devops.containers.cncf"></a>
### CNCF
*id: `devops.containers.cncf` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: cncf-who-we-are, cncf-charter*

**What it is** The Cloud Native Computing Foundation, part of the nonprofit Linux Foundation,
whose chartered mission is to make cloud native computing ubiquitous. It hosts a large portfolio
of vendor-neutral open source projects — Kubernetes among them — and sustains the ecosystem
around them with infrastructure, events and marketing.

**Why it matters** The relationship the exam tests is hosting versus governing. The CNCF hosts
Kubernetes as a graduated project; Kubernetes is governed by its own Steering Committee. This is
the same shape as the Linux Foundation's relationship to the Linux kernel, and a question that
names one organisation and one project is usually probing whether the candidate collapses the two
roles into one.

**How it works** Projects enter at sandbox level and progress through incubating to graduated as
adoption and governance maturity are demonstrated. A Technical Oversight Committee maintains the
foundation's technical vision and approves and aligns projects within the scope set by the
governing board, while day-to-day technical authority stays with each project's own maintainers
and governance structures.

**Key terms** graduated project; Technical Oversight Committee; vendor-neutral; cloud native.

#### Scenario

A Dockerfile is built and tagged `team/api:1.4.2`, producing an image whose `RUN`, `COPY` and
`ADD` steps became layers, and is pushed to a registry. A Deployment declaring three replicas of
that image goes to the API server, which records the desired state in etcd. The scheduler sees
three pods with no node assigned and picks nodes with room; on each, the kubelet drives the
container runtime, which pulls the image and starts the containers inside a pod. A Service whose
label selector matches those pods gives callers one stable name, balancing across whichever pods
are ready. When `1.4.3` is pushed and the Deployment's template updated, a new ReplicaSet scales
up while the old scales down; pod IPs churn throughout and the Service keeps answering, because
it selects by label rather than by address. An engineer who deletes a pod by hand watches it
reappear: the replica count is unsatisfied, and reconciliation never stops.

#### Knowledge check

1. What is the precise relationship between the CNCF and Kubernetes?
   The CNCF hosts Kubernetes as a graduated project and provides funding and support; Kubernetes
   is governed by its own Steering Committee, not by the CNCF.
2. What is the one-sentence difference between a pod and a container?
   A container is a running process; a pod is Kubernetes' smallest deployable unit, wrapping one
   or more containers that share network and storage and are always scheduled together.
3. A pod is deleted by hand and reappears. Which object caused that, and why?
   The Deployment, acting through the ReplicaSet it created and which actually owns the pods: the
   declared replica count was no longer satisfied, and the controller reconciles actual state
   toward desired state continuously.
4. Which Kubernetes object gives a changing set of pods one stable address, and why is one
   needed?
   A Service; pods are ephemeral and each replacement gets a new IP, so addressing pods directly
   breaks on the next restart.
5. Name the four core control plane components and one job each.
   `kube-apiserver` serves the API; etcd stores all cluster data; `kube-scheduler` assigns
   unscheduled pods to nodes; `kube-controller-manager` runs the controllers that reconcile state.
6. The control plane is unavailable for ten minutes. Do running applications stop?
   No — pods already running on healthy nodes keep serving; what stops is scheduling, updates and
   any other change to cluster state.
