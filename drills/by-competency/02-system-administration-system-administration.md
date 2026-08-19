<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — System Administration Fundamentals :: System Administration

128 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A vendor `.deb` file is installed with `dpkg -i tool_1.0_amd64.deb` and it fails because a required library is missing. What state is the package left in, and what fixes it?

- **A.** Unpacked but unconfigured, blocking further operations until `apt --fix-broken install` resolves the missing dependency
- **B.** Cleanly rolled back to its pre-install state, as if the command had never been run
- **C.** Refused outright with nothing unpacked, the same behaviour `rpm -i` would show — `dpkg` checks every dependency before it extracts any file
- **D.** Fully installed and working, since `dpkg` silently substitutes a compatible library

**Answer: A.** `dpkg -i` performs no dependency resolution. On a missing requirement it unpacks the package but cannot finish configuring it, leaving it in a half-configured state that blocks later operations until `apt --fix-broken install` (or `apt install`, which resolves dependencies from the start even for a local file) repairs it. `apt upgrade`, by contrast, only touches packages already installed from a repository.

- B is wrong: `dpkg -i` does not roll back on a missing dependency; it leaves the package unpacked and unconfigured, blocking later operations until the gap is filled.
- C is wrong: `dpkg -i` unpacks first and only then fails at the configure step, leaving the package in dpkg's `unpacked` state; the pre-extraction refusal described here is `rpm -i` behaviour on a Red Hat-family system, not dpkg's.
- D is wrong: `dpkg` performs no dependency resolution or substitution at all; a missing requirement blocks configuration rather than being silently worked around.

### 2.

An administrator needs to know exactly which files a locally installed package placed on the filesystem, using the installed package database rather than inspecting the original archive. Which command answers that?

- **A.** `dpkg -L nginx` run against the local package database
- **B.** `dpkg -l nginx` run to list installed packages and their status
- **C.** `apt update` run first, since refreshing the index also reports installed file locations
- **D.** `getent passwd nginx` run, treating the package name as an account to look up

**Answer: A.** `dpkg -L` lists the files a named installed package placed on the system, reading the local package database. It is easily confused with lowercase `dpkg -l`, which lists installed packages and their status rather than any one package's file list.

- B is wrong: Lowercase `-l` lists installed packages and their status flags; it does not list the files a specific package owns.
- C is wrong: `apt update` only refreshes the cached repository indexes; it reports nothing about files an installed package placed.
- D is wrong: That looks up a user account by name in the passwd database; it has nothing to do with querying package contents.

### 3.

Name three capabilities UEFI provides that legacy BIOS does not.

- **A.** Faster boot times, larger RAM support, and multi-core CPU support — capabilities a legacy BIOS machine cannot offer at all, whatever operating system it runs
- **B.** GRUB as the bootloader, kernel parameter passing, and the initramfs
- **C.** Support for more than four partitions total, journaling filesystems, and disk encryption
- **D.** An EFI System Partition holding bootloaders as files, GPT partitioning supporting disks beyond roughly 2 TiB, and Secure Boot

**Answer: D.** UEFI understands filesystems and reads an EFI executable from a dedicated FAT-formatted EFI System Partition rather than executing a 512-byte boot sector. That capability is what enables GPT partitioning (removing MBR's four-partition and roughly 2 TiB limits) and Secure Boot, none of which legacy BIOS provides.

- A is wrong: None of those are properties that distinguish UEFI from BIOS; the genuine distinguishing capabilities are the EFI System Partition, GPT support, and Secure Boot.
- B is wrong: GRUB, kernel parameters and the initramfs are all present regardless of which firmware generation is in use; they are not UEFI-specific capabilities.
- C is wrong: Journaling and disk encryption are filesystem-level features unrelated to firmware, and MBR already exceeds four partitions through extended partitions; the genuine firmware-linked limit is the roughly 2 TiB one MBR addressing imposes.

### 4.

An administrator disables Secure Boot in firmware settings to load an unsigned kernel module, and the machine continues to boot normally afterward using UEFI. Is that expected?

- **A.** No, disabling Secure Boot should force the machine to fall back to legacy BIOS booting
- **B.** No, because Secure Boot is required for the EFI System Partition to be readable at all
- **C.** Yes, but only because GRUB itself disables Secure Boot automatically when an unsigned module is present
- **D.** Yes — Secure Boot is one optional UEFI feature, and turning it off does not disable UEFI booting itself

**Answer: D.** Secure Boot is one optional UEFI feature that verifies the signature of each executable in the boot chain; it is not synonymous with UEFI itself. Turning it off to permit an unsigned kernel module leaves UEFI booting — the EFI System Partition, GPT, everything else — unaffected.

- A is wrong: Secure Boot is a UEFI feature layered on top of the normal boot path; disabling it does not revert the firmware to an entirely different, older boot mode.
- B is wrong: The EFI System Partition is read as part of ordinary UEFI booting regardless of whether Secure Boot's signature verification is enabled.
- C is wrong: GRUB does not silently disable a firmware-level setting; Secure Boot was turned off directly in firmware, which is what allowed the unsigned module to load.

### 5.

Put the five stages of the boot process in order, from power-on to a running system.

- **A.** Bootloader, firmware, kernel, units, then PID 1 — on modern machines the bootloader is what loads the firmware into memory
- **B.** Firmware, kernel, bootloader, PID 1, then units — the kernel starts first and then invokes a bootloader to locate the root filesystem
- **C.** Firmware, bootloader, PID 1, kernel, then units
- **D.** Firmware, bootloader, kernel plus initramfs, PID 1 (the init system), then units until the default target

**Answer: D.** The ordered handover is: firmware initialises hardware and finds a boot device; the bootloader loads the kernel and an initramfs; the kernel initialises and mounts the real root filesystem; it starts PID 1; and the init system activates units until the default target is reached.

- A is wrong: Firmware runs first, before any bootloader can be found or executed — this ordering has the first two stages reversed.
- B is wrong: The bootloader runs before the kernel, not after it — the kernel cannot be loaded until the bootloader has found and loaded it into memory.
- C is wrong: PID 1 cannot start before the kernel does, since the kernel is what starts PID 1 in the first place — the third and fourth stages are swapped here.

### 6.

`systemd-analyze blame` names a unit that took 30 seconds during a slow boot, but nothing else was waiting on that unit while it ran. Was it the cause of the slow boot?

- **A.** Yes, the slowest-duration unit in `blame`'s output is always what held boot up
- **B.** Not necessarily — `blame` measures duration, not delay, and a unit that runs in parallel with nothing waiting on it costs nothing to boot time
- **C.** No, because `blame` only reports on the firmware phase, which happens before Linux is even running
- **D.** No, but only because the unit must have failed rather than merely run slowly — `blame` lists only units that exited non-zero, so appearing in its output is itself the failure signal

**Answer: B.** systemd activates units in parallel wherever the dependency graph allows, so `blame`'s ranking by duration does not by itself show what delayed boot. `systemd-analyze critical-chain` identifies the actual ordering chain that determined when boot converged, which a merely slow but unwaited-on unit does not appear on.

- A is wrong: Duration alone does not establish delay when units run in parallel; `systemd-analyze critical-chain` is what shows the ordering chain that actually determined boot time.
- C is wrong: `blame` reports how long userspace units spent initialising; the firmware runs earlier still, before anything on disk has been read, and is outside what the command measures.
- D is wrong: Nothing in the scenario suggests the unit failed; it ran successfully but slowly, and the question is whether that slowness delayed anything else.

### 7.

An administrator edits `/etc/default/grub` to change the default boot entry and reboots, but the change has no effect. What step was skipped?

- **A.** Nothing was skipped; `/etc/default/grub` is read directly by GRUB at boot time
- **B.** The change needed `systemctl daemon-reload` to take effect — GRUB's menu is rebuilt by a systemd generator during each boot, so the manager has to be told to re-read its configuration first
- **C.** UEFI Secure Boot must be blocking the new default entry from being honoured
- **D.** Regenerating `grub.cfg` — with `update-grub` on Debian-family systems, or `grub2-mkconfig` on Red Hat-family ones — since `/etc/default/grub` only feeds that generation step

**Answer: D.** GRUB's runtime configuration, `grub.cfg`, is generated from `/etc/default/grub` and the scripts in `/etc/grub.d/`, not edited directly — the same "edited the source, did not rebuild the artefact" shape as a systemd unit needing `daemon-reload`. `update-grub` (Debian-family) or `grub2-mkconfig` (Red Hat-family) must run to regenerate it.

- A is wrong: GRUB reads the generated `grub.cfg`, not `/etc/default/grub` directly — the source file only takes effect once the generation step rewrites the config GRUB actually loads.
- B is wrong: `daemon-reload` re-reads systemd unit files and has nothing to do with GRUB's configuration, which is generated by a separate, unrelated tool.
- C is wrong: Secure Boot verifies signatures on boot executables; it does not selectively block a default-entry change, and nothing in the scenario points at signature verification.

### 8.

An administrator on a Red Hat-family server runs `update-grub` to regenerate the configuration after a kernel update, and it fails: command not found. Why?

- **A.** `update-grub` is a Debian-family wrapper script; Red Hat-family systems regenerate the configuration with `grub2-mkconfig` instead
- **B.** GRUB configuration regeneration is not supported at all on Red Hat-family systems
- **C.** The command failed because Secure Boot is enabled and blocking configuration regeneration
- **D.** The command failed because the kernel update has not finished installing yet — `update-grub` is shipped by the kernel package and appears only once the update completes

**Answer: A.** `update-grub` is a Debian-family wrapper around `grub-mkconfig -o /boot/grub/grub.cfg`, and it does not exist on Red Hat-family systems, which instead call `grub2-mkconfig -o /boot/grub2/grub.cfg` directly — reaching for the wrong family's command is a mix-up the exam can present directly.

- B is wrong: Regeneration is fully supported; it simply uses a different command name, `grub2-mkconfig -o /boot/grub2/grub.cfg`, on that family.
- C is wrong: Secure Boot governs signature verification of boot executables and has no bearing on whether a configuration-generation command exists on the system.
- D is wrong: The failure described is "command not found," which indicates the wrong tool was invoked, not that an install is still in progress.

### 9.

A file was copied as root into `alice`'s home directory and is now owned by root. `alice` wants to take ownership herself. Can she run `chown alice file` to do it?

- **A.** Yes, any user may change the ownership of a file they can currently read
- **B.** No — only a privileged process may give a file away to another user; `alice` cannot chown it to herself either
- **C.** Yes, but only because she is changing it to her own account rather than someone else's
- **D.** No, but `chgrp` would work instead — group changes carry no privilege check at all, so any user may set any group on any file

**Answer: B.** Only a privileged process may change a file's owning user, so `alice` must ask an administrator to run `chown alice file` as root. An unprivileged user may change the group of a file they own, but only to a group they themselves belong to, which is a narrower privilege.

- A is wrong: Read access has no bearing on the ownership-change privilege, which is restricted regardless of what the caller can already do with the file.
- C is wrong: The restriction applies to the operation itself, not to whether the target happens to be the caller — an ordinary user cannot chown a file at all.
- D is wrong: An unprivileged user may change a file's group, but only to a group they belong to — it is not unrestricted, and it does not change the owner.

### 10.

What is the difference between `chown alice file` and `chown alice: file`?

- **A.** There is no difference — `chown` strips a trailing colon before parsing the operand, exactly as it ignores a trailing slash on a pathname
- **B.** `chown alice: file` changes the group only, leaving the owning user untouched
- **C.** `chown alice: file` requires `alice` to already own the file, unlike the bare form
- **D.** The bare form changes only the owning user; the trailing colon also sets the group to `alice`'s login group

**Answer: D.** `chown alice file` changes only the owning user. `chown alice: file` — with a trailing colon and nothing after it — additionally sets the group to `alice`'s own login group, which is a separate and easily missed effect of the syntax.

- A is wrong: The colon is meaningful syntax: its presence, even with nothing following it, adds a group change to the command.
- B is wrong: The bare user name before the colon still sets the owner; the colon adds a group change on top of it rather than replacing it.
- C is wrong: Both forms are subject to the same ownership-change restriction; the colon does not add or remove that requirement.

### 11.

A user wants to edit their personal crontab. Why is `crontab -e` preferred over opening the spool file under `/var/spool/cron/` directly in a text editor?

- **A.** There is no real difference; both approaches update the same file identically
- **B.** Editing the spool file is preferred, since `crontab -e` only works for system crontabs, not personal ones
- **C.** `crontab -e` validates the syntax before installing the result and ensures the daemon notices the change
- **D.** `crontab -e` is required because personal crontabs cannot contain more than one line

**Answer: C.** A user crontab is edited through `crontab -e` because the command validates the syntax and installs the result into the spool directory the daemon watches. Editing the spool file directly can leave cron unaware of the change and skips the validation step entirely.

- A is wrong: The command path adds a validation step and guarantees the daemon picks up the change, neither of which a direct file edit provides.
- B is wrong: `crontab -e` is specifically the personal crontab editor; system crontabs under `/etc/cron.d/` are a different, separate mechanism.
- D is wrong: A personal crontab can hold any number of lines; the reason to prefer the command is validation and daemon notification, not a line-count restriction.

### 12.

A laptop was powered off overnight, missing its scheduled 03:00 cron job entirely; the job never ran once the machine came back on. Is plain cron broken?

- **A.** Yes, cron should always run a missed job as soon as the machine powers back on
- **B.** No, but the job must have been accidentally removed with `crontab -r` — cron drops a user's table automatically once one of its scheduled runs is missed
- **C.** Yes, and the fix is to switch the job to a `.timer` unit without `Persistent=true`
- **D.** No — cron simply skips a scheduled time that passes while the machine is off; `anacron` exists specifically to compensate for that

**Answer: D.** Cron simply skips a scheduled time that passes while the machine is powered off — it is not a fault. `anacron` exists to compensate for that on machines that are not on continuously, and a systemd timer with `Persistent=true` is the equivalent modern alternative. `crontab -l` would have confirmed the job was still scheduled all along.

- A is wrong: That catch-up behaviour is exactly what plain cron lacks and what `anacron` was built to add — expecting it from cron itself is the mistake here.
- B is wrong: Nothing in the scenario suggests the crontab was removed; a missed run on a machine that was off is the far more direct and standard explanation.
- C is wrong: A timer without `Persistent=true` would show exactly the same behaviour as cron here; the catch-up property requires that setting specifically.

### 13.

A crontab line reads `30 4 1,15 * 5 /usr/local/bin/report.sh`. Both the day-of-month and day-of-week fields are restricted. When does the job actually run?

- **A.** At 04:30, only on whichever day is both the 1st or 15th of the month and a Friday
- **B.** At 04:30 on the 1st and 15th of every month only; the day-of-week field is ignored when the day-of-month field is also set
- **C.** At 04:30 on the 1st and 15th of every month, and additionally at 04:30 every Friday
- **D.** At 04:30 every Friday only; the day-of-month field is ignored when the day-of-week field is also set

**Answer: C.** When both the day-of-month and day-of-week fields are restricted (neither is `*`), cron combines them with OR rather than AND: the command runs when either matches. `30 4 1,15 * 5` therefore runs at 04:30 on the 1st and 15th and every Friday — a genuinely counter-intuitive rule worth memorising precisely. Entries like this are installed through `crontab -e`.

- A is wrong: The two day fields do not combine with AND; treating them that way would make the job run far less often than the five-field syntax specifies.
- B is wrong: Neither day field is ever silently ignored — when both are restricted, both take effect and combine with OR.
- D is wrong: Both restricted day fields take effect together via OR; the day-of-month field is not overridden by the day-of-week field.

### 14.

A crontab entry runs `backup.sh` (a bare command name, no path) and works perfectly when typed by hand at the shell, but silently does nothing on schedule. What is the standard diagnostic first step, and what is usually wrong?

- **A.** Assume the environment: cron does not source shell startup files and supplies a minimal `PATH`, so a bare command name is often not found
- **B.** The crontab syntax must contain a typo in one of the five time fields
- **C.** The job must have been removed by an accidental `crontab -r` — a crontab entry naming a command without an absolute path is rejected and discarded at install time
- **D.** cron jobs cannot execute shell scripts at all, only single binaries

**Answer: A.** The environment a cron job runs in is not the interactive shell's: cron sets a short default `PATH`, does not source `~/.bashrc` or `/etc/profile`, and takes `HOME`/`LOGNAME` from `/etc/passwd`. A bare command name that resolves fine interactively is the classic case that fails silently under cron; the fix is an absolute path or an explicit `PATH=` line in the crontab.

- B is wrong: A typo in the time fields would produce a run at the wrong time or not at all in a way distinguishable from this, but the described symptom — total silence with no output — is the signature of the sparse cron environment, not a scheduling error.
- C is wrong: If the crontab had been removed, `crontab -l` would show it missing entirely; the scenario describes the entry running silently on schedule with no visible effect.
- D is wrong: Cron happily executes shell scripts; the actual obstacle here is that the bare command name cannot be found under cron's minimal `PATH`.

### 15.

An administrator edits `nginx.service` to add `Restart=on-failure`, then runs `systemctl restart nginx`. The new restart policy does not appear to take effect. What is missing?

- **A.** `systemctl daemon-reload` — until it runs, systemd is still acting on the unit definition it parsed earlier, not the edited file
- **B.** Nothing is missing; `restart` always re-reads the unit file before restarting the process
- **C.** The change needed `systemctl reload nginx` instead of `restart` — `reload` is the verb that re-reads the unit file without interrupting the service
- **D.** The unit needed `systemctl enable --now` run again to pick up the change

**Answer: A.** systemd caches parsed unit files, so editing one and then restarting the service still runs against the old cached definition. `systemctl daemon-reload` rescans the unit directories and rebuilds the dependency graph, and only after that does a restart pick up the change.

- B is wrong: A plain restart does not re-parse the unit file — that is specifically what `daemon-reload` does, and skipping it is the whole reason the edit appears to have no effect.
- C is wrong: `reload` asks the running nginx process to re-read its own application configuration. systemctl(1) is explicit that it 'will reload the service-specific configuration, not the unit configuration file of systemd'; only `daemon-reload` does the latter.
- D is wrong: Re-enabling only recreates the boot-time symlink; it does not make the manager re-parse an edited unit file.

### 16.

Three similarly named operations exist: `systemctl daemon-reload`, `systemctl reload nginx`, and `systemctl restart nginx`. Which one re-reads unit files from disk, manager-wide?

- **A.** `systemctl reload nginx`, since "reload" is the word that implies re-reading configuration
- **B.** `systemctl daemon-reload`, which takes no unit argument and rebuilds the dependency graph from every unit file
- **C.** `systemctl restart nginx`, since restarting naturally picks up whatever has changed
- **D.** All three do the same thing at different scopes, so any one of them suffices — `daemon-reload` is simply the variant that applies it to every unit at once

**Answer: B.** `systemctl daemon-reload` takes no unit argument because it is a manager-wide operation: it re-reads every unit file and rebuilds the dependency graph. `reload <unit>` asks one running application to re-read its own configuration, and `restart <unit>` merely stops and starts the process — neither touches the cached unit definitions.

- A is wrong: That command asks the *nginx process itself* to re-read its own application configuration file — it does nothing to systemd's cached unit definitions.
- C is wrong: Restart stops and starts the process using whatever unit definition the manager already has cached; it does not re-parse the unit file.
- D is wrong: They are three genuinely different operations — re-reading unit definitions, asking an application to reload its own configuration, and stopping and starting a process — not scoped variants of one action. `daemon-reload` starts and stops nothing.

### 17.

A user starts a long compilation with `make &` in their SSH session and disconnects without using `nohup`. Is the compilation process a daemon?

- **A.** Yes, any process running in the background without an interactive prompt counts as a daemon
- **B.** Yes, because it was started at the command line rather than by `systemctl` — a command launched from an interactive shell is handed off to PID 1 as soon as the prompt returns
- **C.** No, but only because `make` is a build tool rather than a long-running server
- **D.** No. It is still attached to the terminal session and dies with it; a daemon has no controlling terminal at all

**Answer: D.** A daemon is a long-running background process with no controlling terminal, typically started at boot. A job merely backgrounded with `&` is still attached to its terminal session and, without `nohup` or `disown`, is usually killed when that session ends — it has not detached the way a daemon does.

- A is wrong: Not every background process is a daemon: this one is still attached to a terminal session and is typically killed when that session ends.
- B is wrong: How a process is started does not determine whether it is a daemon; what matters is whether it has detached from a controlling terminal.
- C is wrong: The distinction is about terminal attachment and lifetime, not about what category of program is running.

### 18.

A program was written to detach itself from its terminal on startup — forking, calling `setsid()`, and re-parenting to PID 1 — but has no systemd unit file. Is it a daemon? Is it a service?

- **A.** It is a daemon, because it has detached and runs in the background continuously; it is not a service, because nothing is supervising or restarting it
- **B.** It cannot be a daemon without a unit file, since daemons and services are the same thing under systemd
- **C.** It is both a daemon and a service, since any long-running background process qualifies as a service
- **D.** It is neither, since only systemd-managed processes count as daemons on a modern distribution — the term was retired from Linux terminology when SysV init was replaced

**Answer: A.** A daemon is defined by how it runs — detached from a terminal, long-lived — which this program achieves through the classic double-fork pattern. A service is a management layer on top of that, and without a unit file nothing restarts it or brings it back at boot, so it is a daemon without being a service.

- B is wrong: The two terms are not interchangeable: a program can detach itself perfectly well without any unit file, in which case it is a daemon but not a managed service.
- C is wrong: A service specifically implies a supervision policy — starting, stopping, restarting — which this program has none of without a unit file.
- D is wrong: The classic self-detaching pattern (fork, `setsid()`, re-parent to PID 1) is exactly what makes a process a daemon, with or without systemd managing it.

### 19.

What is a dependency, in the context of installing an OS package?

- **A.** Any package that is merely recommended alongside the one being installed
- **B.** A package that another package requires in order to work, resolved automatically by a repository-aware manager
- **C.** A configuration file the package writes into `/etc` on installation
- **D.** The repository a package was downloaded from — which is what the package's `Depends` field records

**Answer: B.** A dependency is a package another package requires — usually a shared library or helper binary. A repository-aware manager such as `apt` or `dnf` resolves these recursively, which is the single feature that separates it from a single-package tool such as `dpkg` or `rpm`.

- A is wrong: A recommended or suggested package is a softer relationship than a hard dependency; only a hard dependency blocks installation if it is missing.
- C is wrong: A configuration file is a piece of the package's own content, not another package it requires in order to function.
- D is wrong: Where a package came from is a separate concept from what other packages it needs installed alongside it; the `Depends` field names required packages, never a repository.

### 20.

An `/etc/fstab` line references `/dev/sdb1` directly rather than a UUID. After a hardware change, the machine boots with the wrong filesystem mounted at that entry's mount point. Why?

- **A.** `/dev/sdb1` should always refer to the same physical disk once assigned, so this points to a filesystem corruption problem instead
- **B.** Kernel device names are not stable across reboots — which physical disk becomes `/dev/sdb` depends on enumeration order
- **C.** The partition table itself must have become corrupted during the hardware change
- **D.** `/etc/fstab` entries expire after a hardware change and must be manually renewed

**Answer: B.** Kernel device names such as `/dev/sdb` depend on enumeration order at boot and are not guaranteed stable, especially after a hardware change. `/etc/fstab` should reference a UUID rather than a device node for exactly this reason.

- A is wrong: Device names are explicitly not guaranteed stable: fstab(5) states that "device names are often a coincidence of hardware detection order, and can change when other disks are added or removed", and recommends `LABEL=` or `UUID=` instead.
- C is wrong: Nothing about a device name shifting requires partition table corruption; enumeration order alone is sufficient to explain the mismatch.
- D is wrong: Fstab entries do not expire; the actual issue is that the referenced device name no longer points at the intended disk.

### 21.

What is the behavioural difference between reading from `/dev/null` and reading from `/dev/zero`?

- **A.** They behave identically — both are general-purpose discards for anything written to them
- **B.** `/dev/null` is a block device and `/dev/zero` is a character device
- **C.** `/dev/null` returns end-of-file immediately on read; `/dev/zero` returns an endless stream of zero bytes
- **D.** `/dev/zero` requires root to read from, while `/dev/null` does not — the endless stream it produces is treated as a privileged resource and its node is created mode 0600

**Answer: C.** `/dev/null` discards data written to it and returns end-of-file immediately when read, while `/dev/zero` returns an endless stream of zero bytes on read — a common trap for anyone assuming `/dev/null` is a general-purpose discard for every use.

- A is wrong: They agree on write behaviour (both discard input), but they behave very differently on read, which the "general-purpose discard" framing misses.
- B is wrong: Both are character devices; the distinguishing property here is read behaviour, not the block-versus-character classification.
- D is wrong: null(4) shows both nodes created identically and world-accessible — `mknod -m 666 /dev/null c 1 3` and `mknod -m 666 /dev/zero c 1 5` — so neither is restricted to root.

### 22.

`df -h` reports a filesystem at 100% used, but `du -sh` walking the same filesystem from the top totals far less than what `df` reports. What kind of cause does that gap point at?

- **A.** `du` must simply be miscounting, and rerunning it with different flags will resolve the discrepancy
- **B.** A structural cause invisible to `du` — most commonly a deleted file still held open by a running process
- **C.** The filesystem must have run out of inodes rather than blocks — an exhausted inode table is billed to `df` as used space while contributing nothing that `du` can walk to
- **D.** The discrepancy always means the filesystem needs an `fsck` before anything else is checked

**Answer: B.** `df` reports what the filesystem itself has allocated, which includes blocks belonging to files that have been unlinked but are still held open by a running process; `du` walks directory names and cannot see such a file at all, since it has no name left to walk to. That is the classic explanation when `du`'s total falls well short of `df`'s.

- A is wrong: `du` is not miscounting; it fundamentally cannot see certain categories of space, such as a deleted-but-open file, regardless of which flags are used.
- C is wrong: Inode exhaustion shows up in `df -i`, not as inflated block usage in `df -h`; it produces "No space left on device" on new writes while blocks remain free, and does not open a gap between reported used space and a directory walk.
- D is wrong: A structural check is not the standard first response to this specific symptom; `df` and `du` disagreeing has well-known, non-corruption causes to check first.

### 23.

A filesystem reports full. Walk through the correct diagnostic order: what is checked first, second, and third?

- **A.** `df -h` to find which filesystem is full, then `df -i` to rule out inode exhaustion, then `du -sh` descending from the mount point to locate the largest tree
- **B.** `du -sh /` immediately, since it directly finds the largest files on the whole machine in one pass
- **C.** `lsof +L1` first, since deleted-but-open files are always the cause of a full filesystem — every other cause of a full filesystem will already have been reported as an error long before `df` shows 100%
- **D.** `fsck` immediately, since a full filesystem should always be checked for structural damage first

**Answer: A.** The efficient order works outward from the cheapest check: `df -h` identifies which filesystem is full, `df -i` on that filesystem rules in or out inode exhaustion, and only then does `du -sh` descending from the mount point locate the specific directory responsible — checking the three structural causes (unlinked-open file, hidden mount, reserved blocks) if `du`'s total still falls short.

- B is wrong: Running `du` over the entire machine first skips identifying which filesystem is actually affected and wastes time walking filesystems that are not the problem.
- C is wrong: Deleted-but-open files are one possible cause among several, and nothing reports the ordinary ones in advance; checking for them before confirming which filesystem and which resource is full is out of order.
- D is wrong: A full filesystem is not itself evidence of corruption, and running `fsck` first skips the cheap checks that usually explain the symptom directly.

### 24.

On a current Red Hat-family system, an administrator runs `yum install nginx` instead of `dnf install nginx`. What actually happens?

- **A.** An error, since `yum` was removed entirely once `dnf` became the default
- **B.** The equivalent of `dpkg -i` — a single-file install with no dependency resolution
- **C.** The same operation `dnf install` would perform — `yum` is kept as a compatibility name for the same tool
- **D.** A different package management system entirely, unrelated to `dnf` — with its own separate package database that `dnf` cannot read

**Answer: C.** `dnf` is the successor to `yum`, and on current Red Hat-family systems `yum` is retained as a compatibility name for the same tool — a relationship candidates most often get backwards, treating `dnf` as a variant of `yum` rather than the other way round.

- A is wrong: `yum` still works on current systems as a compatibility name; it was not removed, only superseded as the primary name.
- B is wrong: That describes `rpm`, the low-level tool in this family; both `yum` and `dnf` are the repository-aware, dependency-resolving layer.
- D is wrong: `yum` and `dnf` are not unrelated systems; `dnf` is specifically the successor built to replace `yum`, and both operate on the same RPM database — there is no second, yum-only package database.

### 25.

`rpm -q mypackage` reports "package mypackage is not installed," even though the administrator is looking directly at a downloaded `mypackage.rpm` file in the current directory. What is the mistake?

- **A.** `rpm -q` is broken and `dnf` must be used instead for any file-based query, since only `dnf` can read an `.rpm` header directly
- **B.** The `.rpm` file must first be added to a configured repository and indexed with `createrepo` before it can be queried
- **C.** `rpm -ql` should have been used instead of `rpm -q` — the `-l` makes `rpm` look on disk rather than in the database
- **D.** `rpm -q` was given a package *name*, which it looks up in the installed-package database — the file has to be named instead: `rpm -qp mypackage.rpm`

**Answer: D.** `rpm -q` given a bare package *name* looks that name up in the database of installed packages, which is why a package plainly present on disk is reported as "not installed". To query the download itself, name it as a file — `rpm -qp mypackage.rpm`, where `-p` tells `rpm` the argument is a package file to read directly.

- A is wrong: `rpm -q` works correctly for its intended purpose, and it reads package headers directly when pointed at a file; the fix is to name the file, not to switch tools.
- B is wrong: An uninstalled local file can be queried directly with `rpm -q -p`; nothing about querying it requires a repository or a `createrepo` index first.
- C is wrong: `-l` only changes what is listed about whichever package was selected; the selection still comes from the installed-package database when a bare name is given, so `rpm -ql mypackage` shows the identical 'not installed' result.

### 26.

List the six whitespace-separated fields of an `/etc/fstab` line, in order.

- **A.** Device, mount point, mount options, filesystem type, dump flag, and fsck pass order
- **B.** Device, mount point, filesystem type, mount options, dump flag, and fsck pass order
- **C.** Device, mount point, filesystem type, owner, group, and permissions
- **D.** UUID, label, device, mount point, options, and fsck pass order

**Answer: B.** `/etc/fstab` has six positional, unlabelled fields in order: device, mount point, filesystem type, mount options, dump flag, and fsck pass order. Because the fields are positional, a missing options field silently shifts the two numeric fields that follow it.

- A is wrong: This swaps the third and fourth fields — filesystem type comes before mount options, not after.
- C is wrong: An fstab line does not record ownership or permission bits at all; the fifth and sixth fields are the dump flag and the fsck pass order.
- D is wrong: UUID and label are alternative ways of naming the first field (the device), not two separate fields of their own.

### 27.

An `/etc/fstab` entry was just added for a new filesystem. What is the safe way to confirm the line is correct before the next reboot depends on it?

- **A.** Nothing is needed; a malformed `/etc/fstab` entry is safely ignored at boot
- **B.** `findmnt --target`, which shows what is currently mounted at the intended path
- **C.** `blkid`, to regenerate the UUID for the new filesystem before rebooting — an fstab line is only honoured once `blkid` has re-registered the filesystem's identifier
- **D.** `mount -a`, which mounts everything in the file not marked `noauto` and surfaces a syntax error while a shell is still available

**Answer: D.** A malformed or wrong `/etc/fstab` entry can leave the boot process waiting on a device that cannot be found and dropping into emergency mode. `mount -a` applies the file to the running system immediately, surfacing any error while a working shell is still available to fix it.

- A is wrong: A malformed or unsatisfiable entry does not fail quietly — fstab(5) documents the `nofail` option as meaning "do not report errors for this device if it does not exist", which exists precisely because, without it, a bad entry is reported as an error at boot.
- B is wrong: That command reports the running kernel's current mount table, not whether the newly written fstab line itself is syntactically valid.
- C is wrong: `blkid` reports the type, UUID and label of filesystems that already exist; it neither generates identifiers nor validates or applies an fstab entry.

### 28.

How many colon-separated fields does a line in `/etc/group` have, and how does that compare with `/etc/passwd`?

- **A.** Seven fields in both files, since they share the same layout convention
- **B.** The reverse pairing — seven for `/etc/group` and four for `/etc/passwd`
- **C.** Four fields in `/etc/group`, against nine in `/etc/passwd`
- **D.** Four fields in `/etc/group`, against seven in `/etc/passwd`

**Answer: D.** `/etc/group` has four fields — group name, password placeholder, GID, and the comma-separated supplementary member list — against `/etc/passwd`'s seven, because one row describes an entire group rather than a single account's full set of attributes. `getent group` is the NSS-aware way to query a row rather than reading the file directly.

- A is wrong: The two files describe different kinds of row and do not share a field count; `/etc/group` has fewer fields.
- B is wrong: This reverses the actual counts: `/etc/passwd` is the seven-field file describing an account.
- C is wrong: Nine is the field count for `/etc/shadow`, not `/etc/passwd`, which has seven.

### 29.

`getent group developers` lists three members. A fourth user has `developers` as their primary group. Does that user appear in the output?

- **A.** No. The member list in `/etc/group` records supplementary membership only
- **B.** Yes, every member of the group appears in the member list regardless of how they joined it
- **C.** No, because primary group membership is not recorded anywhere on the system
- **D.** Yes, but only after running `groupadd` again to refresh the membership list

**Answer: A.** The fourth field of `/etc/group` is the supplementary member list only. A user whose primary group is `developers` is recorded on their own `/etc/passwd` row, not in `/etc/group`, so answering "who is in this group" completely requires reading both files.

- B is wrong: The field only ever lists supplementary members; anyone whose primary group this is will be missing from it.
- C is wrong: It is recorded — in field four of that user's `/etc/passwd` row — just not in `/etc/group`'s member list.
- D is wrong: `groupadd` creates a group; it does not recompute or refresh any membership list.

### 30.

Counting the colon-separated fields of a line in `/etc/passwd` in order, which field is the login shell?

- **A.** The seventh and last field
- **B.** The sixth field, since the password placeholder is usually skipped when counting
- **C.** The fourth field, the same position as the primary GID
- **D.** It is not in `/etc/passwd` at all — login shells are recorded only in `/etc/shadow`

**Answer: A.** `/etc/passwd` has seven fields: username, password placeholder (x), UID, GID, comment/GECOS, home directory, and login shell. The placeholder is the field most often dropped when counting by memory, which shifts every later field. `getent passwd` is the NSS-aware way to look up a row without opening the file directly.

- B is wrong: The placeholder field is easy to forget, but it is still field two — omitting it miscounts everything after it by one.
- C is wrong: The fourth field is the primary GID; the login shell comes three fields later.
- D is wrong: `/etc/shadow` holds password hashes and ageing data, not the login shell, which lives in `/etc/passwd`.

### 31.

An administrator runs `getent passwd alice` and sees `x` in the second field. What does that field actually hold today?

- **A.** The account's password hash, still stored here as the field name suggests
- **B.** The number of days until the password expires — the field was repurposed for ageing data once the hashes themselves moved out to `/etc/shadow`
- **C.** The account's primary GID, encoded as the letter `x`
- **D.** Nothing usable — it is a placeholder, and the real password hash lives in `/etc/shadow`

**Answer: D.** `/etc/passwd` is world-readable, so it cannot safely hold a password hash; the second field is a placeholder (`x` on most systems) pointing administrators at `/etc/shadow`, which is not world-readable and holds the real hash.

- A is wrong: Despite the field's name, the hash has not lived in `/etc/passwd` for decades — it is world-readable, which a hash cannot safely be.
- B is wrong: Expiry is tracked in `/etc/shadow`'s ageing fields, not in this world-readable file.
- C is wrong: The GID is the next field over and is always numeric, not the placeholder character.

### 32.

A Debian-family server and a Red Hat-family server both protect `/etc/shadow` from ordinary users, but by different means. What are the two modes?

- **A.** `0644 root:root` on every distribution, since the file only needs to block writes
- **B.** `0640 root:shadow` on Debian-family systems, and `0000 root:root` on Red Hat-family systems
- **C.** `0600 root:root` universally, matching the private key convention
- **D.** `0640 shadow:root` on both families, with the group and owner reversed from the Debian scheme

**Answer: B.** Exact permissions are distribution-specific: Debian-family systems ship `/etc/shadow` as `0640 root:shadow` so the `shadow` group can read it, while Red Hat-family systems ship it `0000 root:root`, relying on root bypassing permission checks entirely. Neither figure should be stated as universal. `chage` is the tool for reading or changing the ageing fields this file holds.

- A is wrong: That mode would leave the file world-readable, exposing every password hash — exactly what shadowing exists to prevent.
- C is wrong: The two families do not converge on one mode; the permissions genuinely differ by family, which is the point being tested.
- D is wrong: This reverses the actual Debian-family ownership, where `root` owns the file and `shadow` is the readable group.

### 33.

An administrator wants to force `bob` to pick a new password the next time he logs in, without disabling his account. Which change to `/etc/shadow` fields does that, and which command applies it?

- **A.** Set the last-change field to `0` with `chage -d 0 bob`
- **B.** Set the account expiry date with `chage -E`
- **C.** Edit `/etc/passwd` to clear the login shell field
- **D.** Lock the account with `usermod -L`, which forces a password reset on next login

**Answer: A.** `/etc/shadow` records the date of last password change as days since the epoch, and setting that field to `0` is the documented way to force a change at next login; `chage -d 0` sets it. Locking the account or setting an expiry date achieves a different outcome.

- B is wrong: An expiry date disables the account outright once reached, rather than merely prompting for a new password.
- C is wrong: The login shell controls what runs at login, not whether a password change is required — and it is the wrong file for ageing data.
- D is wrong: Locking prefixes the stored hash with `!` so no password matches at all — it prevents login rather than prompting for a new password.

### 34.

Why does `visudo` exist instead of editing `/etc/sudoers` with a normal text editor?

- **A.** It is only a convenience wrapper that opens the file in a nicer editor with syntax highlighting
- **B.** It encrypts the sudoers file so its contents cannot be read by anyone but root — the plaintext is decrypted into memory only while `sudo` evaluates the policy
- **C.** It is required because `/etc/sudoers` cannot otherwise be opened by any editor
- **D.** It validates the syntax before installing the file, so a mistake cannot lock every administrator out of privilege escalation at once

**Answer: D.** `visudo` locks the file against simultaneous edits, runs an editor, then parses the result and refuses to install it if there is a syntax error — printing the offending line and offering to re-edit. A plain editor has no such check, and a broken sudoers file makes `sudo` refuse its entire policy for everyone.

- A is wrong: The validation step is the substantive purpose; a plain editor with highlighting would still allow an unparseable file to be saved and installed.
- B is wrong: Sudoers is a plain-text policy file; `visudo`'s role is validating syntax, not encrypting the file's contents.
- C is wrong: The file can be opened by any editor; nothing technically prevents that. The reason to avoid it is the lack of a safety check before saving.

### 35.

`sudo` has stopped working for every user on a server after a configuration change earlier today. What is the diagnostic order for recovering, starting from a surviving root session?

- **A.** Run `visudo -c` to see whether the main file parses, then check every drop-in under `/etc/sudoers.d/`, since a broken drop-in produces the same symptom
- **B.** Delete `/etc/sudoers` and let the package manager regenerate a default copy — the sudo package's post-install script reinstalls a known-good policy whenever the file is missing
- **C.** Reboot the server, since a sudoers problem is always resolved by a fresh boot
- **D.** Run `chmod 777 /etc/sudoers` so every user can bypass the broken policy temporarily

**Answer: A.** A file that fails to parse is not partially applied — `sudo` refuses the whole policy, not just the broken line. From a surviving root session, `visudo -c` checks the main file, and because `visudo -c` also validates included files, checking `/etc/sudoers.d/` next catches a broken drop-in with the same symptom.

- B is wrong: Deleting the policy file removes the ability to reason about what changed and is far more destructive than checking syntax with `visudo -c` first.
- C is wrong: Rebooting does not repair a syntax error in a text file; the broken policy would still be in force after restart.
- D is wrong: Opening the file to everyone is both unsafe and beside the point — `sudo` refuses a policy that fails to parse regardless of who can read it.

### 36.

Which directory holds host-specific system configuration, and what does the FHS say may never be placed there?

- **A.** `/etc`, and log files, since logging is considered configuration data
- **B.** `/etc`, and binaries — the FHS is explicit that `/etc` holds settings, not the programs that read them
- **C.** `/var`, and binaries, since `/var` is also host-specific
- **D.** `/usr/local/etc`, and configuration files themselves — since FHS 3.0 moved system-wide configuration out of `/etc` and into that tree

**Answer: B.** `/etc` holds host-specific configuration, and by FHS convention its contents are editable text files — no binaries belong there. Nearly every configuration file this competency names, from `/etc/passwd` to `/etc/systemd/system`, lives under this directory precisely because of that classification.

- A is wrong: Log files belong under `/var/log`, since they are variable data that grows at runtime — a different classification from `/etc`'s static configuration.
- C is wrong: `/var` is unshareable and variable, holding logs and runtime state, not the static configuration that `/etc` holds.
- D is wrong: FHS 3.0 still defines `/etc` as host-specific system configuration and it is exactly configuration files that belong there; `/usr/local/etc` is defined only as host-specific configuration for locally installed binaries, not as a replacement for `/etc`.

### 37.

Someone asks "what filesystem does the FHS use?" What is wrong with the question?

- **A.** Nothing is wrong; the FHS is a specific on-disk format like ext4 or XFS — the one the Linux Foundation defines as the default for the root partition
- **B.** The FHS is not a filesystem at all; it is a convention for what each directory means, not an on-disk format
- **C.** The question is fine, and the answer is whichever filesystem type the root partition uses
- **D.** The question is fine, and the answer is `tmpfs`, since that is what most FHS directories use

**Answer: B.** The Filesystem Hierarchy Standard is a naming convention — what `/etc`, `/var`, `/usr` and the rest are for — not an on-disk format. Filesystem type (ext4, XFS, Btrfs, and so on) is the entirely separate concept that determines journaling, block size and maximum file size.

- A is wrong: The FHS says nothing about journaling, block size, or maximum file size — those are properties of a filesystem type, a distinct concept that happens to share the word "filesystem" — and it defines no on-disk format at all, default or otherwise.
- C is wrong: The FHS applies identically regardless of which on-disk format is chosen underneath it; the two are independent concepts sharing a name.
- D is wrong: Most FHS-defined directories sit on whatever the administrator chose at `mkfs` time, not universally on `tmpfs`.

### 38.

A team is choosing where to install software they compiled themselves, separate from anything the distribution's package manager owns. Which directory is the standard place, and why not `/usr/bin`?

- **A.** `/usr/bin`, since that is simply where all executables belong regardless of who built them
- **B.** `/opt`, since any third-party software belongs there by convention
- **C.** `/usr/local`, because the package manager owns everything under `/usr` except that subtree
- **D.** `/var/local`, since locally built software is variable data

**Answer: C.** The FHS reserves `/usr/local` as the parallel tree for software the local administrator builds and installs, kept separate from everything the package manager owns under `/usr`. `/opt` is the related but distinct convention for self-contained third-party packages with their own tree.

- A is wrong: The package manager treats everything under `/usr/bin` as its own; placing locally compiled software there risks it being overwritten by the next package update.
- B is wrong: `/opt` is for self-contained third-party packages that keep their own directory tree, a different pattern from software built to install into the normal hierarchy.
- D is wrong: Locally compiled software is static once installed, not data that grows at runtime, so it does not belong under `/var`.

### 39.

A team plans to grow a filesystem while it stays mounted, and possibly shrink it later. Between ext4 and XFS, which choice keeps the shrink option open?

- **A.** ext4, since `resize2fs` can shrink it, though only while unmounted; XFS is designed to be grown online and offers no general way to shrink
- **B.** XFS, since it is the more modern of the two and therefore supports every resize operation
- **C.** Either — resizing capability is governed by the Filesystem Hierarchy Standard, not by the filesystem type
- **D.** Neither, since resizing any mounted Linux filesystem always requires reformatting first

**Answer: A.** Filesystem type determines resizing capability directly: XFS can be grown while mounted but cannot be shrunk at all, while ext4 can be shrunk, but only while unmounted. A plan that assumes "we will resize it later" is only safe once the type is known — created with `mkfs` and confirmed afterward with `blkid`.

- B is wrong: Being more modern does not imply broader capability here — xfs_growfs(8) expands a mounted filesystem, and the only shrink it implements is the narrow last-allocation-group case, so XFS cannot be relied on to shrink.
- C is wrong: Resize capability is a property of the on-disk format itself, which is exactly what filesystem type governs; the FHS says nothing about it.
- D is wrong: `resize2fs` shrinks an unmounted ext4 filesystem in place, so reformatting is not the only route to a smaller filesystem.

### 40.

Files copied onto a USB stick formatted vFAT come back with different Unix ownership and permission bits than they had on the source filesystem. Is this a `chmod` failure?

- **A.** Yes, `chmod` must have been run incorrectly before the files were copied — vFAT copies the source mode bits verbatim into each directory entry's attribute byte, so a bad source mode is what shows up afterwards
- **B.** No, but only because the FHS forbids storing permissions on removable media
- **C.** Yes, and re-running `chown` and `chmod` on the USB stick will make the change permanent
- **D.** No — vFAT stores no Unix ownership or permission bits at all, so what is shown afterward comes entirely from the mount options

**Answer: D.** vFAT stores no Unix ownership or permission bits, so files copied onto it come back with whatever the mount options dictate rather than what they had on the source filesystem — a data-loss-looking surprise that is really a property of the destination filesystem type, not a `chmod` mistake.

- A is wrong: vFAT has no on-disk representation for Unix ownership or permission bits at all, so no `chmod` mistake is needed to produce this result; mount(8) documents `uid=`, `gid=` and `umask=` as the options that set them for every file on the mount.
- B is wrong: The FHS governs directory layout and says nothing about what any given filesystem type can store; the limitation here is intrinsic to the vFAT format.
- C is wrong: Because vFAT has nowhere to store Unix ownership, any such change would not persist across a remount either.

### 41.

A long-running job is started interactively in the foreground of an SSH session and then suspended with Ctrl-Z. Which two commands move it to the background and later bring it back?

- **A.** `nohup` to resume it in the background, since it is designed to keep a job running
- **B.** `bg` to resume it in the background, and `fg` to bring it back to the foreground later
- **C.** `jobs` to resume it in the background, and `kill` to bring it back — `jobs` restarts the most recently stopped job whenever it is invoked with no arguments
- **D.** Pressing Ctrl-C to resume it, then Ctrl-Z again to bring it forward

**Answer: B.** Ctrl-Z suspends the foreground job with SIGTSTP. `bg` sends SIGCONT and lets it continue running in the background under a job number such as `%1`; `fg` later brings that same job back to the foreground and reattaches the terminal.

- A is wrong: `nohup` only makes a process immune to the hangup signal; it does not resume a job that Ctrl-Z has stopped, and it does not background anything by itself.
- C is wrong: `jobs` only lists the current jobs; it does not change any job's state, and `kill` sends a signal rather than restoring foreground attachment.
- D is wrong: Ctrl-C sends SIGINT, which typically terminates the job rather than resuming a stopped one; Ctrl-Z only ever suspends.

### 42.

A job was started with `./long-job.sh &` over SSH and the connection later drops. The job dies along with it, even though `&` was used. What was missing?

- **A.** `nohup`, so the job is immune to the SIGHUP sent when the terminal closes
- **B.** Nothing was missing; `&` alone is sufficient to survive a dropped connection
- **C.** The job should have been started with `renice` instead of `&`
- **D.** The job needed to be registered as a systemd unit, since only PID 1 can hold a process open across a dropped connection — an unprivileged shell has no way to hand a running job off to anything that outlives it

**Answer: A.** `&` returns the prompt but the job is still the terminal session's child, so the SIGHUP sent on hangup is usually forwarded to it and kills it. `nohup` makes the command immune to that specific signal, which is the missing half of surviving a dropped SSH session.

- B is wrong: Backgrounding with `&` returns the prompt but leaves the job still attached to the shell, which is exactly what a hangup signal on disconnect can kill.
- C is wrong: `renice` adjusts scheduling priority for an already-running process; it has no bearing on whether a job survives a terminal hangup.
- D is wrong: An ordinary user keeps a background job alive across a hangup with `nohup` or `disown`; nothing about surviving SIGHUP requires the service manager or PID 1.

### 43.

A new hire needs to read and write files shared by the `developers` team without gaining a separate login of their own. Which two concepts does the fix combine?

- **A.** A second user account named `developers`, sharing its UID with every team member
- **B.** A service account created for the `developers` team so nobody needs an interactive login
- **C.** A `sudoers` rule granting the new hire root on the shared files — `/etc/sudoers` is where per-directory sharing grants are recorded, so no group is needed
- **D.** A group named `developers`, granting the permission once, and the user account being added as a member of it

**Answer: D.** A group is a named collection of users used to grant a permission once to many accounts, so the resolution is a `developers` group with the new account added as a member, rather than a new personal account or blanket root access. Membership can be confirmed afterward with `groups`.

- A is wrong: A user account is one named identity with one UID; it is not how membership in a team is modelled.
- B is wrong: A service account exists to run a daemon, not to give a person shared access to files.
- C is wrong: Root access is far broader than the stated need and bypasses the ordinary permission model rather than using it.

### 44.

An administrator needs to create a `deploy` group, remove an old `contractors` group that is no longer needed, and add an existing user to `deploy` without disturbing any group memberships that user already has. Which three commands do this?

- **A.** The same two group commands, but dropping the `a` so it reads `usermod -G deploy alice`
- **B.** Reaching for the account-management pair `useradd deploy` and `userdel contractors` before the same `usermod -aG` step
- **C.** `groupadd deploy`, `groupdel contractors`, and `usermod -aG deploy alice`
- **D.** Lower-casing the last step to `usermod -g deploy alice` while keeping the two group commands as written

**Answer: C.** `groupadd` and `groupdel` create and remove groups, and `usermod -aG` appends a supplementary group to an account without touching its existing memberships — the destructive alternative is `-G` alone, which replaces the whole list.

- A is wrong: Without `-a`, `-G` replaces the entire supplementary group list, which can silently drop every other group `alice` belonged to.
- B is wrong: Those commands create and remove user accounts rather than groups, so nothing about `deploy` or `contractors` as groups is actually built or removed.
- D is wrong: Lowercase `-g` replaces the primary group entirely rather than adding a supplementary one, which is a different change than asked for.

### 45.

A file has one hard link and one symbolic link pointing at it. The hard-linked name is deleted. What happens to the file's data, and what happens to the symlink?

- **A.** The data is deleted immediately, and the symlink becomes dangling — removing any name for a file releases its blocks at once, whatever the link count still says
- **B.** The data survives, but the symlink is automatically updated to point at the remaining name
- **C.** Both the data and the symlink are deleted together, since they share the same inode
- **D.** The data survives, since the inode's link count merely drops by one; the symlink still resolves through the surviving name

**Answer: D.** A hard link is an additional directory entry pointing at an existing inode, so deleting one name only decrements that inode's link count; the data survives as long as the count has not reached zero. The symlink, holding its own separate path, keeps working through whichever original name still resolves.

- A is wrong: unlink(2) states the file is deleted only if the removed name was the last link to it and no process still has it open; while another name survives, the data is untouched.
- B is wrong: A symlink stores a fixed path string; nothing about deleting a hard link causes the symlink's stored target to be rewritten.
- C is wrong: A symlink has its own separate inode holding a path string; it does not share an inode with the file it points to.

### 46.

A backup script tries `ln /data/report.csv /backup/report.csv` across two different mounted filesystems, and it fails. Switching to `ln -s` succeeds. Why the difference?

- **A.** `ln` is simply broken for this use case and `ln -s` should always be preferred instead
- **B.** A hard link refers to an inode number, meaningful only within one filesystem, so it cannot cross a filesystem boundary; a symlink stores a path and has no such restriction
- **C.** The destination directory must not have existed yet, which only `ln -s` tolerates
- **D.** `/backup` must be a read-only mount, which blocks `ln` but not `ln -s` — a symbolic link is recorded in the source directory rather than the destination, so a read-only target never comes into it

**Answer: B.** A hard link is a reference to an inode number, and inode numbers are meaningful only within one filesystem, so `ln` refuses to create one across a filesystem boundary. A symbolic link stores a path string instead and has no such restriction, which is why `ln -s` succeeds where `ln` does not.

- A is wrong: `ln` works correctly within a single filesystem; the failure here is specifically the cross-filesystem restriction, not a general defect.
- C is wrong: Nothing in the scenario indicates a missing destination directory; the described failure is the standard cross-filesystem restriction on hard links.
- D is wrong: Both link types create a new entry in the destination directory, so a read-only `/backup` would fail for `ln -s` just as readily; the failure described is link(2)'s EXDEV, raised when the two paths are not on the same mounted filesystem.

### 47.

Where is the superuser's home directory, and why does the FHS keep it separate from `/home`?

- **A.** `/home/root`, the same convention every other account follows — the FHS reserves a numbered subdirectory of `/home` for UID 0 exactly as it does for every other account
- **B.** `/usr/root`, since root is considered part of the shareable, static hierarchy
- **C.** `/root`, kept outside `/home` so the system does not need a fallback default if `/home` — often a separate partition — fails to mount
- **D.** There is no dedicated home directory for root; it uses `/` directly

**Answer: C.** Root's home directory is `/root`, a separate optional directory kept outside `/home`. The FHS's stated rationale is that if root's home were not stored on the root partition, the system would need a fallback default in case that location could not be found — exactly the risk `/home` carries when mounted from a separate partition that fails to come up.

- A is wrong: The FHS gives the root account its own top-level directory, section 3.14 `/root`, and reserves no subdirectory of `/home` for UID 0.
- B is wrong: FHS 4.1 states that `/usr` is shareable, read-only data that "must not be written to", which rules out any account's home directory — a place its owner writes to — being located there.
- D is wrong: Root has its own dedicated home directory, `/root`, distinct from the filesystem root `/`.

### 48.

`df -h` reports a filesystem is only half full, but creating a new file on it fails with "No space left on device." What should be checked next, and why?

- **A.** Nothing further is needed; `df -h` already proves there is no real problem and the error is spurious
- **B.** `du -sh`, to find which directory is consuming the most space
- **C.** `df -i`, since the filesystem may have exhausted its inode table while data blocks remain free
- **D.** `ls -i`, to confirm two files are not accidentally hard-linked together

**Answer: C.** The number of inodes on a filesystem is normally fixed at creation time, so a filesystem holding many tiny files can exhaust its inode table while gigabytes of data blocks remain free. `df -i` reports inode usage directly, and it is the standard next check when `df -h` shows space but writes still fail.

- A is wrong: The error is real — it just is not about blocks. Inode exhaustion is a distinct, common cause that block-usage figures alone cannot reveal.
- B is wrong: `du` totals file sizes, which is the wrong lens when the filesystem still has free space by that measure; the symptom described points at the inode table instead.
- D is wrong: Checking for shared inodes between two specific files does not explain a filesystem-wide inability to create any new file.

### 49.

Two directory entries have the same size, the same modification time, and the same content. What single check confirms they are actually the same file rather than two coincidentally identical copies?

- **A.** Comparing their inode numbers with `ls -i`, where the same number means the same underlying file
- **B.** Comparing their filenames, since identical filenames always indicate the same underlying file
- **C.** Comparing their permission bits with `ls -l`, since identical permissions confirm identity
- **D.** Comparing their paths with `findmnt`, since files on the same filesystem must be identical if their paths resolve similarly

**Answer: A.** The inode holds everything the filesystem knows about a file except its name; a directory entry is just a mapping from a name to an inode number. Two names sharing the same inode number, as reported by `ls -i`, are provably the same file rather than two files that merely look alike.

- B is wrong: A filename is only a directory entry pointing at an inode; two different files in different directories can easily share a name without being the same file.
- C is wrong: Two entirely separate files can easily share identical permission bits by coincidence; that says nothing about whether they are the same underlying file.
- D is wrong: `findmnt` reports on mounted filesystems, not on individual file identity, and nothing about path similarity establishes that two entries share an inode.

### 50.

After a crash, `journalctl -b -1` returns nothing at all, as if the previous boot never happened. What is the most likely explanation, and what confirms it?

- **A.** `journalctl` itself must be malfunctioning, since a crash should always leave some trace
- **B.** The messages must be in `/var/log/syslog` instead, since journald never captures kernel or crash messages
- **C.** `-b -1` is the wrong syntax and should instead be `-b 1` to see the previous boot — journalctl numbers boots forward from the first one ever recorded and rejects negative offsets outright
- **D.** The journal is volatile: without `/var/log/journal` existing, it lives under `/run` and is discarded at every reboot; `journalctl --list-boots` confirms what is retained

**Answer: D.** The journal is persistent only if `/var/log/journal` exists; otherwise it lives in `/run/log/journal`, which is memory-backed and discarded at every reboot. `journalctl --list-boots` shows what is actually retained, and if nothing is, that absence is itself the finding — enabling persistent storage is the first remediation.

- A is wrong: The tool is working correctly; an empty result for the previous boot is the expected behaviour of a volatile, non-persistent journal, not a fault in `journalctl`.
- B is wrong: journald does capture kernel and crash-time messages when persistent storage exists; the issue here is that persistence was never configured at all.
- C is wrong: `-b -1` is the correct syntax for the boot before the current one; the empty result is a persistence problem, not a syntax error.

### 51.

A service will not start. What is the diagnostic order across `systemctl status`, `journalctl -u <unit> -b`, and `journalctl -p err -b`?

- **A.** `journalctl -p err -b` first, since severity filtering always finds the root cause fastest regardless of scope, and narrows to the failing unit by itself
- **B.** `journalctl -u <unit> -f` first, to watch it fail live before checking anything else — `-f` replays everything the unit logged during this boot and only then begins following new entries as they arrive
- **C.** `systemctl status <unit>` for the last few lines and exit status, then `journalctl -u <unit> -b` for everything that unit logged this boot, then `journalctl -p err -b` to widen the search to any failing dependency
- **D.** `journalctl -p err -b` alone is sufficient, and the other two commands add nothing a severity-wide sweep of the current boot has not already surfaced

**Answer: C.** `systemctl status <unit>` gives the fastest read — the last few lines and exit status. `journalctl -u` narrowed to the unit and `journalctl -b` narrowed to this boot together widen to everything that unit logged this boot. `journalctl -p err` widens further still, to catch a dependency that failed first and is the real cause; `journalctl -f` is the live-following variant used while reproducing a fault in real time.

- A is wrong: Starting with a system-wide severity filter skips the fastest, most direct signal — the unit's own status and its own log entries — which usually explains the failure on its own.
- B is wrong: Following live only helps while reproducing the failure in real time; the described scenario is investigating a failure that has already occurred, for which status and boot logs come first.
- D is wrong: A severity-wide filter can miss a failure logged at a lower severity or buried among many other units' errors; the unit-specific commands narrow the search far more directly.

### 52.

A kernel package was installed an hour ago. What does `uname -r` report right now, and when does that change?

- **A.** The previously running kernel version — installing a package changes what is on disk, not what is running, until the machine reboots
- **B.** The newly installed kernel version, since installation immediately updates the running kernel
- **C.** The distribution release rather than any kernel version, since `uname -r` reports OS release information
- **D.** An error, since two kernel versions cannot coexist on disk at the same time — installing a new kernel package overwrites the previous image and its module directory

**Answer: A.** Installing a kernel package changes what is on disk — a new image under `/boot` and new modules under `/lib/modules/<version>/` — but not what is currently running. `uname -r` continues to report the previously booted kernel until the machine actually reboots into the new one.

- B is wrong: Installing a kernel package changes files under `/boot` and `/lib/modules`; it does not swap the kernel actually running in memory until the next reboot.
- C is wrong: `uname -r` reports the kernel release specifically; the distribution release is reported separately by `/etc/os-release`.
- D is wrong: Multiple kernel versions coexisting on disk is normal and expected — each has its own image and module directory, selectable from the bootloader menu.

### 53.

A server does not come back after a kernel upgrade and reboot: the GRUB menu appears and the kernel prints messages before the process stops, with no login prompt ever appearing. Which stage does that narrow the fault to?

- **A.** After the kernel starts and before the init system finishes — the initramfs, the root filesystem, or a failing unit, rather than firmware or the bootloader
- **B.** Firmware or the bootloader, since any boot failure should be treated as a firmware problem first
- **C.** The package manager's database, since a kernel upgrade updates package metadata
- **D.** UEFI Secure Boot, since an upgraded kernel is unsigned by default — signature verification runs only once the kernel begins starting userspace, which is exactly where this boot stopped

**Answer: A.** Knowing the stage order makes a boot failure diagnosable: the GRUB menu appearing rules out firmware and the bootloader, and kernel messages appearing before a stall rules out the kernel failing to start at all, narrowing the fault to the initramfs, the root filesystem, or an init-system unit — after which selecting the previous kernel is the standard first recovery step.

- B is wrong: The GRUB menu appearing and the kernel printing messages both demonstrate firmware and the bootloader worked correctly; the fault lies later in the sequence.
- C is wrong: A corrupted package database would not produce this specific symptom of the kernel printing messages and then stopping before a login prompt.
- D is wrong: A Secure Boot signature failure would typically prevent the kernel from starting at all, not let it print messages and then stall partway through initialisation.

### 54.

A huge log file is deleted by hand to free disk space, but `df -h` still reports the filesystem as full afterward. Why, and what is the correct long-term fix?

- **A.** The daemon still has the file open, so its blocks stay allocated until the descriptor closes; the fix is scheduled log rotation, not manual deletion
- **B.** `df -h` is simply slow to update and will reflect the freed space after a short wait
- **C.** The log must actually be compressed already, which is why deleting it did not free space
- **D.** The filesystem must have run out of inodes rather than blocks — removing one very large file frees the blocks it occupied but never releases the inode that indexed them

**Answer: A.** Removing a file a daemon still has open frees no space at all until that descriptor closes, which is exactly the `df`/`du` discrepancy this concept explains. The durable fix is configuring log rotation so files never grow unbounded in the first place, rather than deleting a huge log after the fact.

- B is wrong: The reported figure will not change on its own; the blocks remain allocated as long as the daemon keeps the deleted file's descriptor open, however long that is.
- C is wrong: Compression status has nothing to do with whether deleting the file frees its blocks; the cause here is an open file descriptor held by a running process.
- D is wrong: Inode exhaustion produces a distinct "No space left" symptom with free blocks still showing; this scenario describes blocks that remain allocated, consistent with a held-open deleted file.

### 55.

A daemon cannot be signalled to reopen its log file after rotation, but the log still must not grow unbounded. Which `logrotate` directive fits, and what is its cost?

- **A.** `postrotate`, since it is the directive used whenever a daemon cannot be signalled — the script it runs swaps the daemon's open file descriptor from outside the process
- **B.** `copytruncate`, which copies the log aside and truncates the original in place — at the cost of losing whatever is written between the copy and the truncate
- **C.** `compress`, since compressing the rotated file avoids needing to signal the daemon at all
- **D.** `delaycompress`, which defers the problem to the next rotation cycle instead of solving it

**Answer: B.** `copytruncate` copies the log's contents aside and truncates the original file in place, so a daemon that cannot be signalled keeps writing to the same inode without interruption — at the cost of losing anything written in the brief window between the copy and the truncate.

- A is wrong: A `postrotate` script is exactly the mechanism used to signal a daemon; it is the wrong choice for a daemon that specifically cannot be signalled.
- C is wrong: Compression controls whether old generations are stored compressed; it has no bearing on whether the daemon needs to be told to reopen its log file.
- D is wrong: logrotate(8) presents `delaycompress` as a way to avoid compressing a file a program may still be writing to; it changes only when compression happens, and leaves the daemon writing to the renamed file, so the new log stays empty and the old one keeps growing.

### 56.

An account must own a set of files and be usable as the identity a backup script runs under, but must never be usable to log in interactively. Which change accomplishes that?

- **A.** Lock the account's password with `passwd -l`
- **B.** Delete the account's entry from `/etc/shadow`
- **C.** Set the account's UID to a value above 60000
- **D.** Set its login shell to `/usr/sbin/nologin`

**Answer: D.** The login shell is the program started at login, and setting it to `/usr/sbin/nologin` is the standard way to create an account that owns files and can be used to run scheduled work but cannot be used to log in interactively. `chsh` is the ordinary command for changing which shell an account uses.

- A is wrong: Locking blocks password authentication specifically, but key-based or other authentication methods can still start an interactive shell.
- B is wrong: Removing the shadow row breaks password authentication entirely and leaves the account in an inconsistent, unsupported state.
- C is wrong: A high UID is a convention for distinguishing service accounts visually; it has no effect on whether login is possible.

### 57.

A service account's login shell was changed to `/usr/sbin/nologin` last week. Its SSH key is still listed in `authorized_keys`, and an operator runs `ssh svc@host 'systemctl status app'`. What happens?

- **A.** The command runs normally — `sshd` executes a single non-interactive remote command directly rather than through the account's login shell
- **B.** The connection is refused at authentication, because setting a nologin shell automatically revoked the account's authorised keys
- **C.** The command does not run, because `sshd` starts it through the account's login shell and `nologin` ignores shell options such as `-c`
- **D.** The command runs, because `nologin` takes effect only for accounts with a UID of 1000 or above

**Answer: C.** A nologin shell is not an account lock — it does not remove authorised keys, and key authentication still succeeds — but it is not limited to interactive sessions either. `sshd` runs a non-interactive remote command by invoking the account's login shell with `-c`, and `nologin` ignores those shell options and exits 1, so the command never runs. Restoring a real shell restores both paths at once, which is why the shell field and the key file must be reasoned about separately.

- A is wrong: A non-interactive command is handed to the account's login shell too, which is precisely why a nologin shell stops it.
- B is wrong: Changing the login shell does not touch `authorized_keys` at all; the key is still accepted, and the refusal comes later, from the shell.
- D is wrong: The nologin shell applies to whatever account it is set on; the UID range is a naming convention with no bearing on it.

### 58.

What advantage does an LVM logical volume have over a plain disk partition, which is the reason it is worth recognising for this exam?

- **A.** It is faster than a plain partition for every kind of workload — the device-mapper layer coalesces I/O so that every access path is shorter than on a raw partition
- **B.** It automatically protects data against drive failure, the way RAID does
- **C.** It can be resized and can span more than one physical disk, which a plain partition cannot do
- **D.** It removes the need for a filesystem to be created on top of it

**Answer: C.** LVM pools physical volumes into a volume group, from which logical volumes are carved out. Its one selling point over a bare partition is that a logical volume can later be grown, shrunk, or moved across several physical disks — recognition of that three-layer vocabulary (PV, VG, LV) is the LFCA-level expectation, summarised respectively by `pvs`, `vgs` and `lvs`.

- A is wrong: LVM adds a device-mapper abstraction for flexibility; lvm(8) presents it as providing capabilities beyond the physical devices, not as making storage faster, and speed is not the property being tested here.
- B is wrong: Redundancy against drive failure is what RAID provides; LVM by itself is about flexible sizing and pooling, not fault tolerance.
- D is wrong: A logical volume still needs a filesystem created on it with `mkfs`, exactly like a plain partition would.

### 59.

An administrator runs `mount /dev/sdb1 /srv/data`, but `/srv/data` already contained files. What happens to those pre-existing files?

- **A.** They are permanently deleted, since the mount overwrites the directory
- **B.** They are merged with the new filesystem's contents, showing both sets of files together
- **C.** Nothing changes, because a partition must be formatted before `mount` will do anything at all
- **D.** They are hidden for as long as the mount lasts, not merged and not deleted

**Answer: D.** Mounting attaches a filesystem into the tree at a chosen mount point. Any files that already existed at that path are hidden for as long as the mount lasts — neither merged nor deleted — and reappear once the filesystem is unmounted, which is the usual explanation for space or files that seem to have disappeared. `findmnt` reads the kernel's own view of what is currently mounted, rather than `/etc/fstab`'s stated intent.

- A is wrong: Nothing is deleted — the original contents still exist on the underlying filesystem and reappear as soon as the mount is undone.
- B is wrong: Mounting does not merge directory contents; it entirely obscures the mount point's previous contents for the duration of the mount.
- C is wrong: `/dev/sdb1` is presumed already formatted here, and even if it were not, that would produce an error rather than leaving the pre-existing files visible.

### 60.

`umount /mnt/data` fails with "target is busy." What is the correct next step, as opposed to reaching for `umount -l`?

- **A.** `umount -l` is always the correct fix for a busy target, since it forces the unmount immediately
- **B.** Use `lsof` or `fuser` to find the process holding the filesystem open, and stop or redirect it before unmounting
- **C.** Reformat the filesystem, since "busy" indicates it is corrupted — `umount` reports a target as busy only after its superblock consistency check fails
- **D.** Reboot the machine, since a busy mount cannot be resolved without a restart

**Answer: B.** `umount` fails with "target is busy" while any process holds a file open on that filesystem or has its working directory inside it. `lsof` or `fuser` names the offending process, which should be addressed directly rather than using `-l` (lazy unmount) to paper over the underlying cause.

- A is wrong: umount(8) describes `-l` as detaching the filesystem now and cleaning up references only once it is no longer busy, and warns that a reboot may be needed afterwards — it defers the problem rather than identifying the process causing it.
- C is wrong: umount(8) attributes a busy target to ordinary conditions — open files on the filesystem, a process whose working directory is there, or a swap file in use — with no consistency check involved and nothing implied about corruption.
- D is wrong: Identifying and stopping the process holding the mount open resolves this without any reboot being necessary.

### 61.

A file is `-rw-r-----`, owned by `alice` and belonging to group `staff`, of which `alice` is also a member. Can `alice` write to it?

- **A.** No, because being a member of the owning group means the more restrictive group bits apply
- **B.** Yes, because the kernel matches the owner class first and grants read and write there
- **C.** Only if the `other` triad also grants write, since all three classes must agree
- **D.** No, because `alice` would need to be listed in `/etc/group` to use owner privileges

**Answer: B.** The kernel checks owner, group, and other in that order and stops at the first class that applies. `alice` is the owner, so the owner triad (`rw-`) governs her access regardless of what the group or other triads say, as read directly from `ls -l`.

- A is wrong: Class matching stops at the first match; membership in the group does not pull a more restrictive triad in for the owner.
- C is wrong: Classes do not need to agree with one another; only the first matching class is consulted at all.
- D is wrong: Owner privilege comes from being the file's owner, not from appearing in the group's supplementary member list.

### 62.

A file is `-r--rw-rw-`. Its owner removes all permission from the `other` class, leaving `-r--rw----`. Does that change what the owner can do to the file?

- **A.** No; removing permission from `other` never restricts the owner or group classes
- **B.** Yes, narrowing any one class tightens the effective permission for everyone
- **C.** Yes, because the owner's access is always the most restrictive of the three classes
- **D.** It depends on whether the sticky bit is also set on the file

**Answer: A.** The owner is still matched by the owner triad, which was untouched by narrowing `other`. Removing access from one class narrows only that class's users; it does not tighten or loosen either of the other two.

- B is wrong: Permission classes do not combine or narrow one another; each is a self-contained answer for the users it applies to.
- C is wrong: The owner's access is whatever the owner triad states, not a function of the other two classes.
- D is wrong: The sticky bit governs deletion within a directory and has no bearing on a regular file's own read/write bits.

### 63.

A team installs a monitoring agent with the distribution's package manager, and separately runs `npm install express` inside one Node.js application. Are both operations installing "packages" in the same sense the exam means?

- **A.** Yes, both are the same kind of package, just installed by different front-end commands — `npm` records what it installs in the same system package database
- **B.** No — the OS package came from a repository and the `npm` package did not come from anywhere at all
- **C.** No — the monitoring agent is a system-wide OS package with dependency metadata read by the OS package manager; `npm install` resolves a library scoped to one application
- **D.** Yes, and the difference only matters for which command performs the removal later — the files land in the same system directories either way

**Answer: C.** A package is a distributable archive bundling software with its metadata, dependency list and install scripts, resolved by the OS package manager against the system database. Language package managers such as `npm`, `pip` and Maven resolve an application's own libraries instead, a distinct and narrower scope.

- A is wrong: They differ in scope: an OS package is recorded in the system package database and owned by the distribution, while `npm` resolves libraries for one application only and writes them into that project's own `node_modules` directory.
- B is wrong: Both are fetched from somewhere; the distinguishing factor is scope (system-wide versus one application), not whether a remote source was involved.
- D is wrong: The difference is more than a removal-command detail: it is what the software is meant to serve and whose responsibility it is. A locally installed `npm` package lands under the project's own directory, not in a system path.

### 64.

What does installing a package register that a plain tarball copied into place by hand does not?

- **A.** Nothing meaningful — a package and a tarball extracted to the same paths behave identically afterward
- **B.** A cryptographic signature that is re-checked on every subsequent boot — by the integrity service the package manager installs alongside it
- **C.** An entry in a local database recording which files belong to it, so the system can answer "who owns this file" or remove it cleanly later
- **D.** A dependency manifest inside the target application's own project directory

**Answer: C.** Installing a package registers it in a local database — dpkg's status database or the RPM database — recording which files it placed and what it depends on. That database is what later answers "which package owns this file" and lets removal be clean, neither of which a hand-copied tarball supports.

- A is wrong: The database registration is exactly the thing a manually extracted tarball lacks, which is why files copied by hand cannot be cleanly removed or queried later.
- B is wrong: Signature verification happens at install time, against the package and the repository metadata; neither `dpkg` nor `rpm` runs any boot-time service that re-checks installed files.
- D is wrong: That describes a language-level manifest for one project; an OS package registers into the system-wide package database instead.

### 65.

A disk uses the older MBR partitioning scheme. What are its two defining limits compared with GPT?

- **A.** At most four partitions total, including logical ones, and no maximum disk size at all
- **B.** No limit on partition count, but a maximum disk size of roughly 2 TiB
- **C.** At most four primary partitions, with no size limit, since size limits belong to the filesystem type rather than the partition table
- **D.** At most four primary partitions, and a maximum disk size of roughly 2 TiB

**Answer: D.** MBR is limited to four primary partitions (one of which can be an extended partition holding further logical ones) and to disks of roughly 2 TiB, both consequences of its fixed, small on-disk structure. GPT, the UEFI-era replacement, removes both limits.

- A is wrong: One of MBR's four primary slots can hold an extended partition containing further logical partitions, and MBR does impose a roughly 2 TiB size ceiling.
- B is wrong: MBR does cap primary partitions at four; the count limit is real, not absent.
- C is wrong: The 2 TiB ceiling is a property of the MBR partition table format itself, independent of whatever filesystem type is later created on a partition.

### 66.

`lsblk` shows a disk and `df -h` shows nothing for it at all, though `fdisk -l` confirms a partition exists on it. What is the most likely explanation?

- **A.** The partition table must be corrupted, since a real partition should always appear in `df`
- **B.** The partition is mounted read-only, which hides it from `df -h` — `df` skips any filesystem it cannot write its temporary probe file to
- **C.** The partition has no filesystem on it yet — it is invisible to `df` and cannot be mounted until formatted
- **D.** `lsblk` and `fdisk -l` are reporting on two different disks by coincidence

**Answer: C.** A partition with no filesystem on it is invisible to `df` and cannot be mounted, so "the disk does not show up" in `df` while `lsblk` and `fdisk -l` confirm the partition exists often means simply that it was never formatted with `mkfs`.

- A is wrong: `fdisk -l` already confirms the partition table is intact and the partition exists; the missing piece is a filesystem, not a corrupted table.
- B is wrong: `df` writes nothing at all; it reports every mounted filesystem regardless of the read-only flag, so a read-only mount appears normally with its usage shown.
- D is wrong: Nothing in the scenario suggests two different disks; the simpler and standard explanation is an unformatted partition.

### 67.

A policy requires every password to be changed at least every 90 days and to warn the user seven days beforehand. Which fields in `/etc/shadow`, changed through `chage`, enforce that?

- **A.** The minimum age field (`-m 90`) and the account expiry field (`-E 7`)
- **B.** The maximum age field (`-M 90`) and the warning period field (`-W 7`)
- **C.** Password complexity settings, since ageing and complexity are the same policy category
- **D.** The login shell field, set to a value that expires automatically after 90 days

**Answer: B.** `chage -M` sets the maximum password age and `chage -W` sets the warning period before expiry, both stored in `/etc/shadow`. Complexity requirements are a separate, unrelated policy category from ageing.

- A is wrong: Minimum age sets the earliest a password may be changed again, and expiry disables the account on a date — neither matches the stated 90-day/7-day requirement.
- C is wrong: Complexity rules govern what a password may contain; they say nothing about how often it must be changed, which is a separate policy.
- D is wrong: The login shell has no expiry behaviour of any kind; it only names the program started at login.

### 68.

A newly created account must be forced to set its own password the very first time it logs in, rather than continuing to use the temporary password an administrator assigned. Which command achieves that most directly?

- **A.** `chage -m 90 alice`, setting a 90-day minimum age
- **B.** `passwd -e alice`, which expires the current password immediately
- **C.** `usermod -L alice`, locking the account
- **D.** `chsh alice`, changing the login shell — the shell field carries its own expiry timer, which is what prompts for a new password at the next login

**Answer: B.** `passwd -e` expires an account's password immediately, which forces the user to set a new one at their next login — the direct way to retire a temporary administrator-assigned password.

- A is wrong: A minimum age controls how soon a password can be changed again; it does not force an immediate change.
- C is wrong: Locking prevents password authentication outright rather than prompting for a new password at next login.
- D is wrong: Changing the shell affects what program starts at login, not whether the password must be renewed.

### 69.

A team runs `apt upgrade -y` on every server the moment any update becomes available, with no staging tier and no rollback plan. Are they practicing patch management?

- **A.** Yes, applying updates the moment they appear is the definition of good patch management
- **B.** No, because patch management applies only to security updates, not general package upgrades
- **C.** Yes, provided the updates are also logged somewhere after they are applied — that record is what turns ad-hoc updating into managed patching
- **D.** No — patch management is the surrounding discipline (inventory, testing, scheduled rollout, rollback), not merely running an update command

**Answer: D.** Patch management is the disciplined practice around updates — inventory, tracking advisories, testing before production, applying on a schedule, and being able to roll back — not simply the act of running an update command. Applying every update immediately and untested is a change-management failure, not the practice itself.

- A is wrong: Applying every update immediately, untested, on production is a change-management failure rather than diligence — it is how a patch causes the outage it was meant to prevent.
- B is wrong: The practice applies to updates generally, though security updates are often prioritised and sometimes automated separately for exactly that reason.
- C is wrong: Logging what happened after the fact does not substitute for the testing, staged rollout and rollback plan the practice requires beforehand; NIST's definition centres on identifying, prioritising, acquiring, installing and verifying patches, not on recording them afterwards.

### 70.

A described process covers inventorying installed versions, checking CVE feeds for severity, and testing updates on a staging tier — but has no documented rollback path. What step is missing?

- **A.** Nothing is missing; inventory, severity assessment and staging testing are the complete practice
- **B.** A maintenance window, since none was mentioned in the description
- **C.** An automated tool such as `unattended-upgrades`, without which the process is incomplete
- **D.** Rollback — a way to undo a patch that turns out to cause a problem once it reaches production

**Answer: D.** The practice includes inventory, advisory tracking, staged testing, a scheduled maintenance window, and a rollback plan — a snapshot, a held previous package version, or on Red Hat systems `dnf history undo`. A process with everything but a way to undo a bad patch is missing exactly that last step.

- A is wrong: A rollback plan is part of the described discipline; without one, a patch that causes a problem in production has no defined way to be undone.
- B is wrong: A maintenance window is a real part of the practice, but the description specifically omits any mention of undoing a bad patch, which is the rollback step.
- C is wrong: Automation of routine security updates is a useful accelerant, not a required component of the underlying discipline the process is missing.

### 71.

What is PID 1, and what happens to a process whose parent has exited before it does?

- **A.** PID 1 is the init system, the ancestor of every other process, and an orphaned process is re-parented to it
- **B.** PID 1 is reserved for the kernel itself, and an orphaned process is simply terminated
- **C.** PID 1 is whichever process currently has the highest CPU priority — the kernel renumbers it whenever another process is reniced below the current holder
- **D.** An orphaned process becomes a zombie until an administrator manually reaps it

**Answer: A.** The kernel starts PID 1 first — the init system — and it becomes the ancestor of everything else. When a process's parent dies before it does, the kernel re-parents it to PID 1 rather than terminating it. `ps -ef` prints PID and PPID side by side, and `pgrep` finds PIDs by name or attribute.

- B is wrong: PID 1 is a user-space init process, not the kernel, and an orphan is re-parented rather than killed outright.
- C is wrong: PID number assignment has nothing to do with scheduling priority; PID 1 is fixed as the first process the kernel starts.
- D is wrong: Orphaning and becoming a zombie are different outcomes — an orphan is re-parented and continues running; a zombie has already exited.

### 72.

A stale monitoring script keeps a PID recorded in a file from an hour ago and sends it a signal to check on a long-running job. The signal reaches an entirely unrelated process instead. What explains this?

- **A.** PID files are guaranteed unique for the life of the machine and cannot be reused
- **B.** PIDs are reused once a process exits, so the recorded number may now belong to a different process entirely
- **C.** The script must be running inside a different PID namespace than the job it is checking
- **D.** The job's PPID must have changed, which the script failed to account for — `kill` resolves a recorded PID against its parent before deciding where to deliver the signal

**Answer: B.** PIDs identify a process only while it lives; once it exits, the kernel is free to reuse that number for something else. A PID recorded in a file and used later without checking is a well-known source of signalling the wrong process, which is why service managers prefer tracking by cgroup instead.

- A is wrong: PIDs wrap and are reused once `pid_max` is reached, and more simply, as soon as the original process exits its number becomes available again.
- C is wrong: Namespace differences change what number a process sees for itself, but nothing in this scenario describes containers or namespaces.
- D is wrong: A changed PPID would affect parentage lookups, not which process a plain PID-based signal is delivered to.

### 73.

A user belongs to `developers` as a supplementary group and `staff` as their primary group. Which group owns a file they create in their home directory with no special tooling involved?

- **A.** `staff`, because a newly created file takes the creator's primary group
- **B.** `developers`, because supplementary groups grant access to newly created files too
- **C.** Whichever group appears first alphabetically among the ones the user belongs to
- **D.** `root`, because only a privileged process can set group ownership on creation

**Answer: A.** Every user has exactly one primary group, and that is the group applied to files they create; supplementary groups only add access to files that already exist, unless a directory carries the SGID bit. `id` and `groups` both show the current membership; `usermod -g` changes the primary group, while `usermod -aG` appends a supplementary one.

- B is wrong: Supplementary groups grant access to files that already exist; they do not become the owning group of a new one.
- C is wrong: Group ownership follows the primary/supplementary distinction, not alphabetical order.
- D is wrong: An unprivileged process still creates files under its own primary group; no privilege is required for that.

### 74.

After running `usermod -G developers alice`, `alice` reports she can no longer access files under a project she previously worked on through another group. What happened?

- **A.** Her primary group was changed to `developers`, which does not affect existing file access
- **B.** `-G` without `-a` replaced her entire supplementary group list with just `developers`
- **C.** Nothing changed; supplementary group membership has no effect on file access
- **D.** The other project's group was deleted at the same time by an unrelated cleanup

**Answer: B.** `usermod -G` without `-a` silently replaces the whole supplementary group list rather than adding to it — a classic destructive mistake. `usermod -aG developers alice` would have appended `developers` while leaving her other memberships intact.

- A is wrong: `-G` affects the supplementary list, not the primary group, and either way this would not explain losing access.
- C is wrong: Supplementary groups are exactly what extend a user's access to files owned by a group other than their primary one.
- D is wrong: Nothing in the scenario describes a group being deleted, and the command given fully explains the symptom on its own.

### 75.

An administrator writes a new value to `/proc/sys/vm/swappiness` to change kernel tuning immediately. Does that change survive the next reboot?

- **A.** No — the change applies to the running kernel immediately but is lost at the next boot unless also recorded under `/etc/sysctl.d/`
- **B.** Yes, any write under `/proc/sys` is automatically persisted to disk — the kernel mirrors each accepted write into `/etc/sysctl.conf` as it happens
- **C.** No, and it also requires a reboot before it takes effect on the running system at all
- **D.** Yes, because `/proc/sys` entries are actually device nodes stored under `/dev`

**Answer: A.** Writing to `/proc/sys/vm/swappiness` changes the running kernel immediately, but the change is not persistent — it is lost at the next boot unless the same setting is also recorded in `/etc/sysctl.conf` or a file under `/etc/sysctl.d/`, which is applied at startup. Other read-only entries, such as `cat /proc/cpuinfo`, expose kernel state without any tunable to persist.

- B is wrong: `/proc` is a pseudo-filesystem generated by the kernel and writes nothing back to disk; persistence works the other way round, with `systemd-sysctl.service` reading `/etc/sysctl.d/*.conf` at boot and writing each key into `/proc/sys`.
- C is wrong: The opposite is true: the write to `/proc/sys` takes effect on the running kernel immediately, without any reboot.
- D is wrong: Device nodes live under `/dev` and represent hardware; `/proc/sys` is a distinct virtual filesystem exposing tunable kernel parameters as files.

### 76.

`ls -l /proc/1234/status` reports a file size of zero bytes, yet `cat`-ing it returns pages of readable text. Is that a sign of filesystem corruption?

- **A.** Yes, a zero-byte file that returns content when read always indicates filesystem damage
- **B.** No, but it does mean the process's inode has been exhausted — `/proc` allocates one inode per open file descriptor and drops the reported size to zero once that pool runs out
- **C.** Yes, and the fix is to remount the filesystem `/proc` lives on
- **D.** No. Entries under `/proc` are generated by the kernel on demand, so they legitimately report zero size while still returning content when read

**Answer: D.** Reading a path under `/proc` causes the kernel to generate its contents on demand, which is why such entries report a size of zero to `ls -l` yet return real data when read — an artefact of `/proc` being a virtual filesystem with no disk-backed size, not a sign of corruption.

- A is wrong: On an ordinary on-disk filesystem that mismatch would be suspicious, but `/proc` is a virtual filesystem where every entry behaves exactly this way by design.
- B is wrong: Inode exhaustion is a property of on-disk filesystems with a fixed inode table; `/proc` entries are generated by the kernel on read and consume no on-disk inodes, and the zero size is unconditional rather than a symptom of anything.
- C is wrong: Nothing about this symptom indicates a mount problem; it is the expected, permanent behaviour of every entry under `/proc`.

### 77.

An unprivileged user wants to lower the nice value of their own running batch job from 10 to 0, to give it more CPU time. Can they do it with plain `renice`?

- **A.** Yes, any user may freely move their own process's nice value in either direction
- **B.** Yes, but only using `nice` rather than `renice`, since they behave differently for this purpose
- **C.** No, because only the process's original parent may ever change its nice value — the kernel keeps the permitted nice range in the parent's task structure rather than the child's
- **D.** No — lowering a nice value requires root or `CAP_SYS_NICE`, unless the administrator has raised `RLIMIT_NICE`, which by default allows no reduction

**Answer: D.** Raising a process's own nice value — making it less demanding — is always allowed. Lowering it back down requires root or `CAP_SYS_NICE`, unless the administrator has raised the process's `RLIMIT_NICE` resource limit, which by default allows no reduction at all.

- A is wrong: Movement is asymmetric: raising is unrestricted, but lowering — even back toward a value the user held before — needs privilege by default.
- B is wrong: Both commands are subject to the same privilege rule for lowering a nice value; the restriction is not specific to one command over the other.
- C is wrong: The restriction is about privilege level, not about parentage; a sufficiently privileged unrelated user or process can lower it too.

### 78.

A batch job is niced all the way down to 19 but a database it is supposedly starving is still slow. `top` shows the machine is not CPU-bound; memory usage is very high and swap activity is heavy. Will renicing the batch job further help?

- **A.** Yes, renicing always frees resources across the board for the higher-priority process
- **B.** No — nice only biases CPU scheduling, and it does nothing for memory pressure or I/O waits
- **C.** Yes, but only if the batch job is also sent SIGSTOP first
- **D.** No, because nice values only take effect immediately after a process starts, not while it runs

**Answer: B.** Nice is a scheduling bias, not a reservation, and it affects only how CPU time is allocated when the CPU is contended. A machine that is memory-bound and swapping heavily has a different bottleneck entirely, and no amount of renicing addresses memory pressure or I/O wait.

- A is wrong: A nice value affects scheduling priority only; it has no mechanism for reclaiming memory or reducing I/O wait for any other process.
- C is wrong: Stopping the job would free some memory temporarily, but that is a different action from renicing and not what the question is asking about.
- D is wrong: `renice` is specifically designed to change the nice value of an already-running process, so timing after start is not the issue here.

### 79.

Two people log in separately and each run the same text editor program. How many processes exist, and what identifies each one uniquely?

- **A.** One process, since only one copy of the program exists on disk
- **B.** Two processes, each with its own PID — one program on disk can be running as many separate processes at once
- **C.** Two services, one per user session — the desktop session manager registers every editor invocation as a per-user service
- **D.** One process with two PPIDs, one for each user

**Answer: B.** A process is a running instance of a program: its own PID, address space, open files, and credentials. One program file can be executed many times over, producing as many independent processes, each separately identified by its PID.

- A is wrong: The file on disk is the program; each execution of it is a separate process with its own memory and PID, regardless of how many copies of the file exist.
- C is wrong: Neither invocation is managed by an init system with a restart policy, so "service" is not the right term for either.
- D is wrong: A process has exactly one parent and therefore one PPID; two independent invocations are two separate processes, not one with two parents.

### 80.

A process appears idle in a snapshot from `ps` but `top` shows it pegged at 100% CPU. Which reading is correct?

- **A.** One of the two tools must be malfunctioning, since they disagree about the same process
- **B.** Both can be correct at once — `ps` reports a total divided over the process's whole lifetime, while `top` samples over a short recent interval
- **C.** `top`'s figure is always more accurate because it updates continuously
- **D.** The process must have forked a hidden child that `ps` is not counting — `ps` excludes from its CPU accounting any process it did not itself start

**Answer: B.** `ps` reports CPU time as a share of the process's entire lifetime, while `top` reports CPU share over the interval since its last screen refresh. A process bursting briefly can look idle to the lifetime average and busy to the recent sample without either tool being wrong.

- A is wrong: Disagreement is expected and does not indicate a fault — the tools compute genuinely different statistics rather than reporting the same one two ways.
- C is wrong: Neither figure is more "accurate" than the other; they measure different things, and continuous updating does not make one the correct answer to the other's question.
- D is wrong: Nothing in the scenario suggests a fork; the discrepancy is fully explained by the different measurement windows the two tools use.

### 81.

A system needs to survive the loss of any one drive while maximising usable capacity from four drives. Which RAID level fits, and how many drives does it need at minimum?

- **A.** RAID 0, since striping across four drives gives the largest usable capacity of any option
- **B.** RAID 1, since mirroring is the simplest way to survive a drive failure
- **C.** RAID 10, since striping across mirrored pairs also survives the loss of any one drive
- **D.** RAID 5, needing at least three drives and giving the capacity of all but one

**Answer: D.** RAID 5 needs at least three drives, gives the capacity of all but one, and survives exactly one drive failure — the best capacity-to-redundancy trade-off of the options for surviving a single drive loss. RAID 6, RAID 10 and RAID 1 all trade away more capacity for additional protection.

- A is wrong: RAID 0 has no redundancy at all and loses everything if any single drive fails — it does not survive a drive loss, which the requirement specifically asks for.
- B is wrong: RAID 1 survives a drive loss but gives only the capacity of one drive regardless of how many are mirrored, which does not maximise usable capacity from four drives.
- C is wrong: RAID 10 does survive a single drive loss, but holding two copies of every block leaves only half the raw capacity usable, which is less than RAID 5's all-but-one on the same four drives.

### 82.

A team relies on a mirrored RAID 1 array and treats it as their backup strategy. An operator accidentally deletes a critical directory. What does the mirror do?

- **A.** It protects the directory, since RAID 1 keeps an independent second copy — mirrors resynchronise on a schedule rather than on every write, so the deletion has not reached the second drive yet
- **B.** It faithfully mirrors the deletion to the second drive just as quickly as any other write, so RAID alone does not recover the directory
- **C.** It automatically preserves a prior version of the directory before the deletion, since mirrors are point-in-time
- **D.** It depends on which RAID controller is used, since some controllers block destructive commands

**Answer: B.** RAID protects only against a drive failing — not against accidental deletion, corruption, or any other destructive write, all of which are mirrored or parity-protected just as faithfully as a legitimate write. That is why RAID levels are never a substitute for backups.

- A is wrong: The second drive is kept in lockstep with the first rather than independent of it, so the "protection" a backup provides against deletion is not what mirroring gives.
- C is wrong: A mirror is continuously kept current with the primary, not captured at a point in time, so there is no earlier version retained anywhere in the array.
- D is wrong: RAID operates below the filesystem, mirroring whatever writes the operating system issues; it has no awareness of whether a given write is destructive.

### 83.

A directory is `d-wx------`. Its owner has write and execute but not read. Can the owner list the directory's contents with `ls`, and can they open a file inside it by name?

- **A.** No to both, because any operation on a directory needs all three bits together
- **B.** Yes to both, because write on a directory implies read for its owner — the owner class is exempt from the directory read bit on any directory it owns
- **C.** Yes to listing but no to opening a known file, since read must come before execute
- **D.** No to listing; yes to opening a known filename, because listing needs read while traversal needs execute

**Answer: D.** On a directory, execute means "may traverse into" and is independent of read, which means "may list the entries." With `-wx` set and `r` absent, the owner can enter the directory and open a file whose name they already know, but cannot enumerate what is there with `ls`. `ls -l` and `chmod` are the ordinary tools for inspecting and changing that mode.

- A is wrong: The three bits govern separate operations on a directory; execute alone is enough to traverse into it by a known name.
- B is wrong: Write on a directory means the owner may create or delete entries; it does not grant read, which is what listing requires.
- C is wrong: This reverses the actual roles: read enables listing, execute enables traversal, and this directory has execute but not read.

### 84.

After a bulk permission change, users report they can no longer traverse into a directory tree at all, though the files inside still show read permission when named directly by another process. What is the most likely cause?

- **A.** The files themselves must have lost their write permission — a directory can only be entered when at least one file inside it is writable by the caller
- **B.** The owning group of the directories was changed to one nobody belongs to
- **C.** The umask was changed on the server, retroactively affecting the existing tree
- **D.** The directories in the tree lost their execute bit, blocking traversal even though file read bits are untouched

**Answer: D.** Traversal requires execute on every directory along the path, independent of what the files inside allow. A bulk change that strips execute from directories — a common side effect of an overly broad `chmod -R` — produces exactly this symptom.

- A is wrong: Write permission on the files controls whether their contents can be changed, not whether the directory holding them can be entered.
- B is wrong: A group change would affect the group triad's access, but the scenario describes a traversal failure consistent with a missing execute bit specifically.
- C is wrong: A umask only affects the permissions given to newly created files and directories; it cannot retroactively change an existing tree.

### 85.

A package released an hour ago is reported by the package manager as having "no installation candidate," even though it is confirmed to exist. What is the most likely explanation?

- **A.** The package genuinely does not exist yet, despite what was confirmed — `apt` queries the configured repositories live at install time
- **B.** The package's dependencies cannot be resolved, which is unrelated to the index
- **C.** The local package database has become corrupted and needs to be rebuilt
- **D.** The locally cached repository index is stale and has not been refreshed since the package was published

**Answer: D.** The client's repository index is a downloaded snapshot cached locally, refreshed only when explicitly asked. "No installation candidate" for a package known to exist is the standard symptom of a stale index rather than a missing package, and refreshing the index is the fix.

- A is wrong: The scenario states its existence was confirmed, and `apt` does not query repositories live: it works from the locally cached index that `apt update` downloads, so a stale index is the far more common explanation for 'no installation candidate'.
- B is wrong: An unresolved dependency produces a different, more specific error naming the missing requirement, not a blanket "no installation candidate."
- C is wrong: A corrupted local database of installed packages would produce errors on already-installed packages, not on finding a new one to install.

### 86.

Where does repository configuration live on a Debian-family system compared with a Red Hat-family one?

- **A.** Both families read the same `/etc/apt/sources.list` file, since the format is a Linux-wide standard
- **B.** The repository list is embedded inside each installed `.deb` or `.rpm` package itself — carried in its control metadata and read back at upgrade time
- **C.** `/etc/apt/sources.list` and `/etc/apt/sources.list.d/` on Debian-family; `.repo` files under `/etc/yum.repos.d/` on Red Hat-family
- **D.** Repository configuration lives under `/var/lib`, the same place the package database itself lives

**Answer: C.** Debian-family systems list repositories in `/etc/apt/sources.list` and files under `/etc/apt/sources.list.d/`; Red Hat-family systems use `.repo` files under `/etc/yum.repos.d/`. Knowing the family-specific location is often the fastest first step in diagnosing a repository problem.

- A is wrong: The `apt` configuration format and location are specific to the Debian family; Red Hat-family systems use `.repo` files instead.
- B is wrong: Repository configuration is separate, client-side configuration describing where packages come from; no `.deb` control field or `.rpm` header carries a repository list, and it is not read back from installed packages at upgrade time.
- D is wrong: The package database recording what is installed and the client's repository configuration are different things kept in different places.

### 87.

An administrator argues that logging in via `sudo -i` and staying in that root shell all afternoon satisfies least privilege, because `sudo` was used rather than `su`. Is that correct?

- **A.** No — an all-afternoon root shell holds the same authority either way; least privilege is about how much and how long, not which command opened it
- **B.** Yes, because `sudo` always logs individual commands, which by itself satisfies least privilege
- **C.** Yes, because `sudo` requires the administrator's own password rather than the root password
- **D.** No, but only because `sudo -i` is slower to authenticate with than `su -` — the extra policy lookup `sudo` performs is what the principle is actually measuring

**Answer: A.** Least privilege is about granting the smallest privilege sufficient for the task, for the shortest time. An all-afternoon `sudo -i` session holds full root authority for as long as `su -` would, so the choice of command does not by itself satisfy the principle.

- B is wrong: `sudo -i` opens a shell, and commands run inside it are not individually logged the way single-command invocations are — logging is not what the principle is measuring here in any case.
- C is wrong: Which password authenticates the session is a separate question from how much privilege is then held and for how long.
- D is wrong: Authentication speed has nothing to do with the least-privilege principle; the issue is the breadth and duration of access held.

### 88.

A file is `chmod 000`, owned by root. Can a process running as root read and write it despite the mode granting no bits to anyone?

- **A.** No, `000` blocks every process including root, since the mode has no bits set for any class
- **B.** Only if root is also the file's owner, which grants an exception to the check
- **C.** Yes: root bypasses the ordinary permission check entirely, so the mode bits are irrelevant to it
- **D.** Only through `sudo`, since plain root access still respects file modes — `sudo` sets an override flag on the process that a direct root login does not carry

**Answer: C.** Root is UID 0, the identity for which the kernel's ordinary permission checks are bypassed entirely. A mode of `000` blocks every other identity, but a root process is unaffected by mode bits at all — which is exactly why some distributions can ship sensitive files with no permission bits set.

- A is wrong: Root is not subject to the same check the mode bits express; it is exactly why Red Hat-family systems can ship `/etc/shadow` at `0000` and still have it work.
- B is wrong: Root's bypass does not depend on ownership of the specific file; it applies to root's access generally.
- D is wrong: A process running as root, whether reached via `sudo`, `su`, or direct login, is subject to the same kernel-level bypass.

### 89.

Under the systemd compatibility mapping, which target does SysV runlevel 5 correspond to, and which does runlevel 0 correspond to?

- **A.** The pairing is reversed from that: `poweroff.target` is what 5 reaches, and `graphical.target` is what 0 reaches
- **B.** Runlevel 5 and runlevel 0 both map to `multi-user.target`, since several runlevels collapse onto it
- **C.** Runlevel 5 maps to `graphical.target`; runlevel 0 maps to `poweroff.target`
- **D.** Neither maps to anything under systemd, since runlevels are not supported at all on modern systems

**Answer: C.** systemd documents the mapping as 0 to `poweroff.target`, 1 to `rescue.target`, 2/3/4 to `multi-user.target`, 5 to `graphical.target`, and 6 to `reboot.target`. Because three runlevels collapse onto one target, the mapping loses information and cannot be reversed cleanly.

- A is wrong: This reverses the actual mapping — 0 has always meant halt, not a graphical login state, in both the SysV and systemd schemes.
- B is wrong: Runlevels 2, 3 and 4 collapse onto `multi-user.target`, but 5 and 0 each map to their own distinct target.
- D is wrong: systemd documents an approximate compatibility mapping for every runlevel number rather than dropping support for the concept entirely.

### 90.

Runlevels are described as mutually exclusive, but targets are not. What does that structural difference mean in practice?

- **A.** Exactly one runlevel could be active at a time under SysV init, while several systemd targets can be active simultaneously
- **B.** It means targets are simply renamed runlevels with no real behavioural difference
- **C.** It means runlevels can be active simultaneously but targets cannot — which is why `systemctl isolate` exists, to enforce one target at a time
- **D.** It means only `rescue.target` and `emergency.target` can coexist with other targets

**Answer: A.** Runlevels were mutually exclusive under SysV init — the system was in exactly one at a time. Targets compose: `graphical.target` does not replace `multi-user.target`, it pulls it in, so several targets are active together. That is why the runlevel-to-target mapping is approximate rather than a straightforward rename. The `runlevel` command still prints the previous and current SysV runlevel on systems that track it.

- B is wrong: The mapping is explicitly approximate, not a rename, precisely because the exclusivity assumption behind runlevels does not hold for targets.
- C is wrong: This reverses the actual relationship; it is targets that compose and can be active together, not runlevels. `isolate` is an operation an administrator chooses to invoke, not evidence that targets are mutually exclusive by nature.
- D is wrong: Composability is not limited to those two special targets — `graphical.target` and `multi-user.target` coexist too, since one pulls in the other.

### 91.

What is the purpose of creating a dedicated service account for a web server daemon rather than running it under an administrator's own account?

- **A.** To give the daemon a personal login so a human can use it to authenticate interactively
- **B.** To grant the daemon root access automatically, since service accounts are privileged by convention
- **C.** To limit the damage a compromised daemon can do, by giving it only the privilege it needs
- **D.** To let the daemon be scheduled with `cron` instead of `systemd`

**Answer: C.** A service account is an unprivileged account created to run a daemon rather than to be logged into, so that a compromised service is confined to whatever narrow privilege that account holds instead of an administrator's full access.

- A is wrong: A service account exists to run a daemon, not to provide anyone with an interactive login.
- B is wrong: A service account is created unprivileged by design; nothing about the category grants root automatically.
- D is wrong: Which scheduler runs a job is unrelated to whether it runs under a dedicated account.

### 92.

An account has a system-range UID, a nologin shell, and no interactive password set, and it is the identity a database daemon runs under. Which term describes it, and is it automatically unprivileged?

- **A.** A service account, and yes, service accounts are unprivileged by definition
- **B.** A regular user account, since it belongs to a specific named daemon
- **C.** A service account — and no, its actual privilege still depends entirely on what it was granted
- **D.** A group, since it is shared by every process the daemon forks — a UID in the system range is allocated out of the group namespace rather than the user namespace

**Answer: C.** The description matches a service account: an unprivileged-by-intent identity for a daemon. But "unprivileged" is a design goal, not an automatic property — a service account can still be granted excessive privilege if it is configured that way.

- A is wrong: Nothing about the category enforces low privilege automatically — a poorly configured service account can hold broad access just like any other account.
- B is wrong: A regular user account is meant for a person to log into; this one is defined by running a daemon and having no interactive login.
- D is wrong: The description is of a single account with a UID and a shell, not a group with a member list.

### 93.

A process launched by hand at the shell keeps dying, and nothing restarts it. The same program launched via a systemd unit restarts automatically after a crash. What accounts for the difference?

- **A.** Nothing — a process and a service are the same object under two different names
- **B.** The systemd version must be running as a daemon while the hand-launched one is not
- **C.** The unit wraps the process in a supervision policy — a service, as opposed to a bare process nobody is watching
- **D.** The hand-launched process was niced too low to be restarted automatically — the scheduler declines to re-admit a process whose nice value sits below its control group's floor

**Answer: C.** A service is a process wrapped in a management policy: how to start it, what to do when it exits, and whether it should come back at boot. A process launched by hand has none of that definition behind it, which is why only the unit-managed copy restarts itself. `systemctl` is the control interface for units and the manager that supplies that policy.

- A is wrong: The underlying program is identical either way; what differs is whether a management layer is watching and restarting it.
- B is wrong: Both could equally detach from a terminal; the restart behaviour comes from the unit's `Restart=` policy, not from daemon status.
- D is wrong: A nice value affects CPU scheduling priority and has no bearing on whether anything restarts a process after it exits.

### 94.

A running application's configuration file has changed and it must pick up the change. Should an administrator run `systemctl restart app` or `systemctl reload app`?

- **A.** `reload`, if the application supports it, since that asks the running process to re-read its configuration without stopping it
- **B.** `restart`, since it is always the safer choice regardless of what changed — a restart re-reads the unit file and the application's own configuration in a single step, which reload cannot do
- **C.** `systemctl daemon-reload`, since any configuration change requires reloading the manager
- **D.** `systemctl enable --now app`, to apply the new configuration at the next boot

**Answer: A.** `systemctl restart` stops and starts the process, while `systemctl reload` tells the already-running process to re-read its own configuration file — the appropriate choice when only the application's configuration, not the unit definition, has changed and the daemon supports reload.

- B is wrong: Restart stops and starts the process, causing an interruption that a reload — when supported — avoids entirely for a configuration-only change.
- C is wrong: `daemon-reload` re-reads unit files, not an application's own configuration file; it would not make the running process notice the change at all.
- D is wrong: Enabling changes only boot-time activation; it does not make the currently running process re-read anything right now.

### 95.

A team wants a shared directory where every file a member creates is automatically writable by the whole team, without each person having to `chgrp` and `chmod` after every save. Which combination builds that?

- **A.** `chmod 4770 /srv/shared` alone, since setuid on a directory gives every file the owner's privileges
- **B.** `chmod u+s /srv/shared`, since it runs new files with the file owner's privileges
- **C.** `chgrp developers /srv/shared`, `chmod 2770 /srv/shared`, and a umask of `002` in members' sessions
- **D.** Adding the sticky bit to `/srv/shared` so files inherit the shared group

**Answer: C.** Setgid on a directory, set with `chmod g+s` or the numeric `2770`, makes newly created entries inherit the directory's group rather than the creator's primary group. That alone still leaves new files with whatever the umask allows, so a `002` umask is needed too, or teammates still cannot write to each other's files.

- A is wrong: Set-user-ID has no defined meaning on a directory in Linux; only setgid and the sticky bit have directory semantics.
- B is wrong: That is the setuid bit, which has no effect on a directory; the group-inheritance behaviour needed here comes from setgid.
- D is wrong: The sticky bit restricts who may delete an entry; it has no effect on which group new files inherit.

### 96.

A directory already has `chmod 2770 /srv/shared` applied for a shared team folder. Files that already existed before that change still cannot be edited by other members. What is going on?

- **A.** The setgid bit was not actually applied, since `2770` should have fixed every file in the directory
- **B.** The files need the sticky bit removed before they can be shared — clearing `S_ISVTX` is what lets a directory's group permissions propagate onto entries already inside it
- **C.** Setgid inheritance applies only to entries created after the bit was set, not retroactively to existing files
- **D.** The files must individually be given the setuid bit to be shared

**Answer: C.** Setgid on a directory affects only entries created after the bit is set; existing files keep whatever group and mode they already had. The fix for pre-existing files is a one-time `chgrp` and `chmod` pass, after which the setgid bit keeps everything new consistent going forward.

- A is wrong: The mode was applied successfully to the directory; the symptom is expected, because setgid never rewrites existing entries.
- B is wrong: The sticky bit restricts deletion, not editing, and has nothing to do with whether teammates can write to a file.
- D is wrong: Setuid on a regular file changes which identity it runs as if executed; it has no bearing on ordinary read/write sharing of data files.

### 97.

A daemon needs to shut down and should be given the chance to flush buffers, close files, and release its lock before it stops. Which signal, and which command, is the right first move?

- **A.** SIGKILL, sent with `kill -9 <pid>`, to guarantee the process actually stops
- **B.** SIGSTOP, to pause the process before deciding what to do next — a process flushes its buffers to disk as part of entering the stopped state
- **C.** SIGTERM, sent with plain `kill <pid>`, since it asks the process to shut down and can be caught
- **D.** SIGHUP, since it is the standard signal for terminating a daemon cleanly

**Answer: C.** `kill` sends SIGTERM by default, which a well-behaved daemon can catch to flush buffers, close files, and release locks before exiting. SIGKILL should be reserved for a process that does not respond, since it gives no opportunity to clean up. `killall` and `pkill` send the same signals but select processes by name or pattern rather than by PID.

- A is wrong: SIGKILL removes the process from the scheduler immediately with no chance to clean up, which is the opposite of what an orderly shutdown needs as a first move.
- B is wrong: SIGSTOP freezes the process rather than asking it to exit, and it cannot be caught or handled by the program at all.
- D is wrong: SIGHUP is conventionally used to ask a daemon to reload its configuration, not to terminate it.

### 98.

`kill -9` is sent to a process stuck reading from an unresponsive network filesystem, and the process is still there afterward. What explains this apparent failure?

- **A.** SIGKILL failed and a stronger signal such as `-15` should be tried instead — signal numbers above 9 are reserved for the kernel's own escalation path
- **B.** The process must actually be a zombie, which explains why it cannot be killed
- **C.** The process is in uninterruptible sleep, waiting inside the kernel on I/O, and cannot be reaped until that I/O returns or times out
- **D.** `kill -9` only works on processes owned by the caller, and this one must belong to another user

**Answer: C.** A process in uninterruptible sleep (state `D` in `ps`) is blocked inside a kernel call waiting on I/O and cannot respond to any signal, SIGKILL included, until that call returns. This, along with an already-dead zombie, is the standard explanation for an apparent "kill -9 did nothing" report.

- A is wrong: SIGTERM (signal 15) is weaker than SIGKILL, not stronger, and neither signal can reach a process stuck in uninterruptible sleep.
- B is wrong: A zombie has already exited and holds only a table entry; this process is still actively blocked on I/O, a different state entirely.
- D is wrong: Ownership would produce a permission error immediately, not a process that appears to survive the signal indefinitely.

### 99.

`/tmp` is world-writable, `drwxrwxrwt`. Name every party who may still delete or rename a file inside it that they do not own.

- **A.** The file's owner, the directory's owner, and a privileged process — nobody else
- **B.** Only the file's owner — write permission on the directory does not matter once the sticky bit is set
- **C.** Any user with write permission on the directory, since the sticky bit only affects renaming, not deletion
- **D.** Only a privileged process, since `/tmp` is meant to be fully protected from ordinary users

**Answer: A.** The sticky bit, set with `chmod +t`, restricts deletion and renaming inside a shared-writable directory to three parties: the file's own owner, the directory's owner, and a privileged process. Naming only "the file's owner" and forgetting the other two is the standard way this fact is gotten wrong.

- B is wrong: This is the recurring error: the directory's owner and a privileged process may also remove an entry, not the file's owner alone.
- C is wrong: The sticky bit restricts both renaming and deletion equally; it does not carve out deletion as unaffected.
- D is wrong: Ordinary users routinely delete their own files in `/tmp`; the restriction is narrower than blocking every ordinary user.

### 100.

`ls -ld /srv/scratch` shows `drwxrwxr-T`. What does the capital `T` indicate, compared to a lowercase `t`?

- **A.** The capital letter means the sticky bit is somehow "stronger" than lowercase
- **B.** It means the setgid bit is active in addition to the sticky bit
- **C.** The sticky bit is set, but other-execute is not, so the directory is untraversable by anyone outside owner and group
- **D.** It is a typo in the output and should be read as lowercase `t` — `ls` prints the flag in uppercase only when its output is not going to a terminal

**Answer: C.** In the other triad's execute position, lowercase `t` means the sticky bit is set and execute is also present; uppercase `T` means the sticky bit is set but execute is not, which — on a directory — makes it untraversable to anyone outside the owner and group, usually unintentionally.

- A is wrong: Case does not indicate strength; it indicates whether the corresponding execute bit is also present, which changes traversal rather than the protection itself.
- B is wrong: Setgid would appear as `s` or `S` in the group triad, a different position from the sticky bit shown here in the other triad.
- D is wrong: The distinction between the two cases is meaningful output, not an error, and changes what the mode string is telling you.

### 101.

An organisation wants a per-command audit trail of every administrative action, showing exactly who ran what. Should administrators be told to use `sudo` for individual commands, or `su -` for a shell?

- **A.** `su -`, since it requires the target account's own password and is therefore more accountable
- **B.** Either is equivalent for auditing, since both ultimately grant root access — the kernel records the same audit event for either escalation path
- **C.** `sudo` for individual commands, which logs each invocation, while `su -` only logs the single switch to a shell
- **D.** `sudo -i`, since it combines the audit benefit of `sudo` with a full login shell

**Answer: C.** `sudo` run per command logs what was executed and by whom, because each invocation is authenticated and recorded separately. `su -` authenticates once and hands over an entire shell, after which everything typed is anonymous within that session as far as the audit trail is concerned.

- A is wrong: Requiring the target's password authenticates the switch; it does not create a record of what is done afterward inside that shell.
- B is wrong: Holding the same privilege level does not mean the same audit trail — `sudo` scoped to commands is specifically what preserves per-action logging.
- D is wrong: `sudo -i` opens a shell just as `su -` does; commands run inside it are not individually logged the way single-command `sudo` invocations are.

### 102.

On a fresh Ubuntu installation, an administrator runs `su` to become root and it fails no matter what password is entered, even though `sudo` works fine for the same account. Why?

- **A.** The administrator has forgotten the root password and must reset it before `su` will work
- **B.** `su` requires the caller to already be a member of the `sudo` group — Ubuntu drops that membership requirement only once a root password has been set
- **C.** Root's password is locked by default on Ubuntu, so `su` to root always fails; `sudo -i` is the intended route to a root shell instead
- **D.** `su` is disabled entirely on Ubuntu and cannot be used under any circumstances

**Answer: C.** On Ubuntu, and on any Debian installation where no root password was set during setup, the root account's password is locked, so `su` to root fails regardless of what is typed. The intended route to a root shell is `sudo -i`, which authenticates with the caller's own password instead.

- A is wrong: The account is not merely forgotten — it is locked by the distribution's design, so no password will ever satisfy it until it is explicitly unlocked.
- B is wrong: `su` authenticates against the target account's own password; group membership in `sudo` is what governs whether `sudo` itself is permitted.
- D is wrong: The command is present and works to switch into any account whose password is set; only the root account specifically is locked by default.

### 103.

Why can an ordinary, unprivileged user successfully run `passwd` to change their own password, when `passwd` needs to write to `/etc/shadow`, which the user cannot open directly?

- **A.** The user's real UID temporarily becomes root's for the duration of the command — the kernel restores the caller's original real UID once `passwd` exits
- **B.** `passwd` carries the set-group-ID bit, running with the group `shadow`'s privileges
- **C.** The user is temporarily added to the `sudoers` file for the duration of the command
- **D.** `passwd` carries the set-user-ID bit, so it runs with the file owner's (root's) privileges rather than the caller's

**Answer: D.** The set-user-ID bit makes an executable run with the file owner's effective UID rather than the caller's. `passwd` is owned by root and carries this bit, which is how an ordinary user's invocation of it can write into `/etc/shadow`, a file they cannot otherwise open. Every SUID binary on a system can be enumerated with `find / -perm -4000`.

- A is wrong: SUID changes the effective UID, not the real UID; the real UID still records who actually launched the process.
- B is wrong: On Debian-family systems a shadow-group helper is one real design, but the textbook answer for `passwd` itself is the set-user-ID bit running as root.
- C is wrong: `passwd` does not consult or modify `sudoers`; its escalation comes entirely from the SUID bit on the binary itself.

### 104.

An administrator runs `chmod u+s deploy.sh` on a shell script, expecting it to run with the file owner's privileges the way a compiled SUID binary would. It does not. Why?

- **A.** The bit was not actually set, since `chmod u+s` silently fails on non-executable files
- **B.** Linux ignores the set-user-ID bit on interpreted scripts, so the bit is set but never takes effect
- **C.** The script needs the sticky bit as well before setuid takes effect
- **D.** The script must first be made SGID before SUID has any effect — a script's SGID bit is what tells the kernel the interpreter may be trusted with elevated rights

**Answer: B.** Linux deliberately ignores the set-user-ID bit on scripts: the kernel will not grant privilege to an interpreter that has not itself been verified to run safely with elevated rights. The bit can be set with `chmod u+s` and will show as `s` in `ls -l`, but it does nothing for an interpreted file.

- A is wrong: The script is executable, and `chmod u+s` succeeds on it; the bit is present, it simply has no effect for the kernel to honour on a script.
- C is wrong: The sticky bit governs deletion within a directory and has no bearing on whether setuid applies to an executable script.
- D is wrong: SUID and SGID are independent bits; neither is a prerequisite for the other to take effect on an executable.

### 105.

`free -h` shows several gigabytes of swap in use on a server that otherwise seems healthy. Is that, by itself, evidence of a memory problem?

- **A.** No — swap in use and swapping in progress are different things; pages evicted hours ago and never touched since remain "used" without indicating current trouble
- **B.** Yes, any non-zero swap usage means the machine needs more RAM immediately
- **C.** No, but only because `free -h` cannot report swap usage accurately — it reads a cached total that is refreshed only when a swap device is added or removed, so the figure it prints can be arbitrarily stale on a long-running server
- **D.** Yes, and disabling swap entirely is the correct fix for a machine under any memory pressure

**Answer: A.** Swap usage is a diagnostic signal that is easy to misread. Some swap in use is normal, since the kernel evicts genuinely idle pages to free RAM for cache; what actually indicates trouble is a high rate of swap-in and swap-out happening now, which `free`'s repeated sampling (`-s`) shows better than a single snapshot.

- B is wrong: Some swap usage is normal — the kernel pages out genuinely idle memory to free RAM for cache — and does not by itself indicate a shortage.
- C is wrong: free(1) reports swap from SwapTotal and SwapFree in `/proc/meminfo`, which the kernel keeps current on every read; the difficulty is interpreting a non-zero figure, not the accuracy of the tool.
- D is wrong: Disabling swap does not remove memory pressure; it converts a slow, swapping system into one where the kernel's out-of-memory killer terminates a process instead.

### 106.

A newly created swap partition has been prepared but `swapon --show` lists nothing active, and `swapon /dev/sdb2` reports an error. What step was most likely skipped?

- **A.** The partition needs to be formatted with `mkfs -t ext4` before it can be used as swap
- **B.** An `/etc/fstab` entry must exist before `swapon` will activate any device at all
- **C.** The partition must first be added to a volume group before it can hold swap — `mkswap` refuses to write its signature to anything that is not a logical volume
- **D.** `mkswap` was never run on the device, so it has no swap signature for `swapon` to activate

**Answer: D.** Swap space is created with `mkswap`, which writes the signature `swapon` looks for, and only then activated with `swapon`. Running `swapon` on a partition that was never prepared with `mkswap` fails because there is no swap signature there for it to recognise.

- A is wrong: Swap space is not a regular filesystem and is not created with `mkfs`; it is prepared specifically with `mkswap`.
- B is wrong: A device can be activated directly with `swapon <device>` without any fstab entry; the entry is only needed for it to activate automatically at boot.
- C is wrong: mkswap(8) documents its device argument as "usually a disk partition (something like /dev/sdb7) but can also be a file"; no volume group is involved at any point.

### 107.

A file is `rwxr-xr-x` with the setgid bit already set for a shared workflow. An administrator must add write for the group without disturbing anything else, including the setgid bit. Which command is safe?

- **A.** `chmod 775 file`, since 775 already includes group write
- **B.** `umask 002` applied before the next write to the file — the mask is re-applied to a file's mode on every write, so the next write widens the group bits
- **C.** `chmod g+w file`, a symbolic clause that changes only the named bit
- **D.** `chmod -R g+w file`, adding the recursive flag for safety

**Answer: C.** Symbolic mode expresses a relative change: `g+w` adds exactly the group-write bit and leaves the rest, including the setgid special bit, untouched. A three-digit numeric mode like `775` is absolute and always clears the setuid/setgid/sticky digit unless it is explicitly included — both are forms of the same `chmod` command, and the notation chosen changes what survives.

- A is wrong: A three-digit numeric mode is absolute and rewrites all nine permission bits; on a regular file such as this one the omitted leading digit is taken as zero, silently dropping the setgid bit.
- B is wrong: A umask only affects permissions assigned to files created afterward; it has no effect on a file that already exists.
- D is wrong: Recursion is unnecessary and potentially harmful on a single file; the target here is one file, not a tree.

### 108.

An administrator runs `chmod -R 755` over a project tree that contained several setgid directories and one setgid helper binary. Which special bits survive?

- **A.** The directories keep their setgid bit but the helper binary loses its, because `chmod` preserves that bit on directories unless told otherwise
- **B.** Every special bit is cleared, on the directories and on the binary alike — an omitted leading digit is treated as zero, and that applies uniformly to every kind of file the recursion reaches
- **C.** Every special bit survives, because a three-digit numeric mode addresses only the owner, group and other triads and never touches the leading digit at all
- **D.** Only the sticky bit is affected — setuid and setgid live outside the mode word, in the inode's extended attributes

**Answer: A.** A three-digit octal mode is absolute and an omitted digit counts as a leading zero, so `chmod 755` clears setuid, setgid and sticky on a **regular file**. Directories are the exception worth memorising: `chmod` preserves a directory's set-user-ID and set-group-ID bits unless told otherwise, so a recursive `chmod 755` leaves setgid directories inheriting the shared group exactly as before. Clearing a directory's special bits numerically requires an explicit leading zero (`00755`), a leading minus (`-6000`) or a leading equals (`=755`); symbolically it is `g-s`.

- B is wrong: True of the regular file, but not of the directories; clearing a directory's setgid numerically takes an explicit `00755`, `-6000` or `=755`.
- C is wrong: The three-digit form does clear the special bits on a regular file, which is why the helper binary comes out of this with its setgid bit gone.
- D is wrong: All three special bits sit in the same mode word as the nine permission bits, as the leading octal digit of `stat -c %a`.

### 109.

A filter is set to capture severity level 3 (Error) and above. Does it also capture Warning-level messages?

- **A.** Yes, "level 3 and above" naturally includes Warning since it feels like a lesser problem than Error
- **B.** It depends on the facility the message was logged under, not the severity level — a severity filter matches only messages carrying the daemon facility
- **C.** No — severity 3 and above means levels 3, 2, 1 and 0, and Warning is level 4, a less severe level than 3
- **D.** Yes, because syslog severities count upward from least to most severe starting at 1

**Answer: C.** Syslog severity runs from Emergency (0) as most severe down to Debug (7) as least severe — the numbering is inverted from intuition. Filtering to "level 3 and above" in severity means 3, 2, 1 and 0 (Error through Emergency), which does not include Warning at level 4.

- A is wrong: Numerically, Warning (4) is a higher number than Error (3), and on this inverted scale a higher number is less severe, so it falls outside the filter.
- B is wrong: Facility identifies the source subsystem and is a separate dimension from severity; it does not change whether a given severity number is captured by this filter.
- D is wrong: The scale starts at 0 for Emergency, the most severe level, and counts upward toward less severe levels, the opposite of what this option describes.

### 110.

A badly behaved application logs routine, harmless status messages at Error severity. What is the consequence for a monitoring filter tuned to alert on Error and above?

- **A.** Nothing changes, since the logging system automatically re-classifies mislabelled messages — the severity is recomputed from the message text as it is written to the log
- **B.** It floods the filter with false alarms, because severity is a claim by the emitting program, not an assessment by the logging system
- **C.** The messages are silently dropped, since Error severity from a non-critical process is filtered out by default
- **D.** The facility field automatically corrects the severity based on which subsystem is logging

**Answer: B.** Severity is set by whichever program emits the message, not assessed independently by the logging system. A badly behaved application logging routine chatter at Error level floods any filter tuned to catch real problems at that severity, since the system has no mechanism to override the emitter's own claim.

- A is wrong: No such automatic re-classification happens; the logging system records whatever severity the emitting program attaches to a message.
- C is wrong: There is no default behaviour that drops messages based on which process emitted them; the messages pass through at the severity the application chose.
- D is wrong: Facility identifies the source subsystem and is independent of severity; it does not adjust or override the severity a message carries.

### 111.

A requirement states a service must both be running right now and still be running after every future reboot. Which single command satisfies both halves in one step?

- **A.** `systemctl enable --now nginx`, enabling the boot-time symlink and starting it immediately in one step
- **B.** `systemctl start nginx` alone, since a successful start implies it will also come back after a reboot
- **C.** `systemctl enable nginx` alone, since enabling a unit also starts it immediately — the manager reload that `enable` performs activates it
- **D.** `systemctl daemon-reload nginx`, since reloading applies both the running and boot-time state

**Answer: A.** `systemctl start` and `systemctl enable` are orthogonal: one affects the running system now, the other affects the next boot, and neither implies the other. `systemctl enable --now` is exactly the shorthand for doing both in a single command.

- B is wrong: Starting acts on the running system only and consults nothing about the next boot — a started-but-not-enabled service is simply absent after a reboot.
- C is wrong: `enable` only creates the boot-time symlink from `[Install]`. It does reload the manager configuration afterwards so the new symlink takes effect, but systemctl(1) is explicit that this 'does not have the effect of also starting any of the units being enabled'.
- D is wrong: `daemon-reload` takes no unit argument and only re-reads unit files; it neither starts a unit nor changes its boot-time activation.

### 112.

A service that was working fine for months is simply absent after an unrelated reboot — no crash, no error, nothing in the logs about it at all. What is the first command to run, and what does a result of `disabled` tell you?

- **A.** `systemctl is-active <unit>`, since an inactive result would explain why it is gone after reboot — it reports the boot-time enablement state alongside the current one
- **B.** `systemctl is-enabled <unit>`; a result of `disabled` is the entire explanation — the unit was configured and started by hand but never enabled
- **C.** `journalctl -u <unit> -b`, since a missing service always leaves an error explaining why it failed to start
- **D.** `systemctl daemon-reload`, since re-reading unit files restores services that vanished after a reboot

**Answer: B.** "The service is gone after a reboot" is diagnosed by checking `systemctl is-enabled <unit>` first. A reply of `disabled` fully explains the symptom: the service was started manually at some point and worked until the next reboot, at which point nothing pulled it back in because it was never enabled.

- A is wrong: Checking whether it is active now says nothing about why it failed to come back, and `is-active` reports only whether the unit is running; the boot-time question is answered by `is-enabled`.
- C is wrong: A unit that was simply never enabled produces no failure at all — there is nothing in the logs to find, because the unit was never even asked to start.
- D is wrong: Re-reading unit files has no bearing on whether a unit's boot-time symlink exists; it neither creates nor removes that state.

### 113.

A server needs to boot into a minimal, non-graphical state permanently from now on, not just for the next boot. Which command sets that as the standing default?

- **A.** `systemctl isolate multi-user.target`, since isolating a target makes it the new default
- **B.** `systemctl get-default multi-user.target`, since it sets the target it is given
- **C.** `runlevel 3`, the SysV-era equivalent of the same request
- **D.** `systemctl set-default multi-user.target`, rewriting the standing default target

**Answer: D.** `default.target` is a symlink naming where boot converges, and `systemctl set-default` rewrites it — a change that persists across every future boot. `systemctl get-default` reads the current setting, and `isolate` changes the running system immediately but leaves the standing default untouched.

- A is wrong: `isolate` only changes the running system right now; it does nothing about which target the next boot converges on.
- B is wrong: `get-default` only reads and prints the current default; it takes no target argument to change anything.
- C is wrong: `runlevel` only prints the previous and current SysV runlevel; it does not set anything, on this system or any other.

### 114.

To troubleshoot a graphical login failure right now, an administrator proposes `systemctl isolate rescue.target` on a production server that is currently serving traffic. What happens to units that `rescue.target` does not want?

- **A.** Nothing changes for them; `isolate` only affects graphical-session units — `rescue.target` sets `IgnoreOnIsolate=yes` for everything outside that group
- **B.** They are only stopped after the next reboot, since `isolate` schedules rather than acts immediately
- **C.** They are stopped immediately, which is disruptive on a live production server and should be done deliberately, not casually
- **D.** They are paused rather than stopped, and resume automatically once `default.target` is restored

**Answer: C.** `systemctl isolate` switches to a target immediately, starting what it wants and stopping every unit that is not part of it — on a running production server that stops real services, which is precisely why it is a disruptive command to reach for casually rather than the safer, non-immediate `set-default`.

- A is wrong: `isolate` is not scoped to graphical units: it stops every currently running unit the named target does not want, which can include production services. `IgnoreOnIsolate=` is set on the individual units that are to be spared, not by the target being isolated to.
- B is wrong: `isolate` acts on the running system immediately; it is `set-default` that only affects a future boot.
- D is wrong: `isolate` stops units outright rather than pausing them; nothing about the operation is reversible on its own.

### 115.

An administrator enables `backup.service` directly, expecting it to run on a schedule the way a cron job would. What actually happens?

- **A.** The service runs on the schedule defined by `OnCalendar=` in the paired `.timer` unit, since they are linked automatically
- **B.** Nothing happens, since `.service` units cannot be enabled without a crontab entry pointing at them
- **C.** The service starts at every boot, which is not a schedule at all; the `.timer` unit is what needed to be enabled instead
- **D.** The service is rejected by `systemctl` because it has no `OnCalendar=` directive of its own

**Answer: C.** A timer unit is paired by name with a service unit it activates on a schedule. Enabling the service instead of the timer is the standard mistake: it makes the job run at every boot, which is not a schedule — the timer, not the service, is what must be enabled to get scheduled activation. `systemctl list-timers` shows every timer with its next and last activation.

- A is wrong: Enabling the service does not consult the timer's schedule at all; only enabling the `.timer` unit itself causes activation on that schedule.
- B is wrong: A `.service` unit can be enabled on its own perfectly well; the issue is that doing so only activates it at boot, not on any recurring schedule.
- D is wrong: `OnCalendar=` belongs to the `.timer` unit, not the `.service` unit; a service unit is not expected to carry that directive and enabling it does not fail for lacking one.

### 116.

Name two advantages a systemd timer has over plain cron for a scheduled job.

- **A.** Timers are simpler to write than crontab lines, and they require no separate unit file
- **B.** Output is captured in the queryable journal rather than mailed, and a missed run can be made up with `Persistent=true`
- **C.** Timers run with a full interactive shell environment, unlike cron — the service a timer activates is started from a login shell that sources the user's profile
- **D.** Timers can run system-wide scripts, while cron is restricted to per-user jobs only — every crontab lives in a per-user spool file and cron has no system-wide table

**Answer: B.** Because a timer activates a real systemd service rather than handing a command to a shell, it inherits the manager's features automatically: output captured in the journal (queryable with `journalctl -u`), full dependency ordering, and — with `Persistent=true` — the ability to catch up on a run missed while the machine was off.

- A is wrong: A timer requires a separate `.timer` unit paired with a `.service` unit — genuinely more moving parts than a single crontab line, not fewer.
- C is wrong: The examinable advantages are journal logging, dependency handling and catch-up behaviour — a full interactive environment is not one of them.
- D is wrong: System-wide scheduled jobs exist under plain cron too, via `/etc/crontab` and `/etc/cron.d/`; that is not a capability unique to timers.

### 117.

Someone says "systemd" and "`systemctl`" as if they were interchangeable. What is the actual relationship?

- **A.** They are two names for the same running process, used interchangeably by convention
- **B.** `systemctl` is the older SysV name for what became systemd — kept on modern systems only as the `/sbin/init` compatibility symlink
- **C.** systemd is the manager process running as PID 1; `systemctl` is the client command used to control it
- **D.** systemd only manages boot; `systemctl` is the separate tool that manages running services

**Answer: C.** systemd is the init system and service manager, running as PID 1 for the life of the machine. `systemctl` is the command-line client used to query and control it. Conflating the manager with the tool used to talk to it is a common but avoidable mix-up.

- A is wrong: Only systemd itself runs as PID 1; `systemctl` is a separate, short-lived command invoked each time it is run.
- B is wrong: The older SysV-era mechanism is runlevels and `init`, not `systemctl`, which is a systemd-specific control command; the `/sbin/init` symlink points at systemd itself, not at `systemctl`.
- D is wrong: systemd itself supervises services throughout the machine's life, not only at boot; `systemctl` is simply how it is instructed either way.

### 118.

`systemd-analyze blame` names a unit that took 40 seconds to initialise during a slow boot. Is that unit necessarily the cause of the slow boot?

- **A.** Yes, the slowest unit in `blame`'s output is always what delayed the boot — `blame` reports only the units that sat on the critical chain
- **B.** No, because `blame` only measures time before the kernel finishes loading
- **C.** No, because `blame` requires `daemon-reload` to be run first to produce accurate figures
- **D.** Not necessarily — `blame` ranks duration, not delay; `systemd-analyze critical-chain` shows what actually held boot up

**Answer: D.** systemd activates units in parallel wherever the dependency graph allows, so `blame`'s ranking by duration does not show what was actually on the critical path. `systemd-analyze` alone reports the total boot time split by phase, and `systemd-analyze critical-chain` follows the ordering chain that determined when boot actually converged.

- A is wrong: Because units start in parallel wherever dependencies allow, the slowest individual unit is not automatically the one that held up the critical path; `blame` ranks every unit by its own initialisation time and does not restrict its output to the critical chain.
- B is wrong: `blame` measures each unit's own initialisation time during userspace startup, not a kernel-only phase.
- C is wrong: `blame` reads recorded startup timing from the completed boot; it has no dependency on `daemon-reload` being run beforehand.

### 119.

What does the FHS say a program may assume about the contents of `/tmp` between two separate invocations?

- **A.** Nothing, because programs must not assume anything left there is preserved between invocations
- **B.** That files it wrote there will still be present the next time it runs
- **C.** That files it wrote there are automatically backed up, since `/tmp` is world-writable
- **D.** That files it wrote there will survive a reboot, unlike `/var/tmp` — which the FHS designates as the volatile counterpart, cleared at every system boot

**Answer: A.** The FHS is explicit that programs must not assume anything in `/tmp` is preserved between invocations, and on most systems it is cleared on reboot or aged out by a cleanup service — `/var/tmp` is the FHS location for temporary data that must survive a reboot instead.

- B is wrong: That assumption is exactly what the FHS says a program must not make about `/tmp`, whose contents are treated as disposable.
- C is wrong: World-writable and backed-up are unrelated properties; nothing about `/tmp` implies any backup guarantee.
- D is wrong: The FHS assigns those roles the other way round: section 5.15 is titled "/var/tmp : Temporary files preserved between system reboots" and requires that its contents "must not be deleted when the system is booted", while it is `/tmp` whose deletion at boot is recommended.

### 120.

Two accounts are created with different usernames but the administrator accidentally assigns them the same UID. What does the kernel treat them as, for permission purposes?

- **A.** Two separate identities, because the account name is what the kernel checks
- **B.** The same identity, since the kernel enforces access by the numeric UID, not by the account name
- **C.** Two separate identities, because each has its own entry in `/etc/passwd`
- **D.** Two separate identities, distinguished by their primary group instead — when two rows share a UID the kernel falls back to the GID field to tell the accounts apart

**Answer: B.** UID 0 is root regardless of what any account sharing it is called, and more generally the kernel checks the number rather than the name. Two accounts sharing a UID are indistinguishable to every permission check the kernel makes, even though `/etc/passwd` lists them as separate rows. `id` is the command that prints the UID and GID actually in force for a given account.

- A is wrong: The name is a convenience for humans; the number is what the kernel actually enforces access against.
- C is wrong: A distinct row in the account database does not create a distinct identity if the numeric UID field is shared.
- D is wrong: The primary group affects new files created, not whose identity a process runs as.

### 121.

With `umask 022` in effect, what mode does a newly created regular file receive, given that programs typically request `0666` for a new file?

- **A.** `644`, because the umask subtracts write for group and other from the requested `666`
- **B.** `022`, because the umask is applied directly as the resulting mode
- **C.** `755`, the same result `chmod 755` would produce on the file — a umask is applied as the complement of the mode a program requests, so `022` yields `755`
- **D.** `666`, since a umask only affects directories, not regular files

**Answer: A.** A umask subtracts bits from the mode a program requests when creating a file. Programs conventionally request `0666` for a regular file, and a umask of `022` removes write from group and other, leaving `644`. The umask cannot grant permission — only remove it. The `umask` command reports or sets the current mask for a shell session.

- B is wrong: A umask is a mask of bits to remove, not the mode itself — it never becomes the file's permissions verbatim.
- C is wrong: A umask acts on future file creation and subtracts bits; `chmod 755` is an absolute, present-tense change to an existing file — the two are not interchangeable.
- D is wrong: A umask affects both files and directories created afterward; regular files are not exempt from it.

### 122.

An administrator wants to see the effective configuration of `nginx.service`, including any override applied through a drop-in file, rather than only the distribution-shipped definition. Which command shows that?

- **A.** Reading `/usr/lib/systemd/system/nginx.service` directly is sufficient, since that is where the definitive file lives
- **B.** `systemctl cat nginx.service`, which prints the vendor unit plus every applicable drop-in, each labelled with its path
- **C.** `systemctl list-units --type=service`, which lists every loaded service unit — each row naming the drop-ins currently applied to it
- **D.** `systemctl daemon-reload`, which prints the current unit definitions as it reloads them

**Answer: B.** `systemctl cat` prints the effective unit file plus every drop-in that applies to it, with each file's path shown as a comment — the way to see what is actually in effect rather than only the vendor-shipped definition under `/usr/lib/systemd/system`. `systemctl list-units` instead lists units currently loaded, not any single unit's file contents.

- A is wrong: That path holds only the distribution-shipped definition; an `/etc/systemd/system` override or a drop-in changing behaviour would not be visible there.
- C is wrong: That command lists which units are currently loaded, with their load, active and sub states and a description; it prints neither one unit's configuration nor any drop-in path.
- D is wrong: That command re-reads unit files and rebuilds the dependency graph; it does not print the unit's contents to the terminal.

### 123.

On a Debian-family system, which command actually installs newer versions of software already on the machine: `apt update` or `apt upgrade`?

- **A.** `apt update`, since "update" is the word that implies bringing software up to date
- **B.** `apt upgrade`; `apt update` only refreshes the cached repository indexes and installs nothing
- **C.** Both do the same thing, and either one may be used interchangeably — `apt upgrade` refreshes the index itself before it upgrades anything
- **D.** `apt full-upgrade`, since only the "full" variant actually installs anything

**Answer: B.** `apt update` downloads and rewrites the local repository index only; nothing on the system changes. `apt upgrade` then compares installed versions against that cache and installs newer ones — the word "update" is the trap, since it does not update any software.

- A is wrong: The name is exactly the trap here: `apt update` downloads index files only and changes nothing about installed software.
- C is wrong: They are two different operations with different effects. `apt upgrade` installs from the index exactly as it already stands and does not refresh it first, which is why `apt update` has to be run separately.
- D is wrong: `apt upgrade` already installs newer versions; `full-upgrade` is a variant that is additionally permitted to remove packages to complete the upgrade.

### 124.

A contractor needs a new Linux account for a six-month engagement. An administrator must create it, confirm the UID the system assigned it, and be ready to remove it entirely once the contract ends. Which sequence of commands does this?

- **A.** `useradd` to create the account, `id` to confirm the UID it was assigned, and `userdel` to remove it once the engagement ends
- **B.** Starting from `usermod`, on the belief that it can both create a fresh account and later adjust it, then finishing with `id` and `userdel`
- **C.** The same `useradd` and `userdel` pair, but checking the assigned UID with `whoami` in between
- **D.** Managing the whole lifecycle with `groupadd` and `groupdel` instead, still checking the UID with `id`

**Answer: A.** A named identity is created with `useradd`, its assigned UID is confirmed with `id`, and it is removed with `userdel` once no longer needed. `usermod` changes an existing account rather than creating one, and `whoami` reports the caller rather than a named account.

- B is wrong: A common slip: `usermod` only changes an account that already exists, so nothing is created by reaching for it first.
- C is wrong: `whoami` reports the identity of whoever is running the command, not the UID of the account just created.
- D is wrong: That pair manages a group, not a user account, so nothing about the contractor's login is created at all.

### 125.

Why does software compiled from source conventionally install into `/usr/local/bin` rather than `/usr/bin`?

- **A.** Because the package manager owns everything under `/usr` except `/usr/local`, and installing there avoids being silently overwritten
- **B.** Because `/usr/bin` is read-only at the filesystem level and cannot accept new files at all
- **C.** Because `/usr/local/bin` is searched earlier in `$PATH` on every distribution by default
- **D.** Because `/usr/bin` is reserved exclusively for binaries shipped with the kernel itself — the FHS lists it among the directories that must hold nothing outside the base kernel image

**Answer: A.** `/usr` is shareable and static, and package managers own everything under it except `/usr/local`, which is left alone for the local administrator. That division is exactly why software built from source conventionally installs into `/usr/local/bin` rather than risking a package update overwriting it.

- B is wrong: `/usr` being "read-only" describes the FHS convention that nothing there should change during normal operation, not a hard filesystem-level write restriction.
- C is wrong: `$PATH` ordering is a separate configuration choice and is not the reason the FHS reserves this subtree for locally built software.
- D is wrong: FHS 4.4 titles `/usr/bin` "Most user commands"; it holds ordinary user-land programs installed by the distribution's package manager and is not tied to the kernel.

### 126.

An administrator is following a live tail of a busy log with `tail -f` when the log gets rotated by `logrotate` and renamed aside. New entries stop appearing. Which command survives rotation, and why?

- **A.** `tail -f` should already handle rotation correctly, since it is designed to follow a growing log
- **B.** `tail -F`, because it follows the file by name and reopens it after a rename, rather than staying attached to the old inode
- **C.** `less +F`, since only `less` supports following a log across rotation — its F command reopens the file by name as soon as the inode behind it changes
- **D.** Neither survives rotation; the session must be restarted manually every time a log rotates

**Answer: B.** `tail -f` follows the specific file descriptor it opened, which after rotation still points at the old, now-static file under its renamed path. `tail -F` follows the *name* instead, reopening the newly created file once rotation replaces it — the option that keeps working across a rotation.

- A is wrong: `-f` stays with the original inode it opened, which is exactly what stops updating the moment the log is rotated away under a new name.
- C is wrong: less(1) says the F command behaves similarly to `tail -f`, and that without `--follow-name` less keeps displaying the original file when it is renamed; the option that specifically reopens by name is `tail -F`.
- D is wrong: `tail -F` is specifically designed to survive rotation by reopening the file under its name, so a manual restart is not required.

### 127.

A service on the host stops writing its logs and refuses to start, while every other service on the machine keeps working normally. What is the first thing to check?

- **A.** Whether `/usr` has filled up, since that is where the service's program files live
- **B.** Whether `/etc` has filled up, since that is where the service's configuration lives
- **C.** Whether the service's home directory under `/home` has filled up — daemons keep their spool and state files in the home directory of the account they run as
- **D.** Whether `/var` (or the log directory under it) has filled up, since a full `/var` is one of the most common causes of exactly this symptom

**Answer: D.** `/var` holds variable data — logs, spools, caches, application state — that grows while the system runs, and it is frequently its own partition. A full `/var` is a very common cause of service failure, and it fails in the characteristic way described: writes fail while the rest of the system keeps working.

- A is wrong: `/usr` is read-only and static under normal operation; it is `/var`, holding variable data such as logs, that characteristically fills and causes this symptom.
- B is wrong: Configuration files are small and static; `/etc` filling up is not the characteristic cause of a service failing to write its logs.
- C is wrong: A service typically has no meaningful presence under `/home`; the FHS places spool directories, logging data and application state under `/var`, which is where a daemon's growing files actually live.

### 128.

`ps` shows a process as `defunct`. What state is it in, and does sending it `kill -9` clear it?

- **A.** It is an orphan whose parent has died, and `kill -9` forces it to exit properly — an orphan keeps its terminal attachment until something signals it
- **B.** It is a zombie — already exited, waiting for its parent to reap its status — and `kill -9` does nothing to it
- **C.** It is a daemon that has lost its controlling terminal, and `kill -9` restarts it cleanly
- **D.** It is a process stuck in uninterruptible sleep, and `kill -9` will eventually succeed once I/O completes

**Answer: B.** A zombie has already exited but its parent has not yet read its exit status, so its process-table entry lingers, shown as `defunct` in `ps`. It consumes no CPU or memory and cannot be killed because it is already dead — the fix is to have the parent reap it, or wait for PID 1 to do so once the parent itself exits.

- A is wrong: An orphan is still running and has simply been re-parented to PID 1; a `defunct` entry specifically describes a zombie, which has already exited.
- C is wrong: A daemon that has detached from its terminal is running normally; `defunct` specifically marks a process that has already exited.
- D is wrong: Uninterruptible sleep is a different, still-alive state waiting on I/O; a `defunct` entry means the process has already exited.

