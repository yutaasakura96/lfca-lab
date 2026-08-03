# LFCA Practice Lab

Two Ubuntu 24.04 LTS boxes — `node1` and `node2` — running real `systemd`, on a private
network, for practising [LFCA](https://training.linuxfoundation.org/certification/linux-foundation-certified-it-associate/)
material. Built with Docker, native arm64, no VM.

```
node1  <──  lfca-labnet  ──>  node2
  └─────────┬─────────────────┘
       ./labs on your Mac  →  /home/student/labs in both boxes
```

---

## Quick start

```bash
cd ~/Documents/GitHub/lfca-lab
./lab start
./lab shell node1
```

That's it. You're `student@node1` with a working `systemctl`, `journalctl`, `man`, and
`ssh node2`.

---

## The `lab` script

| Command | What it does |
| --- | --- |
| `./lab start` | Boot both boxes. Resumes previous state if they already exist. |
| `./lab stop` | Power both boxes off cleanly. **Everything inside is preserved.** |
| `./lab status` | Show what's running and whether systemd is healthy. |
| `./lab shell [node]` | Log in as `student`. Defaults to `node1`. |
| `./lab root [node]` | Log in as `root`. Defaults to `node1`. |
| `./lab reset` | **Destroy** both boxes and rebuild from the Dockerfile. Prompts first. |
| `./lab rebuild` | Rebuild the image *then* reset. Use after editing the `Dockerfile`. |

Run `./lab` with no arguments for the same list.

---

## Logins

| User | Password | Notes |
| --- | --- | --- |
| `student` | `lfca123` | In the `sudo` group, **passwordless sudo** |
| `root` | `lfca123` | Usable directly: `./lab root node1`, or `su -` |

Same on both boxes. To change them, `cp .env.example .env`, edit, then `./lab rebuild`.

> **On the passwords being in the repo:** they're wired through `.env` (gitignored) because
> that's the habit worth having, but be honest with yourself about what this is — a build
> ARG is visible in `docker history`, and the fallback default sits in `compose.yml`. These
> are throwaway credentials for a container that publishes **no ports to your Mac and is
> not reachable from your network**. That's why it's fine here. Don't reuse this pattern
> for a credential that actually matters.

To practise being prompted by `sudo`, comment out the `/etc/sudoers.d/90-student` line in
the `Dockerfile` and run `./lab rebuild`.

---

## The shared folder

| On your Mac | Inside both boxes |
| --- | --- |
| `~/Documents/GitHub/lfca-lab/labs/` | `/home/student/labs` (i.e. `~/labs`) |

Edit in VS Code on the Mac, run in Linux. It's a bind mount, so it is **the same files** —
not a copy, and not synced. It survives `stop`, `start`, and `reset`.

Put your notes and scratch scripts here. `.gitignore` keeps the folder tracked but its
contents local, so your notes never get pushed.

**One quirk:** `ls -l ~/labs` shows files owned by `root` inside the box, even ones you just
created as `student`. That's Docker Desktop's macOS file-sharing layer (`fakeowner`), which
displays uid 0 but grants full access to everyone. Read, write, `chmod`, and execute all
work normally as `student` — the ownership display is cosmetic. Don't use `~/labs` to
practise ownership and permissions; use somewhere in the box's own filesystem like `/srv`
or `/opt` for that, where `chown` behaves properly.

---

## Persistence — what survives what

| | `./lab stop` → `./lab start` | `./lab reset` |
| --- | --- | --- |
| Installed packages | survives | **gone** |
| Edited configs (`/etc/...`) | survives | **gone** |
| Users you created | survives | **gone** |
| Files in `/home`, `/srv`, `/opt` | survives | **gone** |
| `journalctl` history | survives | **gone** |
| **`labs/`** | survives | **survives** |

`stop`/`start` is the normal day-to-day mode — treat it like shutting a laptop down.

Use `reset` when you've broken something badly enough that you want a clean machine, or
when you want to redo an exercise from scratch. It prompts before doing anything.

Note that the two boxes are independent: installing something on `node1` does not put it on
`node2`. That's deliberate — it's what makes `scp`, `rsync`, and remote administration
practice meaningful.

---

## Things to practise here

Everything below genuinely works in this lab:

- **Services** — `systemctl start|stop|restart|enable|disable|status`, unit files,
  drop-ins in `/etc/systemd/system/*.service.d/`, `systemctl daemon-reload`
- **Logs** — `journalctl -u ssh`, `-f`, `--since`, `-p err`, `-b`. The journal is persistent
  (`/var/log/journal`), so history survives a restart.
- **Users & permissions** — `useradd`, `usermod`, `passwd`, `groups`, `chmod`, `chown`,
  `umask`, SUID/SGID/sticky, `/etc/passwd`, `/etc/shadow`, `/etc/group`, `sudoers`
- **SSH** — `ssh student@node2`, `ssh-keygen`, `ssh-copy-id`, key-based auth, hardening
  `sshd_config`, `scp`, `rsync`, `sftp`
- **Networking** — `ip a`, `ip r`, `ss -tulpn`, `ping`, `dig`, `nslookup`, `tcpdump`,
  `/etc/hosts`, `/etc/resolv.conf`, `ufw` (installed, disabled by default)
- **Processes** — `ps`, `top`, `htop`, `kill`, `nice`, `renice`, `lsof`, `/proc`
- **Scheduling** — `crontab -e`, `/etc/cron.d/`, systemd timers
- **Files & text** — `find`, `grep`, `sed`, `awk`, `tar`, `gzip`, pipes, redirection, `vim`
- **Packages** — `apt`, `apt-cache`, `dpkg -l`, `dpkg -L`, `/etc/apt/sources.list.d/`
- **Docs** — `man`, `man -k` / `apropos`, `man 5 crontab`, `--help`, `/usr/share/doc`

`man` is fully working, including sections and `apropos` — the Dockerfile explicitly undoes
the two separate things Ubuntu does to strip documentation (see steps 1, 3 and 4 in it).

---

## What this lab **cannot** teach you

This is a container, not a virtual machine. It shares your Mac's Docker Linux kernel and
never boots. Read up on the following instead of assuming you've practised them — several
show up on the LFCA syllabus:

- **The boot process.** There is no BIOS/UEFI, no POST, no bootloader stage. PID 1 is
  `systemd`, but it was started by Docker, not by a kernel handing off from a boot loader.
  `systemd-analyze blame` will show you something, but it isn't a real boot.
- **GRUB.** Not installed and not applicable. No `/boot/grub/grub.cfg`, no `update-grub`,
  no kernel parameters, no rescue/single-user mode, no boot-time root password recovery.
- **Kernel and modules.** The kernel is your Mac's Docker VM kernel (`uname -r` shows
  `linuxkit`). `lsmod`, `modprobe`, `insmod`, `rmmod`, `/lib/modules`, and `sysctl` writes
  will fail or lie. You cannot compile or load a module.
- **Disks and partitioning.** No block devices of your own. `fdisk`, `parted`, `mkfs`,
  `mount` of a real partition, LVM (`pvcreate`/`vgcreate`/`lvcreate`), RAID, and `/etc/fstab`
  entries that actually mount at boot are all out of reach. `lsblk` and `df` show the
  host's overlay, not a disk you control.
- **Swap.** `swapon` / `swapoff` / `/proc/swaps` are the host's, not yours.
- **Hardware.** No `lspci`, `lsusb`, `dmidecode`, sensors, or anything device-related.
  `udev` is masked because it cannot work.
- **True runlevels / targets.** `systemctl isolate`, `reboot`, `poweroff`, and
  `rescue.target` don't behave as they would on a real machine.
- **Real firewalling.** `ufw` is installed and its command syntax is worth learning, but
  enabling it inside a container with Docker's networking does not behave like a real host
  firewall. Learn the commands here; don't trust the behaviour.
- **Time and NTP.** `timedatectl` cannot set the clock — that's the host's job.

For those topics: read the docs, use the Linux Foundation course material, and if you want
hands-on practice, a real VM (UTM or VirtualBox on Apple Silicon) or a throwaway cloud
instance is the right tool. This lab deliberately trades those away for something that
starts in two seconds and resets in ten.

---

## How it works

- **`Dockerfile`** — the single image both boxes are built from. Heavily commented; reading
  it is part of the point. Edit it and run `./lab rebuild`.
- **`compose.yml`** — defines `node1` and `node2` and the `lfca-labnet` bridge network.
- **`lab`** — the helper script. Plain bash, also commented.

Three details worth knowing, because they're the parts that are easy to get wrong:

**`privileged: true`.** Docker mounts `/sys/fs/cgroup` read-only into a normal container,
and systemd cannot manage services without writing to it. Combined with Docker's default
*private* cgroup namespace, the container gets its own isolated cgroup tree and cannot see
or touch the host's — verified: `/proc/1/cgroup` inside the box reads `0::/init.scope`. It
also supplies the capabilities `tcpdump`, `ufw`, and `mount` want.

**`stop_signal: SIGRTMIN+3`.** systemd reads Docker's default `SIGTERM` as *reboot* and
`SIGRTMIN+3` as *power off*. Without this, `./lab stop` appears to hang for ten seconds and
then gets `SIGKILL`ed mid-shutdown.

**`./lab start` uses `docker compose start`, not `up`.** `up` will silently *recreate* a
container — wiping everything you installed — if it decides the config drifted. `start` just
resumes it. That distinction is the whole persistence model; `./lab rebuild` is there for
when you actually do want a recreate.

### Requirements

Docker Desktop on macOS. Built and verified on Apple Silicon (arm64) with Docker 29.6.1 and
Compose v5.3.0 — no `--platform` flag, native arm64 images throughout. Nothing here is
Apple-Silicon-specific, so it should work on Intel and on Linux too, but that's untested.
