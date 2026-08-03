# =============================================================================
# LFCA practice lab image — Ubuntu 24.04 LTS running systemd as PID 1.
#
# Both node1 and node2 are built from this one file. Edit it, then run
# `./lab reset` to rebuild both boxes from scratch.
# =============================================================================
FROM ubuntu:24.04

# noninteractive stops debconf from trying to open dialogs during `apt install`.
# ARG (not ENV) so it applies only at build time and doesn't leak into your shell.
ARG DEBIAN_FRONTEND=noninteractive

# Lab account passwords. Override them in .env (see .env.example) rather than
# editing this file. The defaults keep a fresh clone working with no setup.
#
# Honest caveat: a build ARG is recorded in `docker history`, so this is NOT a
# way to hide a real secret. It is fine here because these are throwaway
# credentials for a local container that publishes no ports — nothing outside
# your Mac can reach it. Never use this pattern for a credential that matters.
ARG STUDENT_PASSWORD=lfca123
ARG ROOT_PASSWORD=lfca123

# systemd and several other tools check $container to detect that they are not
# running on real hardware. Without it systemd tries to do things like load
# kernel modules and set the system clock, and complains loudly when it can't.
ENV container=docker

# -----------------------------------------------------------------------------
# 1. Un-strip the image so man pages can be installed.
#
# The official Ubuntu image ships /etc/dpkg/dpkg.cfg.d/excludes, which tells
# dpkg to throw away /usr/share/man/*, /usr/share/doc/* and translations as
# packages are unpacked. That is why `man ls` fails on a stock ubuntu image.
# Deleting the file makes every package installed *after this point* keep its
# documentation. Packages already in the base image are handled in step 3.
# -----------------------------------------------------------------------------
RUN rm -f /etc/dpkg/dpkg.cfg.d/excludes

# -----------------------------------------------------------------------------
# 2. Install everything.
#
# --no-install-recommends keeps the image lean; we name what we want explicitly
# so it is obvious what is in the box. Groups are roughly by exam domain.
# -----------------------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
      # --- init system + IPC (systemctl / journalctl depend on these) ---
      systemd systemd-sysv dbus dbus-user-session \
      # --- accounts & privilege ---
      sudo passwd \
      # --- remote access: ssh, scp, sftp between node1 and node2 ---
      openssh-server openssh-client \
      # --- documentation: man-db is the `man` command, manpages is the content ---
      man-db manpages manpages-dev bash-completion less \
      # --- editors ---
      vim nano \
      # --- fetching things ---
      curl wget git ca-certificates \
      # --- networking & troubleshooting ---
      iproute2 iputils-ping net-tools dnsutils tcpdump ufw \
      # --- scheduling & file transfer ---
      cron rsync \
      # --- general shell tooling ---
      tree htop jq unzip tar gzip file lsof procps \
      # --- scripting & compiling ---
      python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# 3. Restore man pages for packages that were *already* in the base image.
#
# Step 1 only affects future unpacks. coreutils, bash, util-linux etc. were
# installed upstream while the exclude rule was still active, so their man pages
# are gone. Reinstalling them re-extracts the .deb with documentation intact.
# Add a package here if you ever find a missing man page.
# -----------------------------------------------------------------------------
RUN apt-get update && apt-get install -y --reinstall \
      coreutils bash util-linux procps findutils grep sed diffutils \
      tar gzip dpkg apt passwd login adduser hostname ncurses-bin mount \
      systemd sudo \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# 4. Un-divert the `man` command.
#
# Restoring the man page *files* is only half the job. The Ubuntu image also
# uses dpkg-divert to move the real /usr/bin/man aside to /usr/bin/man.REAL and
# drop a stub shell script in its place — the one that prints "This system has
# been minimized...". Without this step `man ls` prints that message even
# though /usr/share/man/man1/ls.1.gz is sitting right there.
#
#   dpkg-divert --remove --rename  undoes the diversion and moves man.REAL back.
#   We delete the stub first, because --rename refuses to overwrite it.
#
# `mandb` then builds the index that `man -k` / `apropos` search.
# -----------------------------------------------------------------------------
RUN rm -f /usr/bin/man \
    && dpkg-divert --quiet --remove --rename /usr/bin/man \
    && mandb --quiet --create

# -----------------------------------------------------------------------------
# 5. Mask systemd units that cannot work inside a container.
#
# `mask` symlinks the unit to /dev/null so systemd refuses to start it. Without
# this, boot ends in the "degraded" state because these units fail: they all
# want to talk to real kernel/hardware interfaces a container does not have.
# -----------------------------------------------------------------------------
RUN systemctl mask \
      systemd-udevd.service \
      systemd-udevd-kernel.socket \
      systemd-udevd-control.socket \
      systemd-modules-load.service \
      sys-kernel-debug.mount \
      sys-kernel-tracing.mount \
      systemd-journald-audit.socket

# -----------------------------------------------------------------------------
# 6. Persistent journal.
#
# If /var/log/journal exists, journald writes logs to disk instead of to a
# tmpfs under /run. That means `journalctl --since yesterday` still has data
# after `./lab stop && ./lab start`.
# -----------------------------------------------------------------------------
RUN mkdir -p /var/log/journal

# -----------------------------------------------------------------------------
# 7. Accounts.
#
# The stock Ubuntu image ships an unused `ubuntu` user holding UID 1000. We
# remove it so `student` gets UID 1000, which keeps file ownership on the
# bind-mounted labs/ folder predictable.
#
# Passwords come from the build ARGs declared at the top of this file, which
# compose.yml feeds from .env. Defaults are documented in README.md.
# -----------------------------------------------------------------------------
RUN userdel -r ubuntu 2>/dev/null || true \
    && useradd --create-home --uid 1000 --shell /bin/bash --comment "LFCA student" student \
    && echo "student:${STUDENT_PASSWORD}" | chpasswd \
    && echo "root:${ROOT_PASSWORD}"       | chpasswd \
    && usermod -aG sudo student

# Give student passwordless sudo. Comment this line out and rebuild if you want
# to practice being prompted for your password by sudo instead.
RUN echo 'student ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/90-student \
    && chmod 0440 /etc/sudoers.d/90-student

# The bind mount from the Mac lands here. Creating it now means the directory
# has the right owner even before Docker mounts over it.
RUN install -d -o student -g student -m 0755 /home/student/labs

# -----------------------------------------------------------------------------
# 8. SSH server.
#
# Ubuntu 24.04 ships ssh as *socket activated*: ssh.socket listens on port 22
# and starts ssh.service on demand. That is modern and correct, but it makes
# `systemctl stop ssh` confusing to practice on, because the socket immediately
# restarts the service on the next connection. We disable the socket and enable
# the plain service so start/stop/status behave the classic way.
#
# To see socket activation for yourself:
#   sudo systemctl disable --now ssh.service
#   sudo systemctl enable  --now ssh.socket
# -----------------------------------------------------------------------------
RUN systemctl disable ssh.socket \
    && systemctl enable ssh.service \
    && systemctl enable cron.service

# Password logins are on so `ssh student@node2` works out of the box with the
# password below. Turning PasswordAuthentication off after you have set up
# key-based auth is a good exercise.
RUN printf '%s\n' \
      '# LFCA lab settings — see /etc/ssh/sshd_config for the defaults these override.' \
      'PasswordAuthentication yes' \
      'PermitRootLogin yes' \
      > /etc/ssh/sshd_config.d/99-lfca-lab.conf

# The base image bakes SSH host keys at build time, so node1 and node2 would
# otherwise be identical machines as far as SSH is concerned. Delete them and
# regenerate per-container on first boot, so each node has its own identity and
# host-key fingerprints mean something.
#
# Note the bare `ExecStartPre=` on its own line. A drop-in *appends* to the
# list it inherits, and ssh.service already ships ExecStartPre=/usr/sbin/sshd -t
# (a config syntax check). Appending would run that check before the host keys
# exist, so it fails and the service never starts. Assigning an empty value
# first clears the inherited list, letting us put the two back in the order we
# actually need. This is standard systemd drop-in behaviour — see
# `man systemd.unit` under "Drop-In Files".
RUN rm -f /etc/ssh/ssh_host_* \
    && mkdir -p /etc/systemd/system/ssh.service.d \
    && printf '%s\n' \
      '[Service]' \
      'ExecStartPre=' \
      'ExecStartPre=/usr/bin/ssh-keygen -A' \
      'ExecStartPre=/usr/sbin/sshd -t' \
      > /etc/systemd/system/ssh.service.d/10-generate-hostkeys.conf

# -----------------------------------------------------------------------------
# 9. Login banner.
# -----------------------------------------------------------------------------
RUN printf '%s\n' \
      '' \
      '  LFCA practice lab — Ubuntu 24.04 with systemd.' \
      '  Other box: node1 <-> node2   |   Shared with the Mac: ~/labs' \
      '  This is a container: no boot process, no GRUB, no real disks.' \
      '' \
      > /etc/motd

# -----------------------------------------------------------------------------
# 10. Boot.
#
# systemd shuts down cleanly on SIGRTMIN+3 (real signal 37). Docker's default
# stop signal is SIGTERM, which systemd interprets as "reboot" — so without
# this, `./lab stop` looks like it hangs until Docker gives up and kills it.
# compose.yml sets the same thing; both are here so `docker run` works too.
# -----------------------------------------------------------------------------
STOPSIGNAL SIGRTMIN+3

CMD ["/sbin/init"]
